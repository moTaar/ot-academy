'use strict';
// Track — System Administrator (certification 5-0156). Goes deeper than the
// a01/a02 foundations: architecture and installation, the Administration
// pages, the search grid, storage/database/performance, schema and
// LiveReports, logging and troubleshooting, OTDS and System Center Manager.
// All lesson text is original; see curriculum/CONTENT.md for the format.

const SRC = 'OpenText Content Management Administrator (5-0156) study plan';

module.exports = [
  // ------------------------------------------------------------------ SA01
  {
    id: 'sa01', track: 'sysadmin', title: 'Architecture & installation', source: `${SRC} — 3-0188 System Administration`,
    summary: 'Every tier of a Content Server deployment, how a request flows through it, and how to install and upgrade it without surprises.',
    domains: ['sa-sysadmin'],
    lesson: [
      'The foundations module showed the big picture. Here you learn it the way an administrator needs it: which process owns which job, where it lives on disk, and what breaks when it fails. A Content Server system is a web tier, an engine with worker threads, a database, a content store, a search grid and OTDS — usually spread over several machines but sharing one database and one content store.',
      { figure: { type: 'layers', layers: [
        { label: 'Web tier', items: ['IIS / Apache / Tomcat', 'Gateway: llisapi.dll, cs.exe or servlet'], note: 'Forwards requests; no business logic' },
        { label: 'Engine', items: ['Content Server service', 'Worker threads', 'Agents'], note: 'Permissions, logic, SQL' },
        { label: 'Search grid', items: ['Admin server', 'Data flow', 'Partitions', 'Federator'], note: 'Separate processes' },
        { label: 'Identity', items: ['OTDS'], note: 'Users, groups, SSO, licences' },
        { label: 'Data', items: ['Database', 'External File Store', 'Index files'], note: 'Backed up together' },
      ] }, caption: 'The tiers you administer.' },
      { h: 'One request, end to end' },
      'The browser calls the web server; the gateway opens a socket to the engine (port 2099 by default); one worker thread validates the session, runs the request handler named by the func parameter, checks permissions, runs SQL against the database and reads the file from the storage provider; the answer streams back the same way. Because threads are a fixed pool, one slow request type can make the whole server feel slow even when the CPU is idle.',
      { figure: { type: 'flow', steps: [
        { label: 'Browser', kind: 'actor' },
        { label: 'Web server + gateway', kind: 'system' },
        { label: 'Engine thread', kind: 'system', sub: 'port 2099' },
        { label: 'Database', kind: 'system', sub: 'metadata' },
        { label: 'Storage provider', kind: 'system', sub: 'file bytes' },
        { label: 'Response', kind: 'end' },
      ] }, caption: 'The request path — and the list of places a timeout can occur.' },
      { h: 'Installing' },
      { steps: [
        'Check the release notes and supported-environment matrix for your exact version.',
        'Prepare service accounts, the database (client software, empty database or privileged login), the EFS share and fast local disk for the index.',
        'Run the installer, map the gateway and the /img/ support directory in the web server.',
        'Complete the web-based setup: administration password, database, licence.',
        'Set up search (Admin server, Enterprise data source), integrate OTDS, install modules and patches.',
        'Smoke-test: sign in, add, search, view, notify.',
      ], title: 'Installation in order' },
      'Upgrades follow defined paths. Some are in-place updates; others install the new version beside the old one and upgrade a copy of the database. Modules must be upgraded with the core. Always start with a full, consistent backup of database and content store, and rehearse on a copy to know how long the outage will be.',
      { callout: 'exam', title: 'Exam angle', text: 'Know which component does what (gateway forwards, engine enforces permissions, Admin server supervises search processes, OTDS authenticates), the default engine port, the home-folder layout (config, logs, module, staging, patch, support) and the installation order.' },
      { callout: 'tip', title: 'Keep a build book', text: 'Write down every path, port, account, ini change and patch as you install. It becomes your rebuild and disaster-recovery script.' },
    ],
    keyPoints: [
      'The web tier only forwards; the engine enforces permissions and runs SQL.',
      'Worker threads are a fixed pool — slow requests starve fast ones.',
      'Metadata lives in the database, bytes in the storage provider, searchable copies in the index.',
      'Install order: prerequisites → binaries → web setup → search → OTDS → modules and patches.',
      'Upgrades start with a consistent backup and a rehearsal on a copy.',
    ],
    missions: [
      {
        id: 'sa01-version', type: 'investigate', title: 'Record your server version',
        steps: ['Find the exact Content Server version and update level (System Report, Help ▸ About, or the Administration pages).', 'Type it below, for example 16.2.11 or 23.4.'],
        inputs: [{ key: 'version', label: 'Content Server version' }],
        checks: [{ kind: 'answer', input: 'version', source: 'server.version', compare: 'contains', label: 'Server version' }],
      },
      {
        id: 'sa01-map', type: 'practice', title: 'Map your deployment',
        steps: [
          'List every host of your (or a test) Content Server system and what runs on it: web server, engine, Admin server/search processes, OTDS, database, file store.',
          'For each, note the service account and the log location.',
          'Mark which component is a single point of failure.',
        ],
        reflection: 'Describe your deployment tier by tier, and name the single point of failure you would remove first and how.',
        minWords: 40,
      },
      {
        id: 'sa01-quiz', type: 'quiz', title: 'Knowledge check: architecture & installation',
        questions: [
          { q: "Which component enforces item permissions when a user opens a folder?", options: ["The web server", "The gateway (llisapi.dll / cs.exe)", "The Content Server engine", "The Search Federator"], answer: 2, explain: "The gateway only forwards requests; permission checks and business logic run in the engine threads." },
          { q: "Users report that every page is slow, yet the Content Server host shows low CPU. Thread logs show many long-running report requests. What is the most likely explanation?", options: ["The database is offline", "All worker threads are busy with slow requests, so others queue", "The index is corrupt", "OTDS is down"], answer: 1, explain: "Threads are a fixed pool. Long requests occupy them and new requests wait in the gateway even though the CPU is idle." },
          { q: "Where is opentext.ini found on a standard installation?", options: ["<OTHOME>/config", "<OTHOME>/logs", "<OTHOME>/support", "In the database KIni table only"], answer: 0, explain: "The main configuration file lives in the config folder of the installation home. KIni holds database-backed settings, not the file." },
          { q: "What does the web-based setup ask for after the binaries are installed?", options: ["The OTSCM agent key", "The AD bind account", "Only the search partition size", "The administration password, the database connection and the licence"], answer: 3, explain: "The first browser visit runs setup: admin password, create or connect database, licence. Search and OTDS follow." },
          { q: "Which is the safest first step of any Content Server upgrade?", options: ["Uninstall all optional modules", "Delete the search index", "Take a consistent backup of the database and the content store", "Disable OTDS"], answer: 2, explain: "Everything else can be repeated; lost data cannot. Back up database and content store together (plus config and index)." },
          { q: "Which folder holds static files such as icons and the Smart View application, usually published as /img/?", options: ["staging", "support", "patch", "module"], answer: 1, explain: "The support folder is mapped by the web server. Missing icons usually mean a wrong mapping or URL for it." },
          { q: "What is the default port the gateway uses to reach the Content Server engine?", options: ["2099", "389", "5858", "8080"], answer: 0, explain: "2099 is the classic engine port; 5858 is the Admin server for search; 389 is LDAP." },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ SA02
  {
    id: 'sa02', track: 'sysadmin', title: 'Administration pages & configuration', source: `${SRC} — 3-0188 System Administration, 3-0189 Business Administration`,
    summary: 'Find your way around admin.index, know what lives in opentext.ini versus the database, and manage modules and patches.',
    domains: ['sa-sysadmin', 'sa-bizadmin'],
    lesson: [
      'The Administration pages, opened with ?func=admin.index and protected by the administration password, are the control panel of Content Server. Sections group server configuration, database administration, storage providers, search, modules, notifications, directory integration and reports. Optional modules add their own sections, and labels move between releases — learn the groups, not the exact pixel positions.',
      { figure: { type: 'hub', center: 'admin.index', items: [
        { label: 'Server configuration', sub: 'parameters, security, logging' },
        { label: 'Database', sub: 'verify, repair' },
        { label: 'Storage providers', sub: 'providers, rules' },
        { label: 'Search', sub: 'System Object Volume' },
        { label: 'Modules', sub: 'install, upgrade' },
        { label: 'Notifications', sub: 'SMTP, agent' },
        { label: 'Directory integration', sub: 'OTDS' },
        { label: 'System Report', sub: 'for Support' },
      ] }, caption: 'The main groups of the Administration pages.' },
      { h: 'File or database?' },
      'Some settings are written to opentext.ini on the instance that served the page and need a restart; others live in database tables such as KIni and apply to the whole cluster at once. In a cluster, keep every instance’s opentext.ini consistent and record each change.',
      { figure: { type: 'compare', items: [
        { title: 'opentext.ini', tone: 'info', points: ['Per instance', 'Read at start-up', 'Logging, paths, host values'] },
        { title: 'Database settings', tone: 'accent', points: ['Whole system', 'Shared by all instances', 'Backed up with the database'] },
      ] } },
      { h: 'Modules and patches' },
      { steps: [
        'Run the module installer: files land in the staging folder.',
        'Module Administration ▸ Install Modules: select the staged module.',
        'Restart Content Server; complete any configuration it asks for.',
        'Repeat the installer on every instance of the cluster.',
        'For hot fixes: copy patch files into <OTHOME>/patch and restart; check the System Report lists them.',
      ], title: 'Module and patch routine' },
      { h: 'Business features you support' },
      'Business administrators (often the Business Administrators group) configure categories, columns and facets, search forms, perspectives, Recycle Bin retention and auditing interests. You make sure the platform can carry them: category upgrades and new attributes cause indexing work; auditing grows the audit table; Recycle Bin purges run as background tasks; notifications need SMTP and a running agent.',
      { callout: 'warn', title: 'Same code on every node', text: 'A module or patch missing on one front-end produces errors that look random to users. Compare System Reports of all instances after every change.' },
      { callout: 'exam', title: 'Exam angle', text: 'Know the admin URL and password, which section owns which task, the staging → Install Modules → restart sequence, the patch folder, and the System Report as the standard evidence for Support.' },
    ],
    keyPoints: [
      'admin.index needs System Administration rights plus the administration password.',
      'opentext.ini is per instance and read at start-up; database settings are shared.',
      'Modules: installer → staging → Install Modules → restart, on every instance.',
      'Patches go into the patch folder and need a restart.',
      'Business configuration has platform costs: indexing, audit growth, background purges.',
    ],
    missions: [
      {
        id: 'sa02-rights', type: 'investigate', title: 'Do you hold System Administration rights?',
        steps: ['Check your own account’s privileges (your profile, or Users and Groups in the Classic UI).', 'Answer yes or no.'],
        inputs: [{ key: 'sysadmin', label: 'System Administration rights? (yes/no)' }],
        checks: [{ kind: 'answer', input: 'sysadmin', source: 'user.isSysAdmin', compare: 'yesno', label: 'System Administration rights' }],
      },
      {
        id: 'sa02-report', type: 'practice', title: 'Read a System Report', feature: 'admin',
        steps: [
          'Open {{csUrl}}?func=admin.index on a test system and enter the administration password.',
          'Generate the System Report.',
          'Find: the Content Server version, three installed optional modules with versions, the loaded patches, and the database type.',
        ],
        reflection: 'List the version, three modules, the number of loaded patches and the database type you found, and say why Support asks for this report first.',
      },
      {
        id: 'sa02-quiz', type: 'quiz', title: 'Knowledge check: administration pages',
        questions: [
          { q: "Which URL parameter opens the Administration pages?", options: ["func=search", "func=otds.admin", "func=ll", "func=admin.index"], answer: 3, explain: "admin.index is the entry point; it then asks for the administration password." },
          { q: "You edit opentext.ini on front-end 1 of a three-node cluster. What else is normally required?", options: ["Re-run the web-based setup", "Nothing — the database replicates it", "Restart that instance and apply the same change on the other instances", "Reindex the search grid"], answer: 2, explain: "The file is per instance and read at start-up. Keep all instances consistent and restart them." },
          { q: "A module installer has finished. Where does the module appear before you install it in Content Server?", options: ["In the patch folder", "In the staging folder, listed under Install Modules", "In the Categories volume", "In OTDS"], answer: 1, explain: "Installers place modules in staging; Module Administration ▸ Install Modules activates them." },
          { q: "Where are storage rules configured?", options: ["Storage Provider Settings", "Notification Administration", "OTDS", "Search Administration"], answer: 0, explain: "Storage providers and the ordered rules that pick one live under Storage Provider Settings." },
          { q: "Which document should you attach to almost every OpenText Support case?", options: ["The license file", "A screenshot of the login page", "The KUAF table export", "The System Report"], answer: 3, explain: "It summarises versions, modules, patches, database and configuration in one file." },
          { q: "A business administrator adds three new attributes to a heavily used category and upgrades all items. What platform effect should the system administrator expect?", options: ["A new storage provider", "None", "Background upgrade work and re-extraction load on the search grid", "OTDS resynchronisation"], answer: 2, explain: "Category upgrades change many items, which generates background work and indexing events." },
          { q: "How are hot-fix patches applied manually?", options: ["Through Install Modules", "Copied into <OTHOME>/patch, then the instance is restarted", "Uploaded to the Enterprise Workspace", "Imported with a LiveReport"], answer: 1, explain: "Patches are loaded from the patch folder at start-up. Repeat on every instance." },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ SA03
  {
    id: 'sa03', track: 'sysadmin', title: 'Search infrastructure', source: `${SRC} — 3-0188 System Administration`,
    summary: 'Admin servers, the data flow from Extractor to Index Engine, partitions, the query path through the Search Federator, and how to keep it healthy.',
    domains: ['sa-sysadmin'],
    lesson: [
      'Search runs outside the engine, in processes supervised by Admin servers (otadmin, port 5858 by default). Content Server records indexing events in a queue table; the Extractor collects metadata and content; Document Conversion turns files into text; the Update Distributor hands batches to the Index Engine of the right partition. Interchange pools (iPools) sit between these stages: a growing iPool shows exactly where a backlog is.',
      { figure: { type: 'flow', steps: [
        { label: 'Event queued', kind: 'start' },
        { label: 'Extractor', kind: 'system' },
        { label: 'Document Conversion', kind: 'system' },
        { label: 'Update Distributor', kind: 'system' },
        { label: 'Index Engines', kind: 'system' },
        { label: 'Searchable', kind: 'end' },
      ] }, caption: 'The indexing data flow; an iPool separates each stage.' },
      'Queries go the other way: Content Server sends them to the Search Federator, which asks the Search Engine of every partition and merges the results; Content Server then removes what the user may not see. Each partition is a slice of the index with its own Index Engine (writes) and Search Engine (reads). When read-write partitions fill, add a partition and set full ones to update-only.',
      { figure: { type: 'tree', root: { label: 'Enterprise Data Source Folder', icon: 'folder', children: [
        { label: 'Data Flow Manager', icon: 'server', note: 'Extractor, DCS, Update Distributor' },
        { label: 'Partition Map', icon: 'search', note: 'partitions with Index + Search Engines' },
        { label: 'Search Manager', icon: 'search', note: 'Search Federator' },
      ] } }, caption: 'Where the processes appear: Search Administration ▸ Open the System Object Volume.' },
      { steps: [
        'Open Search Administration ▸ Open the System Object Volume.',
        'Check every process is running.',
        'Look at the iPool counts in the data flow — small and moving is healthy.',
        'Check partition fullness in the partition map.',
        'Search for a document added today.',
      ], title: 'Daily search health check' },
      { callout: 'tip', title: 'Cheapest fix first', text: 'Restart a stopped process or re-extract a single item before considering a full reindex, which can take days on a large system.' },
      { callout: 'exam', title: 'Exam angle', text: 'Update Distributor = sends data to Index Engines. Search Federator = sends queries to Search Engines. Admin server = starts and monitors processes. Full partitions → add a partition.' },
    ],
    keyPoints: [
      'Extractor → Document Conversion → Update Distributor → Index Engines.',
      'Search Federator fans queries out to every partition’s Search Engine.',
      'A growing iPool shows where the backlog is.',
      'Results are permission-filtered by Content Server after the search.',
      'Add partitions before read-write ones fill up.',
    ],
    missions: [
      {
        id: 'sa03-health', type: 'practice', title: 'Run a search health check', feature: 'admin',
        steps: [
          'On a test system open {{csUrl}}?func=admin.index ▸ Search Administration ▸ Open the System Object Volume.',
          'Open the Enterprise data source and record each process’s status and host.',
          'Record the number of items waiting in each iPool and how full each partition is.',
        ],
        reflection: 'Report the status of the data flow, the iPool counts and partition fullness, and say what you would do if one iPool kept growing.',
      },
      {
        id: 'sa03-draw', type: 'practice', title: 'Explain the search grid',
        steps: ['Without looking at the guide, draw the indexing path and the query path, naming every process.', 'Compare with the search architecture guide and correct it.'],
        reflection: 'Explain in your own words what each search process does and which one you would check first if new documents were not searchable.',
        minWords: 40,
      },
      {
        id: 'sa03-quiz', type: 'quiz', title: 'Knowledge check: search infrastructure',
        questions: [
          { q: "Which process converts Word and PDF files into indexable text?", options: ["Document Conversion", "Search Federator", "Admin server", "Update Distributor"], answer: 0, explain: "Document Conversion (DCS) applies format filters. Files it cannot convert are indexed with metadata only." },
          { q: "What supervises and starts the search processes on a host?", options: ["The Search Federator", "OTDS", "The notification agent", "The Admin server"], answer: 3, explain: "Admin servers (otadmin) start, stop and monitor the processes on their host." },
          { q: "New documents are not searchable. The iPool between Document Conversion and the Update Distributor keeps growing. Which process should you investigate first?", options: ["The web server", "The Extractor", "The Update Distributor", "The Search Federator"], answer: 2, explain: "A backlog builds up just before the slow or stopped process — here, the Update Distributor." },
          { q: "All read-write partitions are nearly full. What is the standard response?", options: ["Delete old documents", "Add a partition and set the full ones to update-only", "Disable full-text indexing", "Restart OTDS"], answer: 1, explain: "New partitions take new objects; update-only partitions still accept changes to objects they hold." },
          { q: "Where do you manage search processes in the Classic UI?", options: ["Search Administration ▸ System Object Volume", "Personal Workspace", "Categories volume", "Enterprise Workspace"], answer: 0, explain: "Search objects (data flow, partitions, federator) live in the System Object Volume." },
          { q: "A user cannot find a document that an administrator finds easily. What is the most likely reason?", options: ["The Update Distributor is stopped", "The partition is read-only", "The index is corrupt", "The user lacks permission or uses a narrower search scope"], answer: 3, explain: "If the admin finds it, it is indexed. Results are permission-filtered and scoped by slices." },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ SA04
  {
    id: 'sa04', track: 'sysadmin', title: 'Storage, database & performance', source: `${SRC} — 3-0188 System Administration`,
    summary: 'Storage providers and rules, database care and consistent backups, background agents, clustering and a method for performance tuning.',
    domains: ['sa-sysadmin'],
    lesson: [
      'Content Server stores metadata in the database and file bytes in storage providers — usually an External File Store on a share, sometimes Archive Center. Storage rules, evaluated in order with the first match winning, decide where each new version goes; changing a rule never moves existing content. The database keeps a reference to each version’s location, so never rename or move files inside an EFS by hand.',
      { figure: { type: 'flow', steps: [
        { label: 'New version', kind: 'start' },
        { label: 'Storage rules', kind: 'decision', sub: 'first match wins' },
        { label: 'Provider', kind: 'system', sub: 'EFS / Archive Center' },
        { label: 'Reference in DB', kind: 'end' },
      ] }, caption: 'How content finds its home.' },
      { h: 'Consistent backups' },
      'Database and content store must describe the same moment. Back up the database first, then the content store: files written in between are harmless orphans, while rows pointing to missing files are lost documents. Add the installation home (config, modules, patches), the search index (or a plan to rebuild it) and OTDS. Prove it with a restore drill.',
      { figure: { type: 'timeline', items: [
        { when: '01:15', label: 'Database backup' },
        { when: '02:00', label: 'EFS backup' },
        { when: '03:00', label: 'Config and index' },
        { when: '04:00', label: 'Check results' },
      ] }, caption: 'A nightly sequence.' },
      { h: 'Background work and clusters' },
      'Agents send notifications and run scheduled jobs; Distributed Agents spread long tasks (large copies, deletes, purges) over workers. In a cluster, front-ends serve users while back-ends run agents, workers and search. All instances share the database, content store and search grid, and must run identical versions, modules and patches.',
      { steps: [
        'Measure a baseline (summary timings, Performance Analyzer).',
        'Locate the tier: engine threads, database, storage, search, network.',
        'Find the cause with evidence (connect logs, database tools).',
        'Change one thing, then measure again.',
      ], title: 'Performance tuning loop' },
      { callout: 'warn', title: 'Restored copies', text: 'A test copy of production has real email addresses and the production OTDS resource ID. Disable notifications and agents and point it at its own resource before starting it.' },
      { callout: 'exam', title: 'Exam angle', text: 'Rules choose providers for new content only; backups go database first; front-end vs back-end roles; instances must be identical; Performance Analyzer reads summary timing logs.' },
    ],
    keyPoints: [
      'Storage rules are ordered and apply to new versions only.',
      'Back up database first, then the content store.',
      'Front-ends serve users; back-ends run agents, Distributed Agents and search.',
      'Every instance must run the same version, modules and patches.',
      'Tune one variable at a time against a measured baseline.',
    ],
    missions: [
      {
        id: 'sa04-storage', type: 'practice', title: 'Review the storage design', feature: 'admin',
        steps: [
          'On a test system open Storage Provider Settings on the Administration pages.',
          'List the providers and the storage rules in order.',
          'Add a test document that should match a specific rule and confirm (in the UI or with SQL on DVersData/ProviderData) where it went.',
        ],
        reflection: 'Describe the providers and rules you found, where your test document landed, and one risk in the current rule order.',
      },
      {
        id: 'sa04-backup', type: 'practice', title: 'Write a backup and restore plan',
        steps: ['List every component that must be backed up for your system.', 'Write the nightly order and the restore steps, including what you change on a restored copy before starting it.'],
        reflection: 'Give your backup order with reasons, your restore steps, and the recovery time you expect.',
        minWords: 50,
      },
      {
        id: 'sa04-quiz', type: 'quiz', title: 'Knowledge check: storage, database & performance',
        questions: [
          { q: "An administrator changes a storage rule so that PDFs go to a new EFS. What happens to existing PDFs?", options: ["They become unreadable", "They are moved overnight automatically", "They stay where they are until migrated with storage management tools", "They are deleted from the old store"], answer: 2, explain: "Rules are evaluated when a version is written. Existing versions keep their provider." },
          { q: "Which backup order keeps the database and EFS consistent?", options: ["EFS first, then database", "Database first, then EFS", "Either; order never matters", "Only the EFS needs a backup"], answer: 1, explain: "Files added after the database backup are orphans at worst; the reverse order loses documents." },
          { q: "Several storage rules could match a document. Which one is used?", options: ["The first matching rule in the list", "The one with the largest provider", "A random one", "The last one"], answer: 0, explain: "Rules are evaluated in order and the first match wins; the default rule goes last." },
          { q: "In a cluster, which component is normally NOT shared by all Content Server instances?", options: ["The search grid", "The database", "The content store", "opentext.ini"], answer: 3, explain: "Each instance has its own opentext.ini; database, storage and search are shared." },
          { q: "Which tool analyses summary timing logs to show slow request types and thread usage?", options: ["System Center Manager", "Transport Warehouse", "OpenText Performance Analyzer", "OTDS"], answer: 2, explain: "Performance Analyzer (OTPA) reads summary timing logs." },
          { q: "Why do many designs keep agents off the front-end instances?", options: ["Agents cannot run on Windows", "So batch work does not compete with interactive user requests", "Licensing forbids it", "Agents need OTDS"], answer: 1, explain: "Separating background work from user traffic keeps pages responsive and agent logs in one place." },
          { q: "Only some documents fail to open with a “file not found” error; the rest work. What do you check first?", options: ["The provider reference of the failing version and whether the file exists on the share", "The search partition map", "The SMTP server", "OTDS access role"], answer: 0, explain: "If most documents open, the share is reachable; the specific file is missing or mis-referenced." },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ SA05
  {
    id: 'sa05', track: 'sysadmin', title: 'Schema & LiveReports', source: `${SRC} — 3-0127 Schema and Report Fundamentals`,
    summary: 'The core tables behind items, versions, users, permissions, categories, audit and workflow; safe SQL; and LiveReports with inputs and sub-reports.',
    domains: ['sa-schema'],
    lesson: [
      'Every feature of Content Server ends up as rows in its database. DTree (a view over DTreeCore on version 16 and later) holds one row per item, keyed by DataID, with ParentID building the hierarchy and SubType naming the item type (0 folder, 144 document, 131 category, 299 LiveReport…). Almost every other table joins to it.',
      { figure: { type: 'hub', center: 'DTree.DataID', items: [
        { label: 'DVersData', sub: 'versions (DocID)' },
        { label: 'ProviderData', sub: 'file location' },
        { label: 'DTreeACL', sub: 'permissions' },
        { label: 'LLAttrData', sub: 'attribute values' },
        { label: 'DAuditNew', sub: 'audit' },
        { label: 'DTreeAncestors', sub: 'subtrees' },
      ] }, caption: 'The item hub.' },
      'Users and groups live in KUAF (Type 0 = user, 1 = group); KUAFChildren links a group (ID) to each direct member (ChildID). DTreeACL holds each item’s access list (RightID, ACLType, Permissions bit mask). LLAttrData stores category values in typed columns. Workflow instances, sub-works and steps live in WWork, WSubWork and WSubWorkTask.',
      { figure: { type: 'tree', root: { label: 'KUAF group “Finance”', icon: 'group', children: [
        { label: 'KUAFChildren → user Ana', icon: 'user' },
        { label: 'KUAFChildren → group Payables', icon: 'group', children: [{ label: 'nested members', icon: 'user' }] },
      ] } }, caption: 'Membership is stored one level at a time; nested groups need a recursive query.' },
      { steps: [
        'Use a read-only account, ideally on a reporting replica or a copy.',
        'Sample each table (TOP 10 / LIMIT 10) to learn real column names.',
        'Join on IDs: DVersData.DocID = DTree.DataID; KUAFChildren.ChildID = KUAF.ID.',
        'Filter early by location, type and date.',
        'Verify the result against one item you know.',
      ], title: 'Writing a safe query' },
      { h: 'LiveReports' },
      'A LiveReport stores SQL in a Content Server item. Inputs are referenced as %1, %2 in the SQL and prompt the user with typed fields; a column can link to a sub-report that receives the row’s value as its input; results can be shown as a table or a chart. The SQL runs as the database account, so results are not permission-filtered unless the query makes them so — restrict who can create and run reports, and never put data-changing statements in them.',
      { callout: 'warn', title: 'Never write to the schema', text: 'INSERT, UPDATE and DELETE bypass caches, audit and indexing. Use the application, the REST API or OpenText-supplied tools to change data.' },
      { callout: 'exam', title: 'Exam angle', text: 'Match tables to purposes and know the main join keys. Know %1 inputs, sub-reports and charts in LiveReports, and that creating them is a restricted privilege.' },
    ],
    keyPoints: [
      'DTree = items; DVersData = versions; ProviderData = file locations.',
      'KUAF = users/groups; KUAFChildren = membership; DTreeACL = permissions.',
      'LLAttrData = category values; DAuditNew = audit; WWork/WSubWork/WSubWorkTask = workflow.',
      'LiveReports use %1, %2 inputs, sub-reports and charts.',
      'Read-only SQL only, on a copy where possible.',
    ],
    missions: [
      {
        id: 'sa05-userid', type: 'investigate', title: 'Find your KUAF ID',
        steps: ['Find your own user ID — the ID of your row in KUAF. It appears in your profile or user record (Classic UI), or a DBA can query KUAF by your login name.', 'Type the number.'],
        inputs: [{ key: 'uid', label: 'Your user ID' }],
        checks: [{ kind: 'answer', input: 'uid', source: 'user.id', compare: 'number', label: 'User ID' }],
      },
      {
        id: 'sa05-department', type: 'investigate', title: 'Name your department group',
        steps: ['Every user has a department (base group), stored as KUAF.GroupID. Find yours in your profile or user record.', 'Type the group name.'],
        inputs: [{ key: 'dept', label: 'Department (base group) name' }],
        checks: [{ kind: 'answer', input: 'dept', source: 'user.department', compare: 'text', label: 'Department group' }],
      },
      {
        id: 'sa05-sql', type: 'practice', title: 'Answer three questions with SQL',
        steps: [
          'On a test or reporting copy, write a query that lists the 10 largest current document versions.',
          'Write a query that lists the direct members of one group.',
          'Write a query that shows the ACL entries of one folder with readable names.',
          'Check each result against what the UI shows.',
        ],
        reflection: 'Paste or describe your three queries, the joins you used, and one surprise you found when comparing them with the UI.',
        minWords: 40,
      },
      {
        id: 'sa05-quiz', type: 'quiz', title: 'Knowledge check: schema & LiveReports',
        questions: [
          { q: "Which table holds one row per version of a document?", options: ["KUAF", "DTreeACL", "DTree", "DVersData"], answer: 3, explain: "DVersData stores versions; DocID points back to DTree.DataID." },
          { q: "How do you find the direct members of a group?", options: ["Read LLAttrData.ValStr", "Read DAuditNew.PerformerID", "Join KUAFChildren.ID = group ID, then KUAF on ChildID", "Read DTreeACL.RightID"], answer: 2, explain: "KUAFChildren links a group (ID) to each direct member (ChildID)." },
          { q: "Which column of DTree links an item to its container?", options: ["OwnerID", "ParentID", "SubType", "VersionNum"], answer: 1, explain: "ParentID is the DataID of the container and builds the tree." },
          { q: "Where are category attribute values stored?", options: ["LLAttrData", "KIni", "ProviderData", "DVersData"], answer: 0, explain: "LLAttrData holds values in typed columns, keyed by item, category and attribute." },
          { q: "In a LiveReport’s SQL, how is the first input parameter referenced?", options: [":input1", "{1}", "$1", "%1"], answer: 3, explain: "LiveReports substitute %1, %2 … with the inputs in order." },
          { q: "A department manager can run a LiveReport listing documents in a restricted HR folder they cannot open. Why?", options: ["The HR folder is public", "A bug in the Search Federator", "LiveReport SQL is not permission-filtered unless the query restricts rows", "OTDS granted access"], answer: 2, explain: "The SQL runs as the database account; control who can run reports and design the SQL accordingly." },
          { q: "Which table records audited events such as deletions?", options: ["KUAFChildren", "DAuditNew", "WSubWork", "DTreeNotify"], answer: 1, explain: "DAuditNew holds audit events with item, performer, event string and date." },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ SA06
  {
    id: 'sa06', track: 'sysadmin', title: 'Logging & troubleshooting', source: `${SRC} — 3-0128 Logging and Troubleshooting Foundation`,
    summary: 'Which log answers which question, how to switch logging on and off, a repeatable troubleshooting method and a runbook for the common incidents.',
    domains: ['sa-logging'],
    lesson: [
      'Content Server logs are mostly quiet until you ask for detail. Thread logs record every request each worker thread handled, with errors and tracebacks. Connect logs record the SQL each thread sent and how long it took. Summary timing logs give one line per request for trend analysis with Performance Analyzer. Search processes, OTDS (in its Tomcat logs folder) and the web server keep their own logs.',
      { figure: { type: 'matrix', cols: ['First log'], rows: [
        { label: 'Error on one action', cells: ['Thread log'] },
        { label: 'One slow page', cells: ['Connect log'] },
        { label: 'Slow overall', cells: ['Summary timings'] },
        { label: 'Cannot sign in', cells: ['OTDS logs'] },
        { label: 'Not searchable', cells: ['Search process logs'] },
        { label: 'HTTP 500', cells: ['Web server logs'] },
      ] }, caption: 'Symptom → first log.' },
      'Detailed logging is switched on in the logging settings of the Administration pages or in opentext.ini (a debug level in [general], flags such as wantLogs and wantVerbose in [options]). It usually needs a restart, fills disks quickly and records personal data — enable it on one instance, reproduce, collect, and switch it off.',
      { figure: { type: 'cycle', steps: ['Define', 'Scope', 'Isolate tier', 'Collect evidence', 'Hypothesis', 'Test & fix', 'Verify', 'Record'], center: 'Method' }, caption: 'The troubleshooting cycle.' },
      { steps: [
        'Ask what changed and who is affected (one user, one item, one instance, everyone).',
        'Isolate the tier using the architecture.',
        'Enable the matching logs, reproduce, note the exact time.',
        'Collect logs from every relevant instance plus the System Report.',
        'Change one thing at a time; verify with the user; record the fix.',
      ], title: 'Working an incident' },
      { callout: 'tip', title: 'Scope saves hours', text: 'One user → account, permissions, browser. One instance → config drift or missing patch. Everyone → shared tier: database, storage, OTDS, load balancer.' },
      { callout: 'exam', title: 'Exam angle', text: 'Map symptoms to logs, know where logging is switched on, and pick the cheapest scoping check before drastic actions.' },
    ],
    keyPoints: [
      'Thread logs = request errors; connect logs = SQL and timings.',
      'Summary timings + Performance Analyzer = performance trends.',
      'OTDS logs live with its Tomcat, not in the Content Server logs folder.',
      'Enable detailed logging briefly, on purpose, and turn it off.',
      'Scope first; change one thing at a time; send the System Report to Support.',
    ],
    missions: [
      {
        id: 'sa06-connect', type: 'practice', title: 'Find the slowest SQL behind a page', feature: 'admin',
        steps: [
          'On a test system, enable connect (SQL) logging and thread logging through the logging settings or opentext.ini; restart if required.',
          'Open a page that feels slow (a large folder, a report) and note the time.',
          'Open the newest connect log, find the request and the statement with the longest elapsed time.',
          'Switch logging back off and restart.',
        ],
        reflection: 'Which statement was slowest, which tables did it touch, how long did it take, and what would you try to make it faster?',
      },
      {
        id: 'sa06-runbook', type: 'practice', title: 'Write a runbook entry',
        steps: ['Pick an incident you have seen (or one from the runbook guide).', 'Write it as symptom → first checks → fix → how to recognise it next time.'],
        reflection: 'Give your runbook entry in four parts: symptom, first checks (with the logs you would open), fix, and prevention.',
        minWords: 50,
      },
      {
        id: 'sa06-quiz', type: 'quiz', title: 'Knowledge check: logging & troubleshooting',
        questions: [
          { q: "One Classic UI page takes 40 seconds; others are fast. Which log shows the SQL statements behind it with timings?", options: ["Connect log", "Web server access log", "Search Federator log", "OTDS access log"], answer: 0, explain: "Connect logs record SQL and elapsed times per thread and request." },
          { q: "Where are OTDS log files typically found?", options: ["In the DAuditNew table", "In the patch folder", "<OTHOME>/logs", "In the logs folder of the Tomcat hosting OTDS"], answer: 3, explain: "OTDS is a web application in Tomcat; its logs (for example otds.log) are in that Tomcat’s logs folder." },
          { q: "What is the best first step when a user reports an error?", options: ["Restore last night’s backup", "Restart all servers", "Gather the exact error, time and scope, and ask what changed", "Reindex"], answer: 2, explain: "Define and scope before changing anything." },
          { q: "Which logs does OpenText Performance Analyzer read?", options: ["DCS logs", "Summary timing logs", "OTDS access logs", "IIS logs only"], answer: 1, explain: "OTPA analyses summary timing logs for slow requests, users and thread usage." },
          { q: "Why should detailed thread and SQL logging be switched off after collecting evidence?", options: ["It grows quickly, costs performance and stores personal data", "It breaks OTDS", "It is not supported", "It disables search"], answer: 0, explain: "Verbose logs fill disks, slow requests slightly and contain user and item names." },
          { q: "The problem happens only through front-end 2. What is the most likely class of cause?", options: ["The AD domain", "The search index", "The database", "Configuration drift or a missing patch on that instance"], answer: 3, explain: "Shared tiers would affect every instance. Compare ini files and System Reports." },
          { q: "Which item should accompany logs in an OpenText Support case?", options: ["The license key", "A copy of the EFS", "The System Report", "The KUAF table"], answer: 2, explain: "The System Report gives versions, modules, patches and configuration." },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ SA07
  {
    id: 'sa07', track: 'sysadmin', title: 'OTDS & single sign-on', source: `${SRC} — 3-0300 OTDS Installation and Configuration`,
    summary: 'User partitions, resources, access roles, push connectors and authentication handlers; synchronising AD; connecting Content Server; and SSO with Kerberos, SAML and OAuth.',
    domains: ['sa-otds'],
    lesson: [
      'OpenText Directory Services is the identity hub for Content Server 16 and later. User partitions hold users and groups — synchronized from AD/LDAP or maintained in OTDS. A resource represents an application such as one Content Server system; its push connector writes users and groups into Content Server’s KUAF table. An access role decides which partitions, groups or users the resource receives and who may sign in to it.',
      { figure: { type: 'flow', steps: [
        { label: 'AD / LDAP', kind: 'system' },
        { label: 'Synchronized partition' },
        { label: 'Access role', kind: 'decision' },
        { label: 'Resource + push', sub: 'Content Server' },
        { label: 'KUAF user', kind: 'end' },
      ] }, caption: 'From directory to Content Server.' },
      { steps: [
        'Create a synchronized partition: connection, bind account, search bases, filters, mappings, monitoring.',
        'Create the Content Server resource with its connector; review the login-name mapping; note the resource ID.',
        'Enter the OTDS URL and resource ID in Content Server’s directory integration settings (activation).',
        'Add members to the resource’s access role and consolidate to push them.',
        'Sign in through Content Server to test the redirect.',
      ], title: 'Connect Content Server to OTDS' },
      'Authentication handlers, tried in priority order, prove identity: HTTP Negotiate for integrated Windows authentication (Kerberos, needs an SPN for the OTDS host), SAML 2.0 with an identity provider, OAuth/OpenID Connect providers, and the password form. OTDS then issues an SSO cookie and a ticket that Content Server validates. SSO proves who someone is; the access role and the push decide whether they exist in Content Server at all.',
      { figure: { type: 'compare', items: [
        { title: 'Kerberos (IWA)', tone: 'info', points: ['Domain PCs, intranet', 'SPN HTTP/<otds host>', 'Browser intranet zone'] },
        { title: 'SAML 2.0', tone: 'accent', points: ['Central IdP (ADFS, Entra, Okta)', 'Metadata + certificates', 'Claim mapped to OTDS user'] },
      ] }, caption: 'The two most common SSO methods.' },
      { callout: 'warn', title: 'Keep a way in', text: 'Before changing handlers, confirm an administrator can still sign in with a password (otadmin@otds.admin on the OTDS sign-in page).' },
      { callout: 'exam', title: 'Exam angle', text: 'Definitions (partition, resource, access role, push connector, auth handler), the connection order, and the classic diagnosis: a user missing from Content Server is usually missing from the access role.' },
    ],
    keyPoints: [
      'Partitions hold identities; resources are applications; access roles connect them.',
      'The push connector writes users and groups into Content Server.',
      'Content Server needs the OTDS URL and resource ID to activate the integration.',
      'Kerberos needs a correct SPN and browser trust; SAML needs metadata, certificates and matching claims.',
      'OTDS logs live in its Tomcat logs folder.',
    ],
    missions: [
      {
        id: 'sa07-group', type: 'investigate', title: 'Name one of your groups',
        steps: ['Open your profile or user record and look at your group memberships (with OTDS these are usually pushed from AD).', 'Type the name of one group you are a member of.'],
        inputs: [{ key: 'group', label: 'One group you belong to' }],
        checks: [{ kind: 'answer', input: 'group', source: 'user.groups', compare: 'contains', label: 'Group membership' }],
      },
      {
        id: 'sa07-trace', type: 'practice', title: 'Trace a sign-in',
        steps: [
          'In a private browser window, open the Content Server URL and watch the address bar (or the network tab of developer tools).',
          'Note the redirect to OTDS, the sign-in method used, and the redirect back.',
          'If you have OTDS admin access on a test system, find your user’s partition and the access role that admits you.',
        ],
        reflection: 'Describe each hop of your sign-in, which authentication handler you think was used, and which access role (or group in it) gives you access.',
      },
      {
        id: 'sa07-quiz', type: 'quiz', title: 'Knowledge check: OTDS & SSO',
        questions: [
          { q: "A new employee exists in AD and in the OTDS synchronized partition but not in Content Server. What is the most likely cause?", options: ["The Search Federator is down", "They are not in the access role of the Content Server resource", "Their password is too short", "The EFS is full"], answer: 1, explain: "Only access-role members are pushed to the resource and may sign in." },
          { q: "What does a push connector do?", options: ["Creates and updates users and groups in the application’s own user store", "Sends notification emails", "Deploys patches", "Pushes documents to Archive Center"], answer: 0, explain: "For Content Server it maintains KUAF and KUAFChildren from OTDS." },
          { q: "Which authentication handler provides integrated Windows authentication?", options: ["OAuth client credentials", "Password form", "SAML 2.0", "HTTP Negotiate (Kerberos/SPNEGO)"], answer: 3, explain: "HTTP Negotiate uses the Kerberos ticket of the Windows session." },
          { q: "What must Content Server be given to integrate with OTDS?", options: ["An SPN", "The AD bind password", "The OTDS server URL and the resource ID", "The database password of OTDS"], answer: 2, explain: "With the URL and resource ID, Content Server activates the resource." },
          { q: "Domain users get a password prompt instead of silent sign-in. Which is a likely cause?", options: ["The user lacks System Administration rights", "Duplicate or missing SPN, or OTDS not in the browser’s intranet zone", "The partition is non-synchronized", "The Recycle Bin is full"], answer: 1, explain: "Kerberos needs a unique SPN for the OTDS host name and a browser that trusts the site for Negotiate." },
          { q: "Which partition type keeps passwords in the source directory and imports users from AD?", options: ["Synchronized", "System", "Resource", "Non-synchronized"], answer: 0, explain: "Synchronized partitions mirror AD/LDAP; authentication checks the directory." },
          { q: "Which account is the built-in OTDS administrator?", options: ["Administrator@domain", "sysadmin@otds", "admin@cs", "otadmin@otds.admin"], answer: 3, explain: "otadmin@otds.admin is created with OTDS and, on 16.x, maps to the Content Server Admin." },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ SA08
  {
    id: 'sa08', track: 'sysadmin', title: 'System Center Manager', source: `${SRC} — 3-0305 OpenText System Center Manager`,
    summary: 'Use OpenText System Center Manager to discover installed products, deploy patches, updates and language packs, and run execution plans for unattended installations.',
    domains: ['sa-otscm'],
    lesson: [
      'OpenText System Center Manager (OTSCM) automates installing, patching and updating OpenText products such as Content Server and Directory Services. A central OTSCM server, with its web console and package repository, talks to OpenText for available patches and updates and to an OTSCM agent on every managed host. Agents discover what is installed and carry out deployments locally.',
      { figure: { type: 'layers', layers: [
        { label: 'OpenText', items: ['Patches', 'Updates', 'Language packs'] },
        { label: 'OTSCM server', items: ['Console', 'Repository', 'Execution plans', 'History'] },
        { label: 'Agents', items: ['One per managed host'] },
        { label: 'Products', items: ['Content Server', 'OTDS', 'Others'] },
      ] }, caption: 'OTSCM components.' },
      { steps: [
        'Install the OTSCM server and apply its mandatory updates.',
        'Create local users or integrate with OTDS.',
        'Install agents on each host.',
        'Register the systems, discover their products, enable the products to manage.',
        'Add patches or updates, deploy to test, verify, then deploy to production.',
      ], title: 'Onboarding and patching with OTSCM' },
      'Execution plans are saved sequences of installation or update tasks with their parameters — for example OTDS, then Content Server on two hosts, then modules — that OTSCM runs unattended. They make new environments reproducible and keep every instance of a cluster identical.',
      { figure: { type: 'compare', items: [
        { title: 'Manual', tone: 'warn', points: ['Copy files host by host', 'Easy to miss an instance', 'History in notes'] },
        { title: 'OTSCM', tone: 'pass', points: ['Discovery of installed products', 'Same package everywhere', 'Central history', 'Unattended execution plans'] },
      ] } },
      { callout: 'tip', title: 'Automation is not a backup', text: 'Back up database, content store and the installation home before deploying updates, and test on a non-production system first.' },
      { callout: 'exam', title: 'Exam angle', text: 'Components (server, agent, connection to OpenText), the onboarding order (install and update OTSCM → users/OTDS → agents → register → discover → enable), deployable content (patches, updates, language packs) and execution plans for unattended installs.' },
    ],
    keyPoints: [
      'OTSCM = central server + an agent on every managed host.',
      'Apply OTSCM’s own mandatory updates first.',
      'Register systems, discover products, enable the ones to manage.',
      'Deploy patches, updates and language packs consistently across a cluster.',
      'Execution plans run unattended installations of products such as Content Server and OTDS.',
    ],
    missions: [
      {
        id: 'sa08-plan', type: 'practice', title: 'Plan a patch rollout with OTSCM',
        steps: [
          'Take a Content Server cluster you know (or invent one: two front-ends, one back-end, one OTDS).',
          'Write the OTSCM onboarding steps for it.',
          'Write the rollout for one patch: test system, approvals, maintenance window, order of hosts, verification, rollback.',
        ],
        reflection: 'Give your onboarding steps and patch rollout plan, including how you verify every instance received the patch and how you would roll back.',
        minWords: 50,
      },
      {
        id: 'sa08-quiz', type: 'quiz', title: 'Knowledge check: System Center Manager',
        questions: [
          { q: "What must be installed on each host that OTSCM manages?", options: ["An Admin server", "OTDS", "An OTSCM agent", "A second Content Server"], answer: 2, explain: "Agents discover products and run deployment tasks on their host." },
          { q: "What should you do right after installing the OTSCM server?", options: ["Reindex Content Server", "Apply its mandatory updates", "Delete the patch folder", "Create a storage provider"], answer: 1, explain: "The course sequence starts by bringing OTSCM itself up to date." },
          { q: "What is an execution plan in OTSCM?", options: ["A saved sequence of installation or update tasks that runs unattended", "A workflow map", "A search slice", "A database maintenance job"], answer: 0, explain: "Execution plans automate installations of products such as Content Server and OTDS." },
          { q: "Which step comes between registering a system and deploying patches to it?", options: ["Creating a LiveReport", "Consolidating OTDS", "Adding a search partition", "Discovering installed products and enabling them for management"], answer: 3, explain: "OTSCM must know which products exist on a system and be allowed to manage them." },
          { q: "Which content can OTSCM deploy to a Content Suite installation?", options: ["Only database backups", "Only documents", "Patches, updates and language packs", "Only OTDS users"], answer: 2, explain: "The 3-0305 course covers patches, updates and language packs." },
          { q: "How can administrators sign in to OTSCM?", options: ["Only with the Content Server Admin password", "With local OTSCM users or through OTDS integration", "Anonymously", "Only with an AD domain admin account"], answer: 1, explain: "OTSCM supports local users and OTDS integration." },
        ],
      },
    ],
  },
];
