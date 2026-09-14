import fs from 'node:fs';
const required=['README.md','docs/architecture.md','src/index.js','src/charts/bazi/index.js','src/schema/chart.schema.json'];
for(const f of required) if(!fs.existsSync(f)) throw new Error('missing '+f);
await import('../tests/basic.test.js');
await import('../tests/chart-smoke.js');
await import('../tests/term-boundary-smoke.js');
console.log('suanming-core check passed');
