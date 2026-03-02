'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useContent } from '@/context/ContentContext';
import AnimatedSection from '@/components/shared/AnimatedSection';
import StaggerChildren, { staggerItem } from '@/components/shared/StaggerChildren';
import SectionHeader from '@/components/shared/SectionHeader';
import ContactForm from '@/components/shared/ContactForm';
import s from '@/styles/horizon.module.css';

const heroContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const heroItem = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const photoReveal = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const skillHover = {
  y: -4,
  transition: { type: 'spring' as const, stiffness: 400, damping: 28 },
};

const contactHover = {
  scale: 1.02,
  transition: { type: 'spring' as const, stiffness: 400, damping: 28 },
};

export default function Horizon() {
  const { data, photoUrl } = useContent();

  return (
    <div className={s.template}>
      <div className={s.hero}>
        <motion.div initial="hidden" animate="visible" variants={heroContainer} className={s.heroContent}>
          <motion.div variants={heroItem} className={s.heroLine} />
          <motion.span variants={heroItem} className={s.heroTag}>{data.title}</motion.span>
          <motion.h1 variants={heroItem} className={s.h1}>
            {data.name}
          </motion.h1>
          <motion.h1 variants={heroItem} className={s.h1Last}>
            {data.last}
          </motion.h1>
          <motion.p variants={heroItem} className={s.sub}>{data.tagline}</motion.p>
          <motion.div variants={heroItem} className={s.desc}>{data.desc}</motion.div>
          <motion.div variants={heroItem} className={s.stats}>
            {data.stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 + i * 0.08 }}
                className={s.statItem}
              >
                <span className={s.stN}>{stat.n}</span>
                <span className={s.stL}>{stat.l}</span>
              </motion.div>
            ))}
          </motion.div>
          <motion.div variants={heroItem} className={s.btns}>
            <a href={`mailto:${data.email}`} className={s.b1}>Get in touch</a>
            <a href={`https://${data.github}`} target="_blank" rel="noopener noreferrer" className={s.b2}>GitHub</a>
          </motion.div>
        </motion.div>
        <motion.div initial="hidden" animate="visible" variants={photoReveal} className={s.photoSide}>
          <div className={s.photoFrame}>
            <Image src={photoUrl} alt={data.name} fill sizes="420px" className="profile-photo" priority />
          </div>
        </motion.div>
      </div>

      <div className={s.sec}>
        <div className={s.secRule} />
        <SectionHeader tag="Skills" title="Expertise" tagClass={s.secTag} titleClass={s.secTitle} wrapperClass={s.secH} />
        <StaggerChildren className={s.sg} stagger={0.06}>
          {data.skills.map((skill, i) => (
            <motion.div
              key={i}
              variants={staggerItem}
              whileHover={skillHover}
              className={s.sc}
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
        <div className={s.secRule} />
        <SectionHeader tag="Career" title="Experience" tagClass={s.secTag} titleClass={s.secTitle} wrapperClass={s.secH} />
        <div className={s.tl}>
          {data.exp.map((exp, i) => (
            <AnimatedSection key={i} direction="right" delay={i * 0.08} scale>
              <div className={s.ti}>
                <div className={s.tc}>
                  <div className={s.tcHead}>
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
          <div className={s.secRule} />
          <SectionHeader tag="Work" title="Projects" tagClass={s.secTag} titleClass={s.secTitle} wrapperClass={s.secH} />
          <StaggerChildren className={s.pg}>
            {data.projects.map((project, i) => (
              <motion.a
                key={i}
                variants={staggerItem}
                whileHover={{ y: -4, transition: { type: 'spring' as const, stiffness: 350, damping: 24 } }}
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
                  <span className={s.pcLink}>View project</span>
                </div>
              </motion.a>
            ))}
          </StaggerChildren>
        </div>
      )}

      <div className={s.sec}>
        <div className={s.secRule} />
        <SectionHeader tag="Contact" title="Connect" tagClass={s.secTag} titleClass={s.secTitle} wrapperClass={s.secH} />
        <StaggerChildren className={s.cg} stagger={0.05}>
          <motion.a variants={staggerItem} whileHover={contactHover} href={`mailto:${data.email}`} className={s.cc}>
            <span className={s.ci}>Email</span>
            <span className={s.ccA}>{data.email}</span>
          </motion.a>
          <motion.a variants={staggerItem} whileHover={contactHover} href={`tel:+57${data.phone.replace(/\D/g, '').slice(2)}`} className={s.cc}>
            <span className={s.ci}>Phone</span>
            <span className={s.ccA}>{data.phone}</span>
          </motion.a>
          <motion.a variants={staggerItem} whileHover={contactHover} href={`https://${data.github}`} target="_blank" rel="noopener noreferrer" className={s.cc}>
            <span className={s.ci}>GitHub</span>
            <span className={s.ccA}>{data.github}</span>
          </motion.a>
          <motion.div variants={staggerItem} whileHover={contactHover} className={s.cc}>
            <span className={s.ci}>Location</span>
            <span className={s.ccP}>{data.loc}</span>
          </motion.div>
          <ContactForm />
        </StaggerChildren>
      </div>
    </div>
  );
}
