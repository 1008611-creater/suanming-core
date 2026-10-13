import {preserveDrafts} from './form-drafts.js';
import {clueLabel} from './consultation.js';
import {API} from './engine-adapter.js';
import {enhanceReport} from './report-recap.js';
import {renderFutureRecords} from './future-records.js';
const W=API.engine;
const $=id=>document.getElementById(id);
let session=null,state=null,claims=[],dirty=false,running=false,screen='birth',spaceMode='walkway',showContext=false,draftSession=null;
const routes={birth:['01','从你的命盘开始'],past:['02','准不准，核对一下'],action:['03','这周，做点调整'],future:['04','留给未来的记录'],report:['05','带走你的报告']};
const now=()=>new Date().toISOString();
const dayAt=at=>new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(at));
const shiftDay=(day,n)=>new Date(Date.parse(day+'T00:00:00Z')+n*86400000).toISOString().slice(0,10);
const current=()=>state?.past.payload.session??session;
const number=id=>$(id).value.trim()===''?null:Number($(id).value);
function el(tag,text,cls){const node=document.createElement(tag);if(text!==undefined) node.textContent=text;if(cls) node.className=cls;return node;}
function note(text,error=false){ $('notice').hidden=!text;$('notice').textContent=text;$('notice').className='notice no-print'+(error?' error':'');}
function serial(prefix,items){let n=1;while(items.some(x=>(x.payload??x).id===prefix+n)) n++;return prefix+n;}
function option(select,value,label){const o=el('option',label);o.value=String(value);select.append(o);}
function bind(id,handler,type='click'){
$(id).addEventListener(type,async event=>{
event.preventDefault();if(running) return;running=true;
try { await handler(event);}catch(error){note(error.message,true);}finally { running=false;}
});
}
function field(form,id,label,type='text'){
const box=el('div',undefined,'field');const name=el('label',label);name.htmlFor=id;
const input=el(type==='textarea'?'textarea':type==='select'?'select':'input');input.id=id;
if(!['textarea','select'].includes(type)) input.type=type;
box.append(name,input);form.append(box);return input;
}
function dynamicForm(parent,handler){
const form=el('form',undefined,'answer-line');parent.append(form);
form.addEventListener('submit',async event=>{
event.preventDefault();if(running) return;running=true;
try { await handler();dirty=true;await render();note('已保存。离开前记得备份。');}
catch(error){note(error.message,true);}finally { running=false;}
});return form;
}
function keepDrafts(roots){return preserveDrafts($,roots);}
function syncPlace(){const city=$('birthCity'),longitude=$('longitude');city.value=[...city.options].some(o=>o.value===longitude.value)?longitude.value:'custom';$('longitudeBox').hidden=city.value!=='custom';}
function criterion(prefix){ $(prefix+'Criterion').textContent=W.WORKBENCH_EVENTS[$(prefix+'Event').value].criterion;}
function basisList(){
for(const key of ['pastBasis','futureBasis']){
$(key).replaceChildren();for(const c of current().exploratory) option($(key),c.id,clueLabel(c.id));
}
}
function fillBirth(s){
const b=s.birth;$('caseId').value=s.id;$('birthDate').value=[b.year,String(b.month).padStart(2,'0'),String(b.day).padStart(2,'0')].join('-');
$('birthTime').value=String(b.hour).padStart(2,'0')+':'+String(b.minute).padStart(2,'0');
$('gender').value=b.gender;$('longitude').value=b.longitude;$('timeMode').value=s.timeMode;$('sessionDate').value=s.sessionDate;syncPlace();
}
function fillContext(c){
if(!c) return;for(const k of ['goal','applications','interviews','focusMinutes','noiseDb','walkwayM','freeText']) $(k).value=c[k]??'';
$('glare').value=String(c.glare);
}
function canEnter(route){return route==='birth' || (route==='past'?Boolean(current()):Boolean(state));}
function focusWorkspace(){
$('workspace').hidden=false;document.body.dataset.view='workspace';
const r=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
$('workspace').scrollIntoView({behavior:r?'instant':'smooth'});
$('workspaceTitle').focus({preventScroll:true});
}
async function setScreen(route){
if(!Object.hasOwn(routes,route)) return;
if(!canEnter(route)){note(route==='past'?'先生成命盘。':'先生成命盘，再开始前事核对。');focusWorkspace();return;}
screen=route;note('');
if(route==='action'||route==='future'){
const restore=keepDrafts([route==='action'?'planView':'forecastsView']);
if(route==='action')renderPlan();else renderForecasts();
restore();
}
renderNavigation();focusWorkspace();
}
function renderNavigation(){
$('clockNote').textContent='本机时间 '+now()+'；窗口须晚于登记日。此记录不是可信时间戳。';
$('workspace').dataset.screen=screen;
$('workspaceTitle').textContent=routes[screen][1];
$('birthView').hidden=screen!=='birth';
for(const [id,route] of [['pastPanel','past'],['contextPanel','action'],['futurePanel','future'],['scorePanel','report'],['reportView','report']]) $(id).hidden=screen!==route||!canEnter(route);
$('sampleBanner').hidden=!current()?.id.startsWith('SYN-');
$('sampleBanner').textContent=current()?.id==='SYN-TOUR'?'体验示例 · 非个人结果':'虚构资料 · 仅供体验';
document.querySelectorAll('[data-route]').forEach(button=>{
if(button.dataset.route===screen) button.setAttribute('aria-current','step');else button.removeAttribute('aria-current');
const locked=!canEnter(button.dataset.route);button.dataset.locked=String(locked);button.setAttribute('aria-disabled',String(locked));
if(locked)button.title=button.dataset.route==='past'?'先生成命盘':'先开始前事核对';else button.removeAttribute('title');
});
}
const pillarKeys=['year','month','day','hour'],pillarLabels=['年柱','月柱','日柱','时柱'];
const pillarNotes=['出生年份，年界按引擎规则。结合月、日、时一起看。','按出生时节气定月，不直接按公历月。','日干是传统解读的参照，不能据此给性格贴标签。','出生时辰；接近边界时请先核实时间。'];
let atlasKey='day',clueIndex=0;const clueOpens=new Set();
const atlasExample=W.createConsultation({id:'SYN-ATLAS',birth:{year:1995,month:3,day:22,hour:14,minute:30,longitude:120,gender:'male',timezone:'Asia/Shanghai'},timeMode:'clock',sessionDate:'2026-10-08'});
function renderAtlas(){
const root=$('heroAtlas'),key=atlasKey,index=pillarKeys.indexOf(key);
if(!root.firstChild){
const dial=el('div',undefined,'atlas-dial');
function vector(tag,attrs){const n=document.createElementNS('http://www.w3.org/2000/svg',tag);for(const k in attrs)n.setAttribute(k,attrs[k]);return n;}
const svg=vector('svg',{viewBox:'0 0 500 500','aria-hidden':'true'});svg.classList.add('atlas-lines');
for(const r of [237,220,157,105])svg.append(vector('circle',{cx:250,cy:250,r}));
for(let i=0;i<48;i++)svg.append(vector('path',{d:i%4?'M250 16v5':'M250 13v12',transform:'rotate('+i*7.5+' 250 250)'}));
const arc=vector('path',{d:'M102 102 A210 210 0 0 1 398 102'});arc.classList.add('atlas-arc');svg.append(arc);dial.append(svg);
for(const [i,k] of pillarKeys.entries()){const b=el('button',undefined,'atlas-point');b.type='button';b.dataset.pillar=k;b.setAttribute('aria-label',pillarLabels[i]+' '+atlasExample.chart.pillars[k]);b.append(el('small',pillarLabels[i]),el('strong',atlasExample.chart.pillars[k]));dial.append(b);}
dial.append(el('div',undefined,'atlas-center'));const detail=el('div',undefined,'atlas-note');detail.setAttribute('aria-live','polite');root.append(dial,detail);
}
root.dataset.selected=key;root.querySelectorAll('[data-pillar]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.pillar===key)));
root.querySelector('.atlas-center').replaceChildren(el('span',pillarLabels[index]),el('strong',atlasExample.chart.pillars[key]),el('small','天干 · 地支'));
root.querySelector('.atlas-note').replaceChildren(el('strong',pillarLabels[index]+' · '+atlasExample.chart.pillars[key]),el('p',pillarNotes[index]));
}
function renderChart(){
const s=current();$('chartView').replaceChildren();$('chartView').className=s?'':'empty';
if(!s){const waiting=el('div',undefined,'chart-waiting');waiting.setAttribute('aria-hidden','true');for(const label of pillarLabels)waiting.append(el('span',label));$('chartView').append(waiting,el('p','你的四柱，等你来。'));return;}
const grid=el('div',undefined,'pillars');
for(const [i,key] of pillarKeys.entries()){
const item=el('button',undefined,'pillar');item.type='button';item.dataset.chartPillar=key;item.setAttribute('aria-pressed',String(key===atlasKey));item.append(el('small',pillarLabels[i]),el('strong',s.chart.pillars[key]));grid.append(item);
}
const meta=el('details',undefined,'chart-meta');meta.append(el('summary','查看时间口径与引擎来源'),
el('p',s.id+' · '+s.sessionDate+' · '+(s.timeMode==='clock'?'钟表时间':'真太阳时')),
el('p','引擎 '+s.chart.manifest.engineVersion+' / '+s.chart.manifest.ruleSetId),el('p','来源指纹 '+API.ENGINE_INFO.sourceHash));
const next=el('button','用过去的事，核对一下 →','chart-next');next.type='button';next.dataset.route='past';
const detail=el('p',pillarNotes[pillarKeys.indexOf(atlasKey)],'pillar-note');detail.setAttribute('aria-live','polite');
$('chartView').append(grid,detail,meta,next);
}
function answerForm(parent,c,kind){
const existing=state.answers.find(a=>a.id===c.id && a.kind===kind);
if(existing){ parent.append(el('p','已核对：'+(existing.value===null?'不确定':existing.value?'是':'否')+' · '+existing.evidence,'detail-line'));return;}
let value,evidence;
const form=dynamicForm(parent,async()=>{ state=await W.recordPastAnswer(state,{id:c.id,kind,value:value.value==='null'?null:Number(value.value),evidence:evidence.value});});
value=field(form,kind+'-'+c.id+'-answer','核对结果','select');
option(value,'null','不确定');option(value,1,kind==='specific'?'发生':'像');option(value,0,kind==='specific'?'未发生':'不像');
evidence=field(form,kind+'-'+c.id+'-evidence','脱敏证据 / 不确定说明','textarea');evidence.maxLength=2000;
const button=el('button','保存核对','secondary');button.type='submit';form.append(button);
}
function renderPast(){
const root=$('exploratoryView');
root.replaceChildren();$('claimsView').replaceChildren();const s=current();if(!s) return;
for(const [i,c] of s.exploratory.entries()){
const card=el('details',undefined,'item clue-fold'),head=el('summary');head.append(el('h4',clueLabel(c.id)));card.hidden=!!state&&i!==clueIndex;card.open=state?i===clueIndex:clueOpens.has(c.id);if(state)card.className+=' clue-focused';card.addEventListener('toggle',()=>card.open?clueOpens.add(c.id):clueOpens.delete(c.id));const scope=el('details',undefined,'clue-method');scope.id='scope-'+c.id;scope.append(el('summary','依据与核对范围'),el('p',c.statement),el('p',c.counts+'；'+c.doesNotCount,'hint'),el('p',c.uncertainty,'hint'));card.append(head,el('p',c.question),scope);
if(state) answerForm(card,c,'exploratory');root.append(card);
}
if(state&&s.exploratory.length){
const cards=[...root.children],nav=el('nav',undefined,'action-deck clue-nav'),prev=el('button','上一条'),count=el('span',undefined,'hint'),next=el('button','下一条');nav.setAttribute('aria-label','探索线索逐条核对');count.setAttribute('aria-live','polite');prev.type=next.type='button';
function choose(n,focus=false){clueIndex=n;cards.forEach((card,i)=>{card.hidden=i!==n;if(i===n)card.open=true;});count.textContent=(n+1)+' / '+cards.length+' · 已核对 '+state.answers.filter(a=>a.kind==='exploratory').length;prev.disabled=n===0;next.disabled=n===cards.length-1;if(focus)cards[n].querySelector('summary').focus();}
prev.addEventListener('click',()=>choose(clueIndex-1,true));next.addEventListener('click',()=>choose(clueIndex+1,true));nav.append(prev,count,next);root.append(nav);choose(Math.min(clueIndex,cards.length-1));
}
const list=state?state.past.payload.claims:claims;
for(const c of list){
const card=el('article',undefined,'item');card.append(el('h4',W.WORKBENCH_EVENTS[c.eventId].label),el('p',c.windowStart+' → '+c.windowEnd+' · 判断：'+(c.expected===null?'弃权':c.expected?'发生':'未发生')),el('p',W.WORKBENCH_EVENTS[c.eventId].criterion,'hint'),el('p',c.rationale),el('p','引用 '+c.basisIds.map(clueLabel).join('、'),'hint'));
if(state) answerForm(card,c,'specific');
else {const remove=el('button','移除此条','quiet');remove.type='button';remove.addEventListener('click',()=>{claims=claims.filter(x=>x.id!==c.id);dirty=true;renderPast();});card.append(remove);}
$('claimsView').append(card);
}
if(!list.length) $('claimsView').append(el('p','本次未登记具体事件；事件核对数为零。','hint'));
$('claimEntry').hidden=Boolean(state);$('pastContinue').hidden=!state;$('claimFields').disabled=Boolean(state);$('claimForm').hidden=Boolean(state);$('freeze').hidden=Boolean(state);
$('sealNote').textContent=state?'冻结于 '+state.past.payload.frozenAt+' · SHA-256 '+state.past.sha256:'开始核对后判断将锁定；更改需另建档案。';
}
function renderPlan(){
$('planView').replaceChildren();if(!state?.context) return;
for(const [index,a] of state.plan.entries()){
const card=el('details',undefined,'item action-fold'),head=el('summary');card.dataset.action=a.id;card.id=a.id+'-action';card.open=index===0;head.append(el('span',String(index+1).padStart(2,'0'),'action-index'),el('h3',a.title),el('span',a.dueDate,'badge'));card.append(head,el('p',a.trigger));
const steps=el('ol');for(const step of a.steps) steps.append(el('li',step));card.append(steps,el('p',a.metric,'hint'));
const review=state.actionReviews.find(r=>r.id===a.id);
if(review) card.append(el('p','已复盘：'+review.observed+' · '+review.reviewedAt,'detail-line'));
else {
let observed;const form=dynamicForm(card,async()=>{state=await W.reviewAction(state,{id:a.id,observed:observed.value},now());});
observed=field(form,a.id+'-review','试过之后，有什么变化？','textarea');observed.required=true;observed.maxLength=2000;
const button=el('button','记下这次变化','secondary');button.type='submit';button.disabled=dayAt(now())<a.dueDate;form.append(button);
if(button.disabled) form.append(el('p','到 '+a.dueDate+' 可保存复盘。','hint'));
}
$('planView').append(card);
}
}
function renderForecasts(){renderFutureRecords($('forecastsView'),state,{el,field,option,dynamicForm,events:W.WORKBENCH_EVENTS,now,resolve:async value=>{state=await W.resolveForecast(state,value,now());}});}
function renderScores(score){
$('scoreView').replaceChildren();if(!score) return;
const p=score.past,f=score.future,x=score.exploratory;const grid=el('div',undefined,'metric-grid');
for(const [label,value] of [['历史具体判断',`对 ${p.correct} / 错 ${p.incorrect}`],['历史未决与弃权',`待核 ${p.pending} / 不确定 ${p.uncertain} / 弃权 ${p.abstained}`],['未来记录',`已决 ${f.resolved} / 待决 ${f.pending} / 弃权 ${f.abstained}`],['探索线索反馈',`像 ${x.yes} / 不像 ${x.no} / 不确定 ${x.uncertain} / 待核 ${x.pending}`]]){
const item=el('div',undefined,'metric');item.append(el('small',label),el('strong',value));grid.append(item);
}
$('scoreView').append(grid,el('p',f.brier===null?'尚无已决概率事件。':'已决 '+f.resolved+' 条，Brier '+f.brier.toFixed(4)+'（越低越好，仅描述当前样本）。','hint'));
if(f.paired) $('scoreView').append(el('p','同样本对照 '+f.paired+' 条：专家 '+f.pairedBrier.toFixed(4)+' / 基线 '+f.baselineBrier.toFixed(4)+'；不代表预测效力。','hint'));
}
function reportSection(title){const section=el('div',undefined,'report-section');section.append(el('h3',title));$('reportView').append(section);return section;}
function renderReport(score){
const report=$('reportView');report.replaceChildren();report.hidden=screen!=='report'||!state;if(!state) return;
const s=current();report.append(el('p',s.id+' · 咨询 '+s.sessionDate+' · 引擎 '+s.chart.manifest.engineVersion,'report-stamp'));
report.append(el('p','四柱：'+Object.values(s.chart.pillars).join(' · ')+' / '+(s.timeMode==='clock'?'钟表时间':'真太阳时')));
let section=reportSection('一 · 判断怎样核对');
section.append(el('p',`判断：对 ${score.past.correct}，错 ${score.past.incorrect}，待核 ${score.past.pending}，不确定 ${score.past.uncertain}，弃权 ${score.past.abstained}。线索不计事件命中。`));
for(const c of state.past.payload.claims){
const a=state.answers.find(x=>x.kind==='specific'&&x.id===c.id);
section.append(el('h4',W.WORKBENCH_EVENTS[c.eventId].label+' / '+c.windowStart+' 至 '+c.windowEnd),el('p','事前判断：'+(c.expected===null?'弃权':c.expected?'发生':'未发生')+'。'+W.WORKBENCH_EVENTS[c.eventId].criterion),el('p','推断：'+c.rationale+'；引用 '+c.basisIds.map(clueLabel).join('、')),el('p',a?'核对：'+(a.value===null?'不确定':a.value?'发生':'未发生')+'。证据：'+a.evidence:'尚未核对，保留未决。'));
}
section=reportSection('二 · 现状与具体行动');
if(state.context){
const c=state.context;section.append(el('p','目标：'+(c.goal==='change-job'?'换工作':'留任改善')+'。补充：'+(c.freeText||'无')));
for(const a of state.plan){
section.append(el('h4',a.title+' / '+a.dueDate+' 复盘'),el('p','依据：'+a.trigger));
const steps=el('ol');a.steps.forEach(x=>steps.append(el('li',x)));section.append(steps,el('p','评估：'+a.metric));
const r=state.actionReviews.find(x=>x.id===a.id);section.append(el('p','行动结果：'+(r?r.observed:'尚未复盘')));
}
} else section.append(el('p','未填现状，暂无行动建议。'));
section=reportSection('三 · 未来的事前记录');
if(!state.forecasts.length) section.append(el('p','未登记未来判断。'));
for(const sealed of state.forecasts){
const f=sealed.payload,r=state.resolutions.find(x=>x.id===f.id);
section.append(el('h4',W.WORKBENCH_EVENTS[f.eventId].label+' / '+f.windowStart+' 至 '+f.windowEnd),el('p',f.criterion),el('p','登记：'+f.createdAt+'；已见信息：'+f.informationUsed),el('p','依据：'+f.rationale+'；引用 '+f.basisIds.map(clueLabel).join('、')),el('p',f.probability===null?'弃权：'+f.abstentionReason:r?'已结计入：'+(r.outcome?'发生':'未发生')+'；证据：'+r.evidence:'已登记，待结算。'));
}
section=reportSection('四 · 使用边界与记录');
section.append(el('p','命盘是传统参考，预测效力尚未独立验证。行动依据现实目标与测量；前后变化不证明因果。重大决定结合现实证据与专业意见。'),el('p','冻结时刻：'+state.past.payload.frozenAt+'；底稿 SHA-256 '+state.past.sha256),el('p','本机时间与哈希用于复核，不是第三方时间戳或独立双盲。私有档案含出生资料，请妥善保管。','hint'));
enhanceReport(report,state,score,dayAt(now()));
}
function renderActionStudio(){
const c=state?.context;$('planHeading').hidden=!c;$('actionStudio').hidden=!c;$('contextSnapshot').hidden=!c;$('contextForm').hidden=Boolean(c)&&!showContext;if(!c){
$('careerMap').replaceChildren();for(const id of ['careerHeadline','careerReadout','contextGoal','contextSummary']) $(id).textContent='';
$('roomScene').dataset.mode=spaceMode;$('spaceReadout').textContent='先选一处，再测量对照。';return;
}
$('contextGoal').textContent=c.goal==='change-job'?'职业转折 × 居家办公':'留任改善 × 居家办公';
$('contextSummary').textContent='连续专注 '+(c.focusMinutes===null?'未测量':c.focusMinutes+' 分钟')+' · 通道 '+(c.walkwayM===null?'未测量':c.walkwayM+' 米')+' · 噪声 '+(c.noiseDb===null?'未测量':c.noiseDb+' dB');
$('contextToggle').setAttribute('aria-expanded',String(showContext));$('contextToggle').textContent=showContext?'收起我填的情况':'看看我填了什么';
$('careerHeadline').textContent=c.goal==='change-job'?'投了简历没回音？先看卡在哪一步。':'还想留下来？先争取一次具体反馈。';
const map=$('careerMap');map.replaceChildren();
for(const [i,[label,value]] of [['近14天投递',c.applications],['收到回复',null],['近14天面试',c.interviews]].entries()){
if(i)map.append(el('span','→','career-connector'));
const node=el('div',undefined,'career-node');node.append(el('strong',value===null?'未记录':String(value),value===null?'unmeasured':undefined),el('small',label));map.append(node);
}
$('careerReadout').textContent=state.plan.find(a=>a.id.startsWith('career-'))?.trigger+'。回复数待补，暂不判断卡点。';
$('roomScene').dataset.mode=spaceMode;
const detail=spaceMode==='walkway'?(c.walkwayM===null?'通道尚未测量':'记录通道 '+c.walkwayM+' 米'):spaceMode==='glare'?(c.glare===null?'反光尚未记录':c.glare?'记录有屏幕反光':'记录没有明显反光'):(c.noiseDb===null?'噪声尚未测量':'同设备记录 '+c.noiseDb+' dB');
const action=state.plan.find(a=>a.id==='space-'+spaceMode);
$('spaceReadout').textContent=detail+'。'+(action?action.title+'；':'可先补测或保留对照；')+'调整后再测一次。';
document.querySelectorAll('[data-space]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.space===spaceMode)));
}
async function render(){
const s=current(),restore=draftSession===session?keepDrafts(['exploratoryView','claimsView','planView','forecastsView']):()=>{};renderChart();renderPast();renderPlan();renderForecasts();renderActionStudio();restore();draftSession=session;
const score=state?await W.scoreConsultation(state):null;renderScores(score);renderReport(score);
$('birthFields').disabled=!!s;
$('contextFields').disabled=!!state?.context;$('export').disabled=!state;$('print').disabled=!state;
renderNavigation();
}
function probabilityMode(){
const predict=$('forecastMode').value==='predict',box=$('probabilityFields');box.hidden=!predict;box.open=predict;
$('probability').required=predict;$('probabilityOrigin').required=predict;
}
function defaults(){
$('sessionDate').value=dayAt(now());
for(const prefix of ['past','future']){ $(prefix+'Event').replaceChildren();for(const [key,e] of Object.entries(W.WORKBENCH_EVENTS)) option($(prefix+'Event'),key,e.label);criterion(prefix);}
probabilityMode();
}
function clearAll(){
session=null;state=null;claims=[];dirty=false;screen='birth';spaceMode='walkway';showContext=false;draftSession=null;clueIndex=0;clueOpens.clear();
for(const id of ['birthForm','claimForm','contextForm','forecastForm']) $(id).reset();
$('birthCity').value='';$('longitudeBox').hidden=true;$('birthFields').disabled=false;$('claimFields').disabled=false;$('contextFields').disabled=false;defaults();
}
function canDiscard(){return (!dirty&&!window.careerDirty) || window.confirm('还有未备份修改。已保存或放弃，继续？');}
document.addEventListener('click',event=>{
const route=event.target.closest('[data-route]');
if(route && !running) setScreen(route.dataset.route).catch(error=>note(error.message,true));
const space=event.target.closest('[data-space]');if(space){spaceMode=space.dataset.space;renderActionStudio();}
const pillar=event.target.closest('[data-pillar],[data-chart-pillar]');if(pillar){atlasKey=pillar.dataset.pillar??pillar.dataset.chartPillar;renderAtlas();renderChart();document.querySelector(pillar.dataset.pillar?'[data-pillar="'+atlasKey+'"]':'[data-chart-pillar="'+atlasKey+'"]').focus({preventScroll:true});}
const scene=event.target.closest('[data-scene]');if(scene && scene.matches('button')) selectScene(scene.dataset.scene);
});
const sceneKeys=['career','space','future'];
let selectedScene='career';
const sceneCopy={
career:{question:'每天都想辞职，\n真的该走了吗？',intro:'周一还没到，就已经开始累了。',advice:'先找到消耗你的那件事',next:'是做的事不合适，还是相处的人让你累？\n这两个答案，会把你带去不同的下一步。'},
space:{question:'明明在自己家，\n怎么还是静不下来？',intro:'坐在这里，有多久没好好做完一件事了？',advice:'先照顾你每天坐着的地方',next:'看看刺眼的光、绕不开的杂物、打断你的声音。\n从最烦的那一处开始，改完再看。'},
future:{question:'总怕选错，\n就一直不选了吗？',intro:'你想要的下一阶段，具体是什么样子？',advice:'给犹豫一个截止日期',next:'把想验证的事写清楚，约个回来看结果的日子。\n看不清的地方，先给自己留余地。'}
};
let paperAnimation;
function selectScene(key){
if(!Object.hasOwn(sceneCopy,key) || key===selectedScene) return;
selectedScene=key;const copy=sceneCopy[key],slip=$('questionSlip');
$('slipQuestion').textContent=copy.question;$('sceneIntro').textContent=copy.intro;
$('slipAdvice').textContent=copy.advice;$('slipNext').textContent=copy.next;
$('slipIndex').textContent=['壹 / 叁','贰 / 叁','叁 / 叁'][sceneKeys.indexOf(key)];slip.dataset.scene=key;
document.querySelectorAll('button[data-scene]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.scene===key)));
paperAnimation?.cancel();
if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches && typeof slip.animate==='function'){
paperAnimation=slip.animate([{clipPath:'inset(0 8% 0 0)',opacity:.6},{clipPath:'inset(0 0 0 0)',opacity:1}],{duration:460,easing:'cubic-bezier(0.16,1,0.3,1)'});
}
}
bind('turnQuestion',()=>selectScene(sceneKeys[(sceneKeys.indexOf(selectedScene)+1)%sceneKeys.length]));
bind('startJourney',()=>setScreen(current()?screen:'birth'));
bind('contextToggle',()=>{showContext=!showContext;renderActionStudio();});
bind('quickDemo',async()=>{
if(!canDiscard())return;
clearAll();const at=now(),day=dayAt(at);
session=W.createConsultation({id:'SYN-TOUR',birth:{year:1995,month:3,day:22,hour:14,minute:30,longitude:120,gender:'male',timezone:'Asia/Shanghai'},timeMode:'clock',sessionDate:day});
const claim={id:'past-1',eventId:'job-start',windowStart:'2022-01-01',windowEnd:'2024-12-31',expected:1,basisIds:[session.exploratory[0].id],rationale:'合成演示：人工判断，核对为错，非真实预测。'};
state=await W.freezeConsultation(session,[claim],at);
state=await W.recordPastAnswer(state,{id:claim.id,kind:'specific',value:0,evidence:'合成履历：这一窗口没有更换雇主。'});
state=await W.revealContext(state,{goal:'change-job',applications:2,interviews:0,focusMinutes:25,noiseDb:58,walkwayM:.55,glare:true,freeText:'合成示例：想换工作，家中反光、嘈杂，通道窄。'});
state=await W.registerForecast(state,{id:'future-1',eventId:'written-offer',windowStart:shiftDay(day,1),windowEnd:shiftDay(day,31),probability:null,abstentionReason:'合成演示：证据不足，弃权。',basisIds:[session.exploratory[0].id],rationale:'合成演示。',informationUsed:'合成出生、履历、职业与环境资料'},at);
fillBirth(session);basisList();fillContext(state.context);$('futureStart').value=shiftDay(day,1);$('futureEnd').value=shiftDay(day,31);$('informationUsed').value='合成演示资料';
dirty=true;screen='action';await render();note('体验示例：误判1次、弃权1次。');focusWorkspace();
});
bind('demo',async()=>{
if(!canDiscard()) return;clearAll();
fillBirth({id:'SYN-DEMO',birth:{year:1995,month:3,day:22,hour:14,minute:30,longitude:120,gender:'male'},timeMode:'clock',sessionDate:dayAt(now())});
dirty=true;await render();note('已填虚构资料，点击生成命盘。');
});
bind('birthForm',async()=>{
const [year,month,day]=$('birthDate').value.split('-').map(Number),[hour,minute]=$('birthTime').value.split(':').map(Number);
session=W.createConsultation({id:$('caseId').value,birth:{year,month,day,hour,minute,longitude:$('longitude').value,gender:$('gender').value,timezone:'Asia/Shanghai'},timeMode:$('timeMode').value,sessionDate:$('sessionDate').value});
basisList();dirty=true;await render();note('命盘已生成，接着核对前事。');
},'submit');
bind('claimForm',async()=>{
const c={id:serial('past-',claims),eventId:$('pastEvent').value,windowStart:$('pastStart').value,windowEnd:$('pastEnd').value,expected:$('pastExpected').value==='null'?null:Number($('pastExpected').value),basisIds:[$('pastBasis').value],rationale:$('pastRationale').value};
await W.freezeConsultation(session,[...claims,c],now());claims.push(c);dirty=true;$('pastRationale').value='';await render();note('已加入清单，开始核对前可移除。');
},'submit');
bind('freeze',async()=>{
state=await W.freezeConsultation(session,claims,now());dirty=true;
$('futureStart').value=shiftDay(dayAt(now()),1);$('futureEnd').value=shiftDay(dayAt(now()),31);$('informationUsed').value='出生资料；具体事件核对状态在档案中另列';
await render();note('判断已封存。核对完，接着聊当下。');
});
bind('contextForm',async()=>{
const d={goal:$('goal').value,freeText:$('freeText').value,glare:$('glare').value==='null'?null:$('glare').value==='true'};
for(const k of ['applications','interviews','focusMinutes','noiseDb','walkwayM']) d[k]=number(k);
state=await W.revealContext(state,d);dirty=true;$('informationUsed').value='出生资料、当前已保存历史核对、职业与空间现状';await render();note('现状已保存，先试一项行动。');
},'submit');
bind('forecastForm',async()=>{
const predict=$('forecastMode').value==='predict';const p=predict?number('probability'):null;
if(predict&&p===null) throw new Error('请填写研究概率或选择弃权');
const rationale=$('futureRationale').value;
state=await W.registerForecast(state,{id:serial('future-',state.forecasts),eventId:$('futureEvent').value,windowStart:$('futureStart').value,windowEnd:$('futureEnd').value,probability:p,probabilityOrigin:$('probabilityOrigin').value,baselineProbability:predict?number('baseline'):null,baselineOrigin:$('baselineOrigin').value,abstentionReason:predict?null:rationale,basisIds:[$('futureBasis').value],rationale,informationUsed:$('informationUsed').value},now());
dirty=true;await render();note('本条未来记录已冻结，到期核对结果。');
},'submit');
bind('export',async()=>{
const json=await W.exportConsultation(state),url=URL.createObjectURL(new Blob([json],{type:'application/json'}));
const link=el('a');link.href=url;link.download=current().id+'.private.json';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
note('已发起下载，请确认保存。档案含出生资料，请妥善保管。');
});
bind('importFile',async()=>{
const file=$('importFile').files[0];if(!file) return;
try {
if(file.size>2*1024*1024) throw new Error('档案超过2MB');
const restored=await W.importConsultation(await file.text());if(!canDiscard()) return;
clearAll();state=restored;screen='report';session=state.past.payload.session;fillBirth(session);basisList();fillContext(state.context);
$('futureStart').value=shiftDay(dayAt(now()),1);$('futureEnd').value=shiftDay(dayAt(now()),31);$('informationUsed').value='出生资料、已恢复的核对与现状';
await render();note('档案已校验并恢复。');
}catch(error){throw error.name==='SyntaxError'?new Error('文件格式不完整，请选原始备份。当前资料未改动。'):error;}finally { $('importFile').value='';}
},'change');
bind('print',async()=>{renderReport(await W.scoreConsultation(state));window.print();});
bind('reset',async()=>{if(!canDiscard())return;clearAll();await render();note('页面已清空，已导出的文件仍在磁盘。');});
for(const prefix of ['past','future']) $(prefix+'Event').addEventListener('change',()=>criterion(prefix));
$('forecastMode').addEventListener('change',probabilityMode);
$('birthCity').addEventListener('change',()=>{const value=$('birthCity').value;$('longitudeBox').hidden=value!=='custom';$('longitude').value=value==='custom'?'':value;if(value==='custom')$('longitude').focus();});
for(const form of ['birthForm','claimForm','contextForm','forecastForm']) $(form).addEventListener('input',()=>{dirty=true;});
window.addEventListener('beforeunload',event=>{if(dirty){event.preventDefault();event.returnValue='';}});
window.addEventListener('beforeprint',()=>{if(!state){$('reportView').hidden=false;$('reportView').replaceChildren(el('p','先核对前事，再生成报告。'));}});
window.addEventListener('afterprint',renderNavigation);
renderAtlas();defaults();render().catch(error=>note(error.message,true));

export {current,state,session};
