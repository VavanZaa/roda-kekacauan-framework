import audit from '../../reference/size-profile-coverage.json' with { type: 'json' };
import weapons from '../../content/weapon-wheel-design.json' with { type: 'json' };
import powers from '../../content/main-power-wheel-design.json' with { type: 'json' };
import { planSizeStage } from '../size-wheel.mjs';
import { planStatWheel, resolveStatDraw } from '../stat-odds.mjs';

/** Authored preview/test inputs; never a production character or a title claim. */
export function titleFixture(caseId = 'human', options = {}) {
  const source = [...audit.terminalCases, ...audit.ownerRewardContextCases].find(c => c.id === caseId);
  if (!source) throw new Error('Unknown title example: ' + caseId);
  const input = structuredClone(source.input);
  input.runId = 'title-example-run'; input.characterId = options.characterId ?? 'example:' + caseId;
  input.invocationId = 'title-example'; input.seriesId = options.seriesId ?? 'roda-kekacauan-main';
  input.mode = options.mode ?? 'production';
  input.archetypeIds = options.roles ?? [];
  input.archetypeFacts = input.archetypeIds.map(r => ({ archetypeId: r, sourceId: 'role:' + r,
    committed: true, results: (options.roleResults?.[r] ?? []).map(([wheelId, outcomeId], i) =>
      ({ wheelId, outcomeId, spinId: 'role:' + r + ':' + i })) }));
  if (options.giant) input.raceFacts.push({ familyId: 'raksasa', sourceId: 'race:raksasa', committed: true, results: [] });
  const sizePlan = planSizeStage(input);
  if (sizePlan.status !== 'ready') throw new Error('Example Size unavailable: ' + caseId);
  input.sizePlan = sizePlan;
  input.sizeResult = { invocationId: sizePlan.invocationId, spinId: 'example:size', outcomeId: sizePlan.outcomes[options.sizeIndex ?? 5]?.id ?? sizePlan.outcomes[0].id };
  input.weapons = (options.weaponLabels ?? []).map((label, i) => {
    const d = weapons.weapons.find(w => w.label === label);
    if (!d) throw new Error('Unknown example weapon: ' + label);
    return { instanceId: 'weapon:' + i, sourceId: 'weapon:source:' + i, committed: true,
      ...structuredClone(d.weaponDefinitionRef), trainingProfileId: d.trainingProfileId };
  });
  input.powers = (options.powerIds ?? []).map((definitionId, i) => {
    const d = powers.recipes.find(p => p.powerDefinitionRef.definitionId === definitionId);
    if (!d) throw new Error('Unknown example power: ' + definitionId);
    return { ownedId: 'power:' + i, sourceId: 'power:source:' + i, committed: true, ...structuredClone(d.powerDefinitionRef) };
  });
  if (options.backstoryId) input.backstoryFact = { outcomeId: options.backstoryId, sourceId: 'example:backstory', spinId: 'example:backstory:spin', committed: true };
  const resolve = (target, value, weaponInstanceId) => {
    const plan = planStatWheel({ ...input, target, weaponInstanceId, allInResolution: input.statResults?.strength,
      invocationId: 'example:raw:' + target + ':' + (weaponInstanceId ?? '') });
    if (plan.status === 'fixed' || plan.status === 'copy') return plan;
    if (plan.status !== 'ready') throw new Error('Example raw unavailable: ' + JSON.stringify(plan));
    const outcome = plan.outcomes.find(o => o.value === value) ?? plan.outcomes[0];
    const first = { invocationId: plan.invocationId, spinId: plan.invocationId + ':first', outcomeId: outcome.id };
    const retry = plan.retryPolicy.active && outcome.value <= 5 ? { ...first, spinId: plan.invocationId + ':retry' } : null;
    const decision = plan.decisionPlan ? { invocationId: plan.decisionPlan.invocationId, spinId: plan.invocationId + ':decision', outcomeId: 'double' } : null;
    return resolveStatDraw(plan, first, retry, decision);
  };
  input.statResults = {};
  for (const s of ['strength','speed','durability','intelligence','fight']) input.statResults[s] = resolve(s, options.stats?.[s] ?? 4);
  input.weaponMasteryResults = Object.fromEntries(input.weapons.map(w => [w.instanceId, resolve('weapon-mastery', options.weaponMastery ?? 4, w.instanceId)]));
  if (input.powers.length) input.sharedPowerMastery = resolve('power-mastery', options.powerMastery ?? 4);
  input.preTitleModifiers = options.modifiers ?? {};
  input.weaknesses = options.weaknesses ?? [];
  input.completedThrough = 'apex'; input.apexReceipt = { sourceKey: 'example:completed-apex', committed: true,
    outcomeId: options.apexOutcomeId ?? 'chaos-none', effectResultIds: options.apexEffectIds ?? [] };
  if (options.slayerEvidence) input.slayerEvidence = options.slayerEvidence;
  return input;
}

export function titleExamples() {
  return [
    { label: 'Manusia biasa', input: titleFixture('human', { mode:'preview' }) },
    { label: 'Paladin + Excalibur', input: titleFixture('human', { mode:'preview', roles:['paladin'], weaponLabels:['Excalibur'], stats:{fight:7,strength:6}, backstoryId:'fallen-knight' }) },
    { label: 'Garuda + Flight', input: titleFixture('mythical-beast/local/garuda', { mode:'preview', powerIds:['flight'], stats:{speed:8,strength:6} }) },
    { label: 'Raksasa + Speed 0', input: titleFixture('human', { mode:'preview', giant:true, stats:{strength:8,durability:7,speed:0} }) },
    { label: 'Machine: Air Fryer', input: titleFixture('machine/household-appliance/air-fryer', { mode:'preview', stats:{strength:0,speed:0,durability:1,intelligence:0,fight:0} }) },
    { label: 'Shrek', input: titleFixture('goblinoid/orc/shrek', { mode:'preview', stats:{strength:7,durability:7,fight:6} }) },
    { label: 'Manusia + Equalizer', input: titleFixture('human', { mode:'preview', roles:['equaliser'] }) }
  ];
}
