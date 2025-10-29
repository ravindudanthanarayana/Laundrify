import React from "react";
import "../../styles/neonav.scss";
import "../../styles/service.scss";
import CanvasBubbles from "../CanvasBubbles";
import HeroVectorRight from "../HeroVectorRight";
import WashingMachine from "../WashingMachine";
import SectionTwoCards from "../SectionTwoCards";
import Footer from "../footer";
import AboutHero from "../AboutHero";

export default function HomeSections() {
  return (
    <>
      {/* ===== FULL-WIDTH HERO ===== */}
      <section id="home" className="hero-section">
        <div className="hero-inner">
          <div className="hero-wrap">
            {/* LEFT TEXT */}
            <div className="hero-left">
              <span className="eyebrow">Sri Lanka's #1 🇱🇰 Laundry App</span>
              <h1 className="hero-title">
                Unique solutions for all your <span>laundry</span> needs
              </h1>
              <p className="hero-sub">
                Smart Laundry, <b>Simplified.</b> Pick-up to delivery with real-time tracking.
              </p>
              <div className="hero-cta">
                <a href="#cta" className="cta-button">Get Started</a>
              </div>
              <ul className="hero-points"></ul>
            </div>

            {/* RIGHT SIDE */}
            <div className="hero-right">
              <CanvasBubbles className="bubbles-layer" />
              <HeroVectorRight className="vector-layer" />
            </div>
          </div>
        </div>
      </section>

      {/* ===== ABOUT HERO (diagonal background) ===== */}
      <AboutHero />

      {/* ===== ABOUT GRID (FIXED STRUCTURE) ===== */}
      <section id="about" className="content-section about-grid">
        {/* LEFT TEXT BLOCK */}
        <div className="about-left">
          <h2 className="section-title">About Us</h2>

           <div className="about-right">
          <WashingMachine />
        </div>
          <p className="section-subtitle">
            Unique solutions for all your <span className="highlight">laundry</span> needs
          </p>

          <ul className="about-points fancy-points">
            <li>
              <div className="icon-wrap"><i className="fas fa-home" /></div>
              <div><strong>Homecare</strong> — for all your home linens</div>
            </li>
            <li>
              <div className="icon-wrap"><i className="fas fa-tshirt" /></div>
              <div><strong>Clean &amp; Press</strong> — for professional garment care</div>
            </li>
            <li>
              <div className="icon-wrap"><i className="fas fa-water" /></div>
              <div><strong>Wash &amp; Fold</strong> — for items that don’t need pressing</div>
            </li>
            <li>
              <div className="icon-wrap"><i className="fas fa-iron" /></div>
              <div><strong>Press Only</strong> — for clean clothes that need pressing</div>
            </li>
          </ul>
        </div>

        {/* RIGHT ILLUSTRATION */}
       
      </section>

      {/* ===== SERVICES (Laundry copy) ===== */}
      <section id="services" className="c-section section-after-diagonal">
        
      </section>

      {/* ===== PORTFOLIO ===== */}
      <section id="portfolio" className="content-section">
        <h2 className="section-title">Portfolio</h2>
        <p className="section-subtitle">
          Explore our collection of advanced navigation components and modern web designs.
        </p>
      </section>

      {/* ===== CONTACT ===== */}
      <section id="contact" className="content-section">
        <h2 className="section-title">Contact</h2>
        <p className="section-subtitle">
          Ready to elevate your web presence? Get in touch to discuss your next project.
        </p>
      </section>

      <Footer />
    </>
  );
}
