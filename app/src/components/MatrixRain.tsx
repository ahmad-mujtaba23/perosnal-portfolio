import { useRef, useEffect } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface Column {
  x: number;
  y: number;
  speed: number;
}

export function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const FONT_SIZE = 14;
    const COLOR_TEXT = "#1a1a1a";
    const COLOR_GLITCH = "#00FF41";
    const GLITCH_RATE = 0.002;
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";

    let columns: Column[] = [];
    let animFrameId: number;
    let isVisible = true;

    function buildColumns() {
      const colCount = Math.ceil(canvas!.width / FONT_SIZE) + 1;
      columns = [];
      for (let i = 0; i < colCount; i++) {
        columns.push({
          x: i * FONT_SIZE,
          y: Math.random() * canvas!.height,
          speed: Math.random() * 1.5 + 0.5,
        });
      }
    }

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
      buildColumns();
    }

    function render() {
      if (!isVisible) {
        animFrameId = requestAnimationFrame(render);
        return;
      }

      // Trail effect
      ctx!.fillStyle = "rgba(10,10,10,0.12)";
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height);

      ctx!.font = `${FONT_SIZE}px "JetBrains Mono", monospace`;
      ctx!.textAlign = "center";

      for (let i = 0; i < columns.length; i++) {
        const col = columns[i];
        const char = chars[Math.floor(Math.random() * chars.length)];

        if (Math.random() < GLITCH_RATE) {
          ctx!.fillStyle = COLOR_GLITCH;
        } else {
          ctx!.fillStyle = COLOR_TEXT;
        }

        ctx!.fillText(char, col.x, col.y);

        col.y += FONT_SIZE + col.speed;

        if (col.y > canvas!.height) {
          col.y = 0;
        }

        // Jitter
        if (Math.random() > 0.7) {
          col.x = Math.max(
            0,
            Math.min(
              canvas!.width - FONT_SIZE,
              col.x + (Math.random() > 0.5 ? FONT_SIZE : -FONT_SIZE)
            )
          );
        }
      }

      animFrameId = requestAnimationFrame(render);
    }

    // IntersectionObserver to pause when not visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    observer.observe(canvas);

    resize();
    render();

    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener("resize", resize);
      observer.disconnect();
    };
  }, [reducedMotion]);

  if (reducedMotion) {
    return (
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          background: "#0A0A0A",
        }}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
      }}
    />
  );
}
