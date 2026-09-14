import { moonPhaseJDE } from '../astro/moon.js';
import { julianDayFromGregorian, dateFromJulianDay } from '../time/julian.js';
import { solarTermsOfYear } from '../astro/solar-terms.js';

/**
 * 农历天文事实层（L2）
 * ---------------------------------------------------------------------------
 * 只输出天文可验证的量：朔日、月份区间、中气归属、月份编号与闰月标记。
 * 历书排版、节气显示留给上层。
 *
 * 两个关键约定（否则会整体错一天）：
 *   1. 一个农历月从「包含朔时刻的那一天」开始，而不是从朔的瞬间开始。
 *      朔可能发生在当天任意时刻，按瞬间切分会把当天算进上个月。
 *   2. 日序按民用日相减，不按儒略日小数相减。
 *
 * 编号规则（ADR-0003）：含冬至（黄经 270°）的月固定为十一月；
 * 其余月份自该锚点向前后逐月推排，逢十二进一；不含中气的月为闰月，
 * 沿用前一月月序并标记 leap。
 */

const CHINA_OFFSET_DAYS = 8 / 24;

/** 把儒略日转成中国民用日的「日期序号」（当日 0 时，用于日差计算）。 */
function chinaCivilDateNumber(jd) {
  const d = dateFromJulianDay(jd + CHINA_OFFSET_DAYS);
  return julianDayFromGregorian(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate());
}

/** 收集覆盖 [startJd, endJd] 的朔日（已对齐到中国民用日）。 */
function newMoonCivilAnchors(startJd, endJd) {
  const startYear = dateFromJulianDay(startJd + CHINA_OFFSET_DAYS).getUTCFullYear();
  const out = [];
  const base = Math.floor((startYear - 2000) * 12.3685);
  for (let k = base - 3; k < base + 40; k++) {
    const jd = moonPhaseJDE(k, 0);
    if (!Number.isFinite(jd)) continue;
    const day = chinaCivilDateNumber(jd);
    if (day >= startJd - 35 && day <= endJd + 35) out.push({ k, jd, day });
  }
  const unique = new Map(out.map(a => [a.day, a]));
  return [...unique.values()].sort((a, b) => a.day - b.day);
}

/**
 * 收集落在 [startDay, endDay) 内的中气（黄经为 30° 的整数倍）。
 * 参数与返回值都用「中国民用日序号」比较，而不是原始时刻——
 * 中气可能发生在北京时间当天深夜，其 UTC 时刻仍属前一天，按时刻比较会错开一整天。
 */
export function zhongqiTermsBetween(startDay, endDay) {
  const y = dateFromJulianDay(startDay + CHINA_OFFSET_DAYS).getUTCFullYear();
  const terms = [];
  for (const yy of [y - 1, y, y + 1, y + 2]) {
    for (const t of solarTermsOfYear(yy)) {
      if (t.degree % 30 !== 0) continue;
      const civilDay = chinaCivilDateNumber(t.utc);
      if (civilDay >= startDay && civilDay < endDay) terms.push({ ...t, civilDay });
    }
  }
  const unique = new Map(terms.map(t => [t.degree + ':' + t.civilDay, t]));
  return [...unique.values()].sort((a, b) => a.utc - b.utc);
}

/**
 * 构建并编号覆盖 [startJd, endJd] 的农历月。
 * 编号锚点取区间内第一个含冬至的月，该月为十一月。
 */
function numberedMonthsCovering(startJd, endJd) {
  const anchors = newMoonCivilAnchors(startJd, endJd);
  if (anchors.length < 2) throw new Error('insufficient new moon anchors');
  const months = anchors.slice(0, -1).map((a, i) => {
    const endJd = anchors[i + 1].day;
    const zhongqi = zhongqiTermsBetween(a.day, anchors[i + 1].day);
    return {
      jd: a.day,
      newMoonJd: a.jd,
      endJd,
      zhongqiDegrees: zhongqi.map(t => t.degree),
      hasZhongqi: zhongqi.length > 0
    };
  });

  const anchorIndex = months.findIndex(m => m.zhongqiDegrees.includes(270));
  if (anchorIndex < 0) throw new Error('cannot locate winter solstice month');

  const result = months.map(m => ({ ...m }));
  result[anchorIndex].monthNumber = 11;
  result[anchorIndex].leap = false;
  result[anchorIndex].isSolsticeMonth = true;

  for (let i = anchorIndex + 1; i < result.length; i++) {
    const leap = !result[i].hasZhongqi && !result[i - 1].leap;
    const prev = result[i - 1].monthNumber;
    result[i].leap = leap;
    result[i].monthNumber = leap ? prev : (prev % 12) + 1;
  }
  // 反向推排：闰月沿用「前一月」的月序，因此闰月的月序 = 后一月的月序 − 1；
  // 非闰月若其后一月是闰月，则与该闰月同序。
  const previousNumber = (n) => ((n - 2 + 12) % 12) + 1;
  for (let i = anchorIndex - 1; i >= 0; i--) {
    const next = result[i + 1];
    const leap = !result[i].hasZhongqi && !next.leap;
    result[i].leap = leap;
    result[i].monthNumber = next.leap ? next.monthNumber : previousNumber(next.monthNumber);
  }
  return result;
}

/** 覆盖某公历年的农历月（含前后各一个月的余量，便于跨年查询）。 */
export function numberedLunarMonths(year) {
  const start = julianDayFromGregorian(year, 1, 1);
  const end = julianDayFromGregorian(year + 1, 1, 1);
  return numberedMonthsCovering(start, end)
    .filter(m => m.jd >= start && m.jd < end)
    .map(m => ({ ...m, leapCandidate: !m.hasZhongqi }));
}

/** 朔日锚点（保留原始接口，返回对齐到民用日之前的原始朔时刻）。 */
export function lunarMonthAnchors(year) {
  const start = julianDayFromGregorian(year, 1, 1);
  const end = julianDayFromGregorian(year + 1, 1, 1);
  return newMoonCivilAnchors(start, end).map(a => ({ k: a.k, jd: a.jd, day: a.day }));
}

export function lunarDayFromNewMoon(jd, anchorJd) {
  return Math.round(chinaCivilDateNumber(jd) - chinaCivilDateNumber(anchorJd)) + 1;
}

/** 区间内是否存在中气。参数为原始儒略日时刻，内部转换为中国民用日后比较。 */
export function monthHasZhongqi(startJd, endJd) {
  return zhongqiTermsBetween(chinaCivilDateNumber(startJd), chinaCivilDateNumber(endJd)).length > 0;
}

export function annotateLunarMonths(year) {
  const start = julianDayFromGregorian(year, 1, 1);
  const end = julianDayFromGregorian(year + 1, 1, 1);
  return numberedMonthsCovering(start, end)
    .filter(m => m.jd >= start && m.jd < end)
    .map(m => ({ ...m, leapCandidate: !m.hasZhongqi }));
}

/** 公历日期 → 农历月序、日序与闰月标记。 */
export function lunarDateOf(year, month, day) {
  const jd = julianDayFromGregorian(year, month, day);
  // 窗口必须足够宽以包含一个冬至月作为编号锚点（约 13 个月）。
  const months = numberedMonthsCovering(jd - 200, jd + 200);
  const found = months.find(m => jd >= m.jd && jd < m.endJd);
  if (!found) return null;
  return {
    monthNumber: found.monthNumber,
    leap: found.leap,
    day: jd - found.jd + 1,
    hasZhongqi: found.hasZhongqi,
    monthStartJd: found.jd,
    newMoonJd: found.newMoonJd
  };
}
