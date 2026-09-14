/**
 * 月球相位求解（L1 天文层）
 * ---------------------------------------------------------------------------
 * 采用 Meeus《Astronomical Algorithms》第 2 版第 49 章「Phases of the Moon」。
 * 该方法是「以 k 为自变量的相位级数」：k 为整数时对应新月（朔），k+0.25 上弦，
 * k+0.5 满月（望），k+0.75 下弦。
 *
 * 为什么用第 49 章而不是第 47 章（月球位置）？
 *   第 49 章直接给相位时刻，避免了「求根 + 60 项摄动表」的组合误差，
 *   且 Meeus 给出的最大误差约 17 秒（TT），对农历定朔完全够用。
 *   第 47 章的 60 项表转录量大、出错风险高，收益却不明显。
 *
 * 输出为 TT 儒略日（JDE）。转 UTC 需减去 ΔT/86400，见 src/time/。
 *
 * 验证：tests/golden/lunar-calendar.test.js 用 1950-2030 年春节日期与闰月年份回归。
 */

import { deltaTSeconds } from './delta-t.js';

/** 朔望月平均长度（天），Meeus 49.1 */
export const SYNODIC_MONTH = 29.530588861;

/** 一个回归年含多少个朔望月 */
export const MONTHS_PER_YEAR = 12.3685;

const DEG = Math.PI / 180;

/** 归一到 [0,360) */
function norm360(x) { return ((x % 360) + 360) % 360; }

/**
 * 相位级数：以 k 为自变量求相位时刻（TT 儒略日）。
 * @param {number} k 整数=朔，+0.25 上弦，+0.5 望，+0.75 下弦
 * @param {0|1|2|3} phase 0=朔 1=上弦 2=望 3=下弦
 * @returns {number} JDE（TT）
 */
export function moonPhaseJDE(k, phase) {
  const T = k / 1236.85;
  const T2 = T * T, T3 = T2 * T, T4 = T3 * T;

  // Meeus 49.1：相位时刻的平值
  let jde = 2451550.09766 + SYNODIC_MONTH * k
    + 0.00015437 * T2 - 0.000000150 * T3 + 0.00000000073 * T4;

  // 基本角（Meeus 47.1-47.5 的相位版本）
  const E = 1 - 0.002516 * T - 0.0000074 * T2;
  const M = norm360(2.5534 + 29.10535670 * k - 0.0000014 * T2 - 0.00000011 * T3);
  const Mp = norm360(201.5643 + 385.81693528 * k + 0.0107582 * T2 + 0.00001238 * T3 - 0.000000058 * T4);
  const F = norm360(160.7108 + 390.67050284 * k - 0.0016118 * T2 - 0.00000227 * T3 + 0.000000011 * T4);
  const Om = norm360(124.7746 - 1.56375588 * k + 0.0020672 * T2 + 0.00000215 * T3);

  const sin = (d) => Math.sin(d * DEG);
  const cos = (d) => Math.cos(d * DEG);

  // 周期项系数表：每行 [M'系数, M系数, F系数, 系数]
  // phase 0/2（朔/望）与 phase 1/3（弦）使用不同的系数集
  let c = 0;
  if (phase === 0 || phase === 2) {
    const isNew = phase === 0;
    const table = [
      [1,0,0, isNew ? -0.40720 : -0.40614],
      [0,1,0, isNew ?  0.17241 :  0.17302],
      [2,0,0, isNew ?  0.01608 :  0.01614],
      [0,0,2, isNew ?  0.01039 :  0.01043],
      [1,-1,0, isNew ?  0.00739 :  0.00734],
      [1,1,0, isNew ? -0.00514 : -0.00515],
      [0,2,0, isNew ?  0.00208 :  0.00209],
      [1,0,-2, isNew ? -0.00111 : -0.00111],
      [1,0,2, isNew ? -0.00057 : -0.00057],
      [2,1,0, isNew ?  0.00056 :  0.00056],
      [3,0,0, isNew ? -0.00042 : -0.00042],
      [0,1,2, isNew ?  0.00042 :  0.00042],
      [0,1,-2, isNew ?  0.00038 :  0.00038],
      [2,-1,0, isNew ? -0.00024 : -0.00024],
      [0,0,0, isNew ? -0.00017 : -0.00017],
      [1,2,0, isNew ? -0.00007 : -0.00007],
      [2,0,-2, isNew ?  0.00004 :  0.00004],
      [0,3,0, isNew ?  0.00004 :  0.00004],
      [1,1,-2, isNew ?  0.00003 :  0.00003],
      [2,0,2, isNew ?  0.00003 :  0.00003],
      [1,1,2, isNew ? -0.00003 : -0.00003],
      [1,-1,2, isNew ?  0.00003 :  0.00003],
      [1,-1,-2, isNew ? -0.00002 : -0.00002],
      [3,1,0, isNew ? -0.00002 : -0.00002],
      [4,0,0, isNew ?  0.00002 :  0.00002]
    ];
    for (const [a, b, d, coef] of table) {
      let term = coef * sin(a * Mp + b * M + d * F);
      if (Math.abs(b) === 1) term *= E;
      else if (Math.abs(b) === 2) term *= E * E;
      c += term;
    }
    c += -0.00017 * sin(Om);
  } else {
    const table = [
      [1,0,0,-0.62801],
      [0,1,0, 0.17172],
      [1,1,0,-0.01183],
      [2,0,0, 0.00862],
      [0,0,2, 0.00804],
      [1,-1,0, 0.00454],
      [0,2,0, 0.00204],
      [1,0,-2,-0.00180],
      [1,0,2,-0.00070],
      [3,0,0,-0.00040],
      [2,-1,0,-0.00034],
      [0,1,2, 0.00032],
      [0,1,-2, 0.00032],
      [1,2,0,-0.00028],
      [2,1,0, 0.00027],
      [0,0,0,-0.00017],
      [1,-1,-2,-0.00005],
      [2,0,2, 0.00004],
      [1,1,2,-0.00004],
      [1,-2,0, 0.00004],
      [1,1,-2, 0.00003],
      [0,3,0, 0.00003],
      [2,0,-2, 0.00002],
      [1,-1,2, 0.00002],
      [3,1,0,-0.00002]
    ];
    for (const [a, b, d, coef] of table) {
      let term = coef * sin(a * Mp + b * M + d * F);
      if (Math.abs(b) === 1) term *= E;
      else if (Math.abs(b) === 2) term *= E * E;
      c += term;
    }
    // 弦月的 W 修正项（Meeus 49.3）
    const Wc = 0.00306 - 0.00038 * E * cos(M) + 0.00026 * cos(Mp)
      - 0.00002 * cos(Mp - M) + 0.00002 * cos(Mp + M) + 0.00002 * cos(2 * F);
    c += (phase === 1) ? Wc : -Wc;
  }

  // 行星摄动附加项（Meeus 49.4，A1..A14）
  const A = [
    [299.77, 0.107408, -0.009173],
    [251.88, 0.016321, 0],
    [251.83, 26.651886, 0],
    [349.42, 36.412478, 0],
    [ 84.66, 18.206239, 0],
    [141.74, 53.303771, 0],
    [207.14,  2.453732, 0],
    [154.84,  7.306860, 0],
    [ 34.52, 27.261239, 0],
    [207.19,  0.121824, 0],
    [291.34,  1.844379, 0],
    [161.72, 24.198154, 0],
    [239.56, 25.513099, 0],
    [331.55,  3.592518, 0]
  ];
  const AC = [0.000325, 0.000165, 0.000164, 0.000126, 0.000110, 0.000062, 0.000060,
    0.000056, 0.000047, 0.000042, 0.000040, 0.000037, 0.000035, 0.000023];
  for (let i = 0; i < A.length; i++) {
    const ang = A[i][0] + A[i][1] * k + A[i][2] * T2;
    c += AC[i] * sin(ang);
  }

  return jde + c;
}

/** 由公历年份估算 k（该年附近的朔望序号） */
export function kFromYear(year) {
  return Math.round((year - 2000) * MONTHS_PER_YEAR);
}

/**
 * 求给定公历年份（近似）范围内所有新月时刻（TT 儒略日）。
 * @param {number} year
 * @param {number} [pad] 前后各扩展多少个月
 * @returns {number[]} 升序 JDE（TT）
 */
export function newMoonsNearYear(year, pad = 2) {
  const k0 = kFromYear(year - 1);
  const k1 = kFromYear(year + 1);
  const out = [];
  for (let k = k0 - pad; k <= k1 + pad; k++) out.push(moonPhaseJDE(k, 0));
  out.sort((a, b) => a - b);
  return out;
}

/**
 * 求 [jdeStart, jdeEnd]（TT）区间内的新月时刻。
 * @param {number} jdeStart
 * @param {number} jdeEnd
 * @returns {number[]}
 */
export function newMoonsBetween(jdeStart, jdeEnd) {
  const midYear = 2000 + (jdeStart - 2451545.0) / 365.2425;
  const k0 = Math.floor((jdeStart - 2451550.09766) / SYNODIC_MONTH) - 3;
  const k1 = Math.ceil((jdeEnd - 2451550.09766) / SYNODIC_MONTH) + 3;
  const out = [];
  for (let k = k0; k <= k1; k++) {
    const jde = moonPhaseJDE(k, 0);
    if (jde >= jdeStart && jde <= jdeEnd) out.push(jde);
  }
  void midYear;
  return out;
}

/** TT 儒略日 → UTC 儒略日（用 ΔT 估算） */
export function ttToUTC(jde) {
  const year = 2000 + (jde - 2451545.0) / 365.2425;
  return jde - deltaTSeconds(year) / 86400;
}

/** UTC 儒略日 → TT 儒略日 */
export function utcToTT(jdUTC) {
  const year = 2000 + (jdUTC - 2451545.0) / 365.2425;
  return jdUTC + deltaTSeconds(year) / 86400;
}

export { norm360 };
