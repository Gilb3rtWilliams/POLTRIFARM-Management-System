import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../css/NavBar.css';
import logo from '../assets/logos/app.png';

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/' },
  { label: 'Inventory',  path: '/inventory'  },
  { label: 'Sales',      path: '/sales'      },
  { label: 'Reports',    path: '/reports'    },
  { label: 'About',      path: '/about'      },
  { label: 'Settings',   path: '/settings'   },
];

const NavBar = ({ scrolled = false }) => {
  const [isOpen, setIsOpen]       = useState(false);
  const [animating, setAnimating] = useState(false);
  const [authOpen, setAuthOpen]   = useState(false); // auth dropdown
  const navigate  = useNavigate();
  const location  = useLocation();
  const menuRef   = useRef(null);
  const authRef   = useRef(null);

  const openMenu  = () => { setAnimating(true); setIsOpen(true); };
  const closeMenu = () => {
    setAnimating(false);
    setTimeout(() => setIsOpen(false), 320);
  };
  const toggleMenu = () => (isOpen ? closeMenu() : openMenu());

  const handleNavClick = (path) => { closeMenu(); setTimeout(() => navigate(path), 160); };
  const handleLogout   = () => { closeMenu(); setTimeout(() => navigate('/logout'), 160); };

  /* Close nav on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) closeMenu();
      if (authRef.current && !authRef.current.contains(e.target)) setAuthOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  /* Close on route change */
  useEffect(() => { closeMenu(); setAuthOpen(false); }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar-container">

        {/* ── BRAND ── */}
        <button className="navbar-brand" onClick={() => navigate('/')}>
          <div className="navbar-logo-wrap">
            <img src={logo} alt="Poltrifarm Logo" className="navbar-logo" />
            <div className="logo-ring" aria-hidden="true" />
          </div>
          <div className="brand-text">
            <span className="brand-name">POLTRI<em>FARM</em></span>
            <span className="brand-sub">Management System</span>
          </div>
        </button>

        {/* ── DESKTOP LINKS ── */}
        <div className="navbar-desktop-links">
          {NAV_ITEMS.slice(0, 4).map(item => (
            <button
              key={item.path}
              className={`desktop-link ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => handleNavClick(item.path)}
            >
              {item.label}
              <span className="desktop-link-bar" />
            </button>
          ))}
        </div>

        {/* ── RIGHT ACTIONS ── */}
        <div className="navbar-right">

          {/* Auth dropdown trigger */}
          <div className="auth-dropdown-wrap" ref={authRef}>
            <button
              className={`navbar-auth-btn ${authOpen ? 'navbar-auth-btn--open' : ''}`}
              onClick={() => setAuthOpen(v => !v)}
              aria-expanded={authOpen}
              aria-label="Sign in options"
            >
              <span className="auth-btn-icon">⬡</span>
              Sign In
              <span className={`auth-btn-chevron ${authOpen ? 'rotated' : ''}`}>▾</span>
            </button>

            {authOpen && (
              <div className="auth-dropdown" role="menu">
                <div className="auth-dropdown-header">Sign in as</div>

                <button
                  className="auth-dropdown-item"
                  role="menuitem"
                  onClick={() => { setAuthOpen(false); navigate('/login'); }}
                >
                  <div className="auth-item-icon farmer-icon">🌾</div>
                  <div className="auth-item-body">
                    <div className="auth-item-label">Farmer</div>
                    <div className="auth-item-sub">Access your farm dashboard</div>
                  </div>
                  <span className="auth-item-arrow">→</span>
                </button>

                <div className="auth-dropdown-divider" />

                <button
                  className="auth-dropdown-item auth-dropdown-item--admin"
                  role="menuitem"
                  onClick={() => { setAuthOpen(false); navigate('/admin/login'); }}
                >
                  <div className="auth-item-icon admin-icon">◆</div>
                  <div className="auth-item-body">
                    <div className="auth-item-label">Administrator</div>
                    <div className="auth-item-sub">System control panel</div>
                  </div>
                  <span className="auth-item-arrow">→</span>
                </button>

                <div className="auth-dropdown-footer">
                  New farmer?&nbsp;
                  <button
                    className="auth-dropdown-register-link"
                    onClick={() => { setAuthOpen(false); navigate('/register'); }}
                  >
                    Create account
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── HAMBURGER ── */}
          <div className="menu-wrapper" ref={menuRef}>
            <button
              className={`menu-toggle ${isOpen ? 'menu-toggle--open' : ''}`}
              onClick={toggleMenu}
              aria-label="Toggle navigation menu"
              aria-expanded={isOpen}
            >
              <span className="hamburger-bar" />
              <span className="hamburger-bar" />
              <span className="hamburger-bar" />
            </button>

            {(isOpen || animating) && (
              <div className={`dropdown-menu ${animating ? 'dropdown-menu--visible' : ''}`}>
                <div className="dropdown-header">
                  <span className="dropdown-label">Navigation</span>
                </div>

                {NAV_ITEMS.map((item, i) => (
                  <button
                    key={item.path}
                    className={`dropdown-item ${isActive(item.path) ? 'dropdown-item--active' : ''}`}
                    style={{ animationDelay: `${i * 45}ms` }}
                    onClick={() => handleNavClick(item.path)}
                  >
                    <span className="dropdown-item-dot" aria-hidden="true" />
                    <span className="dropdown-item-label">{item.label}</span>
                    {isActive(item.path) && <span className="dropdown-item-active-pip" aria-hidden="true" />}
                  </button>
                ))}

                {/* Auth links inside hamburger menu */}
                <div className="dropdown-divider" />
                <div className="dropdown-section-label">Sign In</div>

                <button
                  className="dropdown-item dropdown-item--auth"
                  style={{ animationDelay: `${NAV_ITEMS.length * 45}ms` }}
                  onClick={() => handleNavClick('/login')}
                >
                  <span className="dropdown-item-dot" style={{ background: 'rgba(201,168,76,0.5)' }} />
                  <span className="dropdown-item-label">🌾 &nbsp;Farmer Login</span>
                </button>

                <button
                  className="dropdown-item dropdown-item--auth"
                  style={{ animationDelay: `${(NAV_ITEMS.length + 1) * 45}ms` }}
                  onClick={() => handleNavClick('/admin/login')}
                >
                  <span className="dropdown-item-dot" style={{ background: 'rgba(201,168,76,0.5)' }} />
                  <span className="dropdown-item-label">◆ &nbsp;Admin Login</span>
                </button>

                <div className="dropdown-divider" />

                <button
                  className="dropdown-item dropdown-item--logout"
                  style={{ animationDelay: `${(NAV_ITEMS.length + 2) * 45}ms` }}
                  onClick={handleLogout}
                >
                  <span className="dropdown-item-dot logout-dot" aria-hidden="true" />
                  <span className="dropdown-item-label">Logout</span>
                  <span className="logout-arrow" aria-hidden="true">→</span>
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </nav>
  );
};

export default NavBar;
