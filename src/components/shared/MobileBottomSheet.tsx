'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTemplate } from '@/context/TemplateContext';
import { useLanguage } from '@/context/LanguageContext';
import { THEMES, TEMPLATE_LIST } from '@/data/themes';
import { TemplateName, TemplateCategory } from '@/types/templates';

const CAT_LABELS: Record<TemplateCategory, string> = { dark: 'Dark', light: 'Light', special: 'Featured' };

export default function MobileBottomSheet() {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { current, switchTemplate } = useTemplate();
  const { lang, toggleLang } = useLanguage();
  const accent = THEMES[current].accent;

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  if (!isMobile) return null;

  const select = (name: TemplateName) => {
    switchTemplate(name);
    setOpen(false);
  };

  const grouped = TEMPLATE_LIST.reduce((acc, t) => {
    (acc[t.category] = acc[t.category] || []).push(t);
    return acc;
  }, {} as Record<string, typeof TEMPLATE_LIST>);

  return (
    <>
      {/* Trigger button - bottom right on mobile */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open template menu"
        style={{
          position: 'fixed', bottom: 20, right: 20, zIndex: 100,
          width: 52, height: 52, borderRadius: 16,
          background: accent, border: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: `0 6px 24px ${accent}40`,
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
      </button>

      {/* Bottom sheet */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              style={{ position: 'fixed', inset: 0, zIndex: 9998, background: 'rgba(0,0,0,0.5)' }}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 35 }}
              style={{
                position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999,
                background: '#1a1a2e',
                borderRadius: '24px 24px 0 0',
                maxHeight: '80vh',
                overflow: 'auto',
                paddingBottom: 'env(safe-area-inset-bottom, 20px)',
              }}
            >
              {/* Handle */}
              <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 8px' }}>
                <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.2)' }} />
              </div>

              <div style={{ padding: '0 20px 20px' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f0f0f0', margin: 0 }}>Templates</h3>
                  <button
                    onClick={toggleLang}
                    style={{
                      padding: '6px 14px', borderRadius: 20, border: `1px solid ${accent}40`,
                      background: 'transparent', color: accent, fontSize: '0.78rem', fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {lang === 'en' ? 'ES' : 'EN'}
                  </button>
                </div>

                {/* Template grid by category */}
                {(['dark', 'light', 'special'] as const).map(cat => {
                  const items = grouped[cat];
                  if (!items?.length) return null;
                  return (
                    <div key={cat} style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.3)', marginBottom: 10 }}>
                        {CAT_LABELS[cat]}
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                        {items.map(t => {
                          const isActive = t.name === current;
                          return (
                            <button
                              key={t.name}
                              onClick={() => select(t.name as TemplateName)}
                              style={{
                                padding: '12px 8px', borderRadius: 14, border: 'none',
                                background: isActive ? `${t.dotColor}20` : 'rgba(255,255,255,0.04)',
                                cursor: 'pointer',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                                outline: isActive ? `2px solid ${t.dotColor}` : 'none',
                                outlineOffset: -2,
                              }}
                            >
                              <div style={{
                                width: 28, height: 28, borderRadius: 8,
                                background: `linear-gradient(135deg, ${t.dotColor}, ${t.dotColor}88)`,
                              }} />
                              <span style={{ fontSize: '0.68rem', fontWeight: 500, color: isActive ? t.dotColor : 'rgba(255,255,255,0.5)', textAlign: 'center', lineHeight: 1.3 }}>
                                {t.label.split(' ')[0]}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
