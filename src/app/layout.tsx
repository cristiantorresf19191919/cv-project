import type { Metadata } from 'next';
import {
  Cormorant_Garamond,
  Montserrat,
  Playfair_Display,
  Space_Mono,
  Bebas_Neue,
  Syne,
  Outfit,
  Crimson_Pro,
} from 'next/font/google';
import './globals.css';
import { ContentProvider } from '@/context/ContentContext';
import { TemplateProvider } from '@/context/TemplateContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { SkillHighlightProvider } from '@/context/SkillHighlightContext';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-montserrat',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-mono',
  display: 'swap',
});

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-bebas',
  display: 'swap',
});

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-syne',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-outfit',
  display: 'swap',
});

const crimsonPro = Crimson_Pro({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-crimson',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Cristian Torres - Full Stack Developer | React & Next.js Specialist',
  description:
    'React & Next.js specialist with 5+ years shipping production web products at Audi and Driveway.com. Expert in TypeScript, React Query, GraphQL, and micro-service architecture.',
  keywords: [
    'Cristian Torres',
    'Full Stack Developer',
    'React Developer',
    'Next.js',
    'TypeScript',
    'Frontend Engineer',
    'Portfolio',
    'Bogota Colombia',
  ],
  authors: [{ name: 'Cristian Torres' }],
  creator: 'Cristian Torres',
  metadataBase: new URL('https://cristiantorres.dev'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Cristian Torres - Full Stack Developer',
    description:
      'React & Next.js specialist with 5+ years shipping production web products. 12 stunning portfolio templates.',
    siteName: 'Cristian Torres Portfolio',
    images: [
      {
        url: '/images/og-cover.png',
        width: 1200,
        height: 630,
        alt: 'Cristian Torres - Full Stack Developer Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cristian Torres - Full Stack Developer',
    description:
      'React & Next.js specialist with 5+ years shipping production web products.',
    images: ['/images/og-cover.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Cristian Torres',
    jobTitle: 'Full Stack Developer',
    description:
      'React & Next.js specialist with 5+ years shipping production web products at Audi and Driveway.com.',
    url: 'https://cristiantorres.dev',
    sameAs: [
      'https://github.com/cristiantorresf19191919',
      'https://linkedin.com/in/cristian-torres-dev',
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Bogota',
      addressCountry: 'CO',
    },
    knowsAbout: [
      'React',
      'Next.js',
      'TypeScript',
      'Node.js',
      'GraphQL',
      'Kotlin',
      'Spring Boot',
    ],
  });

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd }}
        />
      </head>
      <body
        className={`${cormorant.variable} ${montserrat.variable} ${playfair.variable} ${spaceMono.variable} ${bebasNeue.variable} ${syne.variable} ${outfit.variable} ${crimsonPro.variable}`}
      >
        <LanguageProvider>
          <ContentProvider>
            <SkillHighlightProvider>
              <TemplateProvider>{children}</TemplateProvider>
            </SkillHighlightProvider>
          </ContentProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
