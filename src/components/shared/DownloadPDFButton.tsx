'use client';

import { useState } from 'react';
import { useContent } from '@/context/ContentContext';
import { useTemplate } from '@/context/TemplateContext';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/context/ToastContext';
import { THEMES } from '@/data/themes';

/**
 * Handy header button that exports the current template as a PDF that keeps
 * the template's design vibe. Themed with the active accent so it reads as a
 * primary action on every template.
 */
export default function DownloadPDFButton() {
  const [exporting, setExporting] = useState(false);
  const { data } = useContent();
  const { current } = useTemplate();
  const { lang } = useLanguage();
  const { toast } = useToast();
  const accent = THEMES[current].accent;

  const onExport = async () => {
    if (exporting) return;
    setExporting(true);
    try {
      const { captureTemplatePDF } = await import('@/utils/captureTemplatePDF');
      await captureTemplatePDF(`${data.name}_${data.last}_${current}_Resume.pdf`);
      toast(lang === 'en' ? 'PDF downloaded' : 'PDF descargado', 'success');
    } catch {
      toast(lang === 'en' ? 'Export failed — try again' : 'Error al exportar', 'error');
    } finally {
      setExporting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={onExport}
      disabled={exporting}
      title={lang === 'en' ? 'Download this design as PDF' : 'Descargar este diseño en PDF'}
      aria-label={lang === 'en' ? 'Download PDF' : 'Descargar PDF'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        padding: '5px 13px 5px 11px',
        borderRadius: 999,
        border: `1px solid ${accent}`,
        background: accent,
        color: pickText(accent),
        fontSize: '0.72rem',
        fontWeight: 700,
        letterSpacing: '0.3px',
        cursor: exporting ? 'wait' : 'pointer',
        opacity: exporting ? 0.75 : 1,
        boxShadow: `0 4px 14px ${accent}44`,
        transition: 'transform 0.18s ease, box-shadow 0.18s ease, opacity 0.18s',
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={(e) => {
        if (exporting) return;
        e.currentTarget.style.transform = 'translateY(-1px)';
        e.currentTarget.style.boxShadow = `0 6px 20px ${accent}66`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = `0 4px 14px ${accent}44`;
      }}
    >
      {exporting ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 0.8s linear infinite' }} aria-hidden>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2.5" />
          <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M12 3v11m0 0 4-4m-4 4-4-4" />
          <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
        </svg>
      )}
      {exporting ? (lang === 'en' ? 'Exporting…' : 'Exportando…') : 'PDF'}
    </button>
  );
}

/** Black or white label depending on accent luminance (WCAG-ish). */
function pickText(hex: string): string {
  const m = hex.trim().match(/^#?([0-9a-f]{6})$/i);
  if (!m) return '#ffffff';
  const n = parseInt(m[1], 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.62 ? '#0a0a0a' : '#ffffff';
}
