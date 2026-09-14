const GANZHI = /^[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥]$/;

export function validateChart(chart) {
  const errors = [];
  if (!chart || chart.schemaVersion !== '1.0.0') errors.push('schemaVersion must be 1.0.0');
  for (const key of ['year','month','day','hour']) if (!GANZHI.test(chart?.pillars?.[key] ?? '')) errors.push(`pillars.${key} is invalid`);
  if (!chart?.manifest?.engineVersion) errors.push('manifest.engineVersion is required');
  if (!Array.isArray(chart?.facts?.facts)) errors.push('facts.facts must be an array');
  return { valid: errors.length === 0, errors };
}
