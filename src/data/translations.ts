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
  testimonials: string;
  testimonialsTag: string;
  educationTag: string;
  availableForHire: string;
  openToWork: string;
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
    testimonials: 'What People Say',
    testimonialsTag: 'Testimonials',
    educationTag: 'Learning',
    availableForHire: 'Available for Hire',
    openToWork: 'Open to Work',
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
    skills: 'Experiencia T\u00E9cnica',
    skillsTag: 'Mi Arsenal',
    experience: 'Trayectoria Profesional',
    experienceTag: 'Carrera',
    projects: 'Proyectos e Impacto',
    projectsTag: 'Trabajo Destacado',
    contact: 'Contacto',
    contactTag: 'Conectemos',
    education: 'Educaci\u00F3n',
    achievements: 'Logros Clave',
    profile: 'Perfil',
    interests: 'Intereses',
    about: 'Sobre M\u00ED',
    tools: 'Herramientas',
    services: 'Lo Que Hago',
    courses: 'Certificaciones',
    passions: 'Pasiones',
    testimonials: 'Lo Que Dicen',
    testimonialsTag: 'Testimonios',
    educationTag: 'Aprendizaje',
    availableForHire: 'Disponible para Contratar',
    openToWork: 'Abierto a Oportunidades',
    getInTouch: 'Contactar',
    viewGithub: 'Ver GitHub',
    viewProject: 'Ver Proyecto',
    downloadResume: 'Descargar CV',
    yearsExp: 'A\u00F1os de Experiencia',
    companies: 'Empresas',
    projectsDelivered: 'Proyectos Entregados',
    present: 'Presente',
    location: 'Ubicaci\u00F3n',
    phone: 'Tel\u00E9fono',
    email: 'Correo',
  },
};
