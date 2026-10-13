export function clueLabel(id){return new Map([['month-palace','家里的一次变化'],['month-ten-god','长辈怎样影响你'],['month-qi','付出与成长环境'],['spouse-palace','亲密关系与长期合作'],['ten-god-structure','工作、表达与同辈'],['luck-start','第一步大运前后'],['flow-repeat','重复年份回看']]).get(id)??'命盘里的另一条观察';}
/** Local presentation only: anonymous identifiers, disclosure and interruptible transitions. */
export function createMemoryId(crypto){const bytes=new Uint8Array(6);crypto.getRandomValues(bytes);return 'MY-'+Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('');}
export function openFieldDetails(field){for(let node=field.parentElement;node;node=node.parentElement)if(node.tagName==='DETAILS')node.open=true;}
export function mountConsultation(doc=document,win=window){
const get=id=>doc.getElementById(id),form=get('birthForm'),workspace=get('workspace'),chart=get('chartView'),navigation=get('progress');
const reduced=win.matchMedia('(prefers-reduced-motion: reduce)'),animations=new Set();let route='',pillars='';
function anonymous(){const field=get('caseId');if(field.value.trim()||field.disabled||get('birthFields')?.disabled)return;try{field.value=createMemoryId(win.crypto);}catch{get('birthOptions').open=true;}}
function animate(node,frames,options){if(!node||reduced.matches||doc.hidden||!node.animate)return;const animation=node.animate(frames,options);animations.add(animation);animation.finished.then(()=>animations.delete(animation),()=>animations.delete(animation));}
function stop(){for(const animation of animations)animation.cancel();animations.clear();}
function show(){const next=doc.body.dataset.view+'/'+workspace.dataset.screen;if(next===route)return;route=next;stop();if(doc.body.dataset.view!=='workspace')return;
const pane=get({birth:'birthView',past:'pastPanel',action:'contextPanel',future:'futurePanel',report:'reportView'}[workspace.dataset.screen]);
animate(pane,[{opacity:.72,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}],{duration:460,easing:'cubic-bezier(.16,1,.3,1)'});
const active=navigation.querySelector('[aria-current="step"]');if(active){const left=active.offsetLeft,right=left+active.offsetWidth,edge=navigation.scrollLeft+navigation.clientWidth;if(left<navigation.scrollLeft||right>edge)navigation.scrollTo({left:Math.max(0,left-12),behavior:reduced.matches?'instant':'smooth'});}}
function revealChart(){const nodes=[...chart.querySelectorAll('.pillar')],next=nodes.map(n=>n.textContent).join('|');if(next===pillars)return;pillars=next;if(doc.body.dataset.view!=='workspace')return;
for(const [index,node] of nodes.entries())animate(node,[{opacity:.62,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:520,delay:index*65,easing:'cubic-bezier(.16,1,.3,1)'});}
function invalid(event){openFieldDetails(event.target);}
function reset(){win.queueMicrotask(anonymous);}
function preference(){if(reduced.matches)stop();}
function visibility(){if(doc.hidden)stop();}
const observeRoute=new win.MutationObserver(show);observeRoute.observe(workspace,{attributes:true,attributeFilter:['data-screen']});observeRoute.observe(doc.body,{attributes:true,attributeFilter:['data-view']});
const observeChart=new win.MutationObserver(revealChart);observeChart.observe(chart,{childList:true,subtree:true});
doc.addEventListener('invalid',invalid,true);form.addEventListener('reset',reset);reduced.addEventListener('change',preference);doc.addEventListener('visibilitychange',visibility);anonymous();show();
return ()=>{stop();observeRoute.disconnect();observeChart.disconnect();doc.removeEventListener('invalid',invalid,true);form.removeEventListener('reset',reset);reduced.removeEventListener('change',preference);doc.removeEventListener('visibilitychange',visibility);};
}
if(typeof document!=='undefined')mountConsultation();
