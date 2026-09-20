/**
 * 将可部署网页同步到工作区根目录的 app/ 镜像。
 * app/ 不是第二套实现，只有 web/ 生成物可以进入镜像。
 */
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, relative } from 'node:path';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE = resolve(ROOT, 'web');
const TARGET = resolve(ROOT, '..', 'app');

mkdirSync(TARGET, { recursive: true });

for (const entry of readdirSync(SOURCE, { withFileTypes: true })) {
  if (!entry.isFile()) continue;
  cpSync(resolve(SOURCE, entry.name), resolve(TARGET, entry.name));
}

// 这些文件属于旧的双算法入口，明确清除，避免静态服务器继续误引用。
for (const stale of ['bazi.js', 'build-static.js', 'profile.json', 'probe.txt']) {
  const path = resolve(TARGET, stale);
  if (existsSync(path)) rmSync(path);
}

console.log(`[mirror] ${relative(ROOT, TARGET)} synchronized from web/`);
