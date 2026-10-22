import test from 'node:test';
import assert from 'node:assert/strict';
import element from '../../content/universal-element-wheel-design.json' with {type:'json'};
import {collectElementContextTags} from '../element-context.mjs';
test('Every Element feeds Title context through its selected body or exact owned power, without importing its source race',()=>{
 for(const o of element.wheels[0].outcomes){const body=collectElementContextTags([{results:[{wheelId:'element-universal',outcomeId:o.id}]}],[]),power=collectElementContextTags([],[{...o.powerDefinitionRef,active:true}]);assert.deepEqual(power,body);assert.ok(power.length);assert.ok(!power.some(t=>t.startsWith('race:')));}
});
test('Darkness, Shadow and Void remain distinct; authority, inactive and same-named foreign definitions do not impersonate Element grants',()=>{
 const ref=id=>element.wheels[0].outcomes.find(o=>o.id===id).powerDefinitionRef;
 assert.deepEqual(collectElementContextTags([],[ref('darkness')]),['darkness','night']);assert.deepEqual(collectElementContextTags([],[ref('shadow')]),['shadow']);assert.deepEqual(collectElementContextTags([],[ref('void')]),['space','void']);
 assert.deepEqual(collectElementContextTags([],[{...ref('light'),grantMode:'authority'}]),[]);
 assert.deepEqual(collectElementContextTags([],[{...ref('void'),active:false}]),[]);
 assert.deepEqual(collectElementContextTags([],[{...ref('void'),definitionFile:'content/other.json'}]),[]);
});
