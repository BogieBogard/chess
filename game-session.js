import Chess from './rules.js';

export const sessionKey = 'chess-game-session-v1';
const modes = ['ai', 'local'], levels = ['easy', 'medium', 'hard'];

// Store moves, not arbitrary boards or display text. Replaying legal moves restores
// castling/en-passant rights, repetition keys, captures and every Undo snapshot.
export function saveSession(storage, {history, mode, level, human, flipped, rotating, ended}) {
 try {
  const moves = history.map(({move}) => ({f:move.f, t:move.t, ...(move.promotion ? {promotion:move.promotion} : {})}));
  storage?.setItem(sessionKey, JSON.stringify({version:1, moves, mode, level, human,
   flipped:!!flipped, rotating:!!rotating, resigned:!!ended?.startsWith('Resignation · ')}));
  return !!storage;
 } catch { return false; }
}

export function loadSession(storage) {
 try {
  const raw = storage?.getItem(sessionKey);
  if (!raw || raw.length > 131072) return null;
  const data = JSON.parse(raw);
  if (data.version !== 1 || !Array.isArray(data.moves) || data.moves.length > 1024 ||
      !modes.includes(data.mode) || !levels.includes(data.level) || !['w','b'].includes(data.human) ||
      ['flipped','rotating','resigned'].some(key => typeof data[key] !== 'boolean')) return null;
  const game = new Chess(), history = [], notation = [], taken = [];
  let ended = null;
  for (const input of data.moves) {
   if (ended || !input || !Number.isInteger(input.f) || !Number.isInteger(input.t)) return null;
   const move = game.legal().find(m => m.f === input.f && m.t === input.t && m.promotion === input.promotion);
   if (!move) return null;
   history.push({state:game.clone(), move, taken:[...taken], ended});
   notation.push(game.san(move));
   const captured = game.play(move);
   if (captured) taken.push(captured);
   ended = game.result();
  }
  if (data.resigned && !ended) ended = 'Resignation · '+(game.turn === 'w' ? 'Black' : 'White')+' wins';
  return {game, history, notation, taken, ended, mode:data.mode, level:data.level,
   human:data.human, flipped:data.flipped, rotating:data.rotating};
 } catch { return null; }
}
