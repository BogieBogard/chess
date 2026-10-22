import * as T from './vendor/three.module.min.js';
import { splitSolid, Destruction } from './destruction.js?v=20261021-park-1';

// Cut the original model into capped solid regions before choreography starts.
// Damage changes only the visual surrogate; chess state remains untouched.
export class SectionedVictim {
 constructor(scene,victim){
  this.scene=scene;this.victim=victim;this.root=new T.Group();this.root.name='Sectioned victim';this.root.position.copy(victim.position);this.root.quaternion.copy(victim.quaternion);this.root.scale.copy(victim.scale);this.root.visible=false;scene.add(this.root);
  this.bursts=new Map();this.geometries=[];this.materials=new Map();this.loose=[];this.disposed=false;
  victim.updateWorldMatrix(true,true);const inverse=victim.matrixWorld.clone().invert(),sources=[];const bounds=new T.Box3();
  victim.traverse(o=>{if(!o.isMesh||!o.visible)return;for(const part of o.userData.fractureParts||[{geometry:o.geometry,matrix:new T.Matrix4()}]){const geo=part.geometry.clone().applyMatrix4(new T.Matrix4().multiplyMatrices(inverse,new T.Matrix4().multiplyMatrices(o.matrixWorld,part.matrix)));geo.computeBoundingBox();bounds.union(geo.boundingBox);sources.push({geo,material:Array.isArray(o.material)?o.material[0]:o.material})}});
  this.height=bounds.max.y;this.cuts=[.16,this.height*.43,this.height*.73];
  this.bodyPivot=new T.Group();this.bodyPivot.position.y=.16;this.root.add(this.bodyPivot);
  this.sections={};const keys=['base','legs','body','head'];
  const pivots=[.08,.16,this.cuts[1],this.cuts[2]];
  keys.forEach((key,i)=>{const group=new T.Group();group.name=key;group.userData.region=key;group.position.y=pivots[i]-(i? .16:0);(i?this.bodyPivot:this.root).add(group);this.sections[key]=group});
  for(const {geo,material} of sources){let remaining=geo;
   if(!this.materials.has(material)){const copy=material.clone();copy.transparent=true;this.materials.set(material,copy)}
   for(let i=0;i<4&&remaining;i++){
    remaining.computeBoundingBox();let lower=null,upper=null;
    if(i===3||remaining.boundingBox.max.y<=this.cuts[i]+1e-5)lower=remaining;
    else if(remaining.boundingBox.min.y>=this.cuts[i]-1e-5)upper=remaining;
    else {const halves=splitSolid(remaining,new T.Vector3(0,1,0),new T.Vector3(0,this.cuts[i],0));[upper,lower]=halves;remaining.dispose();}
    if(lower){lower.translate(0,-pivots[i],0);this.geometries.push(lower);const mesh=new T.Mesh(lower,this.materials.get(material));mesh.castShadow=mesh.receiveShadow=true;this.sections[keys[i]].add(mesh)}
    remaining=upper;
   }
  }
  this.root.updateWorldMatrix(true,true);
 }
 prepareBursts(direction){
  this.root.updateWorldMatrix(true,true);
  for(const name of ['head','body','legs']){const region=this.sections[name];const matrix=region.matrixWorld.clone();const effect=new Destruction(this.scene,region,direction,.85);effect.group.visible=false;region.visible=true;this.bursts.set(name,{effect,matrix,active:false});}
 }
 burst(region,effects){const prepared=this.bursts.get(region);if(!prepared||prepared.active)return;const section=this.sections[region];section.updateWorldMatrix(true,true);prepared.effect.group.applyMatrix4(section.matrixWorld.clone().multiply(prepared.matrix.clone().invert()));section.visible=false;prepared.effect.group.visible=true;prepared.active=true;effects.push(prepared.effect);}
 show(){this.victim.visible=false;this.root.visible=true;}
 center(region){this.root.updateWorldMatrix(true,true);return new T.Box3().setFromObject(this.sections[region]).getCenter(new T.Vector3())}
 detach(region,direction,power=1){const group=this.sections[region];if(!group||!group.children.length||this.loose.some(x=>x.group===group))return;this.root.updateWorldMatrix(true,true);const center=this.center(region),bounds=new T.Box3().setFromObject(group),pivot=new T.Group();pivot.position.copy(center);this.scene.add(pivot);pivot.attach(group);this.loose.push({group,pivot,velocity:direction.clone().multiplyScalar(1.7*power).setY(2.4*power),radius:Math.min(.3,(bounds.max.y-bounds.min.y)*.35),spin:new T.Vector3(3.4,2.2,-4.2),landed:false});}
 update(dt){for(const part of this.loose){if(part.landed)continue;part.velocity.y-=9.8*dt;part.pivot.position.addScaledVector(part.velocity,dt);part.pivot.rotateX(part.spin.x*dt);part.pivot.rotateY(part.spin.y*dt);part.pivot.rotateZ(part.spin.z*dt);if(part.pivot.position.y<.09+part.radius){part.pivot.position.y=.09+part.radius;part.velocity.y=-part.velocity.y*.22;part.velocity.x*=.65;part.velocity.z*=.65;part.spin.multiplyScalar(.55);if(Math.abs(part.velocity.y)<.35)part.landed=true;}}return true;}
 fade(t){for(const material of this.materials.values()){material.opacity=1-t;material.depthWrite=t<.5}}
 dispose(){if(this.disposed)return;this.disposed=true;this.root.removeFromParent();for(const {effect,active} of this.bursts.values())if(!active)effect.dispose();for(const part of this.loose)part.pivot.removeFromParent();for(const geo of this.geometries)geo.dispose();for(const material of this.materials.values())material.dispose();}
}
