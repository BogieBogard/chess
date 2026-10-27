# Daily improvements

## 2026-10-27
- Continued queue 028: added Plated king as a separate set-selector comparison. The imported knight replaces both kings at a larger scale, while other pieces retain the original figurines. Original sets and the Plated pawn trial remain available; selection and current game survive reload. Realistic stays the default for new preferences.
- Reuses the existing attributed Plated model buffers, materials and textures, with no extra model download. The unrigged kings use simple movement/captures and support castling with the original rook. Credits and research record dimensions, geometry budget and limitations.
- Validation: 51 tests pass. Browser checked model appearance, a legal king move, switching pawn/king trials without losing the game, saved selection after reload and the 388px CSS layout without horizontal overflow. No browser console errors observed.

## 2026-10-26
- Shipped 9abf0ae; Pages built successfully. Verified the live Greek game restores e4/Nf6 after reload with move history and Undo available, retained model preference and no console errors. Local recovery also verified at 388px CSS width without horizontal overflow.
- Added automatic on-device game recovery after completed moves, Undo, resignation, board flips and starting a new game. Reopening restores the game mode, side, difficulty, position, captures, move history, repetition keys and Undo snapshots. A pending computer turn resumes after the selected model set loads.
- Recovery replays validated legal moves rather than trusting saved boards or display text. Invalid/incompatible saves and unavailable browser storage fall back safely. Saves stay in this browser; starting a new game replaces the saved game. No dock controls added.
- Validation: 49 tests pass, including castling, en passant, underpromotion, repetition, resignation, illegal/corrupt saves and blocked storage. Local browser verified reload, retained move history, Undo across reload, pending computer turn and replacement by a fresh Pass & Play game; no console errors.
- Model source checks (028/038) still need downloadable character files/sign-in; bench imports (027) remain explicitly deferred. Daily follow-up recorded as 043.

## 2026-10-24
- Shipped 0c5faee and verified the live character-review page, real source playback and pause-time read-back, no console errors, and the visible Settings → Asset candidates → Preview animations link. Queue/model notes distinguish public-viewer evidence from the source-file/rig checks still pending.
- Added an embedded character-review workbench linked from Settings → Asset candidates. Load one candidate, select its source animation, Play/Pause/Replay, and save Keep/Discard decisions locally. Previews start paused; discarded candidates do not return automatically, even through direct links. Game-set preferences remain separate.
- Continued model evaluation with the official public viewer: Knight of Tomorrow exposes a 9.8s clip, Pale Knight a 6.8s clip, and Forgotten Knight no animation clips. Source downloads still require sign-in; no rigged replacement adopted or protected model data extracted.
- Validation: 43 tests pass, including review persistence, all-discarded/direct-link behavior, rejected-asset exclusion and unavailable storage. Browser verified all three viewer outcomes, playback/pause time read-back, replay, saved Keep and discard protection across reload. A 358px CSS viewport has no horizontal overflow and full-width picker/load controls.
- Final release 39f1c02 verified live: saved Greek loading, actual pawn move/computer reply, exactly three dock controls, no pause filler, eight candidate links, and no new console errors. Fresh preferences start in Realistic. Forty tests pass; phone checks covered 320px dock layout and 390px Greek icon alignment.
- Simplified the dock to Icons, Overhead and the set selector on one horizontal row. Removed zoom/Battle view buttons, moved Pass & Play Flip into the menu, and removed the three pause-menu filler lines. Realistic is the default for new preferences; explicit saved styles remain available.
- Added three rigged-character research candidates with direct phone-friendly links in Settings: The Knight of Tomorrow, Pale Knight Animated, and The Forgotten Knight. Listings describe rigs; actual files and mobile performance are still unverified. No character was adopted based only on listing tags.
- Connected the Greek Mythology embed to the live chess rules as an optional beta set. The adapter maps all 32 source transforms, handles legal destinations, captures, computer play, undo, castling, en passant, and promotion role badges. Model switching retains the game; the inactive renderer stops rendering. Original Sketchfab scene and attribution remain intact, with no geometry extraction.
- Greek validation: 40 tests pass; browser verified e2–e4 and computer reply, switching sets without losing the position, a pawn capture and undo restoring both pieces.
- Release cb2bf38 verified live: Plated pawns selected, both rotate controls absent, remaining camera controls visible and no console errors.
- Plated pawn release e429792 verified live with original textures and no console errors. All 36 tests pass, including hybrid captures, en passant, shared-resource cleanup and board fit. Browser verified moving a pawn, changing sets without losing the move, saved selection after reload, and phone layout.
- Removed both camera rotation buttons; orbit gestures, Battle view, Overhead and zoom remain. Evaluated the Greek Mythology embed using its official Viewer API: all 32 pieces expose transforms and individual pawn movement/restoration succeeds. A full playable embed still needs a separate game adapter; research records that distinction.
- Added the Plated Knight pawn trial as a third central set choice. Imported textured pawns sit alongside the existing combat figurines; original Figurines and Realistic remain available. Simple motion handles the unrigged pawns and their captures. Shared character meshes and 512px textures reduce the supplied 25.15MB download to 3.24MB, with creator/license credits.
- Model-switch validation: 33 tests pass. Browser verified imported materials, phone layout, a real e2–e4 move, switching sets without losing that move, and saved Realistic selection after reload.
- Added a central main-screen set selector: current figurines or the imported Realistic Chess Set by BenAissa_Karim (CC BY 4.0). Switching preserves the current game and saved combat choice; selection persists across reload.
- Realistic pieces use simple movement/captures, including castling and en passant, rather than combat choreography. Lazy-loaded, shared and quantized piece templates reduce the source download from 18.42MB to 1.78MB plus metadata. Credits link includes source, creator, license and modifications.
- Shipped a3ffee2 and verified Golden Hour, Icons on, computer-mode Flip hidden, and clear Minimal dock on the live page. No console errors in the verified session.
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
