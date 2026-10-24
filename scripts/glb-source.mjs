import fs from 'node:fs';
import * as T from '../vendor/three.module.min.js';
export function readGlb(path){
 const bytes=fs.readFileSync(path);if(bytes.readUInt32LE(0)!==0x46546c67||bytes.readUInt32LE(4)!==2)throw Error('Expected GLB 2');
 const jsonLength=bytes.readUInt32LE(12),json=JSON.parse(bytes.subarray(20,20+jsonLength).toString()),binary=20+jsonLength+8;
 function accessor(id){const a=json.accessors[id];if(a.sparse)throw Error('Sparse accessor unsupported');const v=json.bufferViews[a.bufferView],width={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT4:16}[a.type],size={5126:4,5125:4,5123:2,5121:1}[a.componentType],read={5126:'readFloatLE',5125:'readUInt32LE',5123:'readUInt16LE',5121:'readUInt8'}[a.componentType];if(!read||!width)throw Error('Unsupported accessor');const out=[];for(let j=0;j<a.count;j++)for(let k=0;k<width;k++)out.push(bytes[read](binary+(v.byteOffset||0)+(a.byteOffset||0)+j*(v.byteStride||width*size)+k*size));return out}
 const worlds=new Map();function visit(id,parent=new T.Matrix4()){const n=json.nodes[id],local=n.matrix?new T.Matrix4().fromArray(n.matrix):new T.Matrix4().compose(new T.Vector3(...(n.translation||[0,0,0])),new T.Quaternion(...(n.rotation||[0,0,0,1])),new T.Vector3(...(n.scale||[1,1,1]))),world=parent.clone().multiply(local);if(n.mesh!==undefined)worlds.set(n.mesh,world);for(const child of n.children||[])visit(child,world)}for(const root of json.scenes[json.scene||0].nodes)visit(root);
 function geometry(id){const p=json.meshes[id].primitives[0],g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(accessor(p.attributes.POSITION),3));if(p.attributes.NORMAL!==undefined)g.setAttribute('normal',new T.Float32BufferAttribute(accessor(p.attributes.NORMAL),3));g.setIndex(accessor(p.indices));g.applyMatrix4(worlds.get(id));if(!g.attributes.normal)g.computeVertexNormals();g.computeBoundingBox();return g}
 return {json,accessor,geometry,bytes};
}
