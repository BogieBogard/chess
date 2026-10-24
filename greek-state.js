// Only public Viewer API transforms are used. No model geometry is downloaded or extracted.
const types={Pawn:'p',Knight:'n',Bishop:'b',Rook:'r',Queen:'q',King:'k'};
export function greekCode(name){const match=/^(White|Black) (Pawn|Knight|Bishop|Rook|Queen|King)/.exec(name||'');return match?(match[1]==='White'?'w':'b')+types[match[2]]:null}
export class GreekState {
 constructor(pieces){
  if(pieces.length!==32)throw Error('Greek viewer must expose 32 pieces');
  this.pieces=pieces.map(p=>({...p,code:greekCode(p.name)}));if(this.pieces.some(p=>!p.code||p.local?.length!==16))throw Error('Invalid Greek piece transform');
  const whiteKing=this.pieces.find(p=>p.code==='wk'),blackKing=this.pieces.find(p=>p.code==='bk'),xs=this.pieces.map(p=>p.local[12]);
  this.minX=Math.min(...xs);this.stepX=(Math.max(...xs)-this.minX)/7;this.minZ=blackKing.local[14];this.stepZ=(whiteKing.local[14]-this.minZ)/7;
  this.units=new Map();
 }
 localSquare(i){return [this.minX+i%8*this.stepX,this.minZ+(i>>3)*this.stepZ]}
 worldSquare(i,height=.05){const [x,z]=this.localSquare(i);return [x,-z,height]}
 squareAtWorld(point){if(!point)return null;const file=Math.round((point[0]-this.minX)/this.stepX),row=Math.round((-point[1]-this.minZ)/this.stepZ);return file>=0&&file<8&&row>=0&&row<8?row*8+file:null}
 matrix(piece,square){const m=piece.local.slice(),[x,z]=this.localSquare(square);m[12]=x;m[14]=z;return m}
 reconcile(board){
  const units=new Map(),used=new Set();
  for(const [square,unit]of this.units)if(board[square]===unit.code){units.set(square,unit);used.add(unit.piece.id)}
  // Exact source meshes first; extra promoted roles use an unused pawn with a persistent role badge.
  const waiting=[];
  for(let square=0;square<64;square++)if(board[square]&&!units.has(square)){const code=board[square],piece=this.pieces.filter(p=>p.code===code&&!used.has(p.id)).sort((a,b)=>{const [x,z]=this.localSquare(square);return Math.hypot(a.local[12]-x,a.local[14]-z)-Math.hypot(b.local[12]-x,b.local[14]-z)})[0];if(piece){units.set(square,{code,piece,proxy:false});used.add(piece.id)}else waiting.push(square)}
  for(const square of waiting){const code=board[square],piece=this.pieces.find(p=>p.code===code[0]+'p'&&!used.has(p.id));if(!piece)throw Error('No available Greek piece for position');units.set(square,{code,piece,proxy:true});used.add(piece.id)}
  this.units=units;return units;
 }
}
