import test from 'node:test';
import assert from 'node:assert/strict';
import design from '../../content/primordial-events-design.json' with { type: 'json' };
import { planArchetypeStage } from '../archetype-eligibility.mjs';
import { planSlayerTarget, getSlayerTargetSelector } from '../slayer-event.mjs';
import { resolvePowerTier } from '../power-tier.mjs';

const state = (familyId, id) => ({ raceTree: { completed: true, pendingInvocations: [], roots: [{
  sourceId: 'race:primordial:1', familyId, completed: true,
  results: [{ spinId: 'identity:1', wheelId: 'primordial-identity', outcomeId: id }], children: [],
}] } });

test('owned Primordial completes its identity then skips Archetype without body guesses', () => {
  for (const id of ['neith', 'ymir']) {
    const plan = planArchetypeStage(state('primordial', id));
    assert.equal(plan.decision, 'skip');
    assert.equal(plan.nextStage, 'backstory');
  }
  const incomplete = state('primordial', 'atum');
  incomplete.raceTree.roots[0].results = [];
  assert.throws(() => planArchetypeStage(incomplete), { code: 'RACE_RESULT_MISSING' });
});

test('victim Primordial is identity-only and cannot leak its race or Champion reward recipe', () => {
  const selector = getSlayerTargetSelector('primordial-identity');
  assert.equal(selector.outcomes.length, 11);
  assert.equal(selector.dispatchEvents, false);
  assert.ok(selector.outcomes.every(x => !('grants' in x) && !('raceRewardProfileId' in x)));
  const plan = planSlayerTarget({ invocationId: 'slayer:1', root: {
    familyId: 'primordial', sourceId: 'target:1', results: [{ spinId: 'target-identity:1', wheelId: 'primordial-identity', outcomeId: 'tiamat' }], children: [],
  } });
  assert.equal(plan.phase, 'victim-count');
  assert.equal(plan.profileId ?? plan.quantityProfileId ?? plan.wheel?.profileId, 'divine');
});

test('new canonical powers resolve tiers independently of recipe budget and mastery', () => {
  for (const power of design.powers) {
    const result = resolvePowerTier({ definitionFile: 'content/primordial-events-design.json', definitionId: power.id, masteryRank: 0 });
    assert.equal(result.status, 'ok');
    assert.equal(result.powerTier, power.powerTier);
    assert.ok(!('masteryRank' in result) && !('budgetTotal' in result));
  }
});
