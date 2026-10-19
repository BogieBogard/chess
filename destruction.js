import * as T from './vendor/three.module.min.js';
const EPS=1e-5;
// Clip convex primitive triangles and close the cut surface. The original model's
// armor, crown, limbs, and weapon become solid fragments rather than generic cubes.
export function splitSolid(geometry,normal,point){
 const source=geometry.index?geometry.toNonIndexed():geometry.clone(),a=source.attributes.position;
 const plane=new T.Plane().setFromNormalAndCoplanarPoint(normal,point),sides=[[],[]],cuts=[];
 const add=(out,p,q,r)=>out.push(...p.toArray(),...q.toArray(),...r.toArray());
 for(let i=0;i<a.count;i+=3){const tri=[0,1,2].map(k=>new T.Vector3().fromBufferAttribute(a,i+k));
  for(let side=0;side<2;side++){let out=[];for(let j=0;j<3;j++){let p=tri[j],q=tri[(j+1)%3],dp=plane.distanceToPoint(p)*(side? -1:1),dq=plane.distanceToPoint(q)*(side?-1:1);if(dp>=-EPS)out.push(p);if((dp>EPS&&dq< -EPS)||(dp< -EPS&&dq>EPS)){let hit=p.clone().lerp(q,dp/(dp-dq));out.push(hit);if(!side&&!cuts.some(v=>v.distanceToSquared(hit)<EPS*EPS))cuts.push(hit)}}for(let j=1;j<out.length-1;j++)add(sides[side],out[0],out[j],out[j+1])}
 }
 if(cuts.length>=3){const center=cuts.reduce((s,p)=>s.add(p),new T.Vector3()).divideScalar(cuts.length),u=new T.Vector3().crossVectors(normal,Math.abs(normal.y)<.9?new T.Vector3(0,1,0):new T.Vector3(1,0,0)).normalize(),v=new T.Vector3().crossVectors(normal,u);cuts.sort((p,q)=>Math.atan2(p.clone().sub(center).dot(v),p.clone().sub(center).dot(u))-Math.atan2(q.clone().sub(center).dot(v),q.clone().sub(center).dot(u)));for(let i=0;i<cuts.length;i++){let p=cuts[i],q=cuts[(i+1)%cuts.length];add(sides[0],center,q,p);add(sides[1],center,p,q)}}
 source.dispose();return sides.filter(s=>s.length>=9).map(s=>{let g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(s,3));g.computeVertexNormals();const uv=[],p=g.attributes.position,n=g.attributes.normal;for(let i=0;i<p.count;i++){let ax=Math.abs(n.getX(i)),ay=Math.abs(n.getY(i)),az=Math.abs(n.getZ(i));uv.push((ax>ay&&ax>az?p.getZ(i):p.getX(i))*2,(ay>ax&&ay>az?p.getZ(i):p.getY(i))*2)}g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));return g});
}
export function fractureGeometry(geometry,depth=1,seed=1){let pieces=[geometry.clone()];for(let level=0;level<depth;level++){const next=[];for(let g of pieces){g.computeBoundingBox();const size=g.boundingBox.getSize(new T.Vector3()),center=g.boundingBox.getCenter(new T.Vector3());let axis=size.x>=size.y&&size.x>=size.z?0:size.y>=size.z?1:2;let n=new T.Vector3(.22*Math.sin(seed++*2.1),.22*Math.cos(seed*3.7),.20*Math.sin(seed*4.2));n.setComponent(axis,1).normalize();let split=splitSolid(g,n,center);g.dispose();next.push(...split)}pieces=next}return pieces}
export function debrisVelocity(center,origin,direction,index){let away=center.clone().sub(origin);away.y=0;if(away.lengthSq()<.001)away.set(Math.sin(index*2.4),0,Math.cos(index*2.4));away.normalize();const power=1.25+(Math.sin(index*12.3)*.5+.5)*1.9;return away.multiplyScalar(power).addScaledVector(direction,2.0).setY(1.5+(Math.sin(index*4.7)*.5+.5)*3.1)}
export class Destruction {
 constructor(scene,victim,direction){
  this.scene=scene;this.group=new T.Group();scene.add(this.group);this.fragments=[];this.materials=new Map();this.age=0;this.duration=1.65;
  victim.updateWorldMatrix(true,true);const origin=victim.getWorldPosition(new T.Vector3()).add(new T.Vector3(0,.65,0));let index=0;
  victim.traverse(o=>{if(!o.isMesh||!o.geometry.attributes.position||!o.visible)return;
   const parts=o.userData.fractureParts||[{geometry:o.geometry,matrix:new T.Matrix4()}];
   for(let part of parts){let source=part.geometry.clone();source.applyMatrix4(new T.Matrix4().multiplyMatrices(o.matrixWorld,part.matrix));source.computeBoundingBox();let size=source.boundingBox.getSize(new T.Vector3()),large=Math.max(size.x,size.y,size.z)>.25;const closed=part.geometry.type!=='BufferGeometry';let pieces=closed?fractureGeometry(source,large?2:1,index+1):[source.clone()];source.dispose();
   for(let geo of pieces){geo.computeBoundingBox();let center=geo.boundingBox.getCenter(new T.Vector3());geo.translate(-center.x,-center.y,-center.z);let original=Array.isArray(o.material)?o.material[0]:o.material;if(!this.materials.has(original)){let material=original.clone();material.transparent=true;material.depthWrite=true;this.materials.set(original,material)}let m=new T.Mesh(geo,this.materials.get(original));m.position.copy(center);m.castShadow=true;m.receiveShadow=true;this.group.add(m);const velocity=debrisVelocity(center,origin,direction,index++);this.fragments.push({mesh:m,velocity,spin:new T.Vector3(Math.sin(index)*8,Math.cos(index*2)*10,Math.sin(index*3)*9),radius:Math.min(.14,size.length()*.10),settled:false})}
   }
  });victim.visible=false;
  const dustMaterial=new T.MeshBasicMaterial({color:'#c5b59a',transparent:true,opacity:.13,depthWrite:false});this.dustMaterial=dustMaterial;this.dust=[];
  const dustGeo=new T.IcosahedronGeometry(1,1);this.dustGeo=dustGeo;for(let i=0;i<12;i++){let mesh=new T.Mesh(dustGeo,dustMaterial);mesh.position.copy(origin);mesh.scale.setScalar(.08);this.group.add(mesh);this.dust.push({mesh,direction:new T.Vector3(Math.sin(i*2.4),.3+Math.sin(i*4)*.2,Math.cos(i*2.4))})}
  this.light=new T.PointLight('#ffcf83',8,3);this.light.position.copy(origin);this.group.add(this.light);
 }
 update(dt){if(this.hold>0){this.hold-=dt;return true}this.age+=dt;let t=this.age;
  for(let f of this.fragments){if(f.settled)continue;f.velocity.y-=9.8*dt;f.mesh.position.addScaledVector(f.velocity,dt);f.mesh.rotation.x+=f.spin.x*dt;f.mesh.rotation.y+=f.spin.y*dt;f.mesh.rotation.z+=f.spin.z*dt;let floor=.075+f.radius;if(f.mesh.position.y<floor){f.mesh.position.y=floor;if(Math.abs(f.velocity.y)<.65){f.settled=true}else{f.velocity.y=-f.velocity.y*.27;f.velocity.x*=.58;f.velocity.z*=.58;f.spin.multiplyScalar(.45)}}}
  for(let d of this.dust){d.mesh.position.addScaledVector(d.direction,dt*1.4);d.mesh.scale.setScalar(.08+t*.42)}this.dustMaterial.opacity=.13*Math.max(0,1-t/1.1);this.light.intensity=8*Math.exp(-t*25);
  let fade=1-T.MathUtils.smoothstep(t,.9,this.duration);for(let m of this.materials.values()){m.opacity=fade;if(fade<.4)m.depthWrite=false}return t<this.duration;
 }
 dispose(){this.scene.remove(this.group);for(let f of this.fragments)f.mesh.geometry.dispose();for(let m of this.materials.values())m.dispose();this.dustMaterial.dispose();this.dustGeo.dispose();this.light.dispose();}
}
