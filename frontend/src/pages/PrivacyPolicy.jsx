import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "../css/Legal.css";

const SECTIONS = [
  { id: "overview", title: "Overview" },
  { id: "collection", title: "Information We Collect" },
  { id: "iot", title: "IoT & Sensor Data" },
  { id: "use", title: "How We Use Your Data" },
  { id: "sharing", title: "Data Sharing" },
  { id: "storage", title: "Data Storage & Security" },
  { id: "retention", title: "Data Retention" },
  { id: "rights", title: "Your Rights" },
  { id: "cookies", title: "Cookies" },
  { id: "children", title: "Children's Privacy" },
  { id: "changes", title: "Policy Changes" },
  { id: "contact", title: "Contact Us" },
];

export default function PrivacyPolicy() {
  const cursorDot = useRef(null);
  const cursorRing = useRef(null);
  const mouse = useRef({ x: -200, y: -200 });
  const pos = useRef({ x: -200, y: -200 });
  const [activeId, setActiveId] = useState("overview");

  /* Cursor */
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

  /* Active section on scroll */
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

  return (
    <div className="legal-page">
      <div className="cursor-dot" ref={cursorDot} />
      <div className="cursor-ring" ref={cursorRing} />

      {/* Hero */}
      <header className="legal-hero">
        <div className="legal-hero-inner">
          <div className="legal-hero-eyebrow">Legal Documentation</div>
          <h1 className="legal-hero-title">
            Privacy <em>Policy</em>
          </h1>
          <div className="legal-hero-meta">
            <span>📅 Last updated: 23 March 2026</span>
            <span className="sep" />
            <span>🏢 POLTRIFARM Management System</span>
            <span className="sep" />
            <span>📍 Dedan Kimathi University of Technology, Kenya</span>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="legal-body">
        {/* TOC */}
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

        {/* Content */}
        <main className="legal-content">
          <div className="legal-section" id="overview">
            <div className="legal-section-title">
              <span className="section-num">01</span>Overview
            </div>
            <div className="legal-highlight">
              <strong>Your privacy matters to us.</strong> This Privacy Policy
              explains how POLTRIFARM Management System collects, uses, stores,
              and protects your personal information when you use our platform,
              including our web application, mobile application, and IoT sensor
              network.
            </div>
            <p>
              POLTRIFARM is a poultry farm management system developed as an
              academic project at Dedan Kimathi University of Technology, Kenya.
              By registering for and using POLTRIFARM, you acknowledge that you
              have read and understood this Privacy Policy and consent to the
              practices described herein.
            </p>
            <p>
              This policy applies to all users of the POLTRIFARM platform,
              including farmers, farm administrators, and system administrators.
              It covers all data collected through our web interface, mobile
              application, and sensor devices deployed on your farm.
            </p>
          </div>

          <div className="legal-section" id="collection">
            <div className="legal-section-title">
              <span className="section-num">02</span>Information We Collect
            </div>
            <p>
              We collect information in three ways: information you provide
              directly, information collected automatically through your use of
              the platform, and data transmitted from IoT sensors deployed at
              your farm.
            </p>
            <div className="legal-sub">Information You Provide</div>
            <ul className="legal-list">
              <li>
                <strong>Account registration data:</strong> Your full name,
                email address, password (stored as a cryptographic hash), farm
                name, and account role (farmer or administrator).
              </li>
              <li>
                <strong>Farm records:</strong> Flock batch names and details,
                bird counts, production types, shed assignments, and health
                status records you enter into the system.
              </li>
              <li>
                <strong>Financial data:</strong> Transaction records including
                income entries (egg sales, bird sales) and expense entries
                (feed, veterinary costs, utilities) that you log manually.
              </li>
              <li>
                <strong>Health scan submissions:</strong> Photographs of poultry
                you upload for AI-assisted health analysis. These images are
                processed and stored temporarily for analysis purposes.
              </li>
              <li>
                <strong>Communications:</strong> Messages, feedback, or support
                requests you submit to us.
              </li>
            </ul>
            <div className="legal-sub">Information Collected Automatically</div>
            <ul className="legal-list">
              <li>
                <strong>Usage data:</strong> Pages visited, features used,
                session duration, and actions taken within the platform.
              </li>
              <li>
                <strong>Device information:</strong> Browser type, operating
                system, IP address, and device identifiers.
              </li>
              <li>
                <strong>Authentication logs:</strong> Login timestamps, IP
                addresses used for sign-in, and failed authentication attempts.
              </li>
            </ul>
          </div>

          <div className="legal-section" id="iot">
            <div className="legal-section-title">
              <span className="section-num">03</span>IoT & Sensor Data
            </div>
            <p>
              POLTRIFARM integrates with IoT sensors deployed within your
              poultry farm environment. This represents a distinct category of
              data collection with specific implications for your privacy.
            </p>
            <div className="legal-warning">
              <strong>Important:</strong> Sensor data is collected continuously
              and automatically from devices physically installed at your farm.
              By installing and connecting POLTRIFARM sensors, you consent to
              this continuous data collection.
            </div>
            <p>
              The following sensor data types are collected and transmitted to
              our cloud servers:
            </p>
            <table className="legal-table">
              <thead>
                <tr>
                  <th>Sensor Type</th>
                  <th>Data Collected</th>
                  <th>Collection Frequency</th>
                </tr>
              </thead>
              <tbody>
                {[
                  [
                    "Temperature & Humidity",
                    "Ambient temperature (°C) and relative humidity (%)",
                    "Every 30 seconds",
                  ],
                  [
                    "Water Level",
                    "Trough water level as a percentage of capacity",
                    "Every 60 seconds",
                  ],
                  [
                    "Water Turbidity",
                    "Water clarity reading in NTU units",
                    "Every 5 minutes",
                  ],
                  [
                    "Feed Weight",
                    "Feed trough weight in kilograms",
                    "Every 60 seconds",
                  ],
                  [
                    "Egg Counter",
                    "Daily egg count increments via IR beam detection",
                    "On each detection event",
                  ],
                  [
                    "Ammonia (NH₃)",
                    "Shed ammonia concentration in parts per million (ppm)",
                    "Every 2 minutes",
                  ],
                ].map(([type, data, freq]) => (
                  <tr key={type}>
                    <td>
                      <strong>{type}</strong>
                    </td>
                    <td>{data}</td>
                    <td>{freq}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p>
              All sensor data is tagged with your unique user ID and a
              timestamp. This data is transmitted over an encrypted connection
              (TLS 1.3) from the sensor gateway to our cloud backend. Sensor
              data is stored in a time-series database and retained as described
              in the Data Retention section.
            </p>
          </div>

          <div className="legal-section" id="use">
            <div className="legal-section-title">
              <span className="section-num">04</span>How We Use Your Data
            </div>
            <p>
              We use the information we collect exclusively to provide, improve,
              and support the POLTRIFARM platform. We do not sell your data.
            </p>
            <ul className="legal-list">
              <li>
                <strong>Service delivery:</strong> To operate the platform,
                display your farm data on the dashboard, generate alerts and
                notifications, and provide AI-assisted health analysis.
              </li>
              <li>
                <strong>Decision support:</strong> To analyse your sensor data
                and farm records in order to generate contextual
                recommendations, anomaly alerts, and production trend insights.
              </li>
              <li>
                <strong>Authentication and security:</strong> To verify your
                identity, detect and prevent unauthorised access, and maintain
                audit logs.
              </li>
              <li>
                <strong>Reminders and notifications:</strong> To send
                vaccination reminders, sanitation alerts, and low-stock warnings
                to your registered email or mobile device.
              </li>
              <li>
                <strong>Platform improvement:</strong> Aggregated and anonymised
                usage data may be used to improve the platform's features and
                user experience.
              </li>
              <li>
                <strong>Academic research:</strong> As this is an academic
                project, anonymised and aggregated data may be used for research
                purposes relating to small-scale poultry farm management.
              </li>
              <li>
                <strong>Legal compliance:</strong> To comply with applicable
                laws and respond to lawful requests from authorities where
                required.
              </li>
            </ul>
          </div>

          <div className="legal-section" id="sharing">
            <div className="legal-section-title">
              <span className="section-num">05</span>Data Sharing
            </div>
            <p>
              We do not sell, rent, or trade your personal information to third
              parties for marketing purposes. Data sharing is limited to the
              following circumstances:
            </p>
            <ul className="legal-list">
              <li>
                <strong>Firebase / Google Cloud Platform:</strong> Our platform
                is hosted on Google Firebase infrastructure. Your data is stored
                on Firebase Authentication and Cloud Firestore, which are
                subject to Google's data processing terms.
              </li>
              <li>
                <strong>System administrators:</strong> POLTRIFARM system
                administrators can view account details, farm performance
                metrics, and sensor status across all registered farms for
                platform management purposes. They cannot view individual
                financial transaction details or uploaded health scan images.
              </li>
              <li>
                <strong>Academic supervisors:</strong> Anonymised, aggregated
                farm performance data may be shared with academic supervisors at
                Dedan Kimathi University of Technology as part of the project
                evaluation process.
              </li>
              <li>
                <strong>Legal requirements:</strong> We may disclose your data
                if required by law, court order, or governmental authority.
              </li>
            </ul>
            <div className="legal-highlight">
              <strong>Your farm data is yours.</strong> Individual farm records,
              financial data, and sensor readings are only accessible to you and
              platform administrators performing system maintenance. No other
              farmer can access your data.
            </div>
          </div>

          <div className="legal-section" id="storage">
            <div className="legal-section-title">
              <span className="section-num">06</span>Data Storage & Security
            </div>
            <p>
              All POLTRIFARM data is stored on Google Firebase infrastructure
              hosted in the <strong>europe-west1 (Belgium)</strong> region. We
              implement the following security measures:
            </p>
            <ul className="legal-list">
              <li>
                <strong>Encryption in transit:</strong> All data transmitted
                between your browser, mobile app, sensor gateways, and our
                servers is encrypted using TLS 1.3.
              </li>
              <li>
                <strong>Encryption at rest:</strong> Firebase Firestore encrypts
                all stored data at rest using AES-256 encryption.
              </li>
              <li>
                <strong>Authentication:</strong> Passwords are never stored in
                plain text. Firebase Authentication uses industry-standard
                cryptographic hashing.
              </li>
              <li>
                <strong>Access controls:</strong> Firestore Security Rules
                ensure that users can only access their own data. Administrator
                access is role-gated and logged.
              </li>
              <li>
                <strong>Sensor data transmission:</strong> Sensor gateways
                transmit data using MQTT over TLS to prevent interception.
              </li>
            </ul>
            <p>
              While we implement strong security measures, no system is entirely
              immune to security breaches. We encourage you to use a strong,
              unique password and to notify us immediately if you suspect
              unauthorised access to your account at{" "}
              <a href="mailto:security@poltrifarm.com">
                security@poltrifarm.com
              </a>
              .
            </p>
          </div>

          <div className="legal-section" id="retention">
            <div className="legal-section-title">
              <span className="section-num">07</span>Data Retention
            </div>
            <p>We retain your data for the following periods:</p>
            <table className="legal-table">
              <thead>
                <tr>
                  <th>Data Type</th>
                  <th>Retention Period</th>
                  <th>Reason</th>
                </tr>
              </thead>
              <tbody>
                {[
                  [
                    "Account & profile data",
                    "Duration of account + 90 days",
                    "Account management and recovery",
                  ],
                  [
                    "Flock & production records",
                    "Duration of account + 1 year",
                    "Historical production analysis",
                  ],
                  [
                    "Sensor readings",
                    "2 years from collection",
                    "Long-term trend analysis",
                  ],
                  [
                    "Financial transaction records",
                    "5 years",
                    "Financial record-keeping requirements",
                  ],
                  [
                    "Health scan images",
                    "30 days after analysis",
                    "Temporary processing storage",
                  ],
                  [
                    "Authentication logs",
                    "12 months",
                    "Security audit requirements",
                  ],
                  [
                    "Anonymised aggregated data",
                    "Indefinitely",
                    "Research and platform improvement",
                  ],
                ].map(([type, period, reason]) => (
                  <tr key={type}>
                    <td>
                      <strong>{type}</strong>
                    </td>
                    <td>{period}</td>
                    <td>{reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p>
              Upon account deletion, your personal data will be deleted within
              90 days, with the exception of anonymised aggregated data and
              financial records which may be retained as described above.
            </p>
          </div>

          <div className="legal-section" id="rights">
            <div className="legal-section-title">
              <span className="section-num">08</span>Your Rights
            </div>
            <p>
              Depending on your jurisdiction, you may have the following rights
              regarding your personal data:
            </p>
            <ul className="legal-list">
              <li>
                <strong>Right of access:</strong> You may request a copy of all
                personal data we hold about you.
              </li>
              <li>
                <strong>Right to rectification:</strong> You may correct
                inaccurate or incomplete personal data via your account settings
                or by contacting us.
              </li>
              <li>
                <strong>Right to erasure:</strong> You may request deletion of
                your account and associated personal data.
              </li>
              <li>
                <strong>Right to data portability:</strong> You may request your
                farm records and financial data in a machine-readable format
                (JSON or CSV).
              </li>
              <li>
                <strong>Right to restrict processing:</strong> You may request
                that we limit the processing of your data in certain
                circumstances.
              </li>
              <li>
                <strong>Right to object:</strong> You may object to the use of
                your data for research or analytics purposes.
              </li>
            </ul>
            <p>
              To exercise any of these rights, contact us at{" "}
              <a href="mailto:privacy@poltrifarm.com">privacy@poltrifarm.com</a>
              . We will respond within 30 days.
            </p>
          </div>

          <div className="legal-section" id="cookies">
            <div className="legal-section-title">
              <span className="section-num">09</span>Cookies
            </div>
            <p>
              POLTRIFARM uses cookies and similar technologies to maintain your
              session and improve your experience. For full details on the
              cookies we use, please refer to our{" "}
              <Link to="/cookies" onMouseEnter={expand} onMouseLeave={shrink}>
                Cookie Policy
              </Link>
              .
            </p>
            <p>
              Strictly necessary cookies (authentication session tokens) cannot
              be disabled as they are required for the platform to function. You
              may manage optional analytics cookies through your browser
              settings.
            </p>
          </div>

          <div className="legal-section" id="children">
            <div className="legal-section-title">
              <span className="section-num">10</span>Children's Privacy
            </div>
            <p>
              POLTRIFARM is intended for use by adults managing poultry farming
              operations. We do not knowingly collect personal information from
              individuals under the age of 18. If we become aware that a person
              under 18 has registered an account, we will promptly delete that
              account and associated data.
            </p>
            <p>
              If you believe a minor has provided us with personal information,
              please contact us at{" "}
              <a href="mailto:privacy@poltrifarm.com">privacy@poltrifarm.com</a>
              .
            </p>
          </div>

          <div className="legal-section" id="changes">
            <div className="legal-section-title">
              <span className="section-num">11</span>Policy Changes
            </div>
            <p>
              We may update this Privacy Policy from time to time to reflect
              changes in our practices, legal requirements, or platform
              features. When we make significant changes, we will:
            </p>
            <ul className="legal-list">
              <li>Update the "Last updated" date at the top of this page.</li>
              <li>Send a notification to your registered email address.</li>
              <li>
                Display a prominent notice on the platform dashboard for 30 days
                following the change.
              </li>
            </ul>
            <p>
              Your continued use of POLTRIFARM after a policy change constitutes
              your acceptance of the updated policy. If you do not agree with
              the changes, you may delete your account.
            </p>
          </div>

          <div className="legal-section" id="contact">
            <div className="legal-section-title">
              <span className="section-num">12</span>Contact Us
            </div>
            <p>
              If you have questions, concerns, or requests relating to this
              Privacy Policy or our data practices, please contact us:
            </p>
            <div className="legal-contact-block">
              <h4>POLTRIFARM — Data Privacy</h4>
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
              <p>⏰ Response time: within 30 days of receipt</p>
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="legal-footer">
        <div className="legal-footer-brand">
          <span className="gold">POLTRI</span>
          <span style={{ color: "var(--white)" }}>FARM</span>
        </div>
        <div className="legal-footer-links">
          <Link
            to="/privacy"
            className="current"
            onMouseEnter={expand}
            onMouseLeave={shrink}
          >
            Privacy Policy
          </Link>
          <Link to="/terms" onMouseEnter={expand} onMouseLeave={shrink}>
            Terms of Service
          </Link>
          <Link to="/cookies" onMouseEnter={expand} onMouseLeave={shrink}>
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
