import Link from 'next/link';

const links = [
  { href: '/products', label: 'Products' },
  { href: '/performance', label: 'Performance' },
  { href: '/resources', label: 'Resources' },
  { href: '/pricing', label: 'Pricing' },
];

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="brand" href="/" prefetch>
          <span className="brand-mark">TT</span>
          <span>TAHITIAN <span className="gradient">TRADER</span></span>
        </Link>

        <nav className="nav" aria-label="Primary navigation">
          {links.map((link) => (
            <Link key={link.href} className="nav-link" href={link.href} prefetch>
              {link.label}
            </Link>
          ))}
          <Link className="nav-link" href="/login" prefetch>Login</Link>
          <Link className="btn btn-primary" href="/products" prefetch>Explore products</Link>
        </nav>

        <details className="mobile-nav">
          <summary className="mobile-toggle" aria-label="Open navigation">☰</summary>
          <div className="mobile-menu">
            {links.map((link) => (
              <Link key={link.href} href={link.href} prefetch>{link.label}</Link>
            ))}
            <Link href="/login" prefetch>Login</Link>
            <Link className="btn btn-accent" href="/products" prefetch style={{marginTop:8}}>Explore products</Link>
          </div>
        </details>
      </div>
    </header>
  );
}
