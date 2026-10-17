'use strict';
// Business Workspaces track, part A: modules for course 2-0108 chapters 1
// (introduction), 2 (using workspaces), 3 (installation, permissions and
// privileges) and 16 (accessing, using and editing workspaces). Practice
// missions mirror the course exercises but are done on the learner's own
// server with their own names. All text is original to this trainer.

const SRC = 'Content Server Business Workspaces (2-0108, 22.1)';

module.exports = [
  // ------------------------------------------------------------------ BW01
  {
    id: 'bw01', track: 'workspaces', order: 1, title: 'Introduction to business workspaces', source: `${SRC} — Ch. 1`, feature: 'businessWorkspaces',
    domains: ['ws-concepts', 'ba-bw-fundamentals'],
    summary: 'What a business workspace is, why OpenText built it, what it is made of, where it is used, and the words you need to talk about it.',
    lesson: [
      'A **business workspace** is one container per business object — a customer, a purchase order, a product, an employee, a site — that brings together everything needed to work on it. It is created from rules and a template, so every workspace of the same kind has the same structure, the same kind of metadata and the same team roles, and it is shown in Smart View on a page designed for the people who use it.',
      'OpenText sums the idea up as **content in context**: four ingredients fused around one business function.',
      {
        figure: {
          type: 'hub',
          center: 'Business workspace',
          items: [
            { label: 'Business data', sub: 'category attributes' },
            { label: 'Content', sub: 'documents, emails, forms' },
            { label: 'People', sub: 'roles and participants' },
            { label: 'Tasks', sub: 'task lists, reminders, workflows' },
          ],
        },
        caption: 'Data gives content its context; people and tasks make it actionable.',
      },
      'Why not just folders? Because people adopt systems that save them work. In a workspace the administrator’s rules do the filing, naming and permissions; the user only chooses a template, types a few values and adds colleagues to roles. The same rules drive a role-based Smart View page, and collaboration — discussions, comments, activity — is built in instead of living in another tool. Governance becomes a by-product: every workspace of a type is consistent, and Records Management can be applied to its documents.',
      {
        figure: {
          type: 'lanes',
          lanes: [
            { label: 'User', cells: ['Picks a template', 'Types the key data', 'Adds people to roles', 'Works in the workspace'] },
            { label: 'Rules', cells: ['Offer templates by classification', 'Name it by the pattern', 'Copy folders, roles, permissions', 'Show the perspective'] },
          ],
        },
        caption: 'What the user does versus what the configuration does.',
      },
      { h: 'Where you will meet workspaces' },
      { ul: ['**Facilities:** a workspace per building with leases, incidents and security information.', '**R&D:** a workspace per product or patent with plans, trials and launch material.', '**Manufacturing:** a workspace per asset with procedures and maintenance records.', '**HR:** a workspace per employee with onboarding and personnel records under strict roles.', '**Sales and procurement:** a workspace per customer, proposal or purchase order, related to each other for a 360° view.'] },
      {
        steps: [
          'Create the purchase-order workspace from the best-fitting template.',
          'Enter the order data and add the buyer, approver and receiving clerk to their roles.',
          'Each member finds it on their landing page and works there: uploads, versions, tasks, discussion.',
          'Related workspaces lead to the supplier and the contract; RM governs the documents.',
        ],
        title: 'A procurement case, in short',
      },
      { callout: 'note', title: 'Names over time', text: 'Before Content Server 21.4, workspaces with content only in Content Server were called **Connected Workspaces**, and “Business Workspaces” meant those linked to a leading application through Extended ECM. Since 21.4 all are **Business Workspaces**. The 2-0108 course (22.1) covers workspaces inside Content Server only.' },
      { callout: 'remember', text: 'Type = name and place. Template = contents and team. Classification = where it may be created. Perspective = how it looks in Smart View. Sidebar widgets = how it looks in Classic View.' },
      'Read on: [[bw-intro-concepts]] and [[bw-terminology]].',
    ],
    keyPoints: [
      'A business workspace gathers business data, content, people and tasks around one business object.',
      'Rules and templates do the filing, naming and permissions so users do not have to.',
      'Smart View is the primary interface; Classic View works too.',
      '“Connected Workspaces” is the pre-21.4 name for workspaces without a leading application.',
      'Workspaces can be related to each other to form a navigable backbone of business information.',
    ],
    missions: [
      {
        id: 'bw01-types', type: 'investigate', title: 'How many kinds of workspace does your server know?', xp: 20,
        brief: 'Every kind of business workspace is a workspace type. Find out how many your server has before you study them.',
        steps: [
          'Open Enterprise ▸ Business Workspaces ▸ Workspace Types (or ask your administrator to show you the list).',
          'Count the workspace types, including any disabled for creation.',
          'Type the number below.',
        ],
        hints: ['If you cannot open the volume, you are probably not a business administrator — the + menu of a workspace root folder only shows the types offered in that folder.'],
        inputs: [{ key: 'types', label: 'Number of workspace types', placeholder: 'e.g. 3' }],
        checks: [{ kind: 'answer', input: 'types', source: 'bwTypes.count', compare: 'number', label: 'Number of business workspace types on your server' }],
      },
      {
        id: 'bw01-usecases', type: 'practice', title: 'Map your own organisation to workspace types', xp: 15,
        brief: 'Turn the use cases from the lesson into a first design for your own organisation.',
        steps: [
          'List three business objects your organisation works with every day (for example customers, suppliers, projects, sites).',
          'For each, write down the business data that identifies it, the documents that belong to it, the roles of the people who work on it, and the tasks that repeat.',
          'Decide which of the three is the best candidate for a first workspace type, and which could be related to it.',
        ],
        reflection: 'Describe your best candidate in terms of the four ingredients (business data, content, people, tasks), and say which other workspace type it should be related to and why.',
        minWords: 40,
      },
      {
        id: 'bw01-vocab', type: 'practice', title: 'Name the parts of a real workspace', xp: 15,
        brief: 'Use the course vocabulary on a workspace you can open.',
        steps: [
          'Open any business workspace on your server in Smart View.',
          'Identify the header, the tabs, two tiles and the widget each shows.',
          'Switch to Classic View on the same workspace and identify the sidebar widgets on the right.',
        ],
        reflection: 'Using the terms header, tab, tile, widget and sidebar widget, describe what you saw in both views, and say which configuration object (perspective or workspace type) produced each.',
        minWords: 30,
      },
      {
        id: 'bw01-quiz', type: 'quiz', title: 'Knowledge check: introduction', xp: 25,
        questions: [
          { q: 'Which four ingredients does OpenText say a business workspace combines?', options: ['Business data, content, people and tasks', 'Folders, shortcuts, URLs and documents', 'Categories, columns, facets and forms', 'Users, groups, roles and passwords'], answer: 0, explain: 'A workspace fuses business data (context), content, people (team roles) and tasks (task lists, reminders, workflows) around one business object.' },
          { q: 'A team needs one place for everything about each supplier, with the same structure and roles every time. What fits best?', options: ['A shared folder per department', 'A business workspace type for suppliers', 'A collection per supplier', 'A personal workspace for the buyer'], answer: 1, explain: 'A repeatable business object with its own data and team is exactly what a workspace type is for.' },
          { q: 'Before Content Server 21.4, what were workspaces with content only in Content Server called?', options: ['Project workspaces', 'Connected Workspaces', 'Template folders', 'Communities'], answer: 1, explain: 'They were Connected Workspaces; since 21.4 both kinds are simply Business Workspaces.' },
          { q: 'In the four-ingredient model, where does a reminder about a contract renewal belong?', options: ['Business data', 'Content', 'People', 'Tasks'], answer: 3, explain: 'Reminders, task lists, workflows and milestones are what make a workspace actionable — the tasks ingredient.' },
          { q: 'Which statement about user interfaces is true?', options: ['Workspaces only work in Smart View', 'Workspaces are designed mainly for Smart View but can also be used in Classic View', 'Workspaces only work in Classic View', 'Workspaces need Enterprise Connect'], answer: 1, explain: 'Smart View is the primary interface, but every workspace also opens in Classic View.' },
          { q: 'In the procurement example, how does a user get from a purchase-order workspace to its supplier?', options: ['By searching the audit log', 'Through related workspaces', 'By opening the template', 'Through the Recycle Bin'], answer: 1, explain: 'Related workspaces link business objects to each other, giving a 360° view of the process.' },
          { q: 'Which term describes the role-based Home page that can show a tile for each workspace a user needs daily?', options: ['Landing page', 'Sidebar widget', 'Activity manager', 'Classification tree'], answer: 0, explain: 'The landing page is Smart View’s role-based Home page.' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ BW02
  {
    id: 'bw02', track: 'workspaces', order: 2, title: 'Using business workspaces', source: `${SRC} — Ch. 2`, feature: 'businessWorkspaces',
    domains: ['ws-using', 'bu-collab'],
    summary: 'Find your way around a workspace in Smart View — header, Team, Metadata, Recently Accessed, Discussion, Documents — and in Classic View, including the Business Workspaces menu and the navigation tree.',
    lesson: [
      'A workspace opens in Smart View on its **perspective**: a header, tabs (by default **Overview** and **Documents**) and tiles. Each tile answers one question, so learn them as questions.',
      {
        figure: {
          type: 'matrix',
          cols: ['Answers', 'Can change (with rights)'],
          rows: [
            { label: 'Header', cells: ['Which workspace? key data', 'Favorite, Insights'] },
            { label: 'Team', cells: ['Who works here, in which role?', 'Participants'] },
            { label: 'Metadata', cells: ['What is its business data?', 'Values (Edit Attributes)'] },
            { label: 'Recently Accessed', cells: ['What did I use last?', 'The documents'] },
            { label: 'Discussion', cells: ['What is being discussed?', 'Posts, replies, follows'] },
            { label: 'Documents tab', cells: ['Where are the files?', 'Items, within permissions'] },
          ],
        },
        caption: 'Tiles as questions.',
      },
      {
        steps: [
          'Mark the workspace as a favorite with the star in the header.',
          'Expand the Team tile ▸ Roles tab ▸ open a role to see who leads the team.',
          'In the Metadata tile, click a field, change it, press Enter (needs Edit Attributes).',
          'On the Documents tab, + ▸ Document to upload; hover the file ▸ Rename to give it a business name.',
          'In the Discussion tile, reply to a post or ask a question; use the header back arrow to return.',
        ],
        title: 'The Smart View basics',
        ui: 'Smart View',
      },
      'In **Classic View** the same workspace looks like a folder with a right-hand panel of **sidebar widgets**: Attributes (read-only — edit through Properties ▸ Categories), Recent Changes, Work Items and WS Reference. The panel stays visible in every sub-folder. The Global Menu Bar has a **Business Workspaces** menu with **Search, Recent and Favorites**.',
      {
        figure: {
          type: 'flow',
          steps: [
            { label: 'Admin: Enable Simple User Profile', sub: 'Configure Smart View', kind: 'actor' },
            { label: 'User: Profile ▸ Settings', sub: 'Business Workspace section' },
            { label: 'Navigation tree on' },
            { label: 'Tree icon on Documents tab', kind: 'end' },
          ],
        },
        caption: 'The navigation tree depends on the Simple User Profile, which also hides the Following, Followers and Activity profile tabs.',
      },
      { callout: 'tip', text: 'Switching between Smart View (My Account ▸ Smart View) and Classic View (Profile menu ▸ Classic View) keeps you in the same place — use whichever view has the function you need.' },
      { callout: 'exam', text: 'Metadata editing in Smart View is inline but needs **Edit Attributes**; in Classic View the attributes panel is display-only. The team lead is found on the **Roles** tab.' },
      'Read on: [[bw-navigate-smart-view]] and [[bw-navigate-classic]].',
    ],
    keyPoints: [
      'Header, Team, Metadata, Recently Accessed, Discussion and the Documents tab each answer one question.',
      'Inline metadata editing needs the Edit Attributes permission.',
      'The team lead is shown in the role details on the Roles tab.',
      'Classic View shows Attributes, Recent Changes, Work Items and WS Reference on the right.',
      'The Business Workspaces menu offers Search, Recent and Favorites.',
      'The navigation tree needs the Simple User Profile to be enabled by an administrator.',
    ],
    missions: [
      {
        id: 'bw02-tour', type: 'practice', title: 'Tour a workspace in Smart View', xp: 15,
        brief: 'Do on your own server what the course does on its training workspace.',
        steps: [
          'Open a business workspace you are a participant of (or the one you build in the lab) in Smart View.',
          'Add it to your favorites from the header.',
          'Expand the Team tile, open the Roles tab and find the team lead; open one participant’s profile.',
          'If you may, change one value in the Metadata tile; otherwise note why the field is read-only.',
          'Upload a small file to a folder on the Documents tab and rename it to a business-style name.',
        ],
        reflection: 'Who leads the team of the workspace you used and how did you find out? Which metadata field did you try to change, and what decided whether you could?',
        minWords: 30,
      },
      {
        id: 'bw02-classic', type: 'practice', title: 'Find it again in Classic View', xp: 15,
        brief: 'Use the Classic View tools to return to a workspace without browsing.',
        steps: [
          'Switch to Classic View from the Profile menu.',
          'Open Business Workspaces on the Global Menu Bar and reach the workspace from Recent or Favorites.',
          'Open the document you uploaded, then return to the workspace with the breadcrumb.',
          'Read the right-hand panel: Attributes, Recent Changes, Work Items, WS Reference.',
        ],
        reflection: 'Compare the Classic View panel with the Smart View tiles: which information appears in both, which only in one, and where would you go to edit the workspace attributes in each view?',
        minWords: 30,
      },
      {
        id: 'bw02-quiz', type: 'quiz', title: 'Knowledge check: using workspaces', xp: 25,
        questions: [
          { q: 'Where do you find out who the team lead of a workspace is in Smart View?', options: ['Metadata tile', 'Team tile ▸ Roles tab ▸ role details', 'Documents tab ▸ Properties', 'Recently Accessed tile'], answer: 1, explain: 'The team lead is a property of a role, shown in the role details on the Roles tab of the expanded Team tile.' },
          { q: 'A user clicks a field in the Metadata tile but cannot change it. What is the most likely reason?', options: ['The workspace has no perspective', 'The user lacks the Edit Attributes permission', 'The browser blocks pop-ups', 'Simple User Profile is disabled'], answer: 1, explain: 'Inline editing in the Metadata tile requires Edit Attributes; readers see the values read-only.' },
          { q: 'In Classic View, how do you change the attributes shown in the workspace’s right-hand panel?', options: ['Click the value in the panel', 'Functions ▸ Properties ▸ Categories', 'Business Workspaces menu ▸ Recent', 'Drag a file onto the panel'], answer: 1, explain: 'The Attributes panel is display-only; edit through Properties ▸ Categories.' },
          { q: 'Which three entries does the Classic View Business Workspaces menu offer?', options: ['Create, Copy, Move', 'Search, Recent, Favorites', 'Team, Roles, Metadata', 'Overview, Documents, Discussion'], answer: 1, explain: 'The Global Menu Bar Business Workspaces menu offers Search, Recent and Favorites.' },
          { q: 'A user cannot find the Navigation tree option in their Smart View settings. What must happen first?', options: ['An administrator enables the Simple User Profile in Configure Smart View', 'The user joins the Business Administrators group', 'The workspace type gets a new icon', 'The template is re-applied'], answer: 0, explain: 'The Business Workspace navigation tree setting appears once the Simple User Profile is enabled.' },
          { q: 'Inside a discussion opened from the Discussion tile, how should you return to the workspace?', options: ['The browser Back button', 'The back arrow in the workspace header', 'Sign out and in again', 'The Classic View breadcrumb'], answer: 1, explain: 'Use the back arrow at the top left of the workspace header; the browser button can take you elsewhere.' },
          { q: 'Which actions can the Inline Action Bar of a document on the Documents tab offer? Pick the best answer.', options: ['Only View and Download', 'Actions such as Edit, Rename, Add version, Move and Start Workflow — limited to what the user’s permissions allow', 'Only actions on the workspace itself', 'Every action, regardless of permissions'], answer: 1, explain: 'The Inline Action Bar shows the document actions the user is permitted to perform.' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ BW03
  {
    id: 'bw03', track: 'workspaces', order: 3, title: 'Installation, permissions and privileges', source: `${SRC} — Ch. 3`, feature: 'businessWorkspaces',
    domains: ['ba-bw-fundamentals', 'ba-admin-roles', 'ws-infra'],
    summary: 'The modules business workspaces depend on, enabling them, the three configuration areas, the admin page and the Business Workspaces volume, and the permissions and privileges a workspace administrator group needs.',
    lesson: [
      'Business Workspaces and Template Workspaces ship with Content Server (22.1) but are **disabled until enabled** by a system administrator — and only if the license includes both. Enabling is done on the admin page (Business Workspaces ▸ **Enable Business Workspaces**), needs a **restart**, and **cannot be undone**.',
      {
        figure: {
          type: 'layers',
          layers: [
            { label: 'Business Workspaces', items: ['Types', 'Roles', 'Widgets'] },
            { label: 'Template Workspaces', items: ['Document Templates', 'Case Management', 'Barcode', 'Calendar Attribute', 'Partner Database', 'Interview'] },
            { label: 'Core', items: ['Classifications', 'Records Management', 'Categories', 'ActiveView'] },
          ],
        },
        caption: 'The dependencies: Classifications, Records Management, Case Management, Document Templates and Template Workspaces.',
      },
      'Configuration then falls into **three areas**: identify business processes (root folder, classification), refine metadata and events (category, optional custom columns and activity manager), and build workspaces (type, template, roles, perspective, search).',
      {
        figure: {
          type: 'compare',
          items: [
            { title: 'Admin page', tone: 'warn', points: ['Enable · Configure', 'Import Configuration', 'Migration Administration', 'Set up Outlook Add-in'] },
            { title: 'Business Workspaces volume', tone: 'info', points: ['Categories · Classifications · Facets', 'Outlook Add-in Configuration · Perspectives', 'Saved Queries · Replacement-tag variables', 'Workspace Types'] },
          ],
        },
        caption: 'System switches on the admin page; everyday configuration objects in the volume (Enterprise ▸ Business Workspaces).',
      },
      'A **Business Administrators** group is created at installation with the Business Administration usage privileges. To let it configure workspaces you add three layers of rights:',
      {
        steps: [
          '**Permissions** up to Delete (not Edit Permissions), This Item & Sub-Items, on: the Enterprise location for root folders, the Business Workspaces volume, and the Categories, Classifications, Facets, Saved Queries and Document Templates volumes (plus Outlook add-in configuration).',
          '**Object privileges** (Admin ▸ Object Privileges ▸ Edit Restrictions): Category, Category Folder, Classification Tree, Classification, Custom View, Facet Tree, Facet, Facet Folder, ActiveView, LiveReports — WebReports and Activity Manager when needed.',
          '**Usage privileges** (Admin ▸ Usage Privileges): Business Administration – Business Workspaces; Business Workspaces – Move Business Workspaces, Edit attributes relevant for group mapping, Regenerate Reference; ActiveView – Perspectives Tab; Warehouse Manager only for Transport.',
        ],
        title: 'Rights for the workspace administrator group',
      },
      { callout: 'warn', text: 'Creating workspace **templates** still needs a system administrator once: document templates must be allowed for the Business Workspace subtype (848) in Document Templates Administration.' },
      { callout: 'exam', text: 'Object privilege = may **create** an item type. Usage privilege = may **use** a feature. Permission = may act on **this item**. A question that mixes them up is testing exactly that.' },
      'Read on: [[bw-dependencies-modules]], [[bw-admin-page-volume]] and [[bw-rights]].',
    ],
    keyPoints: [
      'Dependencies: Classifications, Records Management, Case Management, Document Templates, Template Workspaces.',
      'Enabling needs a license for both modules and a restart, and cannot be reversed.',
      'Three configuration areas: identify processes, refine metadata and events, build workspaces.',
      'The Business Workspaces volume holds categories, classifications, facets, perspectives, saved queries, replacement-tag variables and workspace types — not templates.',
      'The administrator group needs Delete-level permissions on the configuration volumes, object privileges for configuration item types, and the Business Workspaces usage privileges.',
    ],
    missions: [
      {
        id: 'bw03-sysadmin', type: 'investigate', title: 'Which hat are you wearing?', xp: 20,
        brief: 'Some steps need a system administrator, most need only business administration rights. Find out which you have.',
        steps: [
          'In Classic View, open My Account ▸ My Profile (or ask an administrator) and check whether your account has System Administration rights.',
          'Answer yes or no below.',
        ],
        inputs: [{ key: 'sa', label: 'Does your account have System Administration rights? (yes/no)', placeholder: 'yes or no' }],
        checks: [{ kind: 'answer', input: 'sa', source: 'user.isSysAdmin', compare: 'yesno', label: 'System Administration rights on your account' }],
      },
      {
        id: 'bw03-groups', type: 'investigate', title: 'Find your administration group', xp: 20,
        brief: 'Workspace administration should come from a group, not from personal grants. See which groups you belong to.',
        steps: [
          'Open your profile (Classic View: My Account ▸ My Profile ▸ Groups; Smart View: your profile) and list your groups.',
          'Look for a group such as Business Administrators or a dedicated workspace administration group.',
          'Type the name of one group you are a member of.',
        ],
        inputs: [{ key: 'group', label: 'A group you belong to', placeholder: 'e.g. Business Administrators' }],
        checks: [{ kind: 'answer', input: 'group', source: 'user.groups', compare: 'contains', label: 'You are a member of that group' }],
      },
      {
        id: 'bw03-version', type: 'investigate', title: 'Which release are you on?', xp: 20,
        brief: 'The course is written for 22.1. Menu names and some features differ by release, so know yours.',
        steps: [
          'Open the Content Server admin pages ▸ System Report, or the Help ▸ About page in Classic View.',
          'Note the Content Server version (for example 22.3 or 24.2).',
          'Type it below.',
        ],
        inputs: [{ key: 'ver', label: 'Content Server version', placeholder: 'e.g. 22.3' }],
        checks: [{ kind: 'answer', input: 'ver', source: 'server.version', compare: 'contains', label: 'Your Content Server version' }],
      },
      {
        id: 'bw03-trees', type: 'investigate', title: 'Look inside the Classifications volume', xp: 20,
        brief: 'Classifications are the first building block of the configuration roadmap. See what trees exist.',
        steps: [
          'Open Enterprise ▸ Business Workspaces ▸ Classifications (or Enterprise ▸ Classifications).',
          'Note the classification trees at the top level.',
          'Type the name of one of them.',
        ],
        inputs: [{ key: 'tree', label: 'A top-level classification tree', placeholder: 'e.g. Workspace Templates' }],
        checks: [{ kind: 'answer', input: 'tree', source: 'classificationTrees', compare: 'contains', label: 'That tree exists at the top of the Classifications volume' }],
      },
      {
        id: 'bw03-rights-plan', type: 'practice', title: 'Plan the rights for a workspace administrator group', xp: 15,
        brief: 'Mirror the course exercise on your own server — on a training or development system only.',
        steps: [
          'Decide which group will administer workspaces on your server (the built-in Business Administrators group or one you create).',
          'Open Enterprise ▸ Business Workspaces and list the items you see.',
          'Open Admin ▸ Object Privileges and Usage Privileges and note, for each privilege in the lesson, whether it is restricted and whether your group is listed.',
          'If you are allowed to on a training server, grant the missing ones to the group; otherwise write down what you would ask for.',
        ],
        reflection: 'List the items in your Business Workspaces volume, the permissions, object privileges and usage privileges your group already had or lacked, and which you would leave out (for example Warehouse Manager) and why.',
        minWords: 40,
      },
      {
        id: 'bw03-quiz', type: 'quiz', title: 'Knowledge check: installation, permissions and privileges', xp: 25,
        questions: [
          { q: 'Which statement about enabling Business Workspaces is true?', options: ['It can be switched off again from the same page', 'It needs a license for Business Workspaces and Template Workspaces, a restart, and cannot be undone', 'It is enabled automatically on every installation', 'It only enables Template Workspaces'], answer: 1, explain: 'Both modules must be licensed; after enabling, Content Server is restarted, and the modules cannot be disabled again.' },
          { q: 'Which item is NOT in the Business Workspaces volume?', options: ['Workspace Types', 'Saved Queries Volume', 'Workspace templates', 'Variables for Replacement Tags'], answer: 2, explain: 'Templates live in the Document Templates volume; the Business Workspaces volume holds categories, classifications, facets, perspectives, saved queries, replacement-tag variables and workspace types.' },
          { q: 'Which permission level does the course grant the administrator group on the configuration volumes?', options: ['See Contents', 'Modify', 'Delete (everything except Edit Permissions)', 'Edit Permissions'], answer: 2, explain: 'All check boxes up to and including Delete, applied to This Item & Sub-Items.' },
          { q: 'A key user must move workspaces between folders. Which privilege do they need?', options: ['Regenerate Reference', 'Move Business Workspaces', 'Perspectives Tab', 'Category object privilege'], answer: 1, explain: 'Only users with the Business Workspaces – Move Business Workspaces usage privilege can move a workspace.' },
          { q: 'Where do you add a group to the Classification Tree object privilege?', options: ['Core System – Feature Configuration ▸ Object Privileges ▸ Edit Restrictions', 'Enterprise ▸ Business Workspaces ▸ Classifications ▸ Permissions', 'Configure Smart View', 'Workspace Types ▸ Advanced'], answer: 0, explain: 'Object privileges are managed on the Object Privileges admin page with Edit Restrictions.' },
          { q: 'In the configuration overview, which area does creating the category belong to?', options: ['Identify business processes', 'Refine metadata and events', 'Build workspaces', 'Install modules'], answer: 1, explain: 'Category, custom columns and activity manager belong to “refine metadata and events”.' },
          { q: 'Which step of building workspaces needs a system administrator rather than a business administrator?', options: ['Creating roles and teams', 'Allowing document templates for the Business Workspace subtype', 'Creating saved queries', 'Defining replacement-tag variables'], answer: 1, explain: 'Allowing templates to be created for subtype 848 is done by a system administrator in Document Templates Administration.' },
          { q: 'When is the Warehouse Administration – Warehouse Manager usage privilege needed for the workspace administrator group?', options: ['Always', 'Only if the group will move configuration to another Content Server instance with Transport', 'To create categories', 'To open the Business Workspaces volume'], answer: 1, explain: 'It is optional and only needed for Transport Warehouse work.' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ BW16
  {
    id: 'bw16', track: 'workspaces', order: 16, title: 'Accessing, using and editing business workspaces', source: `${SRC} — Ch. 16`, feature: 'businessWorkspaces',
    domains: ['ws-using', 'ws-roles', 'bu-collab'],
    summary: 'Work in a finished workspace in Classic View and Smart View — documents with required metadata, tasks, forums, filters, columns, team, comments, insights — and edit it: description, metadata, categories, team, location and layout.',
    lesson: [
      'With the configuration done, the workspace is used every day — and edited. In **Classic View** every Content Server function works inside it: drag files in and complete required document attributes (**Show the incomplete items**), add tasks to the task list copied from the template, post forum topics, filter many workspaces with the **Content Filter**, show attributes as **custom columns**, and search with a search form on the root folder.',
      'In **Smart View** the team works on the perspective page: add **participants to roles** (and export the list as CSV), discuss, upload with the required metadata in the upload dialog, comment, and switch on **Insights** to receive changes in the **Notification Center**. Task lists open in Classic View.',
      {
        figure: {
          type: 'compare',
          items: [
            { title: 'Classic View strengths', tone: 'info', points: ['Bulk completion of attributes', 'Task lists and forums', 'Content Filter, columns, search forms', 'Properties ▸ Categories / General'] },
            { title: 'Smart View strengths', tone: 'accent', points: ['Team and roles, CSV export', 'Metadata tile inline editing', 'Comments, activity feed, Insights', 'Edit Page for container layouts'] },
          ],
        },
        caption: 'Use both — switching keeps your location.',
      },
      { h: 'Editing an existing workspace' },
      {
        figure: {
          type: 'hub',
          center: 'Edit a workspace',
          items: [
            { label: 'Metadata', sub: 'Edit Attributes' },
            { label: 'Description', sub: 'Properties ▸ General' },
            { label: 'Name', sub: 'pattern or Rename' },
            { label: 'Categories', sub: 'Add a new category' },
            { label: 'Team', sub: 'participants in roles' },
            { label: 'Location', sub: 'Move Business Workspaces' },
            { label: 'Layout', sub: 'Edit Page / Perspective Manager' },
          ],
        },
        caption: 'Each edit has its own permission or privilege.',
      },
      {
        steps: [
          'Open the workspace’s Properties (Inline Action Bar in the parent folder, or Functions ▸ Properties in Classic View).',
          'On General, edit the **Description** — the header shows it when it uses {description}.',
          'Use **Add a new category** to attach an extra category and fill its attributes.',
          'Add folders, task lists or links inside the workspace as the team needs them.',
        ],
        title: 'Typical edits',
      },
      { callout: 'warn', text: 'Changing an attribute that decides the location does **not** move the workspace; moving needs the **Move Business Workspaces** privilege and removes inherited roles. Template changes never reach existing workspaces, and there is no “change type”.' },
      { callout: 'exam', text: '**Edit Page** (Profile menu) edits the perspective of the current container or landing page and needs the **Perspectives Tab** usage privilege, the **ActiveView** object privilege and **Modify** on the perspective. It cannot edit Business Workspaces widgets.' },
      'Read on: [[bw-using-classic]], [[bw-using-smart-view]] and [[bw-editing]].',
    ],
    keyPoints: [
      'Document attributes inside a workspace are separate from the workspace’s own attributes.',
      'Add participants to roles; roles carry the permissions; team lists export to CSV.',
      'Task lists open in Classic View even from Smart View.',
      'Insights send workspace changes to the Notification Center.',
      'Edit Page needs Perspectives Tab, ActiveView and Modify on the perspective, and does not edit workspace widgets.',
      'Moving needs Move Business Workspaces; changed location attributes never move a workspace by themselves.',
    ],
    missions: [
      {
        id: 'bw16-description', type: 'hands-on', title: 'Edit the workspace: give it a description', xp: 30, requires: ['ws04-create'],
        brief: 'The description appears in the workspace header of most perspectives. Edit your lab workspace’s properties.',
        steps: [
          'Open the parent folder of your ACME workspace (“Training Customers”).',
          'Smart View: hover the workspace ▸ Properties ▸ General; Classic View: Functions ▸ Properties ▸ General.',
          'Type a description of at least 20 characters, e.g. “Key account in EMEA — contracts, orders and correspondence.”, and save.',
          'Open the workspace and check whether the header shows it.',
        ],
        hints: ['You need Modify on the workspace. If you created it, you have it.'],
        checks: [{ kind: 'prop', node: 'wsAcme', field: 'description', op: 'nonEmpty', value: '20', label: 'The workspace has a description of 20+ characters' }],
        open: 'wsAcme',
      },
      {
        id: 'bw16-tasklist', type: 'hands-on', title: 'Add a task list “Onboarding tasks”', xp: 30, requires: ['ws04-create'],
        brief: 'Workspaces often carry a task list from their template. Add one by hand to see how it behaves.',
        steps: [
          'Open your ACME workspace in Classic View (task lists are Classic View objects).',
          'Add Item ▸ Task List; name it exactly “Onboarding tasks”, directly in the workspace.',
          'Inside it, add a task assigned to yourself, e.g. “Collect signed NDA”.',
          'Open Personal ▸ Assignments and mark the task Completed.',
        ],
        hints: ['If Task List is missing from Add Item, the module or your object privileges may not allow it on your server.'],
        checks: [{ kind: 'child', parent: 'wsAcme', name: 'Onboarding tasks', types: [204], typeName: 'task ?list', label: 'Task list “Onboarding tasks” in the workspace' }],
        open: 'wsAcme',
      },
      {
        id: 'bw16-folder', type: 'hands-on', title: 'Add a “Meeting Notes” folder', xp: 30, requires: ['ws04-create'],
        brief: 'Teams add structure their template did not foresee. Add a folder directly inside the workspace.',
        steps: ['Open your ACME workspace (either view).', 'Add a folder named “Meeting Notes” at the top level of the workspace.'],
        hints: ['If many workspaces need this folder, it belongs in the template — this only changes one workspace.'],
        checks: [{ kind: 'child', parent: 'wsAcme', name: 'Meeting Notes', types: [0], typeName: '^folder$', label: 'Folder “Meeting Notes” in the workspace' }],
        open: 'wsAcme',
      },
      {
        id: 'bw16-url', type: 'hands-on', title: 'Link the customer’s website', xp: 30, requires: ['ws04-create'],
        brief: 'A URL item keeps an external page one click away from the team.',
        steps: ['Open your ACME workspace.', 'Add a URL (web address) named “Customer website” pointing to any address, e.g. https://www.example.com.'],
        checks: [{ kind: 'child', parent: 'wsAcme', name: 'Customer website', types: [140], typeName: '^url$|web address', label: 'URL “Customer website” in the workspace' }],
        open: 'wsAcme',
      },
      {
        id: 'bw16-category', type: 'hands-on', title: 'Add a second category to the workspace', xp: 30, requires: ['ws04-create'],
        brief: 'Mirror the course: attach an additional category to an existing workspace.',
        steps: [
          'Open the workspace’s Properties (Smart View: hover ▸ Properties; Classic View: Functions ▸ Properties ▸ Categories).',
          'Click Add a new category (Smart View) or Add Category (Classic View) and pick any category other than the workspace’s own one — preferably one without required attributes, or fill them.',
          'Save. The workspace now carries two categories.',
        ],
        hints: ['Do not remove the Training Customer category — the name pattern and header depend on it.'],
        checks: [{ kind: 'categories', node: 'wsAcme', min: 2, label: 'The workspace carries at least two categories' }],
        open: 'wsAcme',
      },
      {
        id: 'bw16-team', type: 'practice', title: 'Manage and export the team', xp: 15, requires: ['ws04-create'],
        brief: 'Practise the Team tile the way a team lead would.',
        steps: [
          'Open your workspace in Smart View and expand the Team tile.',
          'Add a colleague or a group to a role with Add participants.',
          'Open the Roles tab and the details of that role.',
          'Select the participants and download the list as CSV.',
        ],
        reflection: 'Whom did you add to which role, what does that role allow, and how would you use the CSV export in a periodic access review?',
        minWords: 30,
      },
      {
        id: 'bw16-editpage', type: 'practice', title: 'Edit a container page with Edit Page', xp: 15,
        brief: 'Add a widget to one folder’s Smart View page — on a training server.',
        steps: [
          'Open a folder you own in Smart View (for example your sandbox).',
          'Profile menu ▸ Edit page. If the entry is missing, note which of the three requirements you lack.',
          'Add widget ▸ Standard Widgets ▸ drag Favorites (or Recently Accessed) onto a drop area ▸ Save.',
          'Open a sibling folder and confirm it is unchanged.',
        ],
        reflection: 'Did Edit Page appear for you? Explain which privileges and permission it needs, what changed on the page, and why the change did not reach other folders.',
        minWords: 30,
      },
      {
        id: 'bw16-insights', type: 'practice', title: 'Get notified with Insights', xp: 15, requires: ['ws04-create'],
        brief: 'Make the workspace tell you when something changes.',
        steps: [
          'On your workspace Overview, enable Insights (button next to the favorite star), if your release shows it.',
          'Upload a file to the workspace.',
          'Wait a few minutes and open the Notification Center; then open its Settings.',
        ],
        reflection: 'What appeared in the activity feed and in the Notification Center, how long did it take, and how is Insights different from simply watching the activity feed?',
        minWords: 25,
      },
      {
        id: 'bw16-quiz', type: 'quiz', title: 'Knowledge check: accessing, using and editing', xp: 25,
        questions: [
          { q: 'After dragging files into a folder whose category has required attributes, what do you use in Classic View to fill them?', options: ['Show the incomplete items ▸ Complete Selected Items', 'Properties ▸ Audit', 'The Business Workspaces menu', 'Edit Page'], answer: 0, explain: 'The yellow band leads to the incomplete items; complete them on the Edit Attributes page, then Accept.' },
          { q: 'Why does a template’s task list name usually contain a replacement tag?', options: ['To make each workspace’s task list name unique in Personal ▸ Task Lists', 'To hide it from readers', 'To start a workflow', 'To apply a category'], answer: 0, explain: 'Without a unique part, every workspace would have an identically named task list.' },
          { q: 'A user clicks a task list in Smart View to add a task. What happens?', options: ['An error appears', 'The task list opens in Classic View, where Add Item ▸ Task is used', 'A workflow starts', 'The task is added to the Metadata tile'], answer: 1, explain: 'Task lists are handled in Classic View; Smart View hands over to it.' },
          { q: 'Which three requirements make Edit page appear in the Smart View Profile menu?', options: ['Perspectives Tab usage privilege, ActiveView object privilege, Modify on the perspective', 'System Administration rights only', 'Move Business Workspaces, Regenerate Reference, Delete', 'Edit Attributes on the folder'], answer: 0, explain: 'All three are needed: the usage privilege, the object privilege and Modify on the perspective object.' },
          { q: 'A workspace’s Region attribute (used for its location sub-folder) changes from EMEA to APAC. What happens to the workspace?', options: ['It moves to the APAC folder automatically', 'It stays where it is until someone moves it', 'It is recreated', 'It is deleted'], answer: 1, explain: 'Location is worked out at creation; later attribute changes do not move the workspace.' },
          { q: 'How do you get changes in a workspace delivered to your Notification Center?', options: ['Enable Insights on the workspace', 'Add it to a collection', 'Mark it as a favorite', 'Rename it'], answer: 0, explain: 'Insights subscribe you to the workspace’s events, which then appear in the Notification Center.' },
          { q: 'What must an administrator do so that business workspaces appear in users’ Recently Accessed tile?', options: ['Select the Business Workspace object type under Recently Accessed Items in Configure Smart View', 'Restart the search engine', 'Give users Move Business Workspaces', 'Add a Workspaces widget to every perspective'], answer: 0, explain: 'The Recently Accessed Items section of Configure Smart View decides which object types are listed.' },
          { q: 'Which widget lists workspaces of one specific type and is titled “My workspaces” by default?', options: ['Workspaces widget', 'Header widget', 'Metadata widget', 'Activity feed'], answer: 0, explain: 'The Workspaces widget requires a workspace type and shows workspaces of that type.' },
        ],
      },
    ],
  },
];
