import design from '../content/archaeologist-events-design.json' with { type: 'json' };

export class ArchaeologistInputError extends Error {
  constructor(code, message) { super(message); this.name = 'ArchaeologistInputError'; this.code = code; }
}
const fail = (code, message) => { throw new ArchaeologistInputError(code, message); };
const nonempty = value => typeof value === 'string' && value.length > 0;
const stats = new Set(['strength', 'speed', 'durability', 'intelligence', 'fight']);

function validatePackage(finding) {
  if (!finding || !nonempty(finding.id) || !nonempty(finding.label) || !nonempty(finding.timelineId) ||
      typeof finding.isCurrentTimeline !== 'boolean' || finding.isCurrentTimeline !== (finding.timelineId === 'present'))
    fail('INVALID_DISCOVERY', 'Canonical finding identity and explicit timeline are required.');
  const r = finding.reward;
  if (!r || !Array.isArray(r.statBuffs) || !Array.isArray(r.powerRefs) || !Number.isInteger(r.budgetPoints) ||
      r.statBuffs.some(b => !b || !stats.has(b.stat) || !Number.isInteger(b.amount) || b.amount <= 0) ||
      new Set(r.statBuffs.map(b => b.stat)).size !== r.statBuffs.length ||
      r.powerRefs.some(p => !p || !nonempty(p.definitionId) || !nonempty(p.definitionFile)) ||
      new Set(r.powerRefs.map(p => p.definitionId)).size !== r.powerRefs.length)
    fail('INVALID_DISCOVERY_PACKAGE', 'Explicit positive integer stat modifiers and intrinsic power references required.');
  const total = r.statBuffs.reduce((n,b) => n + b.amount, 0) + 2 * r.powerRefs.length;
  if (total !== r.budgetPoints || total > 3 || (finding.isCurrentTimeline ? total !== 0 : total < 1))
    fail('INVALID_DISCOVERY_BUDGET', 'Modern zero; past 1..3 total points, with one power worth two points.');
}

function validatePlan(plan) {
  if (!plan || plan.phase !== 'bone-discovery' || plan.decision !== 'spin' || !nonempty(plan.ruleVersion) ||
      !nonempty(plan.rootInvocationId) || !nonempty(plan.catalogVersion) || plan.invocationId !== `${plan.rootInvocationId}:bone-discovery` ||
      !Array.isArray(plan.findings) || plan.nextStageAfterResult !== 'backstory' ||
      plan.wheel?.id !== 'archaeologist-bone-discovered' || plan.wheel.allowModifiers !== false)
    fail('INVALID_DISCOVERY_PLAN', 'A frozen source-scoped discovery plan is required.');
  const rows = plan.wheel.outcomes;
  if (!Number.isInteger(plan.wheel.outcomeCount) || plan.wheel.outcomeCount <= 0 || !Array.isArray(rows) ||
      rows.length !== plan.wheel.outcomeCount || plan.findings.length !== rows.length ||
      new Set(rows.map(o => o?.id)).size !== rows.length || new Set(plan.findings.map(f => f?.id)).size !== rows.length ||
      rows.some(row => !nonempty(row?.id) || !nonempty(row.label) || row.baseWeight !== 1 ||
        !Number.isFinite(row.probability) || Math.abs(row.probability - 1 / rows.length) > 1e-12 ||
        !plan.findings.some(f => f.id === row.id && f.label === row.label)))
    fail('INVALID_DISCOVERY_POOL', 'Visible outcomes must match unique frozen recipes and equal normalized odds.');
  plan.findings.forEach(validatePackage);
}

/** Freeze display pool and exact reward packages; no RNG or speculative dating. */
export function planArchaeologistDiscovery({ invocationId, catalogVersion } = {}) {
  if (!nonempty(invocationId) || !nonempty(catalogVersion))
    fail('INVALID_DISCOVERY_INVOCATION', 'Stable role invocation and catalog version are required.');
  const findings = structuredClone(design.wheel.outcomes);
  const plan = { phase: 'bone-discovery', decision: 'spin', rootInvocationId: invocationId,
    invocationId: `${invocationId}:bone-discovery`, ruleVersion: design.version, catalogVersion, findings,
    wheel: { id: 'archaeologist-bone-discovered', outcomeCount: design.wheel.outcomeCount, allowModifiers: false,
      outcomes: findings.map(({ id,label,baseWeight,probability }) => ({ id,label,baseWeight,probability })) }, nextStageAfterResult: 'backstory' };
  validatePlan(plan);
  return plan;
}

/** Emit only the selected package, never its point budget as an additional bonus. */
export function resolveArchaeologistDiscovery(plan, result) {
  validatePlan(plan);
  if (!result || result.invocationId !== plan.invocationId || !nonempty(result.spinId) || !nonempty(result.outcomeId))
    fail('DISCOVERY_SOURCE_MISMATCH', 'Committed result must belong to the saved discovery invocation.');
  const finding = plan.findings.find(f => f.id === result.outcomeId);
  if (!finding) fail('UNKNOWN_DISCOVERY_OUTCOME', 'Result is not in the frozen Bone Discovered pool.');
  const ledgerKey = `${plan.rootInvocationId}:archaeologist-reward`;
  const common = { sourceArchetypeId: 'archaeologist', sourceInvocationId: plan.rootInvocationId,
    sourceSpinId: result.spinId, sourceFindingAnimalId: finding.id };
  const effects = finding.reward.statBuffs.map(b => ({ ...common, id: `${ledgerKey}:stat:${b.stat}`,
    type: 'stat-flat-modifier', stat: b.stat, amount: b.amount, applyAfterImmutableBase: true }));
  for (const ref of finding.reward.powerRefs) effects.push({ ...common, id: `${ledgerKey}:power:${ref.definitionId}`,
    type: 'grant-power', instanceId: `${ledgerKey}:power:${ref.definitionId}`,
    definitionId: ref.definitionId, definitionFile: ref.definitionFile, catalogVersion: plan.catalogVersion,
    bindings: { findingAnimalId: finding.id }, masteryPolicy: 'recipient-shared-power-normal', surviveMainNone: true });
  return { decision: 'resolved', findingId: finding.id, timelineId: finding.timelineId,
    budgetPoints: finding.reward.budgetPoints, effects, ledgerKey, nextStage: 'backstory' };
}
