import test from 'node:test';
import assert from 'node:assert/strict';
import design from '../../content/size-wheel-design.json' with { type: 'json' };
import audit from '../../reference/size-profile-coverage.json' with { type: 'json' };
import routes from '../../content/slayer-events-design.json' with { type: 'json' };
import policy from '../../content/archetype-eligibility-design.json' with { type: 'json' };
import research from '../../reference/size-calibration-research.json' with { type: 'json' };
import { buildSizeWheel, planSizeStage, resolveSizeResult } from '../size-wheel.mjs';

function terminalPaths(family, selectors, index = 0, pairs = []) {
  if (index === selectors.length) return [pairs];
  const s = selectors[index], selected = Object.fromEntries(pairs);
  if (s.when && !Object.entries(s.when).every(([key, ids]) => ids.includes(selected[key])))
    return terminalPaths(family, selectors, index + 1, pairs);
  return policy.runtimeRules.validOutcomes[family][s.wheelId].flatMap(id =>
    terminalPaths(family, selectors, index + 1, [...pairs, [s.wheelId, id]]));
}
const close = (a, b) => assert.ok(Math.abs(a - b) < 1e-12);
const sample = family => audit.terminalCases.find(c => c.familyId === family);
const selected = (family, wheel, id) => audit.terminalCases.find(c => c.familyId === family &&
  c.input.raceFacts[0].results.some(r => r.wheelId === wheel && r.outcomeId === id));
const combine = (...cases) => ({ runId: 'composition', characterId: 'hero', invocationId: 'size',
  raceFacts: cases.map(c => structuredClone(c.input.raceFacts[0])), archetypeIds: ['mutant'] });

test('Coverage census follows every current canonical terminal identity path, including deep subtypes', () => {
  const expected = policy.runtimeRules.familyIds.flatMap(family =>
    terminalPaths(family, routes.identityRoutes[family].selectors).map(pairs => [family, ...pairs.map(p => p[1])].join('/')));
  assert.deepEqual(audit.terminalCases.map(c => c.id).sort(), expected.sort());
  assert.equal(design.profileCoverage.complete, true);
  for (const c of audit.terminalCases) {
    const plan = planSizeStage(c.input);
    assert.equal(plan.status, 'ready', c.id);
    assert.ok(plan.outcomes.length >= 2 && plan.outcomes.length <= 12, c.id);
    close(plan.outcomes.reduce((sum, o) => sum + o.probability, 0), 1);
    const result = resolveSizeResult(plan, { invocationId: plan.invocationId, spinId: 'draw', outcomeId: plan.outcomes[0].id });
    assert.deepEqual(result.effects.map(e => e.type), ['record-size']);
    assert.equal(result.next, 'strength');
  }
});

test('Every range has declared form/metric/provenance, readable support and positive frozen probabilities', () => {
  const refs = new Set(research.sources.map(s => s.id));
  for (const p of design.rangeProfiles) {
    const wheel = buildSizeWheel(p);
    assert.ok(p.bodyForm && p.dimensionSemantics && p.calibration.scope, p.id);
    assert.equal(p.compositionAxis.fromMetric, p.metric);
    assert.ok(p.calibration.sourceRefs.every(id => refs.has(id)), p.id);
    assert.equal(p.calibration.empiricallyFitted, false);
    assert.equal(wheel.outcomes[0].displayValue, p.range.min);
    assert.equal(wheel.outcomes.at(-1).displayValue, p.range.max);
    assert.equal(new Set(wheel.outcomes.map(o => o.label)).size, wheel.outcomes.length);
    assert.ok(wheel.outcomes.every(o => Number.isSafeInteger(o.displayValue) && o.probability > 0), p.id);
    close(wheel.outcomes.reduce((sum, o) => sum + o.probability, 0), 1);
  }
});

test('Hybrid/Mutant representative bodies compose across all physical families without guessing a Human body', () => {
  const families = policy.runtimeRules.familyIds.filter(f => !['hybrid', 'raksasa', 'symbiote'].includes(f));
  for (let i = 0; i < families.length; i++) for (let j = i + 1; j < families.length; j++) {
    const plan = planSizeStage(combine(sample(families[i]), sample(families[j])));
    assert.equal(plan.status, 'ready', `${families[i]} + ${families[j]}`);
    assert.equal(plan.inference.mixture.components.length, 2);
    assert.ok(plan.outcomes.every(o => o.metric === plan.profile.metric));
    close(plan.outcomes.reduce((sum, o) => sum + o.probability, 0), 1);
  }
});

test('Cross-metric composition freezes explicit extent projection and fails when declarations are missing', () => {
  const state = combine(sample('human'), selected('mythical-beast', 'dragon-form', 'sea-serpent'));
  const plan = planSizeStage(state);
  assert.equal(plan.profile.metric, 'characteristic-dimension');
  assert.equal(plan.inference.mixture.metricProjection.targetMetric, 'characteristic-dimension');
  assert.deepEqual(plan.inference.mixture.metricProjection.components.map(c => c.fromMetric), ['height', 'length']);
  const profiles = structuredClone(design.rangeProfiles);
  delete profiles.find(p => p.id === 'size-mythical-beast-sea-serpent').compositionAxis;
  assert.equal(planSizeStage(state, { profiles }).required[0], 'mixed-body-metric-profile');
  const equal = planSizeStage(state, { equalizerActive: true });
  equal.outcomes.forEach(o => close(o.probability, 1 / equal.outcomes.length));
});

test('Actual armor/color/cheat/external-pilot-mecha context does not invent a new owner body', () => {
  for (const c of audit.ownerRewardContextCases) {
    const plan = planSizeStage(c.input);
    const facts = structuredClone(c.input.raceFacts);
    facts[0].results = facts[0].results.filter(r => !['ultraman-color', 'saint-cosmic-armor', 'lantern-ring-color', 'isekai-cheat-skill', 'anime-mecha'].includes(r.wheelId));
    assert.deepEqual(plan.outcomes, planSizeStage({ ...c.input, raceFacts: facts }).outcomes, c.id);
  }
});

test('AI projection, coherent Nanobot swarm and tiny appliances keep their chosen dimension semantics', () => {
  const ai = planSizeStage(selected('machine', 'machine-type', 'ai').input);
  assert.equal(ai.profile.dimensionSemantics, 'digital-avatar-projection');
  const nano = planSizeStage(selected('machine', 'machine-type', 'nanobot').input);
  assert.equal(nano.profile.dimensionSemantics, 'swarm-envelope');
  const small = planSizeStage(selected('machine', 'machine-appliance-item', 'robot-vacuum').input);
  assert.ok(small.outcomes.every(o => o.displayUnit === 'cm' && o.displayValue >= 5 && o.displayValue <= 15));
  assert.ok(small.outcomes.length < 12);
  const result = resolveSizeResult(small, { invocationId: small.invocationId, spinId: 'size', outcomeId: small.outcomes.at(-1).id });
  assert.deepEqual(result.effects.map(e => e.type), ['record-size']);
});
