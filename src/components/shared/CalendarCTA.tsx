'use client';

import { motion } from 'framer-motion';
import { useTemplate } from '@/context/TemplateContext';
import { useLanguage } from '@/context/LanguageContext';
import { useContent } from '@/context/ContentContext';
import { THEMES } from '@/data/themes';

const DARK = new Set(['noir', 'term', 'neon', 'ember', 'midnight', 'horizon', 'glass', 'aurora', 'retro', 'blueprint', 'cosmic']);

export default function CalendarCTA() {
  const { current } = useTemplate();
  const { lang } = useLanguage();
  const { data } = useContent();
  const accent = THEMES[current].accent;
  const isDark = DARK.has(current);

  return (
    <div style={{ maxWidth: 1300, margin: '0 auto', padding: '3rem 2.5rem 5rem' }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          padding: '3.5rem 3rem',
          borderRadius: 28,
          background: isDark
            ? `linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)`
            : `linear-gradient(135deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.04) 100%)`,
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Gradient glow */}
        <div style={{
          position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%',
          background: `radial-gradient(circle at 50% 120%, ${accent}15, transparent 60%)`,
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Calendar icon */}
          <div style={{
            width: 56, height: 56, borderRadius: 16, margin: '0 auto 1.5rem',
            background: `${accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.8" strokeLinecap="round">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
              <circle cx="12" cy="15" r="1" fill={accent} />
            </svg>
          </div>

          <h3 style={{
            fontSize: '2rem',
            fontWeight: 700,
            color: isDark ? '#f0f0f0' : '#1a1a1a',
            marginBottom: '0.8rem',
            letterSpacing: '-0.5px',
          }}>
            {lang === 'en' ? "Let's Build Something Great" : 'Construyamos Algo Grandioso'}
          </h3>

          <p style={{
            fontSize: '1rem',
            color: isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.5)',
            maxWidth: 500,
            margin: '0 auto 2rem',
            lineHeight: 1.7,
          }}>
            {lang === 'en'
              ? "I'm always excited to discuss new projects, creative ideas, or opportunities to be part of your vision."
              : 'Siempre estoy emocionado de discutir nuevos proyectos, ideas creativas u oportunidades para ser parte de tu vision.'}
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href={`mailto:${data.email}?subject=Let's%20Connect`}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '14px 32px', borderRadius: 50,
                background: `linear-gradient(135deg, ${accent}, ${accent}dd)`,
                color: isDark ? '#0d1117' : '#fff',
                fontWeight: 600, fontSize: '0.92rem',
                textDecoration: 'none',
                boxShadow: `0 8px 24px ${accent}30`,
                transition: 'all 0.3s',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {lang === 'en' ? 'Schedule a Conversation' : 'Agendar una Conversacion'}
            </a>

            <a
              href={`https://${data.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '14px 32px', borderRadius: 50,
                border: `2px solid ${accent}40`,
                background: 'transparent',
                color: isDark ? '#f0f0f0' : '#1a1a1a',
                fontWeight: 500, fontSize: '0.92rem',
                textDecoration: 'none',
                transition: 'all 0.3s',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              {lang === 'en' ? 'Connect on LinkedIn' : 'Conectar en LinkedIn'}
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
