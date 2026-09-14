import fs from 'node:fs'; import { execFileSync } from 'node:child_process';
const required=['README.md','docs/architecture.md','src/index.js','src/charts/bazi/index.js','src/schema/chart.schema.json'];
for(const f of required) if(!fs.existsSync(f)) throw new Error('missing '+f);
execFileSync(process.execPath,['--test','tests/'],{stdio:'inherit'});
console.log('suanming-core check passed');
