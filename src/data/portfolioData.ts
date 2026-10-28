export type ProjectCategory = "all" | "web" | "games" | "bots"

export interface ProjectItem {
  id: string
  index: string
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
}

export interface SkillDomain {
  index: string
  id: string
  title: string
  summary: string
  appliedIn: string
  items: string[]
}

export const PROFILE_DATA = {
  name: "Steven Floyd F. Sendrijas",
  shortName: "Steven Sendrijas",
  handle: "steven23lz",
  title: "Full-Stack Software & Unity Game Engineer",
  location: "Cebu, Philippines",
  timezone: "UTC+08:00",
  education: "BS in Information Technology",
  summary:
    "I design and build full-stack web applications, 2D RPG systems in Unity 6, and real-time voice bots. My work spans programmatic C# game scenes, multi-tier HLS media streaming proxies, low-latency 48kHz Opus audio pipelines, and relational clinical & municipal systems.",
  email: "sendrijassteven@gmail.com",
  phone: "+63 991 204 3889",
  github: "https://github.com/steven23lz",
  avatar: "/assets/graduate.jpg",
  certificatePdf: "/assets/certificate.pdf",
}

export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: "spotibai-discord-bot",
    index: "01",
    vtName: "project-spotibai-bot",
    title: "SpotiBAI — Discord Voice DJ, Bulk Music Engine & Bisaya AI",
    shortTitle: "SpotiBAI Discord Bot",
    subtitle: "TypeScript 5.7 • Discord.js v14 • @discordjs/voice • BadiBrain AI • Prisma",
    category: "bots",
    categoryLabel: "Voice & AI Systems",
    featured: true,
    isNew: true,
    year: "2026",
    role: "Creator & Systems Architect",
    description:
      "Production Discord music and conversational AI bot (SpotiBAI#0456) built for active gaming communities. Combines a Jockie-style multi-track bulk query parser (!p / /play), a real-time FFmpeg 48kHz Opus DSP filter engine, and 'Badi'—a context-aware Bisaya/Bislish AI companion with server memory and natural-language DJ control.",
    architectureSummary:
      "Architected around per-guild isolated voice sessions (GuildMusicSession), an FFmpeg AudioFilterEngine supporting live DSP presets (Club Master Remixer, Slowed + Reverb, Nightcore, 8D Binaural), a zero-interruption TTS guard that never cuts off active music, an MCP server (discordMcpServer.ts), and PostgreSQL + Prisma ORM playlist persistence.",
    highlights: [
      "BadiBrain natural-language Bisaya/Bislish engine (!badi) with pronoun history resolution, server-scoped memory, and voice channel commands",
      "BulkParser supporting comma and standalone 'e' delimiters with boundary protection for artist/song titles and 3-way concurrent resolution",
      "Real-time FFmpeg AudioFilterEngine (dj_club, slowed_reverb, nightcore, 8d, vaporwave, bassboost) + Live Web DJ Controller dashboard",
      "11 dynamic server color themes (ThemeManager) including Adaptive Smart DJ mode and lrclib.net synchronized lyrics",
    ],
    metrics: [
      { label: "Voice Engine", value: "48kHz Opus + FFmpeg DSP" },
      { label: "AI & NLP", value: "BadiBrain Bisaya Context" },
      { label: "Persistence", value: "PostgreSQL + Prisma ORM" },
    ],
    techStack: [
      "TypeScript 5.7",
      "Discord.js v14",
      "@discordjs/voice",
      "FFmpeg DSP Filters",
      "BadiBrain AI",
      "PostgreSQL",
      "Prisma ORM",
      "Model Context Protocol",
    ],
    images: [
      {
        src: "/assets/discord-bot.png",
        caption:
          "SpotiBAI Live in Discord (#Dota Pisot / Mga Bushit) — Active voice session with Haruto, track skip/timeout handling, and !p cure queue embed",
      },
      {
        src: "/assets/discord-dashboard.png",
        caption:
          "SpotiBAI Live Web DJ Controller & FFmpeg AudioFilterEngine — Club Master Remixer DSP pipeline and Adaptive Theme Engine",
      },
    ],
  },
  {
    id: "trivia-attack",
    index: "02",
    vtName: "project-trivia-attack",
    title: "Trivia Attack — 2D Educational Turn-Based RPG",
    shortTitle: "Trivia Attack RPG",
    subtitle: "Unity 6.5 (URP 2D) • C# • Programmatic Scene Builders • 1,449 Questions",
    category: "games",
    categoryLabel: "Unity 2D Game",
    featured: true,
    isNew: true,
    year: "2026",
    role: "Lead Game Developer",
    description:
      "A turn-based pixel-art educational RPG built in Unity 6.5 (URP 2D) and C#. Players guide Quill from Elementary school through Doctorate graduation across 5 worlds, battling monsters and bosses by answering timed questions across 6 academic subjects with speed multipliers and 18 tiered power-ups.",
    architectureSummary:
      "Built entirely through deterministic C# Editor scene builders (BattleSceneBuilder, MainMenuBuilder, WorldSelectBuilder, GraduationBuilder) rather than brittle manual prefabs. Features a custom frame-accurate SpriteAnimator driving 8-frame character state machines (Idle, Attack, Hurt, Victory, Defeat) and a procedural WAV chiptune synthesizer.",
    highlights: [
      "1,449 verified trivia questions across Math, Science, History, English, Geography, and General Knowledge with Easy/Medium/Hard difficulty scaling",
      "5 academic worlds culminating in K-12, Bachelor's, Master's, and Doctorate graduation ceremonies that evolve Quill's academic regalia",
      "5 game modes: Adventure Campaign, Subject Practice, 60-Second Time Attack, 1-HP Survival, and 5-Boss Rush Gauntlet",
      "18 collectible power-ups across 4 rarity tiers (50/50, Freeze Timer, Double Damage, Phoenix Feather, Scholar's Crown) and 22 Honours badges",
    ],
    metrics: [
      { label: "Question Bank", value: "1,449 Across 6 Subjects" },
      { label: "Progression", value: "5 Worlds & 4 Degrees" },
      { label: "Systems", value: "18 Power-Ups / 22 Badges" },
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
          "World 4 Globe Garden Boss Battle — Quill vs. Boss Globulous with speed-bonus multiplier, 9-slice answer cards, and tiered power-ups",
      },
      {
        src: "/assets/trivia-menu.png",
        caption:
          "Main Menu Campus — Doctorate Quill character showcase, 6 mode cards, and 22/22 Honours badge tracker",
      },
    ],
  },
  {
    id: "overview-streaming",
    index: "03",
    vtName: "project-overview-streaming",
    title: "OverView — Movie, TV Series & Anime Streaming Platform",
    shortTitle: "OverView Streaming",
    subtitle: "React 18 • TypeScript • Node.js & Express • PostgreSQL • HLS.js",
    category: "web",
    categoryLabel: "Full-Stack Web",
    featured: true,
    isNew: true,
    year: "2026",
    role: "Full-Stack Architect",
    description:
      "A unified entertainment discovery and streaming platform for Movies, TV Series, and Anime featuring an Automated Video-Source Discovery Engine that resolves native 1080p HLS (.m3u8) streams, proxies CORS-restricted manifests, and automatically fails over to multi-server embed providers.",
    architectureSummary:
      "Decoupled React 18 + TypeScript SPA and Node.js/Express REST API backed by PostgreSQL. Integrates TMDB and Consumet metadata providers, JWT authentication with bcrypt hashing, persistent watch history with episode resume timestamps, and automated Vitest + Playwright E2E test suites.",
    highlights: [
      "3-tier Automated Video-Source Discovery Engine: native HLS.js playback -> server-side CORS stream proxy -> multi-provider embed failover (VidSrc, VidLink, SuperEmbed)",
      "Unified media catalog across Trending Movies, multi-season TV Series, and sub/dub Anime episodes with real-time search",
      "Authenticated user accounts with PostgreSQL Watchlist management and automatic episode timestamp synchronization",
      "Verified with Vitest + Supertest API integration tests and Playwright headless Chromium end-to-end checks",
    ],
    metrics: [
      { label: "Stream Resolver", value: "3-Tier Auto Failover" },
      { label: "Playback", value: "HLS.js 1080p + Proxy" },
      { label: "Storage", value: "PostgreSQL + JWT Auth" },
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
          "OverView Discovery Interface — Featured spotlight banner, unified Movies/TV/Anime catalog, and live ratings",
      },
      {
        src: "/assets/overview-player.png",
        caption:
          "Universal HLS Video Player — Automated Stream Discovery Engine active with 1080p source selector and episode list",
      },
    ],
  },
  {
    id: "clinic-management",
    index: "04",
    vtName: "project-clinic-management",
    title: "Enlogada Ultrasound & Diagnostic Clinic System",
    shortTitle: "Enlogada Clinic System",
    subtitle: "Laravel • React • PostgreSQL • Role-Based Clinical Workflow",
    category: "web",
    categoryLabel: "Healthcare Web",
    featured: false,
    year: "2025",
    role: "Full-Stack Developer",
    description:
      "A clinical operations and patient records platform built for Enlogada Ultrasound & Diagnostic Clinic to manage patient intake, appointment triage, ultrasound diagnostic reporting, and multi-role staff permissions.",
    architectureSummary:
      "Constructed with a Laravel API backend, PostgreSQL relational database, and a React + Tailwind CSS clinical dashboard enforcing role-based access control for physicians, sonographers, and reception staff.",
    highlights: [
      "Digital patient records with searchable diagnostic history and structured ultrasound report templates",
      "Live appointment scheduling and front-desk triage queue to minimize patient wait times",
      "Role-based access control (RBAC) separating administrative, clinical, and reception workflows",
    ],
    metrics: [
      { label: "Organization", value: "Enlogada Clinic" },
      { label: "Stack", value: "Laravel + React" },
      { label: "Security", value: "PostgreSQL RBAC" },
    ],
    techStack: [
      "Laravel",
      "React",
      "PostgreSQL",
      "Tailwind CSS",
      "REST API",
      "Role-Based Auth",
    ],
    images: [
      {
        src: "/assets/Patient.png",
        caption:
          "Patient Records & Triage Dashboard — Clinical history lookup and appointment workflow",
      },
      {
        src: "/assets/Login.png",
        caption:
          "Enlogada Ultrasound & Diagnostic Clinic Portal — Role-based staff sign-in",
      },
    ],
  },
  {
    id: "cinebai-mobile",
    index: "05",
    vtName: "project-cinebai-mobile",
    title: "CineBai — Mobile Cinema Seat Reservation App",
    shortTitle: "CineBai Mobile App",
    subtitle: "React Native • Node.js & Express • PostgreSQL • Mobile Ticketing",
    category: "games",
    categoryLabel: "Mobile App",
    featured: false,
    year: "2025",
    role: "Mobile & Backend Developer",
    description:
      "Cross-platform mobile cinema booking application enabling moviegoers to browse screenings, inspect interactive auditorium seat maps in real time, lock seat selections, and generate digital QR tickets.",
    architectureSummary:
      "Built with React Native for iOS/Android clients communicating with a Node.js, Express, and PostgreSQL backend that uses transactional row locking to prevent concurrent double-bookings.",
    highlights: [
      "Interactive theater seat matrix displaying real-time seat states (Available, Selected, Reserved)",
      "ACID transactional seat reservation pipeline in PostgreSQL preventing race-condition double bookings",
      "Showtime filtering by cinema hall, date, and format with instant digital ticket generation",
    ],
    metrics: [
      { label: "Client", value: "React Native" },
      { label: "API", value: "Node.js + Express" },
      { label: "Booking", value: "Transactional Seat Lock" },
    ],
    techStack: [
      "React Native",
      "Node.js",
      "Express",
      "PostgreSQL",
      "Mobile UI",
      "REST API",
    ],
    images: [
      {
        src: "/assets/mobilee.png",
        caption:
          "CineBai Mobile Screens — Now Showing catalog, showtime selector, interactive seat map, and e-ticket summary",
      },
    ],
  },
  {
    id: "business-permit",
    index: "06",
    vtName: "project-business-permit",
    title: "Municipal Business Permit & Licensing Portal",
    shortTitle: "Business Permit Portal",
    subtitle: "PHP • Laravel • MySQL • Blade • E-Governance Workflow",
    category: "web",
    categoryLabel: "E-Governance Web",
    featured: false,
    year: "2024",
    role: "Full-Stack Developer",
    description:
      "An e-governance web portal that digitizes municipal business permit applications, renewals, document verification, and automated regulatory fee assessments for local government licensing offices.",
    architectureSummary:
      "Developed on PHP and Laravel with a normalized MySQL database and Blade templates, implementing multi-step municipal approval queues and audit trail logging.",
    highlights: [
      "Digital application and renewal workflow replacing manual paper-based municipal routing",
      "Automated computation of business tax brackets, regulatory fees, and clearance requirements",
      "Administrative review dashboard with real-time status tracking and printable permit certificates",
    ],
    metrics: [
      { label: "Sector", value: "Municipal Licensing" },
      { label: "Backend", value: "PHP + Laravel" },
      { label: "Database", value: "MySQL Relational" },
    ],
    techStack: ["PHP", "Laravel", "MySQL", "Blade", "Bootstrap", "JavaScript"],
    images: [
      {
        src: "/assets/Business Permit.png",
        caption:
          "Municipal Business Permit System — Licensing officer dashboard and permit approval queue",
      },
    ],
  },
]

export const SKILL_DOMAINS: SkillDomain[] = [
  {
    index: "01",
    id: "frontend",
    title: "Frontend Architecture & Interface Design",
    summary:
      "Component-driven web interfaces with native browser view transitions,HLS media playback, and responsive layouts.",
    appliedIn: "OverView, Enlogada Clinic, Portfolio v2",
    items: [
      "React 18",
      "TypeScript 5.7",
      "shadcn/ui",
      "Tailwind CSS",
      "Framer Motion",
      "View Transitions API",
      "HLS.js",
      "HTML5 / CSS3",
    ],
  },
  {
    index: "02",
    id: "backend-voice",
    title: "Backend Services, Real-Time Voice & AI Systems",
    summary:
      "REST APIs, CORS stream proxies, 48kHz Opus voice pipelines, FFmpeg real-time DSP audio filters, and NLP intent routing.",
    appliedIn: "SpotiBAI (Badi), OverView API, Business Permit",
    items: [
      "Node.js & Express",
      "Discord.js v14",
      "@discordjs/voice",
      "FFmpeg Audio DSP",
      "PHP & Laravel",
      "JWT & RBAC Auth",
      "Model Context Protocol (MCP)",
      "Java (Oracle Certified)",
    ],
  },
  {
    index: "03",
    id: "game-mobile",
    title: "2D Game Engines & Cross-Platform Mobile",
    summary:
      "Deterministic C# Unity scene builders, frame-accurate sprite state machines, procedural audio, and mobile apps.",
    appliedIn: "Trivia Attack (Unity 6.5), CineBai Mobile",
    items: [
      "Unity 6.5 (URP 2D)",
      "C# Systems & Editor Tooling",
      "Custom SpriteAnimator",
      "9-Slice Pixel UI",
      "Procedural WAV Synthesis",
      "React Native",
    ],
  },
  {
    index: "04",
    id: "data-infra",
    title: "Relational Databases, Testing & Deployment",
    summary:
      "Normalized schema design, transactional locking, ORM migrations, automated E2E browser verification, and CI/CD.",
    appliedIn: "All 6 Production Systems",
    items: [
      "PostgreSQL",
      "Prisma ORM",
      "MySQL",
      "Vitest & Supertest",
      "Playwright E2E",
      "Docker",
      "Git & GitHub",
      "Vercel",
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
  "C# Scene Builders",
  "Node.js & Express",
  "Discord.js v14",
  "@discordjs/voice",
  "FFmpeg DSP Filters",
  "PostgreSQL",
  "Prisma ORM",
  "HLS.js Streaming",
  "Laravel & PHP",
  "React Native",
  "MySQL",
  "Playwright E2E",
  "Vitest",
  "Docker",
]

export const CERTIFICATE_DATA = {
  title: "Java Fundamentals — Course Completion Certificate",
  issuer: "Oracle Academy",
  date: "June 19, 2024",
  credentialId: "Oracle Academy Official Record",
  description:
    "Awarded by Oracle Academy upon successful completion of the Java Fundamentals curriculum covering object-oriented programming, data structures, control flow, exception handling, and modular software design.",
  pdfUrl: "/assets/certificate.pdf",
  skillsVerified: [
    "Object-Oriented Programming (OOP)",
    "Java Core Class Libraries",
    "Data Structures & Control Flow",
    "Exception Handling & Debugging",
    "Modular Software Design",
  ],
}
