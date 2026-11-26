import { REVISION } from 'three';
import { createForge } from './forge.js';

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const EXAMPLES = window.__EXAMPLES__ || [];

// ---------- copy buttons ----------
async function copyText(btn, text) {
  const label = btn.textContent;
  try {
    await navigator.clipboard.writeText(text);
    btn.textContent = 'Copied';
  } catch {
    const pre = btn.closest('[data-copy-scope]')?.querySelector('pre');
    if (pre) {
      const r = document.createRange(); r.selectNodeContents(pre);
      const s = getSelection(); s.removeAllRanges(); s.addRange(r);
    }
    btn.textContent = 'Selected: press Ctrl+C';
  }
  setTimeout(() => { btn.textContent = label; }, 1600);
}
document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-copy]');
  if (!btn) return;
  const scope = btn.closest('[data-copy-scope]');
  const text = btn.dataset.copyText ?? scope?.querySelector('pre')?.textContent ?? '';
  copyText(btn, text);
});

// ---------- example tabs ----------
const tabs = [...document.querySelectorAll('[role="tab"]')];
function selectTab(tab, focus) {
  tabs.forEach((t) => {
    const on = t === tab;
    t.setAttribute('aria-selected', on);
    t.tabIndex = on ? 0 : -1;
    document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
  });
  if (focus) tab.focus();
}
tabs.forEach((t, i) => {
  t.addEventListener('click', () => selectTab(t));
  t.addEventListener('keydown', (e) => {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (d) { e.preventDefault(); selectTab(tabs[(i + d + tabs.length) % tabs.length], true); }
  });
});
document.querySelectorAll('[data-open-example]').forEach((a) => {
  a.addEventListener('click', () => {
    const tab = document.getElementById('tab-' + a.dataset.openExample);
    if (tab) selectTab(tab);
  });
});

// ---------- tier dial ----------
const TIERS = window.__TIERS__ || [];
const dial = document.getElementById('tier-dial');
const tierOut = document.getElementById('tier-detail');
let forge = null;
function renderTier(i) {
  const t = TIERS[i];
  if (!t) return;
  document.documentElement.style.setProperty('--heat', t.color);
  tierOut.querySelector('[data-f="name"]').textContent = t.name;
  tierOut.querySelector('[data-f="heat"]').textContent = t.heat;
  tierOut.querySelector('[data-f="blurb"]').textContent = t.blurb;
  const dl = tierOut.querySelector('dl');
  dl.replaceChildren(...t.rows.flatMap(([k, v]) => {
    const dt = document.createElement('dt'); dt.textContent = k;
    const dd = document.createElement('dd'); dd.textContent = v;
    return [dt, dd];
  }));
  forge?.setHeat(t.level);
}
dial?.addEventListener('input', () => renderTier(+dial.value));
dial?.addEventListener('change', () => renderTier(+dial.value));

// ---------- hero ----------
const canvas = document.getElementById('forge');
const plate = document.getElementById('plate');
const chips = [...document.querySelectorAll('[data-idea]')];
let current = 0;

function stamp(i) {
  const ex = EXAMPLES[i];
  if (!ex) return;
  plate.querySelector('[data-f="tier"]').textContent = ex.tier + ' · ' + ex.type;
  plate.querySelector('[data-f="decisions"]').textContent = ex.decisions.replace(/^Decisions:\s*/, '');
  plate.querySelector('[data-f="opening"]').textContent = ex.prompt.split('\n').slice(0, 7).join('\n');
  plate.querySelector('[data-f="words"]').textContent = ex.words + ' words';
  plate.querySelector('[data-open-example]').dataset.openExample = ex.slug;
  plate.classList.remove('stamped'); void plate.offsetWidth; plate.classList.add('stamped');
}
function choose(i) {
  current = i;
  chips.forEach((c, j) => c.setAttribute('aria-pressed', j === i));
  if (forge && !forge.strike(() => stamp(i))) stamp(i);
  if (!forge) stamp(i);
}
chips.forEach((c, i) => c.addEventListener('click', () => choose(i)));

try {
  forge = createForge(canvas, { reducedMotion });
  window.__forge = forge; // handy for checking the strike in a browser console
  canvas.addEventListener('click', () => choose((current + 1) % EXAMPLES.length));
  console.log('three.js r' + REVISION);
} catch (err) {
  document.documentElement.classList.add('no-webgl');
}
renderTier(dial ? +dial.value : 1);
stamp(0);
if (!reducedMotion && forge) {
  let idle = 0;
  setInterval(() => {
    idle++;
    if (document.hidden || idle % 2) return;
    choose((current + 1) % EXAMPLES.length);
  }, 3500);
  ['pointerdown', 'keydown', 'wheel'].forEach((ev) => addEventListener(ev, () => { idle = -6; }, { passive: true }));
}
