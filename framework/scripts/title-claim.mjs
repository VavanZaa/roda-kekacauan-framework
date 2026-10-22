import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { readTitleUsage, claimTitleInStore } from '../title-store.mjs';

const args=process.argv.slice(2),store=fileURLToPath(new URL('../../state/title-usage.json',import.meta.url));
if(args.length===1&&args[0]==='--status') {
  const usage=await readTitleUsage(store);
  console.log(JSON.stringify({seriesId:usage.seriesId,usedTitleCount:usage.revision},null,2));
} else if(args.length===2&&args[0]==='--input') {
  const input=JSON.parse((await readFile(args[1],'utf8')).replace(/^\uFEFF/,''));
  const result=await claimTitleInStore(store,input);
  console.log(JSON.stringify(result,null,2));
} else {
  console.log('Title status: node framework/scripts/title-claim.mjs --status');
  console.log('Commit one actual recorded character: node framework/scripts/title-claim.mjs --input path-to-character.json');
  process.exitCode=2;
}
