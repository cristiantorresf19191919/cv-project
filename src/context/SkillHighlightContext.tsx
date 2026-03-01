'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface SkillHighlightState {
  activeSkill: string | null;
  setActiveSkill: (skill: string | null) => void;
}

const SkillHighlightContext = createContext<SkillHighlightState>({
  activeSkill: null,
  setActiveSkill: () => {},
});

export function SkillHighlightProvider({ children }: { children: ReactNode }) {
  const [activeSkill, setActiveSkill] = useState<string | null>(null);
  return (
    <SkillHighlightContext.Provider value={{ activeSkill, setActiveSkill }}>
      {children}
    </SkillHighlightContext.Provider>
  );
}

export function useSkillHighlight() {
  return useContext(SkillHighlightContext);
}
