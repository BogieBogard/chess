# Sketchfab model shortlist — October 22, 2026

Requested by Matt, queue item 014. The original listing-based shortlist is preserved below. Current status: Realistic and the Plated pawn/king trials are installed; Greek Mythology is playable through its official embed. Dated sections record source-file checks and later public-viewer evaluation. Listing claims alone do not establish an exported rig.

| Candidate | Creator | Listing information | Fit / next evaluation |
|---|---|---|---|
| [Medieval Knight — rigged for UE4/5](https://sketchfab.com/3d-models/medieval-knight-rigged-for-ue45-1c7a83c0832a4ab28d9f1a46d282fcf9) | Andy Woodhead | 51.1k triangles; CC Attribution; creator describes FBX and UE mannequin rig | REJECTED by Matt 2026-10-24. Do not recommend, import or restore this candidate. Retained here only as review history. |
| [Plated Knight — Medieval](https://sketchfab.com/3d-models/plated-knight-medieval-24fd61c662414344bcb81ddc62fd1e3b) | Ulrik Langvandsbråten | 75.3k triangles; CC Attribution; creator describes a rig, but no animation clips uploaded to Sketchfab | Liked by Matt 2026-10-24; consider as the king. Needs mobile budget and rig inspection. |
| [Low Poly Chess Set](https://sketchfab.com/3d-models/low-poly-chess-set-0f440e2b01ca42f8b3fdee8178c51f20) | hanoldaa | 8.6k triangles; CC Attribution; created for Unity | Liked by Matt 2026-10-24. Lightweight conventional-piece style alternative. Static sculpted pieces would need a separate articulation/destruction pipeline. |
| [Realistic Chess Set — Full Board with Pieces](https://sketchfab.com/3d-models/realistic-chess-set-full-board-with-pieces-4f5a651ec0c7405badbcf478ed1cab8f) | BenAissa_Karim | 762.9k triangles; CC Attribution; listing describes PBR stone materials | Liked by Matt 2026-10-24. Visual reference / possible high-detail style; requires substantial optimization before mobile use. |
| [Classic Park Bench — Low Poly](https://sketchfab.com/3d-models/classic-park-bench-low-poly-01a5b64427984632bb44242da3813bb1) | Berk Gedik | 4.8k triangles; CC Attribution; Substance Painter | Liked by Matt 2026-10-24. Park-prop candidate: distinctive traditional slats and ironwork at a modest geometry budget. |
| [Park bench — Game ready](https://sketchfab.com/3d-models/park-bench-game-ready-fd4d821a9e5f46cab786d4530133fc30) | PT34 | 2k triangles; CC Attribution; Substance Painter | Liked by Matt 2026-10-24. Very light alternative for repeated park seating. |

Before integration, inspect the downloaded license and include the creator, source link, license and modifications in the game credits. Do not assume a rigged character already contains usable combat animations or detachable body parts. Keep the current procedural models available for comparison.

## Review — October 24, 2026

Matt likes Plated Knight, both conventional chess sets and both benches. He suggested using Plated Knight as the king and asked to continue evaluating usable assets. Medieval Knight is explicitly rejected and removed from the live active shortlist. At this initial review no files had been imported; subsequent supplied-file checks and integrations are recorded below.

## Download access — October 24, 2026

Direct browser inspection confirms Classic Park Bench lists CC BY 4.0, 4.8k triangles and 2.7k vertices. Its Download 3D Model action opens Sketchfab sign-in. Matt has an account but explicitly deferred Sketchfab work until back at his computer. No matching downloaded archives were found by filename in Downloads. Do not scrape viewer data as a substitute for source downloads. Next: signed-in source/GLB download, archive/license inspection, texture/draw-call budgets, scale normalization, then phone profiling. This was the initial deferral; Matt subsequently supplied Realistic and Plated GLBs, and the set switch shipped. Bench imports remain deferred.

## Supplied GLBs inspected — October 24, 2026

Matt supplied Realistic Chess Set (18,422,664 bytes) and Plated Knight (25,146,716 bytes) in Downloads. Both contain embedded CC BY 4.0 attribution matching the listed creators.

Realistic Chess Set has 33 separate meshes (32 pieces plus board), 3 materials, one board image, no skins and no animation clips. Six canonical white piece geometries were extracted, world transforms baked and bases centered. Shared templates and 16-bit positions/8-bit normals reduce the game asset to 1,775,160 bytes plus metadata; the board texture is omitted. Black and white source material colors are retained. The full army still contains approximately 762.7k piece triangles; only six geometry buffers and two materials are shared across 32 single-mesh pieces. Tests cover square fit, bounds, resource sharing, castling, en passant and capture routing. The imported style uses simple captures while the figurine animation preference stays intact.

Plated Knight’s supplied GLB has 18 meshes: 8 armor/character meshes plus platform and decorative flowers. It contains 32 images, no skins, no joint weights and no animation clips. This contradicts treating this particular download as ready-rigged. A pawn experiment needs deliberate rigid-part articulation or a different rigged source; a mesh swap cannot reuse the existing kneeling/walking/sword rig automatically. The later pawn trial below imports these static meshes; it does not invent a missing skeleton.

Greek Mythology Pieces by ahingel: embed supplied by Matt. Official Viewer API documents node maps, local transform control and click events, so no full-page reload is inherently necessary. This model still needs a node-separation and usage check before it can be called playable. Embedding is not source-model redistribution and does not merge its board into the current park scene.

## Plated Knight pawn trial — October 24, 2026

Matt supplied the GLB and explicitly requested pawns in the figurine set. Embedded metadata confirms CC BY 4.0 and Ulrik Langvandsbråten (best3deu). Eight character meshes, 72,561 triangles, no skin/skeleton or animation clips. Platform/flowers excluded. Shared meshes and 24 maps resized to 512px WebP total 3.24MB. Static pawn movement/captures only; other pieces remain the existing combat figurines. Original set retained as a separate choice. See assets/plated/CREDITS.md for attribution and modifications.

## Greek Mythology embed evaluation — October 24, 2026

Source: [Chess Set – Greek Mythology Pieces by ahingel](https://sketchfab.com/3d-models/chess-set-greek-mythology-pieces-10b53b9575294dfb915f8c0b5ea0a2fc), supplied by Matt as an embed.

Verified with the official Viewer API in a local test page: viewerready succeeds; getNodeMap returns 102 nodes, including 32 separately named piece MatrixTransforms (16 White, 16 Black) and a board transform. A White pawn's local matrix was read, translated through setMatrix, and restored successfully. No download, extraction, purchase or account access was used. This confirms runtime object control without a page reload. It does not yet connect the embed to our chess rules.

A playable option is technically feasible through an embed-specific adapter: map the 32 transforms to chess squares, route picking/legal moves through our rules, hide captures, handle promotions (reuse a matching piece node), restore undo, and set camera presets. The embedded set retains Sketchfab's own board, scene, loading and attribution; it cannot become a mesh style inside our Three.js park just by embedding. It also depends on a live third-party viewer; mobile loading/performance must be checked before shipping it as a game mode. Source is offered on the store; embedding access does not establish a license to extract or redistribute the models.

Official reference: [Viewer API object controls](https://sketchfab.com/developers/viewer/functions), [initialization](https://sketchfab.com/developers/viewer/initialization). At this evaluation stage the set was not yet playable. Follow-up: the optional playable Greek beta shipped as a747e3c; see GREEK_EMBED.md for integration behavior, promotion representation and hosted-viewer limitations.

## Higher-quality rigged character search — October 24, 2026

Matt wants higher-quality replacements with usable skeletons. The rejected Medieval Knight remains excluded. These new candidates are linked in Settings and candidates.html; they are not installed or endorsed as compatible yet. Facts below come from creator listings, not inspected download files.

- **[The Knight of Tomorrow](https://sketchfab.com/3d-models/the-knight-of-tomorrow-1a54cac1b89a4c9092f810c59b04f816) — Kondrashov Anton**: 65.5k triangles · Custom skeleton and expressive animation listed. Creator listing offers download under CC Attribution. Promising for character and movement personality; test rig export, detachable weapon and retargeting.
- **[Pale Knight Animated](https://sketchfab.com/3d-models/pale-knight-animated-9594a385689745eb89effb9f57d72142) — mara3m**: 59.8k triangles · Simple rig and idle animation listed. Creator listing offers download under CC Attribution. Good armored direction; idle-only/simple rig means combat range remains unproven.
- **[The Forgotten Knight](https://sketchfab.com/3d-models/the-forgotten-knight-d14eb14d83bd4e7ba7cbe443d76a10fd) — dark_igorek**: 223.7k triangles · Rig listed; needs a lighter game mesh. Creator listing offers download under CC Attribution. Detailed armor and strong art direction, but too heavy to repeat unchanged across a full army; requires mesh/texture optimization and a mobile budget.

Next file checks: exported GLB must contain skins/joints/weights (not merely a listing tag), separate or usable weapon attachment, animation clips and sensible bind pose; test walking, sword contact and capture choreography, joint counts, skinning/draw-call costs, texture memory and one-army phone performance. No account actions, purchases or artist messages were made. The Plated Knight listing says the author rigged it but did not upload animations; Matt’s supplied GLB demonstrably contains no skins or clips, so a different original-format export could be investigated later. An auto-rigged alternative was excluded from this shortlist because its own listing reports sword/cape weights attached to the legs.

## Public-viewer animation checks — October 24, 2026 (daily follow-up)

Continued queue items 028 and 038 using the official Viewer API, without extracting geometry or bypassing source-download sign-in. Pale Knight's Download action opens sign-in; no new candidate source files are available in Downloads. Bench deferral remains unchanged.

| Candidate | Public viewer result | Interpretation |
|---|---|---|
| The Knight of Tomorrow | One `Action.001` clip, 9.8 seconds; 12 exposed scene nodes. Play/Pause/Replay work; paused playback time was read back from the API. | Useful expressive motion to review. Exported skeleton, weights, weapon attachments and retargeting still unverified. |
| Pale Knight Animated | One `__Knight\|Action` clip, about 6.8 seconds; 20 exposed scene nodes. Viewer loads and clip playback works. | Confirms an actual preview clip, not a combat animation library. Source rig/weights still unverified. |
| The Forgotten Knight | Zero animation clips; 43 exposed scene nodes. Model renders as a static preview. | Do not describe this viewer as animated. The creator's rig claim still needs source-file inspection; its larger geometry budget remains a concern. |

The new review section in candidates.html lets Matt load one character at a time, inspect source clips, play/pause/replay, and save browser-local Keep/Discard decisions. It starts previews paused, closes the previous viewer when switching, and never loads a discarded candidate from a saved/direct-link fallback. It does not change the selected game set or install models. Runtime metadata describes only what the public viewer exposes; scene-node counts do not establish skin/joint bindings.

Reference: [Sketchfab Viewer API animation controls](https://sketchfab.com/developers/viewer/functions). Next adoption step still requires source GLB/original archives with license, actual skin/weights/clips, weapon separation, and measured game-side mobile cost. No rejected model has been restored.

## Plated Knight king comparison — October 27, 2026

Continuing queue 028 with Matt’s suggestion to try the supplied Plated Knight as king. The separate Plated king set imports only the two kings; all other pieces retain the original figurines. Plated pawns remains a separate saved comparison choice and Realistic remains the new-preference default. Switching preserves the current game.

The king uses the existing extracted meshes, materials and 512px textures at 1.16× pawn scale: approximately 1.746 high, 0.879 wide and 0.945 deep on a unit square. Two characters contribute 145,122 triangles and reuse the pawn trial’s buffers/textures, with no extra asset download. Full mixed army geometry totals 586,898 triangles across 446 meshes; this is a geometry/draw budget, not a claim of physical-phone frame rates.

Source license/creator and modifications remain in assets/plated/CREDITS.md. The supplied GLB still has no skeleton, weights or clips; importing it as king does not add articulated combat. Kings use simple motion/captures and move the original rook during castling. Tests cover both colors, both castling directions, capture styles, square fit, resource sharing and cleanup. No new source asset or rejected candidate adopted.
