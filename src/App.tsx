import React, { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import {
  PROFILE_DATA,
  PROJECTS_DATA,
  ProjectCategory,
  ProjectItem,
  SKILL_CATEGORIES,
  TECH_MARQUEE_ITEMS,
} from "./data/portfolioData"

/* ============================================================================
   Modern Web Guidance: animate-element-entry-exit & animate-to-from-top-layer
   Feature detection for discrete display transitions and top-layer overlay exit
   ============================================================================ */
let supportsDisplayTransitionCache: boolean | undefined

export function canTransitionDisplay(): boolean {
  if (supportsDisplayTransitionCache !== undefined) {
    return supportsDisplayTransitionCache
  }
  if (
    typeof window === "undefined" ||
    !window.CSS?.supports?.("transition-behavior", "allow-discrete") ||
    !document.body
  ) {
    return false
  }
  const probe = document.createElement("div")
  probe.style.cssText =
    "transition: display 1s allow-discrete !important; display: block;"
  document.body.appendChild(probe)
  getComputedStyle(probe).display
  probe.style.display = "none"
  supportsDisplayTransitionCache = getComputedStyle(probe).display === "block"
  probe.remove()
  return supportsDisplayTransitionCache
}

function supportsTopLayerExit(): boolean {
  return (
    typeof window !== "undefined" &&
    Boolean(window.CSS?.supports?.("overlay", "auto")) &&
    canTransitionDisplay()
  )
}

export async function closeTopLayerDialog(dialog: HTMLDialogElement | null) {
  if (!dialog || !dialog.open) return
  if (!supportsTopLayerExit()) {
    dialog.setAttribute("data-closing", "")
    const animations = dialog.getAnimations({ subtree: true })
    if (animations.length > 0) {
      await Promise.race([
        Promise.allSettled(animations.map((a) => a.finished)),
        new Promise((r) => setTimeout(r, 2000)),
      ])
    }
    if (!dialog.hasAttribute("data-closing")) return
    dialog.removeAttribute("data-closing")
  }
  dialog.close()
}

type ScreenViewMode = 0 | 1 | "split"

export function App() {
  /* --------------------------------------------------------------------------
     Theme Management (Modern Web Guidance: dark-mode & dark-mode-toggle)
     -------------------------------------------------------------------------- */
  const getInitialRenderedTheme = (): "light" | "dark" => {
    if (typeof document === "undefined") return "light"
    const metaContent = document
      .querySelector('meta[name="color-scheme"]')
      ?.getAttribute("content")
    if (metaContent === "dark") return "dark"
    if (metaContent === "light") return "light"
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"
  }

  const [renderedTheme, setRenderedTheme] = useState<"light" | "dark">(
    getInitialRenderedTheme
  )

  useEffect(() => {
    const syncFromMetaOrSystem = () => {
      const meta = document.querySelector(
        'meta[name="color-scheme"]'
      ) as HTMLMetaElement | null
      let stored: string | null = null
      try {
        stored = localStorage.getItem("color-scheme")
      } catch {}
      const scheme = stored ?? meta?.content ?? "light"
      if (meta && meta.content !== scheme) {
        meta.content = scheme
      }
      if (scheme === "dark") {
        setRenderedTheme("dark")
      } else if (scheme === "light") {
        setRenderedTheme("light")
      } else {
        const sysDark = window.matchMedia("(prefers-color-scheme: dark)").matches
        setRenderedTheme(sysDark ? "dark" : "light")
      }
    }

    syncFromMetaOrSystem()

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleMediaChange = () => syncFromMetaOrSystem()
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "color-scheme") syncFromMetaOrSystem()
    }

    mediaQuery.addEventListener("change", handleMediaChange)
    window.addEventListener("storage", handleStorageChange)
    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange)
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  const handleThemeToggle = () => {
    const targetScheme: "light" | "dark" =
      renderedTheme === "light" ? "dark" : "light"
    const systemScheme: "light" | "dark" = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches
      ? "dark"
      : "light"

    const meta = document.querySelector(
      'meta[name="color-scheme"]'
    ) as HTMLMetaElement | null

    try {
      if (targetScheme === systemScheme) {
        localStorage.removeItem("color-scheme")
      } else {
        localStorage.setItem("color-scheme", targetScheme)
      }
    } catch {}

    if (meta) {
      meta.content = targetScheme
    }
    setRenderedTheme(targetScheme)
  }

  /* --------------------------------------------------------------------------
     Scroll Progress Fallback & Navbar State
     -------------------------------------------------------------------------- */
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const progressRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const supportsScrollTimeline =
      typeof CSS !== "undefined" &&
      CSS.supports("animation-timeline", "scroll()")

    const onScroll = () => {
      setScrolled(window.scrollY > 24)

      if (!supportsScrollTimeline && progressRef.current) {
        const scrollable =
          document.documentElement.scrollHeight - window.innerHeight
        const ratio = scrollable > 0 ? window.scrollY / scrollable : 0
        progressRef.current.style.transform = `scaleX(${Math.min(
          1,
          Math.max(0, ratio)
        )})`
      }

      const sectionIds = [
        "home",
        "projects",
        "about",
        "skills",
        "certificate",
        "contact",
      ]
      for (const id of sectionIds) {
        const el = document.getElementById(id)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 160 && rect.bottom >= 160) {
            setActiveSection(id)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  /* --------------------------------------------------------------------------
     Typewriter Role Effect
     -------------------------------------------------------------------------- */
  const [roleIndex, setRoleIndex] = useState(0)
  const [typedText, setTypedText] = useState(PROFILE_DATA.typedRoles[0])
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    if (prefersReducedMotion) {
      setTypedText(PROFILE_DATA.typedRoles[0])
      return
    }

    const currentFullRole = PROFILE_DATA.typedRoles[roleIndex]
    const speed = isDeleting ? 35 : 75

    const timer = window.setTimeout(() => {
      if (!isDeleting && typedText === currentFullRole) {
        window.setTimeout(() => setIsDeleting(true), 1400)
      } else if (isDeleting && typedText === "") {
        setIsDeleting(false)
        setRoleIndex((prev) => (prev + 1) % PROFILE_DATA.typedRoles.length)
      } else {
        setTypedText(
          currentFullRole.substring(
            0,
            typedText.length + (isDeleting ? -1 : 1)
          )
        )
      }
    }, speed)

    return () => window.clearTimeout(timer)
  }, [typedText, isDeleting, roleIndex])

  /* --------------------------------------------------------------------------
     Projects Filtering (View Transitions API) & Screen Tabs State
     -------------------------------------------------------------------------- */
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>("all")
  const projectsGridRef = useRef<HTMLDivElement | null>(null)

  // Track which tab (0, 1, or 'split') is active per project card
  const [activeScreenTab, setActiveScreenTab] = useState<
    Record<string, ScreenViewMode>
  >({
    "trivia-attack": 0,
    "overview-streaming": 0,
    "spotibai-discord-bot": 0,
    "business-permit": 0,
    "clinic-management": 0,
    "cinebai-mobile": 0,
  })

  const filteredProjects =
    activeCategory === "all"
      ? PROJECTS_DATA
      : PROJECTS_DATA.filter((p) => p.category === activeCategory)

  const handleCategoryChange = (category: ProjectCategory) => {
    if (category === activeCategory) return
    const docWithVT = document as Document & {
      startViewTransition?: (cb: () => void) => { finished: Promise<void> }
    }

    if (!docWithVT.startViewTransition) {
      setActiveCategory(category)
      projectsGridRef.current?.focus({ preventScroll: true })
      return
    }

    const transition = docWithVT.startViewTransition(() => {
      setActiveCategory(category)
    })
    transition.finished.finally(() => {
      projectsGridRef.current?.focus({ preventScroll: true })
    })
  }

  /* --------------------------------------------------------------------------
     Discrete Entry/Exit Drawer for Project Architecture Notes
     -------------------------------------------------------------------------- */
  const detailRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const [openDetails, setOpenDetails] = useState<Record<string, boolean>>({})

  const toggleCardDetails = async (id: string) => {
    const el = detailRefs.current[id]
    if (!el) return
    const isCurrentlyOpen = !el.hidden && !el.hasAttribute("data-closing")

    if (isCurrentlyOpen) {
      setOpenDetails((prev) => ({ ...prev, [id]: false }))
      if (canTransitionDisplay()) {
        el.hidden = true
      } else {
        el.setAttribute("data-closing", "")
      }
      const animations = el.getAnimations()
      if (animations.length > 0) {
        await Promise.race([
          Promise.allSettled(animations.map((a) => a.finished)),
          new Promise((r) => setTimeout(r, 2000)),
        ])
      }
      if (el.hasAttribute("data-closing")) {
        el.removeAttribute("data-closing")
        el.hidden = true
      }
    } else {
      el.removeAttribute("data-closing")
      el.hidden = false
      setOpenDetails((prev) => ({ ...prev, [id]: true }))
    }
  }

  /* --------------------------------------------------------------------------
     Top-Layer Lightbox Dialog State
     -------------------------------------------------------------------------- */
  const dialogRef = useRef<HTMLDialogElement | null>(null)
  const [lightboxState, setLightboxState] = useState<{
    title: string
    images: { src: string; label?: string; caption: string }[]
    index: number
  } | null>(null)

  const openLightbox = (
    title: string,
    images: { src: string; label?: string; caption: string }[],
    index = 0
  ) => {
    setLightboxState({ title, images, index })
    const dialog = dialogRef.current
    if (dialog && !dialog.open) {
      dialog.removeAttribute("data-closing")
      dialog.showModal()
    }
  }

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    const onCancel = (event: Event) => {
      event.preventDefault()
      closeTopLayerDialog(dialog)
    }

    dialog.addEventListener("cancel", onCancel)
    return () => dialog.removeEventListener("cancel", onCancel)
  }, [])

  const handleDialogBackdropClick = (
    event: React.MouseEvent<HTMLDialogElement>
  ) => {
    const dialog = dialogRef.current
    if (!dialog || event.target !== dialog) return
    if (!("closedBy" in HTMLDialogElement.prototype)) {
      const rect = dialog.getBoundingClientRect()
      const isDialogContent =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width
      if (!isDialogContent) {
        closeTopLayerDialog(dialog)
      }
    }
  }

  /* --------------------------------------------------------------------------
     Pauseable Skills Marquee & Contact Form State
     -------------------------------------------------------------------------- */
  const [marqueePaused, setMarqueePaused] = useState(false)
  const [formStatus, setFormStatus] = useState<"idle" | "sent">("idle")

  const handleContactSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = String(formData.get("name") || "")
    const email = String(formData.get("email") || "")
    const subject = String(formData.get("subject") || "Portfolio Inquiry")
    const message = String(formData.get("message") || "")

    const mailtoUrl = `mailto:${PROFILE_DATA.email}?subject=${encodeURIComponent(
      `${subject} — from ${name}`
    )}&body=${encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${message}`
    )}`
    window.location.href = mailtoUrl
    setFormStatus("sent")
  }

  return (
    <>
      {/* MANDATORY decorative scroll progress bar with aria-hidden="true" */}
      <div id="scroll-progress" ref={progressRef} aria-hidden="true" />

      {/* ======================================================================
         NORDIC DAYLIGHT STICKY HEADER
         ====================================================================== */}
      <header className={`nordic-navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-inner">
          <a href="#home" className="brand-mark">
            <span>
              <span className="brand-mark-brackets">&lt;</span>
              SFS
              <span className="brand-mark-brackets">/&gt;</span>
            </span>
            <span className="brand-mode-pill">
              {renderedTheme === "light" ? "Nordic Daylight" : "Nordic Night"}
            </span>
          </a>

          <nav className="nav-links-pillbox" aria-label="Primary Navigation">
            {[
              { id: "home", label: "Home" },
              { id: "projects", label: "Projects" },
              { id: "about", label: "About" },
              { id: "skills", label: "Skills" },
              { id: "certificate", label: "Certificate" },
              { id: "contact", label: "Contact" },
            ].map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`nav-link-item ${
                  activeSection === item.id ? "active" : ""
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="nav-actions">
            <button
              type="button"
              onClick={handleThemeToggle}
              className="theme-switch-btn"
              aria-label={
                renderedTheme === "light"
                  ? "Switch to dark theme"
                  : "Switch to light theme"
              }
            >
              <i
                className={
                  renderedTheme === "light" ? "fas fa-moon" : "fas fa-sun"
                }
                aria-hidden="true"
              />
              <span>{renderedTheme === "light" ? "Dark Mode" : "Daylight"}</span>
            </button>

            <a href="#contact" className="nav-cta-btn">
              <span>Hire Me</span>
              <i className="fas fa-arrow-right" aria-hidden="true" />
            </a>

            <button
              type="button"
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              <i
                className={mobileMenuOpen ? "fas fa-times" : "fas fa-bars"}
                aria-hidden="true"
              />
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div
            style={{
              background: "var(--bg-card)",
              borderBottom: "1.5px solid var(--border-strong)",
              padding: "16px 24px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              {[
                { id: "home", label: "Home" },
                { id: "projects", label: "Featured Projects" },
                { id: "about", label: "About Me" },
                { id: "skills", label: "Technical Skills" },
                { id: "certificate", label: "Oracle Certificate" },
                { id: "contact", label: "Contact Me" },
              ].map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`nav-link-item ${
                    activeSection === item.id ? "active" : ""
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </header>

      <main>
        {/* ====================================================================
           SECTION 1: NORDIC DAYLIGHT HERO + 3-STAT RIBBON
           ==================================================================== */}
        <section id="home" className="nordic-hero">
          <div className="container">
            <div className="hero-grid">
              {/* Left Column: Intro, Typewriter, CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
              >
                <div className="hero-status-pill">
                  <span className="status-dot" aria-hidden="true" />
                  <span>Available for Opportunities • STI College CDO</span>
                </div>

                <p className="hero-kicker">
                  BS Information Technology • Full-Stack &amp; Game Developer
                </p>

                <h1 className="hero-title">
                  {PROFILE_DATA.firstName}{" "}
                  <span className="hero-title-accent">
                    {PROFILE_DATA.lastName}
                  </span>
                </h1>

                <div className="hero-role-bar" aria-live="polite">
                  <i className="fas fa-terminal" aria-hidden="true" />
                  <span>{typedText}</span>
                  <span className="typed-cursor" aria-hidden="true">
                    |
                  </span>
                </div>

                <p className="hero-description">{PROFILE_DATA.tagline}</p>

                <div className="hero-cta-row">
                  <a href="#projects" className="btn-primary-nordic">
                    <i className="fas fa-layer-group" aria-hidden="true" />
                    <span>Explore 6 Projects</span>
                  </a>
                  <a
                    href={PROFILE_DATA.certificatePdf}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-secondary-nordic"
                  >
                    <i className="fas fa-certificate" aria-hidden="true" />
                    <span>Oracle Credential</span>
                  </a>
                  <a href="#contact" className="btn-secondary-nordic">
                    <i className="fas fa-paper-plane" aria-hidden="true" />
                    <span>Get In Touch</span>
                  </a>
                </div>

                <div className="hero-socials">
                  <a
                    href={PROFILE_DATA.github}
                    target="_blank"
                    rel="noreferrer"
                    className="social-pill-link"
                    aria-label="GitHub Profile"
                  >
                    <i className="fab fa-github" aria-hidden="true" />
                  </a>
                  <a
                    href={PROFILE_DATA.facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="social-pill-link"
                    aria-label="Facebook Profile"
                  >
                    <i className="fab fa-facebook-f" aria-hidden="true" />
                  </a>
                  <a
                    href={PROFILE_DATA.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="social-pill-link"
                    aria-label="Instagram Profile"
                  >
                    <i className="fab fa-instagram" aria-hidden="true" />
                  </a>
                  <a
                    href={`mailto:${PROFILE_DATA.email}`}
                    className="social-pill-link"
                    aria-label="Email Steven"
                  >
                    <i className="fas fa-envelope" aria-hidden="true" />
                  </a>
                </div>
              </motion.div>

              {/* Right Column: Browser-Framed Nordic Portrait Card */}
              <motion.div
                className="hero-portrait-stage"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="portrait-window-card">
                  <div className="window-chrome-bar">
                    <div className="window-dots" aria-hidden="true">
                      <span className="window-dot red" />
                      <span className="window-dot amber" />
                      <span className="window-dot green" />
                    </div>
                    <span className="window-address-pill">
                      steven-sendrijas://profile.bsit
                    </span>
                    <i
                      className="fas fa-check-circle"
                      style={{ color: "var(--brand-secondary)" }}
                      aria-hidden="true"
                    />
                  </div>

                  <div className="portrait-window-body">
                    <div className="portrait-image-frame">
                      <img
                        src={PROFILE_DATA.avatar}
                        alt="Steven Floyd Sendrijas portrait"
                      />
                    </div>

                    <div className="portrait-school-ribbon">
                      <div className="portrait-school-left">
                        <i className="fas fa-graduation-cap" aria-hidden="true" />
                        <span>STI College — BS Information Technology</span>
                      </div>
                      <span className="portrait-school-tag">CDO • 9000</span>
                    </div>

                    <div className="portrait-skill-pills">
                      <div className="portrait-skill-pill">
                        <i className="fab fa-react" aria-hidden="true" />
                        <span>React 18 &amp; TS</span>
                      </div>
                      <div className="portrait-skill-pill">
                        <i className="fab fa-unity" aria-hidden="true" />
                        <span>Unity 6 &amp; C#</span>
                      </div>
                      <div className="portrait-skill-pill">
                        <i className="fab fa-discord" aria-hidden="true" />
                        <span>Discord.js &amp; AI</span>
                      </div>
                      <div className="portrait-skill-pill">
                        <i className="fab fa-java" aria-hidden="true" />
                        <span>Java &amp; SQL</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* 3-Stat Ribbon */}
            <div className="nordic-stat-ribbon">
              <div className="stat-ribbon-card">
                <div className="stat-ribbon-number">06+</div>
                <div>
                  <div className="stat-ribbon-label">
                    Complete Software Builds
                  </div>
                  <div className="stat-ribbon-sub">
                    Web, Unity 2D RPG, Discord AI Bot &amp; Mobile
                  </div>
                </div>
              </div>

              <div className="stat-ribbon-card">
                <div className="stat-ribbon-number">12+</div>
                <div>
                  <div className="stat-ribbon-label">
                    Core Technologies &amp; Stack
                  </div>
                  <div className="stat-ribbon-sub">
                    React, TypeScript, C#, Laravel, Node.js &amp; SQL
                  </div>
                </div>
              </div>

              <div className="stat-ribbon-card">
                <div className="stat-ribbon-number">01</div>
                <div>
                  <div className="stat-ribbon-label">
                    Oracle Academy Certified
                  </div>
                  <div className="stat-ribbon-sub">
                    Verified Java Fundamentals Credential
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
           SECTION 2: 2-COLUMN BROWSER-FRAMED FEATURED PROJECTS
           ==================================================================== */}
        <section id="projects" className="nordic-section alt-bg">
          <div className="container">
            <div className="projects-toolbar">
              <div className="section-header-nordic" style={{ marginBottom: 0 }}>
                <span className="section-eyebrow">
                  <i className="fas fa-window-restore" aria-hidden="true" />
                  <span>Featured Work • 01 — 06</span>
                </span>
                <h2 className="section-heading">
                  Browser-Framed <span>Project Showcase</span>
                </h2>
                <p className="section-subtext">
                  Switch between <strong>Screen 1</strong>,{" "}
                  <strong>Screen 2</strong>, or <strong>Split View</strong>{" "}
                  directly inside each window frame—or click any image for a
                  fullscreen lightbox.
                </p>
              </div>

              {/* Filter Tabs */}
              <div
                className="filter-pills"
                role="tablist"
                aria-label="Filter projects by category"
              >
                {[
                  { id: "all", label: "All Projects (6)", icon: "fas fa-th-large" },
                  { id: "web", label: "Web & Full-Stack", icon: "fas fa-globe" },
                  { id: "games", label: "Game & Mobile", icon: "fas fa-gamepad" },
                  { id: "bots", label: "Discord & AI Bot", icon: "fab fa-discord" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={activeCategory === tab.id}
                    onClick={() =>
                      handleCategoryChange(tab.id as ProjectCategory)
                    }
                    className={`filter-pill-btn ${
                      activeCategory === tab.id ? "active" : ""
                    }`}
                  >
                    <i className={tab.icon} aria-hidden="true" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2-Column Browser-Framed Grid */}
            <div
              id="projects-grid-region"
              ref={projectsGridRef}
              tabIndex={-1}
              className="nordic-projects-grid"
            >
              {filteredProjects.map((project: ProjectItem) => {
                const currentTab: ScreenViewMode =
                  activeScreenTab[project.id] ?? 0
                const hasTwoImages = project.images.length > 1
                const activeImageIndex =
                  typeof currentTab === "number" &&
                  project.images[currentTab]
                    ? currentTab
                    : 0
                const activeImg = project.images[activeImageIndex]

                return (
                  <article
                    key={project.id}
                    className="nordic-project-card"
                    style={
                      {
                        viewTransitionName: project.vtName,
                      } as React.CSSProperties
                    }
                  >
                    {/* Browser Window Chrome Top Bar with Screen 1 / Screen 2 Tabs */}
                    <div className="project-window-header">
                      <div className="project-window-left">
                        <div className="window-dots" aria-hidden="true">
                          <span className="window-dot red" />
                          <span className="window-dot amber" />
                          <span className="window-dot green" />
                        </div>
                        <span
                          className="project-url-bar"
                          title={project.windowUrl}
                        >
                          {project.windowUrl}
                        </span>
                      </div>

                      {hasTwoImages ? (
                        <div
                          className="screen-tabs-group"
                          role="tablist"
                          aria-label={`${project.title} screenshots`}
                        >
                          {project.images.map((img, idx) => (
                            <button
                              key={img.src}
                              type="button"
                              role="tab"
                              aria-selected={currentTab === idx}
                              onClick={() =>
                                setActiveScreenTab((prev) => ({
                                  ...prev,
                                  [project.id]: idx as 0 | 1,
                                }))
                              }
                              className={`screen-tab-btn ${
                                currentTab === idx ? "active" : ""
                              }`}
                            >
                              {img.label}
                            </button>
                          ))}
                          <button
                            type="button"
                            role="tab"
                            aria-selected={currentTab === "split"}
                            onClick={() =>
                              setActiveScreenTab((prev) => ({
                                ...prev,
                                [project.id]: "split",
                              }))
                            }
                            className={`screen-tab-btn ${
                              currentTab === "split" ? "active" : ""
                            }`}
                          >
                            Split
                          </button>
                        </div>
                      ) : (
                        <span className="project-url-bar">
                          {project.images[0]?.label}
                        </span>
                      )}
                    </div>

                    {/* 100% Uncropped Screenshot Viewport Stage */}
                    <div className="project-viewport-stage">
                      {hasTwoImages && currentTab === "split" ? (
                        <div className="viewport-split-grid">
                          {project.images.map((img, idx) => (
                            <button
                              key={img.src}
                              type="button"
                              className="viewport-split-cell"
                              onClick={() =>
                                openLightbox(project.title, project.images, idx)
                              }
                              aria-label={`Inspect ${img.caption} in fullscreen`}
                            >
                              <img src={img.src} alt={img.caption} />
                              <span className="viewport-split-label">
                                {img.label}
                              </span>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <button
                          type="button"
                          className={`viewport-single-btn ${
                            project.previewType === "mobile"
                              ? "contain-mode"
                              : ""
                          }`}
                          onClick={() =>
                            openLightbox(
                              project.title,
                              project.images,
                              activeImageIndex
                            )
                          }
                          aria-label={`Inspect ${activeImg.caption} in fullscreen`}
                        >
                          <img src={activeImg.src} alt={activeImg.caption} />
                        </button>
                      )}

                      <button
                        type="button"
                        className="viewport-lightbox-pill"
                        onClick={() =>
                          openLightbox(
                            project.title,
                            project.images,
                            activeImageIndex
                          )
                        }
                      >
                        <i className="fas fa-expand" aria-hidden="true" />
                        <span>
                          Lightbox ({activeImageIndex + 1}/
                          {project.images.length})
                        </span>
                      </button>
                    </div>

                    {/* Card Content Body */}
                    <div className="project-card-body">
                      <div className="project-meta-top">
                        <span className="project-num-badge">
                          PROJECT {project.num}
                        </span>
                        <span className="project-subtitle-mono">
                          {project.subtitle}
                        </span>
                      </div>

                      <h3 className="project-card-title">{project.title}</h3>
                      <p className="project-card-desc">{project.description}</p>

                      {/* All 6 Feature Checkmarks in a Clean 2-Column Box */}
                      <div className="project-features-grid">
                        {project.features.map((feat) => (
                          <div key={feat} className="project-feature-item">
                            <i
                              className="fas fa-check-circle"
                              aria-hidden="true"
                            />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>

                      {/* Expandable Architecture Notes Drawer */}
                      <div
                        ref={(el) => {
                          detailRefs.current[project.id] = el
                        }}
                        className="project-details"
                        hidden
                      >
                        <p style={{ marginBottom: "6px" }}>
                          {project.detailText}
                        </p>
                        <p
                          style={{
                            fontWeight: 700,
                            color: "var(--brand-primary)",
                          }}
                        >
                          {project.detailNote}
                        </p>
                      </div>

                      {/* Tech Stack Pills */}
                      <div className="project-tech-tags">
                        {project.tags.map((tag) => (
                          <span key={tag} className="project-tech-pill">
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Footer Actions */}
                      <div className="project-card-footer">
                        <button
                          type="button"
                          onClick={() => toggleCardDetails(project.id)}
                          className="project-details-btn"
                          aria-expanded={Boolean(openDetails[project.id])}
                        >
                          <i
                            className={
                              openDetails[project.id]
                                ? "fas fa-chevron-up"
                                : "fas fa-chevron-down"
                            }
                            aria-hidden="true"
                          />
                          <span>
                            {openDetails[project.id]
                              ? "Hide Architecture Notes"
                              : "View Architecture Notes"}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            openLightbox(
                              project.title,
                              project.images,
                              activeImageIndex
                            )
                          }
                          className="project-details-btn"
                        >
                          <i className="fas fa-images" aria-hidden="true" />
                          <span>Inspect Gallery</span>
                        </button>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        {/* ====================================================================
           SECTION 3: ABOUT ME (WHO I AM)
           ==================================================================== */}
        <section id="about" className="nordic-section">
          <div className="container">
            <div className="section-header-nordic">
              <span className="section-eyebrow">
                <i className="fas fa-user-check" aria-hidden="true" />
                <span>About Me • Who I Am</span>
              </span>
              <h2 className="section-heading">
                Passionate <span>IT Student &amp; Builder</span>
              </h2>
            </div>

            <div className="about-nordic-grid">
              {/* Left: Framed Portrait & Quick Facts */}
              <div className="about-profile-card">
                <div className="window-chrome-bar">
                  <div className="window-dots" aria-hidden="true">
                    <span className="window-dot red" />
                    <span className="window-dot amber" />
                    <span className="window-dot green" />
                  </div>
                  <span className="window-address-pill">
                    about://steven-sendrijas.sti
                  </span>
                </div>

                <div style={{ padding: "20px 20px 0 20px" }}>
                  <div
                    className="portrait-image-frame"
                    style={{ aspectRatio: "16 / 11" }}
                  >
                    <img
                      src={PROFILE_DATA.avatar}
                      alt="Steven Floyd Sendrijas at STI College"
                    />
                  </div>
                </div>

                <div className="about-facts-list">
                  <div className="about-fact-box">
                    <div className="about-fact-label">Institution</div>
                    <div className="about-fact-value">STI College CDO</div>
                  </div>
                  <div className="about-fact-box">
                    <div className="about-fact-label">Program</div>
                    <div className="about-fact-value">BS Info Technology</div>
                  </div>
                  <div className="about-fact-box">
                    <div className="about-fact-label">Location</div>
                    <div className="about-fact-value">Cagayan de Oro City</div>
                  </div>
                  <div className="about-fact-box">
                    <div className="about-fact-label">Credential</div>
                    <div className="about-fact-value">Oracle Java Certified</div>
                  </div>
                </div>
              </div>

              {/* Right: Narrative & 6 Checkmark Highlights */}
              <div className="about-narrative">
                <h3>
                  Building Complete Web, Game, Mobile &amp; AI Systems from the
                  Ground Up
                </h3>
                <p>
                  I&apos;m <strong>Steven Floyd Sendrijas</strong>, a Bachelor of
                  Science in Information Technology student at{" "}
                  <strong>STI College</strong> in Cagayan de Oro City. I love
                  turning complex ideas into clean, reliable software that
                  people actually enjoy using.
                </p>
                <p>
                  Whether I&apos;m engineering a turn-based 2D educational RPG in{" "}
                  <strong>Unity 6 &amp; C#</strong> (<em>Trivia Attack</em>),
                  building a full-stack HLS streaming platform in{" "}
                  <strong>React &amp; TypeScript</strong> (<em>OverView</em>),
                  or running a real-time 48kHz Opus voice &amp; Bisaya AI bot in{" "}
                  <strong>Discord.js</strong> (<em>SpotiBAI</em>), I focus on
                  solid database design and responsive interfaces.
                </p>

                <div className="about-highlights-grid">
                  {[
                    "Full-Stack React, TypeScript & Laravel",
                    "Unity 6 (URP 2D) & C# Game Architecture",
                    "Discord.js Voice DSP & Bisaya AI NLP",
                    "PostgreSQL, MySQL & Prisma ORM",
                    "Oracle Academy Java Fundamentals Certified",
                    "Clean UI/UX & Responsive System Design",
                  ].map((item) => (
                    <div key={item} className="about-highlight-pill">
                      <i className="fas fa-check-circle" aria-hidden="true" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <div className="hero-cta-row" style={{ marginBottom: 0 }}>
                  <a href="#contact" className="btn-primary-nordic">
                    <i className="fas fa-handshake" aria-hidden="true" />
                    <span>Let&apos;s Work Together</span>
                  </a>
                  <a
                    href={PROFILE_DATA.github}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-secondary-nordic"
                  >
                    <i className="fab fa-github" aria-hidden="true" />
                    <span>View GitHub Profile</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
           SECTION 4: TECHNICAL SKILLS MATRIX + PAUSEABLE MARQUEE
           ==================================================================== */}
        <section id="skills" className="nordic-section alt-bg">
          <div className="container">
            <div className="section-header-nordic">
              <span className="section-eyebrow">
                <i className="fas fa-code" aria-hidden="true" />
                <span>Technical Skills • What I Work With</span>
              </span>
              <h2 className="section-heading">
                Tools, Languages &amp; <span>Engineering Stack</span>
              </h2>
              <p className="section-subtext">
                Organized across frontend, backend, game/mobile engines,
                databases, and developer tooling.
              </p>
            </div>

            <div className="skills-nordic-grid">
              {SKILL_CATEGORIES.map((cat) => (
                <div key={cat.id} className="skill-nordic-card">
                  <div className="skill-card-head">
                    <div className="skill-icon-box">
                      <i className={cat.icon} aria-hidden="true" />
                    </div>
                    <h3>{cat.title}</h3>
                  </div>

                  <div className="skill-badges-wrap">
                    {cat.badges.map((badge) => (
                      <span key={badge.name} className="skill-badge-item">
                        <i className={badge.icon} aria-hidden="true" />
                        <span>{badge.name}</span>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Pauseable Technology Ticker */}
            <div className="marquee-bar-wrap">
              <button
                type="button"
                onClick={() => setMarqueePaused((prev) => !prev)}
                className="marquee-pause-btn"
                aria-pressed={marqueePaused}
              >
                <i
                  className={marqueePaused ? "fas fa-play" : "fas fa-pause"}
                  aria-hidden="true"
                />
                <span>{marqueePaused ? "Resume Ticker" : "Pause Ticker"}</span>
              </button>

              <div className="marquee-viewport" aria-label="Technology ticker">
                <div
                  className={`marquee-track ${marqueePaused ? "paused" : ""}`}
                >
                  {[...TECH_MARQUEE_ITEMS, ...TECH_MARQUEE_ITEMS].map(
                    (item, idx) => (
                      <span key={`${item}-${idx}`} className="marquee-chip">
                        {item}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
           SECTION 5: ORACLE ACADEMY CERTIFICATE
           ==================================================================== */}
        <section id="certificate" className="nordic-section">
          <div className="container">
            <div className="section-header-nordic">
              <span className="section-eyebrow">
                <i className="fas fa-award" aria-hidden="true" />
                <span>Certifications • My Credentials</span>
              </span>
              <h2 className="section-heading">
                Verified <span>Academic Certification</span>
              </h2>
            </div>

            <div className="cert-nordic-card">
              <div className="cert-preview-side">
                <div className="window-chrome-bar">
                  <div className="window-dots" aria-hidden="true">
                    <span className="window-dot red" />
                    <span className="window-dot amber" />
                    <span className="window-dot green" />
                  </div>
                  <span className="window-address-pill">
                    oracle-academy://java-fundamentals.cert
                  </span>
                </div>

                <div
                  className="cert-image-stage"
                  onClick={() =>
                    openLightbox("Oracle Academy — Java Fundamentals", [
                      {
                        src: "/assets/certificate-preview.png",
                        label: "Official Certificate",
                        caption:
                          "Oracle Academy Java Fundamentals — Course Completion Certificate awarded to Steven Floyd Sendrijas",
                      },
                    ])
                  }
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      openLightbox("Oracle Academy — Java Fundamentals", [
                        {
                          src: "/assets/certificate-preview.png",
                          label: "Official Certificate",
                          caption:
                            "Oracle Academy Java Fundamentals — Course Completion Certificate awarded to Steven Floyd Sendrijas",
                        },
                      ])
                    }
                  }}
                  aria-label="Inspect Oracle Academy Java Fundamentals certificate in fullscreen"
                >
                  <img
                    src="/assets/certificate-preview.png"
                    alt="Oracle Academy Java Fundamentals Certificate"
                  />
                </div>
              </div>

              <div className="cert-info-side">
                <span className="cert-verified-pill">
                  <i className="fas fa-check-circle" aria-hidden="true" />
                  <span>Oracle Academy Verified Credential</span>
                </span>

                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.75rem",
                    fontWeight: 800,
                    color: "var(--text-primary)",
                  }}
                >
                  Java Fundamentals — Course Completion
                </h3>

                <p
                  style={{
                    fontSize: "0.96rem",
                    color: "var(--text-secondary)",
                  }}
                >
                  Awarded by <strong>Oracle Academy</strong> for mastering
                  object-oriented programming principles, Java syntax, data
                  structures, control flow, and software engineering foundations
                  at <strong>STI College</strong>.
                </p>

                <div className="cert-skills-list">
                  {[
                    "Object-Oriented Programming",
                    "Core Java Syntax & APIs",
                    "Classes, Inheritance & Logic",
                    "Algorithmic Problem Solving",
                  ].map((skill) => (
                    <div key={skill} className="cert-skill-chip">
                      <i className="fas fa-check" aria-hidden="true" />
                      <span>{skill}</span>
                    </div>
                  ))}
                </div>

                <div className="hero-cta-row" style={{ marginBottom: 0 }}>
                  <button
                    type="button"
                    onClick={() =>
                      openLightbox("Oracle Academy — Java Fundamentals", [
                        {
                          src: "/assets/certificate-preview.png",
                          label: "Official Certificate",
                          caption:
                            "Oracle Academy Java Fundamentals — Course Completion Certificate awarded to Steven Floyd Sendrijas",
                        },
                      ])
                    }
                    className="btn-primary-nordic"
                  >
                    <i className="fas fa-expand" aria-hidden="true" />
                    <span>Inspect Fullscreen</span>
                  </button>

                  <a
                    href={PROFILE_DATA.certificatePdf}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-secondary-nordic"
                  >
                    <i className="fas fa-file-pdf" aria-hidden="true" />
                    <span>Download PDF</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
           SECTION 6: CONTACT ME
           ==================================================================== */}
        <section id="contact" className="nordic-section alt-bg">
          <div className="container">
            <div className="section-header-nordic">
              <span className="section-eyebrow">
                <i className="fas fa-envelope-open-text" aria-hidden="true" />
                <span>Contact Me • Let&apos;s Connect</span>
              </span>
              <h2 className="section-heading">
                Let&apos;s Work <span>Together</span>
              </h2>
              <p className="section-subtext">
                Have a project in mind, an internship opportunity, or a question
                about my builds? Reach out anytime.
              </p>
            </div>

            <div className="contact-nordic-grid">
              <div className="contact-info-stack">
                <a
                  href={`mailto:${PROFILE_DATA.email}`}
                  className="contact-item-card"
                >
                  <div className="contact-icon-circle">
                    <i className="fas fa-envelope" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="about-fact-label">Email Address</div>
                    <div className="about-fact-value">{PROFILE_DATA.email}</div>
                  </div>
                </a>

                <a
                  href={`tel:${PROFILE_DATA.phone}`}
                  className="contact-item-card"
                >
                  <div className="contact-icon-circle">
                    <i className="fas fa-phone-alt" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="about-fact-label">Phone Number</div>
                    <div className="about-fact-value">{PROFILE_DATA.phone}</div>
                  </div>
                </a>

                <div className="contact-item-card">
                  <div className="contact-icon-circle">
                    <i className="fas fa-map-marker-alt" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="about-fact-label">Location</div>
                    <div className="about-fact-value">
                      {PROFILE_DATA.location}
                    </div>
                  </div>
                </div>

                <div className="contact-item-card">
                  <div className="contact-icon-circle">
                    <i className="fas fa-university" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="about-fact-label">Education</div>
                    <div className="about-fact-value">
                      {PROFILE_DATA.school} — BS Information Technology
                    </div>
                  </div>
                </div>
              </div>

              <form
                className="contact-form-card"
                onSubmit={handleContactSubmit}
              >
                <div className="form-grid-2">
                  <div className="form-field">
                    <label htmlFor="contact-name">Your Name</label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      required
                      placeholder="Juan Dela Cruz"
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="contact-email">Your Email</label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      placeholder="juan@example.com"
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="contact-subject">Subject</label>
                  <input
                    id="contact-subject"
                    name="subject"
                    type="text"
                    required
                    placeholder="Project Inquiry / Internship Opportunity"
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="contact-message">Message</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={4}
                    required
                    placeholder="Tell me about your project or opportunity..."
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary-nordic"
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  <i className="fas fa-paper-plane" aria-hidden="true" />
                  <span>Send Message</span>
                </button>

                {formStatus === "sent" && (
                  <p
                    role="status"
                    style={{
                      marginTop: "12px",
                      fontSize: "0.86rem",
                      fontWeight: 600,
                      color: "var(--brand-secondary)",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <i className="fas fa-check-circle" aria-hidden="true" />
                    <span>
                      Your email client has been opened with your message ready
                      to send!
                    </span>
                  </p>
                )}
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* ======================================================================
         NORDIC FOOTER
         ====================================================================== */}
      <footer className="nordic-footer">
        <div className="container footer-flex">
          <div className="brand-mark">
            <span>
              <span className="brand-mark-brackets">&lt;</span>
              SFS
              <span className="brand-mark-brackets">/&gt;</span>
            </span>
            <span
              style={{
                fontSize: "0.86rem",
                fontWeight: 500,
                color: "var(--text-muted)",
              }}
            >
              © {new Date().getFullYear()} Steven Floyd Sendrijas • STI College
            </span>
          </div>

          <div className="hero-socials">
            <a
              href={PROFILE_DATA.github}
              target="_blank"
              rel="noreferrer"
              className="social-pill-link"
              aria-label="GitHub"
            >
              <i className="fab fa-github" aria-hidden="true" />
            </a>
            <a
              href={PROFILE_DATA.facebook}
              target="_blank"
              rel="noreferrer"
              className="social-pill-link"
              aria-label="Facebook"
            >
              <i className="fab fa-facebook-f" aria-hidden="true" />
            </a>
            <a
              href={PROFILE_DATA.instagram}
              target="_blank"
              rel="noreferrer"
              className="social-pill-link"
              aria-label="Instagram"
            >
              <i className="fab fa-instagram" aria-hidden="true" />
            </a>
            <a
              href="#home"
              className="social-pill-link"
              aria-label="Back to top"
            >
              <i className="fas fa-arrow-up" aria-hidden="true" />
            </a>
          </div>
        </div>
      </footer>

      {/* ======================================================================
         TOP-LAYER LIGHTBOX MODAL DIALOG
         Modern Web Guidance: light-dismiss-a-dialog & animate-to-from-top-layer
         ====================================================================== */}
      <dialog
        ref={dialogRef}
        className="case-study-dialog"
        closedby="any"
        aria-labelledby="lightbox-dialog-title"
        onClick={handleDialogBackdropClick}
      >
        {lightboxState && (
          <div>
            <div className="window-chrome-bar">
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <div className="window-dots" aria-hidden="true">
                  <span className="window-dot red" />
                  <span className="window-dot amber" />
                  <span className="window-dot green" />
                </div>
                <h3
                  id="lightbox-dialog-title"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1rem",
                    fontWeight: 800,
                    color: "var(--text-primary)",
                  }}
                >
                  {lightboxState.title}
                </h3>
              </div>

              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                {lightboxState.images.length > 1 && (
                  <>
                    <button
                      type="button"
                      className="screen-tab-btn"
                      onClick={() =>
                        setLightboxState((prev) =>
                          prev
                            ? {
                                ...prev,
                                index:
                                  (prev.index - 1 + prev.images.length) %
                                  prev.images.length,
                              }
                            : null
                        )
                      }
                    >
                      ← Prev
                    </button>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.75rem",
                        color: "var(--text-muted)",
                      }}
                    >
                      {lightboxState.index + 1} / {lightboxState.images.length}
                    </span>
                    <button
                      type="button"
                      className="screen-tab-btn"
                      onClick={() =>
                        setLightboxState((prev) =>
                          prev
                            ? {
                                ...prev,
                                index: (prev.index + 1) % prev.images.length,
                              }
                            : null
                        )
                      }
                    >
                      Next →
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={() => closeTopLayerDialog(dialogRef.current)}
                  className="theme-switch-btn"
                  style={{ padding: "5px 12px" }}
                >
                  <i className="fas fa-times" aria-hidden="true" />
                  <span>Close</span>
                </button>
              </div>
            </div>

            <div
              style={{
                background: "var(--bg-stage)",
                padding: "20px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                maxHeight: "72vh",
                overflow: "auto",
              }}
            >
              <img
                src={lightboxState.images[lightboxState.index]?.src}
                alt={lightboxState.images[lightboxState.index]?.caption}
                style={{
                  maxHeight: "66vh",
                  width: "auto",
                  borderRadius: "10px",
                  objectFit: "contain",
                }}
              />
            </div>

            <div
              style={{
                padding: "14px 20px",
                borderTop: "1px solid var(--border-subtle)",
                fontSize: "0.86rem",
                color: "var(--text-secondary)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <span>
                {lightboxState.images[lightboxState.index]?.caption}
              </span>
              {lightboxState.images.length > 1 && (
                <div className="screen-tabs-group">
                  {lightboxState.images.map((img, idx) => (
                    <button
                      key={img.src}
                      type="button"
                      onClick={() =>
                        setLightboxState((prev) =>
                          prev ? { ...prev, index: idx } : null
                        )
                      }
                      className={`screen-tab-btn ${
                        lightboxState.index === idx ? "active" : ""
                      }`}
                    >
                      {img.label ?? `Screen ${idx + 1}`}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </dialog>
    </>
  )
}

export default App
