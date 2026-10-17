'use strict';
// Business workspaces, end to end: how they work, how to set them up, how to
// create them and work in them, and what to do when creation fails. The
// detailed configuration guides (ba-…) are in guides/bizadmin.js.
// Format: curriculum/CONTENT.md.

module.exports = [
  {
    id: 'ws-how-they-work',
    order: 1,
    title: 'How business workspaces work',
    area: 'workspaces',
    summary: 'What a business workspace is, what it is made of, how it is created and linked to a business object, and how it differs from folders, projects and communities.',
    level: 'basic',
    minutes: 12,
    domains: ['ws-concepts', 'ba-bw-fundamentals'],
    modules: ['ws01', 'a06', 'u18'],
    tags: ['business workspace', 'extended ecm', 'xecm', 'workspace type', 'template', 'business object', 'connected workspaces', 'subtype 848'],
    related: ['ws-setup-roadmap', 'ws-create', 'ws-working-in'],
    sources: ['OpenText Extended ECM / Content Server business workspaces documentation (16.2–24.x)', 'OpenText course 2-0108 Business Workspaces (outline)', 'Collaborating in Content Server 16.2 — Appendix C (Connected Workspaces)'],
    body: [
      'A **business workspace** is a Content Server container that holds everything about one business thing — a customer, a contract, a project, an employee, a plant, a case. Instead of documents about ACME Corp being scattered across folders named by department, they all live in one workspace called “10023 – ACME Corp”, with the customer\'s data in its header, the team that works on it, and its documents already sorted into a standard structure.',
      'Business workspaces are the core of **OpenText Extended ECM** (xECM). With an integration, each workspace is connected to a record in a leading business application — an SAP customer, a Salesforce opportunity, a SuccessFactors employee — and users see the same workspace from both sides. Without an integration (“Connected Workspaces” on plain Content Server) they work the same way; the metadata is simply typed in Content Server.',
      { h: 'What a workspace is made of' },
      {
        figure: {
          type: 'hub',
          center: 'Business workspace',
          items: [
            { label: 'Workspace type', sub: 'what kind of thing; naming, location' },
            { label: 'Template', sub: 'copied to make each workspace' },
            { label: 'Category', sub: 'business metadata in the header' },
            { label: 'Classification', sub: 'decides where templates are offered' },
            { label: 'Roles & team', sub: 'who works on it, with which rights' },
            { label: 'Perspective', sub: 'the page layout users see' },
            { label: 'Business object', sub: 'the linked ERP/CRM record (optional)' },
          ],
        },
        caption: 'Every workspace is built from the same few configuration objects.',
      },
      {
        table: {
          head: ['Part', 'Where it lives', 'What it decides'],
          rows: [
            ['**Workspace type**', 'Business Workspaces volume (Enterprise ▸ Business Workspaces ▸ Workspace Types)', 'The kind of workspace: name pattern, default location, icon, indexing, related types, and — when connected — the business object type it represents'],
            ['**Workspace template**', 'Document Templates volume', 'What each new workspace contains: folders, categories with defaults, roles and permissions, standard documents'],
            ['**Category**', 'Categories volume', 'The business data (customer number, region, status…) that feeds the name, the location path, the header and search'],
            ['**Classification**', 'Classifications volume', 'Templates are offered where their classification matches the folder\'s — the link between “here” and “which templates”'],
            ['**Roles**', 'Defined in the template', 'Team roles such as Account Manager or Reader, with permissions; members are added per workspace'],
            ['**Perspective**', 'Perspectives volume (Perspective Manager)', 'The Smart View layout: header widget, team, related workspaces, documents, activity'],
            ['**Business object type**', 'Administration, per external system', 'Maps the leading application\'s object (and its properties) to the workspace type'],
          ],
        },
      },
      { callout: 'remember', text: ['In Content Server a business workspace is a node of subtype **848** — a container like a folder, but created from a template and carrying a type, a category, roles and (optionally) a business object link.'] },
      { h: 'How a workspace is born' },
      'Whatever starts it — a user in Smart View, the leading application, a workflow, a REST call — creation follows the same sequence. Understanding it is the key to understanding every setting.',
      {
        figure: {
          type: 'flow',
          steps: [
            { label: 'Request', sub: 'user, business app or API asks for a workspace of a type', kind: 'start' },
            { label: 'Pick template', sub: 'templates of that type (offered by classification)' },
            { label: 'Collect data', sub: 'category values; business object properties' },
            { label: 'Work out name', sub: 'from the type\'s name pattern', kind: 'system' },
            { label: 'Work out location', sub: 'type\'s location (+ attribute sub-path) or the current folder', kind: 'system' },
            { label: 'Copy template', sub: 'folders, roles, permissions, categories', kind: 'system' },
            { label: 'Link object', sub: 'when connected', kind: 'system' },
            { label: 'Workspace ready', kind: 'end' },
          ],
        },
        caption: 'Creation, step by step. A missing or wrong configuration object breaks the step that needs it.',
      },
      { h: 'Connected or not: early and late workspaces' },
      {
        figure: {
          type: 'compare',
          items: [
            { title: 'Late workspace', tone: 'info', points: ['The business object exists first (e.g. a customer in SAP)', 'The workspace is created from it — automatically or when someone first opens it', 'Metadata comes from the object\'s properties', 'Typical with a full integration'] },
            { title: 'Early workspace', tone: 'xp', points: ['The workspace is created in Content Server first', 'Linked to the business object once that exists', 'Useful when documents arrive before the record (a bid before the contract)', 'Needs the parent location chosen at creation'] },
            { title: 'Unconnected workspace', tone: 'accent', points: ['No leading application at all', 'Metadata typed into the category', 'Still gets type, template, roles, perspective', 'A great way to learn — and how the lab in CS Academy works'] },
          ],
        },
      },
      { h: 'How it compares with other containers' },
      {
        figure: {
          type: 'matrix',
          cols: ['Built from a template', 'Business metadata in header', 'Team roles', 'Linked to ERP/CRM', 'Own Smart View layout'],
          rows: [
            { label: 'Folder', cells: [false, false, false, false, false] },
            { label: 'Project', cells: ['Project template', false, 'Coordinator / Member / Guest', false, false] },
            { label: 'Community', cells: [false, false, 'Members', false, 'Community page'] },
            { label: 'Business workspace', cells: [true, true, 'Any roles you define', 'Optional', true] },
          ],
        },
        caption: 'Choose a business workspace when the content belongs to a business object with its own identity, data and team.',
      },
      { h: 'Who does what' },
      {
        figure: {
          type: 'lanes',
          lanes: [
            { label: 'Analyst', cells: ['Map business objects to types', '', '', ''] },
            { label: 'Business admin', cells: ['', 'Category, classification, location, type, template, perspective', '', 'Adjust, transport'] },
            { label: 'Business user', cells: ['', '', 'Create workspaces, add documents, manage the team', ''] },
            { label: 'Integration', cells: ['', '', 'Creates and updates workspaces from the business app', ''] },
          ],
        },
      },
      { callout: 'exam', text: ['Expect questions that test whether you know **which object controls which behaviour**: the name and location come from the workspace type, the content and roles from the template, the offer of templates from the classification, the layout from the perspective. A template change never updates workspaces that already exist.'] },
      'Next: [[ws-setup-roadmap|set one up, in order]], or see [[ws-create|every way to create a workspace]].',
    ],
  },

  {
    id: 'ws-setup-roadmap',
    order: 2,
    title: 'Setting up business workspaces, step by step',
    area: 'workspaces',
    summary: 'The complete configuration order for a new kind of business workspace — from category to perspective — with what to do at each step, where, and how to check it worked.',
    level: 'intermediate',
    minutes: 15,
    domains: ['ws-infra', 'ws-types', 'ws-roles', 'ba-bw-infra', 'ba-ws-types'],
    modules: ['ws02', 'ws03'],
    tags: ['setup', 'configuration', 'order', 'checklist', 'workspace type', 'template', 'classification', 'category', 'location', 'perspective'],
    related: ['ws-how-they-work', 'ws-create', 'ws-troubleshooting', 'ba-bw-dependencies', 'ba-workspace-types', 'ba-workspace-templates'],
    sources: ['OpenText Extended ECM business workspace configuration documentation', 'OpenText course 2-0108 Business Workspaces (outline)', 'CS Academy guide ba-bw-dependencies'],
    body: [
      'Business workspaces are configured from the bottom up: every object refers to objects created before it. Follow this order and creation works the first time; skip a step and you get the classic symptoms — no template offered, a blank name, workspaces in the wrong folder. The example throughout is a **Customer** workspace.',
      {
        figure: {
          type: 'flow',
          vertical: true,
          steps: [
            { label: '1. Category', sub: 'Customer: number, name, region, status' },
            { label: '2. Classifications', sub: 'Workspace Templates ▸ Customer (and one for the location)' },
            { label: '3. Location folder', sub: 'Enterprise ▸ Customers, classified' },
            { label: '4. Workspace type', sub: 'Customer: name pattern, location, icon' },
            { label: '5. Template', sub: 'Customer – Standard: type, classification, category' },
            { label: '6. Template content & roles', sub: 'folders, email folder, team roles' },
            { label: '7. Perspective', sub: 'header, team, documents, related' },
            { label: '8. Test workspace', sub: 'create one, check everything', kind: 'end' },
          ],
        },
        caption: 'The setup order. Steps 1–3 are building blocks; 4–7 configure the workspace; 8 proves it.',
      },
      { h: 'Before you start' },
      {
        ul: [
          'Work on a **development or training system**, never directly in production — finished configuration moves on with [[ba-transport-deploy|Transport]].',
          'You need business administration access: permissions on the Business Workspaces, Categories, Classifications, Facets and Document Templates volumes, the object privileges for the item types you create (workspace type, template, category…), and the usage privilege for Perspective Manager.',
          'Agree the design first: the business object, its metadata, the folder structure and the team roles (see [[an-workspace-design]]).',
        ],
      },
      { h: '1. Create the category' },
      'The category holds the business data of each workspace. The workspace type will build names and locations from its attributes, so create it first and make the key attributes **mandatory**.',
      {
        steps: [
          'Open the Categories volume (Enterprise ▸ Categories).',
          'Add Item ▸ Category; name it “Customer”.',
          'Add the attributes: Customer Number (text, mandatory), Customer Name (text, mandatory), Region (text with a pop-up list: EMEA, Americas, APAC), Status (text with a list).',
          'Submit. Note: the category is a version-controlled definition — later attribute changes create a new category version that existing items must be upgraded to.',
        ],
        title: 'Create the business category',
        ui: 'Classic UI',
      },
      { callout: 'tip', text: ['Keep the category small and controlled: attributes that drive the **name** or **location path** must be mandatory and preferably come from a list, or you will get duplicate names and odd folders. More in [[ba-categories-metadata]].'] },
      { h: '2. Create the classifications' },
      'Classifications connect *where* to *what*: a template is offered in a folder when the template and the folder carry matching classifications. Create a small tree just for workspace templates.',
      {
        figure: {
          type: 'tree',
          root: {
            label: 'Classifications', icon: 'volume', children: [
              { label: 'Workspace Templates', icon: 'classification', note: 'one tree for all workspace types', children: [
                { label: 'Customer', icon: 'classification', note: 'given to the Customer templates and the Customers folder' },
                { label: 'Project', icon: 'classification' },
              ] },
            ],
          },
        },
        caption: 'One classification per workspace type is the usual pattern.',
      },
      { path: ['Enterprise', 'Classifications', 'Add Item', 'Classification Tree / Classification'], ui: 'Classic UI' },
      { h: '3. Prepare the location' },
      'Workspaces created without a user choosing a folder — from the business application, a REST call or a workflow — go to the location defined on the workspace type. Create that root folder now, set its permissions (generated sub-folders inherit them), and give it the template classification so users creating workspaces *in* it are offered the right templates.',
      {
        figure: {
          type: 'tree',
          root: {
            label: 'Enterprise Workspace', icon: 'volume', children: [
              { label: 'Customers', icon: 'folder', note: 'location of the Customer type · classified “Customer”', children: [
                { label: 'EMEA', icon: 'folder', note: 'optional sub-path from Region', children: [
                  { label: '10023 – ACME Corp', icon: 'workspace' },
                ] },
                { label: 'Americas', icon: 'folder', children: [{ label: '20877 – Cobalt Inc', icon: 'workspace' }] },
              ] },
            ],
          },
        },
      },
      { h: '4. Create the workspace type' },
      {
        steps: [
          'Open Enterprise ▸ Business Workspaces ▸ Workspace Types (the Business Workspaces volume; some older releases kept this in the Administration pages).',
          'Add Item ▸ Workspace Type. Name it “Customer”; choose an icon.',
          'Set the **name pattern** from the category attributes, e.g. Customer Number – Customer Name.',
          'Set the **location**: the Customers folder, optionally with an attribute-based sub-path (Region).',
          'Decide the **indexing** option for child items if users must find documents by workspace data.',
          'Save. If a leading application is connected, the business object type is mapped to this workspace type separately.',
        ],
        title: 'Create the workspace type',
      },
      'Details of every setting: [[ba-workspace-types]].',
      { h: '5–6. Create the template, its content and roles' },
      {
        steps: [
          'Go to Enterprise ▸ Document Templates; optionally add a folder “Customer” to keep templates tidy.',
          'Add Item ▸ the workspace template item; select the workspace type **Customer** and the classification **Workspace Templates ▸ Customer**.',
          'Name it “Customer – Standard”; add the Customer category, with default values where useful.',
          'Open the template and build the content: folders such as 01 Contracts, 02 Correspondence, 03 Orders; an email folder; standard documents if any.',
          'Define the roles (e.g. Account Manager, Sales Team, Readers) and their permissions; add default participants or groups to replace.',
        ],
        title: 'Create the workspace template',
      },
      'Folders, email folders and replacement tags: [[ba-template-content]]. Roles and group replacement: [[ba-roles-permissions]].',
      {
        figure: {
          type: 'matrix',
          cols: ['See contents', 'Add & modify', 'Delete', 'Edit permissions', 'Manage team'],
          rows: [
            { label: 'Account Manager', cells: [true, true, true, true, true] },
            { label: 'Sales Team', cells: [true, true, false, false, false] },
            { label: 'Readers', cells: [true, false, false, false, false] },
          ],
        },
        caption: 'A typical role design for a Customer template. Rights come from the permissions each role gets on the template\'s items.',
      },
      { h: '7. Give it a perspective' },
      'Without a perspective a workspace opens like a plain folder. In Perspective Manager, create a perspective for the workspace type with a header widget (name, icon, key attributes), a team widget, related workspaces, and a documents/browse widget. Rules target it at workspaces of type Customer. More: [[ba-perspective-manager]].',
      { h: '8. Prove it' },
      {
        table: {
          head: ['Check', 'Expected', 'If not'],
          rows: [
            ['Create a workspace in Customers', 'Template “Customer – Standard” is offered', 'Classification of the folder or template missing/different'],
            ['Its name', '“10023 – ACME Corp”', 'Name pattern or mandatory attributes'],
            ['Its location', 'Customers ▸ EMEA', 'Type location / sub-path attribute empty'],
            ['Its content', 'The template\'s folders', 'Wrong template picked; template empty'],
            ['Its team', 'Your roles, you as Account Manager', 'Roles not defined in the template'],
            ['Opening it', 'The Customer perspective', 'Perspective rule doesn\'t match the type'],
          ],
        },
      },
      { callout: 'exam', text: ['Know the order and the reason for it: **category → classification → location → type → template → roles → perspective**. Each object refers to the ones before it, which is also how you trace a creation problem backwards.'] },
      { callout: 'tip', title: 'Do it for real', text: ['The **Business workspaces lab** practice path walks you through this whole setup in your own Content Server and checks the pieces it can see.'] },
    ],
  },

  {
    id: 'ws-create',
    order: 3,
    title: 'Creating business workspaces — every way',
    area: 'workspaces',
    summary: 'How workspaces get created: by users in Smart View, by the leading business application, automatically, and through the REST API — and what each way needs.',
    level: 'intermediate',
    minutes: 12,
    domains: ['ws-using', 'bu-content'],
    modules: ['ws04', 'u18'],
    tags: ['create workspace', 'smart view', 'rest api', 'early workspace', 'late workspace', 'businessworkspaces', 'template'],
    related: ['ws-how-they-work', 'ws-working-in', 'ws-troubleshooting', 'ws-setup-roadmap'],
    sources: ['OpenText Extended ECM user and administration documentation', 'OpenText developer community: creating business workspaces with the REST API'],
    body: [
      'Once a workspace type and template exist, workspaces can be created in several ways. They all end in the same place — a copy of the template, named and located by the workspace type — but they differ in who starts them, where the metadata comes from and what must be configured.',
      {
        figure: {
          type: 'compare',
          items: [
            { title: 'In Smart View', tone: 'accent', points: ['A user creates it in a folder or from a workspaces widget', 'Picks a template, types the metadata', 'Needs: template classified for that place; Add Items there'] },
            { title: 'From the business app', tone: 'info', points: ['SAP, Salesforce, SuccessFactors… create or open it from the record', 'Metadata comes from the object', 'Needs: business object type, external system, integration'] },
            { title: 'Automatically', tone: 'xp', points: ['On a business event, in bulk, or by a Business Scenario', 'Goes to the type\'s location', 'Needs: location and name pattern that work unattended'] },
            { title: 'Through the REST API', tone: 'warn', points: ['Your own code or integration', 'Sends template, name/parent and category values', 'Needs: the create form to know required fields'] },
          ],
        },
      },
      { h: 'Create a workspace in Smart View' },
      {
        steps: [
          'Open the folder where workspaces of this kind live (e.g. Customers) — or a page with a workspaces widget for that type.',
          'Click **+** (Add) and choose the **template**, e.g. “Customer – Standard” — the Add menu lists templates by name. Or use the **Create Business Workspace** icon at the top right, next to Favorites.',
          'Only templates whose classification matches this folder are offered, and only for workspace types whose creation is enabled.',
          'Fill in the metadata: required attributes are marked; values in lists come from the category.',
          'Create. The workspace opens in its perspective with the template\'s folders, roles and you in the team.',
        ],
        title: 'Create a business workspace',
        ui: 'Smart View',
      },
      {
        figure: {
          type: 'menu',
          title: '+ Add',
          items: ['Folder', 'Document', 'Customer – Standard', 'Customer – Key account', 'Shortcut', 'URL'],
          highlight: 'Customer – Standard',
          note: 'Workspace templates appear by name in the Add menu of folders whose classification matches theirs. That is what the classification on the location folder is for.',
        },
      },
      { callout: 'warn', text: ['Not offered? The folder and the template don\'t share a classification, the workspace type\'s creation is disabled, you lack Add Items in the folder, or you lack the privilege to create business workspaces. See [[ws-troubleshooting]].'] },
      { h: 'From the leading application' },
      'With Extended ECM for SAP, Salesforce, SuccessFactors and similar, the workspace is usually created **from the business object**: automatically when the object is created or changed, or the first time a user opens the workspace from the record. Its metadata is filled from the object\'s properties through the business object type mapping, and the workspace stays linked to the record — the business user sees the same documents in the business application\'s UI and in Content Server.',
      {
        figure: {
          type: 'flow',
          steps: [
            { label: 'Customer created in SAP', kind: 'actor' },
            { label: 'Integration calls Content Server', kind: 'system' },
            { label: 'Business object type → workspace type', sub: 'property mapping fills the category' },
            { label: 'Workspace created at the type\'s location' },
            { label: 'Linked both ways', kind: 'end' },
          ],
        },
        caption: 'A late workspace created from a business object.',
      },
      { h: 'Through the REST API' },
      'Integrations and scripts create workspaces with the v2 REST API. The request names the template and either the parent folder (an early workspace) or the business object (a late one), and carries the category values. Because the required fields depend on the template, clients first ask for the **create form**.',
      {
        code: 'POST /otcs/cs.exe/api/v1/auth\n  username=…&password=…            → { "ticket": "…" }\n\nGET  /otcs/cs.exe/api/v2/businessworkspacetypes\n  OTCSTicket: …                     → the types and their templates\n\nGET  /otcs/cs.exe/api/v2/forms/businessworkspaces/create?template_id=23234\n  OTCSTicket: …                     → the fields this template needs\n\nPOST /otcs/cs.exe/api/v2/businessworkspaces\n  OTCSTicket: …\n  body={ "template_id": 23234, "name": "10023 – ACME Corp", "parent_id": 23235,\n         "roles": { "categories": { "…": "…" } } }',
        lang: 'http',
        title: 'Creating an early workspace (sketch)',
      },
      { callout: 'note', text: ['The create request\'s body has changed between releases (for example, where category values go). The reliable way to get it right for your version is to create one workspace in Smart View with the browser\'s developer tools open and copy what Smart View sends. CS Academy itself only *reads* `/api/v2/businessworkspacetypes`.'] },
      { h: 'What decides the name and the place' },
      {
        figure: {
          type: 'matrix',
          cols: ['Name', 'Location', 'Template', 'Metadata'],
          rows: [
            { label: 'Smart View (in a folder)', cells: ['Type\'s name pattern', 'The folder you are in', 'You choose', 'You type it'] },
            { label: 'Business application', cells: ['Name pattern', 'Type\'s location', 'Integration / default', 'Business object properties'] },
            { label: 'REST API', cells: ['Name pattern (or name sent)', 'parent_id or type\'s location', 'template_id', 'Sent in the request'] },
          ],
        },
        caption: 'Same configuration, different sources of data.',
      },
      { callout: 'exam', text: ['If workspaces created from the business application land in the wrong place, look at the **workspace type\'s location**; if users get no template in a folder, look at **classifications**; if names are blank, look at the **name pattern\'s attributes**.'] },
    ],
  },

  {
    id: 'ws-working-in',
    order: 4,
    title: 'Working in a business workspace',
    area: 'workspaces',
    summary: 'A tour of a workspace for the people who use it every day: the header, team and roles, documents and required documents, related workspaces, email and notifications.',
    level: 'basic',
    minutes: 9,
    domains: ['ws-using', 'ws-roles', 'bu-collab'],
    modules: ['ws04', 'u18'],
    tags: ['team', 'roles', 'participants', 'header widget', 'related workspaces', 'required documents', 'perspective'],
    related: ['ws-create', 'ws-how-they-work'],
    sources: ['OpenText Extended ECM Smart View user documentation', 'Collaborating in Content Server 16.2 — Appendix C'],
    body: [
      'A business workspace opens in Smart View on its own perspective: a page built for that kind of workspace. The layout varies by type, but the same building blocks appear almost everywhere.',
      {
        figure: {
          type: 'layers',
          layers: [
            { label: 'Header', items: ['Icon & name', 'Key attributes', 'Description', 'Favorite'], note: 'Data from the workspace\'s category — or the business object' },
            { label: 'Main area', items: ['Documents / browse', 'Required documents', 'Related workspaces'], note: 'Usually tabs: Overview, Documents, Related…' },
            { label: 'Side widgets', items: ['Team', 'Activity feed', 'Reminders', 'Workflows'], note: 'What is happening and who is involved' },
          ],
        },
        caption: 'The typical anatomy of a workspace perspective.',
      },
      { h: 'Team and roles' },
      'The **team** lists the participants of the workspace grouped by role. Roles come from the template and carry permissions; adding someone to a role gives them exactly those rights on the workspace and the items inside it.',
      {
        steps: [
          'Open the workspace and its Team (team widget, or Functions ▸ Team).',
          'Add a participant: choose a user or group and the role, e.g. Sales Team.',
          'Change a role or remove a participant the same way. Only roles allowed to manage the team can do this.',
        ],
        title: 'Manage the team',
        ui: 'Smart View',
      },
      { callout: 'tip', text: ['Give access through **roles**, not by editing the permissions of folders inside the workspace. When someone leaves the project you remove one participant — not their name from twenty ACLs.'] },
      { h: 'Documents and required documents' },
      'Add documents to the template\'s folders as usual — drag and drop, + Add, email. Where **smart document types** are configured, a document is classified by type when added, and the workspace can show which required documents are present, missing or expired — for example a signed contract and a credit check for every customer.',
      {
        figure: {
          type: 'matrix',
          cols: ['Status'],
          rows: [
            { label: 'Signed contract', cells: [true] },
            { label: 'Credit check', cells: ['expires in 14 days'] },
            { label: 'Tax certificate', cells: [false] },
          ],
        },
        caption: 'A required-documents view: present, expiring, missing.',
      },
      { h: 'Related workspaces' },
      'Workspaces can be related: a Customer has Contracts and Projects; a Project belongs to a Customer. The related workspaces widget lists them and, where allowed, creates a new related workspace already linked. Relationship types are configured on the workspace types ([[ba-related-workspaces]]).',
      {
        figure: {
          type: 'tree',
          root: { label: '10023 – ACME Corp', icon: 'workspace', note: 'Customer', children: [
            { label: 'C-2026-114 Service contract', icon: 'workspace', note: 'Contract' },
            { label: 'P-881 Rollout EMEA', icon: 'workspace', note: 'Project' },
          ] },
        },
      },
      { h: 'Staying informed' },
      { ul: ['**Follow** or favorite the workspace to find it fast.', 'Business workspace and workflow **notifications** tell you about new documents and tasks (see [[ws-how-they-work]] and the Notifications module).', 'Start a **workflow** on a document in the workspace; the workspace\'s data can feed the workflow.', 'Set **reminders** on the workspace or its documents for follow-ups.'] },
      { callout: 'exam', text: ['A business user “working as a lead or participant” must know: adding participants to roles, adding documents, finding related workspaces, and that rights in a workspace come from roles.'] },
    ],
  },

  {
    id: 'ws-troubleshooting',
    order: 5,
    title: 'Troubleshooting business workspaces',
    area: 'workspaces',
    summary: 'A runbook for the problems everyone meets: no template offered, blank or duplicate names, workspaces in the wrong folder, missing folders or roles, the wrong layout, and access surprises.',
    level: 'intermediate',
    minutes: 8,
    domains: ['ws-using', 'ws-types', 'ba-bw-fundamentals'],
    modules: ['ws05'],
    tags: ['troubleshooting', 'template not offered', 'name pattern', 'location', 'classification', 'perspective rules', 'permissions'],
    related: ['ws-setup-roadmap', 'ws-create', 'ba-bw-dependencies'],
    sources: ['OpenText Extended ECM administration documentation', 'CS Academy guide ba-bw-dependencies'],
    body: [
      'Almost every workspace problem traces back to one configuration object. Find the symptom, check the object, and walk back up the [[ws-setup-roadmap|setup order]] if needed.',
      {
        table: {
          head: ['Symptom', 'Most likely cause', 'Check'],
          rows: [
            ['The template isn\'t in the + Add menu of a folder', 'No template whose classification matches the folder', 'Classifications of the folder and of the template'],
            ['No template offered anywhere for one type', 'Creation is disabled on the workspace type', 'Workspace Types list: Creation Status; Functions ▸ Enable Creation'],
            ['Type offered, but no template to choose', 'Template not linked to the type, or not classified', 'Template properties: type and classification'],
            ['“You cannot create…” / no Add menu at all', 'Missing Add Items permission or create privilege', 'Folder permissions; object privileges for business workspaces'],
            ['Name is blank or “ – ”', 'Name pattern uses attributes that were left empty', 'Name pattern; make those attributes mandatory'],
            ['Duplicate names', 'Pattern without a unique key', 'Add the business key (customer number) to the pattern'],
            ['Workspaces from SAP land in the wrong folder', 'Type location or sub-path attribute', 'Workspace type location; attribute values'],
            ['New workspace has no folders', 'Wrong or empty template picked', 'Which template was used; template content'],
            ['Changed the template, old workspaces unchanged', 'Expected: templates are copied only at creation', 'Plan a bulk change for existing workspaces'],
            ['Opens as a plain folder', 'No perspective rule matches the type', 'Perspective Manager rules and their order'],
            ['A participant can\'t open documents', 'Role permissions or the participant\'s role', 'Team; the role\'s permissions on sub-items'],
          ],
        },
      },
      {
        figure: {
          type: 'flow',
          steps: [
            { label: 'Symptom', kind: 'start' },
            { label: 'Which step of creation?', sub: 'template · name · location · content · layout · access', kind: 'decision' },
            { label: 'Object behind it', sub: 'classification · type · template · perspective · roles' },
            { label: 'Fix on a test system' },
            { label: 'Create a new test workspace', kind: 'end' },
          ],
          loop: 'Still wrong → go one step up the setup order',
        },
      },
      { callout: 'tip', text: ['Keep one **test workspace per type** on your development system and recreate it after every configuration change — it is the fastest regression test there is.'] },
      { callout: 'warn', text: ['Never “fix” a template problem by editing workspaces one by one in production. Fix the template (for future workspaces), then decide deliberately how to bring existing ones in line.'] },
    ],
  },
];
