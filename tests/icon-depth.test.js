import test from 'node:test';
import assert from 'node:assert/strict';
import {iconDepth,coveredFraction} from '../icon-depth.js';
const point=(depth,x=0,y=0,hidden=false)=>({depth,x,y,size:30,hidden});
test('overlapping icons stack front to back and stop at three rear layers',()=>{
 const points=[point(.6),point(.2),point(.5),point(.3),point(.4)];
 const result=iconDepth(points);assert.deepEqual(result.map(p=>p.layer),[0,1,2,3,3]);assert.deepEqual(result.map(p=>p.order),[5,4,3,2,1]);assert.equal(points[0].layer,undefined);
});
test('unrelated rows and invisible pieces do not darken unobscured icons',()=>{
 const result=iconDepth([point(.1,0,0,true),point(.2),point(.3,100),point(.4,100,100)]);assert.deepEqual(result.map(p=>p.layer),[0,0,0]);
});
test('only mostly covered icons form depth layers as the view changes',()=>{
 const a=point(.3),b=point(.2,5);assert.equal(iconDepth([a,b])[1].layer,1);
 a.depth=.1;assert.equal(iconDepth([a,b])[0].x,0);assert.equal(iconDepth([a,b])[1].x,5);
});

test('small edge overlaps stay crisp, even on the far side of the board',()=>{
 const front=point(.1),rear=point(.2,20);assert.ok(coveredFraction(rear,front)<.3);assert.deepEqual(iconDepth([front,rear]).map(p=>p.layer),[0,0]);
 assert.equal(coveredFraction(point(.2),front),1);assert.equal(coveredFraction(point(.2,100),front),0);
});

test('computer opponent icons stay crisp even when densely overlapping',()=>{
 const rear={...point(.3),shadeEligible:false};assert.equal(iconDepth([point(.1),rear])[1].layer,0);
 const player={...point(.3),shadeEligible:true};assert.equal(iconDepth([point(.1),player])[1].layer,1);
});
