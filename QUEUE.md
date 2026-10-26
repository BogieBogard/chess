# Chess improvement queue

Matt sends ideas here; preserve their order and context. Number new ideas consecutively. Work on the earliest unfinished item, retain its original request, and record shipped commits in CHANGELOG.md. Do not replace this queue with a new list when fresh ideas arrive.
| # | Request, in order received | Status |
|---|---|---|
| 001 | Remove screen shake when pieces are destroyed. | Shipped a7fe589. Never restore it. |
| 002 | Offer many animation options with easy comparison and Keep/Discard choices. | Shipped a7fe589; keep extending this system. |
| 003 | Put a realistically sized little chess table in a full-size park, inspired by Central Park. | Shipped 2026-10-21: park, human-scale table, seating, trees, lighting and contextual camera. |
| 004 | Offer general graphics improvements, different toggles and styles. | Shipped 2026-10-21: afternoon, golden-hour, studio and lighter-graphics choices. |
| 005 | Offer different minimal, elegant overall UI designs that feel great on mobile. | Shipped a7fe589: Classic, Minimal and Gallery. Refine through Matt's feedback. |
| 006 | Reduce clutter and interaction friction; give designs a stronger, distinctive visual personality. | Ongoing design rule for every release; retain the three designs as comparison baselines. |
| 007 | Original Duel is the only approved animation from the initial set. Really go for expressive combat animations. | Shipped 2026-10-21: Original Duel default plus Quickdraw, Executioner, Feint & Finish and Whirlwind. |
| 008 | Remove the castle's horizontal pole; crash into captures as a quick vertical wall of force. | Shipped 2026-10-21: pole removed, castle surge and vertical force wall. |
| 009 | Original Duel hits are choppy near contact; make them flow smoothly. | Shipped 2026-10-21: fractures prepared before movement, eased contact, no impact freeze. |
| 010 | Keep incoming ideas organized, consecutive, and in context; knock them out in order. | Active workflow: this numbered queue is canonical. |
| 011 | Legal-move highlights miss valid moves, including a pawn’s initial double advance. | Shipped 2026-10-21: clear unlit destination markers and labels; both initial advances verified for every pawn on both sides. |
| 012 | “NO PARK VIEW IN THE MENU” — Matt meant remove Park view. | Originally misinterpreted as a request to add it. Corrected by item 017: remove all Park view controls. |
| 013 | In Overhead view, overlay piece icons so every occupied position is easy to understand. | Shipped 2026-10-21: contrasting white/black chess-symbol badges track pieces, appear in overhead views and hide in other camera views. |
| 014 | Search Sketchfab for great chess-piece and environment models. | Researched 2026-10-22: MODEL_RESEARCH.md records six candidates, listing metadata and integration evaluation; no external assets imported. |
| 015 | Stop variations of Original Duel. Build entirely different, bold sequences: partial head/body/leg hits, falls onto the side and finishing blows. | Shipped 2026-10-22: Crown breaker, Sweep & finish and Rift unweave use independent scene scripts and a regional-damage model. Tested across all attacker/defender combinations; saved choices retained. |
| 016 | Make asset candidates easy to view from a phone and the live page, with direct links in Settings. | Shipped 2026-10-22: six direct Sketchfab links near the top of Settings plus a mobile-friendly candidates page. |
| 017 | Remove Park view; restore the missing Overhead view, including on small phones. | Shipped 2026-10-22: removed Park view from every menu and toolbar; Overhead is always available in the toolbar, welcome menu and in-game Menu. |
| 018 | Follow-up to 004: compare graphics/environment settings with the same saved Keep/Discard approach as animations. | Shipped 2026-10-23, 792fa7e: full-board candidate/saved comparison, explicit Use action, cancel restoration and saved ratings. Verified live. |
| 019 | Remove welcome-page copy (Welcome to the battlefield, Claim your crown, strategy/soul text, Your allegiance, and No clocks/No rush/next move). Start immediately vs computer, Medium, as White; put alternatives such as Pass & Play in Settings. | Shipped 2026-10-24, f44c661: immediate Medium/White computer game; setup in Settings; welcome copy and bottom tagline removed. Verified live. |
| 020 | Replace the initial flash of the old dashboard (“The battlefield comes alive”) with a modern, elegant loading process. | Shipped 2026-10-24, 7e7890b: minimal loading shell, first populated frame reveal, reduced-motion support and retry. Verified live. |
| 021 | After loading work: default to Overhead; move both Overhead and Battle view one “+” step closer because the game is too zoomed out by default. | Shipped 2026-10-24, c04e5a2: Overhead default, both presets one zoom step closer; verified live. |
| 022 | Make piece icons a central, default-on feature in every camera view, with a one-tap main-screen toggle. Overlapping icons behind the nearest should grow darker/grayer through up to three depth layers. Replace the Fit board button with this toggle (Matt’s follow-up). | Shipped 2026-10-24, 400fb24; verified live. |
| 023 | Make Minimal bottom dock the default interface design. | Shipped 2026-10-24, 962db09; verified Minimal default and retained saved choices. |
| 024 | Remove the “Iron & Ivory” name from the loading screen and actual main screen; the label adds no value. | Shipped 2026-10-24, 41e3ba8; verified live. |
| 025 | Matt cannot find the researched Sketchfab candidates in the UI. Make the existing six-model shortlist easier to discover from the main menu. | Cancelled by Matt 2026-10-24: found the links and says their current location is fine. Retain existing placement. |
| 026 | Asset review: reject Medieval Knight (Andy Woodhead); Plated Knight looks cool and is the promising candidate. | Implemented 2026-10-24: rejected model removed from active shortlist, rejection preserved in research; Plated Knight, Low Poly Chess Set, Realistic Chess Set and both park benches marked liked for file/rig/performance evaluation before adoption. Shipped 3f8c985; verified live. |
| 027 | Add liked park bench candidates to the park scene after checking their files, licenses and performance; Matt likes both benches. | Deferred by Matt 2026-10-24 until back at computer for Sketchfab sign-in. Download opens login; no files inspected. |
| 028 | Continue researching and using suitable shortlisted assets except rejected Medieval Knight. Consider using Plated Knight as the king; retain different chess-set styles where practical. | Continuing evaluation 2026-10-24: supplied Realistic and Plated trials shipped; public viewer clips checked for the three newer character candidates. In-page mobile review with saved Keep/Discard decisions shipped as 0c5faee under 038, verified live. Next adoption checks await downloadable character source files/sign-in: exported rig, weights and game-side performance. Bench downloads remain deferred. |
| 029 | Add a fast main-screen model-set switch, potentially top-left: current stylized animated figurines versus conventional chess pieces, preferably the Realistic set (Low Poly is also liked). Conventional pieces should use simple captures rather than sword combat. | Shipped 2026-10-24, 2a9df52: central saved Figurines/Realistic switch, shared 1.78MB meshes, simple captures and retained game state. 33 tests pass; verified live. Preserve both styles and make switching quick. |
| 030 | Remove “Drag to orbit · Pinch to zoom · Tap to move” from the main game screen; confirm Minimal bottom dock default. | Shipped in 400fb24 and 962db09; verified live. |
| 031 | Make Park · golden hour the default environment. | Shipped 2026-10-24, a3ffee2: Golden Hour default, including migration of the old automatic afternoon default; no new toggle. Verified live. |
| 032 | Refine icon depth shading: gray only almost-covered icons, not slight overlaps. In the lowest White-side view, covered White pawns should gray while barely overlapping Black pieces remain crisp. | Shipped 2026-10-24, a3ffee2: at least 70% coverage required; computer opponent icons stay crisp. Tested and verified live. |
| 033 | Hide Flip board against the computer; only show it in Pass & Play. | Shipped 2026-10-24, a3ffee2; browser verified both modes and live computer mode. |

| 034 | Try the downloaded Plated Knight as pawns in the combat figurine set, as a comparison experiment to see whether it works. | Shipped 2026-10-24, e429792: separate Plated pawns trial alongside original figurines, shared textured meshes and simple movement/captures. 36 tests pass; verified live with original textures and no console errors. |

| 035 | Evaluate embed-only chess sets, including ahingel’s Greek Mythology Pieces, for the central model-set selector. Determine whether an embed can be playable rather than only viewable; avoid unnecessary reloads. | Evaluated 2026-10-24: official Viewer API exposes 32 separate piece transforms; moving and restoring an individual pawn succeeds without reload. Playable integration is feasible but requires a rules/picking/promotion/undo adapter and mobile performance checks. See MODEL_RESEARCH.md. No asset extraction or playable embed claimed. |

| 036 | Remove both rotate buttons beside Overhead; they are unnecessary. | Shipped 2026-10-24, cb2bf38; verified live. Preserve drag/orbit gestures and the other camera controls. |

| 037 | Follow-up to Matt’s embed request (035): connect the Greek Mythology set to the playable model selector if object control is supported, preserving the current game without unnecessary reloads. | Shipped 2026-10-24, a747e3c. 40 tests pass; browser verified AI play, switching, capture/undo, saved reload and aligned phone icons. Live Greek selection and pawn movement verified. Extra promoted roles use an approved pawn/badge representation; original scene and attribution retained. |

| 038 | Search Sketchfab for higher-quality character replacements for the current figurines, prioritizing a usable skeleton/rig so they can support articulated combat. Current figurines are not high quality enough. | Researched 2026-10-24: three new creator-listed rigged candidates, source links and tradeoffs added to Settings and research. Follow-up: public clips verified (Tomorrow 9.8s, Pale 6.8s, Forgotten none); in-page preview/Play/Pause/Replay and persistent review decisions shipped 0c5faee and verified live. 43 tests pass; narrow-screen, source playback and discard persistence checked. Actual source rigs and mobile game budgets await source files; no new character adopted. Rejected Medieval Knight remains excluded. |
| 039 | Make the imported Realistic set the default because the current figurines do not yet deliver a quality experience. | Shipped 2026-10-24, 39f1c02: Realistic default verified with fresh preferences; explicit saved styles retained. |

| 040 | Remove the plus and minus zoom buttons. | Shipped 2026-10-24, 39f1c02; buttons absent on live page. Pinch and scroll zoom retained. |

| 041 | Put the board-set dropdown in the shared horizontal dock alongside Icons and Overhead; these should be its only components. Keep the layout clean and easy to understand. | Shipped 2026-10-24, 39f1c02; three-control dock verified at 320px and live. Floating selector and Battle view removed from dock; Flip moved into Pass & Play menu. Orbit gestures preserved. |
| 042 | Remove useless pause-menu copy: Take a breath, Battle paused, and Return when ready / Your army will wait. | Shipped 2026-10-24, 39f1c02; live menu contains actions without the filler copy. |

| 043 | Daily follow-up: preserve the current game across refresh/reopening without adding dock controls, while model source-file checks remain pending. | In progress 2026-10-26: local move-log recovery with legal replay, restored Undo and resumed computer turns. |

## Working rules

- Ideas add to this queue; they do not interrupt or erase the current item unless Matt explicitly changes the priority.
- Do not add a Park view control. Matt explicitly rejected it. Keep Overhead visible at every screen width, including small phones.
- Ship small tested changes, keep the daily log, and update queue status after verifying the live deployment.
- Preserve approved styles and saved choices. Never re-enable discarded variants automatically.
- Keep camera motion comfortable; never add capture screen shake.
- Latest animation direction (2026-10-22): do not make more Original Duel variations. New experiments must have distinct sequences/effects, regional damage, staged hits or wholly different movement. Retain Original Duel and saved choices as legacy options, not the template for new scenes.
