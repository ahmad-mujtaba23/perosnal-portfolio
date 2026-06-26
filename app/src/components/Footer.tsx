import { Github, Mail, Linkedin, ArrowUp } from "lucide-react";
import { useState, useEffect } from "react";

export function Footer() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-[#222222] bg-[#0A0A0A] py-16">
      <div className="container-main">
        <div className="flex flex-col items-center text-center">
          <h3
            className="text-2xl font-bold text-[#F5F5F5] mb-2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Ahmad Mujtaba
          </h3>
          <p className="text-xs text-[#666666] font-mono uppercase tracking-wider mb-6">
            Full Stack Developer & AI Engineer
          </p>

          {/* Social icons */}
          <div className="flex items-center gap-6 mb-8">
            <a
              href="https://github.com/ahmad-mujtaba23"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#666666] hover:text-[#00FF41] transition-colors duration-200"
              aria-label="GitHub"
            >
              <Github size={20} />
            </a>
            <a
              href="mailto:ahmadmujtaba2312@gmail.com"
              className="text-[#666666] hover:text-[#00FF41] transition-colors duration-200"
              aria-label="Email"
            >
              <Mail size={20} />
            </a>
            <a
              href="#"
              className="text-[#666666] hover:text-[#00FF41] transition-colors duration-200"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} />
            </a>
          </div>

          <p className="text-xs text-[#666666]">
            &copy; 2026 Ahmad Mujtaba. All rights reserved.
          </p>
        </div>
      </div>

      {/* Back to top button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-[#161616] rounded-full flex items-center justify-center text-[#A0A0A0] hover:text-[#00FF41] hover:bg-[#1a1a1a] transition-all duration-200 border border-[#222222] shadow-lg"
          aria-label="Back to top"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </footer>
  );
}
