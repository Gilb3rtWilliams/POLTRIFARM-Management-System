import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../css/Auth.css';

function Particles() {
  const items = Array.from({ length: 18 }, (_, i) => ({
    id: i, left: `${Math.random() * 100}%`,
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

export default function AdminLogin() {
  const navigate = useNavigate();
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

  const [form, setForm]       = useState({ adminId: '', email: '', password: '' });
  const [errors, setErrors]   = useState({});
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [banner, setBanner]   = useState(null);
  const [attempts, setAttempts] = useState(0);

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    if (errors[k]) setErrors(e => ({ ...e, [k]: null }));
  };

  const validate = () => {
    const e = {};
    if (!form.adminId.trim()) e.adminId  = 'Admin ID is required.';
    if (!form.email)          e.email    = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email.';
    if (!form.password)       e.password = 'Password is required.';
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (attempts >= 5) {
      setBanner({ type: 'error', msg: 'Too many attempts. Please contact system support.' });
      return;
    }
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true); setBanner(null);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setAttempts(a => a + 1);
    // Mock: replace with real admin auth
    setBanner({ type: 'success', msg: 'Admin authenticated. Redirecting to control panel…' });
    setTimeout(() => navigate('/dashboard'), 1600);
  };

  const expand = () => ringRef.current?.classList.add('expanded');
  const shrink = () => ringRef.current?.classList.remove('expanded');

  return (
    <div className="auth-page">
      <div className="cursor-dot"  ref={dotRef}  aria-hidden="true" />
      <div className="cursor-ring" ref={ringRef} aria-hidden="true" />

      {/* LEFT — distinct admin color treatment */}
      <div className="auth-panel-left admin-panel-left">
        <div className="auth-geo auth-geo-line-1" />
        <div className="auth-geo auth-geo-line-2" />
        <div className="auth-geo auth-geo-circle" />
        <div className="auth-geo auth-geo-circle-inner" />
        <Particles />


        <div className="auth-left-body">
          <div className="auth-left-eyebrow">Administrator Portal</div>
          <h2 className="auth-left-heading">
            System<br /><em>Control</em><br /><strong>Centre.</strong>
          </h2>
          <p className="auth-left-desc">
            Restricted access for authorized administrators only.
            This portal provides full system oversight, user management,
            and platform configuration.
          </p>
          <div className="auth-left-features">
            {[
              'Full user account management',
              'System-wide analytics & reporting',
              'Farm onboarding & configuration',
              'Security audit & access control',
            ].map(f => <div className="auth-feature-pill" key={f}>{f}</div>)}
          </div>
        </div>

        <div className="auth-left-footer">
          © {new Date().getFullYear()} POLTRIFARM — Restricted Access
        </div>
      </div>

      {/* RIGHT */}
      <div className="auth-panel-right">
        <div className="auth-form-wrap">
          <div className="admin-badge">◆ Administrator Access</div>

          <div className="auth-form-header">
            <div className="auth-form-eyebrow">Admin Portal</div>
            <h1 className="auth-form-title">Admin <em>Sign In</em></h1>
            <p className="auth-form-subtitle">
              Authorized personnel only. All access attempts are logged and monitored.
            </p>
          </div>

          {/* Role switch */}
          <div className="auth-role-toggle" role="tablist" aria-label="Account type">
            <button
              role="tab" aria-selected="false"
              className="role-tab"
              onClick={() => navigate('/login')}
              onMouseEnter={expand} onMouseLeave={shrink}
            >
              🌾 &nbsp;Farmer
            </button>
            <button
              role="tab" aria-selected="true"
              className="role-tab active"
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
            <div className="auth-field">
              <label>Admin ID</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">◆</span>
                <input className={`auth-input ${errors.adminId ? 'error' : ''}`}
                  type="text" placeholder="Your administrator ID"
                  value={form.adminId} onChange={e => set('adminId', e.target.value)}
                  onMouseEnter={expand} onMouseLeave={shrink} autoComplete="username" />
              </div>
              {errors.adminId && <span className="auth-field-error">{errors.adminId}</span>}
            </div>

            <div className="auth-field">
              <label>Email Address</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">✉</span>
                <input className={`auth-input ${errors.email ? 'error' : ''}`}
                  type="email" placeholder="admin@poltrifarm.com"
                  value={form.email} onChange={e => set('email', e.target.value)}
                  onMouseEnter={expand} onMouseLeave={shrink} autoComplete="email" />
              </div>
              {errors.email && <span className="auth-field-error">{errors.email}</span>}
            </div>

            <div className="auth-field">
              <label>Password</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">🔒</span>
                <input className={`auth-input ${errors.password ? 'error' : ''}`}
                  type={showPw ? 'text' : 'password'} placeholder="Admin password"
                  value={form.password} onChange={e => set('password', e.target.value)}
                  onMouseEnter={expand} onMouseLeave={shrink} autoComplete="current-password" />
                <button type="button" className="auth-pw-toggle"
                  onClick={() => setShowPw(v => !v)}
                  onMouseEnter={expand} onMouseLeave={shrink}>
                  {showPw ? 'Hide' : 'Show'}
                </button>
              </div>
              {errors.password && <span className="auth-field-error">{errors.password}</span>}
            </div>

            {attempts > 0 && attempts < 5 && (
              <div className="auth-error-banner" style={{ fontSize: '0.75rem' }}>
                ⚠ &nbsp;{5 - attempts} attempt{5 - attempts !== 1 ? 's' : ''} remaining before lockout.
              </div>
            )}

            <button type="submit" className="auth-submit" disabled={loading || attempts >= 5}
              onMouseEnter={expand} onMouseLeave={shrink}>
              <span className="auth-submit-inner">
                {loading && <span className="auth-spinner" />}
                {loading ? 'Verifying…' : 'Access Control Panel'}
              </span>
            </button>
          </form>

          <div className="auth-footer-link">
            Need an admin account?&nbsp;
            <Link to="/admin/register" onMouseEnter={expand} onMouseLeave={shrink}>
              Request access here
            </Link>
          </div>
          <div className="auth-footer-link" style={{ marginTop: '0.6rem' }}>
            <Link to="/" onMouseEnter={expand} onMouseLeave={shrink}>← Back to homepage</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
