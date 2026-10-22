import {LANDING_SOUND_ASSETS} from './landing-sound-assets.mjs';
export function landingSoundFor(feedback){
 if(!feedback||['pending','fixed'].includes(feedback.kind))return null;
 if(feedback.kind==='none')return 'none';
 if(feedback.kind==='funny')return 'funny';
 return feedback.intensity===2?'strong':'ordinary';
}
const contexts=new WeakMap();
export async function playLandingSound(context,feedback){
 const id=landingSoundFor(feedback);if(!id)return null;
 let cache=contexts.get(context);if(!cache){cache=new Map();contexts.set(context,cache);}
 if(!cache.has(id)){
  const bytes=Uint8Array.from(atob(LANDING_SOUND_ASSETS[id].dataUri.split(',')[1]),c=>c.charCodeAt(0));
  cache.set(id,context.decodeAudioData(bytes.buffer));
 }
 const buffer=await cache.get(id),source=context.createBufferSource();source.buffer=buffer;
 source.onended=()=>source.disconnect();
 source.connect(context.destination);source.start();return id;
}
