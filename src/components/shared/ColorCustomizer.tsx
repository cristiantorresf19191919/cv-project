'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTemplate } from '@/context/TemplateContext';
import { THEMES } from '@/data/themes';

const PRESETS = [
  '#d4af37', '#6366f1', '#00e676', '#ff2d78', '#2563eb', '#f97316',
  '#06b6d4', '#5a7c59', '#e07c5a', '#c084fc', '#ef4444', '#22d3a7',
  '#ff6ec7', '#4fc3f7', '#b45309', '#ec4899', '#14b8a6', '#f5a623',
];

interface Ripple {
  color: string;
  x: number;
  y: number;
  key: number;
}

export default function ColorCustomizer() {
  const [open, setOpen] = useState(false);
  const { current } = useTemplate();
  const defaultAccent = THEMES[current].accent;
  const [customColor, setCustomColor] = useState<string | null>(null);
  const [ripple, setRipple] = useState<Ripple | null>(null);

  const activeColor = customColor || defaultAccent;

  /* The template root carries the accent CSS vars. It lives inside
     [data-pdf-template]; the wrapper's firstElementChild is the TL;DR bar,
     NOT the template — targeting that silently broke recolouring. */
  const getTemplateRoot = (): HTMLElement | null => {
    const holder = document.querySelector('[data-pdf-template]');
    return (holder?.firstElementChild as HTMLElement | null) ?? null;
  };

  const spawnRipple = (color: string, origin?: { x: number; y: number }) => {
    const x = origin?.x ?? window.innerWidth - 120;
    const y = origin?.y ?? 60;
    setRipple({ color, x, y, key: Date.now() });
  };

  const applyColor = (color: string, ev?: { clientX: number; clientY: number }) => {
    const tpl = getTemplateRoot();
    if (!tpl) return;
    tpl.style.setProperty('--a', color);
    tpl.style.setProperty('--accent', color);
    tpl.style.setProperty('--al', color + '99');
    setCustomColor(color);
    spawnRipple(color, ev ? { x: ev.clientX, y: ev.clientY } : undefined);
  };

  const reset = () => {
    const tpl = getTemplateRoot();
    if (!tpl) return;
    tpl.style.removeProperty('--a');
    tpl.style.removeProperty('--accent');
    tpl.style.removeProperty('--al');
    setCustomColor(null);
    spawnRipple(defaultAccent);
  };

  // Circle must grow from origin to cover the whole viewport.
  const coverScale = ripple
    ? (Math.hypot(window.innerWidth, window.innerHeight) * 2) / 48 + 1
    : 1;

  return (
    <div style={{ position: 'relative', display: 'inline-flex' }}>
      <button
        onClick={() => setOpen((o) => !o)}
        title="Customize accent color"
        aria-label="Customize accent color"
        aria-expanded={open}
        style={{
          width: 30,
          height: 30,
          borderRadius: '50%',
          border: '2px solid rgba(255,255,255,0.22)',
          background: 'conic-gradient(from 0deg, #ef4444, #f59e0b, #22c55e, #06b6d4, #6366f1, #a855f7, #ef4444)',
          boxShadow: open ? `0 0 0 3px ${activeColor}55` : 'none',
          cursor: 'pointer',
          transition: 'box-shadow 0.2s, transform 0.2s',
          transform: open ? 'scale(1.06)' : 'scale(1)',
          position: 'relative',
        }}
      >
        <span
          style={{
            position: 'absolute',
            inset: 8,
            borderRadius: '50%',
            background: activeColor,
            boxShadow: 'inset 0 0 0 1.5px rgba(255,255,255,0.55)',
          }}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -8 }}
            transition={{ type: 'spring', stiffness: 420, damping: 30 }}
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: 14,
              background: 'linear-gradient(180deg, #1c1c2c 0%, #14141f 100%)',
              borderRadius: 20,
              padding: 18,
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow: '0 24px 60px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06)',
              width: 264,
              zIndex: 220,
            }}
          >
            {/* gradient hairline accent along the top */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 20,
                right: 20,
                height: 2,
                borderRadius: 2,
                background: `linear-gradient(90deg, transparent, ${activeColor}, transparent)`,
                opacity: 0.9,
              }}
            />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'rgba(255,255,255,0.55)', letterSpacing: 1.4, textTransform: 'uppercase' }}>
                Accent color
              </span>
              {customColor && (
                <button
                  onClick={reset}
                  style={{
                    fontSize: '0.66rem',
                    fontWeight: 600,
                    color: 'rgba(255,255,255,0.45)',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 8,
                    padding: '3px 9px',
                    cursor: 'pointer',
                  }}
                >
                  Reset
                </button>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 9, marginBottom: 16 }}>
              {PRESETS.map((c, i) => {
                const selected = activeColor.toLowerCase() === c.toLowerCase();
                return (
                  <motion.button
                    key={c}
                    onClick={(e) => applyColor(c, { clientX: e.clientX, clientY: e.clientY })}
                    aria-label={`Color ${c}`}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.015, type: 'spring', stiffness: 500, damping: 24 }}
                    whileHover={{ scale: 1.18, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 10,
                      border: 'none',
                      background: c,
                      cursor: 'pointer',
                      boxShadow: selected
                        ? `0 0 0 2px #14141f, 0 0 0 4px ${c}, 0 4px 12px ${c}66`
                        : `0 2px 8px ${c}44`,
                      position: 'relative',
                    }}
                  >
                    {selected && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={pickInk(c)} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', inset: 0, margin: 'auto' }}>
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    )}
                  </motion.button>
                );
              })}
            </div>

            <div
              style={{
                display: 'flex',
                gap: 10,
                alignItems: 'center',
                padding: 8,
                borderRadius: 12,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <label style={{ position: 'relative', width: 34, height: 34, flexShrink: 0, cursor: 'pointer' }}>
                <span
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: 9,
                    background: activeColor,
                    boxShadow: 'inset 0 0 0 1.5px rgba(255,255,255,0.35)',
                  }}
                />
                <input
                  type="color"
                  value={activeColor}
                  onChange={(e) => applyColor(e.target.value)}
                  style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                />
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.25 }}>
                <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', letterSpacing: 0.5, textTransform: 'uppercase' }}>
                  Custom
                </span>
                <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.85)', fontFamily: 'var(--font-space-mono, monospace)', fontWeight: 600 }}>
                  {activeColor.toUpperCase()}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Radial "apply" reveal — grows from the picked swatch, fills the
          screen with the colour, then fades to reveal the recoloured template. */}
      <AnimatePresence>
        {ripple && (
          <motion.div
            key={ripple.key}
            style={{ position: 'fixed', inset: 0, zIndex: 9998, pointerEvents: 'none', overflow: 'hidden' }}
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.span
              style={{
                position: 'absolute',
                left: ripple.x - 24,
                top: ripple.y - 24,
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: ripple.color,
                willChange: 'transform, opacity',
              }}
              initial={{ scale: 0, opacity: 0.85 }}
              animate={{ scale: [0, coverScale, coverScale], opacity: [0.85, 0.8, 0] }}
              transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1], times: [0, 0.5, 1] }}
              onAnimationComplete={() => setRipple(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Contrasting check-mark ink for a swatch. */
function pickInk(hex: string): string {
  const m = hex.trim().match(/^#?([0-9a-f]{6})$/i);
  if (!m) return '#fff';
  const n = parseInt(m[1], 16);
  const lum = (0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
  return lum > 0.6 ? '#0a0a0a' : '#ffffff';
}
