import test from 'node:test';
import assert from 'node:assert/strict';
import {loadAppearance,saveAppearance,rateAppearance} from '../appearance-options.js';
function storage(entries={}){const data=new Map(Object.entries(entries));return {getItem:k=>data.get(k),setItem:(k,v)=>data.set(k,v)}}
test('appearance preserves legacy choice and saves ratings across reloads',()=>{
 const store=storage({'iron-ivory-environment-v1':'sunset'}),prefs=loadAppearance(store);
 assert.equal(prefs.selected,'sunset');rateAppearance(prefs,'park','discard');rateAppearance(prefs,'sunset','keep');
 assert.equal(saveAppearance(store,prefs),true);assert.deepEqual(loadAppearance(store),prefs);
});
test('discarding active setting chooses an available fallback and never revives discarded settings',()=>{
 const store=storage(),prefs=loadAppearance(store);rateAppearance(prefs,'sunset','discard');rateAppearance(prefs,'park','discard');
 assert.equal(prefs.selected,'studio');assert.equal(rateAppearance(prefs,'studio','discard'),false);
 saveAppearance(store,prefs);assert.equal(loadAppearance(store).selected,'studio');
 rateAppearance(prefs,'park','unrated');assert.equal(prefs.selected,'studio');
});
test('unavailable storage and invalid data leave usable choices without throwing',()=>{
 assert.equal(loadAppearance().selected,'park');assert.equal(saveAppearance(undefined,loadAppearance()),false);
 assert.equal(loadAppearance(storage({'iron-ivory-appearance-v1':'null'})).selected,'park');
 const prefs=loadAppearance(storage({'iron-ivory-appearance-v1':JSON.stringify({selected:'sunset',ratings:{sunset:'discard'}})}));
 assert.equal(prefs.selected,'park');assert.equal(prefs.ratings.sunset,'discard');
});
