'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useContent } from '@/context/ContentContext';
import { useLanguage } from '@/context/LanguageContext';
import AnimatedSection from '@/components/shared/AnimatedSection';
import StaggerChildren, { staggerItem } from '@/components/shared/StaggerChildren';
import AnimatedCounter from '@/components/shared/AnimatedCounter';
import s from '@/styles/executive.module.css';

/* ─── Animation Variants ───────────────────────────────────────── */
const sidebarSlide = {
  hidden: { opacity: 0, x: -60, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const mainFadeUp = {
  hidden: { opacity: 0, y: 40, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const photoReveal = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, delay: 0.3, type: 'spring' as const, stiffness: 200 },
  },
};

const skillPillVariant = {
  hidden: { opacity: 0, scale: 0.85, y: 8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const cardHover = {
  y: -4,
  transition: { type: 'spring' as const, stiffness: 400, damping: 25 },
};

const achievementHover = {
  x: 4,
  transition: { type: 'spring' as const, stiffness: 400, damping: 25 },
};

export default function ExecutivePro() {
  const { data, photoUrl } = useContent();
  const { t } = useLanguage();

  return (
    <div className={s.template}>
      <div className={s.layout}>
        {/* ═══ LEFT SIDEBAR ═══ */}
        <motion.aside
          className={s.sidebar}
          initial="hidden"
          animate="visible"
          variants={sidebarSlide}
        >
          {/* Photo */}
          <motion.div className={s.photoWrap} variants={photoReveal}>
            <div className={s.photoRing} />
            <div className={s.photoInner}>
              <Image
                src={photoUrl}
                alt={`${data.name} ${data.last}`}
                fill
                sizes="150px"
                className="profile-photo"
                priority
              />
            </div>
          </motion.div>

          {/* Name & Title */}
          <div className={s.sidebarName}>
            {data.name} {data.last}
          </div>
          <div className={s.sidebarTitle}>{data.title}</div>

          {/* Availability Badge */}
          {data.availability === 'open' && (
            <div className={s.availBadge}>
              <span className={s.availDot} />
              {t.openToWork}
            </div>
          )}

          {/* Contact Info */}
          <div className={s.sidebarSecTitle}>{t.contact}</div>
          <ul className={s.contactList}>
            <li className={s.contactItem}>
              <span className={s.contactIcon}>📧</span>
              <a href={`mailto:${data.email}`} className={s.contactLink}>
                {data.email}
              </a>
            </li>
            <li className={s.contactItem}>
              <span className={s.contactIcon}>📱</span>
              <a href={`tel:${data.phone.replace(/\s/g, '')}`} className={s.contactLink}>
                {data.phone}
              </a>
            </li>
            <li className={s.contactItem}>
              <span className={s.contactIcon}>📍</span>
              <span>{data.loc}</span>
            </li>
            <li className={s.contactItem}>
              <span className={s.contactIcon}>💻</span>
              <a
                href={`https://${data.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className={s.contactLink}
              >
                {data.github}
              </a>
            </li>
            <li className={s.contactItem}>
              <span className={s.contactIcon}>🔗</span>
              <a
                href={`https://${data.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className={s.contactLink}
              >
                {data.linkedin}
              </a>
            </li>
          </ul>

          {/* Skills */}
          <div className={s.sidebarSecTitle}>{t.skills}</div>
          <div className={s.skillTags}>
            {data.skills.map((skill) => (
              <div key={skill.t} className={s.skillGroup}>
                <div className={s.skillGroupTitle}>
                  <span className={s.skillGroupIco}>{skill.ico}</span>
                  {skill.t}
                </div>
                <StaggerChildren stagger={0.04}>
                  <div className={s.skillTags}>
                    {skill.tags.map((tag, j) => (
                      <motion.span
                        key={j}
                        variants={skillPillVariant}
                        className={s.skillPill}
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </div>
                </StaggerChildren>
              </div>
            ))}
          </div>

          {/* Achievements / Stats */}
          <div className={s.sidebarSecTitle}>{t.achievements}</div>
          {data.stats.map((stat, i) => (
            <motion.div
              key={i}
              className={s.achievementCard}
              whileHover={achievementHover}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.12, duration: 0.5 }}
            >
              <div className={s.achievementTop}>
                <span className={s.achievementIco}>
                  {i === 0 ? '🏆' : i === 1 ? '🏢' : '🚀'}
                </span>
                <span className={s.achievementTitle}>{stat.n}</span>
              </div>
              <div className={s.achievementDesc}>{stat.l}</div>
            </motion.div>
          ))}

          {/* CTA Buttons */}
          <div className={s.sidebarCta}>
            <a href={`mailto:${data.email}`} className={s.ctaPrimary}>
              ✉️ {t.getInTouch}
            </a>
            <a
              href={`https://${data.github}`}
              target="_blank"
              rel="noopener noreferrer"
              className={s.ctaSecondary}
            >
              💻 {t.viewGithub}
            </a>
          </div>
        </motion.aside>

        {/* ═══ RIGHT MAIN CONTENT ═══ */}
        <motion.main
          className={s.main}
          initial="hidden"
          animate="visible"
          variants={mainFadeUp}
        >
          {/* Summary */}
          <AnimatedSection>
            <div className={s.summarySection}>
              <div className={s.secHeader}>
                <div className={s.secTag}>{t.profile}</div>
                <h2 className={s.secTitle}>{t.summary}</h2>
              </div>
              <div className={s.summaryTagline}>{data.tagline}</div>
              <p className={s.summaryText}>{data.desc}</p>

              <div className={s.statsRow}>
                {data.stats.map((stat, i) => (
                  <motion.div
                    key={i}
                    className={s.statCard}
                    whileHover={cardHover}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: 0.5 + i * 0.1,
                      duration: 0.5,
                      type: 'spring' as const,
                      stiffness: 200,
                    }}
                  >
                    <AnimatedCounter value={stat.n} className={s.statNumber} />
                    <div className={s.statLabel}>{stat.l}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* Experience Timeline */}
          <AnimatedSection>
            <div className={s.expSection}>
              <div className={s.secHeader}>
                <div className={s.secTag}>{t.experienceTag}</div>
                <h2 className={s.secTitle}>{t.experience}</h2>
              </div>
              <div className={s.timeline}>
                {data.exp.map((exp, i) => (
                  <AnimatedSection key={i} direction="right" delay={i * 0.1}>
                    <div className={s.timelineItem}>
                      <div className={s.timelineDot} />
                      <motion.div className={s.timelineCard} whileHover={cardHover}>
                        <h3 className={s.expTitle}>{exp.t}</h3>
                        <div className={s.expMeta}>
                          <span className={s.expCompany}>{exp.co}</span>
                          <span className={s.expDot}>●</span>
                          <span className={s.expDate}>{exp.dt}</span>
                        </div>
                        <p className={s.expDesc}>{exp.d}</p>
                        <ul className={s.expAchievements}>
                          {exp.a.map((achievement, j) => (
                            <li key={j} className={s.expAchievementItem}>
                              {achievement}
                            </li>
                          ))}
                        </ul>
                        <div className={s.expTech}>
                          {exp.tech.map((tech, j) => (
                            <span key={j} className={s.expTechTag}>
                              {tech}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* Projects */}
          {data.projects.length > 0 && (
            <AnimatedSection>
              <div className={s.projectsSection}>
                <div className={s.secHeader}>
                  <div className={s.secTag}>{t.projectsTag}</div>
                  <h2 className={s.secTitle}>{t.projects}</h2>
                </div>
                <StaggerChildren className={s.projectsGrid} stagger={0.12}>
                  {data.projects.map((project, i) => (
                    <motion.a
                      key={i}
                      variants={staggerItem}
                      whileHover={{
                        y: -4,
                        transition: { type: 'spring' as const, stiffness: 300, damping: 20 },
                      }}
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={s.projectCard}
                    >
                      <div className={s.projectImage}>
                        {project.image && (
                          <Image
                            src={project.image}
                            alt={project.title}
                            fill
                            style={{ objectFit: 'cover' }}
                            sizes="220px"
                          />
                        )}
                      </div>
                      <div className={s.projectBody}>
                        <h3 className={s.projectTitle}>{project.title}</h3>
                        <p className={s.projectDesc}>{project.desc}</p>
                        <div className={s.projectTech}>
                          {project.tech.map((tech, j) => (
                            <span key={j} className={s.expTechTag}>
                              {tech}
                            </span>
                          ))}
                        </div>
                        <span className={s.projectLink}>
                          {t.viewProject} →
                        </span>
                      </div>
                    </motion.a>
                  ))}
                </StaggerChildren>
              </div>
            </AnimatedSection>
          )}

          {/* Testimonials */}
          {data.testimonials && data.testimonials.length > 0 && (
            <AnimatedSection>
              <div className={s.testimonialsSection}>
                <div className={s.secHeader}>
                  <div className={s.secTag}>{t.testimonialsTag}</div>
                  <h2 className={s.secTitle}>{t.testimonials}</h2>
                </div>
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
            </AnimatedSection>
          )}

          {/* Education */}
          <AnimatedSection>
            <div className={s.eduSection}>
              <div className={s.secHeader}>
                <div className={s.secTag}>{t.educationTag}</div>
                <h2 className={s.secTitle}>{t.education}</h2>
              </div>
              <StaggerChildren className={s.eduGrid} stagger={0.1}>
                {data.education.map((edu, i) => (
                  <motion.div key={i} variants={staggerItem} whileHover={cardHover} className={s.eduCard}>
                    <div className={s.eduDegree}>{edu.degree}</div>
                    <div className={s.eduSchool}>{edu.school}</div>
                    <div className={s.eduDate}>{edu.date}</div>
                    {edu.desc && <div className={s.eduDesc}>{edu.desc}</div>}
                  </motion.div>
                ))}
              </StaggerChildren>
            </div>
          </AnimatedSection>
        </motion.main>
      </div>
    </div>
  );
}
