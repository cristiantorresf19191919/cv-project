'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { useTemplate } from '@/context/TemplateContext';
import { useLanguage } from '@/context/LanguageContext';
import { THEMES, TEMPLATE_LIST } from '@/data/themes';
import { TemplateName, TemplateInfo, TemplateCategory } from '@/types/templates';
import styles from '@/styles/switcher.module.css';

function CodeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function MonitorIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect width="20" height="14" x="2" y="3" rx="2" />
      <line x1="8" x2="16" y1="21" y2="21" />
      <line x1="12" x2="12" y1="17" y2="21" />
    </svg>
  );
}

function ChevronIcon({ className, open }: { className?: string; open?: boolean }) {
  return (
    <svg className={className} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)' }}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

const CATEGORY_LABELS: Record<TemplateCategory, string> = {
  dark: 'Dark themes',
  light: 'Light themes',
  special: 'Featured',
};

function groupByCategory(templates: TemplateInfo[]) {
  const groups: Record<TemplateCategory, TemplateInfo[]> = { dark: [], light: [], special: [] };
  for (const t of templates) {
    groups[t.category].push(t);
  }
  return groups;
}

export default function TemplateSwitcher() {
  const { current, switchTemplate } = useTemplate();
  const { lang, toggleLang } = useLanguage();
  const theme = THEMES[current];
  const [menuOpen, setMenuOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const isDarkNav = current !== 'arctic' && current !== 'edit' && current !== 'exec' && current !== 'mono' && current !== 'serene';
  const currentTemplate = TEMPLATE_LIST.find((t) => t.name === current);
  const grouped = groupByCategory(TEMPLATE_LIST);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    if (!menuOpen) return;
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (panelRef.current?.contains(target) || triggerRef.current?.contains(target)) return;
      closeMenu();
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') closeMenu();
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [menuOpen, closeMenu]);

  const handleSelect = (name: TemplateName) => {
    switchTemplate(name);
    closeMenu();
  };

  return (
    <div
      className={styles.switcher}
      style={{
        background: theme.navBg,
        ['--nav-fade' as string]: theme.navBg,
      }}
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

      <div className={styles.menuWrapper}>
        <button
          ref={triggerRef}
          type="button"
          className={`${styles.menuTrigger} ${isDarkNav ? styles.menuTriggerDark : styles.menuTriggerLight}`}
          onClick={() => setMenuOpen((o) => !o)}
          aria-expanded={menuOpen}
          aria-haspopup="listbox"
          aria-label="Choose template"
          style={{
            ['--accent' as string]: theme.accent,
            borderColor: menuOpen ? theme.accent : undefined,
          }}
        >
          <span
            className={styles.menuTriggerDot}
            style={{ background: currentTemplate?.dotColor ?? theme.accent }}
          />
          <span className={styles.menuTriggerLabel}>{currentTemplate?.label ?? 'Template'}</span>
          <ChevronIcon className={styles.menuTriggerChevron} open={menuOpen} />
        </button>

        <div
          ref={panelRef}
          className={`${styles.menuPanel} ${menuOpen ? styles.menuPanelOpen : ''} ${isDarkNav ? styles.menuPanelDark : styles.menuPanelLight}`}
          role="listbox"
          aria-label="Template list"
        >
          <div className={styles.menuInner}>
            {(['dark', 'light', 'special'] as const).map((cat) => {
              const items = grouped[cat];
              if (items.length === 0) return null;
              return (
                <div key={cat} className={styles.menuSection}>
                  <div className={styles.menuSectionLabel}>{CATEGORY_LABELS[cat]}</div>
                  <div className={styles.menuGrid}>
                    {items.map((tmpl) => {
                      const isActive = tmpl.name === current;
                      return (
                        <button
                          key={tmpl.name}
                          type="button"
                          role="option"
                          aria-selected={isActive}
                          className={`${styles.menuItem} ${isActive ? styles.menuItemActive : ''}`}
                          onClick={() => handleSelect(tmpl.name as TemplateName)}
                          title={`${tmpl.desc} (key: ${tmpl.shortcut})`}
                          style={{
                            ['--item-accent' as string]: tmpl.dotColor,
                            ['--item-glow' as string]: `${tmpl.dotColor}33`,
                          }}
                        >
                          <span className={styles.menuItemDot} style={{ background: tmpl.dotColor }} />
                          <span className={styles.menuItemLabel}>{tmpl.label}</span>
                          <span className={styles.menuItemShortcut}>{tmpl.shortcut}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className={styles.divider} />

      <button
        className={`${styles.langToggle} ${isDarkNav ? styles.langToggleDark : styles.langToggleLight}`}
        onClick={toggleLang}
        title="Toggle language (L)"
        style={{
          ['--lang-accent' as string]: theme.accent,
        }}
      >
        <span
          className={`${styles.langPill} ${lang === 'en' ? styles.langPillActive : ''}`}
          style={lang === 'en' ? { borderColor: theme.accent } : {}}
        >
          EN
        </span>
        <span
          className={`${styles.langPill} ${lang === 'es' ? styles.langPillActive : ''}`}
          style={lang === 'es' ? { borderColor: theme.accent } : {}}
        >
          ES
        </span>
      </button>

      <div
        className={`${styles.kbdHint} ${isDarkNav ? styles.kbdHintDark : styles.kbdHintLight}`}
        title="Use number keys 1-0 to switch templates"
      >
        <CodeIcon className={styles.kbdIcon} />
        <MonitorIcon className={styles.kbdIcon} />
        <span className={styles.kbdLabel}>switch</span>
      </div>
    </div>
  );
}
