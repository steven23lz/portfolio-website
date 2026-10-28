import React, { useEffect, useRef, useState } from "react"
import { flushSync } from "react-dom"
import { AnimatePresence, motion } from "framer-motion"
import {
  Award,
  Bot,
  Check,
  ChevronDown,
  ChevronRight,
  Code2,
  Copy,
  Cpu,
  Database,
  ExternalLink,
  Eye,
  FileText,
  Gamepad2,
  Github,
  Globe,
  GraduationCap,
  Layers,
  Layout,
  Mail,
  MapPin,
  Menu,
  Moon,
  Pause,
  Phone,
  Play,
  Send,
  Server,
  Sparkles,
  Sun,
  Terminal,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  CERTIFICATE_DATA,
  HERO_STATS,
  PROFILE_DATA,
  PROJECTS_DATA,
  SKILL_GROUPS,
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
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Tech Stack" },
  { id: "projects", label: "Projects" },
  { id: "certificate", label: "Certification" },
  { id: "contact", label: "Contact" },
]

const CATEGORY_TABS: { id: ProjectCategory; label: string; count: number }[] = [
  { id: "all", label: "All Projects", count: PROJECTS_DATA.length },
  {
    id: "web",
    label: "Web Platforms",
    count: PROJECTS_DATA.filter((p) => p.category === "web").length,
  },
  {
    id: "games",
    label: "Games & Mobile",
    count: PROJECTS_DATA.filter((p) => p.category === "games").length,
  },
  {
    id: "bots",
    label: "Bots & Audio",
    count: PROJECTS_DATA.filter((p) => p.category === "bots").length,
  },
]

export function App() {
  const [theme, setTheme] = useState<"dark" | "light">("dark")
  const [activeNav, setActiveNav] = useState<string>("home")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [roleIndex, setRoleIndex] = useState(0)
  const [marqueePaused, setMarqueePaused] = useState(false)

  // Projects state
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>("all")
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
        const ratio = scrollable > 0 ? Math.min(1, Math.max(0, scrolled / scrollable)) : 0
        progress.style.transform = `scaleX(${ratio})`
      }

      window.addEventListener("scroll", onScroll, { passive: true })
      onScroll()
      return () => window.removeEventListener("scroll", onScroll)
    }
  }, [])

  // 2. Role rotator interval
  useEffect(() => {
    const interval = window.setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % PROFILE_DATA.roles.length)
    }, 3200)
    return () => window.clearInterval(interval)
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
      { threshold: [0.2, 0.45, 0.7], rootMargin: "-80px 0px -35% 0px" }
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

  // Discrete entry/exit toggle for architecture drawer on project card
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

  const renderSkillIcon = (iconName: string) => {
    switch (iconName) {
      case "Layout":
        return <Layout className="h-5 w-5" />
      case "Server":
        return <Server className="h-5 w-5" />
      case "Gamepad2":
        return <Gamepad2 className="h-5 w-5" />
      default:
        return <Database className="h-5 w-5" />
    }
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground selection:bg-cyan-500/30">
      {/* Decorative Scroll Progress Bar (scroll-progress-indicator) */}
      <div id="scroll-progress" aria-hidden="true" />

      {/* Ambient Background Orbs & Grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-40 left-1/4 h-[520px] w-[520px] rounded-full bg-cyan-500/12 blur-[135px]" />
        <div className="absolute top-1/3 -right-32 h-[460px] w-[460px] rounded-full bg-violet-600/12 blur-[140px]" />
        <div className="absolute bottom-0 left-10 h-[400px] w-[400px] rounded-full bg-sky-500/10 blur-[130px]" />
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.045]"
          style={{
            backgroundImage:
              "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* Floating Glassmorphic Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/75 backdrop-blur-xl">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <a
            href="#home"
            className="group flex items-center gap-3 focus:outline-none"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 via-sky-500 to-violet-600 font-display text-base font-extrabold text-white shadow-md shadow-cyan-500/25 transition-transform duration-300 group-hover:scale-105">
              SF
            </div>
            <div>
              <span className="font-display text-lg font-bold tracking-tight">
                Sendrijas
              </span>
              <span className="text-cyan-400 font-display text-lg font-extrabold">
                .dev
              </span>
              <p className="hidden text-[11px] text-muted-foreground sm:block">
                Full-Stack &amp; Unity Game Engineer
              </p>
            </div>
          </a>

          {/* Desktop Navigation Pills */}
          <nav
            aria-label="Primary Navigation"
            className="hidden items-center gap-1 rounded-full border border-border/70 bg-secondary/50 p-1.5 backdrop-blur-md md:flex"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = activeNav === item.id
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setActiveNav(item.id)}
                  className={`relative rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                    isActive
                      ? "text-white"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="active-nav-pill"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 shadow-sm shadow-cyan-500/30"
                    />
                  )}
                  {item.label}
                </a>
              )
            })}
          </nav>

          {/* Header Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
              title="Toggle theme"
              className="rounded-full"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 text-amber-300" />
              ) : (
                <Moon className="h-4 w-4 text-slate-700" />
              )}
            </Button>

            <a
              href={PROFILE_DATA.github}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex"
            >
              <Button variant="outline" size="sm" className="rounded-full">
                <Github className="h-4 w-4" />
                <span>GitHub</span>
              </Button>
            </a>

            <a href="#contact" className="hidden lg:inline-flex">
              <Button size="sm" className="rounded-full">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Hire / Collaborate</span>
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
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-border/60 bg-background/95 px-4 py-4 backdrop-blur-xl md:hidden"
            >
              <div className="flex flex-col gap-2">
                {NAV_ITEMS.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={() => {
                      setActiveNav(item.id)
                      setMobileMenuOpen(false)
                    }}
                    className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                      activeNav === item.id
                        ? "bg-cyan-500/15 text-cyan-400"
                        : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                    }`}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main>
        {/* =================================================================
            HERO SECTION
           ================================================================= */}
        <section
          id="home"
          className="relative mx-auto max-w-7xl px-4 pt-12 pb-20 sm:px-6 lg:px-8 lg:pt-20"
        >
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            {/* Left Column: Headline & CTA */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-7"
            >
              <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-400">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span>Available for Full-Stack &amp; Game Dev Projects</span>
              </div>

              <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-[3.65rem] lg:leading-[1.08]">
                Building{" "}
                <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-500 bg-clip-text text-transparent">
                  High-Impact
                </span>{" "}
                Web Platforms, Games &amp; Bots.
              </h1>

              {/* Animated Role Rotator */}
              <div className="mt-5 flex h-9 items-center gap-2.5 text-lg font-medium text-muted-foreground sm:text-xl">
                <Terminal className="h-5 w-5 shrink-0 text-cyan-400" />
                <span className="text-foreground/80">I am a</span>
                <div className="relative inline-flex overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={PROFILE_DATA.roles[roleIndex]}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      transition={{ duration: 0.28 }}
                      className="font-display font-bold text-cyan-400"
                    >
                      {PROFILE_DATA.roles[roleIndex]}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>

              <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                Hi, I&apos;m{" "}
                <strong className="font-semibold text-foreground">
                  {PROFILE_DATA.name}
                </strong>
                . {PROFILE_DATA.bio}
              </p>

              {/* Quick Flagship Pills */}
              <div className="mt-6 flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Latest Shipped:
                </span>
                {PROJECTS_DATA.slice(0, 3).map((proj) => (
                  <button
                    key={proj.id}
                    type="button"
                    onClick={() => openProjectModal(proj, 0)}
                    className="group inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300 transition-all hover:border-cyan-400 hover:bg-cyan-500/20"
                  >
                    <Sparkles className="h-3 w-3 text-cyan-400" />
                    <span>{proj.shortTitle}</span>
                    <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </button>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a href="#projects">
                  <Button size="lg">
                    <Layers className="h-4 w-4" />
                    <span>Explore Featured Projects</span>
                  </Button>
                </a>
                <a
                  href={PROFILE_DATA.certificatePdf}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button variant="outline" size="lg">
                    <Award className="h-4 w-4 text-cyan-400" />
                    <span>Oracle Java Certificate</span>
                  </Button>
                </a>
                <a
                  href={PROFILE_DATA.github}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button variant="ghost" size="lg">
                    <Github className="h-4 w-4" />
                    <span>@steven23lz</span>
                  </Button>
                </a>
              </div>
            </motion.div>

            {/* Right Column: Interactive Profile & Flagship Preview Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-5"
            >
              <Card className="relative mx-auto max-w-md overflow-hidden border-cyan-500/30 bg-gradient-to-b from-card/95 to-card/75 p-6 shadow-2xl shadow-cyan-500/10">
                <div className="flex items-center justify-between border-b border-border/60 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-rose-500/80" />
                    <span className="h-3 w-3 rounded-full bg-amber-400/80" />
                    <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
                    <span className="ml-2 font-mono text-xs text-muted-foreground">
                      steven-sendrijas.profile.tsx
                    </span>
                  </div>
                  <Badge variant="emerald">BSIT Graduate</Badge>
                </div>

                <div className="mt-5 flex flex-col items-center text-center sm:flex-row sm:text-left gap-5">
                  <div className="relative shrink-0">
                    <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-cyan-500 via-sky-400 to-violet-600 opacity-75 blur-sm" />
                    <img
                      src={PROFILE_DATA.avatar}
                      alt={PROFILE_DATA.name}
                      className="relative h-28 w-28 rounded-2xl object-cover border-2 border-background shadow-lg"
                    />
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-bold">
                      {PROFILE_DATA.name}
                    </h2>
                    <p className="mt-1 text-xs font-medium text-cyan-400">
                      {PROFILE_DATA.title}
                    </p>
                    <div className="mt-2.5 flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-cyan-400" />
                        {PROFILE_DATA.location}
                      </span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1">
                        <GraduationCap className="h-3.5 w-3.5 text-violet-400" />
                        {PROFILE_DATA.education}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Live Stack Telemetry */}
                <div className="mt-6 rounded-xl border border-border/70 bg-secondary/40 p-4">
                  <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                    <span>ACTIVE PRODUCTION STACK</span>
                    <span className="font-mono text-cyan-400">2026.v2</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {[
                      "React 18",
                      "TypeScript",
                      "shadcn/ui",
                      "Tailwind CSS",
                      "Unity 6.5 (URP 2D)",
                      "C#",
                      "Node.js",
                      "PostgreSQL",
                      "Prisma ORM",
                      "Discord.js v14",
                      "Laravel",
                    ].map((tech) => (
                      <span
                        key={tech}
                        className="rounded-lg border border-border/70 bg-background/70 px-2.5 py-1 font-mono text-[11px] font-medium text-foreground/90"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Interactive Featured Preview Strip */}
                <div className="mt-4 grid grid-cols-3 gap-2.5">
                  {PROJECTS_DATA.slice(0, 3).map((proj) => (
                    <button
                      key={proj.id}
                      type="button"
                      onClick={() => openProjectModal(proj, 0)}
                      className="group relative overflow-hidden rounded-xl border border-border/70 bg-secondary/40 p-1.5 text-left transition-all hover:border-cyan-500/60"
                    >
                      <img
                        src={proj.images[0].src}
                        alt={proj.shortTitle}
                        className="h-14 w-full rounded-lg object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <p className="mt-1.5 truncate text-[11px] font-semibold">
                        {proj.shortTitle}
                      </p>
                      <p className="truncate text-[10px] text-cyan-400">
                        {proj.categoryLabel}
                      </p>
                    </button>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Hero Metrics Row */}
          <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {HERO_STATS.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
              >
                <Card className="h-full border-border/60 bg-card/65 p-5">
                  <p className="font-display text-3xl font-extrabold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent sm:text-4xl">
                    {stat.value}
                  </p>
                  <p className="mt-1.5 text-sm font-semibold text-foreground">
                    {stat.label}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {stat.detail}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* =================================================================
            INFINITE TECH MARQUEE WITH ACCESSIBLE PAUSE CONTROL (motion)
           ================================================================= */}
        <section
          aria-label="Technology Marquee"
          className="relative border-y border-border/60 bg-secondary/25 py-4"
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 pb-2 sm:px-6 lg:px-8">
            <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              Core Engineering Ecosystem
            </span>
            <button
              type="button"
              onClick={() => setMarqueePaused((prev) => !prev)}
              aria-pressed={marqueePaused}
              className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-cyan-500/40 hover:text-foreground"
            >
              {marqueePaused ? (
                <>
                  <Play className="h-3 w-3 text-cyan-400" />
                  <span>Resume Motion</span>
                </>
              ) : (
                <>
                  <Pause className="h-3 w-3 text-cyan-400" />
                  <span>Pause Banner</span>
                </>
              )}
            </button>
          </div>

          <div className="overflow-hidden">
            <div
              className="marquee-track gap-3 py-1"
              data-paused={marqueePaused ? "true" : "false"}
            >
              {[...TECH_MARQUEE_ITEMS, ...TECH_MARQUEE_ITEMS].map(
                (item, index) => (
                  <div
                    key={`${item}-${index}`}
                    className="mx-1.5 inline-flex items-center gap-2 rounded-xl border border-border/70 bg-card/80 px-4 py-2 text-xs font-semibold shadow-sm"
                  >
                    <span className="h-2 w-2 rounded-full bg-cyan-400" />
                    <span>{item}</span>
                  </div>
                )
              )}
            </div>
          </div>
        </section>

        {/* =================================================================
            ABOUT SECTION
           ================================================================= */}
        <section
          id="about"
          className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8"
        >
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <Badge variant="default" className="mb-3">
                <Code2 className="h-3.5 w-3.5" />
                <span>About Me &amp; Engineering Philosophy</span>
              </Badge>
              <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                Bridging Full-Stack Web Architecture &amp; Interactive Game Systems
              </h2>
            </div>
            <p className="max-w-xl text-sm text-muted-foreground sm:text-base">
              I enjoy taking complex technical problems—from multi-source video stream
              failover and low-latency Opus audio pipelines to programmatic Unity scene
              builders—and turning them into clean, reliable software.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            <Card className="p-6">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-400">
                <Globe className="h-6 w-6" />
              </div>
              <CardTitle className="text-lg">
                Full-Stack Web Platforms
              </CardTitle>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                Architecting responsive React 18 &amp; TypeScript applications backed by
                Node.js/Express, Laravel, and PostgreSQL—such as{" "}
                <strong className="text-foreground">OverView</strong>&apos;s 3-tier
                Automated HLS Video Discovery Engine and the{" "}
                <strong className="text-foreground">Enlogada Clinic</strong> system.
              </p>
            </Card>

            <Card className="p-6">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-400">
                <Gamepad2 className="h-6 w-6" />
              </div>
              <CardTitle className="text-lg">
                Unity 2D Game &amp; Mobile Dev
              </CardTitle>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                Building deterministic C# gameplay systems in Unity 6.5 (URP 2D)—including{" "}
                <strong className="text-foreground">Trivia Attack</strong>&apos;s
                automated scene builders, frame-accurate sprite animators, 1,449-question
                JSON pipeline, and{" "}
                <strong className="text-foreground">CineBai</strong> on React Native.
              </p>
            </Card>

            <Card className="p-6">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-400">
                <Bot className="h-6 w-6" />
              </div>
              <CardTitle className="text-lg">
                Real-Time Voice Bots &amp; Tooling
              </CardTitle>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                Designing event-driven Discord bots with TypeScript 5.7,{" "}
                <code className="text-xs text-cyan-300">@discordjs/voice</code>, FFmpeg
                Opus pipelines, and Prisma ORM—featuring bulk multi-track query parsing
                and persistent guild state management.
              </p>
            </Card>
          </div>
        </section>

        {/* =================================================================
            SKILLS BENTO GRID SECTION
           ================================================================= */}
        <section
          id="skills"
          className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
        >
          <div className="text-center">
            <Badge variant="violet" className="mb-3">
              <Cpu className="h-3.5 w-3.5" />
              <span>Technical Stack &amp; Capabilities</span>
            </Badge>
            <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              Upgraded Modern Tech Stack
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
              Powered by React 18, TypeScript, shadcn/ui, Tailwind CSS, Framer Motion,
              Unity 6.5 C#, Node.js, Laravel, and PostgreSQL.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
            {SKILL_GROUPS.map((group, idx) => (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
              >
                <Card className="h-full p-6">
                  <div className="flex items-start gap-4">
                    <div
                      className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${group.accent}`}
                    >
                      {renderSkillIcon(group.iconName)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{group.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {group.subtitle}
                      </CardDescription>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    {group.skills.map((skill) => (
                      <div
                        key={skill.name}
                        className="flex items-center justify-between rounded-xl border border-border/70 bg-secondary/35 px-3.5 py-2.5 text-xs"
                      >
                        <span className="font-semibold text-foreground">
                          {skill.name}
                        </span>
                        <span className="rounded-md bg-cyan-500/10 px-2 py-0.5 font-mono text-[10px] font-medium text-cyan-400">
                          {skill.level}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* =================================================================
            FEATURED PROJECTS SECTION
            (group-element-transitions, same-document-transitions, animate-element-entry-exit)
           ================================================================= */}
        <section
          id="projects"
          className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8"
        >
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <Badge variant="default" className="mb-3">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Selected Engineering Work</span>
              </Badge>
              <h2
                id="projects-grid-heading"
                ref={projectsHeadingRef}
                tabIndex={-1}
                className="font-display text-3xl font-extrabold tracking-tight outline-none sm:text-4xl"
              >
                Featured Projects &amp; Systems
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
                Filter across my latest Unity 2D RPG, full-stack streaming &amp; clinical
                platforms, Discord voice bot, and mobile apps. Click any project to
                inspect its architecture and high-resolution screenshots.
              </p>
            </div>

            {/* Category Filter Tabs (View Transitions API enabled) */}
            <div
              role="tablist"
              aria-label="Filter projects by category"
              className="flex flex-wrap gap-2 rounded-2xl border border-border/70 bg-secondary/40 p-1.5"
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
                    className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                      active
                        ? "bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-md shadow-cyan-500/20"
                        : "text-muted-foreground hover:bg-background/60 hover:text-foreground"
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`rounded-full px-1.5 py-0.5 font-mono text-[10px] ${
                        active
                          ? "bg-white/20 text-white"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Projects Grid */}
          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
            {filteredProjects.map((project) => {
              const currentImgIdx = cardImageIndex[project.id] ?? 0
              const activeImage =
                project.images[currentImgIdx] ?? project.images[0]
              const isExpanded = Boolean(expandedCards[project.id])

              return (
                <Card
                  key={project.id}
                  style={{ viewTransitionName: project.vtName }}
                  className="project-card-vt group flex flex-col justify-between overflow-hidden border-border/80 bg-card/85 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-500/10"
                >
                  <div>
                    {/* Visual Screenshot Header */}
                    <div
                      className={`relative overflow-hidden bg-gradient-to-br ${project.accentColor} p-3 sm:p-4`}
                    >
                      <div className="relative overflow-hidden rounded-xl border border-white/10 bg-slate-950 shadow-lg">
                        <img
                          src={activeImage.src}
                          alt={activeImage.caption}
                          loading="lazy"
                          onClick={() =>
                            openProjectModal(project, currentImgIdx)
                          }
                          className="aspect-video w-full cursor-pointer object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
                        />

                        {/* Top Overlay Badges */}
                        <div className="pointer-events-none absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <Badge
                              variant="default"
                              className="bg-slate-950/85 text-cyan-300 backdrop-blur-md"
                            >
                              {project.categoryLabel}
                            </Badge>
                            {project.isNew && (
                              <Badge
                                variant="amber"
                                className="bg-slate-950/85 text-amber-300 backdrop-blur-md"
                              >
                                NEW • {project.year}
                              </Badge>
                            )}
                          </div>
                          <span className="rounded-full bg-slate-950/80 px-2.5 py-1 font-mono text-[11px] font-medium text-slate-200 backdrop-blur-md">
                            {project.year}
                          </span>
                        </div>

                        {/* Multi-Image Switcher Pills inside Card */}
                        {project.images.length > 1 && (
                          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
                            <div className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-slate-950/85 p-1 backdrop-blur-md">
                              {project.images.map((img, idx) => (
                                <button
                                  key={img.src}
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setCardImageIndex((prev) => ({
                                      ...prev,
                                      [project.id]: idx,
                                    }))
                                  }}
                                  className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                                    currentImgIdx === idx
                                      ? "bg-cyan-500 text-slate-950"
                                      : "text-slate-300 hover:text-white"
                                  }`}
                                >
                                  Screen {idx + 1}
                                </button>
                              ))}
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                openProjectModal(project, currentImgIdx)
                              }
                              className="inline-flex items-center gap-1 rounded-xl border border-white/15 bg-slate-950/85 px-3 py-1.5 text-xs font-semibold text-cyan-300 backdrop-blur-md transition-colors hover:bg-cyan-500 hover:text-slate-950"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              <span>Full Preview</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card Content */}
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                        <span className="font-medium text-cyan-400">
                          {project.role}
                        </span>
                      </div>
                      <CardTitle className="mt-1 text-2xl">
                        {project.title}
                      </CardTitle>
                      <p className="text-xs font-semibold text-violet-400">
                        {project.subtitle}
                      </p>
                      <CardDescription className="mt-2.5 text-sm">
                        {project.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Key Metrics Strip */}
                      <div className="grid grid-cols-3 gap-2 rounded-xl border border-border/70 bg-secondary/35 p-3">
                        {project.metrics.map((m) => (
                          <div key={m.label}>
                            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                              {m.label}
                            </p>
                            <p className="mt-0.5 font-mono text-xs font-bold text-foreground">
                              {m.value}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Tech Stack Pills */}
                      <div className="flex flex-wrap gap-1.5">
                        {project.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="rounded-lg border border-border/80 bg-background/60 px-2.5 py-1 font-mono text-[11px] font-medium text-foreground/90"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Discrete Expandable Architecture Specs (animate-element-entry-exit) */}
                      <div
                        ref={(el) => {
                          detailRefs.current[project.id] = el
                        }}
                        hidden
                        className="project-details rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-4 text-xs leading-relaxed"
                      >
                        <p className="font-semibold text-cyan-400">
                          System Architecture &amp; Engineering Highlights:
                        </p>
                        <p className="mt-1.5 text-muted-foreground">
                          {project.architectureSummary}
                        </p>
                        <ul className="mt-2.5 space-y-1.5 text-foreground/90">
                          {project.highlights.map((hl) => (
                            <li key={hl} className="flex items-start gap-2">
                              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-400" />
                              <span>{hl}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </div>

                  <CardFooter className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleCardArchitecture(project.id)}
                      aria-expanded={isExpanded}
                      className="text-xs font-semibold text-muted-foreground hover:text-cyan-400"
                    >
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-300 ${
                          isExpanded ? "rotate-180 text-cyan-400" : ""
                        }`}
                      />
                      <span>
                        {isExpanded
                          ? "Hide Architecture Specs"
                          : "Quick Architecture Specs"}
                      </span>
                    </Button>

                    <Button
                      size="sm"
                      onClick={() => openProjectModal(project, currentImgIdx)}
                    >
                      <Eye className="h-4 w-4" />
                      <span>Case Study &amp; Gallery</span>
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        </section>

        {/* =================================================================
            ORACLE ACADEMY JAVA CERTIFICATE SECTION
           ================================================================= */}
        <section
          id="certificate"
          className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
        >
          <Card className="overflow-hidden border-cyan-500/30 bg-gradient-to-r from-card via-card/95 to-cyan-950/20 p-6 sm:p-10">
            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
              <div className="lg:col-span-8">
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-300">
                  <Award className="h-4 w-4" />
                  <span>{CERTIFICATE_DATA.credentialType}</span>
                </div>

                <h2 className="mt-4 font-display text-2xl font-extrabold sm:text-3xl">
                  {CERTIFICATE_DATA.title}
                </h2>
                <p className="mt-1 text-sm font-semibold text-cyan-400">
                  Issued by {CERTIFICATE_DATA.issuer} • Completed{" "}
                  {CERTIFICATE_DATA.date}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {CERTIFICATE_DATA.description}
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {CERTIFICATE_DATA.skillsVerified.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      <Check className="h-3 w-3 text-emerald-400" />
                      <span>{skill}</span>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-stretch justify-center gap-3 rounded-2xl border border-border/70 bg-background/60 p-6 text-center lg:col-span-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 text-white shadow-lg shadow-amber-500/25">
                  <FileText className="h-8 w-8" />
                </div>
                <p className="font-display text-lg font-bold">
                  Oracle Academy Credential
                </p>
                <p className="text-xs text-muted-foreground">
                  Official PDF certificate awarded to Steven Floyd Sendrijas
                </p>
                <a
                  href={CERTIFICATE_DATA.pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2"
                >
                  <Button className="w-full">
                    <ExternalLink className="h-4 w-4" />
                    <span>Open Official Certificate PDF</span>
                  </Button>
                </a>
              </div>
            </div>
          </Card>
        </section>

        {/* =================================================================
            CONTACT SECTION
           ================================================================= */}
        <section
          id="contact"
          className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8"
        >
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            {/* Contact Details */}
            <div className="lg:col-span-5">
              <Badge variant="default" className="mb-3">
                <Mail className="h-3.5 w-3.5" />
                <span>Get In Touch</span>
              </Badge>
              <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                Let&apos;s Build Something Exceptional Together
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                Whether you need a full-stack React &amp; TypeScript platform, a custom
                Unity 2D game, or a real-time backend service, feel free to reach out
                directly.
              </p>

              <div className="mt-8 space-y-4">
                <Card className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-400">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">
                        Email Address
                      </p>
                      <a
                        href={`mailto:${PROFILE_DATA.email}`}
                        className="font-mono text-sm font-semibold hover:text-cyan-400"
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
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </Button>
                </Card>

                <Card className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/15 text-violet-400">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">
                        Phone / Mobile
                      </p>
                      <a
                        href={`tel:${PROFILE_DATA.phone.replace(/\s+/g, "")}`}
                        className="font-mono text-sm font-semibold hover:text-cyan-400"
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
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </Button>
                </Card>

                <Card className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
                      <Github className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">
                        GitHub Profile
                      </p>
                      <a
                        href={PROFILE_DATA.github}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono text-sm font-semibold hover:text-cyan-400"
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
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span>Visit</span>
                    </Button>
                  </a>
                </Card>
              </div>
            </div>

            {/* Interactive Contact Form */}
            <div className="lg:col-span-7">
              <Card className="p-6 sm:p-8">
                <CardTitle className="text-xl">Send a Direct Message</CardTitle>
                <CardDescription className="mt-1">
                  Fill out the form below to open a pre-addressed message directly to{" "}
                  {PROFILE_DATA.email}.
                </CardDescription>

                <form onSubmit={handleContactSubmit} className="mt-6 space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                      >
                        Your Name
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        placeholder="Juan Dela Cruz"
                        value={contactForm.name}
                        onChange={(e) =>
                          setContactForm((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        className="mt-1.5 w-full rounded-xl border border-border bg-background/80 px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="contact-email"
                        className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                      >
                        Your Email
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={contactForm.email}
                        onChange={(e) =>
                          setContactForm((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        className="mt-1.5 w-full rounded-xl border border-border bg-background/80 px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-subject"
                      className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                    >
                      Subject
                    </label>
                    <input
                      id="contact-subject"
                      type="text"
                      required
                      placeholder="Full-Stack / Game Development Opportunity"
                      value={contactForm.subject}
                      onChange={(e) =>
                        setContactForm((prev) => ({
                          ...prev,
                          subject: e.target.value,
                        }))
                      }
                      className="mt-1.5 w-full rounded-xl border border-border bg-background/80 px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                    >
                      Project Details or Message
                    </label>
                    <textarea
                      id="contact-message"
                      rows={4}
                      required
                      placeholder="Tell me about your project, timeline, or role..."
                      value={contactForm.message}
                      onChange={(e) =>
                        setContactForm((prev) => ({
                          ...prev,
                          message: e.target.value,
                        }))
                      }
                      className="mt-1.5 w-full rounded-xl border border-border bg-background/80 px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-cyan-500"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-4 pt-2">
                    {formSubmitted ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                        <Check className="h-4 w-4" />
                        Opening your mail client...
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        Typically responds within 24 hours.
                      </span>
                    )}

                    <Button type="submit" size="lg">
                      <Send className="h-4 w-4" />
                      <span>Send Message</span>
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
      <footer className="border-t border-border/60 bg-secondary/20 py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-violet-600 font-display text-xs font-extrabold text-white">
              SF
            </div>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()}{" "}
              <strong className="text-foreground">{PROFILE_DATA.name}</strong>.
              Built with React 18, TypeScript, shadcn/ui, Tailwind CSS &amp; Framer
              Motion.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <a href="#home" className="hover:text-cyan-400">
              Back to Top ↑
            </a>
            <span>•</span>
            <a
              href={PROFILE_DATA.github}
              target="_blank"
              rel="noreferrer"
              className="hover:text-cyan-400"
            >
              GitHub
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
        className="case-study-dialog m-auto max-h-[90vh] w-[94vw] max-w-4xl overflow-y-auto rounded-3xl border border-border/80 bg-card p-0 text-card-foreground shadow-2xl outline-none"
      >
        {selectedProject && (
          <div className="p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4 border-b border-border/60 pb-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="default">
                    {selectedProject.categoryLabel}
                  </Badge>
                  <span className="font-mono text-xs text-muted-foreground">
                    {selectedProject.year} • {selectedProject.role}
                  </span>
                </div>
                <h3
                  id="case-study-modal-title"
                  className="mt-2 font-display text-2xl font-extrabold sm:text-3xl"
                >
                  {selectedProject.title}
                </h3>
                <p className="mt-1 text-xs font-semibold text-cyan-400">
                  {selectedProject.subtitle}
                </p>
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={closeProjectModal}
                aria-label="Close case study modal"
                className="shrink-0 rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Interactive Screenshot Viewer */}
            <div className="mt-6 overflow-hidden rounded-2xl border border-border/80 bg-slate-950">
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
                className="max-h-[440px] w-full object-contain"
              />
              <div className="flex flex-col items-start justify-between gap-3 border-t border-white/10 bg-slate-900/90 px-4 py-3 sm:flex-row sm:items-center">
                <p className="text-xs text-slate-300">
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
                        className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${
                          modalImageIdx === i
                            ? "bg-cyan-500 text-slate-950"
                            : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                        }`}
                      >
                        View {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Case Study Details */}
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="space-y-4 md:col-span-2">
                <div>
                  <h4 className="font-display text-base font-bold text-foreground">
                    Overview &amp; Problem Solved
                  </h4>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {selectedProject.description}
                  </p>
                </div>

                <div>
                  <h4 className="font-display text-base font-bold text-foreground">
                    System Architecture
                  </h4>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {selectedProject.architectureSummary}
                  </p>
                </div>

                <div>
                  <h4 className="font-display text-base font-bold text-foreground">
                    Key Technical Achievements
                  </h4>
                  <ul className="mt-2 space-y-2 text-sm text-foreground/90">
                    {selectedProject.highlights.map((item) => (
                      <li key={item} className="flex items-start gap-2.5">
                        <Check className="mt-1 h-4 w-4 shrink-0 text-cyan-400" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-4 rounded-2xl border border-border/70 bg-secondary/30 p-5">
                <h4 className="font-display text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  Project Telemetry
                </h4>
                <div className="space-y-3">
                  {selectedProject.metrics.map((m) => (
                    <div
                      key={m.label}
                      className="rounded-xl border border-border/60 bg-background/60 p-3"
                    >
                      <p className="text-[11px] text-muted-foreground">
                        {m.label}
                      </p>
                      <p className="font-mono text-sm font-bold text-cyan-400">
                        {m.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Technologies Used
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {selectedProject.techStack.map((t) => (
                      <span
                        key={t}
                        className="rounded-lg border border-border bg-background px-2.5 py-1 font-mono text-[11px] font-medium"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end border-t border-border/60 pt-4">
              <Button variant="outline" onClick={closeProjectModal}>
                Close Case Study (Esc)
              </Button>
            </div>
          </div>
        )}
      </dialog>
    </div>
  )
}

export default App
