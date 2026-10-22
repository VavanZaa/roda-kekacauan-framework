import { resultPresentation, resolveBrandTheme } from './brand-art.mjs';
import { THEMES, LAYERS, LAYOUT, resolveTheme, resolveWheelTheme } from './wheel-themes.mjs';
import { normalizeDisplayPlan, outcomeAtRotation, selectDemoOutcome, stopRotation, motionProgress, sectorPath } from './wheel-geometry.mjs';
import { renderWheelSVG } from './wheel-renderer.mjs';
import { planReadableAcquisition } from '../framework/readable-acquisition.mjs';
import { sampleMascotPose, applyMascotPose, mascotExpressionFor } from '../mascot/rig.mjs';
import { mascotActionFor } from '../mascot/motion.mjs';
import { playMascotSound } from '../mascot/sounds.mjs';
import {assessMascotOutcome} from '../mascot/expectation.mjs';
import {createMascotCommentarySession} from '../mascot/commentary-session.mjs';
import {measuredLines,readableTextLines,baraDialoguePages,renderBaraDialogueBox} from './audit-layout.mjs';
import {paginateSystemNotice} from './system-notice.mjs';
import {playLandingSound} from './landing-sound.mjs';

const data=JSON.parse(document.getElementById('studio-data').textContent);
const frame=document.getElementById('frame'),themeSelect=document.getElementById('theme'),exampleSelect=document.getElementById('example'),spinButton=document.getElementById('spin');
let plan,sourcePlan,themeId='race',rotation=0,busy=false,resultId=null,lastRead='',reaction=null,caption=null,hiddenLayers=new Set(),audioContext=null,activeToken=0,phase='idle';
let baraIdleFrame=0,baraLastPose=null;
let systemPage=null;
let baraDialoguePage=0;
const baraCommentary=createMascotCommentarySession();
let baraEventSequence=0;
// Only a compatible server may receive isolated preview memory. An already
// running older server is left untouched; callers can inject their generator.
if(['http:','https:'].includes(globalThis.location?.protocol)&&['127.0.0.1','localhost'].includes(globalThis.location?.hostname)){
 fetch('/api/status').then(r=>r.json()).then(status=>{
  if(status.commentaryContractVersion>=2)baraCommentary.setProvider(async payload=>{
   const r=await fetch('/api/react',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({...payload,persist:false})});
   if(!r.ok)throw Error('Bara unavailable');return r.json();
  });
 }).catch(()=>{});
}
const $=id=>document.getElementById(id),pct=p=>(p*100).toLocaleString('id-ID',{maximumFractionDigits:2})+'%';

function options(){const exclusive=systemPage?.presentation==='exclusive';return {phase,themeId,rotation,resultId,readout:lastRead,reaction,caption,baraDialoguePage,context:plan.contextLabel,step:plan.stepLabel,guides:$('guides').checked,hiddenLayers:[...hiddenLayers],systemPage,systemOnly:exclusive,...(exclusive?{mascotExpression:'idle'}:{})};}
function stopBaraIdle(){if(baraIdleFrame)cancelAnimationFrame(baraIdleFrame);baraIdleFrame=0;}
function updateBaraPose(node,pose){baraLastPose=pose;applyMascotPose(node,pose);}
function startBaraIdle(){
  stopBaraIdle();
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  if(busy||hiddenLayers.has('14-reaction')||document.visibilityState!=='visible'||reduced.matches)return;
  const node=frame.querySelector('.mascot-rig'),expression=systemPage?.presentation==='exclusive'?'idle':mascotExpressionFor(plan.outcomes.find(o=>o.id===resultId),phase,plan),fromMotion=baraLastPose;let started=null;
  if(!node)return;
  function step(time){
    if(busy||document.visibilityState!=='visible'||reduced.matches){baraIdleFrame=0;return;}
    started??=time;updateBaraPose(node,sampleMascotPose({expression,time:time/1000,fromMotion,actionElapsed:(time-started)/1000}));
    baraIdleFrame=requestAnimationFrame(step);
  }
  baraIdleFrame=requestAnimationFrame(step);
}
function render(){stopBaraIdle();frame.innerHTML=renderWheelSVG(plan,options());if(!busy)startBaraIdle();}
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')startBaraIdle();else stopBaraIdle();});
function roster(){const q=$('search').value.toLocaleLowerCase('id-ID');$('roster').replaceChildren();for(const o of plan.outcomes.filter(o=>o.label.toLocaleLowerCase('id-ID').includes(q))){const row=document.createElement('div'),name=document.createElement('span'),odds=document.createElement('span');name.textContent=`${o.index+1}. ${o.label}`;odds.textContent=pct(o.probability);row.append(name,odds);$('roster').append(row);}}
function updateInspector(){
  const t=resolveBrandTheme(resolveWheelTheme(plan,{themeId}));$('concept').textContent=t.concept;
  $('material').textContent={wood:'Kayu',stone:'Batu',cloth:'Kain',paper:'Kertas',orbit:'Logam & peta langit',organic:'Organik'}[t.material]+' / bingkai perunggu';
  $('palette').replaceChildren();for(const color of[t.dark,t.accent,t.light]){const i=document.createElement('i');i.style.background=color;i.title=color;$('palette').append(i);}
  $('option-count').textContent=plan.outcomes.length+' pilihan';$('density').textContent=plan.readability?'Nama minimal 2%':plan.outcomes.length>32?'Label ringkas + penunjuk':'Label radial';
  $('status').textContent=plan.readability?'Pool ringkas dibekukan sebelum hasil dipilih. Setiap kandidat bernama minimal 2%.':plan.fixed?'Hasil tetap. Ditampilkan tanpa putaran.':'Demo tampilan. Peluang mengikuti fixture tersimpan.';
  spinButton.textContent=plan.fixed?'Tampilkan hasil tetap':plan.committedOutcomeId?'Putar hasil tersimpan ↺':'Coba putar ↺';
  $('roster-mode').disabled=!!plan.committedOutcomeId||!['weapon-main','power-main'].includes(plan.wheelId);roster();
}
function mount(input,opts={}){
  if(busy)throw new Error('Finish the current playback first.');
  plan=normalizeDisplayPlan(input);themeId=resolveTheme({themeId:opts.themeId,wheelId:plan.wheelId,parentThemeId:opts.parentThemeId}).id;
  phase='idle';rotation=0;resultId=null;lastRead='Siap menyusun takdir…';reaction=null;caption=null;systemPage=null;baraDialoguePage=0;
  render();updateInspector();
  return {outcomeCount:plan.outcomes.length,themeId};
}
function readableDisplay(source){return ['weapon-main','power-main','weapon','power'].includes(source.wheelId)?planReadableAcquisition(source,{seed:'studio-roster-1'}):source;}
function mountFixture(){sourcePlan=structuredClone(data.fixtures[themeId][Number(exampleSelect.value)].plan);const displayed=$('roster-mode').value==='compact'?readableDisplay(sourcePlan):sourcePlan;mount(displayed,{themeId});}
function changeTheme(){if(busy)return;themeId=themeSelect.value;exampleSelect.replaceChildren();for(const[f,i]of data.fixtures[themeId].map((f,i)=>[f,i])){const o=document.createElement('option');o.value=i;o.textContent=f.label;exampleSelect.append(o);}mountFixture();}
function setBusy(value){busy=value;for(const e of document.querySelectorAll('.editor input,.editor select,.editor button,.editor summary')){if('disabled'in e)e.disabled=value;}spinButton.disabled=value;}
function tick(){if(!$('sound').checked)return;audioContext??=new (window.AudioContext||window.webkitAudioContext)();const now=audioContext.currentTime,osc=audioContext.createOscillator(),gain=audioContext.createGain();osc.type='triangle';osc.frequency.setValueAtTime(460,now);osc.frequency.exponentialRampToValueAtTime(150,now+.026);gain.gain.setValueAtTime(.016,now);gain.gain.exponentialRampToValueAtTime(.0001,now+.03);osc.connect(gain).connect(audioContext.destination);osc.start(now);osc.stop(now+.031);}
function resultTone(feedback){
  if(!$('sound').checked||feedback.kind==='fixed')return;audioContext??=new (window.AudioContext||window.webkitAudioContext)();
  playLandingSound(audioContext,feedback).catch(()=>{});
}
async function play({outcomeId,duration=4400,reaction:nextReaction,caption:nextCaption,systemExplanation=plan.systemExplanation}={}){
  if(busy)throw new Error('Playback already active.');if(!Number.isFinite(duration)||duration<400||duration>15000)throw new Error('Duration must be 400–15000 ms.');const chosen=plan.outcomes.find(o=>o.id===outcomeId);if(!chosen)throw new Error('Result not in frozen plan.');if(plan.committedOutcomeId&&outcomeId!==plan.committedOutcomeId)throw new Error('Playback must match the committed result.');
  // This API receives a committed result. It never calls game RNG, grants or persistence.
  if($('sound').checked&&!plan.fixed){audioContext??=new (window.AudioContext||window.webkitAudioContext)();audioContext.resume()?.catch(()=>{});}
  const systemPages=systemExplanation?paginateSystemNotice(systemExplanation):[];
  setBusy(true);stopBaraIdle();const token=++activeToken;systemPage=null;phase='spinning';resultId=null;reaction=null;caption=null;lastRead='Lagi muter…';render();
  const dialogue=nextReaction?Promise.resolve({text:nextReaction,backend:'provided-script'}):baraCommentary.react({
   eventId:'studio-'+Date.now()+'-'+(++baraEventSequence),stage:plan.stepLabel??plan.wheelLabel??themeId,label:chosen.label,
   outcomeId:chosen.id,value:chosen.value,tier:chosen.tier,funnyResult:chosen.funnyResult,none:chosen.id.endsWith('-none'),
   wheelPlan:plan,characterContext:plan.contextLabel,mechanism:nextCaption??plan.mechanism??'',
   priorResults:baraCommentary.getState().recent.map(r=>({stage:r.stage,label:r.label}))});
  if(plan.fixed||matchMedia('(prefers-reduced-motion: reduce)').matches){rotation=plan.fixed?0:-chosen.mid;}
  else{
    const from=rotation,to=stopRotation(plan,chosen.id,rotation,plan.outcomes.length>32?4:3),face=frame.querySelector('.rotating-face'),labels=frame.querySelector('.rotating-labels'),readout=frame.querySelector('.pointer-readout'),flap=frame.querySelector('.pointer-flap'),active=frame.querySelector('.active-sector-path'),svg=frame.querySelector('svg');
    let begin=null,lastIndex=-1,lastTick=0,lastText=0;
    await new Promise(resolve=>{
      function step(time){if(token!==activeToken){resolve();return;}begin??=time;const p=Math.min(1,(time-begin)/duration);rotation=from+(to-from)*motionProgress(p);
        face?.setAttribute('transform',`rotate(${rotation} 490 785)`);labels?.setAttribute('transform',`rotate(${rotation} 490 785)`);
        const current=outcomeAtRotation(plan,rotation);phase=p>.72?'anticipation':'spinning';svg?.setAttribute('data-phase',phase);if(active){active.setAttribute('d',sectorPath(490,785,377,current.start,current.end));active.setAttribute('transform',`rotate(${rotation} 490 785)`);}
        if(current.index!==lastIndex && time-lastTick>65){if(p>.35)tick();if(flap){flap.style.transform='rotate(-4deg)';flap.animate([{transform:'rotate(-4deg)'},{transform:'rotate(0deg)'}],{duration:90,easing:'ease-out',fill:'forwards'});}lastTick=time;lastIndex=current.index;}
        if(p>.50 && time-lastText>100){lastRead=current.label;const rows=measuredLines(current.label,720,36);readout.innerHTML=rows.map((s,i)=>`<tspan x="490" dy="${i?39:0}">${s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;')}</tspan>`).join('');readout.setAttribute('y',rows.length>1?'1205':'1223');readout.setAttribute('font-size','36');lastText=time;}
        updateBaraPose(frame.querySelector('.mascot-rig'),sampleMascotPose({expression:'thinking',time:(time-begin)/1000}));
        if(p<1)requestAnimationFrame(step);else resolve();
      }requestAnimationFrame(step);
    });
  }
  const baraAssessment=assessMascotOutcome(plan,chosen.id);
  const baraLine=await dialogue;
  const concurrentRules=systemPages.length&&systemPages[0].presentation==='concurrent';
  const rulesStarted=performance.now();
  if(concurrentRules)systemPage=systemPages[0];
  phase='result';resultId=chosen.id;lastRead=chosen.label;reaction=baraLine.text;baraDialoguePage=0;caption=nextCaption??(plan.fixed?'Hasil tetap.':'Satu spin. Satu cerita.');render();
  // Long fresh banter advances through readable pages; never shrink or omit words.
  const dialoguePages=baraDialoguePages(reaction);
  const dialogueReading=(async()=>{
   if(dialoguePages.length<2)return;
   for(const page of dialoguePages){
    if(token!==activeToken)return;
    baraDialoguePage=page.index;
    const box=frame.querySelector('[data-dialogue-box="bara"]');
    if(box)box.outerHTML=renderBaraDialogueBox(reaction,{page:page.index});
    await new Promise(resolve=>setTimeout(resolve,page.duration*1000));
   }
  })();
  if(concurrentRules)frame.querySelector('[data-system-notice]')?.animate([{opacity:0},{opacity:1}],{duration:160,easing:'ease-out'});
  $('status').textContent=`${chosen.label} · ${plan.fixed?'hasil tetap':pct(chosen.probability)} · demo tampilan`;
  const feedback=resultPresentation(chosen,plan),reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!reduced&&!plan.fixed){const frames=feedback.intensity===2?[{opacity:0,transform:'scale(.97)'},{opacity:1,transform:'scale(1.018)',offset:.72},{opacity:1,transform:'scale(1)'}]:[{opacity:0},{opacity:1}];frame.querySelector('#layer-13-result')?.animate(frames,{duration:feedback.intensity===2?360:200,easing:'ease-out'});frame.querySelector('#layer-14-reaction')?.animate([{opacity:0},{opacity:1}],{duration:220,delay:180});}
  resultTone(feedback);
  if($('sound').checked&&!plan.fixed){audioContext??=new (window.AudioContext||window.webkitAudioContext)();audioContext.resume();playMascotSound(audioContext,mascotExpressionFor(chosen,'result',plan));}
  if(!reduced&&!plan.fixed){
    const mascotNode=frame.querySelector('.mascot-rig'),expression=mascotExpressionFor(chosen,'result',plan);let mascotStart=null;
    await new Promise(resolve=>{function animateBara(time){if(token!==activeToken){resolve();return;}mascotStart??=time;const elapsed=(time-mascotStart)/1000;updateBaraPose(mascotNode,sampleMascotPose({expression,from:'thinking',elapsed,time:elapsed,action:mascotActionFor(expression,baraAssessment),actionElapsed:elapsed,talking:elapsed<.45}));if(elapsed<2.4)requestAnimationFrame(animateBara);else resolve();}requestAnimationFrame(animateBara);});
  }
  if(!concurrentRules)await dialogueReading;
  if(systemPages.length){
   if(!concurrentRules&&(reduced||plan.fixed))await new Promise(resolve=>setTimeout(resolve,2400));
   for(const page of systemPages){
    if(token!==activeToken)break;
    systemPage=page;phase='mechanism';render();
    const alreadyShown=concurrentRules&&page.index===0?performance.now()-rulesStarted:0;
    if(!alreadyShown)frame.querySelector('[data-system-notice]')?.animate([{opacity:0},{opacity:1}],{duration:160,easing:'ease-out'});
    await new Promise(resolve=>setTimeout(resolve,Math.max(0,page.duration*1000-alreadyShown)));
   }
  }
  await dialogueReading;
  await new Promise(resolve=>setTimeout(resolve,250));setBusy(false);startBaraIdle();$('roster-mode').disabled=!!plan.committedOutcomeId||!['weapon-main','power-main'].includes(plan.wheelId);
  return {mode:'display-only',outcomeId:chosen.id,rotation,phase,feedback:resultPresentation(chosen,plan).kind,grantsApplied:false};
}
function download(name,text,type){const url=URL.createObjectURL(new Blob([text],{type})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);}
function exportSVG(layer){download(`roda-${themeId}${layer?'-'+layer:''}.svg`,renderWheelSVG(plan,{...options(),guides:false,onlyLayer:layer,hiddenLayers:layer?[]:[...hiddenLayers]}),'image/svg+xml');}

for(const t of THEMES){const o=document.createElement('option');o.value=t.id;o.textContent=t.name;themeSelect.append(o);}
for(const l of LAYERS){const row=document.createElement('label'),input=document.createElement('input'),name=document.createElement('span'),mark=document.createElement('code');input.type='checkbox';input.checked=true;name.textContent=l.name;mark.textContent=l.rotating?'↺':l.editorOnly?'editor':'';input.addEventListener('change',()=>{if(input.checked)hiddenLayers.delete(l.id);else hiddenLayers.add(l.id);render();});row.append(input,name,mark);$('layers').append(row);const option=document.createElement('option');option.value=l.id;option.textContent=l.name;if(!l.editorOnly)$('export-layer').append(option);}
themeSelect.addEventListener('change',changeTheme);
exampleSelect.addEventListener('change',()=>{if(!busy)mountFixture();});
$('roster-mode').addEventListener('change',()=>{if(!busy){const mode=$('roster-mode').value==='compact'?readableDisplay(sourcePlan):sourcePlan;mount(mode,{themeId});}});
$('guides').addEventListener('change',render);$('search').addEventListener('input',roster);
$('duration').addEventListener('input',()=>{$('duration-value').textContent=(Number($('duration').value)/1000).toLocaleString('id-ID')+' detik';});
spinButton.addEventListener('click',async()=>{try{let chosen;if(plan.committedOutcomeId)chosen=plan.outcomes.find(o=>o.id===plan.committedOutcomeId);else if(plan.fixed||plan.outcomes.length===1)chosen=plan.outcomes[0];else{const v=new Uint32Array(1);crypto.getRandomValues(v);chosen=selectDemoOutcome(plan,v[0]/4294967296);}await play({outcomeId:chosen.id,duration:Number($('duration').value)});}catch(e){setBusy(false);$('status').textContent=e.message;}});
$('export').addEventListener('click',()=>exportSVG());$('export-single').addEventListener('click',()=>exportSVG($('export-layer').value));
$('film').addEventListener('click',()=>document.body.classList.toggle('film'));document.querySelector('.stage-label').addEventListener('click',()=>document.body.classList.remove('film'));
$('import-plan').addEventListener('change',async e=>{try{const file=e.target.files[0];if(!file)return;if(file.size>2_000_000)throw new Error('File maksimal 2 MB.');const input=JSON.parse(await file.text());mount(input,{themeId:input.themeId,parentThemeId:themeId});sourcePlan=structuredClone(plan);$('roster-mode').value='full';themeSelect.value=themeId;exampleSelect.replaceChildren(new Option('Roda dari file',0));$('status').textContent='Roda dari file siap ditampilkan.';}catch(error){$('status').textContent='File tidak dipakai: '+error.message;}});
$('sound').addEventListener('change',async()=>{if($('sound').checked){audioContext??=new (window.AudioContext||window.webkitAudioContext)();await audioContext.resume();}});
window.RodaWheelUI={mount:(input,opts)=>{const result=mount(input,opts);sourcePlan=structuredClone(plan);$('roster-mode').value='full';return result;},play,exportSVG,setCommentaryProvider:provider=>baraCommentary.setProvider(provider),getSnapshot:()=>({plan:structuredClone(plan),options:options(),mode:'display-only'})};
changeTheme();
