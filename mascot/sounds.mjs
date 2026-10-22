// The approved real dog recording, leveled offline. No runtime network or model.
import { BARA_RECORDED_SOUND } from './recorded-sound-assets.mjs';
export const BARA_PLAYBACK_GAIN=1;
export const BARA_SOUND_CUES = {
  idle:{name:'wuff',starts:[0],gain:.85},
  smug:{name:'wang-wang',starts:[0,.30],gain:.9},
  hype:{name:'wang-wang!',starts:[0,.28],gain:1},
  laugh:{name:'wang-wang',starts:[0,.30],gain:.9},
  shock:{name:'wuff?',starts:[0],gain:.9},
  zonk:{name:'wuff',starts:[0],gain:.78},
  annoyed:{name:'wuff',starts:[0],gain:.8},
  sad:{name:'wuff',starts:[0],gain:.7},
  thinking:{name:'wuff?',starts:[0],gain:.8}
};
const baraRecordedPCM=Float32Array.from(BARA_RECORDED_SOUND.pcm16,v=>v/32768);

export function createMascotSound({expression='smug',sampleRate=48000}={}) {
  if(!Number.isInteger(sampleRate)||sampleRate<8000||sampleRate>96000)throw new Error('Invalid sound sample rate.');
  const cue=BARA_SOUND_CUES[expression]||BARA_SOUND_CUES.idle;
  const clipDuration=baraRecordedPCM.length/BARA_RECORDED_SOUND.sampleRate;
  const duration=cue.starts.at(-1)+clipDuration+.06,samples=new Float32Array(Math.ceil(duration*sampleRate));
  // Resample at the requested device rate while preserving real time and pitch.
  for(const start of cue.starts){
    for(let i=0;i<Math.ceil(clipDuration*sampleRate);i++){
      const position=i*BARA_RECORDED_SOUND.sampleRate/sampleRate,index=Math.floor(position),fraction=position-index;
      const a=baraRecordedPCM[index]||0,b=baraRecordedPCM[index+1]||0;
      samples[Math.round(start*sampleRate)+i]=(a+(b-a)*fraction)*cue.gain;
    }
  }
  return {samples,sampleRate,duration,cue:cue.name,syllables:cue.starts.length,source:BARA_RECORDED_SOUND.source,processing:BARA_RECORDED_SOUND.settings};
}

export function playMascotSound(context,expression='smug',delay=.16) {
  if(expression!=='hype')return {played:false,reason:'not-excited'};
  const sound=createMascotSound({expression,sampleRate:context.sampleRate});
  const buffer=context.createBuffer(1,sound.samples.length,sound.sampleRate);
  buffer.copyToChannel(sound.samples,0);
  const source=context.createBufferSource(),gain=context.createGain();
  source.buffer=buffer;gain.gain.value=BARA_PLAYBACK_GAIN;source.connect(gain).connect(context.destination);
  source.onended=()=>{source.disconnect();gain.disconnect();};
  source.start(context.currentTime+delay);
  return {played:true,cue:sound.cue,duration:sound.duration};
}

export function encodeMonoWav(samples,sampleRate=48000) {
  const bytes=new Uint8Array(44+samples.length*2),view=new DataView(bytes.buffer);
  const ascii=(at,text)=>{for(let i=0;i<text.length;i++)bytes[at+i]=text.charCodeAt(i);};
  ascii(0,'RIFF');view.setUint32(4,bytes.length-8,true);ascii(8,'WAVE');ascii(12,'fmt ');
  view.setUint32(16,16,true);view.setUint16(20,1,true);view.setUint16(22,1,true);
  view.setUint32(24,sampleRate,true);view.setUint32(28,sampleRate*2,true);view.setUint16(32,2,true);view.setUint16(34,16,true);
  ascii(36,'data');view.setUint32(40,samples.length*2,true);
  for(let i=0;i<samples.length;i++)view.setInt16(44+i*2,Math.round(Math.max(-1,Math.min(1,samples[i]))*32767),true);
  return bytes;
}
