'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useContent } from '@/context/ContentContext';
import { useTemplate } from '@/context/TemplateContext';
import { THEMES } from '@/data/themes';

const SESSION_KEY = 'portfolio_intro_shown';

export default function IntroAnimation() {
  const [show, setShow] = useState(false);
  const { data } = useContent();
  const { current } = useTemplate();
  const accent = THEMES[current].accent;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem(SESSION_KEY)) return;
    setShow(true);
    sessionStorage.setItem(SESSION_KEY, '1');
    setTimeout(() => setShow(false), 2800);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            position: 'fixed', inset: 0, zIndex: 99999,
            background: '#0a0a0a',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: 16,
          }}
        >
          {/* Accent glow */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.15 }}
            transition={{ delay: 0.3, duration: 1.5 }}
            style={{
              position: 'absolute', width: 600, height: 600, borderRadius: '50%',
              background: `radial-gradient(circle, ${accent}, transparent 70%)`,
              filter: 'blur(60px)',
            }}
          />

          {/* Name */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: 'var(--font-cormorant), serif',
              fontSize: 'clamp(2.5rem, 8vw, 5rem)',
              fontWeight: 700,
              color: '#f0f0f0',
              letterSpacing: '-2px',
              position: 'relative',
              zIndex: 1,
            }}
          >
            {data.name} {data.last}
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            style={{
              fontSize: '1rem',
              color: accent,
              fontWeight: 500,
              letterSpacing: '3px',
              textTransform: 'uppercase' as const,
              position: 'relative',
              zIndex: 1,
            }}
          >
            {data.title}
          </motion.div>

          {/* Loading bar */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.8, duration: 1.5, ease: 'easeInOut' }}
            style={{
              width: 120, height: 2, marginTop: 24,
              background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
              transformOrigin: 'left',
              position: 'relative',
              zIndex: 1,
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
