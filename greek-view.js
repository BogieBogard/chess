import {GreekState,greekCode} from './greek-state.js';
import {iconDepth} from './icon-depth.js';
const model='10b53b9575294dfb915f8c0b5ea0a2fc',symbols={p:'♟',n:'♞',b:'♝',r:'♜',q:'♛',k:'♚'},names={p:'Pawn',n:'Knight',b:'Bishop',r:'Rook',q:'Queen',k:'King'},squareName=i=>'abcdefgh'[i%8]+(8-(i>>3));
let sdk;
function loadSDK(){if(window.Sketchfab)return Promise.resolve();if(!sdk)sdk=new Promise((resolve,reject)=>{const script=document.createElement('script');script.src='https://static.sketchfab.com/api/sketchfab-viewer-1.12.1.js';script.onload=resolve;script.onerror=()=>{script.remove();sdk=null;reject(Error('Sketchfab viewer unavailable'))};document.head.append(script)});return sdk}
export class GreekView {
 constructor(host,onSquare){
  this.host=host;this.onSquare=onSquare;this.active=false;this.paused=false;this.icons=true;this.flip=false;this.generation=0;this.sequence=Promise.resolve();this.cameraMoving=false;
  this.root=document.createElement('div');this.root.className='greek-view';this.root.style.visibility='visible';this.root.style.pointerEvents='none';
  this.frame=document.createElement('iframe');this.frame.id='greekViewer';this.frame.setAttribute('execution-while-out-of-viewport','');this.frame.setAttribute('execution-while-not-rendered','');this.frame.title='Greek Mythology chess by ahingel on Sketchfab';this.frame.allow='autoplay; fullscreen';this.frame.setAttribute('allowfullscreen','');this.root.append(this.frame);
  this.layer=document.createElement('div');this.layer.className='greek-overlay';this.root.append(this.layer);
  const credit=document.createElement('a');credit.className='greek-credit';credit.href='https://sketchfab.com/3d-models/chess-set-greek-mythology-pieces-'+model;credit.target='_blank';credit.rel='noopener noreferrer';credit.textContent='Greek Mythology · ahingel / Sketchfab ↗';this.root.append(credit);
  this.notice=document.createElement('span');this.notice.className='greek-notice';this.notice.setAttribute('role','status');this.root.append(this.notice);host.append(this.root);
  this.observer=new ResizeObserver(()=>{clearTimeout(this.resizeTimer);this.resizeTimer=setTimeout(()=>{if(this.active)this.setView(this.angle||0,this.elevation||1.49).catch(e=>this.error(e))},200)});this.observer.observe(host);
  this.ready=this.initialize();
 }
 call(method,...args){return new Promise((resolve,reject)=>{const timeout=setTimeout(()=>reject(Error('Sketchfab did not respond')),8000);this.api[method](...args,(error,result)=>{clearTimeout(timeout);error?reject(Error('Sketchfab '+method+' failed')):resolve(result)})})}
 async initialize(){
  await loadSDK();
  await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('Sketchfab loading timed out')),45000);new window.Sketchfab(this.frame).init(model,{autostart:1,preload:1,camera:0,ui_infos:0,ui_controls:0,ui_stop:0,ui_hint:0,success:api=>{this.api=api;api.addEventListener('viewerready',()=>{clearTimeout(timer);resolve()});api.start()},error:()=>{clearTimeout(timer);reject(Error('Greek viewer could not load'))}})});
  const map=await this.call('getNodeMap');this.nodes=Object.values(map);const pieces=await Promise.all(this.nodes.filter(n=>n.type==='MatrixTransform'&&greekCode(n.name)).map(async n=>{const m=await this.call('getMatrix',n.instanceID);return {id:n.instanceID,name:n.name,local:m.local.slice(),world:Array.from({length:16},(_,i)=>m.world[i])}}));this.state=new GreekState(pieces);
  this.nodePiece=new Map();const byId=new Map(this.nodes.map(n=>[n.instanceID,n]));
  const descendants=(id,piece,seen=new Set())=>{if(seen.has(id))return;seen.add(id);this.nodePiece.set(id,piece);for(const child of byId.get(id)?.children||[])descendants(typeof child==='number'?child:child.instanceID,piece,seen)};for(const piece of this.state.pieces)descendants(piece.id,piece);
  this.api.addEventListener('click',info=>{if(!this.active||this.paused||this.animating||this.synchronizing)return;const piece=this.nodePiece.get(info.instanceID),unit=piece&&[...this.state.units].find(([,u])=>u.piece.id===piece.id);const square=unit?.[0]??this.state.squareAtWorld(info.position3D);if(square!==null)this.onSquare(square)},{pick:'slow'});
  this.api.addEventListener('camerastart',()=>{this.cameraMoving=true;this.layer.style.visibility='hidden'});
  this.api.addEventListener('camerastop',()=>{this.cameraMoving=false;clearTimeout(this.projectTimer);this.projectTimer=setTimeout(()=>this.project().catch(e=>this.error(e)),100)});
  await this.setView(0,1.49);return this;
 }
 error(error){this.notice.textContent='Viewer connection interrupted. Choose another set to continue.';console.warn('Greek viewer',error)}
 dispose(){this.active=false;this.observer.disconnect();clearTimeout(this.resizeTimer);clearTimeout(this.projectTimer);this.root.remove()}
 setActive(active){this.active=active;this.root.style.visibility=active?'visible':'hidden';this.root.style.pointerEvents=active?'auto':'none';if(!active){this.api?.stop();this.layer.replaceChildren()}else{this.api.start();this.project().catch(e=>this.error(e))}}
 setPieceIcons(enabled){this.icons=enabled;this.project().catch(e=>this.error(e))}
 setIconSide(side){this.iconSide=side}
 setEnvironment(){} // The embed retains its creator's scene; native environment preferences are preserved.
 setGraphics(){} // Texture quality is controlled by the hosted model.
 sync(game,selected,flipped){
  this.board=game.b.slice();this.selected=selected;this.legal=selected<0?[]:[...new Set(game.legal().filter(m=>m.f===selected).map(m=>m.t))];if(this.flip!==flipped){this.flip=flipped;this.setView(this.angle||0,this.elevation||1.49).catch(e=>this.error(e))}
  const board=this.board.slice();this.synchronizing=true;
  this.sequence=this.sequence.catch(()=>{}).then(async()=>{const units=this.state.reconcile(board),visible=new Set([...units.values()].map(u=>u.piece.id));await Promise.all(this.state.pieces.map(p=>this.call(visible.has(p.id)?'show':'hide',p.id)));await Promise.all([...units].map(([square,u])=>this.call('setMatrix',u.piece.id,this.state.matrix(u.piece,square))));this.root.dataset.position=board.map(p=>p||'--').join('');this.notice.textContent=[...units.values()].some(u=>u.proxy)?'Promoted pieces carry their new role badge.':'';this.synchronizing=false;await this.project()}).catch(e=>{this.synchronizing=false;this.error(e)});
 }
 async project(){
  if(!this.active||!this.state||!this.board||this.animating||this.cameraMoving)return;
  const generation=++this.generation,entries=[];
  for(let square=0;square<64;square++){const code=this.board[square],unit=this.state.units.get(square),legal=this.legal?.includes(square);if(legal||square===this.selected||code&&(this.icons||unit?.proxy))entries.push({square,code,legal,proxy:unit?.proxy})}
  const points=await Promise.all(entries.map(entry=>new Promise(resolve=>{const timer=setTimeout(()=>resolve(null),3000);this.api.getWorldToScreenCoordinates(this.state.worldSquare(entry.square,.1),coord=>{clearTimeout(timer);const p=coord?.canvasCoord;resolve(p?{...entry,x:p[0],y:p[1]}:null)})})));
  if(generation!==this.generation||!this.active||this.animating||this.cameraMoving)return;
  const w=this.host.clientWidth,h=this.host.clientHeight,size=Math.max(22,Math.min(36,w/13));this.layer.replaceChildren();
  const icons=[];
  for(const p of points.filter(Boolean)){if(p.x<0||p.y<0||p.x>w||p.y>h)continue;const button=document.createElement('button');button.dataset.square=p.square;button.type='button';button.className='greek-square '+(p.legal?'legal ':'')+(p.square===this.selected?'selected ':'')+(p.code?(p.code[0]==='w'?'ivory':'obsidian'):'');button.style.left=p.x+'px';button.style.top=p.y+'px';button.style.width=button.style.height=size+'px';button.style.fontSize=size*.66+'px';button.textContent=p.code?symbols[p.code[1]]:'•';button.setAttribute('aria-label',p.legal?'Move to '+squareName(p.square):(p.code[0]==='w'?'White ':'Black ')+names[p.code[1]]+' on '+squareName(p.square)+(p.proxy?' · promoted':''));button.onclick=()=>{if(!this.paused&&!this.animating&&!this.synchronizing)this.onSquare(p.square)};this.layer.append(button);if(p.code)icons.push({...p,icon:button,size,depth:0,hidden:false,shadeEligible:!this.iconSide||p.code[0]===this.iconSide})}
  // Screen projection has no depth field; camera distance determines nearest symbols.
  if(icons.length){const camera=await this.call('getCameraLookAt');for(const p of icons){const world=this.state.worldSquare(p.square);p.depth=Math.hypot(...world.map((v,i)=>v-camera.position[i]))}for(const {icon,layer,order} of iconDepth(icons)){icon.style.filter=`brightness(${[1,.84,.70,.58][layer]}) saturate(${[1,.65,.35,.15][layer]})`;icon.style.zIndex=order}}
  this.layer.style.visibility='visible';
 }
 async setView(angle,elevation){this.angle=angle;this.elevation=elevation;if(!this.api||!this.state)return;const width=this.host.clientWidth,height=this.host.clientHeight,aspect=width/Math.max(1,height),distance=Math.max(25,25/Math.min(1,aspect))*.9,theta=angle+(this.flip?Math.PI:0),target=[0,-(this.state.minZ+3.5*this.state.stepZ),.1],position=[target[0]+Math.sin(theta)*Math.cos(elevation)*distance,target[1]-Math.cos(theta)*Math.cos(elevation)*distance,target[2]+Math.sin(elevation)*distance];await this.call('setCameraLookAt',position,target,0);await new Promise(r=>setTimeout(r,120));await this.project()}
 async zoom(ratio){const camera=await this.call('getCameraLookAt');await this.call('setCameraLookAt',camera.position.map((v,i)=>camera.target[i]+(v-camera.target[i])*ratio),camera.target,0);await new Promise(r=>setTimeout(r,120));await this.project()}
 async slide(unit,from,to,duration){const start=performance.now();let elapsed=0,previous=start;while(elapsed<duration){await new Promise(r=>setTimeout(r,30));const now=performance.now();if(!this.paused)elapsed+=now-previous;previous=now;const t=Math.min(1,elapsed/duration),u=t*t*(3-2*t),a=this.state.matrix(unit.piece,from),b=this.state.matrix(unit.piece,to);a[12]+=(b[12]-a[12])*u;a[14]+=(b[14]-a[14])*u;await this.call('setMatrix',unit.piece.id,a)}}
 async animate(game,move,speed,onEvent,style){await this.sequence;const instant=speed==='skip'||style==='instant'||matchMedia('(prefers-reduced-motion:reduce)').matches;if(instant)return;this.animating=true;this.layer.style.visibility='hidden';try{const unit=this.state.units.get(move.f),vi=move.ep?move.t+(game.turn==='w'?8:-8):move.t,victim=this.state.units.get(vi);if(victim)await this.call('hide',victim.piece.id);if(unit){onEvent('Move');await this.slide(unit,move.f,move.t,speed==='fast'?180:340)}if(move.castle){const rf=move.t>move.f?move.f+3:move.f-4,rook=this.state.units.get(rf);if(rook)await this.slide(rook,rf,(move.f+move.t)/2,180)}}finally{this.animating=false}}
}
