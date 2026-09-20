/** 部署镜像回归：app/ 必须逐文件等于 web/，README 是根目录说明文件例外。 */
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const WEB = resolve(ROOT, 'web');
const APP = resolve(ROOT, '..', 'app');

function files(dir, base = dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = resolve(dir, entry.name);
    if (entry.isDirectory()) out.push(...files(path, base));
    else out.push(relative(base, path).replaceAll('\\', '/'));
  }
  return out.sort();
}
function digest(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

if (!statSync(APP).isDirectory()) throw new Error('deployment mirror missing: ../app');
const expected = files(WEB);
const actual = files(APP).filter(file => file !== 'README.md');
const missing = expected.filter(file => !actual.includes(file));
const extra = actual.filter(file => !expected.includes(file));
const mismatch = expected.filter(file => actual.includes(file) && digest(resolve(WEB, file)) !== digest(resolve(APP, file)));
if (missing.length || extra.length || mismatch.length) {
  throw new Error('deployment mirror mismatch: ' + JSON.stringify({ missing, extra, mismatch }));
}
console.log('deployment mirror smoke passed (' + expected.length + ' files)');
