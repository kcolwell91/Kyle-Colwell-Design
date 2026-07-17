import type { Metadata } from 'next';
import { Josefin_Sans } from 'next/font/google';

const josefin = Josefin_Sans({
  subsets: ['latin'],
  weight: ['300', '400'],
  variable: '--font-minimal-sans',
});

export const metadata: Metadata = {
  title: 'Kyle Colwell — Creative Direction',
  description:
    'Creative direction for hospitality brands and places people remember.',
  openGraph: {
    title: 'Kyle Colwell — Creative Direction',
    description:
      'Creative direction for hospitality brands and places people remember.',
    type: 'website',
  },
};

export default function ClassicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className={josefin.variable}>{children}</div>;
}
