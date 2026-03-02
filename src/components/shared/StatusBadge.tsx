'use client';

import { motion } from 'framer-motion';
import { useContent } from '@/context/ContentContext';
import { useLanguage } from '@/context/LanguageContext';
import styles from '@/styles/status-badge.module.css';

export default function StatusBadge() {
  const { data } = useContent();
  const { t } = useLanguage();

  if (data.availability !== 'open') return null;

  return (
    <motion.div
      className={styles.badge}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className={styles.dot} />
      {t.openToWork}
    </motion.div>
  );
}
