'use client';

import { motion } from 'framer-motion';
import { useContent } from '@/context/ContentContext';
import { useTemplate } from '@/context/TemplateContext';
import { useLanguage } from '@/context/LanguageContext';
import { THEMES } from '@/data/themes';

const DARK_TEMPLATES = new Set(['noir', 'term', 'neon', 'ember', 'midnight', 'horizon', 'glass', 'aurora', 'retro', 'blueprint', 'cosmic']);

export default function TLDRSummary() {
  const { data } = useContent();
  const { current } = useTemplate();
  const { lang } = useLanguage();
  const accent = THEMES[current].accent;
  const isDark = DARK_TEMPLATES.has(current);

  const yearsExp = data.stats.find(s => s.l.toLowerCase().includes('year'))?.n || '5+';
  const companies = data.exp.length;
  const topSkills = data.skills.flatMap(s => s.tags).slice(0, 5).join(', ');

  const summary = lang === 'en'
    ? `${yearsExp} years experience across ${companies} companies. Specializing in ${topSkills}. ${data.availability === 'open' ? 'Currently open to new opportunities.' : ''}`
    : `${yearsExp} anos de experiencia en ${companies} empresas. Especializado en ${topSkills}. ${data.availability === 'open' ? 'Actualmente abierto a nuevas oportunidades.' : ''}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.6 }}
      data-pdf-hide
      style={{
        maxWidth: 1300,
        margin: '0 auto',
        padding: '1.25rem 2.5rem 0',
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '14px 22px',
        borderRadius: 14,
        borderLeft: `4px solid ${accent}`,
        background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
        backdropFilter: 'blur(8px)',
      }}>
        <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' as const, color: accent, whiteSpace: 'nowrap' }}>
          TL;DR
        </span>
        <span style={{
          fontSize: '0.88rem',
          lineHeight: 1.6,
          color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
          fontWeight: 400,
        }}>
          {summary}
        </span>
      </div>
    </motion.div>
  );
}
