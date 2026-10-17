'use strict';
// Read-only helpers over the Content Server REST API.
//
// Endpoints, parameters and response shapes follow OpenText's published
// OpenAPI description of the v1/v2 API. A helper either returns what the
// server said, or { ok: false, endpoint, status, error } naming the call that
// failed and Content Server's own error text — it never guesses from an answer
// in an unexpected shape. Where a resource exists in both v1 and v2, the other
// version is asked when the first doesn't answer OK: same server, same data.
// Network failures and an expired session always throw (see isFatal). So do
// timeouts, unless the CSApi was made with { tolerateTimeouts: true }.

const { CSError } = require('./cs-client');

const PAGE = 100;
const MAX_CHILDREN = 2000;

// ---------- documented response shapes ----------

// The OpenAPI schemas type single elements as one-item arrays; servers send
// objects. Accept either, nothing else.
const isObj = (x) => !!x && typeof x === 'object' && !Array.isArray(x);
const one = (x) => (Array.isArray(x) ? (x.length === 1 ? x[0] : null) : x);

// v1 element: { data: {…} }
function v1Data(json) {
  const d = isObj(json) ? one(json.data) : null;
  return isObj(d) && d.id !== undefined ? d : null;
}
// v2 element: { results: { data: { properties: {…} } } }
function v2Props(json) {
  const r = isObj(json) ? one(json.results) : null;
  const d = isObj(r) ? one(r.data) : null;
  const p = isObj(d) ? one(d.properties) : null;
  return isObj(p) && p.id !== undefined ? p : null;
}
// v1 list: { data: [ {…} ] }
function v1List(json) {
  return isObj(json) && Array.isArray(json.data) && json.data.every(isObj) ? json.data : null;
}
// v2 list: { results: [ { data: { <section>: {…} } } ] }
function v2List(json, section = 'properties') {
  if (!isObj(json) || !Array.isArray(json.results)) return null;
  const out = [];
  for (const r of json.results) {
    const d = isObj(r) ? one(r.data) : null;
    const item = isObj(d) ? one(d[section]) : null;
    if (!isObj(item)) return null;
    out.push(item);
  }
  return out;
}
function totalCount(json) {
  if (!isObj(json)) return null;
  if (typeof json.total_count === 'number') return json.total_count;
  const c = one(json.collection);
  const p = isObj(c) ? one(c.paging) : null;
  return isObj(p) && typeof p.total_count === 'number' ? p.total_count : null;
}

function failure(endpoint, res) {
  if (res.timedOut) return { ok: false, endpoint, status: null, error: res.timedOut, timedOut: true };
  const cs = isObj(res.json) && typeof res.json.error === 'string' && res.json.error.trim() ? res.json.error.trim() : null;
  return { ok: false, endpoint, status: res.status, error: cs || (res.json ? null : 'not a JSON answer') };
}
const shapeError = (endpoint, res) => ({ ok: false, endpoint, status: res.status, error: 'the answer is not in the documented format' });

// "GET /api/v1/nodes/12 answered HTTP 400: Could not get a node for 12"
function describeFailure(r) {
  if (!r || r.ok) return '';
  if (r.timedOut) return r.error;
  return `GET ${r.endpoint} answered ${r.status ? `HTTP ${r.status}` : 'nothing usable'}${r.error ? `: ${r.error}` : ''}`;
}

// For a failed node(id) / nodeV1(id) only: the item itself is gone or out of the
// user's reach. GET nodes/{id} answers HTTP 400 "Could not get a node for {id}"
// (404 on some installations). Other endpoints use 400 for unrelated errors, so
// callers decide "gone" by asking for the node, never from a sub-resource.
function isMissing(r) {
  if (!r || r.ok) return false;
  return r.status === 400 || r.status === 404 || r.status === 410
    || (r.status === 500 && /could not get a node|could not be accessed|does not exist/i.test(r.error || ''));
}

function isContainer(n) {
  if (n.container === true) return true;
  if (n.container === false) return false;
  return [0, 136, 202, 848, 751, 298, 132, 196, 199, 215, 204, 207].includes(Number(n.type));
}

// ---------- API wrapper ----------

class CSApi {
  // tolerateTimeouts: a call Content Server doesn't answer in time comes back
  // as a failed call ({ ok: false, timedOut: true }) instead of throwing, and
  // is listed in `timeouts`. The platform scan and the connection report use
  // it so one slow endpoint doesn't hide everything else; mission checks never
  // do — for them a timeout stays an error.
  constructor(client, session, { tolerateTimeouts = false } = {}) {
    this.client = client;
    this.session = session;
    this.memo = new Map();
    this.tolerateTimeouts = tolerateTimeouts;
    this.timeouts = [];
  }

  async get(path, query) {
    try {
      return await this.client.get(path, this.session, query);
    } catch (e) {
      if (!this.tolerateTimeouts || !(e instanceof CSError) || e.code !== 'TIMEOUT') throw e;
      if (!this.timeouts.includes(path)) this.timeouts.push(path);
      return { status: null, ok: false, headers: {}, json: null, text: '', timedOut: e.message };
    }
  }

  _cached(key, fn) {
    if (!this.memo.has(key)) {
      const p = fn().catch((e) => { this.memo.delete(key); throw e; });
      this.memo.set(key, p);
    }
    return this.memo.get(key);
  }

  // First candidate that answers OK wins; otherwise the first failure is reported.
  async _first(candidates) {
    let failed = null;
    for (const [path, query] of candidates) {
      const res = await this.get(path, query);
      if (res.ok) return { ok: true, res, endpoint: path };
      if (!failed) failed = failure(path, res);
      // Asking the other version would only make the learner wait twice as long.
      if (res.timedOut) break;
    }
    return failed;
  }

  // Pages through a documented, pageable v2 list.
  async _pages(path, section, query = {}, maxItems = MAX_CHILDREN) {
    const items = [];
    const seen = new Set();
    for (let page = 1; items.length < maxItems; page++) {
      const res = await this.get(path, { ...query, limit: PAGE, page });
      if (!res.ok) return failure(path, res);
      const list = v2List(res.json, section);
      if (!list) return shapeError(path, res);
      let fresh = 0;
      for (const x of list) {
        const key = x.id !== undefined ? `id:${x.id}` : JSON.stringify(x);
        if (!seen.has(key)) { seen.add(key); items.push(x); fresh++; }
      }
      const total = totalCount(res.json);
      // Stop on the last page — or if the server ignores paging and repeats itself.
      if (list.length < PAGE || !fresh || (total !== null && items.length >= total)) return { ok: true, items, truncated: false };
    }
    return { ok: true, items, truncated: true };
  }

  me() {
    return this._cached('me', async () => {
      const res = await this.get('/api/v1/auth');
      if (res.timedOut) throw new CSError(res.timedOut, 504, 'TIMEOUT');
      const u = res.ok ? v1Data(res.json) : null;
      if (!u) throw new CSError(`Could not read your user profile from Content Server (GET /api/v1/auth answered HTTP ${res.status}).`, 502, 'BAD_RESPONSE');
      return u;
    });
  }

  serverInfo() {
    return this._cached('serverinfo', async () => {
      const endpoint = '/api/v1/serverinfo';
      const res = await this.get(endpoint);
      if (!res.ok) return failure(endpoint, res);
      const server = isObj(res.json) ? one(res.json.server) : null;
      if (!isObj(server)) return shapeError(endpoint, res);
      return { ok: true, version: typeof server.version === 'string' && server.version.trim() ? server.version.trim() : null };
    });
  }

  volume(subtype) {
    return this._cached(`vol:${subtype}`, async () => {
      const r = await this._first([[`/api/v1/volumes/${subtype}`], [`/api/v2/volumes/${subtype}`]]);
      if (!r.ok) return r;
      const node = v1Data(r.res.json) || v2Props(r.res.json);
      return node ? { ok: true, node, endpoint: r.endpoint } : shapeError(r.endpoint, r.res);
    });
  }

  node(id) {
    return this._cached(`node:${id}`, async () => {
      const r = await this._first([[`/api/v2/nodes/${id}`], [`/api/v1/nodes/${id}`]]);
      if (!r.ok) return r;
      const node = v2Props(r.res.json) || v1Data(r.res.json);
      return node ? { ok: true, node, endpoint: r.endpoint } : shapeError(r.endpoint, r.res);
    });
  }

  // v1 answer only: it carries fields that v2 properties lack (original_id).
  nodeV1(id) {
    return this._cached(`node1:${id}`, async () => {
      const endpoint = `/api/v1/nodes/${id}`;
      const res = await this.get(endpoint);
      if (!res.ok) return failure(endpoint, res);
      const node = v1Data(res.json);
      return node ? { ok: true, node } : shapeError(endpoint, res);
    });
  }

  // Every child of a container — hidden ones too, since they exist — up to MAX_CHILDREN.
  children(id) {
    return this._cached(`kids:${id}`, async () => {
      const nodes = [];
      const seen = new Set();
      for (let page = 1; nodes.length < MAX_CHILDREN; page++) {
        const q = { limit: PAGE, page, show_hidden: 'true' };
        const r = await this._first([[`/api/v1/nodes/${id}/nodes`, q], [`/api/v2/nodes/${id}/nodes`, q]]);
        if (!r.ok) return r;
        const batch = v1List(r.res.json) || v2List(r.res.json);
        if (!batch || !batch.every((n) => n.id !== undefined)) return shapeError(r.endpoint, r.res);
        let fresh = 0;
        for (const n of batch) if (!seen.has(String(n.id))) { seen.add(String(n.id)); nodes.push(n); fresh++; }
        const total = totalCount(r.res.json);
        // Stop on the last page — or if the server ignores paging and repeats itself.
        if (batch.length < PAGE || !fresh || (total !== null && nodes.length >= total)) return { ok: true, nodes, truncated: false, endpoint: r.endpoint };
      }
      return { ok: true, nodes, truncated: true, endpoint: `/api/v1/nodes/${id}/nodes` };
    });
  }

  // Breadth-first walk below a container. `truncated` is set when part of the
  // tree could not be read (too many items, or a sub-container refused).
  async descendants(id, depth = 3, max = 800) {
    const first = await this.children(id);
    if (!first.ok) return first;
    const nodes = [];
    let truncated = first.truncated;
    let frontier = [id];
    for (let d = 0; d < depth && frontier.length; d++) {
      const next = [];
      for (const pid of frontier) {
        const r = pid === id ? first : await this.children(pid);
        if (!r.ok || r.truncated) truncated = true;
        for (const n of r.ok ? r.nodes : []) {
          if (nodes.length >= max) { truncated = true; break; }
          nodes.push(n);
          if (isContainer(n)) next.push(n.id);
        }
      }
      frontier = next;
    }
    return { ok: true, nodes, truncated };
  }

  versions(id) {
    return this._cached(`ver:${id}`, async () => {
      const r = await this._first([[`/api/v1/nodes/${id}/versions`], [`/api/v2/nodes/${id}/versions`]]);
      if (!r.ok) return r;
      const list = v1List(r.res.json) || v2List(r.res.json, 'versions');
      if (!list) return shapeError(r.endpoint, r.res);
      return { ok: true, count: list.length, list, endpoint: r.endpoint };
    });
  }

  // Categories applied to a node. v1 lists them as {id, name}; v2 returns one
  // result per category keyed "{category_id}_{attribute_id}", with names only
  // when ?metadata is asked for.
  categories(id) {
    return this._cached(`cats:${id}`, async () => {
      const r = await this._first([[`/api/v1/nodes/${id}/categories`], [`/api/v2/nodes/${id}/categories`, { metadata: '' }]]);
      if (!r.ok) return r;
      const j = r.res.json;
      const v1 = v1List(j);
      if (v1 && v1.every((c) => c.id !== undefined)) {
        return { ok: true, endpoint: r.endpoint, list: v1.map((c) => ({ id: Number(c.id), name: typeof c.name === 'string' ? c.name : null })) };
      }
      if (!isObj(j) || !Array.isArray(j.results)) return shapeError(r.endpoint, r.res);
      const list = [];
      for (const res of j.results) {
        const data = isObj(res) ? one(res.data) : null;
        const values = isObj(data) ? one(data.categories) : null;
        const meta = isObj(res) && isObj(one(res.metadata)) ? one(one(res.metadata).categories) : null;
        const key = [...Object.keys(isObj(values) ? values : {}), ...Object.keys(isObj(meta) ? meta : {})].map((k) => /^(\d+)(?:_|$)/.exec(k)).find(Boolean);
        if (!key) return shapeError(r.endpoint, r.res);
        const def = isObj(meta) && isObj(meta[key[1]]) ? meta[key[1]] : null;
        list.push({ id: Number(key[1]), name: def && typeof def.name === 'string' ? def.name : null });
      }
      return { ok: true, endpoint: r.endpoint, list };
    });
  }

  permissions(id) {
    return this._cached(`perm:${id}`, async () => {
      const endpoint = `/api/v2/nodes/${id}/permissions`;
      const res = await this.get(endpoint);
      if (!res.ok) return failure(endpoint, res);
      const list = v2List(res.json, 'permissions');
      if (!list || !list.every((p) => typeof p.type === 'string')) return shapeError(endpoint, res);
      const entries = list.map((p) => ({
        type: p.type,
        right_id: p.right_id === null || p.right_id === undefined ? null : Number(p.right_id),
        permissions: Array.isArray(p.permissions) ? p.permissions.map(String)
          : typeof p.permissions === 'string' ? p.permissions.split(/[\s,]+/).filter(Boolean) : [],
      }));
      return { ok: true, entries };
    });
  }

  favorites() {
    return this._cached('favorites', async () => {
      const r = await this._pages('/api/v2/members/favorites', 'properties');
      return r.ok ? { ok: true, ids: new Set(r.items.map((n) => Number(n.id))), truncated: r.truncated } : r;
    });
  }

  member(id) {
    return this._cached(`member:${id}`, async () => {
      const r = await this._first([[`/api/v2/members/${id}`], [`/api/v1/members/${id}`]]);
      if (!r.ok) return r;
      const member = v2Props(r.res.json) || v1Data(r.res.json);
      return member ? { ok: true, member, endpoint: r.endpoint } : shapeError(r.endpoint, r.res);
    });
  }

  // Groups the signed-in user belongs to.
  myGroups() {
    return this._cached('memberof', async () => {
      const r = await this._pages('/api/v2/members/memberof', 'properties');
      return r.ok ? { ok: true, groups: r.items, truncated: r.truncated } : r;
    });
  }

  findGroups(text) {
    return this._cached(`findgroups:${text}`, async () => {
      const r = await this._pages('/api/v2/members', 'properties', { where_type: 1, query: text });
      return r.ok ? { ok: true, groups: r.items.filter((g) => Number(g.type) === 1 || g.type === undefined), truncated: r.truncated } : r;
    });
  }

  groupMembers(id) {
    return this._cached(`gm:${id}`, async () => {
      const r = await this._pages(`/api/v2/members/${id}/members`, 'properties');
      return r.ok ? { ok: true, members: r.items, truncated: r.truncated } : r;
    });
  }

  assignments() {
    return this._cached('assignments', async () => {
      const endpoint = '/api/v2/members/assignments';
      const res = await this.get(endpoint);
      if (!res.ok) return failure(endpoint, res);
      const list = v2List(res.json, 'assignments');
      return list ? { ok: true, count: list.length } : shapeError(endpoint, res);
    });
  }

  addableTypes(id) {
    return this._cached(`addable:${id}`, async () => {
      const endpoint = `/api/v1/nodes/${id}/addablenodetypes`;
      const res = await this.get(endpoint);
      if (!res.ok) return failure(endpoint, res);
      const defs = isObj(res.json) && isObj(res.json.definitions) ? res.json.definitions : null;
      if (!defs) return shapeError(endpoint, res);
      const seen = new Map();
      for (const d of Object.values(defs)) {
        if (isObj(d) && typeof d.type === 'number' && typeof d.name === 'string' && !seen.has(d.type)) seen.set(d.type, d.name);
      }
      return { ok: true, types: [...seen].map(([type, name]) => ({ type, name })) };
    });
  }

  // Provided by the Classifications module (not part of the core API description).
  classificationsOf(id) {
    return this._cached(`classif:${id}`, async () => {
      const r = await this._first([[`/api/v1/nodes/${id}/classifications`], [`/api/v2/nodes/${id}/classifications`]]);
      if (!r.ok) return r;
      const list = v1List(r.res.json) || v2List(r.res.json);
      return list ? { ok: true, count: list.length, endpoint: r.endpoint } : shapeError(r.endpoint, r.res);
    });
  }

  // Workflows the user started, in every status the API distinguishes. `unread`
  // lists statuses Content Server refused to report.
  workflowsInitiated() {
    return this._cached('wf:initiated', async () => {
      const endpoint = '/api/v2/workflows/status';
      let count = 0;
      const unread = [];
      let firstFailure = null;
      for (const wstatus of ['ontime', 'workflowlate', 'completed', 'stopped']) {
        const res = await this.get(endpoint, { Kind: 'Initiated', wstatus });
        if (res.timedOut) return failure(endpoint, res);
        const list = res.ok ? v2List(res.json, 'wfstatus') : null;
        if (list) { count += list.length; continue; }
        unread.push(wstatus);
        firstFailure = firstFailure || (res.ok ? shapeError(endpoint, res) : failure(endpoint, res));
      }
      return unread.length === 4 ? firstFailure : { ok: true, count, unread };
    });
  }

  // Extended ECM only.
  businessWorkspaceTypes() {
    return this._cached('bwtypes', async () => {
      const endpoint = '/api/v2/businessworkspacetypes';
      const res = await this.get(endpoint);
      if (!res.ok) return failure(endpoint, res);
      return isObj(res.json) && Array.isArray(res.json.results) ? { ok: true, count: res.json.results.length } : shapeError(endpoint, res);
    });
  }

  searchWorks() {
    return this._cached('search', async () => {
      const endpoint = '/api/v2/search';
      const res = await this.get(endpoint, { where: 'document', limit: 1 });
      if (!res.ok) return failure(endpoint, res);
      return isObj(res.json) && Array.isArray(res.json.results) ? { ok: true } : shapeError(endpoint, res);
    });
  }

  // The node a nickname resolves to (what …/open/<nickname> opens), or found: false.
  nodeByNickname(nickname) {
    return this._cached(`nick:${nickname}`, async () => {
      const endpoint = `/api/v2/nicknames/${encodeURIComponent(nickname)}/nodes`;
      const res = await this.get(endpoint);
      if (res.status === 404 && res.json) return { ok: true, found: false };
      if (!res.ok) return failure(endpoint, res);
      const node = v2Props(res.json);
      return node ? { ok: true, found: true, node } : shapeError(endpoint, res);
    });
  }

  // Items the signed-in user deleted that are still in the Recycle Bin;
  // `name` filters on names starting with it.
  recycleBin(name = '') {
    return this._cached(`bin:${name}`, async () => {
      const r = await this._pages('/api/v2/volumes/recyclebin/nodes', 'properties', { mode: 'user_deleted', ...(name ? { where_name: name } : {}) });
      return r.ok ? { ok: true, items: r.items, truncated: r.truncated } : r;
    });
  }
}

module.exports = { CSApi, isContainer, isMissing, describeFailure };
