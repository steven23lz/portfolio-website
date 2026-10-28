export type ProjectCategory = "all" | "web" | "games" | "bots"

export interface ProjectItem {
  id: string
  vtName: string
  title: string
  shortTitle: string
  subtitle: string
  category: Exclude<ProjectCategory, "all">
  categoryLabel: string
  featured?: boolean
  isNew?: boolean
  year: string
  role: string
  description: string
  architectureSummary: string
  highlights: string[]
  metrics: { label: string; value: string }[]
  techStack: string[]
  images: { src: string; caption: string }[]
  accentColor: string
  repoHint?: string
}

export interface SkillGroup {
  id: string
  title: string
  subtitle: string
  iconName: string
  accent: string
  skills: { name: string; level: string }[]
}

export const PROFILE_DATA = {
  name: "Steven Floyd Sendrijas",
  handle: "@steven23lz",
  title: "Full-Stack Developer & Game Engineer",
  roles: [
    "Full-Stack Web Developer",
    "Unity 2D Game Developer",
    "React & TypeScript Engineer",
    "Backend & Database Architect",
    "Discord Bot & Audio Systems Builder",
  ],
  location: "Cebu, Philippines",
  education: "BS in Information Technology",
  bio: "I architect and build full-stack web platforms, interactive Unity 2D games, and real-time backend systems. From automated HLS media streaming engines and low-latency Discord Opus voice bots to 1,449-question educational RPGs and clinical platforms, I focus on resilient architecture, fluid motion, and polished user experiences.",
  email: "sendrijassteven@gmail.com",
  phone: "+63 991 204 3889",
  github: "https://github.com/steven23lz",
  linkedin: "https://www.linkedin.com/",
  facebook: "https://www.facebook.com/",
  avatar: "/assets/graduate.jpg",
  certificatePdf: "/assets/certificate.pdf",
}

export const HERO_STATS = [
  { value: "6+", label: "Production Systems & Games", detail: "Web, Mobile, Unity & Bots" },
  { value: "1,449+", label: "RPG Trivia Questions", detail: "Across 6 Academic Subjects" },
  { value: "15+", label: "Core Technologies", detail: "React, TS, Unity C#, Node, Laravel" },
  { value: "100%", label: "End-to-End Ownership", detail: "UI/UX, APIs, DB & Deployment" },
]

export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: "trivia-attack",
    vtName: "project-trivia-attack",
    title: "Trivia Attack — 2D Educational Trivia RPG",
    shortTitle: "Trivia Attack RPG",
    subtitle: "Turn-Based Pixel-Art Trivia RPG in Unity 6.5 (URP 2D)",
    category: "games",
    categoryLabel: "Unity 2D Game",
    featured: true,
    isNew: true,
    year: "2026",
    role: "Lead Game Developer & Systems Architect",
    description:
      "A turn-based pixel-art educational RPG built in Unity 6.5 (URP 2D) and C# where players battle through 5 academic worlds—from Elementary Gardens to Doctorate Dimensions—by answering timed trivia across 6 subjects with combo multipliers and 18 tiered power-ups.",
    architectureSummary:
      "Engineered entirely with programmatic C# scene builders (BattleSceneBuilder, MainMenuBuilder, WorldSelectBuilder, GraduationBuilder) and a custom frame-accurate SpriteAnimator driving 8-frame horizontal sprite sheets (Idle, Attack, Hurt, Victory, Defeat). Includes a procedural chiptune WAV synthesizer and 9-sliced pixel UI.",
    highlights: [
      "1,449 verified trivia questions across Math, Science, History, English, Geography, and General Knowledge with Easy/Medium/Hard tiers",
      "5 distinct academic worlds culminating in K-12, Bachelor's, Master's, and Doctorate graduation ceremonies with custom gown evolutions",
      "5 playable modes: Adventure Campaign, Subject Practice, 60s Time Attack, 1-HP Survival, and 5-Boss Rush Gauntlet",
      "18 collectible power-ups across 4 rarity tiers (50/50, Freeze Timer, Double Damage, Second Chance, Phoenix Feather, Scholar's Crown) & 22 Honours achievements",
    ],
    metrics: [
      { label: "Question Bank", value: "1,449 Questions" },
      { label: "Game Content", value: "5 Worlds / 5 Modes" },
      { label: "Collectibles", value: "18 Power-Ups / 22 Badges" },
    ],
    techStack: [
      "Unity 6.5 (URP 2D)",
      "C#",
      "Custom SpriteAnimator",
      "9-Slice UI System",
      "TextMeshPro",
      "Procedural WAV Audio",
      "JSON Data Pipeline",
    ],
    images: [
      {
        src: "/assets/trivia-battle.png",
        caption:
          "World 4 Globe Garden Boss Encounter — Quill vs. Boss Globulous with speed-bonus timer, combo meter, and 3 equipped power-ups",
      },
      {
        src: "/assets/trivia-menu.png",
        caption:
          "Main Menu Campus — Doctorate Quill showcase, 6 game mode cards, and 22/22 Honours completion tracker",
      },
    ],
    accentColor: "from-amber-500/20 via-orange-500/15 to-cyan-500/20",
  },
  {
    id: "overview-streaming",
    vtName: "project-overview-streaming",
    title: "OverView — Movie, TV & Anime Streaming Platform",
    shortTitle: "OverView Streaming",
    subtitle: "Full-Stack Media Discovery & Automated HLS Playback Engine",
    category: "web",
    categoryLabel: "Web Platform",
    featured: true,
    isNew: true,
    year: "2026",
    role: "Full-Stack Architect & Developer",
    description:
      "A full-stack entertainment discovery and streaming platform unifying Movies, TV Series, and Anime into a single cinema-grade interface with an Automated Video-Source Discovery Engine, multi-server failover, and real-time watch history.",
    architectureSummary:
      "Built with React 18, TypeScript, Node.js/Express, and PostgreSQL. The backend stream resolver probes Consumet & TMDB metadata, validates native HLS (.m3u8) manifests with custom Referer headers through a server-side CORS proxy, and automatically fails over across VidSrc, VidLink, and SuperEmbed providers.",
    highlights: [
      "3-tier Automated Video-Source Discovery Engine: native HLS.js 1080p stream -> backend CORS stream proxy -> multi-server embed failover",
      "Unified catalog spanning Trending Movies, Popular TV Series (season/episode selector), and sub/dub Anime episodes",
      "JWT authentication with bcrypt password hashing, persistent Watchlist, and automatic episode resume timestamp syncing",
      "Comprehensive automated verification suite using Vitest + Supertest for API integration and Playwright for E2E browser testing",
    ],
    metrics: [
      { label: "Stream Engine", value: "3-Tier Auto Failover" },
      { label: "Playback", value: "HLS.js 1080p + Proxy" },
      { label: "Persistence", value: "PostgreSQL + JWT" },
    ],
    techStack: [
      "React 18",
      "TypeScript",
      "Node.js",
      "Express",
      "PostgreSQL",
      "HLS.js",
      "Tailwind CSS",
      "TMDB & Consumet API",
      "Playwright",
    ],
    images: [
      {
        src: "/assets/overview-home.png",
        caption:
          "OverView Discovery Catalog — Featured hero banner, category tabs (Movies, TV Shows, Anime), and live ratings",
      },
      {
        src: "/assets/overview-player.png",
        caption:
          "Universal HLS Video Player — Automated Stream Discovery Engine active with 1080p HLS source selector and episode sidebar",
      },
    ],
    accentColor: "from-cyan-500/25 via-sky-500/15 to-violet-500/20",
  },
  {
    id: "discord-music-bot",
    vtName: "project-discord-music-bot",
    title: "Jockie-Style Discord Music Bot",
    shortTitle: "Discord Music Bot",
    subtitle: "Multi-Track Bulk Query Parser & Low-Latency Opus Voice Engine",
    category: "bots",
    categoryLabel: "Bots & Audio",
    featured: true,
    isNew: true,
    year: "2026",
    role: "Backend & Systems Developer",
    description:
      "A high-performance Discord music bot built with TypeScript 5.7, Discord.js v14, and @discordjs/voice featuring a Jockie-inspired bulk song parser that queues multiple tracks in a single command using 'e' or comma delimiters.",
    architectureSummary:
      "Combines @discordjs/voice Opus 48kHz audio pipelines (yt-dlp + FFmpeg + prism-media) with per-guild QueueManager state machines, interactive Discord button collectors, and PostgreSQL + Prisma ORM for persistent user playlists and server configurations.",
    highlights: [
      "Custom bulk query parser supporting both 'e' separator and comma-separated song lists (e.g., `/play query: Blinding Lights e Starboy, The Hills`)",
      "Low-latency 48kHz Opus voice streaming via @discordjs/voice, play-dl, and yt-dlp with automatic stream recovery",
      "Rich interactive Now Playing embeds with live graphical progress bars, Pause/Skip/Loop/Shuffle/Stop buttons, and queue pagination",
      "PostgreSQL + Prisma ORM persistence storing custom user playlists, guild prefixes, DJ roles, and 24/7 voice channel settings",
    ],
    metrics: [
      { label: "Query Engine", value: "Bulk 'e' & CSV Parser" },
      { label: "Audio Pipeline", value: "48kHz Opus Stream" },
      { label: "Database", value: "PostgreSQL + Prisma" },
    ],
    techStack: [
      "TypeScript 5.7",
      "Discord.js v14",
      "@discordjs/voice",
      "PostgreSQL",
      "Prisma ORM",
      "yt-dlp & FFmpeg",
      "Docker",
      "Vitest",
    ],
    images: [
      {
        src: "/assets/discord-bot.png",
        caption:
          "Discord #music-commands Showcase — Bulk `/play` command parsing 4 songs simultaneously with interactive Now Playing controls",
      },
    ],
    accentColor: "from-indigo-500/25 via-violet-500/15 to-purple-500/20",
  },
  {
    id: "clinic-management",
    vtName: "project-clinic-management",
    title: "Enlogada Ultrasound & Diagnostic Clinic System",
    shortTitle: "Clinic Management System",
    subtitle: "Patient Records, Diagnostic Triage & Scheduling Platform",
    category: "web",
    categoryLabel: "Web Platform",
    featured: false,
    year: "2025",
    role: "Full-Stack Web Developer",
    description:
      "A comprehensive clinical management platform custom-built for Enlogada Ultrasound & Diagnostic Clinic to digitize patient intake, ultrasound diagnostic reporting, appointment scheduling, and multi-role staff operations.",
    architectureSummary:
      "Architected with a Laravel backend API, PostgreSQL relational database, and a responsive React + Tailwind CSS dashboard enforcing strict role-based access control for doctors, sonographers, and front-desk staff.",
    highlights: [
      "Centralized digital patient chart histories with searchable ultrasound imaging findings and printable diagnostic PDFs",
      "Real-time appointment queue and triage status tracking reducing front-desk wait times",
      "Role-based authentication and audit logging for clinicians, receptionists, and administrators",
    ],
    metrics: [
      { label: "Client", value: "Enlogada Clinic" },
      { label: "Architecture", value: "Laravel + React" },
      { label: "Database", value: "PostgreSQL RBAC" },
    ],
    techStack: [
      "Laravel",
      "React",
      "PostgreSQL",
      "Tailwind CSS",
      "RESTful API",
      "Role-Based Auth",
    ],
    images: [
      {
        src: "/assets/Patient.png",
        caption: "Clinic Patient Management Dashboard — Patient records, diagnostic queue, and history lookup",
      },
      {
        src: "/assets/Login.png",
        caption: "Enlogada Ultrasound & Diagnostic Clinic Portal — Secure staff authentication interface",
      },
    ],
    accentColor: "from-emerald-500/20 via-teal-500/15 to-cyan-500/20",
  },
  {
    id: "cinebai-mobile",
    vtName: "project-cinebai-mobile",
    title: "CineBai — Mobile Cinema Ticketing App",
    shortTitle: "CineBai Ticketing App",
    subtitle: "Cross-Platform Mobile Seat Reservation & E-Ticket Experience",
    category: "games",
    categoryLabel: "Mobile App",
    featured: false,
    year: "2025",
    role: "Mobile & Backend Developer",
    description:
      "A sleek cross-platform mobile cinema ticketing application allowing moviegoers to explore now-showing films, inspect real-time auditorium seat layouts, reserve seats, and generate instant QR e-tickets.",
    architectureSummary:
      "Developed using React Native for fluid iOS/Android interfaces paired with a Node.js, Express, and PostgreSQL backend that prevents double-booking through transactional seat locking.",
    highlights: [
      "Interactive theater seat matrix with real-time availability states (Available, Selected, Reserved)",
      "Transactional seat reservation workflow backed by PostgreSQL to eliminate race-condition double bookings",
      "Streamlined movie discovery feed with showtime filtering, cinema hall selection, and digital ticket wallet",
    ],
    metrics: [
      { label: "Platform", value: "React Native" },
      { label: "Backend", value: "Node.js + Express" },
      { label: "Concurrency", value: "ACID Seat Locking" },
    ],
    techStack: [
      "React Native",
      "Node.js",
      "Express",
      "PostgreSQL",
      "Mobile UI/UX",
      "REST API",
    ],
    images: [
      {
        src: "/assets/mobilee.png",
        caption: "CineBai Mobile Screens — Movie catalog, showtime picker, interactive seat matrix, and checkout",
      },
    ],
    accentColor: "from-rose-500/20 via-pink-500/15 to-amber-500/20",
  },
  {
    id: "business-permit",
    vtName: "project-business-permit",
    title: "Municipal Business Permit & Licensing System",
    shortTitle: "Business Permit System",
    subtitle: "E-Governance Permit Processing & Automated Compliance Portal",
    category: "web",
    categoryLabel: "Web Platform",
    featured: false,
    year: "2024",
    role: "Full-Stack Developer",
    description:
      "An automated municipal business permit and licensing web system that streamlines new business registrations, permit renewals, document verification, and fee assessments for local government workflows.",
    architectureSummary:
      "Built on PHP and Laravel with a normalized MySQL schema and Blade templates, implementing multi-stage approval pipelines and automated regulatory fee computation.",
    highlights: [
      "End-to-end digital application pipeline for new business registrations and annual permit renewals",
      "Automated computation of municipal fees, surcharges, and clearance requirements",
      "Real-time application status tracking and administrative approval dashboard with printable permit certificates",
    ],
    metrics: [
      { label: "Domain", value: "E-Governance" },
      { label: "Framework", value: "Laravel + PHP" },
      { label: "Database", value: "MySQL Relational" },
    ],
    techStack: ["PHP", "Laravel", "MySQL", "Blade", "Bootstrap", "JavaScript"],
    images: [
      {
        src: "/assets/Business Permit.png",
        caption: "Business Permit System — Administrative dashboard and permit application workflow",
      },
    ],
    accentColor: "from-sky-500/20 via-blue-500/15 to-indigo-500/20",
  },
]

export const SKILL_GROUPS: SkillGroup[] = [
  {
    id: "frontend",
    title: "Modern Frontend & UI Engineering",
    subtitle: "Reactive interfaces, design systems & hardware-accelerated motion",
    iconName: "Layout",
    accent: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
    skills: [
      { name: "React 18 & Hooks", level: "Advanced" },
      { name: "TypeScript 5", level: "Advanced" },
      { name: "shadcn/ui & Radix Primitives", level: "Advanced" },
      { name: "Tailwind CSS", level: "Advanced" },
      { name: "Framer Motion & View Transitions", level: "Advanced" },
      { name: "HTML5 / CSS3 / HLS.js", level: "Advanced" },
    ],
  },
  {
    id: "backend",
    title: "Backend Architecture & APIs",
    subtitle: "Scalable REST servers, stream proxies & real-time bots",
    iconName: "Server",
    accent: "text-violet-400 bg-violet-500/10 border-violet-500/30",
    skills: [
      { name: "Node.js & Express", level: "Advanced" },
      { name: "PHP & Laravel", level: "Advanced" },
      { name: "Discord.js v14 & @discordjs/voice", level: "Advanced" },
      { name: "JWT & RBAC Authentication", level: "Advanced" },
      { name: "Java (Oracle Certified)", level: "Proficient" },
      { name: "Python Automation", level: "Proficient" },
    ],
  },
  {
    id: "game-mobile",
    title: "Game Dev & Mobile Engineering",
    subtitle: "2D RPG systems, custom sprite animators & cross-platform apps",
    iconName: "Gamepad2",
    accent: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    skills: [
      { name: "Unity 6.5 (URP 2D)", level: "Advanced" },
      { name: "C# Game Systems & Editor Tools", level: "Advanced" },
      { name: "2D Sprite Animation & 9-Slice UI", level: "Advanced" },
      { name: "React Native Mobile Dev", level: "Proficient" },
      { name: "Procedural Audio & State Machines", level: "Proficient" },
    ],
  },
  {
    id: "database-devops",
    title: "Databases, Testing & DevOps",
    subtitle: "Relational modeling, ORM pipelines, containerization & CI/CD",
    iconName: "Database",
    accent: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    skills: [
      { name: "PostgreSQL", level: "Advanced" },
      { name: "Prisma ORM", level: "Advanced" },
      { name: "MySQL", level: "Advanced" },
      { name: "Vitest & Playwright E2E", level: "Proficient" },
      { name: "Docker & Git / GitHub", level: "Proficient" },
      { name: "Vercel & Cloud Deployment", level: "Advanced" },
    ],
  },
]

export const TECH_MARQUEE_ITEMS = [
  "React 18",
  "TypeScript 5.7",
  "shadcn/ui",
  "Tailwind CSS",
  "Framer Motion",
  "Unity 6.5 URP 2D",
  "C# Game Engine",
  "Node.js & Express",
  "PostgreSQL",
  "Prisma ORM",
  "Discord.js v14",
  "@discordjs/voice",
  "HLS.js Streaming",
  "Laravel & PHP",
  "React Native",
  "MySQL",
  "Playwright E2E",
  "Vitest",
  "Docker",
  "Vercel",
]

export const CERTIFICATE_DATA = {
  title: "Java Fundamentals — Course Completion Certificate",
  issuer: "Oracle Academy",
  date: "June 19, 2024",
  credentialType: "Official Academic Certification",
  description:
    "Awarded by Oracle Academy for successfully completing the Java Fundamentals curriculum covering Object-Oriented Programming (OOP), data structures, control flow, exception handling, and software engineering principles.",
  pdfUrl: "/assets/certificate.pdf",
  skillsVerified: [
    "Object-Oriented Programming (OOP)",
    "Java Syntax & Core Class Libraries",
    "Data Structures & Algorithms",
    "Exception Handling & Debugging",
    "Modular Software Design",
  ],
}
