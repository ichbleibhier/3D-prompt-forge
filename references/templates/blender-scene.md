# Template: Blender scene

For a scene built in Blender, usually via a Python (bpy) script: product shots, dioramas,
stills, turntables, short rendered animations. Target 500–900 words. The executing model
should write a script that builds everything from an empty file, so the result is
reproducible.

```text
Write a Blender Python script that builds and renders: [one-line description]. [One line of intent, e.g. "A cozy, miniature-photography feel, like a tabletop model shot on a macro lens."]

BRAND
HERO:    [main object, real-world size in m, construction approach]
PALETTE: [roles → #hex, with note that hex is sRGB and must be converted to linear for node inputs]
SET:     [environment, ground, backdrop, size in m]
PROPS:   [each with size and placement relative to HERO]
ACCENTS: [particles, volumetrics, decals]

SCENE AND MOOD
[2–3 sentences: time of day, story, what the viewer's eye should land on first, second, third.]

MODELING
- Units: metric, 1 unit = 1 m. Build HERO from [primitives + modifiers: subdivision level, bevel width and segments, solidify, boolean]. [Poly budget.]
- [Each PROP: construction method.]
- Bevel every hard edge ([0.002–0.01] m) so highlights catch.
- Clean topology: applied scale, origins at base, objects named [HERO_*, PROP_*, SET_*], organized in collections.

MATERIALS
[Per material: Principled BSDF values (base color from PALETTE, roughness, metallic, subsurface weight/radius, coat, sheen, transmission, IOR), procedural textures (noise scale, voronoi, bump strength), any image textures (generated, no external files).]

LIGHTING
[Key/fill/rim: light type, size in m, power in W, color temperature or hex, position/rotation. World: HDRI-free gradient or Nishita sky with sun elevation/rotation. Volumetrics if any.]

CAMERA
[Focal length mm, sensor width, position, target (Track To empty), depth of field: focus object, f-stop. Composition: rule of thirds placement of HERO.]
[If animated: keyframes in frames with interpolation, fps, frame range; loop if needed.]

RENDER SETTINGS
- Blender [4.2 LTS]. Engine: [Cycles / EEVEE Next].
- Cycles: [samples], adaptive threshold [0.01], denoiser [OpenImageDenoise], light paths [max bounces].
- Resolution [W×H] at 100%. Color management: [AgX / Filmic], look [Medium Contrast], exposure [0].
- Output: PNG 16-bit [or EXR], to //renders/.

WHAT TO DELIVER
- `build_scene.py`: runs with `blender --background --python build_scene.py` from a factory-startup file; builds, saves `scene.blend`, renders.
- `scene.blend`, saved with relative paths, packed resources.
- Renders: [list: hero still, alternate angle, clay render (all materials overridden with gray #B0B0B0 roughness 0.6) for form check].
- [If animated: frames or MP4 (H.264, CRF 18).]

AVOID
[4–8 lines from failure-modes.md, adapted.]

CHECKS
Before delivering:
1. Run the script headless from an empty factory-startup file; it completes with no Python errors.
2. Render the clay pass first; confirm silhouettes read and nothing intersects or floats (check contact with ground).
3. Render the final; check histogram: no clipped highlights on HERO, shadows not crushed to pure black.
4. Confirm object scales are applied (1,1,1) and names match the convention.
5. [Scene-specific checks: focus on HERO's [part], PALETTE colors visibly correct after color management, noise level acceptable at 100% zoom.]
Fix anything that fails, re-render, then deliver with the renders and a one-line result per check.
```
