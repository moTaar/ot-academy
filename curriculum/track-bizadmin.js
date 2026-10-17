'use strict';
// Track — Business Administrator (certification 5-0159) and the Extended ECM
// Cloud Practitioner credential. Builds on a02 (administration) and a06
// (business workspaces). The hands-on workspace lab lives in
// track-workspaces.js (ws01…); these modules cover the exam domains.
// All lesson text is original; see curriculum/CONTENT.md for the format.

const SRC = 'OpenText Content Management Business Administrator (5-0159) study plan';

module.exports = [
  // ------------------------------------------------------------------ BA01
  {
    id: 'ba01', track: 'bizadmin', title: 'Business workspaces: fundamentals & infrastructure', source: `${SRC} — 2-0108 Business Workspaces`,
    summary: 'What business workspaces are, what they depend on, and how to prepare categories, classifications and root folders before the first workspace type exists.',
    domains: ['ba-bw-fundamentals', 'ba-bw-infra'], feature: 'businessWorkspaces',
    lesson: [
      'A business workspace collects everything about one business object — a customer, a project, a contract — in one container that is named, filed, structured and secured the same way every time. That consistency does not happen by itself: it comes from configuration objects that a business administrator builds **before** the first workspace is created. This module covers the foundation layer: the concept, the dependency chain, and the infrastructure of categories, classifications and root folders.',
      { figure: { type: 'hub', center: 'Business workspace', items: [
        { label: 'Workspace type', sub: 'name, location' },
        { label: 'Template', sub: 'structure, roles' },
        { label: 'Classification', sub: 'template selection' },
        { label: 'Categories', sub: 'business metadata' },
        { label: 'Perspective', sub: 'Smart View page' },
        { label: 'Smart document types', sub: 'document rules' },
      ] }, caption: 'The configuration objects behind every workspace.' },
      { h: 'Build in dependency order' },
      'Each object refers to the ones beneath it. The workspace type reads category attributes to build names and paths; the template needs a type, a classification and categories; perspectives target workspace types. Building in the wrong order leaves you with references to objects that do not exist yet.',
      { figure: { type: 'flow', steps: [
        { label: 'Categories', sub: 'attributes' },
        { label: 'Classifications', sub: 'template tree' },
        { label: 'Root folder', sub: 'classified' },
        { label: 'Workspace type' },
        { label: 'Template' },
        { label: 'Perspective', kind: 'end' },
      ] } },
      { h: 'Permissions and privileges' },
      'Configuration needs **permissions** on the configuration volumes (Categories, Classifications, Document Templates, Perspectives) and, where an administrator restricted them, **object privileges** (to create item types such as business workspaces) and **usage privileges** (to use tools such as Perspective Manager). Users creating workspaces need Add Items on the location folder and the business workspace object privilege if it is restricted.',
      { h: 'Classifications and root folders' },
      'Templates are offered where the folder’s classification matches the template’s classification. So you create a classification tree for templates (Customer, Supplier, Project), classify each template, and classify the root folder — for example Enterprise ▸ Customers — with the same node. The root folder is also the **location** named in the workspace type for workspaces created automatically.',
      { steps: [
        'In the Categories volume, create the business category (e.g. Customer: number, name, region, status) with controlled values for anything used in names, paths or rules.',
        'In the Classifications volume, create a tree “Workspace Templates” with one node per workspace family.',
        'In the Enterprise workspace, create the root folder “Customers” and classify it with Workspace Templates ▸ Customer.',
        'Give creators Add Items on the root; everyone else See (business access comes from roles later).',
      ], title: 'Prepare the infrastructure' },
      { callout: 'exam', title: 'Exam focus', text: 'Template not offered → classification mismatch. Creation fails with an access error → Add Items on the location or the object privilege. Large categories inherited to every document → duplication and performance cost; prefer data on the workspace plus child-item indexing.' },
      { callout: 'tip', text: 'Every attribute should earn its place: if nothing (name, path, rule, facet, report) will use it, leave it out.' },
    ],
    keyPoints: [
      'A workspace is the product of type, template, classification, categories, roles and perspective.',
      'Build bottom-up: categories → classifications → root folder → type → template → perspective.',
      'Classification matching decides which templates are offered in a folder.',
      'Attributes that drive names and paths must be mandatory and controlled.',
      'Avoid inheriting big workspace categories to every document.',
    ],
    missions: [
      {
        id: 'ba01-classifications', type: 'investigate', title: 'Inspect the Classifications volume', feature: 'classifications',
        steps: ['Open the Classifications volume (Enterprise ▸ Classifications).', 'Note the name of one top-level item (for example a classification tree used for workspace templates).', 'Type that name below exactly as shown.'],
        inputs: [{ key: 'tree', label: 'Name of a top-level item in the Classifications volume' }],
        checks: [{ kind: 'answer', input: 'tree', source: 'classificationTrees', compare: 'contains', label: 'Classification tree name' }],
      },
      {
        id: 'ba01-dependency-map', type: 'practice', title: 'Draw the dependency map for a Supplier workspace',
        steps: [
          'Pick a business object your organisation handles in quantity (supplier, customer, project).',
          'List the configuration objects you would need: category and its attributes, classification node, root folder, workspace type, template, roles, perspective.',
          'For each, note what it depends on and who would own it.',
        ],
        reflection: 'Describe your dependency map in build order, naming the attributes that drive the name and the location and the classification that makes the template available.',
        minWords: 40,
      },
      {
        id: 'ba01-quiz', type: 'quiz', title: 'Knowledge check: fundamentals & infrastructure',
        questions: [
          { q: 'Users cannot see the Customer template when creating a workspace in the Customers folder. What is the most likely cause?', options: ['The category has too many attributes', 'The Customers folder lacks the classification used by the template', 'Child-item indexing is off', 'The perspective has no header'], answer: 1, explain: 'Templates are offered by classification match between folder and template.' },
          { q: 'Which object should be created first for a new workspace solution?', options: ['The perspective', 'The template', 'The business category and its attributes', 'The workspace type'], answer: 2, explain: 'Workspace types and templates reference category attributes, so the category comes first.' },
          { q: 'What is the difference between a permission and a privilege?', options: ['None', 'Permissions apply per item; privileges are system-wide abilities such as creating an item type or using a tool', 'Privileges apply per item; permissions are system-wide', 'Permissions only exist in workspaces'], answer: 1, explain: 'ACL permissions are per item; object and usage privileges are system-wide.' },
          { q: 'Which attribute is best suited to drive the location sub-path of workspaces?', options: ['An optional free-text comment', 'A mandatory region popup list', 'The document size', 'A multi-line description'], answer: 1, explain: 'Paths need values that are always present and consistent.' },
          { q: 'What is the main drawback of inheriting the full Customer category to every document in a workspace?', options: ['Categories cannot be inherited', 'Duplicated data that goes stale and grows the database and index', 'Documents lose permissions', 'The workspace is renamed'], answer: 1, explain: 'Inheritance copies values; keep business data on the workspace and use child-item indexing for search.' },
          { q: 'Which two settings make a root folder part of the workspace infrastructure?', options: ['It is the workspace type location and carries the template classification', 'It has a Best Bet and a facet', 'It is in the Personal Workspace', 'It has a local perspective and a reminder'], answer: 0, explain: 'The type location serves automatic creation; the classification serves manual creation.' },
          { q: 'Which statement about Business Scenarios and business workspaces is correct?', options: ['They are the same thing', 'A scenario is packaged configuration; workspaces are instances created from configuration', 'Workspaces contain scenarios', 'Scenarios are created by end users'], answer: 1, explain: 'Scenarios are deployed by administrators; workspaces are created many times by users or integrations.' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ BA02
  {
    id: 'ba02', track: 'bizadmin', title: 'Workspace types, templates & content structure', source: `${SRC} — 2-0108 Business Workspaces`,
    summary: 'Configure workspace types (naming, location, indexing), build templates with type, classification and categories, design their content with replacement tags, and relate workspaces.',
    domains: ['ba-ws-types'], feature: 'businessWorkspaces',
    lesson: [
      'The workspace type and the template split the work between them. The **type** decides the rules every workspace of a kind follows: the name pattern, the location (fixed folder or attribute-based sub-path), the icon, the indexing of child items and the relations to other types. The **template** is the master copy: folder structure, email folders, forums, standard documents, categories and roles, all copied into each new workspace.',
      { figure: { type: 'compare', items: [
        { title: 'Workspace type', tone: 'info', points: ['Naming pattern', 'Location and attribute path', 'Indexing of child items', 'Relations, icon, business object types'] },
        { title: 'Workspace template', tone: 'accent', points: ['Type + classification + categories', 'Folders, email folders, forums', 'Replacement tags in item names', 'Roles and permissions'] },
      ] }, caption: 'Rules on the type; content on the template.' },
      { h: 'Naming and location' },
      'Build names from mandatory, stable, controlled attributes — typically “number – name”. For large volumes add an attribute-based path such as Customers ▸ Region ▸ first letter, so no folder holds thousands of workspaces. Remember that changing a pattern later only affects new workspaces.',
      { figure: { type: 'tree', root: { label: 'Customers', icon: 'folder', children: [
        { label: 'EMEA', icon: 'folder', children: [
          { label: 'A', icon: 'folder', children: [{ label: '10023 – ACME Corp', icon: 'workspace' }] },
        ] },
        { label: 'APAC', icon: 'folder', children: [
          { label: 'K', icon: 'folder', children: [{ label: '30410 – Kite Ltd', icon: 'workspace' }] },
        ] },
      ] } }, caption: 'Attribute-based location: Region, then first letter.' },
      { h: 'Template content' },
      'Keep the structure shallow and process-based (01 Contracts, 02 Offers, 03 Correspondence as an email folder). Use **replacement tags** in sub-item names when they must carry the workspace’s data (“Credit check – 10023”); tags are resolved once, at creation. Templates are copies: editing a template never updates existing workspaces.',
      { steps: [
        'Create the workspace type: name, icon, naming pattern, location (and sub-path), indexing option.',
        'In Document Templates, add a workspace template; select the type and the classification; add the category.',
        'Build the folders, an email folder and any standard documents; add replacement tags where names must be self-explanatory.',
        'Define relations to other types if needed and add a Related Workspaces widget to the perspective later.',
        'Create a test workspace and check name, location, structure and categories.',
      ], title: 'Type and template in five steps' },
      { callout: 'exam', title: 'Exam focus', text: 'Naming pattern = type; replacement tags = names inside the template; several templates per type when structure or team differs; template changes do not reach existing workspaces; related workspaces are links, not containment.' },
    ],
    keyPoints: [
      'The workspace type holds naming, location, indexing and relation rules.',
      'The template carries type, classification, categories, content and roles.',
      'Replacement tags personalise names of items inside the template at creation.',
      'Editing a template affects only workspaces created afterwards.',
      'Related workspaces link independent workspaces; they do not move content or change permissions.',
    ],
    missions: [
      {
        id: 'ba02-types', type: 'investigate', title: 'Count the workspace types on your server',
        steps: ['Open the workspace type list (Administration ▸ Business Workspaces ▸ Workspace Types), or ask your administrator.', 'Count the workspace types and type the number.'],
        inputs: [{ key: 'count', label: 'Number of business workspace types' }],
        checks: [{ kind: 'answer', input: 'count', source: 'bwTypes.count', compare: 'number', label: 'Workspace type count' }],
      },
      {
        id: 'ba02-design-template', type: 'practice', title: 'Design a workspace template for a Customer',
        steps: [
          'Write the naming pattern and the location (with attribute-based sub-path) for a Customer workspace type.',
          'Sketch the template: at most two folder levels, one email folder, any standard documents.',
          'Mark which item names use replacement tags and which attributes they read.',
          'Decide whether you need one or two templates (e.g. Key account vs Standard) and why.',
        ],
        reflection: 'Describe your Customer workspace type and template: pattern, location, folder tree, replacement tags and the reason for your number of templates.',
        minWords: 50,
      },
      {
        id: 'ba02-quiz', type: 'quiz', title: 'Knowledge check: types & templates',
        questions: [
          { q: 'Where is the workspace naming pattern defined?', options: ['In the template', 'In the classification', 'In the workspace type', 'In the perspective'], answer: 2, explain: 'Naming is a workspace type rule built from attribute values.' },
          { q: 'Which three choices are made when creating a workspace template?', options: ['Type, classification, categories', 'Facet, Best Bet, perspective', 'Database, storage, index', 'Owner, nickname, version'], answer: 0, explain: 'Templates are tied to a type, classified, and carry the business categories.' },
          { q: 'A folder is added to the template. What happens to existing workspaces?', options: ['They get it immediately', 'They are rebuilt', 'Nothing; only new workspaces get it', 'They are deleted'], answer: 2, explain: 'Templates are copied at creation; existing workspaces are independent.' },
          { q: 'What does a replacement tag do?', options: ['Replaces the workspace type', 'Inserts workspace values into names of items inside the template at creation', 'Replaces deleted users', 'Renames the workspace when attributes change'], answer: 1, explain: 'Replacement tags personalise sub-item names once, when the workspace is created.' },
          { q: 'Why add an attribute-based location sub-path?', options: ['To avoid huge flat root folders', 'To speed up the Recycle Bin', 'To create Best Bets', 'To replace templates'], answer: 0, explain: 'Sub-paths distribute workspaces into manageable folders.' },
          { q: 'Key accounts need extra folders and a stricter team. Best design?', options: ['A second workspace type with the same rules', 'A second template of the same type', 'Ask users to add folders', 'A new classification volume'], answer: 1, explain: 'Several templates per type handle different structures and teams while sharing naming and location.' },
          { q: 'A contract workspace is related to a customer workspace. Which is true?', options: ['The contract moves inside the customer', 'Customer team members get access to the contract', 'Each keeps its own location, roles and permissions', 'The contract is renamed'], answer: 2, explain: 'Relations are links shown in widgets; they do not change content location or permissions.' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ BA03
  {
    id: 'ba03', track: 'bizadmin', title: 'Roles, permissions & access control in workspaces', source: `${SRC} — 2-0108 Business Workspaces`,
    summary: 'Define roles and their permissions in templates, use group replacement and default participants, keep template maintenance apart from workspace roles, and predict the effect of moving workspaces.',
    domains: ['ba-roles'], feature: 'businessWorkspaces',
    lesson: [
      'In business workspaces, access is designed once as **roles** in the template and then managed per workspace by adding **participants** to roles. Permissions are granted to the role, so a new team member gets the right access everywhere in the workspace the moment they are added — no ACL editing.',
      { figure: { type: 'matrix', cols: ['See', 'Add', 'Modify', 'Delete', 'Edit perms'], rows: [
        { label: 'Project Lead (team lead)', cells: [true, true, true, true, true] },
        { label: 'Project Member', cells: [true, true, true, false, false] },
        { label: 'Controlling', cells: [true, 'Budget only', 'Budget only', false, false] },
        { label: 'Readers', cells: [true, false, false, false, false] },
      ] }, caption: 'Design the role matrix first, then enter it in the template.' },
      { h: 'Propagation and exceptions' },
      'Set role permissions on the template root and apply them to sub-items; then add exceptions on restricted folders (only Controlling sees Budget). Items added later inherit from their folder. Remove ACL entries for individuals and broad groups from the template — whatever is on the template is copied into every workspace.',
      { h: 'Group replacement and default participants' },
      'When teams are organised by attribute (one sales group per region), **group replacement** resolves a placeholder group from the workspace’s data at creation, so one template serves every region. Fixed teams that belong in every workspace (Credit Control in the Finance role) are added as **default participants** of the role.',
      { figure: { type: 'flow', steps: [
        { label: 'Template role', sub: 'placeholder Sales ‹Region›' },
        { label: 'Create workspace', sub: 'Region = APAC', kind: 'actor' },
        { label: 'Resolved', sub: 'group Sales APAC', kind: 'system' },
        { label: 'Access granted', kind: 'end' },
      ] } },
      { h: 'Template maintenance versus workspace roles' },
      'People who maintain the template are not the people who work in workspaces. Grant template maintenance where it is not copied (the templates folder, or the template-administration role your release offers) — a broad group with full control on the template ends up with full control on every workspace.',
      { h: 'Moving workspaces' },
      'Roles, participants and role permissions move with the workspace. Permissions that came from the old parent depend on the system’s move setting; attributes are not updated automatically; relations and the business object link remain. Keep business access in roles so moves are harmless.',
      { steps: [
        'Write the role matrix with the business: roles, team lead, permissions per folder.',
        'Enter roles in the template, mark the team lead, add default participants.',
        'Apply role permissions to sub-items; set folder exceptions.',
        'Remove individual and broad-group ACL entries from the template.',
        'Create a test workspace and sign in as a test user per role.',
      ], title: 'Implement a role design' },
      { callout: 'exam', title: 'Exam focus', text: 'Add people to roles, not permissions to people. Group replacement needs existing groups and mandatory attributes. Template ACLs are copied. Moving keeps roles; inherited parent permissions depend on settings.' },
    ],
    keyPoints: [
      'Permissions go to roles; people join roles as participants.',
      'Template roles, permissions and default participants are copied into each workspace.',
      'Group replacement resolves the right group from workspace data at creation.',
      'Keep template-maintenance access out of what gets copied.',
      'Moving a workspace keeps its roles; access from the old parent may change.',
    ],
    missions: [
      {
        id: 'ba03-role-matrix', type: 'practice', title: 'Design the role matrix for a Project template',
        steps: [
          'List the roles of a project workspace (lead, members, controlling, readers…).',
          'For each role, decide the permissions on the workspace and on one restricted folder.',
          'Decide which role is the team lead and which groups are default participants.',
          'Decide whether any role needs group replacement and which attribute drives it.',
        ],
        reflection: 'Write your role matrix and explain one folder exception, the team lead choice, and how group replacement or default participants are used.',
        minWords: 50,
      },
      {
        id: 'ba03-quiz', type: 'quiz', title: 'Knowledge check: roles & permissions',
        questions: [
          { q: 'A new member joins a project. What is the correct action?', options: ['Grant permissions on each folder', 'Add her to the right role of the workspace', 'Edit the template', 'Give her System Administration rights'], answer: 1, explain: 'Role membership gives the role’s permissions everywhere in the workspace.' },
          { q: 'Where are workspace roles defined so every new workspace gets them?', options: ['In the workspace type', 'In OTDS', 'In the template', 'In Perspective Manager'], answer: 2, explain: 'Roles are part of the template and copied at creation.' },
          { q: 'One template must give each region’s sales group access based on Region. Which feature?', options: ['Group replacement', 'Best Bets', 'Facet trees', 'Upload control'], answer: 0, explain: 'Group replacement resolves the group from workspace data.' },
          { q: 'A broad group has full control on the template for maintenance. What is the risk?', options: ['None', 'It cannot edit the template', 'It is copied into every workspace and gains access to all of them', 'It deletes the template'], answer: 2, explain: 'The template’s ACL is copied into each new workspace.' },
          { q: 'After moving a workspace to another folder, what stays the same?', options: ['Roles and their participants', 'Every permission inherited from the old parent, regardless of settings', 'The location path', 'Nothing'], answer: 0, explain: 'Roles belong to the workspace; inherited parent permissions depend on move settings.' },
          { q: 'A group must be in the Finance role of every new workspace. Simplest configuration?', options: ['Ask team leads each time', 'A perspective rule', 'Default participant on the template role', 'A system message'], answer: 2, explain: 'Default participants are copied into each workspace.' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ BA04
  {
    id: 'ba04', track: 'bizadmin', title: 'Smart document types, Smart View & perspectives', source: `${SRC} — 2-0108 and 3-0189`,
    summary: 'Configure smart document types and their bots, build perspectives with Perspective Manager (widgets, tabs, rules, order), and set Smart View features such as JATO UX and Recently Accessed.',
    domains: ['ba-smart'], feature: 'businessWorkspaces',
    lesson: [
      'This module covers the most heavily weighted configuration domain: what happens to documents entering a workspace (**smart document types**) and what users see (**perspectives** and **Smart View settings**).',
      { h: 'Smart document types' },
      'A smart document type is based on a document-type **classification** (Contract, Project plan) and scoped to a workspace type. **Bots** add behaviour: file into a folder, add a category with mandatory attributes, apply only under a condition, restrict uploaders to a role, mark as mandatory (shown as missing in the header), compute validity, require approval. **Upload control** on the template makes users choose a document type for every upload so the rules always run.',
      { figure: { type: 'flow', steps: [
        { label: 'Upload', kind: 'actor' },
        { label: 'Choose type', kind: 'decision' },
        { label: 'Bots run', sub: 'folder, category, checks', kind: 'system' },
        { label: 'Approval?', kind: 'decision' },
        { label: 'Stored', sub: 'missing list updated', kind: 'end' },
      ] } },
      { h: 'Perspectives' },
      'Perspective Manager builds landing page, container and business workspace perspectives. Choose a layout (flow, left–center–right, tabbed with header), drag widgets in, set their options (which attributes, which related type, which columns), add tabs, then set **rules**: workspace or container type, location, group, device, and in newer releases classification. Global perspectives are evaluated **in order** — the first match wins — and a local perspective on an item overrides them.',
      { figure: { type: 'ladder', steps: [
        { label: 'Default layout' },
        { label: 'General global perspective' },
        { label: 'Specific global perspective', sub: 'group, type, device' },
        { label: 'Local perspective', sub: 'on one item' },
      ] }, caption: 'More specific wins — if it is ordered correctly.' },
      { h: 'Smart View features' },
      'Business administrators also enable **JATO UX** (the redesigned UI from CE 25.4 that users can switch to), the **simple user profile**, choose the subtypes recorded by **Recently Accessed**, and configure **drag and drop** — checking that drag and drop does not bypass the upload control you rely on.',
      { steps: [
        'Create a document-type classification tree and a smart document type “Contract” scoped to the Customer type.',
        'Add bots: file into 01 Contracts, Contract category with mandatory end date, mandatory, validity from end date.',
        'Enable upload control on the template.',
        'In Perspective Manager, create a tabbed Customer perspective with header (missing documents), Metadata, Team and Related Workspaces widgets; rule: workspace type = Customer.',
        'Check the order of global perspectives and test on desktop and phone.',
      ], title: 'From document rule to page' },
      { callout: 'exam', title: 'Exam focus', text: 'Map each requirement to a bot; know that smart document types build on classifications; first matching global perspective wins; local overrides global; JATO UX, Recently Accessed subtypes and drag and drop are Smart View admin settings.' },
    ],
    keyPoints: [
      'Smart document types = document-type classification + bots + scope.',
      'Upload control makes sure the rules run on every upload.',
      'Perspectives: layout, widgets with options, tabs and rules.',
      'Global perspectives are evaluated in order; local perspectives override.',
      'Smart View admin covers JATO UX, simple profile, Recently Accessed and drag and drop.',
    ],
    missions: [
      {
        id: 'ba04-smart-type', type: 'practice', title: 'Specify three smart document types',
        steps: [
          'For a project workspace, pick three document types (e.g. Project charter, Budget plan, Minutes).',
          'For each, list the bots: target folder, category and mandatory attributes, allowed uploaders, mandatory or not, condition (phase), validity, approval.',
          'Decide whether upload control should be enforced and why.',
        ],
        reflection: 'Describe your three smart document types and their bots, and explain your upload-control decision.',
        minWords: 50,
      },
      {
        id: 'ba04-perspective', type: 'practice', title: 'Design a workspace perspective',
        steps: [
          'Choose the layout for a Customer workspace perspective.',
          'List the header attributes, tabs and widgets (with their key options).',
          'Write the rule(s) and where the perspective goes in the global order.',
          'If you have the privilege, build it on a test system with Perspective Manager.',
        ],
        reflection: 'Describe your perspective: layout, tabs, widgets with options, rules, and why it is placed where it is in the global order.',
        minWords: 40,
      },
      {
        id: 'ba04-quiz', type: 'quiz', title: 'Knowledge check: smart document types & perspectives',
        questions: [
          { q: 'Which object is a smart document type based on?', options: ['A workflow map', 'A document-type classification', 'A facet', 'A Best Bet'], answer: 1, explain: 'Document-type classifications identify the type stamped on uploaded documents.' },
          { q: 'A signed charter must show as missing until uploaded. Which rule?', options: ['Validity period', 'Make mandatory', 'Allowed uploaders', 'File into folder'], answer: 1, explain: 'Mandatory types appear as missing in the workspace header.' },
          { q: 'Users drop files into folders and bypass the rules. What do you enable?', options: ['Upload control on the template', 'Child-item indexing', 'A system message', 'Recycle Bin'], answer: 0, explain: 'Upload control forces the document-type selection.' },
          { q: 'A Sales home page never appears because a general home page matches first. Fix?', options: ['Delete the general one', 'Move the Sales perspective before the general one in the global order', 'Give Sales users admin rights', 'Use a Best Bet'], answer: 1, explain: 'The first matching global perspective wins; order specific before general.' },
          { q: 'Which layout is typical for a workspace with Overview, Documents and Related tabs?', options: ['Flow without header', 'Tabbed with a header widget', 'Single HTML tile', 'Classic View only'], answer: 1, explain: 'Workspace perspectives usually use a header plus tabs.' },
          { q: 'Which is a Smart View administration feature?', options: ['Choosing subtypes for Recently Accessed', 'Adding Index Engines', 'Configuring storage providers', 'Creating OTDS partitions'], answer: 0, explain: 'Recently Accessed subtypes, JATO UX, simple profile and drag and drop are business-admin Smart View settings.' },
          { q: 'A budget plan is mandatory only in the Planning phase. How?', options: ['A template per phase', 'A condition on the Project phase attribute', 'A facet tree', 'Delete it later'], answer: 1, explain: 'Conditions activate a smart document type only when an attribute matches.' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ BA05
  {
    id: 'ba05', track: 'bizadmin', title: 'Business Scenarios & Transport', source: `${SRC} — 2-0108 and 3-0189`,
    summary: 'Understand and safely customize Business Scenarios, and move configuration with the Transport Warehouse: workbenches, packages, export, import, dependencies and deployment.',
    domains: ['ba-scenarios', 'ba-transport'], feature: 'admin',
    lesson: [
      'Configuration is built once and then moved: from development to test to production, and from OpenText to you in the form of **Business Scenarios**. The tool for both is **Transport**.',
      { h: 'Business Scenarios' },
      'A Business Scenario (Agreements, Projects, Teamspaces…) is a package of configuration: categories, classifications, workspace types, templates, roles, smart document types, workflows and perspectives. Deploy it unchanged in development, evaluate it with users, then adapt it with **additive, documented** changes: add attributes, folders, roles, tabs, document types; copy before you change; avoid renaming or deleting objects that patterns, perspectives, workflows or bots reference.',
      { figure: { type: 'layers', layers: [
        { label: 'UX', items: ['Perspectives', 'Widgets'] },
        { label: 'Process', items: ['Workflows', 'Smart document types'] },
        { label: 'Structure', items: ['Workspace types', 'Templates', 'Roles'] },
        { label: 'Foundation', items: ['Categories', 'Classifications'] },
      ] }, caption: 'Scenario layers: changes low in the stack ripple upwards.' },
      { h: 'Transport vocabulary' },
      'The **Transport Warehouse** (Enterprise menu, for authorised users) holds **Warehouse folders**, **workbenches** and the **Transport Packages** container. Items are added to a workbench (becoming transport items), the workbench is packaged into a **Transport Package** (ZIP), downloaded, uploaded to the target Warehouse, unpacked into a workbench, analysed for **dependencies** and **deployed**. Roles: Developer (builds workbenches), Warehouse Manager (all workbenches, packages, deploy), Administrator (everything, grants access).',
      { figure: { type: 'lanes', lanes: [
        { label: 'Source', cells: ['Workbench', 'Add items', 'Package', 'Download', '', ''] },
        { label: 'Target', cells: ['', '', '', 'Upload', 'Unpack & analyse', 'Deploy'] },
      ] } },
      { h: 'Prerequisites and pitfalls' },
      { ul: [
        'Compatible versions and the same modules on source and target.',
        'Users and groups in permissions exist on the target — unmapped entries are dropped.',
        'Dependencies are on the target or in the workbench; otherwise Deploy stays unavailable.',
        'Same-name documents deploy as new versions; existing classifications are updated, not duplicated.',
      ] },
      { steps: [
        'Create a workbench and add the category, classification tree, workspace type, template and perspective of your solution.',
        'Create and download the Transport Package; attach deployment notes.',
        'On the target, upload the package, unpack it into a workbench and review each item’s dependencies.',
        'Resolve anything missing, then deploy and test with a new workspace.',
      ], title: 'Promote a workspace solution' },
      { callout: 'exam', title: 'Exam focus', text: 'Terminology and order of Transport steps; Deploy disabled = unresolved dependencies; scenarios deploy through Transport; customize scenarios additively and document changes.' },
    ],
    keyPoints: [
      'Business Scenarios are packaged configuration; workspaces are instances.',
      'Customize scenarios with additive, documented changes; copy before changing.',
      'Workbench → Transport Package → download → upload → unpack → analyse → deploy.',
      'Deploy needs every dependency on the target or in the workbench.',
      'Users and groups must exist on the target for permissions to deploy.',
    ],
    missions: [
      {
        id: 'ba05-transport-plan', type: 'practice', title: 'Plan a transport for a workspace solution',
        steps: [
          'List every object of a workspace solution you know (category, classifications, type, template, smart document types, perspective, root folder).',
          'Order them by dependency and decide what goes into one workbench or into a foundation package first.',
          'List the prerequisites to check on the target (versions, modules, groups).',
        ],
        reflection: 'Describe your workbench contents, the deployment order, the prerequisites and how you will verify the result on the target.',
        minWords: 50,
      },
      {
        id: 'ba05-scenario-strategy', type: 'practice', title: 'Write a customization strategy for a Business Scenario',
        steps: [
          'Pick a scenario (e.g. Agreements) and three requirements it does not meet as delivered.',
          'For each, decide: setting only, additive change, copy-and-change, or avoid.',
          'Describe how you will document and transport the changes and retest at upgrade.',
        ],
        reflection: 'Explain your three decisions and why each is safe (or why you rejected it), plus your documentation and upgrade approach.',
        minWords: 50,
      },
      {
        id: 'ba05-quiz', type: 'quiz', title: 'Knowledge check: scenarios & transport',
        questions: [
          { q: 'Where are items collected for transport?', options: ['In the Warehouse root', 'In a workbench', 'In a collection', 'In the Recycle Bin'], answer: 1, explain: 'Items always go into a workbench.' },
          { q: 'Deploy is unavailable on the target. Most likely cause?', options: ['Unresolved dependencies', 'The package is too small', 'The workbench is shared', 'It is a weekend'], answer: 0, explain: 'All dependencies must exist on the target or in the workbench.' },
          { q: 'Which change to a Business Scenario is safest?', options: ['Renaming an attribute used in a naming pattern', 'Deleting a delivered role', 'Adding a tab to a copy of a delivered perspective', 'Changing internal identifiers'], answer: 2, explain: 'Additive changes on copies do not break references.' },
          { q: 'Which Transport role can see all workbenches and deploy packages?', options: ['Developer', 'Reader', 'Warehouse Manager', 'Team Lead'], answer: 2, explain: 'Warehouse Managers manage imports, exports and deployments.' },
          { q: 'Permissions refer to a group that does not exist on the target. Result?', options: ['The group is created', 'That permission entry is not applied', 'Everyone gets access', 'The deploy is cancelled for all items'], answer: 1, explain: 'Only mapped users and groups keep their permissions.' },
          { q: 'How is a Business Scenario deployed?', options: ['By copying files to the server', 'Through Transport packages in the Warehouse', 'By SQL scripts', 'Through Perspective Manager'], answer: 1, explain: 'Scenarios are delivered as transport packages.' },
          { q: 'What should go to production after acceptance in test?', options: ['The same package', 'A manually rebuilt configuration', 'Only the perspective', 'Nothing'], answer: 0, explain: 'Promote exactly what was tested.' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ BA06
  {
    id: 'ba06', track: 'bizadmin', title: 'Facets, columns & search administration', source: `${SRC} — 3-0189 Business Administration`,
    summary: 'Create facets, facet trees and columns, control their availability and order, and administer system search forms, Best Bets, search filters and child-item indexing.',
    domains: ['ba-facets', 'ba-search'], feature: 'virtualFolders',
    lesson: [
      'Finding things is where good metadata pays off. The business administrator turns attributes into **columns** (to see and sort), **facets** (to filter browse lists) and **search filters** (to narrow results), and shapes search with **system search forms**, **Best Bets** and **child-item indexing** for workspace types.',
      { h: 'Facets and columns' },
      'Both are items in the **Facets volume** built on a **data source** — a system attribute (Modified, Owner, MIME type) or a category attribute (Region, Contract end date). After creation, data is built in the background; then the column or facet appears where its **availability** allows: globally or only in chosen locations. **Facet trees** nest facets for drill-down. Columns can be global or set on a container with their own **display order**.',
      { figure: { type: 'flow', steps: [
        { label: 'Attribute with values' },
        { label: 'Column/facet item', sub: 'Facets volume' },
        { label: 'Availability', sub: 'global or location' },
        { label: 'Data built', kind: 'system' },
        { label: 'Shown to users', kind: 'end' },
      ] }, caption: 'Steps to create a facet or column.' },
      { h: 'Search administration' },
      { figure: { type: 'compare', items: [
        { title: 'System search form', tone: 'info', points: ['Prescribed fields and scope', 'Created by an admin', 'Offered to all or some groups'] },
        { title: 'Best Bet', tone: 'accent', points: ['Keyword → item at the top', 'Optional expiry date', 'Never bypasses permissions'] },
        { title: 'Child-item indexing', tone: 'xp', points: ['Per workspace type', 'Find documents by workspace data', 'Needs reindexing'] },
      ] } },
      'Search filters and display settings decide which filters users see on results (Type, Modified, Region…), default fields, sorting and result counts. Search infrastructure — partitions, engines — stays with the system administrator.',
      { steps: [
        'Create a column “Contract end date” from the Contract category attribute; set it on 01 Contracts in the template and order it after Name.',
        'Create a location-specific facet “Customer status” for the Customers area.',
        'Save an advanced search for contracts and publish it as a system search form for the Sales group.',
        'Add a Best Bet “travel policy” with an expiry date.',
        'Enable child-item indexing on the Customer workspace type and plan reindexing.',
      ], title: 'A findability package for customers' },
      { callout: 'exam', title: 'Exam focus', text: 'Order of steps for facets/columns; empty column = data not built; global vs location-specific; system form vs Best Bet vs filter vs child-item indexing.' },
    ],
    keyPoints: [
      'Facets and columns are Facets-volume items built on system or category attributes.',
      'Availability can be global or location-specific; columns have a display order.',
      'Facet trees nest facets for drill-down.',
      'System search forms, Best Bets and filters shape how people search.',
      'Child-item indexing on a workspace type lets documents be found by workspace data.',
    ],
    missions: [
      {
        id: 'ba06-facet', type: 'practice', title: 'Configure a facet on a folder of your sandbox',
        steps: [
          'Open your sandbox folder in Smart View and look at the Facets panel.',
          'If you have the privilege, create a facet (or column) in the Facets volume from a category attribute your sandbox items carry, available only on your sandbox.',
          'If you do not have the privilege, write the exact steps and settings you would use.',
          'Check how it filters or displays your items.',
        ],
        reflection: 'Which attribute did you use, what availability did you choose, and what did you observe (or expect) after the data was built?',
        minWords: 30,
      },
      {
        id: 'ba06-quiz', type: 'quiz', title: 'Knowledge check: facets, columns & search',
        questions: [
          { q: 'A new column shows empty values. Most likely reason?', options: ['Columns only work in Classic View', 'Its data has not been built yet', 'It needs a Best Bet', 'The category is deleted'], answer: 1, explain: 'Column/facet data is collected in the background after creation.' },
          { q: 'Where are facets and columns administered?', options: ['Categories volume', 'Facets volume', 'Document Templates', 'Transport Warehouse'], answer: 1, explain: 'Facets, facet trees and columns are items in the Facets volume.' },
          { q: 'A facet only makes sense under Customers. Availability?', options: ['Global', 'Location-specific', 'Hidden for all', 'On the home page'], answer: 1, explain: 'Location-specific availability avoids clutter elsewhere.' },
          { q: 'The HR policy should be first for “vacation”. Which feature?', options: ['Facet', 'System search form', 'Best Bet', 'Column'], answer: 2, explain: 'Best Bets promote chosen items for keywords.' },
          { q: 'Find invoices by their customer workspace number?', options: ['Child-item indexing on the workspace type', 'A Best Bet', 'A facet tree', 'Recycle Bin'], answer: 0, explain: 'Workspace data is indexed with child items.' },
          { q: 'Everyone should use the same contract search form. What do you create?', options: ['A personal saved search', 'A system search form', 'A Best Bet', 'A perspective'], answer: 1, explain: 'System search forms are published by administrators.' },
          { q: 'Which attribute makes the best facet?', options: ['A unique document number', 'A free-text comment', 'A controlled Region list', 'A long description'], answer: 2, explain: 'Facets need a small set of shared, controlled values.' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ BA07
  {
    id: 'ba07', track: 'bizadmin', title: 'Settings, monitoring & administrative privileges', source: `${SRC} — 3-0189 Business Administration`,
    summary: 'Administrative accounts and privileges, feature and user settings (item control, modified dates, MIME categories, Recycle Bin, display, delegates), the audit log, system messages and monitoring.',
    domains: ['ba-admin-roles', 'ba-settings'], feature: 'admin',
    lesson: [
      'Business administration is delegated administration. You work with **named accounts** and only the **privileges** the job needs, and you look after the system-wide switches that shape everyday behaviour.',
      { h: 'Accounts and privileges' },
      { figure: { type: 'ladder', steps: [
        { label: 'User', sub: 'item permissions' },
        { label: 'Usage & object privileges', sub: 'specific tools and item types' },
        { label: 'User Administration rights', sub: 'users and groups' },
        { label: 'System Administration rights', sub: 'admin functions, bypass permissions' },
        { label: 'Admin user', sub: 'built-in, everything' },
      ] } },
      'The built-in **Admin** account is for setup and emergencies. **System Administration rights** reach administrative functions and bypass permissions; **User Administration rights** manage users and groups only. **Object privileges** restrict who may create item types; **usage privileges** restrict who may use features — the clean way to delegate business administration.',
      { h: 'Feature and user settings' },
      { table: { head: ['Requirement', 'Setting'], rows: [
        ['Permission changes should not make items look modified', 'Modified-date triggers'],
        ['Every .msg file gets the Email category', 'MIME types and categories'],
        ['Deleted items recoverable for 30 days', 'Recycle Bin'],
        ['Unambiguous names in lists', 'User and group display'],
        ['Work continues during absence', 'User delegates'],
        ['Consistent security and item behaviour', 'Access and item control'],
      ] } },
      { h: 'Audit, messages, monitoring' },
      'Choose **audit interests** that matter (deletes, permission and ownership changes), query the **audit log** by event, user, date and item, publish **system messages** for maintenance windows, and watch agent, search and server status so problems are reported with evidence.',
      { figure: { type: 'cycle', steps: ['Audit what matters', 'Monitor status', 'Investigate', 'Inform users', 'Document'], center: 'Operate' } },
      { steps: [
        'Create a business administrator group and restrict the relevant usage privileges to it.',
        'Review modified-date triggers and the Recycle Bin retention with the business.',
        'Set audit interests; run a test query for deletions.',
        'Publish a test system message with start and end time.',
      ], title: 'A first week as business administrator' },
      { callout: 'exam', title: 'Exam focus', text: 'User Administration ≠ System Administration rights; object vs usage privileges; which setting answers which requirement; audit log vs system messages vs monitoring.' },
    ],
    keyPoints: [
      'Use named accounts; reserve the built-in Admin.',
      'System Administration rights bypass permissions; User Administration rights manage users and groups.',
      'Object privileges = who may create a type; usage privileges = who may use a feature.',
      'Know the settings: item control, modified-date triggers, MIME categories, Recycle Bin, display, delegates.',
      'Audit what matters, query it, and announce changes with system messages.',
    ],
    missions: [
      {
        id: 'ba07-rights', type: 'investigate', title: 'Do you hold System Administration rights?',
        steps: ['Open your user profile or ask your administrator which privileges your account holds.', 'Answer yes or no.'],
        inputs: [{ key: 'sysadmin', label: 'System Administration rights? (yes/no)' }],
        checks: [{ kind: 'answer', input: 'sysadmin', source: 'user.isSysAdmin', compare: 'yesno', label: 'System Administration rights' }],
      },
      {
        id: 'ba07-version', type: 'investigate', title: 'Record the server version you administer',
        steps: ['Find the Content Server version (Help ▸ About, System Report or Administration pages).', 'Type it, e.g. 22.3 or 16.2.11. Settings names in your release depend on it.'],
        inputs: [{ key: 'version', label: 'Content Server version' }],
        checks: [{ kind: 'answer', input: 'version', source: 'server.version', compare: 'contains', label: 'Server version' }],
      },
      {
        id: 'ba07-settings-review', type: 'practice', title: 'Review five feature settings',
        steps: [
          'For modified-date triggers, MIME categories, Recycle Bin, user display and delegates, write the current value (if you can see it) or the value you would choose.',
          'For each, name the business reason.',
          'Write the system message you would publish before changing one of them.',
        ],
        reflection: 'List the five settings with your chosen values and reasons, and give the text of your system message.',
        minWords: 50,
      },
      {
        id: 'ba07-quiz', type: 'quiz', title: 'Knowledge check: settings & privileges',
        questions: [
          { q: 'A help-desk agent must manage users and groups but not see all content. Which privilege?', options: ['System Administration rights', 'User Administration rights', 'Public Access', 'Warehouse Manager'], answer: 1, explain: 'User Administration rights cover users and groups only.' },
          { q: 'Which privilege bypasses item permissions?', options: ['User Administration rights', 'Log-in', 'System Administration rights', 'A usage privilege'], answer: 2, explain: 'System Administration rights bypass permission checks.' },
          { q: 'Documents look modified after a permission change. Which setting?', options: ['Recycle Bin', 'Modified-date triggers', 'Audit interests', 'User display'], answer: 1, explain: 'Triggers decide which events update the Modified date.' },
          { q: 'How do you find who deleted a document?', options: ['Query the audit log', 'Check Recently Accessed', 'Ask the Transport Warehouse', 'Look at Best Bets'], answer: 0, explain: 'Audited delete events are queried in the audit log.' },
          { q: 'Announce maintenance to all users?', options: ['Reminder', 'System message', 'Best Bet', 'Facet'], answer: 1, explain: 'System messages appear for a defined period.' },
          { q: 'Which statement about usage privileges is true?', options: ['They are set per item', 'They restrict who may use a feature or tool', 'They restrict who may create users', 'They replace permissions'], answer: 1, explain: 'Usage privileges control access to features; object privileges control item-type creation.' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ BA08
  {
    id: 'ba08', track: 'bizadmin', title: 'Module administration: collections, workflow, reminders, notifications & records', source: `${SRC} — 3-0189 Business Administration`, feature: 'records',
    summary: 'Configure collection settings, workflow parameters and My ToDo tabs; administer reminders and the Notification Center; explain Records Management, Physical Objects and Security Clearance and change item ownership.',
    domains: ['ba-modules'],
    lesson: [
      'The final exam domain tours the modules a business administrator configures. Each is small; together they decide how people are reminded, notified and governed.',
      { figure: { type: 'hub', center: 'Module administration', items: ['Collections', 'Workflow parameters', 'My ToDo tabs', 'Reminders', 'Notification Center', 'Records Management', 'Physical Objects', 'Security Clearance'] } },
      { h: 'Collections, workflow, My ToDo' },
      'General **collection settings** control who may create collections, how large they may grow and what actions they allow. **Workflow parameters** tune system-wide behaviour: agent timing, step notifications, status display and clean-up. The **My ToDo** widget shows pending work in tabs (workflows, reminders, tasks); hide the tabs nobody uses and order the rest.',
      { h: 'Reminders and the Notification Center' },
      'Reminders administration covers **reminder objects** (which item types can carry reminders), the **email agent** (when emails go out), **reminder clients** (client types with their own settings) and **email templates**. The **Notification Center** has **providers** (event sources), **delivery methods** (in-app, email, digests) and **messages**.',
      { figure: { type: 'compare', items: [
        { title: 'Reminder', tone: 'info', points: ['User-created on an item', 'Due date and status', 'Sent by the reminder email agent'] },
        { title: 'Notification Center', tone: 'accent', points: ['Event-driven messages', 'Providers you enable', 'In-app bell, email or digest'] },
      ] } },
      { h: 'Records Management, Physical Objects, Security Clearance' },
      '**Records Management** applies retention and disposition through RM classifications, with holds that suspend disposal. **Physical Objects** tracks paper items, locations and loans. **Security Clearance** adds levels and markings on top of permissions — it never grants access. RM administration also provides a tool to **change or switch ownership** of items, for example when an employee leaves.',
      { steps: [
        'Enable reminders on Business Workspace objects and schedule the reminder email agent before working hours.',
        'Create a reminder email template with item name and due date in the subject.',
        'Enable Notification Center providers for workspaces and workflows and offer a weekly digest.',
        'Trim the My ToDo tabs to what your users use.',
        'Use the RM ownership tool to transfer a leaver’s items to their successor.',
      ], title: 'Tune notifications for a business team' },
      { callout: 'exam', title: 'Exam focus', text: 'Know the parts of reminders administration, the three Notification Center settings, that My ToDo tabs are customizable, the benefits of RM/PO/Security Clearance, and that ownership changes go through Records Management tools.' },
    ],
    keyPoints: [
      'Collections, workflow parameters and My ToDo tabs are central settings.',
      'Reminders: objects, email agent, clients, email templates.',
      'Notification Center: providers, delivery methods, messages.',
      'Security Clearance restricts on top of permissions; holds beat retention.',
      'Change or switch item ownership with Records Management tools.',
    ],
    missions: [
      {
        id: 'ba08-notify-plan', type: 'practice', title: 'Design reminders and notifications for a team',
        steps: [
          'Pick a team that works in business workspaces.',
          'Decide which objects get reminders, when the email agent runs, and write one reminder email template.',
          'Choose Notification Center providers and delivery (in-app, email, digest).',
          'Decide which My ToDo tabs they need.',
        ],
        reflection: 'Describe your reminder setup, the email template text, the Notification Center providers and delivery you chose, and the My ToDo tabs — with the reason for each.',
        minWords: 50,
      },
      {
        id: 'ba08-quiz', type: 'quiz', title: 'Knowledge check: module administration',
        questions: [
          { q: 'Reminder emails should arrive at 07:00. What do you configure?', options: ['Reminder email template', 'Reminder email agent schedule', 'Notification provider', 'Collection settings'], answer: 1, explain: 'The agent decides when emails are sent; templates decide their content.' },
          { q: 'Which is a Notification Center setting?', options: ['Delivery methods such as email digest', 'Workspace naming pattern', 'Facet availability', 'Transport roles'], answer: 0, explain: 'Providers, delivery methods and messages are configured for the Notification Center.' },
          { q: 'An employee left; reassign everything they owned. Which tool?', options: ['Recycle Bin', 'Records Management ownership change', 'Perspective Manager', 'Best Bets'], answer: 1, explain: 'RM administration offers bulk ownership change.' },
          { q: 'Which module tracks boxes, locations and loans?', options: ['Security Clearance', 'Collections', 'Physical Objects', 'Notification Center'], answer: 2, explain: 'Physical Objects manages physical items and circulation.' },
          { q: 'Which statement about Security Clearance is true?', options: ['It grants access beyond permissions', 'It restricts access on top of permissions', 'It replaces retention', 'It is a perspective'], answer: 1, explain: 'Clearance and markings only restrict further.' },
          { q: 'Users cannot set reminders on business workspaces. What do you check first?', options: ['Reminder object settings', 'Naming pattern', 'Facet tree', 'Audit interests'], answer: 0, explain: 'Reminder objects decide which item types can carry reminders.' },
          { q: 'The My ToDo widget shows unused tabs. What can you do?', options: ['Nothing', 'Customize its tabs in administration', 'Delete the widget code', 'Create a facet'], answer: 1, explain: 'Administrators can enable, disable and order My ToDo tabs.' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ CP01
  {
    id: 'cp01', track: 'bizadmin', title: 'Working in OpenText Cloud', source: 'Extended ECM (Content Server) Cloud Practitioner — general practice (official guidelines in the OpenText Learning Platform)',
    summary: 'The managed cloud operating model, environments and promotion of configuration, and security and data handling — general practice to prepare for the Cloud Practitioner course.',
    domains: ['cp-model', 'cp-change', 'cp-security'],
    lesson: [
      { callout: 'warn', title: 'The official policy governs', text: 'OpenText provides its guidelines for practitioners in OpenText Cloud only inside the Cloud Practitioner course on the OpenText Learning Platform. This module teaches general, widely accepted practice — not the wording of that policy. Where they differ, the official guidelines win.' },
      'After the Business User and Business Administrator certifications, many practitioners work in **managed cloud** deployments. The provider runs the platform — servers, database, storage, backups, patches — and practitioners work inside the application. The skills from this track still apply; what changes is **where the boundaries are** and **how change travels**.',
      { figure: { type: 'layers', layers: [
        { label: 'Business use', items: ['Content', 'Users’ work'], note: 'customer' },
        { label: 'Application configuration', items: ['Types, templates, perspectives', 'Facets, forms, roles'], note: 'customer / partner' },
        { label: 'Application operations', items: ['Modules, patches, server settings, logs'], note: 'provider, via requests' },
        { label: 'Platform', items: ['Servers, network, database, storage, backups'], note: 'provider' },
      ] }, caption: 'A typical shared-responsibility split.' },
      { h: 'Environments and promotion' },
      'Configuration is built in development, packaged with **Transport**, accepted in test and the **same package** is deployed to production. Business Scenarios follow the same path. Prefer **configuration over customization**: it is supported, transportable and survives upgrades.',
      { figure: { type: 'flow', steps: [
        { label: 'DEV', sub: 'build', kind: 'system' },
        { label: 'Package' },
        { label: 'TEST', sub: 'accept', kind: 'system' },
        { label: 'Approve', kind: 'decision' },
        { label: 'PROD', kind: 'end' },
      ], loop: 'Defect → fix in DEV, new package' } },
      { h: 'Security and data' },
      'Use named accounts with least privilege for as long as needed, approved access paths only, no shared or embedded credentials, synthetic test data, logs and exports through approved channels with the minimum data, and report anything that may have been exposed.',
      { steps: [
        'Ask: is this inside the application and within my agreed scope? If not, raise a service request.',
        'Build and test in DEV/TEST; never edit production directly.',
        'Promote with Transport through the change process; communicate and document.',
        'Use only the access and data the task needs; clean up afterwards.',
      ], title: 'A practitioner’s checklist' },
      { callout: 'exam', title: 'What the short test is about', text: 'Expect to choose the option that respects the boundaries: formal requests for platform work, promotion instead of manual re-creation, least privilege and minimum data. Read the official guidelines carefully in the course — they decide.' },
    ],
    keyPoints: [
      'The provider runs the platform; practitioners configure inside the application.',
      'Platform work (modules, patches, server settings, logs, restores) goes through service requests.',
      'Build in DEV, accept in TEST, deploy the same Transport package to PROD.',
      'Configuration over customization.',
      'Least privilege, approved access paths, protected credentials, minimum data.',
    ],
    missions: [
      {
        id: 'cp01-responsibilities', type: 'practice', title: 'Sort tasks by responsibility',
        steps: [
          'List ten tasks from a recent project (e.g. new workspace type, module install, log analysis, user onboarding, restore).',
          'For each, write who would do it in a managed cloud (practitioner in the application, or provider via request) and how it reaches production.',
        ],
        reflection: 'Give your ten tasks with owner and path, and name the one you think teams most often get wrong.',
        minWords: 50,
      },
      {
        id: 'cp01-quiz', type: 'quiz', title: 'Knowledge check: working in the cloud',
        questions: [
          { q: 'Who usually installs a new module in a managed cloud environment?', options: ['The practitioner via remote desktop', 'The cloud provider, through a service request', 'Any user with System Administration rights', 'The end users'], answer: 1, explain: 'Module and patch installation are platform changes performed by the provider.' },
          { q: 'How should a new perspective reach production?', options: ['Built in DEV, transported, accepted in TEST, same package to PROD', 'Built directly in PROD', 'Re-entered by hand in each environment', 'Emailed to users'], answer: 0, explain: 'Promotion through environments with Transport keeps them consistent.' },
          { q: 'Which approach is preferred in a managed cloud?', options: ['Custom code', 'Direct database changes', 'Configuration', 'Browser plug-ins'], answer: 2, explain: 'Configuration is supported and survives upgrades.' },
          { q: 'You need data to test a smart document type. Which data?', options: ['Production contracts on your laptop', 'Synthetic or approved anonymised samples', 'Documents emailed by users', 'Any data found in search'], answer: 1, explain: 'Test data should not expose real customer information.' },
          { q: 'A colleague asks for your admin password. What do you do?', options: ['Share it by chat', 'Refuse; he uses his own named account with the needed rights', 'Write it in the wiki', 'Share it and change it later'], answer: 1, explain: 'Accounts are personal; sharing breaks accountability.' },
          { q: 'Where are the official practitioner guidelines for OpenText Cloud found?', options: ['In the Cloud Practitioner course on the OpenText Learning Platform', 'In the admin pages', 'In a Business Scenario', 'In OTDS'], answer: 0, explain: 'They are provided in the course and govern.' },
        ],
      },
    ],
  },
];
