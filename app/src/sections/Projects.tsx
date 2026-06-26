import { useScrollReveal } from "@/hooks/useScrollReveal";
import { projects } from "@/data/projects";
import { Github, ExternalLink } from "lucide-react";

export function Projects() {
  const sectionRef = useScrollReveal<HTMLElement>({ stagger: 0.1 });

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="py-[clamp(4rem,10vw,8rem)] bg-[#0A0A0A]"
    >
      <div className="container-main">
        <div data-reveal className="section-label mb-4">
          PROJECTS
        </div>
        <h2
          data-reveal
          className="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.1] tracking-[-0.02em] text-[#F5F5F5] mb-16"
        >
          Things I've Built
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <div
              key={project.title}
              data-reveal
              className="group bg-[#161616] rounded-xl overflow-hidden transition-all duration-200 hover:translate-y-[-4px] hover:shadow-glow"
            >
              {/* Image */}
              <div className="aspect-video overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-[#F5F5F5] mb-2">
                  {project.title}
                </h3>

                <p className="text-sm text-[#A0A0A0] leading-relaxed mb-4">
                  {project.description}
                </p>

                {project.metrics && (
                  <div className="text-xs font-mono text-[#00FF41] mb-4 px-3 py-1.5 bg-[rgba(0,255,65,0.08)] rounded-full inline-block">
                    {project.metrics}
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-[#1a1a1a] rounded-full text-xs font-mono text-[#A0A0A0] transition-all duration-200 hover:bg-[rgba(0,255,65,0.12)] hover:text-[#00FF41] hover:scale-105 cursor-default"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="flex items-center gap-4">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#666666] hover:text-[#00FF41] transition-colors duration-200"
                      aria-label={`${project.title} GitHub`}
                    >
                      <Github size={18} />
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#666666] hover:text-[#00FF41] transition-colors duration-200"
                      aria-label={`${project.title} Live Demo`}
                    >
                      <ExternalLink size={18} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
