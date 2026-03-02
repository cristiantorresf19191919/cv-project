'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { isFirebaseConfigured, subscribeToAvailability, AvailabilityStatus } from '@/lib/firebase';
import styles from '@/styles/live-availability.module.css';

const STATUS_CONFIG: Record<string, { dotClass: string; labelEn: string; labelEs: string }> = {
  open: { dotClass: 'dotOpen', labelEn: 'Open to Work', labelEs: 'Abierto a Oportunidades' },
  busy: { dotClass: 'dotBusy', labelEn: 'Currently Engaged', labelEs: 'Actualmente Ocupado' },
  closed: { dotClass: 'dotClosed', labelEn: 'Not Available', labelEs: 'No Disponible' },
};

export default function LiveAvailability() {
  const [status, setStatus] = useState<AvailabilityStatus | null>(null);
  const [useFallback, setUseFallback] = useState(false);
  const { lang } = useLanguage();

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setUseFallback(true);
      return;
    }

    let unsub: (() => void) | null = null;

    async function init() {
      unsub = await subscribeToAvailability((s) => {
        setStatus(s);
      });

      // If Firebase subscription didn't connect, show fallback
      if (!unsub) setUseFallback(true);
    }

    init();
    return () => { unsub?.(); };
  }, []);

  // Fallback to static "open to work" if Firebase not configured
  const displayStatus = status?.status ?? (useFallback ? 'open' : null);
  if (!displayStatus) return null;

  const config = STATUS_CONFIG[displayStatus] ?? STATUS_CONFIG.open;
  const label = status?.message ?? (lang === 'en' ? config.labelEn : config.labelEs);

  // Don't show badge if status is closed
  if (displayStatus === 'closed') return null;

  return (
    <motion.div
      className={styles.badge}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className={`${styles.dot} ${styles[config.dotClass]}`} />
      <span className={styles.text}>
        {label}
      </span>
      {displayStatus === 'open' && (
        <span className={styles.liveTag}>LIVE</span>
      )}
    </motion.div>
  );
}
