'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTemplate } from '@/context/TemplateContext';
import { useLanguage } from '@/context/LanguageContext';
import { useContent } from '@/context/ContentContext';
import { TEMPLATE_LIST } from '@/data/themes';
import { TemplateName } from '@/types/templates';
import styles from '@/styles/command-palette.module.css';

interface PaletteItem {
  id: string;
  label: string;
  desc: string;
  icon: string;
  shortcut?: string;
  group: string;
  action: () => void;
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const { switchTemplate, current } = useTemplate();
  const { lang, toggleLang } = useLanguage();
  const { data } = useContent();

  // Build items list
  const items: PaletteItem[] = useMemo(() => {
    const list: PaletteItem[] = [];

    // Templates
    for (const tpl of TEMPLATE_LIST) {
      list.push({
        id: `tpl-${tpl.name}`,
        label: tpl.label,
        desc: tpl.name === current ? 'Currently active' : `Switch to ${tpl.label}`,
        icon: tpl.name === current ? '●' : '○',
        shortcut: tpl.shortcut,
        group: 'Templates',
        action: () => {
          switchTemplate(tpl.name as TemplateName);
          setOpen(false);
        },
      });
    }

    // Actions
    list.push({
      id: 'act-lang',
      label: lang === 'en' ? 'Switch to Spanish' : 'Cambiar a Inglés',
      desc: lang === 'en' ? 'Cambiar idioma a Español' : 'Switch language to English',
      icon: '🌐',
      shortcut: 'L',
      group: 'Actions',
      action: () => { toggleLang(); setOpen(false); },
    });

    list.push({
      id: 'act-pdf',
      label: lang === 'en' ? 'Download PDF' : 'Descargar PDF',
      desc: lang === 'en' ? 'Export current template as PDF' : 'Exportar plantilla actual como PDF',
      icon: '📄',
      group: 'Actions',
      action: async () => {
        setOpen(false);
        const { captureTemplatePDF } = await import('@/utils/captureTemplatePDF');
        await captureTemplatePDF(`${data.name}_${data.last}_${current}_Resume.pdf`);
      },
    });

    list.push({
      id: 'act-share',
      label: lang === 'en' ? 'Share Portfolio' : 'Compartir Portfolio',
      desc: lang === 'en' ? 'Copy link to clipboard' : 'Copiar enlace al portapapeles',
      icon: '🔗',
      group: 'Actions',
      action: () => {
        navigator.clipboard.writeText(window.location.href);
        setOpen(false);
      },
    });

    list.push({
      id: 'act-top',
      label: lang === 'en' ? 'Scroll to Top' : 'Ir al Inicio',
      desc: lang === 'en' ? 'Back to the top of the page' : 'Volver al inicio de la página',
      icon: '⬆',
      group: 'Actions',
      action: () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setOpen(false);
      },
    });

    list.push({
      id: 'act-github',
      label: 'GitHub',
      desc: data.github,
      icon: '🐙',
      group: 'Links',
      action: () => {
        window.open(`https://${data.github}`, '_blank');
        setOpen(false);
      },
    });

    list.push({
      id: 'act-linkedin',
      label: 'LinkedIn',
      desc: data.linkedin,
      icon: '💼',
      group: 'Links',
      action: () => {
        window.open(`https://${data.linkedin}`, '_blank');
        setOpen(false);
      },
    });

    list.push({
      id: 'act-email',
      label: lang === 'en' ? 'Send Email' : 'Enviar Email',
      desc: data.email,
      icon: '✉️',
      group: 'Links',
      action: () => {
        window.open(`mailto:${data.email}`, '_blank');
        setOpen(false);
      },
    });

    return list;
  }, [current, lang, switchTemplate, toggleLang, data]);

  // Filter items
  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter(
      (it) =>
        it.label.toLowerCase().includes(q) ||
        it.desc.toLowerCase().includes(q) ||
        it.group.toLowerCase().includes(q)
    );
  }, [items, query]);

  // Group filtered items
  const grouped = useMemo(() => {
    const map = new Map<string, PaletteItem[]>();
    for (const it of filtered) {
      const arr = map.get(it.group) || [];
      arr.push(it);
      map.set(it.group, arr);
    }
    return map;
  }, [filtered]);

  // Reset state when opening
  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Cmd+K / Ctrl+K to toggle
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  // Keyboard navigation within palette
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter' && filtered[activeIndex]) {
        e.preventDefault();
        filtered[activeIndex].action();
      }
    },
    [filtered, activeIndex]
  );

  // Keep active item in view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-index="${activeIndex}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  // Reset active index when query changes
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  if (!open) return null;

  let flatIdx = -1;

  return (
    <AnimatePresence>
      <motion.div
        className={styles.overlay}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        onClick={() => setOpen(false)}
      >
        <motion.div
          className={styles.palette}
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={handleKeyDown}
        >
          {/* Search */}
          <div className={styles.searchRow}>
            <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              ref={inputRef}
              className={styles.searchInput}
              placeholder="Search templates, actions..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoComplete="off"
              spellCheck={false}
            />
            <span className={styles.escHint}>ESC</span>
          </div>

          {/* Results */}
          <div className={styles.results} ref={listRef}>
            {filtered.length === 0 && (
              <div className={styles.empty}>No results found</div>
            )}
            {Array.from(grouped.entries()).map(([group, groupItems]) => (
              <div key={group}>
                <div className={styles.groupLabel}>{group}</div>
                {groupItems.map((item) => {
                  flatIdx++;
                  const idx = flatIdx;
                  return (
                    <button
                      key={item.id}
                      data-index={idx}
                      className={`${styles.item} ${activeIndex === idx ? styles.itemActive : ''}`}
                      onClick={item.action}
                      onMouseEnter={() => setActiveIndex(idx)}
                    >
                      <div className={styles.itemIcon}>{item.icon}</div>
                      <div className={styles.itemText}>
                        <div className={styles.itemLabel}>{item.label}</div>
                        <div className={styles.itemDesc}>{item.desc}</div>
                      </div>
                      {item.shortcut && (
                        <span className={styles.itemShortcut}>{item.shortcut}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Footer hints */}
          <div className={styles.footer}>
            <span>
              <span className={styles.footerKey}>↑</span>
              <span className={styles.footerKey}>↓</span>
              navigate
            </span>
            <span>
              <span className={styles.footerKey}>↵</span>
              select
            </span>
            <span>
              <span className={styles.footerKey}>esc</span>
              close
            </span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
