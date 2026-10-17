'use strict';
// Check engine: evaluates a mission's declarative checks against the live
// Content Server and explains, in teacher language, what is right or missing.
//
// Each check resolves to one of:
//   pass     – seen on the server; `node` names the item that proves it
//   fail     – seen NOT done (with a hint)
//   unknown  – could not be verified: Content Server didn't return what the
//              check needs, and the detail says which call answered what.
//              It never counts as done.
//   blocked  – depends on an earlier check that didn't pass
//
// Nothing is assumed. When Content Server can't be reached or the session has
// expired, the error propagates instead of becoming a result.

const { isFatal } = require('./cs-client');
const { isMissing, describeFailure } = require('./cs-api');

class NeedRef extends Error {
  constructor(key) { super(`missing ref ${key}`); this.key = key; }
}
// Ends a check early with the given result.
class Outcome extends Error {
  constructor(result) { super(result.detail); this.result = result; }
}

const evidence = (n) => (n && n.id !== undefined && n.id !== null ? { id: Number(n.id), name: n.name, container: n.container === true } : undefined);
const pass = (detail, node) => ({ status: 'pass', detail, node: evidence(node) });
const fail = (detail, node) => ({ status: 'fail', detail, node: evidence(node) });
const unknown = (detail) => ({ status: 'unknown', detail });

function render(str, vars) {
  if (typeof str !== 'string') return str;
  return str.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, k) => (vars[k] !== undefined && vars[k] !== null ? String(vars[k]) : ''));
}

function escapeRegex(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Like render() but escapes the substituted values so they match literally.
function renderRegex(str, vars) {
  return str.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, k) => escapeRegex(vars[k] !== undefined ? vars[k] : ''));
}

const norm = (s) => String(s === undefined || s === null ? '' : s).trim().replace(/\s+/g, ' ').toLowerCase();

function nameOk(n, c, vars) {
  if (c.name && norm(n.name) !== norm(render(c.name, vars))) return false;
  if (c.nameRegex && !new RegExp(renderRegex(c.nameRegex, vars), 'i').test(n.name || '')) return false;
  return true;
}

function typeOk(n, c) {
  const tests = [];
  if (c.types) tests.push(c.types.includes(Number(n.type)));
  if (c.typeName) tests.push(new RegExp(c.typeName, 'i').test(n.type_name || ''));
  if (c.mimeRegex) tests.push(new RegExp(c.mimeRegex, 'i').test(n.mime_type || ''));
  if (c.orNameRegex) tests.push(new RegExp(c.orNameRegex, 'i').test(n.name || ''));
  return !tests.length || tests.some(Boolean);
}

const describe = (n) => n.type_name || `subtype ${n.type}`;
const newest = (list) => list.reduce((a, b) => (Number(b.id) > Number(a.id) ? b : a));

const VOLUMES = { personal: [142, 'Personal Workspace'], enterprise: [141, 'Enterprise Workspace'], categoriesVolume: [133, 'Categories volume'] };

async function resolveRef(spec, ctx) {
  if (VOLUMES[spec]) {
    const [subtype, label] = VOLUMES[spec];
    const v = await ctx.api.volume(subtype);
    if (!v.ok) throw new Outcome(unknown(`I couldn't open your ${label}: ${describeFailure(v)}.`));
    return { id: v.node.id, name: v.node.name, volume: true };
  }
  const r = ctx.found[spec] || ctx.refs[spec];
  if (!r) throw new NeedRef(spec);
  return { ...r, key: spec };
}

// A read about a saved item failed. If the item itself is gone, that is a
// verified "not done" (with a way to recover); otherwise report the failed call.
async function readFailed(ref, r, what, ctx) {
  if (!ref.volume) {
    const n = await ctx.api.node(ref.id);
    if (!n.ok && isMissing(n)) {
      const owner = ref.key && ctx.refOwners[ref.key];
      return new Outcome(fail(`I can no longer open “${ref.name}” (ID ${ref.id}) — it was deleted or moved out of your reach.${owner ? ` If you re-created it, check “${owner}” again so I learn the new item.` : ''}`));
    }
  }
  return new Outcome(unknown(`I couldn't read ${what} of “${ref.name}”: ${describeFailure(r)}.`));
}

async function listUnder(c, ctx) {
  const parent = await resolveRef(c.parent, ctx);
  const r = c.recursive ? await ctx.api.descendants(parent.id, c.depth || 3) : await ctx.api.children(parent.id);
  if (!r.ok) throw await readFailed(parent, r, 'the contents', ctx);
  return { parent, nodes: r.nodes, truncated: r.truncated };
}

const tooMany = (parent) => unknown(`“${parent.name}” holds more items than I can read in one check, and none of those I read matches this step.`);

// ---------- answer sources for "investigation" missions (all read live) ----------

const ANSWER_SOURCES = ['user.login', 'user.id', 'user.isSysAdmin', 'user.department', 'user.groups', 'ref.id', 'ref.name',
  'ref.mime', 'owner', 'server.version', 'assignments.count', 'classificationTrees', 'bwTypes.count'];

async function expected(c, ctx) {
  const [kind, arg] = c.source.split(':');
  switch (kind) {
    case 'user.login': return { values: [(await ctx.api.me()).name] };
    case 'user.id': return { values: [(await ctx.api.me()).id] };
    // GET /api/v1/auth only includes privilege flags for administrators, so a
    // missing flag means the account has no System Administration rights.
    case 'user.isSysAdmin': return { values: [(await ctx.api.me()).privilege_system_admin_rights === true ? 'yes' : 'no'] };
    case 'user.department': {
      const me = await ctx.api.me();
      if (!me.group_id) throw new Outcome(unknown('Content Server did not report a department (base group) for your account.'));
      const g = await ctx.api.member(me.group_id);
      if (!g.ok) throw new Outcome(unknown(`I couldn't read your department group (ID ${me.group_id}): ${describeFailure(g)}.`));
      return { values: [g.member.name] };
    }
    case 'user.groups': {
      const me = await ctx.api.me();
      const r = await ctx.api.myGroups();
      if (!r.ok) throw new Outcome(unknown(`I couldn't read your group memberships: ${describeFailure(r)}.`));
      const values = r.groups.map((g) => g.name);
      let incomplete = r.truncated;
      if (me.group_id) {
        const g = await ctx.api.member(me.group_id);
        if (g.ok) values.push(g.member.name); else incomplete = true;
      }
      return { values, incomplete };
    }
    case 'ref.id':
    case 'ref.name': {
      const ref = await resolveRef(arg, ctx);
      const n = await ctx.api.node(ref.id);
      if (!n.ok) throw await readFailed(ref, n, 'the details', ctx);
      return { values: [kind === 'ref.id' ? n.node.id : n.node.name], node: n.node };
    }
    case 'ref.mime': {
      // The MIME type belongs to the document's current (highest) version.
      const ref = await resolveRef(arg, ctx);
      const v = await ctx.api.versions(ref.id);
      if (!v.ok) throw await readFailed(ref, v, 'the versions', ctx);
      const latest = v.list.reduce((a, b) => (Number(b.version_number) > Number(a.version_number) ? b : a), v.list[0]);
      if (!latest || typeof latest.mime_type !== 'string' || !latest.mime_type) {
        throw new Outcome(unknown(`Content Server didn't report a MIME type for the current version of “${ref.name}” (GET ${v.endpoint}).`));
      }
      return { values: [latest.mime_type], node: ref };
    }
    case 'owner': {
      const ref = await resolveRef(arg, ctx);
      const n = await ctx.api.node(ref.id);
      if (!n.ok) throw await readFailed(ref, n, 'the details', ctx);
      const ownerId = n.node.owner_user_id;
      if (!ownerId) throw new Outcome(unknown(`Content Server didn't report an owner for “${ref.name}”.`));
      const m = await ctx.api.member(ownerId);
      if (!m.ok) throw new Outcome(unknown(`I couldn't look up the owner of “${ref.name}” (user ID ${ownerId}): ${describeFailure(m)}.`));
      return { values: [m.member.name, [m.member.first_name, m.member.last_name].filter(Boolean).join(' ')].filter(Boolean), node: n.node };
    }
    case 'server.version': {
      const s = await ctx.api.serverInfo();
      if (!s.ok) throw new Outcome(unknown(`I couldn't read the server version: ${describeFailure(s)}.`));
      if (!s.version) throw new Outcome(unknown('Your Content Server does not report its version through the REST API (GET /api/v1/serverinfo has no server.version).'));
      return { values: [s.version] };
    }
    case 'assignments.count': {
      const a = await ctx.api.assignments();
      if (!a.ok) throw new Outcome(unknown(`I couldn't read your assignments: ${describeFailure(a)}.`));
      return { values: [a.count] };
    }
    case 'classificationTrees': {
      const v = await ctx.api.volume(198);
      if (!v.ok) throw new Outcome(unknown(`I couldn't open the Classifications volume: ${describeFailure(v)}.`));
      const k = await ctx.api.children(v.node.id);
      if (!k.ok) throw new Outcome(unknown(`I couldn't list the Classifications volume: ${describeFailure(k)}.`));
      return { values: k.nodes.map((n) => n.name), incomplete: k.truncated };
    }
    case 'bwTypes.count': {
      const b = await ctx.api.businessWorkspaceTypes();
      if (!b.ok) throw new Outcome(unknown(`I couldn't read the business workspace types: ${describeFailure(b)}.`));
      return { values: [b.count] };
    }
    default: throw new Error(`Unknown answer source ${c.source}`);
  }
}

function compareAnswer(answer, values, mode) {
  const a = norm(answer);
  if (!a) return false;
  switch (mode) {
    case 'number': return values.some((v) => Number(String(answer).replace(/[^\d.-]/g, '')) === Number(v));
    case 'yesno': {
      const yn = /^(y|yes|true|oui|ja|si)$/.test(a) ? 'yes' : /^(n|no|false|non|nein)$/.test(a) ? 'no' : a;
      return values.some((v) => norm(v) === yn);
    }
    case 'contains': return values.some((v) => { const x = norm(v); return x === a || (a.length >= 3 && (x.includes(a) || a.includes(x))); });
    default: return values.some((v) => norm(v) === a);
  }
}

// ---------- check handlers ----------

const HANDLERS = {
  async child(c, ctx) {
    const { parent, nodes, truncated } = await listUnder(c, ctx);
    const hits = nodes.filter((n) => nameOk(n, c, ctx.vars) && typeOk(n, c));
    if (hits.length) {
      const pick = newest(hits);
      if (c.saveAs) ctx.found[c.saveAs] = { id: pick.id, name: pick.name };
      return pass(`Found “${pick.name}” (${describe(pick)}, ID ${pick.id}) in “${parent.name}”.`, pick);
    }
    if (truncated) return tooMany(parent);
    const sameName = nodes.filter((n) => nameOk(n, c, ctx.vars));
    if ((c.name || c.nameRegex) && sameName.length) {
      return fail(`“${sameName[0].name}” is there, but it is a ${describe(sameName[0])} — not the kind of item this step asks for.`, sameName[0]);
    }
    const sameType = nodes.filter((n) => typeOk(n, c));
    if ((c.name || c.nameRegex) && (c.types || c.typeName) && sameType.length) {
      const names = sameType.slice(0, 3).map((n) => `“${n.name}”`).join(', ');
      return fail(`I see ${names} in “${parent.name}”, but none has the requested name. Check the spelling${c.name ? `: “${render(c.name, ctx.vars)}”` : ''}.`);
    }
    return fail(render(c.hint || `Nothing matching this step in “${parent.name}” yet.`, ctx.vars), parent);
  },

  async count(c, ctx) {
    const { parent, nodes, truncated } = await listUnder(c, ctx);
    const hits = nodes.filter((n) => nameOk(n, c, ctx.vars) && typeOk(n, c));
    if (hits.length >= c.min) return pass(`Found ${hits.length} matching item(s) in “${parent.name}”.`, parent);
    if (truncated) return tooMany(parent);
    return fail(`Found ${hits.length} of the ${c.min} required in “${parent.name}”.${c.hint ? ' ' + render(c.hint, ctx.vars) : ''}`, parent);
  },

  async prop(c, ctx) {
    const ref = await resolveRef(c.node, ctx);
    const r = await ctx.api.node(ref.id);
    if (!r.ok) throw await readFailed(ref, r, 'the properties', ctx);
    const node = r.node;
    let v = node[c.field];
    if (v === undefined) {
      // Some fields (e.g. original_id of shortcuts) are only in the v1 answer.
      const r1 = await ctx.api.nodeV1(ref.id);
      if (r1.ok) v = r1.node[c.field];
    }
    if (v === undefined) return unknown(`Your Content Server's REST API doesn't return “${c.field}” for “${ref.name}”, so I can't check this step.`);
    const want = render(c.value, ctx.vars);
    switch (c.op) {
      case 'nonEmpty': {
        const len = norm(v).length;
        return len >= (Number(want) || 1) ? pass(`“${node.name}” has ${c.field}: “${String(v).slice(0, 80)}”.`, node) : fail(`The ${c.field} of “${node.name}” is ${len ? 'too short' : 'empty'}.`, node);
      }
      case 'equals': return norm(v) === norm(want) ? pass(`${c.field} is “${v}”.`, node) : fail(`${c.field} is currently “${v}”, expected “${want}”.`, node);
      case 'regex': return new RegExp(renderRegex(c.value, ctx.vars), 'i').test(String(v)) ? pass(`${c.field} is “${v}”.`, node) : fail(`${c.field} is “${v}”, which doesn't match what I expected.`, node);
      case 'true': return v === true || v === 1 || v === 'true' ? pass(`“${node.name}”: ${c.field} = yes.`, node) : fail(`“${node.name}” is not ${c.field} yet.`, node);
      case 'false': return !v || v === 'false' ? pass(`“${node.name}”: ${c.field} = no.`, node) : fail(`“${node.name}” is still ${c.field}.`, node);
      case 'equalsRef': {
        const target = await resolveRef(c.value, ctx);
        return Number(v) === Number(target.id) ? pass(`“${node.name}” points to “${target.name}” (ID ${target.id}).`, node) : fail(`“${node.name}” points to ID ${v}, not to “${target.name}” (ID ${target.id}).`, node);
      }
      default: throw new Error(`Unknown prop op ${c.op}`);
    }
  },

  async versions(c, ctx) {
    const ref = await resolveRef(c.node, ctx);
    const v = await ctx.api.versions(ref.id);
    if (!v.ok) throw await readFailed(ref, v, 'the version history', ctx);
    return v.count >= c.min ? pass(`“${ref.name}” has ${v.count} versions.`, ref) : fail(`“${ref.name}” has ${v.count} version(s); it needs at least ${c.min}.`, ref);
  },

  async categories(c, ctx) {
    const ref = await resolveRef(c.node, ctx);
    const r = await ctx.api.categories(ref.id);
    if (!r.ok) throw await readFailed(ref, r, 'the categories', ctx);
    const min = c.min || 1;
    const names = r.list.map((x) => (x.name ? `“${x.name}”` : `category ID ${x.id}`)).join(', ');
    return r.list.length >= min ? pass(`“${ref.name}” carries ${names}.`, ref) : fail(`“${ref.name}” has ${r.list.length} categor${r.list.length === 1 ? 'y' : 'ies'} applied; expected at least ${min}.`, ref);
  },

  async permissions(c, ctx) {
    const ref = await resolveRef(c.node, ctx);
    const p = await ctx.api.permissions(ref.id);
    if (!p.ok) throw await readFailed(ref, p, 'the permissions', ctx);
    if (c.expect === 'assignedAccess') {
      const hit = p.entries.find((e) => e.type === 'custom' && e.permissions.includes('see_contents'));
      if (!hit) return fail(`The Assigned Access list of “${ref.name}” has no user or group with See Contents.`, ref);
      const m = hit.right_id ? await ctx.api.member(hit.right_id) : null;
      return pass(`${m && m.ok ? `“${m.member.name}”` : `User/group ID ${hit.right_id}`} has ${hit.permissions.join(', ')} on “${ref.name}”.`, ref);
    }
    if (c.expect === 'publicRestricted') {
      const pub = p.entries.find((e) => e.type === 'public');
      if (!pub) return pass(`Public Access is not on the permissions of “${ref.name}”.`, ref);
      return pub.permissions.includes('see') ? fail(`Public Access still has ${pub.permissions.join(', ')} on “${ref.name}”.`, ref) : pass(`Public Access can no longer see “${ref.name}”.`, ref);
    }
    throw new Error(`Unknown permissions expectation ${c.expect}`);
  },

  async favorite(c, ctx) {
    const ref = await resolveRef(c.node, ctx);
    const f = await ctx.api.favorites();
    if (!f.ok) return unknown(`I couldn't read your Favorites: ${describeFailure(f)}.`);
    if (f.ids.has(Number(ref.id))) return pass(`“${ref.name}” is in your Favorites.`, ref);
    if (f.truncated) return unknown(`You have more Favorites than I can read, and “${ref.name}” isn't among those I read.`);
    return fail(`“${ref.name}” is not in your Favorites yet.`, ref);
  },

  // Deleted means: listed in the learner's Recycle Bin, or Content Server
  // answers "no such node" for its ID. Still there, moved, or an error is not a pass.
  async gone(c, ctx) {
    const ref = await resolveRef(c.node, ctx);
    const bin = await ctx.api.recycleBin(ref.name);
    const hit = bin.ok ? bin.items.find((x) => Number(x.id) === Number(ref.id)) : null;
    if (hit) return pass(`“${ref.name}” (ID ${ref.id}) is in your Recycle Bin${hit.deleted_date ? `, deleted ${String(hit.deleted_date).slice(0, 10)}` : ''}.`);
    const n = await ctx.api.node(ref.id);
    if (n.ok) {
      const parent = n.node.parent_id ? await ctx.api.node(n.node.parent_id) : null;
      const where = parent && parent.ok ? ` in “${parent.node.name}” (ID ${parent.node.id})` : n.node.parent_id ? ` in the container with ID ${n.node.parent_id}` : '';
      return fail(`“${n.node.name}” (ID ${ref.id}) still exists${where}. Delete it from its Functions menu.`, n.node);
    }
    if (isMissing(n)) return pass(`Content Server no longer returns “${ref.name}” (ID ${ref.id}) to you: ${n.error || `HTTP ${n.status}`}.`);
    return unknown(`I couldn't tell whether “${ref.name}” was deleted: ${describeFailure(n)}.`);
  },

  async answer(c, ctx) {
    const given = ctx.inputs[c.input];
    if (!given || !String(given).trim()) return fail('Type your answer in the box above, then check again.');
    const exp = await expected(c, ctx);
    if (compareAnswer(given, exp.values, c.compare)) return pass(`“${String(given).trim()}” is correct.`, exp.node);
    if (exp.incomplete) return unknown(`“${given}” isn't among the values I could read, but Content Server didn't give me the complete list, so I can't tell.`);
    return fail(`“${given}” doesn't match what the server says. ${render(c.hint || 'Look again and retry.', ctx.vars)}`);
  },

  // The learner types a node ID; it must open an item of the requested kind.
  async nodeAnswer(c, ctx) {
    const given = String(ctx.inputs[c.input] || '').trim();
    if (!given) return fail('Type the node ID in the box above, then check again.');
    if (!/^\d+$/.test(given)) return fail(`“${given}” is not a node ID — type only the digits after objId= or /nodes/.`);
    const r = await ctx.api.node(given);
    if (!r.ok) return isMissing(r) ? fail(`Content Server has no item with ID ${given} that you can open.`) : unknown(`I couldn't open item ${given}: ${describeFailure(r)}.`);
    if (!typeOk(r.node, c)) return fail(`Item ${given} is “${r.node.name}”, a ${describe(r.node)} — not ${c.kindLabel || 'the kind of item this step asks for'}.`, r.node);
    if (c.saveAs) ctx.found[c.saveAs] = { id: r.node.id, name: r.node.name };
    return pass(`Item ${given} is the ${describe(r.node)} “${r.node.name}”.`, r.node);
  },

  // Resolved the way …/open/<nickname> links are, through the nicknames endpoint.
  async nickname(c, ctx) {
    const ref = await resolveRef(c.node, ctx);
    const nick = render(c.value, ctx.vars);
    const r = await ctx.api.nodeByNickname(nick);
    if (!r.ok) return unknown(`I couldn't look up the nickname “${nick}”: ${describeFailure(r)}.`);
    if (!r.found) return fail(`No item has the nickname “${nick}” yet.`);
    if (Number(r.node.id) !== Number(ref.id)) return fail(`The nickname “${nick}” belongs to “${r.node.name}” (ID ${r.node.id}), not to “${ref.name}”.`, r.node);
    return pass(`The nickname “${nick}” opens “${ref.name}” (ID ${ref.id}).`, r.node);
  },

  async groupExists(c, ctx) {
    const text = render(c.search, ctx.vars);
    const r = await ctx.api.findGroups(text);
    if (!r.ok) return unknown(`I couldn't search the groups: ${describeFailure(r)}.`);
    const re = new RegExp(renderRegex(c.nameRegex, ctx.vars), 'i');
    const g = r.groups.find((x) => re.test(x.name || ''));
    if (!g) return r.truncated ? unknown(`The search for “${text}” returned more groups than I can read, and none of those I read matches.`) : fail(`No group matching “${text}” found.`);
    if (c.saveAs) ctx.found[c.saveAs] = { id: g.id, name: g.name };
    if (c.minMembers) {
      const m = await ctx.api.groupMembers(g.id);
      if (!m.ok) return unknown(`Found group “${g.name}” but couldn't list its members: ${describeFailure(m)}.`);
      if (m.members.length < c.minMembers) return fail(`Group “${g.name}” exists but has ${m.members.length} member(s); add at least ${c.minMembers}.`);
      return pass(`Group “${g.name}” (ID ${g.id}) exists with ${m.members.length} member(s).`);
    }
    return pass(`Group “${g.name}” (ID ${g.id}) exists.`);
  },

  async apiCount(c, ctx) {
    const [src, arg] = c.source.split(':');
    let r;
    let what;
    if (src === 'assignments') { r = await ctx.api.assignments(); what = 'your assignments'; }
    else if (src === 'workflowsInitiated') { r = await ctx.api.workflowsInitiated(); what = 'the workflows you started'; }
    else if (src === 'classificationsOf') {
      const ref = await resolveRef(arg, ctx);
      r = await ctx.api.classificationsOf(ref.id);
      if (!r.ok) throw await readFailed(ref, r, 'the classifications', ctx);
      what = `the classifications of “${ref.name}”`;
    } else throw new Error(`Unknown apiCount source ${src}`);
    if (!r.ok) return unknown(`I couldn't read ${what}: ${describeFailure(r)}.`);
    if (r.count >= c.min) return pass(`Found ${r.count} (${what}).`);
    if (r.unread && r.unread.length) return unknown(`Found ${r.count}, but Content Server wouldn't list the ${r.unread.join(', ')} ones, so I can't be sure.`);
    return fail(`Found ${r.count}; expected at least ${c.min}.${c.hint ? ' ' + render(c.hint, ctx.vars) : ''}`);
  },
};

// Keys a check depends on (to mark later checks as blocked when an earlier one failed).
function dependsOn(c) {
  return [c.parent, c.node, typeof c.value === 'string' && c.op === 'equalsRef' ? c.value : null,
    c.source && c.source.includes(':') ? c.source.split(':')[1] : null].filter(Boolean);
}

async function verifyMission(mission, ctx) {
  ctx.found = ctx.found || {};
  const results = [];
  const failedKeys = new Set();

  for (const c of mission.checks || []) {
    const label = render(c.label, ctx.vars);
    if (dependsOn(c).some((k) => failedKeys.has(k))) {
      results.push({ label, status: 'blocked', detail: 'Waiting on the step above.' });
      if (c.saveAs) failedKeys.add(c.saveAs);
      continue;
    }
    let r;
    try {
      r = await HANDLERS[c.kind](c, ctx);
    } catch (e) {
      if (isFatal(e)) throw e;
      if (e instanceof Outcome) r = e.result;
      else if (e instanceof NeedRef) {
        const owner = ctx.refOwners[e.key];
        r = fail(owner ? `Finish “${owner}” first — I need to know which item that is.` : 'I can\'t find the item this step builds on.');
      } else {
        console.error(`[check ${mission.id}]`, e);
        r = unknown(`I couldn't complete this check (${e.message}).`);
      }
    }
    if (r.status !== 'pass' && c.saveAs) failedKeys.add(c.saveAs);
    results.push({ label, ...r });
  }

  const statuses = results.map((r) => r.status);
  const status = statuses.every((s) => s === 'pass') ? 'pass'
    : statuses.some((s) => s === 'fail' || s === 'blocked') ? 'fail'
      : 'unverified';
  return { status, results, captured: ctx.found };
}

module.exports = { verifyMission, render, compareAnswer, HANDLERS, ANSWER_SOURCES };
