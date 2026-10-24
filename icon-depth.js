// Fraction of the rear circular badge covered by a single foreground badge.
export function coveredFraction(rear,front){
 const r=rear.size/2,s=front.size/2,d=Math.hypot(rear.x-front.x,rear.y-front.y);
 if(d>=r+s)return 0;
 if(d<=Math.abs(r-s))return Math.min(r,s)**2/r**2;
 const clamp=x=>Math.max(-1,Math.min(1,x));
 const area=r*r*Math.acos(clamp((d*d+r*r-s*s)/(2*d*r)))+s*s*Math.acos(clamp((d*d+s*s-r*r)/(2*d*s)))-.5*Math.sqrt(Math.max(0,(-d+r+s)*(d+r-s)*(d-r+s)*(d+r+s)));
 return area/(Math.PI*r*r);
}
// Front-to-back ordering in screen space; only overlapping circles form depth layers.
export function iconDepth(points){
 const ordered=points.filter(p=>!p.hidden).map(p=>({...p,layer:0})).sort((a,b)=>a.depth-b.depth);
 for(let i=0;i<ordered.length;i++){
  const rear=ordered[i];
  for(let j=0;j<i;j++){
   const front=ordered[j];
   if(rear.shadeEligible!==false&&front.depth<rear.depth&&coveredFraction(rear,front)>=.7)rear.layer=Math.min(3,Math.max(rear.layer,front.layer+1));
  }
  rear.order=ordered.length-i;
 }
 return ordered;
}
