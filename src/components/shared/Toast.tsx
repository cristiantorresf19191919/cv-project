'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useToast } from '@/context/ToastContext';
import { useTemplate } from '@/context/TemplateContext';
import { THEMES } from '@/data/themes';

const ICONS = {
  success: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
  ),
  info: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
  ),
  error: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><path d="M15 9l-6 6M9 9l6 6" /></svg>
  ),
};

export default function Toast() {
  const { toasts, dismiss } = useToast();
  const { current } = useTemplate();
  const accent = THEMES[current].accent;

  return (
    <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 10000, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center', pointerEvents: 'none' }}>
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            onClick={() => dismiss(t.id)}
            style={{
              pointerEvents: 'auto',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 20px',
              borderRadius: 50,
              background: t.type === 'error' ? 'rgba(220,38,38,0.92)' : t.type === 'success' ? 'rgba(22,163,74,0.92)' : `${accent}ee`,
              color: '#fff',
              fontSize: '0.85rem',
              fontWeight: 500,
              backdropFilter: 'blur(12px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              whiteSpace: 'nowrap',
            }}
          >
            {ICONS[t.type || 'info']}
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
