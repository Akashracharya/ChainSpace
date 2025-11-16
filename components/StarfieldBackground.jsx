"use client";

import { useEffect, useRef } from "react";

export default function StarfieldBackground() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Create stars
    const STAR_COUNT = 250;
    const stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 1 + 0.2,
        r: Math.random() * 1.4 + 0.4,
      });
    }

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX / width;
      mouseRef.current.y = e.clientY / height;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    const draw = () => {
      const { x: mx, y: my } = mouseRef.current;

      ctx.clearRect(0, 0, width, height);

      // Background gradient (space feel)
      const gradient = ctx.createRadialGradient(
        width * mx,
        height * my,
        0,
        width / 2,
        height / 2,
        width
      );
      gradient.addColorStop(0, "rgba(120, 115, 245, 0.55)");
      gradient.addColorStop(0.3, "rgba(30, 64, 175, 0.65)");
      gradient.addColorStop(1, "rgba(3, 7, 18, 1)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Stars parallax
      for (const s of stars) {
        const offsetX = (mx - 0.5) * 30 * s.z;
        const offsetY = (my - 0.5) * 30 * s.z;

        let sx = s.x + offsetX;
        let sy = s.y + offsetY;

        if (sx < 0) sx += width;
        if (sx > width) sx -= width;
        if (sy < 0) sy += height;
        if (sy > height) sy -= height;

        const alpha = 0.4 + s.z * 0.6;
        ctx.beginPath();
        ctx.arc(sx, sy, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(248, 250, 252, ${alpha})`; // soft white star
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100%",
        height: "100%",
        display: "block",
      }}
    />
  );
}
