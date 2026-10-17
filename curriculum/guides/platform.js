'use strict';
// Guides about the certifications themselves and how to prepare for them.
// Format: curriculum/CONTENT.md.

module.exports = [
  {
    id: 'pf-certifications',
    title: 'The OpenText Content Management certifications',
    area: 'platform',
    summary: 'The six certifications for Content Server / Extended ECM, what each one proves, how they depend on each other, and what the exams look like.',
    level: 'basic',
    minutes: 8,
    domains: [],
    tags: ['certification', 'exam', '5-0158', '5-0159', '5-0156', '5-0157', '5-0155', 'cloud practitioner', 'learning path'],
    related: ['pf-study-method'],
    sources: ['OpenText Training Registry and Exam Outlines (October 2026): https://www.opentext.com/learning-services/certification'],
    body: [
      'OpenText certifies people who work with OpenText Content Management — the product long known as **Content Server**, at the heart of OpenText Content Suite and Extended ECM. There is one certification per role: the people who use it, the people who configure it for the business, the people who run it, the people who build on it, and the people who design solutions with it. A short extra course covers working in OpenText Cloud.',
      { h: 'Which certification is for whom' },
      {
        table: {
          head: ['Exam', 'For', 'Proves you can'],
          rows: [
            ['**5-0158** Business User', 'Everyone who works in Content Server', 'Add, organise, version, find, secure and share content; take part in workflows; use reminders, wikis, collections, Intelligent Viewing and perspectives'],
            ['**5-0159** Business Administrator', 'Administrators on the business side', 'Configure business workspaces, smart document types, perspectives, Business Scenarios and transport, facets, columns, search and module settings'],
            ['**5-0156** Administrator', 'System administrators', 'Install and run the platform: admin pages, search, storage, schema and LiveReports, logging and troubleshooting, OTDS, System Center'],
            ['**5-0157** Developer', 'Developers', 'Query the schema, write LiveReports, build OScript modules in CSIDE, use and extend the REST API and Content Web Services'],
            ['**5-0155** Analyst', 'Analysts and solution designers', 'Design document, records, collaboration and business workspace solutions, and design workflows and forms'],
            ['**Cloud Practitioner**', 'Practitioners deploying to OpenText Cloud', 'Work within OpenText\'s guidelines for practitioner access to cloud environments'],
          ],
        },
      },
      { h: 'How they build on each other' },
      'Business User is the foundation: every other exam either requires it or assumes its knowledge. OpenText enforces prerequisite certifications — you cannot book an exam until you hold the certifications it requires.',
      {
        figure: {
          type: 'tree',
          root: {
            label: '5-0158 Business User', icon: 'user', note: 'foundation',
            children: [
              { label: '5-0159 Business Administrator', icon: 'module', children: [
                { label: '5-0156 Administrator', icon: 'server' },
                { label: 'Cloud Practitioner', icon: 'module', note: 'needs 5-0158 and 5-0159' },
              ] },
              { label: '5-0157 Developer', icon: 'module' },
              { label: '5-0155 Analyst', icon: 'module', note: 'check its prerequisites on the Learning Paths page' },
            ],
          },
        },
        caption: 'Prerequisites flow downwards.',
      },
      { h: 'What the exams look like' },
      {
        figure: {
          type: 'matrix',
          cols: ['Questions', 'Time', 'Pass mark', 'Multiple response', 'True/false'],
          rows: [
            { label: '5-0158 Business User', cells: ['40', '60 min', '75%', true, false] },
            { label: '5-0159 Business Administrator', cells: ['45', '60 min', '75%', true, false] },
            { label: '5-0156 Administrator', cells: ['60', '90 min', '70%', false, true] },
            { label: '5-0157 Developer', cells: ['60', '90 min', '70%', true, false] },
            { label: '5-0155 Analyst', cells: ['60', '90 min', '70%', false, true] },
            { label: 'Cloud Practitioner', cells: ['short test', '—', '80%', '', ''] },
          ],
        },
        caption: 'Format as published by OpenText. Every exam is web-based and in English; the full exams cost 500 USD each.',
      },
      'The exam result appears as soon as you submit, as a conditional pass or fail. Passing earns a digital badge (through Credly) that you can show on your profile. One attempt is included in each exam purchase; check OpenText\'s “Additional Details” page for the validity, renewal and retake rules that apply when you book.',
      { callout: 'exam', text: ['“Multiple correct response” questions tell you how many answers to pick and are only scored right when you pick exactly the right set. There is no partial credit — read every option before you choose.'] },
      { h: 'What OpenText recommends' },
      'OpenText suggests a combination of its training courses, hands-on experience and self-study, and for the Administrator and Developer exams at least six months of on-the-job experience. Each learning path in CS Academy lists the recommended courses from the exam outline next to the domains they cover.',
      { callout: 'tip', text: ['Open **Learning paths** in the sidebar to see each exam\'s domains, their weights, the guides and modules for each domain, and your readiness.'] },
    ],
  },
  {
    id: 'pf-study-method',
    title: 'How to prepare for an exam with CS Academy',
    area: 'platform',
    summary: 'A study method that works: learn by domain, practise in the real system, drill weak spots, and simulate the exam before you book it.',
    level: 'basic',
    minutes: 7,
    domains: [],
    tags: ['study', 'exam', 'readiness', 'practice', 'simulation'],
    related: ['pf-certifications'],
    sources: ['CS Academy'],
    body: [
      'Certification exams test whether you can apply what you know to situations, not whether you remember sentences. The fastest way there is to alternate between understanding a feature, using it, and being tested on it — domain by domain, weighted the way the exam is weighted.',
      { h: 'The study loop' },
      {
        figure: {
          type: 'cycle',
          center: 'One exam domain',
          steps: [
            { label: 'Read', sub: 'the guides for the domain' },
            { label: 'Do', sub: 'the modules\' missions in Content Server' },
            { label: 'Drill', sub: '10 questions on the domain' },
            { label: 'Review', sub: 'every explanation you missed' },
          ],
        },
        caption: 'Repeat until the domain\'s readiness is 75% or more.',
      },
      { h: 'Where your time should go' },
      'Domains are not equal. On the Business User exam, workflows and content management are 15% each while Intelligent Viewing is 4%: three times the study for the heavy domains is the right ratio. Each learning path shows the official weights as a blueprint.',
      {
        figure: {
          type: 'ladder',
          steps: [
            { label: 'Read', sub: 'you recognise it' },
            { label: 'Explain', sub: 'you can say why' },
            { label: 'Do', sub: 'you did it in the system' },
            { label: 'Apply', sub: 'you pick the right option in a new scenario' },
          ],
        },
        caption: 'Levels of knowing. Exams test the top step.',
      },
      { h: 'A six-week plan for one exam' },
      {
        figure: {
          type: 'timeline',
          items: [
            { when: 'Week 1', label: 'Baseline', sub: 'Quick practice to find your gaps' },
            { when: 'Weeks 2–4', label: 'Domains', sub: 'Read, do, drill — heaviest first' },
            { when: 'Week 5', label: 'Simulate', sub: 'Full timed simulation; review every miss' },
            { when: 'Week 6', label: 'Close gaps', sub: 'Drill the weakest domains, simulate again' },
            { when: 'Book', label: 'Exam', sub: 'When simulations pass with a margin' },
          ],
        },
      },
      { h: 'Using the app' },
      {
        figure: {
          type: 'compare',
          items: [
            { title: 'Handbook', tone: 'accent', points: ['Reference guides: how things work and how to do them', 'Diagrams, procedures, exam notes', 'Search it at work too'] },
            { title: 'Curriculum', tone: 'info', points: ['Modules with missions in your real Content Server', 'Hands-on work is checked live', 'Knowledge checks per module'] },
            { title: 'Practice exams', tone: 'xp', points: ['Timed simulations with the real length and pass mark', 'Drills per exam domain', 'Explanations and links to the guide to reread'] },
          ],
        },
      },
      {
        figure: {
          type: 'menu',
          title: 'Sidebar',
          items: ['Classroom', 'Learning paths', 'Handbook', 'Curriculum', 'Practice exams', 'Glossary'],
          highlight: 'Learning paths',
          note: 'Start from your learning path: it links every guide, module and drill for each domain of the exam.',
        },
      },
      { h: 'Exam-day technique' },
      {
        steps: [
          'Read the whole question and every option before answering — distractors are often “almost right”.',
          'For “choose two/three” questions, decide each option on its own, then check the count.',
          'Flag questions you are unsure of and come back; never leave one blank.',
          'Watch the clock: about 90 seconds per question on a 60-question, 90-minute exam.',
        ],
        title: 'During the exam',
      },
      {
        figure: {
          type: 'flow',
          steps: [{ label: 'Read', kind: 'start' }, 'Eliminate the clearly wrong', { label: 'Sure?', kind: 'decision' }, 'Answer', { label: 'Next', kind: 'end' }],
          loop: 'Not sure → answer your best guess, flag it, come back at the end',
        },
      },
      { callout: 'remember', text: ['Readiness in CS Academy weighs what you covered against how you score. A passed simulation with a margin of 10 points is a good signal you are ready to book.'] },
    ],
  },
];
