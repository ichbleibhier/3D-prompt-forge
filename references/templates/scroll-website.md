# Template: scroll website

For a landing page or small site where scrolling drives 3D moments. Target 600–1,000
words; write RESPONSIVE, PERFORMANCE and the scroll system as terse lines, and spend
the words on SECTIONS and 3D MOMENTS. If the user didn't give a real brand, invent a fictional one with a name,
location, and voice, and make all copy editable in one config object.

```text
Build a single-page scroll website for [fictional brand / user's brand], a [what they are, where]. [One line of intent, e.g. "It should feel like walking into the shop: warm, tactile, unhurried."]

BRAND
BRAND NAME: [name] — [tagline, 3–7 words]
HERO:       [the 3D object that anchors the site, size in m, material]
PALETTE:    background [#hex], surface [#hex], ink [#hex], muted ink [#hex], accent [#hex], accent-2 [#hex]
TYPE:       headings [family weight], body [family weight size/line-height], labels [family, tracking]
SET:        [the 3D environment the HERO lives in]
PROPS:      [secondary 3D objects that appear in specific sections]
ACCENTS:    [particles, grain, light shafts]
VOICE:      [2–3 adjectives + one sample sentence of copy]

CONCEPT
[2–3 sentences: the idea that ties the scroll together, e.g. "the HERO travels from raw to finished as you scroll"].

SECTIONS (in order; heights in viewport units)
1. [Name] — [100vh]. Shows: [copy blocks, headline text]. 3D: [what the HERO/camera does].
2. [Name] — [height]. Shows: [...]. 3D: [...].
[5–8 sections. Include: hero, 2–4 story/product sections, social proof or details, call to action, footer.]

SCROLL SYSTEM
- One smoothed scroll value drives everything: [Lenis 1.1.13 / custom lerp at factor 0.1] produces `progress` 0→1 for the page and `sectionProgress[i]` 0→1 per section.
- Both DOM animations and the WebGL scene read from that same value every frame. No separate ScrollTrigger timelines fighting it, no IntersectionObserver-triggered 3D tweens.
- The 3D canvas is fixed full-viewport behind the DOM (z-index below content, pointer-events none except where noted).
- Scrolling backward plays every moment in reverse exactly; nothing is one-shot.
- Mouse wheel, trackpad, touch, and keyboard scrolling (Space, Page Down, arrows) all feed the same value.

3D MOMENTS AND TRANSITIONS
[Per section: keyframes as sectionProgress → value. Camera position/target, HERO transform, material changes, light changes, PROPS entering. Use explicit easing.]
[Transitions between sections: what crossfades, over what progress range.]

LOOK
[Lighting rig, environment, tone mapping, post (if any), how the DOM and 3D share the PALETTE.]

CONFIG
- All copy, section headings, CTAs, prices, hours, address, and image/model URLs live in one `const SITE = {...}` object at the top of the script. The page renders from it.
- 3D assets are generated procedurally or loaded from URLs in SITE with a procedural fallback.

RESPONSIVE AND ACCESSIBILITY
- Breakpoints: [≥1200, 768–1199, <768]. On narrow screens: [how layout and camera framing change; HERO scale].
- Semantic HTML: header, main, section with headings, footer. Text is real DOM text, not in canvas.
- Contrast ≥ 4.5:1 for body text over every background it sits on.
- Keyboard: all links/buttons focusable with visible focus ring in PALETTE accent.
- prefers-reduced-motion: [3D holds static poses per section; crossfades replace camera moves; no smoothing].
- The page is readable and navigable if WebGL fails (static poster gradient behind text).

PERFORMANCE
- One self-contained index.html. three.js 0.160.0 via a jsDelivr importmap; [other pinned libs].
- Renderer: [WebGL2 / WebGPU with fallback]. DPR capped at 2 (1.5 below 768 px).
- Render only when scroll or animation changes; pause when the tab is hidden.
- [Polygon/texture budget]. Fonts via Google Fonts with display=swap.
- 60 fps while scrolling on a mid-range laptop.

AVOID
[4–8 lines from failure-modes.md, adapted.]

DEFINITION OF DONE
Open index.html in a browser and, before delivering:
1. At 1440×900: screenshot each section at sectionProgress 0.5.
2. At 390×844: screenshot the same sections.
3. Scroll forward to the end, then all the way back; screenshot section [n] mid-transition both ways and confirm they match.
4. Read the console: zero errors or warnings.
5. [Site-specific checks: headline fully visible over the 3D at every section, CTA clickable, text contrast, no layout shift after fonts load, reduced-motion mode works.]
6. Log fps during a full scroll; must average ≥ 55.
Fix anything that fails, repeat, then deliver with the screenshots and a one-line result per check.
```
