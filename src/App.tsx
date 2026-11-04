import React, { useEffect, useRef, useState } from "react"
import { flushSync } from "react-dom"
import {
  EXPERIENCE_TIMELINE,
  PROFILE_DATA,
  PROJECTS_DATA,
  ProjectCategory,
  ProjectItem,
  SKILL_CATEGORIES,
  TECH_MARQUEE_ITEMS,
} from "./data/portfolioData"

type ThemePreference = "light" | "dark" | "light dark"
type ScreenMode = "0" | "1" | "split"

interface ModalState {
  type: "project" | "certificate"
  project?: ProjectItem
  initialImageIndex: number
  certTab?: "image" | "pdf"
}

const ASK_PROMPTS = [
  {
    q: "Who is Steven Sendrijas?",
    title: "steven floyd sendrijas",
    sub: "BSIT student at STI College Cagayan de Oro & full-stack web, Unity 2D game, and Discord AI bot developer.",
    lines: [
      "→ Builds database-driven web platforms, 2D educational RPGs, and real-time voice/AI bots.",
      "→ Certified in Java Fundamentals by Oracle Academy (Dec 2025).",
      "→ Based in Cagayan de Oro City, Philippines · Open for internships & collaborations.",
    ],
  },
  {
    q: "What are his top flagship projects?",
    title: "06 shipped builds",
    sub: "Spanning Unity 6 (URP 2D), React 18 + TypeScript, Discord.js v14 Opus voice, Laravel, and React Native:",
    lines: [
      "01 · Trivia Attack — Turn-based 2D educational RPG with 1,449 verified questions across 5 worlds.",
      "02 · OverView — Full-stack Movie, TV & Anime streaming platform with 3-tier HLS discovery.",
      "03 · SpotiBAI — Production Discord 48kHz Opus DJ & BadiBrain Bisaya AI companion.",
    ],
  },
  {
    q: "What tech stack does he use?",
    title: "core engineering stack",
    sub: "Full-stack web, game engines, relational databases, and real-time media:",
    lines: [
      "Frontend & Mobile: React 18, TypeScript, Tailwind CSS, React Native, Vite",
      "Backend & Voice: Node.js, Express, Laravel, PHP, Discord.js v14, @discordjs/voice, FFmpeg",
      "Games & Data: Unity 6 (URP 2D), C#, Java, PostgreSQL, Prisma ORM, MySQL",
    ],
  },
  {
    q: "How can I contact Steven?",
    title: "let's build together",
    sub: "Available for software engineering internships, freelance builds, and collaborations:",
    lines: [
      `Email: ${PROFILE_DATA.email}`,
      `Phone: ${PROFILE_DATA.phone}`,
      `GitHub: github.com/steven23lz · Location: Cagayan de Oro City, PH`,
    ],
  },
]

const LaurelSvg = () => (
  <svg viewBox="0 0 16 16" fill="none" className="h-3 w-3 shrink-0" aria-hidden="true">
    <path
      d="M12.5 2.5C9.5 3.2 7.5 5.8 7.2 9.2C9.8 8.6 12.1 6.4 12.5 2.5ZM7.2 9.2C6.1 10.6 4.5 11.8 2.5 12.5M5.5 4.5C4.2 6.2 3.8 8.4 4.2 10.5"
      stroke="currentColor"
      strokeWidth="1.35"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const NavArrowSvg = () => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    className="absolute left-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink"
    aria-hidden="true"
  >
    <path
      d="M3.5 8H12.5M12.5 8L8.75 4.25M12.5 8L8.75 11.75"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export function App() {
  // ── Theme State (Light / Dark / System) synced with <meta name="color-scheme"> & html.dark ──
  const [themePref, setThemePref] = useState<ThemePreference>(() => {
    try {
      const saved = localStorage.getItem("color-scheme")
      if (saved === "light" || saved === "dark" || saved === "light dark") {
        return saved
      }
    } catch {
      // ignore storage errors
    }
    return "light"
  })

  const [resolvedDark, setResolvedDark] = useState<boolean>(false)

  useEffect(() => {
    const applyTheme = (pref: ThemePreference, animate = false) => {
      const media = window.matchMedia("(prefers-color-scheme: dark)")
      const isDark = pref === "dark" || (pref === "light dark" && media.matches)
      setResolvedDark(isDark)

      if (animate) {
        document.documentElement.classList.add("theme-anim")
        window.setTimeout(() => {
          document.documentElement.classList.remove("theme-anim")
        }, 450)
      }

      const meta = document.querySelector('meta[name="color-scheme"]') as HTMLMetaElement | null
      if (meta) {
        meta.content = pref
      }
      document.documentElement.classList.toggle("dark", isDark)
      document.documentElement.dataset.theme = isDark ? "dark" : "light"

      try {
        localStorage.setItem("color-scheme", pref)
      } catch {
        // ignore storage errors
      }
    }

    applyTheme(themePref, false)

    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const handleMedia = () => {
      if (themePref === "light dark") {
        applyTheme("light dark", true)
      }
    }
    media.addEventListener("change", handleMedia)
    return () => media.removeEventListener("change", handleMedia)
  }, [themePref])

  const handleSetTheme = (nextPref: ThemePreference) => {
    document.documentElement.classList.add("theme-anim")
    setThemePref(nextPref)
    window.setTimeout(() => {
      document.documentElement.classList.remove("theme-anim")
    }, 450)
  }

  // ── Active Navigation Section Tracking ──
  const [activeSection, setActiveSection] = useState<string>("home")
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false)

  useEffect(() => {
    const sectionIds = [
      "home",
      "deck",
      "projects",
      "experience",
      "stack",
      "certifications",
      "principles",
      "contact",
    ]
    const handleScroll = () => {
      const scrollPos = window.scrollY + 180
      for (const id of sectionIds) {
        const el = document.getElementById(id)
        if (el) {
          const top = el.offsetTop
          const height = el.offsetHeight
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(id)
            break
          }
        }
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // ── Spotlight 3-Card Fan Deck State (Bryl's .deck) ──
  const deckProjects = PROJECTS_DATA.slice(0, 3) // 01 Trivia Attack, 02 OverView, 03 SpotiBAI
  const [centerDeckIndex, setCenterDeckIndex] = useState<number>(0)

  const getDeckPositionClass = (idx: number): "is-center" | "is-left" | "is-right" => {
    if (idx === centerDeckIndex) return "is-center"
    const leftIdx = (centerDeckIndex + 2) % 3
    return idx === leftIdx ? "is-left" : "is-right"
  }

  // ── Project Category Filter with View Transitions ──
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>("all")
  const [screenModes, setScreenModes] = useState<Record<string, ScreenMode>>({
    "trivia-attack": "split",
    "overview-streaming": "0",
    "spotibai-discord-bot": "0",
    "clinic-management": "split",
  })
  const [expandedDetails, setExpandedDetails] = useState<Record<string, boolean>>({})

  const filteredProjects = PROJECTS_DATA.filter((project) =>
    activeCategory === "all" ? true : project.category === activeCategory
  )

  const handleCategoryChange = (nextCategory: ProjectCategory) => {
    if (nextCategory === activeCategory) return
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if ("startViewTransition" in document && !prefersReducedMotion) {
      ;(
        document as Document & {
          startViewTransition: (cb: () => void) => void
        }
      ).startViewTransition(() => {
        flushSync(() => {
          setActiveCategory(nextCategory)
        })
      })
    } else {
      setActiveCategory(nextCategory)
    }
  }

  const setProjectScreenMode = (projectId: string, mode: ScreenMode) => {
    setScreenModes((prev) => ({ ...prev, [projectId]: mode }))
  }

  const toggleProjectDetails = (projectId: string) => {
    setExpandedDetails((prev) => ({ ...prev, [projectId]: !prev[projectId] }))
  }

  // ── Stack Filter & Marquee State ──
  const [selectedStackCategory, setSelectedStackCategory] = useState<string>("all")
  const [marqueePaused, setMarqueePaused] = useState<boolean>(false)

  const displayedBadges =
    selectedStackCategory === "all"
      ? Array.from(
          new Map(
            SKILL_CATEGORIES.flatMap((cat) => cat.badges).map((b) => [b.name, b])
          ).values()
        )
      : SKILL_CATEGORIES.find((c) => c.id === selectedStackCategory)?.badges ?? []

  // ── Top-Layer <dialog> Lightbox for Projects & Certificate ──
  const dialogRef = useRef<HTMLDialogElement | null>(null)
  const [modalState, setModalState] = useState<ModalState | null>(null)

  const openProjectModal = (project: ProjectItem, initialImageIndex = 0) => {
    setModalState({ type: "project", project, initialImageIndex })
    const dialog = dialogRef.current
    if (dialog && !dialog.open) {
      dialog.showModal()
    }
  }

  const openCertificateModal = (certTab: "image" | "pdf" = "image") => {
    setModalState({ type: "certificate", initialImageIndex: 0, certTab })
    const dialog = dialogRef.current
    if (dialog && !dialog.open) {
      dialog.showModal()
    }
  }

  const closeModal = () => {
    dialogRef.current?.close()
  }

  const handleDialogClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      closeModal()
    }
  }

  // ── Ask / Quick Command Overlay (⌘ + K) ──
  const [askOpen, setAskOpen] = useState<boolean>(false)
  const [selectedPromptIdx, setSelectedPromptIdx] = useState<number>(0)
  const [customQuery, setCustomQuery] = useState<string>("")

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setAskOpen((prev) => !prev)
      } else if (e.key === "Escape" && askOpen) {
        setAskOpen(false)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [askOpen])

  // ── Copy Email & Contact Form State ──
  const [emailCopied, setEmailCopied] = useState<boolean>(false)
  const [contactName, setContactName] = useState<string>("")
  const [contactEmail, setContactEmail] = useState<string>("")
  const [contactMessage, setContactMessage] = useState<string>("")
  const [contactSent, setContactSent] = useState<boolean>(false)

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE_DATA.email)
      setEmailCopied(true)
      window.setTimeout(() => setEmailCopied(false), 2200)
    } catch {
      window.location.href = `mailto:${PROFILE_DATA.email}`
    }
  }

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const subject = encodeURIComponent(
      `Portfolio Inquiry from ${contactName || "Visitor"}`
    )
    const body = encodeURIComponent(
      `Name: ${contactName}\nEmail: ${contactEmail}\n\n${contactMessage}`
    )
    window.location.href = `mailto:${PROFILE_DATA.email}?subject=${subject}&body=${body}`
    setContactSent(true)
    window.setTimeout(() => setContactSent(false), 4000)
  }

  const currentProjectImages = modalState?.project?.images ?? []
  const currentModalImage =
    currentProjectImages[modalState?.initialImageIndex ?? 0] ?? currentProjectImages[0]

  return (
    <div className="min-h-screen bg-white font-sans text-ink selection:bg-ink selection:text-white">
      {/* Scroll Progress Indicator (Modern Web Guidance: scroll-progress-indicator) */}
      <div id="scroll-progress" aria-hidden="true" />

      {/* ─────────────── Ambient Halftone Dot Backdrop (Bryl Signature) ─────────────── */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
        <div className="halftone halftone-wide mask-tr absolute right-0 top-0 h-[58vh] w-[58vw] opacity-[0.15]" />
        <div className="halftone mask-bl absolute bottom-0 left-0 h-[44vh] w-[44vw] opacity-[0.12]" />
      </div>

      {/* ─────────────── Fixed Left Sidebar (lg+) ─────────────── */}
      <nav
        aria-label="Primary Sidebar"
        className="fixed inset-y-0 left-0 z-50 hidden w-56 flex-col border-r border-gray-200 bg-white px-7 py-8 lg:flex"
      >
        <div>
          <a
            href="#home"
            className="block shrink-0 font-pixel text-[15px] leading-none text-ink hover:opacity-60"
          >
            {PROFILE_DATA.displayName}
          </a>
          <span className="mt-1.5 block font-mono text-[10px] uppercase tracking-wider text-gray-400">
            BSIT · STI College CDO
          </span>
        </div>

        <div className="mt-8 flex flex-1 flex-col gap-3.5 overflow-y-auto font-mono text-[13px]">
          {/* Primary Section Links */}
          <div className="flex flex-col gap-2">
            {[
              { id: "home", label: "Overview" },
              { id: "deck", label: "Spotlight Deck" },
              { id: "projects", label: "Projects (06)" },
              { id: "experience", label: "Experience" },
              { id: "stack", label: "Tech Stack" },
              { id: "certifications", label: "Certifications" },
              { id: "principles", label: "Principles" },
              { id: "contact", label: "Contact" },
            ].map((item) => {
              const isActive = activeSection === item.id
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`relative inline-flex w-fit items-center gap-2.5 transition-colors ${
                    isActive
                      ? "pl-5 font-medium text-ink"
                      : "text-gray-500 hover:text-ink"
                  }`}
                >
                  {isActive && <NavArrowSvg />}
                  {item.label}
                </a>
              )
            })}
          </div>

          <div className="h-px bg-gray-200" />

          {/* Direct Project Jump Links */}
          <div className="flex flex-col gap-1.5">
            <span className="mb-0.5 font-mono text-[10px] uppercase tracking-wider text-gray-400">
              Shipped Systems
            </span>
            {PROJECTS_DATA.map((proj) => (
              <a
                key={proj.id}
                href={`#project-${proj.id}`}
                className="inline-flex w-fit items-center gap-2 text-[12px] text-gray-500 hover:text-ink"
              >
                <span className="font-pixel text-[10px] text-gray-400">{proj.num}</span>
                <span className="truncate">{proj.shortTitle}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Ask / Quick Command Trigger (⌘ + K) */}
        <button
          type="button"
          onClick={() => setAskOpen(true)}
          className="mt-5 inline-flex w-fit items-center gap-2 font-mono text-[12px] text-gray-400 hover:text-ink"
        >
          <span>Ask anything</span>
          <span className="inline-flex items-center gap-1">
            <kbd className="rounded border border-gray-300 bg-gray-50 px-1.5 py-0.5 font-mono text-[10px] leading-none text-gray-500">
              ⌘
            </kbd>
            <span className="font-mono text-[10px] text-gray-400">+</span>
            <kbd className="rounded border border-gray-300 bg-gray-50 px-1.5 py-0.5 font-mono text-[10px] leading-none text-gray-500">
              K
            </kbd>
          </span>
        </button>

        {/* Presence / Status Strip */}
        <div className="mt-4 border-y border-gray-200 py-3.5">
          <div className="flex items-center gap-2">
            <img
              src={PROFILE_DATA.avatar}
              alt={PROFILE_DATA.displayName}
              className="presence-avatar"
            />
            <span className="pulse-dot inline-block h-2 w-2 rounded-full bg-ink" />
            <span className="font-mono text-[10.5px] uppercase tracking-wider text-ink">
              Available
            </span>
          </div>
          <p className="presence-label mt-1.5 text-[10.5px] leading-snug text-gray-400">
            Open for <b className="presence-num">internships</b> &amp; full-stack builds
          </p>
        </div>

        {/* Bottom Theme Switcher & Email */}
        <div className="mt-5 shrink-0">
          <div className="mb-3.5 flex items-center justify-between gap-2">
            <div className="theme-switch" role="group" aria-label="Color theme">
              <button
                type="button"
                onClick={() => handleSetTheme("light dark")}
                className={`theme-opt ${themePref === "light dark" ? "is-active" : ""}`}
                title="System theme"
                aria-label="System theme"
                aria-pressed={themePref === "light dark"}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="4" width="18" height="12" rx="2" />
                  <path d="M8 20h8M12 16v4" strokeLinecap="round" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => handleSetTheme("light")}
                className={`theme-opt ${themePref === "light" ? "is-active" : ""}`}
                title="Light theme"
                aria-label="Light theme"
                aria-pressed={themePref === "light"}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="4" />
                  <path
                    d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => handleSetTheme("dark")}
                className={`theme-opt ${themePref === "dark" ? "is-active" : ""}`}
                title="Dark theme"
                aria-label="Dark theme"
                aria-pressed={themePref === "dark"}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path
                    d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            <span className="font-mono text-[10px] uppercase tracking-wider text-gray-400">
              {resolvedDark ? "dark" : "light"}
            </span>
          </div>

          <p className="text-[11.5px] leading-relaxed text-gray-400">
            For work, collabs &amp; everything else, reach me at
          </p>
          <button
            type="button"
            onClick={handleCopyEmail}
            className="mt-1 inline-flex w-fit items-center gap-1.5 font-mono text-[12px] text-ink hover:text-gray-500"
            title="Click to copy email"
          >
            <svg
              viewBox="0 0 16 16"
              fill="none"
              className="h-3.5 w-3.5 shrink-0"
              aria-hidden="true"
            >
              <rect
                x="1.75"
                y="3.25"
                width="12.5"
                height="9.5"
                rx="1.5"
                stroke="currentColor"
                strokeWidth="1.3"
              />
              <path
                d="M2.5 4.5L8 8.5L13.5 4.5"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
            <span className="truncate">
              {emailCopied ? "Copied to clipboard!" : PROFILE_DATA.email}
            </span>
          </button>
        </div>
      </nav>

      {/* ─────────────── Mobile Sticky Top Bar (< lg) ─────────────── */}
      <header className="sticky top-0 z-50 border-b border-gray-200/80 bg-white/90 backdrop-blur-md lg:hidden">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-3">
          <a href="#home" className="font-pixel text-[14px] text-ink">
            {PROFILE_DATA.displayName}
          </a>
          <div className="flex items-center gap-2.5">
            <div className="theme-switch" role="group" aria-label="Color theme">
              <button
                type="button"
                onClick={() => handleSetTheme("light")}
                className={`theme-opt ${!resolvedDark ? "is-active" : ""}`}
                aria-label="Light theme"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M2 12h2M20 12h2" strokeLinecap="round" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => handleSetTheme("dark")}
                className={`theme-opt ${resolvedDark ? "is-active" : ""}`}
                aria-label="Dark theme"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path
                    d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
              className="-mr-1 p-1 text-gray-700 hover:text-ink"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* ─────────────── Mobile Full-Screen Menu (< lg) ─────────────── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-white lg:hidden">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-3">
            <span className="font-pixel text-[14px] text-ink">{PROFILE_DATA.displayName}</span>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
              className="-mr-1 p-1 text-gray-700 hover:text-ink"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="flex flex-1 flex-col overflow-y-auto px-7 py-8 font-mono text-[15px]">
            <div className="flex flex-col gap-3.5">
              {[
                { id: "home", label: "Overview" },
                { id: "deck", label: "01 — Spotlight Deck" },
                { id: "projects", label: "02 — Projects (06)" },
                { id: "experience", label: "03 — Experience" },
                { id: "stack", label: "04 — Tech Stack" },
                { id: "certifications", label: "05 — Certifications" },
                { id: "contact", label: "06 — Contact" },
              ].map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-700 hover:text-ink"
                >
                  {item.label}
                </a>
              ))}
            </div>

            <div className="my-6 h-px bg-gray-200" />

            <div className="mt-auto">
              <p className="text-[12px] text-gray-400">
                For work, collabs &amp; everything else, reach me at
              </p>
              <a
                href={`mailto:${PROFILE_DATA.email}`}
                className="mt-1.5 inline-block font-mono text-[14px] text-ink"
              >
                {PROFILE_DATA.email}
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────── Main Content Column (lg:pl-56) ─────────────── */}
      <main className="relative z-10 lg:pl-56">
        <div className="mx-auto max-w-2xl px-6">
          {/* ── HERO SECTION ── */}
          <section id="home" className="relative pt-16 pb-14 sm:pt-24">
            <div className="grid gap-9 sm:grid-cols-[16.5rem_1fr] sm:items-start sm:gap-10">
              {/* Left Column: Portrait */}
              <div className="mx-auto w-full max-w-[16.5rem] sm:mx-0">
                <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 p-2 shadow-[0_12px_32px_-16px_rgba(10,10,10,0.22)]">
                  <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-100 aspect-[4/4.3]">
                    <img
                      src={PROFILE_DATA.avatar}
                      alt={PROFILE_DATA.fullName}
                      width="400"
                      height="430"
                      loading="eager"
                      decoding="async"
                      className="block h-full w-full select-none object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
                      draggable={false}
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between px-1.5 py-1 font-mono text-[10px]">
                    <span className="font-medium text-ink">STI College CDO</span>
                    <span className=" uppercase tracking-wider text-gray-400">BSIT · 2026</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Pixel Name + Bryl .intro-copy with .intro-tag pills */}
              <div>
                <h1 className="font-pixel text-3xl leading-none text-ink sm:text-[2.55rem]">
                  {PROFILE_DATA.displayName}
                </h1>

                <p className="intro-copy mt-6 text-[15px] text-gray-600">
                  I&apos;m a{" "}
                  <span className="intro-tag">
                    <i className="fas fa-layer-group text-[11px]" aria-hidden="true" />
                    full-stack
                  </span>{" "}
                  developer &amp; BSIT student at{" "}
                  <span className="intro-tag">
                    <i className="fas fa-graduation-cap text-[11px]" aria-hidden="true" />
                    STI College
                  </span>
                  . I build modern{" "}
                  <span className="intro-tag">
                    <i className="fas fa-globe text-[11px]" aria-hidden="true" />
                    web
                  </span>
                  ,{" "}
                  <span className="intro-tag">
                    <i className="fas fa-gamepad text-[11px]" aria-hidden="true" />
                    Unity 2D games
                  </span>{" "}
                  &amp;{" "}
                  <span className="intro-tag">
                    <i className="fas fa-mobile-alt text-[11px]" aria-hidden="true" />
                    mobile apps
                  </span>
                  .
                </p>

                <p className="intro-copy mt-4 text-[15px] text-gray-600">
                  These days I&apos;m focused on{" "}
                  <span className="intro-ai">
                    <span className="intro-logos" aria-hidden="true">
                      <span className="intro-logo" title="React & TypeScript">
                        <i className="fab fa-react" />
                      </span>
                      <span className="intro-logo" title="Unity 6 (URP 2D)">
                        <i className="fab fa-unity" />
                      </span>
                      <span className="intro-logo" title="Discord.js & Opus Voice">
                        <i className="fab fa-discord" />
                      </span>
                      <span className="intro-logo" title="PostgreSQL & Laravel">
                        <i className="fas fa-database" />
                      </span>
                    </span>
                    database-driven systems &amp; AI bots
                  </span>{" "}
                  — turning real academic, clinical, and entertainment workflows into software people
                  actually use.
                </p>

                {/* External Social & Credential Links */}
                <div className="mt-7 flex flex-wrap items-center gap-x-3.5 gap-y-1.5 font-mono text-[12px] text-gray-500">
                  <a
                    href={PROFILE_DATA.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-ink"
                  >
                    github ↗
                  </a>
                  <a
                    href={PROFILE_DATA.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-ink"
                  >
                    facebook ↗
                  </a>
                  <a
                    href={PROFILE_DATA.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-ink"
                  >
                    instagram ↗
                  </a>
                  <a href={`mailto:${PROFILE_DATA.email}`} className="hover:text-ink">
                    email ↗
                  </a>
                  <button
                    type="button"
                    onClick={() => openCertificateModal("image")}
                    className="underline decoration-gray-300 underline-offset-4 hover:text-ink hover:decoration-ink"
                  >
                    oracle certificate ↗
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* ── 3-COLUMN HAIRLINE AFFILIATIONS / CREDENTIALS BAR ── */}
          <section aria-label="Highlights" className="border-t border-gray-200 py-5">
            <div className="grid grid-cols-3 divide-x divide-gray-200">
              <a
                href="#experience"
                className="group flex min-w-0 flex-col items-start gap-2 pr-3 sm:flex-row sm:items-center sm:gap-3 sm:pr-5"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-ink transition-opacity group-hover:opacity-60">
                  <i className="fas fa-university text-xs" aria-hidden="true" />
                </span>
                <span className="min-w-0 font-mono leading-tight">
                  <span className="block truncate text-[12px] font-semibold text-ink">
                    STI College
                  </span>
                  <span className="mt-1 block whitespace-nowrap text-[9px] uppercase tracking-wider text-gray-500 sm:text-[10px]">
                    BSIT · CDO
                  </span>
                </span>
              </a>

              <button
                type="button"
                onClick={() => openCertificateModal("image")}
                className="group flex min-w-0 flex-col items-start gap-2 px-3 text-left sm:flex-row sm:items-center sm:gap-3 sm:px-5"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-ink transition-opacity group-hover:opacity-60">
                  <i className="fab fa-java text-sm" aria-hidden="true" />
                </span>
                <span className="min-w-0 font-mono leading-tight">
                  <span className="block truncate text-[12px] font-semibold text-ink">
                    Oracle Academy
                  </span>
                  <span className="mt-1 block whitespace-nowrap text-[9px] uppercase tracking-wider text-gray-500 sm:text-[10px]">
                    Java Certified
                  </span>
                </span>
              </button>

              <a
                href="#projects"
                className="group flex min-w-0 flex-col items-start gap-2 pl-3 sm:flex-row sm:items-center sm:gap-3 sm:pl-5"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-ink transition-opacity group-hover:opacity-60">
                  <i className="fas fa-code-branch text-xs" aria-hidden="true" />
                </span>
                <span className="min-w-0 font-mono leading-tight">
                  <span className="block truncate text-[12px] font-semibold text-ink">
                    Full-Stack
                  </span>
                  <span className="mt-1 block whitespace-nowrap text-[9px] uppercase tracking-wider text-gray-500 sm:text-[10px]">
                    Web · Game · Bot
                  </span>
                </span>
              </a>
            </div>
          </section>

          {/* ── 3-COLUMN HAIRLINE STATS ROW (Bryl Signature) ── */}
          <section className="grid grid-cols-3 divide-x divide-gray-200 border-t border-gray-200">
            <div className="py-6 pr-3 sm:pr-5">
              <a href="#projects" className="group block text-left">
                <div className="flex items-center gap-1.5">
                  <span className="font-pixel text-lg leading-none text-ink">06</span>
                  <span className="font-mono text-xs text-gray-400 transition-transform group-hover:translate-x-0.5 group-hover:text-ink">
                    →
                  </span>
                </div>
                <div className="mt-2 font-mono text-[11px] uppercase tracking-wider text-gray-500 group-hover:text-ink">
                  shipped projects
                </div>
              </a>
            </div>

            <div className="py-6 px-3 sm:px-5">
              <a href="#stack" className="group block text-left">
                <div className="flex items-center gap-1.5">
                  <span className="font-pixel text-lg leading-none text-ink">18+</span>
                  <span className="font-mono text-xs text-gray-400 transition-transform group-hover:translate-x-0.5 group-hover:text-ink">
                    →
                  </span>
                </div>
                <div className="mt-2 font-mono text-[11px] uppercase tracking-wider text-gray-500 group-hover:text-ink">
                  tech stack
                </div>
              </a>
            </div>

            <div className="py-6 pl-3 sm:pl-5">
              <button
                type="button"
                onClick={() => openCertificateModal("image")}
                className="group block text-left"
              >
                <div className="flex items-center gap-1.5">
                  <span className="font-pixel text-lg leading-none text-ink">
                    1<span className="text-gray-400">x</span>
                  </span>
                  <span className="font-mono text-xs text-gray-400 transition-transform group-hover:translate-x-0.5 group-hover:text-ink">
                    ↗
                  </span>
                </div>
                <div className="mt-2 font-mono text-[11px] uppercase tracking-wider text-gray-500 group-hover:text-ink">
                  oracle certified
                </div>
              </button>
            </div>
          </section>

          {/* ── HALFTONE DIVIDER ── */}
          <div
            aria-hidden="true"
            className="halftone halftone-wide mask-fade-x my-2 h-6 w-full opacity-[0.18]"
          />

          {/* ── 01 — SPOTLIGHT DECK (Bryl's 3-Card Interactive Fan) ── */}
          <section id="deck" className="py-14">
            <div className="mb-8 flex items-baseline justify-between">
              <h2 className="font-pixel text-sm text-gray-400">01 — spotlight deck</h2>
              <div className="flex items-center gap-2 font-mono text-[11px] text-gray-500">
                <span>click side cards to fan</span>
              </div>
            </div>

            <div className="deck" data-deck>
              {deckProjects.map((proj, idx) => {
                const posClass = getDeckPositionClass(idx)
                return (
                  <article
                    key={proj.id}
                    role="button"
                    tabIndex={0}
                    aria-label={`Spotlight ${proj.title}`}
                    onClick={() => setCenterDeckIndex(idx)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        setCenterDeckIndex(idx)
                      }
                    }}
                    className={`deck-card ${posClass} rounded-2xl border border-gray-200 bg-white p-5`}
                  >
                    {/* Inverted Laurel Pill + Secondary Badges */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-ink px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-white">
                        <LaurelSvg />
                        {proj.badgeLabel}
                        <span className="inline-flex -scale-x-100">
                          <LaurelSvg />
                        </span>
                      </span>
                      {proj.secondaryBadges.slice(0, 2).map((b) => (
                        <span
                          key={b}
                          className="rounded-full border border-gray-300 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-gray-500"
                        >
                          {b}
                        </span>
                      ))}
                    </div>

                    {/* Thumbnail + Pixel Title */}
                    <div className="mt-4 flex items-center gap-3.5">
                      <img
                        loading="lazy"
                        decoding="async"
                        src={proj.images[0].src}
                        alt={proj.title}
                        className="h-12 w-12 shrink-0 rounded-xl border border-gray-200 bg-gray-100 object-cover shadow-sm"
                      />
                      <div className="min-w-0">
                        <div className="font-mono text-[10px] uppercase tracking-wider text-gray-400">
                          Project {proj.num}
                        </div>
                        <h3 className="truncate font-pixel text-base leading-tight text-ink">
                          {proj.shortTitle}
                        </h3>
                      </div>
                    </div>

                    <p className="mt-3 line-clamp-3 text-[13px] leading-relaxed text-gray-600">
                      {proj.description}
                    </p>

                    <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-3">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          openProjectModal(proj, 0)
                        }}
                        className="deck-action-btn inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-white hover:opacity-85"
                      >
                        <span>Inspect Screens</span>
                        <span>↗</span>
                      </button>
                      <a
                        href={`#project-${proj.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="deck-action-btn font-mono text-[11px] text-gray-500 hover:text-ink"
                      >
                        case study ↓
                      </a>
                    </div>
                  </article>
                )
              })}
            </div>

            {/* Deck Controls */}
            <div className="mt-3 flex items-center justify-center gap-2">
              {deckProjects.map((proj, idx) => (
                <button
                  key={proj.id}
                  type="button"
                  onClick={() => setCenterDeckIndex(idx)}
                  className={`rounded-full px-3 py-1 font-mono text-[11px] transition-colors ${
                    centerDeckIndex === idx
                      ? "bg-ink text-white"
                      : "border border-gray-200 bg-gray-50 text-gray-500 hover:text-ink"
                  }`}
                >
                  {proj.num} · {proj.shortTitle}
                </button>
              ))}
            </div>
          </section>

          {/* ── 02 — ALL PROJECTS (Bryl /projects Spotlight Cards + Interactive Uncropped Screens) ── */}
          <section id="projects" className="py-14">
            <div className="mb-6 flex flex-wrap items-baseline justify-between gap-4">
              <div>
                <h2 className="font-pixel text-sm text-gray-400">02 — projects</h2>
                <p className="mt-2 text-[14px] text-gray-500">
                  All 6 production builds — click any screenshot to inspect fullscreen.
                </p>
              </div>

              {/* Monochrome Filter Pills */}
              <div
                role="tablist"
                aria-label="Filter projects by category"
                className="flex flex-wrap items-center gap-1.5"
              >
                {(
                  [
                    { id: "all", label: "all (06)" },
                    { id: "web", label: "web (03)" },
                    { id: "games", label: "games & mobile (02)" },
                    { id: "bots", label: "discord & ai (01)" },
                  ] as { id: ProjectCategory; label: string }[]
                ).map((tab) => {
                  const active = activeCategory === tab.id
                  return (
                    <button
                      key={tab.id}
                      role="tab"
                      aria-selected={active}
                      type="button"
                      onClick={() => handleCategoryChange(tab.id)}
                      className={`rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-wider transition-colors ${
                        active
                          ? "bg-ink text-white"
                          : "border border-gray-200 bg-white text-gray-500 hover:border-gray-400 hover:text-ink"
                      }`}
                    >
                      {tab.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Project Spotlight Cards */}
            <div className="space-y-6">
              {filteredProjects.map((project) => {
                const hasTwoScreens = project.images.length > 1
                const currentMode: ScreenMode =
                  screenModes[project.id] ?? (hasTwoScreens ? "split" : "0")
                const isExpanded = !!expandedDetails[project.id]

                return (
                  <article
                    key={project.id}
                    id={`project-${project.id}`}
                    style={{ viewTransitionName: project.vtName }}
                    className="project-card-vt overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-5 shadow-[0_10px_28px_-18px_rgba(10,10,10,0.2)] sm:p-7"
                  >
                    {/* Top Badges Row */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-ink px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-white">
                          <span>{project.num}</span>
                          <span>·</span>
                          <span>{project.badgeLabel}</span>
                        </span>
                        {project.secondaryBadges.map((badge) => (
                          <span
                            key={badge}
                            className="rounded-full border border-gray-300 px-2.5 py-0.5 font-mono text-[9.5px] uppercase tracking-wider text-gray-500"
                          >
                            {badge}
                          </span>
                        ))}
                      </div>

                      <span className="font-mono text-[11px] text-gray-400">
                        {project.subtitle}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <h3 className="mt-3.5 font-pixel text-xl leading-snug text-ink">
                      {project.title}
                    </h3>
                    <p className="mt-2 text-[14px] leading-relaxed text-gray-600">
                      {project.description}
                    </p>

                    {/* Uncropped Interactive Screenshot Stage */}
                    <div className="mt-5 overflow-hidden rounded-xl border border-gray-200 bg-gray-100/80">
                      {/* Window Bar + Screen Switcher */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 bg-white px-3.5 py-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="h-2 w-2 rounded-full bg-gray-300" />
                          <span className="h-2 w-2 rounded-full bg-gray-300" />
                          <span className="h-2 w-2 rounded-full bg-gray-300" />
                          <span className="ml-1 truncate font-mono text-[11px] text-gray-400">
                            {project.windowUrl}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          {hasTwoScreens && (
                            <>
                              <button
                                type="button"
                                onClick={() => setProjectScreenMode(project.id, "0")}
                                className={`rounded px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${
                                  currentMode === "0"
                                    ? "bg-ink text-white"
                                    : "text-gray-500 hover:text-ink"
                                }`}
                              >
                                Screen 1
                              </button>
                              <button
                                type="button"
                                onClick={() => setProjectScreenMode(project.id, "1")}
                                className={`rounded px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${
                                  currentMode === "1"
                                    ? "bg-ink text-white"
                                    : "text-gray-500 hover:text-ink"
                                }`}
                              >
                                Screen 2
                              </button>
                              <button
                                type="button"
                                onClick={() => setProjectScreenMode(project.id, "split")}
                                className={`rounded px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${
                                  currentMode === "split"
                                    ? "bg-ink text-white"
                                    : "text-gray-500 hover:text-ink"
                                }`}
                              >
                                Split
                              </button>
                            </>
                          )}
                          <button
                            type="button"
                            onClick={() =>
                              openProjectModal(project, currentMode === "1" ? 1 : 0)
                            }
                            className="ml-1 rounded border border-gray-200 bg-gray-50 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-ink hover:bg-gray-200"
                          >
                            Fullscreen ↗
                          </button>
                        </div>
                      </div>

                      {/* Image Viewport (Uncropped object-contain) */}
                      {hasTwoScreens && currentMode === "split" ? (
                        <div className="grid grid-cols-1 divide-y divide-gray-200 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
                          {project.images.map((img, imgIdx) => (
                            <button
                              key={img.src}
                              type="button"
                              onClick={() => openProjectModal(project, imgIdx)}
                              className="group relative flex flex-col justify-between bg-gray-950/5 p-3 text-left transition hover:bg-gray-950/10"
                            >
                              <div className="flex h-48 w-full items-center justify-center overflow-hidden rounded-lg border border-gray-200/80 bg-gray-950 p-1.5">
                                <img
                                  src={img.src}
                                  alt={img.caption}
                                  loading="lazy"
                                  className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                                />
                              </div>
                              <div className="mt-2 flex items-center justify-between font-mono text-[10.5px] text-gray-500">
                                <span>{img.label}</span>
                                <span className="group-hover:text-ink">inspect ↗</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            openProjectModal(project, currentMode === "1" ? 1 : 0)
                          }
                          className="group relative block w-full bg-gray-950/5 p-3 text-left"
                        >
                          <div className="flex max-h-[340px] min-h-[220px] w-full items-center justify-center overflow-hidden rounded-lg border border-gray-200/80 bg-gray-950 p-2">
                            <img
                              src={
                                (project.images[currentMode === "1" ? 1 : 0] ??
                                  project.images[0]).src
                              }
                              alt={
                                (project.images[currentMode === "1" ? 1 : 0] ??
                                  project.images[0]).caption
                              }
                              loading="lazy"
                              className="max-h-[315px] w-auto max-w-full object-contain transition-transform duration-300 group-hover:scale-[1.01]"
                            />
                          </div>
                          <div className="mt-2 flex items-center justify-between font-mono text-[11px] text-gray-500">
                            <span>
                              {
                                (project.images[currentMode === "1" ? 1 : 0] ??
                                  project.images[0]).label
                              }
                            </span>
                            <span className="group-hover:text-ink">click to zoom fullscreen ↗</span>
                          </div>
                        </button>
                      )}
                    </div>

                    {/* Stack Pills & Architecture Toggle */}
                    <div className="edge-fade-divider mt-5 flex flex-wrap items-center justify-between gap-3 pt-4">
                      <div className="flex flex-wrap gap-1.5">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md border border-gray-200 bg-white px-2 py-0.5 font-mono text-[11px] text-gray-600"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-3 font-mono text-[11px]">
                        <button
                          type="button"
                          onClick={() => toggleProjectDetails(project.id)}
                          aria-expanded={isExpanded}
                          className="text-gray-500 underline decoration-gray-300 underline-offset-4 hover:text-ink hover:decoration-ink"
                        >
                          {isExpanded ? "hide architecture −" : "architecture & features +"}
                        </button>
                        <button
                          type="button"
                          onClick={() => openProjectModal(project, 0)}
                          className="font-medium text-ink hover:opacity-70"
                        >
                          lightbox ↗
                        </button>
                      </div>
                    </div>

                    {/* Discrete Entry/Exit Architecture Drawer */}
                    <div className={`project-details ${isExpanded ? "is-open" : ""}`}>
                      <div className="rounded-xl border border-gray-200 bg-white p-4">
                        <div className="font-mono text-[10px] uppercase tracking-wider text-gray-400">
                          System Architecture &amp; Key Features
                        </div>
                        <p className="mt-1.5 text-[13.5px] leading-relaxed text-gray-600">
                          {project.detailText}
                        </p>
                        <div className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                          {project.features.map((feat) => (
                            <div
                              key={feat}
                              className="flex items-center gap-2 font-mono text-[11.5px] text-gray-600"
                            >
                              <span className="text-gray-400">→</span>
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                        <p className="mt-3 border-t border-gray-100 pt-2.5 font-mono text-[11px] text-gray-500">
                          {project.detailNote}
                        </p>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>

            {/* Bryl's Compact .project-stack Directory Table */}
            <div className="mt-10">
              <div className="mb-3 flex items-baseline justify-between">
                <h3 className="font-mono text-[11px] uppercase tracking-wider text-gray-400">
                  Quick Project Index
                </h3>
                <span className="font-mono text-[11px] text-gray-400">06 total</span>
              </div>
              <div className="project-stack overflow-hidden rounded-2xl border border-gray-200">
                {PROJECTS_DATA.map((proj) => (
                  <button
                    key={proj.id}
                    type="button"
                    onClick={() => openProjectModal(proj, 0)}
                    className="group flex w-full flex-col gap-2 bg-white p-4 text-left transition hover:bg-gray-50 sm:flex-row sm:items-center sm:gap-5 sm:px-6 sm:py-4"
                  >
                    <div className="flex shrink-0 items-center gap-2.5 sm:w-48">
                      <span className="font-mono text-[11px] text-gray-400">{proj.num}</span>
                      <span className="font-pixel text-[15px] text-ink group-hover:underline">
                        {proj.shortTitle}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-gray-400">
                        {proj.subtitle}
                      </span>
                      <p className="mt-0.5 truncate text-[13px] text-gray-600">
                        {proj.description}
                      </p>
                    </div>
                    <span className="shrink-0 font-mono text-[11px] text-gray-400 group-hover:text-ink">
                      inspect ↗
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* ── 03 — EXPERIENCE & EDUCATION (Bryl's 12-Col Hairline Rows) ── */}
          <section id="experience" className="py-14">
            <div className="mb-6 flex items-baseline justify-between">
              <h2 className="font-pixel text-sm text-gray-400">
                03 — experience &amp; education
              </h2>
              <span className="font-mono text-[11px] uppercase tracking-wider text-gray-400">
                STI College CDO
              </span>
            </div>

            <div className="divide-y divide-gray-200 border-y border-gray-200">
              {EXPERIENCE_TIMELINE.map((item) => (
                <div
                  key={`${item.year}-${item.role}`}
                  className="group py-3.5 transition-colors hover:bg-gray-50/80"
                >
                  <div className="grid grid-cols-12 items-baseline gap-3">
                    <div className="col-span-3 sm:col-span-2 font-mono text-[11px] text-gray-400">
                      {item.year}
                    </div>
                    <div className="col-span-9 sm:col-span-6 text-[14px] font-medium text-ink">
                      {item.role}
                    </div>
                    <div className="col-span-12 sm:col-span-4 font-mono text-[12px] text-gray-500 sm:text-right">
                      {item.org}
                    </div>
                  </div>
                  <p className="mt-1.5 sm:pl-[16.666%] text-[13px] leading-relaxed text-gray-500">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>

            {/* ── STACK SUBSECTION (#stack) ── */}
            <div id="stack" className="mt-10 pt-2">
              <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-mono text-[11px] uppercase tracking-wider text-gray-400">
                  Stack &amp; Tooling
                </h3>
                <div className="flex flex-wrap gap-1.5 font-mono text-[10.5px]">
                  <button
                    type="button"
                    onClick={() => setSelectedStackCategory("all")}
                    className={`rounded px-2 py-0.5 uppercase tracking-wider ${
                      selectedStackCategory === "all"
                        ? "bg-ink text-white"
                        : "text-gray-500 hover:text-ink"
                    }`}
                  >
                    all
                  </button>
                  {SKILL_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedStackCategory(cat.id)}
                      className={`rounded px-2 py-0.5 uppercase tracking-wider ${
                        selectedStackCategory === cat.id
                          ? "bg-ink text-white"
                          : "text-gray-500 hover:text-ink"
                      }`}
                    >
                      {cat.id}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {displayedBadges.map((badge) => (
                  <span
                    key={badge.name}
                    className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 py-1 font-mono text-[12px] text-gray-600 transition hover:border-gray-400 hover:text-ink"
                  >
                    <i className={`${badge.icon} text-[11px] text-gray-400`} aria-hidden="true" />
                    {badge.name}
                  </span>
                ))}
              </div>

              {/* Pauseable Monochrome Ticker */}
              <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-gray-50/70 py-2.5">
                <div className="mb-1.5 flex items-center justify-between px-3">
                  <span className="font-mono text-[9.5px] uppercase tracking-wider text-gray-400">
                    Continuous Stack Stream
                  </span>
                  <button
                    type="button"
                    onClick={() => setMarqueePaused((p) => !p)}
                    className="font-mono text-[10px] text-gray-500 hover:text-ink"
                  >
                    {marqueePaused ? "▶ resume" : "⏸ pause"}
                  </button>
                </div>
                <div className="overflow-hidden">
                  <div className={`bryl-marquee-track ${marqueePaused ? "paused" : ""}`}>
                    {[...TECH_MARQUEE_ITEMS, ...TECH_MARQUEE_ITEMS].map((item, idx) => (
                      <span
                        key={`${item}-${idx}`}
                        className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-2.5 py-1 font-mono text-[11px] text-gray-600"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── 04 — CERTIFICATIONS (Bryl Double-Bordered Card + Full Visible Certificate Preview) ── */}
          <section id="certifications" className="py-14">
            <div className="mb-8 flex items-baseline justify-between">
              <h2 className="font-pixel text-sm text-gray-400">04 — certifications</h2>
              <button
                type="button"
                onClick={() => openCertificateModal("image")}
                className="font-mono text-[11px] uppercase tracking-wider text-gray-500 hover:text-ink"
              >
                inspect fullscreen ↗
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-12">
              {/* Left: Bryl Lim's Exact Double-Bordered Certification Badge Card */}
              <button
                type="button"
                onClick={() => openCertificateModal("image")}
                className="group relative flex flex-col items-center justify-center rounded-xl bg-gradient-to-b from-gray-50 to-white px-5 py-6 text-center shadow-[0_8px_22px_-14px_rgba(10,10,10,0.25)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-20px_rgba(10,10,10,0.4)] sm:col-span-5"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-[5px] rounded-lg border border-gray-200/80"
                />
                <div className="relative flex h-11 w-11 items-center justify-center rounded-md border border-gray-200 bg-white text-ink">
                  <i className="fab fa-java text-xl" aria-hidden="true" />
                </div>
                <h3 className="relative mt-3.5 text-[14px] font-semibold leading-snug text-ink">
                  Java Fundamentals
                </h3>
                <p className="relative mt-1 font-mono text-[10px] uppercase tracking-wider text-gray-400">
                  Oracle Academy · STI College
                </p>
                <p className="relative mt-2 text-[12px] text-gray-500">
                  Awarded Dec 12, 2025 to Steven Floyd Sendrijas
                </p>
                <div className="relative mt-4 flex items-center gap-1.5 text-gray-400 group-hover:text-ink">
                  <LaurelSvg />
                  <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-gray-500 group-hover:text-ink">
                    View Certificate
                  </span>
                  <span className="inline-flex -scale-x-100">
                    <LaurelSvg />
                  </span>
                </div>
              </button>

              {/* Right: High-Res Always-Visible Certificate Preview + Direct PDF Actions */}
              <div className="relative flex flex-col justify-between overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-b from-gray-50 to-white p-3.5 shadow-[0_8px_22px_-14px_rgba(10,10,10,0.2)] sm:col-span-7">
                <button
                  type="button"
                  onClick={() => openCertificateModal("image")}
                  className="group relative block overflow-hidden rounded-lg border border-gray-200 bg-white"
                  aria-label="Open Oracle Academy Java Fundamentals certificate in fullscreen"
                >
                  <img
                    src={PROFILE_DATA.certificatePreview}
                    alt="Oracle Academy Java Fundamentals Certificate awarded to Steven Floyd Sendrijas"
                    loading="lazy"
                    className="block h-auto w-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                  <span className="absolute bottom-2 right-2 rounded-full bg-ink/90 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-white opacity-90 transition group-hover:opacity-100">
                    Click to Enlarge ↗
                  </span>
                </button>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 px-1">
                  <span className="font-mono text-[10.5px] text-gray-500">
                    Official Oracle Academy Credential
                  </span>
                  <div className="flex items-center gap-3 font-mono text-[11px]">
                    <button
                      type="button"
                      onClick={() => openCertificateModal("pdf")}
                      className="text-gray-600 underline decoration-gray-300 underline-offset-4 hover:text-ink hover:decoration-ink"
                    >
                      Interactive PDF Reader
                    </button>
                    <a
                      href={PROFILE_DATA.certificatePdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-ink hover:opacity-70"
                    >
                      Download PDF ↗
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── 05 — ENGINEERING PRINCIPLES (Bryl's .rec-quote Serif Grid) ── */}
          <section id="principles" className="py-14">
            <div className="mb-8 flex items-baseline justify-between">
              <h2 className="font-pixel text-sm text-gray-400">05 — engineering focus</h2>
              <span className="font-mono text-[11px] uppercase tracking-wider text-gray-400">
                how I build
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                {
                  code: "01",
                  title: "Database-Backed Workflows",
                  role: "PostgreSQL · Prisma · MySQL",
                  quote:
                    "Every interface I build is backed by clean relational schemas—from Enlogada Clinic patient diagnostics to LGU business permit licensing.",
                },
                {
                  code: "02",
                  title: "Interactive Engines & Media",
                  role: "Unity 6 (URP 2D) · HLS.js",
                  quote:
                    "Whether it's a 1,449-question turn-based RPG in C# or a 3-tier 1080p HLS stream discovery engine, performance and feel come first.",
                },
                {
                  code: "03",
                  title: "Voice & Conversational AI",
                  role: "Discord.js v14 · 48kHz Opus",
                  quote:
                    "SpotiBAI blends low-latency FFmpeg DSP audio pipelines with natural Bisaya conversational memory for real Discord communities.",
                },
              ].map((card) => (
                <div
                  key={card.code}
                  className="flex flex-col justify-between rounded-xl border border-gray-200/80 bg-gradient-to-b from-gray-50 to-white p-5 shadow-[0_8px_22px_-16px_rgba(10,10,10,0.2)]"
                >
                  <div>
                    <span className="font-pixel text-xs text-gray-400">{card.code}</span>
                    <p className="rec-quote mt-2 text-[13.5px] leading-relaxed text-gray-700">
                      &ldquo;{card.quote}&rdquo;
                    </p>
                  </div>
                  <div className="mt-4 flex items-center gap-2.5 border-t border-gray-200/70 pt-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100 font-mono text-[10px] font-medium text-ink">
                      {card.code}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-[12px] font-semibold text-ink">
                        {card.title}
                      </div>
                      <div className="truncate font-mono text-[9px] uppercase tracking-wider text-gray-400">
                        {card.role}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── 06 — CONTACT SECTION ── */}
          <section id="contact" className="py-14">
            <div className="mb-8 flex items-baseline justify-between">
              <h2 className="font-pixel text-sm text-gray-400">06 — contact</h2>
              <span className="font-mono text-[11px] uppercase tracking-wider text-gray-400">
                {PROFILE_DATA.shortLocation}
              </span>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-6 sm:p-7">
              <p className="text-[15px] leading-relaxed text-gray-600">
                Available for software engineering internships, capstone/system collaborations, and
                full-stack or game development projects.
              </p>

              {/* Hairline Contact Info Rows */}
              <div className="mt-6 divide-y divide-gray-200 border-y border-gray-200 font-mono text-[12.5px]">
                <div className="flex flex-wrap items-center justify-between gap-2 py-3">
                  <span className="text-[11px] uppercase tracking-wider text-gray-400">Email</span>
                  <div className="flex items-center gap-3">
                    <a href={`mailto:${PROFILE_DATA.email}`} className="text-ink hover:underline">
                      {PROFILE_DATA.email}
                    </a>
                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      className="rounded border border-gray-300 bg-white px-2 py-0.5 text-[10px] uppercase tracking-wider text-gray-600 hover:border-ink hover:text-ink"
                    >
                      {emailCopied ? "copied" : "copy"}
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 py-3">
                  <span className="text-[11px] uppercase tracking-wider text-gray-400">Phone</span>
                  <a href={`tel:${PROFILE_DATA.phone}`} className="text-ink hover:underline">
                    {PROFILE_DATA.phone}
                  </a>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 py-3">
                  <span className="text-[11px] uppercase tracking-wider text-gray-400">
                    Location
                  </span>
                  <span className="text-gray-600">{PROFILE_DATA.location}</span>
                </div>
              </div>

              {/* Quick Direct Message Form */}
              <form onSubmit={handleContactSubmit} className="mt-6 space-y-3">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Your name"
                    className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2 font-mono text-[12.5px] text-ink placeholder:text-gray-400 focus:border-ink focus:outline-none"
                  />
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2 font-mono text-[12.5px] text-ink placeholder:text-gray-400 focus:border-ink focus:outline-none"
                  />
                </div>
                <textarea
                  rows={3}
                  required
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Tell me about your project, internship, or collaboration..."
                  className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2 font-mono text-[12.5px] text-ink placeholder:text-gray-400 focus:border-ink focus:outline-none"
                />
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-[11px] text-gray-400">
                    {contactSent ? "Opening mail client..." : "Replies within 24 hours"}
                  </span>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-white hover:opacity-85"
                  >
                    <span>Send Message</span>
                    <span>↗</span>
                  </button>
                </div>
              </form>
            </div>
          </section>

          {/* ── BOTTOM HALFTONE FADE & FOOTER ── */}
          <div
            aria-hidden="true"
            className="halftone halftone-wide mask-fade-x mt-2 h-10 w-full opacity-[0.15]"
          />

          <footer className="border-t border-gray-200 py-8 font-mono text-[11px] text-gray-400">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <span>© {new Date().getFullYear()} Steven Floyd Sendrijas</span>
              <div className="flex items-center gap-4">
                <a
                  href={PROFILE_DATA.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-ink"
                >
                  github ↗
                </a>
                <a
                  href={PROFILE_DATA.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-ink"
                >
                  facebook ↗
                </a>
                <a
                  href={PROFILE_DATA.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-ink"
                >
                  instagram ↗
                </a>
              </div>
            </div>
          </footer>
        </div>
      </main>

      {/* ─────────────── ASK OVERLAY (⌘ + K, Bryl Signature) ─────────────── */}
      {askOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Ask about Steven Sendrijas"
          className="fixed inset-0 z-[100] flex items-center justify-center p-6"
        >
          <div
            className="absolute inset-0 bg-gray-50/85 backdrop-blur-md"
            onClick={() => setAskOpen(false)}
          />
          <div className="relative z-10 w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <span className="font-pixel text-lg text-ink">what do you want to know?</span>
              <button
                type="button"
                onClick={() => setAskOpen(false)}
                className="rounded border border-gray-200 px-2 py-0.5 font-mono text-[11px] text-gray-500 hover:text-ink"
              >
                esc
              </button>
            </div>

            {/* Prompt Selector Pills */}
            <div className="mt-4 flex flex-wrap gap-2">
              {ASK_PROMPTS.map((item, idx) => (
                <button
                  key={item.q}
                  type="button"
                  onClick={() => setSelectedPromptIdx(idx)}
                  className={`rounded-full px-3 py-1 font-mono text-[11px] transition ${
                    selectedPromptIdx === idx
                      ? "bg-ink text-white"
                      : "border border-gray-200 bg-gray-50 text-gray-600 hover:text-ink"
                  }`}
                >
                  {item.q}
                </button>
              ))}
            </div>

            {/* Pixel Reveal Output */}
            <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50/60 p-5">
              <div className="font-pixel text-xl text-ink">
                {ASK_PROMPTS[selectedPromptIdx].title}
              </div>
              <p className="mt-2 font-mono text-[12.5px] leading-relaxed text-gray-600">
                {ASK_PROMPTS[selectedPromptIdx].sub}
              </p>
              <div className="mt-4 space-y-2 font-mono text-[12px] text-ink">
                {ASK_PROMPTS[selectedPromptIdx].lines.map((line) => (
                  <div key={line}>{line}</div>
                ))}
              </div>
            </div>

            {/* Quick Filter / Jump Input */}
            <div className="mt-4 flex items-center justify-between gap-3 pt-2 font-mono text-[11px] text-gray-400">
              <input
                type="text"
                value={customQuery}
                onChange={(e) => {
                  const val = e.target.value
                  setCustomQuery(val)
                  const lower = val.toLowerCase()
                  if (lower.includes("project") || lower.includes("game") || lower.includes("bot"))
                    setSelectedPromptIdx(1)
                  else if (lower.includes("stack") || lower.includes("skill"))
                    setSelectedPromptIdx(2)
                  else if (lower.includes("contact") || lower.includes("email"))
                    setSelectedPromptIdx(3)
                  else if (val.trim()) setSelectedPromptIdx(0)
                }}
                placeholder="Type a keyword (projects, stack, contact)..."
                className="flex-1 bg-transparent font-mono text-[12px] text-ink placeholder:text-gray-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  setAskOpen(false)
                  openCertificateModal("image")
                }}
                className="text-ink underline underline-offset-4"
              >
                view oracle cert ↗
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────── TOP-LAYER <DIALOG> LIGHTBOX (Projects & Certificate) ─────────────── */}
      <dialog
        ref={dialogRef}
        onClick={handleDialogClick}
        className="case-study-dialog"
        aria-label={
          modalState?.type === "certificate"
            ? "Oracle Academy Java Fundamentals Certificate"
            : modalState?.project?.title ?? "Project Lightbox"
        }
      >
        {modalState?.type === "project" && modalState.project && (
          <div className="flex max-h-[90vh] flex-col overflow-hidden">
            {/* Dialog Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 bg-white px-5 py-3.5">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="rounded-full bg-ink px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-white">
                  {modalState.project.num}
                </span>
                <h3 className="truncate font-pixel text-base text-ink">
                  {modalState.project.title}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                {modalState.project.images.length > 1 &&
                  modalState.project.images.map((img, idx) => (
                    <button
                      key={img.src}
                      type="button"
                      onClick={() =>
                        setModalState((prev) =>
                          prev ? { ...prev, initialImageIndex: idx } : null
                        )
                      }
                      className={`rounded-full px-3 py-1 font-mono text-[10.5px] uppercase tracking-wider ${
                        modalState.initialImageIndex === idx
                          ? "bg-ink text-white"
                          : "border border-gray-200 bg-gray-50 text-gray-600 hover:text-ink"
                      }`}
                    >
                      {img.label}
                    </button>
                  ))}
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 font-mono text-[11px] text-ink hover:bg-gray-200"
                >
                  Close ✕
                </button>
              </div>
            </div>

            {/* Dialog Body */}
            <div className="flex-1 overflow-y-auto p-5">
              {currentModalImage && (
                <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-gray-950 p-3">
                  <img
                    src={currentModalImage.src}
                    alt={currentModalImage.caption}
                    className="max-h-[62vh] w-auto max-w-full object-contain"
                  />
                  <p className="mt-2.5 text-center font-mono text-[11.5px] text-gray-400">
                    {currentModalImage.caption}
                  </p>
                </div>
              )}

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-12">
                <div className="sm:col-span-7">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-gray-400">
                    System Overview
                  </div>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-gray-600">
                    {modalState.project.detailText}
                  </p>
                  <p className="mt-2 font-mono text-[11.5px] text-gray-500">
                    {modalState.project.detailNote}
                  </p>
                </div>
                <div className="sm:col-span-5">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-gray-400">
                    Key Capabilities
                  </div>
                  <ul className="mt-1.5 space-y-1 font-mono text-[11.5px] text-gray-600">
                    {modalState.project.features.map((f) => (
                      <li key={f}>→ {f}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {modalState?.type === "certificate" && (
          <div className="flex max-h-[90vh] flex-col overflow-hidden">
            {/* Certificate Dialog Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 bg-white px-5 py-3.5">
              <div className="flex items-center gap-2.5">
                <span className="rounded-full bg-ink px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-white">
                  Oracle Academy
                </span>
                <h3 className="font-pixel text-base text-ink">
                  Java Fundamentals — Course Completion Certificate
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setModalState((prev) => (prev ? { ...prev, certTab: "image" } : null))
                  }
                  className={`rounded-full px-3 py-1 font-mono text-[10.5px] uppercase tracking-wider ${
                    modalState.certTab !== "pdf"
                      ? "bg-ink text-white"
                      : "border border-gray-200 bg-gray-50 text-gray-600 hover:text-ink"
                  }`}
                >
                  High-Res Image
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setModalState((prev) => (prev ? { ...prev, certTab: "pdf" } : null))
                  }
                  className={`rounded-full px-3 py-1 font-mono text-[10.5px] uppercase tracking-wider ${
                    modalState.certTab === "pdf"
                      ? "bg-ink text-white"
                      : "border border-gray-200 bg-gray-50 text-gray-600 hover:text-ink"
                  }`}
                >
                  PDF Reader
                </button>
                <a
                  href={PROFILE_DATA.certificatePdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 font-mono text-[10.5px] uppercase tracking-wider text-ink hover:bg-gray-200"
                >
                  Open PDF ↗
                </a>
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 font-mono text-[11px] text-ink hover:bg-gray-200"
                >
                  Close ✕
                </button>
              </div>
            </div>

            {/* Certificate Dialog Body */}
            <div className="flex-1 overflow-y-auto bg-gray-100 p-4 sm:p-6">
              {modalState.certTab === "pdf" ? (
                <iframe
                  src={PROFILE_DATA.certificatePdf}
                  title="Oracle Academy Java Fundamentals Certificate PDF"
                  className="h-[72vh] w-full rounded-xl border border-gray-200 bg-white"
                />
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <img
                    src={PROFILE_DATA.certificatePreview}
                    alt="Oracle Academy Java Fundamentals Certificate awarded to Steven Floyd Sendrijas"
                    className="max-h-[72vh] w-auto max-w-full rounded-xl border border-gray-200 bg-white object-contain shadow-lg"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </dialog>
    </div>
  )
}

export default App
