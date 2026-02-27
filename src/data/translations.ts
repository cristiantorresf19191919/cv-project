export type Lang = 'en' | 'es';

export interface Translations {
  // Section headers
  summary: string;
  skills: string;
  skillsTag: string;
  experience: string;
  experienceTag: string;
  projects: string;
  projectsTag: string;
  contact: string;
  contactTag: string;
  education: string;
  achievements: string;
  profile: string;
  interests: string;
  about: string;
  tools: string;
  services: string;
  courses: string;
  passions: string;
  // Buttons
  getInTouch: string;
  viewGithub: string;
  viewProject: string;
  downloadResume: string;
  // Stats
  yearsExp: string;
  companies: string;
  projectsDelivered: string;
  // Common
  present: string;
  location: string;
  phone: string;
  email: string;
}

export const translations: Record<Lang, Translations> = {
  en: {
    summary: 'Summary',
    skills: 'Technical Expertise',
    skillsTag: 'My Arsenal',
    experience: 'Professional Journey',
    experienceTag: 'Career Path',
    projects: 'Projects & Impact',
    projectsTag: 'Featured Work',
    contact: 'Get In Touch',
    contactTag: "Let's Connect",
    education: 'Education',
    achievements: 'Key Achievements',
    profile: 'Profile',
    interests: 'Interests',
    about: 'About Me',
    tools: 'Tools & Tech',
    services: 'What I Do',
    courses: 'Certifications',
    passions: 'Passions',
    getInTouch: 'Get In Touch',
    viewGithub: 'View GitHub',
    viewProject: 'View Project',
    downloadResume: 'Download Resume',
    yearsExp: 'Years Experience',
    companies: 'Companies',
    projectsDelivered: 'Projects Delivered',
    present: 'Present',
    location: 'Location',
    phone: 'Phone',
    email: 'Email',
  },
  es: {
    summary: 'Resumen',
    skills: 'Experiencia Técnica',
    skillsTag: 'Mi Arsenal',
    experience: 'Trayectoria Profesional',
    experienceTag: 'Carrera',
    projects: 'Proyectos e Impacto',
    projectsTag: 'Trabajo Destacado',
    contact: 'Contacto',
    contactTag: 'Conectemos',
    education: 'Educación',
    achievements: 'Logros Clave',
    profile: 'Perfil',
    interests: 'Intereses',
    about: 'Sobre Mí',
    tools: 'Herramientas',
    services: 'Lo Que Hago',
    courses: 'Certificaciones',
    passions: 'Pasiones',
    getInTouch: 'Contactar',
    viewGithub: 'Ver GitHub',
    viewProject: 'Ver Proyecto',
    downloadResume: 'Descargar CV',
    yearsExp: 'Años de Experiencia',
    companies: 'Empresas',
    projectsDelivered: 'Proyectos Entregados',
    present: 'Presente',
    location: 'Ubicación',
    phone: 'Teléfono',
    email: 'Correo',
  },
};
