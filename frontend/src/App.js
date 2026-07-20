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
  { id: 1, icon: 'chat_bubble',     iconColor: '#FF7A29', iconBg: 'rgba(255,122,41,0.12)',  borderColor: '#FF7A29', title: 'Conversational AI Ordering',    description: 'Customers have natural conversations with our AI agent through WhatsApp or Messenger. No rigid menus or confusing buttons - just chat naturally like ordering from a real person. Complete orders in under 90 seconds.' },
  { id: 2, icon: 'fingerprint',     iconColor: '#2DD4BF', iconBg: 'rgba(45,212,191,0.12)',  borderColor: '#2DD4BF', title: 'Instant Biometric Payments',     description: 'Complete transactions with Face ID or Google Pay. No manual card entry, no checkout forms - just fast, secure, trusted payments.' },
  { id: 3, icon: 'card_membership', iconColor: '#2DD4BF', iconBg: 'rgba(45,212,191,0.12)',  borderColor: '#2DD4BF', title: 'Built-In Loyalty System',         description: 'Track customer orders, reward repeat visits, and build relationships - all inside the chat. Your data, your customers, your loyalty program.' },
  { id: 4, icon: 'dashboard',       iconColor: '#2DD4BF', iconBg: 'rgba(45,212,191,0.12)',  borderColor: '#2DD4BF', title: 'Smart Dashboard',                 description: 'Real-time order management with actionable insights. Know your top customers, track preferences, and optimize your menu based on actual data.' },
  { id: 5, icon: 'translate',       iconColor: '#2DD4BF', iconBg: 'rgba(45,212,191,0.12)',  borderColor: '#2DD4BF', title: 'Multilingual Conversations',      description: 'AI understands and responds in multiple languages naturally. Perfect for tourist areas - customers have full conversations in their native language, with instant translation for your staff. No language barriers.' },
  { id: 6, icon: 'database',        iconColor: '#2DD4BF', iconBg: 'rgba(45,212,191,0.12)',  borderColor: '#2DD4BF', title: 'Own Your Customer Data',          description: 'No third-party aggregators taking your customer relationships. Full ownership of profiles, preferences, and contact information.' }
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

const HERO_HEADING_TEXT = 'Conversational AI-Powered Food Ordering';

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
  const [heroPlaying,    setHeroPlaying]    = useState(false);
  const [typedHeading,   setTypedHeading]   = useState('');
  const heroVideoRef = useRef(null);

  const monthlyRevenue = Math.round(ordersPerDay * avgOrderValue * 30 * 0.4).toLocaleString();
  const hoursSaved     = Math.round(ordersPerDay * 30 * 0.042);

  const handlePlayClick = () => {
    heroVideoRef.current?.play();
    setHeroPlaying(true);
  };
  const handleVideoPause  = () => setHeroPlaying(false);
  const handleVideoEnded  = () => setHeroPlaying(false);

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

  // ── Hero heading — realistic typewriter reveal ──────────────────────────
  // Starts once the hero has spring-entered, types char-by-char with slight
  // randomized speed (human-like), then leaves a blinking cursor at rest.
  useEffect(() => {
    let charTimeout;
    const startDelay = setTimeout(() => {
      let i = 0;
      const typeNext = () => {
        i += 1;
        setTypedHeading(HERO_HEADING_TEXT.slice(0, i));
        if (i < HERO_HEADING_TEXT.length) {
          const nextChar = HERO_HEADING_TEXT[i];
          const pause = nextChar === ' ' ? 90 : 35 + Math.random() * 55;
          charTimeout = setTimeout(typeNext, pause);
        }
      };
      typeNext();
    }, 1000);
    return () => { clearTimeout(startDelay); clearTimeout(charTimeout); };
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

  // ── Schedule Demo CTA — cursor-follow glow ──────────────────────────────
  // Idle: an automatic sweep animates the spotlight across the button so it
  // draws the eye to "Schedule Demo" even with no pointer interaction.
  // Hover: the sweep pauses and the spotlight tracks the real cursor instead.
  const scheduleBtnRef = useRef(null);
  const ctaHoveringRef = useRef(false);

  useEffect(() => {
    let rafId;
    const animate = (t) => {
      if (!ctaHoveringRef.current && scheduleBtnRef.current) {
        const phase = (t % 3200) / 3200; // 0..1 loop every 3.2s
        const eased = (Math.sin(phase * Math.PI * 2 - Math.PI / 2) + 1) / 2; // smooth 0..1
        const x = 14 + eased * 72; // sweep 14% -> 86%
        scheduleBtnRef.current.style.setProperty('--mx', `${x}%`);
        scheduleBtnRef.current.style.setProperty('--my', '50%');
      }
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const handleCtaGlowMove = (e) => {
    ctaHoveringRef.current = true;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    e.currentTarget.style.setProperty('--mx', `${x}%`);
    e.currentTarget.style.setProperty('--my', `${y}%`);
  };

  const handleCtaGlowLeave = () => {
    ctaHoveringRef.current = false;
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
          src="/assets/servai-logo.webp"
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
        {/* Ambient glow blobs */}
        <div className="hero-glow hero-glow-teal" />
        <div className="hero-glow hero-glow-mustard" />

        <div className="hero-inner">
          {/* ── LEFT — text content ─────────────────────────────────────── */}
          <div className={`hero-left hero-spring${heroVisible ? ' visible' : ''}`}>
            <span className="hero-brand-label">SERVAi</span>

            <h1 className="hero-heading" aria-label={HERO_HEADING_TEXT} data-testid="hero-heading">
              <span aria-hidden="true">
                {typedHeading}
                <span className="hero-typing-cursor" data-testid="hero-heading-cursor" />
              </span>
            </h1>

            <p className="hero-sub">
              Say goodbye to clunky QR code apps. ServAI uses conversational AI to let customers
              order naturally through WhatsApp and Messenger — just like chatting with a friend.
              Complete orders in under 90 seconds.
            </p>

            <div className="hero-buttons">
              <button
                ref={scheduleBtnRef}
                className="btn-hero-primary btn-hover-lift"
                onClick={() => scrollToSection('demo')}
                onMouseMove={handleCtaGlowMove}
                onMouseEnter={handleCtaGlowMove}
                onMouseLeave={handleCtaGlowLeave}
              >
                <span className="btn-hero-primary-shine" />
                <span className="btn-hero-primary-label">Schedule Demo</span>
              </button>
              <a href="https://app.serv-ai.com/login" target="_blank" rel="noopener noreferrer"
                className="btn-hero-ghost">
                Start Free Trial
              </a>
            </div>
          </div>

          {/* ── RIGHT — video player ─────────────────────────────────────── */}
          <div className="hero-right">
            <div className="hero-video-wrap">
              <div className="hero-video-glass">
                <video
                  ref={heroVideoRef}
                  className="hero-video-el"
                  src="/video/servai-demo.mp4"
                  poster="/video/servai-demo-thumb.jpg"
                  playsInline
                  preload="metadata"
                  controls={heroPlaying}
                  onPause={() => setHeroPlaying(false)}
                  onEnded={() => setHeroPlaying(false)}
                />
                {!heroPlaying && (
                  <div className="hero-video-overlay"
                    onClick={() => { heroVideoRef.current?.play(); setHeroPlaying(true); }}>
                    <div className="hero-play-btn">
                      <span className="material-symbols-outlined hero-play-icon"
                        style={{ fontVariationSettings: '"FILL" 1' }}>play_arrow</span>
                    </div>
                  </div>
                )}
              </div>
              {/* Border-beam — a slim bright line that continuously travels
                  around the card's edge. Two arcs (warm + cool) sit 180°
                  apart on the same rotating ring, so as warm reaches the
                  bottom, cool reaches the top, and they swap every half turn */}
              <span className="hero-video-beam" />
            </div>
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
      <footer className="w-full bg-[#16181C] text-[#f2f0f0] py-12 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center md:text-left">

          {/* DD Consulting — left */}
          <div className="flex flex-col items-center md:items-start order-2 md:order-1 space-y-2">
            <div className="flex items-center gap-2">
              <img 
                src="/assets/dd_consulting.png" 
                alt="DD Consulting Logo" 
                className="h-10 w-auto object-contain rounded-lg shadow-md"
              />
            </div>
            <p className="text-xs text-gray-400">
              Made with excellence by <strong className="text-[#FF7A29]">DD Consulting</strong>
            </p>
          </div>

          {/* ServAI brand — center */}
          <div className="flex flex-col items-center order-1 md:order-2 space-y-3">
            <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/10 shadow-inner">
              <img
                src="/assets/servai-logo.webp"
                alt="ServAI Logo"
                className="h-8 w-auto object-contain"
              />
              <span className="text-xl font-semibold tracking-wide text-white">
                <span className="text-[#2DD4BF]">Serv</span><span className="text-[#FF7A29]">AI</span>
              </span>
            </div>
            <p className="text-xs text-gray-400 max-w-sm text-center">
              ServAI: AI-Powered Food Ordering Platform <br className="hidden sm:inline" />
              <span className="text-gray-500">|</span>
              <a href="mailto:info@serv-ai.com" className="text-[#2DD4BF] hover:underline ml-1">info@serv-ai.com</a>
            </p>
          </div>

          {/* AWS — right */}
          <div className="flex flex-col items-center md:items-end order-3 space-y-2">
            <a
              href="https://aws.amazon.com/what-is-cloud-computing"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-transform duration-200 hover:scale-105 inline-block"
            >
              <img
                src="https://d0.awsstatic.com/logos/powered-by-aws-white.png"
                alt="Powered by AWS Cloud Computing"
                className="h-8 w-auto object-contain"
              />
            </a>
          </div>

        </div>
      </footer>

    </div>
  );
}

export default App;
