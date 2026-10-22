export const animationOptions = [
 {id:'glide',name:'Quiet glide',description:'Straight movement; captured pieces fade away.'},
 {id:'crossfade',name:'Crossfade',description:'Pieces dissolve between squares without travelling.'},
 {id:'shrink',name:'Miniature',description:'The target gently shrinks before the attacker slides in.'},
 {id:'sink',name:'Sink away',description:'The target lowers into its square; the attacker glides in.'},
 {id:'hop',name:'Small hop',description:'A small vertical hop with a soft landing.'},
 {id:'arc',name:'Curved glide',description:'A shallow sideways arc between squares.'},
 {id:'duel',name:'Original duel',description:'Weapon choreography and shattering, with a steady camera.'},
 {id:'instant',name:'No animation',description:'Place pieces immediately.'}
];
export function loadPreferences(storage){
 try{const saved=JSON.parse(storage.getItem('iron-ivory-animations-v1')||'{}');
 const ratings=Object.fromEntries(animationOptions.map(o=>[o.id,['keep','discard'].includes(saved.ratings?.[o.id])?saved.ratings[o.id]:'unrated']));
 const selected=animationOptions.some(o=>o.id===saved.selected&&ratings[o.id]!=='discard')?saved.selected:animationOptions.find(o=>ratings[o.id]!=='discard')?.id||'instant';
 return {selected,ratings};}catch{return {selected:'glide',ratings:{}};}
}
export function savePreferences(storage,preferences){try{storage.setItem('iron-ivory-animations-v1',JSON.stringify(preferences));return true;}catch{return false;}}
