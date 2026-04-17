'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useContent } from '@/context/ContentContext';
import { useTemplate } from '@/context/TemplateContext';
import { useLanguage } from '@/context/LanguageContext';
import { THEMES } from '@/data/themes';
import AnimatedSection from '@/components/shared/AnimatedSection';
import SectionHeader from '@/components/shared/SectionHeader';

const DARK = new Set(['noir', 'term', 'neon', 'ember', 'midnight', 'horizon', 'glass', 'aurora', 'retro', 'blueprint', 'cosmic']);

// Proficiency levels based on how many experience entries use each tech
function computeProficiency(tag: string, exps: { tech: string[] }[]): number {
  const count = exps.filter(e => e.tech.includes(tag)).length;
  return Math.min(count / exps.length, 1);
}

export default function SkillsMatrix() {
  const { data } = useContent();
  const { current } = useTemplate();
  const { lang } = useLanguage();
  const accent = THEMES[current].accent;
  const isDark = DARK.has(current);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  // Build skill list with proficiency
  const allTags = data.skills.flatMap(s => s.tags);
  const unique = Array.from(new Set(allTags));
  const withProf = unique.map(tag => ({
    tag,
    proficiency: computeProficiency(tag, data.exp),
    expCount: data.exp.filter(e => e.tech.includes(tag)).length,
  })).sort((a, b) => b.proficiency - a.proficiency);

  // Related experiences for selected tag
  const relatedExps = activeTag ? data.exp.filter(e => e.tech.includes(activeTag)) : [];

  return (
    <div style={{ maxWidth: 1300, margin: '0 auto', padding: '5rem 2.5rem' }}>
      <AnimatedSection>
        <SectionHeader
          tag={lang === 'en' ? 'Proficiency' : 'Competencias'}
          title={lang === 'en' ? 'Skills Matrix' : 'Matriz de Habilidades'}
          tagClass=""
          titleClass=""
          wrapperClass=""
        />
      </AnimatedSection>

      <div style={{ maxWidth: 900, margin: '3rem auto 0' }}>
        {/* Skill bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {withProf.slice(0, 18).map(({ tag, proficiency, expCount }, i) => (
            <motion.div
              key={tag}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03, duration: 0.4 }}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              style={{
                display: 'grid',
                gridTemplateColumns: '140px 1fr 40px',
                alignItems: 'center',
                gap: 16,
                padding: '10px 16px',
                borderRadius: 12,
                cursor: 'pointer',
                background: activeTag === tag ? (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)') : 'transparent',
                transition: 'background 0.2s',
              }}
            >
              <span style={{
                fontSize: '0.82rem', fontWeight: 500,
                color: activeTag === tag ? accent : (isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)'),
                transition: 'color 0.2s',
              }}>
                {tag}
              </span>

              <div style={{
                height: 6, borderRadius: 3,
                background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
                overflow: 'hidden',
              }}>
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${Math.max(proficiency * 100, 20)}%` }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.03 + 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    height: '100%', borderRadius: 3,
                    background: `linear-gradient(90deg, ${accent}, ${accent}88)`,
                  }}
                />
              </div>

              <span style={{ fontSize: '0.72rem', color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)', textAlign: 'right' }}>
                {expCount > 0 ? `${expCount} role${expCount > 1 ? 's' : ''}` : 'skill'}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Related experiences */}
        {activeTag && relatedExps.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            style={{
              marginTop: 24, padding: 20, borderRadius: 16,
              background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}`,
            }}
          >
            <div style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase' as const, color: accent, marginBottom: 12 }}>
              {lang === 'en' ? `Where I used ${activeTag}` : `Donde use ${activeTag}`}
            </div>
            {relatedExps.map((e, i) => (
              <div key={i} style={{
                padding: '8px 0',
                borderBottom: i < relatedExps.length - 1 ? `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'}` : 'none',
              }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: isDark ? '#f0f0f0' : '#1a1a1a' }}>
                  {e.t} @ {e.co}
                </div>
                <div style={{ fontSize: '0.78rem', color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }}>
                  {e.dt}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
