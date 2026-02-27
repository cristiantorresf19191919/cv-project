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
  title: 'Cristian Torres - Full Stack Developer',
  description: 'React / Next.js specialist with 5+ years building performant web products.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${cormorant.variable} ${montserrat.variable} ${playfair.variable} ${spaceMono.variable} ${bebasNeue.variable} ${syne.variable} ${outfit.variable} ${crimsonPro.variable}`}
      >
        <ContentProvider>
          <TemplateProvider>{children}</TemplateProvider>
        </ContentProvider>
      </body>
    </html>
  );
}
