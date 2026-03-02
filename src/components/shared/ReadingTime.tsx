'use client';

import { useMemo } from 'react';
import { useContent } from '@/context/ContentContext';
import { useLanguage } from '@/context/LanguageContext';

/**
 * Calculates and displays estimated reading time for the portfolio content.
 * Renders as a subtle inline badge — meant to be placed inside a hero section.
 */
export default function ReadingTime() {
  const { data } = useContent();
  const { t } = useLanguage();

  const minutes = useMemo(() => {
    // Aggregate all text content
    const parts: string[] = [
      data.desc,
      data.tagline,
      ...data.exp.flatMap((e) => [e.d, ...e.a, e.t, e.co]),
      ...data.projects.map((p) => p.desc),
      ...data.testimonials.map((t) => t.quote),
      ...data.skills.flatMap((s) => s.tags),
      ...data.education.map((e) => [e.degree, e.desc ?? ''].join(' ')),
    ];

    const totalWords = parts.join(' ').split(/\s+/).length;
    return Math.max(1, Math.ceil(totalWords / 200)); // ~200 wpm
  }, [data]);

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        fontSize: '0.72rem',
        fontWeight: 500,
        letterSpacing: '0.5px',
        opacity: 0.5,
      }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
      {minutes} {t.readingTime}
    </span>
  );
}
