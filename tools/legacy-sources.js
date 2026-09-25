'use strict';
// Fingerprint of the sources the IE11 build is made from. The build stamps it
// into public/legacy/app.legacy.js; the smoke test compares it with the current
// sources so a forgotten rebuild is caught.

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const SOURCES = ['public/app.js', 'public/styles.css', 'tools/ie11.css'];

function sourceHash() {
  const h = crypto.createHash('sha256');
  // Normalise line endings so a Git checkout on Windows gives the same hash.
  for (const rel of SOURCES) h.update(fs.readFileSync(path.join(ROOT, rel), 'utf8').replace(/\r\n/g, '\n'));
  return h.digest('hex').slice(0, 16);
}

function builtHash() {
  try {
    const head = fs.readFileSync(path.join(ROOT, 'public/legacy/app.legacy.js'), 'utf8').slice(0, 400);
    const m = /source hash ([0-9a-f]{16})/.exec(head);
    return m ? m[1] : null;
  } catch {
    return null;
  }
}

module.exports = { ROOT, SOURCES, sourceHash, builtHash };
