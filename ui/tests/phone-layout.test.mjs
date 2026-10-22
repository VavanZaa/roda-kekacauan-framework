import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {renderWheelLayers} from '../wheel-renderer.mjs';
import {normalizeDisplayPlan} from '../wheel-geometry.mjs';
import {measuredLines,textAdvance,wheelAlias,baraDialogueLines,baraDialoguePages,renderBaraDialogueBox,BARA_DIALOGUE_LAYOUT,VIDEO_WHEEL_LAYOUT} from '../audit-layout.mjs';
const ep=JSON.parse(await readFile(new URL('../../renders/episode-002-r7/episode.json',import.meta.url),'utf8'));
test('settled results have one full name; readable effects replace the same card',()=>{
 for(const e of ep.events.filter(e=>e.kind!=='notice')){
  const p=normalizeDisplayPlan(e.plan),before=structuredClone(p);
  const result=renderWheelLayers(p,{resultId:e.result.outcomeId,reaction:e.reaction,phase:'result'});
  assert.equal(result.layers['12-readout'],'');assert.ok(result.layers['13-result'].includes(e.resultLabel));
  const effect=renderWheelLayers(p,{resultId:e.result.outcomeId,reaction:e.reaction,phase:'mechanism',mechanism:e.displayMechanism});
  assert.match(effect.layers['13-result'],/font-size="36"/);assert.deepEqual(p,before);
  const lines=baraDialogueLines(e.reaction),l=BARA_DIALOGUE_LAYOUT;
  assert.ok(lines.length<=3);
  assert.equal(lines.join(' '),e.reaction);
  for(const line of lines)assert.ok(textAdvance(line,l.fontSize)<=l.text[2]);
  assert.match(result.layers['14-reaction'],/data-dialogue-box="bara"/);
  assert.match(result.layers['14-reaction'],/data-bara-name="true"/);
  assert.match(result.layers['14-reaction'],/font-size="36"/);
 }
});
test('dialogue leaves a result-card gap and retains every word above the caption buffer',()=>{
 const l=BARA_DIALOGUE_LAYOUT,[x,y,w,h]=l.box,[tx,ty,tw,th]=VIDEO_WHEEL_LAYOUT.reaction;
 assert.ok(y>=VIDEO_WHEEL_LAYOUT.result[1]+VIDEO_WHEEL_LAYOUT.result[3]+20);
 assert.ok(tx-x>=24&&x+w-(tx+tw)>=24);
 assert.ok(ty>=y&&ty+th<y+h);
 assert.ok(l.bodyY+2*l.lineHeight+10<VIDEO_WHEEL_LAYOUT.captionStressTop);
 assert.ok(l.box[0]>360,'panel sits beside the illustrated Bara');
 const e=ep.events[19],lines=baraDialogueLines(e.reaction);
 assert.equal(lines.join(' '),e.reaction);
 assert.ok(!lines.some(s=>/^[🔥😭🗿]$/u.test(s)));
});
test('long fresh banter paginates at phone font size without losing words or emoji',()=>{
 const line='Bengkel belum buka, aku udah sok tahu. Ini roda muternya niat banget, tapi kamu masih nyari tutorial buat pakai revolver. Ya sudah, aku tunggu 🔥';
 const pages=baraDialoguePages(line);
 assert.ok(pages.length>1);
 assert.equal(pages.flatMap(p=>p.lines).join(' '),line);
 for(const page of pages){
  assert.ok(page.lines.length<=3&&page.duration>=2.75);
  const box=renderBaraDialogueBox(line,{page:page.index});
  assert.match(box,/font-size="36"/);
  assert.ok(box.includes(`>${page.index+1} / ${pages.length}</text>`));
 }
});
test('video starts with moving language and semantic armor hub; no spectator instructions',()=>{
 const race=renderWheelLayers(normalizeDisplayPlan(ep.events[0].plan),{phase:'spinning'});
 assert.equal(race.layers['13-result'],'');assert.match(race.layers['12-readout'],/SEDANG BERPUTAR/);
 assert.doesNotMatch(race.layers['12-readout'],/belum diputar|PUTAR RODA UNTUK MULAI/);
 const armor=renderWheelLayers(normalizeDisplayPlan(ep.events[3].plan),{themeId:'race'});
 assert.match(armor.layers['07-hub'],/data-motif="armor"/);assert.doesNotMatch(armor.layers['07-hub'],/data-motif="branch"/);
});
test('dense labels stay in the annulus; full result and color emoji remain independent',()=>{
 const e=ep.events[16],p=normalizeDisplayPlan(e.plan),f=renderWheelLayers(p,{resultId:e.result.outcomeId});
 assert.ok(p.outcomes.length>50);assert.match(f.layers['06-labels'],/clip-path="url\(#annular-labels\)"/);
 assert.match(f.layers['06-labels'],/font-size="26"/);assert.match(f.layers['13-result'],/>Es</);
 const hype=renderWheelLayers(normalizeDisplayPlan(ep.events[12].plan),{resultId:ep.events[12].result.outcomeId,reaction:ep.events[12].reaction});
 assert.match(hype.layers['14-reaction'],/data-color-emoji="🔥"/);assert.match(hype.layers['14-reaction'],/#ee7940/);
});
test('each Enchantment leaf is distinguishable by its compact alias',async()=>{
 const fixtures=JSON.parse(await readFile(new URL('../fixtures.json',import.meta.url),'utf8'));
 for(const p of [...fixtures.fixtures.enchantment.map(f=>f.plan),ep.events[16].plan]){
  const aliases=p.outcomes.map(o=>wheelAlias(o,p).label);
  assert.equal(new Set(aliases).size,p.outcomes.length);
  for(const o of p.outcomes){const alias=wheelAlias(o,p);assert.ok(textAdvance(alias.label,alias.font)<=96);}
 }
});
