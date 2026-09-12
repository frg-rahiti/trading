'use client';

import { useEffect, useState } from 'react';

type Locale = 'en' | 'fr';

export default function LanguageSwitcher() {
  const [locale, setLocale] = useState<Locale>('en');

  useEffect(() => {
    const match = document.cookie.match(/(?:^|; )tt-locale=(fr|en)/);
    setLocale(match?.[1] === 'fr' ? 'fr' : 'en');
  }, []);

  function changeLocale(next: Locale) {
    document.cookie = `tt-locale=${next}; path=/; max-age=31536000; SameSite=Lax`;
    setLocale(next);
    window.location.reload();
  }

  return (
    <div className="language-switcher" aria-label="Language selector">
      <button type="button" className={locale === 'en' ? 'active' : ''} onClick={() => changeLocale('en')} aria-pressed={locale === 'en'}>EN</button>
      <span aria-hidden="true">/</span>
      <button type="button" className={locale === 'fr' ? 'active' : ''} onClick={() => changeLocale('fr')} aria-pressed={locale === 'fr'}>FR</button>
    </div>
  );
}
