import design from '../content/backstory-wheel-design.json' with { type: 'json' };

export const BACKSTORY_EVENT_VERSION = 'backstory-event/0.1.0';
export class BackstoryInputError extends Error {
  constructor(code, message) { super(message); this.name = 'BackstoryInputError'; this.code = code; }
}
const fail = (code, message) => { throw new BackstoryInputError(code, message); };
const nonempty = value => typeof value === 'string' && value.trim().length > 0;
const stats = new Set(['strength', 'speed', 'durability', 'intelligence', 'fight']);
const probabilityTargets = new Set([...stats, 'weapon-mastery', 'power-mastery', 'power', 'weapon', 'weakness', 'apex', 'title']);
const sourceKey = (...parts) => JSON.stringify(parts);
const publicOutcome = ({ id, label, baseWeight, probability }) => ({ id, label, baseWeight, probability });

function validatePool(outcomes) {
  if (!Array.isArray(outcomes) || !outcomes.length || new Set(outcomes.map(o => o?.id)).size !== outcomes.length ||
      outcomes.some(o => !nonempty(o?.id) || !nonempty(o.label) || o.baseWeight !== 1 ||
        !Number.isFinite(o.probability) || Math.abs(o.probability - 1 / outcomes.length) > 1e-12))
    fail('INVALID_BACKSTORY_POOL', 'Unique Backstory IDs, labels and equal normalized positive odds required.');
}

function validateEffect(effect) {
  if (!effect || effect.registration !== 'immediate')
    fail('INVALID_BACKSTORY_RECIPE', 'Backstory effects must register immediately.');
  if (['stat-flat-modifier', 'mastery-flat-modifier'].includes(effect.type)) {
    if (!Number.isSafeInteger(effect.amount) || effect.amount === 0 || effect.calculation !== 'final-only' ||
        (effect.type === 'stat-flat-modifier' && !stats.has(effect.stat)) ||
        (effect.type === 'mastery-flat-modifier' && ![
          ['weapon-mastery', 'all-owned-weapons'], ['power-mastery', 'all-owned-powers']
        ].some(([target, scope]) => effect.target === target && effect.scope === scope)))
      fail('INVALID_BACKSTORY_RECIPE', 'Numeric modifiers need an approved target/scope and final-only calculation.');
    return;
  }
  if (effect.type !== 'grant-power' || !nonempty(effect.definitionId) || !nonempty(effect.definitionFile) ||
      effect.mergePolicy !== 'merge-fixed-definition-with-all-source-provenance' ||
      effect.surviveMainNone !== true || effect.masteryPolicy !== 'owner-shared-resolution')
    fail('INVALID_BACKSTORY_RECIPE', 'Fixed power grant needs canonical identity, duplicate merge and owner shared mastery.');
}

function validateEvent(event) {
  if (!event || !nonempty(event.id) || event.count !== 1)
    fail('INVALID_BACKSTORY_RECIPE', 'A unique one-spin event is required.');
  if (event.type === 'general-power-spin') {
    if (event.wheelId !== 'power' || event.timing !== 'deferred' || event.stage !== 'power' ||
        event.requirePower !== true || event.excludeNone !== true || event.sequence !== 'after-main-power-acquisition' ||
        event.reaction !== 'only-after-the-actual-deferred-result')
      fail('INVALID_BACKSTORY_TIMING', 'General Power must wait for the main Power stage, with its guaranteed acquisition guard.');
    return;
  }
  if (event.timing !== 'immediate' || event.returnTo !== 'backstory-events')
    fail('INVALID_BACKSTORY_TIMING', 'Other event wheels must resolve immediately and return to Backstory.');
  if (event.type === 'special-power-spin') {
    if (!['power-android', 'power-divine'].includes(event.wheelId) || !nonempty(event.definitionFile) || event.dispatchRaceEvents !== false)
      fail('INVALID_BACKSTORY_RECIPE', 'Use an existing named power pool without dispatching the source race.');
    return;
  }
  if (event.type !== 'extra-weakness-spin' || event.wheelId !== 'weakness' || event.preserveNormalWeaknessStage !== true)
    fail('INVALID_BACKSTORY_RECIPE', 'Extra Weakness must preserve the later normal Weakness stage.');
}

function validateRecipe(outcome) {
  if (outcome?.eventStatus !== 'approved-user' || !nonempty(outcome.loreContext?.summary) ||
      outcome.loreContext.selectedBackstoryId !== outcome.id || !Array.isArray(outcome.directEffects) ||
      !Array.isArray(outcome.eventRules) || !Array.isArray(outcome.probabilityModifiers))
    fail('INVALID_BACKSTORY_RECIPE', 'An approved typed recipe and actual-result lore context are required.');
  outcome.directEffects.forEach(validateEffect);
  outcome.eventRules.forEach(validateEvent);
  if (new Set(outcome.eventRules.map(e => e.id)).size !== outcome.eventRules.length ||
      new Set(outcome.probabilityModifiers.map(p => p.id)).size !== outcome.probabilityModifiers.length)
    fail('INVALID_BACKSTORY_RECIPE', 'Event and probability-intent keys must be unique within a recipe.');
  for (const p of outcome.probabilityModifiers) {
    if (!nonempty(p?.id) || !probabilityTargets.has(p.target) || !nonempty(p.intent) ||
        p.applyBeforeFutureDraw !== true || p.retroactive !== false ||
        !['implemented-current-stat-likelihood', 'implemented-current-weapon-likelihood', 'implemented-current-power-likelihood', 'implemented-current-weakness-likelihood', 'approved-intent-pending-pool-binding'].includes(p.status) ||
        (p.status.startsWith('implemented-current-') ? !nonempty(p.numericRuleRef) : p.numericRuleRef !== null))
      fail('INVALID_BACKSTORY_RECIPE', 'Probability intents need explicit future scope and numeric-binding status.');
  }
}

function validatePlan(plan) {
  if (!plan || plan.status !== 'ready' || plan.phase !== 'backstory' || plan.version !== BACKSTORY_EVENT_VERSION ||
      !nonempty(plan.runId) || !nonempty(plan.characterId) || !nonempty(plan.invocationId) || !nonempty(plan.catalogVersion) ||
      plan.raceAndArchetypeComplete !== true || plan.wheel?.id !== 'backstory' || plan.wheel.allowModifiers !== false ||
      plan.freezeBeforeDraw !== true || plan.nextStageAfterImmediateEvents !== 'size')
    fail('INVALID_BACKSTORY_PLAN', 'A frozen owner/source-scoped Backstory plan and completed upstream stages are required.');
  validatePool(plan.wheel.outcomes);
  validatePool(plan.recipes);
  plan.recipes.forEach(validateRecipe);
  if (JSON.stringify(plan.recipes.map(publicOutcome)) !== JSON.stringify(plan.wheel.outcomes))
    fail('INVALID_BACKSTORY_PLAN', 'Frozen visible outcomes must match the saved recipes and odds.');
}

/** Freeze approved recipes before RNG. Production enablement is a separate persistent-executor concern. */
export function planBackstoryWheel(input = {}, { catalog = design, excludedOutcomeIds = [] } = {}) {
  for (const key of ['runId', 'characterId', 'invocationId'])
    if (!nonempty(input[key])) fail('INVALID_BACKSTORY_INVOCATION', `Stable ${key} required.`);
  if (input.raceAndArchetypeComplete !== true)
    return { status: 'needs_configuration', version: BACKSTORY_EVENT_VERSION,
      runId: input.runId, characterId: input.characterId, invocationId: input.invocationId,
      required: ['completed-race-and-archetype-events'] };
  if (catalog.designReady !== true || !nonempty(catalog.version) || catalog.stageId !== 'backstory' || catalog.wheel?.id !== 'backstory')
    fail('UNAPPROVED_BACKSTORY_CATALOG', 'Only a complete approved Backstory design can be planned.');
  validatePool(catalog.wheel.outcomes);
  catalog.wheel.outcomes.forEach(validateRecipe);
  if (!Array.isArray(excludedOutcomeIds) || new Set(excludedOutcomeIds).size !== excludedOutcomeIds.length ||
      excludedOutcomeIds.some(id => !catalog.wheel.outcomes.some(o => o.id === id)))
    fail('INVALID_BACKSTORY_EXCLUSIONS', 'Only unique known hard-excluded Backstory IDs are allowed.');
  const recipes = structuredClone(catalog.wheel.outcomes.filter(o => !excludedOutcomeIds.includes(o.id)));
  if (!recipes.length) return { status: 'needs_configuration', version: BACKSTORY_EVENT_VERSION,
    runId: input.runId, characterId: input.characterId, invocationId: input.invocationId, required: ['nonempty-backstory-pool'] };
  recipes.forEach(o => { o.probability = 1 / recipes.length; });
  const plan = { status: 'ready', phase: 'backstory', version: BACKSTORY_EVENT_VERSION,
    runId: input.runId, characterId: input.characterId, invocationId: input.invocationId,
    catalogVersion: catalog.version, raceAndArchetypeComplete: true, freezeBeforeDraw: true,
    nextStageAfterImmediateEvents: 'size', excludedOutcomeIds: [...excludedOutcomeIds], recipes,
    wheel: { id: 'backstory', label: catalog.wheel.label, allowModifiers: false, outcomes: recipes.map(publicOutcome) } };
  validatePlan(plan);
  return plan;
}

/** One externally supplied sample; this helper never obtains randomness or executes a child wheel. */
export function selectBackstoryOutcome(plan, sample) {
  validatePlan(plan);
  if (!Number.isFinite(sample) || sample < 0 || sample >= 1)
    fail('INVALID_RANDOM_SAMPLE', 'One external sample in [0,1) is required.');
  let mass = 0;
  for (const o of plan.wheel.outcomes) { mass += o.probability; if (sample < mass) return o.id; }
  return plan.wheel.outcomes.at(-1).id;
}

/** Resolve the saved actual result into source-once registrations, immediate children and deferred tickets. */
export function resolveBackstoryResult(plan, result) {
  validatePlan(plan);
  if (!result || result.runId !== plan.runId || result.characterId !== plan.characterId ||
      result.invocationId !== plan.invocationId || !nonempty(result.spinId))
    fail('BACKSTORY_SOURCE_MISMATCH', 'The result must belong to this frozen owner invocation.');
  const selected = plan.recipes.find(o => o.id === result.outcomeId);
  if (!selected) fail('UNKNOWN_BACKSTORY_OUTCOME', 'Actual result is absent from the frozen eligible pool.');
  const ledgerKey = sourceKey(plan.runId, plan.characterId, plan.invocationId, 'backstory-result');
  const provenance = { runId: plan.runId, characterId: plan.characterId, sourceInvocationId: plan.invocationId,
    sourceSpinId: result.spinId, sourceBackstoryId: selected.id, catalogVersion: plan.catalogVersion };
  const effects = selected.directEffects.map((effect, ordinal) => {
    const effectKey = sourceKey(plan.runId, plan.characterId, plan.invocationId, 'backstory-effect', ordinal);
    return { ...structuredClone(effect), ...provenance, id: effectKey, ledgerKey: effectKey,
      ...(effect.type === 'grant-power' ? { ownedId: effectKey } : { applyAfterImmutableBase: true }),
      triggersMasterySpinNow: false, triggersEnchantNow: false };
  });
  const immediateEvents = [], deferredPowerTickets = [];
  for (const event of selected.eventRules) {
    const childKey = sourceKey(plan.runId, plan.characterId, plan.invocationId, 'backstory-child', event.id);
    const request = { ...structuredClone(event), ...provenance, id: childKey, eventRuleId: event.id,
      invocationId: childKey, ledgerKey: childKey, actualResult: null, reactionAfterActualResult: true };
    if (event.type === 'general-power-spin') deferredPowerTickets.push({ ...request, poolFreezeStage: 'power',
      excludeOwnedPowersAtDraw: true, status: 'queued-for-power-stage' });
    else immediateEvents.push({ ...request, status: 'pending-wheel-adapter', requiredBeforeSize: true,
      ...(event.type === 'extra-weakness-spin' ? { requiredCatalogBinding: event.catalogBindingStatus } : {}),
      ...(event.type === 'special-power-spin' ? { excludeOwnedPowersAtDraw: true,
        surviveMainNone: true, masteryPolicy: 'owner-shared-resolution' } : {}) });
  }
  return { status: 'resolved', ...provenance, ledgerKey,
    backstoryFact: { outcomeId: selected.id, sourceId: plan.invocationId, spinId: result.spinId, committed: true },
    loreContext: structuredClone(selected.loreContext), effects, immediateEvents, deferredPowerTickets,
    probabilityIntents: selected.probabilityModifiers.map(p => ({ ...structuredClone(p), ...provenance,
      ledgerKey: sourceKey(plan.runId, plan.characterId, plan.invocationId, 'backstory-odds', p.id) })),
    nextStage: immediateEvents.length ? null : 'size',
    continuation: { nextStage: 'size', waitForEventIds: immediateEvents.map(e => e.id),
      policy: 'register-effects-and-tickets-once-then-drain-immediate-children-before-size' },
    replayPolicy: 'Persist frozen plan/result and consume each ledger/child/ticket key atomically once; a different result for an already committed invocation is a conflict.' };
}
