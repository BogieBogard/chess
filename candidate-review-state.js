export const characterCandidates=[
 {id:'tomorrow',uid:'1a54cac1b89a4c9092f810c59b04f816',name:'The Knight of Tomorrow',creator:'Kondrashov Anton',url:'https://sketchfab.com/3d-models/the-knight-of-tomorrow-1a54cac1b89a4c9092f810c59b04f816'},
 {id:'pale',uid:'9594a385689745eb89effb9f57d72142',name:'Pale Knight Animated',creator:'mara3m',url:'https://sketchfab.com/3d-models/pale-knight-animated-9594a385689745eb89effb9f57d72142'},
 {id:'forgotten',uid:'d14eb14d83bd4e7ba7cbe443d76a10fd',name:'The Forgotten Knight',creator:'dark_igorek',url:'https://sketchfab.com/3d-models/the-forgotten-knight-d14eb14d83bd4e7ba7cbe443d76a10fd'}
];
export const reviewKey='chess-model-reviews-v1';
export function loadModelReviews(storage){let saved;try{saved=JSON.parse(storage?.getItem(reviewKey)||'{}')}catch{}return Object.fromEntries(characterCandidates.map(c=>[c.id,['keep','discard'].includes(saved?.[c.id])?saved[c.id]:'unrated']))}
export function saveModelReviews(storage,reviews){try{if(!storage)return false;storage.setItem(reviewKey,JSON.stringify(Object.fromEntries(characterCandidates.map(c=>[c.id,['keep','discard'].includes(reviews[c.id])?reviews[c.id]:'unrated']))));return true}catch{return false}}
export function availableCandidates(reviews,showDiscarded=false){return characterCandidates.filter(c=>showDiscarded||reviews[c.id]!=='discard')}
export function initialCandidate(reviews,requested){const available=availableCandidates(reviews);return available.find(c=>c.id===requested)||available[0]||null}
