'use strict';
// Business workspaces, part C: templates, team roles, template content,
// search, the creation wizard, perspectives, and an end-to-end capstone.
// Learned from the course "Content Server Business Workspaces" (2-0108,
// release 22.1), chapters 10–15 and the review appendix; all text is original.
// Format: curriculum/CONTENT.md.

const SRC = (ch) => `Content Server Business Workspaces (2-0108, 22.1) — ${ch}`;

module.exports = [
  // ------------------------------------------------------------------ Ch 10
  {
    id: 'bw-document-template-settings',
    order: 30,
    title: 'Document Template settings that business workspaces depend on',
    area: 'workspaces',
    summary: 'The system-wide Content Server Document Templates settings behind every workspace template: managed object types, classification tree and inheritance, creation dates, RM classification and the creation wizard.',
    level: 'intermediate',
    minutes: 12,
    domains: ['ws-types', 'ba-ws-types'],
    modules: ['bw10'],
    tags: ['document templates', 'managed object types', 'subtype 848', 'classification inheritance', 'wizard settings', 'apply new create date', 'rm classification'],
    related: ['bw-create-template', 'ba-workspace-templates', 'ba-classifications', 'ws-setup-roadmap'],
    sources: [SRC('Ch. 10')],
    body: [
      'Workspace templates are not a separate engine: they are built on the older **Content Server Document Templates** module. Anything that module can turn into a template — a folder, a project, and the **Business Workspace** item type (subtype **848**) — is listed as a *managed object type*. If subtype 848 is not managed, nobody can add a workspace template, however much else is configured.',
      'These settings are **system-wide**: they apply to every document template on the server, not just to one workspace type. Set them once, early, and change them only with care, because every later template creation and every workspace created from a template follows them.',
      { h: 'Where the settings live' },
      { path: ['Admin', 'Content Server Administration', 'Document Templates Administration', 'Configure Content Server Document Templates'], ui: 'Classic View' },
      'The page has two parts: **Document Types Settings** (what can be a template, and how classifications, dates and RM data behave) and **Wizard Settings** (which steps a user sees when creating something from a template). You need administration-page access to change them.',
      {
        figure: {
          type: 'layers',
          layers: [
            { label: 'Document Types Settings', items: ['Managed object types (848 must be selected)', 'Inherit RM classification', 'Apply new create date to sub-items', 'Classification tree for document types', 'Classification inheritance', 'Default classification'], note: 'what can be a template and how its data is treated' },
            { label: 'Wizard Settings', items: ['Enable wizard (conditions)', 'Template selection step', 'Category step / attribute merging', 'Classification step', 'Edit document after creation', 'Document template volume behaviour'], note: 'what the user walks through when creating' },
          ],
        },
        caption: 'The two halves of the Configure Content Server Document Templates page.',
      },
      { h: 'Document Types Settings, one by one' },
      {
        table: {
          head: ['Setting', 'What it does', 'Typical choice for workspaces'],
          rows: [
            ['**Managed object types**', 'The item types that may live in the Document Templates volume as templates. Edited with the Configure link: move types between the available and the Selected column.', '**Business Workspace (848)** in Selected — without it the Add Item ▸ Business Workspace entry is missing in Document Templates'],
            ['**Inherit RM classification from template**', 'On: sub-items always take the Records Management classification of the template. Off: they inherit from the destination.', 'Depends on the records design; decide with the records manager'],
            ['**Apply new create date to sub-items**', 'On: every sub-item (folder, workflow…) gets today’s date as creation date when the workspace is created; with Records Management, the record date and status date too. Off: sub-items keep the creation date they had in the template. Tasks and task lists are not affected.', 'On — otherwise a brand-new workspace contains folders “created” years ago. Default is **off**'],
            ['**Classification tree for document types**', 'The classification tree that holds the “document types” (template types) for all templates.', 'Your template classification tree, e.g. one tree with one classification per workspace type'],
            ['**Classification inheritance**', 'How a template picks up classifications: from the **direct parent**, from the **nearest ancestor** that has one, or **not at all**.', 'Inherit from the direct parent node (what the course uses)'],
            ['**Default classification**', 'A classification applied when nothing is inherited.', 'Optional'],
          ],
        },
      },
      { callout: 'remember', text: 'The template and the location (root) folder of the workspace type must carry the **same classification**. The classification tree selected here is where those classifications come from — it is how “this folder” is linked to “these templates”.' },
      { h: 'Wizard Settings' },
      'When users create an item from a template in the Classic View they may walk through a wizard. These settings switch steps on or off.',
      {
        table: {
          head: ['Setting', 'Effect'],
          rows: [
            ['**Enable wizard**', 'Shows the wizard under conditions you tick: if a document type is available, if categories are inherited, if classifications are inherited, or always.'],
            ['**Template selection**', 'Adds a step where the user picks from the available templates.'],
            ['**Category step**', 'Lets users add a category of their own on top of the template’s category.'],
            ['**Attribute merging**', 'Merges attribute values from the template with those of the destination.'],
            ['**Classification step**', 'Lets users choose a more specific classification than the template’s; a related option pre-selects the template’s classification in that step.'],
            ['**Set the classifications for new & existing documents**', 'Turns classification setting on or off for new or existing documents.'],
            ['**Row count** settings', 'How many rows the classification list boxes show.'],
            ['**Set classifications bottom-up**', 'Option to apply classifications bottom-up for new documents, and whether non-selectable classifications may be included.'],
            ['**Edit document after creation**', 'Opens a newly created document in its editor (from the wizard or the Smart View dialog).'],
            ['**Document template volume**', 'Enable or disable the wizard, or disable only the template selection.'],
          ],
        },
      },
      {
        steps: [
          'Sign in with an account that may open the administration pages.',
          'Open Admin ▸ Content Server Administration and type “Document Templates” in the filter box.',
          'Click **Configure Content Server Document Templates**.',
          'Next to **Managed object types**, click **Configure**; make sure **Business Workspace (subtype 848)** is in the Selected column; Save Changes.',
          'Check **Classification tree for document types** points at your template classification tree.',
          'Set **Classification inheritance** to inherit from the direct parent node.',
          'Under Enable wizard, tick the conditions you want (for example: if a document type is available, if classifications are inherited).',
          'Tick **Edit document after creation** and **Apply new create date to sub-items** if you want those behaviours.',
          'Click **Save Changes** at the bottom of the page.',
        ],
        title: 'Prepare Document Templates for business workspaces',
        ui: 'Classic View',
      },
      {
        figure: {
          type: 'flow',
          steps: [
            { label: '848 managed?', sub: 'Managed object types', kind: 'decision' },
            { label: 'Add Item ▸ Business Workspace', sub: 'appears in Document Templates' },
            { label: 'Template classified', sub: 'from the template tree' },
            { label: 'Location shares it', sub: 'same classification', kind: 'system' },
            { label: 'Template offered', sub: 'when creating in that folder', kind: 'end' },
          ],
        },
        caption: 'Why these settings come first: each later step depends on the one before.',
      },
      { callout: 'exam', title: 'Exam trap', text: 'If **Add Item ▸ Business Workspace** is missing in the Document Templates volume, the fix is not a permission or a workspace-type setting: Business Workspace (subtype 848) has to be a **managed object type** in the Document Templates administration.' },
      { callout: 'note', text: 'Labels and the exact list of options are those of release 22.1. Later releases moved some workspace administration into Smart View, but the Document Templates settings still sit on the Classic administration pages.' },
      'Next: [[bw-create-template|create the template itself]].',
    ],
  },

  {
    id: 'bw-create-template',
    order: 31,
    title: 'Creating a workspace template and switching off metadata inheritance',
    area: 'workspaces',
    summary: 'Step by step: add a Business Workspace template with its type, classification and category, copy templates, and turn off category and classification inheritance — and why OpenText recommends it.',
    level: 'intermediate',
    minutes: 13,
    domains: ['ws-types', 'ba-ws-types'],
    modules: ['bw10'],
    tags: ['workspace template', 'document templates', 'add item business workspace', 'disable inheritance', 'edit inheritance', 'classification', 'category', 'copy template'],
    related: ['bw-document-template-settings', 'bw-team-roles', 'bw-template-content', 'ba-workspace-templates', 'bw-search-config'],
    sources: [SRC('Ch. 10'), SRC('Appendix B')],
    body: [
      'A workspace template is a Content Server item of type **Business Workspace** that lives in the **Document Templates** volume. It carries four settings that tie it into the configuration — its name, its **workspace type**, its **classification** and its **category** — and it contains the folders, documents, task lists and other items every new workspace should start with.',
      'Usually there is **one template per workspace type**. You can add more templates for the same type when the structure or the default attribute values differ (a “Key account” and a “Standard” customer template, for example).',
      {
        figure: {
          type: 'hub',
          center: 'Workspace template',
          items: [
            { label: 'Name', sub: 'shown in the Add menu' },
            { label: 'Workspace type', sub: 'name pattern, location' },
            { label: 'Classification', sub: 'same as the location folder' },
            { label: 'Category', sub: 'mandatory — feeds the header' },
            { label: 'Content', sub: 'folders, task lists, forum…' },
            { label: 'Team roles', sub: 'copied to every workspace' },
          ],
        },
        caption: 'What a template carries. The first four are set when you add it; content and roles come next.',
      },
      { h: 'Add the template' },
      {
        tabs: [
          {
            label: 'Classic View',
            body: [
              { path: ['Enterprise', 'Document Templates', 'Add Item', 'Business Workspace'], ui: 'Classic View' },
              {
                steps: [
                  'Open Enterprise ▸ Document Templates (optionally a sub-folder you keep per workspace type).',
                  'Click **Add Item ▸ Business Workspace**. (Missing? Business Workspace is not a managed object type yet — see [[bw-document-template-settings]].)',
                  '**Name**: this is what users will see in the Smart View Add menu when they create a workspace, so make it meaningful (“Supplier – Standard”).',
                  '**Description**: when to use this template.',
                  '**Workspace Type**: pick the type from the list (it must exist already).',
                  '**Classifications**: Classify ▸ Browse Classifications, open your template classification tree and tick the classification that the location folder also carries; Submit.',
                  '**Categories**: Edit ▸ Add Categories, select the workspace’s business category. Leave the attribute values empty unless you want defaults in every new workspace; click Done.',
                  'Click **Add**.',
                ],
                title: 'Add a workspace template',
                ui: 'Classic View',
              },
            ],
          },
          {
            label: 'Smart View',
            body: [
              'In release 22.1 the template itself is created on the Classic pages. Smart View users can reach the Document Templates volume through the **Configuration Volume** widget if a perspective offers it ([[bw-perspective-widgets]]), but adding the template, its team roles and its inheritance settings is done in the Classic View.',
              { callout: 'note', text: 'Newer releases add more template administration to Smart View. If your menus differ, look for the same four settings: name, workspace type, classification, category.' },
            ],
          },
        ],
      },
      { callout: 'warn', title: 'The category is not optional', text: 'A workspace template **must** have a category: the Smart View header and the Classic sidebar show workspace data from it, and the type’s name pattern reads its attributes. A template without one creates workspaces with an empty header.' },
      { h: 'Copying a template' },
      'To start a second template from an existing one, use **Copy** on the template and choose a destination inside the Document Templates volume, then adjust the copy. One surprise: if you copy a **folder** that contains workspace templates, the templates inside it are **not** copied with it — copy each template on its own.',
      { h: 'Turn off metadata inheritance — and why' },
      'By default, Content Server items inherit the categories and classifications of their parent. Inside a workspace template that means every folder, document and task created inside a workspace would receive a copy of the **workspace’s** category and classification. OpenText recommends switching this off on the template:',
      {
        figure: {
          type: 'compare',
          items: [
            { title: 'Inheritance on', tone: 'fail', points: ['Workspace attributes are copied onto every new sub-item', 'Copies are made at creation and never refreshed — they go stale when the workspace data changes', 'Many extra attribute rows in the database', 'Measurable performance cost'] },
            { title: 'Inheritance off + indexing', tone: 'pass', points: ['Sub-items keep their own categories (if any)', 'Workspace attributes are added to the search index of child items instead', 'Index data is refreshed when workspace attributes change', 'Configured on the workspace type ([[bw-search-config]])'] },
          ],
        },
        caption: 'Prefer indexing over inheritance: you still find documents by workspace data, without copying it everywhere.',
      },
      {
        steps: [
          'In Enterprise ▸ Document Templates, open the template’s **Functions menu ▸ Properties ▸ Categories**.',
          'Click **Edit Inheritance** (the middle button at the top right).',
          'Tick **Disable Inheritance** for the business category and click **Submit**; then click **Apply** on the Categories tab.',
          'Open the **Classifications** tab of the same template.',
          'Clear the **Inherit** check box.',
          'Return to the Document Templates volume.',
        ],
        title: 'Disable category and classification inheritance on a template',
        ui: 'Classic View',
      },
      { callout: 'exam', text: ['Expect: “Why disable category inheritance on a workspace template?” — because the workspace’s metadata would otherwise be copied into every sub-item at creation time, never updated afterwards, and it costs database space and performance. The recommended way to make documents findable by workspace data is **indexing of category attributes on child items**, set on the workspace type.'] },
      { h: 'Check your template' },
      {
        table: {
          head: ['Check', 'Where', 'Good'],
          rows: [
            ['Type is set', 'Template ▸ Properties ▸ General', 'The intended workspace type'],
            ['Classification matches the location', 'Template and location folder ▸ Properties ▸ Classifications', 'Same classification on both'],
            ['Category attached', 'Template ▸ Properties ▸ Categories', 'Business category, values empty or sensible defaults'],
            ['Inheritance off', 'Categories ▸ Edit Inheritance; Classifications tab', 'Disabled / Inherit cleared'],
            ['Offered to users', 'Create a workspace in the location folder', 'The template name appears in the Add menu'],
          ],
        },
      },
      'Then give it roles ([[bw-team-roles]]) and content ([[bw-template-content]]). What is copied from a template, in general: [[ba-workspace-templates]].',
    ],
  },

  // ------------------------------------------------------------------ Ch 11
  {
    id: 'bw-team-roles',
    order: 32,
    title: 'Team roles, permissions and the Template Administrator',
    area: 'workspaces',
    summary: 'Define team roles and their permissions on a workspace template, understand the Team Lead and Template Administrator roles, and know exactly what happens to roles and participants when workspaces are created and moved.',
    level: 'intermediate',
    minutes: 14,
    domains: ['ws-roles', 'ba-roles'],
    modules: ['bw11'],
    tags: ['team roles', 'team participants', 'team lead', 'template administrator', 'role permissions', 'merge with creation location', 'move', 'group replacement'],
    related: ['bw-workspace-hierarchies', 'ba-roles-permissions', 'bw-creation-wizard', 'bw-create-template'],
    sources: [SRC('Ch. 11'), SRC('Ch. 14')],
    body: [
      'Access to a business workspace is driven by **team roles** and **team participants**. The template defines the roles and what each may do; the people and groups are added — usually — on each workspace after it is created. When a participant is added to a role, they get the role’s permissions on the workspace and its items.',
      { h: 'Two special roles' },
      {
        figure: {
          type: 'compare',
          items: [
            { title: 'Template Administrator', tone: 'warn', points: ['Added automatically to every workspace template', 'Controls who may create and change the template', '**Not copied** into workspaces created from the template', 'Fill it with a small admin group (e.g. your business-admin group)'] },
            { title: 'Team Lead', tone: 'accent', points: ['One role per template, shown with a red flag', 'By default the first role you add after the Template Administrator', 'Change it with **Set as Team Lead**', 'Its participants can edit the participants of the other roles'] },
          ],
        },
        caption: 'The Template Administrator governs the template; the Team Lead governs each workspace’s team.',
      },
      { callout: 'note', text: 'You can delete the Team Lead role only when it is the only role in the list.' },
      { h: 'Define roles and permissions' },
      {
        steps: [
          'In Enterprise ▸ Document Templates, open the template’s **Functions menu ▸ Team Roles and Permissions**.',
          'Click **Add Role** (next to Role Access); type the role name and, optionally, a description; click **Add**. The first role you add becomes the Team Lead (red flag).',
          'Click the role name to open **Edit Role Permissions**; tick the permissions the role should have; **Update**.',
          'Repeat for every role. Change the lead with **Set as Team Lead** if needed.',
          'When sub-folders exist, adjust role permissions on them too (a restricted folder only some roles see).',
          'Click **Done**.',
        ],
        title: 'Define team roles on a template',
        ui: 'Classic View',
      },
      {
        figure: {
          type: 'matrix',
          cols: ['See / See Contents', 'Add Items', 'Edit Attributes', 'Delete', 'Edit Permissions'],
          rows: [
            { label: 'Buyer (Team Lead)', cells: [true, true, true, true, true] },
            { label: 'Quality Engineer', cells: [true, true, true, 'own folder', false] },
            { label: 'Finance Reviewer', cells: [true, false, false, false, false] },
            { label: 'Template Administrator', cells: ['template only', 'template only', 'template only', 'template only', 'template only'] },
          ],
        },
        caption: 'An example role design for a Supplier template. Plan it as a grid before you click.',
      },
      { callout: 'tip', text: 'Permissions in Content Server are cumulative: ticking Edit Permissions implies the lower permissions it needs. When a role should be able to “do everything up to Delete”, tick Delete and let the dialog fill in the levels below it.' },
      { h: 'Fill the Template Administrator role' },
      {
        steps: [
          'On the template, open **Functions menu ▸ Team Participants**.',
          'Click **Find & Add**; search for the group (for example by Group Name “starts with”).',
          'Select **Template Administrator** as the role for that group and click **Submit**.',
          'Click **Done**.',
        ],
        title: 'Assign participants to the Template Administrator role',
        ui: 'Classic View',
      },
      { callout: 'warn', text: 'Normally only the Template Administrator role gets participants on the template. Participants you add to the other roles **on the template** are copied into every workspace created from it — useful for a group that truly belongs everywhere, harmful for named people.' },
      { h: 'Roles and participants on the workspace' },
      'After creation, team participants are added on the workspace itself — Classic View: the workspace’s **Functions menu ▸ Team Participants**; Smart View: the **Team** widget. A participant can be a user or a group, can hold several roles, and a role can have many participants. Roles can also be added directly to an individual workspace from its Team widget.',
      { h: 'What happens on create and move' },
      'Two settings influence the result: **Merge with creation location** on the template’s **Specific** tab, and **Always inherit the permissions from target destination** (Content Server Administration ▸ Core System – Feature Administration ▸ Access Control).',
      {
        table: {
          head: ['Event', 'Roles and participants afterwards'],
          rows: [
            ['Workspace created from a template', 'All roles and any template participants are copied — **except the Template Administrator**'],
            ['Created **inside another workspace**', 'Also copies the destination’s roles and participants — **only if merging with the creation location is enabled**'],
            ['Moved to a destination **with** team roles (e.g. another workspace)', 'Inherited roles and permissions are removed; the destination’s roles and participants are copied **only if “Always inherit the permissions from target destination” is on**; roles assigned directly to the workspace stay'],
            ['Moved to a destination **without** team roles', 'Inherited roles and permissions are removed; directly assigned roles stay'],
          ],
        },
      },
      {
        figure: {
          type: 'flow',
          steps: [
            { label: 'Workspace moved', kind: 'start' },
            { label: 'Remove inherited roles', kind: 'system' },
            { label: 'Destination has roles?', kind: 'decision' },
            { label: 'Copy them if “always inherit” is on', kind: 'system' },
            { label: 'Direct roles kept', kind: 'end' },
          ],
        },
        caption: 'Moving a workspace: inherited access goes, direct roles stay, destination roles depend on a system setting.',
      },
      { h: 'Group replacement on the Specific tab' },
      'The template’s **Specific** tab can also replace the user groups that restrict access to the template or its folders with **generated groups**, whose names are built from variables or category attributes. The **Target Group** column defines the name of the group to generate. Replacement runs when the workspace is created and again when its categories are updated or cleared. The concept is explained in [[ba-roles-permissions]].',
      { callout: 'exam', text: ['Know three facts cold: (1) roles are defined on the **template**, participants are usually added on the **workspace**; (2) the **Template Administrator** role is never copied to workspaces; (3) the **Team Lead** role’s participants can manage the other roles’ participants, and by default it is the first role added.'] },
      'Workspaces inside workspaces, and mapping parent roles to child roles: [[bw-workspace-hierarchies]].',
    ],
  },

  {
    id: 'bw-workspace-hierarchies',
    order: 33,
    title: 'Workspace hierarchies and role mapping',
    area: 'workspaces',
    summary: 'Let one kind of business workspace host another, map parent roles onto child roles so parent teams can work in child workspaces, and predict who can see what.',
    level: 'advanced',
    minutes: 10,
    domains: ['ws-roles', 'ba-roles', 'ws-types'],
    modules: ['bw11'],
    tags: ['workspace hierarchy', 'parent workspace', 'child workspace', 'role mapping', 'case management', 'employee file', 'workspace hierarchies tab'],
    related: ['bw-team-roles', 'ba-related-workspaces', 'ba-roles-permissions'],
    sources: [SRC('Ch. 11')],
    body: [
      'Business workspaces can be created **inside** other business workspaces. A typical case is case management: an **Employee** workspace that holds a child workspace for each **Absence case** or **Training record**, or a **Customer** workspace holding its **Claims**. Hierarchies are different from *related* workspaces ([[ba-related-workspaces]]): a related workspace is linked, a child workspace physically lives inside its parent.',
      {
        figure: {
          type: 'tree',
          root: {
            label: 'Employees', icon: 'folder', note: 'location of the Employee type', children: [
              { label: '4711 – R. Moreau', icon: 'workspace', note: 'Employee workspace (parent)', children: [
                { label: '01 Contract', icon: 'folder' },
                { label: '02 Payroll', icon: 'folder' },
                { label: 'Absence 2026-03', icon: 'workspace', note: 'Absence Case workspace (child)', children: [
                  { label: 'Medical note', icon: 'doc' },
                  { label: 'Return-to-work plan', icon: 'doc' },
                ] },
                { label: 'Training 2026', icon: 'workspace', note: 'Training Record workspace (child)' },
              ] },
            ],
          },
        },
        caption: 'A hierarchy: child workspaces created within a parent workspace.',
      },
      { h: 'Allowing a workspace to host others' },
      'The hierarchy is defined in the **document templates** and identifies the workspaces by their **classifications**: on the parent template you state which kinds of workspace may be created inside it. In 22.1 the setting is on the template’s **Properties ▸ Workspace Hierarchies**.',
      {
        steps: [
          'Fully configure both workspace types first — category, classification, type, template, roles — for the parent and for the child.',
          'Open the **parent** template’s Properties ▸ **Workspace Hierarchies**.',
          'Add the child workspace kind (identified by its template classification) as allowed inside the parent.',
          'Optionally add a **role mapping** (below).',
          'Save, then create a parent workspace and, inside it, a child workspace to test.',
        ],
        title: 'Set up a parent–child hierarchy',
        ui: 'Classic View',
      },
      { h: 'Role mapping' },
      'Parent and child templates often have different roles. Without help, the parent’s HR Advisor would not be in the child workspace’s team at all. **Role mapping** lets you say “the parent role *HR Advisor* acts as the child role *Case Manager*”: in the child workspace, the child role is replaced by the mapped parent role, which then carries **the child role’s access rights**.',
      {
        figure: {
          type: 'matrix',
          cols: ['Parent: Employee workspace', 'Child: Absence Case workspace'],
          rows: [
            { label: 'HR Advisor (parent role)', cells: ['Own rights', 'Rights of Case Manager (mapped)'] },
            { label: 'Line Manager (parent role)', cells: ['Own rights', 'Rights of Reviewer (mapped)'] },
            { label: 'Case Manager (child role)', cells: ['No access gained', 'Own rights'] },
            { label: 'Occupational Health (child only)', cells: [false, 'Own rights'] },
          ],
        },
        caption: 'Mapping works downwards only: parent roles reach into the child, child roles do not reach up.',
      },
      {
        ul: [
          'Members of a mapped **parent** role can work in the child workspace even though they were never added to its team.',
          'Members of **child** roles do **not** automatically get access to the parent workspace — sensitive parent data stays protected.',
          'Fewer roles to maintain: the parent team is maintained once, in the parent.',
          'A role mapping is added when you define which workspace types may be created inside another.',
        ],
      },
      { h: 'Interaction with role copying' },
      'Remember the creation rules from [[bw-team-roles]]: when a workspace is created **within** another workspace, the destination’s team roles and participants are copied into the new workspace only when merging with the creation location is enabled on the template. Role mapping is the more targeted alternative — it maps chosen roles instead of merging all of them.',
      { callout: 'exam', title: 'Exam trap', text: 'A question may claim that child-workspace members can see the parent workspace because of role mapping. They cannot: mapping gives **parent** roles access to the **child**, not the other way round.' },
      { callout: 'tip', text: 'Draw the hierarchy and the mapping grid before configuring it, and test with one user per role. Hierarchies are hard to rearrange later because workspaces physically live inside their parents.' },
    ],
  },

  // ------------------------------------------------------------------ Ch 12
  {
    id: 'bw-template-content',
    order: 34,
    title: 'Template content: folders, task lists, email folders and forums',
    area: 'workspaces',
    summary: 'Build the default content of a workspace template — folders with optional categories, task lists and email folders named with category replacement tags, and a moderated forum for the Discussion widget.',
    level: 'intermediate',
    minutes: 14,
    domains: ['ws-types', 'ba-ws-types'],
    modules: ['bw12'],
    tags: ['template content', 'folders', 'task list', 'email folder', 'forum', 'replacement tags', 'attributes.dump', 'category id', 'moderators'],
    related: ['ba-template-content', 'bw-create-template', 'bw-creation-wizard', 'bw-perspective-widgets'],
    sources: [SRC('Ch. 12'), SRC('Appendix B')],
    body: [
      'Whatever you put inside a workspace template is copied into every workspace created from it: a standard set of **folders**, **email folders**, **documents**, **task lists**, **forums** and other items. Time spent planning this content pays off many times — it is the first thing every team sees. Design principles for the structure are in [[ba-template-content]]; this guide is about building each kind of item, and about the **replacement tags** that make item names specific to each workspace.',
      {
        figure: {
          type: 'tree',
          root: {
            label: 'Supplier – Standard (template)', icon: 'template', note: 'Document Templates volume', children: [
              { label: '01 Qualification', icon: 'folder', note: 'extra category “Supplier Audit” (optional)' },
              { label: '02 Contracts', icon: 'folder' },
              { label: '03 Invoices', icon: 'folder' },
              { label: 'Mail for <Category_…_7 />', icon: 'email', note: 'email folder, email-enabled after creation' },
              { label: 'Onboarding – <Category_…_3 />', icon: 'workflow', note: 'task list with replacement tag' },
              { label: 'Supplier discussion', icon: 'wiki', note: 'forum → Discussion widget' },
            ],
          },
        },
        caption: 'Typical template content. The tags turn into the supplier’s values in each new workspace.',
      },
      { h: 'Folders' },
      'Folders form the standard structure. A folder in the template may carry **its own category**, separate from the workspace category — optional, but useful when the folder collects a particular kind of document. For example, a “Specifications” folder could carry a “Product Spec” category so documents added there can be described and filtered (facets) by spec attributes.',
      {
        steps: [
          'Open Enterprise ▸ Document Templates and click the template’s **name** to open it.',
          'Click **Add Folder**; type the folder name.',
          'Optional: next to Categories, click **Edit ▸ Add Categories**, select the extra category, leave its values empty, and click **Done**.',
          'Click **Add**. Repeat for every folder.',
        ],
        title: 'Add folders to a template',
        ui: 'Classic View',
      },
      { callout: 'remember', text: 'The **workspace** category on the template is mandatory; categories on **folders inside** the template are optional.' },
      { h: 'Replacement tags in item names' },
      'Fixed names are a problem for some items: a task list called “Onboarding” in 800 supplier workspaces produces 800 identically named task lists and tasks in people’s assignments. A **category replacement tag** in the name is replaced, when the workspace is created, by the value of an attribute of the new workspace.',
      { code: '<Category_CatID_AttrID />\n\nOnboarding – <Category_884213_3 />      →  Onboarding – Northwind Metals\nMail for <Category_884213_7 />          →  Mail for J. Alvarez', lang: 'text', title: 'Replacement tag format (IDs are examples — yours differ)' },
      {
        ul: [
          '`CatID` is the node ID of the category, `AttrID` the number of the attribute inside it, joined by an underscore.',
          'Find both with the **attributes dump** page: add `?func=attributes.dump` to your Content Server URL (for example `https://yourserver/otcs/cs.exe?func=attributes.dump`). It lists every category definition with its ID and the IDs of its attributes.',
          'Tags are resolved **once, at creation**. Changing the attribute later does not rename the item.',
          'Use attributes that are filled at creation (mandatory ones); an empty attribute leaves a gap in the name.',
        ],
      },
      {
        figure: {
          type: 'flow',
          steps: [
            { label: 'attributes.dump', sub: 'read category and attribute IDs' },
            { label: 'Name item in template', sub: 'Onboarding – <Category_884213_3 />' },
            { label: 'Workspace created', sub: 'Supplier Name = Northwind Metals', kind: 'system' },
            { label: 'Tag resolved once', sub: 'Onboarding – Northwind Metals', kind: 'end' },
          ],
        },
        caption: 'The life of a replacement tag: looked up, typed into the template, resolved at creation.',
      },
      { callout: 'exam', text: 'Replacement tags are especially recommended for **task lists**, so that tasks generated from many workspaces do not all carry the same name. The tag syntax is `<Category_CatID_AttrID />` and the IDs come from `func=attributes.dump`.' },
      { h: 'Task lists' },
      {
        steps: [
          'In another browser tab, open `…/cs.exe?func=attributes.dump` and note the ID of the workspace category and of the attribute you want (e.g. Supplier Name).',
          'Back in the open template, click **Add Item ▸ Task List**.',
          '**Name**: text plus the tag, e.g. `Onboarding – <Category_884213_3 />` with your own IDs.',
          '**Description**: what the list is for.',
          'Click **Add**. Open the task list and add standard tasks if every workspace needs them.',
        ],
        title: 'Add a task list named with a replacement tag',
        ui: 'Classic View',
      },
      { h: 'Email folders' },
      'An **email folder** stores emails with their sender, recipients and dates as metadata. Create it in the template, named with a tag if useful; **email-enabling** it (giving it its own address) is done later on each workspace’s copy, because each workspace needs its own address — see [[bw-creation-wizard]].',
      {
        steps: [
          'In the template, click **Add Item ▸ Email Folder**.',
          'Name it, for example `Mail for <Category_884213_7 />` (the tag points at the account-owner attribute).',
          'Click **Add**.',
        ],
        title: 'Add an email folder',
        ui: 'Classic View',
      },
      { h: 'Forums' },
      'A **forum** gives the team a place for questions and answers. In Smart View it is shown by the **Discussion** widget of the workspace perspective ([[bw-perspective-widgets]]) — the widget works with a Classic **Forum** object, not with the older Classic *Discussion* item.',
      {
        steps: [
          'In the template, click **Add Item ▸ Forum**.',
          'Enter a **Title** and click **Create**; the Forum Settings page opens.',
          'Header: tick **Display Header in All Views** and type a short header text explaining the forum’s purpose.',
          'Moderators: select the users who moderate posts.',
          'Click **Submit**.',
        ],
        title: 'Add a forum',
        ui: 'Classic View',
      },
      {
        table: {
          head: ['Item', 'Add with', 'Name with a tag?', 'Finish on the workspace'],
          rows: [
            ['Folder', 'Add Folder', 'Rarely — keep folder names stable', 'Nothing'],
            ['Folder with extra category', 'Add Folder ▸ Categories ▸ Edit', 'No', 'Users fill the category on documents'],
            ['Task list', 'Add Item ▸ Task List', '**Yes** — avoids identical task names', 'Assign tasks'],
            ['Email folder', 'Add Item ▸ Email Folder', 'Often', '**Email Enable** to give it an address'],
            ['Forum', 'Add Item ▸ Forum', 'Optional', 'Team posts; Discussion widget shows it'],
          ],
        },
      },
      { callout: 'tip', text: 'Existing folders and objects can also be **moved or copied into** workspaces and workspace templates — a practical way to migrate a folder structure you already have into a template.' },
      { callout: 'warn', text: 'Template content is copied only at creation. Workspaces created before you add a forum or task list to the template do not get it; add it to them by hand (or with a bulk tool).' },
    ],
  },

  // ------------------------------------------------------------------ Ch 13
  {
    id: 'bw-search-config',
    order: 35,
    title: 'Making business workspaces searchable: slices, XECMWkspLinkRefTypeID and indexing',
    area: 'workspaces',
    summary: 'Create a search slice per workspace type with XECMWkspLinkRefTypeID, make that region queryable, enable indexing of workspace attributes on child items, and run and monitor the re-indexing.',
    level: 'advanced',
    minutes: 16,
    domains: ['ws-using', 'ba-search'],
    modules: ['bw13'],
    tags: ['search', 'slice', 'XECMWkspLinkRefTypeID', 'ID_CFG', 'queryable', 'region', 'enterprise search manager', 'indexing', 'indexable subtypes', 're-indexing', 'test mode', 'enterprise data flow manager'],
    related: ['bw-custom-view-search', 'ba-search-admin', 'bw-create-template', 'ba-workspace-types'],
    sources: [SRC('Ch. 13'), SRC('Appendix B')],
    body: [
      'Business workspaces put their metadata into the search index, and the module creates the index **regions** it needs automatically. On top of that you can make search much more useful in four steps: a **slice per workspace type**, a **queryable** type region, **indexing of workspace attributes on child items**, and saved **simple searches**. The first three are covered here; simple searches are in [[bw-custom-view-search]].',
      {
        figure: {
          type: 'flow',
          steps: [
            { label: 'Find ID_CFG', sub: 'in the workspace type URL' },
            { label: 'Test complex query', sub: 'XECMWkspLinkRefTypeID:n' },
            { label: 'Save as slice', sub: 'and set permissions' },
            { label: 'Region queryable', sub: 'Enterprise Search Manager', kind: 'system' },
            { label: 'Enable child indexing', sub: 'workspace type ▸ Advanced' },
            { label: 'Re-index', sub: 'test mode first', kind: 'system' },
            { label: 'Monitor', sub: 'Data Flow Manager iPools', kind: 'end' },
          ],
        },
        caption: 'The search set-up for one workspace type, in order.',
      },
      { callout: 'warn', text: 'Several of these steps need **system administrator** rights: saving slices is usually restricted, and making a region queryable and monitoring data flows are done on the administration pages and in the System Object Volume.' },
      { h: '1. A search slice per workspace type' },
      'A **slice** is a saved search scope. With one slice per workspace type, users can narrow any search to “Supplier workspaces only”: in Smart View they pick the slice from the search box’s list; in Classic View from the Slice list of the search dialog.',
      'Every workspace (and every item indexed with workspace data) carries the ID of its workspace type in the region **XECMWkspLinkRefTypeID**. That ID is the workspace type’s configuration ID, visible as `ID_CFG` in the URL when you open the type.',
      {
        steps: [
          'Open Enterprise ▸ Business Workspaces ▸ **Workspace Types** and click the type’s name.',
          'Look at the end of the URL: note the value of `ID_CFG` (e.g. `…ReferenceTypeEdit&ID_CFG=4` → 4).',
          'Open **Tools ▸ Search** (Advanced Search). In the Full Text section set **Look For** to **Complex Query**.',
          'Enter `XECMWkspLinkRefTypeID:4` (your number).',
          'Click **Search** and check the results are the workspaces of that type. Fix and retest if not.',
          'Go back to the Advanced Search page and click **Save as Slice**; name it after the workspace type; **Add**. The slice is stored in the Slice Folder.',
          'On the slice: **Functions ▸ Permissions ▸ Grant Access** — e.g. the admin group Edit Permissions, the user group See and See Contents (users need to see a slice to use it).',
        ],
        title: 'Create a slice for a workspace type',
        ui: 'Classic View',
      },
      { code: 'XECMWkspLinkRefTypeID:4', lang: 'text', title: 'Complex query for the slice (4 = the type’s ID_CFG)' },
      { h: '2. Make XECMWkspLinkRefTypeID queryable' },
      'The region is created automatically as soon as the first business workspace is created and indexed — and a workspace **template** already counts, so the region normally exists once you have a template. To use it in queries, it has to be marked **Queryable**.',
      {
        steps: [
          'Open Admin ▸ Content Server Administration ▸ Search Administration ▸ **Open the System Object Volume** (or Enterprise Workspace ▸ System Object Volume).',
          'Open the **Enterprise Data Source Folder**.',
          'On **Enterprise Search Manager**: Functions ▸ Properties ▸ **Regions**.',
          'Scroll to the end of the list, find **XECMWkspLinkRefTypeID** and tick **Queryable** (the first check box of the row).',
          'Click **Update**.',
        ],
        title: 'Make the region queryable',
        ui: 'Classic View',
      },
      { h: '3. Index workspace attributes on child items' },
      'Documents, emails and folders in a workspace normally do not carry the workspace’s category. With this option, the workspace’s **category attributes are added to the index entries of its child items** (and of nested workspaces). A search for “Supplier Name = Northwind Metals” then finds the workspace **and** the contracts, emails and task lists inside it. When workspace attributes change, the new values reach the children’s index entries — the reason to prefer indexing over metadata inheritance ([[bw-create-template]]).',
      {
        steps: [
          'Open the workspace type and click the **Advanced** tab.',
          'Under **Indexing Settings**, tick **Enable the indexing of category attributes for this business workspace on child items**; click **Apply**.',
          'Click **Configure indexable subtypes**.',
          'Add the item types to index with workspace data. Business Workspace, Document and Email are selected already; typical additions: Folder, Forum, Generation, Shortcut, Task, Task List, URL. Click **Add**, then **Update**.',
          'Click **Save Changes** on the workspace type.',
        ],
        title: 'Enable child-item indexing for a workspace type',
        ui: 'Classic View',
      },
      {
        figure: {
          type: 'matrix',
          cols: ['Selected by default', 'Commonly added'],
          rows: [
            { label: 'Business Workspace', cells: [true, false] },
            { label: 'Document', cells: [true, false] },
            { label: 'Email', cells: [true, false] },
            { label: 'Folder, Task List, Task', cells: [false, true] },
            { label: 'Forum, Shortcut, URL, Generation', cells: [false, true] },
          ],
        },
        caption: 'Indexable subtypes for a workspace type (22.1 defaults).',
      },
      { callout: 'note', text: 'The setting only affects items **added after** the change. Items that already exist must be re-indexed — the workspace type list then shows the status **re-indexing required**.' },
      { h: '4. Re-index and monitor' },
      {
        steps: [
          'In the Workspace Types list, open the type’s **Functions menu ▸ Schedule for Re-indexing**.',
          'Leave **Run in test mode without indexing** ticked; click **Start** and confirm. Read the **Summary of last action** — it tells you what would be re-indexed.',
          'Clear the test-mode box, click **Start** again and confirm. The re-indexing is scheduled.',
          'Follow the **Content Server System** link, open Enterprise Data Source Folder ▸ **Enterprise Data Flow Manager**, and watch the **Interchange Pools** section (Status, Pending, Processed, Quarantined). Set the page to refresh every few seconds.',
        ],
        title: 'Re-index the items of a workspace type',
        ui: 'Classic View',
      },
      {
        figure: {
          type: 'lanes',
          lanes: [
            { label: 'Business admin', cells: ['Enable indexing on type', 'Schedule re-index (test)', 'Start real run', ''] },
            { label: 'Content Server', cells: ['Status: re-indexing required', 'Summary of last action', 'Queues items', 'Index updated'] },
            { label: 'System admin', cells: ['Region queryable', '', 'Watch iPools', 'Check quarantine'] },
          ],
        },
        caption: 'Who does what during indexing set-up.',
      },
      { callout: 'exam', text: ['Remember: the slice query is `XECMWkspLinkRefTypeID:<ID_CFG>`; the region is created **automatically**, but must be made **Queryable** in Enterprise Search Manager ▸ Properties ▸ Regions; child-item indexing is a **workspace type** setting (Advanced tab) that applies to new items only until you **Schedule for Re-indexing**.'] },
      'Where users meet all this: slices in the search box, and saved simple searches — [[bw-custom-view-search]]. System search forms and other search administration: [[ba-search-admin]].',
    ],
  },

  {
    id: 'bw-custom-view-search',
    order: 36,
    title: 'Simple searches (Custom View Searches) for business workspaces',
    area: 'workspaces',
    summary: 'Build a saved query that finds business workspaces of one type, turn it into a Custom View Search form, and offer it in Classic View and in a Smart View perspective.',
    level: 'intermediate',
    minutes: 10,
    domains: ['ws-using', 'ba-search'],
    modules: ['bw13'],
    tags: ['custom view search', 'simple search', 'saved query', 'make custom view search', 'content type business workspace', 'slice', 'multilingual'],
    related: ['bw-search-config', 'bw-perspective-widgets', 'ba-search-admin'],
    sources: [SRC('Ch. 13'), SRC('Ch. 15'), SRC('Appendix B')],
    body: [
      'Searching is usually faster than browsing a deep folder tree. A **simple search** is a predefined, saved query that helps users find business workspaces — a small form with only the fields that matter (“Supplier Name, Country, Status”). Technically it is a Content Server **Custom View Search**; the two names mean the same thing. Its title can be multilingual.',
      { h: 'Where users meet simple searches' },
      {
        figure: {
          type: 'hub',
          center: 'Simple search (Custom View)',
          items: [
            { label: 'Business Workspaces ▸ Search', sub: 'Classic global menu' },
            { label: 'Target browse', sub: 'when copying or moving items' },
            { label: 'Add relationship', sub: 'find the related workspace' },
            { label: 'Custom View Search widget', sub: 'on a Smart View perspective tab' },
          ],
        },
        caption: 'One saved query, several entry points. Users need permission on the saved query to use it.',
      },
      { h: 'Build the saved query' },
      {
        steps: [
          'Open **Tools ▸ Search**.',
          'Click **System Attributes** on the left and set **Content Type** to **Business Workspace** — so only workspaces are found.',
          'Click **Slices** and select the slice of your workspace type ([[bw-search-config]]).',
          'Click **Categories**, browse to the workspace category and **Select** it; its attributes appear as search fields.',
          'Optionally set default criteria (a default value narrows every search; usually leave the fields empty).',
          'Click **Search** to test it.',
          'Click **Save Search Query**: give it a name, choose **Create In** (a folder users can see, or the Saved Queries volume), click **Add**; if asked for categories, click Done and Add again.',
        ],
        title: 'Create the saved query',
        ui: 'Classic View',
      },
      { h: 'Turn it into a Custom View Search' },
      {
        steps: [
          'On the saved query, open **Functions ▸ Make Custom View Search**.',
          'In each section (the category, Options…) tick **Show** for the fields users should see on the form.',
          'Enter the **Custom View Search Title** (per language if needed).',
          'Click **Save**. Opening the saved query now shows the compact form.',
        ],
        title: 'Make the Custom View Search',
        ui: 'Classic View',
      },
      {
        figure: {
          type: 'flow',
          steps: [
            { label: 'Advanced Search', sub: 'type + slice + category' },
            { label: 'Save Search Query', sub: 'in a shared folder' },
            { label: 'Make Custom View Search', sub: 'choose shown fields' },
            { label: 'Use it', sub: 'Classic menu or Smart View widget', kind: 'end' },
          ],
        },
        caption: 'From advanced search to a reusable form.',
      },
      { h: 'Offer it in Smart View' },
      'Add the **Custom View Search** widget (Standard Widgets) to a tab of the workspace perspective — for example a tab named “Find suppliers” — set its width to Full and browse to the saved query in its **Search query** option ([[bw-perspectives]]).',
      { callout: 'tip', text: 'Grant **See** and **See Contents** on the saved query (or the folder holding it) to the users who should use it. A query nobody can see is a widget that shows nothing.' },
      { callout: 'exam', text: '“Simple search” and “Custom View Search” (also called Custom View) are the same thing for business workspaces. Typical construction: Content Type = Business Workspace, a slice for the type, the workspace category — saved, then **Make Custom View Search**.' },
    ],
  },

  // ------------------------------------------------------------------ Ch 14
  {
    id: 'bw-creation-wizard',
    order: 37,
    title: 'Creating a business workspace with the wizard — and the first things to do in it',
    area: 'workspaces',
    summary: 'Every page of the Business Workspace wizard, the two Smart View entry points, creation from a workflow, adding team participants, email-enabling the email folder and triggering an activity feed.',
    level: 'intermediate',
    minutes: 13,
    domains: ['ws-using', 'ws-roles'],
    modules: ['bw14'],
    tags: ['create workspace', 'wizard', 'type page', 'metadata page', 'classifications page', 'team participants', 'email enable', 'elink', 'email alias', 'pulse', 'activity feed', 'create workspace step'],
    related: ['ws-create', 'bw-team-roles', 'bw-template-content', 'ws-working-in', 'ws-troubleshooting'],
    sources: [SRC('Ch. 14'), SRC('Appendix B')],
    body: [
      'Once the category, classification, location, workspace type, template, roles and content exist, workspaces can be created. In many Extended ECM systems a leading application such as SAP creates them; here we look at creation **inside Content Server**, by a person, with the **Business Workspace wizard** — plus the first things a team does in a new workspace. Other creation routes are summarised in [[ws-create]].',
      { h: 'The wizard, page by page' },
      {
        figure: {
          type: 'flow',
          steps: [
            { label: 'Add Item ▸ Business Workspace', sub: 'in the location folder', kind: 'start' },
            { label: 'Type page', sub: 'template; name is generated' },
            { label: 'Metadata page', sub: 'category attributes; required fields' },
            { label: 'Classifications page', sub: 'inherited from the template' },
            { label: 'Finish', sub: 'success dialog ▸ Continue', kind: 'end' },
          ],
        },
        caption: 'The Classic View wizard in release 22.1.',
      },
      {
        table: {
          head: ['Page', 'What you see', 'What you do'],
          rows: [
            ['**Type**', 'The template offered for this folder (by classification). The name field is filled automatically from the workspace type’s name pattern. Classifications come from the template.', 'Usually just **Next**. End users should not change classifications.'],
            ['**Metadata**', 'The template’s category with its attributes. A reference attribute (e.g. a sequence-based ID) is generated automatically.', 'Fill the attributes; required ones must be filled or the wizard stops with an error. **Next**.'],
            ['**Classifications**', 'The classification already assigned through the template.', 'Click **Finish**; then **Continue** in the success dialog.'],
          ],
        },
      },
      {
        tabs: [
          {
            label: 'Classic View',
            body: [
              {
                steps: [
                  'Open the location (root) folder of the workspace type, for example Enterprise ▸ Purchasing ▸ Suppliers.',
                  'Click **Add Item ▸ Business Workspace**.',
                  'Type page: check the template and the generated name; click **Next**.',
                  'Metadata page: fill the attributes (Supplier Name, Country, Buyer…); click **Next**.',
                  'Classifications page: click **Finish**, then **Continue**.',
                  'The workspace opens with the template’s folders, email folder, task list and forum, and its attributes in the sidebar.',
                ],
                title: 'Create a workspace with the wizard',
                ui: 'Classic View',
              },
            ],
          },
          {
            label: 'Smart View',
            body: [
              'In Smart View there are two ways to start, once you are in the location folder:',
              { figure: { type: 'menu', title: 'Location folder toolbar', items: ['Add item (+)', 'Create Business Workspace icon', 'Favorites'], highlight: 'Create Business Workspace icon', note: 'either entry opens the create form for the template' }, caption: 'Two entry points in Smart View.' },
              {
                steps: [
                  'Open the location folder in Smart View.',
                  'Use **+ (Add item) ▸ the template name**, or the **Create Business Workspace** icon next to Favorites.',
                  'Fill the attributes in the form; required fields are marked.',
                  'Click **Save**/**Create**. The workspace opens in its perspective.',
                ],
                title: 'Create a workspace in Smart View',
                ui: 'Smart View',
              },
            ],
          },
        ],
      },
      { callout: 'note', text: 'Where the workspace lands depends on the workspace type: if its location is also used for manual creation, a workspace started in the root folder may be filed into an attribute-based sub-folder (for example Suppliers ▸ Germany). See [[ba-workspace-types]].' },
      { h: 'Creating workspaces from a workflow' },
      'A workflow map can create a workspace with a **Create Workspace** step. The step needs a **workspace template** and the attribute values that template requires, mapped from **workflow attributes**. The new workspace can be stored in an **Item Reference** attribute so later steps — for example an **Item Handler** step — can work with it.',
      { h: 'Add team participants' },
      {
        steps: [
          'On the new workspace, open **Functions ▸ Team Participants** (Smart View: the **Team** widget).',
          'Notice that the **Template Administrator** role is not there — it is never copied from the template.',
          'Click **Find & Add**, search for a user or group, select the role(s) for them, and **Submit**.',
          'Repeat; a participant may hold several roles and a role may have many participants. Click **Done**.',
        ],
        title: 'Assign participants to roles on a workspace',
        ui: 'Classic View',
      },
      { h: 'Email-enable the email folder' },
      'The email folder copied from the template has no address yet. **Email-enabling** it (an **eLink** feature) gives it its own address, so colleagues can send or forward emails straight into the workspace.',
      {
        steps: [
          'On the email folder inside the workspace: **Functions ▸ Email Enable**. The Enable eLink page opens.',
          '**Email Alias**: the address of the folder. A default derived from the folder name is proposed — keep it or change it to something meaningful and unique.',
          '**Content Stored**: choose whether only the message body is stored when an email is added.',
          'Click **Enable**.',
        ],
        title: 'Email-enable an email folder',
        ui: 'Classic View',
      },
      { callout: 'tip', text: 'A replacement tag in the template’s email folder name (e.g. the account owner) also produces a readable default alias, because the alias is proposed from the folder name.' },
      { h: 'Trigger and watch an activity feed' },
      'If activity monitoring (Pulse) and activity rules for the workspace category are configured, changing a watched attribute posts a message to the workspace’s activity feed.',
      {
        steps: [
          'Open the workspace’s **Functions ▸ Properties ▸ Categories**.',
          'Change a monitored attribute (e.g. the responsible buyer) and click **Submit**.',
          'Classic View: open the sidebar (the narrow bar on the left) and look at **Pulse From Here**; or open **Personal ▸ Pulse** for details.',
          'Smart View: the Activity Feed embedded in the workspace header shows the same message.',
        ],
        title: 'Change an attribute and see the activity message',
      },
      {
        figure: {
          type: 'lanes',
          lanes: [
            { label: 'Creator', cells: ['Run wizard', 'Add participants', 'Email-enable folder', ''] },
            { label: 'Content Server', cells: ['Copy template; name & place', 'Grant role permissions', 'Assign address', 'Post activity'] },
            { label: 'Team', cells: ['', 'Gets access', 'Sends mail in', 'Sees change in Pulse'] },
          ],
        },
        caption: 'The first hour of a new workspace.',
      },
      { callout: 'exam', text: ['Wizard order: **Type → Metadata → Classifications → Finish**. After creation, participants are added on the workspace (Template Administrator absent), the email folder is email-enabled **per workspace**, and attribute changes are what trigger configured activity feeds.'] },
      'Problems while creating? See [[ws-troubleshooting]].',
    ],
  },

  // ------------------------------------------------------------------ Ch 15
  {
    id: 'bw-perspectives',
    order: 38,
    title: 'Workspace perspectives in Perspective Manager: create, rule, edit, tab',
    area: 'workspaces',
    summary: 'Open Perspective Manager from a workspace type or from the admin pages, understand the default workspace layout, set rules, place and size widgets, add tabs, save correctly and transport the result.',
    level: 'intermediate',
    minutes: 15,
    domains: ['ws-using', 'ba-smart'],
    modules: ['bw15'],
    tags: ['perspective', 'perspective manager', 'rules', 'workspace type', 'workspace template', 'widget library', 'tabs', 'flow layout', 'code editor', 'cached configuration', 'perspectives volume'],
    related: ['bw-perspective-widgets', 'ba-perspective-manager', 'bw-custom-view-search', 'ba-transport'],
    sources: [SRC('Ch. 15')],
    body: [
      'A **perspective** decides how a business workspace looks in Smart View: which widgets, on which tabs, how wide. For business workspaces, the perspective becomes the workspace’s landing page. **Perspective Manager** is the graphical tool that builds it (and turns it into the underlying ActiveView code). General perspective concepts — kinds, rules, order — are in [[ba-perspective-manager]]; this guide is the workspace-specific workflow.',
      { h: 'Two ways to open Perspective Manager' },
      {
        figure: {
          type: 'compare',
          items: [
            { title: 'From the workspace type', tone: 'info', points: ['Business Workspaces ▸ Workspace Types ▸ the type ▸ **Manage Perspectives for this workspace type**', 'Opens in a new window, without the Layout option (workspaces have a fixed layout)', 'Rule for the type is pre-filled', 'Good for the first perspective of a type'] },
            { title: 'From the admin pages', tone: 'accent', points: ['Content Server Administration ▸ Perspectives Administration ▸ **Open the Perspective Manager**', 'Full functionality', 'Choose Create new or **Edit existing** and browse', 'Best for editing — big systems have many perspectives'] },
          ],
        },
        caption: 'Start from the type to create; start from the admin pages to edit.',
      },
      { h: 'Create a perspective for a workspace type' },
      {
        steps: [
          'Open Enterprise ▸ Business Workspaces ▸ Workspace Types and click the type.',
          'Scroll to the Perspective Manager section and click **Manage Perspectives for this workspace type**. Perspective Manager opens in a new window.',
          '**General** tab: keep **Create new**; enter a **Title** (e.g. “Supplier Perspective”).',
          '**Rules** tab: check the rule that ties it to the workspace type (or add one for a specific template).',
          '**Configure** tab: adjust the default layout — header options, widgets, widths, tabs.',
          'Click **Create** (top right), then **Close**, and close the Perspective Manager window.',
          'Back on the workspace type page click **Save Changes** — this last step is the one most often forgotten.',
        ],
        title: 'Create a workspace perspective',
        ui: 'Perspective Manager',
      },
      { h: 'Rules' },
      'Rules decide **for whom and where** the perspective applies. They are evaluated top to bottom. When opened from a workspace type, the rule for that type is the first rule; it must not be removed, but you can add more.',
      {
        table: {
          head: ['Part of a rule', 'Choices'],
          rows: [
            ['Type', 'Group · Mobile Device · User · Workspace Template · Workspace Type'],
            ['Operator', 'is · is not'],
            ['Value', 'Typed or browsed — e.g. the workspace types that exist, or a template from the Document Templates volume'],
            ['Logical join (for added rules)', 'AND · OR with the preceding rules'],
          ],
        },
      },
      { callout: 'warn', text: 'A perspective with **no rule** applies to all users on all devices. Make sure every rule is valid and logically correct; your role, group membership and permissions may also limit which Perspective Manager options you see.' },
      { h: 'The Configure tab' },
      {
        figure: {
          type: 'layers',
          layers: [
            { label: 'Widget Library (left)', items: ['Business Workspaces: Header, Team, Metadata, Related Workspaces, Workspaces, Configuration Volume', 'Communities: Discussion', 'Standard Widgets: Node Browsing Table, Favorites, Recently Accessed, Custom View Search, Single Shortcut, HTML Tile…'] },
            { label: 'Working area (middle)', items: ['Header widget on top', 'Tab “Overview”: Team, Metadata, Discussion', 'Tab “Documents”: Node Browsing Table', 'Add tab button'] },
            { label: 'Options (right)', items: ['Options of the selected widget: width, title, data…'] },
          ],
        },
        caption: 'The default layout a new workspace perspective starts with, and the three panes around it.',
      },
      {
        ul: [
          'Widgets come from installed modules; groups you do not have installed are simply missing.',
          'In the **Flow** layout, tiles follow each other; a new widget goes into the next free spot (the dotted “place widget here” outline). Widths come from the widget’s width option; heights adapt to the screen. Drag tiles to reorder; they wrap to the next row when a row is full.',
          '**Clear** in the header bar resets settings, rules, layout and widgets and returns to the General tab — nothing is saved for a new perspective; unsaved edits are lost for an existing one.',
          'Changes typed in the **Code Editor** view are not reflected in the Designer view but take effect on Update; any change made afterwards in the Designer view **undoes** the manual code changes.',
        ],
      },
      { h: 'Edit a perspective and add a tab' },
      {
        steps: [
          'Admin ▸ Content Server Administration; filter “pers”; **Perspectives Administration ▸ Open the Perspective Manager**. If a **cached configuration** message appears, choose Clear (start fresh) or resume the unsaved work.',
          'General tab: **Edit existing** ▸ Browse ▸ Business Workspaces ▸ the folder of your type ▸ **Select** the perspective.',
          'Configure tab: click **Add tab** in the working area.',
          'Drag a widget (e.g. Standard Widgets ▸ Recently Accessed or Custom View Search) into “place widget here”; set its **Width** in Options.',
          '**Double-click the tab** to open **Multilingual Values** and type its name per language; Update.',
          'Click **Update** (top right), confirm the **Important!** dialog with Update, then **Close**.',
        ],
        title: 'Edit an existing workspace perspective',
        ui: 'Perspective Manager',
      },
      {
        figure: {
          type: 'tree',
          root: {
            label: 'Perspectives volume', icon: 'volume', note: 'Enterprise ▸ Business Workspaces ▸ Perspectives', children: [
              { label: 'Supplier (folder per type)', icon: 'folder', children: [
                { label: 'Supplier Perspective', icon: 'page', note: 'rule: workspace type is Supplier' },
                { label: 'Supplier – mobile', icon: 'page', note: 'rule: type AND mobile device' },
              ] },
              { label: 'Customer (folder per type)', icon: 'folder', children: [{ label: 'Customer Perspective', icon: 'page' }] },
            ],
          },
        },
        caption: 'Workspace perspectives are stored in the Perspectives volume, in a folder named after the type.',
      },
      { h: 'Moving perspectives between systems' },
      'Perspectives can be added to a **Transport Warehouse** and turned into transport items, so a perspective built on development reaches test and production with the type it belongs to ([[ba-transport]]).',
      { callout: 'exam', text: ['Know: the default workspace perspective = **Header + Overview tab (Team, Metadata, Discussion) + Documents tab (Node Browsing Table)**; rules are evaluated **top to bottom**; no rule = everyone, every device; created from the workspace type page you must still click **Save Changes** on the type.'] },
      'Each widget’s options in detail: [[bw-perspective-widgets]].',
    ],
  },

  {
    id: 'bw-perspective-widgets',
    order: 38,
    title: 'Workspace widgets reference: Header, Team, Metadata, Discussion, Workspaces, Configuration Volume',
    area: 'workspaces',
    summary: 'What each business workspace widget shows and every option it has — header title tags, widths, metadata groups, forum linking, workspace lists and the configuration volume tile.',
    level: 'intermediate',
    minutes: 14,
    domains: ['ws-using', 'ba-smart'],
    modules: ['bw15'],
    tags: ['header widget', 'team widget', 'metadata widget', 'discussion widget', 'workspaces widget', 'configuration volume widget', 'widget width', 'business_properties', 'categories tag', 'activity feed'],
    related: ['bw-perspectives', 'ba-perspective-manager', 'bw-template-content', 'bw-custom-view-search'],
    sources: [SRC('Ch. 15')],
    body: [
      'Widgets are configured in the **Options** pane of Perspective Manager after you select them in the working area. Most share a **Width** option with the same six choices; the rest are specific to the widget.',
      {
        figure: {
          type: 'ladder',
          steps: [
            { label: 'Quarter', sub: 'default: Workspaces, Configuration Volume' },
            { label: 'One third', sub: 'default: Team, Metadata, Discussion' },
            { label: 'Half' },
            { label: 'Two thirds' },
            { label: 'Three quarters' },
            { label: 'Full', sub: 'lists and search forms' },
          ],
        },
        caption: 'Widget widths, narrowest first, with the 22.1 defaults.',
      },
      { h: 'Header' },
      'The **Header** widget shows the workspace’s identity: a title, the type, a description and selected data, taken dynamically from **category attributes**, **node properties** and **business properties**. You can mix in static text, line breaks, tabs and spaces. One other widget can be **embedded** in the header — currently only the **Activity Feed** (shown on the right of the header; it requires Pulse to be enabled, and activity rules make it useful).',
      {
        table: {
          head: ['Header option', 'Default', 'Better'],
          rows: [
            ['Title', '`{name}`', 'Key attributes, e.g. `{categories.884213_2} – {categories.884213_3}` → “S-0042 – Northwind Metals”'],
            ['Type', '`{business_properties.workspace_type_name}`', 'Keep, or a fixed word'],
            ['Description', '`{description}`', 'A short line built from attributes, or fixed text'],
          ],
        },
      },
      {
        table: {
          head: ['Placeholder', 'Shows'],
          rows: [
            ['`{name}`, `{description}`', 'Workspace name and description'],
            ['`{type_name}`', 'The item type name (Business Workspace)'],
            ['`{create_date}`, `{modify_date}`', 'Creation / modification date, formatted for the user'],
            ['`{create_user_id}`, `{modify_user_id}`, `{owner_user_id}`', 'Creator / modifier / owner as a display name'],
            ['`{owner_group_id}`', 'The owner group'],
            ['`{business_properties.workspace_type_name}`', 'Name of the workspace type'],
            ['`{business_properties.workspace_type_id}`', 'ID of the workspace type — handy when testing perspectives'],
            ['`{categories.CatID_AttrID}`', 'An attribute value; inserted with **Add Attribute To Field**'],
          ],
        },
      },
      {
        steps: [
          'Select the Header widget; in Options expand **Workspace**.',
          'Delete `{name}` from Title; click **Add Attribute To Field**; select the category and tick the attributes (e.g. number and name); **Done**.',
          'Type a separator (space–dash–space) between the inserted tags.',
          'Adjust Description; expand **Widget** to check the embedded Activity Feed.',
        ],
        title: 'Build a header title from attributes',
        ui: 'Perspective Manager',
      },
      { callout: 'remember', text: 'Node properties need **no prefix** (`{name}`); business properties need the **business_properties.** prefix; attributes use **categories.** with the category ID and attribute ID.' },
      { h: 'Team' },
      'Shows the workspace’s **team members**, and the roles that still have **no members**. Options: **Width** (default one third) and **Title** (default “Team”). From the widget, people with the right to manage the team add and remove participants.',
      { h: 'Metadata' },
      'Shows the workspace’s **category attributes**. Options: Width (default one third), Title (default “Metadata”), **Hide empty fields** (default false), and the content list:',
      {
        ul: [
          'Add a whole **category** or single **attributes** (Category or attribute ▸ Attribute ▸ select category ▸ tick attributes or **Check all attributes**).',
          'Enter a **Group Name** to group attributes visually; leave it empty for ungrouped entries.',
          'Drag entries up or down to change the order.',
          'Multi-row attribute sets appear as a **table** — keep the table narrower than the widget.',
        ],
      },
      { h: 'Discussion' },
      'Shows the questions and answers of a **Forum** in the workspace. It sits in the **Communities** widget group although it is meant for workspaces, and it works with a Classic **Forum** object (not the Classic Discussion object).',
      {
        table: {
          head: ['Topic', 'What to know'],
          rows: [
            ['Width', 'Default one third'],
            ['Browse Forum', 'Leave **empty** and the widget links automatically to the forum in the workspace; with several forums it uses the **oldest**. Or browse to a specific forum.'],
            ['Forum creation', 'The forum can be added to the template before or after the widget is placed ([[bw-template-content]])'],
            ['Follow feature', 'Needs **Notifications** and **eLink** configured, as for Classic forums'],
            ['Existing workspaces', 'To add a Discussion widget for an existing workspace, create a new perspective for it'],
          ],
        },
      },
      { h: 'Workspaces' },
      'Lists workspaces **of one workspace type** — typically on a landing page (“My suppliers”); you can place several. Options: Width (default quarter), Title (default “My workspaces”), **Workspace type**, and for the **collapsed** and **expanded** views: a **message for an empty result**, **Order by** a custom column with a **sort order**, and the **custom columns** shown in the expanded view (drag to reorder).',
      { h: 'Configuration Volume' },
      'Gives access in Smart View to the configuration volumes, such as the **Document Templates** volume — useful for template maintainers. Options: Width (default quarter) and **Theme** (a colour group). Users still need sufficient permissions to see and use it.',
      {
        figure: {
          type: 'matrix',
          cols: ['Default width', 'Title option', 'Data option'],
          rows: [
            { label: 'Header', cells: ['top of page', 'Title tags', 'Attributes, properties, embedded Activity Feed'] },
            { label: 'Team', cells: ['One third', '“Team”', false] },
            { label: 'Metadata', cells: ['One third', '“Metadata”', 'Categories / attributes, groups, hide empty'] },
            { label: 'Discussion', cells: ['One third', false, 'Forum (auto = oldest in workspace)'] },
            { label: 'Workspaces', cells: ['Quarter', '“My workspaces”', 'Workspace type, sort, columns'] },
            { label: 'Configuration Volume', cells: ['Quarter', false, 'Theme'] },
          ],
        },
        caption: 'The business workspace widgets at a glance (release 22.1).',
      },
      { h: 'Useful standard widgets on workspace tabs' },
      {
        table: {
          head: ['Widget', 'Use on a workspace perspective'],
          rows: [
            ['Node Browsing Table', 'The documents list — the Documents tab’s main widget'],
            ['Recently Accessed', 'Items the current user opened recently'],
            ['Favorites', 'The user’s favourites'],
            ['Custom View Search', 'A saved simple search on its own tab ([[bw-custom-view-search]])'],
            ['Single Shortcut', 'A tile linking to one target; with no target and a volume fall-back (e.g. Personal) it opens that volume; background colour selectable'],
            ['HTML Tile', 'Short instructions or links'],
          ],
        },
      },
      { callout: 'exam', title: 'Exam trap', text: 'The Discussion widget with an empty forum option does **not** fail — it binds to the workspace’s forum, the **oldest** one if there are several. And the only widget that can be embedded in the Header is the **Activity Feed**.' },
    ],
  },

  // ------------------------------------------------------------ Capstone
  {
    id: 'bw-capstone',
    order: 39,
    title: 'Capstone: configuring a new workspace type from nothing',
    area: 'workspaces',
    summary: 'An end-to-end walkthrough that builds a complete “Supplier” business workspace — design, category, columns and activity rules, classification, location, type, template, roles, content, search, perspective — then creates, staffs and tests real workspaces.',
    level: 'advanced',
    minutes: 25,
    domains: ['ws-types', 'ws-roles', 'ws-using', 'ba-ws-types'],
    modules: ['bw17'],
    tags: ['capstone', 'end to end', 'supplier', 'checklist', 'configuration order', 'test plan', 'workspace type', 'template', 'perspective', 'search'],
    related: ['ws-setup-roadmap', 'bw-create-template', 'bw-team-roles', 'bw-template-content', 'bw-search-config', 'bw-perspectives', 'bw-creation-wizard', 'ws-troubleshooting'],
    sources: [SRC('Appendix B'), SRC('Ch. 10–15')],
    body: [
      'This walkthrough puts every chapter together. The scenario is our own: the **purchasing team** of a manufacturer wants one business workspace per **supplier**, holding qualification documents, contracts, audits, invoices and email, with a buyer in charge, a quality engineer and a finance reviewer. There is no ERP integration — data is typed in Content Server. Do it on a **training server** and use your own names wherever ours appear.',
      { h: '0. Design before you click' },
      'Answer the design questions on paper first; every later screen asks for one of these answers.',
      {
        table: {
          head: ['Question', 'Answer for “Supplier”'],
          rows: [
            ['What is the business object?', 'One supplier'],
            ['Which data identifies and describes it?', 'Supplier Number (generated), Supplier Name, Country, Risk Class, Buyer'],
            ['How is it named?', '“Supplier Number – Supplier Name”, e.g. S-0042 – Northwind Metals'],
            ['Where are workspaces filed?', 'Enterprise ▸ Purchasing ▸ Suppliers, sub-folder per Country'],
            ['Which folders?', '01 Qualification · 02 Contracts · 03 Audits · 04 Invoices, plus an email folder, a task list and a forum'],
            ['Which roles?', 'Buyer (lead, full control), Quality Engineer (up to Delete), Finance Reviewer (read)'],
            ['Which changes should people hear about?', 'Risk Class changed; Buyer changed'],
            ['How do people find suppliers?', 'A slice for the type, child-item indexing, a “Find suppliers” simple search'],
            ['What does the workspace look like?', 'Header with number and name; Overview (Team, Metadata, Discussion); Documents; Find suppliers'],
          ],
        },
      },
      {
        figure: {
          type: 'flow',
          vertical: true,
          steps: [
            { label: '1. Category', sub: 'Supplier attributes' },
            { label: '2. Columns, facets, activity rules', sub: 'optional but valuable' },
            { label: '3. Classification', sub: 'in the template tree' },
            { label: '4. Location folder', sub: 'classified, permissions set' },
            { label: '5. Workspace type', sub: 'name, location, side bar, indexing' },
            { label: '6. Template', sub: 'type, class., category; inheritance off' },
            { label: '7. Roles', sub: 'Buyer, Quality, Finance; Template Admin' },
            { label: '8. Content', sub: 'folders, email folder, task list, forum' },
            { label: '9. Search', sub: 'slice, queryable region, re-index, simple search' },
            { label: '10. Perspective', sub: 'header, widgets, tabs' },
            { label: '11. Create & test', sub: 'workspaces, team, email, Pulse', kind: 'end' },
          ],
        },
        caption: 'The capstone in order. Each step uses objects created in the steps above it.',
      },
      { h: '1. The category' },
      {
        steps: [
          'In the Categories volume (or your workspace categories folder) add the category **Supplier**.',
          '**Supplier Number**: a text attribute of the reference kind with a sequence-based number schema, so each workspace gets the next number automatically.',
          '**Supplier Name**: text field, **required**.',
          '**Country**: text pop-up with your countries, **required** — it drives the sub-folder.',
          '**Risk Class**: text pop-up (Low, Medium, High).',
          '**Buyer**: a user attribute (or text) naming the responsible buyer.',
        ],
        title: 'Create the Supplier category',
        ui: 'Classic View',
      },
      { h: '2. Columns, facets and activity rules' },
      'For a good list and filter experience, create **custom columns** for Supplier Name, Country and Risk Class (sortable, enabled for workspaces) and make them available in the Suppliers folder; add **facets** for Country and Risk Class (see [[ba-facets-columns]]). For notifications, create **activity manager** objects on Risk Class and Buyer with a “value changed” rule, so changes appear in Pulse and in the workspace’s activity feed.',
      { h: '3–4. Classification and location' },
      {
        steps: [
          'In your template classification tree (the one set in Document Templates administration), add the classification **Supplier**.',
          'Create the folder Enterprise ▸ Purchasing ▸ **Suppliers**; set its permissions (Purchasing can see it; generated Country sub-folders inherit them).',
          'On Suppliers: **Properties ▸ Classifications** ▸ add **Supplier**.',
        ],
        title: 'Classification and location folder',
        ui: 'Classic View',
      },
      { h: '5. The workspace type' },
      {
        steps: [
          'Enterprise ▸ Business Workspaces ▸ Workspace Types ▸ **Add Item ▸ Workspace Type**: name **Supplier**, type names per language if you serve several.',
          'Business Workspace Names: **Insert Attribute** Supplier Number, type “ – ”, **Insert Attribute** Supplier Name; tick **Generate name also for workspaces without business object** (no ERP here).',
          'Workspace Creation Settings: Location = Content Server folder **Suppliers** (with a Country sub-folder if your release offers attribute paths); tick **Use also for manual creation** if manual creation should be filed the same way.',
          'Advanced tab: enable the Classic **side bar widgets** you want (e.g. Attributes and Recent Changes) and configure them with their Detailed Configuration links.',
          'Save Changes. (Indexing comes in step 9.)',
        ],
        title: 'Create the Supplier workspace type',
        ui: 'Classic View',
      },
      'Type settings in depth: [[ba-workspace-types]].',
      { h: '6. The template' },
      {
        steps: [
          'Check Business Workspace (848) is a managed object type ([[bw-document-template-settings]]).',
          'Enterprise ▸ Document Templates ▸ **Add Item ▸ Business Workspace**: name **Supplier – Standard**, type **Supplier**, classification **Supplier**, category **Supplier** (values empty). Add.',
          'Template ▸ Properties ▸ Categories ▸ **Edit Inheritance ▸ Disable Inheritance**; Submit; Apply.',
          'Classifications tab: clear **Inherit**.',
        ],
        title: 'Create the template, inheritance off',
        ui: 'Classic View',
      },
      { h: '7. Roles' },
      {
        steps: [
          'Template ▸ **Team Roles and Permissions** ▸ Add Role **Buyer** (becomes Team Lead) with Edit Permissions.',
          'Add **Quality Engineer** with permissions up to Delete; **Finance Reviewer** with See and See Contents.',
          'Template ▸ **Team Participants** ▸ Find & Add your business-admin group to **Template Administrator**.',
        ],
        title: 'Team roles and Template Administrator',
        ui: 'Classic View',
      },
      { h: '8. Content' },
      {
        steps: [
          'Open the template; **Add Folder** 01 Qualification, 02 Contracts, 03 Audits, 04 Invoices.',
          'Look up IDs with `?func=attributes.dump`; **Add Item ▸ Email Folder** “Mail for <Category_ID_BuyerAttr />”.',
          '**Add Item ▸ Task List** “Onboarding – <Category_ID_NameAttr />” with a description; add the standard onboarding tasks.',
          '**Add Item ▸ Forum** “Supplier discussion”, header shown in all views, a moderator.',
        ],
        title: 'Template content',
        ui: 'Classic View',
      },
      { h: '9. Search' },
      {
        steps: [
          'Note the type’s `ID_CFG`; test `XECMWkspLinkRefTypeID:<n>` as a Complex Query; **Save as Slice** “Supplier”; grant users See / See Contents.',
          'If not done before: Enterprise Search Manager ▸ Properties ▸ Regions ▸ XECMWkspLinkRefTypeID ▸ **Queryable**.',
          'Type ▸ Advanced ▸ **Enable the indexing of category attributes … on child items**; Configure indexable subtypes (add Folder, Task List, Task, Forum, URL…); Save.',
          '**Schedule for Re-indexing** — test mode first, then the real run; watch the Interchange Pools.',
          'Advanced Search: Content Type = Business Workspace, slice Supplier, category Supplier ▸ **Save Search Query** “Find suppliers” in Suppliers ▸ **Make Custom View Search** with Supplier Name, Country, Risk Class shown.',
        ],
        title: 'Search set-up',
        ui: 'Classic View',
      },
      { h: '10. Perspective' },
      {
        steps: [
          'Type ▸ **Manage Perspectives for this workspace type** ▸ Create new “Supplier Perspective”; check the rule (workspace type is Supplier).',
          'Header: Title = `{categories.<id>_<num>} – {categories.<id>_<name>}`; a short description.',
          'Overview: Metadata ▸ Check all attributes of Supplier, width Two thirds; keep Team and Discussion.',
          'Documents: Node Browsing Table; add Recently Accessed.',
          'Add tab “Find suppliers” with the Custom View Search widget (Full width) pointing at “Find suppliers”.',
          '**Create**, Close, and **Save Changes** on the workspace type.',
        ],
        title: 'Supplier perspective',
        ui: 'Perspective Manager',
      },
      { h: '11. Create, staff and test' },
      {
        steps: [
          'In Suppliers: Add Item ▸ Business Workspace (or Smart View +) ▸ fill Supplier Name, Country, Risk Class, Buyer ▸ Finish.',
          'Check the name (“S-0001 – …”), the place (Suppliers ▸ Country), the content, the header and the tabs.',
          'Team Participants: add a buyer, a quality engineer and a finance reviewer to their roles.',
          'Email-enable the email folder; send a test mail to its alias.',
          'Change Risk Class and Buyer in Properties ▸ Categories; confirm the Pulse / activity feed messages.',
          'Add a document to 02 Contracts; search by Supplier Name and confirm the document is found (child-item indexing).',
          'Create a second supplier and check the number increments and the folder differs by Country.',
        ],
        title: 'Prove the configuration',
      },
      {
        figure: {
          type: 'matrix',
          cols: ['Name & place', 'Content', 'Team & access', 'Search', 'Smart View'],
          rows: [
            { label: 'Expected', cells: ['S-0001 – Name, in Country folder', '4 folders, mail, task list, forum', 'Roles copied, no Template Admin', 'Slice + child docs found', 'Header, 3 tabs'] },
            { label: 'If wrong, check', cells: ['Type name pattern & location', 'Which template; template content', 'Template roles; participants', 'Region queryable; re-index', 'Rule; Save Changes on type'] },
          ],
        },
        caption: 'The capstone test sheet: one column per configuration area.',
      },
      { callout: 'exam', text: ['The appendix of the course is exactly this flow. If you can do it from memory — category → (columns, facets, activities) → classification → location → type → template (+ inheritance off) → roles → content → search → perspective → create — you know the configuration chapters.'] },
      { callout: 'tip', title: 'Then move it', text: 'When it works, package the category, classification, type, template and perspective in a transport package and deploy them in dependency order on the next system ([[ba-transport]]).' },
    ],
  },
];
