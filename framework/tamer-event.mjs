import design from '../content/tamer-events-design.json' with { type: 'json' };

export class TamerInputError extends Error {
  constructor(code, message) { super(message); this.name = 'TamerInputError'; this.code = code; }
}
const fail = (code, message) => { throw new TamerInputError(code, message); };
const nonempty = value => typeof value === 'string' && value.length > 0;
const groups = new Set(['modern', 'prehistoric', 'mythical', 'pop-culture']);

function validatePowerGrant(plan) {
  if (['tamer/1.0.0', 'tamer/1.1.0'].includes(plan.ruleVersion)) {
    if (plan.powerGrantRef !== undefined)
      fail('INVALID_TAMER_POWER', 'Retired companion-only snapshots cannot gain a new power on replay.');
    return;
  }
  if (plan.ruleVersion !== 'tamer/1.2.0')
    fail('UNSUPPORTED_TAMER_RULE', 'Use an explicitly supported saved Tamer rule version.');
  if (plan.powerGrantRef?.definitionId !== 'taming' ||
      plan.powerGrantRef?.definitionFile !== 'content/tamer-events-design.json')
    fail('INVALID_TAMER_POWER', 'New Tamer plans must freeze their explicit fixed Taming Power reference.');
}

function validatePlan(plan) {
  if (!plan || plan.phase !== 'animal-to-tame' || plan.decision !== 'spin' ||
      !nonempty(plan.rootInvocationId) || !nonempty(plan.characterId) || !nonempty(plan.ruleVersion) ||
      !nonempty(plan.catalogVersion) || plan.invocationId !== `${plan.rootInvocationId}:animal-to-tame` ||
      plan.nextStageAfterResult !== 'backstory' || !Array.isArray(plan.animals) ||
      plan.wheel?.id !== 'tamer-animal-to-tame' || plan.wheel.allowModifiers !== false)
    fail('INVALID_TAMER_PLAN', 'Frozen animal pool, owner and source versions are required.');
  const rows = plan.wheel.outcomes;
  if (!Number.isInteger(plan.wheel.outcomeCount) || plan.wheel.outcomeCount <= 0 ||
      !Array.isArray(rows) || rows.length !== plan.wheel.outcomeCount || plan.animals.length !== rows.length ||
      new Set(rows.map(o => o?.id)).size !== rows.length || new Set(plan.animals.map(o => o?.id)).size !== rows.length ||
      rows.some(row => !nonempty(row?.id) || !nonempty(row.label) || row.baseWeight !== 1 ||
        !Number.isFinite(row.probability) || Math.abs(row.probability - 1 / rows.length) > 1e-12 ||
        !plan.animals.some(o => o?.id === row.id && o.label === row.label)))
    fail('INVALID_TAMER_POOL', 'Unique equal visible outcomes must match the saved animal identities.');
  if (plan.animals.some(o => !nonempty(o.id) || !nonempty(o.label) || !groups.has(o.groupId) ||
      o.companionProfile?.definitionId !== o.id || !nonempty(o.companionProfile?.definitionFile)))
    fail('INVALID_COMPANION_IDENTITY', 'Each animal requires an explicit companion definition reference.');
  validatePowerGrant(plan);
}

/** Freeze one flat wheel and the exact identities; no chance, quantity or RNG. */
export function planTamerCompanion({ invocationId, characterId, catalogVersion } = {}) {
  if (!nonempty(invocationId) || !nonempty(characterId) || !nonempty(catalogVersion))
    fail('INVALID_TAMER_INVOCATION', 'Stable source invocation, owner and catalog version are required.');
  const animals = structuredClone(design.wheel.outcomes);
  const plan = { phase: 'animal-to-tame', decision: 'spin', rootInvocationId: invocationId,
    invocationId: `${invocationId}:animal-to-tame`, characterId, ruleVersion: design.version,
    catalogVersion, animals, wheel: { id: design.wheel.id, outcomeCount: design.wheel.outcomeCount,
      allowModifiers: false, outcomes: animals.map(({ id, label, baseWeight, probability }) => ({ id, label, baseWeight, probability })) },
    powerGrantRef: structuredClone(design.rolePowerRef), nextStageAfterResult: 'backstory' };
  validatePlan(plan);
  return plan;
}

/** Emit one companion plus the versioned fixed power; consume their source ledger atomically. */
export function resolveTamerCompanion(plan, result) {
  validatePlan(plan);
  if (!result || result.invocationId !== plan.invocationId || !nonempty(result.spinId) || !nonempty(result.outcomeId))
    fail('TAMER_SOURCE_MISMATCH', 'Committed result must belong to this saved Tamer invocation.');
  const animal = plan.animals.find(o => o.id === result.outcomeId);
  if (!animal) fail('UNKNOWN_TAMER_OUTCOME', 'Selected animal is not in the frozen pool.');
  const ledgerKey = `${plan.rootInvocationId}:tamer-companion`;
  const companion = { instanceId: `${ledgerKey}:instance`, ownerCharacterId: plan.characterId,
    animalDefinitionId: animal.id, definitionFile: animal.companionProfile.definitionFile,
    label: animal.label, groupId: animal.groupId, ruleVersion: plan.ruleVersion,
    catalogVersion: plan.catalogVersion, sourceArchetypeId: 'tamer',
    sourceInvocationId: plan.rootInvocationId, sourceSpinId: result.spinId,
    identitySnapshot: structuredClone(animal), intrinsicProfileStatus: 'needs_configuration',
    surviveMainNone: true };
  const effects = [{ type: 'register-companion', id: `${ledgerKey}:register`, companion }];
  if (plan.powerGrantRef) effects.push({ type: 'grant-power', id: `${ledgerKey}:power:taming`,
    instanceId: `${ledgerKey}:power:taming`, ownerCharacterId: plan.characterId,
    definitionId: plan.powerGrantRef.definitionId, definitionFile: plan.powerGrantRef.definitionFile,
    catalogVersion: plan.catalogVersion, sourceArchetypeId: 'tamer',
    sourceInvocationId: plan.rootInvocationId, sourceSpinId: result.spinId,
    masteryPolicy: 'recipient-shared-power-normal', surviveMainNone: true });
  return { decision: 'resolved', animalId: animal.id, companionCount: 1, effects,
    ledgerKey, nextStage: 'backstory' };
}
