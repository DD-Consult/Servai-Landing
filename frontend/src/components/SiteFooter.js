import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { navLinks } from '../App';

function SiteFooter() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  const handleNavClick = (e, id) => {
    if (isHome) {
      e.preventDefault();
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="w-full bg-[#222A30] text-[#F8F5EE] pt-16 pb-8 px-10 sm:px-20 lg:px-32 border-t border-white/10" data-testid="site-footer">
      <div className="max-w-[1040px] mx-auto">

        {/* Main footer — 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">

          {/* DISCOVER — left */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h4 className="text-xs font-semibold tracking-[0.15em] text-white uppercase mb-5">Discover</h4>
            <nav className="flex flex-col gap-3">
              {navLinks.map(({ id, label }) => (
                <a key={id} href={`/#${id}`}
                  onClick={(e) => handleNavClick(e, id)}
                  className="text-sm text-gray-400 hover:text-[#809B73] transition-colors duration-200 w-fit"
                  data-testid={`footer-link-${id}`}>
                  {label}
                </a>
              ))}
            </nav>
          </div>

          {/* ServAI brand — center */}
          <div className="flex flex-col items-center text-center gap-3">
            <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/10 shadow-inner">
              <img
                src="/assets/servai-logo.webp"
                alt="ServAI Logo"
                className="h-8 w-auto object-contain"
              />
              <span className="text-xl font-semibold tracking-wide text-white">
                <span className="text-[#C85A32]">Serv</span><span className="text-[#809B73]">AI</span>
              </span>
            </div>
            <p className="text-xs text-gray-400 max-w-sm">
              ServAI: AI-Powered Food Ordering Platform
            </p>
            <a href="mailto:info@serv-ai.com"
              className="text-xs text-[#809B73] hover:text-[#98B389] hover:underline transition-colors duration-200"
              data-testid="footer-contact-email">
              info@serv-ai.com
            </a>
          </div>

          {/* MADE WITH EXCELLENCE BY — right */}
          <div className="flex flex-col items-center md:items-end text-center md:text-right">
            <h4 className="text-[10px] font-semibold tracking-[0.15em] text-white uppercase mb-5">Made With Excellence By</h4>
            <a href="https://ddconsult.com.au" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 mb-6 hover:opacity-80 transition-opacity duration-200"
              data-testid="footer-dd-consulting-link">
              <img
                src="/assets/dd_consulting.png"
                alt="DD Consulting Logo"
                className="h-9 w-auto object-contain rounded-md"
              />
            </a>
            <div className="flex flex-col items-center md:items-end gap-1.5">
              <a
                href="https://aws.amazon.com/what-is-cloud-computing"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform duration-200 hover:scale-105 inline-block"
                data-testid="footer-aws-badge"
              >
                <img
                  src="https://d0.awsstatic.com/logos/powered-by-aws-white.png"
                  alt="Powered by AWS Cloud Computing"
                  className="h-7 w-auto object-contain"
                />
              </a>
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white/10 my-10" />

        {/* Sub-footer */}
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-0 justify-between text-center md:text-left">
          <div className="flex items-center gap-6">
            <Link to="/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[13px] text-gray-400 hover:text-[#809B73] transition-colors duration-200"
              data-testid="footer-privacy-policy-link">
              Privacy Policy
            </Link>
            <Link to="/terms-and-conditions"
              className="text-[13px] text-gray-400 hover:text-[#809B73] transition-colors duration-200"
              data-testid="footer-terms-link">
              Terms &amp; Conditions
            </Link>
          </div>
          <p className="text-[13px] text-gray-500" data-testid="footer-copyright">
            Copyright &copy; 2026 ServAI. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}

export default SiteFooter;
