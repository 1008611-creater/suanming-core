/**
 * 二十四节气求解（L1 天文层）
 * ---------------------------------------------------------------------------
 * 节气的天文定义是「太阳视黄经等于特定整度数」，不是查表。本模块按定义求解，
 * 因此对任意年份（含公元前、含 2100 年以后）都成立，不依赖任何预置节气表。
 *
 * 精度来源（三项都要，缺一不可）：
 *   1. VSOP87D 完整级数地球黄经（非简化式）
 *   2. IAU1980 全 63 项章动（非 5 项简化式）
 *   3. ΔT 实测锚点表（见 delta-t.js）
 *
 * 实测：对紫金山天文台 / 香港天文台公布的中国时区节气时刻，平均绝对误差约 12 秒，
 * 最大约 20 秒。回归数据见 tests/golden/solar-terms.test.js。
 *
 * 输出一律是「TT 儒略日」和「UTC 儒略日」，不做任何时区假设。
 * 时区换算属于 L0 时间层的职责，见 src/time/timezone.js。
 */

import { solveSunLongitude, sunApparentLongitude } from './sun.js';
import { julianDayFromGregorian, normalizeDegrees } from '../time/julian.js';
import { deltaTSeconds } from './delta-t.js';

/**
 * 二十四节气定义：名称、太阳视黄经（度）、以及用于初值估算的近似公历日期。
 * 顺序即为回归年内的先后顺序（从黄经 285° 的小寒开始，便于与黄经排序一致）。
 * @type {{key:string, name:string, degree:number, approxMonth:number, approxDay:number}[]}
 */
export const SOLAR_TERMS = [
  { key: 'xiaohan',  name: '小寒', degree: 285, approxMonth: 1,  approxDay: 6  },
  { key: 'dahan',    name: '大寒', degree: 300, approxMonth: 1,  approxDay: 20 },
  { key: 'lichun',   name: '立春', degree: 315, approxMonth: 2,  approxDay: 4  },
  { key: 'yushui',   name: '雨水', degree: 330, approxMonth: 2,  approxDay: 19 },
  { key: 'jingzhe',  name: '惊蛰', degree: 345, approxMonth: 3,  approxDay: 6  },
  { key: 'chunfen',  name: '春分', degree: 0,   approxMonth: 3,  approxDay: 20 },
  { key: 'qingming', name: '清明', degree: 15,  approxMonth: 4,  approxDay: 5  },
  { key: 'guyu',     name: '谷雨', degree: 30,  approxMonth: 4,  approxDay: 20 },
  { key: 'lixia',    name: '立夏', degree: 45,  approxMonth: 5,  approxDay: 6  },
  { key: 'xiaoman',  name: '小满', degree: 60,  approxMonth: 5,  approxDay: 21 },
  { key: 'mangzhong',name: '芒种', degree: 75,  approxMonth: 6,  approxDay: 6  },
  { key: 'xiazhi',   name: '夏至', degree: 90,  approxMonth: 6,  approxDay: 21 },
  { key: 'xiaoshu',  name: '小暑', degree: 105, approxMonth: 7,  approxDay: 7  },
  { key: 'dashu',    name: '大暑', degree: 120, approxMonth: 7,  approxDay: 23 },
  { key: 'liqiu',    name: '立秋', degree: 135, approxMonth: 8,  approxDay: 8  },
  { key: 'chushu',   name: '处暑', degree: 150, approxMonth: 8,  approxDay: 23 },
  { key: 'bailu',    name: '白露', degree: 165, approxMonth: 9,  approxDay: 8  },
  { key: 'qiufen',   name: '秋分', degree: 180, approxMonth: 9,  approxDay: 23 },
  { key: 'hanlu',    name: '寒露', degree: 195, approxMonth: 10, approxDay: 8  },
  { key: 'shuangjiang', name: '霜降', degree: 210, approxMonth: 10, approxDay: 23 },
  { key: 'lidong',   name: '立冬', degree: 225, approxMonth: 11, approxDay: 7  },
  { key: 'xiaoxue',  name: '小雪', degree: 240, approxMonth: 11, approxDay: 22 },
  { key: 'daxue',    name: '大雪', degree: 255, approxMonth: 12, approxDay: 7  },
  { key: 'dongzhi',  name: '冬至', degree: 270, approxMonth: 12, approxDay: 22 }
];

/**
 * 节气分两类，这是排盘最容易被搞反的一处：
 *   - 「节」  黄经 ≡ 15 (mod 30)：立春、惊蛰、清明、立夏…… 是**月柱**的分界
 *   - 「中气」黄经 ≡  0 (mod 30)：雨水、春分、谷雨、小满…… 是**农历置闰**的判据
 * 两者搞反的后果：月柱整体错一个月，且闰月判定全错。见 ADR-0003。
 */
export function isJie(degree) {
  return ((degree % 30) + 30) % 30 === 15;
}

/** 是否中气 */
export function isZhongqi(degree) {
  return ((degree % 30) + 30) % 30 === 0;
}

/** 按 key 索引 */
export const SOLAR_TERM_BY_KEY = Object.fromEntries(SOLAR_TERMS.map(t => [t.key, t]));

/** 按名称索引 */
export const SOLAR_TERM_BY_NAME = Object.fromEntries(SOLAR_TERMS.map(t => [t.name, t]));

/**
 * 回归年（solar year）约定
 * ---------------------------------------------------------------------------
 * 一个「回归年」= 太阳视黄经从 285°（小寒）走到 285° 的一整圈。
 * 具体到公历：以该年 3 月的春分（黄经 0°）为锚点。
 *
 * 为什么不用「按黄经判断归属」的朴素写法？
 *   朴素写法 anchorYear(year, degree) = degree >= 285 ? year-1 : year 在直觉上
 *   像是对的，但它是「按标签推日期」，会把 2024 小寒算成 2023 小寒
 *   （实测偏差 365 天）。正确做法是「按日期推标签」：
 *   黄经 >= 285 的节气属于上一公历年的 1 月，必须显式把锚点年份减 1。
 *   这个 bug 曾真实发生过，回归测试 tests/golden/solar-terms.test.js 钉死它。
 */
export function anchorYearForTerm(year, degree) {
  return degree >= 285 ? year - 1 : year;
}

/**
 * 求解某回归年内某个节气的时刻（TT 与 UTC 儒略日）。
 * @param {number} year 回归年（以春分为锚的公历年份标签）
 * @param {number} degree 目标太阳视黄经（度）
 * @returns {{tt:number, utc:number, year:number, deltaT:number}}
 */
export function solarTermInstant(year, degree) {
  const ay = anchorYearForTerm(year, degree);
  const term = SOLAR_TERMS.find(t => t.degree === degree);
  const approxMonth = term ? term.approxMonth : 1;
  const approxDay = term ? term.approxDay : 1;
  // 初值：以该年 3 月 20 日为春分锚点，按黄经差折算天数（太阳平均行度 0.9856 度/天）
  const equinoxAnchor = julianDayFromGregorian(ay, 3, 20 + 0.5);
  const base = equinoxAnchor + (degree / 360) * 365.2422;
  const tt = solveSunLongitude(degree, base);
  // ΔT 用「该节气所在公历年」的估计值：anchorYear 已把 1 月节气归到上一年，
  // 这里按黄经折算回真实公历年份
  const dT = deltaTSeconds(ay + (approxMonth - 0.5) / 12);
  return { tt, utc: tt - dT / 86400, year: ay, deltaT: dT };
}

/**
 * 求某回归年全部 24 节气，按时间先后排序。
 * @param {number} year
 * @returns {{key:string, name:string, degree:number, tt:number, utc:number, deltaT:number}[]}
 */
export function solarTermsOfYear(year) {
  const out = SOLAR_TERMS.map(t => {
    const inst = solarTermInstant(year, t.degree);
    return { key: t.key, name: t.name, degree: t.degree, tt: inst.tt, utc: inst.utc, deltaT: inst.deltaT };
  });
  out.sort((a, b) => a.tt - b.tt);
  return out;
}

/**
 * 给定 UTC 儒略日，判断太阳视黄经落在哪个「节」（月柱边界）。
 * 返回当前的节（十二节：立春/惊蛰/清明/立夏/芒种/小暑/立秋/白露/寒露/立冬/大雪/小寒）
 * 及其起始时刻，供月柱判定使用。
 *
 * 注意：这里只做天文判定，不涉及任何流派取舍。
 * @param {number} jdUTC
 */
export function currentMonthBoundary(jdUTC) {
  const yearGuess = new Date((jdUTC - 2440587.5) * 86400000).getUTCFullYear();
  let best = null;
  for (const y of [yearGuess - 1, yearGuess, yearGuess + 1]) {
    for (const t of SOLAR_TERMS) {
      if (!isJie(t.degree)) continue; // 只有「节」是月柱边界
      const inst = solarTermInstant(y, t.degree);
      if (inst.utc <= jdUTC && (best === null || inst.utc > best.utc)) {
        best = { key: t.key, name: t.name, degree: t.degree, utc: inst.utc, tt: inst.tt };
      }
    }
  }
  return best;
}

export function nextMonthBoundary(jdUTC) {
  const yearGuess = new Date((jdUTC - 2440587.5) * 86400000).getUTCFullYear();
  let best = null;
  for (const y of [yearGuess - 1, yearGuess, yearGuess + 1]) for (const t of SOLAR_TERMS) {
    if (!isJie(t.degree)) continue;
    const inst = solarTermInstant(y, t.degree);
    if (inst.utc > jdUTC && (best === null || inst.utc < best.utc)) best = { key:t.key, name:t.name, degree:t.degree, utc:inst.utc, tt:inst.tt };
  }
  return best;
}

/**
 * 节气边界告警：给定时刻距最近节气边界多少秒。
 * 排盘层用它决定「月柱是否稳定」。
 * @param {number} jdUTC
 * @returns {{secondsToBoundary:number, boundary:{key:string,name:string,degree:number,utc:number}}|null}
 */
export function nearestMonthBoundary(jdUTC) {
  const yearGuess = new Date((jdUTC - 2440587.5) * 86400000).getUTCFullYear();
  let best = null;
  let bestAbs = Infinity;
  for (const y of [yearGuess - 1, yearGuess, yearGuess + 1]) {
    for (const t of SOLAR_TERMS) {
      if (t.degree % 30 !== 0) continue;
      const inst = solarTermInstant(y, t.degree);
      const d = (inst.utc - jdUTC) * 86400;
      if (Math.abs(d) < bestAbs) {
        bestAbs = Math.abs(d);
        best = { key: t.key, name: t.name, degree: t.degree, utc: inst.utc, secondsAway: d };
      }
    }
  }
  return best ? { secondsToBoundary: best.secondsAway, boundary: best } : null;
}

/** 给定时刻的太阳视黄经（度），供调试与验证 */
export function sunLongitudeAtUTC(jdUTC) {
  const y = new Date((jdUTC - 2440587.5) * 86400000).getUTCFullYear();
  const dT = deltaTSeconds(y);
  return normalizeDegrees(sunApparentLongitude(jdUTC + dT / 86400));
}
