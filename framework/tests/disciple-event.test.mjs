import test from 'node:test';
import assert from 'node:assert/strict';
import { planDiscipleMentor, planDiscipleInheritance, planDiscipleReward, resolveDiscipleInheritance, resolveDiscipleGodLesson } from '../disciple-event.mjs';

const item = (id, definitionId = id) => ({ id, definitionId, label: id,
  masteryRank: 99, enchantments: ['donor-enchant'], effectLedger: ['donor-bonus'], masteryOverrideId: 'god-max',
  bindings: { targets: ['self'] }, limitations: ['own-body-only'] });
const record = (id = 'mentor-a') => ({ characterId: id, snapshotId: `${id}:final`, name: id, status: 'complete',
  weaponInstances: [item('sword-a','sword'),item('sword-b','sword')],
  powerInstances: [item('flight'),item('shadow')], bestStatIds: ['strength','fight'], bestStatComparisonProfileId: 'approved-tier-comparison/v1' });
const archive = records => ({ id: 'archive-before-current', catalogVersion: 'test-catalog/v1', capturedBeforeCharacterId: 'current', records });
const initial = (records = [record()]) => planDiscipleMentor({ invocationId: 'current:disciple', currentCharacterId: 'current', archiveSnapshot: archive(records) });
const result = (plan,outcomeId) => ({ invocationId: plan.invocationId, spinId: `${plan.invocationId}:spin`, outcomeId });
const category = (records = [record()], chosen = records[0].characterId) => {
  const p=initial(records); return planDiscipleInheritance(p,result(p,chosen));
};
const pick = (name, records = [record()]) => { const p=category(records); return planDiscipleReward(p,result(p,name)); };
const reward = (p,index=0) => resolveDiscipleInheritance(p,{ invocationId:p.invocationId,pickId:'saved-internal-pick',outcomeId:p.choicePool[index].id });

test('Mentor pool contains completed previous characters equally, excluding current and in-progress records', () => {
  const p=initial([record(),record('mentor-b'),{characterId:'draft',status:'generating'},record('current')]);
  assert.deepEqual(p.wheel.outcomes.map(row=>row.id),['mentor-a','mentor-b']);
  assert.deepEqual(p.wheel.outcomes.map(row=>row.probability),[.5,.5]);
  assert.equal(p.wheel.allowModifiers,false);
});

test('A missing database requires configuration; a valid empty archive learns directly from God', () => {
  assert.equal(planDiscipleMentor({invocationId:'i',currentCharacterId:'c'}).decision,'needs_configuration');
  for (const records of [[], [record('current')]]) {
    const p=initial(records);
    assert.equal(p.phase,'god-lesson'); assert.equal(p.mentorLabel,'God');
    assert.equal(p.wheel.id,'power-divine'); assert.equal(p.wheel.outcomes.length,20);
    assert.ok(p.wheel.outcomes.every(row=>row.probability===.05));
    assert.ok(!('mentors' in p));
    const r=result(p,p.wheel.outcomes[0].id), e=resolveDiscipleGodLesson(p,r);
    assert.deepEqual(resolveDiscipleGodLesson(p,r),e);
    assert.equal(e.effects.length,1); assert.equal(e.effects[0].type,'grant-power');
    assert.equal(e.effects[0].masteryPolicy,'recipient-shared-power-normal');
    assert.equal(e.nextStage,'backstory');
    for (const key of ['masteryOverrideId','authorityBase','raceId','powerNoneChance','followers']) assert.ok(!(key in e.effects[0]));
    assert.throws(()=>resolveDiscipleGodLesson(p,{...r,invocationId:'another'}),{code:'DISCIPLE_SOURCE_MISMATCH'});
  }
});

test('God lesson excludes owned powers before sampling and keeps a frozen replay pool', () => {
  const all=initial([]), owned=all.wheel.outcomes[0].definitionId;
  const p=planDiscipleMentor({invocationId:'i',currentCharacterId:'current',archiveSnapshot:archive([]),ownedPowerDefinitionIds:[owned]});
  assert.equal(p.wheel.outcomes.length,19); assert.ok(p.wheel.outcomes.every(row=>row.definitionId!==owned && row.probability===1/19));
  const saved=structuredClone(p); resolveDiscipleGodLesson(p,result(p,p.wheel.outcomes[0].id)); assert.deepEqual(p,saved);
  const exhausted=planDiscipleMentor({invocationId:'i',currentCharacterId:'current',archiveSnapshot:archive([]),
    ownedPowerDefinitionIds:all.wheel.outcomes.map(row=>row.definitionId)});
  assert.equal(exhausted.decision,'needs_configuration');
});

test('Inherited power choices exclude owned definitions; an empty category stays zonk', () => {
  const c=category(), r=result(c,'power');
  const p=planDiscipleReward(c,r,{ownedPowerDefinitionIds:['flight']});
  assert.deepEqual(p.choicePool.map(row=>row.definitionId),['shadow']);
  assert.equal(p.choicePool[0].probability,1);
  assert.equal(planDiscipleReward(c,r,{ownedPowerDefinitionIds:['flight','shadow']}).outcome,'zonk');
  assert.throws(()=>planDiscipleReward(c,r,{ownedPowerDefinitionIds:['flight','flight']}),{code:'INVALID_OWNED_POWERS'});
});

test('Duplicate mentor versions cannot multiply probability; wrong snapshot boundary is rejected', () => {
  assert.throws(()=>initial([record(),record()]),{code:'DUPLICATE_MENTOR'});
  const a=archive([record()]); a.capturedBeforeCharacterId='another';
  assert.throws(()=>planDiscipleMentor({invocationId:'i',currentCharacterId:'current',archiveSnapshot:a}),{code:'INVALID_DISCIPLE_ARCHIVE'});
});

test('Category wheel remains Weapon/Power/Best Stat at 1:1:1 for an unequipped mentor', () => {
  const r=record(); r.weaponInstances=[]; r.powerInstances=[];
  const p=category([r]);
  assert.deepEqual(p.wheel.outcomes.map(row=>row.id),['weapon','power','best-stat']);
  assert.ok(p.wheel.outcomes.every(row=>row.baseWeight===1 && row.probability===1/3));
  for (const name of ['weapon','power']) {
    const zonk=planDiscipleReward(p,result(p,name));
    assert.equal(zonk.outcome,'zonk'); assert.deepEqual(zonk.effects,[]); assert.equal(zonk.nextStage,'backstory');
    assert.ok(!zonk.wheel); assert.ok(!zonk.choicePool);
  }
});

test('Only one random owned instance is selected, keeping distinct same-definition weapons eligible', () => {
  const p=pick('weapon');
  assert.equal(p.decision,'random-pick'); assert.equal(p.visibleWheel,false);
  assert.deepEqual(p.choicePool.map(row=>row.id),['sword-a','sword-b']);
  assert.deepEqual(p.choicePool.map(row=>row.probability),[.5,.5]);
  const inherited=reward(p,1); assert.equal(inherited.effects.length,1);
  assert.equal(inherited.effects[0].mentorInstanceId,'sword-b');
  assert.equal(inherited.effects[0].definitionId,'sword');
});

test('Weapon copy gets new ownership/normal mastery and intrinsic limits, with no donor mastery/enchantments/bonuses', () => {
  const e=reward(pick('weapon')).effects[0];
  assert.equal(e.type,'grant-weapon'); assert.equal(e.masteryPolicy,'recipient-per-weapon-normal');
  assert.notEqual(e.instanceId,e.mentorInstanceId); assert.equal(e.surviveMainNone,true);
  assert.deepEqual(e.bindings,{targets:['self']}); assert.deepEqual(e.limitations,['own-body-only']);
  for (const key of ['masteryRank','enchantments','effectLedger','masteryOverrideId']) assert.ok(!(key in e));
});

test('Power copy uses recipient common mastery, without copying the mentor God Authority override', () => {
  const p=pick('power'), e=reward(p).effects[0];
  assert.equal(e.type,'grant-power'); assert.equal(e.masteryPolicy,'recipient-shared-power-normal');
  assert.equal(e.definitionId,'flight'); assert.equal(e.surviveMainNone,true);
  assert.ok(!('masteryOverrideId' in e)); assert.ok(!('masteryRank' in e));
  assert.ok(p.choicePool.every(row=>row.probability===.5));
});

test('Tied best stats are equally chosen; reward adds +1 on exactly that recipient stat', () => {
  const p=pick('best-stat'); assert.deepEqual(p.choicePool.map(row=>row.stat),['strength','fight']);
  assert.deepEqual(p.choicePool.map(row=>row.probability),[.5,.5]);
  const e=reward(p,1).effects[0];
  assert.equal(e.type,'stat-flat-modifier'); assert.equal(e.stat,'fight'); assert.equal(e.amount,1);
  assert.equal(e.applyAfterImmutableBase,true); assert.ok(!('finalValue' in e));
});

test('A single candidate is used directly; all five tied stats remain valid', () => {
  const r=record(); r.powerInstances=[item('one')]; r.bestStatIds=['strength','speed','durability','intelligence','fight'];
  const p=pick('power',[r]); assert.equal(p.choicePool.length,1); assert.equal(p.choicePool[0].probability,1);
  assert.equal(reward(p).effects.length,1);
  const b=pick('best-stat',[r]); assert.ok(b.choicePool.every(row=>row.probability===.2));
});

test('Missing best-stat metadata is a configuration gap; raw stat values are never used to guess', () => {
  const r=record(); delete r.bestStatIds; delete r.bestStatComparisonProfileId;
  r.stats={strength:1,speed:999999};
  assert.deepEqual(pick('best-stat',[r]).required,['mentor-best-stat-comparison-profile']);
  assert.equal(pick('weapon',[r]).decision,'random-pick');
  for (const ids of [[],['strength','strength'],['power']]) {
    const bad=record(); bad.bestStatIds=ids;
    assert.throws(()=>pick('best-stat',[bad]),{code:'INVALID_BEST_STATS'});
  }
});

test('Snapshots/reward are pure, independent of later archive edits and stable on replay', () => {
  const records=[record()]; const before=structuredClone(records); const mentorPlan=initial(records);
  records[0].weaponInstances=[]; records.push(record('newcomer'));
  const c=planDiscipleInheritance(mentorPlan,result(mentorPlan,'mentor-a'));
  const p=planDiscipleReward(c,result(c,'weapon')), saved=structuredClone(p);
  const a=reward(p),b=reward(p); assert.deepEqual(a,b); assert.deepEqual(p,saved);
  assert.equal(a.ledgerKey,'current:disciple:disciple-inheritance');
  assert.equal(p.choicePool.length,before[0].weaponInstances.length);
  assert.equal(mentorPlan.wheel.outcomes.length,1);
});

test('Wrong sources, unknown picks and filtered/unequal category plans cannot grant a reward', () => {
  const m=initial();
  assert.throws(()=>planDiscipleInheritance(m,{...result(m,'mentor-a'),invocationId:'other'}),{code:'DISCIPLE_SOURCE_MISMATCH'});
  assert.throws(()=>planDiscipleInheritance(m,result(m,'missing')),{code:'UNKNOWN_DISCIPLE_OUTCOME'});
  const c=category(); c.wheel.outcomes=c.wheel.outcomes.slice(0,2).map(row=>({...row,probability:.5}));
  assert.throws(()=>planDiscipleReward(c,result(c,'weapon')),{code:'INVALID_DISCIPLE_PLAN'});
  const p=pick('weapon');
  assert.throws(()=>resolveDiscipleInheritance(p,{invocationId:p.invocationId,pickId:'pick',outcomeId:'missing'}),{code:'UNKNOWN_DISCIPLE_OUTCOME'});
  const bad=structuredClone(p); bad.choicePool[0].probability=.9;
  assert.throws(()=>reward(bad),{code:'INVALID_DISCIPLE_PLAN'});
});

test('Absent inventory and duplicate instance IDs are errors, not an empty category zonk', () => {
  const r=record(); delete r.weaponInstances;
  assert.throws(()=>initial([r]),{code:'INVALID_MENTOR_INVENTORY'});
  const duplicate=record(); duplicate.weaponInstances=[item('x'),item('x')];
  assert.throws(()=>initial([duplicate]),{code:'INVALID_MENTOR_INVENTORY'});
});
