'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useContent } from '@/context/ContentContext';
import AnimatedSection from '@/components/shared/AnimatedSection';
import StaggerChildren, { staggerItem } from '@/components/shared/StaggerChildren';
import SectionHeader from '@/components/shared/SectionHeader';
import ContactForm from '@/components/shared/ContactForm';
import Footer from '@/components/shared/Footer';
import s from '@/styles/terminal.module.css';
import { parseBold } from '@/utils/parseBold';
import { useSkillHighlight } from '@/context/SkillHighlightContext';
import { getTechColor } from '@/utils/techBrandColors';
import { useCopyToClipboard } from '@/utils/contactActions';
import { EmailIcon, PhoneIcon, GithubIcon, LocationIcon } from '@/components/shared/ContactIcons';

const heroContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.3 },
  },
};

const terminalLine = {
  hidden: { opacity: 0, x: -20, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const photoGlitch = {
  hidden: { opacity: 0, scale: 0.9, filter: 'brightness(2) contrast(0.5)' },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'brightness(1) contrast(1)',
    transition: { duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const skillHover = {
  borderColor: '#00ff41',
  y: -6,
  transition: { type: 'spring' as const, stiffness: 400, damping: 25 },
};

const contactHover = {
  borderColor: '#00ff41',
  y: -4,
  transition: { type: 'spring' as const, stiffness: 400, damping: 25 },
};

export default function TerminalHacker() {
  const { data, photoUrl } = useContent();
  const { activeSkill, setActiveSkill } = useSkillHighlight();
  const { copied, copy } = useCopyToClipboard();

  return (
    <div className={s.template}>
      <div className={s.hero}>
        <motion.div initial="hidden" animate="visible" variants={heroContainer}>
          <motion.div variants={terminalLine} className={s.prompt}>
            $ cat ./portfolio.txt<span className={s.cursor} />
          </motion.div>
          <motion.div variants={terminalLine} className={s.heroTag}>{data.title}</motion.div>
          <motion.h1 variants={terminalLine} className={s.h1}>
            {data.name}<br />{data.last}
          </motion.h1>
          <motion.div variants={terminalLine} className={s.sub}>{data.tagline}</motion.div>
          <motion.p variants={terminalLine} className={s.desc}>{data.desc}</motion.p>
          <motion.div variants={terminalLine} className={s.btns}>
            <a href={`mailto:${data.email}`} className={s.b1}>Get In Touch</a>
            <a href={`https://${data.github}`} target="_blank" rel="noopener noreferrer" className={s.b2}>View GitHub</a>
          </motion.div>
          <motion.div variants={terminalLine} className={s.stats}>
            {data.stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + i * 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] as const }}
              >
                <div className={s.stN}>{stat.n}</div>
                <div className={s.stL}>{stat.l}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
        <motion.div initial="hidden" animate="visible" variants={photoGlitch}>
          <div className={s.photoWrap}>
            <Image src={photoUrl} alt="Cristian Torres" fill sizes="240px" className="profile-photo" priority />
          </div>
        </motion.div>
      </div>

      {/* Skills */}
      <div className={s.sec}>
        <SectionHeader tag="My Arsenal" title="Technical Expertise" tagClass={s.secTag} titleClass={s.secTitle} wrapperClass={s.secH} />
        <StaggerChildren className={s.sg} stagger={0.08}>
          {data.skills.map((skill, i) => (
            <motion.div key={i} variants={staggerItem} whileHover={skillHover} className={s.sc}>
              <div className={s.ico}>{skill.ico}</div>
              <h3 className={s.scH3}>{skill.t}</h3>
              <div className={s.tgs}>
                {skill.tags.map((tag, j) => (
                  <span
                    key={j}
                    className={`${s.tg} ${activeSkill === tag ? s.tgActive : ''}`}
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

      {/* Experience */}
      <div className={s.sec}>
        <SectionHeader tag="Career Journey" title="Professional Experience" tagClass={s.secTag} titleClass={s.secTitle} wrapperClass={s.secH} />
        {data.exp.map((exp, i) => (
          <AnimatedSection key={i} direction="left" delay={i * 0.1} scale>
            <div className={s.ti}>
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
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>

      {/* Portfolio */}
      {data.projects.length > 0 && (
        <div className={s.sec}>
          <SectionHeader tag="Portfolio" title="Featured Projects" tagClass={s.secTag} titleClass={s.secTitle} wrapperClass={s.secH} />
          <StaggerChildren className={s.pg}>
            {data.projects.map((project, i) => (
              <motion.a
                key={i}
                variants={staggerItem}
                whileHover={{ y: -8, borderColor: '#00ff41', transition: { type: 'spring' as const, stiffness: 300, damping: 20 } }}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className={s.pc}
              >
                <div className={s.pcImg}>
                  {project.image && (
                    <Image src={project.image} alt={project.title} fill style={{ objectFit: 'cover' }} sizes="600px" />
                  )}
                </div>
                <div className={s.pcBody}>
                  <h3 className={s.pcTitle}>{project.title}</h3>
                  <p className={s.pcDesc}>{project.desc}</p>
                  <div className={s.tt}>
                    {project.tech.map((t, j) => (
                      <span key={j} className={s.ttg}>{t}</span>
                    ))}
                  </div>
                  <div style={{ marginTop: '0.8rem' }}>
                    <span className={s.pcLink}>&gt; View Project</span>
                  </div>
                </div>
              </motion.a>
            ))}
          </StaggerChildren>
        </div>
      )}

      {/* Contact */}
      <div className={s.sec}>
        <SectionHeader tag="Get In Touch" title="Let's Work Together" tagClass={s.secTag} titleClass={s.secTitle} wrapperClass={s.secH} />
        <StaggerChildren className={s.cg} stagger={0.08}>
          <motion.div variants={staggerItem} whileHover={contactHover}
            className={s.cc} onClick={() => copy(data.email, 'email')} style={{ cursor: 'pointer' }}>
            <div className={s.ci}><EmailIcon /></div>
            <h3 className={s.ccH3}>{copied === 'email' ? 'Copied!' : 'Email'}</h3>
            <span className={s.ccA}>{data.email}</span>
          </motion.div>
          <motion.div variants={staggerItem} whileHover={contactHover}
            className={s.cc} onClick={() => copy(data.phone, 'phone')} style={{ cursor: 'pointer' }}>
            <div className={s.ci}><PhoneIcon /></div>
            <h3 className={s.ccH3}>{copied === 'phone' ? 'Copied!' : 'Phone'}</h3>
            <span className={s.ccA}>{data.phone}</span>
          </motion.div>
          <motion.a variants={staggerItem} whileHover={contactHover}
            className={s.cc} href={`https://${data.github}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <div className={s.ci}><GithubIcon /></div>
            <h3 className={s.ccH3}>GitHub</h3>
            <span className={s.ccA}>{data.github}</span>
          </motion.a>
          <motion.a variants={staggerItem} whileHover={contactHover}
            className={s.cc} href={`https://maps.google.com/?q=${encodeURIComponent(data.loc)}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <div className={s.ci}><LocationIcon /></div>
            <h3 className={s.ccH3}>Location</h3>
            <span className={s.ccA}>{data.loc}</span>
          </motion.a>
          <ContactForm />
        </StaggerChildren>
      </div>
      <Footer />
    </div>
  );
}
