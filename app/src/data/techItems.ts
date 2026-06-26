import type { TechItem } from "../TechStackGlobe/src";

export const techItems: TechItem[] = [
  // ===== AI/ML =====
  {
    name: "LangChain",
    category: "AI/ML",
    slug: "langchain",
    description: "Framework for orchestrating LLM-powered applications with chains, agents, and retrieval systems.",
    whyUsed: "To generate SQL from natural language with embedding-based column selection.",
    myExperience: "Built an AI Data Analytics Assistant using LangChain with self-hosted Ollama (Qwen3). Implemented embedding-based column selection for datasets with 500+ columns to avoid LLM context overflow. Added SQL validation and error correction.",
  },
  {
    name: "Ollama",
    category: "AI/ML",
    slug: "ollama",
    description: "Self-hosted LLM runtime for running open-source models locally or on-premise.",
    whyUsed: "Used Qwen3 for SQL generation without external API dependencies.",
    myExperience: "Deployed Qwen3 via Ollama in the AI Data Analytics Assistant, integrated with LangChain for natural language to SQL conversion with rigorous validation.",
  },
  {
    name: "OpenAI",
    category: "AI/ML",
    slug: "openai",
    description: "API access to GPT-4, embeddings, and vision models.",
    whyUsed: "Vision API for receipt scanning in the mobile expense tracker.",
    myExperience: "Integrated OpenAI Vision API into a React Native expense tracker to automate expense entry from receipt images with accurate categorization.",
  },

  // ===== Backend =====
  {
    name: "FastAPI",
    category: "Backend",
    slug: "fastapi",
    description: "Modern Python web framework for building high-performance APIs.",
    whyUsed: "Async support for processing large CSV uploads (up to 5GB) with JWT auth.",
    myExperience: "Built the production-ready backend for the AI Data Analytics Assistant with JWT authentication, per-user dataset isolation, and a Celery task queue for non-blocking processing.",
  },
  {
    name: "Node.js",
    category: "Backend",
    slug: "nodedotjs",
    description: "JavaScript runtime for building scalable, event-driven server-side applications.",
    whyUsed: "Used across multiple projects for REST APIs and full-stack development.",
    myExperience: "Developed backend systems using Express.js and Next.js API routes. Built warehouse management systems and AI-enabled e-commerce applications with REST API integrations.",
  },
  {
    name: "Python",
    category: "Backend",
    slug: "python",
    description: "Versatile language powering data processing, AI/ML, and backend services.",
    whyUsed: "Primary language for AI agent development, data pipeline orchestration, and FastAPI backends.",
    myExperience: "Used Python extensively for the AI Data Analytics Assistant – from data cleaning pipelines (handling missing values, date standardisation, deduplication) to integrating LangChain and Celery.",
  },
  {
    name: "Celery",
    category: "Backend",
    slug: "celery",
    description: "Distributed task queue for handling asynchronous workloads.",
    whyUsed: "To process large files in the background without blocking the API.",
    myExperience: "Designed a Celery async task queue with Upstash Redis for the AI Data Analytics Assistant. Handled CSV files up to 5GB, reducing manual data prep time by 98%.",
  },

  // ===== Frontend =====
  {
    name: "React",
    category: "Frontend",
    slug: "react",
    description: "UI library for building component-driven, interactive user interfaces.",
    whyUsed: "Declarative model with rich ecosystem for complex UIs.",
    myExperience: "Built and maintained multiple production dashboards with real-time data updates. Used across client websites, the AI Analytics platform, and mobile apps.",
  },
  {
    name: "Next.js",
    category: "Frontend",
    slug: "nextdotjs",
    description: "React framework with server-side rendering, static generation, and API routes.",
    whyUsed: "Hybrid rendering for SEO benefits with app-like interactivity.",
    myExperience: "Developed full-stack applications with API routes and server-side rendering. Deployed production solutions for clients including MetisCore and Lucidbee.",
  },
  {
    name: "React Native",
    category: "Frontend",
    slug: "reactnative",
    description: "Framework for building native mobile apps using React and JavaScript.",
    whyUsed: "Cross-platform development for iOS and Android with a single codebase.",
    myExperience: "Built the AI-Powered Expense Tracker using React Native and Expo. Integrated OpenAI Vision API for receipt scanning and SQLite for offline storage.",
  },

  // ===== Cloud & DevOps =====
  {
    name: "Docker",
    category: "Cloud & DevOps",
    slug: "docker",
    description: "Containerization platform for consistent development and deployment.",
    whyUsed: "Ensures parity between development and production environments.",
    myExperience: "Containerized the AI Data Analytics Assistant and deployed using CI/CD pipelines across free cloud tiers: Render, Supabase, Upstash, Cloudflare R2, and Oracle Cloud.",
  },
  {
    name: "GitHub Actions",
    category: "Cloud & DevOps",
    slug: "githubactions",
    description: "CI/CD automation for building, testing, and deploying applications.",
    whyUsed: "Automated deployment pipeline to multiple cloud providers.",
    myExperience: "Set up GitHub Actions for the AI Analytics project to deploy to Render, Supabase, Upstash, Cloudflare R2, and Oracle Cloud with continuous integration.",
  },

  // ===== Databases =====
  {
    name: "PostgreSQL",
    category: "Databases",
    slug: "postgresql",
    description: "Open-source relational database with ACID compliance and JSON support.",
    whyUsed: "Handles transactional workloads with strong consistency.",
    myExperience: "Used Supabase (PostgreSQL) for the AI Analytics platform to store user data and analytics results. Designed schemas for multi-tenant SaaS applications.",
  },
  {
    name: "Redis",
    category: "Databases",
    slug: "redis",
    description: "In-memory data store for caching, real-time messaging, and session management.",
    whyUsed: "Used as a message broker for Celery task queues.",
    myExperience: "Used Upstash Redis as the broker for Celery task queues in the AI Analytics platform. Also used for caching and session management.",
  },
];