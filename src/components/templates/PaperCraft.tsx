'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useContent } from '@/context/ContentContext';
import AnimatedSection from '@/components/shared/AnimatedSection';
import StaggerChildren, { staggerItem } from '@/components/shared/StaggerChildren';
import SectionHeader from '@/components/shared/SectionHeader';
import ContactForm from '@/components/shared/ContactForm';
import ReactionBar from '@/components/shared/ReactionBar';
import Footer from '@/components/shared/Footer';
import s from '@/styles/paper.module.css';
import { parseBold } from '@/utils/parseBold';
import { useSkillHighlight } from '@/context/SkillHighlightContext';
import { getTechColor } from '@/utils/techBrandColors';
import { useCopyToClipboard } from '@/utils/contactActions';
import { EmailIcon, PhoneIcon, GithubIcon, LocationIcon } from '@/components/shared/ContactIcons';

const CORE_SKILLS = new Set([
  'React', 'Next.js', 'TypeScript', 'Node.js', 'GraphQL',
  'Kotlin', 'Spring Boot', 'PostgreSQL', 'Redis',
  'Jest', 'React Testing Library', 'Playwright',
]);

const heroContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const heroItem = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const photoReveal = {
  hidden: { opacity: 0, rotate: -5, scale: 0.9 },
  visible: {
    opacity: 1, rotate: 2, scale: 1,
    transition: { duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const cardFloat = {
  y: -5,
  rotate: -0.5,
  transition: { type: 'spring' as const, stiffness: 300, damping: 25 },
};

const contactHover = {
  y: -3,
  transition: { type: 'spring' as const, stiffness: 400, damping: 25 },
};

export default function PaperCraft() {
  const { data, photoUrl } = useContent();
  const { activeSkill, setActiveSkill } = useSkillHighlight();
  const { copied, copy } = useCopyToClipboard();

  return (
    <div className={s.template}>
      {/* Hero — paper card with photo */}
      <div className={s.hero}>
        <motion.div
          className={s.heroCard}
          initial="hidden"
          animate="visible"
          variants={heroContainer}
        >
          <div>
            <motion.div variants={heroItem} className={s.heroTag}>{data.title}</motion.div>
            <motion.h1 variants={heroItem} className={s.h1}>
              {data.name}<br />{data.last}
            </motion.h1>
            <motion.div variants={heroItem} className={s.sub}>{data.tagline}</motion.div>
            <motion.p variants={heroItem} className={s.desc}>{data.desc}</motion.p>
            <motion.div variants={heroItem} className={s.btns}>
              <a href={`mailto:${data.email}`} className={s.b1}>Get In Touch</a>
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
          </div>
          <motion.div variants={photoReveal}>
            <div className={s.photoWrap}>
              <div className={s.photoFrame}>
                <Image src={photoUrl} alt="Cristian Torres" fill sizes="160px" className="profile-photo" priority style={{ objectFit: 'cover' }} />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Skills — index cards */}
      <div className={s.sec}>
        <SectionHeader tag="Expertise" title="Technical Skills" tagClass={s.secTag} titleClass={s.secTitle} wrapperClass={s.secH} />
        <StaggerChildren className={s.sg} stagger={0.08}>
          {data.skills.map((skill, i) => (
            <motion.div key={i} variants={staggerItem} whileHover={cardFloat} className={s.sc}>
              <div className={s.ico}>{skill.ico}</div>
              <h3 className={s.scH3}>{skill.t}</h3>
              <div className={s.tgs}>
                {skill.tags.map((tag, j) => (
                  <span
                    key={j}
                    className={`${s.tg} ${CORE_SKILLS.has(tag) ? s.tgCore : ''} ${activeSkill === tag ? s.tgActive : ''}`}
                    onMouseEnter={() => setActiveSkill(tag)}
                    onMouseLeave={() => setActiveSkill(null)}
                    style={activeSkill === tag ? { backgroundColor: getTechColor(tag) || undefined, color: '#fff', borderColor: getTechColor(tag) || undefined } : undefined}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </StaggerChildren>
      </div>

      {/* Experience — stacked paper pages */}
      <div className={s.sec}>
        <SectionHeader tag="Career" title="Professional Experience" tagClass={s.secTag} titleClass={s.secTitle} wrapperClass={s.secH} />
        <div className={s.tl}>
          {data.exp.map((exp, i) => (
            <AnimatedSection key={i} direction="left" delay={i * 0.1} scale>
              <div className={`${s.ti} ${exp.dt.toLowerCase().includes('present') ? s.tiCurrent : ''}`}>
                <div className={`${s.tc} ${activeSkill && !exp.tech.includes(activeSkill) ? s.tcDimmed : ''} ${activeSkill && exp.tech.includes(activeSkill) ? s.tcHighlighted : ''}`}>
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

      {/* Portfolio */}
      {data.projects.length > 0 && (
        <div className={s.sec}>
          <SectionHeader tag="Work" title="Featured Projects" tagClass={s.secTag} titleClass={s.secTitle} wrapperClass={s.secH} />
          <StaggerChildren className={s.pg}>
            {data.projects.map((project, i) => (
              <motion.a
                key={i}
                variants={staggerItem}
                whileHover={{ y: -8, rotate: -0.5, transition: { type: 'spring' as const, stiffness: 300, damping: 20 } }}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className={s.pc}
              >
                <div className={s.pcImg}>
                  {project.image && <Image src={project.image} alt={project.title} fill style={{ objectFit: 'cover' }} sizes="600px" />}
                </div>
                <div className={s.pcBody}>
                  <h3 className={s.pcTitle}>{project.title}</h3>
                  <p className={s.pcDesc}>{project.desc}</p>
                  <div className={s.tt}>
                    {project.tech.map((t, j) => <span key={j} className={s.ttg}>{t}</span>)}
                  </div>
                  <div style={{ marginTop: '1rem' }}>
                    <span className={s.pcLink}>View Project →</span>
                  </div>
                </div>
              </motion.a>
            ))}
          </StaggerChildren>
        </div>
      )}

      {/* Contact */}
      <div className={s.sec}>
        <SectionHeader tag="Reach Out" title="Let&#39;s Work Together" tagClass={s.secTag} titleClass={s.secTitle} wrapperClass={s.secH} />
        <StaggerChildren className={s.cg} stagger={0.08}>
          <motion.div variants={staggerItem} whileHover={contactHover}
            className={s.cc} onClick={() => copy(data.email, 'email')} style={{ cursor: 'pointer' }}>
            <div className={s.ci}><EmailIcon /></div>
            <span className={s.ccA}>{copied === 'email' ? 'Copied!' : data.email}</span>
            <h3 className={s.ccH3}>Email</h3>
          </motion.div>
          <motion.div variants={staggerItem} whileHover={contactHover}
            className={s.cc} onClick={() => copy(data.phone, 'phone')} style={{ cursor: 'pointer' }}>
            <div className={s.ci}><PhoneIcon /></div>
            <span className={s.ccA}>{copied === 'phone' ? 'Copied!' : data.phone}</span>
            <h3 className={s.ccH3}>Phone</h3>
          </motion.div>
          <motion.a variants={staggerItem} whileHover={contactHover}
            className={s.cc} href={`https://${data.github}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <div className={s.ci}><GithubIcon /></div>
            <span className={s.ccA}>{data.github}</span>
            <h3 className={s.ccH3}>GitHub</h3>
          </motion.a>
          <motion.a variants={staggerItem} whileHover={contactHover}
            className={s.cc} href={`https://${data.linkedin}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <div className={s.ci}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </div>
            <span className={s.ccA}>{data.linkedin}</span>
            <h3 className={s.ccH3}>LinkedIn</h3>
          </motion.a>
          <motion.a variants={staggerItem} whileHover={contactHover}
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
  );
}
