import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import OrganicCursor from '@/components/OrganicCursor';
import ScrollTriggerManager from '@/components/ScrollTriggerManager';
import SiteNav from '@/components/SiteNav';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Kyle Colwell — Regenerative Designer & Creative Director',
  description:
    'Places, brands, and experiences inspired by living systems, crafted for lasting impact.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${cormorant.variable} ${inter.variable} h-full`}
    >
      <body className="min-h-full antialiased">
        <OrganicCursor />
        <ScrollTriggerManager />
        <SiteNav />
        {children}
      </body>
    </html>
  );
}
