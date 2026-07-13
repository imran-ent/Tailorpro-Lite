import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-brand-section">
          <Link to="/" className="footer-logo">
            <img src="/logo-icon.svg" alt="TailorPro" className="logo-image" />
            <span className="logo-text">Tailor<span className="logo-highlight">Pro</span></span>
          </Link>
          <p className="footer-description">
            Crafting premium, custom-stitched apparel tailored to fit you perfectly. Bringing style, comfort, and heritage together.
          </p>
          <div className="social-links">
            <a href="#" className="social-icon" aria-label="Facebook">🌐</a>
            <a href="#" className="social-icon" aria-label="Instagram">📸</a>
            <a href="#" className="social-icon" aria-label="Pinterest">📌</a>
            <a href="#" className="social-icon" aria-label="Twitter">🐦</a>
          </div>
        </div>

        <div className="footer-links-section">
          <h4 className="footer-title">Our Services</h4>
          <ul className="footer-links">
            <li><a href="#dresses">Bespoke Stitching</a></li>
            <li><a href="#services">Custom Alterations</a></li>
            <li><a href="#dresses">Designer Blouses</a></li>
            <li><a href="#dresses">Festive Lehenga Stitching</a></li>
            <li><a href="#dresses">Kids Outfits</a></li>
          </ul>
        </div>

        <div className="footer-links-section">
          <h4 className="footer-title">Opening Hours</h4>
          <ul className="footer-hours">
            <li>Monday - Friday: 9:00 AM - 8:00 PM</li>
            <li>Saturday: 10:00 AM - 6:00 PM</li>
            <li>Sunday: Closed</li>
          </ul>
        </div>

        <div className="footer-links-section">
          <h4 className="footer-title">Contact Us</h4>
          <ul className="footer-contact">
            <li>📍 123 Fashion Ave, Design District</li>
            <li>📞 +1 (555) 790-2646</li>
            <li>✉️ support@tailorpro.com</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {currentYear} TailorPro. All rights reserved. Designed with precision.</p>
      </div>
    </footer>
  );
};

export default Footer;
