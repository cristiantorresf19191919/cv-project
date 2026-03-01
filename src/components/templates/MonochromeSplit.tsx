'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useContent } from '@/context/ContentContext';
import { useLanguage } from '@/context/LanguageContext';
import AnimatedSection from '@/components/shared/AnimatedSection';
import StaggerChildren, { staggerItem } from '@/components/shared/StaggerChildren';
import AnimatedCounter from '@/components/shared/AnimatedCounter';
import ContactForm from '@/components/shared/ContactForm';
import { parseBold } from '@/utils/parseBold';
import { useSkillHighlight } from '@/context/SkillHighlightContext';
import { getTechColor } from '@/utils/techBrandColors';
import { useCopyToClipboard } from '@/utils/contactActions';
import { EmailIcon, PhoneIcon, GithubIcon, LocationIcon } from '@/components/shared/ContactIcons';
import s from '@/styles/monochrome.module.css';

/* ── Animation variants ── */

const panelWipe = {
  hidden: { x: '-100%', opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const photoReveal = {
  hidden: { opacity: 0, scale: 0.8, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const nameSlide = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const infoFade = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.9, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const timelineEntry = {
  hidden: { opacity: 0, y: 40, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const interestPop = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 350, damping: 20 },
  },
};

const skillHover = {
  y: -5,
  scale: 1.02,
  transition: { type: 'spring' as const, stiffness: 400, damping: 25 },
};

const cardHover = {
  y: -4,
  transition: { type: 'spring' as const, stiffness: 400, damping: 25 },
};

/* ── Interest data ── */
const interests = [
  { ico: '💻', label: 'Coding' },
  { ico: '🎮', label: 'Gaming' },
  { ico: '📚', label: 'Reading' },
  { ico: '🎵', label: 'Music' },
  { ico: '✈️', label: 'Travel' },
  { ico: '☕', label: 'Coffee' },
  { ico: '🏋️', label: 'Fitness' },
  { ico: '🎨', label: 'Design' },
];

export default function MonochromeSplit() {
  const { data, photoUrl } = useContent();
  const { t } = useLanguage();
  const { activeSkill, setActiveSkill } = useSkillHighlight();
  const { copied, copy } = useCopyToClipboard();

  return (
    <div className={s.template}>
      <div className={s.split}>
        {/* ── BLACK LEFT PANEL ── */}
        <motion.aside
          className={s.panelLeft}
          initial="hidden"
          animate="visible"
          variants={panelWipe}
        >
          {/* Photo */}
          <motion.div variants={photoReveal} className={s.photoWrap}>
            <Image
              src={photoUrl}
              alt={`${data.name} ${data.last}`}
              fill
              sizes="180px"
              className="profile-photo"
              priority
            />
          </motion.div>

          {/* Availability Badge */}
          {data.availability === 'open' && (
            <motion.div variants={infoFade} className={s.availBadge}>
              <span className={s.availDot} />
              {t.openToWork}
            </motion.div>
          )}

          {/* Vertical name */}
          <motion.div variants={nameSlide} className={s.verticalName}>
            {data.name} {data.last}
          </motion.div>

          {/* Profile info */}
          <motion.div variants={infoFade} className={s.profileInfo}>
            <div className={s.profileTitle}>{data.title}</div>
            <div className={s.profileTagline}>{data.tagline}</div>

            <div className={s.contactRow}>
              <span>📧</span>
              <a href={`mailto:${data.email}`}>{data.email}</a>
            </div>
            <div className={s.contactRow}>
              <span>📱</span>
              <a href={`tel:+57${data.phone.replace(/\D/g, '').slice(2)}`}>{data.phone}</a>
            </div>
            <div className={s.contactRow}>
              <span>📍</span>
              <span>{data.loc}</span>
            </div>

            {/* Social icons */}
            <div className={s.socials}>
              <a
                href={`https://${data.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className={s.socialBtn}
                aria-label="GitHub"
              >
                GH
              </a>
              <a
                href={`https://${data.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className={s.socialBtn}
                aria-label="LinkedIn"
              >
                in
              </a>
              <a
                href={`mailto:${data.email}`}
                className={s.socialBtn}
                aria-label="Email"
              >
                @
              </a>
            </div>
          </motion.div>
        </motion.aside>

        {/* ── WHITE RIGHT PANEL ── */}
        <main className={s.panelRight}>
          {/* About */}
          <div className={s.section}>
            <AnimatedSection direction="right" delay={0.2}>
              <div className={s.sectionHeader}>
                <span className={s.sectionTag}>{t.about}</span>
                <h2 className={s.sectionTitle}>{t.profile}</h2>
              </div>
              <hr className={s.accentLine} />
              <p className={s.aboutText}>{data.desc}</p>

              <div className={s.statsRow}>
                {data.stats.map((stat, i) => (
                  <motion.div
                    key={i}
                    className={s.statItem}
                    initial={{ opacity: 0, scale: 0.7 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: 0.4 + i * 0.12,
                      duration: 0.5,
                      type: 'spring' as const,
                      stiffness: 200,
                    }}
                  >
                    <AnimatedCounter value={stat.n} className={s.statNum} />
                    <div className={s.statLabel}>{stat.l}</div>
                  </motion.div>
                ))}
              </div>
            </AnimatedSection>
          </div>

          {/* Experience timeline */}
          <div className={s.section}>
            <AnimatedSection direction="up" delay={0.1}>
              <div className={s.sectionHeader}>
                <span className={s.sectionTag}>{t.experienceTag}</span>
                <h2 className={s.sectionTitle}>{t.experience}</h2>
              </div>
              <hr className={s.accentLine} />
            </AnimatedSection>

            <div className={s.timeline}>
              {data.exp.map((exp, i) => (
                <motion.div
                  key={i}
                  className={`${s.timelineItem} ${activeSkill && !exp.tech.includes(activeSkill) ? s.timelineDimmed : ''} ${activeSkill && exp.tech.includes(activeSkill) ? s.timelineHighlighted : ''}`}
                  variants={timelineEntry}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ delay: i * 0.15 }}
                >
                  <div className={s.timelineDot} />
                  <div className={s.timelineDate}>{exp.dt}</div>
                  <div className={s.timelineRole}>{exp.t}</div>
                  <div className={s.timelineCompany}>{exp.co}</div>
                  <div className={s.timelineDesc}>{exp.d}</div>
                  <ul className={s.timelineList}>
                    {exp.a.map((item, j) => (
                      <li key={j} className={s.timelineListItem}><span>{parseBold(item)}</span></li>
                    ))}
                  </ul>
                  <div className={s.timelineTech}>
                    {exp.tech.map((tech, j) => (
                      <span key={j} className={s.techTag}>{tech}</span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className={s.section}>
            <AnimatedSection direction="up" delay={0.1}>
              <div className={s.sectionHeader}>
                <span className={s.sectionTag}>{t.skillsTag}</span>
                <h2 className={s.sectionTitle}>{t.skills}</h2>
              </div>
              <hr className={s.accentLine} />
            </AnimatedSection>

            <StaggerChildren className={s.skillsGrid} stagger={0.1}>
              {data.skills.map((skill, i) => (
                <motion.div
                  key={i}
                  variants={staggerItem}
                  whileHover={skillHover}
                  className={s.skillCard}
                >
                  <div className={s.skillIco}>{skill.ico}</div>
                  <h3 className={s.skillTitle}>{skill.t}</h3>
                  <div className={s.skillTags}>
                    {skill.tags.map((tag, j) => (
                      <span
                        key={j}
                        className={`${s.skillTag} ${activeSkill === tag ? s.skillTagActive : ''}`}
                        onMouseEnter={() => setActiveSkill(tag)}
                        onMouseLeave={() => setActiveSkill(null)}
                        style={activeSkill === tag ? { backgroundColor: getTechColor(tag) || '#000', color: '#fff', borderColor: getTechColor(tag) || '#000' } : undefined}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </StaggerChildren>
          </div>

          {/* Testimonials */}
          {data.testimonials && data.testimonials.length > 0 && (
            <div className={s.section}>
              <AnimatedSection direction="up" delay={0.1}>
                <div className={s.sectionHeader}>
                  <span className={s.sectionTag}>{t.testimonialsTag}</span>
                  <h2 className={s.sectionTitle}>{t.testimonials}</h2>
                </div>
                <hr className={s.accentLine} />
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
              <AnimatedSection direction="right" delay={0.1}>
                <div className={s.sectionHeader}>
                  <span className={s.sectionTag}>{t.projectsTag}</span>
                  <h2 className={s.sectionTitle}>{t.projects}</h2>
                </div>
                <hr className={s.accentLine} />
              </AnimatedSection>

              <StaggerChildren className={s.projectsGrid}>
                {data.projects.map((project, i) => (
                  <motion.a
                    key={i}
                    variants={staggerItem}
                    whileHover={{
                      y: -6,
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
                          sizes="200px"
                        />
                      )}
                    </div>
                    <div className={s.projectBody}>
                      <h3 className={s.projectTitle}>{project.title}</h3>
                      <p className={s.projectDesc}>{project.desc}</p>
                      <div className={s.timelineTech}>
                        {project.tech.map((tech, j) => (
                          <span key={j} className={s.techTag}>{tech}</span>
                        ))}
                      </div>
                      <div style={{ marginTop: '0.8rem' }}>
                        <span className={s.projectLink}>{t.viewProject} &rarr;</span>
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
              <AnimatedSection direction="up" delay={0.1}>
                <div className={s.sectionHeader}>
                  <span className={s.sectionTag}>{t.educationTag}</span>
                  <h2 className={s.sectionTitle}>{t.education}</h2>
                </div>
                <hr className={s.accentLine} />
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

          {/* Interests */}
          <div className={s.section}>
            <AnimatedSection direction="up" delay={0.1}>
              <div className={s.sectionHeader}>
                <span className={s.sectionTag}>{t.passions}</span>
                <h2 className={s.sectionTitle}>{t.interests}</h2>
              </div>
              <hr className={s.accentLine} />
            </AnimatedSection>

            <StaggerChildren className={s.interestsGrid} stagger={0.08}>
              {interests.map((item, i) => (
                <motion.div
                  key={i}
                  variants={interestPop}
                  className={s.interestCard}
                >
                  <span className={s.interestIco}>{item.ico}</span>
                  <span className={s.interestLabel}>{item.label}</span>
                </motion.div>
              ))}
            </StaggerChildren>
          </div>

          {/* Contact */}
          <div className={s.section}>
            <AnimatedSection direction="up" delay={0.1}>
              <div className={s.sectionHeader}>
                <span className={s.sectionTag}>{t.contactTag}</span>
                <h2 className={s.sectionTitle}>{t.contact}</h2>
              </div>
              <hr className={s.accentLine} />
            </AnimatedSection>

            <AnimatedSection direction="up" delay={0.2}>
              <div className={s.contactGrid}>
                <div className={s.contactCard} onClick={() => copy(data.email, 'email')} style={{ cursor: 'pointer' }}>
                  <div className={s.contactCardIco}><EmailIcon /></div>
                  <div className={s.contactCardLabel}>{copied === 'email' ? 'Copied!' : t.email}</div>
                  <span className={s.contactCardValue}>{data.email}</span>
                </div>
                <div className={s.contactCard} onClick={() => copy(data.phone, 'phone')} style={{ cursor: 'pointer' }}>
                  <div className={s.contactCardIco}><PhoneIcon /></div>
                  <div className={s.contactCardLabel}>{copied === 'phone' ? 'Copied!' : t.phone}</div>
                  <span className={s.contactCardValue}>{data.phone}</span>
                </div>
                <a className={s.contactCard} href={`https://${data.github}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                  <div className={s.contactCardIco}><GithubIcon /></div>
                  <div className={s.contactCardLabel}>GitHub</div>
                  <span className={s.contactCardValue}>{data.github}</span>
                </a>
                <a className={s.contactCard} href={`https://maps.google.com/?q=${encodeURIComponent(data.loc)}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                  <div className={s.contactCardIco}><LocationIcon /></div>
                  <div className={s.contactCardLabel}>{t.location}</div>
                  <span className={s.contactCardValue}>{data.loc}</span>
                </a>
              </div>

              <div className={s.contactCTA}>
                <a href={`mailto:${data.email}`} className={s.btnPrimary}>{t.getInTouch}</a>
                <a href={`https://${data.github}`} target="_blank" rel="noopener noreferrer" className={s.btnSecondary}>{t.viewGithub}</a>
              </div>
              <ContactForm />
            </AnimatedSection>
          </div>
        </main>
      </div>
    </div>
  );
}
