# Iron & Ivory

A 3D chess battlefield published at https://mbogard.com/chess/.

## Play

Choose computer or pass-and-play. Starting a game opens a viewport-filling game view on desktop and mobile. Menu pauses the action and holds AI replies until you continue; it also opens settings, a new game, or the dashboard. Moves toggles the history drawer. Browser fullscreen is available where supported.

- Tap a warrior, then a highlighted square to move. Dragging always controls the camera, including when the drag starts over a piece.
- Drag one finger to orbit with momentum; pinch to zoom; move two fingers to pan; twist two fingers to rotate. Desktop uses drag to orbit, right-drag or Shift-drag to pan, and the wheel to zoom.
- Fit board recenters and frames the entire board, including the tallest pieces. Overhead provides a tactical view. Zoom buttons are also available.

The armies use detailed procedural marble and metal models: articulated armored infantry, barded horses and mounted lancers, crenellated siege towers, mitred bishops, and separately crowned royals. Veined stone, brass inlay, beveled tiles, a carved wood plinth, studio reflections, and directional shadows replace the original flat appearance. Rigid model details are batched by material; shadows update when the pieces move rather than on every idle camera frame.

Pawns rise from a kneeling guard before walking. Captures approach to weapon reach, wind up, accelerate into contact, briefly hold the impact, and follow through. Targets fracture from their actual model geometry into solid chunks with capped cut surfaces; fragments scatter, rotate, bounce, and fade with dust, impact light, a brief camera kick, and layered stone-and-metal audio. Attack direction and piece type drive the choreography. The attacker advances into the captured square after the target has broken apart, then pawns kneel again.

Animation speed and sound are configurable. Reduced-motion preferences skip movement and impact effects. A keyboard-accessible board is available by tabbing past the camera controls. WebGL is required for the 3D scene; a text board remains available if renderer creation fails.

## Develop

No build or package installation is required. Run `npm run preview` and open http://127.0.0.1:8765. Run `npm test` for rules and model checks.

- `rules.js`: legal moves, notation, game state; also serialized into the AI worker.
- `app.js`: interface, turn flow, promotion, worker lifecycle.
- `battlefield.js`: scene, framing, picking, lighting, and capture choreography.
- `camera-controls.js`: tap/orbit separation, pinch, pan, twist, and momentum.
- `pieces.js`: articulated models, rigid-part batching, and model resource disposal.
- `materials.js`: procedural surfaces and studio environment reflections.
- `destruction.js`: solid geometry fracture, debris physics, dust, fading, and cleanup.
- `vendor/`: Three.js 0.180.0 and its MIT license, served locally.

Push `main` to deploy via GitHub Pages. All models and surface textures are generated locally in code. No external model, texture service, build step, or runtime CDN is required.
