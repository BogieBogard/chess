# Sketchfab model shortlist — October 22, 2026

Requested by Matt, queue item 014. This is a researched shortlist, not an asset import. Counts, rigging and license labels below are from the creators' indexed Sketchfab listings. Several direct page fetches returned HTTP 403; downloaded archives, joints, texture budgets and separation of mesh parts have not been inspected. No third-party model is included in the game by this release.

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

Matt likes Plated Knight, both conventional chess sets and both benches. He suggested using Plated Knight as the king and asked to continue evaluating usable assets. Medieval Knight is explicitly rejected and removed from the live active shortlist. No files have been imported; file, license, rig and mobile-performance inspection is still required.

## Download access — October 24, 2026

Direct browser inspection confirms Classic Park Bench lists CC BY 4.0, 4.8k triangles and 2.7k vertices. Its Download 3D Model action opens Sketchfab sign-in. Matt has an account but explicitly deferred Sketchfab work until back at his computer. No matching downloaded archives were found by filename in Downloads. Do not scrape viewer data as a substitute for source downloads. Next: signed-in source/GLB download, archive/license inspection, texture/draw-call budgets, scale normalization, then phone profiling. Benches, alternate king, and the model-set switch remain deferred rather than claimed shipped.

## Supplied GLBs inspected — October 24, 2026

Matt supplied Realistic Chess Set (18,422,664 bytes) and Plated Knight (25,146,716 bytes) in Downloads. Both contain embedded CC BY 4.0 attribution matching the listed creators.

Realistic Chess Set has 33 separate meshes (32 pieces plus board), 3 materials, one board image, no skins and no animation clips. Six canonical white piece geometries were extracted, world transforms baked and bases centered. Shared templates and 16-bit positions/8-bit normals reduce the game asset to 1,775,160 bytes plus metadata; the board texture is omitted. Black and white source material colors are retained. The full army still contains approximately 762.7k piece triangles; only six geometry buffers and two materials are shared across 32 single-mesh pieces. Tests cover square fit, bounds, resource sharing, castling, en passant and capture routing. The imported style uses simple captures while the figurine animation preference stays intact.

Plated Knight’s supplied GLB has 18 meshes: 8 armor/character meshes plus platform and decorative flowers. It contains 32 images, no skins, no joint weights and no animation clips. This contradicts treating this particular download as ready-rigged. A pawn experiment needs deliberate rigid-part articulation or a different rigged source; a mesh swap cannot reuse the existing kneeling/walking/sword rig automatically. No Plated mesh imported into production yet.

Greek Mythology Pieces by ahingel: embed supplied by Matt. Official Viewer API documents node maps, local transform control and click events, so no full-page reload is inherently necessary. This model still needs a node-separation and usage check before it can be called playable. Embedding is not source-model redistribution and does not merge its board into the current park scene.

## Plated Knight pawn trial — October 24, 2026

Matt supplied the GLB and explicitly requested pawns in the figurine set. Embedded metadata confirms CC BY 4.0 and Ulrik Langvandsbråten (best3deu). Eight character meshes, 72,561 triangles, no skin/skeleton or animation clips. Platform/flowers excluded. Shared meshes and 24 maps resized to 512px WebP total 3.24MB. Static pawn movement/captures only; other pieces remain the existing combat figurines. Original set retained as a separate choice. See assets/plated/CREDITS.md for attribution and modifications.

## Greek Mythology embed evaluation — October 24, 2026

Source: [Chess Set – Greek Mythology Pieces by ahingel](https://sketchfab.com/3d-models/chess-set-greek-mythology-pieces-10b53b9575294dfb915f8c0b5ea0a2fc), supplied by Matt as an embed.

Verified with the official Viewer API in a local test page: viewerready succeeds; getNodeMap returns 102 nodes, including 32 separately named piece MatrixTransforms (16 White, 16 Black) and a board transform. A White pawn's local matrix was read, translated through setMatrix, and restored successfully. No download, extraction, purchase or account access was used. This confirms runtime object control without a page reload. It does not yet connect the embed to our chess rules.

A playable option is technically feasible through an embed-specific adapter: map the 32 transforms to chess squares, route picking/legal moves through our rules, hide captures, handle promotions (reuse a matching piece node), restore undo, and set camera presets. The embedded set retains Sketchfab's own board, scene, loading and attribution; it cannot become a mesh style inside our Three.js park just by embedding. It also depends on a live third-party viewer; mobile loading/performance must be checked before shipping it as a game mode. Source is offered on the store; embedding access does not establish a license to extract or redistribute the models.

Official reference: [Viewer API object controls](https://sketchfab.com/developers/viewer/functions), [initialization](https://sketchfab.com/developers/viewer/initialization). Evaluation complete; this set is not advertised as a playable selection yet.
