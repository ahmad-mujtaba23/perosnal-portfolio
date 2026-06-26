import { useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Github, Mail, MapPin, Phone, Send } from "lucide-react";

export function Contact() {
  const sectionRef = useScrollReveal<HTMLElement>({ stagger: 0.1 });
  const [formState, setFormState] = useState<"idle" | "sending" | "sent">("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setFormState("sending");

    // Get the access key from environment variables
    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

    // Fallback if key is missing (optional)
    if (!accessKey) {
      console.error("Missing Web3Forms access key. Set VITE_WEB3FORMS_ACCESS_KEY in .env");
      alert("Email service is not configured. Please try again later.");
      setFormState("idle");
      return;
    }

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_key: accessKey,
          name: formData.name,
          email: formData.email,
          message: formData.message,
          subject: `Portfolio Contact from ${formData.name}`,
          from_name: formData.name,
          replyto: formData.email,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setFormState("sent");
        setFormData({ name: "", email: "", message: "" });
        // Reset after 5 seconds so user can send again
        setTimeout(() => {
          setFormState("idle");
        }, 5000);
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setFormState("idle");
      alert('Failed to send message. Please try again.');
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="py-[clamp(4rem,10vw,8rem)] bg-[#0A0A0A]"
    >
      <div className="container-main">
        <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-16">
          {/* Info */}
          <div>
            <div data-reveal className="section-label mb-4">
              CONTACT
            </div>
            <h2
              data-reveal
              className="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.1] tracking-[-0.02em] text-[#F5F5F5] mb-6"
            >
              Let's Work Together
            </h2>
            <p
              data-reveal
              className="text-[#A0A0A0] leading-[1.6] mb-10"
            >
              Have a project in mind or want to discuss opportunities? I'm
              always open to new challenges.
            </p>

            <div data-reveal className="space-y-4 mb-8">
              <a
                href="mailto:ahmadmujtaba2312@gmail.com"
                className="flex items-center gap-3 text-[#A0A0A0] hover:text-[#00FF41] transition-colors duration-200"
              >
                <Mail size={18} />
                <span className="font-mono text-sm">
                  ahmadmujtaba2312@gmail.com
                </span>
              </a>
              <a
                href="tel:+923457139062"
                className="flex items-center gap-3 text-[#A0A0A0] hover:text-[#00FF41] transition-colors duration-200"
              >
                <Phone size={18} />
                <span className="font-mono text-sm">+92 345 7139062</span>
              </a>
              <div className="flex items-center gap-3 text-[#A0A0A0]">
                <MapPin size={18} />
                <span className="font-mono text-sm">Lahore, Pakistan</span>
              </div>
              <a
                href="https://github.com/ahmad-mujtaba23"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-[#A0A0A0] hover:text-[#00FF41] transition-colors duration-200"
              >
                <Github size={18} />
                <span className="font-mono text-sm">
                  github.com/ahmad-mujtaba23
                </span>
              </a>
            </div>
          </div>

          {/* Form */}
          <div data-reveal>
            {formState === "sent" ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="text-[#00FF41] text-lg font-semibold mb-2">
                    Message sent! 🎉
                  </div>
                  <p className="text-[#A0A0A0]">
                    I'll get back to you within 24 hours.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-xs font-mono text-[#666666] uppercase tracking-wider mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-[#161616] border border-[#222222] rounded-lg text-[#F5F5F5] placeholder-[#666666] outline-none transition-all duration-200 focus:border-[#00FF41] focus:shadow-glow"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-mono text-[#666666] uppercase tracking-wider mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-[#161616] border border-[#222222] rounded-lg text-[#F5F5F5] placeholder-[#666666] outline-none transition-all duration-200 focus:border-[#00FF41] focus:shadow-glow"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-xs font-mono text-[#666666] uppercase tracking-wider mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 bg-[#161616] border border-[#222222] rounded-lg text-[#F5F5F5] placeholder-[#666666] outline-none transition-all duration-200 focus:border-[#00FF41] focus:shadow-glow resize-none"
                    placeholder="Tell me about your project..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={formState === "sending"}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#00FF41] text-[#0A0A0A] font-medium text-sm rounded transition-all duration-200 hover:translate-y-[-2px] hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {formState === "sending" ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send size={16} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}