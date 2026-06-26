import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useRef, useEffect } from "react";
import { experiences } from "@/data/experience";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export function Experience() {
  const sectionRef = useScrollReveal<HTMLElement>({ stagger: 0.15 });
  const timelineRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    // Timeline line draw
    if (timelineRef.current) {
      gsap.fromTo(
        timelineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top center",
            end: "bottom center",
            scrub: true,
          },
        }
      );
    }

    // Cards slide in
    if (cardsRef.current) {
      const cards = cardsRef.current.querySelectorAll(".exp-card");
      gsap.from(cards, {
        x: 30,
        opacity: 0,
        duration: 0.8,
        ease: "expo.out",
        stagger: 0.15,
        scrollTrigger: {
          trigger: cardsRef.current,
          start: "top center+=10%",
          toggleActions: "play none none reset",
        },
      });
    }

    return () => {
      ScrollTrigger.getAll()
        .filter(
          (st) =>
            st.vars.trigger === sectionRef.current ||
            st.vars.trigger === cardsRef.current
        )
        .forEach((st) => st.kill());
    };
  }, [reducedMotion, sectionRef]);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="py-[clamp(4rem,10vw,8rem)] bg-[#0A0A0A]"
    >
      <div className="container-main">
        <div data-reveal className="section-label mb-4">
          EXPERIENCE
        </div>
        <h2
          data-reveal
          className="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.1] tracking-[-0.02em] text-[#F5F5F5] mb-16"
        >
          Where I've Worked
        </h2>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-0 md:left-4 top-0 bottom-0 w-[1px] bg-[#222222] overflow-hidden max-md:hidden">
            <div
              ref={timelineRef}
              className="absolute inset-0 w-full bg-[#00FF41] origin-top"
              style={{ transform: "scaleY(0)" }}
            />
          </div>

          {/* Cards */}
          <div ref={cardsRef} className="space-y-8">
            {experiences.map((exp, index) => (
              <div
                key={index}
                className="exp-card relative ml-0 md:ml-12 pl-6 md:pl-8"
              >
                {/* Timeline dot */}
                <div
                  className="absolute left-[-4px] md:left-[calc(1rem-4px)] top-6 w-2 h-2 rounded-full bg-[#222222] border border-[#0A0A0A] max-md:hidden"
                  data-dot
                />

                <div className="bg-[#161616] rounded-lg p-6 border-l-2 border-transparent hover:border-[#00FF41] transition-all duration-200">
                  <div className="flex flex-wrap items-baseline gap-2 mb-2">
                    <span className="font-mono text-xs text-[#666666]">
                      {exp.startDate}
                      {exp.endDate ? ` – ${exp.endDate}` : ""}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-[#F5F5F5] mb-1">
                    {exp.company}
                  </h3>
                  <div className="text-[#00FF41] text-sm font-medium mb-3">
                    {exp.role}
                    {exp.location ? ` — ${exp.location}` : ""}
                  </div>

                  <ul className="space-y-2">
                    {exp.bulletPoints.map((point, i) => (
                      <li
                        key={i}
                        className="text-sm text-[#A0A0A0] leading-relaxed pl-4 relative before:content-['▸'] before:absolute before:left-0 before:text-[#333333]"
                      >
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
