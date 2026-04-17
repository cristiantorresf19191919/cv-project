import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/* ══════════════════════════════════════════════════════════
   Beautiful template-to-PDF capture
   ──────────────────────────────────────────────────────────
   1. Finds the template via [data-pdf-target]
   2. Hides UI chrome, footer, interactive elements
   3. Fixes html2canvas limitations:
      – background-clip:text  → solid color fallback
      – backdrop-filter:blur  → opaque background fallback
      – CSS animations        → frozen
      – viewport min-heights  → removed
   4. Waits for fonts + images to fully load
   5. Captures at 2× with html2canvas (PNG quality)
   6. Slices into A4 pages with template background
   7. Restores every inline style change
   ══════════════════════════════════════════════════════════ */

const A4_W = 210; // mm
const A4_H = 297; // mm

export async function captureTemplatePDF(filename: string): Promise<void> {
  /* ── 1. Locate template ──────────────────────────────── */
  const wrapper = document.querySelector<HTMLElement>('[data-pdf-target]');
  if (!wrapper) { alert('Template not found.'); return; }
  const tpl = wrapper.firstElementChild as HTMLElement | null;
  if (!tpl) { alert('Template not found.'); return; }

  /* ── 2. Save scroll & go to top ──────────────────────── */
  const savedScroll = window.scrollY;
  window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  await sleep(150);

  /* ── 3. Style-override tracker (restores in finally) ─── */
  const saved = new Map<HTMLElement, string>();
  const set = (el: HTMLElement, prop: string, val: string) => {
    if (!saved.has(el)) saved.set(el, el.style.cssText);
    el.style.setProperty(prop, val, 'important');
  };
  const hide = (el: HTMLElement) => set(el, 'display', 'none');

  try {
    /* ── 4. Hide UI chrome outside template ──────────── */
    qsa(
      '[class*="switcher"],[class*="Switcher"],' +
      '[class*="scrollProgress"],[class*="ScrollProgress"],' +
      '[class*="keyboard"],[class*="Keyboard"],' +
      '[class*="floating"],[class*="Floating"],' +
      '[class*="liveAvail"],[class*="LiveAvail"],' +
      '[class*="visitorPulse"],[class*="VisitorPulse"],' +
      '[class*="analyticsBadge"],[class*="AnalyticsBadge"],' +
      '[class*="easterEgg"],[class*="EasterEgg"],' +
      '[class*="commandPalette"],[class*="CommandPalette"]'
    ).forEach(el => { if (!tpl.contains(el)) hide(el); });

    /* ── 5. Hide footer + interactive elements ───────── */
    tpl.querySelectorAll<HTMLElement>(
      'footer, [data-pdf-hide]'
    ).forEach(hide);

    /* ── 6. Remove wrapper padding (switcher offset) ─── */
    const parent = wrapper.parentElement;
    if (parent) set(parent, 'padding-top', '0px');

    /* ── 7. Neutralise framer-motion transforms ──────── */
    set(wrapper, 'transform', 'none');
    set(wrapper, 'filter', 'none');

    /* ── 8. Freeze CSS animations & transitions ──────── */
    const allEls = tpl.querySelectorAll<HTMLElement>('*');
    allEls.forEach(el => {
      const cs = getComputedStyle(el);
      if (cs.animationName && cs.animationName !== 'none') {
        set(el, 'animation', 'none');
      }
    });

    /* ── 9. Remove viewport-relative min-heights ─────── */
    set(tpl, 'min-height', 'auto');
    allEls.forEach(el => {
      const mh = getComputedStyle(el).minHeight;
      if (mh && (mh.includes('vh') || mh.includes('svh') || mh.includes('dvh'))) {
        set(el, 'min-height', 'auto');
      }
    });

    /* ── 10. Fix background-clip:text ────────────────── */
    fixGradientText(tpl, set);

    /* ── 11. Fix backdrop-filter ─────────────────────── */
    fixBackdropFilter(tpl, set);

    /* ── 12. Wait for fonts & images ─────────────────── */
    await Promise.all([
      document.fonts.ready,
      loadAllImages(tpl),
    ]);

    /* ── 13. Resolve background ──────────────────────── */
    const bg = getComputedStyle(tpl).backgroundColor || '#000';

    /* ── 14. Let reflow settle ───────────────────────── */
    await sleep(400);

    /* ── 15. Capture ─────────────────────────────────── */
    const canvas = await html2canvas(tpl, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: bg,
      logging: false,
      imageTimeout: 30_000,
      width: tpl.offsetWidth,
      height: tpl.scrollHeight,
      scrollX: 0,
      scrollY: 0,
    });

    /* ── 16. Build multi-page A4 PDF ─────────────────── */
    const pxPerMm = canvas.width / A4_W;
    const pgH = Math.floor(A4_H * pxPerMm);
    const pages = Math.ceil(canvas.height / pgH);
    const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });

    for (let i = 0; i < pages; i++) {
      if (i > 0) pdf.addPage();

      const sy = i * pgH;
      const sh = Math.min(pgH, canvas.height - sy);

      const pc = document.createElement('canvas');
      pc.width = canvas.width;
      pc.height = pgH;

      const ctx = pc.getContext('2d')!;
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, pc.width, pc.height);
      ctx.drawImage(canvas, 0, sy, canvas.width, sh, 0, 0, canvas.width, sh);

      pdf.addImage(pc.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, A4_W, A4_H);
    }

    pdf.save(filename);
  } finally {
    /* ── 17. Restore every modified element ──────────── */
    saved.forEach((css, el) => { el.style.cssText = css; });
    window.scrollTo({ top: savedScroll, behavior: 'instant' as ScrollBehavior });
  }
}

/* ═══════════════════════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════════════════════ */

function sleep(ms: number) {
  return new Promise<void>(r => setTimeout(r, ms));
}

function qsa(sel: string): HTMLElement[] {
  return Array.from(document.querySelectorAll<HTMLElement>(sel));
}

/**
 * html2canvas cannot render `-webkit-background-clip: text`.
 * Detect all gradient-clipped text and replace with a solid
 * color that matches the template's accent palette.
 */
function fixGradientText(
  root: HTMLElement,
  set: (el: HTMLElement, p: string, v: string) => void,
) {
  root.querySelectorAll<HTMLElement>('*').forEach(el => {
    const cs = getComputedStyle(el);

    const clip =
      cs.getPropertyValue('-webkit-background-clip') ||
      cs.getPropertyValue('background-clip');
    const fill = cs.getPropertyValue('-webkit-text-fill-color');

    const isClipped = clip === 'text';
    const isTransparent =
      fill === 'transparent' ||
      fill === 'rgba(0, 0, 0, 0)';

    if (!isClipped && !isTransparent) return;

    // Pick the best fallback color
    const accent = resolveAccentColor(root);
    const bgLum = backgroundLightness(el);
    const fallback = accent || (bgLum < 0.5 ? '#f0f0f0' : '#1a1a1a');

    set(el, '-webkit-text-fill-color', 'unset');
    set(el, '-webkit-background-clip', 'unset');
    set(el, 'background-clip', 'unset');
    set(el, 'background', 'none');
    set(el, 'color', fallback);
  });
}

/**
 * html2canvas ignores `backdrop-filter`. Bump any semi-transparent
 * backgrounds with backdrop-filter to ≥ 0.92 opacity so cards/panels
 * remain visible instead of becoming see-through.
 */
function fixBackdropFilter(
  root: HTMLElement,
  set: (el: HTMLElement, p: string, v: string) => void,
) {
  root.querySelectorAll<HTMLElement>('*').forEach(el => {
    const cs = getComputedStyle(el);

    const bf =
      cs.getPropertyValue('backdrop-filter') ||
      cs.getPropertyValue('-webkit-backdrop-filter');
    if (!bf || bf === 'none') return;

    const bg = cs.backgroundColor;
    if (!bg || bg === 'transparent' || bg === 'rgba(0, 0, 0, 0)') return;

    const m = bg.match(
      /rgba?\(\s*(\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\s*\)/,
    );
    if (!m) return;

    const [, r, g, b, aStr] = m;
    const alpha = aStr !== undefined ? parseFloat(aStr) : 1;
    if (alpha < 0.88) {
      set(el, 'background-color', `rgba(${r}, ${g}, ${b}, 0.92)`);
    }
  });
}

/**
 * Resolve the template's accent color from CSS custom properties.
 * Templates use either `--a` or `--accent`.
 */
function resolveAccentColor(root: HTMLElement): string | null {
  const cs = getComputedStyle(root);
  const a = cs.getPropertyValue('--a').trim();
  if (a) return a;
  const accent = cs.getPropertyValue('--accent').trim();
  if (accent) return accent;
  return null;
}

/**
 * Walk up the DOM to estimate whether the background behind
 * an element is light (→ 1) or dark (→ 0).
 */
function backgroundLightness(el: HTMLElement): number {
  let cur: HTMLElement | null = el;
  while (cur) {
    const bg = getComputedStyle(cur).backgroundColor;
    const m = bg?.match(/rgba?\(\s*(\d+),\s*(\d+),\s*(\d+)/);
    if (m) {
      const lum =
        (0.299 * Number(m[1]) + 0.587 * Number(m[2]) + 0.114 * Number(m[3])) /
        255;
      if (lum > 0.01) return lum;
    }
    cur = cur.parentElement;
  }
  return 0;
}

/**
 * Wait for every `<img>` inside root to finish loading.
 */
async function loadAllImages(root: HTMLElement): Promise<void> {
  const imgs = root.querySelectorAll<HTMLImageElement>('img');
  await Promise.all(
    Array.from(imgs).map(img => {
      if (img.complete && img.naturalHeight > 0) return Promise.resolve();
      return new Promise<void>(resolve => {
        const timer = setTimeout(resolve, 15_000);
        const done = () => { clearTimeout(timer); resolve(); };
        img.addEventListener('load', done, { once: true });
        img.addEventListener('error', done, { once: true });
      });
    }),
  );
}
