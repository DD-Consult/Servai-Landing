import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import './App.css';
import { Menu, X } from 'lucide-react';
import PhoneMockup from './components/PhoneMockup';

// ─────────────────────────────────────────────────────────────────────────────
// StatCounter
// Animates 0 → targetValue on viewport entry.
// Motion: easeOutCubic  (1 - (1-t)^3)  over `duration` ms — matches reference.
// ─────────────────────────────────────────────────────────────────────────────
function StatCounter({ targetValue, duration = 1500 }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let rafId;
    let t0 = null;
    const step = (ts) => {
      if (!t0) t0 = ts;
      const progress = Math.min((ts - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(targetValue * eased));
      if (progress < 1) rafId = requestAnimationFrame(step);
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [started, targetValue, duration]);

  return <span ref={ref}>{count}</span>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Static data
// ─────────────────────────────────────────────────────────────────────────────
const features = [
  { id: 1, icon: 'chat_bubble',     iconColor: '#D4A843', iconBg: 'rgba(212,168,67,0.12)',  borderColor: '#D4A843', title: 'Conversational AI Ordering',    description: 'Customers have natural conversations with our AI agent through WhatsApp or Messenger. No rigid menus or confusing buttons - just chat naturally like ordering from a real person. Complete orders in under 90 seconds.' },
  { id: 2, icon: 'fingerprint',     iconColor: '#8b5cf6', iconBg: 'rgba(139,92,246,0.12)',  borderColor: '#8b5cf6', title: 'Instant Biometric Payments',     description: 'Complete transactions with Face ID or Google Pay. No manual card entry, no checkout forms - just fast, secure, trusted payments.' },
  { id: 3, icon: 'card_membership', iconColor: '#25D366', iconBg: 'rgba(37,211,102,0.12)',  borderColor: '#25D366', title: 'Built-In Loyalty System',         description: 'Track customer orders, reward repeat visits, and build relationships - all inside the chat. Your data, your customers, your loyalty program.' },
  { id: 4, icon: 'dashboard',       iconColor: '#2DD4BF', iconBg: 'rgba(45,212,191,0.12)',  borderColor: '#2DD4BF', title: 'Smart Dashboard',                 description: 'Real-time order management with actionable insights. Know your top customers, track preferences, and optimize your menu based on actual data.' },
  { id: 5, icon: 'translate',       iconColor: '#6366f1', iconBg: 'rgba(99,102,241,0.12)',  borderColor: '#6366f1', title: 'Multilingual Conversations',      description: 'AI understands and responds in multiple languages naturally. Perfect for tourist areas - customers have full conversations in their native language, with instant translation for your staff. No language barriers.' },
  { id: 6, icon: 'database',        iconColor: '#C9A227', iconBg: 'rgba(201,162,39,0.12)',  borderColor: '#C9A227', title: 'Own Your Customer Data',          description: 'No third-party aggregators taking your customer relationships. Full ownership of profiles, preferences, and contact information.' }
];

const howItWorksSteps = [
  { id: 1, title: 'Tap or Scan',            description: 'Customer taps NFC tag or scans QR code at your venue' },
  { id: 2, title: 'Chat Opens',             description: 'WhatsApp or Messenger automatically opens - no app install needed' },
  { id: 3, title: 'Conversational Ordering',description: 'Customers chat naturally with our AI agent - ask questions, request recommendations, modify orders - just like talking to a waiter' },
  { id: 4, title: 'Biometric Payment',      description: 'Complete purchase with Face ID, Google Pay, or Apple Pay' },
  { id: 5, title: 'Order Received',         description: 'Your dashboard shows the order instantly with customer profile' },
  { id: 6, title: 'Loyalty Updated',        description: 'Customer earns points automatically - ready for their next visit' }
];

// Stat cards — each has an animated renderNum() factory
const statCards = [
  { renderNum: () => <><StatCounter targetValue={90} />s</>,        label: 'Average order completion time', sub: 'From QR scan to payment confirmation' },
  { renderNum: () => <span style={{ display:'inline-flex', alignItems:'center', gap:0 }}><StatCounter targetValue={30} />-<StatCounter targetValue={50} />%</span>, label: 'Increase in repeat orders', sub: 'Through built-in loyalty tracking' },
  { renderNum: () => <><StatCounter targetValue={100} />%</>,        label: 'Customer data ownership',      sub: 'No aggregator fees or data lock-in' },
  { renderNum: () => <><StatCounter targetValue={2} />B+</>,         label: 'Global WhatsApp reach',         sub: 'Your customers already use it daily' },
];

const navLinks = [
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'features',     label: 'Features' },
  { id: 'impact',       label: 'Impact' },
];

const formFields = [
  { id: 'name',           label: 'Your Name',                  type: 'text',  placeholder: 'John Doe' },
  { id: 'email',          label: 'Email',                      type: 'email', placeholder: 'john@restaurant.com' },
  { id: 'phone',          label: 'Phone',                      type: 'tel',   placeholder: '+1 (555) 000-0000' },
  { id: 'restaurantName', label: 'Restaurant Name / Website',  type: 'text',  placeholder: 'The Grand Bistro / www.grandbistro.com' },
  { id: 'location',       label: 'Country / Location',         type: 'text',  placeholder: 'London, UK' },
];

// ─────────────────────────────────────────────────────────────────────────────
// App
// ─────────────────────────────────────────────────────────────────────────────
function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled,       setScrolled]       = useState(false);
  const [heroVisible,    setHeroVisible]    = useState(false);
  const [formData,       setFormData]       = useState({ name:'', email:'', phone:'', restaurantName:'', location:'' });
  const [showSuccess,    setShowSuccess]    = useState(false);
  const [activeStep,     setActiveStep]     = useState(1);
  const [autoPlay,       setAutoPlay]       = useState(true);
  const [ordersPerDay,   setOrdersPerDay]   = useState(50);
  const [avgOrderValue,  setAvgOrderValue]  = useState(15);
  const [isPlaying,      setIsPlaying]      = useState(false);
  const videoRef = useRef(null);

  const monthlyRevenue = Math.round(ordersPerDay * avgOrderValue * 30 * 0.4).toLocaleString();
  const hoursSaved     = Math.round(ordersPerDay * 30 * 0.042);

  const handlePlayClick = () => {
    videoRef.current?.play();
    setIsPlaying(true);
  };
  const handleVideoPause  = () => setIsPlaying(false);
  const handleVideoEnded  = () => setIsPlaying(false);

  const getSliderStyle = (value, min, max) => {
    const pct = ((value - min) / (max - min)) * 100;
    return { background: `linear-gradient(to right, #2DD4BF ${pct}%, #e0e0e0 ${pct}%)` };
  };

  // ── Header scroll state ────────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Hero spring entrance — fires 120ms after first paint ───────────────────
  // transition: 1s cubic-bezier(0.16, 1, 0.3, 1)  (exact reference spec)
  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 120);
    return () => clearTimeout(t);
  }, []);

  // ── Scroll reveal IntersectionObserver ────────────────────────────────────
  // Adds `.active` to .reveal-on-scroll elements as they enter viewport.
  // Also stores each revealed node so we can re-apply `.active` after React
  // re-renders wipe imperative class changes (e.g. when activeStep changes).
  const revealedNodesRef = useRef(new Set());

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('active');
          revealedNodesRef.current.add(e.target);
        }
      }),
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    const nodes = document.querySelectorAll('.reveal-on-scroll');
    nodes.forEach(n => io.observe(n));
    return () => io.disconnect();
  }, []);

  // Re-apply `.active` synchronously after each React DOM update so that
  // the step cards never flash invisible when activeStep causes a re-render.
  useLayoutEffect(() => {
    revealedNodesRef.current.forEach(node => node.classList.add('active'));
  }, [activeStep]);

  // ── Auto-play step carousel ────────────────────────────────────────────────
  useEffect(() => {
    if (!autoPlay) return;
    const interval = setInterval(() => {
      setActiveStep(prev => (prev >= 6 ? 1 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, [autoPlay]);

  const handleStepClick = (id) => { setAutoPlay(false); setActiveStep(id); };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ 'form-name': 'demo-request', ...formData }).toString()
      });
      if (res.ok) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          setFormData({ name:'', email:'', phone:'', restaurantName:'', location:'' });
        }, 5000);
      } else {
        alert('Submission failed. Please try again.');
      }
    } catch {
      alert('Submission failed. Please try again.');
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="App">

      {/* ═══════════════════════════════════════ HEADER ══════════════════════ */}
      <header className={`fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-glass-border h-16 flex justify-between items-center px-margin-mobile header-nav${scrolled ? ' header-scrolled' : ''}`}>
        <div className="flex items-center gap-2">
        <img
          src="https://customer-assets.emergentagent.com/job_servai-demo/artifacts/4xi5nw05_Options%205-transparent%20background%20landscape%20copy%20%282%29.png"
          alt="ServAI" className="logo"
        />
        </div>
        <div className="flex items-center gap-stack-lg ml-auto mr-stack-lg">
        <nav className="nav-links">
          {navLinks.map(({ id, label }) => (
            <a key={id} href={`#${id}`}
              onClick={(e) => { e.preventDefault(); scrollToSection(id); }}>
              {label}
            </a>
          ))}
        </nav>
        </div>
        <div className="nav-actions">
          <a href="https://app.serv-ai.com/login" target="_blank" rel="noopener noreferrer"
            className="btn-outline nav-trial-btn">Start Free Trial</a>
          <button className="btn-primary" onClick={() => scrollToSection('demo')}>Request Demo</button>
          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
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
              <a key={id} href={`#${id}`}
                onClick={(e) => { e.preventDefault(); scrollToSection(id); }}
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

      {/* ═══════════════════════════════════════ HERO ════════════════════════ */}
      <section className="hero-section">
        {/*
          Spring entrance:
          Initial: opacity:0 translateY(40px)
          After 120ms → heroVisible=true → CSS transition fires:
          transition: 1s cubic-bezier(0.16, 1, 0.3, 1)  — exact reference spec
        */}
        <div
          id="hero-content"
          className={`hero-content hero-spring${heroVisible ? ' visible' : ''}`}
        >
          <h1 className="hero-title">SERVAI</h1>
          <h2 className="hero-subtitle">Conversational AI-Powered Food Ordering</h2>
          <p className="hero-description">
            Say goodbye to clunky QR code apps. ServAI uses conversational AI to let customers order naturally
            through WhatsApp and Messenger - just like chatting with a friend. Complete orders in under 90 seconds
            while merchants retain 100% ownership of customer data.
          </p>
          <div className="hero-buttons">
            {/* btn-hover-lift: translateY(-2px) scale(1.03) + teal shadow-lg */}
            <button className="btn-teal btn-hover-lift" onClick={() => scrollToSection('demo')}>
              Schedule Demo
            </button>
            <a href="https://app.serv-ai.com/login" target="_blank" rel="noopener noreferrer"
              className="btn-hero-dark">
              Start Free Trial
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════ BUSINESS IMPACT ════════════════ */}
      <section id="impact" className="stats-section">
        <div className="stats-section-inner">
          <h2 className="section-title-centered reveal-on-scroll">Business Impact</h2>
          <div className="stats-grid">
            {statCards.map((s, i) => (
              /* stagger-N delays: 0.08s × i  →  reveal cascades left to right */
              <div key={i} className={`stat-card reveal-on-scroll stagger-${i + 1}`}>
                <div className="stat-number">{s.renderNum()}</div>
                <div className="stat-label">{s.label}</div>
                <div className="stat-sublabel">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════ WHY SERVAI ════════════════════ */}
      <section className="why-section">
        <div className="why-section-inner">
          <h2 className="section-title-centered reveal-on-scroll">Why ServAI?</h2>
          <div className="comparison-grid">
            <div className="comparison-card old-way reveal-on-scroll stagger-1">
              <h3 className="comparison-heading old-heading">The Old Way <span>😤</span></h3>
              <ul className="comparison-list">
                {['Clunky, slow-loading web pages','Re-entering name, phone & card every time','High rates of cart abandonment','Losing customer data to third parties']
                  .map((item, i) => (
                  <li key={i} className="comparison-item old-item">
                    <span className="material-symbols-outlined comparison-icon icon-error">close</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="comparison-card new-way reveal-on-scroll stagger-2">
              <h3 className="comparison-heading new-heading">The ServAI Way <span>✨</span></h3>
              <ul className="comparison-list">
                {['Instant chat on WhatsApp or Messenger','AI remembers preferences automatically','Biometric payments in seconds','You own 100% of your customer data']
                  .map((item, i) => (
                  <li key={i} className="comparison-item new-item">
                    <span className="material-symbols-outlined comparison-icon icon-teal"
                      style={{ fontVariationSettings:'"FILL" 1' }}>check_circle</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════ INTELLIGENT HOSPITALITY ════════════════ */}
      <section id="features" className="features-section">
        <div className="features-section-inner">
          <h2 className="section-title-centered reveal-on-scroll">Intelligent Hospitality</h2>
          <p className="section-subtitle reveal-on-scroll stagger-1">
            Elevating the dining experience through sophisticated conversational intelligence.
          </p>
          <div className="features-grid-new">
            {features.map((f, i) => (
              /* Stagger across 3 columns: col-index = i % 3 */
              <div key={f.id}
                className={`feature-card-new reveal-on-scroll stagger-${(i % 3) + 1}`}
                style={{ borderColor:`${f.borderColor}55` }}
              >
                <div className="feature-icon-new" style={{ background:f.iconBg }}>
                  <span className="material-symbols-outlined"
                    style={{ color:f.iconColor, fontVariationSettings:'"FILL" 1' }}>
                    {f.icon}
                  </span>
                </div>
                <h3 className="feature-title-new">{f.title}</h3>
                <p className="feature-desc-new">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════ HOW IT WORKS ══════════════════════ */}
      <section id="how-it-works" className="how-section">
        <div className="how-section-inner">
          <h2 className="section-title-centered reveal-on-scroll">How It Works</h2>
          <p className="section-subtitle reveal-on-scroll stagger-1">
            Experience the seamless ordering journey from start to finish
          </p>
          <div className="how-layout">
            <div className="how-phone-col reveal-on-scroll">
              <PhoneMockup activeStep={activeStep} />
            </div>
            <div className="how-steps-col">
              <div className="auto-play-toggle">
                <button
                  className={`toggle-btn${autoPlay ? ' active' : ''}`}
                  onClick={() => setAutoPlay(!autoPlay)}
                >
                  {autoPlay ? 'Pause Auto-Play' : 'Resume Auto-Play'}
                </button>
              </div>
              <ol className="steps-list">
                {howItWorksSteps.map((step, i) => (
                  <li key={step.id}
                    className={`step-card reveal-on-scroll stagger-${i + 1}${activeStep === step.id ? ' active-step' : ''}`}
                    onClick={() => handleStepClick(step.id)}
                  >
                    <div className="step-num-circle">{step.id}</div>
                    <div>
                      <h4 className="step-title-new">{step.title}</h4>
                      <p className="step-desc-new">{step.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════ ROI CALCULATOR ════════════════════ */}
      <section id="roi" className="roi-section">
        <div className="roi-section-inner">
          <h2 className="section-title-centered reveal-on-scroll">See Your Potential</h2>
          <p className="section-subtitle reveal-on-scroll stagger-1">
            Adjust the sliders to estimate your monthly gains with ServAI
          </p>
          <div className="roi-grid">
            <div className="roi-input-card reveal-on-scroll stagger-1">
              <h3 className="roi-input-heading">💰 Calculate Your ROI</h3>
              <p className="roi-input-subtext">See how much ServAI can save your business</p>
              <div className="roi-slider-group">
                <div className="roi-slider-label-row">
                  <label className="roi-slider-label">Orders per day</label>
                  <span className="roi-slider-value">{ordersPerDay}</span>
                </div>
                <input type="range" className="dynamic-slider" min="10" max="500"
                  value={ordersPerDay} onChange={(e) => setOrdersPerDay(Number(e.target.value))}
                  style={getSliderStyle(ordersPerDay, 10, 500)} />
              </div>
              <div className="roi-slider-group">
                <div className="roi-slider-label-row">
                  <label className="roi-slider-label">Average order value ($)</label>
                  <span className="roi-slider-value">${avgOrderValue}</span>
                </div>
                <input type="range" className="dynamic-slider" min="5" max="100"
                  value={avgOrderValue} onChange={(e) => setAvgOrderValue(Number(e.target.value))}
                  style={getSliderStyle(avgOrderValue, 5, 100)} />
              </div>
            </div>
            <div className="roi-results-card reveal-on-scroll stagger-2">
              <div>
                <div className="roi-result-value">${monthlyRevenue}</div>
                <div className="roi-result-label">Additional monthly revenue</div>
              </div>
              <div>
                <div className="roi-result-value white-val">{hoursSaved}h</div>
                <div className="roi-result-label">Staff hours freed / month</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════ PRODUCT PREVIEW ═══════════════════ */}
      <section className="preview-section">
        <div className="preview-section-inner">
          <span className="preview-label reveal-on-scroll">The Interface</span>
          <h2 className="preview-heading reveal-on-scroll stagger-1">Experience the Future</h2>
          <div className="video-container-wrapper reveal-on-scroll stagger-2">
            <div className="video-glow"></div>
            <div className="video-glass">
              <video
                ref={videoRef}
                className="video-iframe"
                src="/video/servai-demo.mp4"
                poster="/video/servai-demo-thumb.jpg"
                playsInline
                preload="metadata"
                controls={isPlaying}
                onPause={handleVideoPause}
                onEnded={handleVideoEnded}
              />
              {!isPlaying && (
                <div className="video-play-overlay" onClick={handlePlayClick}>
                  <div className="video-play-btn">
                    <span className="material-symbols-outlined video-play-icon"
                      style={{ fontVariationSettings: '"FILL" 1' }}>play_arrow</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════ CTA / DEMO FORM ═══════════════════ */}
      <section id="demo" className="cta-section">
        <div className="cta-bg-gradient"></div>
        <div className="cta-section-inner">
          <div className="cta-header reveal-on-scroll">
            <h2 className="cta-heading">Ready to Transform Your Ordering Experience?</h2>
            <p className="cta-subtext">
              Join the elite restaurants already using ServAI to redefine hospitality.
            </p>
          </div>
          {!showSuccess ? (
            <form className="demo-form-new reveal-on-scroll stagger-1"
              onSubmit={handleSubmit} name="demo-request" method="POST"
              data-netlify="true" data-netlify-honeypot="bot-field"
            >
              <input type="hidden" name="form-name" value="demo-request" />
              <div style={{ display:'none' }}><input name="bot-field" /></div>
              {formFields.map(({ id, label, type, placeholder }) => (
                <div key={id} className="form-field-new">
                  <label className="form-label-new" htmlFor={id}>{label}</label>
                  <input className="form-input-new" id={id} name={id} type={type}
                    placeholder={placeholder} value={formData[id]}
                    onChange={handleInputChange} required />
                </div>
              ))}
              <button type="submit" className="form-submit-new">Request Demo</button>
            </form>
          ) : (
            <div className="success-message">
              <h3>Thank You!</h3>
              <p>We've received your demo request. Our team will contact you within 24 hours to schedule your personalized ServAI demonstration.</p>
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════ FOOTER ════════════════════ */}
      <footer className="footer">
        {/* Row 1 — Logo + brand name */}
        <div className="footer-brand">
          <img
            src="https://customer-assets.emergentagent.com/job_servai-demo/artifacts/4xi5nw05_Options%205-transparent%20background%20landscape%20copy%20%282%29.png"
            alt="ServAI"
            className="footer-logo-icon"
          />
          <span className="footer-brand-name">ServAI</span>
        </div>

        {/* Row 2 — Nav links */}
        {/* <div className="footer-links">
          <a href="#" className="footer-link">Platform</a>
          <a href="#" className="footer-link">Solutions</a>
          <a href="#" className="footer-link">Security</a>
          <a href="#" className="footer-link">Privacy</a>
          <a href="mailto:info@serv-ai.com" className="footer-link">info@serv-ai.com</a>
        </div> */}

        {/* Row 3 — Tagline / copyright */}
        <p className="footer-tagline">
          ServAI: AI-Powered Food Ordering Platform | <a href="mailto:info@serv-ai.com" className="footer-link">info@serv-ai.com</a>
        </p>
        <p className="footer-tagline">
          <a href="https://aws.amazon.com/what-is-cloud-computing">
            <img src="https://d0.awsstatic.com/logos/powered-by-aws.png" alt="Powered by AWS Cloud Computing"/>
          </a>
        </p>
      </footer>

    </div>
  );
}

export default App;
