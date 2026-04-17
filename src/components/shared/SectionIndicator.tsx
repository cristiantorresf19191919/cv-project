'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTemplate } from '@/context/TemplateContext';
import { THEMES } from '@/data/themes';

const SECTIONS = ['hero', 'skills', 'experience', 'projects', 'testimonials', 'contact'];
const SECTION_LABELS: Record<string, string> = {
  hero: 'Intro',
  skills: 'Skills',
  experience: 'Experience',
  projects: 'Projects',
  testimonials: 'Testimonials',
  contact: 'Contact',
};

export default function SectionIndicator() {
  const { current } = useTemplate();
  const accent = THEMES[current].accent;
  const [activeSection, setActiveSection] = useState('');
  const [show, setShow] = useState(false);

  useEffect(() => {
    function onScroll() {
      setShow(window.scrollY > 400);

      const tpl = document.querySelector('[data-pdf-target]')?.firstElementChild;
      if (!tpl) return;

      const sections = tpl.querySelectorAll<HTMLElement>('[class*="sec"], [class*="hero"], section, [id]');
      let current = '';

      sections.forEach(sec => {
        const rect = sec.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.4) {
          const id = sec.id || sec.className.split(' ')[0] || '';
          for (const name of SECTIONS) {
            if (id.toLowerCase().includes(name) || sec.textContent?.slice(0, 100).toLowerCase().includes(name)) {
              current = name;
            }
          }
        }
      });

      if (current) setActiveSection(current);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const label = SECTION_LABELS[activeSection];

  return (
    <AnimatePresence>
      {show && label && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          data-pdf-hide
          style={{
            position: 'fixed',
            top: 80,
            right: 20,
            zIndex: 90,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 16px',
            borderRadius: 50,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: accent }} />
          <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'rgba(255,255,255,0.8)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            {label}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
