import test from 'node:test';
import assert from 'node:assert/strict';
import Chess from '../rules.js';
import {loadSession, saveSession, sessionKey} from '../game-session.js';
function storage(){const values=new Map();return {getItem:k=>values.get(k),setItem:(k,v)=>values.set(k,v)}}
function fixture(sequence, options={}) {
 const game=new Chess(), history=[];
 for(const san of sequence.split(' ').filter(Boolean)){
  const move=game.legal().find(m=>game.san(m)===san);assert.ok(move,san);
  history.push({move});game.play(move);
 }
 return {game, history, mode:'ai',level:'medium',human:'w',flipped:false,rotating:false,ended:game.result(),...options};
}
test('recovery rebuilds captures, notation, rights and Undo snapshots',()=>{
 const source=fixture('e4 d5 exd5 Qxd5 Nc3 Qa5 Nf3 Nf6 Be2 e6 O-O');
 const store=storage();assert.ok(saveSession(store,source));const restored=loadSession(store);
 assert.deepEqual(restored.game,source.game);assert.deepEqual(restored.taken,['bp','wp']);
 assert.equal(restored.notation.at(-1),'O-O');const undo=restored.history.at(-1);
 assert.equal(undo.state.b[60],'wk');assert.equal(undo.state.b[63],'wr');assert.equal(undo.move.castle,true);
 assert.deepEqual(undo.taken,restored.taken);
});
test('en passant and underpromotion are reconstructed from legal moves',()=>{
 for(const moves of ['e4 a6 e5 d5 exd6','a4 h5 a5 h4 a6 h3 axb7 hxg2 bxa8=N']){
  const source=fixture(moves),store=storage();saveSession(store,source);const restored=loadSession(store);
  assert.deepEqual(restored.game,source.game);assert.equal(restored.notation.join(' '),moves);
 }
});
test('threefold result and repetition keys survive reopening',()=>{
 const source=fixture('Nf3 Nf6 Ng1 Ng8 Nf3 Nf6 Ng1 Ng8'),store=storage();
 saveSession(store,source);const restored=loadSession(store);
 assert.equal(restored.ended,'Threefold repetition · Draw');assert.deepEqual(restored.game.keys,source.game.keys);
});
test('computer turn, local rotation, resignation and a fresh game survive',()=>{
 const store=storage();
 for(const source of [fixture('e4'),fixture('d4',{mode:'local',human:'b',level:'hard',flipped:true,rotating:true,ended:'Resignation · White wins'}),fixture('')]){
  saveSession(store,source);const restored=loadSession(store);
  for(const k of ['mode','level','human','flipped','rotating','ended'])assert.equal(restored[k],source[k]);
  assert.deepEqual(restored.game,source.game);
 }
});
test('corrupt, incompatible or illegal saves are ignored without touching preferences',()=>{
 const store=storage();store.setItem('iron-ivory-piece-set-v1','realistic');
 for(const value of ['{',JSON.stringify({version:2}),JSON.stringify({version:1,moves:[]})]){store.setItem(sessionKey,value);assert.equal(loadSession(store),null)}
 saveSession(store,fixture('e4'));const data=JSON.parse(store.getItem(sessionKey));data.moves.push({f:0,t:63});store.setItem(sessionKey,JSON.stringify(data));assert.equal(loadSession(store),null);
 assert.equal(store.getItem('iron-ivory-piece-set-v1'),'realistic');
});
test('blocked storage remains safe and completed results cannot accept extra moves',()=>{
 const blocked={getItem(){throw Error('blocked')},setItem(){throw Error('quota')}};
 assert.equal(loadSession(blocked),null);assert.equal(saveSession(blocked,fixture('')),false);
 const store=storage();saveSession(store,fixture('f3 e5 g4 Qh4#'));const data=JSON.parse(store.getItem(sessionKey));data.moves.push({f:48,t:40});store.setItem(sessionKey,JSON.stringify(data));assert.equal(loadSession(store),null);
});
