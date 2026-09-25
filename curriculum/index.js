'use strict';
// Loads the three tracks, validates them, and builds lookup tables.

const { render } = require('../lib/verifier');

const TRACKS = [
  { id: 'user', title: 'Business User', exam: '5-0158', blurb: 'Everyday document management — the foundation for every other track.' },
  { id: 'collab', title: 'Collaboration', exam: '5-0158 / 5-0159', blurb: 'Workflows, work items, projects, communities and social features.' },
  { id: 'admin', title: 'Analyst & Administrator', exam: '5-0155 / 5-0156', blurb: 'Architecture, administration, records, workflow design and Extended ECM.' },
];

const MODULES = [
  ...require('./track-user'),
  ...require('./track-collab'),
  ...require('./track-admin'),
];

const TYPE_XP = { 'hands-on': 30, investigate: 20, quiz: 20, practice: 15 };
const REF_ROOTS = new Set(['personal', 'enterprise', 'categoriesVolume']);

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
(function validate() {
  const errors = [];
  for (const m of missionById.values()) {
    for (const r of m.requires || []) if (!missionById.has(r)) errors.push(`${m.id} requires unknown mission ${r}`);
    if (m.open && !REF_ROOTS.has(m.open) && !refOwners[m.open]) errors.push(`${m.id} opens unknown ref ${m.open}`);
    for (const c of m.checks || []) {
      const deps = [c.parent, c.node, c.op === 'equalsRef' ? c.value : null,
        c.source && c.source.includes(':') && !c.source.startsWith('user.') ? c.source.split(':')[1] : null].filter(Boolean);
      for (const d of deps) if (!REF_ROOTS.has(d) && !refOwners[d]) errors.push(`${m.id}: check references unknown ref ${d}`);
      if (!c.label) errors.push(`${m.id}: check without label`);
    }
    if (m.type === 'quiz') {
      m.questions.forEach((q, i) => {
        if (!(q.answer >= 0 && q.answer < q.options.length)) errors.push(`${m.id}#${i}: bad answer index`);
      });
    }
    if (m.type === 'investigate' && !(m.inputs && m.inputs.length)) errors.push(`${m.id}: investigate mission without inputs`);
    if (m.type === 'practice' && !m.reflection) errors.push(`${m.id}: practice mission without reflection prompt`);
  }
  if (errors.length) throw new Error(`Curriculum errors:\n  ${errors.join('\n  ')}`);
})();

// All quiz questions, for practice exams.
const questionBank = [];
for (const mod of MODULES) {
  for (const m of mod.missions) {
    if (m.type !== 'quiz') continue;
    m.questions.forEach((q, i) => questionBank.push({ id: `${m.id}#${i}`, track: mod.track, module: mod.id, moduleTitle: mod.title, ...q }));
  }
}
const questionById = new Map(questionBank.map((q) => [q.id, q]));

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

function publicCurriculum(vars) {
  return {
    tracks: TRACKS,
    modules: MODULES.map((mod) => ({
      id: mod.id, track: mod.track, title: mod.title, source: mod.source, summary: mod.summary,
      feature: mod.feature || null, lesson: renderAll(mod.lesson, vars), keyPoints: renderAll(mod.keyPoints || [], vars),
      missions: mod.missions.map((m) => publicMission(m, vars)),
    })),
  };
}

module.exports = { TRACKS, MODULES, missionById, moduleOfMission, refOwners, questionBank, questionById, publicCurriculum, publicMission };
