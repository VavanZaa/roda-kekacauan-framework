import test from 'node:test';
import assert from 'node:assert/strict';
import design from '../../content/size-wheel-design.json' with { type: 'json' };
import { conditionSizeOdds, compactSizePosterior } from '../conditional-size-odds.mjs';
import { planSizeStage, resolveSizeResult } from '../size-wheel.mjs';

const close = (a, b) => assert.ok(Math.abs(a - b) < 1e-12, `${a} != ${b}`);
const rows = [{ id: 'small', sizeMeters: 1, probability: .25 }, { id: 'large', sizeMeters: 2, probability: .75 }];
const likelihood = (a, b) => ({ kind: 'table', values: { small: a, large: b }, default: 1 });
const rule = (id, all, values, more = {}) => ({ id, version: '1', group: id, variants: ['normal'],
  when: { all }, likelihood: values, ...more });
const model = (rules, more = {}) => ({ id: 'test', version: '1', rules, ...more });
const fact = (familyId, selections = []) => ({ familyId, sourceId: `identity:${familyId}`, committed: true,
  results: selections.map(([wheelId, outcomeId], i) => ({ wheelId, outcomeId, spinId: `draw:${familyId}:${i}` })) });
const input = (raceFacts, more = {}) => ({ runId: 'run', characterId: 'hero', invocationId: 'size', raceFacts,
  archetypeIds: [], ...more });
const mean = outcomes => outcomes.reduce((sum, o) => sum + o.sizeMeters * o.probability, 0);

test('Bayes updates reproduce independently calculated posterior probabilities', () => {
  const one = conditionSizeOdds(rows, ['event:A'], model([rule('A', ['event:A'], likelihood(.8, .2))]));
  close(one.outcomes[0].probability, 4 / 7);
  close(one.outcomes[1].probability, 3 / 7);
  const two = conditionSizeOdds(rows, ['event:A', 'event:B'], model([
    rule('A', ['event:A'], likelihood(.8, .2)), rule('B', ['event:B'], likelihood(.5, .1)),
  ]));
  close(two.outcomes[0].probability, 20 / 23);
  close(two.outcomes[1].probability, 3 / 23);
});

test('Dependency group uses one conditional child and preserves update order invariance', () => {
  const general = rule('general', ['race:host'], likelihood(.8, .2), { group: 'body' });
  const child = rule('child', ['race:host', 'takeover:high'], likelihood(.2, .8), { group: 'body' });
  const evidence = ['race:host', 'takeover:high'];
  const a = conditionSizeOdds(rows, evidence, model([general, child]));
  const b = conditionSizeOdds(rows, [...evidence].reverse(), model([child, general]));
  close(a.outcomes[0].probability, 1 / 13);
  assert.deepEqual(a.outcomes, b.outcomes);
  assert.deepEqual(a.inference.appliedRules.map(r => r.id), ['child']);
  assert.equal(a.inference.skippedRules[0].reason, 'replaced-by-conditional-group-rule');
});

test('Encoded single evidence is not multiplied twice; explicitly declared joint interaction still applies', () => {
  const a = rule('encoded', ['race:A'], likelihood(.8, .2));
  const b = rule('joint', ['race:A', 'race:B'], likelihood(.2, .8), { interaction: true });
  const plan = conditionSizeOdds(rows, ['race:A', 'race:B'], model([a, b]), { encodedEvidence: ['race:A', 'race:B'] });
  assert.equal(plan.inference.skippedRules[0].reason, 'evidence-already-in-prior');
  assert.deepEqual(plan.inference.appliedRules.map(r => r.id), ['joint']);
  close(plan.outcomes[0].probability, 1 / 13);
});

test('Most-specific group rule resolves lower-level ties regardless of registry order', () => {
  const rules = [rule('a', ['A', 'B'], likelihood(.8, .2), { group: 'body' }),
    rule('b', ['A', 'D'], likelihood(.5, .5), { group: 'body' }),
    rule('specific', ['A', 'B', 'C'], likelihood(.2, .8), { group: 'body' })];
  const a = conditionSizeOdds(rows, ['A', 'B', 'C', 'D'], model(rules));
  const b = conditionSizeOdds(rows, ['A', 'B', 'C', 'D'], model([...rules].reverse()));
  assert.deepEqual(a.outcomes, b.outcomes);
  assert.deepEqual(a.inference.appliedRules.map(r => r.id), ['specific']);
});

test('Likelihood confidence and prior strength are tunable rather than fixed bonuses', () => {
  const rules = [rule('A', ['A'], likelihood(.8, .2))];
  const neutral = conditionSizeOdds(rows, ['A'], model(rules, { evidenceStrength: 0 }));
  close(neutral.outcomes[0].probability, .25);
  const strong = conditionSizeOdds(rows, ['A'], model(rules, { evidenceStrength: 2 }));
  close(strong.outcomes[0].probability, 16 / 19);
  const flatPrior = conditionSizeOdds(rows, [], model([], { priorStrength: 0 }));
  flatPrior.outcomes.forEach(o => close(o.probability, .5));
});

test('Log-space computation survives hundreds of tiny likelihoods without product underflow', () => {
  const rules = Array.from({ length: 400 }, (_, i) => rule(`rule-${i}`, ['observed'], likelihood(.001, .001)));
  const result = conditionSizeOdds(rows, ['observed'], model(rules));
  close(result.outcomes[0].probability, .25);
  close(result.outcomes[1].probability, .75);
  assert.doesNotThrow(() => JSON.stringify(result));
});

test('Contradictory likelihoods fail explicitly; Equalizer suppresses soft biases while preserving exclusions', () => {
  const zero = model([rule('impossible', ['A'], likelihood(0, 0))]);
  assert.throws(() => conditionSizeOdds(rows, ['A'], zero), { code: 'EMPTY_SIZE_POSTERIOR' });
  const eq = conditionSizeOdds(rows, ['A'], zero, { equalizerActive: true, excludedOutcomeIds: ['small'] });
  assert.equal(eq.outcomes.length, 1);
  assert.equal(eq.outcomes[0].id, 'large');
  assert.equal(eq.outcomes[0].probability, 1);
  assert.equal(eq.inference.unconstrainedPosteriorPossible, false);
});

test('Gaussian, interval and relative-size likelihoods behave as declared', () => {
  for (const l of [{ kind: 'relative-size', slope: 2 },
    { kind: 'gaussian', centerMeters: 2, sigma: .5, coordinate: 'linear' },
    { kind: 'gaussian', centerMeters: 2, sigma: .5, coordinate: 'log' },
    { kind: 'interval', minMeters: 1.5, maxMeters: 2, inside: .9, outside: .1 }]) {
    const result = conditionSizeOdds(rows, ['A'], model([rule('A', ['A'], l)]));
    assert.ok(result.outcomes.find(o => o.id === 'large').probability > .75);
  }
});

test('Hybrid race influence adjusts an actual mixture and readable projection preserves mass', () => {
  const state = input([fact('hybrid'), fact('human'), fact('elf')]);
  const m = { ...structuredClone(design.probabilisticModel), rules: [], mixtureWeights: { human: 3, elf: 1 } };
  const plan = planSizeStage(state, { probabilityModel: m });
  const components = plan.inference.mixture.components;
  close(components.find(c => c.familyId === 'human').mixtureProbability, .75);
  close(components.find(c => c.familyId === 'elf').mixtureProbability, .25);
  assert.equal(plan.outcomes.length, 12);
  assert.ok(plan.outcomes.every(o => Number.isInteger(o.displayValue)));
  close(plan.outcomes.reduce((s, o) => s + o.probability, 0), 1);
  assert.equal(plan.inference.projection.probabilityMassPreserved, true);
  const full = plan.inference.fullPosterior;
  close(full.flatMap(o => o.origins).filter(o => o.familyId === 'human').reduce((s, o) => s + o.priorMass, 0), .75);
  assert.equal(plan.outcomes.flatMap(o => o.sourceOutcomeIds).length, full.length);
});

test('Joint race+Archetype interaction replaces generic pair rule and affects probabilities', () => {
  const state = input([fact('hybrid'), fact('human'), fact('elf')], { archetypeIds: ['goliath'] });
  const plan = planSizeStage(state);
  assert.deepEqual(plan.inference.appliedRules.map(r => r.id), ['human-elf-goliath']);
  assert.ok(plan.inference.skippedRules.some(r => r.ruleId === 'human-elf-composition' && r.by === 'human-elf-goliath'));
  const neutral = planSizeStage(state, { probabilityModel: { ...design.probabilisticModel, evidenceStrength: 0 } });
  assert.ok(mean(plan.inference.fullPosterior) > mean(neutral.inference.fullPosterior));
});

test('Uncalibrated Takeover-height relation is neutral; host bounds and actual source evidence remain', () => {
  const state = n => input([fact('symbiote', [['symbiote-takeover', `takeover-${n}`]]), fact('human')]);
  const low = planSizeStage(state(0)), high = planSizeStage(state(100));
  high.outcomes.forEach((o, i) => close(o.probability, low.outcomes[i].probability));
  assert.equal(mean(high.outcomes), mean(low.outcomes));
  assert.deepEqual(high.outcomes.map(o => o.sizeMeters), low.outcomes.map(o => o.sizeMeters));
  assert.deepEqual(high.inference.appliedRules.map(r => r.id), ['symbiote-100']);
  assert.ok(high.inference.evidenceSources.some(s => s.sourceId === 'draw:symbiote:0'));
  const result = resolveSizeResult(high, { invocationId: high.invocationId, spinId: 'size-draw', outcomeId: high.outcomes[0].id });
  assert.deepEqual(result.effects.map(e => e.type), ['record-size']);
});

test('All takeover percentages preserve calibrated host odds until a numeric relation is supplied', () => {
  const base = planSizeStage(input([fact('human')]));
  for (let n = 0; n <= 100; n += 10) {
    const plan = planSizeStage(input([fact('symbiote', [['symbiote-takeover', `takeover-${n}`]]), fact('human')]));
    assert.deepEqual(plan.outcomes.map(o => [o.id, o.probability]), base.outcomes.map(o => [o.id, o.probability]));
  }
});

test('Source provenance and numeric assumptions are frozen with component profiles and model', () => {
  const profiles = structuredClone(design.rangeProfiles), m = structuredClone(design.probabilisticModel);
  const plan = planSizeStage(input([fact('hybrid'), fact('human'), fact('elf')]), { profiles, probabilityModel: m });
  const originalUrl = profiles.find(p => p.id === 'human-range').calibration.referenceSources[0].url;
  profiles.find(p => p.id === 'human-range').calibration.referenceSources[0].url = 'later-edit';
  m.rules.find(r => r.id === 'human-elf-composition').calibration.referenceSources[0].url = 'later-edit';
  assert.equal(plan.inference.mixture.components.find(c => c.familyId === 'human').profile.calibration.referenceSources[0].url, originalUrl);
  assert.ok(plan.probabilityModel.rules.find(r => r.id === 'human-elf-composition').calibration.referenceSources[0].url.startsWith('https://www.dndbeyond.com/'));
  assert.equal(plan.probabilityModel.sourceCalibration.empiricallyFitted, false);
  assert.equal(plan.probabilityModel.version, '3');
});

test('Equalizer makes final displayed mixed wheel uniform while retaining a hard exclusion', () => {
  const state = input([fact('hybrid'), fact('human'), fact('elf')]);
  const base = planSizeStage(state);
  const banned = base.inference.fullPosterior[0].id;
  const plan = planSizeStage(state, { equalizerActive: true, excludedOutcomeIds: [banned] });
  assert.ok(!plan.outcomes.some(o => o.id === banned));
  assert.ok(plan.outcomes.every(o => !(o.sourceOutcomeIds ?? []).includes(banned)));
  plan.outcomes.forEach(o => close(o.probability, 1 / plan.outcomes.length));
});

test('Compacted Equalizer override retains missing posterior rather than inventing posterior probabilities', () => {
  const many = Array.from({ length: 20 }, (_, i) => ({ id: `p${i}`, sizeMeters: i + 1, probability: 1 / 20 }));
  const r = rule('zero', ['A'], { kind: 'table', values: {}, default: 0 });
  const posterior = conditionSizeOdds(many, ['A'], model([r]), { equalizerActive: true });
  const projected = compactSizePosterior(posterior.outcomes, 12, { equalizerActive: true });
  projected.outcomes.forEach(o => { close(o.probability, 1 / 12); assert.equal(o.posteriorProbability, null); });
});

test('Giant remains eight/default equal; explicit giant evidence can adjust odds without changing Cosmic guard', () => {
  const state = input([fact('raksasa'), fact('symbiote', [['symbiote-takeover', 'takeover-100']]), fact('human')]);
  const plain = planSizeStage(state);
  plain.outcomes.forEach(o => close(o.probability, 1 / 8));
  assert.equal(plain.inference.appliedRules.length, 0);
  const r = rule('giant-context', ['race:symbiote'], { kind: 'relative-size', slope: 1 }, { variants: ['giant'] });
  const tuned = planSizeStage(state, { probabilityModel: model([r]) });
  assert.deepEqual(tuned.outcomes.map(o => o.id), plain.outcomes.map(o => o.id));
  assert.ok(tuned.outcomes.at(-1).probability > tuned.outcomes[0].probability);
  const resolve = id => resolveSizeResult(tuned, { invocationId: tuned.invocationId, spinId: 'draw', outcomeId: id });
  assert.equal(resolve('giant-size-7').followups.length, 0);
  assert.equal(resolve('giant-size-8').followups.length, 1);
});

test('Frozen model/posterior is JSON-safe and remains stable after external model/identity edits', () => {
  const m = structuredClone(design.probabilisticModel);
  const state = input([fact('hybrid'), fact('human'), fact('elf')]);
  const plan = planSizeStage(state, { probabilityModel: m });
  const saved = JSON.parse(JSON.stringify(plan));
  m.rules.length = 0;
  state.archetypeIds.push('goliath');
  assert.equal(plan.probabilityModel.rules.length, 7);
  assert.deepEqual(plan.outcomes, saved.outcomes);
  const result = { invocationId: plan.invocationId, spinId: 'saved-draw', outcomeId: plan.outcomes[0].id };
  assert.deepEqual(resolveSizeResult(plan, result), resolveSizeResult(saved, result));
  assert.notDeepEqual(planSizeStage(state, { probabilityModel: m }).outcomes, plan.outcomes);
});

test('Missing component/range or incompatible metric needs configuration instead of invented anatomy', () => {
  const absent = planSizeStage(input([fact('hybrid'), fact('human'), fact('machine')]));
  assert.equal(absent.status, 'needs_configuration');
  const profiles = structuredClone(design.rangeProfiles);
  profiles.find(p => p.id === 'elf-range').metric = 'length';
  assert.equal(planSizeStage(input([fact('human'), fact('elf')]), { profiles }).required[0], 'mixed-body-metric-profile');
});

test('Bad model knobs, probabilities, ambiguous dependencies and unsupported evidence fail explicitly', () => {
  assert.throws(() => conditionSizeOdds(rows, ['A'], model([rule('A', ['A'], likelihood(2, .2))])), { code: 'INVALID_SIZE_LIKELIHOOD' });
  assert.throws(() => conditionSizeOdds(rows, ['A'], model([], { evidenceStrength: -1 })), { code: 'INVALID_SIZE_PROBABILITY_MODEL' });
  assert.throws(() => conditionSizeOdds(rows, ['A'], model([rule('a', ['A'], likelihood(.1, .1), { group: 'same' }),
    rule('b', ['A'], likelihood(.2, .2), { group: 'same' })])), { code: 'AMBIGUOUS_SIZE_EVIDENCE' });
  assert.throws(() => conditionSizeOdds(rows, ['A', 'A'], model([])), { code: 'INVALID_SIZE_EVIDENCE' });
  assert.throws(() => conditionSizeOdds(rows, ['A'], model([rule('a', ['A'], likelihood(.1, .1), { interaction: true })])), { code: 'INVALID_SIZE_EVIDENCE_RULE' });
  assert.throws(() => compactSizePosterior(rows, 1), { code: 'INVALID_SIZE_DISPLAY_COUNT' });
  assert.throws(() => planSizeStage(input([fact('human')]), { probabilityModel: { ...design.probabilisticModel,
    mixtureWeights: { human: 0 } } }), { code: 'INVALID_SIZE_MIXTURE' });
});
