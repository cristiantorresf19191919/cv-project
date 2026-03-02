'use client';

import { useContent } from '@/context/ContentContext';
import { useTemplate } from '@/context/TemplateContext';
import { useLanguage } from '@/context/LanguageContext';
import { THEMES } from '@/data/themes';
import { GithubIcon, LinkedinIcon, EmailIcon } from '@/components/shared/ContactIcons';
import { generateResumePDF } from '@/utils/generateResumePDF';
import styles from '@/styles/footer.module.css';

const DARK_TEMPLATES = new Set(['noir', 'term', 'neon', 'ember', 'midnight', 'horizon', 'glass']);

const FEATURED_REPOS = [
  { name: 'cv-project', desc: 'Dynamic portfolio with 12 themes', lang: 'Next.js' },
  { name: 'AuraSpa', desc: 'Spa management platform', lang: 'TypeScript' },
  { name: 'agendalo', desc: 'Smart scheduling system', lang: 'TypeScript' },
  { name: 'nestjs-admin', desc: 'NestJS admin dashboard', lang: 'TypeScript' },
  { name: 'AspNetMicroservices', desc: 'Microservices architecture', lang: 'C#' },
  { name: 'doctorily', desc: 'Healthcare management app', lang: 'Vue' },
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

  const handleDownloadPDF = () => {
    generateResumePDF(data, t);
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

      {/* Download Resume */}
      <button className={styles.downloadBtn} onClick={handleDownloadPDF} type="button">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={styles.downloadIcon}>
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
        </svg>
        {t.downloadResume}
      </button>

      {/* Featured Repos */}
      <div className={styles.reposSection}>
        <div className={styles.reposLabel}>{t.featuredRepos}</div>
        <div className={styles.reposGrid}>
          {FEATURED_REPOS.map((repo) => (
            <a
              key={repo.name}
              href={`${GITHUB_BASE}/${repo.name}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.repoCard}
            >
              <div className={styles.repoName}>
                <svg className={styles.repoIcon} viewBox="0 0 16 16" fill="currentColor">
                  <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z" />
                </svg>
                {repo.name}
              </div>
              <div className={styles.repoDesc}>{repo.desc}</div>
              <span className={styles.repoLang}>
                <span className={styles.repoLangDot} />
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
