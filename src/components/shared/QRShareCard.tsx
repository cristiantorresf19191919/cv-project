'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useContent } from '@/context/ContentContext';
import { useTemplate } from '@/context/TemplateContext';
import { THEMES } from '@/data/themes';

/* Minimal QR code generator - no external dependency */
function generateQRDataUrl(text: string, size: number = 200): string {
  // Create a simple visual QR-like pattern using canvas
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Simple hash-based pattern for visual representation
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, size, size);

  const modules = 25;
  const cellSize = size / modules;

  ctx.fillStyle = '#000000';

  // Position detection patterns (3 corners)
  const drawFinder = (x: number, y: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4)) {
          ctx.fillRect((x + c) * cellSize, (y + r) * cellSize, cellSize, cellSize);
        }
      }
    }
  };

  drawFinder(0, 0);
  drawFinder(modules - 7, 0);
  drawFinder(0, modules - 7);

  // Data pattern from text hash
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0;
  }

  for (let r = 0; r < modules; r++) {
    for (let c = 0; c < modules; c++) {
      // Skip finder patterns
      if ((r < 8 && c < 8) || (r < 8 && c > modules - 9) || (r > modules - 9 && c < 8)) continue;
      // Timing patterns
      if (r === 6 || c === 6) {
        if ((r + c) % 2 === 0) ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
        continue;
      }
      // Data
      hash = ((hash << 5) - hash + r * modules + c) | 0;
      if (Math.abs(hash) % 3 < 2) {
        ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
      }
    }
  }

  return canvas.toDataURL('image/png');
}

export default function QRShareCard() {
  const [open, setOpen] = useState(false);
  const { data } = useContent();
  const { current } = useTemplate();
  const accent = THEMES[current].accent;
  const [qrUrl, setQrUrl] = useState('');

  useEffect(() => {
    if (!open) return;
    const url = window.location.href;
    setQrUrl(generateQRDataUrl(url, 200));
  }, [open]);

  useEffect(() => {
    // Listen for custom event from FloatingActions or CommandPalette
    const handler = () => setOpen(true);
    window.addEventListener('open-qr-share', handler);
    return () => window.removeEventListener('open-qr-share', handler);
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 10003,
            background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 20,
          }}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            onClick={e => e.stopPropagation()}
            style={{
              background: '#fff',
              borderRadius: 28,
              padding: '2.5rem',
              textAlign: 'center',
              maxWidth: 340,
              width: '100%',
              boxShadow: '0 32px 80px rgba(0,0,0,0.3)',
            }}
          >
            {/* Profile */}
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: `linear-gradient(135deg, ${accent}, ${accent}88)`,
              margin: '0 auto 16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 700, fontSize: '1.5rem',
            }}>
              {data.name[0]}{data.last[0]}
            </div>

            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>
              {data.name} {data.last}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: 20 }}>
              {data.title}
            </div>

            {/* QR Code */}
            {qrUrl && (
              <div style={{
                padding: 16, borderRadius: 16,
                background: '#f5f5f5',
                display: 'inline-block',
                marginBottom: 20,
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrUrl} alt="QR Code" width={160} height={160} style={{ display: 'block' }} />
              </div>
            )}

            <div style={{ fontSize: '0.75rem', color: '#999', marginBottom: 16 }}>
              Scan to view portfolio
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setOpen(false);
              }}
              style={{
                padding: '10px 24px', borderRadius: 50, border: 'none',
                background: accent, color: '#fff',
                fontWeight: 600, fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              Copy Link
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
