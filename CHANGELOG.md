# Daily improvements

## 2026-10-21
- Removed all capture screen/camera shake, including the obsolete CSS shake animation.
- Added eight selectable animation styles: Quiet glide (default), Crossfade, Miniature, Sink away, Small hop, Curved glide, Original duel, and No animation.
- Added an isolated, repeatable pawn capture preview and browser-local Keep/Discard ratings. Discarded styles are hidden unless requested and never activated by previewing them.
- Settings now save the active style and ratings. No animation remains available as a fallback; reduced-motion settings are respected.

- Added three saved overall interface designs: Classic top toolbar, Minimal bottom dock, and Gallery light side rail. Mobile layouts use at least 44px tap targets and scrollable settings.

- Added a park environment at a consistent 5cm per board square: a 40cm board, 75cm stone table, human-scale stools, benches, lamps, instanced trees, and a distant city edge. Afternoon and golden-hour settings are selectable and saved.
- Added Park view, Fit board return, and a saved lighter-graphics toggle for phones.

- Based on Matt’s feedback, Original Duel is the default. Added four combat variants: Quickdraw, Executioner, Feint & Finish, and Whirlwind, with distinct choreography and shattering. Camera remains steady.

- Removed the rook’s horizontal ram. Combat captures now use a short castle surge and vertical wall of force, followed by shattering. Preview can select any of the six attacker types.

- Smoothed combat contact: fracture geometry is prepared before movement; strikes ease into contact and flow directly into follow-through without an impact freeze.
- Added QUEUE.md as the canonical ordered backlog, preserving Matt’s original requests, context and consecutive item numbers.

- Added high-contrast, unlit destination markers for every legal move, capture rings, and explicit destination labels in the HUD and accessible board, including initial two-square pawn moves.

## Direction for future improvements
- Continue refining the park setting and its realistic table/environment proportions; it is park-inspired, not a replica of Central Park.
- Provide graphics and environment styles/toggles for comparison, using the same preview and Keep/Discard approach as animations. Matt chooses which experiments to retain.
- Explore additional minimal, elegant overall UI designs that look and feel great on mobile; compare layout, navigation, menus, typography, and interaction, not just colors.
- Design principle: simplify interaction and reduce visible clutter while committing to a strong visual personality. Keep navigation intuitive and friction low; avoid bland, generic AI UI styling.
- Matt explicitly authorized shipping these improvements on 2026-10-21.
- Animation direction: Original Duel is the approved baseline. Focus experiments on expressive combat choreography and destruction; quiet slides/fades are not the creative target.
- Never restore capture screen/camera shake.
