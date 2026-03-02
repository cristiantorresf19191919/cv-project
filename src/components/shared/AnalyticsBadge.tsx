'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTemplate } from '@/context/TemplateContext';
import { useLanguage } from '@/context/LanguageContext';
import { THEMES } from '@/data/themes';
import { isFirebaseConfigured, getPageViewData } from '@/lib/firebase';
import styles from '@/styles/analytics-badge.module.css';

function Sparkline({ data, color }: { data: number[]; color: string }) {
  if (data.length < 2) return null;

  const max = Math.max(...data, 1);
  const w = 72;
  const h = 22;
  const padding = 2;

  const points = data.map((v, i) => {
    const x = padding + (i / (data.length - 1)) * (w - padding * 2);
    const y = h - padding - (v / max) * (h - padding * 2);
    return `${x},${y}`;
  });

  const pathD = `M ${points.join(' L ')}`;
  const areaD = `${pathD} L ${w - padding},${h - padding} L ${padding},${h - padding} Z`;

  return (
    <svg className={styles.sparkline} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill="url(#sparkGrad)" />
      <path d={pathD} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Glow dot on latest point */}
      {data.length > 0 && (
        <circle
          cx={w - padding}
          cy={h - padding - (data[data.length - 1] / max) * (h - padding * 2)}
          r="2"
          fill={color}
        >
          <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" />
        </circle>
      )}
    </svg>
  );
}

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export default function AnalyticsBadge() {
  const [total, setTotal] = useState(0);
  const [daily, setDaily] = useState<number[]>([]);
  const [visible, setVisible] = useState(false);
  const { current } = useTemplate();
  const { lang } = useLanguage();
  const accent = THEMES[current].accent;

  useEffect(() => {
    if (!isFirebaseConfigured()) return;

    async function load() {
      const data = await getPageViewData();
      setTotal(data.total);
      setDaily(data.daily.map((d) => d.count));
      if (data.total > 0) setVisible(true);
    }

    load();
  }, []);

  if (!visible) return null;

  const label = lang === 'en' ? 'views' : 'visitas';

  return (
    <AnimatePresence>
      <motion.div
        className={styles.badge}
        style={{ ['--badge-accent' as string]: accent }}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ delay: 1.5, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className={styles.top}>
          <svg className={styles.eyeIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          <span className={styles.number}>{formatCount(total)}</span>
          <span className={styles.label}>{label}</span>
        </div>
        {daily.length >= 2 && (
          <Sparkline data={daily} color={accent} />
        )}
      </motion.div>
    </AnimatePresence>
  );
}
