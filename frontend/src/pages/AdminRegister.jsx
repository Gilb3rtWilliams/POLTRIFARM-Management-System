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

function pwStrength(pw) {
  let score = 0;
  if (pw.length >= 10)            score++;
  if (/[A-Z]/.test(pw))          score++;
  if (/[0-9]/.test(pw))          score++;
  if (/[^A-Za-z0-9]/.test(pw))   score++;
  return score;
}

export default function AdminRegister() {
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

  const [form, setForm]       = useState({ firstName: '', lastName: '', email: '', role: '', accessCode: '', password: '', confirm: '' });
  const [errors, setErrors]   = useState({});
  const [showPw, setShowPw]   = useState(false);
  const [agreed, setAgreed]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const strength = pwStrength(form.password);

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    if (errors[k]) setErrors(e => ({ ...e, [k]: null }));
  };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim())  e.firstName  = 'First name is required.';
    if (!form.lastName.trim())   e.lastName   = 'Last name is required.';
    if (!form.email)             e.email      = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email.';
    if (!form.role)              e.role       = 'Please select an admin role.';
    if (!form.accessCode.trim()) e.accessCode = 'Authorization code is required.';
    if (!form.password)          e.password   = 'Password is required.';
    else if (form.password.length < 10) e.password = 'Admin passwords require at least 10 characters.';
    else if (strength < 3) e.password = 'Password is too weak. Use uppercase, numbers, and symbols.';
    if (form.confirm !== form.password) e.confirm = 'Passwords do not match.';
    if (!agreed) e.terms = 'You must acknowledge the admin responsibilities.';
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1600));
    setLoading(false);
    setSuccess(true);
    setTimeout(() => navigate('/admin/login'), 2500);
  };

  const expand = () => ringRef.current?.classList.add('expanded');
  const shrink = () => ringRef.current?.classList.remove('expanded');

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength];
  const strengthClass = ['', 'weak', 'weak', 'medium', 'strong'][strength];

  return (
    <div className="auth-page">
      <div className="cursor-dot"  ref={dotRef}  aria-hidden="true" />
      <div className="cursor-ring" ref={ringRef} aria-hidden="true" />

      {/* LEFT */}
      <div className="auth-panel-left admin-panel-left">
        <div className="auth-geo auth-geo-line-1" />
        <div className="auth-geo auth-geo-line-2" />
        <div className="auth-geo auth-geo-circle" />
        <div className="auth-geo auth-geo-circle-inner" />
        <Particles />

        <div className="auth-left-body">
          <div className="auth-left-eyebrow">Administrator Portal</div>
          <h2 className="auth-left-heading">
            Request<br /><em>Admin</em><br /><strong>Access.</strong>
          </h2>
          <p className="auth-left-desc">
            Admin registration requires a valid authorization code issued by a
            super-administrator. All accounts are subject to review before activation.
          </p>
          <div className="auth-left-features">
            {[
              'Requires valid authorization code',
              'Account reviewed within 24 hours',
              'Full audit trail on all actions',
              'Role-based permission scoping',
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
          <div className="admin-badge">◆ Administrator Registration</div>

          <div className="auth-form-header">
            <div className="auth-form-eyebrow">Admin Portal</div>
            <h1 className="auth-form-title">Request <em>Access</em></h1>
            <p className="auth-form-subtitle">
              Complete this form with your authorization code to request an admin account.
            </p>
          </div>

          {success && (
            <div className="auth-success">
              ✓ &nbsp;Request submitted. A super-admin will review your account within 24 hours.
            </div>
          )}

          {!success && (
            <form className="auth-form" onSubmit={handleSubmit} noValidate>
              <div className="form-row-2">
                <div className="auth-field">
                  <label>First Name</label>
                  <div className="auth-input-wrap">
                    <span className="auth-input-icon">👤</span>
                    <input className={`auth-input ${errors.firstName ? 'error' : ''}`}
                      type="text" placeholder="First" value={form.firstName}
                      onChange={e => set('firstName', e.target.value)}
                      onMouseEnter={expand} onMouseLeave={shrink} />
                  </div>
                  {errors.firstName && <span className="auth-field-error">{errors.firstName}</span>}
                </div>
                <div className="auth-field">
                  <label>Last Name</label>
                  <div className="auth-input-wrap">
                    <span className="auth-input-icon">👤</span>
                    <input className={`auth-input ${errors.lastName ? 'error' : ''}`}
                      type="text" placeholder="Last" value={form.lastName}
                      onChange={e => set('lastName', e.target.value)}
                      onMouseEnter={expand} onMouseLeave={shrink} />
                  </div>
                  {errors.lastName && <span className="auth-field-error">{errors.lastName}</span>}
                </div>
              </div>

              <div className="auth-field">
                <label>Official Email Address</label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">✉</span>
                  <input className={`auth-input ${errors.email ? 'error' : ''}`}
                    type="email" placeholder="admin@organization.com"
                    value={form.email} onChange={e => set('email', e.target.value)}
                    onMouseEnter={expand} onMouseLeave={shrink} autoComplete="email" />
                </div>
                {errors.email && <span className="auth-field-error">{errors.email}</span>}
              </div>

              <div className="auth-field">
                <label>Admin Role</label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">◆</span>
                  <select className={`auth-input ${errors.role ? 'error' : ''}`}
                    value={form.role} onChange={e => set('role', e.target.value)}
                    onMouseEnter={expand} onMouseLeave={shrink}
                    style={{ paddingLeft: '2.8rem', appearance: 'none', cursor: 'none' }}>
                    <option value="">Select your role</option>
                    <option value="super_admin">Super Administrator</option>
                    <option value="farm_admin">Farm Administrator</option>
                    <option value="reports_admin">Reports & Analytics Admin</option>
                    <option value="support_admin">Support Administrator</option>
                  </select>
                </div>
                {errors.role && <span className="auth-field-error">{errors.role}</span>}
              </div>

              <div className="auth-field">
                <label>Authorization Code</label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">🔑</span>
                  <input className={`auth-input ${errors.accessCode ? 'error' : ''}`}
                    type="text" placeholder="Issued by super-administrator"
                    value={form.accessCode} onChange={e => set('accessCode', e.target.value)}
                    onMouseEnter={expand} onMouseLeave={shrink}
                    style={{ letterSpacing: '0.1em', fontFamily: 'monospace' }} />
                </div>
                {errors.accessCode && <span className="auth-field-error">{errors.accessCode}</span>}
              </div>

              <div className="auth-field">
                <label>Password <span style={{ color: 'var(--muted)', fontSize: '0.6rem' }}>(min. 10 chars)</span></label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">🔒</span>
                  <input className={`auth-input ${errors.password ? 'error' : ''}`}
                    type={showPw ? 'text' : 'password'} placeholder="Strong password required"
                    value={form.password} onChange={e => set('password', e.target.value)}
                    onMouseEnter={expand} onMouseLeave={shrink} autoComplete="new-password" />
                  <button type="button" className="auth-pw-toggle"
                    onClick={() => setShowPw(v => !v)}
                    onMouseEnter={expand} onMouseLeave={shrink}>
                    {showPw ? 'Hide' : 'Show'}
                  </button>
                </div>
                {form.password && (
                  <>
                    <div className="auth-pw-strength">
                      {[1,2,3,4].map(i => (
                        <div key={i} className={`pw-bar ${i <= strength ? strengthClass : ''}`} />
                      ))}
                    </div>
                    <span style={{ fontSize: '0.65rem', color: 'var(--muted)', marginTop: '0.2rem' }}>
                      Strength: <em style={{ color: strength >= 3 ? 'var(--success)' : strength === 2 ? '#e0b870' : 'var(--danger)' }}>{strengthLabel}</em>
                    </span>
                  </>
                )}
                {errors.password && <span className="auth-field-error">{errors.password}</span>}
              </div>

              <div className="auth-field">
                <label>Confirm Password</label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">🔒</span>
                  <input className={`auth-input ${errors.confirm ? 'error' : ''}`}
                    type={showPw ? 'text' : 'password'} placeholder="Repeat password"
                    value={form.confirm} onChange={e => set('confirm', e.target.value)}
                    onMouseEnter={expand} onMouseLeave={shrink} autoComplete="new-password" />
                </div>
                {errors.confirm && <span className="auth-field-error">{errors.confirm}</span>}
              </div>

              <label className="auth-checkbox-row">
                <input type="checkbox" checked={agreed}
                  onChange={e => { setAgreed(e.target.checked); if (errors.terms) setErrors(er => ({ ...er, terms: null })); }}
                  onMouseEnter={expand} onMouseLeave={shrink} />
                I acknowledge my administrator responsibilities and agree to the&nbsp;
                <a href="/admin-policy">Admin Policy</a>&nbsp;and&nbsp;<a href="/code-of-conduct">Code of Conduct</a>
              </label>
              {errors.terms && <span className="auth-field-error">{errors.terms}</span>}

              <button type="submit" className="auth-submit" disabled={loading}
                onMouseEnter={expand} onMouseLeave={shrink}>
                <span className="auth-submit-inner">
                  {loading && <span className="auth-spinner" />}
                  {loading ? 'Submitting Request…' : 'Submit Admin Registration'}
                </span>
              </button>
            </form>
          )}

          <div className="auth-footer-link">
            Already have an admin account?&nbsp;
            <Link to="/admin/login" onMouseEnter={expand} onMouseLeave={shrink}>Sign in here</Link>
          </div>
          <div className="auth-footer-link" style={{ marginTop: '0.6rem' }}>
            <Link to="/" onMouseEnter={expand} onMouseLeave={shrink}>← Back to homepage</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
