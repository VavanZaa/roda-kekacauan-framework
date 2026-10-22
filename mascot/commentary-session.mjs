import {createMascotState,makeMascotReaction,normalizeMascotEvent,validateGeneratedReaction,repeatsMascotDialogue,commitMascotReaction,validateMascotState} from './personality.mjs';
// Per-episode memory and an injectable generator. No gameplay writes, RNG calls,
// or expectation sentence substituted for accepted model prose.
export function createMascotCommentarySession({provider=null,state=createMascotState()}={}){
 let memory=validateMascotState(state),generator=provider;
 return {
  setProvider(value){if(value!==null&&typeof value!=='function')throw Error('Commentary provider must be a function');generator=value;},
  getState:()=>structuredClone(memory),
  async react(input){
   const event=normalizeMascotEvent(input);
   const replay=memory.recent.find(r=>r.eventId===event.eventId);
   if(replay){const result=makeMascotReaction(memory,event);return result.reaction;}
   let result;
   if(generator){
    try{
     const output=await generator({event,state:structuredClone(memory)}),candidate=validateGeneratedReaction(output.reaction??output);
     if(candidate&&!repeatsMascotDialogue(candidate.text,memory.recent)){
      const expression=event.assessment?.status==='assessed'?event.assessment.expression:candidate.expression;
      result=commitMascotReaction(memory,event,{...candidate,expression,backend:output.reaction?.backend??'generated-provider'});
     }
    }catch{/* Explicit offline fallback; no model prose replaced by odds reports. */}
   }
   result??=makeMascotReaction(memory,event);memory=result.state;return result.reaction;
  }
 };
}
