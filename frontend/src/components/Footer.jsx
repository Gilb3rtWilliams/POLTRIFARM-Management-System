import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Footer.css';
import logo from '../assets/logos/app.png';

const FOOTER_LINKS = {
  Platform: [
    { label: 'Flock Management',    path: '/dashboard'  },
    { label: 'Production Analytics',path: '/reports'    },
    { label: 'Health & Biosecurity',path: '/dashboard'  },
    { label: 'Feed & Inventory',    path: '/inventory'  },
    { label: 'Financial Reports',   path: '/reports'    },
  ],
  Company: [
    { label: 'About Us',  path: '/about'    },
    { label: 'Dashboard', path: '/dashboard'},
    { label: 'Sales',     path: '/sales'    },
    { label: 'Settings',  path: '/settings' },
  ],
  Support: [
    { label: 'Help Center',     path: '/settings' },
    { label: 'Onboarding',      path: '/dashboard'},
    { label: 'Privacy Policy',  path: '/'         },
    { label: 'Terms of Service',path: '/'         },
  ],
};

const SOCIALS = [
  { id: 'fb', label: 'Facebook',  symbol: 'f'  },
  { id: 'li', label: 'LinkedIn',  symbol: 'in' },
  { id: 'tw', label: 'Twitter/X', symbol: '𝕏'  },
  { id: 'yt', label: 'YouTube',   symbol: '▶'  },
];

const Footer = () => {
  const navigate = useNavigate();
  const [email, setEmail]     = useState('');
  const [subSent, setSubSent] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubSent(true);
    setEmail('');
    setTimeout(() => setSubSent(false), 5000);
  };

  return (
    <footer className="site-footer" role="contentinfo">

      {/* ── Top CTA band ── */}
      <div className="footer-cta-band">
        <div className="footer-cta-inner">
          <div className="footer-cta-text">
            <span className="footer-cta-eyebrow">Ready to get started?</span>
            <h2 className="footer-cta-heading">
              Elevate Your Farm.<br /><em>Today.</em>
            </h2>
          </div>
          <div className="footer-cta-actions">
            <button
              className="btn-primary"
              onClick={() => navigate('/dashboard')}
            >
              Open Dashboard
            </button>
            <button
              className="btn-ghost"
              onClick={() => navigate('/about')}
            >
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* ── Main footer body ── */}
      <div className="footer-body">
        <div className="footer-inner">

          {/* Brand column */}
          <div className="footer-brand-col">
            <button className="footer-logo-wrap" onClick={() => navigate('/')}>
              <img src={logo} alt="Poltrifarm logo" className="footer-logo-img" />
              <div className="footer-logo-text">
                <span className="footer-logo-name">POLTRI<em>FARM</em></span>
                <span className="footer-logo-sub">Management System</span>
              </div>
            </button>

            <p className="footer-tagline">
              Enterprise-grade poultry management built for the modern farmer.
              Precision, performance, and peace of mind — in one platform.
            </p>

            {/* Newsletter */}
            <div className="footer-newsletter">
              <label className="footer-newsletter-label" htmlFor="footer-email">
                Stay in the loop
              </label>
              <form className="footer-newsletter-form" onSubmit={handleSubscribe}>
                <input
                  id="footer-email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  aria-label="Email address for newsletter"
                />
                <button type="submit" aria-label="Subscribe">→</button>
              </form>
              {subSent && (
                <p className="footer-newsletter-success">
                  ✓ You're subscribed. Welcome aboard.
                </p>
              )}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div className="footer-link-col" key={heading}>
              <h3 className="footer-col-heading">{heading}</h3>
              <ul>
                {links.map(link => (
                  <li key={link.label}>
                    <button
                      className="footer-link"
                      onClick={() => navigate(link.path)}
                    >
                      <span className="footer-link-dot" aria-hidden="true" />
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact column */}
          <div className="footer-link-col footer-contact-col">
            <h3 className="footer-col-heading">Contact</h3>
            <ul className="footer-contact-list">
              {[
                { icon: '📍', label: 'Address', value: '123 Farm Road,\nAgriCity, Province' },
                { icon: '📧', label: 'Email',   value: 'hello@poltrifarm.com' },
                { icon: '📞', label: 'Phone',   value: '+63 900 123 4567' },
                { icon: '🕐', label: 'Hours',   value: 'Mon–Fri, 8 AM – 6 PM' },
              ].map(d => (
                <li key={d.label} className="footer-contact-item">
                  <span className="footer-contact-icon" aria-hidden="true">{d.icon}</span>
                  <div>
                    <span className="footer-contact-label">{d.label}</span>
                    <span className="footer-contact-value">{d.value}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="footer-bottom-bar">
        <div className="footer-bottom-inner">
          <p className="footer-copy">
            © {new Date().getFullYear()} POLTRIFARM Management System.
            All rights reserved.
          </p>

          <div className="footer-legal-links">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(l => (
              <button key={l} className="footer-legal-link">{l}</button>
            ))}
          </div>

          <div className="footer-socials">
            {SOCIALS.map(s => (
              <a
                key={s.id}
                href="#"
                className="social-btn"
                aria-label={s.label}
              >
                {s.symbol}
              </a>
            ))}
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
