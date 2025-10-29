import React from "react";
import "../styles/about-hero.scss";
import aboutImg from "../images/about.jpeg";



export default function AboutHero() {
  return (
    <section className="about-hero">
      {/* LEFT: image */}
      <div className="about-hero-image">
        <img src={aboutImg} alt="About our laundry service" />
      </div>

      {/* RIGHT: content */}
      <div className="ah-content">
        <span className="eyebrow">ABOUT LINEDRY</span>
        <h2 className="ah-title">
          Laundry Services for <br />
          <span>Modern Living</span>
        </h2>

        <p className="ah-lead">
          At Linedry, we believe laundry should never feel like a chore. We
          combine modern tech, trained staff, and reliable service to make your
          laundry experience fast, simple, and worry-free.
        </p>

        {/* feature cards */}
        <div className="ah-features">
          <article className="feat-card">
            <div className="feat-icon">
              {/* crown / quality icon */}
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M3 7l4 3 5-6 5 6 4-3v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h3>Fresh Results</h3>
            <p>
              Your clothes are washed with care and folded neatly, so they
              return clean, crisp, and ready to wear.
            </p>
          </article>

          <article className="feat-card">
            <div className="feat-icon">
              {/* pickup/van icon */}
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M3 7h11l4 4h3v6h-2a2 2 0 1 1-4 0H9a2 2 0 1 1-4 0H3V7z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h3>Fast Pickup</h3>
            <p>
              We collect and return your laundry on time with reliable doorstep
              delivery every time.
            </p>
          </article>
        </div>

        {/* CTAs */}
        <div className="ah-ctas">
          <a className="btn btn-primary" href="#services">
            Explore Services
          </a>
          <a className="btn btn-ghost" href="#learn">
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
}
