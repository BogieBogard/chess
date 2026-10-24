// Front-to-back ordering in screen space; only overlapping circles form depth layers.
export function iconDepth(points){
 const ordered=points.filter(p=>!p.hidden).map(p=>({...p,layer:0})).sort((a,b)=>a.depth-b.depth);
 for(let i=0;i<ordered.length;i++){
  const rear=ordered[i];
  for(let j=0;j<i;j++){
   const front=ordered[j],radius=(front.size+rear.size)/2;
   if((rear.x-front.x)**2+(rear.y-front.y)**2<radius*radius)rear.layer=Math.min(3,Math.max(rear.layer,front.layer+1));
  }
  rear.order=ordered.length-i;
 }
 return ordered;
}
