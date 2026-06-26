export interface ExperienceItem {
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  type: string;
  bulletPoints: string[];
}

export const experiences: ExperienceItem[] = [
  {
    company: "MetisCore (AI Based Solutions)",
    role: "Software Developer",
    location: "Remote, Lahore",
    startDate: "July 2025",
    endDate: "June 2026",
    type: "Remote",
    bulletPoints: [
      "Contributed to application workflows and backend systems using Express.js and Next.js",
      "Worked with API integrations and validated data exchange between services",
      "Analyzed logs and debugged system behavior in AI-enabled environments",
      "Assisted in development of warehouse management system",
    ],
  },
  {
    company: "Lucidbee (Marketing Agency)",
    role: "Full Stack Developer",
    location: "Remote, Lahore",
    startDate: "July 2024",
    endDate: "June 2025",
    type: "Remote",
    bulletPoints: [
      "Developed and deployed multiple client websites using React.js, Express.js, and Next.js",
      "Built scalable frontend interfaces and integrated backend APIs for dynamic functionality",
      "Delivered production-ready solutions for clients including MetisCore",
      "Developed cross-platform mobile interfaces using React Native",
      "Integrated REST APIs and backend services for dynamic mobile functionality",
    ],
  },
  {
    company: "VintaFix Solutions (Marketing Agency)",
    role: "Software Developer",
    location: "Remote, Lahore",
    startDate: "July 2025",
    endDate: "November 2025",
    type: "Remote",
    bulletPoints: [
      "Developed and validated AI-enhanced e-commerce application including chatbot-assisted workflows",
      "Integrated REST APIs for frontend-backend communication",
      "Evaluated LLM responses for consistency, accuracy, and edge case scenarios",
      "Verified end-to-end workflows including checkout systems and AI-assisted interactions",
    ],
  },
  {
    company: "ASHTech (Automation B2B Startup)",
    role: "Software Developer (Backend & Web)",
    location: "Lahore",
    startDate: "",
    endDate: "",
    type: "On-site",
    bulletPoints: [
      "Built and structured company website ensuring responsiveness and usability",
      "Developed backend logic and validated system workflows before deployment",
      "Collaborated with team to debug and improve system performance",
      "Designed brand assets contributing to product presentation and identity",
    ],
  },
];
