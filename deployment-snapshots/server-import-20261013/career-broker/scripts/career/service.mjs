/** Fixed-provider, stateless career broker. Never logs prompts or credentials. */
import {isIP} from 'node:net';
import {validateCareerPacket} from '../../tools/workbench/career-contract.js';
import {buildCareerRequest,parseCareerResponse,CareerTransportError} from './transport.mjs';
// Project selection, explicitly corrected by the user. No retired SITE provider fallback.
export const CAREER_PROVIDER=Object.freeze({name:'McGrox',model:'deepseek-v4.1-flash',baseUrl:'https://www.mcgrox.top',apiMode:'anthropic',compatibility:'unverified'});
export function careerConfig(env=process.env,enabled=false){
if(!enabled)return {enabled:false};
const apiMode=env.MCGROX_TEXT_API_MODE??CAREER_PROVIDER.apiMode;
if(!['anthropic','responses'].includes(apiMode))throw Error('请明确选择anthropic或responses文字协议。不会自动切换。');
let address,apiKey;
if(apiMode==='anthropic'){
 if(env.MCGROX_API_KEY!==undefined){address=env.MCGROX_BASE_URL??CAREER_PROVIDER.baseUrl;apiKey=env.MCGROX_API_KEY;}
 else{address=env.ANTHROPIC_BASE_URL??CAREER_PROVIDER.baseUrl;apiKey=env.ANTHROPIC_AUTH_TOKEN;}
}else{address=env.MCGROX_BASE_URL??env.OPENAI_BASE_URL;apiKey=env.MCGROX_API_KEY??env.OPENAI_API_KEY;}
let base;try{base=new URL(address);}catch{throw Error('职业咨询的McGrox地址未配置或格式不正确。');}
const path=base.pathname.replace(/\/$/,'');
if(base.protocol!=='https:'||!['mcgrox.top','www.mcgrox.top'].includes(base.hostname)||base.port||base.username||base.password||base.search||base.hash||!(path==='/v1'||apiMode==='anthropic'&&path==='')||typeof apiKey!=='string'||!apiKey||apiKey.length>4096||!/^[!-~]+$/.test(apiKey))throw Error('职业咨询需使用McGrox HTTPS根地址或/v1及对应协议凭据。不会沿用其他渠道。');
return {enabled:true,baseUrl:base.origin+'/v1',apiKey,model:CAREER_PROVIDER.model,apiMode,reasoningEffort:null};
}
class Failure extends CareerTransportError{}
const fail=(status,message)=>{throw new Failure(status,message);};
async function readLimited(stream,limit){let size=0,chunks=[];for await(const chunk of stream){size+=chunk.length;if(size>limit)fail(413,'内容太长，请缩短后重试。');chunks.push(Buffer.from(chunk));}return Buffer.concat(chunks).toString('utf8');}
export function createCareerHandler(config,{fetchImpl=fetch,maxCalls=40,timeoutMs=60000,publicOrigin=null}={}){
let publicHost=null;
if(publicOrigin!==null){
 let url;try{url=new URL(publicOrigin);}catch{throw Error('Invalid production origin.');}
 if(url.protocol!=='https:'||url.origin!==publicOrigin||url.username||url.password||url.pathname!=='/'||url.search||url.hash)throw Error('Production origin must be an exact HTTPS origin.');
 publicHost=url.host;
}
const loopback=new Set(['127.0.0.1','::1','::ffff:127.0.0.1']);
let active=0,calls=0,windowStart=Date.now();const clients=new Map();
return async(req,res)=>{
if(!['/api/career','/api/career/config'].includes(req.url))return false;
res.setHeader('Cache-Control','no-store');res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('X-Content-Type-Options','nosniff');
const send=(status,data)=>{if(!res.destroyed&&!res.writableEnded){res.statusCode=status;res.end(JSON.stringify(data));}};
try{
if(publicHost&&(!loopback.has(req.socket.remoteAddress)||req.headers.host!==publicHost))fail(403,'咨询入口来源不正确。');
if(req.url==='/api/career/config'){if(req.method!=='GET')fail(405,'只接受GET。');send(200,config.enabled?{enabled:true,provider:new URL(config.baseUrl).hostname,model:config.model}:{enabled:false,provider:null,model:null});return true;}
if(req.method!=='POST')fail(405,'只接受POST。');
const expected=publicOrigin??(req.socket.encrypted?'https://':'http://')+req.headers.host;
if(req.headers.origin!==expected||req.headers['x-career-consent']!=='send-reviewed-summary-v1')fail(403,'请先确认本次发送的摘要与模型。');
if(publicHost&&(typeof req.headers['x-real-ip']!=='string'||!isIP(req.headers['x-real-ip'])))fail(403,'咨询入口来源不正确。');
if(!config.enabled)fail(503,'本站职业AI尚未启用，资料没有发送给模型。');
if(!(req.headers['content-type']??'').startsWith('application/json'))fail(415,'需要JSON请求。');
if(Number(req.headers['content-length']??0)>32768)fail(413,'内容太长，请缩短后重试。');
let packet;try{packet=JSON.parse(await readLimited(req,32768));validateCareerPacket(packet);}catch(e){if(e instanceof Failure)throw e;fail(400,'摘要格式不完整，请重新生成。');}
const stamp=Date.now();if(stamp-windowStart>3600000){calls=0;windowStart=stamp;clients.clear();}
const id=publicHost?req.headers['x-real-ip']:req.socket.remoteAddress,client=clients.get(id)??{count:0,start:stamp};if(stamp-client.start>900000){client.count=0;client.start=stamp;}
if(calls>=maxCalls||client.count>=6)fail(429,'这段时间聊得有些密，稍后再继续。');
if(active>=1)fail(429,'山灵正在整理上一条，稍后再试。');
if(clients.size>=256&&!clients.has(id))fail(429,'当前访问较多，稍后再试。');
active++;calls++;client.count++;clients.set(id,client);
const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),timeoutMs);const cancel=()=>{if(!res.writableEnded)controller.abort();};res.on('close',cancel);
try{
const request=buildCareerRequest(config,packet);
const upstream=await fetchImpl(request.url,{method:'POST',headers:request.headers,body:request.body,signal:controller.signal,redirect:'error'});
if(!upstream.ok)fail(upstream.status===429?429:502,upstream.status===429?'模型当前繁忙，稍后再试。':'模型暂时没有完成回答，资料仍在当前页面。');
if(Number(upstream.headers.get('content-length')??0)>262144)fail(502,'模型回答过长，请重试。');
let response;try{response=JSON.parse(await readLimited(upstream.body,262144));}catch{fail(502,'模型回答无法读取，请重试。');}
const result=parseCareerResponse(config,response,packet);
send(200,{result,provider:new URL(config.baseUrl).hostname,model:config.model});
}catch(e){if(controller.signal.aborted)fail(504,'请求已取消或等待超时，当前记录仍保留。');throw e;}finally{clearTimeout(timer);res.off('close',cancel);active--;}
}catch(e){send(e instanceof CareerTransportError?e.status:502,{error:e instanceof CareerTransportError?e.message:'职业咨询暂时不可用，请稍后重试。'});}
return true;
};
}
