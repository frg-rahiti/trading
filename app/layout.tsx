import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tahitian Trader — Algorithmic Trading Technology',
  description: 'Systematic trading algorithms, MetaTrader 5 Expert Advisors and TradingView strategies.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
