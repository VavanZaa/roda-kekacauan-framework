import design from '../content/disciple-events-design.json' with { type: 'json' };
import powerCatalog from '../content/universal-power-wheels-design.json' with { type: 'json' };

export class DiscipleInputError extends Error {
  constructor(code, message) { super(message); this.name = 'DiscipleInputError'; this.code = code; }
}
const fail = (code, message) => { throw new DiscipleInputError(code, message); };
const nonempty = v => typeof v === 'string' && v.length > 0;
const stats = new Set(design.archiveContract.stats);
const categories = ['weapon', 'power', 'best-stat'];
const uniform = rows => rows.map(row => ({ ...structuredClone(row), baseWeight: 1, probability: 1 / rows.length }));
const needs = required => ({ decision: 'needs_configuration', required: [required] });

function ownedPowerIds(ids) {
  if (!Array.isArray(ids) || ids.some(id => !nonempty(id)) || new Set(ids).size !== ids.length)
    fail('INVALID_OWNED_POWERS', 'Owned canonical power IDs must be an explicit unique array.');
  return new Set(ids);
}

function inventory(rows) {
  if (!Array.isArray(rows)) fail('INVALID_MENTOR_INVENTORY', 'Explicit inventory arrays are required; absent is not empty.');
  const ids = new Set();
  return rows.map(row => {
    if (!row || !nonempty(row.id) || !nonempty(row.definitionId) || !nonempty(row.label) || ids.has(row.id))
      fail('INVALID_MENTOR_INVENTORY', 'Unique instance IDs and definition/label are required.');
    ids.add(row.id);
    const projected = { id: row.id, definitionId: row.definitionId, label: row.label };
    for (const key of ['bindings', 'limitations']) if (row[key] !== undefined) projected[key] = structuredClone(row[key]);
    return projected;
  });
}

function mentor(record) {
  if (!record || !nonempty(record.characterId) || !nonempty(record.snapshotId) || !nonempty(record.name) || record.status !== 'complete')
    fail('INVALID_MENTOR_RECORD', 'Only completed, uniquely identified mentor snapshots are eligible.');
  return { characterId: record.characterId, snapshotId: record.snapshotId, name: record.name, status: 'complete',
    weaponInstances: inventory(record.weaponInstances), powerInstances: inventory(record.powerInstances),
    ...(record.bestStatIds !== undefined ? { bestStatIds: structuredClone(record.bestStatIds) } : {}),
    ...(record.bestStatComparisonProfileId !== undefined ? { bestStatComparisonProfileId: record.bestStatComparisonProfileId } : {}) };
}

function planAt(plan, phase) {
  if (!plan || plan.phase !== phase || plan.decision !== 'spin' || !nonempty(plan.invocationId) ||
      !nonempty(plan.rootInvocationId) || !nonempty(plan.ruleVersion) || !nonempty(plan.catalogVersion))
    fail('INVALID_DISCIPLE_PLAN', 'A saved source-scoped Disciple plan is required.');
}

function committed(plan, result, rows) {
  if (!result || result.invocationId !== plan.invocationId || !nonempty(result.spinId) || !nonempty(result.outcomeId))
    fail('DISCIPLE_SOURCE_MISMATCH', 'Committed result must belong to this saved invocation.');
  const row = rows.find(row => row.id === result.outcomeId);
  if (!row) fail('UNKNOWN_DISCIPLE_OUTCOME', 'Result is not in the frozen eligible pool.');
  return row;
}

function validateUniform(rows) {
  if (!Array.isArray(rows) || !rows.length || new Set(rows.map(row => row?.id)).size !== rows.length ||
      rows.some(row => !nonempty(row?.id) || row.baseWeight !== 1 || Math.abs(row.probability - 1 / rows.length) > 1e-12 || !Number.isFinite(row.probability)))
    fail('INVALID_DISCIPLE_PLAN', 'Frozen candidate probabilities must be equal and normalized.');
}

/** Freeze the prior completed-character projection; no database access or random draw. */
export function planDiscipleMentor({ invocationId, currentCharacterId, archiveSnapshot, ownedPowerDefinitionIds = [] } = {}) {
  if (!nonempty(invocationId) || !nonempty(currentCharacterId)) fail('INVALID_DISCIPLE_INVOCATION', 'Source invocation/current character IDs required.');
  const owned = ownedPowerIds(ownedPowerDefinitionIds);
  if (!archiveSnapshot) return needs('previous-character-archive');
  const archive = archiveSnapshot;
  if (!nonempty(archive.id) || !nonempty(archive.catalogVersion) || archive.capturedBeforeCharacterId !== currentCharacterId || !Array.isArray(archive.records))
    fail('INVALID_DISCIPLE_ARCHIVE', 'A versioned archive captured before saving this character is required.');
  const records = archive.records.filter(record => record?.status === 'complete' && record.characterId !== currentCharacterId).map(mentor);
  if (new Set(records.map(record => record.characterId)).size !== records.length)
    fail('DUPLICATE_MENTOR', 'One completed record per character; duplicate versions cannot multiply weight.');
  if (!records.length) {
    const wheel = powerCatalog.wheels.find(row => row.id === design.godMentorFallback.wheelId);
    const choices = wheel.outcomes.map(row => {
      const grant = row.effects.find(effect => effect.type === 'grant-power');
      return { id: row.id, label: row.label, powerTier: row.powerTier,
        definitionId: grant.definitionId, definitionFile: grant.definitionFile };
    }).filter(row => !owned.has(row.definitionId));
    if (!choices.length) return needs('exhausted-power-divine-pool-policy');
    return { phase: 'god-lesson', decision: 'spin', invocationId: `${invocationId}:god-lesson`, rootInvocationId: invocationId,
      ruleVersion: design.version, catalogVersion: powerCatalog.version, archiveSnapshotId: archive.id,
      mentorLabel: 'God', wheel: { id: wheel.id, allowModifiers: true, outcomes: uniform(choices) } };
  }
  return { phase: 'mentor', decision: 'spin', invocationId: `${invocationId}:mentor`, rootInvocationId: invocationId,
    ruleVersion: design.version, catalogVersion: archive.catalogVersion, archiveSnapshotId: archive.id,
    mentors: records, wheel: { id: 'disciple-mentor', allowModifiers: false,
      outcomes: uniform(records.map(record => ({ id: record.characterId, label: record.name }))) } };
}

/** The selected mentor does not alter the three equally weighted reward categories. */
export function planDiscipleInheritance(mentorPlan, mentorResult) {
  planAt(mentorPlan, 'mentor'); validateUniform(mentorPlan.wheel?.outcomes);
  const selected = committed(mentorPlan, mentorResult, mentorPlan.wheel.outcomes);
  const record = mentorPlan.mentors?.find(record => record.characterId === selected.id);
  const saved = mentor(record);
  return { phase: 'inheritance-category', decision: 'spin', invocationId: `${mentorPlan.rootInvocationId}:category`,
    rootInvocationId: mentorPlan.rootInvocationId, ruleVersion: mentorPlan.ruleVersion, catalogVersion: mentorPlan.catalogVersion,
    archiveSnapshotId: mentorPlan.archiveSnapshotId, mentorSourceSpinId: mentorResult.spinId, mentor: saved,
    wheel: { id: 'disciple-inheritance-category', allowModifiers: false,
      outcomes: uniform(categories.map(id => ({ id, label: id === 'best-stat' ? 'Best Stat' : id === 'weapon' ? 'Weapon' : 'Power' }))) } };
}

/** One internal uniform pick, or a resolved empty-category zonk; never reroll categories. */
export function planDiscipleReward(categoryPlan, categoryResult, { ownedPowerDefinitionIds = [] } = {}) {
  const owned = ownedPowerIds(ownedPowerDefinitionIds);
  planAt(categoryPlan, 'inheritance-category'); validateUniform(categoryPlan.wheel?.outcomes);
  if (categoryPlan.wheel.outcomes.length !== 3 || categories.some(id => !categoryPlan.wheel.outcomes.some(row => row.id === id)))
    fail('INVALID_DISCIPLE_PLAN', 'All three categories remain eligible, including empty categories.');
  const category = committed(categoryPlan, categoryResult, categoryPlan.wheel.outcomes).id;
  const record = mentor(categoryPlan.mentor);
  let choices;
  if (category === 'best-stat') {
    if (record.bestStatIds === undefined || !nonempty(record.bestStatComparisonProfileId)) return needs('mentor-best-stat-comparison-profile');
    if (!Array.isArray(record.bestStatIds) || !record.bestStatIds.length || new Set(record.bestStatIds).size !== record.bestStatIds.length || record.bestStatIds.some(id => !stats.has(id)))
      fail('INVALID_BEST_STATS', 'Unique tied best-stat keys must come from the five approved stats.');
    choices = record.bestStatIds.map(id => ({ id, stat: id, label: id }));
  } else {
    choices = inventory(record[category === 'weapon' ? 'weaponInstances' : 'powerInstances']);
    if (category === 'power') choices = choices.filter(row => !owned.has(row.definitionId));
  }
  const source = { rootInvocationId: categoryPlan.rootInvocationId, ruleVersion: categoryPlan.ruleVersion,
    catalogVersion: categoryPlan.catalogVersion, archiveSnapshotId: categoryPlan.archiveSnapshotId,
    mentorCharacterId: record.characterId, mentorSnapshotId: record.snapshotId, mentorSourceSpinId: categoryPlan.mentorSourceSpinId,
    category, categorySourceSpinId: categoryResult.spinId, ledgerKey: `${categoryPlan.rootInvocationId}:disciple-inheritance` };
  if (!choices.length) return { ...source, decision: 'resolved', outcome: 'zonk', effects: [], nextStage: 'backstory' };
  return { ...source, phase: 'inheritance-choice', decision: 'random-pick', visibleWheel: false,
    invocationId: `${categoryPlan.rootInvocationId}:candidate`, choicePool: uniform(choices),
    ...(category === 'best-stat' ? { bestStatComparisonProfileId: record.bestStatComparisonProfileId } : {}) };
}

/** A known-empty archive grants one ordinary Divine lesson, without the God race package. */
export function resolveDiscipleGodLesson(lessonPlan, lessonResult) {
  planAt(lessonPlan, 'god-lesson');
  if (lessonPlan.mentorLabel !== 'God' || lessonPlan.wheel?.id !== 'power-divine' || !nonempty(lessonPlan.archiveSnapshotId))
    fail('INVALID_DISCIPLE_PLAN', 'A frozen God lesson from an empty archive is required.');
  validateUniform(lessonPlan.wheel.outcomes);
  const selected = committed(lessonPlan, lessonResult, lessonPlan.wheel.outcomes);
  if (!nonempty(selected.definitionId) || !nonempty(selected.definitionFile) || !nonempty(selected.label) ||
      !Number.isInteger(selected.powerTier) || selected.powerTier < 1 || selected.powerTier > 5)
    fail('INVALID_DISCIPLE_PLAN', 'Saved canonical Divine power definition and tier are required.');
  const ledgerKey = `${lessonPlan.rootInvocationId}:disciple-god-lesson`;
  return { decision: 'resolved', outcome: 'god-lesson', mentorLabel: 'God', ledgerKey,
    effects: [{ id: ledgerKey, type: 'grant-power', sourceArchetypeId: 'disciple',
      sourceInvocationId: lessonPlan.rootInvocationId, sourceSpinId: lessonResult.spinId,
      instanceId: `${ledgerKey}:power`, definitionId: selected.definitionId, definitionFile: selected.definitionFile,
      label: selected.label, powerTier: selected.powerTier, catalogVersion: lessonPlan.catalogVersion,
      masteryPolicy: 'recipient-shared-power-normal', grantMode: 'power', surviveMainNone: true }], nextStage: 'backstory' };
}

/** Consume a saved internal pick and emit one recipient-owned reward; no RNG or mutation. */
export function resolveDiscipleInheritance(pickPlan, pickResult) {
  if (!pickPlan || pickPlan.phase !== 'inheritance-choice' || pickPlan.decision !== 'random-pick' ||
      !nonempty(pickPlan.invocationId) || !nonempty(pickPlan.rootInvocationId) || !nonempty(pickPlan.catalogVersion) ||
      !nonempty(pickPlan.mentorCharacterId) || !nonempty(pickPlan.mentorSnapshotId) || !nonempty(pickPlan.categorySourceSpinId) ||
      !categories.includes(pickPlan.category) || pickPlan.ledgerKey !== `${pickPlan.rootInvocationId}:disciple-inheritance`)
    fail('INVALID_DISCIPLE_PLAN', 'A frozen candidate pick and source ledger are required.');
  validateUniform(pickPlan.choicePool);
  if (!pickResult || pickResult.invocationId !== pickPlan.invocationId || !nonempty(pickResult.pickId) || !nonempty(pickResult.outcomeId))
    fail('DISCIPLE_SOURCE_MISMATCH', 'Internal pick must belong to the saved candidate invocation.');
  const selected = pickPlan.choicePool.find(row => row.id === pickResult.outcomeId);
  if (!selected) fail('UNKNOWN_DISCIPLE_OUTCOME', 'Internal pick is not in the saved candidate pool.');
  const common = { id: pickPlan.ledgerKey, sourceArchetypeId: 'disciple', sourceInvocationId: pickPlan.rootInvocationId,
    sourceSpinId: pickPlan.categorySourceSpinId, sourcePickId: pickResult.pickId,
    mentorCharacterId: pickPlan.mentorCharacterId, mentorSnapshotId: pickPlan.mentorSnapshotId };
  let effect;
  if (pickPlan.category === 'best-stat') {
    if (!stats.has(selected.stat) || selected.id !== selected.stat || !nonempty(pickPlan.bestStatComparisonProfileId))
      fail('INVALID_BEST_STATS', 'Saved best-stat key and comparison profile required.');
    effect = { ...common, type: 'stat-flat-modifier', stat: selected.stat, amount: 1, applyAfterImmutableBase: true };
  } else {
    const item = inventory([selected])[0];
    effect = { ...common, type: pickPlan.category === 'weapon' ? 'grant-weapon' : 'grant-power',
      instanceId: `${pickPlan.ledgerKey}:${pickPlan.category}`, definitionId: item.definitionId, label: item.label,
      catalogVersion: pickPlan.catalogVersion, mentorInstanceId: item.id,
      ...(item.bindings !== undefined ? { bindings: item.bindings } : {}),
      ...(item.limitations !== undefined ? { limitations: item.limitations } : {}),
      masteryPolicy: pickPlan.category === 'weapon' ? 'recipient-per-weapon-normal' : 'recipient-shared-power-normal',
      surviveMainNone: true };
  }
  return { decision: 'resolved', outcome: 'inherited', category: pickPlan.category,
    ledgerKey: pickPlan.ledgerKey, effects: [effect], nextStage: 'backstory' };
}
