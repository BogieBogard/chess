import { Battlefield } from './battlefield.js?v=20261022-staged-1';
import { animationOptions } from './animation-options.js?v=20261022-staged-1';
const status=document.getElementById('status'),params=new URLSearchParams(location.search);
try{
 const battlefield=new Battlefield(document.getElementById('preview'),()=>{});
 const b=Array(64).fill(null);const attacker=['p','n','r','b','q','k'].includes(params.get('attacker'))?params.get('attacker'):'p';const defender=['p','n','r','b','q','k'].includes(params.get('defender'))?params.get('defender'):'p';b[36]='w'+attacker;b[29]='b'+defender;
 const game={b,turn:'w',legal:()=>[],check:()=>false};
 battlefield.sync(game,-1,false,null);
 battlefield.fitBoard=()=>{battlefield.target.set(1,.7,0);battlefield.distance=6;battlefield.cameraUpdate()};battlefield.fitBoard();
 const style=animationOptions.find(o=>o.id===params.get('style'))?.id||'glide';
 const speed=['full','fast','skip'].includes(params.get('speed'))?params.get('speed'):'full';
 const pause=document.getElementById('pausePreview');pause.disabled=false;pause.onclick=()=>{battlefield.paused=!battlefield.paused;pause.textContent=battlefield.paused?'Resume':'Pause'};document.getElementById('replayPreview').onclick=()=>location.reload();
 await new Promise(resolve=>setTimeout(resolve,450));
 await battlefield.animate(game,{f:36,t:29},speed,label=>status.textContent=label,style);
 b[36]=null;b[29]='w'+attacker;battlefield.sync(game,-1,false,null);
 pause.disabled=true;pause.textContent='Complete';
 status.textContent=(matchMedia('(prefers-reduced-motion: reduce)').matches?'Reduced motion enabled. ':'')+'Preview complete · Use Preview / replay to compare again.';
}catch(error){status.textContent='3D preview unavailable in this browser.';console.error(error)}
