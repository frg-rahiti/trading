import type { Metadata } from 'next';
import { Sora, Manrope, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import './premium.css';

const sora = Sora({ subsets: ['latin'], variable: '--font-display', display: 'swap' });
const manrope = Manrope({ subsets: ['latin'], variable: '--font-body', display: 'swap' });
const plexMono = IBM_Plex_Mono({ subsets: ['latin'], variable: '--font-mono', weight: ['400', '500', '600'], display: 'swap' });

export const metadata: Metadata = {
  title: 'Tahitian Trader — Algorithmic Trading Technology',
  description: 'Systematic trading algorithms, MetaTrader 5 Expert Advisors and TradingView strategies.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${sora.variable} ${manrope.variable} ${plexMono.variable}`}>{children}</body></html>;
}
