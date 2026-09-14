import { moonPhaseJDE } from '../astro/moon.js';
import { julianDayFromGregorian } from '../time/julian.js';

// 以朔望月和中气反推；返回天文层事实，复杂农历显示由上层格式化。
export function lunarMonthAnchors(year) {
  const start = julianDayFromGregorian(year, 1, 1);
  const end = julianDayFromGregorian(year + 1, 1, 1);
  const out=[];
  for(let k=Math.floor((year-2000)*12.3685)-2;k<Math.floor((year-2000)*12.3685)+15;k++) {
    const jd=moonPhaseJDE(k,0); if(jd>=start-35 && jd<=end+35) out.push({k,jd});
  }
  return out.sort((a,b)=>a.jd-b.jd);
}
export function lunarDayFromNewMoon(jd, anchorJd) { return Math.floor(jd-anchorJd)+1; }
