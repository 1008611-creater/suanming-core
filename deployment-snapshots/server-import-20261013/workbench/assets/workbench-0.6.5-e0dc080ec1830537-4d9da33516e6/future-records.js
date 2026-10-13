export function futureStatus(f,resolution,at){return f.probability===null?'abstained':resolution?'resolved':Date.parse(at)>Date.parse(f.settleAfter)?'ready':'pending';}
export function renderFutureRecords(root,state,{el,field,option,dynamicForm,events,now,resolve}){
root.replaceChildren();if(!state)return;
for(const sealed of state.forecasts){const f=sealed.payload,result=state.resolutions.find(r=>r.id===f.id),status=futureStatus(f,result,now()),card=el('article',undefined,'item capsule-card');card.dataset.status=status;
const head=el('div',undefined,'capsule-tag');head.append(el('h4',events[f.eventId].label),el('strong',{abstained:'弃权 · 不作结论',resolved:'已核对',ready:'到期 · 可以核对',pending:'等待核对'}[status]));card.append(head,el('p',f.windowStart+' 至 '+f.windowEnd,'capsule-date'));
card.append(el('p',status==='abstained'?f.abstentionReason:result?('结果：'+(result.outcome?'发生':'未发生')+'。'+result.evidence):'观察至 '+f.settleAfter.slice(0,10)+(status==='pending'?'，结束后再核对。':''),'detail-line'));
const details=el('details',undefined,'record-details');details.id=f.id+'-record';details.append(el('summary','查看事前判断与冻结依据'),el('p',f.criterion),el('p',f.rationale),el('p','引用 '+f.basisIds.join('、'),'hint'),el('p','已见信息：'+f.informationUsed,'hint'),el('p','编号 '+f.id+' · 登记 '+f.createdAt+' · 指纹 '+sealed.sha256,'hint'));
if(f.probability!==null)details.append(el('p','可核对时间：'+f.settleAfter,'hint'),el('p','未校准研究概率 '+f.probability+' · '+f.probabilityOrigin+(f.baselineProbability===null?'':' / 对照 '+f.baselineProbability+' · '+f.baselineOrigin),'hint'));card.append(details);
if(status==='ready'){let outcome,evidence;const form=dynamicForm(card,async()=>resolve({id:f.id,outcome:Number(outcome.value),evidence:evidence.value}));
outcome=field(form,f.id+'-outcome','到期结果','select');option(outcome,1,'发生');option(outcome,0,'未发生');evidence=field(form,f.id+'-evidence','脱敏证据与事件日期','textarea');evidence.required=true;evidence.maxLength=2000;
const button=el('button','凭证结算','secondary');button.type='submit';button.disabled=status!=='ready';form.append(button);}
root.append(card);}
if(!state.forecasts.length)root.append(el('p','还没有留给未来的记录。没把握，也可以写下“暂时不知道”。','hint'));
}
