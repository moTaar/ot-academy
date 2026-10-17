'use strict';
// Business Workspaces track: how workspaces work, and a hands-on lab that
// configures and builds one in the learner's own Content Server. The lab is
// also the "Business workspaces lab" practice path (practice-paths.js).
// Steps the REST API can see are checked live; configuration screens it can't
// see are practice missions. All text is original to this trainer.

const SRC = 'OpenText Extended ECM business workspace documentation; course 2-0108 outline';

module.exports = [
  // ------------------------------------------------------------------ WS01
  {
    id: 'ws01', track: 'workspaces', order: 30, title: 'How business workspaces work', source: SRC, feature: 'businessWorkspaces',
    domains: ['ws-concepts'],
    summary: 'What a business workspace is made of, how one is born, and what your server already has.',
    lesson: [
      'A business workspace collects everything about one business object — a customer, contract, project or employee — in one container with the object\'s data in its header, a team with roles, and a standard folder structure copied from a template. It is the central idea of OpenText Extended ECM, and it works without any business application too.',
      {
        figure: {
          type: 'hub',
          center: 'Business workspace',
          items: [
            { label: 'Workspace type', sub: 'name, location, icon' },
            { label: 'Template', sub: 'content, roles' },
            { label: 'Category', sub: 'business data' },
            { label: 'Classification', sub: 'where templates are offered' },
            { label: 'Perspective', sub: 'Smart View layout' },
            { label: 'Business object', sub: 'optional ERP/CRM link' },
          ],
        },
        caption: 'The parts of a workspace.',
      },
      'Every workspace is created the same way, whoever asks for it: a template of the requested type is chosen, the business data is collected, the type works out the name and the location, the template is copied — folders, roles, permissions and categories — and, when an integration is involved, the business object is linked.',
      {
        figure: {
          type: 'flow',
          steps: [{ label: 'Request', kind: 'start' }, 'Pick template', 'Collect data', { label: 'Name & location', kind: 'system' }, { label: 'Copy template', kind: 'system' }, { label: 'Ready', kind: 'end' }],
        },
      },
      { callout: 'remember', text: ['Name and location come from the **workspace type**; content and roles from the **template**; which templates are offered where from the **classification**; the page layout from the **perspective**.'] },
      'Read the full picture in the handbook: [[ws-how-they-work]].',
    ],
    keyPoints: [
      'A business workspace is a container (subtype 848) created from a template.',
      'The workspace type decides name and location; the template decides content and roles.',
      'Classifications decide where a template is offered.',
      'With an integration, workspaces are linked to business objects (late or early); without one they still work.',
      'Template changes only affect workspaces created afterwards.',
    ],
    missions: [
      {
        id: 'ws01-explore', type: 'investigate', title: 'Count the workspace types on your server', xp: 20,
        brief: 'Before building anything, see what the server already has. Every kind of business workspace is a workspace type.',
        steps: [
          'Open Enterprise ▸ Business Workspaces ▸ Workspace Types (the Business Workspaces volume) — or ask your administrator.',
          'Count the workspace types listed.',
          'Type the number below.',
        ],
        hints: ['If you can\'t open the administration pages, the Smart View “+” menu of a workspace location also shows the types you may create there — but only those offered in that folder.'],
        inputs: [{ key: 'types', label: 'Number of workspace types', placeholder: 'e.g. 4' }],
        checks: [{ kind: 'answer', input: 'types', source: 'bwTypes.count', compare: 'number', label: 'Number of business workspace types' }],
      },
      {
        id: 'ws01-anatomy', type: 'practice', title: 'Take a workspace apart', xp: 15,
        brief: 'Open an existing business workspace and identify each part it was built from.',
        steps: [
          'Open any business workspace on your server in Smart View.',
          'Find: its type (the icon and the Properties), its category data (header), its team and roles, its folder structure, and its perspective.',
          'In the Classic UI, look at the same workspace\'s Properties ▸ Categories and Classifications.',
        ],
        reflection: 'For the workspace you opened, name its type, the attributes in its header, two of its roles, and which part of the configuration each of those came from.',
        minWords: 30,
      },
      {
        id: 'ws01-quiz', type: 'quiz', title: 'Knowledge check: how workspaces work', xp: 25,
        questions: [
          { q: 'Which configuration object decides the name of a new business workspace?', options: ['The template', 'The workspace type\'s name pattern', 'The perspective', 'The classification'], answer: 1, explain: 'The workspace type holds the name pattern, built from category attributes or business object properties.' },
          { q: 'Users can\'t see the Customer template in the Add menu of the Customers folder. What links a folder to the templates offered there?', options: ['Matching classifications on the folder and the template', 'The folder\'s category', 'The perspective rule', 'The Recycle Bin settings'], answer: 0, explain: 'Templates are offered where their classification matches the folder\'s.' },
          { q: 'An administrator adds a folder to a workspace template. What happens to the 300 workspaces created from it last year?', options: ['They get the folder overnight', 'Nothing — templates are copied only at creation', 'They are recreated', 'They become read-only'], answer: 1, explain: 'A template is a master copy used at creation; existing workspaces need a separate bulk change.' },
          { q: 'What is a “late” business workspace?', options: ['One created after its business object exists, from that object', 'One created after office hours', 'One whose template is outdated', 'One that was moved'], answer: 0, explain: 'Late workspaces come from an existing business object; early ones are created first and linked later.' },
          { q: 'Where do the folders, roles and default categories of a new workspace come from?', options: ['The workspace type', 'The template', 'The location folder', 'OTDS'], answer: 1, explain: 'The template is copied: content, roles, permissions and categories.' },
          { q: 'Which statement is true without any ERP or CRM integration?', options: ['Business workspaces cannot be used', 'Workspaces work, with metadata typed into their category', 'Only projects can be used', 'Workspaces have no roles'], answer: 1, explain: 'Unconnected (Connected Workspaces) setups use the same types, templates and roles; the data is entered in Content Server.' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ WS02
  {
    id: 'ws02', track: 'workspaces', order: 31, title: 'Lab 1 — Build the building blocks', source: SRC, feature: 'businessWorkspaces',
    domains: ['ws-infra'],
    summary: 'Create the category, classification and location folder a workspace type depends on.',
    lesson: [
      'A workspace type refers to a category (for its name pattern and location path), and its templates refer to a classification. Those objects must exist first. In this lab you create a small, safe set of building blocks for a **Training Customer** workspace — on a training or sandbox server, never in production.',
      {
        figure: {
          type: 'flow',
          steps: [
            { label: 'Category', sub: '“Training Customer” in the Categories volume' },
            { label: 'Classification', sub: '“Training Workspaces ▸ Training Customer”' },
            { label: 'Location', sub: '“Training Customers” in your sandbox' },
            { label: 'Next lab: type & template', kind: 'end' },
          ],
        },
        caption: 'What you build in this lab, in order.',
      },
      {
        table: {
          head: ['Object', 'Name', 'Where', 'Why first'],
          rows: [
            ['Category', 'Training Customer', 'Categories volume (top level)', 'The type\'s name pattern needs its attributes'],
            ['Classification tree', 'Training Workspaces', 'Classifications volume', 'Templates are offered by classification'],
            ['Classification', 'Training Customer', 'inside that tree', 'Given to the template and the location folder'],
            ['Location folder', 'Training Customers', 'your sandbox folder', 'Where your workspaces will be created'],
          ],
        },
      },
      { callout: 'warn', text: ['These steps need rights on the Categories and Classifications volumes. Use a training server. If you don\'t have the rights, ask an administrator to do them with you — or read along and skip the steps.'] },
      'Step-by-step help: [[ws-setup-roadmap]], [[ba-categories-metadata]], [[ba-classifications]].',
    ],
    keyPoints: [
      'Build bottom-up: category and classification before the workspace type and template.',
      'Attributes used in names or paths should be mandatory and controlled.',
      'Give the location folder the same classification as the template.',
      'Generated sub-folders inherit the location folder\'s permissions.',
    ],
    missions: [
      {
        id: 'ws02-category', type: 'hands-on', title: 'Create the “Training Customer” category', xp: 30,
        brief: 'The category holds each workspace\'s business data and feeds its name.',
        steps: [
          'Open the Categories volume (Enterprise ▸ Categories).',
          'Add Item ▸ Category. Name it exactly “Training Customer”, at the top level of the volume.',
          'Add attributes: Customer Number (text, required), Customer Name (text, required), Region (text, pop-up list: EMEA, Americas, APAC).',
          'Submit.',
        ],
        hints: ['Create it directly in the Categories volume, not in a category folder — the check looks at the top level.', 'The name must match: “Training Customer”.'],
        checks: [{ kind: 'child', parent: 'categoriesVolume', name: 'Training Customer', types: [131], typeName: '^category$', saveAs: 'wsCategory', label: 'Category “Training Customer” in the Categories volume' }],
        open: 'categoriesVolume',
      },
      {
        id: 'ws02-classification', type: 'investigate', title: 'Create a classification tree for templates', xp: 25,
        brief: 'Templates are offered where their classification matches the folder\'s. Give your training templates their own tree.',
        steps: [
          'Open the Classifications volume (Enterprise ▸ Classifications).',
          'Add a classification tree named “Training Workspaces”, and inside it a classification “Training Customer”.',
          'Type the name of the tree you created below.',
        ],
        inputs: [{ key: 'tree', label: 'Name of your classification tree', placeholder: 'Training Workspaces' }],
        checks: [{ kind: 'answer', input: 'tree', source: 'classificationTrees', compare: 'contains', label: 'Classification tree exists at the top of the Classifications volume' }],
      },
      {
        id: 'ws02-location', type: 'hands-on', title: 'Create the location folder', xp: 30, requires: ['u01-sandbox'],
        brief: 'Workspaces created from the business application or the API go to the workspace type\'s location. Yours will be in your sandbox.',
        steps: [
          'Open your sandbox “{{sandbox}}”.',
          'Create a folder named “Training Customers”.',
          'Classic UI: Functions ▸ Properties ▸ Classifications — add the classification Training Workspaces ▸ Training Customer, so the template you build next is offered here.',
        ],
        checks: [{ kind: 'child', parent: 'sandbox', name: 'Training Customers', types: [0], saveAs: 'wsLocation', label: 'Folder “Training Customers” in your sandbox' }],
        open: 'sandbox',
      },
      {
        id: 'ws02-quiz', type: 'quiz', title: 'Knowledge check: building blocks', xp: 25,
        questions: [
          { q: 'Why create the category before the workspace type?', options: ['The type\'s name pattern and location path use its attributes', 'Categories can only be created by the type', 'The perspective needs it', 'It is alphabetical'], answer: 0, explain: 'The type refers to category attributes, so the category must exist first.' },
          { q: 'An attribute used in the name pattern is optional and often left empty. What happens?', options: ['Names come out incomplete or blank', 'Creation always fails', 'The workspace moves', 'Nothing'], answer: 0, explain: 'Pattern parts from empty attributes are blank — make them mandatory.' },
          { q: 'What must the location folder share with the template so users are offered the template there?', options: ['Its category', 'Its classification', 'Its owner', 'Its nickname'], answer: 1, explain: 'Matching classifications make the template available in that folder.' },
          { q: 'Sub-folders generated under a workspace location get their permissions how?', options: ['From the workspace type', 'They inherit from the location folder', 'From OTDS', 'They have none'], answer: 1, explain: 'Generated sub-folders inherit from their parent like any new item.' },
          { q: 'Where should you build this configuration first?', options: ['Directly in production', 'On a development or training system, then transport it', 'In your Personal Workspace only', 'In the Recycle Bin'], answer: 1, explain: 'Configure and test on development, then move it with Transport.' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ WS03
  {
    id: 'ws03', track: 'workspaces', order: 32, title: 'Lab 2 — Workspace type, template and roles', source: SRC, feature: 'businessWorkspaces',
    domains: ['ws-types', 'ws-roles'],
    summary: 'Configure the Training Customer workspace type and its template, content and roles.',
    lesson: [
      'With the building blocks in place you can configure the workspace itself: a **workspace type** that names and places workspaces, and a **template** that gives each new workspace its content and team. These screens are in the administration pages and the Document Templates volume; the REST API can\'t see most of them, so you describe what you did and the trainer checks the result in the next lab — when you create a workspace from it.',
      {
        figure: {
          type: 'tree',
          root: {
            label: 'Training Customer – Standard', icon: 'template', note: 'type Training Customer · class. Training Customer', children: [
              { label: '01 Contracts', icon: 'folder' },
              { label: '02 Correspondence', icon: 'email', note: 'email folder' },
              { label: '03 Orders', icon: 'folder' },
              { label: 'Roles', icon: 'group', note: 'Account Manager · Sales Team · Readers' },
            ],
          },
        },
        caption: 'The template you build.',
      },
      {
        steps: [
          'Enterprise ▸ Business Workspaces ▸ Workspace Types ▸ Add Item ▸ Workspace Type: name **Training Customer**, an icon.',
          'Name pattern: Customer Number – Customer Name (from the Training Customer category).',
          'Location: your sandbox folder “Training Customers”.',
          'Save.',
        ],
        title: 'Workspace type',
      },
      {
        steps: [
          'Enterprise ▸ Document Templates ▸ Add Item ▸ the workspace template item.',
          'Workspace type: Training Customer · classification: Training Workspaces ▸ Training Customer · name: “Training Customer – Standard”.',
          'Add the Training Customer category.',
          'Open the template; add folders 01 Contracts, 02 Correspondence, 03 Orders.',
          'Define roles: Account Manager (full control), Sales Team (add and modify), Readers (see contents). Add yourself as default Account Manager.',
        ],
        title: 'Template, content and roles',
      },
      { callout: 'exam', text: ['Template roles vs workspace roles: the template defines which roles exist and what they may do; each workspace then gets its own participants in those roles. Template-specific roles (such as a template administrator) only govern the template itself.'] },
      'Every setting explained: [[ba-workspace-types]], [[ba-workspace-templates]], [[ba-template-content]], [[ba-roles-permissions]].',
    ],
    keyPoints: [
      'The type names and places; the template fills and staffs.',
      'A template needs a type, a classification and a category.',
      'Define roles in the template; add people per workspace.',
      'Test every change by creating a new workspace.',
    ],
    missions: [
      {
        id: 'ws03-type', type: 'practice', title: 'Configure the “Training Customer” workspace type', xp: 20, requires: ['ws02-category', 'ws02-location'],
        brief: 'The type decides how every Training Customer workspace is named and where it goes.',
        steps: [
          'Open the workspace type administration and add the type “Training Customer”.',
          'Name pattern: Customer Number – Customer Name.',
          'Location: the “Training Customers” folder in your sandbox.',
          'Save, and note any other settings you saw (indexing, related types, icon).',
        ],
        reflection: 'Describe the settings you chose for the type (name pattern, location, anything else), and what would go wrong if Customer Number were optional.',
        minWords: 30,
      },
      {
        id: 'ws03-template', type: 'practice', title: 'Build the template and its content', xp: 20, requires: ['ws03-type'],
        brief: 'The template is the master copy of every new workspace.',
        steps: [
          'Create “Training Customer – Standard” in the Document Templates volume with type Training Customer and classification Training Workspaces ▸ Training Customer.',
          'Add the Training Customer category to it.',
          'Inside the template, add the folders 01 Contracts, 02 Correspondence and 03 Orders.',
        ],
        reflection: 'List what you put in the template and explain which of those things a workspace created from it will get, and which it won\'t (for example its name or location).',
        minWords: 30,
      },
      {
        id: 'ws03-roles', type: 'practice', title: 'Define the team roles', xp: 20, requires: ['ws03-template'],
        brief: 'Roles turn “who works on this customer” into permissions.',
        steps: [
          'In the template, define the roles Account Manager, Sales Team and Readers.',
          'Give each role its permissions on the template and its folders (full control / add & modify / see contents).',
          'Add yourself as the default participant of Account Manager.',
        ],
        reflection: 'Explain the permissions you gave each role, and why managing access by role is better than editing folder permissions in each workspace.',
        minWords: 30,
      },
      {
        id: 'ws03-count', type: 'investigate', title: 'Confirm the new type exists', xp: 20, requires: ['ws03-type'],
        steps: ['Open the list of workspace types again.', 'Type how many workspace types there are now, including yours.'],
        inputs: [{ key: 'types', label: 'Number of workspace types now', placeholder: 'e.g. 5' }],
        checks: [{ kind: 'answer', input: 'types', source: 'bwTypes.count', compare: 'number', label: 'Number of business workspace types' }],
      },
      {
        id: 'ws03-quiz', type: 'quiz', title: 'Knowledge check: types, templates and roles', xp: 25,
        questions: [
          { q: 'Which three things does every workspace template need?', options: ['A workspace type, a classification and a category', 'A perspective, a workflow and a nickname', 'An owner group, a facet and a column', 'A LiveReport, a form and a channel'], answer: 0, explain: 'Type, classification and category make a usable template; content and roles make it useful.' },
          { q: 'Where are workspace templates stored?', options: ['Document Templates volume', 'Personal Workspace', 'Categories volume', 'Recycle Bin'], answer: 0, explain: 'Workspace templates live in the Document Templates volume.' },
          { q: 'A new customer needs a different folder structure from the rest. Best approach?', options: ['A second template for the same workspace type', 'A new workspace type for one customer', 'Edit the existing template and undo it later', 'Copy an existing workspace'], answer: 0, explain: 'One type can have several templates; choose one at creation.' },
          { q: 'How should a workspace\'s access be managed day to day?', options: ['By adding and removing participants in roles', 'By editing each folder\'s permissions', 'By changing the template', 'By moving the workspace'], answer: 0, explain: 'Roles carry the permissions; manage people, not ACLs.' },
          { q: 'What does the workspace type\'s location do?', options: ['Tells the system where to put workspaces when no user picks a folder', 'Restricts who can see the type', 'Defines the template folders', 'Sets the perspective'], answer: 0, explain: 'Workspaces from integrations, workflows or the API go to the type\'s location (plus optional sub-path).' },
          { q: 'You edit the template\'s roles. Which workspaces get the new roles?', options: ['Workspaces created after the change', 'All workspaces of the type', 'Only workspaces you open', 'None until a reindex'], answer: 0, explain: 'Template changes only apply to future workspaces.' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ WS04
  {
    id: 'ws04', track: 'workspaces', order: 33, title: 'Lab 3 — Create and work in a workspace', source: SRC, feature: 'businessWorkspaces',
    domains: ['ws-using'],
    summary: 'Create a Training Customer workspace, check what the template gave it, and work in it.',
    lesson: [
      'Now the payoff: create a workspace from your type and template, and let the trainer check on your server that it is a real business workspace, in the right place, with the template\'s folders and the category. Then add a document and manage the team like a business user would.',
      {
        steps: [
          'Open your sandbox ▸ “Training Customers” in Smart View.',
          'Click + (Add) ▸ “Training Customer – Standard” (the Add menu lists templates by name), or use the Create Business Workspace icon next to Favorites.',
          'Enter Customer Number 10023, Customer Name ACME Corp, Region EMEA.',
          'Create. The workspace is named by the pattern: “10023 – ACME Corp”.',
        ],
        title: 'Create the workspace',
        ui: 'Smart View',
      },
      {
        figure: {
          type: 'tree',
          root: {
            label: 'Training Customers', icon: 'folder', note: 'your location', children: [
              { label: '10023 – ACME Corp', icon: 'workspace', note: 'business workspace · category Training Customer', children: [
                { label: '01 Contracts', icon: 'folder' },
                { label: '02 Correspondence', icon: 'email' },
                { label: '03 Orders', icon: 'folder' },
                { label: 'Customer Agreement', icon: 'doc', note: 'you add this' },
              ] },
            ],
          },
        },
        caption: 'What the trainer will look for.',
      },
      { callout: 'tip', text: ['No “Training Customer – Standard” in the + menu? Check that the folder and the template share the classification, and that creation is enabled on the workspace type — the most common setup mistakes ([[ws-troubleshooting]]).'] },
      'Every way of creating workspaces, including from business applications and the REST API: [[ws-create]]. Working in a workspace: [[ws-working-in]].',
    ],
    keyPoints: [
      'Workspaces created in a folder land in that folder; others go to the type\'s location.',
      'The name comes from the pattern, not from what you type as a title.',
      'Everything in the template is copied: folders, roles, categories.',
      'Give access by adding participants to roles.',
    ],
    missions: [
      {
        id: 'ws04-create', type: 'hands-on', title: 'Create the ACME Corp workspace', xp: 40, requires: ['ws02-location'],
        brief: 'The real test of your setup: a business workspace created from your type and template, in your location.',
        steps: [
          'Open “Training Customers” in your sandbox in Smart View.',
          '+ (Add) ▸ “Training Customer – Standard”.',
          'Customer Number 10023, Customer Name ACME Corp, Region EMEA. Create.',
        ],
        hints: ['If your server has no business workspaces module, this mission can\'t be done there — skip it.', 'The workspace must be directly inside “Training Customers”. If your type has an attribute-based sub-path, remove it for this lab.'],
        checks: [
          { kind: 'child', parent: 'wsLocation', nameRegex: 'acme', types: [848], typeName: '^business ?workspace$', saveAs: 'wsAcme', label: 'A business workspace for ACME in “Training Customers”' },
          { kind: 'count', parent: 'wsAcme', types: [0, 751], min: 2, label: 'It has the template\'s folders (at least 2)', hint: 'Did you add folders to the template before creating the workspace?' },
          { kind: 'categories', node: 'wsAcme', min: 1, label: 'It carries the business category' },
        ],
        open: 'wsLocation',
      },
      {
        id: 'ws04-document', type: 'hands-on', title: 'Add a document to the workspace', xp: 25, requires: ['ws04-create'],
        steps: ['Open “10023 – ACME Corp”.', 'Add any small file as a document named “Customer Agreement”, directly in the workspace (not in a sub-folder).'],
        checks: [{ kind: 'child', parent: 'wsAcme', nameRegex: '^customer agreement(\\.[a-z0-9]{1,5})?$', types: [144], label: 'Document “Customer Agreement” in the workspace' }],
        open: 'wsAcme',
      },
      {
        id: 'ws04-team', type: 'practice', title: 'Manage the team', xp: 20, requires: ['ws04-create'],
        steps: ['Open the workspace\'s team.', 'Add a colleague (or a group) to the Sales Team role.', 'Sign in as them if you can, or check their effective permissions, and confirm what they can do.'],
        reflection: 'Who did you add to which role, what could they do afterwards, and how would you remove their access when they leave the account?',
        minWords: 25,
      },
      {
        id: 'ws04-related', type: 'practice', title: 'Explore related workspaces and the perspective', xp: 20, requires: ['ws04-create'],
        steps: ['Look at the workspace\'s perspective: header, team, documents, related workspaces.', 'If your server has relationship types configured, create a related workspace from the related workspaces widget.', 'If the workspace opens as a plain folder, note it: it has no perspective yet.'],
        reflection: 'Describe the layout your workspace opened in, what each widget showed, and what you would add with Perspective Manager.',
        minWords: 25,
      },
      {
        id: 'ws04-quiz', type: 'quiz', title: 'Knowledge check: creating and using workspaces', xp: 25,
        questions: [
          { q: 'A user creates a workspace in the Customers ▸ EMEA folder in Smart View. Where is it created?', options: ['In Customers ▸ EMEA', 'Always in the type\'s location root', 'In the user\'s Personal Workspace', 'In the Document Templates volume'], answer: 0, explain: 'Created in a folder, the workspace lands in that folder; the type\'s location is for creation without a chosen folder.' },
          { q: 'Workspaces created from SAP appear in the wrong folder. What do you check first?', options: ['The workspace type\'s location and sub-path attributes', 'The perspective', 'The Recycle Bin', 'The user\'s favorites'], answer: 0, explain: 'Without a chosen folder, the type\'s location decides.' },
          { q: 'Why might the + menu not offer your template in a folder? (Pick the best answer.)', options: ['No template with a classification matching the folder', 'The folder has too many items', 'The workspace type has no icon', 'The perspective is missing'], answer: 0, explain: 'Classification matching is what offers a template — and its type — in a folder.' },
          { q: 'What gives a new participant access to a workspace\'s documents?', options: ['The permissions of the role they are added to', 'Being named in the workspace title', 'Opening it from a favorite', 'The category'], answer: 0, explain: 'Roles carry the permissions.' },
          { q: 'Through the REST API, what do you ask for before creating a workspace with required metadata?', options: ['The create form for the template', 'A LiveReport', 'The audit log', 'The Recycle Bin'], answer: 0, explain: 'The create form lists the fields the template needs.' },
          { q: 'The workspace name came out as “ – ACME Corp”. Likely cause?', options: ['Customer Number was empty but used in the name pattern', 'The template had no folders', 'The perspective rule failed', 'The user lacks See'], answer: 0, explain: 'An empty attribute in the pattern leaves a blank part.' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ WS05
  {
    id: 'ws05', track: 'workspaces', order: 34, title: 'Lab 4 — Troubleshoot and transport', source: SRC, feature: 'businessWorkspaces',
    domains: ['ws-using', 'ws-types'],
    summary: 'Diagnose broken workspace creation, and move a finished setup to another environment.',
    lesson: [
      'Two skills finish the job: finding why creation misbehaves, and moving a tested configuration from development to test and production without rebuilding it by hand.',
      {
        table: {
          head: ['Symptom', 'Look at'],
          rows: [
            ['Template missing from + menu', 'Classifications of folder and template; creation enabled on the type'],
            ['Blank or duplicate names', 'Name pattern, mandatory attributes, unique key'],
            ['Wrong folder', 'Type location and sub-path attributes'],
            ['No folders in the workspace', 'Template content; which template was used'],
            ['Plain folder layout', 'Perspective rules'],
          ],
        },
      },
      {
        figure: {
          type: 'flow',
          steps: [{ label: 'Development', sub: 'configure & test' }, { label: 'Transport package', sub: 'warehouse: export', kind: 'system' }, { label: 'Test', sub: 'import, deploy, test' }, { label: 'Production', sub: 'deploy', kind: 'end' }],
        },
        caption: 'Configuration moves forward through environments with Transport.',
      },
      'Runbook: [[ws-troubleshooting]]. Transport in detail: [[ba-transport]] and [[ba-transport-deploy]].',
    ],
    keyPoints: ['Trace a symptom back to the configuration object behind it.', 'Recreate a test workspace after every change.', 'Move configuration with Transport, not by hand.', 'Transport the building blocks with the type and template.'],
    missions: [
      {
        id: 'ws05-diagnose', type: 'practice', title: 'Break it and fix it', xp: 20, requires: ['ws04-create'],
        steps: ['On your training server, remove the classification from the “Training Customers” folder.', 'Try to create a Training Customer workspace there and note what happens.', 'Put the classification back and confirm creation works again.'],
        reflection: 'What exactly did you see when the classification was missing, why, and how would you explain the fix to a colleague?',
        minWords: 30,
      },
      {
        id: 'ws05-transport', type: 'practice', title: 'Plan the transport of your setup', xp: 20,
        steps: ['Open the Transport Warehouse (if your server has it) and look at how a package is built.', 'List every object your Training Customer setup is made of.', 'Decide the order they must be exported and deployed in.'],
        reflection: 'List the objects of your setup in the order you would put them in a transport package, and what you would test after deploying it.',
        minWords: 30,
      },
      {
        id: 'ws05-quiz', type: 'quiz', title: 'Knowledge check: troubleshooting and transport', xp: 25,
        questions: [
          { q: 'After every change to a workspace configuration, what is the quickest regression test?', options: ['Create a new test workspace and check it', 'Restart the server', 'Reindex everything', 'Clear browser cache'], answer: 0, explain: 'A fresh workspace shows name, location, content, roles and layout at once.' },
          { q: 'How should a tested workspace configuration reach production?', options: ['With a transport package, deployed in order', 'Rebuilt by hand from screenshots', 'By copying the database', 'By email'], answer: 0, explain: 'Transport moves configuration objects between environments reliably.' },
          { q: 'A workspace opens as a plain folder. Which object do you check?', options: ['Perspective rules', 'The category', 'The location', 'The name pattern'], answer: 0, explain: 'The perspective (and its rules) decides the layout.' },
          { q: 'Why include the category and classifications in the same transport as the workspace type and template?', options: ['The type and template depend on them', 'They are the largest objects', 'Transport requires alphabetical order', 'They are optional'], answer: 0, explain: 'Dependencies must exist in the target before the objects that refer to them.' },
        ],
      },
    ],
  },
];
