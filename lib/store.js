'use strict';
// Learner progress, one JSON file per Content Server user ID.

const fs = require('fs');
const path = require('path');

function blank(user) {
  return {
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
    activity: [],   // most recent first, capped
  };
}

class Store {
  constructor(dataDir) {
    this.dir = path.join(dataDir, 'progress');
    fs.mkdirSync(this.dir, { recursive: true });
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
      p = blank(user);
    }
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
    const fresh = blank(user);
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

module.exports = { Store };
