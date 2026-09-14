import { hashInput } from './derive/hash.js';
import { DEFAULT_BAZI_RULE_SET, getRuleSet } from '../rules/index.js';
import { ENGINE_VERSION, EPHEMERIS_MODEL, SCHEMA_VERSION } from './version.js';

/**
 * 版本清单：任何上层结果都必须携带。
 * 没有清单的输出无法回答「这是哪个引擎、哪份星历、哪套规则算出来的」，因此视为无效结果。
 */
export { ENGINE_VERSION, EPHEMERIS_MODEL, SCHEMA_VERSION };
export const DEFAULT_RULE_SET_ID = DEFAULT_BAZI_RULE_SET;
export const RULE_SET_VERSION = getRuleSet(DEFAULT_BAZI_RULE_SET).version;
/** 兼容旧名：早期版本只有 ruleSet 字段。 */
export const RULE_SET = DEFAULT_BAZI_RULE_SET;

export function createManifest(overrides = {}) {
  const ruleSetId = overrides.ruleSetId ?? DEFAULT_RULE_SET_ID;
  const ruleSet = getRuleSet(ruleSetId);
  return Object.freeze({
    engineVersion: ENGINE_VERSION,
    ephemerisModel: EPHEMERIS_MODEL,
    schemaVersion: SCHEMA_VERSION,
    ruleSet: ruleSetId,
    ruleSetVersion: ruleSet.version,
    ruleSetHash: ruleSet.hash ?? null,
    ...overrides
  });
}

/** 生成带输入指纹的清单，供结果复算比对。 */
export function manifestForInput(input, overrides = {}) {
  return createManifest({ inputHash: hashInput(input), ...overrides });
}
