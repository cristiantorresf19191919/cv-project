'use client';

import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';
import { useContent } from '@/context/ContentContext';
import { useLanguage } from '@/context/LanguageContext';
import AnimatedSection from '@/components/shared/AnimatedSection';
import StaggerChildren, { staggerItem } from '@/components/shared/StaggerChildren';
import s from '@/styles/ember.module.css';

/* ── Animation variants ───────────────────────────────── */

const heroContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const slideFromLeft = {
  hidden: { opacity: 0, x: -60, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const slideFromRight = {
  hidden: { opacity: 0, x: 60, filter: 'blur(6px)', scale: 0.92 },
  visible: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    scale: 1,
    transition: { duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const popIn = {
  hidden: { opacity: 0, scale: 0.7, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.6, delay: 0.2, type: 'spring' as const, stiffness: 300, damping: 20 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const cardHover = {
  y: -6,
  scale: 1.02,
  transition: { type: 'spring' as const, stiffness: 400, damping: 25 },
};

/* ── Skill bar data ───────────────────────────────────── */

const skillBarData = [
  { label: 'Frontend', pct: 95 },
  { label: 'Backend', pct: 85 },
  { label: 'Database', pct: 75 },
  { label: 'Testing', pct: 80 },
];

const languageData = [
  { name: 'English', pct: 95, level: 'Fluent' },
  { name: 'Spanish', pct: 100, level: 'Native' },
];

/* ── Animated skill bar sub-component ─────────────────── */

function SkillBar({ label, pct }: { label: string; pct: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <div className={s.skillBarItem} ref={ref}>
      <div className={s.skillBarHeader}>
        <span className={s.skillBarLabel}>{label}</span>
        <motion.span
          className={s.skillBarPct}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          {isInView ? `${pct}%` : '0%'}
        </motion.span>
      </div>
      <div className={s.skillBarTrack}>
        <motion.div
          className={s.skillBarFill}
          initial={{ width: '0%' }}
          animate={isInView ? { width: `${pct}%` } : { width: '0%' }}
          transition={{ duration: 1.2, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}

/* ── Language bar sub-component ────────────────────────── */

function LanguageBar({ name, pct, level }: { name: string; pct: number; level: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <div className={s.langItem} ref={ref}>
      <span className={s.langName}>{name}</span>
      <div className={s.langTrack}>
        <motion.div
          className={s.langFill}
          initial={{ width: '0%' }}
          animate={isInView ? { width: `${pct}%` } : { width: '0%' }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <span className={s.langLevel}>{level}</span>
    </div>
  );
}

/* ── Main component ───────────────────────────────────── */

export default function DarkEmber() {
  const { data, photoUrl } = useContent();
  const { t } = useLanguage();

  return (
    <div className={s.template}>
      {/* ── Hero ─────────────────────────────────────── */}
      <section className={s.hero}>
        <motion.div
          className={s.heroContent}
          initial="hidden"
          animate="visible"
          variants={heroContainer}
        >
          <motion.div variants={popIn} className={s.badge}>
            <span className={s.badgeDot} />
            {data.title}
          </motion.div>

          <motion.h1 variants={slideFromLeft} className={s.heroName}>
            {data.name}{' '}
            <span className={s.heroNameAccent}>{data.last}</span>
          </motion.h1>

          <motion.p variants={fadeUp} className={s.heroTagline}>
            {data.tagline}
          </motion.p>

          <motion.p variants={fadeUp} className={s.heroDesc}>
            {data.desc}
          </motion.p>

          <motion.div variants={fadeUp} className={s.heroBtns}>
            <a href={`mailto:${data.email}`} className={s.btnPrimary}>
              {t.getInTouch}
            </a>
            <a
              href={`https://${data.github}`}
              target="_blank"
              rel="noopener noreferrer"
              className={s.btnSecondary}
            >
              {t.viewGithub}
            </a>
          </motion.div>

          <motion.div variants={fadeUp} className={s.stats}>
            {data.stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 0.9 + i * 0.12,
                  duration: 0.5,
                  type: 'spring' as const,
                  stiffness: 200,
                }}
              >
                <div className={s.statNum}>{stat.n}</div>
                <div className={s.statLabel}>{stat.l}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={slideFromRight}>
          <div className={s.photoWrap}>
            <Image
              src={photoUrl}
              alt={`${data.name} ${data.last}`}
              fill
              sizes="370px"
              className="profile-photo"
              priority
            />
            <div className={s.photoGlow} />
          </div>
        </motion.div>
      </section>

      {/* ── Skills — Proficiency Bars ────────────────── */}
      <section className={s.section}>
        <AnimatedSection>
          <div className={s.sectionHeader}>
            <div className={s.sectionTag}>{t.skillsTag}</div>
            <h2 className={s.sectionTitle}>{t.skills}</h2>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          <div className={s.skillBars}>
            {skillBarData.map((bar) => (
              <SkillBar key={bar.label} label={bar.label} pct={bar.pct} />
            ))}
          </div>
        </AnimatedSection>

        {/* Skill category cards from data */}
        <StaggerChildren className={s.skillsGrid} stagger={0.1}>
          {data.skills.map((skill, i) => (
            <motion.div
              key={i}
              variants={staggerItem}
              whileHover={cardHover}
              className={s.skillCard}
            >
              <div className={s.skillCardIcon}>{skill.ico}</div>
              <h3 className={s.skillCardTitle}>{skill.t}</h3>
              <div className={s.skillCardTags}>
                {skill.tags.map((tag, j) => (
                  <span key={j} className={s.skillTag}>{tag}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </StaggerChildren>

        {/* Language Proficiency */}
        <AnimatedSection delay={0.2}>
          <div className={s.langBars}>
            {languageData.map((lang) => (
              <LanguageBar
                key={lang.name}
                name={lang.name}
                pct={lang.pct}
                level={lang.level}
              />
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* ── Experience ───────────────────────────────── */}
      <section className={s.section}>
        <AnimatedSection>
          <div className={s.sectionHeader}>
            <div className={s.sectionTag}>{t.experienceTag}</div>
            <h2 className={s.sectionTitle}>{t.experience}</h2>
          </div>
        </AnimatedSection>

        <StaggerChildren className={s.expGrid} stagger={0.12}>
          {data.exp.map((exp, i) => (
            <motion.div
              key={i}
              variants={staggerItem}
              whileHover={cardHover}
              className={s.expCard}
            >
              <div className={s.expCompany}>{exp.co}</div>
              <h3 className={s.expTitle}>{exp.t}</h3>
              <div className={s.expDate}>{exp.dt}</div>
              <p className={s.expDesc}>{exp.d}</p>
              {exp.tech.length > 0 && (
                <div className={s.expTech}>
                  {exp.tech.map((t, j) => (
                    <span key={j} className={s.expTechTag}>{t}</span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </StaggerChildren>
      </section>

      {/* ── Education ────────────────────────────────── */}
      <section className={s.section}>
        <AnimatedSection>
          <div className={s.sectionHeader}>
            <div className={s.sectionTag}>{t.education}</div>
            <h2 className={s.sectionTitle}>{t.education}</h2>
          </div>
        </AnimatedSection>

        <StaggerChildren className={s.eduGrid} stagger={0.1}>
          {data.stats.map((stat, i) => (
            <motion.div
              key={i}
              variants={staggerItem}
              whileHover={cardHover}
              className={s.eduCard}
            >
              <div className={s.eduIcon}>🎓</div>
              <div className={s.eduDegree}>{stat.n}</div>
              <div className={s.eduSchool}>{stat.l}</div>
            </motion.div>
          ))}
        </StaggerChildren>
      </section>

      {/* ── Projects ─────────────────────────────────── */}
      {data.projects.length > 0 && (
        <section className={s.section}>
          <AnimatedSection>
            <div className={s.sectionHeader}>
              <div className={s.sectionTag}>{t.projectsTag}</div>
              <h2 className={s.sectionTitle}>{t.projects}</h2>
            </div>
          </AnimatedSection>

          <StaggerChildren className={s.projectsGrid} stagger={0.1}>
            {data.projects.map((project, i) => (
              <motion.a
                key={i}
                variants={staggerItem}
                whileHover={{
                  y: -8,
                  transition: { type: 'spring' as const, stiffness: 300, damping: 20 },
                }}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className={s.projectCard}
              >
                <div className={s.projectImg}>
                  {project.image && (
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="600px"
                    />
                  )}
                </div>
                <div className={s.projectBody}>
                  <h3 className={s.projectTitle}>{project.title}</h3>
                  <p className={s.projectDesc}>{project.desc}</p>
                  <div className={s.expTech}>
                    {project.tech.map((t, j) => (
                      <span key={j} className={s.expTechTag}>{t}</span>
                    ))}
                  </div>
                  <div style={{ marginTop: '1rem' }}>
                    <span className={s.projectLink}>{t.viewProject} &rarr;</span>
                  </div>
                </div>
              </motion.a>
            ))}
          </StaggerChildren>
        </section>
      )}

      {/* ── Contact CTA ──────────────────────────────── */}
      <AnimatedSection direction="up" scale>
        <section className={s.contactSection}>
          <h2 className={s.contactTitle}>{t.contact}</h2>
          <p className={s.contactDesc}>{data.tagline}</p>
          <div className={s.contactLinks}>
            <a href={`mailto:${data.email}`} className={s.contactBtnFill}>
              {t.getInTouch}
            </a>
            <a
              href={`https://${data.github}`}
              target="_blank"
              rel="noopener noreferrer"
              className={s.contactBtn}
            >
              {t.viewGithub}
            </a>
            <a
              href={`https://${data.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              className={s.contactBtn}
            >
              LinkedIn
            </a>
          </div>
        </section>
      </AnimatedSection>

      {/* ── Footer ───────────────────────────────────── */}
      <footer className={s.footer}>
        {data.name} {data.last} &middot; {data.loc}
      </footer>
    </div>
  );
}
