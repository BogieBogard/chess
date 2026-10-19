# Iron & Ivory

A 3D chess battlefield published at https://mbogard.com/chess/.

## Play

Choose computer or pass-and-play. Starting a game opens a viewport-filling focus view on desktop and mobile. Menu pauses choreography and holds AI replies until you continue; it also opens settings, a new game, or the full dashboard. Moves toggles the history drawer. The fullscreen button uses browser fullscreen where supported. Tap a piece, then a highlighted square, or drag it to a destination. Use the camera and +/− zoom buttons on touch screens; right-drag to orbit and scroll to zoom on desktop. Flip changes your side of the board. Overhead provides a clearer tactical view.

Pawns kneel at rest, rise before marching, attack on captures, then return to guard. Mounted knights, siege towers, mitred bishops, and differently crowned royals have distinct silhouettes. Captures select thrusts, crosscuts, shield bashes, lance charges, siege rams, staff sweeps, and royal attacks based on piece, target, approach, and sequence. Armies face each other regardless of camera position.

Animation speed and sound are configurable. Reduced-motion preferences skip choreography. A keyboard-accessible board is available by tabbing past the camera controls. WebGL is required for 3D; a text board remains available if renderer creation fails.

## Develop

No build or package installation is required. Run `npm run preview` and open http://127.0.0.1:8765. Run `npm test` for rules and model checks.

- `rules.js`: legal moves, notation, game state; also serialized into the AI worker.
- `app.js`: interface, turn flow, promotion, worker lifecycle.
- `battlefield.js`: Three.js scene, articulated procedural models, camera, picking, choreography.
- `vendor/`: Three.js 0.180.0 and its MIT license, served locally.

Push `main` to deploy via GitHub Pages. Models are intentionally stylized procedural geometry; future versions can replace them with authored, rigged assets while retaining the chess rules and turn flow.
