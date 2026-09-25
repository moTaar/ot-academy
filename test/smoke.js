'use strict';
// End-to-end test: the mock Content Server (test/mock-cs.js) + the trainer,
// with the test acting as the learner (doing the work through the mock's write
// endpoints) and checking that the trainer notices — and that it never reports
// anything as done that it has not seen on the server.
//
//   node test/smoke.js

const assert = require('assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const http = require('http');
const { createMockCS } = require('./mock-cs');
const { createApp, loadConfig, ConfigError } = require('../server');
const { serverKey } = require('../lib/store');
const curriculum = require('../curriculum');

const listen = (server) => new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server.address().port)));

let passed = 0;
async function step(name, fn) {
  try {
    await fn();
    passed++;
    console.log(`  ✓ ${name}`);
  } catch (e) {
    console.error(`  ✗ ${name}\n    ${e.stack || e.message}`);
    process.exitCode = 1;
    throw e;
  }
}

function browser(base) {
  let cookie = '';
  return async function call(method, url, body) {
    const res = await fetch(base + url, {
      method,
      headers: { 'Content-Type': 'application/json', 'X-CSA': '1', ...(cookie ? { Cookie: cookie } : {}) },
      body: body ? JSON.stringify(body) : undefined,
    });
    const set = res.headers.get('set-cookie');
    if (set) cookie = set.split(';')[0];
    return { status: res.status, body: await res.json() };
  };
}

function csLearner(csBase) {
  let ticket = null;
  const call = async (method, url, body) => {
    const res = await fetch(csBase + url, {
      method,
      headers: { 'Content-Type': 'application/json', ...(ticket ? { OTCSTicket: ticket } : {}) },
      body: body ? JSON.stringify(body) : undefined,
    });
    return res.json();
  };
  return {
    async login(user) { ticket = (await call('POST', '/api/v1/auth', { username: user, password: 'x' })).ticket; },
    create: async (props) => (await call('POST', '/api/v1/nodes', props)).id,
    addVersion: (id) => call('POST', `/api/v1/nodes/${id}/versions`),
    update: (id, props) => call('PUT', `/api/v1/nodes/${id}`, props),
    del: (id) => call('DELETE', `/api/v1/nodes/${id}`),
    purge: (id) => call('POST', `/mock/recyclebin/${id}/purge`),
    favorite: (id) => call('POST', `/mock/favorites/${id}`),
    categorize: (id, cat, inherit) => call('POST', `/mock/nodes/${id}/categories/${cat}`, { inherit }),
    grant: (id, rightId) => call('POST', `/mock/nodes/${id}/permissions`, { type: 'custom', right_id: rightId, permissions: ['see', 'see_contents'] }),
    group: (name, members) => call('POST', '/mock/groups', { name, members }),
    initiate: (opts = {}) => call('POST', '/mock/workflows/initiate', { name: 'Document Approval', ...opts }),
  };
}

// An HTTP server that answers every request the same way.
const stubServer = (status, type, body) => http.createServer((req, res) => { res.writeHead(status, { 'Content-Type': type }); res.end(body); });

function appFor(baseUrl, dataDir) {
  return createApp({
    port: 0, host: '127.0.0.1', sandboxName: 'OT Academy', dataDir, sessionHours: 1,
    contentServer: { baseUrl, timeoutMs: 5000 }, scan: { maxDepth: 3, maxNodes: 500, concurrency: 3 }, tls: {},
  });
}

async function main() {
  const mock = createMockCS();
  const mockPort = await listen(mock.server);
  const csBase = `http://127.0.0.1:${mockPort}/otcs/cs.exe`;
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'csa-test-'));
  const extraServers = [];

  const app = appFor(csBase, dataDir);
  const appServer = http.createServer(app.handle);
  const appPort = await listen(appServer);
  const call = browser(`http://127.0.0.1:${appPort}`);
  const cs = csLearner(csBase);
  await cs.login('student');
  const student = [...mock.state.users.values()].find((u) => u.name === 'student');
  const personal = 5000 + student.id;

  const check = async (id, inputs) => (await call('POST', `/api/missions/${id}/check`, { inputs })).body;
  // A second trainer (own browser session) in front of another server.
  const trainerFor = async (baseUrl) => {
    const srv = http.createServer(appFor(baseUrl, dataDir).handle);
    extraServers.push(srv);
    return browser(`http://127.0.0.1:${await listen(srv)}`);
  };

  console.log('CS Academy smoke test');

  // ---------------------------------------------------------- configuration

  await step('there is no demo mode: --demo is refused', async () => {
    assert.throws(() => loadConfig(['--demo']), (e) => e instanceof ConfigError && /Demo mode has been removed/.test(e.message));
  });

  await step('the Content Server URL must be configured explicitly (never taken from the example file)', async () => {
    const missing = path.join(dataDir, 'no-such-config.json');
    const saved = process.env.OTA_CS_URL;
    delete process.env.OTA_CS_URL;
    try {
      assert.throws(() => loadConfig(['--config', missing]), (e) => e instanceof ConfigError && /No Content Server is configured/.test(e.message));
      const noUrl = path.join(dataDir, 'no-url.json');
      fs.writeFileSync(noUrl, JSON.stringify({ port: 9999 }));
      assert.throws(() => loadConfig(['--config', noUrl]), ConfigError);
      assert.equal(loadConfig(['--config', missing, '--cs-url', 'http://cs.example/otcs/cs.exe/']).contentServer.baseUrl, 'http://cs.example/otcs/cs.exe');
      assert.throws(() => loadConfig(['--config', missing, '--cs-url', 'http://cs.example/otcs/cs.exe?func=llworkspace']), /before "\?func="/);
      assert.throws(() => loadConfig(['--config', missing, '--cs-url', 'cs.example']), ConfigError);
      process.env.OTA_CS_URL = 'https://ecm.example.com/otcs/llisapi.dll';
      assert.equal(loadConfig(['--config', missing]).contentServer.baseUrl, 'https://ecm.example.com/otcs/llisapi.dll');
    } finally {
      if (saved === undefined) delete process.env.OTA_CS_URL; else process.env.OTA_CS_URL = saved;
    }
  });

  await step('health: the configured server answers as the Content Server REST API', async () => {
    const r = await call('GET', '/api/health');
    assert.equal(r.status, 200);
    assert.equal(r.body.csUrl, csBase);
    assert.equal(r.body.cs.reachable, true);
    assert.equal(r.body.cs.restApi, true);
    assert.equal(r.body.cs.version, '16.2.4');
    assert.equal('demo' in r.body, false);
  });

  await step('a web page at the configured URL is not taken for Content Server, and sign-in says why', async () => {
    const web = stubServer(404, 'text/html', '<html><body>Not Found</body></html>');
    extraServers.push(web);
    const other = await trainerFor(`http://127.0.0.1:${await listen(web)}/otcs/cs.exe`);
    const h = await other('GET', '/api/health');
    assert.equal(h.body.cs.reachable, true);
    assert.equal(h.body.cs.restApi, false);
    assert.match(h.body.cs.error, /web page/);
    const login = await other('POST', '/api/login', { username: 'student', password: 'x' });
    assert.equal(login.status, 502);
    assert.match(login.body.error, /instead of a Content Server ticket/);
  });

  await step('a protected serverinfo (JSON 401) still identifies Content Server; a closed port is unreachable', async () => {
    const guarded = stubServer(401, 'application/json', '{"error":"Authentication required"}');
    extraServers.push(guarded);
    const other = await trainerFor(`http://127.0.0.1:${await listen(guarded)}/otcs/cs.exe`);
    const h = await other('GET', '/api/health');
    assert.equal(h.body.cs.restApi, true);
    assert.equal(h.body.cs.version, null);

    const closed = http.createServer();
    const port = await listen(closed);
    await new Promise((r) => closed.close(r));
    const nobody = await trainerFor(`http://127.0.0.1:${port}/otcs/cs.exe`);
    const n = await nobody('GET', '/api/health');
    assert.equal(n.body.cs.reachable, false);
    assert.equal(n.body.cs.restApi, false);
  });

  await step('Windows Server 2016 / IE11: edge mode, loader and legacy build are served', async () => {
    const base = `http://127.0.0.1:${appPort}`;
    const page = await fetch(`${base}/`);
    assert.equal(page.headers.get('x-ua-compatible'), 'IE=edge');
    const html = await page.text();
    assert.match(html, /<meta http-equiv="X-UA-Compatible" content="IE=edge">/);
    assert.match(html, /<script src="boot\.js"><\/script>/);
    for (const [file, type] of [['boot.js', 'javascript'], ['legacy/app.legacy.js', 'javascript'], ['legacy/styles.legacy.css', 'text/css']]) {
      const r = await fetch(`${base}/${file}`);
      assert.equal(r.status, 200, file);
      assert.match(r.headers.get('content-type'), new RegExp(type), file);
    }
    const apiRes = await fetch(`${base}/api/health`);
    assert.equal(apiRes.headers.get('pragma'), 'no-cache');
  });

  await step('IE11 build is up to date with app.js / styles.css (else: npm run build:legacy)', async () => {
    const { sourceHash, builtHash } = require('../tools/legacy-sources');
    assert.equal(builtHash(), sourceHash());
  });

  // ---------------------------------------------------------- sign-in & scan

  await step('API rejects unauthenticated and header-less requests', async () => {
    assert.equal((await call('GET', '/api/overview')).status, 401);
    const raw = await fetch(`http://127.0.0.1:${appPort}/api/logout`, { method: 'POST' });
    assert.equal(raw.status, 400);
  });

  await step('wrong password and unknown users are refused', async () => {
    assert.equal((await call('POST', '/api/login', { username: 'student', password: 'wrong' })).status, 401);
    assert.equal((await call('POST', '/api/login', { username: 'demo', password: 'x' })).status, 401);
  });

  await step('sign in as student: the session names the Content Server it reads', async () => {
    const r = await call('POST', '/api/login', { username: 'student', password: 'secret' });
    assert.equal(r.status, 200, JSON.stringify(r.body));
    assert.equal(r.body.user.name, 'student');
    assert.equal(r.body.user.isSysAdmin, false);
    assert.equal(r.body.needsScan, true);
    assert.deepEqual(r.body.cs, { url: csBase, version: '16.2.4' });
  });

  let scan;
  await step('platform scan reads the server: areas, categories, maps, groups (from /members/memberof)', async () => {
    const r = await call('POST', '/api/scan');
    assert.equal(r.status, 200, JSON.stringify(r.body));
    scan = r.body.scan;
    assert.equal(scan.server.url, csBase);
    assert.equal(scan.server.version, '16.2.4');
    assert.equal(scan.categories.length, 3);
    assert.equal(scan.workflowMaps.length, 2);
    assert.deepEqual(scan.groups.map((g) => g.name), ['Trainees']);
    assert.equal(scan.user.departmentName, 'Trainees');
    assert.equal(scan.features.core.status, 'detected');
    assert.equal(scan.features.projects.status, 'detected');
    assert.equal(scan.features.businessWorkspaces.status, 'not-detected');
    assert.equal(scan.features.permissions.status, 'detected');
    assert.equal(scan.features.classifications.status, 'detected');
    assert.equal(scan.user.isSysAdmin, false);
    assert.ok(scan.notes.length >= 3);
  });

  await step('teacher proposes the first mission', async () => {
    const r = await call('GET', '/api/overview');
    assert.equal(r.body.next.id, 'u01-sandbox');
    assert.match(r.body.next.steps[2], /OT Academy/);
    assert.equal(r.body.cs.url, csBase);
  });

  await step('curriculum sent to the browser has no quiz answers', async () => {
    const r = await call('GET', '/api/curriculum');
    const quiz = r.body.modules[0].missions.find((m) => m.type === 'quiz');
    assert.ok(quiz.questions.length > 0);
    assert.equal(quiz.questions[0].answer, undefined);
    assert.equal(JSON.stringify(r.body).includes('"explain"'), false);
  });

  // ---------------------------------------------------------- missions

  await step('nothing is pre-seeded: the first mission fails until the learner does the work', async () => {
    const r = await check('u01-sandbox');
    assert.equal(r.result.status, 'fail');
    assert.equal(r.xpGained, 0);
    assert.equal(r.mission.state.status, undefined);
  });

  let sandbox, drafts, review, final, plan;
  await step('mission passes after creating the sandbox; the result links to the real item', async () => {
    sandbox = await cs.create({ type: 0, parent_id: personal, name: 'OT Academy' });
    const r = await check('u01-sandbox');
    assert.equal(r.result.status, 'pass');
    assert.equal(r.xpGained, 30);
    assert.equal(r.stats.xp, 30);
    const node = r.result.results[0].node;
    assert.equal(node.id, sandbox);
    assert.equal(node.links.smart, `${csBase}/app/nodes/${sandbox}`);
    assert.equal(node.links.classic, `${csBase}?func=ll&objId=${sandbox}&objAction=browse`);
  });

  await step('auto-checked missions cannot be self-confirmed', async () => {
    const r = await call('POST', '/api/missions/u01-describe/confirm', {});
    assert.equal(r.status, 400);
    assert.match(r.body.error, /Check my work/);
  });

  await step('locked mission is refused until prerequisites are done', async () => {
    const r = await call('POST', '/api/missions/u03-unreserve/check', {});
    assert.equal(r.status, 409);
  });

  await step('partial structure reports exactly what is missing', async () => {
    drafts = await cs.create({ type: 0, parent_id: sandbox, name: '01 Drafts' });
    review = await cs.create({ type: 0, parent_id: sandbox, name: '02 review' });
    let r = await check('u01-structure');
    assert.equal(r.result.status, 'fail');
    assert.deepEqual(r.result.results.map((x) => x.status), ['pass', 'pass', 'fail']);
    final = await cs.create({ type: 0, parent_id: sandbox, name: '03 Final' });
    r = await check('u01-structure');
    assert.equal(r.result.status, 'pass');
  });

  await step('near miss: right name, wrong item type', async () => {
    const wrong = await cs.create({ type: 0, parent_id: drafts, name: 'Project Plan' });
    const r = await check('u02-upload');
    assert.equal(r.result.status, 'fail');
    assert.match(r.result.results[0].detail, /Folder/);
    await cs.del(wrong);
    plan = await cs.create({ type: 144, parent_id: drafts, name: 'Project Plan.docx', mime_type: 'application/msword' });
    assert.equal((await check('u02-upload')).result.status, 'pass');
  });

  await step('description check', async () => {
    await cs.update(sandbox, { description: 'short' });
    assert.equal((await check('u01-describe')).result.status, 'fail');
    await cs.update(sandbox, { description: 'My hands-on training area' });
    assert.equal((await check('u01-describe')).result.status, 'pass');
  });

  await step('investigation answers are compared with live values (MIME type from the current version)', async () => {
    let r = await check('u01-ids', { sandboxId: '1', login: 'student' });
    assert.deepEqual(r.result.results.map((x) => x.status), ['fail', 'pass']);
    r = await check('u01-ids', { sandboxId: String(sandbox), login: 'STUDENT ' });
    assert.equal(r.result.status, 'pass');
    assert.equal((await check('u02-mime', { mime: 'msword' })).result.status, 'fail');
    assert.equal((await check('u02-mime', { mime: 'application/msword' })).result.status, 'pass');
  });

  await step('versions, reserve and unreserve', async () => {
    assert.equal((await check('u03-version')).result.status, 'fail');
    await cs.addVersion(plan);
    assert.equal((await check('u03-version')).result.status, 'pass');
    await cs.update(plan, { reserved: true });
    assert.equal((await check('u03-reserve')).result.status, 'pass');
    let r = await check('u03-unreserve');
    assert.deepEqual(r.result.results.map((x) => x.status), ['fail', 'fail']);
    await cs.update(plan, { reserved: false });
    await cs.addVersion(plan);
    assert.equal((await check('u03-unreserve')).result.status, 'pass');
  });

  await step('copy keeps the original in place', async () => {
    await cs.create({ type: 144, parent_id: final, name: 'Project Plan.docx' });
    assert.equal((await check('u03-copy')).result.status, 'pass');
  });

  await step('delete: still there fails; in the Recycle Bin passes; purged passes on "no such node"', async () => {
    const tmp = await cs.create({ type: 0, parent_id: sandbox, name: 'Scratch - delete me' });
    assert.equal((await check('u03-temp')).result.status, 'pass');
    let r = await check('u03-delete');
    assert.equal(r.result.status, 'fail');
    assert.match(r.result.results[0].detail, /still exists/);
    await cs.del(tmp);
    r = await check('u03-delete');
    assert.equal(r.result.status, 'pass');
    assert.match(r.result.results[0].detail, /Recycle Bin/);

    const tmp2 = await cs.create({ type: 0, parent_id: sandbox, name: 'Scratch - delete me' });
    assert.equal((await check('u03-temp')).result.results[0].node.id, tmp2);
    await cs.del(tmp2);
    await cs.purge(tmp2);
    r = await check('u03-delete');
    assert.equal(r.result.status, 'pass');
    assert.match(r.result.results[0].detail, /no longer returns/);
  });

  await step('delete never passes on a server error', async () => {
    const tmp3 = await cs.create({ type: 0, parent_id: sandbox, name: 'Scratch - delete me' });
    assert.equal((await check('u03-temp')).result.status, 'pass');
    mock.state.broken.push(/^\/api\/v[12]\/nodes\/\d+$/, /^\/api\/v2\/volumes\/recyclebin\/nodes$/);
    try {
      const r = await check('u03-delete');
      assert.equal(r.result.status, 'unverified');
      assert.equal(r.result.results[0].status, 'unknown');
      assert.match(r.result.results[0].detail, /HTTP 500/);
    } finally {
      mock.state.broken.length = 0;
    }
    await cs.del(tmp3);
    assert.equal((await check('u03-delete')).result.status, 'pass');
  });

  await step('a server without the Recycle Bin endpoint (as Content Server 22.3 answers): "no such node" confirms deletion', async () => {
    mock.state.answers.push([/^\/api\/v2\/volumes\/recyclebin\/nodes$/, 400, 'Invalid datatype specified for argument "volume_subtype".']);
    try {
      const tmp4 = await cs.create({ type: 0, parent_id: sandbox, name: 'Scratch - delete me' });
      assert.equal((await check('u03-temp')).result.status, 'pass');
      let r = await check('u03-delete');
      assert.equal(r.result.status, 'fail');
      assert.match(r.result.results[0].detail, /still exists in “OT Academy”/);
      await cs.del(tmp4);
      r = await check('u03-delete');
      assert.equal(r.result.status, 'pass');
      assert.match(r.result.results[0].detail, /no longer returns/);

      const c = await call('GET', '/api/connection');
      const bin = c.body.rows.find((x) => x.area === 'Recycle Bin');
      assert.equal(bin.ok, false);
      assert.equal(bin.optional, true);
      assert.match(bin.detail, /HTTP 400: Invalid datatype/);
      assert.match(bin.note, /no longer returns the item/);
    } finally {
      mock.state.answers.length = 0;
    }
  });

  await step('shortcut must point at the right document (original_id is only in the v1 answer)', async () => {
    const other = await cs.create({ type: 144, parent_id: drafts, name: 'Other.txt' });
    const sc = await cs.create({ type: 1, parent_id: review, name: 'Shortcut', original_id: other });
    let r = await check('u06-shortcut');
    assert.deepEqual(r.result.results.map((x) => x.status), ['pass', 'fail']);
    await cs.del(sc);
    await cs.create({ type: 1, parent_id: review, name: 'Project Plan shortcut', original_id: plan });
    r = await check('u06-shortcut');
    assert.equal(r.result.status, 'pass');
  });

  await step('favorites, categories (v1, and v2 with ?metadata) and inheritance', async () => {
    assert.equal((await check('u06-favorite')).result.status, 'fail');
    await cs.favorite(plan);
    assert.equal((await check('u06-favorite')).result.status, 'pass');
    await cs.categorize(plan, 2101);
    let r = await check('u07-apply');
    assert.equal(r.result.status, 'pass');
    assert.match(r.result.results[0].detail, /Contract/);
    mock.state.unsupported.push(/^\/api\/v1\/nodes\/\d+\/categories$/);
    try {
      r = await check('u07-apply');
      assert.equal(r.result.status, 'pass');
      assert.match(r.result.results[0].detail, /Contract/);
    } finally {
      mock.state.unsupported.pop();
    }
    await cs.categorize(final, 2102);
    assert.equal((await check('u07-folder')).result.status, 'pass');
    const inh = await cs.create({ type: 144, parent_id: final, name: 'Inherited Metadata Test.docx' });
    assert.equal((await check('u07-inherit')).result.status, 'fail');
    await cs.categorize(inh, 2102);
    r = await check('u07-inherit');
    assert.equal(r.result.status, 'pass');
    assert.match(r.result.results[1].detail, /Project Info/);
  });

  await step('permissions: assigned access, private folder and owner', async () => {
    assert.equal((await check('u10-grant')).result.status, 'fail');
    await cs.grant(review, 1103);
    assert.equal((await check('u10-grant')).result.status, 'pass');
    await cs.create({ type: 0, parent_id: sandbox, name: 'Private' });
    assert.equal((await check('u10-private')).result.status, 'pass');
    assert.equal((await check('u10-owner', { owner: 'student' })).result.status, 'pass');
    assert.equal((await check('u10-owner', { owner: 'Admin' })).result.status, 'fail');
  });

  await step('rename is tracked by node id', async () => {
    assert.equal((await check('u13-rename')).result.status, 'fail');
    await cs.update(review, { name: '02 In Review' });
    assert.equal((await check('u13-rename')).result.status, 'pass');
  });

  await step('nickname is resolved through the nicknames endpoint', async () => {
    let r = await check('u08-nickname');
    assert.equal(r.result.status, 'fail');
    await cs.update(drafts, { nickname: 'ota-student' });
    r = await check('u08-nickname');
    assert.equal(r.result.status, 'fail');
    assert.match(r.result.results[0].detail, /belongs to “01 Drafts”/);
    await cs.update(drafts, { nickname: String(drafts) });
    await cs.update(sandbox, { nickname: 'ota-student' });
    assert.equal((await check('u08-nickname')).result.status, 'pass');
  });

  await step('hidden items are still seen', async () => {
    await cs.create({ type: 146, parent_id: sandbox, name: 'customview.html', hidden: true });
    assert.equal((await check('c09-customview')).result.status, 'pass');
  });

  await step('a step the server cannot answer is "unverified": no XP, no self-confirmation, not done', async () => {
    const urlItem = await cs.create({ type: 140, parent_id: sandbox, name: 'OpenText Support', url: 'https://support.opentext.com' });
    const r = await check('u02-url');
    assert.equal(r.result.status, 'unverified');
    assert.deepEqual(r.result.results.map((x) => x.status), ['pass', 'unknown']);
    assert.equal(r.result.results[0].node.id, urlItem);
    assert.match(r.result.results[1].detail, /doesn't return “url”/);
    assert.equal(r.xpGained, 0);
    assert.notEqual(r.mission.state.status, 'done');
    assert.equal((await call('POST', '/api/missions/u02-url/confirm', {})).status, 400);
    const a = await check('a06-types', { count: '0' });
    assert.equal(a.result.status, 'unverified');
    assert.match(a.result.results[0].detail, /mappings registry/);
  });

  await step('groups come from /members/memberof; workflows count only those the learner started', async () => {
    assert.equal((await check('u11-groups', { group: 'trainees' })).result.status, 'pass');
    assert.equal((await check('u11-groups', { group: 'Sales' })).result.status, 'fail');
    assert.equal((await check('u11-department', { dept: 'Trainees' })).result.status, 'pass');
    assert.equal((await check('u11-create-group')).result.status, 'fail');
    await cs.group('OTA student Reviewers', [student.id]);
    assert.equal((await check('u11-create-group')).result.status, 'pass');

    const admin = csLearner(csBase);
    await admin.login('Admin');
    await admin.initiate({ manager: student.id, status: 'completed' });
    assert.equal((await check('c02-initiate')).result.status, 'fail');
    await cs.initiate({ status: 'workflowlate' });
    assert.equal((await check('c02-initiate')).result.status, 'pass');
  });

  await step('workflow map is verified by opening the node ID the learner found', async () => {
    let r = await check('c02-find-map', { mapId: String(drafts), map: '01 Drafts' });
    assert.deepEqual(r.result.results.map((x) => x.status), ['fail', 'blocked']);
    r = await check('c02-find-map', { mapId: '2041', map: 'Invoice Review' });
    assert.deepEqual(r.result.results.map((x) => x.status), ['pass', 'fail']);
    r = await check('c02-find-map', { mapId: '2041', map: 'document approval' });
    assert.equal(r.result.status, 'pass');
    assert.equal(r.xpGained, 20);
  });

  await step('other investigations read live values: user ID, assignments, version, rights, classifications', async () => {
    assert.equal((await check('u12-userid', { uid: String(student.id) })).result.status, 'pass');
    assert.equal((await check('c02-assignments', { count: '2' })).result.status, 'pass');
    assert.equal((await check('c02-assignments', { count: '3' })).result.status, 'fail');
    assert.equal((await check('a01-version', { version: '16.2.4' })).result.status, 'pass');
    assert.equal((await check('a01-version', { version: '21.4' })).result.status, 'fail');
    assert.equal((await check('a02-rights', { sysadmin: 'yes' })).result.status, 'fail');
    assert.equal((await check('a02-rights', { sysadmin: 'no' })).result.status, 'pass');
    assert.equal((await check('c08-tree', { tree: 'Hobbies' })).result.status, 'fail');
    assert.equal((await check('c08-tree', { tree: 'subjects' })).result.status, 'pass');
  });

  await step('practice mission needs a real reflection and is recorded as self-reported', async () => {
    let r = await call('POST', '/api/missions/u01-two-uis/confirm', { reflection: 'ok' });
    assert.equal(r.status, 400);
    r = await call('POST', '/api/missions/u01-two-uis/confirm', { reflection: 'Smart View uses tiles and a toolbar while Classic has the Functions menu; help is under the question mark.' });
    assert.equal(r.status, 200);
    assert.ok(r.body.xpGained > 0);
    assert.equal(r.body.mission.state.method, 'self');
  });

  await step('quiz grading on the server', async () => {
    const q = curriculum.missionById.get('u01-quiz');
    let r = await call('POST', '/api/missions/u01-quiz/quiz', { answers: q.questions.map((x) => (x.answer + 1) % x.options.length) });
    assert.equal(r.body.passed, false);
    assert.equal(r.body.xpGained, 0);
    r = await call('POST', '/api/missions/u01-quiz/quiz', { answers: q.questions.map((x) => x.answer) });
    assert.equal(r.body.passed, true);
    assert.equal(r.body.correct, q.questions.length);
  });

  await step('practice exam: options are shuffled but graded correctly', async () => {
    const e = await call('GET', '/api/exam/new?track=user&count=10');
    assert.equal(e.body.questions.length, 10);
    const answers = e.body.questions.map((qq) => {
      const orig = curriculum.questionBank.find((b) => b.q === qq.q);
      return qq.options.indexOf(orig.options[orig.answer]);
    });
    const r = await call('POST', '/api/exam/submit', { examId: e.body.examId, answers });
    assert.equal(r.body.record.correct, 10);
    const again = await call('POST', '/api/exam/submit', { examId: e.body.examId, answers });
    assert.equal(again.status, 410);
  });

  await step('progress is stored per Content Server', async () => {
    const file = path.join(dataDir, 'progress', serverKey(csBase), `${student.id}.json`);
    const saved = JSON.parse(fs.readFileSync(file, 'utf8'));
    assert.equal(saved.server, csBase);
    assert.equal(saved.missions['u01-sandbox'].status, 'done');
    assert.equal(saved.missions['u02-url'].status, undefined);
    assert.equal(saved.refs.sandbox.id, sandbox);
    assert.ok(saved.xp > 300);
    assert.notEqual(serverKey(csBase), serverKey('http://other-host/otcs/cs.exe'));
  });

  await step('connection report shows what each endpoint returned', async () => {
    const r = await call('GET', '/api/connection');
    assert.equal(r.status, 200, JSON.stringify(r.body));
    assert.equal(r.body.trainerUrl, csBase);
    const row = (area) => r.body.rows.find((x) => x.area === area);
    assert.match(row('Your account').detail, new RegExp(`student · user ID ${student.id}`));
    assert.equal(row('Server version').detail, 'Content Server 16.2.4');
    assert.equal(row('Personal Workspace').node.id, personal);
    assert.match(row('Training folder “OT Academy”').detail, new RegExp(`ID ${sandbox}`));
    assert.equal(row('Your groups').detail, 'Trainees, OTA student Reviewers');
    const bw = row('Business workspace types (Extended ECM)');
    assert.equal(bw.ok, false);
    assert.equal(bw.optional, true);
    assert.deepEqual(r.body.rows.filter((x) => !x.ok && !x.optional), []);
  });

  await step('roster is admin-only; admin rights come from the privilege flag', async () => {
    assert.equal((await call('GET', '/api/roster')).status, 403);
    const admin = browser(`http://127.0.0.1:${appPort}`);
    const login = await admin('POST', '/api/login', { username: 'Admin', password: 'x' });
    assert.equal(login.body.user.isSysAdmin, true);
    const r = await admin('GET', '/api/roster');
    assert.equal(r.status, 200);
    assert.ok(r.body.learners.some((l) => l.name === 'student'));
    assert.equal((await admin('POST', '/api/missions/a02-rights/check', { inputs: { sysadmin: 'yes' } })).body.result.status, 'pass');
  });

  await step('an unreachable Content Server is an error, never a result', async () => {
    const down = createMockCS();
    const downServer = down.server;
    const port = await listen(downServer);
    const other = await trainerFor(`http://127.0.0.1:${port}/otcs/cs.exe`);
    assert.equal((await other('POST', '/api/login', { username: 'student', password: 'x' })).status, 200);
    await new Promise((r) => downServer.close(r));
    downServer.closeAllConnections();
    const r = await other('POST', '/api/missions/u01-sandbox/check', {});
    assert.equal(r.status, 502);
    assert.match(r.body.error, /Cannot reach Content Server/);
    const p = await other('GET', '/api/progress');
    assert.equal(p.body.stats.xp, 0);
    assert.equal(p.body.activity.some((a) => /Checked/.test(a.text)), false);
  });

  await step('expired Content Server ticket signs the learner out', async () => {
    mock.state.tickets.clear();
    const r = await call('POST', '/api/missions/u06-collection/check', {});
    assert.equal(r.status, 401);
    assert.equal(r.body.code, 'SESSION_EXPIRED');
    assert.equal((await call('GET', '/api/overview')).status, 401);
  });

  await step('reset wipes progress', async () => {
    await call('POST', '/api/login', { username: 'student', password: 'x' });
    const r = await call('POST', '/api/progress/reset', { confirm: 'RESET' });
    assert.equal(r.status, 200);
    const o = await call('GET', '/api/overview');
    assert.equal(o.body.stats.xp, 0);
    assert.equal(o.body.next.id, 'u01-sandbox');
  });

  await step('the trainer only called documented endpoints the mock implements', async () => {
    assert.deepEqual(mock.state.unknown, []);
  });

  console.log(`\n${passed} checks passed`);
  for (const s of [appServer, mock.server, ...extraServers]) if (s.listening) s.close();
  fs.rmSync(dataDir, { recursive: true, force: true });
}

// Keep-alive sockets would otherwise hold the process open.
main().then(() => process.exit(process.exitCode || 0), () => process.exit(1));
