'use strict';
// Track 3 — Analyst & Administrator: architecture, administration, records,
// workflow design, search/metadata governance and Extended ECM.
// Scope follows the "Mastering OpenText Content Suite / Extended ECM" plan
// (modules 1–6). Lessons stick to well-established platform concepts.

const SRC = 'Mastering OpenText Content Suite / Extended ECM';

module.exports = [
  // ------------------------------------------------------------------ A01
  {
    id: 'a01', track: 'admin', title: 'Architecture & terminology', source: `${SRC} — Module 1`,
    summary: 'How a request travels through Content Server, and the words for its parts.',
    lesson: [
      'A browser request reaches a web server, which hands it to Content Server through its gateway (cs.exe as CGI, or llisapi.dll under IIS; servlet variants exist too). The Content Server engine applies business logic and permissions, stores metadata in a relational database, and stores file content in storage it manages — typically an External File Store.',
      'Search runs in its own set of processes: document conversion and extraction feed an Update Distributor, which sends data to Index Engines; Search Engines answer queries and a Search Federator combines their results. OTDS provides users, groups and single sign-on. Integrations and Smart View use the REST API (…/api/v1 and …/api/v2).',
      'Core vocabulary: node (any item), container (an item that holds others), volume (a root such as Enterprise, Personal, Categories), category/attribute (custom metadata), classification, business workspace and workspace type (Extended ECM).',
    ],
    keyPoints: ['Metadata → database. Content → storage provider / EFS.', 'Everything in the UI is also reachable through REST — this trainer uses it.'],
    missions: [
      {
        id: 'a01-version', type: 'investigate', title: 'Identify the server version', xp: 20,
        steps: ['Find the Content Server version (Help ▸ About in the Classic UI, the Administration pages, or ask your administrator).', 'Type it below, e.g. 16.2.4.'],
        inputs: [{ key: 'version', label: 'Content Server version' }],
        checks: [{ kind: 'answer', input: 'version', source: 'server.version', compare: 'contains', lenient: true, label: 'Server version' }],
      },
      {
        id: 'a01-request-path', type: 'practice', title: 'Trace a request', xp: 20,
        steps: ['Open any document in your sandbox.', 'Write down every component the request passes through, from browser to disk and back.'],
        reflection: 'Describe the path of “open document” through web server, gateway, Content Server engine, database and storage.',
      },
      {
        id: 'a01-quiz', type: 'quiz', title: 'Knowledge check: architecture', xp: 30,
        questions: [
          { q: 'Where are document metadata and document content usually kept?', options: ['Both in the browser cache', 'Metadata in the database; content in managed storage such as an External File Store', 'Both inside OTDS', 'Content in the database; metadata in files'], answer: 1, explain: 'The database holds metadata; files live in storage managed by Content Server.' },
          { q: 'Which component combines results from several Search Engines?', options: ['Update Distributor', 'Search Federator', 'Index Engine', 'Document Conversion Server'], answer: 1, explain: 'The Search Federator distributes queries and merges results.' },
          { q: 'What does the Update Distributor do?', options: ['Answers user queries', 'Distributes new and changed data to Index Engines', 'Authenticates users', 'Renders thumbnails'], answer: 1, explain: 'It feeds indexing work to the Index Engines.' },
          { q: 'Which gateway file is typical for Content Server running under IIS?', options: ['llisapi.dll', 'otds.war', 'index.php', 'search.exe'], answer: 0, explain: 'llisapi.dll is the ISAPI gateway; cs.exe is the CGI one.' },
          { q: 'In Content Server terminology, what is a node?', options: ['A server in a cluster only', 'Any item in the repository tree', 'A user account', 'A search partition'], answer: 1, explain: 'Folders, documents, workflows, etc. are all nodes with a node ID.' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ A02
  {
    id: 'a02', track: 'admin', title: 'Administration fundamentals', source: `${SRC} — Module 2`,
    summary: 'Privileges vs permissions, the Administration pages, core accounts.',
    lesson: [
      'Permissions are per item (ACLs); privileges are system-wide abilities attached to users and groups: log in, public access, create/modify users and groups, user administration rights, system administration rights, and item-creation privileges for restricted types.',
      'The Administration pages (…/cs.exe?func=admin.index) are protected by a separate administration password and hold server configuration, search administration, notifications, module and system settings. Identity is normally managed in OTDS and synchronised into Content Server.',
      'The Admin user created at install has full access and privileges; everyday administration should use named accounts with only the rights they need.',
    ],
    keyPoints: ['System Administration rights bypass permission filtering — grant sparingly.', 'Audit and system reports help prove who did what.'],
    missions: [
      {
        id: 'a02-rights', type: 'investigate', title: 'Check your own privileges', xp: 20,
        steps: ['Open your user record (Enterprise ▸ Users & Groups, or your profile) and look at your privileges.', 'Do you hold System Administration rights? Answer yes or no.'],
        inputs: [{ key: 'sysadmin', label: 'System Administration rights? (yes/no)' }],
        checks: [{ kind: 'answer', input: 'sysadmin', source: 'user.isSysAdmin', compare: 'yesno', label: 'System Administration rights' }],
      },
      {
        id: 'a02-adminpages', type: 'practice', title: 'Tour the Administration pages', xp: 25, feature: 'admin',
        steps: ['Open {{csUrl}}?func=admin.index and enter the administration password.', 'Find the sections for server configuration, search administration and notifications.'],
        reflection: 'List three administration sections you found and what each controls.',
      },
      {
        id: 'a02-quiz', type: 'quiz', title: 'Knowledge check: administration', xp: 30,
        questions: [
          { q: 'Privileges versus permissions — which is correct?', options: ['Both are set per item', 'Privileges are system-wide abilities; permissions are per item', 'Permissions are system-wide; privileges per item', 'They are synonyms'], answer: 1, explain: 'Privileges apply system-wide; ACL permissions apply to items.' },
          { q: 'What protects the Administration pages in addition to your login?', options: ['Nothing', 'A separate administration password', 'A CAPTCHA', 'An SAP role'], answer: 1, explain: 'The Admin pages ask for their own password.' },
          { q: 'Where are users and groups normally managed in Content Server 16?', options: ['In the Categories volume', 'In OTDS, synchronised to Content Server', 'Only in the database directly', 'In Enterprise Connect'], answer: 1, explain: 'OTDS manages identities for OpenText products.' },
          { q: 'Which privilege lets a user see every item regardless of ACLs?', options: ['Public Access', 'System Administration rights', 'Log-in', 'Create/Modify Groups'], answer: 1, explain: 'System Administration rights bypass permission filtering.' },
          { q: 'Best practice for the built-in Admin account?', options: ['Use it for daily work', 'Share its password with the team', 'Reserve it; administer with named accounts holding only the rights needed', 'Delete it'], answer: 2, explain: 'Named, least-privilege accounts keep actions attributable.' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ A03
  {
    id: 'a03', track: 'admin', title: 'Records management & retention', source: `${SRC} — Module 3`, feature: 'records',
    summary: 'Records, RM classifications, retention schedules, holds and disposition.',
    lesson: [
      'A record is information kept as evidence of business activity. Records Management attaches an RM classification to items; the classification links to a retention schedule (RSI) that defines how long items are kept and what happens afterwards.',
      'Holds (legal or administrative) suspend disposition for items under investigation or litigation. Disposition identifies items whose retention has expired and applies actions such as review, destroy or transfer/archive.',
      'Physical Objects manages paper and other physical items (boxes, locations, labels, circulation). Security Clearance adds clearance levels and supplemental markings on top of permissions.',
    ],
    keyPoints: ['Hold beats retention: an item on hold is not disposed of.', 'RM classifications govern retention; CS classifications only organise.'],
    missions: [
      {
        id: 'a03-explore', type: 'practice', title: 'Inspect a records policy', xp: 20,
        steps: ['If Records Management is installed, open an RM classification and look at its retention schedule.', 'Find where holds are managed.'],
        reflection: 'Describe the retention rule you found (trigger, period, final action) or, if RM is not installed, design one for invoices.',
      },
      {
        id: 'a03-quiz', type: 'quiz', title: 'Knowledge check: records', xp: 30,
        questions: [
          { q: 'What does an RSI (retention schedule) define?', options: ['Who may edit a record', 'How long items are kept and what happens afterwards', 'The search slice', 'The workflow route'], answer: 1, explain: 'Retention schedules set periods and final disposition.' },
          { q: 'An item is due for destruction but is under legal hold. What happens?', options: ['It is destroyed', 'Disposition is suspended while the hold applies', 'It is moved to the Recycle Bin', 'The hold is ignored after 30 days'], answer: 1, explain: 'Holds block disposition.' },
          { q: 'Which is an example of a disposition action?', options: ['Reserve', 'Destroy', 'Add Version', 'Zip & Email'], answer: 1, explain: 'Disposition actions include review, destroy and transfer/archive.' },
          { q: 'What does Physical Objects manage?', options: ['Server hardware', 'Paper and other physical items: boxes, locations, labels, circulation', 'Mobile devices', 'Scanned images only'], answer: 1, explain: 'It tracks physical records alongside electronic ones.' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ A04
  {
    id: 'a04', track: 'admin', title: 'Designing workflows', source: `${SRC} — Module 4`, feature: 'workflow',
    summary: 'Maps, steps, roles, attributes and monitoring.',
    lesson: [
      'A workflow map is built in the Workflow Designer from steps connected by links: user steps (work for a person, group or role), evaluate steps (branch on a condition such as an attribute value), milestones, sub-maps and item-handler steps that act on attached items.',
      'Workflow roles let one map be reused: participants are chosen when the workflow is started instead of being hard-coded. The work package carries attachments, comments and workflow attributes or forms collected along the way.',
      'Workflows can start manually or be triggered by events. Managers monitor instances on status pages, reassign stuck tasks, and suspend, resume or stop instances.',
    ],
    keyPoints: ['Design for the exception path, not only the happy path.', 'Prefer roles or groups over named users in maps.'],
    missions: [
      {
        id: 'a04-map', type: 'hands-on', title: 'Draw a review workflow', xp: 50, requires: ['u01-sandbox'],
        brief: 'Needs the privilege to create workflow maps. Skip if you don\'t have it.',
        steps: [
          'In “{{sandbox}}”: Add Item ▸ Workflow Map named “OTA Review Flow”.',
          'Design: Start → user step “Review” (assigned to a role) → evaluate step “Approved?” → user step “Publish” or back to the author.',
          'Save the map.',
        ],
        checks: [{ kind: 'child', parent: 'sandbox', name: 'OTA Review Flow', types: [128], typeName: 'workflow map', label: 'Workflow map “OTA Review Flow”' }],
        open: 'sandbox',
      },
      {
        id: 'a04-quiz', type: 'quiz', title: 'Knowledge check: workflow design', xp: 30,
        questions: [
          { q: 'Which step type branches the process based on a condition?', options: ['User step', 'Evaluate step', 'Milestone', 'Item handler'], answer: 1, explain: 'Evaluate steps route based on conditions such as attribute values.' },
          { q: 'Why use workflow roles instead of named users in a map?', options: ['Roles run faster', 'Participants can be chosen at start, so one map serves many teams', 'Roles bypass permissions', 'Roles are required by OTDS'], answer: 1, explain: 'Roles make maps reusable.' },
          { q: 'Where are values collected during a workflow stored?', options: ['In the audit log only', 'In workflow attributes/forms in the work package', 'In the Recycle Bin', 'In the map definition'], answer: 1, explain: 'Workflow attributes or forms capture data per instance.' },
          { q: 'A step is stuck because the assignee left the company. What should a workflow manager do?', options: ['Delete the map', 'Reassign the step', 'Restart the server', 'Nothing'], answer: 1, explain: 'Managers can reassign steps of running instances.' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ A05
  {
    id: 'a05', track: 'admin', title: 'Search & metadata governance', source: `${SRC} — Module 5`,
    summary: 'Choose between categories, classifications and folders; keep metadata clean.',
    lesson: [
      'Metadata design answers “how will people find and govern this?”. Categories carry structured attributes; classifications give subject views and (for RM) retention; folders set location and inherited permissions. Most good designs use all three deliberately.',
      'Governance means mandatory attributes for what must never be missing, controlled vocabularies (popup lists, table-key lookups) instead of free text, naming conventions, and a small number of well-owned categories rather than one per team.',
      'Everything indexed becomes searchable: full text, system attributes, categories. Facets and columns are built from the same metadata, so good metadata pays off three times.',
    ],
    keyPoints: ['Free-text fields are where metadata quality dies.', 'Every category needs an owner.'],
    missions: [
      {
        id: 'a05-design', type: 'practice', title: 'Design a contract repository', xp: 40,
        steps: ['Design the metadata for a contracts area: folder structure, one category with its attributes (which are mandatory, which use lists), and a classification or RM approach.'],
        reflection: 'Write your design: folders, category + attributes (mark mandatory and controlled ones), classification/retention, and naming convention.',
        minWords: 60,
      },
      {
        id: 'a05-quiz', type: 'quiz', title: 'Knowledge check: governance', xp: 30,
        questions: [
          { q: 'Users type the same customer name in five different ways. Best fix?', options: ['More training', 'A controlled vocabulary (popup or table-key lookup) instead of free text', 'Make the field optional', 'Add a second free-text field'], answer: 1, explain: 'Controlled lists keep values consistent and searchable.' },
          { q: 'Which is best at giving several subject-based views across folders?', options: ['Permissions', 'Classifications', 'Versions', 'Reservations'], answer: 1, explain: 'Classifications organise by subject independent of location.' },
          { q: 'What should decide whether an attribute is mandatory?', options: ['Whether the field looks important', 'Whether search, reporting, process or retention depends on it', 'The attribute type', 'Whether users like it'], answer: 1, explain: 'Mandatory only what downstream use actually needs.' },
          { q: 'Facets and columns are built from…', options: ['Separate data entry', 'The same metadata held on items', 'The audit log', 'OTDS'], answer: 1, explain: 'Good metadata powers search, facets and columns alike.' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ A06
  {
    id: 'a06', track: 'admin', title: 'Extended ECM & business workspaces', source: `${SRC} — Module 6`, feature: 'businessWorkspaces',
    summary: 'Link content to business objects in SAP, Salesforce, SuccessFactors and more.',
    lesson: [
      'Extended ECM connects Content Server to leading business applications. A business workspace gathers all content about one business object — a customer, an order, an employee — and is linked to that object in the business system.',
      'A workspace type defines how such workspaces are created: the template (folder structure, categories, permissions), naming, location and the business object types it maps to. Related workspaces link, for example, a customer to its orders.',
      'Perspectives define what users see in Smart View or inside the business application (header, tiles for metadata, team, related workspaces, documents). Most of this is configuration; development is only needed for custom connectors or widgets.',
    ],
    keyPoints: ['One business object ↔ one workspace.', 'Configuration first; custom code last.'],
    missions: [
      {
        id: 'a06-types', type: 'investigate', title: 'Count the workspace types', xp: 25,
        steps: ['Ask your administrator or open the Business Workspaces configuration and count the workspace types.', 'Type the number.'],
        inputs: [{ key: 'count', label: 'Number of business workspace types' }],
        checks: [{ kind: 'answer', input: 'count', source: 'bwTypes.count', compare: 'number', label: 'Workspace type count' }],
      },
      {
        id: 'a06-open', type: 'practice', title: 'Walk through a business workspace', xp: 25,
        steps: ['Open a business workspace in Smart View.', 'Identify its header, metadata, team and related-workspace tiles and its documents.'],
        reflection: 'Which business object is this workspace linked to, and what does each tile show?',
      },
      {
        id: 'a06-quiz', type: 'quiz', title: 'Knowledge check: Extended ECM', xp: 30,
        questions: [
          { q: 'What is a business workspace?', options: ['A user\'s Personal Workspace', 'A container of all content about one business object, linked to it in the business system', 'An SAP transaction', 'A search index'], answer: 1, explain: 'Business workspaces tie content to a business object.' },
          { q: 'What does a workspace type define?', options: ['Only the icon', 'Template, naming, location and mapped business object types', 'User passwords', 'Search slices'], answer: 1, explain: 'Workspace types govern creation and structure.' },
          { q: 'How are a customer workspace and its order workspaces connected?', options: ['By copying documents', 'As related workspaces', 'Through the Recycle Bin', 'They cannot be connected'], answer: 1, explain: 'Related workspaces link business objects to each other.' },
          { q: 'Changing which tiles users see in a workspace usually requires…', options: ['Custom Java code', 'Perspective configuration', 'Reinstalling the connector', 'A database change'], answer: 1, explain: 'Perspectives are configured, not coded.' },
        ],
      },
    ],
  },
];
