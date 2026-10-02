import type { Metadata } from 'next';
import './globals.css';
import ScrollObserver from '@/components/ScrollObserver';
import ScrollProgress from '@/components/ScrollProgress';

export const metadata: Metadata = {
  title: '1-Credit Industry-Oriented Hands-On Training on VLSI Front-End Design Using Synopsys EDA Tools | SRI SHAKTHI INSTITUTE OF ENGINEERING AND TECHNOLOGY',
  description: '1-Credit Industry-Oriented Hands-On Training on VLSI Front-End Design Using Synopsys EDA Tools at SRI SHAKTHI INSTITUTE OF ENGINEERING AND TECHNOLOGY, Dept of EE (VDT). October 23 & 24, 2026. 30 Dedicated 1:1 CAD Workstations.',
  keywords: [
    'VLSI Workshop',
    'Synopsys EDA',
    'SRI SHAKTHI INSTITUTE OF ENGINEERING AND TECHNOLOGY',
    'Design Compiler',
    'Synopsys VCS',
    'Verdi Waveform',
    'SpyGlass CDC',
    'Front-End VLSI Design',
    'MeitY C2S'
  ],
  authors: [{ name: 'SRI SHAKTHI INSTITUTE OF ENGINEERING AND TECHNOLOGY' }],
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased selection:bg-purple-100 selection:text-purple-900 bg-white text-slate-900 min-h-screen">
        <ScrollProgress />
        <ScrollObserver />
        {children}
      </body>
    </html>
  );
}
