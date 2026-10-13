/** Explicit provider wire adapters. No credential persistence, protocol fallbacks or retries. */
import {CAREER_PROMPT,CAREER_RESPONSE_SCHEMA,validateCareerPacket,validateCareerResponse} from '../../tools/workbench/career-contract.js';
export class CareerTransportError extends Error{constructor(status,message){super(message);this.status=status;}}
const incomplete=()=>{throw new CareerTransportError(502,'回答尚未完整生成，请重试。');};
export function buildCareerRequest(config,packet){
validateCareerPacket(packet);
const headers={Authorization:'Bearer '+config.apiKey,'Content-Type':'application/json'};
if(config.apiMode==='anthropic'){
 headers['anthropic-version']='2023-06-01';
 const body={model:config.model,max_tokens:4000,stream:false,system:CAREER_PROMPT+'\n仅返回一个完整JSON对象，不要Markdown围栏或额外文字。输出结构必须遵守：'+JSON.stringify(CAREER_RESPONSE_SCHEMA),messages:[{role:'user',content:JSON.stringify(packet)}]};
 return {url:config.baseUrl+'/messages',headers,body:JSON.stringify(body)};
}
if(config.apiMode!==undefined&&config.apiMode!=='responses')throw new CareerTransportError(502,'职业咨询协议配置不可用。');
const body={model:config.model,store:false,input:[{role:'system',content:CAREER_PROMPT},{role:'user',content:JSON.stringify(packet)}],text:{format:{type:'json_schema',name:'career_consultation',strict:true,schema:CAREER_RESPONSE_SCHEMA}},max_output_tokens:4000};
if(config.reasoningEffort)body.reasoning={effort:config.reasoningEffort};
return {url:config.baseUrl+'/responses',headers,body:JSON.stringify(body)};
}
export function parseCareerResponse(config,response,packet){
let text;
try{
 if(config.apiMode==='anthropic'){
  if(!response||response.type!=='message'||response.role!=='assistant'||response.model!==config.model)incomplete();
  if(response.stop_reason==='refusal')throw new CareerTransportError(422,'这次问题超出了职业咨询范围，换成具体工作问题再聊。');
  if(response.stop_reason!=='end_turn'||!Array.isArray(response.content))incomplete();
  if(response.content.some(block=>!block||!['text','thinking','redacted_thinking'].includes(block.type)))incomplete();
  const blocks=response.content.filter(block=>block.type==='text');
  if(!blocks.length||blocks.some(block=>typeof block.text!=='string'))incomplete();
  text=blocks.map(block=>block.text).join('');
 }else{
  if(config.apiMode!==undefined&&config.apiMode!=='responses')incomplete();
  if(!response||(response.status&&response.status!=='completed')||(response.model&&response.model!==config.model))incomplete();
  const output=(response.output??[]).filter(item=>item.type==='message').flatMap(item=>item.content??[]);
  if(output.some(item=>item.type==='refusal'))throw new CareerTransportError(422,'这次问题超出了职业咨询范围，换成具体工作问题再聊。');
  text=output.filter(item=>item.type==='output_text').map(item=>item.text).join('');
 }
 const result=JSON.parse(text);validateCareerResponse(result,packet);return result;
}catch(error){if(error instanceof CareerTransportError)throw error;throw new CareerTransportError(502,'回答缺少可核对依据，未采用这条结果。可以重试。');}
}
