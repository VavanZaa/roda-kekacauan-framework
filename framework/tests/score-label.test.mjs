import test from 'node:test';
import assert from 'node:assert/strict';
import scales from '../../content/stat-scales-design.json' with {type:'json'};
import {formatFinalScoreLabel} from '../score-label.mjs';
import {projectFinalScore} from '../stat-odds.mjs';
import spec from '../spec.json' with {type:'json'};
const scale=target=>scales.scales.find(s=>s.stage===target);

test('signed final labels use the scale endpoint and only its excess or deficit',()=>{
 assert.equal(formatFinalScoreLabel(12,scale('power-mastery')),'Omnipotent+3');
 assert.equal(formatFinalScoreLabel(10,scale('power-mastery')),'Omnipotent+1');
 assert.equal(formatFinalScoreLabel(9,scale('power-mastery')),'Omnipotent');
 assert.equal(formatFinalScoreLabel(-2,scale('power-mastery')),'Noob-2');
 assert.equal(formatFinalScoreLabel(-1,scale('strength')),'Noob-1');
 assert.equal(formatFinalScoreLabel(0,scale('strength')),'Noob');
 assert.equal(formatFinalScoreLabel(12,scale('strength')),'Boundless+3');
 assert.equal(formatFinalScoreLabel(12,scale('weapon-mastery')),'Transcendent+3');
});
test('all configured raw labels remain unchanged and unsorted rows cannot change formatting',()=>{
 for(const s of scales.scales){
  const shuffled={...s,outcomes:[...s.outcomes].reverse()},before=structuredClone(shuffled);
  for(const row of s.outcomes.filter(o=>o.label))assert.equal(formatFinalScoreLabel(row.value,shuffled),row.label);
  if(s.outcomes.find(o=>o.value===9).label)assert.equal(formatFinalScoreLabel(12,shuffled),s.outcomes.find(o=>o.value===9).label+'+3');
  assert.equal(formatFinalScoreLabel(-2,shuffled),'Noob-2');assert.deepEqual(shuffled,before);
 }
});
test('formatting does not clamp numbers or change mastery gate eligibility',()=>{
 const base={status:'resolved',target:'weapon-mastery',baseValue:9,retainedRawValue:9};
 const bonus=[{sourceKey:'bonus:one',amount:3}],a=projectFinalScore(base,bonus),before=structuredClone([base,bonus,a]);
 assert.equal(a.finalValue,12);assert.equal(a.weaponEnchantThresholdMet,true);
 assert.equal(formatFinalScoreLabel(a.finalValue,scale('weapon-mastery')),'Transcendent+3');
 const b=projectFinalScore(base,[{sourceKey:'debuff:one',amount:-11}]);
 assert.equal(b.finalValue,-2);assert.equal(b.weaponEnchantThresholdMet,false);
 assert.equal(formatFinalScoreLabel(b.finalValue,scale('weapon-mastery')),'Noob-2');
 assert.deepEqual([base,bonus,a],before);
});
test('missing labels need explicit configuration and invalid numbers are rejected',()=>{
 assert.throws(()=>formatFinalScoreLabel(12,scale('intelligence')),/Configure/);
 assert.equal(formatFinalScoreLabel(12,scale('intelligence'),{labels:{9:'Omniscient'}}),'Omniscient+3');
 for(const value of [NaN,Infinity,-Infinity,1.5,'12',Number.MAX_SAFE_INTEGER+1])assert.throws(()=>formatFinalScoreLabel(value,scale('power-mastery')),RangeError);
 assert.equal(formatFinalScoreLabel(Number.MAX_SAFE_INTEGER,scale('power-mastery')),'Omnipotent+'+(Number.MAX_SAFE_INTEGER-9));
 assert.equal(formatFinalScoreLabel(Number.MIN_SAFE_INTEGER,scale('power-mastery')),'Noob'+Number.MIN_SAFE_INTEGER);
});
test('canonical and framework display contracts agree on the approved signed label policy',()=>{
 assert.deepEqual(spec.finalScoreContract.displayPolicy,scales.finalValuePolicy.displayPolicy);
 assert.equal(spec.finalScoreContract.display,scales.finalValuePolicy.display);
 assert.equal(scales.finalValuePolicy.minimum,null);assert.equal(scales.finalValuePolicy.maximum,null);
 assert.equal(scales.finalValuePolicy.displayPolicy.numericScoreUnchanged,true);
});
