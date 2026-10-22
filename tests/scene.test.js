import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from '../vendor/three.module.min.js';
import { CameraGestures } from '../camera-controls.js';
import { splitSolid, fractureGeometry, Destruction } from '../destruction.js';
import { warrior } from '../pieces.js';
const event=(id,x,y,button=0)=>({pointerId:id,clientX:x,clientY:y,button});
function gestures(){const calls={tap:0,orbit:[],zoom:[],pan:[]},element={style:{},addEventListener(){},setPointerCapture(){}};let c=new CameraGestures(element,{tap:()=>calls.tap++,orbit:(...x)=>calls.orbit.push(x),zoom:x=>calls.zoom.push(x),pan:(...x)=>calls.pan.push(x)});return {c,calls}}
test('tap selects; dragging a piece or empty space only orbits',()=>{let {c,calls}=gestures();c.handle('pointerdown',event(1,0,0));c.handle('pointerup',event(1,0,0));assert.equal(calls.tap,1);c.handle('pointerdown',event(1,0,0));c.handle('pointermove',event(1,30,10));c.handle('pointerup',event(1,30,10));assert.equal(calls.tap,1);assert.equal(calls.orbit.length,1)});
test('pinch, two-finger pan, and twist never become a chess tap',()=>{let {c,calls}=gestures();c.handle('pointerdown',event(1,0,0));c.handle('pointerdown',event(2,100,0));c.handle('pointermove',event(2,150,30));assert.ok(calls.zoom[0]<1);assert.ok(calls.pan.length);assert.ok(calls.orbit.length);c.handle('pointerup',event(2,150,30));c.handle('pointerup',event(1,0,0));assert.equal(calls.tap,0)});
test('cancelled touch cannot place a piece',()=>{let {c,calls}=gestures();c.handle('pointerdown',event(1,10,10));c.handle('pointercancel',event(1,10,10));c.handle('pointerup',event(1,10,10));assert.equal(calls.tap,0)});
function volume(g){const geo=g.index?g.toNonIndexed():g,p=geo.attributes.position;let v=0;for(let i=0;i<p.count;i+=3){let a=new T.Vector3().fromBufferAttribute(p,i),b=new T.Vector3().fromBufferAttribute(p,i+1),c=new T.Vector3().fromBufferAttribute(p,i+2);v+=a.dot(b.cross(c))/6}return Math.abs(v)}
test('fractures are closed solids that conserve the original volume',()=>{const box=new T.BoxGeometry(1,1,1),pieces=splitSolid(box,new T.Vector3(1,.2,.1).normalize(),new T.Vector3());assert.equal(pieces.length,2);assert.ok(Math.abs(pieces.reduce((n,g)=>n+volume(g),0)-1)<1e-5);for(let g of pieces)assert.ok(volume(g)>.1);const shards=fractureGeometry(box,2);assert.equal(shards.length,4);assert.ok(Math.abs(shards.reduce((n,g)=>n+volume(g),0)-1)<1e-5)});
test('destruction replaces actual model parts, falls, fades, and cleans up',()=>{let scene=new T.Scene(),target=warrior('bp');scene.add(target);let originalGeometry;target.traverse(o=>{if(o.isMesh)originalGeometry??=o.geometry});const d=new Destruction(scene,target,new T.Vector3(0,0,1));assert.equal(target.visible,false);assert.ok(d.fragments.length>40);const top=d.fragments.find(f=>f.mesh.position.y>1);let start=top.mesh.position.clone();for(let i=0;i<50;i++)d.update(1/60);assert.ok(top.mesh.position.distanceTo(start)>.1);for(let i=0;i<55;i++)d.update(1/60);assert.ok([...d.materials.values()].every(m=>m.opacity===0));d.dispose();assert.ok(!scene.children.includes(d.group));assert.ok(originalGeometry.attributes.position.count>0)});

test('Fit board keeps every corner and the tallest pieces visible on portrait and landscape screens',async()=>{
 const {Battlefield}=await import('../battlefield.js');
 for(let aspect of[390/844,844/390,1.6])for(let angle of[0,.3,Math.PI/4,Math.PI])for(let elevation of[.12,.83,1.49]){
  const b=Object.create(Battlefield.prototype);Object.assign(b,{camera:new T.PerspectiveCamera(39,aspect,.1,220),target:new T.Vector3(),scene:{fog:{}},angle,elevation,flip:false,gestures:{stop(){}}});b.fitBoard();b.camera.updateMatrixWorld();
  for(let x of[-4.55,4.55])for(let z of[-4.55,4.55])for(let y of[-.5,1.9]){const p=new T.Vector3(x,y,z).project(b.camera);assert.ok(Math.abs(p.x)<.89);assert.ok(Math.abs(p.y)<.77)}
 }
});
test('every combat variant makes weapon contact for all attacker and target types',async()=>{
 const {Battlefield}=await import('../battlefield.js');globalThis.matchMedia=()=>({matches:false});
 for(const animation of ['duel','duel-quickdraw','duel-heavy','duel-combo','duel-whirlwind'])for(let type of 'pnrbqk')for(let targetType of 'pnrbqk'){
  const b=Object.create(Battlefield.prototype),scene=new T.Scene(),attacker=warrior('w'+type),victim=warrior('b'+targetType);attacker.position.set(.5,0,.5);victim.position.set(1.5,0,-.5);scene.add(attacker,victim);Object.assign(b,{scene,units:new Map([[36,attacker],[29,victim]]),effects:[],count:0,paused:false});
  b.tween=async(ms,fn)=>{for(let t of[0,.25,.5,.75,1]){fn(t);for(let effect of [...b.effects])if(!effect.update(.05)){effect.dispose();b.effects.splice(b.effects.indexOf(effect),1)}}};
  await b.animate({turn:'w'},{f:36,t:29},'full',()=>{},animation);assert.ok(b.lastContactError<.04,`${animation}: ${type} vs ${targetType}: contact error ${b.lastContactError}`);assert.equal(b.effects.length,0);assert.equal(b.units.size,0);
 }
 delete globalThis.matchMedia;
});

test('quiet animation styles complete captures, en passant, and castling without moving the camera',async()=>{
 const {Battlefield}=await import('../battlefield.js');globalThis.matchMedia=()=>({matches:false});
 for(const style of ['glide','crossfade','shrink','sink','hop','arc'])for(const move of [{f:36,t:29},{f:28,t:21,ep:true},{f:60,t:62,castle:true}]){
  const b=Object.create(Battlefield.prototype),scene=new T.Scene(),camera=new T.PerspectiveCamera(),attacker=warrior(move.castle?'wk':'wp'),victim=warrior(move.castle?'wr':'bp'),vi=move.castle?63:move.ep?29:move.t;
  camera.position.set(2,10,14);const before=camera.position.clone();
  attacker.position.set(move.f%8-3.5,0,(move.f>>3)-3.5);victim.position.set(vi%8-3.5,0,(vi>>3)-3.5);scene.add(attacker,victim);
  Object.assign(b,{scene,camera,units:new Map([[move.f,attacker],[vi,victim]]),effects:[],count:0});
  b.tween=async(ms,fn)=>{for(const t of[0,.25,.5,.75,1])fn(t)};
  await b.animate({turn:'w'},move,'full',()=>{},style);
  assert.deepEqual(camera.position,before);assert.equal(b.units.size,0);assert.equal(b.effects.length,0);
  assert.ok(attacker.position.distanceTo(new T.Vector3(move.t%8-3.5,0,(move.t>>3)-3.5))<1e-8);
 }
 delete globalThis.matchMedia;
});

test('every starting pawn shows both one-square and two-square destinations for both sides',async()=>{
 const {Battlefield}=await import('../battlefield.js'),{default:Chess}=await import('../rules.js');
 for(const side of ['w','b']){
  const game=new Chess();game.turn=side;
  const b=Object.create(Battlefield.prototype);Object.assign(b,{scene:new T.Scene(),renderer:{shadowMap:{}},flip:false,units:new Map(),tiles:Array.from({length:64},()=>({material:new T.MeshStandardMaterial()}))});
  for(let file=0;file<8;file++){
   const selected=(side==='w'?48:8)+file,direction=side==='w'?-8:8;
   b.sync(game,selected,false,null);
   const markers=b.moveMarkers.children.filter(m=>m.userData.kind==='move').map(m=>m.userData.square).sort((a,b)=>a-b);
   assert.deepEqual(markers,[selected+direction,selected+direction*2].sort((a,b)=>a-b));
   assert.ok(b.moveMarkers.children.every(m=>m.position.y>.067&&m.material.isMeshBasicMaterial));
  }
  game.b[side==='w'?40:16]=side+'n';b.sync(game,side==='w'?48:8,false,null);
  assert.equal(b.moveMarkers.children.filter(m=>m.userData.kind==='move').length,0);
 }
});
