/**
 * 隐私与交付物扫描
 * ---------------------------------------------------------------------------
 * 这个仓库同时装着「引擎源码」和「本地跑过的真实案例」。真实出生资料一旦被提交，
 * Git 历史里就永远删不干净，且这类数据无法撤回。所以交付前必须机械地扫一遍。
 *
 * 检查范围是「将要进入版本库的文件」：已跟踪的 + 未跟踪且未被忽略的。
 * 本地临时产物由 .gitignore 负责，不需要在这里重复判定。
 *
 * 用法：node scripts/privacy-scan.mjs
 */
import { readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const FORBIDDEN_PATHS = [
  { re: /[.]bundle$/, why: '本地 git bundle 不得入库' },
  { re: /[.]private[.]json$/, why: '私人案例数据' },
  { re: /(^|[/])private[/]/, why: '私人目录' },
  { re: /^tmp_upload[/]/, why: '上传暂存目录' }
];

const SECRET_PATTERNS = [
  { re: /(?:password|passwd|pwd)\s*[:=]\s*[\x22\x27][^\x22\x27\s]{6,}[\x22\x27]/i, why: '疑似硬编码口令' },
  { re: /-----BEGIN [A-Z ]*PRIVATE KEY-----/, why: '私钥内容' },
  { re: /\bsk-[A-Za-z0-9]{20,}\b/, why: '疑似 API key' },
  { re: /\broot\s*:\s*[A-Za-z0-9!@#$%^&*_+-]{8,}/, why: '疑似服务器凭据' }
];

const PROFILE_PATTERNS = [
  { re: /(?:value|placeholder)\s*=\s*[\x22\x27](?:19|20)\d{2}-\d{2}-\d{2}[\x22\x27]/, why: '表单预填了具体出生日期' }
];

const BINARY = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.ico', '.woff', '.woff2', '.pdf'];

function listedFiles() {
  const result = spawnSync('git', ['ls-files', '--cached', '--others', '--exclude-standard'], {
    cwd: ROOT, encoding: 'utf8'
  });
  if (result.status !== 0) throw new Error('git ls-files failed: ' + (result.stderr || result.stdout));
  return result.stdout.split(/\r?\n/).filter(Boolean);
}

const findings = [];
let scanned = 0;

for (const rel of listedFiles()) {
  const norm = rel.replace(/\\/g, '/');
  for (const rule of FORBIDDEN_PATHS) {
    if (rule.re.test(norm)) findings.push({ rel: norm, line: 0, why: rule.why });
  }

  const abs = resolve(ROOT, rel);
  let size;
  try { size = statSync(abs).size; } catch { continue; }
  if (size > 2 * 1024 * 1024) continue;
  const ext = norm.slice(norm.lastIndexOf('.')).toLowerCase();
  if (BINARY.includes(ext)) continue;

  let text;
  try { text = readFileSync(abs, 'utf8'); } catch { continue; }
  if (text.includes('\u0000')) continue;
  scanned++;

  const lines = text.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (const rule of SECRET_PATTERNS) {
      if (rule.re.test(line)) findings.push({ rel: norm, line: i + 1, why: rule.why });
    }
    // 表单预填检查同样覆盖本地出报告工具：它也会被真实客户资料填满，
    // 一旦把某个具体生日写进模板就会被扫出来。
    if (norm.startsWith('web/') || norm.startsWith('examples/') || norm.startsWith('tools/')) {
      for (const rule of PROFILE_PATTERNS) {
        if (rule.re.test(line)) findings.push({ rel: norm, line: i + 1, why: rule.why });
      }
    }
  }
}

if (findings.length) {
  console.error('privacy scan failed (' + findings.length + ' findings)');
  for (const f of findings) {
    console.error('  ' + f.rel + (f.line ? ':' + f.line : '') + ' \u2014 ' + f.why);
  }
  process.exitCode = 1;
} else {
  console.log('privacy scan passed (' + scanned + ' files)');
}
