// Static SVG-to-video review asset; never opens or automates a browser.
import { readFile,writeFile,mkdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { renderWheelSVG } from './wheel-renderer.mjs';
import { normalizeDisplayPlan,stopRotation,motionProgress,outcomeAtRotation } from './wheel-geometry.mjs';
const require=createRequire(import.meta.url),sharp=require(process.env.RODA_NODE_PACKAGES+'/sharp');
const data=JSON.parse(await readFile(new URL('fixtures.json',import.meta.url),'utf8'));
const folder=new URL('assets/brand/demo-frames/',import.meta.url);await mkdir(folder,{recursive:true});
const plan=normalizeDisplayPlan(data.fixtures.strength[0].plan),chosen=plan.outcomes.find(o=>o.value===7),target=stopRotation(plan,chosen.id,0,3);
const fps=24,total=146,frames=[];
for(let i=0;i<total;i++){
  const time=i/fps,p=Math.max(0,Math.min(1,(time-.6)/3.7)),rotation=target*motionProgress(p),settled=time>=4.3;
  const options={themeId:'strength',rotation,phase:time<.6?'idle':settled?'result':p>.72?'anticipation':'spinning',
    resultId:settled?chosen.id:null,readout:time<.6?'Takdir belum diputar.':outcomeAtRotation(plan,rotation).label,
    reaction:settled?'Strength-nya kebuka.':null,caption:'Demo visual · hasil dipilih untuk pratinjau'};
  const svg=renderWheelSVG(plan,options),name=`frame-${String(i).padStart(4,'0')}.png`;
  await sharp(Buffer.from(svg)).resize(540,960).png().toFile(fileURLToPath(new URL(name,folder)));
  if(i===total-1)await writeFile(new URL('assets/brand/strength-preview.svg',import.meta.url),svg);
  frames.push({frame:i,time,phase:options.phase,rotation,visibleOutcomeId:outcomeAtRotation(plan,rotation).id});
}
await writeFile(new URL('assets/brand/demo-timeline.json',import.meta.url),JSON.stringify({mode:'display-only-selected-example',fps,frames,selectedOutcomeId:chosen.id,productionStateTouched:false},null,2)+'\n');
console.log('146 SVG frames rasterized for a silent 6.08-second review clip.');
