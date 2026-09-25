'use strict';
// Platform analyzer: walks the parts of Content Server the learner can see and
// works out which functional areas (modules) exist, so the curriculum can be
// tailored to this particular server. An area is "detected" only on evidence
// read from the server; "unknown" means the server didn't answer the question.

const { isContainer, describeFailure } = require('./cs-api');

// Volume subtypes probed on every scan. Labels are only hints; the name shown
// to the learner is always the one Content Server returns.
const VOLUMES = [
  { key: 'enterprise', subtype: 141, label: 'Enterprise Workspace' },
  { key: 'personal', subtype: 142, label: 'Personal Workspace' },
  { key: 'categories', subtype: 133, label: 'Categories Volume' },
  { key: 'classifications', subtype: 198, label: 'Classifications Volume' },
];

// Each functional area is detected from object types seen in the tree, object
// types the learner may add, or a dedicated API probe.
const FEATURES = {
  core: { label: 'Folders & documents', types: [0, 144] },
  compound: { label: 'Compound documents', types: [136], names: /compound/i },
  collections: { label: 'Collections', types: [298], names: /collection/i },
  urls: { label: 'URL items', types: [140], names: /^url$|web address/i },
  categories: { label: 'Categories & attributes' },
  classifications: { label: 'Classifications', names: /classification/i },
  virtualFolders: { label: 'Virtual folders & facets', types: [899], names: /virtual folder|facet/i },
  search: { label: 'Search' },
  permissions: { label: 'Permissions (REST)' },
  workflow: { label: 'Workflow', types: [128], names: /workflow/i },
  discussions: { label: 'Discussions', types: [215], names: /discussion/i },
  channels: { label: 'News channels', types: [207], names: /channel/i },
  taskLists: { label: 'Task lists', types: [204], names: /task ?list/i },
  polls: { label: 'Polls', types: [218], names: /poll/i },
  projects: { label: 'Projects', types: [202], names: /^project$/i },
  wikis: { label: 'Wikis', types: [5573], names: /wiki/i },
  communities: { label: 'Communities', names: /communit/i },
  email: { label: 'Email objects', types: [749, 751], names: /e-?mail/i },
  customViews: { label: 'Custom views', types: [146], names: /custom ?view/i },
  appearances: { label: 'Appearances', types: [480, 481], names: /appearance/i },
  liveReports: { label: 'LiveReports', types: [299], names: /live ?report/i },
  prospectors: { label: 'Prospectors', names: /prospector/i },
  searchForms: { label: 'Search forms', names: /search form/i },
  savedQueries: { label: 'Saved search queries', types: [258], names: /search query|saved query/i },
  records: { label: 'Records Management', names: /records|retention|disposition|\bholds?\b|\brsi\b/i },
  physical: { label: 'Physical Objects', names: /physical/i },
  businessWorkspaces: { label: 'Business Workspaces (xECM)', types: [848], names: /business ?workspace/i },
  admin: { label: 'System administration' },
};

async function pool(items, limit, fn) {
  const out = [];
  let i = 0;
  const workers = Array.from({ length: Math.max(1, limit) }, async () => {
    while (i < items.length) {
      const idx = i++;
      out[idx] = await fn(items[idx]);
    }
  });
  await Promise.all(workers);
  return out;
}

async function inventory(api, rootIds, { maxDepth, maxNodes, concurrency }) {
  const byType = new Map();
  const nodes = [];
  let frontier = rootIds.filter(Boolean);
  let containersScanned = 0;
  let unreadable = 0;
  let truncated = false;

  for (let depth = 0; depth < maxDepth && frontier.length; depth++) {
    const next = [];
    await pool(frontier, concurrency, async (id) => {
      if (nodes.length >= maxNodes) { truncated = true; return; }
      const r = await api.children(id);
      if (!r.ok) { unreadable++; return; }
      if (r.truncated) truncated = true;
      containersScanned++;
      for (const n of r.nodes) {
        if (nodes.length >= maxNodes) { truncated = true; break; }
        nodes.push(n);
        const key = Number(n.type);
        const entry = byType.get(key) || { type: key, typeName: n.type_name || `Subtype ${key}`, count: 0 };
        entry.count++;
        byType.set(key, entry);
        if (isContainer(n)) next.push(n.id);
      }
    });
    frontier = next;
  }
  if (frontier.length) truncated = true;

  return {
    nodes,
    summary: {
      total: nodes.length,
      truncated,
      containersScanned,
      unreadable,
      byType: [...byType.values()].sort((a, b) => b.count - a.count),
    },
  };
}

function privilegesOf(user) {
  const p = {};
  for (const [k, v] of Object.entries(user || {})) {
    if (k.startsWith('privilege_')) p[k.slice(10)] = v;
  }
  return p;
}

async function analyze(api, config) {
  const started = Date.now();
  const scanCfg = Object.assign({ maxDepth: 2, maxNodes: 1500, concurrency: 4 }, config.scan || {});

  const user = await api.me();
  const privileges = privilegesOf(user);
  // GET /api/v1/auth only returns privilege flags to administrators, so a
  // missing flag means the right isn't held.
  const isSysAdmin = privileges.system_admin_rights === true;
  const isUserAdmin = privileges.user_admin_rights === true || isSysAdmin;

  const [server, ...vols] = await Promise.all([
    api.serverInfo(),
    ...VOLUMES.map((v) => api.volume(v.subtype)),
  ]);

  const volumes = VOLUMES.map((v, i) => ({
    key: v.key, subtype: v.subtype, label: v.label,
    id: vols[i].ok ? vols[i].node.id : null,
    name: vols[i].ok ? vols[i].node.name : null,
    type: vols[i].ok ? Number(vols[i].node.type) : null,
    error: vols[i].ok ? null : describeFailure(vols[i]),
  }));
  const vol = Object.fromEntries(volumes.map((v) => [v.key, v]));

  // Walk the Enterprise Workspace and the Personal Workspace.
  const inv = await inventory(api, [vol.enterprise.id, vol.personal.id], scanCfg);

  const [addEnt, addPers] = await Promise.all([
    vol.enterprise.id ? api.addableTypes(vol.enterprise.id) : { ok: false },
    vol.personal.id ? api.addableTypes(vol.personal.id) : { ok: false },
  ]);
  const addableMap = new Map();
  for (const t of [...(addEnt.ok ? addEnt.types : []), ...(addPers.ok ? addPers.types : [])]) addableMap.set(t.type, t.name);
  const addable = [...addableMap].map(([type, name]) => ({ type, name })).sort((a, b) => a.name.localeCompare(b.name));

  let categories = [];
  let categoriesRead = false;
  if (vol.categories.id) {
    const all = await api.descendants(vol.categories.id, 3, 600);
    categoriesRead = all.ok;
    if (all.ok) categories = all.nodes.filter((n) => Number(n.type) === 131).map((n) => ({ id: n.id, name: n.name }));
  }

  let classificationTrees = [];
  const classifVolOk = !!vol.classifications.id && vol.classifications.type === 198;
  if (classifVolOk) {
    const r = await api.children(vol.classifications.id);
    if (r.ok) classificationTrees = r.nodes.map((n) => ({ id: n.id, name: n.name }));
  }

  const workflowMaps = inv.nodes.filter((n) => Number(n.type) === 128).map((n) => ({ id: n.id, name: n.name }));

  const [memberOf, dept, favorites, assignments, bwTypes, search, perms] = await Promise.all([
    api.myGroups(),
    user.group_id ? api.member(user.group_id) : { ok: false },
    api.favorites(),
    api.assignments(),
    api.businessWorkspaceTypes(),
    api.searchWorks(),
    vol.personal.id ? api.permissions(vol.personal.id) : { ok: false },
  ]);

  // ---- feature detection ----
  const invTypes = new Set(inv.nodes.map((n) => Number(n.type)));
  const invNames = [...new Set(inv.nodes.map((n) => n.type_name).filter(Boolean))];
  const features = {};
  for (const [key, f] of Object.entries(FEATURES)) {
    const evidence = [];
    if (f.types) {
      for (const t of f.types) {
        if (addableMap.has(t)) evidence.push(`You can add "${addableMap.get(t)}" items`);
        if (invTypes.has(t)) evidence.push(`${inv.nodes.filter((n) => Number(n.type) === t).length} item(s) of subtype ${t} found`);
      }
    }
    if (f.names) {
      for (const a of addable) if (f.names.test(a.name) && !(f.types || []).includes(a.type)) evidence.push(`You can add "${a.name}" items`);
      for (const nm of invNames) if (f.names.test(nm) && !(f.types || []).some((t) => inv.nodes.some((n) => Number(n.type) === t && n.type_name === nm))) evidence.push(`"${nm}" items found`);
    }
    features[key] = { key, label: f.label, status: evidence.length ? 'detected' : 'not-detected', evidence };
  }

  if (!features.core.evidence.length) {
    features.core.status = 'unknown';
    features.core.evidence = ['I could not read any folders or documents, or which item types you may add'];
  }
  features.categories.status = categories.length ? 'detected' : categoriesRead ? 'not-detected' : 'unknown';
  features.categories.evidence = categories.length
    ? [`${categories.length} categor${categories.length === 1 ? 'y' : 'ies'} visible to you`]
    : [categoriesRead ? 'Categories volume readable, but no categories are visible to you' : `Categories volume not readable${vol.categories.error ? ` (${vol.categories.error})` : ''}`];

  if (classifVolOk) {
    features.classifications.status = 'detected';
    features.classifications.evidence.unshift(`Classifications volume "${vol.classifications.name}" with ${classificationTrees.length} top-level item(s)`);
  }
  features.search.status = search.ok ? 'detected' : 'unknown';
  features.search.evidence = [search.ok ? 'The search API answered' : `The search API did not answer: ${describeFailure(search)}`];
  features.permissions.status = perms.ok ? 'detected' : 'unknown';
  features.permissions.evidence = [perms.ok ? 'Permissions can be read through the REST API, so permission missions are checked on the server'
    : `Permissions could not be read${perms.endpoint ? `: ${describeFailure(perms)}` : ''} — permission missions can't be verified here`];
  if (bwTypes.ok) {
    features.businessWorkspaces.status = 'detected';
    features.businessWorkspaces.evidence.unshift(`${bwTypes.count} business workspace type(s) configured`);
  }
  features.admin.status = isSysAdmin ? 'detected' : 'not-detected';
  features.admin.evidence = [isSysAdmin ? 'You hold System Administration rights' : 'You do not hold System Administration rights — admin missions will be theory + quizzes'];

  const groups = memberOf.ok ? memberOf.groups.map((g) => ({ id: g.id, name: g.name })) : [];

  const scan = {
    scannedAt: new Date().toISOString(),
    durationMs: Date.now() - started,
    server: { url: api.client.baseUrl, version: server.ok ? server.version : null },
    user: {
      id: user.id,
      name: user.name,
      displayName: [user.first_name, user.last_name].filter(Boolean).join(' ') || user.name,
      groupId: user.group_id || null,
      departmentName: dept.ok ? dept.member.name : null,
      isSysAdmin,
      isUserAdmin,
      privileges,
    },
    volumes,
    inventory: inv.summary,
    addable,
    categories,
    classificationTrees,
    workflowMaps,
    groups,
    counts: {
      favorites: favorites.ok ? favorites.ids.size : null,
      assignments: assignments.ok ? assignments.count : null,
      businessWorkspaceTypes: bwTypes.ok ? bwTypes.count : null,
    },
    features,
  };
  scan.notes = teacherNotes(scan);
  return scan;
}

function teacherNotes(s) {
  const notes = [];
  const f = s.features;
  const detected = Object.values(f).filter((x) => x.status === 'detected').length;
  notes.push(`I looked through ${s.inventory.total} items in ${s.inventory.containersScanned} containers on ${s.server.url} and recognised ${detected} of ${Object.keys(f).length} functional areas.`);
  if (s.server.version) notes.push(`This server reports version ${s.server.version}.`);
  if (s.inventory.unreadable) notes.push(`${s.inventory.unreadable} container(s) refused to list their contents, so I couldn't look inside them.`);
  if (s.categories.length) notes.push(`There ${s.categories.length === 1 ? 'is 1 category' : `are ${s.categories.length} categories`} you can use; metadata lessons will suggest "${s.categories[0].name}".`);
  else notes.push('I could not see any categories. Ask a Knowledge Manager for one, or create your own in the metadata module if you have the rights.');
  if (s.workflowMaps.length) notes.push(`I found ${s.workflowMaps.length} workflow map(s), e.g. "${s.workflowMaps[0].name}", so you can practise starting workflows.`);
  else notes.push('No workflow maps are visible to you in the scanned area, so the workflow lessons start with theory.');
  if (f.businessWorkspaces.status === 'detected') notes.push('Extended ECM business workspaces are configured here, so the xECM lessons include live exercises.');
  if (s.user.isSysAdmin) notes.push('You hold System Administration rights, so the class roster is open to you.');
  const missing = Object.values(f).filter((x) => x.status === 'not-detected').map((x) => x.label);
  if (missing.length) notes.push(`Not seen on this server (yet): ${missing.slice(0, 6).join(', ')}${missing.length > 6 ? '…' : ''}. Lessons for these stay available as theory and quizzes.`);
  if (s.inventory.truncated) notes.push('The workspace is large, so I sampled it. Raise scan.maxDepth or scan.maxNodes in config.json to look deeper.');
  return notes;
}

module.exports = { analyze, FEATURES };
