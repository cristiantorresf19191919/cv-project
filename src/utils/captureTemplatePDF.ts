import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Captures the currently visible template as a pixel-perfect PDF.
 * Hides UI chrome (switcher, nav, footer) during capture,
 * then splits the long screenshot into A4 pages.
 */
export async function captureTemplatePDF(filename: string): Promise<void> {
  // ── 1. Find the template container ───────────────────
  const templateEl =
    document.querySelector<HTMLElement>('[class*="template"]');

  if (!templateEl) {
    alert('Could not find template to export.');
    return;
  }

  // ── 2. Collect UI elements to hide during capture ────
  const hideSelectors = [
    '[class*="switcher"]',       // TemplateSwitcher bar
    '[class*="Switcher"]',
    '[class*="keyboard"]',       // KeyboardNav
    '[class*="Keyboard"]',
    '[class*="scrollProgress"]', // ScrollProgress bar
    '[class*="ScrollProgress"]',
    '[class*="footer"]',         // Footer component
    '[class*="Footer"]',
  ];

  const hidden: { el: HTMLElement; prev: string }[] = [];

  for (const sel of hideSelectors) {
    document.querySelectorAll<HTMLElement>(sel).forEach((el) => {
      // Don't hide elements inside the template itself (like footer text)
      // Only hide top-level chrome
      if (!templateEl.contains(el) || el.tagName === 'FOOTER') {
        hidden.push({ el, prev: el.style.display });
        el.style.display = 'none';
      }
    });
  }

  // Also hide the footer inside the template
  const footerInTemplate = templateEl.querySelector<HTMLElement>('footer');
  if (footerInTemplate) {
    hidden.push({ el: footerInTemplate, prev: footerInTemplate.style.display });
    footerInTemplate.style.display = 'none';
  }

  // Remove top padding from parent container during capture
  const parentContainer = templateEl.parentElement;
  let prevPadding = '';
  if (parentContainer) {
    prevPadding = parentContainer.style.paddingTop;
    parentContainer.style.paddingTop = '0';
  }

  // ── 3. Capture with html2canvas ──────────────────────
  try {
    const canvas = await html2canvas(templateEl, {
      scale: 2,                    // 2x for crisp text
      useCORS: true,               // allow cross-origin images
      allowTaint: true,
      backgroundColor: null,       // preserve template bg
      logging: false,
      windowWidth: templateEl.scrollWidth,
      windowHeight: templateEl.scrollHeight,
    });

    // ── 4. Split into A4 pages ───────────────────────────
    const imgWidth = 210;          // A4 width in mm
    const pageHeight = 297;        // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    const pdf = new jsPDF('p', 'mm', 'a4');
    let position = 0;
    let remainingHeight = imgHeight;
    const imgData = canvas.toDataURL('image/jpeg', 0.92);

    // First page
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    remainingHeight -= pageHeight;

    // Additional pages if content overflows
    while (remainingHeight > 0) {
      position -= pageHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      remainingHeight -= pageHeight;
    }

    pdf.save(filename);
  } finally {
    // ── 5. Restore hidden elements ─────────────────────
    for (const { el, prev } of hidden) {
      el.style.display = prev;
    }
    if (parentContainer) {
      parentContainer.style.paddingTop = prevPadding;
    }
  }
}
