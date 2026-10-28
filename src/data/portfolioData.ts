export type ProjectCategory = "all" | "web" | "games" | "bots"

export interface ProjectImageItem {
  src: string
  label: string
  caption: string
}

export interface ProjectItem {
  id: string
  num: string
  vtName: string
  title: string
  subtitle: string
  windowUrl: string
  category: Exclude<ProjectCategory, "all">
  tags: string[]
  description: string
  features: string[]
  detailText: string
  detailNote: string
  previewType: "single" | "duo" | "mobile"
  overlayIcon: string
  overlayLabel: string
  images: ProjectImageItem[]
}

export interface SkillCategoryItem {
  id: string
  title: string
  icon: string
  badges: { name: string; icon: string }[]
}

export const PROFILE_DATA = {
  firstName: "Steven Floyd",
  lastName: "Sendrijas",
  fullName: "Steven Floyd Sendrijas",
  school: "STI College",
  typedRoles: [
    "Full-Stack Web Developer",
    "Unity 2D Game Developer",
    "React & TypeScript Developer",
    "Mobile App & Bot Developer",
    "IT Student at STI College",
  ],
  tagline:
    "I build practical web, game, and mobile systems focused on clean design, smooth user experience, database-driven functionality, and real-world problem solving.",
  email: "stevensendrijas@gmail.com",
  phone: "09150448104",
  location: "Patag Zone 7, Cagayan de Oro City, Misamis Oriental 9000",
  facebook: "https://www.facebook.com/steven.sendrijas.5",
  instagram: "https://www.instagram.com/itsme_harutoo/",
  github: "https://github.com/steven23lz",
  avatar: "/assets/graduate.jpg",
  certificatePdf: "/assets/certificate.pdf",
}

export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: "trivia-attack",
    num: "01",
    vtName: "project-trivia-attack",
    title: "Trivia Attack — 2D Educational RPG",
    subtitle: "Unity 6 (URP 2D) • C# Turn-Based Quiz RPG",
    windowUrl: "unity://trivia-attack.rpg/world-select",
    category: "games",
    tags: ["Unity 6 (URP 2D)", "C#", "SpriteAnimator", "JSON Data"],
    description:
      "A turn-based pixel-art educational RPG built in Unity 6.5 (URP 2D) and C# where players battle through 5 academic worlds—from Elementary to Doctorate—by answering timed trivia across 6 subjects.",
    features: [
      "1,449 Verified Trivia Questions",
      "5 Worlds & K–12 to Doctorate",
      "5 Game Modes & Boss Rush",
      "18 Tiered Collectible Power-Ups",
      "Custom 8-Frame SpriteAnimator",
      "22 Honours Badges & Chiptune BGM",
    ],
    detailText:
      "Engineered with programmatic C# Editor scene builders (BattleSceneBuilder, MainMenuBuilder, WorldSelectBuilder, GraduationBuilder), a custom frame-accurate SpriteAnimator, 9-sliced pixel UI, and speed-bonus combo multipliers.",
    detailNote:
      "Role: Lead game developer, C# gameplay systems, custom sprite state machines, and UI architecture.",
    previewType: "duo",
    overlayIcon: "fas fa-gamepad",
    overlayLabel: "Battle & Main Menu Views",
    images: [
      {
        src: "/assets/trivia-battle.png",
        label: "Screen 1: Combat Quiz",
        caption:
          "Trivia Attack Battle Scene — World 4 Globe Garden encounter with speed-bonus timer and 3 equipped power-ups",
      },
      {
        src: "/assets/trivia-menu.png",
        label: "Screen 2: Main Menu",
        caption:
          "Trivia Attack Main Menu — Doctorate Quill showcase, 6 game mode cards, and 22/22 Honours completion",
      },
    ],
  },
  {
    id: "overview-streaming",
    num: "02",
    vtName: "project-overview-streaming",
    title: "OverView — Movie, TV & Anime Streaming",
    subtitle: "React 18 • TypeScript • HLS Stream Proxy",
    windowUrl: "https://overview-streaming.app/watch",
    category: "web",
    tags: ["React 18", "TypeScript", "Node.js", "PostgreSQL", "HLS.js"],
    description:
      "A full-stack streaming and discovery platform unifying Movies, TV Series, and Anime with an Automated Video-Source Discovery Engine, multi-server failover, and real-time watch history.",
    features: [
      "3-Tier Stream Discovery Engine",
      "Native 1080p HLS.js Playback",
      "Backend CORS Stream Proxy",
      "Movies, TV Shows & Anime Catalog",
      "JWT Auth & Watchlist Sync",
      "Episode Resume Timestamps",
    ],
    detailText:
      "Built with React 18, TypeScript, Express, and PostgreSQL. Automatically probes native .m3u8 HLS streams, routes CORS-protected manifests through a backend proxy, and fails over across VidSrc, VidLink, and SuperEmbed.",
    detailNote:
      "Role: Full-stack architecture, HLS stream resolver proxy, PostgreSQL schema, and React UI.",
    previewType: "duo",
    overlayIcon: "fas fa-film",
    overlayLabel: "Catalog & HLS Player Views",
    images: [
      {
        src: "/assets/overview-home.png",
        label: "Screen 1: Catalog",
        caption:
          "OverView Discovery Catalog — Featured hero banner and unified Movies, TV Series & Anime browse grid",
      },
      {
        src: "/assets/overview-player.png",
        label: "Screen 2: HLS Player",
        caption:
          "OverView Universal HLS Player — Automated Stream Discovery Engine active with 1080p source selector",
      },
    ],
  },
  {
    id: "spotibai-discord-bot",
    num: "03",
    vtName: "project-spotibai-bot",
    title: "SpotiBAI — Discord Music & Bisaya AI Bot",
    subtitle: "Discord.js v14 • 48kHz Opus • Bisaya AI",
    windowUrl: "discord://mga-bushit/dota-pisot/spotibai",
    category: "bots",
    tags: ["TypeScript", "Discord.js v14", "@discordjs/voice", "PostgreSQL", "Prisma"],
    description:
      "A production Discord voice DJ and Bisaya AI companion (SpotiBAI) featuring Jockie-style bulk multi-song queueing, real-time FFmpeg 48kHz Opus audio filters, and natural-language server memory.",
    features: [
      "Bulk 'e' & Comma Song Parser",
      "BadiBrain Bisaya AI Companion",
      "48kHz Opus Voice & FFmpeg Filters",
      "Interactive Playback Controls",
      "PostgreSQL & Prisma Playlists",
      "Live Web DJ Controller & Themes",
    ],
    detailText:
      "Combines @discordjs/voice Opus streaming and real-time FFmpeg DSP filters (Club Master Remixer, Slowed + Reverb, Nightcore, 8D) with BadiBrain conversational Bisaya NLP (!badi / !p) and persistent Prisma playlists.",
    detailNote:
      "Role: Creator & backend developer — voice state machines, bulk query parser, AI memory, and Prisma ORM.",
    previewType: "duo",
    overlayIcon: "fab fa-discord",
    overlayLabel: "Live Discord & DJ Controller Views",
    images: [
      {
        src: "/assets/discord-bot.png",
        label: "Screen 1: Live Discord VC",
        caption:
          "SpotiBAI Live in Discord (#Dota Pisot / Mga Bushit) — Active voice session with Haruto and queue embeds",
      },
      {
        src: "/assets/discord-dashboard.png",
        label: "Screen 2: DJ Controller",
        caption:
          "SpotiBAI Live DJ Controller — Real-time FFmpeg DSP audio filter presets and Adaptive Theme Engine",
      },
    ],
  },
  {
    id: "business-permit",
    num: "04",
    vtName: "project-business-permit",
    title: "Business Permit System",
    subtitle: "Laravel • PHP • MySQL • GovTech Workflow",
    windowUrl: "https://lgu-permits.gov.local/dashboard",
    category: "web",
    tags: ["PHP", "Laravel", "MySQL", "Blade"],
    description:
      "A web-based licensing platform that streamlines business registration, permit applications, status tracking, and payment management for local government use cases.",
    features: [
      "Resident & Business Registration",
      "Permit Application Workflow",
      "Real-time Application Tracking",
      "Payment Management",
      "Admin Approval Process",
      "Secure User Authentication",
    ],
    detailText:
      "Built around a clear permit workflow: applicants submit business details, admins review requirements, payments are tracked, and users can monitor application status.",
    detailNote: "Role: Full-stack development, database flow, and UI layout.",
    previewType: "single",
    overlayIcon: "fas fa-image",
    overlayLabel: "Screenshot Preview",
    images: [
      {
        src: "/assets/Business Permit.png",
        label: "Admin & Permit Portal",
        caption: "Business Permit System — Administrative dashboard and permit workflow",
      },
    ],
  },
  {
    id: "clinic-management",
    num: "05",
    vtName: "project-clinic-management",
    title: "Clinic Management System",
    subtitle: "Laravel • React • PostgreSQL • Healthcare",
    windowUrl: "https://enlogada-clinic.app/patient-portal",
    category: "web",
    tags: ["Laravel", "PostgreSQL", "React", "Tailwind"],
    description:
      "A full clinic operations system for Enlogada Ultrasound & Diagnostic Clinic. Manages patient records, service requests, appointments, cashier monitoring, and multi-role staff access.",
    features: [
      "Patient & Admin Dashboards",
      "Staff Account Management",
      "Service Request & Results",
      "Appointment Scheduling",
      "Cashier Monitoring",
      "Reports & Patient Records",
    ],
    detailText:
      "Designed as an end-to-end clinical operations workflow for Enlogada Ultrasound & Diagnostic Clinic, showing the staff login flow and patient-facing diagnostic dashboard.",
    detailNote:
      "Focus: Role-based access, patient records, appointments, and cashier monitoring.",
    previewType: "duo",
    overlayIcon: "fas fa-images",
    overlayLabel: "Login and Patient Views",
    images: [
      {
        src: "/assets/Patient.png",
        label: "Screen 1: Patient Portal",
        caption: "Clinic Management System — Patient records and appointment dashboard",
      },
      {
        src: "/assets/Login.png",
        label: "Screen 2: Staff Login",
        caption: "Enlogada Ultrasound & Diagnostic Clinic — Staff login screen",
      },
    ],
  },
  {
    id: "cinebai-mobile",
    num: "06",
    vtName: "project-cinebai-mobile",
    title: "CineBai — Cinema Ticketing App",
    subtitle: "React Native • Node.js • QR Seat Booking",
    windowUrl: "cinebai://mobile-app/seat-reservation",
    category: "games",
    tags: ["React Native", "Node.js", "Express", "PostgreSQL"],
    description:
      "A mobile-first cinema ticketing system that lets users browse movies, select seats, manage bookings, process payments, and enter cinemas using QR code scanning.",
    features: [
      "Movie Browsing & Details",
      "Interactive Seat Booking",
      "Ticket Management",
      "Payment Flow",
      "QR-Based Cinema Entry",
      "Mobile-Friendly Interface",
    ],
    detailText:
      "A mobile ticketing flow designed around movie discovery, seat selection, payments, booking records, and QR-based cinema entry.",
    detailNote:
      "Role: Mobile UI, API planning, ticket flow, and database-backed features.",
    previewType: "mobile",
    overlayIcon: "fas fa-mobile-alt",
    overlayLabel: "Mobile App Preview",
    images: [
      {
        src: "/assets/mobilee.png",
        label: "Mobile Seat & QR Flow",
        caption: "CineBai — Mobile cinema seat reservation and QR ticketing screens",
      },
    ],
  },
]

export const SKILL_CATEGORIES: SkillCategoryItem[] = [
  {
    id: "frontend",
    title: "Frontend Development",
    icon: "fas fa-palette",
    badges: [
      { name: "React 18", icon: "fab fa-react" },
      { name: "TypeScript", icon: "fas fa-code" },
      { name: "shadcn/ui", icon: "fas fa-layer-group" },
      { name: "Tailwind CSS", icon: "fas fa-wind" },
      { name: "Framer Motion", icon: "fas fa-bolt" },
      { name: "HTML5 & CSS3", icon: "fab fa-html5" },
      { name: "JavaScript", icon: "fab fa-js-square" },
    ],
  },
  {
    id: "backend",
    title: "Backend & Bots",
    icon: "fas fa-server",
    badges: [
      { name: "Node.js", icon: "fab fa-node-js" },
      { name: "Express", icon: "fas fa-route" },
      { name: "Laravel", icon: "fas fa-layer-group" },
      { name: "PHP", icon: "fab fa-php" },
      { name: "Discord.js v14", icon: "fab fa-discord" },
      { name: "@discordjs/voice", icon: "fas fa-headphones" },
    ],
  },
  {
    id: "game-mobile",
    title: "Game & Mobile Development",
    icon: "fas fa-gamepad",
    badges: [
      { name: "Unity 6 (URP 2D)", icon: "fab fa-unity" },
      { name: "C# Game Systems", icon: "fas fa-chess-rook" },
      { name: "React Native", icon: "fas fa-mobile-alt" },
      { name: "2D Sprite Animation", icon: "fas fa-film" },
    ],
  },
  {
    id: "database",
    title: "Database & ORM",
    icon: "fas fa-database",
    badges: [
      { name: "PostgreSQL", icon: "fas fa-database" },
      { name: "MySQL", icon: "fas fa-table" },
      { name: "Prisma ORM", icon: "fas fa-project-diagram" },
    ],
  },
  {
    id: "languages",
    title: "Programming Languages",
    icon: "fas fa-code",
    badges: [
      { name: "TypeScript", icon: "fas fa-file-code" },
      { name: "C#", icon: "fas fa-terminal" },
      { name: "Java", icon: "fab fa-java" },
      { name: "JavaScript", icon: "fab fa-js-square" },
      { name: "PHP", icon: "fab fa-php" },
      { name: "Python", icon: "fab fa-python" },
      { name: "SQL", icon: "fas fa-database" },
    ],
  },
  {
    id: "tools",
    title: "Frameworks & Tools",
    icon: "fas fa-tools",
    badges: [
      { name: "Git", icon: "fab fa-git-alt" },
      { name: "GitHub", icon: "fab fa-github" },
      { name: "Vite", icon: "fas fa-rocket" },
      { name: "Docker", icon: "fab fa-docker" },
      { name: "HLS.js & FFmpeg", icon: "fas fa-play-circle" },
      { name: "VS Code", icon: "fas fa-terminal" },
    ],
  },
]

export const TECH_MARQUEE_ITEMS = [
  "React 18",
  "TypeScript",
  "shadcn/ui",
  "Tailwind CSS",
  "Framer Motion",
  "Unity 6.5 (URP 2D)",
  "C#",
  "Node.js & Express",
  "Laravel & PHP",
  "Discord.js v14",
  "@discordjs/voice",
  "PostgreSQL",
  "Prisma ORM",
  "MySQL",
  "React Native",
  "HLS.js",
  "Java (Oracle Certified)",
  "Git & GitHub",
]
