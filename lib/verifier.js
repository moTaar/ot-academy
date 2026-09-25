'use strict';
// Check engine: evaluates a mission's declarative checks against the live
// Content Server and explains, in teacher language, what is right or missing.
//
// Each check resolves to one of:
//   pass     – verified on the server
//   fail     – verified NOT done (with a hint)
//   unknown  – this server's API can't tell us; the learner may self-confirm
//   blocked  – depends on an earlier check that failed

const { CSError } = require('./cs-client');

class NeedRef extends Error {
  constructor(key) { super(`missing ref ${key}`); this.key = key; }
}

const pass = (detail) => ({ status: 'pass', detail });
const fail = (detail) => ({ status: 'fail', detail });
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

async function resolveRef(spec, ctx) {
  const vols = { personal: 142, enterprise: 141, categoriesVolume: 133 };
  if (vols[spec]) {
    const v = await ctx.api.volume(vols[spec]);
    if (!v) throw new NeedRef(spec);
    return { id: v.id, name: v.name };
  }
  const r = ctx.found[spec] || ctx.refs[spec];
  if (!r) throw new NeedRef(spec);
  return r;
}

async function listUnder(c, ctx) {
  const parent = await resolveRef(c.parent, ctx);
  const first = await ctx.api.children(parent.id);
  const nodes = c.recursive && first.ok ? await ctx.api.descendants(parent.id, c.depth || 3) : first.nodes;
  return { parent, nodes, ok: first.ok };
}

const cannotList = (parent) => unknown(`I couldn't list the contents of “${parent.name}” through the API on this server.`);

// ---------- answer sources for "investigation" missions ----------

async function expected(source, ctx) {
  const [kind, arg] = source.split(':');
  const s = ctx.scan;
  switch (kind) {
    case 'user.login': return { ok: true, values: [(await ctx.api.me()).name] };
    case 'user.id': return { ok: true, values: [(await ctx.api.me()).id] };
    case 'user.isSysAdmin': return s ? { ok: true, values: [s.user.isSysAdmin ? 'yes' : 'no'] } : { ok: false };
    case 'user.department': {
      const me = await ctx.api.me();
      const g = me.group_id ? await ctx.api.member(me.group_id) : null;
      return g ? { ok: true, values: [g.name] } : { ok: false };
    }
    case 'user.groups': {
      const me = await ctx.api.me();
      const r = await ctx.api.memberOf(me.id);
      const names = r.groups.map((g) => g.name);
      if (me.group_id) {
        const g = await ctx.api.member(me.group_id);
        if (g) names.push(g.name);
      }
      return names.length ? { ok: true, values: names } : { ok: false };
    }
    case 'ref.id': {
      const r = await resolveRef(arg, ctx);
      return { ok: true, values: [r.id] };
    }
    case 'ref.mime': {
      const r = await resolveRef(arg, ctx);
      const n = await ctx.api.node(r.id);
      return n.ok && n.node.mime_type ? { ok: true, values: [n.node.mime_type] } : { ok: false };
    }
    case 'owner': {
      const r = await resolveRef(arg, ctx);
      const p = await ctx.api.permissions(r.id);
      const o = p.entries.find((e) => e.type === 'owner');
      if (!p.ok || !o || !o.right_id) return { ok: false };
      const m = await ctx.api.member(o.right_id);
      if (!m) return { ok: false };
      return { ok: true, values: [m.name, [m.first_name, m.last_name].filter(Boolean).join(' ')].filter(Boolean) };
    }
    case 'server.version': return s && s.server.version ? { ok: true, values: [s.server.version] } : { ok: false };
    case 'assignments.count': {
      const a = await ctx.api.assignments();
      return a.ok ? { ok: true, values: [a.count] } : { ok: false };
    }
    case 'workflowMaps': return s && s.workflowMaps.length ? { ok: true, values: s.workflowMaps.map((m) => m.name) } : { ok: false };
    case 'classificationTrees': return s && s.classificationTrees.length ? { ok: true, values: s.classificationTrees.map((m) => m.name) } : { ok: false };
    case 'bwTypes.count': {
      const b = await ctx.api.businessWorkspaceTypes();
      return b.ok ? { ok: true, values: [b.count] } : { ok: false };
    }
    default: return { ok: false };
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
    const { parent, nodes, ok } = await listUnder(c, ctx);
    if (!ok) return cannotList(parent);
    const hits = nodes.filter((n) => nameOk(n, c, ctx.vars) && typeOk(n, c));
    if (hits.length) {
      const pick = newest(hits);
      if (c.saveAs) ctx.found[c.saveAs] = { id: pick.id, name: pick.name };
      return pass(`Found “${pick.name}” (${describe(pick)}, ID ${pick.id}) in “${parent.name}”.`);
    }
    const sameName = nodes.filter((n) => nameOk(n, c, ctx.vars));
    if ((c.name || c.nameRegex) && sameName.length) {
      return fail(`“${sameName[0].name}” is there, but it is a ${describe(sameName[0])} — not the kind of item this step asks for.`);
    }
    const sameType = nodes.filter((n) => typeOk(n, c));
    if ((c.name || c.nameRegex) && (c.types || c.typeName) && sameType.length) {
      const names = sameType.slice(0, 3).map((n) => `“${n.name}”`).join(', ');
      return fail(`I see ${names} in “${parent.name}”, but none has the requested name. Check the spelling${c.name ? `: “${render(c.name, ctx.vars)}”` : ''}.`);
    }
    return fail(render(c.hint || `Nothing matching this step in “${parent.name}” yet.`, ctx.vars));
  },

  async count(c, ctx) {
    const { parent, nodes, ok } = await listUnder(c, ctx);
    if (!ok) return cannotList(parent);
    const hits = nodes.filter((n) => nameOk(n, c, ctx.vars) && typeOk(n, c));
    if (hits.length >= c.min) return pass(`Found ${hits.length} matching item(s) in “${parent.name}”.`);
    return fail(`Found ${hits.length} of the ${c.min} required in “${parent.name}”.${c.hint ? ' ' + render(c.hint, ctx.vars) : ''}`);
  },

  async prop(c, ctx) {
    const ref = await resolveRef(c.node, ctx);
    const r = await ctx.api.node(ref.id);
    if (!r.ok) return fail(`I can no longer open “${ref.name}” (ID ${ref.id}). Was it deleted or moved out of your reach?`);
    const v = r.node[c.field];
    if (v === undefined) return unknown(`This server's REST API does not expose “${c.field}”, so I can't check it automatically.`);
    const want = render(c.value, ctx.vars);
    switch (c.op) {
      case 'nonEmpty': {
        const len = norm(v).length;
        return len >= (Number(want) || 1) ? pass(`“${ref.name}” has ${c.field}: “${String(v).slice(0, 80)}”.`) : fail(`The ${c.field} of “${ref.name}” is ${len ? 'too short' : 'empty'}.`);
      }
      case 'equals': return norm(v) === norm(want) ? pass(`${c.field} is “${v}”.`) : fail(`${c.field} is currently “${v}”, expected “${want}”.`);
      case 'regex': return new RegExp(renderRegex(c.value, ctx.vars), 'i').test(String(v)) ? pass(`${c.field} is “${v}”.`) : fail(`${c.field} is “${v}”, which doesn't match what I expected.`);
      case 'true': return v === true || v === 1 || v === 'true' ? pass(`“${ref.name}”: ${c.field} = yes.`) : fail(`“${ref.name}” is not ${c.field} yet.`);
      case 'false': return !v || v === 'false' ? pass(`“${ref.name}”: ${c.field} = no.`) : fail(`“${ref.name}” is still ${c.field}.`);
      case 'equalsRef': {
        const target = await resolveRef(c.value, ctx);
        return Number(v) === Number(target.id) ? pass(`“${ref.name}” points to “${target.name}”.`) : fail(`“${ref.name}” points to ID ${v}, not to “${target.name}” (ID ${target.id}).`);
      }
      default: throw new Error(`Unknown prop op ${c.op}`);
    }
  },

  async versions(c, ctx) {
    const ref = await resolveRef(c.node, ctx);
    const v = await ctx.api.versions(ref.id);
    if (!v.ok) return unknown(`Couldn't read the version history of “${ref.name}”.`);
    return v.count >= c.min ? pass(`“${ref.name}” has ${v.count} versions.`) : fail(`“${ref.name}” has ${v.count} version(s); it needs at least ${c.min}.`);
  },

  async categories(c, ctx) {
    const ref = await resolveRef(c.node, ctx);
    const r = await ctx.api.categories(ref.id);
    if (!r.ok) return unknown(`Couldn't read the categories of “${ref.name}” through the API.`);
    const min = c.min || 1;
    const names = r.list.map((x) => x.name || `ID ${x.id}`).join(', ');
    return r.list.length >= min ? pass(`“${ref.name}” carries: ${names}.`) : fail(`“${ref.name}” has ${r.list.length} categor${r.list.length === 1 ? 'y' : 'ies'} applied; expected at least ${min}.`);
  },

  async permissions(c, ctx) {
    const ref = await resolveRef(c.node, ctx);
    const p = await ctx.api.permissions(ref.id);
    if (!p.ok) return unknown(`This server doesn't expose permissions through REST, so I can't inspect “${ref.name}”.`);
    if (c.expect === 'assignedAccess') {
      const hit = p.entries.find((e) => e.type === 'custom' && e.permissions.includes('see_contents'));
      if (!hit) return fail(`The Assigned Access list of “${ref.name}” has no user or group with See Contents.`);
      const m = hit.right_id ? await ctx.api.member(hit.right_id) : null;
      return pass(`${m ? `“${m.name}”` : 'A user/group'} has ${hit.permissions.join(', ')} on “${ref.name}”.`);
    }
    if (c.expect === 'publicRestricted') {
      const pub = p.entries.find((e) => e.type === 'public');
      if (!pub) return pass(`Public Access has been removed from “${ref.name}”.`);
      return pub.permissions.includes('see') ? fail(`Public Access still has ${pub.permissions.join(', ')} on “${ref.name}”.`) : pass(`Public Access can no longer see “${ref.name}”.`);
    }
    throw new Error(`Unknown permissions expectation ${c.expect}`);
  },

  async favorite(c, ctx) {
    const ref = await resolveRef(c.node, ctx);
    const f = await ctx.api.favorites();
    if (!f.ok) return unknown('Couldn\'t read your Favorites through the API.');
    return f.ids.has(Number(ref.id)) ? pass(`“${ref.name}” is in your Favorites.`) : fail(`“${ref.name}” is not in your Favorites yet.`);
  },

  async gone(c, ctx) {
    const ref = await resolveRef(c.node, ctx);
    const r = await ctx.api.node(ref.id);
    if (!r.ok || r.node.deleted) return pass(`“${ref.name}” is gone from its folder.`);
    return fail(`“${ref.name}” (ID ${ref.id}) still exists.`);
  },

  async answer(c, ctx) {
    const given = ctx.inputs[c.input];
    if (!given || !String(given).trim()) return fail('Type your answer in the box above, then check again.');
    const exp = await expected(c.source, ctx);
    if (!exp.ok) return unknown('I can\'t look this value up on your server, so I\'ll trust you on this one.');
    if (compareAnswer(given, exp.values, c.compare)) return pass(`“${given}” is correct.`);
    // Lenient answers come from a sampled scan, so a miss may just mean I didn't see it.
    if (c.lenient) return unknown(`“${given}” isn't among the ones I found (e.g. “${exp.values[0]}”) — the scan only samples the server, so confirm if you're sure.`);
    return fail(`“${given}” doesn't match what the server says. ${render(c.hint || 'Look again and retry.', ctx.vars)}`);
  },

  async groupExists(c, ctx) {
    const text = render(c.search, ctx.vars);
    const r = await ctx.api.findGroups(text);
    if (!r.ok) return unknown('Couldn\'t search groups through the API.');
    const re = new RegExp(renderRegex(c.nameRegex, ctx.vars), 'i');
    const g = r.groups.find((x) => re.test(x.name || ''));
    if (!g) return fail(`No group matching “${text}” found.`);
    if (c.saveAs) ctx.found[c.saveAs] = { id: g.id, name: g.name };
    if (c.minMembers) {
      const m = await ctx.api.groupMembers(g.id);
      if (!m.ok) return unknown(`Found group “${g.name}” but couldn't list its members.`);
      if (m.members.length < c.minMembers) return fail(`Group “${g.name}” exists but has ${m.members.length} member(s); add at least ${c.minMembers}.`);
      return pass(`Group “${g.name}” exists with ${m.members.length} member(s).`);
    }
    return pass(`Group “${g.name}” exists.`);
  },

  async apiCount(c, ctx) {
    const [src, arg] = c.source.split(':');
    let r;
    if (src === 'assignments') r = await ctx.api.assignments();
    else if (src === 'workflowsInitiated') r = await ctx.api.workflowsInitiated();
    else if (src === 'classificationsOf') r = await ctx.api.classificationsOf((await resolveRef(arg, ctx)).id);
    else throw new Error(`Unknown apiCount source ${src}`);
    if (!r.ok) return unknown('This server doesn\'t expose that information through REST.');
    return r.count >= c.min ? pass(`Found ${r.count}.`) : fail(`Found ${r.count}; expected at least ${c.min}.${c.hint ? ' ' + render(c.hint, ctx.vars) : ''}`);
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
      if (e instanceof CSError && e.code === 'SESSION_EXPIRED') throw e;
      if (e instanceof NeedRef) {
        const owner = ctx.refOwners[e.key];
        r = fail(owner ? `Finish “${owner}” first — I need to know which item that is.` : 'I can\'t find the item this step builds on.');
      } else {
        r = unknown(`I couldn't complete this check (${e.message}).`);
      }
    }
    if (r.status !== 'pass' && c.saveAs) failedKeys.add(c.saveAs);
    results.push({ label, ...r });
  }

  const statuses = results.map((r) => r.status);
  const status = statuses.every((s) => s === 'pass') ? 'pass'
    : statuses.some((s) => s === 'fail' || s === 'blocked') ? 'fail'
      : 'partial';
  return { status, results, captured: ctx.found };
}

module.exports = { verifyMission, render, compareAnswer };
