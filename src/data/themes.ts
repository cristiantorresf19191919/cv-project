import { TemplateName, ThemeConfig, TemplateInfo, TemplateCategory } from '@/types/templates';

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
    bg: 'linear-gradient(165deg, #0f0c1e 0%, #1a1535 50%, #2a1f2e 100%)',
    navBg: 'rgba(15,12,30,0.85)',
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
  serene: {
    bg: '#f5f4f0',
    navBg: 'rgba(245,244,240,0.94)',
    navText: '#6b7280',
    accent: '#5a7c59',
    labelColor: 'rgba(0,0,0,0.35)',
  },
  horizon: {
    bg: '#1a1a1a',
    navBg: 'rgba(26,26,26,0.94)',
    navText: 'rgba(255,255,255,0.45)',
    accent: '#e07c5a',
    labelColor: 'rgba(255,255,255,0.35)',
  },
};

const DARK: TemplateCategory = 'dark';
const LIGHT: TemplateCategory = 'light';
const SPECIAL: TemplateCategory = 'special';

export const TEMPLATE_LIST: TemplateInfo[] = [
  { name: 'noir', label: 'Noir Elegance', dotColor: '#d4af37', desc: 'Luxury dark theme with gold accents', shortcut: '1', category: DARK },
  { name: 'arctic', label: 'Arctic Minimal', dotColor: '#6366f1', desc: 'Clean & professional light design', shortcut: '2', category: LIGHT },
  { name: 'term', label: 'Terminal Hacker', dotColor: '#00ff41', desc: 'Retro terminal for tech teams', shortcut: '3', category: DARK },
  { name: 'edit', label: 'Editorial Luxe', dotColor: '#c9a96e', desc: 'Magazine-style editorial layout', shortcut: '4', category: LIGHT },
  { name: 'neon', label: 'Neon Cyber', dotColor: '#ff0080', desc: 'Bold cyberpunk neon aesthetic', shortcut: '5', category: DARK },
  { name: 'glass', label: 'Glassmorphism', dotColor: '#764ba2', desc: 'Modern frosted glass design', shortcut: '6', category: SPECIAL },
  { name: 'exec', label: 'Executive Pro', dotColor: '#2563eb', desc: 'Corporate sidebar with timeline', shortcut: '7', category: LIGHT },
  { name: 'mono', label: 'Monochrome Split', dotColor: '#000000', desc: 'Bold B&W split-screen layout', shortcut: '8', category: LIGHT },
  { name: 'ember', label: 'Dark Ember', dotColor: '#f97316', desc: 'Warm dark theme with skill bars', shortcut: '9', category: DARK },
  { name: 'midnight', label: 'Midnight Portfolio', dotColor: '#06b6d4', desc: 'Three-column deep space design', shortcut: '0', category: DARK },
  { name: 'serene', label: 'Serene Bento', dotColor: '#5a7c59', desc: 'Light bento-grid with sage & cream', shortcut: '-', category: LIGHT },
  { name: 'horizon', label: 'Horizon', dotColor: '#e07c5a', desc: 'Bold minimal with strong typography', shortcut: '=', category: DARK },
];
