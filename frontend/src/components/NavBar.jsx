import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../css/NavBar.css';
import logo from '../assets/logos/app.png';

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: '⬡' },
  { label: 'Inventory',  path: '/inventory',  icon: '⬡' },
  { label: 'Sales',      path: '/sales',      icon: '⬡' },
  { label: 'Reports',    path: '/reports',    icon: '⬡' },
  { label: 'About',      path: '/about',      icon: '⬡' },
  { label: 'Settings',   path: '/settings',   icon: '⬡' },
];

const NavBar = ({ scrolled = false }) => {
  const [isOpen, setIsOpen]     = useState(false);
  const [animating, setAnimating] = useState(false);
  const navigate  = useNavigate();
  const location  = useLocation();
  const menuRef   = useRef(null);

  const openMenu = () => { setAnimating(true); setIsOpen(true); };
  const closeMenu = () => {
    setAnimating(false);
    setTimeout(() => setIsOpen(false), 320);
  };
  const toggleMenu = () => (isOpen ? closeMenu() : openMenu());

  const handleNavClick = (path) => {
    closeMenu();
    setTimeout(() => navigate(path), 160);
  };

  const handleLogout = () => {
    closeMenu();
    setTimeout(() => navigate('/logout'), 160);
  };

  /* Close on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) closeMenu();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  /* Close on route change */
  useEffect(() => { closeMenu(); }, [location.pathname]);

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

        {/* ── DESKTOP LINKS (optional: show on wide screens) ── */}
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

        {/* ── HAMBURGER + DROPDOWN ── */}
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

              <div className="dropdown-divider" />

              <button
                className="dropdown-item dropdown-item--logout"
                style={{ animationDelay: `${NAV_ITEMS.length * 45}ms` }}
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
    </nav>
  );
};

export default NavBar;
