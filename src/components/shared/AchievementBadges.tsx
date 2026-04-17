'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTemplate } from '@/context/TemplateContext';
import { THEMES } from '@/data/themes';
import { useToast } from '@/context/ToastContext';

interface Badge {
  id: string;
  icon: string;
  name: string;
  desc: string;
  check: () => boolean;
}

const STORAGE_KEY = 'portfolio_achievements';

function getViewedTemplates(): Set<string> {
  try {
    const s = localStorage.getItem('portfolio_viewed_templates');
    return s ? new Set(JSON.parse(s)) : new Set();
  } catch { return new Set(); }
}

function getUnlocked(): Set<string> {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    return s ? new Set(JSON.parse(s)) : new Set();
  } catch { return new Set(); }
}

function saveUnlocked(ids: Set<string>) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(ids))); } catch {}
}

export default function AchievementBadges() {
  const [open, setOpen] = useState(false);
  const [unlocked, setUnlocked] = useState<Set<string>>(new Set());
  const { current } = useTemplate();
  const accent = THEMES[current].accent;
  const { toast } = useToast();

  const badges: Badge[] = useMemo(() => [
    { id: 'first-visit', icon: '👋', name: 'First Visit', desc: 'Welcome to the portfolio!', check: () => true },
    { id: 'explorer-3', icon: '🧭', name: 'Explorer', desc: 'Viewed 3+ templates', check: () => getViewedTemplates().size >= 3 },
    { id: 'explorer-10', icon: '🗺️', name: 'Cartographer', desc: 'Viewed 10+ templates', check: () => getViewedTemplates().size >= 10 },
    { id: 'explorer-all', icon: '🏆', name: 'Completionist', desc: 'Viewed all 18 templates', check: () => getViewedTemplates().size >= 18 },
    { id: 'scroller', icon: '📜', name: 'Deep Diver', desc: 'Scrolled to the bottom', check: () => (typeof window !== 'undefined' && localStorage.getItem('portfolio_scrolled_bottom') === '1') },
    { id: 'konami', icon: '🎮', name: 'Code Breaker', desc: 'Found the Easter Egg', check: () => (typeof window !== 'undefined' && localStorage.getItem('portfolio_easter_egg') === '1') },
  ], []);

  // Track viewed templates
  useEffect(() => {
    const viewed = getViewedTemplates();
    viewed.add(current);
    try { localStorage.setItem('portfolio_viewed_templates', JSON.stringify(Array.from(viewed))); } catch {}
  }, [current]);

  // Track scroll to bottom
  useEffect(() => {
    const onScroll = () => {
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 200) {
        try { localStorage.setItem('portfolio_scrolled_bottom', '1'); } catch {}
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Check badges periodically
  const checkBadges = useCallback(() => {
    const prev = getUnlocked();
    const next = new Set(prev);
    let newest: string | null = null;

    for (const b of badges) {
      if (!prev.has(b.id) && b.check()) {
        next.add(b.id);
        newest = b.id;
      }
    }

    if (next.size > prev.size) {
      saveUnlocked(next);
      setUnlocked(next);
      if (newest) {
        const badge = badges.find(b => b.id === newest);
        if (badge) {
          toast(`Badge unlocked: ${badge.icon} ${badge.name}`, 'success');
        }
      }
    }
  }, [badges, toast]);

  useEffect(() => {
    setUnlocked(getUnlocked());
    checkBadges();
    const timer = setInterval(checkBadges, 5000);
    return () => clearInterval(timer);
  }, [checkBadges]);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener('open-achievements', handler);
    return () => window.removeEventListener('open-achievements', handler);
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 10005,
            background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <motion.div
            initial={{ scale: 0.92, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            onClick={e => e.stopPropagation()}
            style={{
              background: '#12121f', borderRadius: 28, padding: '2.5rem',
              maxWidth: 420, width: '90%',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f0f0f0', marginBottom: 8 }}>
              Achievements
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', marginBottom: 24 }}>
              {unlocked.size} / {badges.length} unlocked
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {badges.map(b => {
                const isUnlocked = unlocked.has(b.id);
                return (
                  <div key={b.id} style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '12px 16px', borderRadius: 14,
                    background: isUnlocked ? `${accent}10` : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${isUnlocked ? `${accent}25` : 'rgba(255,255,255,0.04)'}`,
                    opacity: isUnlocked ? 1 : 0.4,
                  }}>
                    <span style={{ fontSize: '1.5rem', filter: isUnlocked ? 'none' : 'grayscale(1)' }}>
                      {b.icon}
                    </span>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 600, color: isUnlocked ? '#f0f0f0' : 'rgba(255,255,255,0.4)' }}>
                        {b.name}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)' }}>
                        {b.desc}
                      </div>
                    </div>
                    {isUnlocked && (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2.5" strokeLinecap="round" style={{ marginLeft: 'auto' }}>
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
