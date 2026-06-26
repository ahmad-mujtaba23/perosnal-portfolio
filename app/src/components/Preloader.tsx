import { useEffect, useState, useCallback, useMemo } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface PreloaderProps {
  onComplete: () => void;
}

const NAME = "Ahmad Mujtaba";

// Tuning knobs for the character stagger
const STAGGER_MS = 70; // delay between each character's hop start
const HOP_DURATION_MS = 480; // how long a single character's hop animation takes
const HOLD_MS = 500; // pause after the last character lands, before hiding
const REDUCED_MOTION_HOLD_MS = 600; // simpler hold when motion is reduced

export function Preloader({ onComplete }: PreloaderProps) {
  const [hidden, setHidden] = useState(false);
  const reducedMotion = useReducedMotion();

  const characters = useMemo(() => NAME.split(""), []);

  // Total time for the last character to *start* its hop, plus its own duration
  const lastCharStart = (characters.length - 1) * STAGGER_MS;
  const totalRevealMs = lastCharStart + HOP_DURATION_MS;

  const hide = useCallback(() => {
    setHidden(true);
    // Small delay to let the CSS transition start, then notify parent
    setTimeout(() => {
      onComplete();
    }, 100);
  }, [onComplete]);

  useEffect(() => {
    if (reducedMotion) {
      const timer = setTimeout(hide, REDUCED_MOTION_HOLD_MS);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(hide, totalRevealMs + HOLD_MS);
    return () => clearTimeout(timer);
  }, [reducedMotion, hide, totalRevealMs]);

  // Preloader should not render at all after transition completes
  if (hidden) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0A0A0A] transition-all duration-700 ${
        hidden ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"
      }`}
      style={{
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div className="flex items-center gap-1">
        <span
          className="text-[clamp(2rem,5vw,3.5rem)] font-bold tracking-[-0.03em] text-[#00FF41] flex"
          style={{ fontFamily: "var(--font-display)" }}
          aria-label={NAME}
        >
          {characters.map((char, i) => (
            <span
              key={i}
              aria-hidden="true"
              className={reducedMotion ? "" : "inline-block animate-hop-in"}
              style={
                reducedMotion
                  ? undefined
                  : {
                      animationDelay: `${i * STAGGER_MS}ms`,
                      animationDuration: `${HOP_DURATION_MS}ms`,
                      // Char starts invisible; the keyframes take over on their delay
                      animationFillMode: "backwards",
                    }
              }
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </span>
        <span
          className="inline-block w-[2px] h-[1.2em] bg-[#F5F5F5] ml-1 animate-blink"
          aria-hidden="true"
          style={
            reducedMotion
              ? undefined
              : { animationDelay: `${totalRevealMs}ms` }
          }
        />
      </div>
    </div>
  );
}