export const ENGINE_VERSION = '0.1.0';
export const EPHEMERIS_MODEL = 'VSOP87D+IAU1980+Meeus49';
export const RULE_SET_VERSION = 'bazi-core-0.1.0';
export function createManifest(overrides = {}) {
  return Object.freeze({ engineVersion: ENGINE_VERSION, ephemerisModel: EPHEMERIS_MODEL, ruleSet: RULE_SET_VERSION, ...overrides });
}
