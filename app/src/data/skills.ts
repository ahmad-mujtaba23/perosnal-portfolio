export interface SkillCategory {
  category: string;
  skills: string[];
}

export const skillCategories: SkillCategory[] = [
  {
    category: "AI & Intelligent Systems",
    skills: [
      "RAG Applications",
      "Prompt Engineering",
      "LLM Integration",
      "AI Output Evaluation",
      "OpenAI Vision API",
    ],
  },
  {
    category: "Full Stack Development",
    skills: [
      "React.js",
      "Express.js",
      "Next.js",
      "TypeScript",
      "Supabase",
      "REST APIs",
      "React Navigation",
      "SQLite",
    ],
  },
  {
    category: "Backend & Software Engineering",
    skills: [
      "Python",
      "C++",
      "C#",
      "FastAPI",
      "Client-Server Architecture",
    ],
  },
  {
    category: "AI Automation & Data Processing",
    skills: [
      "Data Cleaning Automation",
      "Workflow Design",
      "SQL (MySQL)",
      "Data Flow Analysis",
    ],
  },
  {
    category: "Tools & Platforms",
    skills: [
      "Postman",
      "Git",
      "Figma",
      "Docker",
      "GitHub Actions",
      "Grafana Cloud",
      "Cloudflare R2",
      "Oracle Cloud",
    ],
  },
  {
    category: "Core Competencies",
    skills: [
      "API Integration",
      "Backend Development",
      "Data Analysis",
      "UI/UX",
      "Project Management",
    ],
  },
];
