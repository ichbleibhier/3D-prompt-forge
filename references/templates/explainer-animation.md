# Template: explainer animation

For an animation that teaches how something works: a mechanism, a process, a concept.
Can be a timed film or step-through (next/previous). Target 500–900 words. Accuracy
matters more than spectacle; every visual must be true or explicitly labeled as
simplified.

```text
Build a single-file 3D explainer animation: how [subject] works. [One line of intent, e.g. "A curious 12-year-old should be able to explain it back after one viewing."]

BRAND
HERO:    [the main system being explained, size, how it's stylized]
PALETTE: [roles → #hex: background, structure, flow/energy, highlight, label ink, label surface, warning]
SET:     [neutral stage, cutaway, or context environment]
PROPS:   [secondary parts, each with its role]
ACCENTS: [flow particles, arrows, glows]

WHAT IT TEACHES
- Audience: [who, prior knowledge].
- Takeaways: [2–4 sentences the viewer should be able to say afterwards].
- Out of scope: [what to deliberately leave out].

STRUCTURE
[Mode: timed film of N s at 30 fps / step-through with K steps and auto-play.]
BEATS
[Start–end s (frames) · what's shown · what moves and how · the label or caption · the takeaway it supports.]
0.0–[x] s   Establish: [whole system, context].
...         [One idea per beat. Zoom in, show the mechanism, show cause → effect.]
...         Recap: [all labels visible at once, return to the establishing view].

VISUAL LANGUAGE
- Color meaning: [what each PALETTE role means; used consistently].
- Motion meaning: [e.g. flow particles speed = rate; arrows only for direction of force].
- Cutaways/ghosting: [how hidden parts are revealed: 30% opacity shell, sectional cut plane].
- Scale: [real proportions or labeled "not to scale"].

LABELS AND PACING
- Labels are DOM elements anchored to 3D points, [font, size, leader lines], never overlapping each other or the part they label.
- Each label appears [0.3 s] after its part is highlighted and stays at least [2.5 s]. Max [3] new labels per beat.
- Captions: one sentence per beat, bottom-center, [font/size], max [80] characters.
- Controls: play/pause, previous/next beat, scrubber, speed (0.5×/1×), captions on/off.

ACCURACY NOTE
[The facts the animation depends on, stated plainly, so the executing model doesn't invent physics. Flag simplifications to show on screen.]

TECHNICAL
- One self-contained index.html, three.js 0.160.0. No CDN: `npm install three@0.160.0`, then a build.mjs inlines node_modules/three/build/three.module.js and every addon used (examples/jsm), following their relative imports and rewriting them to `three/addons/<path>`, as base64 `data:` URLs in an import map, with the app in an inline module. Deliver index.html, build.mjs and the app source.
- Renderer: [WebGL2 / WebGPU with fallback]. DPR capped at 2.
- `window.renderAt(t)` / `window.seek(t)` draws any moment from t alone; seeded randomness only. [fps], [length] s.
- Keyboard: Space play/pause, ←/→ previous/next beat. Controls work with mouse and touch (44 px minimum targets).
- prefers-reduced-motion: step-through mode by default, crossfades instead of camera flights.
- Screen-reader: each beat's caption also in an aria-live region.

[ASSETS (Blender): High/Maximum only, when the user said Blender is available or wasn't sure. Copy and adapt the block in blender-assets.md.]

AVOID
[4–8 lines from failure-modes.md, adapted.]

CHECKS
Before delivering:
1. Screenshot the midpoint of every beat.
2. Confirm every label is readable, unoccluded, and points at the right part.
3. Seek to random times out of order; frames match sequential playback.
4. Read the console: zero errors or warnings. With the network blocked, the page loads with zero requests and logs THREE.REVISION 160 once at startup.
5. Re-read the ACCURACY NOTE; check every beat against it.
6. Test at 1440×900 and 390×844; labels reflow and stay readable.
Fix anything that fails, repeat, then deliver with screenshots and a one-line result per check.
```
