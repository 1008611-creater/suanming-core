/**
 * 儒略日 / 公历 互转（L0 时间层的基础工具）
 * ---------------------------------------------------------------------------
 * 算法取自 Meeus《Astronomical Algorithms》第 2 版 第 7 章。
 * 采用整数部分 + 小数部分的写法，避免大数相减导致的精度损失。
 *
 * 约定：
 *   - 所有 JD 均为「UTC 儒略日」，即 JD_UTC = JD_TT - ΔT/86400。
 *   - 时间层内部一律使用 JD，不用 JS Date 做算术（Date 在 1970 年前后有坑）。
 *   - JD 起点为 -4712-01-01 12:00 UT（儒略历）。
 */

/** J2000.0 历元 */
export const J2000 = 2451545.0;

/** Unix 纪元 1970-01-01T00:00:00Z 对应的儒略日 */
export const JD_UNIX_EPOCH = 2440587.5;

/** 儒略世纪长度（天） */
export const JULIAN_CENTURY = 36525.0;

/** 儒略千年长度（天） */
export const JULIAN_MILLENNIUM = 365250.0;

/** 一天中的秒数 */
export const SECONDS_PER_DAY = 86400;

/**
 * 公历（格里历/儒略历自动切换）转儒略日。
 * @param {number} year 天文纪年（公元前为负数或 0）
 * @param {number} month 1-12
 * @param {number} day 可含小数（1.5 表示当月 1 日 12:00）
 * @returns {number} 儒略日
 */
export function julianDayFromGregorian(year, month, day) {
  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  // 1582-10-15 之后使用格里历
  const isGregorian = year > 1582 ||
    (year === 1582 && (month > 10 || (month === 10 && day >= 15)));
  const a = Math.floor(y / 100);
  const b = isGregorian ? 2 - a + Math.floor(a / 4) : 0;
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524.5;
}

/**
 * 由年月日时分秒（UTC）求儒略日。
 * @param {{year:number, month:number, day:number, hour?:number, minute?:number, second?:number, millisecond?:number}} parts
 */
export function julianDayFromUTC(parts) {
  const { year, month, day } = parts;
  const hour = parts.hour ?? 0;
  const minute = parts.minute ?? 0;
  const second = parts.second ?? 0;
  const millisecond = parts.millisecond ?? 0;
  const dayFraction = (hour + minute / 60 + (second + millisecond / 1000) / 3600) / 24;
  return julianDayFromGregorian(year, month, day + dayFraction);
}

/**
 * 儒略日转公历（UTC）。
 * @param {number} jd
 * @returns {{year:number, month:number, day:number, hour:number, minute:number, second:number, millisecond:number}}
 */
export function utcFromJulianDay(jd) {
  const z = Math.floor(jd + 0.5);
  const f = jd + 0.5 - z;
  let a = z;
  if (z >= 2299161) {
    const alpha = Math.floor((z - 1867216.25) / 36524.25);
    a = z + 1 + alpha - Math.floor(alpha / 4);
  }
  const b = a + 1524;
  const c = Math.floor((b - 122.1) / 365.25);
  const d = Math.floor(365.25 * c);
  const e = Math.floor((b - d) / 30.6001);
  const dayWithFraction = b - d - Math.floor(30.6001 * e) + f;
  const day = Math.floor(dayWithFraction);
  const month = e < 14 ? e - 1 : e - 13;
  const year = month > 2 ? c - 4716 : c - 4715;

  // 用整数秒再拆分，避免 0.1+0.2 类的浮点残留
  let totalSeconds = Math.round((dayWithFraction - day) * SECONDS_PER_DAY);
  let extraDays = 0;
  if (totalSeconds >= SECONDS_PER_DAY) {
    totalSeconds -= SECONDS_PER_DAY;
    extraDays = 1;
  }
  const hour = Math.floor(totalSeconds / 3600);
  const minute = Math.floor((totalSeconds % 3600) / 60);
  const second = totalSeconds % 60;

  if (extraDays === 1) {
    // 极少触发：仅当四舍五入把时刻推到次日
    const next = julianDayFromGregorian(year, month, day + 1);
    return utcFromJulianDay(next + totalSeconds / SECONDS_PER_DAY);
  }
  return { year, month, day, hour, minute, second, millisecond: 0 };
}

/** JS Date → JD */
export function julianDayFromDate(date) {
  return date.getTime() / 86400000 + JD_UNIX_EPOCH;
}

/** JD → JS Date（注意：Date 精度约 1ms，只用于展示，不用于天文计算） */
export function dateFromJulianDay(jd) {
  return new Date((jd - JD_UNIX_EPOCH) * 86400000);
}

/** JD 归一化到 [0, 1) 的日内小数 */
export function dayFraction(jd) {
  return ((jd + 0.5) % 1 + 1) % 1;
}

/** JD → 儒略世纪数（相对 J2000.0，TT 尺度） */
export function julianCenturies(jde) {
  return (jde - J2000) / JULIAN_CENTURY;
}

/** JD → 儒略千年数（相对 J2000.0，TT 尺度） */
export function julianMillennia(jde) {
  return (jde - J2000) / JULIAN_MILLENNIUM;
}

/** 把角度归一到 [0, 360) */
export function normalizeDegrees(deg) {
  return ((deg % 360) + 360) % 360;
}

/** 把角度差归一到 (-180, 180] */
export function normalizeSignedDegrees(deg) {
  return ((deg + 180) % 360 + 360) % 360 - 180;
}
