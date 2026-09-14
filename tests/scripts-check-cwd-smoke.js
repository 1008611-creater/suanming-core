import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

// 检查脚本必须基于自身位置定位工程根目录，不能依赖调用者的当前目录。
const here = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(resolve(here, '..', 'scripts', 'check.js'), 'utf8');
assert.ok(source.includes('import.meta.url'), 'check.js must resolve paths from its own location');
assert.ok(!/fs\.existsSync\('README\.md'\)/.test(source), 'check.js must not test paths relative to cwd');

console.log('check script cwd smoke passed');
