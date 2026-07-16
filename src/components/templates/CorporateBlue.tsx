'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useContent } from '@/context/ContentContext';
import { parseBold } from '@/utils/parseBold';
import s from '@/styles/corporate.module.css';

/* ─── Local mini icons (kept small + PDF-safe: solid strokes, currentColor) ─── */
function Svg({ size = 16, children }: { size?: number; children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const PinIcon = () => (
  <Svg>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </Svg>
);
const PhoneIcon = () => (
  <Svg>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </Svg>
);
const MailIcon = () => (
  <Svg>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </Svg>
);
const GithubIcon = () => (
  <Svg>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65S8.93 17.38 9 18v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </Svg>
);
const UserIcon = () => (
  <Svg size={17}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </Svg>
);
const BriefcaseIcon = () => (
  <Svg size={17}>
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </Svg>
);
const ChatIcon = () => (
  <Svg size={17}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </Svg>
);
const CapIcon = () => (
  <Svg size={17}>
    <path d="M22 10 12 5 2 10l10 5 10-5Z" />
    <path d="M6 12v5c0 1 2.5 2.5 6 2.5s6-1.5 6-2.5v-5" />
  </Svg>
);

/* ─── Language proficiency → bar fill ─────────────────────────── */
function levelPct(level: string): number {
  const l = level.toLowerCase();
  if (l.includes('native') || l.includes('nativo')) return 100;
  if (l.includes('c2')) return 96;
  if (l.includes('c1') || l.includes('professional') || l.includes('profesional') || l.includes('avanzado') || l.includes('fluent')) return 88;
  if (l.includes('b2')) return 74;
  if (l.includes('b1')) return 60;
  if (l.includes('a2')) return 42;
  if (l.includes('basic') || l.includes('básico') || l.includes('basico')) return 35;
  return 70;
}

export default function CorporateBlue() {
  const { data, photoUrl } = useContent();

  const skillList = data.skills.flatMap((g) => g.tags.slice(0, 3)).slice(0, 10);

  const contacts = [
    { icon: <PinIcon />, text: data.loc, href: `https://maps.google.com/?q=${encodeURIComponent(data.loc)}` },
    { icon: <PhoneIcon />, text: data.phone, href: `tel:${data.phone.replace(/\s+/g, '')}` },
    { icon: <MailIcon />, text: data.email, href: `mailto:${data.email}` },
    { icon: <GithubIcon />, text: data.github, href: `https://${data.github}` },
  ];

  return (
    <div className={s.template}>
      <motion.div
        className={s.sheet}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
      >
        {/* ═══ LEFT COLUMN — photo + navy panel ═══ */}
        <aside className={s.sidebar}>
          <div className={s.photoWrap}>
            <Image
              src={photoUrl}
              alt={`${data.name} ${data.last}`}
              fill
              sizes="(max-width: 820px) 100vw, 360px"
              className="profile-photo"
              priority
            />
          </div>

          <div className={s.navyPanel}>
            {/* Contact */}
            <section className={s.sideBlock}>
              <h2 className={s.sideHead}>Contact</h2>
              <ul className={s.contactList}>
                {contacts.map((c, i) => (
                  <li key={i} className={s.contactRow}>
                    <a
                      className={s.contactLink}
                      href={c.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className={s.contactBadge}>{c.icon}</span>
                      <span className={s.contactText}>{c.text}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>

            {/* Skills / Aptitudes */}
            <section className={s.sideBlock}>
              <h2 className={s.sideHead}>Skills</h2>
              <ul className={s.skillList}>
                {skillList.map((tag, i) => (
                  <li key={i} className={s.skillItem}>
                    <span className={s.skillDot} />
                    {tag}
                  </li>
                ))}
              </ul>
            </section>

            {/* Languages */}
            {data.languages && data.languages.length > 0 && (
              <section className={s.sideBlock}>
                <h2 className={s.sideHead}>Languages</h2>
                <ul className={s.langList}>
                  {data.languages.map((lang, i) => (
                    <li key={i} className={s.langItem}>
                      <div className={s.langTop}>
                        <span className={s.langName}>{lang.name}</span>
                        <span className={s.langLevel}>{lang.level}</span>
                      </div>
                      <div className={s.langBar}>
                        <span
                          className={s.langFill}
                          style={{ width: `${levelPct(lang.level)}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Education / Diplomas (compact) */}
            <section className={s.sideBlock}>
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
          </div>
        </aside>

        {/* ═══ RIGHT COLUMN — white main ═══ */}
        <main className={s.main}>
          <header className={s.header}>
            <h1 className={s.name}>
              <span>{data.name}</span>
              <span className={s.nameLast}>{data.last}</span>
            </h1>
            <p className={s.title}>{data.title}</p>
          </header>

          {/* Profile */}
          <section className={s.section}>
            <div className={s.secHead}>
              <span className={s.secBadge}>
                <UserIcon />
              </span>
              <h2 className={s.secHeadText}>Profile</h2>
            </div>
            <p className={s.profileLead}>{data.tagline}</p>
            <p className={s.profileText}>{data.desc}</p>
          </section>

          {/* Work Experience */}
          <section className={s.section}>
            <div className={s.secHead}>
              <span className={s.secBadge}>
                <BriefcaseIcon />
              </span>
              <h2 className={s.secHeadText}>Work Experience</h2>
            </div>
            <div className={s.timeline}>
              {data.exp.map((exp, i) => (
                <article key={i} className={s.tItem}>
                  <span className={s.tDot} />
                  <h3 className={s.tRole}>{exp.t}</h3>
                  <div className={s.tMeta}>
                    <span className={s.tCompany}>{exp.co}</span>
                    <span className={s.tSep}>•</span>
                    <span className={s.tDate}>{exp.dt}</span>
                  </div>
                  <p className={s.tSummary}>{exp.d}</p>
                  <ul className={s.tList}>
                    {exp.a.map((bullet, j) => (
                      <li key={j} className={s.tBullet}>
                        <span>{parseBold(bullet)}</span>
                      </li>
                    ))}
                  </ul>
                  {exp.tech.length > 0 && (
                    <div className={s.tTech}>
                      {exp.tech.map((tech, j) => (
                        <span key={j} className={s.techTag}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>

          {/* Education (full) */}
          <section className={s.section}>
            <div className={s.secHead}>
              <span className={s.secBadge}>
                <CapIcon />
              </span>
              <h2 className={s.secHeadText}>Education</h2>
            </div>
            <div className={s.eduGrid}>
              {data.education.map((edu, i) => (
                <div key={i} className={s.eduCard}>
                  <div className={s.eduCardDegree}>{edu.degree}</div>
                  <div className={s.eduCardSchool}>{edu.school}</div>
                  <div className={s.eduCardDate}>{edu.date}</div>
                  {edu.desc && <p className={s.eduCardDesc}>{edu.desc}</p>}
                </div>
              ))}
            </div>
          </section>

          {/* References */}
          {data.testimonials && data.testimonials.length > 0 && (
            <section className={s.section}>
              <div className={s.secHead}>
                <span className={s.secBadge}>
                  <ChatIcon />
                </span>
                <h2 className={s.secHeadText}>References</h2>
              </div>
              <div className={s.refList}>
                {data.testimonials.map((ref, i) => (
                  <div key={i} className={s.refItem}>
                    <p className={s.refQuote}>&ldquo;{ref.quote}&rdquo;</p>
                    <div className={s.refWho}>
                      <span className={s.refName}>{ref.name}</span>
                      <span className={s.refRole}>
                        {ref.role} · {ref.company}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </motion.div>
    </div>
  );
}
