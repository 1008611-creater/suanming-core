import {createSpiritMeshScene} from './rabbit-mesh.js';
export function spiritFramePlan({home,visible,hidden,reduced,paused,active}){return home&&visible&&!hidden&&!reduced&&!paused&&active;}
export function mountSpirit(doc=document,win=window,createScene=createSpiritMeshScene){
const canvas=doc.getElementById('spiritCanvas'),stage=doc.getElementById('spiritStage');let gl;const reset=doc.getElementById('turnReset');
try{gl=canvas.getContext('webgl2',{alpha:false,antialias:true,powerPreference:'low-power'});}catch{gl=null;}
function fallback(){if(reset)reset.hidden=true;stage.dataset.renderer='fallback';const hint=doc.getElementById('spiritKeys');if(hint)hint.textContent='当前为静态小兔子。点一下，听一句回应。';}
if(!gl){fallback();return ()=>{};}
let program,generation=0,dead=false,lost=false,frame=0,previous=0,elapsed=0,mood=0,targetMood=0,pulse=0,deadline=0,visible=true,paused=false,agentState='idle';
let manualAction=null,manualUntil=0;const rabbitActions=['thinking','pet','wave','hop','lie','ear'];
let gaze={x:0,y:0},targetGaze={x:0,y:0},turn={x:0,y:0},targetTurn={x:0,y:0},drag=null,suppressClickUntil=0;
const reduced=win.matchMedia('(prefers-reduced-motion: reduce)'),coarse=win.matchMedia('(pointer: coarse)');
const creature=doc.getElementById('mascotButton'),toggle=doc.getElementById('motionToggle');
function compile(){const version=++generation;try{const instance=createScene(canvas,stage,win);program=instance;Promise.resolve(instance.ready??true).then(ok=>{if(ok&&!dead&&!lost&&version===generation&&program===instance){stage.dataset.renderer='webgl';size();draw();wake(3400);}}).catch(()=>{if(!dead&&version===generation&&program===instance){lost=true;stop();fallback();}});stage.dataset.renderer=instance.ready?'loading':'webgl';const hint=doc.getElementById('spiritKeys');if(hint)hint.textContent='选中小兔子后，左右方向键转动，Home 或 Escape 恢复当前场景角度。';stage.dataset.antialias=String(program.samples??0);lost=false;}catch{fallback();lost=true;}}
function stop(){if(frame)win.cancelAnimationFrame(frame);frame=0;previous=0;}
function size(){const box=stage.getBoundingClientRect();program.resize(box.width,box.height);}
function draw(){if(dead||lost)return;program.draw({clock:elapsed,mood,poke:pulse,gaze,turn,agentState,actionName:manualAction==='lie'?manualAction:elapsed<manualUntil?manualAction:null,reduced:reduced.matches||paused});}
function allowed(time){return spiritFramePlan({home:doc.body.dataset.view==='home',visible,hidden:doc.hidden,reduced:reduced.matches,paused,active:time<deadline});}
function tick(time){frame=0;if(!allowed(time)||lost||dead){previous=0;return;}if(time-previous>=33){const dt=previous?Math.min(.08,(time-previous)/1000):.033;previous=time;elapsed+=dt;const ease=1-Math.exp(-9*dt);for(const key of ['x','y']){gaze[key]+=(targetGaze[key]-gaze[key])*ease;turn[key]+=(targetTurn[key]-turn[key])*ease;}mood+=(targetMood-mood)*ease;pulse*=Math.exp(-5*dt);draw();}frame=win.requestAnimationFrame(tick);}
function wake(duration=1800){if(reset)reset.hidden=dead||lost||(!targetTurn.x&&!targetTurn.y);if(dead||lost)return;const at=win.performance.now();deadline=at+duration;if(reduced.matches||paused){mood=targetMood;turn={...targetTurn};gaze={x:0,y:0};pulse=0;draw();return;}if(allowed(at)&&!frame)frame=win.requestAnimationFrame(tick);}
function release(){if(!drag)return;const id=drag.id;drag=null;delete stage.dataset.dragging;if(creature.hasPointerCapture?.(id))creature.releasePointerCapture(id);}
function select(){const key=stage.dataset.scene,next=key==='space'?1:key==='future'?2:0;if(next!==targetMood){targetTurn={x:0,y:0};release();}targetMood=next;wake();}
function pointer(event){if(drag||coarse.matches||reduced.matches||paused||event.pointerType==='touch')return;const r=stage.getBoundingClientRect();targetGaze={x:Math.max(-1,Math.min(1,(event.clientX-r.left-r.width*.65)/r.width*3)),y:Math.max(-1,Math.min(1,(event.clientY-r.top-r.height*.4)/r.height*3))};wake();}
function leave(){targetGaze={x:0,y:0};wake();}
function begin(event){if(lost||event.isPrimary===false||(event.button!==undefined&&event.button!==0))return;drag={id:event.pointerId,x:event.clientX,y:event.clientY,yaw:targetTurn.y,pitch:targetTurn.x,claimed:false,touch:event.pointerType==='touch'};}
function scrub(event){if(!drag||event.pointerId!==drag.id)return;const dx=event.clientX-drag.x,dy=event.clientY-drag.y;
if(!drag.claimed){if(drag.touch&&Math.abs(dy)>8&&Math.abs(dy)>Math.abs(dx)*1.25){release();return;}if(Math.abs(dx)<8&&Math.abs(dy)<8)return;drag.claimed=true;creature.setPointerCapture?.(drag.id);stage.dataset.dragging='true';}
const width=stage.getBoundingClientRect().width;targetTurn={y:Math.max(-.9,Math.min(.9,drag.yaw+dx/Math.max(width*.24,100))),x:Math.max(-.14,Math.min(.14,drag.pitch+dy/Math.max(width*.9,300)))};targetGaze={x:0,y:0};suppressClickUntil=win.performance.now()+500;wake();}
function end(event){if(drag&&event.pointerId===drag.id){if(drag.claimed)suppressClickUntil=win.performance.now()+500;release();}}
function front(){targetTurn={x:0,y:0};release();wake();}
function key(event){if(/^[1-6]$/.test(event.key)){event.preventDefault();rabbitAction(Number(event.key)-1);return;}const shifts={ArrowLeft:-.18,ArrowRight:.18};if(Object.hasOwn(shifts,event.key)){event.preventDefault();targetTurn.y=Math.max(-.9,Math.min(.9,targetTurn.y+shifts[event.key]));wake();}else if(event.key==='Home'||event.key==='Escape'){event.preventDefault();front();}}
function rabbitAction(index){if(paused||reduced.matches||lost)return;if(index===4&&manualAction==='lie'){manualAction='idle';manualUntil=elapsed;wake();return;}manualAction=rabbitActions[index];manualUntil=elapsed+(manualAction==='lie'?3.8:manualAction==='hop'?2.1:3.2);wake(4500);}

function pokeSpirit(event){if(win.performance.now()<suppressClickUntil){event.preventDefault();event.stopImmediatePropagation();return;}pulse=1;wake();}
toggle.disabled=reduced.matches;
function pause(){paused=!paused;doc.body.dataset.spiritPaused=String(paused);release();toggle.setAttribute('aria-pressed',String(paused));toggle.setAttribute('aria-label',paused?'播放场景动效':'暂停场景动效');toggle.querySelector?.('path')?.setAttribute('d',paused?'m9 5 11 7-11 7V5Z':'M8 5v14M16 5v14');if(paused)stop();else wake();}
function preference(){toggle.disabled=reduced.matches;release();stop();gaze={x:0,y:0};targetGaze={x:0,y:0};turn={...targetTurn};pulse=0;mood=targetMood;draw();if(!reduced.matches)wake();}
function visibility(){if(doc.hidden){release();stop();}else wake();}
function resize(){if(lost)return;size();draw();wake();}
function agentEvent(event){const next=event.detail?.state;if(!['idle','thinking','responding','error','cancelled'].includes(next))return;agentState=next==='cancelled'?'idle':next;stage.dataset.agentState=agentState;wake(3400);}
function contextLost(event){event.preventDefault();generation++;release();lost=true;stop();fallback();}
function contextRestored(){program?.dispose();compile();if(!lost){size();draw();wake();}}
compile();if(lost)return ()=>{};size();draw();
const observer=new win.MutationObserver(()=>{select();if(doc.body.dataset.view!=='home'){release();stop();}});observer.observe(stage,{attributes:true,attributeFilter:['data-scene']});observer.observe(doc.body,{attributes:true,attributeFilter:['data-view']});
const intersection=new win.IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)wake();else{release();stop();}},{threshold:.05});intersection.observe(stage);
const resizer=new win.ResizeObserver(resize);resizer.observe(stage);
const events=[[stage,'pointermove',pointer],[stage,'pointerleave',leave],[creature,'pointerdown',begin],[creature,'pointermove',scrub],[creature,'pointerup',end],[creature,'pointercancel',end],[creature,'lostpointercapture',end],[creature,'keydown',key],[creature,'click',pokeSpirit,true],[toggle,'click',pause],[doc,'visibilitychange',visibility],[doc,'zhuanji:agent-state',agentEvent],[reduced,'change',preference],[coarse,'change',leave],[canvas,'webglcontextlost',contextLost],[canvas,'webglcontextrestored',contextRestored]];
for(const button of stage.querySelectorAll?.('[data-rabbit-action]')??[])events.push([button,'click',()=>rabbitAction(Number(button.dataset.rabbitAction))]);if(reset)events.push([reset,'click',front]);for(const [node,name,handler,capture=false] of events)node.addEventListener(name,handler,capture);wake(3400);
return ()=>{dead=true;generation++;release();stop();observer.disconnect();intersection.disconnect();resizer.disconnect();for(const [node,name,handler,capture=false] of events)node.removeEventListener(name,handler,capture);program.dispose();};
}
export function mountDinosaurDock(doc=document,win=window,createScene=createSpiritMeshScene){
const avatar=doc.getElementById('dockAvatar');if(!avatar)return ()=>{};
const canvas=doc.createElement('canvas');canvas.setAttribute('aria-hidden','true');canvas.style.cssText='position:absolute;inset:0;width:100%;height:100%;pointer-events:none';avatar.style.position='relative';avatar.appendChild(canvas);
let program,generation=0,dead=false,lost=false,visible=true,frame=0,previous=0,clock=0,deadline=0,state='idle';const reduced=win.matchMedia('(prefers-reduced-motion: reduce)');
function fallback(){avatar.dataset.renderer='fallback';canvas.hidden=true;}
function compileDock(){const version=++generation;try{const instance=createScene(canvas,avatar,win,{compact:true});program=instance;lost=false;Promise.resolve(instance.ready??true).then(ok=>{if(ok&&!dead&&!lost&&version===generation&&program===instance){avatar.dataset.renderer='webgl';canvas.hidden=false;size();wake();}}).catch(()=>{if(!dead&&version===generation&&program===instance){lost=true;stop();fallback();}});return true;}catch{lost=true;fallback();return false;}}
if(!compileDock()){canvas.remove();return ()=>{};}
function draw(){if(dead||lost)return;program.draw({clock,agentState:state,reduced:reduced.matches||doc.body.dataset.spiritPaused==='true',mood:0});}
function size(){if(dead||lost)return;const box=avatar.getBoundingClientRect();program.resize(Math.max(1,box.width),Math.max(1,box.height));draw();}
function stop(){if(frame)win.cancelAnimationFrame(frame);frame=0;previous=0;}
function allowed(t){return doc.body.dataset.view!=='home'&&visible&&!doc.hidden&&!reduced.matches&&doc.body.dataset.spiritPaused!=='true'&&t<deadline&&!dead&&!lost;}
function tick(t){frame=0;if(!allowed(t)){previous=0;return;}if(t-previous>=33){clock+=previous?Math.min(.08,(t-previous)/1000):.033;previous=t;draw();}frame=win.requestAnimationFrame(tick);}
function wake(){deadline=win.performance.now()+3400;draw();if(allowed(win.performance.now())&&!frame)frame=win.requestAnimationFrame(tick);}
function event(e){const value=e.detail?.state;if(!['idle','thinking','responding','error','cancelled'].includes(value))return;state=value==='cancelled'?'idle':value;avatar.dataset.agentState=state;wake();}
function view(){if(doc.hidden||doc.body.dataset.view==='home'||doc.body.dataset.spiritPaused==='true'){stop();draw();}else wake();}
function preference(){stop();draw();if(!reduced.matches)wake();}
function contextLost(e){e.preventDefault();generation++;lost=true;stop();fallback();}
function contextRestored(){program.dispose();if(compileDock()){size();wake();}}
const observer=new win.IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)wake();else stop();},{threshold:.05});observer.observe(avatar);
const resizer=new win.ResizeObserver(size);resizer.observe(avatar);const mutation=new win.MutationObserver(view);mutation.observe(doc.body,{attributes:true,attributeFilter:['data-view','data-spirit-paused']});
const events=[[doc,'zhuanji:agent-state',event],[doc,'visibilitychange',view],[reduced,'change',preference],[canvas,'webglcontextlost',contextLost],[canvas,'webglcontextrestored',contextRestored]];for(const [node,name,handler] of events)node.addEventListener(name,handler);
size();
return ()=>{dead=true;generation++;stop();observer.disconnect();resizer.disconnect();mutation.disconnect();for(const [node,name,handler] of events)node.removeEventListener(name,handler);program.dispose();canvas.remove();delete avatar.dataset.renderer;};
}
