import { TemplateName, ThemeConfig, TemplateInfo } from '@/types/templates';

export const THEMES: Record<TemplateName, ThemeConfig> = {
  noir: {
    bg: '#0a0a0a',
    navBg: 'rgba(10,10,10,0.88)',
    navText: 'rgba(255,255,255,0.45)',
    accent: '#d4af37',
    labelColor: 'rgba(255,255,255,0.35)',
  },
  arctic: {
    bg: '#f7f8fc',
    navBg: 'rgba(247,248,252,0.92)',
    navText: '#94a3b8',
    accent: '#6366f1',
    labelColor: 'rgba(0,0,0,0.3)',
  },
  term: {
    bg: '#0c0c0c',
    navBg: 'rgba(12,12,12,0.92)',
    navText: 'rgba(255,255,255,0.45)',
    accent: '#00ff41',
    labelColor: 'rgba(0,255,65,0.35)',
  },
  edit: {
    bg: '#faf8f5',
    navBg: 'rgba(250,248,245,0.92)',
    navText: '#999',
    accent: '#c9a96e',
    labelColor: 'rgba(0,0,0,0.3)',
  },
  neon: {
    bg: '#0a0015',
    navBg: 'rgba(10,0,21,0.92)',
    navText: 'rgba(255,255,255,0.45)',
    accent: '#ff0080',
    labelColor: 'rgba(255,255,255,0.35)',
  },
  glass: {
    bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    navBg: 'rgba(60,40,100,0.75)',
    navText: 'rgba(255,255,255,0.45)',
    accent: '#764ba2',
    labelColor: 'rgba(255,255,255,0.35)',
  },
  exec: {
    bg: '#f0f2f5',
    navBg: 'rgba(240,242,245,0.92)',
    navText: '#94a3b8',
    accent: '#2563eb',
    labelColor: 'rgba(0,0,0,0.3)',
  },
  mono: {
    bg: '#ffffff',
    navBg: 'rgba(255,255,255,0.92)',
    navText: '#999',
    accent: '#000000',
    labelColor: 'rgba(0,0,0,0.3)',
  },
  ember: {
    bg: '#0f1117',
    navBg: 'rgba(15,17,23,0.92)',
    navText: 'rgba(255,255,255,0.45)',
    accent: '#f97316',
    labelColor: 'rgba(249,115,22,0.35)',
  },
  midnight: {
    bg: '#0d1117',
    navBg: 'rgba(13,17,23,0.92)',
    navText: 'rgba(255,255,255,0.45)',
    accent: '#06b6d4',
    labelColor: 'rgba(6,182,212,0.35)',
  },
};

export const TEMPLATE_LIST: TemplateInfo[] = [
  { name: 'noir', label: 'Noir Elegance', dotColor: '#d4af37' },
  { name: 'arctic', label: 'Arctic Minimal', dotColor: '#6366f1' },
  { name: 'term', label: 'Terminal Hacker', dotColor: '#00ff41' },
  { name: 'edit', label: 'Editorial Luxe', dotColor: '#c9a96e' },
  { name: 'neon', label: 'Neon Cyber', dotColor: '#ff0080' },
  { name: 'glass', label: 'Glassmorphism', dotColor: '#764ba2' },
  { name: 'exec', label: 'Executive Pro', dotColor: '#2563eb' },
  { name: 'mono', label: 'Monochrome Split', dotColor: '#000000' },
  { name: 'ember', label: 'Dark Ember', dotColor: '#f97316' },
  { name: 'midnight', label: 'Midnight Portfolio', dotColor: '#06b6d4' },
];
