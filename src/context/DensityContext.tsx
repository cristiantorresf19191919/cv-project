'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

type Density = 'detailed' | 'compact';

interface DensityContextValue {
  density: Density;
  toggleDensity: () => void;
  isCompact: boolean;
}

const DensityContext = createContext<DensityContextValue>({
  density: 'detailed',
  toggleDensity: () => {},
  isCompact: false,
});

export const useDensity = () => useContext(DensityContext);

export function DensityProvider({ children }: { children: React.ReactNode }) {
  const [density, setDensity] = useState<Density>('detailed');

  const toggleDensity = useCallback(() => {
    setDensity(prev => prev === 'detailed' ? 'compact' : 'detailed');
  }, []);

  return (
    <DensityContext.Provider value={{ density, toggleDensity, isCompact: density === 'compact' }}>
      {children}
    </DensityContext.Provider>
  );
}
