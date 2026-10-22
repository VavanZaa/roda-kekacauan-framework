import design from '../content/survivalist-events-design.json' with { type: 'json' };

export class SurvivalistInputError extends Error {
  constructor(code, message) { super(message); this.name = 'SurvivalistInputError'; this.code = code; }
}
const fail = (code, message) => { throw new SurvivalistInputError(code, message); };
const nonempty = value => typeof value === 'string' && value.length > 0;
const statKeys = new Set(['strength', 'speed', 'durability', 'intelligence', 'fight']);
const rewardKind = value => value <= 37.5 ? 'stat-only' : value <= 75 ? 'power-only' : 'both';
const publicOutcome = ({ id, label, baseWeight, probability }) => ({ id, label, baseWeight, probability });

function validateUniform(rows) {
  if (!Array.isArray(rows) || !rows.length || new Set(rows.map(row => row?.id)).size !== rows.length ||
      rows.some(row => !nonempty(row?.id) || !nonempty(row.label) || row.baseWeight !== 1 ||
        !Number.isFinite(row.probability) || Math.abs(row.probability - 1 / rows.length) > 1e-12))
    fail('INVALID_SURVIVALIST_POOL', 'Outcomes require unique IDs and equal normalized positive odds.');
}

function validateRecipe(environment) {
  if (!environment || !nonempty(environment.id) || !nonempty(environment.label) ||
      !statKeys.has(environment.statBuff?.stat) || environment.statBuff.amount !== 1 ||
      !nonempty(environment.powerRef?.definitionId) || !nonempty(environment.powerRef.definitionFile))
    fail('INVALID_SURVIVALIST_RECIPE', 'Environment requires exactly one +1 main stat and an intrinsic power reference.');
}

function validatePlan(plan, phase) {
  if (!plan || plan.phase !== phase || plan.decision !== 'spin' || !nonempty(plan.rootInvocationId) ||
      !nonempty(plan.invocationId) || !nonempty(plan.ruleVersion) || !nonempty(plan.catalogVersion))
    fail('INVALID_SURVIVALIST_PLAN', 'A versioned source-scoped frozen plan is required.');
  validateUniform(plan.wheel?.outcomes);
  if (plan.wheel.allowModifiers !== false) fail('INVALID_SURVIVALIST_PLAN', 'Unapproved odds modifiers cannot change these wheels.');
}

function selected(plan, result) {
  if (!result || result.invocationId !== plan.invocationId || !nonempty(result.spinId) || !nonempty(result.outcomeId))
    fail('SURVIVALIST_SOURCE_MISMATCH', 'Committed result must belong to the saved invocation.');
  const outcome = plan.wheel.outcomes.find(row => row.id === result.outcomeId);
  if (!outcome) fail('UNKNOWN_SURVIVALIST_OUTCOME', 'Selected result is absent from the frozen eligible pool.');
  return outcome;
}

/** Freeze the editable environment catalog; only IDs/labels/odds enter the visible wheel. */
export function planSurvivalistEnvironment({ invocationId, catalogVersion } = {}) {
  if (!nonempty(invocationId) || !nonempty(catalogVersion))
    fail('INVALID_SURVIVALIST_INVOCATION', 'Stable source invocation and catalog version are required.');
  const environmentProfiles = structuredClone(design.wheels.find(w => w.id === 'survivalist-environment').outcomes);
  validateUniform(environmentProfiles);
  environmentProfiles.forEach(validateRecipe);
  const chanceWheel = structuredClone(design.wheels.find(w => w.id === 'survivalist-chance'));
  validateChanceWheel(chanceWheel);
  return { phase: 'environment', decision: 'spin', rootInvocationId: invocationId, invocationId: `${invocationId}:environment`,
    ruleVersion: design.version, catalogVersion, environmentProfiles, chanceWheel,
    wheel: { id: 'survivalist-environment', allowModifiers: false, outcomes: environmentProfiles.map(publicOutcome) } };
}

/** Use the saved selected environment and nine-section chance pool, without a new catalog query. */
export function planSurvivalistChance(environmentPlan, environmentResult) {
  validatePlan(environmentPlan, 'environment');
  if (environmentPlan.wheel.id !== 'survivalist-environment' || !Array.isArray(environmentPlan.environmentProfiles))
    fail('INVALID_SURVIVALIST_PLAN', 'A saved environment wheel and recipes are required.');
  validateUniform(environmentPlan.environmentProfiles);
  if (environmentPlan.environmentProfiles.length !== environmentPlan.wheel.outcomes.length ||
      environmentPlan.wheel.outcomes.some(row => !environmentPlan.environmentProfiles.some(e => e.id === row.id && e.label === row.label)))
    fail('INVALID_SURVIVALIST_PLAN', 'Every frozen environment outcome must match one recipe.');
  const outcome = selected(environmentPlan, environmentResult);
  const environment = environmentPlan.environmentProfiles.find(row => row.id === outcome.id);
  validateRecipe(environment);
  validateChanceWheel(environmentPlan.chanceWheel);
  return { phase: 'survival-chance', decision: 'spin', rootInvocationId: environmentPlan.rootInvocationId,
    invocationId: `${environmentPlan.rootInvocationId}:chance`, ruleVersion: environmentPlan.ruleVersion,
    catalogVersion: environmentPlan.catalogVersion, sourceEnvironmentSpinId: environmentResult.spinId,
    environment: structuredClone(environment), wheel: structuredClone(environmentPlan.chanceWheel), nextStageAfterResult: 'backstory' };
}

function validateChanceWheel(wheel) {
  validateUniform(wheel?.outcomes);
  if (wheel.id !== 'survivalist-chance' || wheel.allowModifiers !== false || wheel.outcomes.length !== 9 ||
      wheel.outcomes.some((row, index) => row.value !== index * 12.5 || row.rewardKind !== rewardKind(row.value)))
    fail('INVALID_SURVIVALIST_CHANCE', 'Exactly nine values 0..100 in 12.5-point steps with the declared reward bands are required.');
}

/** Emit one stat modifier, one ordinary power grant, or both; never roll survival/death or mutate base stats. */
export function resolveSurvivalistChance(chancePlan, chanceResult) {
  validatePlan(chancePlan, 'survival-chance');
  validateChanceWheel(chancePlan.wheel); validateRecipe(chancePlan.environment);
  if (!nonempty(chancePlan.sourceEnvironmentSpinId) || chancePlan.nextStageAfterResult !== 'backstory')
    fail('INVALID_SURVIVALIST_PLAN', 'Environment source and saved Backstory return are required.');
  const outcome = selected(chancePlan, chanceResult), environment = chancePlan.environment;
  const ledgerKey = `${chancePlan.rootInvocationId}:survivalist-reward`;
  const common = { sourceArchetypeId: 'survivalist', sourceInvocationId: chancePlan.rootInvocationId,
    sourceSpinId: chanceResult.spinId, sourceEnvironmentSpinId: chancePlan.sourceEnvironmentSpinId, sourceEnvironmentId: environment.id };
  const effects = [];
  if (outcome.rewardKind !== 'power-only') effects.push({ ...common, id: `${ledgerKey}:stat`, type: 'stat-flat-modifier',
    stat: environment.statBuff.stat, amount: 1, applyAfterImmutableBase: true });
  if (outcome.rewardKind !== 'stat-only') effects.push({ ...common, id: `${ledgerKey}:power`, type: 'grant-power',
    instanceId: `${ledgerKey}:power`, definitionId: environment.powerRef.definitionId,
    definitionFile: environment.powerRef.definitionFile, catalogVersion: chancePlan.catalogVersion,
    masteryPolicy: 'recipient-shared-power-normal', surviveMainNone: true });
  return { decision: 'resolved', environmentId: environment.id, survivalChancePercent: outcome.value,
    rewardKind: outcome.rewardKind, effects, ledgerKey, nextStage: 'backstory' };
}
