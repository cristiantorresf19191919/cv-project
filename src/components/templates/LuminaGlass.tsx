'use client';

import { motion } from 'framer-motion';
import { useContent } from '@/context/ContentContext';
import AnimatedSection from '@/components/shared/AnimatedSection';
import StaggerChildren, { staggerItem } from '@/components/shared/StaggerChildren';
import SectionHeader from '@/components/shared/SectionHeader';
import ContactForm from '@/components/shared/ContactForm';
import ReactionBar from '@/components/shared/ReactionBar';
import Footer from '@/components/shared/Footer';
import CodeShowcase from '@/components/shared/CodeShowcase';
import s from '@/styles/lumina.module.css';
import { parseBold } from '@/utils/parseBold';
import { useSkillHighlight } from '@/context/SkillHighlightContext';
import { useCopyToClipboard } from '@/utils/contactActions';
import { EmailIcon, PhoneIcon, GithubIcon, LocationIcon } from '@/components/shared/ContactIcons';

const CORE_SKILLS = new Set([
  'React', 'Next.js', 'TypeScript', 'Node.js', 'GraphQL',
  'Kotlin', 'Spring Boot', 'PostgreSQL', 'Redis',
  'Azure Service Bus', 'Azure Pipelines', 'Terraform', 'CQRS',
  'Jest', 'React Testing Library', 'Playwright',
]);

/* squircle tile hue per tool card, like the CleanMyMac app icons */
const TILE_CLASSES = [s.tileBlue, s.tileMagenta, s.tileOrange, s.tileTeal];

const TILE_ICONS: JSX.Element[] = [
  <svg key="fe" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>,
  <svg key="be" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="20" height="8" rx="2" />
    <rect x="2" y="14" width="20" height="8" rx="2" />
    <line x1="6" y1="6" x2="6.01" y2="6" />
    <line x1="6" y1="18" x2="6.01" y2="18" />
  </svg>,
  <svg key="cloud" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
  </svg>,
  <svg key="test" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>,
];

const NAV_ITEMS = [
  {
    href: '#overview', label: 'Overview', active: true,
    ico: <svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>,
  },
  {
    href: '#tools', label: 'My Tools',
    ico: <svg viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>,
  },
  {
    href: '#career', label: 'Journey',
    ico: <svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>,
  },
  {
    href: '#projects', label: 'Projects', isNew: true,
    ico: <svg viewBox="0 0 24 24"><path d="M12 2 2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>,
  },
  {
    href: '#contact', label: 'Contact',
    ico: <svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>,
  },
];

const heroContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.11, delayChildren: 0.15 },
  },
};

const heroItem = {
  hidden: { opacity: 0, y: 34, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const photoReveal = {
  hidden: { opacity: 0, scale: 0.9, y: 26 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.95, delay: 0.4, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const cardHover = {
  y: -4,
  transition: { type: 'spring' as const, stiffness: 380, damping: 24 },
};

export default function LuminaGlass() {
  const { data } = useContent();
  const { activeSkill, setActiveSkill } = useSkillHighlight();
  const { copied, copy } = useCopyToClipboard();

  return (
    <div className={s.template}>
      <div className={s.bloom} aria-hidden="true" />
      <div className={s.shell}>
        <aside className={s.sidebar}>
          {/* data-pdf-collapse: the rail is nav chrome — dropped from PDF capture */}
          <nav className={s.rail} data-pdf-collapse>
            <div className={s.brand}>
              <span className={s.brandDot} aria-hidden="true" />
              {data.name} {data.last}
            </div>
            {NAV_ITEMS.map((item) => (
              <a key={item.label} href={item.href} className={`${s.navItem} ${item.active ? s.navItemActive : ''}`}>
                <span className={s.navIco}>{item.ico}</span>
                {item.label}
                {item.isNew && <span className={s.navNew}>New</span>}
              </a>
            ))}
            <div className={s.railFoot}>by {data.name} · Lumina</div>
          </nav>
        </aside>

        <div className={s.main}>
          {/* Hero */}
          <div id="overview" className={s.hero}>
            <motion.div initial="hidden" animate="visible" variants={heroContainer} style={{ position: 'relative', zIndex: 2 }}>
              <motion.div variants={heroItem} className={s.heroTag}>
                <span className={s.heroTagDot} />
                {data.title}
              </motion.div>
              <motion.h1 variants={heroItem} className={s.h1}>
                {data.name}<br /><span className={s.h1Accent}>{data.last}</span>
              </motion.h1>
              <motion.div variants={heroItem} className={s.sub}>{data.tagline}</motion.div>
              <motion.p variants={heroItem} className={s.desc}>{data.desc}</motion.p>
              <motion.div variants={heroItem} className={s.btns}>
                <a href="#contact" className={s.b1}>Get In Touch</a>
                <a href={`https://${data.github}`} target="_blank" rel="noopener noreferrer" className={s.b2}>View GitHub</a>
              </motion.div>
              <motion.div variants={heroItem} className={s.stats}>
                {data.stats.map((stat, i) => (
                  <div key={i}>
                    <div className={s.stN}>{stat.n}</div>
                    <div className={s.stL}>{stat.l}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>
            <motion.div initial="hidden" animate="visible" variants={photoReveal}>
              <CodeShowcase variant="hero" />
            </motion.div>
          </div>

          {/* Skills — "My Tools" glass grid */}
          <div id="tools" className={s.sec}>
            <SectionHeader tag="My Tools" title="Technical Toolbox" tagClass={s.secTag} titleClass={s.secTitle} wrapperClass={s.secH} />
            <StaggerChildren className={s.sg} stagger={0.09}>
              {data.skills.map((skill, i) => (
                <motion.div key={i} variants={staggerItem} whileHover={cardHover} className={s.sc}>
                  <div className={`${s.tile} ${TILE_CLASSES[i % TILE_CLASSES.length]}`}>
                    {TILE_ICONS[i % TILE_ICONS.length]}
                  </div>
                  <h3 className={s.scH3}>{skill.t}</h3>
                  <div className={s.tgs}>
                    {skill.tags.map((tag, j) => (
                      <span
                        key={j}
                        className={`${s.tg} ${CORE_SKILLS.has(tag) ? s.tgCore : ''} ${activeSkill === tag ? s.tgActive : ''}`}
                        onMouseEnter={() => setActiveSkill(tag)}
                        onMouseLeave={() => setActiveSkill(null)}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className={s.scFoot}>
                    <span className={s.scCount}>{skill.tags.length} tools</span>
                    <span className={s.scan}>Scan</span>
                  </div>
                </motion.div>
              ))}
            </StaggerChildren>
          </div>

          {/* Experience */}
          <div id="career" className={s.sec}>
            <SectionHeader tag="Smart Care" title="Professional Journey" tagClass={s.secTag} titleClass={s.secTitle} wrapperClass={s.secH} />
            <div className={s.tl}>
              {data.exp.map((exp, i) => (
                <AnimatedSection key={i} direction="left" delay={i * 0.1} scale>
                  <div className={`${s.ti} ${exp.dt.toLowerCase().includes('present') ? s.tiCurrent : ''}`}>
                    <div className={s.tc}>
                      <h3 className={s.tcH3}>{exp.t}</h3>
                      <div className={s.co}>{exp.co}</div>
                      <div className={s.dt}>{exp.dt}</div>
                      <div className={s.td}>{exp.d}</div>
                      <ul className={s.tcUl}>
                        {exp.a.map((a, j) => (
                          <li key={j} className={s.tcLi}><span>{parseBold(a)}</span></li>
                        ))}
                      </ul>
                      <div className={s.tt}>
                        {exp.tech.map((t, j) => (
                          <span key={j} className={s.ttg}>{t}</span>
                        ))}
                      </div>
                      <ReactionBar sectionId={`exp-${i}`} />
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>

          {/* Projects */}
          {data.projects.length > 0 && (
            <div id="projects" className={s.sec}>
              <SectionHeader tag="Showcase" title="Featured Projects" tagClass={s.secTag} titleClass={s.secTitle} wrapperClass={s.secH} />
              <StaggerChildren className={s.pg}>
                {data.projects.map((project, i) => (
                  <motion.a
                    key={i}
                    variants={staggerItem}
                    whileHover={cardHover}
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={s.pc}
                  >
                    <h3 className={s.pcTitle}>{project.title}</h3>
                    <p className={s.pcDesc}>{project.desc}</p>
                    <div className={s.tt}>
                      {project.tech.map((t, j) => (
                        <span key={j} className={s.ttg}>{t}</span>
                      ))}
                    </div>
                    <span className={s.pcLink}>View Project</span>
                  </motion.a>
                ))}
              </StaggerChildren>
            </div>
          )}

          {/* Contact */}
          <div id="contact" className={s.sec}>
            <SectionHeader tag="Get In Touch" title="Let&#39;s Work Together" tagClass={s.secTag} titleClass={s.secTitle} wrapperClass={s.secH} />
            <StaggerChildren className={s.cg} stagger={0.07}>
              <motion.div variants={staggerItem} whileHover={cardHover}
                className={s.cc} onClick={() => copy(data.email, 'email')} style={{ cursor: 'pointer' }}>
                <div className={s.ci}><EmailIcon /></div>
                <span className={s.ccA}>{copied === 'email' ? 'Copied!' : data.email}</span>
                <h3 className={s.ccH3}>Email</h3>
              </motion.div>
              <motion.div variants={staggerItem} whileHover={cardHover}
                className={s.cc} onClick={() => copy(data.phone, 'phone')} style={{ cursor: 'pointer' }}>
                <div className={s.ci}><PhoneIcon /></div>
                <span className={s.ccA}>{copied === 'phone' ? 'Copied!' : data.phone}</span>
                <h3 className={s.ccH3}>Phone</h3>
              </motion.div>
              <motion.a variants={staggerItem} whileHover={cardHover}
                className={s.cc} href={`https://${data.github}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <div className={s.ci}><GithubIcon /></div>
                <span className={s.ccA}>{data.github}</span>
                <h3 className={s.ccH3}>GitHub</h3>
              </motion.a>
              <motion.a variants={staggerItem} whileHover={cardHover}
                className={s.cc} href={`https://${data.linkedin}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <div className={s.ci}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </div>
                <span className={s.ccA}>{data.linkedin}</span>
                <h3 className={s.ccH3}>LinkedIn</h3>
              </motion.a>
              <motion.a variants={staggerItem} whileHover={cardHover}
                className={s.cc} href={`https://maps.google.com/?q=${encodeURIComponent(data.loc)}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <div className={s.ci}><LocationIcon /></div>
                <span className={s.ccA}>{data.loc}</span>
                <h3 className={s.ccH3}>Location</h3>
              </motion.a>
              <ContactForm />
            </StaggerChildren>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
}
