# Plated Knight pawn and king trials

**Creator:** Ulrik Langvandsbråten ([best3deu](https://sketchfab.com/best3deu)).

**Source:** [Plated Knight – Medieval](https://sketchfab.com/3d-models/plated-knight-medieval-24fd61c662414344bcb81ddc62fd1e3b).

**License:** [Creative Commons Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/), as embedded in the supplied GLB.

**Modifications:** Extracted eight character meshes; omitted display platform and flowers. Baked transforms, centered on feet, scaled to pawn height, and clamped geometry below the feet to the base. Preserved UVs and surface maps; resized 24 textures to 512px and converted to WebP quality 94. Shared geometry and textures across pawns; added team bases and a cool dark-team tint. Normals packed to 8-bit. The original download remains unmodified.

This model has no skeleton or animation clips. Imported pawns and captures involving them use simple movement rather than articulated sword combat. The pawn trial imports pawns; the king trial imports only kings at 1.16× the pawn scale. All other pieces retain their original figurines. Both trials share the same geometry, materials and textures. The separate comparison choice preserves the original set.

Extraction: `node scripts/extract-plated-knight.mjs SOURCE.glb`, then resize the extracted source images to 512px WebP with Pillow, quality 94, method 6, named texture-N.webp. Source images are omitted from the deployed game.
