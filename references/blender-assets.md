# Blender assets for web builds

At the High and Maximum tiers, a browser prompt (toy, website, film, game, explainer)
can have the executing model **model its detailed assets in Blender** instead of building
every shape in code. Use Blender for organic, hand-made-looking forms that code builds
poorly: coral, rocks, driftwood, plants, creature and character bodies, food, furniture.
Keep code-built for anything simulated or deformed live (soft bodies, tentacle chains,
water surfaces, particles) and for simple shapes.

The page stays a single offline `index.html`. Blender writes `.glb` files, and
`build.mjs` embeds them in the HTML as base64, next to the inlined three.js.

## When to include it

- Tier is High or Maximum **and** the user answered that the executing model can use
  Blender ("yes" or "not sure"). See the extra question in `quality-tiers.md`.
- Never at Cheapest or Balanced.
- With "not sure", include it with its fallback; the prompt works either way.
- The prompt must still describe every asset well enough to build procedurally, because
  the fallback uses that description.

## The block to put in the prompt

Add an `ASSETS (Blender)` section after the object or world sections. Adapt it: list the
real assets with sizes, triangle budgets, and PALETTE colors. Keep the mechanics as
written; each line prevents a real failure.

```text
ASSETS (Blender)
- First check for Blender: run `blender --version` (4.2 LTS or newer). If it's missing, try `pip install bpy` in a virtualenv with the Python version bpy supports. If both fail, skip this section, build these assets procedurally as described above, and say so in the delivery note.
- Write assets/build_assets.py and run it with `blender --background --python assets/build_assets.py` (or plain python with bpy). It starts from bpy.ops.wm.read_factory_settings(use_empty=True), seeds random with [seed], and builds every asset from nothing: no downloads, no external textures.
- Assets: [name — method — size in m — triangle budget — PALETTE color], e.g. PROP_coral_branch ×3 variants — curve tubes from a 3-generation branching walk, bevel 2 cm — 0.3–0.9 m — 6,000 tris each — PALETTE coral pink.
- Materials: Principled BSDF only (it exports cleanly to glTF); convert PALETTE hex from sRGB to linear before setting Base Color; roughness per asset. Bake any procedural detail you need into 1024 px images packed into the file.
- Per object: apply all modifiers and transforms, decimate to its triangle budget, set the origin at the base and move it so its lowest point sits at z = 0, name it [HERO_/PROP_/SET_]*.
- Export each asset group with bpy.ops.export_scene.gltf(export_format='GLB', export_apply=True, export_yup=True) to assets/*.glb. No Draco compression: its decoder can't be inlined cleanly. Total .glb size at most [8] MB.
- build.mjs adds three/addons/loaders/GLTFLoader.js (and its imports) to the import map and embeds each .glb as base64 in a `const ASSETS = {...}` object. Load with GLTFLoader.parse() on the decoded ArrayBuffer, never with fetch.
- Repeat assets with InstancedMesh, varying rotation and ±15% scale with a seeded random.
- Deliver assets/build_assets.py and the .glb files with index.html, build.mjs and the app source.
```

## Checks to add to the definition of done

```text
- Render a 512 px clay preview of each asset in Blender (EEVEE, gray #B0B0B0) and look at it before exporting: silhouettes read, nothing inverted or non-manifold.
- In the browser, every Blender asset's bounding box has min y = 0 within 1 mm where it rests on the ground, and its size matches the brief within 5%.
- Log triangle counts per asset; each is within its budget.
```

## Common failures

- Scale not applied → wrong size or skewed instancing. Apply transforms before export.
- Z-up exported as is → assets lying on their side. Export with `export_yup=True`.
- Hex colors used as linear → washed-out, pale materials. Convert sRGB to linear.
- Origin at the center → assets half sunk into the ground. Origin at base, lowest point at 0.
- Node setups the glTF exporter can't read (noise textures wired into color, custom
  shaders) → flat gray materials. Bake them to images or keep the Principled BSDF simple.
- Huge meshes → slow load and low fps. Decimate to the triangle budget.
- `fetch('reef.glb')` → fails from `file://` and breaks the offline rule. Embed and parse.
