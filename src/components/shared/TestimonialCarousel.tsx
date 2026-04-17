'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContent } from '@/context/ContentContext';
import { useTemplate } from '@/context/TemplateContext';
import { useLanguage } from '@/context/LanguageContext';
import { THEMES } from '@/data/themes';
import AnimatedSection from '@/components/shared/AnimatedSection';
import SectionHeader from '@/components/shared/SectionHeader';

const DARK = new Set(['noir', 'term', 'neon', 'ember', 'midnight', 'horizon', 'glass', 'aurora', 'retro', 'blueprint', 'cosmic']);

export default function TestimonialCarousel() {
  const { data } = useContent();
  const { current } = useTemplate();
  const { lang } = useLanguage();
  const accent = THEMES[current].accent;
  const isDark = DARK.has(current);
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  const items = data.testimonials;
  const len = items?.length ?? 0;

  const next = useCallback(() => { if (len > 0) setIdx(i => (i + 1) % len); }, [len]);
  const prev = useCallback(() => { if (len > 0) setIdx(i => (i - 1 + len) % len); }, [len]);

  useEffect(() => {
    if (paused || len === 0) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [paused, next, len]);

  if (!items || len === 0) return null;

  const t = items[idx];

  return (
    <div style={{ maxWidth: 1300, margin: '0 auto', padding: '5rem 2.5rem' }}>
      <AnimatedSection>
        <SectionHeader
          tag={lang === 'en' ? 'Testimonials' : 'Testimonios'}
          title={lang === 'en' ? 'What People Say' : 'Lo Que Dicen'}
          tagClass=""
          titleClass=""
          wrapperClass=""
        />
      </AnimatedSection>

      <div
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        style={{
          position: 'relative',
          maxWidth: 800,
          margin: '3rem auto 0',
          textAlign: 'center',
        }}
      >
        {/* Quote */}
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <div style={{
              padding: '3rem 2.5rem',
              borderRadius: 24,
              background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
              position: 'relative',
            }}>
              {/* Big quote mark */}
              <div style={{ position: 'absolute', top: 16, left: 24, fontSize: '4rem', lineHeight: 1, color: accent, opacity: 0.3, fontFamily: 'Georgia, serif' }}>
                &ldquo;
              </div>

              <p style={{
                fontSize: '1.15rem',
                lineHeight: 1.9,
                color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)',
                fontStyle: 'italic',
                margin: 0,
                position: 'relative',
                zIndex: 1,
              }}>
                {t.quote}
              </p>

              <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: '50%',
                  background: `linear-gradient(135deg, ${accent}, ${accent}88)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontWeight: 700, fontSize: '1.1rem',
                  marginBottom: 8,
                }}>
                  {t.name.charAt(0)}
                </div>
                <div style={{ fontWeight: 600, fontSize: '1rem', color: isDark ? '#f0f0f0' : '#1a1a1a' }}>
                  {t.name}
                </div>
                <div style={{ fontSize: '0.82rem', color: accent, fontWeight: 500 }}>
                  {t.role} @ {t.company}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, marginTop: 24 }}>
          <button
            onClick={prev}
            aria-label="Previous testimonial"
            style={{
              width: 36, height: 36, borderRadius: '50%', border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)'}`,
              background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)', transition: 'all 0.2s',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
          </button>

          <div style={{ display: 'flex', gap: 8 }}>
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                aria-label={`Testimonial ${i + 1}`}
                style={{
                  width: i === idx ? 24 : 8, height: 8, borderRadius: 4, border: 'none',
                  background: i === idx ? accent : (isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)'),
                  cursor: 'pointer', transition: 'all 0.3s',
                }}
              />
            ))}
          </div>

          <button
            onClick={next}
            aria-label="Next testimonial"
            style={{
              width: 36, height: 36, borderRadius: '50%', border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)'}`,
              background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)', transition: 'all 0.2s',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
