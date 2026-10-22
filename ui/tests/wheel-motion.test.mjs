import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {motionProgress,WHEEL_SPIN_MOTION} from '../wheel-geometry.mjs';

test('momentum spin accelerates, carries speed, and smoothly decelerates to rest',()=>{
 const p=WHEEL_SPIN_MOTION,h=1e-5;
 const velocity=t=>(motionProgress(t+h)-motionProgress(t-h))/(2*h);
 assert.ok(velocity(.10)>velocity(.02)*5);
 assert.ok(Math.abs(velocity(.20)-velocity(.30))<1e-8);
 assert.ok(velocity(.45)>velocity(.65)&&velocity(.65)>velocity(.85));
 assert.ok(velocity(.99)<velocity(.65)/500);
 for(const join of [p.accelerationFraction,p.cruiseUntilFraction])assert.ok(Math.abs(velocity(join-h)-velocity(join+h))<1e-6);
 assert.equal(motionProgress(-1),0);assert.equal(motionProgress(2),1);
 let prior=0;for(let i=0;i<=1000;i++){const value=motionProgress(i/1000);assert.ok(value>=prior&&value<=1);prior=value;}
 assert.throws(()=>motionProgress(.5,{version:'unknown'}),/Unknown/);
 assert.throws(()=>motionProgress(.5,{...p,cruiseUntilFraction:.1}),/Invalid/);
});
test('studio and video renderer use the same motion parameters and progress',()=>{
 const times=[-.1,0,...Array.from({length:101},(_,i)=>i/100),.12,.38,1.1];
 const profiles=[WHEEL_SPIN_MOTION,{version:'legacy-cubic/1'}];
 const code='import json,sys\nfrom wheel_motion import motion_progress\ndata=json.loads(sys.argv[1])\nprint(json.dumps([[motion_progress(t,p) for t in data["times"]] for p in data["profiles"]]))';
 const run=spawnSync('python',['-X','utf8','-c',code,JSON.stringify({times,profiles})],{cwd:fileURLToPath(new URL('../../video/scripts/',import.meta.url)),encoding:'utf8',env:{...process.env,PYTHONDONTWRITEBYTECODE:'1'}});
 assert.equal(run.status,0,run.stderr);
 const values=JSON.parse(run.stdout);
 for(const [i,p]of profiles.entries())for(const [j,t]of times.entries())assert.ok(Math.abs(values[i][j]-motionProgress(t,p))<1e-12);
});
test('new motion delays the last turn instead of spending most of the spin creeping',()=>{
 const old={version:'legacy-cubic/1'};
 assert.ok(motionProgress(.5)<motionProgress(.5,old)-.15);
 assert.ok(motionProgress(.75)-motionProgress(.5)>.25);
 assert.equal(motionProgress(1,old),motionProgress(1));
});
