'use strict';
// Track 2 — Collaboration: workflows, work items, projects, social features.
// Topics follow the "Collaborating in Content Server 16.2" course outline;
// all lesson text, missions and questions are original to this trainer.

const SRC = 'Collaborating in Content Server 16.2';

module.exports = [
  // ------------------------------------------------------------------ C01
  {
    id: 'c01', track: 'collab', title: 'Collaboration overview', source: `${SRC} — Ch. 1`,
    summary: 'The collaboration toolbox and where each tool lives.',
    lesson: [
      'Content Server supports teams in several ways: workflows and task lists coordinate work; discussions, news channels and polls communicate; projects and communities give teams a shared space; Pulse adds a social activity feed; reminders keep dates in view; classifications offer another way to find things.',
      'Most tools surface under the Personal menu: Assignments, Workflows, Projects, News, Discussions, Task Lists, Pulse, Notification and Communities.',
    ],
    keyPoints: ['You can ask for notification on any item you can access.', 'Choose the lightest tool that fits: a discussion before a project, a task list before a workflow.'],
    missions: [
      {
        id: 'c01-tour', type: 'practice', title: 'Walk the Personal menu', xp: 15,
        steps: ['Open each of: Personal ▸ Assignments, Workflows, Projects, News, Discussions, Task Lists, Pulse, Notification.', 'Note which ones already contain something for you.'],
        reflection: 'Which collaboration tools are already in use for you, and which are empty?',
      },
      {
        id: 'c01-quiz', type: 'quiz', title: 'Knowledge check: collaboration tools', xp: 20,
        questions: [
          { q: 'Where do you see workflow steps waiting for you?', options: ['Personal ▸ Assignments', 'Tools ▸ Recycle Bin', 'Enterprise ▸ Categories', 'My Account ▸ Settings'], answer: 0, explain: 'Assignments lists the work (workflow steps, tasks) assigned to you.' },
          { q: 'What is Pulse?', options: ['A backup tool', 'An activity feed with status updates and comments', 'A search slice', 'A version control setting'], answer: 1, explain: 'Pulse shows what is happening and lets people comment and reply.' },
          { q: 'Why use classifications when you already have folders?', options: ['They replace permissions', 'They provide another way to organise and find information', 'They store document content', 'They are required for versioning'], answer: 1, explain: 'Classifications give alternative, subject-based views across folders.' },
          { q: 'What does the community directory provide?', options: ['A list of users', 'A hierarchy of directories listing communities', 'A list of categories', 'Workflow maps'], answer: 1, explain: 'Communities are organised in a directory you can browse and subscribe to.' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ C02
  {
    id: 'c02', track: 'collab', title: 'Workflows: taking part', source: `${SRC} — Ch. 2 & 10`, feature: 'workflow',
    summary: 'Start workflows, process steps, reassign and set a proxy.',
    lesson: [
      'A workflow map is the reusable design of a business process; each time it is started it creates a workflow instance. Steps are assigned to users, groups or roles and appear on the assignee\'s Assignments page.',
      'Every step opens a work package: the Attachments page (documents that travel with the process), the Comments page and the Attributes page (data collected along the way). The instance map shows where a running workflow is.',
      'If allowed, you can reassign a task. Before a holiday, set a proxy (My Account ▸ Settings ▸ Workflow tab): your workflow assignments also appear for the proxy, while the audit trail still records who really did the work.',
    ],
    keyPoints: [
      'A proxy must be a user, not a group, and cannot pass your work on to another proxy.',
      'Task-list tasks are not shown to your proxy — only workflow assignments.',
      'Steps can often be processed by email.',
    ],
    missions: [
      {
        id: 'c02-find-map', type: 'investigate', title: 'Find a workflow map', xp: 20,
        steps: [
          'Browse the Enterprise Workspace (or ask a colleague) to find a workflow map you are allowed to start.',
          'Note its node ID (after objId= in the Classic UI, after /nodes/ in Smart View) and its exact name.',
          'Type both below.',
        ],
        inputs: [
          { key: 'mapId', label: 'Node ID of the workflow map', placeholder: 'e.g. 123456' },
          { key: 'map', label: 'Its exact name' },
        ],
        checks: [
          { kind: 'nodeAnswer', input: 'mapId', types: [128], typeName: '^workflow map$', kindLabel: 'a workflow map', saveAs: 'wfMap', label: 'The ID opens a workflow map' },
          { kind: 'answer', input: 'map', source: 'ref.name:wfMap', compare: 'text', label: 'The name matches that map' },
        ],
      },
      {
        id: 'c02-initiate', type: 'hands-on', title: 'Start a workflow on your document', xp: 40, requires: ['u02-upload'],
        steps: [
          'Start a workflow: Classic — open the map\'s Functions menu ▸ Initiate; Smart View — select “Project Plan” and choose Start workflow.',
          'Attach “Project Plan” if it is not attached already.',
          'Fill in the start step and send it on.',
        ],
        checks: [{ kind: 'apiCount', source: 'workflowsInitiated', min: 1, label: 'You have initiated at least one workflow', hint: 'Check Personal ▸ Workflows to see whether the workflow started.' }],
      },
      {
        id: 'c02-assignments', type: 'investigate', title: 'Count your assignments', xp: 15,
        steps: ['Open Personal ▸ Assignments (Smart View: My Assignments tile).', 'Count the items listed.'],
        inputs: [{ key: 'count', label: 'Number of assignments', placeholder: '0' }],
        checks: [{ kind: 'answer', input: 'count', source: 'assignments.count', compare: 'number', label: 'Assignment count' }],
      },
      {
        id: 'c02-process', type: 'practice', title: 'Process a step', xp: 20,
        steps: ['Open an assignment.', 'Look at its Attachments, Comments and Attributes pages.', 'Add a comment and complete (or send on) the step.'],
        reflection: 'What information did the work package give you, and what did you add before sending it on?',
      },
      {
        id: 'c02-proxy', type: 'practice', title: 'Set and clear a proxy', xp: 15,
        steps: ['My Account ▸ Settings ▸ Workflow tab.', 'Choose a colleague as your workflow proxy and save.', 'Then clear the field again.'],
        reflection: 'Name two limits of the proxy feature.',
      },
      {
        id: 'c02-quiz', type: 'quiz', title: 'Knowledge check: workflows', xp: 35,
        questions: [
          { q: 'Which statement about workflow proxies is true?', options: ['You can name a group as proxy', 'Your proxy can forward to their own proxy', 'You name one user; the proxy cannot pass your work on further', 'Proxies also receive your task-list tasks'], answer: 2, explain: 'Proxy is one level deep, to a user only, and covers workflow assignments only.' },
          { q: 'Your proxy completes a step for you. What does the audit trail show?', options: ['Your name', 'The proxy — the user who actually did it', 'Nobody', 'The workflow manager'], answer: 1, explain: 'The audit trail records the actual user.' },
          { q: 'Where do you find the documents a step needs?', options: ['The Attributes page', 'The Attachments page', 'The Comments page', 'The instance map'], answer: 1, explain: 'Attachments travel with the process.' },
          { q: 'What is the difference between a workflow map and an instance?', options: ['None', 'The map is the design; each start creates an instance', 'Instances are templates for maps', 'Maps run, instances are archived'], answer: 1, explain: 'Maps are reusable definitions; instances are running processes.' },
          { q: 'Where do you set a workflow proxy?', options: ['Personal ▸ Assignments', 'My Account ▸ Settings ▸ Workflow tab', 'The workflow map', 'Tools ▸ Recycle Bin'], answer: 1, explain: 'The Workflow tab of your Settings holds the proxy field.' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ C03
  {
    id: 'c03', track: 'collab', title: 'Discussions, news, task lists and polls', source: `${SRC} — Ch. 3`,
    summary: 'The classic work items and their simplified permissions.',
    lesson: [
      'Work items are lightweight collaboration objects: discussions (topics and replies, optionally email-enabled), news channels (news items), task lists (tasks, task groups and milestones, with summary pages) and polls (multiple-choice or multiple-response questions over a date range).',
      'Work items use a simpler permission model — None, Read, Write, Administer — mapped from the folder they are created in: See Contents → Read, Modify → Write, Edit Permissions → Administer. Their contents (topics, replies, tasks, news) have no permissions of their own.',
    ],
    keyPoints: ['None on a work item hides it — even from search.', 'Task groups organise tasks; milestones tie tasks to target dates or events.'],
    missions: [
      {
        id: 'c03-discussion', type: 'hands-on', title: 'Open a discussion', xp: 30, requires: ['u01-sandbox'], feature: 'discussions',
        steps: ['In “{{sandbox}}”: Add Item ▸ Discussion named “Team Talk”.', 'Post one topic in it.'],
        checks: [
          { kind: 'child', parent: 'sandbox', name: 'Team Talk', types: [215], typeName: 'discussion', saveAs: 'discussion', label: 'Discussion “Team Talk”' },
          { kind: 'count', parent: 'discussion', min: 1, label: 'At least one topic posted' },
        ],
        open: 'sandbox',
      },
      {
        id: 'c03-channel', type: 'hands-on', title: 'Publish news', xp: 30, requires: ['u01-sandbox'], feature: 'channels',
        steps: ['In “{{sandbox}}”: Add Item ▸ Channel named “Team News”.', 'Add one news item.'],
        checks: [
          { kind: 'child', parent: 'sandbox', name: 'Team News', types: [207], typeName: 'channel', saveAs: 'channel', label: 'Channel “Team News”' },
          { kind: 'count', parent: 'channel', min: 1, label: 'At least one news item' },
        ],
        open: 'sandbox',
      },
      {
        id: 'c03-tasklist', type: 'hands-on', title: 'Plan with a task list', xp: 35, requires: ['u01-sandbox'], feature: 'taskLists',
        steps: ['In “{{sandbox}}”: Add Item ▸ Task List named “Launch Plan”.', 'Add a milestone and at least two tasks assigned to yourself.'],
        checks: [
          { kind: 'child', parent: 'sandbox', name: 'Launch Plan', types: [204], typeName: 'task ?list', saveAs: 'tasklist', label: 'Task list “Launch Plan”' },
          { kind: 'count', parent: 'tasklist', min: 2, typeName: 'task', label: 'At least two tasks inside' },
        ],
        open: 'sandbox',
      },
      {
        id: 'c03-poll', type: 'hands-on', title: 'Run a poll', xp: 25, requires: ['u01-sandbox'], feature: 'polls',
        steps: ['In “{{sandbox}}”: Add Item ▸ Poll named “Lunch Vote”.', 'Add one multiple-choice question and take the poll yourself.'],
        checks: [{ kind: 'child', parent: 'sandbox', name: 'Lunch Vote', types: [218], typeName: 'poll', label: 'Poll “Lunch Vote”' }],
        open: 'sandbox',
      },
      {
        id: 'c03-quiz', type: 'quiz', title: 'Knowledge check: work items', xp: 30,
        questions: [
          { q: 'A group has Modify on a folder. What does it get on a task list created there?', options: ['Read', 'Write', 'Administer', 'None'], answer: 1, explain: 'Modify maps to Write.' },
          { q: 'Can you set permissions on a single discussion reply?', options: ['Yes, like any item', 'No — replies inherit from the discussion', 'Only the owner can', 'Only in Smart View'], answer: 1, explain: 'Topics, replies, tasks and news items have no permissions of their own.' },
          { q: 'Which question types can a poll use?', options: ['Free text only', 'Multiple choice (radio) and multiple response (check boxes)', 'Numeric only', 'Yes/No only'], answer: 1, explain: 'Polls support multiple-choice and multiple-response questions.' },
          { q: 'What are milestones for in a task list?', options: ['Grouping tasks by team', 'Associating tasks with target dates or events', 'Setting permissions', 'Emailing tasks'], answer: 1, explain: 'Milestones tie tasks to key dates; task groups organise tasks.' },
          { q: 'A user has None on a discussion. What do they see?', options: ['The name only', 'Nothing — not even in search results', 'Topics but not replies', 'Everything read-only'], answer: 1, explain: 'None hides the work item entirely.' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ C04
  {
    id: 'c04', track: 'collab', title: 'Projects', source: `${SRC} — Ch. 4`, feature: 'projects',
    summary: 'Secure team workspaces with role-based access.',
    lesson: [
      'A project is a private work area for a team, created with the Project Creation Wizard (general info, content, participants, presentation). It adds a Project menu with Overview, Workspace, My Tasks, News and Notification.',
      'Access is driven by roles: Coordinators, Members and Guests. On items in a project the Coordinators group is always the owner group with full control; Members get everything except Delete and Edit Permissions (unless they own the item); Guests get See and See Contents; Public Access gets nothing by default.',
      'Project templates speed up creating similar projects. Non-participants can be given access to single items through Assigned Access.',
    ],
    keyPoints: ['The Coordinators owner group cannot be removed from project items.', 'Sub-projects move with their parent project.'],
    missions: [
      {
        id: 'c04-create', type: 'hands-on', title: 'Create a project', xp: 40, requires: ['u01-sandbox'],
        steps: ['In “{{sandbox}}” (or a training area you may use): Add Item ▸ Project.', 'Name it “OTA Project {{user}}” and finish the wizard.'],
        hints: ['If Project is not offered in your sandbox, your administrator may restrict where projects can be created.'],
        checks: [{ kind: 'child', parent: 'sandbox', recursive: true, depth: 2, nameRegex: '^OTA Project {{user}}$', types: [202], typeName: '^project$', saveAs: 'project', label: 'Project “OTA Project {{user}}”' }],
        open: 'sandbox',
      },
      {
        id: 'c04-participants', type: 'practice', title: 'Invite participants', xp: 20, requires: ['c04-create'],
        steps: ['Open the project\'s Participants page.', 'Add one colleague as Member and one group as Guest.'],
        reflection: 'What can the Guest do that the Member cannot — and vice versa?',
      },
      {
        id: 'c04-overview', type: 'practice', title: 'Set up the project home', xp: 15, requires: ['c04-create'],
        steps: ['Fill in the project Overview (mission, goals).', 'Configure the News page tabs.'],
        reflection: 'What did you put on the Overview page, and why does it help new participants?',
      },
      {
        id: 'c04-quiz', type: 'quiz', title: 'Knowledge check: projects', xp: 30,
        questions: [
          { q: 'What are the three project roles?', options: ['Owner, Editor, Viewer', 'Coordinator, Member, Guest', 'Admin, User, Public', 'Leader, Contributor, Reader'], answer: 1, explain: 'Projects use Coordinators, Members and Guests.' },
          { q: 'By default, what can Guests do on project items?', options: ['Everything except delete', 'See and See Contents', 'Nothing', 'Edit attributes'], answer: 1, explain: 'Guests are read-only by default.' },
          { q: 'Which default entry can NOT be removed from items inside a project?', options: ['Public Access', 'The Coordinators group as owner group', 'The Members group', 'The Guests group'], answer: 1, explain: 'Coordinators always keep full control as the owner group.' },
          { q: 'How can someone outside the project reach one specific document in it?', options: ['Impossible', 'Grant them access on that item and send a link or shortcut', 'Add them as Coordinator only', 'Copy the document to Public Access'], answer: 1, explain: 'Assigned Access on individual items works for non-participants.' },
          { q: 'Which Public Access do project items get by default?', options: ['Full', 'See Contents', 'None', 'Same as the parent folder'], answer: 2, explain: 'Public Access has no permissions on project items by default.' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ C05
  {
    id: 'c05', track: 'collab', title: 'Reminders', source: `${SRC} — Ch. 5`,
    summary: 'Keep follow-up dates attached to the items they concern.',
    lesson: [
      'A reminder attaches a due date and follow-up action to an item. When it becomes due, you are notified by email and can process it from the email or from the Personal menu.',
      'Reminders can be organised in tabs, and you can designate substitutes who handle your reminders while you are away.',
    ],
    keyPoints: ['Reminders live with the item, so context is never lost.'],
    missions: [
      {
        id: 'c05-create', type: 'practice', title: 'Add a reminder', xp: 20, requires: ['u02-upload'],
        steps: ['Add a reminder to “Project Plan” due tomorrow (Classic: Functions menu; Smart View: the item\'s Reminders).', 'Find it again under your reminders.'],
        reflection: 'What follow-up action did you describe, and who else could see it?',
      },
      {
        id: 'c05-substitute', type: 'practice', title: 'Name a substitute', xp: 10,
        steps: ['Open your reminder settings and designate a colleague as substitute.'],
        reflection: 'When would a substitute be preferable to reassigning each reminder?',
      },
      {
        id: 'c05-quiz', type: 'quiz', title: 'Knowledge check: reminders', xp: 15,
        questions: [
          { q: 'How can you process a due reminder?', options: ['Only from the Admin pages', 'From its email notification or from the Personal menu', 'Only in Enterprise Connect', 'By deleting the item'], answer: 1, explain: 'Both the email and the Personal menu let you act on it.' },
          { q: 'What is a reminder substitute?', options: ['A backup copy of the reminder', 'A colleague who handles your reminders while you are away', 'A second due date', 'A workflow proxy'], answer: 1, explain: 'Substitutes cover your reminders during absence.' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ C06
  {
    id: 'c06', track: 'collab', title: 'Pulse', source: `${SRC} — Ch. 6`,
    summary: 'Social activity feeds, status updates and comments.',
    lesson: [
      'Pulse is a real-time activity feed. It automatically reports new content and lets people post status updates, comment, reply, like, mention colleagues and send private messages. You can follow colleagues.',
      'There are three feed types: the global feed (everything you have access to), the current-node feed (one item), and “Pulse from Here” (a container and everything below it). Permissions and privacy settings decide which posts you see.',
    ],
    keyPoints: ['Comments stay with the original post as a conversation thread.'],
    missions: [
      {
        id: 'c06-post', type: 'practice', title: 'Join the conversation', xp: 20, requires: ['u02-upload'],
        steps: ['Update your Pulse profile (photo or settings).', 'Post a status update.', 'Comment on “Project Plan” via Pulse and mention a colleague.'],
        reflection: 'Which feed type shows comments for everything inside your sandbox?',
      },
      {
        id: 'c06-quiz', type: 'quiz', title: 'Knowledge check: Pulse', xp: 20,
        questions: [
          { q: 'Which feed shows activity for a folder and everything below it?', options: ['Global', 'Current Node', 'Pulse from Here', 'Private Messages'], answer: 2, explain: '“Pulse from Here” covers the whole hierarchy under the container.' },
          { q: 'What determines which Pulse posts you can see?', options: ['Nothing — all posts are public', 'Permissions and privacy settings', 'Your department only', 'The server time zone'], answer: 1, explain: 'Feeds respect item permissions and user privacy settings.' },
          { q: 'Which is NOT a Pulse capability?', options: ['Liking a post', 'Mentioning a colleague', 'Changing an item\'s permissions', 'Private messages'], answer: 2, explain: 'Permissions are managed on the item, not in Pulse.' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ C07
  {
    id: 'c07', track: 'collab', title: 'Communities', source: `${SRC} — Ch. 7`, feature: 'communities',
    summary: 'Cross-team spaces with Q&A, blogs, FAQs, forums and wikis.',
    lesson: [
      'A community is an informal network that brings together people who share interests across teams. Each is run by a facilitator who manages membership, roles and content.',
      'Communities offer a home page, library, member info, mail archive and calendar, plus Q&A (questions with accepted answers), blogs, FAQs, forums and wikis. You can subscribe to directories in the community directory and receive update reports.',
    ],
    keyPoints: ['Roles and permissions are defined per community.', 'Expert groups help route questions.'],
    missions: [
      {
        id: 'c07-explore', type: 'practice', title: 'Explore the community directory', xp: 15,
        steps: ['Open Personal ▸ Communities (or Enterprise ▸ Communities).', 'Browse the directory and open one community\'s home page.'],
        reflection: 'Which community did you visit and which tools (blog, forum, Q&A…) does it use?',
      },
      {
        id: 'c07-contribute', type: 'practice', title: 'Contribute', xp: 20,
        steps: ['In a community you belong to, ask a question, reply to one, or add a blog entry.'],
        reflection: 'What did you contribute and how will others find it?',
      },
      {
        id: 'c07-quiz', type: 'quiz', title: 'Knowledge check: communities', xp: 20,
        questions: [
          { q: 'Who runs a community?', options: ['The system Admin only', 'A facilitator', 'Every member equally', 'OTDS'], answer: 1, explain: 'The facilitator administers membership and content.' },
          { q: 'What happens when you subscribe to a directory in the community directory?', options: ['You become facilitator', 'You receive email reports of updates', 'You get Edit Permissions', 'Nothing'], answer: 1, explain: 'Subscriptions deliver update reports.' },
          { q: 'How does a Q&A thread normally close?', options: ['Automatically after a week', 'The asker accepts an answer', 'An admin deletes it', 'It cannot be closed'], answer: 1, explain: 'Askers accept (or reject) answers.' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ C08
  {
    id: 'c08', track: 'collab', title: 'Classifications', source: `${SRC} — Ch. 8`, feature: 'classifications',
    summary: 'Subject-based trees for browsing and search.',
    lesson: [
      'There are two kinds: Content Server classifications and Records Management (RM) classifications. CS classifications tag items with a place in a subject tree, independent of where they are stored; RM classifications additionally drive retention.',
      'Since Content Server 16.2.0 the Classifications module is part of the core product. Documents, compound documents, text documents and folders can be classified; items added to a classified folder can pick up its classification. You can browse the Classifications volume and search by classification.',
    ],
    keyPoints: ['Folders = where it is stored; classification = what it is about.'],
    missions: [
      {
        id: 'c08-tree', type: 'investigate', title: 'Find a classification tree', xp: 20,
        steps: ['Open the Classifications volume (Classic: Enterprise ▸ Classifications).', 'Type the name of one top-level tree.'],
        inputs: [{ key: 'tree', label: 'A classification tree' }],
        checks: [{ kind: 'answer', input: 'tree', source: 'classificationTrees', compare: 'text', label: 'Classification tree name' }],
      },
      {
        id: 'c08-apply', type: 'hands-on', title: 'Classify your document', xp: 30, requires: ['u02-upload'],
        steps: ['Open “Project Plan” ▸ Properties ▸ Classifications.', 'Add one classification and submit.'],
        checks: [{ kind: 'apiCount', source: 'classificationsOf:planDoc', min: 1, label: '“Project Plan” has a classification' }],
        open: 'planDoc',
      },
      {
        id: 'c08-quiz', type: 'quiz', title: 'Knowledge check: classifications', xp: 20,
        questions: [
          { q: 'What are the two kinds of classification?', options: ['Public and private', 'Content Server and Records Management', 'Local and global', 'Manual and automatic'], answer: 1, explain: 'CS classifications organise; RM classifications also govern retention.' },
          { q: 'Since which version is the Classifications module part of the core?', options: ['10.0', '16.2.0', '20.2', 'It is still optional'], answer: 1, explain: 'It became core in Content Server 16.2.0.' },
          { q: 'Which items can receive a CS classification?', options: ['Only folders', 'Documents, compound documents, text documents and folders', 'Only workflow maps', 'Only users'], answer: 1, explain: 'Those item types can be added to classification trees.' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ C09
  {
    id: 'c09', track: 'collab', title: 'Look and feel: custom views & appearances', source: `${SRC} — Ch. 9`,
    summary: 'Shape how folders look: custom views, featured items, appearances.',
    lesson: [
      'Workspace design balances company culture, usability, security and performance. Folder presentation can be tuned with featured items, custom columns, folder icons and a custom view (a customview.html item shown at the top of the folder, usually hidden with Configure).',
      'Appearances selectively change interface components. Global appearances live in the Appearances volume; location-based ones apply to a folder\'s area. An appearance applies to users with See Contents on it. Precedence: a local appearance beats a global one; among several, the first alphabetically wins.',
      'Domains isolate user populations, each with its own Enterprise Workspace. Search forms let users reuse a prepared search page.',
    ],
    keyPoints: ['Configure lets you rename, delete or reformat several folder items at once.'],
    missions: [
      {
        id: 'c09-customview', type: 'hands-on', title: 'Add a custom view', xp: 30, requires: ['u01-sandbox'], feature: 'customViews',
        steps: ['In “{{sandbox}}”: Add Item ▸ Custom View.', 'Write a welcome line and save — it appears at the top of the folder.'],
        checks: [{ kind: 'child', parent: 'sandbox', types: [146], typeName: 'custom ?view', orNameRegex: '^customview\\.html?$', label: 'A custom view in “{{sandbox}}”' }],
        open: 'sandbox',
      },
      {
        id: 'c09-configure', type: 'practice', title: 'Tidy the folder', xp: 15, requires: ['c09-customview'],
        steps: ['Use the folder\'s Configure function to hide customview.html.', 'Mark one document as Featured.'],
        reflection: 'Why hide the custom view file itself?',
      },
      {
        id: 'c09-appearance', type: 'hands-on', title: 'Create a location appearance (branding admin)', xp: 40, requires: ['u01-sandbox'], feature: 'appearances',
        brief: 'Requires the right to add appearances. Skip if unavailable.',
        steps: ['In “{{sandbox}}”: Add Item ▸ Appearance.', 'Add a header text and enable it.'],
        checks: [{ kind: 'child', parent: 'sandbox', types: [480], typeName: 'appearance', label: 'An appearance in “{{sandbox}}”' }],
        open: 'sandbox',
      },
      {
        id: 'c09-quiz', type: 'quiz', title: 'Knowledge check: look & feel', xp: 25,
        questions: [
          { q: 'A folder area has a local appearance and there is also a global appearance you can see. Which is used?', options: ['The global one', 'The local one', 'Both merged', 'Neither'], answer: 1, explain: 'Local appearances take precedence over global ones.' },
          { q: 'Two local appearances apply to you. Which wins?', options: ['The newest', 'The first alphabetically by name', 'The largest', 'A random one'], answer: 1, explain: 'Among several, the first name alphabetically is used.' },
          { q: 'Who gets an appearance?', options: ['Everyone always', 'Users with See Contents on the appearance', 'Only admins', 'Only the owner'], answer: 1, explain: 'Scope an appearance by granting See Contents on it.' },
          { q: 'What is customview.html?', options: ['A system log', 'An HTML item shown at the top of a folder', 'A search form', 'An Enterprise Connect file'], answer: 1, explain: 'It renders a custom header for the folder.' },
          { q: 'Why would you set up domains?', options: ['To speed up search', 'To isolate user populations, each with its own Enterprise Workspace', 'To enable versioning', 'To store email'], answer: 1, explain: 'Domains separate communities of users on one system.' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ C10
  {
    id: 'c10', track: 'collab', title: 'Collaborating in Smart View', source: `${SRC} — Ch. 10`,
    summary: 'Wikis, comments, reminders and workflows from Smart View.',
    lesson: [
      'Smart View brings collaboration into the modern UI: start workflows on documents, see discussion properties and activity, add and process reminders, configure Pulse and post comments, and build wikis.',
      'A wiki has pages, optional sidebars, an overview page and a history page showing every change.',
    ],
    keyPoints: ['Wiki history makes every edit traceable.'],
    missions: [
      {
        id: 'c10-wiki', type: 'hands-on', title: 'Build a team wiki', xp: 35, requires: ['u01-sandbox'], feature: 'wikis',
        steps: ['In Smart View, open “{{sandbox}}” ▸ Add ▸ Wiki named “Team Wiki”.', 'Add at least one page.'],
        checks: [
          { kind: 'child', parent: 'sandbox', name: 'Team Wiki', types: [5573], typeName: 'wiki', saveAs: 'wiki', label: 'Wiki “Team Wiki”' },
          { kind: 'count', parent: 'wiki', min: 1, label: 'At least one wiki page' },
        ],
        open: 'sandbox',
      },
      {
        id: 'c10-comment', type: 'practice', title: 'Comment in Smart View', xp: 15, requires: ['u02-upload'],
        steps: ['Open “Project Plan” in Smart View.', 'Post a comment and check the activity for the item.'],
        reflection: 'Where did your comment appear besides the document itself?',
      },
      {
        id: 'c10-quiz', type: 'quiz', title: 'Knowledge check: Smart View collaboration', xp: 20,
        questions: [
          { q: 'Where do you see every change made to a wiki?', options: ['Wiki overview page', 'Wiki history page', 'Pulse only', 'Recycle Bin'], answer: 1, explain: 'The history page lists wiki changes.' },
          { q: 'Which of these can you add from the Smart View Add menu?', options: ['Only documents', 'Folders, shortcuts, web addresses and wikis', 'Only workflow maps', 'Only appearances'], answer: 1, explain: 'Smart View offers folders, shortcuts, web addresses and wikis among others.' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ C11
  {
    id: 'c11', track: 'collab', title: 'Connected Workspaces & sharing', source: `${SRC} — App. C & D; Managing Documents — App. C`,
    summary: 'Team workspaces, sync-and-share and external sharing.',
    lesson: [
      'Connected Workspaces present a team-oriented workspace with tiles such as Team, Metadata and Recently Accessed, plus a Documents tab — the same concept that business workspaces extend in Extended ECM.',
      'Tempo Box synchronises and shares content across desktop and mobile devices. OpenText Core adds secure file sharing with people outside the organisation.',
    ],
    keyPoints: ['Workspaces group everything about one business matter in one place.'],
    missions: [
      {
        id: 'c11-quiz', type: 'quiz', title: 'Knowledge check: workspaces & sharing', xp: 20,
        questions: [
          { q: 'Which tile is typical of a Connected Workspace?', options: ['Team', 'Recycle Bin', 'Admin Server', 'Slice'], answer: 0, explain: 'Connected Workspaces show Team, Metadata and Recently Accessed tiles.' },
          { q: 'What is OpenText Core used for in this context?', options: ['Indexing', 'Sharing files with people outside the organisation', 'Running workflows', 'Managing categories'], answer: 1, explain: 'Core provides external file sharing.' },
          { q: 'What does Tempo Box provide?', options: ['Records retention', 'Sync and share across desktop and mobile', 'Workflow design', 'OTDS authentication'], answer: 1, explain: 'Tempo Box synchronises and shares content across devices.' },
        ],
      },
    ],
  },
];
