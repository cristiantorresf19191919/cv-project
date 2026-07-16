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
import s from '@/styles/slate.module.css';

/* ─── Tiny badge glyphs (white stroke, sit inside amber circle badges) ─── */
const mini = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

const UserGlyph = () => (
  <svg {...mini}>
    <circle cx="12" cy="8" r="3.6" />
    <path d="M4.5 20c0-3.6 3.4-5.6 7.5-5.6s7.5 2 7.5 5.6" />
  </svg>
);
const QuoteGlyph = () => (
  <svg {...mini}>
    <path d="M6 15c-1.6 0-2.6-1-2.6-2.7C3.4 9.4 5 7.4 7.8 6.6M16 15c-1.6 0-2.6-1-2.6-2.7 0-2.9 1.6-4.9 4.4-5.7" />
  </svg>
);
const CapGlyph = () => (
  <svg {...mini}>
    <path d="M12 4 2.8 8.6 12 13.2l9.2-4.6L12 4Z" />
    <path d="M6.2 10.6v4c0 1.3 2.6 2.9 5.8 2.9s5.8-1.6 5.8-2.9v-4" />
  </svg>
);
const InfoGlyph = () => (
  <svg {...mini}>
    <circle cx="12" cy="12" r="8.4" />
    <path d="M12 11.2v5M12 7.6h.02" />
  </svg>
);
const BriefcaseGlyph = () => (
  <svg {...mini}>
    <rect x="3.2" y="8" width="17.6" height="11.4" rx="2" />
    <path d="M8.4 8V6.4A2 2 0 0 1 10.4 4.4h3.2a2 2 0 0 1 2 2V8" />
  </svg>
);
const StarGlyph = () => (
  <svg {...mini}>
    <path d="M12 3.6l2.5 5.2 5.7.5-4.3 3.8 1.3 5.6L12 15.9l-5.2 2.8 1.3-5.6-4.3-3.8 5.7-.5L12 3.6Z" />
  </svg>
);

export default function SlateAmber() {
  const { data, photoUrl } = useContent();

  /* Derive ~6 skill-strength rows from the skills groups (robust with fallbacks) */
  const skillBars = [
    { label: data.skills[0]?.tags[0] ?? 'React', pct: 96 },
    { label: data.skills[0]?.tags[1] ?? 'Next.js', pct: 92 },
    { label: data.skills[1]?.tags[0] ?? 'Node.js', pct: 88 },
    { label: data.skills[1]?.tags[5] ?? 'Kotlin', pct: 80 },
    { label: data.skills[2]?.tags[0] ?? 'Azure', pct: 84 },
    { label: data.skills[3]?.tags[0] ?? 'Testing', pct: 78 },
  ].filter((b) => Boolean(b.label));

  return (
    <div className={s.template}>
      <motion.div
        className={s.sheet}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Signature amber corner wedges */}
        <span className={s.wedgeTL} aria-hidden="true" />
        <span className={s.wedgeBR} aria-hidden="true" />

        {/* ═══════════ LEFT SIDEBAR ═══════════ */}
        <aside className={s.sidebar}>
          <div className={s.photoBlock}>
            <span className={s.photoTri} aria-hidden="true" />
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
          </div>

          {/* CONTACT */}
          <section className={s.sideSec}>
            <div className={s.sideHead}>
              <span className={s.badge}>
                <UserGlyph />
              </span>
              <h3 className={s.sideTitle}>Contact Me</h3>
            </div>
            <ul className={s.contactList}>
              <li className={s.contactItem}>
                <span className={s.contactIco}>
                  <PhoneIcon />
                </span>
                <span className={s.contactTxt}>{data.phone}</span>
              </li>
              <li className={s.contactItem}>
                <span className={s.contactIco}>
                  <EmailIcon />
                </span>
                <span className={s.contactTxt}>{data.email}</span>
              </li>
              <li className={s.contactItem}>
                <span className={s.contactIco}>
                  <GithubIcon />
                </span>
                <span className={s.contactTxt}>{data.github}</span>
              </li>
              <li className={s.contactItem}>
                <span className={s.contactIco}>
                  <LinkedinIcon />
                </span>
                <span className={s.contactTxt}>{data.linkedin}</span>
              </li>
              <li className={s.contactItem}>
                <span className={s.contactIco}>
                  <LocationIcon />
                </span>
                <span className={s.contactTxt}>{data.loc}</span>
              </li>
            </ul>
          </section>

          {/* REFERENCES */}
          {data.testimonials?.length > 0 && (
            <section className={s.sideSec}>
              <div className={s.sideHead}>
                <span className={s.badge}>
                  <QuoteGlyph />
                </span>
                <h3 className={s.sideTitle}>References</h3>
              </div>
              <ul className={s.refList}>
                {data.testimonials.map((ref, i) => (
                  <li key={i} className={s.refItem}>
                    <div className={s.refName}>{ref.name}</div>
                    <div className={s.refRole}>{ref.role}</div>
                    <div className={s.refCompany}>{ref.company}</div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* EDUCATION */}
          <section className={s.sideSec}>
            <div className={s.sideHead}>
              <span className={s.badge}>
                <CapGlyph />
              </span>
              <h3 className={s.sideTitle}>Education</h3>
            </div>
            <ul className={s.eduList}>
              {data.education.map((edu, i) => (
                <li key={i} className={s.eduItem}>
                  <div className={s.eduSchool}>{edu.school}</div>
                  <div className={s.eduDegree}>{edu.degree}</div>
                  <div className={s.eduDate}>{edu.date}</div>
                </li>
              ))}
            </ul>

            {data.languages && data.languages.length > 0 && (
              <div className={s.langBlock}>
                {data.languages.map((lang, i) => (
                  <div key={i} className={s.langRow}>
                    <span className={s.langName}>{lang.name}</span>
                    <span className={s.langLevel}>{lang.level}</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </aside>

        {/* ═══════════ RIGHT MAIN ═══════════ */}
        <main className={s.main}>
          <header className={s.mainHeader}>
            <h1 className={s.name}>
              {data.name} <span className={s.nameAmber}>{data.last}</span>
            </h1>
            <div className={s.subtitle}>
              <span className={s.sqBullet} aria-hidden="true" />
              {data.title}
            </div>
          </header>

          {/* ABOUT ME */}
          <section className={s.mainSec}>
            <div className={s.mainHead}>
              <span className={s.headBar} aria-hidden="true" />
              <span className={s.badge}>
                <InfoGlyph />
              </span>
              <h2 className={s.mainTitle}>About Me</h2>
            </div>
            <p className={s.aboutText}>{data.desc}</p>
          </section>

          {/* JOB EXPERIENCE */}
          <section className={s.mainSec}>
            <div className={s.mainHead}>
              <span className={s.headBar} aria-hidden="true" />
              <span className={s.badge}>
                <BriefcaseGlyph />
              </span>
              <h2 className={s.mainTitle}>Job Experience</h2>
            </div>
            <div className={s.expList}>
              {data.exp.map((job, i) => (
                <article key={i} className={s.expItem}>
                  <div className={s.expTop}>
                    <div className={s.expHeadText}>
                      <h3 className={s.expRole}>{job.t}</h3>
                      <div className={s.expMeta}>
                        {job.co} / {data.loc}
                      </div>
                    </div>
                    <span className={s.expDate}>{job.dt}</span>
                  </div>
                  <p className={s.expSummary}>{job.d}</p>
                  {job.a.length > 0 && (
                    <ul className={s.expBullets}>
                      {job.a.slice(0, 2).map((point, j) => (
                        <li key={j} className={s.expBullet}>
                          {parseBold(point)}
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              ))}
            </div>
          </section>

          {/* SKILLS */}
          <section className={s.mainSec}>
            <div className={s.mainHead}>
              <span className={s.headBar} aria-hidden="true" />
              <span className={s.badge}>
                <StarGlyph />
              </span>
              <h2 className={s.mainTitle}>Skills</h2>
            </div>
            <div className={s.skillGrid}>
              {skillBars.map((skill, i) => (
                <div key={i} className={s.skillRow}>
                  <span className={s.skillLabel}>{skill.label}</span>
                  <div className={s.skillTrack}>
                    <span
                      className={s.skillFill}
                      style={{ width: `${skill.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </motion.div>
    </div>
  );
}
