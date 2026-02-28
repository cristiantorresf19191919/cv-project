import { PortfolioData } from '@/types/content';

export const DEFAULT_DATA: PortfolioData = {
  name: "Cristian",
  last: "Torres",
  title: "Full Stack Developer",
  tagline: "React & Next.js Specialist",
  desc: "React / Next.js specialist with 5+ years building performant web products. Expert in modern TypeScript and React-based UI systems with Storybook and React Query. Strong backend experience with Node.js and Nest.js micro-services, designing scalable APIs and integrating with GraphQL backends. Comfortable shipping Dockerized apps and ensuring end-to-end performance. Recently expanding my toolkit with Kotlin + Spring Boot.",
  email: "cristian.torres19@hotmail.com",
  phone: "+57 323 799 2985",
  github: "github.com/cristianscript",
  linkedin: "linkedin.com/in/cristian-torres-dev",
  loc: "Bogota, Colombia",
  availability: "open",
  stats: [
    { n: "5+", l: "Years Experience" },
    { n: "4", l: "Companies" },
    { n: "20+", l: "Projects Delivered" }
  ],
  skills: [
    {
      ico: "\u269B\uFE0F",
      t: "Frontend Development",
      tags: ["React", "Next.js", "TypeScript", "Gatsby", "Storybook", "Material UI", "Zustand", "React Query", "Webpack", "UI/UX from Figma"]
    },
    {
      ico: "\uD83D\uDE80",
      t: "Backend Development",
      tags: ["Node.js", "Nest.js", "Express.js", "GraphQL", "REST APIs", "Kotlin", "Spring Boot", "Microservices"]
    },
    {
      ico: "\uD83D\uDCBE",
      t: "Database & Infrastructure",
      tags: ["PostgreSQL", "Redis", "Docker", "CI/CD", "Git", "Monorepo (Lerna)", "Changesets"]
    },
    {
      ico: "\uD83D\uDD27",
      t: "Testing & Integrations",
      tags: ["Jest", "React Testing Library", "Playwright", "Chromatic", "Auth0", "Optimizely", "Contentful", "Google Solar SDK"]
    }
  ],
  exp: [
    {
      t: "React Developer",
      co: "Driveway.com",
      dt: "Jan 2025 \u2014 Present",
      d: "Building and refining screens in Next.js 13 (App Router) with TypeScript, focusing on performance and DX in a large-scale automotive platform.",
      a: [
        "Managed server/cache state with React Query (queries, mutations, optimistic updates) and lean local state",
        "Wired Auth0 for secure login, RBAC, route guards, and session handling with middleware",
        "Toggled features safely in prod using Optimizely (flags, gradual rollouts, kill-switches)",
        "Established a Material UI (MUI)-based Design System: tokens, theming, dark mode, accessible components, Storybook docs",
        "Managed a monorepo (Lerna) to share UI packages, hooks, and configs, with versioning via Changesets",
        "Improved Core Web Vitals with image optimization, code-splitting, and caching",
        "Delivered backend stories using Kotlin + Spring Boot in a microservice architecture, integrating PostgreSQL and third-party APIs"
      ],
      tech: ["Next.js", "TypeScript", "React Query", "Auth0", "MUI", "Kotlin", "Spring Boot", "Lerna"]
    },
    {
      t: "React & Node.js Developer",
      co: "Audi",
      dt: "Jan 2022 \u2014 Dec 2024",
      d: "Built and managed Node.js + GraphQL services across the Audi charging ecosystem, improving API reliability and performance.",
      a: [
        "Developed a charging-history UI in Next.js + TypeScript with responsive layout, client caching, and cursor-based pagination",
        "Implemented aggregated GraphQL queries with Base64 caching, cutting server load and speeding cursor navigation",
        "Engineered workflows ensuring an Audi vehicle can initiate a charging session, with transactions reflected seamlessly across services",
        "Introduced Redis caching for session state, reducing latency and offloading repeated GraphQL queries",
        "Designed and scheduled cron jobs to sync session statuses, process retries, and maintain data consistency",
        "Partnered with cross-functional teams (Product, Design, Backend) to craft dynamic user interfaces"
      ],
      tech: ["Next.js", "TypeScript", "Node.js", "GraphQL", "Redis", "Docker", "PostgreSQL"]
    },
    {
      t: "React + AEM Frontend Developer",
      co: "TD SYNNEX",
      dt: "Jul 2021 \u2014 Dec 2021",
      d: "Developed and maintained web applications using React and Adobe Experience Manager for enterprise clients.",
      a: [
        "Collaborated with backend developers, designers, and project managers to deliver high-quality solutions",
        "Implemented responsive design, accessibility, performance optimization, and SEO best practices",
        "Leveraged Zustand to build a robust state management system that enabled complex business solutions",
        "Stayed updated with the latest trends and technologies in frontend development"
      ],
      tech: ["React", "AEM", "Zustand", "Git", "Jira"]
    },
    {
      t: "React Developer",
      co: "Bewe",
      dt: "Oct 2020 \u2014 Jun 2021",
      d: "Enhanced a legacy Backbone.js wellness SaaS by integrating scalable React components for gyms and fitness studios.",
      a: [
        "Introduced Zustand state management to simplify global state, improving maintainability and scalability",
        "Built features for user account control, advertisement management, and an agenda system for fitness scheduling",
        "Ensured smooth backend integration with Node.js and Express.js"
      ],
      tech: ["React", "Zustand", "Node.js", "Express.js", "Backbone.js"]
    }
  ],
  projects: [
    {
      title: "Optimus Agency \u2014 Developer Hub",
      desc: "A developer resource platform with blog, coding challenges, and curated guides for React, Kotlin, TypeScript, and more. Built with modern web technologies and a focus on developer experience.",
      url: "https://agencypartner2.netlify.app/es/developer-section",
      image: "/images/project-optimus.png",
      tech: ["Next.js", "TypeScript", "Contentful", "Netlify"]
    },
    {
      title: "10-Template Portfolio Engine",
      desc: "This very portfolio site \u2014 a multi-template CV engine with 10 unique designs, EN/ES toggle, Framer Motion animations, and Firebase CMS integration. Switch between Noir, Cyber, Terminal, and more.",
      url: "https://github.com/cristianscript",
      image: "/images/project-portfolio.png",
      tech: ["Next.js 14", "TypeScript", "Framer Motion", "CSS Modules", "Firebase"]
    },
    {
      title: "EV Charging Dashboard",
      desc: "Real-time charging session management for Audi's electric vehicle ecosystem. Features cursor-based pagination, GraphQL aggregation, and Redis-powered caching for sub-100ms responses.",
      url: "https://github.com/cristianscript",
      image: "/images/project-ev.png",
      tech: ["Next.js", "GraphQL", "Redis", "Node.js", "Docker"]
    }
  ],
  testimonials: [
    {
      quote: "Cristian consistently delivers clean, performant code and brings strong architectural thinking to every sprint. His work on our Design System transformed how the team ships UI.",
      name: "James Mitchell",
      role: "Engineering Manager",
      company: "Driveway.com"
    },
    {
      quote: "One of the most reliable React developers I've worked with. Cristian took ownership of our GraphQL layer and reduced API response times by 40% through smart caching strategies.",
      name: "Sarah Klein",
      role: "Tech Lead",
      company: "Audi"
    },
    {
      quote: "Cristian has a rare ability to bridge frontend and backend seamlessly. His microservice integrations were always well-documented and production-ready from day one.",
      name: "Diego Ramirez",
      role: "Senior Developer",
      company: "TD SYNNEX"
    }
  ],
  education: [
    {
      degree: "Systems Engineering",
      school: "Universidad Distrital Francisco Jos\u00E9 de Caldas",
      date: "2016 \u2014 2021",
      desc: "Focused on software architecture, algorithms, and distributed systems."
    },
    {
      degree: "React & Advanced JavaScript",
      school: "Platzi & Udemy",
      date: "2020 \u2014 Present",
      desc: "Continuous learning: React patterns, TypeScript, testing, and cloud infrastructure."
    },
    {
      degree: "Kotlin & Spring Boot",
      school: "JetBrains Academy",
      date: "2024 \u2014 Present",
      desc: "Backend development with Kotlin, Spring Boot microservices, and JVM ecosystem."
    }
  ]
};

export const DEFAULT_PHOTO_URL = '/images/profile.png';
