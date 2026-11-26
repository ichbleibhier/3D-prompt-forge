// Builds the showcase site from references/examples.md.
//   npm install && node build.mjs
// Writes ../docs/index.html (GitHub Pages) and, if ARTIFACT_OUT is set, a
// skeleton-free copy for publishing as a claude.ai artifact.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as esbuild from 'esbuild';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..');
const REPO_URL = 'https://github.com/brother12334/3D-prompt-forge';
const CLONE_URL = REPO_URL + '.git';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const inline = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/`([^`]+)`/g, '<code>$1</code>');

// ---------- parse examples.md ----------
const md = fs.readFileSync(path.join(root, 'references/examples.md'), 'utf8');
const SLUGS = { 'interactive toy': 'toy', 'scroll website': 'website', 'looping': 'film', 'playable game': 'game' };
const examples = md.split(/\n## Example \d+: /).slice(1).map((sec) => {
  const heading = sec.split('\n')[0];
  const tier = (heading.match(/\((\w+)/) || [])[1] || '';
  const type = heading.replace(/\s*\(.*$/, '');
  const slug = Object.entries(SLUGS).find(([k]) => heading.includes(k))?.[1] || type.toLowerCase().replace(/\W+/g, '-');
  const [before, after] = sec.split('**Output:**');
  const input = (before.match(/\*\*Input:\*\*\s*"(.+?)"/) || [])[1] || '';
  const convoLines = before.split('\n').slice(1).filter((l) => !/^\*\*Input:/.test(l) && !/^---\s*$/.test(l));
  const blocks = [];
  let quote = null, para = null;
  for (const line of convoLines) {
    if (line.startsWith('>')) { para = null; (quote ??= blocks[blocks.push({ q: [] }) - 1]).q.push(line.replace(/^>\s?/, '')); continue; }
    quote = null;
    if (!line.trim()) { para = null; continue; }
    if (para) para.p += ' ' + line.trim(); else para = blocks[blocks.push({ p: line.trim() }) - 1];
  }
  const convo = blocks.map((b) => {
    if (b.q) {
      // Re-flow hard-wrapped quote lines; keep a new line before each "a." / "b." option.
      const lines = [];
      for (const l of b.q) {
        if (!lines.length || /^[a-z]\.\s/.test(l)) lines.push(l.trim()); else lines[lines.length - 1] += ' ' + l.trim();
      }
      return '<blockquote>' + lines.map(inline).join('<br>') + '</blockquote>';
    }
    const m = b.p.match(/^\*\*(.+?):\*\*\s*(.*)$/);
    return m ? `<p><strong>${esc(m[1])}</strong>${inline(m[2])}</p>` : `<p>${inline(b.p)}</p>`;
  }).join('\n');
  const decisions = (after.match(/^Decisions:.*$/m) || [''])[0];
  const fences = [...after.matchAll(/```text\n([\s\S]*?)```/g)].map((m) => m[1].replace(/\n$/, ''));
  const best = (after.match(/^Best run in:.*$/m) || [''])[0];
  const prompt = fences[0] || '';
  return { slug, type, tier, input, convo, decisions, prompt, followups: fences.slice(1), best, words: prompt.split(/\s+/).filter(Boolean).length };
});
if (examples.length !== 4) throw new Error('expected 4 examples, got ' + examples.length);

const tiers = [
  { name: 'Cheapest', heat: 'Dull red · about 650 °C', color: '#c0452c', level: 0.12,
    blurb: 'A working first version with the smallest scope. Quick and cheap to run.',
    rows: [['Prompt length', '50–60% of normal'], ['Scope', 'The core only: 2 interactions, 4 sections or 4–5 beats'], ['Look', 'Simple materials, one shadow light, no post-processing'], ['Checking', 'Console, offline check, 2 screenshots, one fix pass'], ['Blender', 'Never'], ['Run it in', 'A fast, low-cost model']] },
  { name: 'Balanced', heat: 'Cherry red · about 800 °C', color: '#e04a26', level: 0.45,
    blurb: 'The full spec with standard checks. The default.',
    rows: [['Prompt length', 'The normal range, e.g. 350–500 words for a toy'], ['Scope', 'Everything in the template'], ['Look', 'The template’s materials, lighting and shadows'], ['Checking', 'The full definition of done'], ['Blender', 'Never'], ['Run it in', 'A mid-tier coding model that can open a browser']] },
  { name: 'High', heat: 'Orange · about 1000 °C', color: '#ff7a1f', level: 0.75,
    blurb: 'Richer rendering, a polish pass and stricter checks. Costs more to run.',
    rows: [['Prompt length', 'About 25% longer'], ['Scope', '1–2 more interactions, sections or beats, plus sound'], ['Look', 'Ambient occlusion, bloom on accents, sharper shadows, detail maps'], ['Checking', 'A named polish checklist and an fps test on a 4× slowed CPU'], ['Blender', 'Asked about when the idea has organic parts like coral, rocks or food'], ['Run it in', 'The most capable model, with a browser and screenshots']] },
  { name: 'Maximum', heat: 'Yellow-white · about 1200 °C', color: '#ffd27a', level: 1.0,
    blurb: 'The biggest scope, with several review-and-fix rounds. The most expensive to run.',
    rows: [['Prompt length', 'About 50% longer'], ['Scope', 'Everything in High, plus presets, extra states and full sound'], ['Look', 'The richest look that still holds 60 fps, with a fallback per feature'], ['Checking', '3 review-and-fix rounds, tested in Chromium, Firefox and WebKit'], ['Blender', 'As in High, with more variants per asset'], ['Run it in', 'The most capable model at high effort, in a long session']] },
];

// ---------- render pieces ----------
const chips = examples.map((e, i) => `<button class="chip" type="button" data-idea="${i}" aria-pressed="${i === 0}">“${esc(e.input)}”</button>`).join('');
const tabs = examples.map((e, i) => `<button role="tab" id="tab-${e.slug}" aria-controls="panel-${e.slug}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}"><small>${esc(e.tier)}</small>${esc(e.type[0].toUpperCase() + e.type.slice(1))}</button>`).join('');
const panels = examples.map((e, i) => `
<div class="panel" role="tabpanel" id="panel-${e.slug}" aria-labelledby="tab-${e.slug}"${i ? ' hidden' : ''}>
  <div class="convo">
    <p><strong>You type</strong><span class="input">“${esc(e.input)}”</span></p>
    ${e.convo}
  </div>
  <div class="out">
    <p class="decisions"><b>Decisions:</b> ${inline(e.decisions.replace(/^Decisions:\s*/, ''))}</p>
    <div class="plate full" data-copy-scope>
      <div class="row"><span class="tier">The prompt · ${e.words} words</span><button class="copy" type="button" data-copy>Copy prompt</button></div>
      <pre tabindex="0">${esc(e.prompt)}</pre>
    </div>
    <p class="label">Follow-up revisions</p>
    <div class="follow">${e.followups.map((f) => `<div class="item" data-copy-scope><pre>${esc(f)}</pre><button class="copy" type="button" data-copy>Copy</button></div>`).join('')}</div>
    <p class="best">${inline(e.best)}</p>
  </div>
</div>`).join('');

// ---------- bundle the script (three.js inlined, no CDN) ----------
const result = await esbuild.build({
  entryPoints: [path.join(here, 'src/main.js')], bundle: true, format: 'esm', minify: true,
  write: false, target: 'es2022', legalComments: 'none',
});
const bundle = result.outputFiles[0].text.replace(/<\/script/gi, '<\\/script');

const json = (v) => JSON.stringify(v).replace(/</g, '\\u003c');
const fragment = fs.readFileSync(path.join(here, 'src/page.html'), 'utf8')
  .replaceAll('{{REPO_URL}}', REPO_URL).replaceAll('{{CLONE_URL}}', CLONE_URL)
  .replace('{{CHIPS}}', () => chips).replace('{{TABS}}', () => tabs).replace('{{PANELS}}', () => panels)
  .replace('{{EXAMPLES_JSON}}', () => json(examples.map(({ convo, ...e }) => e)))
  .replace('{{TIERS_JSON}}', () => json(tiers))
  .replace('{{BUNDLE}}', () => bundle);

const full = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
${fragment.slice(0, fragment.indexOf('</style>') + 8)}
</head>
<body>
${fragment.slice(fragment.indexOf('</style>') + 8)}
</body>
</html>
`;
fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
fs.writeFileSync(path.join(root, 'docs/index.html'), full);
if (process.env.ARTIFACT_OUT) fs.writeFileSync(process.env.ARTIFACT_OUT, fragment);
console.log('docs/index.html', (full.length / 1e6).toFixed(2), 'MB;', examples.map((e) => `${e.slug}:${e.words}w`).join(' '));
