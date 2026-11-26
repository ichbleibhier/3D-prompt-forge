# Worked examples

Four original examples, each showing a different path through the skill: the user's
one-line input, the questions the skill asks, the answers, and the full output. Use them
to calibrate tone, density, and length. Don't reuse their content; reuse their shape.

| # | Type | Tier | Path shown |
|---|---|---|---|
| 1 | Interactive toy | Balanced | Tier question answered with "defaults" |
| 2 | Scroll website | High | Tier question, then the Blender follow-up (food is organic) |
| 3 | Looping film | Balanced | Tier question; seamless 8 s loop with a moving subject |
| 4 | Playable game | Cheapest | "quick prototype" picks the tier, so no question |

---

## Example 1: interactive toy (Balanced)

**Input:** "a knitted wool cactus I can squeeze and pluck"

**Skill asks:** the tier question. The idea isn't described as detailed, and Balanced
never uses Blender, so there's no Blender question.

**User:** "defaults"

**Output:**

Decisions: Balanced tier; interactive toy; 0.36 m knitted cactus in a terracotta pot; "pluck" pulls a felt flower off on a stretching yarn stem, and a new bud grows back; knit stitches from a generated normal map plus wool sheen; WebGL2.

```text
Build a single-file interactive 3D toy: a knitted wool cactus in a little pot to squeeze, pluck and boop. A handmade gift from someone who knits.

BRAND
HERO:    knitted cactus, 0.36 m with pot: 0.24 m column, two arms (0.09, 0.07 m) curving up, 14 yarn-tuft spines, a 0.06 m felt flower on top
PALETTE: wool #6E9A5B, wool shadow #3F5E3A, wool highlight #A8C98F, flower #F2A3B3, pot #C8643C, background #F4EDE2
SET:     a 0.11 m PALETTE pot on a pale wooden shelf
ACCENTS: contact shadow; 12 wool fluff specks when the flower pops off

OBJECT: one smooth-union SDF mesh, no seams. Knit: a 512 px canvas normal map of V-stitches, 7 per 10 cm, strength 0.8. MeshPhysicalMaterial roughness 0.95, sheen 1.0, sheenRoughness 0.45, sheenColor PALETTE wool highlight; 6 fuzz shells 1.5 mm apart. Closed stitched eyes (^ ^) in PALETTE wool shadow. Flower: 5 felt petals on an 8-segment yarn stem.

PHYSICS: PBD on a 700-particle cage, fixed 1/120 s substeps, base pinned. Volume within ±5%. Stiffness 0.4 (arms 0.3), damping 0.55, rest in 1.0 s.

INTERACTIONS
SQUEEZE (drag / pinch): compresses up to 30%, bulges, arms lift 12°, eyes pop open.
PLUCK (drag the flower up): the stem stretches up to 6 cm, then pops off with a soft synthesized "tup" and the fluff burst.
DROP (release it): within 8 cm of the top it snaps back on; elsewhere it falls and bounces twice. After 4 s a new bud grows in over 1.2 s.
BOOP (tap a tuft): flattens 70%, springs back with 3 oscillations at 5 Hz.
IDLE: after 3 s, sway 1.5° at 0.2 Hz.

CONTROLS + UI: right 220 px panel, white 70%: Squish (0.1–1.0, default 0.4), Reset. Title "Wool Cactus" top-left, "Nunito" 800 28 px, PALETTE wool shadow. Hint "squeeze · pluck · boop" fades after first use. The panel never covers the HERO.
CAMERA: FOV 30°, 1.3 m away, 12° down; orbit ±55°, zoom 0.9–1.8 m.

TECHNICAL: One index.html, three.js 0.160.0. No CDN: `npm install three@0.160.0`, then a build.mjs inlines node_modules/three/build/three.module.js and every addon used (examples/jsm), following their relative imports and rewriting them to `three/addons/<path>`, as base64 `data:` URLs in an import map, with the app in an inline module. Deliver index.html, build.mjs and the app source. WebGL2, sRGB, AgX, DPR ≤ 2. Warm key #FFE9CC 45° left, fill 0.3×, cool rim; no ambient. Pointer Events (mouse + touch), touch-action: none. 60 fps; if under 55, use 4 fuzz shells. prefers-reduced-motion: no sway, the bud appears without growing.

AVOID
- Scaling the whole mesh to fake a squeeze.
- A smooth plastic cactus; the knit must read at 1.3 m.
- The stem as a rigid stick.
- The flower sinking into or floating above the shelf.
- Seams where the arms meet the column.
- Washed-out light: shadow side near 45%.

DONE WHEN
Open it in a browser; screenshot idle, mid-squeeze, mid-pluck, the dropped flower, and 390×844. Zero console errors or warnings. With the network blocked, the page loads with zero requests and logs THREE.REVISION 160 once at startup. Exercise every interaction with mouse and simulated touch. Volume within ±5%; rest within 1.0 s; the bud regrows; contact shadows under pot and flower; fps ≥ 55 over 10 s. Fix and repeat until all pass, then deliver screenshots.
```

**Follow-up revisions**

```text
If the knit doesn't read and it looks like green felt: raise the stitch normal strength to 1.3, enlarge the stitches to 5 per 10 cm, and darken the grooves toward PALETTE wool shadow by 20%.
```
```text
If plucking feels like nothing happened: add a 4-frame hold at full stretch before the pop, kick the cactus back 3° on release, and scatter the fluff 0.15 m instead of 0.08 m.
```

Best run in: a mid-tier coding model in an agent that can open a browser, take screenshots and simulate pointer drags.

---

## Example 2: scroll website (High, with Blender)

**Input:** "a website for a ramen stall at a night market"

**Skill asks:** the tier question.

**User:** "3" (High)

**Skill asks next:** the Blender question, because the tier is High and food is an
organic form that code builds poorly.

> This has detailed parts that would look much better modeled in Blender: the bowl,
> the chashu, the soft egg, the paper lantern. Should the prompt have the coding model
> use Blender for them?
> a. Yes (recommended): model them in Blender and embed them in the page. If Blender
>    isn't available, it builds them in code instead.
> b. No: build everything in code.

**User:** "a"

**Output:**

Decisions: High tier; scroll website; fictional "Lantern Alley Ramen" at an invented riverside night market, all copy in a SITE config so a real stall can swap in; the HERO bowl assembles as you scroll (broth, noodles, toppings); Blender for the bowl, toppings and lantern, code for broth, noodles and steam; polish checklist and throttled fps check.

```text
Build a single-page scroll website for Lantern Alley Ramen, a fictional ramen stall at the Thursday-to-Saturday night market in the riverside town of Port Halden. It should feel like stepping out of the cold into steam and lantern light.

BRAND
BRAND NAME: Lantern Alley Ramen — "Broth since noon. Bowls till midnight."
HERO:       a 0.2 m glazed ramen bowl that fills as you scroll: broth, noodles, then chashu, soft egg, nori and scallions
PALETTE:    night #14121A, counter #5A3A26, ink #F4EBDD, muted ink #A79A88, lantern #F2994A, lantern glow #FFD08A, broth #C98A3D, glaze #2F4A5C, scallion #7DB35A, accent #E2463A
TYPE:       headings "Bricolage Grotesque" 700, body "Source Sans 3" 400 18/1.6 px, prices "JetBrains Mono" 500 15 px
SET:        a worn wooden counter (1.6 × 0.5 m) under one paper lantern; the night market blurred behind
PROPS:      chopsticks, a ladle, a paper lantern (0.4 m), a stool
ACCENTS:    seeded steam wisps, 120 blurred market lights, 2% film grain
VOICE:      warm, short sentences, a little proud. "Fourteen hours of bones and kombu. You'll taste every one."

CONCEPT
The page builds one bowl. Each section adds a layer; by the menu it's the finished bowl. Then the camera pulls back to the stall so you know where to find it.

SECTIONS
1. Open Late — 100vh. Shows: BRAND NAME, tagline, "Thu–Sat · 6 pm to midnight", "Find the stall" button. 3D: the empty HERO on the counter under the lantern, bokeh market lights drifting 2 cm/s.
2. The Broth — 130vh. Shows: the VOICE line and a paragraph on the broth. 3D: the ladle tilts 50° and pours a broth stream (tube, 8 mm) while the broth surface rises from 0 to 60% of the bowl depth; fat droplets catch the lantern; steam grows from 4 to 18 wisps.
3. The Noodles — 120vh. Shows: "Made here every morning, rested a day." 3D: chopsticks lower a bundle of 40 noodles (code curves, 2.5 mm thick) into the broth; at sectionProgress 0.6–0.9 they lift a 0.12 m noodle pull, broth dripping, then lower it back.
4. On Top — 160vh, four stops at 0.12 / 0.37 / 0.62 / 0.87. Shows: one SITE.toppings card per stop (name, one line, origin). 3D: each topping drops 8 cm into place with a 2 cm splash ring and a 0.1 s squash: two chashu slices, an egg split to show the jammy yolk, a nori sheet tucked at the back rim, a scatter of 60 scallion rings.
5. The Menu — auto height. Shows: 5 bowls from SITE.menu (name, broth, price, heat 0–3 drawn as small inline-SVG chilies). 3D: the finished HERO at the right third, turning 12° across the section.
6. Find Us — 100vh. Shows: an inline-SVG map of the market's rows with stall 14 highlighted in PALETTE accent, hours, "Cash and cards." 3D: the camera pulls back 2.5 m to the stall front: counter, lantern, stool, a cloth curtain swaying.
7. Footer — 40vh. Small type, social links from SITE, copyright line.

SCROLL SYSTEM
- Lenis 1.1.13 (lerp 0.1) produces `progress` and `sectionProgress[i]`, both 0–1. Wheel, trackpad, touch and keyboard scrolling all feed it.
- DOM and 3D values are pure functions of these each frame. No ScrollTrigger timelines or IntersectionObserver tweens.
- A fixed full-viewport canvas behind the content. Scrolling up plays everything backward, including toppings lifting out and broth draining.

3D MOMENTS AND TRANSITIONS
- Each section's keyframes are [sectionProgress, value] arrays with smoothstep between; transitions overlap 15% into the next section.
- Steam: 3D noise sampled on scroll progress and time, so it rises continuously but its amount follows progress.
- Camera: 0.55 m from the HERO at 35° down for sections 1–5, then the pull-back in section 6.

LOOK
- Key: the lantern as a warm point light, PALETTE lantern glow at 4.0, 0.5 m above the bowl, soft shadows (2048 PCF). Cool rim from the market side, #8FA8D9 at 0.6. No ambient light. AgX, exposure 1.05.
- Broth: MeshPhysicalMaterial roughness 0.05, transmission 0.2, PALETTE broth, with a floating-fat normal map. Noodles roughness 0.4, subsurface-style wrap lighting.
- Post: GTAO on the counter and bowl, bloom threshold 0.85 strength 0.4 (lantern and droplets only), depth of field focused on the HERO.

ASSETS (Blender)
- First check for Blender: run `blender --version` (4.2 LTS or newer). If it's missing, try `pip install bpy` in a virtualenv with the Python version bpy supports. If both fail, skip this section, build these assets procedurally as described above, and say so in the delivery note.
- Write assets/build_assets.py and run it with `blender --background --python assets/build_assets.py` (or plain python with bpy). It starts from bpy.ops.wm.read_factory_settings(use_empty=True), seeds random with 14, and builds every asset from nothing: no downloads, no external textures.
- Assets: HERO bowl — lathe profile with a foot ring and a glaze drip line at 70% height, inside lighter — 0.2 m — 8,000 tris — PALETTE glaze. PROP_chashu ×2 variants — rolled slice with a baked fat swirl — 6 cm — 2,000 tris. PROP_egg_half — white with a jammy yolk dome — 4 cm — 1,500 tris. PROP_nori — crinkled sheet — 7 × 9 cm — 400 tris. PROP_chopsticks — lacquered, tapered — 0.23 m — 600 tris. PROP_lantern — ribbed paper over 12 wire hoops — 0.4 m — 4,000 tris — PALETTE lantern.
- Materials: Principled BSDF only (it exports cleanly to glTF); convert PALETTE hex from sRGB to linear before setting Base Color; roughness per asset. Bake any procedural detail you need into 1024 px images packed into the file.
- Per object: apply all modifiers and transforms, decimate to its triangle budget, set the origin at the base and move it so its lowest point sits at z = 0, name it HERO_* or PROP_*.
- Export each asset group with bpy.ops.export_scene.gltf(export_format='GLB', export_apply=True, export_yup=True) to assets/*.glb. No Draco compression: its decoder can't be inlined cleanly. Total .glb size at most 8 MB.
- build.mjs adds three/addons/loaders/GLTFLoader.js (and its imports) to the import map and embeds each .glb as base64 in a `const ASSETS = {...}` object. Load with GLTFLoader.parse() on the decoded ArrayBuffer, never with fetch.
- Repeat assets with InstancedMesh, varying rotation and ±15% scale with a seeded random.
- Deliver assets/build_assets.py and the .glb files with index.html, build.mjs and the app source.

CONFIG
All copy, toppings, the menu (name, broth, price, heat), hours, the map's stall number, and social links live in `const SITE = {...}` at the top; the page renders from it.

RESPONSIVE AND ACCESSIBILITY
- ≥1200 px: 44ch text column left, HERO right of center. 768–1199: centered cards on a PALETTE night scrim at 85%. <768: HERO in the top 45% of the viewport at 80% scale, text below.
- Semantic landmarks, an h2 per section, PALETTE accent focus rings, contrast ≥ 4.5:1 over every state of the scene.
- prefers-reduced-motion: no smoothing, no camera moves, steam static; each section shows its end state with a 0.3 s crossfade. WebGL failure: a static lantern-glow gradient.

PERFORMANCE
- One index.html, three.js 0.160.0 and Lenis 1.1.13. No CDN: `npm install three@0.160.0 lenis@1.1.13`, then a build.mjs inlines node_modules/three/build/three.module.js, every addon used (examples/jsm) and the ESM build of Lenis (specifier `lenis`), following their relative imports and rewriting them to `three/addons/<path>`, as base64 `data:` URLs in an import map, with the app in an inline module. Deliver index.html, build.mjs and the app source.
- WebGL2, DPR ≤ 2 (1.5 below 768 px). Render on demand when idle; pause when hidden. 60 fps while scrolling.

AVOID
- Two scroll systems fighting; one-shot reveals that don't reverse.
- Toppings floating above the broth or sinking through the bowl; each rests on the broth surface at its fill height.
- Broth as an opaque orange disc; it needs the fat droplets, slight transmission and a meniscus at the bowl wall.
- Noodles as straight cylinders; they curve, overlap and sag.
- Steam like gray smoke; it's thin, warm and gone by 0.25 m.
- Lorem ipsum or a centered hero with three feature cards.
- Washed-out night: no ambient light; everything away from the lantern falls toward PALETTE night.
- Text over the lantern's glow without a scrim.

DEFINITION OF DONE
Open index.html in a browser and, before delivering:
1. Screenshot every section at sectionProgress 0.5 (and section 4 at each stop) at 1440×900 and 390×844.
2. Scroll to the bottom and back; section 4 at 0.62 matches both ways, toppings included.
3. Console: zero errors or warnings. With the network blocked, the page loads with zero requests and logs THREE.REVISION 160 once at startup.
4. Headlines legible over every state, "Find the stall" scrolls to section 6, no layout shift after fonts load, reduced-motion shows end states.
5. Blender assets: render a 512 px clay preview of each in Blender before export; in the browser each sits on its surface within 1 mm and matches its brief size within 5%; log triangle counts against budgets.
6. Polish checklist: the yolk shows a specular glint in section 4; the lantern lights the bowl's inner rim; the broth meniscus is visible; chopstick shadows fall on the counter; steam never covers the headline.
7. Average fps ≥ 55 during a full scroll, and ≥ 30 with 4× CPU throttling.
Fix anything that fails, repeat, then deliver screenshots with one line per check.
```

**Follow-up revisions**

```text
If the bowl looks like plastic: lower the glaze roughness to 0.12 with clearcoat 0.8, add a 1 mm unglazed band at the foot ring (roughness 0.9, #B9A58C), and raise the rim light to 0.9.
```
```text
If the broth reads flat: deepen PALETTE broth to #B5762E toward the center, raise the fat-droplet count to 90, and tilt the lantern light 10° so the droplets catch it.
```
```text
If the toppings arrive too fast to notice: stretch section 4 to 200vh and hold each topping still for 0.12 sectionProgress after it lands.
```

Best run in: the most capable coding model in an agent with a browser and screenshots, and Blender (or pip-installable bpy) on the same machine.

---

## Example 3: 8-second looping character film (Balanced)

**Input:** "an 8 second loop of a snail delivering mail"

**Skill asks:** the tier question. A snail is organic, but the request isn't detailed and
Balanced never uses Blender, so no Blender question.

**User:** "2" (Balanced)

**Output:**

Decisions: Balanced tier; looping film; 1080×1080, 30 fps, 8 s (240 frames); the snail stays centered while a periodic garden-fence set scrolls past, with one mailbox per loop; the letter tips from a satchel on its shell into the slot; original stylized snail.

```text
Build a single-file 3D animated loop: a snail mail carrier slides along a fence rail, tips a letter from its satchel into a tiny mailbox, raises the flag and slides on. A slow, proud, slightly comic round.

BRAND
HERO:    snail mail carrier, 0.07 m tall: soft foot 0.09 m long, two eye stalks 2.5 cm with ball tips, a spiral shell 5 cm wide, a leather satchel strapped to the shell with one letter always peeking out
PALETTE: background #EADFCB, fence #8C6A4E, moss #6F8F4E, snail body #D9B48F, shell #B5653A, shell stripe #F0D2A0, satchel #5C3B2A, letter #FAF6EE, mailbox #3E6B8A, flag #D8432F, light warm #FFDDA8, light cool #BCD3E8
SET:     a 5 cm garden fence rail with moss patches; garden blurred behind
PROPS:   tiny mailboxes on posts 6 cm tall, spaced exactly 0.40 m along the rail, each with a red flag
ACCENTS: a glistening slime trail on the rail, 20 seeded dust motes in the light

FORMAT
- 1080×1080, letterboxed. 30 fps, 8.0 s, 240 frames. The frame at t = 8.0 equals frame 0.
- window.renderAt(t) draws the frame for t from t alone; playback calls renderAt(elapsed % 8). ?frame=N renders frame N and stops. window.LENGTH and window.FPS are exposed.
- Randomness only from mulberry32 seeded with 23.
- The camera follows the snail. Its rail position x(t) is a smooth function with x(8) = x(0) + 0.40 m and the same speed (0.07 m/s) at t = 0 and t = 8; it's stopped from 2.6 to 5.4 s. Because mailboxes repeat every 0.40 m, the next mailbox is exactly where this one was at t = 0. A mailbox's flag is up once the snail has passed it, so the box behind is always flag-up and the box ahead flag-down.
- Pedal waves (5/s) and stalk bobs (0.5 Hz) complete whole cycles in 8 s.

LOOK
- Key: PALETTE light warm late sun from 40° right, 30° up, 2.4, soft shadows (2048 PCF). Fill: PALETTE light cool at 0.35 from the left. Rim from behind at 1.0. No ambient.
- Lens: vertical FOV 18°, camera 0.6 m away, 8° down at the snail; depth of field focused on the eye stalks, background blurred.
- Body roughness 0.35, wet clearcoat 0.8; shell roughness 0.5, clearcoat 0.4, stripe along the spiral; satchel 0.8 with stitched edges; trail roughness 0.05 at 30% coverage.
- Post: AgX, exposure 1.0, vignette 0.12, grain 2%.

BEATS
0.00–2.20 s (f0–66)     Cruising; foot ripples, stalks bob; the next mailbox enters from the right.
2.20–2.60 s (f66–78)    Slows to a stop beside the mailbox; eye stalks lean toward the slot 15°.
2.60–3.40 s (f78–102)   Anticipation: the body stretches up 8 mm, the shell tilts back 6°.
3.40–4.30 s (f102–129)  The shell tilts forward 22° toward the slot; the peeking letter slides out of the satchel and into the slot (ease-in), gone by f126.
4.30–4.80 s (f129–144)  The shell rights itself with a 4° overshoot; the next letter rises in the satchel to the same peeking pose as frame 0.
4.80–5.40 s (f144–162)  One eye stalk nudges the flag up 90° (ease-out, 2-frame settle); the other stalk looks at the camera; a small proud body puff of 3%.
5.40–8.00 s (f162–240)  Accelerates back to cruising speed and slides on; the mailbox exits left. Frame 240 = frame 0.

CAMERA
Follows the snail's x exactly, so the snail stays centered; the world moves. No other camera motion.

TECHNICAL
- One index.html, three.js 0.160.0. No CDN: `npm install three@0.160.0`, then a build.mjs inlines node_modules/three/build/three.module.js and every addon used (examples/jsm), following their relative imports and rewriting them to `three/addons/<path>`, as base64 `data:` URLs in an import map, with the app in an inline module. Deliver index.html, build.mjs and the app source.
- WebGL2, sRGB output, DPR ≤ 2. 60 fps real-time playback; if under 55, drop the depth of field first.
- Corner controls: play/pause, scrubber, frame counter; mouse, touch and Space/←/→; auto-hide after 2 s, never over the snail.
- prefers-reduced-motion: show frame 150 as a still with a play button.

AVOID
- The foot sliding over the rail like a puck; pedal waves move along the foot at the stated rate, and the trail stays fixed in the world.
- The shell as a plain sphere; it's a true spiral with growing whorls.
- The letter popping at the seam; the satchel always shows one letter at frame 0 and again by f144.
- Mailboxes or trail jumping at the seam.
- The letter clipping through the mailbox wall instead of entering the slot.
- Washed-out lighting: the snail's shadow side near 45%.
- Math.random() or any state carried between frames.

CHECKS
Before delivering:
1. Render frames 0, 66, 102, 120, 144, 160, 200, 239, 240 via ?frame=N and screenshot each.
2. Frame 0 vs. frame 240: pixel difference under 0.5%. Frames 239 → 0 read as continuous motion.
3. renderAt(3.9), renderAt(7.2), renderAt(3.9): both 3.9 calls render the same pixels.
4. Read the console: zero errors or warnings. With the network blocked, the page loads with zero requests and logs THREE.REVISION 160 once at startup.
5. Step f78–162: the letter enters the slot without clipping, the flag rises on its hinge, the snail doesn't drift during the stop.
6. Each beat lands within ±1 frame of its timestamp.
Fix anything that fails, repeat, then deliver the frames with one line per check.
```

**Follow-up revisions**

```text
If the snail looks dry and rubbery: raise the body clearcoat to 1.0 with clearcoat roughness 0.08, add a 0.5 mm moist highlight line along the foot edge, and brighten the slime trail to 45% coverage.
```
```text
If the delivery reads too fast: start the shell tilt at f96 instead of f102, slow the letter slide to 1.1 s, and hold the proud puff 6 frames longer.
```

Best run in: a mid-tier coding model in an agent that can render specific frames headlessly and compare images.

---

## Example 4: small playable game (Cheapest)

**Input:** "quick prototype: a tugboat game where you push barges into a harbor"

**Skill asks:** nothing. "quick prototype" picks the Cheapest tier.

**Output:**

Decisions: Cheapest tier (from "quick prototype"); playable game; top-down 3/4 view of a small harbor; steer one tugboat and nudge barges into three berths before a 120 s timer runs out; simple materials, no post, light checks.

```text
Build a single-file 3D browser game prototype: steer a little tugboat and nudge drifting barges into their berths before the harbor clock runs out. Simple, readable, fun in the first ten seconds.

BRAND
HERO:    a tugboat, 4 m long, chunky hull, a short funnel, a tire bumper on the bow
PALETTE: water #2B6F8C, dock #8A7A66, tug #D8432F, tug trim #F4EFE6, barge #5E6B73, berth #F2C14E, UI ink #1C2328, UI surface #F4EFE6
WORLD:   an 80 m × 60 m harbor with a dock wall along the top holding 3 berths (12 m wide, PALETTE berth stripes), open sea along the bottom
PROPS:   barges, 14 m × 6 m, drifting in from the sea edge

CORE LOOP
Push each barge into a berth with the tug's bow. A barge held inside its berth's stripes for 1.5 s scores: the berth flashes PALETTE berth for 0.3 s and the barge sinks away; a new one drifts in. Round: 120 s. Score = barges docked.

PLAYER
- Controls: arrow keys or WASD for throttle and rudder. Touch: drag on the left half for direction and throttle.
- Tug: max speed 6 m/s, acceleration 3 m/s², turn rate 70°/s, water drag 0.6.
- Pushing: tug–barge contact transfers momentum; a barge has 8× the tug's mass and drag 0.3.

BARGES
- Up to 3 at once, spawning every 10 s at the sea edge with a 0.8 m/s drift toward the dock wall.
- Barges bounce softly off the dock wall (restitution 0.2) and off each other.

HUD
Top-left: score and timer in "Archivo" 700 22 px, UI ink on a UI surface pill. A start screen with controls; game over with score, best (localStorage) and "Restart (R)".

LOOK
Flat-shaded low-poly, MeshStandardMaterial roughness 0.8. One directional light at 3.0 from top-left with a 1024 shadow map, hemisphere fill 0.5; no post-processing. Water: a flat plane with a slow two-tone noise.

CAMERA
Fixed 3/4 top-down, 50° pitch, FOV 45°, framing the whole harbor with a 5% margin.

TECHNICAL
- One index.html, three.js 0.160.0; simple circle-and-box collisions, no physics engine. No CDN: `npm install three@0.160.0`, then a build.mjs inlines node_modules/three/build/three.module.js and every addon used (examples/jsm), following their relative imports and rewriting them to `three/addons/<path>`, as base64 `data:` URLs in an import map, with the app in an inline module. Deliver index.html, build.mjs and the app source.
- WebGL2, DPR ≤ 2. Fixed 60 Hz simulation; seeded spawns (?seed=N). Keyboard, mouse and touch. 60 fps.
- prefers-reduced-motion: the docking flash becomes a static outline.

AVOID
- A tug that turns on the spot like a tank; rudder turning needs forward speed.
- Barges that stop dead when the tug leaves; they keep drifting with drag.
- Colliders that don't match the hulls.
- A round with no clear restart.

DEFINITION OF DONE
Before delivering:
1. Play one round with scripted input: steer to a barge, push it into a berth, let the timer run out, restart.
2. Screenshot mid-round with a barge in a berth, and the game-over screen.
3. Read the console: zero errors or warnings. With the network blocked, the page loads with zero requests and logs THREE.REVISION 160 once at startup.
Fix anything that fails once, then deliver with the two screenshots.
```

**Follow-up revisions**

```text
If pushing barges feels like hitting walls: lower barge mass to 5× the tug's, raise tug acceleration to 4 m/s², and add a 0.2 s soft contact spring before momentum transfers.
```
```text
If the harbor looks empty: add 6 bollards along the dock wall, a 1 m wake trail behind the tug in PALETTE tug trim at 40%, and a slow 0.1 m water bob on every barge.
```

Best run in: a fast, low-cost model in chat or a light agent; it's a small, self-contained build.
