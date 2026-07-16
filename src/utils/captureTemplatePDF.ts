import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/* ══════════════════════════════════════════════════════════
   Beautiful template-to-PDF capture — v2
   ──────────────────────────────────────────────────────────
   Handles every template with consistent high-quality output.
   Smart page breaks cut on clean rows so text is never guillotined.

   Key fixes for html2canvas limitations:
   • background-clip:text   → solid accent color fallback
   • backdrop-filter:blur   → opaque background fallback
   • CSS animations         → frozen
   • CSS transitions        → frozen
   • viewport min-heights   → removed (no excess whitespace)
   • CSS mask/mask-image    → removed (prevents blank overlays)
   • body grain overlay     → hidden
   • filter effects         → simplified for capture
   • Controlled width       → 1100px for optimal A4 text size
   • PDF margins            → clean breathing room
   ══════════════════════════════════════════════════════════ */

const A4_W = 210; // mm
const A4_H = 297; // mm
const CAPTURE_W = 1100; // px — optimal for A4 readability
const PDF_MARGIN = 0; // mm — edge-to-edge to preserve template design

export async function captureTemplatePDF(filename: string): Promise<void> {
  /* ── 1. Locate template ──────────────────────────────── */
  const wrapper = document.querySelector<HTMLElement>('[data-pdf-target]');
  if (!wrapper) { alert('Template not found.'); return; }
  // The template lives inside [data-pdf-template]; firstElementChild of the
  // wrapper is the TL;DR bar, NOT the template.
  const holder = wrapper.querySelector<HTMLElement>('[data-pdf-template]');
  const tpl = (holder?.firstElementChild ?? wrapper.firstElementChild) as HTMLElement | null;
  if (!tpl) { alert('Template not found.'); return; }

  /* ── 2. Save scroll & go to top ──────────────────────── */
  const savedScroll = window.scrollY;
  window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  await sleep(200);

  /* ── 3. Style-override tracker (restores in finally) ─── */
  const saved = new Map<HTMLElement, string>();
  const set = (el: HTMLElement, prop: string, val: string) => {
    if (!saved.has(el)) saved.set(el, el.style.cssText);
    el.style.setProperty(prop, val, 'important');
  };
  const hide = (el: HTMLElement) => set(el, 'display', 'none');

  try {
    /* ── 4. Hide body grain texture overlay ──────────── */
    const bodyAfterBlocker = document.createElement('style');
    bodyAfterBlocker.textContent = 'body::after { display: none !important; }';
    document.head.appendChild(bodyAfterBlocker);

    /* ── 5. Hide UI chrome outside template ──────────── */
    qsa(
      '[class*="switcher"],[class*="Switcher"],' +
      '[class*="scrollProgress"],[class*="ScrollProgress"],' +
      '[class*="keyboard"],[class*="Keyboard"],' +
      '[class*="floating"],[class*="Floating"],' +
      '[class*="liveAvail"],[class*="LiveAvail"],' +
      '[class*="visitorPulse"],[class*="VisitorPulse"],' +
      '[class*="analyticsBadge"],[class*="AnalyticsBadge"],' +
      '[class*="easterEgg"],[class*="EasterEgg"],' +
      '[class*="commandPalette"],[class*="CommandPalette"],' +
      '[class*="sectionIndicator"],[class*="SectionIndicator"],' +
      '[class*="mobileBottom"],[class*="MobileBottom"],' +
      '[class*="toast"],[class*="Toast"],' +
      '[class*="introAnim"],[class*="IntroAnim"],' +
      '[class*="focusMode"],[class*="FocusMode"]'
    ).forEach(el => { if (!tpl.contains(el)) hide(el); });

    /* ── 6. Hide footer + interactive elements ─────────
       [data-code-showcase] = whole live-coding IDE section (incl. its
       header) — an animated screen toy that makes no sense on paper. */
    tpl.querySelectorAll<HTMLElement>(
      'footer, [data-pdf-hide], [data-code-showcase]'
    ).forEach(hide);

    /* ── 6b. Collapse the hero column that held the IDE ─
       Hiding the IDE alone leaves an empty grid column; drop the column
       so the hero typography uses the full capture width. */
    tpl.querySelectorAll<HTMLElement>('[data-pdf-collapse]').forEach(el => {
      const item = el.parentElement;
      const grid = item?.parentElement;
      if (item && grid && getComputedStyle(grid).display === 'grid') {
        hide(item);
        set(grid, 'grid-template-columns', '1fr');
      }
    });

    /* ── 7. Remove wrapper padding (switcher offset) ─── */
    const parent = wrapper.parentElement;
    if (parent) set(parent, 'padding-top', '0px');

    /* ── 8. Neutralise framer-motion transforms ──────── */
    set(wrapper, 'transform', 'none');
    set(wrapper, 'filter', 'none');

    /* ── 9. Set controlled capture width ─────────────── */
    set(wrapper, 'width', `${CAPTURE_W}px`);
    set(wrapper, 'max-width', `${CAPTURE_W}px`);
    set(wrapper, 'margin', '0 auto');

    /* ── 10. Freeze animations & transitions ─────────── */
    const allEls = tpl.querySelectorAll<HTMLElement>('*');
    allEls.forEach(el => {
      const cs = getComputedStyle(el);
      if (cs.animationName && cs.animationName !== 'none') {
        set(el, 'animation', 'none');
      }
      if (cs.transition && cs.transition !== 'all 0s ease 0s' && cs.transition !== 'none 0s ease 0s') {
        set(el, 'transition', 'none');
      }
    });

    /* ── 11. Remove viewport-relative min-heights ────── */
    set(tpl, 'min-height', 'auto');
    allEls.forEach(el => {
      const mh = getComputedStyle(el).minHeight;
      if (mh && (mh.includes('vh') || mh.includes('svh') || mh.includes('dvh'))) {
        set(el, 'min-height', 'auto');
      }
    });

    /* ── 12. Fix background-clip:text ────────────────── */
    fixGradientText(tpl, set);

    /* ── 13. Fix backdrop-filter ─────────────────────── */
    fixBackdropFilter(tpl, set);

    /* ── 14. Fix CSS masks (gradient borders etc.) ────── */
    fixCSSMasks(tpl, set);

    /* ── 15. Simplify filter effects for capture ─────── */
    fixFilterEffects(tpl, set);

    /* ── 16. Wait for fonts & images ─────────────────── */
    await Promise.all([
      document.fonts.ready,
      loadAllImages(tpl),
    ]);

    /* ── 17. Resolve background ──────────────────────── */
    const bg = resolveBackground(tpl);

    /* ── 18. Let reflow settle at new width ──────────── */
    await sleep(500);

    /* ── 19. Capture ─────────────────────────────────── */
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

    /* ── 20. Build multi-page A4 PDF with smart breaks ──
       Instead of slicing at fixed A4 heights (which guillotines text and
       photos mid-line), scan a window above each page boundary for the
       cleanest row to cut on. A short smart-cut slice just leaves tidy
       whitespace at the bottom of that page — like a real page break. */
    const usableW = A4_W - PDF_MARGIN * 2;
    const usableH = A4_H - PDF_MARGIN * 2;
    const mmPerPx = usableW / canvas.width;       // horizontal scale (mm per px)
    const pgH = Math.floor(usableH / mmPerPx);    // full-page slice height in px
    const fullCtx = canvas.getContext('2d');
    const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });

    let sy = 0;
    let firstPage = true;
    for (let guard = 0; sy < canvas.height - 2 && guard < 300; guard++) {
      const idealEnd = Math.min(sy + pgH, canvas.height);
      // Only hunt for a clean cut when real content remains below.
      const cutEnd = idealEnd < canvas.height
        ? findSafeCut(fullCtx, canvas.width, sy, idealEnd, pgH)
        : idealEnd;
      const sh = cutEnd - sy;

      if (!firstPage) pdf.addPage();
      firstPage = false;

      // Fill page with background color
      pdf.setFillColor(bg);
      pdf.rect(0, 0, A4_W, A4_H, 'F');

      const pc = document.createElement('canvas');
      pc.width = canvas.width;
      pc.height = sh;
      const ctx = pc.getContext('2d')!;
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, pc.width, pc.height);
      ctx.drawImage(canvas, 0, sy, canvas.width, sh, 0, 0, canvas.width, sh);

      // Keep the horizontal scale — a smart-cut (shorter) slice yields a
      // proportionally shorter image, so the page bottom stays clean.
      const imgH = sh * mmPerPx;
      pdf.addImage(
        pc.toDataURL('image/jpeg', 0.96),
        'JPEG',
        PDF_MARGIN,
        PDF_MARGIN,
        usableW,
        imgH,
      );

      sy = cutEnd;
    }

    pdf.save(filename);

    // Cleanup injected style
    bodyAfterBlocker.remove();
  } finally {
    /* ── 21. Restore every modified element ──────────── */
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

/**
 * Find a clean horizontal row to end a PDF page so we never slice through
 * text or photos. Scans a window above the ideal boundary for the row with
 * the least vertical "ink" energy: text and image edges create large
 * row-to-row luminance jumps, while gaps AND solid fills (e.g. a full-height
 * coloured sidebar) sit near zero — so this is column-agnostic and a solid
 * sidebar never blocks a cut. Enforces a 55% minimum page fill and falls
 * back to the ideal boundary when the canvas can't be read.
 */
function findSafeCut(
  ctx: CanvasRenderingContext2D | null,
  width: number,
  start: number,
  idealEnd: number,
  pgH: number,
): number {
  if (!ctx) return idealEnd;
  const searchWindow = Math.round(pgH * 0.18);
  const minFill = start + Math.round(pgH * 0.55);
  const searchTop = Math.max(minFill, idealEnd - searchWindow);
  if (searchTop >= idealEnd - 1) return idealEnd;

  const yGap = 2;                       // compare rows 2px apart
  const bandTop = searchTop - yGap;
  const bandH = idealEnd - bandTop;

  let data: Uint8ClampedArray;
  try {
    data = ctx.getImageData(0, bandTop, width, bandH).data;
  } catch {
    return idealEnd;                    // tainted canvas — cannot inspect
  }

  const xStep = 4;                      // sample every 4th column for speed
  const rowStride = width * 4;
  let bestRow = idealEnd;
  let bestEnergy = Infinity;
  for (let r = yGap; r < bandH; r++) {
    let energy = 0;
    const rowOff = r * rowStride;
    const prevOff = (r - yGap) * rowStride;
    for (let x = 0; x < width; x += xStep) {
      const i = rowOff + x * 4;
      const p = prevOff + x * 4;
      const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      const lumP = 0.299 * data[p] + 0.587 * data[p + 1] + 0.114 * data[p + 2];
      energy += Math.abs(lum - lumP);
    }
    if (energy < bestEnergy) {
      bestEnergy = energy;
      bestRow = bandTop + r;
    }
  }
  return bestRow;
}

function qsa(sel: string): HTMLElement[] {
  return Array.from(document.querySelectorAll<HTMLElement>(sel));
}

/**
 * Resolve the template's background color for PDF page fills.
 * Falls back through computed backgroundColor → CSS var → black.
 */
function resolveBackground(el: HTMLElement): string {
  const cs = getComputedStyle(el);
  const bg = cs.backgroundColor;
  // If it's a real color (not transparent)
  if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
    return bg;
  }
  // Some templates use CSS gradient backgrounds — extract dominant color
  const bgImage = cs.backgroundImage;
  if (bgImage && bgImage !== 'none') {
    const colorMatch = bgImage.match(/rgb[a]?\([^)]+\)/);
    if (colorMatch) return colorMatch[0];
  }
  return '#000000';
}

/**
 * html2canvas cannot render `-webkit-background-clip: text`.
 * Replace gradient text with template accent color.
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
    const isTransparent = fill === 'transparent' || fill === 'rgba(0, 0, 0, 0)';

    if (!isClipped && !isTransparent) return;

    const accent = resolveAccentColor(root);
    const bgLum = backgroundLightness(el);
    // Use white for large headings on dark bg, accent for smaller text
    const isHeading = el.tagName.match(/^H[1-3]$/);
    const fallback = bgLum < 0.5
      ? (isHeading ? '#f0f0f0' : (accent || '#d0d0d0'))
      : (isHeading ? '#1a1a1a' : (accent || '#333'));

    set(el, '-webkit-text-fill-color', 'unset');
    set(el, '-webkit-background-clip', 'unset');
    set(el, 'background-clip', 'unset');
    set(el, 'background', 'none');
    set(el, 'color', fallback);
  });
}

/**
 * html2canvas ignores `backdrop-filter`. Make backgrounds opaque.
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

    const m = bg.match(/rgba?\(\s*(\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\s*\)/);
    if (!m) return;

    const [, r, g, b, aStr] = m;
    const alpha = aStr !== undefined ? parseFloat(aStr) : 1;
    if (alpha < 0.88) {
      set(el, 'background-color', `rgba(${r}, ${g}, ${b}, 0.94)`);
    }
  });
}

/**
 * CSS mask/mask-image is NOT supported by html2canvas.
 * Remove masks to prevent invisible pseudo-elements
 * (used for gradient border effects in templates like Noir).
 */
function fixCSSMasks(
  root: HTMLElement,
  set: (el: HTMLElement, p: string, v: string) => void,
) {
  root.querySelectorAll<HTMLElement>('*').forEach(el => {
    const cs = getComputedStyle(el);
    const mask = cs.getPropertyValue('-webkit-mask-image') ||
      cs.getPropertyValue('mask-image') ||
      cs.getPropertyValue('-webkit-mask') ||
      cs.getPropertyValue('mask');

    if (mask && mask !== 'none') {
      set(el, '-webkit-mask', 'none');
      set(el, 'mask', 'none');
      set(el, '-webkit-mask-image', 'none');
      set(el, 'mask-image', 'none');
    }
  });
}

/**
 * Simplify complex CSS filter effects that html2canvas
 * may render incorrectly (e.g. heavy blurs, saturate).
 */
function fixFilterEffects(
  root: HTMLElement,
  set: (el: HTMLElement, p: string, v: string) => void,
) {
  root.querySelectorAll<HTMLElement>('*').forEach(el => {
    const cs = getComputedStyle(el);
    const filter = cs.filter;
    if (!filter || filter === 'none') return;
    // Keep simple filters, remove complex ones
    if (filter.includes('blur(') && !filter.includes('blur(0')) {
      const simplified = filter.replace(/blur\([^)]+\)/g, 'blur(0px)');
      set(el, 'filter', simplified);
    }
  });
}

function resolveAccentColor(root: HTMLElement): string | null {
  const cs = getComputedStyle(root);
  return cs.getPropertyValue('--a').trim() ||
    cs.getPropertyValue('--accent').trim() ||
    null;
}

function backgroundLightness(el: HTMLElement): number {
  let cur: HTMLElement | null = el;
  while (cur) {
    const bg = getComputedStyle(cur).backgroundColor;
    const m = bg?.match(/rgba?\(\s*(\d+),\s*(\d+),\s*(\d+)/);
    if (m) {
      const lum = (0.299 * Number(m[1]) + 0.587 * Number(m[2]) + 0.114 * Number(m[3])) / 255;
      if (lum > 0.01) return lum;
    }
    cur = cur.parentElement;
  }
  return 0;
}

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
