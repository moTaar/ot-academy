'use strict';
// End-to-end test: mock Content Server + trainer, with the test acting as the
// learner (doing the work through the mock's write endpoints) and checking
// that the trainer notices.
//
//   node test/smoke.js

const assert = require('assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const http = require('http');
const { createMockCS } = require('../lib/mock-cs');
const { createApp } = require('../server');
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
    favorite: (id) => call('POST', `/mock/favorites/${id}`),
    categorize: (id, cat, inherit) => call('POST', `/mock/nodes/${id}/categories/${cat}`, { inherit }),
    grant: (id, rightId) => call('POST', `/mock/nodes/${id}/permissions`, { type: 'custom', right_id: rightId, permissions: ['see', 'see_contents'] }),
    group: (name, members) => call('POST', '/mock/groups', { name, members }),
    initiate: () => call('POST', '/mock/workflows/initiate', { name: 'Document Approval' }),
  };
}

async function main() {
  const mock = createMockCS({ seed: true });
  const mockPort = await listen(mock.server);
  const csBase = `http://127.0.0.1:${mockPort}/otcs/cs.exe`;
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'csa-test-'));

  const app = createApp({
    port: 0, host: '127.0.0.1', demo: true, sandboxName: 'OT Academy', dataDir, sessionHours: 1,
    contentServer: { baseUrl: csBase, timeoutMs: 5000 }, scan: { maxDepth: 3, maxNodes: 500, concurrency: 3 }, tls: {},
  });
  const appServer = http.createServer(app.handle);
  const appPort = await listen(appServer);
  const call = browser(`http://127.0.0.1:${appPort}`);
  const cs = csLearner(csBase);
  await cs.login('student');
  const student = [...mock.state.users.values()].find((u) => u.name === 'student');
  const personal = 5000 + student.id;

  const check = async (id, inputs) => (await call('POST', `/api/missions/${id}/check`, { inputs })).body;

  console.log('CS Academy smoke test');

  await step('health reports the mock server reachable', async () => {
    const r = await call('GET', '/api/health');
    assert.equal(r.status, 200);
    assert.equal(r.body.cs.reachable, true);
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

  await step('API rejects unauthenticated and header-less requests', async () => {
    assert.equal((await call('GET', '/api/overview')).status, 401);
    const raw = await fetch(`http://127.0.0.1:${appPort}/api/logout`, { method: 'POST' });
    assert.equal(raw.status, 400);
  });

  await step('wrong password is refused', async () => {
    const r = await call('POST', '/api/login', { username: 'student', password: 'wrong' });
    assert.equal(r.status, 401);
  });

  await step('sign in as student', async () => {
    const r = await call('POST', '/api/login', { username: 'student', password: 'secret' });
    assert.equal(r.status, 200, JSON.stringify(r.body));
    assert.equal(r.body.user.name, 'student');
    assert.equal(r.body.needsScan, true);
  });

  let scan;
  await step('platform scan detects areas, categories and maps', async () => {
    const r = await call('POST', '/api/scan');
    assert.equal(r.status, 200, JSON.stringify(r.body));
    scan = r.body.scan;
    assert.equal(scan.categories.length, 3);
    assert.equal(scan.workflowMaps.length, 2);
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
  });

  await step('curriculum sent to the browser has no quiz answers', async () => {
    const r = await call('GET', '/api/curriculum');
    const quiz = r.body.modules[0].missions.find((m) => m.type === 'quiz');
    assert.ok(quiz.questions.length > 0);
    assert.equal(quiz.questions[0].answer, undefined);
    assert.equal(JSON.stringify(r.body).includes('"explain"'), false);
  });

  await step('mission fails before the work is done', async () => {
    const r = await check('u01-sandbox');
    assert.equal(r.result.status, 'fail');
  });

  let sandbox, drafts, review, final, plan;
  await step('mission passes after creating the sandbox; XP awarded', async () => {
    sandbox = await cs.create({ type: 0, parent_id: personal, name: 'OT Academy' });
    const r = await check('u01-sandbox');
    assert.equal(r.result.status, 'pass');
    assert.equal(r.xpGained, 30);
    assert.equal(r.stats.xp, 30);
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

  await step('investigation answers are compared with the server', async () => {
    let r = await check('u01-ids', { sandboxId: '1', login: 'student' });
    assert.deepEqual(r.result.results.map((x) => x.status), ['fail', 'pass']);
    r = await check('u01-ids', { sandboxId: String(sandbox), login: 'STUDENT ' });
    assert.equal(r.result.status, 'pass');
    r = await check('u02-mime', { mime: 'application/msword' });
    assert.equal(r.result.status, 'pass');
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

  await step('delete is detected through the saved node id', async () => {
    const tmp = await cs.create({ type: 0, parent_id: sandbox, name: 'Scratch - delete me' });
    assert.equal((await check('u03-temp')).result.status, 'pass');
    assert.equal((await check('u03-delete')).result.status, 'fail');
    await cs.del(tmp);
    assert.equal((await check('u03-delete')).result.status, 'pass');
  });

  await step('shortcut must point at the right document', async () => {
    const other = await cs.create({ type: 144, parent_id: drafts, name: 'Other.txt' });
    const sc = await cs.create({ type: 1, parent_id: review, name: 'Shortcut', original_id: other });
    let r = await check('u06-shortcut');
    assert.deepEqual(r.result.results.map((x) => x.status), ['pass', 'fail']);
    await cs.del(sc);
    await cs.create({ type: 1, parent_id: review, name: 'Project Plan shortcut', original_id: plan });
    r = await check('u06-shortcut');
    assert.equal(r.result.status, 'pass');
  });

  await step('favorites, categories and inheritance', async () => {
    assert.equal((await check('u06-favorite')).result.status, 'fail');
    await cs.favorite(plan);
    assert.equal((await check('u06-favorite')).result.status, 'pass');
    await cs.categorize(plan, 2101);
    assert.equal((await check('u07-apply')).result.status, 'pass');
    await cs.categorize(final, 2102);
    assert.equal((await check('u07-folder')).result.status, 'pass');
    const inh = await cs.create({ type: 144, parent_id: final, name: 'Inherited Metadata Test.docx' });
    assert.equal((await check('u07-inherit')).result.status, 'fail');
    await cs.categorize(inh, 2102);
    const r = await check('u07-inherit');
    assert.equal(r.result.status, 'pass');
    assert.match(r.result.results[1].detail, /Project Info/);
  });

  await step('permissions: assigned access and private folder', async () => {
    assert.equal((await check('u10-grant')).result.status, 'fail');
    await cs.grant(review, 1103);
    assert.equal((await check('u10-grant')).result.status, 'pass');
    await cs.create({ type: 0, parent_id: sandbox, name: 'Private' });
    assert.equal((await check('u10-private')).result.status, 'pass');
    const r = await check('u10-owner', { owner: 'student' });
    assert.equal(r.result.status, 'pass');
  });

  await step('rename is tracked by node id', async () => {
    assert.equal((await check('u13-rename')).result.status, 'fail');
    await cs.update(review, { name: '02 In Review' });
    assert.equal((await check('u13-rename')).result.status, 'pass');
  });

  await step('group creation and workflow initiation', async () => {
    assert.equal((await check('u11-create-group')).result.status, 'fail');
    await cs.group('OTA student Reviewers', [student.id]);
    assert.equal((await check('u11-create-group')).result.status, 'pass');
    assert.equal((await check('c02-initiate')).result.status, 'fail');
    await cs.initiate();
    assert.equal((await check('c02-initiate')).result.status, 'pass');
    assert.equal((await check('u11-groups', { group: 'trainees' })).result.status, 'pass');
  });

  await step('lenient answer -> partial -> self-confirm at reduced XP', async () => {
    const r = await check('c02-find-map', { map: 'Some map I found deep down' });
    assert.equal(r.result.status, 'partial');
    const c = await call('POST', '/api/missions/c02-find-map/confirm', {});
    assert.equal(c.status, 200);
    assert.equal(c.body.xpGained, Math.round(curriculum.missionById.get('c02-find-map').xp * 0.7));
  });

  await step('confirm is refused for missions that are auto-checked', async () => {
    const r = await call('POST', '/api/missions/u06-collection/confirm', {});
    assert.equal(r.status, 400);
  });

  await step('practice mission needs a real reflection', async () => {
    let r = await call('POST', '/api/missions/u01-two-uis/confirm', { reflection: 'ok' });
    assert.equal(r.status, 400);
    r = await call('POST', '/api/missions/u01-two-uis/confirm', { reflection: 'Smart View uses tiles and a toolbar while Classic has the Functions menu; help is under the question mark.' });
    assert.equal(r.status, 200);
    assert.ok(r.body.xpGained > 0);
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

  await step('progress persisted to disk', async () => {
    const file = path.join(dataDir, 'progress', `${student.id}.json`);
    const saved = JSON.parse(fs.readFileSync(file, 'utf8'));
    assert.equal(saved.missions['u01-sandbox'].status, 'done');
    assert.equal(saved.refs.sandbox.id, sandbox);
    assert.ok(saved.xp > 300);
  });

  await step('roster is admin-only', async () => {
    assert.equal((await call('GET', '/api/roster')).status, 403);
    const admin = browser(`http://127.0.0.1:${appPort}`);
    await admin('POST', '/api/login', { username: 'Admin', password: 'x' });
    const r = await admin('GET', '/api/roster');
    assert.equal(r.status, 200);
    assert.ok(r.body.learners.some((l) => l.name === 'student'));
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

  console.log(`\n${passed} checks passed`);
  appServer.close();
  mock.server.close();
  fs.rmSync(dataDir, { recursive: true, force: true });
}

// Keep-alive sockets would otherwise hold the process open.
main().then(() => process.exit(process.exitCode || 0), () => process.exit(1));
