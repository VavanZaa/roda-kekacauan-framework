// Content-led cadence. The approximate runtime never stretches or trims stages.
import {WHEEL_SPIN_MOTION} from '../ui/wheel-geometry.mjs';
export const SHORT_PACING_DEFAULTS=Object.freeze({spin:4.4,repeatSpin:3.4,lead:.08,
 resultHold:.35,minimumReadingHold:2.3,readingWordsPerSecond:5,readingSettle:.25});
const countWords=s=>String(s??'').trim().split(/\s+/).filter(Boolean).length;
export function applyShortPacing(episode,{approximateSeconds=180,...overrides}={}){
 for(const key of Object.keys(overrides))if(!(key in SHORT_PACING_DEFAULTS))throw Error('Unknown pacing parameter: '+key);
 const fps=episode.videoFps,policy={...SHORT_PACING_DEFAULTS,...overrides};
 if(!Number.isFinite(fps)||fps<=0)throw Error('Pacing needs a positive frame rate.');
 if(!Number.isFinite(approximateSeconds)||approximateSeconds<=0)throw Error('Approximate runtime must be positive.');
 for(const [key,value]of Object.entries(policy))if(!Number.isFinite(value)||value<0||(['spin','repeatSpin','minimumReadingHold','readingWordsPerSecond'].includes(key)&&value===0))throw Error('Invalid pacing parameter: '+key);
 const frames=s=>Math.ceil(s*fps-1e-8),tail={bonus:3.4,gacha:episode.gachaReveal.plan.duration,reveal:1,final:6};
 let plannedFrames=Object.values(tail).reduce((n,s)=>n+frames(s),0);
 for(const [i,e]of episode.events.entries()){
  const pages=e.systemExplanation?.pages;
  if(!pages?.length)throw Error('Pacing needs explicit SYSTEM pages.');
  let hold=0;
  for(const [j,page]of pages.entries()){
   // Count the simultaneously visible explanation and banter together once.
   // Preserve the caller's original reading minimum; reruns are idempotent.
   page.readingMinimumSeconds??=page.duration;
   if(!Number.isFinite(page.readingMinimumSeconds)||page.readingMinimumSeconds<0)throw Error('Invalid SYSTEM reading minimum.');
   const words=page.rows.reduce((n,r)=>n+countWords(r.text),0)+(j===0?countWords(e.reaction):0);
   const pageFrames=frames(Math.max(policy.minimumReadingHold,page.readingMinimumSeconds,policy.readingSettle+words/policy.readingWordsPerSecond));
   page.duration=pageFrames/fps;hold+=pageFrames;
  }
  if(e.kind==='notice'){
   e.presentationTiming={noticeHold:hold/fps,reason:'Concurrent natural cadence; reading time follows text'};
   plannedFrames+=hold;continue;
  }
  const repeat=/^ARMOR [123]$/.test(e.step),lead=frames(i===0?0:policy.lead),spin=frames(repeat?policy.repeatSpin:policy.spin),resultHold=frames(policy.resultHold);
  e.presentationTiming={lead:lead/fps,spin:spin/fps,resultHold:resultHold/fps,mechanismHold:hold/fps,reason:'Concurrent natural cadence; consistent spins and content-led reading holds'};
  plannedFrames+=lead+spin+resultHold+hold;
 }
 episode.presentationProfile={version:'concurrent-cadence/3',timingMode:'natural-cadence',approximateSeconds,
  spinMotion:{...WHEEL_SPIN_MOTION},
  plannedSeconds:plannedFrames/fps,plannedFrames,durationDeltaSeconds:plannedFrames/fps-approximateSeconds,
  rulesWithBara:true,tail,policy,fps};
 return episode.presentationProfile;
}
