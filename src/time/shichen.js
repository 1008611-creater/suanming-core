import { equationOfTimeMinutes } from '../astro/equation-of-time.js';

export const SHICHEN = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
export function trueSolarMinutes({ hour=0, minute=0, second=0 }, longitude=120, equationOfTime=0) {
  return hour*60 + minute + second/60 + (longitude-120)*4 + equationOfTime;
}
export function shichenOfCivil(civil, longitude=120, options={}) {
  const eot = options.equationOfTimeMinutes ?? 0;
  let m = trueSolarMinutes(civil, longitude, eot);
  m = ((m % 1440) + 1440) % 1440;
  const index = Math.floor((m + 60) / 120) % 12;
  return { name: SHICHEN[index], index, trueSolarMinutes:m, boundaryMinutes: index===0 ? 1380 : (index*120-60), timePrecision: options.timePrecision ?? 'exact' };
}

