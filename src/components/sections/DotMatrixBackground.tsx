"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/animations/gsap";

const CELL = 16;
const DOT = 3;

function hash(x: number, y: number): number {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

type RGB = readonly [number, number, number];

function lerpColor(a: RGB, b: RGB, t: number): RGB {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

// Light-blue ramp: --color-accent-hi -> a mid sky tone -> a near-white pale tint.
const TOP: RGB = [90, 146, 255];
const MID: RGB = [143, 192, 255];
const BOTTOM: RGB = [219, 238, 255];

function colorAt(t: number): RGB {
  return t < 0.5 ? lerpColor(TOP, MID, t / 0.5) : lerpColor(MID, BOTTOM, (t - 0.5) / 0.5);
}

/** Shimmering dot-matrix gradient — an ambient halftone field, independent of the cursor. */
export function DotMatrixBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = prefersReducedMotion();

    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    let seeds = new Float32Array(0);
    let rafId = 0;
    let running = true;
    const startTime = performance.now();

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      cols = Math.ceil(width / CELL);
      rows = Math.ceil(height / CELL);
      seeds = new Float32Array(cols * rows);
      for (let i = 0; i < seeds.length; i++) {
        seeds[i] = hash(i % cols, Math.floor(i / cols));
      }
    }

    function draw(time: number) {
      ctx!.clearRect(0, 0, width, height);
      const elapsed = (time - startTime) / 1000;

      for (let row = 0; row < rows; row++) {
        const t = row / rows;
        const [r, g, b] = colorAt(t);
        const baseAlpha = lerp(0.12, 0.65, t);

        for (let col = 0; col < cols; col++) {
          const seed = seeds[row * cols + col];
          const flicker = reduced
            ? 0.6
            : 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(elapsed * (0.5 + seed) + seed * 24));
          const alpha = baseAlpha * flicker;

          ctx!.fillStyle = `rgba(${r},${g},${b},${alpha.toFixed(3)})`;
          ctx!.fillRect(col * CELL, row * CELL, DOT, DOT);
        }
      }

      if (running && !reduced) rafId = requestAnimationFrame(draw);
    }

    function handleVisibility() {
      running = document.visibilityState === "visible";
      if (running) {
        if (!reduced) rafId = requestAnimationFrame(draw);
      } else {
        cancelAnimationFrame(rafId);
      }
    }

    resize();
    draw(performance.now());
    if (!reduced) rafId = requestAnimationFrame(draw);

    const resizeObserver = new ResizeObserver(() => {
      resize();
      draw(performance.now());
    });
    resizeObserver.observe(canvas);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full" />;
}
