import {mountSpirit,mountDinosaurDock} from './spirit.js';
import {AGENT_EVENT,AGENT_PRESENTATION} from './agent-state.js';
/** Local display companion, adapted from svg-character-animator's persistent-node and idle/state layering. */
const scenes={career:{pose:'welcome',line:'想走，又怕后悔？',headline:'工作，\n还要继续吗？'},space:{pose:'focus',line:'回到家，也想松一口气。',headline:'住处，\n怎样才舒服？'},future:{pose:'wonder',line:'先看清眼前，再想远一点。',headline:'下一步，\n往哪里走？'}};
const stages={birth:{pose:'welcome',line:'先认识一下你。经历等会儿再说。'},past:{pose:'listen',line:'像不像，你说了算。说错了也留下。'},action:{pose:'focus',line:'这周先动一处，过几天回来看看。'},future:{pose:'wonder',line:'看不清的地方，给时间留个位置。'},report:{pose:'happy',line:'把这次聊的带走，下次接着看。'}};
const nudges={career:['要走，也先给自己留条路。','先分清：累的是工作，还是相处的人？','不用今天辞职。先看下一份想做什么。'],space:['坐着最烦哪一处？就从那里改。','家不用一次变完。先让这一角舒服点。','我转个面，你也换个位置试试。'],future:['先做个能撤回的小决定，怎么样？','猜不准就写不知道，过阵子再看。','把最怕的那件事，写成能核对的问题。']};
export function describeCompanion(route='home',scene='career',poke=0){
if(poke>0)return {pose:'wink',line:(nudges[scene]??nudges.career)[(poke-1)%3]};
return route==='home'?(scenes[scene]??scenes.career):(stages[route]??stages.birth);
}
export function mountCompanion(doc=document,win=window){
const get=id=>doc.getElementById(id),mascot=get('mascotButton'),dock=get('companionDock'),workspace=get('workspace');
const clone=mascot.querySelector('.avatar').cloneNode(true);get('dockAvatar').append(clone);
let agentState='idle';
let poke=0,lastScene='career',frame=0,pending=null,reveal=null,reply=null;
function headline(text){const title=get('sceneHeadline');if(title.textContent===text)return;reveal?.cancel();title.textContent=text;if(!reduce.matches&&!doc.hidden&&title.animate)reveal=title.animate([{opacity:.68,transform:'translateY(12px)',filter:'blur(3px)'},{opacity:1,transform:'translateY(0)',filter:'blur(0)'}],{duration:620,easing:'cubic-bezier(.16,1,.3,1)'});}
const reduce=win.matchMedia('(prefers-reduced-motion: reduce)');
function show(poked=false){
const home=doc.body.dataset.view==='home',scene=get('questionSlip').dataset.scene;
if(scene!==lastScene){poke=0;lastScene=scene;}
const state=agentState==='idle'||poked?describeCompanion(home?'home':workspace.dataset.screen,scene,poked?poke:0):AGENT_PRESENTATION[agentState];
mascot.dataset.pose=state.pose;get('dockAvatar').dataset.pose=state.pose;
const line=get('agentLine');if(line.textContent!==state.line){reply?.cancel();line.textContent=state.line;if(home&&!reduce.matches&&!doc.hidden&&line.animate)reply=line.animate([{clipPath:'inset(0 0 100% 0)',transform:'translateY(4px)'},{clipPath:'inset(0)',transform:'translateY(0)'}],{duration:300,easing:'cubic-bezier(.16,1,.3,1)'});}get('dockLine').textContent=state.line;
get('startJourney').firstChild.textContent=get('birthFields').disabled?'接着聊我的事 ':'聊聊我的事 ';if(!home)reply?.cancel();
dock.hidden=home;get('spiritStage').dataset.scene=scene;headline((scenes[scene]??scenes.career).headline);
}
function home(event){
event.preventDefault();workspace.hidden=true;doc.body.dataset.view='home';show();
get('heroTitle').setAttribute('tabindex','-1');get('heroTitle').focus({preventScroll:true});
win.scrollTo({top:0,behavior:reduce.matches?'instant':'smooth'});
}
function pokeSpirit(){poke++;show(true);}
function agent(event){const next=event.detail?.state;if(!Object.hasOwn(AGENT_PRESENTATION,next))return;agentState=next;dock.dataset.agent=next;show();}
const observer=new win.MutationObserver(()=>show());
observer.observe(doc.body,{attributes:true,attributeFilter:['data-view']});
observer.observe(workspace,{attributes:true,attributeFilter:['data-screen']});
observer.observe(get('questionSlip'),{attributes:true,attributeFilter:['data-scene']});
function center(){if(reduce.matches||doc.hidden){reveal?.cancel();reply?.cancel();}if(frame)win.cancelAnimationFrame(frame);frame=0;pending=null;mascot.style.removeProperty('--gaze-x');mascot.style.removeProperty('--gaze-y');}
function gaze(event){
if(reduce.matches||doc.hidden||event.pointerType==='touch')return;
const rect=mascot.getBoundingClientRect();pending={x:Math.max(-6,Math.min(6,(event.clientX-rect.left-rect.width/2)/28)),y:Math.max(-4,Math.min(4,(event.clientY-rect.top-rect.height/2)/35))};
if(frame)return;frame=win.requestAnimationFrame(()=>{frame=0;if(!pending)return;mascot.style.setProperty('--gaze-x',pending.x+'px');mascot.style.setProperty('--gaze-y',pending.y+'px');});
}
const events=[[doc,AGENT_EVENT,agent],[mascot,'click',pokeSpirit],[get('backHome'),'click',home],[doc.querySelector('.brand'),'click',home],[mascot,'pointermove',gaze],[mascot,'pointerleave',center],[reduce,'change',center],[doc,'visibilitychange',center]];for(const [node,name,handler] of events)node.addEventListener(name,handler);
const disposeSpirit=mountSpirit(doc,win),disposeDock=mountDinosaurDock(doc,win);show();
return ()=>{observer.disconnect();reveal?.cancel();reply?.cancel();center();clone.remove();for(const [node,name,handler] of events)node.removeEventListener(name,handler);disposeSpirit();disposeDock();};
}
if(typeof document!=='undefined')mountCompanion();
