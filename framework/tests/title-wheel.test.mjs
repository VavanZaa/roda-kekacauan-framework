import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, rm, access } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve, sep } from 'node:path';
import catalog from '../../content/title-wheel-design.json' with { type: 'json' };
import { createTitleUsage, validateTitleUsage, buildTitleContext, planTitleWheel, selectTitleOutcome,
  resolveTitleResult, applyTitleClaim, planTitleHiddenEvent, resolveTitleHiddenEvent } from '../title-wheel.mjs';
import { claimTitleInStore, readTitleUsage } from '../title-store.mjs';
import { buildTitleShortlist } from '../title-shortlist.mjs';
import { titleFixture } from '../scripts/title-fixtures.mjs';
import { projectFinalScore } from '../stat-odds.mjs';

const usage = () => createTitleUsage('roda-kekacauan-main');
const plan = (x=titleFixture(), state=usage()) => planTitleWheel(x,state);
function claim(p,state=usage(), index=0) {
  const receipt=resolveTitleResult(p,{runId:p.runId,characterId:p.characterId,invocationId:p.invocationId,
    outcomeId:p.outcomes[index].id,resultId:'result:'+p.characterId,spinId:'spin:'+p.characterId},state);
  return {receipt,state:applyTitleClaim(state,receipt)};
}
async function tempStore(t) {
  const folder=await mkdtemp(join(tmpdir(),'roda-title-tests-'));
  t.after(async()=>{const absolute=resolve(folder);if(!absolute.startsWith(resolve(tmpdir())+sep)||!absolute.includes('roda-title-tests-'))throw new Error('Unsafe test cleanup');await rm(absolute,{recursive:true,force:true});});
  return join(folder,'usage.json');
}

test('256 distinct titles,192 contextual/64 receh; only24 bounded hidden effects',()=>{
  assert.equal(catalog.titles.length,256);assert.equal(new Set(catalog.titles.map(t=>t.label)).size,256);
  assert.equal(catalog.titles.filter(t=>t.kind==='contextual').length,192);
  assert.equal(catalog.titles.filter(t=>t.kind==='receh').length,64);
  assert.equal(catalog.titles.filter(t=>t.hiddenEvent).length,24);
  for(const t of catalog.titles)if(t.hiddenEvent)assert.equal(t.hiddenEvent.amount,1);
});
test('live16-leaf pool is12 contextual/4 receh, normalized equal without stat caps',()=>{
  const p=plan();assert.equal(p.status,'ready');assert.equal(p.outcomes.length,16);
  assert.equal(p.trace.contextualCount,12);assert.equal(p.trace.recehCount,4);
  assert.ok(p.outcomes.every(o=>o.probability===1/16));assert.equal(p.trace.statProbabilityBoundsApplied,false);
});
test('precise lore eligibility: ordinary human cannot get appliance or flight title; actual Garuda can',()=>{
  const human=buildTitleContext(titleFixture());const garuda=buildTitleContext(titleFixture('mythical-beast/local/garuda',{powerIds:['flight']}));
  assert.ok(!human.tags.includes('flight'));assert.ok(garuda.tags.includes('flight'));
  const candidates=buildTitleShortlist(catalog,human.tags,[],'human');
  assert.ok(!candidates.outcomes.some(o=>o.label==='Sayap Pembelah Langit'||o.label==='Penggoreng Tanpa Minyak'));
  const air=buildTitleContext(titleFixture('machine/household-appliance/air-fryer'));
  assert.ok(air.tags.includes('appliance:air-fryer'));assert.ok(!human.tags.includes('appliance:air-fryer'));
});
test('uses separate actual stat signatures; future Title modifiers rejected',()=>{
  const x=titleFixture('human',{stats:{speed:8,strength:2,intelligence:7}});const c=buildTitleContext(x);
  assert.ok(c.tags.includes('speed-high'));assert.ok(c.tags.includes('intelligence-high'));assert.ok(!c.tags.includes('strength-high'));
  x.preTitleModifiers.speed=[{sourceKey:'future:title',amount:1,committed:true,stage:'title'}];
  assert.throws(()=>buildTitleContext(x),{code:'FUTURE_TITLE_EVIDENCE'});
});
test('unrelated owner stat proof and incomplete mastery cannot shape the pool',()=>{
  const x=titleFixture();x.statResults.speed.characterId='other';assert.throws(()=>plan(x),{code:'TITLE_STAT_OWNER_MISMATCH'});
  const y=titleFixture('human',{weaponLabels:['Excalibur']});delete y.weaponMasteryResults;
  assert.equal(plan(y).status,'needs_configuration');
});
test('known pre-Title bonuses are provisional and never mutate immutable base',()=>{
  const x=titleFixture('human',{stats:{strength:5},modifiers:{strength:[{sourceKey:'prior:race',stage:'race',amount:1,committed:true}]}});
  const before=structuredClone(x);const c=buildTitleContext(x);
  assert.equal(c.provisional.strength,6);assert.ok(c.tags.includes('strength-high'));assert.equal(c.projectionIsFinal,false);assert.deepEqual(x,before);
});
test('All In copies and guaranteed Lich maximum remain valid completed title evidence',()=>{
  const all=titleFixture('human',{roles:['gambler'],roleResults:{gambler:[['gambler-type','all-in']]},stats:{strength:8}});
  assert.equal(buildTitleContext(all).provisional.speed,8);assert.equal(all.statResults.speed.actualSpin,false);
  const lich=titleFixture('lelembut/imported/lich');assert.equal(buildTitleContext(lich).provisional.durability,9);
});
test('active weakness and canonical Chaos result contribute context without modifying stats',()=>{
  const x=titleFixture('human',{weaknesses:[{ownedId:'w1',sourceId:'weakness:spin',committed:true,definitionFile:'weakness-wheel-design.json',definitionId:'empty-wallet'}],
    apexOutcomeId:'divine-high',apexEffectIds:['second-chance']});
  const c=buildTitleContext(x);assert.ok(c.tags.includes('weakness:empty-wallet'));assert.ok(c.tags.includes('apex:divine-high'));assert.ok(c.tags.includes('apex-effect:second-chance'));
  assert.equal(c.provisional.strength,4);
});
test('a committed title is excluded for another character; selected title remains assigned',()=>{
  const p=plan();const a=claim(p);const q=plan(titleFixture('human',{characterId:'next'}),a.state);
  assert.ok(!q.outcomes.some(o=>o.id===a.receipt.titleId));assert.equal(a.state.revision,1);validateTitleUsage(a.state);
});
test('character replay returns original receipt without consuming another title',()=>{
  const x=titleFixture();const a=claim(plan(x));const replay=plan({...x,invocationId:'resume'},a.state);
  assert.equal(replay.status,'already_titled');assert.deepEqual(replay.receipt,a.receipt);assert.equal(replay.actualSpin,false);
  assert.deepEqual(applyTitleClaim(a.state,a.receipt),a.state);
});
test('a previously frozen pool fails after another character changes series usage',()=>{
  const p=plan();const q=plan(titleFixture('human',{characterId:'other'}));const a=claim(q);
  assert.throws(()=>claim(p,a.state),{code:'STALE_TITLE_POOL'});
});
test('Equalizer removes soft curation preference while retaining ownership and lore guards',()=>{
  const tags=buildTitleContext(titleFixture('human',{backstoryId:'endless-wanderer'})).tags;
  const a=buildTitleShortlist(catalog,tags,[],'seed',false),b=buildTitleShortlist(catalog,tags,[],'seed',true);
  assert.ok(a.outcomes.some(o=>o.affinityScore>1));assert.ok(b.outcomes.every(o=>o.affinityScore===1));
  const denied=[b.outcomes[0].id];assert.ok(!buildTitleShortlist(catalog,tags,denied,'seed',true).outcomes.some(o=>denied.includes(o.id)));
});
test('short/exhausted eligible pool never resurrects used titles or resets state',()=>{
  const tags=buildTitleContext(titleFixture()).tags;
  const only=catalog.titles.find(t=>t.label==='Pilihan Roda');
  const p=buildTitleShortlist(catalog,tags,catalog.titles.filter(t=>t.id!==only.id).map(t=>t.id),'seed');
  assert.equal(p.outcomes.length,1);assert.equal(p.outcomes[0].probability,1);
  assert.equal(buildTitleShortlist(catalog,tags,catalog.titles.map(t=>t.id),'seed').status,'exhausted');
});
test('title RNG endpoints map to frozen leaves and invalid sample is rejected',()=>{
  const p=plan();assert.equal(selectTitleOutcome(p,0),p.outcomes[0].id);assert.equal(selectTitleOutcome(p,1-Number.EPSILON),p.outcomes.at(-1).id);
  assert.throws(()=>selectTitleOutcome(p,1),{code:'INVALID_RANDOM_SAMPLE'});
});
test('changing a frozen effect to an invented AI bonus is rejected',()=>{
  const p=plan();p.outcomes[0].hiddenEvent={type:'stat-flat-modifier',stat:'strength',amount:99,calculation:'final-only'};
  assert.throws(()=>selectTitleOutcome(p,.1),{code:'INVALID_FROZEN_TITLE_RECIPE'});
});
test('24 hidden recipes register only final bonuses; weapon4+1 can qualify normal Enchant',()=>{
  const x=titleFixture('human',{weaponLabels:['Excalibur']});const p=plan(x);
  const t=catalog.titles.find(t=>t.label==='Sang Ahli Genggaman');
  const receipt={status:'resolved',sourceKey:'title:hidden:test',runId:x.runId,characterId:x.characterId,titleId:t.id,
    hiddenEvent:t.hiddenEvent,inventorySnapshot:p.inventorySnapshot,inventoryFingerprint:p.inventoryFingerprint,actualSpin:true};
  const h=planTitleHiddenEvent(receipt);assert.equal(h.status,'fixed');
  const result=resolveTitleHiddenEvent(h);assert.equal(result.triggersEnchantNow,false);
  assert.equal(projectFinalScore(x.weaponMasteryResults['weapon:0'],result.effects).finalValue,5);
  assert.equal(resolveTitleHiddenEvent(h,null,{consumedSourceKeys:[h.sourceKey]}).status,'already_resolved');
});
test('preview funny result does not emit real Shrek hit',()=>{
  const p=plan(titleFixture('goblinoid/orc/shrek',{mode:'preview'}));const i=p.outcomes.findIndex(o=>o.funnyResult);const a=claim(p,usage(),i);
  assert.equal(a.receipt.actualSpin,false);assert.equal(a.receipt.funnyActualSpinKey,null);
  const q=plan(titleFixture('goblinoid/orc/shrek'));const j=q.outcomes.findIndex(o=>o.funnyResult);assert.ok(claim(q,usage(),j).receipt.funnyActualSpinKey);
});
test('persistent claim survives reopening and replay never calls RNG again',async t=>{
  const file=await tempStore(t),x=titleFixture();let draws=0;
  const a=await claimTitleInStore(file,x,{random:()=>{draws++;return .2;}});assert.equal(a.status,'claimed');
  const b=await claimTitleInStore(file,x,{random:()=>{throw new Error('Replay drew again');}});
  assert.equal(b.status,'already_titled');assert.equal(draws,1);assert.deepEqual(b.receipt,a.receipt);
  const state=await readTitleUsage(file);assert.equal(state.revision,1);
  assert.ok(!plan(titleFixture('human',{characterId:'later'}),state).outcomes.some(o=>o.id===a.receipt.titleId));
  const next=await claimTitleInStore(file,titleFixture('human',{characterId:'second'}),{random:()=>.2});
  assert.equal(next.status,'claimed');assert.notEqual(next.receipt.titleId,a.receipt.titleId);
  assert.equal((await readTitleUsage(file)).revision,2);
});
test('preview cannot write production usage',async t=>{
  const file=await tempStore(t);await assert.rejects(claimTitleInStore(file,titleFixture('human',{mode:'preview'})),{code:'PREVIEW_USAGE_DISABLED'});
  await assert.rejects(access(file));
});
test('exclusive lock prevents competing writers from selecting duplicate titles',async t=>{
  const file=await tempStore(t);const results=await Promise.allSettled([
    claimTitleInStore(file,titleFixture('human',{characterId:'a'}),{random:()=>0}),
    claimTitleInStore(file,titleFixture('human',{characterId:'b'}),{random:()=>0})]);
  const success=results.filter(r=>r.status==='fulfilled');assert.ok(success.length>=1);
  for(const r of results.filter(r=>r.status==='rejected'))assert.equal(r.reason.code,'TITLE_STORE_BUSY');
  const state=await readTitleUsage(file);assert.equal(state.revision,success.length);validateTitleUsage(state);
  assert.equal(new Set(success.map(r=>r.value.receipt.titleId)).size,success.length);
});
test('corrupt saved registry is preserved and owned lock released on error',async t=>{
  const file=await tempStore(t);await writeFile(file,'not valid JSON');
  await assert.rejects(claimTitleInStore(file,titleFixture()));assert.equal(await readFile(file,'utf8'),'not valid JSON');
  await assert.rejects(access(file+'.lock'));
});
