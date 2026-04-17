'use client';

import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTemplate } from '@/context/TemplateContext';
import { THEMES } from '@/data/themes';
import { Project } from '@/types/content';

/* ── Context for opening modal from any template ─── */
interface ProjectModalCtx {
  openProject: (project: Project) => void;
}

const Ctx = createContext<ProjectModalCtx>({ openProject: () => {} });
export const useProjectModal = () => useContext(Ctx);

const DARK = new Set(['noir', 'term', 'neon', 'ember', 'midnight', 'horizon', 'glass', 'aurora', 'retro', 'blueprint', 'cosmic']);

export function ProjectModalProvider({ children }: { children: React.ReactNode }) {
  const [project, setProject] = useState<Project | null>(null);
  const { current } = useTemplate();
  const accent = THEMES[current].accent;
  const isDark = DARK.has(current);

  const openProject = useCallback((p: Project) => setProject(p), []);

  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setProject(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [project]);

  return (
    <Ctx.Provider value={{ openProject }}>
      {children}

      <AnimatePresence>
        {project && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setProject(null)}
            style={{
              position: 'fixed', inset: 0, zIndex: 10002,
              background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 20,
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              onClick={e => e.stopPropagation()}
              style={{
                background: isDark ? '#12121f' : '#fafafa',
                borderRadius: 28,
                padding: '3rem',
                maxWidth: 640,
                width: '100%',
                maxHeight: '85vh',
                overflow: 'auto',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
                boxShadow: '0 32px 80px rgba(0,0,0,0.4)',
              }}
            >
              {/* Close */}
              <button
                onClick={() => setProject(null)}
                style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)', cursor: 'pointer', fontSize: '1.5rem' }}
              >
                &times;
              </button>

              {/* Project icon */}
              <div style={{
                width: 56, height: 56, borderRadius: 16, background: `${accent}15`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24,
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.8" strokeLinecap="round">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                </svg>
              </div>

              <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: isDark ? '#f0f0f0' : '#1a1a1a', marginBottom: 8, letterSpacing: '-0.5px' }}>
                {project.title}
              </h2>

              <p style={{ fontSize: '1rem', lineHeight: 1.8, color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)', marginBottom: 24 }}>
                {project.desc}
              </p>

              {/* Tech stack */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase' as const, color: accent, marginBottom: 12 }}>
                  Tech Stack
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {project.tech.map((t, i) => (
                    <span key={i} style={{
                      padding: '6px 14px', borderRadius: 8,
                      background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                      border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
                      fontSize: '0.82rem', fontWeight: 500,
                      color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
                    }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '12px 28px', borderRadius: 50,
                  background: accent, color: isDark ? '#0d1117' : '#fff',
                  fontWeight: 600, fontSize: '0.9rem',
                  textDecoration: 'none',
                  boxShadow: `0 4px 16px ${accent}30`,
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
                </svg>
                View Project
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Ctx.Provider>
  );
}
