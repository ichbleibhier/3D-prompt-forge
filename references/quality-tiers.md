# Quality tiers

Before writing a prompt, the skill asks which tier the user wants. The tier sets how much
the generated prompt asks the executing model to build and verify. More scope and more
checking cost more tokens, time, and money to run. Fewer give a quicker, cheaper result.

The four tiers are Cheapest, Balanced, High, and Maximum. The templates and the length
bands in `principles.md` §11 describe **Balanced**. The other tiers scale from there.

## How to ask

Ask once, before writing, in the same message as any other questions (tier plus at most
two others). If the environment has a multiple-choice question tool, use it with these
four options. Otherwise send them as a numbered list:

```
What quality level should the prompt aim for?
1. Cheapest: a working first version with the smallest scope. Quick and cheap to run.
2. Balanced (recommended): the full spec with standard checks.
3. High: richer rendering, a polish pass, and stricter checks. Costs more to run.
4. Maximum: the biggest scope with several review-and-fix rounds. The most expensive to run.
Reply with a number, or "defaults" for Balanced.
```

For browser builds (every type except Blender scene), add a Blender question in the same
message, unless the tier is already known to be Cheapest or Balanced or the user already
said whether Blender is available:

```
Can the model that will run this prompt use Blender? (Only used at High or Maximum, to
model detailed assets like coral, rocks or creature bodies.)
a. Yes: Blender is installed, or it can pip-install bpy.
b. No: build everything in code.
c. Not sure (recommended): try Blender, fall back to code if it's missing.
```

Then stop and wait for the answers. "defaults" means Balanced, and "not sure" for Blender.
If the tier comes back Cheapest or Balanced, ignore the Blender answer.

Skip the question when the user has already chosen a tier:
- "quick", "cheap", "rough", "draft", "prototype", "low cost" → Cheapest
- "best", "highest quality", "polished", "portfolio piece", "detailed", "realistic" → High
- "maximum", "no expense spared", "go all out" → Maximum
- "just write it", "don't ask", "defaults", or a follow-up that improves an earlier
  prompt → Balanced, or that earlier prompt's tier

Skip the Blender question when the request mentions Blender for the assets ("model it in
Blender", "use Blender") → yes, or says to keep it code-only → no.

Name the tier first in the `Decisions:` line, e.g. `Decisions: High tier; interactive toy;
Blender assets with code fallback; …`.

## What each tier changes

| | Cheapest | Balanced | High | Maximum |
|---|---|---|---|---|
| **Prompt length** | 50–60% of the band | the band in §11 | band +25% | band +50% |
| **Scope** | The core only: 2 interactions, 4 website sections, 4–5 beats, 1 enemy type. No SOUND, no PROPS beyond one. | Template defaults | +1–2 interactions, sections, or beats; SOUND included where it fits | Everything in High plus presets, extra states (e.g. a second expression set, a night variant), and full SOUND |
| **Rendering** | MeshStandardMaterial, one shadow-casting light, no post-processing; simple per-vertex springs instead of a soft-body cage | Template defaults | Adds tuned post (SSAO or GTAO, bloom on accents only), 4096 shadow maps, procedural detail maps | High, plus the most expensive look that still holds 60 fps, with a named fallback per feature |
| **Verification** | Console check, the offline check, 2 screenshots, one fix pass | The template's full definition of done | Full definition of done + a named polish checklist (5–8 items) + an fps check under 4× CPU throttle | High + 3 review-and-fix rounds, each re-shooting every screenshot against the checklist, + Chromium, Firefox, and WebKit |
| **Blender assets** (browser builds) | never | never | if the user said yes or not sure: the hard-to-code organic assets (`blender-assets.md`) | if yes or not sure: every non-simulated detailed asset, with more variants |
| **AVOID lines** | 4 | 4–8 | 6–8 | 8 |
| **Follow-up revisions** | 2 | 2–3 | 3 | 3 |
| **Best run in** | a fast, low-cost model (Haiku-class) in chat or a light agent | a mid-tier coding model (Sonnet-class) in an agent that can open a browser | the most capable model (Opus-class) in an agent with browser and screenshots | the most capable model at high effort in a long agent session |

## Never dropped, at any tier

Cheapest is smaller, not sloppier. Every tier keeps:
- the BRAND block, with exact numbers for colors, sizes, timing, and camera
- `renderAt(t)` or `seek(t)` with seeded randomness for anything that plays over time,
  and the frame-0 seam for loops
- the no-CDN inlining line and the offline check
- mouse + touch, prefers-reduced-motion, and the 60 fps target
- at least 4 AVOID lines and a definition of done

## Writing the High and Maximum extras

Every extra must be as specific as the rest of the prompt. A polish checklist names
visible details with numbers, never "make it nicer". For example:
- "Fabric fuzz rim: sheen roughness 0.35, visible on the silhouette at every orbit angle."
- "Eyes catch a specular glint from the key light in every screenshot."
- "Contact shadow darkens 15% while the HERO is squashed."
