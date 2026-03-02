'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useContent } from '@/context/ContentContext';
import { useTemplate } from '@/context/TemplateContext';
import { THEMES } from '@/data/themes';
import { getTechColor } from '@/utils/techBrandColors';

/**
 * Interactive floating skill tags — a visual "word cloud" of all skills.
 * Each tag is sized by frequency/importance and colored by tech brand.
 * Can be placed as a decorative section in any template.
 */
export default function SkillCloud() {
  const { data } = useContent();
  const { current } = useTemplate();
  const accent = THEMES[current].accent;

  const allTags = useMemo(() => {
    const tags: string[] = [];
    for (const skill of data.skills) {
      tags.push(...skill.tags);
    }
    // Also pull tech from experience
    for (const exp of data.exp) {
      tags.push(...exp.tech);
    }
    // Deduplicate
    return Array.from(new Set(tags));
  }, [data]);

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem',
        justifyContent: 'center',
        padding: '1rem 0',
      }}
    >
      {allTags.map((tag, i) => {
        const color = getTechColor(tag) ?? accent;
        return (
          <motion.span
            key={tag}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.03, duration: 0.4 }}
            whileHover={{ scale: 1.12, y: -3 }}
            style={{
              display: 'inline-block',
              padding: '0.35rem 0.8rem',
              borderRadius: '999px',
              border: `1px solid ${color}33`,
              background: `${color}12`,
              color,
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.3px',
              cursor: 'default',
              transition: 'box-shadow 0.25s',
              whiteSpace: 'nowrap',
            }}
          >
            {tag}
          </motion.span>
        );
      })}
    </div>
  );
}
