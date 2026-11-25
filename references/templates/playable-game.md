# Template: playable game

For a small browser game with a core loop: arcade, puzzle, runner, toy-like sandbox with
goals. Target 450–850 words. Keep scope to one core loop the executing model can finish
and tune; more content comes from parameters, not more systems.

```text
Build a single-file 3D browser game: [one-line pitch]. [One line of intent, e.g. "Pick-up-and-play, one more round, readable at a glance."]

BRAND
HERO:    [player character/vehicle, size in m, silhouette]
PALETTE: [roles → #hex: sky, ground, player, enemy, pickup, danger, UI ink, UI surface]
WORLD:   [arena/level shape and size in m, boundaries, landmarks]
PROPS:   [pickups, obstacles, hazards, each with size]
ACCENTS: [hit sparks, dust, screen shake amount]

CORE LOOP
[One sentence: what the player does every 5–10 seconds and why.]
[Win/lose conditions. Round length.]

PLAYER
- Controls: [keyboard keys], [mouse], [touch: on-screen joystick bottom-left 120 px, buttons bottom-right]. Gamepad optional.
- Movement: [speed m/s, acceleration, turn rate, jump height m, coyote time s, input buffer s].
- Stats: [health, stamina, ammo; values and regen].
- Feel: [hit stop ms, knockback m, camera shake amplitude/duration].

ENEMIES AND AI
[Each type: look (silhouette + PALETTE role), size, speed, behavior as a small state machine (idle → notice at N m → chase → attack windup N s → recover), damage, health.]
[Spawn rules: where, how many, how it scales.]

PROGRESSION
[Waves/levels/score multiplier; difficulty curve as numbers per wave; what unlocks.]
[High score saved in localStorage.]

HUD
[Each element: position, size, font, what it shows. Pause menu, game over screen with score + restart. Start screen with controls.]

LOOK
[Lighting, tone mapping, fog distance, material style (flat-shaded / toon ramp / PBR), outline if any.]

CAMERA
[Type (third-person follow / top-down / isometric), offset in m, FOV, follow lag (damping), collision avoidance, shake.]

SOUND (optional)
[Web Audio synthesized: jump, hit, pickup, death, music loop. Starts after first input. Mute key.]

TECHNICAL
- One self-contained index.html, three.js 0.160.0, [cannon-es 0.20.0 / custom collision]. No CDN: `npm install three@0.160.0`, then a build.mjs inlines node_modules/three/build/three.module.js and every addon used (examples/jsm), following their relative imports and rewriting them to `three/addons/<path>`, as base64 `data:` URLs in an import map, with the app in an inline module. Deliver index.html, build.mjs and the app source. [If cannon-es: install cannon-es@0.20.0 and inline its ESM build under `cannon-es` the same way.]
- Renderer: [WebGL2 / WebGPU with fallback]. DPR capped at 2.
- Fixed-timestep simulation at 60 Hz with interpolation for rendering; the same gameplay at 30, 60, and 144 Hz displays.
- Seeded PRNG for spawns, so a `?seed=N` reproduces a run.
- Keyboard, mouse, and touch. Pauses on blur. 60 fps target.
- prefers-reduced-motion: no screen shake, no flashing.
- Debug: `?debug=1` shows colliders and fps.

AVOID
[4–8 lines from failure-modes.md, adapted.]

DEFINITION OF DONE
Before delivering:
1. Play through the core loop at least [3] rounds using scripted inputs: [start, move, attack, collect, take damage, die, restart].
2. Screenshot: start screen, mid-round with enemies on screen, a hit moment, game over.
3. Confirm with [?debug=1]: player can't leave the WORLD, enemies don't stack inside each other, colliders match visuals.
4. Read the console: zero errors or warnings. With the network blocked, the page loads with zero requests and logs THREE.REVISION 160 once at startup.
5. Test touch controls at 390×844 and keyboard at 1440×900.
6. [Game-specific balance checks: round lasts N–M s for an average player; first death not before N s.]
Fix anything that fails, repeat, then deliver with screenshots and a one-line result per check.
```
