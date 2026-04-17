import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/* ══════════════════════════════════════════════════════════
   Beautiful template-to-PDF capture — v2
   ──────────────────────────────────────────────────────────
   Handles all 18 templates with consistent high-quality output.

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
  const tpl = wrapper.firstElementChild as HTMLElement | null;
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

    /* ── 6. Hide footer + interactive elements ───────── */
    tpl.querySelectorAll<HTMLElement>(
      'footer, [data-pdf-hide]'
    ).forEach(hide);

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

    /* ── 20. Build multi-page A4 PDF ─────────────────── */
    const usableW = A4_W - PDF_MARGIN * 2;
    const usableH = A4_H - PDF_MARGIN * 2;
    const pxPerMm = canvas.width / usableW;
    const pgH = Math.floor(usableH * pxPerMm);
    const pages = Math.ceil(canvas.height / pgH);
    const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });

    for (let i = 0; i < pages; i++) {
      if (i > 0) pdf.addPage();

      // Fill page with background color
      pdf.setFillColor(bg);
      pdf.rect(0, 0, A4_W, A4_H, 'F');

      const sy = i * pgH;
      const sh = Math.min(pgH, canvas.height - sy);

      const pc = document.createElement('canvas');
      pc.width = canvas.width;
      pc.height = pgH;

      const ctx = pc.getContext('2d')!;
      // Fill with bg for last page (may be shorter)
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, pc.width, pc.height);
      ctx.drawImage(canvas, 0, sy, canvas.width, sh, 0, 0, canvas.width, sh);

      pdf.addImage(
        pc.toDataURL('image/jpeg', 0.95),
        'JPEG',
        PDF_MARGIN,
        PDF_MARGIN,
        usableW,
        usableH,
      );
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
