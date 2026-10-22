import test from 'node:test';
import assert from 'node:assert/strict';
import Chess from '../rules.js';
import {warrior,captureStyle} from '../battlefield.js';
const sq=s=>'abcdefgh'.indexOf(s[0])+(8-Number(s[1]))*8;
function move(g,from,to,extra={}){let m=g.legal().find(m=>m.f===sq(from)&&m.t===sq(to)&&(!extra.promotion||m.promotion===extra.promotion));assert.ok(m,`${from}-${to} must be legal`);g.play(m);return m}
function empty(){let g=new Chess();g.b.fill(null);g.b[60]='wk';g.b[4]='bk';g.rights='';g.ep=-1;return g}
function perft(g,d){if(!d)return 1;return g.legal().reduce((n,m)=>{let next=g.clone();next.play(m);return n+perft(next,d-1)},0)}
test('initial legal move tree remains correct',()=>{assert.equal(perft(new Chess(),3),8902)});
test('en passant removes the pawn on the adjacent square',()=>{let g=new Chess();move(g,'e2','e4');move(g,'a7','a6');move(g,'e4','e5');move(g,'d7','d5');assert.ok(move(g,'e5','d6').ep);assert.equal(g.b[sq('d5')],null);assert.equal(g.b[sq('d6')],'wp')});
test('castling moves king and rook together',()=>{let g=empty();g.b[63]='wr';g.rights='K';assert.ok(move(g,'e1','g1').castle);assert.equal(g.b[61],'wr');assert.equal(g.b[63],null)});
test('all four promotion choices remain available',()=>{let g=empty();g.b[8]='wp';assert.equal(g.legal().filter(m=>m.f===8&&m.t===0).length,4);move(g,'a7','a8',{promotion:'n'});assert.equal(g.b[0],'wn')});
test('armies face each other and only pawns kneel',()=>{for(let type of 'prnbqk'){let w=warrior('w'+type),b=warrior('b'+type);assert.equal(w.rotation.y,Math.PI);assert.equal(b.rotation.y,0);assert.equal(w.userData.body.position.y,type==='p'?-.26:0);if(type==='p')assert.ok(w.userData.legs[0].rotation.x< -1)}});
test('captures vary by attacker, approach, target, and sequence',()=>{assert.notEqual(captureStyle('wp','bp',48,41,0),captureStyle('wp','bp',48,41,1));assert.equal(captureStyle('wp','bn',48,41,0),'low thrust');assert.equal(captureStyle('wn','bp',57,42,0),'lance charge');assert.equal(captureStyle('wr','bp',56,40,0),'wall of force');assert.notEqual(captureStyle('wq','br',59,27,0),captureStyle('wq','bp',59,27,0))});

test('castle has no horizontal ram or weapon arm',()=>{const rook=warrior('wr');assert.equal(rook.userData.arm,undefined);assert.equal(rook.userData.weaponTip,undefined)});
