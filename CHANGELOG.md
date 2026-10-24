# Daily improvements

## 2026-10-24
- Final validation: all 30 tests pass, including mostly-covered icon thresholds, opponent readability and Golden Hour preference migration. Browser verified default setting/layout, computer/Pass & Play Flip visibility and dock clearance.
- Golden Hour now replaces the old automatic afternoon default, while explicit saved choices/discards remain intact. No new environment toggle.
- Refined depth shading to require 70% coverage; computer-opponent icons remain crisp. Flip board is available only in Pass & Play.
- The icon/dock/name-removal/review batch was verified live at f136342. Sketchfab integrations are explicitly deferred by Matt until available for sign-in.
- Follow-up batch validation: 27 tests pass. Browser verified 320px toolbar, all-view icons and saved toggle state, Minimal defaults with retained saved Classic, and unbranded loading/main screens.
- Recorded Matt’s asset reviews: Medieval Knight rejected and removed from the active shortlist; Plated Knight, both chess sets and both benches marked liked. Existing Settings placement retained at Matt’s request.
- Removed the app name from the loading screen, HUD, dashboard branding and page title. The turn status remains visible.
- Minimal bottom dock is now the default interface for new preferences; existing saved interface choices are retained.
- Added a saved, default-on Icons toggle in place of Fit board. Icons remain available in every camera view. Screen-space overlap uses front-to-back ordering and three darker/desaturated rear layers; unobscured icons remain crisp. Removed the floating gesture helper that obscured the near rank.
- Icon validation: depth-layer tests cover overlaps, ordering, hidden pieces and the three-layer cap. Browser checks verify saved toggle state across reload and the low-angle overlap appearance.
- Camera release c04e5a2 verified live.
- Camera presets now start Overhead and frame both Overhead and Battle one zoom-in step closer. Projection checks confirm the full playing surface stays visible on phone and desktop.
- Loading release 7e7890b verified live: no dashboard flash, loader dismissed after populated frame.
- Loading validation: all 23 tests pass. Browser verified the pre-script shell, 320px layout, first-frame reveal and failed-import retry.
- Added a minimal, immediately available loading shell with a small chessboard mark, wordmark and loading indicator. The dashboard stays hidden until the first populated 3D frame; no artificial delay. Reduced motion uses a static indicator. Startup failures show a retry action.
- Shipped f44c661; verified immediate startup and Settings alternatives on the live page.
- Removed the welcome gate and its introductory/tagline copy. The page opens immediately into computer chess on Medium with the user as White.
- Moved opponent, difficulty and side selection into Settings under New game. Changes apply only when starting a new game, preserving the current game when Settings is closed.
- Validation: all 23 tests pass; browser verified immediate startup, Medium/White defaults, cancelled setup, Pass & Play and the 320px Settings layout.

## 2026-10-23
- Shipped 792fa7e; verified the production comparison and Overhead controls at mbogard.com/chess.
- Added full-board setting comparison: choose a candidate in Settings, preview it, toggle against the saved setting without moving the camera, then use it or go back. Preview keeps the game paused.
- Added persistent Keep/Discard ratings for afternoon, golden-hour and studio settings. Discarded settings stay hidden unless requested and cannot become active through preview. Existing saved setting is migrated; the final available setting cannot be discarded.
- Kept rating controls collapsed for a simpler phone menu. Overhead and piece icons remain available; no Park view controls added.
- Validation: 23 tests pass, including preference migration, reload persistence, discard fallback and unavailable storage. Browser checks cover 320px layout, preview/cancel, saved/candidate comparison, discarded-preview protection and explicit selection across reload.

## 2026-10-22
- Corrected the Park view misunderstanding: removed every Park view menu/toolbar action. Restored Overhead below 380px and added direct Overhead actions to the welcome and in-game menus. The overhead piece-icon overlay remains available.
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
