/** Display-only action focus. */
export const actionGroup=id=>id.startsWith('career-')?'career':'space';
export function mountActionDeck(doc=document,win=window){
const get=id=>doc.getElementById(id),root=get('planView'),nav=get('actionDeck'),note=get('actionDeckNote'),workspace=get('workspace');let group='all',selected='',pending='',identity='',frame=0;
const cards=()=>[...root.querySelectorAll('[data-action]')];
function show(){const rows=cards(),key=get('caseId').value;if(identity!==key){identity=key;group='all';selected='';}nav.hidden=note.hidden=!rows.length;if(!rows.length)return;
if(pending){selected=pending;group=actionGroup(pending);}
workspace.dataset.actionGroup=group;const visible=rows.filter(card=>group==='all'||actionGroup(card.dataset.action)===group);
if(!visible.some(card=>card.dataset.action===selected))selected=visible[0]?.dataset.action??'';
for(const card of rows){card.hidden=!visible.includes(card);card.open=!card.hidden&&card.dataset.action===selected;}
for(const button of nav.querySelectorAll('button')){button.setAttribute('aria-pressed',String(button.dataset.actionGroup===group));button.disabled=button.dataset.actionGroup!=='all'&&!rows.some(card=>actionGroup(card.dataset.action)===button.dataset.actionGroup);}
note.textContent='显示 '+visible.length+' 件。点开一件，先做完再看下一件。';
if(pending&&workspace.dataset.screen==='action'&&doc.body.dataset.view==='workspace'){const card=visible.find(card=>card.dataset.action===pending);pending='';if(card){if(frame)win.cancelAnimationFrame(frame);frame=win.requestAnimationFrame(()=>{frame=0;if(!card.isConnected||workspace.dataset.screen!=='action'||doc.body.dataset.view!=='workspace')return;const summary=card.querySelector('summary');summary.focus({preventScroll:true});card.scrollIntoView({block:'center',behavior:win.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});});}}
}
function click(event){const button=event.target.closest('[data-action-group]');if(button){group=button.dataset.actionGroup;show();}const jump=event.target.closest('[data-action-target]');if(jump){pending=jump.dataset.actionTarget;show();}}
function toggle(event){const card=event.target;if(!card.dataset.action||!card.open||card.hidden)return;selected=card.dataset.action;for(const other of cards())if(other!==card)other.open=false;}
const observer=new win.MutationObserver(show);observer.observe(root,{childList:true});observer.observe(workspace,{attributes:true,attributeFilter:['data-screen']});
doc.addEventListener('click',click);root.addEventListener('toggle',toggle,true);show();return ()=>{if(frame)win.cancelAnimationFrame(frame);observer.disconnect();doc.removeEventListener('click',click);root.removeEventListener('toggle',toggle,true);};
}
if(typeof document!=='undefined')mountActionDeck();
