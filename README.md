# 3d-prompt-forge

A Claude skill that turns a rough idea for a 3D or animated project into a detailed,
production-grade prompt you can hand to an AI coding model (Claude, Claude Code, Cursor,
Codex, or similar) to get a strong result on the first run.

It writes the prompt. It doesn't build the project.

## What it does

1. **Classifies** your idea into one of six project types.
2. **Fills gaps with defaults** instead of interviewing you. It asks at most three
   short questions, and only when the answer would change the whole result.
3. **Writes the prompt** from a type-specific template: a swappable brand block
   (HERO, PALETTE, SET, PROPS, ACCENTS), exact numbers for color, size, timing and
   camera, deterministic animation hooks, named failure modes to avoid, and a
   definition of done the executing model has to verify in a browser.
   Generated prompts never load code from a CDN: they tell the model to
   `npm install three@0.160.0` (and any other library at an exact version) and inline
   the library source into the single HTML file, so it runs offline.
4. **Hands you** the prompt in one copyable block, plus 2–3 follow-up revision prompts
   for the problems most likely to show up in the first result, and a note on which
   tool it suits.

## Before / after

**Before** (what most people type):

> make a 3d spinning globe that looks cool

**After** (excerpt of what the skill returns):

```text
Build a single-file 3D animated loop: a small hand-painted globe turns once while a
paper airplane circles it. A quiet, satisfying desk-toy loop.

BRAND
HERO:    globe, 0.5 m diameter, on a brass stand tilted 23.4°
PALETTE: ocean #2F5D7C, land #C9B37E, brass #B08D57, background #F1ECE2, accent #E25B45
SET:     a desk surface, soft falloff to PALETTE background
PROPS:   a folded paper airplane (0.12 m), PALETTE accent stripe
ACCENTS: a thin dotted trail behind the PROP

FORMAT
- 1080×1080, 30 fps, 6.0 s, 180 frames. The frame at t = 6.0 equals frame 0.
- window.renderAt(t) draws any frame from t alone; seeded randomness only.
- The HERO turns exactly 360° in 6 s; the PROP orbits exactly twice.
...
AVOID
- Land drawn as a blurry low-res texture. Generate land shapes procedurally at 4096×2048.
- The PROP passing through the globe or stand; orbit radius 0.42 m.
- Washed-out lighting. No ambient light; the night side of the HERO sits near 35% luminance.
...
CHECKS
1. Render frames 0, 45, 90, 135, 180 via ?frame=N and screenshot each.
2. Frame 0 vs. frame 180: pixel difference under 0.5%.
...
```

The full outputs run 200–1,000 words depending on the project. See
[`references/examples.md`](references/examples.md) for four complete worked examples.

## The six prompt types

| Type | For |
|---|---|
| **Interactive toy** | Something you poke, squish, drag, or configure: plush, jelly, fidget, product configurator |
| **Scroll website** | A landing page or small site where scrolling drives 3D moments |
| **Looping film** | A short non-interactive animation, frame-exact and seamless |
| **Playable game** | A small browser game with one tight core loop |
| **Explainer animation** | An animation that teaches how something works |
| **Blender scene** | A Python-built Blender scene with renders and a .blend file |

## Install

### Claude (claude.ai or the desktop app)

1. Download this repository as a ZIP (Code → Download ZIP), or zip the folder yourself
   so that `SKILL.md` sits at the top level of the folder inside the ZIP.
2. In Claude, open **Settings → Capabilities → Skills** (the location can move between
   releases; look for "Skills") and choose **Upload skill**.
3. Select the ZIP. The skill appears as `3d-prompt-forge`; make sure it's turned on.

### Claude Code

Copy the folder into your personal skills directory:

```bash
git clone https://github.com/brother12334/3D-prompt-forge.git ~/.claude/skills/3d-prompt-forge
```

Or, for a single project, into that project's `.claude/skills/3d-prompt-forge/`.
Claude Code picks it up the next time it starts.

## Use

Just ask:

- "Write me a prompt for a squishy jelly cat I can poke."
- "Expand this into a proper prompt: a website for my pottery studio with a 3D vase."
- "Improve this prompt for a Three.js robot animation: …"
- "What should I tell Claude Code to make a Blender diorama of a tiny bookshop?"

## Repository layout

```
SKILL.md                      the skill: steps and output format
references/
  principles.md               rules every generated prompt follows
  templates/                  one skeleton per project type
    interactive-toy.md
    scroll-website.md
    looping-film.md
    playable-game.md
    explainer-animation.md
    blender-scene.md
  failure-modes.md            shortcuts models take, and what to ask for instead
  examples.md                 four complete worked examples
```

## Originality

The skill never asks for copyrighted characters, real brand logos, or a copy of an
existing site or studio style. If you name one, it writes an original equivalent and
tells you so. All examples in this repository are original.

## License

MIT. See [LICENSE](LICENSE).
