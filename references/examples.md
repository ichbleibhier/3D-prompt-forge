# Worked examples

Four original examples showing the full output for a one-line input. Use them to
calibrate tone, density, and length. Don't reuse their content; reuse their shape.

---

## Example 1: plush animal toy

**Input:** "a plush sloth I can hug"

**Output:**

Decisions: interactive toy; 0.6 m seated plush on a branch stub; fabric look via sheen; "hug" becomes press-and-hold so it works with one finger; WebGL2 with a soft-body cage.

```text
Build a single-file interactive 3D plush toy: a seated sloth you can squeeze, hug, and boop. It should feel like a soft handmade plush.

BRAND
HERO:    seated plush sloth, 0.6 m, pear-shaped, head 0.5 of height, long arms past the belly
PALETTE: fur #A88B6F, face mask #E8D8C2, eye patches #5B4636, nose #2E2420, background #EEF1E8, accent #7FA66B
SET:     a rounded branch stub (0.25 m) on a PALETTE background cyclorama
PROPS:   a 0.12 m felt leaf in PALETTE accent, held in the left arm
ACCENTS: soft contact shadow; three felt hearts on a long hug

OBJECT: one continuous mesh (smooth-union SDF, marching cubes at 128³), no seams. MeshPhysicalMaterial roughness 0.9, sheen 1.0, sheenRoughness 0.5, sheenColor PALETTE face mask; fur normal noise at 400/m, strength 0.35. Glossy bead eyes (roughness 0.15) in embroidered patches.

PHYSICS: PBD on an 800-particle cage skinned to the mesh, fixed 1/120 s substeps, bottom pinned to the SET. Volume within ±5%. Stiffness body 0.35, arms 0.2; damping 0.6; rest in 1.2 s with one overshoot.

INTERACTIONS
SQUEEZE (drag / pinch): compresses up to 30% along the drag, bulges sideways, eyes squint.
HUG (hold 0.8 s): arms wrap the belly over 0.5 s; after 2 s the hearts rise 0.3 m and fade over 1.2 s.
BOOP (tap nose): 1.5 cm dent, head bobs back 6°, a 60 ms synthesized felt "thup".
IDLE: breathing 1.02× at 0.2 Hz, blink every 4–7 s, head tilts 5° toward the pointer.

CONTROLS + UI: right-docked 240 px panel, white 70%, 16 px radius: Softness (0.1–1.0, default 0.35), Reset. Title "Sloth, Squeezable" top-left in "Nunito" 700 28 px, PALETTE eye patches. Hint "squeeze · hold to hug · boop the nose" fades after first use. The panel never covers the HERO; below 700 px it becomes a gear button.
CAMERA: FOV 32°, 1.9 m away, aimed at the chest; orbit ±50°, zoom 1.3–2.6 m.

TECHNICAL: One index.html, no build step; three.js 0.160.0 via a jsDelivr importmap. WebGL2, sRGB, AgX exposure 1.0, DPR ≤ 2. Warm key #FFE7CC 45° left, fill 0.35×, rim #DDEBFF; RoomEnvironment 0.5. Pointer Events, touch-action: none. 60 fps; if under 55, cut the cage to 500 particles. prefers-reduced-motion: no head-follow, hearts fade in place.

AVOID
- Scaling the whole mesh to fake squeeze; deform the cage locally.
- Visible separate spheres and cylinders for body parts.
- Arms passing through the belly during a hug.
- A plastic look: no specular hotspots on fabric.
- Washed-out light: ambient ≤ 0.1, shadow side near 50%.

DONE WHEN
Open it in a browser; screenshot idle, mid-squeeze, mid-hug with hearts, and at 390×844. Console has zero errors or warnings. Exercise all three interactions with mouse and simulated touch. Volume stays within ±5% on a hard squeeze; rest within 1.2 s; no interpenetration from three orbit angles; contact shadow present. Average fps ≥ 55 over 10 s of play. Fix and repeat until all pass; deliver with screenshots and one line per check.
```

**Follow-up revisions**

```text
If the sloth looks like smooth clay instead of fabric: raise fur normal strength to 0.6, add a second noise layer at 1,200/m, and set sheenRoughness to 0.35 so the rim catches a soft halo of PALETTE face mask.
```
```text
If the hug looks stiff: delay the forearms 4 frames behind the upper arms, overshoot the wrap by 6° and settle over 0.3 s, and dent the belly 5% where the arms land.
```

Best run in: a coding agent that can open a browser and take screenshots, since the volume and interpenetration checks need visual verification.

---

## Example 2: scroll website for a fictional local business

**Input:** "website for a neighborhood bakery"

**Output:**

Decisions: scroll website; fictional "Marrow Lane Bakehouse" in an invented riverside town; HERO is a sourdough loaf that goes from dough to baked as you scroll; all copy in a SITE config so a real bakery can swap it in; Lenis for smoothing.

```text
Build a single-page scroll website for Marrow Lane Bakehouse, a fictional neighborhood sourdough bakery on a corner in the riverside town of Ellery. It should feel like walking in at 6 a.m.: warm, floury, quiet.

BRAND
BRAND NAME: Marrow Lane Bakehouse — "Slow bread, early mornings."
HERO:       a round sourdough boule, 0.24 m wide when baked, with a single curved ear score
PALETTE:    background #F6EFE4, surface #EBDDC8, ink #2B2118, muted ink #6E5E4E, accent #C2602E (crust), accent-2 #3F5A4C (shop door green)
TYPE:       headings "Fraunces" 600, body "Inter" 400 17 px / 1.6, labels "Inter" 600 12 px, tracking 0.12em uppercase
SET:        a worn wooden counter (2 m × 0.8 m) under one warm pendant light, background falling off to PALETTE background
PROPS:      a linen-lined proofing basket, a bench scraper, a small scatter of flour, a paper bag with a twine tie
ACCENTS:    drifting flour motes (300, seeded), faint film grain 3%
VOICE:      plain, warm, unhurried. "We start at four so you don't have to."

CONCEPT
The HERO bakes as you scroll: a pale ball of dough in the first section becomes a proofed round, then a scored loaf, then a crackling crust, then sits in a paper bag at the counter by the end.

SECTIONS
1. Arrival — 100vh. Shows: BRAND NAME, tagline, hours line, "Order for pickup" button. 3D: HERO as a pale dough ball (#EFE3D0, roughness 0.8) on the counter, pendant light swaying 2°.
2. The Starter — 120vh. Shows: a short paragraph on the 11-year-old starter. 3D: camera dollies from 1.4 m to 0.7 m; dough slowly rises 1.0→1.18× height, surface bubbles appear (displacement noise, seeded).
3. Shaping and Scoring — 120vh. Shows: three-step text list. 3D: HERO moves into the proofing basket, then out; the bench scraper glides in; a score line draws across the top (a displaced groove growing 0→100% over sectionProgress 0.4–0.8).
4. The Bake — 140vh. Shows: "Forty-five minutes at 250°C" in large type. 3D: lighting shifts to oven orange #FF8A3D at 1.6× intensity; crust color lerps dough→PALETTE accent; the ear lifts 0.015 m; heat shimmer behind the HERO.
5. The Menu — auto height. Shows: 6 loaves and pastries as DOM cards with price and days baked. 3D: HERO rests at the right third, camera static; a slow 6° turntable driven by scroll.
6. Visit — 100vh. Shows: address, map link, hours table, phone. 3D: HERO drops into the paper bag; the twine bow ties (0.6 s of sectionProgress).
7. Footer — 40vh. Small type, newsletter field, copyright line.

SCROLL SYSTEM
- Lenis 1.1.13 smooths native scroll (lerp 0.1). One loop computes `progress` (0–1, whole page) and `sectionProgress[i]` (0–1) from section offsets.
- DOM transforms and every 3D value are pure functions of these numbers each frame. No GSAP ScrollTrigger timelines, no IntersectionObserver tweens.
- The canvas is position: fixed, full viewport, behind the content; text sits in a 46ch column on the left on desktop.
- Scrolling up plays every moment backward exactly. Wheel, trackpad, touch, and keyboard scrolling all feed the same value.

3D MOMENTS AND TRANSITIONS
- Each section's keyframes are defined as arrays of [sectionProgress, value] with smoothstep between them.
- Section transitions overlap by 15% of the incoming section, so the camera never stops dead.
- The crust color and lighting in section 4 return to dough tones if the user scrolls back up.

LOOK
- Pendant key light #FFD9A8 at 3.0 intensity, 1.1 m above the counter, soft shadows (2048 map, radius 6). Fill from the window side, cool #CFE0F0 at 0.3. No ambient light.
- AgX tone mapping, exposure 1.05. Counter wood: procedural grain, roughness 0.7. Flour: tiny instanced quads, additive at 0.4.

CONFIG
All copy, the menu (name, description, price, days), hours, address, and phone live in `const SITE = {...}` at the top of the script. The DOM is rendered from SITE on load.

RESPONSIVE AND ACCESSIBILITY
- ≥1200 px: text column left, HERO right of center. 768–1199: HERO centered behind a translucent text card. <768: HERO at 70% scale in the top 45% of the viewport, text below.
- Semantic header/main/section/footer; each section has an h2. Contrast ≥ 4.5:1 over every 3D state, using a soft PALETTE background scrim behind text where needed.
- Visible focus rings in PALETTE accent-2. Button and links reachable by keyboard.
- prefers-reduced-motion: no Lenis, no dolly; each section shows its end-state HERO with a 0.3 s crossfade.
- If WebGL fails, a static radial gradient from surface to background sits behind the text.

PERFORMANCE
- One self-contained index.html. three.js 0.160.0 and Lenis 1.1.13 via a jsDelivr importmap.
- WebGL2, DPR capped at 2 (1.5 below 768 px). All geometry procedural; no external models.
- Render on demand while idle; pause when the tab is hidden. 60 fps while scrolling.

AVOID
- Two scroll systems fighting. Everything reads the one smoothed value.
- One-shot reveal animations that don't reverse.
- Lorem ipsum or generic labels like "Product 1". Write real copy in the VOICE.
- A centered hero with three feature cards. Follow the section plan.
- Floating bread: the HERO always has a contact shadow on the counter or in the basket.
- Washed-out lighting: no ambient light; the shadow side of the loaf sits near 40% luminance.
- Text over the busiest part of the scene without a scrim.

DEFINITION OF DONE
Open index.html in a browser and, before delivering:
1. At 1440×900, screenshot every section at sectionProgress 0.5.
2. At 390×844, screenshot the same.
3. Scroll to the bottom and back; screenshot section 4 at 0.5 on the way down and on the way up and confirm they match.
4. Console: zero errors or warnings.
5. Check headline legibility at each section, contrast ≥ 4.5:1, "Order for pickup" clickable, no layout shift after fonts load, reduced-motion mode shows end-states.
6. Average fps during a full scroll ≥ 55.
Fix anything that fails, repeat, then deliver with screenshots and a one-line result per check.
```

**Follow-up revisions**

```text
If the bread looks like a smooth orange ball: add crust displacement (noise scale 30/m, amplitude 3 mm), roughness variation 0.55–0.85, and darken the score edges to #7A3A18 so the ear reads.
```
```text
If the text is hard to read over the 3D on mobile: move the HERO into the top 40% of the viewport below 768 px and give the text block a PALETTE background scrim at 92% opacity with 24 px padding.
```
```text
If the scroll feels sluggish: raise the Lenis lerp to 0.14 and shorten section 4 to 110vh.
```

Best run in: a coding agent with a browser it can scroll and screenshot at two widths.

---

## Example 3: 8-second looping character film

**Input:** "a fox sweeping up leaves, looping"

**Output:**

Decisions: looping film; 1080×1080, 30 fps, 8 s (240 frames); the loop is closed by a gust that re-scatters the swept pile; original stylized fox in a hand-knit scarf; synthesized broom and wind sounds.

```text
Build a single-file 3D animated loop: a small fox sweeps autumn leaves into a neat pile, sighs with satisfaction, and a gust scatters them back. It should feel like a gentle, slightly funny daily ritual.

BRAND
HERO:    stylized upright fox, 0.7 m tall, head 0.4 of height, big tail (0.45 m), wearing a short knit scarf; one continuous body mesh
PALETTE: background #F3E6D3, ground #CDBA9A, fox #D9733A, fox belly #F6E9DA, scarf #3E6B8A, leaves #C9452E / #E3A43A / #8C5A2B, light warm #FFD7A0, light cool #A9C4E0
SET:     a 4 m circle of packed-dirt path with a low stone edge, one leaning lamppost behind-left, soft falloff to PALETTE background
PROPS:   a straw broom (1.0 m), 60 leaves (6–9 cm, seeded shapes and colors)
ACCENTS: 4 small dust puffs per sweep stroke; scarf ends that trail in the gust

FORMAT
- Canvas 1080×1080, letterboxed to fit the window.
- 30 fps, 8.0 s, 240 frames. Loops seamlessly: the frame at t = 8.0 equals frame 0.
- window.renderAt(t) draws the frame for t from t alone. Playback calls renderAt(((now - start) / 1000) % 8).
- ?frame=N renders frame N and stops. window.LENGTH = 8 and window.FPS = 30 are exposed.
- All randomness from mulberry32 seeded with 41.
- Each leaf's path is a function of t: scattered position → swept to pile (by its stroke) → lifted by the gust → back to its scattered position at t = 8.

LOOK
- Key: warm late-afternoon sun, PALETTE light warm, from 50° right, 25° up, intensity 2.6. Fill: PALETTE light cool sky at 0.4. Rim from behind-left at 1.2 to outline the tail.
- Lens: vertical FOV 28°, depth of field focused on the HERO, slight background blur.
- Fox: roughness 0.85, sheen 0.6 for a felted look. Leaves: roughness 0.6, slight transmission 0.2 so backlit leaves glow.
- Post: AgX, exposure 1.0, vignette 0.15, grain 2%.
- Soft shadow map 2048; contact shadows for the fox's feet and every leaf.

BEATS
0.00–0.50 s (f0–15)     Leaves scattered across the path. Fox standing, broom held diagonally; looks down at the mess, ears flatten 10°.
0.50–4.50 s (f15–135)   Four sweep strokes, 1.0 s each. Each: 0.25 s wind-up (body twists 15° away), 0.45 s sweep (broom arcs 70°, ease-out), 0.3 s recover. Each stroke pushes 15 leaves toward the pile point, 0.8 m in front-right. Feet stay planted; the fox shuffles one step left between strokes 2 and 3 (feet locked during contact).
4.50–5.50 s (f135–165)  Fox leans on the broom, chest rises (breath in 0.5 s, out 0.5 s), eyes close, tail sways once.
5.50–6.10 s (f165–183)  Wind. The lamppost sways 3°, scarf ends lift. Ears perk up, eyes open wide.
6.10–7.20 s (f183–216)  The gust lifts the pile: leaves spiral up 0.4–1.0 m and drift back to their scattered positions (each on its own seeded curve, landing staggered over 0.6 s). Tail puffs 1.15×.
7.20–8.00 s (f216–240)  Fox exhales, shoulders drop 4 cm, ears flatten back to the frame-0 pose, broom returns to diagonal. Frame 240 = frame 0.

CAMERA
Fixed at 3.2 m from the HERO, 0.9 m high, looking at 0.45 m. A 0.08 m sideways drift following a sine with an 8 s period, so it loops.

SOUND (optional)
Web Audio, synthesized, starts on first click. Broom swish (bandpassed noise, 0.4 s) at f22, f52, f82, f112. Sigh (filtered noise, 0.6 s) at f150. Wind (low noise rising over 1 s) at f165. Leaf rustle at f190. Mute toggle.

TECHNICAL
- One self-contained index.html. three.js 0.160.0 via a jsDelivr importmap.
- WebGL2, sRGB output, DPR capped at 2. 60 fps real-time playback.
- Leaves as one InstancedMesh.
- prefers-reduced-motion: show frame 150 as a still with a play button.
- Corner controls: play/pause, scrubber, frame counter; mouse, touch, and Space/←/→; auto-hide after 2 s.

AVOID
- Feet sliding during sweep strokes. Feet are locked to the ground during contact.
- A fox built from visible separate spheres; body, head, and tail form one smooth silhouette.
- Leaves popping between positions at the seam. Every leaf's path returns to its exact start.
- The broom passing through the ground or the fox's legs.
- Linear motion; every stroke has anticipation and follow-through.
- Leaves floating above the ground at rest; each has a contact shadow.
- Math.random() or accumulated state anywhere in the animation.

CHECKS
Before delivering:
1. Render frames 0, 60, 120, 150, 190, 239, 240 via ?frame=N and screenshot each.
2. Frame 0 vs. frame 240: pixel difference under 0.5%. Frame 239 → 0 looks like continuous motion.
3. renderAt(3.1), renderAt(7.0), renderAt(3.1) renders the same pixels for both 3.1 calls.
4. Console: zero errors or warnings.
5. Step frames 15–135: feet don't slide during strokes; broom doesn't clip the ground or legs; each stroke moves its leaves.
6. All leaves land with contact shadows by frame 216.
Fix anything that fails, repeat, then deliver with the frames and a one-line result per check.
```

**Follow-up revisions**

```text
If the sweep looks weightless: hold the wind-up pose 3 frames longer, add a 2-frame dust puff at broom contact, and drop the fox's hips 3 cm during each sweep.
```
```text
If the leaves look like flat paper cards: bend each leaf with a 15° midrib curl in the vertex shader and add 0.3 transmission so backlit ones glow PALETTE light warm.
```

Best run in: a coding agent that can render specific frames headlessly and compare images.

---

## Example 4: small playable game

**Input:** "a lighthouse game where you guide boats"

**Output:**

Decisions: playable game; top-down 3/4 view of a small bay at night; the player rotates and focuses the lighthouse beam to reveal rocks and guide boats into harbor; 3-minute rounds with rising traffic; low-poly flat-shaded look.

```text
Build a single-file 3D browser game: you are a lighthouse keeper guiding boats through a rocky bay at night by aiming the beam. Calm to start, frantic by the end, readable at a glance.

BRAND
HERO:    the lighthouse, 6 m tall, white with two PALETTE danger-red bands, a rotating lamp head with a 22° cone beam
PALETTE: sea #0E2233, sea highlight #2B5C7A, land #31402E, rocks #4A4A52, beam #FFE9A8, boats #E8E1D2, harbor #F2B84B, danger #D8432F, UI ink #F4F1E8, UI surface #0A1824CC
WORLD:   a 120 m × 80 m bay, lighthouse on a headland bottom-center, harbor mouth top-right, 14 rock clusters (seeded), open sea entrances on the left and top edges
PROPS:   boats (rowboat 3 m, fishing boat 6 m, ferry 10 m), buoys at the harbor mouth
ACCENTS: wake trails behind boats, a foam burst on a crash, fog banks drifting across

CORE LOOP
Boats enter from the sea edges and steer toward any light. Keep each boat in the beam so it follows a safe path into the harbor. Boats left in darkness for 4 s drift toward the nearest rocks.
Round: 180 s. Lose after 3 crashes. Score = boats docked × size multiplier (1/2/4) + streak bonus.

PLAYER
- Controls: mouse aims the beam (lamp head turns toward the cursor at 140°/s max), hold left mouse or Space to narrow the beam to 10° (reach 60 m vs. 35 m). Touch: drag anywhere to aim, hold a second finger to narrow.
- The narrow beam drains Lamp Oil (100 units, 12/s drain, 6/s regen when wide).

ENEMIES AND AI
- Boats steer toward the brightest lit point within 50 m of their bow using simple steering (seek + rock avoidance only when lit). Speed: rowboat 2.5 m/s, fishing 4 m/s, ferry 3 m/s with 2× turning radius.
- Unlit for 4 s: boat drifts toward nearest rock at 1.5 m/s; a danger-colored ring pulses around it as a warning.
- Fog banks (2–4, 20 m wide) cut beam reach by half while it crosses them.
- Spawns: one boat every 12 s at start, every 5 s by 150 s; ferries from 60 s on.

PROGRESSION
Waves every 45 s raise spawn rate and fog count. A streak of 5 docks without a crash grants +20 Lamp Oil. High score in localStorage.

HUD
Top-left: score and streak, "Space Grotesk" 600 22 px, UI ink. Top-right: round timer. Bottom-center: Lamp Oil bar 240 × 10 px in beam color. Three lighthouse icons for lives. Start screen with controls, pause on Esc or blur, game over with score, best, and "Restart (R)".

LOOK
Flat-shaded low-poly, MeshStandardMaterial roughness 0.9. Moonlight #7F95B8 at 0.25 from top-left; the beam is a SpotLight plus a soft additive cone mesh. Water: vertex-displaced plane (two sine waves, 0.15 m amplitude) with beam reflection. Exponential fog #0B1C2A density 0.012.

CAMERA
Fixed 3/4 top-down: 55° pitch, FOV 40°, framing the whole bay with 5% margin. Shake 0.15 m / 0.25 s on a crash.

SOUND (optional)
Web Audio synthesized: horn on spawn, bell on dock, low thud plus noise on crash, gentle wave bed. Starts after first input. M toggles mute.

TECHNICAL
- One self-contained index.html. three.js 0.160.0 via a jsDelivr importmap; custom circle colliders, no physics engine.
- WebGL2, DPR capped at 2.
- Fixed 60 Hz simulation with interpolated rendering; the same gameplay on 30, 60, and 144 Hz displays.
- Seeded PRNG for rocks, spawns, and fog; ?seed=N reproduces a run.
- Pooled boats (max 20 live). Mouse, keyboard, and touch. 60 fps target.
- prefers-reduced-motion: no camera shake, crash flash becomes a ring.
- ?debug=1 draws colliders, boat targets, and fps.

AVOID
- Boats that teleport or snap direction. Turning rate is limited and visible.
- Crashes that don't match the visuals; colliders match boat and rock outlines within 5%.
- Boats overlapping each other; add separation steering at 4 m.
- A beam that's only a flat transparent triangle. Use a real SpotLight on the water plus the cone mesh, with a 0.3 depth fade where the cone meets the water.
- Washed-out water. The unlit sea stays near PALETTE sea; only the beam brightens it.
- Ending the round without a clear restart path.

DEFINITION OF DONE
Before delivering:
1. Play 3 full rounds with scripted input: aim at incoming boats, use the narrow beam, let one boat crash, dock at least 5.
2. Screenshot the start screen, 30 s in, 150 s in with fog, a crash moment, and game over.
3. With ?debug=1, confirm boats can't leave the WORLD, never overlap, and colliders match visuals.
4. Console: zero errors or warnings.
5. Test touch at 390×844 and mouse at 1440×900.
6. Balance: an idle player loses in 50–80 s; a steady player docks 12+ boats per round.
Fix anything that fails, repeat, then deliver with screenshots and a one-line result per check.
```

**Follow-up revisions**

```text
If the beam looks flat: add a dust-mote layer inside the cone (200 seeded particles, size 2 px, beam color at 0.35) and raise the SpotLight intensity 1.5× so the water highlight reads.
```
```text
If the game feels too easy after a minute: shorten the drift timer from 4 s to 3 s after 90 s and add a 4th fog bank at 120 s.
```

Best run in: a coding agent that can play the game in a headless browser with scripted inputs and read the console.
