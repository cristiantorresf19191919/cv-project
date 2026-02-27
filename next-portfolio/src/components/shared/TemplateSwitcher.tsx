'use client';

import { useTemplate } from '@/context/TemplateContext';
import { THEMES, TEMPLATE_LIST } from '@/data/themes';
import { TemplateName } from '@/types/templates';
import styles from '@/styles/switcher.module.css';

export default function TemplateSwitcher() {
  const { current, switchTemplate } = useTemplate();
  const theme = THEMES[current];

  const isDarkNav = current !== 'arctic' && current !== 'edit';

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
    </div>
  );
}
