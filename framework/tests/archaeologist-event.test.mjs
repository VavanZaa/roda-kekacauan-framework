import test from 'node:test';
import assert from 'node:assert/strict';
import design from '../../content/archaeologist-events-design.json' with { type: 'json' };
import research from '../../reference/archaeologist-fauna-research.json' with { type: 'json' };
import { planArchaeologistDiscovery, resolveArchaeologistDiscovery } from '../archaeologist-event.mjs';

const plan = () => planArchaeologistDiscovery({ invocationId:'character:role:archaeologist',catalogVersion:'test-catalog/v1' });
const result = (p,id) => ({ invocationId:p.invocationId,spinId:`${p.invocationId}:actual-spin`,outcomeId:id });
const reward = id => { const p=plan(); return resolveArchaeologistDiscovery(p,result(p,id)); };

test('Exactly 32 unique equally likely discoveries, public wheel without uncommitted rewards', () => {
  const p=plan(); assert.equal(p.wheel.outcomeCount,32); assert.equal(p.wheel.outcomes.length,32);
  assert.equal(new Set(p.wheel.outcomes.map(o=>o.id)).size,32);
  assert.ok(p.wheel.outcomes.every(o=>o.baseWeight===1 && o.probability===1/32));
  assert.ok(p.wheel.outcomes.every(o=>Object.keys(o).sort().join()==='baseWeight,id,label,probability'));
  assert.equal(p.wheel.allowModifiers,false);
});

test('Display chronology uses broad finding groups, with scientific sources separate from gameplay budget', () => {
  const rank=Object.fromEntries(design.timelineGroups.map(g=>[g.id,g.order]));
  const sourceIds=new Set(research.sources.map(s=>s.id));
  design.wheel.outcomes.forEach((o,i)=>{
    assert.equal(o.displayOrder,i+1); assert.ok(o.timelineId in rank);
    if(i)assert.ok(rank[o.timelineId]>=rank[design.wheel.outcomes[i-1].timelineId]);
    if(!o.isCurrentTimeline)assert.ok(o.sourceIds.length);
    o.sourceIds.forEach(id=>assert.ok(sourceIds.has(id)));
  });
  assert.equal(design.wheel.outcomes.find(o=>o.id==='mosasaurus').timelineId,'late-cretaceous');
  assert.equal(design.wheel.outcomes.find(o=>o.id==='dimetrodon').timelineId,'early-permian');
  assert.equal(design.wheel.outcomes.find(o=>o.id==='paraceratherium').nameResolution.status,'user-confirmed');
});

test('All nine current-timeline animals grant nothing, including powerful Elephant and dinosaur-descended Chicken', () => {
  const modern=design.wheel.outcomes.filter(o=>o.isCurrentTimeline);assert.equal(modern.length,9);
  for(const o of modern){const r=reward(o.id);assert.equal(r.budgetPoints,0);assert.deepEqual(r.effects,[]);assert.equal(r.nextStage,'backstory');assert.ok(r.ledgerKey);}
  assert.equal(reward('elephant').budgetPoints,0); assert.equal(reward('chicken').budgetPoints,0);
});

test('Every past package totals 1..3 exactly, without applying budget metadata as an extra stat boost', () => {
  for(const o of design.wheel.outcomes.filter(o=>!o.isCurrentTimeline)){
    const r=reward(o.id),points=r.effects.reduce((n,e)=>n+(e.type==='grant-power'?2:e.amount),0);
    assert.equal(points,o.reward.budgetPoints);assert.equal(points,r.budgetPoints);assert.ok(points>=1 && points<=3);
    assert.equal(r.effects.length,o.reward.statBuffs.length+o.reward.powerRefs.length);
  }
  assert.equal(reward('dodo').budgetPoints,1);
  assert.equal(reward('smilodon').effects.length,1);assert.equal(reward('smilodon').effects[0].type,'grant-power');
  assert.deepEqual(reward('paraceratherium').effects.map(e=>[e.stat,e.amount]),[['strength',2],['durability',1]]);
});

test('Older alone does not guarantee max: Coelophysis gets one point, while T-rex gets power plus one Strength', () => {
  assert.equal(reward('coelophysis').budgetPoints,1);
  const r=reward('tyrannosaurus-rex');assert.equal(r.budgetPoints,3);
  assert.deepEqual(r.effects.map(e=>e.type),['stat-flat-modifier','grant-power']);
  assert.equal(r.effects[0].stat,'strength');assert.equal(r.effects[0].amount,1);
  assert.equal(r.effects[1].definitionId,'fossil-fangs');
});

test('All six powers are defined once, bound to the selected discovery and use normal shared mastery', () => {
  assert.equal(design.powers.length,6);assert.equal(new Set(design.powers.map(p=>p.id)).size,6);
  for(const o of design.wheel.outcomes){
    for(const ref of o.reward.powerRefs)assert.equal(design.powers.filter(p=>p.id===ref.definitionId).length,1);
    for(const e of reward(o.id).effects.filter(e=>e.type==='grant-power')){
      assert.equal(e.bindings.findingAnimalId,o.id);assert.equal(e.masteryPolicy,'recipient-shared-power-normal');assert.equal(e.surviveMainNone,true);
      for(const key of ['familyId','masteryOverrideId','masteryRank','enchantment','weaponId','armorId','size'])assert.ok(!(key in e));
    }
  }
});

test('No extra wheels, animal Race events, pets, weapons, transformations or funny-result hook are emitted', () => {
  for(const id of ['chicken','smilodon','tyrannosaurus-rex','ankylosaurus']){
    const r=reward(id);
    assert.ok(r.effects.every(e=>['grant-power','stat-flat-modifier'].includes(e.type)));
    for(const key of ['raceTree','usedRaceFamilyIds','extraSpins','pets','weapons','revivedAnimal','funnyResult'])assert.ok(!(key in r));
  }
});

test('Frozen reward survives later design changes; resolver is pure and stable with an atomic source key', () => {
  const p=plan(),before=structuredClone(p),row=design.wheel.outcomes.find(o=>o.id==='tyrannosaurus-rex'),old=structuredClone(row.reward);
  try{
    row.reward={budgetPoints:1,statBuffs:[{stat:'speed',amount:1}],powerRefs:[]};
    const r=result(p,'tyrannosaurus-rex'),a=resolveArchaeologistDiscovery(p,r),b=resolveArchaeologistDiscovery(p,r);
    assert.deepEqual(a,b);assert.deepEqual(p,before);assert.equal(a.budgetPoints,3);assert.equal(a.effects.length,2);
    assert.equal(a.ledgerKey,'character:role:archaeologist:archaeologist-reward');assert.equal(new Set(a.effects.map(e=>e.id)).size,2);
  }finally{row.reward=old;}
});

test('Wrong source, unknown result and corrupt odds cannot create rewards', () => {
  const p=plan();
  assert.throws(()=>resolveArchaeologistDiscovery(p,{...result(p,'chicken'),invocationId:'wrong'}),{code:'DISCOVERY_SOURCE_MISMATCH'});
  assert.throws(()=>resolveArchaeologistDiscovery(p,result(p,'paramecium')),{code:'UNKNOWN_DISCOVERY_OUTCOME'});
  const bad=structuredClone(p);bad.wheel.outcomes[0].probability=.2;
  assert.throws(()=>resolveArchaeologistDiscovery(bad,result(bad,'chicken')),{code:'INVALID_DISCOVERY_POOL'});
  assert.throws(()=>planArchaeologistDiscovery({invocationId:'missing-catalog'}),{code:'INVALID_DISCOVERY_INVOCATION'});
});

test('Invalid modern bonuses, >3 budgets, negative/fractional buffs and duplicate effects fail validation', () => {
  const changes=[
    row=>{row.reward={budgetPoints:1,statBuffs:[{stat:'strength',amount:1}],powerRefs:[]};},
    row=>{row.isCurrentTimeline=false;row.timelineId='past';row.reward={budgetPoints:4,statBuffs:[{stat:'strength',amount:4}],powerRefs:[]};},
    row=>{row.reward.statBuffs=[{stat:'strength',amount:-1}];},
    row=>{row.reward.statBuffs=[{stat:'speed',amount:.5}];},
    row=>{row.reward.statBuffs=[{stat:'speed',amount:1},{stat:'speed',amount:1}];}
  ];
  for(const change of changes){const p=plan();change(p.findings[0]);assert.throws(()=>resolveArchaeologistDiscovery(p,result(p,'chicken')));}
});
