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
| 021 | After loading work: default to Overhead; move both Overhead and Battle view one “+” step closer because the game is too zoomed out by default. | In progress 2026-10-24. Matt confirmed both views. |

| 022 | Make piece icons a central, default-on feature in every camera view, with a one-tap main-screen toggle. Overlapping icons behind the nearest should grow darker/grayer through up to three depth layers. Replace the Fit board button with this toggle (Matt’s follow-up). | Queued 2026-10-24, after camera item 021. |

| 023 | Make Minimal bottom dock the default interface design. | Queued 2026-10-24; preserve explicitly saved interface choices. |

| 024 | Remove the “Iron & Ivory” name from the loading screen and actual main screen; the label adds no value. | Queued 2026-10-24. |

## Working rules

- Ideas add to this queue; they do not interrupt or erase the current item unless Matt explicitly changes the priority.
- Do not add a Park view control. Matt explicitly rejected it. Keep Overhead visible at every screen width, including small phones.
- Ship small tested changes, keep the daily log, and update queue status after verifying the live deployment.
- Preserve approved styles and saved choices. Never re-enable discarded variants automatically.
- Keep camera motion comfortable; never add capture screen shake.
- Latest animation direction (2026-10-22): do not make more Original Duel variations. New experiments must have distinct sequences/effects, regional damage, staged hits or wholly different movement. Retain Original Duel and saved choices as legacy options, not the template for new scenes.
