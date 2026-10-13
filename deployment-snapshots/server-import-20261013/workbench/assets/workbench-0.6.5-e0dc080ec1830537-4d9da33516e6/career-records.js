/** Separate private career archive. SHA detects accidental changes, not trusted time. */
import {CAREER_VERSION,validateCareerPacket,validateCareerResponse} from './career-contract.js';
const need=ok=>{if(!ok)throw Error('职业备份未通过完整性核验，原记录保留。');};
const obj=(v,keys)=>need(v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).length===keys.length&&keys.every(k=>Object.hasOwn(v,k)));
const short=(v,max)=>need(typeof v==='string'&&v.trim().length>0&&v.length<=max);
const instant=v=>need(typeof v==='string'&&/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(v)&&Number.isFinite(Date.parse(v)));
export function validateCareerRecord(r){
obj(r,['sessionKey','question','includeChart','rounds','review']);short(r.sessionKey,180);short(r.question,1200);need(typeof r.includeChart==='boolean');need(Array.isArray(r.rounds)&&r.rounds.length>=1&&r.rounds.length<=2);
for(const [i,round] of r.rounds.entries()){obj(round,['packet','result','provider','model','at']);validateCareerPacket(round.packet);validateCareerResponse(round.result,round.packet);short(round.provider,150);short(round.model,150);instant(round.at);need(round.packet.question===r.question&&round.packet.phase===(i===0?'question':'plan'));if(!r.includeChart)need(!round.packet.sources.some(s=>s.kind==='traditional'));if(i){const first=r.rounds[0];need(round.at>=first.at);need(JSON.stringify(round.packet.followups)===JSON.stringify(first.result.questions));need(JSON.stringify(round.packet.sources.filter(s=>!s.id.startsWith('answer-')))===JSON.stringify(first.packet.sources));need(round.provider===first.provider&&round.model===first.model);}}
if(r.review!==null){need(r.rounds.length===2);obj(r.review,['observed','at']);short(r.review.observed,2000);instant(r.review.at);need(r.review.at>=r.rounds[1].at);}return r;
}
async function digest(payload){return [...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify(payload))))].map(n=>n.toString(16).padStart(2,'0')).join('');}
export async function exportCareer(record){validateCareerRecord(record);return JSON.stringify({format:'zhuanji-career-private',version:CAREER_VERSION,payload:record,sha256:await digest(record)},null,2);}
export async function importCareer(json){need(typeof json==='string'&&json.length<=262144);let data;try{data=JSON.parse(json);}catch{throw Error('这份职业备份无法读取，请选择原始JSON文件。');}obj(data,['format','version','payload','sha256']);need(data.format==='zhuanji-career-private'&&data.version===CAREER_VERSION);need(data.sha256===await digest(data.payload));validateCareerRecord(data.payload);return structuredClone(data.payload);}

export function appendCareerRound(record,round,sessionKey){
const next=round.packet.phase==='question'?{sessionKey,question:round.packet.question,includeChart:round.packet.sources.some(s=>s.kind==='traditional'),rounds:[structuredClone(round)],review:null}:{...structuredClone(record),rounds:[...structuredClone(record.rounds),structuredClone(round)]};
validateCareerRecord(next);return next;
}

export async function restoreCareerForSession(file,getSession,getKey){
const generation=getSession();need(file.size<=262144);const restored=await importCareer(await file.text());if(generation!==getSession())return null;if(restored.sessionKey!==getKey())throw Error('这段对话属于另一份命盘，请先恢复对应的普通档案。');return restored;
}

export function careerRestoreGate(getSession,getKey){let ticket=0;return async file=>{const own=++ticket;const result=await restoreCareerForSession(file,getSession,getKey);return own===ticket?result:null;};}
