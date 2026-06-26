import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useRef, useEffect, useState } from "react";
import { Download } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: 40, suffix: "%", label: "Faster Feature Delivery" },
  { value: 10, suffix: "+", label: "Projects Shipped to Production" },
  { value: 98, suffix: "%", label: "Of Manual Workflows Automated." },
];

const RESUME_PATH = "/resume/Ahmad-Mujtaba-Resume.pdf";
const RESUME_DOWNLOAD_FILENAME = "Ahmad-Mujtaba-Resume.pdf";

function AnimatedNumber({
  value,
  suffix,
  triggered,
}: {
  value: number;
  suffix: string;
  triggered: boolean;
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!triggered) return;
    let frame: number;
    const duration = 1500;
    const start = performance.now();

    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setDisplay(Math.round(eased * value));
      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [triggered, value]);

  return (
    <span>
      {display}
      {suffix}
    </span>
  );
}

export function About() {
  const sectionRef = useScrollReveal<HTMLElement>({ stagger: 0.15 });
  const imageRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [statsTriggered, setStatsTriggered] = useState(false);

  useEffect(() => {
    if (!sectionRef.current || reducedMotion) return;

    // Image clip-path reveal
    if (imageRef.current) {
      gsap.fromTo(
        imageRef.current,
        { clipPath: "inset(0 100% 0 0)" },
        {
          clipPath: "inset(0 0% 0 0)",
          duration: 1.0,
          ease: "expo.out",
          scrollTrigger: {
            trigger: imageRef.current,
            start: "top bottom-=10%",
            toggleActions: "play none none reset",
          },
        }
      );
    }

    // Stats trigger
    if (statsRef.current) {
      ScrollTrigger.create({
        trigger: statsRef.current,
        start: "top bottom-=10%",
        onEnter: () => setStatsTriggered(true),
        onLeaveBack: () => setStatsTriggered(false),
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [reducedMotion, sectionRef]);

  const handleDownloadResume = () => {
    const link = document.createElement("a");
    link.href = RESUME_PATH;
    link.download = RESUME_DOWNLOAD_FILENAME;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-[clamp(4rem,10vw,8rem)] bg-[#0A0A0A]"
    >
      <div className="container-main">
        <div className="grid grid-cols-1 md:grid-cols-[100%_80%] gap-12 items-start">
          {/* Image
          <div
            ref={imageRef}
            className="w-full max-w-[300px] md:max-w-none mx-auto md:mx-0 rounded-2xl overflow-hidden"
            style={{ clipPath: "inset(0 100% 0 0)" }}
          >
            <img
              src="/images/avatar.jpg"
              alt="Ahmad Mujtaba avatar"
              className="w-full aspect-square object-cover"
              loading="lazy"
            />
          </div> */}

          {/* Content */}
          <div>
            <div data-reveal className="section-label mb-4">
              ABOUT ME
            </div>

            <h2
              data-reveal
              className="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.1] tracking-[-0.02em] text-[#F5F5F5] mb-8"
            >
              The Developer Behind the Code
            </h2>

            <div data-reveal className="space-y-4 text-[#A0A0A0] leading-[1.6] mb-10">
              <p>
                I architect full stack applications with built in AI capabilities 
                from intelligent automation and LLM powered agents to high performance 
                APIs and real time data pipelines. I turn complex requirements into scalable, 
                production ready systems that reduce operational friction and accelerate 
                decision making.
              </p>
              <p>
                Building the right one for your business <b>
                starts with a single conversation.</b>
              </p>
            </div>

            {/* Stats */}
            <div
              ref={statsRef}
              className="grid grid-cols-3 gap-6 mb-10"
              data-reveal
            >
              {stats.map((stat) => (
                <div key={stat.label} className="text-center md:text-left">
                  <div className="text-[clamp(2.5rem,2.5vw,1.75rem)] font-semibold text-[#F5F5F5] mb-1">
                    <AnimatedNumber
                      value={stat.value}
                      suffix={stat.suffix}
                      triggered={statsTriggered}
                    />
                  </div>
                  <div className="text-xs text-[#666666] font-mono uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div data-reveal className="flex justify-center">
              <button
                onClick={handleDownloadResume}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#00FF41] text-[#0A0A0A] font-medium text-sm rounded border border-[#222222] transition-all duration-200 hover:border-[#333333] hover:translate-y-[-2px]"
              >
                <Download size={16} />
                Download Resume
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}