'use strict';
// The OpenText Content Management (Content Server) certifications this
// trainer prepares for, and how its content maps onto their exam domains.
//
// Exam facts, domains, weights and objectives are taken from OpenText's
// Training Registry pages and Exam Outline PDFs (checked October 2026):
//   https://www.opentext.com/TrainingRegistry/course/details/<course>
// Where OpenText does not publish something (Analyst and Cloud Practitioner
// weights, the System Administrator objectives), the entry says so and the
// breakdown is this trainer's own study split (`estimated: true`).
//
// Guides, questions and modules attach themselves to a domain by its `id`
// (guide.domains, question.domain, module.domains). `modules` below lists the
// older modules that predate that field.

const REGISTRY = 'https://www.opentext.com/TrainingRegistry/course/details/';

const CERTS = [
  {
    id: '5-0158', short: 'Business User', title: 'OpenText Content Management Business User',
    level: 'Business User', audience: 'Users of OpenText Content Management', color: '#0f6e62',
    url: `${REGISTRY}3028`,
    exam: { questions: 40, minutes: 60, pass: 75, format: 'Multiple choice and multiple correct response', delivery: 'Web-based, English', price: '500 USD' },
    requires: [],
    courses: ['1-0184 Managing Documents in OpenText Content Management', '1-0185 Collaborating in OpenText Content Management'],
    summary: 'Everyday use of Content Server: adding and organising content, versions, metadata, permissions, search, workflows, reminders, wikis, collections, Intelligent Viewing and perspectives. The foundation every other certification builds on.',
    skills: ['Add and delete content', 'Change user permissions', 'Browse and search for content', 'Reserve documents', 'Apply versions', 'Apply categories and attributes', 'Initiate and manage workflows', 'Use activity feeds, reminders and notifications', 'Edit home, container, landing and wiki pages', 'Use Intelligent Viewing', 'Work as a lead or participant in business workspaces'],
    domains: [
      { id: 'bu-fundamentals', title: 'Content Management and Collaboration Fundamentals', weight: 7, modules: ['u01', 'u13', 'c01'],
        objectives: ['Describe the core features and architecture, including user interfaces, workspaces and item types.', 'Identify navigation elements and personalization options in Smart View and Classic View.', 'Explain signing in, signing out and resetting passwords.', 'Analyze scenarios to choose the right workspace or item type for a business need.'] },
      { id: 'bu-content', title: 'Content Access, Organization, and Management', weight: 15, modules: ['u02', 'u03', 'u06', 'u14'],
        objectives: ['Identify methods for accessing, viewing, downloading and adding content.', 'Organize content with folders, collections, shortcuts and web addresses.', 'Use Action Bars and Inline Action Bars for single and multiple items.', 'Rename, edit, copy, move, delete and restore items.', 'Differentiate Smart View, Classic View and Enterprise Connect for content management.'] },
      { id: 'bu-metadata', title: 'Metadata, Categories, and Customization', weight: 7, modules: ['u07', 'u08'],
        objectives: ['Define metadata, categories and attributes and their role in classification and search.', 'Apply, edit and remove categories and attributes on folders and items.', 'Create and interpret custom columns, nicknames and multilingual metadata.', 'Explain designing custom categories and cascading attributes.'] },
      { id: 'bu-versions', title: 'Document Versioning and Compound Documents', weight: 6, modules: ['u03', 'u04'],
        objectives: ['Distinguish standard and advanced (major/minor) versioning.', 'Add, promote, lock, purge and restore versions.', 'Manage compound documents: creation, organization, reservation, releases and revisions.', 'Use generations and renditions.'] },
      { id: 'bu-permissions', title: 'Permissions, Security, and Access Control', weight: 12, modules: ['u10', 'u11'],
        objectives: ['Describe permission models, ACLs and inheritance.', 'Change permissions for users and groups, including Owner and Public Access.', 'Apply permissions to containers and sub-items; predict the effect of copy and move.', 'Interpret Permissions Explorer and eDiscovery privileges.', 'Identify the privileges and permissions needed to edit a perspective.'] },
      { id: 'bu-search', title: 'Search, Retrieval, and Reporting', weight: 12, modules: ['u09'],
        objectives: ['Perform basic and advanced search with slices, filters and search forms.', 'Refine searches with metadata, categories and system attributes.', 'Create and manage saved searches, search queries and search forms.', 'Interpret and use LiveReports and reporting features.'] },
      { id: 'bu-collab', title: 'Collaboration, Email Integration, and Personalization', weight: 5, modules: ['u05', 'u12', 'c03', 'c10', 'c11'],
        objectives: ['Identify collaboration features: collections, reminders, notifications, wikis.', 'Send links and attachments, use email folders and email-enabled containers.', 'Personalize settings, notifications, accessibility and favorites.'] },
      { id: 'bu-reminders', title: 'Managing Reminders and Notifications', weight: 7, modules: ['c05'],
        objectives: ['Identify the purpose and types of reminders.', 'Create and assign reminders on documents, folders and business workspaces in Smart View.', 'Update reminder status and complete reminders.', 'Set up reminder substitutes and workflow delegates.', 'Enable and interpret business workspace and workflow notifications.'] },
      { id: 'bu-wikis', title: 'Collaborating with Wikis and Collections', weight: 6, modules: [],
        objectives: ['Identify the structure and features of wikis and collections.', 'Create and manage wikis, pages, sidebars and navigation in Smart View and Classic View.', 'Use page history, versions and permissions in wikis.', 'Create collections; add, remove and nest items.', 'Choose between a wiki and a collection for a team.'] },
      { id: 'bu-workflows', title: 'Initiating and Managing Workflows', weight: 15, modules: ['c02'],
        objectives: ['Describe workflow concepts, roles (designer, manager, user) and permissions.', 'Initiate workflows from documents and business workspaces in Smart View.', 'Process, reassign and delegate steps; handle email-enabled steps.', 'Monitor status; suspend, resume, stop, delete and archive workflows.', 'Interpret workflow tracking and audit information.'] },
      { id: 'bu-viewing', title: 'Collaborating with Intelligent Viewing', weight: 4, modules: [],
        objectives: ['Identify the features and benefits of Intelligent Viewing.', 'Apply markups, annotations and redactions.', 'Add, save and reply to comments on markups.', 'Recognise burned-in markups and redactions and their security implications.'] },
      { id: 'bu-perspectives', title: 'Customizing Perspectives and Department Landing Pages', weight: 4, modules: ['c06', 'c09'],
        objectives: ['Identify perspective types (landing page, container, workspace).', 'Edit global and local perspectives: layouts and widgets.', 'Build department landing pages with HTML Tile and Activity Feed widgets.', 'Enable Pulse and Activity Feed filters.'] },
    ],
  },
  {
    id: '5-0159', short: 'Business Administrator', title: 'OpenText Content Management Business Administrator',
    level: 'Business Administrator', audience: 'Administrators', color: '#2c5cc5',
    url: `${REGISTRY}2997`,
    exam: { questions: 45, minutes: 60, pass: 75, format: 'Multiple choice and multiple correct response', delivery: 'Web-based, English', price: '500 USD' },
    requires: ['5-0158'],
    courses: ['1-0184 Managing Documents in OpenText Content Management', '1-0185 Collaborating in OpenText Content Management', '2-0108 OpenText Content Management Business Workspaces', '3-0189 OpenText Content Management Business Administration'],
    summary: 'Configuring Content Server for the business: business workspaces end to end (classifications, categories, workspace types, templates, roles), smart document types, perspectives, Business Scenarios, transport, facets, columns, search and module settings.',
    skills: ['Identify components and use cases for Business Workspaces', 'Create categories and attributes for business metadata', 'Create workspace templates with type, classification and categories', 'Define roles, groups and permissions in templates', 'Configure smart document types and bots', 'Deploy business scenarios with the Transport Warehouse', 'Administer facets and columns', 'Configure search forms and filters', 'Configure collections, workflows, reminders and notifications'],
    domains: [
      { id: 'ba-bw-fundamentals', title: 'Fundamentals of Business Workspaces', weight: 5, modules: ['a06'],
        objectives: ['Describe the concept and purpose of Business Workspaces.', 'Identify key components and use cases.', 'Differentiate permissions and privileges for Business Workspaces.', 'Analyze the dependencies and configuration objects Business Workspaces need.'] },
      { id: 'ba-bw-infra', title: 'Configuring Business Workspace Infrastructure', weight: 11, modules: ['c08'],
        objectives: ['Create and assign classifications for workspace templates and location folders.', 'Configure root folders for Business Workspaces with the right classification.', 'Create categories and attributes for business metadata.', 'Use category attributes to drive workspace naming and location.', 'Plan classification trees.', 'Evaluate the effect of metadata and classification inheritance on performance and behavior.'] },
      { id: 'ba-ws-types', title: 'Workspace Types, Templates, and Content Structure', weight: 11, modules: [],
        objectives: ['Configure Workspace Types: naming patterns, location settings, indexing options.', 'Use attribute-based patterns for workspace names and subfolder paths.', 'Create workspace templates with type, classification and categories.', 'Build folder structures, email folders and forums in templates with replacement tags.', 'Apply best practices for template content planning.'] },
      { id: 'ba-roles', title: 'Roles, Permissions, and Access Control', weight: 7, modules: [],
        objectives: ['Define and assign roles, groups and permissions in workspace templates.', 'Differentiate template roles (e.g. Template Administrator) from workspace roles.', 'Apply group replacement and permission propagation in templates.', 'Analyze the effect of moving Business Workspaces on roles, permissions and participants.'] },
      { id: 'ba-smart', title: 'Configuring Smart Document Types, Smart View, and Perspectives', weight: 12, modules: [],
        objectives: ['Configure smart document types: classifications, upload controls, mandatory document checks.', 'Assign and configure bots for smart document types.', 'Create and edit Business Workspace perspectives in Perspective Manager.', 'Customize widget options and layouts.', 'Apply rules to perspectives for user- and device-specific layouts.', 'Configure Smart View features (JATO UX, recently accessed, profiles, actions).', 'Manage container and home page perspectives and the order of global perspectives.'] },
      { id: 'ba-scenarios', title: 'Business Scenarios: Deployment, Customization, and Best Practices', weight: 6, modules: [],
        objectives: ['Explain the structure, purpose and components of Business Scenarios.', 'Differentiate Business Scenarios and Business Workspaces.', 'Apply a recommended strategy for customizing Business Scenarios.', 'Evaluate which configuration objects are safe to customize.'] },
      { id: 'ba-admin-roles', title: 'Administrative Roles and Privileges', weight: 3, modules: ['a02'],
        objectives: ['Differentiate the administrative user accounts.', 'Identify privilege types and their effect on access to administrative functions.'] },
      { id: 'ba-settings', title: 'Feature and User Settings, System Messages, and Monitoring', weight: 6, modules: [],
        objectives: ['Configure access and item control, modified-date triggers, MIME types for categories and Recycle Bin settings.', 'Configure user and group display settings and user delegates.', 'Query the audit log, manage system messages and monitor the system.'] },
      { id: 'ba-transport', title: 'Transport and Transport Warehouse', weight: 10, modules: [],
        objectives: ['Describe Transport, its terminology and the Transport Warehouse components.', 'Identify prerequisites for Transport.', 'Create, export, import and deploy transport packages.', 'Deploy OpenText Business Scenarios.'] },
      { id: 'ba-facets', title: 'Facet and Column Administration', weight: 10, modules: ['u08'],
        objectives: ['Identify the steps to create a facet or column.', 'Configure facets, facet trees and facet availability.', 'Add global or location-specific columns and manage display order.'] },
      { id: 'ba-search', title: 'Search Administration', weight: 10, modules: ['a05'],
        objectives: ['Create and manage system search forms.', 'Configure Best Bets.', 'Configure search filters and display settings.', 'Configure indexing of child items for business workspace types.'] },
      { id: 'ba-modules', title: 'Collection, Workflow, Reminder, Notification Center, and Records Management Administration', weight: 9, modules: ['a03'],
        objectives: ['Configure general collection settings.', 'Configure workflow parameters.', 'Customize the My ToDo widget tabs.', 'Administer reminders: reminder objects, email agent, client types, templates.', 'Configure Notification Center providers, delivery and messages.', 'Describe the benefits of Records Management, Physical Objects and Security Clearance.', 'Change or switch ownership of items using Records Management.'] },
    ],
  },
  {
    id: '5-0156', short: 'Administrator', title: 'OpenText Content Management Administrator',
    level: 'Administrator', audience: 'System Administrators', color: '#a55a0b',
    url: `${REGISTRY}2938`,
    exam: { questions: 60, minutes: 90, pass: 70, format: 'Multiple choice and true/false', delivery: 'Web-based, English', price: '500 USD' },
    requires: ['5-0159'],
    requiresNote: 'The exam outline lists the Business Administrator certification as the prerequisite (it prints the code as 5-0158, but names the Business Administrator certification, whose code is 5-0159).',
    courses: ['3-0189 OpenText Content Management Business Administration', '3-0188 OpenText Content Management System Administration', '3-0127 OpenText Content Management Schema and Report Fundamentals', '3-0128 OpenText Content Management Logging and Troubleshooting Foundation', '3-0300 OpenText Directory Services Installation and Configuration', '3-0305 OpenText System Center Manager'],
    summary: 'Running Content Server: architecture and installation, the admin pages, search infrastructure, storage, the database schema and LiveReports, logging and troubleshooting, OTDS and single sign-on, and System Center Manager. OpenText recommends at least 6 months of hands-on experience.',
    skills: ['Collaboration tools', 'Content Management administration', 'Database queries', 'Document management', 'Installation', 'LiveReports', 'Logging', 'Single sign-on', 'Troubleshooting', 'OTDS administration', 'Directory integration'],
    objectivesNote: 'OpenText publishes the domains and weights for this exam but not their objectives. The objectives below are this trainer\'s study breakdown, built from the outline\'s skills list and the six recommended courses.',
    domains: [
      { id: 'sa-sysadmin', title: 'System Administration', weight: 36, modules: ['a01', 'a02'],
        objectives: ['Explain the architecture: web tier, Content Server engine, database, storage, search grid, OTDS.', 'Install and configure Content Server and its modules.', 'Use the Administration pages: server configuration, storage providers, threads, notifications.', 'Administer search: Admin server, data flows, partitions, Index and Search Engines.', 'Manage modules, patches, agents and scheduled activities.', 'Tune performance and plan clustering and high availability.'] },
      { id: 'sa-bizadmin', title: 'Business Administrator', weight: 15, modules: ['a05'],
        objectives: ['Configure categories, facets, columns and search forms for the business.', 'Manage item control, Recycle Bin, audit and system messages.', 'Configure notifications, reminders, collections and workflow settings.', 'Administer business workspaces and perspectives at system level.'] },
      { id: 'sa-schema', title: 'Schema', weight: 13, modules: [],
        objectives: ['Navigate the core tables (DTree, DVersData, KUAF, DTreeACL, LLAttrData…).', 'Write SQL queries against the Content Server schema.', 'Build LiveReports with inputs, sub-reports and charts.', 'Understand how permissions, versions and categories are stored.'] },
      { id: 'sa-logging', title: 'Logging and Troubleshooting', weight: 17, modules: [],
        objectives: ['Enable and read thread, connect (SQL), timing and summary logs.', 'Locate log files for Content Server, search processes, OTDS and the web tier.', 'Diagnose slow requests, failed logins, indexing and storage problems.', 'Use the System Report, Admin server diagnostics and search admin tools.', 'Follow a structured troubleshooting method and collect data for OpenText Support.'] },
      { id: 'sa-otds', title: 'OTDS', weight: 12, modules: ['u11'],
        objectives: ['Explain OTDS concepts: user partitions, resources, access roles, auth handlers.', 'Synchronise users and groups from Active Directory/LDAP.', 'Configure Content Server as an OTDS resource and push users.', 'Set up single sign-on (integrated Windows authentication, SAML, OAuth).', 'Troubleshoot sign-in and synchronisation.'] },
      { id: 'sa-otscm', title: 'OTSCM (System Center Manager)', weight: 7, modules: [],
        objectives: ['Describe OpenText System Center Manager and its agents.', 'Use it to inventory systems, download and apply patches and updates.', 'Plan patching and upgrades with System Center.'] },
    ],
  },
  {
    id: '5-0157', short: 'Developer', title: 'OpenText Content Management Developer',
    level: 'Developer', audience: 'Developers', color: '#7a3fb0',
    url: `${REGISTRY}2810`,
    exam: { questions: 60, minutes: 90, pass: 70, format: 'Multiple choice and multiple correct response', delivery: 'Web-based, English', price: '500 USD' },
    requires: ['5-0158'],
    courses: ['3-0127 OpenText Content Management Schema and LiveReport Fundamentals', '4-0140 CSIDE Fundamentals', '4-0144 REST API and Content Web Service Fundamentals'],
    summary: 'Building on Content Server: the database schema and LiveReports, OScript and the CSIDE (modules, OSpaces, request handlers, nodes, WebLingo, OUnit, debugging), the REST API and Content Web Services. OpenText recommends at least 6 months as a Content Server developer.',
    skills: ['Navigate and query the Content Management database', 'LiveReports with charts, sub-reports and parameters', 'Create and deploy modules', 'OScript', 'Extend request handlers', 'Extend nodes, web nodes and CSNodes', 'Read and write custom data in the database', 'WebLingo user interfaces', 'Test with OUnit', 'Debug and profile OScript', 'Use the REST API and Content Web Services', 'Extend the REST API', 'Code and deploy custom Content Web Services', 'Service Data Objects'],
    objectivesNote: 'The domain weights are OpenText\'s; the objectives combine the outline\'s competency list and its prerequisite tasks (write queries and LiveReports, install CSIDE, deploy modules from the Administration Console, sign modules, test REST and CWS calls).',
    domains: [
      { id: 'dev-schema', title: 'Schema and LiveReports', weight: 12, modules: [],
        objectives: ['Navigate the database tables that make up Content Server.', 'Write queries that gather information from specific tables.', 'Compose LiveReports with SQL, charts, sub-reports, templates and parameters.'] },
      { id: 'dev-oscript', title: 'CSIDE and OScript fundamentals', weight: 53, modules: [],
        objectives: ['Install and configure CSIDE; create projects, modules and OSpaces.', 'Write OScript: types, objects, inheritance, features, scripts.', 'Add request handlers, nodes, web nodes, CSNodes and extensions.', 'Read and write custom data in the database.', 'Write WebLingo pages for custom UIs.', 'Test with OUnit; debug and profile.', 'Build, sign, deploy and uninstall modules through the Administration Console.'] },
      { id: 'dev-rest', title: 'REST API and Content Web Services', weight: 35, modules: ['a01'],
        objectives: ['Authenticate and call the REST API (v1/v2) from client solutions.', 'Extend the REST API with custom endpoints.', 'Use Content Web Services (SOAP) in client solutions.', 'Code and deploy custom Content Web Services.', 'Use strongly typed Service Data Objects.', 'Test REST resources and CWS operations with tools.'] },
    ],
  },
  {
    id: '5-0155', short: 'Analyst', title: 'Content Server Analyst',
    level: 'Analyst', audience: 'Content Server analysts and solution designers', color: '#b0306a',
    url: `${REGISTRY}2825`,
    exam: { questions: 60, minutes: 90, pass: 70, format: 'Multiple choice and true/false', delivery: 'Web-based, English', price: '500 USD' },
    requires: ['5-0158'],
    requiresNote: 'OpenText says prerequisite certifications are mandatory for this exam but does not name them on the registry page; check the Learning Paths before you book. This trainer assumes Business User first.',
    courses: ['1-0184 Managing Documents in OpenText Content Management', '1-0185 Collaborating in OpenText Content Management', '2-0108 OpenText Content Management Business Workspaces'],
    summary: 'Turning business requirements into a Content Server design: the CIS model (information, community and security models, application settings), document and records management design, collaboration, business workspaces, and workflow and form design.',
    skills: ['Fundamental understanding of Content Server and its primary features', 'Document management', 'Records management', 'Collaboration', 'Business workspaces', 'Designing workflows and forms'],
    estimated: true,
    objectivesNote: 'OpenText describes this exam only in general terms ("document management, records management, collaboration, and business workspaces" plus "the ability to design workflows and forms") and publishes no weights. The domains and weights here are this trainer\'s estimate; the design-method domain follows OpenText Professional Services\' CIS modeling approach.',
    domains: [
      { id: 'an-cis', title: 'Requirements and CIS modeling', weight: 18, modules: [],
        objectives: ['Explain the CIS model: information, community and security models and application settings.', 'Run a design workshop (JAD): roles, prerequisites, deliverables.', 'Apply taxonomy principles and folder-design rules.', 'Design group naming, nesting and role groups.', 'Document a design specification and governance roles.'] },
      { id: 'an-docmgmt', title: 'Document management design', weight: 18, modules: ['u03', 'u07', 'a05'],
        objectives: ['Design folder hierarchies around functions and processes.', 'Design categories, attributes, lookups and cascading attributes.', 'Choose versioning (standard vs major/minor), compound documents and renditions.', 'Design columns, facets, search forms and naming conventions.'] },
      { id: 'an-records', title: 'Records management design', weight: 16, modules: ['a03'],
        objectives: ['Define records, RM classifications and the file plan.', 'Design retention schedules: time-based vs event-based rules.', 'Plan holds and the disposition process and its roles.', 'Apply the three-zone approach (transitory, reference, records).', 'Know when Physical Objects and Security Clearance apply.'] },
      { id: 'an-collab', title: 'Collaboration design', weight: 14, modules: ['c01', 'c04', 'c07'],
        objectives: ['Choose between folders, projects, communities, wikis and collections.', 'Design project templates and roles (Coordinator, Member, Guest).', 'Plan discussions, task lists, news channels and notifications.'] },
      { id: 'an-workspaces', title: 'Business workspace design', weight: 16, modules: ['a06', 'c11'],
        objectives: ['Map business objects to workspace types.', 'Design workspace templates, roles and folder structures.', 'Plan classifications, categories and naming for workspaces.', 'Design perspectives and related workspaces.'] },
      { id: 'an-workflow-forms', title: 'Workflow and form design', weight: 18, modules: ['a04', 'c02'],
        objectives: ['Design workflow maps: steps, conditions, loops, sub-workflows, milestones.', 'Choose performers: users, groups, roles, workflow attributes.', 'Design forms and workflow attributes for data capture.', 'Use workflow attachments, permissions and audit.', 'Scope workflows realistically (steps, loops, form fields).'] },
    ],
  },
  {
    id: 'cloud', short: 'Cloud Practitioner', title: 'Extended ECM (Content Server) Cloud Practitioner',
    level: 'Cloud Practitioner', audience: 'Practitioners deploying Extended ECM (Content Server) to the OpenText Cloud', color: '#3b7f99',
    url: `${REGISTRY}3697`,
    exam: { questions: 15, minutes: 20, pass: 80, format: 'Policy review, then a short test', delivery: 'OpenText Learning Platform (enrolled automatically once eligible)', price: 'Not stated' },
    requires: ['5-0158', '5-0159'],
    requiresNote: 'Both prerequisite certifications must be earned and their digital badges accepted before you are enrolled.',
    courses: ['Review of “OpenText Practitioner Access to the Cloud: General Guidelines” (provided in the course)'],
    summary: 'A short course: review OpenText\'s policy for practitioners working in OpenText Cloud environments, then pass a short test with 80%. This trainer covers the cloud operating model in general terms; the policy itself is only in the course.',
    estimated: true,
    objectivesNote: 'OpenText does not publish this course\'s question count or objectives. The test size here is only for practice. Read the official guidelines in the OpenText Learning Platform — the questions in this trainer cover general cloud-delivery practice, not the wording of that policy.',
    skills: ['Hold the Business User and Business Administrator certifications', 'Know how configuration moves between cloud environments', 'Respect the separation between customer, partner and OpenText responsibilities'],
    domains: [
      { id: 'cp-model', title: 'Cloud operating model and responsibilities', weight: 40, modules: [],
        objectives: ['Explain managed cloud delivery and who is responsible for what.', 'Describe environments (development, test, production) and promotion between them.', 'Know which work goes through OpenText Cloud operations requests.'] },
      { id: 'cp-change', title: 'Configuration and change in the cloud', weight: 35, modules: [],
        objectives: ['Move configuration with Transport packages and Business Scenarios.', 'Prefer configuration over customization in a managed cloud.', 'Plan, test and document changes before production.'] },
      { id: 'cp-security', title: 'Security and data handling', weight: 25, modules: [],
        objectives: ['Protect credentials and customer data.', 'Use least-privilege accounts and approved access paths.', 'Handle logs, exports and test data responsibly.'] },
    ],
  },
];

// Skill paths: CS Academy's own paths for one subject across the exams. They
// work like a certification path (domains, drills, a timed check) but are not
// an OpenText exam. A domain may `include` exam domains, whose questions,
// guides and modules then count for it too.
CERTS.push({
  id: 'workspaces', kind: 'skill', short: 'Business Workspaces', title: 'Business Workspaces: from concept to a working setup',
  level: 'Skill path', audience: 'Business users, business administrators and analysts who work with Extended ECM', color: '#3b7f99',
  url: `${REGISTRY}2997`,
  exam: { questions: 30, minutes: 40, pass: 75, format: 'CS Academy skill check — multiple choice and multiple response', delivery: 'In CS Academy', price: 'Free' },
  requires: [],
  requiresNote: 'Not an OpenText exam. It covers the business workspace part of 5-0159 Business Administrator in more depth, plus how business users create and work in workspaces (5-0158). Business User knowledge is assumed.',
  courses: ['2-0108 OpenText Content Management Business Workspaces', '3-0189 OpenText Content Management Business Administration'],
  summary: 'How business workspaces work, every way to create one, and how to set them up — category, classification, location, workspace type, template, roles and perspective — with a hands-on lab that builds a working workspace in your own Content Server.',
  skills: ['Explain what a business workspace is and what it is made of', 'Build the configuration a workspace type depends on, in the right order', 'Configure workspace types and templates', 'Set up roles, participants and permissions', 'Create workspaces manually, from a business application and through REST', 'Troubleshoot workspace creation and move a setup with Transport'],
  objectivesNote: 'Domains and weights are CS Academy\'s own. Each domain also draws on the matching 5-0159 Business Administrator domain, so practising here counts towards that exam too.',
  domains: [
    { id: 'ws-concepts', title: 'How business workspaces work', weight: 15, modules: ['a06'], includes: ['ba-bw-fundamentals'],
      objectives: ['Explain what a business workspace is and why it exists.', 'Name the parts: workspace type, template, business object type, external system, roles, perspective.', 'Describe how a workspace is linked to a business object, and what works without an integration.', 'Tell business workspaces apart from folders, projects and communities.'] },
    { id: 'ws-infra', title: 'Building blocks: categories, classifications and locations', weight: 20, modules: [], includes: ['ba-bw-infra'],
      objectives: ['Create the category that holds a workspace\'s business metadata.', 'Create classifications for templates and locations.', 'Choose and prepare the folder where workspaces are created.', 'Configure them in the right order, before the workspace type.'] },
    { id: 'ws-types', title: 'Workspace types and templates', weight: 25, modules: [], includes: ['ba-ws-types'],
      objectives: ['Configure a workspace type: name pattern, location, indexing, related settings.', 'Create a workspace template and link it to the type.', 'Build template content: folders, email folders, forums, replacement tags.', 'Plan template content for real teams.'] },
    { id: 'ws-roles', title: 'Roles, participants and permissions', weight: 15, modules: [], includes: ['ba-roles'],
      objectives: ['Define workspace roles in a template and what they grant.', 'Add and remove participants; understand group replacement.', 'Predict what happens to roles and permissions when a workspace moves.'] },
    { id: 'ws-using', title: 'Creating and working in workspaces', weight: 25, modules: ['u18'], includes: ['ba-smart'],
      objectives: ['Create workspaces in Smart View, from a business application, and through the REST API.', 'Work in a workspace: header, perspective, widgets, team, related workspaces.', 'Use smart document types and required documents.', 'Troubleshoot creation problems and move a setup with Transport.'] },
  ],
});

// Order in which the certifications are usually taken.
const ROADMAP = ['5-0158', '5-0159', '5-0156', '5-0157', '5-0155', 'cloud'];

module.exports = { CERTS, ROADMAP };
