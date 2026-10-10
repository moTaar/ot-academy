'use strict';
// Glossary — Business Administrator (5-0159) and Cloud Practitioner terms.
// Terms already defined elsewhere (Workspace type, Workspace template,
// Workspace role, Perspective, Related workspaces, Physical Objects, Security
// Clearance, Hold, Record…) are deliberately not repeated here.

module.exports = [
  // ---- business workspaces
  { term: 'Business object', def: 'A record in a leading business application (for example an SAP customer or a Salesforce account) that a business workspace can be linked to in Extended ECM.', area: 'workspaces', guide: 'ba-bw-overview' },
  { term: 'Business object type', def: 'The definition of a kind of business object in a connected application, mapped to a workspace type so workspaces can be created from and linked to those objects.', area: 'workspaces', guide: 'ba-bw-overview' },
  { term: 'External system', def: 'The configured connection to a business application (SAP, Salesforce, SuccessFactors…) that Extended ECM uses for business object types and workspace links.', area: 'workspaces', guide: 'ba-bw-overview' },
  { term: 'Extended ECM', def: 'OpenText’s content management offering that connects Content Server business workspaces to leading business applications so content and business data stay together.', area: 'workspaces', guide: 'ba-bw-overview' },
  { term: 'Workspace naming pattern', def: 'A workspace type setting that builds each new workspace’s name from attribute values (or business properties), e.g. “‹number› – ‹name›”.', area: 'workspaces', guide: 'ba-workspace-types' },
  { term: 'Attribute-based location', def: 'A workspace type location setting that files workspaces into sub-folders built from attribute values, such as Customers ▸ Region ▸ first letter.', area: 'workspaces', guide: 'ba-workspace-types' },
  { term: 'Root folder (workspaces)', def: 'The folder that holds the workspaces of a type, named as location in the workspace type and classified so matching templates are offered there.', area: 'workspaces', guide: 'ba-classifications' },
  { term: 'Template classification', def: 'The classification given to a workspace template; folders with the same classification offer that template when users create workspaces.', area: 'workspaces', guide: 'ba-classifications' },
  { term: 'Document Templates volume', def: 'The Content Server volume that stores document and workspace templates.', area: 'workspaces', guide: 'ba-workspace-templates' },
  { term: 'Replacement tag', def: 'A placeholder in the name of an item inside a workspace template that is replaced with the new workspace’s attribute value at creation time.', area: 'workspaces', guide: 'ba-template-content' },
  { term: 'Group replacement', def: 'A template feature that resolves a placeholder group to a real group from workspace data at creation (e.g. Sales ‹Region› → Sales EMEA), so one template serves many groups.', area: 'workspaces', guide: 'ba-roles-permissions' },
  { term: 'Participant', def: 'A user or group that is a member of a role in a business workspace and receives the role’s permissions.', area: 'workspaces', guide: 'ba-roles-permissions' },
  { term: 'Team lead role', def: 'The workspace role marked as lead in the template; its members can typically manage the workspace team.', area: 'workspaces', guide: 'ba-roles-permissions' },
  { term: 'Default participant', def: 'A user or group defined on a template role that is added to that role in every workspace created from the template.', area: 'workspaces', guide: 'ba-roles-permissions' },
  { term: 'Template Administrator', def: 'Access used to maintain a workspace template itself, as opposed to the roles copied into workspaces; it must be granted so it is not copied into every new workspace.', area: 'workspaces', guide: 'ba-roles-permissions' },
  { term: 'Smart document type', def: 'A document type (based on a classification) with rules — bots — that control filing, metadata, allowed uploaders, mandatory status, validity and approval of documents in business workspaces.', area: 'workspaces', guide: 'ba-smart-doc-types' },
  { term: 'Bot (smart document type)', def: 'A reusable rule building block added to a smart document type, such as file into a folder, add a category, condition, make mandatory, validity period or approval.', area: 'workspaces', guide: 'ba-smart-doc-types' },
  { term: 'Document type classification', def: 'A classification (e.g. Contract, Offer) in a document-type tree that smart document types are based on and that is stamped on uploaded documents.', area: 'workspaces', guide: 'ba-smart-doc-types' },
  { term: 'Upload control', def: 'A template setting that requires users to choose a document type for each upload so smart document type rules always apply.', area: 'workspaces', guide: 'ba-smart-doc-types' },
  { term: 'Missing documents', def: 'Mandatory smart document types for which no document exists yet in a workspace, shown in the workspace header until uploaded.', area: 'workspaces', guide: 'ba-smart-doc-types' },
  { term: 'Validity period', def: 'A smart document type rule that computes an expiry from a date attribute and flags outdated documents in the workspace header.', area: 'workspaces', guide: 'ba-smart-doc-types' },
  { term: 'Child-item indexing', def: 'A workspace type option that indexes workspace data with the items inside the workspace, so documents can be found by their workspace’s attributes.', area: 'bizadmin', guide: 'ba-search-admin' },

  // ---- perspectives and Smart View
  { term: 'Perspective rule', def: 'A condition (workspace or container type, location, group, device, classification) that decides where a global perspective is used.', area: 'bizadmin', guide: 'ba-perspective-manager' },
  { term: 'Global perspective order', def: 'The sequence in which global perspectives are evaluated; the first one whose rules match is shown, so specific perspectives go before general ones.', area: 'bizadmin', guide: 'ba-perspective-manager' },
  { term: 'Local perspective', def: 'A perspective set on one specific container or workspace; it overrides global perspectives for that item.', area: 'bizadmin', guide: 'ba-smart-view-admin' },
  { term: 'Landing page perspective', def: 'The perspective that defines the Smart View home page users see after signing in.', area: 'bizadmin', guide: 'ba-perspective-manager' },
  { term: 'Container perspective', def: 'A perspective applied to folders and other containers matched by its rules.', area: 'bizadmin', guide: 'ba-perspective-manager' },
  { term: 'Header widget', def: 'The top widget of a workspace perspective showing the workspace name, key attributes, missing or outdated documents and actions.', area: 'bizadmin', guide: 'ba-perspective-manager' },
  { term: 'Related Workspaces widget', def: 'A Smart View widget listing workspaces related to the current one, filtered by type, with configurable columns.', area: 'bizadmin', guide: 'ba-related-workspaces' },
  { term: 'JATO UX', def: 'A redesigned OpenText Content Management user interface introduced in CE 25.4 that administrators can make available and users can switch to alongside Smart View.', area: 'bizadmin', guide: 'ba-smart-view-admin' },
  { term: 'Recently Accessed widget', def: 'A Smart View widget listing items the user opened recently; administrators choose which subtypes it records.', area: 'bizadmin', guide: 'ba-smart-view-admin' },
  { term: 'My ToDo widget', def: 'A Smart View widget showing a user’s pending work in tabs (workflows, reminders, tasks); administrators can customize its tabs.', area: 'bizadmin', guide: 'ba-collections-workflow' },

  // ---- Business Scenarios and Transport
  { term: 'Business Scenario', def: 'A pre-built OpenText solution (e.g. Agreements, Projects, Teamspaces) delivered as transportable configuration: categories, classifications, workspace types, templates, perspectives and rules.', area: 'bizadmin', guide: 'ba-business-scenarios' },
  { term: 'Transport', def: 'The Content Server feature that packages items and configuration on a source system and imports and deploys them on a target system.', area: 'bizadmin', guide: 'ba-transport' },
  { term: 'Transport Warehouse', def: 'The dedicated Content Server area, opened from the Enterprise menu by authorised users, that holds workbenches, Warehouse folders and Transport Packages.', area: 'bizadmin', guide: 'ba-transport' },
  { term: 'Workbench', def: 'The Transport container where items are collected and prepared on the source, and where packages are unpacked, analysed and deployed on the target.', area: 'bizadmin', guide: 'ba-transport' },
  { term: 'Warehouse folder', def: 'A container in the Transport Warehouse that organises workbenches and controls which users can access them.', area: 'bizadmin', guide: 'ba-transport' },
  { term: 'Transport item', def: 'A Content Server item once it has been added to a workbench.', area: 'bizadmin', guide: 'ba-transport' },
  { term: 'Transport Package', def: 'The exportable ZIP built from a workbench, downloaded from the source and uploaded to the target Warehouse; it can include deployment instructions.', area: 'bizadmin', guide: 'ba-transport-deploy' },
  { term: 'Warehouse Manager', def: 'The Transport role that can see all workbenches, access Transport Packages, and import and deploy; designated by the Administrator.', area: 'bizadmin', guide: 'ba-transport' },
  { term: 'Transport dependency', def: 'An object an item needs on the target (category, classification, parent, users/groups); deploy stays unavailable until dependencies exist or are in the workbench.', area: 'bizadmin', guide: 'ba-transport-deploy' },
  { term: 'Deploy (Transport)', def: 'Creating or updating the items of a workbench on the target system once their dependencies are resolved.', area: 'bizadmin', guide: 'ba-transport-deploy' },

  // ---- facets, columns, search
  { term: 'Facets volume', def: 'The volume that holds facet, facet tree, facet folder and column items.', area: 'bizadmin', guide: 'ba-facets-columns' },
  { term: 'Facet tree', def: 'A hierarchy of facets presented together so users drill down in order, e.g. Region ▸ Country ▸ Status.', area: 'bizadmin', guide: 'ba-facets-columns' },
  { term: 'Data source (facets and columns)', def: 'The system or category attribute a facet or column reads its values from.', area: 'bizadmin', guide: 'ba-facets-columns' },
  { term: 'Facet availability', def: 'Where a facet is offered: globally, only in specific locations, or not at all.', area: 'bizadmin', guide: 'ba-facets-columns' },
  { term: 'Global column', def: 'A column shown in browse lists throughout the system, set by an administrator.', area: 'bizadmin', guide: 'ba-facets-columns' },
  { term: 'Location-specific column', def: 'A column configured on a container (and optionally its sub-containers) with its own display order.', area: 'bizadmin', guide: 'ba-facets-columns' },
  { term: 'System search form', def: 'A search form created by an administrator and offered to all or selected users.', area: 'bizadmin', guide: 'ba-search-admin' },
  { term: 'Best Bet', def: 'A keyword-to-item promotion that places a chosen item at the top of search results for that keyword, optionally until an expiry date; it never bypasses permissions.', area: 'bizadmin', guide: 'ba-search-admin' },
  { term: 'Search filter', def: 'A facet offered on search results so users can narrow them by values such as type, date or region.', area: 'bizadmin', guide: 'ba-search-admin' },

  // ---- administration and settings
  { term: 'Business administrator', def: 'The person who configures Content Server for the business (workspaces, perspectives, facets, search, reminders, notifications) as opposed to the system administrator who installs and runs it.', area: 'bizadmin', guide: 'ba-admin-accounts' },
  { term: 'Admin user', def: 'The built-in Content Server account created at installation with full access and all privileges; reserved for setup and emergencies.', area: 'bizadmin', guide: 'ba-admin-accounts' },
  { term: 'System Administration rights', def: 'A user privilege giving access to administrative functions and bypassing item permissions.', area: 'bizadmin', guide: 'ba-admin-accounts' },
  { term: 'User Administration rights', def: 'A user privilege for creating and modifying users and groups without full system rights.', area: 'bizadmin', guide: 'ba-admin-accounts' },
  { term: 'Usage privilege', def: 'A system-wide privilege that restricts who may use a feature or tool, used to delegate business administration.', area: 'bizadmin', guide: 'ba-admin-accounts' },
  { term: 'Modified-date trigger', def: 'A setting deciding which events (new version, attribute change, permission change…) update an item’s Modified date.', area: 'bizadmin', guide: 'ba-feature-settings' },
  { term: 'MIME type category', def: 'A category associated with a MIME type so it is applied automatically to documents of that type when added.', area: 'bizadmin', guide: 'ba-feature-settings' },
  { term: 'User delegate', def: 'A person who receives another user’s workflow steps and reminders during an absence, once delegation is enabled.', area: 'bizadmin', guide: 'ba-feature-settings' },
  { term: 'Audit interests', def: 'The events the administrator chooses to record in the audit log.', area: 'bizadmin', guide: 'ba-audit-monitoring' },
  { term: 'System message', def: 'A notice an administrator publishes to all users for a defined period, such as a maintenance announcement.', area: 'bizadmin', guide: 'ba-audit-monitoring' },

  // ---- module administration
  { term: 'Reminder client', def: 'A configured reminder type (client) defining how reminders behave for an application area, with its own options and statuses.', area: 'bizadmin', guide: 'ba-reminders-notifications' },
  { term: 'Reminder email agent', def: 'The scheduled process that sends reminder emails.', area: 'bizadmin', guide: 'ba-reminders-notifications' },
  { term: 'Reminder email template', def: 'The administrator-defined subject and body of reminder emails, with placeholders for item details.', area: 'bizadmin', guide: 'ba-reminders-notifications' },
  { term: 'Notification Center', def: 'The Smart View notification hub (bell) that collects event-driven messages from enabled providers and can deliver them by email or digest.', area: 'bizadmin', guide: 'ba-reminders-notifications' },
  { term: 'Notification provider', def: 'An enabled source of Notification Center messages, such as business workspace events, workflows or reminders.', area: 'bizadmin', guide: 'ba-reminders-notifications' },
  { term: 'Workflow parameters', def: 'Central workflow administration settings such as agent timing, step notifications, status display and clean-up.', area: 'bizadmin', guide: 'ba-collections-workflow' },
  { term: 'Change ownership (RM)', def: 'A Records Management administration tool that transfers or switches ownership of items between users, e.g. when someone leaves.', area: 'bizadmin', guide: 'ba-records-benefits' },

  // ---- cloud
  { term: 'Managed cloud', def: 'A delivery model where the provider operates the platform and application stack as a service, while customers and partners work inside the application.', area: 'cloud', guide: 'cp-operating-model' },
  { term: 'Shared responsibility', def: 'The division of duties between cloud provider (platform, operations) and customer/partner (content, users, configuration) defined by contract and guidelines.', area: 'cloud', guide: 'cp-operating-model' },
  { term: 'Service request', def: 'The formal request to cloud operations for work outside the practitioner’s scope, such as installing modules, server settings, logs or restores.', area: 'cloud', guide: 'cp-operating-model' },
  { term: 'Promotion (environments)', def: 'Moving tested configuration from development to test to production, typically with Transport packages, instead of re-creating it by hand.', area: 'cloud', guide: 'cp-environments-change' },
  { term: 'Configuration over customization', def: 'The principle of meeting requirements with product configuration rather than custom code, keeping solutions supportable and upgradeable.', area: 'cloud', guide: 'cp-environments-change' },
  { term: 'Least privilege', def: 'Granting each account only the rights a task needs, for only as long as it needs them.', area: 'cloud', guide: 'cp-security-data' },
];
