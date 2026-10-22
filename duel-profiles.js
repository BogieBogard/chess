// Combat variants share the same weapon-contact solve and game-state cleanup.
export const duelProfiles={
 duel:{name:'Original duel',wind:460,strike:150,hold:80,follow:270,weight:1,burst:1},
 'duel-quickdraw':{name:'Quickdraw',wind:180,strike:85,hold:45,follow:190,weight:.7,burst:1},
 'duel-heavy':{name:'Executioner',wind:780,strike:185,hold:150,follow:430,weight:1.65,burst:1.35},
 'duel-combo':{name:'Feint & finish',wind:320,strike:110,hold:90,follow:330,weight:1.1,burst:1.15,feint:true},
 'duel-whirlwind':{name:'Whirlwind',wind:300,strike:125,hold:90,follow:420,weight:1.2,burst:1.2,spin:true}
};
