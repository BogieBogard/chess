import * as T from './vendor/three.module.min.js';
import {warrior} from './pieces.js';
let pending;
export function decodePlatedPawns(metadata,buffer,textures=[]){
 if(metadata.version!==1)throw Error('Unknown pawn format');
 const geometries=metadata.meshes.map(m=>{const g=new T.BufferGeometry();g.setAttribute('position',new T.BufferAttribute(new Float32Array(buffer,m.positions,m.vertices*3),3));g.setAttribute('normal',new T.BufferAttribute(new Int8Array(buffer,m.normals,m.vertices*3),3,true));g.setAttribute('uv',new T.BufferAttribute(new Float32Array(buffer,m.uv,m.vertices*2),2));g.setIndex(new T.BufferAttribute(new Uint32Array(buffer,m.indices,m.indexCount),1));g.computeBoundingBox();g.computeBoundingSphere();return g});
 const palettes=['w','b'].map(side=>metadata.materials.map(source=>{const p=source.pbrMetallicRoughness,material=new T.MeshStandardMaterial({color:new T.Color().setRGB(...(p.baseColorFactor||[1,1,1]).slice(0,3)),metalness:p.metallicFactor??1,roughness:p.roughnessFactor??1,side:source.doubleSided?T.DoubleSide:T.FrontSide});
  if(side==='b')material.color.multiply(new T.Color('#7d91aa'));
  const texture=info=>info?textures[metadata.textures[info.index]]:null;
  material.map=texture(p.baseColorTexture);material.metalnessMap=material.roughnessMap=texture(p.metallicRoughnessTexture);material.normalMap=texture(source.normalTexture);material.aoMap=texture(source.occlusionTexture);material.aoMapIntensity=source.occlusionTexture?.strength??1;return material}));
 const baseGeometry=new T.CylinderGeometry(.29,.31,.075,24),bases=[new T.MeshStandardMaterial({color:'#ded3b8',metalness:.3,roughness:.5}),new T.MeshStandardMaterial({color:'#243c50',metalness:.3,roughness:.5})];
 function piece(code){if(code[1]!=='p')return warrior(code);const root=new T.Group(),side=code[0]==='w'?0:1;for(let i=0;i<geometries.length;i++){const mesh=new T.Mesh(geometries[i],palettes[side][metadata.meshes[i].material]);mesh.castShadow=mesh.receiveShadow=true;root.add(mesh)}const base=new T.Mesh(baseGeometry,bases[side]);base.position.y=.0375;base.castShadow=base.receiveShadow=true;root.add(base);root.rotation.y=code[0]==='w'?Math.PI:0;root.userData={code,modelSet:'plated'};return root}
 return {piece,geometries,palettes,metadata};
}
export async function loadPlatedPawns(){
 if(!pending)pending=(async()=>{const [meta,data]=await Promise.all([fetch(new URL('./assets/plated/pawn.json',import.meta.url)),fetch(new URL('./assets/plated/pawn.bin',import.meta.url))]);if(!meta.ok||!data.ok)throw Error('Could not load plated pawns');const metadata=await meta.json(),buffer=await data.arrayBuffer(),loader=new T.TextureLoader(),textures=await Promise.all(metadata.textures.map((image,index)=>loader.loadAsync(new URL(`./assets/plated/texture-${image}.webp`,import.meta.url).href).then(texture=>{texture.flipY=false;texture.wrapS=texture.wrapT=T.RepeatWrapping;texture.colorSpace=index%3===0?T.SRGBColorSpace:T.NoColorSpace;return texture})));return decodePlatedPawns(metadata,buffer,textures)})().catch(error=>{pending=null;throw error});
 return pending;
}
