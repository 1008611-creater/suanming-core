export const STEMS = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
export const BRANCHES = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
export function ganzhi(i) { return STEMS[((i%10)+10)%10]+BRANCHES[((i%12)+12)%12]; }
export function sexagenaryDay(jd) { return ganzhi(Math.floor(jd+0.5)+49); }
export function yearPillar(y,m,d,o={}) { const v=o.forcePrevious ? y-1 : (o.yearBoundary==='calendar'?y:(m<2||(m===2&&d<4)?y-1:y)); return ganzhi(v-4); }
export function monthPillar(y,lon=315) { const b=(Math.floor((((lon-315)+360)%360)/30)+2)%12; const s=(((y-4)%10+10)%10%5)*2; return STEMS[(s+b-2+12)%10]+BRANCHES[b]; }
export function dayPillar(jd) { return sexagenaryDay(jd); }
export function hourPillar(dayStem,hourBranch) { const s=STEMS.indexOf(dayStem), b=typeof hourBranch==='number'?hourBranch:BRANCHES.indexOf(hourBranch); return STEMS[((s%5)*2+Math.floor(b/2))%10]+BRANCHES[b]; }
export const hiddenStems={子:['癸'],丑:['己','癸','辛'],寅:['甲','丙','戊'],卯:['乙'],辰:['戊','乙','癸'],巳:['丙','戊','庚'],午:['丁','己'],未:['己','丁','乙'],申:['庚','壬','戊'],酉:['辛'],戌:['戊','辛','丁'],亥:['壬','甲']};
export function tenGod(d,o) { return ['比肩','劫财','食神','伤官','偏财','正财','七杀','正官','偏印','正印'][(STEMS.indexOf(o)-STEMS.indexOf(d)+10)%10]; }
export function luckDirection(yearStem, gender) { return ((STEMS.indexOf(yearStem) % 2 === 0) === (gender === 'male')) ? 1 : -1; }
