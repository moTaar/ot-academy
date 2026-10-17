'use strict';
// Extended ECM (Content Server) Cloud Practitioner — general cloud-delivery
// practice. OpenText's "Practitioner Access to the Cloud: General Guidelines"
// is provided only inside the OpenText Learning Platform course; these guides
// do NOT reproduce or paraphrase it. They describe widely accepted practice for
// working in managed (vendor-operated) Content Server environments.

const NOTE = 'General managed-cloud delivery practice (this trainer). The official OpenText policy is provided in the OpenText Learning Platform course and governs.';

const POLICY = { callout: 'warn', title: 'The official policy governs', text: 'OpenText provides its practitioner guidelines for OpenText Cloud only inside the Cloud Practitioner course on the OpenText Learning Platform. This guide explains general, widely accepted practice so that the policy makes sense when you read it — it is **not** a summary of that policy. Where your project, contract or the official guidelines say something different, they win.' };

module.exports = [
  {
    id: 'cp-operating-model',
    title: 'The managed cloud operating model and who is responsible for what',
    area: 'cloud',
    summary: 'How a managed OpenText Cloud deployment of Extended ECM differs from on-premises work, the shared responsibility between provider, customer and partner, and which work goes through cloud operations requests.',
    level: 'basic',
    minutes: 10,
    domains: ['cp-model'],
    modules: ['cp01'],
    tags: ['cloud', 'managed services', 'shared responsibility', 'service request', 'operations'],
    related: ['cp-environments-change', 'cp-security-data', 'cp-prepare'],
    sources: [NOTE],
    body: [
      POLICY,
      'In an on-premises installation, the customer’s own IT (often with a partner) installs, patches, backs up and administers everything — servers, database, storage, Content Server and its modules. In a **managed cloud** service, the provider runs the platform as a service: it owns the infrastructure, operates the application stack and is accountable for availability, security of the platform, backups and upgrades under a contract. Practitioners — customer administrators and partner consultants — work **inside the application** through approved interfaces and ask the provider for anything below that line.',
      { h: 'Shared responsibility' },
      { figure: { type: 'layers', layers: [
        { label: 'Business use', items: ['Content, metadata, users’ work', 'Business decisions on retention'], note: 'customer' },
        { label: 'Application configuration', items: ['Workspace types, templates, perspectives', 'Categories, facets, search forms', 'Roles and permissions'], note: 'customer / partner, within agreed scope' },
        { label: 'Application operations', items: ['Installing modules and patches', 'Upgrades, server settings, logs', 'Search infrastructure'], note: 'cloud provider (on request where needed)' },
        { label: 'Platform', items: ['Servers, network, database, storage', 'Backups, monitoring, security controls'], note: 'cloud provider' },
      ] }, caption: 'A typical split. The contract and the provider’s guidelines define the exact line.' },
      { table: { head: ['Typical task', 'Usually done by', 'How'], rows: [
        ['Create a workspace type or perspective', 'Customer/partner business administrator', 'In the application, in the agreed environment'],
        ['Move configuration from test to production', 'Customer/partner with provider involvement as agreed', 'Transport packages through the change process'],
        ['Install a new module or patch', 'Cloud provider', 'Service request; scheduled change'],
        ['Change a server-level setting, read server logs', 'Cloud provider', 'Service request'],
        ['Restore deleted content from backup', 'Cloud provider', 'Service request (Recycle Bin first, if enabled)'],
        ['Add users / assign roles', 'Customer administrators', 'Through the identity process (often OTDS / corporate directory)'],
        ['Deploy custom code', 'Usually restricted', 'Only through the provider’s approved process, if allowed at all'],
      ] } },
      { h: 'Why the boundaries exist' },
      { ul: [
        '**Accountability** — the provider guarantees availability and security; it can only do that if it controls changes to the platform.',
        '**Consistency** — many customers run on standardised builds; unmanaged changes break upgrades and support.',
        '**Auditability** — every change below the application line is traceable to a request and an approval.',
        '**Security** — fewer people with infrastructure access means a smaller attack surface.',
      ] },
      { h: 'Working through requests' },
      { figure: { type: 'flow', steps: [
        { label: 'Need identified', kind: 'start' },
        { label: 'In my scope?', sub: 'application configuration', kind: 'decision' },
        { label: 'Do it in DEV/TEST', sub: 'then promote' },
        { label: 'Otherwise: service request', sub: 'to cloud operations', kind: 'actor' },
        { label: 'Provider schedules & executes', kind: 'system' },
        { label: 'Verify & close', kind: 'end' },
      ] } },
      { callout: 'exam', title: 'What the test checks (general practice)', text: 'Recognise which work belongs to the provider (infrastructure, servers, patches, backups, logs at server level) and which belongs to the practitioner (configuration in the application), and choose the formal request path instead of a workaround.' },
    ],
  },

  {
    id: 'cp-environments-change',
    title: 'Environments, promotion and change management in the cloud',
    area: 'cloud',
    summary: 'Development, test and production environments, promoting configuration with Transport and Business Scenarios, configuration over customization, and planning, testing and documenting changes.',
    level: 'intermediate',
    minutes: 11,
    domains: ['cp-change', 'cp-model'],
    modules: ['cp01'],
    tags: ['environments', 'promotion', 'transport', 'business scenarios', 'change management', 'configuration over customization'],
    related: ['cp-operating-model', 'cp-security-data', 'ba-transport-deploy', 'ba-business-scenarios'],
    sources: [NOTE, 'OpenText Content Server online help — Transport'],
    body: [
      POLICY,
      'Managed cloud subscriptions usually include more than one environment. Configuration is built and tried in a non-production environment and then **promoted** — never typed again by hand in production.',
      { h: 'Environments' },
      { table: { head: ['Environment', 'Purpose', 'Data'], rows: [
        ['Development (DEV)', 'Build and experiment with configuration', 'Synthetic or minimal test data'],
        ['Test / QA / UAT', 'Integration and user acceptance testing of exactly what will go live', 'Representative, approved test data'],
        ['Production (PROD)', 'Business use', 'Real customer data — strictest controls'],
      ] } },
      { figure: { type: 'flow', steps: [
        { label: 'DEV', sub: 'build', kind: 'system' },
        { label: 'Transport package', sub: 'versioned ZIP' },
        { label: 'TEST', sub: 'deploy & accept', kind: 'system' },
        { label: 'Change approval', kind: 'decision' },
        { label: 'PROD', sub: 'deploy same package', kind: 'end' },
      ], loop: 'Defect found → fix in DEV, new package' }, caption: 'Promote the same tested package; fix issues at the source, not in production.' },
      { h: 'Moving configuration' },
      { ul: [
        '**Transport** packages the configuration (categories, classifications, workspace types, templates, perspectives, smart document types, search forms, facets…) and deploys it on the next environment — see [[ba-transport-deploy]].',
        '**Business Scenarios** are themselves delivered as transport packages; deploy them first in DEV, adapt, then promote your adaptations — see [[ba-business-scenarios]].',
        'Keep packages **versioned** and stored with the change record, so you can tell exactly what was deployed when.',
      ] },
      { h: 'Configuration over customization' },
      { figure: { type: 'compare', items: [
        { title: 'Configuration', tone: 'pass', points: ['Uses product features: types, templates, perspectives, bots, rules', 'Transportable and supported', 'Survives upgrades', 'Can be done by business administrators'] },
        { title: 'Customization', tone: 'warn', points: ['Custom code, modules, UI extensions, direct database changes', 'Needs development, review and provider approval', 'Can block or delay upgrades', 'Often not allowed in a standard managed cloud'] },
      ] } },
      { h: 'Change management' },
      { steps: [
        'Describe the change: what, why, which objects, which environments.',
        'Assess impact: users affected, dependencies (categories referenced by patterns, perspectives…), rollback plan.',
        'Build and unit-test in DEV; build the transport package.',
        'Deploy to TEST; run acceptance tests with key users; record results.',
        'Get approval for production and agree the time window with the provider and the business.',
        'Deploy the same package to PROD; smoke-test; communicate (system message).',
        'Close the change with evidence; update the configuration register.',
      ], title: 'A change from idea to production' },
      { callout: 'exam', title: 'What the test checks (general practice)', text: 'Expect choices such as: build in a non-production environment, promote with Transport, prefer configuration, test before production, document and approve changes. Any option that edits production directly “because it is faster” is the wrong answer.' },
    ],
  },

  {
    id: 'cp-security-data',
    title: 'Security and data handling for cloud practitioners',
    area: 'cloud',
    summary: 'Least-privilege accounts, approved access paths, protecting credentials, and handling customer data, logs, exports and test data responsibly.',
    level: 'intermediate',
    minutes: 10,
    domains: ['cp-security'],
    modules: ['cp01'],
    tags: ['least privilege', 'credentials', 'data protection', 'test data', 'logs', 'exports', 'access'],
    related: ['cp-operating-model', 'cp-environments-change', 'ba-admin-accounts'],
    sources: [NOTE],
    body: [
      POLICY,
      'A practitioner in a customer’s cloud environment is a guest with powerful tools. Every account you hold, file you download and log you share can expose customer data. These general rules apply in any managed environment.',
      { h: 'Accounts and access' },
      { ul: [
        'Use a **named, personal account** — never shared accounts, never the built-in Admin for daily work.',
        'Hold only the **privileges you need** for the task (business administration usage privileges rather than System Administration rights) and give them back when the task ends.',
        'Use only **approved access paths**: the application UI and APIs, through the provider’s sign-in (SSO/MFA). Do not try to reach servers, databases or storage directly.',
        'Never bypass or weaken security controls to “get things done” — raise a request instead.',
      ] },
      { figure: { type: 'ladder', steps: [
        { label: 'Read-only / user access', sub: 'for analysis' },
        { label: 'Business administration privileges', sub: 'for configuration' },
        { label: 'System administration', sub: 'only if agreed, time-limited' },
        { label: 'Infrastructure access', sub: 'provider only' },
      ] }, caption: 'Climb only as high as the task requires.' },
      { h: 'Credentials' },
      { ul: [
        'Never put passwords, API keys or tokens in emails, chat, tickets, documents, screenshots or source code.',
        'Use the customer’s or provider’s approved secret handling and rotate credentials that may have been exposed — and report it.',
        'Service accounts for integrations belong to the customer and are managed by its process, not by a consultant’s notebook.',
      ] },
      { h: 'Customer data, logs, exports and test data' },
      { table: { head: ['Situation', 'Good practice'], rows: [
        ['You need data to test', 'Use synthetic or approved anonymised test data in DEV/TEST; do not copy production content down without explicit approval'],
        ['You need logs for troubleshooting', 'Request them through the provider; share only the excerpt needed; remove personal data; delete when done'],
        ['A user asks you to export documents', 'Only with authorisation, through approved features, to approved locations; record it'],
        ['Screenshots for documentation', 'Use test data or mask names, numbers and content'],
        ['Data on your laptop', 'Avoid; if unavoidable, encrypted, minimal, and deleted when the task ends'],
      ] } },
      { figure: { type: 'cycle', steps: ['Need justified', 'Minimum data', 'Approved channel', 'Protected while held', 'Deleted when done'], center: 'Data handling' } },
      { callout: 'exam', title: 'What the test checks (general practice)', text: 'Pick the least-privilege, approved-channel, minimum-data option. Typical wrong answers: sharing an admin password with a colleague, copying production data to a personal drive, asking for server access to read a log yourself, testing with real customer records in DEV.' },
    ],
  },

  {
    id: 'cp-prepare',
    title: 'Preparing for the Cloud Practitioner course',
    area: 'cloud',
    summary: 'How the Extended ECM Cloud Practitioner course works, its prerequisites, and how to prepare so that you read the official guidelines well and pass the short test.',
    level: 'basic',
    minutes: 6,
    domains: ['cp-model', 'cp-change', 'cp-security'],
    modules: ['cp01'],
    tags: ['cloud practitioner', 'exam preparation', 'opentext learning platform', 'prerequisites'],
    related: ['cp-operating-model', 'cp-environments-change', 'cp-security-data'],
    sources: [NOTE, 'OpenText Training Registry — Extended ECM (Content Server) Cloud Practitioner'],
    body: [
      POLICY,
      'The Cloud Practitioner credential is not a classic proctored exam. Once you hold the **Business User (5-0158)** and **Business Administrator (5-0159)** certifications and have accepted their digital badges, you are enrolled in a short course on the OpenText Learning Platform: you review OpenText’s guidelines for practitioners working in OpenText Cloud environments, then take a short test that requires **80%** to pass.',
      { figure: { type: 'timeline', items: [
        { when: 'Step 1', label: 'Pass 5-0158', sub: 'Business User' },
        { when: 'Step 2', label: 'Pass 5-0159', sub: 'Business Administrator' },
        { when: 'Step 3', label: 'Accept both badges', sub: 'triggers enrolment' },
        { when: 'Step 4', label: 'Read the guidelines', sub: 'in the Learning Platform' },
        { when: 'Step 5', label: 'Short test', sub: '80% to pass' },
      ] } },
      { h: 'How to prepare' },
      { steps: [
        'Make sure you are comfortable with Transport and Business Scenarios ([[ba-transport-deploy]], [[ba-business-scenarios]]) — moving configuration between environments is the heart of cloud work.',
        'Read the three practice guides in this area: operating model, environments and change, security and data handling.',
        'When the course opens, read the official guidelines carefully and completely; note what is allowed, what requires a request, and what is not allowed.',
        'Answer the test from the **official guidelines**, not from habits on on-premises projects.',
      ], title: 'A short plan' },
      { callout: 'note', text: 'The practice questions in this trainer test general good practice (least privilege, promotion through environments, configuration over customization, data minimisation). They do not quote or predict the official test.' },
      { figure: { type: 'hub', center: 'Cloud practitioner mindset', items: ['Stay inside the application', 'Promote, don’t retype', 'Request, don’t work around', 'Least privilege', 'Minimum data', 'Document every change'] } },
    ],
  },
];
