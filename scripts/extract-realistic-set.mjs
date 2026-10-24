import fs from 'node:fs';
import * as T from '../vendor/three.module.min.js';
import {readGlb} from './glb-source.mjs';
const source=readGlb(process.argv[2]),asset=source.json.asset.extras;
if(asset.license?.split(' ')[0]!=='CC-BY-4.0'||!asset.source?.endsWith('4f5a651ec0c7405badbcf478ed1cab8f'))throw Error('Unexpected source/license');
const meshIds={p:19,n:31,b:28,r:27,q:29,k:30},king=source.geometry(meshIds.k),scale=1.75/king.boundingBox.getSize(new T.Vector3()).y;
const chunks=[],metadata={version:1,source:asset,scale,materials:source.json.materials.slice(0,2),pieces:{}};let offset=0;
function append(array){if(offset%2){chunks.push(Buffer.alloc(1));offset++}const start=offset,b=Buffer.from(array.buffer,array.byteOffset,array.byteLength);chunks.push(b);offset+=b.length;return start}
for(const [type,id]of Object.entries(meshIds)){
 const g=source.geometry(id),center=g.boundingBox.getCenter(new T.Vector3());g.translate(-center.x,-g.boundingBox.min.y,-center.z);g.scale(scale,scale,scale);g.translate(0,.075,0);g.computeBoundingBox();
 const p=g.attributes.position,n=g.attributes.normal,min=g.boundingBox.min.toArray(),max=g.boundingBox.max.toArray(),positions=new Uint16Array(p.count*3),normals=new Int8Array(p.count*3),indices=new Uint16Array(g.index.array);
 for(let i=0;i<p.count;i++)for(let axis=0;axis<3;axis++){positions[i*3+axis]=Math.round((p.array[i*3+axis]-min[axis])/(max[axis]-min[axis])*65535);normals[i*3+axis]=Math.round(Math.max(-1,Math.min(1,n.array[i*3+axis]))*127)}
 metadata.pieces[type]={sourceMesh:id,vertices:p.count,triangles:indices.length/3,min,max,positions:append(positions),normals:append(normals),indices:append(indices),indexCount:indices.length};g.dispose();
}
fs.mkdirSync('assets/realistic',{recursive:true});fs.writeFileSync('assets/realistic/pieces.bin',Buffer.concat(chunks));fs.writeFileSync('assets/realistic/pieces.json',JSON.stringify(metadata));
console.log(JSON.stringify({sourceMB:source.bytes.length/1e6,extractedMB:offset/1e6,pieces:metadata.pieces},null,2));
