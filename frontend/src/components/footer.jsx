import React from "react";
import "../styles/neonav.scss";

export default function AppFooter() {
  return (
    <footer className="app-footer">
      <div className="footer-inner">
        <div className="footer-left">
          <h2 className="brand">CleanCare Laundry</h2>
          <p className="desc">
            Smart laundry, simplified. From pickup to delivery — fresh, clean, and ready to wear.
          </p>
        </div>

        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>

        <div className="footer-social">
          <h4>Connect</h4>
          <div className="icons">
            <a href="https://facebook.com" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
            <a href="https://instagram.com" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
            <a href="https://twitter.com" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
            <a href="https://wa.me/94771234567" aria-label="WhatsApp"><i className="fab fa-whatsapp"></i></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} CleanCare Laundry. All rights reserved.</p>
      </div>
    </footer>
  );
}
