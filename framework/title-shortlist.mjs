/** Shared by engine and offline editor. Curation is not another displayed wheel. */
export function buildTitleShortlist(catalog, tags, usedIds, seed, equalizerActive = false) {
  const hash = text => { let n = 2166136261; for (const c of text) { n ^= c.codePointAt(0); n = Math.imul(n, 16777619); } return n >>> 0; };
  const features = new Set(tags), disabled = new Set(usedIds);
  const rows = catalog.titles.filter(t => !disabled.has(t.id) &&
    t.eligibility.allTags.every(x => features.has(x)) &&
    (!t.eligibility.anyTags.length || t.eligibility.anyTags.some(x => features.has(x))))
    .map(t => ({ ...structuredClone(t), affinityScore: equalizerActive ? 1 :
      1 + t.affinityTags.filter(x => features.has(x)).length,
      tieKey: hash(seed + ':' + t.id) }));
  const choose = (kind, count) => rows.filter(t => t.kind === kind)
    .sort((a, b) => b.affinityScore - a.affinityScore || a.tieKey - b.tieKey || a.id.localeCompare(b.id))
    .slice(0, count);
  const contextual = choose('contextual', catalog.wheel.contextualSlots);
  const receh = choose('receh', catalog.wheel.recehSlots);
  const selected = [...contextual, ...receh].sort((a, b) => a.rewardOrder - b.rewardOrder || a.catalogOrder - b.catalogOrder);
  return { status: selected.length ? 'ready' : 'exhausted', eligibleCount: rows.length,
    contextualCount: contextual.length, recehCount: receh.length,
    requestedCount: catalog.wheel.contextualSlots + catalog.wheel.recehSlots,
    actualCount: selected.length, usedCount: disabled.size,
    equalizerActive, softAffinitiesApplied: !equalizerActive,
    outcomes: selected.map(t => ({ ...t, probability: 1 / selected.length })) };
}
