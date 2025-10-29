import React, { useMemo, useState, useEffect } from "react";

/**
 * WashingMachine — React version of your HTML/CSS demo.
 * - Props let you place it anywhere (right side of About).
 * - Buttons: EMPTY/FILL, OPEN/CLOSE, START/STOP
 * - START triggers a short "isStarting" then continuous "isWashing".
 */
export default function WashingMachine({ className = "" }) {
  const [isFilled, setFilled] = useState(true);
  const [isOpen, setOpen] = useState(true);
  const [isWashing, setWashing] = useState(false);
  const [isStarting, setStarting] = useState(false);

  // computed label + disabled states
  const labels = useMemo(() => {
    return {
      content: isFilled ? "EMPTY" : "FILL",
      opening: isOpen ? "CLOSE" : "OPEN",
      power: isWashing ? "STOP" : "START",
      screen:
        isWashing ? "WASHING" : isStarting ? "STARTING" : isFilled ? "READY" : "EMPTY",
      powerDisabled: !isFilled || isOpen,
    };
  }, [isFilled, isOpen, isWashing, isStarting]);

  // START button behavior (short starting → washing)
  const handlePower = () => {
    if (labels.powerDisabled) return;
    if (!isWashing) {
      setStarting(true);
      // Keep the CSS/JS in sync with your original rotation speed (~0.6s)
      setTimeout(() => {
        setStarting(false);
        setWashing(true);
      }, 600);
    } else {
      setWashing(false);
      setStarting(false);
    }
  };

  // stop washing if door opens or contents emptied
  useEffect(() => {
    if (isOpen || !isFilled) {
      setWashing(false);
      setStarting(false);
    }
  }, [isOpen, isFilled]);

  const wmClass =
    "wm " +
    (isFilled ? "isFilled " : "") +
    (isOpen ? "isOpen " : "") +
    (isWashing ? "isWashing " : "") +
    (isStarting ? "isStarting " : "") +
    className;

  return (
    <div className="wm-wrap">
      <div className={wmClass} aria-label="Washing machine animation">
        <div className="wm-controls">{labels.screen}</div>
        <div className="wm-door" />
        <div className="wm-tub">
          <span className="clothes" />
          <span className="clothes" />
          <span className="clothes" />
          <span className="clothes" />
          <span className="clothes" />
          <span className="clothes" />
        </div>
      </div>

      {/* control bar (kept minimal; you can hide if not needed) */}
      <div className="wm-play">
        <button onClick={() => setFilled((v) => !v)}>{labels.content}</button>
        <button onClick={() => setOpen((v) => !v)}>{labels.opening}</button>
        <button onClick={handlePower} disabled={labels.powerDisabled}>
          {labels.power}
        </button>
      </div>
    </div>
  );
}
