/**
 * 生成静态发布包，不执行上传。
 * 先运行 npm run verify，再运行 npm run package:release。
 */
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const APP = resolve(ROOT, '..', 'app');
const pkg = JSON.parse(readFileSync(resolve(ROOT, 'package.json'), 'utf8'));
const engine = readFileSync(resolve(APP, 'engine.js'), 'utf8');
const sourceHash = /WEB_ENGINE_SOURCE_HASH\s*=\s*["']([^"']+)["']/.exec(engine)?.[1];
if (!sourceHash) throw new Error('app/engine.js missing WEB_ENGINE_SOURCE_HASH');

const out = resolve(ROOT, '.release', `suanming-core-${pkg.version}-${sourceHash}`);
if (existsSync(out)) rmSync(out, { recursive: true, force: true });
mkdirSync(resolve(ROOT, '.release'), { recursive: true });
cpSync(APP, out, { recursive: true, filter: source => !source.endsWith('README.md') });

function list(dir, base = dir) {
  const result = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = resolve(dir, entry.name);
    if (entry.isDirectory()) result.push(...list(path, base));
    else result.push(relative(base, path).replaceAll('\\', '/'));
  }
  return result.sort();
}

const manifest = {
  package: pkg.name,
  version: pkg.version,
  engineSourceHash: sourceHash,
  source: 'suanming-core/app mirror generated from web/',
  files: list(out)
};
writeFileSync(resolve(out, 'release-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(`release package created: ${relative(ROOT, out).replaceAll('\\', '/')} (${manifest.files.length} files, ${sourceHash})`);
