import fs from 'node:fs';
import {Vector3} from '../vendor/three.module.min.js';
import path from 'node:path';
import {readGlb} from './glb-source.mjs';
const source=readGlb(process.argv[2]),out=process.argv[3]||'assets/plated';
if(!source.json.asset.extras.source.includes('24fd61c662414344bcb81ddc62fd1e3b')||!source.json.asset.extras.license.startsWith('CC-BY-4.0'))throw Error('Unexpected source/license');
fs.mkdirSync(out,{recursive:true});
const chunks=[],meshes=[];let offset=0;
function pack(array){while(offset%4){chunks.push(Buffer.alloc(1));offset++}const start=offset,b=Buffer.from(array.buffer,array.byteOffset,array.byteLength);chunks.push(b);offset+=b.length;return start}
const feet=source.geometry(0).boundingBox,center=feet.getCenter(new Vector3()),scale=1.43/(source.geometry(5).boundingBox.max.y-feet.min.y);
for(let id=0;id<8;id++){
 const g=source.geometry(id),p=g.attributes.position,n=g.attributes.normal,uv=g.attributes.uv;
 for(let i=0;i<p.count;i++)p.setXYZ(i,(p.getX(i)-center.x)*scale,Math.max(.075,(p.getY(i)-feet.min.y)*scale+.075),(p.getZ(i)-center.z)*scale);
 const normals=Int8Array.from(n.array,v=>Math.round(Math.max(-1,Math.min(1,v))*127));
 meshes.push({vertices:p.count,positions:pack(p.array),normals:pack(normals),uv:pack(uv.array),indices:pack(Uint32Array.from(g.index.array)),indexCount:g.index.count,material:source.json.meshes[id].primitives[0].material});
}
const binary=20+source.bytes.readUInt32LE(12)+8;
for(let i=0;i<24;i++){const img=source.json.images[i],v=source.json.bufferViews[img.bufferView];fs.writeFileSync(path.join(out,`source-${i}.${img.mimeType==='image/png'?'png':'jpg'}`),source.bytes.subarray(binary+(v.byteOffset||0),binary+(v.byteOffset||0)+v.byteLength))}
fs.writeFileSync(path.join(out,'pawn.bin'),Buffer.concat(chunks));
fs.writeFileSync(path.join(out,'pawn.json'),JSON.stringify({version:1,source:source.json.asset.extras,meshes,materials:source.json.materials.slice(0,8),textures:source.json.textures.slice(0,24).map(t=>t.source)},null,2));
console.log({geometryBytes:offset,meshes:meshes.length,triangles:meshes.reduce((sum,m)=>sum+m.indexCount/3,0)});
