'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useTemplate } from '@/context/TemplateContext';
import { THEMES } from '@/data/themes';

export default function TransitionLoader() {
  const { isTransitioning, current } = useTemplate();
  const accent = THEMES[current].accent;

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.3)',
            backdropFilter: 'blur(4px)',
          }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              border: `3px solid rgba(255,255,255,0.1)`,
              borderTopColor: accent,
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
