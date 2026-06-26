export interface Project {
  title: string;
  tags: string[];
  description: string;
  metrics?: string;
  githubUrl?: string;
  liveUrl?: string;
  image: string;
}

export const projects: Project[] = [
  {
    title: "AI Data Analytics Assistant",
    tags: ["Python", "React", "TypeScript", "FastAPI", "LangChain", "Docker", "Redis"],
    description:
      "Production-ready AI-powered analytics platform for uploading, cleaning, and querying datasets using natural language. Features Celery async task queue for processing large CSV files (up to 5GB), automated data cleaning pipeline, and SQL generation via self-hosted LLM.",
    metrics: "98% reduction in manual data prep time",
    githubUrl: "https://github.com/ahmad-mujtaba23",
    image: "/images/project-1.jpg",
  },
  {
    title: "AI-Powered Expense Tracker",
    tags: ["React Native", "Expo", "TypeScript", "OpenAI Vision API", "SQLite"],
    description:
      "Cross-platform mobile app with receipt scanning and automated expense categorization using OpenAI Vision API. Features offline storage, interactive spending charts, and real-time expense tracking.",
    githubUrl: "https://github.com/ahmad-mujtaba23",
    image: "/images/project-2.jpg",
  },
  {
    title: "Warehouse Management App",
    tags: ["Express.js", "MySQL", "Figma"],
    description:
      "Backend APIs with CRUD operations, inventory management workflows, and role-based access control. Designed UI/UX in Figma before implementation.",
    githubUrl: "https://github.com/ahmad-mujtaba23",
    image: "/images/project-3.jpg",
  },
  {
    title: "Server-Client Cloud System",
    tags: ["C#", "Client-Server Architecture"],
    description:
      "Client-server architecture with structured communication protocols, error handling, and simulated failure scenarios for robustness testing.",
    githubUrl: "https://github.com/ahmad-mujtaba23",
    image: "/images/project-4.jpg",
  },
];
