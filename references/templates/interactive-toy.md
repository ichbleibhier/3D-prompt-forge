# Template: interactive toy

For a single object (or a small cluster) the user plays with directly: plush, jelly,
fidget, desk toy, configurator, sandbox. Target 200–350 words for one object with 1–2
interactions; 350–500 with 3+ interactions or a control panel. Toys are the tightest type: write terse labeled
lines, not paragraphs, and fold minor details into the line they belong to.

Copy the skeleton, replace every `[bracket]`, delete lines that don't apply.

```text
Build a single-file interactive 3D toy: [one-line description]. [One line of intent, e.g. "It should feel like a premium handmade toy you want to keep touching."]

BRAND
HERO:    [what it is, size in m, defining proportions]
PALETTE: base [#hex], shadow [#hex], highlight [#hex], background [#hex], accent [#hex]
SET:     [what it sits on, e.g. rounded plinth on an infinite cyclorama]
PROPS:   [0–2 small objects, or "none"]
ACCENTS: [small effects: sparkles, contact shadow]

OBJECT: [Silhouette and construction in one line, e.g. one continuous mesh from a smooth-union SDF, no seams]. [Material values: roughness, sheen/transmission/thickness/clearcoat]. [Surface detail and how it's generated]. [Face, if any.]

PHYSICS: [Solver, e.g. PBD on a 600-particle cage skinned to the mesh], fixed [1/120 s] substeps. Volume within ±5%. Stiffness [n], damping [n]; back to rest in [n] s with [one] overshoot. [Ground contact / pinned region.]

INTERACTIONS
[VERB (input)]: [visual result with sizes and durations]
[3–6 verbs. At least one gentle, one energetic.]
IDLE: [breathing Hz, blink interval, look-at behavior, after how many s of no input]

CONTROLS + UI: [Panel position/width; each control with range and default; reset]. [Background, title text + font, panel style]. [Hint text that fades after first interaction]. The panel never covers the HERO; below 700 px it collapses to a button.
CAMERA: [FOV, distance, height, target; orbit/zoom limits; damping]

TECHNICAL: One index.html, three.js 0.160.0. No CDN: `npm install three@0.160.0`, then a build.mjs inlines node_modules/three/build/three.module.js and every addon used (examples/jsm), following their relative imports and rewriting them to `three/addons/<path>`, as base64 `data:` URLs in an import map, with the app in an inline module. Deliver index.html, build.mjs and the app source. [WebGL2 / WebGPU with WebGL2 fallback], sRGB, [AgX/ACES] exposure [n], DPR ≤ 2. [Key/fill/rim one-liner; env map]. [Shadow approach]. Pointer Events (mouse + touch), touch-action: none. 60 fps; if under 55, cut [first thing]. prefers-reduced-motion: [what changes].

[ASSETS (Blender): High/Maximum only, when the user said Blender is available or wasn't sure. Copy and adapt the block in blender-assets.md.]

AVOID
[4–8 one-line items from failure-modes.md, adapted.]

DONE WHEN
Open it in a browser; screenshot idle, mid-[verb 1], mid-[verb 2], and at 390×844. Console has zero errors or warnings. With the network blocked, the page loads with zero requests and logs THREE.REVISION 160 once at startup. Exercise every interaction with mouse and simulated touch. [2–4 toy-specific checks: volume ±5%, rest within n s, no interpenetration from 3 angles, contact shadow present]. Average fps ≥ 55 over 10 s of play. Fix and repeat until all pass; deliver with screenshots and one line per check.
```
