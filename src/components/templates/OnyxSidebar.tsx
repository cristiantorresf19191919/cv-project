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
import s from '@/styles/onyx.module.css';

const HOBBIES = ['Open Source', 'Technical Writing', 'Chess'];

export default function OnyxSidebar() {
  const { data, photoUrl } = useContent();

  // Flatten the 4 skill groups into a single ranked list, keep the top ~10.
  const topSkills = data.skills.flatMap((g) => g.tags).slice(0, 10);

  return (
    <div className={s.template}>
      <motion.div
        className={s.sheet}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
      >
        {/* ═══ LEFT — DARK SIDEBAR ═══ */}
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

          <h1 className={s.name}>
            {data.name} {data.last}
          </h1>
          <p className={s.role}>{data.title}</p>

          {/* Contact */}
          <section className={s.side}>
            <h2 className={s.sideHead}>Contact</h2>
            <ul className={s.contactList}>
              <li className={s.contactItem}>
                <span className={s.contactIco}>
                  <PhoneIcon />
                </span>
                <span className={s.contactText}>{data.phone}</span>
              </li>
              <li className={s.contactItem}>
                <span className={s.contactIco}>
                  <EmailIcon />
                </span>
                <span className={s.contactText}>{data.email}</span>
              </li>
              <li className={s.contactItem}>
                <span className={s.contactIco}>
                  <LocationIcon />
                </span>
                <span className={s.contactText}>{data.loc}</span>
              </li>
              <li className={s.contactItem}>
                <span className={s.contactIco}>
                  <GithubIcon />
                </span>
                <span className={s.contactText}>{data.github}</span>
              </li>
              <li className={s.contactItem}>
                <span className={s.contactIco}>
                  <LinkedinIcon />
                </span>
                <span className={s.contactText}>{data.linkedin}</span>
              </li>
            </ul>
          </section>

          {/* Skills */}
          <section className={s.side}>
            <h2 className={s.sideHead}>Skills</h2>
            <ul className={s.bulletList}>
              {topSkills.map((skill) => (
                <li key={skill} className={s.bulletItem}>
                  {skill}
                </li>
              ))}
            </ul>
          </section>

          {/* Languages */}
          {data.languages && data.languages.length > 0 && (
            <section className={s.side}>
              <h2 className={s.sideHead}>Languages</h2>
              <ul className={s.bulletList}>
                {data.languages.map((lang) => (
                  <li key={lang.name} className={s.bulletItem}>
                    <span className={s.langName}>{lang.name}:</span>
                    <span className={s.langLevel}>{lang.level}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Hobbies */}
          <section className={s.side}>
            <h2 className={s.sideHead}>Hobbies</h2>
            <ul className={s.bulletList}>
              {HOBBIES.map((hobby) => (
                <li key={hobby} className={s.bulletItem}>
                  {hobby}
                </li>
              ))}
            </ul>
          </section>
        </aside>

        {/* ═══ RIGHT — WHITE MAIN ═══ */}
        <main className={s.main}>
          {/* Profile */}
          <section className={s.sec}>
            <h2 className={s.secHead}>Profile</h2>
            <p className={s.profileText}>{data.desc}</p>
          </section>

          {/* Work Experience */}
          <section className={s.sec}>
            <h2 className={s.secHead}>Work Experience</h2>
            {data.exp.map((job, i) => (
              <div key={i} className={s.expItem}>
                <h3 className={s.expRole}>{job.t}</h3>
                <div className={s.expMeta}>
                  <span className={s.expCo}>
                    {job.co} &mdash; {data.loc}
                  </span>
                  <span className={s.expDate}>{job.dt}</span>
                </div>
                {job.d && <p className={s.expLead}>{job.d}</p>}
                <ul className={s.expBullets}>
                  {job.a.map((bullet, j) => (
                    <li key={j} className={s.expBullet}>
                      {parseBold(bullet)}
                    </li>
                  ))}
                </ul>
                {job.tech.length > 0 && (
                  <div className={s.techRow}>
                    {job.tech.map((tech) => (
                      <span key={tech} className={s.techTag}>
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </section>

          {/* Projects */}
          {data.projects.length > 0 && (
            <section className={s.sec}>
              <h2 className={s.secHead}>Projects</h2>
              {data.projects.map((project, i) => (
                <div key={i} className={s.projItem}>
                  <h3 className={s.projTitle}>{project.title}</h3>
                  <p className={s.projDesc}>{project.desc}</p>
                  {project.tech.length > 0 && (
                    <div className={s.techRow}>
                      {project.tech.map((tech) => (
                        <span key={tech} className={s.techTag}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </section>
          )}

          {/* Education */}
          <section className={s.sec}>
            <h2 className={s.secHead}>Education</h2>
            {data.education.map((edu, i) => (
              <div key={i} className={s.eduItem}>
                <h3 className={s.eduDegree}>{edu.degree}</h3>
                <div className={s.eduDate}>{edu.date}</div>
                <div className={s.eduSchool}>{edu.school}</div>
                {edu.desc && <p className={s.eduDesc}>{edu.desc}</p>}
              </div>
            ))}
          </section>

          {/* References */}
          {data.testimonials && data.testimonials.length > 0 && (
            <section className={s.sec}>
              <h2 className={s.secHead}>References</h2>
              {data.testimonials.map((ref, i) => (
                <div key={i} className={s.refItem}>
                  <p className={s.refQuote}>&ldquo;{ref.quote}&rdquo;</p>
                  <div className={s.refName}>{ref.name}</div>
                  <div className={s.refRole}>
                    {ref.role} &middot; {ref.company}
                  </div>
                </div>
              ))}
            </section>
          )}
        </main>
      </motion.div>
    </div>
  );
}
