/**
 * JavaScript 项目的类型/契约门禁。
 * 本项目不使用 TypeScript，因此这里检查公开 API、package exports 与 Schema
 * 是否仍然满足文档约定，避免“能解析”但公共接口已经漂移。
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const pkg = JSON.parse(readFileSync(resolve(ROOT, 'package.json'), 'utf8'));
const api = await import(new URL('../src/index.js', import.meta.url).href);

const requiredFunctions = [
  'castBazi', 'castZiwei', 'compareSchools',
  'validateChart', 'validateZiweiChart', 'validateTraceability',
  'validateCivilInput', 'explain', 'createManifest'
];
if (pkg.version !== api.ENGINE_VERSION) {
  throw new Error(`package version ${pkg.version} does not match ENGINE_VERSION ${api.ENGINE_VERSION}`);
}
const missingFunctions = requiredFunctions.filter(name => typeof api[name] !== 'function');
if (missingFunctions.length) {
  throw new Error('public API contract missing functions: ' + missingFunctions.join(', '));
}

for (const [name, target] of Object.entries(pkg.exports ?? {})) {
  if (name === './package.json') continue;
  const rel = target.replace(/^\.\//, '');
  const absolute = resolve(ROOT, rel);
  try {
    readFileSync(absolute);
  } catch {
    throw new Error(`package export ${name} points to missing file: ${rel}`);
  }
}

JSON.parse(readFileSync(resolve(ROOT, 'schema/chart.schema.json'), 'utf8'));
JSON.parse(readFileSync(resolve(ROOT, 'src/schema/chart.schema.json'), 'utf8'));
console.log('typecheck passed (public API / package exports / schemas)');
