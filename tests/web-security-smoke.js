/**
 * 页面输出安全冒烟：用户可控的姓名/未知字形不能未经转义拼入 HTML。
 * 这是渲染层约束，不把 DOM 环境引入核心测试。
 */
import { readFileSync } from 'node:fs';

const app = readFileSync(new URL('../web/app.js', import.meta.url), 'utf8');
const check = readFileSync(new URL('../web/check.js', import.meta.url), 'utf8');

if (!/function esc\(v\)/.test(app)) throw new Error('[web-security] app.js 缺少 HTML 转义函数');
if (!/kv\('姓名', esc\(p\.name\)/.test(app)) throw new Error('[web-security] 姓名未转义');
if (!/esc\(\(n5\.unknown \|\| \[\]\)\.join/.test(app)) throw new Error('[web-security] 未收录字形未转义');
if (!/function esc\(s\)/.test(check)) throw new Error('[web-security] check.js 缺少 HTML 转义函数');
if (!/esc\(p\.gender\)/.test(app)) throw new Error('[web-security] 性别字段未转义');
if (!/n5\.notes\.map\(esc\)/.test(app)) throw new Error('[web-security] 笔画异说未转义');

console.log('[web-security] ok  用户输入输出已转义');
