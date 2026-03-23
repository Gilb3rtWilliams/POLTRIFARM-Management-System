import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "../css/Legal.css";

const SECTIONS = [
  { id: "overview", title: "Overview" },
  { id: "eligibility", title: "Eligibility & Registration" },
  { id: "platform", title: "Platform Description" },
  { id: "acceptable", title: "Acceptable Use" },
  { id: "prohibited", title: "Prohibited Conduct" },
  { id: "iot", title: "IoT Devices & Sensors" },
  { id: "ai", title: "AI Features & Limitations" },
  { id: "data", title: "Data Ownership" },
  { id: "accounts", title: "Account Management" },
  { id: "liability", title: "Limitation of Liability" },
  { id: "disclaimer", title: "Disclaimers" },
  { id: "termination", title: "Termination" },
  { id: "governing", title: "Governing Law" },
  { id: "contact", title: "Contact" },
];

export default function TermsOfService() {
  const cursorDot = useRef(null);
  const cursorRing = useRef(null);
  const mouse = useRef({ x: -200, y: -200 });
  const pos = useRef({ x: -200, y: -200 });
  const [activeId, setActiveId] = useState("overview");

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

  return (
    <div className="legal-page">
      <div className="cursor-dot" ref={cursorDot} />
      <div className="cursor-ring" ref={cursorRing} />

      <header className="legal-hero">
        <div className="legal-hero-inner">
          <div className="legal-hero-eyebrow">Legal Documentation</div>
          <h1 className="legal-hero-title">
            Terms of <em>Service</em>
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
              <span className="section-num">01</span>Overview
            </div>
            <div className="legal-highlight">
              <strong>Please read these Terms carefully.</strong> By registering
              for or using POLTRIFARM Management System, you agree to be bound
              by these Terms of Service. If you do not agree to these Terms, you
              may not access or use the platform.
            </div>
            <p>
              These Terms of Service ("Terms") constitute a legally binding
              agreement between you ("User") and POLTRIFARM Management System
              ("POLTRIFARM", "we", "us", or "our"), governing your access to and
              use of the POLTRIFARM web application, mobile application, IoT
              sensor network, and related services (collectively, the
              "Platform").
            </p>
            <p>
              These Terms were last updated on 23 March 2026. We reserve the
              right to update these Terms at any time, and we will notify you of
              significant changes as described in Section 13.
            </p>
          </div>

          <div className="legal-section" id="eligibility">
            <div className="legal-section-title">
              <span className="section-num">02</span>Eligibility & Registration
            </div>
            <div className="legal-sub">Eligibility</div>
            <p>
              To register for POLTRIFARM, you must be at least 18 years of age
              and have the legal capacity to enter into a binding agreement. By
              registering, you represent and warrant that you meet these
              requirements.
            </p>
            <div className="legal-sub">Account Registration</div>
            <p>When you register for an account, you agree to:</p>
            <ul className="legal-list">
              <li>
                Provide accurate, current, and complete information during
                registration.
              </li>
              <li>
                Maintain and promptly update your account information to keep it
                accurate.
              </li>
              <li>
                Keep your password confidential and not share it with any third
                party.
              </li>
              <li>
                Notify us immediately at{" "}
                <a href="mailto:security@poltrifarm.com">
                  security@poltrifarm.com
                </a>{" "}
                if you suspect any unauthorised use of your account.
              </li>
              <li>
                Be responsible for all activities that occur under your account.
              </li>
            </ul>
            <div className="legal-sub">Account Types</div>
            <p>
              POLTRIFARM offers two account types:{" "}
              <strong>Farmer accounts</strong> (approved automatically upon
              registration) and <strong>Administrator accounts</strong> (subject
              to manual review and approval by a super-administrator).
              Administrator accounts require a valid authorisation code and are
              subject to enhanced verification.
            </p>
          </div>

          <div className="legal-section" id="platform">
            <div className="legal-section-title">
              <span className="section-num">03</span>Platform Description
            </div>
            <p>
              POLTRIFARM is an intelligent, IoT-driven poultry farm management
              platform developed as an academic project at Dedan Kimathi
              University of Technology. The platform provides:
            </p>
            <ul className="legal-list">
              <li>
                <strong>Flock Management:</strong> Tools to record, track, and
                manage poultry batches including health monitoring, mortality
                tracking, and production records.
              </li>
              <li>
                <strong>Sensor Monitoring:</strong> Real-time display and
                alerting based on data from IoT sensors measuring temperature,
                humidity, water levels, feed weight, egg counts, and ammonia
                levels.
              </li>
              <li>
                <strong>AI Health Support:</strong> Image-based preliminary
                health guidance using machine learning models. This feature is a
                decision support aid, not a veterinary diagnostic tool.
              </li>
              <li>
                <strong>Financial Tracking:</strong> Income and expense
                recording, batch profitability analysis, and sale timing
                recommendations.
              </li>
              <li>
                <strong>Feed & Inventory Management:</strong> Stock tracking,
                consumption logging, and low-stock alerts.
              </li>
              <li>
                <strong>Vaccination & Reminder Scheduling:</strong> Automated
                reminders for vaccinations, sanitation, and other routine farm
                activities.
              </li>
              <li>
                <strong>Educational Resources:</strong> Curated links to poultry
                farming articles and best-practice guides.
              </li>
            </ul>
            <div className="legal-info">
              <strong>Academic Project Notice:</strong> POLTRIFARM is currently
              an academic project. Features, availability, and data retention
              policies may change as the project develops. The platform is
              provided on a best-effort basis.
            </div>
          </div>

          <div className="legal-section" id="acceptable">
            <div className="legal-section-title">
              <span className="section-num">04</span>Acceptable Use
            </div>
            <p>
              You agree to use POLTRIFARM only for its intended purpose: the
              management of poultry farming operations. Specifically, you agree
              to:
            </p>
            <ul className="legal-list">
              <li>
                Use the platform only in connection with legitimate poultry
                farming activities.
              </li>
              <li>Enter accurate and truthful data into the system.</li>
              <li>
                Use the AI Health Scan feature as a decision support aid only,
                and to always consult a qualified veterinarian for medical
                decisions affecting your birds.
              </li>
              <li>
                Comply with all applicable local, national, and international
                laws and regulations relating to poultry farming, animal
                welfare, and data protection.
              </li>
              <li>
                Maintain the physical security of any IoT sensor hardware
                provided or recommended by POLTRIFARM.
              </li>
              <li>
                Report any bugs, security vulnerabilities, or unexpected system
                behaviour to us promptly.
              </li>
            </ul>
          </div>

          <div className="legal-section" id="prohibited">
            <div className="legal-section-title">
              <span className="section-num">05</span>Prohibited Conduct
            </div>
            <p>You agree not to:</p>
            <ul className="legal-list">
              <li>
                Attempt to gain unauthorised access to any other user's account,
                data, or to any system or network connected to POLTRIFARM.
              </li>
              <li>
                Use automated tools, bots, or scrapers to extract data from the
                platform without prior written consent.
              </li>
              <li>
                Reverse engineer, decompile, or disassemble any part of the
                platform.
              </li>
              <li>
                Upload malicious code, viruses, or any content that could
                compromise the platform or its users.
              </li>
              <li>
                Misrepresent your identity or impersonate any other person or
                organisation.
              </li>
              <li>
                Use the AI Health Scan feature to make definitive veterinary
                diagnoses or as a substitute for professional veterinary care.
              </li>
              <li>
                Share your account credentials with others or allow multiple
                people to use a single account.
              </li>
              <li>
                Use the platform for any purpose that violates applicable animal
                welfare laws.
              </li>
              <li>
                Attempt to overwhelm or disrupt platform services through
                excessive requests or denial-of-service attacks.
              </li>
            </ul>
            <div className="legal-warning">
              Violation of these prohibitions may result in immediate account
              suspension or termination, and may be reported to relevant
              authorities where applicable.
            </div>
          </div>

          <div className="legal-section" id="iot">
            <div className="legal-section-title">
              <span className="section-num">06</span>IoT Devices & Sensors
            </div>
            <p>
              If you deploy IoT sensors in connection with POLTRIFARM, the
              following terms apply:
            </p>
            <ul className="legal-list">
              <li>
                <strong>Installation responsibility:</strong> You are
                responsible for the proper installation, maintenance, and
                operation of all sensor hardware. POLTRIFARM provides guidance
                but is not responsible for hardware malfunctions or improper
                installation.
              </li>
              <li>
                <strong>Network connectivity:</strong> You are responsible for
                providing adequate internet connectivity for sensor data
                transmission. POLTRIFARM is not responsible for data loss due to
                connectivity failures.
              </li>
              <li>
                <strong>Data accuracy:</strong> Sensor readings are presented
                as-is and may be subject to hardware tolerances. You should not
                rely solely on sensor data for critical farm management
                decisions without cross-verification.
              </li>
              <li>
                <strong>Hardware ownership:</strong> Any physical sensor
                hardware remains your property. POLTRIFARM provides software
                integration services only.
              </li>
              <li>
                <strong>Data transmission costs:</strong> Any network or data
                costs incurred for transmitting sensor data to our servers are
                your responsibility.
              </li>
            </ul>
          </div>

          <div className="legal-section" id="ai">
            <div className="legal-section-title">
              <span className="section-num">07</span>AI Features & Limitations
            </div>
            <div className="legal-warning">
              <strong>Critical Notice:</strong> The AI Health Scan feature is a
              decision support tool only. It is NOT a veterinary diagnostic
              instrument. Results from this feature must never replace
              professional veterinary advice, examination, or treatment.
            </div>
            <p>
              You acknowledge and accept the following limitations of the AI
              features within POLTRIFARM:
            </p>
            <ul className="legal-list">
              <li>
                The AI Health Scan model provides probability-ranked suggestions
                based on visual patterns. These suggestions may be incorrect,
                incomplete, or inapplicable to your specific situation.
              </li>
              <li>
                The model is trained on publicly available datasets and may not
                accurately identify all disease variants, regional conditions,
                or novel presentations.
              </li>
              <li>
                AI-generated recommendations for farm management decisions
                (including broiler sale timing) are suggestions only and do not
                account for all market variables or farm-specific factors.
              </li>
              <li>
                You are solely responsible for all farm management decisions,
                including veterinary care, medication administration, and
                commercial decisions, regardless of any AI-generated guidance
                provided by POLTRIFARM.
              </li>
            </ul>
            <p>
              POLTRIFARM expressly disclaims all liability for any loss, harm,
              or damage to your birds, farm, finances, or operations arising
              from reliance on AI-generated content within the platform.
            </p>
          </div>

          <div className="legal-section" id="data">
            <div className="legal-section-title">
              <span className="section-num">08</span>Data Ownership
            </div>
            <p>
              <strong>Your data belongs to you.</strong> You retain full
              ownership of all farm records, financial data, flock information,
              and other content you enter into POLTRIFARM ("Your Data").
            </p>
            <p>
              By using POLTRIFARM, you grant us a limited, non-exclusive,
              royalty-free licence to store, process, and analyse Your Data
              solely for the purpose of providing the platform's services to
              you. This licence does not extend to selling, sharing, or
              commercially exploiting your identifiable data.
            </p>
            <p>
              You may export Your Data at any time from the platform settings,
              and you may request deletion of Your Data by contacting us. Upon
              account deletion, Your Data will be removed from our active
              systems within 90 days, subject to the retention requirements
              described in our Privacy Policy.
            </p>
          </div>

          <div className="legal-section" id="accounts">
            <div className="legal-section-title">
              <span className="section-num">09</span>Account Management
            </div>
            <div className="legal-sub">Account Suspension</div>
            <p>
              We reserve the right to suspend or restrict your account if we
              believe you have violated these Terms, if your account poses a
              security risk, or if required by law. We will notify you of any
              suspension except where doing so would compromise a security
              investigation.
            </p>
            <div className="legal-sub">Account Deletion</div>
            <p>
              You may delete your account at any time through the platform
              settings or by contacting us at{" "}
              <a href="mailto:hello@poltrifarm.com">hello@poltrifarm.com</a>.
              Account deletion is irreversible. All associated data will be
              deleted as described in our Privacy Policy.
            </p>
            <div className="legal-sub">Inactivity</div>
            <p>
              Accounts that have been inactive for more than 24 months may be
              deactivated. We will send a warning email 30 days before
              deactivation. You may reactivate your account by signing in before
              the deactivation date.
            </p>
          </div>

          <div className="legal-section" id="liability">
            <div className="legal-section-title">
              <span className="section-num">10</span>Limitation of Liability
            </div>
            <p>
              To the maximum extent permitted by applicable law, POLTRIFARM and
              its developers shall not be liable for:
            </p>
            <ul className="legal-list">
              <li>
                Any indirect, incidental, special, consequential, or punitive
                damages arising from your use of the platform.
              </li>
              <li>
                Loss of revenue, profits, data, or business opportunities
                resulting from platform downtime, data loss, or service
                interruption.
              </li>
              <li>
                Livestock losses, health deterioration, or mortality arising
                from reliance on sensor data, AI recommendations, or other
                platform features.
              </li>
              <li>
                Decisions made based on financial tracking data, sale timing
                recommendations, or market analysis features.
              </li>
              <li>
                Unauthorised access to your account resulting from your failure
                to maintain account security.
              </li>
            </ul>
            <p>
              In jurisdictions that do not allow the exclusion of certain
              warranties or limitation of liability, our liability is limited to
              the maximum extent permitted by law.
            </p>
          </div>

          <div className="legal-section" id="disclaimer">
            <div className="legal-section-title">
              <span className="section-num">11</span>Disclaimers
            </div>
            <p>
              POLTRIFARM is provided on an{" "}
              <strong>"as is" and "as available" basis</strong> without
              warranties of any kind, either express or implied, including but
              not limited to warranties of merchantability, fitness for a
              particular purpose, and non-infringement.
            </p>
            <p>
              We do not warrant that the platform will be uninterrupted,
              error-free, or free from viruses or other harmful components. We
              do not warrant the accuracy, completeness, or reliability of any
              data, recommendations, or content provided through the platform.
            </p>
            <p>
              As an academic project, POLTRIFARM may be subject to periods of
              maintenance, updates, or temporary unavailability without prior
              notice.
            </p>
          </div>

          <div className="legal-section" id="termination">
            <div className="legal-section-title">
              <span className="section-num">12</span>Termination
            </div>
            <p>
              Either party may terminate the agreement governed by these Terms
              at any time. You may terminate by deleting your account. We may
              terminate your access if you violate these Terms, for legal
              reasons, or if we discontinue the platform.
            </p>
            <p>
              Upon termination, your right to use the platform ceases
              immediately. The provisions of these Terms that by their nature
              should survive termination — including data ownership, limitation
              of liability, and disclaimers — shall continue to apply.
            </p>
          </div>

          <div className="legal-section" id="governing">
            <div className="legal-section-title">
              <span className="section-num">13</span>Governing Law
            </div>
            <p>
              These Terms shall be governed by and construed in accordance with
              the laws of the Republic of Kenya, without regard to its conflict
              of law provisions. Any disputes arising from these Terms or your
              use of POLTRIFARM shall be subject to the exclusive jurisdiction
              of the courts of Kenya.
            </p>
          </div>

          <div className="legal-section" id="contact">
            <div className="legal-section-title">
              <span className="section-num">14</span>Contact
            </div>
            <p>
              If you have any questions about these Terms of Service, please
              contact us:
            </p>
            <div className="legal-contact-block">
              <h4>POLTRIFARM — Legal</h4>
              <p>
                📧{" "}
                <a href="mailto:legal@poltrifarm.com">legal@poltrifarm.com</a>
              </p>
              <p>
                📧 General:{" "}
                <a href="mailto:hello@poltrifarm.com">hello@poltrifarm.com</a>
              </p>
              <p>🏢 Dedan Kimathi University of Technology, Nyeri, Kenya</p>
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
          <Link
            to="/terms"
            className="current"
            onMouseEnter={expand}
            onMouseLeave={shrink}
          >
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
