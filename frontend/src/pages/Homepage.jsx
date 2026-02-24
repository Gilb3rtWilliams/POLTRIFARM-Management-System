import React, { useEffect, useRef, useState } from 'react';
import Slideshow from '../components/Slideshow';
import NavBar from '../components/NavBar';
import "../css/Homepage.css";

/* ── Small reusable reveal hook ── */
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.12 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return [ref, visible];
}

/* ── Section label component ── */
function SectionLabel({ children }) {
  return <div className="section-label"><span className="label-line" />{children}</div>;
}

/* ── Floating particles ── */
function Particles() {
  const particles = Array.from({ length: 28 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    size: `${Math.random() * 2 + 1}px`,
    duration: `${Math.random() * 12 + 8}s`,
    delay: `${Math.random() * 10}s`,
  }));
  return (
    <div className="particles" aria-hidden="true">
      {particles.map(p => (
        <div key={p.id} className="particle" style={{
          left: p.left, width: p.size, height: p.size,
          animationDuration: p.duration, animationDelay: p.delay,
        }} />
      ))}
    </div>
  );
}

/* ══════════════════════════════════════
   MAIN HOMEPAGE COMPONENT
══════════════════════════════════════ */
function Homepage() {
  /* -- cursor -- */
  const cursorDot  = useRef(null);
  const cursorRing = useRef(null);
  const mouse = useRef({ x: -200, y: -200 });
  const ring  = useRef({ x: -200, y: -200 });

  useEffect(() => {
    const move = e => { mouse.current.x = e.clientX; mouse.current.y = e.clientY; };
    window.addEventListener('mousemove', move);
    let raf;
    const animate = () => {
      ring.current.x += (mouse.current.x - ring.current.x) * 0.11;
      ring.current.y += (mouse.current.y - ring.current.y) * 0.11;
      if (cursorDot.current)
        cursorDot.current.style.transform = `translate(${mouse.current.x - 5}px, ${mouse.current.y - 5}px)`;
      if (cursorRing.current)
        cursorRing.current.style.transform = `translate(${ring.current.x - 18}px, ${ring.current.y - 18}px)`;
      raf = requestAnimationFrame(animate);
    };
    animate();
    return () => { window.removeEventListener('mousemove', move); cancelAnimationFrame(raf); };
  }, []);

  /* -- navbar scroll -- */
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* -- contact form -- */
  const [formSent, setFormSent] = useState(false);
  const handleSubmit = e => {
    e.preventDefault();
    setFormSent(true);
    setTimeout(() => setFormSent(false), 5000);
    e.target.reset();
  };

  /* -- reveal refs -- */
  const [servicesRef,     servicesVis]  = useReveal();
  const [whyRef,          whyVis]       = useReveal();
  const [aboutRef,        aboutVis]     = useReveal();
  const [testimonialsRef, testiVis]     = useReveal();
  const [contactRef,      contactVis]   = useReveal();

  return (
    <div className="Homepage">
      {/* Custom cursor */}
      <div className="cursor-dot"  ref={cursorDot}  aria-hidden="true" />
      <div className="cursor-ring" ref={cursorRing} aria-hidden="true" />

      {/* Slideshow sits behind everything as the bg layer */}
      <Slideshow />

      {/* NavBar — scrolled state drives the frosted glass style */}
      <NavBar scrolled={scrolled} />

      {/* ════════════════════════════
          HERO
      ════════════════════════════ */}
      <section className="hero-section" id="hero">
        <div className="hero-overlay" />
        <div className="hero-grain"   aria-hidden="true" />
        <div className="hero-accent-line left"  aria-hidden="true" />
        <div className="hero-accent-line right" aria-hidden="true" />
        <Particles />

        <div className="hero-content">

          <h1 className="hero-title">
            Elevate Your <em>Farm.</em>
            <strong>Redefine Excellence.</strong>
          </h1>

          <p className="hero-sub">
            POLTRIFARM brings enterprise-grade intelligence to poultry operations —
            flock health monitoring, financial analytics, and multi-farm control,
            all in one elegant platform.
          </p>

          <div className="hero-actions">
            <a href="#services" className="btn-primary">Explore Platform</a>
            <a href="#about"    className="btn-ghost">Our Story</a>
          </div>
        </div>

        <div className="scroll-cue" aria-hidden="true">
          <span>Scroll</span>
          <div className="scroll-line" />
        </div>
      </section>

      {/* ════════════════════════════
          STATS TICKER
      ════════════════════════════ */}
      <div className="stats-ticker" id="stats">
        <div className="ticker-track">
          {[
            { num: '50K+',  label: 'Birds Monitored Daily'   },
            { num: '98.2%', label: 'System Uptime'           },
            { num: '320+',  label: 'Farms Under Management'  },
            { num: '40%',   label: 'Avg. Mortality Reduction' },
            { num: '5 Yrs', label: 'Industry Experience'     },
            { num: '24/7',  label: 'Expert Support'          },
            { num: '50K+',  label: 'Birds Monitored Daily'   },
            { num: '98.2%', label: 'System Uptime'           },
            { num: '320+',  label: 'Farms Under Management'  },
            { num: '40%',   label: 'Avg. Mortality Reduction' },
            { num: '5 Yrs', label: 'Industry Experience'     },
            { num: '24/7',  label: 'Expert Support'          },
          ].map((s, i) => (
            <React.Fragment key={i}>
              <div className="stat-item">
                <div className="stat-num">{s.num}</div>
                <div className="stat-label">{s.label}</div>
              </div>
              <div className="stat-divider" aria-hidden="true" />
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ════════════════════════════
          SERVICES
      ════════════════════════════ */}
      <section className="services-section" id="services">
        <div className="section-inner">
          <div className={`section-header reveal ${servicesVis ? 'visible' : ''}`} ref={servicesRef}>
            <SectionLabel>What We Offer</SectionLabel>
            <h2 className="section-title">Built for the Modern<br /><em>Poultry Operation</em></h2>
          </div>

          <div className="services-grid">
            {[
              { num: '01', icon: '🐔', name: 'Flock Management',     desc: 'Track every batch from day-old chick to market-weight bird. Monitor health indicators, vaccination schedules, and daily weight gain with precision.' },
              { num: '02', icon: '📊', name: 'Production Analytics',  desc: 'Real-time dashboards powered by your farm data. Feed conversion ratios, mortality trends, egg production rates — all in one elegant interface.' },
              { num: '03', icon: '💊', name: 'Health & Biosecurity',  desc: 'Integrated disease surveillance, medication tracking, and biosecurity audit tools to keep your flock healthy and your farm compliant.' },
              { num: '04', icon: '🏭', name: 'Feed & Inventory',      desc: 'Automated feed consumption forecasting, supplier management, and stock alerts ensure you never run short — or overspend.' },
              { num: '05', icon: '💰', name: 'Financial Reporting',   desc: 'Profit-and-loss per batch, cost-per-bird breakdowns, and ROI projections. Make smarter decisions backed by actual farm economics.' },
              { num: '06', icon: '🌐', name: 'Multi-Farm Control',    desc: 'Manage multiple farms from a single command center. Benchmark performance across sites and deploy best practices at scale.' },
            ].map((s, i) => (
              <div
                className={`service-card reveal ${servicesVis ? 'visible' : ''}`}
                style={{ transitionDelay: `${i * 80}ms` }}
                key={s.num}
              >
                <span className="service-bg-num">{s.num}</span>
                <span className="service-icon">{s.icon}</span>
                <h3 className="service-name">{s.name}</h3>
                <p className="service-desc">{s.desc}</p>
                <span className="service-link">Learn more →</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════
          WHY POLTRIFARM
      ════════════════════════════ */}
      <section className="why-section" id="why">
        <div className="why-visual-col">
          <div className={`why-img-wrap reveal ${whyVis ? 'visible' : ''}`} ref={whyRef}>
            <img
              src="https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800&q=80"
              alt="Poultry farm interior"
              loading="lazy"
            />
            <div className="why-accent-card">
              <div className="accent-num">40%</div>
              <div className="accent-label">Avg. reduction in flock<br />mortality within 6 months</div>
            </div>
          </div>
        </div>

        <div className={`why-content-col reveal ${whyVis ? 'visible' : ''}`} style={{ transitionDelay: '150ms' }}>
          <SectionLabel>Why POLTRIFARM</SectionLabel>
          <h2 className="section-title">Precision Tools for<br /><em>Serious Farmers</em></h2>

          <div className="feature-list">
            {[
              { icon: '⚡', title: 'Real-Time Monitoring',      desc: 'Live data streams from your farm floor. Alerts sent instantly to your phone the moment something needs attention.' },
              { icon: '🔐', title: 'Enterprise-Grade Security', desc: 'Your farm data is encrypted, backed up, and fully yours. Role-based access controls for every team member.' },
              { icon: '📱', title: 'Works Everywhere',          desc: 'Fully responsive across desktop, tablet, and mobile. Manage your flock from the barn, office, or on the road.' },
              { icon: '🤝', title: 'Dedicated Onboarding',      desc: 'Our team walks alongside you from setup to scale. Training, migration, and ongoing support included in every plan.' },
            ].map(f => (
              <div className="feature-item" key={f.title}>
                <div className="feature-icon-box">{f.icon}</div>
                <div>
                  <div className="feature-title">{f.title}</div>
                  <p className="feature-desc">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════
          ABOUT
      ════════════════════════════ */}
      <section className="about-section" id="about">
        <div className="section-inner about-inner">
          <div className={`about-left reveal ${aboutVis ? 'visible' : ''}`} ref={aboutRef}>
            <SectionLabel>Our Story</SectionLabel>
            <h2 className="section-title">From the Farm<br /><em>Floor Up</em></h2>
            <blockquote className="about-quote">
              "We built the system we always wished existed when we were running our own flocks."
            </blockquote>
          </div>

          <div className={`about-right reveal ${aboutVis ? 'visible' : ''}`} style={{ transitionDelay: '180ms' }}>
            <p>POLTRIFARM was born out of <strong>frustration and necessity</strong>. Our founders spent years managing mid-scale poultry operations and saw first-hand how fragmented, paper-based software was failing farmers at every turn.</p>
            <p>In 2019, we set out to build something different — a <strong>management system designed by farmers, for farmers</strong>. We spent two years in the field before writing a single line of code.</p>
            <p>Today, POLTRIFARM is trusted by farms managing everything from 500 birds to half a million. <strong>Our mission remains the same:</strong> make world-class farm management accessible to everyone.</p>

            <div className="milestones">
              {[
                { year: '2019', title: 'Founded',                    desc: 'Established with a vision to digitize poultry farm management across the region.' },
                { year: '2020', title: 'First 50 Farms Onboarded',   desc: 'Launched our beta, collecting feedback to build the platform farmers actually needed.' },
                { year: '2022', title: 'Analytics Engine Launched',  desc: 'Released our proprietary analytics module — unprecedented insight into flock performance.' },
                { year: '2024', title: 'Multi-Farm Dashboard',       desc: 'Expanded to support enterprise-level management, serving agribusiness groups nationwide.' },
              ].map(m => (
                <div className="milestone" key={m.year}>
                  <div className="milestone-year">{m.year}</div>
                  <div>
                    <div className="milestone-title">{m.title}</div>
                    <p className="milestone-desc">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════
          TESTIMONIALS
      ════════════════════════════ */}
      <section className="testimonials-section" id="testimonials">
        <div className={`testimonials-header reveal ${testiVis ? 'visible' : ''}`} ref={testimonialsRef}>
          <SectionLabel>Client Voices</SectionLabel>
          <h2 className="section-title">Trusted by <em>Real Farmers</em></h2>
        </div>

        <div className="testimonials-scroll">
          <div className="testimonials-track">
            {[
              { initials: 'JM', name: 'James Morales',    role: 'Owner, Morales Poultry Estate',   text: '"POLTRIFARM gave us visibility we never had before. Mortality dropped 35% in our first production cycle."' },
              { initials: 'SA', name: 'Sandra Alcantara', role: 'CFO, AgriNest Holdings',           text: '"The financial reporting alone paid for the subscription in the first month. Finally know my actual cost per bird."' },
              { initials: 'RT', name: 'Ramon Torres',     role: 'Operations Director, Torres Agri', text: '"Managing 4 farms used to require 3 people. Now one manager handles everything from a single screen."' },
              { initials: 'MV', name: 'Maria Villanueva', role: 'Farm Manager, Sun Valley Poultry', text: '"Onboarding was seamless. The team was with us every step. We were fully live in under two weeks."' },
              { initials: 'LD', name: 'Luis Domingo',     role: 'Biosecurity Officer, PrimeFlock',  text: '"The biosecurity audit feature alone is worth it. We passed our certification with zero surprises."' },
              { initials: 'JM', name: 'James Morales',    role: 'Owner, Morales Poultry Estate',   text: '"POLTRIFARM gave us visibility we never had before. Mortality dropped 35% in our first production cycle."' },
              { initials: 'SA', name: 'Sandra Alcantara', role: 'CFO, AgriNest Holdings',           text: '"The financial reporting alone paid for the subscription in the first month. Finally know my actual cost per bird."' },
              { initials: 'RT', name: 'Ramon Torres',     role: 'Operations Director, Torres Agri', text: '"Managing 4 farms used to require 3 people. Now one manager handles everything from a single screen."' },
            ].map((t, i) => (
              <div className="testimonial-card" key={i}>
                <div className="testimonial-stars">★★★★★</div>
                <p className="testimonial-text">{t.text}</p>
                <div className="testimonial-author">
                  <div className="author-avatar">{t.initials}</div>
                  <div>
                    <div className="author-name">{t.name}</div>
                    <div className="author-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════
          CONTACT
      ════════════════════════════ */}
      <section className="contact-section" id="contact">
        <div className="section-inner contact-inner">
          <div className={`contact-left reveal ${contactVis ? 'visible' : ''}`} ref={contactRef}>
            <SectionLabel>Get In Touch</SectionLabel>
            <h2 className="section-title">Ready to Transform<br /><em>Your Farm?</em></h2>
            <p className="contact-intro">Our team will walk you through a personalized demo and help you find the right plan — no commitment required.</p>

            <div className="contact-details">
              {[
                { icon: '📍', label: 'Address', value: '123 Farm Road, AgriCity, Province' },
                { icon: '📧', label: 'Email',   value: 'hello@poltrifarm.com' },
                { icon: '📞', label: 'Phone',   value: '+63 900 123 4567' },
                { icon: '🕐', label: 'Hours',   value: 'Mon–Fri, 8:00 AM – 6:00 PM' },
              ].map(d => (
                <div className="contact-detail" key={d.label}>
                  <div className="contact-detail-icon">{d.icon}</div>
                  <div>
                    <label>{d.label}</label>
                    <span>{d.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <form
            className={`contact-form reveal ${contactVis ? 'visible' : ''}`}
            style={{ transitionDelay: '180ms' }}
            onSubmit={handleSubmit}
          >
            <div className="form-row">
              <div className="form-group">
                <label>First Name</label>
                <input type="text" placeholder="Juan" required />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input type="text" placeholder="dela Cruz" required />
              </div>
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="juan@yourfarm.com" required />
            </div>
            <div className="form-group">
              <label>Farm Size</label>
              <select>
                <option value="">Select approximate flock size</option>
                <option>Under 1,000 birds</option>
                <option>1,000 – 10,000 birds</option>
                <option>10,000 – 50,000 birds</option>
                <option>50,000+ birds</option>
              </select>
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea placeholder="Tell us about your farm and what you're looking for…" />
            </div>
            <div className="form-submit-row">
              <button type="submit" className="btn-primary">Send Message</button>
              {formSent && <span className="form-success">✓ Message sent! We'll be in touch soon.</span>}
            </div>
          </form>
        </div>
      </section>

      {/* ════════════════════════════
          FOOTER
      ════════════════════════════ */}

    </div>
  );
}

export default Homepage;
