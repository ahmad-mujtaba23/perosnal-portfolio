import { useScrollReveal } from "@/hooks/useScrollReveal";
import TechStackGlobe from "../TechStackGlobe/src";
import { techItems } from "@/data/techItems";

export function Skills() {
  const sectionRef = useScrollReveal<HTMLElement>({ stagger: 0.1 });

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="py-[clamp(4rem,10vw,8rem)] bg-[#0A0A0A]"
    >
      <div className="container-main">
        <div data-reveal className="section-label mb-4">
          SKILLS
        </div>
        <h2
          data-reveal
          className="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.1] tracking-[-0.02em] text-[#F5F5F5] mb-[clamp(2rem,6vw,5rem)]"
        >
          The Stack I Ship With
        </h2>

        <div data-reveal className="w-full">
        <TechStackGlobe
          items={techItems}
          hintText="click a tech to explore · hover to identify"
          categoryColors={{
            "AI/ML": "#a78bfa",
            Backend: "#34d399",
            Frontend: "#f472b6",
            "Cloud & DevOps": "#38bdf8",
            Databases: "#fb923c",
          }}
        />
        </div>
      </div>
    </section>
  );
}