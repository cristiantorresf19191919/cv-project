'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTemplate } from '@/context/TemplateContext';
import { THEMES, TEMPLATE_LIST } from '@/data/themes';
import { TemplateName } from '@/types/templates';

export default function TemplateCompare() {
  const [open, setOpen] = useState(false);
  const { current, switchTemplate } = useTemplate();

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener('open-template-compare', handler);
    return () => window.removeEventListener('open-template-compare', handler);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 10004,
            background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: 20,
          }}
        >
          <motion.div
            initial={{ scale: 0.92, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.92, y: 20 }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            onClick={e => e.stopPropagation()}
            style={{
              background: '#12121f',
              borderRadius: 28,
              padding: '2rem',
              maxWidth: 800,
              width: '100%',
              maxHeight: '85vh',
              overflow: 'auto',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f0f0f0', margin: 0 }}>
                Compare Templates
              </h2>
              <button
                onClick={() => setOpen(false)}
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '1.5rem' }}
              >
                &times;
              </button>
            </div>

            {/* Template grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
              {TEMPLATE_LIST.map(t => {
                const theme = THEMES[t.name as TemplateName];
                const isActive = t.name === current;
                return (
                  <button
                    key={t.name}
                    onClick={() => { switchTemplate(t.name as TemplateName); setOpen(false); }}
                    style={{
                      padding: 16, borderRadius: 16, border: 'none',
                      background: isActive ? `${t.dotColor}15` : 'rgba(255,255,255,0.03)',
                      cursor: 'pointer',
                      outline: isActive ? `2px solid ${t.dotColor}` : 'none',
                      outlineOffset: -2, textAlign: 'left',
                      transition: 'all 0.2s',
                    }}
                  >
                    {/* Color preview bar */}
                    <div style={{
                      height: 40, borderRadius: 10, marginBottom: 12,
                      background: typeof theme.bg === 'string' && theme.bg.startsWith('linear') ? theme.bg : theme.bg,
                      position: 'relative', overflow: 'hidden',
                    }}>
                      <div style={{
                        position: 'absolute', bottom: 4, right: 4,
                        width: 12, height: 12, borderRadius: 4,
                        background: theme.accent,
                      }} />
                    </div>

                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f0f0f0', marginBottom: 4 }}>
                      {t.label}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)' }}>
                      {t.desc}
                    </div>
                    <div style={{
                      display: 'inline-block', marginTop: 8, padding: '3px 8px', borderRadius: 6,
                      background: 'rgba(255,255,255,0.06)', fontSize: '0.62rem',
                      color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' as const, fontWeight: 600,
                      letterSpacing: 0.5,
                    }}>
                      {t.category}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
