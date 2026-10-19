import * as T from './vendor/three.module.min.js';
const smooth=t=>t*t*(3-2*t);
const pos=i=>new T.Vector3(i%8-3.5,0,(i>>3)-3.5);
const mat=(color,metalness=.35)=>new T.MeshStandardMaterial({color,metalness,roughness:.43});
const palettes={w:{armor:mat('#e6dcc0'),trim:mat('#c59a51',.75),cloth:mat('#355865',.05)},b:{armor:mat('#465563'),trim:mat('#ba8e57',.75),cloth:mat('#652f37',.05)}};
const geo={};
function mesh(parent,shape,args,material,x=0,y=0,z=0){let key=shape+args.join(',');let g=geo[key]??=(new T[shape](...args));let m=new T.Mesh(g,material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
function box(g,m,x,y,z,w,h,d){return mesh(g,'BoxGeometry',[w,h,d],m,x,y,z)}
function ball(g,m,x,y,z,r){return mesh(g,'SphereGeometry',[r,12,8],m,x,y,z)}
function cyl(g,m,x,y,z,r,h,top=r){return mesh(g,'CylinderGeometry',[top,r,h,12],m,x,y,z)}
function limb(parent,m,x,y,z){let g=new T.Group();g.position.set(x,y,z);parent.add(g);box(g,m,0,-.13,0,.115,.28,.13);let knee=new T.Group();knee.position.y=-.27;g.add(knee);box(knee,m,0,-.12,0,.10,.25,.11);box(knee,m,0,-.245,.055,.12,.08,.23);g.userData.knee=knee;return g}
export function warrior(code){let g=new T.Group(),body=new T.Group(),p=palettes[code[0]],type=code[1];g.add(body);g.userData={code,body};
 cyl(g,p.trim,0,.045,0,.28,.09);cyl(g,p.armor,0,.10,0,.245,.045);
 if(type==='r'){
  cyl(body,p.armor,0,.50,0,.22,.77,.19);cyl(body,p.trim,0,.84,0,.28,.08);
  for(let i=0;i<6;i++){let a=i*Math.PI/3;box(body,p.armor,Math.sin(a)*.22,.95,Math.cos(a)*.22,.14,.19,.14)}
  box(body,p.cloth,0,.55,.215,.10,.30,.025);box(body,p.trim,0,.69,.23,.14,.035,.035);
  let arm=new T.Group();arm.position.set(.27,.63,0);body.add(arm);box(arm,p.trim,0,0,.28,.11,.11,.63);g.userData.arm=arm;
 }else if(type==='n'){
  box(body,p.cloth,0,.62,0,.32,.30,.62);for(let x of [-.12,.12])for(let z of [-.23,.23])box(body,p.armor,x,.33,z,.09,.47,.10);
  let neck=box(body,p.armor,0,.88,.24,.24,.48,.22);neck.rotation.x=-.45;
  box(body,p.armor,0,1.08,.37,.24,.22,.38);for(let x of [-.085,.085]){mesh(body,'ConeGeometry',[.055,.18,4],p.armor,x,1.28,.25);ball(body,p.trim,x*1.5,1.12,.43,.029)}
  box(body,p.trim,0,.81,-.04,.38,.08,.24);cyl(body,p.armor,0,1.01,-.09,.13,.32);ball(body,p.armor,0,1.25,-.09,.12);
  let arm=new T.Group();arm.position.set(-.17,1.04,-.08);body.add(arm);let lance=cyl(arm,p.trim,0,0,.42,.025,1.25);lance.rotation.x=Math.PI/2;mesh(arm,'ConeGeometry',[.06,.22,4],p.armor,0,0,1.12).rotation.x=Math.PI/2;g.userData.arm=arm;
 }else{
  let legs=[limb(body,p.armor,-.105,.65,0),limb(body,p.armor,.105,.65,0)];g.userData.legs=legs;
  if(type==='p'){
   box(body,p.cloth,0,.67,0,.29,.22,.24);box(body,p.armor,0,.86,0,.34,.30,.23);cyl(body,p.trim,0,.72,0,.19,.05);ball(body,p.armor,0,1.14,0,.16);box(body,p.cloth,0,1.16,.143,.23,.055,.025);box(body,p.trim,0,1.25,0,.035,.15,.25);
  }else{
   let h=type==='k'?1.05:.95;mesh(body,'ConeGeometry',[.28,.71,12],p.cloth,0,.65,0);cyl(body,p.armor,0,h-.12,0,.20,.38,.15);ball(body,p.armor,0,h+.20,0,.145);
   if(type==='b'){mesh(body,'ConeGeometry',[.17,.44,4],p.armor,0,h+.48,0);box(body,p.trim,0,h+.44,.12,.025,.22,.025)}
   else{cyl(body,p.trim,0,h+.33,0,.18,.09);for(let i=0;i<(type==='q'?7:4);i++){let a=i*Math.PI*2/(type==='q'?7:4);mesh(body,'ConeGeometry',[.047,type==='q'?.20:.14,4],p.trim,Math.cos(a)*.145,h+.46,Math.sin(a)*.145)}if(type==='k'){box(body,p.trim,0,h+.64,0,.045,.26,.045);box(body,p.trim,0,h+.67,0,.16,.045,.045)}}
   box(body,p.cloth,0,h-.19,-.18,.35,.66,.045);
  }
  let arm=new T.Group();arm.position.set(-.23,type==='p'?.96:.91,0);body.add(arm);box(arm,p.armor,0,-.14,0,.11,.30,.12);
  const staff=type==='b'||type==='q';cyl(arm,p.trim,0,-.1,.16,.025,staff?1.13:.50);if(staff){ball(arm,p.trim,0,.51,.16,.09);if(type==='q')mesh(arm,'OctahedronGeometry',[.12],p.cloth,0,.56,.16)}else{box(arm,p.trim,0,.06,.16,.24,.045,.06);mesh(arm,'ConeGeometry',[.045,.49,4],p.armor,0,.31,.16)}
  box(body,p.cloth,.26,.81,.09,.10,.34,.28);box(body,p.trim,.32,.81,.09,.025,.29,.24);g.userData.arm=arm;
 }
 g.rotation.y=code[0]==='w'?Math.PI:0;pose(g,type==='p'?0:1);return g;
}
function pose(g,stand,walk=0){let d=g.userData;if(d.code[1]!=='p')return;d.body.position.y=-.26*(1-stand);d.body.rotation.x=.13*(1-stand);d.legs[0].rotation.x=-1.25*(1-stand)+walk*.65;d.legs[0].userData.knee.rotation.x=1.6*(1-stand)-Math.min(walk,0)*.6;d.legs[1].rotation.x=.8*(1-stand)-walk*.65;d.legs[1].userData.knee.rotation.x=.6*(1-stand)+Math.max(walk,0)*.6;}
export function captureStyle(code,victim,from,to,variant){const diagonal=from%8!==to%8&&(from>>3)!==(to>>3);if(code[1]==='n')return 'lance charge';if(code[1]==='r')return 'siege ram';if(code[1]==='b')return diagonal?'staff sweep':'staff thrust';if(code[1]==='q')return victim?.[1]==='r'?'royal shatter':'royal arc';if(code[1]==='k')return 'overhead cleave';return victim?.[1]==='n'?'low thrust':diagonal?(variant%2?'shield bash':'crosscut'):'forward thrust';}
export class Battlefield{
 constructor(host,onSquare){this.host=host;this.units=new Map();this.tiles=[];this.scene=new T.Scene();this.scene.background=new T.Color('#151b20');this.scene.fog=new T.Fog('#151b20',18,34);this.camera=new T.PerspectiveCamera(39,1,.1,80);this.angle=.30;this.elevation=.88;this.distance=17;this.flip=false;
 this.renderer=new T.WebGLRenderer({antialias:true,alpha:false});this.renderer.setPixelRatio(Math.min(devicePixelRatio,2));this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=T.PCFSoftShadowMap;this.renderer.toneMapping=T.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.35;host.append(this.renderer.domElement);this.renderer.domElement.setAttribute('aria-label','3D chess battlefield. Tap a piece, then a highlighted square.');
 this.scene.add(new T.HemisphereLight('#c5dce7','#444032',2.1));let sun=new T.DirectionalLight('#ffdb9f',4);sun.position.set(-4,10,5);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-7,right:7,top:7,bottom:-7});sun.shadow.bias=-.001;this.scene.add(sun);let rim=new T.DirectionalLight('#8cbfea',2.3);rim.position.set(5,6,-5);this.scene.add(rim);
 box(this.scene,mat('#34312d'),0,-.22,0,8.65,.42,8.65);box(this.scene,mat('#bb9457',.7),0,-.07,0,8.38,.10,8.38);let floor=mesh(this.scene,'PlaneGeometry',[200,200],mat('#171d22',.1),0,-.46,0);floor.rotation.x=-Math.PI/2;
 for(let i=0;i<64;i++){let v=pos(i),m=mat(((i>>3)+i%8)%2?'#475b61':'#b2ad97',.15);let tile=box(this.scene,m,v.x,.005,v.z,.985,.12,.985);tile.userData.square=i;tile.userData.base=m.color.clone();this.tiles.push(tile)}
 this.labels=new T.Group();this.scene.add(this.labels);for(let i=0;i<8;i++){this.label('abcdefgh'[i],i-3.5,4.22);this.label(String(8-i),-4.23,i-3.5)}
 this.ray=new T.Raycaster();const hit=e=>{this.camera.updateMatrixWorld();this.scene.updateMatrixWorld();let r=this.renderer.domElement.getBoundingClientRect();this.ray.setFromCamera(new T.Vector2((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1),this.camera);let h=this.ray.intersectObjects([...this.units.values(),...this.tiles],true)[0];if(!h)return null;let o=h.object;while(o&&o.userData.square===undefined)o=o.parent;return o?.userData.square??null};let down;
 this.renderer.domElement.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY,i:hit(e),orbit:e.button===2||e.altKey};this.renderer.domElement.setPointerCapture(e.pointerId)});
 this.renderer.domElement.addEventListener('pointermove',e=>{if(down?.orbit){this.angle-=(e.clientX-down.x)*.008;this.elevation=T.MathUtils.clamp(this.elevation+(e.clientY-down.y)*.006,.45,1.45);down.x=e.clientX;down.y=e.clientY;this.cameraUpdate()}});
 this.renderer.domElement.addEventListener('pointerup',e=>{if(!down)return;if(!down.orbit){let i=hit(e);if(i!==null){if(Math.hypot(e.clientX-down.x,e.clientY-down.y)>10&&down.i!==null){onSquare(down.i);onSquare(i)}else onSquare(i)}}down=null});this.renderer.domElement.addEventListener('pointercancel',()=>down=null);this.renderer.domElement.addEventListener('contextmenu',e=>e.preventDefault());
 this.renderer.domElement.addEventListener('wheel',e=>{e.preventDefault();this.distance=T.MathUtils.clamp(this.distance+e.deltaY*.008,11,21);this.cameraUpdate()},{passive:false});
 this.observer=new ResizeObserver(()=>this.resize());this.observer.observe(host);this.resize();this.renderer.setAnimationLoop(()=>this.renderer.render(this.scene,this.camera));this.count=0;
 }
 label(text,x,z){let c=document.createElement('canvas');c.width=c.height=64;let ctx=c.getContext('2d');ctx.fillStyle='#d2b47d';ctx.font='40px Georgia';ctx.textAlign='center';ctx.fillText(text,32,45);let texture=new T.CanvasTexture(c);let m=new T.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false});let plane=new T.Mesh(new T.PlaneGeometry(.25,.25),m);plane.rotation.x=-Math.PI/2;plane.position.set(x,.005,z);this.labels.add(plane)}
 resize(){let w=this.host.clientWidth,h=this.host.clientHeight;this.renderer.setSize(w,h);this.camera.aspect=w/h;this.camera.updateProjectionMatrix();this.cameraUpdate()}
 cameraUpdate(){let a=this.angle+(this.flip?Math.PI:0),d=this.distance/Math.min(1,this.camera.aspect*1.03);this.camera.position.set(Math.sin(a)*Math.cos(this.elevation)*d,Math.sin(this.elevation)*d,Math.cos(a)*Math.cos(this.elevation)*d);this.camera.lookAt(0,.1,0);this.scene.fog.near=d+5;this.scene.fog.far=d+45;this.camera.far=Math.max(80,d+60);this.camera.updateProjectionMatrix()}
 sync(game,selected,flipped,last){this.flip=flipped;this.cameraUpdate();for(let [i,g]of this.units){if(game.b[i]!==g.userData.code){this.scene.remove(g);this.units.delete(i)}}for(let i=0;i<64;i++)if(game.b[i]&&!this.units.has(i)){let g=warrior(game.b[i]);g.position.copy(pos(i));g.userData.square=i;this.units.set(i,g);this.scene.add(g)}let legal=selected<0?[]:game.legal().filter(m=>m.f===selected).map(m=>m.t);for(let i=0;i<64;i++){let tile=this.tiles[i];tile.material.color.copy(tile.userData.base);tile.material.emissive.set(i===selected?'#a47e2b':legal.includes(i)?'#396e56':last&&(last.f===i||last.t===i)?'#4c4521':'#000000');if(game.b[i]===game.turn+'k'&&game.check())tile.material.emissive.set('#a62d24')}
 }
 tween(ms,fn){return new Promise(resolve=>{let elapsed=0,last=performance.now();const tick=now=>{if(!this.paused)elapsed+=now-last;last=now;let t=Math.min(1,elapsed/ms);fn(t);if(t<1)requestAnimationFrame(tick);else resolve()};requestAnimationFrame(tick)})}
 async animate(game,m,speed,onEvent){if(speed==='skip'||matchMedia('(prefers-reduced-motion: reduce)').matches)return;let g=this.units.get(m.f);if(!g)return;const pawn=g.userData.code[1]==='p',type=g.userData.code[1],from=pos(m.f),to=pos(m.t),victimIndex=m.ep?m.t+(game.turn==='w'?8:-8):m.t,victim=this.units.get(victimIndex),original=g.rotation.y,k=speed==='fast'?.32:1,dir=to.clone().sub(from).normalize(),yaw=Math.atan2(dir.x,dir.z),style=captureStyle(g.userData.code,victim?.userData.code,m.f,m.t,this.count++);let target=to.clone();if(victim)target.addScaledVector(dir,-.42);
 try{
  if(pawn){onEvent('Pawn rises from guard');await this.tween(300*k,t=>pose(g,smooth(t)))}
  g.rotation.y=yaw;onEvent(victim?style: type==='n'?'Knight advances':'Army advances');
  await this.tween((420+from.distanceTo(to)*105)*k,t=>{g.position.lerpVectors(from,target,smooth(t));if(pawn)pose(g,1,Math.sin(t*Math.PI*2*Math.max(2,Math.ceil(from.distanceTo(to)*2))));if(type==='n'){g.position.y=Math.sin(Math.PI*t)*.25;g.userData.body.rotation.x=Math.sin(t*20)*.06}});
  if(victim){onEvent(style,true);let arm=g.userData.arm,base=arm?.rotation.clone(),armOrigin=arm?.position.clone();let victimBody=victim.userData.body;const sweep=/sweep|arc|crosscut/.test(style),bash=/bash|ram|charge/.test(style);await this.tween(680*k,t=>{let impact=Math.max(0,(t-.4)/.6),swing=Math.sin(t*Math.PI),thrust=/thrust/.test(style);if(arm){arm.rotation.x=base.x+(style==='overhead cleave'?-2.8:thrust?-1.55:sweep?-.6:bash?-.15:-1.4)*swing;arm.rotation.z=base.z+(sweep?2.3:.15)*swing;arm.rotation.y=base.y+(sweep?1.5:0)*swing;arm.position.z=armOrigin.z+(thrust?.35:.08)*swing;arm.position.y=armOrigin.y+(style==='low thrust'?-.24:0)*swing}g.userData.body.rotation.x=(bash?.40:.16)*Math.sin(t*Math.PI);g.position.copy(target).addScaledVector(dir,Math.sin(t*Math.PI)*(bash?.30:.14));victimBody.rotation.x=victim.userData.code[1]==='r'?0:-smooth(impact)*1.45;victimBody.rotation.z=victim.userData.code[1]==='n'?smooth(impact)*1.1:0;victim.position.copy(to).addScaledVector(dir,.22*smooth(impact));if(m.ep)victim.position.copy(pos(victimIndex)).addScaledVector(dir,.22*smooth(impact));victim.scale.setScalar(1-smooth(impact)*.9);if(t>.45)victim.position.y=-smooth(impact)*.2;});if(arm){arm.rotation.copy(base);arm.position.copy(armOrigin)}victim.visible=false;g.userData.body.rotation.set(0,0,0);await this.tween(200*k,t=>g.position.lerpVectors(target,to,smooth(t)));
  }
  if(m.castle){let rf=m.t>m.f?m.f+3:m.f-4,rt=(m.f+m.t)/2,rook=this.units.get(rf);if(rook)await this.tween(450*k,t=>rook.position.lerpVectors(pos(rf),pos(rt),smooth(t)))}
  g.position.copy(to);g.rotation.y=original;if(pawn){onEvent('Pawn returns to kneeling guard');await this.tween(320*k,t=>pose(g,1-smooth(t)))}
 }finally{this.scene.remove(g);this.units.delete(m.f);if(victim){this.scene.remove(victim);this.units.delete(victimIndex)}if(m.castle){let rf=m.t>m.f?m.f+3:m.f-4;this.scene.remove(this.units.get(rf));this.units.delete(rf)}}
 }
}
