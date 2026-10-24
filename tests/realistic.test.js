import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as T from '../vendor/three.module.min.js';
import {decodeRealisticPieces} from '../realistic-pieces.js';
import {Battlefield} from '../battlefield.js';
const meta=JSON.parse(fs.readFileSync(new URL('../assets/realistic/pieces.json',import.meta.url))),bytes=fs.readFileSync(new URL('../assets/realistic/pieces.bin',import.meta.url)),set=decodeRealisticPieces(meta,bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength));
test('imported pieces retain attribution, fit squares, share resources and stay under the download budget',()=>{
 assert.equal(meta.source.license.split(' ')[0],'CC-BY-4.0');assert.ok(bytes.length<2_000_000);
 for(const side of['w','b'])for(const type of'pnbrqk'){
  const piece=set.piece(side+type),box=new T.Box3().setFromObject(piece),size=box.getSize(new T.Vector3());
  assert.ok(size.x<.8&&size.z<.8&&size.y<1.8);assert.ok(Math.abs(box.min.y-.075)<1e-5);assert.ok(piece.children[0].geometry.boundingSphere.radius>0);
  assert.strictEqual(piece.children[0].geometry,set.piece(side+type).children[0].geometry);
 }
});
test('realistic pieces use simple captures even when combat is selected, including castling and en passant',async()=>{
 globalThis.matchMedia=()=>({matches:false});
 for(const style of['duel','crown-breaker','sweep-finish','rift-unweave','crossfade'])for(const move of[{f:36,t:29},{f:28,t:21,ep:true},{f:60,t:62,castle:true}]){
  const b=Object.create(Battlefield.prototype),scene=new T.Scene(),camera=new T.PerspectiveCamera(),attacker=set.piece(move.castle?'wk':'wp'),victim=set.piece(move.castle?'wr':'bp'),vi=move.castle?63:move.ep?29:move.t;
  const geometry=attacker.children[0].geometry;let disposed=false;geometry.addEventListener('dispose',()=>disposed=true);
  camera.position.set(2,10,14);const before=camera.position.clone();attacker.position.set(move.f%8-3.5,0,(move.f>>3)-3.5);victim.position.set(vi%8-3.5,0,(vi>>3)-3.5);scene.add(attacker,victim);
  Object.assign(b,{scene,camera,units:new Map([[move.f,attacker],[vi,victim]]),effects:[],count:0});b.tween=async(ms,fn)=>{for(const t of[0,.5,1])fn(t)};
  await b.animate({turn:'w'},move,'full',()=>{},style);assert.equal(b.units.size,0);assert.equal(b.effects.length,0);assert.deepEqual(camera.position,before);assert.equal(disposed,false);
  assert.ok(attacker.position.distanceTo(new T.Vector3(move.t%8-3.5,0,(move.t>>3)-3.5))<1e-8);
 }
 delete globalThis.matchMedia;
});
test('changing model factories clears old render units without changing the camera',()=>{
 const b=Object.create(Battlefield.prototype),scene=new T.Scene(),unit=set.piece('wp');scene.add(unit);Object.assign(b,{scene,units:new Map([[48,unit]]),renderer:{shadowMap:{}},camera:new T.PerspectiveCamera()});const camera=b.camera.position.clone();b.setPieceSet('realistic',set.piece);assert.equal(b.units.size,0);assert.equal(scene.children.length,0);assert.strictEqual(b.pieceFactory,set.piece);assert.deepEqual(b.camera.position,camera);
});
