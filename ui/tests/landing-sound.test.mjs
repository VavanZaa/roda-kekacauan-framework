import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {landingSoundFor,playLandingSound} from '../landing-sound.mjs';
import {LANDING_SOUND_ASSETS} from '../landing-sound-assets.mjs';
test('landing variants follow actual result feedback and fixed results stay silent',()=>{
 assert.equal(landingSoundFor({kind:'fixed'}),null);assert.equal(landingSoundFor({kind:'pending'}),null);
 assert.equal(landingSoundFor({kind:'ordinary',intensity:1}),'ordinary');assert.equal(landingSoundFor({kind:'strong',intensity:2}),'strong');
 assert.equal(landingSoundFor({kind:'funny',intensity:2}),'funny');assert.equal(landingSoundFor({kind:'none'}),'none');
});
test('original landing WAVs have bounded peaks, readable tails and matching UI bytes',async()=>{
 const manifest=JSON.parse(await readFile(new URL('../assets/audio/landing/manifest.json',import.meta.url)));
 assert.equal(manifest.speech,false);
 for(const [id,row]of Object.entries(manifest.variants)){
  const raw=await readFile(new URL('../../'+row.asset,import.meta.url));
  assert.equal(createHash('sha256').update(raw).digest('hex'),row.sha256);
  assert.equal(raw.toString('ascii',0,4),'RIFF');assert.equal(raw.toString('ascii',8,12),'WAVE');
  assert.equal(raw.readUInt16LE(22),1);assert.equal(raw.readUInt32LE(24),48000);
  let peak=0,sum=0;const n=(raw.length-44)/2;
  for(let i=44;i<raw.length;i+=2){const x=raw.readInt16LE(i)/32768;peak=Math.max(peak,Math.abs(x));sum+=x*x;}
  assert.ok(peak<=row.peak+.00002&&peak>=row.peak-.00004);assert.ok(Math.sqrt(sum/n)>.008);
  assert.equal(n/48000,row.duration);assert.ok(Math.abs(raw.readInt16LE(raw.length-2)/32768)<.001);
  assert.deepEqual(Buffer.from(LANDING_SOUND_ASSETS[id].dataUri.split(',')[1],'base64'),raw);
 }
});
test('playback decodes each sound once per context and creates a new source for each landing',async()=>{
 let decodes=0,starts=0;const context={destination:{},decodeAudioData:async bytes=>{decodes++;return {bytes};},createBufferSource:()=>({connect(){},start(){starts++;}})};
 assert.equal(await playLandingSound(context,{kind:'fixed'}),null);
 await Promise.all([playLandingSound(context,{kind:'strong',intensity:2}),playLandingSound(context,{kind:'strong',intensity:2})]);
 assert.equal(decodes,1);assert.equal(starts,2);
});
