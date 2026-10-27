import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as T from '../vendor/three.module.min.js';
import {decodePlatedPawns} from '../plated-pawns.js';
import {Battlefield} from '../battlefield.js';
const meta=JSON.parse(fs.readFileSync(new URL('../assets/plated/pawn.json',import.meta.url))),bytes=fs.readFileSync(new URL('../assets/plated/pawn.bin',import.meta.url)),set=decodePlatedPawns(meta,bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength));
test('Plated pawn trial fits the board, shares resources and retains attribution',()=>{
 assert.equal(meta.source.license.split(' ')[0],'CC-BY-4.0');const total=fs.readdirSync(new URL('../assets/plated',import.meta.url)).reduce((sum,name)=>sum+fs.statSync(new URL('../assets/plated/'+name,import.meta.url)).size,0);assert.ok(total<3_500_000);assert.ok(bytes.length<2_000_000);
 for(const side of['w','b'])for(const type of'p'){
  const piece=set.piece(side+type),box=new T.Box3().setFromObject(piece),size=box.getSize(new T.Vector3());
  assert.ok(size.x<.8&&size.z<.9&&size.y<1.8);assert.ok(Math.abs(box.min.y)<1e-5);assert.ok(piece.children[0].geometry.boundingSphere.radius>0);
  assert.strictEqual(piece.children[0].geometry,set.piece(side+type).children[0].geometry);
 }
});
test('Plated pawns and original figurine attackers safely handle imported targets and en passant',async()=>{
 globalThis.matchMedia=()=>({matches:false});
 for(const style of['duel','crown-breaker','sweep-finish','rift-unweave','crossfade'])for(const move of[{f:36,t:29},{f:28,t:21,ep:true},{f:36,t:29,original:true}]){
  const b=Object.create(Battlefield.prototype),scene=new T.Scene(),camera=new T.PerspectiveCamera(),attacker=set.piece(move.original?'wn':'wp'),victim=set.piece('bp'),vi=move.ep?29:move.t;
  const geometry=victim.children[0].geometry;let disposed=false;geometry.addEventListener('dispose',()=>disposed=true);
  camera.position.set(2,10,14);const before=camera.position.clone();attacker.position.set(move.f%8-3.5,0,(move.f>>3)-3.5);victim.position.set(vi%8-3.5,0,(vi>>3)-3.5);scene.add(attacker,victim);
  Object.assign(b,{scene,camera,units:new Map([[move.f,attacker],[vi,victim]]),effects:[],count:0});b.tween=async(ms,fn)=>{for(const t of[0,.5,1])fn(t)};
  await b.animate({turn:'w'},move,'full',()=>{},style);assert.equal(b.units.size,0);assert.equal(b.effects.length,0);assert.deepEqual(camera.position,before);assert.equal(disposed,false);
  assert.ok(attacker.position.distanceTo(new T.Vector3(move.t%8-3.5,0,(move.t>>3)-3.5))<1e-8);
 }
 delete globalThis.matchMedia;
});
test('hybrid set keeps other types as articulated figurines',()=>{for(const type of'nbrqk')assert.ok(set.piece('w'+type).userData.body);assert.equal(set.piece('wp').userData.modelSet,'plated')});

test('Plated king trial replaces only kings, fits its square and reuses the pawn resources',()=>{
 for(const side of ['w','b']){
  const king=set.kingPiece(side+'k'),pawn=set.piece(side+'p'),box=new T.Box3().setFromObject(king),size=box.getSize(new T.Vector3());
  assert.equal(king.userData.code,side+'k');assert.equal(king.userData.modelSet,'plated');
  assert.ok(size.x<.9&&size.z<.95&&size.y>1.7&&size.y<1.8);assert.ok(Math.abs(box.min.y)<1e-5);
  assert.strictEqual(king.children[0].geometry,pawn.children[0].geometry);
  assert.strictEqual(king.children[0].material,pawn.children[0].material);
  for(const type of 'pnbrq')assert.ok(set.kingPiece(side+type).userData.body);
 }
 assert.equal(meta.meshes.reduce((n,m)=>n+m.indexCount/3,0)*2,145122);
});
test('Plated kings move, capture and castle with the original rooks without combat rig assumptions',async()=>{
 globalThis.matchMedia=()=>({matches:false});
 for(const side of ['w','b'])for(const style of ['duel','crown-breaker','sweep-finish','rift-unweave','crossfade'])for(const castle of [false,'king','queen']){
  const home=side==='w'?60:4,move={f:home,t:castle===false?home-8:home+(castle==='king'?2:-2),...(castle?{castle:true}:{})};
  const b=Object.create(Battlefield.prototype),scene=new T.Scene(),camera=new T.PerspectiveCamera(),king=set.kingPiece(side+'k');
  king.position.set(home%8-3.5,0,(home>>3)-3.5);scene.add(king);
  const otherIndex=castle?home+(castle==='king'?3:-4):move.t,other=set.kingPiece((castle?side:side==='w'?'b':'w')+(castle?'r':'p'));
  other.position.set(otherIndex%8-3.5,0,(otherIndex>>3)-3.5);scene.add(other);
  Object.assign(b,{scene,camera,units:new Map([[home,king],[otherIndex,other]]),effects:[],count:0});b.tween=async(ms,fn)=>{for(const t of [0,.25,.5,.75,1])fn(t)};
  const scale=king.scale.clone(),before=camera.position.clone();let disposed=false;king.children[0].geometry.addEventListener('dispose',()=>disposed=true);
  await b.animate({turn:side},move,'full',()=>{},style);
  assert.ok(king.position.distanceTo(new T.Vector3(move.t%8-3.5,0,(move.t>>3)-3.5))<1e-8);
  if(castle)assert.ok(other.position.distanceTo(new T.Vector3((home+move.t)/2%8-3.5,0,(home>>3)-3.5))<1e-8);
  assert.deepEqual(king.scale,scale);assert.deepEqual(camera.position,before);assert.equal(b.units.size,0);assert.equal(b.effects.length,0);assert.equal(disposed,false);
 }
 delete globalThis.matchMedia;
});
