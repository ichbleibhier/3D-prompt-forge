# Blender assets for web builds

At the High and Maximum tiers, a browser prompt (toy, website, film, game, explainer)
can have the executing model **model its detailed assets in Blender** instead of building
every shape in code. Use Blender for organic, hand-made-looking forms that code builds
poorly: coral, rocks, driftwood, plants, creature and character bodies, food, furniture.
Keep code-built for anything simulated or deformed live (soft bodies, tentacle chains,
water surfaces, particles) and for simple shapes.

The page stays a single offline `index.html`. Blender writes `.glb` files, and
`build.mjs` embeds them in the HTML as base64, next to the inlined three.js.

## When to ask about Blender

Ask only when **both** are true. Otherwise don't mention Blender at all.

1. **The user wants it very detailed.** Their words say so ("very detailed", "realistic",
   "lifelike", "high-detail", "intricate", "make it detailed"), or they picked High or
   Maximum. Cheapest and Balanced never use Blender.
2. **The idea contains things that need Blender**: organic or hand-made-looking forms
   that code builds poorly. These include coral and reefs, rocks and cliffs, trees,
   driftwood and plants, creatures, animals and character bodies, food, sculpted
   props, furniture, detailed vehicles, and ruins or buildings with wear. Things that
   don't need Blender: simple or geometric shapes, abstract scenes, text and UI,
   particles, water surfaces, and anything that deforms live (soft bodies, jelly,
   cloth, tentacle chains). Those stay in code even at Maximum.

If the request already says to use Blender ("model it in Blender") or not to ("code
only"), follow it and don't ask.

When both are true, ask, naming the specific parts:

```
This has detailed parts that would look much better modeled in Blender: [the coral,
the rocks, the octopus's body]. Should the prompt have the coding model use Blender
for them?
a. Yes (recommended): model them in Blender and embed them in the page. If Blender
   isn't available, it builds them in code instead.
b. No: build everything in code.
```

Use a multiple-choice question tool if one is available. Timing:
- The user's words already say "very detailed" (so the tier is High): ask only this question.
- The tier isn't known and the words don't say detailed: ask only the tier question. If
  the answer is High or Maximum and the idea has parts that need Blender, ask this one
  as a short follow-up before writing.
- The tier is Cheapest or Balanced: never ask.

## When to include it

- The Blender test above passed, the tier is High or Maximum, and the user said yes
  (or asked for Blender themselves).
- Use Blender only for the parts named in the question; everything else stays in code.
- Always keep the fallback: the prompt must still describe every Blender asset well
  enough to build in code, because that's what happens when Blender is missing.

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
