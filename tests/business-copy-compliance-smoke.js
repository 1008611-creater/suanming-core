/**
 * 业务文档合规扫描（docs/business/）
 * ---------------------------------------------------------------------------
 * 业务文档会直接变成对外文案与话术，一旦带上比例承诺就无法回收：
 * 平台截图、聊天记录、客户口碑都会留下。所以这里机械扫一遍，不靠人记。
 *
 * 规则：
 *   1. 一律用条数口径。任何比例表达（百分号、`%`、`准确率`、`命中率`、
 *      `百分之`、`成数`写法如「返现三成」以外的数字比例）都不得出现。
 *   2. 两篇样稿必须显式标注「合成示例（非真实客户）」，不得让读者误以为是真实案例。
 *   3. 业务文档不得引用真实客户资料文件（如 `刘曙宾-命理详批.md`）。
 *   4. 免责声明与「不做事后夸功」纪律必须留在文档里。
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const BUSINESS = resolve(ROOT, 'docs/business');

function assert(condition, message) {
  if (!condition) throw new Error('[business-copy] ' + message);
}

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const path = resolve(dir, name);
    if (statSync(path).isDirectory()) out.push(...walk(path));
    else out.push(path);
  }
  return out;
}

const TEXT_EXT = /\.(?:md|html|txt)$/i;
const files = walk(BUSINESS).filter(f => TEXT_EXT.test(f)).sort();
assert(files.length >= 10, '业务文档数量异常，疑似目录被清空：' + files.length);

/* ---------- 1. 比例表达（含模板里的自我说明行也要避开） ---------- */
// 说明性文字里出现「百分比」三个字是允许的（例如「不出现百分比」这句纪律本身），
// 但不得出现真正的比例数值：`%`、`__%`、`50%`、`准确率`、`命中率`、`百分之 40`。
const RATIO_RULES = [
  [/[0-9０-９]\s*%/, '出现带数值的比例符号'],
  [/%/, '出现比例符号'],
  [/准确率/, '出现「准确率」'],
  [/命中率/, '出现「命中率」'],
  [/百分之\s*[0-9０-９一二三四五六七八九十]/, '出现「百分之 N」写法'],
  [/返现\s*[0-9０-９]/, '出现数字返现比例'],
  [/加收\s*[0-9０-９]/, '出现数字加收比例']
];

const findings = [];
for (const abs of files) {
  const rel = relative(ROOT, abs).replaceAll('\\', '/');
  const raw = readFileSync(abs, 'utf8');
  // 物料源文件是 HTML：样式表里的 `50%`、`100%` 是排版单位，不是承诺，
  // 但必须保证「用户能看见的文字」里没有比例 —— 所以只扫可见文本。
  const text = /\.html$/i.test(abs)
    ? raw.replace(/<style[\s\S]*?<\/style>/gi, '\n').replace(/<script[\s\S]*?<\/script>/gi, '\n')
    : raw;
  const lines = text.split(/\r?\n/);
  lines.forEach((line, index) => {
    for (const [pattern, why] of RATIO_RULES) {
      // 纪律句本身必须提到这些词（「不出现百分比」「一律说条数」），
      // 这类句子带否定词且同时写了条数口径，不算承诺，跳过。
      const isDiscipline = /不出现|不用|没有|不得|禁止|只说条数|一律说条数|只数条数|用条数/.test(line)
        && /条数|只数条|说条数|数条/.test(line);
      if (isDiscipline) continue;
      if (pattern.test(line)) findings.push(rel + ':' + (index + 1) + ' — ' + why + '：' + line.trim().slice(0, 80));
    }
  });
  assert(!/刘曙宾/.test(raw), rel + '：出现真实客户姓名');
  // 允许「客户名-命理详批.md」这类命名约定，但不得引用仓库外的真实案例原件。
  assert(!/\.\.\/[^\s`）)]*命理详批\.md/.test(raw), rel + '：引用了仓库外的真实案例文件');
}

/* ---------- 2. 样稿必须标注合成示例 ---------- */
for (const name of ['samples/sample-a-career-marriage.md', 'samples/sample-b-marriage-grade.md']) {
  const text = readFileSync(resolve(BUSINESS, name), 'utf8');
  assert(text.includes('合成示例（非真实客户）'), name + '：未标注「合成示例（非真实客户）」');
}

/* ---------- 3. 免责与纪律必须留在文档里 ---------- */
const readme = readFileSync(resolve(BUSINESS, 'README.md'), 'utf8');
assert(/不吓唬人|不吓唬/.test(readme), 'README 缺少「不吓唬人」纪律');
assert(/不泄露/.test(readme), 'README 缺少「不泄露」纪律');
const template = readFileSync(resolve(BUSINESS, 'report-template.md'), 'utf8');
assert(/不确定项与免责/.test(template), '报告模板缺少免责章节');
assert(/可核验前瞻/.test(template), '报告模板缺少可核验前瞻章节');
const sop = readFileSync(resolve(BUSINESS, 'pricing-and-delivery-sop.md'), 'utf8');
assert(/主动退款/.test(sop), '交付 SOP 缺少主动退款规则');
assert(/条/.test(sop), '交付 SOP 缺少条数口径');

if (findings.length) {
  console.error('business copy compliance failed (' + findings.length + ' findings)');
  findings.forEach(f => console.error('  ' + f));
  process.exit(1);
}
console.log('business copy compliance passed (' + files.length + ' files)');
