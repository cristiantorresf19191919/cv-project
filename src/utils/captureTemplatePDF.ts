import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/* ══════════════════════════════════════════════════════
   Pixel-perfect template-to-PDF capture
   ──────────────────────────────────────────────────────
   1. Finds the template via [data-pdf-target]
   2. Hides UI chrome & footer
   3. Forces static styles (no transforms/filters)
   4. Captures at 2x with html2canvas
   5. Slices into A4 pages (each page gets its own
      canvas crop — no clipping artefacts)
   6. Restores everything
   ══════════════════════════════════════════════════════ */

const A4_W_MM = 210;
const A4_H_MM = 297;

export async function captureTemplatePDF(filename: string): Promise<void> {
  // ── 1. Find target ─────────────────────────────────
  const wrapper = document.querySelector<HTMLElement>('[data-pdf-target]');
  if (!wrapper) {
    alert('Template not found.');
    return;
  }

  // The actual .template div is the first child of the motion wrapper
  const templateEl = wrapper.firstElementChild as HTMLElement | null;
  if (!templateEl) {
    alert('Template not found.');
    return;
  }

  // ── 2. Save scroll position & scroll to top ────────
  const prevScrollY = window.scrollY;
  window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });

  // Small delay to let the browser settle after scroll
  await new Promise((r) => setTimeout(r, 100));

  // ── 3. Hide UI chrome ──────────────────────────────
  const restoreFns: (() => void)[] = [];

  function hideEl(el: HTMLElement) {
    const prev = el.style.display;
    el.style.display = 'none';
    restoreFns.push(() => { el.style.display = prev; });
  }

  // Hide switcher bar, scroll progress, keyboard nav
  document.querySelectorAll<HTMLElement>(
    '[class*="switcher"], [class*="Switcher"], [class*="scrollProgress"], [class*="ScrollProgress"], [class*="keyboard"], [class*="Keyboard"]'
  ).forEach((el) => {
    if (!templateEl.contains(el)) hideEl(el);
  });

  // Hide footer inside template
  const footer = templateEl.querySelector<HTMLElement>('footer');
  if (footer) hideEl(footer);

  // Remove parent padding (the 58px top padding for the switcher bar)
  const parentDiv = wrapper.parentElement;
  if (parentDiv) {
    const prevPad = parentDiv.style.paddingTop;
    parentDiv.style.paddingTop = '0';
    restoreFns.push(() => { parentDiv.style.paddingTop = prevPad; });
  }

  // Neutralise framer-motion transforms on the wrapper
  const prevTransform = wrapper.style.transform;
  const prevFilter = wrapper.style.filter;
  wrapper.style.transform = 'none';
  wrapper.style.filter = 'none';
  restoreFns.push(() => {
    wrapper.style.transform = prevTransform;
    wrapper.style.filter = prevFilter;
  });

  // ── 4. Resolve background color ────────────────────
  // html2canvas sometimes misses CSS gradients, so we
  // compute the dominant bg and pass it as fallback
  const computed = getComputedStyle(templateEl);
  const bgColor = computed.backgroundColor || '#000000';

  // ── 5. Capture ─────────────────────────────────────
  try {
    await new Promise((r) => setTimeout(r, 200)); // let reflow settle

    const canvas = await html2canvas(templateEl, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: bgColor,
      logging: false,
      imageTimeout: 15000,
      // Capture the full scroll area of the template
      width: templateEl.offsetWidth,
      height: templateEl.scrollHeight,
      scrollX: 0,
      scrollY: 0,
    });

    // ── 6. Build multi-page PDF by slicing canvas ──────
    const pxPerMm = canvas.width / A4_W_MM;
    const pageHeightPx = Math.floor(A4_H_MM * pxPerMm);
    const totalPages = Math.ceil(canvas.height / pageHeightPx);

    const pdf = new jsPDF('p', 'mm', 'a4');

    for (let page = 0; page < totalPages; page++) {
      if (page > 0) pdf.addPage();

      // Crop this page's slice from the full canvas
      const sliceY = page * pageHeightPx;
      const sliceH = Math.min(pageHeightPx, canvas.height - sliceY);

      const pageCanvas = document.createElement('canvas');
      pageCanvas.width = canvas.width;
      pageCanvas.height = pageHeightPx; // always full page height

      const ctx = pageCanvas.getContext('2d');
      if (!ctx) continue;

      // Fill background for the last page (may be shorter)
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);

      // Draw the slice
      ctx.drawImage(
        canvas,
        0, sliceY, canvas.width, sliceH,   // source rect
        0, 0, canvas.width, sliceH,         // dest rect
      );

      const pageData = pageCanvas.toDataURL('image/jpeg', 0.92);
      pdf.addImage(pageData, 'JPEG', 0, 0, A4_W_MM, A4_H_MM);
    }

    pdf.save(filename);
  } finally {
    // ── 7. Restore everything ────────────────────────
    for (const fn of restoreFns) fn();
    window.scrollTo({ top: prevScrollY, behavior: 'instant' as ScrollBehavior });
  }
}
