import { writeFile } from 'node:fs/promises';
import coverage from '../../reference/size-profile-coverage.json' with { type: 'json' };
import design from '../../content/weapon-wheel-design.json' with { type: 'json' };
import { planSizeStage } from '../size-wheel.mjs';
import { planWeaponWheel } from '../weapon-wheel.mjs';

function auditCase(c) {
  const input = structuredClone(c.input), sizePlan = planSizeStage(input);
  if (sizePlan.status !== 'ready') throw new Error(`Size: ${c.id}`);
  const p = planWeaponWheel({ ...input, invocationId: 'weapon-audit', sizePlan,
    sizeResult: { invocationId: sizePlan.invocationId, spinId: 'audit-size', outcomeId: sizePlan.outcomes[5]?.id ?? sizePlan.outcomes[0].id },
    weapons: [], powers: [] });
  if (p.status !== 'ready') throw new Error(`Weapon: ${c.id}`);
  const physical = p.trace.raceProfiles, wrapper = p.trace.wrapperProfiles;
  return { caseId: c.id, familyId: c.familyId,
    actualIdentity: input.raceFacts.map(f => ({ familyId: f.familyId, sourceId: f.sourceId, results: f.results })),
    baselineNoneProbability: p.trace.noneProbability,
    weaponReliance: wrapper.length ? 'host-origin-composite' : physical[0].weaponReliance,
    physicalProfileIds: physical.map(p => p.id), wrapperProfileIds: wrapper.map(p => p.id),
    preferences: [...new Set([...physical, ...wrapper].flatMap(p => Object.keys(p.tagFactors)))],
    rationale: [...physical, ...wrapper].map(p => p.rationale),
    perTierProbability: p.trace.tierMasses[0].probability,
    calibration: 'authored-lore-prior', normalized: Math.abs(p.outcomes.reduce((s, o) => s + o.probability, 0) - 1) < 1e-12 };
}
const rows = coverage.terminalCases.map(auditCase);
const rewardContextRows = coverage.ownerRewardContextCases.map(auditCase);
const audit = { version: 'weapon-race-audit/0.1.0', date: '2026-10-11', modelVersion: design.probabilityModel.version,
  scope: `All current${rows.length} normal-form terminal identity fixtures across22 family memberships, including every110 active hero reference and every Machine model/appliance, plus${rewardContextRows.length} armor/color/cheat/external-pilot reward contexts. Wrapper examples use their actual host/origin facts. Symbolic combinations use the same source-scoped composition function.`,
  interpretation: 'None means no ADDITIONAL portable weapon acquisition. Existing race weapons, powers, ring/armor/board and authorized extras remain. No weapon/mastery/stat/enchant grants follow from this audit. All rates are editable game calibration; not observed canon ownership rates.',
  reviewedTerminalCaseCount: rows.length, familyCount: new Set(rows.map(r => r.familyId)).size,
  reviewedRewardContextCaseCount: rewardContextRows.length,
  physicalProfileCount: design.probabilityModel.raceProfiles.length, wrapperProfileCount: design.probabilityModel.wrapperProfiles.length,
  method: 'Canonical completed owner selectors choose one deepest physical profile; average physical item log affinities, compose host None prior, then add one most-specific wrapper overlay per source plus actual role/subtype/Backstory factors. Ordinary item factor cap2; normalize within each equal Tier. No caption/name inference at runtime.',
  evidence: { retainedResearch: ['reference/size-calibration-research.json', 'reference/race-content-research.json', 'reference/cosmic-warrior-media-research.json', 'reference/machine-content-research.json'],
    selectedPrimarySources: design.referenceExamples.slice(4), fallback: 'Existing accepted game recipes plus explicitly authored assumptions for unsourced propensity; every numerical None prior and affinity is our game choice. Lyra/Perseus/Auriga/Chameleon motifs are authored adaptations; no claim of a newly verified full canon package.' },
  rows, rewardContextRows,
  weaponTagCoverage: design.weapons.map(w => ({ weaponId: w.id, label: w.label, aliases: w.aliases ?? [], tier: w.tier, tags: w.tags,
    matchingRaceProfileCount: design.probabilityModel.raceProfiles.filter(p => w.tags.some(t => Object.hasOwn(p.tagFactors, t))).length,
    unmatchedPolicy: 'Positive neutral base1; never hard-exclude an odd weapon merely because affinity is absent.' })) };
await writeFile(new URL('../../reference/weapon-race-affinity-audit.json', import.meta.url), JSON.stringify(audit, null, 2) + '\n', 'utf8');
console.log(`Audited${rows.length} terminal owner identities/${audit.familyCount} families,${rewardContextRows.length} reward variants and${audit.weaponTagCoverage.length} weapon tag recipes.`);
