'use strict';
// Practice paths: hands-on missions in the learner's own Content Server, in
// the order that builds something real. Every mission listed is checked
// live through the REST API (or, for practice missions, self-reported), the
// same as on its module page. Stages group the steps; `guides` are the
// handbook pages to have open while doing them.

module.exports = [
  {
    id: 'sandbox',
    title: 'Sandbox foundations',
    level: 'basic',
    color: '#0f6e62',
    summary: 'Build a complete training area in your Personal Workspace: folders, documents, versions, metadata, permissions, search tools and collaboration items — every step checked on your server.',
    intro: 'Everything happens inside one folder in your Personal Workspace, so nothing you do touches shared content. Work top to bottom: later steps reuse the folders and documents you create in earlier ones. Open each step, do it in Content Server, then press “Check my work”.',
    needs: 'Any Content Server account. Some steps need optional modules (compound documents, wikis, records…); skip those your server doesn\'t have.',
    stages: [
      { title: 'Set up your sandbox', summary: 'One private folder with a predictable structure.', missions: ['u01-sandbox', 'u01-structure', 'u01-describe', 'u01-ids'], guides: ['pf-study-method'] },
      { title: 'Add content', summary: 'The ways content gets into Content Server.', missions: ['u02-upload', 'u02-textdoc', 'u02-url', 'u02-mime'] },
      { title: 'Manage documents', summary: 'Versions, reservations, copies and the Recycle Bin.', missions: ['u03-version', 'u03-reserve', 'u03-unreserve', 'u03-copy', 'u03-temp', 'u03-delete'] },
      { title: 'Organise and reuse', summary: 'Compound documents, favorites, shortcuts, generations and collections.', missions: ['u04-create', 'u04-elements', 'u06-favorite', 'u06-shortcut', 'u06-generation', 'u06-collection', 'u13-rename', 'u13-fav'] },
      { title: 'Describe it: metadata', summary: 'Categories, inheritance, nicknames, virtual folders and classifications.', missions: ['u07-apply', 'u07-folder', 'u07-inherit', 'u08-nickname', 'u08-virtual', 'c08-tree', 'c08-apply'] },
      { title: 'Find it: search tools', summary: 'Saved queries, search forms and prospectors.', missions: ['u09-savedquery', 'u09-searchform', 'u09-prospector'] },
      { title: 'Secure it: permissions and groups', summary: 'Who can do what, and the groups behind it.', missions: ['u10-owner', 'u10-grant', 'u10-private', 'u11-groups', 'u11-department', 'u11-create-group'] },
      { title: 'Collaborate', summary: 'Email, discussions, news, tasks, polls, projects, wikis and workflows.', missions: ['u05-save-email', 'c03-discussion', 'c03-channel', 'c03-tasklist', 'c03-poll', 'c04-create', 'c10-wiki', 'u15-wiki', 'c02-find-map', 'c02-initiate', 'c02-assignments'] },
      { title: 'Tailor the interface', summary: 'Custom views and appearances.', missions: ['c09-customview', 'c09-appearance'] },
    ],
  },
  {
    id: 'workspaces-lab',
    title: 'Business workspaces lab',
    level: 'intermediate',
    color: '#3b7f99',
    summary: 'Configure and build a working business workspace in your own Content Server, end to end: category, classification, location, workspace type and template, then a workspace you create and fill.',
    intro: 'This lab follows the order an administrator really uses: build the pieces a workspace type depends on, configure the type and its template, then create a workspace and work in it. The pieces you build are checked live; configuration screens the REST API can\'t see are practice steps you describe in your own words.',
    needs: 'A Content Server with Extended ECM / Business Workspaces installed (the platform map shows it), and an account with administration rights for the configuration stages — a sandbox or training server, never production.',
    stages: [
      { title: 'Understand', summary: 'What a workspace is made of, and what this server already has.', missions: ['ws01-explore', 'ws01-anatomy', 'ws01-quiz'], guides: ['ws-how-they-work', 'ws-setup-roadmap'] },
      { title: 'Build the building blocks', summary: 'Everything a workspace type depends on, created first.', missions: ['ws02-category', 'ws02-classification', 'ws02-location', 'ws02-quiz'], guides: ['ws-setup-roadmap', 'ba-categories-metadata', 'ba-classifications'] },
      { title: 'Configure the type and template', summary: 'The workspace type, its template, roles and perspective.', missions: ['ws03-type', 'ws03-template', 'ws03-roles', 'ws03-count', 'ws03-quiz'], guides: ['ba-workspace-types', 'ba-workspace-templates', 'ba-template-content', 'ba-roles-permissions'] },
      { title: 'Create and use a workspace', summary: 'Create a workspace, check what the template gave it, and work in it.', missions: ['ws04-create', 'ws04-document', 'ws04-team', 'ws04-related', 'ws04-quiz'], guides: ['ws-create', 'ws-working-in'] },
      { title: 'Troubleshoot and transport', summary: 'When creation fails, and how a finished setup moves to the next environment.', missions: ['ws05-diagnose', 'ws05-transport', 'ws05-quiz'], guides: ['ws-troubleshooting', 'ba-transport-deploy'] },
    ],
  },
  {
    id: 'workspaces-course',
    title: 'Business workspaces, chapter by chapter',
    level: 'advanced',
    color: '#2f6f8f',
    summary: 'Every exercise of the Business Workspaces course (2-0108), redone on your own server in course order: rights, category, columns and facets, classifications, activity feeds, location, workspace type, template, roles, content, search, creation, perspectives, editing — and a capstone that builds a second workspace type from nothing.',
    intro: 'This path follows the order of OpenText\'s Business Workspaces course. It shares its lab objects with the Business workspaces lab (the “Training Customers” location and the ACME workspace), so do that lab\'s first stages when this path asks for them. Steps the REST API can see — categories, folders, workspaces and what is inside them — are checked live; configuration screens it can\'t see are practice steps you describe.',
    needs: 'A training or sandbox Content Server with business workspaces enabled and an account with business administration rights (permissions on the Business Workspaces, Categories, Classifications, Facets and Document Templates volumes, and the object and usage privileges the course lists). Never production.',
    stages: [
      { title: 'Know your way around', summary: 'Chapters 1–2: what workspaces are, and using them in Smart View and Classic View.', missions: ['bw01-types', 'bw01-usecases', 'bw01-vocab', 'bw02-tour', 'bw02-classic'], guides: ['bw-intro-concepts', 'bw-terminology', 'bw-navigate-smart-view', 'bw-navigate-classic'] },
      { title: 'Rights and dependencies', summary: 'Chapter 3: modules, the Business Workspaces volume, permissions and privileges.', missions: ['bw03-sysadmin', 'bw03-groups', 'bw03-version', 'bw03-trees', 'bw03-rights-plan'], guides: ['bw-dependencies-modules', 'bw-admin-page-volume', 'bw-rights'] },
      { title: 'The category', summary: 'Chapter 4: a category folder and a workspace category.', missions: ['bw04-folder', 'bw04-category', 'bw04-design', 'ws02-category'], guides: ['bw-categories-for-types', 'bw-text-reference'] },
      { title: 'Columns, sidebar and facets', summary: 'Chapter 5: what users see when they browse workspaces.', missions: ['bw05-columns', 'bw05-display', 'bw05-facets'], guides: ['bw-custom-columns', 'bw-sidebar', 'bw-facets'] },
      { title: 'Classifications and activity feeds', summary: 'Chapters 6–7: connecting templates to locations, and what shows up in the activity feed.', missions: ['bw06-tree', 'ws02-classification', 'bw06-classify', 'bw07-admin', 'bw07-pulse', 'bw07-rules'], guides: ['bw-classifications', 'bw-activity-feeds'] },
      { title: 'The location folder', summary: 'Chapter 8: where workspaces live.', missions: ['ws02-location', 'bw08-regions', 'bw08-classify'], guides: ['bw-location-folder'] },
      { title: 'The workspace type', summary: 'Chapter 9: every setting of the type, sidebar widgets, enabling creation.', missions: ['bw09-type', 'bw09-widgets', 'bw09-count', 'bw09-creation'], guides: ['bw-workspace-type-settings', 'bw-type-checklist'] },
      { title: 'Template, roles and content', summary: 'Chapters 10–12: the template, its team roles, hierarchies and content with replacement tags.', missions: ['bw10-settings', 'bw10-tree', 'bw10-template', 'bw11-roles', 'bw11-templateadmin', 'bw11-move', 'bw12-tags'], guides: ['bw-document-template-settings', 'bw-create-template', 'bw-team-roles', 'bw-workspace-hierarchies', 'bw-template-content'] },
      { title: 'Search', summary: 'Chapter 13: slices, indexing and simple searches.', missions: ['bw13-sysadmin', 'bw13-slice', 'bw13-indexing', 'bw13-customview'], guides: ['bw-search-config', 'bw-custom-view-search'] },
      { title: 'Create and staff a workspace', summary: 'Chapter 14: the creation wizard, participants, the email folder, activity.', missions: ['ws04-create', 'bw14-wizard', 'bw14-email', 'bw12-tasklist', 'bw12-forum', 'bw14-pulse'], guides: ['bw-creation-wizard', 'ws-create'] },
      { title: 'Perspectives', summary: 'Chapter 15: the Smart View layout of the workspace.', missions: ['bw15-create', 'bw15-edit'], guides: ['bw-perspectives', 'bw-perspective-widgets'] },
      { title: 'Use and edit it', summary: 'Chapter 16: work in the workspace and change it after creation.', missions: ['bw16-description', 'bw16-tasklist', 'bw16-folder', 'bw16-url', 'bw16-category', 'bw16-team', 'bw16-editpage', 'bw16-insights'], guides: ['bw-using-smart-view', 'bw-using-classic', 'bw-editing'] },
      { title: 'Capstone', summary: 'A second workspace type, from design to a tested workspace, on your own.', missions: ['bw17-design', 'bw17-configure', 'bw17-types', 'bw17-create', 'bw17-test'], guides: ['bw-capstone', 'ws-troubleshooting'] },
    ],
  },
];
