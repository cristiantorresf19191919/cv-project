'use client';

import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';
import { useContent } from '@/context/ContentContext';
import { useLanguage } from '@/context/LanguageContext';
import AnimatedSection from '@/components/shared/AnimatedSection';
import StaggerChildren, { staggerItem } from '@/components/shared/StaggerChildren';
import s from '@/styles/midnight.module.css';

/* ---------- animation variants ---------- */

const slideLeft = {
  hidden: { opacity: 0, x: -60, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const slideRight = {
  hidden: { opacity: 0, x: 60, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const socialPop = {
  hidden: { opacity: 0, scale: 0 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: 0.7 + i * 0.1, type: 'spring' as const, stiffness: 400, damping: 18 },
  }),
};

const cardHover = {
  y: -6,
  scale: 1.02,
  transition: { type: 'spring' as const, stiffness: 400, damping: 25 },
};

/* ---------- skill bar data ---------- */

interface SkillBar {
  name: string;
  pct: number;
  colorClass: string;
}

const skillBars: SkillBar[] = [
  { name: 'React', pct: 95, colorClass: s.barTeal },
  { name: 'TypeScript', pct: 90, colorClass: s.barBlue },
  { name: 'Next.js', pct: 92, colorClass: s.barPurple },
  { name: 'Node.js', pct: 85, colorClass: s.barGreen },
  { name: 'GraphQL', pct: 80, colorClass: s.barPink },
  { name: 'Docker', pct: 70, colorClass: s.barOrange },
  { name: 'PostgreSQL', pct: 78, colorClass: s.barIndigo },
  { name: 'Kotlin', pct: 65, colorClass: s.barRed },
];

/* ---------- SkillBar sub-component ---------- */

function AnimatedSkillBar({ skill, index }: { skill: SkillBar; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <div ref={ref} className={s.skillBarItem}>
      <div className={s.skillBarHeader}>
        <span className={s.skillBarName}>{skill.name}</span>
        <span className={s.skillBarPct}>{skill.pct}%</span>
      </div>
      <div className={s.skillBarTrack}>
        <motion.div
          className={`${s.skillBarFill} ${skill.colorClass}`}
          initial={{ width: 0 }}
          animate={inView ? { width: `${skill.pct}%` } : { width: 0 }}
          transition={{
            duration: 1,
            delay: index * 0.12,
            ease: [0.22, 1, 0.36, 1] as const,
          }}
        />
      </div>
    </div>
  );
}

/* ---------- main component ---------- */

export default function MidnightPortfolio() {
  const { data, photoUrl } = useContent();
  const { t } = useLanguage();

  /* social links config */
  const socials = [
    { href: `https://${data.github}`, label: 'GH', ariaLabel: 'GitHub' },
    { href: `https://${data.linkedin}`, label: 'in', ariaLabel: 'LinkedIn' },
    { href: `mailto:${data.email}`, label: '@', ariaLabel: 'Email' },
  ];

  return (
    <div className={s.template}>
      <div className={s.grid}>
        {/* ============ LEFT SIDEBAR ============ */}
        <motion.aside
          className={s.left}
          initial="hidden"
          animate="visible"
          variants={slideLeft}
        >
          {/* Photo */}
          <div className={s.photoRing}>
            <div className={s.photoInner}>
              <Image
                src={photoUrl}
                alt={`${data.name} ${data.last}`}
                fill
                sizes="160px"
                className="profile-photo"
                style={{ objectFit: 'cover' }}
                priority
              />
            </div>
          </div>

          {/* Name & title */}
          <div className={s.sidebarName}>
            {data.name} {data.last}
          </div>
          <div className={s.sidebarTitle}>{data.title}</div>

          {/* Availability Badge */}
          {data.availability === 'open' && (
            <div className={s.availBadge}>
              <span className={s.availDot} />
              {t.availableForHire}
            </div>
          )}

          <div className={s.divider} />

          {/* Contact info */}
          <div className={s.contactList}>
            <div className={s.contactItem}>
              <span className={s.contactIcon}>📧</span>
              <a href={`mailto:${data.email}`} className={s.contactText}>
                {data.email}
              </a>
            </div>
            <div className={s.contactItem}>
              <span className={s.contactIcon}>📱</span>
              <a href={`tel:${data.phone}`} className={s.contactText}>
                {data.phone}
              </a>
            </div>
            <div className={s.contactItem}>
              <span className={s.contactIcon}>📍</span>
              <span className={s.contactText}>{data.loc}</span>
            </div>
          </div>

          <div className={s.divider} />

          {/* Social icons */}
          <div className={s.socials}>
            {socials.map((social, i) => (
              <motion.a
                key={social.ariaLabel}
                href={social.href}
                target={social.href.startsWith('mailto') ? undefined : '_blank'}
                rel="noopener noreferrer"
                className={s.socialLink}
                aria-label={social.ariaLabel}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={socialPop}
              >
                {social.label}
              </motion.a>
            ))}
          </div>

          {/* Download resume */}
          <a href="#" className={s.downloadBtn}>
            ⬇ {t.downloadResume}
          </a>
        </motion.aside>

        {/* ============ CENTER CONTENT ============ */}
        <main className={s.center}>
          {/* About section */}
          <AnimatedSection direction="up" className={s.section}>
            <div className={s.sectionLabel}>{t.about}</div>
            <h2 className={s.sectionTitle}>
              {data.name} {data.last}
            </h2>
            <p className={s.aboutText}>{data.desc}</p>

            {/* Stats */}
            <div className={s.statsRow}>
              {data.stats.map((stat, i) => (
                <motion.div
                  key={i}
                  className={s.statCard}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: 0.3 + i * 0.12,
                    duration: 0.5,
                    type: 'spring' as const,
                    stiffness: 200,
                  }}
                >
                  <div className={s.statNum}>{stat.n}</div>
                  <div className={s.statLabel}>{stat.l}</div>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>

          {/* Services / skills grid */}
          <div className={s.section}>
            <AnimatedSection direction="up">
              <div className={s.sectionLabel}>{t.services}</div>
              <h2 className={s.sectionTitle}>{t.skills}</h2>
            </AnimatedSection>
            <StaggerChildren className={s.serviceGrid} stagger={0.1}>
              {data.skills.map((skill, i) => (
                <motion.div
                  key={i}
                  variants={staggerItem}
                  whileHover={cardHover}
                  className={s.serviceCard}
                >
                  <div className={s.serviceIcon}>{skill.ico}</div>
                  <h3 className={s.serviceTitle}>{skill.t}</h3>
                  <div className={s.serviceTags}>
                    {skill.tags.map((tag, j) => (
                      <span key={j} className={s.serviceTag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </StaggerChildren>
          </div>

          {/* Skill bars inline (visible when right sidebar hidden on tablet) */}
          <div className={`${s.section} ${s.mobileSkillBars}`}>
            <AnimatedSection direction="up">
              <div className={s.sectionLabel}>{t.tools}</div>
              <h2 className={s.sectionTitle}>{t.skills}</h2>
            </AnimatedSection>
            <div className={s.skillBars}>
              {skillBars.map((skill, i) => (
                <AnimatedSkillBar key={skill.name} skill={skill} index={i} />
              ))}
            </div>
          </div>

          {/* Experience */}
          <div className={s.section}>
            <AnimatedSection direction="up">
              <div className={s.sectionLabel}>{t.experienceTag}</div>
              <h2 className={s.sectionTitle}>{t.experience}</h2>
            </AnimatedSection>
            {data.exp.map((exp, i) => (
              <AnimatedSection key={i} direction="up" delay={i * 0.12} scale>
                <div className={s.expCard}>
                  <h3 className={s.expRole}>{exp.t}</h3>
                  <div className={s.expMeta}>
                    <span className={s.expCompany}>{exp.co}</span>
                    <span className={s.expDot}>•</span>
                    <span className={s.expDate}>{exp.dt}</span>
                  </div>
                  <p className={s.expDesc}>{exp.d}</p>
                  <ul className={s.expList}>
                    {exp.a.map((item, j) => (
                      <li key={j} className={s.expListItem}>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className={s.expTech}>
                    {exp.tech.map((t, j) => (
                      <span key={j} className={s.expTechTag}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* Testimonials */}
          {data.testimonials && data.testimonials.length > 0 && (
            <div className={s.section}>
              <AnimatedSection direction="up">
                <div className={s.sectionLabel}>{t.testimonialsTag}</div>
                <h2 className={s.sectionTitle}>{t.testimonials}</h2>
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
            </div>
          )}

          {/* Projects */}
          {data.projects.length > 0 && (
            <div className={s.section}>
              <AnimatedSection direction="up">
                <div className={s.sectionLabel}>{t.projectsTag}</div>
                <h2 className={s.sectionTitle}>{t.projects}</h2>
              </AnimatedSection>
              <StaggerChildren className={s.projectGrid}>
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
                          sizes="400px"
                        />
                      )}
                    </div>
                    <div className={s.projectBody}>
                      <h3 className={s.projectTitle}>{project.title}</h3>
                      <p className={s.projectDesc}>{project.desc}</p>
                      <div className={s.expTech}>
                        {project.tech.map((t, j) => (
                          <span key={j} className={s.expTechTag}>
                            {t}
                          </span>
                        ))}
                      </div>
                      <div style={{ marginTop: '0.8rem' }}>
                        <span className={s.projectLink}>{t.viewProject} →</span>
                      </div>
                    </div>
                  </motion.a>
                ))}
              </StaggerChildren>
            </div>
          )}

          {/* Education */}
          {data.education && data.education.length > 0 && (
            <div className={s.section}>
              <AnimatedSection direction="up">
                <div className={s.sectionLabel}>{t.educationTag}</div>
                <h2 className={s.sectionTitle}>{t.education}</h2>
              </AnimatedSection>
              <StaggerChildren className={s.eduGrid} stagger={0.1}>
                {data.education.map((edu, i) => (
                  <motion.div
                    key={i}
                    variants={staggerItem}
                    whileHover={cardHover}
                    className={s.eduCard}
                  >
                    <div className={s.eduDegree}>{edu.degree}</div>
                    <div className={s.eduSchool}>{edu.school}</div>
                    <div className={s.eduDate}>{edu.date}</div>
                    {edu.desc && <div className={s.eduDesc}>{edu.desc}</div>}
                  </motion.div>
                ))}
              </StaggerChildren>
            </div>
          )}
        </main>

        {/* ============ RIGHT SIDEBAR ============ */}
        <motion.aside
          className={s.right}
          initial="hidden"
          animate="visible"
          variants={slideRight}
        >
          <h3 className={s.rightTitle}>{t.tools}</h3>
          <div className={s.skillBars}>
            {skillBars.map((skill, i) => (
              <AnimatedSkillBar key={skill.name} skill={skill} index={i} />
            ))}
          </div>

          <div className={s.rightDivider} />

          {/* Extra tool tags from skill data */}
          <h3 className={s.rightTitle}>{t.skills}</h3>
          <div className={s.toolsList}>
            {data.skills
              .flatMap((sk) => sk.tags)
              .slice(0, 12)
              .map((tag, i) => (
                <motion.div
                  key={i}
                  className={s.toolItem}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                >
                  <span className={s.toolDot} />
                  {tag}
                </motion.div>
              ))}
          </div>
        </motion.aside>
      </div>
    </div>
  );
}
