import design from '../content/weapon-wheel-design.json' with { type: 'json' };
import statDesign from '../content/stat-odds-design.json' with { type: 'json' };
import { buildStatContext } from './stat-odds.mjs';

export const WEAPON_ODDS_VERSION = 'weapon-odds/0.2.0';
const REPLAY_VERSIONS = new Set(['weapon-odds/0.1.0', WEAPON_ODDS_VERSION]);
export class WeaponWheelError extends Error {
  constructor(code, message) { super(message); this.name = 'WeaponWheelError'; this.code = code; }
}
const fail = (code, message) => { throw new WeaponWheelError(code, message); };
const nonempty = x => typeof x === 'string' && x.trim().length > 0;
const sum = xs => xs.reduce((a, b) => a + b, 0);
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const key = (...parts) => JSON.stringify(parts);
const needs = (input, required) => ({ status: 'needs_configuration', version: WEAPON_ODDS_VERSION,
  runId: input.runId, characterId: input.characterId, invocationId: input.invocationId, required });
const matches = (profile, fact) => profile.familyId === fact.familyId && profile.when.every(c =>
  fact.results.some(r => r.wheelId === c.wheelId && c.outcomeIds.includes(r.outcomeId)));

function validateFactors(profile) {
  if (!profile.tagFactors || Object.values(profile.tagFactors).some(v => !Number.isFinite(v) || v < 1 || v > 1.6))
    fail('INVALID_WEAPON_MODEL', 'Ordinary lore factors must be gentle finite weights1..1.6.');
}

function validateWeapon(w) {
  if (!nonempty(w?.id) || !nonempty(w.label) || !Number.isSafeInteger(w.tier) || w.tier < 1 || w.tier > 5 ||
      !Number.isSafeInteger(w.catalogOrder) || w.catalogOrder < 1 || !Array.isArray(w.tags) ||
      new Set(w.tags).size !== w.tags.length || w.tags.some(t => !nonempty(t)) ||
      !Object.hasOwn(statDesign.weaponTrainingProfiles, w.trainingProfileId) ||
      !nonempty(w.weaponDefinitionRef?.definitionId) || !nonempty(w.weaponDefinitionRef.definitionFile) ||
      w.funnyResult !== w.tags.includes('funny-result'))
    fail('INVALID_WEAPON_RECIPE', 'Weapon needs an intrinsic tier, explicit tags/training and canonical grant reference.');
}

function validateCatalog(catalog) {
  const m = catalog.probabilityModel;
  if (!nonempty(catalog.version) || catalog.wheel?.id !== 'weapon' || catalog.wheel.noneOutcome?.id !== 'weapon-none' ||
      !nonempty(catalog.wheel.noneOutcome.label) || !Array.isArray(catalog.weapons) || !catalog.weapons.length ||
      new Set(catalog.weapons.map(w => w.id)).size !== catalog.weapons.length || !m ||
      m.version !== WEAPON_ODDS_VERSION || [1, 2, 3, 4, 5].some(t => m.tierMassGivenWeapon[t] !== .2) ||
      !Number.isFinite(m.compositeNoneMinimumShare) || m.compositeNoneMinimumShare < 0 || m.compositeNoneMinimumShare > 1 ||
      !Array.isArray(m.noneBounds) || m.noneBounds.length !== 2 || !(m.noneBounds[0] > 0 && m.noneBounds[1] < 1 && m.noneBounds[0] < m.noneBounds[1]) ||
      !Number.isFinite(m.maxCombinedItemFactor) || m.maxCombinedItemFactor < 1 || m.maxCombinedItemFactor > 2 ||
      m.maxProfileItemFactor !== 1.6 || !Array.isArray(m.wrapperProfiles) || !Array.isArray(m.archetypeResultProfiles))
    fail('INVALID_WEAPON_MODEL', 'Use five equal tier masses, positive guard-bounded None probabilities and an explicit lore model.');
  catalog.weapons.forEach(validateWeapon);
  for (const p of m.raceProfiles) {
    validateFactors(p);
    if (!nonempty(p.id) || !(p.noneProbability > 0 && p.noneProbability < 1) || !Array.isArray(p.when) ||
        p.when.some(c => !Array.isArray(c.outcomeIds) || !c.outcomeIds.length ||
          c.outcomeIds.some(id => !statDesign.raceResultWheels[p.familyId]?.[c.wheelId]?.includes(id))))
      fail('INVALID_WEAPON_MODEL', 'Race likelihoods must refer to canonical actual owner selectors.');
  }
  if (new Set(m.raceProfiles.map(p => p.id)).size !== m.raceProfiles.length ||
      new Set(m.archetypeProfiles.map(p => p.archetypeId)).size !== m.archetypeProfiles.length ||
      new Set(m.backstoryProfiles.map(p => p.backstoryId)).size !== m.backstoryProfiles.length)
    fail('INVALID_WEAPON_MODEL', 'Likelihood profile IDs must be unique.');
  for (const p of m.archetypeProfiles) {
    validateFactors(p);
    if (!statDesign.archetypeProfiles.some(r => r.id === p.archetypeId) || !(p.noneOddsMultiplier > 0) || !Number.isFinite(p.noneOddsMultiplier))
      fail('INVALID_WEAPON_MODEL', 'Role factors need canonical IDs and positive None odds multipliers.');
  }
  m.backstoryProfiles.forEach(validateFactors);
  for (const p of m.wrapperProfiles) {
    validateFactors(p);
    if (!nonempty(p.id) || !['raksasa', 'symbiote', 'hybrid', 'lelembut'].includes(p.familyId) || !Array.isArray(p.when) ||
        !Number.isFinite(p.noneOddsMultiplier) || p.noneOddsMultiplier <= 0 ||
        p.when.some(c => !c.outcomeIds?.length || c.outcomeIds.some(id => !statDesign.raceResultWheels[p.familyId]?.[c.wheelId]?.includes(id))))
      fail('INVALID_WEAPON_MODEL', 'Wrapper factors require actual canonical host/origin evidence.');
  }
  for (const p of m.archetypeResultProfiles) {
    validateFactors(p);
    if (!nonempty(p.id) || !statDesign.archetypeProfiles.some(r => r.id === p.archetypeId) ||
        !Array.isArray(p.when) || !p.when.length || p.when.some(c => !c.outcomeIds?.length ||
          c.outcomeIds.some(id => !statDesign.archetypeResultWheels[p.archetypeId]?.[c.wheelId]?.includes(id))))
      fail('INVALID_WEAPON_MODEL', 'Role subtype affinity requires a committed canonical event selector.');
  }
  for (const profiles of [m.wrapperProfiles, m.archetypeResultProfiles])
    if (new Set(profiles.map(p => p.id)).size !== profiles.length)
      fail('INVALID_WEAPON_MODEL', 'Subtype profile IDs must be unique.');
  for (const a of m.affinityAnchors) if (!nonempty(a.id) || !statDesign.archetypeProfiles.some(r => r.id === a.archetypeId) ||
      !(a.withinTierShare > 0 && a.withinTierShare < 1) || !catalog.weapons.some(w => w.id === a.weaponId && w.tier === a.tier))
    fail('INVALID_WEAPON_MODEL', 'Affinity reservations must refer to one known weapon inside its own tier.');
}

function chooseRaceProfile(fact, profiles) {
  const candidates = profiles.filter(p => matches(p, fact)).sort((a, b) => b.when.length - a.when.length);
  if (!candidates.length) return null;
  if (candidates[1]?.when.length === candidates[0].when.length)
    fail('AMBIGUOUS_WEAPON_PRIOR', 'Equally specific race profiles require an explicit choice.');
  return structuredClone(candidates[0]);
}

// One factor per profile avoids multiplying the same blade/holy/magic affinity several times.
function logTagFactor(profile, weapon) {
  const matching = weapon.tags.filter(t => Object.hasOwn(profile.tagFactors, t)).map(t => profile.tagFactors[t]);
  return matching.length ? Math.log(Math.max(...matching)) : 0;
}

/** Plan one acquisition from committed owner facts; no RNG, inventory mutation or implicit extra draws. */
export function planWeaponWheel(input, { catalog = design, excludedWeaponIds = [], acquisitionKind = 'main', bonusTicket } = {}) {
  validateCatalog(catalog);
  const context = buildStatContext(input);
  if (context.status !== 'ready') return context;
  if (!['main', 'guaranteed-extra'].includes(acquisitionKind)) fail('INVALID_WEAPON_CALLER', 'Known acquisition kind required.');
  if (acquisitionKind === 'guaranteed-extra' && (!bonusTicket || bonusTicket.committed !== true ||
      !nonempty(bonusTicket.id) || !nonempty(bonusTicket.sourceId)))
    fail('INVALID_WEAPON_TICKET', 'An already authorized committed extra acquisition ticket is required.');
  const common = { version: WEAPON_ODDS_VERSION, catalogVersion: catalog.version, runId: input.runId,
    characterId: input.characterId, invocationId: input.invocationId, acquisitionKind,
    bonusTicket: acquisitionKind === 'guaranteed-extra' ? structuredClone(bonusTicket) : null, context,
    freezeBeforeDraw: true, bonusTiming: 'final-only', tierDoesNotSetMastery: true };
  if (context.archetypeIds.includes('gladiator')) {
    const source = context.archetypeFacts.find(f => f.archetypeId === 'gladiator'), lock = input.weaponAcquisitionLock;
    if (lock?.committed !== true || lock.sourceId !== source.sourceId || !nonempty(lock.allowedWeaponInstanceId) ||
        !source.results.some(r => r.wheelId === 'gladiator-weapon') ||
        !context.inventory.weapons.some(w => w.instanceId === lock.allowedWeaponInstanceId))
      return needs(input, ['committed-gladiator-exclusive-weapon-lock']);
    return { ...common, status: 'skip', actualSpin: false, reason: 'gladiator-exclusive-weapon-lock',
      lockedWeaponInstanceId: lock.allowedWeaponInstanceId, outcomes: [] };
  }
  if (!Array.isArray(excludedWeaponIds) || new Set(excludedWeaponIds).size !== excludedWeaponIds.length ||
      excludedWeaponIds.some(id => id !== 'weapon-none' && !catalog.weapons.some(w => w.id === id)))
    fail('INVALID_WEAPON_EXCLUSIONS', 'Only unique known hard exclusions are allowed.');
  const eligible = structuredClone(catalog.weapons.filter(w => !excludedWeaponIds.includes(w.id)))
    .sort((a, b) => a.tier - b.tier || a.catalogOrder - b.catalogOrder);
  if ([1, 2, 3, 4, 5].some(t => !eligible.some(w => w.tier === t)))
    return needs(input, ['eligible-weapons-in-every-equal-probability-tier']);
  const m = catalog.probabilityModel, physicalIds = new Set(context.raceComponents.map(p => p.familyId));
  const raceProfiles = context.identity.filter(f => physicalIds.has(f.familyId)).map(f => chooseRaceProfile(f, m.raceProfiles));
  if (!raceProfiles.length || raceProfiles.some(p => !p)) return needs(input, ['explicit-physical-owner-weapon-profile']);
  const wrapperProfiles = context.identity.filter(f => !physicalIds.has(f.familyId)).map(f => chooseRaceProfile(f, m.wrapperProfiles));
  if (wrapperProfiles.some(p => !p)) return needs(input, ['explicit-owner-wrapper-weapon-profile']);
  const roleProfiles = context.archetypeIds.map(id => m.archetypeProfiles.find(p => p.archetypeId === id));
  if (roleProfiles.some(p => !p)) return needs(input, ['explicit-owner-archetype-weapon-profile']);
  const roleResultProfiles = context.archetypeFacts.flatMap(f => m.archetypeResultProfiles.filter(p =>
    p.archetypeId === f.archetypeId && p.when.every(c => f.results.some(r =>
      r.wheelId === c.wheelId && c.outcomeIds.includes(r.outcomeId)))));
  const backstoryId = context.contextTokens.find(t => t.startsWith('backstory:'))?.slice('backstory:'.length);
  const backstoryProfile = m.backstoryProfiles.find(p => p.backstoryId === backstoryId);
  const priors = raceProfiles.map(p => p.noneProbability);
  const baseNone = m.compositeNoneMinimumShare * Math.min(...priors) +
    (1 - m.compositeNoneMinimumShare) * sum(priors) / priors.length;
  const noneLogOdds = Math.log(baseNone / (1 - baseNone)) +
    sum([...roleProfiles, ...wrapperProfiles].map(p => Math.log(p.noneOddsMultiplier)));
  const conditionalNone = clamp(1 / (1 + Math.exp(-noneLogOdds)), ...m.noneBounds);
  const noneAllowed = acquisitionKind === 'main' && !excludedWeaponIds.includes('weapon-none');
  let noneProbability = noneAllowed ? conditionalNone : 0;
  const activeAnchors = m.affinityAnchors.filter(a => context.archetypeIds.includes(a.archetypeId));
  const anchorTrace = [], outcomes = [];
  for (const tier of [1, 2, 3, 4, 5]) {
    const rows = eligible.filter(w => w.tier === tier), mass = (1 - noneProbability) / 5;
    const logs = rows.map(w => clamp(sum(raceProfiles.map(p => logTagFactor(p, w))) / raceProfiles.length +
      sum([...wrapperProfiles, ...roleProfiles, ...roleResultProfiles].map(p => logTagFactor(p, w))) +
      (backstoryProfile ? logTagFactor(backstoryProfile, w) : 0),
      -Math.log(m.maxCombinedItemFactor), Math.log(m.maxCombinedItemFactor)));
    const weights = logs.map(Math.exp);
    const anchors = activeAnchors.filter(a => a.tier === tier && rows.some(w => w.id === a.weaponId));
    const reserved = sum(anchors.map(a => a.withinTierShare));
    if (reserved >= 1 || new Set(anchors.map(a => a.weaponId)).size !== anchors.length)
      fail('INVALID_WEAPON_ANCHORS', 'Within-tier reservations must leave positive mass for other items.');
    const unreservedTotal = sum(rows.map((w, i) => anchors.some(a => a.weaponId === w.id) ? 0 : weights[i]));
    rows.forEach((w, i) => {
      const anchor = anchors.find(a => a.weaponId === w.id);
      const share = !unreservedTotal ? weights[i] / sum(weights) : anchor ? anchor.withinTierShare :
        (1 - reserved) * weights[i] / unreservedTotal;
      outcomes.push({ ...w, probability: mass * share, withinTierProbability: share, loreWeight: weights[i] });
      if (anchor) anchorTrace.push({ id: anchor.id, weaponId: w.id, withinTierShare: share,
        totalProbability: mass * share, preservesEqualTierMass: true });
    });
  }
  if (noneAllowed) outcomes.unshift({ ...structuredClone(catalog.wheel.noneOutcome), probability: noneProbability });
  if (context.equalizerActive) {
    outcomes.forEach(o => { o.probability = 1 / outcomes.length; delete o.withinTierProbability; });
    noneProbability = noneAllowed ? 1 / outcomes.length : 0;
  }
  const plan = { ...common, status: 'ready', actualSpin: true, wheelId: 'weapon', excludedWeaponIds: [...excludedWeaponIds], outcomes,
    trace: { model: structuredClone(m), raceProfiles, wrapperProfiles, roleProfiles: structuredClone(roleProfiles),
      roleResultProfiles: structuredClone(roleResultProfiles),
      backstoryProfile: structuredClone(backstoryProfile ?? null), baseNone, conditionalNoneBeforeOverride: conditionalNone,
      noneProbability, noneAllowed, equalizerActive: context.equalizerActive,
      anchorTrace: context.equalizerActive ? [] : anchorTrace,
      suppressedAnchorIds: activeAnchors.filter(a => context.equalizerActive || !eligible.some(w => w.id === a.weaponId)).map(a => a.id),
      tierMasses: [1, 2, 3, 4, 5].map(t => ({ tier: t, probability: sum(outcomes.filter(o => o.tier === t).map(o => o.probability)) })),
      finalBonusInputsUsed: false, empiricalCalibration: false }, nextStageAfterWeaponSubflow: 'power' };
  validatePlan(plan);
  return plan;
}

function validatePlan(plan) {
  if (plan?.status !== 'ready' || !REPLAY_VERSIONS.has(plan.version) || plan.wheelId !== 'weapon' ||
      !nonempty(plan.runId) || !nonempty(plan.characterId) || !nonempty(plan.invocationId) || !nonempty(plan.catalogVersion) ||
      plan.freezeBeforeDraw !== true || plan.nextStageAfterWeaponSubflow !== 'power' || !Array.isArray(plan.outcomes) ||
      !plan.outcomes.length || new Set(plan.outcomes.map(o => o.id)).size !== plan.outcomes.length ||
      plan.outcomes.some(o => !nonempty(o.id) || !nonempty(o.label) || !Number.isFinite(o.probability) || o.probability <= 0) ||
      Math.abs(sum(plan.outcomes.map(o => o.probability)) - 1) > 1e-12)
    fail('INVALID_FROZEN_WEAPON_PLAN', 'Normalized source-scoped frozen acquisition wheel required.');
  plan.outcomes.filter(o => o.id !== 'weapon-none').forEach(validateWeapon);
  const none = plan.outcomes.find(o => o.id === 'weapon-none');
  if ((none && (none.tier !== null || none.funnyResult !== false)) ||
      (plan.acquisitionKind === 'guaranteed-extra' && (none || plan.bonusTicket?.committed !== true)))
    fail('INVALID_FROZEN_WEAPON_PLAN', 'None must not be a weapon or enter a guaranteed acquisition.');
  if (plan.context?.equalizerActive) {
    if (plan.outcomes.some(o => Math.abs(o.probability - 1 / plan.outcomes.length) > 1e-12))
      fail('INVALID_FROZEN_WEAPON_PLAN', 'Equalizer must flatten every eligible individual sector.');
  } else {
    const expected = (1 - (none?.probability ?? 0)) / 5;
    for (const tier of [1, 2, 3, 4, 5]) if (Math.abs(sum(plan.outcomes.filter(o => o.tier === tier).map(o => o.probability)) - expected) > 1e-12)
      fail('INVALID_FROZEN_WEAPON_PLAN', 'Each Tier must preserve its equal share of non-None mass.');
  }
}

export function selectWeaponOutcome(plan, sample) {
  validatePlan(plan);
  if (!Number.isFinite(sample) || sample < 0 || sample >= 1) fail('INVALID_RANDOM_SAMPLE', 'An external sample in [0,1) is required.');
  let mass = 0;
  for (const outcome of plan.outcomes) { mass += outcome.probability; if (sample < mass) return outcome.id; }
  return plan.outcomes.at(-1).id;
}

/** Emit one grant or None, then resume the existing bonus/detail/mastery subflow before Power. */
export function resolveWeaponResult(plan, result) {
  validatePlan(plan);
  if (result?.runId !== plan.runId || result.characterId !== plan.characterId || result.invocationId !== plan.invocationId || !nonempty(result.spinId))
    fail('WEAPON_SOURCE_MISMATCH', 'Actual result must belong to the frozen owner invocation.');
  if (plan.context.sourceRecords.some(s => s.spinId === result.spinId) || plan.context.size.sourceId === result.spinId)
    fail('DUPLICATE_WEAPON_DRAW', 'Acquisition needs its own actual spin ID, not an earlier context draw.');
  const outcome = plan.outcomes.find(o => o.id === result.outcomeId);
  if (!outcome) fail('UNKNOWN_WEAPON_OUTCOME', 'Selected result is absent from the frozen eligible pool.');
  const sourceKey = key(plan.runId, plan.characterId, plan.invocationId, 'weapon-acquisition');
  const effects = outcome.id === 'weapon-none' ? [] : [{ type: 'grant-weapon', id: sourceKey, ledgerKey: sourceKey,
    instanceId: sourceKey, definitionId: outcome.weaponDefinitionRef.definitionId, definitionFile: outcome.weaponDefinitionRef.definitionFile,
    sourceId: plan.invocationId, sourceSpinId: result.spinId, weaponTier: outcome.tier, trainingProfileId: outcome.trainingProfileId,
    masteryPolicy: 'recipient-normal-per-instance', masteryStatus: 'unresolved', surviveMainNone: true,
    triggersMasterySpinNow: false, triggersEnchantNow: false }];
  return { status: 'resolved', runId: plan.runId, characterId: plan.characterId, invocationId: plan.invocationId,
    sourceSpinId: result.spinId, sourceKey, outcomeId: outcome.id, label: outcome.label, weaponTier: outcome.tier,
    effects, funnyResult: outcome.funnyResult, funnyActualSpinKey: outcome.funnyResult ? key(plan.runId, plan.characterId, result.spinId) : null,
    retainPreviousWeapons: true, nextStage: 'weapon-subflow',
    continuation: 'Finish authorized bonus acquisitions/details and all active owned raw mastery; final bonus/compatible Enchant remains deferred. Then Power.',
    contextFacts: [`Weapon: ${outcome.label}`, ...(outcome.id === 'weapon-none' ? [] : [`Weapon Tier: ${outcome.tier}`, 'Weapon Mastery: belum diputar'])] };
}
