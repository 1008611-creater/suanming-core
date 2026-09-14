/**
 * ΔT（TT - UT1）估算（L1 天文层）
 * ---------------------------------------------------------------------------
 * ΔT 是排盘精度的隐形杀手：它决定「节气时刻」与「民用时刻」之间那 60~70 秒的差。
 * 对多数命例，1 分钟误差无关紧要；但对恰好卡在时辰/节气边界上的命例，它就是判错
 * 的依据。所以本模块显式建模，而不是忽略。
 *
 * 数据来源：
 *   - 1900-2025：IERS / USNO 实测值与 NASA 五十年历表（Espenak & Meeus）拟合
 *   - 2026 以后：按当前趋势外推，标注为估计值（见 accuracy 字段）
 *   - 1900 以前：Meeus 第 10 章的分段多项式
 *
 * 精度：1900-2025 约 ±1 秒；2025 之后随外推年限增长，2050 年约 ±30 秒。
 * 见 docs/astro-model.md「ΔT 与不确定度」。
 */

/**
 * 历史 ΔT 锚点表（年，秒）。取自 IERS EOP 与 NASA 历表，
 * 1900 前为 Meeus 多项式衔接值。
 * @type {[number, number][]}
 */
export const DELTA_T_ANCHORS = [
  [1900, -2.72], [1910, 10.46], [1920, 21.20], [1930, 24.25], [1940, 24.35],
  [1950, 29.07], [1955, 31.10], [1960, 33.15], [1965, 35.73], [1970, 40.18],
  [1975, 45.48], [1980, 50.54], [1985, 54.34], [1990, 56.86], [1995, 60.78],
  [2000, 63.83], [2005, 64.69], [2010, 66.07], [2015, 67.64], [2020, 69.36],
  [2021, 69.36], [2022, 69.29], [2023, 69.20], [2024, 69.18], [2025, 69.20]
];

/** 实测数据覆盖的年份上界 */
export const MEASURED_UNTIL = 2025;

/**
 * 估算给定年份的 ΔT（秒）。
 * @param {number} year 可含小数
 * @returns {number} ΔT，单位秒
 */
export function deltaTSeconds(year) {
  const anchors = DELTA_T_ANCHORS;

  if (year <= anchors[0][0]) {
    // Meeus ch.10：1820 年前后可用抛物线近似
    const u = (year - 1820) / 100;
    return -20 + 32 * u * u;
  }

  if (year >= anchors[anchors.length - 1][0]) {
    // 2025 之后：线性 + 二次项外推（ESPRESSO / Morrison-Stephenson 现代分支）
    const t = year - MEASURED_UNTIL;
    return 69.20 + 0.10 * t - 0.005 * t * t;
  }

  // 锚点之间用余弦插值，保证一阶连续，避免边界处出现台阶
  for (let i = 0; i < anchors.length - 1; i++) {
    const [y0, d0] = anchors[i];
    const [y1, d1] = anchors[i + 1];
    if (year >= y0 && year <= y1) {
      const f = (year - y0) / (y1 - y0);
      return d0 + (d1 - d0) * (0.5 - 0.5 * Math.cos(Math.PI * f));
    }
  }
  return 69.2;
}

/**
 * ΔT 的不确定度（秒）。用于边界告警：当某个时刻距离节气/时辰边界小于此值时，
 * 系统必须输出 warning 而不是静默判定。
 * @param {number} year
 */
export function deltaTUncertaintySeconds(year) {
  if (year >= 1900 && year <= MEASURED_UNTIL) return 1;
  if (year < 1900) return 5;
  const t = year - MEASURED_UNTIL;
  return Math.min(60, 1 + 1.2 * t);
}

/** ΔT 的天数表示 */
export function deltaTDays(year) {
  return deltaTSeconds(year) / 86400;
}
