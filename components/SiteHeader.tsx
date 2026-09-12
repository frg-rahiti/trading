'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '../lib/supabase';

const links = [
  { href: '/products', label: 'Products' },
  { href: '/performance', label: 'Performance' },
  { href: '/resources', label: 'Resources' },
  { href: '/pricing', label: 'Pricing' },
];

export default function SiteHeader() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    let mounted = true;

    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      setUserEmail(data.user?.email ?? null);
      setReady(true);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setUserEmail(session?.user?.email ?? null);
      setReady(true);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  async function signOut() {
    await createClient().auth.signOut();
    window.location.href = '/';
  }

  const accountLink = userEmail ? (
    <Link className="nav-link" href="/dashboard" prefetch>Dashboard</Link>
  ) : (
    <Link className="nav-link" href="/login" prefetch>Login</Link>
  );

  const accountAction = userEmail ? (
    <button className="nav-link nav-button" type="button" onClick={signOut}>Sign out</button>
  ) : null;

  const primaryCta = userEmail ? (
    <Link className="btn btn-primary" href="/dashboard" prefetch>Dashboard</Link>
  ) : (
    <Link className="btn btn-primary" href="/products" prefetch>Explore products</Link>
  );

  const mobilePrimaryCta = userEmail ? (
    <Link className="btn btn-accent" href="/dashboard" prefetch style={{marginTop:8}}>Dashboard</Link>
  ) : (
    <Link className="btn btn-accent" href="/products" prefetch style={{marginTop:8}}>Explore products</Link>
  );

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="brand" href="/" prefetch aria-label="Tahitian Trader home">
          <span className="brand-mark">TT</span>
          <span>TAHITIAN <span className="gradient">TRADER</span></span>
        </Link>

        <nav className="nav" aria-label="Primary navigation">
          {links.map((link) => (
            <Link key={link.href} className="nav-link" href={link.href} prefetch>
              {link.label}
            </Link>
          ))}
          {ready && accountLink}
          {ready && accountAction}
          {ready && primaryCta}
        </nav>

        <details className="mobile-nav">
          <summary className="mobile-toggle" aria-label="Open navigation">☰</summary>
          <div className="mobile-menu">
            {links.map((link) => (
              <Link key={link.href} href={link.href} prefetch>{link.label}</Link>
            ))}
            {ready && accountLink}
            {ready && accountAction}
            {ready && mobilePrimaryCta}
          </div>
        </details>
      </div>
    </header>
  );
}
