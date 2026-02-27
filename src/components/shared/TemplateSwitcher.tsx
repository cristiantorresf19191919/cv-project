'use client';

import { useTemplate } from '@/context/TemplateContext';
import { useLanguage } from '@/context/LanguageContext';
import { THEMES, TEMPLATE_LIST } from '@/data/themes';
import { TemplateName } from '@/types/templates';
import styles from '@/styles/switcher.module.css';

export default function TemplateSwitcher() {
  const { current, switchTemplate } = useTemplate();
  const { lang, toggleLang } = useLanguage();
  const theme = THEMES[current];

  const isDarkNav = current !== 'arctic' && current !== 'edit' && current !== 'exec' && current !== 'mono';

  return (
    <div
      className={styles.switcher}
      style={{ background: theme.navBg }}
    >
      <div
        className={styles.logo}
        style={{
          background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        CPT
      </div>
      <div className={styles.divider} />
      <div className={styles.label} style={{ color: theme.labelColor }}>
        Templates
      </div>
      <div className={styles.scroll}>
        {TEMPLATE_LIST.map((tmpl) => {
          const isActive = tmpl.name === current;
          return (
            <button
              key={tmpl.name}
              className={`${styles.btn} ${isActive ? styles.btnActive : ''}`}
              onClick={() => switchTemplate(tmpl.name as TemplateName)}
              style={{
                borderColor: isActive
                  ? theme.accent
                  : isDarkNav
                    ? 'rgba(255,255,255,0.07)'
                    : 'rgba(0,0,0,0.08)',
                color: isActive
                  ? (!isDarkNav ? theme.accent : '#fff')
                  : theme.navText,
                ['--glow' as string]: `${theme.accent}33`,
              }}
            >
              <span
                className={`${styles.dot} ${isActive ? styles.dotActive : ''}`}
                style={{ background: tmpl.dotColor }}
              />
              {tmpl.label}
            </button>
          );
        })}
      </div>

      <div className={styles.divider} />

      <button
        className={styles.langToggle}
        onClick={toggleLang}
        style={{
          borderColor: isDarkNav ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)',
          ['--lang-accent' as string]: theme.accent,
        }}
      >
        <span
          className={`${styles.langOpt} ${lang === 'en' ? styles.langActive : ''}`}
          style={lang === 'en' ? { background: theme.accent, color: '#fff' } : { color: isDarkNav ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)' }}
        >
          EN
        </span>
        <span
          className={`${styles.langOpt} ${lang === 'es' ? styles.langActive : ''}`}
          style={lang === 'es' ? { background: theme.accent, color: '#fff' } : { color: isDarkNav ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)' }}
        >
          ES
        </span>
      </button>
    </div>
  );
}
