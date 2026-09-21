/** 静态产物性能冒烟：防止核心脚本或页面资源无意中膨胀。 */
import { existsSync, readdirSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const WEB = resolve(ROOT, 'web');
const TOOL = resolve(ROOT, 'tools', 'report');
const files = readdirSync(WEB).filter(name => /\.(?:html|css|js|svg)$/.test(name));
const bytes = Object.fromEntries(files.map(name => [name, statSync(resolve(WEB, name)).size]));
const total = Object.values(bytes).reduce((sum, size) => sum + size, 0);
// 本地出报告工具不进 web/，所以线上发布的资源总量与 0.6.0 发布时一致；
// 它自己的两个文件单独定额，避免「本地工具顺手把线上包养胖」。
const toolFiles = ['report.html', 'report.js'].filter(name => existsSync(resolve(TOOL, name)));
const toolBytes = Object.fromEntries(toolFiles.map(name => ['tools/report/' + name, statSync(resolve(TOOL, name)).size]));
const limits = {
  'engine.js': 250 * 1024,
  'bihua-data.js': 120 * 1024,
  'analysis.js': 40 * 1024,
  'app.js': 40 * 1024,
  'check.js': 30 * 1024,
  // 适配层从引擎产物里带回关系派生与前事清单，体积随之上升；
  // 它仍是单一转换点，不新增第二套算法，故给它单独额度。
  'engine-adapter.js': 24 * 1024,
  'style.css': 24 * 1024,
  'index.html': 12 * 1024,
  'paipan.html': 12 * 1024,
  'check.html': 12 * 1024,
  'favicon.svg': 4 * 1024,
  // 总量从 400KB 上调到 440KB：新增关系派生与前事解释层后，
  // 页面侧多了清单渲染与打标逻辑（check.js 约 18KB）。
  // 上调部分全部来自新增功能，未放宽任何既有单项额度；
  // 若后续再接近上限，应先拆包而不是继续抬总闸门。
  total: 440 * 1024,
  // 本地出报告工具：页面壳（表单 + 打印样式）与 18 节填坑逻辑各自成文件，
  // 两者都只做渲染与调用，不新增算法，故按工具体积单独定额。
  'tools/report/report.html': 12 * 1024,
  'tools/report/report.js': 32 * 1024,
  'tools/report/total': 44 * 1024
};
const findings = [];
for (const [name, limit] of Object.entries(limits)) {
  const actual = name === 'total' ? total
    : name === 'tools/report/total' ? Object.values(toolBytes).reduce((sum, size) => sum + size, 0)
    : name.startsWith('tools/report/') ? toolBytes[name]
    : bytes[name];
  if (actual > limit) findings.push(`${name}: ${actual} bytes > ${limit} byte budget`);
}
if (findings.length) {
  console.error('performance smoke failed');
  findings.forEach(f => console.error('  ' + f));
  process.exit(1);
}
console.log('performance smoke passed (' + total + ' web bytes; engine=' + bytes['engine.js'] + ')');
