'use strict';
// Business workspaces in depth, part A: what they are and why (course 2-0108
// Ch. 1), using them in Smart View and Classic View (Ch. 2), installation,
// the Business Workspaces administration page and volume, and the rights a
// business administrator needs (Ch. 3), and accessing, using and editing
// workspaces (Ch. 16). All text is original; facts follow the 22.1 course
// manual and are marked where they are release-specific.
// Format: curriculum/CONTENT.md.

const SRC = (n) => `Content Server Business Workspaces (2-0108, 22.1) — Ch. ${n}`;

module.exports = [
  // ================================================================ CH 1
  {
    id: 'bw-intro-concepts',
    order: 10,
    title: 'Business workspaces: what they are, why they exist, where they fit',
    area: 'workspaces',
    summary: 'The idea behind business workspaces — data, content, people and tasks around one business object — their key components, typical use cases by department, and a procurement walkthrough from start to finish.',
    level: 'basic',
    minutes: 14,
    domains: ['ws-concepts', 'ba-bw-fundamentals'],
    modules: ['bw01'],
    tags: ['business workspace', 'content in context', 'use cases', 'procurement', 'extended ecm', 'connected workspaces', 'eim', 'single point of access'],
    related: ['bw-terminology', 'bw-dependencies-modules', 'ws-how-they-work', 'ba-bw-overview'],
    sources: [SRC(1), SRC(16)],
    body: [
      'Most organisations do not think in folders. They think in **business objects**: a customer, a supplier, a purchase order, a product under development, an employee, a building. A business workspace is Content Server’s answer to that: one container per business object that gathers everything needed to work on it — the documents and emails, the business data that describes it, the people responsible for it and the things that still have to be done.',
      'Think of a sales account. Without workspaces the proposal sits in Sales, the contract in Legal, the invoices in Finance and the support tickets in a shared drive. With a business workspace for that customer, all of it is reached from one place, already sorted into a standard structure, with the customer number and account manager visible at the top of the page and links to the projects and orders that belong to the same customer.',
      { h: 'Four ingredients: content in context' },
      'OpenText describes a business workspace as the fusion of four things around one business function. Keep these four in mind — almost every feature you will meet belongs to one of them.',
      {
        figure: {
          type: 'hub',
          center: 'Business workspace',
          items: [
            { label: 'Business data', sub: 'category attributes: IDs, names, status' },
            { label: 'Content', sub: 'documents, emails, forms, reports' },
            { label: 'People', sub: 'team roles, participants, social' },
            { label: 'Tasks', sub: 'task lists, reminders, workflows' },
          ],
        },
        caption: 'Data gives content its context; people and tasks make the workspace actionable.',
      },
      {
        table: {
          head: ['Ingredient', 'Where it lives', 'What it gives the user'],
          rows: [
            ['**Business data**', 'Category attributes on the workspace (or properties of a linked business object)', 'Context: the content becomes findable by invoice number, case ID, product name. It feeds the name, the header and search'],
            ['**Content**', 'Folders, documents, email folders, forms inside the workspace', 'One organised place; indexed with the metadata, versioned and audited, and open to Records Management'],
            ['**People**', 'Team roles defined in the template, participants added per workspace', 'Each responsibility maps to permissions and to what the person sees; Pulse-style social features for collaboration'],
            ['**Tasks**', 'Task lists, reminders, workflows, milestones and phases', 'Turns a store of files into a place where work gets done and tracked'],
          ],
        },
      },
      { h: 'Why OpenText built them' },
      'Classic enterprise information management had an adoption problem: end users saw extra work with little benefit, and administrators were stuck with large, rigid systems that were hard to change. Business workspaces take the opposite approach:',
      {
        ul: [
          '**Rules and templates do the work.** The administrator decides once how a kind of workspace is named, where it is stored, what it contains and who may do what. The user only picks a template and types a few values.',
          '**A role-based interface.** The same rules drive the Smart View pages (perspectives): each persona sees the tiles that matter to them.',
          '**Collaboration built in.** Discussions, comments, activity feeds and team lists sit inside the workspace, so users do not switch tools.',
          '**Governance without effort.** Because every workspace of a type is built the same way, permissions, metadata and records policies are applied consistently — compliance is a side effect of normal work.',
          '**Safe sharing.** Content in a workspace can be shared with partners and external parties while the enterprise keeps control.',
        ],
      },
      { h: 'Key components' },
      'Under the surface a business workspace is built from configuration objects that other modules provide. The course groups them into five families:',
      {
        figure: {
          type: 'layers',
          layers: [
            { label: 'User interface', items: ['Smart View perspectives', 'Classic View sidebar widgets'], note: 'how the workspace is presented' },
            { label: 'Collaboration', items: ['Team roles', 'Social / Pulse', 'Personalisation'], note: 'who works in it' },
            { label: 'Process', items: ['Checklists & task lists', 'Reminders', 'Workflows'], note: 'what gets done' },
            { label: 'Content', items: ['Documents', 'Emails', 'Forms'], note: 'what is stored' },
            { label: 'Structure & data', items: ['Workspace types & relationships', 'Categories & attributes', 'Templates & classifications'], note: 'the backbone' },
          ],
        },
        caption: 'Configuration objects from several modules combine into one workspace. The rules (for example which templates are offered to whom, and where) tie them together.',
      },
      'Workspaces can also be **related** to each other — a customer to its orders, a project to its sub-projects — so that together they form a backbone of business information you can navigate in any direction.',
      { h: 'Typical use cases' },
      {
        table: {
          head: ['Department', 'Business object', 'What goes in the workspace'],
          rows: [
            ['Facilities', 'Building / site', 'Lease and rental documents, health and safety incidents, security information'],
            ['Research & development', 'Product, patent, trial', 'Launch plans, patent filings, product planning, trial results, project collaboration'],
            ['Manufacturing', 'Asset / equipment', 'Asset records, operating procedures, maintenance and equipment documents'],
            ['Human Resources', 'Employee', 'Onboarding documents, policies, promotions, disciplinary records — tightly controlled by role'],
            ['Sales', 'Customer, opportunity, proposal', 'Standardised proposal structure, correspondence, quotes, contracts, invoices'],
          ],
        },
      },
      { callout: 'tip', title: 'A quick test', text: 'Is there a business object with its own identity (a number or a name), its own data, a team that changes over time and a process that repeats for every new instance? Then a workspace type is a good fit. A one-off shared folder is not.' },
      { h: 'Walkthrough: a procurement case' },
      'Procurement shows the whole idea at work. In a full Extended ECM landscape the purchase order lives in an ERP system; the course uses the example only to illustrate, and the steps below work the same with Content-Server-only workspaces.',
      {
        figure: {
          type: 'lanes',
          lanes: [
            { label: 'Buyer', cells: ['Creates PO workspace from a template', 'Enters supplier and PO data', 'Assigns team roles', '', 'Closes the case'] },
            { label: 'System', cells: ['Names and files it by the type', 'Copies folders, roles, categories', 'Shows it on members’ home pages', 'Versions, audits, applies RM', ''] },
            { label: 'Team', cells: ['', '', 'Uploads quotes, contracts, delivery notes', 'Works tasks, discusses, follows', 'Navigates to supplier and contract'] },
          ],
        },
        caption: 'A case-based workspace: choose a template, enter the basic data, staff the roles — the rules do the rest.',
      },
      {
        steps: [
          'A buyer creates a new purchase-order workspace and chooses the most suitable template (for example “Standard PO” or “Capital equipment PO”).',
          'They enter the basic information — order number, supplier, value — and add colleagues to the predefined roles (Buyer, Approver, Receiving).',
          'The new workspace appears on each member’s landing page, so they reach their open cases and their tasks in one click.',
          'Everyone uses the normal document management features inside it: versions, audit trail, workflows. Records Management can be applied so the documents are kept and disposed of correctly.',
          'Procurement data is visible through the workspace’s categories and its related workspaces: from the PO you jump to the supplier workspace or the contract workspace — a 360° view of the process.',
        ],
        title: 'The procurement case in five steps',
      },
      { h: 'Naming history you will meet in documentation' },
      {
        figure: {
          type: 'timeline',
          items: [
            { when: 'Before 21.4', label: 'Two names', sub: '“Connected Workspaces” = content only in Content Server; “Business Workspaces” = linked to SAP, Salesforce… via Extended ECM' },
            { when: '21.4 onwards', label: 'One name', sub: 'All of them are “Business Workspaces” (BW), whether or not they are connected' },
            { when: '22.1 (this course)', label: 'Part of core', sub: 'Modules ship with Content Server; enabled when licensed' },
          ],
        },
        caption: 'Older guides, admin page labels and exam questions may still say “Connected Workspaces”.',
      },
      { callout: 'note', text: 'This guide, like the 2-0108 course, covers workspaces that live entirely in Content Server. Connecting them to a leading application (SAP, Salesforce, SuccessFactors, Microsoft Dynamics, Oracle E-Business Suite) adds business object types and an external system — see [[ws-how-they-work]] and [[ws-create]].' },
      { callout: 'exam', title: 'What the exam asks', text: ['Know the **four ingredients** (business data, content, people, tasks) and be able to place a feature in the right one: a reminder is a task feature, a category attribute is business data, a team role is people.', 'Know that Smart View is the primary interface for workspaces but that **Classic View works too**, and that “Connected Workspaces” is the pre-21.4 name for Content-Server-only workspaces.'] },
      'Next: learn the vocabulary in [[bw-terminology]], then see how a user moves around a workspace in [[bw-navigate-smart-view]].',
    ],
  },

  {
    id: 'bw-terminology',
    order: 11,
    title: 'Business workspace terminology, explained',
    area: 'workspaces',
    summary: 'Every term the course and the exam use — header, tile, widget, perspective, rule, layout, sidebar widget, activity manager, persona, landing page, team roles and more — what each means and how they relate.',
    level: 'basic',
    minutes: 11,
    domains: ['ws-concepts', 'ba-bw-fundamentals'],
    modules: ['bw01'],
    tags: ['terminology', 'header', 'tile', 'widget', 'perspective', 'layout', 'rule', 'sidebar widget', 'activity manager', 'activeview', 'persona', 'landing page'],
    related: ['bw-intro-concepts', 'bw-navigate-smart-view', 'ba-perspective-manager'],
    sources: [SRC(1), SRC(2)],
    body: [
      'Business workspaces borrow words from several modules — ActiveView, Pulse, Template Workspaces, Smart View. Mixing them up is the most common reason for wrong answers. This guide sorts them into four groups: the **things being configured**, the **Smart View presentation**, the **Classic View presentation** and the **people side**.',
      {
        figure: {
          type: 'tree',
          root: {
            label: 'Business workspace vocabulary', icon: 'workspace', children: [
              { label: 'Configuration', icon: 'template', children: [
                { label: 'Workspace type', icon: 'workspace', note: 'name pattern, location, icons, sidebar widgets' },
                { label: 'Workspace template', icon: 'template', note: 'folders, categories, classification, roles' },
                { label: 'Categories & attributes', icon: 'category', note: 'business data' },
                { label: 'Classifications', icon: 'classification', note: 'what may be created where' },
                { label: 'Document Templates', icon: 'template', note: 'basis for new workspaces (TWS)' },
              ] },
              { label: 'Smart View', icon: 'page', children: [
                { label: 'Perspective', icon: 'page', note: 'layout + rules' },
                { label: 'Header, tiles, widgets', icon: 'page' },
                { label: 'Landing page', icon: 'page', note: 'role-based home' },
              ] },
              { label: 'Classic View', icon: 'folder', children: [
                { label: 'Sidebar widgets', icon: 'folder', note: 'right-hand panel' },
                { label: 'ActiveView override', icon: 'folder' },
              ] },
              { label: 'People & activity', icon: 'group', children: [
                { label: 'Team roles & participants', icon: 'group' },
                { label: 'Persona', icon: 'user' },
                { label: 'Activity feed / manager', icon: 'report' },
                { label: 'Reminders', icon: 'doc' },
              ] },
            ],
          },
        },
        caption: 'Four families of terms. When a question names a term, first ask which family it belongs to.',
      },
      { h: 'Configuration terms' },
      {
        table: {
          head: ['Term', 'Meaning', 'Easily confused with'],
          rows: [
            ['**Workspace type**', 'A set of settings that controls where workspaces of one kind are stored (below the root folder), how they are named (name pattern), their icons, sidebar widgets and extra classifications', 'The template — the type does not hold folders or roles'],
            ['**Workspace template**', 'The master copy: folder structure and documents, categories, classification, team roles and permissions', 'The type — the template does not decide the name or location'],
            ['**Document Templates**', 'The Template Workspaces feature that stores templates and offers them to the user depending on the business object type and the storage location (classification)', 'Word/Excel templates in general'],
            ['**Categories / attributes**', 'Named sets of attributes that store metadata; business properties of a business object are mapped to attributes', 'Classifications'],
            ['**Classifications**', 'Tags from a classification tree. For workspaces they control **which kind of workspace can be created in which folder**', 'Categories — classifications carry no values'],
            ['**Relationships**', 'Links between workspaces that mirror the hierarchy of business objects (customer → orders)', 'Shortcuts'],
            ['**Rules**', 'Conditions (workspace type, template, user group…) that decide when a perspective is used', 'Business rules in workflows'],
          ],
        },
      },
      { h: 'Smart View terms' },
      {
        figure: {
          type: 'layers',
          layers: [
            { label: 'Header', items: ['Name & icon', 'Type', 'Key metadata', 'Favorite', 'Activity feed'], note: 'the banner at the top' },
            { label: 'Tabs', items: ['Overview', 'Documents', 'custom tabs'], note: 'defined by the layout' },
            { label: 'Tiles', items: ['Team', 'Metadata', 'Related Workspaces', 'Recently Accessed', 'Discussion'], note: 'each tile shows one widget' },
          ],
        },
        caption: 'A perspective arranges widgets into tiles on tabs below the header.',
      },
      {
        table: {
          head: ['Term', 'Meaning'],
          rows: [
            ['**Perspective**', 'Decides how users see a workspace (or a container or landing page) in Smart View. It combines a **layout** with **rules** and is built in the **Perspective Manager**'],
            ['**Layout**', 'The number of tabs, which widgets appear and where they sit'],
            ['**Perspective Manager**', 'The design tool for perspective rules and layouts. For workspaces it opens with a reduced, workspace-focused set of options'],
            ['**Widget**', 'A UI element that shows information — from Business Workspaces (Team, Metadata, Related Workspaces…), from Content Server (Favorites, Recently Accessed, Welcome header), from Collaboration or WebReports'],
            ['**Tile**', 'The box on the page in which a widget is displayed — the Team tile lists participants and roles, the Metadata tile shows attributes, the Header tile shows name, type, image and key data'],
            ['**Header**', 'The banner at the top of a workspace with its name and, by default, the Overview and Documents tabs'],
            ['**Landing page**', 'The role-based “Home” page of Smart View that can show a tile for each workspace a user needs every day'],
            ['**Smart View**', 'The tile-based Content Server interface with a landing page and container pages, highly configurable through perspectives'],
          ],
        },
      },
      { h: 'Classic View terms' },
      {
        figure: {
          type: 'compare',
          items: [
            { title: 'ActiveView override', tone: 'info', points: ['Changes how a component looks in **Classic View**', 'An older ActiveView technique'] },
            { title: 'ActiveView perspective', tone: 'accent', points: ['Changes how a component looks in **Smart View**', 'What Perspective Manager produces'] },
          ],
        },
        caption: 'The same module, ActiveView, serves both interfaces — with different words.',
      },
      {
        ul: [
          '**Sidebar widget** — a panel element shown beside a workspace in Classic View (attributes, recent changes, work items, workspace reference…). Sidebar widgets are configured on the **workspace type**.',
          '**Activity feed** — the stream of events about a workspace and its sub-items: new documents, metadata changes, comments.',
          '**Activity manager** — the object that collects metadata changes and publishes them to the activity feed (shown in the Smart View header, or Pulse in Classic View).',
        ],
      },
      { h: 'People terms' },
      {
        table: {
          head: ['Term', 'Meaning'],
          rows: [
            ['**Workspace team roles**', 'Roles defined in the workspace template together with their permissions on folders and documents'],
            ['**Team lead**', 'A role member who can add and remove participants **without being an administrator**'],
            ['**Persona**', 'A group of users who share a role and therefore need the same information — perspectives are designed per persona'],
            ['**Reminders**', 'Scheduled actions that email people at set times about renewals, cancellations, payments, shipments'],
          ],
        },
      },
      { callout: 'remember', text: 'Type = **how it is named and where it goes**. Template = **what it contains and who is in it**. Classification = **where it can be created**. Perspective = **how it looks in Smart View**. Sidebar widgets = **how it looks in Classic View**.' },
      { callout: 'exam', text: ['A favourite distractor swaps **tile** and **widget**: the widget is the component, the tile is where it is shown.', 'Another swaps **ActiveView override** (Classic View) and **ActiveView perspective** (Smart View).', 'And remember: rules decide **when** a perspective applies; the layout decides **what** it shows.'] },
    ],
  },

  // ================================================================ CH 2
  {
    id: 'bw-navigate-smart-view',
    order: 12,
    title: 'Getting around a business workspace in Smart View',
    area: 'workspaces',
    summary: 'A tile-by-tile tour for users: header and tabs, Team (participants, profiles, roles, team lead), Metadata (inline editing), Recently Accessed, Discussion (reply, ask, follow, search), the Documents tab and its Inline Action Bar — plus the Simple User Profile and the workspace navigation tree.',
    level: 'basic',
    minutes: 15,
    domains: ['ws-using', 'bu-collab', 'ba-smart'],
    modules: ['bw02'],
    tags: ['smart view', 'team tile', 'metadata tile', 'discussion tile', 'recently accessed', 'documents tab', 'inline action bar', 'simple user profile', 'navigation tree', 'favorite'],
    related: ['bw-navigate-classic', 'bw-using-smart-view', 'bw-editing', 'ws-working-in', 'ba-smart-view-admin'],
    sources: [SRC(2), SRC(16)],
    body: [
      'Business workspaces were designed first for Smart View. When you open one, you do not see a folder listing but a page — the workspace’s **perspective** — made of a header, tabs and tiles. What appears depends on the perspective the administrator designed for that workspace type and persona, so your page may differ in detail; the building blocks are the same everywhere.',
      { h: 'Open a workspace' },
      {
        steps: [
          'Switch to Smart View if you are in Classic View: Global Menu Bar ▸ **My Account ▸ Smart View**. You stay at the same place in the tree.',
          'Browse to the folder that holds the workspaces (for example Enterprise ▸ your company ▸ Projects) — or use Favorites, Recently Accessed or search.',
          'Click the workspace name. It opens on its **Overview** tab.',
        ],
        title: 'Open a business workspace',
        ui: 'Smart View',
      },
      {
        figure: {
          type: 'layers',
          layers: [
            { label: 'Header tile', items: ['Name & icon', 'Add Favorite', 'Activity feed', 'Overview | Documents tabs'] },
            { label: 'Overview tab', items: ['Team', 'Metadata', 'Recently Accessed', 'Discussion', 'Related Workspaces'] },
            { label: 'Documents tab', items: ['Folder structure', 'Inline Action Bar', 'Filters', 'Navigation tree (optional)'] },
          ],
        },
        caption: 'A typical workspace page. Tabs and tiles come from the perspective.',
      },
      { h: 'Header' },
      'The header is the banner across the top: the workspace name, its type and icon, a description and key metadata if the designer put them there, the **Add Favorite** star, and the tabs. The activity feed (latest events) usually shows on the right of the header while you are on the Overview tab.',
      {
        ul: [
          '**Mark as favorite:** click the star in the header, keep or change the suggested name, click Add.',
          '**Breadcrumb:** on the Overview and Documents tabs only the parent location is shown; the full breadcrumb trail appears when you open deeper pages, such as a discussion or an item’s properties.',
          '**Back arrow:** inside a discussion or properties page, use the back arrow at the top left of the workspace header — not the browser’s Back button — to return to the workspace.',
        ],
      },
      { h: 'Team tile' },
      'The Team tile lists the **participants** and their **roles**. Click the tile header (or the expand button at its bottom right) to open the full Team page.',
      {
        tabs: [
          { label: 'Participants', body: [
            { steps: [
              'Expand the Team tile. The **Participants** list opens.',
              'Sort or search any column; if the window is narrow, use **Show all** (or **Show more** on a row) to see every detail.',
              'Click a person’s name to open their profile: the General tab shows contact details such as the email address.',
              'From a full profile you can also follow the person and see their followers and activity.',
              'Close the profile with X, and the Team page with Close (top right).',
            ], title: 'View participants', ui: 'Smart View' },
          ] },
          { label: 'Roles', body: [
            { steps: [
              'On the expanded Team page, open the **Roles** tab (top right).',
              'Click a role name — or hover it and choose **View or edit role details** in the Inline Action Bar.',
              'The Role details dialog shows the members and whether the role is the **team lead**.',
              'Close the dialog, then close the Team page.',
            ], title: 'View roles and find the team lead', ui: 'Smart View' },
          ] },
        ],
      },
      { callout: 'tip', text: '“Who leads this workspace?” is answered on the **Roles** tab, not the Participants list: the team lead is a property of a role.' },
      { h: 'Metadata tile' },
      'The Metadata tile shows the attributes of the workspace’s category — the same business data that may feed the name and header. Fields render as the attribute types they are: text boxes, drop-down lists, check boxes, dates.',
      {
        steps: [
          'Click directly in the field you want to change, for example a delivery type or a duration.',
          'Choose a value from the list, or type the new value.',
          'Press **Enter** to save that field. Repeat for other fields.',
        ],
        title: 'Edit workspace metadata in place',
        ui: 'Smart View',
      },
      { callout: 'warn', text: 'Inline editing needs the **Edit Attributes** permission on the workspace. Most business users only have See and See Contents, so for them the tile is read-only — that is normal, not an error.' },
      { h: 'Recently Accessed tile' },
      'Lists the documents you used most recently in this workspace. You work with them as anywhere else — view, edit, share, download, copy or move, add a version — and you can search inside the tile. A document you have just edited appears here (refresh with F5 if it does not show yet). Clicking a document name opens or downloads it, depending on the type and your browser.',
      { h: 'Discussion tile' },
      'The Discussion tile shows the latest questions and replies of the workspace’s forum. From it you can:',
      {
        figure: {
          type: 'menu',
          title: 'Discussion tile',
          items: ['Reply', 'Ask a question', 'Follow all', 'Search discussions', 'Expand a post'],
          highlight: 'Ask a question',
          note: 'Replies can include images. Unfollow with the arrow next to Following / Following all.',
        },
      },
      {
        ul: [
          '**Reply:** click Reply under a post, type, click Post.',
          '**Ask a question:** button at the top right; type the question, Post.',
          '**Follow:** Follow all (whole discussion) or Follow (one post); undo with the arrow next to the Following label.',
          '**Search:** expand a post, type in the search field, press Enter to jump to the matching question.',
        ],
      },
      { h: 'Documents tab' },
      'The Documents tab is the workspace’s folder structure — copied from its template. Browse it like any folder. Hover an item to show the **Inline Action Bar**; it only offers the actions your permissions allow.',
      {
        figure: {
          type: 'menu',
          title: 'Inline Action Bar (document)',
          items: ['Properties', 'Copy link', 'Share', 'Edit', 'Rename', 'View permissions', 'Download', 'Reserve', 'Copy', 'Move', 'Add version', 'Delete', 'Collect', 'Start Workflow'],
          highlight: 'Edit',
          note: 'On a narrow screen the rest are under More actions (…).',
        },
      },
      {
        steps: [
          'Open the Documents tab and the target folder.',
          'Click **+ (Add) ▸ Document**, or drag files from your desktop onto the page.',
          'If the folder has a category with required attributes, fill them in the upload dialog.',
          'To give the file a business name, hover it ▸ **Rename** (or … ▸ Rename), replace the whole name, press Enter.',
        ],
        title: 'Add and rename a document',
        ui: 'Smart View',
      },
      { callout: 'note', text: 'Editing a document in place opens it in its desktop application through Enterprise Connect or Office Editor; the first time, you may be asked to sign in to Content Server in a dialog that can hide behind the browser.' },
      { h: 'Simple User Profile and the navigation tree' },
      'Two related settings change how users get around:',
      {
        figure: {
          type: 'flow',
          steps: [
            { label: 'Admin enables Simple User Profile', sub: 'Configure Smart View ▸ User Profile in Smart View', kind: 'actor' },
            { label: 'User opens Profile ▸ Settings', sub: 'Business Workspace section' },
            { label: 'Turns on Navigation tree' },
            { label: 'Documents tab shows tree icon', sub: 'left of Show filters', kind: 'end' },
          ],
        },
        caption: 'The navigation tree option only appears in a user’s settings once the administrator has enabled the Simple User Profile.',
      },
      { path: ['Administration', 'Core System – Server Configuration', 'Configure Smart View', 'User Profile in Smart View', 'Enable Simple User Profile'], ui: 'Classic View (admin pages)' },
      {
        steps: [
          'Administrator: open **Configure Smart View**, tick **Enable Simple User Profile**, Save Changes.',
          'User: in Smart View open your Profile menu ▸ your name ▸ **Settings**.',
          'In the **Business Workspace** section, switch on **Navigation tree**, close the dialog. The page refreshes.',
          'On a workspace’s Documents tab, click **Show navigation tree** (left of Show filters). A panel shows the whole folder structure of the workspace.',
        ],
        title: 'Turn on the workspace navigation tree',
      },
      {
        figure: {
          type: 'compare',
          items: [
            { title: 'Full profile (default)', tone: 'info', points: ['General details', 'Following, Followers, Activity tabs', 'Social features of Pulse'] },
            { title: 'Simple User Profile', tone: 'accent', points: ['Lighter profile page', 'No Following, Followers, Activity tabs', 'Unlocks the Business Workspace **Navigation tree** user setting'] },
          ],
        },
      },
      { callout: 'exam', title: 'What the exam asks', text: ['Which tile answers which question: **who** (Team), **what data** (Metadata), **what did I touch** (Recently Accessed), **what is being discussed** (Discussion), **where are the files** (Documents tab).', 'That inline metadata editing needs **Edit Attributes**, and that the navigation tree depends on the administrator enabling the **Simple User Profile** first.'] },
    ],
  },
  {
    id: 'bw-navigate-classic',
    order: 13,
    title: 'Business workspaces in Classic View',
    area: 'workspaces',
    summary: 'How a workspace looks and behaves in Classic View: the right-hand panel (Attributes, Recent Changes, Work Items, WS Reference), comments through Pulse, editing attributes through Properties, and the Business Workspaces menu on the Global Menu Bar.',
    level: 'basic',
    minutes: 9,
    domains: ['ws-using', 'bu-content'],
    modules: ['bw02'],
    tags: ['classic view', 'sidebar widgets', 'attributes', 'recent changes', 'work items', 'ws reference', 'pulse', 'business workspaces menu', 'global menu bar'],
    related: ['bw-navigate-smart-view', 'bw-using-classic', 'bw-terminology'],
    sources: [SRC(2), SRC(16)],
    body: [
      'Smart View is the primary interface for business workspaces, but every workspace also works in Classic View — useful for administrators, for older integrations and for functions that Smart View hands over to Classic View (such as adding tasks to a task list). In Classic View a workspace looks like a folder with an extra information panel.',
      { h: 'Switching between the views' },
      {
        figure: {
          type: 'compare',
          items: [
            { title: 'Smart View → Classic View', tone: 'info', points: ['Profile (User) menu at the top right ▸ **Classic View**', 'You land on the same container'] },
            { title: 'Classic View → Smart View', tone: 'accent', points: ['Global Menu Bar ▸ **My Account ▸ Smart View**', 'You land on the same container'] },
          ],
        },
        caption: 'The location is kept in both directions, so switch freely to use the function you need.',
      },
      { h: 'What the page shows' },
      {
        figure: {
          type: 'layers',
          layers: [
            { label: 'Left sidebar', items: ['Content Filter (facets)', 'Pulse from Here'], note: 'general Content Server panels; open with the orange bar' },
            { label: 'Centre', items: ['Folders and items of the workspace', 'Functions menus', 'Add Item'], note: 'the template’s structure' },
            { label: 'Right panel', items: ['Attributes', 'Recent Changes', 'Work Items', 'WS Reference'], note: 'sidebar widgets from the workspace type' },
          ],
        },
        caption: 'The right-hand panel stays visible in every folder inside the workspace.',
      },
      {
        table: {
          head: ['Sidebar widget', 'Shows', 'Notes'],
          rows: [
            ['**Attributes**', 'The values of the workspace’s category', 'Read-only here. To change them: workspace Functions ▸ **Properties ▸ Categories**'],
            ['**Recent Changes**', 'The documents changed most recently anywhere in the workspace', 'A file you just dropped in a sub-folder appears here'],
            ['**Work Items**', 'Assignments tied to the workspace: tasks, workflow steps', 'Your to-do list for this business object'],
            ['**WS Reference**', 'A reference number held in a category attribute that points to the business object', 'With Extended ECM it can link to the record in the leading application'],
          ],
        },
      },
      { callout: 'note', text: 'Sidebar widgets are configured on the **workspace type** (Advanced settings). The same configuration is reused in Smart View where a perspective has a matching widget.' },
      { h: 'Working inside the workspace' },
      'Everything you know from folders works, within your permissions: Add Item, drag and drop from Windows, Functions menus, Properties, Permissions, versions, workflows.',
      {
        steps: [
          'Open the workspace and browse to the target folder.',
          'Drag one or more files from Windows Explorer onto the folder listing (or use Add Item ▸ Document).',
          'If the folder’s category has required attributes, a yellow band appears: follow **Show the incomplete items** and complete them (see [[bw-using-classic]]).',
          'Check **Recent Changes** on the right — your file is listed.',
        ],
        title: 'Add a document in Classic View',
        ui: 'Classic View',
      },
      {
        steps: [
          'Next to an item, click the **Show Comments** button. (Shift+click opens the comments in a separate window.)',
          'The Pulse page opens for that item: post a comment, read the activity, see colleagues.',
          'Use the breadcrumb at the top to go back.',
        ],
        title: 'Comment on an item through Pulse',
        ui: 'Classic View',
      },
      { h: 'The Business Workspaces menu' },
      'Classic View adds a **Business Workspaces** menu to the Global Menu Bar — the quickest way back to a workspace without browsing.',
      {
        figure: {
          type: 'menu',
          title: 'Business Workspaces',
          items: ['Search', 'Recent', 'Favorites'],
          highlight: 'Recent',
          note: 'Search for a workspace, pick one you used recently, or one you marked as a favorite.',
        },
      },
      {
        steps: [
          'Click **Business Workspaces** on the Global Menu Bar.',
          'Choose a workspace from **Recent** or **Favorites** — or use **Search** to find one by name.',
          'The workspace opens; browse to the document you need and click its name to open it.',
          'Return to the workspace top level through the breadcrumb.',
        ],
        title: 'Reach a workspace from the Global Menu Bar',
        ui: 'Classic View',
      },
      { h: 'Four ways to reach a workspace' },
      { ul: ['Browse the hierarchy to the root folder of the workspace type.', 'Recently accessed (Business Workspaces ▸ Recent, or the Recently Accessed tile in Smart View).', 'Favorites (Business Workspaces ▸ Favorites, or the Favorites tile).', 'Search — simple search, a search form on the root folder, or Business Workspaces ▸ Search.'] },
      { callout: 'exam', text: ['In Classic View the workspace’s attributes on the right are **display only**; editing goes through **Properties ▸ Categories**. In Smart View the Metadata tile can be edited inline (with Edit Attributes).', 'The Business Workspaces menu offers **Search, Recent and Favorites** — not “Create”.'] },
    ],
  },

  // ================================================================ CH 3
  {
    id: 'bw-dependencies-modules',
    order: 14,
    title: 'Installing and enabling business workspaces: modules, dependencies and the configuration roadmap',
    area: 'workspaces',
    summary: 'Which modules business workspaces rely on and why, what Extended ECM Platform adds, how Business Workspaces and Template Workspaces are enabled (and why that is one-way), the two strategies for who configures, and the three configuration areas with the privilege each step needs.',
    level: 'intermediate',
    minutes: 15,
    domains: ['ba-bw-fundamentals', 'ws-concepts', 'ws-infra'],
    modules: ['bw03', 'bw01'],
    tags: ['installation', 'enable business workspaces', 'template workspaces', 'document templates', 'case management', 'classifications', 'records management', 'extended ecm platform', 'license', 'configuration overview'],
    related: ['bw-admin-page-volume', 'bw-rights', 'ba-bw-dependencies', 'ws-setup-roadmap'],
    sources: [SRC(1), SRC(3)],
    body: [
      'Business workspaces are not a single feature but a combination of modules. Knowing what each module contributes tells you why something is missing when a module is not enabled — and which settings belong to which part of the product.',
      { h: 'The modules behind business workspaces' },
      {
        figure: {
          type: 'layers',
          layers: [
            { label: 'Business Workspaces', items: ['Workspace types', 'Roles & teams', 'Perspective widgets', 'Related workspaces'], note: 'the workspace logic' },
            { label: 'Template Workspaces (TWS)', items: ['Document Templates', 'Case Management', 'Barcode', 'Calendar Attribute', 'Partner Database', 'Interview', 'Roles Wizard'], note: 'reusable templates and the components they need' },
            { label: 'Core services', items: ['Classifications', 'Records Management', 'Categories', 'ActiveView', 'Pulse', 'Search'], note: 'provided by Content Server itself' },
          ],
        },
        caption: 'Business Workspaces sits on Template Workspaces, which sits on core Content Server services.',
      },
      {
        table: {
          head: ['Dependency', 'What it does for workspaces'],
          rows: [
            ['**Classifications**', 'Decides what kind of workspace may be created in which folder: a root folder and a template with the same classification'],
            ['**Records Management**', 'Controls documents and other objects by rules and RM classifications; a workspace’s RM classification is visible in its properties'],
            ['**Case Management**', 'Part of Template Workspaces; handles case-like work where content, people, transactions and policies interact and documents change by stage'],
            ['**Document Templates**', 'The basis for new workspaces (and new documents) managed by business workspaces; templates are offered according to classification and storage location'],
            ['**Template Workspaces**', 'Lets designers build reusable workspace templates — a folder structure with categories and classifications. Bundles Barcode, Calendar Attribute, Case Management (base modules, Enterprise Connect plug-in, base roles wizard), Partner Database, Document Templates and Interview'],
          ],
        },
      },
      { callout: 'note', title: 'Release note (22.1)', text: 'The modules that used to make up Template Workspaces and the Extended ECM business workspace functionality are now part of **core Content Server**: they are no longer installed or patched separately and are updated with Content Server. Because not every customer is licensed for them, they are **disabled by default** on a new installation until a system administrator enables them.' },
      { h: 'Where Extended ECM Platform fits' },
      'Extended ECM Platform is the product that connects Content Server with leading business applications (ERP, CRM, HR, finance). It is explained with three words:',
      {
        figure: {
          type: 'hub',
          center: 'Extended ECM Platform',
          items: [
            { label: 'Content', sub: 'documents, images, drawings, email in Content Server' },
            { label: 'Context', sub: 'structured data from CRM, ERP, HRMS, FMS' },
            { label: 'Value', sub: 'both worlds integrated for the user' },
          ],
        },
        caption: 'Content gets its context from business data; users stay in the system they know and still see all the information.',
      },
      {
        figure: {
          type: 'compare',
          items: [
            { title: 'Business workspaces in Content Server', tone: 'info', points: ['Enabled from the Content Server admin pages', 'Metadata typed into categories', 'Types, templates, roles, perspectives', 'Scope of course 2-0108'] },
            { title: 'With Extended ECM Platform', tone: 'accent', points: ['Everything on the left, plus…', 'External systems and business object types', 'Workspaces created or linked from SAP, Salesforce, SuccessFactors…', 'Metadata kept in step with the leading application'] },
          ],
        },
      },
      { h: 'Enabling business workspaces' },
      {
        steps: [
          'Make sure the **license** covers both Business Workspaces and Template Workspaces.',
          'Sign in to the Content Server Administration pages as a system administrator.',
          'Type “Business Workspaces” in the admin page **Filter** to jump to the Business Workspaces section.',
          'Click **Enable Business Workspaces** and confirm. Both Business Workspaces and Template Workspaces are enabled.',
          '**Restart Content Server.**',
        ],
        title: 'Enable Business Workspaces and Template Workspaces',
        ui: 'Classic View (admin pages)',
      },
      { path: ['Content Server Administration', 'Business Workspaces', 'Enable Business Workspaces'], ui: 'Classic View' },
      { callout: 'warn', title: 'One-way switch', text: 'Once enabled, Business Workspaces and Template Workspaces **cannot be disabled**. Check the license and try it on a development system first.' },
      { h: 'Who configures: two strategies' },
      {
        figure: {
          type: 'compare',
          items: [
            { title: 'Simple: one admin account', tone: 'warn', points: ['An administrator builds everything: categories, classifications, types, templates', 'Selected users only get the right to create workspaces', 'Quick, but concentrates powerful rights'] },
            { title: 'Delegated: a business admin group', tone: 'pass', points: ['A group (the built-in **Business Administrators**, or your own such as “BW Management”) gets exactly the permissions and privileges needed', 'System and business administration are split — typical in OpenText cloud offerings', 'Add a person to the group to make them a workspace administrator'] },
          ],
        },
        caption: 'The course follows the delegated model, as the Business Workspaces Configuration Guide does.',
      },
      { h: 'The configuration roadmap: three areas' },
      'After enabling, configuration falls into three areas. Most steps are needed whether users will work in Smart View or Classic View; the difference is mainly the layout.',
      {
        figure: {
          type: 'flow',
          steps: [
            { label: 'Identify business processes', sub: 'root folder · classification', kind: 'start' },
            { label: 'Refine metadata and events', sub: 'category · custom columns · activity manager' },
            { label: 'Build workspaces', sub: 'type · template · roles · perspective · search', kind: 'end' },
          ],
        },
        caption: 'The three major areas of business workspace configuration.',
      },
      {
        table: {
          head: ['Area', 'Step', 'Purpose', 'Privilege needed'],
          rows: [
            ['Identify processes', 'Root folder', 'One folder per workspace type where its workspaces are stored (sub-folders may be generated from metadata)', 'Permissions on the Enterprise location'],
            ['Identify processes', 'Classification', 'Links the root folder and the template — only templates with the folder’s classification can be used there', 'Classification Tree / Classification object privileges'],
            ['Refine metadata', 'Category', 'Attributes that drive the name pattern and the sub-folder, and hold business data (strongly recommended)', 'Business Administration – Data Policies usage + Category object privilege'],
            ['Refine metadata', 'Custom columns (optional)', 'Show attributes in widgets and lists; improve search', 'Business Administration – Facets and Columns usage + Column object privilege'],
            ['Refine metadata', 'Activity manager (optional)', 'Publish metadata changes to the workspace activity feed', 'Activity Manager object privilege'],
            ['Build', 'Workspace type', 'Where workspaces are stored, how they are named (also per language), how data shows in widgets', 'Business Administration – Business Workspaces usage'],
            ['Build', 'Workspace template', 'Folder structure and other items copied into every new workspace', 'System administrator access (to allow templates for subtype 848)'],
            ['Build', 'Roles and teams (optional)', 'Access control and collaboration', 'Business Administration – Business Workspaces usage'],
            ['Build', 'Perspective', 'Smart View layout per user group', 'ActiveView – Perspectives Tab usage (+ ActiveView object privilege)'],
            ['Build', 'Search options', 'Help users find workspaces and metadata; search slices', '—'],
          ],
        },
      },
      { callout: 'tip', text: 'The template step is the one a business administrator usually cannot do alone: a system administrator must first allow document templates to be created for the **Business Workspace** subtype (848) in the Document Templates administration. Plan that hand-off.' },
      { h: 'Documentation to keep at hand' },
      { ul: ['Business Workspaces – Configuration Guide (the course follows it)', 'Online help: Configuring Business Workspaces, Business Workspaces Administration, Template Workspaces Administration, Document Templates Volume Administration, Creating and Configuring Template Workspaces Item Templates', 'Content Server Installation Guide and Module Installation and Upgrade Guide for your release', 'Extended ECM Platform Installation Guide and Integration and Configuration Guide when a leading application is involved'] },
      { callout: 'exam', title: 'What the exam asks', text: ['List the dependencies: **Classifications, Records Management, Case Management, Document Templates, Template Workspaces**.', 'Enabling needs a **license** for Business Workspaces and Template Workspaces, a **restart**, and **cannot be undone**.', 'Name the three areas — **identify business processes, refine metadata and events, build workspaces** — and place a step in the right one (classification → identify; category → refine; type/template → build).'] },
    ],
  },

  {
    id: 'bw-admin-page-volume',
    order: 15,
    title: 'The Business Workspaces administration page and the Business Workspaces volume',
    area: 'workspaces',
    summary: 'What each link on the Business Workspaces admin page does (enable, configure, import, migration, Outlook add-in), what lives in the Business Workspaces volume (categories, classifications, facets, Outlook add-in configuration, perspectives, saved queries, replacement-tag variables, workspace types), the other admin pages you will need, and Smart View vs Classic View configuration.',
    level: 'intermediate',
    minutes: 13,
    domains: ['ba-bw-infra', 'ws-infra', 'ba-bw-fundamentals'],
    modules: ['bw03'],
    tags: ['business workspaces volume', 'administration page', 'outlook add-in', 'saved queries', 'variables for replacement tags', 'workspace types', 'perspectives', 'facets', 'import configuration', 'migration administration'],
    related: ['bw-dependencies-modules', 'bw-rights', 'ba-facets-columns', 'ba-perspective-manager', 'ba-workspace-types'],
    sources: [SRC(3)],
    body: [
      'Business workspace configuration is spread over two places that are easy to mix up: an **administration page** in the Content Server admin pages (system-level switches) and the **Business Workspaces volume** reached from the Enterprise menu (the configuration objects a business administrator works with every day).',
      {
        figure: {
          type: 'compare',
          items: [
            { title: 'Business Workspaces admin page', tone: 'warn', points: ['Content Server Administration ▸ Business Workspaces', 'System administrator territory', 'Enable, configure, import, migrate, Outlook add-in setup'] },
            { title: 'Business Workspaces volume', tone: 'info', points: ['Global Menu Bar ▸ Enterprise ▸ Business Workspaces', 'Business administrator territory', 'Categories, classifications, facets, perspectives, saved queries, variables, workspace types'] },
          ],
        },
        caption: 'Switches versus objects.',
      },
      { h: 'The administration page' },
      { path: ['Content Server Administration', 'Business Workspaces'], ui: 'Classic View (admin pages)' },
      {
        table: {
          head: ['Link', 'What it is for'],
          rows: [
            ['**Enable Business Workspaces**', 'Turns on Business Workspaces together with Template Workspaces (licensed, one-way, restart needed)'],
            ['**Configure Business Workspaces**', 'Feature usage settings for business workspaces'],
            ['**Import Configuration**', 'Imports workspace types, business object types and unique names from a configuration file'],
            ['**Migration Administration**', 'Manages the migration of binders and cases (older Template Workspaces objects) into business workspaces'],
            ['**Set up Outlook Add-in**', 'Downloads the Outlook add-in manifest file and sets tracing for troubleshooting'],
          ],
        },
      },
      { h: 'Other admin pages you will visit' },
      {
        table: {
          head: ['Task', 'Where in the admin pages'],
          rows: [
            ['Open the LiveReports volume (widgets built on reports)', 'LiveReports Administration'],
            ['Object privileges', 'Core System – Feature Configuration ▸ Object Privileges'],
            ['Usage privileges', 'Core System – Feature Configuration ▸ Usage Privileges'],
            ['Enable activity monitoring for the activity feed', 'Pulse Administration ▸ Collaboration Administration'],
            ['Allow templates for the Business Workspace subtype', 'Document Templates Administration'],
            ['Make the workspace link reference field searchable (`ECMWkspLinkRefTypeID`)', 'Search Administration ▸ System Object Volume ▸ Enterprise Data Source folder'],
            ['Simple User Profile, Recently Accessed item types', 'Core System – Server Configuration ▸ Configure Smart View'],
          ],
        },
      },
      { callout: 'tip', text: 'Every admin page has a **Filter** field at the top. Typing “object privileges”, “usage privileges” or “Business Workspaces” is faster than scrolling.' },
      { h: 'The Business Workspaces volume' },
      'The volume is a single entry point to the configuration objects — some are stored in it, others are links to other volumes (the Categories link opens the Categories volume, the Facets link the Facets volume, and so on). Business administrators can open it without extra setup; what they can do inside depends on the permissions and privileges in [[bw-rights]].',
      { path: ['Enterprise', 'Business Workspaces'], ui: 'Classic View' },
      {
        figure: {
          type: 'tree',
          root: {
            label: 'Business Workspaces', icon: 'volume', note: 'Enterprise menu', children: [
              { label: 'Categories', icon: 'category', note: 'business metadata · Data Policies + Category privilege' },
              { label: 'Classifications', icon: 'classification', note: 'trees for templates and folders' },
              { label: 'Facets', icon: 'search', note: 'columns, facets, facet trees · Facets and Columns privilege' },
              { label: 'Outlook Add-in Configuration', icon: 'email', note: 'where emails may be saved' },
              { label: 'Perspectives', icon: 'page', note: 'Smart View layouts · Perspective Manager' },
              { label: 'Saved Queries Volume', icon: 'search', note: 'predefined searches for workspaces' },
              { label: 'Variables for Replacement Tags', icon: 'group', note: 'drive group replacement' },
              { label: 'Workspace Types', icon: 'workspace', note: 'name, location, icons, widgets' },
            ],
          },
        },
        caption: 'Items in the Business Workspaces volume (the exact list depends on the system setup).',
      },
      {
        table: {
          head: ['Item', 'Used to…', 'Requires'],
          rows: [
            ['**Categories**', 'Create the categories and attributes that hold workspace metadata', 'Business Administration – Data Policies usage + Category object privilege'],
            ['**Classifications**', 'Create the classification tree and classifications for workspace types', 'Classification Tree / Classification object privileges'],
            ['**Facets**', 'Create custom columns that show attributes in Smart View widgets, and facets. Business Workspaces ships some columns in a Workspace Columns folder', 'Business Administration – Facets and Columns usage + Column object privilege'],
            ['**Outlook Add-in Configuration**', 'Control how users save Outlook emails into workspaces (browse, search, pick a folder — or force a specific folder or email folder)', 'Business Administration – Business Workspaces usage'],
            ['**Perspectives**', 'Design and store workspace layouts with Perspective Manager (reduced, workspace-focused options)', 'ActiveView – Perspectives Tab usage + ActiveView object privilege'],
            ['**Saved Queries Volume**', 'Hold simple, predefined searches that help users find workspaces quickly', 'Business Administration – Business Workspaces usage'],
            ['**Variables for Replacement Tags**', 'Define variables used for group replacement, to restrict access to a new workspace or parts of it', 'Business Administration – Business Workspaces usage'],
            ['**Workspace Types**', 'The framework for creating workspaces of a kind: how they are named, stored and displayed', 'Business Administration – Business Workspaces usage'],
          ],
        },
      },
      { h: 'The Outlook add-in in one paragraph' },
      'The Business Workspaces Outlook add-in is deployed on Microsoft Exchange or Exchange Online. It lets users file an email from Outlook straight into a business workspace: by default they browse or search for the workspace and choose any folder. An administrator can tighten this so emails must go into a specific folder or a dedicated Email folder of the workspace. The manifest file comes from **Set up Outlook Add-in** on the admin page; the filing rules live in **Outlook Add-in Configuration** in the volume.',
      { h: 'Smart View versus Classic View configuration' },
      'Almost all configuration serves both interfaces. What differs is how the workspace is **laid out**:',
      {
        figure: {
          type: 'matrix',
          cols: ['Smart View', 'Classic View'],
          rows: [
            { label: 'Categories, classifications, root folder', cells: [true, true] },
            { label: 'Workspace type: name pattern, location', cells: [true, true] },
            { label: 'Template, permissions, team roles', cells: [true, true] },
            { label: 'Object and usage privileges', cells: [true, true] },
            { label: 'Perspective (Perspective Manager)', cells: [true, false] },
            { label: 'Widget icon in header and widgets', cells: [true, false] },
            { label: 'Sidebar widgets on the type', cells: ['reused by widgets', true] },
            { label: 'Workspace icon in folder lists', cells: [false, true] },
          ],
        },
        caption: 'Shared foundation, different presentation: perspectives for Smart View, sidebar widgets for Classic View.',
      },
      { callout: 'exam', title: 'What the exam asks', text: ['“Which items are in the Business Workspaces volume?” — **Categories, Classifications, Facets, Perspectives, Saved Queries Volume, Variables for Replacement Tags, Workspace Types** (plus Outlook Add-in Configuration where installed). Templates are **not** there: they live in the **Document Templates** volume.', 'Enabling, importing and migrating are on the **admin page**, not in the volume.'] },
    ],
  },
  {
    id: 'bw-rights',
    order: 16,
    title: 'Rights for business workspace administration: permissions, object privileges and usage privileges',
    area: 'workspaces',
    summary: 'Exactly what a business workspace administrator group needs: Delete-level permissions on which volumes and locations, which object privileges, which usage privileges (Business Workspaces, Move, group-mapping attributes, Regenerate Reference, Perspectives Tab, Warehouse Manager), and the procedures to grant each.',
    level: 'intermediate',
    minutes: 15,
    domains: ['ba-admin-roles', 'ba-bw-fundamentals', 'ws-infra'],
    modules: ['bw03'],
    tags: ['permissions', 'object privileges', 'usage privileges', 'business administrators group', 'move business workspaces', 'regenerate reference', 'edit attributes relevant for group mapping', 'perspectives tab', 'warehouse manager', 'edit restrictions'],
    related: ['bw-admin-page-volume', 'bw-dependencies-modules', 'ba-admin-accounts', 'ba-bw-dependencies'],
    sources: [SRC(3), SRC(16)],
    body: [
      'Three different mechanisms decide whether someone can configure business workspaces. They are checked independently, so a missing one produces a confusing failure (“I can open Workspace Types but cannot save”). Learn them as three layers.',
      {
        figure: {
          type: 'compare',
          items: [
            { title: 'Permissions', tone: 'info', points: ['Per item (ACL)', 'Here: up to **Delete** on configuration volumes and the root location', 'Granted on the item’s Permissions page', 'Apply to This Item & Sub-Items'] },
            { title: 'Object privileges', tone: 'accent', points: ['Who may **create** an item type', 'Category, Classification, Facet, ActiveView…', 'Admin ▸ Object Privileges', 'Only matters once a type is restricted'] },
            { title: 'Usage privileges', tone: 'xp', points: ['Who may **use** a feature', 'Business Workspaces administration, Move, Perspectives Tab…', 'Admin ▸ Usage Privileges', 'Restricted ones need explicit members'] },
          ],
        },
        caption: 'All three must line up. A usage privilege to open a tool does not give permissions on the objects the tool edits.',
      },
      { h: 'Who should hold these rights' },
      'Content Server creates a **Business Administrators** group at installation that already holds the Business Administration usage privileges and can open the Business Workspaces volume. You still have to give it permissions on the volumes and some object privileges. If you want a narrower team, create your own group (for example “BW Management”) and give it only the workspace-related rights — then adding a person to that group is all it takes to make them a workspace administrator.',
      { callout: 'warn', text: 'Grant rights to a **group**, never to individual accounts, and never use the built-in Admin account for day-to-day configuration. (The course grants some usage privileges to a single class account only to save signing in and out — do not copy that in production.)' },
      { h: 'The complete list' },
      {
        figure: {
          type: 'matrix',
          cols: ['Permission (to Delete)', 'Object privilege', 'Usage privilege'],
          rows: [
            { label: 'Root folder location (Enterprise)', cells: [true, false, false] },
            { label: 'Business Workspaces volume + sub-items', cells: [true, false, false] },
            { label: 'Categories volume', cells: [true, 'Category, Category Folder', 'BA – Data Policies'] },
            { label: 'Classifications volume', cells: [true, 'Classification Tree, Classification', false] },
            { label: 'Facets volume', cells: [true, 'Facet Tree, Facet, Facet Folder, Column', 'BA – Facets and Columns'] },
            { label: 'Saved Queries volume', cells: [true, false, 'BA – Business Workspaces'] },
            { label: 'Document Templates volume', cells: [true, false, false] },
            { label: 'Outlook add-in configuration', cells: [true, false, 'BA – Business Workspaces'] },
            { label: 'Perspectives', cells: ['Modify on perspective', 'ActiveView', 'ActiveView – Perspectives Tab'] },
          ],
        },
        caption: 'What the business workspace administrator group needs, area by area (BA = Business Administration).',
      },
      {
        table: {
          head: ['Layer', 'What to grant'],
          rows: [
            ['**Permissions** (all except Edit Permissions, This Item & Sub-Items)', 'The Enterprise location where root folders will be created · Business Workspaces volume with sub-items · Categories volume · Classifications volume · Facets volume · Outlook Add-in configuration · Saved Queries volume · Document Templates volume'],
            ['**Object privileges**', 'Category · Category Folder · Classification Tree · Classification · Custom View · Facet Tree · Facet · Facet Folder · ActiveView · LiveReports and WebReports (only if widgets use them) · Activity Manager (optional, for activity feeds)'],
            ['**Usage privileges**', 'Business Administration – Business Workspaces · Business Workspaces – Move Business Workspaces · Business Workspaces – Edit attributes relevant for group mapping · Business Workspaces – Regenerate Reference · ActiveView – Perspectives Tab · Warehouse Administration – Warehouse Manager (optional, for Transport)'],
          ],
        },
      },
      { h: 'The workspace usage privileges, explained' },
      {
        table: {
          head: ['Usage privilege', 'Allows', 'Typical holder'],
          rows: [
            ['Business Administration – **Business Workspaces**', 'Configure workspace types, roles and teams, saved queries, replacement-tag variables, the Outlook add-in', 'Workspace administrators'],
            ['Business Workspaces – **Move Business Workspaces**', 'Move a workspace to a different folder. Without it, Move is refused', 'Administrators, selected key users'],
            ['Business Workspaces – **Edit attributes relevant for group mapping**', 'Edit attributes that decide which generated groups get access (group replacement). Protects access-driving metadata', 'Only people trusted to change access'],
            ['Business Workspaces – **Regenerate Reference**', 'Generate a new reference number for a workspace, e.g. after attributes used in the reference changed', 'Administrators'],
            ['ActiveView – **Perspectives Tab**', 'Open the Perspective Manager and use Edit Page in Smart View', 'Perspective designers'],
            ['Warehouse Administration – **Warehouse Manager**', 'Use the Transport Warehouse to move configuration to another Content Server instance', 'Only if the group transports configuration'],
          ],
        },
      },
      { h: 'Grant permissions on the volumes' },
      {
        steps: [
          'Sign in as a system administrator (configuration rights are granted by someone who already has them).',
          'Open the item — for example the folder in the Enterprise workspace that will hold the root folders — and choose Functions ▸ **Permissions**.',
          'Click **Grant Access** next to Assigned Access, find the administrator group, tick it, Submit.',
          'Tick every permission up to and including **Delete** — but not **Edit Permissions**.',
          'Set **Apply To** to **This Item & Sub-Items**; choose sub-item options only if the area contains special containers that need it. Click Update and wait — large trees take a while.',
          'Acknowledge with OK, then Done. Repeat for the Categories, Classifications, Facets, Saved Queries and Document Templates volumes (each reachable from Enterprise ▸ Business Workspaces or Enterprise ▸ Document Templates — use the volume link at the top of the page to reach the volume itself).',
        ],
        title: 'Give the group Delete-level permissions',
        ui: 'Classic View',
      },
      { h: 'Grant object privileges' },
      { path: ['Admin', 'Content Server Administration', 'Core System – Feature Configuration', 'Object Privileges'], ui: 'Classic View' },
      {
        steps: [
          'Open **Object Privileges** (type “object privileges” in the admin page Filter).',
          'On the row of the object type, e.g. **Category**, click **Edit Restrictions**.',
          'Search for the administrator group, tick **Add to group**, Submit, then Done.',
          'Repeat for Category Folder, Classification Tree, Classification, Custom View, Facet Tree, Facet, Facet Folder, ActiveView, LiveReports (and WebReports and Activity Manager if needed).',
          'If a type is unrestricted (everyone may create it), there is nothing to add. To restrict it, click **Restrict** and confirm — then add the groups that should keep it.',
        ],
        title: 'Add the group to object privileges',
        ui: 'Classic View (admin pages)',
      },
      { h: 'Grant usage privileges' },
      { path: ['Admin', 'Content Server Administration', 'Core System – Feature Configuration', 'Usage Privileges'], ui: 'Classic View' },
      {
        steps: [
          'Open **Usage Privileges** (Filter: “usage privileges”).',
          'Scroll to **Business Administration – Business Workspaces** and click **Edit Restrictions**.',
          'Search for the group (or user), tick **Add to group**, Submit, Done.',
          'Repeat for Business Workspaces – Move Business Workspaces, – Edit attributes relevant for group mapping and – Regenerate Reference, and for **ActiveView – Perspectives Tab**.',
          'Only if the group will transport configuration: **Warehouse Administration – Warehouse Manager**.',
        ],
        title: 'Add the group to usage privileges',
        ui: 'Classic View (admin pages)',
      },
      {
        figure: {
          type: 'ladder',
          steps: [
            { label: 'Business user', sub: 'role permissions inside workspaces' },
            { label: 'Key user', sub: '+ Move Business Workspaces' },
            { label: 'Perspective designer', sub: '+ Perspectives Tab, ActiveView, Modify on perspective' },
            { label: 'Workspace administrator', sub: '+ BA – Business Workspaces, volume permissions, object privileges' },
            { label: 'Transporter', sub: '+ Warehouse Manager' },
            { label: 'System administrator', sub: 'templates for subtype 848, enabling, admin pages' },
          ],
        },
        caption: 'Grant the lowest rung that does the job.',
      },
      { callout: 'remember', text: 'Restricted privilege = only listed users and groups have it. **Unrestricted** privilege = everyone has it. Adding a group to an unrestricted privilege changes nothing until someone restricts it.' },
      { callout: 'exam', title: 'What the exam asks', text: ['The permission level for the administrator group is **Delete** (everything but Edit Permissions), applied to **This Item & Sub-Items**.', 'Object privileges are about **creating** item types (Category, Classification, Facet, ActiveView…); usage privileges about **using** features (Move Business Workspaces, Regenerate Reference, Perspectives Tab).', '**Appearance** is not on the list of object privileges a workspace administrator needs; **Warehouse Manager** is optional and only for Transport.'] },
    ],
  },

  // ================================================================ CH 16
  {
    id: 'bw-using-classic',
    order: 17,
    title: 'Working in a business workspace in Classic View: items, tasks, forums, filters, columns and search',
    area: 'workspaces',
    summary: 'Day-to-day work in Classic View: adding documents and completing required attributes, adding and completing tasks in the workspace task list, posting to the workspace forum, filtering workspaces with the Content Filter, adding custom columns for workspaces and for their contents, and searching with a search form.',
    level: 'intermediate',
    minutes: 14,
    domains: ['ws-using', 'bu-content', 'ba-facets'],
    modules: ['bw16'],
    tags: ['classic view', 'incomplete items', 'required attributes', 'task list', 'my assignments', 'forum', 'content filter', 'facets', 'custom columns', 'availability', 'search form'],
    related: ['bw-navigate-classic', 'bw-using-smart-view', 'ba-facets-columns', 'ba-search-admin'],
    sources: [SRC(16)],
    body: [
      'Once a workspace exists, the people in its team use it every day. In Classic View all the usual Content Server functions are available inside the workspace, within each person’s permissions. This guide walks through the activities the course practises — with the reasons behind each behaviour.',
      { h: 'Add documents and complete their attributes' },
      'Folders inside a workspace often carry a document category (for example a “Product specification” category with Language, Price level and Product type). Its attributes describe the **documents** — they are different from the workspace’s own category, which describes the **business object**. When required document attributes are empty, Content Server accepts the upload but flags the items as incomplete.',
      {
        figure: {
          type: 'flow',
          steps: [
            { label: 'Drag files into folder', kind: 'start' },
            { label: 'Required attributes empty?', kind: 'decision' },
            { label: 'Yellow band: Show the incomplete items' },
            { label: 'Complete Selected Items', sub: 'Edit Attributes page' },
            { label: 'Submit All Changes ▸ Accept ▸ OK', kind: 'end' },
          ],
        },
        caption: 'Uploading several files at once and filling their required attributes in one go.',
      },
      {
        steps: [
          'Open the folder in the workspace and drag the files from Windows Explorer onto the list.',
          'Click **Show the incomplete items** in the yellow band.',
          'Tick the items (or Select All) and click **Complete Selected Items** — or use **Complete this item** on one row.',
          'On the Edit Attributes page, fill the required fields, then **Submit All Changes**.',
          'Review the Items to be Updated list, click **Accept**, then OK. The documents appear under **Recent Changes** on the right.',
        ],
        title: 'Complete required attributes after a drag-and-drop upload',
        ui: 'Classic View',
      },
      { callout: 'note', text: 'The workspace’s Attributes panel does not change when you fill document attributes — those values belong to the documents. Keep the two levels apart when you design columns and facets.' },
      { h: 'Tasks in the workspace task list' },
      'A template can contain a task list, so every new workspace gets one. Designers usually include a **replacement tag** (such as the product or customer name) in the task list’s name — otherwise every workspace would have a task list with the same name and users could not tell them apart in Personal ▸ Task Lists.',
      {
        tabs: [
          { label: 'Add a task', body: [
            { steps: [
              'Open the workspace’s task list.',
              '**Add Item ▸ Task**.',
              'Enter a Name, choose the person in **Assigned To**, add Comments (instructions).',
              'Click **Add**. The task appears in the list and in the assignee’s assignments.',
            ], title: 'Add a task', ui: 'Classic View' },
          ] },
          { label: 'Complete a task', body: [
            { steps: [
              'As the assignee, open **Personal ▸ Assignments** (or Personal ▸ Task Lists).',
              'Click the task name — you are taken to the task in the workspace’s task list.',
              'Set **Status** to Completed and click **Update Task**.',
              'The task leaves My Assignments; the task list counts it as completed.',
            ], title: 'Complete a task', ui: 'Classic View' },
          ] },
        ],
      },
      { callout: 'tip', text: 'Personal ▸ Task Lists shows, for each task list you are involved in, how many tasks are **Pending** and **Completed** — a fast progress check across all your workspaces.' },
      { h: 'Post to the workspace forum' },
      {
        steps: [
          'Open the workspace’s forum (also created from the template).',
          'Click **New Topic**.',
          'Enter a Title and the Topic text; click Next, then Finish, then Continue.',
          'The topic appears in the forum — and in the Smart View **Discussion** tile of the workspace.',
        ],
        title: 'Start a forum topic',
        ui: 'Classic View',
      },
      { h: 'Filter workspaces with the Content Filter' },
      'Where a facet tree has been made available on the root folder of a workspace type, the left sidebar shows a **Content Filter** with facets built from workspace attributes (for example Department or Sales Rep). With hundreds of workspaces in one folder, a click on a value narrows the list instantly.',
      {
        steps: [
          'Open the root folder of the workspace type.',
          'If the sidebar is hidden, move the mouse to the left edge and click the orange bar/arrow.',
          'Expand the facet you need and click a value: only matching workspaces remain.',
          'Click **Remove all filters** to reset; click the orange bar to close the sidebar.',
        ],
        title: 'Filter workspaces by attribute',
        ui: 'Classic View',
      },
      { h: 'Custom columns: for workspaces and for their contents' },
      {
        figure: {
          type: 'compare',
          items: [
            { title: 'Columns on the root folder', tone: 'info', points: ['Show **workspace** attributes (Sales Rep, Date Sold) next to each workspace', 'Data source: the workspace category', 'Add in the root folder’s Properties ▸ Columns'] },
            { title: 'Columns inside a workspace', tone: 'accent', points: ['Show **document** attributes (Language, Tech level) in a sub-folder', 'Data source: the document category', 'Create column, set availability to that folder, then add it locally'] },
          ],
        },
        caption: 'Two levels of metadata, two sets of columns.',
      },
      {
        tabs: [
          { label: 'Workspace columns on the root folder', body: [
            { steps: [
              'Root folder ▸ Functions ▸ **Properties ▸ Columns**.',
              'Select the custom columns (for example Product Department, Sales Rep) and click the arrow to add them to **Displayed Columns**; reorder with the up/down arrows.',
              'Click **Update**. The values appear next to each workspace.',
              'Columns are inherited by sub-items: in a workspace, Properties ▸ Columns ▸ **Inherited Columns**, clear **Include** to stop them showing inside it.',
            ], title: 'Show workspace attributes as columns', ui: 'Classic View' },
          ] },
          { label: 'Columns for documents inside', body: [
            { steps: [
              'In the Facets volume (Enterprise ▸ Business Workspaces ▸ Facets), **Add Item ▸ Column** for each document attribute; data source Category: <category>:<attribute>, Sortable Yes.',
              'For Smart View: the column’s Properties ▸ **Workspaces** ▸ tick **Used for Sorting and Filtering**.',
              'Column’s Properties ▸ **Availability** ▸ **Only available in specific locations** ▸ Browse to the folder inside the workspace ▸ Update.',
              'That folder ▸ Properties ▸ Columns ▸ **Local Columns**: add them to Displayed Columns, Update.',
            ], title: 'Show document attributes as columns', ui: 'Classic View' },
          ] },
        ],
      },
      { callout: 'warn', text: 'Setting availability on a folder **inside one workspace** only helps that workspace. To have the column in every workspace of the type, put the folder (with the column settings) in the **template**, or make the column available more widely.' },
      { h: 'Search with a search form' },
      'Designers can place a search form (a custom view) on the root folder of a workspace type. Users fill one or more workspace attributes — Product Features, Sales Rep — and click **Search**; the result lists the matching workspaces. In Smart View the same search form can be shown on a workspace tab (a Search Query widget).',
      { callout: 'exam', text: ['Document attributes in a workspace are **not** the workspace’s attributes.', 'Required attributes left empty on a drag-and-drop upload → **Show the incomplete items ▸ Complete**.', 'Task lists in templates should use a **replacement tag** in their name so each workspace’s list is unique.', 'Custom columns need **availability** where they are used, and inherited columns can be excluded per container.'] },
    ],
  },
  {
    id: 'bw-using-smart-view',
    order: 18,
    title: 'Working in a business workspace in Smart View: team, discussion, documents, tasks, comments and insights',
    area: 'workspaces',
    summary: 'Hands-on use of a workspace in Smart View: adding participants to roles and exporting the team list, discussions, the My workspaces tile, adding documents with required metadata, tasks (and why they open Classic View), the Recently Accessed tab, comments and the activity feed, collections, Insights with the Notification Center, the Document Templates tile, and putting workspaces in Recently Accessed.',
    level: 'intermediate',
    minutes: 16,
    domains: ['ws-using', 'bu-collab', 'ws-roles', 'bu-reminders'],
    modules: ['bw16'],
    tags: ['smart view', 'add participants', 'roles', 'csv', 'discussion', 'my workspaces', 'workspaces widget', 'upload', 'task list', 'comments', 'activity feed', 'insights', 'notification center', 'document templates tile', 'recently accessed', 'collection'],
    related: ['bw-navigate-smart-view', 'bw-editing', 'bw-using-classic', 'ws-working-in', 'ba-reminders-notifications'],
    sources: [SRC(16), SRC(2)],
    body: [
      'Smart View is where most people live in their workspaces. What you can do depends on two things: the **perspective** (which tiles and tabs exist) and your **permissions** (what each tile lets you change). A team lead with Edit Attributes sees editable metadata and an Add participants button; a reader with See and See Contents sees the same tiles read-only.',
      {
        figure: {
          type: 'matrix',
          cols: ['Reader (See, See Contents)', 'Contributor (+ Add Items, Modify)', 'Team lead / admin'],
          rows: [
            { label: 'Browse documents, open, download', cells: [true, true, true] },
            { label: 'Reply and ask in Discussion, comment', cells: [true, true, true] },
            { label: 'Upload, rename, add versions', cells: [false, true, true] },
            { label: 'Edit Metadata tile inline', cells: [false, 'needs Edit Attributes', true] },
            { label: 'Add / remove participants', cells: [false, false, true] },
          ],
        },
        caption: 'Same page, different powers. Typical rights per role — your template may differ.',
      },
      { h: 'Team: participants and roles' },
      {
        steps: [
          'Click the **Team** tile header to expand it; the Participants list opens.',
          'Click **Add participants** (+, top left).',
          'Type part of a name in **Enter a name** and pick the user (or group).',
          'In **Assign role**, choose the role — the role decides the permissions.',
          'Click **Save**. The new participant is listed, marked as new.',
          'Open the **Roles** tab and click a role to see its details and members.',
        ],
        title: 'Add a participant to a role',
        ui: 'Smart View',
      },
      {
        ul: [
          '**Sort** any column by clicking its header.',
          '**Export:** tick participants (or roles) and download the list as a **CSV** file — handy for audits and for checking who still needs access.',
          '**Profile:** click a name for contact details (see [[bw-navigate-smart-view]]).',
          '**Remove or change role:** select the participant and use the actions offered — only users allowed to manage the team see them.',
        ],
      },
      { h: 'Discussion' },
      'The Discussion tile shows the workspace forum: reply to a post, **Ask a question**, follow, search. After posting, use the back arrow in the workspace header to return to the Overview. Posts made in Classic View in the workspace forum appear here too.',
      { h: 'My workspaces tile' },
      'A **Workspaces** widget lists business workspaces of **one workspace type** — the type is a required setting of the widget — and its default title is “My workspaces”. Placed on a workspace’s perspective or on a landing page, it gives a jump list to, say, all product-development workspaces.',
      { h: 'Documents: add, view, favorite' },
      {
        steps: [
          'Open the **Documents** tab (a default tab of every workspace perspective) and the target folder.',
          'Drag a file onto the page — or **+ (Add item) ▸ Document**.',
          'The **Upload file** dialog shows the folder’s category: fill the required attributes (drop-down values, dates…).',
          'Click **Upload**. The document is listed once saved.',
          'Click the document to open it or its properties; use the back arrow to return.',
          'Click the **star** on a row to add it to Favorites (keep the default name, Add). Use the up-level icon beside Filter to go back up.',
        ],
        title: 'Add a document with required metadata',
        ui: 'Smart View',
      },
      { h: 'Tasks' },
      'Task lists are Classic View objects. Clicking a task list in Smart View opens it **in Classic View**, where you use Add Item ▸ Task as usual (Name, Assigned To, Comments, Add). Assignees complete tasks from Personal ▸ Assignments or Personal ▸ Task Lists (Status ▸ Completed ▸ Update Task). Then go back with the breadcrumb and **My Account ▸ Smart View**.',
      {
        figure: {
          type: 'flow',
          steps: [
            { label: 'Click task list in Smart View', kind: 'start' },
            { label: 'Opens in Classic View', kind: 'system' },
            { label: 'Add Item ▸ Task', sub: 'name, assignee, comments' },
            { label: 'Assignee completes it', sub: 'Personal ▸ Assignments', kind: 'actor' },
            { label: 'Back to Smart View', sub: 'My Account ▸ Smart View', kind: 'end' },
          ],
        },
        caption: 'The task round trip.',
      },
      { h: 'Extra tabs: Recently Accessed and Search Query' },
      'A designer can add tabs to the workspace perspective. A **Recently Accessed** tab shows the Recently Accessed widget full width; a **Search Query** tab can hold a search form for workspace attributes. Note that activity messages in the header appear only on the **Overview** tab.',
      { h: 'Comments and the activity feed' },
      {
        steps: [
          'Click **Comments** (to the right of the tabs).',
          'Read the activity messages — for example attribute changes recorded by the activity manager — and other comments.',
          'Type a post and click **Post**, then Close.',
          'After a few seconds a **New Updates** button appears at the top right; click it (or refresh) to see the new entry in the feed.',
        ],
        title: 'Post a comment on the workspace',
        ui: 'Smart View',
      },
      { callout: 'tip', text: 'Business workspaces can be added to a **Collection** like any item: select the workspace(s) in a browse list and choose **Collect**.' },
      { h: 'Insights and the Notification Center' },
      'The activity feed shows events while you look at the workspace. To be **told** about changes, switch on **Insights** for that workspace; events then reach your **Notification Center**.',
      {
        figure: {
          type: 'timeline',
          items: [
            { when: 'Now', label: 'Enable Insights', sub: 'button right of Add Favorite in the header' },
            { when: '+ ~1 min', label: 'Activity feed updates', sub: 'new uploads appear on Overview' },
            { when: '+ a few min', label: 'Notification badge', sub: 'red count on the Notification Center icon' },
            { when: 'Any time', label: 'Settings', sub: 'list of workspaces with insights on' },
          ],
        },
        caption: 'Notifications are gathered by a background process, so they arrive with a delay (minutes in the course environment).',
      },
      {
        steps: [
          'On the workspace Overview, click **Insights** (next to the Add Favorite star) to enable insights.',
          'Make a change, for example upload two files to a folder.',
          'Watch the activity feed on Overview (refresh if needed).',
          'When the **Notification Center** icon shows a count, open it and click a message to see all notifications.',
          'Open the Notification Center **Settings** to see — and manage — the workspaces you get insights for.',
        ],
        title: 'Get notified about a workspace',
        ui: 'Smart View',
      },
      { h: 'Content Server Document Templates tile' },
      'A perspective can show the **Content Server Document Templates** tile: a window onto the Document Templates volume for designers. From it they can view, edit and create document (and workspace) templates in a folder where this is configured — for example to add a category to a template without leaving Smart View. Templates can also be set up so a workspace is created **inside** another workspace; in such a hierarchy the roles are hierarchical too, so people with access to the parent usually also reach the child.',
      { h: 'Put workspaces in everyone’s Recently Accessed' },
      'By default the Recently Accessed tile on the landing page may not list business workspaces. An administrator chooses which object types it records:',
      { path: ['Content Server Administration', 'Core System – Server Configuration', 'Smart View (Configure Smart View)', 'Recently Accessed Items'], ui: 'Classic View (admin pages)' },
      {
        steps: [
          'Open **Configure Smart View** and find the **Recently Accessed Items** section.',
          'Click the pencil to edit the object types shown.',
          'Select **Business Workspace** and save.',
          'Users’ landing pages now list the workspaces they opened recently.',
        ],
        title: 'Show workspaces in the Recently Accessed tile',
        ui: 'Classic View (admin pages)',
      },
      { h: 'Beyond Content Server' },
      'With **Extended ECM for Microsoft 365** (named Office 365 in the 22.1 course), the same workspace — header, Team, Metadata, Documents — opens inside Microsoft Teams and SharePoint Online. Extra widgets connect a workspace to a Microsoft team: **Calendar**, **Conversations** (shared inbox), **Team Notebook** and an **Office 365 information** widget for managing the connection. Workspaces connected to SAP or Salesforce objects can be shown there the same way.',
      { callout: 'exam', title: 'What the exam asks', text: ['Participants are added **to a role** — the role carries the permissions. Team lists can be exported to **CSV**.', 'The Workspaces (“My workspaces”) widget needs a **workspace type**.', 'Tasks are added in **Classic View** even when you start from Smart View.', '**Insights** feed the **Notification Center**; the activity feed only shows events while you look.', 'Workspaces appear in Recently Accessed only if the **Business Workspace** type is selected in Configure Smart View.'] },
    ],
  },

  {
    id: 'bw-editing',
    order: 19,
    title: 'Editing business workspaces: metadata, name, description, team, categories, location and layout',
    area: 'workspaces',
    summary: 'Everything you can change on an existing workspace and how: metadata in the Metadata tile and Properties, name and the name pattern, description and header, icon, team and roles, categories, copy and move (and what happens to roles), reference numbers, perspectives with Edit Page — and what cannot be changed after creation, and why.',
    level: 'intermediate',
    minutes: 18,
    domains: ['ws-using', 'ws-roles', 'bu-perspectives', 'ba-roles'],
    modules: ['bw16'],
    tags: ['edit workspace', 'metadata', 'rename', 'name pattern', 'description', 'workspace icon', 'participants', 'roles', 'add category', 'move workspace', 'copy workspace', 'regenerate reference', 'edit page', 'perspective', 'local perspective'],
    related: ['bw-using-smart-view', 'bw-navigate-smart-view', 'bw-rights', 'ba-roles-permissions', 'ba-perspective-manager', 'ws-troubleshooting'],
    sources: [SRC(16), SRC(3), 'Content Server Business Workspaces (2-0108, 22.1) — Ch. 4, 9, 11 and 15 (name patterns, reference attributes, locations, roles on move, header options)'],
    body: [
      'A workspace is created from configuration, but it is not frozen. Business data changes, people join and leave, a workspace ends up in the wrong place, the page needs a new tile. Editing a workspace works much like editing a folder — with a few workspace-specific rules that come from how workspaces are built. Know those rules and you will never be surprised.',
      {
        figure: {
          type: 'hub',
          center: 'Existing workspace',
          items: [
            { label: 'Metadata', sub: 'Metadata tile, Properties ▸ Categories' },
            { label: 'Name', sub: 'pattern or Rename' },
            { label: 'Description', sub: 'Properties ▸ General; header' },
            { label: 'Icon', sub: 'workspace icon' },
            { label: 'Team', sub: 'participants in roles' },
            { label: 'Categories', sub: 'add or remove' },
            { label: 'Location', sub: 'copy / move' },
            { label: 'Layout', sub: 'perspective' },
          ],
        },
        caption: 'What can be edited on an existing workspace.',
      },
      { h: 'The full list of edits' },
      {
        table: {
          head: ['On the workspace itself', 'Inside / around the workspace'],
          rows: [
            ['Change attribute values', 'Add, rename, move and delete folders and documents'],
            ['Add or remove categories', 'Change the workspace icon'],
            ['Copy its link · share it by email', 'Add comments'],
            ['Rename it', 'Mark it (or its items) as a favorite'],
            ['Copy or move it to another folder', 'Manage the team: participants and roles'],
            ['Delete it', 'Edit the perspective of a container (Edit Page)'],
          ],
        },
        caption: 'Each action still needs the matching permission (Modify, Edit Attributes, Delete…) or privilege.',
      },
      { h: '1. Metadata (attribute values)' },
      {
        tabs: [
          { label: 'Smart View', body: [
            { steps: [
              'Open the workspace Overview.',
              'In the **Metadata** tile, click the field, choose or type the new value, press Enter.',
              'Alternatively: Inline Action Bar (in the parent folder) or the header menu ▸ **Properties** ▸ the category section, edit, Save.',
            ], title: 'Edit attributes', ui: 'Smart View' },
          ] },
          { label: 'Classic View', body: [
            { steps: [
              'Workspace Functions menu ▸ **Properties ▸ Categories**.',
              'Edit the values of the workspace category.',
              'Click **Update**. The Attributes panel on the right shows the new values.',
            ], title: 'Edit attributes', ui: 'Classic View' },
          ] },
        ],
      },
      {
        ul: [
          'You need **Edit Attributes** on the workspace.',
          'If the attribute is used for **group replacement** (it decides which generated groups get access), you also need the usage privilege **Business Workspaces – Edit attributes relevant for group mapping**. This protects access-driving data from casual edits.',
          'Changing an attribute that defines the **location** (a location “from category attribute” or a sub-path) does **not** move the workspace. Move it yourself if it should live elsewhere.',
          'If an **activity manager** watches the category, the change is posted to the workspace activity feed.',
        ],
      },
      { h: '2. The name' },
      'Workspace names are normally generated from the workspace type’s **name pattern** — text plus attribute values, such as “[Product ID] - [Product label]”. For workspaces without a leading application, the type must have **Generate names also for workspaces without business object** switched on for the pattern to apply.',
      {
        figure: {
          type: 'flow',
          steps: [
            { label: 'Wrong name?', kind: 'start' },
            { label: 'Is the cause a wrong attribute value?', kind: 'decision' },
            { label: 'Fix the attribute', sub: 'the pattern is the source of truth' },
            { label: 'Check the name', sub: 'regenerated or not, per release/config' },
            { label: 'Rename only for one-off exceptions', kind: 'end' },
          ],
        },
        caption: 'Fix the data, not just the label.',
      },
      {
        steps: [
          'Smart View: hover the workspace in its parent folder ▸ **Rename** (or … ▸ Rename), or open Properties ▸ General and edit Name.',
          'Classic View: Functions ▸ **Rename**, or Properties ▸ General ▸ Name ▸ Update.',
          'Needs **Modify** permission on the workspace.',
        ],
        title: 'Rename a workspace',
      },
      { callout: 'warn', title: 'Pattern versus manual names', text: ['A manual rename breaks the link between name and data. Depending on release and configuration, a later metadata update may **regenerate** the name from the pattern and overwrite your manual name — test this on your own system before relying on manual names.', 'If the name is built from a **reference number** (Text: Reference attribute) and the reference schema in the category is changed later, upgrading the category changes only the attribute — the generated workspace **name does not change**. A user with **Business Workspaces – Regenerate Reference** can generate a new reference number when the attributes it uses have changed.', 'With Extended ECM, replacing the linked business object gives the workspace a **new title**, but does not move it.'] },
      { h: '3. Description and header' },
      'The description is a normal node property. The workspace **Header** widget shows it by default — its description option is the placeholder `{description}` — so editing the description changes what everybody sees under the workspace name. Designers can replace that with other replacement tags (for example attribute values) in the perspective.',
      {
        tabs: [
          { label: 'Smart View', body: [
            { steps: ['Open the workspace’s **Properties** (Inline Action Bar in the parent folder, or the workspace menu).', 'On the **General** tab, click the Description and type the new text.', 'Save / press Enter. Return to the workspace — the header shows it if the header uses {description}.'], title: 'Edit the description', ui: 'Smart View' },
          ] },
          { label: 'Classic View', body: [
            { steps: ['Workspace Functions ▸ **Properties ▸ General**.', 'Edit the **Description** field.', 'Click **Update**.'], title: 'Edit the description', ui: 'Classic View' },
          ] },
        ],
      },
      { h: '4. Icon' },
      'Two kinds of icon exist. The **type icons** (workspace icon for Classic View lists, widget icon for the Smart View header and widgets) are set once on the workspace type and apply to every workspace of the type. An individual workspace’s icon can also be changed by a user with sufficient rights from the workspace itself (the course lists “changing the workspace icon” among the edits available inside a workspace) — useful for a logo or product picture. Changing the type icon is an administrator task in Workspace Types.',
      { h: '5. Team and roles' },
      {
        steps: [
          'Expand the **Team** tile ▸ **Add participants**: pick people or groups and the role, Save.',
          'To change someone’s role or remove them, select the participant and use the actions offered.',
          'Role details (Roles tab) show what each role is; the **team lead** role can manage participants without being an administrator.',
        ],
        title: 'Change who works on the workspace',
        ui: 'Smart View',
      },
      { callout: 'tip', text: 'Always change access by changing **participants**, never by editing the permissions of folders inside one workspace. Roles and their permissions come from the template; editing ACLs by hand creates workspaces that no longer behave like their siblings.' },
      { h: '6. Categories' },
      'A workspace carries its workspace category from the template, but you can add more — for example a product specification category to a template or a workspace.',
      {
        steps: [
          'Hover the workspace (or template) ▸ Inline Action Bar ▸ **Properties**.',
          'Click **Add a new category** (top right of the properties page).',
          'Choose the category in the Select a Category dialog ▸ **Add**.',
          'Fill the attributes in the Add Category dialog ▸ **Add**.',
          'Use the back arrow in the header to return.',
        ],
        title: 'Add a category to a workspace',
        ui: 'Smart View',
      },
      { callout: 'warn', text: 'Do not remove the **workspace type’s category** from a workspace: the name pattern, header, columns, facets and search for that type depend on it.' },
      { h: '7. Copy and move' },
      {
        figure: {
          type: 'compare',
          items: [
            { title: 'Move', tone: 'warn', points: ['Needs the usage privilege **Move Business Workspaces** (plus permissions on source and target)', 'Inherited team roles and permissions are **removed**', 'Roles assigned directly on the workspace **stay**', 'If the target has team roles (e.g. another workspace) they are copied in only when “Always inherit the permissions from target destination” is on'] },
            { title: 'Copy', tone: 'info', points: ['Only if the workspace type allows **workspace copying**', 'Creates a new workspace from an existing one', 'Check name and metadata of the copy afterwards'] },
          ],
        },
        caption: 'Moving changes access — check the team afterwards. Details: [[ba-roles-permissions]].',
      },
      { h: '8. The layout: editing perspectives' },
      'Two tools change Smart View pages. The **Perspective Manager** edits global perspectives — including the workspace perspectives of a workspace type ([[ba-perspective-manager]]). **Edit Page** edits the perspective of the **current container or landing page** directly in Smart View, creating or changing a local perspective for that one place.',
      {
        table: {
          head: ['To see Edit Page in the Profile menu you need', 'Why'],
          rows: [
            ['Usage privilege **ActiveView – Perspectives Tab**', 'Access to perspective editing'],
            ['Object privilege **ActiveView**', 'A perspective is an ActiveView object'],
            ['**Modify** permission on the perspective in the Perspectives volume', 'Permission on the object being changed'],
          ],
        },
      },
      {
        steps: [
          'Go to the container (for example a folder that holds workspaces).',
          'Profile menu (top right) ▸ **Edit page**. Widen the window until the “Drag and Drop widgets here” areas show.',
          'Click **Add widget** (top left), expand **Standard Widgets**.',
          'Drag a widget, e.g. Recently Accessed or Favorites, onto a drop area.',
          'Click **Save**. “Perspective has been updated successfully” appears.',
          'Check as another user: each user sees their own data in the tiles (their own favorites); other folders are unchanged.',
        ],
        title: 'Add a widget to a container page',
        ui: 'Smart View',
      },
      { callout: 'note', text: 'Edit Page does **not** support editing **Business Workspaces widgets**, the Content Intelligence widget carousel, or custom widgets whose options use custom property types. Workspace pages themselves are therefore designed in Perspective Manager.' },
      { h: 'What you cannot change after creation — and why' },
      {
        table: {
          head: ['Cannot (or should not) change', 'Why', 'What to do instead'],
          rows: [
            ['The **template** the workspace came from', 'The template was copied once at creation; there is no live link', 'Change the template for future workspaces; bring existing ones in line deliberately (bulk change)'],
            ['The **workspace type**', 'The type governed creation (name, location, perspective rules); there is no “change type” action', 'Create a workspace of the right type and move the content into it'],
            ['Automatic **re-filing** when location attributes change', 'Location is worked out at creation only', 'Move it (needs Move Business Workspaces)'],
            ['The generated name after a **reference schema** change', 'Only the attribute is updated, not the name', 'Regenerate the reference / correct the name'],
            ['**Copying**, if the type forbids it', 'Workspace Copying is a type setting', 'Ask the administrator, or create a new workspace'],
            ['Workspace widgets with **Edit Page**', 'Not supported by Edit Page', 'Use Perspective Manager'],
          ],
        },
      },
      { callout: 'exam', title: 'What the exam asks', text: ['Edit Page needs **Perspectives Tab** (usage) + **ActiveView** (object) + **Modify** on the perspective.', 'Moving needs **Move Business Workspaces**; inherited roles are removed, directly assigned roles stay.', 'Editing access-driving attributes needs **Edit attributes relevant for group mapping**; a new reference number needs **Regenerate Reference**.', 'Template changes never reach existing workspaces; changing a location attribute never moves a workspace.'] },
    ],
  },
];
