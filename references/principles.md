# Principles for generated prompts

Every prompt this skill writes follows these rules. They exist because coding models
fill gaps with the safest, blandest choice. A prompt that leaves nothing to fill gets a
result that looks intentional.

---

## 1. Exact over vague

Every adjective that describes something visible becomes a number or a name.

| Vague | Exact |
|---|---|
| bouncy | squash to 1.25 × 0.7 (x/z × y) on landing over 0.08 s, spring back with damping 0.55, stiffness 180 |
| warm colors | `#F2A65A` key, `#3B2A4D` shadow, `#FFF4E3` highlight |
| a nice camera | 35 mm equivalent (vertical FOV 38°), 4.2 m from the HERO, 12° above horizon, looking at its chest |
| soft lighting | key 2.4 lux-equivalent at 40° left, fill at 0.35× key, rim `#9AD7FF` at 1.6× from behind-right |
| modern font | headings "Fraunces" 600, body "Inter" 400 at 17 px / 1.55 line height |
| fast | 0.35 s, ease `cubic-bezier(0.22, 1, 0.36, 1)` |
| big | 1.8 m tall; fills 60% of frame height |

Use these units consistently:
- Colors: hex (`#RRGGBB`). Name the role of each (base, shadow, highlight, accent).
- World sizes: meters (1 unit = 1 m). UI sizes: px or rem.
- Time: seconds, and frames for anything rendered at a fixed rate ("0.5 s / frame 15 at 30 fps").
- Springs: stiffness and damping (or damping ratio). Easing: a named curve or cubic-bezier.
- Camera: vertical FOV in degrees or focal length in mm, distance, height, look-at target.
- Type: family name, weight, size, line height.

When the user gives no numbers, invent sensible ones. A confident guess the user can
tweak is worth more than a blank the model fills with a default.

## 2. A swappable brand block at the top

Every prompt opens with a block of short labeled lines that define the subject once:

```
HERO:    a round jelly cat, 0.9 m tall, translucent, ears 0.18 m
PALETTE: body #FF8FB1, inner glow #FFD3E0, shadow #7A2E4A, background #FFF6EE, accent #4BC6B9
SET:     a pale rounded plinth on an infinite cyclorama
PROPS:   a yarn ball (accent), a fish-shaped cushion
ACCENTS: tiny sparkles on boop, a soft contact shadow
```

Use whichever labels fit: HERO, PALETTE, SET (films, toys) or WORLD (games), PROPS,
ACCENTS, plus TYPE (fonts) and BRAND NAME for websites.

After the block, the prompt refers to these only by name: "the HERO's ears", "PALETTE
accent", "drop the PROP onto the SET". Never restate a hex or a description later.
This lets a user swap a jelly cat for a jelly frog by editing five lines.

## 3. Deterministic animation

Anything that plays over time must be reproducible frame by frame. Require:

- `window.renderAt(t)` (seconds) or `window.seek(t)` that draws the exact frame for time
  `t` from `t` alone, with no dependence on previous frames or wall-clock time.
- Normal playback calls `renderAt(elapsed % LENGTH)` each animation frame.
- All randomness from a seeded PRNG (for example mulberry32 with a fixed seed). No
  `Math.random()` in anything visible.
- An exact frame rate and length ("30 fps, 6.0 s, 180 frames").
- For loops: the frame at `t = LENGTH` equals frame 0 (pixel difference under 0.5%). Every periodic motion
  uses a period that divides LENGTH evenly. State which cycles run how many times.
- Physics in a film is either baked analytically (springs as closed-form damped
  sinusoids) or simulated from a fixed start with a fixed timestep and replayed.
- Optional: `?frame=N` URL parameter that renders and holds frame N, for capture.

Interactive toys with live physics don't need `renderAt`, but their physics must use a
fixed timestep (for example 1/120 s substeps) so behavior doesn't change with frame rate.

## 4. Beats with timestamps

Films, explainers, and website transitions get a beat list. Each beat has:

```
0.00–0.80 s (f0–24)   What moves · how it moves (curve, distance, rotation) · why (story purpose)
```

Beats should cover the whole length with no gaps. Include anticipation and
follow-through where a character acts. Mark the loop seam for loops.

## 5. Interaction verbs for interactive work

List every interaction as a concrete verb with its visual result:

```
POKE (click/tap):     a 6 cm dent at the contact point, wobble out over 0.6 s, ears twitch
GRAB + DRAG:          the grabbed region stretches up to 1.6× toward the pointer; release snaps back
SHAKE (fast drag):    whole body jiggles; eyes squeeze shut while speed > 2 m/s
```

Then specify:
- **Idle**: what happens with no input (breathing at 0.25 Hz, blinks every 3–6 s).
- **Controls**: each slider, button, and preset with its range and default.
- **UI look**: background, panel size and position, type, title text, button style.

Verbs beat abstractions. "Interactive" says nothing; "boop, squish, toss" says what to build.

## 6. Technical limits

Unless the user says otherwise:
- One self-contained `index.html` that loads no code from a CDN or any other network
  source. Assets are generated in code or inlined.
- Pin versions and inline the libraries. Install with npm at an exact version
  (`npm install three@0.160.0`) and paste the library source into the HTML. For three.js:
  - `build/three.module.js` has no imports of its own. The addons in `examples/jsm`
    import each other by relative path (`EffectComposer.js` imports `./Pass.js` and
    `../shaders/CopyShader.js`), and relative paths can't resolve once the code is inlined.
  - So the app source keeps normal imports (`'three'`, `'three/addons/controls/OrbitControls.js'`)
    and a short Node script, `build.mjs`, writes `index.html`. It reads
    `three.module.js` and every addon used, follows their relative imports
    transitively, rewrites each one to its `three/addons/<path>` specifier, and emits a
    `<script type="importmap">` that maps every specifier to a
    `data:text/javascript;base64,…` URL. The app follows in an inline
    `<script type="module">`, with any `</script` in inlined code escaped.
  - Expect about 1.7 MB for three.js plus a few addons. That's fine for a local file.
  - Deliver `index.html` together with `build.mjs` and the app source, so the file can
    be rebuilt.
  Treat every other library the same way: exact npm version, ESM build inlined under its
  bare specifier (GSAP 3.12.5, Lenis 1.1.13, cannon-es 0.20.0, …).
- Write the inlining instruction into the prompt itself. The executing model never sees
  this file, so a bare "inline three.js" isn't enough; use the standard line in the
  templates. That line (about 60 words) doesn't count toward the length bands in §11.
- The definition of done includes an offline check: with the network blocked, the page
  makes zero requests and logs `THREE.REVISION` 160 at startup.
- Name the renderer: WebGL2 via `THREE.WebGLRenderer`, or WebGPU with a WebGL2 fallback.
  Set `outputColorSpace = SRGBColorSpace`, a named tone mapping (ACES Filmic or AgX),
  and exposure.
- Cap `devicePixelRatio` at 2.
- Mouse and touch, stated in every prompt. Toys and games: Pointer Events with
  `touch-action: none` on the canvas. Websites: wheel, trackpad, and touch scrolling all
  feed the same smoothed value. Films and explainers: playback controls work with
  mouse, touch, and keyboard.
- Target 60 fps on a mid-range laptop. Say what to cut first if it misses (shadow map
  size, particle count, post passes).
- `prefers-reduced-motion: reduce`: state what changes (no camera shake, slower or
  static loops, scroll animations become fades).
- Handle resize. No console errors or warnings.
- No CDN or remote script, module, or import-map URL anywhere in the file.

For Blender scenes, the equivalent is: Blender version, render engine, sample count,
resolution, color management, and a Python script that builds the scene.

## 7. Name the failure modes

Every prompt includes 4–8 AVOID lines aimed at the shortcuts models take for this type.
Pull them from `failure-modes.md` and adapt them to the idea. Each line names the
shortcut and says what to do instead:

```
AVOID: scaling the whole mesh to fake squish. Deform vertices around the contact point and preserve volume.
```

Choose lines for the risks this idea actually carries. A website doesn't need
"feet sliding"; a walking character does.

## 8. A definition of done

Every prompt ends with a verification section that the executing model must complete
before delivering:

1. Open the file in a browser (headless is fine).
2. Capture named screenshots or frames: "frame 0, frame 90, frame 179" or "hero at load,
   section 3 at 50% progress, footer, then the same at 390 px wide".
3. Read the console. Zero errors, zero warnings.
4. Exercise every interaction listed and confirm its visible result.
5. Compare against specific checks: loop seam (frame 0 vs. last frame), nothing
   floating (contact shadows present), nothing clipped, text readable, fps ≥ 55.
6. Fix anything that fails and repeat. Deliver only after everything passes, along
   with the screenshots and a one-line note per check.

The checks must be specific to this prompt. "Make sure it works" is not a check.

## 9. Calm, confident wording

- One line of intent is enough: "It should feel like a premium handmade toy."
- Never use "perfect", "stunning", "amazing", "award-winning", "breathtaking",
  "identical", "ultra-realistic", "insanely detailed", or "best-in-class". This holds
  in checks too: write "pixel difference under 0.5%" or "renders the same pixels",
  not "identical".
- Never repeat an instruction for emphasis or use ALL CAPS to plead. Section labels
  (HERO, AVOID, CHECKS) are fine.
- Prefer short declarative sentences. Specifics raise quality; volume does not.

## 10. Original only

- Never ask for copyrighted characters, real brand logos or trademarks, a named
  studio's or artist's look passed off as the user's own, or a copy of a reference site.
- If the user names one, write an original equivalent with its own name, silhouette,
  and palette, and say so in one line in `Decisions:` ("Used an original round-eared
  space mouse instead of [named character]").
- A real business the user owns or names as theirs is fine to use by name; still draw
  any logo as an original mark unless they supply the file.
- References are for measuring, not copying: "pacing similar to a 6 s product teaser:
  one reveal, one hero move, one hold" is fine. "Make it look exactly like [site]" is not.
- Fonts: use freely licensed families (Google Fonts or system stacks).

## 11. Length matches ambition

| Project | Target length of the prompt |
|---|---|
| Small toy: one object, 1–2 interactions | 200–350 words |
| Toy with 3+ interactions or a control panel | 350–500 words |
| Short loop (≤10 s), small game | 450–850 words |
| Full website, longer film, explainer, Blender scene | 600–1,000 words |

The BRAND block, AVOID list, and definition of done are never cut to hit a number.
Cut prose, repeated context, and anything the model would do well without being told.

Never pad. Every line should change what gets built. If a section has nothing specific
to say, make it one line or drop it.

Count the words before sending. Drafts almost always run long. Cut in this order:
1. Prose that restates the BRAND block or the concept.
2. Technical lines that restate what the template's defaults already imply; merge
   them into one line per topic.
3. Secondary detail in beats and sections (keep timings, sizes, and the "why").
4. Optional sections (SOUND, PROPS) if they don't carry the idea.

Write labeled lines and fragments, not paragraphs: "Key #FFE1B8, 45° left, 2.4" beats
"The key light should be a warm color coming from about 45 degrees to the left".

## 12. Follow-up revisions

After the prompt, give 2–3 revision prompts for the problems most likely to appear in a
first result for this specific build. Each one:
- names a visible symptom ("If the jelly looks like solid plastic"),
- gives a measurable fix that uses BRAND names and numbers ("raise transmission to 0.85,
  thickness to 0.4 m, and add a 0.15 subsurface tint of PALETTE inner glow"),
- fits in one or two lines.
