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
  };
  // width/height attributes are defaults for browsers (IE11) that otherwise draw
  // unsized SVG at 300×150; CSS rules set the real size per context.
  const icon = (name) => raw(`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]}</svg>`);
  const HAT = raw('<svg width="24" height="24" viewBox="0 0 32 32" aria-hidden="true"><path d="M16 7 3 13l13 6 13-6-13-6Z" fill="#fff"/><path d="M8.5 16v5.5c0 2 3.4 4 7.5 4s7.5-2 7.5-4V16L16 19.5 8.5 16Z" fill="#bfe9e2"/><path d="M27 13.5v6" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/></svg>');
  const TRACK_COLORS = { user: '#0f6e62', collab: '#2c5cc5', admin: '#a55a0b' };
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

  // ------------------------------------------------------------ state & api
  const state = { session: null, stats: null, curriculum: null, health: null, exam: null };

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
    if (!state.curriculum || force) state.curriculum = await api('GET', '/api/curriculum');
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
    [/^#\/exam$/, pageExam],
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
    const nav = [['#/', 'home', 'Classroom'], ['#/map', 'map', 'Platform map'], ['#/curriculum', 'book', 'Curriculum'], ['#/exam', 'exam', 'Practice exam'], ['#/progress', 'chart', 'My progress'], ['#/connection', 'server', 'Connection']];
    const cs = state.session.cs || { url: state.session.csUrl };
    if (u.isSysAdmin) nav.push(['#/roster', 'users', 'Class roster']);
    const isActive = (href) => (href === '#/' ? hash === '#/' || hash === '#'
      : hash.startsWith(href) || (href === '#/curriculum' && /^#\/(module|mission)\//.test(hash)));
    put($('#app'), h`
      <div class="shell">
        <aside class="side">
          <div class="brand"><div class="brand-mark">${HAT}</div><div>CS Academy<small>Content Server trainer</small></div></div>
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
            <li><div class="n">2</div><div><b>It gives you missions</b><span>${hl ? hl.missions : 'Over 100'} hands-on tasks, investigations and knowledge checks across three tracks.</span></div></li>
            <li><div class="n">3</div><div><b>It checks your work</b><span>Through the Content Server REST API. Read-only: the trainer never changes anything.</span></div></li>
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
    const o = await api('GET', '/api/overview');
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
        <div><div class="eyebrow">Curriculum</div><h1>Three tracks, ${cur.modules.length} modules</h1><p>Every section of Content Server, from first upload to Extended ECM. Work in order or jump to what you need.</p></div>
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
      <div class="grid two" style="grid-template-columns:minmax(0,1.25fr) minmax(0,1fr)">
        <div class="card lesson">
          <h2>Lesson</h2>
          ${mod.lesson.map((p) => h`<p>${p}</p>`)}
          <p class="small faint" style="margin:0">Based on: ${mod.source}</p>
        </div>
        <div class="card">
          <h2>Remember</h2>
          <ul class="keypoints">${mod.keyPoints.map((k) => h`<li>${k}</li>`)}</ul>
        </div>
      </div>
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

  // ------------------------------------------------------------ practice exam
  async function pageExam(main) {
    const cur = await getCurriculum();
    const qCount = (track) => cur.modules.filter((m) => !track || m.track === track).reduce((a, m) => a + m.missions.filter((x) => x.type === 'quiz').reduce((b, x) => b + x.questions.length, 0), 0);
    if (state.exam && state.exam.phase === 'running') return renderExam(main);
    put(main, h`
      <div class="page-head"><div><div class="eyebrow">Practice exam</div><h1>Test yourself under exam conditions</h1>
        <p>Questions are drawn at random from every module's knowledge checks, with the answer options shuffled. No hints, explanations only at the end.</p></div></div>
      <div class="grid two">
        <div class="card">
          <div class="field"><label for="ex-track">Scope</label>
            <select class="input" id="ex-track">
              <option value="all">All tracks (${qCount()} questions)</option>
              ${cur.tracks.map((t) => h`<option value="${t.id}">${t.title} — exam ${t.exam} (${qCount(t.id)} questions)</option>`)}
            </select></div>
          <div class="field"><label for="ex-count">Number of questions</label>
            <select class="input" id="ex-count"><option>10</option><option selected>20</option><option>30</option><option>40</option></select></div>
          <button class="btn primary" id="ex-start">${icon('play')} Start exam</button>
        </div>
        <div class="card"><h2>Recent attempts</h2><div id="ex-history" class="muted small">Loading…</div></div>
      </div>`);
    api('GET', '/api/progress').then((p) => {
      const el = $('#ex-history');
      if (!el) return;
      put(el, p.exams.length ? h`<table class="table"><thead><tr><th>When</th><th>Scope</th><th class="num">Score</th></tr></thead><tbody>${p.exams.slice(0, 8).map((e) => h`<tr><td>${ago(e.at)}</td><td>${e.track === 'all' ? 'All tracks' : (cur.tracks.find((t) => t.id === e.track) || {}).title}</td><td class="num"><b>${pct(e.correct, e.total)}%</b> <span class="faint">(${e.correct}/${e.total})</span></td></tr>`)}</tbody></table>` : h`<p>No attempts yet.</p>`);
    }).catch(() => {});
    $('#ex-start').onclick = async (ev) => {
      const btn = ev.currentTarget;
      busy(btn, 'Preparing…');
      try {
        const e = await api('GET', `/api/exam/new?track=${encodeURIComponent($('#ex-track').value)}&count=${encodeURIComponent($('#ex-count').value)}`);
        state.exam = { phase: 'running', data: e, idx: 0, answers: e.questions.map(() => null), started: Date.now() };
        renderExam(main);
      } catch (err) { if (!err.silent) toast(err.message, 'warn'); unbusy(btn); }
    };
  }

  function renderExam(main) {
    const ex = state.exam;
    const qs = ex.data.questions;
    const q = qs[ex.idx];
    const answered = ex.answers.filter((a) => a !== null).length;
    put(main, h`
      <div class="page-head"><div><div class="eyebrow">Practice exam</div><h1>Question ${ex.idx + 1} of ${qs.length}</h1><p>${answered} answered · topic: ${q.module}</p></div>
        <button class="btn ghost" id="ex-quit">${icon('x')} Abandon</button></div>
      <div class="bar" style="margin-bottom:18px"><span style="width:${pct(answered, qs.length)}%"></span></div>
      <div class="mission-grid">
        <div class="card question">
          <div class="qt" style="font-size:1.1rem">${q.q}</div>
          <div class="options">${q.options.map((o, k) => h`<label class="option ${ex.answers[ex.idx] === k ? 'selected' : ''}"><input type="radio" name="exq" value="${k}" ${ex.answers[ex.idx] === k ? 'checked' : ''}><span>${o}</span></label>`)}</div>
          <div class="spread" style="margin-top:16px">
            <button class="btn" id="ex-prev" ${ex.idx === 0 ? 'disabled' : ''}>${icon('back')} Previous</button>
            ${ex.idx < qs.length - 1 ? h`<button class="btn primary" id="ex-next">Next ${icon('arrow')}</button>` : h`<button class="btn primary" id="ex-submit">${icon('check')} Submit exam</button>`}
          </div>
        </div>
        <div class="card side-card"><h3>Questions</h3>
          <div class="exam-nav">${qs.map((_, i) => h`<button type="button" data-q="${i}" class="${ex.answers[i] !== null ? 'answered' : ''} ${i === ex.idx ? 'current' : ''}" aria-label="Question ${i + 1}">${i + 1}</button>`)}</div>
          <button class="btn small" id="ex-submit2" style="margin-top:14px">Submit now</button>
        </div>
      </div>`);
    $$('input[name=exq]', main).forEach((inp) => { inp.onchange = () => { ex.answers[ex.idx] = Number(inp.value); renderExam(main); }; });
    $$('[data-q]', main).forEach((b) => { b.onclick = () => { ex.idx = Number(b.dataset.q); renderExam(main); }; });
    const nav = (d) => { ex.idx += d; renderExam(main); };
    $('#ex-prev').onclick = () => nav(-1);
    if ($('#ex-next')) $('#ex-next').onclick = () => nav(1);
    const submit = async (btn) => {
      const missing = ex.answers.filter((a) => a === null).length;
      if (missing && !confirm(`${missing} question(s) unanswered. Submit anyway?`)) return;
      busy(btn, 'Grading…');
      try {
        const r = await api('POST', '/api/exam/submit', { examId: ex.data.examId, answers: ex.answers });
        state.exam = null;
        renderExamResult(main, r);
      } catch (e) { if (!e.silent) toast(e.message, 'warn'); unbusy(btn); }
    };
    if ($('#ex-submit')) $('#ex-submit').onclick = (e) => submit(e.currentTarget);
    $('#ex-submit2').onclick = (e) => submit(e.currentTarget);
    $('#ex-quit').onclick = () => { if (confirm('Abandon this exam?')) { state.exam = null; pageExam(main); } };
  }

  function renderExamResult(main, r) {
    const p = pct(r.record.correct, r.record.total);
    const verdict = p >= 80 ? 'Strong result — you know this material.' : p >= 60 ? 'Solid, with a few gaps to close.' : 'Keep going — review the modules below and try again.';
    put(main, h`
      <div class="page-head"><div><div class="eyebrow">Practice exam · results</div><h1>${r.record.correct} of ${r.record.total} correct</h1><p>${verdict}</p></div>
        <a class="btn primary" href="#/exam" id="ex-again">${icon('refresh')} New exam</a></div>
      <div class="grid two" style="grid-template-columns:auto minmax(0,1fr);align-items:center">
        <div class="card" style="display:grid;place-items:center">${ring(p)}</div>
        <div class="card"><h2>Where to focus</h2>
          ${r.weakest.length ? h`<ul class="notes">${r.weakest.map((w) => h`<li><b>${w.module}</b> — ${w.correct}/${w.total} correct</li>`)}</ul>` : h`<p class="muted">No weak spots in this sample. Try a longer exam.</p>`}
          <p class="small faint" style="margin:10px 0 0">Took ${r.record.minutes || '<1'} min.</p></div>
      </div>
      <div class="section-title"><h2>Review</h2></div>
      <div class="stack">${r.review.map((q, i) => h`
        <div class="card question">
          <div class="qn">${i + 1} · ${q.module} · ${q.correct ? 'correct' : q.chosen === null ? 'unanswered' : 'incorrect'}</div>
          <div class="qt">${q.q}</div>
          <div class="options">${q.options.map((o, k) => h`<div class="option locked ${k === q.answer ? 'correct' : k === q.chosen ? 'wrong' : ''}"><span>${o}</span></div>`)}</div>
          <div class="explain">${q.explain}</div>
        </div>`)}</div>`);
    $('#ex-again').onclick = (e) => { e.preventDefault(); pageExam(main); };
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
          ${p.exams.length ? h`<table class="table"><thead><tr><th>Date</th><th>Scope</th><th class="num">Score</th></tr></thead><tbody>${p.exams.map((e) => h`<tr><td>${when(e.at)}</td><td>${e.track}</td><td class="num"><b>${pct(e.correct, e.total)}%</b></td></tr>`)}</tbody></table>` : h`<p class="muted">No exams yet. <a href="#/exam">Take one</a>.</p>`}
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
        <table class="table"><thead><tr><th>Learner</th><th>Level</th><th class="num">XP</th><th>Business User</th><th>Collaboration</th><th>Admin</th><th class="num">Best exam</th><th>Last seen</th></tr></thead>
        <tbody>${r.learners.map((l) => h`<tr>
          <td><b>${l.displayName}</b><div class="small faint">${l.name}</div></td>
          <td>${l.level}</td><td class="num">${l.xp}</td>
          ${['user', 'collab', 'admin'].map((t) => h`<td style="min-width:110px"><div class="bar"><span style="width:${pct(l.tracks[t].done, l.tracks[t].total)}%"></span></div><div class="small faint">${l.tracks[t].done}/${l.tracks[t].total}</div></td>`)}
          <td class="num">${l.bestExam === null ? '—' : `${l.bestExam}%`}</td>
          <td class="small">${ago(l.lastSeenAt)}</td>
        </tr>`)}</tbody></table>
      </div>`);
  }

  // ------------------------------------------------------------ boot
  router();
})();
