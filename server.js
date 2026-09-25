'use strict';
// CS Academy — hands-on trainer for OpenText Content Server.
//
//   node server.js                  use config.json
//   node server.js --config x       use another config file
//   node server.js --cs-url <url>   train against this Content Server
//
// There is no demo or offline mode: every check reads the real Content Server
// the trainer is configured for.

const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const crypto = require('crypto');

const { CSClient, CSError } = require('./lib/cs-client');
const { CSApi } = require('./lib/cs-api');
const { analyze } = require('./lib/analyzer');
const { verifyMission } = require('./lib/verifier');
const { diagnose } = require('./lib/diagnostics');
const { Store } = require('./lib/store');
const curriculum = require('./curriculum');

const LEVELS = [
  { name: 'Novice', xp: 0 },
  { name: 'Apprentice', xp: 150 },
  { name: 'Practitioner', xp: 500 },
  { name: 'Specialist', xp: 1000 },
  { name: 'Expert', xp: 1700 },
  { name: 'Master', xp: 2400 },
];
const TRACK_ORDER = ['user', 'collab', 'admin'];
const QUIZ_PASS_RATIO = 0.6;

// ---------------------------------------------------------------- config

// Windows editors often save JSON with a byte-order mark, which JSON.parse rejects.
function readJsonFile(file) {
  const text = fs.readFileSync(file, 'utf8').replace(/^﻿/, '');
  try {
    return JSON.parse(text);
  } catch (e) {
    throw new Error(`${file} is not valid JSON: ${e.message}`);
  }
}

class ConfigError extends Error {}

const HOW_TO_CONFIGURE = [
  'Tell CS Academy which Content Server to train on:',
  '  1. Copy config.example.json to config.json.',
  '  2. Set contentServer.baseUrl to the address your browser shows before "?func=" in the Classic UI,',
  '     for example http://localhost/otcs/cs.exe (IIS: .../otcs/llisapi.dll, Tomcat: .../otcs/cs).',
  '  3. Start CS Academy again.',
  'Or start it with:  node server.js --cs-url http://localhost/otcs/cs.exe   (or set OTA_CS_URL)',
].join('\n');

function checkCsUrl(raw, key) {
  let u;
  try { u = new URL(raw); } catch { throw new ConfigError(`${key} "${raw}" is not a URL.\n\n${HOW_TO_CONFIGURE}`); }
  if (u.protocol !== 'http:' && u.protocol !== 'https:') throw new ConfigError(`${key} must start with http:// or https:// (got "${raw}").`);
  if (u.search || u.hash) throw new ConfigError(`${key} must be the address before "?func=": use ${u.origin}${u.pathname} instead of ${raw}`);
  return raw.replace(/\/+$/, '');
}

function loadConfig(argv) {
  const arg = (name) => { const i = argv.indexOf(name); return i >= 0 ? argv[i + 1] : null; };
  if (argv.includes('--demo')) {
    throw new ConfigError(`Demo mode has been removed: CS Academy only works against a real Content Server, so every result it shows comes from your server.\n\n${HOW_TO_CONFIGURE}`);
  }
  const file = path.resolve(__dirname, arg('--config') || 'config.json');
  const defaults = readJsonFile(path.join(__dirname, 'config.example.json'));
  const own = fs.existsSync(file) ? readJsonFile(file) : {};
  const cfg = { ...defaults, ...own, contentServer: { ...defaults.contentServer, ...own.contentServer }, scan: { ...defaults.scan, ...own.scan }, tls: { ...defaults.tls, ...own.tls } };
  // The Content Server address never comes from the example file: it has to be chosen.
  const url = String(arg('--cs-url') || process.env.OTA_CS_URL || (own.contentServer && own.contentServer.baseUrl) || '').trim();
  if (!url) throw new ConfigError(`No Content Server is configured (${fs.existsSync(file) ? `${file} has no contentServer.baseUrl` : `${file} does not exist`}).\n\n${HOW_TO_CONFIGURE}`);
  cfg.contentServer.baseUrl = checkCsUrl(url, 'contentServer.baseUrl');
  if (cfg.contentServer.publicUrl) cfg.contentServer.publicUrl = checkCsUrl(cfg.contentServer.publicUrl, 'contentServer.publicUrl');
  if (process.env.OTA_PORT) cfg.port = Number(process.env.OTA_PORT);
  return cfg;
}

// ---------------------------------------------------------------- helpers

function levelFor(xp) {
  let idx = 0;
  LEVELS.forEach((l, i) => { if (xp >= l.xp) idx = i; });
  const next = LEVELS[idx + 1] || null;
  return { name: LEVELS[idx].name, index: idx, xp, floor: LEVELS[idx].xp, next: next ? { name: next.name, xp: next.xp } : null };
}

function shuffle(a) {
  const arr = a.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = crypto.randomInt(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const isResolved = (st) => st && (st.status === 'done' || st.status === 'skipped');
const isDone = (st) => st && st.status === 'done';

function stats(progress) {
  const tracks = {};
  for (const t of curriculum.TRACKS) tracks[t.id] = { id: t.id, title: t.title, total: 0, done: 0, skipped: 0 };
  const modules = {};
  for (const mod of curriculum.MODULES) {
    const ms = mod.missions.map((m) => progress.missions[m.id]);
    const done = ms.filter(isDone).length;
    const resolved = ms.filter(isResolved).length;
    modules[mod.id] = { done, resolved, total: mod.missions.length, complete: resolved === mod.missions.length && done > 0 };
    tracks[mod.track].total += mod.missions.length;
    tracks[mod.track].done += done;
    tracks[mod.track].skipped += resolved - done;
  }
  const total = curriculum.missionById.size;
  const done = Object.values(progress.missions).filter(isDone).length;
  const q = Object.values(progress.missions).filter((x) => x.quiz);
  const quiz = q.length ? {
    answered: q.reduce((a, x) => a + x.quiz.total, 0),
    correct: q.reduce((a, x) => a + x.quiz.best, 0),
  } : { answered: 0, correct: 0 };
  return { total, done, xp: progress.xp, level: levelFor(progress.xp), tracks, modules, quiz, badges: badgesFor(modules) };
}

function badgesFor(modules) {
  return curriculum.MODULES.filter((mod) => modules[mod.id].complete).map((mod) => ({ module: mod.id, title: mod.title, track: mod.track }));
}

function missionAvailability(m, progress) {
  const scan = progress.lastScan;
  const locked = (m.requires || []).filter((r) => !isDone(progress.missions[r]));
  const feature = m.feature || curriculum.moduleOfMission.get(m.id).feature;
  const featureStatus = feature && scan && scan.features[feature] ? scan.features[feature].status : null;
  return { locked, feature, featureStatus };
}

function nextMission(progress) {
  const focus = progress.settings.track;
  const order = focus && focus !== 'all' ? [focus, ...TRACK_ORDER.filter((t) => t !== focus)] : TRACK_ORDER;
  for (const track of order) {
    for (const mod of curriculum.MODULES.filter((x) => x.track === track)) {
      for (const m of mod.missions) {
        if (isResolved(progress.missions[m.id])) continue;
        const a = missionAvailability(m, progress);
        if (a.locked.length || a.featureStatus === 'not-detected') continue;
        return m;
      }
    }
  }
  return null;
}

// ---------------------------------------------------------------- app

function createApp(config) {
  const client = new CSClient(config.contentServer);
  const publicUrl = (config.contentServer.publicUrl || config.contentServer.baseUrl).replace(/\/+$/, '');
  const store = new Store(path.resolve(__dirname, config.dataDir), client.baseUrl);
  const legacy = store.legacyFiles();
  if (legacy.length) {
    console.warn(`[progress] ${legacy.length} progress file(s) directly in ${store.root} come from an earlier version that did not record which Content Server they belong to, so they are not used. Progress for ${client.baseUrl} is kept in ${store.dir}.`);
  }
  const sessions = new Map();
  const loginAttempts = new Map();
  const SESSION_MS = (config.sessionHours || 8) * 3600 * 1000;
  const publicDir = path.join(__dirname, 'public');

  setInterval(() => {
    const now = Date.now();
    for (const [sid, s] of sessions) if (now - s.lastSeen > SESSION_MS) sessions.delete(sid);
    for (const [ip, a] of loginAttempts) if (now - a.since > 15 * 60 * 1000) loginAttempts.delete(ip);
  }, 60 * 1000).unref();

  const varsFor = (session, progress) => {
    const scan = progress.lastScan;
    return {
      sandbox: config.sandboxName,
      user: session.user.name,
      displayName: session.user.displayName,
      category: scan && scan.categories[0] ? scan.categories[0].name : 'any category available to you',
      group: scan && scan.groups[0] ? scan.groups[0].name : 'a group you belong to',
      csUrl: publicUrl,
      smartUrl: `${publicUrl}/app`,
    };
  };

  const linksFor = (key, progress) => {
    if (!key) return null;
    if (key === 'personal') {
      const v = progress.lastScan && progress.lastScan.volumes.find((x) => x.key === 'personal');
      return { classic: `${publicUrl}?func=ll&objtype=142&objAction=browse`, smart: v && v.id ? `${publicUrl}/app/nodes/${v.id}` : `${publicUrl}/app` };
    }
    const ref = progress.refs[key];
    if (!ref) return null;
    return { name: ref.name, classic: `${publicUrl}?func=ll&objId=${ref.id}&objAction=browse`, smart: `${publicUrl}/app/nodes/${ref.id}` };
  };

  // Where a learner can see, in Content Server itself, the item a check looked at.
  const nodeLinks = (n) => ({
    smart: `${publicUrl}/app/nodes/${n.id}`,
    classic: `${publicUrl}?func=ll&objId=${n.id}&objAction=${n.container ? 'browse' : 'properties'}`,
  });

  const csInfo = (session) => ({ url: publicUrl, version: session.csVersion || null });

  const missionView = (m, session, progress) => {
    const vars = varsFor(session, progress);
    const st = progress.missions[m.id] || null;
    return {
      ...curriculum.publicMission(m, vars),
      state: st,
      availability: missionAvailability(m, progress),
      links: linksFor(m.open, progress),
    };
  };

  // ------------------------------------------------ HTTP plumbing

  const send = (res, status, body, headers = {}) => {
    const text = JSON.stringify(body);
    // Pragma/Expires as well: Internet Explorer 11 caches GET requests made by scripts otherwise.
    res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', Pragma: 'no-cache', Expires: '0', ...headers });
    res.end(text);
  };

  const readJson = (req) => new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (c) => {
      size += c.length;
      if (size > 100 * 1024) { reject(Object.assign(new Error('Request too large'), { status: 413 })); req.destroy(); return; }
      chunks.push(c);
    });
    req.on('end', () => {
      if (!chunks.length) return resolve({});
      try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8'))); } catch { reject(Object.assign(new Error('Invalid JSON'), { status: 400 })); }
    });
    req.on('error', reject);
  });

  const cookieSid = (req) => {
    const m = /(?:^|;\s*)csa_sid=([a-f0-9]{64})/.exec(req.headers.cookie || '');
    return m ? m[1] : null;
  };

  const secureCookie = !!(config.tls && config.tls.keyFile);
  const setCookie = (sid, maxAge) => `csa_sid=${sid}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${maxAge}${secureCookie ? '; Secure' : ''}`;

  const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon' };

  const serveStatic = (req, res, urlPath) => {
    const rel = urlPath === '/' ? 'index.html' : decodeURIComponent(urlPath.slice(1));
    const file = path.resolve(publicDir, rel);
    if (!file.startsWith(publicDir + path.sep)) { res.writeHead(403); return res.end(); }
    fs.readFile(file, (err, data) => {
      if (err) {
        // SPA fallback
        if (!path.extname(rel)) return serveStatic(req, res, '/');
        res.writeHead(404); return res.end('Not found');
      }
      res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
      res.end(data);
    });
  };

  // ------------------------------------------------ route handlers

  const routes = [];
  // opts.prepare runs before the per-user lock is taken (for slow Content
  // Server work that doesn't need the progress file); its result is passed
  // to the handler as `prepared`.
  const route = (method, pattern, handler, opts = {}) => routes.push({ method, pattern, handler, auth: opts.auth !== false, prepare: opts.prepare });

  // Serialises progress read-modify-write per user.
  const locks = new Map();
  async function withLock(key, fn) {
    const prev = locks.get(key) || Promise.resolve();
    let release;
    const mine = new Promise((r) => { release = r; });
    const tail = prev.then(() => mine);
    locks.set(key, tail);
    await prev;
    try { return await fn(); } finally {
      release();
      if (locks.get(key) === tail) locks.delete(key);
    }
  }

  route('GET', /^\/api\/health$/, async () => ({
    ok: true, csUrl: publicUrl, sandboxName: config.sandboxName, missions: curriculum.missionById.size, cs: await client.probe(),
  }), { auth: false });

  route('POST', /^\/api\/login$/, async ({ req, body, res }) => {
    const ip = req.socket.remoteAddress || '?';
    const a = loginAttempts.get(ip) || { count: 0, since: Date.now() };
    if (a.count >= 10) throw Object.assign(new Error('Too many sign-in attempts. Wait 15 minutes and try again.'), { status: 429 });
    const username = String(body.username || '').trim();
    const password = String(body.password || '');
    if (!username || !password) throw Object.assign(new Error('Enter your Content Server user name and password.'), { status: 400 });
    let ticket;
    try {
      ticket = await client.authenticate(username, password);
    } catch (e) {
      if (e.code === 'BAD_LOGIN') { a.count++; loginAttempts.set(ip, a); }
      throw e;
    }
    const session = { sid: crypto.randomBytes(32).toString('hex'), ticket, createdAt: Date.now(), lastSeen: Date.now() };
    const api = new CSApi(client, session);
    const me = await api.me();
    const info = await api.serverInfo();
    session.csVersion = info.ok ? info.version : null;
    session.user = {
      id: me.id, name: me.name,
      displayName: [me.first_name, me.last_name].filter(Boolean).join(' ') || me.name,
      // Content Server only returns privilege flags to administrators.
      isSysAdmin: me.privilege_system_admin_rights === true,
    };
    sessions.set(session.sid, session);
    loginAttempts.delete(ip);
    const progress = store.load(session.user);
    store.log(progress, 'Signed in');
    store.save(progress);
    res.setHeader('Set-Cookie', setCookie(session.sid, Math.floor(SESSION_MS / 1000)));
    return { user: session.user, needsScan: !progress.lastScan, csUrl: publicUrl, cs: csInfo(session), sandboxName: config.sandboxName };
  }, { auth: false });

  route('POST', /^\/api\/logout$/, async ({ session, res }) => {
    sessions.delete(session.sid);
    res.setHeader('Set-Cookie', setCookie('0'.repeat(64), 0));
    return { ok: true };
  });

  route('GET', /^\/api\/session$/, async ({ session }) => ({ user: session.user, csUrl: publicUrl, cs: csInfo(session), sandboxName: config.sandboxName }));

  route('GET', /^\/api\/overview$/, async ({ session, progress }) => {
    const next = nextMission(progress);
    return {
      user: session.user,
      cs: csInfo(session),
      stats: stats(progress),
      settings: progress.settings,
      next: next ? { ...missionView(next, session, progress), moduleTitle: curriculum.moduleOfMission.get(next.id).title } : null,
      scan: progress.lastScan ? { scannedAt: progress.lastScan.scannedAt, notes: progress.lastScan.notes, server: progress.lastScan.server, counts: progress.lastScan.counts, inventoryTotal: progress.lastScan.inventory.total } : null,
      activity: progress.activity.slice(0, 8),
      csUrl: publicUrl,
    };
  });

  route('GET', /^\/api\/curriculum$/, async ({ session, progress }) => {
    const vars = varsFor(session, progress);
    const c = curriculum.publicCurriculum(vars);
    for (const mod of c.modules) {
      for (const m of mod.missions) {
        const full = curriculum.missionById.get(m.id);
        m.state = progress.missions[m.id] || null;
        m.availability = missionAvailability(full, progress);
      }
      mod.featureStatus = mod.feature && progress.lastScan && progress.lastScan.features[mod.feature] ? progress.lastScan.features[mod.feature].status : null;
    }
    return { ...c, stats: stats(progress), settings: progress.settings };
  });

  route('GET', /^\/api\/missions\/([\w-]+)$/, async ({ session, progress, params }) => {
    const m = curriculum.missionById.get(params[0]);
    if (!m) throw Object.assign(new Error('Unknown mission'), { status: 404 });
    const mod = curriculum.moduleOfMission.get(m.id);
    const idx = mod.missions.indexOf(m);
    return {
      mission: missionView(m, session, progress),
      module: { id: mod.id, title: mod.title, track: mod.track },
      prev: mod.missions[idx - 1] ? mod.missions[idx - 1].id : null,
      next: mod.missions[idx + 1] ? mod.missions[idx + 1].id : null,
      requiresTitles: (m.requires || []).map((r) => ({ id: r, title: curriculum.missionById.get(r).title })),
    };
  });

  route('POST', /^\/api\/settings$/, async ({ body, progress }) => {
    if (body.track && ['all', ...TRACK_ORDER].includes(body.track)) progress.settings.track = body.track;
    return { settings: progress.settings };
  }, { save: true });

  route('POST', /^\/api\/scan$/, async ({ session, progress, prepared: scan }) => {
    progress.lastScan = scan;
    store.log(progress, `Platform scan: ${scan.inventory.total} items, ${Object.values(scan.features).filter((f) => f.status === 'detected').length} areas detected`);
    session.user.isSysAdmin = scan.user.isSysAdmin;
    if (scan.server.version) session.csVersion = scan.server.version;
    return { scan };
  }, { prepare: ({ session }) => analyze(new CSApi(client, session), config) });

  route('GET', /^\/api\/scan$/, async ({ progress }) => ({ scan: progress.lastScan }));

  // Live report of what each Content Server endpoint the trainer uses returns.
  route('GET', /^\/api\/connection$/, async ({ session, prepared: report }) => {
    for (const r of report.rows) if (r.node) r.node.links = nodeLinks(r.node);
    return { ...report, trainerUrl: client.baseUrl, publicUrl, cs: csInfo(session), user: session.user };
  }, { prepare: ({ session }) => diagnose(new CSApi(client, session), config) });

  const award = (progress, m, method, xp, extra = {}) => {
    const prev = progress.missions[m.id] || { attempts: 0 };
    const firstTime = !isDone(prev);
    progress.missions[m.id] = { ...prev, ...extra, status: 'done', method: firstTime ? method : prev.method, xp: firstTime ? xp : prev.xp, completedAt: firstTime ? new Date().toISOString() : prev.completedAt };
    if (firstTime) {
      progress.xp += xp;
      store.log(progress, `Completed “${m.title}” (+${xp} XP)`);
    }
    return firstTime ? xp : 0;
  };

  route('POST', /^\/api\/missions\/([\w-]+)\/check$/, async ({ session, progress, params, body }) => {
    const m = curriculum.missionById.get(params[0]);
    if (!m || !m.checks) throw Object.assign(new Error('This mission has nothing to check automatically.'), { status: 400 });
    const a = missionAvailability(m, progress);
    if (a.locked.length) throw Object.assign(new Error(`Finish ${a.locked.map((id) => `“${curriculum.missionById.get(id).title}”`).join(' and ')} first.`), { status: 409 });

    const levelBefore = levelFor(progress.xp).index;
    // Everything a check compares against is read live through `api`.
    const ctx = {
      api: new CSApi(client, session),
      refs: progress.refs,
      inputs: body.inputs || {},
      vars: varsFor(session, progress),
      refOwners: curriculum.refOwners,
      found: {},
    };
    const result = await verifyMission(m, ctx);
    for (const r of result.results) if (r.node) r.node.links = nodeLinks(r.node);
    Object.assign(progress.refs, result.captured);

    const st = progress.missions[m.id] || { attempts: 0 };
    delete st.pendingConfirm;
    st.attempts = (st.attempts || 0) + 1;
    st.lastCheck = { at: new Date().toISOString(), status: result.status };
    progress.missions[m.id] = st;

    // Only a check that saw every step on the server completes a mission.
    let xpGained = 0;
    if (result.status === 'pass') xpGained = award(progress, m, 'auto', m.xp);
    else if (!isDone(st)) store.log(progress, result.status === 'unverified' ? `Checked “${m.title}” — could not be verified on the server` : `Checked “${m.title}” — not there yet`);

    return { result, xpGained, levelUp: levelFor(progress.xp).index > levelBefore ? levelFor(progress.xp) : null, mission: missionView(m, session, progress), stats: stats(progress), cs: csInfo(session) };
  }, { save: true });

  // Practice missions only: things the REST API can't see, completed with a
  // written reflection (and shown as self-reported, never as verified).
  route('POST', /^\/api\/missions\/([\w-]+)\/confirm$/, async ({ session, progress, params, body }) => {
    const m = curriculum.missionById.get(params[0]);
    if (!m) throw Object.assign(new Error('Unknown mission'), { status: 404 });
    if (m.type !== 'practice') throw Object.assign(new Error('This mission is checked on your Content Server — use “Check my work”. It only counts once I have seen the result there.'), { status: 400 });
    const a = missionAvailability(m, progress);
    if (a.locked.length) throw Object.assign(new Error(`Finish ${a.locked.map((id) => `“${curriculum.missionById.get(id).title}”`).join(' and ')} first.`), { status: 409 });
    const levelBefore = levelFor(progress.xp).index;
    const text = String(body.reflection || '').trim();
    const words = text.split(/\s+/).filter(Boolean).length;
    const min = m.minWords || 8;
    if (words < min) throw Object.assign(new Error(`Write at least ${min} words — explaining it is how it sticks.`), { status: 400 });
    const xpGained = award(progress, m, 'self', m.xp, { reflection: text.slice(0, 4000) });
    return { xpGained, levelUp: levelFor(progress.xp).index > levelBefore ? levelFor(progress.xp) : null, mission: missionView(m, session, progress), stats: stats(progress) };
  }, { save: true });

  route('POST', /^\/api\/missions\/([\w-]+)\/quiz$/, async ({ session, progress, params, body }) => {
    const m = curriculum.missionById.get(params[0]);
    if (!m || m.type !== 'quiz') throw Object.assign(new Error('Not a quiz'), { status: 400 });
    const answers = Array.isArray(body.answers) ? body.answers : [];
    const review = m.questions.map((q, i) => ({ correct: Number(answers[i]) === q.answer, answer: q.answer, chosen: answers[i] === undefined ? null : Number(answers[i]), explain: q.explain }));
    const correct = review.filter((r) => r.correct).length;
    const total = m.questions.length;
    const needed = Math.ceil(total * QUIZ_PASS_RATIO);
    const passed = correct >= needed;
    const levelBefore = levelFor(progress.xp).index;

    const st = progress.missions[m.id] || { attempts: 0 };
    st.attempts = (st.attempts || 0) + 1;
    st.quiz = { total, best: Math.max(correct, (st.quiz && st.quiz.best) || 0), last: correct };
    progress.missions[m.id] = st;
    let xpGained = 0;
    if (passed) xpGained = award(progress, m, 'quiz', m.xp, { quiz: st.quiz });
    else store.log(progress, `Quiz “${m.title}”: ${correct}/${total}`);

    return { correct, total, needed, passed, review, xpGained, levelUp: levelFor(progress.xp).index > levelBefore ? levelFor(progress.xp) : null, mission: missionView(m, session, progress), stats: stats(progress) };
  }, { save: true });

  route('POST', /^\/api\/missions\/([\w-]+)\/skip$/, async ({ session, progress, params }) => {
    const m = curriculum.missionById.get(params[0]);
    if (!m) throw Object.assign(new Error('Unknown mission'), { status: 404 });
    const st = progress.missions[m.id] || { attempts: 0 };
    if (!isDone(st)) {
      progress.missions[m.id] = { ...st, status: 'skipped', skippedAt: new Date().toISOString() };
      store.log(progress, `Skipped “${m.title}”`);
    }
    return { mission: missionView(m, session, progress), stats: stats(progress) };
  }, { save: true });

  route('GET', /^\/api\/exam\/new$/, async ({ session, query }) => {
    const track = query.get('track') || 'all';
    const count = Math.min(Math.max(Number(query.get('count')) || 20, 5), 50);
    const pool = curriculum.questionBank.filter((q) => track === 'all' || q.track === track);
    const picked = shuffle(pool).slice(0, count).map((q) => ({ qid: q.id, order: shuffle(q.options.map((_, i) => i)) }));
    session.exam = { id: crypto.randomBytes(8).toString('hex'), track, picked, startedAt: Date.now() };
    return {
      examId: session.exam.id,
      track,
      questions: picked.map((p) => {
        const q = curriculum.questionById.get(p.qid);
        return { q: q.q, module: q.moduleTitle, options: p.order.map((i) => q.options[i]) };
      }),
    };
  });

  route('POST', /^\/api\/exam\/submit$/, async ({ session, progress, body }) => {
    const exam = session.exam;
    if (!exam || exam.id !== body.examId) throw Object.assign(new Error('This exam has expired. Start a new one.'), { status: 410 });
    const answers = Array.isArray(body.answers) ? body.answers : [];
    const review = exam.picked.map((p, i) => {
      const q = curriculum.questionById.get(p.qid);
      const chosen = answers[i] === null || answers[i] === undefined ? null : Number(answers[i]);
      const correctIdx = p.order.indexOf(q.answer);
      return { q: q.q, module: q.moduleTitle, options: p.order.map((k) => q.options[k]), chosen, answer: correctIdx, correct: chosen === correctIdx, explain: q.explain };
    });
    const correct = review.filter((r) => r.correct).length;
    const record = { at: new Date().toISOString(), track: exam.track, total: review.length, correct, minutes: Math.round((Date.now() - exam.startedAt) / 60000) };
    progress.exams.unshift(record);
    progress.exams = progress.exams.slice(0, 30);
    store.log(progress, `Practice exam (${exam.track}): ${correct}/${review.length}`);
    session.exam = null;
    const byModule = {};
    for (const r of review) {
      byModule[r.module] = byModule[r.module] || { module: r.module, total: 0, correct: 0 };
      byModule[r.module].total++;
      if (r.correct) byModule[r.module].correct++;
    }
    return { record, review, weakest: Object.values(byModule).filter((x) => x.correct < x.total).sort((a, b) => a.correct / a.total - b.correct / b.total).slice(0, 4) };
  }, { save: true });

  route('GET', /^\/api\/progress$/, async ({ progress }) => ({
    stats: stats(progress), exams: progress.exams, activity: progress.activity,
    refs: progress.refs, settings: progress.settings, lastScanAt: progress.lastScan ? progress.lastScan.scannedAt : null,
  }));

  route('POST', /^\/api\/progress\/reset$/, async ({ session, progress, body }) => {
    if (body.confirm !== 'RESET') throw Object.assign(new Error('Confirmation missing'), { status: 400 });
    const fresh = store.reset(session.user);
    // The dispatcher saves `progress` afterwards, so turn it into the fresh copy.
    for (const k of Object.keys(progress)) delete progress[k];
    Object.assign(progress, fresh);
    return { ok: true };
  });

  route('GET', /^\/api\/roster$/, async ({ session }) => {
    if (!session.user.isSysAdmin) throw Object.assign(new Error('Only Content Server system administrators can see the class roster.'), { status: 403 });
    const learners = store.all().map((p) => {
      const s = stats(p);
      return { userId: p.userId, name: p.userName, displayName: p.displayName, xp: p.xp, level: s.level.name, done: s.done, total: s.total, tracks: s.tracks, lastSeenAt: p.lastSeenAt, bestExam: p.exams.reduce((b, e) => Math.max(b, Math.round((100 * e.correct) / e.total)), 0) || null };
    }).sort((a, b) => b.xp - a.xp);
    return { learners };
  });

  // ------------------------------------------------ dispatcher

  async function handle(req, res) {
    const url = new URL(req.url, 'http://localhost');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'no-referrer');
    // IE11 would otherwise render localhost/intranet pages in Compatibility View (IE7 mode).
    res.setHeader('X-UA-Compatible', 'IE=edge');

    if (!url.pathname.startsWith('/api/')) {
      res.setHeader('Content-Security-Policy', "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'; frame-ancestors 'none'");
      if (req.method !== 'GET') { res.writeHead(405); return res.end(); }
      return serveStatic(req, res, url.pathname);
    }

    const r = routes.find((x) => x.method === req.method && x.pattern.test(url.pathname));
    if (!r) return send(res, 404, { error: 'Not found' });

    try {
      if (req.method === 'POST' && req.headers['x-csa'] !== '1') throw Object.assign(new Error('Missing request header'), { status: 400 });
      const body = req.method === 'POST' ? await readJson(req) : {};
      const params = r.pattern.exec(url.pathname).slice(1);
      const ctx = { req, res, body, params, query: url.searchParams, session: null, progress: null };
      let out;
      if (!r.auth) {
        out = await r.handler(ctx);
      } else {
        const sid = cookieSid(req);
        ctx.session = sid ? sessions.get(sid) : null;
        if (!ctx.session) return send(res, 401, { error: 'Please sign in.', code: 'NO_SESSION' });
        ctx.session.lastSeen = Date.now();
        if (r.prepare) ctx.prepared = await r.prepare(ctx);
        out = await withLock(ctx.session.user.id, async () => {
          ctx.progress = store.load(ctx.session.user);
          const result = await r.handler(ctx);
          store.save(ctx.progress);
          return result;
        });
      }
      send(res, 200, out);
    } catch (e) {
      if (e instanceof CSError && e.code === 'SESSION_EXPIRED') {
        const sid = cookieSid(req);
        if (sid) sessions.delete(sid);
        return send(res, 401, { error: e.message, code: 'SESSION_EXPIRED' });
      }
      const status = e.status && e.status >= 400 && e.status < 600 ? e.status : 500;
      if (status >= 500) console.error(`[${req.method} ${url.pathname}]`, e instanceof CSError ? e.message : e);
      send(res, status, { error: e.message || 'Unexpected error', code: e.code || null });
    }
  }

  return { handle, client, store, sessions };
}

// ---------------------------------------------------------------- main

async function main() {
  const major = Number(process.versions.node.split('.')[0]);
  if (major < 18) {
    console.error(`CS Academy needs Node.js 18 or newer; this is ${process.version}. Use the current LTS from https://nodejs.org (Windows Server 2016 is supported).`);
    process.exit(1);
  }
  let config;
  try {
    config = loadConfig(process.argv.slice(2));
  } catch (e) {
    if (!(e instanceof ConfigError)) throw e;
    console.error(`\n${e.message}\n`);
    process.exit(1);
  }

  const app = createApp(config);
  const useTls = config.tls && config.tls.keyFile && config.tls.certFile;
  const server = useTls
    ? https.createServer({ key: fs.readFileSync(config.tls.keyFile), cert: fs.readFileSync(config.tls.certFile) }, app.handle)
    : http.createServer(app.handle);

  server.listen(config.port, config.host, async () => {
    const shown = config.host === '0.0.0.0' ? 'localhost' : config.host;
    console.log(`CS Academy listening on ${useTls ? 'https' : 'http'}://${shown}:${config.port}`);
    console.log(`Content Server: ${config.contentServer.baseUrl}`);
    const p = await app.client.probe();
    if (p.restApi) console.log(`[cs] The Content Server REST API is answering${p.version ? ` (version ${p.version})` : ''}.`);
    else console.warn(`[cs] WARNING: ${p.error}\n[cs] Learners can't sign in until contentServer.baseUrl points at a working Content Server.`);
  });
}

if (require.main === module) {
  main().catch((e) => { console.error(e); process.exit(1); });
}

module.exports = { createApp, loadConfig, levelFor, ConfigError };
