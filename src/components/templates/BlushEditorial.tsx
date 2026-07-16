'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useContent } from '@/context/ContentContext';
import { parseBold } from '@/utils/parseBold';
import {
  EmailIcon,
  PhoneIcon,
  GithubIcon,
  LinkedinIcon,
  LocationIcon,
} from '@/components/shared/ContactIcons';
import s from '@/styles/blush.module.css';

export default function BlushEditorial() {
  const { data, photoUrl } = useContent();

  return (
    <div className={s.template}>
      <motion.div
        className={s.sheet}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* ───────────── LEFT — soft beige panel ───────────── */}
        <aside className={s.sidebar}>
          <div className={s.photoWrap}>
            <Image
              src={photoUrl}
              alt={`${data.name} ${data.last}`}
              fill
              sizes="320px"
              className="profile-photo"
              priority
            />
          </div>

          {/* Contact */}
          <section className={s.sideSection}>
            <h2 className={s.sideHead}>Contact</h2>
            <ul className={s.contactList}>
              <li className={s.contactItem}>
                <span className={s.contactIcon}>
                  <LocationIcon />
                </span>
                <span className={s.contactText}>{data.loc}</span>
              </li>
              <li className={s.contactItem}>
                <span className={s.contactIcon}>
                  <PhoneIcon />
                </span>
                <span className={s.contactText}>{data.phone}</span>
              </li>
              <li className={s.contactItem}>
                <span className={s.contactIcon}>
                  <EmailIcon />
                </span>
                <span className={s.contactText}>{data.email}</span>
              </li>
              <li className={s.contactItem}>
                <span className={s.contactIcon}>
                  <GithubIcon />
                </span>
                <span className={s.contactText}>{data.github}</span>
              </li>
              <li className={s.contactItem}>
                <span className={s.contactIcon}>
                  <LinkedinIcon />
                </span>
                <span className={s.contactText}>{data.linkedin}</span>
              </li>
            </ul>
          </section>

          {/* Profile summary */}
          <section className={s.sideSection}>
            <h2 className={s.sideHead}>Profile</h2>
            <p className={s.profileText}>{data.desc}</p>
          </section>

          {/* Education */}
          <section className={s.sideSection}>
            <h2 className={s.sideHead}>Education</h2>
            <ul className={s.eduList}>
              {data.education.map((edu, i) => (
                <li key={i} className={s.eduItem}>
                  <div className={s.eduDegree}>{edu.degree}</div>
                  <div className={s.eduSchool}>{edu.school}</div>
                  <div className={s.eduDate}>{edu.date}</div>
                </li>
              ))}
            </ul>
          </section>

          {/* Languages */}
          {data.languages && data.languages.length > 0 && (
            <section className={s.sideSection}>
              <h2 className={s.sideHead}>Languages</h2>
              <ul className={s.langList}>
                {data.languages.map((lang, i) => (
                  <li key={i} className={s.langItem}>
                    <span className={s.langName}>{lang.name}</span>
                    <span className={s.langLevel}>{lang.level}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </aside>

        {/* ───────────── RIGHT — main content ───────────── */}
        <main className={s.main}>
          <header className={s.nameBlock}>
            <h1 className={s.name}>
              <span className={s.nameLine}>{data.name}</span>
              <span className={s.nameLine}>{data.last}</span>
            </h1>
            <p className={s.title}>{data.title}</p>
            {data.availability === 'open' && (
              <span className={s.availBadge}>
                <span className={s.availDot} />
                Available for work
              </span>
            )}
          </header>

          {/* Experience */}
          <section className={s.mainSection}>
            <div className={s.pill}>Experience</div>
            <div className={s.expList}>
              {data.exp.map((exp, i) => (
                <article key={i} className={s.expItem}>
                  <h3 className={s.expRole}>{exp.t}</h3>
                  <div className={s.expMeta}>
                    <span className={s.expCo}>{exp.co}</span>
                    <span className={s.expSep}>·</span>
                    <span className={s.expDate}>{exp.dt}</span>
                  </div>
                  <p className={s.expSummary}>{exp.d}</p>
                  <ul className={s.bullets}>
                    {exp.a.map((b, j) => (
                      <li key={j} className={s.bullet}>
                        {parseBold(b)}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>

          {/* Skills */}
          <section className={s.mainSection}>
            <div className={s.pill}>Skills</div>
            <div className={s.skillsGrid}>
              {data.skills.map((sk, i) => (
                <div key={i} className={s.skillGroup}>
                  <h3 className={s.skillGroupTitle}>
                    <span className={s.skillIco}>{sk.ico}</span>
                    {sk.t}
                  </h3>
                  <ul className={s.skillList}>
                    {sk.tags.map((tag, j) => (
                      <li key={j} className={s.skillItem}>
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* References */}
          {data.testimonials && data.testimonials.length > 0 && (
            <section className={s.mainSection}>
              <div className={s.pill}>References</div>
              <div className={s.refList}>
                {data.testimonials.map((tItem, i) => (
                  <blockquote key={i} className={s.refItem}>
                    <p className={s.refQuote}>&ldquo;{tItem.quote}&rdquo;</p>
                    <footer className={s.refFooter}>
                      <span className={s.refName}>{tItem.name}</span>
                      <span className={s.refRole}>
                        {tItem.role} · {tItem.company}
                      </span>
                    </footer>
                  </blockquote>
                ))}
              </div>
            </section>
          )}
        </main>
      </motion.div>
    </div>
  );
}
