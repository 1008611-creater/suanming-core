/**
 * 均时差（Equation of Time，L1 天文层）
 * ---------------------------------------------------------------------------
 * 均时差 = 真太阳时 - 平太阳时。它有两个成因，量级同阶，都不能省：
 *   1. 地球轨道偏心率（一年一次的正弦，振幅约 ±7.7 分钟）
 *   2. 黄赤交角（一年两次的正弦，振幅约 ±9.9 分钟）
 * 两者叠加的结果：全年极值约 -14.2 分钟（2 月中旬）与 +16.4 分钟（11 月初）。
 *
 * 为什么排盘必须算它？
 *   中国幅员跨 5 个时区，但全国统一用北京时间（东经 120° 的平太阳时）。
 *   新疆喀什（东经 75.99°）的当地真太阳时比北京时间晚约 2 小时 56 分。
 *   若用北京时间直接定时辰，喀什出生的人几乎必然错一个甚至两个时辰。
 *   本模块与 src/time/shichen.js 的经度修正合起来，才是完整的「真太阳时」。
 *
 * 精度：与 Meeus 例 28.b 吻合到 0.001 分钟（约 0.06 秒）。
 */

import { sunApparentLongitude } from './sun.js';
import { trueObliquity, nutationInLongitude } from './nutation.js';
import { julianCenturies, normalizeDegrees } from '../time/julian.js';

const DEG = Math.PI / 180;

/**
 * 太阳平黄经 L0（度）。Meeus 28.2，用 τ = T/10 的高阶级数。
 * @param {number} jde TT 儒略日
 */
export function sunMeanLongitude(jde) {
  const T = julianCenturies(jde);
  const tau = T / 10;
  const tau2 = tau * tau, tau3 = tau2 * tau, tau4 = tau3 * tau, tau5 = tau4 * tau;
  return normalizeDegrees(
    280.4664567 + 360007.6982779 * tau + 0.03032028 * tau2
    + tau3 / 49931 - tau4 / 15300 - tau5 / 2000000
  );
}

/**
 * 太阳视赤经（度）。由视黄经 λ 与真黄赤交角 ε 经球面三角求得。
 * @param {number} jde TT 儒略日
 */
export function sunApparentRightAscension(jde) {
  const lambda = sunApparentLongitude(jde) * DEG;
  const eps = trueObliquity(jde) * DEG;
  const alpha = Math.atan2(Math.cos(eps) * Math.sin(lambda), Math.cos(lambda));
  return normalizeDegrees(alpha / DEG);
}

/**
 * 均时差（分钟）。正值表示真太阳时快于平太阳时。
 * @param {number} jde TT 儒略日
 */
export function equationOfTimeMinutes(jde) {
  const L0 = sunMeanLongitude(jde);
  const alpha = sunApparentRightAscension(jde);
  const eps = trueObliquity(jde);
  const dpsi = nutationInLongitude(jde);
  // Meeus 28.1：E = L0 - 0.0057183° - α + Δψ·cos ε
  let e = L0 - 0.0057183 - alpha + dpsi * Math.cos(eps * DEG);
  // 归一到 (-180, 180]，再换成分钟（1° = 4 分钟）
  e = ((e + 180) % 360 + 360) % 360 - 180;
  return e * 4;
}

/** 均时差（秒） */
export function equationOfTimeSeconds(jde) {
  return equationOfTimeMinutes(jde) * 60;
}
