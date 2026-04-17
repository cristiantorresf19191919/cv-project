'use client';

import { useDensity } from '@/context/DensityContext';
import { useTemplate } from '@/context/TemplateContext';
import { THEMES } from '@/data/themes';

export default function ContentDensityToggle() {
  const { density, toggleDensity } = useDensity();
  const { current } = useTemplate();
  const accent = THEMES[current].accent;

  return (
    <button
      onClick={toggleDensity}
      title={density === 'detailed' ? 'Switch to compact view' : 'Switch to detailed view'}
      aria-label={`Content density: ${density}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 10px',
        borderRadius: 8,
        border: '1px solid rgba(255,255,255,0.1)',
        background: 'rgba(255,255,255,0.04)',
        color: 'rgba(255,255,255,0.5)',
        fontSize: '0.68rem',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.2s',
        letterSpacing: '0.3px',
      }}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={density === 'compact' ? accent : 'currentColor'} strokeWidth="2" strokeLinecap="round">
        {density === 'detailed' ? (
          <>
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </>
        ) : (
          <>
            <line x1="3" y1="8" x2="21" y2="8" />
            <line x1="3" y1="16" x2="21" y2="16" />
          </>
        )}
      </svg>
      {density === 'detailed' ? 'Detailed' : 'Compact'}
    </button>
  );
}
