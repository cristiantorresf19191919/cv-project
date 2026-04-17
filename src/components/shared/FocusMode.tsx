'use client';

import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTemplate } from '@/context/TemplateContext';
import { THEMES } from '@/data/themes';

export default function FocusMode() {
  const [focused, setFocused] = useState<HTMLElement | null>(null);
  const { current } = useTemplate();
  const accent = THEMES[current].accent;

  const exitFocus = useCallback(() => {
    if (focused) {
      focused.style.removeProperty('position');
      focused.style.removeProperty('z-index');
      focused.style.removeProperty('transform');
      focused.style.removeProperty('transition');
    }
    setFocused(null);
  }, [focused]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      // Double-click on a section header to focus it
      if (!target.closest('[class*="secH"], [class*="sectionHeader"]')) return;
      if (focused) { exitFocus(); return; }

      const section = target.closest('[class*="sec"]') as HTMLElement;
      if (!section) return;

      e.preventDefault();
      e.stopPropagation();
      section.style.position = 'relative';
      section.style.zIndex = '101';
      section.style.transition = 'all 0.3s ease';
      setFocused(section);
    }

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && focused) exitFocus();
    }

    document.addEventListener('dblclick', onClick);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('dblclick', onClick);
      window.removeEventListener('keydown', onKey);
    };
  }, [focused, exitFocus]);

  return (
    <AnimatePresence>
      {focused && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={exitFocus}
          data-pdf-hide
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(4px)',
            cursor: 'pointer',
          }}
        >
          <div style={{
            position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)',
            padding: '8px 20px', borderRadius: 50,
            background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', gap: 8,
            fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)',
          }}>
            <span style={{ color: accent, fontWeight: 600 }}>Focus Mode</span>
            <span>&middot;</span>
            <span>Click anywhere or press <strong>ESC</strong> to exit</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
