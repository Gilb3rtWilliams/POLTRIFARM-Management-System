import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/ServiceDocs.css';

/* ── All 6 services for the "Explore Other Services" section ── */
export const ALL_SERVICES = [
  { id: 'flock',      icon: '🐔', name: 'Flock Management',     sub: 'Track every batch from hatch to market.', path: '/services/flock-management' },
  { id: 'analytics',  icon: '📊', name: 'Production Analytics',  sub: 'Real-time dashboards powered by your data.', path: '/services/production-analytics' },
  { id: 'health',     icon: '💊', name: 'Health & Biosecurity',  sub: 'Disease surveillance & biosecurity tools.', path: '/services/health-biosecurity' },
  { id: 'feed',       icon: '🌾', name: 'Feed & Inventory',      sub: 'Automated forecasting & stock alerts.', path: '/services/feed-inventory' },
  { id: 'finance',    icon: '💰', name: 'Financial Reporting',   sub: 'Profit-and-loss per batch, cost breakdowns.', path: '/services/financial-reporting' },
  { id: 'multifarm',  icon: '🏗️', name: 'Multi-Farm Control',   sub: 'Manage multiple farms from one place.', path: '/services/multi-farm-control' },
];

export default function ServiceDocPage({
  serviceId,          // matches ALL_SERVICES id
  eyebrow,            // e.g. "Service Documentation"
  heroTitle,          // JSX — can contain <em> and <strong>
  heroDesc,
  heroFeatures,       // array of { icon, title, desc }
  accentColor,        // hex or CSS var — used for left bar accents
  metrics,            // array of { val, label }
  howItWorksTitle,
  howItWorksDesc,
  steps,              // array of { icon, title, desc }
  webSteps,           // array of { action, detail }
  mobileSteps,        // array of { action, detail }
  webTip,
  mobileTip,
  faqs,               // array of { q, a }
  ctaTitle,           // JSX
  ctaDesc,
}) {
  const navigate     = useNavigate();
  const cursorDot    = useRef(null);
  const cursorRing   = useRef(null);
  const mouse        = useRef({ x: -200, y: -200 });
  const pos          = useRef({ x: -200, y: -200 });
  const [openFaq, setOpenFaq] = useState(null);

  /* Cursor */
  useEffect(() => {
    const move = e => { mouse.current.x = e.clientX; mouse.current.y = e.clientY; };
    window.addEventListener('mousemove', move);
    let raf;
    const loop = () => {
      pos.current.x += (mouse.current.x - pos.current.x) * 0.1;
      pos.current.y += (mouse.current.y - pos.current.y) * 0.1;
      if (cursorDot.current)
        cursorDot.current.style.transform = `translate(${mouse.current.x - 5}px,${mouse.current.y - 5}px)`;
      if (cursorRing.current)
        cursorRing.current.style.transform = `translate(${pos.current.x - 18}px,${pos.current.y - 18}px)`;
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => { window.removeEventListener('mousemove', move); cancelAnimationFrame(raf); };
  }, []);

  const expand = () => cursorRing.current?.classList.add('active');
  const shrink = () => cursorRing.current?.classList.remove('active');

  const otherServices = ALL_SERVICES.filter(s => s.id !== serviceId);
  const currentService = ALL_SERVICES.find(s => s.id === serviceId);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--navy)' }}>
      <div className="cursor-dot"  ref={cursorDot}  />
      <div className="cursor-ring" ref={cursorRing} />

      {/* ── NAVBAR ── */}
      <nav className="docs-nav">
        <Link to="/" className="docs-nav-brand" onMouseEnter={expand} onMouseLeave={shrink}>
          <span className="g">POLTRI</span><span className="w">FARM</span>
        </Link>
        <div className="docs-nav-center">
          <span>Services</span>
          <span className="sep">›</span>
          <span className="active">{currentService?.name}</span>
        </div>
        <div className="docs-nav-right">
          <Link to="/" className="docs-nav-back" onMouseEnter={expand} onMouseLeave={shrink}>← Back to Homepage</Link>
          <Link to="/login" className="docs-nav-cta" onMouseEnter={expand} onMouseLeave={shrink}>Get Started</Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="docs-hero">
        <div className="docs-hero-bg">
          <div className="docs-hero-bg-gradient" />
          <div className="docs-hero-grain" />
          <div className="docs-hero-line" style={{ left: '8%', top: '10%', height: '80%', animationDelay: '0s' }} />
          <div className="docs-hero-line" style={{ right: '12%', top: '20%', height: '60%', animationDelay: '2s' }} />
        </div>
        <div className="docs-hero-inner">
          <div className="docs-hero-left">
            <div className="docs-hero-service-badge" onMouseEnter={expand} onMouseLeave={shrink}>
              <span className="badge-dot" />
              {eyebrow}
            </div>
            <h1 className="docs-hero-title">{heroTitle}</h1>
            <p className="docs-hero-desc">{heroDesc}</p>
            <div className="docs-hero-actions">
              <Link to="/login" className="btn-hero-primary" onMouseEnter={expand} onMouseLeave={shrink}>
                Get Started Free
              </Link>
              <a href="#how-it-works" className="btn-hero-ghost" onMouseEnter={expand} onMouseLeave={shrink}>
                See How It Works
              </a>
            </div>
          </div>
          <div className="docs-hero-right">
            <div className="docs-feature-card-stack">
              {heroFeatures.map((f, i) => (
                <div
                  className="docs-feature-card"
                  key={i}
                  style={{ animationDelay: `${0.5 + i * 0.12}s`, opacity: 0, animation: `fadeUp 0.7s var(--ease) forwards ${0.5 + i * 0.12}s` }}
                  onMouseEnter={expand} onMouseLeave={shrink}
                >
                  <div className="docs-feature-card-accent" style={{ background: accentColor }} />
                  <div className="docs-feature-card-icon">{f.icon}</div>
                  <div className="docs-feature-card-body">
                    <div className="docs-feature-card-title">{f.title}</div>
                    <div className="docs-feature-card-desc">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── METRICS STRIP ── */}
      {metrics && (
        <div style={{ background: 'var(--navy-mid)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
          <div className="metrics-strip" style={{ border: 'none', background: 'transparent', maxWidth: 1200, margin: '0 auto' }}>
            {metrics.map((m, i) => (
              <div className="metric-cell" key={i} style={{ background: 'transparent' }}>
                <div className="metric-val" style={{ color: accentColor }}>{m.val}</div>
                <div className="metric-label">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="docs-section">
        <div className="section-label-row">
          <span className="section-eyebrow">How It Works</span>
          <div className="section-eyebrow-line" />
        </div>
        <h2 className="docs-section-title">{howItWorksTitle}</h2>
        <p className="docs-section-desc">{howItWorksDesc}</p>
        <div className="steps-grid">
          {steps.map((s, i) => (
            <div className="step-card" key={i} onMouseEnter={expand} onMouseLeave={shrink}>
              <div className="step-num">{String(i + 1).padStart(2, '0')}</div>
              <div className="step-icon">{s.icon}</div>
              <div className="step-title">{s.title}</div>
              <div className="step-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PLATFORM GUIDE ── */}
      <section id="how-to-use" className="docs-section alt-bg">
        <div className="docs-section-inner">
          <div className="section-label-row">
            <span className="section-eyebrow">Step-by-Step Guide</span>
            <div className="section-eyebrow-line" />
          </div>
          <h2 className="docs-section-title">How to <em>Use It</em></h2>
          <p className="docs-section-desc">Whether you're on your desktop at the office or checking in from the farm on your phone — here's exactly how to use this feature on both platforms.</p>

          <div className="platform-grid">
            {/* Web */}
            <div className="platform-card">
              <div className="platform-card-header">
                <span className="platform-badge web">🌐 Web App</span>
                <div className="platform-title">{currentService?.name} on Web</div>
              </div>
              <div className="platform-body">
                {webSteps.map((step, i) => (
                  <div className="platform-step" key={i}>
                    <div className="platform-step-num">{i + 1}</div>
                    <div className="platform-step-content">
                      <div className="platform-step-action">{step.action}</div>
                      <div className="platform-step-detail">{step.detail}</div>
                    </div>
                  </div>
                ))}
                {webTip && (
                  <div className="platform-tip">
                    <strong>💡 Pro tip:</strong> {webTip}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile */}
            <div className="platform-card">
              <div className="platform-card-header">
                <span className="platform-badge mobile">📱 Mobile App</span>
                <div className="platform-title">{currentService?.name} on Mobile</div>
              </div>
              <div className="platform-body">
                {mobileSteps.map((step, i) => (
                  <div className="platform-step" key={i}>
                    <div className="platform-step-num">{i + 1}</div>
                    <div className="platform-step-content">
                      <div className="platform-step-action">{step.action}</div>
                      <div className="platform-step-detail">{step.detail}</div>
                    </div>
                  </div>
                ))}
                {mobileTip && (
                  <div className="platform-tip">
                    <strong>💡 Pro tip:</strong> {mobileTip}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      {faqs && faqs.length > 0 && (
        <section className="docs-section">
          <div className="section-label-row">
            <span className="section-eyebrow">Common Questions</span>
            <div className="section-eyebrow-line" />
          </div>
          <h2 className="docs-section-title">Frequently Asked <em>Questions</em></h2>
          <div className="faq-list" style={{ maxWidth: 720, marginTop: '2rem' }}>
            {faqs.map((faq, i) => (
              <div className="faq-item" key={i}>
                <button
                  className="faq-question"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  onMouseEnter={expand} onMouseLeave={shrink}
                >
                  {faq.q}
                  <span className={`faq-chevron ${openFaq === i ? 'open' : ''}`}>▾</span>
                </button>
                <div className={`faq-answer ${openFaq === i ? 'open' : ''}`}>
                  {faq.a}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="docs-cta-section">
        <div className="docs-cta-inner">
          <div className="docs-cta-eyebrow">Ready to Begin</div>
          <h2 className="docs-cta-title">{ctaTitle}</h2>
          <p className="docs-cta-desc">{ctaDesc}</p>
          <div className="docs-cta-buttons">
            <Link to="/login"    className="btn-cta-primary" onMouseEnter={expand} onMouseLeave={shrink}>
              Sign In to Dashboard
            </Link>
            <Link to="/register" className="btn-cta-ghost"   onMouseEnter={expand} onMouseLeave={shrink}>
              Create Free Account
            </Link>
          </div>
          <div className="docs-cta-note">
            No commitment required. &nbsp;
            <Link to="/terms" onMouseEnter={expand} onMouseLeave={shrink}>Terms of Service</Link>
            &nbsp;·&nbsp;
            <Link to="/privacy" onMouseEnter={expand} onMouseLeave={shrink}>Privacy Policy</Link>
          </div>
        </div>
      </section>

      {/* ── OTHER SERVICES ── */}
      <section className="other-services">
        <div className="section-label-row">
          <span className="section-eyebrow">Explore More</span>
          <div className="section-eyebrow-line" />
        </div>
        <h2 className="docs-section-title" style={{ marginBottom: '0.5rem' }}>Other <em>Services</em></h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--muted)', marginBottom: '2rem' }}>
          POLTRIFARM brings every aspect of your farm into one intelligent platform.
        </p>
        <div className="services-nav-grid">
          {otherServices.map(s => (
            <Link key={s.id} to={s.path} className="service-nav-card" onMouseEnter={expand} onMouseLeave={shrink}>
              <div className="service-nav-icon">{s.icon}</div>
              <div className="service-nav-name">{s.name}</div>
              <div className="service-nav-sub">{s.sub}</div>
              <span className="service-nav-arrow">→</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="docs-footer">
        <div className="docs-footer-brand">
          <span className="g">POLTRI</span><span style={{ color: 'var(--white)' }}>FARM</span>
        </div>
        <div className="docs-footer-links">
          <Link to="/"        onMouseEnter={expand} onMouseLeave={shrink}>Homepage</Link>
          <Link to="/login"   onMouseEnter={expand} onMouseLeave={shrink}>Sign In</Link>
          <Link to="/register"onMouseEnter={expand} onMouseLeave={shrink}>Register</Link>
          <Link to="/privacy" onMouseEnter={expand} onMouseLeave={shrink}>Privacy</Link>
          <Link to="/terms"   onMouseEnter={expand} onMouseLeave={shrink}>Terms</Link>
          <Link to="/cookies" onMouseEnter={expand} onMouseLeave={shrink}>Cookies</Link>
        </div>
        <div className="docs-footer-copy">© {new Date().getFullYear()} POLTRIFARM Management System</div>
      </footer>
    </div>
  );
}
