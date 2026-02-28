export interface Stat {
  n: string;
  l: string;
}

export interface Skill {
  ico: string;
  t: string;
  tags: string[];
}

export interface Experience {
  t: string;
  co: string;
  dt: string;
  d: string;
  a: string[];
  tech: string[];
}

export interface Project {
  title: string;
  desc: string;
  url: string;
  image: string;
  tech: string[];
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
}

export interface Education {
  degree: string;
  school: string;
  date: string;
  desc?: string;
}

export interface PortfolioData {
  name: string;
  last: string;
  title: string;
  tagline: string;
  desc: string;
  email: string;
  phone: string;
  github: string;
  linkedin: string;
  loc: string;
  availability: string;
  stats: Stat[];
  skills: Skill[];
  exp: Experience[];
  projects: Project[];
  testimonials: Testimonial[];
  education: Education[];
}

export interface PortfolioContent {
  data: PortfolioData;
  photoUrl: string;
}
