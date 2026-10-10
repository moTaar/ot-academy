'use strict';
// Loads the tracks, the certifications and the reference content, validates
// them all, and builds lookup tables.

const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const { render, HANDLERS, ANSWER_SOURCES } = require('../lib/verifier');
const { CERTS, ROADMAP } = require('./certifications');
const content = require('./content');

const TRACKS = [
  { id: 'user', title: 'Business User', exam: '5-0158', blurb: 'Everyday document management — the foundation for every other track.' },
  { id: 'collab', title: 'Collaboration', exam: '5-0158', blurb: 'Workflows, reminders, wikis, projects, communities and social features.' },
  { id: 'admin', title: 'Analyst & Administrator foundations', exam: '5-0155 / 5-0156', blurb: 'Architecture, administration, records, workflow design and Extended ECM.' },
  { id: 'bizadmin', title: 'Business Administrator', exam: '5-0159 / Cloud', blurb: 'Business workspaces, smart document types, perspectives, transport, facets, search and module settings.' },
  { id: 'sysadmin', title: 'System Administrator', exam: '5-0156', blurb: 'Installation, admin pages, search grid, schema, logging and troubleshooting, OTDS and System Center.' },
  { id: 'dev', title: 'Developer', exam: '5-0157', blurb: 'Schema and LiveReports, OScript and CSIDE, the REST API and Content Web Services.' },
  { id: 'analyst', title: 'Analyst & Solution Design', exam: '5-0155', blurb: 'CIS modeling, document, records, collaboration, workspace, workflow and form design.' },
  { id: 'workspaces', title: 'Business Workspaces', exam: 'Skill path', blurb: 'How business workspaces work, how to set them up, and a hands-on lab that builds one in your Content Server.' },
];

// Track files, in display order. Files that don't exist yet are skipped.
const TRACK_FILES = ['track-user', 'track-user-plus', 'track-collab', 'track-admin', 'track-bizadmin', 'track-sysadmin', 'track-dev', 'track-analyst', 'track-bw-a', 'track-bw-b', 'track-bw-c', 'track-workspaces'];
const BASE_TRACKS = ['track-user', 'track-collab', 'track-admin'];
const MODULES = [];
for (const f of TRACK_FILES) {
  if (content.ONLY && !BASE_TRACKS.includes(f) && !content.ONLY.includes(`${f}.js`)) continue;
  if (fs.existsSync(path.join(__dirname, `${f}.js`))) MODULES.push(...require(`./${f}`));
}
// Keep each track's modules together, in file order — or by `order` when
// modules set it (several files feed one track).
MODULES.sort((a, b) => (TRACKS.findIndex((t) => t.id === a.track) - TRACKS.findIndex((t) => t.id === b.track)) || ((a.order || 0) - (b.order || 0)));

const TYPE_XP = { 'hands-on': 30, investigate: 20, quiz: 20, practice: 15 };
const REF_ROOTS = new Set(['personal', 'enterprise', 'categoriesVolume']);

const domainById = new Map();
for (const cert of CERTS) for (const d of cert.domains) domainById.set(d.id, { ...d, cert: cert.id });
const moduleById = new Map(MODULES.map((m) => [m.id, m]));

const missionById = new Map();
const moduleOfMission = new Map();
const refOwners = {};

for (const mod of MODULES) {
  for (const m of mod.missions) {
    if (missionById.has(m.id)) throw new Error(`Duplicate mission id ${m.id}`);
    m.xp = m.xp || TYPE_XP[m.type];
    m.module = mod.id;
    missionById.set(m.id, m);
    moduleOfMission.set(m.id, mod);
    for (const c of m.checks || []) if (c.saveAs) refOwners[c.saveAs] = m.title;
  }
}

// Fail fast on authoring mistakes.
const PRACTICE = require('./practice-paths');
const reference = content.load({ domainIds: new Set(domainById.keys()), moduleIds: new Set(moduleById.keys()) });

(function validate() {
  const errors = [...reference.errors];
  const seenMod = new Set();
  for (const mod of MODULES) {
    if (seenMod.has(mod.id)) errors.push(`Duplicate module id ${mod.id}`);
    seenMod.add(mod.id);
    if (!TRACKS.some((t) => t.id === mod.track)) errors.push(`${mod.id}: unknown track ${mod.track}`);
    for (const d of mod.domains || []) if (!domainById.has(d)) errors.push(`${mod.id}: unknown exam domain ${d}`);
    if (!Array.isArray(mod.lesson) || !mod.lesson.length) errors.push(`${mod.id}: lesson missing`);
    else content.checkBlocks(mod.lesson, `${mod.id} lesson`, errors, []);
  }
  for (const cert of CERTS) {
    const sum = cert.domains.reduce((a, d) => a + d.weight, 0);
    if (sum !== 100) errors.push(`certification ${cert.id}: domain weights add up to ${sum}, not 100`);
    for (const d of cert.domains) for (const m of d.modules) if (!moduleById.has(m) && !content.ONLY) errors.push(`certification ${cert.id} › ${d.id}: unknown module ${m}`);
    for (const r of cert.requires) if (!CERTS.some((c) => c.id === r)) errors.push(`certification ${cert.id}: unknown prerequisite ${r}`);
    for (const d of cert.domains) for (const x of d.includes || []) if (!domainById.has(x) || cert.domains.some((y) => y.id === x)) errors.push(`certification ${cert.id} › ${d.id}: includes unknown or own domain ${x}`);
  }
  for (const pp of PRACTICE) {
    if (!/^[a-z0-9-]+$/.test(pp.id || '') || !pp.title || !pp.summary || !Array.isArray(pp.stages) || !pp.stages.length) errors.push(`practice path ${pp.id}: needs id, title, summary and stages`);
    for (const st of pp.stages || []) {
      if (!st.title || !Array.isArray(st.missions) || !st.missions.length) errors.push(`practice path ${pp.id}: every stage needs a title and missions`);
      for (const m of st.missions || []) if (!missionById.has(m) && !content.ONLY) errors.push(`practice path ${pp.id}: unknown mission ${m}`);
      for (const g of st.guides || []) if (!reference.guideById.has(g) && !content.ONLY) errors.push(`practice path ${pp.id}: unknown guide ${g}`);
    }
  }
  for (const m of missionById.values()) {
    for (const r of m.requires || []) if (!missionById.has(r)) errors.push(`${m.id} requires unknown mission ${r}`);
    if (m.open && !REF_ROOTS.has(m.open) && !refOwners[m.open]) errors.push(`${m.id} opens unknown ref ${m.open}`);
    for (const c of m.checks || []) {
      const deps = [c.parent, c.node, c.op === 'equalsRef' ? c.value : null,
        c.source && c.source.includes(':') && !c.source.startsWith('user.') ? c.source.split(':')[1] : null].filter(Boolean);
      for (const d of deps) if (!REF_ROOTS.has(d) && !refOwners[d]) errors.push(`${m.id}: check references unknown ref ${d}`);
      if (!c.label) errors.push(`${m.id}: check without label`);
      if (!HANDLERS[c.kind]) errors.push(`${m.id}: unknown check kind ${c.kind}`);
      if (c.kind === 'answer' && !ANSWER_SOURCES.includes(String(c.source).split(':')[0])) errors.push(`${m.id}: unknown answer source ${c.source}`);
      if ((c.kind === 'answer' || c.kind === 'nodeAnswer') && !(m.inputs || []).some((i) => i.key === c.input)) errors.push(`${m.id}: check reads unknown input ${c.input}`);
      if ('lenient' in c) errors.push(`${m.id}: "lenient" is no longer supported — every answer is checked against the live server`);
    }
    if (m.type === 'quiz') {
      m.questions.forEach((q, i) => {
        if (!(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.options.length)) errors.push(`${m.id}#${i}: bad answer index (module quizzes take one answer)`);
        if (!q.explain) errors.push(`${m.id}#${i}: explanation missing`);
      });
    }
    if (m.type === 'investigate' && !(m.inputs && m.inputs.length)) errors.push(`${m.id}: investigate mission without inputs`);
    if (m.type === 'practice' && !m.reflection) errors.push(`${m.id}: practice mission without reflection prompt`);
  }
  if (errors.length) throw new Error(`Curriculum errors:\n  ${errors.join('\n  ')}`);
})();

// Module quizzes show their options in a fixed order, and authors tend to put
// the right answer in the same place. Shuffle each question's options once,
// seeded by the question itself, so the order is stable across restarts (a
// quiz open in a browser stays gradable) but not predictable.
for (const m of missionById.values()) {
  if (m.type !== 'quiz') continue;
  m.questions.forEach((q, i) => {
    const seed = crypto.createHash('sha256').update(`${m.id}#${i}#${q.q}`).digest();
    const order = q.options.map((_, k) => k);
    for (let k = order.length - 1; k > 0; k--) {
      const j = seed[k] % (k + 1);
      [order[k], order[j]] = [order[j], order[k]];
    }
    const right = q.options[q.answer];
    q.options = order.map((k) => q.options[k]);
    q.answer = q.options.indexOf(right);
  });
}

// All quiz questions, for practice exams.
const questionBank = [];
for (const mod of MODULES) {
  for (const m of mod.missions) {
    if (m.type !== 'quiz') continue;
    m.questions.forEach((q, i) => questionBank.push({ id: `${m.id}#${i}`, track: mod.track, module: mod.id, moduleTitle: mod.title, ...q }));
  }
}
const questionById = new Map(questionBank.map((q) => [q.id, q]));

// Modules that prepare for an exam domain: those the certification lists, and
// those that name the domain themselves.
// A domain may `include` domains of another certification: their modules,
// guides and questions count for it too (used by skill paths).
const withIncluded = (id) => [id, ...(domainById.get(id).includes || [])];
const domainModules = new Map();
for (const [id] of domainById) {
  const ids = withIncluded(id);
  domainModules.set(id, [...new Set(ids.flatMap((x) => [...domainById.get(x).modules, ...MODULES.filter((m) => (m.domains || []).includes(x)).map((m) => m.id)]))].filter((m) => moduleById.has(m)));
}
const domainGuides = new Map([...domainById.keys()].map((id) => {
  const ids = withIncluded(id);
  return [id, reference.guides.filter((g) => g.domains.some((x) => ids.includes(x))).map((g) => g.id)];
}));

// Question pool per exam domain: the question bank's questions for it, plus the
// knowledge-check questions of its modules. Bank questions may have several
// correct answers (`answer: [0, 2]`).
const domainPool = new Map([...domainById.keys()].map((id) => [id, []]));
for (const q of reference.questions) {
  const id = `bank:${q.id}`;
  const d = domainById.get(q.domain);
  questionById.set(id, { ...q, id, bankId: q.id, moduleTitle: d.title });
  domainPool.get(q.domain).push(id);
}
for (const [id, mods] of domainModules) {
  for (const q of questionBank) if (mods.includes(q.module)) domainPool.get(id).push(q.id);
}
for (const [id, d] of domainById) {
  for (const x of d.includes || []) domainPool.get(id).push(...reference.questions.filter((q) => q.domain === x).map((q) => `bank:${q.id}`));
  domainPool.set(id, [...new Set(domainPool.get(id))]);
}

// Guides that deepen each module's lesson.
const moduleGuides = new Map(MODULES.map((m) => [m.id, reference.guides.filter((g) => g.modules.includes(m.id)).map((g) => g.id)]));

function renderAll(value, vars) {
  if (typeof value === 'string') return render(value, vars);
  if (Array.isArray(value)) return value.map((v) => renderAll(v, vars));
  return value;
}

// What the browser receives: rendered text, no answers, check labels only.
function publicMission(m, vars) {
  return {
    id: m.id, module: m.module, type: m.type, title: renderAll(m.title, vars), xp: m.xp,
    feature: m.feature || null, requires: m.requires || [], open: m.open || null,
    brief: renderAll(m.brief, vars), steps: renderAll(m.steps || [], vars), hints: renderAll(m.hints || [], vars),
    inputs: (m.inputs || []).map((i) => ({ key: i.key, label: renderAll(i.label, vars), placeholder: i.placeholder || '' })),
    checks: (m.checks || []).map((c) => renderAll(c.label, vars)),
    reflection: renderAll(m.reflection, vars), minWords: m.minWords || 8,
    questions: m.type === 'quiz' ? m.questions.map((q) => ({ q: q.q, options: q.options })) : undefined,
  };
}

// Exam domain titles for the browser: { id: { cert, short, title } }.
function publicDomains() {
  const out = {};
  for (const [id, d] of domainById) out[id] = { cert: d.cert, short: CERTS.find((c) => c.id === d.cert).short, title: d.title };
  return out;
}

function publicCurriculum(vars) {
  return {
    tracks: TRACKS,
    domains: publicDomains(),
    modules: MODULES.map((mod) => ({
      id: mod.id, track: mod.track, title: mod.title, source: mod.source, summary: mod.summary,
      feature: mod.feature || null, lesson: renderAll(mod.lesson, vars), keyPoints: renderAll(mod.keyPoints || [], vars),
      domains: [...domainModules].filter(([, mods]) => mods.includes(mod.id)).map(([d]) => d),
      visuals: reference.visuals[mod.id] || [],
      guides: moduleGuides.get(mod.id).map((id) => ({ id, title: reference.guideById.get(id).title, summary: reference.guideById.get(id).summary })),
      missions: mod.missions.map((m) => publicMission(m, vars)),
    })),
  };
}

module.exports = {
  TRACKS, MODULES, missionById, moduleOfMission, refOwners, questionBank, questionById, publicCurriculum, publicMission,
  publicDomains, CERTS, ROADMAP, PRACTICE, domainGuides, AREAS: content.AREAS, warnings: reference.warnings, domainById, domainModules, domainPool, moduleById,
  guides: reference.guides, guideById: reference.guideById, glossary: reference.glossary,
};
