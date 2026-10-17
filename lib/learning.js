'use strict';
// Learning paths, the handbook search and the exam simulator. Pure functions
// over the curriculum and a learner's progress file; server.js wires them to
// HTTP routes.

const crypto = require('crypto');

function shuffle(a) {
  const arr = a.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = crypto.randomInt(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const isDone = (st) => st && st.status === 'done';
const isResolved = (st) => st && (st.status === 'done' || st.status === 'skipped');

// ---------------------------------------------------------------- text

// Plain text of a block list, for search and reading time.
function blocksText(blocks) {
  const out = [];
  const add = (v) => {
    if (typeof v === 'string') out.push(v.replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '$2').replace(/\[\[([^\]]+)\]\]/g, '$1').replace(/\*\*|`/g, ''));
    else if (Array.isArray(v)) v.forEach(add);
    else if (v && typeof v === 'object') Object.values(v).forEach(add);
  };
  add(blocks);
  return out.join(' ');
}

const headingsOf = (blocks) => (blocks || []).filter((b) => b && typeof b === 'object' && b.h).map((b) => b.h);

// ---------------------------------------------------------------- search

function buildSearchIndex(cur) {
  const docs = [];
  for (const g of cur.guides) {
    docs.push({
      kind: 'guide', id: g.id, title: g.title, summary: g.summary, href: `#/guide/${g.id}`, area: g.area,
      fields: { title: g.title, tags: g.tags.join(' '), headings: headingsOf(g.body).join(' '), summary: g.summary, body: blocksText(g.body) },
    });
  }
  for (const t of cur.glossary) {
    docs.push({ kind: 'term', id: t.term, title: t.term, summary: t.def.replace(/\*\*|`|\[\[[^\]|]+\|?|\]\]/g, ''), href: `#/glossary?term=${encodeURIComponent(t.term)}`, area: t.area || null, guide: t.guide || null,
      fields: { title: t.term, tags: '', headings: '', summary: t.def, body: '' } });
  }
  for (const m of cur.MODULES) {
    docs.push({ kind: 'module', id: m.id, title: m.title, summary: m.summary, href: `#/module/${m.id}`, area: m.track,
      fields: { title: m.title, tags: '', headings: '', summary: m.summary, body: `${blocksText(m.lesson)} ${(m.keyPoints || []).join(' ')}` } });
    for (const x of m.missions) {
      if (typeof x.title !== 'string' || x.title.includes('{{')) continue;
      docs.push({ kind: 'mission', id: x.id, title: x.title, summary: m.title, href: `#/mission/${x.id}`, area: m.track,
        fields: { title: x.title, tags: '', headings: '', summary: x.brief || '', body: (x.steps || []).join(' ') } });
    }
  }
  for (const d of docs) for (const k of Object.keys(d.fields)) d.fields[k] = d.fields[k].toLowerCase();
  return docs;
}

const WEIGHTS = { title: 12, tags: 6, headings: 5, summary: 3, body: 1 };

function search(index, query, limit = 40) {
  const terms = String(query || '').toLowerCase().split(/[^\p{L}\p{N}]+/u).filter((t) => t.length > 1).slice(0, 8);
  if (!terms.length) return [];
  const phrase = String(query).toLowerCase().trim();
  const hits = [];
  for (const d of index) {
    let score = 0;
    let all = true;
    for (const t of terms) {
      let s = 0;
      for (const [f, w] of Object.entries(WEIGHTS)) {
        const text = d.fields[f];
        if (!text) continue;
        let n = 0;
        let i = text.indexOf(t);
        while (i !== -1 && n < 5) { n++; i = text.indexOf(t, i + t.length); }
        s += n * w;
      }
      if (!s) all = false;
      score += s;
    }
    if (!score || !all) continue;
    if (d.fields.title === phrase) score += 40;
    else if (d.fields.title.includes(phrase)) score += 15;
    if (d.kind === 'guide') score *= 1.3;
    hits.push({ d, score });
  }
  hits.sort((a, b) => b.score - a.score);
  return hits.slice(0, limit).map(({ d }) => ({ kind: d.kind, id: d.id, title: d.title, summary: d.summary, href: d.href, area: d.area, snippet: snippet(d, terms) }));
}

function snippet(d, terms) {
  const body = d.fields.body;
  if (!body) return null;
  const i = Math.min(...terms.map((t) => { const k = body.indexOf(t); return k === -1 ? Infinity : k; }));
  if (!Number.isFinite(i)) return null;
  const start = Math.max(0, i - 70);
  return `${start ? '…' : ''}${body.slice(start, i + 130).trim()}…`;
}

// ---------------------------------------------------------------- learning paths

// What a learner has done towards one exam domain.
function domainProgress(cur, progress, domainId) {
  const mods = cur.domainModules.get(domainId).map((id) => cur.moduleById.get(id));
  const missions = mods.flatMap((m) => m.missions);
  const guides = cur.domainGuides.get(domainId).map((id) => cur.guideById.get(id));
  const read = guides.filter((g) => progress.guides[g.id]).length;
  const done = missions.filter((m) => isDone(progress.missions[m.id])).length;
  const resolved = missions.filter((m) => isResolved(progress.missions[m.id])).length;
  const ds = progress.domains[domainId] || { answered: 0, correct: 0, recent: [] };
  const recent = ds.recent || [];
  // Accuracy over the last 30 answers, so improvement shows.
  const accuracy = recent.length ? recent.filter(Boolean).length / recent.length : null;
  const coverage = (guides.length + missions.length) ? (read + resolved) / (guides.length + missions.length) : 0;
  // Readiness: what you studied, weighed against how you score. Accuracy only
  // counts fully once you have answered enough questions to mean something.
  const conf = Math.min(1, recent.length / 10);
  const readiness = accuracy === null ? coverage * 0.5 : coverage * 0.4 + 0.6 * (accuracy * conf + coverage * 0.5 * (1 - conf));
  return {
    guides: { total: guides.length, read }, missions: { total: missions.length, done, resolved },
    answered: ds.answered, correct: ds.correct, recentCount: recent.length, accuracy, coverage, readiness,
    questions: cur.domainPool.get(domainId).length,
  };
}

function certProgress(cur, progress, cert) {
  const domains = cert.domains.map((d) => ({ id: d.id, weight: d.weight, ...domainProgress(cur, progress, d.id) }));
  const weighted = (k) => domains.reduce((a, d) => a + d.weight * (d[k] || 0), 0) / 100;
  const sims = progress.exams.filter((e) => e.cert === cert.id && e.mode === 'sim');
  const best = sims.reduce((b, e) => Math.max(b, Math.round((100 * e.correct) / e.total)), 0);
  return {
    readiness: Math.round(100 * weighted('readiness')), coverage: Math.round(100 * weighted('coverage')),
    domains, sims: sims.length, bestSim: sims.length ? best : null, passedSim: sims.some((e) => e.passed),
  };
}

// Guides first, then modules, then a drill: one step per domain, heaviest
// domains first within the foundations → applications order of the outline.
function studyPlan(cur, cert) {
  return cert.domains.map((d, i) => ({
    domain: d.id, title: d.title, weight: d.weight, order: i + 1,
    guides: cur.domainGuides.get(d.id),
    modules: cur.domainModules.get(d.id),
  }));
}

function pathSummary(cur, progress, cert) {
  const p = certProgress(cur, progress, cert);
  return {
    id: cert.id, short: cert.short, title: cert.title, level: cert.level, color: cert.color, summary: cert.summary,
    exam: cert.exam, requires: cert.requires, estimated: !!cert.estimated, kind: cert.kind || 'cert',
    domains: cert.domains.length, questions: new Set(cert.domains.flatMap((d) => cur.domainPool.get(d.id))).size,
    guides: new Set(cert.domains.flatMap((d) => cur.domainGuides.get(d.id))).size,
    readiness: p.readiness, coverage: p.coverage, sims: p.sims, bestSim: p.bestSim, passedSim: p.passedSim,
  };
}

function pathDetail(cur, progress, cert) {
  const p = certProgress(cur, progress, cert);
  const guideView = (g) => ({ id: g.id, title: g.title, summary: g.summary, level: g.level, minutes: g.minutes || null, read: !!progress.guides[g.id] });
  return {
    ...pathSummary(cur, progress, cert),
    audience: cert.audience, url: cert.url, courses: cert.courses, skills: cert.skills || [],
    requiresNote: cert.requiresNote || null, objectivesNote: cert.objectivesNote || null,
    requiresTitles: cert.requires.map((r) => { const c = cur.CERTS.find((x) => x.id === r); return { id: r, short: c.short, title: c.title }; }),
    domains: cert.domains.map((d, i) => ({
      id: d.id, title: d.title, weight: d.weight, objectives: d.objectives, ...p.domains[i],
      guides: cur.domainGuides.get(d.id).map((id) => guideView(cur.guideById.get(id))),
      modules: cur.domainModules.get(d.id).map((id) => {
        const m = cur.moduleById.get(id);
        return { id, title: m.title, track: m.track, total: m.missions.length, done: m.missions.filter((x) => isDone(progress.missions[x.id])).length };
      }),
    })),
    plan: studyPlan(cur, cert),
    history: progress.exams.filter((e) => e.cert === cert.id).slice(0, 12),
  };
}

// ---------------------------------------------------------------- exams

// How many questions each domain gets: proportional to its weight, largest
// remainders first, so the counts add up exactly.
function apportion(domains, count) {
  const raw = domains.map((d) => ({ id: d.id, exact: (d.weight * count) / 100 }));
  raw.forEach((r) => { r.n = Math.floor(r.exact); });
  let left = count - raw.reduce((a, r) => a + r.n, 0);
  for (const r of raw.slice().sort((a, b) => (b.exact - b.n) - (a.exact - a.n))) { if (left <= 0) break; r.n++; left--; }
  return raw;
}

// Picks questions for an exam: { qid, domain } in random order.
function drawExam(cur, cert, { domain, count }) {
  const used = new Set();
  const picked = [];
  const take = (domainId, n) => {
    for (const qid of shuffle(cur.domainPool.get(domainId))) {
      if (picked.length >= count || n <= 0) break;
      if (used.has(qid)) continue;
      used.add(qid);
      picked.push({ qid, domain: domainId });
      n--;
    }
  };
  if (domain) take(domain, count);
  else {
    for (const a of apportion(cert.domains, count)) take(a.id, a.n);
    // A domain with too few questions: fill up from the others, heaviest first.
    for (const d of cert.domains.slice().sort((a, b) => b.weight - a.weight)) take(d.id, count - picked.length);
  }
  return shuffle(picked);
}

const answerSet = (q) => (Array.isArray(q.answer) ? q.answer : [q.answer]);

// One question as the browser sees it: shuffled options, no answer.
function publicQuestion(cur, p) {
  const q = cur.questionById.get(p.qid);
  const d = p.domain ? cur.domainById.get(p.domain) : null;
  return { q: q.q, module: d ? d.title : q.moduleTitle, domain: p.domain || null, options: p.order.map((i) => q.options[i]), multi: Array.isArray(q.answer) ? q.answer.length : 0 };
}

function gradeQuestion(cur, p, given) {
  const q = cur.questionById.get(p.qid);
  const correctIdx = answerSet(q).map((a) => p.order.indexOf(a)).sort((a, b) => a - b);
  let chosen = null;
  if (Array.isArray(given)) chosen = [...new Set(given.map(Number).filter((n) => Number.isInteger(n) && n >= 0 && n < p.order.length))].sort((a, b) => a - b);
  else if (given !== null && given !== undefined && given !== '') chosen = [Number(given)];
  if (chosen && !chosen.length) chosen = null;
  const correct = !!chosen && chosen.length === correctIdx.length && chosen.every((c, i) => c === correctIdx[i]);
  const multi = Array.isArray(q.answer);
  return {
    q: q.q, module: publicQuestion(cur, p).module, domain: p.domain || null, options: p.order.map((k) => q.options[k]),
    chosen: multi ? chosen : chosen ? chosen[0] : null, answer: multi ? correctIdx : correctIdx[0], multi: multi ? correctIdx.length : 0,
    correct, explain: q.explain, guide: q.guide && cur.guideById.has(q.guide) ? { id: q.guide, title: cur.guideById.get(q.guide).title } : null,
  };
}

// Remembers how the learner does per exam domain (the last 30 answers count
// towards readiness).
function recordDomains(progress, review) {
  for (const r of review) {
    if (!r.domain) continue;
    const ds = progress.domains[r.domain] || { answered: 0, correct: 0, recent: [] };
    ds.answered++;
    if (r.correct) ds.correct++;
    ds.recent = [...(ds.recent || []), r.correct ? 1 : 0].slice(-30);
    progress.domains[r.domain] = ds;
  }
}

// ---------------------------------------------------------------- practice paths

// A practice path: hands-on missions in the learner's own Content Server, in
// the order that builds a working setup, grouped into stages.
function practiceView(cur, progress, pp, detail) {
  const scan = progress.lastScan;
  const missionView = (id) => {
    const m = cur.missionById.get(id);
    const mod = cur.moduleOfMission.get(id);
    const st = progress.missions[id];
    const feature = m.feature || mod.feature;
    return {
      id, title: m.title, type: m.type, brief: m.brief || null, module: mod.id, moduleTitle: mod.title,
      status: st ? st.status || null : null, locked: (m.requires || []).some((r) => !isDone(progress.missions[r])),
      featureStatus: feature && scan && scan.features[feature] ? scan.features[feature].status : null,
    };
  };
  const stages = pp.stages.map((s) => ({
    title: s.title, summary: s.summary || null,
    missions: s.missions.filter((id) => cur.missionById.has(id)).map(missionView),
    guides: (s.guides || []).filter((id) => cur.guideById.has(id)).map((id) => ({ id, title: cur.guideById.get(id).title, read: !!progress.guides[id] })),
  }));
  const all = stages.flatMap((s) => s.missions);
  const done = all.filter((m) => m.status === 'done').length;
  const next = all.find((m) => m.status !== 'done' && m.status !== 'skipped' && !m.locked && m.featureStatus !== 'not-detected') || null;
  const base = {
    id: pp.id, title: pp.title, summary: pp.summary, level: pp.level || 'basic', color: pp.color || '#0f6e62', needs: pp.needs || null,
    stages: pp.stages.length, total: all.length, done, next: next && { id: next.id, title: next.title },
  };
  return detail ? { ...base, intro: pp.intro || null, stages } : base;
}

module.exports = {
  practiceView,
  shuffle, blocksText, buildSearchIndex, search, certProgress, pathSummary, pathDetail, apportion, drawExam, publicQuestion, gradeQuestion, recordDomains,
};
