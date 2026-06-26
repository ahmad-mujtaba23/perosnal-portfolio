import { useScrollReveal } from "@/hooks/useScrollReveal";
import {
  Bot,
  Server,
  LayoutDashboard,
  Database,
  Workflow,
} from "lucide-react";

interface Service {
  icon: typeof Bot;
  title: string;
  description: string;
}

const services: Service[] = [
  {
    icon: Bot,
    title: "AI Agents & Automation",
    description:
      "LangChain, custom LLM integrations, workflow orchestration.",
  },
  {
    icon: Server,
    title: "Scalable Backends",
    description:
      "FastAPI, Node.js, microservices, event-driven architectures.",
  },
  {
    icon: LayoutDashboard,
    title: "Modern Frontends",
    description:
      "React, Next.js, real-time dashboards, responsive UIs.",
  },
  {
    icon: Database,
    title: "Data & Infrastructure",
    description: "Postgres, Redis, AWS, Docker, CI/CD pipelines.",
  },
  {
    icon: Workflow,
    title: "Full-Cycle Product Development",
    description: "From discovery to deployment and monitoring.",
  },
];

export function Services() {
  const sectionRef = useScrollReveal<HTMLElement>({ stagger: 0.1 });

  return (
    <section
      id="services"
      ref={sectionRef}
      className="py-[clamp(4rem,10vw,8rem)] bg-[#0A0A0A]"
    >
      <div className="container-main">
        <div data-reveal className="section-label mb-4">
          WHAT I OFFER
        </div>

        <h2
          data-reveal
          className="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.1] tracking-[-0.02em] text-[#F5F5F5] mb-4 max-w-[800px]"
        >
          What I Can Build For You
        </h2>

        <p
          data-reveal
          className="text-[clamp(1rem,1.5vw,1.125rem)] text-[#A0A0A0] leading-[1.6] max-w-[600px] mb-16"
        >
          End-to-end delivery, from a single intelligent agent to a full
          production system.
        </p>

        <div className="flex flex-col">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                data-reveal
                className="group relative grid grid-cols-1 md:grid-cols-[auto_1fr_2fr] gap-4 md:gap-8 items-start md:items-center py-8 border-t border-[#1A1A1A] first:border-t-0"
              >
                {/* Vertical accent rail — the section's signature element.
                    Sits flush left, lights up green on hover/focus of the row. */}
                <span
                  aria-hidden="true"
                  className="hidden md:block absolute left-0 top-0 bottom-0 w-[2px] bg-[#1A1A1A] group-hover:bg-[#00FF41] transition-colors duration-300"
                />

                <div className="flex items-center gap-4 md:pl-6">
                  <span className="font-mono text-xs text-[#666666] tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="w-10 h-10 rounded-lg bg-[#141414] border border-[#222222] flex items-center justify-center text-[#00FF41] group-hover:border-[#00FF41]/40 transition-colors duration-300">
                    <Icon size={18} strokeWidth={1.75} />
                  </div>
                </div>

                <h3 className="text-[clamp(1.125rem,1.5vw,1.375rem)] font-semibold text-[#F5F5F5] leading-[1.3]">
                  {service.title}
                </h3>

                <p className="text-[#A0A0A0] leading-[1.6] text-sm md:text-base">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}