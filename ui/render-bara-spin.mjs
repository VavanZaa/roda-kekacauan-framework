import {readFile,writeFile,mkdir,copyFile,rename} from 'node:fs/promises';
import {constants} from 'node:fs';
import {createHash,randomBytes} from 'node:crypto';
import {createRequire} from 'node:module';
import {spawn,execFileSync} from 'node:child_process';
import {once} from 'node:events';
import {fileURLToPath} from 'node:url';
import {renderWheelSVG} from './wheel-renderer.mjs';
import {normalizeDisplayPlan,selectDemoOutcome,stopRotation,motionProgress,outcomeAtRotation} from './wheel-geometry.mjs';
import {sampleMascotPose,mascotExpressionFor} from '../mascot/rig.mjs';
import {mascotActionFor} from '../mascot/motion.mjs';
import {createMascotSound,encodeMonoWav,BARA_PLAYBACK_GAIN} from '../mascot/sounds.mjs';

const sharp=createRequire(import.meta.url)('C:/Users/vavan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const directory=new URL('../renders/bara-wheel-spin-001/',import.meta.url),path=name=>fileURLToPath(new URL(name,directory));
await mkdir(directory,{recursive:true});
const audioOnly=process.argv.includes('--audio-only');
if(audioOnly){
  const history=new URL('history-synthetic/',directory);await mkdir(history,{recursive:true});
  for(const name of ['bara-wheel-spin-001.mp4','soundtrack.wav','bara-wang-wang.wav','audio-sources.json','media-receipt.json','verification.json']){
    try{await copyFile(path(name),fileURLToPath(new URL(name,history)),constants.COPYFILE_EXCL);}catch(e){if(!['EEXIST','ENOENT'].includes(e.code))throw e;}
  }
}
const source=JSON.parse(await readFile(new URL('../content/universal-element-wheel-design.json',import.meta.url),'utf8'));
const wheel=source.wheels.find(w=>w.id==='element-universal'),total=wheel.outcomes.reduce((s,o)=>s+o.baseWeight,0);
const draft=normalizeDisplayPlan({wheelId:wheel.id,contextLabel:'Spin baru · Bara',outcomes:wheel.outcomes.map(o=>({...o,probability:o.baseWeight/total}))});
let receipt;
try{receipt=JSON.parse(await readFile(path('spin.json'),'utf8'));}
catch(e){
  if(e.code!=='ENOENT')throw e;
  // Freeze the whole pool before exactly one external draw. Re-renders reuse it.
  const frozen=structuredClone(draft),sample=randomBytes(4).readUInt32LE(0)/4294967296,chosen=selectDemoOutcome(frozen,sample);
  receipt={schema:'bara-wheel-demo/1',createdAt:new Date().toISOString(),mode:'isolated-display-only',sample,plan:{...frozen,committedOutcomeId:chosen.id},result:chosen,grantsApplied:false,productionStateTouched:false};
  await writeFile(path('spin.json'),JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});
}
const plan=normalizeDisplayPlan(receipt.plan),chosen=plan.outcomes.find(o=>o.id===plan.committedOutcomeId);
const power=source.powers.find(p=>p.id===chosen.powerDefinitionRef?.definitionId);
if(!power)throw new Error('Selected Element must have its existing canonical power.');
const jokes={fire:'Panas. Bara ketemu Bara.',water:'Aku nggak ikut nyebur ya.',earth:'Bangun rumah dulu. Cicilan nanti.',wind:'Masuk angin versi premium.',lightning:'Jangan jadiin aku charger.',ice:'Dingin. Chat kamu kalah.',metal:'Magnet punya agenda.',plant:'Build kamu fotosintesis.',light:'Terang. Tagihan siapa?',darkness:'Mati lampu tapi niat.',shadow:'Bayangannya punya kerjaan.',void:'Lah, isinya kosong?'};
const element=power.elementId,reaction=jokes[element]||'Oke. Ini elemennya.',expression=mascotExpressionFor(chosen);
const fps=60,seconds=9.4,frames=Math.round(fps*seconds),spinAt=.65,spinSeconds=3.7,resultAt=spinAt+spinSeconds,mechanismAt=6.95;
const to=stopRotation(plan,chosen.id,0,3),captureTimes=[.4,3.55,4.8,5.2,7.3];
const previousPose=sampleMascotPose({expression:'thinking',action:'curious',actionElapsed:spinSeconds-1/fps,time:resultAt-1/fps});
function frameAt(time){
  const settled=time>=resultAt,rot=time<spinAt?0:time>=resultAt?to:to*motionProgress((time-spinAt)/spinSeconds);
  const phase=settled?'result':time<spinAt?'idle':time>resultAt-.95?'anticipation':'spinning';
  const elapsed=time-resultAt,spinning=time>=spinAt;
  const pose=sampleMascotPose({expression:settled?expression:spinning?'thinking':'idle',from:settled?'thinking':'idle',elapsed:settled?elapsed:time-spinAt,
    fromPose:settled?previousPose:null,fromMotion:settled?previousPose:null,time,
    action:settled?mascotActionFor(expression):spinning?'curious':'idle',actionElapsed:settled?elapsed:time-spinAt});
  const current=outcomeAtRotation(plan,rot);
  return renderWheelSVG(plan,{themeId:'element',phase,rotation:rot,resultId:settled?chosen.id:null,readout:settled?chosen.label:time>spinAt+1.7?current.label:'Lagi muter…',
    context:plan.contextLabel,mascotExpression:settled?expression:spinning?'thinking':'idle',mascotPose:pose,
    reaction:settled?(time>=mechanismAt?'Elemennya dapet. Mastery nanti.':reaction):'Hmm… bakal dapat apa?',
    caption:settled?(time>=mechanismAt?(power.label.replace(/ \([^)]*\)/g,'')+' · satu power, tanpa bonus stat.'):'Bara · Roda Kekacauan'):'Bara lagi mantau takdir.'});
}
if(!audioOnly)await sharp(Buffer.from(frameAt(4.8))).resize(720,1280).png().toFile(path('result.png'));
if(process.argv.includes('--still')){console.log(JSON.stringify({result:chosen.label,still:path('result.png')}));process.exit(0);}

const sampleRate=48000,mix=new Float32Array(Math.ceil(seconds*sampleRate)),animal=createMascotSound({expression,sampleRate});
function add(samples,at,gain=1){const offset=Math.round(at*sampleRate);for(let i=0;i<samples.length&&offset+i<mix.length;i++)if(offset+i>=0)mix[offset+i]+=samples[i]*gain;}
const ticks=[];let lastIndex=-1,lastTick=-1;
for(let frame=0;frame<=Math.round(spinSeconds*fps);frame++){
  const t=frame/fps,current=outcomeAtRotation(plan,to*motionProgress(t/spinSeconds));
  if(current.index!==lastIndex&&t-lastTick>.065){
    if(t>spinSeconds*.35){
      const samples=new Float32Array(Math.round(.032*sampleRate));
      for(let i=0;i<samples.length;i++){const s=i/sampleRate;samples[i]=Math.sin(2*Math.PI*(460*s-4600*s*s))*Math.exp(-s*160)*.035;}
      add(samples,spinAt+t);ticks.push(spinAt+t);
    }
    lastIndex=current.index;lastTick=t;
  }
}
for(const [i,f] of [220,277].entries()){
  const samples=new Float32Array(Math.round(.28*sampleRate));
  for(let j=0;j<samples.length;j++){const t=j/sampleRate;samples[j]=Math.sin(2*Math.PI*f*t)*Math.sin(Math.PI*t/.28)**2*.026;}
  add(samples,resultAt+i*.065);
}
add(animal.samples,resultAt+.16,BARA_PLAYBACK_GAIN);
await writeFile(path('bara-wang-wang.wav'),encodeMonoWav(animal.samples,sampleRate));
await writeFile(path('soundtrack.wav'),encodeMonoWav(mix,sampleRate));
const audio={speech:false,narration:false,sources:['original-procedural-wheel-ticks','original-result-tone','recorded-dog-bark-cc0'],bara:{cue:animal.cue,at:resultAt+.16,duration:animal.duration,syllables:animal.syllables,source:animal.source,processing:animal.processing,gain:BARA_PLAYBACK_GAIN},ticks,peak:mix.reduce((m,v)=>Math.max(m,Math.abs(v)),0)};
await writeFile(path('audio-sources.json'),JSON.stringify(audio,null,2)+'\n');

const ffmpeg=execFileSync('py',['-3.12','-c','import imageio_ffmpeg; print(imageio_ffmpeg.get_ffmpeg_exe())'],{encoding:'utf8',windowsHide:true}).trim();
const destination=path('bara-wheel-spin-001.mp4'),temporary=path('bara-wheel-spin-001.pending.mp4');
if(audioOnly){
  // Reuse every video packet and the exact saved draw; only replace the audio.
  const previous=JSON.parse(await readFile(path('media-receipt.json'),'utf8'));
  execFileSync(ffmpeg,['-v','error','-y','-i',destination,'-i',path('soundtrack.wav'),'-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','aac','-b:a','160k','-movflags','+faststart','-shortest',temporary],{windowsHide:true});
  execFileSync(ffmpeg,['-v','error','-i',temporary,'-f','null','-'],{windowsHide:true});
  await rename(temporary,destination);
  const bytes=await readFile(destination);
  await writeFile(path('media-receipt.json'),JSON.stringify({...previous,sha256:createHash('sha256').update(bytes).digest('hex'),audio,revision:'recorded-bark-soft/1',videoPacketsPreserved:true,priorVideoSha256:previous.sha256,fullDecodeVerified:true},null,2)+'\n');
  console.log(JSON.stringify({video:destination,result:chosen.label,audioOnly:true,peak:audio.peak,sound:animal.cue}));
  process.exit(0);
}
const encoder=spawn(ffmpeg,['-hide_banner','-loglevel','error','-y','-f','image2pipe','-vcodec','png','-r',String(fps),'-i','pipe:0','-i',path('soundtrack.wav'),'-map','0:v:0','-map','1:a:0','-c:v','libx264','-preset','fast','-crf','19','-pix_fmt','yuv420p','-c:a','aac','-b:a','160k','-movflags','+faststart','-shortest',temporary],{windowsHide:true,stdio:['pipe','ignore','pipe']});
let diagnostics='';encoder.stderr.on('data',d=>diagnostics+=d);const completion=once(encoder,'exit'),captures=new Set(captureTimes.map(t=>Math.round(t*fps))),contact=[];
try{
  for(let i=0;i<frames;i++){
    const png=await sharp(Buffer.from(frameAt(i/fps))).resize(720,1280).png().toBuffer();
    if(captures.has(i)){await writeFile(path(`frame-${i}.png`),png);contact.push({input:await sharp(png).resize(270,480).png().toBuffer(),left:contact.length*270,top:0});}
    if(!encoder.stdin.write(png))await once(encoder.stdin,'drain');
    if(i%(fps*2)===0)console.log(`Bara wheel: ${i}/${frames} frames · ${chosen.label}`);
  }
  encoder.stdin.end();const [code]=await completion;if(code!==0)throw new Error(diagnostics);
}catch(e){encoder.kill();throw e;}
await rename(temporary,destination);
await sharp({create:{width:contact.length*270,height:480,channels:4,background:'#111719'}}).composite(contact).png().toFile(path('contact-sheet.png'));
execFileSync(ffmpeg,['-hide_banner','-loglevel','error','-i',destination,'-f','null','-'],{windowsHide:true});
if(outcomeAtRotation(plan,to).id!==chosen.id)throw new Error('Spin landed on a different outcome.');
const bytes=await readFile(destination);
await writeFile(path('media-receipt.json'),JSON.stringify({video:destination,sha256:createHash('sha256').update(bytes).digest('hex'),width:720,height:1280,fps,seconds,frames,resultAt,mechanismAt,result:chosen.label,outcomeId:chosen.id,landingVerified:true,fullDecodeVerified:true,audio,facialDeformation:false,browserInteractionQA:false,productionStateTouched:false},null,2)+'\n');
console.log(JSON.stringify({video:destination,result:chosen.label,seconds,frames,sound:animal.cue}));
