import test from 'node:test';
import assert from 'node:assert/strict';
import design from '../../content/size-wheel-design.json' with { type: 'json' };
import spec from '../spec.json' with { type: 'json' };
import { buildSizeWheel, planSizeStage, planLegacySizeStage, selectSizeOutcome, resolveSizeResult } from '../size-wheel.mjs';

const close = (a, b) => assert.ok(Math.abs(a - b) < 1e-12, `${a} != ${b}`);
const fact = (familyId, selections = []) => ({ familyId, sourceId: `identity:${familyId}`, committed: true,
  results: selections.map(([wheelId, outcomeId], i) => ({ wheelId, outcomeId, spinId: `spin:${familyId}:${i}` })) });
const input = (raceFacts, more = {}) => ({ runId: 'run', characterId: 'character', invocationId: 'size:1',
  raceFacts, archetypeIds: [], ...more });
const custom = (more = {}) => ({ id: 'custom', version: '1', metric: 'height',
  range: { min: 10, max: 1000, unit: 'm' }, spacing: 'exponential', ...more });
const pick = (plan, outcomeId) => resolveSizeResult(plan, { invocationId: plan.invocationId, spinId: 'size-draw', outcomeId });
const human = () => fact('human');
const tuyul = () => fact('lelembut', [['lelembut-origin', 'local'], ['lelembut-local-type', 'tuyul']]);
const ultraman = () => fact('cosmic-warrior', [['cosmic-warrior-group', 'ultraman'], ['ultraman-color', 'red']]);

test('User ranges become bounded whole-number Tuyul cm and Ultraman m outcomes', () => {
  const small = planSizeStage(input([tuyul()])), big = planSizeStage(input([ultraman()]));
  assert.deepEqual(small.outcomes.map(o => o.displayValue), [60, 65, 71, 76, 82, 87, 93, 98, 104, 109, 115, 120]);
  assert.deepEqual(big.outcomes.map(o => o.displayValue), [50, 52, 54, 55, 57, 59, 61, 63, 65, 66, 68, 70]);
  for (const [plan, unit] of [[small, 'cm'], [big, 'm']]) {
    assert.equal(plan.status, 'ready');
    assert.equal(plan.profile.calibration.supportBasis, 'user-range');
    plan.outcomes.forEach(o => {
      assert.equal(o.displayUnit, unit);
      assert.ok(Number.isInteger(o.displayValue));
      assert.equal(o.sizeMeters, o.sizeMillimeters / 1000);
      assert.equal(o.metric, 'height');
    });
    close(plan.outcomes.reduce((sum, o) => sum + o.probability, 0), 1);
  }
  assert.equal(small.outcomes[0].sizeMeters, .6);
  assert.equal(big.outcomes.at(-1).sizeMeters, 70);
});

test('Linear broad normal favors the middle; profile ranges cannot escape min/max', () => {
  const plan = buildSizeWheel(custom({ range: { min: 60, max: 120, unit: 'cm' }, spacing: 'linear' }));
  assert.equal(plan.outcomes.length, 12);
  assert.ok(plan.outcomes[5].probability > plan.outcomes[0].probability);
  close(plan.outcomes[0].probability, plan.outcomes.at(-1).probability);
  assert.ok(plan.outcomes.every(o => o.displayValue >= 60 && o.displayValue <= 120));
});

test('Exponential option steps use whole labels, preserve endpoints and keep spacing separate from odds', () => {
  const plan = buildSizeWheel(custom());
  assert.equal(plan.spacing, 'exponential');
  assert.equal(plan.outcomes[0].displayValue, 10);
  assert.equal(plan.outcomes.at(-1).displayValue, 1000);
  assert.equal(plan.outcomes.length, 12);
  assert.ok(plan.outcomes.every(o => Number.isInteger(o.displayValue)));
  assert.ok(plan.outcomes[5].probability > plan.outcomes.at(-1).probability);
  close(plan.outcomes[0].probability, plan.outcomes.at(-1).probability);
  const equal = buildSizeWheel(custom({ weighting: { mode: 'equal' } }));
  assert.deepEqual(equal.outcomes.map(o => o.displayValue), plan.outcomes.map(o => o.displayValue));
  equal.outcomes.forEach(o => close(o.probability, 1 / 12));
});

test('Auto spacing and rounding quantum are explicit and do not change endpoints', () => {
  const wide = buildSizeWheel(custom({ spacing: 'auto', quantum: 10 }));
  assert.equal(wide.spacing, 'exponential');
  assert.ok(wide.outcomes.every(o => o.displayValue % 10 === 0));
  const narrow = buildSizeWheel(custom({ spacing: 'auto', range: { min: 51, max: 70, unit: 'm' }, quantum: 5 }));
  assert.equal(narrow.spacing, 'linear');
  assert.equal(narrow.outcomes[0].displayValue, 51);
  assert.equal(narrow.outcomes.at(-1).displayValue, 70);
  assert.equal(new Set(narrow.outcomes.map(o => o.label)).size, narrow.outcomes.length);
});

test('Rounded duplicate sectors merge normal probability mass; uniform modes use unique sectors', () => {
  const p = custom({ range: { min: 1, max: 3, unit: 'cm' }, spacing: 'linear' });
  const plan = buildSizeWheel(p);
  assert.deepEqual(plan.outcomes.map(o => o.displayValue), [1, 2, 3]);
  assert.equal(plan.outcomes.flatMap(o => o.sampleIndices).length, 12);
  const rawMass = Array.from({ length: 12 }, (_, i) => Math.exp(-.5 * ((1 + 2 * i / 11 - 2) / 1) ** 2));
  close(plan.outcomes.reduce((s, o) => s + o.baseWeight, 0), rawMass.reduce((s, w) => s + w, 0));
  for (const opts of [{ equalizerActive: true }, {}]) {
    const equal = buildSizeWheel(opts.equalizerActive ? p : { ...p, weighting: { mode: 'equal' } }, opts);
    equal.outcomes.forEach(o => close(o.probability, 1 / 3));
  }
});

test('Equalizer replaces weight-only zero and normal biases but preserves hard exclusions', () => {
  const p = custom(), base = buildSizeWheel(p);
  const first = base.outcomes[0].id, last = base.outcomes.at(-1).id;
  const options = { excludedOutcomeIds: [last], weightFactors: { [first]: 0 } };
  const ordinary = buildSizeWheel(p, options);
  assert.equal(ordinary.outcomes.length, 10);
  const equal = buildSizeWheel(p, { ...options, equalizerActive: true });
  assert.equal(equal.outcomes.length, 11);
  assert.ok(equal.outcomes.some(o => o.id === first));
  assert.ok(!equal.outcomes.some(o => o.id === last));
  equal.outcomes.forEach(o => close(o.probability, 1 / 11));
});

test('Joint race+Archetype interval wins over family fallback; stat-only roles do not invent a range', () => {
  const regular = planSizeStage(input([human()]));
  const goliath = planSizeStage(input([human()], { archetypeIds: ['goliath'] }));
  const mage = planSizeStage(input([human()], { archetypeIds: ['mage'] }));
  assert.equal(regular.profile.id, 'human-range');
  assert.equal(goliath.profile.id, 'human-goliath-range');
  assert.deepEqual(goliath.profile.range, { min: 213, max: 244, unit: 'cm' });
  assert.equal(mage.profile.id, 'human-range');
  assert.deepEqual(goliath.identity.archetypeIds, ['goliath']);
});

test('Subtype-aware profiles separate Dwarf/Gnome and Orc roles; Oni does not borrow Orc height', () => {
  const d = planSizeStage(input([fact('dwarf', [['dwarf-gnome-type', 'dwarf']])]));
  const g = planSizeStage(input([fact('dwarf', [['dwarf-gnome-type', 'gnome']])]));
  assert.equal(d.profile.id, 'dwarf-range');
  assert.equal(g.profile.id, 'gnome-range');
  for (const role of ['orc-general', 'orc-warrior', 'shaman']) {
    assert.equal(planSizeStage(input([fact('goblinoid', [['goblin-orc-troll-type', 'orc'], ['orc-role', role]])])).profile.id, 'orc-range');
  }
  const oni = planSizeStage(input([fact('goblinoid', [['goblin-orc-troll-type', 'orc'], ['orc-role', 'oni']])]));
  assert.equal(oni.profile.id, 'size-goblinoid-oni');
  assert.deepEqual(oni.profile.range, { min: 200, max: 350, unit: 'cm' });
});

test('Lore feet convert to cm centers and readable ranges without importing source game rewards', () => {
  const cases = [
    ['dwarf-range', 4, 5, fact('dwarf', [['dwarf-gnome-type', 'dwarf']])],
    ['gnome-range', 3, 4, fact('dwarf', [['dwarf-gnome-type', 'gnome']])],
    ['orc-range', 6, 7, fact('goblinoid', [['goblin-orc-troll-type', 'orc'], ['orc-role', 'orc-warrior']])],
    ['human-goliath-range', 7, 8, human()],
  ];
  for (const [id, lowFeet, highFeet, owner] of cases) {
    const plan = planSizeStage(input([owner], { archetypeIds: id.includes('goliath') ? ['goliath'] : [] }));
    assert.equal(plan.profile.id, id);
    assert.equal(plan.outcomes[0].displayValue, Math.round(lowFeet * 30.48));
    assert.equal(plan.outcomes.at(-1).displayValue, Math.round(highFeet * 30.48));
    close(plan.weighting.center, (lowFeet + highFeet) / 2 * 30.48);
    close(plan.weighting.sigma, (highFeet - lowFeet) / 2 * 30.48);
    const result = pick(plan, plan.outcomes[0].id);
    assert.deepEqual(result.effects.map(e => e.type), ['record-size']);
    assert.deepEqual(result.followups, []);
  }
});

test('Published typical sizes set the curve peak, not the midpoint of an authored envelope', () => {
  const goblin = planSizeStage(input([fact('goblinoid', [['goblin-orc-troll-type', 'goblin']])]));
  close(goblin.weighting.center, 3 * 30.48);
  assert.equal(goblin.outcomes.reduce((best, o) => o.probability > best.probability ? o : best).displayValue, 91);
  const troll = planSizeStage(input([fact('goblinoid', [['goblin-orc-troll-type', 'troll']])]));
  close(troll.weighting.center, 9 * 30.48);
  assert.equal(troll.profile.calibration.publishedPopulationSigma, false);
});

test('Ultraman uses a declared official reference sample while user support and color independence persist', () => {
  const red = planSizeStage(input([ultraman()]));
  close(red.weighting.center, (53 + 55 + 50 + 52) / 4);
  assert.deepEqual(red.profile.range, { min: 50, max: 70, unit: 'm' });
  assert.ok(red.outcomes[1].probability > red.outcomes.at(-1).probability);
  const blue = fact('cosmic-warrior', [['cosmic-warrior-group', 'ultraman'], ['ultraman-color', 'blue']]);
  assert.deepEqual(planSizeStage(input([blue])).outcomes, red.outcomes);
  assert.equal(red.profile.calibration.empiricallyFitted, false);
});

test('Symbiote uses host, Skeleton/Zombie uses origin, wrappers do not replace body bounds', () => {
  const host = planSizeStage(input([fact('symbiote'), human()]));
  assert.equal(host.profile.id, 'human-range');
  for (const type of ['skeleton', 'zombie']) {
    const plan = planSizeStage(input([fact('lelembut', [['lelembut-origin', 'imported'], ['lelembut-imported-type', type]]), human()]));
    assert.equal(plan.profile.id, 'human-range');
  }
});

test('Compatible Hybrid/Mutant bodies form conditional mixture; explicit all-source range remains authoritative', () => {
  const facts = [fact('hybrid'), human(), fact('elf')];
  const automatic = planSizeStage(input(facts));
  assert.equal(automatic.status, 'ready');
  assert.equal(automatic.profileResolution, 'probabilistic-race-mixture');
  assert.equal(automatic.inference.mixture.components.length, 2);
  assert.equal(planLegacySizeStage(input(facts)).status, 'needs_configuration');
  const bodySizeProfile = custom({ id: 'mixed-body', range: { min: 160, max: 220, unit: 'cm' }, spacing: 'linear',
    sourceIds: facts.map(f => f.sourceId) });
  const plan = planSizeStage(input(facts, { archetypeIds: ['mutant'], bodySizeProfile }));
  assert.equal(plan.profileResolution, 'explicit-body');
  assert.equal(plan.outcomes[0].displayValue, 160);
  assert.throws(() => planSizeStage(input(facts, { bodySizeProfile: { ...bodySizeProfile, sourceIds: ['identity:human'] } })),
    { code: 'INVALID_BODY_SIZE_SCOPE' });
});

test('Missing body and equal-specificity conflicts require configuration, never random Human fallback', () => {
  assert.equal(planSizeStage(input([fact('machine')])).status, 'needs_configuration');
  const h = design.rangeProfiles.find(p => p.id === 'human-range');
  const plan = planSizeStage(input([human()]), { profiles: [h, { ...h, id: 'other-human',
    range: { min: 10, max: 20, unit: 'm' }, weighting: { mode: 'broad-normal', center: 15, sigma: 5 } }] });
  assert.equal(plan.status, 'needs_configuration');
  assert.deepEqual(plan.candidateIds, ['human-range', 'other-human']);
});

test('Raksasa anywhere overrides ordinary/mixed/Archetype ranges; all original milestones remain equal', () => {
  const facts = [fact('hybrid'), fact('symbiote'), fact('raksasa'), human(), fact('elf')];
  const plan = planSizeStage(input(facts, { archetypeIds: ['mutant', 'goliath'], bodySizeProfile: custom(), bodyMetric: 'length' }));
  assert.equal(plan.variant, 'giant');
  assert.deepEqual(plan.outcomes.map(o => o.id), Array.from({ length: 8 }, (_, i) => `giant-size-${i + 1}`));
  assert.deepEqual(plan.outcomes.map(o => o.sizeMeters), [10, 50, 100, 1000, 10000, 100000, 12756000, 1400000000]);
  plan.outcomes.forEach(o => { close(o.probability, .125); assert.equal(o.metric, 'length'); });
  const adjusted = planSizeStage(input(facts), { weightFactors: { 'giant-size-1': 2 } });
  close(adjusted.outcomes[0].probability, 2 / 9);
  assert.throws(() => planLegacySizeStage(input(facts), { weightFactors: { 'giant-size-1': 2 } }), { code: 'GIANT_WEIGHTS_LOCKED' });
  assert.equal(planSizeStage(input([fact('raksasa'), human()])).outcomes[0].metric, 'characteristic-dimension');
});

test('Frozen Size plan survives later profile/input edits; replay uses same values and source keys', () => {
  const p = { ...design.rangeProfiles.find(p => p.id === 'human-range') };
  p.range = { ...p.range };
  const state = input([human()]);
  const plan = planSizeStage(state, { profiles: [p] });
  const result = pick(plan, plan.outcomes[0].id);
  p.range.min = 10;
  state.raceFacts[0].familyId = 'raksasa';
  assert.equal(plan.profile.range.min, 150);
  assert.equal(plan.identity.raceFacts[0].familyId, 'human');
  assert.deepEqual(pick(plan, plan.outcomes[0].id), result);
  assert.equal(result.effects.length, 1);
  assert.equal(result.effects[0].type, 'record-size');
  assert.equal(result.followups.length, 0);
  assert.equal(result.next, 'strength');
});

test('Cosmic threshold is strict, frozen and character-scoped; consumption blocks repeated rewards', () => {
  const state = input([fact('raksasa'), human()]);
  const plan = planSizeStage(state);
  assert.equal(pick(plan, 'giant-size-7').followups.length, 0);
  const sun = pick(plan, 'giant-size-8');
  assert.equal(sun.followups.length, 1);
  assert.equal(sun.followups[0].wheelId, 'power-cosmic');
  assert.equal(sun.followups[0].drawCount, 1);
  const nextInvocation = planSizeStage({ ...state, invocationId: 'size:late' });
  assert.equal(pick(nextInvocation, 'giant-size-8').followups[0].activationKey, sun.followups[0].activationKey);
  const consumed = planSizeStage({ ...state, cosmicSizeRewardConsumed: true });
  assert.equal(pick(consumed, 'giant-size-8').followups.length, 0);
  // Saved plans carry the threshold; resolution must not consult a later global threshold.
  const frozenCopy = structuredClone(plan);
  frozenCopy.cosmicTrigger.thresholdMeters = 1400000000;
  assert.equal(pick(frozenCopy, 'giant-size-8').followups.length, 0);
});

test('Recorded result and inverse-CDF draw are bound to valid frozen outcomes', () => {
  const plan = planSizeStage(input([tuyul()]));
  assert.equal(selectSizeOutcome(plan, 0).id, plan.outcomes[0].id);
  assert.equal(selectSizeOutcome(plan, 1 - Number.EPSILON).id, plan.outcomes.at(-1).id);
  const boundary = plan.outcomes[0].probability;
  assert.equal(selectSizeOutcome(plan, boundary).id, plan.outcomes[1].id);
  assert.throws(() => selectSizeOutcome(plan, 1), { code: 'INVALID_RANDOM_SAMPLE' });
  assert.throws(() => selectSizeOutcome({ ...plan, outcomes: [{ probability: .2 }] }, .1), { code: 'INVALID_SIZE_PLAN' });
  const corrupt = structuredClone(plan);
  corrupt.outcomes[0].sizeMillimeters = -1;
  assert.throws(() => pick(corrupt, corrupt.outcomes[0].id), { code: 'INVALID_SIZE_PLAN' });
  const duplicate = structuredClone(plan);
  duplicate.outcomes[1].id = duplicate.outcomes[0].id;
  assert.throws(() => selectSizeOutcome(duplicate, .1), { code: 'INVALID_SIZE_PLAN' });
  assert.throws(() => resolveSizeResult(plan, { invocationId: 'other', spinId: 'spin', outcomeId: plan.outcomes[0].id }), { code: 'INVALID_SIZE_RESULT' });
  assert.throws(() => pick(plan, 'other-outcome'), { code: 'INVALID_SIZE_RESULT' });
});

test('Invalid ranges, scales, odds and identity facts fail explicitly', () => {
  for (const range of [{ min: 0, max: 10, unit: 'm' }, { min: -1, max: 10, unit: 'm' },
    { min: 1.5, max: 10, unit: 'm' }, { min: 10, max: 10, unit: 'm' },
    { min: 1, max: 10, unit: 'feet' }, { min: 1, max: Number.MAX_SAFE_INTEGER, unit: 'km' }]) {
    assert.throws(() => buildSizeWheel(custom({ range })), { code: 'INVALID_SIZE_RANGE' });
  }
  assert.throws(() => buildSizeWheel(custom({ outcomeCount: 1 })), { code: 'INVALID_SIZE_STEPS' });
  assert.throws(() => buildSizeWheel(custom({ weighting: { sigma: 0 } })), { code: 'INVALID_SIZE_WEIGHTING' });
  assert.throws(() => buildSizeWheel(custom(), { weightFactors: { 'size-mm-10000': -1 } }), { code: 'INVALID_SIZE_WEIGHTS' });
  assert.throws(() => buildSizeWheel(custom(), { excludedOutcomeIds: ['unknown'] }), { code: 'UNKNOWN_SIZE_OUTCOME' });
  assert.throws(() => planSizeStage(input([human(), human()])), { code: 'INVALID_SIZE_SOURCE' });
  assert.throws(() => planSizeStage(input([{ ...human(), committed: false }])), { code: 'INVALID_SIZE_IDENTITY' });
  assert.throws(() => planSizeStage(input([human()], { archetypeIds: ['trickster'] })), { code: 'UNKNOWN_ARCHETYPE' });
  assert.throws(() => planSizeStage(input([fact('lelembut', [['lelembut-local-type', 'invented']])])), { code: 'INVALID_SIZE_RACE_RESULT' });
});

test('Size mirrors agree, old decimal wheel is retired, and giant values/odds remain unchanged', () => {
  assert.deepEqual(spec.sizeContract.normal, design.contract.normal);
  assert.deepEqual(spec.probabilityContract.sizeDistribution.normal, design.contract.normal);
  assert.equal(design.wheels.find(w => w.id === 'size-normal').dynamicOutcomes, true);
  assert.deepEqual(design.wheels.find(w => w.id === 'size-normal').outcomes, []);
  assert.equal(design.retiredRangeTemplates[0].contract.minMultiplier, .5);
  design.wheels.find(w => w.id === 'size-raksasa').outcomes.forEach(o => {
    assert.equal(o.baseWeight, 1); assert.equal(o.probability, .125);
  });
});
