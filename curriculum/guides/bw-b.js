'use strict';
// Business workspaces, part B: the building blocks and the workspace type —
// categories, columns, the Classic View sidebar and facets, classifications,
// activity feeds, the location folder and every workspace type setting.
// Learned from the course "Content Server Business Workspaces" (2-0108, 22.1),
// chapters 4–9, and explained in original words. Format: curriculum/CONTENT.md.

const SRC = (ch) => `Content Server Business Workspaces (2-0108, 22.1) — Ch. ${ch}`;

const G = [];
module.exports = G;

// ================================================================ CH 4 — CATEGORIES
G.push({
  id: 'bw-categories-for-types',
  order: 20,
  title: 'Designing and building the workspace category',
  area: 'workspaces',
  summary: 'How the category of a workspace type is designed and created: where it lives, which privileges you need, which attribute types to choose, what “required” and “show in search” do, and what happens when the category changes later.',
  level: 'intermediate',
  minutes: 14,
  domains: ['ws-infra', 'ba-bw-infra'],
  modules: ['bw04', 'ws02'],
  tags: ['category', 'attribute', 'text: reference', 'required', 'show in search', 'popup', 'user field', 'category version', 'business workspace categories'],
  related: ['bw-text-reference', 'bw-custom-columns', 'bw-workspace-type-settings', 'ba-categories-metadata', 'ws-setup-roadmap', 'bw-rights'],
  sources: [SRC(4), SRC(3)],
  body: [
    'The category is the first building block of every workspace type. It holds the business data of each workspace — a supplier number, a name, a commodity, a buyer — and almost everything you configure later reads from it: the **workspace name pattern**, the **location sub-path**, custom **columns**, **facets**, **activity managers**, the Classic View **Attributes sidebar widget** and the Smart View **header**. Design it as if the rest of the configuration depends on it, because it does.',
    'You can reuse a category that already exists on the server or build one for the purpose. Either way, the category reaches the workspaces through the **template**: a category added to a workspace template is copied to every workspace created from it.',
    { callout: 'remember', text: ['When no business application is connected, the workspace type can only build names and locations from **category attributes**. A value that is not in a category cannot appear in the name or drive the folder path.'] },
    { h: 'Where categories for workspaces live' },
    'Workspace categories are ordinary categories in the Categories volume. A tidy convention — and the one the course uses — is a dedicated **category folder** for workspace categories, so they are easy to find, to secure and to put in a transport package. The Business Workspaces volume (Enterprise ▸ Business Workspaces) has a shortcut link to the Categories volume.',
    {
      figure: {
        type: 'tree',
        root: {
          label: 'Categories volume', icon: 'volume', children: [
            { label: 'Workspace Categories', icon: 'folder', note: 'category folder for workspace types', children: [
              { label: 'Supplier', icon: 'category', note: 'Supplier ID · Name · Commodity · Buyer' },
              { label: 'Contract', icon: 'category' },
              { label: 'Project', icon: 'category' },
            ] },
            { label: 'Document Categories', icon: 'folder', children: [
              { label: 'Invoice data', icon: 'category', note: 'for documents inside workspaces' },
            ] },
          ],
        },
      },
      caption: 'Keep workspace categories together in their own category folder; document-level categories go elsewhere.',
    },
    { path: ['Enterprise', 'Business Workspaces', 'Categories', 'Workspace Categories', 'Add Item', 'Category'], ui: 'Classic UI' },
    { h: 'Who may create it' },
    {
      table: {
        head: ['You need', 'Kind', 'Why'],
        rows: [
          ['Business Administration Data Policies', 'Usage privilege', 'Opens the data-policy (category) administration functions'],
          ['Category', 'Object privilege', 'Lets you add the Category item type'],
          ['Add Items on the category folder', 'Permission', 'You create the category inside that folder'],
        ],
        caption: 'Members of the Business Administrators group created at installation usually have the privileges already.',
      },
    },
    { h: 'Choosing attribute types' },
    'Each attribute gets a type, a name, an order and a few flags. For workspace categories the decision is guided by **what will consume the value**.',
    {
      table: {
        head: ['Attribute type', 'Typical workspace use', 'Watch out for'],
        rows: [
          ['Text: Reference', 'A generated, unique business number (SUP-0042) used in the name', 'Only one per category; not usable in workflows; see [[bw-text-reference]]'],
          ['Text: Field', 'A free-text name (Supplier Name)', 'Free text makes poor facets and folder names'],
          ['Text: Popup', 'Controlled values (Commodity, Region, Account level)', 'Ideal for facets, sub-folders and rules'],
          ['User: Field', 'A responsible person (Buyer, Sales rep)', 'Smart View cannot **sort** columns built on user fields'],
          ['Date: Field', 'A business date (Contract end, Date sold)', 'Smart View sorts dates without the time part'],
          ['Integer / Real', 'Amounts, volumes', 'Good for increase/decrease activity rules'],
          ['Date: Calendar', 'Comes with the Template Workspaces module', 'Not needed for Smart View — avoid in new designs'],
        ],
      },
    },
    { h: 'The flags on each attribute' },
    {
      ul: [
        '**Required** — the user (or the integration) must supply a value before the workspace can be created. Make every attribute that feeds the name or the sub-location path required; a blank value leaves a gap in the name or drops the workspace into the root folder.',
        '**Show in Search** — the attribute becomes searchable. Turn it on for anything people search by (number, name, buyer).',
        '**Order** — the position of the attribute on the category page and in edit forms.',
        '**Valid values** (popups) — the controlled list. Agree it with the business before go-live; renaming a value later does not rewrite workspaces that already carry the old one.',
        '**Length / display length** (text) — maximum stored length and the width shown in forms.',
      ],
    },
    {
      figure: {
        type: 'hub',
        center: 'Supplier category',
        items: [
          { label: 'Name pattern', sub: 'Supplier ID + Name' },
          { label: 'Sub-location path', sub: 'Commodity' },
          { label: 'Columns', sub: 'Buyer, Contract end' },
          { label: 'Facets', sub: 'Commodity, Buyer' },
          { label: 'Activity managers', sub: 'Buyer changed' },
          { label: 'Sidebar / header', sub: 'Attributes widget' },
          { label: 'Search', sub: 'Show in Search' },
        ],
      },
      caption: 'One category, many consumers. List them before you finalise the attributes.',
    },
    { h: 'Create the category' },
    {
      steps: [
        'Open Enterprise ▸ Business Workspaces ▸ Categories (or Enterprise ▸ Categories) and open your workspace category folder.',
        'Add Item ▸ Category. Enter a descriptive name such as “Supplier” and click Add — the empty category is created.',
        'Click the new category to open its definition page.',
        'Use the **Add Attribute** drop-down to add each attribute: choose the type, enter the name, set Required and Show in Search, enter valid values for popups, and click OK.',
        'Check the attribute order, then click **Submit** to save the category definition.',
      ],
      title: 'Create a workspace category',
      ui: 'Classic UI',
    },
    {
      table: {
        head: ['Attribute', 'Type', 'Required', 'Show in Search', 'Values'],
        rows: [
          ['Supplier ID', 'Text: Reference', '—', 'Yes', 'Schema SUP-%sequence%, format 000N'],
          ['Supplier Name', 'Text: Field', 'Yes', 'Yes', 'free text'],
          ['Commodity', 'Text: Popup', 'Yes', 'Yes', 'Hardware, Software, Services, Logistics'],
          ['Buyer', 'User: Field', 'Yes', 'Yes', 'a Content Server user'],
          ['Contract End', 'Date: Field', 'No', 'Yes', '—'],
        ],
        caption: 'A worked example used throughout these guides: the Supplier workspace category.',
      },
    },
    { h: 'Changing the category later' },
    'A category definition is versioned. When you add or change attributes, items that already carry the category keep the old version until they are **upgraded** (from the category, an administrator can upgrade the items that use it). Plan for three side effects:',
    {
      ul: [
        'Workspace **names are not regenerated** when attribute values or a reference schema change — the name was built once, at creation.',
        'Workspaces are **not moved** when an attribute that drove the sub-location path changes.',
        'Columns, facets and activity managers point at a specific attribute; deleting or replacing that attribute breaks them.',
      ],
    },
    { callout: 'exam', text: ['Expect: the privileges to create a category (**Business Administration Data Policies** usage privilege + **Category** object privilege); that a category added to the template is what puts it on every new workspace; and that without a business object, name and location can only come from **category attributes**.'] },
    { callout: 'tip', text: ['Before adding an attribute, name its consumer. If nothing — name, path, column, facet, rule, search — will use it, leave it out. Every required field slows down workspace creation.'] },
  ],
});

G.push({
  id: 'bw-text-reference',
  order: 21,
  title: 'The Text: Reference attribute — generated workspace numbers',
  area: 'workspaces',
  summary: 'How the Text: Reference attribute builds unique reference numbers from text, other attributes and variables such as %sequence%; its settings, its limits and how it behaves in workspace names.',
  level: 'advanced',
  minutes: 10,
  domains: ['ws-infra', 'ba-bw-infra'],
  modules: ['bw04'],
  tags: ['text: reference', 'reference number', 'attribute number schema', '%sequence%', 'sequence number format', 'store previous reference', 'variables'],
  related: ['bw-categories-for-types', 'bw-workspace-type-settings', 'bw-activity-feeds'],
  sources: [SRC(4), SRC(9)],
  body: [
    'Thousands of workspaces of one type often sit under the same root folder, so each needs a **unique, stable identifier**. When the business application does not supply one, the **Text: Reference** attribute type generates it: a reference number built from a schema you define, such as SUP-0042 or PRJ-26-0107. It has been available since Content Server 16.2 and is one of the attribute types added for business workspaces.',
    { h: 'How a reference number is built' },
    {
      figure: {
        type: 'flow',
        steps: [
          { label: 'Fixed text', sub: '“SUP-”' },
          { label: 'Variables', sub: '%Y% · %sequence%' },
          { label: 'Other attributes', sub: 'from the same category' },
          { label: 'Sequence format', sub: '000N → 0042', kind: 'system' },
          { label: 'SUP-2026-0042', kind: 'end' },
        ],
      },
      caption: 'The attribute number schema concatenates text, attributes and variables; the sequence format pads the counter.',
    },
    { h: 'Settings of a Text: Reference attribute' },
    {
      table: {
        head: ['Setting', 'What it does'],
        rows: [
          ['Name', 'Display name of the attribute'],
          ['Order', 'Position among the category’s attributes'],
          ['Show in Search', 'Makes the number searchable — almost always on'],
          ['Length / Display Length', 'Maximum stored characters and the width shown in forms'],
          ['Attribute number schema', 'The recipe: text strings (hyphens, letters), other attributes of the same category, and variables'],
          ['Sequence number format', 'How many digits the %sequence% counter gets, with leading zeros — from N up to 000000000N. Ignored if the schema has no %sequence%'],
          ['Store previous reference', 'A text attribute (at least as long) that keeps the old number when a schema variable changes the reference'],
        ],
      },
    },
    { h: 'Variables you can use' },
    {
      table: {
        head: ['Group', 'Variables', 'Example result'],
        rows: [
          ['Counter', '%sequence%', '0042 (with format 000N)'],
          ['Context', '%parentFileId% (parent workspace reference), %fileplan% (containing folder name), %rm-classification%', 'P-881/0003'],
          ['Year', '%y% (2 digits), %Y% (4 digits)', '26 / 2026'],
          ['Month and day', '%m%, %d%, %j% (day of year), %b% / %B% (month name), %a% / %A% / %w% (weekday)', '03, 17, 076, Mar'],
          ['Time', '%H% / %I% (hours 24/12), %M%, %S%, %p% (AM/PM)', '14:05'],
          ['Week and era', '%U% (week, Sunday first), %W% (week, Monday first), %P% (AD/BC)', '11'],
          ['Literal', '%% for a percent sign', '%'],
        ],
        caption: 'Month and weekday names follow the server language settings.',
      },
    },
    {
      steps: [
        'Open the category and choose Add Attribute ▸ Text: Reference.',
        'Name it, for example “Supplier ID”, and keep Show in Search selected.',
        'In Attribute number schema type the fixed text and insert variables, e.g. SUP-%Y%-%sequence%.',
        'Set Sequence number format to the number of digits you need, e.g. 000N for four digits.',
        'Optionally choose a text attribute in Store previous reference. Click OK, then Submit the category.',
      ],
      title: 'Add a generated reference number',
      ui: 'Classic UI',
    },
    { h: 'Limits and behaviour' },
    {
      figure: {
        type: 'matrix',
        cols: ['Supported'],
        rows: [
          { label: 'Use in the workspace name pattern', cells: [true] },
          { label: 'Show in Search', cells: [true] },
          { label: 'Custom column / sidebar attribute', cells: [true] },
          { label: 'More than one per category', cells: [false] },
          { label: 'Use in workflows', cells: [false] },
          { label: 'Data source of an activity manager', cells: [false] },
          { label: 'Rename workspaces after schema change', cells: [false] },
        ],
      },
      caption: 'What a Text: Reference attribute can and cannot do (22.1).',
    },
    {
      ul: [
        '**One per category.** If you need two generated numbers, they must live in different categories.',
        '**Not in workflows.** Workflow attribute mapping cannot use it.',
        '**Not offered for activity managers** — the number is generated, not edited, so there is no change to report.',
        '**Names do not follow schema changes.** If you change the schema and upgrade existing items, the attribute value changes but the workspace name, built at creation, stays as it was.',
      ],
    },
    { callout: 'exam', text: ['Typical traps: a Text: Reference attribute is the way to give unconnected workspaces a **unique** number; only **one** is allowed per category; it **cannot be used in workflows**; and changing its schema does **not** rename existing workspaces.'] },
    { callout: 'tip', text: ['Size the format for the lifetime of the type, not for the pilot: 000N runs out at 9 999. Changing the format later produces numbers of different lengths that sort badly.'] },
  ],
});

// ================================================================ CH 5 — COLUMNS, SIDEBAR, FACETS
G.push({
  id: 'bw-custom-columns',
  order: 22,
  title: 'Custom columns for business workspaces',
  area: 'workspaces',
  summary: 'Create custom columns from workspace category attributes, prepare them for sorting and filtering in Smart View widgets, and display them on the workspace location and on folders inside workspaces.',
  level: 'intermediate',
  minutes: 13,
  domains: ['ws-infra', 'ba-facets', 'ba-smart'],
  modules: ['bw05'],
  tags: ['custom column', 'facets volume', 'workspace columns', 'used for sorting and filtering', 'sortable', 'column availability', 'local column', 'global column'],
  related: ['bw-facets', 'bw-sidebar', 'bw-categories-for-types', 'ba-facets-columns', 'bw-using-classic'],
  sources: [SRC(5), SRC(3)],
  body: [
    'Custom columns surface category values in lists: in the Smart View **Workspaces** and **Related Workspaces** widgets, in browse lists inside a workspace, and in the Classic View detail list. They are optional — no core business workspace function depends on them — but they are the cheapest way to make workspace metadata visible and sortable.',
    { h: 'Columns that already exist' },
    'Installing business workspaces creates a **Workspace Columns** folder in the Facets volume with a few columns: the **Workspace Type ID** and a **Workspace Name** column for each language configured at the time (for example “Workspace Name en”). They are not yet prepared for sorting and filtering. If you add a language later, create its workspace-name column yourself and prepare it.',
    {
      figure: {
        type: 'tree',
        root: {
          label: 'Facets volume', icon: 'volume', children: [
            { label: 'Workspace Columns', icon: 'folder', note: 'created at installation', children: [
              { label: 'Workspace Type ID', icon: 'report' },
              { label: 'Workspace Name en', icon: 'report', note: 'one per language' },
            ] },
            { label: 'Supplier Workspaces', icon: 'folder', note: 'your own facet folder', children: [
              { label: 'Supplier ID', icon: 'report', note: 'column' },
              { label: 'Commodity', icon: 'report', note: 'column' },
              { label: 'Buyer', icon: 'report', note: 'column' },
              { label: 'Supplier Facets', icon: 'folder', note: 'facets and facet tree' },
            ] },
          ],
        },
      },
      caption: 'Columns, facets, facet trees and activity managers are all items in the Facets volume. Group them per workspace type.',
    },
    { h: 'Privileges' },
    'Creating columns needs the **Business Administration Facets and Columns** usage privilege and the **Column** object privilege. The Business Workspaces volume links to the Facets volume (Enterprise ▸ Business Workspaces ▸ Facets).',
    { h: 'Create the columns' },
    {
      steps: [
        'Open Enterprise ▸ Business Workspaces ▸ Facets and open (or create) the facet folder for your workspace type.',
        'Add Item ▸ Column.',
        'Choose the **Data Source** — the category attribute, e.g. Category: Supplier:Commodity — and give the column a name.',
        'Decide whether the column is **Sortable** (see the warning below) and click Add.',
        'Repeat for each attribute you want to show.',
      ],
      title: 'Create custom columns',
      ui: 'Classic UI',
    },
    { callout: 'warn', title: 'Sortable is one-way', text: ['Once a column is made **Sortable** you cannot clear the option — you would have to delete and recreate the column. Sorting adds load on the server, so enable it only where users really sort. A column that is only **displayed** in the Workspaces or Related Workspaces widget, or in a Classic View browse list, does not need to be sortable.'] },
    { h: 'Prepare columns for Smart View widgets' },
    'Smart View workspace widgets only offer sorting and filtering on columns that have been prepared for it. Each column has a **Workspaces** properties page for this.',
    {
      steps: [
        'In the facet folder, open the column’s Functions menu ▸ Properties ▸ **Workspaces**.',
        'Select **Used for Sorting and Filtering**.',
        'Click Update. Repeat for every column the widgets should sort or filter by.',
      ],
      title: 'Enable sorting and filtering for workspace widgets',
      ui: 'Classic UI',
    },
    {
      figure: {
        type: 'matrix',
        cols: ['Display', 'Sort', 'Filter'],
        rows: [
          { label: 'Text (string)', cells: [true, true, true] },
          { label: 'Date', cells: [true, 'date only, no time', false] },
          { label: 'Integer / Real', cells: [true, true, false] },
          { label: 'User field', cells: [true, false, false] },
        ],
      },
      caption: 'What Smart View workspace widgets can do with a prepared column, by data type (22.1): filtering is for strings only, user fields cannot be sorted.',
    },
    { h: 'Make the columns appear' },
    'A new column is invisible until three things line up:',
    {
      table: {
        head: ['Factor', 'Default for a new column', 'What to do'],
        rows: [
          ['Permissions', 'Public Access can see it (read)', 'Usually keep — users must be able to see the column item'],
          ['Availability', '**Not available**', 'Set Available everywhere, or Only available in specific locations and pick the folders'],
          ['Display state', 'Not displayed', 'Add the column to the location’s column list (local, inherited, global or personal display)'],
        ],
      },
    },
    {
      steps: [
        'In the facet folder, open the column’s Functions menu ▸ Properties ▸ **Availability**.',
        'Choose **Only available in specific locations** and click Browse Content Server.',
        'Select the workspace location folder (e.g. Enterprise ▸ Purchasing ▸ Suppliers) and click Update.',
        'Open that folder ▸ Properties ▸ Columns and add the column to the displayed list, in the order you want. Decide whether sub-folders inherit the setting.',
      ],
      title: 'Display columns on the workspace location',
      ui: 'Classic UI',
    },
    {
      figure: {
        type: 'flow',
        steps: [
          { label: 'Category attribute', sub: 'with values' },
          { label: 'Column item', sub: 'data source, sortable?' },
          { label: 'Prepared for widgets?', sub: 'Used for Sorting and Filtering', kind: 'decision' },
          { label: 'Availability', sub: 'everywhere or locations' },
          { label: 'Displayed', sub: 'location column list', kind: 'end' },
        ],
      },
      caption: 'From attribute to visible column.',
    },
    { h: 'Columns for items inside the workspace' },
    'Documents inside a workspace may carry their own categories (an invoice category, a contract category). To show those values, assign the columns to the **folders of the workspace template** — 01 Contracts shows Contract End, 03 Invoices shows Amount — so every new workspace gets them. Availability must include those folders (or be global).',
    { callout: 'note', text: ['There is little point showing the attributes that already make up the workspace name (Supplier ID and Name) as extra columns on the location — the name already shows them. Spend columns on values that are not in the name.'] },
    { callout: 'exam', text: ['Remember: pre-created columns live in **Workspace Columns**; new columns are **Not available** by default; Smart View widgets need **Used for Sorting and Filtering**; Smart View filters only **strings** and cannot sort **user** fields; **Sortable** cannot be undone.'] },
  ],
});

G.push({
  id: 'bw-sidebar',
  order: 23,
  title: 'Classic View sidebars: Content Filter and workspace sidebar widgets',
  area: 'workspaces',
  summary: 'Enable the Content Filter sidebar on the Configure Sidebar page, let users choose where it shows, and configure the business workspace sidebar widgets — Attributes, Recent Changes, Related Items, Work Items and Workspace Reference — with every parameter.',
  level: 'intermediate',
  minutes: 14,
  domains: ['ws-types', 'ba-facets', 'ba-ws-types', 'ba-smart'],
  modules: ['bw05', 'bw09'],
  tags: ['sidebar', 'content filter', 'configure sidebar', 'sidebar widgets', 'attributes widget', 'recent changes', 'related items', 'work items', 'workspace reference', 'classic view'],
  related: ['bw-facets', 'bw-workspace-type-settings', 'ba-perspective-manager', 'ba-related-workspaces', 'bw-perspective-widgets', 'bw-navigate-classic'],
  sources: [SRC(5), SRC(9)],
  body: [
    'In the Classic View, a business workspace has a **sidebar** next to its item list. Two different things live there: the **Content Filter**, which shows facets for faceted browsing, and the **workspace sidebar widgets**, small panels that show the workspace’s data, recent changes, relations and tasks. The first is switched on system-wide; the second is configured per **workspace type**. In Smart View the same information comes from perspective widgets, and the course notes that the type’s sidebar widget configuration is reused there where a perspective widget has a matching configuration.',
    {
      figure: {
        type: 'layers',
        layers: [
          { label: 'Workspace sidebar widgets', items: ['Attributes', 'Recent Changes', 'Related Items', 'Work Items', 'Workspace Reference'], note: 'per workspace type · Advanced tab' },
          { label: 'Content Filter', items: ['Facet trees', 'Facet values', 'More… lookup'], note: 'system-wide · Configure Sidebar page' },
          { label: 'User preference', items: ['Left or right', 'Show or hide'], note: 'My Account ▸ Settings ▸ General' },
        ],
      },
      caption: 'Three levels decide what a Classic View user sees in a workspace sidebar.',
    },
    { h: 'Enable the Content Filter sidebar' },
    'The Content Filter is turned on and shaped on the **Configure Sidebar** page of the Facets volume. By default every option on the page is selected. There are two ways in:',
    { path: ['Enterprise', 'Facets Volume', 'Functions', 'Control Panel', 'Sidebar'], ui: 'Classic UI' },
    { path: ['Administration', 'Core System – Server Configuration', 'Facets', 'Facets Volume Control Panel', 'Sidebar'], ui: 'Classic UI' },
    { h: 'What users can change' },
    'Each user decides on which side of the page the sidebar appears, and whether it appears at all, under **My Account ▸ Settings ▸ General**. If a user says “I have no filters”, check this setting before you check the facet configuration.',
    { h: 'Workspace sidebar widgets' },
    'Sidebar widgets are added on the **Advanced** tab of the workspace type, in the Side Bar Widgets section. For each row you tick **Enabled**, pick the widget type and enter a **title** (plain text or replacement variables). Drag rows to change the order. You can use the same widget type several times with different settings — for example two Attributes widgets, “Supplier” and “Contract”.',
    {
      table: {
        head: ['Widget', 'Shows', 'Notes'],
        rows: [
          ['Attributes', 'Selected category attribute values of the workspace', 'Optional link to the full Categories tab'],
          ['Recent Changes', 'Documents in the workspace changed recently', 'By version-added or modify date'],
          ['Related Items', 'Parent and child related workspaces', 'Tree or list'],
          ['Work Items', 'The current user’s tasks, workflow steps and reminders for this workspace', 'Personal to the viewer'],
          ['Workspace Reference', 'A link to the linked business object, opened in a pop-up', 'Extended ECM with a business application only'],
        ],
      },
    },
    {
      figure: {
        type: 'menu',
        title: 'Side Bar Widgets — widget type',
        items: ['Attributes', 'Recent Changes', 'Related Items', 'Work Items', 'Workspace Reference'],
        highlight: 'Attributes',
        note: 'Pick a type per row, tick Enabled, enter a title, then save the type before Detailed Configuration.',
      },
    },
    { callout: 'warn', text: ['The **Detailed Configuration** link of a widget only works after the workspace type has been **saved** once. Add the rows, save the type, then reopen it to configure each widget.'] },
    { h3: 'Attributes' },
    {
      table: {
        head: ['Parameter', 'Meaning'],
        rows: [
          ['Attributes (order, category, attribute)', 'Which attributes are listed and in which order — browse to the category, then pick the attribute'],
          ['Category', 'Whether a link to the workspace’s Categories tab is shown, where all categories and attributes appear'],
        ],
      },
    },
    { h3: 'Recent Changes' },
    {
      table: {
        head: ['Parameter', 'Meaning'],
        rows: [
          ['Date to Use', '**Version Added** (date of the latest version) or **Modify Date** (last modification)'],
          ['Oldest Change', 'Changes older than this many days are hidden; empty shows all'],
          ['Items to Display', 'Maximum number of items; only the most recent are listed'],
        ],
      },
    },
    { h3: 'Related Items' },
    {
      table: {
        head: ['Parameter', 'Meaning'],
        rows: [
          ['Display Style', 'Tree or List'],
          ['Show Parent Relationships', 'List workspaces that are parents of this one'],
          ['Show Child Relationships', 'List workspaces that are children of this one'],
          ['Workspace Types Shown', 'Restrict the related types listed (Change button)'],
          ['Relationships Shown', 'How many entries (default 7): children in Tree style, parents and children in List style'],
          ['Show Related Workspaces Folders', 'Link to the template’s related-workspaces folder: Never, Always, or When not all items shown'],
        ],
      },
    },
    'Relationships created manually in the Classic View are always added as **child** workspaces of the current one.',
    { h3: 'Work Items' },
    {
      table: {
        head: ['Parameter', 'Meaning'],
        rows: [
          ['Show Ahead', 'Only items due within this many days from today'],
          ['Task Lists', 'Which tasks from task lists in the workspace are shown — all, or also those without due dates'],
          ['Follow Ups', 'Whether the user’s reminders on items in the workspace appear (Active or In Progress only; reminders must be set up by the administrator)'],
          ['Initiated Workflows', 'Whether workflow steps related to the workspace appear, including steps without a due date'],
          ['Personal Assignments', 'Whether a link to all of the user’s assignments is shown'],
        ],
      },
    },
    { h3: 'Workspace Reference' },
    'Only meaningful with Extended ECM and a business application: it shows a link to the business object. In an unconnected (Content Server only) setup, leave it **disabled**. Replacing a workspace’s business object can give the workspace a new name but never moves it.',
    {
      steps: [
        'Open the workspace type and click the **Advanced** tab.',
        'In Side Bar Widgets, enable rows for Attributes, Recent Changes and Work Items; give each a title.',
        'Click Save Changes, then open the type again ▸ Advanced.',
        'Click **Detailed Configuration** next to Attributes; browse to the category and choose the attributes in order. Save Changes.',
        'Configure Recent Changes (e.g. Modify Date, 20 items) and Work Items (e.g. Show Ahead 14). Save the type.',
        'Open a workspace of that type in the Classic View to check the sidebar.',
      ],
      title: 'Configure the sidebar widgets of a workspace type',
      ui: 'Classic UI',
    },
    { callout: 'exam', text: ['Know which page does what: **Configure Sidebar** (Facets volume Control Panel) switches the Content Filter on; **My Account ▸ Settings ▸ General** lets each user move or hide it; the **workspace type’s Advanced tab** holds the sidebar widgets, which are a **Classic View** feature and need the type to be saved before Detailed Configuration.'] },
  ],
});

G.push({
  id: 'bw-facets',
  order: 24,
  title: 'Facets and facet trees for workspace locations',
  area: 'workspaces',
  summary: 'Build faceted browsing for workspaces in the Classic View: facet folders, facets and their permissions, every facet setting, facet trees with child levels, and where a facet tree is made available.',
  level: 'intermediate',
  minutes: 13,
  domains: ['ws-infra', 'ba-facets'],
  modules: ['bw05'],
  tags: ['facet', 'facet folder', 'facet tree', 'content filter', 'minimum unique values', 'display mode', 'display priority', 'availability', 'add child facet'],
  related: ['bw-custom-columns', 'bw-sidebar', 'ba-facets-columns'],
  sources: [SRC(5), SRC(3)],
  body: [
    '**Faceted browsing** lets a user narrow a long list by values: in the Suppliers folder, click Commodity ▸ Logistics, then Buyer ▸ M. Rossi, and only matching workspaces remain. In the Classic View the values appear in the **Content Filter** sidebar. What the sidebar shows is defined by **facet trees**, which are built from **facets**, which read a **data source** — usually a workspace category attribute.',
    {
      figure: {
        type: 'flow',
        steps: [
          { label: 'Facet folder', sub: 'organise per type' },
          { label: 'Facets', sub: 'one per data source' },
          { label: 'Configure facets', sub: 'Properties ▸ Specific' },
          { label: 'Facet tree', sub: 'Add Child Facet' },
          { label: 'Availability', sub: 'all or specific locations', kind: 'decision' },
          { label: 'Content Filter', sub: 'users browse', kind: 'end' },
        ],
      },
      caption: 'The build order. A facet is never shown on its own — only as part of an available facet tree.',
    },
    { h: 'Privileges' },
    'You need the **Business Administration Facets and Columns** usage privilege plus the object privileges for the items you add: **Facet Folder**, **Facet**, **Facet Tree** (and **Column** for columns).',
    { h: '1. A facet folder' },
    'Facet folders are plain organisers inside the Facets volume. One folder per workspace type (“Supplier Facets”) keeps facets, trees and their permissions together and makes a clean transport unit.',
    { steps: ['Open Enterprise ▸ Facets Volume and your workspace folder.', 'Add Item ▸ **Facet Folder**; name it, e.g. “Supplier Facets”; click Add.'], title: 'Create a facet folder', ui: 'Classic UI' },
    { h: '2. Facets' },
    {
      steps: [
        'Open the facet folder and choose Add Item ▸ **Facet**.',
        'Select the **Data Source** first, e.g. Category: Supplier:Commodity.',
        'Enter the facet name, e.g. “Commodity”, and click Add.',
        'Repeat for the other attributes users filter by (Buyer…).',
      ],
      title: 'Create facets',
      ui: 'Classic UI',
    },
    'A new facet gets **Public Access: Read**. Keep it: users who cannot see the facet item do not get its values in the sidebar.',
    { h: '3. Configure each facet' },
    'Open the facet’s Functions menu ▸ Properties ▸ **Specific**.',
    {
      table: {
        head: ['Setting', 'Default', 'Meaning'],
        rows: [
          ['Facet data source', '—', 'Read-only: the source chosen when the facet was created'],
          ['Status', '—', 'Read-only: **Building**, **Ready** or **Error**, with a button to rebuild'],
          ['Show in sidebar', 'On', 'Whether the facet may appear in the sidebar'],
          ['Minimum unique values', '2', 'The facet is hidden until the list holds at least this many distinct values — set 1 to see it on a test system with a single workspace'],
          ['Maximum values to display', '5', 'How many values are listed before “More…”'],
          ['Display mode', 'Ranked list', 'Ranked (most frequent first) or Alphabetical; date facets have no display mode'],
          ['Display priority', 'Medium', 'High, Medium or Low — higher facets are shown first'],
          ['Display count', 'Approximate', 'Show an approximate item count per value, or Do not display'],
          ['Show lookup in “More…”', '—', 'Lets users search within the values when they open More…'],
        ],
      },
    },
    { callout: 'tip', text: ['On a fresh test system with one or two workspaces, the default **minimum of 2 unique values** hides your new facet. Lower it to 1 while testing — and decide consciously whether production should keep 1 or 2.'] },
    { h: '4. A facet tree' },
    'The facet tree lists the facets whose values appear in the Content Filter, and in which hierarchy. A facet that is in no tree is never displayed.',
    {
      steps: [
        'In the facet folder choose Add Item ▸ **Facet Tree**; name it, e.g. “Supplier Tree”; click Add.',
        'Open the tree. Click **Add Child Facet** next to the tree name and choose the first facet (Commodity).',
        'To add a second facet at the same level, click Add Child Facet next to the **tree name** again; to nest a facet under another, use the button next to **that facet**.',
        'Click Update.',
      ],
      title: 'Build a facet tree',
      ui: 'Classic UI',
    },
    {
      figure: {
        type: 'tree',
        root: {
          label: 'Supplier Tree', icon: 'search', note: 'facet tree', children: [
            { label: 'Commodity', icon: 'category', note: 'level 1', children: [
              { label: 'Buyer', icon: 'category', note: 'level 2 — nested' },
            ] },
            { label: 'Contract End', icon: 'category', note: 'level 1 — sibling' },
          ],
        },
      },
      caption: 'Which Add Child Facet button you click decides the structure: next to the tree = sibling at level 1; next to a facet = child of that facet.',
    },
    { h: '5. Make the tree available' },
    'A finished tree shows nowhere until you set its availability (Functions ▸ Properties ▸ **Availability**).',
    {
      table: {
        head: ['Facet tree availability', 'Effect'],
        rows: [
          ['Never displayed', 'The default state for a tree under construction'],
          ['Display in all facet sidebars', 'Everywhere the Content Filter is shown'],
          ['Only display in specific locations', 'Only in the chosen containers and below — valid choices are the Enterprise Workspace, folders and projects'],
        ],
      },
    },
    {
      steps: [
        'Open the tree’s Functions menu ▸ Properties ▸ Availability.',
        'Choose **Only display in specific locations**; click Browse Content Server.',
        'Select the workspace location folder (e.g. Suppliers) and click Update.',
        'Open the folder in the Classic View and check the Content Filter.',
      ],
      title: 'Make the facet tree available in the location',
      ui: 'Classic UI',
    },
    {
      figure: {
        type: 'compare',
        items: [
          { title: 'Column availability', tone: 'info', points: ['Not available (default)', 'Available everywhere', 'Only available in specific locations', 'Then display it in the location’s column list'] },
          { title: 'Facet tree availability', tone: 'accent', points: ['Never displayed', 'Display in all facet sidebars', 'Only display in specific locations', 'Locations: Enterprise Workspace, folders, projects'] },
        ],
      },
      caption: 'Same idea, different wording — the exam likes to mix them up.',
    },
    { callout: 'exam', text: ['Order and defaults are the classic questions: **data source before name** when adding a facet; facets only show through an **available facet tree**; **Minimum unique values** defaults to **2**, **Maximum values** to **5**, **Display mode** to **Ranked list**, **Display priority** to **Medium**; facet status is **Building / Ready / Error**.'] },
  ],
});

// ================================================================ CH 6 — CLASSIFICATIONS
G.push({
  id: 'bw-classifications',
  order: 25,
  title: 'Classifications for workspace templates and locations',
  area: 'workspaces',
  summary: 'Why business workspaces need one classification tree for all templates, how to create classifications (management type, selectable), which privileges you need, and how classifications link templates, location folders and the optional extra classification of a type.',
  level: 'intermediate',
  minutes: 12,
  domains: ['ws-infra', 'ba-bw-infra'],
  modules: ['bw06', 'ws02'],
  tags: ['classification', 'classification tree', 'template types', 'management type', 'manual', 'assisted', 'automatic', 'selectable', 'manage pending objects', 'document templates administration'],
  related: ['bw-location-folder', 'bw-workspace-type-settings', 'ba-classifications', 'ba-workspace-templates', 'bw-create-template', 'bw-document-template-settings'],
  sources: [SRC(6), SRC(8), SRC(3)],
  body: [
    'For business workspaces a classification works as a **label that matches two things**: a workspace template and the folders where that template may be used. A user can only create a workspace in a location (root) folder with templates that carry the **same classification** as the folder. Without classifications, there is nothing to match — so a classification tree and at least one classification are required before workspaces can be created in a folder.',
    { h: 'One tree for all template types' },
    'All classifications used for workspace templates must sit in **one classification tree**, because the Content Server Document Templates settings point at a single tree. Plan it with the whole organisation in mind: the same server will hold ordinary documents and folders, workspaces and their templates.',
    { path: ['Administration', 'Content Server Administration', 'Document Templates Administration', 'Configure Content Server Document Templates'], ui: 'Classic UI' },
    {
      figure: {
        type: 'tree',
        root: {
          label: 'Classifications volume', icon: 'volume', children: [
            { label: 'Template Types', icon: 'classification', note: 'THE tree named in Document Templates settings', children: [
              { label: 'Supplier', icon: 'classification', note: 'template + Suppliers folder' },
              { label: 'Customer', icon: 'classification' },
              { label: 'Project', icon: 'classification', children: [
                { label: 'Internal Project', icon: 'classification' },
                { label: 'Customer Project', icon: 'classification' },
              ] },
            ] },
            { label: 'Document Types', icon: 'classification', note: 'separate tree, e.g. for smart document types' },
          ],
        },
      },
      caption: 'One template-types tree, usually one classification per workspace type (or per template family).',
    },
    { h: 'Privileges' },
    {
      table: {
        head: ['Task', 'Needs'],
        rows: [
          ['Create a classification tree', '**Classification Tree** object privilege'],
          ['Create classifications inside a tree', '**Classification** object privilege (and Add Items on the tree)'],
          ['Assign a classification to a folder', 'Permission to edit the folder’s classifications; See on the classification'],
        ],
        caption: 'A business administrator commonly gets the Classification privilege but not the Classification Tree privilege — the tree is created once by a system administrator.',
      },
    },
    { h: 'Settings of a classification' },
    {
      figure: {
        type: 'compare',
        items: [
          { title: 'Manual (default)', tone: 'pass', points: ['Never assigned by the system', 'Only people with the right permissions assign it', 'The right choice for template classifications'] },
          { title: 'Assisted', tone: 'info', points: ['System suggests it for items matching the classification profile', 'Suggestions wait on Manage Pending Objects', 'Not supported for RM classifications'] },
          { title: 'Automatic', tone: 'warn', points: ['System assigns it to every item matching the profile', 'No review step', 'Never for template matching'] },
        ],
      },
      caption: 'Management type: how much the system helps to assign the classification.',
    },
    {
      ul: [
        '**Management Type** — Manual, Assisted or Automatic (above). Assisted suggestions are accepted or rejected on **Manage Pending Objects** in Classifications Administration.',
        '**Selectable** — whether users may assign this node to items. A tree or a grouping node is often made *not* selectable, while its leaves are selectable. For template classifications keep the default: **selectable**.',
      ],
    },
    {
      steps: [
        'Open Enterprise ▸ Classifications (or Enterprise ▸ Business Workspaces ▸ Classifications).',
        'Open the template classification tree, e.g. “Template Types”. (Creating a new tree: Add Item ▸ Classification Tree, keeping Management Type Manual and Selectable on.)',
        'Add Item ▸ **Classification**. Name it after the workspace type, e.g. “Supplier”.',
        'Keep Management Type **Manual** and **Selectable** enabled. Click Add.',
      ],
      title: 'Create a classification for a workspace type',
      ui: 'Classic UI',
    },
    { h: 'Where the classification is used' },
    {
      figure: {
        type: 'hub',
        center: 'Classification “Supplier”',
        items: [
          { label: 'Workspace template', sub: 'set when the template is created' },
          { label: 'Location (root) folder', sub: 'Properties ▸ Classifications' },
          { label: 'Sub-folders where users create', sub: 'classify them too' },
          { label: 'Document Templates settings', sub: 'its tree is the template tree' },
        ],
      },
      caption: 'The classification is the handshake between “where” and “which template”.',
    },
    { callout: 'note', title: 'Not the same thing', text: ['The workspace type has its own optional **Classification** setting (Advanced tab). That one is simply **stamped on every workspace** created from the type — for example for records or search. It has nothing to do with the classification that matches templates to locations.'] },
    { h: 'Inheritance — keep it deliberate' },
    'Classifications can be inherited by items created below a classified container. For template matching you only need the **containers** where users create workspaces to be classified. Letting a template classification flow down onto every document creates thousands of meaningless classification records and confuses users; the course later shows how to switch off category and classification inheritance in templates.',
    { callout: 'exam', text: ['Exam facts: a classification is the **link between the root folder and the template**; both must carry the **same** classification; all template classifications belong to **one tree** set in the **Document Templates** administration; new classifications default to **Manual** and **Selectable**; **Assisted** suggestions go to **Manage Pending Objects**.'] },
  ],
});

// ================================================================ CH 7 — ACTIVITY FEEDS
G.push({
  id: 'bw-activity-feeds',
  order: 26,
  title: 'Activity feeds for business workspaces: Pulse, activity managers and rules',
  area: 'workspaces',
  summary: 'Turn on activity monitoring for business workspaces, create an activity manager per attribute in the Facets volume, and write rules with criteria and activity strings so attribute changes appear in the workspace activity feed.',
  level: 'advanced',
  minutes: 14,
  domains: ['ws-types', 'ba-modules', 'ba-smart'],
  modules: ['bw07'],
  tags: ['activity feed', 'pulse', 'collaboration administration', 'activity manager', 'activity rule', 'rule criteria', 'activity string', 'placeholders', 'header widget'],
  related: ['bw-categories-for-types', 'bw-custom-columns', 'ba-reminders-notifications', 'ba-perspective-manager'],
  sources: [SRC(7), SRC(3)],
  body: [
    'An activity feed tells the team what happened in a workspace: “Contract v3 added”, “Buyer changed from A. Lee to M. Rossi”. Business workspaces show it in the **Activity Feed** widget and in the activity area of the **header widget** in Smart View. There are two layers of activity, configured in two different places:',
    {
      figure: {
        type: 'compare',
        items: [
          { title: 'Content & status activity', tone: 'info', points: ['Documents added, versions, comments, status', 'For the workspace and all sub-items', 'Switched on by enabling Pulse for the Business Workspace object type', 'System administrator task'] },
          { title: 'Attribute-change activity', tone: 'accent', points: ['A category value added, changed, removed…', 'Needs an activity manager per attribute', 'Plus rules that decide the message', 'Business administrator task (Facets volume)'] },
        ],
      },
    },
    { h: '1. Enable activity monitoring (Pulse)' },
    'Content Server **Pulse** must be enabled for business workspaces before either the Activity Feed widget or the header’s activity feed shows anything. This is done on the administration pages, so it needs system administration rights.',
    { path: ['Admin', 'Content Server Administration', 'Pulse Administration', 'Collaboration Administration'], ui: 'Classic UI' },
    {
      steps: [
        'Open Content Server Administration; type “Pulse” in the filter to jump to Pulse Administration, and click **Collaboration Administration**.',
        'In **Select Object Types to Manage**, tick Business Workspace and click **Add Object Type**.',
        'In the Business Workspace row, select the collaboration features to make available (the course selects all).',
        'Click **Save Changes**.',
      ],
      title: 'Enable Pulse for business workspaces',
      ui: 'Classic UI',
    },
    { h: '2. Create activity managers' },
    'An **activity manager** watches one data source — one category attribute. Each data source can have **only one** activity manager; all rules for that attribute go into it. Activity managers are items in the **Facets volume**, next to your columns and facets. You need the **Business Administration Facets and Columns** usage privilege and the **Activity Manager** object privilege.',
    {
      steps: [
        'Open Enterprise ▸ Business Workspaces ▸ Facets (or Enterprise ▸ Facets Volume) and your workspace folder.',
        'Add Item ▸ **Activity Manager**.',
        'Name it, e.g. “Buyer Activity”, and choose the **Data Source**, e.g. Category: Supplier:Buyer. Click Add.',
        'Repeat for every attribute whose changes the team should see.',
      ],
      title: 'Create an activity manager',
      ui: 'Classic UI',
    },
    { callout: 'note', text: ['A **Text: Reference** attribute is not offered as a data source — its value is generated, not edited, so there is nothing to report.'] },
    { h: '3. Add rules' },
    'Rules are added on the activity manager’s Functions ▸ Properties ▸ **Specific** tab, with the green **Add a new rule before this one** button. Each rule has four parts:',
    {
      table: {
        head: ['Field', 'Meaning'],
        rows: [
          ['Rule Name', 'A label, e.g. “Buyer Changed”'],
          ['Rule Criteria', 'The kind of change that triggers it — the choices depend on the attribute type (table below)'],
          ['Activity String', 'The message, pre-filled with a template for the criteria; supports localisation and placeholders'],
          ['Object Types', 'The monitored object types — all listed by default; remove those you do not want to report'],
        ],
      },
    },
    {
      table: {
        head: ['Attribute type', 'Rule criteria offered (22.1)'],
        rows: [
          ['Date pop-up / Date field', 'New Value Added · Value Changed · Value Removed'],
          ['Check box', 'Value Changed · Value Enabled · Value Disabled'],
          ['Integer field', 'New Value Added · Value Changed · Value Removed · Value Increased · Value Decreased'],
          ['Integer pop-up', 'Value Changed · Value Increased · Value Decreased'],
          ['Text pop-up', 'Value Changed'],
          ['Text field / multi-line', 'New Value Added · Value Changed · Value Removed'],
          ['User field', 'Value Added · Value Changed · Value Removed'],
        ],
        caption: 'Wording differs slightly by type: a user field offers “Value Added”, a date field “New Value Added”.',
      },
    },
    { h3: 'Activity string placeholders' },
    {
      table: {
        head: ['Placeholder', 'Replaced by'],
        rows: [
          ['[ObjName]', 'The name of the item whose attribute changed'],
          ['[AttrName]', 'The attribute name'],
          ['[OldVal]', 'The value before the change'],
          ['[NewVal]', 'The value after the change'],
        ],
      },
    },
    'For Value Changed the default string reads, in effect, “[ObjName] [AttrName] changed from [OldVal] to [NewVal]”; for a new value it reads “[ObjName] [AttrName] set to [NewVal]”. Adjust the wording, but keep the placeholders.',
    {
      steps: [
        'Open the activity manager’s Functions ▸ Properties ▸ Specific.',
        'Click **Add a new rule before this one**.',
        'Rule Name “Buyer Changed”; Rule Criteria **Value Changed**. The Activity String fills in.',
        'Optionally remove object types you do not want reported. Click Submit.',
        'For a second rule (e.g. “Buyer Added” with Value Added), use the add button on the **empty line** below the existing rule, so it lands in the order you want.',
      ],
      title: 'Add rules to an activity manager',
      ui: 'Classic UI',
    },
    { h: 'What happens when a value changes' },
    {
      figure: {
        type: 'flow',
        steps: [
          { label: 'Attribute modified', kind: 'start' },
          { label: 'Activity manager for this data source?', kind: 'decision' },
          { label: 'Rules evaluated in listed order', kind: 'system' },
          { label: 'Rule matches?', kind: 'decision' },
          { label: 'Message built from activity string', kind: 'system' },
          { label: 'Shown in activity feed', kind: 'end' },
        ],
      },
      caption: 'No manager, or no matching rule, means no attribute activity — content activity from Pulse still appears.',
    },
    { callout: 'exam', text: ['Remember: Pulse (**Collaboration Administration**, object type Business Workspace) is required for the header and Activity Feed widget; **one activity manager per data source**; rules are evaluated **in the order listed**; placeholders are **[ObjName] [AttrName] [OldVal] [NewVal]**; criteria depend on the **attribute type**.'] },
  ],
});

// ================================================================ CH 8 — LOCATION
G.push({
  id: 'bw-location-folder',
  order: 27,
  title: 'The location (root) folder and sub-location paths',
  area: 'workspaces',
  summary: 'Create and secure the root folder where workspaces of a type are stored, classify it to match the template, and decide between fixed folders, the current location, attribute-driven locations and sub-location patterns.',
  level: 'intermediate',
  minutes: 12,
  domains: ['ws-infra', 'ba-bw-infra', 'ba-ws-types'],
  modules: ['bw08', 'ws02'],
  tags: ['location', 'root folder', 'sub location path', 'from pattern', 'from category attribute', 'current location', 'use also for manual creation', 'classification'],
  related: ['bw-classifications', 'bw-workspace-type-settings', 'ba-classifications', 'ws-setup-roadmap'],
  sources: [SRC(8), SRC(9)],
  body: [
    'Every workspace type needs a home: one or more **location (root) folders** where its workspaces are stored — Suppliers, Customers, Projects. The folder itself is an ordinary Content Server folder. What makes it a workspace location is two pieces of configuration: it carries the **same classification as the template**, and the **workspace type** points at it in its Workspace Creation Settings.',
    { h: 'Create and prepare the root folder' },
    {
      steps: [
        'Create the folder where it belongs in your information architecture, e.g. Enterprise ▸ Purchasing ▸ Suppliers.',
        'Set its permissions with care: everything created below it — generated sub-folders and the workspaces’ own starting point — inherits from it. Workspace creators need Add Items; most users need only See (their access to each workspace comes from its roles).',
        'Open the folder’s Functions menu ▸ Properties ▸ **Classifications**.',
        'In **Classify**, choose Browse Classifications, open the template tree (e.g. Template Types) and tick the workspace classification, e.g. Supplier.',
        'Click Submit and confirm the classification is listed.',
      ],
      title: 'Create and classify a location folder',
      ui: 'Classic UI',
    },
    { callout: 'remember', text: ['Only templates whose classification **matches the folder** can be used to create workspaces there. Template and location must have the same classification — that is the whole contract.'] },
    { h: 'Where does a new workspace land?' },
    'The workspace type’s **Location** setting decides. Its options and the optional sub-location path combine like this:',
    {
      table: {
        head: ['Location option', 'Workspaces are created…', 'Sub-location path?'],
        rows: [
          ['**Current Location** (default)', 'In the folder where the user starts creation', 'No'],
          ['**Content Server Folder**', 'In one fixed folder for all workspaces of the type', 'Yes'],
          ['**From Category Attribute**', 'In the folder identified by a category attribute value (the attribute holds the folder’s node ID)', 'Yes'],
          ['**From Business Property**', 'In a folder derived from a business application property (Extended ECM only)', 'Yes'],
        ],
      },
    },
    'Locations matter most for workspaces created **without a user choosing a folder** — by a business application, a workflow, a bulk load or the REST API. For manual creation, the option **Use also for manual creation** forces the configured location even when the user starts in another folder: the Classic View then opens the new workspace, Smart View shows a confirmation message.',
    {
      figure: {
        type: 'flow',
        steps: [
          { label: 'Create request', kind: 'start' },
          { label: 'Location option', sub: 'current · folder · attribute · property', kind: 'decision' },
          { label: 'Base folder' },
          { label: 'Sub-location pattern?', sub: 'evaluate attributes', kind: 'decision' },
          { label: 'Sub-folder (created if missing)', kind: 'system' },
          { label: 'Workspace stored', kind: 'end' },
        ],
      },
      caption: 'How the system works out the folder for a new workspace.',
    },
    { h: 'Sub-location paths' },
    'Thousands of workspaces in one flat folder are slow to browse. A **Sub Location Path** spreads them over sub-folders — either a **fixed** sub-folder, or **From Pattern**: text, category attributes and modifiers combined into folder names. Attributes are inserted with **Insert Attribute** and appear as a placeholder with the category’s ID and the attribute name, for example [24611:Commodity].',
    {
      figure: {
        type: 'tree',
        root: {
          label: 'Suppliers', icon: 'folder', note: 'Content Server Folder · classified “Supplier”', children: [
            { label: 'Hardware', icon: 'folder', note: 'from [Commodity]', children: [
              { label: 'SUP-0042 / Nordic Steel', icon: 'workspace' },
            ] },
            { label: 'Logistics', icon: 'folder', children: [
              { label: 'SUP-0057 / Fast Freight', icon: 'workspace' },
            ] },
            { label: 'SUP-0060 / Unsorted Ltd', icon: 'workspace', note: 'Commodity empty → stays in the root' },
          ],
        },
      },
      caption: 'A sub-location pattern on the Commodity attribute.',
    },
    {
      table: {
        head: ['Situation', 'Result'],
        rows: [
          ['The pattern attribute has a value', 'The workspace goes into the matching sub-folder'],
          ['**All** attributes of the sub-location are empty', 'The workspace is created directly in the location folder'],
          ['The attribute is changed later', 'The workspace is **not moved** — move it yourself if needed'],
          ['The business object of a workspace is replaced (Extended ECM)', 'The name may change; the location does not'],
        ],
      },
    },
    { callout: 'warn', text: ['Make every attribute used in a location or sub-location **required** and, ideally, a **popup**. Free text produces near-duplicate folders (“Logistics”, “logistics ”, “Logistic”); empty values pile workspaces up in the root.'] },
    { h: 'Several locations for one type' },
    'A type has one configured location, but users may create workspaces in **any folder that carries the template’s classification** (unless Use also for manual creation forces the configured one). That is how one Supplier type can serve “Purchasing ▸ Suppliers” and “Projects ▸ Subcontractors” — classify both folders.',
    { callout: 'exam', text: ['Expect: location and template need the **same classification**; **Current Location** is the default location option; a sub-location path is available for Content Server Folder, From Category Attribute and From Business Property; empty sub-location attributes leave the workspace in the **root**; changing the attribute **does not move** the workspace.'] },
  ],
});

// ================================================================ CH 9 — WORKSPACE TYPES
G.push({
  id: 'bw-workspace-type-settings',
  order: 28,
  title: 'Every setting of a workspace type',
  area: 'workspaces',
  summary: 'A complete reference to the General and Advanced tabs of a workspace type — names, name pattern, icons, copying, creation settings, fast bulk creation, search, indexing, sidebar widgets, classification, records management, roles — and to the creation and indexing status of a type.',
  level: 'advanced',
  minutes: 18,
  domains: ['ws-types', 'ba-ws-types', 'ba-bw-infra'],
  modules: ['bw09', 'ws03'],
  tags: ['workspace type', 'general tab', 'advanced tab', 'name pattern', 'insert attribute', 'generate names', 'widget icon', 'workspace copying', 'fast bulk', 'indexing status', 'creation status', 'disable creation'],
  related: ['bw-location-folder', 'bw-sidebar', 'bw-type-checklist', 'ba-workspace-types', 'ba-search-admin', 'ba-perspective-manager', 'bw-search-config', 'bw-perspectives'],
  sources: [SRC(9), SRC(3)],
  body: [
    'The workspace type is the framework every workspace of a kind is created in. It does not hold content — that is the template’s job — but it decides how the workspace is **named**, where it is **stored**, how it **looks** (icons, Classic View sidebar, link to Perspective Manager) and how its metadata is **indexed and searched**. Creating one needs the **Business Administration Business Workspaces** usage privilege.',
    { path: ['Enterprise', 'Business Workspaces', 'Workspace Types', 'Add Item', 'Workspace Type'], ui: 'Classic UI' },
    {
      figure: {
        type: 'layers',
        layers: [
          { label: 'General tab', items: ['Name', 'Type & workspace names', 'Icons', 'Perspective Manager', 'Copying', 'Creation settings'], note: 'everything a basic setup needs' },
          { label: 'Advanced tab', items: ['Search', 'Indexing', 'Sidebar widgets', 'Classification', 'Records Management', 'Roles', 'External documents'], note: 'optional settings and Classic View' },
          { label: 'Type list', items: ['Creation Status', 'Indexing Status', 'Disable / Enable Creation'], note: 'Workspace Types page' },
        ],
      },
      caption: 'Where each setting lives.',
    },
    { h: 'General tab' },
    {
      table: {
        head: ['Setting', 'What it controls', 'Notes'],
        rows: [
          ['Name', 'Internal name of the type', 'Mandatory; seen by administrators only'],
          ['Workspace Type Names', 'Display name of the type per language', 'Optional; can appear in the Smart View header; users see the one for their metadata language'],
          ['Business Workspace Names', 'The **name pattern** per language', 'At least the default language; text plus inserted attributes'],
          ['Generate names also for workspaces without business object', 'Applies the pattern when no business object supplies the data', '**Must be on** in a Content Server–only scenario'],
          ['Workspace Icon', 'Icon in the Classic View on workspaces and their root folder', 'Smart View uses the Widget Icon'],
          ['Widget Icon', 'Icon in the header, Workspaces, Related Workspaces and expanded Team widgets', 'gif, png or jpeg; about 128×128 px, max 1 MB; a default icon otherwise'],
          ['Perspective Manager', 'Link that opens Perspective Manager with a workspace-focused feature set', 'Needs the ActiveView – Perspectives Tab usage privilege'],
          ['Workspace Copying', 'Whether users may copy workspaces of this type', 'Off prevents duplicates of business records'],
          ['Workspace Creation Settings ▸ Location', 'Where workspaces are stored', 'Required: Current Location (default), Content Server Folder, From Category Attribute, From Business Property'],
          ['Sub Location Path', 'Sub-folder structure under the location', 'Fixed or From Pattern; see [[bw-location-folder]]'],
          ['Use also for manual creation', 'Forces the location for manual creation too', 'Users starting elsewhere are redirected'],
          ['Create workspaces with fast bulk method', 'Fast batch creation', 'Some items/columns unsupported; one failure cancels the whole batch'],
        ],
      },
    },
    { h3: 'Name patterns' },
    'A name pattern combines fixed text with attributes inserted through **Insert Attribute**. Each inserted attribute appears as a bracketed placeholder made of the category’s ID and the attribute name — for example “[24611:Supplier ID] / [24611:Supplier Name]” yields “SUP-0042 / Nordic Steel”. Separators such as a dash, parentheses or a forward slash are fine; a **colon cannot be used** as a separator, because Content Server uses it inside the placeholder syntax.',
    {
      steps: [
        'In Business Workspace Names, click into the default-language field and click **Insert Attribute**.',
        'Choose the category attribute, e.g. Supplier:Supplier ID, and click Insert.',
        'Type the separator: space, slash, space.',
        'Insert the second attribute, e.g. Supplier:Supplier Name.',
        'Tick **Generate names also for workspaces without business object** (no business application connected).',
      ],
      title: 'Build a name pattern',
      ui: 'Classic UI',
    },
    { callout: 'note', title: 'Business workspace vs. Content Server–only workspace', text: ['When a leading application (SAP, Salesforce…) triggers creation, it delivers the metadata and the name. When workspaces are created in Content Server only, users type the metadata — and the name pattern is only applied if **Generate names also for workspaces without business object** is selected. Forgetting it is a classic reason for workspaces named exactly what the user typed.'] },
    { h: 'Advanced tab' },
    {
      table: {
        head: ['Setting', 'What it controls', 'Notes'],
        rows: [
          ['Search Settings', 'Whether a search started in a workspace also covers its related workspaces', '**Disabled** (default), **Available as an option** in “Search from here”, or **Always enabled**'],
          ['Indexing Settings', 'Workspace category attributes indexed as extra metadata on child items and nested workspaces', 'Choose the object types; needs category inheritance; existing items need re-indexing'],
          ['Side Bar Widgets', 'Classic View sidebar: Attributes, Recent Changes, Related Items, Work Items, Workspace Reference', 'Configure after the first save; see [[bw-sidebar]]'],
          ['Classification', 'An extra classification added to every new workspace of this type', 'Unrelated to the template/location matching classification'],
          ['Records Management', 'Enable Records Management for workspaces of the type', 'RM classification shown in properties; takes effect **immediately** for the type'],
          ['Roles', 'Adds the creator to the **Team Lead** role, if the template has one', 'On by default, also for existing types'],
          ['External Document Storage', 'Where documents generated in the business application are stored, and their RM classification', 'Extended ECM only'],
        ],
      },
    },
    { h3: 'Indexing settings in practice' },
    'With indexing on, a user can find an invoice by the supplier’s commodity even though the invoice itself carries no supplier category: the workspace’s attributes are indexed as supplementary metadata of the items inside. Two conditions apply: the change only affects items **added after it**, so existing items must be **re-indexed**; and in 22.1 the course ties it to category inheritance being enabled in the template.',
    {
      figure: {
        type: 'cycle',
        steps: [
          { label: 'Change indexing settings' },
          { label: 'Status: Re-indexing required' },
          { label: 'Test run / schedule re-index', sub: 'Functions menu of the type' },
          { label: 'Items passed to index engine' },
          { label: 'Status: Up to date', sub: 'searchable once processed' },
        ],
        center: 'Indexing Status',
      },
      caption: 'Indexing Status always flips to “Re-indexing required” after a change — even if no workspaces exist yet.',
    },
    { h: 'The Workspace Types page' },
    {
      table: {
        head: ['Column / function', 'Meaning'],
        rows: [
          ['Creation Status', 'Whether new workspaces of the type may be created — **enabled** by default'],
          ['Disable Creation / Enable Creation', 'Functions-menu commands that switch it; existing workspaces stay usable'],
          ['Indexing Status', '**Re-indexing required** or **Up to date** (items handed to the index engine; processing may still take time)'],
          ['In Use', 'A type must be enabled to be in use'],
        ],
      },
    },
    {
      steps: [
        'Open Enterprise ▸ Business Workspaces ▸ Workspace Types.',
        'Add Item ▸ Workspace Type. Enter the Name and the Workspace Type Name for each language.',
        'Build the Business Workspace Names pattern; tick Generate names also for workspaces without business object.',
        'Location: Content Server Folder ▸ Select the root folder; optionally Sub Location Path ▸ From Pattern ▸ Insert Attribute; decide on Use also for manual creation.',
        'Choose the icons; leave Workspace Copying as your policy requires. Click **Apply**.',
        'Advanced tab: set Search Settings, Indexing Settings, Side Bar Widgets, and (if needed) Classification, Records Management and Roles. Click **Save Changes**.',
        'Reopen the type to configure each sidebar widget’s Detailed Configuration.',
      ],
      title: 'Create a workspace type end to end',
      ui: 'Classic UI',
    },
    { callout: 'tip', text: ['Disabling creation is the safe way to retire a type or freeze it during a redesign: nobody can create new workspaces, but nothing existing is touched. Enable it again from the same Functions menu.'] },
    { callout: 'exam', text: ['High-value facts: two tabs, **General** (basic) and **Advanced** (optional + Classic View); **Generate names also for workspaces without business object** for Content Server–only scenarios; no **colon** in name patterns; Location options and the default **Current Location**; fast bulk fails **whole batches**; Search Settings default **Disabled**; Indexing changes need **re-indexing**; RM enablement is **immediate**; creator → **Team Lead** by default.'] },
  ],
});

G.push({
  id: 'bw-type-checklist',
  order: 29,
  title: 'Checklist: building blocks and workspace type',
  area: 'workspaces',
  summary: 'A printable configuration checklist for the building-block stage — privileges, category, columns, facets, classification, activity feeds, location and workspace type — with the check that proves each step worked.',
  level: 'intermediate',
  minutes: 8,
  domains: ['ws-infra', 'ws-types', 'ba-bw-infra', 'ba-ws-types'],
  modules: ['bw04', 'bw09'],
  tags: ['checklist', 'configuration order', 'privileges', 'building blocks', 'workspace type', 'verification'],
  related: ['ws-setup-roadmap', 'bw-categories-for-types', 'bw-workspace-type-settings', 'bw-location-folder', 'ws-troubleshooting', 'bw-rights', 'bw-admin-page-volume', 'bw-capstone'],
  sources: [SRC('3–9')],
  body: [
    'Use this list each time you build a new kind of workspace. It follows the order the configuration objects depend on each other; templates, roles and perspectives come after it (see [[ws-setup-roadmap]]).',
    {
      figure: {
        type: 'flow',
        vertical: true,
        steps: [
          { label: 'Privileges', sub: 'usage + object privileges' },
          { label: 'Category', sub: 'attributes, Text: Reference' },
          { label: 'Columns & facets', sub: 'optional, metadata display' },
          { label: 'Classification', sub: 'in the template tree' },
          { label: 'Activity feeds', sub: 'Pulse, managers, rules' },
          { label: 'Location folder', sub: 'classified, secured' },
          { label: 'Workspace type', sub: 'names, location, widgets', kind: 'end' },
        ],
      },
      caption: 'The building-block stage, in the order the course follows (chapters 4–9).',
    },
    { h: 'Privileges first' },
    {
      figure: {
        type: 'matrix',
        cols: ['Usage privilege', 'Object privilege'],
        rows: [
          { label: 'Category', cells: ['BA Data Policies', 'Category'] },
          { label: 'Columns', cells: ['BA Facets and Columns', 'Column'] },
          { label: 'Facets & trees', cells: ['BA Facets and Columns', 'Facet Folder, Facet, Facet Tree'] },
          { label: 'Classification tree', cells: [false, 'Classification Tree'] },
          { label: 'Classification', cells: [false, 'Classification'] },
          { label: 'Activity manager', cells: ['BA Facets and Columns', 'Activity Manager'] },
          { label: 'Workspace type', cells: ['BA Business Workspaces', false] },
          { label: 'Pulse for workspaces', cells: ['System administration', false] },
        ],
      },
      caption: 'BA = Business Administration. The Business Administrators group created at installation holds the BA usage privileges.',
    },
    { h: 'The checklist' },
    {
      table: {
        head: ['#', 'Do', 'Proof that it worked'],
        rows: [
          ['1', 'Create the category in a workspace category folder; key attributes required; a Text: Reference for the number', 'Category opens with all attributes in order; a test item gets a generated number'],
          ['2', 'Create columns from the attributes; Used for Sorting and Filtering where widgets sort or filter', 'Columns listed in your facet folder; Workspaces tab option ticked'],
          ['3', 'Set column availability to the location and display the columns there', 'Columns visible on the location folder'],
          ['4', 'Create facet folder, facets (min. unique values reviewed), a facet tree; make it available in the location', 'Content Filter shows the tree in the location (Classic View)'],
          ['5', 'Create the classification in the template classification tree (Manual, Selectable)', 'Classification listed under the tree'],
          ['6', 'Enable Pulse for Business Workspace; create activity managers and rules', 'Business Workspace row in Collaboration Administration; rules listed on each manager’s Specific tab'],
          ['7', 'Create the location folder, set permissions, assign the classification', 'Properties ▸ Classifications lists it'],
          ['8', 'Create the workspace type: names, pattern, Generate names option, location, sub-path, icons', 'Type listed with Creation Status enabled'],
          ['9', 'Advanced tab: search, indexing, sidebar widgets (then Detailed Configuration)', 'Indexing Status shown; widgets configured'],
          ['10', 'Next stage: template with the same classification and the category', 'A test workspace gets the right name, place and sidebar'],
        ],
      },
    },
    { callout: 'warn', text: ['Most “it doesn’t work” moments at this stage come from four slips: the location folder is **not classified**, the pattern attributes are **optional**, **Generate names also for workspaces without business object** is off, or a new facet hides behind **Minimum unique values = 2**.'] },
    { callout: 'exam', text: ['If a question lists the configuration steps out of order, rebuild it from dependencies: **category → (columns/facets) → classification → (activity) → location → workspace type → template**.'] },
  ],
});
