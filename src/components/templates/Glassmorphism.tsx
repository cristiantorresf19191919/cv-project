'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useContent } from '@/context/ContentContext';
import AnimatedSection from '@/components/shared/AnimatedSection';
import StaggerChildren, { staggerItem } from '@/components/shared/StaggerChildren';
import SectionHeader from '@/components/shared/SectionHeader';
import s from '@/styles/glass.module.css';

const heroContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const heroItem = {
  hidden: { opacity: 0, y: 35, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const glassPhotoReveal = {
  hidden: { opacity: 0, y: 40, scale: 0.9, filter: 'blur(12px)' },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 1, delay: 0.35, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const skillHover = {
  y: -8,
  scale: 1.03,
  background: 'rgba(255,255,255,0.14)',
  transition: { type: 'spring' as const, stiffness: 400, damping: 25 },
};

const contactHover = {
  y: -6,
  scale: 1.04,
  background: 'rgba(255,255,255,0.12)',
  transition: { type: 'spring' as const, stiffness: 400, damping: 25 },
};

export default function Glassmorphism() {
  const { data, photoUrl } = useContent();

  return (
    <div className={s.template}>
      <div className={s.hero}>
        <motion.div initial="hidden" animate="visible" variants={heroContainer}>
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
              <motion.div
                key={i}
                className={s.statBox}
                initial={{ opacity: 0, scale: 0.8, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.9 + i * 0.12, duration: 0.5, type: 'spring' as const, stiffness: 200 }}
              >
                <div className={s.stN}>{stat.n}</div>
                <div className={s.stL}>{stat.l}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
        <motion.div initial="hidden" animate="visible" variants={glassPhotoReveal}>
          <div className={s.photoWrap}>
            <div className={s.photoInner}>
              <Image src={photoUrl} alt="Cristian Torres" fill sizes="340px" className="profile-photo" style={{ borderRadius: '22px' }} priority />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Skills */}
      <div className={s.sec}>
        <SectionHeader tag="My Arsenal" title="Technical Expertise" tagClass={s.secTag} titleClass={s.secTitle} wrapperClass={s.secH} />
        <StaggerChildren className={s.sg} stagger={0.1}>
          {data.skills.map((skill, i) => (
            <motion.div key={i} variants={staggerItem} whileHover={skillHover} className={s.sc}>
              <div className={s.ico}>{skill.ico}</div>
              <h3 className={s.scH3}>{skill.t}</h3>
              <div className={s.tgs}>
                {skill.tags.map((tag, j) => <span key={j} className={s.tg}>{tag}</span>)}
              </div>
            </motion.div>
          ))}
        </StaggerChildren>
      </div>

      {/* Experience */}
      <div className={s.sec}>
        <SectionHeader tag="Career Journey" title="Professional Experience" tagClass={s.secTag} titleClass={s.secTitle} wrapperClass={s.secH} />
        {data.exp.map((exp, i) => (
          <AnimatedSection key={i} direction="left" delay={i * 0.12} scale>
            <div className={s.ti}>
              <div className={s.tc}>
                <h3 className={s.tcH3}>{exp.t}</h3>
                <div className={s.co}>{exp.co}</div>
                <div className={s.dt}>{exp.dt}</div>
                <div className={s.td}>{exp.d}</div>
                <ul className={s.tcUl}>
                  {exp.a.map((a, j) => <li key={j} className={s.tcLi}>{a}</li>)}
                </ul>
                <div className={s.tt}>
                  {exp.tech.map((t, j) => <span key={j} className={s.ttg}>{t}</span>)}
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
                whileHover={{ y: -10, scale: 1.02, transition: { type: 'spring' as const, stiffness: 300, damping: 20 } }}
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
        <SectionHeader tag="Get In Touch" title="Let&#39;s Work Together" tagClass={s.secTag} titleClass={s.secTitle} wrapperClass={s.secH} />
        <StaggerChildren className={s.cg} stagger={0.08}>
          <motion.div variants={staggerItem} whileHover={contactHover} className={s.cc}>
            <div className={s.ci}>📧</div>
            <h3 className={s.ccH3}>Email</h3>
            <a href={`mailto:${data.email}`} className={s.ccA}>{data.email}</a>
          </motion.div>
          <motion.div variants={staggerItem} whileHover={contactHover} className={s.cc}>
            <div className={s.ci}>📱</div>
            <h3 className={s.ccH3}>Phone</h3>
            <a href={`tel:+57${data.phone.replace(/\D/g, '').slice(2)}`} className={s.ccA}>{data.phone}</a>
          </motion.div>
          <motion.div variants={staggerItem} whileHover={contactHover} className={s.cc}>
            <div className={s.ci}>💻</div>
            <h3 className={s.ccH3}>GitHub</h3>
            <a href={`https://${data.github}`} target="_blank" rel="noopener noreferrer" className={s.ccA}>{data.github}</a>
          </motion.div>
          <motion.div variants={staggerItem} whileHover={contactHover} className={s.cc}>
            <div className={s.ci}>📍</div>
            <h3 className={s.ccH3}>Location</h3>
            <p className={s.ccP}>{data.loc}</p>
          </motion.div>
        </StaggerChildren>
      </div>
    </div>
  );
}
