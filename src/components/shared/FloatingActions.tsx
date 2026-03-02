'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useContent } from '@/context/ContentContext';
import { useTemplate } from '@/context/TemplateContext';
import { useLanguage } from '@/context/LanguageContext';
import { THEMES } from '@/data/themes';
import styles from '@/styles/floating-actions.module.css';

export default function FloatingActions() {
  const [isOpen, setIsOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [visible, setVisible] = useState(false);
  const { data } = useContent();
  const { current } = useTemplate();
  const { lang } = useLanguage();
  const accent = THEMES[current].accent;

  // Show FAB after scrolling 300px
  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 300);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const actions = [
    {
      id: 'top',
      label: lang === 'en' ? 'Scroll to Top' : 'Ir al Inicio',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      ),
      onClick: () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setIsOpen(false);
      },
    },
    {
      id: 'share',
      label: lang === 'en' ? 'Share' : 'Compartir',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
        </svg>
      ),
      onClick: async () => {
        const url = window.location.href;
        const title = `${data.name} ${data.last} - Portfolio`;
        if (navigator.share) {
          try {
            await navigator.share({ title, url });
          } catch {
            // User cancelled share
          }
        } else {
          await navigator.clipboard.writeText(url);
          setShowToast(true);
          setTimeout(() => setShowToast(false), 2500);
        }
        setIsOpen(false);
      },
    },
    {
      id: 'email',
      label: 'Email',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M22 7l-10 6L2 7" />
        </svg>
      ),
      onClick: () => {
        window.open(`mailto:${data.email}`, '_blank');
        setIsOpen(false);
      },
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      ),
      onClick: () => {
        window.open(`https://${data.linkedin}`, '_blank');
        setIsOpen(false);
      },
    },
    {
      id: 'github',
      label: 'GitHub',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
      ),
      onClick: () => {
        window.open(`https://${data.github}`, '_blank');
        setIsOpen(false);
      },
    },
  ];

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.div
            className={styles.container}
            style={{ ['--fab-accent' as string]: accent }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Action buttons */}
            <AnimatePresence>
              {isOpen &&
                actions.map((act, i) => (
                  <motion.button
                    key={act.id}
                    className={styles.action}
                    onClick={act.onClick}
                    initial={{ opacity: 0, y: 10, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.8 }}
                    transition={{ delay: i * 0.04, duration: 0.2 }}
                    aria-label={act.label}
                  >
                    {act.icon}
                    <span className={styles.tooltip}>{act.label}</span>
                  </motion.button>
                ))}
            </AnimatePresence>

            {/* Main FAB */}
            <button
              className={`${styles.fab} ${isOpen ? styles.fabOpen : ''}`}
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? 'Close actions' : 'Open actions'}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast for copy feedback */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            className={styles.toast}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <svg className={styles.toastIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
            {lang === 'en' ? 'Link copied!' : 'Enlace copiado!'}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
