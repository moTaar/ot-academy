'use strict';
// Business Workspaces track, part B (course 2-0108 chapters 4–9): the building
// blocks — category, columns, sidebar and facets, classification, activity
// feeds, the location folder — and the workspace type. Missions use the
// learner's own names (a "Training Supplier" setup) on their own server.
// All text is original to this trainer.

const SRC = 'Content Server Business Workspaces (2-0108, 22.1) — Ch. ';

module.exports = [
  // ------------------------------------------------------------------ BW04
  {
    id: 'bw04', track: 'workspaces', order: 4, title: 'Categories for workspace types', source: `${SRC}4`, feature: 'businessWorkspaces',
    domains: ['ws-infra', 'ba-bw-infra'],
    summary: 'Design and create the category a workspace type reads its names, locations, columns and feeds from — including a generated Text: Reference number.',
    lesson: [
      'Every business workspace configuration starts with metadata. The **category** of a workspace type holds the business data of each workspace, and nearly every later configuration object reads from it: the workspace type builds the **name** and the **sub-location path** from its attributes, custom columns and facets display them, activity managers watch them for changes, and the header and sidebar show them. When no business application is connected, category attributes are the **only** source the type can use for names and locations.',
      'A category reaches the workspaces through the **template**: add it to the workspace template and every workspace created from that template carries it. You can reuse an existing category or build one for the purpose — usually in a dedicated category folder such as “Workspace Categories”, so workspace categories are easy to secure and to transport.',
      {
        figure: {
          type: 'hub',
          center: 'Workspace category',
          items: [
            { label: 'Name pattern', sub: 'workspace type' },
            { label: 'Sub-location path', sub: 'workspace type' },
            { label: 'Columns & facets', sub: 'Facets volume' },
            { label: 'Activity managers', sub: 'attribute changes' },
            { label: 'Header & sidebar', sub: 'what users see' },
            { label: 'Template', sub: 'carries it to each workspace' },
          ],
        },
        caption: 'Who reads the category. Design it for all of them.',
      },
      { h: 'Choosing attributes' },
      'Pick attribute types by what will consume them. A **Text: Popup** gives controlled values that make good facets and folder names. A **User: Field** names a responsible person. A **Date: Field** holds business dates. And the **Text: Reference** type generates a unique number from a schema of fixed text, variables like %Y% and %sequence%, and other attributes — ideal for a workspace number such as SUP-0042. It has limits: one per category, not usable in workflows, and changing its schema later does not rename existing workspaces.',
      {
        figure: {
          type: 'flow',
          steps: [
            { label: '“SUP-”', sub: 'fixed text' },
            { label: '%sequence%', sub: 'counter variable' },
            { label: 'Format 000N', sub: 'four digits', kind: 'system' },
            { label: 'SUP-0042', kind: 'end' },
          ],
        },
        caption: 'A Text: Reference schema at work.',
      },
      'Two flags matter on every attribute. **Required** forces a value before the workspace can be created — mandatory for anything used in the name or the location path. **Show in Search** makes the value searchable. Creating categories needs the **Business Administration Data Policies** usage privilege and the **Category** object privilege.',
      {
        steps: [
          'Open Enterprise ▸ Business Workspaces ▸ Categories (the Categories volume).',
          'Open or create your workspace category folder; Add Item ▸ Category; name it and click Add.',
          'Open the category and use Add Attribute for each attribute: type, name, Required, Show in Search, valid values.',
          'For the generated number choose Text: Reference: schema, sequence format, Show in Search.',
          'Submit the category.',
        ],
        title: 'Create a workspace category',
        ui: 'Classic UI',
      },
      { callout: 'warn', text: ['Category definitions are versioned. Changing attributes later means upgrading the items that use them, and names or locations already generated do **not** follow the change. Settle the design before go-live.'] },
      { callout: 'exam', text: ['Privileges: **BA Data Policies** usage + **Category** object privilege. Without a business object, name and location come only from **category attributes**. Text: Reference: **one per category**, **not in workflows**.'] },
      'Deeper: [[bw-categories-for-types]] and [[bw-text-reference]].',
    ],
    keyPoints: [
      'The category is the first building block: names, paths, columns, facets and feeds all read it.',
      'It reaches workspaces through the template.',
      'Attributes used in the name or location must be required and, ideally, controlled.',
      'Text: Reference generates unique numbers — one per category, not in workflows.',
      'Creating categories needs BA Data Policies (usage) and Category (object) privileges.',
    ],
    missions: [
      {
        id: 'bw04-folder', type: 'hands-on', title: 'Create a category folder for workspace categories', xp: 25,
        brief: 'Keep workspace categories together so they are easy to find, secure and transport.',
        steps: [
          'Open the Categories volume (Enterprise ▸ Categories, or Enterprise ▸ Business Workspaces ▸ Categories).',
          'Add Item ▸ Category Folder. Name it exactly “Workspace Categories”, at the top level of the volume.',
        ],
        hints: ['This needs Add Items on the Categories volume — use a training server, or ask an administrator.', 'If the folder already exists from an earlier attempt, the check simply finds it.'],
        checks: [{ kind: 'child', parent: 'categoriesVolume', name: 'Workspace Categories', types: [132], typeName: 'category folder', saveAs: 'bwCatFolder', label: 'Category folder “Workspace Categories” in the Categories volume' }],
        open: 'categoriesVolume',
      },
      {
        id: 'bw04-category', type: 'hands-on', title: 'Build the “Training Supplier” category', xp: 35, requires: ['bw04-folder'],
        brief: 'A category for a supplier workspace type, with a generated supplier number.',
        steps: [
          'Open “Workspace Categories” and choose Add Item ▸ Category. Name it exactly “Training Supplier”.',
          'Open it and add: Supplier ID (Text: Reference, schema SUP-%sequence%, format 000N, Show in Search).',
          'Add Supplier Name (Text: Field, required), Commodity (Text: Popup, required: Hardware, Software, Services, Logistics), Buyer (User: Field, required) and Contract End (Date: Field).',
          'Submit the category.',
        ],
        hints: ['If your server has no Text: Reference type, business workspaces may not be installed — use a Text: Field “Supplier ID” instead and note it in your reflection for the next mission.'],
        checks: [{ kind: 'child', parent: 'bwCatFolder', name: 'Training Supplier', types: [131], typeName: '^category$', saveAs: 'bwSupplierCat', label: 'Category “Training Supplier” in “Workspace Categories”' }],
        open: 'bwCatFolder',
      },
      {
        id: 'bw04-design', type: 'practice', title: 'Justify every attribute', xp: 15, requires: ['bw04-category'],
        brief: 'Good categories are small. Prove each attribute earns its place.',
        steps: [
          'List the attributes of “Training Supplier”.',
          'For each, write which consumer will use it: name pattern, sub-location path, column, facet, activity rule, search.',
          'Check which ones you made Required and whether that matches their use.',
        ],
        reflection: 'For each attribute of your Training Supplier category, name the configuration that will use it and say why it is (or is not) required. Which attribute would you drop if users complained about slow creation?',
        minWords: 35,
      },
      {
        id: 'bw04-quiz', type: 'quiz', title: 'Knowledge check: workspace categories', xp: 25,
        questions: [
          { q: 'Which privileges does a business administrator need to create a workspace category?', options: ['Business Administration Data Policies usage privilege and the Category object privilege', 'Only the Category object privilege', 'System administration rights', 'The Business Administration Business Workspaces usage privilege only'], answer: 0, explain: 'Category creation combines the Data Policies usage privilege with the Category object privilege.' },
          { q: 'No business application is connected. Where can the workspace type take the values for the workspace name from?', options: ['Category attributes of the workspace', 'The template’s folder names', 'The user’s profile', 'The classification name'], answer: 0, explain: 'Without a business object, name patterns and locations can only use category attributes.' },
          { q: 'How does a category end up on every new workspace of a type?', options: ['It is added to the workspace template', 'It is selected on the workspace type', 'It is inherited from the Categories volume', 'It is assigned by the classification'], answer: 0, explain: 'The template is copied at creation, including its categories.' },
          { q: 'Which statement about the Text: Reference attribute is true?', options: ['A category can hold only one, and it cannot be used in workflows', 'A category can hold several, one per language', 'It is required for every workspace category', 'It renames existing workspaces when its schema changes'], answer: 0, explain: 'One per category, not in workflows; schema changes do not rename existing workspaces.' },
          { q: 'In a reference number schema, what does the sequence number format 000N do?', options: ['Pads the %sequence% counter to four digits with leading zeros', 'Starts the counter at 1000', 'Adds the year', 'Limits the category to 1000 items'], answer: 0, explain: 'The format sets digits and leading zeros for %sequence%; 000N gives 0001, 0002…' },
          { q: 'An attribute feeds the sub-location path. How should it be defined?', options: ['Required, ideally a popup with controlled values', 'Optional free text', 'A multi-line text field', 'A Date: Calendar attribute'], answer: 0, explain: 'Empty or inconsistent values produce misplaced workspaces or near-duplicate folders.' },
          { q: 'What does Show in Search do on an attribute?', options: ['Makes the attribute searchable', 'Shows the attribute in every browse list', 'Makes it mandatory', 'Adds it to the name pattern'], answer: 0, explain: 'Show in Search makes the attribute available for searching; display in lists is done with columns.' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ BW05
  {
    id: 'bw05', track: 'workspaces', order: 5, title: 'Custom columns, sidebar and facets', source: `${SRC}5`, feature: 'businessWorkspaces',
    domains: ['ws-infra', 'ba-facets', 'ba-smart'],
    summary: 'Show workspace metadata in lists with custom columns, prepare them for Smart View widgets, and build Classic View faceted browsing with facets and facet trees.',
    lesson: [
      'Columns and facets are optional for business workspaces — nothing breaks without them — but they turn category data into something users can see, sort and filter. Both are items in the **Facets volume**, reached from Enterprise ▸ Business Workspaces ▸ Facets, and both read a **data source**, typically a workspace category attribute. Installing business workspaces already created a **Workspace Columns** folder with the Workspace Type ID and a Workspace Name column per language; they are not yet prepared for sorting and filtering.',
      {
        figure: {
          type: 'tree',
          root: {
            label: 'Facets volume', icon: 'volume', children: [
              { label: 'Workspace Columns', icon: 'folder', note: 'pre-created' },
              { label: 'Supplier Workspaces', icon: 'folder', children: [
                { label: 'Columns', icon: 'report', note: 'Supplier ID, Commodity, Buyer' },
                { label: 'Supplier Facets', icon: 'folder', note: 'facet folder', children: [
                  { label: 'Commodity · Buyer', icon: 'category', note: 'facets' },
                  { label: 'Supplier Tree', icon: 'search', note: 'facet tree' },
                ] },
              ] },
            ],
          },
        },
        caption: 'One folder per workspace type keeps columns, facets and trees together.',
      },
      { h: 'Columns' },
      'Add Item ▸ Column, choose the data source and name it. Making a column **Sortable** is permanent and costs performance, so only do it where users sort; display alone needs no sorting. For the Smart View Workspaces and Related Workspaces widgets, tick **Used for Sorting and Filtering** on the column’s Properties ▸ Workspaces page. Smart View filters string columns only, cannot sort user fields, and sorts dates without the time.',
      'A new column is **Not available** and Public Access can read it. Set **Availability** — everywhere or only in specific locations such as the supplier root folder — then display it in that folder’s column list. Columns for documents inside workspaces belong on the **template folders**, so each new workspace inherits them.',
      { h: 'The Classic View sidebar and facets' },
      'The Classic View **Content Filter** sidebar shows facet values. It is switched on on the **Configure Sidebar** page (Facets volume ▸ Control Panel ▸ Sidebar; all options on by default), and each user chooses its side, or hides it, in My Account ▸ Settings ▸ General.',
      {
        figure: {
          type: 'flow',
          steps: [
            { label: 'Facet folder' },
            { label: 'Facets', sub: 'data source first' },
            { label: 'Configure', sub: 'min. unique values…' },
            { label: 'Facet tree', sub: 'Add Child Facet' },
            { label: 'Available', sub: 'in the location', kind: 'end' },
          ],
        },
        caption: 'Facets are only shown through an available facet tree.',
      },
      {
        steps: [
          'In your facet folder: Add Item ▸ Facet Folder “Supplier Facets”.',
          'Add Item ▸ Facet: choose the data source (Category: Training Supplier:Commodity), name it, Add. Repeat for Buyer.',
          'On each facet: Properties ▸ Specific ▸ Minimum unique values = 1 (for a test system), Update.',
          'Add Item ▸ Facet Tree “Supplier Tree”; open it; Add Child Facet next to the tree name for each facet; Update.',
          'Tree ▸ Properties ▸ Availability ▸ Only display in specific locations ▸ your supplier folder; Update.',
        ],
        title: 'Faceted browsing for a workspace location',
        ui: 'Classic UI',
      },
      { callout: 'tip', text: ['Facet defaults: minimum unique values **2**, maximum values **5**, display mode **Ranked list**, priority **Medium**, count **Approximate**. On a near-empty test system the minimum of 2 hides your facet — that is the usual “my facet does not show” cause.'] },
      { callout: 'exam', text: ['Privileges: **BA Facets and Columns** usage + **Column / Facet / Facet Tree / Facet Folder** object privileges. Smart View widgets need **Used for Sorting and Filtering**. Sortable **cannot be undone**.'] },
      'Deeper: [[bw-custom-columns]], [[bw-facets]], [[bw-sidebar]].',
    ],
    keyPoints: [
      'Columns, facets and facet trees are items in the Facets volume, built from a data source.',
      'Workspace widgets in Smart View sort and filter only columns marked Used for Sorting and Filtering.',
      'New columns are Not available; set availability, then display them in the location.',
      'Sortable is permanent and costs performance.',
      'Facets appear only through a facet tree that is made available; the Content Filter is enabled on the Configure Sidebar page.',
    ],
    missions: [
      {
        id: 'bw05-columns', type: 'practice', title: 'Create and prepare custom columns', xp: 20, requires: ['bw04-category'],
        brief: 'Make supplier data visible and sortable in workspace widgets.',
        steps: [
          'Open Enterprise ▸ Business Workspaces ▸ Facets; create a folder for your supplier configuration if you have none.',
          'Add columns for Supplier ID, Supplier Name, Commodity, Buyer and Contract End from the Training Supplier category. Make sortable only the ones users will sort.',
          'On each column: Properties ▸ Workspaces ▸ Used for Sorting and Filtering ▸ Update.',
          'Look at the pre-created Workspace Columns folder and note what it contains.',
        ],
        reflection: 'Which columns did you make sortable and why? Which column can a Smart View widget not sort, and which can it not filter? What did you find in the Workspace Columns folder?',
        minWords: 35,
      },
      {
        id: 'bw05-display', type: 'practice', title: 'Show columns on the supplier location', xp: 15, requires: ['bw05-columns'],
        brief: 'A column nobody sees is no column. Make two of them appear.',
        steps: [
          'In your sandbox, create a folder “Training Suppliers” (you will classify it later).',
          'Set the Buyer and Contract End columns to Only available in specific locations ▸ that folder.',
          'Open the folder ▸ Properties ▸ Columns and add both columns to the display list.',
        ],
        reflection: 'Describe the three factors that decide whether a column shows, what each one was set to for your Buyer column, and why you did not display Supplier ID and Name as columns.',
        minWords: 30,
      },
      {
        id: 'bw05-facets', type: 'practice', title: 'Build a facet tree for suppliers', xp: 20, requires: ['bw05-columns'],
        brief: 'Let Classic View users filter suppliers by commodity and buyer.',
        steps: [
          'Check the Configure Sidebar page (Facets volume ▸ Control Panel ▸ Sidebar) and your own My Account ▸ Settings ▸ General sidebar setting.',
          'Create a facet folder “Supplier Facets” with facets Commodity and Buyer; set Minimum unique values to 1.',
          'Create the facet tree “Supplier Tree” with both facets at level 1, in that order.',
          'Make the tree available only in “Training Suppliers”.',
        ],
        reflection: 'Explain the difference between a facet and a facet tree, which availability option you chose and why, and what a user would see in the Content Filter if Minimum unique values had stayed at 2.',
        minWords: 35,
      },
      {
        id: 'bw05-quiz', type: 'quiz', title: 'Knowledge check: columns, sidebar and facets', xp: 25,
        questions: [
          { q: 'Users want to sort the Smart View Workspaces widget by Commodity. What must be done to the Commodity column besides creating it?', options: ['Select Used for Sorting and Filtering on its Workspaces properties', 'Add it to a facet tree', 'Make it a global column', 'Create an activity manager for it'], answer: 0, explain: 'Smart View workspace widgets only sort and filter on columns prepared with Used for Sorting and Filtering.' },
          { q: 'An administrator made a column Sortable by mistake. How is this undone?', options: ['Delete the column and create it again', 'Clear the Sortable check box', 'Set availability to Not available', 'Rebuild the facet'], answer: 0, explain: 'Sortable cannot be unselected; the column must be recreated.' },
          { q: 'What is the availability of a newly created custom column?', options: ['Not available', 'Available everywhere', 'Available in the Enterprise Workspace', 'Available in the Facets volume only'], answer: 0, explain: 'New columns start as Not available; you choose everywhere or specific locations.' },
          { q: 'Which data type can a Smart View workspace widget filter on?', options: ['String', 'User field', 'Date', 'Integer'], answer: 0, explain: 'In 22.1 filtering is supported for string data only.' },
          { q: 'A new facet does not appear in the Content Filter of the location. It is part of an available facet tree. What is the most likely cause on a test system with one workspace?', options: ['Minimum unique values is still at its default of 2', 'The facet is Sortable', 'The facet folder has no classification', 'Pulse is disabled'], answer: 0, explain: 'A facet is hidden until it has at least the minimum number of distinct values — 2 by default.' },
          { q: 'Where is the Content Filter sidebar enabled?', options: ['On the Configure Sidebar page of the Facets volume', 'On the workspace type’s Advanced tab', 'In Perspective Manager', 'In the Document Templates settings'], answer: 0, explain: 'Facets volume ▸ Control Panel ▸ Sidebar (Configure Sidebar); users then choose its side in My Account.' },
          { q: 'When adding a facet, which field does the course fill first?', options: ['The data source', 'The display priority', 'The availability', 'The facet tree'], answer: 0, explain: 'Pick the data source first, then name the facet; configuration and trees come afterwards.' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ BW06
  {
    id: 'bw06', track: 'workspaces', order: 6, title: 'Classifications', source: `${SRC}6`, feature: 'businessWorkspaces',
    domains: ['ws-infra', 'ba-bw-infra'],
    summary: 'Use one classification tree for all workspace templates, create a classification per workspace type, and understand management type and selectable.',
    lesson: [
      'A classification is how Content Server knows **which templates may be used where**. The workspace template carries a classification; the location (root) folder carries the same one; a user creating a workspace in that folder is offered exactly the templates whose classification matches. No classification, no match — so a classification tree and a classification are required before workspaces can be created in a folder.',
      {
        figure: {
          type: 'flow',
          steps: [
            { label: 'Template', sub: 'classified “Supplier”' },
            { label: 'Same classification', kind: 'decision' },
            { label: 'Location folder', sub: 'classified “Supplier”' },
            { label: 'Template offered there', kind: 'end' },
          ],
        },
        caption: 'The classification is the handshake between template and location.',
      },
      { h: 'One tree for all templates' },
      'The Content Server Document Templates settings (Administration ▸ Document Templates Administration ▸ Configure Content Server Document Templates) name **one** classification tree for templates. Every workspace template classification must therefore live in that tree — typically one classification per workspace type, sometimes a small sub-tree per family. Plan the tree with the whole organisation in mind; it outlives every project.',
      {
        figure: {
          type: 'tree',
          root: {
            label: 'Template Types', icon: 'classification', note: 'the template tree', children: [
              { label: 'Supplier', icon: 'classification' },
              { label: 'Customer', icon: 'classification' },
              { label: 'Project', icon: 'classification', children: [
                { label: 'Internal Project', icon: 'classification' },
              ] },
            ],
          },
        },
        caption: 'One tree, one classification per kind of workspace.',
      },
      { h: 'Creating a classification' },
      'Creating the **tree** needs the Classification Tree object privilege — often only a system administrator has it. Creating **classifications** inside it needs the Classification object privilege, which business administrators typically get. Two settings appear on the Add Classification page:',
      {
        ul: [
          '**Management Type** — Manual (default: only people assign it), Assisted (the system suggests it for items that match the classification profile; suggestions wait on Manage Pending Objects; not supported for RM classifications) or Automatic (the system assigns it). Template classifications stay **Manual**.',
          '**Selectable** — whether users may assign the node. Grouping nodes are often not selectable; template classifications must be **selectable**.',
        ],
      },
      {
        steps: [
          'Open Enterprise ▸ Classifications (or Enterprise ▸ Business Workspaces ▸ Classifications).',
          'Open the template tree; Add Item ▸ Classification.',
          'Name it after the workspace type; keep Manual and Selectable; Add.',
        ],
        title: 'Create a workspace classification',
        ui: 'Classic UI',
      },
      { h: 'Keep inheritance deliberate' },
      'Only the containers in which users create workspaces need the template classification — the root folder and any sub-folders used for manual creation. If the classification is inherited down onto every document inside workspaces, the server stores thousands of classification records that mean nothing to users and clutter searches. Classify containers on purpose, and check how your templates pass classifications on to their content.',
      { callout: 'note', text: ['The workspace type has an optional extra **Classification** setting on its Advanced tab. It is stamped on every workspace created from the type and is **unrelated** to the template–location match.'] },
      { callout: 'exam', text: ['Location and template must share the **same** classification; all template classifications sit in **one tree** set in the Document Templates administration; defaults are **Manual** and **Selectable**.'] },
      'Deeper: [[bw-classifications]].',
    ],
    keyPoints: [
      'A classification links a template to the folders where it can be used.',
      'All template classifications belong to one tree, named in the Document Templates settings.',
      'Usually one classification per workspace type.',
      'Keep template classifications Manual and Selectable.',
      'Trees need the Classification Tree privilege; classifications need the Classification privilege.',
    ],
    missions: [
      {
        id: 'bw06-tree', type: 'investigate', title: 'Find your template classification tree', xp: 20,
        brief: 'Before adding a classification, find the tree your server uses for templates.',
        steps: [
          'If you can, open Administration ▸ Document Templates Administration ▸ Configure Content Server Document Templates and note the classification tree it names. Otherwise open the Classifications volume and pick the tree used for workspace templates (in the earlier lab you created “Training Workspaces”).',
          'Type the name of that tree below.',
        ],
        hints: ['The check looks at the trees at the top of the Classifications volume.'],
        inputs: [{ key: 'tree', label: 'Name of the template classification tree', placeholder: 'e.g. Template Types' }],
        checks: [{ kind: 'answer', input: 'tree', source: 'classificationTrees', compare: 'contains', label: 'That classification tree exists at the top of the Classifications volume' }],
      },
      {
        id: 'bw06-classify', type: 'practice', title: 'Create the “Training Supplier” classification', xp: 20, requires: ['bw06-tree'],
        brief: 'Your supplier templates and the supplier folder will share this classification.',
        steps: [
          'Open the template classification tree.',
          'Add Item ▸ Classification “Training Supplier”, Management Type Manual, Selectable enabled.',
          'Open the Add Classification Tree page (do not save) and note which defaults it suggests.',
        ],
        reflection: 'Explain in your own words what Manual, Assisted and Automatic management would do with your Training Supplier classification, and why only Manual and Selectable make sense for template matching.',
        minWords: 35,
      },
      {
        id: 'bw06-quiz', type: 'quiz', title: 'Knowledge check: classifications', xp: 25,
        questions: [
          { q: 'What must a location folder and a workspace template have in common for the template to be offered there?', options: ['The same classification', 'The same owner', 'The same category version', 'The same facet tree'], answer: 0, explain: 'Classification matching decides which templates are offered in a folder.' },
          { q: 'Why must all workspace template classifications be in one classification tree?', options: ['The Document Templates settings point at a single tree', 'Classification trees cannot have more than one level', 'Each workspace type can only see one tree in its Advanced tab', 'Facets read only one tree'], answer: 0, explain: 'Configure Content Server Document Templates names one tree that holds all template types.' },
          { q: 'Which management type puts suggested classifications on the Manage Pending Objects page?', options: ['Assisted', 'Manual', 'Automatic', 'Selectable'], answer: 0, explain: 'Assisted suggests; an authorised person accepts or rejects on Manage Pending Objects.' },
          { q: 'A business administrator can create classifications but not a new classification tree. Which privilege is missing?', options: ['Classification Tree object privilege', 'Category object privilege', 'BA Facets and Columns usage privilege', 'Activity Manager object privilege'], answer: 0, explain: 'Trees and classifications are separate object privileges.' },
          { q: 'What does clearing Selectable on a classification do?', options: ['Users can no longer assign that node to items', 'It hides the classification from administrators', 'It deletes the node’s children', 'It turns on automatic assignment'], answer: 0, explain: 'Selectable controls whether the node can be assigned; grouping nodes are often not selectable.' },
          { q: 'The workspace type’s Advanced tab has a Classification setting. What is it for?', options: ['An extra classification added to every workspace created from the type', 'Matching templates to the location folder', 'Choosing the template classification tree', 'Restricting who may create workspaces'], answer: 0, explain: 'It stamps an additional classification on new workspaces; template–location matching is separate.' },
        ],
      },
    ],
  },
  // ------------------------------------------------------------------ BW07
  {
    id: 'bw07', track: 'workspaces', order: 7, title: 'Activity feeds', source: `${SRC}7`, feature: 'businessWorkspaces',
    domains: ['ws-types', 'ba-modules'],
    summary: 'Enable Pulse for business workspaces and report attribute changes in the activity feed with activity managers and rules.',
    lesson: [
      'A workspace’s activity feed tells its team what changed without anyone having to look: a new contract version, a comment, or — with a little configuration — “Buyer changed from A. Lee to M. Rossi”. In Smart View it appears in the **Activity Feed** widget and in the **header** of the workspace.',
      { h: 'Two layers of activity' },
      {
        figure: {
          type: 'compare',
          items: [
            { title: 'Content and status', tone: 'info', points: ['Documents, versions, comments, status', 'For the workspace and its sub-items', 'On once Pulse is enabled for the Business Workspace type'] },
            { title: 'Attribute changes', tone: 'accent', points: ['Category values added, changed, removed', 'Needs an activity manager per attribute', 'Rules decide when and what to report'] },
          ],
        },
      },
      'Both depend on **Content Server Pulse** being enabled for business workspaces. That is a system administrator task on the administration pages: Pulse Administration ▸ **Collaboration Administration**, add the **Business Workspace** object type and select its collaboration features.',
      { path: ['Admin', 'Content Server Administration', 'Pulse Administration', 'Collaboration Administration'], ui: 'Classic UI' },
      { h: 'Activity managers' },
      'To report attribute changes, a business administrator creates an **activity manager** in the Facets volume (Add Item ▸ Activity Manager), names it and picks its **data source** — one category attribute. Each data source can have only **one** activity manager. The Text: Reference attribute is not offered: generated numbers do not “change”. You need the BA Facets and Columns usage privilege and the Activity Manager object privilege.',
      { h: 'Rules' },
      'On the manager’s Properties ▸ **Specific** tab you add rules with the green “Add a new rule before this one” button. A rule has a **name**, a **criteria** (offered according to the attribute type — Value Changed, New Value Added, Value Removed, Value Increased/Decreased for numbers and dates, Value Enabled/Disabled for check boxes), an **activity string** with placeholders **[ObjName] [AttrName] [OldVal] [NewVal]**, and the **object types** to monitor.',
      {
        figure: {
          type: 'flow',
          steps: [
            { label: 'Attribute modified', kind: 'start' },
            { label: 'Manager for it?', kind: 'decision' },
            { label: 'Rules in listed order', kind: 'system' },
            { label: 'Match → message', kind: 'system' },
            { label: 'Activity feed', kind: 'end' },
          ],
        },
        caption: 'The rules engine evaluates a manager’s rules in the order they are listed.',
      },
      {
        steps: [
          'Facets volume ▸ your folder ▸ Add Item ▸ Activity Manager “Buyer Activity”, data source Category: Training Supplier:Buyer.',
          'Its Functions ▸ Properties ▸ Specific ▸ Add a new rule before this one.',
          'Rule name “Buyer Changed”, criteria Value Changed; keep the generated activity string; Submit.',
          'Add a second rule “Buyer Added” (Value Added) with the add button on the empty line, so it is listed after the first.',
        ],
        title: 'Report changes of the Buyer attribute',
        ui: 'Classic UI',
      },
      { callout: 'exam', text: ['Pulse must be enabled for the header and Activity Feed widget; **one activity manager per data source**; rules evaluated **in listed order**; criteria depend on the **attribute type**.'] },
      'Deeper: [[bw-activity-feeds]].',
    ],
    keyPoints: [
      'Pulse (Collaboration Administration, object type Business Workspace) powers workspace activity feeds.',
      'Content and status activity comes with Pulse; attribute changes need activity managers.',
      'One activity manager per data source, created in the Facets volume.',
      'Rules have a name, criteria by attribute type, an activity string with placeholders and object types.',
      'Rules are evaluated in the order they are listed.',
    ],
    missions: [
      {
        id: 'bw07-admin', type: 'investigate', title: 'Can you enable Pulse yourself?', xp: 15,
        brief: 'Enabling activity monitoring happens on the administration pages, which need system administration rights.',
        steps: [
          'Check whether your account has system administration rights (for example: can you open Content Server Administration and its Pulse Administration section?).',
          'Answer yes or no below.',
        ],
        inputs: [{ key: 'sysadmin', label: 'Do you have system administration rights? (yes/no)', placeholder: 'yes or no' }],
        checks: [{ kind: 'answer', input: 'sysadmin', source: 'user.isSysAdmin', compare: 'yesno', label: 'Your system administration rights, as Content Server reports them' }],
      },
      {
        id: 'bw07-pulse', type: 'practice', title: 'Enable activity monitoring for business workspaces', xp: 15, requires: ['bw07-admin'],
        brief: 'Without Pulse for the Business Workspace object type, feeds stay empty.',
        steps: [
          'As a system administrator (or together with one): Content Server Administration ▸ Pulse Administration ▸ Collaboration Administration.',
          'Select Object Types to Manage ▸ Business Workspace ▸ Add Object Type; select the collaboration features; Save Changes.',
          'If you have no rights, find out from your administrator whether it is already enabled.',
        ],
        reflection: 'Was Pulse already enabled for business workspaces on your server? Which collaboration features are selected for the Business Workspace object type, and what would users miss if it were off?',
        minWords: 25,
      },
      {
        id: 'bw07-rules', type: 'practice', title: 'Create activity managers and rules', xp: 20, requires: ['bw04-category'],
        brief: 'Make changes to supplier data visible to the team.',
        steps: [
          'In the Facets volume, create activity managers for Supplier Name, Commodity, Buyer and Contract End of the Training Supplier category.',
          'Add rules: Supplier Name Changed (Value Changed), Commodity Changed (Value Changed), Buyer Added (Value Added), Buyer Changed (Value Changed), Contract End Added (New Value Added), Contract End Changed (Value Changed).',
          'Note which criteria each attribute type offered and whether Supplier ID was available as a data source.',
        ],
        reflection: 'Which rule criteria were offered for the popup, user and date attributes? Why was Supplier ID not offered? Write the activity string you would use for “Buyer Changed” in your organisation’s tone.',
        minWords: 35,
      },
      {
        id: 'bw07-quiz', type: 'quiz', title: 'Knowledge check: activity feeds', xp: 25,
        questions: [
          { q: 'What must be enabled before a business workspace header shows an activity feed?', options: ['Pulse for the Business Workspace object type', 'Indexing of child items', 'The Content Filter sidebar', 'Records Management on the workspace type'], answer: 0, explain: 'Pulse, enabled in Collaboration Administration for Business Workspace, drives the header and Activity Feed widget.' },
          { q: 'How many activity managers can watch the same attribute?', options: ['One', 'One per workspace type', 'One per rule', 'Unlimited'], answer: 0, explain: 'Each data source can have only one activity manager; put all rules for it in that manager.' },
          { q: 'Where are activity managers created?', options: ['In the Facets volume', 'In the Categories volume', 'On the workspace type’s Advanced tab', 'In Perspective Manager'], answer: 0, explain: 'Activity managers are Facets volume items, like columns and facets.' },
          { q: 'Which placeholder inserts the value an attribute had before the change?', options: ['[OldVal]', '[NewVal]', '[AttrName]', '[ObjName]'], answer: 0, explain: '[OldVal] is the previous value, [NewVal] the new one.' },
          { q: 'An activity manager has three rules. In what order are they evaluated?', options: ['In the order they are listed', 'Alphabetically by rule name', 'Newest first', 'Randomly'], answer: 0, explain: 'The rules engine works through the rules in their listed (priority) order.' },
          { q: 'Which attribute cannot be selected as the data source of an activity manager?', options: ['A Text: Reference attribute', 'A Text: Popup attribute', 'A User: Field attribute', 'A Date: Field attribute'], answer: 0, explain: 'Generated reference numbers are not offered as activity manager data sources.' },
          { q: 'Which privileges does a business administrator need to create an activity manager?', options: ['BA Facets and Columns usage privilege and the Activity Manager object privilege', 'BA Data Policies usage privilege only', 'The Classification Tree object privilege', 'System administration rights only'], answer: 0, explain: 'Activity managers live in the Facets volume and need their own object privilege.' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ BW08
  {
    id: 'bw08', track: 'workspaces', order: 8, title: 'The location (root) folder', source: `${SRC}8`, feature: 'businessWorkspaces',
    domains: ['ws-infra', 'ba-bw-infra'],
    summary: 'Prepare the folder workspaces of a type are stored in: classify it, secure it, and plan sub-folders by attribute.',
    lesson: [
      'Workspaces of a type need a home: a **location (root) folder** such as Purchasing ▸ Suppliers. It is a normal folder, made into a workspace location by two things: it carries the **same classification as the template**, and the **workspace type** names it in its creation settings. You can classify several folders for the same template if workspaces of one type must live in different places.',
      {
        figure: {
          type: 'tree',
          root: {
            label: 'Training Customers', icon: 'folder', note: 'your lab location · classified', children: [
              { label: 'EMEA', icon: 'folder', note: 'sub-location from Region', children: [
                { label: '10023 – ACME Corp', icon: 'workspace' },
              ] },
              { label: 'Americas', icon: 'folder', children: [
                { label: '20877 – Cobalt Inc', icon: 'workspace' },
              ] },
            ],
          },
        },
        caption: 'A root folder with attribute-based sub-folders.',
      },
      { h: 'Which folder is used?' },
      'The workspace type’s **Location** setting decides where a new workspace lands. **Current Location**, the default, simply uses the folder in which the user starts creating. **Content Server Folder** names one fixed root folder. **From Category Attribute** reads a category attribute whose value identifies the target folder, and **From Business Property** (Extended ECM only) does the same with a property of the business object. The fixed or derived location matters most for workspaces created without a person choosing a folder — by a business application, a workflow, a bulk load or a REST call.',
      {
        table: {
          head: ['Location option', 'Workspace lands in', 'Sub-location path'],
          rows: [
            ['Current Location (default)', 'The folder where creation starts', 'No'],
            ['Content Server Folder', 'One fixed folder', 'Yes'],
            ['From Category Attribute', 'The folder an attribute value points to', 'Yes'],
            ['From Business Property', 'A folder from a business object property (Extended ECM)', 'Yes'],
          ],
        },
      },
      'With **Use also for manual creation** ticked, the configured location wins even when a user starts creating in another folder: the workspace is created in the configured place, the Classic View then opens it and Smart View shows a confirmation message.',
      { h: 'Sub-location paths' },
      'Thousands of workspaces in one flat folder are hard to browse. The workspace type can add a **Sub Location Path**: a fixed sub-folder, or **From Pattern** — text and inserted category attributes such as Region, producing sub-folders like EMEA and Americas. The attribute must never be empty, so make it required: if **all** sub-location attributes are empty, the workspace is created in the root. And if the attribute changes later, the workspace is **not moved**.',
      {
        figure: {
          type: 'flow',
          steps: [
            { label: 'Location option', sub: 'folder · current · attribute', kind: 'decision' },
            { label: 'Root folder' },
            { label: 'Pattern value?', kind: 'decision' },
            { label: 'Sub-folder', kind: 'system' },
            { label: 'Workspace', kind: 'end' },
          ],
        },
        caption: 'Location first, then the optional sub-location.',
      },
      {
        steps: [
          'Create the root folder and set its permissions (generated sub-folders inherit them).',
          'Functions ▸ Properties ▸ Classifications ▸ Classify ▸ Browse Classifications.',
          'Open the template tree, tick the workspace classification, Submit.',
          'Later, in the workspace type, choose Content Server Folder and select this folder.',
        ],
        title: 'Prepare a location folder',
        ui: 'Classic UI',
      },
      { callout: 'remember', text: ['Only templates with the **same classification** as the folder can be used to create workspaces in it.'] },
      { callout: 'exam', text: ['Location and template share the classification; sub-location paths can be fixed or attribute-based; empty attributes → root; changed attributes → no automatic move.'] },
      'Deeper: [[bw-location-folder]].',
    ],
    keyPoints: [
      'The root folder is an ordinary folder that carries the template’s classification.',
      'Generated sub-folders inherit the root folder’s permissions.',
      'Sub-location paths can be fixed or built from attribute patterns.',
      'Empty sub-location attributes leave the workspace in the root; changed attributes do not move it.',
    ],
    missions: [
      {
        id: 'bw08-regions', type: 'hands-on', title: 'Prepare regional sub-folders in your location', xp: 30, requires: ['ws02-location'],
        brief: 'Sub-location paths need folders whose names match the attribute values. Create two of them in your lab location.',
        steps: [
          'Open your sandbox ▸ “Training Customers” (the location from the building-blocks lab).',
          'Create a folder named exactly “EMEA” and another named exactly “Americas” — matching values of the Region attribute.',
          'Do not switch on a sub-location path on your lab workspace type yet — the creation lab expects the workspace directly in “Training Customers”.',
        ],
        checks: [
          { kind: 'child', parent: 'wsLocation', name: 'EMEA', types: [0], saveAs: 'bwEmea', label: 'Folder “EMEA” in “Training Customers”' },
          { kind: 'child', parent: 'wsLocation', name: 'Americas', types: [0], saveAs: 'bwAmericas', label: 'Folder “Americas” in “Training Customers”' },
        ],
        open: 'wsLocation',
      },
      {
        id: 'bw08-classify', type: 'practice', title: 'Classify your supplier location', xp: 15, requires: ['bw06-classify'],
        brief: 'Turn a plain folder into a workspace location.',
        steps: [
          'Open the “Training Suppliers” folder in your sandbox (create it if you skipped that mission).',
          'Functions ▸ Properties ▸ Classifications ▸ Classify ▸ Browse Classifications ▸ your template tree ▸ Training Supplier ▸ Submit.',
          'Check the folder’s permissions and note who can add items there.',
        ],
        reflection: 'What does the classification on this folder enable, and what would happen if a colleague created another folder with the same classification elsewhere? Who can add items in your folder, and is that what workspace creators need?',
        minWords: 30,
      },
      {
        id: 'bw08-quiz', type: 'quiz', title: 'Knowledge check: the location folder', xp: 25,
        questions: [
          { q: 'What must the location folder and the workspace template have in common?', options: ['The same classification', 'The same category', 'The same owner group', 'The same name'], answer: 0, explain: 'Matching classifications let the template be used in that folder.' },
          { q: 'The sub-location path is built from Region, but a workspace is created with Region empty. Where does it go?', options: ['Into the location (root) folder itself', 'Into a folder named “Empty”', 'Creation always fails', 'Into the creator’s Personal Workspace'], answer: 0, explain: 'If all sub-location attributes are empty, the workspace is created in the root folder.' },
          { q: 'A supplier’s Commodity, which drives the sub-folder, changes from Hardware to Services. What happens to the workspace?', options: ['It stays where it is until someone moves it', 'It moves automatically to Services', 'It is copied to Services', 'It is deleted and recreated'], answer: 0, explain: 'Workspaces are not moved automatically when a location attribute changes.' },
          { q: 'Where do generated sub-folders get their permissions from?', options: ['They inherit from the location folder', 'From the workspace type', 'From the template roles', 'From the classification'], answer: 0, explain: 'Like any new item, sub-folders inherit their parent’s permissions.' },
          { q: 'How do you assign the template classification to a folder in the Classic View?', options: ['Functions ▸ Properties ▸ Classifications ▸ Classify ▸ Browse Classifications', 'Functions ▸ Properties ▸ Categories', 'Add Item ▸ Classification inside the folder', 'Functions ▸ Permissions'], answer: 0, explain: 'Classifications are assigned on the item’s Classifications properties page.' },
          { q: 'Why should the attribute used in a sub-location pattern be required and a popup?', options: ['To avoid empty values and near-duplicate folder names', 'Because patterns only accept popups', 'To make the attribute searchable', 'Because required attributes are indexed faster'], answer: 0, explain: 'Free or empty values produce “Logistics”/“logistics ” folders or workspaces piling up in the root.' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ BW09
  {
    id: 'bw09', track: 'workspaces', order: 9, title: 'Configuring workspace types', source: `${SRC}9`, feature: 'businessWorkspaces',
    domains: ['ws-types', 'ba-ws-types'],
    summary: 'Create a workspace type with its names, name pattern, icons, creation settings, search and indexing options and Classic View sidebar widgets — and switch creation on and off.',
    lesson: [
      'The workspace type is the framework every workspace of a kind is created in. It decides the workspace **name** (from a pattern), the **location**, the **icons**, whether workspaces may be **copied**, how searches and the **index** treat workspace data, and the Classic View **sidebar widgets**. It also links to Perspective Manager for the Smart View layout. Types live in Enterprise ▸ Business Workspaces ▸ Workspace Types and need the **BA Business Workspaces** usage privilege.',
      {
        figure: {
          type: 'layers',
          layers: [
            { label: 'General', items: ['Name & type names', 'Name pattern', 'Generate names…', 'Icons', 'Copying', 'Location & sub-path', 'Fast bulk'], note: 'basic configuration' },
            { label: 'Advanced', items: ['Search', 'Indexing', 'Sidebar widgets', 'Classification', 'RM', 'Roles'], note: 'optional + Classic View' },
          ],
        },
        caption: 'The two tabs of a workspace type.',
      },
      { h: 'Names' },
      'The **Name** is internal. **Workspace Type Names** are the per-language display names users may see in the header. **Business Workspace Names** hold the name pattern: fixed text plus attributes added with **Insert Attribute**, shown as placeholders of the form [category ID:attribute]. Use dashes, slashes or parentheses as separators — never a colon. In a Content Server–only setup, tick **Generate names also for workspaces without business object**, or the pattern is not applied.',
      { h: 'Creation settings' },
      'The **Location** is Current Location (default), a fixed Content Server Folder, From Category Attribute or (Extended ECM) From Business Property, optionally with a **Sub Location Path**. **Use also for manual creation** forces that location even when users start elsewhere. **Fast bulk** creation is quick but has restrictions, and one failure cancels its whole batch.',
      { h: 'Advanced tab' },
      'Search Settings decide whether a search from a workspace includes related workspaces (Disabled by default, optional, or always). Indexing Settings add workspace attributes to the index entries of items inside it — existing items then need re-indexing. Side Bar Widgets configure the Classic View sidebar; their Detailed Configuration is available after the first save. Further options add a classification to every new workspace, enable Records Management (immediately) and put the creator in the Team Lead role.',
      {
        steps: [
          'Workspace Types ▸ Add Item ▸ Workspace Type. Name: “Training Supplier”; type name (en): “Training Supplier”.',
          'Business Workspace Names: Insert Attribute Supplier ID, type “ / ”, Insert Attribute Supplier Name. Tick Generate names also for workspaces without business object.',
          'Location: Content Server Folder ▸ “Training Suppliers”; optionally Sub Location Path ▸ From Pattern ▸ Commodity; Use also for manual creation. Apply.',
          'Advanced: Search Settings, Side Bar Widgets (Attributes, Recent Changes, Work Items). Save Changes.',
          'Reopen ▸ Advanced ▸ Detailed Configuration for each widget. Save.',
        ],
        title: 'Create a workspace type',
        ui: 'Classic UI',
      },
      {
        figure: {
          type: 'cycle',
          steps: [
            { label: 'Enabled', sub: 'default; in use' },
            { label: 'Disable Creation', sub: 'Functions menu' },
            { label: 'Disabled', sub: 'no new workspaces' },
            { label: 'Enable Creation' },
          ],
          center: 'Creation Status',
        },
        caption: 'Creation can be switched off without touching existing workspaces.',
      },
      { callout: 'exam', text: ['Remember: **Generate names also for workspaces without business object** for Content Server–only workspaces; no **colon** in name patterns; **Current Location** is the default; Detailed Configuration of sidebar widgets only after **saving**; Indexing Status **Re-indexing required / Up to date**.'] },
      'Every setting in one table: [[bw-workspace-type-settings]]. Sidebar widget parameters: [[bw-sidebar]]. Checklist: [[bw-type-checklist]].',
    ],
    keyPoints: [
      'The type decides name, location, icons, copying, search, indexing and Classic View sidebar widgets.',
      'Name patterns use inserted attributes; colons cannot separate them.',
      'Generate names also for workspaces without business object must be on without an integration.',
      'Location options: Current Location (default), Content Server Folder, From Category Attribute, From Business Property.',
      'Creation can be disabled and enabled per type; indexing changes need re-indexing.',
    ],
    missions: [
      {
        id: 'bw09-type', type: 'practice', title: 'Create the “Training Supplier” workspace type', xp: 25, requires: ['bw04-category', 'bw08-classify'],
        brief: 'Put the building blocks together in a workspace type.',
        steps: [
          'Create the type “Training Supplier” with an English type name.',
          'Name pattern: Supplier ID / Supplier Name; tick Generate names also for workspaces without business object.',
          'Location: Content Server Folder “Training Suppliers”, Sub Location Path From Pattern on Commodity, Use also for manual creation.',
          'Advanced: Search Settings Always enabled; Side Bar Widgets Attributes, Recent Changes, Work Items. Save.',
        ],
        reflection: 'Write down your name pattern exactly as the editor shows it, explain what each bracketed part refers to, and say what a workspace would be called if Generate names also for workspaces without business object were off.',
        minWords: 35,
      },
      {
        id: 'bw09-widgets', type: 'practice', title: 'Configure the sidebar widgets', xp: 20, requires: ['bw09-type'],
        brief: 'Give Classic View users the supplier data and recent changes at a glance.',
        steps: [
          'Reopen the type ▸ Advanced ▸ Attributes ▸ Detailed Configuration: Supplier ID, Supplier Name, Commodity, Buyer, Contract End in that order.',
          'Recent Changes: Date to Use Modify Date, Items to Display 20.',
          'Work Items: Show Ahead 14. Save the type.',
        ],
        reflection: 'Why could you not open Detailed Configuration before the first save? Describe what each of your three widgets will show a buyer opening a supplier workspace in the Classic View.',
        minWords: 30,
      },
      {
        id: 'bw09-count', type: 'investigate', title: 'Count the workspace types now', xp: 20, requires: ['bw09-type'],
        steps: ['Open Enterprise ▸ Business Workspaces ▸ Workspace Types.', 'Count all types, including Training Supplier, and type the number.'],
        inputs: [{ key: 'types', label: 'Number of workspace types', placeholder: 'e.g. 6' }],
        checks: [{ kind: 'answer', input: 'types', source: 'bwTypes.count', compare: 'number', label: 'Number of business workspace types' }],
      },
      {
        id: 'bw09-creation', type: 'practice', title: 'Disable and re-enable creation', xp: 15, requires: ['bw09-type'],
        brief: 'Learn the safe switch for freezing a type.',
        steps: [
          'On the Workspace Types page, use the Training Supplier Functions menu ▸ Disable Creation and look at Creation Status.',
          'Look at the Indexing Status column for your type.',
          'Enable Creation again.',
        ],
        reflection: 'When would you disable creation of a workspace type in real life, and what happens to existing workspaces? What did the Indexing Status show for your new type, and why?',
        minWords: 25,
      },
      {
        id: 'bw09-quiz', type: 'quiz', title: 'Knowledge check: workspace types', xp: 25,
        questions: [
          { q: 'Workspaces are created in Content Server only, and they keep getting the name the user typed instead of the pattern. Which setting is missing?', options: ['Generate names also for workspaces without business object', 'Use also for manual creation', 'Workspace Copying', 'Always enabled search'], answer: 0, explain: 'Without a business object, the pattern is only applied when that option is selected.' },
          { q: 'Which character cannot be used to separate attributes in a name pattern?', options: ['A colon', 'A dash', 'A forward slash', 'Parentheses'], answer: 0, explain: 'The colon is part of Content Server’s placeholder syntax.' },
          { q: 'What is the default Location option of a new workspace type?', options: ['Current Location', 'Content Server Folder', 'From Category Attribute', 'From Business Property'], answer: 0, explain: 'By default workspaces are created where the user starts creation.' },
          { q: 'Why is the Detailed Configuration link of a sidebar widget not working on a brand-new type?', options: ['The type has not been saved yet', 'The widget needs Pulse', 'Sidebar widgets are Smart View only', 'Only system administrators can use it'], answer: 0, explain: 'Save the type once, then configure each widget.' },
          { q: 'After changing a type’s Indexing Settings, the Indexing Status shows “Re-indexing required”. What does that mean?', options: ['Existing items must be re-indexed to get the new metadata', 'The search engine is broken', 'The type is disabled', 'The template is missing'], answer: 0, explain: 'Indexing changes affect items added afterwards; existing ones need re-indexing, which can be scheduled from the type’s Functions menu.' },
          { q: 'What happens to existing workspaces when you choose Disable Creation on their type?', options: ['Nothing — only new workspaces of the type can no longer be created', 'They become read-only', 'They are moved to the Recycle Bin', 'They lose their category'], answer: 0, explain: 'Creation status only controls new workspaces.' },
          { q: 'Which widget icon format and size does the course recommend for the Smart View?', options: ['A png, gif or jpeg of about 128×128 pixels, under 1 MB', 'An SVG of any size', 'A 16×16 ICO file', 'A 1024×1024 TIFF'], answer: 0, explain: 'Bitmap formats around 128×128 px and no more than 1 MB; a default icon is used otherwise.' },
        ],
      },
    ],
  },
];
