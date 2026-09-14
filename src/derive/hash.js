/**
 * 确定性哈希（L4 事实层的基础工具）
 * ---------------------------------------------------------------------------
 * 只依赖纯 JS，不引入 node:crypto，保证同一份代码在浏览器、Edge、Node 里给出同一结果。
 * 用途：给输入与事实图做指纹，让「同输入同输出」可以被外部复算验证，而不是靠信任。
 */

/** 稳定序列化：对象键排序后再序列化，避免键顺序影响指纹。 */
export function stableStringify(value) {
  if (value === null || typeof value !== 'object') return JSON.stringify(value) ?? 'null';
  if (Array.isArray(value)) return '[' + value.map(stableStringify).join(',') + ']';
  return '{' + Object.keys(value).sort()
    .filter(k => value[k] !== undefined)
    .map(k => JSON.stringify(k) + ':' + stableStringify(value[k])).join(',') + '}';
}

/** FNV-1a 64 位（用 BigInt 实现），返回 16 位十六进制。 */
export function fnv1a64(text) {
  const FNV_OFFSET = 0xcbf29ce484222325n;
  const FNV_PRIME = 0x100000001b3n;
  const MASK = 0xffffffffffffffffn;
  let hash = FNV_OFFSET;
  const bytes = new TextEncoder().encode(text);
  for (const byte of bytes) {
    hash ^= BigInt(byte);
    hash = (hash * FNV_PRIME) & MASK;
  }
  return hash.toString(16).padStart(16, '0');
}

/** 32 位版本，用于短指纹展示。 */
export function fnv1a32(text) {
  let hash = 0x811c9dc5;
  const bytes = new TextEncoder().encode(text);
  for (const byte of bytes) {
    hash ^= byte;
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(16).padStart(8, '0');
}

export function hashInput(input) { return fnv1a64(stableStringify(input)); }
export function hashFacts(graph) { return fnv1a64(stableStringify(graph?.facts ?? [])); }
