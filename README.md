# CS Academy — a hands-on trainer for OpenText Content Server

CS Academy runs next to your OpenText Content Server 16.x and acts as an instructor:

1. **It analyses the platform.** Through the Content Server REST API it walks the Enterprise and Personal workspaces, reads the volumes, categories, classifications, workflow maps, groups, object types you may create, and probes optional modules (Extended ECM business workspaces, records, communities…). The result is a *platform map* showing which functional areas exist on this server.
2. **It gives assignments.** 116 missions across 31 modules in three tracks (Business User, Collaboration, Analyst & Administrator). The instructor always proposes the next sensible mission, tailored to what the scan found.
3. **It checks the work live.** Hands-on missions ("create a compound document with two chapters", "grant a group See Contents on 02 Review", "make a generation of Project Plan in 03 Final") are verified against the real server. When something is wrong the feedback is specific: *“Project Plan is there, but it is a Folder — not the kind of item this step asks for.”* When it is right, the result names the item it found (with its node ID) and links to it in Smart View and the Classic UI, so you can see it there yourself.

It is **read-only**: the only calls it makes to Content Server are `POST /api/v1/auth` (sign-in) and `GET` requests. The learner does all the work in Content Server.

It works **only against a real Content Server**. There is no demo or offline mode and no sample data: every result — the platform map, every check, every expected answer — is read from the server in `config.json` at the moment you ask. The sidebar always shows which server that is, and the **Connection** page lists each REST call the trainer relies on with what your server returned.

## Mission types

| Type | How it is checked |
|---|---|
| Hands-on | Automatically, by reading the learner's items through REST |
| Investigation | The learner finds a value in Content Server (a node ID, their department group, the server version…) and types it; the app compares it with the value the server returns at that moment |
| Knowledge check | Multiple-choice quiz, graded by the trainer (answers never reach the browser) |
| Practice | Things REST can't see (Enterprise Connect, reminders, Pulse…): the learner writes a short reflection. These are shown as self-reported, never as verified |

A hands-on or investigation mission is completed **only** when every step was seen on the server. If Content Server doesn't return something a step needs, that step shows *couldn't verify* with the exact call and HTTP answer, and the mission stays open (skip it if the feature isn't available to you). If Content Server can't be reached, the check reports that error — it never turns into a result.

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

## Connect it to your Content Server

The trainer does not start until you tell it which Content Server to use — there is no built-in default.

1. Copy `config.example.json` to `config.json`.
2. Set `contentServer.baseUrl` to the Content Server CGI/ISAPI URL, the same one you see in the browser before `?func=` in the Classic UI:
   - `http://localhost/otcs/cs.exe` (typical when running on the CS server)
   - `https://ecm.example.com/otcs/llisapi.dll` (IIS)
   - `http://ecm.example.com:8080/otcs/cs` (Tomcat)
3. If learners reach Content Server at a different address than the trainer does, set `contentServer.publicUrl` to the address their browsers use. It is only used for “Open in Smart View / Classic UI” links. (Not needed when Content Server runs on the same machine as the trainer — see [Sign in from other devices](#sign-in-from-other-devices).)
4. Start it:

```bash
node server.js
```

Instead of `config.json` you can pass the address on the command line (`node server.js --cs-url http://localhost/otcs/cs.exe`, also `start.bat --cs-url …`) or set `OTA_CS_URL`.

At start-up the trainer calls `GET /api/v1/serverinfo` and prints whether a Content Server REST API is answering at that address. A web page, a redirect to a login page or a refused connection is reported as such — the login page shows the same status, and nobody can sign in until it is fixed.

Learners open `http://<server>:8420` and sign in with their normal Content Server credentials (OTDS users included — sign-in goes through `/api/v1/auth`).

### Sign in from other devices

The trainer listens on every network interface (`"host": "0.0.0.0"`), so laptops, tablets and phones on the same network can use it. Each device signs in on its own; a learner who signs in on two devices sees the same progress on both.

1. Start it. The console lists the addresses other devices can use:

   ```
   CS Academy listening on http://localhost:8420
     Other devices on the network sign in at: http://XECM038:8420  http://192.168.1.20:8420
   ```

2. **Windows Firewall** blocks those devices until a rule lets them in. Run this once (Windows asks for administrator rights):

   ```bash
   start.bat allow-network
   ```

   It adds the inbound rule *CS Academy (TCP 8420)* for the configured port. If Windows had created rules that block `node.exe` (it does that when its “allow access?” prompt is cancelled — and a block rule beats any allow rule), it lists them and offers to disable them. While the rule is missing, the trainer says so when it starts.
3. On the other device, open one of the listed addresses. Use the IP address if the computer's name doesn't resolve there (phones usually can't resolve Windows computer names).

Links to Content Server follow the device: when Content Server runs on the same machine as the trainer (`baseUrl` is `localhost` or this computer's name or address), a device that opened `http://192.168.1.20:8420` gets links to `http://192.168.1.20/otcs/…`, so “Open in Smart View” works there too. Set `contentServer.publicUrl` to use one fixed address for everyone instead.

If the trainer runs in a virtual machine, other devices can only reach it when the VM's network adapter is bridged (or the host forwards port 8420 to it); with a NAT-only adapter only the host can.

Passwords travel in clear text over plain HTTP, so on a network you don't trust, [serve it over HTTPS](#https-recommended).

### Configuration

| Key | Default | Meaning |
|---|---|---|
| `port`, `host` | `8420`, `0.0.0.0` | Where the trainer listens. `0.0.0.0`: all network interfaces (other devices can sign in); `127.0.0.1`: this computer only |
| `contentServer.baseUrl` | *(required)* | Content Server URL used by the trainer. Never taken from `config.example.json` |
| `contentServer.publicUrl` | same as `baseUrl`, under the name each device used to reach the trainer when Content Server is on this machine | Content Server URL used in links shown to learners |
| `contentServer.allowSelfSignedCerts` | `false` | Accept a self-signed HTTPS certificate on Content Server |
| `contentServer.timeoutMs` | `20000` | Per-request timeout. In a mission check a call that takes longer is an error; in the platform scan and on the Connection page it is reported on its own row/area (as *unknown*), and the rest still runs |
| `sandboxName` | `OT Academy` | Name of the training folder each learner creates in their Personal Workspace |
| `scan.maxDepth` / `scan.maxNodes` | `2` / `1500` | How deep and how wide the platform scan goes |
| `scan.concurrency` | `4` | Parallel requests during a scan |
| `tls.keyFile` / `tls.certFile` | empty | Serve the trainer over HTTPS |
| `dataDir` | `./data` | Where learner progress is stored |
| `sessionHours` | `8` | Idle time before a trainer session expires |

Overrides: `--cs-url <url>` or `OTA_CS_URL` for `contentServer.baseUrl`, `OTA_PORT` for `port`.

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

- `data/progress/<server>/<userId>.json` per learner, in one folder per Content Server URL: mission results, XP, exam history, reflections, and the IDs of items the learner created for missions (so later missions can build on them). Node and user IDs only mean something on the server they came from, so progress is never carried over to another server.
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

Check kinds: `child`, `count`, `prop`, `versions`, `categories`, `permissions`, `favorite`, `gone`, `nickname`, `answer`, `nodeAnswer`, `groupExists`, `apiCount` — see `lib/verifier.js`. Every expected value is read live from Content Server (there are no answers from the stored scan). `saveAs` remembers the item found so later missions can refer to it (`parent: 'cdoc'`). Placeholders: `{{sandbox}}`, `{{user}}`, `{{category}}`, `{{group}}`, `{{csUrl}}`, `{{smartUrl}}`. The curriculum is validated at start-up, so a typo in a reference, a check kind or an answer source stops the server with a clear message.

Item types are matched by subtype number **or** type name, because optional modules use different subtype numbers on different installations. If a check misses an item type on your server, add the subtype you see in the Platform map to its `types` list.

## Tests

```bash
npm test
```

Runs an end-to-end test: the trainer in front of `test/mock-cs.js`, an in-memory imitation of the Content Server REST API that exists **only for the tests** (the trainer never starts it). Its endpoints, parameters, response shapes and error codes follow OpenText's published OpenAPI description of the v1/v2 API. The test plays the learner (creating folders, adding versions, granting permissions…) and asserts that each mission fails before the work and passes after it, that nothing unverifiable ever counts as done, that server errors and outages never pass a check, and that the trainer calls no endpoint the mock doesn't know. It also fails if the Internet Explorer build is out of date.

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

- The REST calls follow OpenText's published OpenAPI description of the Content Server v1/v2 API, and the automated tests run against a mock of it — not against a live installation. Some modules differ between installations (the per-item classifications endpoint, Extended ECM's business workspace types, subtype numbers). The first time you point the trainer at your server, open the **Connection** page: it shows each call and what your server answered, so a step that can't be verified there is visible immediately instead of being guessed.
- The scan samples the tree (`scan.maxDepth`, `scan.maxNodes`). On very large repositories, areas that only exist deep in the tree may show as *not detected*.

## Sources

Lesson topics follow the outlines of the OpenText courses *Managing Documents in Content Server 16.2* and *Collaborating in Content Server 16.2*, and the *Mastering OpenText Content Suite / Extended ECM* study plan. All lesson text, missions and questions in this app are original; the course workbooks are not included.
