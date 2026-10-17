'use strict';
// Reference content: handbook guides, the exam question bank, the glossary and
// extra lesson visuals. The format is described in curriculum/CONTENT.md.
// Everything is validated here so an authoring mistake stops the server with a
// clear message instead of rendering a broken page.

const fs = require('fs');
const path = require('path');

const AREAS = {
  platform: 'Platform & architecture',
  user: 'Documents & everyday work',
  collab: 'Collaboration',
  workspaces: 'Business workspaces',
  bizadmin: 'Business administration',
  sysadmin: 'System administration',
  dev: 'Development',
  analyst: 'Solution design',
  cloud: 'OpenText Cloud',
};
const LEVELS = ['basic', 'intermediate', 'advanced'];
const CALLOUTS = ['tip', 'note', 'warn', 'exam', 'remember'];
const CODE_LANGS = ['oscript', 'sql', 'http', 'json', 'js', 'xml', 'text', 'shell', 'html', 'weblingo'];
const TREE_ICONS = ['folder', 'doc', 'workspace', 'volume', 'group', 'user', 'category', 'workflow', 'project', 'shortcut',
  'compound', 'email', 'record', 'classification', 'template', 'page', 'server', 'db', 'search', 'wiki', 'collection', 'form', 'report', 'module', 'hold'];
const FLOW_KINDS = ['step', 'start', 'end', 'decision', 'actor', 'system'];
const TONES = ['accent', 'info', 'xp', 'warn', 'pass', 'fail'];

const isStr = (v) => typeof v === 'string' && v.trim().length > 0;
const strOrLabel = (v) => isStr(v) || (v && isStr(v.label));

// ---------------------------------------------------------------- blocks

function checkInline(text, where, errors, refs) {
  if (typeof text !== 'string') { errors.push(`${where}: expected text`); return; }
  const re = /\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g;
  let m;
  while ((m = re.exec(text))) refs.push({ id: m[1].trim(), where });
  if ((text.match(/\*\*/g) || []).length % 2) errors.push(`${where}: unbalanced ** in “${text.slice(0, 50)}…”`);
}

function checkDiagram(d, where, errors, refs) {
  const bad = (msg) => errors.push(`${where} (${d && d.type}): ${msg}`);
  if (!d || typeof d !== 'object') return errors.push(`${where}: figure must be an object`);
  switch (d.type) {
    case 'flow':
      if (!Array.isArray(d.steps) || d.steps.length < 2) return bad('needs at least 2 steps');
      d.steps.forEach((s, i) => {
        if (!strOrLabel(s)) bad(`step ${i} needs a label`);
        if (s && s.kind && !FLOW_KINDS.includes(s.kind)) bad(`step ${i}: kind must be one of ${FLOW_KINDS.join(', ')}`);
      });
      break;
    case 'tree': {
      let count = 0;
      const walk = (n, depth) => {
        count++;
        if (!n || !isStr(n.label)) return bad('every tree node needs a label');
        if (n.icon && !TREE_ICONS.includes(n.icon)) bad(`unknown icon “${n.icon}” (use ${TREE_ICONS.join(', ')})`);
        if (depth > 6) bad('tree deeper than 6 levels');
        (n.children || []).forEach((c) => walk(c, depth + 1));
      };
      walk(d.root, 0);
      if (count > 60) bad('tree has more than 60 nodes');
      break;
    }
    case 'layers':
      if (!Array.isArray(d.layers) || !d.layers.length) return bad('needs layers');
      d.layers.forEach((l, i) => { if (!isStr(l.label)) bad(`layer ${i} needs a label`); if (l.items && !Array.isArray(l.items)) bad(`layer ${i}: items must be a list`); });
      break;
    case 'matrix':
      if (!Array.isArray(d.cols) || !Array.isArray(d.rows)) return bad('needs cols and rows');
      d.rows.forEach((r, i) => { if (!isStr(r.label) || !Array.isArray(r.cells) || r.cells.length !== d.cols.length) bad(`row ${i} needs a label and ${d.cols.length} cells`); });
      break;
    case 'compare':
      if (!Array.isArray(d.items) || d.items.length < 2 || d.items.length > 4) return bad('needs 2–4 items');
      d.items.forEach((it, i) => {
        if (!isStr(it.title) || !Array.isArray(it.points)) bad(`item ${i} needs a title and points`);
        if (it.tone && !TONES.includes(it.tone)) bad(`item ${i}: tone must be one of ${TONES.join(', ')}`);
        (it.points || []).forEach((p, k) => checkInline(p, `${where} item ${i} point ${k}`, errors, refs));
      });
      break;
    case 'cycle':
    case 'hub': {
      const list = d.type === 'cycle' ? d.steps : d.items;
      if (!Array.isArray(list) || list.length < 3 || list.length > 10) return bad(`needs 3–10 ${d.type === 'cycle' ? 'steps' : 'items'}`);
      list.forEach((s, i) => { if (!strOrLabel(s)) bad(`entry ${i} needs a label`); });
      if (d.type === 'hub' && !isStr(d.center)) bad('needs a center');
      break;
    }
    case 'ladder':
      if (!Array.isArray(d.steps) || d.steps.length < 2 || d.steps.length > 10) return bad('needs 2–10 steps');
      d.steps.forEach((s, i) => { if (!strOrLabel(s)) bad(`step ${i} needs a label`); });
      break;
    case 'menu':
      if (!isStr(d.title) || !Array.isArray(d.items) || !d.items.length) return bad('needs a title and items');
      if (d.highlight && !d.items.includes(d.highlight)) bad(`highlight “${d.highlight}” is not one of the items`);
      break;
    case 'timeline':
      if (!Array.isArray(d.items) || d.items.length < 2) return bad('needs at least 2 items');
      d.items.forEach((it, i) => { if (!isStr(it.label)) bad(`item ${i} needs a label`); });
      break;
    case 'lanes':
      if (!Array.isArray(d.lanes) || !d.lanes.length) return bad('needs lanes');
      {
        const width = Math.max(...d.lanes.map((l) => (l.cells || []).length));
        if (width < 2 || width > 8) bad('lanes need 2–8 columns');
        d.lanes.forEach((l, i) => { if (!isStr(l.label) || !Array.isArray(l.cells)) bad(`lane ${i} needs a label and cells`); });
      }
      break;
    default:
      bad(`unknown figure type (use flow, tree, layers, matrix, compare, cycle, hub, ladder, menu, timeline, lanes)`);
  }
}

function checkBlocks(blocks, where, errors, refs, depth = 0) {
  if (!Array.isArray(blocks) || !blocks.length) { errors.push(`${where}: body must be a non-empty list`); return; }
  blocks.forEach((b, i) => {
    const at = `${where}[${i}]`;
    if (typeof b === 'string') return checkInline(b, at, errors, refs);
    if (!b || typeof b !== 'object') return errors.push(`${at}: unknown block`);
    const keys = Object.keys(b);
    const kind = ['h', 'h3', 'ul', 'ol', 'steps', 'tabs', 'callout', 'table', 'path', 'code', 'figure', 'p'].find((k) => k in b);
    switch (kind) {
      case 'p': return checkInline(b.p, at, errors, refs);
      case 'h': case 'h3': if (!isStr(b[kind])) errors.push(`${at}: empty heading`); return;
      case 'ul': case 'ol': case 'steps':
        if (!Array.isArray(b[kind]) || !b[kind].length) return errors.push(`${at}: ${kind} must be a non-empty list`);
        return b[kind].forEach((t, k) => checkInline(t, `${at}.${kind}[${k}]`, errors, refs));
      case 'tabs':
        if (depth > 0) return errors.push(`${at}: tabs cannot be nested`);
        if (!Array.isArray(b.tabs) || b.tabs.length < 2) return errors.push(`${at}: tabs need at least 2 tabs`);
        return b.tabs.forEach((t, k) => { if (!isStr(t.label)) errors.push(`${at}.tabs[${k}]: label missing`); checkBlocks(t.body, `${at}.tabs[${k}]`, errors, refs, depth + 1); });
      case 'callout':
        if (!CALLOUTS.includes(b.callout)) return errors.push(`${at}: callout must be one of ${CALLOUTS.join(', ')}`);
        if (Array.isArray(b.text)) b.text.forEach((t, k) => checkInline(t, `${at}.text[${k}]`, errors, refs));
        else checkInline(b.text, `${at}.text`, errors, refs);
        return;
      case 'table': {
        const t = b.table;
        if (!t || !Array.isArray(t.head) || !Array.isArray(t.rows)) return errors.push(`${at}: table needs head and rows`);
        return t.rows.forEach((r, k) => {
          if (!Array.isArray(r) || r.length !== t.head.length) errors.push(`${at}: row ${k} has ${r && r.length} cells, head has ${t.head.length}`);
          else r.forEach((c) => checkInline(String(c), `${at} row ${k}`, errors, refs));
        });
      }
      case 'path': if (!Array.isArray(b.path) || !b.path.every(isStr)) errors.push(`${at}: path must be a list of menu labels`); return;
      case 'code':
        if (!isStr(b.code)) return errors.push(`${at}: empty code block`);
        if (b.lang && !CODE_LANGS.includes(b.lang)) errors.push(`${at}: lang must be one of ${CODE_LANGS.join(', ')}`);
        return;
      case 'figure': return checkDiagram(b.figure, at, errors, refs);
      default: errors.push(`${at}: unknown block with keys ${keys.join(', ')}`);
    }
  });
}

// ---------------------------------------------------------------- loading

// CSA_ONLY=guides/x.js,questions/x.js limits loading to those files (used by
// `tools/check-content.js --only` while several people write content at once).
const ONLY = process.env.CSA_ONLY ? process.env.CSA_ONLY.split(',').map((s) => s.trim().replace(/^curriculum\//, '')) : null;

function loadDir(dir) {
  const full = path.join(__dirname, dir);
  if (!fs.existsSync(full)) return [];
  return fs.readdirSync(full).filter((f) => f.endsWith('.js')).sort()
    .filter((f) => !ONLY || ONLY.includes(`${dir}/${f}`))
    .map((f) => ({ file: `${dir}/${f}`, data: require(path.join(full, f)) }));
}

function load({ domainIds, moduleIds }) {
  const errors = [];
  const warnings = [];
  const refs = [];
  // With CSA_ONLY, links to guides and modules in files that weren't loaded are only warnings.
  const missing = (msg) => (ONLY ? warnings : errors).push(msg);

  // ---- guides
  const guides = [];
  const guideById = new Map();
  for (const { file, data } of loadDir('guides')) {
    if (!Array.isArray(data)) { errors.push(`${file} must export a list of guides`); continue; }
    for (const g of data) {
      const at = `${file} › ${g && g.id}`;
      if (!g || !/^[a-z0-9][a-z0-9-]*$/.test(g.id || '')) { errors.push(`${file}: guide id “${g && g.id}” must be kebab-case`); continue; }
      if (guideById.has(g.id)) errors.push(`${at}: duplicate guide id (also in ${guideById.get(g.id).file})`);
      if (!isStr(g.title)) errors.push(`${at}: title missing`);
      if (!isStr(g.summary)) errors.push(`${at}: summary missing`);
      if (!AREAS[g.area]) errors.push(`${at}: area must be one of ${Object.keys(AREAS).join(', ')}`);
      if (g.level && !LEVELS.includes(g.level)) errors.push(`${at}: level must be one of ${LEVELS.join(', ')}`);
      for (const d of g.domains || []) if (!domainIds.has(d)) errors.push(`${at}: unknown exam domain ${d}`);
      for (const m of g.modules || []) if (!moduleIds.has(m)) missing(`${at}: unknown module ${m}`);
      for (const r of g.related || []) refs.push({ id: r, where: `${at} related` });
      checkBlocks(g.body, at, errors, refs);
      g.file = file;
      g.domains = g.domains || [];
      g.modules = g.modules || [];
      g.tags = g.tags || [];
      g.related = g.related || [];
      g.level = g.level || 'intermediate';
      guides.push(g);
      guideById.set(g.id, g);
    }
  }

  // Optional `order` puts key guides first within their area (default 50; stable sort).
  guides.sort((a, b) => (a.order || 50) - (b.order || 50));

  // ---- question bank
  const questions = [];
  const seenQ = new Map();
  for (const { file, data } of loadDir('questions')) {
    if (!Array.isArray(data)) { errors.push(`${file} must export a list of questions`); continue; }
    data.forEach((q, i) => {
      const at = `${file} › ${(q && q.id) || `#${i}`}`;
      if (!q || !isStr(q.id)) return errors.push(`${file} #${i}: question id missing`);
      if (seenQ.has(q.id)) errors.push(`${at}: duplicate question id (also in ${seenQ.get(q.id)})`);
      seenQ.set(q.id, file);
      if (!domainIds.has(q.domain)) errors.push(`${at}: unknown exam domain ${q.domain}`);
      if (!isStr(q.q)) errors.push(`${at}: question text missing`);
      if (!Array.isArray(q.options) || q.options.length < 2 || q.options.length > 6 || !q.options.every(isStr)) errors.push(`${at}: needs 2–6 options`);
      else if (new Set(q.options).size !== q.options.length) errors.push(`${at}: duplicate options`);
      const n = (q.options || []).length;
      if (Array.isArray(q.answer)) {
        if (q.answer.length < 2 || !q.answer.every((a) => Number.isInteger(a) && a >= 0 && a < n) || new Set(q.answer).size !== q.answer.length) errors.push(`${at}: answer list must hold 2+ distinct option indexes`);
        if (!/choose|select/i.test(q.q)) errors.push(`${at}: multiple-answer question must say how many to choose, e.g. “(Choose two.)”`);
      } else if (!(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < n)) errors.push(`${at}: bad answer index`);
      if (!isStr(q.explain)) errors.push(`${at}: explanation missing`);
      if (q.guide) refs.push({ id: q.guide, where: `${at} guide` });
      questions.push(q);
    });
  }

  // ---- glossary
  const glossary = [];
  const seenTerm = new Map();
  for (const { file, data } of loadDir('glossary')) {
    if (!Array.isArray(data)) { errors.push(`${file} must export a list of terms`); continue; }
    for (const t of data) {
      const at = `${file} › ${t && t.term}`;
      if (!t || !isStr(t.term) || !isStr(t.def)) { errors.push(`${at}: term and def are required`); continue; }
      const key = t.term.toLowerCase();
      if (seenTerm.has(key)) { errors.push(`${at}: duplicate term (also in ${seenTerm.get(key)})`); continue; }
      seenTerm.set(key, file);
      if (t.area && !AREAS[t.area]) errors.push(`${at}: unknown area ${t.area}`);
      if (t.guide) refs.push({ id: t.guide, where: `${at} guide` });
      checkInline(t.def, at, errors, refs);
      glossary.push(t);
    }
  }
  glossary.sort((a, b) => a.term.localeCompare(b.term, 'en', { sensitivity: 'base' }));

  // ---- lesson visuals for modules: { moduleId: [blocks] }
  const visuals = {};
  const vfile = path.join(__dirname, 'lesson-visuals.js');
  if (fs.existsSync(vfile) && (!ONLY || ONLY.includes('lesson-visuals.js'))) {
    const v = require(vfile);
    for (const [mid, blocks] of Object.entries(v)) {
      if (!moduleIds.has(mid)) missing(`lesson-visuals.js: unknown module ${mid}`);
      checkBlocks(blocks, `lesson-visuals.js › ${mid}`, errors, refs);
      visuals[mid] = blocks;
    }
  }

  for (const r of refs) if (!guideById.has(r.id)) missing(`${r.where}: links to unknown guide “${r.id}”`);
  return { errors, warnings, guides, guideById, questions, glossary, visuals };
}

module.exports = { load, checkBlocks, AREAS, TREE_ICONS, ONLY };
