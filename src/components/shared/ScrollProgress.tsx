'use client';

import { motion, useScroll, useSpring } from 'framer-motion';
import { useTemplate } from '@/context/TemplateContext';
import { THEMES } from '@/data/themes';

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const { current } = useTemplate();
  const theme = THEMES[current];

  return (
    <motion.div
      style={{
        scaleX,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: `linear-gradient(90deg, ${theme.accent}, ${theme.accent}cc)`,
        transformOrigin: '0%',
        zIndex: 10001,
      }}
    />
  );
}
