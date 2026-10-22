# Daily improvements

## 2026-10-22
- Added a discoverable Asset candidates section near the top of Settings, with six direct Sketchfab links and creator names. Added candidates.html as a mobile-friendly shortlist; links open a new tab to preserve the game.
- Researched Sketchfab models for armored characters, conventional chess sets and park seating; recorded source links, listed licenses, triangle counts and evaluation notes in MODEL_RESEARCH.md. No third-party models imported.
- Added three independent capture scripts: Crown breaker, Sweep & finish, and Rift unweave. Regional geometry is split from the actual model before movement, with capped cuts and retained materials.
- Added head/leg detachment, standing partial damage, a sideways fall and grounded finishing blow, and a ranged spiral disassembly sequence. No new Original Duel profiles.
- Preview now supports all six defender types, Pause/Resume and Replay. Keep/Discard choices remain intact; new sequences are grouped separately from older experiments.

- Validation: 20 tests pass, including all 108 new scene/attacker/defender combinations, cut-volume conservation, contact targeting, resource cleanup, en passant/castling, reduced motion and preference preservation. Browser checks cover all three stories, pause/resume and the grouped menu.

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

- Added direct Park view actions to the welcome/new-game menu and in-game Menu, including automatic switching from Studio to Park when requested.

- Added high-contrast chess-piece badges in Overhead view; icons track moving pieces, distinguish white from black, and hide in other views.

## Direction for future improvements
- Continue refining the park setting and its realistic table/environment proportions; it is park-inspired, not a replica of Central Park.
- Provide graphics and environment styles/toggles for comparison, using the same preview and Keep/Discard approach as animations. Matt chooses which experiments to retain.
- Explore additional minimal, elegant overall UI designs that look and feel great on mobile; compare layout, navigation, menus, typography, and interaction, not just colors.
- Design principle: simplify interaction and reduce visible clutter while committing to a strong visual personality. Keep navigation intuitive and friction low; avoid bland, generic AI UI styling.
- Matt explicitly authorized shipping these improvements on 2026-10-21.
- Animation direction updated 2026-10-22: no more variations of Original Duel. Invent wholly distinct scene scripts, partial hits and effects; preserve existing saved choices.
- Never restore capture screen/camera shake.
