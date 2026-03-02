'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useContent } from '@/context/ContentContext';
import AnimatedSection from '@/components/shared/AnimatedSection';
import StaggerChildren, { staggerItem } from '@/components/shared/StaggerChildren';
import SectionHeader from '@/components/shared/SectionHeader';
import ContactForm from '@/components/shared/ContactForm';
import s from '@/styles/serene.module.css';

const heroContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

const heroItem = {
  hidden: { opacity: 0, y: 28, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const photoReveal = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const skillHover = {
  y: -6,
  transition: { type: 'spring' as const, stiffness: 380, damping: 24 },
};

const contactHover = {
  scale: 1.03,
  y: -3,
  transition: { type: 'spring' as const, stiffness: 380, damping: 24 },
};

export default function SereneBento() {
  const { data, photoUrl } = useContent();

  return (
    <div className={s.template}>
      <div className={s.hero}>
        <motion.div initial="hidden" animate="visible" variants={heroContainer} className={s.heroContent}>
          <motion.span variants={heroItem} className={s.heroTag}>{data.title}</motion.span>
          <motion.h1 variants={heroItem} className={s.h1}>
            {data.name} {data.last}
          </motion.h1>
          <motion.p variants={heroItem} className={s.sub}>{data.tagline}</motion.p>
          <motion.p variants={heroItem} className={s.desc}>{data.desc}</motion.p>
          <motion.div variants={heroItem} className={s.stats}>
            {data.stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 + i * 0.1 }}
                className={s.statBox}
              >
                <span className={s.stN}>{stat.n}</span>
                <span className={s.stL}>{stat.l}</span>
              </motion.div>
            ))}
          </motion.div>
          <motion.div variants={heroItem} className={s.btns}>
            <a href={`mailto:${data.email}`} className={s.b1}>Contact</a>
            <a href={`https://${data.github}`} target="_blank" rel="noopener noreferrer" className={s.b2}>GitHub</a>
          </motion.div>
        </motion.div>
        <motion.div initial="hidden" animate="visible" variants={photoReveal} className={s.photoBento}>
          <div className={s.photoFrame}>
            <div className={s.photoInner}>
              <Image src={photoUrl} alt={data.name} fill sizes="380px" className="profile-photo" priority />
            </div>
          </div>
        </motion.div>
      </div>

      <div className={s.sec}>
        <SectionHeader tag="Expertise" title="Skills" tagClass={s.secTag} titleClass={s.secTitle} wrapperClass={s.secH} />
        <StaggerChildren className={s.bento} stagger={0.08}>
          {data.skills.map((skill, i) => (
            <motion.div
              key={i}
              variants={staggerItem}
              whileHover={skillHover}
              className={`${s.bentoCard} ${i === 0 ? s.bentoWide : ''}`}
            >
              <span className={s.ico}>{skill.ico}</span>
              <h3 className={s.scH3}>{skill.t}</h3>
              <div className={s.tgs}>
                {skill.tags.map((tag, j) => (
                  <span key={j} className={s.tg}>{tag}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </StaggerChildren>
      </div>

      <div className={s.sec}>
        <SectionHeader tag="Career" title="Experience" tagClass={s.secTag} titleClass={s.secTitle} wrapperClass={s.secH} />
        <div className={s.tl}>
          {data.exp.map((exp, i) => (
            <AnimatedSection key={i} direction="left" delay={i * 0.1} scale>
              <div className={s.ti}>
                <div className={s.tc}>
                  <div className={s.tcMeta}>
                    <h3 className={s.tcH3}>{exp.t}</h3>
                    <span className={s.dt}>{exp.dt}</span>
                  </div>
                  <div className={s.co}>{exp.co}</div>
                  <p className={s.td}>{exp.d}</p>
                  <ul className={s.tcUl}>
                    {exp.a.map((a, j) => (
                      <li key={j} className={s.tcLi}>{a}</li>
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
      </div>

      {data.projects.length > 0 && (
        <div className={s.sec}>
          <SectionHeader tag="Work" title="Projects" tagClass={s.secTag} titleClass={s.secTitle} wrapperClass={s.secH} />
          <StaggerChildren className={s.pg}>
            {data.projects.map((project, i) => (
              <motion.a
                key={i}
                variants={staggerItem}
                whileHover={{ y: -6, transition: { type: 'spring' as const, stiffness: 320, damping: 22 } }}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className={s.pc}
              >
                <div className={s.pcImg}>
                  {project.image && (
                    <Image src={project.image} alt={project.title} fill style={{ objectFit: 'cover' }} sizes="560px" />
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
                  <span className={s.pcLink}>View →</span>
                </div>
              </motion.a>
            ))}
          </StaggerChildren>
        </div>
      )}

      <div className={s.sec}>
        <SectionHeader tag="Contact" title="Reach Out" tagClass={s.secTag} titleClass={s.secTitle} wrapperClass={s.secH} />
        <StaggerChildren className={s.cg} stagger={0.06}>
          <motion.a variants={staggerItem} whileHover={contactHover} href={`mailto:${data.email}`} className={s.cc}>
            <span className={s.ci}>✉</span>
            <h3 className={s.ccH3}>Email</h3>
            <span className={s.ccA}>{data.email}</span>
          </motion.a>
          <motion.a variants={staggerItem} whileHover={contactHover} href={`tel:+57${data.phone.replace(/\D/g, '').slice(2)}`} className={s.cc}>
            <span className={s.ci}>📱</span>
            <h3 className={s.ccH3}>Phone</h3>
            <span className={s.ccA}>{data.phone}</span>
          </motion.a>
          <motion.a variants={staggerItem} whileHover={contactHover} href={`https://${data.github}`} target="_blank" rel="noopener noreferrer" className={s.cc}>
            <span className={s.ci}>⟡</span>
            <h3 className={s.ccH3}>GitHub</h3>
            <span className={s.ccA}>{data.github}</span>
          </motion.a>
          <motion.div variants={staggerItem} whileHover={contactHover} className={s.cc}>
            <span className={s.ci}>📍</span>
            <h3 className={s.ccH3}>Location</h3>
            <span className={s.ccP}>{data.loc}</span>
          </motion.div>
          <ContactForm />
        </StaggerChildren>
      </div>
    </div>
  );
}
