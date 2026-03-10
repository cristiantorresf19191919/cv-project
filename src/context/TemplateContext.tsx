'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { TemplateName } from '@/types/templates';
import { THEMES, TEMPLATE_LIST } from '@/data/themes';
import { Analytics } from '@/utils/analytics';

const VALID_TEMPLATES = new Set<string>(TEMPLATE_LIST.map((t) => t.name));

function getTemplateFromURL(): TemplateName {
  if (typeof window === 'undefined') return 'noir';
  const params = new URLSearchParams(window.location.search);
  const t = params.get('t');
  if (t && VALID_TEMPLATES.has(t)) return t as TemplateName;
  return 'noir';
}

function updateURL(name: TemplateName) {
  const url = new URL(window.location.href);
  if (name === 'noir') {
    url.searchParams.delete('t');
  } else {
    url.searchParams.set('t', name);
  }
  window.history.pushState({}, '', url.toString());
}

interface TemplateContextValue {
  current: TemplateName;
  isTransitioning: boolean;
  switchTemplate: (name: TemplateName) => void;
}

const TemplateContext = createContext<TemplateContextValue>({
  current: 'noir',
  isTransitioning: false,
  switchTemplate: () => {},
});

export function useTemplate(): TemplateContextValue {
  return useContext(TemplateContext);
}

export function TemplateProvider({ children }: { children: React.ReactNode }) {
  const [current, setCurrent] = useState<TemplateName>('noir');
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Read template from URL on mount
  useEffect(() => {
    setCurrent(getTemplateFromURL());
  }, []);

  // Handle browser back/forward
  useEffect(() => {
    const onPopState = () => setCurrent(getTemplateFromURL());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    const theme = THEMES[current];
    document.body.style.background = theme.bg;

    // Dynamic page title
    const info = TEMPLATE_LIST.find((t) => t.name === current);
    const label = info?.label ?? current;
    document.title = `Cristian Torres | ${label}`;

    // Track template view
    Analytics.templateView(current);
  }, [current]);

  const switchTemplate = useCallback((name: TemplateName) => {
    if (name === current || isTransitioning) return;
    setIsTransitioning(true);

    // Allow AnimatePresence exit animation to play
    setTimeout(() => {
      setCurrent(name);
      updateURL(name);
      setIsTransitioning(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 250);
  }, [current, isTransitioning]);

  return (
    <TemplateContext.Provider value={{ current, isTransitioning, switchTemplate }}>
      {children}
    </TemplateContext.Provider>
  );
}
