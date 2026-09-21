/**
 * 架构边界扫描。
 * 这不是 lint，而是阻止最容易让 AI 项目重新退化的几类结构性回归：
 * 第二套算法、解释层重算、核心层读取随机/当前时间、旧网页入口复活。
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const findings = [];

function read(rel) {
  const abs = resolve(ROOT, rel);
  if (!existsSync(abs)) {
    findings.push(`${rel}: 文件缺失`);
    return '';
  }
  return readFileSync(abs, 'utf8');
}

function forbid(rel, patterns) {
  const text = read(rel);
  for (const [pattern, reason] of patterns) {
    if (pattern.test(text)) findings.push(`${rel}: ${reason}`);
  }
}

function jsFiles(dir, prefix = dir) {
  const abs = resolve(ROOT, dir);
  if (!existsSync(abs)) return [];
  const out = [];
  for (const entry of readdirSync(abs, { withFileTypes: true })) {
    const rel = `${prefix}/${entry.name}`;
    if (entry.isDirectory()) out.push(...jsFiles(rel, rel));
    else if (/\.(?:js|mjs)$/.test(entry.name)) out.push(rel);
  }
  return out;
}

for (const rel of ['src/index.js', 'src', 'rules']) {
  if (!existsSync(resolve(ROOT, rel))) findings.push(`${rel}: 文件或目录缺失`);
}

forbid('web/analysis.js', [
  [/jdFromDate|sunLon|solarTerm|castBazi|castZiwei|yearPillar/, '解释层出现历法/排盘计算'],
  [/Math\.random|Date\.now/, '解释层使用随机数或隐式当前时间']
]);

for (const dir of ['src', 'rules']) {
  for (const rel of jsFiles(dir)) {
    forbid(rel, [
      [/Math\.random|Date\.now/, '核心计算层使用随机数或隐式当前时间']
    ]);
  }
}

for (const rel of ['web/app.js', 'web/check.js', 'web/engine-adapter.js', 'tools/report/report.js']) {
  forbid(rel, [
    [/Math\.random|Date\.now/, '页面适配层使用随机数或 Date.now'],
    [/from ['"]\.\/bazi|require\(['"]\.\/bazi/, '页面重新引入旧算法入口']
  ]);
}

const page = read('web/paipan.html');
if (!/type="module"\s+src="app\.js"/.test(page)) findings.push('web/paipan.html: 未使用模块化单一入口');
if (/<script[^>]+src=["']bazi\.js/.test(page)) findings.push('web/paipan.html: 旧 bazi.js 入口仍存在');
if (existsSync(resolve(ROOT, 'web/bazi.js'))) findings.push('web/bazi.js: 旧双算法文件仍存在');

if (findings.length) {
  console.error('architecture scan failed (' + findings.length + ' findings)');
  for (const finding of findings) console.error('  ' + finding);
  process.exitCode = 1;
} else {
  console.log('architecture scan passed (single engine / separated interpretation / explicit display time)');
}
