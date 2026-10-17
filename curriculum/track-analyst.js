'use strict';
// Track — Analyst & Solution Design (Content Server Analyst, exam 5-0155).
// Goes deeper than the admin foundations (a03 records, a04 workflows, a05
// metadata governance, a06 business workspaces) on DESIGN: the CIS model,
// information, community and security models, records, collaboration,
// business workspaces, workflows and forms, the design specification and
// governance. Lessons follow the CIS modeling method of OpenText Professional
// Services; all text is original. Handbook guides: curriculum/guides/analyst.js.

const SRC = 'OpenText Professional Services — CIS Modeling';

module.exports = [
  // ------------------------------------------------------------------ AN01
  {
    id: 'an01', track: 'analyst', title: 'The analyst’s job & the CIS model', source: `${SRC} — Introduction and Approach`,
    summary: 'What a Content Server analyst designs, the four parts of the CIS model, JAD workshops and requirements gathering.',
    domains: ['an-cis'],
    lesson: [
      'An analyst turns “how the business works” into “how Content Server is configured”. The business brings its functions, processes, documents, people and rules; the analyst chooses and combines standard features — folders, categories, classifications, groups, permissions, records rules, workspaces, workflows, forms — so the platform supports that work with as little effort and risk as possible.',
      'OpenText Professional Services organise every design into a **CIS model**: the **Community** model (how users and groups are organised), the **Information** model (how content is organised and described) and the **Security** model (how access is managed), plus **application settings** (how administration settings shape the user experience).',
      { figure: { type: 'hub', center: 'CIS model', items: [
        { label: 'Community', sub: 'Users and groups' },
        { label: 'Information', sub: 'Folders and metadata' },
        { label: 'Security', sub: 'Privileges and permissions' },
        { label: 'Application settings', sub: 'Behaviour and UI' },
      ] }, caption: 'The four parts depend on each other — none is final until all have been reviewed together.' },
      { h: 'Why design comes first' },
      'Content Server is location based and relies on **inheritance**: an item added to a folder takes that folder’s permissions, categories and classifications. If the top of the hierarchy is organised the way access must be organised, permissions are set once and inherited for years. If not, someone fixes permissions item by item forever. That is why the design is done — and prototyped — before the build.',
      { callout: 'remember', title: 'Business first, technology second', text: 'Design around functions, processes and roles. Records rules and permissions work “behind the scenes”; users should see a structure that matches their work.' },
      { h: 'How the design is made: JAD workshops' },
      'The CIS model is produced in **Joint Application Design** workshops. A **facilitator** (the consultant who knows the platform) works with a **business representative** who knows the processes and can decide, a **technical representative** who brings IT constraints, and a **project representative** who keeps the design aligned with objectives and schedule. Preparation matters: the team needs an operational model of the business (processes, who creates what, how content is used, collaboration points) and enough knowledge of Content Server to discuss options — if not, schedule a demo first.',
      { figure: { type: 'cycle', center: 'Iterate', steps: ['Folder structure', 'Review vs metadata', 'Review vs groups', 'Review vs access', 'Prototype & review'] }, caption: 'Start with folders, then review the structure through each of the other lenses, prototype, and repeat.' },
      'Two deliverables come out of the workshops: the **CIS workbook**, a multi-tab spreadsheet listing folders, categories, groups and permissions from which the system is built; and the **design specification**, which explains the rationale, the implementation and the governance.',
      { h: 'Gathering requirements' },
      'Use several techniques — interviews, process walkthroughs, a content inventory of existing repositories, workshops, policy reviews — and describe users as **personas** so the design serves the occasional reader as well as the daily contributor. For each important content type, ask how it is created, described, shared, found, kept and protected. Design for the everyday 80% and handle exceptions as exceptions.',
      { callout: 'warn', title: 'Gotcha', text: 'A project without a written vision and objectives cannot make design decisions — every debate becomes a matter of taste. Get the objectives agreed before the first workshop.' },
      { callout: 'exam', title: 'Exam focus', text: 'Know the four CIS parts and which decisions belong to each, the JAD roles, the iterative design loop and the two deliverables.' },
    ],
    keyPoints: [
      'CIS = Community, Information, Security models + application settings.',
      'Inheritance makes the top of the hierarchy the most important design decision.',
      'JAD roles: facilitator, business representative, technical representative, project representative.',
      'Iterate: folders → metadata → groups → access → prototype.',
      'Deliverables: CIS workbook (configuration) and design specification (rationale, implementation, governance).',
    ],
    missions: [
      {
        id: 'an01-assess', type: 'practice', title: 'Assess your own repository against the CIS model',
        steps: [
          'Open the Enterprise Workspace (or the area you work in most) and look at its top two levels.',
          'For each CIS part, note one thing that works and one problem you see (e.g. “top level follows the org chart”, “no categories”, “named users on ACLs”).',
        ],
        reflection: 'For each of the four CIS parts (information, community, security, application settings), describe one strength and one weakness you found and the design change you would propose.',
        minWords: 40,
      },
      {
        id: 'an01-workshop', type: 'practice', title: 'Plan a JAD workshop',
        steps: [
          'Imagine the Legal department is next in the rollout.',
          'Plan the first CIS workshop: who attends in which role, what they must prepare, the agenda, and what you will produce afterwards.',
        ],
        reflection: 'Write your workshop plan: attendees and their roles, prerequisites (operational model and platform knowledge), agenda in iteration order, and the deliverables you will update.',
        minWords: 40,
      },
      {
        id: 'an01-quiz', type: 'quiz', title: 'Knowledge check: the analyst’s job',
        questions: [
          { q: 'Which part of the CIS model covers group naming and nesting?', options: ['Community model', 'Information model', 'Security model', 'Application settings'], answer: 0, explain: 'The community model describes users and groups: types, naming, nesting, provisioning and group leaders. The security model then uses those groups on ACLs.' },
          { q: 'Why does the analyst pay most attention to the top levels of the folder hierarchy?', options: ['They are the only levels that are indexed', 'Content Server limits the hierarchy to three levels', 'Users cannot browse lower levels', 'Permissions and metadata set there are inherited by everything below'], answer: 3, explain: 'Inheritance makes the top levels carry the permissions, categories and classifications for everything underneath, so mistakes there multiply.' },
          { q: 'In a JAD workshop, who should make design decisions for a functional group?', options: ['The facilitator', 'The business representative from that group', 'The technical representative', 'The project manager'], answer: 1, explain: 'The business representative knows the processes and must have the authority to decide. The facilitator guides; the technical representative advises on constraints.' },
          { q: 'Where does CIS modeling usually start?', options: ['With permissions', 'With the folder structure', 'With application settings', 'With workflow maps'], answer: 1, explain: 'The folder structure is the easiest starting point for business people; it is then reviewed against metadata, groups and access and prototyped.' },
          { q: 'Which deliverable is used to build the configuration (folders, groups, categories, permissions)?', options: ['The design specification', 'The project charter', 'The CIS model workbook', 'The training plan'], answer: 2, explain: 'The multi-tab CIS workbook lists the configuration and is reviewed iteratively. The design specification explains the rationale, implementation and governance.' },
          { q: 'Versioning, notifications, audit interests and Recycle Bin behaviour belong to…', options: ['application settings', 'the information model', 'the community model', 'the security model'], answer: 0, explain: 'Application settings are the administration settings that shape behaviour and the user experience.' },
          { q: 'A design principle says “manage exceptions as exceptions”. What does it mean?', options: ['Ignore unusual requirements', 'Create a folder for every exception', 'Let every user design their own structure', 'Design for regular everyday use (the 80/20 rule) and handle rare cases separately'], answer: 3, explain: 'Designing for the majority keeps the structure simple; rare cases get specific, separate handling.' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ AN02
  {
    id: 'an02', track: 'analyst', title: 'Designing the information model', source: `${SRC} — Information model and design guidelines`,
    summary: 'Folder levels, above and below the line, collapsing levels, metadata design, naming conventions and findability.',
    domains: ['an-docmgmt', 'an-cis'],
    lesson: [
      'The information model decides where content lives and how it is described. Its first objective is that **where to add content is obvious** — more important than where to find it, because there are many ways to find content but only one right place to add it, and that place decides what the item inherits.',
      { h: 'Folder levels' },
      'Give each level one meaning and use the same pattern in every department: **Level 1 = function** (Human Resources), **Level 2 = process or activity** (Recruiting), **Level 3 = subject or document type** (Job Descriptions). Functions and processes change far less often than the org chart, so the structure stays durable.',
      { figure: { type: 'tree', root: { label: 'Human Resources', icon: 'folder', note: 'Level 1: function', children: [
        { label: 'Recruiting – Job Descriptions', icon: 'folder', note: 'Levels 2+3 collapsed' },
        { label: 'Recruiting – Interviews', icon: 'folder' },
        { label: 'Training – Course Materials', icon: 'folder', children: [{ label: 'Leadership 2026', icon: 'folder', note: 'Organic' }] },
      ] } }, caption: 'Function at the top; process and document type collapsed into one level by the naming convention.' },
      'Keep the fixed levels **above the line** to two or three, with all departments at the top so a re-organisation doesn’t mean moving folders, and lock them (See and See Contents only). **Below the line**, design until you reach the point where permissions and metadata can be set and inherited — usually three to five levels — and let users grow the structure organically below that.',
      { h: 'Wide and flat' },
      'Every level is a click for every user. Collapse levels by concatenating names (“Recruiting – Job Descriptions” instead of Recruiting ▸ Job Descriptions; “2026-01” instead of 2026 ▸ January). Ask how many items each folder will receive: a few hundred is comfortable to browse; one item a year means the level is too fine.',
      { h: 'Metadata' },
      'Capture the **minimum useful** metadata. Don’t duplicate system metadata (dates, owner, size). Put business descriptors in category attributes, use classifications for subject views and RM classifications for retention. Users fill only about 3–4 fields on a plain add page — about 8–10 inside a workflow form — so set values on the folder and let them be inherited wherever the folder already implies them.',
      { figure: { type: 'compare', items: [
        { title: 'Columns', tone: 'info', points: ['Values that differ per document', 'Contract number, expiry date', 'Sort and compare'] },
        { title: 'Facets', tone: 'accent', points: ['Values shared by many documents', 'Department, type, year, region', 'Filter and drill down'] },
      ] }, caption: 'Make metadata pay off: columns compare, facets narrow.' },
      'Use table key lookups for long lists maintained elsewhere, cascading attributes to shorten pick lists, and be careful with attribute sets, which are hard to fill from workflows. Capture key IDs (employee number, customer number) for future integrations, and keep a data dictionary.',
      { h: 'Names and vocabulary' },
      'Build a controlled vocabulary from the users’ own words, ideally synchronised from the system that is the source of truth, and use it in folder names, pick lists and classification trees. Avoid acronyms; put the broader concept first; write dates year first.',
      { callout: 'exam', title: 'Exam focus', text: 'Function ▸ Process ▸ Document type; 2–3 fixed levels above the line; collapse levels; “where to add” matters most; 3–4 fields on add, 8–10 in a workflow form; columns vs facets.' },
    ],
    keyPoints: [
      'Level 1 function, level 2 process/activity, level 3 subject/document type.',
      'Above the line: 2–3 fixed levels, departments at the top, See + See Contents only.',
      'Collapse levels with naming; prefer wide and flat.',
      'Minimum useful metadata, inherited from folders wherever possible.',
      'Columns for per-document values; facets for shared values.',
    ],
    missions: [
      {
        id: 'an02-prototype', type: 'hands-on', title: 'Prototype an HR information model', requires: ['u01-sandbox'], open: 'sandbox',
        brief: 'Analysts prototype designs early so the business can click through them. Build the top of an HR structure in your sandbox, using the function ▸ process – document type pattern with collapsed levels.',
        steps: [
          'In “{{sandbox}}” add a folder named “Human Resources” (level 1: the function).',
          'Inside “Human Resources” add three folders, each collapsing process and document type into one level: “Recruiting - Job Descriptions”, “Recruiting - Interviews” and “Training - Course Materials”.',
          'Optional: give each folder a one-line description saying what belongs there.',
        ],
        hints: ['A plain hyphen with a space on each side is fine; an en dash (–) is accepted too.', 'Names are compared ignoring upper/lower case.'],
        checks: [
          { kind: 'child', parent: 'sandbox', name: 'Human Resources', types: [0], saveAs: 'anHR', label: 'Folder “Human Resources” in your sandbox' },
          { kind: 'child', parent: 'anHR', nameRegex: '^\\s*Recruiting\\s*[-–—]\\s*Job Descriptions\\s*$', types: [0], saveAs: 'anHRJobs', label: 'Folder “Recruiting - Job Descriptions” in “Human Resources”' },
          { kind: 'child', parent: 'anHR', nameRegex: '^\\s*Recruiting\\s*[-–—]\\s*Interviews\\s*$', types: [0], saveAs: 'anHRInterviews', label: 'Folder “Recruiting - Interviews” in “Human Resources”' },
          { kind: 'child', parent: 'anHR', nameRegex: '^\\s*Training\\s*[-–—]\\s*Course Materials\\s*$', types: [0], saveAs: 'anHRTraining', label: 'Folder “Training - Course Materials” in “Human Resources”' },
        ],
      },
      {
        id: 'an02-design-hr', type: 'practice', title: 'Design the HR information model', requires: ['an02-prototype'],
        steps: [
          'Extend your prototype on paper: list the HR processes (recruiting, onboarding, payroll, training, employee relations…) and the document types for each.',
          'Mark where the line falls, which folders carry categories and which attributes they hold, and which values are inherited.',
        ],
        reflection: 'Describe your HR information model: the levels and their meaning, the collapsed folder names, where permissions and categories are applied, the 3–4 attributes users must fill and which ones are inherited, and one column and one facet you would configure.',
        minWords: 40,
      },
      {
        id: 'an02-quiz', type: 'quiz', title: 'Knowledge check: information model',
        questions: [
          { q: 'Which level pattern do CIS design guidelines recommend?', options: ['Org unit ▸ team ▸ person', 'Year ▸ month ▸ day', 'Function ▸ process/activity ▸ subject/document type', 'Document type ▸ function ▸ region'], answer: 2, explain: 'Functions and processes are stable; the org chart changes. Consistent level meanings make lower levels predictable.' },
          { q: 'How many fixed levels “above the line” are recommended?', options: ['Two to three', 'One', 'Five to seven', 'As many as needed'], answer: 0, explain: 'Keep the centrally managed top shallow, with departments at the top level so re-orgs don’t force moves.' },
          { q: 'A draft has “Recruiting ▸ Job Descriptions” as two levels with nothing else under Recruiting except Interviews. What do the guidelines suggest?', options: ['Add a third level per year', 'Move both to the Enterprise Workspace root', 'Replace the folders with a classification', 'Collapse to “Recruiting – Job Descriptions” and “Recruiting – Interviews”'], answer: 3, explain: 'Collapsing levels with a naming convention saves a click on every visit while keeping the meaning.' },
          { q: 'Why is “where to add content” more important than “where to find it”?', options: ['Search cannot find documents', 'The location decides what permissions, categories and RM classifications are inherited', 'Users never browse', 'Content Server stores files per folder on disk'], answer: 1, explain: 'There are many routes to find content (search, facets, shortcuts) but the add location drives inheritance and governance.' },
          { q: 'Users add documents through the standard Add Document page. Realistically, how many category fields will they fill in?', options: ['About 8–10', 'About 3–4', 'About 15', 'Any number if they are mandatory'], answer: 1, explain: 'On a plain add page users fill about 3–4 fields; inside a workflow form about 8–10 is realistic. Inherit the rest from the folder.' },
          { q: 'Which display suits “contract expiry date”, a value that differs for every document?', options: ['A facet', 'A folder level', 'A column', 'A group name'], answer: 2, explain: 'Columns suit per-document values and can be sorted; facets suit values shared by many documents.' },
          { q: 'A long customer list changes weekly and is maintained in the ERP. Best way to control the customer attribute?', options: ['A table key lookup fed from the source of truth', 'Free text', 'A fixed popup list edited by hand', 'A separate folder per customer only'], answer: 0, explain: 'Table key lookups minimise maintenance and keep values consistent with the source system.' },
          { q: 'Why capture an Employee ID attribute even if users never search by it?', options: ['It is required by Content Server', 'It replaces the document name', 'It speeds up indexing', 'It provides the hook for a future integration with the HR system'], answer: 3, explain: 'Key IDs link documents to business systems later (for example business workspaces), so capture them early.' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ AN03
  {
    id: 'an03', track: 'analyst', title: 'Community & security models', source: `${SRC} — Community model, security model and design guidelines`,
    summary: 'Group types and naming, nesting, group leaders; privileges vs permissions, the Consumer–Contributor–Controller ladder and owner/public access guidance.',
    domains: ['an-cis'],
    lesson: [
      'The **community model** organises people into groups; the **security model** uses those groups to control access. Design them together: a group exists because some access or role needs it.',
      { h: 'Groups' },
      '**Organisational groups** (prefix o-) usually control access to content; **role groups** (r-) control access to functionality and task assignment such as workflow steps; **external** (ext-) and **system support** (sys-) groups complete the picture. Names show type, scope and access level — `Legal:Contracts:Read` — separated by a colon or dash, never an underscore, which Content Server treats as part of a word. A group’s name must always match the permissions it carries.',
      { figure: { type: 'tree', root: { label: 'r-InfoOwner-All', icon: 'group', note: 'RM functional access granted once', children: [
        { label: 'r-InfoOwner:HR', icon: 'group' },
        { label: 'r-InfoOwner:Finance', icon: 'group' },
        { label: 'r-InfoOwner:Legal', icon: 'group' },
      ] } }, caption: 'Nesting is useful for functional access and role privileges. For content permissions, flat explicit groups are easier to audit.' },
      'Provision accounts from the directory (through OTDS) so leavers lose access automatically, and delegate membership changes to **group leaders** in the business instead of routing every change through IT.',
      { h: 'Privileges and permissions' },
      'A **privilege** is what you can do, system-wide (log in, public access, administer users, create a type of object). A **permission** is where you can do it, per item. You need both: with the privilege to create a project but no Add Items permission on a folder, you can’t create one there.',
      { figure: { type: 'ladder', steps: [
        { label: 'Consumer', sub: 'See, See Contents' },
        { label: 'Contributor', sub: '+ Modify, Edit Attributes, Add Items, Reserve' },
        { label: 'Controller', sub: '+ Delete Versions, Delete (Edit Permissions in own area)' },
        { label: 'Administrator', sub: 'Full permissions' },
      ] }, caption: 'Nine permissions simplified into three or four roles used everywhere.' },
      { h: 'Security design principles' },
      { ul: [
        'Be as open as possible; restrict only groups that must not have access.',
        'Let access requirements shape the top levels — by function, or by region if access is regional — then rely on inheritance.',
        'Put groups, not users, on ACLs and manage access through group membership.',
        'If a folder needs more than about five groups, create a combining group.',
        'In the fixed top levels give only See and See Contents to protect the structure.',
        'Limit Owner permissions by unchecking them (don’t delete the Owner entry); use the Owner Group position deliberately, e.g. for the area’s information owner; keep Public Access to See and See Contents and remove the privilege from contractors who shouldn’t have it.',
      ] },
      { callout: 'exam', title: 'Exam focus', text: 'Privilege = what, permission = where. Consumer/Contributor/Controller/Administrator. Organisational groups for content, role groups for functions and tasks. “:” or “-” in names. Restrict Owner permissions by unchecking.' },
    ],
    keyPoints: [
      'Organisational groups control content access; role groups control functionality and task assignment.',
      'Group names show type, scope and access — and must always match their permissions.',
      'Privileges are system-wide; permissions are per item; both are needed.',
      'Consumer → Contributor → Controller → Administrator.',
      'Open by default, inheritance-driven, groups not users, ≤ ~5 groups per ACL.',
    ],
    missions: [
      {
        id: 'an03-mygroups', type: 'investigate', title: 'Read your own community model',
        steps: [
          'Open your profile (or Enterprise ▸ Users and Groups) and look at the groups you belong to and your department (base group).',
          'Type the name of one group you are a member of, and your department.',
        ],
        inputs: [{ key: 'group', label: 'A group you belong to' }, { key: 'dept', label: 'Your department (base group)' }],
        checks: [
          { kind: 'answer', input: 'group', source: 'user.groups', compare: 'contains', label: 'You are a member of that group' },
          { kind: 'answer', input: 'dept', source: 'user.department', compare: 'text', label: 'Your department' },
        ],
      },
      {
        id: 'an03-design-groups', type: 'practice', title: 'Design groups and permissions for HR',
        steps: [
          'Take the HR structure from module an02.',
          'Design the groups (with names following a convention) and give each a role level on each designed folder. Decide the Owner, Owner Group and Public Access settings.',
        ],
        reflection: 'List your HR groups (type, name, purpose), the role level each has on each folder (Consumer/Contributor/Controller), which folders are restricted and why, and your Owner, Owner Group and Public Access settings.',
        minWords: 40,
      },
      {
        id: 'an03-quiz', type: 'quiz', title: 'Knowledge check: community & security',
        questions: [
          { q: 'A user has the privilege to create LiveReports but only See and See Contents on a folder. Can they create a LiveReport there?', options: ['Yes — the privilege overrides permissions', 'Only if they are the owner', 'No — they also need Add Items permission on that folder', 'Only in Smart View'], answer: 2, explain: 'The privilege says what you may do; the permission says where. Both are required.' },
          { q: 'Which permissions make up the Contributor role in the typical CIS role ladder?', options: ['Consumer permissions plus Modify, Edit Attributes, Add Items and Reserve', 'See and See Contents only', 'Full permissions', 'Delete and Edit Permissions only'], answer: 0, explain: 'Contributors add and edit; Controllers add Delete Versions and Delete; Administrators have everything.' },
          { q: 'Which separator do the design guidelines advise against in group names?', options: ['Colon (:)', 'Dash (-)', 'Space', 'Underscore (_)'], answer: 3, explain: 'Content Server treats the underscore as part of a word, which works badly for wrapping and search.' },
          { q: 'What are role groups typically used for?', options: ['Only for content permissions', 'Access to functionality and task assignment such as workflow steps', 'Storing user passwords', 'Replacing OTDS'], answer: 1, explain: 'Organisational groups usually control content access; role groups control functionality and assignments.' },
          { q: 'How do the guidelines recommend handling Owner permissions?', options: ['Leave full control', 'Restrict them (read or none) by unchecking the boxes, keeping the entry', 'Delete the Owner entry from every ACL', 'Give the owner Edit Permissions only'], answer: 1, explain: 'Removing the entry can affect items created by workflow or scanning; unchecking keeps it but limits it. Access is then managed through groups.' },
          { q: 'A folder needs eight different groups on its ACL. What is the guideline?', options: ['Add them all', 'Give Public Access full control', 'Consider creating a new group combining them', 'Use named users instead'], answer: 2, explain: 'More than about five groups per folder is hard to read and can hurt performance; create a combining group.' },
          { q: 'A global company must restrict content by region. How should the top of the Enterprise Workspace be divided?', options: ['By region, so permissions set there are inherited', 'By document type', 'Alphabetically', 'By year'], answer: 0, explain: 'Permissions are the main driver of the top levels: divide the way access is restricted, then let inheritance work.' },
          { q: 'What do group leaders allow?', options: ['Users bypass permissions', 'Groups to log in', 'Automatic deletion of inactive users', 'Business users manage membership of their own groups'], answer: 3, explain: 'Group leaders delegate membership management to the business, keeping IT out of routine changes.' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ AN04
  {
    id: 'an04', track: 'analyst', title: 'Records management design', source: `${SRC} — Design guidelines for RM`, feature: 'records',
    summary: 'Records vs non-records, the file plan and RM classifications, time- vs event-based retention, holds, disposition roles, the three zones, Physical Objects and Security Clearance.',
    domains: ['an-records'],
    lesson: [
      'Records management (RM) makes sure records are kept for the right time, protected while kept and disposed of properly afterwards — with **minimal impact on end users**. The analyst designs how content gets its RM classification, which retention rules apply, who reviews disposition, and how holds work.',
      { h: 'Classify everything, automatically' },
      'Classify all content — records and non-records — and do it systematically rather than by user choice. Consider the three options: a **default** RM classification on containers, **inheritance** from the parent, and **intelligent** (automatic) classification. Manual choice is the last resort. Keep the file plan simple: the **big bucket** approach (a few broad record series) is the current trend.',
      { figure: { type: 'flow', steps: [
        { label: 'Document added', kind: 'start' },
        { label: 'RM classification', sub: 'Default or inherited from folder' },
        { label: 'RSI', sub: 'Retention rules and stages' },
        { label: 'Disposition search', sub: 'Finds expired items' },
        { label: 'Review → action', sub: 'Unless on hold', kind: 'end' },
      ] }, caption: 'From folder to disposition without the user making an RM decision.' },
      { h: 'Retention rules' },
      '**Time-based** rules count from a date the system knows (creation, fiscal year end). **Event-based** rules count from a business event (contract ends, employee leaves) and depend on someone or something recording it. Review every event-based rule and convert it to time-based where possible; otherwise build the event into a process — a closing workflow step or an integration — rather than relying on users.',
      { h: 'Holds and disposition' },
      'A **hold** suspends disposition (and deletion) for items involved in litigation, audits or investigations — a hold always beats retention. **Disposition** should use the out-of-the-box scheduling, notifications and dashboards: disposition searches run periodically, reviewers approve or reject, the records manager finishes the review and the action runs. Placing the area’s information owner group in the Owner Group position lets the system find the first reviewer automatically.',
      { figure: { type: 'lanes', lanes: [
        { label: 'Records manager', cells: ['Schedule search', '', 'Finish review', 'Run action'] },
        { label: 'Information owner', cells: ['', 'Approve / reject', '', ''] },
        { label: 'Legal holds', cells: ['Holds exclude items', '', '', ''] },
      ] }, caption: 'Disposition roles. Each role needs permissions and RM functional access — define both before go-live.' },
      { h: 'Roles and zones' },
      'Typical RM roles: **records manager** (runs the programme), **information custodian** (RM support for a group), **information owner** (authorises disposition), **legal holds**, and **contributors**. The **three-zone approach** separates transitory content (outside Content Server, auto-deleted), reference content (in Content Server, disposed of after a set period) and records (retention schedule).',
      { h: 'Physical Objects and Security Clearance' },
      'Add **Physical Objects** when paper or media must be tracked: item types, boxes, locations, labels, circulation, with the same RM rules. Add **Security Clearance** when sensitivity must be enforced independently of location: clearance levels and supplemental markings that restrict access further than permissions — they never grant access.',
      { callout: 'exam', title: 'Exam focus', text: 'Default/inheritance/intelligent classification; big bucket; event → time based; hold beats retention; RM roles need permissions and functional access; three zones.' },
    ],
    keyPoints: [
      'Classify all content automatically — default, inheritance or intelligent classification.',
      'Big-bucket file plans are simpler to apply and maintain.',
      'Prefer time-based retention; build unavoidable events into processes.',
      'Holds suspend disposition; disposition uses out-of-the-box scheduling and review.',
      'Three zones: transitory, reference, records.',
    ],
    missions: [
      {
        id: 'an04-trees', type: 'investigate', title: 'Survey the classification trees',
        steps: [
          'Open the Classifications volume (Classic UI: Enterprise ▸ Classifications) and look at the top-level trees. If Records Management is installed, note whether an RM file plan is there.',
          'Type the name of one top-level classification tree.',
        ],
        inputs: [{ key: 'tree', label: 'A top-level classification tree' }],
        checks: [{ kind: 'answer', input: 'tree', source: 'classificationTrees', compare: 'contains', label: 'Classification tree name' }],
      },
      {
        id: 'an04-retention', type: 'practice', title: 'Design records rules for Accounts Payable',
        steps: [
          'Accounts Payable keeps invoices, payment runs, supplier master data changes and working spreadsheets.',
          'Assign each to a zone and a record series, define the retention rule (trigger, period, final action), and say how the classification is applied without user effort.',
        ],
        reflection: 'For each AP content type give: zone, RM classification (big bucket), trigger (time- or event-based and why), period, final action, how it is applied (default/inherited), and who reviews disposition.',
        minWords: 40,
      },
      {
        id: 'an04-quiz', type: 'quiz', title: 'Knowledge check: records design',
        questions: [
          { q: 'Which approach do the RM design guidelines describe as the current trend for file plans?', options: ['One series per document type', 'No file plan, only holds', 'The big bucket approach: a few broad record series', 'A separate file plan per user'], answer: 2, explain: 'Big buckets are easier to apply by default, maintain and explain.' },
          { q: 'A rule says “destroy 10 years after the employee leaves”, and no integration provides the leaving date. What do the guidelines advise?', options: ['Convert to a time-based rule if possible, or build the event into a process or integration', 'Rely on users to enter the date', 'Keep the records forever', 'Apply a hold'], answer: 0, explain: 'Event-based rules that depend on users are a burden and a compliance risk.' },
          { q: 'An item’s retention has expired but it is on legal hold. What happens at disposition?', options: ['It is destroyed', 'It is moved to the Recycle Bin', 'The hold expires automatically', 'It is kept until the hold is removed'], answer: 3, explain: 'A hold always suspends disposition.' },
          { q: 'Which are the three options to assign RM classifications without user intervention?', options: ['Manual, email, print', 'Default, inheritance, intelligent classification', 'Workflow, form, report', 'Owner, owner group, public'], answer: 1, explain: 'Default on containers, inheritance from parents and intelligent (automatic) classification keep RM systematic.' },
          { q: 'In the three-zone approach, where does transitory content belong?', options: ['In records workspaces', 'Outside Content Server, deleted automatically after a short period', 'In the Classifications volume', 'On hold'], answer: 1, explain: 'Zone 1 transitory content has no lasting value; zones 2 (reference) and 3 (records) are managed in Content Server.' },
          { q: 'Which role authorises disposition of a group’s records?', options: ['Contributor', 'Help desk', 'Information owner', 'Public Access'], answer: 2, explain: 'The information owner approves disposition; the records manager runs the programme and finishes reviews.' },
          { q: 'What does Security Clearance add to permissions?', options: ['Clearance levels and supplemental markings that further restrict access', 'It grants access to items users can’t otherwise see', 'Retention schedules', 'Barcode labels'], answer: 0, explain: 'Clearance is an additional restriction; permissions must still allow access.' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ AN05
  {
    id: 'an05', track: 'analyst', title: 'Collaboration & business workspace design', source: `${SRC}; Collaborating in Content Server 16.2; course 2-0108 Business Workspaces (outline)`,
    summary: 'Choose between folders, projects, communities, wikis and collections; map business objects to workspace types and design templates, roles and perspectives.',
    domains: ['an-collab', 'an-workspaces'],
    lesson: [
      'Requirements rarely name the right container. The analyst reads the **shape** of the work — its duration, its membership, whether it is about one business object — and chooses accordingly.',
      { figure: { type: 'matrix', cols: ['Start / end', 'Own roles', 'Template', 'Best for'], rows: [
        { label: 'Folder', cells: [false, false, 'folder template', 'ongoing functional work'] },
        { label: 'Project', cells: [true, 'Coord./Member/Guest', true, 'time-bound team work'] },
        { label: 'Community', cells: [false, 'facilitator + members', true, 'cross-team knowledge'] },
        { label: 'Business workspace', cells: ['object lifecycle', 'workspace roles', true, 'content of a business object'] },
      ] }, caption: 'Wikis add shared reference pages; collections curate references across locations.' },
      { h: 'Projects and communities' },
      'A **project** suits work with a start, an end and a team. Its roles are virtual groups: **Coordinators** have full control (they are the owner group of every item), **Members** write and add, **Guests** read. Templates give projects a standard structure — and because the creator becomes Coordinator, restrict who may create projects. A **community** connects people across teams around an interest; a **facilitator** runs it; it can be public, private or unlisted and offers Q&A, blogs, forums, FAQs and wikis. A **collection** gathers references to items stored elsewhere; its permissions don’t change the items’ own permissions.',
      { h: 'Business workspaces' },
      'A business workspace holds everything about one business object — customer, supplier, employee, contract — and, with Extended ECM, is linked to that object in the business application. The analyst decides which objects deserve workspaces (those that accumulate documents and that people think in), then designs a **workspace type** for each: the business object type it maps to, the template, the name pattern, the location, attribute mappings, related workspaces and the perspective users see.',
      { figure: { type: 'tree', root: { label: 'Customer: 100482 – ACME Corp', icon: 'workspace', note: 'Category mapped from ERP', children: [
        { label: '01 Contracts', icon: 'folder', note: 'RM: Customer contracts' },
        { label: '02 Correspondence', icon: 'folder', note: 'RM: Reference' },
        { label: '03 Quotes', icon: 'folder' },
        { label: 'Contract: Master Agreement', icon: 'workspace', note: 'Related workspace' },
      ] } }, caption: 'A customer workspace created from its template, with a related contract workspace.' },
      'The **template** carries a short folder structure, categories, RM classifications on every folder, and **workspace roles** with their permissions per folder — so each workspace gets its own team without creating groups per customer. A template change only affects workspaces created afterwards, so pilot it with real objects first.',
      { callout: 'tip', title: 'Configuration first', text: 'Types, templates, roles, perspectives and related workspaces are configuration. Custom code (new connectors, custom widgets) belongs on the roadmap, not in phase 1.' },
      { callout: 'exam', title: 'Exam focus', text: 'Project roles and templates; community facilitator and types; collections hold references; one business object ↔ one workspace; workspace type = template + naming + location + mapping + relationships + presentation.' },
    ],
    keyPoints: [
      'Pick the container by the shape of the work.',
      'Projects: Coordinator, Member, Guest; restrict project creation.',
      'Communities: facilitator; public, private or unlisted.',
      'Workspace types define template, naming, location, mapping, related workspaces and perspective.',
      'Template roles give per-workspace teams; RM classifications belong on template folders.',
    ],
    missions: [
      {
        id: 'an05-choose', type: 'practice', title: 'Choose the right collaboration tool',
        steps: [
          'Three requests arrive: (1) a six-month ERP upgrade with an internal team and external consultants; (2) engineers across five sites want to share tips about a measurement technique; (3) Sales wants all documents about each customer in one place, reachable from the CRM.',
          'Choose the container and tools for each, with roles and one governance rule.',
        ],
        reflection: 'For each request, name the container (folder, project, community, wiki, collection or business workspace), the roles you would set up, the tools inside it, and one governance rule (e.g. who may create it, what happens at the end).',
        minWords: 40,
      },
      {
        id: 'an05-workspace', type: 'practice', title: 'Design a supplier workspace type',
        steps: [
          'Design the workspace type “Supplier”: business object, name pattern, location, mapped attributes, related workspaces.',
          'Design its template: folders, categories, RM classifications and workspace roles with their level on each folder.',
        ],
        reflection: 'Write your supplier workspace design: type settings (object, name pattern, location, mapped attributes, relationships), template folders with RM classifications, and a role-by-folder permission table using Consumer/Contributor/Controller.',
        minWords: 40,
      },
      {
        id: 'an05-quiz', type: 'quiz', title: 'Knowledge check: collaboration & workspaces',
        questions: [
          { q: 'A team needs a space for a nine-month product launch with a defined team and stakeholders who only read. Best fit?', options: ['A community', 'A collection', 'A personal folder', 'A project with Coordinator, Member and Guest roles'], answer: 3, explain: 'Projects suit time-bound team work; roles map directly to the team (members) and stakeholders (guests).' },
          { q: 'Why restrict the privilege to create projects in a governed area?', options: ['Projects cannot be deleted', 'Projects are not indexed', 'The creator automatically becomes Coordinator with full control', 'Projects ignore categories'], answer: 2, explain: 'Restricting creation closes the “security gap” of creators getting full control.' },
          { q: 'Which community type is visible only to its members and joined by invitation only?', options: ['Unlisted', 'Public', 'Private', 'Open'], answer: 0, explain: 'Unlisted communities are hidden; private ones show their name and mission; public ones let everyone view contents.' },
          { q: 'What happens to an item’s permissions when it is added to a collection?', options: ['They are replaced by the collection’s permissions', 'The item becomes public', 'The item is copied', 'Nothing — the collection’s permissions don’t affect the item'], answer: 3, explain: 'Collections hold references; items keep their own permissions.' },
          { q: 'Which business object is the best candidate for a business workspace?', options: ['An individual order line', 'A customer that accumulates contracts, quotes and correspondence', 'A single payment', 'A password reset ticket with no documents'], answer: 1, explain: 'Workspaces suit objects that accumulate documents over a lifecycle and that people think in.' },
          { q: 'Where are folders, categories, RM classifications and roles for new workspaces defined?', options: ['In each workspace by hand', 'In the workspace template used by the workspace type', 'In OTDS', 'In the perspective'], answer: 1, explain: 'The template is copied for every new workspace; the perspective only controls presentation.' },
          { q: 'Why use workspace roles instead of a group per customer?', options: ['Groups are not allowed in workspaces', 'Roles bypass permissions', 'Roles give each workspace its own members while the permission design stays in the template', 'Roles are faster to index'], answer: 2, explain: 'Roles keep per-workspace membership without hundreds of groups.' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ AN06
  {
    id: 'an06', track: 'analyst', title: 'Workflow & form design', source: `${SRC}; Content Server help — Workflow and Forms; courses 2-0113 and 2-0114 (outlines)`, feature: 'workflow',
    summary: 'Map elements and step types, routing patterns, performers, workflow attributes, attachments and permissions, forms and their storage — and realistic scoping.',
    domains: ['an-workflow-forms'],
    lesson: [
      'A workflow map defines a business process: **steps** connected by **links**, a **work package** (attachments, attributes, comments, forms) and **general settings** such as who may manage instances. Each start creates an instance that follows the map.',
      { figure: { type: 'flow', steps: [
        { label: 'Start', sub: 'Attach document', kind: 'start' },
        { label: 'Review', sub: 'User step → role', kind: 'actor' },
        { label: 'Approved?', sub: 'Evaluate step', kind: 'decision' },
        { label: 'File', sub: 'Item Handler', kind: 'system' },
        { label: 'Done', kind: 'end' },
      ], loop: 'Rejected → Initiator step “Revise” → Review' }, caption: 'A minimal review map with one loop back.' },
      { h: 'Step types' },
      '**User** steps give work to a user, group or role; **Initiator** steps send work back to the starter; **Evaluate** steps route by conditions (attribute values, form fields, earlier decisions); **Milestone** steps mark checkpoints to monitor progress; **Process** steps send email or update attributes automatically; **Item Handler** steps act on Content Server items (create folders, add versions, move or copy, exchange values between workflow and category attributes); **Sub-workflow** steps embed another map, pausing the main one until it finishes; **Form Task** steps assign a form to fill in.',
      { h: 'People and data' },
      'Prefer **roles and groups** to named users: workflow roles let one map serve many teams, and role groups such as r-ContractApprovers change membership in one place. **Workflow attributes** carry data for routing and context during the instance; copy anything that must outlive the workflow to the document’s category with an Item Handler. Decide what participants may do with **attachments**, and give a process owner the **management** rights to monitor, reassign, suspend or stop instances.',
      { figure: { type: 'lanes', lanes: [
        { label: 'Requester', cells: ['Fill form', '', '', 'Revise', ''] },
        { label: 'Manager', cells: ['', 'Approve', '', '', ''] },
        { label: 'System', cells: ['', '', 'Evaluate', '', 'File + notify'] },
      ] }, caption: 'Swimlanes are the best way to draw a process with the business before drawing the map.' },
      { h: 'Forms' },
      'A **form template** defines fields and views; forms are filled-in instances. Choose forms when there are many fields, a designed layout, reporting on submissions, or a request that should start a process. Storage drives reporting: keeping submissions in a **SQL table** lets reports query them, while data kept only in the work package goes with the workflow. Keep workflow forms to about **8–10 fields**; pre-fill what the system knows and use lists instead of free text.',
      { h: 'Scope it' },
      'For a first phase: an existing working process, document-centric, about **5 user steps**, at most **1 loop**, a form of at most about **10 fields**, and **no integrations**. If the steps change every time, a task list may serve better than a workflow.',
      { callout: 'exam', title: 'Exam focus', text: 'Step types and their purpose; roles over named users; attributes vs categories vs forms; form storage options; scoping limits.' },
    ],
    keyPoints: [
      'Map = steps + links + work package + general settings.',
      'Evaluate routes; Milestone monitors; Sub-workflow embeds; Item Handler automates item actions.',
      'Roles and groups as performers, never named users.',
      'Copy lasting values from workflow attributes to categories.',
      'Phase-1 scope: ~5 user steps, 1 loop, ~10 form fields, no integrations.',
    ],
    missions: [
      {
        id: 'an06-design', type: 'practice', title: 'Design a contract approval workflow',
        steps: [
          'Legal wants a workflow for supplier contracts: the requester attaches a draft, Legal reviews, contracts over 50,000 also need Finance approval, rejected drafts go back to the requester, approved contracts are filed in “Contracts – Signed”.',
          'Draw it as swimlanes, then as a map with step types, performers, attributes and the routing conditions.',
        ],
        reflection: 'Describe your map step by step: step type, performer (role/group), workflow attributes used, the Evaluate conditions, the loop and its exit, the Item Handler action, who manages instances — and check it against the phase-1 scoping limits.',
        minWords: 40,
      },
      {
        id: 'an06-form', type: 'practice', title: 'Design a request form',
        steps: [
          'Design a training request form that starts an approval workflow.',
          'List every field: type, who fills it, mandatory or not, source of values, which steps see it, and where the data is stored.',
        ],
        reflection: 'List your form fields (no more than about 10), mark which are pre-filled, picked or typed, choose the storage option and justify it with the reporting requirement, and say what is copied to metadata at the end.',
        minWords: 40,
      },
      {
        id: 'an06-quiz', type: 'quiz', title: 'Knowledge check: workflow & form design',
        questions: [
          { q: 'Which step type routes an instance automatically according to conditions you define?', options: ['Evaluate step', 'User step', 'Milestone step', 'Initiator step'], answer: 0, explain: 'Evaluate steps check conditions such as attribute values or decisions and follow the matching link.' },
          { q: 'What happens when a Sub-workflow step runs?', options: ['The main map is cancelled', 'Both maps run independently forever', 'The step is skipped', 'The main map pauses, an instance of the embedded map runs, then the main map resumes'], answer: 3, explain: 'Sub-workflows embed another map; work done there returns to the main map.' },
          { q: 'Which step type would file the approved contract into “Contracts – Signed” without a person?', options: ['Milestone', 'Initiator', 'Item Handler', 'Form Task'], answer: 2, explain: 'Item Handler steps act on Content Server items: move or copy, add versions, create folders, exchange attribute values.' },
          { q: 'Why assign steps to roles or groups instead of named users?', options: ['Maps stay valid when people change and one map can serve many teams', 'Named users are not allowed', 'Roles skip permissions', 'Groups complete steps automatically'], answer: 0, explain: 'Roles and groups make maps reusable and robust to absences and staff changes.' },
          { q: 'An approval date must remain on the contract after the workflow ends. Where should it end up?', options: ['Only in a workflow attribute', 'In the map’s general settings', 'In the step comments', 'In the document’s category, copied by an Item Handler step'], answer: 3, explain: 'Workflow attributes describe the process instance; values that matter later belong in category attributes.' },
          { q: 'Management wants monthly reports across all submitted request forms. Which storage choice supports this best?', options: ['Data only in the workflow work package', 'A SQL table associated with the form template', 'Form comments', 'A personal folder'], answer: 1, explain: 'SQL table storage makes each submission a row that reports can query.' },
          { q: 'Which proposal exceeds the suggested phase-1 workflow scope?', options: ['4 user steps and one loop', '12 user steps, three loops and an ERP integration', 'A document-centric review of an existing process', 'A form with 8 fields'], answer: 1, explain: 'Phase-1 guidance: about 5 user steps, 1 loop, about 10 form fields, no integrations, existing process.' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ AN07
  {
    id: 'an07', track: 'analyst', title: 'Design specification, rollout & governance', source: `${SRC} — Design Specification template`,
    summary: 'Write the design specification, plan a phased repeatable rollout, drive adoption, and define maintenance and change-management responsibilities.',
    domains: ['an-cis'],
    lesson: [
      'The CIS workbook says **what** is configured; the **design specification** says **why**, how it is implemented and how it is governed. Its readers are the project team, stakeholders and the support organisation, so it explains decisions rather than listing every setting.',
      { figure: { type: 'layers', layers: [
        { label: 'Executive summary', items: ['Objective', 'Community, information, security in brief', 'Implementation and governance in brief'] },
        { label: 'Solution design', items: ['Requirements and objectives', 'Information model', 'Community model', 'Security model', 'Application settings'] },
        { label: 'Solution implementation', items: ['Initial implementation and pilots', 'Roll-out plan'] },
        { label: 'Solution governance', items: ['Maintenance responsibilities', 'Change management'] },
      ] }, caption: 'The structure of a CIS design specification.' },
      { h: 'Rollout' },
      'Roll out in phases. The first deployment covers core document management for **pilot groups**; then a **repeatable process** brings in each new group: operational readiness assessment (technical, business resources, policies, timing), a **go/no-go** decision, requirements and analysis, solution design, development, change-management planning and execution, testing, and deployment. Near-term phases are planned in detail; later ones are only outlined in a roadmap.',
      { figure: { type: 'flow', steps: [
        { label: 'Readiness', kind: 'start' },
        { label: 'Go / no-go', kind: 'decision' },
        { label: 'Design' },
        { label: 'Build' },
        { label: 'Change mgmt & test' },
        { label: 'Deploy', kind: 'end' },
      ] }, caption: 'Repeat for every new group; reuse enterprise decisions.' },
      { h: 'Adoption' },
      'Adoption is built by **knowledge champions** in each group, role-based training, quick wins (facets, columns, search forms), purposeful migration (leave transitory content behind and make old repositories read-only), and measures such as active users and content still created outside the system.',
      { h: 'Governance' },
      'Write down who maintains what. Typically: directory synchronisation creates accounts; **system administrators** create groups and categories, manage settings and the top levels of the hierarchy, and look after system health, backups, patches and disaster recovery; **knowledge champions** manage group membership as group leaders, maintain their areas’ design, permissions and categories, support users and monitor adoption; **contributors** manage lower folders and attribute values; the **help desk** gives first-line support. For long-term change, an **information governance** programme with a **steering committee** (business and technical members) sets direction, approves policies, evaluates change requests and funds the evolution of the information architecture.',
      { callout: 'tip', title: 'Record the rationale', text: 'A sentence of “because…” for each decision is what lets future owners change the design safely.' },
      { callout: 'exam', title: 'Exam focus', text: 'Specification sections; phased rollout with pilots and a repeatable process; who does what in maintenance; the steering committee’s role in change management.' },
    ],
    keyPoints: [
      'Workbook = configuration; specification = rationale, implementation, governance.',
      'Phased rollout: pilots first, then a repeatable process per group.',
      'Readiness assessment and a go/no-go decision start each round.',
      'Champions drive adoption and manage their areas.',
      'A steering committee governs change to the information architecture.',
    ],
    missions: [
      {
        id: 'an07-governance', type: 'practice', title: 'Draft a governance table',
        steps: [
          'For the HR design from earlier modules, list ten maintenance responsibilities (accounts, groups, membership, categories, top levels, lower levels, permissions, attribute values, user support, technical support).',
          'Assign each to a role.',
        ],
        reflection: 'Write your responsibility table (responsibility → role) and explain which tasks you delegated to the business (champions, group leaders, contributors) and which you kept central, and why.',
        minWords: 40,
      },
      {
        id: 'an07-rollout', type: 'practice', title: 'Plan the rollout',
        steps: [
          'Choose two pilot groups for a Content Server rollout in your organisation (or an imagined one) and outline three later waves.',
          'Describe the readiness criteria and how you will measure adoption.',
        ],
        reflection: 'Describe your pilot choice and why, the readiness assessment and go/no-go criteria, the waves on the roadmap, the migration rule for old content, and three adoption measures.',
        minWords: 40,
      },
      {
        id: 'an07-quiz', type: 'quiz', title: 'Knowledge check: specification & governance',
        questions: [
          { q: 'What does the design specification add to the CIS workbook?', options: ['Every configuration value', 'Source code', 'The rationale for decisions, the implementation and roll-out plan, and governance', 'User passwords'], answer: 2, explain: 'The workbook holds configuration details; the specification explains why and how it will be implemented and governed.' },
          { q: 'Which approach does the specification template recommend for rollout?', options: ['Phased, starting with pilot groups and repeating a defined process for each new group', 'Big bang for the whole organisation', 'Let each department install its own system', 'No rollout plan'], answer: 0, explain: 'Phasing limits change, minimises disruption and builds on incremental successes.' },
          { q: 'What starts each round of the repeatable rollout process?', options: ['Deployment', 'Training', 'Data migration', 'An operational readiness assessment and a go/no-go decision'], answer: 3, explain: 'Readiness (technical, business resources, policies, timing) decides whether a group is ready to proceed.' },
          { q: 'In the typical maintenance table, who assigns users to groups day to day?', options: ['The steering committee', 'The database administrator', 'Knowledge champions acting as group leaders', 'External auditors'], answer: 2, explain: 'Group leader rights let champions manage their own groups’ membership.' },
          { q: 'Who usually manages the top levels of the folder hierarchy?', options: ['System administrators', 'Every contributor', 'The help desk', 'Guests'], answer: 0, explain: 'Top levels are centrally controlled; lower levels are delegated to the business.' },
          { q: 'Which body reviews change requests and authorises funding for the evolution of the information architecture?', options: ['The help desk', 'Each contributor', 'The Recycle Bin administrator', 'The information governance steering committee'], answer: 3, explain: 'A steering committee with business and technical members governs long-term change.' },
        ],
      },
    ],
  },
];
