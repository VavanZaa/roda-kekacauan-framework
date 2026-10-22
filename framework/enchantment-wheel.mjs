import design from '../content/enchantment-wheel-design.json' with { type: 'json' };

export const ENCHANTMENT_VERSION = 'enchantment-wheel/1.0.0';
export class EnchantmentWheelError extends Error {
  constructor(code, message) { super(message); this.name = 'EnchantmentWheelError'; this.code = code; }
}
const fail = (code, message) => { throw new EnchantmentWheelError(code, message); };
const nonempty = x => typeof x === 'string' && x.trim().length > 0;
const key = (...parts) => JSON.stringify(parts);
const sum = xs => xs.reduce((s, x) => s + x, 0);
const copy = x => structuredClone(x);
const capabilities = new Set(['physical-item', 'edge', 'grip', 'metal', 'powered', 'elongated', 'projectile', 'binding']);

function validateRecipe(e) {
  if (!nonempty(e?.id) || !nonempty(e.label) || !nonempty(e.context) || !Number.isSafeInteger(e.tier) || e.tier < 1 || e.tier > 5 ||
      !Number.isSafeInteger(e.catalogOrder) || e.catalogOrder < 1 || e.baseWeight !== 1 ||
      typeof e.funnyResult !== 'boolean' || !Array.isArray(e.tags) || e.funnyResult !== e.tags.includes('funny-result') ||
      !Array.isArray(e.requiresAll) || !e.requiresAll.length || new Set(e.requiresAll).size !== e.requiresAll.length ||
      e.requiresAll.some(c => !capabilities.has(c)) || e.effect?.scope !== 'selected-weapon-instance' ||
      !nonempty(e.effect.mechanic) || !e.effect.parameters || typeof e.effect.parameters !== 'object' || Array.isArray(e.effect.parameters) ||
      ['statModifiers', 'masteryModifiers', 'grantsPowers', 'grantsWeapons'].some(k => !Array.isArray(e[k]) || e[k].length))
    fail('INVALID_ENCHANT_RECIPE', 'Enchant needs an explicit compatible weapon-local recipe without owner grants or numerical stat bonuses.');
}
function validateBinding(b) {
  if (!nonempty(b?.id) || !nonempty(b.definitionFile) || !nonempty(b.definitionId) || typeof b.enchantable !== 'boolean' ||
      !Array.isArray(b.capabilities) || new Set(b.capabilities).size !== b.capabilities.length ||
      b.capabilities.some(c => !capabilities.has(c)) || (b.enchantable && !b.capabilities.includes('physical-item')))
    fail('INVALID_ENCHANT_BINDING', 'Explicit canonical artifact/capability binding required.');
}
function validateCatalog(catalog, extras) {
  if (catalog.version !== ENCHANTMENT_VERSION || catalog.wheel?.id !== 'enchant' || catalog.wheel.baseProbability !== 'equal-per-eligible-option' ||
      catalog.contract?.threshold !== 5 || catalog.contract.slotsPerWeapon !== 1 || !Array.isArray(catalog.enchantments) ||
      catalog.enchantments.length !== 60 || new Set(catalog.enchantments.map(e => e.id)).size !== 60 ||
      new Set(catalog.enchantments.map(e => e.catalogOrder)).size !== 60 || !Array.isArray(catalog.compatibilityBindings) || !Array.isArray(extras))
    fail('INVALID_ENCHANT_CATALOG', 'Use60 unique equal-base recipes, one slot and final Master5 gate.');
  catalog.enchantments.forEach(validateRecipe);
  const bindings = [...catalog.compatibilityBindings, ...extras];
  bindings.forEach(validateBinding);
  if (new Set(bindings.map(b => key(b.definitionFile, b.definitionId))).size !== bindings.length)
    fail('DUPLICATE_ENCHANT_BINDING', 'Each canonical weapon definition needs one unambiguous binding.');
  return bindings;
}

// Immutable raw bases and committed distinct sources only; no repeated projection sums.
function effectiveMastery(input) {
  const m = input.mastery;
  if (!m || !nonempty(m.resolutionId) || m.weaponInstanceId !== input.weapon.instanceId ||
      !Number.isSafeInteger(m.retainedRawBase) || m.retainedRawBase < 0 || m.retainedRawBase > 9 || !Array.isArray(m.modifiers))
    fail('INVALID_ENCHANT_MASTERY', 'Use the selected active weapon retained raw0..9 resolution and its final modifier ledger.');
  if (new Set(m.modifiers.map(x => x.sourceKey)).size !== m.modifiers.length)
    fail('DUPLICATE_MASTERY_SOURCE', 'Each final modifier source is counted once.');
  for (const modifier of m.modifiers) {
    if (!nonempty(modifier.sourceKey) || !Number.isSafeInteger(modifier.amount) || modifier.committed !== true ||
        (modifier.targetWeaponInstanceId !== null && !nonempty(modifier.targetWeaponInstanceId)))
      fail('INVALID_MASTERY_SOURCE', 'Committed integral bonus/debuff with exact weapon target or explicit null for all weapons required.');
  }
  const applied = m.modifiers.filter(x => x.targetWeaponInstanceId === null || x.targetWeaponInstanceId === input.weapon.instanceId);
  const value = m.retainedRawBase + sum(applied.map(x => x.amount));
  if (!Number.isSafeInteger(value)) fail('UNSAFE_MASTERY_VALUE', 'Final signed mastery must be an exact integer.');
  return { rawBase: m.retainedRawBase, resolutionId: m.resolutionId, modifiers: copy(m.modifiers), appliedSourceKeys: applied.map(x => x.sourceKey), effective: value };
}

/** Final-phase pure planner. Returns a frozen recipe/pool or explicit skip/configuration reason. */
export function planEnchantmentWheel(input, { catalog = design, extraBindings = [], excludedEnchantmentIds = [] } = {}) {
  const bindings = validateCatalog(catalog, extraBindings);
  if (![input?.runId, input?.characterId, input?.invocationId].every(nonempty))
    fail('MISSING_ENCHANT_IDENTITY', 'Owner run/character/invocation IDs required.');
  const common = { version: ENCHANTMENT_VERSION, catalogVersion: catalog.version, runId: input.runId, characterId: input.characterId,
    invocationId: input.invocationId, freezeBeforeDraw: true, wheelId: 'enchant', stage: 'finalize' };
  const needs = required => ({ ...common, status: 'needs_configuration', actualSpin: false, required });
  const skip = reason => ({ ...common, status: 'skip', actualSpin: false, reason });
  if (input.stage !== 'finalize' || input.finalPhase?.priorEventsComplete !== true || !nonempty(input.finalPhase?.snapshotId))
    return needs(['completed-prior-events-and-final-bonus-snapshot']);
  const w = input.weapon;
  if (!w || !nonempty(w.instanceId) || w.ownerCharacterId !== input.characterId || w.runId !== input.runId ||
      !nonempty(w.definitionId) || !nonempty(w.definitionFile) || !Array.isArray(w.enchantments))
    fail('INVALID_ENCHANT_WEAPON', 'Exact owned weapon instance, definition and enchantment history required.');
  if (w.kind !== 'weapon') return skip('not-a-weapon');
  if (w.activeStatus === 'discarded') return skip('discarded-weapon');
  if (w.activeStatus !== 'active') return needs(['explicit-active-owned-weapon']);
  const slotKey = key(input.runId, input.characterId, w.instanceId, 'enchant', 0);
  if (!Array.isArray(input.consumedSlotKeys) || input.consumedSlotKeys.some(x => !nonempty(x)))
    fail('INVALID_ENCHANT_LEDGER', 'Explicit consumed slot ledger required.');
  if (input.consumedSlotKeys.includes(slotKey) || w.enchantments.some(e => e.slotKey === slotKey)) return skip('slot-already-consumed');
  if (w.enchantments.length) return needs(['legacy-enchantment-slot-migration']);
  const binding = bindings.find(b => b.definitionFile === w.definitionFile && b.definitionId === w.definitionId);
  if (!binding) return needs(['explicit-canonical-weapon-enchantment-binding']);
  if (!binding.enchantable) return skip('non-enchantable-weapon');
  const mastery = effectiveMastery(input);
  if (mastery.effective < 5) return { ...skip('effective-mastery-below-master'), mastery };
  if (!Array.isArray(excludedEnchantmentIds) || new Set(excludedEnchantmentIds).size !== excludedEnchantmentIds.length ||
      excludedEnchantmentIds.some(id => !catalog.enchantments.some(e => e.id === id)))
    fail('INVALID_ENCHANT_EXCLUSIONS', 'Disabled outcomes must be unique known canonical Enchant IDs.');
  const eligible = catalog.enchantments.filter(e => !excludedEnchantmentIds.includes(e.id) && e.requiresAll.every(c => binding.capabilities.includes(c)))
    .sort((a, b) => a.tier - b.tier || a.catalogOrder - b.catalogOrder);
  if (!eligible.length) return needs(['nonempty-compatible-enchantment-pool']);
  const plan = { ...common, status: 'ready', actualSpin: true, slotKey, slotIndex: 0, snapshotId: input.finalPhase.snapshotId,
    weapon: copy(w), binding: copy(binding), mastery, equalizerActive: input.equalizerActive === true,
    excludedEnchantmentIds: [...excludedEnchantmentIds],
    outcomes: eligible.map(e => ({ ...copy(e), probability: 1 / eligible.length })),
    gate: { effectiveMastery: mastery.effective, threshold: 5, bonusesCalculatedAt: 'finalize' },
    trace: { baseProbability: 'equal-per-eligible-option', compatibilityBeforeProbability: true,
      rawMaximumDoesNotCapFinalMastery: true, statMasteryProbabilityBoundsApplied: false, reservedTierMass: false },
    continuation: 'finalize:drain-enchant-children' };
  validatePlan(plan);
  return plan;
}

function validatePlan(plan) {
  if (plan?.version !== ENCHANTMENT_VERSION || plan.catalogVersion !== ENCHANTMENT_VERSION || plan.status !== 'ready' ||
      plan.stage !== 'finalize' || plan.wheelId !== 'enchant' || plan.freezeBeforeDraw !== true || plan.actualSpin !== true ||
      ![plan.runId, plan.characterId, plan.invocationId, plan.snapshotId].every(nonempty) ||
      plan.slotIndex !== 0 || plan.weapon?.kind !== 'weapon' || plan.weapon.activeStatus !== 'active' ||
      plan.weapon.ownerCharacterId !== plan.characterId || plan.weapon.runId !== plan.runId ||
      !Array.isArray(plan.weapon.enchantments) || plan.weapon.enchantments.length ||
      plan.slotKey !== key(plan.runId, plan.characterId, plan.weapon.instanceId, 'enchant', 0) ||
      !Array.isArray(plan.outcomes) || !plan.outcomes.length || new Set(plan.outcomes.map(e => e.id)).size !== plan.outcomes.length)
    fail('INVALID_FROZEN_ENCHANT_PLAN', 'Final-phase source-scoped compatible unused-slot plan required.');
  validateBinding(plan.binding);
  if (!plan.binding.enchantable || plan.binding.definitionFile !== plan.weapon.definitionFile || plan.binding.definitionId !== plan.weapon.definitionId)
    fail('INVALID_FROZEN_ENCHANT_PLAN', 'Selected definition must match the frozen enchantable binding.');
  const mastery = effectiveMastery({ weapon: plan.weapon, mastery: { weaponInstanceId: plan.weapon.instanceId,
    resolutionId: plan.mastery?.resolutionId, retainedRawBase: plan.mastery?.rawBase, modifiers: plan.mastery?.modifiers } });
  if (mastery.effective < 5 || mastery.effective !== plan.mastery.effective ||
      JSON.stringify(mastery.appliedSourceKeys) !== JSON.stringify(plan.mastery.appliedSourceKeys) ||
      plan.gate?.effectiveMastery !== mastery.effective || plan.gate.threshold !== 5 || plan.gate.bonusesCalculatedAt !== 'finalize')
    fail('INVALID_FROZEN_ENCHANT_PLAN', 'Gate must follow immutable raw base plus distinct matching final modifiers.');
  for (const [i, e] of plan.outcomes.entries()) {
    validateRecipe(e);
    if (e.requiresAll.some(c => !plan.binding.capabilities.includes(c)) ||
        !Number.isFinite(e.probability) || Math.abs(e.probability - 1 / plan.outcomes.length) > 1e-12 ||
        (i && (plan.outcomes[i - 1].tier > e.tier || plan.outcomes[i - 1].catalogOrder >= e.catalogOrder)))
      fail('INVALID_FROZEN_ENCHANT_PLAN', 'Eligible Enchants must be compatible, uniform and ordered weak to strong.');
  }
  if (Math.abs(sum(plan.outcomes.map(e => e.probability)) - 1) > 1e-12)
    fail('INVALID_FROZEN_ENCHANT_PLAN', 'Frozen probabilities must sum to one.');
}

export function selectEnchantmentOutcome(plan, sample) {
  validatePlan(plan);
  if (!Number.isFinite(sample) || sample < 0 || sample >= 1) fail('INVALID_RANDOM_SAMPLE', 'External RNG sample must lie in [0,1).');
  let mass = 0;
  for (const e of plan.outcomes) { mass += e.probability; if (sample < mass) return e.id; }
  return plan.outcomes.at(-1).id;
}

/** Receipt only: caller atomically compares the guard, stores trait and consumes slot. */
export function resolveEnchantmentResult(plan, result, { consumedSlotKeys = [], currentSnapshotId = plan.snapshotId } = {}) {
  validatePlan(plan);
  if (!Array.isArray(consumedSlotKeys) || consumedSlotKeys.some(x => !nonempty(x))) fail('INVALID_ENCHANT_LEDGER', 'Consumed slots must be explicit keys.');
  if (consumedSlotKeys.includes(plan.slotKey)) return { status: 'already_resolved', actualSpin: false, slotKey: plan.slotKey };
  if (currentSnapshotId !== plan.snapshotId) fail('STALE_ENCHANT_SNAPSHOT', 'Pending draw must still match the final inventory/mastery snapshot.');
  if (result?.runId !== plan.runId || result.characterId !== plan.characterId || result.invocationId !== plan.invocationId || !nonempty(result.spinId))
    fail('ENCHANT_SOURCE_MISMATCH', 'Actual result must belong to this frozen final-phase invocation.');
  const e = plan.outcomes.find(x => x.id === result.outcomeId);
  if (!e) fail('UNKNOWN_ENCHANT_OUTCOME', 'Result is not in this frozen compatible pool.');
  const sourceKey = plan.slotKey;
  return { status: 'resolved', runId: plan.runId, characterId: plan.characterId, invocationId: plan.invocationId,
    sourceSpinId: result.spinId, sourceKey, slotKey: plan.slotKey, outcomeId: e.id, label: e.label, enchantTier: e.tier,
    commitGuard: { snapshotId: plan.snapshotId, activeWeaponInstanceId: plan.weapon.instanceId, unusedSlotKey: plan.slotKey,
      masteryResolutionId: plan.mastery.resolutionId, finalEffectiveMastery: plan.mastery.effective },
    atomicEffects: [
      { type: 'attach-weapon-enchantment', ledgerKey: sourceKey, weaponInstanceId: plan.weapon.instanceId,
        slotKey: plan.slotKey, definitionId: e.id, definitionFile: 'content/enchantment-wheel-design.json',
        frozenRecipe: copy(e), sourceSpinId: result.spinId },
      { type: 'consume-enchantment-slot', slotKey: plan.slotKey, sourceSpinId: result.spinId }
    ],
    funnyResult: e.funnyResult, funnyActualSpinKey: e.funnyResult ? key(plan.runId, plan.characterId, result.spinId) : null,
    triggersMasterySpin: false, grantsOwnerPower: false, changesOwnerSize: false,
    continuation: plan.continuation, contextFacts: [`Enchantment: ${e.label}`, e.context] };
}
