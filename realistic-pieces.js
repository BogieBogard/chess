import * as T from './vendor/three.module.min.js';
let pending;
export function decodeRealisticPieces(metadata,buffer){
 if(metadata.version!==1)throw Error('Unknown piece format');
 const geometries={};
 for(const [type,m]of Object.entries(metadata.pieces)){
  const packed=new Uint16Array(buffer,m.positions,m.vertices*3),positions=new Float32Array(packed.length);
  for(let i=0;i<positions.length;i++){const axis=i%3;positions[i]=m.min[axis]+packed[i]/65535*(m.max[axis]-m.min[axis])}
  const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.BufferAttribute(positions,3));geometry.setAttribute('normal',new T.BufferAttribute(new Int8Array(buffer,m.normals,m.vertices*3),3,true));geometry.setIndex(new T.BufferAttribute(new Uint16Array(buffer,m.indices,m.indexCount),1));geometry.computeBoundingBox();geometry.computeBoundingSphere();geometries[type]=geometry;
 }
 const palettes=metadata.materials.map(source=>{const p=source.pbrMetallicRoughness;return new T.MeshStandardMaterial({color:new T.Color().setRGB(...p.baseColorFactor.slice(0,3)),metalness:p.metallicFactor,roughness:p.roughnessFactor})});
 function piece(code){if(!geometries[code[1]])throw Error('Unknown chess piece');const root=new T.Group(),mesh=new T.Mesh(geometries[code[1]],palettes[code[0]==='w'?1:0]);mesh.castShadow=mesh.receiveShadow=true;root.add(mesh);root.rotation.y=code[0]==='w'?0:Math.PI;root.userData={code,modelSet:'realistic'};return root}
 return {piece,geometries,palettes,metadata};
}
export async function loadRealisticPieces(){
 if(!pending)pending=Promise.all([fetch(new URL('./assets/realistic/pieces.json',import.meta.url)),fetch(new URL('./assets/realistic/pieces.bin',import.meta.url))]).then(async([meta,data])=>{if(!meta.ok||!data.ok)throw Error('Could not load realistic pieces');return decodeRealisticPieces(await meta.json(),await data.arrayBuffer())}).catch(error=>{pending=null;throw error});
 return pending;
}
