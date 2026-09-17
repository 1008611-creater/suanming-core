/**
 * 交付质量门（npm run verify）
 * ---------------------------------------------------------------------------
 * 一条命令跑完所有必须全绿才算完成的检查，任何一步失败即整体失败：
 *
 *   1. 重建网页引擎产物（保证 web/engine.js 与 src/ + rules/ 同源）
 *   2. 全量测试（含网页引擎指纹同步、适配层契约、黄金盘、边界）
 *   3. 隐私扫描（不把个人生日、口令、私钥带进仓库）
 *   4. 交付物完整性（网页入口、引擎产物、关键文档齐全）
 *
 * 退出码非零 = 未达到可交付状态。CI 与本地使用同一入口，避免本地绿、线上红。
 */
import { spawnSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function run(label, script) {
  process.stdout.write('\n[verify] ' + label + '\n');
  const result = spawnSync(process.execPath, [resolve(ROOT, script)], {
    cwd: ROOT,
    stdio: 'inherit'
  });
  if (result.status !== 0) {
    console.error('\n[verify] FAILED at: ' + label + ' (' + script + ')');
    process.exit(1);
  }
}

run('重建网页引擎产物', 'scripts/build-web-engine.mjs');
run('全量测试', 'scripts/check.js');
run('隐私扫描', 'scripts/privacy-scan.mjs');

process.stdout.write('\n[verify] 交付物完整性\n');
const artifacts = [
  'web/index.html',
  'web/paipan.html',
  'web/engine.js',
  'web/engine-adapter.js',
  'web/analysis.js',
  'web/app.js',
  'CONSTRAINTS.md',
  'docs/product-spec.md',
  'docs/acceptance.md',
  'docs/implementation-plan.md'
];
const missing = artifacts.filter(f => !existsSync(resolve(ROOT, f)));
if (missing.length) {
  console.error('[verify] FAILED: 缺少交付物 ' + missing.join(', '));
  process.exit(1);
}

const engine = readFileSync(resolve(ROOT, 'web/engine.js'), 'utf8');
if (!engine.includes('WEB_ENGINE_SOURCE_HASH')) {
  console.error('[verify] FAILED: web/engine.js 未包含来源指纹');
  process.exit(1);
}

console.log('\n[verify] 全部通过：可交付');
