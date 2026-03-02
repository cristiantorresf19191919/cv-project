import { jsPDF } from 'jspdf';
import type { PortfolioData } from '@/types/content';
import type { Translations } from '@/data/translations';

/* ══════════════════════════════════════════════════════
   Harvard-style CV PDF Generator
   Matches the "Plantilla CV - Harvard" format exactly:
   - Centered name with underline
   - Contact row with bullet separators
   - Yellow summary box (italic)
   - Bold section headers with horizontal rules
   - Experience: company/location + title/dates rows
   - Bullet achievements
   - Education & skills sections
   ══════════════════════════════════════════════════════ */

// Page constants (US Letter in mm)
const PW = 215.9;   // page width
const PH = 279.4;   // page height
const ML = 25.4;    // left margin  (~1 inch)
const MR = 25.4;    // right margin
const MT = 22;      // top margin
const MB = 22;      // bottom margin
const CW = PW - ML - MR; // content width

// Colors
const BLACK: [number, number, number] = [0, 0, 0];
const MUTED: [number, number, number] = [80, 80, 80];
const SUMMARY_BG: [number, number, number] = [255, 248, 220]; // light yellow

function stripBold(text: string): string {
  return text.replace(/\*\*(.*?)\*\*/g, '$1');
}

export function generateResumePDF(data: PortfolioData, t: Translations): void {
  const doc = new jsPDF({ unit: 'mm', format: 'letter' });
  let y = MT;

  // ── Helpers ──────────────────────────────────────────

  function checkPage(needed: number) {
    if (y + needed > PH - MB) {
      doc.addPage();
      y = MT;
    }
  }

  function drawHR(yPos: number, weight = 0.4) {
    doc.setDrawColor(...BLACK);
    doc.setLineWidth(weight);
    doc.line(ML, yPos, PW - MR, yPos);
  }

  function centerText(text: string, fontSize: number, style: string, yPos: number) {
    doc.setFontSize(fontSize);
    doc.setFont('times', style);
    doc.setTextColor(...BLACK);
    doc.text(text, PW / 2, yPos, { align: 'center' });
  }

  function leftText(text: string, fontSize: number, style: string, yPos: number, color = BLACK) {
    doc.setFontSize(fontSize);
    doc.setFont('times', style);
    doc.setTextColor(...color);
    doc.text(text, ML, yPos);
  }

  function rightText(text: string, fontSize: number, style: string, yPos: number, color = BLACK) {
    doc.setFontSize(fontSize);
    doc.setFont('times', style);
    doc.setTextColor(...color);
    doc.text(text, PW - MR, yPos, { align: 'right' });
  }

  /** Wraps text to fit within maxWidth, returns array of lines */
  function wrapText(text: string, fontSize: number, style: string, maxWidth: number): string[] {
    doc.setFontSize(fontSize);
    doc.setFont('times', style);
    return doc.splitTextToSize(text, maxWidth);
  }

  /** Draw bullet item with word wrapping */
  function drawBullet(text: string, fontSize: number, bulletIndent: number, textIndent: number, maxWidth: number): number {
    const clean = stripBold(text);
    const lines = wrapText(clean, fontSize, 'normal', maxWidth - (textIndent - ML));
    checkPage(lines.length * (fontSize * 0.45) + 2);

    // Draw bullet
    doc.setFontSize(fontSize);
    doc.setFont('times', 'normal');
    doc.setTextColor(...BLACK);
    doc.text('\u2022', bulletIndent, y);

    // Draw wrapped text
    for (let i = 0; i < lines.length; i++) {
      doc.text(lines[i], textIndent, y);
      if (i < lines.length - 1) y += fontSize * 0.45;
    }
    y += fontSize * 0.5;
    return y;
  }

  // ── 1. NAME ──────────────────────────────────────────
  const fullName = `${data.name} ${data.last}`;
  centerText(fullName, 24, 'bold', y + 8);

  // Underline the name
  doc.setFontSize(24);
  doc.setFont('times', 'bold');
  const nameWidth = doc.getTextWidth(fullName);
  const nameX = (PW - nameWidth) / 2;
  const nameEndX = nameX + nameWidth;
  const underlineY = y + 9.5;
  doc.setDrawColor(...BLACK);
  doc.setLineWidth(0.5);
  doc.line(nameX, underlineY, nameEndX, underlineY);
  y += 15;

  // ── 2. CONTACT ROW ──────────────────────────────────
  const contactParts: string[] = [];
  if (data.loc) contactParts.push(data.loc);
  if (data.linkedin) contactParts.push(data.linkedin);
  if (data.phone) contactParts.push(data.phone);
  if (data.email) contactParts.push(data.email);
  const contactLine = contactParts.join(' \u2022 ');

  doc.setFontSize(10);
  doc.setFont('times', 'normal');
  doc.setTextColor(...BLACK);
  doc.text(contactLine, PW / 2, y, { align: 'center' });
  y += 6;

  // ── 3. SUMMARY (yellow box, italic) ─────────────────
  const summaryText = data.desc;
  const summaryLines = wrapText(summaryText, 10, 'italic', CW - 6);
  const summaryLineH = 4.2;
  const summaryH = summaryLines.length * summaryLineH + 5;

  checkPage(summaryH + 4);

  // Yellow background
  doc.setFillColor(...SUMMARY_BG);
  doc.rect(ML, y - 1, CW, summaryH, 'F');

  // Italic text inside
  doc.setFontSize(10);
  doc.setFont('times', 'italic');
  doc.setTextColor(...BLACK);
  let sy = y + 3;
  for (const line of summaryLines) {
    doc.text(line, ML + 3, sy);
    sy += summaryLineH;
  }
  y += summaryH + 4;

  // ── 4. EXPERIENCIA PROFESIONAL ──────────────────────
  const expHeader = t.experience.toUpperCase();
  checkPage(20);
  leftText(expHeader, 12, 'bold', y);
  drawHR(y + 1.5, 0.5);
  y += 7;

  for (const exp of data.exp) {
    checkPage(25);

    // Row 1: Company (bold left) | Location (bold right)
    leftText(exp.co, 10, 'bold', y);
    rightText(data.loc, 10, 'bold', y);
    y += 4.5;

    // Row 2: Title (normal left) | Dates (italic right)
    leftText(exp.t, 10, 'normal', y);
    rightText(exp.dt, 10, 'italic', y);
    y += 5.5;

    // Bullet achievements
    const bulletIndent = ML + 5;
    const textIndent = ML + 10;

    for (const achievement of exp.a) {
      drawBullet(achievement, 10, bulletIndent, textIndent, PW - MR);
    }

    y += 2; // spacing between jobs
  }

  // ── 5. EDUCACIÓN ────────────────────────────────────
  const eduHeader = t.education.toUpperCase();
  checkPage(20);
  leftText(eduHeader, 12, 'bold', y);
  drawHR(y + 1.5, 0.5);
  y += 7;

  for (const edu of data.education) {
    checkPage(15);

    // Row 1: School (bold left) | Location (bold right)
    leftText(edu.school.toUpperCase(), 10, 'bold', y);
    rightText(data.loc, 10, 'bold', y);
    y += 4.5;

    // Row 2: Degree (normal left) | Date (italic right)
    leftText(edu.degree, 10, 'normal', y);
    rightText(edu.date, 10, 'italic', y);
    y += 4.5;

    // Optional description
    if (edu.desc) {
      const descLines = wrapText(edu.desc, 10, 'normal', CW);
      for (const line of descLines) {
        leftText(line, 10, 'normal', y);
        y += 4.2;
      }
    }

    y += 3;
  }

  // ── 6. SKILLS ADICIONALES ───────────────────────────
  const skillsHeader = t.skills.toUpperCase();
  checkPage(20);
  leftText(skillsHeader, 12, 'bold', y);
  drawHR(y + 1.5, 0.5);
  y += 7;

  const bulletIndent = ML + 5;
  const textIndent = ML + 10;

  // Flatten all skill tags into readable bullets
  for (const skill of data.skills) {
    const line = `${skill.t}: ${skill.tags.join(', ')}`;
    drawBullet(line, 10, bulletIndent, textIndent, PW - MR);
  }

  // ── 7. PROJECTS (if any) ────────────────────────────
  if (data.projects.length > 0) {
    y += 2;
    const projHeader = t.projects.toUpperCase();
    checkPage(20);
    leftText(projHeader, 12, 'bold', y);
    drawHR(y + 1.5, 0.5);
    y += 7;

    for (const proj of data.projects) {
      checkPage(15);
      leftText(proj.title, 10, 'bold', y);
      y += 4.5;

      const projLines = wrapText(proj.desc, 10, 'normal', CW);
      for (const line of projLines) {
        leftText(line, 10, 'normal', y);
        y += 4.2;
      }

      // Tech tags
      const techLine = proj.tech.join(', ');
      leftText(techLine, 9, 'italic', y, MUTED);
      y += 6;
    }
  }

  // ── Save ────────────────────────────────────────────
  const filename = `${data.name}_${data.last}_Resume.pdf`;
  doc.save(filename);
}
