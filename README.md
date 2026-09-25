# CS Academy — a hands-on trainer for OpenText Content Server

CS Academy runs next to your OpenText Content Server 16.x and acts as an instructor:

1. **It analyses the platform.** Through the Content Server REST API it walks the Enterprise and Personal workspaces, reads the volumes, categories, classifications, workflow maps, groups, object types you may create, and probes optional modules (Extended ECM business workspaces, records, communities…). The result is a *platform map* showing which functional areas exist on this server.
2. **It gives assignments.** 116 missions across 31 modules in three tracks (Business User, Collaboration, Analyst & Administrator). The instructor always proposes the next sensible mission, tailored to what the scan found.
3. **It checks the work live.** Hands-on missions ("create a compound document with two chapters", "grant a group See Contents on 02 Review", "make a generation of Project Plan in 03 Final") are verified against the real server. When something is wrong the feedback is specific: *“Project Plan is there, but it is a Folder — not the kind of item this step asks for.”*

It is **read-only**: the only calls it makes to Content Server are `POST /api/v1/auth` (sign-in) and `GET` requests. The learner does all the work in Content Server.

## Mission types

| Type | How it is checked |
|---|---|
| Hands-on | Automatically, by reading the learner's items through REST |
| Investigation | The learner finds a value in Content Server (a node ID, their department group, the server version…) and types it; the app compares it with the server |
| Knowledge check | Multiple-choice quiz, graded on the server (answers never reach the browser) |
| Practice | Things REST can't see (Enterprise Connect, reminders, Pulse…): the learner writes a short reflection |

If a server doesn't expose something a check needs, the check reports *couldn't verify* rather than failing, and the learner can self-confirm for 70% of the XP.

There is also a **practice exam** mode (random questions from all modules, shuffled options, review at the end), **XP, levels and badges**, and a **class roster** for Content Server system administrators.

## Requirements

- Node.js 18 or newer (current LTS recommended). No `npm install` — the app has no runtime dependencies.
- Network access from where it runs to Content Server's URL. Running it on the Content Server machine itself is simplest.
- Any current browser, **or Internet Explorer 11** (see below).

### Windows Server 2016

Windows Server 2016 is supported, including its built-in Internet Explorer 11:

- **Node.js** — Node.js 22 and 24 officially support Windows 10 / Server 2016. The simplest install on a server is the portable *Windows Binary (.zip)* from https://nodejs.org: extract it into the app folder (you get `node-v22.x.x-win-x64\node.exe`) and `start.bat` uses it automatically — no installer, no PATH change.
- **Internet Explorer 11** — `boot.js` detects browsers that can't run the modern front end and loads a pre-built ES5 version instead (`public/legacy/`: transpiled app + polyfills + a stylesheet with flexbox fallbacks). The login page then shows *“Compatibility mode”*. Add `?legacy=1` to the URL to force that build in any browser.
- The server sends `X-UA-Compatible: IE=edge`, so IE doesn't fall back to Compatibility View for `localhost`/intranet sites, and marks API responses as non-cacheable (IE caches script GETs otherwise).
- **IE Enhanced Security Configuration** is on by default for administrators on Windows Server and disables scripts: add the trainer's URL to *Trusted sites*, or turn IE ESC off in Server Manager ▸ Local Server.

`start.bat test` runs the self-test with the same Node.js the app uses.

## Try it without Content Server (demo)

```bash
node server.js --demo
```

Open http://localhost:8420 and sign in as **demo** (any password). The demo starts a small simulated Content Server with sample content; the demo learner has already done the first few tasks so you can see both passes and failures. Sign in with any other name to start from zero.

## Connect it to your Content Server

1. Copy `config.example.json` to `config.json`.
2. Set `contentServer.baseUrl` to the Content Server CGI/ISAPI URL, the same one you see in the browser before `?func=`:
   - `http://localhost/otcs/cs.exe` (typical when running on the CS server)
   - `https://ecm.example.com/otcs/llisapi.dll`
3. If learners reach Content Server at a different address than the trainer does, set `contentServer.publicUrl` to the address their browsers use. It is only used for “Open in Smart View / Classic UI” links.
4. Start it:

```bash
node server.js
```

Learners open `http://<server>:8420` and sign in with their normal Content Server credentials (OTDS users included — sign-in goes through `/api/v1/auth`).

### Configuration

| Key | Default | Meaning |
|---|---|---|
| `port`, `host` | `8420`, `0.0.0.0` | Where the trainer listens |
| `contentServer.baseUrl` | `http://localhost/otcs/cs.exe` | Content Server URL used by the trainer |
| `contentServer.publicUrl` | same as `baseUrl` | Content Server URL used in links shown to learners |
| `contentServer.allowSelfSignedCerts` | `false` | Accept a self-signed HTTPS certificate on Content Server |
| `contentServer.timeoutMs` | `20000` | Per-request timeout |
| `sandboxName` | `OT Academy` | Name of the training folder each learner creates in their Personal Workspace |
| `scan.maxDepth` / `scan.maxNodes` | `2` / `1500` | How deep and how wide the platform scan goes |
| `scan.concurrency` | `4` | Parallel requests during a scan |
| `tls.keyFile` / `tls.certFile` | empty | Serve the trainer over HTTPS |
| `dataDir` | `./data` | Where learner progress is stored |
| `sessionHours` | `8` | Idle time before a trainer session expires |

Environment overrides: `OTA_CS_URL`, `OTA_PORT`.

### HTTPS (recommended)

Learners type their Content Server password into the trainer, so serve it over HTTPS: either set `tls.keyFile` / `tls.certFile` (PEM files), or put it behind IIS (Application Request Routing) or another reverse proxy that terminates TLS.

### Run it as a Windows service

With [NSSM](https://nssm.cc):

```bash
nssm install CSAcademy "C:\Program Files\nodejs\node.exe" "D:\cs-academy\server.js"
```

```bash
nssm set CSAcademy AppDirectory "D:\cs-academy"
```

```bash
nssm start CSAcademy
```

`start.bat` is provided for running it by hand. With a portable Node.js in the app folder, point NSSM at that `node.exe` instead of `C:\Program Files\nodejs\node.exe`.

## What is stored

- `data/progress/<userId>.json` per learner: mission results, XP, exam history, reflections, and the IDs of items the learner created for missions (so later missions can build on them).
- Passwords are never stored. The Content Server ticket lives only in memory for the session.

## Tailoring the curriculum

Missions live in `curriculum/track-*.js` as plain data. A hands-on mission looks like this:

```js
{
  id: 'u04-create', type: 'hands-on', title: 'Create a compound document', xp: 30, requires: ['u01-sandbox'],
  steps: ['In “{{sandbox}}”: Add Item ▸ Compound Document.', 'Name it “Training Manual”.'],
  checks: [
    { kind: 'child', parent: 'sandbox', name: 'Training Manual', types: [136], typeName: 'compound', saveAs: 'cdoc',
      label: 'Compound document “Training Manual”' },
  ],
}
```

Check kinds: `child`, `count`, `prop`, `versions`, `categories`, `permissions`, `favorite`, `gone`, `answer`, `groupExists`, `apiCount` — see `lib/verifier.js`. `saveAs` remembers the item found so later missions can refer to it (`parent: 'cdoc'`). Placeholders: `{{sandbox}}`, `{{user}}`, `{{category}}`, `{{group}}`, `{{csUrl}}`, `{{smartUrl}}`. The curriculum is validated at start-up, so a typo in a reference stops the server with a clear message.

Item types are matched by subtype number **or** type name, because optional modules use different subtype numbers on different installations. If a check misses an item type on your server, add the subtype you see in the Platform map to its `types` list.

## Tests

```bash
npm test
```

Runs an end-to-end test: the mock Content Server plus the trainer, with the test playing the learner (creating folders, adding versions, granting permissions…) and asserting that each mission fails before the work and passes after it. It also fails if the Internet Explorer build is out of date.

## Changing the front end

`public/app.js` and `public/styles.css` are the sources. After editing them (or `tools/ie11.css`), rebuild the Internet Explorer 11 version:

```bash
npm install
```

```bash
npm run build:legacy
```

`npm install` fetches build tools only (Babel, core-js, whatwg-fetch, acorn) into `node_modules/`; the app never loads them at runtime. The build refuses to write output that isn't pure ES5 or that uses DOM methods IE11 lacks (`closest`, `append`, `remove()`…). Commit the regenerated `public/legacy/` files; servers never need npm.

## Limits

- The REST calls follow the documented Content Server 16.x v1/v2 API, and the app has been tested against the built-in mock server, not yet against a live installation. The API layer accepts both v1 and v2 response shapes and falls back to *couldn't verify* rather than failing, but expect to adjust a few checks (subtype numbers, optional endpoints such as workflow status or classifications) the first time you point it at your server.
- The scan samples the tree (`scan.maxDepth`, `scan.maxNodes`). On very large repositories, areas that only exist deep in the tree may show as *not detected*.

## Sources

Lesson topics follow the outlines of the OpenText courses *Managing Documents in Content Server 16.2* and *Collaborating in Content Server 16.2*, and the *Mastering OpenText Content Suite / Extended ECM* study plan. All lesson text, missions and questions in this app are original; the course workbooks are not included.
