/** Read-only recap of saved records. No interpretation or prediction is generated here. */
const installed=new WeakSet(),views=new WeakMap(),printing=new WeakSet();
export function reportNext(state){const reviewed=new Set(state.actionReviews.map(x=>x.id));return state.plan.filter(x=>!reviewed.has(x.id)).slice().sort((a,b)=>a.dueDate.localeCompare(b.dueDate))[0]??null;}
export function enhanceReport(root,state,score,day){
const doc=root.ownerDocument,win=doc.defaultView;let view=views.get(root);if(view?.id!==state.past.sha256){view={id:state.past.sha256,open:new Set()};views.set(root,view);}
const node=(tag,text,cls)=>{const n=doc.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
const recap=node('section',undefined,'report-recap no-print'),next=reportNext(state);
recap.append(node('h2','这次，先带走这些。'));
const facts=node('dl',undefined,'report-facts');
for(const [label,text] of [['前事核对',`对 ${score.past.correct} · 错 ${score.past.incorrect} · 待核 ${score.past.pending} · 不确定 ${score.past.uncertain} · 弃权 ${score.past.abstained}`],['未来记录',`已决 ${score.future.resolved} · 待决 ${score.future.pending} · 弃权 ${score.future.abstained}`]]){const row=node('div');row.append(node('dt',label),node('dd',text));facts.append(row);}recap.append(facts,node('p','这里只回顾已登记的结果，不代表预测效力。','hint'));
const step=node('div',undefined,'report-next');
step.append(node('h3',next?(next.dueDate<=day?'到了回看这一步的时候。':'接下来，先做这一件。'):(state.context?'行动都已复盘，看看留下了什么。':'先说说眼下的情况。')));
if(next){step.append(node('p',next.title,'report-next-title'),node('p',next.steps[0]),node('p',next.metric,'hint'),node('p',(next.dueDate<=day?'已到复盘日期：':'约好回来看看：')+next.dueDate,'hint'));}
else step.append(node('p',state.context?'已保存的变化都在下面。需要观察新情况，可以另开一份记录。':'还没有职业与空间现状，这次暂不生成行动建议。'));
const act=node('button',next?.dueDate<=day?'去记下变化':'回到行动页面','secondary');act.type='button';act.dataset.route='action';if(next)act.dataset.actionTarget=next.id;step.append(act);recap.append(step);
const tools=node('div',undefined,'report-tools');
for(const [id,label] of [['export','保存私有档案'],['print','打印完整报告']]){const button=node('button',label,'secondary');button.type='button';button.addEventListener('click',()=>doc.getElementById(id).click());tools.append(button);}recap.append(tools,node('p','档案含出生资料，请留在自己手里。打印会展开完整记录。','hint'));
root.prepend(recap);
for(const [index,section] of [...root.querySelectorAll('.report-section')].entries()){
const fold=node('details',undefined,'report-fold'),summary=node('summary'),heading=section.firstElementChild;summary.textContent=heading.textContent.replace(/^[一二三四] · /,'');heading.remove();fold.append(summary,...section.childNodes);section.replaceWith(fold);fold.open=view.open.has(index);fold.addEventListener('toggle',()=>{if(fold.isConnected&&!printing.has(win))fold.open?view.open.add(index):view.open.delete(index);});}
if(!installed.has(win)){installed.add(win);let open=[];
win.addEventListener('beforeprint',()=>{printing.add(win);open=[...doc.querySelectorAll('#reportView .report-fold')].map(f=>[f,f.open]);for(const [fold] of open)fold.open=true;});
win.addEventListener('afterprint',()=>{for(const [fold,value] of open)if(fold.isConnected)fold.open=value;open=[];win.setTimeout(()=>printing.delete(win),0);});}
}
