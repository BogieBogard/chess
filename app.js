import { appearanceOptions, loadAppearance, saveAppearance, rateAppearance } from './appearance-options.js';

import { Battlefield } from './battlefield.js?v=20261024-icons-1';
import Chess from './rules.js';
import { animationOptions, loadPreferences, savePreferences } from './animation-options.js?v=20261022-staged-1';
// UI and chess turn flow are independent of the 3D renderer.
const $=id=>document.getElementById(id),names={p:'Pawn',r:'Siege tower',b:'Battle-priest',n:'Mounted knight',q:'Queen',k:'King'};
function figure(p){return `<span style="font-size:36px">${{q:'♛',r:'♜',b:'♝',n:'♞'}[p[1]]}</span><span style="display:block;font-size:10px">${names[p[1]]}</span>`}
let game=new Chess(),history=[],notation=[],taken=[],selected=-1,flipped=false,busy=false,ended=null,mode='ai',level='medium',setupMode='ai',setupLevel='medium',human='w',choiceColor='w',rotating=false,mute=false,speed='full',worker=null,job=0,paused=false,pendingAi=null;
const board=$('board');
let battlefield;
try{battlefield=new Battlefield(board,i=>tap(i))}catch(error){board.innerHTML='<p class="scene-error">3D rendering is unavailable. Enable WebGL or try a current browser. Keyboard board controls remain available below.</p>';console.error(error);$('boardAccess').classList.remove('board-access')}
$('viewBattle').onclick=()=>battlefield?.setView(.3,.83);
$('viewTop').onclick=()=>battlefield?.setView(0,1.49);
let pieceIcons=true;try{pieceIcons=localStorage.getItem('iron-ivory-piece-icons-v1')!=='false'}catch{}
function updateIconToggle(){battlefield?.setPieceIcons(pieceIcons);$('pieceIcons').setAttribute('aria-pressed',String(pieceIcons));$('pieceIcons').title=pieceIcons?'Hide piece icons':'Show piece icons'}
$('pieceIcons').onclick=()=>{pieceIcons=!pieceIcons;updateIconToggle();try{localStorage.setItem('iron-ivory-piece-icons-v1',String(pieceIcons))}catch{}};updateIconToggle();
for(let [id,ratio] of [['zoomIn',.85],['zoomOut',1/.85]])$(id).onclick=()=>battlefield?.zoom(ratio);
for(let [id,delta] of [['viewLeft',-.35],['viewRight',.35]])$(id).onclick=()=>battlefield?.rotate(delta);
function render(){const available=selected<0?[]:game.legal().filter(m=>m.f===selected),destinations=[...new Set(available.map(m=>m.t))],squareName=i=>'abcdefgh'[i%8]+(8-(i>>3));let last=history.length?history.at(-1).move:null;battlefield?.sync(game,selected,flipped,last);const access=$('boardAccess'),focusSquare=document.activeElement?.dataset.square;access.innerHTML='';for(let d=0;d<64;d++){let i=flipped?63-d:d,b=document.createElement('button');b.textContent='abcdefgh'[i%8]+(8-(i>>3))+(game.b[i]?' '+(game.b[i][0]==='w'?'White ':'Black ')+names[game.b[i][1]]:' empty');if(destinations.includes(i))b.textContent+=' · legal destination';b.dataset.square=i;b.setAttribute('role','gridcell');b.setAttribute('aria-selected',String(selected===i));b.onclick=()=>tap(i);access.append(b)}if(focusSquare!==undefined)access.querySelector(`[data-square="${focusSquare}"]`)?.focus({preventScroll:true});let turn=game.turn==='w'?'White':'Black';$('status').textContent=ended||turn+' to move'+(game.check()?' · Check':'');$('hudStatus').textContent=$('status').textContent;if(!busy)$('duelState').textContent=selected>=0?names[game.b[selected][1]]+' · '+(destinations.length?destinations.slice(0,6).map(squareName).join(' · ')+(destinations.length>6?' · +'+(destinations.length-6)+' more':''):'No legal moves'):'Drag to orbit · Pinch to zoom · Tap to move';$('statusSub').textContent=selected>=0?names[game.b[selected][1]]+' legal moves: '+(destinations.map(squareName).join(', ')||'none')+'.':ended?'The battlefield is yours to review.':busy?'Your opponent is considering the battlefield…':game.check()?'Your king is under attack.':mode==='ai'&&game.turn!==human?'The Order is planning its next move.':'Select a warrior to see its legal moves.';$('turnDot').style.background=game.turn==='w'?'#e2ddc9':'#6b7e70';$('modeTag').textContent=mode==='ai'?'VS COMPUTER':'PASS & PLAY';$('moveCount').textContent=notation.length+' PLIES';$('moves').innerHTML=notation.length?Array.from({length:Math.ceil(notation.length/2)},(_,i)=>`<div class="move-row"><span>${i+1}.</span><span>${notation[i*2]}</span><span>${notation[i*2+1]||'—'}</span></div>`).join(''):'<div class="empty">The story begins with you.</div>';$('moves').scrollTop=1e6;for(let side of ['w','b'])$('captured'+side.toUpperCase()).innerHTML=taken.filter(p=>p[0]===side).map(p=>`<span title="${names[p[1]]}">${{p:'♟',n:'♞',b:'♝',r:'♜',q:'♛'}[p[1]]}</span>`).join('')+`<small>${side==='w'?'Ivory Guard':'Obsidian Order'}</small>`;let bottom=flipped?'b':'w';for(let [id,side] of [['bottom',bottom],['top',bottom==='w'?'b':'w']]){$(id+'Name').textContent=side==='w'?'The Ivory Guard':'The Obsidian Order';$(id+'Side').textContent=side==='w'?'WHITE':'BLACK';$(id+'Meta').textContent=mode==='local'?'Player '+(side==='w'?'one':'two'):side===human?'You · '+(side==='w'?'White':'Black'):'Computer · '+level[0].toUpperCase()+level.slice(1)}$('undoBtn').disabled=!history.length||busy;$('resignBtn').disabled=!!ended||busy}
async function tap(i){if(paused||busy||ended||mode==='ai'&&game.turn!==human)return;if(selected>=0){let options=game.legal().filter(m=>m.f===selected&&m.t===i);if(options.length){let move=options[0];if(options.length>1){busy=true;$('promotion').hidden=false;$('promotionChoices').innerHTML='';move=await new Promise(resolve=>options.forEach(m=>{let b=document.createElement('button');b.innerHTML=figure(game.turn+m.promotion);b.title=names[m.promotion];b.onclick=()=>{$('promotion').hidden=true;resolve(m)};$('promotionChoices').append(b)}));busy=false}await execute(move);return}}selected=game.b[i]?.[0]===game.turn?i:-1;render()}
// Animation system: movement and duel phases remain independent of game state.

let animationStorage;try{animationStorage=window.localStorage}catch{}
const animationPrefs=loadPreferences(animationStorage);
let activeAnimation=animationPrefs.selected;
function animationMenu(){
 const visible=animationOptions.filter(o=>$('showDiscarded').checked||animationPrefs.ratings[o.id]!=='discard');
 if(!visible.some(o=>o.id===animationPrefs.selected))animationPrefs.selected=visible.some(o=>o.id===activeAnimation)?activeAnimation:visible[0]?.id||'instant';
 const groups=new Map();for(const o of visible){const group=o.group||(['glide','crossfade','shrink','sink','hop','arc','instant'].includes(o.id)?'Minimal movement':'Original & earlier experiments');if(!groups.has(group)){const node=document.createElement('optgroup');node.label=group;groups.set(group,node)}const option=document.createElement('option');option.value=o.id;option.textContent=o.name+(animationPrefs.ratings[o.id]==='keep'?' · Kept':animationPrefs.ratings[o.id]==='discard'?' · Discarded':'');groups.get(group).append(option)}$('animationStyle').replaceChildren(...groups.values());
 $('animationStyle').value=animationPrefs.selected;
 const option=animationOptions.find(o=>o.id===animationPrefs.selected);
 $('animationDescription').textContent=option.description;
 $('animationRating').textContent='Rating: '+(animationPrefs.ratings[option.id]||'unrated');
 $('discardAnimation').disabled=option.id==='instant';
}
function rememberAnimation(){const available=animationPrefs.ratings[animationPrefs.selected]!=='discard';if(available)activeAnimation=animationPrefs.selected;const saved=savePreferences(animationStorage,{...animationPrefs,selected:activeAnimation});animationMenu();if(!saved)$('animationRating').textContent+=' · Browser storage unavailable; choices last for this visit.';}
$('animationStyle').onchange=()=>{animationPrefs.selected=$('animationStyle').value;rememberAnimation()};
$('showDiscarded').onchange=animationMenu;
for(const [id,rating] of [['keepAnimation','keep'],['discardAnimation','discard'],['resetAnimation','unrated']])$(id).onclick=()=>{animationPrefs.ratings[animationPrefs.selected]=rating;if(rating==='discard'&&activeAnimation===animationPrefs.selected){activeAnimation=animationOptions.find(o=>animationPrefs.ratings[o.id]!=='discard')?.id||'instant';animationPrefs.selected=activeAnimation}rememberAnimation()};
$('previewAnimation').onclick=()=>{const frame=$('animationPreview');frame.hidden=false;frame.src='./animation-preview.html?v=20261022-staged-1&style='+encodeURIComponent(animationPrefs.selected)+'&defender='+encodeURIComponent($('previewDefender').value)+'&attacker='+encodeURIComponent($('previewPiece').value)+'&speed='+encodeURIComponent($('animationSpeed').value)+'&replay='+Date.now()};
animationMenu();
function setInterface(style){if(!['classic','minimal','gallery'].includes(style))style='minimal';document.body.dataset.interface=style;$('interfaceStyle').value=style;try{animationStorage?.setItem('iron-ivory-interface-v1',style)}catch{}}
let savedInterface;try{savedInterface=animationStorage?.getItem('iron-ivory-interface-v1')}catch{}
setInterface(savedInterface);
$('interfaceStyle').onchange=()=>setInterface($('interfaceStyle').value);
const appearancePrefs=loadAppearance(animationStorage);
let appearanceCandidate=appearancePrefs.selected, comparingSaved=false;
function applyAppearance(id){if(id)battlefield?.setEnvironment(id)}
function appearanceMenu(){
 const visible=appearanceOptions.filter(o=>$('showDiscardedSettings').checked||appearancePrefs.ratings[o.id]!=='discard');
 if(!visible.some(o=>o.id===appearanceCandidate))appearanceCandidate=appearancePrefs.selected;
 $('environmentStyle').replaceChildren(...visible.map(o=>{const el=document.createElement('option');el.value=o.id;el.textContent=o.name+(appearancePrefs.ratings[o.id]==='keep'?' · Kept':appearancePrefs.ratings[o.id]==='discard'?' · Discarded':'');return el}));
 $('environmentStyle').value=appearanceCandidate;
 const choice=appearanceOptions.find(o=>o.id===appearanceCandidate);
 $('settingDescription').textContent=choice?.description||'No available setting.';
 $('settingRating').textContent='Rating: '+(appearancePrefs.ratings[appearanceCandidate]||'unrated')+' · Saved: '+(appearanceOptions.find(o=>o.id===appearancePrefs.selected)?.name||'none');
 $('discardSetting').disabled=appearanceOptions.filter(o=>appearancePrefs.ratings[o.id]!=='discard'&&o.id!==appearanceCandidate).length===0;
 $('previewSetting').disabled=!choice;
}
function persistAppearance(){const saved=saveAppearance(animationStorage,appearancePrefs);appearanceMenu();if(!saved)$('settingRating').textContent+=' · Storage unavailable; saved for this visit only.'}
function endAppearancePreview(){document.body.classList.remove('comparing-setting');applyAppearance(appearancePrefs.selected);$('appearancePreview').hidden=true;$('settings').hidden=false;appearanceMenu();$('previewSetting').focus()}
$('environmentStyle').onchange=()=>{appearanceCandidate=$('environmentStyle').value;appearanceMenu()};
$('showDiscardedSettings').onchange=appearanceMenu;
for(const [id,rating] of [['keepSetting','keep'],['discardSetting','discard'],['resetSetting','unrated']])$(id).onclick=()=>{if(rateAppearance(appearancePrefs,appearanceCandidate,rating)){applyAppearance(appearancePrefs.selected);persistAppearance()}};
$('previewSetting').onclick=()=>{document.body.classList.add('comparing-setting');comparingSaved=false;applyAppearance(appearanceCandidate);$('settings').hidden=true;$('appearancePreview').hidden=false;updateAppearancePreview();$('compareSetting').focus()};
function updateAppearancePreview(){const current=comparingSaved?appearancePrefs.selected:appearanceCandidate;$('appearancePreviewName').textContent=(comparingSaved?'Saved · ':'Preview · ')+appearanceOptions.find(o=>o.id===current)?.name;$('compareSetting').textContent=comparingSaved?'Show candidate':'Compare saved';$('useSetting').disabled=appearancePrefs.ratings[appearanceCandidate]==='discard';$('useSetting').textContent=appearancePrefs.ratings[appearanceCandidate]==='discard'?'Discarded':comparingSaved?'Use candidate':'Use this setting'}
$('compareSetting').onclick=()=>{comparingSaved=!comparingSaved;applyAppearance(comparingSaved?appearancePrefs.selected:appearanceCandidate);updateAppearancePreview()};
$('backSetting').onclick=endAppearancePreview;
$('useSetting').onclick=()=>{if(appearancePrefs.ratings[appearanceCandidate]==='discard')return;appearancePrefs.selected=appearanceCandidate;persistAppearance();endAppearancePreview()};
applyAppearance(appearancePrefs.selected);appearanceMenu();
let savedGraphics;try{savedGraphics=animationStorage?.getItem('iron-ivory-light-graphics-v1')}catch{}
$('lightGraphics').checked=savedGraphics==='true';battlefield?.setGraphics($('lightGraphics').checked?'light':'full');
$('lightGraphics').onchange=()=>{battlefield?.setGraphics($('lightGraphics').checked?'light':'full');try{animationStorage?.setItem('iron-ivory-light-graphics-v1',String($('lightGraphics').checked))}catch{}};
let audio;
function sound(kind){if(mute)return;try{
 audio??=new (window.AudioContext||window.webkitAudioContext)();audio.resume();const now=audio.currentTime;
 if(kind==='clash'){
  const master=audio.createGain();master.gain.value=.30;master.connect(audio.destination);
  const thud=audio.createOscillator(),low=audio.createGain();thud.type='sine';thud.frequency.setValueAtTime(125,now);thud.frequency.exponentialRampToValueAtTime(28,now+.30);low.gain.setValueAtTime(.65,now);low.gain.exponentialRampToValueAtTime(.001,now+.4);thud.connect(low);low.connect(master);thud.start(now);thud.stop(now+.42);
  const buffer=audio.createBuffer(1,audio.sampleRate*.55,audio.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*Math.exp(-i/data.length*6);const crack=audio.createBufferSource(),filter=audio.createBiquadFilter(),gain=audio.createGain();crack.buffer=buffer;filter.type='highpass';filter.frequency.value=800;gain.gain.value=.5;crack.connect(filter);filter.connect(gain);gain.connect(master);crack.start(now);
  for(let i=0;i<5;i++){const o=audio.createOscillator(),g=audio.createGain(),t=now+.08+i*.055;o.type='triangle';o.frequency.value=650+i*213;g.gain.setValueAtTime(.10/(i+1),t);g.gain.exponentialRampToValueAtTime(.001,t+.18);o.connect(g);g.connect(master);o.start(t);o.stop(t+.2)}return;
 }
 const o=audio.createOscillator(),g=audio.createGain();o.connect(g);g.connect(audio.destination);o.frequency.setValueAtTime(kind==='check'?440:180,now);o.frequency.exponentialRampToValueAtTime(90,now+.15);g.gain.setValueAtTime(.04,now);g.gain.exponentialRampToValueAtTime(.001,now+.22);o.start();o.stop(now+.23);
}catch{}}
async function animate(m){await battlefield?.animate(game,m,speed,(label,impact)=>{$('duelState').textContent='⚔ '+label[0].toUpperCase()+label.slice(1);if(impact)sound('clash')},activeAnimation);$('duelState').textContent='Drag to orbit · Pinch to zoom · Tap to move'}
async function execute(m){busy=true;selected=-1;let san=game.san(m);$('undoBtn').disabled=true;$('resignBtn').disabled=true;$('startBtn').disabled=true;try{await animate(m)}catch(error){console.error('Animation interrupted',error)}finally{$('startBtn').disabled=false;}history.push({state:game.clone(),move:m,taken:[...taken],ended});let capt=game.play(m);if(capt)taken.push(capt);notation.push(san);ended=game.result();busy=false;if(rotating&&mode==='local')flipped=game.turn==='b';render();if(game.check())sound('check');if(ended)showResult();else think()}
function showResult(){$('resultTitle').textContent=ended.split(' · ')[0];$('resultText').textContent=ended.includes(' · ')?ended.split(' · ').slice(1).join(' · '):ended;$('resultDialog').hidden=false}
// AI module runs in a Blob worker; iterative deepening alpha-beta with capture ordering.
const aiSource=`${Chess.toString()}
const values={p:100,n:320,b:335,r:500,q:900,k:0};let deadline;function evaluate(g){let s=0;for(let i=0;i<64;i++){let p=g.b[i];if(!p)continue;let center=3.5-Math.abs(3.5-i%8)+3.5-Math.abs(3.5-(i>>3)),advance=p[0]==='w'?6-(i>>3):(i>>3)-1;let v=values[p[1]]+(p[1]==='p'?advance*8:0)+(p[1]==='n'||p[1]==='b'?center*9:0);s+=(p[0]===g.turn?1:-1)*v}return s}function search(g,depth,a,b,ply){if(performance.now()>deadline)throw 0;let moves=g.legal();if(!moves.length)return g.check()?-100000+ply:0;if(g.half>=100||g.insufficient()||g.keys.filter(k=>k===g.keys.at(-1)).length>=3)return 0;if(!depth)return evaluate(g);moves.sort((x,y)=>(values[g.b[y.t]?.[1]]||0)-(values[g.b[x.t]?.[1]]||0));for(let m of moves){let next=g.clone();next.play(m);let v=-search(next,depth-1,-b,-a,ply+1);if(v>=b)return b;if(v>a)a=v}return a}onmessage=e=>{let {state,level,id}=e.data,g=new Chess(state),moves=g.legal(),best=moves[0];deadline=performance.now()+({easy:180,medium:850,hard:2400}[level]);let max={easy:1,medium:3,hard:5}[level];for(let d=1;d<=max;d++){let candidate=best,score=-Infinity;try{let ordered=[best,...moves.filter(x=>JSON.stringify(x)!==JSON.stringify(best))];for(let m of ordered){let next=g.clone();next.play(m);let v=-search(next,d-1,-Infinity,Infinity,1)+(level==='easy'?Math.random()*85:Math.random()*3);if(v>score){score=v;candidate=m}}best=candidate}catch{break}}postMessage({move:best,id})};`;
function think(){if(ended||mode!=='ai'||game.turn===human)return;busy=true;render();worker?.terminate();worker=new Worker(URL.createObjectURL(new Blob([aiSource],{type:'text/javascript'})));let id=++job;worker.onmessage=e=>{if(e.data.id!==job)return;busy=false;if(e.data.move){if(paused)pendingAi=e.data.move;else execute(e.data.move)}};worker.onerror=()=>{busy=false;let moves=game.legal();if(moves.length){if(paused)pendingAi=moves[0];else execute(moves[0])}};worker.postMessage({state:game,level,id})}
function start(){mode=setupMode;level=setupLevel;document.body.classList.remove('comparing-setting');applyAppearance(appearancePrefs.selected);$('settings').hidden=true;$('appearancePreview').hidden=true;$('animationPreview').src='about:blank';$('animationPreview').hidden=true;speed=$('animationSpeed').value;pendingAi=null;paused=false;if(battlefield)battlefield.paused=false;document.body.classList.add('playing');$('pauseDialog').hidden=true;worker?.terminate();job++;game=new Chess();history=[];notation=[];taken=[];selected=-1;ended=null;busy=false;human=choiceColor==='random'?(Math.random()<.5?'w':'b'):choiceColor;rotating=$('rotate').checked;flipped=mode==='ai'?human==='b':false;$('resultDialog').hidden=true;render();think()}
function segmented(id,callback){$(id).querySelectorAll('button').forEach(b=>b.onclick=()=>{$(id).querySelectorAll('button').forEach(x=>x.classList.toggle('active',x===b));callback(b.dataset.value)})}segmented('modeChoice',v=>{setupMode=v;$('difficultyField').hidden=v==='local';$('colorField').hidden=v==='local';$('rotateField').hidden=v!=='local'});segmented('levelChoice',v=>setupLevel=v);segmented('colorChoice',v=>choiceColor=v);
$('startBtn').onclick=start;$('newBtn').onclick=()=>{if(!busy)openSettings()};$('flipBtn').onclick=()=>{if(!busy){flipped=!flipped;render()}};$('undoBtn').onclick=()=>{if(busy||!history.length)return;worker?.terminate();job++;let count=mode==='ai'&&history.length>=2?2:1;while(count--&&history.length){let h=history.pop();game=h.state;taken=h.taken;ended=h.ended;notation.pop()}selected=-1;ended=null;if(rotating&&mode==='local')flipped=game.turn==='b';render();think()};$('resignBtn').onclick=()=>{if(ended||busy)return;ended='Resignation · '+(game.turn==='w'?'Black':'White')+' wins';render();showResult()};$('playAgain').onclick=()=>{$('resultDialog').hidden=true;openSettings()};$('reviewBtn').onclick=()=>{$('resultDialog').hidden=true};function setMute(value){mute=value;$('soundBtn').textContent=mute?'♪ Sound off':'♪ Sound on';$('soundSetting').checked=!mute} $('soundBtn').onclick=()=>setMute(!mute);$('soundSetting').onchange=e=>setMute(!e.target.checked);function openSettings(){setPaused(true);$('pauseDialog').hidden=true;$('settings').hidden=false;} $('settingsBtn').onclick=openSettings;function closeSettings(){document.body.classList.remove('comparing-setting');applyAppearance(appearancePrefs.selected);$('appearancePreview').hidden=true;$('settings').hidden=true;$('animationPreview').src='about:blank';$('animationPreview').hidden=true;speed=$('animationSpeed').value;resume()}$('closeSettings').onclick=closeSettings;$('doneSettings').onclick=closeSettings;function setPaused(value){paused=value;if(battlefield)battlefield.paused=value;}
function resume(){setPaused(false);$('pauseDialog').hidden=true;if(pendingAi){let m=pendingAi;pendingAi=null;execute(m)}}
function pause(){setPaused(true);$('pauseNew').disabled=busy;$('pauseDialog').hidden=false;}
function openOverheadView(){document.body.classList.add('playing');battlefield?.setView(0,1.49);resume()}
$('pauseOverhead').onclick=openOverheadView;$('pauseOverhead').disabled=!battlefield;
$('pauseBtn').onclick=pause;$('resumeBtn').onclick=resume;
$('pauseSettings').onclick=openSettings;
$('pauseNew').onclick=()=>{if(!busy)openSettings()};
$('exitFocus').onclick=()=>{document.body.classList.remove('playing','show-log');if(document.fullscreenElement)document.exitFullscreen();resume()};
$('focusBtn').onclick=()=>{document.body.classList.add('playing');document.body.classList.remove('show-log')};
$('logBtn').onclick=()=>{let open=document.body.classList.toggle('show-log');$('logBtn').setAttribute('aria-expanded',String(open))};
$('fullscreenBtn').hidden=!document.fullscreenEnabled;
$('fullscreenBtn').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen()}catch(error){console.warn('Fullscreen unavailable',error)}};
document.addEventListener('fullscreenchange',()=>{$('fullscreenBtn').setAttribute('aria-label',document.fullscreenElement?'Exit fullscreen':'Enter fullscreen')});
document.addEventListener('keydown',e=>{if(e.key!=='Escape')return;if(!$('appearancePreview').hidden){endAppearancePreview();return;}if(!$('settings').hidden){closeSettings();return}if(!$('pauseDialog').hidden){resume();return}if(document.body.classList.contains('playing')){pause();return}selected=-1;if(!busy)render()});start();

export { battlefield };
