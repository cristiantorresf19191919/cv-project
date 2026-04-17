'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTemplate } from '@/context/TemplateContext';
import { THEMES } from '@/data/themes';

const PRESETS = [
  '#d4af37', '#6366f1', '#00ff41', '#ff0080', '#2563eb',
  '#f97316', '#06b6d4', '#5a7c59', '#e07c5a', '#c084fc',
  '#ef4444', '#22d3a7', '#ff6ec7', '#4fc3f7', '#b45309',
  '#ec4899', '#14b8a6', '#f59e0b',
];

export default function ColorCustomizer() {
  const [open, setOpen] = useState(false);
  const { current } = useTemplate();
  const defaultAccent = THEMES[current].accent;
  const [customColor, setCustomColor] = useState<string | null>(null);

  const applyColor = (color: string) => {
    const tpl = document.querySelector('[data-pdf-target]')?.firstElementChild as HTMLElement;
    if (!tpl) return;
    tpl.style.setProperty('--a', color);
    tpl.style.setProperty('--accent', color);
    tpl.style.setProperty('--al', color + '99');
    setCustomColor(color);
  };

  const reset = () => {
    const tpl = document.querySelector('[data-pdf-target]')?.firstElementChild as HTMLElement;
    if (!tpl) return;
    tpl.style.removeProperty('--a');
    tpl.style.removeProperty('--accent');
    tpl.style.removeProperty('--al');
    setCustomColor(null);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-flex' }}>
      <button
        onClick={() => setOpen(o => !o)}
        title="Customize accent color"
        aria-label="Customize accent color"
        style={{
          width: 28, height: 28, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.15)',
          background: `conic-gradient(from 0deg, #ef4444, #f59e0b, #22c55e, #3b82f6, #a855f7, #ef4444)`,
          cursor: 'pointer', transition: 'all 0.2s',
        }}
      />

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute', top: '100%', right: 0, marginTop: 12,
              background: '#1a1a2e', borderRadius: 18, padding: 16,
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
              width: 220, zIndex: 200,
            }}
          >
            <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: 1, textTransform: 'uppercase' as const, marginBottom: 12 }}>
              Accent Color
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8, marginBottom: 12 }}>
              {PRESETS.map(c => (
                <button
                  key={c}
                  onClick={() => applyColor(c)}
                  style={{
                    width: 28, height: 28, borderRadius: 8, border: 'none',
                    background: c, cursor: 'pointer',
                    outline: (customColor || defaultAccent) === c ? '2px solid #fff' : 'none',
                    outlineOffset: 2, transition: 'transform 0.15s',
                  }}
                  aria-label={`Color ${c}`}
                />
              ))}
            </div>

            {/* Custom color input */}
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
              <input
                type="color"
                value={customColor || defaultAccent}
                onChange={e => applyColor(e.target.value)}
                style={{ width: 32, height: 32, border: 'none', borderRadius: 8, cursor: 'pointer', background: 'none' }}
              />
              <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-space-mono), monospace' }}>
                {customColor || defaultAccent}
              </span>
            </div>

            {customColor && (
              <button
                onClick={reset}
                style={{
                  width: '100%', padding: '8px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)',
                  background: 'transparent', color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem',
                  cursor: 'pointer',
                }}
              >
                Reset to Default
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
