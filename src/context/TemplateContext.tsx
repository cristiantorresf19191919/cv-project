'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { TemplateName } from '@/types/templates';
import { THEMES, TEMPLATE_LIST } from '@/data/themes';
import { Analytics } from '@/utils/analytics';

const VALID_TEMPLATES = new Set<string>(TEMPLATE_LIST.map((t) => t.name));

/* Bare visits (no ?t=) land on a weighted-random template — the showcase
   pieces (lumina, noir) surface most often, every other template still
   gets airtime. */
const RANDOM_WEIGHTS: Partial<Record<TemplateName, number>> = {
  lumina: 8,
  noir: 5,
};
const BASE_WEIGHT = 1;

// One roll per page load — back/forward within the session stays stable.
let sessionPick: TemplateName | null = null;

function pickRandomTemplate(): TemplateName {
  if (sessionPick) return sessionPick;
  const entries = TEMPLATE_LIST.map(
    (t) => [t.name, RANDOM_WEIGHTS[t.name] ?? BASE_WEIGHT] as const
  );
  const total = entries.reduce((sum, [, w]) => sum + w, 0);
  let roll = Math.random() * total;
  for (const [name, weight] of entries) {
    roll -= weight;
    if (roll <= 0) {
      sessionPick = name;
      return name;
    }
  }
  sessionPick = entries[entries.length - 1][0];
  return sessionPick;
}

function getTemplateFromURL(): TemplateName {
  if (typeof window === 'undefined') return 'noir';
  const params = new URLSearchParams(window.location.search);
  const t = params.get('t');
  if (t && VALID_TEMPLATES.has(t)) return t as TemplateName;
  return pickRandomTemplate();
}

function updateURL(name: TemplateName) {
  const url = new URL(window.location.href);
  // Always write the param — a deliberately chosen template must survive
  // refresh; only bare visits re-roll the random pick.
  url.searchParams.set('t', name);
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
