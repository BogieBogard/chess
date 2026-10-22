import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from '../vendor/three.module.min.js';
import { SectionedVictim } from '../staged-damage.js';
import { warrior, disposeWarrior } from '../pieces.js';
import { Battlefield } from '../battlefield.js';
import { loadPreferences, animationOptions } from '../animation-options.js';

function volume(geometry){const geo=geometry.index?geometry.toNonIndexed():geometry,p=geo.attributes.position;let total=0;for(let i=0;i<p.count;i+=3){const a=new T.Vector3().fromBufferAttribute(p,i),b=new T.Vector3().fromBufferAttribute(p,i+1),c=new T.Vector3().fromBufferAttribute(p,i+2);total+=a.dot(b.cross(c))/6;}if(geo!==geometry)geo.dispose();return Math.abs(total);}
test('regional cuts preserve solid volume; losing the head leaves a standing body',()=>{
 const scene=new T.Scene(),material=new T.MeshStandardMaterial(),geo=new T.BoxGeometry(.6,1.6,.6),victim=new T.Group(),mesh=new T.Mesh(geo,material);mesh.position.y=.9;victim.add(mesh);victim.rotation.y=.7;victim.position.set(2,0,-1);scene.add(victim);
 const damage=new SectionedVictim(scene,victim);assert.ok(damage.geometries.length>=4);assert.ok(Math.abs(damage.geometries.reduce((sum,g)=>sum+volume(g),0)-.576)<1e-5);
 assert.equal(victim.visible,true);assert.equal(damage.root.visible,false);damage.show();const bodyCenter=damage.center('body');damage.detach('head',new T.Vector3(1,0,0));damage.update(.2);
 assert.ok(damage.center('body').distanceTo(bodyCenter)<1e-8);assert.ok(damage.loose[0].pivot.position.x>2);assert.equal(damage.sections.body.visible,true);
 const originalCount=geo.attributes.position.count;damage.dispose();damage.dispose();assert.equal(damage.root.parent,null);assert.equal(damage.loose[0].pivot.parent,null);assert.equal(geo.attributes.position.count,originalCount);geo.dispose();material.dispose();
});
test('new stories preserve saved keeps/discards and the selected legacy style',()=>{
 const saved={selected:'duel-combo',ratings:{'crown-breaker':'discard',duel:'keep'}};const storage={getItem:()=>JSON.stringify(saved)};
 assert.equal(loadPreferences(storage).selected,'duel-combo');assert.equal(loadPreferences(storage).ratings['crown-breaker'],'discard');assert.equal(loadPreferences(storage).ratings.duel,'keep');
 assert.equal(loadPreferences({getItem:()=>null}).selected,'duel');assert.ok(animationOptions.some(o=>o.id==='rift-unweave'));
});
test('independent stories complete all attacker/defender combinations with real region contacts and clean up',async()=>{
 globalThis.matchMedia=()=>({matches:false});
 try{
 for(const style of ['crown-breaker','sweep-finish','rift-unweave'])for(const attackerType of 'pnrbqk')for(const defenderType of 'pnrbqk'){
  const b=Object.create(Battlefield.prototype),scene=new T.Scene(),attacker=warrior('w'+attackerType),victim=warrior('b'+defenderType),camera=new T.PerspectiveCamera();camera.position.set(3,8,12);const originalCamera=camera.position.clone();attacker.position.set(.5,0,.5);victim.position.set(1.5,0,-.5);scene.add(attacker,victim);
  Object.assign(b,{scene,camera,units:new Map([[36,attacker],[29,victim]]),effects:[],count:0});const events=[];
  b.tween=async(ms,fn)=>{for(const t of [0,.25,.5,.75,1]){fn(t);for(const effect of [...b.effects])if(!effect.update(.05)){effect.dispose();b.effects.splice(b.effects.indexOf(effect),1)}}};
  await b.animate({turn:'w'},{f:36,t:29},'full',(label,impact)=>events.push({label,impact}),style);
  assert.deepEqual(camera.position,originalCamera);assert.equal(b.units.size,0);assert.equal(b.effects.length,0);assert.equal(scene.children.length,0,`${style} leaked objects`);
  assert.equal(events.filter(e=>e.impact).length,style==='sweep-finish'?2:3);
  if(style!=='rift-unweave')for(const contact of b.stagedContacts)assert.ok(contact.error<.045,`${style} ${attackerType} vs ${defenderType} ${contact.region}: ${contact.error}`);
  else assert.equal(b.stagedContacts,undefined);
 }
 }finally{delete globalThis.matchMedia}
});
test('staged options preserve en passant and castling cleanup; reduced motion bypasses them',async()=>{
 globalThis.matchMedia=()=>({matches:false});
 try{for(const style of ['crown-breaker','sweep-finish','rift-unweave']){
  for(const move of [{f:28,t:21,ep:true},{f:60,t:62,castle:true}]){const b=Object.create(Battlefield.prototype),scene=new T.Scene(),attacker=warrior(move.castle?'wk':'wp'),other=warrior(move.castle?'wr':'bp'),otherSquare=move.castle?63:29;attacker.position.set(move.f%8-3.5,0,(move.f>>3)-3.5);other.position.set(otherSquare%8-3.5,0,(otherSquare>>3)-3.5);scene.add(attacker,other);Object.assign(b,{scene,units:new Map([[move.f,attacker],[otherSquare,other]]),effects:[],count:0});b.tween=async(ms,fn)=>{for(const t of [0,.5,1]){fn(t);for(const effect of [...b.effects])if(!effect.update(.1)){effect.dispose();b.effects.splice(b.effects.indexOf(effect),1)}}};await b.animate({turn:'w'},move,'fast',()=>{},style);assert.equal(b.units.size,0);assert.equal(b.effects.length,0);assert.equal(scene.children.length,0);}
 }
 globalThis.matchMedia=()=>({matches:true});const b=Object.create(Battlefield.prototype);await b.animate({turn:'w'},{f:36,t:29},'full',()=>{throw Error('must not animate')},'crown-breaker');
 }finally{delete globalThis.matchMedia}
});
