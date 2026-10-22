import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import design from '../../content/main-power-wheel-design.json' with { type: 'json' };
import tier from '../../content/power-tier-design.json' with { type: 'json' };
import audit from '../../reference/size-profile-coverage.json' with { type: 'json' };
import themes from '../../content/universal-power-wheels-design.json' with { type: 'json' };
import backstory from '../../content/backstory-wheel-design.json' with { type: 'json' };
import original from '../../reference/power-tier-before-main-160.json' with { type: 'json' };
import { planSizeStage } from '../size-wheel.mjs';
import { planPowerStage, planPowerWheel, planThemedPowerWheel, selectPowerOutcome, resolvePowerResult, resolveFixedPowerGrant, planPowerMasteryAfterAcquisitions } from '../power-wheel.mjs';
import { planBackstoryWheel } from '../backstory-event.mjs';

export function powerInput(caseId='human', roles=[], roleResults={}, backstoryId) {
  const source=[...audit.terminalCases,...audit.ownerRewardContextCases].find(c=>c.id===caseId);assert.ok(source,caseId);
  const x=structuredClone(source.input);x.archetypeIds=roles;
  x.archetypeFacts=roles.map(id=>({archetypeId:id,sourceId:'role:'+id,committed:true,results:(roleResults[id]??[]).map(([wheelId,outcomeId],i)=>({wheelId,outcomeId,spinId:'role:'+id+':'+i}))}));
  const sizePlan=planSizeStage(x);assert.equal(sizePlan.status,'ready',caseId);
  return {...x,invocationId:'power:1',stage:'power',weaponStageComplete:true,consumedPowerRequestIds:[],powers:[],weapons:[],
    sizePlan,sizeResult:{invocationId:sizePlan.invocationId,spinId:'size:actual',outcomeId:sizePlan.outcomes[5]?.id??sizePlan.outcomes[0].id},
    ...(backstoryId?{backstoryFact:{outcomeId:backstoryId,sourceId:'backstory:1',spinId:'backstory:actual',committed:true}}:{})};
}
const probability=(p,id)=>p.outcomes.find(o=>o.id===id)?.probability??0;
const average=p=>p.outcomes.filter(o=>o.tier).reduce((s,o)=>s+o.tier*o.probability,0)/(1-probability(p,'power-none'));
const own=(id,index=0,mode='power')=>{const r=design.recipes.find(p=>p.id===id);assert.ok(r,id);return {ownedId:'owned:'+index,sourceId:'prior:'+index,committed:true,kind:'owned',...r.powerDefinitionRef,grantMode:mode};};
const result=(p,id,spinId='power:actual')=>({runId:p.runId,characterId:p.characterId,invocationId:p.invocationId,outcomeId:id??p.outcomes[0].id,spinId});
const themeInput=()=>({runId:'theme-run',characterId:'theme-owner',invocationId:'theme-call',powers:[],caller:{sourceId:'actual-elf',sourceStage:'race',returnTo:'race-events',committed:true}});

test('160 curated canonical powers/32 per Tier plus None; all refs resolve and original300 ratings stay intact',()=>{
  assert.equal(design.recipes.length,160);assert.equal(new Set(design.recipes.map(p=>p.id)).size,160);
  for(let t=1;t<=5;t++)assert.equal(design.recipes.filter(p=>p.tier===t).length,32);
  assert.equal(original.definitionCount,300);assert.deepEqual(tier.ratings.slice(0,300),original.ratings);
  assert.equal(tier.definitionCount,303);
  for(const p of design.recipes){const d=JSON.parse(readFileSync(new URL('../../'+p.powerDefinitionRef.definitionFile,import.meta.url),'utf8').replace(/^\uFEFF/,''));
    const find=v=>v&&typeof v==='object'&&(v.id===p.powerDefinitionRef.definitionId||Object.values(v).some(find));assert.ok(find(d),p.id);}
  const p=planPowerWheel(powerInput());assert.equal(p.status,'ready');assert.equal(p.outcomes.length,161);
  assert.equal(design.recipes.find(p=>p.id==='power-water-breathing').tier,1);assert.equal(design.recipes.find(p=>p.id==='power-primordial-creation').tier,5);
});
test('All348 terminal identities and131 owner event variations produce normalized positive Power pools',()=>{
  for(const c of [...audit.terminalCases,...audit.ownerRewardContextCases]){
    const p=planPowerWheel(powerInput(c.id));assert.equal(p.status,'ready',c.id);
    assert.ok(Math.abs(p.outcomes.reduce((s,o)=>s+o.probability,0)-1)<1e-12,c.id);
    assert.ok(p.outcomes.every(o=>Number.isFinite(o.probability)&&o.probability>0),c.id);
    assert.equal(p.trace.statMasteryBoundsApplied,false);assert.equal(p.trace.weaponTierMassesApplied,false);
  }
});
test('Human authored50% None and lore differs by race: God high-tier mass, appliance lower than Human',()=>{
  const human=planPowerWheel(powerInput()),god=planPowerWheel(powerInput('heavenly-principle/god'));
  assert.equal(probability(human,'power-none'),.5);assert.equal(probability(god,'power-none'),.8);
  assert.ok(average(god)>average(human)+1);
  const applianceCase=audit.terminalCases.find(c=>c.id.startsWith('machine/household-appliance/'));assert.ok(applianceCase);
  assert.ok(average(planPowerWheel(powerInput(applianceCase.id)))<average(human));
});
test('Sixteen approved Backstory intents bind to real numeric Power rules and remain valid frozen recipes',()=>{
  const intents=backstory.wheel.outcomes.flatMap(o=>o.probabilityModifiers.filter(p=>p.target==='power'));
  assert.equal(intents.length,16);assert.ok(intents.every(i=>i.status==='implemented-current-power-likelihood'&&design.probabilityModel.backstoryProfiles.some(p=>p.id===i.numericRuleRef)));
  assert.equal(planBackstoryWheel({runId:'a',characterId:'b',invocationId:'c',raceAndArchetypeComplete:true}).status,'ready');
  const base=planPowerWheel(powerInput()),lab=planPowerWheel(powerInput('human',[],{},'made-in-lab'));
  const share=(p,id)=>probability(p,id)/(1-probability(p,'power-none'));
  assert.ok(share(lab,'power-android-laser-eye')>share(base,'power-android-laser-eye'));
  assert.ok(average(planPowerWheel(powerInput('human',[],{},'failed-magician')))<average(base));
  assert.ok(average(planPowerWheel(powerInput('human',[],{},'searching-for-more')))>average(base));
});
test('Ordinary Mage two and Master Sihir three total acquisitions; guarantee each, exact high-tier weight3x only Mage slots',()=>{
  for(const [chance,count]of [['mage-biasa',2],['master-sihir',3]]){
    const x=powerInput('human',['mage'],{mage:[['mage-master-sihir-chance',chance]]});
    const stage=planPowerStage(x);assert.equal(stage.acquisitions.length,count);
    for(const request of stage.acquisitions){const p=planPowerWheel(x,{requestId:request.id});assert.equal(p.status,'ready');assert.equal(probability(p,'power-none'),0);
      assert.ok(p.trace.weights.every(w=>w.mageFactor===(chance==='master-sihir'&&design.recipes.find(r=>r.id===w.id).tier>=3?3:1)));
      const r=resolvePowerResult(p,result(p,p.outcomes[0].id,'draw:'+x.consumedPowerRequestIds.length));x.powers.push(r.atomicEffects[0]);x.consumedPowerRequestIds.push(request.id);}
    assert.equal(planPowerStage(x).nextRequestId,null);
  }
  assert.deepEqual(planPowerStage(powerInput('human',['mage'])).required,['committed-mage-master-sihir-result']);
});
test('God scarcity and guarantee precedence; qualified VesselGod90 receives80% None but60 does not',()=>{
  const godMage=powerInput('heavenly-principle/god',['mage'],{mage:[['mage-master-sihir-chance','master-sihir']]});
  assert.equal(probability(planPowerWheel(godMage),'power-none'),0);
  const vessel=c=>powerInput('human',['vessel'],{vessel:[['vessel-patron','god'],['vessel-compatibility','compatibility-'+c]]});
  assert.equal(probability(planPowerWheel(vessel(90)),'power-none'),.8);
  assert.notEqual(probability(planPowerWheel(vessel(60)),'power-none'),.8);
  assert.equal(planPowerStage(powerInput('human',['vessel'])).status,'needs_configuration');
});
test('Equalizer includes None uniformly, suppresses lore/God80/Mage3x but keeps guarantee exclusions',()=>{
  const god=planPowerWheel(powerInput('heavenly-principle/god',['equaliser']));assert.equal(probability(god,'power-none'),1/161);
  const mage=planPowerWheel(powerInput('human',['mage','equaliser'],{mage:[['mage-master-sihir-chance','master-sihir']]}));
  assert.equal(mage.status,'needs_configuration'); // This pair is explicitly incompatible before Hybrid selection.
  const x=powerInput('human',['equaliser'],{},'dumpster-power');x.consumedPowerRequestIds=[planPowerStage(x).acquisitions[0].id];
  const guaranteed=planPowerWheel(x);assert.ok(guaranteed.outcomes.every(o=>o.probability===1/160));assert.equal(probability(guaranteed,'power-none'),0);
});
test('Canonical already-owned powers are excluded; same label alone never excludes; Authority is a separate mode',()=>{
  const x=powerInput();x.powers=[own('power-flight')];let p=planPowerWheel(x);assert.equal(probability(p,'power-flight'),0);
  x.powers=[{...own('power-flight'),label:'Creation'}];p=planPowerWheel(x);assert.ok(probability(p,'power-primordial-creation')>0);
  x.powers=[own('power-concept-time',0,'authority')];assert.ok(probability(planPowerWheel(x),'power-concept-time')>0);
  const bad=powerInput();bad.powers=[{ownedId:'legacy',sourceId:'prior',definitionId:'flight',committed:true}];assert.equal(planPowerWheel(bad).status,'needs_configuration');
});
test('Main None retains early power inventory and emits only a source-once consumed request',()=>{
  const x=powerInput();x.powers=[own('power-flight')];const before=structuredClone(x),p=planPowerWheel(x),r=resolvePowerResult(p,result(p,'power-none'));
  assert.equal(r.atomicEffects.length,1);assert.equal(r.atomicEffects[0].type,'consume-power-request');assert.equal(r.retainPreviousPowers,true);assert.deepEqual(x,before);
});
test('Race bonuses and Dumpster produce exact sequential slots; Fantasy NPC does not receive MC extra',()=>{
  for(const id of ['fae/fairy-king','goblinoid/orc/shaman','lelembut/imported/lich'])assert.equal(planPowerStage(powerInput(id)).acquisitions.length,2,id);
  const anime=role=>powerInput('anime-lineage/fantasy/'+role);
  assert.equal(planPowerStage(anime('mc')).acquisitions.length,2);assert.equal(planPowerStage(anime('npc')).acquisitions.length,1);
  const x=powerInput('human',[],{},'dumpster-power'),stage=planPowerStage(x);assert.equal(stage.acquisitions.length,2);assert.equal(stage.acquisitions[1].requirePower,true);
  assert.throws(()=>planPowerWheel(x,{requestId:stage.acquisitions[1].id}),{code:'POWER_REQUEST_OUT_OF_ORDER'});
  x.consumedPowerRequestIds.push(stage.acquisitions[0].id);assert.equal(probability(planPowerWheel(x),'power-none'),0);
});
test('Master Sihir x3 does not leak into separate non-Mage bonus requests',()=>{
  const x=powerInput('human',['mage'],{mage:[['mage-master-sihir-chance','master-sihir']]},'dumpster-power');const stage=planPowerStage(x);
  x.consumedPowerRequestIds=stage.acquisitions.filter(r=>r.mageManaged).map(r=>r.id);
  const p=planPowerWheel(x);assert.equal(p.request.mageManaged,false);assert.ok(p.trace.weights.every(w=>w.mageFactor===1));
});
test('Eight canonical thematic pools remain equal and None-free; already-owned shared Flight excluded across callers',()=>{
  for(const wheel of themes.wheels){const p=planThemedPowerWheel(themeInput(),{wheelId:wheel.id});assert.equal(p.status,'ready',wheel.id);assert.equal(p.outcomes.length,wheel.outcomes.length);assert.ok(p.outcomes.every(o=>o.probability===1/p.outcomes.length));}
  const x=themeInput();x.powers=[own('power-flight')];const demonic=planThemedPowerWheel(x,{wheelId:'power-demonic'});assert.equal(demonic.outcomes.length,19);
  assert.ok(demonic.outcomes.every(p=>p.powerDefinitionRef.definitionId!=='flight'));
});
test('Thematic exhaustion and fully owned main roster stop with configuration error, preserving inventory',()=>{
  const x=powerInput();x.powers=design.recipes.map((p,i)=>own(p.id,i));const before=structuredClone(x);
  assert.equal(planPowerWheel(x).status,'needs_configuration');assert.deepEqual(x,before);
  const y=themeInput(),first=planThemedPowerWheel(y,{wheelId:'power-holy'});
  y.powers=first.outcomes.map((p,i)=>({ownedId:'theme:'+i,sourceId:'source:'+i,committed:true,...p.powerDefinitionRef}));
  assert.deepEqual(planThemedPowerWheel(y,{wheelId:'power-holy'}).required,['nonempty-unowned-power-holy-pool']);
});
test('Fixed duplicate grants merge provenance; source replay gives no duplicate reward; bounded bindings/modes stay distinct',()=>{
  const x=powerInput();x.powers=[own('power-flight')];const g={...own('power-flight'),sourceId:'new',sourceKey:'fixed:new'};
  const r=resolveFixedPowerGrant(x,g);assert.equal(r.merge,true);assert.equal(r.effects[0].ownedId,'owned:0');assert.equal(r.actualSpin,false);
  x.consumedFixedPowerSourceKeys=['fixed:new'];assert.equal(resolveFixedPowerGrant(x,g).status,'already_resolved');
  const c=powerInput();c.powers=[own('power-concept-time',0,'authority')];assert.equal(resolveFixedPowerGrant(c,{...own('power-concept-time'),sourceKey:'new',bindingKey:'local-domain'}).merge,false);
});
test('Actual acquisition result emits one ordinary power, no source-event/package/mastery/enchant; tagged funny hooks use actual spin',()=>{
  const p=planPowerWheel(powerInput()),r=resolvePowerResult(p,result(p,'power-appliance-blender'));
  assert.equal(r.atomicEffects.length,2);assert.equal(r.atomicEffects[0].dispatchSourceEvents,false);assert.equal(r.atomicEffects[0].triggersMasterySpinNow,false);
  assert.equal(r.powerEnchant,false);assert.equal(r.funnyResult,true);assert.equal(r.sourceKey,p.request.id);
  assert.equal(resolvePowerResult(p,result(p),{consumedRequestIds:[p.request.id]}).status,'already_resolved');
});
test('CDF/source/ownership guards and frozen recipes do not replan saved draws',()=>{
  const x=powerInput(),before=structuredClone(x),p=planPowerWheel(x),frozen=structuredClone(p);
  assert.equal(selectPowerOutcome(p,0),'power-none');assert.equal(selectPowerOutcome(p,.999999),p.outcomes.at(-1).id);
  assert.throws(()=>selectPowerOutcome(p,1),{code:'INVALID_RANDOM_SAMPLE'});
  assert.throws(()=>resolvePowerResult(p,{...result(p),characterId:'other'}),{code:'POWER_SOURCE_MISMATCH'});
  assert.throws(()=>resolvePowerResult(p,result(p),{currentOwnershipFingerprint:'changed'}),{code:'STALE_POWER_OWNERSHIP'});
  assert.deepEqual(x,before);assert.deepEqual(p,frozen);
});
test('Shared Power Mastery waits for acquisitions, skips empty/God max and reuses ordinary settled record without enchant',()=>{
  const x=powerInput();assert.equal(planPowerMasteryAfterAcquisitions(x).status,'needs_configuration');
  x.consumedPowerRequestIds=planPowerStage(x).acquisitions.map(r=>r.id);x.allAcquisitionsComplete=true;
  assert.equal(planPowerMasteryAfterAcquisitions(x).reason,'no-owned-power');
  x.powers=[own('power-flight')];assert.equal(planPowerMasteryAfterAcquisitions(x).actualSpin,true);
  x.sharedPowerMastery={status:'resolved',runId:x.runId,characterId:x.characterId,resolutionId:'shared:1',retainedRawBase:7};
  assert.equal(planPowerMasteryAfterAcquisitions(x).status,'reuse');
  const god=powerInput('heavenly-principle/god');god.powers=[own('power-flight')];god.consumedPowerRequestIds=planPowerStage(god).acquisitions.map(r=>r.id);god.allAcquisitionsComplete=true;
  const max=planPowerMasteryAfterAcquisitions(god);assert.equal(max.actualSpin,false);assert.equal(max.powerEnchant,false);
});
test('Actual element/concept and bounded physical Size influence acquisition odds; narration/final bonuses do not',()=>{
  const god=powerInput('heavenly-principle/god'),base=planPowerWheel(god);
  god.raceFacts[0].results.push({wheelId:'god-concept',outcomeId:'time',spinId:'god-time:actual'});
  god.sizePlan=planSizeStage(god);god.sizeResult={invocationId:god.sizePlan.invocationId,spinId:'size:actual',outcomeId:god.sizePlan.outcomes[5].id};
  const time=planPowerWheel(god);assert.ok(time.trace.raceResultAffinities.some(p=>p.id==='power-god-concept-time'));
  assert.ok(probability(time,'power-time-stop')>probability(base,'power-time-stop'));
  const x=powerInput(),first=planPowerWheel(x);x.narratorText='GOD CREATION100%';x.bonusLedger=[{amount:999,target:'power'}];
  assert.deepEqual(planPowerWheel(x).outcomes,first.outcomes);
  x.sizeResult.outcomeId=x.sizePlan.outcomes.at(-1).id;const large=planPowerWheel(x);assert.ok(Math.abs(large.trace.sizeShift)<=design.probabilityModel.maxAbsoluteSizeTierShift);
  assert.notEqual(large.trace.sizeShift,first.trace.sizeShift);
});
test('Expanded canonical themed outcomes are accepted as prior owner context without rewriting old likelihoods',()=>{
  const x=powerInput('heavenly-principle/god');x.raceFacts[0].results.push({wheelId:'power-divine',outcomeId:'divine-reality-rewrite',spinId:'actual-new-divine'});
  x.sizePlan=planSizeStage(x);x.sizeResult={invocationId:x.sizePlan.invocationId,spinId:'size:actual',outcomeId:x.sizePlan.outcomes[5].id};
  assert.equal(planPowerWheel(x).status,'ready');
});
test('Hard exclusions and ownership can empty a Tier without reserved mass, but never permit a None-only wheel',()=>{
  const low=design.recipes.filter(p=>p.tier===1).map(p=>p.id);const p=planPowerWheel(powerInput(),{excludedPowerIds:low});
  assert.equal(p.status,'ready');assert.equal(p.outcomes.filter(p=>p.tier===1).length,0);
  assert.throws(()=>planPowerWheel(powerInput(),{excludedPowerIds:['unknown']}),{code:'INVALID_POWER_EXCLUSIONS'});
  assert.equal(planPowerWheel(powerInput(),{excludedPowerIds:design.recipes.map(p=>p.id)}).status,'needs_configuration');
});
test('Request replay and source conflicts are explicit; a consumed main spin can never grant twice',()=>{
  const x=powerInput(),p=planPowerWheel(x),r=resolvePowerResult(p,result(p,'power-flight'));
  x.powers.push(r.atomicEffects[0]);x.consumedPowerRequestIds.push(r.requestId);
  assert.equal(planPowerWheel(x,{requestId:r.requestId}).reason,'request-already-consumed');
  const duplicate=result(p,'power-flight','size:actual');assert.throws(()=>resolvePowerResult(p,duplicate),{code:'DUPLICATE_POWER_DRAW'});
});
test('Missing stage/canonical references and foreign mastery records fail without guessing grants',()=>{
  const x=powerInput();x.stage='race';assert.equal(planPowerStage(x).status,'needs_configuration');
  const y=powerInput();y.powers=[{...own('power-flight'),definitionFile:'wrong.json'}];assert.throws(()=>planPowerWheel(y),{code:'UNKNOWN_CANONICAL_POWER'});
  const z=powerInput();z.powers=[own('power-flight')];z.consumedPowerRequestIds=planPowerStage(z).acquisitions.map(r=>r.id);z.allAcquisitionsComplete=true;
  z.sharedPowerMastery={status:'resolved',runId:'foreign',characterId:z.characterId,resolutionId:'other',retainedRawBase:9};
  assert.throws(()=>planPowerMasteryAfterAcquisitions(z),{code:'INVALID_SHARED_POWER_MASTERY'});
});
