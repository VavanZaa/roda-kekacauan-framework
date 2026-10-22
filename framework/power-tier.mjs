import { readFileSync } from 'node:fs';

const catalog = JSON.parse(readFileSync(new URL('../content/power-tier-design.json', import.meta.url), 'utf8'));
export const POWER_TIER_POLICY_VERSION = catalog.version;

const ratings = new Map(catalog.ratings.map(row => [JSON.stringify([row.definitionFile, row.definitionId]), row]));
const labels = new Map(catalog.tiers.map(row => [row.tier, row.label]));
const needsConfiguration = reason => ({ status: 'needs_configuration', reason });

/** Resolve rating metadata from an exact canonical reference; never mutate gameplay. */
export function resolvePowerTier(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return needsConfiguration('missing-power-definition-reference');
  }
  const { definitionId, definitionFile, grantMode = 'power', tierPolicyVersion = POWER_TIER_POLICY_VERSION } = input;
  if (tierPolicyVersion !== POWER_TIER_POLICY_VERSION) {
    return needsConfiguration('unsupported-tier-policy-version');
  }
  if (typeof definitionId !== 'string' || typeof definitionFile !== 'string') {
    return needsConfiguration('missing-power-definition-reference');
  }
  const rating = ratings.get(JSON.stringify([definitionFile, definitionId]));
  if (!rating) return needsConfiguration('unknown-power-definition-reference');
  const modes = rating.grantModeTiers ?? { power: rating.powerTier };
  if (typeof grantMode !== 'string' || !Object.hasOwn(modes, grantMode)) {
    return needsConfiguration('undeclared-power-grant-mode');
  }
  const powerTier = modes[grantMode];
  if (!Number.isInteger(powerTier) || powerTier < 1 || powerTier > 5 || !labels.has(powerTier)) {
    return needsConfiguration('invalid-power-tier-metadata');
  }
  return Object.freeze({
    status: 'ok', definitionId, definitionFile, grantMode,
    powerTier, tierLabel: labels.get(powerTier), tierPolicyVersion,
    reason: grantMode === 'authority'
      ? 'Authority uses the existing concept-domain scope; its rating is independent of maximum mastery.'
      : rating.reason,
  });
}
