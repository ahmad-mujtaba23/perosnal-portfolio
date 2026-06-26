import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealOptions {
  stagger?: number;
  y?: number;
  duration?: number;
  x?: number;
  delay?: number;
  childSelector?: string;
}

export function useScrollReveal<T extends HTMLElement>(
  options: ScrollRevealOptions = {}
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const {
      stagger = 0.1,
      y = 30,
      duration = 0.8,
      x = 0,
      delay = 0,
      childSelector = "[data-reveal]",
    } = options;

    const elements = ref.current.querySelectorAll(childSelector);
    const targets = elements.length > 0 ? elements : [ref.current];

    gsap.set(targets, { opacity: 0, y, x });

    const tween = gsap.to(targets, {
      opacity: 1,
      y: 0,
      x: 0,
      duration,
      ease: "expo.out",
      stagger,
      delay,
      scrollTrigger: {
        trigger: ref.current,
        start: "top bottom-=10%",
        toggleActions: "play none none reset",
      },
    });

    return () => {
      tween.kill();
      ScrollTrigger.getAll()
        .filter((st) => st.vars.trigger === ref.current)
        .forEach((st) => st.kill());
    };
  }, [options.stagger, options.y, options.duration, options.x, options.delay, options.childSelector]);

  return ref;
}
