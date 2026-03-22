import React from 'react';
import '../css/Privacy.css';

export default function Privacy() {
    return (
        <div className="privacy-container">
            <h1>Privacy Policy</h1>
            <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>

            <section>
                <h2>1. Introduction</h2>
                <p>
                    POLTRIFARM Management System ("we", "our", or "us") operates the POLTRIFARM platform.
                    This Privacy Policy explains our data practices and your privacy rights.
                </p>
            </section>

            <section>
                <h2>2. Information We Collect</h2>
                <p>We collect information you provide directly, such as:</p>
                <ul>
                    <li>Account registration data (name, email, password)</li>
                    <li>Farm and crop management information</li>
                    <li>Usage activity and analytics</li>
                </ul>
            </section>

            <section>
                <h2>3. How We Use Your Information</h2>
                <p>Your information is used to:</p>
                <ul>
                    <li>Provide and improve our services</li>
                    <li>Communicate with you about updates</li>
                    <li>Ensure security and prevent fraud</li>
                </ul>
            </section>

            <section>
                <h2>4. Data Protection</h2>
                <p>
                    We implement industry-standard security measures to protect your personal data
                    from unauthorized access, alteration, or disclosure.
                </p>
            </section>

            <section>
                <h2>5. Contact Us</h2>
                <p>
                    If you have questions about this Privacy Policy, please contact us at
                    support@poltrifarm.com
                </p>
            </section>
        </div>
    );
}