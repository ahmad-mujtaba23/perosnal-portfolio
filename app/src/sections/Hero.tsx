import { useRef, useEffect, useState } from "react";
import { MatrixRain } from "@/components/MatrixRain";
import { Github, Mail, Linkedin, ChevronDown } from "lucide-react";
import gsap from "gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface HeroProps {
  ready: boolean;
}

const NAME_LINES = ["Ahmad", "Mujtaba"];

export function Hero({ ready }: HeroProps) {
  const nameRef = useRef<HTMLHeadingElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const ctasRef = useRef<HTMLDivElement>(null);
  const socialsRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [animationDone, setAnimationDone] = useState(false);

  useEffect(() => {
    if (!ready || animationDone) return;
    if (reducedMotion) {
      setAnimationDone(true);
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => setAnimationDone(true),
    });

    // Animate label
    tl.to(labelRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "expo.out",
    });

    if (nameRef.current) {
      nameRef.current.innerHTML = "";

      const charSpans: HTMLSpanElement[] = [];

      NAME_LINES.forEach((line) => {
        const lineEl = document.createElement("div");
        lineEl.style.display = "block";

        line.split("").forEach((char) => {
          const wrapper = document.createElement("span");
          wrapper.style.display = "inline-block";
          wrapper.style.overflow = "hidden";
          wrapper.style.verticalAlign = "bottom";

          const inner = document.createElement("span");
          inner.className = "hero-char";
          inner.style.display = "inline-block";
          inner.textContent = char;

          wrapper.appendChild(inner);
          lineEl.appendChild(wrapper);
          charSpans.push(inner);
        });

        nameRef.current!.appendChild(lineEl);
      });

      gsap.set(charSpans, { y: "100%", opacity: 0 });

      tl.to(
        charSpans,
        {
          y: "0%",
          opacity: 1,
          duration: 1.0,
          ease: "expo.out",
          stagger: 0.03,
        },
        "-=0.3"
      );
    }

    // Tagline
    tl.to(
      taglineRef.current,
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "expo.out",
      },
      "-=0.6"
    );

    // CTAs
    tl.to(
      ctasRef.current,
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "expo.out",
      },
      "-=0.4"
    );

    // Socials
    tl.to(
      socialsRef.current,
      {
        opacity: 1,
        duration: 0.6,
        ease: "expo.out",
      },
      "-=0.2"
    );

    // Avatar fade/scale in, roughly alongside the socials
    if (avatarRef.current) {
      tl.to(
        avatarRef.current,
        {
          opacity: 0.7,
          scale: 1,
          duration: 0.6,
          ease: "expo.out",
        },
        "-=0.2"
      );
    }

    // Scroll indicator
    tl.to(
      scrollIndicatorRef.current,
      {
        opacity: 1,
        duration: 0.6,
        ease: "expo.out",
      },
      "-=0.2"
    );

    return () => {
      tl.kill();
    };
  }, [ready, reducedMotion, animationDone]);

  const handleScrollToWork = () => {
    document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScrollToContact = () => {
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
  };

  const initialState = ready || reducedMotion ? {} : { opacity: 0, y: 20 };
  const avatarInitialState =
    ready || reducedMotion ? {} : { opacity: 0, scale: 0.92 };

  return (
    <section
      id="hero"
      className="relative min-h-[100dvh] flex items-center overflow-hidden"
      style={{ minHeight: "600px" }}
    >
      {/* Matrix background */}
      <MatrixRain />

      {/* Content panel */}
      <div
        className="relative z-[1] w-full"
        style={{
          maskImage:
            "linear-gradient(to right, black 80%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, black 80%, transparent 100%)",
        }}
      >
        <div className="container-main py-24">
          <div className="flex flex-col md:flex-row md:items-center gap-10">
            <div
              className="max-w-[55%] max-md:max-w-full p-8 max-md:p-4 -ml-8 max-md:ml-0 order-2 md:order-1"
              style={{ background: "rgba(10,10,10,0.88)", backdropFilter: "blur(4px)" }}
            >
              <div
                ref={labelRef}
                className="section-label mb-4"
                style={initialState}
              >
                FULL STACK DEVELOPER & AI ENGINEER
              </div>

              <h1
                ref={nameRef}
                className="text-[clamp(3rem,8vw,6rem)] font-bold leading-[1.05] tracking-[-0.03em] text-[#F5F5F5] mb-6"
                style={{ fontFamily: "var(--font-display)", ...initialState }}
              >
                {NAME_LINES.map((line) => (
                  <div key={line}>{line}</div>
                ))}
              </h1>

              <p
                ref={taglineRef}
                className="text-[clamp(1.25rem,2.5vw,1.75rem)] font-normal leading-[1.2] tracking-[-0.01em] text-[#A0A0A0] max-w-[600px] mb-8"
                style={initialState}
              >
                Building intelligent web experiences with modern technologies.
              </p>

              <div
                ref={ctasRef}
                className="flex flex-wrap gap-4 mb-8"
                style={initialState}
              >
                <button
                  onClick={handleScrollToWork}
                  className="px-8 py-4 bg-[#00FF41] text-[#0A0A0A] font-medium text-sm rounded transition-all duration-200 hover:translate-y-[-2px] hover:shadow-glow"
                >
                  View My Work
                </button>
                <button
                  onClick={handleScrollToContact}
                  className="px-8 py-4 bg-transparent text-[#F5F5F5] font-medium text-sm rounded border border-[#222222] transition-all duration-200 hover:border-[#333333] hover:translate-y-[-2px]"
                >
                  Contact Me
                </button>
              </div>

              <div
                ref={socialsRef}
                className="flex items-center gap-6"
                style={{ opacity: 0 }}
              >
                <a
                  href="https://github.com/ahmad-mujtaba23"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#A0A0A0] hover:text-[#00FF41] transition-colors duration-200"
                  aria-label="GitHub"
                >
                  <Github size={24} />
                </a>
                <a
                  href="mailto:ahmadmujtaba2312@gmail.com"
                  className="text-[#A0A0A0] hover:text-[#00FF41] transition-colors duration-200"
                  aria-label="Email"
                >
                  <Mail size={24} />
                </a>
                <a
                  href="#"
                  className="text-[#A0A0A0] hover:text-[#00FF41] transition-colors duration-200"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={24} />
                </a>
              </div>
            </div>

            {/* Avatar */}
            <div
              ref={avatarRef}
              className="order-1 md:order-2 w-full max-w-[280px] md:max-w-[340px] mx-auto md:mx-0 md:ml-auto md:mr-12 rounded-2xl overflow-hidden shrink-0"
              style={{ opacity: 0, ...avatarInitialState }}
            >
              <img
                src="/images/avatar.jpg"
                alt="Ahmad Mujtaba"
                className="w-full aspect-square object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[1]"
        style={{ opacity: 0 }}
      >
        <ChevronDown
          size={24}
          className="text-[#666666] animate-pulse-down"
        />
      </div>
    </section>
  );
}