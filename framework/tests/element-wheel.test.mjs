import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import element from '../../content/universal-element-wheel-design.json' with { type:'json' };
import coverage from '../../reference/size-profile-coverage.json' with { type:'json' };
import recovery from '../../reference/before-element-wheel-expansion-2026-10-11.json' with { type:'json' };
import { resolvePowerTier } from '../power-tier.mjs';
import { evaluateArchetypeNeed } from '../archetype-eligibility.mjs';
import { getSlayerTargetSelector, planSlayerTarget } from '../slayer-event.mjs';
import { planSizeStage } from '../size-wheel.mjs';
import { planStatWheel } from '../stat-odds.mjs';
import { planWeaponWheel } from '../weapon-wheel.mjs';
import { planPowerWheel, resolveFixedPowerGrant } from '../power-wheel.mjs';

const ids=['fire','water','earth','wind','lightning','ice','metal','plant','light','darkness','shadow','void'];
const node=(familyId,pairs)=>({familyId,sourceId:'owner:'+familyId,completed:true,children:[],results:pairs.map(([wheelId,outcomeId],i)=>({wheelId,outcomeId,spinId:'owner:'+familyId+':'+i}))});
const sources=ref=>JSON.parse(readFileSync(new URL('../../'+ref.definitionFile,import.meta.url),'utf8'));
function definition(value,id){if(!value||typeof value!=='object')return null;if(value.id===id)return value;for(const [key,child]of Object.entries(value)){if(/history|retired|inactive|proposal/i.test(key))continue;const found=definition(child,id);if(found)return found;}return null;}
const rowsFor=(family,id)=>({
  fae:[['fairy-subrace','element-pixie'],['element-universal',id]],
  naga:[['mythical-beast-origin','local'],['mythical-beast-local-type','naga'],['element-universal',id]],
  dragon:[['mythical-beast-origin','imported'],['mythical-beast-imported-type','dragon'],['dragon-form','western'],['element-universal',id]],
  golem:[['golem-type','element-golem'],['element-universal',id]],
  elemental:[['element-universal',id]],
  slime:[['slime-type','elemental'],['element-universal',id]],
}[family]);
test('12 equal Element leaves each resolve one exact canonical ordinary power; Void preserves Tier5 without max mastery',()=>{
  const wheel=element.wheels[0];assert.equal(wheel.id,'element-universal');assert.deepEqual(wheel.outcomes.map(o=>o.id),ids);
  assert.equal(wheel.drawCount,1);
  for(const row of wheel.outcomes){
    assert.equal(row.baseWeight,1);assert.equal(row.probability,1/12);
    assert.deepEqual(row.effects.map(e=>e.type),['record-element-affinity','grant-power']);
    const ref=row.powerDefinitionRef;assert.equal(ref.grantMode,'power');
    assert.ok(definition(sources(ref),ref.definitionId),row.id);
    const grant=row.effects[1];assert.equal(grant.definitionId,ref.definitionId);
    assert.equal(grant.definitionFile.startsWith('content/')?grant.definitionFile:'content/'+grant.definitionFile,ref.definitionFile);
    const tier=resolvePowerTier(ref);assert.equal(tier.status,'ok');assert.equal(tier.powerTier,row.id==='void'?5:3);
    assert.ok(!JSON.stringify(row.effects).includes('maximum'));
  }
});
test('Original four grants and all302 previous ratings are preserved by the append-only migration',()=>{
  const old=recovery.files['content/universal-element-wheel-design.json'];
  old.wheels[0].outcomes.forEach((row,i)=>assert.deepEqual(element.wheels[0].outcomes[i].effects,row.effects));
  const current=JSON.parse(readFileSync(new URL('../../content/power-tier-design.json',import.meta.url)));
  assert.deepEqual(current.ratings.slice(0,302),recovery.files['content/power-tier-design.json'].ratings);
  assert.equal(current.definitionCount,303);
});
test('All six actual callers accept every Element and keep their existing Archetype skip policy',()=>{
  for(const caller of ['fae','naga','dragon','golem','elemental','slime'])for(const id of ids){
    const family=['naga','dragon'].includes(caller)?'mythical-beast':caller;
    const root=node(family,rowsFor(caller,id));
    const state={raceTree:{completed:true,pendingInvocations:[],roots:[root]}};
    assert.equal(evaluateArchetypeNeed(state).decision,'skip',caller+'/'+id);
  }
});
test('Identity-only Element targets stay reward-free and support expanded body selectors',()=>{
  const selector=getSlayerTargetSelector('element-universal');
  assert.deepEqual(selector.outcomes.map(o=>o.id),ids);
  assert.ok(selector.outcomes.every(o=>o.probability===1/12&&!o.effects&&!o.powerDefinitionRef));
  for(const family of ['golem','elemental','slime'])for(const id of ids){
    const root=node(family,rowsFor(family,id));const plan=planSlayerTarget({invocationId:'victim-count',root});
    assert.equal(plan.phase,'victim-count');assert.equal(plan.wheel.profileId,'formidable');
  }
});
test('Every new elemental body route has Size and seven bounded distinct stat/mastery distributions plus Weapon/Power odds',()=>{
  const added=coverage.terminalCases.filter(c=>c.input.raceFacts[0].results.some(r=>r.wheelId==='element-universal'&&ids.slice(4).includes(r.outcomeId)));
  assert.equal(added.length,24);assert.equal(coverage.terminalCases.length,348);
  for(const c of added){
    const x=structuredClone(c.input),sizePlan=planSizeStage(x);assert.equal(sizePlan.status,'ready',c.id);
    Object.assign(x,{sizePlan,sizeResult:{invocationId:sizePlan.invocationId,spinId:'size:actual',outcomeId:sizePlan.outcomes[5].id},
      weapons:[{instanceId:'weapon:1',definitionId:'preview-weapon',sourceId:'prior:weapon',committed:true}],
      powers:[{ownedId:'power:1',definitionId:'preview-power',sourceId:'prior:power',committed:true}]});
    const signatures=[];
    for(const target of ['strength','speed','durability','intelligence','fight','weapon-mastery','power-mastery']){
      const plan=planStatWheel({...x,target,weaponInstanceId:'weapon:1'});assert.equal(plan.status,'ready',c.id+'/'+target);
      assert.ok(plan.outcomes.every(o=>o.probability>=.05-1e-12&&o.probability<=.25+1e-12));
      signatures.push(JSON.stringify(plan.outcomes.map(o=>o.probability)));
    }
    assert.equal(new Set(signatures).size,7,c.id);
    const plain={...x,invocationId:'acquisition',weapons:[],powers:[]};
    assert.equal(planWeaponWheel(plain).status,'ready',c.id);
    assert.equal(planPowerWheel({...plain,stage:'power',weaponStageComplete:true}).status,'ready',c.id);
  }
});
test('Reused Shadow/Ice grants merge existing ownership without regranting source-race or enchant events',()=>{
  for(const id of ['shadow','ice']){
    const ref=element.wheels[0].outcomes.find(o=>o.id===id).powerDefinitionRef;
    const input={runId:'run',characterId:'owner',powers:[{...ref,kind:'owned',ownedId:'prior-power',sourceId:'prior-source',committed:true}]};
    const receipt=resolveFixedPowerGrant(input,{...ref,sourceId:'element-source',sourceKey:'element:'+id});
    assert.equal(receipt.status,'resolved');assert.equal(receipt.merge,true);assert.equal(receipt.effects[0].ownedId,'prior-power');
    assert.equal(receipt.effects[0].triggersMasterySpinNow,false);assert.equal(receipt.effects[0].triggersEnchantNow,false);
  }
});
