/**
 * 本地出报告工具的一键启动器。
 * ---------------------------------------------------------------------------
 * 只做一件事：把这台机器上的两个目录用本机回环地址服务起来，
 * 让浏览器打开 report.html 时能按模块方式加载同一份引擎产物。
 *
 * 目录映射（报告工具不进 web/，线上站点产物保持原样）：
 *   /report.html、/report.js  ->  tools/report/
 *   其余（引擎、解释层、样式）  ->  web/   ← 与线上发布的同一份产物
 *
 * 为什么需要一个本地服务而不是双击 html：
 *   report.js 是 ES 模块（import engine-adapter.js），file:// 协议下浏览器会
 *   因同源策略拒绝加载模块。这是浏览器的安全模型，不是本工具的缺陷。
 *
 * 边界（与项目纪律一致）：
 *   - 只监听 127.0.0.1，不对外网暴露；
 *   - 只读文件，不写入、不上传、不落库；
 *   - 不代客户填任何资料，客户数据只存在于浏览器内存里；
 *   - 不做任何计算，计算全部来自 web/engine.js。
 *
 * 用法：npm run report
 *      npm run report -- --port 9000     指定端口
 *      npm run report -- --no-open       不自动打开浏览器
 */
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const WEB = resolve(ROOT, 'web');
const TOOL = resolve(ROOT, 'tools', 'report');

const args = process.argv.slice(2);
const readFlag = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};
const PORT = Number(readFlag('--port') || process.env.REPORT_PORT || 8123);
const OPEN = !args.includes('--no-open');
const ENTRY = '/report.html';

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/plain; charset=utf-8'
};

/** 报告工具自己的文件只有这两个，其余一律回落到 web/ 的同一份产物。 */
const TOOL_FILES = new Set(['report.html', 'report.js']);

/** 把请求路径收敛到允许的目录内，越界一律拒绝。 */
function safePath(urlPath) {
  let pathname = decodeURIComponent(urlPath.split('?')[0]);
  if (pathname === '/' || pathname === '') pathname = ENTRY;
  const rel = normalize(pathname).replace(/^([/\\])+/, '');
  const base = TOOL_FILES.has(rel) ? TOOL : WEB;
  const abs = resolve(base, rel);
  if (abs !== base && !abs.startsWith(base + sep)) return null;
  return abs;
}

const server = createServer((req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('只支持读取。');
    return;
  }
  const abs = safePath(req.url || '/');
  if (!abs) {
    res.writeHead(403, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('路径越界。');
    return;
  }
  if (!existsSync(abs) || !statSync(abs).isFile()) {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('没有这个文件：' + req.url);
    return;
  }
  const body = readFileSync(abs);
  res.writeHead(200, {
    'content-type': TYPES[extname(abs).toLowerCase()] || 'application/octet-stream',
    'content-length': body.length,
    // 报告工具要边改边看，禁用缓存避免浏览器吃到旧脚本。
    'cache-control': 'no-store'
  });
  res.end(req.method === 'HEAD' ? undefined : body);
});

server.on('error', (error) => {
  if (error && error.code === 'EADDRINUSE') {
    console.error('端口 ' + PORT + ' 已被占用。换一个：npm run report -- --port 8124');
  } else {
    console.error('启动失败：' + (error && error.message ? error.message : error));
  }
  process.exit(1);
});

server.listen(PORT, '127.0.0.1', () => {
  const url = 'http://127.0.0.1:' + PORT + ENTRY;
  console.log('本地出报告工具已就绪：' + url);
  console.log('报告页：' + TOOL);
  console.log('引擎与页面产物：' + WEB + '（与线上发布的同一份）');
  console.log('资料只在本机浏览器里，不联网、不上传。按 Ctrl+C 结束。');
  if (OPEN) {
    const cmd = process.platform === 'win32' ? 'cmd'
      : process.platform === 'darwin' ? 'open' : 'xdg-open';
    const cmdArgs = process.platform === 'win32' ? ['/c', 'start', '', url] : [url];
    try {
      spawn(cmd, cmdArgs, { stdio: 'ignore', detached: true }).unref();
    } catch {
      console.log('（没能自动打开浏览器，请手动访问上面的地址。）');
    }
  }
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    server.close(() => process.exit(0));
  });
}
