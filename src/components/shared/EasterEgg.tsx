'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

/**
 * Konami Code Easter Egg: ↑ ↑ ↓ ↓ ← → ← → B A
 * Shows a celebration animation when triggered.
 */
const KONAMI = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'b', 'a',
];

const EMOJIS = ['🚀', '⚡', '🎯', '💎', '🔥', '✨', '🎉', '💫', '🌟', '⭐'];

function Particle({ emoji, index }: { emoji: string; index: number }) {
  const x = Math.random() * 100;
  const delay = index * 0.05;

  return (
    <motion.div
      initial={{ opacity: 1, y: 0, x: `${x}vw`, scale: 0.5, rotate: 0 }}
      animate={{
        opacity: [1, 1, 0],
        y: ['0vh', '-50vh', '-100vh'],
        scale: [0.5, 1.2, 0.3],
        rotate: [0, 180, 360],
      }}
      transition={{ duration: 2.5, delay, ease: 'easeOut' }}
      style={{
        position: 'fixed',
        bottom: '-10vh',
        fontSize: 'clamp(1.5rem, 4vw, 3rem)',
        zIndex: 100000,
        pointerEvents: 'none',
      }}
    >
      {emoji}
    </motion.div>
  );
}

export default function EasterEgg() {
  const [triggered, setTriggered] = useState(false);
  const bufferRef = useRef<string[]>([]);

  const check = useCallback((key: string) => {
    bufferRef.current.push(key);
    if (bufferRef.current.length > KONAMI.length) {
      bufferRef.current.shift();
    }
    if (bufferRef.current.length === KONAMI.length &&
        bufferRef.current.every((k, i) => k === KONAMI[i])) {
      setTriggered(true);
      bufferRef.current = [];
      setTimeout(() => setTriggered(false), 3500);
    }
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      // Ignore if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      check(e.key);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [check]);

  return (
    <AnimatePresence>
      {triggered && (
        <>
          {/* Overlay message */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 100001,
              background: 'rgba(0, 0, 0, 0.85)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '2rem 3rem',
              textAlign: 'center',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              pointerEvents: 'none',
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎮</div>
            <div style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 600, letterSpacing: '1px' }}>
              Achievement Unlocked!
            </div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
              You found the secret Konami code
            </div>
          </motion.div>

          {/* Flying emojis */}
          {Array.from({ length: 25 }, (_, i) => (
            <Particle
              key={i}
              emoji={EMOJIS[i % EMOJIS.length]}
              index={i}
            />
          ))}
        </>
      )}
    </AnimatePresence>
  );
}
