import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {paginateSystemNotice,renderSystemNotice} from '../system-notice.mjs';
import {renderWheelSVG} from '../wheel-renderer.mjs';
import {systemRulesForEvent} from '../../video/system-rules.mjs';
import {applyShortPacing} from '../../video/short-pacing.mjs';
const ep=JSON.parse(await readFile(new URL('../../renders/episode-002-r7/episode.json',import.meta.url),'utf8'));

test('system rules are separate from dialogue and leave every frozen game fact intact',()=>{
 const before=structuredClone(ep);
 for(const e of ep.events){
  const notice=systemRulesForEvent(e);
  assert.equal(notice.voice,'system');assert.ok(notice.pages.length);
  assert.notEqual(notice.rows.map(r=>r.text).join(' '),e.reaction);
  for(const p of notice.pages){assert.ok(p.height<=625);assert.ok(p.duration>=3.2);}
 }
 assert.deepEqual(ep,before);
});
test('long system notices paginate without shrinking or losing rule text',()=>{
 const text=Array.from({length:180},(_,i)=>'Aturan'+i).join(' '),notice={voice:'system',title:'Aturan panjang',rows:[{label:'ATURAN',text}]};
 const pages=paginateSystemNotice(notice);assert.ok(pages.length>1);
 assert.equal(pages.flatMap(p=>p.rows.map(r=>r.text)).join(' '),text);
 for(const p of pages){const svg=renderSystemNotice(p);assert.ok(svg.includes('font-size="36"'));assert.ok(p.height<=625);}
});
test('weapon gate explains final mastery including bonuses; enchant names its own weapon',()=>{
 const mastery=systemRulesForEvent(ep.events.find(e=>e.step==='WEAPON MASTERY'));
 assert.match(mastery.rows[0].text,/akhir.*Master/);assert.match(mastery.rows[0].text,/Bonus mastery/);
 const enchant=systemRulesForEvent(ep.events.find(e=>e.step==='ENCHANTMENT'));
 assert.match(enchant.rows[0].text,/Revolver/);assert.match(enchant.rows[1].text,/tidak menjadi power tubuh/);
});
test('rules explain pending power, no-repeat armor, shared mastery and no future Chaos spoiler',()=>{
 assert.match(systemRulesForEvent(ep.events[2]).rows[1].text,/dikeluarkan/);
 assert.match(systemRulesForEvent(ep.events[7]).rows[1].text,/setelah Power utama/);
 assert.match(systemRulesForEvent(ep.events[19]).rows[0].text,/semua power/);
 for(const e of ep.events.slice(0,21))assert.doesNotMatch(systemRulesForEvent(e).rows.map(r=>r.text).join(' '),/Chaos|Intelligence −1|Fight \+1/);
});
test('explicit R8 recovery mode paints system above the wheel and removes Bara speech',()=>{
 const e=ep.events[15],page=systemRulesForEvent(e,{presentation:'exclusive'}).pages[0];
 const svg=renderWheelSVG(e.plan,{phase:'mechanism',themeId:e.theme,resultId:e.result.outcomeId,systemPage:page,reaction:e.reaction});
 assert.ok(svg.indexOf('data-system-notice')>svg.indexOf('layer-14-reaction'));
 assert.ok(svg.includes('data-voice="system"'));assert.ok(svg.includes('SISTEM'));
 assert.ok(!svg.includes('data-bara-dialogue'));assert.ok(!svg.includes(e.reaction));
 assert.ok(!svg.includes('EFEK HASIL'));
});
test('rules cannot be fabricated from an unknown route or an empty notice',()=>{
 assert.throws(()=>systemRulesForEvent({step:'UNKNOWN',plan:{wheelId:'test'}}),/No reviewed/);
 assert.throws(()=>paginateSystemNotice({voice:'bara',title:'test',rows:[{label:'x',text:'x'}]}),/explicit rules/);
});

test('concurrent notices keep winner and Bara dialogue visible with a separate rule card',()=>{
 const e=ep.events[15],page=systemRulesForEvent(e,{compact:true}).pages[0];
 const svg=renderWheelSVG(e.plan,{phase:'mechanism',themeId:e.theme,resultId:e.result.outcomeId,systemPage:page,reaction:e.reaction});
 assert.ok(svg.includes('data-bara-dialogue'));assert.ok(svg.includes('data-system-notice'));
 assert.ok(svg.includes(e.reaction));assert.ok(svg.includes(e.resultLabel));
 assert.ok(renderSystemNotice(page).includes('height="740"'));
 assert.ok(!svg.includes('EFEK HASIL'));
});
test('viewer cadence preserves every draw and full mechanics with longer spins and concise rules',()=>{
 const copy=structuredClone(ep),facts=JSON.stringify([copy.final,copy.events.map(e=>[e.result,e.rotation,e.reaction])]);
 for(const e of copy.events)e.systemExplanation=systemRulesForEvent(e,{compact:true,concise:true});
 const p=applyShortPacing(copy),frames=s=>Math.round(s*copy.videoFps);
 let total=Object.values(p.tail).reduce((n,s)=>n+frames(s),0);
 for(const e of copy.events){
  assert.ok(e.systemExplanation.fullRules.length);assert.equal(e.systemExplanation.pages.length,1);
  assert.ok(e.systemExplanation.pages[0].duration>=2.3);
  const t=e.presentationTiming;
  total+=e.kind==='notice'?frames(t.noticeHold):frames(t.lead)+frames(t.spin)+frames(t.resultHold)+frames(t.mechanismHold);
 }
 assert.equal(total,p.plannedFrames);assert.equal(p.plannedSeconds,total/copy.videoFps);
 assert.equal(p.timingMode,'natural-cadence');assert.equal(p.approximateSeconds,180);
 assert.notEqual(total,180*copy.videoFps);assert.ok(p.plannedSeconds>175&&p.plannedSeconds<195);
 for(const e of copy.events.filter(e=>e.kind!=='notice'))assert.equal(e.presentationTiming.spin,/^ARMOR [123]$/.test(e.step)?3.4:4.4);
 assert.equal(JSON.stringify([copy.final,copy.events.map(e=>[e.result,e.rotation,e.reaction])]),facts);
 const gate=copy.events.find(e=>e.step==='WEAPON MASTERY').systemExplanation.rows[0].text;
 assert.match(gate,/setelah bonus/);assert.match(gate,/≥ Master/);
});
const timedEpisode=()=>{
 const copy=structuredClone(ep);for(const e of copy.events)e.systemExplanation=systemRulesForEvent(e,{compact:true,concise:true});return copy;
};
test('approximate runtime is advisory: changing it cannot stretch or rush the same content',()=>{
 const a=timedEpisode(),b=timedEpisode();
 const pa=applyShortPacing(a,{approximateSeconds:90}),pb=applyShortPacing(b,{approximateSeconds:180});
 assert.equal(pa.plannedFrames,pb.plannedFrames);
 assert.deepEqual(a.events.map(e=>e.presentationTiming),b.events.map(e=>e.presentationTiming));
 assert.deepEqual(a.events.map(e=>e.systemExplanation.pages),b.events.map(e=>e.systemExplanation.pages));
 const once=JSON.stringify(a);applyShortPacing(a,{approximateSeconds:90});assert.equal(JSON.stringify(a),once);
});
test('longer rules and extra events add reading time while keeping other spins at the same pace',()=>{
 const base=timedEpisode(),long=timedEpisode();applyShortPacing(base);
 const e=long.events[15];e.systemExplanation.pages[0].rows[0].text+=' '+Array(45).fill('penjelasan').join(' ');
 e.systemExplanation.pages.push({...structuredClone(e.systemExplanation.pages[0]),index:1,duration:3.2});
 long.events.push({...structuredClone(long.events[9]),step:'ADDITIONAL SAVED SPIN'});
 const p=applyShortPacing(long);
 assert.ok(p.plannedSeconds>base.presentationProfile.plannedSeconds);
 assert.ok(long.events[15].presentationTiming.mechanismHold>base.events[15].presentationTiming.mechanismHold);
 assert.equal(long.events[15].presentationTiming.spin,base.events[15].presentationTiming.spin);
 for(const i of [0,3,9,23])assert.deepEqual(long.events[i].presentationTiming,base.events[i].presentationTiming);
 assert.equal(long.events[15].systemExplanation.pages.length,2);
});
test('cadence parameters can be adjusted without changing results or the reveal speed',()=>{
 const a=timedEpisode(),b=timedEpisode();applyShortPacing(a);
 const p=applyShortPacing(b,{spin:4.8,repeatSpin:3.8,readingWordsPerSecond:4});
 assert.ok(p.plannedSeconds>a.presentationProfile.plannedSeconds);
 assert.equal(b.events[0].presentationTiming.spin,4.8);assert.equal(b.events[3].presentationTiming.spin,3.8);
 assert.deepEqual(a.final,b.final);assert.deepEqual(a.gachaReveal,b.gachaReveal);
 assert.deepEqual(a.events.map(e=>[e.result,e.rotation,e.reaction]),b.events.map(e=>[e.result,e.rotation,e.reaction]));
 assert.throws(()=>applyShortPacing(timedEpisode(),{readingWordsPerSecond:0}),/Invalid pacing/);
 assert.throws(()=>applyShortPacing(timedEpisode(),{targetSeconds:120}),/Unknown pacing/);
});
test('shorter pauses come from concise copy, not deleting mechanics or speeding up reading',()=>{
 const previous=structuredClone(ep),next=timedEpisode();
 for(const e of previous.events)e.systemExplanation=systemRulesForEvent(e,{compact:true});
 applyShortPacing(previous,{approximateSeconds:120,spin:1.5,repeatSpin:1.1,resultHold:.2,minimumReadingHold:3});
 applyShortPacing(next);
 const sum=e=>e.events.reduce((n,x)=>n+x.systemExplanation.pages.reduce((m,p)=>m+p.duration,0),0);
 assert.ok(sum(next)<sum(previous));
 for(const [i,e]of next.events.entries()){
  assert.deepEqual(e.systemExplanation.fullRules,previous.events[i].systemExplanation.fullRules);
  assert.ok(e.systemExplanation.pages[0].duration>=.25+(e.systemExplanation.pages[0].rows[0].text.split(/\s+/).length+e.reaction.split(/\s+/).length)/5-1e-8);
 }
 assert.equal(next.presentationProfile.policy.readingWordsPerSecond,5);
 assert.equal(next.presentationProfile.spinMotion.version,'momentum/1');
});
