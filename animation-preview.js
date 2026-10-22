import { Battlefield } from './battlefield.js?v=20261021-options-1';
import { animationOptions } from './animation-options.js';
const status=document.getElementById('status'),params=new URLSearchParams(location.search);
try{
 const battlefield=new Battlefield(document.getElementById('preview'),()=>{});
 const b=Array(64).fill(null);b[36]='wp';b[29]='bp';
 const game={b,turn:'w',legal:()=>[],check:()=>false};
 battlefield.sync(game,-1,false,null);
 battlefield.fitBoard=()=>{battlefield.target.set(1,.4,0);battlefield.distance=5;battlefield.cameraUpdate()};battlefield.fitBoard();
 const style=animationOptions.find(o=>o.id===params.get('style'))?.id||'glide';
 const speed=['full','fast','skip'].includes(params.get('speed'))?params.get('speed'):'full';
 await new Promise(resolve=>setTimeout(resolve,450));
 await battlefield.animate(game,{f:36,t:29},speed,label=>status.textContent=label,style);
 b[36]=null;b[29]='wp';battlefield.sync(game,-1,false,null);
 status.textContent=(matchMedia('(prefers-reduced-motion: reduce)').matches?'Reduced motion enabled. ':'')+'Preview complete · Use Preview / replay to compare again.';
}catch(error){status.textContent='3D preview unavailable in this browser.';console.error(error)}
