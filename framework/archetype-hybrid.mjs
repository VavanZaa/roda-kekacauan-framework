import design from '../content/archetype-hybrid-events-design.json' with { type: 'json' };
import { planMainWheelOdds, MainWheelOddsError } from './main-wheel-odds.mjs';

export class HybridArchetypeInputError extends Error {
  constructor(code, message) { super(message); this.name = 'HybridArchetypeInputError'; this.code = code; }
}

const compatible = (first, second) => first !== second && !design.pairCompatibility.incompatiblePairs
  .some(pair => pair.ids.includes(first) && pair.ids.includes(second));

/** Filter before either draw. No RNG, body inference, event execution or mutation. */
export function planHybridArchetypeChoices({
  firstArchetypeId = null, eligibleIds = null, weightFactors = {}, equalizerActive = false,
} = {}) {
  const canonical = planMainWheelOdds('archetype').outcomes.map(row => row.id);
  if (firstArchetypeId !== null && (firstArchetypeId === 'hybrid' || !canonical.includes(firstArchetypeId)))
    throw new HybridArchetypeInputError('INVALID_FIRST_ARCHETYPE', 'The committed first child must be a canonical non-Hybrid Archetype.');
  const options = { eligibleIds, excludedIds: ['hybrid'], weightFactors, equalizerActive };
  const source = { ruleVersion: design.version, childOrdinal: firstArchetypeId === null ? 1 : 2,
    firstArchetypeId, freezeBeforeDraw: true, dispatchEvents: false };
  let initial;
  try { initial = planMainWheelOdds('archetype', options); }
  catch (error) {
    if (error instanceof MainWheelOddsError && error.code === 'EMPTY_MAIN_WHEEL')
      return { ...source, decision: 'needs_configuration', required: ['compatible-two-archetype-pool'] };
    throw error;
  }
  const ids = initial.outcomes.map(row => row.id);
  const filtered = firstArchetypeId === null
    ? ids.filter(id => ids.some(partner => compatible(id, partner)))
    : ids.filter(id => compatible(firstArchetypeId, id));
  if (!filtered.length)
    return { ...source, decision: 'needs_configuration', required: ['compatible-two-archetype-pool'] };
  return { ...planMainWheelOdds('archetype', { ...options, eligibleIds: filtered }), ...source, decision: 'spin' };
}
