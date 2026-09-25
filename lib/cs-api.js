'use strict';
// Read-only helpers over the Content Server REST API.
//
// Content Server exposes two flavours of the API (v1 and v2) whose JSON shapes
// differ, and the exact fields vary between 16.x updates. Every helper here
// tries the most likely endpoint first, falls back to the other flavour, and
// normalises whatever comes back. A helper returns { ok: false } rather than
// throwing when the server simply doesn't support something, so callers can
// report "couldn't verify" instead of a hard failure.

const { CSError } = require('./cs-client');

// ---------- shape normalisers ----------

function propsOf(x) {
  if (!x || typeof x !== 'object') return null;
  if (x.data && x.data.properties) return x.data.properties;
  if (x.properties && x.properties.id !== undefined) return x.properties;
  if (x.data && typeof x.data === 'object' && !Array.isArray(x.data) && x.data.id !== undefined) return x.data;
  if (x.id !== undefined) return x;
  return null;
}

function oneNode(json) {
  if (!json) return null;
  if (json.results && !Array.isArray(json.results)) return propsOf(json.results);
  return propsOf(json);
}

function listOf(json) {
  if (!json) return [];
  let arr = null;
  if (Array.isArray(json.results)) arr = json.results;
  else if (Array.isArray(json.data)) arr = json.data;
  else if (json.results && Array.isArray(json.results.data)) arr = json.results.data;
  if (!arr) return [];
  return arr.map(propsOf).filter(Boolean);
}

// Size of the first array of objects found in a response (used for things like
// assignments where the envelope differs between versions).
function countItems(json) {
  if (!json) return 0;
  if (Array.isArray(json.results)) return json.results.length;
  if (Array.isArray(json.data)) return json.data.length;
  let found = null;
  walk(json, (k, v) => {
    if (found === null && Array.isArray(v) && v.length && typeof v[0] === 'object') found = v.length;
  });
  return found || 0;
}

function walk(obj, fn, depth = 0) {
  if (!obj || typeof obj !== 'object' || depth > 8) return;
  for (const [k, v] of Object.entries(obj)) {
    fn(k, v, obj);
    if (v && typeof v === 'object') walk(v, fn, depth + 1);
  }
}

// ---------- API wrapper ----------

class CSApi {
  constructor(client, session) {
    this.client = client;
    this.session = session;
    this.memo = new Map();
  }

  raw(path, query) {
    return this.client.get(path, this.session, query);
  }

  _cached(key, fn) {
    if (!this.memo.has(key)) {
      const p = fn().catch((e) => { this.memo.delete(key); throw e; });
      this.memo.set(key, p);
    }
    return this.memo.get(key);
  }

  // First endpoint that answers OK wins. Session expiry always propagates.
  async _first(paths) {
    let last = null;
    for (const p of paths) {
      const [path, query] = Array.isArray(p) ? p : [p];
      try {
        const res = await this.raw(path, query);
        if (res.ok) return res;
        last = res;
      } catch (e) {
        if (e instanceof CSError && e.code === 'SESSION_EXPIRED') throw e;
        last = { ok: false, status: e.status || 0, error: e.message };
      }
    }
    return last || { ok: false, status: 0 };
  }

  me() {
    return this._cached('me', async () => {
      const res = await this.raw('/api/v1/auth');
      const u = res.ok ? oneNode(res.json) : null;
      if (!u) throw new CSError('Could not read your user profile from Content Server', 502);
      return u;
    });
  }

  serverInfo() {
    return this._cached('serverinfo', async () => {
      const res = await this.raw('/api/v1/serverinfo');
      if (!res.ok) return { ok: false };
      let version = null;
      if (res.json.server && res.json.server.version) version = res.json.server.version;
      if (!version) walk(res.json, (k, v) => { if (!version && /version/i.test(k) && typeof v === 'string') version = v; });
      return { ok: true, version, raw: res.json };
    });
  }

  volume(subtype) {
    return this._cached(`vol:${subtype}`, async () => {
      const res = await this._first([`/api/v1/volumes/${subtype}`, `/api/v2/volumes/${subtype}`]);
      return res.ok ? oneNode(res.json) : null;
    });
  }

  node(id) {
    return this._cached(`node:${id}`, async () => {
      const res = await this._first([`/api/v2/nodes/${id}`, `/api/v1/nodes/${id}`]);
      const node = res.ok ? oneNode(res.json) : null;
      return { ok: !!node, status: res.status, node };
    });
  }

  children(id, max = 1000) {
    return this._cached(`kids:${id}`, async () => {
      const limit = 100;
      const out = [];
      for (let page = 1; page <= 50 && out.length < max; page++) {
        const res = await this._first([
          [`/api/v1/nodes/${id}/nodes`, { limit, page }],
          [`/api/v2/nodes/${id}/nodes`, { limit, page }],
        ]);
        if (!res.ok) {
          if (page === 1) return { ok: false, status: res.status, nodes: [] };
          break;
        }
        const batch = listOf(res.json);
        out.push(...batch);
        const total = res.json.total_count
          || (res.json.collection && res.json.collection.paging && res.json.collection.paging.total_count);
        if (batch.length < limit || (total && out.length >= total)) break;
      }
      return { ok: true, nodes: out };
    });
  }

  // Breadth-first walk below a container, bounded by depth and node count.
  async descendants(id, depth = 3, max = 800) {
    const out = [];
    let frontier = [id];
    for (let d = 0; d < depth && frontier.length && out.length < max; d++) {
      const next = [];
      for (const pid of frontier) {
        const { nodes } = await this.children(pid);
        for (const n of nodes) {
          out.push(n);
          if (isContainer(n)) next.push(n.id);
          if (out.length >= max) break;
        }
        if (out.length >= max) break;
      }
      frontier = next;
    }
    return out;
  }

  versions(id) {
    return this._cached(`ver:${id}`, async () => {
      const res = await this._first([`/api/v1/nodes/${id}/versions`, `/api/v2/nodes/${id}/versions`]);
      if (!res.ok) return { ok: false, count: 0 };
      return { ok: true, count: countItems(res.json) };
    });
  }

  categories(id) {
    return this._cached(`cats:${id}`, async () => {
      const res = await this._first([`/api/v2/nodes/${id}/categories`, `/api/v1/nodes/${id}/categories`]);
      if (!res.ok) return { ok: false, list: [] };
      const found = new Map();
      walk(res.json, (k, v) => {
        const m = /^(\d+)_\d+/.exec(k);
        if (m && !found.has(m[1])) found.set(m[1], null);
        if (/^\d+$/.test(k) && v && typeof v === 'object' && typeof v.name === 'string') found.set(k, v.name);
      });
      if (!found.size) for (const e of listOf(res.json)) found.set(String(e.id), e.name || null);
      return { ok: true, list: [...found].map(([cid, name]) => ({ id: Number(cid), name })) };
    });
  }

  permissions(id) {
    return this._cached(`perm:${id}`, async () => {
      const res = await this._first([`/api/v2/nodes/${id}/permissions`]);
      if (!res.ok) return { ok: false, entries: [] };
      const entries = [];
      walk(res.json, (k, v) => {
        if (k === 'permissions' && v && Array.isArray(v.permissions)) {
          entries.push({ type: v.type, right_id: v.right_id, permissions: v.permissions.map(String) });
        }
      });
      return { ok: true, entries };
    });
  }

  favorites() {
    return this._cached('favorites', async () => {
      const res = await this._first(['/api/v2/members/favorites']);
      if (!res.ok) return { ok: false, ids: new Set() };
      return { ok: true, ids: new Set(listOf(res.json).map((n) => Number(n.id))) };
    });
  }

  member(id) {
    return this._cached(`member:${id}`, async () => {
      const res = await this._first([`/api/v2/members/${id}`, `/api/v1/members/${id}`]);
      return res.ok ? oneNode(res.json) : null;
    });
  }

  memberOf(id) {
    return this._cached(`memberof:${id}`, async () => {
      const res = await this._first([[`/api/v2/members/${id}/memberof`, { limit: 200 }], `/api/v1/members/${id}/memberof`]);
      if (!res.ok) return { ok: false, groups: [] };
      return { ok: true, groups: listOf(res.json) };
    });
  }

  findGroups(text) {
    return this._cached(`findgroups:${text}`, async () => {
      const res = await this._first([
        ['/api/v2/members', { where_type: 1, query: text, limit: 50 }],
        ['/api/v2/members', { where_type: 1, where_name: text, limit: 50 }],
        ['/api/v1/members', { where_type: 1, query: text }],
      ]);
      if (!res.ok) return { ok: false, groups: [] };
      return { ok: true, groups: listOf(res.json) };
    });
  }

  groupMembers(id) {
    return this._cached(`gm:${id}`, async () => {
      const res = await this._first([[`/api/v2/members/${id}/members`, { limit: 200 }], `/api/v1/members/${id}/members`]);
      if (!res.ok) return { ok: false, members: [] };
      return { ok: true, members: listOf(res.json) };
    });
  }

  assignments() {
    return this._cached('assignments', async () => {
      const res = await this._first(['/api/v2/members/assignments']);
      if (!res.ok) return { ok: false, count: 0 };
      return { ok: true, count: countItems(res.json) };
    });
  }

  addableTypes(id) {
    return this._cached(`addable:${id}`, async () => {
      const res = await this._first([`/api/v1/nodes/${id}/addablenodetypes`]);
      if (!res.ok) return { ok: false, types: [] };
      const seen = new Map();
      walk(res.json, (k, v) => {
        if (v && typeof v === 'object' && !Array.isArray(v) && typeof v.type === 'number') {
          const name = v.name || v.type_name;
          if (typeof name === 'string' && !seen.has(v.type)) seen.set(v.type, name);
        }
      });
      return { ok: true, types: [...seen].map(([type, name]) => ({ type, name })) };
    });
  }

  classificationsOf(id) {
    return this._cached(`classif:${id}`, async () => {
      const res = await this._first([`/api/v1/nodes/${id}/classifications`, `/api/v2/nodes/${id}/classifications`]);
      if (!res.ok) return { ok: false, count: 0 };
      return { ok: true, count: countItems(res.json) };
    });
  }

  workflowsInitiated() {
    return this._cached('wf:initiated', async () => {
      const res = await this._first([
        ['/api/v2/workflows/status', { kind: 'Initiated' }],
        ['/api/v2/workflows/status', { wstatus: 'ontime', kind: 'Both' }],
        '/api/v2/workflows/status',
      ]);
      if (!res.ok) return { ok: false, count: 0 };
      return { ok: true, count: countItems(res.json) };
    });
  }

  businessWorkspaceTypes() {
    return this._cached('bwtypes', async () => {
      const res = await this._first(['/api/v2/businessworkspacetypes']);
      if (!res.ok) return { ok: false, count: 0, status: res.status };
      return { ok: true, count: countItems(res.json) };
    });
  }

  searchWorks() {
    return this._cached('search', async () => {
      const res = await this._first([['/api/v2/search', { where: 'document', limit: 1 }]]);
      return { ok: !!res.ok, status: res.status };
    });
  }
}

function isContainer(n) {
  if (n.container === true) return true;
  if (n.container === false) return false;
  return [0, 136, 202, 848, 751, 298, 132, 196, 199, 215, 204, 207].includes(Number(n.type));
}

module.exports = { CSApi, oneNode, listOf, countItems, isContainer };
