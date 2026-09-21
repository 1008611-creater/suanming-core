/**
 * 版本常量与版本区间判定
 * ---------------------------------------------------------------------------
 * 版本号只在这里定义一次，manifest 与规则集审计都从这里取，避免两处漂移。
 * 同时提供最小可用的版本区间判定（">=A <B" 形式），
 * 让每个规则集能声明「我是为哪个引擎版本写的」，并在审计时被强制执行。
 */

export const ENGINE_VERSION = '0.6.0';
export const EPHEMERIS_MODEL = 'VSOP87D+IAU1980+Meeus49';
export const SCHEMA_VERSION = '1.0.0';

/** 解析 x.y.z 或 x.y.z-pre，失败返回 null。 */
export function parseVersion(value) {
  const m = /^(\d+)\.(\d+)\.(\d+)(?:[-+]([0-9A-Za-z.-]+))?$/.exec(String(value).trim());
  if (!m) return null;
  return { major: Number(m[1]), minor: Number(m[2]), patch: Number(m[3]), pre: m[4] ?? null };
}

/** 版本比较：a < b 返回 -1，相等 0，a > b 返回 1。 */
export function compareVersions(a, b) {
  const pa = parseVersion(a), pb = parseVersion(b);
  if (!pa) throw new Error('invalid version: ' + a);
  if (!pb) throw new Error('invalid version: ' + b);
  for (const key of ['major', 'minor', 'patch']) {
    if (pa[key] !== pb[key]) return pa[key] < pb[key] ? -1 : 1;
  }
  if (pa.pre === pb.pre) return 0;
  if (pa.pre === null) return 1;
  if (pb.pre === null) return -1;
  return pa.pre < pb.pre ? -1 : 1;
}

/**
 * 版本区间判定。支持空格分隔的多个比较式：">=0.2.0 <0.4.0"。
 * 任何无法解析的区间一律返回 false —— 宁可判为不兼容，也不静默放过。
 */
export function satisfiesRange(range, version) {
  const terms = String(range ?? '').trim().split(/\s+/).filter(Boolean);
  if (!terms.length) return false;
  for (const term of terms) {
    const m = /^(>=|<=|>|<|==|=)?\s*(.+)$/.exec(term);
    const op = m[1] ?? '=';
    if (!parseVersion(m[2])) return false;
    const c = compareVersions(version, m[2]);
    const ok = op === '>=' ? c >= 0
      : op === '<=' ? c <= 0
      : op === '>' ? c > 0
      : op === '<' ? c < 0
      : c === 0;
    if (!ok) return false;
  }
  return true;
}
