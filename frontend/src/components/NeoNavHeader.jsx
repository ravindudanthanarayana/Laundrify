import React, { useEffect } from "react";
import "../styles/neonav.scss";

export default function NeoNavHeader() {
  useEffect(() => {
    const mobileToggle = document.getElementById("mobileToggle");
    const mobileMenu = document.getElementById("mobileMenu");
    const mobileMenuOverlay = document.getElementById("mobileMenuOverlay");
    const mobileMenuClose = document.getElementById("mobileMenuClose");
    const mobileMenuLinks = document.querySelectorAll(".mobile-menu-link");
    const navLinks = document.querySelectorAll(".nav-link");
    const navbar = document.querySelector(".navbar-container");

    const openMobileMenu = () => {
      mobileToggle?.classList.add("active");
      mobileMenu?.classList.add("active");
      mobileMenuOverlay?.classList.add("active");
      document.body.style.overflow = "hidden";
    };
    const closeMobileMenu = () => {
      mobileToggle?.classList.remove("active");
      mobileMenu?.classList.remove("active");
      mobileMenuOverlay?.classList.remove("active");
      document.body.style.overflow = "";
    };
    const onToggle = (e) => { e.preventDefault(); e.stopPropagation();
      if (mobileMenu?.classList.contains("active")) closeMobileMenu(); else openMobileMenu();
    };
    const onOverlay = () => closeMobileMenu();
    const onCloseBtn = (e) => { e.preventDefault(); closeMobileMenu(); };
    const onEsc = (e) => { if (e.key === "Escape" && mobileMenu?.classList.contains("active")) closeMobileMenu(); };

    const onNavClick = function (e) {
      if (!this.classList.contains("cta-button")) {
        navLinks.forEach((l) => l.classList.remove("active"));
        this.classList.add("active");
        const href = this.getAttribute("href");
        mobileMenuLinks.forEach((l) => {
          l.classList.remove("active");
          if (l.getAttribute("href") === href) l.classList.add("active");
        });
      }
      closeMobileMenu();
    };
    const onMobileLink = function () {
      closeMobileMenu();
      mobileMenuLinks.forEach((l) => l.classList.remove("active"));
      this.classList.add("active");
      const href = this.getAttribute("href");
      navLinks.forEach((l) => {
        l.classList.remove("active");
        if (l.getAttribute("href") === href) l.classList.add("active");
      });
    };
    const onScroll = () => {
      const top = window.pageYOffset || document.documentElement.scrollTop;
      if (top > 50) navbar?.classList.add("scrolled"); else navbar?.classList.remove("scrolled");
    };
    const onResize = () => { if (window.innerWidth > 992 && mobileMenu?.classList.contains("active")) closeMobileMenu(); };

    mobileToggle?.addEventListener("click", onToggle);
    mobileMenuOverlay?.addEventListener("click", onOverlay);
    mobileMenuClose?.addEventListener("click", onCloseBtn);
    document.addEventListener("keydown", onEsc);
    window.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onResize);
    navLinks.forEach((l) => l.addEventListener("click", onNavClick));
    mobileMenuLinks.forEach((l) => l.addEventListener("click", onMobileLink));

    return () => {
      mobileToggle?.removeEventListener("click", onToggle);
      mobileMenuOverlay?.removeEventListener("click", onOverlay);
      mobileMenuClose?.removeEventListener("click", onCloseBtn);
      document.removeEventListener("keydown", onEsc);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      navLinks.forEach((l) => l.removeEventListener("click", onNavClick));
      mobileMenuLinks.forEach((l) => l.removeEventListener("click", onMobileLink));
    };
  }, []);

  return (
    <>
      {/* Floating BG bits */}
      <div className="floating-elements">
        <div className="floating-circle" />
        <div className="floating-circle" />
        <div className="floating-circle" />
      </div>

      {/* Centered sticky pill header */}
      <nav className="navbar-container">
        <div className="navbar">
          {/* Brand */}
          <a href="#home" className="navbar-brand">
            <div className="logo-icon" />
            <span className="brand-text">Ravinduge Laundry</span>
          </a>

          {/* Links */}
          <ul className="navbar-nav" id="navbarNav">
            <li className="nav-item">
              <a href="#home" className="nav-link active">
                <span className="nav-dot" />
                <span>Home</span>
              </a>
            </li>
            <li className="nav-item">
              <a href="#about" className="nav-link">
                <span className="nav-dot" />
                <span>About</span>
              </a>
            </li>
            <li className="nav-item">
              <a href="#services" className="nav-link">
                <span className="nav-dot" />
                <span>Services</span>
              </a>
            </li>
            <li className="nav-item">
              <a href="#portfolio" className="nav-link">
                <span className="nav-dot" />
                <span>Appointment</span>
              </a>
            </li>
            <li className="nav-item">
              <a href="#contact" className="nav-link">
                <span className="nav-dot" />
                <span>Contact</span>
              </a>
            </li>
            <li className="nav-item">
              <a href="#cta" className="cta-button">Get Started</a>
            </li>
          </ul>

          {/* Mobile hamburger */}
          <button className="mobile-toggle" id="mobileToggle" aria-label="menu">
            <div className="hamburger">
              <span />
              <span />
              <span />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile overlay & menu */}
      <div className="mobile-menu-overlay" id="mobileMenuOverlay" />
      <div className="mobile-menu" id="mobileMenu">
        <div className="mobile-menu-header">
          <a href="#home" className="mobile-menu-brand">
            <div className="logo-icon" />
            <span className="brand-text">NeoNav</span>
          </a>
          <button className="mobile-menu-close" id="mobileMenuClose" aria-label="close">
            <span>×</span>
          </button>
        </div>

        <ul className="mobile-menu-nav">
          <li className="mobile-menu-item">
            <a href="#home" className="mobile-menu-link active">
              <span className="mobile-menu-icon" />
              <span>Home</span>
            </a>
          </li>
          <li className="mobile-menu-item">
            <a href="#about" className="mobile-menu-link">
              <span className="mobile-menu-icon" />
              <span>About</span>
            </a>
          </li>
          <li className="mobile-menu-item">
            <a href="#services" className="mobile-menu-link">
              <span className="mobile-menu-icon" />
              <span>Services</span>
            </a>
          </li>
          <li className="mobile-menu-item">
            <a href="#portfolio" className="mobile-menu-link">
              <span className="mobile-menu-icon" />
              <span>Appointment</span>
            </a>
          </li>
          <li className="mobile-menu-item">
            <a href="#contact" className="mobile-menu-link">
              <span className="mobile-menu-icon" />
              <span>Contact</span>
            </a>
          </li>
        </ul>

        <div className="mobile-cta">
          <a href="#cta" className="mobile-cta-button">Get Started</a>
        </div>
      </div>
    </>
  );
}
