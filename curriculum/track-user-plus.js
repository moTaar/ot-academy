'use strict';
// Business User (5-0158) modules that fill gaps in the original course
// outline: wikis and collections, Intelligent Viewing, perspectives and
// landing pages, business workspaces for business users, and notifications,
// delegates and activity feeds. Learned from the OpenText course manuals and
// documentation; all lesson text, missions and questions are original.

const MANAGING = 'Managing Documents in Content Server 16.2';
const COLLAB = 'Collaborating in Content Server 16.2';

module.exports = [
  // ------------------------------------------------------------------ U15
  {
    id: 'u15', track: 'collab', title: 'Wikis', source: `${COLLAB} — Ch. 7 & 10`, feature: 'wikis',
    domains: ['bu-wikis'],
    summary: 'Build team knowledge pages: wiki structure, pages, sidebars, links, history — and when a collection fits better.',
    lesson: [
      'A wiki is a special container that holds a set of related web pages. Anyone with enough permission can add a page, change it, or even rewrite text a colleague wrote — changes are published the moment they are saved. That makes a wiki ideal for living knowledge: how-tos, onboarding notes, a glossary for a product team.',
      'Because a wiki is an ordinary Content Server item, it keeps the platform’s guarantees: its pages are access-controlled, versioned, audited and full-text searchable. You place a wiki in a folder, project or workspace like any other item, and it inherits that container’s permissions.',
      {
        figure: {
          type: 'tree',
          root: {
            label: 'Process Wiki', icon: 'wiki', note: 'the container',
            children: [
              { label: 'Main page', icon: 'page', note: 'opens first (Classic: Index page)' },
              { label: 'Onboarding', icon: 'page', note: 'wiki page' },
              { label: 'Expense rules', icon: 'page', note: 'wiki page' },
              { label: 'Sidebar: Contacts', icon: 'page', note: 'shown beside every page' },
              { label: 'Overview', icon: 'page', note: 'generated list of pages' },
            ],
          },
        },
        caption: 'Anatomy of a wiki: one container, many interlinked pages, optional sidebars.',
      },
      { h: 'Building a wiki' },
      'You create the wiki container first, then add pages inside it. Pages are written in a rich-text (HTML) editor: headings, bold, lists, tables, images and links. Two kinds of link matter: **web links** go to outside URLs, while **wiki links** point to another page of the wiki or to any Content Server item. Anchors let you jump within one page.',
      {
        tabs: [
          { label: 'Smart View', body: [
            { steps: ['Open the folder ▸ “+” (Add) ▸ Wiki, name it and add it.', 'Open the wiki and choose Add page; type a page name.', 'Write the content in the editor and Save.', 'From the wiki’s action bar: Add new ▸ Wiki sidebar to add a sidebar; Go to ▸ Wiki overview for the page list; Page history for versions.', 'On a page’s menu, Set as Main page decides which page opens first.'], title: 'Create a wiki and its pages', ui: 'Smart View' },
          ] },
          { label: 'Classic UI', body: [
            { steps: ['In the folder: Add Item ▸ Wiki, give a name and description, Add.', 'Open the wiki; in the wiki sidebar click Add Wiki Page.', 'Name the page; tick “This is the index page” for the first one.', 'Write the content and Save.', 'Use Settings in the wiki sidebar to customise sidebars.'], title: 'Create a wiki and its pages', ui: 'Classic UI' },
          ] },
        ],
      },
      { h: 'What opens when you click a wiki?' },
      {
        figure: {
          type: 'flow',
          steps: [
            { label: 'Open wiki', kind: 'start' },
            { label: 'Main page set?', kind: 'decision' },
            { label: 'Only one page?', sub: 'then that page opens', kind: 'decision' },
            { label: 'Overview page', sub: 'pages A–Z', kind: 'end' },
          ],
        },
        caption: 'Smart View opens the Main page if one is set, the single page if there is only one, otherwise the generated Overview.',
      },
      'Every save creates a new version of the page. The **page history** lists those versions so you can see who changed what and when, and open an older version if a change needs to be undone. Pages also offer “what links here” and “where I link to” views (Classic UI), which help you find orphaned pages that nothing links to.',
      { callout: 'warn', title: 'Links never grant access', text: 'A wiki link to a Content Server item only works for readers who already have permission on that item. Everyone else gets an error — check the target’s permissions before you link to it.' },
      { h: 'Wiki or collection?' },
      'The exam domain pairs wikis with collections because both help a team gather knowledge, but they solve different problems. A wiki holds content written in place. A collection holds references to items that live elsewhere, so a team can view or act on them together — and a collection can include other collections.',
      {
        figure: {
          type: 'compare',
          items: [
            { title: 'Wiki', tone: 'accent', points: ['Pages written in the browser', 'Content lives inside the wiki', 'Versioned pages with history', 'Best for how-tos and living knowledge'] },
            { title: 'Collection', tone: 'info', points: ['References to existing items', 'Items stay in their own folders', 'Can hold other collections', 'Best for gathering and bulk actions'] },
          ],
        },
        caption: 'Write it once in a wiki; point to it from many places with a collection.',
      },
      { callout: 'exam', text: 'Removing an item from a collection does **not** delete the item — only the reference goes. Deleting a wiki page, however, deletes real content (it goes to the Recycle Bin).' },
    ],
    keyPoints: [
      'A wiki is a container of interlinked, versioned web pages with Content Server permissions, audit and search.',
      'Smart View opens the Main page, the single page, or the generated Overview — in that order.',
      'Sidebars appear beside every page of a wiki; page history shows every saved version.',
      'Wiki links to items respect permissions: readers need access to the target.',
      'Choose a wiki for content written in place, a collection for references gathered from anywhere.',
    ],
    missions: [
      {
        id: 'u15-wiki', type: 'hands-on', title: 'Create a process wiki with two pages', requires: ['u01-sandbox'], feature: 'wikis',
        brief: 'A small wiki is the quickest way to share team know-how. Give it at least two pages so it has something to link.',
        steps: [
          'In “{{sandbox}}”: Smart View “+” ▸ Wiki (Classic: Add Item ▸ Wiki).',
          'Name it exactly “Process Wiki”.',
          'Add two pages, for example “Onboarding” and “Expense rules”, each with a few lines of text.',
          'On “Onboarding”, add a wiki link to “Expense rules”.',
        ],
        hints: ['If Wiki is not in the Add menu, the Wiki module is not installed or not allowed in that folder.'],
        checks: [
          { kind: 'child', parent: 'sandbox', name: 'Process Wiki', types: [5573], typeName: 'wiki', saveAs: 'processWiki', label: 'Wiki “Process Wiki” in “{{sandbox}}”' },
          { kind: 'count', parent: 'processWiki', min: 2, label: 'At least two pages in “Process Wiki”' },
        ],
        open: 'sandbox',
      },
      {
        id: 'u15-sidebar-history', type: 'practice', title: 'Add a sidebar and read the history', requires: ['u15-wiki'],
        steps: [
          'Open “Process Wiki” in Smart View and add a wiki sidebar titled “Contacts” with two names.',
          'Set “Onboarding” as the Main page and reopen the wiki to see which page appears.',
          'Edit “Onboarding” twice, then open its Page history and compare the versions.',
        ],
        reflection: 'Which page opened before and after you set the Main page, and what does the page history tell you about each change?',
      },
      {
        id: 'u15-collection', type: 'practice', title: 'Choose between a wiki and a collection', requires: ['u01-sandbox'],
        steps: [
          'Open your “Reading List” collection (or create a collection in “{{sandbox}}”).',
          'Collect two documents that live in different folders, then remove one from the collection.',
          'Check that the removed document still exists in its folder.',
        ],
        reflection: 'Describe one team need that a wiki answers better and one that a collection answers better, and explain why.',
      },
      {
        id: 'u15-quiz', type: 'quiz', title: 'Knowledge check: wikis and collections',
        questions: [
          { q: 'A wiki has no Main page set and contains three pages. What does Smart View show when the wiki is opened?', options: ['The newest page', 'The Overview page listing the pages', 'The first page alphabetically', 'The wiki’s Properties page'], answer: 1, explain: 'Without a Main page, and with zero or several pages, Smart View opens the generated Overview. With exactly one page, that page opens.' },
          { q: 'What is a wiki sidebar?', options: ['A private note visible only to its author', 'A block of content shown beside the pages of the wiki', 'The list of page versions', 'A link to the parent folder'], answer: 1, explain: 'Sidebars hold content such as contacts or links and appear beside the wiki’s pages; a wiki can have several.' },
          { q: 'A page links to a document the reader has no permission on. What happens when the reader clicks the link?', options: ['The document opens read-only', 'They get an error — links never bypass permissions', 'The wiki owner’s rights are used', 'A copy is made for the reader'], answer: 1, explain: 'Wiki links respect the target item’s ACL like any other link.' },
          { q: 'Where do you see every change saved to a wiki page?', options: ['In the Recycle Bin', 'In the page history (versions)', 'Only in the audit log of the folder', 'In the wiki sidebar'], answer: 1, explain: 'Each save creates a version; Page history lists them.' },
          { q: 'What is the Classic UI name for the Smart View “Main page”?', options: ['Home page', 'Index page', 'Landing page', 'Overview'], answer: 1, explain: 'Classic UI calls the page that opens first the Index page; Smart View calls it the Main page.' },
          { q: 'A team wants one place that gathers 20 existing contracts stored in several folders, without copying them. What fits best?', options: ['A wiki with one page per contract', 'A collection', 'A compound document', 'A new folder with copies'], answer: 1, explain: 'A collection holds references to items that stay where they are.' },
          { q: 'You remove a document from a collection. What happens to the document?', options: ['It is deleted', 'It moves to the Recycle Bin', 'Nothing — only the reference is removed', 'It is reserved'], answer: 2, explain: 'Collections hold references; removing one leaves the original untouched.' },
          { q: 'Which statement about wikis is true?', options: ['Wiki pages cannot be searched', 'Only the wiki’s creator can edit its pages', 'Wiki pages are versioned, permission-controlled and searchable like other items', 'A wiki can only be created in a community'], answer: 2, explain: 'Wikis keep the Content Server guarantees: access control, versions, audit and full-text search, and can be created in any container where you may add them.' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ U16
  {
    id: 'u16', track: 'collab', title: 'Intelligent Viewing: markup, annotation, redaction', source: 'OpenText documentation — Intelligent Viewing',
    domains: ['bu-viewing'],
    summary: 'View documents in the browser, mark them up, discuss markups and redact sensitive content — and know what “burned in” means.',
    lesson: [
      'Intelligent Viewing is OpenText’s browser-based viewer. It shows documents, images and drawings in the page without the native application and without a download, so a reviewer can look at a Word file, a PDF or a CAD drawing from any device. Where it is installed, opening a document in Smart View usually opens it in Intelligent Viewing.',
      'Behind the scenes the server prepares a viewable rendition of the file. The original document is never changed by viewing it — and, importantly, not by marking it up either.',
      {
        figure: {
          type: 'layers',
          layers: [
            { label: 'Markup layer', items: ['Annotations', 'Comments and replies', 'Redactions'], note: 'stored separately, linked to the version' },
            { label: 'Viewable rendition', items: ['Prepared by the viewing service'] },
            { label: 'Original document', items: ['Unchanged in Content Server'] },
          ],
        },
        caption: 'Markups sit on top of the document like a transparent sheet. The original file underneath stays as it was.',
      },
      { h: 'Markups and annotations' },
      'Markup tools let reviewers draw attention to things: highlight text, draw arrows, rectangles or freehand lines, add text boxes, stamps (for example “Approved”) and sticky notes. Each markup records its author and time, and you can filter the markup list by author, type or visibility. Reviewers can attach **comments** to a markup and others can **reply**, so the discussion stays pinned to the exact spot on the page.',
      {
        figure: { type: 'menu', title: 'Markup toolbar', items: ['Highlight', 'Text', 'Shapes', 'Freehand', 'Stamp', 'Sticky note', 'Redact'], highlight: 'Redact', note: 'Available tools depend on your permissions and configuration.' },
        caption: 'Typical Intelligent Viewing markup tools. Redaction is the one with security consequences.',
      },
      {
        steps: ['Open the document in Intelligent Viewing (Smart View: click the document or choose View).', 'Choose a markup tool and draw on the page.', 'Open the markup’s comment panel and type a comment; colleagues can reply.', 'Save the markups so others see them the next time they open the document.'],
        title: 'Mark up and comment', ui: 'Intelligent Viewing',
      },
      { h: 'Redaction' },
      'A redaction hides sensitive content — a salary, a personal ID number, a client name — behind a solid box. You can redact by drawing an area, or by searching for text (and patterns) and redacting every hit. Many organisations require a **reason code** for each redaction so readers know why something is hidden.',
      'While redactions are only markups, they are a layer: someone with enough rights can still see or remove them, and the original file still contains the text. To share a document safely you **publish** or export it with the markups **burned in**. Burning in flattens markups into a new output file (typically a PDF): the hidden text is really gone from that copy and cannot be lifted off.',
      {
        figure: {
          type: 'compare',
          items: [
            { title: 'Markup (layer)', tone: 'info', points: ['Stored apart from the file', 'Can be edited, hidden or deleted', 'Original still contains everything', 'Fine for internal review'] },
            { title: 'Burned in (published)', tone: 'warn', points: ['Flattened into a new output file', 'Cannot be removed from that file', 'Redacted text is gone from the copy', 'Use before sharing outside'] },
          ],
        },
        caption: 'A redaction only protects information once it has been burned into the copy you share.',
      },
      {
        figure: {
          type: 'flow',
          steps: [
            { label: 'Open in viewer', kind: 'start' },
            { label: 'Redact', sub: 'area or text search' },
            { label: 'Add reason', sub: 'if required' },
            { label: 'Review markups' },
            { label: 'Publish with burn-in', sub: 'new PDF', kind: 'end' },
          ],
        },
        caption: 'The safe redaction workflow.',
      },
      { callout: 'exam', title: 'Security implication', text: 'Sending the **original** document after drawing redactions on it exposes everything underneath. Only the burned-in, published output is safe to share. Also remember that whoever can download the original can bypass the viewer entirely — protect the original with permissions.' },
      { callout: 'tip', text: 'Keep the original and the redacted publication as separate items (or a rendition) and give external readers access only to the redacted one.' },
    ],
    keyPoints: [
      'Intelligent Viewing shows documents in the browser without the native application or a download.',
      'Markups, comments and redactions are stored as a layer; the original document is not modified.',
      'Comments and replies on a markup keep the review discussion pinned to the exact spot.',
      'Redact by area or by text search; add reasons where your organisation requires them.',
      'Only a burned-in (published) output removes redacted content for good — never share the original.',
    ],
    missions: [
      {
        id: 'u16-markup', type: 'practice', title: 'Review a document with markups', requires: ['u02-upload'],
        steps: [
          'Open “Project Plan” in Smart View so it shows in Intelligent Viewing (if your server has it).',
          'Add a highlight, an arrow and a sticky note.',
          'Add a comment to one markup, then reply to your own comment.',
          'Save, close the viewer, reopen the document and confirm the markups are still there.',
        ],
        reflection: 'Which markup tools did you use, and where are the markups stored compared with the document itself?',
      },
      {
        id: 'u16-redact', type: 'practice', title: 'Redact and publish safely', requires: ['u02-upload'],
        steps: [
          'In Intelligent Viewing, redact one word by text search and one area by drawing.',
          'Add a reason to each redaction if the viewer offers reason codes.',
          'Publish or export the document with markups burned in, and open the output file.',
          'Try to select the redacted text in the output.',
        ],
        reflection: 'Explain the difference between the redaction you drew in the viewer and the one in the published file, and which one you would send to an external lawyer.',
      },
      {
        id: 'u16-quiz', type: 'quiz', title: 'Knowledge check: Intelligent Viewing',
        questions: [
          { q: 'What is a key benefit of Intelligent Viewing for a reviewer?', options: ['It converts every document to Word', 'They can view and mark up many formats in the browser without the native application', 'It removes the need for permissions', 'It automatically approves documents'], answer: 1, explain: 'The viewer renders documents, images and drawings in the browser, so no native application or download is needed.' },
          { q: 'You draw an arrow and a text box on a PDF in Intelligent Viewing and save. What happens to the PDF file stored in Content Server?', options: ['It is overwritten with the markups', 'A new major version is added automatically', 'It is unchanged — the markups are stored as a separate layer', 'It is reserved to you'], answer: 2, explain: 'Markups are kept apart from the document and linked to it; the original file is not modified.' },
          { q: 'A colleague wants to answer your question about one paragraph without starting an email thread. What should they do?', options: ['Add a new version', 'Reply to the comment on your markup', 'Create a wiki page', 'Delete your markup and draw a new one'], answer: 1, explain: 'Comments and replies on a markup keep the discussion attached to the exact place in the document.' },
          { q: 'Which statement about a redaction drawn in the viewer but not yet burned in is true?', options: ['The text is permanently removed from the original', 'It is a markup layer — the original still contains the text', 'It cannot be seen by anyone', 'It deletes the document’s older versions'], answer: 1, explain: 'Until it is burned into a published output, a redaction is just a layer over the unchanged original.' },
          { q: 'What does “burned in” mean?', options: ['The markups are printed on paper', 'The markups are flattened into a new output file so they can no longer be removed from it', 'The markups are hidden from other users', 'The document is moved to the Recycle Bin'], answer: 1, explain: 'Burning in merges markups and redactions into the published output (typically PDF).' },
          { q: 'You must send a contract with the client’s bank details hidden to an external party. What is the safe approach?', options: ['Draw a redaction and email the original file', 'Redact, then publish a burned-in PDF and share only that output', 'Add a sticky note saying “confidential”', 'Rename the document'], answer: 1, explain: 'Only the burned-in publication truly removes the hidden content; the original still contains it.' },
          { q: 'Which two ways of redacting does the viewer typically offer?', options: ['By version and by owner', 'By drawing an area and by searching for text', 'By category and by classification', 'By email and by link'], answer: 1, explain: 'You can redact a region manually, or find text (including patterns) and redact every hit.' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ U17
  {
    id: 'u17', track: 'collab', title: 'Perspectives and department landing pages', source: `${MANAGING} — Ch. 13; ${COLLAB} — Ch. 9; OpenText documentation (Perspectives)`,
    domains: ['bu-perspectives'],
    summary: 'What perspectives are, global versus local, layouts and widgets, and how to build a department landing page with HTML Tile and Activity Feed widgets.',
    lesson: [
      'In Smart View, what you see on a page is decided by a **perspective**: a saved arrangement of tiles (widgets) and the rules that say who gets it. Perspectives are the Smart View successor to ActiveView in the Classic UI. They change how a page looks and what it offers — never what you are allowed to do: every widget still respects permissions.',
      {
        figure: {
          type: 'compare',
          items: [
            { title: 'Landing page', tone: 'accent', points: ['The Home page after sign-in', 'Usually chosen by role or group', 'Favorites, assignments, recent items, news'] },
            { title: 'Container', tone: 'info', points: ['Shown when you open a folder-like item', 'Turns a folder into a department page', 'Can apply to sub-folders too'] },
            { title: 'Workspace', tone: 'xp', points: ['Layout of a business workspace', 'Header, team, metadata, documents', 'Set per workspace type'] },
          ],
        },
        caption: 'The three perspective types a business user meets.',
      },
      { h: 'Global and local perspectives' },
      'A **global** perspective is defined centrally (in Perspective Manager) and applied by rules — for example “members of the Sales group get this landing page” or “folders with this category get this layout”. When several global perspectives match, their order decides which one wins. A **local** perspective is attached to one container, typically by editing the page in place; it can be set to cover the container’s sub-items as well.',
      {
        figure: {
          type: 'flow',
          steps: [
            { label: 'Open a container', kind: 'start' },
            { label: 'Local perspective?', kind: 'decision' },
            { label: 'First matching global rule?', sub: 'in order', kind: 'decision' },
            { label: 'Default browse view', kind: 'end' },
          ],
        },
        caption: 'How Smart View decides which perspective to show.',
      },
      { h: 'Layouts and widgets' },
      'A perspective has a **layout** — for example a flowing grid of tiles, a left–centre–right arrangement, or tabs — and **widgets** placed into it. Common widgets include Favorites, Recently Accessed, My Assignments, a node browsing list, shortcut tiles, a header or hero banner, the **HTML Tile** (rich text, images and links you write yourself) and the **Activity Feed** (Pulse posts for a location).',
      {
        figure: {
          type: 'layers',
          layers: [
            { label: 'Header', items: ['Hero banner: “Finance Department”'] },
            { label: 'Row 1', items: ['HTML Tile: welcome and key links', 'Activity Feed: Finance folder'] },
            { label: 'Row 2', items: ['Shortcut tiles: Policies, Templates', 'Node browsing: Month-end folder'] },
          ],
        },
        caption: 'A department landing page built from widgets.',
      },
      {
        steps: [
          'Open the department folder in Smart View.',
          'Choose Edit page (the pencil) to edit the perspective in place, and pick a layout.',
          'Drag an HTML Tile in and write a welcome message with links.',
          'Add an Activity Feed widget scoped to the folder and choose which updates it shows.',
          'Add shortcut tiles to the most used sub-folders, then save.',
        ],
        title: 'Build a department landing page', ui: 'Smart View',
      },
      { h: 'Activity Feed and Pulse' },
      'The Activity Feed widget shows Pulse activity: content updates (items added or changed), status updates and comments. It only works when Pulse is enabled, and its **filters** let readers narrow the feed to the kind of post they care about. As everywhere, a reader only sees posts about items they have permission to see.',
      { callout: 'exam', title: 'Who may edit a perspective?', text: 'Editing a perspective is a controlled ability. Users need a usage privilege for perspective editing granted by an administrator, **and** enough permission on what they edit — the container for a local perspective, or the perspective item itself for a global one. Ordinary users can at most personalise their own Home page, where the version allows it.' },
      { callout: 'tip', text: 'Keep landing pages short: one welcome tile, one feed, a handful of shortcuts. A page that needs scrolling to find the main folder has failed.' },
    ],
    keyPoints: [
      'Perspectives decide the layout and widgets of a Smart View page; permissions still decide what you can open.',
      'Types: landing page (Home), container (folder-like items) and workspace (business workspaces).',
      'Global perspectives are rule-based and ordered; a local perspective belongs to one container.',
      'HTML Tile = your own rich content; Activity Feed = Pulse posts, needs Pulse enabled, has filters.',
      'Editing a perspective needs a privilege plus permission on the container or perspective item.',
    ],
    missions: [
      {
        id: 'u17-read-perspective', type: 'practice', title: 'Read your landing page',
        steps: [
          'Open Smart View ({{smartUrl}}) and look at your Home page.',
          'Name each widget you see and what it shows.',
          'Open a folder that looks different from a plain list, if your organisation has one, and compare.',
        ],
        reflection: 'List the widgets on your Home page, and say whether the folder you opened uses a container perspective or the default view — how could you tell?',
      },
      {
        id: 'u17-design', type: 'practice', title: 'Design a department landing page', requires: ['u01-sandbox'],
        steps: [
          'If you have the privilege, open “{{sandbox}}” in Smart View and choose Edit page; otherwise sketch the page on paper.',
          'Add an HTML Tile with a welcome line and two links, an Activity Feed scoped to the folder, and shortcut tiles to “01 Drafts” and “03 Final”.',
          'Save, view the page, and switch the Activity Feed filter between content and status updates.',
        ],
        reflection: 'Describe your layout widget by widget, say who should see it (rule or local), and name the privilege and permission needed to edit it.',
        minWords: 25,
      },
      {
        id: 'u17-quiz', type: 'quiz', title: 'Knowledge check: perspectives',
        questions: [
          { q: 'Which perspective type controls what a user sees right after signing in to Smart View?', options: ['Container', 'Landing page', 'Workspace', 'Search'], answer: 1, explain: 'The landing page perspective is the Home page; container perspectives apply when a folder-like item is opened.' },
          { q: 'The Finance folder should show a welcome text, a news feed and shortcuts whenever someone opens it. What do you configure?', options: ['A landing page perspective for the Finance group', 'A container perspective on the Finance folder', 'An appearance in the Appearances volume', 'A category on the folder'], answer: 1, explain: 'A container perspective (often local to that folder) changes what the folder shows when opened.' },
          { q: 'What is the difference between a global and a local perspective?', options: ['Global ones are for Classic UI only', 'Global perspectives are applied by rules in a set order; a local perspective is attached to one container', 'Local perspectives apply to the whole system', 'There is none'], answer: 1, explain: 'Global perspectives live centrally with rules and ordering; local ones belong to a specific container.' },
          { q: 'Which widget lets you place your own formatted text, images and links on a landing page?', options: ['Activity Feed', 'HTML Tile', 'Recently Accessed', 'My Assignments'], answer: 1, explain: 'The HTML Tile holds rich content you write yourself.' },
          { q: 'The Activity Feed widget on a department page stays empty although people comment on documents. What is the most likely cause?', options: ['The folder has no category', 'Pulse is not enabled', 'The widget only shows workflow steps', 'Comments are never shown in feeds'], answer: 1, explain: 'The Activity Feed shows Pulse activity, so Pulse must be enabled.' },
          { q: 'A user can see an Activity Feed post about a document only if…', options: ['they follow the poster', 'they have permission to see that document', 'they are in DefaultGroup', 'they created the perspective'], answer: 1, explain: 'Feeds respect item permissions (and privacy settings for status posts).' },
          { q: 'What does a user need to edit a local perspective on a folder?', options: ['Nothing — any user can', 'Only See Contents on the folder', 'The perspective-editing usage privilege and sufficient permission on the folder', 'System Administration rights only'], answer: 2, explain: 'Perspective editing is privilege-controlled and also requires adequate permission on the container being edited.' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ U18
  {
    id: 'u18', track: 'user', title: 'Business workspaces for business users', source: `${COLLAB} — App. C; OpenText documentation (Business Workspaces)`,
    feature: 'businessWorkspaces', domains: ['bu-content', 'bu-collab'],
    summary: 'Find, open and work inside business workspaces: header, tabs, team roles, documents, related workspaces, workflows and reminders.',
    lesson: [
      'A business workspace gathers everything about one business object — a customer, a contract, a supplier, an employee — in one place: its documents, its people, its tasks and its key data. In Extended ECM the workspace is also linked to the object in a business application such as SAP or Salesforce, so users reach the same workspace from either side.',
      'As a business user you rarely build workspaces; administrators define workspace types and templates. Your job is to find the right workspace, file content in it correctly, work with the team and keep its processes moving.',
      {
        figure: {
          type: 'layers',
          layers: [
            { label: 'Header', items: ['Name and icon', 'Key metadata (e.g. customer number)', 'Favorite star, comments'] },
            { label: 'Overview tab', items: ['Team', 'Metadata', 'Related workspaces', 'Activity feed', 'Recently accessed'] },
            { label: 'Documents tab', items: ['Folder structure from the template', 'Upload, drag-and-drop, document types'] },
          ],
        },
        caption: 'A business workspace in Smart View. The exact tiles come from the workspace perspective.',
      },
      { h: 'Finding and opening workspaces' },
      'Workspaces appear in a Business Workspaces widget on your landing page, in search results (you can search by workspace type and by its metadata), in your Favorites and Recently Accessed lists, and through related workspaces. From the business application, a button or tab opens the linked workspace directly.',
      { h: 'Team and roles' },
      'Every workspace has a team made of **roles** — for example Account Manager, Sales, Legal — each holding members and its own permissions on the workspace content. One role is typically the **workspace lead**, who can maintain the team. Adding a person to a role is how you grant them access; you do not edit ACLs folder by folder.',
      {
        figure: {
          type: 'matrix',
          cols: ['View documents', 'Add documents', 'Manage team', 'Delete items'],
          rows: [
            { label: 'Lead (e.g. Account Manager)', cells: [true, true, true, true] },
            { label: 'Member (e.g. Sales)', cells: [true, true, false, false] },
            { label: 'Read-only (e.g. Finance)', cells: [true, false, false, false] },
          ],
        },
        caption: 'An example of workspace roles. Real roles and rights come from the template your administrator designed.',
      },
      { h: 'Working with content' },
      'The Documents tab shows the folder structure the template created, so every customer workspace looks the same. Add documents by upload or drag-and-drop; where document types (classifications) are configured you pick one, and the workspace may show which expected documents are still missing. Workspaces can also contain other workspaces or link to **related workspaces** — a customer to its contracts and orders — shown in a tile so you can move between them.',
      {
        figure: {
          type: 'tree',
          root: {
            label: 'Customer: Northwind', icon: 'workspace',
            children: [
              { label: '01 Contracts', icon: 'folder' },
              { label: '02 Correspondence', icon: 'folder', children: [{ label: 'Email folder', icon: 'email' }] },
              { label: '03 Invoices', icon: 'folder' },
              { label: 'Related: Contract C-1001', icon: 'workspace', note: 'its own workspace' },
              { label: 'Related: Order 55021', icon: 'workspace' },
            ],
          },
        },
        caption: 'Same template, same structure for every customer — plus links to related workspaces.',
      },
      {
        steps: ['Open the workspace (search, widget or Favorites).', 'Check the header and the Team tile so you know who is involved.', 'Go to the Documents tab and open the right folder.', 'Drag your file in and choose the document type if asked.', 'If the document needs approval, select it and start the workflow from the workspace.', 'Add a reminder to the workspace for the follow-up date.'],
        title: 'A typical day in a workspace', ui: 'Smart View',
      },
      { callout: 'note', text: 'Workflows can be started from a document or from the workspace itself, and reminders and notifications can be set on the workspace — handy for “renew this contract in 60 days”.' },
      { callout: 'exam', text: 'Access to workspace content is granted by adding people to **roles** in the Team, not by editing permissions on individual folders. Moving a workspace does not change its roles and participants.' },
    ],
    keyPoints: [
      'One business object, one workspace — reachable from Content Server and from the linked business application.',
      'The header, Overview tiles and Documents tab are defined by the workspace type, template and perspective.',
      'Team roles carry the permissions; the workspace lead maintains membership.',
      'Related workspaces link objects such as a customer and its orders.',
      'Start workflows and set reminders directly on workspaces and their documents.',
    ],
    missions: [
      {
        id: 'u18-explore', type: 'practice', title: 'Explore a business workspace', feature: 'businessWorkspaces',
        steps: [
          'In Smart View, find a business workspace you can open (search by its type or use the Business Workspaces widget).',
          'Identify the header, the Overview tiles and the Documents tab.',
          'Open the Team tile and note the roles and who leads the workspace.',
          'Follow one related workspace and come back.',
        ],
        reflection: 'Which business object is this workspace about, which roles are in its team, and what is the related workspace?',
      },
      {
        id: 'u18-work', type: 'practice', title: 'File and follow up in a workspace', feature: 'businessWorkspaces',
        steps: [
          'In a workspace where you may add content, upload a test document into the right folder and pick a document type if asked.',
          'Add a reminder on the workspace for next week.',
          'If a workflow is available, start it on your document from inside the workspace.',
        ],
        reflection: 'Where did the document land, which document type did you choose, and how will the team know about the follow-up?',
      },
      {
        id: 'u18-quiz', type: 'quiz', title: 'Knowledge check: business workspaces',
        questions: [
          { q: 'What does a business workspace represent?', options: ['A user’s private area', 'Everything about one business object, such as a customer or contract', 'A search index partition', 'A workflow map'], answer: 1, explain: 'A business workspace gathers documents, people, tasks and data for one business object.' },
          { q: 'A new colleague needs to read the documents of a customer workspace. What is the right way to give access?', options: ['Edit the permissions of each folder', 'Add the colleague to the appropriate role in the workspace team', 'Send them copies by email', 'Give them System Administration rights'], answer: 1, explain: 'Roles in the team carry the permissions on workspace content.' },
          { q: 'Why do all customer workspaces have the same folder structure?', options: ['Users copy it by hand', 'They are created from the same workspace template', 'Smart View forces it', 'Because of the Recycle Bin settings'], answer: 1, explain: 'Workspace types and templates define structure, categories and roles.' },
          { q: 'How do you move from a customer workspace to one of its orders?', options: ['Through the Recycle Bin', 'Through the related workspaces tile', 'By searching the audit log', 'It is not possible'], answer: 1, explain: 'Related workspaces link business objects to each other.' },
          { q: 'Which part of a workspace typically shows its key business data, such as the customer number?', options: ['The header and Metadata tile', 'The Recycle Bin', 'The notification report', 'The Admin pages'], answer: 0, explain: 'The header and Metadata tile surface the workspace attributes.' },
          { q: 'A contract must be renewed in 60 days. What helps the team not to forget?', options: ['A reminder on the workspace or contract', 'A new folder', 'Renaming the workspace', 'A version limit'], answer: 0, explain: 'Reminders can be set on workspaces and documents and alert the assignees when due.' },
          { q: 'Which statement is true for a business user?', options: ['Business users design workspace templates', 'Business users find, use and collaborate in workspaces that administrators configure', 'Workspaces cannot contain documents', 'Workflows cannot be started from a workspace'], answer: 1, explain: 'Templates and types are configured by administrators; business users work inside the workspaces.' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ U19
  {
    id: 'u19', track: 'collab', title: 'Notifications, delegates and activity feeds', source: `${MANAGING} — Ch. 12; ${COLLAB} — Ch. 2, 5 & 6`,
    domains: ['bu-reminders', 'bu-workflows'],
    summary: 'Stay informed without drowning: notification reports and interests, workflow notifications, delegating and covering absences, and activity feeds.',
    lesson: [
      'Content Server has several ways of telling you that something happened. Knowing which one to use — and which one your colleagues use — decides whether important events reach the right person in time.',
      {
        figure: {
          type: 'hub', center: 'Staying informed',
          items: ['Notification reports (email digests)', 'Workflow notifications', 'Reminders', 'Pulse / activity feeds', 'Smart View alerts', 'Assignments list'],
        },
        caption: 'Channels for news about your content and work.',
      },
      { h: 'Notification reports' },
      'Classic notification works with up to three **reports**, each with its own schedule and delivery (shown on the page, sent by email, plain text or HTML). You then choose **interests**: general interests are event types anywhere in the system, while specific interests are set on one item with Set Notification. An administrator must have enabled notification, and can give a department group default general interests that new members receive.',
      {
        figure: {
          type: 'matrix',
          cols: ['Report 1 (Hourly)', 'Report 2 (Daily)', 'Report 3 (Weekly)'],
          rows: [
            { label: 'A workflow step arrives for me', cells: [true, false, false] },
            { label: 'My workflow step is late', cells: [true, false, false] },
            { label: 'Item added to Contracts folder', cells: [false, true, false] },
            { label: 'New version in my project', cells: [false, false, true] },
          ],
        },
        caption: 'Route urgent events to a frequent report and background events to a slow one.',
      },
      {
        steps: ['Personal ▸ Notification.', 'Pick a report tab ▸ Modify Settings: rename it, enable email delivery, choose days and hours.', 'Modify Interests: assign the workflow events (arrived, completed, late) to your urgent report.', 'On an important folder: Functions ▸ Set Notification and choose events for one report.'],
        title: 'Set up workflow and item notifications', ui: 'Classic UI',
      },
      { callout: 'note', text: 'Once a user changes their own notification settings, group defaults no longer apply to them. Group defaults only reach users who join the department after they were set.' },
      { h: 'Delegates, proxies and substitutes' },
      'Work must not stall when you are away. Content Server separates handing a task over for good from covering your work for a period:',
      {
        figure: {
          type: 'compare',
          items: [
            { title: 'Delegate a step', tone: 'warn', points: ['Action on a workflow step (if the map allows)', 'Step leaves your list and goes to someone else', 'It does not come back to you'] },
            { title: 'Workflow proxy / out of office', tone: 'info', points: ['Set before an absence', 'Your new steps also go to the stand-in', 'One user, one level; audit shows who acted'] },
            { title: 'Reminder substitute', tone: 'xp', points: ['Covers your reminders', 'For a period of validity', 'Several substitutes possible'] },
          ],
        },
        caption: 'Hand over for good, or cover for a while — know which one you are using.',
      },
      'Workflow managers have their own tools: they monitor instances, **reassign** stuck steps, and suspend, resume or stop a workflow. Everything is recorded in the workflow audit, so you can always see who really did a step.',
      {
        figure: {
          type: 'lanes',
          lanes: [
            { label: 'Ann (away)', cells: ['Sets proxy: Ben', '', '', ''] },
            { label: 'Workflow', cells: ['', 'Step for Ann', '', 'Audit: done by Ben'] },
            { label: 'Ben (proxy)', cells: ['', '', 'Completes step', ''] },
          ],
        },
        caption: 'Absence cover in practice: the work moves on and the audit trail stays honest.',
      },
      { h: 'Activity feeds' },
      'Pulse activity feeds show what is happening as a stream: items added or changed, status messages and comments. Follow colleagues to see their activity, use the item or “Pulse from Here” feeds to watch one place, and filter the feed by type of post. Feeds are good for awareness; notification reports and reminders are better for things you must act on.',
      { callout: 'exam', text: 'Proxies receive **workflow** assignments only — not task-list tasks or reminders. Reminders have their own **substitutes**.' },
    ],
    keyPoints: [
      'Notification = up to three scheduled reports + general and specific interests; an administrator must enable it.',
      'Assign urgent workflow events (arrived, completed, late) to a frequent report.',
      'Delegating a step hands it over permanently; a proxy covers your workflow steps during an absence.',
      'Reminder substitutes cover reminders for a period; managers can reassign stuck workflow steps.',
      'Activity feeds give awareness and can be filtered; they respect permissions.',
    ],
    missions: [
      {
        id: 'u19-workflow-notify', type: 'practice', title: 'Get told about your workflows',
        steps: [
          'Open Personal ▸ Notification and rename one report to “Urgent”, with email delivery on.',
          'Modify Interests: send the workflow events (step arrived, completed, late) to “Urgent”.',
          'Set a specific notification on “{{sandbox}}” that goes to a slower report.',
        ],
        reflection: 'Which events go to which report and why? What would happen if you sent every “item added” event to the hourly report?',
      },
      {
        id: 'u19-cover', type: 'practice', title: 'Plan cover for a holiday',
        steps: [
          'Set a colleague as your workflow proxy (My Account ▸ Settings ▸ Workflow, or the out-of-office settings your version offers), then clear it again.',
          'Open your reminder settings and look at the substitute options and period of validity.',
          'If you have a workflow step with a Delegate button, read what it says before you use it.',
        ],
        reflection: 'For a two-week holiday, what would you set up for your workflow steps and for your reminders — and when would you use Delegate instead?',
      },
      {
        id: 'u19-quiz', type: 'quiz', title: 'Knowledge check: notifications and delegates',
        questions: [
          { q: 'How many notification reports can a user configure in Content Server?', options: ['One', 'Up to three', 'Ten', 'Unlimited'], answer: 1, explain: 'There are at most three reports, each with its own schedule and delivery.' },
          { q: 'What is the difference between general and specific notification interests?', options: ['General interests are for administrators only', 'General interests are event types anywhere in the system; specific interests are set on one item', 'Specific interests replace general ones', 'There is no difference'], answer: 1, explain: 'General interests apply system-wide; specific interests are set on an item with Set Notification and are sent in addition.' },
          { q: 'You delegate a workflow step to a colleague. What happens?', options: ['You both keep the step', 'The step leaves your list and goes to the colleague; it does not return to you', 'The workflow is suspended', 'The colleague becomes workflow manager'], answer: 1, explain: 'Delegating reroutes the task permanently, relieving you of it.' },
          { q: 'Your proxy completes a workflow step while you are away. Whose name does the audit trail show?', options: ['Yours', 'The proxy’s', 'The workflow manager’s', 'Nobody’s'], answer: 1, explain: 'The audit records the user who actually did the work.' },
          { q: 'Who covers your reminders while you are on holiday?', options: ['Your workflow proxy', 'Your reminder substitutes', 'The Admin user', 'Nobody — reminders pause'], answer: 1, explain: 'Reminders have their own substitutes, valid for a period you set. Proxies cover workflow assignments only.' },
          { q: 'An administrator sets default notification interests on the Sales group. Who receives them?', options: ['All current Sales members immediately', 'Users who join Sales as their department afterwards, until they change their own settings', 'Only the group leader', 'Everyone in the system'], answer: 1, explain: 'Group defaults are copied to new department members; existing members and users who customise their settings are not affected.' },
          { q: 'Which tool is best for being aware of what colleagues are doing in a project folder, rather than for tasks you must act on?', options: ['A reminder', 'An activity feed (Pulse from Here)', 'A workflow proxy', 'A version limit'], answer: 1, explain: 'Activity feeds provide awareness; reminders, assignments and notifications drive action.' },
          { q: 'A workflow step is stuck because its assignee left the company. Who fixes it, and how?', options: ['Any user, by deleting the workflow map', 'The workflow manager, by reassigning the step', 'The Recycle Bin, automatically', 'The proxy of the departed user'], answer: 1, explain: 'Workflow managers monitor instances and can reassign steps.' },
        ],
      },
    ],
  },
];
