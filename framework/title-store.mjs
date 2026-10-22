import { open, readFile, writeFile, rename, unlink } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { resolve, dirname, basename, join } from 'node:path';
import { createTitleUsage, validateTitleUsage, planTitleWheel, selectTitleOutcome,
  resolveTitleResult, applyTitleClaim, TitleWheelError } from './title-wheel.mjs';

export async function readTitleUsage(file, seriesId = 'roda-kekacauan-main') {
  let state;
  try { state = JSON.parse((await readFile(file, 'utf8')).replace(/^\uFEFF/, '')); }
  catch (error) { if (error.code === 'ENOENT') return createTitleUsage(seriesId); throw error; }
  validateTitleUsage(state);
  if (state.seriesId !== seriesId) throw new TitleWheelError('TITLE_SERIES_MISMATCH', 'Never reset another series in this file.');
  return state;
}

/** Compute then commit mechanics before video rendering; one lock guards pool+result+usage. */
export async function claimTitleInStore(file, input, { random = Math.random } = {}) {
  if (input.mode === 'preview') throw new TitleWheelError('PREVIEW_USAGE_DISABLED', 'Preview cannot claim production titles.');
  const target = resolve(file), lockPath = target + '.lock';
  let lock;
  try { lock = await open(lockPath, 'wx'); }
  catch (error) { if (error.code === 'EEXIST') throw new TitleWheelError('TITLE_STORE_BUSY', 'Another writer holds the title series; no automatic stale-lock removal.'); throw error; }
  let temp = null;
  try {
    await lock.writeFile(JSON.stringify({ purpose: 'title-series-claim', pid: process.pid, startedAt: new Date().toISOString() }));
    const usage = await readTitleUsage(target, input.seriesId);
    const plan = planTitleWheel(input, usage);
    if (plan.status !== 'ready') return plan;
    const outcomeId = plan.outcomes.length === 1 ? plan.outcomes[0].id : selectTitleOutcome(plan, random());
    const receipt = resolveTitleResult(plan, { runId: input.runId, characterId: input.characterId,
      invocationId: input.invocationId, outcomeId, resultId: 'title-result:' + randomUUID(),
      spinId: plan.actualSpin ? 'title-spin:' + randomUUID() : null }, usage);
    const next = applyTitleClaim(usage, receipt);
    temp = join(dirname(target), basename(target) + '.' + randomUUID() + '.tmp');
    // fsync contents before same-directory atomic replacement; preserve old file on failure.
    const handle = await open(temp, 'wx');
    try { await handle.writeFile(JSON.stringify(next, null, 2) + '\n', 'utf8'); await handle.sync(); }
    finally { await handle.close(); }
    await rename(temp, target); temp = null;
    return { status: 'claimed', receipt, usageRevision: next.revision };
  } finally {
    if (temp) await unlink(temp).catch(() => {});
    await lock.close();
    await unlink(lockPath);
  }
}
