'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTemplate } from '@/context/TemplateContext';
import { THEMES } from '@/data/themes';
import { isFirebaseConfigured, toggleReaction, subscribeToReactions, ReactionType } from '@/lib/firebase';
import styles from '@/styles/reaction-bar.module.css';

const REACTIONS: { type: ReactionType; emoji: string; label: string }[] = [
  { type: 'fire', emoji: '🔥', label: 'Fire' },
  { type: 'heart', emoji: '❤️', label: 'Love' },
  { type: 'rocket', emoji: '🚀', label: 'Rocket' },
  { type: 'hundred', emoji: '💯', label: '100' },
];

interface ReactionBarProps {
  sectionId: string;
}

export default function ReactionBar({ sectionId }: ReactionBarProps) {
  const [counts, setCounts] = useState<Record<ReactionType, number>>({ fire: 0, heart: 0, rocket: 0, hundred: 0 });
  const [animating, setAnimating] = useState<ReactionType | null>(null);
  const [reacted, setReacted] = useState<Set<ReactionType>>(new Set());
  const { current } = useTemplate();
  const accent = THEMES[current].accent;

  useEffect(() => {
    if (!isFirebaseConfigured()) return;

    let unsub: (() => void) | null = null;

    async function init() {
      unsub = await subscribeToReactions(sectionId, (data) => {
        setCounts(data);
      });
    }

    init();
    return () => { unsub?.(); };
  }, [sectionId]);

  // Load reacted state from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`reactions_${sectionId}`);
      if (stored) setReacted(new Set(JSON.parse(stored)));
    } catch { /* localStorage unavailable */ }
  }, [sectionId]);

  const handleReaction = useCallback(async (type: ReactionType) => {
    if (reacted.has(type)) return; // Already reacted

    // Optimistic update
    setCounts((prev) => ({ ...prev, [type]: prev[type] + 1 }));
    setAnimating(type);
    setTimeout(() => setAnimating(null), 600);

    // Mark as reacted
    const next = new Set(reacted);
    next.add(type);
    setReacted(next);
    try {
      localStorage.setItem(`reactions_${sectionId}`, JSON.stringify(Array.from(next)));
    } catch { /* localStorage unavailable */ }

    await toggleReaction(sectionId, type);
  }, [sectionId, reacted]);

  if (!isFirebaseConfigured()) return null;

  const totalReactions = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div className={styles.bar} style={{ ['--reaction-accent' as string]: accent }}>
      {REACTIONS.map(({ type, emoji, label }) => {
        const count = counts[type];
        const isAnimating = animating === type;
        const hasReacted = reacted.has(type);

        return (
          <button
            key={type}
            className={`${styles.btn} ${hasReacted ? styles.btnReacted : ''}`}
            onClick={() => handleReaction(type)}
            disabled={hasReacted}
            aria-label={`${label} ${count}`}
            title={hasReacted ? `You reacted ${label}` : `React ${label}`}
          >
            <motion.span
              className={styles.emoji}
              animate={isAnimating ? { scale: [1, 1.4, 1], rotate: [0, -12, 12, 0] } : {}}
              transition={{ duration: 0.4 }}
            >
              {emoji}
            </motion.span>
            <AnimatePresence mode="wait">
              {count > 0 && (
                <motion.span
                  key={count}
                  className={styles.count}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  {count}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        );
      })}
      {totalReactions > 0 && (
        <span className={styles.total}>{totalReactions}</span>
      )}
    </div>
  );
}
