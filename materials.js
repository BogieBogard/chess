import * as T from './vendor/three.module.min.js';
function noise(x,y){const v=Math.sin(x*127.1+y*311.7)*43758.5453;return v-Math.floor(v)}
function field(x,y){let ix=Math.floor(x),iy=Math.floor(y),u=x-ix,v=y-iy;u=u*u*(3-2*u);v=v*v*(3-2*v);return T.MathUtils.lerp(T.MathUtils.lerp(noise(ix,iy),noise(ix+1,iy),u),T.MathUtils.lerp(noise(ix,iy+1),noise(ix+1,iy+1),u),v)}
export function surfaceTexture(base,kind='stone'){
 const size=256,data=new Uint8Array(size*size*4),color=new T.Color(base).convertLinearToSRGB();
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){let n=field(x/32,y/32),f=field(x/7,y/7),grain=noise(x,y);let vein=Math.pow(Math.max(0,1-Math.abs(Math.sin(x*.032+y*.017+n*5+field(x/70,y/70)*6))),12);let shade=kind==='wood'?.75+.18*Math.sin(x*.15+n*6)+.06*grain:1-.16*vein+(f-.5)*.08+(grain-.5)*.05;let i=(y*size+x)*4;data[i]=Math.min(255,color.r*shade*255);data[i+1]=Math.min(255,color.g*shade*255);data[i+2]=Math.min(255,color.b*shade*255);data[i+3]=255}
 const texture=new T.DataTexture(data,size,size);texture.colorSpace=T.SRGBColorSpace;texture.wrapS=texture.wrapT=T.RepeatWrapping;texture.magFilter=T.LinearFilter;texture.minFilter=T.LinearMipmapLinearFilter;texture.generateMipmaps=true;texture.needsUpdate=true;return texture;
}
export function createMaterials(renderer,scene){
 const studio=new T.Scene();studio.background=new T.Color('#626871');
 const cards=[['#fff2da',[-5,6,3],[5,5,1]],['#bdddfb',[5,4,-5],[5,6,1]],['#fff5e0',[0,9,0],[7,1,7]]];
 for(let[c,p,s]of cards){let m=new T.Mesh(new T.BoxGeometry(...s),new T.MeshBasicMaterial({color:c}));m.position.set(...p);studio.add(m)}
 const pmrem=new T.PMREMGenerator(renderer),environment=pmrem.fromScene(studio,.03);scene.environment=environment.texture;scene.environmentIntensity=.65;pmrem.dispose();studio.traverse(o=>{o.geometry?.dispose();o.material?.dispose()});
 const stone=color=>new T.MeshPhysicalMaterial({map:surfaceTexture(color),color:'#ffffff',roughness:.34,metalness:.12,clearcoat:.28,clearcoatRoughness:.25});
 const trim=new T.MeshStandardMaterial({color:'#bd985a',metalness:.82,roughness:.27});
 const palettes={};for(let s of['w','b'])palettes[s]={armor:stone(s==='w'?'#dfd8be':'#344752'),trim,
 cloth:new T.MeshStandardMaterial({map:surfaceTexture(s==='w'?'#245362':'#602837'),roughness:.8,side:T.DoubleSide}),
 dark:new T.MeshStandardMaterial({color:'#17242a',roughness:.51,metalness:.3}),blade:new T.MeshStandardMaterial({color:'#d0e0e7',metalness:.9,roughness:.2}),
 gem:new T.MeshPhysicalMaterial({color:s==='w'?'#4cb5d1':'#c15a4b',metalness:.45,roughness:.16,clearcoat:1})};
 return {palettes,lightTile:stone('#bdb6a0'),darkTile:stone('#344a50'),wood:new T.MeshStandardMaterial({map:surfaceTexture('#332820','wood'),roughness:.35,metalness:.12}),trim,edge:stone('#202a2f'),environment};
}
