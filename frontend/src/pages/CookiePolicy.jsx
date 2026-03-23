import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "../css/Legal.css";

const SECTIONS = [
  { id: "overview", title: "What Are Cookies?" },
  { id: "usage", title: "How We Use Cookies" },
  { id: "types", title: "Types of Cookies We Use" },
  { id: "third-party", title: "Third-Party Cookies" },
  { id: "management", title: "Managing Cookies" },
  { id: "local", title: "Local Storage & Session Data" },
  { id: "updates", title: "Policy Updates" },
  { id: "contact", title: "Contact Us" },
];

const COOKIE_TABLE = [
  {
    name: "__session",
    provider: "POLTRIFARM",
    category: "Strictly Necessary",
    purpose:
      "Maintains your authenticated session after login. Without this cookie the platform cannot identify you between page loads.",
    duration: "Session (deleted on browser close)",
    canOptOut: false,
  },
  {
    name: "firebase-auth-token",
    provider: "Google Firebase",
    category: "Strictly Necessary",
    purpose:
      "Stores your Firebase authentication token, allowing secure, persistent login without re-entering your password on each visit.",
    duration: "14 days (refreshed on activity)",
    canOptOut: false,
  },
  {
    name: "__Secure-1PSID",
    provider: "Google Firebase",
    category: "Strictly Necessary",
    purpose:
      "Firebase Authentication security cookie to prevent cross-site request forgery (CSRF) attacks.",
    duration: "Session",
    canOptOut: false,
  },
  {
    name: "pf_preferences",
    provider: "POLTRIFARM",
    category: "Functional",
    purpose:
      "Stores your UI preferences such as sidebar state (expanded or collapsed) and selected dashboard tab.",
    duration: "30 days",
    canOptOut: true,
  },
  {
    name: "pf_cookie_consent",
    provider: "POLTRIFARM",
    category: "Functional",
    purpose:
      "Records your cookie consent decision so we do not show the consent banner on every visit.",
    duration: "1 year",
    canOptOut: false,
  },
  {
    name: "_ga",
    provider: "Google Analytics (if enabled)",
    category: "Analytics",
    purpose:
      "Distinguishes unique users by assigning a randomly generated number as a client identifier. Used to calculate session, visit, and campaign data for analytics.",
    duration: "2 years",
    canOptOut: true,
  },
  {
    name: "_ga_[ID]",
    provider: "Google Analytics (if enabled)",
    category: "Analytics",
    purpose: "Maintains session state across page requests.",
    duration: "2 years",
    canOptOut: true,
  },
];

export default function CookiePolicy() {
  const cursorDot = useRef(null);
  const cursorRing = useRef(null);
  const mouse = useRef({ x: -200, y: -200 });
  const pos = useRef({ x: -200, y: -200 });
  const [activeId, setActiveId] = useState("overview");
  const [consentState, setConsentState] = useState({
    analytics: true,
    functional: true,
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const move = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };
    window.addEventListener("mousemove", move);
    let raf;
    const loop = () => {
      pos.current.x += (mouse.current.x - pos.current.x) * 0.1;
      pos.current.y += (mouse.current.y - pos.current.y) * 0.1;
      if (cursorDot.current)
        cursorDot.current.style.transform = `translate(${
          mouse.current.x - 5
        }px,${mouse.current.y - 5}px)`;
      if (cursorRing.current)
        cursorRing.current.style.transform = `translate(${
          pos.current.x - 18
        }px,${pos.current.y - 18}px)`;
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const handler = () => {
      for (const s of [...SECTIONS].reverse()) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveId(s.id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const expand = () => cursorRing.current?.classList.add("active");
  const shrink = () => cursorRing.current?.classList.remove("active");

  const handleSavePreferences = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const categoryColor = (cat) => {
    if (cat === "Strictly Necessary") return "var(--success)";
    if (cat === "Functional") return "var(--gold)";
    if (cat === "Analytics") return "var(--info, #2980B9)";
    return "var(--muted)";
  };

  return (
    <div className="legal-page">
      <div className="cursor-dot" ref={cursorDot} />
      <div className="cursor-ring" ref={cursorRing} />

      <header className="legal-hero">
        <div className="legal-hero-inner">
          <div className="legal-hero-eyebrow">Legal Documentation</div>
          <h1 className="legal-hero-title">
            Cookie <em>Policy</em>
          </h1>
          <div className="legal-hero-meta">
            <span>📅 Last updated: 23 March 2026</span>
            <span className="sep" />
            <span>🍪 Cookies used: 7 types</span>
            <span className="sep" />
            <span>🏢 POLTRIFARM Management System</span>
          </div>
        </div>
      </header>

      <div className="legal-body">
        <aside className="legal-toc">
          <div className="legal-toc-title">Contents</div>
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={`toc-item ${activeId === s.id ? "toc-active" : ""}`}
              onMouseEnter={expand}
              onMouseLeave={shrink}
            >
              {s.title}
            </a>
          ))}
        </aside>

        <main className="legal-content">
          <div className="legal-section" id="overview">
            <div className="legal-section-title">
              <span className="section-num">01</span>What Are Cookies?
            </div>
            <p>
              Cookies are small text files that are placed on your device
              (computer, tablet, or mobile phone) when you visit a website or
              use a web application. They are widely used to make websites and
              applications work efficiently, to remember your preferences, and
              to provide information to the operators of the site.
            </p>
            <p>
              Cookies themselves do not contain personally identifiable
              information, but the information they store can be combined with
              other data we hold about you to identify you as a user of
              POLTRIFARM.
            </p>
            <p>
              In addition to traditional browser cookies, POLTRIFARM uses
              related technologies such as <strong>localStorage</strong> and{" "}
              <strong>sessionStorage</strong> to maintain application state on
              your device. These function similarly to cookies and are covered
              by this policy.
            </p>
            <div className="legal-highlight">
              <strong>Short version:</strong> We use cookies to keep you logged
              in, remember your preferences, and understand how you use the
              platform. We do not use cookies for advertising.
            </div>
          </div>

          <div className="legal-section" id="usage">
            <div className="legal-section-title">
              <span className="section-num">02</span>How We Use Cookies
            </div>
            <p>POLTRIFARM uses cookies for the following purposes:</p>
            <ul className="legal-list">
              <li>
                <strong>Authentication:</strong> To maintain your logged-in
                session so you do not need to sign in on every page visit. This
                is the primary use of cookies on POLTRIFARM and is essential for
                the platform to function.
              </li>
              <li>
                <strong>Security:</strong> To protect against cross-site request
                forgery (CSRF) attacks and other security threats.
              </li>
              <li>
                <strong>Preferences:</strong> To remember your UI settings, such
                as whether the sidebar is expanded or collapsed, so your
                preferred layout is restored on your next visit.
              </li>
              <li>
                <strong>Consent management:</strong> To record your cookie
                preferences so we do not display the consent banner on every
                visit.
              </li>
              <li>
                <strong>Analytics (optional):</strong> If analytics features are
                enabled, to understand aggregate patterns in how users interact
                with the platform so we can improve it. Analytics cookies
                collect anonymous data only.
              </li>
            </ul>
            <p>
              POLTRIFARM does not use cookies for advertising, remarketing, or
              tracking you across other websites.
            </p>
          </div>

          <div className="legal-section" id="types">
            <div className="legal-section-title">
              <span className="section-num">03</span>Types of Cookies We Use
            </div>
            <p>
              The table below lists all cookies currently set by POLTRIFARM,
              their purpose, duration, and whether you can opt out of them.
            </p>

            {/* Cookie table */}
            <div style={{ overflowX: "auto", marginTop: "1rem" }}>
              <table className="legal-table">
                <thead>
                  <tr>
                    <th>Cookie Name</th>
                    <th>Provider</th>
                    <th>Category</th>
                    <th>Purpose</th>
                    <th>Duration</th>
                    <th>Opt-Out</th>
                  </tr>
                </thead>
                <tbody>
                  {COOKIE_TABLE.map((c) => (
                    <tr key={c.name}>
                      <td>
                        <code
                          style={{
                            fontFamily: "monospace",
                            fontSize: ".78rem",
                            color: "var(--gold-light)",
                          }}
                        >
                          {c.name}
                        </code>
                      </td>
                      <td style={{ fontSize: ".78rem" }}>{c.provider}</td>
                      <td>
                        <span
                          style={{
                            fontSize: ".62rem",
                            fontWeight: 600,
                            letterSpacing: ".08em",
                            color: categoryColor(c.category),
                            textTransform: "uppercase",
                          }}
                        >
                          {c.category}
                        </span>
                      </td>
                      <td style={{ fontSize: ".8rem", maxWidth: "220px" }}>
                        {c.purpose}
                      </td>
                      <td style={{ fontSize: ".78rem", whiteSpace: "nowrap" }}>
                        {c.duration}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {c.canOptOut ? (
                          <span
                            style={{ color: "var(--gold)", fontSize: ".8rem" }}
                          >
                            ✓ Yes
                          </span>
                        ) : (
                          <span
                            style={{ color: "var(--muted)", fontSize: ".8rem" }}
                          >
                            ✗ Required
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="legal-sub" style={{ marginTop: "1.5rem" }}>
              Cookie Categories Explained
            </div>
            <ul className="legal-list">
              <li>
                <strong style={{ color: "var(--success)" }}>
                  Strictly Necessary:
                </strong>{" "}
                These cookies are essential for the platform to function. They
                cannot be disabled without breaking core functionality such as
                authentication.
              </li>
              <li>
                <strong style={{ color: "var(--gold)" }}>Functional:</strong>{" "}
                These cookies enhance your experience by remembering
                preferences. They are not strictly required but improve
                usability.
              </li>
              <li>
                <strong style={{ color: "#2980B9" }}>Analytics:</strong> These
                cookies collect anonymous information about how the platform is
                used. They help us improve the user experience. You can opt out
                of these.
              </li>
            </ul>
          </div>

          <div className="legal-section" id="third-party">
            <div className="legal-section-title">
              <span className="section-num">04</span>Third-Party Cookies
            </div>
            <p>
              POLTRIFARM uses Google Firebase as its backend infrastructure. As
              a result, Google may set certain cookies on your device in
              connection with Firebase Authentication. These cookies are
              governed by{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noreferrer"
              >
                Google's Privacy Policy
              </a>
              .
            </p>
            <p>
              We do not use any advertising networks, social media plugins, or
              third-party marketing trackers that would set cookies on your
              device. The only third-party cookies present on POLTRIFARM are
              those set by Google Firebase as part of authentication.
            </p>
            <div className="legal-info">
              <strong>No advertising cookies.</strong> POLTRIFARM does not
              display advertisements and does not use cookies for advertising,
              retargeting, or tracking across other websites.
            </div>
          </div>

          <div className="legal-section" id="management">
            <div className="legal-section-title">
              <span className="section-num">05</span>Managing Cookies
            </div>

            {/* Interactive preference panel */}
            <div
              style={{
                background: "var(--navy-mid)",
                border: "1px solid var(--border)",
                borderTop: "3px solid var(--gold)",
                padding: "1.5rem",
                marginBottom: "1.5rem",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-d)",
                  fontSize: "1.1rem",
                  marginBottom: "1rem",
                  color: "var(--white)",
                }}
              >
                Your Cookie Preferences
              </div>

              {[
                {
                  key: null,
                  label: "Strictly Necessary Cookies",
                  desc: "Required for authentication and security. Cannot be disabled.",
                  color: "var(--success)",
                  locked: true,
                  value: true,
                },
                {
                  key: "functional",
                  label: "Functional Cookies",
                  desc: "Remember your UI preferences and settings between visits.",
                  color: "var(--gold)",
                  locked: false,
                  value: consentState.functional,
                },
                {
                  key: "analytics",
                  label: "Analytics Cookies",
                  desc: "Anonymous usage data to help us improve the platform.",
                  color: "#2980B9",
                  locked: false,
                  value: consentState.analytics,
                },
              ].map((pref) => (
                <div
                  key={pref.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.85rem 0",
                    borderBottom: "1px solid rgba(201,168,76,0.06)",
                    gap: "1rem",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: ".85rem",
                        fontWeight: 500,
                        color: "var(--white)",
                        marginBottom: ".2rem",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: pref.color,
                          marginRight: ".5rem",
                        }}
                      />
                      {pref.label}
                    </div>
                    <div
                      style={{
                        fontSize: ".75rem",
                        color: "var(--muted)",
                        paddingLeft: "1rem",
                      }}
                    >
                      {pref.desc}
                    </div>
                  </div>
                  <div>
                    {pref.locked ? (
                      <span
                        style={{
                          fontSize: ".72rem",
                          color: "var(--muted)",
                          letterSpacing: ".05em",
                        }}
                      >
                        Always on
                      </span>
                    ) : (
                      <button
                        onClick={() =>
                          setConsentState((s) => ({
                            ...s,
                            [pref.key]: !s[pref.key],
                          }))
                        }
                        onMouseEnter={expand}
                        onMouseLeave={shrink}
                        style={{
                          width: 48,
                          height: 26,
                          borderRadius: 13,
                          border: "none",
                          cursor: "none",
                          background: pref.value
                            ? "var(--gold)"
                            : "rgba(138,155,181,0.2)",
                          position: "relative",
                          transition: "background 0.25s",
                          flexShrink: 0,
                        }}
                        aria-label={`${pref.value ? "Disable" : "Enable"} ${
                          pref.label
                        }`}
                      >
                        <span
                          style={{
                            position: "absolute",
                            top: 3,
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            background: "var(--white)",
                            left: pref.value ? 24 : 4,
                            transition: "left 0.25s",
                          }}
                        />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              <div
                style={{
                  marginTop: "1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <button
                  onClick={handleSavePreferences}
                  onMouseEnter={expand}
                  onMouseLeave={shrink}
                  style={{
                    padding: ".55rem 1.4rem",
                    background: "var(--gold)",
                    color: "var(--navy)",
                    border: "none",
                    cursor: "none",
                    fontFamily: "var(--font-b)",
                    fontSize: ".72rem",
                    fontWeight: 500,
                    letterSpacing: ".15em",
                    textTransform: "uppercase",
                    transition: "background 0.2s",
                  }}
                >
                  Save Preferences
                </button>
                {saved && (
                  <span
                    style={{
                      fontSize: ".78rem",
                      color: "var(--success)",
                      animation: "fadeUp 0.3s ease",
                    }}
                  >
                    ✓ Preferences saved
                  </span>
                )}
              </div>
            </div>

            <div className="legal-sub">Managing via Your Browser</div>
            <p>
              You can also control cookies through your browser settings. Most
              browsers allow you to view, block, or delete cookies. Note that
              blocking strictly necessary cookies will prevent you from using
              POLTRIFARM.
            </p>
            <table className="legal-table">
              <thead>
                <tr>
                  <th>Browser</th>
                  <th>Cookie Settings Location</th>
                </tr>
              </thead>
              <tbody>
                {[
                  [
                    "Google Chrome",
                    "Settings → Privacy and Security → Cookies and other site data",
                  ],
                  [
                    "Mozilla Firefox",
                    "Settings → Privacy & Security → Cookies and Site Data",
                  ],
                  ["Safari", "Preferences → Privacy → Manage Website Data"],
                  [
                    "Microsoft Edge",
                    "Settings → Cookies and site permissions → Manage and delete cookies",
                  ],
                  [
                    "Opera",
                    "Settings → Advanced → Privacy & security → Site settings → Cookies",
                  ],
                ].map(([browser, path]) => (
                  <tr key={browser}>
                    <td>
                      <strong>{browser}</strong>
                    </td>
                    <td style={{ fontSize: ".78rem" }}>{path}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="legal-section" id="local">
            <div className="legal-section-title">
              <span className="section-num">06</span>Local Storage & Session
              Data
            </div>
            <p>
              In addition to cookies, POLTRIFARM uses your browser's{" "}
              <strong>localStorage</strong> and <strong>sessionStorage</strong>{" "}
              to store certain application state data locally on your device.
              This includes:
            </p>
            <ul className="legal-list">
              <li>
                <strong>Offline data cache (localStorage):</strong> Sensor
                readings, flock summaries, and financial snapshots are cached
                locally to support offline functionality. This data is
                synchronised with our servers when connectivity is restored.
              </li>
              <li>
                <strong>Session state (sessionStorage):</strong> Temporary UI
                state such as which modal is open or which tab is active. This
                is cleared automatically when you close the browser tab.
              </li>
              <li>
                <strong>Authentication tokens (localStorage):</strong> Firebase
                Authentication tokens are stored in localStorage to maintain
                your session. These expire after 14 days of inactivity and are
                cleared when you sign out.
              </li>
            </ul>
            <p>
              Unlike cookies, localStorage and sessionStorage data is not
              transmitted to servers on every request and is not accessible to
              third parties. You can clear this data through your browser's
              developer tools or by clearing site data in your browser settings.
            </p>
          </div>

          <div className="legal-section" id="updates">
            <div className="legal-section-title">
              <span className="section-num">07</span>Policy Updates
            </div>
            <p>
              We may update this Cookie Policy when we add new features, change
              third-party services, or in response to changes in applicable law.
              When we make changes, we will update the "Last updated" date at
              the top of this page.
            </p>
            <p>
              Significant changes — such as the introduction of new cookie
              categories — will be communicated through a notification on the
              platform and by email to registered users.
            </p>
          </div>

          <div className="legal-section" id="contact">
            <div className="legal-section-title">
              <span className="section-num">08</span>Contact Us
            </div>
            <p>
              If you have questions about our use of cookies or this Cookie
              Policy, please contact us:
            </p>
            <div className="legal-contact-block">
              <h4>POLTRIFARM — Cookie & Privacy</h4>
              <p>
                📧{" "}
                <a href="mailto:privacy@poltrifarm.com">
                  privacy@poltrifarm.com
                </a>
              </p>
              <p>
                📧 General:{" "}
                <a href="mailto:hello@poltrifarm.com">hello@poltrifarm.com</a>
              </p>
              <p>🏢 Dedan Kimathi University of Technology, Nyeri, Kenya</p>
            </div>
            <div style={{ marginTop: "1.5rem" }}>
              <p style={{ fontSize: ".82rem", color: "var(--muted)" }}>
                Related documents:&nbsp;
                <Link
                  to="/privacy"
                  onMouseEnter={expand}
                  onMouseLeave={shrink}
                  style={{ color: "var(--gold)", textDecoration: "none" }}
                >
                  Privacy Policy
                </Link>
                &nbsp;·&nbsp;
                <Link
                  to="/terms"
                  onMouseEnter={expand}
                  onMouseLeave={shrink}
                  style={{ color: "var(--gold)", textDecoration: "none" }}
                >
                  Terms of Service
                </Link>
              </p>
            </div>
          </div>
        </main>
      </div>

      <footer className="legal-footer">
        <div className="legal-footer-brand">
          <span className="gold">POLTRI</span>
          <span style={{ color: "var(--white)" }}>FARM</span>
        </div>
        <div className="legal-footer-links">
          <Link to="/privacy" onMouseEnter={expand} onMouseLeave={shrink}>
            Privacy Policy
          </Link>
          <Link to="/terms" onMouseEnter={expand} onMouseLeave={shrink}>
            Terms of Service
          </Link>
          <Link
            to="/cookies"
            className="current"
            onMouseEnter={expand}
            onMouseLeave={shrink}
          >
            Cookie Policy
          </Link>
          <Link to="/" onMouseEnter={expand} onMouseLeave={shrink}>
            Homepage
          </Link>
        </div>
        <div className="legal-footer-copy">
          © {new Date().getFullYear()} POLTRIFARM Management System
        </div>
      </footer>
    </div>
  );
}
