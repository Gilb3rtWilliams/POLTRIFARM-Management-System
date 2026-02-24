import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../css/Auth.css';

/* ── Floating particles helper ── */
function Particles() {
  const items = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    size: `${Math.random() * 2 + 1}px`,
    duration: `${Math.random() * 14 + 8}s`,
    delay: `${Math.random() * 10}s`,
  }));
  return (
    <div className="auth-particles" aria-hidden="true">
      {items.map(p => (
        <div key={p.id} className="auth-particle" style={{
          left: p.left, width: p.size, height: p.size,
          animationDuration: p.duration, animationDelay: p.delay,
        }} />
      ))}
    </div>
  );
}

export default function UserLogin() {
  const navigate = useNavigate();

  /* -- cursor -- */
  const dotRef  = useRef(null);
  const ringRef = useRef(null);
  const mouse   = useRef({ x: -200, y: -200 });
  const pos     = useRef({ x: -200, y: -200 });

  useEffect(() => {
    const move = e => { mouse.current.x = e.clientX; mouse.current.y = e.clientY; };
    window.addEventListener('mousemove', move);
    let raf;
    const loop = () => {
      pos.current.x += (mouse.current.x - pos.current.x) * 0.11;
      pos.current.y += (mouse.current.y - pos.current.y) * 0.11;
      if (dotRef.current)
        dotRef.current.style.transform = `translate(${mouse.current.x - 5}px,${mouse.current.y - 5}px)`;
      if (ringRef.current)
        ringRef.current.style.transform = `translate(${pos.current.x - 18}px,${pos.current.y - 18}px)`;
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => { window.removeEventListener('mousemove', move); cancelAnimationFrame(raf); };
  }, []);

  /* -- form state -- */
  const [form, setForm]       = useState({ email: '', password: '' });
  const [errors, setErrors]   = useState({});
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [banner, setBanner]   = useState(null); // { type, msg }

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    if (errors[k]) setErrors(e => ({ ...e, [k]: null }));
  };

  const validate = () => {
    const e = {};
    if (!form.email)    e.email    = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email.';
    if (!form.password) e.password = 'Password is required.';
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    setBanner(null);
    // Simulate API call — replace with real auth
    await new Promise(r => setTimeout(r, 1400));
    setLoading(false);
    // Mock success
    setBanner({ type: 'success', msg: 'Login successful! Redirecting to dashboard…' });
    setTimeout(() => navigate('/dashboard'), 1600);
  };

  const expand = () => ringRef.current?.classList.add('expanded');
  const shrink = () => ringRef.current?.classList.remove('expanded');

  return (
    <div className="auth-page">
      <div className="cursor-dot"  ref={dotRef}  aria-hidden="true" />
      <div className="cursor-ring" ref={ringRef} aria-hidden="true" />

      {/* ── LEFT PANEL ── */}
      <div className="auth-panel-left">
        <div className="auth-geo auth-geo-line-1" />
        <div className="auth-geo auth-geo-line-2" />
        <div className="auth-geo auth-geo-circle" />
        <div className="auth-geo auth-geo-circle-inner" />
        <Particles />

        

        <div className="auth-left-body">
          <div className="auth-left-eyebrow">Farmer Portal</div>
          <h2 className="auth-left-heading">
            Welcome<br /><em>Back</em> to<br /><strong>Your Farm.</strong>
          </h2>
          <p className="auth-left-desc">
            Sign in to manage your flock, track production, and access real-time
            analytics — all from one powerful platform.
          </p>
          <div className="auth-left-features">
            {[
              'Live flock health monitoring',
              'Feed & inventory tracking',
              'Daily production analytics',
              'Financial performance reports',
            ].map(f => (
              <div className="auth-feature-pill" key={f}>{f}</div>
            ))}
          </div>
        </div>

        <div className="auth-left-footer">
          © {new Date().getFullYear()} POLTRIFARM Management System
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="auth-panel-right">
        <div className="auth-form-wrap">
          <div className="auth-form-header">
            <div className="auth-form-eyebrow">Farmer Account</div>
            <h1 className="auth-form-title">Sign <em>In</em></h1>
            <p className="auth-form-subtitle">
              Access your farm dashboard and operations.
            </p>
          </div>

          {/* Role switch */}
          <div className="auth-role-toggle" role="tablist" aria-label="Account type">
            <button
              role="tab" aria-selected="true"
              className="role-tab active"
              onMouseEnter={expand} onMouseLeave={shrink}
            >
              🌾 &nbsp;Farmer
            </button>
            <button
              role="tab" aria-selected="false"
              className="role-tab"
              onClick={() => navigate('/admin/login')}
              onMouseEnter={expand} onMouseLeave={shrink}
            >
              ◆ &nbsp;Admin
            </button>
          </div>

          {banner && (
            <div className={banner.type === 'success' ? 'auth-success' : 'auth-error-banner'}>
              {banner.type === 'success' ? '✓' : '✕'} &nbsp;{banner.msg}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className="auth-field">
              <label htmlFor="email">Email Address</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">✉</span>
                <input
                  id="email" type="email" className={`auth-input ${errors.email ? 'error' : ''}`}
                  placeholder="you@yourfarm.com"
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                  onMouseEnter={expand} onMouseLeave={shrink}
                  autoComplete="email"
                />
              </div>
              {errors.email && <span className="auth-field-error">{errors.email}</span>}
            </div>

            {/* Password */}
            <div className="auth-field">
              <label htmlFor="password">Password</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">🔒</span>
                <input
                  id="password" type={showPw ? 'text' : 'password'}
                  className={`auth-input ${errors.password ? 'error' : ''}`}
                  placeholder="Your password"
                  value={form.password}
                  onChange={e => set('password', e.target.value)}
                  onMouseEnter={expand} onMouseLeave={shrink}
                  autoComplete="current-password"
                />
                <button
                  type="button" className="auth-pw-toggle"
                  onClick={() => setShowPw(v => !v)}
                  onMouseEnter={expand} onMouseLeave={shrink}
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? 'Hide' : 'Show'}
                </button>
              </div>
              {errors.password && <span className="auth-field-error">{errors.password}</span>}
            </div>

            {/* Remember me */}
            <label className="auth-checkbox-row">
              <input type="checkbox" onMouseEnter={expand} onMouseLeave={shrink} />
              Keep me signed in on this device
            </label>

            <button
              type="submit" className="auth-submit"
              disabled={loading}
              onMouseEnter={expand} onMouseLeave={shrink}
            >
              <span className="auth-submit-inner">
                {loading && <span className="auth-spinner" />}
                {loading ? 'Signing In…' : 'Sign In to Dashboard'}
              </span>
            </button>
          </form>

          <div className="auth-footer-link" style={{ marginTop: '1.5rem' }}>
            Don't have an account?&nbsp;
            <Link to="/register" onMouseEnter={expand} onMouseLeave={shrink}>
              Create one here
            </Link>
          </div>
          <div className="auth-footer-link" style={{ marginTop: '0.6rem' }}>
            <Link to="/" onMouseEnter={expand} onMouseLeave={shrink}>
              ← Back to homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
