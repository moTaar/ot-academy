'use strict';
// Glossary: workspace templates, team roles, template content, search,
// creation and perspectives (course 2-0108, 22.1, chapters 10–15).
// All definitions are original. Format: curriculum/CONTENT.md.

const A = 'workspaces';

module.exports = [
  // Ch 10 — templates
  { term: 'Managed object types', def: 'The list, in Document Templates administration, of item types that may be stored and used as templates in the Document Templates volume. Business Workspace (subtype 848) must be on it before workspace templates can be added.', area: A, guide: 'bw-document-template-settings' },
  { term: 'Business Workspace (subtype 848)', def: 'The Content Server item type of a business workspace — and of a workspace template, which is a Business Workspace item kept in the Document Templates volume.', area: A, guide: 'bw-create-template' },
  { term: 'Apply new create date to sub-items', def: 'Document Templates setting: when on, items created from a template get the current date as creation date (and, with Records Management, record and status dates); when off (default) they keep the template items’ dates. Tasks and task lists are not affected.', area: A, guide: 'bw-document-template-settings' },
  { term: 'Inherit RM classification from template', def: 'Document Templates setting deciding whether sub-items take the Records Management classification of the template (on) or of the destination (off).', area: A, guide: 'bw-document-template-settings' },
  { term: 'Classification tree for document types', def: 'The system-wide Document Templates setting naming the classification tree that holds the template classifications (“document types”) used to offer templates in matching folders.', area: A, guide: 'bw-document-template-settings' },
  { term: 'Classification inheritance (document templates)', def: 'How document templates pick up classifications: from the direct parent, from the nearest ancestor that has one, or not at all.', area: A, guide: 'bw-document-template-settings' },
  { term: 'Attribute merging', def: 'Document Templates wizard option that merges attribute values from the template with those of the destination when an item is created.', area: A, guide: 'bw-document-template-settings' },
  { term: 'Metadata inheritance (templates)', def: 'The default behaviour that copies a container’s categories and classifications onto new sub-items. On workspace templates OpenText recommends disabling it, because the copies are static, multiply database rows and hurt performance; child-item indexing is preferred.', area: A, guide: 'bw-create-template' },

  // Ch 11 — roles
  { term: 'Team Roles and Permissions page', def: 'Classic page of a workspace template (Functions menu) where roles are added, described, given permissions and one is marked as Team Lead.', area: A, guide: 'bw-team-roles' },
  { term: 'Team Participants page', def: 'Classic page (Functions menu) of a template or workspace where users and groups are found with Find & Add and assigned to team roles.', area: A, guide: 'bw-team-roles' },
  { term: 'Set as Team Lead', def: 'Button on the Team Roles and Permissions page that moves the Team Lead flag to another role; by default the first role added is the Team Lead.', area: A, guide: 'bw-team-roles' },
  { term: 'Merge with creation location', def: 'Option on a workspace template’s Specific tab: when a workspace is created inside another business workspace, the destination’s team roles and participants are copied into it too.', area: A, guide: 'bw-team-roles' },
  { term: 'Always inherit the permissions from target destination', def: 'Access Control feature setting (Core System – Feature Administration). When on, a moved business workspace receives the team roles and participants of a destination that has them.', area: A, guide: 'bw-team-roles' },
  { term: 'Target Group', def: 'Column of the group replacement table on a template’s Specific tab that defines the name of the group generated (from variables or attributes) to replace a restricting group when a workspace is created or its categories change.', area: A, guide: 'bw-team-roles' },
  { term: 'Workspace hierarchy', def: 'An arrangement in which business workspaces of one kind may be created inside workspaces of another kind, defined in the document templates and identified by classifications — e.g. case workspaces inside an employee workspace.', area: A, guide: 'bw-workspace-hierarchies' },
  { term: 'Role mapping', def: 'In a workspace hierarchy, the mapping of a parent workspace role onto a child workspace role: the parent role then acts in the child with the child role’s rights. Child roles gain no access to the parent.', area: A, guide: 'bw-workspace-hierarchies' },
  { term: 'Child workspace', def: 'A business workspace created inside another business workspace (its parent) within a workspace hierarchy.', area: A, guide: 'bw-workspace-hierarchies' },

  // Ch 12 — content
  { term: 'Category replacement tag', def: 'A placeholder of the form <Category_CatID_AttrID /> in the name of an item inside a workspace template, replaced at creation by that attribute’s value in the new workspace.', area: A, guide: 'bw-template-content' },
  { term: 'func=attributes.dump', def: 'A Content Server request (append ?func=attributes.dump to the server URL) that lists category definitions with their IDs and attribute IDs — the numbers needed for replacement tags.', area: A, guide: 'bw-template-content' },

  // Ch 13 — search
  { term: 'XECMWkspLinkRefTypeID', def: 'Search index region holding the configuration ID of an item’s workspace type. Created automatically; once made queryable, the complex query XECMWkspLinkRefTypeID:<ID_CFG> finds everything of that type.', area: A, guide: 'bw-search-config' },
  { term: 'ID_CFG', def: 'The configuration ID of a workspace type, visible at the end of its URL when the type is opened (…ReferenceTypeEdit&ID_CFG=4); used in slice queries.', area: A, guide: 'bw-search-config' },
  { term: 'Workspace type slice', def: 'A search slice built from the query XECMWkspLinkRefTypeID:<ID_CFG> so users can restrict searches to one workspace type; one per type is recommended.', area: A, guide: 'bw-search-config' },
  { term: 'Queryable (region)', def: 'Region setting on the Enterprise Search Manager’s Regions page that allows a search region to be used in queries.', area: A, guide: 'bw-search-config' },
  { term: 'Enterprise Search Manager', def: 'Object in the Enterprise Data Source Folder of the System Object Volume whose Properties ▸ Regions page lists the index regions and their Queryable and other settings.', area: A, guide: 'bw-search-config' },
  { term: 'Indexable subtypes', def: 'The item types, chosen per workspace type, whose index entries receive the workspace’s category attributes when child-item indexing is enabled. Business Workspace, Document and Email are preselected.', area: A, guide: 'bw-search-config' },
  { term: 'Schedule for Re-indexing', def: 'Workspace type function that re-indexes existing workspace items after indexing settings change; offers a test mode that only reports what would be processed.', area: A, guide: 'bw-search-config' },
  { term: 'Enterprise Data Flow Manager', def: 'System Object Volume page showing the data flows of the Enterprise data source; its Interchange Pools section (Status, Pending, Processed, Quarantined) is used to monitor indexing.', area: A, guide: 'bw-search-config' },
  { term: 'Custom View Search', def: 'A saved search query turned into a compact search form (Make Custom View Search) that shows only chosen fields. For business workspaces also called a simple search; usable in Classic View and through the Custom View Search widget.', area: A, guide: 'bw-custom-view-search' },

  // Ch 14 — creation
  { term: 'Business Workspace wizard', def: 'The Classic View dialog started with Add Item ▸ Business Workspace in a location folder: Type, Metadata and Classifications pages, then Finish.', area: A, guide: 'bw-creation-wizard' },
  { term: 'Create Workspace step', def: 'Workflow step that creates a business workspace from a selected template, with attribute values mapped from workflow attributes; the result can be kept in an Item Reference attribute.', area: A, guide: 'bw-creation-wizard' },
  { term: 'Email Alias', def: 'The email address given to a container when it is email-enabled with eLink, so messages sent to it are stored there; proposed from the folder name.', area: A, guide: 'bw-creation-wizard' },
  { term: 'Pulse From Here', def: 'Section of the Classic View sidebar listing Pulse activity for the current container — where attribute-change messages of a workspace appear.', area: A, guide: 'bw-creation-wizard' },

  // Ch 15 — perspectives
  { term: 'Perspective Manager', def: 'The graphical tool that designs, creates and edits Smart View perspectives (General, Rules and Configure tabs) and translates them into ActiveView code.', area: A, guide: 'bw-perspectives' },
  { term: 'Manage Perspectives for this workspace type', def: 'Link on a workspace type that opens Perspective Manager for that type, with its rule pre-set and without the Layout option.', area: A, guide: 'bw-perspectives' },
  { term: 'Widget Library', def: 'Left pane of Perspective Manager’s Configure tab listing the widgets of installed modules, grouped (Business Workspaces, Communities, Standard Widgets…), to drag into the working area.', area: A, guide: 'bw-perspectives' },
  { term: 'Code Editor view', def: 'Perspective Manager view for editing a perspective’s code directly. Its changes are not shown in the Designer view and are undone by later Designer changes.', area: A, guide: 'bw-perspectives' },
  { term: 'Cached configuration (Perspective Manager)', def: 'Unsaved perspective work kept in the browser after an interrupted session; on the next start you choose to resume it or clear it.', area: A, guide: 'bw-perspectives' },
  { term: 'Business properties (header)', def: 'Workspace values for Header widget fields that need the business_properties prefix, such as {business_properties.workspace_type_name} and {business_properties.workspace_type_id}.', area: A, guide: 'bw-perspective-widgets' },
  { term: 'Embedded widget', def: 'A widget shown inside the Header widget of a workspace perspective; currently only the Activity Feed can be embedded.', area: A, guide: 'bw-perspective-widgets' },
  { term: 'Configuration Volume widget', def: 'Business Workspaces widget giving Smart View access to configuration volumes such as Document Templates for users with sufficient rights; options Width and Theme.', area: A, guide: 'bw-perspective-widgets' },
];
