import React, { useState, useEffect } from 'react';
import './App.css';
import { 
  MessageSquare, 
  Fingerprint, 
  Award, 
  BarChart3, 
  Languages, 
  Database,
  Menu,
  X
} from 'lucide-react';
import { benefits, features, howItWorksSteps, mockFormSubmit } from './mock';
import PhoneMockup from './components/PhoneMockup';

const iconMap = {
  MessageSquare,
  Fingerprint,
  Award,
  BarChart3,
  Languages,
  Database
};

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    restaurantName: '',
    location: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [autoPlay, setAutoPlay] = useState(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Netlify Forms submission
    const form = e.target;
    
    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          'form-name': 'demo-request',
          'name': formData.name,
          'email': formData.email,
          'phone': formData.phone,
          'restaurant-name': formData.restaurantName,
          'location': formData.location
        }).toString()
      });
      
      if (response.ok) {
        // Show success message
        setShowSuccess(true);
        
        // Reset form after 5 seconds
        setTimeout(() => {
          setShowSuccess(false);
          setFormData({
            name: '',
            email: '',
            phone: '',
            restaurantName: '',
            location: ''
          });
        }, 5000);
      } else {
        alert('Failed to submit. Please try again.');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      alert('Failed to submit. Please try again.');
    }
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  // Auto-play functionality for How It Works section
  useEffect(() => {
    if (!autoPlay) return;
    
    const interval = setInterval(() => {
      setActiveStep(prev => (prev >= 6 ? 1 : prev + 1));
    }, 4000);
    
    return () => clearInterval(interval);
  }, [autoPlay]);

  const handleStepClick = (stepId) => {
    setAutoPlay(false);
    setActiveStep(stepId);
  };

  return (
    <div className="App">
      {/* Header */}
      <header className="header-nav">
        <img 
          src="https://customer-assets.emergentagent.com/job_servai-demo/artifacts/4xi5nw05_Options%205-transparent%20background%20landscape%20copy%20%282%29.png" 
          alt="DD Consulting" 
          className="logo" 
        />
        
        <nav className="nav-links">
          <a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}>Features</a>
          <a href="#how-it-works" onClick={(e) => { e.preventDefault(); scrollToSection('how-it-works'); }}>How It Works</a>
        </nav>
        
        <div className="nav-actions">
          <button 
            className="btn-primary" 
            onClick={() => scrollToSection('demo')}
          >
            Request Demo
          </button>
          <button 
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: '80px',
          left: 0,
          right: 0,
          background: 'var(--bg-overlay)',
          backdropFilter: 'blur(8px)',
          padding: '1rem',
          zIndex: 998,
          borderBottom: '1px solid var(--border-light)'
        }}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <a 
              href="#features" 
              onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}
              style={{
                textDecoration: 'none',
                color: 'var(--text-primary)',
                fontFamily: 'SF Mono, monospace',
                fontSize: '0.875rem',
                textTransform: 'uppercase',
                letterSpacing: '0.025em',
                padding: '0.75rem'
              }}
            >
              Features
            </a>
            <a 
              href="#how-it-works" 
              onClick={(e) => { e.preventDefault(); scrollToSection('how-it-works'); }}
              style={{
                textDecoration: 'none',
                color: 'var(--text-primary)',
                fontFamily: 'SF Mono, monospace',
                fontSize: '0.875rem',
                textTransform: 'uppercase',
                letterSpacing: '0.025em',
                padding: '0.75rem'
              }}
            >
              How It Works
            </a>
          </nav>
        </div>
      )}

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="heading-hero font-mono">SERVAI</h1>
          <p className="hero-subtitle font-mono">Conversational AI-Powered Food Ordering</p>
          <p className="body-large hero-description">
            Say goodbye to clunky QR code apps. ServAI uses conversational AI to let customers order naturally through WhatsApp and Messenger - just like chatting with a friend. Complete orders in under 90 seconds while merchants retain 100% ownership of customer data.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => scrollToSection('demo')}>
              Schedule Demo
            </button>
            <button className="btn-secondary" onClick={() => scrollToSection('features')}>
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section">
        <div className="benefits-grid">
          {benefits.map((benefit) => (
            <div key={benefit.id} className="benefit-card">
              <div className="benefit-metric">{benefit.metric}</div>
              <h3 className="benefit-title">{benefit.title}</h3>
              <p className="benefit-description">{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section">
        <h2 className="heading-1 section-title">Powerful Features</h2>
        <div className="features-grid">
          {features.map((feature) => {
            const IconComponent = iconMap[feature.icon];
            return (
              <div key={feature.id} className="feature-card">
                <div className="feature-icon">
                  <IconComponent size={24} />
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Demo Request Form Section */}
      <section id="demo" className="demo-section">
        <div className="demo-container">
          <h2 className="heading-1 demo-title">Ready to Transform Your Ordering Experience?</h2>
          <p className="body-large demo-description">
            See ServAI in action. Schedule a personalized demo and discover how we can help you eliminate ordering friction and build lasting customer relationships.
          </p>
          
          {!showSuccess ? (
            <form 
              className="demo-form" 
              onSubmit={handleSubmit}
              name="demo-request"
              method="POST"
              data-netlify="true"
              data-netlify-honeypot="bot-field"
            >
              {/* Hidden input for Netlify Forms */}
              <input type="hidden" name="form-name" value="demo-request" />
              
              {/* Honeypot field for spam protection */}
              <div style={{ display: 'none' }}>
                <label>
                  Don't fill this out if you're human: <input name="bot-field" />
                </label>
              </div>
              
              <div className="form-group">
                <label htmlFor="name">Your Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Phone *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="restaurantName">Restaurant Name / Website *</label>
                <input
                  type="text"
                  id="restaurantName"
                  name="restaurantName"
                  value={formData.restaurantName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="location">Country / Location *</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <button type="submit" className="btn-primary form-submit">
                Request Demo
              </button>
            </form>
          ) : (
            <div className="success-message">
              <h3>Thank You!</h3>
              <p>
                We've received your demo request. Our team will contact you within 24 hours to schedule your personalized ServAI demonstration.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Interactive How It Works Section */}
      <section id="how-it-works" className="interactive-how-it-works-section">
        <div className="container">
          <h2 className="heading-1 section-title">How It Works</h2>
          <p className="section-subtitle">Experience the seamless ordering journey from start to finish</p>
          
          <div className="interactive-container">
            <div className="phone-column">
              <PhoneMockup activeStep={activeStep} />
            </div>
            
            <div className="steps-column">
              <div className="auto-play-toggle">
                <button 
                  className={`toggle-btn ${autoPlay ? 'active' : ''}`}
                  onClick={() => setAutoPlay(!autoPlay)}
                >
                  {autoPlay ? 'Pause Auto-Play' : 'Resume Auto-Play'}
                </button>
              </div>
              
              <div className="interactive-steps">
                {howItWorksSteps.map((step) => (
                  <div 
                    key={step.id} 
                    className={`interactive-step-card ${activeStep === step.id ? 'active' : ''}`}
                    onClick={() => handleStepClick(step.id)}
                  >
                    <div className="step-number">{step.id}</div>
                    <div className="step-content">
                      <h3 className="step-title">{step.title}</h3>
                      <p className="step-description">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <img 
          src="https://customer-assets.emergentagent.com/job_servai-demo/artifacts/4xi5nw05_Options%205-transparent%20background%20landscape%20copy%20%282%29.png" 
          alt="DD Consulting" 
          className="footer-logo" 
        />
        <p className="footer-text">ServAI - AI-Powered Food Ordering Platform</p>
        <p className="footer-contact">
          <a href="mailto:info@serv-ai.com">info@serv-ai.com</a>
        </p>
        <p className="footer-copyright">
          © 2025 DD Consulting. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default App;
