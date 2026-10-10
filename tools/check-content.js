'use strict';
// Validates all curriculum content (the same checks the server runs at
// start-up) and prints what each exam domain has to offer.
//
//   node tools/check-content.js
//   node tools/check-content.js --only guides/x.js,questions/x.js,track-x.js
//        checks only those files (plus the core tracks); links into files
//        that were not loaded are reported as warnings.

const i = process.argv.indexOf('--only');
if (i > 0) process.env.CSA_ONLY = process.argv[i + 1] || '';

let c;
try {
  c = require('../curriculum');
} catch (e) {
  console.error(e.message);
  process.exit(1);
}

const pad = (s, n) => String(s).padEnd(n);
if (c.warnings.length) console.log(`Warnings (checked again when all content is loaded):\n  ${c.warnings.join('\n  ')}\n`);
console.log(`${c.MODULES.length} modules, ${c.missionById.size} missions, ${c.guides.length} guides, ${c.glossary.length} glossary terms\n`);
for (const cert of c.CERTS) {
  const qs = cert.domains.reduce((a, d) => a + c.domainPool.get(d.id).length, 0);
  console.log(`${cert.id} ${cert.title} — ${qs} questions`);
  for (const d of cert.domains) {
    const guides = c.domainGuides.get(d.id).length;
    const pool = c.domainPool.get(d.id);
    const bank = pool.filter((id) => id.startsWith('bank:')).length;
    console.log(`  ${pad(d.id, 20)} ${pad(`${d.weight}%`, 5)} guides ${pad(guides, 3)} questions ${pad(pool.length, 4)} (bank ${pad(bank, 3)}) modules ${c.domainModules.get(d.id).join(' ') || '—'}`);
  }
  console.log('');
}
