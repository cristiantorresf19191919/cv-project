'use client';

import { useEffect } from 'react';
import { useTemplate } from '@/context/TemplateContext';
import { useLanguage } from '@/context/LanguageContext';
import { TemplateName } from '@/types/templates';

const KEY_MAP: Record<string, TemplateName> = {
  '1': 'noir',
  '2': 'arctic',
  '3': 'term',
  '4': 'edit',
  '5': 'neon',
  '6': 'glass',
  '7': 'exec',
  '8': 'mono',
  '9': 'ember',
  '0': 'midnight',
};

export default function KeyboardNav() {
  const { switchTemplate } = useTemplate();
  const { toggleLang } = useLanguage();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Ignore if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      // Number keys 0-9 switch templates
      if (KEY_MAP[e.key]) {
        e.preventDefault();
        switchTemplate(KEY_MAP[e.key]);
        return;
      }

      // L key toggles language
      if (e.key === 'l' || e.key === 'L') {
        e.preventDefault();
        toggleLang();
        return;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [switchTemplate, toggleLang]);

  return null;
}
