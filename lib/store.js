'use strict';
// Learner progress, one JSON file per Content Server user ID, kept in a
// folder per Content Server: node IDs and user IDs only mean something on the
// server they came from, so progress made on one server is never read back
// against another.

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// "localhost-3f2a9c1e" for http://localhost/otcs/cs.exe
function serverKey(baseUrl) {
  const u = new URL(baseUrl);
  const canonical = `${u.protocol}//${u.host}${u.pathname.replace(/\/+$/, '')}`.toLowerCase();
  const host = `${u.hostname}${u.port ? `-${u.port}` : ''}`.toLowerCase().replace(/[^a-z0-9.-]/g, '_');
  return `${host}-${crypto.createHash('sha256').update(canonical).digest('hex').slice(0, 8)}`;
}

function blank(user, server) {
  return {
    server,
    userId: user.id,
    userName: user.name,
    displayName: user.displayName || user.name,
    createdAt: new Date().toISOString(),
    lastSeenAt: new Date().toISOString(),
    settings: { track: 'all' },
    xp: 0,
    missions: {},   // missionId -> { status, method, xp, completedAt, attempts, score? }
    refs: {},       // saveAs key -> { id, name } captured from verified missions
    lastScan: null,
    exams: [],
    guides: {},     // guideId -> ISO date the learner marked it as read
    domains: {},    // exam domain id -> { answered, correct, recent: [1, 0, …] }
    activity: [],   // most recent first, capped
  };
}

class Store {
  constructor(dataDir, serverUrl) {
    this.server = serverUrl;
    this.root = path.join(dataDir, 'progress');
    this.dir = path.join(this.root, serverKey(serverUrl));
    fs.mkdirSync(this.dir, { recursive: true });
  }

  // Progress files from before progress was kept per server (directly in
  // data/progress). They can't be tied to a server, so they are not used.
  legacyFiles() {
    try {
      return fs.readdirSync(this.root).filter((f) => f.endsWith('.json'));
    } catch {
      return [];
    }
  }

  _file(userId) {
    const id = String(userId).replace(/[^\w-]/g, '');
    if (!id) throw new Error('Invalid user id');
    return path.join(this.dir, `${id}.json`);
  }

  load(user) {
    const file = this._file(user.id);
    let p;
    try {
      p = JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch {
      p = blank(user, this.server);
    }
    p.server = this.server;
    // Fields added in later versions.
    p.guides = p.guides || {};
    p.domains = p.domains || {};
    p.userName = user.name;
    if (user.displayName) p.displayName = user.displayName;
    p.lastSeenAt = new Date().toISOString();
    return p;
  }

  save(p) {
    const file = this._file(p.userId);
    const tmp = `${file}.${process.pid}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(p, null, 2));
    fs.renameSync(tmp, file);
  }

  log(p, text) {
    p.activity.unshift({ at: new Date().toISOString(), text });
    p.activity = p.activity.slice(0, 100);
  }

  reset(user) {
    const fresh = blank(user, this.server);
    this.save(fresh);
    return fresh;
  }

  all() {
    return fs.readdirSync(this.dir)
      .filter((f) => f.endsWith('.json'))
      .map((f) => { try { return JSON.parse(fs.readFileSync(path.join(this.dir, f), 'utf8')); } catch { return null; } })
      .filter(Boolean);
  }
}

module.exports = { Store, serverKey };
