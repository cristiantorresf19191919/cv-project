'use client';

import { useContent } from '@/context/ContentContext';
import { useTemplate } from '@/context/TemplateContext';
import { useLanguage } from '@/context/LanguageContext';
import { THEMES } from '@/data/themes';
import { GithubIcon, LinkedinIcon, EmailIcon } from '@/components/shared/ContactIcons';
import ExportMenu from '@/components/shared/ExportMenu';
import { getTechColor } from '@/utils/techBrandColors';
import styles from '@/styles/footer.module.css';

const DARK_TEMPLATES = new Set(['noir', 'term', 'neon', 'ember', 'midnight', 'horizon', 'glass']);

interface FeaturedRepo {
  name: string;
  desc: string;
  lang: string;
  /** External live URL — when present the card links here instead of GitHub. */
  url?: string;
  live?: boolean;
}

const FEATURED_REPOS: FeaturedRepo[] = [
  { name: 'solcity', desc: 'Solar energy platform · Google Solar SDK roof scan', lang: 'Next.js', url: 'https://solcity.com.co', live: true },
  { name: 'agencypartner2', desc: 'Developer hub — courses & live code playgrounds', lang: 'Next.js', url: 'https://agencypartner2.netlify.app', live: true },
  { name: 'cv-project', desc: 'Dynamic portfolio with 23 themes & i18n', lang: 'Next.js' },
  { name: 'kotlin-spring-microservices', desc: 'Kotlin Spring Boot reactive microservices', lang: 'Kotlin' },
  { name: 'AuraSpa', desc: 'Spa management platform with real-time booking', lang: 'TypeScript' },
  { name: 'AspNetMicroservices', desc: 'Microservices with CQRS & event sourcing', lang: 'C#' },
  { name: 'nestjs-admin', desc: 'NestJS admin dashboard & API', lang: 'TypeScript' },
  { name: 'agendalo', desc: 'Smart scheduling with drag-and-drop', lang: 'TypeScript' },
];

const GITHUB_BASE = 'https://github.com/cristiantorresf19191919';

export default function Footer() {
  const { data } = useContent();
  const { current } = useTemplate();
  const { t } = useLanguage();
  const theme = THEMES[current];
  const isDark = DARK_TEMPLATES.has(current);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      className={`${styles.footer} ${isDark ? '' : styles.footerLight}`}
      style={{ ['--footer-accent' as string]: theme.accent }}
    >
      <div className={styles.socials}>
        {data.github && (
          <a
            href={`https://${data.github}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
            aria-label="GitHub"
          >
            <GithubIcon />
          </a>
        )}
        {data.linkedin && (
          <a
            href={`https://${data.linkedin}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
            aria-label="LinkedIn"
          >
            <LinkedinIcon />
          </a>
        )}
        {data.email && (
          <a
            href={`mailto:${data.email}`}
            className={styles.socialLink}
            aria-label="Email"
          >
            <EmailIcon />
          </a>
        )}
      </div>

      {/* Export Menu (replaces single PDF button) */}
      <ExportMenu />

      {/* Featured Repos */}
      <div className={styles.reposSection}>
        <div className={styles.reposLabel}>{t.featuredRepos}</div>
        <div className={styles.reposGrid}>
          {FEATURED_REPOS.map((repo) => (
            <a
              key={repo.name}
              href={repo.url ?? `${GITHUB_BASE}/${repo.name}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.repoCard}
            >
              <div className={styles.repoName}>
                {repo.live ? (
                  <svg className={styles.repoIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <circle cx="12" cy="12" r="9" />
                    <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
                  </svg>
                ) : (
                  <svg className={styles.repoIcon} viewBox="0 0 16 16" fill="currentColor" aria-hidden>
                    <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z" />
                  </svg>
                )}
                {repo.name}
                {repo.live && <span className={styles.repoLive}>live</span>}
              </div>
              <div className={styles.repoDesc}>{repo.desc}</div>
              <span className={styles.repoLang}>
                <span
                  className={styles.repoLangDot}
                  style={{ background: getTechColor(repo.lang) || undefined }}
                />
                {repo.lang}
              </span>
            </a>
          ))}
        </div>
      </div>

      <div className={styles.copyright}>
        &copy; {new Date().getFullYear()} {data.name} {data.last}. {t.rights}.
      </div>

      <div className={styles.credit}>{t.builtWith}</div>

      <button className={styles.backToTop} onClick={scrollToTop} type="button">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
        {t.backToTop}
      </button>
    </footer>
  );
}
