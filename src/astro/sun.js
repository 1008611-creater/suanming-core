/**
 * 太阳视黄经与节气求解（L1 天文层）
 * ---------------------------------------------------------------------------
 * 参考系链条（每一步都不能省，顺序也不能换）：
 *
 *   VSOP87D 地球日心黄经 L
 *     -> 太阳地心几何黄经   Θ = L + 180°
 *     -> FK5 系统差修正     ΔΘ ≈ -0.09033 角秒
 *     -> 加黄经章动         + Δψ  (IAU1980, 63 项)
 *     -> 加光行差           - 20.4898 / R  角秒
 *     = 太阳视黄经 λ_app
 *
 * 关键陷阱（ADR-0001）：Meeus 第 25 章在算 FK5 修正时定义了一个中间量
 *   λ' = Θ - 1.397°·T - 0.00031°·T²
 * 它只用来求 ΔΘ = -0.09033" + 0.03916"·(cos λ' + sin λ')·tan β 里的 λ'。
 * 如果把 λ' 当成最终黄经输出，2025 年会引入约 0.35° 误差 = 约 8.5 小时。
 * 这是把「中间变量」误当「结果」的经典错误，必须写进回归测试钉死。
 *
 * 单位：内部一律用「度」表示角度，用「儒略日」表示时刻。
 */

import { earthHeliocentricLongitude, earthRadiusVector } from './vsop87.js';
import { nutation, ARCSEC_PER_DEGREE } from './nutation.js';
import { normalizeDegrees, normalizeSignedDegrees } from '../time/julian.js';

/** 角秒 -> 度 */
const AS2DEG = 1 / ARCSEC_PER_DEGREE;

/** FK5 系统差常数项（角秒），Meeus 25.9 在 β≈0 时的退化形式 */
const FK5_DELTA_LONGITUDE_ARCSEC = -0.09033;

/** 光行差常数（角秒·AU），Meeus 25.11 */
const ABERRATION_ARCSEC_AU = -20.4898;

/** 太阳每日平均行度（度/天），用于牛顿迭代的导数初值 */
const MEAN_MOTION_DEG_PER_DAY = 0.98564736;

/**
 * 太阳地心几何黄经（度，[0,360)）。不含章动、不含光行差。
 * @param {number} jde TT 儒略日
 */
export function sunGeometricLongitude(jde) {
  return normalizeDegrees(earthHeliocentricLongitude(jde) * 180 / Math.PI + 180);
}

/**
 * 太阳视黄经（度，[0,360)）。这是排盘真正要用的量。
 * @param {number} jde TT 儒略日
 */
export function sunApparentLongitude(jde) {
  const L = earthHeliocentricLongitude(jde) * 180 / Math.PI;
  const R = earthRadiusVector(jde);
  const dpsi = nutation(jde).dpsi;
  return normalizeDegrees(
    L + 180
    + FK5_DELTA_LONGITUDE_ARCSEC * AS2DEG
    + dpsi
    + (ABERRATION_ARCSEC_AU / R) * AS2DEG
  );
}

/**
 * 太阳视黄经对儒略日的导数（度/天）。用中心差分，步长 0.01 天。
 * 不用固定平均行度，是为了在近日点附近也能正确收敛。
 * @param {number} jde
 */
export function sunLongitudeRate(jde) {
  const h = 0.01;
  const d = normalizeSignedDegrees(sunApparentLongitude(jde + h) - sunApparentLongitude(jde - h));
  return d / (2 * h);
}

/**
 * 求太阳视黄经等于 targetDeg 的时刻（TT 儒略日）。
 *
 * 用牛顿迭代 + 解析导数回退。收敛判据 1e-9 度，约等于 1e-4 秒。
 * 迭代最多 30 次；若未收敛则抛出，绝不静默返回一个错值。
 *
 * @param {number} targetDeg 目标视黄经（度）
 * @param {number} approxJD 初值（TT 儒略日）
 * @returns {number} TT 儒略日
 */
export function solveSunLongitude(targetDeg, approxJD) {
  let jde = approxJD;
  const tol = 1e-9;
  for (let i = 0; i < 30; i++) {
    const diff = normalizeSignedDegrees(sunApparentLongitude(jde) - targetDeg);
    if (Math.abs(diff) < tol) return jde;
    const rate = sunLongitudeRate(jde) || MEAN_MOTION_DEG_PER_DAY;
    jde -= diff / rate;
  }
  throw new Error('solveSunLongitude did not converge for target ' + targetDeg + ' from JD ' + approxJD);
}

/** 供测试与文档引用：光行差修正量（角秒） */
export function aberrationArcsec(jde) {
  return ABERRATION_ARCSEC_AU / earthRadiusVector(jde);
}

export { FK5_DELTA_LONGITUDE_ARCSEC, MEAN_MOTION_DEG_PER_DAY };
