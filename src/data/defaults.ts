import { PortfolioData } from '@/types/content';

export const DEFAULT_DATA: PortfolioData = {
  name: "Cristian",
  last: "Torres",
  title: "Full Stack Developer",
  tagline: "I build React systems that scale to millions of users",
  desc: "React & Next.js specialist with 5+ years shipping production web products at companies like Audi and Driveway.com. I've built design systems adopted by 12+ teams, reduced API latency by 40% through smart caching, and delivered enterprise-grade UI platforms from zero to launch. Expert in TypeScript, React Query, GraphQL, and micro-service architecture. Currently expanding into Kotlin + Spring Boot for full-stack versatility, with hands-on experience in Azure Service Bus, Terraform, and CQRS patterns.",
  email: "cristian.torres19@hotmail.com",
  phone: "+57 323 799 2985",
  github: "github.com/cristiantorresf19191919",
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
      tags: ["Node.js", "Nest.js", "Express.js", "GraphQL", "REST APIs", "Kotlin", "Spring Boot", "Microservices", "CQRS"]
    },
    {
      ico: "\uD83D\uDCBE",
      t: "Cloud & Infrastructure",
      tags: ["Azure Service Bus", "Azure Pipelines", "Terraform", "PostgreSQL", "Redis", "Docker", "CI/CD", "Git", "Monorepo (Lerna)", "Changesets"]
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
        "**Managed server/cache state** with React Query (queries, mutations, optimistic updates) and lean local state",
        "**Wired Auth0** for secure login, RBAC, route guards, and session handling with middleware",
        "**Toggled features safely in prod** using Optimizely (flags, gradual rollouts, kill-switches)",
        "**Established a Material UI (MUI)-based Design System:** tokens, theming, dark mode, accessible components, Storybook docs",
        "**Managed a monorepo** (Lerna) to share UI packages, hooks, and configs, with versioning via Changesets",
        "**Improved Core Web Vitals** with image optimization, code-splitting, and caching",
        "**Delivered backend stories** using Kotlin + Spring Boot in a microservice architecture, leveraging Azure Service Bus Topics & Subscriptions for inter-service communication and applying the CQRS pattern — Cron jobs for write operations and a GraphQL API service for reads",
        "**Managed Azure Pipelines** for CI/CD deployments to production and maintained Terraform infrastructure-as-code files for cloud resource provisioning",
        "**Integrated PostgreSQL** and third-party APIs within Kotlin microservices, ensuring reliable data persistence and external system connectivity"
      ],
      tech: ["Next.js", "TypeScript", "React Query", "Auth0", "MUI", "Kotlin", "Spring Boot", "Azure Service Bus", "Azure Pipelines", "Terraform", "GraphQL", "CQRS", "Lerna"]
    },
    {
      t: "React & Node.js Developer",
      co: "Audi",
      dt: "Jan 2022 \u2014 Dec 2024",
      d: "Built and managed Node.js + GraphQL services across the Audi charging ecosystem, improving API reliability and performance.",
      a: [
        "**Developed a charging-history UI** in Next.js + TypeScript with responsive layout, client caching, and cursor-based pagination",
        "**Implemented aggregated GraphQL queries** with Base64 caching, cutting server load and speeding cursor navigation",
        "**Engineered workflows** ensuring an Audi vehicle can initiate a charging session, with transactions reflected seamlessly across services",
        "**Introduced Redis caching** for session state, reducing latency and offloading repeated GraphQL queries",
        "**Designed and scheduled cron jobs** to sync session statuses, process retries, and maintain data consistency",
        "**Partnered with cross-functional teams** (Product, Design, Backend) to craft dynamic user interfaces"
      ],
      tech: ["Next.js", "TypeScript", "Node.js", "GraphQL", "Redis", "Docker", "PostgreSQL"]
    },
    {
      t: "React + AEM Frontend Developer",
      co: "TD SYNNEX",
      dt: "Jul 2021 \u2014 Dec 2021",
      d: "Developed and maintained web applications using React and Adobe Experience Manager for enterprise clients.",
      a: [
        "**Collaborated with backend developers, designers, and project managers** to deliver high-quality solutions",
        "**Implemented responsive design, accessibility, performance optimization,** and SEO best practices",
        "**Leveraged Zustand** to build a robust state management system that enabled complex business solutions",
        "**Stayed updated** with the latest trends and technologies in frontend development"
      ],
      tech: ["React", "AEM", "Zustand", "Git", "Jira"]
    },
    {
      t: "React Developer",
      co: "Bewe",
      dt: "Oct 2020 \u2014 Jun 2021",
      d: "Enhanced a legacy Backbone.js wellness SaaS by integrating scalable React components for gyms and fitness studios.",
      a: [
        "**Introduced Zustand state management** to simplify global state, improving maintainability and scalability",
        "**Built features** for user account control, advertisement management, and an agenda system for fitness scheduling",
        "**Ensured smooth backend integration** with Node.js and Express.js"
      ],
      tech: ["React", "Zustand", "Node.js", "Express.js", "Backbone.js"]
    }
  ],
  projects: [
    {
      title: "Optimus Agency \u2014 Developer Hub",
      desc: "Full-stack developer resource platform featuring live coding playgrounds, Kotlin/React/TypeScript courses, interview prep modules, and a technical blog. Serves 500+ developers with interactive learning tools and a command palette search.",
      url: "https://agencypartner2.netlify.app/es/developer-section",
      tech: ["Next.js", "TypeScript", "Contentful", "Netlify"]
    },
    {
      title: "AuraSpa \u2014 Spa Management Platform",
      desc: "End-to-end spa and wellness management SaaS with real-time booking, staff scheduling, inventory tracking, and customer CRM. Handles 1,000+ monthly appointments with automated reminders and payment integration.",
      url: "https://github.com/cristiantorresf19191919/AuraSpa",
      tech: ["React", "TypeScript", "Node.js", "PostgreSQL", "Redis"]
    },
    {
      title: "Agendalo \u2014 Smart Scheduling System",
      desc: "Intelligent appointment scheduling platform with calendar sync, conflict resolution, and automated reminders. Features a drag-and-drop interface and multi-timezone support for distributed teams.",
      url: "https://github.com/cristiantorresf19191919/agendalo",
      tech: ["Next.js", "TypeScript", "Prisma", "Tailwind CSS"]
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

export const DEFAULT_DATA_ES: PortfolioData = {
  name: "Cristian",
  last: "Torres",
  title: "Desarrollador Full Stack",
  tagline: "Construyo sistemas React que escalan a millones de usuarios",
  desc: "Especialista en React y Next.js con m\u00E1s de 5 a\u00F1os lanzando productos web en producci\u00F3n en empresas como Audi y Driveway.com. He construido sistemas de dise\u00F1o adoptados por m\u00E1s de 12 equipos, reducido la latencia de API en un 40% mediante estrategias de cach\u00E9, y entregado plataformas UI empresariales desde cero. Experto en TypeScript, React Query, GraphQL y arquitectura de microservicios. Actualmente expandi\u00E9ndome en Kotlin + Spring Boot, con experiencia pr\u00E1ctica en Azure Service Bus, Terraform y patrones CQRS.",
  email: "cristian.torres19@hotmail.com",
  phone: "+57 323 799 2985",
  github: "github.com/cristiantorresf19191919",
  linkedin: "linkedin.com/in/cristian-torres-dev",
  loc: "Bogot\u00E1, Colombia",
  availability: "open",
  stats: [
    { n: "5+", l: "A\u00F1os de Experiencia" },
    { n: "4", l: "Empresas" },
    { n: "20+", l: "Proyectos Entregados" }
  ],
  skills: [
    {
      ico: "\u269B\uFE0F",
      t: "Desarrollo Frontend",
      tags: ["React", "Next.js", "TypeScript", "Gatsby", "Storybook", "Material UI", "Zustand", "React Query", "Webpack", "UI/UX desde Figma"]
    },
    {
      ico: "\uD83D\uDE80",
      t: "Desarrollo Backend",
      tags: ["Node.js", "Nest.js", "Express.js", "GraphQL", "REST APIs", "Kotlin", "Spring Boot", "Microservicios", "CQRS"]
    },
    {
      ico: "\uD83D\uDCBE",
      t: "Nube e Infraestructura",
      tags: ["Azure Service Bus", "Azure Pipelines", "Terraform", "PostgreSQL", "Redis", "Docker", "CI/CD", "Git", "Monorepo (Lerna)", "Changesets"]
    },
    {
      ico: "\uD83D\uDD27",
      t: "Testing e Integraciones",
      tags: ["Jest", "React Testing Library", "Playwright", "Chromatic", "Auth0", "Optimizely", "Contentful", "Google Solar SDK"]
    }
  ],
  exp: [
    {
      t: "Desarrollador React",
      co: "Driveway.com",
      dt: "Ene 2025 \u2014 Presente",
      d: "Construyendo y refinando pantallas en Next.js 13 (App Router) con TypeScript, enfocado en rendimiento y DX en una plataforma automotriz a gran escala.",
      a: [
        "**Gestion\u00E9 estado de servidor/cach\u00E9** con React Query (queries, mutations, actualizaciones optimistas) y estado local liviano",
        "**Implement\u00E9 Auth0** para login seguro, RBAC, protecci\u00F3n de rutas y manejo de sesiones con middleware",
        "**Altern\u00E9 features de forma segura en producci\u00F3n** usando Optimizely (flags, despliegues graduales, kill-switches)",
        "**Establec\u00ED un Design System basado en Material UI (MUI):** tokens, tematizaci\u00F3n, modo oscuro, componentes accesibles, documentaci\u00F3n en Storybook",
        "**Gestion\u00E9 un monorepo** (Lerna) para compartir paquetes UI, hooks y configuraciones, con versionamiento via Changesets",
        "**Mejor\u00E9 Core Web Vitals** con optimizaci\u00F3n de im\u00E1genes, code-splitting y cach\u00E9",
        "**Entregu\u00E9 historias de backend** usando Kotlin + Spring Boot en arquitectura de microservicios, aprovechando Azure Service Bus Topics & Subscriptions para comunicaci\u00F3n entre servicios y aplicando el patr\u00F3n CQRS \u2014 Cron jobs para escritura y un servicio GraphQL API para lectura",
        "**Gestion\u00E9 Azure Pipelines** para despliegues CI/CD a producci\u00F3n y mantuve archivos de infraestructura como c\u00F3digo con Terraform para aprovisionamiento de recursos en la nube",
        "**Integr\u00E9 PostgreSQL** y APIs de terceros dentro de microservicios Kotlin, asegurando persistencia de datos confiable y conectividad con sistemas externos"
      ],
      tech: ["Next.js", "TypeScript", "React Query", "Auth0", "MUI", "Kotlin", "Spring Boot", "Azure Service Bus", "Azure Pipelines", "Terraform", "GraphQL", "CQRS", "Lerna"]
    },
    {
      t: "Desarrollador React & Node.js",
      co: "Audi",
      dt: "Ene 2022 \u2014 Dic 2024",
      d: "Constru\u00ED y gestion\u00E9 servicios Node.js + GraphQL en el ecosistema de carga de Audi, mejorando la confiabilidad y el rendimiento de las APIs.",
      a: [
        "**Desarroll\u00E9 una UI de historial de carga** en Next.js + TypeScript con dise\u00F1o responsivo, cach\u00E9 del cliente y paginaci\u00F3n por cursor",
        "**Implement\u00E9 queries agregadas de GraphQL** con cach\u00E9 Base64, reduciendo carga del servidor y acelerando navegaci\u00F3n por cursor",
        "**Dise\u00F1\u00E9 flujos de trabajo** asegurando que un veh\u00EDculo Audi pueda iniciar una sesi\u00F3n de carga, con transacciones reflejadas sin fisuras entre servicios",
        "**Introduje cach\u00E9 Redis** para estado de sesi\u00F3n, reduciendo latencia y descargando queries GraphQL repetidas",
        "**Dise\u00F1\u00E9 y program\u00E9 cron jobs** para sincronizar estados de sesi\u00F3n, procesar reintentos y mantener consistencia de datos",
        "**Colabor\u00E9 con equipos multifuncionales** (Producto, Dise\u00F1o, Backend) para crear interfaces de usuario din\u00E1micas"
      ],
      tech: ["Next.js", "TypeScript", "Node.js", "GraphQL", "Redis", "Docker", "PostgreSQL"]
    },
    {
      t: "Desarrollador Frontend React + AEM",
      co: "TD SYNNEX",
      dt: "Jul 2021 \u2014 Dic 2021",
      d: "Desarroll\u00E9 y mantuve aplicaciones web usando React y Adobe Experience Manager para clientes empresariales.",
      a: [
        "**Colabor\u00E9 con desarrolladores backend, dise\u00F1adores y gerentes de proyecto** para entregar soluciones de alta calidad",
        "**Implement\u00E9 dise\u00F1o responsivo, accesibilidad, optimizaci\u00F3n de rendimiento** y mejores pr\u00E1cticas de SEO",
        "**Utilic\u00E9 Zustand** para construir un sistema de gesti\u00F3n de estado robusto que permiti\u00F3 soluciones de negocio complejas",
        "**Me mantuve actualizado** con las \u00FAltimas tendencias y tecnolog\u00EDas en desarrollo frontend"
      ],
      tech: ["React", "AEM", "Zustand", "Git", "Jira"]
    },
    {
      t: "Desarrollador React",
      co: "Bewe",
      dt: "Oct 2020 \u2014 Jun 2021",
      d: "Mejor\u00E9 un SaaS de bienestar legacy en Backbone.js integrando componentes React escalables para gimnasios y estudios de fitness.",
      a: [
        "**Introduje gesti\u00F3n de estado con Zustand** para simplificar el estado global, mejorando mantenibilidad y escalabilidad",
        "**Constru\u00ED funcionalidades** para control de cuentas de usuario, gesti\u00F3n de publicidad y un sistema de agenda para programaci\u00F3n de fitness",
        "**Asegur\u00E9 integraci\u00F3n fluida con el backend** usando Node.js y Express.js"
      ],
      tech: ["React", "Zustand", "Node.js", "Express.js", "Backbone.js"]
    }
  ],
  projects: [
    {
      title: "Optimus Agency \u2014 Hub de Desarrolladores",
      desc: "Plataforma de recursos para desarrolladores con playgrounds de c\u00F3digo en vivo, cursos de Kotlin/React/TypeScript, m\u00F3dulos de preparaci\u00F3n para entrevistas y un blog t\u00E9cnico. Sirve a m\u00E1s de 500 desarrolladores con herramientas de aprendizaje interactivo.",
      url: "https://agencypartner2.netlify.app/es/developer-section",
      tech: ["Next.js", "TypeScript", "Contentful", "Netlify"]
    },
    {
      title: "AuraSpa \u2014 Plataforma de Gesti\u00F3n de Spa",
      desc: "SaaS integral de gesti\u00F3n de spa y bienestar con reservas en tiempo real, programaci\u00F3n de personal, seguimiento de inventario y CRM de clientes. Maneja m\u00E1s de 1,000 citas mensuales con recordatorios autom\u00E1ticos e integraci\u00F3n de pagos.",
      url: "https://github.com/cristiantorresf19191919/AuraSpa",
      tech: ["React", "TypeScript", "Node.js", "PostgreSQL", "Redis"]
    },
    {
      title: "Agendalo \u2014 Sistema de Agendamiento Inteligente",
      desc: "Plataforma inteligente de agendamiento de citas con sincronizaci\u00F3n de calendario, resoluci\u00F3n de conflictos y recordatorios automatizados. Cuenta con interfaz drag-and-drop y soporte multi-zona horaria para equipos distribuidos.",
      url: "https://github.com/cristiantorresf19191919/agendalo",
      tech: ["Next.js", "TypeScript", "Prisma", "Tailwind CSS"]
    }
  ],
  testimonials: [
    {
      quote: "Cristian entrega consistentemente c\u00F3digo limpio y de alto rendimiento, y aporta un pensamiento arquitect\u00F3nico s\u00F3lido a cada sprint. Su trabajo en nuestro Design System transform\u00F3 la forma en que el equipo entrega UI.",
      name: "James Mitchell",
      role: "Engineering Manager",
      company: "Driveway.com"
    },
    {
      quote: "Uno de los desarrolladores React m\u00E1s confiables con los que he trabajado. Cristian tom\u00F3 ownership de nuestra capa GraphQL y redujo los tiempos de respuesta de la API en un 40% mediante estrategias inteligentes de cach\u00E9.",
      name: "Sarah Klein",
      role: "Tech Lead",
      company: "Audi"
    },
    {
      quote: "Cristian tiene una habilidad rara para conectar frontend y backend sin fisuras. Sus integraciones de microservicios siempre estuvieron bien documentadas y listas para producci\u00F3n desde el d\u00EDa uno.",
      name: "Diego Ramirez",
      role: "Senior Developer",
      company: "TD SYNNEX"
    }
  ],
  education: [
    {
      degree: "Ingenier\u00EDa de Sistemas",
      school: "Universidad Distrital Francisco Jos\u00E9 de Caldas",
      date: "2016 \u2014 2021",
      desc: "Enfocado en arquitectura de software, algoritmos y sistemas distribuidos."
    },
    {
      degree: "React & JavaScript Avanzado",
      school: "Platzi & Udemy",
      date: "2020 \u2014 Presente",
      desc: "Aprendizaje continuo: patrones React, TypeScript, testing e infraestructura cloud."
    },
    {
      degree: "Kotlin & Spring Boot",
      school: "JetBrains Academy",
      date: "2024 \u2014 Presente",
      desc: "Desarrollo backend con Kotlin, microservicios Spring Boot y ecosistema JVM."
    }
  ]
};

export const DEFAULT_PHOTO_URL = '/images/profile.png';
