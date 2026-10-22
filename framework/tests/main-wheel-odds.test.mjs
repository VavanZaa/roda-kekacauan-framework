import test from 'node:test';
import assert from 'node:assert/strict';
import { planMainWheelOdds, selectMainWheelOutcome } from '../main-wheel-odds.mjs';
import { planArchetypeStage, commitArchetypePlan } from '../archetype-eligibility.mjs';

const close = (a, b) => assert.ok(Math.abs(a - b) < 1e-12, `${a} != ${b}`);

for (const wheel of ['race-family', 'archetype']) {
  test(`${wheel}: full band masses follow3:2.5:2 without an extra band spin`, () => {
    const plan = planMainWheelOdds(wheel);
    for (const [band, expected] of [['weak', .4], ['moderate', 1 / 3], ['strong', 4 / 15]]) {
      const rows = plan.outcomes.filter(o => o.distributionBand === band);
      close(rows.reduce((s, o) => s + o.probability, 0), expected);
      rows.forEach(o => close(o.probability, rows[0].probability));
    }
    assert.equal(plan.dispatchEvents, false);
  });
}

test('Hard exclusions renormalize surviving sectors without replacement or band rebalancing', () => {
  const original = planMainWheelOdds('race-family');
  const filtered = planMainWheelOdds('race-family', { excludedIds: ['human', 'hybrid', 'raksasa'] });
  assert.ok(filtered.outcomes.every(o => !['human', 'hybrid', 'raksasa'].includes(o.id)));
  const find = (p, id) => p.outcomes.find(o => o.id === id);
  close(find(filtered, 'elf').probability / find(filtered, 'primordial').probability,
    find(original, 'elf').probability / find(original, 'primordial').probability);
});

test('Equalizer replaces weight biases while retaining hard exclusions, including weight-only zero', () => {
  const ordinary = planMainWheelOdds('archetype', { excludedIds: ['hybrid'], weightFactors: { npc: 0 } });
  assert.ok(!ordinary.outcomes.some(o => o.id === 'npc'));
  const equal = planMainWheelOdds('archetype', {
    excludedIds: ['hybrid'], weightFactors: { npc: 0 }, equalizerActive: true,
  });
  assert.equal(equal.outcomes.length, 27);
  assert.ok(equal.outcomes.some(o => o.id === 'npc'));
  assert.ok(!equal.outcomes.some(o => o.id === 'hybrid'));
  equal.outcomes.forEach(o => close(o.probability, 1 / 27));
});

test('Inverse-CDF boundaries select the actual weighted sector and reject invalid samples', () => {
  const plan = planMainWheelOdds('race-family');
  assert.equal(selectMainWheelOutcome(plan, 0).id, 'human');
  assert.equal(selectMainWheelOutcome(plan, 1 - Number.EPSILON).id, 'primordial');
  const boundary = plan.outcomes[0].probability;
  assert.equal(selectMainWheelOutcome(plan, boundary - Number.EPSILON).id, 'human');
  assert.equal(selectMainWheelOutcome(plan, boundary).id, plan.outcomes[1].id);
  assert.throws(() => selectMainWheelOutcome(plan, 1), { code: 'INVALID_RANDOM_SAMPLE' });
  assert.throws(() => selectMainWheelOutcome({ outcomes: [{ probability: .2 }] }, .1), { code: 'INVALID_MAIN_WHEEL_PLAN' });
});

test('Invalid/empty canonical pools cannot silently invent an eligible outcome', () => {
  assert.throws(() => planMainWheelOdds('race-family', { eligibleIds: [] }), { code: 'EMPTY_MAIN_WHEEL' });
  assert.throws(() => planMainWheelOdds('archetype', { eligibleIds: ['trickster'] }), { code: 'UNKNOWN_WHEEL_OUTCOME' });
  assert.throws(() => planMainWheelOdds('race-family', { excludedIds: ['human', 'human'] }), { code: 'DUPLICATE_WHEEL_OUTCOME' });
  assert.throws(() => planMainWheelOdds('race-family', { weightFactors: { human: -1 } }), { code: 'INVALID_WEIGHT_FACTOR' });
});

test('Archetype applies canonical weights after body filters and replays frozen odds', () => {
  const sourceId = 'test:human';
  const state = { bodyProfileId: 'test-body', raceTree: { completed: true,
    pendingInvocations: [], roots: [{ sourceId, familyId: 'human', completed: true, results: [], children: [] }] } };
  const role = (id, all) => ({ id, approved: true, eventProfile: { id: `test:${id}`, approved: true },
    requirements: { all, any: [], forbidden: [] }, compatibleSpecializations: [], boostBand: 'light' });
  const options = { profiles: { bodies: { 'test-body': { approved: true, sourceIds: [sourceId],
    capabilities: ['hands'], allowedBoostBands: ['light'] } } },
    archetypes: [role('mage', ['hands']), role('npc', [])] };
  const plan = planArchetypeStage(state, options);
  assert.deepEqual(plan.eligibleOutcomes.map(o => o.id), ['npc', 'mage']);
  close(plan.eligibleOutcomes[0].probability, .6);
  close(plan.eligibleOutcomes[1].probability, .4);
  const committed = commitArchetypePlan(state, plan);
  assert.deepEqual(planArchetypeStage(committed).eligibleOutcomes, plan.eligibleOutcomes);
  options.archetypes[0].requirements.all = ['wings'];
  assert.deepEqual(planArchetypeStage(state, options).eligibleOutcomes.map(o => [o.id, o.probability]), [['npc', 1]]);
});
