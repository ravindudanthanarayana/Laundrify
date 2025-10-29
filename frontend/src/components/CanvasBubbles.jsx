import React, { useEffect, useRef } from "react";

export default function CanvasBubbles({
  density = 90,        // bubbles count
  minR = 4,            // min radius
  maxR = 24,           // max radius
  speed = 0.25,        // drift speed
}) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const bubblesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: true });

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const rand = (a, b) => a + Math.random() * (b - a);

    const seed = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const count = Math.max(30, Math.floor((w * h) / 18000)); // adaptive
      const total = Math.min(density, count);

      bubblesRef.current = new Array(total).fill(0).map(() => {
        const r = rand(minR, maxR);
        return {
          x: rand(r, w - r),
          y: rand(r, h - r),
          r,
          // soft blue/teal mix
          fill: `rgba(14,165,233, ${rand(0.06, 0.16)})`,
          stroke: `rgba(20,184,166, ${rand(0.25, 0.45)})`,
          vx: rand(-speed, speed),
          vy: rand(-speed, speed),
        };
      });
    };

    const draw = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;

      // 🔹 Do NOT paint a white bg — keep transparent
      ctx.clearRect(0, 0, w, h);

      // Gentle composite for overlaps
      ctx.globalCompositeOperation = "source-over";

      for (const b of bubblesRef.current) {
        // move
        b.x += b.vx;
        b.y += b.vy;

        // bounce
        if (b.x - b.r < 0 || b.x + b.r > w) b.vx *= -1;
        if (b.y - b.r < 0 || b.y + b.r > h) b.vy *= -1;

        // draw
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = b.fill;
        ctx.strokeStyle = b.stroke;
        ctx.lineWidth = 1;
        ctx.fill();
        ctx.stroke();
      }
    };

    const loop = () => {
      draw();
      rafRef.current = requestAnimationFrame(loop);
    };

    resize();
    window.addEventListener("resize", resize);
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [density, minR, maxR, speed]);

  return <canvas ref={canvasRef} className="bubbles-canvas" aria-hidden="true" />;
}
