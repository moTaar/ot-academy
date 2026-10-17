'use strict';
// For developing the front end only: runs the trainer in front of the test
// mock of the Content Server REST API, so pages can be looked at on a machine
// without a Content Server. Learners never use this — the trainer itself has
// no demo mode.
//
//   node test/ui-preview.js          then open http://localhost:8420
//                                    and sign in as "student" (any password)
//   node test/ui-preview.js --only guides/x.js,track-x.js
//                                    load only some content files (see tools/check-content.js)

const only = process.argv.indexOf('--only');
if (only > 0) process.env.CSA_ONLY = process.argv[only + 1] || '';

const fs = require('fs');
const os = require('os');
const path = require('path');
const http = require('http');
const { createMockCS } = require('./mock-cs');
const { createApp } = require('../server');

const port = Number(process.env.OTA_PORT) || 8420;

const mock = createMockCS();
mock.server.listen(0, '127.0.0.1', () => {
  const csBase = `http://127.0.0.1:${mock.server.address().port}/otcs/cs.exe`;
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'csa-preview-'));
  const app = createApp({
    port, host: '127.0.0.1', sandboxName: 'OT Academy', dataDir, sessionHours: 8,
    contentServer: { baseUrl: csBase, publicUrl: '', timeoutMs: 5000 }, scan: { maxDepth: 3, maxNodes: 500, concurrency: 3 }, tls: {},
  });
  http.createServer(app.handle).listen(port, '127.0.0.1', () => {
    console.log(`UI preview (mock Content Server, NOT a real server) on http://localhost:${port} — sign in as "student", any password`);
  });
});
