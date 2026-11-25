# Failure modes

The shortcuts coding models take when building 3D and animated work, grouped by where
they show up. Pick 4–8 for each prompt, adapt the wording to the idea, and write each
as one `AVOID:` line that names the shortcut and the fix.

Format: **Shortcut** → what to ask for instead.

---

## Form and modeling (all types)

- **Characters built from obvious boxes and spheres** → one continuous silhouette:
  merged/smoothed primitives (SDF smooth-union, subdivision, or lathe), no visible seams
  where parts meet.
- **Default primitive proportions** (unit cube, unit sphere) → proportions stated as
  ratios and sizes in m; e.g. head 0.55 of body height for cute characters.
- **Interpenetrating parts** (arms through torso, prop through hand, hat through head)
  → parts touch at contact points; check with screenshots from 3 angles.
- **Floating objects** with no contact → every resting object has a contact shadow
  (blurred shadow plane or AO) and sits on its support within 1 mm.
- **Flat, untextured surfaces** → procedural micro detail: normal noise, roughness
  variation 0.1–0.2, edge wear, fuzz.
- **Razor-sharp CG edges** → bevel or round every edge so it catches a highlight.
- **Symmetric, lifeless poses** → slight asymmetry: head tilt 4–8°, weight on one side.

## Soft bodies and physics (toys, games)

- **Faking squish by scaling the whole mesh** → deform vertices locally around the
  contact point; neighboring regions bulge to preserve volume.
- **Volume loss on squash** → constrain volume within ±5% (PBD volume constraint or
  scale compensation per region).
- **Jelly that never settles, or settles instantly** → damping stated as a number;
  return to rest within a stated time with one or two visible overshoots.
- **Frame-rate-dependent physics** → fixed timestep with substeps (1/120 s or finer).
- **Objects tunneling through the ground or each other at speed** → swept or substepped
  collision; clamp max velocity.
- **Explosion on first frame** (constraints starting violated) → start from the rest pose
  with zero velocity so no constraint is violated at t = 0.
- **Grab point slipping** → the vertex region under the pointer at grab start stays
  under the pointer while dragging.

## Animation and motion (films, explainers, characters)

- **Feet sliding during walks or plants** → feet locked to world position during
  contact frames; stride length matches body speed × step time.
- **Linear, robotic interpolation** → named easing per move; anticipation before and
  follow-through after any big action.
- **Everything moving at once** → stagger secondary parts by 2–6 frames; one primary
  action at a time.
- **Loop pops at the seam** → every cycle period divides LENGTH; verify frame 0 vs.
  final frame pixel difference.
- **Non-deterministic frames** (Math.random, accumulated state, wall clock) →
  `renderAt(t)` from t alone, seeded PRNG.
- **Camera that never settles** (constant drift, nausea) → camera moves have a start,
  an end, and holds.
- **Weightless motion** → heavy things accelerate slowly and overshoot little; light
  things the opposite; state masses or timings.

## Lighting, materials, and rendering (all types)

- **Washed-out lighting** (ambient light too high, everything evenly lit) → ambient
  ≤ 0.15 or none; environment intensity ~0.4–0.8; a clear key with shadow sides near
  50% luminance.
- **Crushed blacks or clipped highlights** → tone mapping (ACES Filmic or AgX) with a
  stated exposure; check a screenshot histogram.
- **Wrong color space** (dull, gray-looking colors) → `outputColorSpace = SRGBColorSpace`,
  color textures tagged sRGB, hex values converted correctly.
- **Plastic look on everything** → per-material roughness, sheen for fabric, clearcoat
  for lacquer, transmission + thickness for jelly/glass, subsurface tint for skin/wax.
- **Transparency sorting artifacts** (back faces drawn over front, flickering
  transparent overlaps) → `transmission` instead of `opacity` where possible; if alpha
  blending, render inner and outer shells in separate passes with `depthWrite` off and
  explicit `renderOrder`.
- **Shadow acne or peter-panning** → shadow bias and normalBias values stated; shadow
  camera frustum fitted tightly.
- **Aliasing and shimmering edges** → MSAA (antialias: true) or an SMAA/FXAA pass;
  DPR up to 2.
- **Overblown bloom** → bloom threshold ≥ 0.85, strength ≤ 0.6; only emissive accents bloom.
- **Background and subject in the same value** → subject separated from background
  by value (≥ 25% luminance difference) or rim light.

## UI and layout (toys, websites, games, explainers)

- **UI panels covering the scene** → panel docked to an edge, max 280 px wide, HERO
  framed in the remaining area; on narrow screens the panel collapses to a button.
- **Text drawn into the canvas** → real DOM text for headings, labels, captions.
- **Generic dashboard look** (default sliders, system font, gray panels) → panel style
  from PALETTE with stated radius, blur, type.
- **Hint text that never goes away** → fades after first interaction or 6 s.
- **Unreadable text over 3D** → scrim or text-shadow so contrast stays ≥ 4.5:1 over every
  frame it overlaps.

## Scroll websites

- **Two scroll systems fighting** (native scroll + ScrollTrigger + separate 3D tween)
  → one smoothed scroll value drives DOM and WebGL.
- **One-shot animations** that don't reverse → every moment is a function of scroll
  progress, so scrolling back plays it backward.
- **Scroll-jacking** (blocking native scroll, fixed-duration snaps) → native scroll
  with smoothing only; no snapping unless asked.
- **3D hero that's just a spinning object** → the HERO changes meaningfully per section
  (state, material, camera relationship).
- **Desktop-only layout** → stated breakpoints and narrow-screen framing; test at 390 px.
- **Placeholder copy** ("Lorem ipsum", "Feature 1") → real copy in brand voice in the
  SITE config.
- **Generic template structure** (centered hero + three feature cards) → sections
  designed around the concept.
- **Huge first load** → procedural assets, compressed models, render-on-demand.

## Games

- **Floaty, unresponsive controls** → acceleration and deceleration stated; input
  buffer and coyote time.
- **Unfair hits** (damage from things that visually missed) → colliders match visuals
  within 5%; telegraph attacks with a wind-up ≥ 0.3 s.
- **Enemies stacking into one blob** → separation steering between enemies.
- **Unbounded spawns or memory growth** → object pools and caps on live entities.
- **Camera clipping through walls** → camera collision or fade occluders.
- **No restart path** → game over screen with restart in one input.

## Blender

- **Unapplied scale** causing bad bevels/physics → apply transforms after modeling.
- **Default gray world lighting** → explicit world and light setup.
- **Fireflies and noise** → sample count, adaptive threshold, clamp indirect, denoiser.
- **Script that depends on the default cube scene** → start by clearing all objects and
  orphan data; works from factory startup.
- **Hex colors used directly as linear values** → convert sRGB hex to linear before
  setting node inputs.
- **Missing textures on another machine** → generated or packed textures only.
