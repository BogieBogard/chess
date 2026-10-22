import * as T from './vendor/three.module.min.js';
import { pose, disposeWarrior } from './pieces.js?v=20261021-park-1';
import { SectionedVictim } from './staged-damage.js?v=20261022-staged-1';
const smooth=t=>t*t*(3-2*t),position=i=>new T.Vector3(i%8-3.5,0,(i>>3)-3.5);
export const stagedStyles=['crown-breaker','sweep-finish','rift-unweave'];

// Independent scene scripts, not timing profiles for Original Duel.
export async function animateStaged(battlefield,game,move,speed,onEvent,style){
 const b=battlefield,g=b.units.get(move.f),vi=move.ep?move.t+(game.turn==='w'?8:-8):move.t,victim=b.units.get(vi);
 // Quiet travel is shared only for non-captures. Every capture below has its own story.
 if(!victim)return b.animateSimple(game,move,speed,onEvent,'glide');
 const from=position(move.f),to=position(move.t),direction=position(vi).sub(from).normalize(),side=new T.Vector3(-direction.z,0,direction.x),yaw=Math.atan2(direction.x,direction.z),k=speed==='fast'?.55:1;
 const damage=new SectionedVictim(b.scene,victim),temporary=[],arm=g.userData.arm,body=g.userData.body,armRest=arm?.quaternion.clone();
 if(style!=='rift-unweave')damage.prepareBursts(direction);
 let disposed=false;
 const step=async(label,ms,fn)=>{onEvent(label);await b.tween(ms*k,fn)};
 const spark=(point,color='#f8dc9b')=>{const mesh=new T.Mesh(arm?new T.TorusGeometry(.16,.018,6,24):new T.BoxGeometry(.8,1.5,.035),new T.MeshBasicMaterial({color,transparent:true,opacity:0,depthWrite:false}));mesh.position.copy(point);mesh.lookAt(point.clone().add(direction));b.scene.add(mesh);temporary.push(mesh);return mesh};
 const trail=new T.Line(new T.BufferGeometry(),new T.LineBasicMaterial({color:'#ffe5ab',transparent:true,opacity:0,depthWrite:false}));trail.geometry.setAttribute('position',new T.BufferAttribute(new Float32Array(12*3),3));trail.geometry.setDrawRange(0,0);trail.frustumCulled=false;b.scene.add(trail);temporary.push(trail);
 const strike=async(region,label,kind,after)=>{
  const target=damage.center(region);target.addScaledVector(direction,-.12);
  // Solve the attacker's root AND arm against the chosen region, rather than
  // rotating an arbitrary swing near it. A castle uses its front force plane.
  const reach=arm?g.userData.weaponTip.length():.32,armY=arm?.position.y||.65,armX=arm?.position.x||0,armZ=arm?.position.z||0;
  const bodyOffset=arm?Math.min(0,target.y-armY+reach*.65):0,initialBodyY=body.position.y;
  const desiredY=Math.min(.14,Math.max(0,target.y-armY-reach*.88));
  const dy=target.y-desiredY-bodyOffset-armY,horizontal=Math.sqrt(Math.max(.035,reach*reach-dy*dy-armX*armX));
  const root=target.clone().addScaledVector(direction,-(horizontal+armZ));root.y=desiredY;
  if(!arm){root.copy(target).addScaledVector(direction,-.32);root.y=0;}
  const initial=g.position.clone();
  const ready=new T.Quaternion().setFromEuler(new T.Euler(kind==='low'?.35:-1.5,kind==='side'?-.85:0,kind==='side'?-1.45:-.25));
  await step(label+' · aim',220,t=>{g.position.lerpVectors(initial,root,smooth(t));if(arm)arm.quaternion.slerpQuaternions(armRest,ready,smooth(t));body.rotation.y=0;body.rotation.x=0;body.position.y=T.MathUtils.lerp(initialBodyY,bodyOffset,smooth(t));});
  g.updateWorldMatrix(true,true);
  let contact;
  if(arm){const local=body.worldToLocal(target.clone()).sub(arm.position).normalize();contact=new T.Quaternion().setFromUnitVectors(g.userData.weaponTip.clone().normalize(),local);}
  const flash=spark(target),points=[];
  await step(label+' · cut',240,t=>{const u=smooth(t);if(arm)arm.quaternion.slerpQuaternions(ready,contact,u);else{g.position.copy(root).addScaledVector(direction,-.2*(1-u));flash.scale.set(.7,4,1)}g.updateWorldMatrix(true,true);const tip=arm?arm.localToWorld(g.userData.weaponTip.clone()):g.position.clone().addScaledVector(direction,.32).setY(target.y);points.push(tip);if(points.length>12)points.shift();points.forEach((point,i)=>trail.geometry.attributes.position.setXYZ(i,point.x,point.y,point.z));trail.geometry.attributes.position.needsUpdate=true;trail.geometry.setDrawRange(0,points.length);trail.material.opacity=.85*Math.sin(Math.PI*t/2)});
  const tip=arm?arm.localToWorld(g.userData.weaponTip.clone()):target;
  (b.stagedContacts??=[]).push({region,error:tip.distanceTo(target)});
  after();onEvent(label+' · impact',true);
  const end=contact?.clone().multiply(new T.Quaternion().setFromEuler(new T.Euler(.7,kind==='side'?1:0,.5)));
  await b.tween(250*k,t=>{if(arm)arm.quaternion.slerpQuaternions(contact,end,smooth(t));flash.material.opacity=.7*(1-t);flash.scale.setScalar(1+t*2);trail.material.opacity=.85*(1-t)});
  if(arm){const previous=arm.quaternion.clone();await b.tween(160*k,t=>{arm.quaternion.slerpQuaternions(previous,armRest,smooth(t));body.position.y=bodyOffset*(1-smooth(t))})}
 };
 try{
  damage.show();b.effects.push(damage);
  if(g.userData.code[1]==='p')await step('Attacker rises',260,t=>pose(g,smooth(t)));
  g.rotation.y=yaw;
  if(style==='crown-breaker'){
   await step('Crown breaker · step across the guard',500,t=>{g.position.lerpVectors(from,to.clone().addScaledVector(direction,-1.35).addScaledVector(side,-.35),smooth(t));body.rotation.y=-.25*Math.sin(Math.PI*t)});
   await strike('head','Crown breaker · head strike','side',()=>damage.detach('head',side.clone().addScaledVector(direction,.4).normalize(),1.25));
   await step('Head tumbles; the body stays standing',450,t=>{damage.bodyPivot.rotation.z=.13*Math.sin(Math.PI*t)});
   await strike('body','Crown breaker · body crosscut','side',()=>damage.burst('body',b.effects));
   await step('The lower half buckles',350,t=>{damage.sections.legs.rotation.x=-.25*smooth(t)});
   await strike('legs','Crown breaker · last stone','low',()=>damage.burst('legs',b.effects));
  }else if(style==='sweep-finish'){
   await step('Sweep & finish · take the outside line',500,t=>g.position.lerpVectors(from,to.clone().addScaledVector(direction,-1.2).addScaledVector(side,.45),smooth(t)));
   await strike('legs','Sweep & finish · cut the legs','low',()=>damage.detach('legs',side.clone().negate(),.7));
   const axisWorld=new T.Vector3().crossVectors(new T.Vector3(0,1,0),side).normalize(),axisLocal=axisWorld.applyQuaternion(damage.root.quaternion.clone().invert());
   await step('Sweep & finish · body falls onto its side',750,t=>{damage.bodyPivot.quaternion.setFromAxisAngle(axisLocal,1.48*smooth(t));damage.bodyPivot.position.y=.16+.10*Math.sin(Math.PI*t)});
   await strike('body','Sweep & finish · grounded final blow','low',()=>{damage.burst('body',b.effects);damage.detach('head',direction,.6)});
  }else{
   // A ranged spell: no advance, sword swing, lunge, or whole-piece hit.
   const ring=new T.Mesh(new T.TorusGeometry(.73,.025,8,64),new T.MeshBasicMaterial({color:'#8cddf3',transparent:true,opacity:0,depthWrite:false}));ring.rotation.x=-Math.PI/2;ring.position.copy(position(vi)).setY(.12);b.scene.add(ring);temporary.push(ring);
   await step('Rift unweave · open the seal',700,t=>{ring.scale.setScalar(smooth(t));ring.material.opacity=.8*smooth(t);if(arm)arm.rotation.x=-.7*smooth(t)});
   for(const [index,region] of ['head','body','legs'].entries()){
    damage.detach(region,side,0);const part=damage.loose.find(x=>x.group===damage.sections[region]);part.landed=true;const start=part.pivot.position.clone(),center=position(vi).setY(.18);
    await step('Rift unweave · extract '+region,900,t=>{const u=smooth(t),angle=u*Math.PI*2.2+index*2.1,radius=.6*Math.sin(Math.PI*u);part.pivot.position.lerpVectors(start,center,u);part.pivot.position.x+=Math.cos(angle)*radius;part.pivot.position.z+=Math.sin(angle)*radius;part.pivot.position.y+=Math.sin(Math.PI*u)*.8;part.pivot.rotation.y=u*Math.PI*3;part.pivot.scale.setScalar(1-Math.pow(u,3));ring.rotation.z=u*Math.PI*2;ring.material.color.setHSL(.52+index*.035,.8,.65);});
    onEvent('Rift consumed the '+region,true);
   }
   await step('Rift unweave · seal the empty square',400,t=>{ring.scale.setScalar(1-smooth(t));ring.material.opacity=.8*(1-t);damage.sections.base.scale.setScalar(1-smooth(t))});
  }
  await step('Fragments settle',400,()=>{});
  await step('Clear the captured square',400,t=>damage.fade(smooth(t)));
  damage.dispose();disposed=true;b.effects.splice(b.effects.indexOf(damage),1);
  const initial=g.position.clone();await step('Claim the square',450,t=>g.position.lerpVectors(initial,to,smooth(t)));
  if(g.userData.code[1]==='p')await step('Return to guard',220,t=>pose(g,1-smooth(t)));
  // Do not leave the previous move's loose debris in the next preview/game turn.
  const bursts=[...damage.bursts.values()].filter(x=>x.active).map(x=>x.effect);
  while(bursts.some(effect=>b.effects.includes(effect)))await b.tween(60,()=>{});
 }finally{
  if(!disposed)damage.dispose();const index=b.effects.indexOf(damage);if(index>=0)b.effects.splice(index,1);
  for(const mesh of temporary){mesh.removeFromParent();mesh.geometry.dispose();mesh.material.dispose()}
  for(const index of new Set([move.f,vi])){const unit=b.units.get(index);if(unit){unit.removeFromParent();disposeWarrior(unit);b.units.delete(index)}}
 }
}
