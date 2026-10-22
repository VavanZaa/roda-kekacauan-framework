import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { THEMES, LAYERS, LAYOUT, resolveTheme, resolveWheelTheme } from '../wheel-themes.mjs';
import { normalizeDisplayPlan, outcomeAtRotation, stopRotation, motionProgress } from '../wheel-geometry.mjs';
import { renderWheelSVG } from '../wheel-renderer.mjs';
import { buildCompactProposal } from '../compact-wheel-proposal.mjs';
const data=JSON.parse(await readFile(new URL('../fixtures.json',import.meta.url),'utf8'));

test('shared Element preview exposes all12 current leaves with equal odds and visible names',async()=>{
  const catalog=JSON.parse(await readFile(new URL('../../content/universal-element-wheel-design.json',import.meta.url),'utf8'));
  const plan=data.fixtures.element.find(f=>f.plan.wheelId==='element-universal').plan;
  assert.equal(plan.outcomes.length,12);
  assert.deepEqual(plan.outcomes.map(o=>o.id),catalog.wheels[0].outcomes.map(o=>o.id));
  assert.ok(plan.outcomes.every(o=>Math.abs(o.probability-1/12)<1e-12));
  const svg=renderWheelSVG(plan,{themeId:'element'});
  for(const outcome of plan.outcomes){assert.ok(svg.includes(`data-outcome-id="${outcome.id}"`));assert.ok(svg.includes(outcome.label));}
});

test('Element colors/glyphs survive layered exports and result hub uses the selected element without changing odds',()=>{
 const p=data.fixtures.element[0].plan,before=structuredClone(p),svg=renderWheelSVG(p,{themeId:'element',resultId:'void',onlyLayer:'07-hub'});
 assert.ok(svg.includes('data-element-icon="void"'));assert.ok(!svg.includes('data-element-icon="fire"'));
 const labels=renderWheelSVG(p,{themeId:'element',onlyLayer:'06-labels'});
 for(const o of p.outcomes)assert.ok(labels.includes(`data-element-icon="${o.id}"`));
 const sectors=renderWheelSVG(p,{themeId:'element',onlyLayer:'05-sectors'});
 const colors=[...sectors.matchAll(/data-outcome-id="[^"]+"[^>]*fill="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(colors).size,12);assert.deepEqual(p,before);
});

test('all frozen fixtures preserve probabilities, order and IDs without UI normalization',()=>{
  for(const list of Object.values(data.fixtures))for(const f of list){const before=structuredClone(f.plan);const p=normalizeDisplayPlan(f.plan);assert.deepEqual(f.plan,before);assert.deepEqual(p.outcomes.map(o=>[o.id,o.probability]),before.outcomes.map(o=>[o.id,o.probability]));assert.ok(Math.abs(p.outcomes.at(-1).end-360)<1e-6);}
});
test('compact proposals preserve None and Weapon tier masses; live fixture stays unchanged',()=>{
  for(const id of ['weapon','power'])for(const f of data.fixtures[id]){
    const before=structuredClone(f.plan),p=buildCompactProposal(f.plan);assert.deepEqual(f.plan,before);assert.equal(p.proposal.status,'not-approved-for-gameplay');
    const none=plan=>plan.outcomes.filter(o=>/(?:^|-)none$/.test(o.id)).reduce((s,o)=>s+o.probability,0);
    assert.equal(none(p),none(f.plan));assert.ok(p.outcomes.length<=31);assert.ok(p.outcomes.filter(o=>o.tier).every(o=>o.probability>=.01-1e-9));
    if(id==='weapon')for(let t=1;t<=5;t++){const mass=plan=>plan.outcomes.filter(o=>o.tier===t).reduce((s,o)=>s+o.probability,0);assert.ok(Math.abs(mass(p)-mass(f.plan))<1e-8);}
  }
  const p=data.fixtures.power[0].plan;assert.throws(()=>buildCompactProposal({...p,committedOutcomeId:p.outcomes[0].id}));
});
test('child wheel skins change motif/material without changing outcomes or odds',()=>{
  const machine=data.fixtures.race.find(f=>f.plan.wheelId==='machine-type').plan,elf=data.fixtures.race.find(f=>f.plan.wheelId==='fey-elf-season').plan,before=structuredClone(machine);
  const a=resolveWheelTheme(machine,{themeId:'race'}),b=resolveWheelTheme(elf,{themeId:'race'});assert.equal(a.material,'orbit');assert.equal(b.material,'cloth');assert.notEqual(a.motif,b.motif);assert.notEqual(a.accent,b.accent);assert.deepEqual(machine,before);
});
test('sector name ink stays above 4.5 contrast on each actual theme sector color',()=>{
  function luminance(hex){const v=hex.slice(1).match(/../g).map(s=>parseInt(s,16)/255).map(s=>s<=.04045?s/12.92:((s+.055)/1.055)**2.4);return .2126*v[0]+.7152*v[1]+.0722*v[2];}
  const ink=luminance('#252a25');for(const t of THEMES){const svg=renderWheelSVG(data.fixtures[t.id][0].plan,{themeId:t.id});for(const m of svg.matchAll(/<path data-outcome-id="[^"]+" d="[^"]+" fill="(#[a-f0-9]+)"/g)){const bg=luminance(m[1]);assert.ok((bg+.05)/(ink+.05)>=4.5,t.id+' '+m[1]);}}
});
test('anticlockwise motion lands inside every actual weighted sector',()=>{
  for(const list of Object.values(data.fixtures))for(const f of list){const p=normalizeDisplayPlan(f.plan);for(const o of p.outcomes)for(const start of [0,-1324.5,-9000]){const stop=stopRotation(p,o.id,start,3);assert.ok(stop<start-1079.99);assert.equal(outcomeAtRotation(p,stop).id,o.id);}}
});
test('weak to strong advances clockwise on the disc, anticlockwise at pointer',()=>{
  const race=normalizeDisplayPlan(data.fixtures.race[0].plan);assert.equal(race.outcomes[0].id,'human');for(let i=1;i<race.outcomes.length;i++){assert.ok(race.outcomes[i].mid>race.outcomes[i-1].mid);assert.equal(outcomeAtRotation(race,-race.outcomes[i].mid).id,race.outcomes[i].id);}
});
test('motion never reverses or overshoots, and comes to rest',()=>{
  let prev=-1;for(let i=0;i<=10000;i++){const p=motionProgress(i/10000);assert.ok(p>=prev-1e-12 && p>=0 && p<=1+1e-12);prev=p;}assert.equal(motionProgress(0),0);assert.equal(motionProgress(1),1);assert.ok(1-motionProgress(.999)<1e-7);
});
test('unbalanced, duplicate, nonpositive or empty plans fail rather than reweight',()=>{
  for(const outcomes of [[],[{id:'a',label:'A',probability:.9}],[{id:'a',label:'A',probability:1},{id:'a',label:'B',probability:.1}],[{id:'a',label:'A',probability:-1}]])assert.throws(()=>normalizeDisplayPlan({outcomes}));
});
test('God and Lich fixtures are guaranteed reveals, not random wheels',()=>{
  const god=data.fixtures['power-mastery'].find(f=>f.label.startsWith('God')),lich=data.fixtures.durability.find(f=>f.label.startsWith('Lich'));
  for(const f of [god,lich]){assert.equal(f.plan.fixed,true);assert.equal(f.plan.outcomes.length,1);assert.equal(f.plan.outcomes[0].value,9);assert.equal(f.plan.outcomes[0].probability,1);const svg=renderWheelSVG(f.plan,{resultId:f.plan.outcomes[0].id});assert.match(svg,/Hasil tetap · tanpa spin/);assert.ok(svg.includes(f.plan.outcomes[0].label));assert.ok(!svg.includes('Dasar tetap 9'));}
});
test('26 distinct theme routes and 16 independent layers, only two rotate',()=>{
  assert.equal(THEMES.length,26);assert.equal(new Set(THEMES.map(t=>t.id)).size,26);assert.equal(new Set(THEMES.map(t=>t.concept)).size,26);assert.equal(LAYERS.length,16);assert.deepEqual(LAYERS.filter(l=>l.rotating).map(l=>l.id),['05-sectors','06-labels']);assert.equal(resolveTheme({wheelId:'power-angelic'}).id,'angelic');assert.equal(resolveTheme({wheelId:'element-universal'}).id,'element');assert.equal(resolveTheme({wheelId:'elf-type',parentThemeId:'race'}).id,'race');
});
test('transparent layer exports exclude other visible layers and editor guides',()=>{
  const p=data.fixtures.race[0].plan;for(const l of LAYERS.filter(l=>!l.editorOnly)){const svg=renderWheelSVG(p,{onlyLayer:l.id});assert.equal((svg.match(/data-layer=/g)||[]).length,1);assert.ok(svg.includes(`data-layer="${l.id}"`));assert.ok(!svg.includes('data-layer="15-guides"'));}assert.ok(!renderWheelSVG(p).includes('data-layer="15-guides"'));assert.ok(renderWheelSVG(p,{guides:true}).includes('data-layer="15-guides"'));
});
test('dense wheels keep all real sectors and disclose full names in result',()=>{
  for(const id of ['weapon','power']){const p=data.fixtures[id][0].plan,o=p.outcomes.at(-1),svg=renderWheelSVG(p,{themeId:id,resultId:o.id});assert.equal((svg.match(/data-outcome-id=/g)||[]).length,p.outcomes.length);assert.ok(p.outcomes.length>=150);assert.ok(svg.includes(o.label));}
});
test('external labels are escaped as text, never executable SVG/HTML',()=>{
  const p=normalizeDisplayPlan({outcomes:[{id:'a" onload="evil()',label:'<script>bad & "thing"</script>',probability:1}]});const svg=renderWheelSVG(p,{resultId:p.outcomes[0].id,context:'<img src=x onerror=bad()>',reaction:'<iframe src=bad>'});assert.ok(!svg.includes('<script>'));assert.ok(!svg.includes('<img'));assert.ok(!svg.includes('<iframe'));assert.ok(svg.includes('&lt;script&gt;'));
});
test('content regions stay in conservative editable safe guide',()=>{
  const s=LAYOUT.safe;for(const[id,[x,y,w,h]]of Object.entries(LAYOUT.regions)){assert.ok(x>=s.x, id);assert.ok(y>=s.y,id);assert.ok(x+w<=s.x+s.width,id);assert.ok(y+h<=s.y+s.height,id);}
});
test('standalone bundle parses; provider requests are guarded to local HTTP',async()=>{
  const html=await readFile(new URL('../../preview/video-wheel-studio.html',import.meta.url),'utf8'),scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];assert.equal(scripts.length,1);new vm.Script(scripts[0][1]);assert.ok(scripts[0][1].includes("['127.0.0.1','localhost'].includes(globalThis.location?.hostname)"));assert.ok(scripts[0][1].includes('persist:false'));assert.ok(!scripts[0][1].includes('localStorage'));assert.ok(!scripts[0][1].includes('claimTitleInStore'));assert.ok(!html.includes('<script src='));
});
test('gallery uses unique gradient IDs for every theme',async()=>{
  const html=await readFile(new URL('../../preview/video-wheel-gallery.html',import.meta.url),'utf8'),ids=[...html.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length);for(const t of THEMES)assert.ok(html.includes(`url(#gallery-${t.id}-brand-room)`));
});
