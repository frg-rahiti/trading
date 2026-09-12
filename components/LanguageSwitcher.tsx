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
    document.cookie = `tt-locale=${next}; path=/; max-age=31536000; samesite=lax`;
    setLocale(next);
    window.location.reload();
  }

  return (
    <div className="language-switcher" aria-label="Language">
      <button type="button" className={locale === 'en' ? 'active' : ''} onClick={() => changeLocale('en')}>EN</button>
      <span>/</span>
      <button type="button" className={locale === 'fr' ? 'active' : ''} onClick={() => changeLocale('fr')}>FR</button>
    </div>
  );
}
