import * as T from './vendor/three.module.min.js';

// One board square is 5cm: the board is 40cm wide on a 74cm-high table.
export const parkScale={metresPerUnit:.05,ground:-15.3,tableTop:-.5,tableWidth:15,seatTop:-7.5};
export function createPark(){
 const group=new T.Group();group.name='Pocket park';
 const materials={stone:new T.MeshStandardMaterial({color:'#aca897',roughness:.91}),edge:new T.MeshStandardMaterial({color:'#d3cbb8',roughness:.85}),iron:new T.MeshStandardMaterial({color:'#233b36',metalness:.65,roughness:.53}),wood:new T.MeshStandardMaterial({color:'#855e3c',roughness:.82}),grass:new T.MeshStandardMaterial({color:'#64765a',roughness:1}),path:new T.MeshStandardMaterial({color:'#bdaf95',roughness:1}),bark:new T.MeshStandardMaterial({color:'#5a5141',roughness:1})};
 const add=(geometry,material,x,y,z,parent=group)=>{const mesh=new T.Mesh(geometry,material);mesh.position.set(x,y,z);mesh.receiveShadow=true;mesh.castShadow=geometry.type!=='PlaneGeometry';parent.add(mesh);return mesh};
 const box=(w,h,d,mat,x,y,z,parent)=>add(new T.BoxGeometry(w,h,d),mat,x,y,z,parent);
 const ground=parkScale.ground;
 const lawn=add(new T.PlaneGeometry(700,700),materials.grass,0,ground,0);lawn.rotation.x=-Math.PI/2;
 box(62,.10,650,materials.path,0,ground+.04,0);
 box(650,.10,30,materials.path,0,ground+.045,-56);
 const plaza=add(new T.CylinderGeometry(31,31,.18,64),materials.stone,0,ground+.1,0);
 for(const radius of[27.5,30]){const ring=add(new T.RingGeometry(radius,radius+.18,64),materials.edge,0,ground+.21,0);ring.rotation.x=-Math.PI/2;}
 const table=new T.Group();table.name='75cm stone chess table';group.add(table);
 box(15,.85,15,materials.edge,0,-.94,0,table);
 box(13.5,.55,13.5,materials.stone,0,-1.64,0,table);
 add(new T.CylinderGeometry(2.05,2.7,12.2,12),materials.stone,0,-8,0,table);
 box(8,.8,8,materials.edge,0,ground+.6,0,table);
 // Low stools leave the full board visible from the seated playing position.
 for(const z of[-12,12]){
  add(new T.CylinderGeometry(3.6,3.6,.65,24),materials.edge,0,parkScale.seatTop-.325,z);
  add(new T.CylinderGeometry(1.3,1.8,7.1,12),materials.stone,0,ground+3.7,z);
 }
 function bench(x,z,rotation){const bench=new T.Group();bench.position.set(x,ground,z);bench.rotation.y=rotation;group.add(bench);
  for(const px of[-9,9]){box(.7,8,5,materials.iron,px,4,0,bench);box(.7,14,.65,materials.iron,px,7,-2.6,bench)}
  for(let i=0;i<4;i++)box(23,.65,.95,materials.wood,0,8.2,-1.6+i*1.15,bench);
  for(let i=0;i<3;i++)box(23,1.25,.65,materials.wood,0,10+i*1.7,-2.6,bench);
 }
 bench(-24,4,Math.PI/2);bench(24,-3,-Math.PI/2);bench(-24,-48,Math.PI/2);bench(24,-74,-Math.PI/2);
 // Instance trees and their crowns to keep the park inexpensive on phones.
 const trees=[];for(let row=0;row<2;row++)for(let side of[-1,1])for(let i=0;i<14;i++)trees.push({x:side*(44+row*32+Math.sin(i*2.7)*5),z:-170+i*26+row*11,h:70+Math.sin(i*1.9+row)*16});
 const trunkGeo=new T.CylinderGeometry(.7,1.35,1,8),crownGeo=new T.IcosahedronGeometry(1,2),trunks=new T.InstancedMesh(trunkGeo,materials.bark,trees.length);
 const leaves=new T.MeshStandardMaterial({color:'#56724d',roughness:1,flatShading:true});
 const crowns=new T.InstancedMesh(crownGeo,leaves,trees.length*5),dummy=new T.Object3D();
 trees.forEach((tree,i)=>{dummy.rotation.set(0,0,0);dummy.position.set(tree.x,ground+tree.h*.32,tree.z);dummy.scale.set(1,tree.h*.64,1);dummy.updateMatrix();trunks.setMatrixAt(i,dummy.matrix);
  for(let j=0;j<5;j++){const a=j*2.4+i;dummy.position.set(tree.x+Math.sin(a)*7,ground+tree.h*.72+(j%3)*5,tree.z+Math.cos(a)*7);dummy.scale.set(12+j%3,15+j%2*3,12+j%2*3);dummy.rotation.set(i*.2,j*.8,i*.3);dummy.updateMatrix();crowns.setMatrixAt(i*5+j,dummy.matrix);crowns.setColorAt(i*5+j,new T.Color().setHSL(.23+(i%5)*.008,.19+(j%3)*.04,.27+(i%4)*.025))}
 });
 trunks.instanceMatrix.needsUpdate=true;crowns.instanceMatrix.needsUpdate=true;crowns.instanceColor.needsUpdate=true;trunks.castShadow=true;crowns.castShadow=true;group.add(trunks,crowns);
 // Traditional park lamps establish human scale along the promenade.
 const lampGlass=new T.MeshStandardMaterial({color:'#f7e8bd',emissive:'#edca84',emissiveIntensity:.4,roughness:.4});
 for(const x of[-31,31])for(const z of[-105,-38,46,120]){add(new T.CylinderGeometry(.26,.45,48,8),materials.iron,x,ground+24,z);add(new T.CylinderGeometry(1.5,1.15,3.8,6),lampGlass,x,ground+49,z);add(new T.ConeGeometry(2,1.5,6),materials.iron,x,ground+51.6,z);}
 // A quiet city edge beyond the trees, rather than a backdrop at chess-piece scale.
 const city=new T.MeshStandardMaterial({color:'#89968d',roughness:1});
 for(let i=0;i<22;i++){const h=45+(i*19%65);box(12+i%3*5,h,16,city,-230+i*22,ground+h/2,-245-Math.sin(i)*10)}
 group.userData={table,plaza,materials,leaves,lampGlass};return group;
}
