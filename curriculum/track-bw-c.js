'use strict';
// Business Workspaces track, part C: templates, team roles, template content,
// search, creating workspaces, perspectives and a capstone. Learned from the
// course "Content Server Business Workspaces" (2-0108, release 22.1),
// chapters 10–15 and the review appendix. All text is original.
// Hands-on checks build on the lab workspace saved as 'wsAcme' (ws04-create)
// and the lab location 'wsLocation' (ws02-location).

const SRC = 'Content Server Business Workspaces (2-0108, 22.1)';

module.exports = [
  // ------------------------------------------------------------------ BW10
  {
    id: 'bw10', track: 'workspaces', order: 10, title: 'Workspace templates', source: `${SRC} — Ch. 10`, feature: 'businessWorkspaces',
    domains: ['ws-types', 'ba-ws-types'],
    summary: 'Prepare the Document Templates module for business workspaces, create a workspace template with type, classification and category, and switch off metadata inheritance.',
    lesson: [
      'Every business workspace is a copy of a **workspace template**, and workspace templates are built on the long-standing **Content Server Document Templates** module. A template is an item of type **Business Workspace** (subtype 848) in the **Document Templates** volume. It holds the folders, documents, task lists and other content every new workspace should start with — and four settings that connect it to the rest of the configuration: its name, its workspace type, its classification and its category.',
      'Before anyone can add such a template, the Document Templates module itself must know that Business Workspace items may be templates. That is a system-wide setting on the administration pages, together with a handful of others that quietly shape every workspace you will ever create: which classification tree holds the template types, how templates inherit classifications, whether sub-items get today’s date as their creation date, and which steps the creation wizard shows.',
      {
        figure: {
          type: 'layers',
          layers: [
            { label: 'Document Templates settings (once per server)', items: ['Business Workspace (848) managed', 'Classification tree for document types', 'Classification inheritance', 'Apply new create date to sub-items', 'Wizard settings'] },
            { label: 'Workspace template (once per kind of workspace)', items: ['Name shown in the Add menu', 'Workspace type', 'Classification = location’s', 'Category (mandatory)', 'Inheritance switched off'] },
            { label: 'Business workspaces (many)', items: ['Copied from the template at creation'] },
          ],
        },
        caption: 'Three levels: server settings, the template, and the workspaces copied from it.',
      },
      { h: 'Creating the template' },
      {
        steps: [
          'Enterprise ▸ Document Templates ▸ Add Item ▸ Business Workspace.',
          'Name (what users will pick), description, workspace type.',
          'Classifications ▸ Browse Classifications ▸ the classification your location folder also carries.',
          'Categories ▸ Edit ▸ Add Categories ▸ the business category; leave values empty; Done.',
          'Add.',
        ],
        title: 'Add a workspace template',
        ui: 'Classic View',
      },
      'The category is not optional: the Smart View header and the Classic sidebar display workspace data from it. One workspace type usually has one template, but it may have several — for different default values or structures. Copying a template works; copying a *folder of templates* does not copy the templates inside it.',
      { h: 'Why switch inheritance off' },
      'By default, items created inside a container inherit its categories and classifications. In a workspace, that would stamp the workspace’s business data onto every folder, document and task — once, at creation, never refreshed afterwards — and fill the database with copies that slow the system down. OpenText therefore recommends disabling **category** inheritance (Properties ▸ Categories ▸ Edit Inheritance ▸ Disable Inheritance) and **classification** inheritance (Classifications tab ▸ clear Inherit) on the template. To find documents by workspace data, use child-item **indexing** on the workspace type instead.',
      {
        figure: {
          type: 'compare',
          items: [
            { title: 'Inheritance', tone: 'fail', points: ['Copies workspace data onto sub-items', 'Snapshot at creation, goes stale', 'Costs database space and speed'] },
            { title: 'Indexing', tone: 'pass', points: ['Adds workspace data to children’s index entries', 'Follows attribute changes', 'Set on the workspace type'] },
          ],
        },
        caption: 'Prefer indexing to metadata inheritance.',
      },
      { callout: 'exam', text: 'Missing “Add Item ▸ Business Workspace” in Document Templates → Business Workspace (848) is not a **managed object type**. Template and location must share the **same classification**. A template **must** have a category.' },
      'In the handbook: [[bw-document-template-settings]] and [[bw-create-template]].',
    ],
    keyPoints: [
      'Workspace templates are Business Workspace items (subtype 848) in the Document Templates volume, built on the Document Templates module.',
      'Subtype 848 must be a managed object type in Document Templates administration.',
      'A template needs a workspace type, the location’s classification and a category.',
      'Several templates per type are allowed; copying a folder does not copy the templates in it.',
      'Disable category and classification inheritance on the template; use child-item indexing instead.',
    ],
    missions: [
      {
        id: 'bw10-settings', type: 'practice', title: 'Review the Document Templates settings', xp: 15,
        brief: 'Find the server-wide settings every workspace template depends on, and understand each one.',
        steps: [
          'On a training server, open Admin ▸ Content Server Administration and filter for “Document Templates”.',
          'Open Configure Content Server Document Templates.',
          'Check whether Business Workspace (848) is a managed object type, which classification tree is used for document types, and how classification inheritance is set.',
          'Note the Apply new create date to sub-items and Edit document after creation settings and the wizard conditions. Change nothing unless this is your own training system.',
        ],
        hints: ['If you cannot open the administration pages, ask an administrator to show you the page and read it together.'],
        reflection: 'Record the values you found for managed object types, the classification tree, classification inheritance and the create-date setting, and explain what a user would notice if Business Workspace were not a managed type.',
        minWords: 35,
      },
      {
        id: 'bw10-tree', type: 'investigate', title: 'Name your template classification tree', xp: 20,
        brief: 'Templates are offered by classification; the classifications come from one tree chosen in the Document Templates settings.',
        steps: [
          'Find which classification tree is selected as “Classification tree for document types” (or the tree you created for your lab templates).',
          'Type its name below. The trainer compares it with the trees at the top of your Classifications volume.',
        ],
        hints: ['Only top-level trees of the Classifications volume are compared. In the lab you created “Training Workspaces”.'],
        inputs: [{ key: 'tree', label: 'Name of the classification tree', placeholder: 'e.g. Training Workspaces' }],
        checks: [{ kind: 'answer', input: 'tree', source: 'classificationTrees', compare: 'contains', label: 'The classification tree exists at the top of the Classifications volume' }],
      },
      {
        id: 'bw10-template', type: 'practice', title: 'Create a second template and switch off inheritance', xp: 15, requires: ['ws03-template'],
        brief: 'Practise the full template procedure on a copy, including the inheritance settings the lab skipped.',
        steps: [
          'In Document Templates, add a Business Workspace template “Training Customer – Key Account” for your Training Customer type, with the Training Customer classification and category.',
          'Properties ▸ Categories ▸ Edit Inheritance: disable inheritance for the category; Submit; Apply.',
          'Classifications tab: clear Inherit.',
          'Do the same on your original “Training Customer – Standard” template.',
          'In Smart View, open your Training Customers folder and confirm both template names are offered when you add a workspace.',
        ],
        reflection: 'Explain in your own words what would happen to documents in a new workspace if category inheritance stayed on, and why indexing is the better way to find documents by customer data.',
        minWords: 30,
      },
      {
        id: 'bw10-quiz', type: 'quiz', title: 'Knowledge check: workspace templates', xp: 25,
        questions: [
          { q: 'An administrator opens Enterprise ▸ Document Templates but Add Item has no “Business Workspace” entry. What fixes this?', options: ['Make Business Workspace (subtype 848) a managed object type in Document Templates administration', 'Grant the administrator Edit Permissions on the volume', 'Create a perspective for the workspace type', 'Enable child-item indexing on the workspace type'], answer: 0, explain: 'Only managed object types can be added as templates; 848 has to be selected in Configure Content Server Document Templates.' },
          { q: 'What must a workspace template share with the location (root) folder of its workspace type?', options: ['Its owner', 'Its classification', 'Its perspective', 'Its email alias'], answer: 1, explain: 'Templates are offered in folders that carry the same classification.' },
          { q: 'Why is a category mandatory on a workspace template?', options: ['Categories decide the template’s icon', 'Without one the template cannot be copied', 'Its attributes feed the Smart View header and Classic sidebar (and the name pattern)', 'It is needed for the Team widget'], answer: 2, explain: 'The workspace’s business data shown in the header/sidebar comes from the template’s category.' },
          { q: 'What does OpenText recommend for category and classification inheritance on workspace templates?', options: ['Disable it', 'Enable it for all sub-items', 'Enable it only for email folders', 'Leave it to each user'], answer: 0, explain: 'Inheritance copies workspace metadata onto every sub-item at creation; it is never refreshed and costs performance.' },
          { q: 'With “Apply new create date to sub-items” switched off, what creation date do folders in a new workspace show?', options: ['Today’s date', 'The date they have in the template', 'The workspace type’s creation date', 'No date'], answer: 1, explain: 'Off (the default) keeps the template items’ dates; on sets the current date. Tasks and task lists are not affected.' },
          { q: 'You copy the Document Templates sub-folder “Customer”, which holds two workspace templates. What is in the copy?', options: ['Both templates', 'The folder without the workspace templates', 'Only the newest template', 'Shortcuts to the templates'], answer: 1, explain: 'Copying a folder that contains workspace templates does not copy the templates; copy each template on its own.' },
          { q: 'Where is the template name used?', options: ['As the name of every new workspace', 'In the Add menu when users create a workspace', 'As the email alias', 'As the slice name'], answer: 1, explain: 'Workspace names come from the type’s pattern; the template name is what users pick when creating.' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ BW11
  {
    id: 'bw11', track: 'workspaces', order: 11, title: 'Team roles and permissions', source: `${SRC} — Ch. 11`, feature: 'businessWorkspaces',
    domains: ['ws-roles', 'ba-roles'],
    summary: 'Define team roles and permissions on a template, staff the Template Administrator role, predict what happens to roles on creation and moves, and map parent roles in workspace hierarchies.',
    lesson: [
      'Who may do what in a business workspace is decided by **team roles** and **team participants**. Roles — Account Manager, Buyer, Case Worker, Reader — are defined on the **template** with their permissions, and are copied into every workspace created from it. Participants — users and groups — are normally added on each **workspace**, after it is created. A participant inherits the permissions of the role they are added to, so managing access becomes managing team membership.',
      {
        figure: {
          type: 'flow',
          steps: [
            { label: 'Template', sub: 'roles + permissions defined', kind: 'start' },
            { label: 'Workspace created', sub: 'roles copied (not Template Admin)', kind: 'system' },
            { label: 'Participants added', sub: 'on the workspace', kind: 'actor' },
            { label: 'Access', sub: 'role permissions apply', kind: 'end' },
          ],
        },
        caption: 'Roles travel from template to workspace; people are added where the work happens.',
      },
      { h: 'Two special roles' },
      'The **Template Administrator** role appears automatically on every workspace template. Its participants may create and change the template, and it is **never copied** to workspaces — fill it with a small admin group. The **Team Lead** role is marked with a red flag; by default it is the first role you add, and **Set as Team Lead** moves the flag. Team Lead participants can edit the participants of the other roles in their workspace.',
      {
        steps: [
          'Template ▸ Functions ▸ Team Roles and Permissions.',
          'Add Role ▸ name (and description) ▸ Add. The first becomes Team Lead.',
          'Click the role ▸ tick its permissions ▸ Update. Repeat for each role. Done.',
          'Template ▸ Functions ▸ Team Participants ▸ Find & Add ▸ your admin group ▸ role Template Administrator ▸ Submit ▸ Done.',
        ],
        title: 'Roles and the Template Administrator',
        ui: 'Classic View',
      },
      { h: 'Creation and moves' },
      'On creation, all roles and any template participants are copied except the Template Administrator. Created **inside another workspace**, the new workspace also receives the destination’s roles and participants — if **Merge with creation location** is enabled on the template’s Specific tab. When a workspace is **moved**, inherited roles and permissions are removed, directly assigned roles stay, and the destination’s roles are copied only if **Always inherit the permissions from target destination** is set in the Access Control feature settings.',
      { h: 'Hierarchies and role mapping' },
      'Workspaces can live inside workspaces — an Employee workspace holding Absence Case workspaces, for example. The parent template states which kinds of workspace (identified by classification) may be created inside it, and may **map** parent roles onto child roles: the mapped parent role then acts in the child with the child role’s rights. Mapping works downwards only — child members do not gain access to the parent.',
      {
        figure: {
          type: 'tree',
          root: {
            label: 'Employee workspace', icon: 'workspace', note: 'roles: HR Advisor, Line Manager', children: [
              { label: 'Absence Case workspace', icon: 'workspace', note: 'HR Advisor → acts as Case Manager' },
              { label: 'Training Record workspace', icon: 'workspace', note: 'Line Manager → acts as Reviewer' },
            ],
          },
        },
        caption: 'Role mapping in a hierarchy: parent roles reach into child workspaces.',
      },
      { callout: 'exam', text: 'Roles on the template, participants on the workspace; the Template Administrator is never copied; the Team Lead manages the other roles’ participants; role mapping gives parent roles access to children, never the reverse.' },
      'In the handbook: [[bw-team-roles]] and [[bw-workspace-hierarchies]].',
    ],
    keyPoints: [
      'Roles and their permissions are defined on the template; participants are usually added per workspace.',
      'The Template Administrator role controls the template and is not copied to workspaces.',
      'The Team Lead role (red flag; first role by default) can edit other roles’ participants.',
      'Moves remove inherited roles; destination roles are copied only with “Always inherit the permissions from target destination”.',
      'Role mapping lets parent roles act as child roles in workspace hierarchies — downwards only.',
    ],
    missions: [
      {
        id: 'bw11-roles', type: 'practice', title: 'Design and enter a role matrix', xp: 15, requires: ['ws03-template'],
        brief: 'Plan roles as a grid first, then enter them on your template.',
        steps: [
          'On paper, draw a grid: your roles down the side, permissions (See Contents, Add Items, Edit Attributes, Delete, Edit Permissions) across.',
          'Open your Training Customer template ▸ Team Roles and Permissions and make the roles match the grid.',
          'Decide which role is the Team Lead and set it with Set as Team Lead if needed.',
        ],
        reflection: 'Paste or describe your grid, say which role is the Team Lead and why, and explain what a Team Lead can do that the other roles cannot.',
        minWords: 30,
      },
      {
        id: 'bw11-templateadmin', type: 'practice', title: 'Staff the Template Administrator role', xp: 15, requires: ['ws03-template'],
        brief: 'Give template maintenance to a group without leaking access into every workspace.',
        steps: [
          'On your template, open Team Participants ▸ Find & Add.',
          'Add a small administrators group (or yourself, on a training server) to the Template Administrator role; Submit.',
          'Create a test workspace and open its Team Participants: confirm the Template Administrator role is not there.',
        ],
        reflection: 'What did you see in the test workspace’s team, and why is it safer to give template maintainers the Template Administrator role than to add them to a normal role on the template?',
        minWords: 25,
      },
      {
        id: 'bw11-move', type: 'practice', title: 'Predict a move', xp: 15,
        brief: 'Moves are where access surprises happen. Reason it through before you try it.',
        steps: [
          'Ask your administrator (or look in Core System – Feature Administration ▸ Access Control) whether “Always inherit the permissions from target destination” is on.',
          'Pick a scenario: a workspace with a directly assigned role and an inherited role is moved into another workspace that has team roles.',
          'Write down what you expect, then try it on a training server if you can.',
        ],
        reflection: 'For your scenario, list which roles and permissions the workspace keeps, loses and gains after the move, and which setting changes the answer.',
        minWords: 30,
      },
      {
        id: 'bw11-quiz', type: 'quiz', title: 'Knowledge check: team roles', xp: 25,
        questions: [
          { q: 'Which role is added automatically to every workspace template and never copied to workspaces?', options: ['Team Lead', 'Template Administrator', 'Owner', 'Reader'], answer: 1, explain: 'The Template Administrator role governs the template only.' },
          { q: 'By default, which role becomes the Team Lead?', options: ['The last role added', 'The Template Administrator', 'The first role added after the Template Administrator', 'The role with the most permissions'], answer: 2, explain: 'The first role you add gets the red flag; Set as Team Lead changes it.' },
          { q: 'What can participants of the Team Lead role do?', options: ['Edit the participants of the other roles', 'Edit the workspace type', 'Delete the template', 'Change perspective rules'], answer: 0, explain: 'The Team Lead manages the team of its workspace.' },
          { q: 'Where are team participants usually assigned?', options: ['On the template', 'On each business workspace', 'On the workspace type', 'In the perspective'], answer: 1, explain: 'Roles are defined on the template; people are added per workspace (except groups that belong everywhere).' },
          { q: 'A workspace is created inside another business workspace. When does it receive the destination’s roles and participants?', options: ['Always', 'Never', 'Only when merging with the creation location is enabled on the template', 'Only for the Team Lead role'], answer: 2, explain: 'The template’s Specific tab setting controls the merge.' },
          { q: 'A workspace is moved to a folder without team roles. What happens?', options: ['All roles are removed', 'Inherited roles and permissions are removed; directly assigned roles stay', 'Nothing changes', 'The workspace is re-created from the template'], answer: 1, explain: 'Inherited access goes; roles assigned directly to the workspace remain.' },
          { q: 'With role mapping, members of a child workspace role…', options: ['…gain access to the parent workspace', '…lose access to the child', '…do not automatically gain access to the parent', '…become Team Leads'], answer: 2, explain: 'Mapping gives parent roles access to the child, not the other way round.' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ BW12
  {
    id: 'bw12', track: 'workspaces', order: 12, title: 'Template content', source: `${SRC} — Ch. 12`, feature: 'businessWorkspaces',
    domains: ['ws-types', 'ba-ws-types'],
    summary: 'Fill a template with folders, task lists and email folders named with replacement tags, and a moderated forum — then check the content in your lab workspace.',
    lesson: [
      'The content of a template is what every team sees on day one: a standard set of folders, an email folder, a task list, a forum, perhaps a few standard documents. Whatever you place in the template is copied into each new workspace — so plan it with the people who will use it, and keep it lean.',
      {
        figure: {
          type: 'tree',
          root: {
            label: 'Training Customer – Standard', icon: 'template', children: [
              { label: '01 Contracts', icon: 'folder' },
              { label: '02 Correspondence', icon: 'email', note: 'email folder' },
              { label: '03 Orders', icon: 'folder', note: 'optional extra category' },
              { label: 'Follow-up for <Category_…_3 />', icon: 'workflow', note: 'task list with a tag' },
              { label: 'Account discussion', icon: 'wiki', note: 'forum' },
            ],
          },
        },
        caption: 'Template content for the lab’s Training Customer template.',
      },
      { h: 'Folders and their categories' },
      'Folders are added with **Add Folder**. A folder may carry an extra category of its own — optional, but handy when it collects a special kind of document whose attributes users should fill and filter on. Only the workspace category on the template itself is mandatory.',
      { h: 'Replacement tags' },
      'Some names must differ per workspace. A task list called “Follow-up” in every customer workspace would flood people’s assignments with identical names. A replacement tag in the name — `<Category_CatID_AttrID />` — is replaced at creation by an attribute value of the new workspace. Find the IDs on the attributes dump page: append `?func=attributes.dump` to your Content Server URL.',
      {
        steps: [
          'Open `…/cs.exe?func=attributes.dump` and note the IDs of your workspace category and of the attribute you want.',
          'Open the template ▸ Add Item ▸ Task List ▸ name such as “Follow-up for <Category_123456_3 />” ▸ Add.',
          'Add Item ▸ Email Folder ▸ name it (with a tag if useful) ▸ Add. It is email-enabled later, per workspace.',
          'Add Item ▸ Forum ▸ Title ▸ Create; tick Display Header in All Views, type a header, pick moderators ▸ Submit.',
        ],
        title: 'Task list, email folder and forum',
        ui: 'Classic View',
      },
      {
        figure: {
          type: 'flow',
          steps: [
            { label: 'Template name', sub: 'Follow-up for <Category_123456_3 />' },
            { label: 'Workspace created', sub: 'Customer Name = ACME Corp', kind: 'system' },
            { label: 'Item name', sub: 'Follow-up for ACME Corp', kind: 'end' },
          ],
        },
        caption: 'Tags are resolved once, at creation.',
      },
      'The forum is what the Smart View **Discussion** widget shows; the widget expects a Classic **Forum** object. When you add the forum, its settings page lets you show a header text in all views — a good place to say what the forum is for — and choose moderators.',
      { h: 'Plan before you build' },
      'Before adding anything, list what a team really handles for one business object over its life: contracts, offers, correspondence, follow-ups. Group it by process stage rather than by department, decide which parts need restricted access (they become role exceptions on a sub-folder), and review the list with two or three future users. Keep it shallow — every item is copied into every workspace, so a mistake is copied too.',
      { callout: 'warn', text: 'Content added to a template only reaches workspaces created **afterwards**. If your lab workspace “ACME” already exists, add the items to it directly for the hands-on checks below — or create a new workspace after changing the template.' },
      { callout: 'exam', text: 'Tag syntax `<Category_CatID_AttrID />`; IDs from `func=attributes.dump`; tags are especially recommended for **task lists**; the workspace category is mandatory, folder categories are optional.' },
      'In the handbook: [[bw-template-content]] and the design advice in [[ba-template-content]].',
    ],
    keyPoints: [
      'Template content (folders, email folders, task lists, forums, documents) is copied into each new workspace.',
      'Folder categories are optional; the template’s workspace category is mandatory.',
      'Replacement tags `<Category_CatID_AttrID />` personalise item names at creation.',
      'Category and attribute IDs are listed by `?func=attributes.dump`.',
      'Email folders are email-enabled per workspace; forums feed the Discussion widget.',
    ],
    missions: [
      {
        id: 'bw12-tags', type: 'practice', title: 'Build a replacement tag', xp: 15, requires: ['ws02-category'],
        brief: 'Find the real IDs on your server and write a tag that resolves to the customer name.',
        steps: [
          'Open your Content Server URL with `?func=attributes.dump` appended (e.g. `{{csUrl}}?func=attributes.dump`).',
          'Find the Training Customer category: note its ID and the ID of the Customer Name attribute.',
          'Write the full name of a task list using the tag, e.g. “Follow-up for <Category_ID_AttrID />” with your numbers.',
          'Add that task list to your Training Customer template.',
        ],
        reflection: 'Write the exact tag you built, explain which number is which, and say what the task list will be called in a workspace for “ACME Corp” — and what happens to that name if the customer is renamed later.',
        minWords: 30,
      },
      {
        id: 'bw12-tasklist', type: 'hands-on', title: 'A task list in the ACME workspace', xp: 30, requires: ['ws04-create'],
        brief: 'Check that a task list made it into your lab workspace.',
        steps: [
          'If you added a task list to the template before creating “ACME”, it is already there.',
          'Otherwise open the ACME workspace and add one directly: Add Item ▸ Task List (directly in the workspace, not in a sub-folder).',
        ],
        hints: ['Template changes do not reach workspaces that already exist — adding the task list to the template now will not put it into ACME.'],
        checks: [{ kind: 'child', parent: 'wsAcme', typeName: 'task ?list', types: [204], label: 'A task list directly inside the ACME workspace' }],
        open: 'wsAcme',
      },
      {
        id: 'bw12-forum', type: 'hands-on', title: 'A forum in the ACME workspace', xp: 30, requires: ['ws04-create'],
        brief: 'The Discussion widget needs a forum. Put one in your lab workspace.',
        steps: [
          'If your template had a forum when ACME was created, it is already there.',
          'Otherwise open ACME and add Add Item ▸ Forum directly in the workspace; give it a header and a moderator.',
        ],
        hints: ['Some servers label it Discussion; either is accepted.'],
        checks: [{ kind: 'child', parent: 'wsAcme', typeName: 'forum|discussion', types: [215], label: 'A forum or discussion directly inside the ACME workspace' }],
        open: 'wsAcme',
      },
      {
        id: 'bw12-quiz', type: 'quiz', title: 'Knowledge check: template content', xp: 25,
        questions: [
          { q: 'Why should a task list in a workspace template be named with a replacement tag?', options: ['Tags make the task list read-only', 'So tasks from many workspaces don’t all carry the same name', 'Task lists cannot be saved without one', 'It enables email for the task list'], answer: 1, explain: 'Identical names across hundreds of workspaces make assignments impossible to tell apart.' },
          { q: 'Which is the correct replacement tag format?', options: ['{categories.CatID_AttrID}', '<Category_CatID_AttrID />', '[Category:AttrID]', '%Category.AttrID%'], answer: 1, explain: '`<Category_CatID_AttrID />` is used in template item names; `{categories.…}` is the Perspective Manager header syntax.' },
          { q: 'How do you find the category and attribute IDs for a tag?', options: ['Append ?func=attributes.dump to the Content Server URL', 'Open the workspace type’s Advanced tab', 'Look in the perspective code editor', 'Read them from the slice'], answer: 0, explain: 'The attributes dump page lists every category definition with its ID and attribute IDs.' },
          { q: 'Which statement about categories in a template is true?', options: ['Every folder needs a category', 'The workspace category is mandatory; folder categories are optional', 'Categories are not allowed on folders', 'Only email folders may carry categories'], answer: 1, explain: 'Folder categories are optional extras, e.g. for facets on a special folder.' },
          { q: 'When is an email folder from the template given its email address?', options: ['In the template, once for all workspaces', 'On each workspace, by email-enabling its folder', 'Automatically by the workspace type', 'Never — email folders have no address'], answer: 1, explain: 'Each workspace’s copy is email-enabled separately so it gets its own alias.' },
          { q: 'The customer attribute used in a task list tag is changed a year later. What happens to the task list name?', options: ['It updates automatically', 'It stays as it was resolved at creation', 'The task list is deleted', 'It becomes the raw tag again'], answer: 1, explain: 'Tags are resolved once, when the workspace is created.' },
          { q: 'Which Classic object does the Smart View Discussion widget display?', options: ['A Forum', 'A Classic Discussion item', 'A Wiki', 'A Collection'], answer: 0, explain: 'The Discussion widget is associated with a Forum object.' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ BW13
  {
    id: 'bw13', track: 'workspaces', order: 13, title: 'Search for business workspaces', source: `${SRC} — Ch. 13`, feature: 'businessWorkspaces',
    domains: ['ws-using', 'ba-search'],
    summary: 'Give each workspace type a search slice, make XECMWkspLinkRefTypeID queryable, index workspace attributes on child items, re-index safely, and publish a simple (Custom View) search.',
    lesson: [
      'Users find workspaces faster by searching than by browsing. Business workspaces already put their data into the search index — the module creates the regions it needs. Your job is to make that data easy to use: a **slice per workspace type**, a **queryable** type region, **child-item indexing**, and ready-made **simple searches**.',
      {
        figure: {
          type: 'hub',
          center: 'Workspace search',
          items: [
            { label: 'Slice per type', sub: 'XECMWkspLinkRefTypeID:n' },
            { label: 'Queryable region', sub: 'Enterprise Search Manager' },
            { label: 'Child-item indexing', sub: 'workspace type ▸ Advanced' },
            { label: 'Re-indexing', sub: 'test mode, then real run' },
            { label: 'Simple search', sub: 'Custom View Search' },
          ],
        },
        caption: 'The five pieces of workspace search.',
      },
      { h: 'A slice for each workspace type' },
      'Every workspace stores the configuration ID of its type in the index region **XECMWkspLinkRefTypeID**. You can see that ID as `ID_CFG` at the end of the URL when you open the workspace type. A complex query `XECMWkspLinkRefTypeID:4` therefore finds all workspaces of type 4. Test it in Advanced Search, then **Save as Slice** and give users permission to see the slice. In Smart View they pick it from the search box’s slice list; in Classic View from the search dialog.',
      'The region is created automatically when the first workspace — or template — is indexed, but it must be marked **Queryable**: System Object Volume ▸ Enterprise Data Source Folder ▸ Enterprise Search Manager ▸ Properties ▸ Regions. That is a system-administration task.',
      { h: 'Index workspace data on child items' },
      'Documents inside a workspace usually don’t carry the workspace category (and with inheritance switched off, they shouldn’t). On the workspace type’s **Advanced** tab you can enable the indexing of the workspace’s category attributes **on child items**, and choose the **indexable subtypes** (Business Workspace, Document and Email by default; Folder, Task List, Task, Forum, URL, Shortcut, Generation are common additions). A search on a workspace attribute then finds the documents inside the workspace too.',
      {
        steps: [
          'Workspace type ▸ Advanced ▸ tick “Enable the indexing of category attributes … on child items” ▸ Apply.',
          'Configure indexable subtypes ▸ add the types ▸ Update ▸ Save Changes.',
          'Workspace Types list ▸ type’s Functions ▸ Schedule for Re-indexing ▸ run in **test mode** first and read the summary.',
          'Clear test mode ▸ Start ▸ confirm; monitor the Interchange Pools in the Enterprise Data Flow Manager.',
        ],
        title: 'Enable and run child-item indexing',
        ui: 'Classic View',
      },
      { callout: 'note', text: 'The indexing setting applies to items added afterwards; existing items need the re-index, and the type shows “re-indexing required” until then.' },
      { h: 'Simple searches' },
      'A simple search — a **Custom View Search** — is a saved query with a compact form. Build it in Advanced Search (Content Type = Business Workspace, the type’s slice, the workspace category), **Save Search Query**, then **Make Custom View Search** and tick the fields to show. Users reach it from the Classic Business Workspaces ▸ Search menu, from target-browse dialogs and when adding relationships — and in Smart View through the **Custom View Search** widget on a perspective tab.',
      {
        figure: {
          type: 'flow',
          steps: [
            { label: 'Advanced Search', sub: 'type, slice, category' },
            { label: 'Save Search Query' },
            { label: 'Make Custom View Search', sub: 'fields to show' },
            { label: 'Widget / menu', kind: 'end' },
          ],
        },
        caption: 'From a query to a reusable search form.',
      },
      { callout: 'exam', text: 'Slice query: `XECMWkspLinkRefTypeID:<ID_CFG>`. Region: created automatically, made **Queryable** by hand. Child indexing: workspace type ▸ Advanced, new items only until re-indexed. “Simple search” = “Custom View Search”.' },
      'In the handbook: [[bw-search-config]] and [[bw-custom-view-search]].',
    ],
    keyPoints: [
      'Create one search slice per workspace type with the complex query XECMWkspLinkRefTypeID:<ID_CFG>.',
      'The XECMWkspLinkRefTypeID region is created automatically but must be made Queryable.',
      'Child-item indexing adds workspace attributes to the index entries of items inside the workspace.',
      'Changing indexing needs a re-index: test mode first, then the real run; monitor the iPools.',
      'Simple searches are Custom View Searches built from a saved query.',
    ],
    missions: [
      {
        id: 'bw13-sysadmin', type: 'investigate', title: 'Can you do the system-level steps?', xp: 20,
        brief: 'Making a region queryable and monitoring data flows need system administration. Find out whether your account has it.',
        steps: [
          'Look at your own account’s privileges (your profile, or Users and Groups in the Classic View).',
          'Answer yes or no. If no, plan which steps you will ask an administrator to do.',
        ],
        inputs: [{ key: 'sysadmin', label: 'System Administration rights? (yes/no)' }],
        checks: [{ kind: 'answer', input: 'sysadmin', source: 'user.isSysAdmin', compare: 'yesno', label: 'System Administration rights' }],
      },
      {
        id: 'bw13-slice', type: 'practice', title: 'Create a slice for your workspace type', xp: 15, requires: ['ws03-type'],
        brief: 'Let users narrow any search to Training Customer workspaces.',
        steps: [
          'Open your Training Customer workspace type and note the ID_CFG value at the end of the URL.',
          'Tools ▸ Search ▸ Full Text ▸ Look For: Complex Query ▸ XECMWkspLinkRefTypeID:<your value> ▸ Search. Check you get your workspaces.',
          'If nothing is found, ask whether the region is queryable and whether indexing has caught up.',
          'Save as Slice “Training Customer”; give your training users See and See Contents on it.',
          'In Smart View, pick the slice in the search box and search for “ACME”.',
        ],
        reflection: 'Write the query you used, what it returned, and how the slice changes what users see when they search.',
        minWords: 30,
      },
      {
        id: 'bw13-indexing', type: 'practice', title: 'Index workspace data on documents', xp: 15, requires: ['ws04-document'],
        brief: 'Make the Customer Agreement document findable by the customer’s data.',
        steps: [
          'On your Training Customer type ▸ Advanced: enable the indexing of category attributes on child items; Apply.',
          'Configure indexable subtypes: keep Document and Email; add Folder and Task List; Update; Save Changes.',
          'Schedule for Re-indexing in test mode; read the summary; then run it for real.',
          'After a few minutes, search for “10023” (the customer number) and see whether the Customer Agreement document is found.',
        ],
        hints: ['Re-indexing needs the index to be running; on a busy server it can take a while.'],
        reflection: 'Did the search find the document, and why? Explain why this is better than leaving category inheritance switched on.',
        minWords: 30,
      },
      {
        id: 'bw13-customview', type: 'practice', title: 'Publish a simple search', xp: 15, requires: ['bw13-slice'],
        brief: 'Turn a query into a compact form for business users.',
        steps: [
          'Advanced Search: System Attributes ▸ Content Type = Business Workspace; Slices ▸ Training Customer; Categories ▸ Training Customer.',
          'Search to test; then Save Search Query “Find training customers” in your Training Customers folder.',
          'On it: Functions ▸ Make Custom View Search; show Customer Number, Customer Name and Region; title it; Save.',
          'Open it as a normal user and search.',
        ],
        reflection: 'Which fields did you show on the form and why? Where else could users reach this search, in Classic View and in Smart View?',
        minWords: 25,
      },
      {
        id: 'bw13-quiz', type: 'quiz', title: 'Knowledge check: workspace search', xp: 25,
        questions: [
          { q: 'Which complex query defines a slice for the workspace type whose URL ends in ID_CFG=7?', options: ['OTSubType:848', 'XECMWkspLinkRefTypeID:7', 'OTName:7', 'WorkspaceType=7'], answer: 1, explain: 'XECMWkspLinkRefTypeID holds the configuration ID of the workspace type.' },
          { q: 'When is the XECMWkspLinkRefTypeID region created?', options: ['By running a setup script', 'Automatically when the first business workspace (a template counts) is indexed', 'When the first slice is saved', 'When a perspective is created'], answer: 1, explain: 'The module creates the regions automatically; you only make them queryable.' },
          { q: 'Where is a search region made queryable?', options: ['Workspace type ▸ Advanced', 'Enterprise Search Manager ▸ Properties ▸ Regions', 'Perspective Manager ▸ Rules', 'Document Templates administration'], answer: 1, explain: 'Regions are managed on the Enterprise Search Manager in the Enterprise Data Source Folder.' },
          { q: 'After enabling child-item indexing on a type with 2,000 existing workspaces, a search finds only new documents. Why?', options: ['The setting applies to new items; existing ones must be re-indexed', 'The slice is wrong', 'Inheritance is off', 'The category is missing'], answer: 0, explain: 'Schedule for Re-indexing updates existing items.' },
          { q: 'What is the safe first step when scheduling a re-index?', options: ['Run it in test mode without indexing', 'Delete the slice', 'Disable the search grid', 'Restart Content Server'], answer: 0, explain: 'The test run shows what would be processed before the real run.' },
          { q: 'Where do you watch the progress of the re-indexing?', options: ['Enterprise Data Flow Manager ▸ Interchange Pools', 'The Recycle Bin', 'Perspective Manager', 'Team Participants'], answer: 0, explain: 'Status, Pending, Processed and Quarantined counts of the iPools show progress.' },
          { q: 'What is a “simple search” for business workspaces?', options: ['A Custom View Search based on a saved query', 'A system search form only for admins', 'A Best Bet', 'A facet tree'], answer: 0, explain: 'Simple searches are Content Server Custom View Searches.' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ BW14
  {
    id: 'bw14', track: 'workspaces', order: 14, title: 'Creating business workspaces', source: `${SRC} — Ch. 14`, feature: 'businessWorkspaces',
    domains: ['ws-using', 'ws-roles'],
    summary: 'Walk through the Business Workspace wizard, add participants to roles, email-enable the workspace’s email folder and trigger an activity feed.',
    lesson: [
      'With the infrastructure in place — category, columns, classification, location, type, template, roles and content — creating a workspace is quick. In an Extended ECM landscape a leading application often creates workspaces; inside Content Server a person uses the **Business Workspace wizard**, a Smart View form, or a workflow step.',
      {
        figure: {
          type: 'flow',
          steps: [
            { label: 'Type', sub: 'template; generated name', kind: 'start' },
            { label: 'Metadata', sub: 'attributes; required fields' },
            { label: 'Classifications', sub: 'from the template' },
            { label: 'Finish', sub: 'then Continue', kind: 'end' },
          ],
        },
        caption: 'The Classic View wizard: three pages and Finish.',
      },
      'Start it in the location folder with **Add Item ▸ Business Workspace**. The **Type** page shows the template offered there and a name generated from the type’s pattern; classifications come from the template, and end users normally leave them alone. The **Metadata** page shows the template’s category: fill the attributes, required ones first — an automatically numbered reference attribute fills itself. The **Classifications** page confirms the classification; **Finish** creates the workspace. In Smart View use **+ (Add)** or the **Create Business Workspace** icon next to Favorites. A workflow can create workspaces too, with a **Create Workspace** step that maps workflow attributes to the template’s attributes and can keep the result in an Item Reference attribute for later steps.',
      { h: 'First things to do in the new workspace' },
      {
        steps: [
          'Functions ▸ Team Participants (Smart View: Team widget) ▸ Find & Add people and groups to roles. The Template Administrator role is not there.',
          'On the email folder: Functions ▸ Email Enable ▸ keep or change the Email Alias ▸ Enable.',
          'Properties ▸ Categories ▸ change a monitored attribute ▸ Submit — then look at Pulse From Here or the header’s activity feed.',
        ],
        title: 'Staff, connect and watch',
        ui: 'Classic View',
      },
      {
        figure: {
          type: 'matrix',
          cols: ['Done on the template', 'Done on each workspace'],
          rows: [
            { label: 'Define roles and permissions', cells: [true, 'extra roles possible'] },
            { label: 'Add participants', cells: ['Template Admin (and fixed groups)', true] },
            { label: 'Create the email folder', cells: [true, false] },
            { label: 'Email-enable it', cells: [false, true] },
            { label: 'Fill business attributes', cells: ['defaults only', true] },
          ],
        },
        caption: 'Template work versus workspace work.',
      },
      { callout: 'tip', text: 'Moving and copying also work into workspaces: existing folders and documents can be moved into a business workspace (or a template) to migrate older structures.' },
      'After creation, look at what you got: the name from the pattern, the folder the workspace landed in (the type may file it into an attribute-based sub-folder), the template’s folders, email folder, task list and forum, and the attributes in the sidebar or header. Each of those points back to one configuration object, which is how you diagnose a surprise — see [[ws-troubleshooting]].',
      { callout: 'exam', text: 'Wizard pages: **Type → Metadata → Classifications**. Participants are added on the workspace; the Template Administrator is not copied; email-enabling uses **eLink** (Email Alias); attribute changes trigger configured activity feeds shown in **Pulse**.' },
      'In the handbook: [[bw-creation-wizard]]; every creation route: [[ws-create]].',
    ],
    keyPoints: [
      'The Classic wizard has Type, Metadata and Classifications pages, then Finish.',
      'Smart View offers + (Add) and the Create Business Workspace icon in the location folder.',
      'A workflow Create Workspace step needs a template and mapped attribute values.',
      'Participants are added per workspace; the Template Administrator role is never there.',
      'Email folders are email-enabled per workspace (eLink, Email Alias); attribute changes trigger activity feeds.',
    ],
    missions: [
      {
        id: 'bw14-email', type: 'hands-on', title: 'An email folder in the ACME workspace', xp: 30, requires: ['ws04-create'],
        brief: 'The workspace should have an email folder that can receive mail.',
        steps: [
          'If your template had an email folder when ACME was created (e.g. 02 Correspondence), it is already there.',
          'Otherwise open ACME and add Add Item ▸ Email Folder directly in the workspace.',
          'Then email-enable it: Functions ▸ Email Enable ▸ choose an alias ▸ Enable (if eLink is configured on your server).',
        ],
        hints: ['The check looks directly inside the workspace, not in sub-folders.', 'If Email Enable is missing from the menu, eLink is not configured on your server — the folder still counts.'],
        checks: [{ kind: 'child', parent: 'wsAcme', typeName: 'e-?mail folder', types: [751], label: 'An email folder directly inside the ACME workspace' }],
        open: 'wsAcme',
      },
      {
        id: 'bw14-wizard', type: 'practice', title: 'Walk the wizard consciously', xp: 15, requires: ['ws04-create'],
        brief: 'Create another training workspace in the Classic View and notice what each page does.',
        steps: [
          'In your Training Customers folder (Classic View), Add Item ▸ Business Workspace.',
          'On the Type page, note the template and the generated name; Next.',
          'On the Metadata page, try Next with a required field empty and read the message; then fill everything; Next.',
          'On the Classifications page, note the classification; Finish ▸ Continue.',
        ],
        reflection: 'Describe each wizard page in your own words, what was filled in automatically, and what stopped you when a required field was empty.',
        minWords: 30,
      },
      {
        id: 'bw14-pulse', type: 'practice', title: 'Staff the team and trigger an activity', xp: 15, requires: ['ws04-create'],
        brief: 'Do what a team lead does on day one.',
        steps: [
          'Open ACME’s Team Participants (or the Team widget) and add a colleague or group to a role.',
          'Confirm the Template Administrator role is not listed.',
          'Change an attribute in Properties ▸ Categories (e.g. Region) and Submit.',
          'Look for the activity in Pulse From Here (Classic sidebar) or the Smart View header’s activity feed. If nothing appears, find out whether activity rules exist for that attribute.',
        ],
        reflection: 'Who did you add to which role, and what did you see (or not see) in the activity feed after changing the attribute? What must be configured for a message to appear?',
        minWords: 30,
      },
      {
        id: 'bw14-quiz', type: 'quiz', title: 'Knowledge check: creating workspaces', xp: 25,
        questions: [
          { q: 'In which order does the Classic Business Workspace wizard show its pages?', options: ['Metadata, Type, Classifications', 'Type, Metadata, Classifications', 'Classifications, Type, Metadata', 'Type, Team, Perspective'], answer: 1, explain: 'Type (template and generated name), Metadata (attributes), Classifications, then Finish.' },
          { q: 'On the wizard’s Type page, where does the proposed workspace name come from?', options: ['The template name', 'The workspace type’s name pattern', 'The location folder', 'The user’s last search'], answer: 1, explain: 'The name is generated from the type’s pattern using the attributes.' },
          { q: 'Which two Smart View controls start workspace creation in a location folder?', options: ['+ (Add item) and the Create Business Workspace icon', 'Search and Favorites', 'Properties and Permissions', 'Copy and Move'], answer: 0, explain: 'Both open the creation form for the offered template.' },
          { q: 'What does a workflow Create Workspace step require?', options: ['A perspective', 'A workspace template and the attribute values it requires, mapped from workflow attributes', 'A slice', 'A Template Administrator participant'], answer: 1, explain: 'The new workspace can then be kept in an Item Reference attribute for later steps.' },
          { q: 'A team lead opens Team Participants on a new workspace. Which role is missing compared with the template?', options: ['Team Lead', 'Template Administrator', 'All roles', 'None'], answer: 1, explain: 'The Template Administrator role is never copied.' },
          { q: 'What does email-enabling the workspace’s email folder give it?', options: ['An Email Alias so mail can be sent into it', 'A forum', 'A new category', 'A perspective tab'], answer: 0, explain: 'Email Enable (eLink) assigns the folder its own address.' },
          { q: 'What triggers a configured activity feed message about a workspace?', options: ['Opening the workspace', 'Changing a monitored attribute value', 'Adding a favorite', 'Running a search'], answer: 1, explain: 'Activity rules on attributes post messages to Pulse when values change.' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ BW15
  {
    id: 'bw15', track: 'workspaces', order: 15, title: 'Perspectives for Smart View', source: `${SRC} — Ch. 15`, feature: 'businessWorkspaces',
    domains: ['ws-using', 'ba-smart'],
    summary: 'Create and edit a workspace perspective in Perspective Manager: rules, the default layout, Header, Team, Metadata, Discussion, Workspaces and Configuration Volume widgets, widths and tabs.',
    lesson: [
      'A **perspective** is the Smart View page of a business workspace. **Perspective Manager** builds it graphically. Opened from the workspace type (**Manage Perspectives for this workspace type**), it starts with a rule for that type and without the Layout choice, because workspace pages have a fixed layout. Opened from the administration pages (**Perspectives Administration ▸ Open the Perspective Manager**) it has its full functionality — the better start for editing existing perspectives.',
      {
        figure: {
          type: 'layers',
          layers: [
            { label: 'Header', items: ['Title, type, description from tags', 'Embedded Activity Feed'] },
            { label: 'Tab “Overview”', items: ['Team', 'Metadata', 'Discussion'] },
            { label: 'Tab “Documents”', items: ['Node Browsing Table'] },
            { label: 'Your tabs', items: ['e.g. Search: Custom View Search', 'e.g. Recent: Recently Accessed'] },
          ],
        },
        caption: 'The sample layout every new workspace perspective starts with, plus tabs you add.',
      },
      { h: 'General, Rules, Configure' },
      {
        figure: {
          type: 'flow',
          steps: [
            { label: 'General', sub: 'create new / edit existing, title' },
            { label: 'Rules', sub: 'type, template, group, user, device' },
            { label: 'Configure', sub: 'widgets, options, tabs' },
            { label: 'Create / Update', kind: 'system' },
            { label: 'Save Changes on the type', sub: 'when started from the type', kind: 'end' },
          ],
        },
        caption: 'The Perspective Manager tabs in the order you use them.',
      },
      'On **General** you create new or edit existing and set the title. On **Rules** you decide where it applies: conditions on Group, Mobile Device, User, Workspace Template or Workspace Type, with **is / is not**, joined by **AND / OR**, evaluated top to bottom; with no rule it applies to everyone on every device. On **Configure** you place widgets from the **Widget Library** into the working area and set each one in the **Options** pane.',
      {
        steps: [
          'Workspace type ▸ Manage Perspectives for this workspace type ▸ Create new ▸ title.',
          'Rules: check the workspace type rule.',
          'Configure: Header ▸ Workspace ▸ Title ▸ Add Attribute To Field ▸ pick number and name; add a separator.',
          'Overview: Metadata ▸ Category or attribute ▸ Attribute ▸ Check all attributes; Width Two thirds.',
          'Add tab ▸ drag a widget in ▸ set Width ▸ double-click the tab to name it (Multilingual Values).',
          'Create ▸ Close; then Save Changes on the workspace type.',
        ],
        title: 'Create a workspace perspective',
        ui: 'Perspective Manager',
      },
      {
        table: {
          head: ['Widget', 'Shows', 'Key options'],
          rows: [
            ['Header', 'Name, type, description, attributes', 'Title `{name}` → `{categories.…}`; embedded Activity Feed'],
            ['Team', 'Members, and roles without members', 'Width (⅓), Title'],
            ['Metadata', 'Category attributes', 'Groups, order, Hide empty fields'],
            ['Discussion', 'Forum questions and answers', 'Forum; empty = the workspace’s (oldest) forum'],
            ['Workspaces', 'Workspaces of one type', 'Type, empty message, sort, columns (¼)'],
            ['Configuration Volume', 'Document Templates volume access', 'Theme (¼)'],
          ],
        },
      },
      { callout: 'warn', text: 'Created from the workspace type page, the perspective is only kept when you also click **Save Changes** on that page — the step people forget most. And a Perspective Manager session interrupted without saving leaves a **cached configuration** you can resume or clear next time.' },
      { callout: 'exam', text: 'Default layout: Header + Overview (Team, Metadata, Discussion) + Documents (Node Browsing Table). Rules top to bottom; no rule = all users, all devices. Only the Activity Feed can be embedded in the Header. Discussion with no forum chosen = the oldest forum in the workspace.' },
      'Perspectives are stored in the Perspectives volume (a folder per workspace type) and can be moved with Transport. In the handbook: [[bw-perspectives]] and [[bw-perspective-widgets]].',
    ],
    keyPoints: [
      'Perspective Manager opens from the workspace type (no Layout option) or from Perspectives Administration (full functionality).',
      'A new workspace perspective has a Header, an Overview tab (Team, Metadata, Discussion) and a Documents tab (Node Browsing Table).',
      'Rules (Group, Mobile Device, User, Workspace Template, Workspace Type) are evaluated top to bottom; no rule means everyone.',
      'Header titles use tags like {name}, {business_properties.workspace_type_name} and {categories.CatID_AttrID}.',
      'Name tabs by double-clicking them; save with Create/Update — and Save Changes on the workspace type.',
    ],
    missions: [
      {
        id: 'bw15-create', type: 'practice', title: 'Create a perspective for your workspace type', xp: 15, requires: ['ws04-create'],
        brief: 'Give the Training Customer workspace its own Smart View page.',
        steps: [
          'Open your Training Customer workspace type ▸ Manage Perspectives for this workspace type.',
          'Create new; title “Training Customer Perspective”; check the rule on the Rules tab.',
          'Header: replace {name} with Customer Number and Customer Name attributes separated by “ – ”.',
          'Metadata: add all Training Customer attributes; width Two thirds.',
          'Create ▸ Close, then Save Changes on the workspace type. Open ACME in Smart View.',
        ],
        reflection: 'Describe the header and the Overview tab ACME shows now, and the exact text you put in the header title field.',
        minWords: 30,
      },
      {
        id: 'bw15-edit', type: 'practice', title: 'Edit it: widths, a tab and a discussion', xp: 15, requires: ['bw15-create'],
        brief: 'Practise the editing workflow from the administration pages.',
        steps: [
          'Admin ▸ Content Server Administration ▸ Perspectives Administration ▸ Open the Perspective Manager; clear any cached configuration.',
          'Edit existing ▸ browse to your perspective ▸ Configure.',
          'Documents tab: add Recently Accessed (width Full).',
          'Add a tab, name it “Search” by double-clicking it, and add a Custom View Search widget pointing at a saved query (if you built one in bw13).',
          'Check the Discussion widget’s forum option — leave it empty to use the workspace’s forum.',
          'Update ▸ confirm ▸ Close. Reload ACME in Smart View.',
        ],
        reflection: 'What did you change, what does the Discussion widget show in ACME, and why does the empty forum option still work?',
        minWords: 30,
      },
      {
        id: 'bw15-quiz', type: 'quiz', title: 'Knowledge check: perspectives', xp: 25,
        questions: [
          { q: 'Perspective Manager is opened from the workspace type’s “Manage Perspectives” link. What is different from opening it via the administration pages?', options: ['The Layout option is not offered', 'Rules cannot be added', 'Widgets cannot be resized', 'Nothing can be saved'], answer: 0, explain: 'Workspace pages have a defined layout; the admin-page entry gives full functionality.' },
          { q: 'Which widgets are on the Overview tab of a new workspace perspective?', options: ['Favorites and Recently Accessed', 'Team, Metadata and Discussion', 'Node Browsing Table only', 'Workspaces and Configuration Volume'], answer: 1, explain: 'The Documents tab holds the Node Browsing Table.' },
          { q: 'A perspective has no rules at all. Who sees it?', options: ['Nobody', 'Only administrators', 'All users on all devices', 'Only mobile users'], answer: 2, explain: 'Rules restrict a perspective; without one it applies everywhere.' },
          { q: 'Which value is the default Title of the Header widget?', options: ['{categories.name}', '{name}', '{business_properties.workspace_type_id}', '{owner_user_id}'], answer: 1, explain: 'Title defaults to the node name; Type defaults to the workspace type name.' },
          { q: 'Which widget can be embedded in the Header widget?', options: ['Team', 'Metadata', 'Activity Feed', 'Discussion'], answer: 2, explain: 'Currently only the Activity Feed can be embedded; it needs Pulse.' },
          { q: 'The Discussion widget’s forum option is empty and the workspace holds two forums. What does it show?', options: ['Nothing', 'The newest forum', 'The oldest forum', 'Both forums'], answer: 2, explain: 'It links automatically to the workspace’s forum — the oldest one if there are several.' },
          { q: 'You created a perspective from the workspace type page and closed Perspective Manager. What else must you do?', options: ['Click Save Changes on the workspace type page', 'Re-index the type', 'Restart the server', 'Nothing'], answer: 0, explain: 'Forgetting Save Changes on the type is the classic mistake.' },
          { q: 'How do you name a new tab?', options: ['Type in the Options pane Title', 'Double-click the tab to open Multilingual Values', 'Rename it in the Perspectives volume', 'Tabs cannot be named'], answer: 1, explain: 'Tab names are multilingual values set by double-clicking the tab.' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ BW17
  {
    id: 'bw17', track: 'workspaces', order: 17, title: 'Capstone: a workspace type from scratch', source: `${SRC} — Appendix B`, feature: 'businessWorkspaces',
    domains: ['ws-types', 'ws-roles', 'ws-using'],
    summary: 'Configure a complete second kind of business workspace — “Training Supplier” — from design to perspective, then create and test a real workspace that the trainer verifies.',
    lesson: [
      'Time to put every chapter together without a recipe at your elbow. You will build a second kind of workspace on your training server — a **Training Supplier** — from nothing: design, building blocks, workspace type, template with inheritance off, roles, content, search and a perspective; then create a supplier workspace and test it as its users would.',
      {
        figure: {
          type: 'timeline',
          items: [
            { when: 'Design', label: 'Answer the design questions', sub: 'data, name, place, folders, roles, search, layout' },
            { when: 'Build', label: 'Category, classification, location', sub: 'building blocks' },
            { when: 'Configure', label: 'Type, template, roles, content', sub: 'inheritance off' },
            { when: 'Polish', label: 'Search and perspective', sub: 'slice, indexing, header, tabs' },
            { when: 'Prove', label: 'Create, staff, test', sub: 'the trainer checks the result' },
          ],
        },
        caption: 'The capstone in five phases.',
      },
      { h: 'Your design' },
      {
        table: {
          head: ['Decision', 'Suggested answer'],
          rows: [
            ['Category “Training Supplier”', 'Supplier Number (required), Supplier Name (required), Country (pop-up), Risk Class (pop-up)'],
            ['Name pattern', 'Supplier Number – Supplier Name'],
            ['Classification', 'Training Workspaces ▸ Training Supplier'],
            ['Location', 'Your “Training Customers” folder — give it the Training Supplier classification as well (a folder may carry several)'],
            ['Template', '“Training Supplier – Standard”, inheritance off, folders 01 Qualification, 02 Contracts, 03 Audits, an email folder, a task list with a tag'],
            ['Roles', 'Buyer (Team Lead), Quality Engineer, Finance Reviewer; Template Administrator = your admin group'],
            ['Search', 'Slice “Training Supplier”; child-item indexing'],
            ['Perspective', 'Header “number – name”, Metadata with all attributes, a Documents tab'],
          ],
        },
      },
      {
        figure: {
          type: 'tree',
          root: {
            label: 'Training Customers', icon: 'folder', note: 'classified Training Customer AND Training Supplier', children: [
              { label: '10023 – ACME Corp', icon: 'workspace', note: 'from the earlier lab' },
              { label: 'S-001 – Northwind Metals', icon: 'workspace', note: 'your capstone workspace', children: [
                { label: '01 Qualification', icon: 'folder' },
                { label: '02 Contracts', icon: 'folder' },
                { label: '03 Audits', icon: 'folder' },
                { label: 'Supplier mail', icon: 'email' },
              ] },
            ],
          },
        },
        caption: 'What the trainer will look for.',
      },
      { callout: 'warn', text: 'For this lab, do **not** let the type file manually created workspaces into another location or an attribute sub-folder (leave “use also for manual creation” off, or point it at Training Customers without a sub-path). The trainer looks directly inside “Training Customers”.' },
      'Follow the order from the handbook walkthrough [[bw-capstone]] and use the chapter guides when you are unsure: [[bw-create-template]], [[bw-team-roles]], [[bw-template-content]], [[bw-search-config]], [[bw-perspectives]], [[bw-creation-wizard]].',
      { h: 'Testing like a user' },
      'A configuration is not finished when the last screen is saved; it is finished when each role can do its job. Create a workspace, add one test participant per role, and try the everyday actions: add a document to a restricted folder, edit an attribute, post in the forum, search with the slice. Then change a monitored attribute and look for the activity message. Keep notes of every fix — they become the checklist for deploying the configuration to the next system with Transport.',
      { callout: 'exam', text: 'If you can rebuild this from memory in the right order — category → classification → location → type → template (inheritance off) → roles → content → search → perspective → create and test — you have mastered the configuration side of business workspaces.' },
    ],
    keyPoints: [
      'Design first: data, name, location, structure, roles, search and layout.',
      'Build bottom-up so every object exists before something refers to it.',
      'A folder can carry several classifications and so offer several templates.',
      'Switch inheritance off on the template; use indexing for findability.',
      'Prove the configuration by creating a workspace and testing it as each role.',
    ],
    missions: [
      {
        id: 'bw17-design', type: 'practice', title: 'Write the design sheet', xp: 15,
        brief: 'Every configuration screen asks a design question. Answer them before you click.',
        steps: [
          'Copy the design table from the lesson and adapt it to a real kind of business object at your organisation (or keep Training Supplier).',
          'Decide the attributes (mark the required ones), the name pattern, the location, folders, roles with permissions, search and the perspective tabs.',
        ],
        reflection: 'Paste or summarise your design sheet: attributes, name pattern, location, folders, roles with their permissions, and the tabs of your perspective — and say which decision you found hardest.',
        minWords: 40,
      },
      {
        id: 'bw17-configure', type: 'practice', title: 'Build the Training Supplier configuration', xp: 20, requires: ['bw17-design', 'ws02-location'],
        brief: 'Build every object in order on your training server.',
        steps: [
          'Category “Training Supplier”; classification Training Workspaces ▸ Training Supplier; add that classification to your “Training Customers” folder too.',
          'Workspace type “Training Supplier”: name pattern Supplier Number – Supplier Name; location Training Customers (no sub-path).',
          'Template “Training Supplier – Standard”: type, classification, category; disable category and classification inheritance.',
          'Roles Buyer, Quality Engineer, Finance Reviewer; Template Administrator participants.',
          'Content: folders 01 Qualification, 02 Contracts, 03 Audits; an email folder; a task list named with a replacement tag.',
          'Slice, child-item indexing, and a perspective with a header built from attributes.',
        ],
        reflection: 'List each object you created in the order you created it, and note any step where something did not work the first time and how you fixed it.',
        minWords: 40,
      },
      {
        id: 'bw17-types', type: 'investigate', title: 'Count the workspace types again', xp: 20, requires: ['bw17-configure'],
        brief: 'Your new type should now be one of the server’s workspace types.',
        steps: ['Open Enterprise ▸ Business Workspaces ▸ Workspace Types.', 'Type how many workspace types exist now, including Training Supplier.'],
        inputs: [{ key: 'types', label: 'Number of workspace types', placeholder: 'e.g. 6' }],
        checks: [{ kind: 'answer', input: 'types', source: 'bwTypes.count', compare: 'number', label: 'Number of business workspace types' }],
      },
      {
        id: 'bw17-create', type: 'hands-on', title: 'Create the Northwind Metals supplier workspace', xp: 40, requires: ['ws02-location'],
        brief: 'The proof: a real workspace from your new type and template, with the template’s folders and the category.',
        steps: [
          'Open “Training Customers” in your sandbox.',
          'Create a workspace from “Training Supplier – Standard” (Smart View + or Classic Add Item ▸ Business Workspace).',
          'Supplier Name “Northwind Metals”, the other attributes as you like. Finish.',
          'Add a participant to the Buyer role and change Risk Class once to see the activity.',
        ],
        hints: [
          'The workspace must be directly inside “Training Customers” and its name must contain “Northwind”.',
          'No Training Supplier template offered? The folder needs the Training Supplier classification too.',
          'Fewer than two folders? Add them to the template before creating the workspace, or add them to the workspace afterwards.',
        ],
        checks: [
          { kind: 'child', parent: 'wsLocation', nameRegex: 'northwind', types: [848], typeName: '^business ?workspace$', saveAs: 'bwSecond', label: 'A business workspace for Northwind in “Training Customers”' },
          { kind: 'count', parent: 'bwSecond', types: [0], min: 2, label: 'It contains at least two folders from the template' },
          { kind: 'categories', node: 'bwSecond', min: 1, label: 'It carries the business category' },
        ],
        open: 'wsLocation',
      },
      {
        id: 'bw17-test', type: 'practice', title: 'Test it as its users', xp: 20, requires: ['bw17-create'],
        brief: 'A configuration is finished when its users can work with it.',
        steps: [
          'Open Northwind Metals in Smart View: check the header, Team, Metadata and Documents tab.',
          'Add a document to 02 Contracts; after indexing, search for “Northwind” with the Training Supplier slice.',
          'If you can, sign in as a test user in each role and try to add, edit and delete.',
          'Write down what you would change before transporting it to another system.',
        ],
        reflection: 'Summarise your test: what worked for each role, what the search found, and the changes you would make before moving this configuration on with Transport.',
        minWords: 40,
      },
      {
        id: 'bw17-quiz', type: 'quiz', title: 'Knowledge check: the whole configuration', xp: 25,
        questions: [
          { q: 'Which order builds a new workspace kind without dangling references?', options: ['Template, type, category, classification', 'Category, classification, location, type, template, roles, content, search, perspective', 'Perspective, template, type, category', 'Roles, perspective, category, type'], answer: 1, explain: 'Each object refers to the ones above it.' },
          { q: 'One folder must offer both the Customer and the Supplier templates. What do you do?', options: ['Create two location folders with the same name', 'Give the folder both classifications', 'Merge the two workspace types', 'Put both templates into the folder'], answer: 1, explain: 'A folder may carry several classifications; each matching template is offered.' },
          { q: 'Users must find contracts by supplier name, but documents have no Supplier category. Best configuration?', options: ['Enable category inheritance on the template', 'Enable child-item indexing on the workspace type and re-index', 'Add the Supplier category to every document by hand', 'Create a facet per supplier'], answer: 1, explain: 'Indexing adds workspace attributes to the children’s index entries without copying metadata.' },
          { q: 'A new Supplier workspace shows an empty header. What is the most likely gap?', options: ['The template has no category, or the header title does not use its attributes', 'The slice is missing', 'The Template Administrator is empty', 'The email folder is not enabled'], answer: 0, explain: 'The header reads the workspace category through the perspective’s tags.' },
          { q: 'Which step in the capstone requires system administration rather than business administration rights?', options: ['Making the XECMWkspLinkRefTypeID region queryable', 'Adding folders to the template', 'Adding participants to roles', 'Naming a perspective tab'], answer: 0, explain: 'Region settings live on the Enterprise Search Manager in the System Object Volume.' },
          { q: 'The perspective was created but workspaces still open in the default layout. What was probably forgotten?', options: ['Save Changes on the workspace type page after creating it', 'Re-indexing', 'Email-enabling the folder', 'Disabling inheritance'], answer: 0, explain: 'Created from the type page, the perspective must also be saved there.' },
        ],
      },
    ],
  },
];
