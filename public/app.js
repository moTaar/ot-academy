/* CS Academy — single-page front end. Plain JavaScript, no build step. */
(() => {
  'use strict';

  // ------------------------------------------------------------ html helpers
  // h`` escapes every interpolated value unless it was produced by h`` / raw().
  class Raw { constructor(s) { this.s = s; } }
  const raw = (s) => new Raw(s);
  const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ESC[c]);
  const fmt = (v) => (v instanceof Raw ? v.s : Array.isArray(v) ? v.map(fmt).join('') : v === null || v === undefined || v === false ? '' : esc(v));
  const h = (strings, ...vals) => raw(strings.reduce((out, s, i) => out + s + (i < vals.length ? fmt(vals[i]) : ''), ''));
  const put = (el, tpl) => { el.innerHTML = fmt(tpl); };
  const linkify = (text) => raw(esc(text || '').replace(/https?:\/\/[^\s<]+/g, (u) => {
    const clean = u.replace(/[.,;:)\]”]+$/, '');
    return `<a href="${clean}" target="_blank" rel="noopener">${clean}</a>${u.slice(clean.length)}`;
  }));
  const $ = (sel, root = document) => root.querySelector(sel);
  // DOM calls below stick to what Internet Explorer 11 supports natively
  // (no closest/append/remove/isConnected); see tools/build-legacy.js.
  const $$ = (sel, root = document) => Array.prototype.slice.call(root.querySelectorAll(sel));
  const pct = (a, b) => (b ? Math.round((100 * a) / b) : 0);
  const initials = (name) => (name || '?').split(/\s+/).map((p) => p[0]).slice(0, 2).join('').toUpperCase();
  const when = (iso) => { try { return new Date(iso).toLocaleString(); } catch { return iso; } };
  const ago = (iso) => {
    const s = (Date.now() - new Date(iso).getTime()) / 1000;
    if (s < 60) return 'just now';
    if (s < 3600) return `${Math.round(s / 60)} min ago`;
    if (s < 86400) return `${Math.round(s / 3600)} h ago`;
    return `${Math.round(s / 86400)} d ago`;
  };

  // ------------------------------------------------------------ icons
  const ICONS = {
    home: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
    map: '<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z"/><path d="M9 4v14M15 6v14"/>',
    book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5Z"/><path d="M4 19a2 2 0 0 1 2-2h13"/>',
    exam: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h3"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6"/>',
    logout: '<path d="M15 4h4v16h-4"/><path d="M10 8l-4 4 4 4M6 12h10"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    bulb: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1.1 2h5c.1-.8.5-1.5 1.1-2A6 6 0 0 0 12 3Z"/>',
    external: '<path d="M14 4h6v6M20 4l-9 9"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
    refresh: '<path d="M20 11a8 8 0 0 0-14.3-4.9L4 8"/><path d="M4 4v4h4M4 13a8 8 0 0 0 14.3 4.9L20 16"/><path d="M20 20v-4h-4"/>',
    play: '<path d="M8 5v14l11-7L8 5Z"/>',
    skip: '<path d="M5 5v14l9-7-9-7ZM18 5v14"/>',
    question: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14M12 17.5v.01"/>',
    dash: '<path d="M7 12h10"/>',
    moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    back: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/>',
    flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
    alert: '<path d="M12 4 2.5 20h19L12 4Z"/><path d="M12 10v4.5M12 17.5v.01"/>',
    server: '<rect x="3.5" y="4" width="17" height="7" rx="1.5"/><rect x="3.5" y="13" width="17" height="7" rx="1.5"/><path d="M7.5 7.5h.01M7.5 16.5h.01"/>',
    cap: '<path d="M2 9l10-5 10 5-10 5L2 9Z"/><path d="M6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5M22 9v6"/>',
    guide: '<path d="M12 6c-2-1.5-5-2-8-2v14c3 0 6 .5 8 2 2-1.5 5-2 8-2V4c-3 0-6 .5-8 2Z"/><path d="M12 6v14"/>',
    az: '<path d="M3 18 7 6l4 12M4.4 14h5.2M14 7h6l-6 10h6"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    down: '<path d="M12 5v14M6 13l6 6 6-6"/>',
    list: '<path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.01"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r=".8"/>',
    pin: '<path d="M12 21s-6-5.6-6-10a6 6 0 0 1 12 0c0 4.4-6 10-6 10Z"/><circle cx="12" cy="11" r="2"/>',
    folder: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"/>',
    doc: '<path d="M6 3h8l4 4v14H6V3Z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
    workspace: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M3 12h18"/>',
    volume: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M7 6.5h.01"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    tag: '<path d="M3 12V4h8l10 10-8 8L3 12Z"/><circle cx="7.5" cy="8.5" r="1.5"/>',
    workflow: '<circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><rect x="15" y="3.5" width="6" height="5" rx="1"/><path d="M8.5 6H15M18 8.5v7M6 8.5V14a4 4 0 0 0 4 4h5.5"/>',
    shortcut: '<path d="M14 4h6v6M20 4l-9 9"/><path d="M10 6H5v13h13v-5"/>',
    compound: '<rect x="7" y="3" width="13" height="15" rx="1.5"/><path d="M4 7v13a1 1 0 0 0 1 1h11"/>',
    email: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    record: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 3v5l2-1.5L12 8V3M8 13h8M8 17h5"/>',
    classification: '<rect x="3" y="3" width="7" height="5" rx="1"/><rect x="14" y="10" width="7" height="5" rx="1"/><rect x="14" y="17" width="7" height="4" rx="1"/><path d="M6.5 8v4.5H14M6.5 12.5V19H14"/>',
    template: '<rect x="3" y="3" width="18" height="18" rx="2" stroke-dasharray="3 2.5"/><path d="M8 9h8M8 13h8M8 17h5"/>',
    page: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M4 8h16M8 12h8M8 16h6"/>',
    db: '<ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
    collection: '<rect x="3" y="8" width="18" height="12" rx="2"/><path d="M6 5h12M8 2h8"/>',
    form: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h3M13 12h3M8 16h8"/>',
    module: '<path d="M12 3 4 7v10l8 4 8-4V7l-8-4Z"/><path d="m4 7 8 4 8-4M12 11v10"/>',
  };
  // Icons for tree diagram nodes (see curriculum/CONTENT.md).
  const TREE_ICON = { folder: 'folder', doc: 'doc', workspace: 'workspace', volume: 'volume', group: 'users', user: 'user', category: 'tag', workflow: 'workflow', project: 'flag', shortcut: 'shortcut',
    compound: 'compound', email: 'email', record: 'record', classification: 'classification', template: 'template', page: 'page', server: 'server', db: 'db', search: 'search', wiki: 'guide', collection: 'collection', form: 'form', report: 'chart', module: 'module', hold: 'lock' };
  // width/height attributes are defaults for browsers (IE11) that otherwise draw
  // unsized SVG at 300×150; CSS rules set the real size per context.
  const icon = (name) => raw(`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]}</svg>`);
  const HAT = raw('<svg width="24" height="24" viewBox="0 0 32 32" aria-hidden="true"><path d="M16 7 3 13l13 6 13-6-13-6Z" fill="#fff"/><path d="M8.5 16v5.5c0 2 3.4 4 7.5 4s7.5-2 7.5-4V16L16 19.5 8.5 16Z" fill="#bfe9e2"/><path d="M27 13.5v6" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/></svg>');
  const TRACK_COLORS = { user: '#0f6e62', collab: '#2c5cc5', admin: '#a55a0b', bizadmin: '#3b7f99', sysadmin: '#b0471f', dev: '#7a3fb0', analyst: '#b0306a' };
  const medal = (color) => raw(`<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M13 3h14l-4 12h-6L13 3Z" fill="${color}" opacity=".35"/><circle cx="20" cy="24" r="11" fill="${color}"/><path d="m20 17.5 2 4.1 4.5.6-3.3 3.1.8 4.5-4-2.2-4 2.2.8-4.5-3.3-3.1 4.5-.6 2-4.1Z" fill="#fff"/></svg>`);
  const ring = (p) => {
    const r = 52; const c = 2 * Math.PI * r;
    return raw(`<svg class="score-ring" viewBox="0 0 120 120" role="img" aria-label="${p}%"><circle class="ring-track" cx="60" cy="60" r="${r}" fill="none" stroke-width="10"/><circle class="ring-value" cx="60" cy="60" r="${r}" fill="none" stroke-width="10" stroke-linecap="round" stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${(c * (1 - p / 100)).toFixed(1)}" transform="rotate(-90 60 60)"/><text class="ring-text" x="60" y="68" text-anchor="middle" font-size="26" font-weight="700">${p}%</text></svg>`);
  };

  const TYPE = {
    'hands-on': { label: 'Hands-on', cls: 'accent', how: 'Checked live: I read your Content Server through its REST API. It only counts once I have seen the result there.' },
    investigate: { label: 'Investigation', cls: 'info', how: 'Checked live: your answers are compared with the values your Content Server returns.' },
    quiz: { label: 'Knowledge check', cls: 'xp', how: 'Graded by the trainer. Answer at least 60% correctly to pass.' },
    practice: { label: 'Practice', cls: '', how: 'Not checked on the server — the REST API can\'t see this, so you explain what you did in your own words.' },
  };
  const hostOf = (url) => { const m = /^[a-z]+:\/\/([^/?#]+)/i.exec(url || ''); return m ? m[1] : url || ''; };
  const FEATURE_STATUS = {
    detected: { label: 'Detected', cls: 'pass' },
    'not-detected': { label: 'Not detected', cls: '' },
    unknown: { label: 'Unknown', cls: 'warn' },
  };

  // ------------------------------------------------------------ rich content
  // Renders the blocks and diagrams described in curriculum/CONTENT.md.

  // Guide titles for [[guide-id]] links, filled from /api/guides.
  const guideTitles = {};
  const humanize = (id) => id.replace(/^[a-z]+-/, '').replace(/-/g, ' ');
  // Inline markup: **bold**, `code`, [[guide-id]] / [[guide-id|text]]. Everything else is escaped.
  const inl = (text) => raw(esc(text || '')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, id, label) => {
      const key = id.trim();
      return `<a href="#/guide/${encodeURIComponent(key)}">${label || esc(guideTitles[key] || humanize(key))}</a>`;
    }));
  const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const asNode = (s) => (typeof s === 'string' ? { label: s } : s);

  const CALLOUT = {
    tip: { icon: 'bulb', title: 'Tip' },
    note: { icon: 'info', title: 'Note' },
    warn: { icon: 'alert', title: 'Watch out' },
    exam: { icon: 'target', title: 'Exam focus' },
    remember: { icon: 'pin', title: 'Remember' },
  };

  function blocks(list) { return h`${(list || []).map(block)}`; }

  function block(b) {
    if (typeof b === 'string') return h`<p>${inl(b)}</p>`;
    if (!b) return '';
    if ('p' in b) return h`<p>${inl(b.p)}</p>`;
    if (b.h) return h`<h2 class="g-h" id="s-${slug(b.h)}">${b.h}</h2>`;
    if (b.h3) return h`<h3 class="g-h3">${b.h3}</h3>`;
    if (b.ul) return h`<ul class="g-list">${b.ul.map((t) => h`<li>${inl(t)}</li>`)}</ul>`;
    if (b.ol) return h`<ol class="g-list">${b.ol.map((t) => h`<li>${inl(t)}</li>`)}</ol>`;
    if (b.steps) {
      return h`<div class="proc">
        <div class="proc-head">${icon('list')}<span>${b.title || 'How to do it'}</span>${b.ui ? h`<span class="pill info">${b.ui}</span>` : ''}</div>
        <ol class="steps">${b.steps.map((s) => h`<li>${inl(s)}</li>`)}</ol></div>`;
    }
    if (b.tabs) {
      return h`<div class="tabset">
        <div class="tabset-bar" role="tablist">${b.tabs.map((t, i) => h`<button type="button" role="tab" data-tab="${i}" class="${i ? '' : 'active'}" aria-selected="${i ? 'false' : 'true'}">${t.label}</button>`)}</div>
        ${b.tabs.map((t, i) => h`<div class="tabset-panel${i ? ' hidden' : ''}" role="tabpanel" data-panel="${i}">${blocks(t.body)}</div>`)}</div>`;
    }
    if (b.callout) {
      const c = CALLOUT[b.callout] || CALLOUT.note;
      const text = Array.isArray(b.text) ? b.text : [b.text];
      return h`<div class="callout ${b.callout}">${icon(c.icon)}<div><div class="callout-t">${b.title || c.title}</div>${text.map((t) => h`<p>${inl(t)}</p>`)}</div></div>`;
    }
    if (b.table) {
      const t = b.table;
      return h`<div class="g-table-wrap"><table class="table g-table">${t.caption ? h`<caption>${t.caption}</caption>` : ''}
        <thead><tr>${t.head.map((c) => h`<th>${inl(String(c))}</th>`)}</tr></thead>
        <tbody>${t.rows.map((r) => h`<tr>${r.map((c) => h`<td>${inl(String(c))}</td>`)}</tr>`)}</tbody></table></div>`;
    }
    if (b.path) {
      return h`<div class="menu-path">${b.ui ? h`<span class="pill info">${b.ui}</span>` : ''}${b.path.map((p, i) => h`${i ? h`<span class="mp-sep" aria-hidden="true">▸</span>` : ''}<span class="mp">${p}</span>`)}</div>`;
    }
    if (b.code) {
      return h`<div class="codeblock">${b.title || b.lang ? h`<div class="code-head"><span>${b.title || ''}</span><span>${b.lang || ''}</span></div>` : ''}<pre><code>${b.code}</code></pre></div>`;
    }
    if (b.figure) return figure(b.figure, b.caption);
    return '';
  }

  // Positions on an ellipse, in percent of the box: for cycle and hub diagrams.
  const radial = (n, r = 40) => Array.from({ length: n }, (_, i) => {
    const a = (-90 + (360 * i) / n) * (Math.PI / 180);
    return { x: 50 + r * Math.cos(a), y: 50 + r * Math.sin(a) };
  });
  const pctStyle = (p) => `left:${p.x.toFixed(2)}%;top:${p.y.toFixed(2)}%`;

  const FIGURES = {
    flow(d) {
      return h`<div class="flow${d.vertical ? ' vertical' : ''}">${d.steps.map((s, i) => {
        const n = asNode(s);
        const k = n.kind || 'step';
        const ic = { actor: 'user', system: 'server', decision: 'question', start: 'play', end: 'flag' }[k];
        return h`${i ? h`<span class="flow-arrow" aria-hidden="true">${icon(d.vertical ? 'down' : 'arrow')}</span>` : ''}
          <div class="flow-node k-${k}">${ic ? icon(ic) : ''}<div><div class="fl">${n.label}</div>${n.sub ? h`<div class="fs">${inl(n.sub)}</div>` : ''}</div></div>`;
      })}</div>${d.loop ? h`<div class="flow-loop">${icon('refresh')}<span>${inl(d.loop)}</span></div>` : ''}`;
    },
    tree(d) {
      const node = (n) => h`<li><div class="tn">${icon(TREE_ICON[n.icon] || 'folder')}<span class="tl">${n.href ? h`<a href="${n.href}">${n.label}</a>` : n.label}</span>${n.note ? h`<span class="tnote">${inl(n.note)}</span>` : ''}</div>
        ${n.children && n.children.length ? h`<ul>${n.children.map(node)}</ul>` : ''}</li>`;
      return h`<ul class="tree">${node(d.root)}</ul>`;
    },
    layers(d) {
      return h`<div class="layers">${d.layers.map((l) => h`<div class="layer"><div class="layer-l">${l.label}</div>
        <div class="layer-b">${l.items && l.items.length ? h`<div class="chips">${l.items.map((it) => h`<span class="chip">${it}</span>`)}</div>` : ''}${l.note ? h`<div class="layer-n">${inl(l.note)}</div>` : ''}</div></div>`)}</div>`;
    },
    matrix(d) {
      const cell = (c) => (c === true ? h`<span class="mx-yes" title="Yes">${icon('check')}</span>` : c === false || c === null || c === '' ? h`<span class="mx-no" title="No">–</span>` : h`<span class="mx-txt">${c}</span>`);
      return h`<div class="g-table-wrap"><table class="table matrix"><thead><tr><th></th>${d.cols.map((c) => h`<th>${c}</th>`)}</tr></thead>
        <tbody>${d.rows.map((r) => h`<tr><th scope="row">${r.label}</th>${r.cells.map((c) => h`<td>${cell(c)}</td>`)}</tr>`)}</tbody></table></div>${d.legend ? h`<div class="small muted">${inl(d.legend)}</div>` : ''}`;
    },
    compare(d) {
      return h`<div class="cmp cols-${d.items.length}">${d.items.map((it) => h`<div class="cmp-item tone-${it.tone || 'accent'}"><div class="cmp-t">${it.title}</div><ul>${it.points.map((p) => h`<li>${inl(p)}</li>`)}</ul></div>`)}</div>`;
    },
    cycle(d) {
      const pos = radial(d.steps.length);
      const mid = radial(d.steps.length * 2).filter((_, i) => i % 2);
      return h`<div class="rad cycle">
        <svg class="rad-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><ellipse cx="50" cy="50" rx="40" ry="40"/></svg>
        ${mid.map((p, i) => h`<span class="rad-arrow" style="${pctStyle(p)};transform:translate(-50%,-50%) rotate(${(360 * (i + 0.5)) / d.steps.length}deg)" aria-hidden="true">${icon('arrow')}</span>`)}
        ${d.center ? h`<div class="rad-center">${d.center}</div>` : ''}
        <ol class="rad-list">${d.steps.map((s, i) => { const n = asNode(s); return h`<li class="rad-node" style="${pctStyle(pos[i])}"><span class="rad-n">${i + 1}</span><div class="fl">${n.label}</div>${n.sub ? h`<div class="fs">${inl(n.sub)}</div>` : ''}</li>`; })}</ol>
      </div>`;
    },
    hub(d) {
      const pos = radial(d.items.length);
      return h`<div class="rad hub">
        <svg class="rad-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${pos.map((p) => h`<line x1="50" y1="50" x2="${p.x.toFixed(2)}" y2="${p.y.toFixed(2)}"/>`)}</svg>
        <div class="rad-center">${d.center}</div>
        <ul class="rad-list">${d.items.map((s, i) => { const n = asNode(s); return h`<li class="rad-node" style="${pctStyle(pos[i])}"><div class="fl">${n.label}</div>${n.sub ? h`<div class="fs">${inl(n.sub)}</div>` : ''}</li>`; })}</ul>
      </div>`;
    },
    ladder(d) {
      const n = d.steps.length;
      return h`<div class="ladder">${d.steps.map((s, i) => { const x = asNode(s); return h`<div class="rung" style="min-height:${56 + Math.round((i * 120) / Math.max(1, n - 1))}px;opacity:${(0.62 + (0.38 * i) / Math.max(1, n - 1)).toFixed(2)}"><div class="fl">${x.label}</div>${x.sub ? h`<div class="fs">${inl(x.sub)}</div>` : ''}</div>`; })}</div>
        <div class="ladder-axis"><span>less</span>${icon('arrow')}<span>more</span></div>`;
    },
    menu(d) {
      return h`<div class="mock"><div class="mock-menu"><div class="mock-btn">${d.title}<span aria-hidden="true">▾</span></div>
        <ul>${d.items.map((it) => h`<li class="${it === d.highlight ? 'hl' : ''}">${it}${it === d.highlight ? h`<span class="mock-here">${icon('back')} here</span>` : ''}</li>`)}</ul></div>
        ${d.note ? h`<div class="mock-note">${inl(d.note)}</div>` : ''}</div>`;
    },
    timeline(d) {
      return h`<ol class="timeline">${d.items.map((it) => h`<li><span class="tl-dot"></span>${it.when ? h`<div class="tl-when">${it.when}</div>` : ''}<div class="fl">${it.label}</div>${it.sub ? h`<div class="fs">${inl(it.sub)}</div>` : ''}</li>`)}</ol>`;
    },
    lanes(d) {
      const width = Math.max(...d.lanes.map((l) => l.cells.length));
      const cols = Array.from({ length: width }, (_, i) => i);
      // Number the steps in reading order: column by column, lane by lane.
      const seq = {};
      let k = 0;
      cols.forEach((c) => d.lanes.forEach((l, li) => { if (l.cells[c]) seq[`${li}:${c}`] = ++k; }));
      return h`<div class="g-table-wrap"><table class="lanes"><tbody>${d.lanes.map((l, li) => h`<tr><th scope="row">${l.label}</th>${cols.map((c) => h`<td>${l.cells[c] ? h`<div class="lane-step"><span class="rad-n">${seq[`${li}:${c}`]}</span>${l.cells[c]}</div>` : ''}</td>`)}</tr>`)}</tbody></table></div>`;
    },
  };

  // Diagrams that need the full width of a page rather than half of it.
  const isWide = (b) => !!(b && b.figure && (['ladder', 'matrix', 'lanes', 'timeline', 'compare', 'layers'].indexOf(b.figure.type) !== -1
    || (b.figure.type === 'flow' && !b.figure.vertical && b.figure.steps.length > 3)));

  function figure(d, caption) {
    const draw = FIGURES[d.type];
    if (!draw) return '';
    return h`<figure class="fig fig-${d.type}"><div class="fig-body">${draw(d)}</div>${caption ? h`<figcaption>${inl(caption)}</figcaption>` : ''}</figure>`;
  }

  // In-page links: the hash is the route, so links carry data-anchor and scroll
  // to it instead (opening a collapsed <details> on the way).
  document.addEventListener('click', (ev) => {
    let el = ev.target;
    while (el && el !== document && !(el.getAttribute && el.getAttribute('data-anchor') !== null)) el = el.parentNode;
    if (!el || el === document) return;
    const t = document.getElementById(el.getAttribute('data-anchor'));
    if (!t) return;
    ev.preventDefault();
    if (t.tagName === 'DETAILS') t.setAttribute('open', '');
    t.scrollIntoView();
  });

  // Tabs inside rendered content (one listener for the whole app; IE11 has no closest()).
  document.addEventListener('click', (ev) => {
    let el = ev.target;
    while (el && el !== document && !(el.getAttribute && el.getAttribute('data-tab') !== null)) el = el.parentNode;
    if (!el || el === document) return;
    const bar = el.parentNode;
    const set = bar.parentNode;
    const idx = el.getAttribute('data-tab');
    $$('[data-tab]', bar).forEach((b) => { const on = b === el; if (on) b.classList.add('active'); else b.classList.remove('active'); b.setAttribute('aria-selected', on ? 'true' : 'false'); });
    Array.prototype.forEach.call(set.children, (p) => { if (p.getAttribute('data-panel') === null) return; if (p.getAttribute('data-panel') === idx) p.classList.remove('hidden'); else p.classList.add('hidden'); });
  });

  // ------------------------------------------------------------ state & api
  const state = { session: null, stats: null, curriculum: null, health: null, exam: null, guides: null };

  async function api(method, url, body) {
    let res;
    try {
      res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'X-CSA': '1' },
        body: body ? JSON.stringify(body) : undefined,
        credentials: 'same-origin',
      });
    } catch {
      throw Object.assign(new Error('Cannot reach the CS Academy server.'), { status: 0 });
    }
    let data = {};
    try { data = await res.json(); } catch { /* empty body */ }
    if (res.status === 401 && url !== '/api/login') {
      state.session = null;
      if (data.code === 'SESSION_EXPIRED') toast(data.error, 'warn');
      go('#/login');
      throw Object.assign(new Error(data.error || 'Please sign in.'), { status: 401, silent: true });
    }
    if (!res.ok) throw Object.assign(new Error(data.error || `Request failed (${res.status})`), { status: res.status, data });
    if (data.stats) { state.stats = data.stats; updateSideStats(); }
    return data;
  }

  async function getCurriculum(force) {
    if (!state.curriculum || force) {
      state.curriculum = await api('GET', '/api/curriculum');
      state.domains = state.curriculum.domains;
    }
    return state.curriculum;
  }

  function toast(text, kind = '') {
    const el = document.createElement('div');
    el.className = `toast ${kind}`;
    el.textContent = text;
    $('#toasts').appendChild(el);
    setTimeout(() => { if (el.parentNode) el.parentNode.removeChild(el); }, 4500);
  }

  function busy(btn, label) {
    btn.disabled = true;
    btn.dataset.html = btn.innerHTML;
    put(btn, h`<span class="spinner"></span> ${label}`);
  }
  function unbusy(btn) {
    btn.disabled = false;
    if (btn.dataset.html) btn.innerHTML = btn.dataset.html;
  }

  // ------------------------------------------------------------ theme
  const getTheme = () => { try { return localStorage.getItem('csa-theme'); } catch { return null; } };
  const applyTheme = () => {
    const t = getTheme();
    if (t) document.documentElement.setAttribute('data-theme', t); else document.documentElement.removeAttribute('data-theme');
  };
  const isDark = () => { const t = getTheme(); return t ? t === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches; };
  const toggleTheme = () => {
    try { localStorage.setItem('csa-theme', isDark() ? 'light' : 'dark'); } catch { /* storage blocked */ }
    applyTheme();
    const b = $('#theme-btn');
    if (b) put(b, h`${icon(isDark() ? 'sun' : 'moon')}<span>Theme</span>`);
  };
  applyTheme();

  // ------------------------------------------------------------ router
  const go = (hash) => { if (location.hash === hash) router(); else location.hash = hash; };
  const ROUTES = [
    [/^#\/?$/, pageClassroom],
    [/^#\/map$/, pageMap],
    [/^#\/curriculum(?:\?track=(\w+))?$/, pageCurriculum],
    [/^#\/module\/([\w-]+)$/, pageModule],
    [/^#\/mission\/([\w-]+)$/, pageMission],
    [/^#\/exam(?:\?(.*))?$/, pageExam],
    [/^#\/paths$/, pagePaths],
    [/^#\/path\/([\w-]+)$/, pagePath],
    [/^#\/practice\/([\w-]+)$/, pagePractice],
    [/^#\/handbook(?:\?(.*))?$/, pageHandbook],
    [/^#\/guide\/([\w-]+)$/, pageGuide],
    [/^#\/glossary(?:\?(.*))?$/, pageGlossary],
    [/^#\/search(?:\?(.*))?$/, pageSearch],
    [/^#\/progress$/, pageProgress],
    [/^#\/connection$/, pageConnection],
    [/^#\/roster$/, pageRoster],
  ];

  async function router() {
    const hash = location.hash || '#/';
    if (hash.startsWith('#/login')) return pageLogin();
    if (!state.session) {
      try { state.session = await api('GET', '/api/session'); } catch { return; }
    }
    const hit = ROUTES.map(([re, fn]) => [re.exec(hash), fn]).find(([m]) => m);
    if (!hit) return go('#/');
    renderShell(hash);
    const main = $('#main');
    put(main, h`<div class="loading"><span class="spinner"></span> Loading…</div>`);
    try {
      await hit[1](main, ...hit[0].slice(1));
    } catch (e) {
      if (!e.silent && document.body.contains(main)) put(main, h`<div class="card"><h2>Something went wrong</h2><p class="muted">${e.message}</p><a class="btn" href="#/">Back to the classroom</a></div>`);
    }
    window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', router);

  // ------------------------------------------------------------ shell
  function renderShell(hash) {
    const u = state.session.user;
    const nav = [['#/', 'home', 'Classroom'], ['#/paths', 'cap', 'Learning paths'], ['#/handbook', 'guide', 'Handbook'], ['#/curriculum', 'book', 'Curriculum'], ['#/exam', 'exam', 'Practice exams'],
      ['#/glossary', 'az', 'Glossary'], ['#/map', 'map', 'Platform map'], ['#/progress', 'chart', 'My progress'], ['#/connection', 'server', 'Connection']];
    const cs = state.session.cs || { url: state.session.csUrl };
    if (u.isSysAdmin) nav.push(['#/roster', 'users', 'Class roster']);
    const isActive = (href) => (href === '#/' ? hash === '#/' || hash === '#'
      : hash.startsWith(href) || (href === '#/curriculum' && /^#\/(module|mission)\//.test(hash))
        || (href === '#/paths' && /^#\/(path|practice)\//.test(hash)) || (href === '#/handbook' && /^#\/guide\//.test(hash)));
    const q = /^#\/search\?q=(.*)$/.exec(hash);
    put($('#app'), h`
      <div class="shell">
        <aside class="side">
          <div class="brand"><div class="brand-mark">${HAT}</div><div>CS Academy<small>Content Server trainer</small></div></div>
          <form class="side-search" id="side-search" role="search"><label class="sr-only" for="side-q">Search the handbook</label>${icon('search')}<input id="side-q" type="search" placeholder="Search guides, terms…" value="${q ? decodeURIComponent(q[1]) : ''}" autocomplete="off"></form>
          <nav class="nav" aria-label="Main">${nav.map(([href, ic, label]) => h`<a href="${href}" class="${isActive(href) ? 'active' : ''}" ${isActive(href) ? raw('aria-current="page"') : ''}>${icon(ic)}<span>${label}</span></a>`)}</nav>
          <div class="side-foot">
            <a class="side-server" href="#/connection" title="Every check reads this Content Server: ${cs.url}">${icon('server')}<span>${hostOf(cs.url)}${cs.version ? h` · ${cs.version}` : ''}</span></a>
            <div class="me"><div class="avatar" aria-hidden="true">${initials(u.displayName)}</div><div><div class="me-name">${u.displayName}</div><div class="me-level" id="side-level"></div></div></div>
            <div class="side-xp" id="side-xp"></div>
            <div class="side-actions">
              <button type="button" id="theme-btn" title="Switch light/dark">${icon(isDark() ? 'sun' : 'moon')}<span>Theme</span></button>
              <button type="button" id="logout-btn">${icon('logout')}<span>Sign out</span></button>
            </div>
          </div>
        </aside>
        <main id="main" tabindex="-1"></main>
      </div>`);
    $('#side-search').onsubmit = (ev) => {
      ev.preventDefault();
      const v = $('#side-q').value.trim();
      if (v) go(`#/search?q=${encodeURIComponent(v)}`);
    };
    $('#theme-btn').onclick = toggleTheme;
    $('#logout-btn').onclick = async () => {
      try { await api('POST', '/api/logout'); } catch { /* already gone */ }
      Object.assign(state, { session: null, stats: null, curriculum: null, exam: null });
      go('#/login');
    };
    updateSideStats();
    // The classroom fetches the overview itself; elsewhere prime the sidebar stats once.
    if (!state.stats && hash !== '#/' && hash !== '#') api('GET', '/api/overview').catch(() => {});
  }

  function updateSideStats() {
    const s = state.stats;
    const lvl = $('#side-level');
    const xp = $('#side-xp');
    if (!s || !lvl) return;
    const l = s.level;
    lvl.textContent = `${l.name} · ${s.xp} XP`;
    const span = l.next ? l.next.xp - l.floor : 1;
    const into = l.next ? s.xp - l.floor : 1;
    put(xp, h`<div class="bar" role="progressbar" aria-valuenow="${pct(into, span)}" aria-valuemin="0" aria-valuemax="100" aria-label="Progress to next level"><span style="width:${pct(into, span)}%"></span></div>
      <div class="row"><span>${l.name}</span><span>${l.next ? `${l.next.xp - s.xp} XP to ${l.next.name}` : 'Top level'}</span></div>`);
  }

  function celebrate(r) {
    if (r.xpGained) toast(`+${r.xpGained} XP`, 'xp');
    if (r.levelUp) setTimeout(() => toast(`Level up! You are now a ${r.levelUp.name}.`, 'xp'), 600);
  }

  async function runScan(btn) {
    busy(btn, 'Analysing your platform…');
    try {
      const r = await api('POST', '/api/scan');
      toast(`Analysis complete — ${r.scan.inventory.total} items examined`);
      state.curriculum = null;
      router();
    } catch (e) {
      if (!e.silent) toast(e.message, 'warn');
      unbusy(btn);
    }
  }

  // ------------------------------------------------------------ login
  async function pageLogin() {
    if (!state.health) {
      try { state.health = await (await fetch('/api/health')).json(); } catch { state.health = null; }
    }
    const hl = state.health;
    const cs = hl && hl.cs;
    const status = !hl ? { cls: '', text: 'Checking the connection…' }
      : cs.restApi ? { cls: 'ok', text: `Content Server ${cs.version ? `${cs.version} ` : ''}answering at ${hl.csUrl}` }
        : cs.reachable ? { cls: 'bad', text: `${hl.csUrl} answered, but not as a Content Server REST API (HTTP ${cs.status})`, more: cs.error }
          : { cls: 'bad', text: `Can't reach Content Server at ${hl.csUrl}`, more: cs.error };
    put($('#app'), h`
      <div class="login">
        <section class="login-hero">
          <div class="brand"><div class="brand-mark">${HAT}</div><div>CS Academy<small>Content Server trainer</small></div></div>
          <h1>Learn Content Server by doing it.</h1>
          <p>Your instructor looks around your OpenText Content Server, gives you assignments in the real system, and checks your work live.</p>
          <ol class="hero-steps">
            <li><div class="n">1</div><div><b>It analyses your platform</b><span>Workspaces, item types, categories, workflows and the modules installed on this server.</span></div></li>
            <li><div class="n">2</div><div><b>It gives you missions</b><span>${hl ? hl.missions : 'Over 100'} hands-on tasks, investigations and knowledge checks${hl && hl.tracks ? ` across ${hl.tracks} tracks` : ''}.</span></div></li>
            <li><div class="n">3</div><div><b>It checks your work</b><span>Through the Content Server REST API. Read-only: the trainer never changes anything.</span></div></li>
            <li><div class="n">4</div><div><b>It prepares you for certification</b><span>Learning paths for the OpenText Content Management exams, ${hl && hl.guides ? `${hl.guides} handbook guides` : 'a handbook'} with diagrams, and timed exam simulations.</span></div></li>
          </ol>
        </section>
        <section class="login-form">
          <form class="card" id="login-form">
            <h2>Sign in</h2>
            <p class="muted small">Use your Content Server account. Your password is passed to Content Server and never stored.</p>
            <div id="login-error"></div>
            <div class="field"><label for="u">User name</label><input class="input" id="u" name="username" autocomplete="username" required></div>
            <div class="field"><label for="p">Password</label><input class="input" id="p" name="password" type="password" autocomplete="current-password" required></div>
            <button class="btn primary" style="width:100%" type="submit">Sign in</button>
            <div class="status-line"><span class="status-dot ${status.cls}"></span><span>${status.text}</span></div>
            ${status.more ? h`<p class="small muted" style="margin:6px 0 0">${status.more}</p>` : ''}
            ${/(^|\s)legacy(\s|$)/.test(document.documentElement.className) ? h`<p class="small faint" style="margin:8px 0 0">Compatibility mode: running the Internet Explorer 11 build.</p>` : ''}
          </form>
        </section>
      </div>`);
    const form = $('#login-form');
    $('#u').focus();
    form.onsubmit = async (ev) => {
      ev.preventDefault();
      const btn = form.querySelector('button[type=submit]');
      busy(btn, 'Signing in…');
      try {
        const r = await api('POST', '/api/login', { username: $('#u').value, password: $('#p').value });
        state.session = r;
        state.stats = null;
        state.curriculum = null;
        location.hash = '#/';
      } catch (e) {
        put($('#login-error'), h`<div class="error" role="alert">${e.message}</div>`);
        unbusy(btn);
      }
    };
  }

  // ------------------------------------------------------------ classroom
  function teacherIntro(next, stats) {
    const first = stats.done === 0 ? 'Let\'s begin at the beginning. ' : '';
    const lines = {
      'hands-on': 'Your next assignment is a hands-on one. Do it in Content Server, then come back and press “Check my work” — I\'ll verify it on the live server.',
      investigate: 'Time for some detective work: find the answer in Content Server and tell me. I\'ll compare it with what the server says.',
      quiz: `Let's make sure the ideas from “${next.moduleTitle}” stuck — a short knowledge check.`,
      practice: 'This one I can\'t check automatically, so I\'ll ask you to explain what you did in your own words.',
    };
    return first + lines[next.type];
  }

  async function pageClassroom(main) {
    const [o, paths] = await Promise.all([api('GET', '/api/overview'), api('GET', '/api/paths').catch(() => null)]);
    // A scan can reveal admin rights; re-render so the sidebar gains the roster link.
    const becameAdmin = o.user.isSysAdmin && !state.session.user.isSysAdmin;
    state.session.user = o.user;
    if (becameAdmin) return router();
    const s = o.stats;
    const name = (o.user.displayName || o.user.name).split(' ')[0];
    const hr = new Date().getHours();
    const greet = hr < 12 ? 'Good morning' : hr < 18 ? 'Good afternoon' : 'Good evening';
    let bubble;
    if (!o.scan) {
      bubble = h`<div class="hello">${greet}, ${name}.</div>
        <p>I'm your Content Server instructor. Before the first lesson I'd like to look around your server — which workspaces, item types, categories, workflows and modules exist — so your assignments match what is really installed.</p>
        <div class="row-flex"><button class="btn primary" id="scan-btn">${icon('search')} Analyse my platform</button><span class="small muted">Read-only · usually under a minute</span></div>`;
    } else if (o.next) {
      const t = TYPE[o.next.type];
      bubble = h`<div class="hello">${greet}, ${name}.</div>
        <p>${teacherIntro(o.next, s)}</p>
        <div class="assignment">
          <div>
            <div class="small muted">${o.next.moduleTitle}</div>
            <div class="t">${o.next.title}</div>
            <div class="row-flex" style="margin-top:6px"><span class="pill ${t.cls}">${t.label}</span><span class="pill xp">${o.next.xp} XP</span></div>
          </div>
          <a class="btn primary" href="#/mission/${o.next.id}">${icon('play')} Start mission</a>
        </div>`;
    } else {
      bubble = h`<div class="hello">${greet}, ${name}.</div>
        <p>You have worked through every mission available on this server. Keep your knowledge sharp with a practice exam, or revisit any module from the curriculum.</p>
        <a class="btn primary" href="#/exam">${icon('exam')} Take a practice exam</a>`;
    }
    const accuracy = s.quiz.answered ? `${pct(s.quiz.correct, s.quiz.answered)}%` : '—';
    put(main, h`
      <div class="teacher"><div class="teacher-avatar">${HAT}</div><div class="bubble">${bubble}</div></div>

      <div class="grid four" style="margin-top:22px">
        <div class="card stat"><div class="k">Level</div><div class="v">${s.level.name}</div><div class="s">${s.xp} XP earned</div></div>
        <div class="card stat"><div class="k">Missions</div><div class="v">${s.done}<span class="faint" style="font-size:1rem"> / ${s.total}</span></div><div class="s">${pct(s.done, s.total)}% complete</div></div>
        <div class="card stat"><div class="k">Quiz accuracy</div><div class="v">${accuracy}</div><div class="s">${s.quiz.answered} questions (best attempts)</div></div>
        <div class="card stat"><div class="k">Badges</div><div class="v">${s.badges.length}</div><div class="s">modules completed</div></div>
      </div>

      <div class="grid two" style="margin-top:16px">
        <div class="card">
          <div class="spread"><h2>Your tracks</h2><a class="small" href="#/curriculum">Open curriculum →</a></div>
          ${Object.values(s.tracks).map((t) => h`
            <a class="track-row" href="#/curriculum?track=${t.id}" style="color:inherit;text-decoration:none">
              <span class="n">${t.title}</span>
              <div class="bar"><span style="width:${pct(t.done, t.total)}%"></span></div>
              <span class="p">${t.done}/${t.total}</span>
            </a>`)}
        </div>
        <div class="card">
          <div class="spread"><h2>Instructor's notes</h2>${o.scan ? h`<button class="btn small ghost" id="rescan-btn">${icon('refresh')} Re-analyse</button>` : ''}</div>
          ${o.scan ? h`<ul class="notes">${o.scan.notes.map((n) => h`<li>${n}</li>`)}</ul><p class="small faint" style="margin:10px 0 0">Analysed ${ago(o.scan.scannedAt)} · <a href="#/map">see the platform map</a></p>`
            : h`<p class="muted">Nothing yet — I'll write my observations here after analysing your platform.</p>`}
        </div>
      </div>

      ${paths ? h`<div class="card" style="margin-top:16px">
        <div class="spread"><h2>Certification readiness</h2><a class="small" href="#/paths">All learning paths →</a></div>
        <div class="cert-strip">${paths.roadmap.map((id) => paths.paths.find((p) => p.id === id)).concat(paths.paths.filter((p) => p.kind === 'skill')).map((p) => h`<a class="cert-mini ${paths.focus === p.id ? 'focus' : ''}" href="#/path/${p.id}">${miniRing(p.readiness, p.color)}<span><b>${p.short}</b><span class="small muted">${codeOf(p)}${paths.focus === p.id ? ' · your focus' : ''}</span></span></a>`)}</div>
      </div>` : ''}

      <div class="card" style="margin-top:16px">
        <h2>Recent activity</h2>
        ${o.activity.length ? h`<ul class="activity">${o.activity.map((a) => h`<li><span>${a.text}</span><span class="faint nowrap small">${ago(a.at)}</span></li>`)}</ul>` : h`<p class="muted">No activity yet.</p>`}
      </div>`);
    const sb = $('#scan-btn') || $('#rescan-btn');
    if (sb) sb.onclick = () => runScan(sb);
  }

  // ------------------------------------------------------------ platform map
  async function pageMap(main) {
    const [{ scan }, cur] = await Promise.all([api('GET', '/api/scan'), getCurriculum()]);
    if (!scan) {
      put(main, h`<div class="page-head"><div><div class="eyebrow">Platform map</div><h1>I haven't looked around yet</h1><p>Let me analyse your Content Server so I can map its sections to your lessons.</p></div></div>
        <button class="btn primary" id="scan-btn">${icon('search')} Analyse my platform</button>`);
      $('#scan-btn').onclick = (e) => runScan(e.currentTarget);
      return;
    }
    const order = { detected: 0, unknown: 1, 'not-detected': 2 };
    const areas = Object.values(scan.features).sort((a, b) => order[a.status] - order[b.status]);
    const detected = areas.filter((a) => a.status === 'detected').length;
    const CORE_MODULES = ['u01', 'u02', 'u03'];
    const modsFor = (key) => cur.modules.filter((m) => (key === 'core' ? CORE_MODULES.includes(m.id) : m.feature === key || m.missions.some((x) => x.feature === key)));
    const maxCount = Math.max(1, ...scan.inventory.byType.map((t) => t.count));
    const statusPill = (st) => h`<span class="pill ${FEATURE_STATUS[st].cls}">${FEATURE_STATUS[st].label}</span>`;

    put(main, h`
      <div class="page-head">
        <div><div class="eyebrow">Platform map</div><h1>What I found on your server</h1>
          <p>Content Server ${scan.server.version || '(version not reported)'}${scan.server.url ? ` at ${scan.server.url}` : ''} · analysed ${when(scan.scannedAt)} in ${(scan.durationMs / 1000).toFixed(1)} s</p></div>
        <button class="btn" id="rescan-btn">${icon('refresh')} Re-analyse</button>
      </div>
      <div class="chips" style="margin-bottom:18px">
        <span class="chip"><b>${scan.inventory.total}</b> items examined${scan.inventory.truncated ? ' (sampled)' : ''}</span>
        <span class="chip"><b>${scan.inventory.containersScanned}</b> containers opened</span>
        <span class="chip"><b>${detected}</b> of ${areas.length} areas detected</span>
        <span class="chip">${scan.user.isSysAdmin ? 'You have System Administration rights' : 'Standard user rights'}</span>
      </div>

      <div class="grid auto">
        ${areas.map((a) => {
          const mods = modsFor(a.key);
          return h`<div class="card area ${a.status}">
            <div class="spread"><h3>${a.label}</h3>${statusPill(a.status)}</div>
            ${a.evidence.length ? h`<ul>${a.evidence.slice(0, 3).map((e) => h`<li>${e}</li>`)}</ul>` : h`<div class="small faint">No evidence in the scanned area.</div>`}
            ${mods.length ? h`<div class="mods">${mods.map((m) => h`<a class="pill accent" href="#/module/${m.id}">${m.title}</a>`)}</div>` : ''}
          </div>`;
        })}
      </div>

      <div class="grid two" style="margin-top:22px">
        <div class="card">
          <h2>Item types in the scanned area</h2>
          <table class="table"><thead><tr><th>Type</th><th class="num">Subtype</th><th class="num">Count</th><th style="width:30%"></th></tr></thead>
            <tbody>${scan.inventory.byType.slice(0, 25).map((t) => h`<tr><td>${t.typeName}</td><td class="num faint">${t.type}</td><td class="num">${t.count}</td><td><div class="minibar" style="width:${pct(t.count, maxCount)}%"></div></td></tr>`)}</tbody></table>
        </div>
        <div class="stack">
          <div class="card"><h3>Volumes</h3><table class="table"><tbody>${scan.volumes.map((v) => h`<tr><td>${v.label}</td><td>${v.id ? h`<span class="pill pass">${v.name}</span>` : h`<span class="pill" title="${v.error || ''}">not reachable</span>`}</td><td class="num faint">${v.id || ''}</td></tr>`)}</tbody></table></div>
          <div class="card"><h3>Categories (${scan.categories.length})</h3>${scan.categories.length ? h`<div class="chips">${scan.categories.slice(0, 30).map((c) => h`<span class="chip">${c.name}</span>`)}</div>` : h`<p class="muted small">None visible to you.</p>`}</div>
          <div class="card"><h3>Workflow maps (${scan.workflowMaps.length})</h3>${scan.workflowMaps.length ? h`<div class="chips">${scan.workflowMaps.slice(0, 30).map((c) => h`<span class="chip">${c.name}</span>`)}</div>` : h`<p class="muted small">None found in the scanned area.</p>`}</div>
          <div class="card"><h3>You can create</h3>${scan.addable.length ? h`<div class="chips">${scan.addable.map((c) => h`<span class="chip">${c.name}</span>`)}</div>` : h`<p class="muted small">The server did not report addable item types.</p>`}</div>
          <div class="card"><h3>Your groups</h3>${scan.groups.length ? h`<div class="chips">${scan.groups.map((g) => h`<span class="chip">${g.name}</span>`)}</div>` : h`<p class="muted small">Not reported.</p>`}${scan.user.departmentName ? h`<p class="small muted" style="margin:10px 0 0">Department group: <b>${scan.user.departmentName}</b></p>` : ''}</div>
        </div>
      </div>`);
    $('#rescan-btn').onclick = (e) => runScan(e.currentTarget);
  }

  // ------------------------------------------------------------ curriculum
  function missionDots(mod) {
    return h`<div class="dots">${mod.missions.map((m) => h`<span class="dot ${m.state ? m.state.status : ''}" title="${m.title}"></span>`)}</div>`;
  }

  async function pageCurriculum(main, track) {
    const cur = await getCurriculum(true);
    const s = cur.stats;
    const focus = cur.settings ? cur.settings.track : 'all';
    const shown = track ? cur.tracks.filter((t) => t.id === track) : cur.tracks;
    put(main, h`
      <div class="page-head">
        <div><div class="eyebrow">Curriculum</div><h1>${cur.tracks.length} tracks, ${cur.modules.length} modules</h1><p>Every section of Content Server, from first upload to administration, development and Extended ECM. Work in order or jump to what you need.</p></div>
      </div>
      <nav class="tabs" aria-label="Tracks">
        <a href="#/curriculum" class="${!track ? 'active' : ''}">All tracks</a>
        ${cur.tracks.map((t) => h`<a href="#/curriculum?track=${t.id}" class="${track === t.id ? 'active' : ''}">${t.title}</a>`)}
      </nav>
      ${shown.map((t) => {
        const mods = cur.modules.filter((m) => m.track === t.id);
        const ts = s.tracks[t.id];
        return h`
          <div class="track-head spread">
            <div><h2>${t.title}</h2><div class="muted small">${t.blurb} Exam alignment ${t.exam} · ${ts.done}/${ts.total} missions done</div></div>
            ${focus === t.id ? h`<span class="pill accent">${icon('flag')} Your focus</span>` : h`<button class="btn small" data-focus="${t.id}">${icon('flag')} Make this my focus</button>`}
          </div>
          <div class="stack">
            ${mods.map((mod) => {
              const ms = s.modules[mod.id];
              return h`<a class="card card-link module-card" href="#/module/${mod.id}">
                <div class="module-num ${ms.complete ? 'done' : ''}">${ms.complete ? icon('check') : mod.id.toUpperCase()}</div>
                <div><div class="t">${mod.title} ${mod.featureStatus === 'not-detected' ? h`<span class="pill" title="Not detected on your server">not detected here</span>` : ''}</div><div class="d">${mod.summary}</div>${missionDots(mod)}</div>
                <div class="prog">${ms.done}/${ms.total} done<div class="bar"><span style="width:${pct(ms.resolved, ms.total)}%"></span></div></div>
              </a>`;
            })}
          </div>`;
      })}
      ${focus !== 'all' ? h`<p class="small muted" style="margin-top:20px">Focus: the classroom suggests missions from your focus track first. <button class="btn small ghost" data-focus="all">Clear focus</button></p>` : ''}`);
    $$('[data-focus]', main).forEach((b) => {
      b.onclick = async () => {
        await api('POST', '/api/settings', { track: b.dataset.focus });
        toast(b.dataset.focus === 'all' ? 'Focus cleared' : 'Focus track set');
        pageCurriculum(main, track);
      };
    });
  }

  function statusIcon(m) {
    const st = m.state && m.state.status;
    if (st === 'done') return h`<span class="status-ico done" title="Completed">${icon('check')}</span>`;
    if (st === 'skipped') return h`<span class="status-ico skipped" title="Skipped">${icon('dash')}</span>`;
    if (m.availability.locked.length) return h`<span class="status-ico locked" title="Locked">${icon('lock')}</span>`;
    return h`<span class="status-ico" title="Not started"></span>`;
  }

  async function pageModule(main, id) {
    const cur = await getCurriculum(true);
    const mod = cur.modules.find((m) => m.id === id);
    if (!mod) throw new Error('Module not found.');
    const track = cur.tracks.find((t) => t.id === mod.track);
    const ms = cur.stats.modules[mod.id];
    put(main, h`
      <div class="crumbs"><a href="#/curriculum">Curriculum</a> › <a href="#/curriculum?track=${track.id}">${track.title}</a></div>
      <div class="page-head">
        <div><div class="eyebrow">${mod.id.toUpperCase()} · ${track.title}</div><h1>${mod.title}</h1><p>${mod.summary}</p></div>
        <div style="min-width:180px"><div class="small muted">${ms.done} of ${ms.total} missions done</div><div class="bar" style="margin-top:6px"><span style="width:${pct(ms.resolved, ms.total)}%"></span></div></div>
      </div>
      ${mod.featureStatus === 'not-detected' ? h`<div class="notice warn" style="margin-bottom:16px">${icon('alert')} I didn't detect this area on your server. Hands-on missions may not be possible here — read the lesson, take the knowledge check, and skip what doesn't apply.</div>` : ''}
      <div class="lesson-grid">
        <div class="card lesson rich">
          <h2>Lesson</h2>
          ${blocks(mod.lesson)}
          <p class="small faint" style="margin:0">Based on: ${mod.source}</p>
        </div>
        <div class="stack">
          <div class="card">
            <h2>Remember</h2>
            <ul class="keypoints">${mod.keyPoints.map((k) => h`<li>${inl(k)}</li>`)}</ul>
          </div>
          ${mod.guides.length ? h`<div class="card"><h2>Go deeper in the handbook</h2>
            <ul class="link-list">${mod.guides.map((g) => h`<li><a href="#/guide/${g.id}">${icon('guide')}<span><b>${g.title}</b><span class="small muted">${g.summary}</span></span></a></li>`)}</ul></div>` : ''}
          ${mod.domains.length ? h`<div class="card"><h2>Prepares you for</h2><div class="chips">${mod.domains.map((d) => domainChip(d))}</div></div>` : ''}
        </div>
      </div>
      ${mod.visuals.length ? h`<div class="card rich visual-guide" style="margin-top:16px"><h2>Visual guide</h2><div class="vg-grid">${mod.visuals.map((b) => h`<div class="${isWide(b) ? 'vg-wide' : ''}">${block(b)}</div>`)}</div></div>` : ''}
      <div class="card" style="margin-top:16px">
        <h2>Missions</h2>
        <ul class="mission-list">
          ${mod.missions.map((m) => h`<li><a href="#/mission/${m.id}">
            ${statusIcon(m)}
            <div><div class="t">${m.title}</div>${m.brief ? h`<div class="small muted">${m.brief}</div>` : ''}</div>
            <div class="m">${m.availability.featureStatus === 'not-detected' ? h`<span class="pill">not detected</span>` : ''}<span class="pill ${TYPE[m.type].cls}">${TYPE[m.type].label}</span><span class="pill xp">${m.xp} XP</span></div>
          </a></li>`)}
        </ul>
      </div>`);
  }

  // ------------------------------------------------------------ mission
  async function pageMission(main, id) {
    const d = await api('GET', `/api/missions/${id}`);
    d.inputs = {};
    d.hintsShown = 0;
    d.result = null;
    renderMission(main, d);
  }

  function verdictBox(result, cs) {
    const status = result.status;
    const where = h`<span class="nowrap">${hostOf(cs && cs.url)}</span>`;
    const linked = result.results.some((c) => c.node && c.node.links);
    if (status === 'pass') return h`<div class="verdict pass">${icon('check')}<div class="body"><strong>Verified on your Content Server</strong> (${where}). Well done — that is exactly what I was looking for.${linked ? ' Open the items below to see them there yourself.' : ''}</div></div>`;
    if (status === 'unverified') return h`<div class="verdict unverified">${icon('question')}<div class="body"><strong>Couldn't verify.</strong> Your Content Server (${where}) didn't give me what I need for the step marked “?”, so this mission is not done. If that feature isn't available on your server, skip the mission.</div></div>`;
    return h`<div class="verdict fail">${icon('x')}<div class="body"><strong>Not quite yet.</strong> Here is what I found on ${where} — fix it in Content Server and check again.</div></div>`;
  }

  function evidenceLinks(n) {
    if (!n || !n.links) return '';
    return h`<div class="evidence">Open “${n.name}” (ID ${n.id}): <a href="${n.links.smart}" target="_blank" rel="noopener">Smart View</a> · <a href="${n.links.classic}" target="_blank" rel="noopener">Classic UI</a></div>`;
  }

  function checkIcon(st) {
    return { pass: icon('check'), fail: icon('x'), unknown: icon('question'), blocked: icon('dash') }[st] || '';
  }

  function renderMission(main, d) {
    const m = d.mission;
    const st = m.state || {};
    const av = m.availability;
    const t = TYPE[m.type];
    const done = st.status === 'done';
    const locked = av.locked.length > 0;
    const result = d.result;

    // Right-hand panel
    let side;
    if (m.type === 'hands-on' || m.type === 'investigate') {
      side = h`
        ${result ? verdictBox(result, state.session.cs) : done ? h`<div class="verdict ${st.method === 'self-confirmed' ? 'unverified' : 'pass'}">${icon(st.method === 'self-confirmed' ? 'question' : 'check')}<div class="body"><strong>Completed</strong>${st.method === 'self-confirmed' ? ' by self-confirmation in an earlier version — never verified on the server. Check it now.' : ` — verified on your Content Server${st.completedAt ? ` ${when(st.completedAt)}` : ''}. You can re-check any time.`}</div></div>` : ''}
        <h3>${result ? 'Results' : 'What I will check'}</h3>
        <ul class="checks">
          ${(result ? result.results : m.checks.map((l) => ({ label: l, status: 'pending' }))).map((c) => h`
            <li class="${c.status}"><span class="ico">${checkIcon(c.status)}</span><div><div class="l">${c.label}</div>${c.detail ? h`<div class="d">${c.detail}</div>` : ''}${evidenceLinks(c.node)}</div></li>`)}
        </ul>
        <div class="row-flex" style="margin-top:14px">
          <button class="btn primary" id="check-btn" ${locked ? 'disabled' : ''}>${icon('search')} Check my work</button>
        </div>`;
    } else if (m.type === 'quiz') {
      const need = Math.ceil(m.questions.length * 0.6);
      side = h`
        ${d.quiz ? h`<div class="verdict ${d.quiz.passed ? 'pass' : 'fail'}">${icon(d.quiz.passed ? 'check' : 'x')}<div class="body"><strong>${d.quiz.correct} / ${d.quiz.total} correct.</strong> ${d.quiz.passed ? 'Passed — nicely done.' : `You need ${d.quiz.needed}. Re-read the lesson and try again.`}</div></div>`
          : done ? h`<div class="verdict pass">${icon('check')}<div class="body"><strong>Passed</strong> — best score ${st.quiz ? `${st.quiz.best}/${st.quiz.total}` : ''}. Retake it any time.</div></div>` : ''}
        <h3>How it works</h3>
        <p class="small muted">${m.questions.length} questions · pass with ${need} correct. Graded on the server; explanations appear after you submit.</p>`;
    } else {
      side = h`
        ${done ? h`<div class="verdict pass">${icon('check')}<div class="body"><strong>Completed.</strong> Your reflection is saved below.</div></div>` : ''}
        <h3>How it works</h3>
        <p class="small muted">The REST API can't see this part of Content Server, so I don't check it on the server: explaining what you did is how you show you've got it. It is recorded as self-reported. Minimum ${m.minWords} words.</p>`;
    }

    // Main column body per type
    let work = '';
    if (m.type === 'investigate') {
      work = h`<div class="card"><h2>Your answers</h2>${m.inputs.map((i) => h`
        <div class="field"><label for="in-${i.key}">${i.label}</label><input class="input" id="in-${i.key}" data-input="${i.key}" placeholder="${i.placeholder}" value="${d.inputs[i.key] || ''}" autocomplete="off"></div>`)}</div>`;
    } else if (m.type === 'practice') {
      const saved = st.reflection;
      work = h`<div class="card"><h2>Your reflection</h2><p class="muted">${m.reflection}</p>
        ${done && saved ? h`<div class="notice" style="white-space:pre-wrap">${saved}</div>`
          : h`<textarea class="input" id="reflection" placeholder="Write it in your own words…">${d.draft || ''}</textarea>
            <div class="spread" style="margin-top:10px"><span class="small muted" id="wc">0 words</span><button class="btn primary" id="reflect-btn" ${locked ? 'disabled' : ''}>${icon('check')} Mark as done</button></div>`}
      </div>`;
    } else if (m.type === 'quiz') {
      const q = d.quiz;
      work = h`<form id="quiz-form" class="stack">${m.questions.map((qq, i) => {
        const rv = q && q.review[i];
        return h`<fieldset class="card question">
          <legend class="sr-only">Question ${i + 1}</legend>
          <div class="qn">Question ${i + 1} of ${m.questions.length}</div>
          <div class="qt">${qq.q}</div>
          <div class="options">${qq.options.map((o, k) => {
            let cls = '';
            if (rv) cls = k === rv.answer ? 'correct' : k === rv.chosen ? 'wrong' : '';
            return h`<label class="option ${cls} ${rv ? 'locked' : ''}"><input type="radio" name="q${i}" value="${k}" ${rv ? 'disabled' : ''} ${rv && rv.chosen === k ? 'checked' : ''}><span>${o}</span></label>`;
          })}</div>
          ${rv ? h`<div class="explain">${rv.correct ? 'Correct. ' : 'Not quite. '}${rv.explain}</div>` : ''}
        </fieldset>`;
      })}
        <div class="row-flex">${q ? h`<button type="button" class="btn" id="retry-btn">${icon('refresh')} Try again</button>` : h`<button class="btn primary" type="submit">${icon('check')} Submit answers</button>`}</div>
      </form>`;
    }

    put(main, h`
      <div class="crumbs"><a href="#/curriculum">Curriculum</a> › <a href="#/module/${d.module.id}">${d.module.title}</a></div>
      <div class="page-head">
        <div><div class="eyebrow">${t.label}</div><h1>${m.title}</h1>
          <div class="row-flex"><span class="pill xp">${m.xp} XP</span>${done ? h`<span class="pill pass">${icon('check')} Completed</span>` : st.status === 'skipped' ? h`<span class="pill">Skipped</span>` : ''}${st.attempts ? h`<span class="pill">${st.attempts} attempt${st.attempts === 1 ? '' : 's'}</span>` : ''}</div>
        </div>
      </div>
      ${locked ? h`<div class="notice warn" style="margin-bottom:16px">${icon('lock')} This mission builds on ${d.requiresTitles.filter((r) => av.locked.includes(r.id)).map((r, i) => h`${i ? ' and ' : ''}<a href="#/mission/${r.id}">${r.title}</a>`)}. Finish that first.</div>` : ''}
      ${av.featureStatus === 'not-detected' && !done ? h`<div class="notice warn" style="margin-bottom:16px">${icon('alert')} I didn't detect this feature on your server. If it isn't available to you, skip this mission — it won't count against you.</div>` : ''}
      <div class="mission-grid">
        <div class="stack">
          ${m.brief ? h`<div class="brief">${icon('bulb')}<div>${m.brief}</div></div>` : ''}
          ${m.steps.length ? h`<div class="card"><h2>Your assignment</h2><ol class="steps">${m.steps.map((s) => h`<li>${linkify(s)}</li>`)}</ol>
            ${m.hints.length ? h`<div id="hints">${m.hints.slice(0, d.hintsShown).map((x) => h`<div class="hint">${x}</div>`)}</div>${d.hintsShown < m.hints.length ? h`<button class="btn small ghost" id="hint-btn" style="margin-top:8px">${icon('question')} ${d.hintsShown ? 'Another hint' : 'Need a hint?'}</button>` : ''}` : ''}
          </div>` : ''}
          ${work}
        </div>
        <div class="stack side-card">
          <div class="card">${side}</div>
          ${m.links ? h`<div class="card"><h3>Open in Content Server</h3>${m.links.name ? h`<p class="small muted">${m.links.name}</p>` : ''}<div class="open-links">
            <a class="btn small" href="${m.links.smart}" target="_blank" rel="noopener">${icon('external')} Smart View</a>
            <a class="btn small" href="${m.links.classic}" target="_blank" rel="noopener">${icon('external')} Classic UI</a></div></div>` : ''}
          ${m.checks.length || (!done && st.status !== 'skipped') ? h`<div class="card flat">${m.checks.length ? h`<p class="small muted" style="margin:0">${t.how}</p>` : ''}
            ${!done && st.status !== 'skipped' ? h`<button class="btn small ghost" id="skip-btn" style="margin-top:${m.checks.length ? '8px' : '0'}">${icon('skip')} Skip this mission</button>` : ''}</div>` : ''}
          <div class="spread">
            ${d.prev ? h`<a class="btn small ghost" href="#/mission/${d.prev}">${icon('back')} Previous</a>` : h`<span></span>`}
            ${d.next ? h`<a class="btn small ${done ? 'primary' : 'ghost'}" href="#/mission/${d.next}">Next ${icon('arrow')}</a>` : h`<a class="btn small ${done ? 'primary' : 'ghost'}" href="#/">Classroom ${icon('arrow')}</a>`}
          </div>
        </div>
      </div>`);

    // ---- wiring ----
    const hb = $('#hint-btn');
    if (hb) hb.onclick = () => { d.hintsShown++; renderMission(main, d); };
    $$('[data-input]', main).forEach((el) => { el.oninput = () => { d.inputs[el.dataset.input] = el.value; }; });

    const cb = $('#check-btn');
    if (cb) cb.onclick = async () => {
      busy(cb, 'Checking your work…');
      try {
        const r = await api('POST', `/api/missions/${m.id}/check`, { inputs: d.inputs });
        if (r.cs) state.session.cs = r.cs;
        d.mission = r.mission;
        d.result = r.result;
        state.curriculum = null;
        celebrate(r);
        renderMission(main, d);
      } catch (e) {
        if (!e.silent) toast(e.message, 'warn');
        unbusy(cb);
      }
    };

    const ta = $('#reflection');
    if (ta) {
      const wc = $('#wc');
      const count = () => { const n = ta.value.trim().split(/\s+/).filter(Boolean).length; d.draft = ta.value; wc.textContent = `${n} word${n === 1 ? '' : 's'} · ${m.minWords} needed`; };
      ta.oninput = count;
      count();
      $('#reflect-btn').onclick = async (ev) => {
        const btn = ev.currentTarget;
        busy(btn, 'Saving…');
        try {
          const r = await api('POST', `/api/missions/${m.id}/confirm`, { reflection: ta.value });
          d.mission = r.mission;
          state.curriculum = null;
          celebrate(r);
          renderMission(main, d);
        } catch (e) { if (!e.silent) toast(e.message, 'warn'); unbusy(btn); }
      };
    }

    const qf = $('#quiz-form');
    if (qf) {
      $$('.option input', qf).forEach((inp) => {
        inp.onchange = () => $$(`input[name="${inp.name}"]`, qf).forEach((x) => {
          const label = x.parentNode; // <label class="option"><input>…</label>
          if (x.checked) label.classList.add('selected'); else label.classList.remove('selected');
        });
      });
      qf.onsubmit = async (ev) => {
        ev.preventDefault();
        const answers = m.questions.map((_, i) => { const c = $(`input[name="q${i}"]:checked`, qf); return c ? Number(c.value) : null; });
        if (answers.includes(null) && !confirm('Some questions are unanswered. Submit anyway?')) return;
        const btn = qf.querySelector('button[type=submit]');
        busy(btn, 'Grading…');
        try {
          const r = await api('POST', `/api/missions/${m.id}/quiz`, { answers });
          d.quiz = r;
          d.mission = r.mission;
          state.curriculum = null;
          celebrate(r);
          renderMission(main, d);
          window.scrollTo(0, 0);
        } catch (e) { if (!e.silent) toast(e.message, 'warn'); unbusy(btn); }
      };
      const rb = $('#retry-btn');
      if (rb) rb.onclick = () => { d.quiz = null; renderMission(main, d); };
    }

    const sk = $('#skip-btn');
    if (sk) sk.onclick = async () => {
      if (!confirm('Skip this mission? You can come back to it later.')) return;
      const r = await api('POST', `/api/missions/${m.id}/skip`, {});
      d.mission = r.mission;
      state.curriculum = null;
      toast('Mission skipped');
      renderMission(main, d);
    };
  }

  // ------------------------------------------------------------ shared helpers
  // Reads key from a query string such as "q=abc&x=1" (IE11 has no URLSearchParams).
  const qparam = (qs, key) => {
    const m = new RegExp(`(?:^|&)${key}=([^&]*)`).exec(qs || '');
    return m ? decodeURIComponent(m[1].replace(/\+/g, ' ')) : null;
  };

  async function ensureGuides(force) {
    if (!state.guides || force) {
      state.guides = await api('GET', '/api/guides');
      state.domains = state.guides.domains;
      state.guides.guides.forEach((g) => { guideTitles[g.id] = g.title; });
    }
    return state.guides;
  }

  function domainChip(id) {
    const d = state.domains && state.domains[id];
    if (!d) return '';
    return h`<a class="pill accent wrap" href="#/path/${d.cert}" title="${d.short} exam">${d.short} · ${d.title}</a>`;
  }

  const LEVEL_LABEL = { basic: 'Basic', intermediate: 'Intermediate', advanced: 'Advanced' };
  const pctOf = (x) => (x === null || x === undefined ? null : Math.round(100 * x));
  // Small horizontal meter, coloured by how far along it is.
  const meter = (p, label) => {
    const v = p === null || p === undefined ? 0 : p;
    const cls = p === null || p === undefined ? '' : v >= 75 ? 'good' : v >= 50 ? 'mid' : 'low';
    return h`<div class="meter ${cls}" role="progressbar" aria-valuenow="${v}" aria-valuemin="0" aria-valuemax="100" aria-label="${label || 'Progress'}"><span style="width:${v}%"></span></div>`;
  };
  const miniRing = (p, color) => {
    const r = 18; const c = 2 * Math.PI * r;
    return raw(`<svg class="mini-ring" viewBox="0 0 44 44" role="img" aria-label="${p}%"><circle cx="22" cy="22" r="${r}" fill="none" stroke-width="5" class="ring-track"/><circle cx="22" cy="22" r="${r}" fill="none" stroke-width="5" stroke-linecap="round" stroke="${color}" stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${(c * (1 - p / 100)).toFixed(1)}" transform="rotate(-90 22 22)"/><text x="22" y="26" text-anchor="middle" font-size="11" font-weight="700" class="ring-text">${p}</text></svg>`);
  };
  // "5-0158", "Cloud" or "Skill path" — how a path is labelled.
  const codeOf = (p) => (p.kind === 'skill' ? 'Skill path' : p.id === 'cloud' ? 'Cloud' : p.id);
  const examFacts = (e) => h`<span class="chip">${icon('exam')} ${e.questions} questions</span><span class="chip">${icon('clock')} ${e.minutes} min</span><span class="chip">${icon('target')} pass ${e.pass}%</span>`;

  // ------------------------------------------------------------ learning paths
  async function pagePaths(main) {
    const [r, practice] = await Promise.all([api('GET', '/api/paths'), api('GET', '/api/practice'), ensureGuides()]);
    const by = {};
    r.paths.forEach((p) => { by[p.id] = p; });
    const node = (id, children) => ({ label: `${id === 'cloud' ? '' : `${id} · `}${by[id].short}`, icon: 'module', href: `#/path/${id}`, note: `${by[id].readiness}% ready`, children });
    const roadmap = { type: 'tree', root: node('5-0158', [node('5-0159', [node('5-0156'), { ...node('cloud'), note: `also needs 5-0158 · ${by.cloud.readiness}% ready` }]), node('5-0157'), node('5-0155')]) };
    put(main, h`
      <div class="page-head"><div><div class="eyebrow">Learning paths</div><h1>Your road to OpenText certification</h1>
        <p>One path per OpenText Content Management certification. Each follows the official exam outline: its domains and their weights, the guides and modules that teach each domain, drills per domain, and a timed simulation of the real exam.</p></div></div>
      <div class="grid two" style="grid-template-columns:minmax(0,1fr) minmax(0,1.4fr)">
        <div class="card"><h2>Certification roadmap</h2>
          <p class="small muted">Prerequisites flow downwards: Business User is the foundation for every other exam.</p>
          ${figure(roadmap)}
        </div>
        <div class="card"><h2>How a path works</h2>
          ${figure({ type: 'flow', steps: [{ label: 'Read the guides', sub: 'per exam domain' }, { label: 'Do the modules', sub: 'hands-on in Content Server' }, { label: 'Drill weak domains', sub: '10-question drills' }, { label: 'Simulate the exam', sub: 'real length, timer, pass mark', kind: 'end' }] })}
          <p class="small muted" style="margin:10px 0 0"><b>Readiness</b> combines what you have covered (guides read, missions done) with how you score on that domain's questions. Aim for 80%+ on every heavy domain and a passed simulation before you book the exam.</p>
        </div>
      </div>
      <div class="section-title"><h2>Certifications and skill paths</h2></div>
      <div class="grid auto paths">
        ${r.roadmap.map((id) => by[id]).concat(r.paths.filter((p) => p.kind === 'skill')).map((p) => h`<a class="card card-link path-card" href="#/path/${p.id}" style="border-top:4px solid ${p.color}">
          <div class="spread"><div><div class="eyebrow" style="color:${p.color}">${p.kind === 'skill' ? 'Skill path · not an OpenText exam' : `${codeOf(p)} · ${p.level}`}</div><h3>${p.title}</h3></div>${miniRing(p.readiness, p.color)}</div>
          <p class="small muted">${p.summary}</p>
          <div class="chips">${examFacts(p.exam)}</div>
          <div class="path-meta small muted">${p.domains} domains · ${p.guides} guides · ${p.questions} practice questions${p.bestSim !== null ? h` · best simulation <b>${p.bestSim}%</b>` : ''}</div>
          ${p.requires.length ? h`<div class="small faint">Requires ${p.requires.map((x) => by[x].short).join(' + ')}</div>` : ''}
          ${r.focus === p.id ? h`<span class="pill accent">${icon('flag')} Your focus</span>` : ''}
        </a>`)}
      </div>
      <div class="section-title"><h2>Practice in your sandbox</h2><span class="small muted">Hands-on labs in your own Content Server, checked live</span></div>
      <div class="grid auto">${practice.paths.map((pp) => practiceCard(pp))}</div>`);
  }

  function practiceCard(pp) {
    return h`<a class="card card-link path-card" href="#/practice/${pp.id}" style="border-top:4px solid ${pp.color}">
      <div class="spread"><div><div class="eyebrow" style="color:${pp.color}">Practice path · ${pp.stages} stages</div><h3>${pp.title}</h3></div>${miniRing(pct(pp.done, pp.total), pp.color)}</div>
      <p class="small muted">${pp.summary}</p>
      <div class="path-meta small muted">${pp.done} of ${pp.total} steps done${pp.next ? h` · next: <b>${pp.next.title}</b>` : pp.done ? ' · complete' : ''}</div>
    </a>`;
  }

  async function pagePractice(main, id) {
    const [{ path: pp }] = await Promise.all([api('GET', `/api/practice/${id}`), ensureGuides()]);
    const stIcon = (m) => (m.status === 'done' ? h`<span class="status-ico done" title="Done">${icon('check')}</span>`
      : m.status === 'skipped' ? h`<span class="status-ico skipped" title="Skipped">${icon('dash')}</span>`
        : m.locked ? h`<span class="status-ico locked" title="Needs an earlier step">${icon('lock')}</span>` : h`<span class="status-ico" title="To do"></span>`);
    let n = 0;
    put(main, h`
      <div class="crumbs"><a href="#/paths">Learning paths</a> › Practice</div>
      <div class="page-head"><div><div class="eyebrow" style="color:${pp.color}">Practice path · hands-on in your Content Server</div><h1>${pp.title}</h1><p>${pp.summary}</p></div>
        <div style="min-width:200px"><div class="small muted">${pp.done} of ${pp.total} steps done</div><div class="bar" style="margin-top:6px"><span style="width:${pct(pp.done, pp.total)}%"></span></div>
          ${pp.next ? h`<a class="btn primary" style="margin-top:12px;width:100%" href="#/mission/${pp.next.id}">${icon('play')} ${pp.done ? 'Continue' : 'Start'}: ${pp.next.title}</a>` : ''}</div></div>
      <div class="grid two" style="margin-bottom:16px">
        ${pp.intro ? h`<div class="brief">${icon('bulb')}<div>${pp.intro}</div></div>` : ''}
        ${pp.needs ? h`<div class="notice">${icon('alert')} <b>What you need:</b> ${pp.needs}</div>` : ''}
      </div>
      <ol class="practice-stages">${pp.stages.map((st, si) => {
        const done = st.missions.filter((m) => m.status === 'done').length;
        return h`<li class="practice-stage ${done === st.missions.length ? 'complete' : ''}">
          <div class="ps-marker" style="background:${pp.color}">${done === st.missions.length ? icon('check') : si + 1}</div>
          <div class="card ps-card">
            <div class="spread"><div><h2>${st.title}</h2>${st.summary ? h`<p class="small muted" style="margin:0">${st.summary}</p>` : ''}</div><span class="pill">${done}/${st.missions.length}</span></div>
            <ul class="mission-list">${st.missions.map((m) => { n++; return h`<li><a href="#/mission/${m.id}">${stIcon(m)}
              <div><div class="t">${n}. ${m.title}</div><div class="small muted">${m.moduleTitle}${m.featureStatus === 'not-detected' ? ' · not detected on your server' : ''}</div></div>
              <div class="m"><span class="pill ${TYPE[m.type].cls}">${TYPE[m.type].label}</span></div></a></li>`; })}</ul>
            ${st.guides.length ? h`<div class="ps-guides small">${icon('guide')} Keep open: ${st.guides.map((g, i) => h`${i ? ' · ' : ''}<a href="#/guide/${g.id}">${g.title}</a>${g.read ? ' ✓' : ''}`)}</div>` : ''}
          </div></li>`;
      })}</ol>`);
  }

  async function pagePath(main, id) {
    const [{ path: p, focus }] = await Promise.all([api('GET', `/api/paths/${id}`), ensureGuides()]);
    const maxW = Math.max(...p.domains.map((d) => d.weight));
    put(main, h`
      <div class="crumbs"><a href="#/paths">Learning paths</a> › ${p.short}</div>
      <div class="page-head">
        <div><div class="eyebrow" style="color:${p.color}">${p.kind === 'skill' ? 'Skill path · CS Academy (not an OpenText exam)' : p.id === 'cloud' ? `Cloud · ${p.level}` : `Exam ${p.id} · ${p.level}`}</div><h1>${p.title}</h1><p>${p.summary}</p>
          <div class="chips" style="margin-top:10px">${examFacts(p.exam)}<span class="chip">${p.exam.format}</span></div></div>
        <div class="row-flex">
          ${focus === p.id ? h`<button class="btn small" data-focus="none">${icon('flag')} Clear focus</button>` : h`<button class="btn small" data-focus="${p.id}">${icon('flag')} Make this my focus</button>`}
        </div>
      </div>

      <div class="grid three path-top">
        <div class="card readiness"><h3>Readiness</h3>
          <div class="row-flex">${ring(p.readiness)}<div class="small muted"><div><b>${p.coverage}%</b> covered</div><div>${p.sims} simulation${p.sims === 1 ? '' : 's'}</div><div>Best: <b>${p.bestSim === null ? '—' : `${p.bestSim}%`}</b> (pass ${p.exam.pass}%)</div></div></div>
        </div>
        <div class="card"><h3>${p.kind === 'skill' ? 'Skill check' : 'Take the exam here'}</h3>
          <p class="small muted">${p.kind === 'skill' ? 'A timed check across the domains of this path, weighted like a real exam.' : 'The simulation uses the real exam\'s length, time limit and pass mark, with questions spread across domains by their weight.'}</p>
          <div class="stack" style="margin-top:8px">
            <a class="btn primary" href="#/exam?cert=${p.id}&mode=sim">${icon('play')} ${p.kind === 'skill' ? 'Skill check' : 'Exam simulation'} · ${p.exam.questions} q · ${p.exam.minutes} min</a>
            <a class="btn" href="#/exam?cert=${p.id}&mode=quick">${icon('refresh')} Quick practice · 15 questions</a>
          </div>
        </div>
        <div class="card"><h3>Before you book</h3>
          ${p.requires.length ? h`<p class="small"><b>Prerequisite certification${p.requires.length > 1 ? 's' : ''}:</b> ${p.requiresTitles.map((r, i) => h`${i ? ' and ' : ''}<a href="#/path/${r.id}">${r.short}</a>`)}</p>` : h`<p class="small"><b>No prerequisite certification.</b></p>`}
          ${p.requiresNote ? h`<p class="small muted">${p.requiresNote}</p>` : ''}
          <p class="small" style="margin-bottom:4px"><b>Recommended OpenText courses</b></p>
          <ul class="small tight">${p.courses.map((c) => h`<li>${c}</li>`)}</ul>
          <a class="small" href="${p.url}" target="_blank" rel="noopener">${icon('external')} Official exam page</a>
        </div>
      </div>

      <div class="card" style="margin-top:16px">
        <div class="spread"><h2>Exam blueprint</h2><span class="small muted">${p.estimated ? 'Weights estimated by this trainer — OpenText does not publish them' : 'Domain weights from the official exam outline'}</span></div>
        <table class="table blueprint"><thead><tr><th>Domain</th><th class="num">Weight</th><th style="width:28%">Share of the exam</th><th style="width:22%">Your readiness</th></tr></thead>
          <tbody>${p.domains.map((d) => h`<tr>
            <td><a href="#/path/${p.id}" data-anchor="d-${d.id}">${d.title}</a></td><td class="num"><b>${d.weight}%</b></td>
            <td><div class="wbar" style="width:${Math.round((100 * d.weight) / maxW)}%;background:${p.color}"></div></td>
            <td>${meter(pctOf(d.readiness), `Readiness for ${d.title}`)}<span class="small faint">${pctOf(d.readiness)}%${d.accuracy !== null ? ` · ${pctOf(d.accuracy)}% correct` : ''}</span></td></tr>`)}</tbody></table>
        ${p.objectivesNote ? h`<p class="small muted" style="margin:10px 0 0">${p.objectivesNote}</p>` : ''}
      </div>

      <div class="section-title"><h2>Study plan</h2><span class="small muted">Work through the domains in order; drill any domain below 75%.</span></div>
      <div class="stack">${p.domains.map((d, i) => h`
        <details class="card domain" id="d-${d.id}" ${i === 0 ? 'open' : ''}>
          <summary><span class="domain-n" style="background:${p.color}">${i + 1}</span><span class="domain-t"><b>${d.title}</b><span class="small muted">${d.weight}% of the exam · ${d.guides.read}/${d.guides.total} guides read · ${d.missions.done}/${d.missions.total} missions · ${d.questions} questions</span></span>
            <span class="domain-m">${meter(pctOf(d.readiness), 'Readiness')}</span></summary>
          <div class="domain-body">
            <div class="grid two">
              <div><h3>What the exam expects</h3><ul class="keypoints">${d.objectives.map((o) => h`<li>${o}</li>`)}</ul></div>
              <div>
                <h3>Read</h3>
                ${d.guides.length ? h`<ul class="link-list">${d.guides.map((g) => h`<li><a href="#/guide/${g.id}">${icon(g.read ? 'check' : 'guide')}<span><b>${g.title}</b><span class="small muted">${LEVEL_LABEL[g.level] || ''}${g.minutes ? ` · ${g.minutes} min` : ''}${g.read ? ' · read' : ''}</span></span></a></li>`)}</ul>` : h`<p class="small muted">No guide for this domain yet.</p>`}
                <h3 style="margin-top:14px">Practise</h3>
                ${d.modules.length ? h`<ul class="link-list">${d.modules.map((m) => h`<li><a href="#/module/${m.id}">${icon(m.done === m.total ? 'check' : 'book')}<span><b>${m.title}</b><span class="small muted">${m.done}/${m.total} missions done</span></span></a></li>`)}</ul>` : h`<p class="small muted">No module for this domain yet.</p>`}
                <div class="row-flex" style="margin-top:12px">
                  ${d.questions ? h`<a class="btn small primary" href="#/exam?cert=${p.id}&domain=${d.id}">${icon('target')} Drill this domain (10)</a>` : ''}
                  ${d.answered ? h`<span class="small muted">${d.correct}/${d.answered} answered correctly so far</span>` : ''}
                </div>
              </div>
            </div>
          </div>
        </details>`)}</div>

      ${p.skills.length ? h`<div class="card" style="margin-top:16px"><h2>Skills this certification proves</h2><div class="chips">${p.skills.map((s) => h`<span class="chip">${s}</span>`)}</div></div>` : ''}

      <div class="card" style="margin-top:16px"><h2>Your attempts</h2>
        ${p.history.length ? h`<table class="table"><thead><tr><th>When</th><th>Kind</th><th class="num">Score</th><th>Result</th></tr></thead><tbody>${p.history.map((e) => h`<tr><td>${ago(e.at)}</td><td>${e.title}</td><td class="num"><b>${pct(e.correct, e.total)}%</b> <span class="faint">(${e.correct}/${e.total})</span></td><td>${e.passed ? h`<span class="pill pass">pass</span>` : h`<span class="pill fail">below ${e.pass}%</span>`}${e.overtime ? h` <span class="pill warn">over time</span>` : ''}</td></tr>`)}</tbody></table>` : h`<p class="muted">No attempts yet.</p>`}
      </div>`);
    $$('[data-focus]', main).forEach((b) => {
      b.onclick = async () => {
        await api('POST', `/api/paths/${b.dataset.focus}/focus`, {});
        toast(b.dataset.focus === 'none' ? 'Focus cleared' : 'This is now your focus');
        pagePath(main, id);
      };
    });
  }

  // ------------------------------------------------------------ handbook
  async function pageHandbook(main, qs) {
    const g = await ensureGuides(true);
    const area = qparam(qs, 'area') || 'all';
    const cert = qparam(qs, 'cert') || 'all';
    const certDomains = cert === 'all' ? null : (g.certs.find((c) => c.id === cert) || { domains: [] }).domains;
    const shown = g.guides.filter((x) => (area === 'all' || x.area === area) && (!certDomains || x.domains.some((d) => certDomains.includes(d))));
    const areas = Object.keys(g.areas).filter((a) => g.guides.some((x) => x.area === a));
    const read = g.guides.filter((x) => x.read).length;
    const link = (a, c) => `#/handbook?area=${a}&cert=${c}`;
    put(main, h`
      <div class="page-head"><div><div class="eyebrow">Handbook</div><h1>How to do things in Content Server</h1>
        <p>${g.guides.length} reference guides with step-by-step procedures, diagrams and exam notes — for studying, and for looking things up at work. You have read ${read}.</p></div>
        <a class="btn" href="#/glossary">${icon('az')} Glossary</a></div>
      <div class="card flat filter-bar">
        <input class="input" id="hb-filter" type="search" placeholder="Filter these guides…" aria-label="Filter guides" autocomplete="off">
        <nav class="tabs" aria-label="Areas"><a href="${link('all', cert)}" class="${area === 'all' ? 'active' : ''}">All areas</a>${areas.map((a) => h`<a href="${link(a, cert)}" class="${area === a ? 'active' : ''}">${g.areas[a]}</a>`)}</nav>
        <div class="row-flex small"><span class="muted">Exam:</span>
          <a class="pill ${cert === 'all' ? 'accent' : ''}" href="${link(area, 'all')}">Any</a>
          ${g.certs.map((c) => h`<a class="pill ${cert === c.id ? 'accent' : ''}" href="${link(area, c.id)}">${c.short}</a>`)}</div>
      </div>
      ${shown.length ? areas.filter((a) => shown.some((x) => x.area === a)).map((a) => h`
        <div class="section-title"><h2>${g.areas[a]}</h2><span class="small muted">${shown.filter((x) => x.area === a).length} guides</span></div>
        <div class="grid auto guides">${shown.filter((x) => x.area === a).map((x) => h`
          <a class="card card-link guide-card" href="#/guide/${x.id}" data-text="${`${x.title} ${x.summary} ${x.tags.join(' ')}`.toLowerCase()}">
            <div class="spread"><span class="pill">${LEVEL_LABEL[x.level] || ''}${x.minutes ? ` · ${x.minutes} min` : ''}</span>${x.read ? h`<span class="pill pass">${icon('check')} read</span>` : ''}</div>
            <h3>${x.title}</h3><p class="small muted">${x.summary}</p>
          </a>`)}</div>`) : h`<div class="card empty">${g.guides.length ? 'No guide matches these filters.' : 'The handbook is empty.'}</div>`}`);
    const f = $('#hb-filter');
    f.oninput = () => {
      const v = f.value.trim().toLowerCase();
      $$('.guide-card', main).forEach((c) => { c.style.display = !v || c.getAttribute('data-text').indexOf(v) !== -1 ? '' : 'none'; });
    };
  }

  async function pageGuide(main, id) {
    const [r] = await Promise.all([api('GET', `/api/guides/${id}`), ensureGuides()]);
    const g = r.guide;
    const toc = g.body.filter((b) => b && b.h).map((b) => b.h);
    put(main, h`
      <div class="crumbs"><a href="#/handbook">Handbook</a> › <a href="#/handbook?area=${g.area}&cert=all">${r.areaTitle}</a></div>
      <div class="page-head"><div><div class="eyebrow">${r.areaTitle}</div><h1>${g.title}</h1><p>${g.summary}</p>
        <div class="row-flex" style="margin-top:10px"><span class="pill">${LEVEL_LABEL[g.level] || ''}</span>${g.minutes ? h`<span class="pill">${icon('clock')} ${g.minutes} min read</span>` : ''}${g.domainTitles.map((d) => domainChip(d.id))}</div></div>
        <button class="btn ${g.read ? '' : 'primary'}" id="read-btn">${icon('check')} ${g.read ? 'Read' : 'Mark as read'}</button></div>
      <div class="guide-grid">
        <article class="card rich guide-body">${blocks(g.body)}
          ${g.sources.length ? h`<div class="sources"><b>Sources</b><ul>${g.sources.map((s) => h`<li>${linkify(s)}</li>`)}</ul><p class="faint">Written for CS Academy from these sources; not OpenText's own text.</p></div>` : ''}
        </article>
        <aside class="stack guide-side">
          ${toc.length > 1 ? h`<nav class="card toc" aria-label="On this page"><h3>On this page</h3><ol>${toc.map((t) => h`<li><a href="#s-${slug(t)}" data-anchor="s-${slug(t)}">${t}</a></li>`)}</ol></nav>` : ''}
          ${g.moduleTitles.length ? h`<div class="card"><h3>Practise it</h3><ul class="link-list">${g.moduleTitles.map((m) => h`<li><a href="#/module/${m.id}">${icon('book')}<span>${m.title}</span></a></li>`)}</ul></div>` : ''}
          ${g.related.length ? h`<div class="card"><h3>Related guides</h3><ul class="link-list">${g.related.map((x) => h`<li><a href="#/guide/${x.id}">${icon('guide')}<span>${x.title}</span></a></li>`)}</ul></div>` : ''}
          <div class="spread">
            ${r.prev ? h`<a class="btn small ghost" href="#/guide/${r.prev.id}" title="${r.prev.title}">${icon('back')} Previous</a>` : h`<span></span>`}
            ${r.next ? h`<a class="btn small ghost" href="#/guide/${r.next.id}" title="${r.next.title}">Next ${icon('arrow')}</a>` : ''}
          </div>
        </aside>
      </div>`);
    $('#read-btn').onclick = async (ev) => {
      const btn = ev.currentTarget;
      const r2 = await api('POST', `/api/guides/${id}/read`, { read: !g.read });
      g.read = r2.read;
      if (state.guides) state.guides.guides.forEach((x) => { if (x.id === id) x.read = r2.read; });
      btn.className = `btn ${g.read ? '' : 'primary'}`;
      put(btn, h`${icon('check')} ${g.read ? 'Read' : 'Mark as read'}`);
      if (g.read) toast('Marked as read — it counts towards your learning paths');
    };
  }

  async function pageGlossary(main, qs) {
    const [r] = await Promise.all([api('GET', '/api/glossary'), ensureGuides()]);
    const want = qparam(qs, 'term');
    const letters = [];
    r.terms.forEach((t) => { const L = t.term[0].toUpperCase(); if (letters.indexOf(L) === -1) letters.push(L); });
    put(main, h`
      <div class="page-head"><div><div class="eyebrow">Glossary</div><h1>Content Server vocabulary</h1>
        <p>${r.terms.length} terms you meet at work and in the exams, each linked to the guide that explains it.</p></div>
        <a class="btn" href="#/handbook">${icon('guide')} Handbook</a></div>
      <div class="card flat filter-bar">
        <input class="input" id="gl-filter" type="search" placeholder="Filter terms…" aria-label="Filter terms" autocomplete="off" value="${want || ''}">
        <div class="az">${letters.map((L) => h`<a href="#" data-letter="${L}">${L}</a>`)}</div>
      </div>
      <dl class="glossary">${r.terms.map((t) => h`<div class="gl ${want && t.term === want ? 'hl' : ''}" id="gl-${slug(t.term)}" data-letter="${t.term[0].toUpperCase()}" data-text="${`${t.term} ${t.def}`.toLowerCase()}">
        <dt>${t.term}${t.area ? h` <span class="pill">${r.areas[t.area]}</span>` : ''}</dt>
        <dd>${inl(t.def)}${t.guide && t.guideTitle ? h` <a class="small" href="#/guide/${t.guide}">→ ${t.guideTitle}</a>` : ''}</dd></div>`)}</dl>
      ${r.terms.length ? '' : h`<div class="card empty">The glossary is empty.</div>`}`);
    const f = $('#gl-filter');
    const apply = () => {
      const v = f.value.trim().toLowerCase();
      $$('.gl', main).forEach((el) => { el.style.display = !v || el.getAttribute('data-text').indexOf(v) !== -1 ? '' : 'none'; });
    };
    f.oninput = apply;
    if (want) {
      f.value = '';
      const el = document.getElementById(`gl-${slug(want)}`);
      if (el) setTimeout(() => el.scrollIntoView(), 0);
    }
    $$('[data-letter]', $('.az', main)).forEach((a) => {
      a.onclick = (ev) => {
        ev.preventDefault();
        f.value = '';
        apply();
        const el = $(`.gl[data-letter="${a.getAttribute('data-letter')}"]`, main);
        if (el) el.scrollIntoView();
      };
    });
  }

  async function pageSearch(main, qs) {
    const q = qparam(qs, 'q') || '';
    const [r] = await Promise.all([api('GET', `/api/search?q=${encodeURIComponent(q)}`), ensureGuides()]);
    const KIND = { guide: ['Guides', 'guide'], term: ['Glossary', 'az'], module: ['Modules', 'book'], mission: ['Missions', 'play'] };
    const groups = Object.keys(KIND).map((k) => [k, r.results.filter((x) => x.kind === k)]).filter(([, list]) => list.length);
    put(main, h`
      <div class="page-head"><div><div class="eyebrow">Search</div><h1>${q ? `Results for “${q}”` : 'Search'}</h1>
        <p>${r.results.length ? `${r.results.length} result${r.results.length === 1 ? '' : 's'} in the handbook, glossary and curriculum.` : q ? 'Nothing found. Try fewer or different words — e.g. a feature name like “compound document” or “transport”.' : 'Type a feature, task or term in the search box.'}</p></div></div>
      ${groups.map(([k, list]) => h`
        <div class="section-title"><h2>${KIND[k][0]}</h2><span class="small muted">${list.length}</span></div>
        <div class="card"><ul class="link-list results">${list.map((x) => h`<li><a href="${x.href}">${icon(KIND[k][1])}<span><b>${x.title}</b><span class="small muted">${x.summary}</span>${x.snippet ? h`<span class="small faint">${x.snippet}</span>` : ''}</span></a></li>`)}</ul></div>`)}`);
  }

  // ------------------------------------------------------------ practice exams
  async function pageExam(main, qs) {
    if (state.exam && state.exam.phase === 'running') return renderExam(main);
    const certId = qparam(qs, 'cert');
    if (certId) return startExam(main, `cert=${encodeURIComponent(certId)}&mode=${encodeURIComponent(qparam(qs, 'mode') || 'sim')}${qparam(qs, 'domain') ? `&domain=${encodeURIComponent(qparam(qs, 'domain'))}` : ''}&count=${qparam(qs, 'domain') ? 10 : 15}`);
    const [cur, paths] = await Promise.all([getCurriculum(), api('GET', '/api/paths')]);
    const qCount = (track) => cur.modules.filter((m) => !track || m.track === track).reduce((a, m) => a + m.missions.filter((x) => x.type === 'quiz').reduce((b, x) => b + x.questions.length, 0), 0);
    put(main, h`
      <div class="page-head"><div><div class="eyebrow">Practice exams</div><h1>Test yourself under exam conditions</h1>
        <p>Certification simulations match the real exam's length, time limit and pass mark. Answer options are shuffled; explanations come at the end.</p></div></div>
      <div class="section-title"><h2>Certification exams and skill checks</h2></div>
      <div class="grid auto">${paths.paths.map((p) => h`
        <div class="card exam-card" style="border-top:4px solid ${p.color}">
          <div class="eyebrow" style="color:${p.color}">${codeOf(p)}</div><h3>${p.short}</h3>
          <div class="chips">${examFacts(p.exam)}</div>
          <p class="small muted" style="margin:8px 0">${p.questions} questions in the pool${p.bestSim !== null ? h` · best ${p.bestSim}%` : ''}</p>
          <div class="row-flex">
            <a class="btn small primary" href="#/exam?cert=${p.id}&mode=sim">${icon('play')} Simulate</a>
            <a class="btn small" href="#/exam?cert=${p.id}&mode=quick">Quick 15</a>
            <a class="btn small ghost" href="#/path/${p.id}">Domains ${icon('arrow')}</a>
          </div>
        </div>`)}</div>
      <div class="section-title"><h2>Knowledge checks by track</h2></div>
      <div class="grid two">
        <div class="card">
          <div class="field"><label for="ex-track">Scope</label>
            <select class="input" id="ex-track">
              <option value="all">All tracks (${qCount()} questions)</option>
              ${cur.tracks.filter((t) => qCount(t.id)).map((t) => h`<option value="${t.id}">${t.title} (${qCount(t.id)} questions)</option>`)}
            </select></div>
          <div class="field"><label for="ex-count">Number of questions</label>
            <select class="input" id="ex-count"><option>10</option><option selected>20</option><option>30</option><option>40</option></select></div>
          <button class="btn primary" id="ex-start">${icon('play')} Start</button>
        </div>
        <div class="card"><h2>Recent attempts</h2><div id="ex-history" class="muted small">Loading…</div></div>
      </div>`);
    api('GET', '/api/progress').then((p) => {
      const el = $('#ex-history');
      if (!el) return;
      put(el, p.exams.length ? h`<table class="table"><thead><tr><th>When</th><th>Exam</th><th class="num">Score</th></tr></thead><tbody>${p.exams.slice(0, 8).map((e) => h`<tr><td>${ago(e.at)}</td><td>${e.title || e.track}</td><td class="num"><b>${pct(e.correct, e.total)}%</b> <span class="faint">(${e.correct}/${e.total})</span></td></tr>`)}</tbody></table>` : h`<p>No attempts yet.</p>`);
    }).catch(() => {});
    $('#ex-start').onclick = () => startExam(main, `track=${encodeURIComponent($('#ex-track').value)}&count=${encodeURIComponent($('#ex-count').value)}`);
  }

  async function startExam(main, query) {
    put(main, h`<div class="loading"><span class="spinner"></span> Preparing your exam…</div>`);
    try {
      const [e] = await Promise.all([api('GET', `/api/exam/new?${query}`), ensureGuides()]);
      state.exam = { phase: 'running', data: e, idx: 0, answers: e.questions.map(() => null), flags: e.questions.map(() => false), started: Date.now() };
      renderExam(main);
    } catch (err) {
      if (!err.silent) put(main, h`<div class="card"><h2>Couldn't start this exam</h2><p class="muted">${err.message}</p><a class="btn" href="#/exam">Back to practice exams</a></div>`);
    }
  }

  let examTimer = null;
  function stopTimer() { if (examTimer) { clearInterval(examTimer); examTimer = null; } }
  const mmss = (s) => `${Math.floor(s / 60)}:${String(Math.max(0, s % 60)).padStart(2, '0')}`;

  function renderExam(main) {
    const ex = state.exam;
    const qs = ex.data.questions;
    const q = qs[ex.idx];
    const isAnswered = (a) => a !== null && (!Array.isArray(a) || a.length > 0);
    const answered = ex.answers.filter(isAnswered).length;
    const mine = ex.answers[ex.idx];
    const chosen = (k) => (q.multi ? Array.isArray(mine) && mine.indexOf(k) !== -1 : mine === k);
    put(main, h`
      <div class="page-head"><div><div class="eyebrow">${ex.data.title}</div><h1>Question ${ex.idx + 1} of ${qs.length}</h1><p>${answered} answered · ${q.module}${ex.data.pass ? ` · pass mark ${ex.data.pass}%` : ''}</p></div>
        <div class="row-flex">${ex.data.minutes ? h`<span class="timer" id="ex-timer">${icon('clock')} <span>--:--</span></span>` : ''}<button class="btn ghost" id="ex-quit">${icon('x')} Abandon</button></div></div>
      <div class="bar" style="margin-bottom:18px"><span style="width:${pct(answered, qs.length)}%"></span></div>
      <div class="mission-grid">
        <div class="card question">
          <div class="qt" style="font-size:1.1rem">${inl(q.q)}</div>
          ${q.multi ? h`<div class="pill info" style="margin-bottom:10px">Choose ${q.multi}</div>` : ''}
          <div class="options">${q.options.map((o, k) => h`<label class="option ${chosen(k) ? 'selected' : ''}"><input type="${q.multi ? 'checkbox' : 'radio'}" name="exq" value="${k}" ${chosen(k) ? 'checked' : ''}><span>${inl(o)}</span></label>`)}</div>
          <div class="spread" style="margin-top:16px">
            <button class="btn" id="ex-prev" ${ex.idx === 0 ? 'disabled' : ''}>${icon('back')} Previous</button>
            <button class="btn ghost small" id="ex-flag">${icon('flag')} ${ex.flags[ex.idx] ? 'Unflag' : 'Flag for review'}</button>
            ${ex.idx < qs.length - 1 ? h`<button class="btn primary" id="ex-next">Next ${icon('arrow')}</button>` : h`<button class="btn primary" id="ex-submit">${icon('check')} Submit exam</button>`}
          </div>
        </div>
        <div class="card side-card"><h3>Questions</h3>
          <div class="exam-nav">${qs.map((_, i) => h`<button type="button" data-q="${i}" class="${isAnswered(ex.answers[i]) ? 'answered' : ''} ${i === ex.idx ? 'current' : ''} ${ex.flags[i] ? 'flagged' : ''}" aria-label="Question ${i + 1}${ex.flags[i] ? ', flagged' : ''}">${i + 1}</button>`)}</div>
          <p class="small muted" style="margin:10px 0 0">${ex.flags.filter(Boolean).length ? `${ex.flags.filter(Boolean).length} flagged for review.` : 'Flag a question to come back to it.'}</p>
          <button class="btn small" id="ex-submit2" style="margin-top:12px">Submit now</button>
        </div>
      </div>`);
    $$('input[name=exq]', main).forEach((inp) => {
      inp.onchange = () => {
        const k = Number(inp.value);
        if (q.multi) {
          const cur = Array.isArray(ex.answers[ex.idx]) ? ex.answers[ex.idx].slice() : [];
          const at = cur.indexOf(k);
          if (inp.checked && at === -1) cur.push(k);
          if (!inp.checked && at !== -1) cur.splice(at, 1);
          ex.answers[ex.idx] = cur.length ? cur : null;
        } else ex.answers[ex.idx] = k;
        renderExam(main);
      };
    });
    $$('[data-q]', main).forEach((b) => { b.onclick = () => { ex.idx = Number(b.dataset.q); renderExam(main); }; });
    const nav = (d) => { ex.idx += d; renderExam(main); };
    $('#ex-prev').onclick = () => nav(-1);
    if ($('#ex-next')) $('#ex-next').onclick = () => nav(1);
    $('#ex-flag').onclick = () => { ex.flags[ex.idx] = !ex.flags[ex.idx]; renderExam(main); };
    const submit = async (btn, forced) => {
      const missing = ex.answers.filter((a) => !isAnswered(a)).length;
      if (!forced && missing && !confirm(`${missing} question(s) unanswered. Submit anyway?`)) return;
      stopTimer();
      if (btn) busy(btn, 'Grading…');
      try {
        const r = await api('POST', '/api/exam/submit', { examId: ex.data.examId, answers: ex.answers });
        state.exam = null;
        renderExamResult(main, r);
      } catch (e) { if (!e.silent) toast(e.message, 'warn'); if (btn) unbusy(btn); }
    };
    if ($('#ex-submit')) $('#ex-submit').onclick = (e) => submit(e.currentTarget);
    $('#ex-submit2').onclick = (e) => submit(e.currentTarget);
    $('#ex-quit').onclick = () => { if (confirm('Abandon this exam?')) { stopTimer(); state.exam = null; go('#/exam'); } };
    // Countdown for simulations; at zero the exam is submitted as it stands.
    stopTimer();
    if (ex.data.minutes) {
      const tick = () => {
        const el = $('#ex-timer');
        if (!el || !state.exam) { stopTimer(); return; }
        const left = Math.round((ex.started + ex.data.minutes * 60000 - Date.now()) / 1000);
        put(el.lastChild, mmss(Math.max(0, left)));
        if (left <= 300) el.className = 'timer low';
        if (left <= 0) { toast('Time is up — your exam was submitted.', 'warn'); submit(null, true); }
      };
      tick();
      examTimer = setInterval(tick, 1000);
    }
  }

  function renderExamResult(main, r) {
    const rec = r.record;
    const p = pct(rec.correct, rec.total);
    const verdict = rec.cert ? (rec.passed ? `Pass — you scored ${p}% against a pass mark of ${rec.pass}%.` : `Below the pass mark of ${rec.pass}%. Study the weak domains below and try again.`)
      : p >= 80 ? 'Strong result — you know this material.' : p >= 60 ? 'Solid, with a few gaps to close.' : 'Keep going — review the modules below and try again.';
    const domains = Object.keys(rec.byDomain || {});
    const letter = (k) => String.fromCharCode(65 + k);
    const answerText = (q, a) => (a === null || a === undefined ? 'no answer' : (Array.isArray(a) ? a : [a]).map(letter).join(', '));
    put(main, h`
      <div class="page-head"><div><div class="eyebrow">${rec.title || 'Practice exam'} · results</div><h1>${rec.correct} of ${rec.total} correct · ${p}%</h1><p>${verdict}</p></div>
        <div class="row-flex">${rec.cert ? h`<a class="btn" href="#/path/${rec.cert}">${icon('cap')} Learning path</a>` : ''}<a class="btn primary" href="#/exam">${icon('refresh')} Another exam</a></div></div>
      <div class="grid two" style="grid-template-columns:auto minmax(0,1fr);align-items:start">
        <div class="card" style="text-align:center">${ring(p)}${rec.cert ? h`<div style="margin-top:6px">${rec.passed ? h`<span class="pill pass">${icon('check')} pass</span>` : h`<span class="pill fail">needs ${rec.pass}%</span>`}</div>` : ''}<p class="small faint" style="margin:8px 0 0">${rec.minutes || '<1'} min${rec.overtime ? ' · over the time limit' : ''}</p></div>
        <div class="card">
          ${domains.length ? h`<h2>By exam domain</h2><table class="table"><tbody>${domains.map((d) => { const x = rec.byDomain[d]; const dd = state.domains && state.domains[d]; return h`<tr><td>${dd ? dd.title : d}</td><td style="width:30%">${meter(pct(x.correct, x.total))}</td><td class="num">${x.correct}/${x.total}</td></tr>`; })}</tbody></table>`
            : h`<h2>Where to focus</h2>${r.weakest.length ? h`<ul class="notes">${r.weakest.map((w) => h`<li><b>${w.module}</b> — ${w.correct}/${w.total} correct</li>`)}</ul>` : h`<p class="muted">No weak spots in this sample. Try a longer exam.</p>`}`}
        </div>
      </div>
      <div class="section-title"><h2>Review</h2><span class="small muted">${rec.total - rec.correct} to learn from</span></div>
      <div class="stack">${r.review.map((q, i) => h`
        <div class="card question ${q.correct ? '' : 'missed'}">
          <div class="qn">${i + 1} · ${q.module} · ${q.correct ? 'correct' : q.chosen === null ? 'unanswered' : 'incorrect'}</div>
          <div class="qt">${inl(q.q)}</div>
          <div class="options">${q.options.map((o, k) => {
            const right = q.multi ? q.answer.indexOf(k) !== -1 : k === q.answer;
            const picked = q.multi ? Array.isArray(q.chosen) && q.chosen.indexOf(k) !== -1 : k === q.chosen;
            return h`<div class="option locked ${right ? 'correct' : picked ? 'wrong' : ''}"><span class="opt-l">${letter(k)}</span><span>${inl(o)}</span></div>`;
          })}</div>
          <div class="explain">${q.multi ? h`<b>Answer: ${answerText(q, q.answer)}</b> (you chose ${answerText(q, q.chosen)}). ` : ''}${inl(q.explain)}${q.guide ? h` <a href="#/guide/${q.guide.id}">Read: ${q.guide.title} →</a>` : ''}</div>
        </div>`)}</div>`);
    window.scrollTo(0, 0);
  }

  // ------------------------------------------------------------ progress
  async function pageProgress(main) {
    const [p, cur] = await Promise.all([api('GET', '/api/progress'), getCurriculum(true)]);
    const s = p.stats;
    const csUrl = state.session.csUrl || '';
    const refs = Object.entries(p.refs);
    put(main, h`
      <div class="page-head"><div><div class="eyebrow">My progress</div><h1>${s.level.name} · ${s.xp} XP</h1>
        <p>${s.done} of ${s.total} missions complete${s.level.next ? ` · ${s.level.next.xp - s.xp} XP to ${s.level.next.name}` : ''}</p></div></div>

      <div class="section-title"><h2>Badges</h2><span class="small muted">${s.badges.length} of ${cur.modules.length}</span></div>
      <div class="badge-grid">${cur.modules.map((m) => {
        const got = s.modules[m.id].complete;
        return h`<a class="badge ${got ? '' : 'locked'}" href="#/module/${m.id}" style="color:inherit;text-decoration:none" title="${got ? 'Earned' : 'Complete every mission in this module'}">${medal(TRACK_COLORS[m.track])}<div class="t">${m.title}</div></a>`;
      })}</div>

      <div class="grid two" style="margin-top:22px">
        <div class="card"><h2>Practice exams</h2>
          ${p.exams.length ? h`<table class="table"><thead><tr><th>Date</th><th>Scope</th><th class="num">Score</th></tr></thead><tbody>${p.exams.map((e) => h`<tr><td>${when(e.at)}</td><td>${e.title || e.track}</td><td class="num"><b>${pct(e.correct, e.total)}%</b>${e.cert ? h` ${e.passed ? h`<span class="pill pass">pass</span>` : h`<span class="pill fail">fail</span>`}` : ''}</td></tr>`)}</tbody></table>` : h`<p class="muted">No exams yet. <a href="#/exam">Take one</a>.</p>`}
        </div>
        <div class="card"><h2>Items I know about</h2>
          <p class="small muted">Things you created in Content Server that later missions build on.</p>
          ${refs.length ? h`<table class="table"><tbody>${refs.map(([k, v]) => h`<tr><td class="faint small">${k}</td><td>${v.name}</td><td class="num">${csUrl ? h`<a href="${csUrl}/app/nodes/${v.id}" target="_blank" rel="noopener">${v.id}</a>` : v.id}</td></tr>`)}</tbody></table>` : h`<p class="muted">Nothing yet.</p>`}
        </div>
      </div>

      <div class="card" style="margin-top:16px"><h2>Activity log</h2>
        ${p.activity.length ? h`<ul class="activity">${p.activity.slice(0, 40).map((a) => h`<li><span>${a.text}</span><span class="faint small nowrap">${when(a.at)}</span></li>`)}</ul>` : h`<p class="muted">No activity yet.</p>`}
      </div>

      <div class="card flat" style="margin-top:16px"><div class="spread"><div><h3 style="margin:0">Start over</h3><p class="small muted" style="margin:0">Erases XP, mission results and exam history for your account in this trainer. Nothing in Content Server is touched.</p></div>
        <button class="btn danger" id="reset-btn">Reset my progress</button></div></div>`);
    $('#reset-btn').onclick = async () => {
      if (!confirm('Erase all your CS Academy progress? This cannot be undone.')) return;
      await api('POST', '/api/progress/reset', { confirm: 'RESET' });
      state.stats = null;
      state.curriculum = null;
      toast('Progress reset');
      go('#/');
    };
  }

  // ------------------------------------------------------------ connection
  async function pageConnection(main) {
    const r = await api('GET', '/api/connection');
    if (r.cs) state.session.cs = r.cs;
    const failed = r.rows.filter((x) => !x.ok && !x.optional).length;
    put(main, h`
      <div class="page-head"><div><div class="eyebrow">Connection</div><h1>What your Content Server returns</h1>
        <p>Every check reads <b>${r.trainerUrl}</b> through its REST API, signed in as <b>${r.user.name}</b>. These are the calls I rely on, made just now —
          ${failed ? h`<span class="fail-text">${failed} of them failed</span>, so missions that need them can't be verified.` : 'all of them answered.'}</p></div>
        <button class="btn" id="conn-again">${icon('refresh')} Run again</button></div>
      ${r.publicUrl !== r.trainerUrl ? h`<p class="small muted">Links shown to you open ${r.publicUrl}.</p>` : ''}
      <div class="card" style="overflow-x:auto">
        <table class="table"><thead><tr><th style="width:26px"></th><th>Area</th><th>What came back</th><th>Endpoint</th></tr></thead>
        <tbody>${r.rows.map((x) => h`<tr>
          <td><span class="status-dot ${x.ok ? 'ok' : x.optional ? '' : 'bad'}" title="${x.ok ? 'Answered' : x.optional ? 'Not available (optional module)' : 'Failed'}"></span></td>
          <td class="nowrap"><b>${x.area}</b></td>
          <td>${x.detail}${x.node && x.node.links ? h` · <a href="${x.node.links.smart}" target="_blank" rel="noopener">open</a>` : ''}${!x.ok && x.optional ? h` <span class="faint">(optional module)</span>` : ''}</td>
          <td class="mono small faint">${x.endpoint || ''}</td>
        </tr>`)}</tbody></table>
      </div>
      <p class="small faint" style="margin-top:12px">Checked ${when(r.checkedAt)}. The trainer only reads: it signs in with POST /api/v1/auth and otherwise sends GET requests.</p>`);
    $('#conn-again').onclick = () => router();
  }

  // ------------------------------------------------------------ roster
  async function pageRoster(main) {
    const r = await api('GET', '/api/roster');
    put(main, h`
      <div class="page-head"><div><div class="eyebrow">Class roster</div><h1>${r.learners.length} learner${r.learners.length === 1 ? '' : 's'}</h1><p>Visible to Content Server system administrators only.</p></div></div>
      <div class="card" style="overflow-x:auto">
        <table class="table"><thead><tr><th>Learner</th><th>Level</th><th class="num">XP</th>${r.tracks.map((t) => h`<th>${t.title}</th>`)}<th class="num">Best exam</th><th>Last seen</th></tr></thead>
        <tbody>${r.learners.map((l) => h`<tr>
          <td><b>${l.displayName}</b><div class="small faint">${l.name}</div></td>
          <td>${l.level}</td><td class="num">${l.xp}</td>
          ${r.tracks.map((t) => t.id).map((t) => h`<td style="min-width:110px"><div class="bar"><span style="width:${pct(l.tracks[t].done, l.tracks[t].total)}%"></span></div><div class="small faint">${l.tracks[t].done}/${l.tracks[t].total}</div></td>`)}
          <td class="num">${l.bestExam === null ? '—' : `${l.bestExam}%`}</td>
          <td class="small">${ago(l.lastSeenAt)}</td>
        </tr>`)}</tbody></table>
      </div>`);
  }

  // ------------------------------------------------------------ boot
  router();
})();
