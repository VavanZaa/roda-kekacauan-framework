import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {LAYOUT} from '../wheel-themes.mjs';
import {renderMascotGroup,sampleMascotPose} from '../../mascot/rig.mjs';
import {MASCOT_ACTIONS} from '../../mascot/motion.mjs';
import {BARA_SOUND_CUES,createMascotSound,playMascotSound,encodeMonoWav} from '../../mascot/sounds.mjs';
import {BARA_RECORDED_SOUND} from '../../mascot/recorded-sound-assets.mjs';

test('large animated Bara cannot touch the readout, result or commentary text',async()=>{
  const sharp=createRequire(import.meta.url)('C:/Users/vavan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
  assert.ok(LAYOUT.mascot.width>=250,'Bara must be readable on a phone');
  const protectedRegions=[[115,1230,750,38],LAYOUT.regions.result,LAYOUT.regions.reaction];
  for(const [action,{duration}] of Object.entries(MASCOT_ACTIONS)){
    for(let i=0;i<=8;i++){
      const pose=sampleMascotPose({expression:action==='bodyShake'?'laugh':'hype',action,actionElapsed:duration*i/8,time:i*.37});
      const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920">${renderMascotGroup({...LAYOUT.mascot,pose})}</svg>`;
      const {data,info}=await sharp(Buffer.from(svg)).ensureAlpha().raw().toBuffer({resolveWithObject:true});
      for(const [x,y,w,h] of protectedRegions){
        // Includes a 6px safety gap around the full text cards.
        for(let py=y-6;py<y+h+6;py++)for(let px=x-6;px<x+w+6;px++){
          assert.ok(data[(py*info.width+px)*4+3]<20,`${action} at ${i}/8 touches protected text (${px},${py})`);
        }
      }
    }
  }
});

test('Bara wuffs are deterministic, short and unclipped; PCM export matches playback',()=>{
  for(const expression of Object.keys(BARA_SOUND_CUES)){
    const a=createMascotSound({expression}),b=createMascotSound({expression});
    assert.deepEqual(a.samples,b.samples);assert.ok(a.duration<.7);
    assert.ok(a.samples.some(v=>Math.abs(v)>.01));assert.ok(a.samples.every(v=>Number.isFinite(v)&&Math.abs(v)<=.08));
    assert.equal(a.samples[0],0);assert.equal(a.samples.at(-1),0);
    const wav=encodeMonoWav(a.samples,a.sampleRate),v=new DataView(wav.buffer);
    assert.equal(v.getUint32(24,true),a.sampleRate);assert.equal(v.getUint32(40,true),a.samples.length*2);
    assert.equal(new TextDecoder().decode(wav.subarray(0,4)),'RIFF');
  }
  assert.equal(createMascotSound({expression:'hype'}).syllables,2);
  assert.equal(createMascotSound({expression:'zonk'}).syllables,1);
  assert.throws(()=>createMascotSound({sampleRate:0}),/sample rate/);
  let copied,start,disconnections=0;
  const source={connect:g=>g,start:t=>start=t,disconnect:()=>disconnections++};
  const gain={gain:{},connect:()=>{},disconnect:()=>disconnections++};
  const context={sampleRate:48000,currentTime:3,destination:{},createBuffer:()=>({copyToChannel:s=>copied=s}),createBufferSource:()=>source,createGain:()=>gain};
  assert.equal(playMascotSound(context,'hype').cue,'wang-wang!');assert.equal(start,3.16);assert.ok(copied.length>20000);
  source.onended();assert.equal(disconnections,2);
});

test('recorded bark is quieter with a raised relative floor, natural pitch and silent gaps',()=>{
  const bank=BARA_RECORDED_SOUND;
  assert.equal(bank.source.license,'CC0-1.0');assert.ok(bank.source.page.endsWith('/813120/'));
  assert.equal(bank.settings.pitchSemitones,0);
  assert.ok(bank.metrics.after.peakDb<=-21.9);
  assert.ok(bank.metrics.after.activeWindowRangeDb<bank.metrics.before.activeWindowRangeDb-3);
  assert.ok(bank.metrics.after.quietToLoudRatio>bank.metrics.before.quietToLoudRatio);
  for(const sampleRate of [8000,44100,48000,96000]){
    const a=createMascotSound({expression:'hype',sampleRate});
    assert.ok(Math.abs(a.duration-(.28+bank.duration+.06))<1e-9);
    assert.ok(a.samples.every(v=>Math.abs(v)<=.08));
    const silence=a.samples.subarray(Math.ceil(bank.duration*sampleRate),Math.floor(.28*sampleRate));
    assert.ok(silence.every(v=>v===0),'No artificial noise floor or raised silence');
  }
});
