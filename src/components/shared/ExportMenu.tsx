'use client';

import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useContent } from '@/context/ContentContext';
import { useTemplate } from '@/context/TemplateContext';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/context/ToastContext';
const DARK = new Set(['noir', 'term', 'neon', 'ember', 'midnight', 'horizon', 'glass', 'aurora', 'retro', 'blueprint', 'cosmic']);

export default function ExportMenu() {
  const [open, setOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const { data } = useContent();
  const { current } = useTemplate();
  const { lang } = useLanguage();
  const { toast } = useToast();
  const isDark = DARK.has(current);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onClick); document.removeEventListener('keydown', onKey); };
  }, [open]);

  const filename = `${data.name}_${data.last}`;

  const exportPDF = async () => {
    setExporting(true);
    setOpen(false);
    try {
      const { captureTemplatePDF } = await import('@/utils/captureTemplatePDF');
      await captureTemplatePDF(`${filename}_${current}_Resume.pdf`);
      toast('PDF downloaded successfully', 'success');
    } finally {
      setExporting(false);
    }
  };

  const exportMarkdown = () => {
    const md = [
      `# ${data.name} ${data.last}`,
      `**${data.title}**\n`,
      `> ${data.tagline}\n`,
      `${data.desc}\n`,
      `## Contact`,
      `- Email: ${data.email}`,
      `- Phone: ${data.phone}`,
      `- GitHub: ${data.github}`,
      `- LinkedIn: ${data.linkedin}`,
      `- Location: ${data.loc}\n`,
      `## Skills`,
      ...data.skills.map(s => `### ${s.t}\n${s.tags.join(', ')}\n`),
      `## Experience`,
      ...data.exp.map(e => `### ${e.t} @ ${e.co}\n*${e.dt}*\n\n${e.d}\n\n${e.a.map(a => `- ${a.replace(/\*\*/g, '**')}`).join('\n')}\n\nTech: ${e.tech.join(', ')}\n`),
      `## Projects`,
      ...data.projects.map(p => `### [${p.title}](${p.url})\n${p.desc}\n\nTech: ${p.tech.join(', ')}\n`),
      `## Education`,
      ...data.education.map(e => `### ${e.degree}\n${e.school} | ${e.date}${e.desc ? `\n${e.desc}` : ''}\n`),
    ].join('\n');

    downloadText(md, `${filename}_Resume.md`, 'text/markdown');
    toast('Markdown exported', 'success');
    setOpen(false);
  };

  const exportJSON = () => {
    const json = JSON.stringify(data, null, 2);
    downloadText(json, `${filename}_Portfolio.json`, 'application/json');
    toast('JSON exported', 'success');
    setOpen(false);
  };

  const copyLink = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('t', current);
    navigator.clipboard.writeText(url.toString());
    toast(lang === 'en' ? 'Link copied with current template!' : 'Enlace copiado con plantilla actual!', 'success');
    setOpen(false);
  };

  const formats = [
    { id: 'pdf', label: 'PDF Resume', desc: 'Visual template capture', icon: '📄', action: exportPDF },
    { id: 'md', label: 'Markdown', desc: 'GitHub README format', icon: '📝', action: exportMarkdown },
    { id: 'json', label: 'JSON Data', desc: 'Portable content data', icon: '💾', action: exportJSON },
    { id: 'link', label: 'Share Link', desc: 'URL with current template', icon: '🔗', action: copyLink },
  ];

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-flex' }}>
      <button
        onClick={() => setOpen(o => !o)}
        disabled={exporting}
        type="button"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '10px 22px', borderRadius: 50,
          background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
          color: isDark ? '#f0f0f0' : '#1a1a1a',
          fontSize: '0.85rem', fontWeight: 500,
          cursor: exporting ? 'wait' : 'pointer',
          transition: 'all 0.2s',
        }}
      >
        {exporting ? (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" style={{ animation: 'spin 1s linear infinite' }}>
              <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="50 20" />
            </svg>
            Exporting...
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            {lang === 'en' ? 'Export' : 'Exportar'}
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)',
              marginBottom: 8,
              background: isDark ? '#1a1a2e' : '#fff',
              borderRadius: 18, padding: 8,
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
              boxShadow: isDark ? '0 16px 48px rgba(0,0,0,0.5)' : '0 16px 48px rgba(0,0,0,0.12)',
              minWidth: 220, zIndex: 200,
            }}
          >
            {formats.map(f => (
              <button
                key={f.id}
                onClick={f.action}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  width: '100%', padding: '10px 14px', borderRadius: 12,
                  border: 'none', background: 'transparent',
                  cursor: 'pointer', textAlign: 'left',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <span style={{ fontSize: '1.1rem' }}>{f.icon}</span>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: isDark ? '#f0f0f0' : '#1a1a1a' }}>{f.label}</div>
                  <div style={{ fontSize: '0.72rem', color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }}>{f.desc}</div>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function downloadText(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
