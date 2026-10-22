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
| 012 | Park view is missing from the menu. | Shipped 2026-10-21: direct Park view actions in both the welcome/new-game menu and in-game Menu; selecting it enables the park if Studio was selected. |

## Working rules

- Ideas add to this queue; they do not interrupt or erase the current item unless Matt explicitly changes the priority.
- Ship small tested changes, keep the daily log, and update queue status after verifying the live deployment.
- Preserve approved styles and saved choices. Never re-enable discarded variants automatically.
- Keep camera motion comfortable; never add capture screen shake.
- Animation experiments should build on combat choreography, not quiet slides or fades.
