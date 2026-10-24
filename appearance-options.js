export const appearanceOptions = [
 {id:'park',name:'Park · afternoon',description:'Cool daylight, green stone and long tree shadows.'},
 {id:'sunset',name:'Park · golden hour',description:'Warm amber light across the same little chess table.'},
 {id:'studio',name:'Studio',description:'A dark, quiet backdrop with sculptural side lighting.'}
];
const key='iron-ivory-appearance-v1';
export function loadAppearance(storage){
 let saved={};try{saved=JSON.parse(storage?.getItem(key)||'{}')||{}}catch{}
 let legacy;try{legacy=storage?.getItem('iron-ivory-environment-v1')}catch{}
 const ratings=Object.fromEntries(appearanceOptions.map(o=>[o.id,['keep','discard'].includes(saved.ratings?.[o.id])?saved.ratings[o.id]:'unrated']));
 // Legacy afternoon was automatically saved on startup; replace that old default with Golden Hour.
 // Even corrupt preferences must leave an available setting; never revive a discarded choice.
 const available=appearanceOptions.filter(o=>ratings[o.id]!=='discard');
 const selected=[saved.selected,legacy==='park'?null:legacy,'sunset',...available.map(o=>o.id)].find(id=>available.some(o=>o.id===id))||null;
 return {selected,ratings};
}
export function saveAppearance(storage,prefs){try{storage.setItem(key,JSON.stringify(prefs));storage.setItem('iron-ivory-environment-v1',prefs.selected);return true}catch{return false}}
export function rateAppearance(prefs,id,rating){
 if(!appearanceOptions.some(o=>o.id===id)||!['keep','discard','unrated'].includes(rating))return false;
 if(rating==='discard'&&appearanceOptions.filter(o=>prefs.ratings[o.id]!=='discard'&&o.id!==id).length===0)return false;
 prefs.ratings[id]=rating;
 if(prefs.ratings[prefs.selected]==='discard')prefs.selected=appearanceOptions.find(o=>prefs.ratings[o.id]!=='discard').id;
 return true;
}
