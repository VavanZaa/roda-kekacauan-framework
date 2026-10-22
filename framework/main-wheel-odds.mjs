import raceDesign from '../content/race-wheel-design.json' with { type: 'json' };
import archetypeDesign from '../content/archetype-wheel-design.json' with { type: 'json' };
import strengthDesign from '../content/main-wheel-strength-design.json' with { type: 'json' };

export const MAIN_WHEEL_ODDS_VERSION = strengthDesign.version;

export class MainWheelOddsError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'MainWheelOddsError';
    this.code = code;
  }
}

const fail = (code, message) => { throw new MainWheelOddsError(code, message); };

/** Odds only. The caller must establish body compatibility/history before drawing. */
export function planMainWheelOdds(wheelId, {
  eligibleIds = null, excludedIds = [], weightFactors = {}, equalizerActive = false,
} = {}) {
  const rows = wheelId === 'race-family'
    ? raceDesign.mainWheel.options.map(o => ({ ...o, id: o.familyId }))
    : wheelId === 'archetype' ? archetypeDesign.wheel.outcomes : null;
  if (!rows) fail('UNKNOWN_MAIN_WHEEL', `Unknown main wheel ${wheelId}.`);
  const known = new Set(rows.map(o => o.id));
  for (const [label, ids] of [['eligibleIds', eligibleIds], ['excludedIds', excludedIds]]) {
    if (ids === null && label === 'eligibleIds') continue;
    if (!Array.isArray(ids) || ids.some(id => !known.has(id)))
      fail('UNKNOWN_WHEEL_OUTCOME', `${label} must contain canonical IDs for this wheel.`);
    if (new Set(ids).size !== ids.length)
      fail('DUPLICATE_WHEEL_OUTCOME', `${label} contains duplicate IDs.`);
  }
  if (!weightFactors || Array.isArray(weightFactors) || typeof weightFactors !== 'object')
    fail('INVALID_WEIGHT_FACTOR', 'Weight factors must be an ID-to-number map.');
  for (const [id, value] of Object.entries(weightFactors)) {
    if (!known.has(id) || !Number.isFinite(value) || value < 0)
      fail('INVALID_WEIGHT_FACTOR', 'Factors need a known ID and finite nonnegative value.');
  }
  if (typeof equalizerActive !== 'boolean')
    fail('INVALID_EQUALIZER_STATE', 'The caller must supply an explicit active-policy boolean.');
  const allowed = eligibleIds === null ? known : new Set(eligibleIds);
  const blocked = new Set(excludedIds);
  const outcomes = rows.filter(o => allowed.has(o.id) && !blocked.has(o.id))
    .map(o => ({ id: o.id, label: o.label, strengthOrder: o.strengthOrder,
      distributionBand: o.distributionBand, baseWeight: o.baseWeight,
      weight: equalizerActive ? 1 : o.baseWeight * (weightFactors[o.id] ?? 1) }))
    .filter(o => o.weight > 0).sort((a, b) => a.strengthOrder - b.strengthOrder);
  const total = outcomes.reduce((sum, o) => sum + o.weight, 0);
  if (!Number.isFinite(total) || total <= 0)
    fail('EMPTY_MAIN_WHEEL', 'No eligible positive-weight outcomes remain.');
  return { wheelId, oddsPolicyVersion: MAIN_WHEEL_ODDS_VERSION, equalizerActive,
    outcomes: outcomes.map(o => ({ ...o, probability: o.weight / total })),
    dispatchEvents: false, freezeBeforeDraw: true };
}

/** Pure inverse-CDF draw; supply one RNG sample, then commit once in the caller. */
export function selectMainWheelOutcome(plan, sample) {
  if (!Number.isFinite(sample) || sample < 0 || sample >= 1)
    fail('INVALID_RANDOM_SAMPLE', 'One sample in [0, 1) is required.');
  if (!Array.isArray(plan?.outcomes) || !plan.outcomes.length)
    fail('INVALID_MAIN_WHEEL_PLAN', 'A completed odds plan is required.');
  const total = plan.outcomes.reduce((sum, o) => sum + o.probability, 0);
  if (plan.outcomes.some(o => !Number.isFinite(o.probability) || o.probability <= 0) || Math.abs(total - 1) > 1e-12)
    fail('INVALID_MAIN_WHEEL_PLAN', 'Frozen probabilities must be positive and sum to one.');
  let cumulative = 0;
  for (const outcome of plan.outcomes) {
    cumulative += outcome.probability;
    if (sample < cumulative) return structuredClone(outcome);
  }
  return structuredClone(plan.outcomes.at(-1));
}
