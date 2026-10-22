import test from 'node:test';
import assert from 'node:assert/strict';
import { planHybridArchetypeChoices } from '../archetype-hybrid.mjs';

test('Hybrid children exclude self, duplicates and conflicting pairs in either order', () => {
  const first=planHybridArchetypeChoices();
  assert.equal(first.decision,'spin'); assert.equal(first.childOrdinal,1);
  assert.ok(!first.outcomes.some(row=>row.id==='hybrid'));
  for (const [a,b] of [['gladiator','rider'],['gladiator','disciple'],['equaliser','mage']]) {
    for (const [firstId,blocked] of [[a,b],[b,a]]) {
      const p=planHybridArchetypeChoices({firstArchetypeId:firstId});
      assert.equal(p.childOrdinal,2);
      assert.ok(!p.outcomes.some(row=>[firstId,blocked,'hybrid'].includes(row.id)));
      assert.ok(Math.abs(p.outcomes.reduce((sum,row)=>sum+row.probability,0)-1)<1e-12);
    }
  }
});

test('No possible compatible pair is a configuration gap before the first draw', () => {
  for (const eligibleIds of [[],['npc'],['gladiator','rider']])
    assert.equal(planHybridArchetypeChoices({eligibleIds}).decision,'needs_configuration');
  const p=planHybridArchetypeChoices({firstArchetypeId:'gladiator',eligibleIds:['rider']});
  assert.equal(p.decision,'needs_configuration'); assert.equal(p.firstArchetypeId,'gladiator');
});

test('Compatible schedules retain main weights, normalize after filtering and permit Equalizer', () => {
  const p=planHybridArchetypeChoices({firstArchetypeId:'gambler',eligibleIds:['npc','resilient'],weightFactors:{resilient:2}});
  assert.equal(p.decision,'spin'); assert.deepEqual(p.outcomes.map(row=>row.id),['npc','resilient']);
  assert.equal(p.outcomes[1].weight,p.outcomes[1].baseWeight*2);
  const equal=planHybridArchetypeChoices({firstArchetypeId:'equaliser',eligibleIds:['npc','gambler','mage'],equalizerActive:true});
  assert.deepEqual(equal.outcomes.map(row=>row.id),['npc','gambler']);
  assert.ok(equal.outcomes.every(row=>row.probability===.5));
});

test('Malformed/unknown first children and pool IDs cannot silently become a draw', () => {
  for (const firstArchetypeId of ['hybrid','removed-role'])
    assert.throws(()=>planHybridArchetypeChoices({firstArchetypeId}),{code:'INVALID_FIRST_ARCHETYPE'});
  assert.throws(()=>planHybridArchetypeChoices({eligibleIds:['unknown']}),{code:'UNKNOWN_WHEEL_OUTCOME'});
});
