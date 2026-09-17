/**
 * 真太阳时与时辰（L0 时间层）
 * ---------------------------------------------------------------------------
 * 真太阳时 = 平太阳时（北京时间）+ 经度差修正 + 均时差。
 *
 * 两项修正都不能省，量级也相当：
 *   - 经度差：每分钟 0.25°。(经度 − 120°) × 4 分钟。喀什约 −176 分钟。
 *   - 均时差：全年 −14.2 分钟（2 月中）到 +16.4 分钟（11 月初）。
 *     东部城市经度修正很小，此时均时差反而是主导项，且足以跨一个时辰。
 *
 * 曾经的缺陷（已修）：规则集自己写明了「真太阳时 = 平太阳时 + 经度修正 + 均时差」，
 * 但本函数只做经度修正、均时差默认取 0，而 castBazi 从未传入该选项。
 * 结果 2 月中旬前后（均时差最负）出生者的时柱会整体错一个时辰。
 * 现在均时差在缺省时**自行计算**，不再依赖调用方记得传参。
 * 显式传入 options.equationOfTimeMinutes 仍然优先，供对比研究/回放使用。
 */
import { equationOfTimeMinutes } from '../astro/equation-of-time.js';
import { utcToTT } from '../astro/moon.js';
import { julianDayFromGregorian } from './julian.js';
import { civilToUTC, CHINA_ZONE } from './timezone.js';

export const SHICHEN = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];

/** 平太阳时（钟表读数）→ 真太阳时（分钟，0 点为 0）。 */
export function trueSolarMinutes({ hour=0, minute=0, second=0 }, longitude=120, equationOfTime=0) {
  return hour*60 + minute + second/60 + (longitude-120)*4 + equationOfTime;
}

/**
 * 某民用时刻的均时差（分钟）。
 *
 * 均时差变化很慢（最大约 30 秒/天），因此这里对 UTC 时刻的精度要求很低；
 * 但仍走正规的「时区 → UTC 儒略日 → TT 儒略日」链条，避免自行拼日期。
 *
 * 边界处理：
 *   - 缺少年月日（例如只给 {hour, minute} 的边界测试）→ 返回 0，退回纯经度修正。
 *   - 夏令时空洞等非法时刻 → 用公历字段直接构造近似儒略日，不抛错。
 *     误差以小时计，对均时差的影响在 10 秒量级，不影响时辰判定。
 *
 * @param {{year?:number,month?:number,day?:number,hour?:number,minute?:number,second?:number}} civil
 * @param {string} zone IANA 时区名
 * @returns {number} 均时差分钟数
 */
export function equationOfTimeForCivil(civil, zone = CHINA_ZONE) {
  const { year, month, day } = civil ?? {};
  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) return 0;
  let jdUTC;
  try {
    jdUTC = civilToUTC(civil, zone).jdUTC;
  } catch {
    const hour = civil.hour ?? 0, minute = civil.minute ?? 0, second = civil.second ?? 0;
    jdUTC = julianDayFromGregorian(year, month, day + (hour*3600 + minute*60 + second) / 86400);
  }
  return equationOfTimeMinutes(utcToTT(jdUTC));
}

/**
 * 民用时刻 → 时辰。
 * @param {object} civil 民用钟表读数
 * @param {number} longitude 出生地东经度数
 * @param {{timePrecision?:string, equationOfTimeMinutes?:number, timezone?:string}} options
 */
export function shichenOfCivil(civil, longitude=120, options={}) {
  const eot = options.equationOfTimeMinutes
    ?? equationOfTimeForCivil(civil, options.timezone ?? CHINA_ZONE);
  let m = trueSolarMinutes(civil, longitude, eot);
  m = ((m % 1440) + 1440) % 1440;
  const index = Math.floor((m + 60) / 120) % 12;
  return {
    name: SHICHEN[index], index, trueSolarMinutes: m,
    equationOfTimeMinutes: eot,
    boundaryMinutes: index===0 ? 1380 : (index*120-60),
    timePrecision: options.timePrecision ?? 'exact'
  };
}
