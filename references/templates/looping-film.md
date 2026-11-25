# Template: looping film

For a short, non-interactive animation that plays in the browser and can be exported
frame by frame: loops, product teasers, character vignettes. Target 450–850 words for
≤10 s; up to ~1,000 for longer or multi-shot films.

Work out the timing math before writing: frame count = fps × length; every cycle
(walk, spin, bob) must complete a whole number of times within LENGTH.

```text
Build a single-file 3D animated loop: [one-line description]. [One line of intent, e.g. "A calm, satisfying little ritual you'd watch five times in a row."]

BRAND
HERO:    [character/object, size in m, construction, key proportions]
PALETTE: [role → #hex for 5–7 roles: background, ground, HERO base, HERO accent, prop, light warm, light cool]
SET:     [environment, size in m, what's in frame]
PROPS:   [each prop with size and role in the story]
ACCENTS: [steam, dust, sparkles; count and size]

FORMAT
- Canvas [1080×1080 / 1920×1080 / 1080×1920], letterboxed to fit the window.
- [30] fps, [N.0] s, [frames] frames. Loops seamlessly: the frame at t = [N] equals frame 0.
- `window.renderAt(t)` draws the exact frame for t (seconds) from t alone. Playback calls renderAt((now - start) % LENGTH).
- `?frame=N` renders frame N and stops (for capture). `window.LENGTH` and `window.FPS` are exposed.
- All randomness from mulberry32 seeded with [seed]. No Math.random, no Date-dependent state.
- Secondary motion (springs, jiggle) computed in closed form from t, or simulated from t=0 with a fixed 1/240 s step and cached; never integrated across live frames.

LOOK
- Lighting: [key/fill/rim: color, intensity, direction]. [Environment map].
- Lens: [focal length or vertical FOV], [depth of field: focus distance, aperture-equivalent, or none].
- Materials: [per object: roughness, metalness, sheen, clearcoat].
- Post: [ACES/AgX, exposure, bloom threshold/strength if any, grain amount, vignette].
- Shadows: [soft shadow map size; contact shadow under HERO].

BEATS
[Start–end in seconds and frames · what moves · how (curve, distance, angle) · why.]
0.00–[x] s (f0–[n])   [...]
...
[last] s (f[frames])  = frame 0. [Describe how the end pose matches the start pose.]

CAMERA
[Position, target, FOV; any move as keyframes with easing; must also loop.]

SOUND (optional)
[Web Audio, synthesized only (oscillators + noise), starts on first click (autoplay policy). Hits keyed to exact frames: f[n] [sound], f[n] [sound]. A mute toggle.]

TECHNICAL
- One self-contained index.html, three.js 0.160.0. No CDN: `npm install three@0.160.0`, then a build.mjs inlines node_modules/three/build/three.module.js and every addon used (examples/jsm), following their relative imports and rewriting them to `three/addons/<path>`, as base64 `data:` URLs in an import map, with the app in an inline module. Deliver index.html, build.mjs and the app source.
- Renderer: [WebGL2 / WebGPU with fallback]. sRGB output, DPR capped at 2.
- 60 fps real-time playback on a mid-range laptop at the given resolution.
- prefers-reduced-motion: [show a still at frame [n] with a play button].
- Small corner controls only: play/pause, frame scrubber, frame counter; mouse, touch, and Space/←/→. They auto-hide after 2 s and never overlap the HERO.

[ASSETS (Blender): High/Maximum only, when the user said Blender is available or wasn't sure. Copy and adapt the block in blender-assets.md.]

AVOID
[4–8 lines from failure-modes.md, adapted.]

CHECKS
Before delivering:
1. Render frames [0, quarter, half, three-quarter, last] via ?frame=N and screenshot each.
2. Compare frame 0 and frame [frames]: pixel difference must be under 0.5%. Also compare frames [frames−1] and 0 for a smooth seam.
3. Call renderAt(t) for the same t twice, out of order; both render the same pixels.
4. Read the console: zero errors or warnings. With the network blocked, the page loads with zero requests and logs THREE.REVISION 160 once at startup.
5. [Film-specific checks: feet planted during contact beats, no part intersects another, every beat lands at its timestamp ±1 frame, nothing floats.]
Fix anything that fails, repeat, then deliver with the frames and a one-line result per check.
```
