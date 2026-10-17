'use strict';
// Glossary, business workspaces part B: categories, columns, sidebar and facets,
// classifications, activity feeds, location folder and workspace types
// (course 2-0108 chapters 4–9). Original definitions. Format: curriculum/CONTENT.md.

const A = 'workspaces';

module.exports = [
  // categories
  { term: 'Text: Reference attribute', def: 'A category attribute type that generates a reference number from a schema of fixed text, variables and other attributes — typically the unique number of a workspace. Only one per category; not usable in workflows.', area: A, guide: 'bw-text-reference' },
  { term: 'Attribute number schema', def: 'The recipe of a Text: Reference attribute: text strings, attributes of the same category and variables such as %Y% or %sequence% combined into the reference number.', area: A, guide: 'bw-text-reference' },
  { term: '%sequence% variable', def: 'The counter variable in a reference number schema; each new item gets the next consecutive number, padded according to the sequence number format.', area: A, guide: 'bw-text-reference' },
  { term: 'Sequence number format', def: 'How many digits and leading zeros the %sequence% counter gets, from N up to 000000000N — 000N produces 0001, 0002…', area: A, guide: 'bw-text-reference' },
  { term: 'Store previous reference', def: 'A Text: Reference setting naming a text attribute (at least as long) that keeps the old reference number when a schema variable changes it.', area: A, guide: 'bw-text-reference' },
  { term: 'Date: Calendar attribute', def: 'An attribute type added by the Template Workspaces module; not needed for Smart View, so new workspace categories use Date: Field instead.', area: A, guide: 'bw-categories-for-types' },
  { term: 'Workspace category folder', def: 'A category folder in the Categories volume that groups the categories of workspace types, making them easy to secure, find and transport.', area: A, guide: 'bw-categories-for-types' },

  // columns, sidebar, facets
  { term: 'Workspace Columns folder', def: 'A Facets volume folder created when business workspaces are installed, holding the Workspace Type ID column and a Workspace Name column per configured language.', area: A, guide: 'bw-custom-columns' },
  { term: 'Used for Sorting and Filtering', def: 'An option on a column’s Properties ▸ Workspaces page that prepares it for sorting and filtering in Smart View workspace widgets.', area: A, guide: 'bw-custom-columns' },
  { term: 'Sortable column', def: 'A custom column whose values can be sorted. The option cannot be cleared later — the column must be recreated — and sorting adds server load.', area: A, guide: 'bw-custom-columns' },
  { term: 'Column availability', def: 'Where a custom column may be used: Not available (the default for new columns), Available everywhere, or Only available in specific locations.', area: A, guide: 'bw-custom-columns' },
  { term: 'Column display state', def: 'Whether an available column is actually shown in a container’s list — set as a local, inherited, global or personal column.', area: A, guide: 'bw-custom-columns' },
  { term: 'Content Filter sidebar', def: 'The Classic View sidebar that shows facet values for faceted browsing; enabled on the Configure Sidebar page, positioned or hidden by each user.', area: A, guide: 'bw-sidebar' },
  { term: 'Configure Sidebar page', def: 'The Facets volume Control Panel page (Sidebar) that enables and shapes the Classic View Content Filter; all its options are selected by default.', area: A, guide: 'bw-sidebar' },
  { term: 'Facet folder', def: 'An organising container in the Facets volume for facets, facet trees, columns and activity managers — usually one per workspace type.', area: A, guide: 'bw-facets' },
  { term: 'Minimum unique values', def: 'A facet setting: the facet is hidden until the list has at least this many distinct values. Default 2; set 1 on small test systems.', area: A, guide: 'bw-facets' },
  { term: 'Facet display mode', def: 'The order of a facet’s values: Ranked list (most frequent first, the default) or Alphabetical list. Date facets have no display mode.', area: A, guide: 'bw-facets' },
  { term: 'Facet display priority', def: 'High, Medium (default) or Low — decides which facets are shown first in the sidebar.', area: A, guide: 'bw-facets' },
  { term: 'Facet status', def: 'The read-only state of a facet’s value data — Building, Ready or Error — with a button to rebuild it.', area: A, guide: 'bw-facets' },
  { term: 'Add Child Facet', def: 'The facet tree editor button: next to the tree name it adds a facet at level 1; next to a facet it nests the new facet below that one.', area: A, guide: 'bw-facets' },
  { term: 'Sidebar widget (workspace type)', def: 'A Classic View panel configured on a workspace type’s Advanced tab — Attributes, Recent Changes, Related Items, Work Items or Workspace Reference.', area: A, guide: 'bw-sidebar' },

  // classifications
  { term: 'Classification tree', def: 'The top-level node of a set of classifications in the Classifications volume. All workspace template classifications must sit in the one tree named in the Document Templates settings.', area: A, guide: 'bw-classifications' },
  { term: 'Classification management type', def: 'How a classification is assigned: Manual (only by people, the default), Assisted (system suggests, people confirm) or Automatic (system assigns).', area: A, guide: 'bw-classifications' },
  { term: 'Selectable (classification)', def: 'Whether users may assign a classification node to items; grouping nodes are often not selectable, template classifications must be.', area: A, guide: 'bw-classifications' },
  { term: 'Manage Pending Objects', def: 'The Classifications Administration page where suggestions made by Assisted classifications are accepted or rejected.', area: A, guide: 'bw-classifications' },

  // activity feeds
  { term: 'Activity manager', def: 'A Facets volume item that watches one data source (a category attribute) and, through its rules, reports value changes in the activity feed. One per data source.', area: A, guide: 'bw-activity-feeds' },
  { term: 'Activity rule', def: 'A rule inside an activity manager: name, criteria, activity string and monitored object types. Rules are evaluated in the order listed.', area: A, guide: 'bw-activity-feeds' },
  { term: 'Rule criteria (activity)', def: 'The kind of change that fires an activity rule — such as Value Changed, New Value Added, Value Removed, Value Increased — offered according to the attribute type.', area: A, guide: 'bw-activity-feeds' },
  { term: 'Activity string', def: 'The localisable message of an activity rule, built with the placeholders [ObjName], [AttrName], [OldVal] and [NewVal].', area: A, guide: 'bw-activity-feeds' },
  { term: 'Collaboration Administration', def: 'The Pulse Administration page where object types such as Business Workspace are added and their collaboration features enabled — required for workspace activity feeds.', area: A, guide: 'bw-activity-feeds' },

  // location and workspace type
  { term: 'Workspace Creation Settings', def: 'The General-tab section of a workspace type that sets the location (Current Location, Content Server Folder, From Category Attribute, From Business Property), sub-location path, manual-creation and fast-bulk options.', area: A, guide: 'bw-workspace-type-settings' },
  { term: 'Sub location path', def: 'An optional sub-folder structure under a workspace type’s location — fixed or From Pattern with attributes — so workspaces are not all stored in one folder.', area: A, guide: 'bw-location-folder' },
  { term: 'Use also for manual creation', def: 'A workspace type option that applies the configured location to manually created workspaces too, regardless of where the user started.', area: A, guide: 'bw-location-folder' },
  { term: 'Generate names also for workspaces without business object', def: 'A workspace type option that applies the name pattern when no business object supplies the name — required in Content Server–only setups.', area: A, guide: 'bw-workspace-type-settings' },
  { term: 'Widget icon', def: 'The workspace type icon used in Smart View (header, Workspaces, Related Workspaces and Team widgets); a bitmap of about 128×128 px, at most 1 MB.', area: A, guide: 'bw-workspace-type-settings' },
  { term: 'Fast bulk creation', def: 'A workspace type option that creates workspaces in fast batches with some unsupported items; if one workspace in a batch fails, none of that batch is created.', area: A, guide: 'bw-workspace-type-settings' },
  { term: 'Workspace copying', def: 'A workspace type check box deciding whether users may copy workspaces of that type.', area: A, guide: 'bw-workspace-type-settings' },
  { term: 'Creation status', def: 'Whether new workspaces of a type may be created; switched with Disable Creation / Enable Creation on the Workspace Types page. Existing workspaces are unaffected.', area: A, guide: 'bw-workspace-type-settings' },
  { term: 'Indexing status', def: 'The Workspace Types column showing Re-indexing required (after any indexing-setting change) or Up to date (items handed to the index engine).', area: A, guide: 'bw-workspace-type-settings' },
];
