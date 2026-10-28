import React, { useEffect, useRef, useState } from "react"
import { flushSync } from "react-dom"
import { AnimatePresence, motion } from "framer-motion"
import {
  ArrowUpRight,
  Award,
  Check,
  ChevronDown,
  Copy,
  Eye,
  FileText,
  Github,
  Grid,
  ListFilter,
  Mail,
  MapPin,
  Menu,
  Moon,
  Pause,
  Phone,
  Play,
  Send,
  Sun,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import {
  CERTIFICATE_DATA,
  PROFILE_DATA,
  PROJECTS_DATA,
  SKILL_DOMAINS,
  TECH_MARQUEE_ITEMS,
  type ProjectCategory,
  type ProjectItem,
} from "@/data/portfolioData"
import {
  closeTopLayer,
  hideDiscreteElement,
  showDiscreteElement,
} from "@/lib/utils"

const NAV_ITEMS = [
  { id: "projects", index: "01", label: "Selected Work" },
  { id: "skills", index: "02", label: "Technical Ledger" },
  { id: "certificate", index: "03", label: "Credentials" },
  { id: "contact", index: "04", label: "Correspondence" },
]

const CATEGORY_TABS: { id: ProjectCategory; label: string; count: number }[] = [
  { id: "all", label: "All Works", count: PROJECTS_DATA.length },
  {
    id: "bots",
    label: "Voice & AI Bots",
    count: PROJECTS_DATA.filter((p) => p.category === "bots").length,
  },
  {
    id: "games",
    label: "Games & Mobile",
    count: PROJECTS_DATA.filter((p) => p.category === "games").length,
  },
  {
    id: "web",
    label: "Web Systems",
    count: PROJECTS_DATA.filter((p) => p.category === "web").length,
  },
]

export function App() {
  const [theme, setTheme] = useState<"dark" | "light">("dark")
  const [activeNav, setActiveNav] = useState<string>("projects")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [localTime, setLocalTime] = useState<string>("")
  const [marqueePaused, setMarqueePaused] = useState(false)

  // Projects state
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>("all")
  const [layoutMode, setLayoutMode] = useState<"editorial" | "compact">("editorial")
  const [cardImageIndex, setCardImageIndex] = useState<Record<string, number>>({})
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({})

  // Native <dialog> modal state
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null)
  const [modalImageIdx, setModalImageIdx] = useState(0)
  const dialogRef = useRef<HTMLDialogElement | null>(null)
  const projectsHeadingRef = useRef<HTMLHeadingElement | null>(null)
  const detailRefs = useRef<Record<string, HTMLDivElement | null>>({})

  // Contact state
  const [copiedField, setCopiedField] = useState<"email" | "phone" | null>(null)
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [formSubmitted, setFormSubmitted] = useState(false)

  // 1. Scroll progress bar fallback for browsers without CSS animation-timeline: scroll()
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      !window.CSS?.supports?.("animation-timeline", "scroll()")
    ) {
      const progress = document.querySelector<HTMLElement>("#scroll-progress")
      if (!progress) return

      const onScroll = () => {
        const scrollable =
          document.documentElement.scrollHeight - window.innerHeight
        const scrolled = window.scrollY
        const ratio =
          scrollable > 0 ? Math.min(1, Math.max(0, scrolled / scrollable)) : 0
        progress.style.transform = `scaleX(${ratio})`
      }

      window.addEventListener("scroll", onScroll, { passive: true })
      onScroll()
      return () => window.removeEventListener("scroll", onScroll)
    }
  }, [])

  // 2. Live Cebu (UTC+8) clock in header
  useEffect(() => {
    const updateClock = () => {
      try {
        const formatter = new Intl.DateTimeFormat("en-US", {
          timeZone: "Asia/Manila",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
        setLocalTime(formatter.format(new Date()))
      } catch {
        setLocalTime("UTC+8")
      }
    }
    updateClock()
    const timer = window.setInterval(updateClock, 30000)
    return () => window.clearInterval(timer)
  }, [])

  // 3. Active section IntersectionObserver
  useEffect(() => {
    const sections = NAV_ITEMS.map((item) =>
      document.getElementById(item.id)
    ).filter(Boolean) as HTMLElement[]

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]?.target?.id) {
          setActiveNav(visible[0].target.id)
        }
      },
      { threshold: [0.15, 0.4], rootMargin: "-80px 0px -40% 0px" }
    )

    sections.forEach((sec) => observer.observe(sec))
    return () => observer.disconnect()
  }, [])

  // 4. Native <dialog> light-dismiss fallback & cancel animation handler
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    const handleCancel = (event: Event) => {
      event.preventDefault()
      closeTopLayer(dialog)
    }

    const handleBackdropClick = (event: MouseEvent) => {
      if ("closedBy" in HTMLDialogElement.prototype) return
      if (event.target !== dialog) return

      const rect = dialog.getBoundingClientRect()
      const isDialogContent =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width

      if (isDialogContent) return
      closeTopLayer(dialog)
    }

    dialog.addEventListener("cancel", handleCancel)
    dialog.addEventListener("click", handleBackdropClick)
    return () => {
      dialog.removeEventListener("cancel", handleCancel)
      dialog.removeEventListener("click", handleBackdropClick)
    }
  }, [])

  // Theme switch with View Transition fallback
  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark"
    const applyTheme = () => {
      setTheme(nextTheme)
      const root = document.documentElement
      if (nextTheme === "dark") {
        root.classList.add("dark")
        root.setAttribute("data-theme", "dark")
      } else {
        root.classList.remove("dark")
        root.setAttribute("data-theme", "light")
      }
    }

    if (document.startViewTransition) {
      document.startViewTransition(() => {
        flushSync(() => applyTheme())
      })
    } else {
      applyTheme()
    }
  }

  // Filter projects with View Transitions API + Mandatory Focus Routing
  const handleCategoryChange = (category: ProjectCategory) => {
    if (category === activeCategory) return

    if (!document.startViewTransition) {
      setActiveCategory(category)
      projectsHeadingRef.current?.focus({ preventScroll: true })
      return
    }

    const transition = document.startViewTransition(() => {
      flushSync(() => {
        setActiveCategory(category)
      })
    })

    transition.finished.finally(() => {
      projectsHeadingRef.current?.focus({ preventScroll: true })
    })
  }

  // Discrete entry/exit toggle for architecture drawer on project row
  const toggleCardArchitecture = async (projectId: string) => {
    const el = detailRefs.current[projectId]
    if (!el) return

    const isCurrentlyOpen = Boolean(expandedCards[projectId])
    if (isCurrentlyOpen) {
      setExpandedCards((prev) => ({ ...prev, [projectId]: false }))
      await hideDiscreteElement(el)
    } else {
      showDiscreteElement(el)
      setExpandedCards((prev) => ({ ...prev, [projectId]: true }))
    }
  }

  // Open top-layer <dialog> modal
  const openProjectModal = (project: ProjectItem, initialImgIdx = 0) => {
    setSelectedProject(project)
    setModalImageIdx(initialImgIdx)
    requestAnimationFrame(() => {
      const dialog = dialogRef.current
      if (dialog && !dialog.open) {
        dialog.showModal()
      }
    })
  }

  const closeProjectModal = () => {
    const dialog = dialogRef.current
    if (dialog) {
      closeTopLayer(dialog)
    }
  }

  const copyToClipboard = async (value: string, field: "email" | "phone") => {
    try {
      await navigator.clipboard.writeText(value)
      setCopiedField(field)
      window.setTimeout(() => setCopiedField(null), 2200)
    } catch {
      // Fallback
    }
  }

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const subject = encodeURIComponent(
      contactForm.subject || `Portfolio Inquiry from ${contactForm.name}`
    )
    const body = encodeURIComponent(
      `Name: ${contactForm.name}\nEmail: ${contactForm.email}\n\n${contactForm.message}`
    )
    window.location.href = `mailto:${PROFILE_DATA.email}?subject=${subject}&body=${body}`
    setFormSubmitted(true)
    window.setTimeout(() => setFormSubmitted(false), 4000)
  }

  const filteredProjects =
    activeCategory === "all"
      ? PROJECTS_DATA
      : PROJECTS_DATA.filter((p) => p.category === activeCategory)

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Decorative Scroll Progress Bar (scroll-progress-indicator) */}
      <div id="scroll-progress" aria-hidden="true" />

      {/* =================================================================
          ARCHITECTURAL TOP INDEX BAR
         ================================================================= */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left: Identity & Location */}
          <div className="flex items-center gap-6">
            <a
              href="#home"
              className="flex items-baseline gap-2 focus:outline-none"
            >
              <span className="font-display text-base font-extrabold uppercase tracking-tight">
                Steven Sendrijas
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            </a>

            <div className="hidden items-center gap-2 border-l border-border pl-6 font-mono text-[11px] text-muted-foreground xl:flex">
              <MapPin className="h-3 w-3 text-primary" />
              <span>CEBU, PH</span>
              {localTime && (
                <>
                  <span>—</span>
                  <span className="text-foreground">{localTime}</span>
                </>
              )}
            </div>
          </div>

          {/* Center: Numbered Section Index */}
          <nav
            aria-label="Primary Navigation"
            className="hidden items-center gap-7 md:flex"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = activeNav === item.id
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setActiveNav(item.id)}
                  className={`relative py-5 font-mono text-xs uppercase tracking-wider transition-colors ${
                    isActive
                      ? "font-semibold text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className="mr-1.5 text-primary">{item.index}/</span>
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.span
                      layoutId="editorial-nav-line"
                      transition={{ type: "spring", stiffness: 400, damping: 34 }}
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary"
                    />
                  )}
                </a>
              )
            })}
          </nav>

          {/* Right: Theme Switcher & GitHub */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-secondary/50 px-3 font-mono text-[11px] uppercase tracking-wider text-foreground transition-colors hover:border-primary/50"
            >
              {theme === "dark" ? (
                <>
                  <Sun className="h-3.5 w-3.5 text-[#d4a359]" />
                  <span className="hidden sm:inline">Paper</span>
                </>
              ) : (
                <>
                  <Moon className="h-3.5 w-3.5 text-primary" />
                  <span className="hidden sm:inline">Carbon</span>
                </>
              )}
            </button>

            <a
              href={PROFILE_DATA.github}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex"
            >
              <Button variant="outline" size="sm">
                <Github className="h-3.5 w-3.5" />
                <span>GitHub</span>
                <ArrowUpRight className="h-3 w-3" />
              </Button>
            </a>

            <Button
              variant="outline"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-border bg-background px-4 py-4 md:hidden"
            >
              <div className="flex flex-col space-y-2">
                {NAV_ITEMS.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={() => {
                      setActiveNav(item.id)
                      setMobileMenuOpen(false)
                    }}
                    className="flex items-center justify-between rounded-md px-3 py-2 font-mono text-xs uppercase tracking-wider hover:bg-secondary"
                  >
                    <span>
                      <span className="mr-2 text-primary">{item.index}/</span>
                      {item.label}
                    </span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main>
        {/* =================================================================
            ASYMMETRIC EDITORIAL HERO & FIELD DOSSIER
           ================================================================= */}
        <section
          id="home"
          className="mx-auto max-w-7xl border-b border-border px-4 pt-10 pb-16 sm:px-6 lg:px-8 lg:pt-16 lg:pb-24"
        >
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
            {/* Left 8 Columns: Editorial Statement & Featured Index */}
            <div className=" flex flex-col justify-between lg:col-span-8 lg:border-r lg:border-border lg:pr-10">
              <div>
                <div className="flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  <span className="inline-flex items-center gap-2 text-primary">
                    <span className="h-2 w-2 rounded-full bg-[#4d9375]" />
                    <span>Available for Software &amp; Game Engineering</span>
                  </span>
                  <span>/</span>
                  <span>FOLIO EDITION 2026</span>
                </div>

                <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.06] tracking-tight sm:text-6xl lg:text-[4.1rem]">
                  Engineering{" "}
                  <span className="font-serif-editorial italic font-normal text-primary">
                    full-stack platforms,
                  </span>{" "}
                  2D RPGs &amp;{" "}
                  <span className="font-serif-editorial italic font-normal text-[#d4a359]">
                    real-time voice bots.
                  </span>
                </h1>

                <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                  I&apos;m{" "}
                  <strong className="font-semibold text-foreground">
                    {PROFILE_DATA.name}
                  </strong>
                  , a developer based in Cebu, Philippines. I build software from
                  the database schema and audio pipeline up to the user interface—whether
                  that&apos;s a 48kHz Opus Discord music &amp; Bisaya AI bot, a 1,449-question
                  Unity 6 RPG, or a multi-source HLS streaming platform.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <a href="#projects">
                    <Button size="lg">
                      <span>Inspect Selected Work (06)</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </a>
                  <a
                    href={PROFILE_DATA.certificatePdf}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button variant="outline" size="lg">
                      <FileText className="h-3.5 w-3.5 text-primary" />
                      <span>Oracle Java Certificate</span>
                    </Button>
                  </a>
                </div>
              </div>

              {/* Interactive Featured Index Table */}
              <div className="mt-12 border-t border-border pt-6">
                <div className="mb-3 flex items-center justify-between font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                  <span>RECENT SHIPPED SYSTEMS (CLICK TO INSPECT)</span>
                  <span>2025 — 2026</span>
                </div>

                <div className="divide-y divide-border border-y border-border">
                  {PROJECTS_DATA.slice(0, 3).map((proj) => (
                    <button
                      key={proj.id}
                      type="button"
                      onClick={() => openProjectModal(proj, 0)}
                      className="group flex w-full items-center justify-between py-3.5 text-left transition-colors hover:bg-secondary/40 px-2"
                    >
                      <div className="flex items-baseline gap-4">
                        <span className="font-mono text-xs font-semibold text-primary">
                          {proj.index}
                        </span>
                        <div>
                          <span className="font-display text-base font-bold text-foreground group-hover:text-primary transition-colors">
                            {proj.shortTitle}
                          </span>
                          <span className="ml-3 hidden font-mono text-xs text-muted-foreground sm:inline">
                            {proj.subtitle.split("•").slice(0, 3).join("•")}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary">{proj.categoryLabel}</Badge>
                        <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 4 Columns: Portrait & Architectural Field Dossier */}
            <div className="flex flex-col justify-between lg:col-span-4">
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center justify-between border-b border-border pb-3 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  <span>ENGINEER DOSSIER</span>
                  <span className="text-primary">ID // SFS-23</span>
                </div>

                <div className="mt-4 overflow-hidden rounded-lg border border-border bg-secondary">
                  <img
                    src={PROFILE_DATA.avatar}
                    alt={PROFILE_DATA.name}
                    className="h-64 w-full object-cover object-top"
                  />
                </div>

                <dl className="mt-5 divide-y divide-border font-mono text-xs">
                  <div className="flex justify-between py-2.5">
                    <dt className="text-muted-foreground">NAME</dt>
                    <dd className="font-semibold text-foreground">
                      {PROFILE_DATA.shortName}
                    </dd>
                  </div>
                  <div className="flex justify-between py-2.5">
                    <dt className="text-muted-foreground">EDUCATION</dt>
                    <dd className="text-foreground">{PROFILE_DATA.education}</dd>
                  </div>
                  <div className="flex justify-between py-2.5">
                    <dt className="text-muted-foreground">BASE</dt>
                    <dd className="text-foreground">{PROFILE_DATA.location}</dd>
                  </div>
                  <div className="flex justify-between py-2.5">
                    <dt className="text-muted-foreground">CORE STACK</dt>
                    <dd className="text-right text-foreground">
                      React, TS, Unity C#, Node, PG
                    </dd>
                  </div>
                  <div className="flex justify-between pt-2.5">
                    <dt className="text-muted-foreground">CREDENTIAL</dt>
                    <dd className="font-semibold text-[#d4a359]">
                      Oracle Academy Java
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================
            01 // SELECTED WORKS (CASE STUDY SPREADS & COMPACT ARCHIVE)
            (group-element-transitions, same-document-transitions, animate-element-entry-exit)
           ================================================================= */}
        <section
          id="projects"
          className="mx-auto max-w-7xl border-b border-border px-4 py-20 sm:px-6 lg:px-8"
        >
          {/* Section Header & Controls */}
          <div className="flex flex-col justify-between gap-6 border-b border-border pb-8 lg:flex-row lg:items-end">
            <div>
              <div className="font-mono text-xs font-semibold uppercase tracking-widest text-primary">
                01 // SELECTED ENGINEERING WORK
              </div>
              <h2
                id="projects-grid-heading"
                ref={projectsHeadingRef}
                tabIndex={-1}
                className="mt-2 font-display text-3xl font-extrabold tracking-tight outline-none sm:text-5xl"
              >
                Production Systems{" "}
                <span className="font-serif-editorial italic font-normal text-muted-foreground">
                  &amp; Case Studies
                </span>
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Category Filter Tabs (View Transitions API) */}
              <div
                role="tablist"
                aria-label="Filter works by domain"
                className="inline-flex flex-wrap gap-1 rounded-lg border border-border bg-secondary/50 p-1"
              >
                {CATEGORY_TABS.map((tab) => {
                  const active = activeCategory === tab.id
                  return (
                    <button
                      key={tab.id}
                      role="tab"
                      type="button"
                      aria-selected={active}
                      onClick={() => handleCategoryChange(tab.id)}
                      className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-all ${
                        active
                          ? "bg-primary text-primary-foreground font-semibold"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span className="opacity-75">[{tab.count}]</span>
                    </button>
                  )
                })}
              </div>

              {/* View Mode Switcher */}
              <div className="hidden items-center rounded-lg border border-border bg-secondary/50 p-1 sm:inline-flex">
                <button
                  type="button"
                  onClick={() => setLayoutMode("editorial")}
                  className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 font-mono text-[11px] uppercase ${
                    layoutMode === "editorial"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  title="Editorial Case Study View"
                >
                  <ListFilter className="h-3.5 w-3.5" />
                  <span>Spread</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLayoutMode("compact")}
                  className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 font-mono text-[11px] uppercase ${
                    layoutMode === "compact"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  title="Compact 2-Column Grid"
                >
                  <Grid className="h-3.5 w-3.5" />
                  <span>Grid</span>
                </button>
              </div>
            </div>
          </div>

          {/* Projects List / Grid */}
          <div
            className={
              layoutMode === "editorial"
                ? "divide-y divide-border"
                : "mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2"
            }
          >
            {filteredProjects.map((project, projIdx) => {
              const currentImgIdx = cardImageIndex[project.id] ?? 0
              const activeImage =
                project.images[currentImgIdx] ?? project.images[0]
              const isExpanded = Boolean(expandedCards[project.id])
              const isEven = projIdx % 2 === 1

              if (layoutMode === "compact") {
                return (
                  <Card
                    key={project.id}
                    style={{ viewTransitionName: project.vtName }}
                    className="project-card-vt flex flex-col justify-between overflow-hidden p-6"
                  >
                    <div>
                      <div className="flex items-center justify-between font-mono text-xs text-muted-foreground">
                        <span className="font-bold text-primary">
                          {project.index} // {project.categoryLabel}
                        </span>
                        <span>{project.year}</span>
                      </div>
                      <h3 className="mt-2 font-display text-2xl font-bold">
                        {project.title}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {project.description}
                      </p>
                      <div className="mt-4 overflow-hidden rounded-lg border border-border bg-black">
                        <img
                          src={activeImage.src}
                          alt={activeImage.caption}
                          loading="lazy"
                          onClick={() => openProjectModal(project, currentImgIdx)}
                          className="aspect-video w-full cursor-pointer object-cover object-top transition-transform duration-500 hover:scale-[1.02]"
                        />
                      </div>
                    </div>
                    <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                      <div className="flex flex-wrap gap-1.5">
                        {project.techStack.slice(0, 4).map((t) => (
                          <Badge key={t} variant="secondary">
                            {t}
                          </Badge>
                        ))}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openProjectModal(project, currentImgIdx)}
                      >
                        <span>Inspect</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </Card>
                )
              }

              return (
                <article
                  key={project.id}
                  style={{ viewTransitionName: project.vtName }}
                  className="project-card-vt py-12 first:pt-10 last:pb-4"
                >
                  <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-10">
                    {/* Narrative & Engineering Column (5 cols) */}
                    <div
                      className={`lg:col-span-5 ${
                        isEven ? "lg:order-2" : "lg:order-1"
                      }`}
                    >
                      <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs">
                        <span className="text-base font-bold text-primary">
                          {project.index}
                        </span>
                        <span className="text-muted-foreground">/</span>
                        <Badge variant="default">{project.categoryLabel}</Badge>
                        {project.isNew && (
                          <Badge variant="brass">SHIPPED {project.year}</Badge>
                        )}
                        <span className="ml-auto font-mono text-xs text-muted-foreground">
                          {project.role}
                        </span>
                      </div>

                      <h3 className="mt-4 font-display text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">
                        {project.title}
                      </h3>
                      <p className="mt-1.5 font-mono text-xs text-[#d4a359]">
                        {project.subtitle}
                      </p>

                      <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                        {project.description}
                      </p>

                      {/* Architectural Telemetry Ledger */}
                      <div className="mt-6 grid grid-cols-3 divide-x divide-border rounded-lg border border-border bg-card/60">
                        {project.metrics.map((m) => (
                          <div key={m.label} className="p-3">
                            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                              {m.label}
                            </p>
                            <p className="mt-1 font-mono text-xs font-semibold text-foreground">
                              {m.value}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Tech Stack Chips */}
                      <div className="mt-5 flex flex-wrap gap-1.5">
                        {project.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="rounded border border-border bg-secondary/40 px-2.5 py-1 font-mono text-[11px] text-foreground/90"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Discrete Expandable Architecture Notes (animate-element-entry-exit) */}
                      <div
                        ref={(el) => {
                          detailRefs.current[project.id] = el
                        }}
                        hidden
                        className="project-details mt-5 rounded-lg border border-primary/35 bg-card p-4 text-xs leading-relaxed"
                      >
                        <div className="font-mono text-[11px] font-semibold uppercase tracking-wider text-primary">
                          Architecture &amp; Implementation Notes
                        </div>
                        <p className="mt-1.5 text-muted-foreground">
                          {project.architectureSummary}
                        </p>
                        <ul className="mt-3 space-y-1.5 text-foreground/90">
                          {project.highlights.map((hl) => (
                            <li key={hl} className="flex items-start gap-2">
                              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                              <span>{hl}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-6 flex flex-wrap items-center gap-3">
                        <Button
                          onClick={() => openProjectModal(project, currentImgIdx)}
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>Case Study &amp; Fullscreen</span>
                        </Button>

                        <Button
                          variant="outline"
                          onClick={() => toggleCardArchitecture(project.id)}
                          aria-expanded={isExpanded}
                        >
                          <ChevronDown
                            className={`h-3.5 w-3.5 transition-transform duration-300 ${
                              isExpanded ? "rotate-180 text-primary" : ""
                            }`}
                          />
                          <span>
                            {isExpanded
                              ? "Hide Architecture"
                              : "Architecture Notes"}
                          </span>
                        </Button>
                      </div>
                    </div>

                    {/* Interactive Visual Stage Column (7 cols) */}
                    <div
                      className={`lg:col-span-7 ${
                        isEven ? "lg:order-1" : "lg:order-2"
                      }`}
                    >
                      <Card className="overflow-hidden border-border bg-card p-2 sm:p-3">
                        <div className="relative overflow-hidden rounded-lg border border-border bg-[#0a0a09]">
                          <img
                            src={activeImage.src}
                            alt={activeImage.caption}
                            loading="lazy"
                            onClick={() =>
                              openProjectModal(project, currentImgIdx)
                            }
                            className="aspect-video w-full cursor-pointer object-cover object-top transition-transform duration-500 hover:scale-[1.01]"
                          />
                        </div>

                        {/* Caption & Multi-Screen Switcher Bar */}
                        <div className="mt-3 flex flex-col justify-between gap-3 px-1 sm:flex-row sm:items-center">
                          <p className="font-mono text-[11px] text-muted-foreground">
                            <span className="text-primary">FIG {project.index}.{currentImgIdx + 1}</span>{" "}
                            — {activeImage.caption}
                          </p>

                          {project.images.length > 1 && (
                            <div className="flex shrink-0 items-center gap-1.5">
                              {project.images.map((img, idx) => (
                                <button
                                  key={img.src}
                                  type="button"
                                  onClick={() =>
                                    setCardImageIndex((prev) => ({
                                      ...prev,
                                      [project.id]: idx,
                                    }))
                                  }
                                  className={`rounded px-2.5 py-1 font-mono text-[11px] uppercase transition-colors ${
                                    currentImgIdx === idx
                                      ? "bg-primary text-primary-foreground font-semibold"
                                      : "border border-border bg-secondary/60 text-muted-foreground hover:text-foreground"
                                  }`}
                                >
                                  View 0{idx + 1}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </Card>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        {/* =================================================================
            02 // TECHNICAL LEDGER & SPECIFICATION MATRIX
           ================================================================= */}
        <section
          id="skills"
          className="mx-auto max-w-7xl border-b border-border px-4 py-20 sm:px-6 lg:px-8"
        >
          <div className="flex flex-col justify-between gap-6 border-b border-border pb-8 lg:flex-row lg:items-end">
            <div>
              <div className="font-mono text-xs font-semibold uppercase tracking-widest text-primary">
                02 // TECHNICAL LEDGER
              </div>
              <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight sm:text-5xl">
                Engineering Stack{" "}
                <span className="font-serif-editorial italic font-normal text-muted-foreground">
                  &amp; Capabilities
                </span>
              </h2>
            </div>
            <p className="max-w-md text-sm text-muted-foreground">
              Every tool listed below is actively used in the production repositories
              featured above—spanning web platforms, Unity 2D C# games, and voice bots.
            </p>
          </div>

          {/* 4-Row Architectural Specification Table */}
          <div className="divide-y divide-border">
            {SKILL_DOMAINS.map((domain) => (
              <div
                key={domain.id}
                className="grid grid-cols-1 gap-6 py-8 lg:grid-cols-12 lg:items-start"
              >
                <div className="lg:col-span-4">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-xs font-bold text-primary">
                      {domain.index} /
                    </span>
                    <h3 className="font-display text-xl font-bold">
                      {domain.title}
                    </h3>
                  </div>
                  <p className="mt-2 font-mono text-[11px] text-[#d4a359]">
                    Production: {domain.appliedIn}
                  </p>
                </div>

                <div className="lg:col-span-4">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {domain.summary}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 lg:col-span-4">
                  {domain.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-md border border-border bg-card px-3 py-1.5 font-mono text-xs font-medium text-foreground"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Accessible Specification Ticker Strip (motion guide) */}
          <div className="mt-8 rounded-xl border border-border bg-card/50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                CONTINUOUS STACK INDEX
              </span>
              <button
                type="button"
                onClick={() => setMarqueePaused((prev) => !prev)}
                aria-pressed={marqueePaused}
                className="inline-flex items-center gap-1.5 rounded border border-border bg-background px-2.5 py-1 font-mono text-[11px] uppercase text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
              >
                {marqueePaused ? (
                  <>
                    <Play className="h-3 w-3 text-primary" />
                    <span>Resume Ticker</span>
                  </>
                ) : (
                  <>
                    <Pause className="h-3 w-3 text-primary" />
                    <span>Pause Ticker</span>
                  </>
                )}
              </button>
            </div>

            <div className="overflow-hidden border-t border-border pt-3">
              <div
                className="marquee-track gap-6"
                data-paused={marqueePaused ? "true" : "false"}
              >
                {[...TECH_MARQUEE_ITEMS, ...TECH_MARQUEE_ITEMS].map(
                  (item, index) => (
                    <div
                      key={`${item}-${index}`}
                      className="inline-flex items-center gap-3 font-mono text-xs text-muted-foreground"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <span className="text-foreground">{item}</span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================
            03 // CREDENTIALS & ACADEMIC CERTIFICATION
           ================================================================= */}
        <section
          id="certificate"
          className="mx-auto max-w-7xl border-b border-border px-4 py-20 sm:px-6 lg:px-8"
        >
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <div className="font-mono text-xs font-semibold uppercase tracking-widest text-primary">
                03 // VERIFIED CREDENTIAL
              </div>
              <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                {CERTIFICATE_DATA.title}
              </h2>
              <p className="mt-2 font-mono text-xs text-[#d4a359]">
                ISSUED BY {CERTIFICATE_DATA.issuer.toUpperCase()} —{" "}
                {CERTIFICATE_DATA.date.toUpperCase()}
              </p>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                {CERTIFICATE_DATA.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {CERTIFICATE_DATA.skillsVerified.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    <Check className="h-3 w-3 text-[#4d9375]" />
                    <span>{skill}</span>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4">
              <Card className="p-6">
                <div className="flex items-center justify-between border-b border-border pb-3 font-mono text-xs text-muted-foreground">
                  <span>ORACLE ACADEMY</span>
                  <Award className="h-4 w-4 text-[#d4a359]" />
                </div>
                <p className="mt-4 font-display text-lg font-bold">
                  Official Certificate PDF
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Awarded to Steven Floyd Sendrijas upon completion of Java
                  Fundamentals.
                </p>
                <a
                  href={CERTIFICATE_DATA.pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 block"
                >
                  <Button className="w-full">
                    <FileText className="h-4 w-4" />
                    <span>Open Official Certificate</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </a>
              </Card>
            </div>
          </div>
        </section>

        {/* =================================================================
            04 // DIRECT CORRESPONDENCE & CONTACT
           ================================================================= */}
        <section
          id="contact"
          className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8"
        >
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            {/* Left 5 Columns: Direct Channels */}
            <div className="lg:col-span-5">
              <div className="font-mono text-xs font-semibold uppercase tracking-widest text-primary">
                04 // CORRESPONDENCE
              </div>
              <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                Initiate a{" "}
                <span className="font-serif-editorial italic font-normal text-primary">
                  Conversation.
                </span>
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Available for full-stack web development, Unity 2D game engineering,
                and custom backend or bot architecture roles.
              </p>

              <div className="mt-8 divide-y divide-border border-y border-border">
                <div className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-primary" />
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                        DIRECT EMAIL
                      </p>
                      <a
                        href={`mailto:${PROFILE_DATA.email}`}
                        className="font-mono text-sm font-semibold hover:text-primary"
                      >
                        {PROFILE_DATA.email}
                      </a>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(PROFILE_DATA.email, "email")}
                  >
                    {copiedField === "email" ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-[#4d9375]" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </Button>
                </div>

                <div className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-primary" />
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                        PHONE / MOBILE
                      </p>
                      <a
                        href={`tel:${PROFILE_DATA.phone.replace(/\s+/g, "")}`}
                        className="font-mono text-sm font-semibold hover:text-primary"
                      >
                        {PROFILE_DATA.phone}
                      </a>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(PROFILE_DATA.phone, "phone")}
                  >
                    {copiedField === "phone" ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-[#4d9375]" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </Button>
                </div>

                <div className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-3">
                    <Github className="h-4 w-4 text-primary" />
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                        GITHUB REPOSITORIES
                      </p>
                      <a
                        href={PROFILE_DATA.github}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono text-sm font-semibold hover:text-primary"
                      >
                        github.com/steven23lz
                      </a>
                    </div>
                  </div>
                  <a
                    href={PROFILE_DATA.github}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button variant="outline" size="sm">
                      <span>Profile</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Button>
                  </a>
                </div>
              </div>
            </div>

            {/* Right 7 Columns: Message Form */}
            <div className="lg:col-span-7">
              <Card className="p-6 sm:p-8">
                <div className="border-b border-border pb-4">
                  <h3 className="font-display text-xl font-bold">
                    Direct Dispatch
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Composes a formatted inquiry directly to {PROFILE_DATA.email}.
                  </p>
                </div>

                <form onSubmit={handleContactSubmit} className="mt-6 space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="block font-mono text-[11px] uppercase tracking-wider text-muted-foreground"
                      >
                        Name
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        placeholder="Your name"
                        value={contactForm.name}
                        onChange={(e) =>
                          setContactForm((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        className="mt-1.5 w-full rounded-md border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="contact-email"
                        className="block font-mono text-[11px] uppercase tracking-wider text-muted-foreground"
                      >
                        Return Email
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        placeholder="name@company.com"
                        value={contactForm.email}
                        onChange={(e) =>
                          setContactForm((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        className="mt-1.5 w-full rounded-md border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-subject"
                      className="block font-mono text-[11px] uppercase tracking-wider text-muted-foreground"
                    >
                      Subject / Role
                    </label>
                    <input
                      id="contact-subject"
                      type="text"
                      required
                      placeholder="Software Engineering / Project Inquiry"
                      value={contactForm.subject}
                      onChange={(e) =>
                        setContactForm((prev) => ({
                          ...prev,
                          subject: e.target.value,
                        }))
                      }
                      className="mt-1.5 w-full rounded-md border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block font-mono text-[11px] uppercase tracking-wider text-muted-foreground"
                    >
                      Brief
                    </label>
                    <textarea
                      id="contact-message"
                      rows={4}
                      required
                      placeholder="Outline your project scope, stack, or role details..."
                      value={contactForm.message}
                      onChange={(e) =>
                        setContactForm((prev) => ({
                          ...prev,
                          message: e.target.value,
                        }))
                      }
                      className="mt-1.5 w-full rounded-md border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-4 pt-2">
                    {formSubmitted ? (
                      <span className="inline-flex items-center gap-1.5 font-mono text-xs text-[#4d9375]">
                        <Check className="h-4 w-4" />
                        Opening mail client...
                      </span>
                    ) : (
                      <span className="font-mono text-[11px] text-muted-foreground">
                        CEBU, PH (UTC+8)
                      </span>
                    )}

                    <Button type="submit" size="lg">
                      <Send className="h-3.5 w-3.5" />
                      <span>Send Dispatch</span>
                    </Button>
                  </div>
                </form>
              </Card>
            </div>
          </div>
        </section>
      </main>

      {/* =================================================================
          FOOTER
         ================================================================= */}
      <footer className="border-t border-border bg-card/40 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 font-mono text-xs text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <p>
            © {new Date().getFullYear()} {PROFILE_DATA.name}. Engineered with
            React 18, TypeScript, shadcn/ui &amp; Tailwind CSS.
          </p>
          <div className="flex items-center gap-6">
            <a href="#home" className="hover:text-primary">
              TOP ↑
            </a>
            <a
              href={PROFILE_DATA.github}
              target="_blank"
              rel="noreferrer"
              className="hover:text-primary"
            >
              GITHUB ↗
            </a>
          </div>
        </div>
      </footer>

      {/* =================================================================
          NATIVE TOP-LAYER CASE STUDY DIALOG MODAL
          (light-dismiss-a-dialog + animate-to-from-top-layer)
         ================================================================= */}
      <dialog
        ref={dialogRef}
        {...({
          closedby: "any",
        } as React.DialogHTMLAttributes<HTMLDialogElement>)}
        aria-labelledby="case-study-modal-title"
        className="case-study-dialog m-auto max-h-[90vh] w-[94vw] max-w-5xl overflow-y-auto rounded-xl border border-border bg-card p-0 text-card-foreground shadow-2xl outline-none"
      >
        {selectedProject && (
          <div className="p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                  <span className="font-bold text-primary">
                    CASE STUDY // {selectedProject.index}
                  </span>
                  <span>•</span>
                  <Badge variant="default">
                    {selectedProject.categoryLabel}
                  </Badge>
                  <span className="text-muted-foreground">
                    {selectedProject.year} — {selectedProject.role}
                  </span>
                </div>
                <h3
                  id="case-study-modal-title"
                  className="mt-2 font-display text-2xl font-extrabold sm:text-3xl"
                >
                  {selectedProject.title}
                </h3>
                <p className="mt-1 font-mono text-xs text-[#d4a359]">
                  {selectedProject.subtitle}
                </p>
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={closeProjectModal}
                aria-label="Close case study modal"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Interactive Screenshot Viewer */}
            <div className="mt-6 overflow-hidden rounded-lg border border-border bg-[#080807]">
              <img
                src={
                  (
                    selectedProject.images[modalImageIdx] ??
                    selectedProject.images[0]
                  ).src
                }
                alt={
                  (
                    selectedProject.images[modalImageIdx] ??
                    selectedProject.images[0]
                  ).caption
                }
                className="max-h-[480px] w-full object-contain"
              />
              <div className="flex flex-col items-start justify-between gap-3 border-t border-border bg-card px-4 py-3 sm:flex-row sm:items-center">
                <p className="font-mono text-xs text-muted-foreground">
                  {
                    (
                      selectedProject.images[modalImageIdx] ??
                      selectedProject.images[0]
                    ).caption
                  }
                </p>

                {selectedProject.images.length > 1 && (
                  <div className="flex shrink-0 items-center gap-2">
                    {selectedProject.images.map((img, i) => (
                      <button
                        key={img.src}
                        type="button"
                        onClick={() => setModalImageIdx(i)}
                        className={`rounded px-3 py-1 font-mono text-xs uppercase transition-colors ${
                          modalImageIdx === i
                            ? "bg-primary text-primary-foreground font-semibold"
                            : "border border-border bg-secondary text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Screen 0{i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Case Study Details */}
            <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-12">
              <div className="space-y-5 md:col-span-8">
                <div>
                  <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-primary">
                    01 / Problem &amp; System Scope
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {selectedProject.description}
                  </p>
                </div>

                <div>
                  <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-primary">
                    02 / Architecture &amp; Engineering
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {selectedProject.architectureSummary}
                  </p>
                </div>

                <div>
                  <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-primary">
                    03 / Key Technical Deliverables
                  </h4>
                  <ul className="mt-2.5 space-y-2 text-sm text-foreground/90">
                    {selectedProject.highlights.map((item) => (
                      <li key={item} className="flex items-start gap-2.5">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-4 rounded-lg border border-border bg-secondary/30 p-5 md:col-span-4">
                <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  System Telemetry
                </h4>
                <div className="divide-y divide-border border-y border-border">
                  {selectedProject.metrics.map((m) => (
                    <div key={m.label} className="py-2.5">
                      <p className="font-mono text-[10px] uppercase text-muted-foreground">
                        {m.label}
                      </p>
                      <p className="mt-0.5 font-mono text-sm font-bold text-foreground">
                        {m.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    Production Stack
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {selectedProject.techStack.map((t) => (
                      <span
                        key={t}
                        className="rounded border border-border bg-card px-2.5 py-1 font-mono text-[11px]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end border-t border-border pt-4">
              <Button variant="outline" onClick={closeProjectModal}>
                Close Dossier (Esc)
              </Button>
            </div>
          </div>
        )}
      </dialog>
    </div>
  )
}

export default App
