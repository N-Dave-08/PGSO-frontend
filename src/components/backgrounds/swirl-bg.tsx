"use client";

import { useEffect, useRef, useState } from "react";
import { createNoise3D } from "simplex-noise";
import { cn } from "@/lib/utils";

export interface SwirlBackgroundProps {
  className?: string;
  title?: string;
  particleCount?: number;
  baseHue?: number;
  rangeHue?: number;
  backgroundColor?: string;
  useThemeColors?: boolean;
}

export function SwirlBackground({
  className,
  title,
  particleCount = 700,
  baseHue,
  rangeHue,
  backgroundColor,
  useThemeColors = true,
}: SwirlBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check for dark mode
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setIsDarkMode(isDark);

    // Optional: Listen for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          const isDark = document.documentElement.classList.contains("dark");
          setIsDarkMode(isDark);
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    // Constants
    const particlePropCount = 9;
    const particlePropsLength = particleCount * particlePropCount;
    const rangeY = 100;
    const baseTTL = 50;
    const rangeTTL = 150;
    const baseSpeed = 0.1;
    const rangeSpeed = 2;
    const baseRadius = 1;
    const rangeRadius = 4;
    const noiseSteps = 8;
    const xOff = 0.00125;
    const yOff = 0.00125;
    const zOff = 0.0005;
    const TAU = Math.PI * 2;

    // Updated default values to match Dracula theme
    const defaultBaseHue = 290; // Purple base from your theme
    const defaultRangeHue = 60; // Reduced range for more cohesive colors
    const defaultBackgroundColor = isDarkMode
      ? "oklch(0.2 0.05 280)" // Dark mode background
      : "oklch(0.98 0.02 280)"; // Light mode background

    // Initialize with defaults or provided values
    let effectiveBaseHue = baseHue ?? defaultBaseHue;
    let effectiveRangeHue = rangeHue ?? defaultRangeHue;
    let effectiveBackgroundColor = backgroundColor ?? defaultBackgroundColor;

    if (useThemeColors) {
      try {
        // Get CSS variables from the theme
        const computedStyle = getComputedStyle(document.documentElement);
        const themeBaseHue = computedStyle
          .getPropertyValue("--swirl-base-hue")
          .trim();
        const themeRangeHue = computedStyle
          .getPropertyValue("--swirl-range-hue")
          .trim();
        const themeBackground = computedStyle
          .getPropertyValue("--swirl-background")
          .trim();

        // Only override if the theme values exist and are valid
        if (themeBaseHue) {
          const parsedHue = parseInt(themeBaseHue, 10);
          if (!isNaN(parsedHue)) {
            effectiveBaseHue = parsedHue;
          }
        }

        if (themeRangeHue) {
          const parsedRange = parseInt(themeRangeHue, 10);
          if (!isNaN(parsedRange)) {
            effectiveRangeHue = parsedRange;
          }
        }

        if (themeBackground) {
          effectiveBackgroundColor = themeBackground;
        }
      } catch (error) {
        console.error("Error reading theme variables:", error);
        // Fallback to defaults or provided values
      }
    }

    // Variables
    let container: HTMLDivElement;
    let canvasA: HTMLCanvasElement;
    let canvasB: HTMLCanvasElement;
    let ctxA: CanvasRenderingContext2D;
    let ctxB: CanvasRenderingContext2D;
    let center: number[] = [];
    let tick = 0;
    let simplex: ReturnType<typeof createNoise3D>;
    let particleProps: Float32Array;
    let animationFrameId: number;

    // Helper functions
    const rand = (n: number) => Math.random() * n;
    const randRange = (n: number) => n - rand(2 * n);
    const fadeInOut = (t: number, m: number) => {
      let hm = 0.5 * m;
      return Math.abs(((t + hm) % m) - hm) / hm;
    };
    const lerp = (a: number, b: number, t: number) => a + t * (b - a);
    const cos = Math.cos;
    const sin = Math.sin;

    function setup() {
      createCanvas();
      resize();
      initParticles();
      draw();
      setIsInitialized(true);
    }

    function initParticles() {
      tick = 0;
      simplex = createNoise3D();
      particleProps = new Float32Array(particlePropsLength);

      for (let i = 0; i < particlePropsLength; i += particlePropCount) {
        initParticle(i);
      }
    }

    function initParticle(i: number) {
      let x, y, vx, vy, life, ttl, speed, radius, hue;

      x = rand(canvasA.width);
      y = center[1] + randRange(rangeY);
      vx = 0;
      vy = 0;
      life = 0;
      ttl = baseTTL + rand(rangeTTL);
      speed = baseSpeed + rand(rangeSpeed);
      radius = baseRadius + rand(rangeRadius);
      hue = effectiveBaseHue + rand(effectiveRangeHue);

      particleProps.set([x, y, vx, vy, life, ttl, speed, radius, hue], i);
    }

    function drawParticles() {
      for (let i = 0; i < particlePropsLength; i += particlePropCount) {
        updateParticle(i);
      }
    }

    function updateParticle(i: number) {
      let i2 = 1 + i,
        i3 = 2 + i,
        i4 = 3 + i,
        i5 = 4 + i,
        i6 = 5 + i,
        i7 = 6 + i,
        i8 = 7 + i,
        i9 = 8 + i;
      let n, x, y, vx, vy, life, ttl, speed, x2, y2, radius, hue;

      x = particleProps[i];
      y = particleProps[i2];

      // Use simplex noise to determine direction
      n = simplex(x * xOff, y * yOff, tick * zOff) * noiseSteps * TAU;

      vx = lerp(particleProps[i3], cos(n), 0.5);
      vy = lerp(particleProps[i4], sin(n), 0.5);
      life = particleProps[i5];
      ttl = particleProps[i6];
      speed = particleProps[i7];
      x2 = x + vx * speed;
      y2 = y + vy * speed;
      radius = particleProps[i8];
      hue = particleProps[i9];

      drawParticle(x, y, x2, y2, life, ttl, radius, hue);

      life++;

      particleProps[i] = x2;
      particleProps[i2] = y2;
      particleProps[i3] = vx;
      particleProps[i4] = vy;
      particleProps[i5] = life;
      (checkBounds(x, y) || life > ttl) && initParticle(i);
    }

    function drawParticle(
      x: number,
      y: number,
      x2: number,
      y2: number,
      life: number,
      ttl: number,
      radius: number,
      hue: number
    ) {
      ctxA.save();
      ctxA.lineCap = "round";
      ctxA.lineWidth = radius;

      // Use OKLCH for better color harmony with the theme
      const lightness = isDarkMode ? "60%" : "60%";
      const chroma = isDarkMode ? "100%" : "100%";

      ctxA.strokeStyle = `oklch(${lightness} ${chroma} ${hue}deg / ${fadeInOut(
        life,
        ttl
      )})`;
      ctxA.beginPath();
      ctxA.moveTo(x, y);
      ctxA.lineTo(x2, y2);
      ctxA.stroke();
      ctxA.closePath();
      ctxA.restore();
    }

    function checkBounds(x: number, y: number) {
      return x > canvasA.width || x < 0 || y > canvasA.height || y < 0;
    }

    function createCanvas() {
      container = containerRef.current!;

      canvasA = document.createElement("canvas");
      canvasB = document.createElement("canvas");

      canvasB.style.position = "absolute";
      canvasB.style.top = "0";
      canvasB.style.left = "0";
      canvasB.style.width = "100%";
      canvasB.style.height = "100%";
      canvasB.style.zIndex = "-1";

      container.appendChild(canvasB);

      ctxA = canvasA.getContext("2d")!;
      ctxB = canvasB.getContext("2d")!;

      center = [];
    }

    function resize() {
      // Get the container dimensions instead of window dimensions
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const width = rect.width;
      const height = rect.height;

      canvasA.width = width;
      canvasA.height = height;

      ctxA.drawImage(canvasB, 0, 0);

      canvasB.width = width;
      canvasB.height = height;

      ctxB.drawImage(canvasA, 0, 0);

      center[0] = 0.5 * width;
      center[1] = 0.5 * height;
    }

    function renderGlow() {
      ctxB.save();
      ctxB.filter = "blur(8px) brightness(200%)";
      ctxB.globalCompositeOperation = "lighter";
      ctxB.drawImage(canvasA, 0, 0);
      ctxB.restore();

      ctxB.save();
      ctxB.filter = "blur(4px) brightness(200%)";
      ctxB.globalCompositeOperation = "lighter";
      ctxB.drawImage(canvasA, 0, 0);
      ctxB.restore();
    }

    function renderToScreen() {
      ctxB.save();
      ctxB.globalCompositeOperation = "lighter";
      ctxB.drawImage(canvasA, 0, 0);
      ctxB.restore();
    }

    function draw() {
      tick++;

      ctxA.clearRect(0, 0, canvasA.width, canvasA.height);

      // Clear the previous frame instead
      ctxB.clearRect(0, 0, canvasB.width, canvasB.height);

      drawParticles();
      renderGlow();
      renderToScreen();

      animationFrameId = requestAnimationFrame(draw);
    }

    // Initialize
    setup();

    // Event listeners
    window.addEventListener("resize", resize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", resize);
      if (canvasB && canvasB.parentNode) {
        canvasB.parentNode.removeChild(canvasB);
      }
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      setIsInitialized(false);
    };
  }, [
    particleCount,
    baseHue,
    rangeHue,
    backgroundColor,
    useThemeColors,
    isDarkMode,
  ]);

  return (
    <div className={cn("swirl-background", className)} ref={containerRef}>
      {title && <h2 className="swirl-title">{title}</h2>}
    </div>
  );
}
