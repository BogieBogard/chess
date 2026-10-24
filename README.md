# Iron & Ivory

A 3D chess battlefield published at https://mbogard.com/chess/.

## Play

The page opens immediately into a viewport-filling game against the computer on Medium, with you playing White. To choose Pass & Play, another difficulty or side, open Menu → Settings → New game. Setup changes apply when you press Start new game. Menu pauses the action and holds AI replies until you continue; it also opens settings, a new game, or the dashboard. Moves toggles the history drawer. Browser fullscreen is available where supported.

- Tap a warrior, then a highlighted square to move. Dragging always controls the camera, including when the drag starts over a piece.
- Drag one finger to orbit with momentum; pinch to zoom; move two fingers to pan; twist two fingers to rotate. Desktop uses drag to orbit, right-drag or Shift-drag to pan, and the wheel to zoom.
- Fit board recenters and frames the entire board, including the tallest pieces. Overhead provides a tactical view. Zoom buttons are also available.

The armies use detailed procedural marble and metal models: articulated armored infantry, barded horses and mounted lancers, crenellated siege towers, mitred bishops, and separately crowned royals. Veined stone, brass inlay, beveled tiles, a carved wood plinth, studio reflections, and directional shadows replace the original flat appearance. Rigid model details are batched by material; shadows update when the pieces move rather than on every idle camera frame.

Pawns rise from a kneeling guard before walking. Captures approach to weapon reach, wind up, accelerate into contact, briefly hold the impact, and follow through. Targets fracture from their actual model geometry into solid chunks with capped cut surfaces; fragments scatter, rotate, bounce, and fade with dust, impact light, and layered stone-and-metal audio. Attack direction and piece type drive the choreography. The castle has no horizontal ram: its captures use a quick surge with a vertical wall of force. Fractures are prepared before movement so impact does not block the strike. The attacker advances into the captured square after the target has broken apart, then pawns kneel again.

Settings offers fifteen animation styles with repeatable previews and saved Keep/Discard ratings. Original Duel remains the default for new preferences. Three independent staged captures now sit in their own comparison group: Crown breaker removes the head before destroying the body; Sweep & finish cuts the legs, drops the body sideways and finishes it on the ground; Rift unweave remotely extracts and consumes separate regions. These are separate scene scripts, not Original Duel profiles. Preview includes attacker/defender selection, Pause/Resume and Replay. Quickdraw, Executioner, Feint & Finish, and Whirlwind offer different combat choreography without screen shake. Animation speed and sound are configurable. See CHANGELOG.md for daily improvements and future direction. Reduced-motion preferences skip movement and impact effects. A keyboard-accessible board is available by tabbing past the camera controls. WebGL is required for the 3D scene; a text board remains available if renderer creation fails.

Settings also offers a park with afternoon or golden-hour lighting, a studio backdrop, and lighter graphics for phones. Preview a setting directly on the board, compare it against your saved setting, then use it or go back. Keep/Discard ratings persist; discarded settings remain hidden unless requested. Preview never changes the saved choice. One board square represents 5cm; the 40cm board sits on a 75cm-wide, 74cm-high stone chess table. Overhead is available in the toolbar and menus at every screen width. Fit board recenters the game. Trees use instanced geometry.

## Develop

No build or package installation is required. Run `npm run preview` and open http://127.0.0.1:8765. Run `npm test` for rules and model checks.

- `rules.js`: legal moves, notation, game state; also serialized into the AI worker.
- `app.js`: interface, turn flow, promotion, worker lifecycle.
- `battlefield.js`: scene, framing, picking, lighting, and capture choreography.
- `camera-controls.js`: tap/orbit separation, pinch, pan, twist, and momentum.
- `pieces.js`: articulated models, rigid-part batching, and model resource disposal.
- `materials.js`: procedural surfaces and studio environment reflections.
- `staged-damage.js`: capped regional model cuts, detached-section physics and precomputed regional bursts.
- `staged-captures.js`: independent capture scene scripts.
- `MODEL_RESEARCH.md`: Sketchfab model shortlist and adoption evaluation notes.
- `destruction.js`: solid geometry fracture, debris physics, dust, fading, and cleanup.
- `vendor/`: Three.js 0.180.0 and its MIT license, served locally.

Push `main` to deploy via GitHub Pages. All models and surface textures are generated locally in code. No external model, texture service, build step, or runtime CDN is required.
