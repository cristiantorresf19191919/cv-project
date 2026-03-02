'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTemplate } from '@/context/TemplateContext';
import { useLanguage } from '@/context/LanguageContext';
import { THEMES } from '@/data/themes';
import { isFirebaseConfigured, registerVisitorPresence, subscribeToVisitorCount, recordPageView } from '@/lib/firebase';
import styles from '@/styles/visitor-pulse.module.css';

export default function VisitorPulse() {
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(false);
  const { current } = useTemplate();
  const { lang } = useLanguage();
  const accent = THEMES[current].accent;

  useEffect(() => {
    if (!isFirebaseConfigured()) return;

    let cleanupPresence: (() => void) | null = null;
    let cleanupSubscription: (() => void) | null = null;

    async function init() {
      // Record this page view
      await recordPageView();

      // Register presence
      cleanupPresence = await registerVisitorPresence();

      // Subscribe to live count
      cleanupSubscription = await subscribeToVisitorCount((n) => {
        setCount(n);
        if (n > 0) setVisible(true);
      });
    }

    init();

    // Cleanup on unmount + beforeunload
    function handleUnload() {
      cleanupPresence?.();
    }
    window.addEventListener('beforeunload', handleUnload);

    return () => {
      window.removeEventListener('beforeunload', handleUnload);
      cleanupPresence?.();
      cleanupSubscription?.();
    };
  }, []);

  if (!visible || count < 1) return null;

  const label = lang === 'en'
    ? `${count} ${count === 1 ? 'person' : 'people'} viewing now`
    : `${count} ${count === 1 ? 'persona' : 'personas'} viendo ahora`;

  return (
    <AnimatePresence>
      <motion.div
        className={styles.pulse}
        style={{ ['--pulse-accent' as string]: accent }}
        initial={{ opacity: 0, y: 12, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className={styles.liveDot} />
        <span className={styles.liveLabel}>LIVE</span>
        <span className={styles.divider} />
        <AnimatePresence mode="wait">
          <motion.span
            key={count}
            className={styles.count}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
          >
            {label}
          </motion.span>
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
