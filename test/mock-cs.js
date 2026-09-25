'use strict';
// TEST FIXTURE ONLY — never started by the trainer. test/smoke.js uses it to
// play both Content Server and the learner.
//
// A small in-memory imitation of the Content Server REST API. Endpoints,
// parameters, response shapes and error codes follow OpenText's published
// OpenAPI description of the v1/v2 API, including the parts that trip up a
// naive client:
//   - a node that doesn't exist (or was deleted) answers HTTP 400
//     "Could not get a node for {id}"; browsing a missing container answers 500
//   - v2 node properties carry no original_id, nickname, mime_type or url;
//     original_id is only in v1, nicknames have their own endpoint, the MIME
//     type is on each version
//   - privilege_* flags in GET /api/v1/auth are only returned to administrators
//   - hidden items are only listed with show_hidden=true
//   - deleted items go to the Recycle Bin (GET /api/v2/volumes/recyclebin/nodes)
//   - group membership of the signed-in user is GET /api/v2/members/memberof
//   - workflow status is filtered with Kind (capital K) and wstatus
//   - category names in v2 are only returned with ?metadata
//   - an endpoint the server doesn't have answers 400 "The REST API URL could
//     not be found in the mappings registry"
//
// It also accepts a few write calls (create node, add version, …) so the test
// can do the learner's work.

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
const NOT_MAPPED = 'The REST API URL could not be found in the mappings registry';
const WF_STATUSES = ['ontime', 'workflowlate', 'completed', 'stopped'];

function createState() {
  const s = {
    nodes: new Map(), users: new Map(), groups: new Map(), tickets: new Map(),
    favorites: new Map(), workflows: [], assignments: new Map(), nextId: 9000,
    // Paths answered like a server without that module (xECM is not installed here).
    unsupported: [/^\/api\/v2\/businessworkspacetypes$/],
    // Paths that fail with an internal server error (to test that errors never pass).
    broken: [],
    // Every request for an endpoint this mock doesn't implement; the test expects none.
    unknown: [],
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
  addGroup(1103, 'Trainees', [1002]);
  addUser(1000, 'Admin', 'Admin', '', 1100, true);
  addUser(1002, 'student', 'Sam', 'Student', 1103);
  addUser(1003, 'jsmith', 'Jo', 'Smith', 1102);

  const now = () => new Date().toISOString();
  s.add = (props, ownerId = 1000) => {
    const id = props.id || s.nextId++;
    const parent = props.parent_id ? s.nodes.get(Number(props.parent_id)) : null;
    const type = Number(props.type);
    const perms = parent
      ? parent.perms.map((p) => (p.type === 'owner' ? { ...p, right_id: ownerId } : { ...p, permissions: [...p.permissions] }))
      : [{ type: 'owner', right_id: ownerId, permissions: ALL_PERMS }];
    const versioned = type === 144 || type === 145;
    const n = {
      id, name: props.name, type, parent_id: parent ? parent.id : -1, volume_id: parent ? parent.volume_id : -id,
      description: props.description || '', nickname: String(id), hidden: !!props.hidden,
      create_date: now(), modify_date: now(), owner_user_id: ownerId,
      owner_group_id: (s.users.get(ownerId) || {}).group_id || 1100,
      reserved: false, reserved_user_id: 0, size: props.size || 0,
      url: props.url, original_id: props.original_id ? Number(props.original_id) : undefined,
      versions: versioned ? [{ version_number: 1, create_date: now(), mime_type: props.mime_type || 'application/octet-stream', file_name: props.name }] : [],
      categories: new Set(), classifications: new Set(), perms, deleted: null,
    };
    s.nodes.set(id, n);
    return n;
  };

  // --- Enterprise tree ---
  s.add({ id: 2000, name: 'Enterprise Workspace', type: 141 });
  const ent = s.nodes.get(2000);
  ent.perms.push({ type: 'group', right_id: 1100, permissions: ['see', 'see_contents'] });
  ent.perms.push({ type: 'public', right_id: null, permissions: ['see', 'see_contents'] });
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

  s.assignments.set(1002, [{ id: 1, name: 'Review: Travel Policy' }, { id: 2, name: 'Approve: Q3 Pipeline' }]);
  return s;
}

function personalOf(s, userId) {
  const id = 5000 + userId;
  if (!s.nodes.has(id)) s.add({ id, name: 'Personal Workspace', type: 142 }, userId);
  return s.nodes.get(id);
}

const typeName = (n) => TYPE_NAMES[n.type] || `Subtype ${n.type}`;
const common = (n) => ({
  id: n.id, parent_id: n.parent_id, volume_id: n.volume_id, name: n.name, type: n.type, type_name: typeName(n),
  description: n.description, create_date: n.create_date, modify_date: n.modify_date, container: CONTAINERS.has(n.type),
  hidden: n.hidden, reserved: n.reserved, reserved_user_id: n.reserved_user_id, owner_user_id: n.owner_user_id, size: n.size,
});
// v1 node data (documented nodes_Data / nodes_NodeInfo): includes original_id.
const v1 = (n) => ({ ...common(n), original_id: n.original_id, owner_group_id: n.owner_group_id });
// v2 properties (documented nodes_V2Properties): no original_id, nickname, mime_type or url.
const v2 = (n) => ({ ...common(n), owner_group_id: n.owner_group_id });

function userOut(u, viewer) {
  const out = { ...u };
  // Privilege flags are only available to Administrators or User Administrators.
  if (!(viewer.privilege_system_admin_rights || viewer.privilege_user_admin_rights)) {
    for (const k of Object.keys(out)) if (k.startsWith('privilege_')) delete out[k];
  }
  return out;
}
const groupOut = ({ members, ...g }) => g;

function paged(list, q) {
  const limit = Math.max(1, Number(q.get('limit') || 25));
  const page = Math.max(1, Number(q.get('page') || 1));
  return { slice: list.slice((page - 1) * limit, page * limit), paging: { page, limit, total_count: list.length, page_total: Math.ceil(list.length / limit) } };
}

function createMockCS({ version = '16.2.4' } = {}) {
  const s = createState();

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
    const noNode = (id) => send(res, 400, { error: `Could not get a node for ${id}` });
    let m;

    if (s.broken.some((re) => re.test(path))) return send(res, 500, { error: 'Internal error while processing the request' });
    if (s.unsupported.some((re) => re.test(path))) return send(res, 400, { error: NOT_MAPPED });

    // ---- public endpoints ----
    if (req.method === 'POST' && path === '/api/v1/auth') {
      const name = String(body.username || '').trim();
      const u = [...s.users.values()].find((x) => x.name.toLowerCase() === name.toLowerCase());
      if (!u || !body.password || body.password === 'wrong') return send(res, 401, { error: 'Invalid username/password specified.' });
      personalOf(s, u.id);
      const t = crypto.randomBytes(16).toString('hex');
      s.tickets.set(t, u.id);
      return send(res, 200, { ticket: t });
    }
    if (req.method === 'GET' && path === '/api/v1/serverinfo') return send(res, 200, { server: { version, language_code: 'USA', url: 'http://mock/otcs/cs.exe' } });

    if (!user) return send(res, 401, { error: 'Authentication required' });

    // ---- reads ----
    if (req.method === 'GET') {
      if (path === '/api/v1/auth') return send(res, 200, { data: userOut(user, user) });
      if ((m = /^\/api\/(v[12])\/volumes\/(\d+)$/.exec(path))) {
        const map = { 141: 2000, 133: 2001, 198: 2002 };
        const n = m[2] === '142' ? personalOf(s, user.id) : live(map[m[2]]);
        if (!n) return send(res, 500, { error: `Subtype ${m[2]} not registered` });
        return m[1] === 'v1' ? send(res, 200, { data: v1(n), type: n.type, type_name: typeName(n) }) : send(res, 200, { results: { data: { properties: v2(n) } } });
      }
      if ((m = /^\/api\/v1\/nodes\/(\d+)$/.exec(path))) { const n = live(m[1]); return n ? send(res, 200, { data: v1(n) }) : noNode(m[1]); }
      if ((m = /^\/api\/v2\/nodes\/(\d+)$/.exec(path))) { const n = live(m[1]); return n ? send(res, 200, { results: { data: { properties: v2(n) } } }) : noNode(m[1]); }
      if ((m = /^\/api\/(v[12])\/nodes\/(\d+)\/nodes$/.exec(path))) {
        if (!live(m[2])) return send(res, 500, { error: `Could not get a node for ${m[2]}` });
        const showHidden = q.get('show_hidden') === 'true';
        const kids = [...s.nodes.values()].filter((n) => n.parent_id === Number(m[2]) && !n.deleted && (showHidden || !n.hidden));
        const { slice, paging } = paged(kids, q);
        if (m[1] === 'v1') return send(res, 200, { data: slice.map(v1), ...paging, range_min: 1, range_max: slice.length });
        return send(res, 200, { results: slice.map((n) => ({ data: { properties: v2(n) } })), collection: { paging } });
      }
      if ((m = /^\/api\/v1\/nodes\/(\d+)\/versions$/.exec(path))) { const n = live(m[1]); return n ? send(res, 200, { data: n.versions }) : noNode(m[1]); }
      if ((m = /^\/api\/v2\/nodes\/(\d+)\/versions$/.exec(path))) { const n = live(m[1]); return n ? send(res, 200, { results: n.versions.map((v) => ({ data: { versions: v } })) }) : noNode(m[1]); }
      if ((m = /^\/api\/v1\/nodes\/(\d+)\/categories$/.exec(path))) {
        const n = live(m[1]);
        if (!n) return send(res, 500, { error: `Could not get a node for ${m[1]}` });
        return send(res, 200, { data: [...n.categories].map((cid) => ({ id: cid, name: s.nodes.get(cid).name })) });
      }
      if ((m = /^\/api\/v2\/nodes\/(\d+)\/categories$/.exec(path))) {
        const n = live(m[1]);
        if (!n) return send(res, 500, { error: `Could not get a node for ${m[1]}` });
        const withMeta = q.has('metadata');
        return send(res, 200, {
          results: [...n.categories].map((cid) => ({
            data: { categories: { [`${cid}_2`]: 'value' } },
            ...(withMeta ? { metadata: { categories: { [cid]: { key: String(cid), name: s.nodes.get(cid).name }, [`${cid}_2`]: { key: `${cid}_2`, name: 'Attribute' } } } } : {}),
          })),
        });
      }
      if ((m = /^\/api\/v2\/nodes\/(\d+)\/permissions$/.exec(path))) {
        const n = live(m[1]);
        return n ? send(res, 200, { results: n.perms.map((p) => ({ data: { permissions: p } })) }) : send(res, 500, { error: 'Sorry, the item you requested could not be accessed.' });
      }
      if ((m = /^\/api\/v1\/nodes\/(\d+)\/addablenodetypes$/.exec(path))) {
        if (!live(m[1])) return send(res, 500, { error: `Could not get a node for ${m[1]}` });
        const data = {}; const definitions = {};
        for (const t of ADDABLE) { const key = TYPE_NAMES[t].toLowerCase().replace(/\s/g, '_'); data[key] = `api/v1/forms/nodes/create?type=${t}&parent_id=${m[1]}`; definitions[key] = { name: TYPE_NAMES[t], type: t }; }
        return send(res, 200, { data, definitions, definitions_order: Object.keys(definitions) });
      }
      if ((m = /^\/api\/v1\/nodes\/(\d+)\/classifications$/.exec(path))) {
        const n = live(m[1]);
        return n ? send(res, 200, { data: [...n.classifications].map((cid) => ({ id: cid, name: s.nodes.get(cid).name })) }) : noNode(m[1]);
      }
      if ((m = /^\/api\/v2\/nicknames\/([^/]+)\/nodes$/.exec(path))) {
        const nick = decodeURIComponent(m[1]).toLowerCase();
        const n = [...s.nodes.values()].find((x) => !x.deleted && x.nickname.toLowerCase() === nick);
        return n ? send(res, 200, { results: { data: { properties: v2(n) } } }) : send(res, 404, { error: `Sorry, no exact match was found for an item with the Nickname ${nick}.` });
      }
      if (path === '/api/v2/volumes/recyclebin/nodes') {
        const mode = q.get('mode') || 'user_deleted';
        const text = (q.get('where_name') || '').toLowerCase();
        const items = [...s.nodes.values()].filter((n) => n.deleted && !n.deleted.purged
          && (mode === 'anyone_deleted' || n.deleted.by === user.id)
          && n.name.toLowerCase().startsWith(text));
        const { slice, paging } = paged(items, q);
        return send(res, 200, {
          results: slice.map((n) => ({ data: { properties: { id: n.id, type: n.type, name: n.name, deleted_user_id: n.deleted.by, deleted_date: n.deleted.at, parent_id: n.parent_id } } })),
          collection: { paging },
        });
      }
      if (path === '/api/v2/members/favorites') {
        const ids = [...(s.favorites.get(user.id) || [])].filter((id) => live(id));
        const { slice, paging } = paged(ids, q);
        return send(res, 200, { results: slice.map((id) => ({ data: { properties: v2(s.nodes.get(id)) } })), collection: { paging } });
      }
      if (path === '/api/v2/members/assignments') return send(res, 200, { results: (s.assignments.get(user.id) || []).map((a) => ({ data: { assignments: a } })) });
      if (path === '/api/v2/members/memberof') {
        const gs = [...s.groups.values()].filter((g) => g.members.has(user.id));
        const { slice, paging } = paged(gs, q);
        return send(res, 200, { results: slice.map((g) => ({ data: { properties: groupOut(g) } })), collection: { paging } });
      }
      if ((m = /^\/api\/(v[12])\/members\/(\d+)$/.exec(path))) {
        const u = s.users.get(Number(m[2]));
        const x = u ? userOut(u, user) : s.groups.has(Number(m[2])) ? groupOut(s.groups.get(Number(m[2]))) : null;
        if (!x) return send(res, 500, { error: `Could not get a member for ${m[2]}` });
        return m[1] === 'v1' ? send(res, 200, { data: x }) : send(res, 200, { results: { data: { properties: x } } });
      }
      if ((m = /^\/api\/v2\/members\/(\d+)\/members$/.exec(path))) {
        const g = s.groups.get(Number(m[1]));
        if (!g) return send(res, 500, { error: `Invalid group ${m[1]}` });
        const list = [...g.members].map((id) => (s.users.get(id) ? userOut(s.users.get(id), user) : s.groups.get(id) && groupOut(s.groups.get(id)))).filter(Boolean);
        const { slice, paging } = paged(list, q);
        return send(res, 200, { results: slice.map((p) => ({ data: { properties: p } })), collection: { paging } });
      }
      if (path === '/api/v2/members') {
        const text = (q.get('query') || q.get('where_name') || '').toLowerCase();
        const wantType = q.has('where_type') ? Number(q.get('where_type')) : null;
        const pool = [...(wantType === 0 ? [] : s.groups.values()), ...(wantType === 1 ? [] : s.users.values())];
        const hits = pool.filter((x) => x.name.toLowerCase().includes(text)).map((x) => (x.type === 1 ? groupOut(x) : userOut(x, user)));
        const { slice, paging } = paged(hits, q);
        return send(res, 200, { results: slice.map((p) => ({ data: { properties: p } })), collection: { paging } });
      }
      if (path === '/api/v2/workflows/status') {
        const kind = q.get('Kind') || 'Both';
        const wstatus = q.get('wstatus');
        if (wstatus && !WF_STATUSES.includes(wstatus)) return send(res, 400, { error: 'Could not access task status' });
        const list = s.workflows.filter((w) => (!wstatus || w.status_key === wstatus)
          && ((kind !== 'Managed' && w.initiator === user.id) || (kind !== 'Initiated' && w.manager === user.id)));
        return send(res, 200, { results: list.map((w) => ({ data: { wfstatus: { process_id: w.id, wf_name: w.name, status_key: w.status_key, date_initiated: w.at } } })) });
      }
      if (path === '/api/v2/search') return send(res, 200, { results: [], collection: { paging: { total_count: 0 } } });
      s.unknown.push(`GET ${path}`);
      return send(res, 400, { error: NOT_MAPPED });
    }

    // ---- writes (learner simulation) ----
    if (req.method === 'POST' && path === '/api/v1/nodes') {
      const parent = live(body.parent_id);
      if (!parent) return noNode(body.parent_id);
      const n = s.add(body, user.id);
      return send(res, 200, { id: n.id });
    }
    if (req.method === 'POST' && (m = /^\/api\/v1\/nodes\/(\d+)\/versions$/.exec(path))) {
      const n = live(m[1]);
      if (!n) return noNode(m[1]);
      const last = n.versions[n.versions.length - 1] || {};
      n.versions.push({ version_number: n.versions.length + 1, create_date: new Date().toISOString(), mime_type: body.mime_type || last.mime_type, file_name: last.file_name });
      return send(res, 200, { id: n.id, version_number: n.versions.length });
    }
    if (req.method === 'PUT' && (m = /^\/api\/v1\/nodes\/(\d+)$/.exec(path))) {
      const n = live(m[1]);
      if (!n) return noNode(m[1]);
      for (const k of ['name', 'description', 'nickname']) if (body[k] !== undefined) n[k] = body[k];
      if (body.hidden !== undefined) n.hidden = String(body.hidden) === 'true';
      if (body.reserved !== undefined) { n.reserved = String(body.reserved) === 'true'; n.reserved_user_id = n.reserved ? user.id : 0; }
      if (body.parent_id !== undefined) n.parent_id = Number(body.parent_id);
      return send(res, 200, {});
    }
    if (req.method === 'DELETE' && (m = /^\/api\/v1\/nodes\/(\d+)$/.exec(path))) {
      const n = live(m[1]);
      if (!n) return noNode(m[1]);
      n.deleted = { by: user.id, at: new Date().toISOString(), purged: false };
      return send(res, 200, {});
    }
    if (req.method === 'POST' && (m = /^\/mock\/recyclebin\/(\d+)\/purge$/.exec(path))) {
      const n = s.nodes.get(Number(m[1]));
      if (!n || !n.deleted) return noNode(m[1]);
      n.deleted.purged = true;
      return send(res, 200, {});
    }
    if (req.method === 'POST' && (m = /^\/mock\/favorites\/(\d+)$/.exec(path))) {
      if (!s.favorites.has(user.id)) s.favorites.set(user.id, new Set());
      s.favorites.get(user.id).add(Number(m[1]));
      return send(res, 200, {});
    }
    if (req.method === 'POST' && (m = /^\/mock\/nodes\/(\d+)\/categories\/(\d+)$/.exec(path))) {
      const n = live(m[1]);
      if (!n) return noNode(m[1]);
      n.categories.add(Number(m[2]));
      for (const c of s.nodes.values()) if (c.parent_id === n.id && !c.deleted && body.inherit) c.categories.add(Number(m[2]));
      return send(res, 200, {});
    }
    if (req.method === 'POST' && (m = /^\/mock\/nodes\/(\d+)\/permissions$/.exec(path))) {
      const n = live(m[1]);
      if (!n) return noNode(m[1]);
      n.perms.push({ type: body.type || 'custom', right_id: Number(body.right_id), permissions: body.permissions || ['see', 'see_contents'] });
      return send(res, 200, {});
    }
    if (req.method === 'DELETE' && (m = /^\/mock\/nodes\/(\d+)\/permissions\/public$/.exec(path))) {
      const n = live(m[1]);
      if (!n) return noNode(m[1]);
      n.perms = n.perms.filter((p) => p.type !== 'public');
      return send(res, 200, {});
    }
    if (req.method === 'POST' && (m = /^\/mock\/nodes\/(\d+)\/classifications\/(\d+)$/.exec(path))) {
      const n = live(m[1]);
      if (!n) return noNode(m[1]);
      n.classifications.add(Number(m[2]));
      return send(res, 200, {});
    }
    if (req.method === 'POST' && path === '/mock/workflows/initiate') {
      s.workflows.push({ id: s.workflows.length + 1, name: body.name || 'Workflow', status_key: body.status || 'ontime', initiator: user.id, manager: Number(body.manager) || user.id, at: new Date().toISOString() });
      return send(res, 200, {});
    }
    if (req.method === 'POST' && path === '/mock/groups') {
      const id = 1200 + s.groups.size;
      s.groups.set(id, { id, name: body.name, type: 1, type_name: 'Group', members: new Set((body.members || []).map(Number)) });
      return send(res, 200, { id });
    }
    s.unknown.push(`${req.method} ${path}`);
    return send(res, 400, { error: NOT_MAPPED });
  });

  return { server, state: s };
}

module.exports = { createMockCS, TYPE_NAMES };
