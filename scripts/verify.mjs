/**
 * 交付质量门（npm run verify）
 * ---------------------------------------------------------------------------
 * 一条命令跑完所有必须全绿才算完成的检查，任何一步失败即整体失败：
 *
 *   1. 类型/契约检查与语法/静态检查
 *   2. 重建网页引擎产物（保证 web/engine.js 与 src/ + rules/ 同源）
 *   3. 全量测试（含网页引擎指纹同步、适配层契约、黄金盘、边界）
 *   4. 隐私扫描（不把个人生日、口令、私钥带进仓库）
 *   5. 交付物完整性（网页入口、引擎产物、关键文档齐全）
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

run('类型与公共契约检查', 'scripts/typecheck.mjs');
run('语法与静态检查', 'scripts/lint.mjs');
run('重建网页引擎产物', 'scripts/build-web-engine.mjs');
run('同步部署镜像', 'scripts/sync-deployment-mirror.mjs');
run('架构边界扫描', 'scripts/architecture-scan.mjs');
run('网页可访问性冒烟', 'scripts/accessibility-smoke.mjs');
run('网页性能冒烟', 'scripts/performance-smoke.mjs');
run('全量测试', 'scripts/check.js');
run('隐私扫描', 'scripts/privacy-scan.mjs');

process.stdout.write('\n[verify] 交付物完整性\n');
const artifacts = [
  'web/index.html',
  'web/paipan.html',
  'web/check.html',
  'web/check.js',
  'web/style.css',
  'web/engine.js',
  'web/engine-adapter.js',
  'web/analysis.js',
  'web/bihua-data.js',
  'web/app.js',
  'scripts/build-bihua-data.mjs',
  'scripts/architecture-scan.mjs',
  'scripts/typecheck.mjs',
  'scripts/lint.mjs',
  'scripts/accessibility-smoke.mjs',
  'scripts/performance-smoke.mjs',
  'scripts/package-release.mjs',
  'src/derive/relations.js',
  'src/interpret/past-events.js',
  'tests/relations-smoke.js',
  'tests/past-events-smoke.js',
  'CONSTRAINTS.md',
  'docs/product-spec.md',
  'docs/acceptance.md',
  'docs/implementation-plan.md',
  'AGENTS.md',
  'PROJECT_CONTEXT.md',
  'docs/INDEX.md'
  ,'docs/release-checklist.md'
  ,'docs/rollback.md'
  ,'docs/risk-register.md'
  ,'docs/adr/README.md'
  ,'docs/reviews/2026-09-21-architecture-review.md'
  // 业务文档公开入仓：模板、SOP、上架文案、合成示例与物料成品。
  // 真实案例与客户资料只留本地，由 .gitignore 与隐私扫描共同拦截。
  ,'docs/business/README.md'
  ,'docs/business/master-plan.md'
  ,'docs/business/report-template.md'
  ,'docs/business/intake-questionnaire.md'
  ,'docs/business/content-library.md'
  ,'docs/business/pricing-and-delivery-sop.md'
  ,'docs/business/listing-copy.md'
  ,'docs/business/materials.md'
  ,'docs/business/samples/sample-a-career-marriage.md'
  ,'docs/business/samples/sample-b-marriage-grade.md'
  ,'docs/business/materials/img1-xianyu-verify-past.jpg'
  ,'docs/business/materials/img2-xianyu-own-up.jpg'
  ,'docs/business/materials/img3-xiaohongshu-cover.jpg'
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
