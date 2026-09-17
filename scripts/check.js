/**
 * 工程自检入口（npm test）
 * ---------------------------------------------------------------------------
 * 1. 必需文件必须存在（路径相对本文件定位，从任意工作目录调用都成立）。
 * 2. tests/ 下的测试自动全量执行——不维护手工清单，新增测试不会被静默跳过。
 * 3. 任一测试失败则退出码非零，CI 立即失败。
 */
import { existsSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const required = [
  'README.md',
  'CHANGELOG.md',
  'CONSTRAINTS.md',
  'docs/product-spec.md',
  'docs/acceptance.md',
  'docs/implementation-plan.md',
  'docs/decisions/ADR-0006-web-single-engine-source.md',
  'docs/decisions/ADR-0007-wangshuai-thresholds.md',
  'docs/decisions/ADR-0008-equation-of-time.md',
  'docs/architecture.md',
  'docs/api.md',
  'docs/rule-sets.md',
  'src/index.js',
  'src/charts/bazi/index.js',
  'src/derive/hash.js',
  'rules/index.js',
  'rules/bazi-core-0.1.0/ruleset.js',
  'rules/bazi-zichu-0.1.0/ruleset.js',
  'rules/ziwei-core-0.1.0/ruleset.js',
  'rules/ziwei-core-0.2.0/ruleset.js',
  'src/charts/ziwei/index.js',
  'src/charts/ziwei/chart.js',
  'src/charts/ziwei/minor-stars.js',
  'src/charts/ziwei/twelve-gods.js',
  'docs/ziwei-model.md',
  'src/version.js',
  'src/derive/wuxing.js',
  'src/compare/schools.js',
  'schema/chart.schema.json',
  'src/schema/chart.schema.json',
  'scripts/privacy-scan.mjs',
  'scripts/verify.mjs',
  'scripts/build-web-engine.mjs',
  'scripts/build-bihua-data.mjs',
  'web/engine.js',
  'web/bihua-data.js',
  'web/engine-adapter.js'
];
const missing = required.filter(f => !existsSync(resolve(ROOT, f)));
if (missing.length) throw new Error('missing required files: ' + missing.join(', '));

const testsDir = resolve(ROOT, 'tests');
const tests = readdirSync(testsDir)
  .filter(f => f.endsWith('.js') || f.endsWith('.mjs'))
  .sort();

if (!tests.length) throw new Error('no tests found in ' + testsDir);

const failures = [];
for (const test of tests) {
  try {
    await import(new URL('../tests/' + test, import.meta.url).href);
  } catch (error) {
    failures.push(test + ': ' + (error?.stack ?? error));
  }
}

if (failures.length) {
  console.error('suanming-core check failed (' + failures.length + '/' + tests.length + ')');
  for (const failure of failures) console.error(failure);
  process.exitCode = 1;
} else {
  console.log('suanming-core check passed (' + tests.length + ' tests)');
}
