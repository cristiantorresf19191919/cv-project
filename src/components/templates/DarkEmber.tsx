'use client';

import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';
import { useContent } from '@/context/ContentContext';
import { useLanguage } from '@/context/LanguageContext';
import AnimatedSection from '@/components/shared/AnimatedSection';
import StaggerChildren, { staggerItem } from '@/components/shared/StaggerChildren';
import AnimatedCounter from '@/components/shared/AnimatedCounter';
import ContactForm from '@/components/shared/ContactForm';
import Footer from '@/components/shared/Footer';
import s from '@/styles/ember.module.css';
import { parseBold } from '@/utils/parseBold';
import { useSkillHighlight } from '@/context/SkillHighlightContext';
import { getTechColor } from '@/utils/techBrandColors';
import { useCopyToClipboard } from '@/utils/contactActions';
import { EmailIcon, PhoneIcon, GithubIcon, LocationIcon } from '@/components/shared/ContactIcons';

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
  const { activeSkill, setActiveSkill } = useSkillHighlight();
  const { copied, copy } = useCopyToClipboard();

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

          {data.availability === 'open' && (
            <motion.div variants={popIn} className={s.availBadge}>
              <span className={s.availDot} />
              {t.openToWork}
            </motion.div>
          )}

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
                <AnimatedCounter value={stat.n} className={s.statNum} />
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
                  <span
                    key={j}
                    className={`${s.skillTag} ${activeSkill === tag ? s.skillTagActive : ''}`}
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
              className={`${s.expCard} ${activeSkill && !exp.tech.includes(activeSkill) ? s.expCardDimmed : ''} ${activeSkill && exp.tech.includes(activeSkill) ? s.expCardHighlighted : ''}`}
            >
              <div className={s.expCompany}>{exp.co}</div>
              <h3 className={s.expTitle}>{exp.t}</h3>
              <div className={s.expDate}>{exp.dt}</div>
              <p className={s.expDesc}>{exp.d}</p>
              {exp.a && exp.a.length > 0 && (
                <ul className={s.expAchievements}>
                  {exp.a.map((a, j) => (
                    <li key={j} className={s.expAchievementItem}><span>{parseBold(a)}</span></li>
                  ))}
                </ul>
              )}
              {exp.tech.length > 0 && (
                <div className={s.expTech}>
                  {exp.tech.map((techItem, j) => (
                    <span key={j} className={s.expTechTag}>{techItem}</span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </StaggerChildren>
      </section>

      {/* ── Testimonials ─────────────────────────────── */}
      {data.testimonials && data.testimonials.length > 0 && (
        <section className={s.section}>
          <AnimatedSection>
            <div className={s.sectionHeader}>
              <div className={s.sectionTag}>{t.testimonialsTag}</div>
              <h2 className={s.sectionTitle}>{t.testimonials}</h2>
            </div>
          </AnimatedSection>

          <StaggerChildren className={s.testimonialsGrid} stagger={0.12}>
            {data.testimonials.map((testimonial, i) => (
              <motion.div
                key={i}
                variants={staggerItem}
                whileHover={cardHover}
                className={s.testimonialCard}
              >
                <div className={s.testimonialQuote}>&ldquo;{testimonial.quote}&rdquo;</div>
                <div className={s.testimonialAuthor}>
                  <div className={s.testimonialName}>{testimonial.name}</div>
                  <div className={s.testimonialRole}>
                    {testimonial.role} &middot; {testimonial.company}
                  </div>
                </div>
              </motion.div>
            ))}
          </StaggerChildren>
        </section>
      )}

      {/* ── Education ────────────────────────────────── */}
      <section className={s.section}>
        <AnimatedSection>
          <div className={s.sectionHeader}>
            <div className={s.sectionTag}>{t.educationTag}</div>
            <h2 className={s.sectionTitle}>{t.education}</h2>
          </div>
        </AnimatedSection>

        <StaggerChildren className={s.eduGrid} stagger={0.1}>
          {data.education.map((edu, i) => (
            <motion.div
              key={i}
              variants={staggerItem}
              whileHover={cardHover}
              className={s.eduCard}
            >
              <div className={s.eduIcon}>🎓</div>
              <div className={s.eduDegree}>{edu.degree}</div>
              <div className={s.eduSchool}>{edu.school}</div>
              <div className={s.eduDate}>{edu.date}</div>
              {edu.desc && <div className={s.eduDesc}>{edu.desc}</div>}
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

      {/* ── Contact Detail Cards ────────────────────── */}
      <AnimatedSection direction="up" delay={0.1}>
        <div className={s.contactDetailGrid}>
          <div
            className={s.contactDetailCard}
            onClick={() => copy(data.email, 'email')}
          >
            <div className={s.contactDetailIcon}><EmailIcon /></div>
            <div className={s.contactDetailLabel}>{copied === 'email' ? 'Copied!' : t.email}</div>
            <div className={s.contactDetailValue}>{data.email}</div>
          </div>
          <div
            className={s.contactDetailCard}
            onClick={() => copy(data.phone, 'phone')}
          >
            <div className={s.contactDetailIcon}><PhoneIcon /></div>
            <div className={s.contactDetailLabel}>{copied === 'phone' ? 'Copied!' : t.phone}</div>
            <div className={s.contactDetailValue}>{data.phone}</div>
          </div>
          <a
            className={s.contactDetailCard}
            href={`https://${data.github}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none' }}
          >
            <div className={s.contactDetailIcon}><GithubIcon /></div>
            <div className={s.contactDetailLabel}>GitHub</div>
            <div className={s.contactDetailValue}>{data.github}</div>
          </a>
          <a
            className={s.contactDetailCard}
            href={`https://maps.google.com/?q=${encodeURIComponent(data.loc)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none' }}
          >
            <div className={s.contactDetailIcon}><LocationIcon /></div>
            <div className={s.contactDetailLabel}>{t.location}</div>
            <div className={s.contactDetailValue}>{data.loc}</div>
          </a>
        </div>
      </AnimatedSection>

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
          <ContactForm />
        </section>
      </AnimatedSection>

      <Footer />
    </div>
  );
}
