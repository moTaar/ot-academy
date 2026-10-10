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
];
