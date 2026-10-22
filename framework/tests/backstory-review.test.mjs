import test from 'node:test';
import assert from 'node:assert/strict';
import backstory from '../../content/backstory-wheel-design.json' with {type:'json'};
import spec from '../spec.json' with {type:'json'};

test('All38 proposed Backstory designs are approved with typed recipes; Orang random stays neutral',()=>{
  assert.equal(backstory.wheel.outcomes.length,38);
  assert.equal(backstory.proposals.length,38);
  assert.equal(new Set(backstory.proposals.map(p=>p.outcomeId)).size,38);
  const first=backstory.wheel.outcomes.find(o=>o.id==='random-guy');
  assert.equal(first.eventStatus,'approved-user'); assert.deepEqual(first.directEffects,[]); assert.deepEqual(first.eventRules,[]);
  assert.deepEqual(first.probabilityModifiers,[]);
  for(const o of backstory.wheel.outcomes.filter(o=>o.id!=='random-guy')){
    assert.equal(o.eventStatus,'approved-user'); assert.ok(Array.isArray(o.directEffects)); assert.ok(Array.isArray(o.eventRules));
    const draft=backstory.proposals.find(p=>p.outcomeId===o.id);
    assert.equal(draft.status,'approved-user'); assert.equal(draft.numericLikelihood,null);
  }
  assert.equal(backstory.wheel.enabled,false); assert.equal(backstory.runtimeReady,false);
  assert.deepEqual(backstory.reviewProgress.approvedEventIds,backstory.wheel.outcomes.map(o=>o.id));
  assert.equal(backstory.reviewProgress.mode,'approved-full-roster');
  assert.equal(backstory.reviewProgress.nextBackstoryId,null);
  assert.equal(backstory.reviewProgress.wholeRosterEventsComplete,true);
  assert.equal(backstory.designReady,true);
});

test('Backstory base38 equal odds and canonical IDs remain unchanged across review/contract mirrors',()=>{
  for(const o of backstory.wheel.outcomes){assert.equal(o.baseWeight,1);assert.equal(o.probability,1/38);}
  assert.equal(spec.designProgress.backstoryReview.version,backstory.version);
  assert.deepEqual(spec.designProgress.backstoryReview.approvedEventIds,backstory.reviewProgress.approvedEventIds);
  assert.deepEqual(spec.eventContract.backstoryLoreOdds.approvedLoreOnlyIds,backstory.wheel.outcomes.filter(o=>!o.directEffects.length&&!o.eventRules.length).map(o=>o.id));
  assert.equal(backstory.proposals.find(p=>p.outcomeId==='living-weapon').status,'approved-user');
  assert.equal(spec.designProgress.backstoryReview.eventRulesApproved,38);
  assert.deepEqual(spec.eventContract.backstoryEventTiming,backstory.eventTiming);
  assert.deepEqual(backstory.contracts.eventTiming,backstory.eventTiming);
  assert.equal(spec.eventFamilies.backstory.eventModule,backstory.runtime.module);
  assert.deepEqual(new Set(spec.eventFamilies.backstory.possibleBranches.flatMap(p=>p.outcomeIds)),new Set(backstory.reviewProgress.approvedEventIds));
});
