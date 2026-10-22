import * as T from './vendor/three.module.min.js';
import { warrior, pose, setPieceMaterials, disposeWarrior } from './pieces.js?v=20261021-park-1';
import { CameraGestures } from './camera-controls.js';
import { createMaterials } from './materials.js';
import { Destruction } from './destruction.js?v=20261021-park-1';
import { duelProfiles } from './duel-profiles.js?v=20261021-park-1';
import { createPark } from './park-environment.js?v=20261021-park-1';
export { warrior } from './pieces.js?v=20261021-park-1';
const smooth=t=>t*t*(3-2*t),pos=i=>new T.Vector3(i%8-3.5,0,(i>>3)-3.5);
export function captureStyle(code,victim,from,to,variant){const diagonal=from%8!==to%8&&(from>>3)!==(to>>3);if(code[1]==='n')return 'lance charge';if(code[1]==='r')return 'wall of force';if(code[1]==='b')return diagonal?'staff sweep':'staff thrust';if(code[1]==='q')return victim?.[1]==='r'?'royal shatter':'royal arc';if(code[1]==='k')return 'overhead cleave';return victim?.[1]==='n'?'low thrust':diagonal?(variant%2?'shield bash':'crosscut'):'forward thrust';}
function bevelBox(w,h,d,r=.035){const s=new T.Shape();s.moveTo(-w/2+r,-d/2);s.lineTo(w/2-r,-d/2);s.quadraticCurveTo(w/2,-d/2,w/2,-d/2+r);s.lineTo(w/2,d/2-r);s.quadraticCurveTo(w/2,d/2,w/2-r,d/2);s.lineTo(-w/2+r,d/2);s.quadraticCurveTo(-w/2,d/2,-w/2,d/2-r);s.lineTo(-w/2,-d/2+r);s.quadraticCurveTo(-w/2,-d/2,-w/2+r,-d/2);const g=new T.ExtrudeGeometry(s,{depth:h-r*2,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:r,bevelThickness:r,curveSegments:6});g.rotateX(-Math.PI/2);g.translate(0,-h/2+r,0);return g}
export class Battlefield {
 constructor(host,onSquare){
  this.host=host;this.units=new Map();this.tiles=[];this.effects=[];this.count=0;this.flip=false;this.paused=false;this.angle=.3;this.elevation=.83;this.distance=17;this.target=new T.Vector3(0,.35,0);
  this.scene=new T.Scene();this.scene.background=new T.Color('#121b22');this.scene.fog=new T.Fog('#121b22',65,140);this.camera=new T.PerspectiveCamera(39,1,.1,220);
  this.renderer=new T.WebGLRenderer({antialias:true});this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.8));this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=T.PCFSoftShadowMap;this.renderer.shadowMap.autoUpdate=false;this.renderer.shadowMap.needsUpdate=true;this.renderer.toneMapping=T.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.08;host.append(this.renderer.domElement);
  this.renderer.domElement.setAttribute('aria-label','3D chess. Tap to select and move. Drag to orbit. Pinch to zoom; two fingers to pan or twist.');
  this.materials=createMaterials(this.renderer,this.scene);setPieceMaterials(this.materials.palettes);
  this.ambient=new T.HemisphereLight('#b8d1df','#3c3022',1.2);this.scene.add(this.ambient);
  const key=this.sun=new T.DirectionalLight('#ffe1b2',3.4);key.position.set(-4,9,5);key.castShadow=true;key.shadow.mapSize.set(2048,2048);Object.assign(key.shadow.camera,{left:-6,right:6,top:6,bottom:-6,near:.5,far:30});key.shadow.bias=-.0005;key.shadow.normalBias=.018;key.shadow.radius=3;this.scene.add(key);
  const rim=this.rim=new T.DirectionalLight('#83b9e2',2.1);rim.position.set(4,5,-6);this.scene.add(rim);
  const add=(geometry,material,x,y,z)=>{let m=new T.Mesh(geometry,material);m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;this.scene.add(m);return m};
  add(bevelBox(8.95,.38,8.95,.08),this.materials.wood,0,-.26,0);add(bevelBox(8.8,.05,8.8,.018),this.materials.trim,0,-.075,0);add(bevelBox(8.70,.11,8.70,.025),this.materials.edge,0,-.015,0);
  const tileGeometry=bevelBox(.992,.09,.992,.009);
  for(let i=0;i<64;i++){const p=pos(i),material=(((i>>3)+i%8)%2?this.materials.darkTile:this.materials.lightTile).clone();let tile=add(tileGeometry,material,p.x,.022,p.z);tile.userData={square:i,base:material.color.clone()};this.tiles.push(tile)}
  for(let x of[-4.18,4.18])for(let z of[-4.18,4.18]){add(new T.CylinderGeometry(.065,.065,.018,24),this.materials.trim,x,.053,z);let ring=new T.Mesh(new T.TorusGeometry(.10,.008,6,32),this.materials.trim);ring.rotation.x=-Math.PI/2;ring.position.set(x,.05,z);this.scene.add(ring)}
  let floor=add(new T.PlaneGeometry(240,240),new T.MeshStandardMaterial({color:'#151e25',roughness:.76}),0,-.49,0);floor.rotation.x=-Math.PI/2;this.studioFloor=floor;this.environmentStyle='studio';
  for(let i=0;i<8;i++){this.label('abcdefgh'[i],i-3.5,4.20);this.label(String(8-i),-4.20,i-3.5);this.label('abcdefgh'[i],i-3.5,-4.20,Math.PI);this.label(String(8-i),4.20,i-3.5,Math.PI)}
  this.ray=new T.Raycaster();
  this.gestures=new CameraGestures(this.renderer.domElement,{
   tap:e=>{let i=this.hit(e);if(i!==null)onSquare(i)},
   orbit:(dx,dy)=>{this.angle-=dx*.006;this.elevation=T.MathUtils.clamp(this.elevation+dy*.006,.12,1.54);this.cameraUpdate()},
   zoom:ratio=>this.zoom(ratio),pan:(dx,dy)=>this.pan(dx,dy)
  });
  this.observer=new ResizeObserver(()=>this.resize());this.observer.observe(host);this.resize();let last=performance.now();
  this.renderer.setAnimationLoop(now=>{let dt=Math.min(.1,Math.max(0,(now-last)/1000));last=now;this.gestures.update(dt);if(!this.paused){if(this.effects.length)this.renderer.shadowMap.needsUpdate=true;for(let effect of [...this.effects])if(!effect.update(dt)){effect.dispose();this.effects.splice(this.effects.indexOf(effect),1)}}this.renderer.render(this.scene,this.camera)});
 }
 setEnvironment(style){
  if(!['studio','park','sunset'].includes(style))style='studio';
  const outdoor=style!=='studio',sunset=style==='sunset';
  if(outdoor&&!this.park){this.park=createPark();this.scene.add(this.park)}
  if(this.park)this.park.visible=outdoor;this.studioFloor.visible=!outdoor;this.environmentStyle=style;
  const background=outdoor?(sunset?'#c2a890':'#c3d0c9'):'#121b22';
  this.scene.background.set(background);this.scene.fog.color.set(background);
  this.ambient.color.set(outdoor?'#d5e3db':'#b8d1df');this.ambient.groundColor.set(outdoor?'#697452':'#3c3022');this.ambient.intensity=outdoor?1.8:1.2;
  this.sun.color.set(sunset?'#ffca88':outdoor?'#fff1cf':'#ffe1b2');this.sun.intensity=outdoor?2.7:3.4;
  this.sun.position.set(...(outdoor?[-25,sunset?16:38,18]:[-4,9,5]));
  this.rim.intensity=outdoor?.65:2.1;this.renderer.toneMappingExposure=outdoor?1:1.08;
  Object.assign(this.sun.shadow.camera,outdoor?{left:-38,right:38,top:38,bottom:-38,far:180}:{left:-6,right:6,top:6,bottom:-6,far:30});this.sun.shadow.camera.updateProjectionMatrix();this.cameraUpdate();
  this.renderer.shadowMap.needsUpdate=true;
 }
 parkView(){this.gestures.stop();this.angle=.25;this.elevation=.22;this.target.set(0,8,0);this.distance=70;this.cameraUpdate()}
 setGraphics(quality){this.renderer.shadowMap.enabled=quality!=='light';this.renderer.setPixelRatio(Math.min(devicePixelRatio,quality==='light'?1:1.8));this.renderer.shadowMap.needsUpdate=true;}
 hit(e){this.camera.updateMatrixWorld();this.scene.updateMatrixWorld();const r=this.renderer.domElement.getBoundingClientRect();this.ray.setFromCamera(new T.Vector2((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1),this.camera);let h=this.ray.intersectObjects([...this.units.values()].filter(o=>o.visible).concat(this.tiles),true)[0];if(!h)return null;let o=h.object;while(o&&o.userData.square===undefined)o=o.parent;return o?.userData.square??null}
 label(text,x,z,rotation=0){const c=document.createElement('canvas');c.width=c.height=96;const ctx=c.getContext('2d');ctx.fillStyle='#c6ad79';ctx.font='56px Georgia';ctx.textAlign='center';ctx.fillText(text,48,66);let texture=new T.CanvasTexture(c);texture.colorSpace=T.SRGBColorSpace;const mesh=new T.Mesh(new T.PlaneGeometry(.20,.20),new T.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false}));mesh.rotation.set(-Math.PI/2,0,rotation);mesh.position.set(x,.053,z);this.scene.add(mesh)}
 resize(){let w=Math.max(1,this.host.clientWidth),h=Math.max(1,this.host.clientHeight);this.renderer.setSize(w,h);this.camera.aspect=w/h;this.camera.updateProjectionMatrix();this.fitBoard()}
 fitBoard(){this.gestures?.stop();this.target.set(0,.35,0);const a=this.angle+(this.flip?Math.PI:0),forward=new T.Vector3(Math.sin(a)*Math.cos(this.elevation),Math.sin(this.elevation),Math.cos(a)*Math.cos(this.elevation));const right=new T.Vector3().crossVectors(new T.Vector3(0,1,0),forward).normalize(),up=new T.Vector3().crossVectors(forward,right),tanY=Math.tan(T.MathUtils.degToRad(this.camera.fov/2)),tanX=tanY*this.camera.aspect;let distance=0;for(let x of[-4.55,4.55])for(let z of[-4.55,4.55])for(let y of[-.5,1.9]){let p=new T.Vector3(x,y,z).sub(this.target),depth=p.dot(forward);distance=Math.max(distance,depth+Math.abs(p.dot(right))/(tanX*.88),depth+Math.abs(p.dot(up))/(tanY*.76))}this.distance=distance;this.cameraUpdate()}
 setView(angle,elevation){this.angle=angle;this.elevation=elevation;this.fitBoard()}
 rotate(amount){this.gestures.stop();this.angle+=amount;this.cameraUpdate()}
 zoom(ratio){this.distance=T.MathUtils.clamp(this.distance*ratio,4.5,85);this.cameraUpdate()}
 pan(dx,dy){const scale=2*this.distance*Math.tan(T.MathUtils.degToRad(this.camera.fov/2))/this.host.clientHeight,a=this.angle+(this.flip?Math.PI:0);this.target.x+=(-Math.cos(a)*dx-Math.sin(a)*dy)*scale;this.target.z+=(Math.sin(a)*dx-Math.cos(a)*dy)*scale;this.target.x=T.MathUtils.clamp(this.target.x,-4,4);this.target.z=T.MathUtils.clamp(this.target.z,-4,4);this.cameraUpdate()}
 cameraUpdate(){const a=this.angle+(this.flip?Math.PI:0),d=Math.max(this.distance,.65/Math.sin(this.elevation));this.camera.position.set(this.target.x+Math.sin(a)*Math.cos(this.elevation)*d,this.target.y+Math.sin(this.elevation)*d,this.target.z+Math.cos(a)*Math.cos(this.elevation)*d);this.camera.lookAt(this.target);const outdoor=this.environmentStyle&&this.environmentStyle!=='studio';this.scene.fog.near=d+(outdoor?90:25);this.scene.fog.far=d+(outdoor?450:90);this.camera.far=d+(outdoor?650:150);this.camera.updateProjectionMatrix()}
 sync(game,selected,flipped,last){this.renderer.shadowMap.needsUpdate=true;if(this.flip!==flipped){this.flip=flipped;this.cameraUpdate()}for(let [i,g]of this.units)if(game.b[i]!==g.userData.code){this.scene.remove(g);disposeWarrior(g);this.units.delete(i)}for(let i=0;i<64;i++)if(game.b[i]&&!this.units.has(i)){const g=warrior(game.b[i]);g.position.copy(pos(i));g.userData.square=i;this.units.set(i,g);this.scene.add(g)}const moves=selected<0?[]:game.legal().filter(m=>m.f===selected),legal=[...new Set(moves.map(m=>m.t))];
 if(!this.moveMarkers){this.moveMarkers=new T.Group();this.scene.add(this.moveMarkers);this.moveMarkerGeometry={dot:new T.CircleGeometry(.17,24),ring:new T.RingGeometry(.37,.44,32),selected:new T.RingGeometry(.40,.44,32)};this.moveMarkerMaterial={move:new T.MeshBasicMaterial({color:'#8ef0c5',side:T.DoubleSide,depthWrite:false}),capture:new T.MeshBasicMaterial({color:'#ffca73',side:T.DoubleSide,depthWrite:false}),selected:new T.MeshBasicMaterial({color:'#ffe0a1',side:T.DoubleSide,depthWrite:false})};}
 this.moveMarkers.clear();
 const marker=(square,kind)=>{const mesh=new T.Mesh(this.moveMarkerGeometry[kind==='move'?'dot':kind==='capture'?'ring':'selected'],this.moveMarkerMaterial[kind]);mesh.rotation.x=-Math.PI/2;mesh.position.copy(pos(square)).setY(.085);mesh.userData={square,kind};mesh.renderOrder=2;this.moveMarkers.add(mesh)};
 if(selected>=0)marker(selected,'selected');
 for(const square of legal)marker(square,game.b[square]||moves.some(m=>m.t===square&&m.ep)?'capture':'move');
for(let i=0;i<64;i++){this.tiles[i].material.emissive.set(i===selected?'#926a23':legal.includes(i)?'#246148':last&&(last.f===i||last.t===i)?'#3c321a':'#000000');if(game.b[i]===game.turn+'k'&&game.check())this.tiles[i].material.emissive.set('#9b2723')}}
 tween(ms,fn){return new Promise(resolve=>{let elapsed=0,last=performance.now();const tick=now=>{if(!this.paused){elapsed+=now-last;this.renderer.shadowMap.needsUpdate=true;}last=now;let t=Math.min(1,elapsed/ms);fn(t);if(t<1)requestAnimationFrame(tick);else resolve()};requestAnimationFrame(tick)})}
 async animateSimple(game,m,speed,onEvent,style){
  const g=this.units.get(m.f),from=pos(m.f),to=pos(m.t),vi=m.ep?m.t+(game.turn==='w'?8:-8):m.t,victim=this.units.get(vi),k=speed==='fast'?.48:1;
  const owned=[];
  const fade=(unit,opacity)=>{if(!unit)return;if(!unit.userData.previewMaterials){unit.userData.previewMaterials=[];unit.traverse(o=>{if(!o.isMesh)return;const clone=material=>{const copy=material.clone();copy.transparent=true;owned.push(copy);unit.userData.previewMaterials.push(copy);return copy};o.material=Array.isArray(o.material)?o.material.map(clone):clone(o.material)})}for(const material of unit.userData.previewMaterials){material.opacity=opacity;material.depthWrite=opacity>.5}};
  try{
   onEvent(victim?'Capture · '+style:'Move · '+style);
   if(victim)await this.tween(300*k,t=>{const u=smooth(t);if(style==='shrink')victim.scale.setScalar(1-u*.98);else if(style==='sink')victim.position.y=-1.8*u;else fade(victim,1-u)});
   if(victim)victim.visible=false;
   if(style==='crossfade'){
    await this.tween(220*k,t=>fade(g,1-smooth(t)));g.position.copy(to);
    await this.tween(220*k,t=>fade(g,smooth(t)));
   }else await this.tween(600*k,t=>{const u=smooth(t);g.position.lerpVectors(from,to,u);if(style==='hop')g.position.y=.28*Math.sin(Math.PI*u);if(style==='arc'){const dx=to.x-from.x,dz=to.z-from.z,length=Math.hypot(dx,dz)||1;g.position.x+=-dz/length*.3*Math.sin(Math.PI*u);g.position.z+=dx/length*.3*Math.sin(Math.PI*u)}});
   g.position.copy(to);
   if(m.castle){const rf=m.t>m.f?m.f+3:m.f-4,rook=this.units.get(rf);if(rook)await this.tween(450*k,t=>rook.position.lerpVectors(pos(rf),pos((m.f+m.t)/2),smooth(t)))}
  }finally{
   for(const i of new Set([m.f,...(victim?[vi]:[]),...(m.castle?[m.t>m.f?m.f+3:m.f-4]:[])])){const unit=this.units.get(i);if(unit){this.scene.remove(unit);disposeWarrior(unit);this.units.delete(i)}}
   for(const material of owned)material.dispose();
  }
 }
 async animateRook(game,m,speed,onEvent,profile){
  const g=this.units.get(m.f),victim=this.units.get(m.t),from=pos(m.f),to=pos(m.t),direction=to.clone().sub(from).normalize(),yaw=Math.atan2(direction.x,direction.z),k=speed==='fast'?.48:1;
  let wall,prepared=victim?new Destruction(this.scene,victim,direction,profile.burst):null,activated=false;
  if(prepared){victim.visible=true;prepared.group.visible=false;}
  try{
   g.rotation.y=yaw;
   if(!victim){onEvent('Castle advances');await this.tween(500*k,t=>g.position.lerpVectors(from,to,smooth(t)));return;}
   const approach=to.clone().addScaledVector(direction,-1.25),contactRoot=to.clone().addScaledVector(direction,-.52);
   onEvent('Castle · closing distance');await this.tween((260+from.distanceTo(approach)*85)*k,t=>g.position.lerpVectors(from,approach,smooth(t)));
   const material=new T.MeshBasicMaterial({color:'#b5e7ed',transparent:true,opacity:0,depthWrite:false,side:T.DoubleSide,blending:T.AdditiveBlending});
   wall=new T.Mesh(new T.BoxGeometry(.85,1.75,.045),material);wall.rotation.y=yaw;this.scene.add(wall);
   const placeWall=()=>wall.position.copy(g.position).addScaledVector(direction,.32).setY(.90);
   onEvent('Castle · wall of force');
   await this.tween(100*k,t=>{g.position.copy(approach).addScaledVector(direction,-.08*Math.sin(Math.PI*t));placeWall();wall.scale.set(1,.3+.7*t,1);material.opacity=.16*t});
   await this.tween(120*k,t=>{g.position.lerpVectors(approach,contactRoot,t*t*t);placeWall();material.opacity=.16+.42*t;});
   this.lastContactError=wall.position.clone().setY(0).distanceTo(to.clone().addScaledVector(direction,-.20));
   const effect=prepared;victim.visible=false;effect.group.visible=true;this.effects.push(effect);activated=true;onEvent('Impact · castle wall of force',true);
   await this.tween(180*k,t=>{material.opacity=.58*(1-t);wall.scale.set(1+t*.2,1+t*.12,1)});
   await this.tween(300*k,t=>g.position.lerpVectors(contactRoot,to,smooth(t)));
   while(this.effects.includes(effect))await this.tween(60,()=>{});
  }finally{
   if(prepared&&!activated)prepared.dispose();
   if(wall){this.scene.remove(wall);wall.geometry.dispose();wall.material.dispose()}
   for(const index of new Set([m.f,...(victim?[m.t]:[])])){const unit=this.units.get(index);if(unit){this.scene.remove(unit);disposeWarrior(unit);this.units.delete(index)}}
  }
 }
 async animate(game,m,speed,onEvent,animation='duel'){
  if(animation==='instant'||speed==='skip'||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const g=this.units.get(m.f);if(!g)return;const pawn=g.userData.code[1]==='p',type=g.userData.code[1],from=pos(m.f),to=pos(m.t),vi=m.ep?m.t+(game.turn==='w'?8:-8):m.t,victim=this.units.get(vi),original=g.rotation.y,k=speed==='fast'?.48:1,style=captureStyle(g.userData.code,victim?.userData.code,m.f,m.t,this.count++),body=g.userData.body,arm=g.userData.arm;
  const profile=duelProfiles[animation];
  if(!profile)return this.animateSimple(game,m,speed,onEvent,animation);
  if(type==='r')return this.animateRook(game,m,speed,onEvent,profile);
  // Aim at the solid torso, never at a bounding box enlarged by a lance or crown.
  const impactCenter=victim?pos(vi).add(new T.Vector3(0,({p:.70,n:.90,r:.62,b:1.0,q:1.0,k:1.03})[victim.userData.code[1]],0)):to.clone();const direction=(victim?pos(vi):to).clone().sub(from).normalize(),yaw=Math.atan2(direction.x,direction.z),bash=/bash|ram|charge/.test(style),sweep=/sweep|arc|crosscut/.test(style);let approach=to.clone(),reach=g.userData.weaponTip?.length()||.7;
  if(victim){const dy=impactCenter.y-(arm?.position.y||.8),dx=arm?.position.x||0;const gap=Math.sqrt(Math.max(.10,reach*reach-dy*dy-dx*dx))+(arm?.position.z||0)+.18+(bash?.22:.14);approach.copy(pos(vi)).addScaledVector(direction,-gap)}
  // Fracture is CPU-heavy. Prepare it while both pieces are still at rest,
  // then reveal the ready-made fragments at contact without blocking a frame.
  let armBase=arm?.quaternion.clone(),trail,prepared=victim?new Destruction(this.scene,victim,direction,profile.burst):null,activated=false;
  if(prepared){victim.visible=true;prepared.group.visible=false;}
  try{
   if(pawn){onEvent('Pawn rises from guard');await this.tween(320*k,t=>pose(g,smooth(t)))}
   g.rotation.y=yaw;onEvent(victim?'Closing to striking distance':type==='n'?'Knight advances':'Army advances');
   await this.tween((380+from.distanceTo(approach)*135)*k,t=>{g.position.lerpVectors(from,approach,smooth(t));if(pawn)pose(g,1,Math.sin(t*Math.PI*2*Math.max(2,Math.ceil(from.distanceTo(approach)*2))));if(type==='n'){g.position.y=Math.abs(Math.sin(t*15))*.09;body.rotation.x=Math.sin(t*15)*.045}});
   g.position.copy(approach);body.rotation.set(0,0,0);
   if(victim){
    const contact=impactCenter.clone().addScaledVector(direction,-.18),lunge=bash?.22:.14,impactRoot=approach.clone().addScaledVector(direction,lunge);
    g.position.copy(impactRoot);g.updateWorldMatrix(true,true);let local=body.worldToLocal(contact.clone()).sub(arm.position).normalize(),axis=g.userData.weaponTip.clone().normalize(),contactQ=new T.Quaternion().setFromUnitVectors(axis,local);g.position.copy(approach);
    const windQ=new T.Quaternion().setFromEuler(new T.Euler((bash?-.25:-1.05)*profile.weight,sweep?-.9:0,sweep?-1.3:-.32));
    if(profile.feint){
     const targetBody=victim.userData.body,rest=targetBody?.rotation.clone();
     onEvent('Feint & finish · testing the guard');
     for(const side of[-1,1])await this.tween(330*k,t=>{const beat=Math.sin(Math.PI*t),feint=new T.Quaternion().setFromEuler(new T.Euler(-.45,side*.65,side*.9));arm.quaternion.slerpQuaternions(armBase,feint,beat);body.rotation.y=side*.32*beat;g.position.copy(approach).addScaledVector(direction,.09*beat);if(targetBody)targetBody.rotation.x=(rest?.x||0)-.08*beat});
     body.rotation.set(0,0,0);g.position.copy(approach);if(targetBody)targetBody.rotation.copy(rest);
    }
    if(profile.spin){onEvent('Whirlwind · turning flourish');await this.tween(650*k,t=>{body.rotation.y=Math.PI*2*smooth(t);const flourish=new T.Quaternion().setFromEuler(new T.Euler(-.9,0,-1.5));arm.quaternion.slerpQuaternions(armBase,flourish,Math.sin(Math.PI*t));g.position.copy(approach).addScaledVector(new T.Vector3(-direction.z,0,direction.x),.22*Math.sin(Math.PI*t))});body.rotation.set(0,0,0);g.position.copy(approach);}

    onEvent(profile.name+' · '+style+' · wind-up');await this.tween(profile.wind*k,t=>{arm.quaternion.slerpQuaternions(armBase,windQ,smooth(t));body.rotation.y=(sweep?-.5:-.12)*smooth(t);body.rotation.x=-.12*profile.weight*smooth(t);g.position.copy(approach).addScaledVector(direction,-.10*profile.weight*smooth(t))});
    const trailGeometry=new T.BufferGeometry();trailGeometry.setAttribute('position',new T.BufferAttribute(new Float32Array(16*3),3));trailGeometry.setDrawRange(0,0);const trailMaterial=new T.LineBasicMaterial({color:'#f1d9a2',transparent:true,opacity:.7,depthWrite:false});trail=new T.Line(trailGeometry,trailMaterial);trail.frustumCulled=false;this.scene.add(trail);const trailPoints=[];
    onEvent(profile.name+' · strike');await this.tween(profile.strike*k,t=>{const snap=smooth(t);body.rotation.y=(sweep?-.5:-.12)*(1-snap);body.rotation.x=-.12*profile.weight*(1-snap);arm.quaternion.slerpQuaternions(windQ,contactQ,snap);g.position.lerpVectors(approach.clone().addScaledVector(direction,-.10*profile.weight),impactRoot,snap);g.updateWorldMatrix(true,true);trailPoints.push(arm.localToWorld(g.userData.weaponTip.clone()));if(trailPoints.length>16)trailPoints.shift();trailPoints.forEach((p,i)=>trailGeometry.attributes.position.setXYZ(i,p.x,p.y,p.z));trailGeometry.attributes.position.needsUpdate=true;trailGeometry.setDrawRange(0,trailPoints.length)});
    body.rotation.set(0,0,0);g.position.copy(impactRoot);arm.quaternion.copy(contactQ);g.updateWorldMatrix(true,true);
    this.lastContactError=arm.localToWorld(g.userData.weaponTip.clone()).distanceTo(contact);
    const effect=prepared;victim.visible=false;effect.group.visible=true;this.effects.push(effect);activated=true;onEvent('Impact · '+style,true);
    // Continue directly into follow-through, without a freeze at contact.
    const follow=contactQ.clone().multiply(new T.Quaternion().setFromEuler(new T.Euler(.40*profile.weight,sweep?.65:0,sweep?.55:0)));
    await this.tween(profile.follow*k,t=>{arm.quaternion.slerpQuaternions(contactQ,follow,smooth(t));body.rotation.x=.12*Math.sin(t*Math.PI);body.rotation.y=sweep?.30*smooth(t):0;trailMaterial.opacity=.7*(1-t)});
    await this.tween(280*k,t=>{arm.quaternion.slerpQuaternions(follow,armBase,smooth(t));body.rotation.set(.12*(1-t),sweep?.30*(1-t):0,0)});
    // Advance only after the target has broken apart. The models never overlap at impact.
    await this.tween(430*k,t=>{g.position.lerpVectors(impactRoot,to,smooth(t));if(pawn)pose(g,1,Math.sin(t*Math.PI*4))});
    while(this.effects.includes(effect))await this.tween(60,()=>{});
   }
   if(m.castle){let rf=m.t>m.f?m.f+3:m.f-4,rt=(m.f+m.t)/2,rook=this.units.get(rf);if(rook)await this.tween(450*k,t=>rook.position.lerpVectors(pos(rf),pos(rt),smooth(t)))}
   g.position.copy(to);g.rotation.y=original;if(pawn){onEvent('Pawn returns to kneeling guard');await this.tween(320*k,t=>pose(g,1-smooth(t)))}
  }finally{
   if(prepared&&!activated)prepared.dispose();
   if(trail){this.scene.remove(trail);trail.geometry.dispose();trail.material.dispose()}
   this.scene.remove(g);disposeWarrior(g);this.units.delete(m.f);if(victim){this.scene.remove(victim);disposeWarrior(victim);this.units.delete(vi)}if(m.castle){let rf=m.t>m.f?m.f+3:m.f-4;let rook=this.units.get(rf);if(rook){this.scene.remove(rook);disposeWarrior(rook)}this.units.delete(rf)}
  }
 }
}
