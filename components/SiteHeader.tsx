'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '../lib/supabase';
import LanguageSwitcher from './LanguageSwitcher';

export default function SiteHeader() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [locale, setLocale] = useState<'en' | 'fr'>('en');

  useEffect(() => {
    const match = document.cookie.match(/(?:^|; )tt-locale=(fr|en)/);
    setLocale(match?.[1] === 'fr' ? 'fr' : 'en');
    const supabase = createClient();
    let mounted = true;
    supabase.auth.getUser().then(({ data }) => {
      if (mounted) {
        setUserEmail(data.user?.email ?? null);
        setReady(true);
      }
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setUserEmail(session?.user?.email ?? null);
        setReady(true);
      }
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

  const text = locale === 'fr'
    ? { products: 'Produits', performance: 'Performances', resources: 'Ressources', login: 'Connexion', signOut: 'Déconnexion', dashboard: 'Tableau de bord', explore: 'Voir les produits', home: 'Accueil Tahitian Trader', nav: 'Navigation principale', open: 'Ouvrir la navigation' }
    : { products: 'Products', performance: 'Performance', resources: 'Resources', login: 'Login', signOut: 'Sign out', dashboard: 'Dashboard', explore: 'Explore products', home: 'Tahitian Trader home', nav: 'Primary navigation', open: 'Open navigation' };

  const links = [
    { href: '/products', label: text.products },
    { href: '/performance', label: text.performance },
    { href: '/resources', label: text.resources },
  ];

  const accountLink = userEmail ? null : <Link className="nav-link" href="/login" prefetch>{text.login}</Link>;
  const accountAction = userEmail ? <button className="nav-link nav-button" type="button" onClick={signOut}>{text.signOut}</button> : null;
  const primaryCta = userEmail ? <Link className="btn btn-primary" href="/dashboard" prefetch>{text.dashboard}</Link> : <Link className="btn btn-primary" href="/products" prefetch>{text.explore}</Link>;
  const mobilePrimaryCta = userEmail ? <Link className="btn btn-accent" href="/dashboard" prefetch style={{ marginTop: 8 }}>{text.dashboard}</Link> : <Link className="btn btn-accent" href="/products" prefetch style={{ marginTop: 8 }}>{text.explore}</Link>;

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="brand" href="/" prefetch aria-label={text.home}>
          <span className="brand-mark">TT</span>
          <span>TAHITIAN <span className="gradient">TRADER</span></span>
        </Link>
        <nav className="nav" aria-label={text.nav}>
          {links.map((link) => <Link key={link.href} className="nav-link" href={link.href} prefetch>{link.label}</Link>)}
          {ready && accountLink}
          {ready && accountAction}
          <LanguageSwitcher />
          {ready && primaryCta}
        </nav>
        <details className="mobile-nav">
          <summary className="mobile-toggle" aria-label={text.open}>☰</summary>
          <div className="mobile-menu">
            {links.map((link) => <Link key={link.href} href={link.href} prefetch>{link.label}</Link>)}
            {ready && accountLink}
            {ready && accountAction}
            <LanguageSwitcher />
            {ready && mobilePrimaryCta}
          </div>
        </details>
      </div>
    </header>
  );
}
