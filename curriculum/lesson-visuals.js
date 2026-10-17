'use strict';
// Extra visuals shown under each module's lesson: diagrams, callouts and small
// tables that make the lesson easier to picture. Format: curriculum/CONTENT.md.
// All text is original to this trainer.

module.exports = {
  // ================================================================ BUSINESS USER
  u01: [
    {
      figure: {
        type: 'tree',
        root: {
          label: 'Content Server', icon: 'server', note: 'one big tree of nodes',
          children: [
            { label: 'Enterprise Workspace', icon: 'volume', note: 'shared by the organisation',
              children: [{ label: 'Departments', icon: 'folder' }, { label: 'Projects', icon: 'project' }] },
            { label: 'Personal Workspace', icon: 'volume', note: 'private by default',
              children: [{
                label: 'Your sandbox folder', icon: 'folder', note: 'all course practice lives here',
                children: [
                  { label: '01 Drafts', icon: 'folder' },
                  { label: '02 Review', icon: 'folder' },
                  { label: '03 Final', icon: 'folder' },
                ],
              }] },
            { label: 'Categories volume', icon: 'volume', note: 'metadata templates' },
            { label: 'Classifications volume', icon: 'volume' },
          ],
        },
      },
      caption: 'The two roots every user works in. Your training sandbox sits in your Personal Workspace, so nothing you practise touches shared content.',
    },
    {
      figure: {
        type: 'compare',
        items: [
          { title: 'Classic UI', tone: 'info', points: ['Functions menu on every item', 'Add Item menu', 'Personal / Enterprise / Tools menus', 'Every admin and configuration page', 'Node ID after `objId=` in the URL'] },
          { title: 'Smart View', tone: 'accent', points: ['Tiles laid out by a perspective', 'Action bar appears when you select items', '“+” Add button and drag-and-drop', 'Simpler, touch-friendly, role-based', 'Node ID after `/nodes/` in the URL'] },
        ],
      },
      caption: 'Same repository, same permissions — two ways of looking at it.',
    },
    { callout: 'remember', title: 'Node IDs', text: 'Every item has a unique numeric node ID. It never changes when the item is renamed or moved, which is why support staff and integrations ask for it.' },
  ],

  u02: [
    {
      figure: {
        type: 'hub', center: 'Getting content in',
        items: ['Add Item ▸ Document', 'Drag-and-drop', 'New Office document', 'Text document editor', 'Email-enabled folder', 'Enterprise Connect'],
      },
      caption: 'Six roads into the repository. Whichever you use, the item lands in a container and takes that container’s permissions.',
    },
    {
      figure: { type: 'menu', title: 'Add Item', items: ['Folder', 'Document', 'Text Document', 'URL', 'Shortcut', 'Compound Document', 'Collection'], highlight: 'Document', note: 'Only the types you may create in this container are listed.' },
      caption: 'The Classic UI Add Item menu. Smart View offers the same through the “+” button.',
    },
    {
      table: {
        head: ['You want to…', 'Permission needed on the item or folder'],
        rows: [
          ['See that an item exists', 'See'],
          ['Open, view, download or copy it', 'See Contents'],
          ['Add a folder', 'Add Items'],
          ['Add a document', 'Add Items **and** Reserve'],
        ],
        caption: 'The minimum rights behind everyday content actions.',
      },
    },
  ],

  u03: [
    {
      figure: {
        type: 'flow',
        steps: [
          { label: 'Reserve', sub: 'write-lock for you', kind: 'start' },
          { label: 'Download', sub: 'local copy' },
          { label: 'Edit offline', kind: 'actor' },
          { label: 'Add Version', sub: 'upload the new file' },
          { label: 'Unreserve', sub: 'others may edit again', kind: 'end' },
        ],
      },
      caption: 'The offline editing round trip. Edit online does the reserve and unreserve for you.',
    },
    {
      figure: {
        type: 'timeline',
        items: [
          { when: 'v1', label: 'First upload', sub: 'oldest — deleted first' },
          { when: 'v2', label: 'Edited', sub: 'locked: protected' },
          { when: 'v3', label: 'Edited' },
          { when: 'v4', label: 'New version', sub: 'pushes the count over Max. Versions = 3' },
        ],
      },
      caption: 'With a version limit of 3, adding v4 removes the oldest unprotected version. Locked versions and versions a generation points to survive.',
    },
    {
      figure: {
        type: 'compare',
        items: [
          { title: 'Copy', tone: 'info', points: ['Original stays where it is', 'New, independent item with a new node ID', 'Takes the destination’s permissions', 'You become the owner of the copy'] },
          { title: 'Move', tone: 'warn', points: ['The original itself relocates', 'Same node ID, same history', 'Keeps its own permissions', 'Needs Delete permission on the item'] },
        ],
      },
      caption: 'Copy versus Move — a classic exam pairing.',
    },
    { callout: 'exam', text: 'Deleted items wait in **Tools ▸ Recycle Bin** until purged. Setting Max. Versions needs **Delete Versions**; seeing minor versions needs **Reserve**.' },
  ],

  u04: [
    {
      figure: {
        type: 'tree',
        root: {
          label: 'Training Manual', icon: 'compound', note: 'one deliverable, many parts',
          children: [
            { label: '1 Master document', icon: 'doc', note: 'always listed first' },
            { label: '2 Chapter 1', icon: 'doc' },
            { label: '3 Chapter 2', icon: 'doc' },
            { label: '4 Appendix set', icon: 'compound', note: 'nested compound document' },
            { label: '5 Legal notice', icon: 'shortcut', note: 'shortcut or generation' },
          ],
        },
      },
      caption: 'Elements are numbered; Reorganize renumbers them. The Outline view summarises this structure.',
    },
    {
      figure: {
        type: 'timeline',
        items: [
          { when: 'Release 1.0', label: 'First approved edition', sub: 'major snapshot' },
          { when: 'Revision 1.1', label: 'Typos fixed', sub: 'minor snapshot' },
          { when: 'Revision 1.2', label: 'New screenshots' },
          { when: 'Release 2.0', label: 'New product version', sub: 'major snapshot' },
        ],
      },
      caption: 'Releases (major) and revisions (minor) freeze the whole compound document at a moment in time.',
    },
    { callout: 'remember', text: 'Releases and revisions travel with their compound document — they have no Move or Copy of their own.' },
  ],

  u05: [
    {
      figure: {
        type: 'compare',
        items: [
          { title: 'Attachment', tone: 'fail', points: ['Creates an uncontrolled copy', 'Out of date as soon as someone edits', 'Escapes permissions and audit'] },
          { title: 'Email Link / short link', tone: 'pass', points: ['Points at the one governed item', 'Always the current version', 'Recipient still needs See Contents'] },
        ],
      },
      caption: 'Share the link, not the file.',
    },
    {
      figure: {
        type: 'flow',
        steps: [
          { label: 'Email in Outlook', kind: 'start' },
          { label: 'Save as .msg / .eml', sub: 'or drag with Enterprise Connect' },
          { label: 'Add to the project folder' },
          { label: 'Email object', sub: 'sender, recipients, date as metadata', kind: 'system' },
          { label: 'Found by search', kind: 'end' },
        ],
      },
      caption: 'Filing email next to the documents it concerns keeps the whole story in one place.',
    },
    {
      table: {
        head: ['Short link', 'Opens'],
        rows: [['…/open/<nickname>', 'The item itself'], ['…/properties/<nickname>', 'The item’s General properties page']],
      },
    },
  ],

  u06: [
    {
      figure: {
        type: 'tree',
        root: {
          label: 'Your sandbox folder', icon: 'folder',
          children: [
            { label: '01 Drafts', icon: 'folder', children: [{ label: 'Project Plan', icon: 'doc', note: 'the one original' }] },
            { label: '02 Review', icon: 'folder', children: [{ label: 'Shortcut to Project Plan', icon: 'shortcut', note: 'always the latest version' }] },
            { label: '03 Final', icon: 'folder', children: [{ label: 'Project Plan - Published', icon: 'doc', note: 'generation: one fixed version' }] },
            { label: 'Reading List', icon: 'collection', note: 'references gathered from anywhere' },
          ],
        },
      },
      caption: 'One document, reachable from three places — without a single copy.',
    },
    {
      figure: {
        type: 'compare',
        items: [
          { title: 'Favorite', tone: 'xp', points: ['Personal list', 'Only you see it'] },
          { title: 'Shortcut', tone: 'info', points: ['Pointer in a folder', 'Opens the current version', 'Deleting it leaves the original'] },
          { title: 'Generation', tone: 'accent', points: ['Points at one version', 'Needs a different name', 'Protects that version'] },
          { title: 'Collection', tone: 'pass', points: ['Gathers items from anywhere', 'Act on them as a group', 'Holds references, not copies'] },
        ],
      },
      caption: 'Four ways to reach content without duplicating it.',
    },
  ],

  u07: [
    {
      figure: {
        type: 'hub', center: 'Category “Project Info”',
        items: ['Client — Text field', 'Due Date — Date', 'Status — Popup list', 'Owner — User', 'Set “Review”: Reviewed By + Review Date'],
      },
      caption: 'A category is a reusable template of attributes. An attribute set groups related attributes; mark the attributes inside it as required, not the set.',
    },
    {
      figure: {
        type: 'tree',
        root: {
          label: '03 Final', icon: 'folder', note: 'category applied',
          children: [
            { label: 'Inherited Metadata Test', icon: 'doc', note: 'gets the category on add' },
            { label: 'Any new sub-folder', icon: 'folder', note: 'inherits too' },
          ],
        },
      },
      caption: 'Put the category on the folder and every new item added there inherits it — metadata without relying on memory.',
    },
    {
      figure: {
        type: 'flow',
        steps: [
          { label: 'Category edited', sub: 'needs Reserve on it', kind: 'start' },
          { label: 'Items show “upgradable”' },
          { label: 'Upgrade', sub: 'one item', kind: 'decision' },
          { label: 'Upgrade Items', sub: 'all items, from the category', kind: 'end' },
        ],
      },
      caption: 'Changing a category does not silently rewrite existing items; you upgrade them.',
    },
    {
      table: {
        head: ['Task', 'Permission'],
        rows: [['Change attribute values on an item', 'Edit Attributes (on the item)'], ['Edit the category definition', 'Reserve (on the category)']],
      },
    },
  ],

  u08: [
    {
      figure: {
        type: 'flow',
        steps: [
          { label: 'Default nickname', sub: 'the node ID, e.g. 123456', kind: 'start' },
          { label: 'Change nickname', sub: 'unique word, e.g. ota-jsmith' },
          { label: 'Short link works', sub: '…/open/ota-jsmith', kind: 'end' },
        ],
      },
      caption: 'Nicknames must be unique across the whole system.',
    },
    {
      figure: {
        type: 'compare',
        items: [
          { title: 'Columns', tone: 'info', points: ['Display metadata in the list', 'Global: set by Knowledge Managers or admins', 'Personal: picked by each user'] },
          { title: 'Facets', tone: 'accent', points: ['Filter what is listed', 'Content Filter sidebar', 'Save a filter as a virtual folder'] },
        ],
      },
      caption: 'Columns show; facets filter.',
    },
    {
      figure: {
        type: 'flow',
        steps: ['Open a big folder', 'Content Filter ▸ Document Type = PDF', 'Modified = this month', { label: 'Save as virtual folder', kind: 'end' }],
      },
      caption: 'A virtual folder remembers a faceted selection so you can reopen it with one click.',
    },
  ],

  u09: [
    {
      figure: {
        type: 'flow',
        steps: [
          { label: 'Type terms + operators', kind: 'start' },
          { label: 'Choose slice / location', sub: 'scope the index' },
          { label: 'Results', kind: 'system' },
          { label: 'Refine with facets', sub: 'type, date, creator' },
          { label: 'Save', sub: 'query, form or prospector', kind: 'end' },
        ],
      },
      caption: 'A search from first term to reusable result.',
    },
    {
      figure: {
        type: 'compare',
        items: [
          { title: 'Saved query', tone: 'info', points: ['Saves specific criteria', 'Re-runs against current data on demand'] },
          { title: 'Search form', tone: 'accent', points: ['Saves the search page framework', 'With or without terms, plus display options'] },
          { title: 'Prospector', tone: 'xp', points: ['Keeps running', 'Collects newly indexed matches'] },
        ],
      },
      caption: 'Three ways to keep a search — the exam loves to mix them up.',
    },
    {
      table: {
        head: ['Query', 'Finds'],
        rows: [
          ['budget and 2024', 'Both words'],
          ['budget or forecast', 'Either word'],
          ['plan but not draft', '“plan”, excluding “draft”'],
          ['"project plan"', 'The exact phrase'],
          ['proj*', 'project, projection, projector…'],
        ],
        caption: 'Search bar operators.',
      },
    },
  ],

  u10: [
    {
      figure: {
        type: 'ladder',
        steps: [
          { label: 'See', sub: 'name in lists' },
          { label: 'See Contents', sub: 'open, download, copy' },
          { label: 'Modify', sub: 'change name, description' },
          { label: 'Edit Attributes', sub: 'category values' },
          { label: 'Add Items', sub: 'add to a container' },
          { label: 'Reserve', sub: 'lock, add versions' },
          { label: 'Delete Versions', sub: 'and version limits' },
          { label: 'Delete', sub: 'delete and move' },
          { label: 'Edit Permissions', sub: 'change the ACL' },
        ],
      },
      caption: 'The permission ladder, lowest first. Each level builds on the ones below it.',
    },
    {
      figure: {
        type: 'matrix',
        cols: ['See', 'See Contents', 'Modify', 'Add Items', 'Delete', 'Edit Perms'],
        rows: [
          { label: 'Reader group', cells: [true, true, false, false, false, false] },
          { label: 'Contributor group', cells: [true, true, true, true, false, false] },
          { label: 'Owner', cells: [true, true, true, true, true, true] },
          { label: 'Public Access (private folder)', cells: [false, false, false, false, false, false] },
        ],
      },
      caption: 'A typical ACL on “02 Review”: roles expressed as groups in Assigned Access, plus the Default Access entries.',
    },
    {
      figure: {
        type: 'tree',
        root: {
          label: 'Folder (owner Bob)', icon: 'folder', note: 'ACL: Bob, Owner Group, Reviewers',
          children: [
            { label: 'Ann adds a document', icon: 'doc', note: 'same ACL, but Ann is the owner with Bob’s owner rights' },
            { label: 'Copied in', icon: 'doc', note: 'behaves like a new add' },
            { label: 'Moved in', icon: 'doc', note: 'keeps its old ACL' },
          ],
        },
      },
      caption: 'Inheritance at a glance: owner is a role, not a person.',
    },
    { callout: 'exam', text: 'Applying a change to **This Item & Sub-Items** skips every sub-item on which you lack Edit Permissions.' },
  ],

  u11: [
    {
      figure: {
        type: 'tree',
        root: {
          label: 'Groups', icon: 'group',
          children: [
            { label: 'DefaultGroup', icon: 'group', note: 'fallback department', children: [{ label: 'Admin', icon: 'user' }] },
            { label: 'Sales', icon: 'group', note: 'department group', children: [
              { label: 'Sales EMEA', icon: 'group', note: 'nested group' },
              { label: 'Ann', icon: 'user' },
            ] },
            { label: 'Business Administrators', icon: 'group' },
          ],
        },
      },
      caption: 'Every user has one department group; groups can contain other groups.',
    },
    {
      figure: {
        type: 'compare',
        items: [
          { title: 'Permissions', tone: 'info', points: ['Per item (the ACL)', 'See … Edit Permissions', 'Granted by whoever has Edit Permissions'] },
          { title: 'Privileges', tone: 'warn', points: ['System-wide abilities', 'Log in, create users/groups, create restricted item types', 'Granted by administrators'] },
        ],
      },
      caption: 'Do not confuse what you may do to one item with what you may do in the whole system.',
    },
    { callout: 'note', text: 'System Administration rights bypass permission filtering entirely. A group leader can manage only the membership of their group.' },
  ],

  u12: [
    {
      figure: {
        type: 'flow',
        steps: [
          { label: 'Event happens', sub: 'item added, version, workflow step', kind: 'start' },
          { label: 'Matches an interest?', sub: 'general or specific', kind: 'decision' },
          { label: 'Logged in Report 1/2/3', kind: 'system' },
          { label: 'Sent on schedule', sub: 'days, hours, minutes', kind: 'end' },
        ],
      },
      caption: 'Notification is two settings: what you care about (interests) and when you hear about it (report settings).',
    },
    {
      figure: {
        type: 'compare',
        items: [
          { title: 'General interests', tone: 'info', points: ['System-wide event types', 'Pick the ones with “me / my / I”', 'Can be defaulted per department group'] },
          { title: 'Specific interests', tone: 'accent', points: ['Set on one item', 'Functions ▸ Set Notification', 'Sent in addition to general ones'] },
        ],
      },
      caption: 'Too many interests produce reports nobody reads.',
    },
    {
      figure: { type: 'menu', title: 'Personal', items: ['Personal Workspace', 'Favorites', 'Assignments', 'Workflows', 'Notification', 'Reports'], highlight: 'Notification' },
      caption: 'Where your own things live in the Classic UI.',
    },
  ],

  u13: [
    {
      figure: {
        type: 'layers',
        layers: [
          { label: 'Header', items: ['Home', 'Search', 'Your profile menu'] },
          { label: 'Perspective', items: ['Chosen by role or location'], note: 'set up by administrators' },
          { label: 'Tiles (widgets)', items: ['Favorites', 'Recently Accessed', 'My Assignments', 'Enterprise', 'Personal Workspace'] },
        ],
      },
      caption: 'A Smart View home page is a perspective made of tiles.',
    },
    {
      figure: {
        type: 'hub', center: 'Selected item',
        items: ['Rename', 'Edit', 'Share / copy link', 'Download', 'Reserve', 'Copy / Move', 'Add version', 'Permissions', 'Properties & categories', 'Delete'],
      },
      caption: 'Select an item and the action bar offers the everyday actions.',
    },
  ],

  u14: [
    {
      figure: {
        type: 'hub', center: 'Enterprise Connect',
        items: ['Windows Explorer pane', 'Office Save As', 'Outlook drag & drop', 'Send and Save', 'Preview pane', 'Search', 'Briefcases', 'Work offline'],
      },
      caption: 'Content Server inside the desktop tools people already use.',
    },
    {
      figure: {
        type: 'cycle', center: 'Briefcase',
        steps: ['Pick documents', 'Download to laptop', 'Work offline', 'Return changes', 'New versions on server'],
      },
      caption: 'A briefcase takes a set of documents out for offline work and brings them back.',
    },
  ],

  // ================================================================ COLLABORATION
  c01: [
    {
      figure: {
        type: 'hub', center: 'Collaboration toolbox',
        items: ['Workflows', 'Task lists', 'Discussions', 'News channels', 'Polls', 'Projects', 'Communities', 'Pulse', 'Reminders', 'Classifications'],
      },
      caption: 'Most of these surface under the Personal menu.',
    },
    {
      figure: {
        type: 'matrix',
        cols: ['Coordinate work', 'Communicate', 'Shared space'],
        rows: [
          { label: 'Workflow', cells: [true, false, false] },
          { label: 'Task list', cells: [true, false, false] },
          { label: 'Discussion', cells: [false, true, false] },
          { label: 'News channel', cells: [false, true, false] },
          { label: 'Project', cells: [true, true, true] },
          { label: 'Community', cells: [false, true, true] },
        ],
      },
      caption: 'Pick the lightest tool that fits the job.',
    },
  ],

  c02: [
    {
      figure: {
        type: 'lanes',
        lanes: [
          { label: 'Initiator', cells: ['Start + attach doc', '', '', 'Revise', ''] },
          { label: 'Reviewer', cells: ['', 'Review', '', '', ''] },
          { label: 'Approver', cells: ['', '', 'Approve?', '', 'Approve'] },
          { label: 'Content Server', cells: ['Create instance', 'Notify', 'Route', 'Notify', 'Finish'] },
        ],
      },
      caption: 'One workflow instance as swimlanes: who does which step over time. A rejection loops back to the initiator.',
    },
    {
      figure: {
        type: 'hub', center: 'Work package',
        items: ['General (instructions, due date)', 'Attachments', 'Comments', 'Attributes', 'Forms'],
      },
      caption: 'What travels with every step. Only General and Overview are always present.',
    },
    {
      figure: {
        type: 'compare',
        items: [
          { title: 'Proxy', tone: 'info', points: ['Set in My Account ▸ Settings ▸ Workflow', 'One user, one level deep', 'Your steps also appear for the proxy', 'Audit shows who really acted'] },
          { title: 'Delegate (step)', tone: 'warn', points: ['Button on a step, if the map allows', 'Task leaves your list for good', 'You are no longer responsible'] },
          { title: 'Reassign (manager)', tone: 'accent', points: ['Workflow manager action', 'Moves a stuck step to someone else'] },
        ],
      },
      caption: 'Three ways a step changes hands.',
    },
  ],

  c03: [
    {
      figure: {
        type: 'matrix',
        cols: ['Folder permission', 'Work-item access'],
        rows: [
          { label: 'Reader', cells: ['See Contents', 'Read'] },
          { label: 'Contributor', cells: ['Modify', 'Write'] },
          { label: 'Manager', cells: ['Edit Permissions', 'Administer'] },
          { label: 'Anyone else', cells: ['See or nothing', 'None (hidden)'] },
        ],
      },
      caption: 'Work items map the folder’s ACL onto four simple levels when they are created.',
    },
    {
      figure: {
        type: 'tree',
        root: {
          label: 'Launch Plan', icon: 'workflow', note: 'task list',
          children: [
            { label: 'Milestone: Go-live', icon: 'page', note: 'target date' },
            { label: 'Group: Marketing', icon: 'folder', children: [{ label: 'Write press release', icon: 'doc' }, { label: 'Book venue', icon: 'doc' }] },
            { label: 'Group: IT', icon: 'folder', children: [{ label: 'Set up website', icon: 'doc' }] },
          ],
        },
      },
      caption: 'Task groups organise tasks; milestones tie them to key dates.',
    },
    {
      figure: {
        type: 'compare',
        items: [
          { title: 'Discussion', tone: 'info', points: ['Topics and replies', 'Can be email-enabled'] },
          { title: 'News channel', tone: 'accent', points: ['News items', 'One-to-many announcements'] },
          { title: 'Task list', tone: 'xp', points: ['Tasks, groups, milestones', 'Summary pages'] },
          { title: 'Poll', tone: 'pass', points: ['Multiple choice or multiple response', 'Open over a date range'] },
        ],
      },
      caption: 'The four classic work items.',
    },
  ],

  c04: [
    {
      figure: {
        type: 'matrix',
        cols: ['See / See Contents', 'Modify / Add / Reserve', 'Delete', 'Edit Permissions'],
        rows: [
          { label: 'Coordinators', cells: [true, true, true, true] },
          { label: 'Members', cells: [true, true, 'own items', 'own items'] },
          { label: 'Guests', cells: [true, false, false, false] },
          { label: 'Public Access', cells: [false, false, false, false] },
        ],
      },
      caption: 'Default project roles on items inside a project.',
    },
    {
      figure: {
        type: 'flow',
        steps: ['General info', 'Content', 'Participants', 'Presentation', { label: 'Project ready', kind: 'end' }],
      },
      caption: 'The Project Creation Wizard.',
    },
    { callout: 'exam', text: 'The Coordinators group is always the owner group of project items and cannot be removed. Public Access gets nothing by default.' },
  ],

  c05: [
    {
      figure: {
        type: 'timeline',
        items: [
          { when: 'Day 0', label: 'Reminder created', sub: 'on a document or folder' },
          { when: 'Due − 2 days', label: 'Activation alert', sub: 'you are told it is coming' },
          { when: 'Due date', label: 'Due', sub: 'process it from the email or the list' },
          { when: 'After due', label: 'Escalation', sub: 'escalation assignees are alerted' },
        ],
      },
      caption: 'The life of one reminder.',
    },
    {
      figure: { type: 'cycle', steps: ['Active', 'In Progress', 'Completed'], center: 'Status' },
      caption: 'Update the status as you work; the default list filter hides completed reminders.',
    },
    { callout: 'tip', text: 'Substitutes cover all your reminders for one period of validity — easier than reassigning each reminder before a holiday.' },
  ],

  c06: [
    {
      figure: {
        type: 'tree',
        root: {
          label: 'Global feed', icon: 'search', note: 'everything you may see',
          children: [{
            label: 'Pulse from Here', icon: 'folder', note: 'a container and all below',
            children: [{ label: 'Current node feed', icon: 'doc', note: 'one item' }],
          }],
        },
      },
      caption: 'The three feed scopes, from widest to narrowest.',
    },
    {
      figure: { type: 'hub', center: 'Pulse', items: ['Status updates', 'Comments and replies', 'Likes', '@mentions', 'Private messages', 'Follow colleagues', 'Content updates'] },
      caption: 'What you can do in an activity feed. Item permissions and privacy settings decide who sees what.',
    },
  ],

  c07: [
    {
      figure: {
        type: 'tree',
        root: {
          label: 'Community directory', icon: 'volume',
          children: [
            { label: 'Engineering', icon: 'folder', children: [{ label: 'Outdoor Gear Community', icon: 'group', note: 'run by a facilitator' }] },
            { label: 'Sales', icon: 'folder', children: [{ label: 'Key Accounts Community', icon: 'group' }] },
          ],
        },
      },
      caption: 'Subscribe to a directory to receive update reports about it.',
    },
    {
      figure: { type: 'hub', center: 'Community', items: ['Home page', 'Library', 'Members', 'Calendar', 'Q&A', 'Blogs', 'FAQs', 'Forums', 'Wikis', 'Mail archive'] },
      caption: 'The tools a facilitator can switch on.',
    },
  ],

  c08: [
    {
      figure: {
        type: 'compare',
        items: [
          { title: 'Content Server classification', tone: 'info', points: ['Subject tree for browsing and search', 'Independent of storage location', 'Core since CS 16.2.0'] },
          { title: 'RM classification', tone: 'warn', points: ['Also links to a retention schedule', 'Drives disposition', 'Part of Records Management'] },
        ],
      },
      caption: 'Two kinds of classification.',
    },
    {
      figure: {
        type: 'tree',
        root: {
          label: 'Products (classification tree)', icon: 'classification',
          children: [
            { label: 'Backpacks', icon: 'classification', children: [
              { label: 'Spec sheet (in Engineering)', icon: 'doc' },
              { label: 'Price list (in Sales)', icon: 'doc' },
            ] },
            { label: 'Tents', icon: 'classification' },
          ],
        },
      },
      caption: 'Folders say where an item is stored; classification says what it is about.',
    },
  ],

  c09: [
    {
      figure: {
        type: 'layers',
        layers: [
          { label: 'Appearance', items: ['Header / footer branding'], note: 'global or location-based' },
          { label: 'Custom view', items: ['customview.html at the top'] },
          { label: 'Featured items', items: ['Highlighted documents'] },
          { label: 'Folder list', items: ['Columns', 'Folder icons'] },
        ],
      },
      caption: 'The building blocks of a designed folder page, top to bottom.',
    },
    {
      figure: {
        type: 'flow',
        steps: [
          { label: 'Local appearance applies?', kind: 'decision' },
          { label: 'Several? First alphabetically wins' },
          { label: 'Else global appearance', sub: 'if you have See Contents on it', kind: 'end' },
        ],
      },
      caption: 'How Content Server picks the appearance you see.',
    },
  ],

  c10: [
    {
      figure: {
        type: 'tree',
        root: {
          label: 'Team Wiki', icon: 'wiki',
          children: [
            { label: 'Main page', icon: 'page', note: 'Index page in Classic UI' },
            { label: 'Other wiki pages', icon: 'page' },
            { label: 'Sidebars', icon: 'page', note: 'shown beside every page' },
            { label: 'Overview page', icon: 'page', note: 'pages A–Z' },
            { label: 'Page history', icon: 'page', note: 'every version' },
          ],
        },
      },
      caption: 'The parts of a wiki in Smart View.',
    },
    {
      figure: {
        type: 'flow',
        steps: [{ label: 'Select a document', kind: 'start' }, 'Start workflow', 'Choose the workflow', 'Fill in and send', { label: 'Step in assignee’s list', kind: 'end' }],
      },
      caption: 'Starting a workflow from a document in Smart View.',
    },
  ],

  c11: [
    {
      figure: {
        type: 'layers',
        layers: [
          { label: 'Header', items: ['Workspace name and icon', 'Key metadata'] },
          { label: 'Overview tab', items: ['Team', 'Metadata', 'Recently Accessed', 'Activity'] },
          { label: 'Documents tab', items: ['Folders and files of this workspace'] },
        ],
      },
      caption: 'The anatomy of a Connected Workspace.',
    },
    {
      figure: {
        type: 'compare',
        items: [
          { title: 'Tempo Box', tone: 'info', points: ['Sync and share', 'Desktop and mobile devices'] },
          { title: 'OpenText Core', tone: 'accent', points: ['Secure sharing outside the organisation', 'External people get access by invitation'] },
        ],
      },
      caption: 'Sharing beyond the browser.',
    },
  ],

  // ================================================================ ADMIN FOUNDATIONS
  a01: [
    {
      figure: {
        type: 'layers',
        layers: [
          { label: 'Clients', items: ['Browser (Classic, Smart View)', 'Enterprise Connect', 'Business apps'] },
          { label: 'Web tier', items: ['Web server', 'Gateway: cs.exe / llisapi.dll / servlet', 'REST API /api/v1, /api/v2'] },
          { label: 'Content Server engine', items: ['Business logic', 'Permission checks', 'Modules'], note: 'OTDS supplies users and SSO' },
          { label: 'Data', items: ['Database: metadata', 'Storage / EFS: file content'] },
          { label: 'Search grid', items: ['DCS', 'Update Distributor', 'Index / Search Engines', 'Search Federator'] },
        ],
      },
      caption: 'Content Server architecture, top to bottom.',
    },
    {
      figure: {
        type: 'flow',
        steps: [
          { label: 'Browser', kind: 'actor' },
          { label: 'Web server + gateway', kind: 'system' },
          { label: 'CS engine', sub: 'checks permissions', kind: 'system' },
          { label: 'Database', sub: 'metadata' },
          { label: 'External File Store', sub: 'file content', kind: 'end' },
        ],
      },
      caption: 'The path of “open document”.',
    },
    {
      figure: {
        type: 'flow',
        steps: ['New / changed item', 'Document Conversion', 'Update Distributor', 'Index Engines', { label: 'Search Engines ← Federator', kind: 'end' }],
      },
      caption: 'How content reaches the search index — and how queries come back out.',
    },
  ],

  a02: [
    {
      figure: {
        type: 'compare',
        items: [
          { title: 'Permissions', tone: 'info', points: ['Per item ACL', 'Who can do what to this item'] },
          { title: 'Privileges', tone: 'warn', points: ['System-wide', 'Log in, public access, create users/groups, user admin, system admin', 'Item-creation privileges'] },
        ],
      },
      caption: 'Two independent layers of control.',
    },
    {
      figure: {
        type: 'ladder',
        steps: [
          { label: 'Log-in', sub: 'may sign in' },
          { label: 'Create item types', sub: 'restricted types' },
          { label: 'Create/modify users & groups' },
          { label: 'User Administration rights' },
          { label: 'System Administration rights', sub: 'sees everything' },
        ],
      },
      caption: 'Privileges by reach. Grant the top rungs sparingly.',
    },
    { callout: 'remember', text: 'The Administration pages (…?func=admin.index) ask for a separate administration password on top of your login.' },
  ],

  a03: [
    {
      figure: {
        type: 'timeline',
        items: [
          { when: 'Day 0', label: 'Invoice filed', sub: 'RM classification applied' },
          { when: 'Year end', label: 'Event: fiscal close', sub: 'retention clock starts' },
          { when: '+7 years', label: 'Retention ends', sub: 'item becomes eligible' },
          { when: 'Disposition', label: 'Review, then destroy', sub: 'unless on hold' },
        ],
      },
      caption: 'A retention schedule turned into a timeline.',
    },
    {
      figure: {
        type: 'flow',
        steps: [
          { label: 'Retention expired', kind: 'start' },
          { label: 'On hold?', kind: 'decision' },
          { label: 'Disposition action', sub: 'review, destroy, transfer' },
          { label: 'Done', kind: 'end' },
        ],
        loop: 'On hold → wait until the hold is released',
      },
      caption: 'Hold beats retention.',
    },
  ],

  a04: [
    {
      figure: {
        type: 'flow',
        steps: [
          { label: 'Start', kind: 'start' },
          { label: 'Review', sub: 'user step, role' },
          { label: 'Approved?', sub: 'evaluate step', kind: 'decision' },
          { label: 'Publish', sub: 'user step' },
          { label: 'End', kind: 'end' },
        ],
        loop: 'Not approved → back to the author',
      },
      caption: 'The “OTA Review Flow” map from the mission.',
    },
    {
      figure: { type: 'hub', center: 'Step types', items: ['User step', 'Evaluate step', 'Milestone', 'Sub-map', 'Item handler', 'Start / End'] },
      caption: 'Building blocks in the Workflow Designer.',
    },
    { callout: 'tip', text: 'Use workflow roles in the map and choose people at start time — one map then serves every team.' },
  ],

  a05: [
    {
      figure: {
        type: 'compare',
        items: [
          { title: 'Folders', tone: 'info', points: ['Where it is stored', 'Inherited permissions'] },
          { title: 'Categories', tone: 'accent', points: ['Structured attributes', 'Search, columns, facets, workflow'] },
          { title: 'Classifications', tone: 'xp', points: ['What it is about', 'RM: retention'] },
        ],
      },
      caption: 'Good designs use all three on purpose.',
    },
    {
      figure: {
        type: 'matrix',
        cols: ['Search', 'Facets', 'Columns', 'Retention'],
        rows: [
          { label: 'Category attribute', cells: [true, true, true, false] },
          { label: 'RM classification', cells: [true, true, false, true] },
          { label: 'Full text', cells: [true, false, false, false] },
        ],
      },
      caption: 'Metadata pays off several times over.',
    },
    { callout: 'warn', text: 'Free-text fields are where metadata quality dies. Prefer popup lists and table-key lookups for values people must search on.' },
  ],

  a06: [
    {
      figure: {
        type: 'tree',
        root: {
          label: 'Customer: Acme Corp', icon: 'workspace', note: 'linked to the customer in SAP / Salesforce',
          children: [
            { label: 'Contracts', icon: 'folder' },
            { label: 'Correspondence', icon: 'folder' },
            { label: 'Related: Order 4711', icon: 'workspace', note: 'related workspace' },
            { label: 'Related: Order 4712', icon: 'workspace' },
          ],
        },
      },
      caption: 'One business object, one workspace — and related workspaces for linked objects.',
    },
    {
      figure: {
        type: 'flow',
        steps: [
          { label: 'Business object in app', kind: 'actor' },
          { label: 'Workspace type', sub: 'mapping, naming, location', kind: 'system' },
          { label: 'Template', sub: 'folders, categories, roles' },
          { label: 'Business workspace', kind: 'end' },
        ],
      },
      caption: 'How a business workspace comes to life.',
    },
  ],
};
