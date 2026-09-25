'use strict';
// A small in-memory imitation of the Content Server REST API, used by
// `--demo` mode and the automated tests. It mimics the JSON shapes of the
// v1/v2 endpoints the trainer reads. It is NOT a faithful emulator: real
// servers differ in details, which is why the trainer's API layer is lenient.
//
// It also accepts a few write calls (create node, add version, etc.) so tests
// can play the learner's part.

const http = require('http');
const crypto = require('crypto');
const { URL } = require('url');

const TYPE_NAMES = {
  0: 'Folder', 1: 'Shortcut', 2: 'Generation', 128: 'Workflow Map', 130: 'Topic', 131: 'Category',
  132: 'Category Folder', 133: 'Categories Volume', 136: 'Compound Document', 140: 'URL',
  141: 'Enterprise Workspace', 142: 'Personal Workspace', 144: 'Document', 145: 'Text Document',
  146: 'Custom View', 198: 'Classifications Volume', 199: 'Classification', 202: 'Project', 204: 'Task List',
  206: 'Task', 207: 'Channel', 208: 'News', 215: 'Discussion', 218: 'Poll', 258: 'Search Query',
  298: 'Collection', 299: 'LiveReport', 480: 'Appearance', 749: 'Email', 899: 'Virtual Folder',
  5573: 'Wiki', 5574: 'Wiki Page',
};
const CONTAINERS = new Set([0, 128, 131, 132, 133, 136, 141, 142, 198, 199, 202, 204, 207, 215, 298, 5573]);
const ADDABLE = [0, 1, 128, 136, 140, 144, 145, 146, 202, 204, 207, 215, 218, 258, 298, 5573];
const ALL_PERMS = ['see', 'see_contents', 'modify', 'edit_attributes', 'add_items', 'reserve', 'delete_versions', 'delete', 'edit_permissions'];

function createState() {
  const s = {
    nodes: new Map(), users: new Map(), groups: new Map(), tickets: new Map(),
    favorites: new Map(), initiated: new Map(), assignments: new Map(), nextId: 9000,
  };

  const addUser = (id, name, first, last, groupId, sysadmin = false) => {
    s.users.set(id, {
      id, name, first_name: first, last_name: last, group_id: groupId, type: 0, type_name: 'User',
      privilege_login: true, privilege_public_access: true, privilege_modify_users: sysadmin,
      privilege_modify_groups: sysadmin, privilege_user_admin_rights: sysadmin, privilege_system_admin_rights: sysadmin,
    });
  };
  const addGroup = (id, name, members) => s.groups.set(id, { id, name, type: 1, type_name: 'Group', members: new Set(members) });

  addGroup(1100, 'DefaultGroup', [1000]);
  addGroup(1101, 'Business Administrators', [1000]);
  addGroup(1102, 'Sales', [1003]);
  addGroup(1103, 'Trainees', [1001, 1002]);
  addUser(1000, 'Admin', 'Admin', '', 1100, true);
  addUser(1001, 'demo', 'Dana', 'Demo', 1103);
  addUser(1002, 'student', 'Sam', 'Student', 1103);
  addUser(1003, 'jsmith', 'Jo', 'Smith', 1102);

  const now = () => new Date().toISOString();
  s.add = (props, ownerId = 1000) => {
    const id = props.id || s.nextId++;
    const parent = props.parent_id ? s.nodes.get(Number(props.parent_id)) : null;
    const type = Number(props.type);
    const perms = parent
      ? parent.perms.map((p) => (p.type === 'owner' ? { ...p, right_id: ownerId } : { ...p }))
      : [{ type: 'owner', right_id: ownerId, permissions: ALL_PERMS }];
    const n = {
      id, name: props.name, type, type_name: TYPE_NAMES[type] || `Subtype ${type}`,
      parent_id: parent ? parent.id : -1, container: CONTAINERS.has(type),
      description: props.description || '', nickname: props.nickname || String(id),
      create_date: now(), modify_date: now(), owner_user_id: ownerId,
      reserved: false, reserved_user_id: 0, mime_type: props.mime_type || null, size: props.size || 0,
      url: props.url, original_id: props.original_id ? Number(props.original_id) : undefined,
      versions: type === 144 || type === 145 ? [{ version_number: 1, create_date: now() }] : [],
      categories: new Set(), classifications: new Set(), perms, deleted: false,
    };
    s.nodes.set(id, n);
    return n;
  };

  // --- Enterprise tree ---
  s.add({ id: 2000, name: 'Enterprise Workspace', type: 141 });
  const ent = s.nodes.get(2000);
  ent.perms.push({ type: 'group', right_id: 1100, permissions: ['see', 'see_contents'] });
  ent.perms.push({ type: 'public', right_id: -1, permissions: ['see', 'see_contents'] });
  s.add({ id: 2010, name: 'Human Resources', type: 0, parent_id: 2000 });
  s.add({ id: 2011, name: 'Employee Handbook.pdf', type: 144, parent_id: 2010, mime_type: 'application/pdf' });
  s.add({ id: 2012, name: 'Policies', type: 0, parent_id: 2010 });
  s.add({ id: 2013, name: 'Travel Policy.docx', type: 144, parent_id: 2012, mime_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
  s.add({ id: 2020, name: 'Sales', type: 0, parent_id: 2000 });
  s.add({ id: 2021, name: 'Q3 Pipeline.xlsx', type: 144, parent_id: 2020, mime_type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  s.add({ id: 2022, name: 'Sales Team Talk', type: 215, parent_id: 2020 });
  s.add({ id: 2023, name: 'Welcome to the discussion', type: 130, parent_id: 2022 });
  s.add({ id: 2030, name: 'Engineering', type: 0, parent_id: 2000 });
  s.add({ id: 2031, name: 'Website Relaunch', type: 202, parent_id: 2030 });
  s.add({ id: 2032, name: 'Release Checklist', type: 204, parent_id: 2030 });
  s.add({ id: 2033, name: 'Architecture Guide', type: 136, parent_id: 2030 });
  s.add({ id: 2040, name: 'Process Library', type: 0, parent_id: 2000 });
  s.add({ id: 2041, name: 'Document Approval', type: 128, parent_id: 2040 });
  s.add({ id: 2042, name: 'Invoice Review', type: 128, parent_id: 2040 });
  s.add({ id: 2050, name: 'Company News', type: 207, parent_id: 2000 });

  // --- Categories & classifications ---
  s.add({ id: 2001, name: 'Categories', type: 133 });
  s.add({ id: 2101, name: 'Contract', type: 131, parent_id: 2001 });
  s.add({ id: 2102, name: 'Project Info', type: 131, parent_id: 2001 });
  s.add({ id: 2103, name: 'HR Record', type: 131, parent_id: 2001 });
  s.add({ id: 2002, name: 'Classifications', type: 198 });
  s.add({ id: 2201, name: 'Subjects', type: 199, parent_id: 2002 });
  s.add({ id: 2202, name: 'Departments', type: 199, parent_id: 2002 });

  s.assignments.set(1001, [{ id: 1, name: 'Review: Travel Policy' }, { id: 2, name: 'Approve: Q3 Pipeline' }]);
  return s;
}

function personalOf(s, userId) {
  const id = 5000 + userId;
  if (!s.nodes.has(id)) s.add({ id, name: 'Personal Workspace', type: 142 }, userId);
  return s.nodes.get(id);
}

// The "demo" user starts part-way through the course so the demo shows passes and fails.
function seedDemo(s) {
  const pw = personalOf(s, 1001);
  const sb = s.add({ name: 'OT Academy', type: 0, parent_id: pw.id }, 1001);
  const drafts = s.add({ name: '01 Drafts', type: 0, parent_id: sb.id }, 1001);
  s.add({ name: '02 Review', type: 0, parent_id: sb.id }, 1001);
  s.add({ name: '03 Final', type: 0, parent_id: sb.id }, 1001);
  s.add({ name: 'Project Plan.docx', type: 144, parent_id: drafts.id, mime_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', size: 24000 }, 1001);
}

const pub = (n) => {
  const { versions, categories, classifications, perms, deleted, ...rest } = n;
  return rest;
};

function createMockCS({ seed = true, version = '16.2.4 (mock)' } = {}) {
  const s = createState();
  if (seed) seedDemo(s);

  const send = (res, status, body) => {
    const text = JSON.stringify(body);
    res.writeHead(status, { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(text) });
    res.end(text);
  };

  const readBody = (req) => new Promise((resolve) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8');
      if (!raw) return resolve({});
      if ((req.headers['content-type'] || '').includes('json')) {
        try { return resolve(JSON.parse(raw)); } catch { return resolve({}); }
      }
      resolve(Object.fromEntries(new URLSearchParams(raw)));
    });
  });

  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, 'http://mock');
    const path = url.pathname.replace(/^\/otcs\/cs\.exe/, '');
    const q = url.searchParams;
    const body = req.method === 'GET' ? {} : await readBody(req);
    const ticket = req.headers.otcsticket;
    const userId = ticket ? s.tickets.get(ticket) : null;
    const user = userId ? s.users.get(userId) : null;
    if (ticket && user) res.setHeader('OTCSTicket', ticket);

    const live = (id) => { const n = s.nodes.get(Number(id)); return n && !n.deleted ? n : null; };
    const notFound = () => send(res, 404, { error: 'Could not access the item.' });
    let m;

    // ---- public endpoints ----
    if (req.method === 'POST' && path === '/api/v1/auth') {
      const name = String(body.username || '').trim();
      if (!name || !body.password || body.password === 'wrong') return send(res, 401, { error: 'Invalid username/password specified.' });
      let u = [...s.users.values()].find((x) => x.name.toLowerCase() === name.toLowerCase());
      if (!u) {
        const id = 1100 + s.users.size + 50;
        s.users.set(id, { ...s.users.get(1002), id, name, first_name: name, last_name: '' });
        s.groups.get(1103).members.add(id);
        u = s.users.get(id);
      }
      personalOf(s, u.id);
      const t = crypto.randomBytes(16).toString('hex');
      s.tickets.set(t, u.id);
      return send(res, 200, { ticket: t });
    }
    if (req.method === 'GET' && path === '/api/v1/serverinfo') return send(res, 200, { server: { version, language_code: 'USA' } });

    if (!user) return send(res, 401, { error: 'Authentication required' });

    // ---- reads ----
    if (req.method === 'GET') {
      if (path === '/api/v1/auth') return send(res, 200, { data: user });
      if ((m = /^\/api\/v[12]\/volumes\/(\d+)$/.exec(path))) {
        const map = { 141: 2000, 133: 2001, 198: 2002 };
        const n = m[1] === '142' ? personalOf(s, user.id) : live(map[m[1]]);
        return n ? send(res, 200, { data: pub(n) }) : notFound();
      }
      if ((m = /^\/api\/v1\/nodes\/(\d+)$/.exec(path))) { const n = live(m[1]); return n ? send(res, 200, { data: pub(n) }) : notFound(); }
      if ((m = /^\/api\/v2\/nodes\/(\d+)$/.exec(path))) { const n = live(m[1]); return n ? send(res, 200, { results: { data: { properties: pub(n) } } }) : notFound(); }
      if ((m = /^\/api\/(v[12])\/nodes\/(\d+)\/nodes$/.exec(path))) {
        if (!live(m[2])) return notFound();
        const kids = [...s.nodes.values()].filter((n) => n.parent_id === Number(m[2]) && !n.deleted);
        const limit = Number(q.get('limit') || 25);
        const page = Number(q.get('page') || 1);
        const slice = kids.slice((page - 1) * limit, page * limit).map(pub);
        if (m[1] === 'v1') return send(res, 200, { data: slice, page, limit, total_count: kids.length, page_total: Math.ceil(kids.length / limit) });
        return send(res, 200, { results: slice.map((p) => ({ data: { properties: p } })), collection: { paging: { page, limit, total_count: kids.length } } });
      }
      if ((m = /^\/api\/v[12]\/nodes\/(\d+)\/versions$/.exec(path))) { const n = live(m[1]); return n ? send(res, 200, { data: n.versions }) : notFound(); }
      if ((m = /^\/api\/v2\/nodes\/(\d+)\/categories$/.exec(path))) {
        const n = live(m[1]);
        if (!n) return notFound();
        return send(res, 200, {
          results: [...n.categories].map((cid) => ({
            data: { categories: { [`${cid}_1`]: s.nodes.get(cid).name, [`${cid}_2`]: 'value' } },
            metadata: { categories: { [cid]: { name: s.nodes.get(cid).name }, [`${cid}_2`]: { name: 'Attribute' } } },
          })),
        });
      }
      if ((m = /^\/api\/v2\/nodes\/(\d+)\/permissions$/.exec(path))) {
        const n = live(m[1]);
        return n ? send(res, 200, { results: n.perms.map((p) => ({ data: { permissions: p } })) }) : notFound();
      }
      if ((m = /^\/api\/v1\/nodes\/(\d+)\/addablenodetypes$/.exec(path))) {
        const data = {}; const definitions = {};
        for (const t of ADDABLE) { const key = TYPE_NAMES[t].toLowerCase().replace(/\s/g, '_'); data[key] = `api/v1/forms/nodes/create?type=${t}`; definitions[key] = { name: TYPE_NAMES[t], type: t }; }
        return send(res, 200, { data, definitions });
      }
      if ((m = /^\/api\/v1\/nodes\/(\d+)\/classifications$/.exec(path))) {
        const n = live(m[1]);
        return n ? send(res, 200, { data: [...n.classifications].map((cid) => ({ id: cid, name: s.nodes.get(cid).name })) }) : notFound();
      }
      if (path === '/api/v2/members/favorites') {
        const ids = [...(s.favorites.get(user.id) || [])].filter((id) => live(id));
        return send(res, 200, { results: ids.map((id) => ({ data: { properties: pub(s.nodes.get(id)) } })) });
      }
      if (path === '/api/v2/members/assignments') return send(res, 200, { results: (s.assignments.get(user.id) || []).map((a) => ({ data: { assignments: a } })) });
      if ((m = /^\/api\/v[12]\/members\/(\d+)$/.exec(path))) {
        const x = s.users.get(Number(m[1])) || s.groups.get(Number(m[1]));
        if (!x) return notFound();
        const { members, ...props } = x;
        return send(res, 200, { results: { data: { properties: props } } });
      }
      if ((m = /^\/api\/v[12]\/members\/(\d+)\/memberof$/.exec(path))) {
        const gs = [...s.groups.values()].filter((g) => g.members.has(Number(m[1])));
        return send(res, 200, { results: gs.map(({ members, ...g }) => ({ data: { properties: g } })) });
      }
      if ((m = /^\/api\/v[12]\/members\/(\d+)\/members$/.exec(path))) {
        const g = s.groups.get(Number(m[1]));
        if (!g) return notFound();
        return send(res, 200, { results: [...g.members].map((id) => ({ data: { properties: s.users.get(id) || s.groups.get(id) } })).filter((r) => r.data.properties) });
      }
      if (/^\/api\/v[12]\/members$/.test(path)) {
        const text = (q.get('query') || q.get('where_name') || '').toLowerCase();
        const gs = [...s.groups.values()].filter((g) => g.name.toLowerCase().includes(text));
        return send(res, 200, { results: gs.map(({ members, ...g }) => ({ data: { properties: g } })) });
      }
      if (path === '/api/v2/workflows/status') return send(res, 200, { results: (s.initiated.get(user.id) || []).map((w) => ({ data: w })) });
      if (path === '/api/v2/search') return send(res, 200, { results: [], collection: { paging: { total_count: 0 } } });
      return send(res, 404, { error: `No mock for GET ${path}` });
    }

    // ---- writes (learner simulation) ----
    if (req.method === 'POST' && path === '/api/v1/nodes') {
      const parent = live(body.parent_id);
      if (!parent) return send(res, 400, { error: 'Bad parent' });
      const n = s.add(body, user.id);
      return send(res, 200, { id: n.id });
    }
    if (req.method === 'POST' && (m = /^\/api\/v1\/nodes\/(\d+)\/versions$/.exec(path))) {
      const n = live(m[1]);
      if (!n) return notFound();
      n.versions.push({ version_number: n.versions.length + 1, create_date: new Date().toISOString() });
      return send(res, 200, { ok: true });
    }
    if (req.method === 'PUT' && (m = /^\/api\/v1\/nodes\/(\d+)$/.exec(path))) {
      const n = live(m[1]);
      if (!n) return notFound();
      for (const k of ['name', 'description', 'nickname']) if (body[k] !== undefined) n[k] = body[k];
      if (body.reserved !== undefined) { n.reserved = String(body.reserved) === 'true'; n.reserved_user_id = n.reserved ? user.id : 0; }
      if (body.parent_id !== undefined) n.parent_id = Number(body.parent_id);
      return send(res, 200, { ok: true });
    }
    if (req.method === 'DELETE' && (m = /^\/api\/v1\/nodes\/(\d+)$/.exec(path))) {
      const n = live(m[1]);
      if (!n) return notFound();
      n.deleted = true;
      return send(res, 200, { ok: true });
    }
    if (req.method === 'POST' && (m = /^\/mock\/favorites\/(\d+)$/.exec(path))) {
      if (!s.favorites.has(user.id)) s.favorites.set(user.id, new Set());
      s.favorites.get(user.id).add(Number(m[1]));
      return send(res, 200, { ok: true });
    }
    if (req.method === 'POST' && (m = /^\/mock\/nodes\/(\d+)\/categories\/(\d+)$/.exec(path))) {
      const n = live(m[1]);
      if (!n) return notFound();
      n.categories.add(Number(m[2]));
      for (const c of s.nodes.values()) if (c.parent_id === n.id && !c.deleted && body.inherit) c.categories.add(Number(m[2]));
      return send(res, 200, { ok: true });
    }
    if (req.method === 'POST' && (m = /^\/mock\/nodes\/(\d+)\/permissions$/.exec(path))) {
      const n = live(m[1]);
      if (!n) return notFound();
      n.perms.push({ type: body.type || 'custom', right_id: Number(body.right_id), permissions: body.permissions || ['see', 'see_contents'] });
      return send(res, 200, { ok: true });
    }
    if (req.method === 'DELETE' && (m = /^\/mock\/nodes\/(\d+)\/permissions\/public$/.exec(path))) {
      const n = live(m[1]);
      if (!n) return notFound();
      n.perms = n.perms.filter((p) => p.type !== 'public');
      return send(res, 200, { ok: true });
    }
    if (req.method === 'POST' && (m = /^\/mock\/nodes\/(\d+)\/classifications\/(\d+)$/.exec(path))) {
      const n = live(m[1]);
      if (!n) return notFound();
      n.classifications.add(Number(m[2]));
      return send(res, 200, { ok: true });
    }
    if (req.method === 'POST' && path === '/mock/workflows/initiate') {
      if (!s.initiated.has(user.id)) s.initiated.set(user.id, []);
      s.initiated.get(user.id).push({ name: body.name || 'Workflow', status: 'ontime' });
      return send(res, 200, { ok: true });
    }
    if (req.method === 'POST' && path === '/mock/groups') {
      const id = 1200 + s.groups.size;
      s.groups.set(id, { id, name: body.name, type: 1, type_name: 'Group', members: new Set((body.members || []).map(Number)) });
      return send(res, 200, { id });
    }
    return send(res, 404, { error: `No mock for ${req.method} ${path}` });
  });

  return { server, state: s };
}

module.exports = { createMockCS, TYPE_NAMES };
