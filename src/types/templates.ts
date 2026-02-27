export type TemplateName = 'noir' | 'arctic' | 'term' | 'edit' | 'neon' | 'glass' | 'exec' | 'mono' | 'ember' | 'midnight';

export interface ThemeConfig {
  bg: string;
  navBg: string;
  navText: string;
  accent: string;
  labelColor: string;
}

export interface TemplateInfo {
  name: TemplateName;
  label: string;
  dotColor: string;
}
