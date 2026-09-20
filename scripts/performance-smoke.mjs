/** 静态产物性能冒烟：防止核心脚本或页面资源无意中膨胀。 */
import { readdirSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const WEB = resolve(ROOT, 'web');
const files = readdirSync(WEB).filter(name => /\.(?:html|css|js|svg)$/.test(name));
const bytes = Object.fromEntries(files.map(name => [name, statSync(resolve(WEB, name)).size]));
const total = Object.values(bytes).reduce((sum, size) => sum + size, 0);
const limits = {
  'engine.js': 250 * 1024,
  'bihua-data.js': 120 * 1024,
  'analysis.js': 40 * 1024,
  'app.js': 40 * 1024,
  'check.js': 30 * 1024,
  total: 400 * 1024
};
const findings = [];
for (const [name, limit] of Object.entries(limits)) {
  const actual = name === 'total' ? total : bytes[name];
  if (actual > limit) findings.push(`${name}: ${actual} bytes > ${limit} byte budget`);
}
if (findings.length) {
  console.error('performance smoke failed');
  findings.forEach(f => console.error('  ' + f));
  process.exit(1);
}
console.log('performance smoke passed (' + total + ' web bytes; engine=' + bytes['engine.js'] + ')');
