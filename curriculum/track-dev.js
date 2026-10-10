'use strict';
// Track — Developer (exam 5-0157): schema and LiveReports, CSIDE and OScript,
// request handlers and WebLingo, nodes/data/testing, REST API and Content Web
// Services. Topics follow the outlines of OpenText courses 3-0127, 4-0140 and
// 4-0144. All text is original. OScript names that could not be confirmed from
// public sources are shown as pseudo-code or described in prose.

const L = (...lines) => lines.join('\n');
const C_SCHEMA = 'Course 3-0127 Schema and LiveReport Fundamentals (outline)';
const C_CSIDE = 'Course 4-0140 CSIDE Fundamentals (outline)';
const C_REST = 'Course 4-0144 REST API and Content Web Service Fundamentals (outline)';

const MODULES = [
  // ------------------------------------------------------------------ DV01
  {
    id: 'dv01', track: 'dev', title: 'Schema & SQL', source: C_SCHEMA,
    summary: 'The tables behind nodes, versions, users, permissions, attributes and audit — and how to query them safely.',
    domains: ['dev-schema'],
    lesson: [
      'Everything the UI shows is stored in a handful of relational tables. A developer who can read them answers questions the UI cannot, writes LiveReports, and checks what their own code wrote. The rule that comes first: **SQL reads, APIs write.** An UPDATE on a core table skips permissions, audit, search indexing and callbacks.',
      { figure: { type: 'hub', center: 'DTree (one row per node)', items: ['DVersData — versions', 'KUAF — users & groups', 'KUAFChildren — membership', 'DTreeACL — permissions', 'LLAttrData — attribute values', 'DAuditNew — audit', 'DTreeAncestors — subtree', 'WWork / WSubWorkTask — workflow'] }, caption: 'Almost every query starts at DTree and joins outwards.' },
      { h: 'Node rows' },
      'DTree (a view over DTreeCore in recent releases) has one row per node. **DataID** is the node ID, **ParentID** the container, **SubType** the item type (0 folder, 144 document, 136 compound document, 202 project, 299 LiveReport…), **OwnerID** the volume as a negative number, plus names, owners and dates. Versions live in **DVersData** keyed by DocID = DataID and Version.',
      { code: L(
        '-- Documents directly in the Enterprise Workspace (DataID 2000 on a typical install)',
        'SELECT d.DataID, d.Name, v.DataSize, v.MimeType',
        'FROM   DTree d',
        'JOIN   DVersData v ON v.DocID = d.DataID AND v.Version = d.VersionNum',
        'WHERE  d.ParentID = 2000 AND d.SubType = 144',
      ), lang: 'sql', title: 'Current version of each document' },
      { h: 'People and permissions' },
      '**KUAF** holds users (Type 0) and groups (Type 1); **KUAFChildren** maps a group (ID) to its members (ChildID). **DTreeACL** holds each node\'s owner, owner group, Public Access and assigned entries with a permission bitmask. SQL ignores all of it unless you join it yourself — the reason LiveReports can leak information.',
      { figure: { type: 'flow', steps: [{ label: 'DTree', sub: 'the node' }, { label: 'DTreeACL', sub: 'RightID + bitmask' }, { label: 'KUAFChildren', sub: 'is the user in that group?' }, { label: 'KUAF', kind: 'end', sub: 'the user' }] }, caption: 'The join chain for "can this user see this node?".' },
      { h: 'Metadata, audit and subtrees' },
      { ul: [
        '**LLAttrData**: one row per attribute value — ID (node), VerNum, DefID (category), AttrID, EntryNum, and ValStr/ValInt/ValDate/ValReal/ValLong.',
        '**DAuditNew**: AuditStr (the event), DataID, PerformerID, AuditDate.',
        '**DTreeAncestors**: every (node, ancestor) pair, so "all documents below folder X" is one join instead of a recursive query.',
      ] },
      { callout: 'warn', title: 'Portability', text: 'Content Server supports SQL Server, Oracle and PostgreSQL. Joins are portable; date functions, row limits and string functions are not. Note the database a query was written for.' },
      { callout: 'exam', title: 'Exam angle', text: 'Map a fact to its table, read a join, and remember that SQL results are not permission-filtered.' },
    ],
    keyPoints: [
      'DTree/DTreeCore: one row per node — DataID, ParentID, SubType, OwnerID.',
      'DVersData: versions (DocID = DataID). KUAF/KUAFChildren: users, groups, membership.',
      'LLAttrData stores category values per version; DAuditNew stores audit events.',
      'DTreeAncestors makes subtree queries simple.',
      'Read with SQL, write through the APIs.',
    ],
    missions: [
      {
        id: 'dv01-whoami', type: 'investigate', title: 'Find your own user ID',
        brief: 'Your KUAF ID appears as CreatedBy, PerformerID and RightID all over the schema. Find it.',
        steps: [
          'Either sign in to the REST API and call GET /api/v1/auth — the answer\'s data.id is your ID —',
          'or, if you have read access to a development database, run: SELECT ID, Name FROM KUAF WHERE Name = \'<your log-in name>\' AND Type = 0.',
          'Type the number below.',
        ],
        inputs: [{ key: 'uid', label: 'Your user ID (KUAF.ID)', placeholder: 'e.g. 1000' }],
        checks: [{ kind: 'answer', input: 'uid', source: 'user.id', compare: 'number', label: 'Your user ID' }],
      },
      {
        id: 'dv01-queries', type: 'practice', title: 'Write three schema queries',
        brief: 'Turn questions into SQL against a development database (never production).',
        steps: [
          'Write a query that lists the documents you created (DTree.CreatedBy = your user ID), newest first.',
          'Write a query that lists the groups you belong to (KUAFChildren joined to KUAF twice).',
          'Write a query that counts documents below one folder using DTreeAncestors.',
          'Run them on a development database if you have one; otherwise check each join by hand.',
        ],
        reflection: 'Paste or describe one of your queries and explain each join it uses and why it is (or is not) permission-safe.',
      },
      {
        id: 'dv01-quiz', type: 'quiz', title: 'Knowledge check: schema',
        questions: [
          { q: 'Which table holds one row per version of a document?', options: ['DTree', 'DVersData', 'LLAttrData', 'KUAF'], answer: 1, explain: 'DVersData has a row per version, keyed by DocID (the DataID) and Version.' },
          { q: 'In KUAF, what does Type = 1 indicate?', options: ['A user', 'A group', 'A deleted user', 'A domain'], answer: 1, explain: 'Users are Type 0 and groups Type 1.' },
          { q: 'Which table tells you that user 1001 is a member of group 2002?', options: ['DTreeACL', 'KUAFChildren', 'DAuditNew', 'DTreeAncestors'], answer: 1, explain: 'KUAFChildren maps a group (ID) to a member (ChildID).' },
          { q: 'What is the most efficient way to find all documents anywhere below a folder?', options: ['A recursive query on ParentID', 'Join DTreeAncestors on AncestorID', 'Scan DAuditNew', 'Search LLAttrData'], answer: 1, explain: 'DTreeAncestors stores every node–ancestor pair, so one join covers the whole subtree.' },
          { q: 'Where are category attribute values stored?', options: ['DTree.DComment', 'LLAttrData', 'KIni', 'DVersData'], answer: 1, explain: 'LLAttrData keeps one row per attribute value, with DefID (category) and AttrID.' },
          { q: 'Why should you not UPDATE DTree directly to rename items?', options: ['DTree is read-only at database level', 'It bypasses permissions, audit, indexing and callbacks', 'Names are stored in DVersData', 'Renames are only possible in Smart View'], answer: 1, explain: 'Direct writes skip all the server logic that keeps data consistent; use the APIs.' },
          { q: 'A SQL query returns documents a user cannot see in the UI. Why?', options: ['The search index is out of date', 'SQL is not filtered by permissions unless you join DTreeACL', 'The user is in the Admin group', 'DTree caches results'], answer: 1, explain: 'Permissions are applied by the server, not by the database. Raw SQL sees everything.' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ DV02
  {
    id: 'dv02', track: 'dev', title: 'LiveReports', source: C_SCHEMA,
    summary: 'Stored SQL with prompts, sub-reports and charts — built and secured correctly.',
    domains: ['dev-schema'],
    lesson: [
      'A **LiveReport** is an item (subtype 299) that stores a SQL statement, its inputs and its display settings. Users open it like a document; the server runs the query and renders a table or chart. It is the quickest way to turn a schema query into something business users can run themselves.',
      { figure: { type: 'flow', steps: [{ label: 'Open report', kind: 'actor' }, { label: 'Prompt for inputs', sub: '%1, %2…' }, { label: 'Run SQL', kind: 'system' }, { label: 'Table or chart' }, { label: 'Drill down', kind: 'end', sub: 'sub-report' }] }, caption: 'Running a LiveReport.' },
      { h: 'Inputs' },
      'Each `%n` in the query is replaced by the value of the n-th input. Inputs have a type — text, number, date, user, group, item — which decides the prompt control and how the value is validated. Item and user inputs pass numeric IDs.',
      { code: L(
        '-- %1 = user (user input)',
        'SELECT d.DataID, d.Name, d.CreateDate',
        'FROM   DTree d',
        'WHERE  d.CreatedBy = %1 AND d.SubType = 144',
        'ORDER  BY d.CreateDate DESC',
      ), lang: 'sql', title: 'One input' },
      { h: 'Sub-reports and charts' },
      'Link a column to a second LiveReport and each value becomes a link: the second report runs with that value as its input. Aggregate queries can be shown as charts — one column for labels, one numeric column for values.',
      { figure: { type: 'compare', items: [
        { title: 'Summary report', tone: 'info', points: ['GROUP BY author', 'COUNT(*) per author', 'Rendered as bar chart', 'Author column links to detail'] },
        { title: 'Detail sub-report', tone: 'accent', points: ['One input: user ID', 'Lists that user\'s documents', 'Runs when a bar or name is clicked', 'Reusable on its own'] },
      ] }, caption: 'A summary/detail pair.' },
      { callout: 'warn', title: 'Security', text: 'The query runs as the database account, so results are not permission-filtered. Restrict who can run sensitive reports, or join DTreeACL and KUAFChildren for the current user. Only trusted authors should be able to edit report SQL.' },
      { callout: 'exam', title: 'Exam angle', text: 'Placeholders %1…%n, input types, sub-report drill-down, chart output, and the permission trap.' },
    ],
    keyPoints: [
      'A LiveReport is an item (subtype 299) holding SQL, inputs and display settings.',
      '%1, %2… are replaced by input values in order.',
      'Sub-reports pass a clicked value to another LiveReport.',
      'Charts need a label column and a numeric column.',
      'Results are not permission-filtered — secure the report.',
    ],
    missions: [
      {
        id: 'dv02-design', type: 'practice', title: 'Design a summary and detail report',
        brief: 'Design (and, if you have the privilege, build) a two-level report.',
        steps: [
          'Write a summary query: number of documents created per user in the last 30 days, ready for a bar chart.',
          'Write a detail query with one input (%1 = user) that lists that user\'s documents.',
          'Decide how the summary links to the detail and who may run each report.',
          'If you can create LiveReports on a development server, build both and test them.',
        ],
        reflection: 'Describe both queries, the input types, how the drill-down works and how you prevent the report from showing items users cannot see.',
      },
      {
        id: 'dv02-quiz', type: 'quiz', title: 'Knowledge check: LiveReports',
        questions: [
          { q: 'In LiveReport SQL, what does %2 stand for?', options: ['The second column of the result', 'The value of the second input', 'The current user ID', 'A wildcard'], answer: 1, explain: 'Placeholders are positional: %2 is replaced by the second input\'s value.' },
          { q: 'How does a LiveReport drill down into detail?', options: ['By a sub-report that receives the clicked value as its input', 'By editing the SQL at run time', 'By exporting to Excel', 'By a workflow step'], answer: 0, explain: 'A column can link to another LiveReport, passing the value as that report\'s input.' },
          { q: 'Which statement about LiveReport results is true?', options: ['They are filtered by the user\'s permissions automatically', 'They are not permission-filtered unless the SQL does it', 'They only show the user\'s own items', 'They are cached for 24 hours'], answer: 1, explain: 'SQL runs as the database account; filtering is up to the author.' },
          { q: 'What does a bar chart output need from the query?', options: ['Exactly one column', 'A label column and a numeric value column', 'A DataID column', 'An ORDER BY clause'], answer: 1, explain: 'Charts plot a numeric column against a label column.' },
          { q: 'Which input type is best when the user must pick a person?', options: ['Text', 'User', 'Date', 'Number'], answer: 1, explain: 'A user input shows a picker and passes the user\'s ID.' },
          { q: 'Who should be allowed to edit a LiveReport\'s SQL?', options: ['Anyone who can see it', 'Only trusted report authors', 'Every user with Modify on the folder by default', 'Nobody — it is fixed at creation'], answer: 1, explain: 'Report SQL can read any table, so editing it is effectively database read access.' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ DV03
  {
    id: 'dv03', track: 'dev', title: 'CSIDE & OScript basics', source: C_CSIDE,
    summary: 'Set up CSIDE, understand a module\'s folders, write basic OScript, and deploy a module.',
    domains: ['dev-oscript'],
    lesson: [
      '**CSIDE** is OpenText\'s Eclipse plug-in for Content Server development. It works against a **development** Content Server: you edit object sources, build them into OSpaces, load them into the server, test and debug. A finished module is a folder whose name carries its version, installed on other servers through the Administration pages.',
      { figure: { type: 'tree', root: { label: 'acmetools_1_0_0', icon: 'module', children: [
        { label: 'acmetools.ini', icon: 'page', note: 'identity, version, dependencies' },
        { label: 'ospace', icon: 'folder', children: [{ label: 'acmetools.oll', icon: 'module' }] },
        { label: 'html', icon: 'folder', note: 'WebLingo pages' },
        { label: 'support', icon: 'folder', note: 'images, CSS, JS' },
      ] } }, caption: 'A built module (names illustrative).' },
      { h: 'OScript in five minutes' },
      'Declared types (Integer, Real, String, Boolean, Date, List, Assoc, RecArray, Object, Dynamic), one statement per line, blocks closed by `end`, lists and strings indexed from 1, comments with `//`.',
      { code: L(
        'List    names = { "Ada", "Grace", "Linus" }',
        'Assoc   counts = Assoc.CreateAssoc()',
        'String  n',
        '',
        'for n in names',
        '	counts.( n ) = Length( n )',
        'end',
        '',
        'if counts.Ada == 3',
        '	Echo( "first: ", names[ 1 ] )      // prints "first: Ada"',
        'end',
      ), lang: 'oscript', title: 'Lists, assocs and loops' },
      { h: 'From build to production' },
      { figure: { type: 'flow', steps: ['Edit in CSIDE', 'Build OSpace', 'Load / restart dev server', 'Test & debug', 'Export module', { label: 'Staging → Install Modules', kind: 'system' }, { label: 'Restart', kind: 'end' }] }, caption: 'The module lifecycle.' },
      { callout: 'tip', title: 'Building is not loading', text: 'A compiled OSpace does nothing until the server loads it. If a change seems ignored, check the OSpace is loaded and the server has restarted.' },
      { callout: 'exam', title: 'Exam angle', text: 'Module folders and their roles, CSIDE against a development server, basic OScript syntax and types, and Install / Upgrade / Uninstall Modules on the Administration pages.' },
    ],
    keyPoints: [
      'CSIDE = Eclipse plug-in; always attach it to a development server.',
      'A module folder carries its version; it holds the ini file, ospace, html and support folders.',
      'OScript: typed declarations, blocks end with end, 1-based lists and strings.',
      'Deploy: staging directory → Install Modules → restart.',
    ],
    missions: [
      {
        id: 'dv03-version', type: 'investigate', title: 'Which release are you building for?',
        brief: 'CSIDE, the development server and every module you build must match the production release.',
        steps: [
          'Call GET /api/v1/serverinfo on the training server (no ticket needed on most servers) or look at the Administration pages.',
          'Type the version string you find.',
        ],
        inputs: [{ key: 'version', label: 'Content Server version' }],
        checks: [{ kind: 'answer', input: 'version', source: 'server.version', compare: 'contains', label: 'Server version' }],
      },
      {
        id: 'dv03-plan', type: 'practice', title: 'Plan a development environment',
        brief: 'Before writing code, decide where it runs and how it moves.',
        steps: [
          'List what a developer workstation needs: development Content Server and database, Java, Eclipse, CSIDE.',
          'Sketch the folders of a module called acmetools and what goes in each.',
          'Write the steps to move version 1.0.0 from development to test and production.',
        ],
        reflection: 'Describe your environment, the module folder structure and the deployment steps, including restarts and rollback.',
      },
      {
        id: 'dv03-quiz', type: 'quiz', title: 'Knowledge check: CSIDE and OScript',
        questions: [
          { q: 'What is CSIDE?', options: ['A web-based admin console', 'An Eclipse-based IDE for Content Server development', 'A SQL client', 'A REST testing tool'], answer: 1, explain: 'CSIDE is OpenText\'s Eclipse plug-in for writing, building and debugging OScript modules.' },
          { q: 'Which folder of a module holds WebLingo templates?', options: ['ospace', 'support', 'html', 'staging'], answer: 2, explain: 'WebLingo .html files live in the module\'s html folder; support holds static files.' },
          { q: '`List l = { 10, 20, 30 }` — what is `l[1]`?', options: ['20', '10', 'Undefined', 'An error'], answer: 1, explain: 'OScript lists are 1-based, so l[1] is the first element.' },
          { q: 'Which type maps keys to values?', options: ['List', 'Assoc', 'RecArray', 'Record'], answer: 1, explain: 'An Assoc is a key → value map.' },
          { q: 'Where do you copy a module folder before installing it?', options: ['The html folder', 'The staging directory of the Content Server installation', 'The database', 'The Enterprise Workspace'], answer: 1, explain: 'Install Modules lists the modules found in staging.' },
          { q: 'After installing a module through the Administration pages, what is required?', options: ['Nothing', 'Restarting Content Server', 'Reindexing', 'Re-creating all users'], answer: 1, explain: 'OSpaces are loaded at start-up, so the server must restart.' },
          { q: 'What value does a declared but unassigned Dynamic variable hold?', options: ['0', 'An empty string', 'Undefined', 'FALSE'], answer: 2, explain: 'Unassigned variables are Undefined; test with IsDefined().' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ DV04
  {
    id: 'dv04', track: 'dev', title: 'Objects, request handlers & WebLingo', source: C_CSIDE,
    summary: 'Inheritance, orphans and registration — then a request handler and its WebLingo page.',
    domains: ['dev-oscript'],
    lesson: [
      'OScript objects have one parent and inherit all its **features** (values and scripts) until they override them. Objects live in **OSpaces**. To extend an object from another module you create an **orphan**: a child of that object kept in your own OSpace. Frameworks find your objects at start-up by scanning the enabled children of known parents — so your child sets **fEnabled = TRUE**.',
      { figure: { type: 'tree', root: { label: 'RequestHandler (WebLL)', icon: 'module', children: [
        { label: 'LLRequestHandler', icon: 'module', children: [
          { label: 'Acme group (orphan)', icon: 'module', note: 'func prefix "acme"', children: [
            { label: 'Hello', icon: 'page', note: 'fEnabled TRUE' },
          ] },
        ] },
      ] } }, caption: 'Your handler inherits from delivered parents through an orphan (names illustrative).' },
      { h: 'A request, step by step' },
      { figure: { type: 'flow', steps: [{ label: 'Browser', kind: 'actor', sub: '?func=acme.hello' }, { label: 'Dispatcher', sub: 'finds handler' }, { label: 'Prototype', sub: 'checks arguments' }, { label: 'Execute', sub: 'gathers data' }, { label: 'WebLingo', kind: 'end', sub: 'fHTMLFile' }] }, caption: 'func selects the handler; WebLingo renders its result.' },
      { code: L(
        'function Dynamic Execute( Dynamic ctxIn, Dynamic ctxOut, Record r )',
        '	Dynamic node = DAPI.GetNodeByID( .fPrgCtx.DapiSess(), DAPI.BY_DATAID, r.objId )',
        '	if IsError( node )',
        '		.fError = "Item not found"',
        '	else',
        '		.fNode = node',
        '	end',
        '	return Undefined',
        'end',
      ), lang: 'oscript', title: 'Execute gathers the data' },
      { code: L(
        ';;webscript hello()',
        ';Dynamic node = .fNode',
        '<h1>`node.pName`</h1>',
        ';if node.pSubType == 0',
        '<p>`[ACME_HTMLLabel.IsAFolder]`</p>',
        ';end',
        ';;end',
      ), lang: 'weblingo', title: 'hello.html renders it (simplified)' },
      { callout: 'remember', title: 'WebLingo syntax', text: ['`;` — a line of OScript', '`` `expr` `` — write a value', '`` `%Lexpr` `` — write it literally', '`;;call <file>( args )` — include a fragment'] },
      { callout: 'exam', title: 'Exam angle', text: 'Orphan, inheritance, fEnabled, restart after adding objects; handler features (prototype, Execute, fHTMLFile); WebLingo is only the display layer.' },
    ],
    keyPoints: [
      'Children inherit all parent features until they override them.',
      'Orphan = child of another OSpace\'s object, stored in your OSpace.',
      'fEnabled TRUE + restart = registered.',
      'func= picks the handler; Execute gathers data; fHTMLFile renders it.',
      'WebLingo: ; lines, backtick output, ;;call includes, xlate labels.',
    ],
    missions: [
      {
        id: 'dv04-classic-urls', type: 'practice', title: 'Read Classic UI URLs',
        brief: 'Every Classic UI page is a request handler. Learn to read them.',
        steps: [
          'Open your sandbox in the Classic UI ({{csUrl}}) and note the URL: the func, objId and objAction arguments.',
          'Open the item\'s Properties and note how the URL changes.',
          'Open your Personal Workspace and compare.',
        ],
        reflection: 'For two URLs you saw, name the func value and each argument, and explain which object the dispatcher hands the request to.',
      },
      {
        id: 'dv04-design', type: 'practice', title: 'Design a request handler',
        brief: 'Plan a handler func=acme.summary that shows how many documents are in a folder.',
        steps: [
          'Decide which object it is an orphan of and which features you set (fEnabled, prototype, fHTMLFile).',
          'List the arguments and their types for the prototype.',
          'Write Execute in pseudo-code: read the folder with DAPI, count documents, store the result in a feature.',
          'Sketch the WebLingo page that displays the count with a localised label.',
        ],
        reflection: 'Describe the handler\'s features, its prototype, its Execute logic and its WebLingo page, and how you would verify it is registered.',
      },
      {
        id: 'dv04-quiz', type: 'quiz', title: 'Knowledge check: objects and handlers',
        questions: [
          { q: 'What is an orphan in OScript development?', options: ['An object with no parent', 'A child of an object from another OSpace, stored in your OSpace', 'A deleted OSpace', 'A WebLingo file without a handler'], answer: 1, explain: 'Orphans let you extend delivered objects without editing their OSpace.' },
          { q: 'A new request handler returns an unknown-func error. The OSpace is built and loaded. What is the most likely cause?', options: ['fEnabled is FALSE or the server was not restarted', 'The database is offline', 'The user lacks Modify permission', 'The WebLingo file has a typo'], answer: 0, explain: 'Handlers are registered at start-up only when fEnabled is TRUE.' },
          { q: 'Which handler feature names the WebLingo page that renders the response?', options: ['fPrototype', 'fHTMLFile', 'fEnabled', 'fPrgCtx'], answer: 1, explain: 'fHTMLFile names the template; fPrototype describes the arguments.' },
          { q: 'Where should a request handler gather its data?', options: ['In the WebLingo page', 'In Execute', 'In the browser', 'In the module ini file'], answer: 1, explain: 'Execute does the work; WebLingo only displays.' },
          { q: 'In WebLingo, what does a line starting with ; contain?', options: ['A comment', 'An OScript statement', 'CSS', 'A localisation key'], answer: 1, explain: 'A leading ; marks a line of OScript such as if, for or a declaration.' },
          { q: 'What does `;;call <file>( args )` do?', options: ['Calls a REST endpoint', 'Runs another WebLingo file with arguments', 'Executes SQL', 'Redirects the browser'], answer: 1, explain: ';;call includes another WebLingo file (a fragment) and passes it arguments.' },
          { q: 'An inherited script reads `.fHTMLFile`. Whose value does it get?', options: ['The parent\'s, always', 'The object the script was called on', 'The OSpace root\'s', 'Undefined'], answer: 1, explain: 'this is the object the script was called on, so a child\'s override is seen.' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ DV05
  {
    id: 'dv05', track: 'dev', title: 'Nodes, data & testing', source: C_CSIDE,
    summary: 'LLNode, WebNode and CSNode; callbacks; DAPI and CAPI; custom tables; OUnit; debugging.',
    domains: ['dev-oscript'],
    lesson: [
      'An item type is defined by objects registered under its **subtype**: **LLNode** (what it does — create, copy, move, delete, versions), **WebNode** (how it looks in Classic UI) and **CSNode** (how REST v2 and Smart View see it). **Callbacks** let your module react to operations on any node without owning the type.',
      { figure: { type: 'layers', layers: [
        { label: 'CSNode', items: ['REST v2, Smart View'] },
        { label: 'WebNode', items: ['Classic UI commands, icon'] },
        { label: 'LLNode', items: ['Data operations and rules'] },
        { label: 'DAPI / database', items: ['DTree and friends'] },
      ] }, caption: 'Layers of an item type.' },
      { h: 'Data access' },
      'Use **DAPI**/LLNode for nodes — they run as the user and trigger audit and callbacks. Use **CAPI.Exec** for SQL, always with bind variables. Group writes in a transaction.',
      { code: L(
        'String  stmt = "SELECT DataID, Name FROM DTree WHERE ParentID = :A1"',
        'Dynamic recs = CAPI.Exec( prgCtx.fDBConnect.fConnection, stmt, folderID )',
      ), lang: 'oscript', title: 'Bind variables' },
      { h: 'Testing and debugging' },
      { figure: { type: 'cycle', steps: ['Write test (OUnit)', 'Run — it fails', 'Fix code', 'Run — it passes', 'Debug with breakpoints if not'], center: 'Quality loop' }, caption: 'Tests first, debugger when they fail.' },
      'OUnit is the xUnit-style framework for OScript: test objects with set-up, tests with assertions, and tear-down, run inside a development server. The CSIDE debugger stops at breakpoints and shows variables; connect logs show each SQL statement and its time.',
      { callout: 'warn', title: 'Callbacks and performance', text: 'A callback runs in every matching operation of every user. Filter early and keep it fast; measure with the logs.' },
      { callout: 'exam', title: 'Exam angle', text: 'LLNode vs WebNode vs CSNode, callbacks, DAPI vs CAPI, bind variables, custom table rules, OUnit set-up/tear-down, which log shows SQL timings.' },
    ],
    keyPoints: [
      'LLNode = data behaviour, WebNode = Classic UI, CSNode = REST v2 / Smart View.',
      'Callbacks react to operations on all nodes.',
      'DAPI for nodes, CAPI.Exec with :A1 binds for SQL.',
      'Custom tables are prefixed, created by the module, never added to core tables.',
      'OUnit tests are independent; debug on development servers only.',
    ],
    missions: [
      {
        id: 'dv05-nodetype', type: 'practice', title: 'Design a custom item type',
        brief: 'Plan an "Invoice" item type with its own behaviour.',
        steps: [
          'List the objects you need (LLNode, WebNode, CSNode orphans) and which features each sets.',
          'Decide whether it is a container and whether it is versioned.',
          'Describe one callback your module needs (e.g. refuse moves into closed folders) and what it checks.',
          'Describe one custom table, its columns and how rows are cleaned up when an invoice is deleted.',
        ],
        reflection: 'Summarise your design: objects, callback, table, and two OUnit tests you would write for it.',
      },
      {
        id: 'dv05-quiz', type: 'quiz', title: 'Knowledge check: nodes, data and testing',
        questions: [
          { q: 'Which object defines what a node type does when it is copied or deleted?', options: ['WebNode', 'LLNode', 'The WebLingo file', 'KUAF'], answer: 1, explain: 'LLNode implements the data-side operations.' },
          { q: 'Which object controls a node type\'s Functions menu in the Classic UI?', options: ['LLNode', 'WebNode', 'CSNode', 'DAPI'], answer: 1, explain: 'WebNode is the Classic UI side of an item type.' },
          { q: 'What lets REST v2 and Smart View work with a node type?', options: ['A WebLingo page', 'CSNode support', 'A LiveReport', 'An agent'], answer: 1, explain: 'The REST layer maps node requests to CSNode, a wrapper around LLNode.' },
          { q: 'Why use `:A1` in a CAPI.Exec statement?', options: ['To comment the SQL', 'To bind a value safely instead of concatenating it', 'To select the first column', 'To start a transaction'], answer: 1, explain: 'Bind variables prevent SQL injection and handle quoting and types.' },
          { q: 'What is the purpose of an OUnit tear-down script?', options: ['To deploy the module', 'To remove what the test created so tests stay independent', 'To compile the OSpace', 'To restart the server'], answer: 1, explain: 'Set-up creates fixtures, tear-down removes them.' },
          { q: 'Which log helps most when a page is slow because of database calls?', options: ['The connect log with SQL statements and timings', 'The browser history', 'The audit trail', 'The module ini file'], answer: 0, explain: 'Connect logs record each SQL call and its duration.' },
          { q: 'Where should a module store its own data?', options: ['In new columns on DTree', 'In its own prefixed tables created by the module', 'In KUAF.UserData', 'In WebLingo files'], answer: 1, explain: 'Modules never change core tables; they own prefixed tables.' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ DV06
  {
    id: 'dv06', track: 'dev', title: 'REST API', source: C_REST,
    summary: 'Authenticate, read and write through the REST API, and extend it with your own resources.',
    domains: ['dev-rest'],
    lesson: [
      'The REST API is JSON over HTTP under `…/api/v1` and `…/api/v2`. It is what Smart View and CS Academy use. Sign in once with `POST /api/v1/auth`, then send the returned ticket in the `OTCSTicket` header on every call; keep the refreshed ticket the server sends back.',
      { figure: { type: 'lanes', lanes: [
        { label: 'Client', cells: ['POST /api/v1/auth', '', 'GET with OTCSTicket', '', 'Keep newest ticket'] },
        { label: 'Content Server', cells: ['', 'Returns ticket', '', 'JSON + OTCSTicket header', ''] },
      ] }, caption: 'Ticket authentication over time.' },
      { code: L(
        'POST /api/v1/auth          username=…&password=…      → { "ticket": "…" }',
        'GET  /api/v1/nodes/2000    OTCSTicket: …              → { "data": { … } }',
        'GET  /api/v2/nodes/2000/nodes?limit=100&page=1         → { "results": [ … ], "collection": { "paging": … } }',
        'POST /api/v1/nodes         multipart: type=144, parent_id, name, file   → new document',
      ), lang: 'http', title: 'The core calls' },
      { h: 'v1 and v2' },
      { figure: { type: 'compare', items: [
        { title: 'v1', tone: 'info', points: ['`data` envelope', 'Nodes, versions, categories, auth'] },
        { title: 'v2', tone: 'accent', points: ['`results` → `data` → `properties`', 'Search, permissions, members, fields/expand'] },
      ] }, caption: 'Two envelopes for the same data.' },
      { h: 'Extending' },
      'Custom resources are OScript objects in your module that the REST framework routes URLs to. They are stateless, can extend both versions, and get the authenticated user from the framework. A new item type should get CSNode support so the standard node endpoints work for it.',
      { callout: 'tip', title: 'Test before you code', text: 'Build a Postman collection: an auth request that stores the ticket in a variable, and every other request sending `OTCSTicket: {{ticket}}`.' },
      { callout: 'exam', title: 'Exam angle', text: 'Auth flow, header name, v1/v2 shapes, paging, multipart uploads, sub-resources (versions, categories, permissions), extending with OScript resources.' },
    ],
    keyPoints: [
      'POST /api/v1/auth → ticket → OTCSTicket header on every call.',
      'Keep the refreshed ticket from response headers; 401 means sign in again.',
      'v1: data envelope; v2: results/data/properties, fields, expand, metadata.',
      'Uploads are multipart with a file part.',
      'Custom REST resources are written in OScript; CSNode exposes node types.',
    ],
    missions: [
      {
        id: 'dv06-postman', type: 'practice', title: 'Call the REST API with Postman',
        brief: 'Make your first authenticated calls with a REST client.',
        steps: [
          'POST {{csUrl}}/api/v1/auth with form fields username and password; copy the ticket from the JSON.',
          'GET {{csUrl}}/api/v1/nodes/2000 with header OTCSTicket set to the ticket.',
          'GET {{csUrl}}/api/v2/nodes/2000 and compare the shape of the two answers.',
          'GET {{csUrl}}/api/v2/nodes/2000/nodes?limit=5 and find the paging information.',
        ],
        reflection: 'Describe the responses: where the node name is in v1 and in v2, which response header carried a ticket, and what the paging block told you.',
      },
      {
        id: 'dv06-sandbox', type: 'investigate', title: 'Find your sandbox through REST', requires: ['u01-sandbox'],
        brief: 'Use the API, not the address bar, to locate an item.',
        steps: [
          'With a ticket, GET /api/v1/volumes/142 (your Personal Workspace volume) and note its id.',
          'List its children with GET /api/v2/nodes/{id}/nodes and find “{{sandbox}}”.',
          'Type the sandbox\'s id from the JSON.',
        ],
        hints: ['In v2 the id is at results[n].data.properties.id.'],
        inputs: [{ key: 'sandboxId', label: 'Node ID of “{{sandbox}}”', placeholder: 'e.g. 123456' }],
        checks: [{ kind: 'answer', input: 'sandboxId', source: 'ref.id:sandbox', compare: 'number', label: 'Node ID of your sandbox' }],
      },
      {
        id: 'dv06-assignments', type: 'investigate', title: 'Count your assignments',
        brief: 'A v2-only resource: the signed-in user\'s assignments.',
        steps: [
          'GET /api/v2/members/assignments with your ticket.',
          'Count the entries in results (0 is a valid answer).',
        ],
        inputs: [{ key: 'count', label: 'Number of assignments' }],
        checks: [{ kind: 'answer', input: 'count', source: 'assignments.count', compare: 'number', label: 'Assignments count' }],
      },
      {
        id: 'dv06-quiz', type: 'quiz', title: 'Knowledge check: REST API',
        questions: [
          { q: 'Which call returns a ticket for user name and password?', options: ['GET /api/v1/ticket', 'POST /api/v1/auth', 'POST /api/v2/login', 'GET /api/v1/serverinfo'], answer: 1, explain: 'POST /api/v1/auth with form fields username and password returns { ticket }.' },
          { q: 'In which HTTP header is the ticket sent?', options: ['Authorization: Basic', 'OTCSTicket', 'X-CS-Session', 'Cookie: LLCookie only'], answer: 1, explain: 'Content Server reads the ticket from the OTCSTicket header.' },
          { q: 'Where is a node\'s name in a v2 GET /api/v2/nodes/{id} answer?', options: ['data.name', 'results.data.properties.name', 'node.name', 'properties[0]'], answer: 1, explain: 'v2 nests the element in results → data → properties.' },
          { q: 'How is a document uploaded with POST /api/v1/nodes?', options: ['JSON body with a base64 string only', 'multipart/form-data with type=144, parent_id, name and a file part', 'A GET with the file path', 'Through /api/v1/upload only'], answer: 1, explain: 'Uploads are multipart; the file part carries the bytes.' },
          { q: 'Which parameters page through a v2 list?', options: ['offset and count', 'limit and page', 'start and end', 'top and skip'], answer: 1, explain: 'limit sets the page size, page the 1-based page number.' },
          { q: 'A call returns HTTP 401 after working for an hour. What should the client do?', options: ['Retry the same call forever', 'Sign in again to get a new ticket', 'Switch to v1', 'Clear the browser cache'], answer: 1, explain: '401 means the ticket is missing or expired.' },
          { q: 'How do you add your own endpoint to the REST API?', options: ['Edit the delivered REST OSpace', 'Write a custom resource in OScript in your own module', 'Add a WebLingo page', 'Create a LiveReport'], answer: 1, explain: 'Custom resources are OScript objects in your module that the REST framework routes to.' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ DV07
  {
    id: 'dv07', track: 'dev', title: 'Content Web Services', source: C_REST,
    summary: 'SOAP services, the authentication token, typed proxies, and custom services with Service Data Objects.',
    domains: ['dev-rest'],
    lesson: [
      '**Content Web Services (CWS)** expose Content Server through SOAP. Each service publishes a WSDL; Java and .NET clients generate typed proxies from it. The main services are Authentication, DocumentManagement, ContentService (streaming file content), MemberService and SearchService.',
      { figure: { type: 'flow', steps: [{ label: 'AuthenticateUser', sub: 'or OTDS + ValidateUser' }, { label: 'Token', kind: 'system' }, { label: 'OTAuthentication header' }, { label: 'DocumentManagement.GetNode', kind: 'end' }] }, caption: 'Token first, then any operation.' },
      { code: L(
        '<soapenv:Header>',
        '  <api:OTAuthentication xmlns:api="urn:api.ecm.opentext.com">',
        '    <api:AuthenticationToken>…token…</api:AuthenticationToken>',
        '  </api:OTAuthentication>',
        '</soapenv:Header>',
      ), lang: 'xml', title: 'The token travels in a SOAP header' },
      { h: 'Custom services' },
      'When no delivered operation fits, build a custom web service backed by OScript in your module. Its inputs and outputs are **Service Data Objects** — named structures with typed fields — so the WSDL describes them exactly and clients get generated classes.',
      { figure: { type: 'compare', items: [
        { title: 'REST', tone: 'accent', points: ['JSON, any client', 'Ticket header', 'Extend with OScript resources'] },
        { title: 'CWS', tone: 'info', points: ['SOAP + WSDL, typed proxies', 'Token in SOAP header', 'Extend with custom services + SDOs'] },
      ] }, caption: 'Two service APIs for different clients.' },
      { callout: 'tip', title: 'SoapUI', text: 'Import the WSDLs into SoapUI, call AuthenticateUser, paste the token into an OTAuthentication header and call GetNode — no code needed to explore a service.' },
      { callout: 'exam', title: 'Exam angle', text: 'Service names and what they do, the OTAuthentication header, OTDS ValidateUser, ContentService for large files, SDOs as strongly typed data.' },
    ],
    keyPoints: [
      'CWS = SOAP services described by WSDL; generate proxies.',
      'Authentication.AuthenticateUser returns a token; OTDS tokens go through ValidateUser.',
      'The token goes in the OTAuthentication SOAP header.',
      'ContentService streams large content.',
      'Custom services exchange strongly typed Service Data Objects.',
    ],
    missions: [
      {
        id: 'dv07-soapui', type: 'practice', title: 'Explore CWS with SoapUI',
        brief: 'If your server has Content Web Services deployed, call it without writing code.',
        steps: [
          'Ask your administrator for the CWS address (for example …/cws/services/Authentication?wsdl).',
          'Create a SoapUI project from the Authentication WSDL and call AuthenticateUser.',
          'Add the DocumentManagement WSDL, add the OTAuthentication header with the token and call GetNode for ID 2000.',
          'Compare the result with GET /api/v1/nodes/2000 from REST.',
        ],
        reflection: 'Describe the token flow and the differences you saw between the SOAP Node and the REST JSON for the same item (or, without CWS access, describe the steps you would take).',
      },
      {
        id: 'dv07-sdo', type: 'practice', title: 'Design a Service Data Object',
        brief: 'Design the contract of a custom web service before coding it.',
        steps: [
          'Pick an operation an ERP needs, e.g. GetInvoiceSummary(documentID).',
          'Define the output SDO: field names and types.',
          'Decide which delivered types (Node, Version, Member) you can reuse.',
          'Write the faults the operation can return.',
        ],
        reflection: 'Present your operation, the SDO fields with types, and why a strongly typed contract helps the ERP developers.',
      },
      {
        id: 'dv07-quiz', type: 'quiz', title: 'Knowledge check: Content Web Services',
        questions: [
          { q: 'Which CWS service returns a token for user name and password?', options: ['DocumentManagement', 'Authentication', 'MemberService', 'ContentService'], answer: 1, explain: 'Authentication.AuthenticateUser returns the token.' },
          { q: 'Where must the CWS token be placed on later calls?', options: ['In the URL query string', 'In the OTAuthentication SOAP header', 'In the SOAP body of every element', 'In a cookie only'], answer: 1, explain: 'The token goes in OTAuthentication/AuthenticationToken in the SOAP header.' },
          { q: 'With OTDS single sign-on, how does a client get a CWS token?', options: ['From DocumentManagement.GetNode', 'Authenticate with OTDS, then call Authentication.ValidateUser with that token', 'It is not possible', 'From the REST API only'], answer: 1, explain: 'OpenText\'s samples validate the OTDS token with ValidateUser.' },
          { q: 'Which service streams large file content?', options: ['SearchService', 'ContentService', 'MemberService', 'Authentication'], answer: 1, explain: 'ContentService transfers content for a context ID created through DocumentManagement.' },
          { q: 'What is a Service Data Object?', options: ['A database table', 'A strongly typed data structure exchanged by a web service', 'A WebLingo fragment', 'A REST ticket'], answer: 1, explain: 'SDOs define typed fields so the WSDL and generated clients know the exact structure.' },
          { q: 'What describes a CWS service\'s operations and types to client generators?', options: ['The module ini file', 'The WSDL', 'The OTCSTicket', 'A LiveReport'], answer: 1, explain: 'Proxies are generated from the WSDL.' },
        ],
      },
    ],
  },
];

// Module knowledge checks show options in file order. The questions above were
// written with the right answer in a fixed position, so rotate each question's
// options deterministically to spread the correct answers across positions.
for (const mod of MODULES) {
  for (const m of mod.missions) {
    if (m.type !== 'quiz') continue;
    m.questions.forEach((q, i) => {
      const n = q.options.length;
      const shift = (i * 3 + mod.id.charCodeAt(3)) % n;
      const correct = q.options[q.answer];
      q.options = q.options.slice(shift).concat(q.options.slice(0, shift));
      q.answer = q.options.indexOf(correct);
    });
  }
}

module.exports = MODULES;
