import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { navLinks } from '../App';

function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (e, id) => {
    if (isHome) {
      e.preventDefault();
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className={`fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-glass-border h-16 flex justify-between items-center px-margin-mobile header-nav${scrolled ? ' header-scrolled' : ''}`}>
        <Link to="/" className="flex items-center gap-2" data-testid="header-logo-link">
          <img src="/assets/servai-logo.webp" alt="ServAI" className="logo" />
        </Link>
        <div className="flex items-center gap-stack-lg ml-auto mr-stack-lg">
          <nav className="nav-links">
            {navLinks.map(({ id, label }) => (
              <a key={id} href={`/#${id}`}
                onClick={(e) => handleNavClick(e, id)}
                data-testid={`header-link-${id}`}>
                {label}
              </a>
            ))}
          </nav>
        </div>
        <div className="nav-actions">
          <a href="https://app.serv-ai.com/login" target="_blank" rel="noopener noreferrer"
            className="btn-outline nav-trial-btn">Start Free Trial</a>
          <a href="/#demo" className="btn-primary" onClick={(e) => handleNavClick(e, 'demo')}
            data-testid="header-request-demo-btn">Request Demo</a>
          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="header-mobile-menu-toggle">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile menu — light glass consistent with header */}
      {mobileMenuOpen && (
        <div style={{
          position:'fixed', top:'64px', left:0, right:0, zIndex:49,
          background:'rgba(255, 255, 255, 0.95)', backdropFilter:'blur(20px)',
          WebkitBackdropFilter:'blur(20px)',
          padding:'0.75rem 1.5rem', borderBottom:'1px solid rgba(121,119,119,0.1)',
          boxShadow:'0 4px 24px rgba(0,0,0,0.06)'
        }}>
          <nav style={{ display:'flex', flexDirection:'column', gap:'0.25rem' }}>
            {navLinks.map(({ id, label }) => (
              <a key={id} href={`/#${id}`}
                onClick={(e) => handleNavClick(e, id)}
                style={{ textDecoration:'none', color:'#1a1a1a',
                  fontFamily:'Inter,sans-serif', fontWeight:600,
                  fontSize:'0.75rem', textTransform:'uppercase', letterSpacing:'0.1em',
                  padding:'0.875rem 0.75rem', borderRadius:'0.5rem' }}>
                {label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}

export default SiteHeader;
