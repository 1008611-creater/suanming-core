/**
 * 无依赖静态质量门。
 * 先对所有可执行 JavaScript 做语法检查，再拦截高风险动态执行语法。
 * 业务规则的确定性与页面边界由 architecture-scan.mjs 继续负责。
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { resolve, relative } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const DIRECTORIES = ['src', 'rules', 'web', 'scripts'];
const files = [];

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = resolve(dir, name);
    const stat = statSync(path);
    if (stat.isDirectory()) walk(path);
    else if (/\.(?:js|mjs)$/.test(name)) files.push(path);
  }
}

for (const dir of DIRECTORIES) walk(resolve(ROOT, dir));
const findings = [];
const banned = [
  { pattern: new RegExp('\\b' + 'debugger' + '\\b'), label: 'debugger' },
  { pattern: new RegExp('\\b' + 'eval' + '\\s*\\('), label: 'eval()' },
  { pattern: new RegExp('\\bnew\\s+' + 'Function' + '\\s*\\('), label: 'new Function()' }
];
for (const file of files.sort()) {
  const result = spawnSync(process.execPath, ['--check', file], { cwd: ROOT, encoding: 'utf8' });
  if (result.status !== 0) {
    findings.push(`${relative(ROOT, file)}: syntax check failed\n${result.stderr || result.stdout}`);
  }
  // 本脚本需要包含门禁词本身；语法检查仍然覆盖它，但跳过自身的禁词扫描。
  if (file === resolve(ROOT, 'scripts/lint.mjs')) continue;
  const source = readFileSync(file, 'utf8');
  for (const { pattern, label } of banned) {
    if (pattern.test(source)) findings.push(`${relative(ROOT, file)}: forbidden ${label}`);
  }
}

if (findings.length) {
  console.error('lint failed (' + findings.length + ' findings)');
  for (const finding of findings) console.error('  ' + finding);
  process.exit(1);
}
console.log('lint passed (' + files.length + ' JavaScript files)');
