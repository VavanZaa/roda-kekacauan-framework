import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { renderWheelSVG } from '../wheel-renderer.mjs';
import { resultPresentation } from '../brand-art.mjs';
import { normalizeDisplayPlan, outcomeAtRotation } from '../wheel-geometry.mjs';
import { planReadableAcquisition } from '../../framework/readable-acquisition.mjs';
import {baraDialoguePages} from '../audit-layout.mjs';
const data=JSON.parse(await readFile(new URL('../fixtures.json',import.meta.url),'utf8'));

test('None and fixed guarantees stay calm; tier strength is not invented rarity',()=>{
  assert.equal(resultPresentation({id:'power-none',tier:5},{}).kind,'none');
  assert.equal(resultPresentation({id:'power-test',tier:5},{fixed:true}).intensity,0);
  assert.equal(resultPresentation({id:'weapon-bata',tier:1},{}).label,'HASIL SPIN');
  assert.equal(resultPresentation({id:'power-test',tier:5},{}).kind,'strong');
  assert.equal(resultPresentation({id:'fun',funnyResult:true,tier:1},{}).kind,'funny');
});

test('brand resources are embedded and receipt points to CC0 source',async()=>{
  const svg=renderWheelSVG(data.fixtures.race[0].plan),receipt=JSON.parse(await readFile(new URL('../assets/brand/sources.json',import.meta.url),'utf8'));
  const pngImages=[...svg.matchAll(/<image[^>]*href="data:image\/png;base64,[^"]*"[^>]*>/g)];
  assert.ok(pngImages.length>0);assert.ok(pngImages.every(m=>m[0].includes('data-frame=')),'PNG illustration belongs only to Bara expression frames');assert.ok(svg.includes('data:image/jpeg;base64,'));
  assert.ok(svg.includes('class="attribute-icon"'));assert.ok(svg.includes('data-motif="branch"'));
  assert.ok(!/<image[^>]+href="https?:/.test(svg));assert.equal(receipt.assets.find(a=>a.id==='metal').license,'CC0-1.0');
  assert.equal(receipt.generatedImages,false);
});

test('brand visual rendering cannot mutate gameplay or accept executable phase text',()=>{
  const p=data.fixtures.power[0].plan,before=structuredClone(p);
  const svg=renderWheelSVG(p,{phase:'" onload="evil()',resultId:p.outcomes[1].id});
  assert.deepEqual(p,before);assert.ok(!svg.includes('data-phase="" onload='));
  assert.ok(svg.includes('data-phase="&quot; onload=&quot;evil()"'));
  for(const target of ['strength','speed','durability','intelligence','fight','weapon-mastery','power-mastery']){
    const fixture=data.fixtures[target][0].plan,original=structuredClone(fixture),outcome=fixture.outcomes.find(o=>o.value===7)||fixture.outcomes[0];
    const rendered=renderWheelSVG(fixture,{themeId:target,resultId:outcome.id});
    const text=[...rendered.matchAll(/<text\b[^>]*>([\s\S]*?)<\/text>/g)].map(m=>m[1].replace(/<[^>]*>/g,''));
    assert.ok(!text.some(s=>/^\d+$/.test(s)),target+' exposed a raw score');
    assert.ok(!text.some(s=>/^(?:T\d|TIER \d)$/.test(s)),target+' exposed a tier number');
    assert.deepEqual(fixture,original);assert.ok(rendered.includes(outcome.label));
  }
});

// Minimal DOM doubles test the playback controller, not a browser rendering surface.
async function controller(reduced=false,rosterMode='full',initialTheme='race',sound=false,idleEnabled=false){
  const attrs=[],animations=[],nodes=new Map(),animalSounds=[],landingSounds=[],idleFrames=new Map(),documentListeners=new Map();let clock=0,nextFrame=0;
  class Node {
    constructor(id=''){this.id=id;this.value=id==='theme'?initialTheme:id==='roster-mode'?rosterMode:id==='example'?'0':'';this.checked=id==='sound'&&sound;this.style={};this.children=[];this.textContent='';this.innerHTML='';}
    append(...v){this.children.push(...v);}replaceChildren(...v){this.children=v;}addEventListener(){}
    setAttribute(k,v){attrs.push({node:this.id,key:k,value:v});}animate(frames,opts){animations.push({node:this.id,frames,opts});}
    querySelector(s){return get('frame '+s);}click(){}
  }
  function get(id){if(!nodes.has(id))nodes.set(id,new Node(id));return nodes.get(id);}
  const document={visibilityState:idleEnabled?'visible':'hidden',addEventListener:(name,fn)=>documentListeners.set(name,fn),getElementById:get,createElement:()=>new Node(),querySelector:s=>get(s),querySelectorAll:()=>[],body:{classList:{toggle(){},remove(){}}}};
  get('studio-data').textContent=JSON.stringify(data);
  class AudioContext {
    constructor(){this.sampleRate=48000;this.currentTime=0;this.destination={};}
    resume(){return Promise.resolve();}
    createGain(){return {gain:{setValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){},disconnect(){}};}
    createOscillator(){return {frequency:{setValueAtTime(){},exponentialRampToValueAtTime(){}},connect:g=>g,start(){},stop(){}};}
    createBuffer(){return {copyToChannel:s=>this.samples=s};}
    decodeAudioData(bytes){return Promise.resolve({landing:true,bytes});}
    createBufferSource(){const source={connect:g=>g,start:at=>{if(source.buffer?.landing)landingSounds.push({at});else animalSounds.push({at,samples:this.samples});},disconnect(){}};return source;}
  }
  const context={document,window:{AudioContext},atob,location:{protocol:'file:',hostname:''},fetch(){throw new Error('Offline studio attempted network access');},Option:class{constructor(text,value){this.textContent=text;this.value=value;}},structuredClone,
    matchMedia:()=>({matches:reduced}),crypto:{getRandomValues(){throw new Error('Unexpected RNG');}},setTimeout:fn=>{queueMicrotask(fn);return 1;},
    cancelAnimationFrame:id=>idleFrames.delete(id),performance:{now:()=>clock},
    requestAnimationFrame:fn=>{const id=++nextFrame;if(idleEnabled)idleFrames.set(id,fn);else{clock+=1000/60;const at=clock;queueMicrotask(()=>fn(at));}return id;}};
  const modules=await Promise.all(['ui/wheel-themes.mjs','ui/wheel-geometry.mjs','ui/element-visuals.mjs','ui/element-art.mjs','ui/brand-assets.mjs','ui/brand-art.mjs','mascot/layer-assets.mjs','mascot/motion.mjs','mascot/expectation.mjs','mascot/rig.mjs','mascot/recorded-sound-assets.mjs','mascot/sounds.mjs','ui/landing-sound-assets.mjs','ui/landing-sound.mjs','ui/text-metrics.mjs','ui/audit-layout.mjs','ui/system-notice.mjs','ui/wheel-renderer.mjs','framework/readable-acquisition.mjs','ui/studio.mjs'].map(n=>readFile(new URL('../../'+n,import.meta.url),'utf8')));
  modules.splice(modules.length-1,0,...await Promise.all(['mascot/personality.mjs','mascot/commentary-session.mjs'].map(n=>readFile(new URL('../../'+n,import.meta.url),'utf8'))));
  const script=modules.map(s=>s.replace(/^import .*;\r?\n/gm,'').replace(/^export /gm,'')).join('\n');
  vm.runInNewContext(`(()=>{${script}})()`,context);
  return {api:context.window.RodaWheelUI,attrs,animations,nodes,animalSounds,landingSounds,idleFrames,
    advanceIdle(){const [id,fn]=idleFrames.entries().next().value;idleFrames.delete(id);clock+=1000/60;fn(clock);},
    hide(){document.visibilityState='hidden';documentListeners.get('visibilitychange')();},
    show(){document.visibilityState='visible';documentListeners.get('visibilitychange')();}};
}

test('committed playback slows anticlockwise, highlights actual sector, reveals without RNG',async()=>{
  const c=await controller(),input=data.fixtures.strength[0].plan,before=structuredClone(input),chosen=input.outcomes.find(o=>o.value===7);
  c.api.mount({...input,committedOutcomeId:chosen.id},{themeId:'strength'});
  await assert.rejects(c.api.play({outcomeId:input.outcomes[0].id}),/committed/);
  const result=await c.api.play({outcomeId:chosen.id,duration:3700});
  assert.equal(result.grantsApplied,false);assert.equal(result.feedback,'strong');assert.equal(result.phase,'result');
  assert.equal(outcomeAtRotation(normalizeDisplayPlan(input),result.rotation).id,chosen.id);assert.deepEqual(input,before);
  const phases=c.attrs.filter(a=>a.key==='data-phase').map(a=>a.value);assert.ok(phases.includes('spinning'));assert.ok(phases.includes('anticipation'));
  const rotations=c.attrs.filter(a=>a.node==='frame .rotating-face').map(a=>Number(a.value.match(/rotate\(([-.\d]+)/)[1]));
  assert.ok(rotations.length>200);for(let i=1;i<rotations.length;i++)assert.ok(rotations[i]<=rotations[i-1]);
  assert.equal(c.attrs.filter(a=>a.node==='frame .active-sector-path'&&a.key==='transform').at(-1).value,`rotate(${result.rotation} 490 785)`);
  assert.ok(c.animations.find(a=>a.node==='frame #layer-13-result').frames.some(f=>f.transform==='scale(1.018)'));
});

test('reduced motion and fixed God reveal immediately without any tick/reward animation',async()=>{
  for(const mode of ['reduced','fixed']){
    const c=await controller(mode==='reduced'),input=mode==='fixed'?data.fixtures['power-mastery'].find(f=>f.label.startsWith('God')).plan:data.fixtures.race[0].plan;
    c.api.mount(input,{themeId:mode==='fixed'?'power-mastery':'race'});const o=input.outcomes[0];await c.api.play({outcomeId:o.id});
    assert.equal(c.attrs.length,0);assert.equal(c.animations.length,0);assert.equal(c.api.getSnapshot().options.resultId,o.id);
  }
});

test('invalid playback duration fails before changing state',async()=>{
  const c=await controller(),p=c.api.getSnapshot().plan;
  await assert.rejects(c.api.play({outcomeId:p.outcomes[0].id,duration:NaN}),/Duration/);
  assert.equal(c.api.getSnapshot().options.phase,'idle');
});

test('committed studio playback gives rules to System alongside Bara without gameplay mutations',async()=>{
 const c=await controller(true),input=data.fixtures.race[0].plan,chosen=input.outcomes[0];
 c.api.mount({...input,committedOutcomeId:chosen.id},{themeId:'race'});
 const notice={voice:'system',title:'Event ras',rows:[{label:'ATURAN',text:'Lanjut ke roda jenis ras.'}]};
 const result=await c.api.play({outcomeId:chosen.id,reaction:'Bara lagi banter.',systemExplanation:notice});
 assert.equal(result.grantsApplied,false);assert.equal(result.phase,'mechanism');
 const snapshot=c.api.getSnapshot();assert.equal(snapshot.options.systemPage.voice,'system');
 assert.equal(snapshot.options.mascotExpression,undefined);assert.equal(snapshot.options.systemOnly,false);
 assert.ok(c.nodes.get('frame').innerHTML.includes('data-bara-dialogue'));
 assert.ok(c.nodes.get('frame').innerHTML.includes('data-system-notice'));
 assert.equal(snapshot.options.reaction,'Bara lagi banter.');
});
test('long dialogue advances every page alongside System without changing outcomes',async()=>{
 const c=await controller(true),input=data.fixtures.race[0].plan,chosen=input.outcomes[0],before=structuredClone(input);
 const line='Bengkel belum buka, aku udah sok tahu. Ini roda muternya niat banget, tapi kamu masih nyari tutorial buat pakai revolver. Ya sudah, aku tunggu 🔥';
 c.api.mount({...input,committedOutcomeId:chosen.id},{themeId:'race'});
 const result=await c.api.play({outcomeId:chosen.id,reaction:line,systemExplanation:{voice:'system',title:'Event ras',rows:[{label:'ATURAN',text:'Lanjut ke roda jenis ras.'}]}});
 const pages=baraDialoguePages(line),snapshot=c.api.getSnapshot();
 assert.equal(snapshot.options.baraDialoguePage,pages.length-1);
 assert.equal(snapshot.options.reaction,line);
 assert.ok(c.nodes.get('frame [data-dialogue-box="bara"]').outerHTML.includes(`data-dialogue-page="${pages.length-1}"`));
 assert.equal(snapshot.options.systemPage.voice,'system');
 assert.equal(result.outcomeId,chosen.id);assert.equal(result.grantsApplied,false);assert.deepEqual(input,before);
});

test('Bara sounds only when excited; low results, mute and fixed guarantees stay quiet',async()=>{
  for(const mode of ['audible','muted','fixed','low']){
    const c=await controller(true,'full','strength',mode!=='muted');
    const p=mode==='fixed'?data.fixtures['power-mastery'].find(f=>f.label.startsWith('God')).plan:c.api.getSnapshot().plan;
    c.api.mount(p,{themeId:mode==='fixed'?'power-mastery':'strength'});
    const outcome=mode==='fixed'?p.outcomes[0]:p.outcomes.find(o=>o.value===(mode==='low'?2:8));
    await c.api.play({outcomeId:outcome.id});
    assert.equal(c.animalSounds.length,mode==='audible'?1:0);
    assert.equal(c.landingSounds.length,['audible','low'].includes(mode)?1:0);
    if(mode==='audible'){assert.ok(c.animalSounds[0].samples.length>10000);assert.equal(c.animalSounds[0].at,.16);}
  }
});

test('lightweight idle stays animated, pauses in a hidden tab and honors reduced motion',async()=>{
  const c=await controller(false,'full','race',false,true),original=c.api.getSnapshot().plan;
  assert.equal(c.idleFrames.size,1);for(let i=0;i<24;i++)c.advanceIdle();
  const poses=c.attrs.filter(a=>a.node.includes('[data-part="head"]')&&a.key==='transform');
  assert.ok(new Set(poses.map(p=>p.value)).size>10);assert.equal(c.idleFrames.size,1);
  assert.deepEqual(c.api.getSnapshot().plan,original);
  c.hide();assert.equal(c.idleFrames.size,0);c.show();assert.equal(c.idleFrames.size,1);c.hide();
  const reduced=await controller(true,'full','race',false,true);assert.equal(reduced.idleFrames.size,0);
});

test('studio default readable Weapon and Power pools apply the approved 2% floor before selection',async()=>{
  for(const theme of ['weapon','power']){
    const c=await controller(false,'compact',theme),p=c.api.getSnapshot().plan;
    assert.equal(p.readability.status,'user-approved');
    assert.equal(p.committedOutcomeId,undefined);
    assert.ok(p.outcomes.every(o=>o.id.endsWith('-none')||o.probability>=.02-1e-12));
    assert.ok(c.nodes.get('status').textContent.includes('minimal 2%'));
    const equalizerFixture=data.fixtures[theme].find(f=>f.label==='Human · Equalizer');
    assert.equal(equalizerFixture.plan.trace.equalizerActive,true);
    const equalized=planReadableAcquisition(equalizerFixture.plan);
    assert.ok(equalized.outcomes.every(o=>o.probability===1/equalized.outcomes.length));
  }
});
