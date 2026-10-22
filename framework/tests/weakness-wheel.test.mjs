import test from 'node:test';
import assert from 'node:assert/strict';
import design from '../../content/weakness-wheel-design.json' with { type:'json' };
import backstory from '../../content/backstory-wheel-design.json' with { type:'json' };
import { planBackstoryWheel } from '../backstory-event.mjs';
import { planWeaknessWheel,selectWeaknessOutcome,resolveWeaknessResult,weaknessIdentityFingerprint } from '../weakness-wheel.mjs';
const input=(overrides={})=>({runId:'run',characterId:'actor',invocationId:'weakness-call',stage:'weakness',powerStageComplete:true,
  raceFacts:[{familyId:'human',sourceId:'race-source',committed:true,results:[]}],archetypeIds:[],archetypeFacts:[],weaknesses:[],...overrides});
const chance=(p,id)=>p.outcomes.find(o=>o.id===id)?.probability??0;
const result=(p,id)=>({runId:p.runId,characterId:p.characterId,invocationId:p.invocationId,spinId:'weakness-actual',outcomeId:id});
const resolve=(p,id,state={})=>resolveWeaknessResult(p,result(p,id),{consumedRequestIds:[],currentOwnershipFingerprint:p.ownership.fingerprint,...state});
const story=id=>({outcomeId:id,sourceId:'backstory-source',spinId:'backstory-actual',committed:true});

test('Human defaults exactly50% None, forty equal1.25% leaves and one draw, including latest Mata Silinder',()=>{
  const p=planWeaknessWheel(input());assert.equal(p.status,'ready');assert.equal(p.outcomes.length,41);
  assert.equal(chance(p,'weakness-none'),.5);for(const o of p.outcomes.slice(1))assert.equal(o.probability,.0125);
  assert.equal(design.recipes.find(r=>r.id==='astigmatism').label,'Mata Silinder');
  assert.ok(!design.recipes.some(r=>['Buta','Silau Berat'].includes(r.label)));
  assert.equal(p.trace.statMasteryBoundsApplied,false);
});
test('Conditional and lore restrictions do not subtract always-on stats; one explicit final-only Speed-1 remains signed',()=>{
  const p=planWeaknessWheel(input());
  for(const r of design.recipes.filter(r=>r.id!=='low-stamina')){const receipt=resolve(p,r.id);assert.deepEqual(receipt.effects,[]);assert.equal(receipt.newChildWheels.length,0);}
  const receipt=resolve(p,'low-stamina');assert.equal(receipt.effects.length,1);assert.equal(receipt.effects[0].stat,'speed');
  assert.equal(receipt.effects[0].amount,-1);assert.equal(receipt.effects[0].calculation,'final-only');assert.equal(receipt.effects[0].applyAfterImmutableBase,true);
  const vision=resolve(p,'astigmatism');assert.equal(vision.grant.condition.mode,'conditional');assert.equal(vision.funnyHook,null);
});
test('None preserves previous Cursed/Rage/Overload weaknesses and produces no penalty, clear, power/mastery or Enchant',()=>{
  const weaknesses=[{ownedId:'prior-rage',definitionId:'uncontrollable-rage',definitionFile:'content/goliath-events-design.json',sourceId:'goliath',committed:true,kind:'owned'}];
  const p=planWeaknessWheel(input({weaknesses})),r=resolve(p,'weakness-none');assert.deepEqual(r.ownedWeaknesses,weaknesses);
  assert.deepEqual(r.effects,[]);assert.equal(r.grant,null);assert.equal(r.masterySpinNow,false);assert.equal(r.enchantNow,false);assert.equal(r.returnTo,'apex');
});
test('Equalizer flattens every eligible leaf including None, preserves hard guards and guarantees',()=>{
  const x=input({archetypeIds:['equaliser'],archetypeFacts:[{archetypeId:'equaliser',sourceId:'role',committed:true,results:[]}],backstoryFact:story('quiet-life')});
  const p=planWeaknessWheel(x);assert.equal(chance(p,'weakness-none'),1/41);assert.ok(p.outcomes.every(o=>o.probability===1/41));assert.equal(p.trace.backstoryProfile,null);
  const q=planWeaknessWheel(x,{excludedOutcomeIds:['astigmatism'],requireWeakness:true});assert.equal(q.outcomes.length,39);
  assert.ok(q.outcomes.every(o=>o.probability===1/39));assert.ok(!q.outcomes.some(o=>['astigmatism','weakness-none'].includes(o.id)));
});
test('Four approved Backstory intentions use actual source likelihoods, preserve Human50% and frozen previous pools',()=>{
  const base=planWeaknessWheel(input());
  for(const [id,target]of [['quiet-life','go-home'],['betrayed','trust-issues'],['appeared-one-day','forgot-move'],['unsealed','seal-weak']]){
    const p=planWeaknessWheel(input({backstoryFact:story(id)}));assert.ok(chance(p,target)>chance(base,target));assert.equal(chance(p,'weakness-none'),.5);
    assert.equal(p.trace.backstoryProfile,'weakness-backstory-'+id);
    const binding=backstory.wheel.outcomes.find(o=>o.id===id).probabilityModifiers.find(p=>p.target==='weakness');
    assert.equal(binding.status,'implemented-current-weakness-likelihood');assert.equal(binding.numericRuleRef,'weakness-backstory-'+id);
  }
  assert.equal(chance(base,'go-home'),.0125);
  assert.equal(planBackstoryWheel({runId:'r',characterId:'c',invocationId:'b',raceAndArchetypeComplete:true}).status,'ready');
});
test('Test Subject extra runs before Size without future facts and returns to Backstory; main request is separate',()=>{
  const early=input({stage:'backstory',powerStageComplete:false,raceAndArchetypeComplete:true,backstoryFact:story('test-subject'),
    caller:{type:'test-subject-extra',sourceId:'backstory-source',returnTo:'backstory-events',committed:true}});
  const p=planWeaknessWheel(early);assert.equal(p.status,'ready');assert.equal(p.trace.noFutureSizeOrStats,true);
  assert.equal(resolve(p,'empty-wallet').returnTo,'backstory-events');
  const main=planWeaknessWheel(input({backstoryFact:story('test-subject')}));assert.notEqual(main.request.requestId,p.request.requestId);
  assert.equal(chance(p,'weakness-none'),.5);assert.equal(planWeaknessWheel({...early,backstoryFact:story('quiet-life')}).status,'needs_configuration');
});
test('Stable consumed request survives a new invocation; replay receipt adds no weakness, penalty or funny hook',()=>{
  const p=planWeaknessWheel(input()),r=resolve(p,'itchy-groin');assert.ok(r.requiresAtomicPersistence);assert.ok(r.funnyHook);
  const old=resolve(p,'itchy-groin',{consumedRequestIds:[p.request.requestId]});assert.equal(old.status,'already-consumed');assert.equal(old.funnyHook,null);
  const next=planWeaknessWheel(input({invocationId:'new-ui-call',consumedWeaknessRequestIds:[p.request.requestId]}));assert.equal(next.status,'skip');
});
test('Duplicate definition from separate actual early/main draws merges provenance without doubled penalty',()=>{
  const p=planWeaknessWheel(input({stage:'backstory',raceAndArchetypeComplete:true,backstoryFact:story('test-subject'),
    caller:{type:'test-subject-extra',sourceId:'backstory-source',returnTo:'backstory-events',committed:true}})),first=resolve(p,'low-stamina');
  const q=planWeaknessWheel(input({weaknesses:first.ownedWeaknesses,invocationId:'main-call',consumedWeaknessRequestIds:[p.request.requestId]}));
  assert.notEqual(p.request.requestId,q.request.requestId);
  const second=resolve(q,'low-stamina');assert.equal(second.ownedWeaknesses.length,1);assert.equal(second.grant.kind,'merge-provenance');
  assert.equal(second.ownedWeaknesses[0].provenance.length,2);assert.equal(second.effects.length,0);
});
test('CDF boundaries, selected result ownership, stale inventory and hard-ineligible outcomes are checked',()=>{
  const p=planWeaknessWheel(input());assert.equal(selectWeaknessOutcome(p,0),'weakness-none');assert.equal(selectWeaknessOutcome(p,.499999),'weakness-none');
  assert.equal(selectWeaknessOutcome(p,.5),'stage-fright');assert.equal(selectWeaknessOutcome(p,.999999),'water-weak');
  assert.throws(()=>selectWeaknessOutcome(p,1),e=>e.code==='INVALID_SAMPLE');
  assert.throws(()=>resolve(p,'stage-fright',{currentOwnershipFingerprint:'stale'}),e=>e.code==='STALE_INVENTORY');
  assert.throws(()=>resolveWeaknessResult(p,{...result(p,'stage-fright'),characterId:'other'},{consumedRequestIds:[],currentOwnershipFingerprint:p.ownership.fingerprint}),e=>e.code==='RESULT_OWNER_MISMATCH');
  const q=planWeaknessWheel(input(),{excludedOutcomeIds:['stage-fright']});assert.throws(()=>resolve(q,'stage-fright'),e=>e.code==='UNKNOWN_OUTCOME');
});
test('Non-Human needs explicit owner capability proof; no skin weakness for a digital being; equal unspecified leaves',()=>{
  const x=input({raceFacts:[{familyId:'elemental',sourceId:'race',committed:true,results:[{wheelId:'element-universal',outcomeId:'fire',spinId:'element'}]}]});
  assert.equal(planWeaknessWheel(x).status,'needs_configuration');
  x.weaknessBodyCapabilities={characterId:x.characterId,identityFingerprint:weaknessIdentityFingerprint(x.raceFacts),committed:true,capabilities:['mind','energy']};
  const p=planWeaknessWheel(x);assert.equal(p.status,'ready');assert.ok(p.outcomes.every(o=>Math.abs(o.probability-1/p.outcomes.length)<1e-12));
  assert.ok(!p.outcomes.some(o=>['itchy-groin','skin-irritation','astigmatism'].includes(o.id)));
  assert.throws(()=>planWeaknessWheel({...x,weaknessBodyCapabilities:{...x.weaknessBodyCapabilities,characterId:'external-unit'}}),e=>e.code==='BODY_OWNER_MISMATCH');
});
test('Completed wrapper ancestry inherits actual Human body; missing role/identity/stage cannot infer future or external facts',()=>{
  const x=input();x.raceFacts.push({familyId:'raksasa',sourceId:'giant',committed:true,results:[]});assert.equal(chance(planWeaknessWheel(x),'weakness-none'),.5);
  assert.equal(planWeaknessWheel(input({powerStageComplete:false})).status,'needs_configuration');
  assert.equal(planWeaknessWheel(input({archetypeIds:['equaliser'],archetypeFacts:[]})).status,'needs_configuration');
  assert.throws(()=>planWeaknessWheel(input({raceFacts:[{familyId:'goblin-caption',sourceId:'prey',committed:true,results:[]}]})),e=>e.code==='INVALID_IDENTITY');
});
test('No compatible real weakness plus no None is configuration; None-only projection safe when explicitly permitted',()=>{
  const x=input(),traits={characterId:x.characterId,identityFingerprint:weaknessIdentityFingerprint(x.raceFacts),committed:true,capabilities:[]};
  assert.equal(planWeaknessWheel({...x,weaknessBodyCapabilities:traits},{requireWeakness:true}).status,'needs_configuration');
  const p=planWeaknessWheel({...x,weaknessBodyCapabilities:traits});assert.equal(p.outcomes.length,1);assert.equal(p.outcomes[0].probability,1);
});
