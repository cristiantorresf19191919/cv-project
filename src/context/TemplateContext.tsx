'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { TemplateName } from '@/types/templates';
import { THEMES, TEMPLATE_LIST } from '@/data/themes';
import { Analytics } from '@/utils/analytics';

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
      setIsTransitioning(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 350);
  }, [current, isTransitioning]);

  return (
    <TemplateContext.Provider value={{ current, isTransitioning, switchTemplate }}>
      {children}
    </TemplateContext.Provider>
  );
}
