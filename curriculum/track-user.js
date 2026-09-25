'use strict';
// Track 1 — Business User: day-to-day document management.
// Topics follow the "Managing Documents in Content Server 16.2" course outline;
// all lesson text, missions and questions are original to this trainer.

const SRC = 'Managing Documents in Content Server 16.2';

module.exports = [
  // ------------------------------------------------------------------ U01
  {
    id: 'u01', track: 'user', title: 'Getting oriented', source: `${SRC} — Ch. 1`,
    summary: 'Workspaces, items, node IDs and the two web interfaces.',
    lesson: [
      'Content Server is the repository at the heart of OpenText Content Suite and Extended ECM. Everything in it — folders, documents, workflows, discussions — is an item (a “node”) in one large tree. Every item carries metadata and its own permission list.',
      'Two roots matter to every user: the Enterprise Workspace, the shared top of the organisation\'s tree, and your Personal Workspace, which is private by default and meant for drafts and personal items. Administrators also work with volumes such as Categories and Classifications.',
      'You reach the same repository through two web interfaces: the Classic UI (Functions menu, Add Item menu, Personal / Enterprise / Tools menus) and Smart View (tiles, perspectives and a simpler toolbar). Most tasks work in both.',
    ],
    keyPoints: [
      'Every item has a Functions menu (Classic) or an action bar (Smart View).',
      'Content Server maintains system attributes (created, modified, owner, size…) automatically.',
      'Sign-in goes through OTDS, which provides identity management and single sign-on.',
      'Every item has a numeric node ID, visible in the URL (objId=… in Classic, /nodes/… in Smart View).',
    ],
    missions: [
      {
        id: 'u01-sandbox', type: 'hands-on', title: 'Build your training sandbox', xp: 30,
        brief: 'All your practice work will live in one folder in your Personal Workspace, so nothing you do in this course touches shared content.',
        steps: [
          'Open your Personal Workspace (Classic UI: Personal ▸ Personal Workspace).',
          'Add a folder: Classic UI ▸ Add Item ▸ Folder. In Smart View use the “+” (Add) button ▸ Folder.',
          'Name it exactly “{{sandbox}}” and save.',
        ],
        hints: ['Names are compared ignoring upper/lower case, but spelling and spaces must match.', 'Make sure you are in your Personal Workspace, not the Enterprise Workspace.'],
        checks: [
          { kind: 'child', parent: 'personal', name: '{{sandbox}}', types: [0], saveAs: 'sandbox', label: 'A folder “{{sandbox}}” exists in your Personal Workspace' },
        ],
        open: 'personal',
      },
      {
        id: 'u01-structure', type: 'hands-on', title: 'Give your sandbox a structure', xp: 30, requires: ['u01-sandbox'],
        brief: 'A predictable folder structure is the cheapest usability win in any repository. Numbered prefixes keep folders in the order you intend.',
        steps: [
          'Open “{{sandbox}}”.',
          'Create three folders inside it: “01 Drafts”, “02 Review” and “03 Final”.',
        ],
        hints: ['Use exactly these names — later missions look for them.'],
        checks: [
          { kind: 'child', parent: 'sandbox', name: '01 Drafts', types: [0], saveAs: 'drafts', label: 'Folder “01 Drafts”' },
          { kind: 'child', parent: 'sandbox', name: '02 Review', types: [0], saveAs: 'review', label: 'Folder “02 Review”' },
          { kind: 'child', parent: 'sandbox', name: '03 Final', types: [0], saveAs: 'final', label: 'Folder “03 Final”' },
        ],
        open: 'sandbox',
      },
      {
        id: 'u01-describe', type: 'hands-on', title: 'Describe what the folder is for', xp: 20, requires: ['u01-sandbox'],
        brief: 'Descriptions are searchable metadata. A one-line purpose statement on a folder saves colleagues from guessing.',
        steps: [
          'Open the Properties of “{{sandbox}}” (Classic: Functions menu ▸ Properties ▸ General; Smart View: the item\'s Properties).',
          'Enter a description of at least 15 characters, e.g. “My hands-on training area for Content Server”.',
          'Save (Update).',
        ],
        checks: [
          { kind: 'prop', node: 'sandbox', field: 'description', op: 'nonEmpty', value: '15', label: '“{{sandbox}}” has a description of 15+ characters' },
        ],
        open: 'sandbox',
      },
      {
        id: 'u01-ids', type: 'investigate', title: 'Find node IDs and your log-in name', xp: 20, requires: ['u01-sandbox'],
        brief: 'Support staff, administrators and integrations refer to items by node ID. Knowing where to find it is a basic skill.',
        steps: [
          'Open “{{sandbox}}” and look at the browser address bar. In Classic UI the ID follows objId=; in Smart View it follows /nodes/.',
          'Find your own log-in (user) name — it is shown in your profile (Classic: My Account ▸ Edit Profile).',
          'Type both values below.',
        ],
        inputs: [
          { key: 'sandboxId', label: 'Node ID of “{{sandbox}}”', placeholder: 'e.g. 123456' },
          { key: 'login', label: 'Your log-in name', placeholder: 'e.g. jsmith' },
        ],
        checks: [
          { kind: 'answer', input: 'sandboxId', source: 'ref.id:sandbox', compare: 'number', label: 'Node ID of your sandbox', hint: 'Copy only the digits after objId= or /nodes/.' },
          { kind: 'answer', input: 'login', source: 'user.login', compare: 'text', label: 'Your log-in name' },
        ],
      },
      {
        id: 'u01-two-uis', type: 'practice', title: 'Tour both interfaces', xp: 15,
        brief: 'Most organisations run both UIs for a while. You should be comfortable finding the same item in each.',
        steps: [
          'Open Smart View ({{smartUrl}}) and find “{{sandbox}}”.',
          'Open the same folder in the Classic UI.',
          'Locate the online Help in both.',
        ],
        reflection: 'Name two differences you noticed between Classic UI and Smart View, and where you found the Help.',
      },
      {
        id: 'u01-quiz', type: 'quiz', title: 'Knowledge check: orientation', xp: 25,
        questions: [
          { q: 'Where should you keep drafts that nobody else needs to see yet?', options: ['Enterprise Workspace', 'Personal Workspace', 'Categories volume', 'Recycle Bin'], answer: 1, explain: 'The Personal Workspace is private by default. The Enterprise Workspace is the shared, organisation-wide root.' },
          { q: 'What does OpenText Directory Services (OTDS) provide for Content Server?', options: ['Full-text indexing', 'Identity management and single sign-on', 'Document rendering', 'Workflow design'], answer: 1, explain: 'OTDS manages users and groups for OpenText products and provides single sign-on.' },
          { q: 'In the Classic UI, where do you find actions such as Properties, Copy, Move and Permissions for an item?', options: ['The Add Item menu', 'The item\'s Functions menu', 'Tools ▸ Recycle Bin', 'The Personal menu'], answer: 1, explain: 'The Functions menu next to each item lists everything you are allowed to do with it.' },
          { q: 'Which statement about system attributes is true?', options: ['They must be typed in by the user', 'They exist only for documents', 'Content Server records them automatically for every item', 'They are stored inside categories'], answer: 2, explain: 'Created/modified dates, owner, size and similar attributes are maintained by the system for every item.' },
          { q: 'When a user signs out or closes the browser, what happens to the session cookie Content Server used?', options: ['It is kept for 30 days', 'It is discarded', 'It is copied into the Personal Workspace', 'It becomes a nickname'], answer: 1, explain: 'The cookie only carries connection information for the session and is thrown away on sign-out or when the browser closes.' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ U02
  {
    id: 'u02', track: 'user', title: 'Adding and accessing content', source: `${SRC} — Ch. 2`,
    summary: 'Upload, create and open documents; read an item\'s Properties.',
    lesson: [
      'A folder organises; a document is one or more versions of an electronic file (any format) plus metadata about it. Content arrives several ways: Add Item ▸ Document (upload), drag-and-drop onto a folder, a new Office document created online, the built-in text-document editor, email-enabled containers, and Enterprise Connect from Windows and Office.',
      'New items inherit the permissions of the container they are added to. Where you add something matters as much as what you add.',
      'Documents can be viewed in a browser viewer, opened in their native application, or downloaded. The Properties pages (General, Versions, Categories, Audit…) expose the metadata Content Server keeps.',
    ],
    keyPoints: [
      'See = see the name only. See Contents = open, view, download or copy.',
      'Add Items lets you add containers such as folders; with Reserve as well you can add documents.',
      'The Add Item menu only lists item types you are allowed to create in that container.',
    ],
    missions: [
      {
        id: 'u02-upload', type: 'hands-on', title: 'Upload your first document', xp: 30, requires: ['u01-structure'],
        brief: 'Uploading is the most common action in any ECM system. Pay attention to the name field — Content Server pre-fills it with the file name.',
        steps: [
          'Open “{{sandbox}}” ▸ “01 Drafts”.',
          'Add a document (Classic: Add Item ▸ Document; Smart View: “+” ▸ Document, or drag a file onto the folder).',
          'Choose any small Word, Excel, PDF or text file from your computer.',
          'Set the name to “Project Plan” (keeping the file extension is fine) and add it.',
        ],
        checks: [
          { kind: 'child', parent: 'drafts', nameRegex: '^project plan(\\.[a-z0-9]{1,5})?$', types: [144], typeName: '^document$', saveAs: 'planDoc', label: 'Document “Project Plan” in “01 Drafts”' },
        ],
        open: 'drafts',
      },
      {
        id: 'u02-textdoc', type: 'hands-on', title: 'Write a note with the built-in editor', xp: 20, requires: ['u01-structure'],
        brief: 'The built-in editor creates simple text documents without leaving the browser — handy for meeting notes or instructions.',
        steps: [
          'Open “01 Drafts”.',
          'Classic UI: Add Item ▸ Text Document.',
          'Name it “Meeting Notes”, type a few lines and add it.',
        ],
        hints: ['If Text Document is not in your Add Item menu, the item type is not enabled for you — skip this mission.'],
        checks: [
          { kind: 'child', parent: 'drafts', nameRegex: '^meeting notes', types: [145], typeName: 'text', saveAs: 'notesDoc', label: 'Text document “Meeting Notes” in “01 Drafts”' },
        ],
        open: 'drafts',
      },
      {
        id: 'u02-url', type: 'hands-on', title: 'Link to a web resource', xp: 20, requires: ['u01-sandbox'], feature: 'urls',
        brief: 'URL items keep useful links next to the content they relate to. Creating them needs a specific privilege, so your server may not offer it.',
        steps: [
          'Open “{{sandbox}}”.',
          'Add Item ▸ URL (Smart View: “+” ▸ Web address).',
          'Name: “OpenText Support”. Address: https://support.opentext.com',
        ],
        checks: [
          { kind: 'child', parent: 'sandbox', name: 'OpenText Support', types: [140], typeName: '^url$|web address', saveAs: 'urlItem', label: 'URL item “OpenText Support”' },
          { kind: 'prop', node: 'urlItem', field: 'url', op: 'regex', value: 'opentext', label: 'It points to an opentext.com address' },
        ],
        open: 'sandbox',
      },
      {
        id: 'u02-mime', type: 'investigate', title: 'Read a document\'s Properties', xp: 20, requires: ['u02-upload'],
        brief: 'The General tab tells you what Content Server knows about a file. The MIME type decides which viewer and application open it.',
        steps: [
          'Open the Functions menu of “Project Plan” ▸ Properties ▸ General.',
          'Find the MIME type (for example application/pdf).',
          'Type it below.',
        ],
        inputs: [{ key: 'mime', label: 'MIME type of Project Plan', placeholder: 'e.g. application/pdf' }],
        checks: [
          { kind: 'answer', input: 'mime', source: 'ref.mime:planDoc', compare: 'text', label: 'MIME type of “Project Plan”', hint: 'Type the whole MIME type as the General tab shows it, e.g. application/pdf.' },
        ],
        open: 'planDoc',
      },
      {
        id: 'u02-quiz', type: 'quiz', title: 'Knowledge check: adding content', xp: 25,
        questions: [
          { q: 'A colleague has a CAD drawing on a network share. Which is the right way to put it into Content Server unchanged?', options: ['Create a text document and paste the drawing', 'Add Item ▸ Document and select the file', 'Add a URL pointing to the share', 'Create a collection'], answer: 1, explain: 'Add Document uploads any file format as-is, including non-Office formats such as CAD.' },
          { q: 'You add a document to a folder. What permissions does it get?', options: ['None until an administrator assigns them', 'Only the owner can see it', 'It inherits the folder\'s permissions; they can be changed afterwards', 'It copies the permissions of your Personal Workspace'], answer: 2, explain: 'New items inherit the container\'s ACL by default.' },
          { q: 'Which permission lets a user open, view and download a document?', options: ['See', 'See Contents', 'Modify', 'Edit Attributes'], answer: 1, explain: 'See only shows the item\'s name. See Contents allows viewing, opening, downloading and copying.' },
          { q: 'Which combination of permissions is needed to add documents to a folder?', options: ['See and Modify', 'Add Items and Reserve', 'Edit Attributes only', 'Delete Versions and Delete'], answer: 1, explain: 'Add Items covers containers; adding documents also needs Reserve.' },
          { q: 'Why might “Text Document” be missing from your Add Item menu?', options: ['Text documents can only be created in Smart View', 'The item type is not available or allowed for you in that container', 'You must first reserve the folder', 'Text documents are stored in the Categories volume'], answer: 1, explain: 'The Add Item menu only lists types you are permitted to create in the current container.' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ U03
  {
    id: 'u03', track: 'user', title: 'Managing content: versions, reserve, copy, delete', source: `${SRC} — Ch. 3`,
    summary: 'Reserve/unreserve, add versions, copy vs move, delete and restore.',
    lesson: [
      'Reserving a document write-locks it so only you (or the group you reserved it for) can add versions. Edit online (Word, Excel, PowerPoint…) reserves automatically and unreserves when you close the application; offline editing means Reserve, download, edit, then Unreserve and add the new version.',
      'Every change you check in becomes a new version. The Versions tab lists them; you can lock versions to protect them and delete unneeded ones. Advanced versioning adds major/minor numbering: minor versions are work in progress, major versions are published.',
      'A version limit (Max. Versions) keeps only the newest N versions. When a new version pushes the count over the limit, the oldest version is deleted — unless it is locked, has a generation pointing to it, or you lack Delete Versions permission.',
      'Copy creates an independent duplicate; Move relocates the original. Deleted items go to the Recycle Bin (Tools ▸ Recycle Bin) until purged.',
    ],
    keyPoints: [
      'Setting Max. Versions requires Delete Versions permission.',
      'With advanced versioning, See/See Contents users only see major versions; Reserve is needed to see and add minor ones.',
      'Zip & Download bundles several items into one archive.',
    ],
    missions: [
      {
        id: 'u03-version', type: 'hands-on', title: 'Add a new version', xp: 30, requires: ['u02-upload'],
        brief: 'Adding a version keeps one item — and one link — while preserving history.',
        steps: [
          'Open the Functions menu of “Project Plan” ▸ Add Version (or drag an updated file onto the document in Smart View).',
          'Select any file (it can be the same file again) and add it.',
          'Look at Properties ▸ Versions to see the history.',
        ],
        checks: [{ kind: 'versions', node: 'planDoc', min: 2, label: '“Project Plan” has at least 2 versions' }],
        open: 'planDoc',
      },
      {
        id: 'u03-reserve', type: 'hands-on', title: 'Reserve a document', xp: 25, requires: ['u02-upload'],
        brief: 'Reserving tells everyone “I am editing this — don\'t add versions”.',
        steps: [
          'Functions menu of “Project Plan” ▸ Reserve (Smart View: Reserve action).',
          'Leave “Reserve By” as yourself and confirm. You don\'t need to download a copy.',
        ],
        checks: [{ kind: 'prop', node: 'planDoc', field: 'reserved', op: 'true', label: '“Project Plan” is reserved' }],
        open: 'planDoc',
      },
      {
        id: 'u03-unreserve', type: 'hands-on', title: 'Check your changes back in', xp: 30, requires: ['u03-reserve', 'u03-version'],
        brief: 'Offline editing ends with Unreserve — and usually a new version.',
        steps: [
          'Functions menu of “Project Plan” ▸ Unreserve.',
          'On the Unreserve page choose to add a new version with any file, then submit.',
          'If your server doesn\'t offer that option, first use Add Version, then Unreserve.',
        ],
        checks: [
          { kind: 'prop', node: 'planDoc', field: 'reserved', op: 'false', label: '“Project Plan” is no longer reserved' },
          { kind: 'versions', node: 'planDoc', min: 3, label: '“Project Plan” has at least 3 versions' },
        ],
        open: 'planDoc',
      },
      {
        id: 'u03-copy', type: 'hands-on', title: 'Copy (not move) into Final', xp: 25, requires: ['u02-upload'],
        brief: 'Copy leaves the original where it is. Knowing the difference matters for permissions, which you will study later.',
        steps: [
          'Functions menu of “Project Plan” ▸ Copy.',
          'Choose “{{sandbox}}” ▸ “03 Final” as the destination and copy.',
        ],
        checks: [
          { kind: 'child', parent: 'final', nameRegex: '^project plan', types: [144], typeName: '^document$', saveAs: 'finalPlan', label: 'A copy of “Project Plan” is in “03 Final”' },
          { kind: 'prop', node: 'planDoc', field: 'parent_id', op: 'equalsRef', value: 'drafts', label: 'The original is still in “01 Drafts”' },
        ],
        open: 'final',
      },
      {
        id: 'u03-temp', type: 'hands-on', title: 'Create something to throw away', xp: 10, requires: ['u01-sandbox'],
        steps: ['In “{{sandbox}}”, create a folder named “Scratch - delete me”.'],
        checks: [{ kind: 'child', parent: 'sandbox', name: 'Scratch - delete me', types: [0], saveAs: 'scratch', label: 'Folder “Scratch - delete me” exists' }],
        open: 'sandbox',
      },
      {
        id: 'u03-delete', type: 'hands-on', title: 'Delete, then find it in the Recycle Bin', xp: 25, requires: ['u03-temp'],
        brief: 'Deleted items are not gone immediately: until they are purged they can be restored from the Recycle Bin.',
        steps: [
          'Functions menu of “Scratch - delete me” ▸ Delete, and confirm.',
          'Open Tools ▸ Recycle Bin and find it under “I Deleted Today”. Look — but don\'t purge it.',
        ],
        checks: [{ kind: 'gone', node: 'scratch', label: '“Scratch - delete me” has been deleted' }],
      },
      {
        id: 'u03-quiz', type: 'quiz', title: 'Knowledge check: managing content', xp: 30,
        questions: [
          { q: 'You open a Word document with Edit online. What happens to the reservation?', options: ['Nothing — you must reserve manually first', 'It is reserved automatically and unreserved when you close Word', 'It stays reserved until an administrator releases it', 'Only minor versions are reserved'], answer: 1, explain: 'Online editing reserves automatically and unreserves when the native application closes.' },
          { q: 'A document has Max. Versions = 3 and a fourth version is added. Which old version survives even though it is the oldest?', options: ['None — the oldest is always deleted', 'One that has a generation pointing to it', 'The oldest minor version', 'Whichever one was downloaded most'], answer: 1, explain: 'Locked versions, versions referenced by a generation, and versions you can\'t delete (no Delete Versions permission) are kept.' },
          { q: 'Which permission lets you change a document\'s version limit?', options: ['Reserve', 'Edit Attributes', 'Delete Versions', 'Modify'], answer: 2, explain: 'Delete Versions covers deleting versions and setting the maximum number of versions.' },
          { q: 'With major/minor (advanced) versioning, what is the minimum permission to see minor versions?', options: ['See Contents', 'Modify', 'Reserve', 'Edit Permissions'], answer: 2, explain: 'Read-only users see major versions only; Reserve lets you see and add minor versions.' },
          { q: 'Where do you restore a document that was deleted this morning?', options: ['Personal ▸ Favorites', 'Tools ▸ Recycle Bin', 'Properties ▸ Versions', 'Enterprise ▸ Categories'], answer: 1, explain: 'Deleted items stay in the Recycle Bin until purged.' },
          { q: 'Which permission includes the right to move an item?', options: ['Modify', 'Delete', 'Add Items', 'Reserve'], answer: 1, explain: 'The Delete permission covers deleting and moving the item.' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ U04
  {
    id: 'u04', track: 'user', title: 'Compound documents', source: `${SRC} — Ch. 4`, feature: 'compound',
    summary: 'Treat a set of documents as one unit with releases and revisions.',
    lesson: [
      'A compound document looks like a folder but behaves like one document made of parts. It can contain documents, other compound documents, and shortcuts or generations pointing to them.',
      'Elements are numbered; Reorganize renumbers and repositions them. One element can be the Master document, always listed first. The Outline view summarises the structure.',
      'Releases (major) and revisions (minor) freeze the compound document at a moment in time. Shortcuts can follow the work in progress while generations can point at a specific release or revision.',
    ],
    keyPoints: [
      'Use compound documents for multi-part deliverables with several authors (manuals, proposals, submissions).',
      'Releases and revisions move and copy with their compound document — never on their own.',
    ],
    missions: [
      {
        id: 'u04-create', type: 'hands-on', title: 'Create a compound document', xp: 30, requires: ['u01-sandbox'],
        steps: ['In “{{sandbox}}”: Add Item ▸ Compound Document.', 'Name it “Training Manual”.'],
        checks: [{ kind: 'child', parent: 'sandbox', name: 'Training Manual', types: [136], typeName: 'compound', saveAs: 'cdoc', label: 'Compound document “Training Manual”' }],
        open: 'sandbox',
      },
      {
        id: 'u04-elements', type: 'hands-on', title: 'Add chapters to it', xp: 30, requires: ['u04-create'],
        brief: 'Each element is a normal document you can reserve and version independently.',
        steps: ['Open “Training Manual”.', 'Add at least two documents (e.g. “Chapter 1”, “Chapter 2”) — upload files or create text documents.'],
        checks: [{ kind: 'count', parent: 'cdoc', min: 2, types: [144, 145], label: 'At least 2 documents inside “Training Manual”' }],
        open: 'cdoc',
      },
      {
        id: 'u04-release', type: 'practice', title: 'Freeze a release', xp: 15, requires: ['u04-elements'],
        steps: [
          'Set one element as the Master document.',
          'Open the Outline view.',
          'Create a Release, then change a chapter and create a Revision.',
        ],
        reflection: 'Explain in your own words when you would create a release rather than a revision.',
      },
      {
        id: 'u04-quiz', type: 'quiz', title: 'Knowledge check: compound documents', xp: 20,
        questions: [
          { q: 'Which of these can a compound document contain?', options: ['Only documents', 'Documents, other compound documents, and shortcuts or generations to them', 'Folders and projects only', 'Any item type including workflow maps'], answer: 1, explain: 'Compound documents hold documents, nested compound documents, shortcuts and generations.' },
          { q: 'What distinguishes a release from a revision?', options: ['Releases are minor, revisions major', 'Releases are major, revisions minor', 'Releases are for folders only', 'There is no difference'], answer: 1, explain: 'Releases are meant to be major snapshots; revisions minor ones.' },
          { q: 'What does the Master document setting do?', options: ['Locks all other elements', 'Keeps that element at the top of the element list', 'Makes it the only printable element', 'Converts it to PDF'], answer: 1, explain: 'The Master document is always shown first.' },
          { q: 'Can you move a single release to another folder?', options: ['Yes, like any document', 'No — releases and revisions move with their compound document', 'Only administrators can', 'Only in Smart View'], answer: 1, explain: 'Releases and revisions have no Move or Copy of their own.' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ U05
  {
    id: 'u05', track: 'user', title: 'Working with email', source: `${SRC} — Ch. 5`,
    summary: 'Share links instead of attachments and file emails as records.',
    lesson: [
      'Emailing an attachment creates uncontrolled copies. Content Server offers better options: Email Link sends a link to the item (recipients still need permission), Zip & Email bundles items, and short links (…/open/<nickname> or …/properties/<nickname>) can be copied to the clipboard.',
      'Emails themselves are content. Saved .msg/.eml messages can be added to any folder; with Email Services installed they become email objects with sender, recipients and threads, and email-enabled containers can receive mail directly.',
    ],
    keyPoints: ['A link never bypasses permissions.', 'Filing email next to the related documents keeps the full story in one place.'],
    missions: [
      {
        id: 'u05-links', type: 'practice', title: 'Share a link, not a copy', xp: 15, requires: ['u02-upload'],
        steps: [
          'Open Properties ▸ General of “Project Plan”.',
          'Copy the Open short link.',
          'Paste it into a new browser tab and confirm the document opens.',
        ],
        reflection: 'What would a colleague see if they clicked your link without having See Contents on the document?',
      },
      {
        id: 'u05-save-email', type: 'hands-on', title: 'File an email', xp: 25, requires: ['u01-sandbox'],
        steps: [
          'Save any email from your mail client as a file (.msg or .eml), or drag it straight from Outlook if Enterprise Connect is installed.',
          'Add it anywhere inside “{{sandbox}}”.',
        ],
        checks: [{ kind: 'child', parent: 'sandbox', recursive: true, depth: 2, types: [749], typeName: 'e-?mail', mimeRegex: 'outlook|rfc822|message', orNameRegex: '\\.(msg|eml)$', saveAs: 'emailItem', label: 'An email message is stored in your sandbox' }],
        open: 'sandbox',
      },
      {
        id: 'u05-quiz', type: 'quiz', title: 'Knowledge check: email', xp: 20,
        questions: [
          { q: 'Why is Email Link usually better than attaching a file?', options: ['It sends a smaller attachment', 'Recipients open the single controlled item instead of a copy', 'It bypasses permissions for convenience', 'It converts the file to PDF'], answer: 1, explain: 'A link points at the one governed item; access is still controlled by permissions.' },
          { q: 'A short link of the form …/cs.exe/properties/<nickname> opens…', options: ['The item for viewing', 'The item\'s General (properties) page', 'The Recycle Bin', 'The Smart View home page'], answer: 1, explain: '/open/<nickname> opens the item; /properties/<nickname> opens its General page.' },
          { q: 'What does Zip & Email do?', options: ['Emails a link to each item', 'Compresses selected items into a zip and emails it', 'Archives the items to tape', 'Sends the items to the Recycle Bin'], answer: 1, explain: 'It bundles the chosen items into a zip file and sends it.' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ U06
  {
    id: 'u06', track: 'user', title: 'Favorites, shortcuts, generations and collections', source: `${SRC} — Ch. 6`,
    summary: 'Ways to reach important content without copying it.',
    lesson: [
      'Favorites are your personal list of important items. Recent items shows what you touched lately.',
      'A shortcut is a pointer to an item stored elsewhere; it always opens the current version and lets one item appear in several places. Deleting a shortcut does not delete the original.',
      'A generation points to one specific version (for example the published annual report). It protects that version from version-limit clean-up and can live in a different place — a “published” area — with its own name, which must differ from the original\'s.',
      'A collection gathers items from anywhere so you can act on them as a group — for example to apply category values in bulk. Creating URL items needs a privilege.',
    ],
    keyPoints: ['Shortcut = latest version. Generation = one fixed version.', 'Collections hold references, not copies.'],
    missions: [
      {
        id: 'u06-favorite', type: 'hands-on', title: 'Make it a favorite', xp: 20, requires: ['u02-upload'],
        steps: ['Functions menu of “Project Plan” ▸ Add to Favorites (Smart View: the star icon).'],
        checks: [{ kind: 'favorite', node: 'planDoc', label: '“Project Plan” is in your Favorites' }],
        open: 'planDoc',
      },
      {
        id: 'u06-shortcut', type: 'hands-on', title: 'Point to it from another folder', xp: 30, requires: ['u02-upload', 'u01-structure'],
        brief: 'Reviewers work in “02 Review” but the document lives in “01 Drafts”. A shortcut avoids a second copy.',
        steps: ['Open “02 Review”.', 'Add Item ▸ Shortcut, browse to “01 Drafts” ▸ “Project Plan” and add it.'],
        checks: [
          { kind: 'child', parent: 'review', types: [1], typeName: 'shortcut|alias', saveAs: 'planShortcut', label: 'A shortcut exists in “02 Review”' },
          { kind: 'prop', node: 'planShortcut', field: 'original_id', op: 'equalsRef', value: 'planDoc', label: 'It points to “Project Plan”' },
        ],
        open: 'review',
      },
      {
        id: 'u06-generation', type: 'hands-on', title: 'Publish a fixed version as a generation', xp: 30, requires: ['u03-version'],
        steps: [
          'Functions menu of “Project Plan” ▸ Make Generation.',
          'Name it “Project Plan - Published” (a generation must have a different name), pick a version and choose “03 Final” as the location.',
        ],
        checks: [
          { kind: 'child', parent: 'final', types: [2], typeName: 'generation', saveAs: 'planGen', label: 'A generation exists in “03 Final”' },
          { kind: 'prop', node: 'planGen', field: 'original_id', op: 'equalsRef', value: 'planDoc', label: 'It was made from “Project Plan”' },
        ],
        open: 'final',
      },
      {
        id: 'u06-collection', type: 'hands-on', title: 'Start a reading list', xp: 20, requires: ['u01-sandbox'], feature: 'collections',
        steps: ['In “{{sandbox}}”: Add Item ▸ Collection named “Reading List”.', 'Add two items to it (Functions menu ▸ Collect, or from the collection).'],
        checks: [{ kind: 'child', parent: 'sandbox', name: 'Reading List', types: [298], typeName: 'collection', saveAs: 'collection', label: 'Collection “Reading List”' }],
        open: 'sandbox',
      },
      {
        id: 'u06-quiz', type: 'quiz', title: 'Knowledge check: alternate access', xp: 25,
        questions: [
          { q: 'You need the published version of a procedure to stay reachable even as drafts continue. Which item fits best?', options: ['Shortcut', 'Generation', 'Favorite', 'URL'], answer: 1, explain: 'A generation points to one specific version; a shortcut always follows the latest.' },
          { q: 'What happens to the original when you delete a shortcut?', options: ['It is deleted too', 'Nothing', 'It becomes reserved', 'It moves to the Recycle Bin'], answer: 1, explain: 'A shortcut is only a pointer.' },
          { q: 'Which is a typical use of a collection?', options: ['Storing a second copy of documents', 'Applying category attributes to a group of items from different folders', 'Replacing folder permissions', 'Scheduling workflows'], answer: 1, explain: 'Collections gather references so you can act on them together.' },
          { q: 'Who sees the items in your Favorites?', options: ['Everyone in your department', 'Only you', 'Administrators and you', 'Everyone with See permission'], answer: 1, explain: 'Favorites are a personal list.' },
          { q: 'Why might a user be unable to add a URL item?', options: ['URLs can only be added in Smart View', 'Creating URL objects requires a privilege', 'URLs require advanced versioning', 'URLs are only allowed in projects'], answer: 1, explain: 'URL creation is controlled by an item-creation privilege.' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ U07
  {
    id: 'u07', track: 'user', title: 'Categories and attributes', source: `${SRC} — Ch. 7`, feature: 'categories',
    summary: 'Custom metadata: design, apply, inherit, upgrade.',
    lesson: [
      'A category is a reusable template of custom attributes (Text field, Popup list, Date, User, Integer, Boolean, …). Applying it to an item adds those fields to the item\'s metadata so it can be searched, reported on and used by workflows.',
      'An attribute set groups related attributes inside a category (for example “Review”: Reviewed By + Review Date). A set itself cannot be mandatory — mark the individual attributes required instead. With the Attribute Extensions module, Text: Table Key Lookup attributes can cascade, so one choice narrows the valid values of the next.',
      'Applying a category to a folder makes new items added to it inherit the category. When a category is edited later, items show it as upgradable; use Upgrade on the item, or Upgrade Items on the category to update items system-wide.',
    ],
    keyPoints: [
      'Editing a category requires Reserve permission on the category.',
      'Editing attribute values on an item requires Edit Attributes permission on that item.',
      'Design categories around questions people will search by.',
    ],
    missions: [
      {
        id: 'u07-apply', type: 'hands-on', title: 'Apply a category to a document', xp: 30, requires: ['u02-upload'],
        brief: 'Suggested category on this server: “{{category}}”.',
        steps: [
          'Open “Project Plan” ▸ Properties ▸ Categories.',
          'Add a category (for example “{{category}}”) and fill in any required attributes.',
          'Submit.',
        ],
        checks: [{ kind: 'categories', node: 'planDoc', min: 1, label: '“Project Plan” has a category applied' }],
        open: 'planDoc',
      },
      {
        id: 'u07-folder', type: 'hands-on', title: 'Put a category on a folder', xp: 25, requires: ['u01-structure'],
        steps: ['Open “03 Final” ▸ Properties ▸ Categories.', 'Add a category and submit (don\'t apply to sub-items yet).'],
        checks: [{ kind: 'categories', node: 'final', min: 1, label: '“03 Final” has a category applied' }],
        open: 'final',
      },
      {
        id: 'u07-inherit', type: 'hands-on', title: 'Watch inheritance happen', xp: 30, requires: ['u07-folder'],
        brief: 'Items added to a categorised folder inherit its category — this is how you enforce metadata without asking users to remember.',
        steps: ['Add a new document to “03 Final” named “Inherited Metadata Test”.', 'Notice the category page offered during the add and fill in any required values.'],
        checks: [
          { kind: 'child', parent: 'final', nameRegex: '^inherited metadata test', types: [144, 145], saveAs: 'inheritDoc', label: 'Document “Inherited Metadata Test” in “03 Final”' },
          { kind: 'categories', node: 'inheritDoc', min: 1, label: 'It inherited a category' },
        ],
        open: 'final',
      },
      {
        id: 'u07-design', type: 'hands-on', title: 'Design your own category (Knowledge Manager)', xp: 50,
        brief: 'Requires permission to add items in the Categories volume. If you don\'t have it, skip this mission — the design ideas are covered in the quiz.',
        steps: [
          'Open the Categories volume (Classic: Enterprise ▸ Categories) and a folder where you may add items.',
          'Add Item ▸ Category named “OTA {{user}} Project Info”.',
          'Add attributes: Client (Text: Field), Due Date (Date: Field), Status (Text: Popup with Draft / In Review / Final).',
          'Add an attribute set “Review” with Reviewed By (User) and Review Date (Date).',
          'Submit.',
        ],
        checks: [{ kind: 'child', parent: 'categoriesVolume', recursive: true, depth: 3, nameRegex: '^OTA {{user}} Project Info$', types: [131], typeName: '^category$', saveAs: 'myCategory', label: 'Category “OTA {{user}} Project Info” exists' }],
      },
      {
        id: 'u07-quiz', type: 'quiz', title: 'Knowledge check: categories', xp: 30,
        questions: [
          { q: 'You want the Review Date inside an attribute set to be mandatory. What do you do?', options: ['Mark the set as required', 'Mark the Review Date attribute as required', 'Make the whole category required on the folder', 'It is impossible'], answer: 1, explain: 'A set cannot be required; mark its individual attributes as required.' },
          { q: 'A category was edited after it was applied to hundreds of documents. How are the documents brought up to date?', options: ['Automatically, immediately', 'Use Upgrade on each item or Upgrade Items on the category', 'Delete and re-add the category', 'Re-index the search engine'], answer: 1, explain: 'Items show the category as upgradable; Upgrade / Upgrade Items applies the new template.' },
          { q: 'Which permission lets you change attribute values on a document?', options: ['Modify', 'Edit Attributes', 'Reserve', 'Add Items'], answer: 1, explain: 'Edit Attributes covers attribute values on an item.' },
          { q: 'Which permission is needed on a category to edit its definition?', options: ['See Contents', 'Reserve', 'Edit Attributes', 'Delete Versions'], answer: 1, explain: 'You must be able to reserve the category to edit it.' },
          { q: 'What makes attributes “cascading”?', options: ['They are copied to sub-folders', 'The valid values of one attribute depend on the value chosen in another (Table Key Lookup levels)', 'They are inherited by versions', 'They are mandatory'], answer: 1, explain: 'With Attribute Extensions, Table Key Lookup attributes can cascade from key values in other attributes.' },
          { q: 'What happens when you add a document to a folder that has a category applied?', options: ['Nothing', 'The new document inherits the category', 'The folder category is removed', 'The document is rejected unless it already has the category'], answer: 1, explain: 'New items inherit the container\'s categories.' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ U08
  {
    id: 'u08', track: 'user', title: 'Exploring metadata: nicknames, columns, facets', source: `${SRC} — Ch. 8`,
    summary: 'Nicknames, multilingual metadata, columns, facets and virtual folders.',
    lesson: [
      'Every item has a nickname — by default its node ID. Users with the right permission can change it to a unique word, which then works in short links (…/open/<nickname>) and in nickname search.',
      'Names and descriptions can be stored in several languages; each user picks a metadata language preference.',
      'Columns display metadata in a folder list. Global columns are set by Knowledge Managers or administrators; personal columns are chosen by users. Facets filter browse results (the Content Filter sidebar), and a virtual folder saves a faceted selection for reuse.',
    ],
    keyPoints: ['Columns show; facets filter.', 'Nicknames must be unique across the system.'],
    missions: [
      {
        id: 'u08-nickname', type: 'hands-on', title: 'Give your sandbox a nickname', xp: 25, requires: ['u01-sandbox'],
        steps: [
          'Properties ▸ General of “{{sandbox}}” ▸ Nickname ▸ Change.',
          'Enter “ota-{{user}}” and save.',
          'Open {{csUrl}}/open/ota-{{user}} in a new tab to test it.',
        ],
        checks: [{ kind: 'nickname', node: 'sandbox', value: 'ota-{{user}}', label: 'Nickname “ota-{{user}}” opens “{{sandbox}}”' }],
        open: 'sandbox',
      },
      {
        id: 'u08-columns', type: 'practice', title: 'Choose your columns', xp: 15,
        steps: ['Open My Account ▸ Settings and look at the columns you can display.', 'Add one extra column (e.g. Size or Created By) and browse “{{sandbox}}”.'],
        reflection: 'Which column did you add and when would it be useful for a team?',
      },
      {
        id: 'u08-facets', type: 'practice', title: 'Filter with facets', xp: 15,
        steps: ['Open a large folder in the Enterprise Workspace.', 'Show the Content Filter sidebar and filter by a facet such as Document Type or Modified Date.'],
        reflection: 'Describe one situation where filtering by facet is faster than searching.',
      },
      {
        id: 'u08-virtual', type: 'hands-on', title: 'Save a virtual folder', xp: 30, requires: ['u01-sandbox'], feature: 'virtualFolders',
        steps: ['Apply a facet filter you like.', 'Save it as a virtual folder inside “{{sandbox}}”.'],
        checks: [{ kind: 'child', parent: 'sandbox', recursive: true, depth: 2, types: [899], typeName: 'virtual', label: 'A virtual folder exists in your sandbox' }],
        open: 'sandbox',
      },
      {
        id: 'u08-quiz', type: 'quiz', title: 'Knowledge check: metadata', xp: 25,
        questions: [
          { q: 'What is an item\'s nickname before anyone changes it?', options: ['Its name', 'Its node ID', 'Blank', 'Its owner\'s log-in'], answer: 1, explain: 'By default the nickname is the item ID.' },
          { q: 'Columns versus facets — which statement is right?', options: ['Both only change sorting', 'Columns display metadata; facets filter the list', 'Facets display metadata; columns filter', 'They are the same feature in different UIs'], answer: 1, explain: 'Columns show values in the list; facets narrow what is listed.' },
          { q: 'Who normally sets global columns?', options: ['Any user', 'Knowledge Managers or administrators', 'Only the item owner', 'OTDS'], answer: 1, explain: 'Global columns are configured centrally; personal columns by each user.' },
          { q: 'What is a virtual folder?', options: ['A folder stored outside Content Server', 'A saved faceted-browsing selection', 'A shortcut to a folder', 'A folder in the Recycle Bin'], answer: 1, explain: 'Virtual folders save facet selections for reuse.' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ U09
  {
    id: 'u09', track: 'user', title: 'Searching for content', source: `${SRC} — Ch. 9`, feature: 'search',
    summary: 'Search bar, operators, slices, saved queries, forms and prospectors.',
    lesson: [
      'Content Server builds a full-text index of documents and metadata. The Search bar accepts terms and operators (and, or, but not, wildcards, quoted phrases); the Search Panel lets you pick a slice (an indexed segment of the repository), a location (“from here”), object type, creator and date.',
      'Advanced Search adds full-text options, system attributes and category attributes. Results can be filtered, hit-highlighted and their display saved as a template.',
      'A saved query re-runs the same criteria against current data. A search form saves the framework of a search, with or without terms, plus display options. A prospector runs continuously and collects newly indexed items that match. eDiscovery mode, granted by an administrator, lets a non-admin search with See Contents to everything — and is audited.',
    ],
    keyPoints: ['Query = saved, dynamic search.', 'Search form = reusable search page layout.', 'Prospector = continuous watch on new content.'],
    missions: [
      {
        id: 'u09-operators', type: 'practice', title: 'Search like a pro', xp: 15, requires: ['u02-upload'],
        steps: ['Search for your Project Plan from inside “{{sandbox}}” using the location option.', 'Now run a search that finds Project Plan but excludes Meeting Notes, using an operator.'],
        reflection: 'Write the exact query text you used and explain each operator.',
      },
      {
        id: 'u09-savedquery', type: 'hands-on', title: 'Save a reusable query', xp: 30, requires: ['u01-sandbox'],
        steps: ['Run any search (for example everything you created this week).', 'On the results page choose Save Search / Save as query.', 'Save it into “{{sandbox}}” as “OTA - My drafts”.'],
        checks: [{ kind: 'child', parent: 'sandbox', recursive: true, depth: 2, nameRegex: '^ota - my drafts', types: [258], typeName: 'search|query', label: 'Saved query “OTA - My drafts” in your sandbox' }],
        open: 'sandbox',
      },
      {
        id: 'u09-searchform', type: 'hands-on', title: 'Build a search form', xp: 25, requires: ['u01-sandbox'], feature: 'searchForms',
        steps: ['Configure an Advanced Search (e.g. by category attribute).', 'Save it as a search form into “{{sandbox}}”.'],
        checks: [{ kind: 'child', parent: 'sandbox', recursive: true, depth: 2, typeName: 'search form', label: 'A search form exists in your sandbox' }],
        open: 'sandbox',
      },
      {
        id: 'u09-prospector', type: 'hands-on', title: 'Set a prospector', xp: 25, requires: ['u01-sandbox'], feature: 'prospectors',
        steps: ['In “{{sandbox}}”: Add Item ▸ Prospector.', 'Give it a search term relevant to your work and choose the slice.'],
        checks: [{ kind: 'child', parent: 'sandbox', recursive: true, depth: 2, typeName: 'prospector', label: 'A prospector exists in your sandbox' }],
        open: 'sandbox',
      },
      {
        id: 'u09-quiz', type: 'quiz', title: 'Knowledge check: search', xp: 30,
        questions: [
          { q: 'What is a slice?', options: ['A part of a document', 'A segment of indexed information that sets the search scope', 'A saved query', 'A facet value'], answer: 1, explain: 'Choosing a slice defines which indexed area you search.' },
          { q: 'Difference between a search form and a saved query?', options: ['None', 'A form saves the search framework (with or without terms); a query saves specific criteria to re-run', 'Forms are for admins only', 'Queries can\'t be shared'], answer: 1, explain: 'Forms preserve the search page setup; queries re-run specific criteria against current data.' },
          { q: 'Which tool keeps watching for newly added items that match your criteria?', options: ['Saved query', 'Prospector', 'Collection', 'Virtual folder'], answer: 1, explain: 'Prospectors run continuously on newly indexed items.' },
          { q: 'What does eDiscovery mode give a non-administrator?', options: ['Delete rights everywhere', 'See Contents to all items for search/browse, with auditing', 'The ability to edit permissions', 'Admin page access'], answer: 1, explain: 'eDiscovery grants See Contents for search, collection and browse; its use is audited.' },
          { q: 'Can you search on category attribute values?', options: ['No, only full text', 'Yes, from Advanced Search', 'Only with a prospector', 'Only in Smart View'], answer: 1, explain: 'Advanced Search includes category attributes.' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ U10
  {
    id: 'u10', track: 'user', title: 'Document permissions', source: `${SRC} — Ch. 10`,
    summary: 'ACLs, default vs assigned access, inheritance, move vs copy.',
    lesson: [
      'Each item has an Access Control List (ACL). The Default Access entries are the Owner, the Owner Group and Public Access; Assigned Access lists further users and groups. Selecting an entry shows its permissions: See, See Contents, Modify, Edit Attributes, Add Items, Reserve, Delete Versions, Delete, Edit Permissions (plus Add Major Version with advanced versioning).',
      'A new item copies its parent\'s ACL — except the owner entry, which becomes the person who added the item and receives the permissions defined for the owner on the parent. Think of “owner” as a role, not a person.',
      'Moving an item keeps its permissions. Copying behaves like adding: the copy takes the destination\'s permissions and the person copying becomes the owner. Changes can be applied to This Item, Sub-Items, or both — items where you lack Edit Permissions are skipped.',
    ],
    keyPoints: [
      'Assign access to groups rather than individual users.',
      'Default Access entries can be removed and later restored.',
      'Work items (discussions, channels, task lists) use None / Read / Write / Administer.',
    ],
    missions: [
      {
        id: 'u10-owner', type: 'investigate', title: 'Read an ACL', xp: 20, requires: ['u01-structure'], feature: 'permissions',
        steps: ['Open the Permissions page of “03 Final”.', 'Find who the Owner is (Default Access).'],
        inputs: [{ key: 'owner', label: 'Owner of “03 Final”', placeholder: 'log-in or full name' }],
        checks: [{ kind: 'answer', input: 'owner', source: 'owner:final', compare: 'contains', label: 'Owner of “03 Final”' }],
        open: 'final',
      },
      {
        id: 'u10-grant', type: 'hands-on', title: 'Grant a group read access', xp: 35, requires: ['u01-structure'],
        brief: 'Reviewers need to open documents in “02 Review”, nothing more.',
        steps: [
          'Open the Permissions page of “02 Review”.',
          'Grant Access to a group (for example “{{group}}”).',
          'Give it See and See Contents only, and save.',
        ],
        checks: [{ kind: 'permissions', node: 'review', expect: 'assignedAccess', label: 'A user or group has See Contents in Assigned Access on “02 Review”' }],
        open: 'review',
      },
      {
        id: 'u10-private', type: 'hands-on', title: 'Make a folder private', xp: 35, requires: ['u01-sandbox'],
        steps: [
          'In “{{sandbox}}”, create a folder named “Private”.',
          'On its Permissions page, remove Public Access (or remove its See permission).',
          'If Public Access isn\'t listed at all, your workspace already starts private — note that and check your work.',
        ],
        checks: [
          { kind: 'child', parent: 'sandbox', name: 'Private', types: [0], saveAs: 'privateFolder', label: 'Folder “Private”' },
          { kind: 'permissions', node: 'privateFolder', expect: 'publicRestricted', label: 'Public Access cannot see it' },
        ],
        open: 'sandbox',
      },
      {
        id: 'u10-subitems', type: 'practice', title: 'Apply a change to sub-items', xp: 15, requires: ['u10-grant'],
        steps: ['On “{{sandbox}}”, change one permission for a group.', 'Choose to apply it to This Item & Sub-Items.', 'Open a sub-folder and confirm the change arrived.'],
        reflection: 'What happens to sub-items on which you do not have Edit Permissions?',
      },
      {
        id: 'u10-quiz', type: 'quiz', title: 'Knowledge check: permissions', xp: 35,
        questions: [
          { q: 'You MOVE a document from Folder A to Folder B. Its permissions…', options: ['become Folder B\'s', 'stay as they were', 'are reset to owner only', 'are merged'], answer: 1, explain: 'Moving keeps the original permissions.' },
          { q: 'You COPY a document from Folder A to Folder B. The copy\'s permissions…', options: ['match the original', 'come from Folder B, and you become the owner', 'are empty', 'are owner-only'], answer: 1, explain: 'A copy behaves like a newly added item in the destination.' },
          { q: 'Ann adds a document to a folder owned by Bob. Who owns the new document, and with which rights?', options: ['Bob, with his rights', 'Ann, with the rights defined for the owner on the folder', 'Ann, with full control always', 'The owner group'], answer: 1, explain: 'The adder becomes owner and inherits the parent\'s owner-entry permissions.' },
          { q: 'Which is recommended practice?', options: ['Assign permissions to individual users', 'Assign permissions to groups', 'Give Public Access full control', 'Never use Owner Group'], answer: 1, explain: 'Groups make access models maintainable.' },
          { q: 'Which permission lets you change an item\'s ACL?', options: ['Modify', 'Edit Attributes', 'Edit Permissions', 'Delete'], answer: 2, explain: 'Edit Permissions opens the Permissions page for changes.' },
          { q: 'A group has See Contents on a folder. What access does it get on a discussion added to that folder?', options: ['None', 'Read', 'Write', 'Administer'], answer: 1, explain: 'See Contents maps to Read, Modify to Write, Edit Permissions to Administer.' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ U11
  {
    id: 'u11', track: 'user', title: 'Users and groups', source: `${SRC} — Ch. 11`,
    summary: 'Accounts, department groups, DefaultGroup, privileges, group leaders.',
    lesson: [
      'A fresh installation has one user (Admin) and three groups: Business Administrators, DefaultGroup and eLink. Other accounts are created by administrators — in current versions through OTDS.',
      'Every user belongs to at least one group; the department group is the principal one. DefaultGroup catches users who have no department. Groups can contain other groups.',
      'Privileges are system-wide abilities (log in, create certain item types, create users/groups, System Administration rights…). System Administration rights see every item regardless of permissions. A group leader may add or remove members and delete the group.',
    ],
    keyPoints: ['Users and groups are used to grant access, assign work, and set default notifications.', 'eDiscovery rights are granted per user by an administrator.'],
    missions: [
      {
        id: 'u11-groups', type: 'investigate', title: 'Which groups are you in?', xp: 20,
        steps: ['Open My Account ▸ My Groups.', 'Type the name of any group you belong to.'],
        inputs: [{ key: 'group', label: 'A group you belong to' }],
        checks: [{ kind: 'answer', input: 'group', source: 'user.groups', compare: 'text', label: 'Group membership' }],
      },
      {
        id: 'u11-department', type: 'investigate', title: 'Find your department group', xp: 20,
        steps: ['Look at your profile or your own entry in Users & Groups.', 'Find your department (base) group.'],
        inputs: [{ key: 'dept', label: 'Your department group' }],
        checks: [{ kind: 'answer', input: 'dept', source: 'user.department', compare: 'text', label: 'Department group' }],
      },
      {
        id: 'u11-create-group', type: 'hands-on', title: 'Create a review group', xp: 40,
        brief: 'Needs the privilege to create groups. Skip it if you don\'t have that privilege.',
        steps: ['Enterprise ▸ Users & Groups ▸ Add Group.', 'Name it “OTA {{user}} Reviewers”.', 'Add at least one member (yourself is fine).'],
        checks: [{ kind: 'groupExists', search: 'OTA {{user}}', nameRegex: '^OTA {{user}} Reviewers$', minMembers: 1, saveAs: 'myGroup', label: 'Group “OTA {{user}} Reviewers” with 1+ member' }],
      },
      {
        id: 'u11-quiz', type: 'quiz', title: 'Knowledge check: users & groups', xp: 30,
        questions: [
          { q: 'What is special about DefaultGroup?', options: ['It has System Administration rights', 'It catches users who don\'t belong to a department group', 'It is created per project', 'It only contains LDAP users'], answer: 1, explain: 'DefaultGroup is the first group and acts as the fallback department.' },
          { q: 'What can a group leader do?', options: ['Change system privileges', 'Add or remove members and delete the group', 'Restore deleted items', 'Edit OTDS settings'], answer: 1, explain: 'Group leaders manage membership of their group.' },
          { q: 'What do System Administration rights provide?', options: ['Access to all items without permission filtering', 'Only access to the Admin pages', 'Only user creation', 'eDiscovery mode'], answer: 0, explain: 'Sysadmin rights bypass permission filtering and give access to the Administration pages (with their password).' },
          { q: 'Can a group contain another group?', options: ['No', 'Yes', 'Only in projects', 'Only DefaultGroup'], answer: 1, explain: 'Groups can be nested.' },
          { q: 'Which account exists immediately after installation?', options: ['Guest', 'Admin', 'otdsadmin only', 'Knowledge Manager'], answer: 1, explain: 'The Admin user is created at install and placed in DefaultGroup and Business Administrators.' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ U12
  {
    id: 'u12', track: 'user', title: 'Personalizing your environment', source: `${SRC} — Ch. 12`,
    summary: 'Notifications, profile, settings and LiveReports.',
    lesson: [
      'The Personal menu gathers what is yours: Personal Workspace, Favorites, Assignments, Workflows, Notification, Reports and more. My Account holds your profile, settings, groups and password.',
      'Notifications email you about changes. General interests cover categories of events; specific interests are set on individual items. Administrators can set a default notification for a group.',
      'LiveReports are predefined reports (queries) you can run; My Account ▸ Settings controls general, color and column preferences.',
    ],
    keyPoints: ['Set specific notifications on the items you really care about, not everything.'],
    missions: [
      {
        id: 'u12-userid', type: 'investigate', title: 'Find your user ID', xp: 20,
        steps: ['Open your profile (My Account ▸ Edit Profile).', 'Your numeric user ID appears in the page address (userId=…).'],
        inputs: [{ key: 'uid', label: 'Your numeric user ID' }],
        checks: [{ kind: 'answer', input: 'uid', source: 'user.id', compare: 'number', label: 'Your user ID' }],
      },
      {
        id: 'u12-notify', type: 'practice', title: 'Get notified about changes', xp: 15, requires: ['u01-sandbox'],
        steps: ['Set a notification on “{{sandbox}}” for new items and changes.', 'Open Personal ▸ Notification and review your interests and delivery schedule.'],
        reflection: 'Which events did you subscribe to, and how often will you receive the report?',
      },
      {
        id: 'u12-settings', type: 'practice', title: 'Tune your settings', xp: 10,
        steps: ['Open My Account ▸ Settings.', 'Change one General setting and one Color setting, then change them back if you prefer.'],
        reflection: 'What did you change and why might another user choose differently?',
      },
      {
        id: 'u12-quiz', type: 'quiz', title: 'Knowledge check: personalizing', xp: 20,
        questions: [
          { q: 'Where do you review which events you are notified about?', options: ['Tools ▸ Recycle Bin', 'Personal ▸ Notification', 'Enterprise ▸ Categories', 'Properties ▸ Audit'], answer: 1, explain: 'Personal ▸ Notification lists your interests and schedule.' },
          { q: 'Where do you see the groups you belong to?', options: ['My Account ▸ My Groups', 'Personal ▸ Favorites', 'Admin pages only', 'Properties ▸ General'], answer: 0, explain: 'My Account ▸ My Groups lists your memberships.' },
          { q: 'What are LiveReports?', options: ['Real-time chat', 'Predefined report objects that run queries', 'Workflow maps', 'Audit logs'], answer: 1, explain: 'LiveReports run defined queries and present the results.' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ U13
  {
    id: 'u13', track: 'user', title: 'Smart View essentials', source: `${SRC} — Ch. 13`,
    summary: 'Perspectives, tiles and everyday actions in Smart View.',
    lesson: [
      'Smart View (Smart UI) is the modern, simplified interface, reached at …/cs.exe/app or from the Classic UI. Its home page shows a perspective — a layout of tiles chosen for your role.',
      'You can browse, search (including inside a tile), filter, create virtual folders, add items by the Add menu or drag-and-drop, and use the item actions: rename, edit, copy link, share, view permissions, download, reserve/unreserve, copy/move, add version, delete, view metadata and add categories.',
    ],
    keyPoints: ['Perspectives are configured by administrators per role or location.'],
    missions: [
      {
        id: 'u13-rename', type: 'hands-on', title: 'Rename in Smart View', xp: 25, requires: ['u01-structure'],
        steps: ['Open {{smartUrl}} and browse to “{{sandbox}}”.', 'Rename “02 Review” to “02 In Review” using the Rename action.'],
        checks: [{ kind: 'prop', node: 'review', field: 'name', op: 'equals', value: '02 In Review', label: 'Folder renamed to “02 In Review”' }],
        open: 'review',
      },
      {
        id: 'u13-fav', type: 'hands-on', title: 'Star your sandbox', xp: 20, requires: ['u01-sandbox'],
        steps: ['In Smart View, mark “{{sandbox}}” as a favorite (star icon).', 'Open the Favorites tile to see it.'],
        checks: [{ kind: 'favorite', node: 'sandbox', label: '“{{sandbox}}” is in your Favorites' }],
        open: 'sandbox',
      },
      {
        id: 'u13-tour', type: 'practice', title: 'Read your perspective', xp: 10,
        steps: ['Look at the tiles on your Smart View home page.', 'Open Recently Accessed and Favorites.'],
        reflection: 'List the tiles on your home page and say which one you would use most.',
      },
      {
        id: 'u13-quiz', type: 'quiz', title: 'Knowledge check: Smart View', xp: 20,
        questions: [
          { q: 'What decides the tiles you see on the Smart View home page?', options: ['Your browser', 'A perspective based on your role', 'Your Favorites', 'The document type'], answer: 1, explain: 'Perspectives define the layout per role (or location).' },
          { q: 'Which URL path usually opens Smart View?', options: ['…/cs.exe?func=admin.index', '…/cs.exe/app', '…/otds-admin', '…/cs.exe/open/home'], answer: 1, explain: 'Smart View lives under /app on the Content Server URL.' },
          { q: 'Which of these can you do directly in Smart View?', options: ['Only browse', 'Rename, reserve, add versions and add categories', 'Only search', 'Only view permissions'], answer: 1, explain: 'Smart View covers everyday document actions, including categories.' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ U14
  {
    id: 'u14', track: 'user', title: 'Enterprise Connect & Office integration', source: `${SRC} — Ch. 14`,
    summary: 'Work with Content Server from Windows Explorer, Office and Outlook.',
    lesson: [
      'Enterprise Connect brings Content Server into Windows Explorer, Microsoft Office and Outlook: browse in panes, preview, drag-and-drop, edit from Office, save emails, search and work offline.',
      'Briefcases download a set of documents for offline work and return them afterwards. Work Offline and Manage Local Documents track local copies. OpenText Office Editor handles editing round-trips; Email Services turns saved mail into searchable email objects.',
    ],
    keyPoints: ['Save to Content Server straight from Office with Save As.', 'Outlook Quick Steps and Send & Save file mail as you send it.'],
    missions: [
      {
        id: 'u14-explorer', type: 'practice', title: 'Use Content Server from Windows', xp: 15,
        steps: ['If Enterprise Connect is installed, open it and browse to “{{sandbox}}”.', 'Preview a document in the preview pane and drag a file into “01 Drafts”.'],
        reflection: 'Which task felt faster in Enterprise Connect than in the browser?',
      },
      {
        id: 'u14-outlook', type: 'practice', title: 'File mail from Outlook', xp: 15,
        steps: ['In Outlook, drag an email into your sandbox via the Enterprise Connect pane, or use Send and Save.'],
        reflection: 'Where did the email land and which metadata was captured automatically?',
      },
      {
        id: 'u14-quiz', type: 'quiz', title: 'Knowledge check: Enterprise Connect', xp: 20,
        questions: [
          { q: 'What is a briefcase in Enterprise Connect?', options: ['An encrypted folder on the server', 'A set of documents downloaded for offline work and returned later', 'A type of workflow', 'A search form'], answer: 1, explain: 'Briefcases streamline taking documents offline and returning them.' },
          { q: 'Which applications does Enterprise Connect integrate with?', options: ['Only Outlook', 'Windows Explorer, Microsoft Office and Outlook', 'Only SAP', 'Only mobile devices'], answer: 1, explain: 'It integrates the desktop: Explorer, Office and Outlook.' },
          { q: 'What does Send and Save do in Outlook?', options: ['Sends an email and files a copy in Content Server', 'Sends a link only', 'Encrypts the email', 'Deletes the email after sending'], answer: 0, explain: 'The message is sent and saved to Content Server in one step.' },
        ],
      },
    ],
  },
];
