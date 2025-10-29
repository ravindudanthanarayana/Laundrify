import React, { useMemo, useState, useEffect, useRef } from "react";
import "../styles/neonav.scss";

export default function SectionTwoCards({
  items = [
    {
      title: "Lightning-Fast Pickup",
      info:
        "We schedule pickups within hours and keep you updated in real time — zero hassle, zero delays.",
    },
    {
      title: "Premium Care Fabrics",
      info:
        "From silk to denim, our processes are tuned per fabric. Eco-friendly detergents, gentle cycles.",
    },
    {
      title: "Transparent Pricing",
      info:
        "No surprises. Clear rates per item & per kg with instant estimates before you confirm.",
    },
    {
      title: "Door-to-Door Delivery",
      info:
        "Track when your order heads back. We deliver neatly packed, pressed, and ready to wear.",
    },
  ],

  // THEME (fits your app: emerald → teal → sky)
  theme = {
    bg: "linear-gradient(135deg, #e8fbff 0%, #f7fffb 100%)",
    ringFrom: "#10b981", // emerald-500
    ringTo:   "#0ea5e9", // sky-500
    cardTop:  "#0ea5e9",
    cardBot:  "#14b8a6",
  },
}) {
  const total = items.length;
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  const active = items[index];
  const ringPct = useMemo(() => Math.round(((index + 1) / total) * 100), [index, total]);

  // reset flip when slide changes
  useEffect(() => setFlipped(false), [index]);

  // auto reveal on scroll (no manual needed)
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => setInView(e.isIntersecting),
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const prev = () => setIndex((i) => (i - 1 + total) % total);
  const next = () => setIndex((i) => (i + 1) % total);

  return (
    <section
      ref={ref}
      className={`section2 ${inView ? "inView" : ""}`}
      style={{
        "--bg": theme.bg,
        "--ring-from": theme.ringFrom,
        "--ring-to": theme.ringTo,
        "--card-top": theme.cardTop,
        "--card-bot": theme.cardBot,

        // size controls (smaller card)
        "--card-w": "26rem",
        "--card-h": "38rem",
        "--card-r": "16px",
      }}
    >
      <div className="cards">
        {/* animated conic ring */}
        <div
          className="background"
          style={{
            "--conic-t": inView ? `${ringPct}%` : "0%",
            "--conic-b": inView ? `${ringPct}%` : "0%",
          }}
        />

        {/* flipping card */}
        <div
          className={`card ${inView ? "card-in" : ""}`}
          style={{ "--rotate-y": flipped ? "180deg" : "0deg" }}
          onClick={() => setFlipped((f) => !f)}
          role="button"
          aria-label="Flip details"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") setFlipped((f) => !f);
            if (e.key === "ArrowRight") next();
            if (e.key === "ArrowLeft") prev();
          }}
        >
          {/* BACK */}
          <div className="back">
            <div className="wrapper-top">
              <div className="top">
                <div className="count">
                  <span className="count-number">{index + 1}</span>
                  <span className="count-label">/</span>
                  <span className="total-number">{total}</span>
                </div>
                <div className="number">
                  <span className="main-number">(<span className="count-number">{index + 1}</span>)</span>
                </div>
                <div className="icon" aria-hidden>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="#ff6b6b" />
                    <circle cx="12" cy="12" r="3" fill="#4ecdc4" />
                  </svg>
                </div>
              </div>
              <h2 className="title">{active.title}</h2>
            </div>
            <p className="info">{active.info}</p>
          </div>

          {/* FRONT */}
          <div className="front">
            <div className="wrapper-top">
              <div className="top">
                <div className="count">
                  <span className="count-number">{index + 1}</span>
                  <span className="count-label">/</span>
                  <span className="total-number">{total}</span>
                </div>
                <div className="number">
                  <span className="main-number">(<span className="count-number">{index + 1}</span>)</span>
                </div>
                <div className="icon" aria-hidden>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="#ff6b6b" />
                    <circle cx="12" cy="12" r="3" fill="#4ecdc4" />
                  </svg>
                </div>
              </div>
              <h2 className="title">{active.title}</h2>
            </div>
            <p className="info">{active.info}</p>
          </div>
        </div>
      </div>

      {/* tiny nav (optional) */}
      <div className="section2-nav">
        <button type="button" onClick={prev} aria-label="Previous">Prev</button>
        <button type="button" onClick={next} aria-label="Next">Next</button>
        <span className="hint">Click the card to flip</span>
      </div>
    </section>
  );
}
