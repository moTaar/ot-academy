# Writing content for CS Academy

Everything a learner reads in CS Academy is plain data in `curriculum/`. The server validates all of it at start-up
(`curriculum/index.js`, `curriculum/content.js`); a mistake stops it with a message naming the file and the item.
Check your work any time with:

```bash
node tools/check-content.js
```

It loads everything, prints the errors (if any), and then counts guides, questions and modules per exam domain.

| What | Where | Shown in |
|---|---|---|
| Certifications, exam domains, weights | `certifications.js` | Learning paths, exam simulator |
| Modules, lessons, missions | `track-*.js` | Curriculum, module and mission pages |
| Handbook guides (reference articles) | `guides/*.js` | Handbook, module pages, learning paths, search |
| Exam question bank | `questions/*.js` | Exam simulator, domain drills |
| Glossary | `glossary/*.js` | Glossary, search |
| Extra visuals for a module's lesson | `lesson-visuals.js` | Module page, under the lesson |

All text is **original**. Use the OpenText course manuals and documentation to learn what is true, then explain it in
your own words — never copy sentences, exercises or screenshots from them.

## Exam domains

Each certification in `certifications.js` has domains with ids such as `bu-workflows` (Business User),
`ba-transport` (Business Administrator), `sa-logging` (Administrator), `dev-rest` (Developer), `an-cis` (Analyst) and
`cp-change` (Cloud Practitioner). Guides, questions and modules point at these ids, which is how a learning path
knows what to study for each part of an exam.

## Guides

A guide is one reference article: how a feature works and how to do things with it, step by step, with visuals. A
learner should be able to open it at work and find the answer to “how do I…?”.

```js
module.exports = [
  {
    id: 'bu-permissions',                 // unique, kebab-case; prefix with your area
    title: 'Permissions and access control',
    area: 'user',                         // platform | user | collab | bizadmin | sysadmin | dev | analyst | cloud
    summary: 'What each permission allows, how inheritance works, and how to change who can do what.',
    level: 'basic',                       // basic | intermediate | advanced
    minutes: 10,                          // reading time
    domains: ['bu-permissions'],          // exam domains this prepares for
    modules: ['u10'],                     // modules whose lesson this deepens (optional)
    tags: ['acl', 'inheritance', 'owner'],
    related: ['bu-users-groups'],         // other guide ids (optional)
    sources: ['Managing Documents in Content Server 16.2 — Ch. 10'],
    order: 1,                             // optional: lower comes first within the area (default 50)
    body: [ /* blocks, see below */ ],
  },
];
```

### Blocks

`body` (and a module's `lesson`, and each tab's `body`) is a list of blocks:

| Block | Renders |
|---|---|
| `'Some text'` or `{ p: 'Some text' }` | Paragraph |
| `{ h: 'Heading' }` | Section heading (listed in the guide's table of contents) |
| `{ h3: 'Sub-heading' }` | Smaller heading |
| `{ ul: ['…', '…'] }` / `{ ol: [...] }` | Bulleted / numbered list |
| `{ steps: ['…', '…'], title: 'Add a document', ui: 'Smart View' }` | A procedure card with numbered steps |
| `{ tabs: [{ label: 'Smart View', body: [...] }, { label: 'Classic UI', body: [...] }] }` | Tabs (not nested) |
| `{ callout: 'tip', title: 'Optional', text: '…' }` | Box: `tip`, `note`, `warn`, `exam` (exam trap / what the exam asks), `remember` |
| `{ table: { head: ['A', 'B'], rows: [['1', '2']], caption: 'Optional' } }` | Table |
| `{ path: ['Enterprise', 'Users and Groups'], ui: 'Classic UI' }` | A menu path shown as breadcrumb chips |
| `{ code: '…', lang: 'sql', title: 'Optional' }` | Code: `oscript`, `sql`, `http`, `json`, `js`, `xml`, `html`, `weblingo`, `shell`, `text` |
| `{ figure: { type: …, … }, caption: '…' }` | A diagram, see below |

Inline text may use `**bold**`, `` `code` `` and `[[guide-id]]` or `[[guide-id|link text]]` to link another guide.
Write menu paths with ▸, e.g. “Functions ▸ Properties ▸ General”.

### Diagrams

Diagrams are drawn by the app from data, in both light and dark themes, so they need no image files. Labels are
short (2–5 words); put explanations in `sub` or in the text around the figure.

| `type` | Data | Use it for |
|---|---|---|
| `flow` | `steps: ['A', { label: 'B', sub: 'detail', kind: 'decision' }]`, optional `loop: 'Rejected → back to Draft'`, `vertical: true` | Processes, request paths, procedures. `kind`: `step` (default), `start`, `end`, `decision`, `actor`, `system` |
| `tree` | `root: { label, icon, note, children: [...] }` | Folder structures, group nesting, classification trees, volumes. `icon`: folder, doc, workspace, volume, group, user, category, workflow, project, shortcut, compound, email, record, classification, template, page, server, db, search, wiki, collection, form, report, module, hold |
| `layers` | `layers: [{ label, items: ['…'], note }]` (top first) | Architecture stacks, tiers |
| `matrix` | `cols: ['See', 'Modify'], rows: [{ label: 'Consumer', cells: [true, false] }]` | Permission grids, feature comparisons. A cell is `true` (✓), `false` (–) or short text |
| `compare` | `items: [{ title, points: ['…'], tone: 'info' }]` (2–4) | Side-by-side comparisons. `tone`: accent, info, xp, warn, pass, fail |
| `cycle` | `steps: ['…' or { label, sub }]` (3–10), optional `center` | Lifecycles (document, record, release) |
| `hub` | `center: '…', items: [...]` (3–10) | One concept and its parts |
| `ladder` | `steps: [{ label, sub }]` (2–10, lowest first) | Cumulative levels: permissions, privileges, maturity |
| `menu` | `title: 'Add Item', items: ['Folder', 'Document'], highlight: 'Document', note` | A UI menu or toolbar the learner should look for |
| `timeline` | `items: [{ when: 'Day 0', label, sub }]` | Retention periods, release plans |
| `lanes` | `lanes: [{ label: 'Author', cells: ['Draft', '', 'Revise'] }, { label: 'Reviewer', cells: ['', 'Review', ''] }]` | Swimlanes: who does which step (columns are time) |

Aim for at least one figure per guide, and more where a picture explains faster than prose.

## Question bank

Questions are grouped by exam domain and drawn into exam simulations in proportion to the domain weights.

```js
module.exports = [
  {
    id: 'bu-q-workflows-001',            // unique
    domain: 'bu-workflows',
    q: 'Which statement about workflow delegates is true?',
    options: ['…', '…', '…', '…'],
    answer: 2,                           // index into options
    explain: 'Why the right answer is right — and why a tempting wrong one is wrong.',
    guide: 'bu-workflows',               // optional: guide to read when this is missed
  },
  {
    id: 'bu-q-workflows-002', domain: 'bu-workflows',
    q: 'Which two actions can a workflow manager take on a running workflow? (Choose two.)',
    options: ['…', '…', '…', '…'],
    answer: [0, 3],                      // several correct answers: the question says how many
    explain: '…',
  },
];
```

Write questions the way the real exams do: scenarios (“A user needs to… what should they do?”), “which is NOT…”,
and multiple-response questions where the outline says the exam uses them. Avoid “all of the above”. Every
explanation teaches something.

## Glossary

```js
module.exports = [
  { term: 'Category', def: 'A named set of custom attributes that can be applied to items…', area: 'user', guide: 'bu-categories' },
];
```

Terms are unique across all glossary files (case-insensitive).

## Modules and missions

See the main README (“Tailoring the curriculum”). New modules may also list `domains: ['ba-transport']`, and their
`lesson` may use any of the blocks above. Module knowledge checks take exactly one correct answer per question.
