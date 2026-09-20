/** 静态页面可访问性冒烟：标签关联、文档语言、标题和按钮名称。 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const pages = ['web/index.html', 'web/paipan.html', 'web/check.html'];
const findings = [];

for (const rel of pages) {
  const html = readFileSync(resolve(ROOT, rel), 'utf8');
  if (!/<html\b[^>]*\blang=["']zh-CN["']/i.test(html)) findings.push(`${rel}: missing lang=zh-CN`);
  if (!/<title>[^<]+<\/title>/i.test(html)) findings.push(`${rel}: missing title`);
  if (!/<meta\s+name=["']description["']/i.test(html)) findings.push(`${rel}: missing description`);
  const ids = new Set([...html.matchAll(/\bid=["']([^"']+)["']/gi)].map(m => m[1]));
  for (const match of html.matchAll(/<label\b([^>]*)>/gi)) {
    const forId = /\bfor=["']([^"']+)["']/i.exec(match[1])?.[1];
    if (!forId || !ids.has(forId)) findings.push(`${rel}: label is not associated with an existing control`);
  }
  for (const match of html.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/gi)) {
    const attrs = match[1], text = match[2].replace(/<[^>]+>/g, '').trim();
    if (!text && !/\baria-label=["'][^"']+["']/i.test(attrs)) findings.push(`${rel}: unnamed button`);
  }
}

if (findings.length) {
  console.error('accessibility smoke failed (' + findings.length + ' findings)');
  findings.forEach(f => console.error('  ' + f));
  process.exit(1);
}
console.log('accessibility smoke passed (' + pages.length + ' pages)');
