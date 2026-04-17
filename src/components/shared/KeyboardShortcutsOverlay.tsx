'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTemplate } from '@/context/TemplateContext';
import { THEMES } from '@/data/themes';

const SHORTCUTS = [
  { keys: ['1', '–', '0', '-', '='], desc: 'Switch templates 1-12' },
  { keys: ['A', 'P', 'R', 'B', 'U', 'C'], desc: 'Aurora, Paper, Retro, Blueprint, Brutal, Cosmic' },
  { keys: ['L'], desc: 'Toggle language (EN/ES)' },
  { keys: ['Cmd', 'K'], desc: 'Open command palette', join: '+' },
  { keys: ['?'], desc: 'Show this help' },
  { keys: ['Esc'], desc: 'Close any overlay' },
];

export default function KeyboardShortcutsOverlay() {
  const [open, setOpen] = useState(false);
  const { current } = useTemplate();
  const accent = THEMES[current].accent;

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === '?' && !e.metaKey && !e.ctrlKey && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        setOpen(o => !o);
      }
      if (e.key === 'Escape' && open) setOpen(false);
    }
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
            position: 'fixed', inset: 0, zIndex: 10001,
            background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            onClick={e => e.stopPropagation()}
            style={{
              background: '#1a1a2e',
              borderRadius: 24,
              padding: '2.5rem',
              maxWidth: 520,
              width: '90%',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#f0f0f0', margin: 0 }}>
                Keyboard Shortcuts
              </h2>
              <button
                onClick={() => setOpen(false)}
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '1.5rem', lineHeight: 1 }}
              >
                &times;
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {SHORTCUTS.map((s, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                    {s.keys.map((k, j) => (
                      <span key={j}>
                        {j > 0 && s.join && <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', margin: '0 2px' }}>{s.join}</span>}
                        <span style={{
                          display: 'inline-block', padding: '4px 10px', borderRadius: 8,
                          background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
                          fontSize: '0.78rem', fontWeight: 600, color: accent,
                          fontFamily: 'var(--font-space-mono), monospace',
                          minWidth: 28, textAlign: 'center',
                        }}>
                          {k}
                        </span>
                      </span>
                    ))}
                  </div>
                  <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
                    {s.desc}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)' }}>
              Press <span style={{ color: accent }}>?</span> or <span style={{ color: accent }}>Esc</span> to close
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
