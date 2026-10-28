import React, { useEffect, useRef, useState } from "react"
import { flushSync } from "react-dom"
import { motion } from "framer-motion"
import {
  PROFILE_DATA,
  PROJECTS_DATA,
  SKILL_CATEGORIES,
  TECH_MARQUEE_ITEMS,
  type ProjectCategory,
  type ProjectItem,
} from "@/data/portfolioData"
import {
  closeTopLayer,
  hideDiscreteElement,
  showDiscreteElement,
} from "@/lib/utils"

const NAV_LINKS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "certificate", label: "Certificate" },
  { id: "contact", label: "Contact" },
]

const PROJECT_FILTERS: { id: ProjectCategory; label: string }[] = [
  { id: "all", label: "All Projects (6)" },
  { id: "web", label: "Web Systems (3)" },
  { id: "games", label: "Game & Mobile (2)" },
  { id: "bots", label: "Discord & AI Bot (1)" },
]

export function App() {
  const [theme, setTheme] = useState<"dark" | "light">("dark")
  const [activeNav, setActiveNav] = useState<string>("home")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [marqueePaused, setMarqueePaused] = useState(false)

  // Typewriter state
  const [typedText, setTypedText] = useState("")
  const [roleIdx, setRoleIdx] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  // Projects state
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>("all")
  const [expandedDetails, setExpandedDetails] = useState<Record<string, boolean>>({})
  const detailRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const projectsHeadingRef = useRef<HTMLHeadingElement | null>(null)

  // Native <dialog> Image Viewer state
  const [viewerProject, setViewerProject] = useState<ProjectItem | null>(null)
  const [viewerIndex, setViewerIndex] = useState(0)
  const dialogRef = useRef<HTMLDialogElement | null>(null)

  // Contact form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [formSent, setFormSent] = useState(false)

  // 1. Scroll progress bar fallback + navbar scrolled / back-to-top state
  useEffect(() => {
    const supportsScrollTimeline =
      typeof window !== "undefined" &&
      Boolean(window.CSS?.supports?.("animation-timeline", "scroll()"))
    const progressEl = document.querySelector<HTMLElement>("#scroll-progress")

    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 24)
      setShowBackToTop(y > 420)

      if (!supportsScrollTimeline && progressEl) {
        const scrollable =
          document.documentElement.scrollHeight - window.innerHeight
        const ratio =
          scrollable > 0 ? Math.min(1, Math.max(0, y / scrollable)) : 0
        progressEl.style.transform = `scaleX(${ratio})`
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // 2. Smooth typewriter effect in Hero
  useEffect(() => {
    const currentWord = PROFILE_DATA.typedRoles[roleIdx]
    const speed = isDeleting ? 40 : 85

    const timer = window.setTimeout(() => {
      if (!isDeleting && typedText === currentWord) {
        window.setTimeout(() => setIsDeleting(true), 1400)
        return
      }
      if (isDeleting && typedText === "") {
        setIsDeleting(false)
        setRoleIdx((prev) => (prev + 1) % PROFILE_DATA.typedRoles.length)
        return
      }
      setTypedText(
        isDeleting
          ? currentWord.substring(0, typedText.length - 1)
          : currentWord.substring(0, typedText.length + 1)
      )
    }, speed)

    return () => window.clearTimeout(timer)
  }, [typedText, isDeleting, roleIdx])

  // 3. Active section IntersectionObserver
  useEffect(() => {
    const sections = NAV_LINKS.map((item) =>
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
      { threshold: [0.2, 0.5], rootMargin: "-72px 0px -35% 0px" }
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

  // Theme toggle wrapped in View Transitions API
  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark"
    const apply = () => {
      setTheme(nextTheme)
      const root = document.documentElement
      root.setAttribute("data-theme", nextTheme)
      if (nextTheme === "dark") {
        root.classList.add("dark")
      } else {
        root.classList.remove("dark")
      }
    }

    if (document.startViewTransition) {
      document.startViewTransition(() => {
        flushSync(() => apply())
      })
    } else {
      apply()
    }
  }

  // Category filter with View Transitions API + focus routing
  const handleFilterChange = (category: ProjectCategory) => {
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

  // Discrete entry/exit toggle for project details
  const toggleProjectDetails = async (projectId: string) => {
    const el = detailRefs.current[projectId]
    if (!el) return

    const isOpen = Boolean(expandedDetails[projectId])
    if (isOpen) {
      setExpandedDetails((prev) => ({ ...prev, [projectId]: false }))
      await hideDiscreteElement(el)
    } else {
      showDiscreteElement(el)
      setExpandedDetails((prev) => ({ ...prev, [projectId]: true }))
    }
  }

  // Open native <dialog> image viewer
  const openImageViewer = (project: ProjectItem, startIdx = 0) => {
    setViewerProject(project)
    setViewerIndex(startIdx)
    requestAnimationFrame(() => {
      const dialog = dialogRef.current
      if (dialog && !dialog.open) {
        dialog.showModal()
      }
    })
  }

  const closeImageViewer = () => {
    const dialog = dialogRef.current
    if (dialog) {
      closeTopLayer(dialog)
    }
  }

  const stepViewerImage = (dir: number) => {
    if (!viewerProject) return
    const total = viewerProject.images.length
    setViewerIndex((prev) => (prev + dir + total) % total)
  }

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const subject = encodeURIComponent(
      formData.subject || `Portfolio Message from ${formData.name}`
    )
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`
    )
    window.location.href = `mailto:${PROFILE_DATA.email}?subject=${subject}&body=${body}`
    setFormSent(true)
  }

  const filteredProjects =
    activeCategory === "all"
      ? PROJECTS_DATA
      : PROJECTS_DATA.filter((p) => p.category === activeCategory)

  return (
    <>
      {/* Decorative Scroll Progress Indicator (scroll-progress-indicator) */}
      <div id="scroll-progress" aria-hidden="true" />

      {/* ===================== NAVIGATION ===================== */}
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`} id="navbar">
        <div className="nav-container">
          <a href="#home" className="nav-logo">
            <span className="logo-bracket">&lt;</span>SFS
            <span className="logo-bracket">/&gt;</span>
          </a>

          <ul
            className={`nav-links ${mobileMenuOpen ? "open" : ""}`}
            id="navLinks"
          >
            {NAV_LINKS.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={() => {
                    setActiveNav(item.id)
                    setMobileMenuOpen(false)
                  }}
                  className={`nav-link ${
                    activeNav === item.id ? "active" : ""
                  }`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="nav-actions">
            <button
              type="button"
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              <i
                className={theme === "dark" ? "fas fa-sun" : "fas fa-moon"}
              ></i>
            </button>

            <button
              type="button"
              className={`hamburger ${mobileMenuOpen ? "open" : ""}`}
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`mobile-overlay ${mobileMenuOpen ? "open" : ""}`}
        onClick={() => setMobileMenuOpen(false)}
      ></div>

      {/* ===================== HERO SECTION ===================== */}
      <section id="home" className="hero">
        <div className="hero-bg">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
          <div className="blob blob-3"></div>
          <div className="grid-overlay"></div>
        </div>

        <div className="hero-container">
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="hero-content"
          >
            <div className="hero-badge">
              <span className="badge-dot"></span>
              <span>Available for Internship &amp; Projects</span>
            </div>

            <h1 className="hero-name">
              <span className="name-line">{PROFILE_DATA.firstName}</span>
              <span className="name-line accent-text">
                {PROFILE_DATA.lastName}
              </span>
            </h1>

            <p className="hero-title">
              <span className="typed-text">{typedText}</span>
              <span className="cursor">|</span>
            </p>

            <p className="hero-tagline">{PROFILE_DATA.tagline}</p>

            {/* CTA Buttons */}
            <div className="hero-buttons">
              <a href="#projects" className="btn btn-primary">
                <i className="fas fa-code"></i> View Projects
              </a>
              <a href="#certificate" className="btn btn-secondary">
                <i className="fas fa-certificate"></i> View Certificate
              </a>
              <a href="#contact" className="btn btn-outline">
                <i className="fas fa-envelope"></i> Contact Me
              </a>
              <a
                href={PROFILE_DATA.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
              >
                <i className="fab fa-github"></i> GitHub
              </a>
            </div>

            {/* Social Icons */}
            <div className="social-icons">
              <a
                href={PROFILE_DATA.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                aria-label="Facebook"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a
                href={PROFILE_DATA.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                aria-label="Instagram"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a
                href={PROFILE_DATA.github}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                aria-label="GitHub"
              >
                <i className="fab fa-github"></i>
              </a>
              <a
                href={`mailto:${PROFILE_DATA.email}`}
                className="social-icon"
                aria-label="Email"
              >
                <i className="fas fa-envelope"></i>
              </a>
            </div>
          </motion.div>

          {/* Right: Profile Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="hero-image-wrap"
          >
            <div className="profile-card">
              <div className="profile-ring"></div>
              <div className="profile-ring ring-2"></div>
              <img
                src={PROFILE_DATA.avatar}
                alt={PROFILE_DATA.fullName}
                className="profile-photo"
              />
              <div className="profile-badge">
                <i className="fas fa-graduation-cap"></i>
                <span>{PROFILE_DATA.school}</span>
              </div>
              {/* Floating skill chips */}
              <div className="float-chip chip-1">
                <i className="fab fa-react"></i> React &amp; TS
              </div>
              <div className="float-chip chip-2">
                <i className="fas fa-gamepad"></i> Unity C#
              </div>
              <div className="float-chip chip-3">
                <i className="fab fa-laravel"></i> Laravel
              </div>
              <div className="float-chip chip-4">
                <i className="fab fa-discord"></i> Discord.js
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <a href="#about" className="scroll-down" aria-label="Scroll down">
          <span className="scroll-line"></span>
          <i className="fas fa-chevron-down"></i>
        </a>
      </section>

      {/* ===================== ABOUT SECTION ===================== */}
      <section id="about" className="about section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="section-header"
          >
            <span className="section-tag">About Me</span>
            <h2 className="section-title">Who I Am</h2>
          </motion.div>

          <div className="about-grid">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="about-image-col"
            >
              <div className="about-img-wrap">
                <img
                  src={PROFILE_DATA.avatar}
                  alt={PROFILE_DATA.fullName}
                  className="about-photo"
                />
                <div className="about-img-accent"></div>
              </div>
              <div className="about-stats">
                <div className="stat-card">
                  <span className="stat-num">6+</span>
                  <span className="stat-label">Projects Built</span>
                </div>
                <div className="stat-card">
                  <span className="stat-num">18+</span>
                  <span className="stat-label">Tech Skills</span>
                </div>
                <div className="stat-card">
                  <span className="stat-num">1</span>
                  <span className="stat-label">Certificate</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="about-text-col"
            >
              <h3 className="about-heading">
                IT Student. System Builder. Problem Solver.
              </h3>
              <p className="about-para">
                I am an IT student at <strong>STI College</strong> focused on
                building web-based, game, and mobile systems that solve real
                problems. I started with HTML, CSS, and JavaScript, and expanded
                into full-stack engineering with React, TypeScript, Node.js, PHP,
                and Laravel, relational databases with PostgreSQL and MySQL, game
                development in Unity 6 (C#), and mobile development using React
                Native.
              </p>
              <p className="about-para">
                My projects reflect that range. I built{" "}
                <strong>Trivia Attack</strong>, a 2D educational turn-based RPG in
                Unity 6 with 1,449 questions across 5 worlds;{" "}
                <strong>OverView</strong>, a full-stack movie, TV, and anime
                streaming platform with an automated HLS video discovery engine;
                and <strong>SpotiBAI</strong>, a Discord music and Bisaya AI
                companion bot with real-time FFmpeg audio filters and bulk song
                queueing—alongside my <strong>Business Permit System</strong>,{" "}
                <strong>Clinic Management System</strong> for Enlogada Diagnostic
                Clinic, and <strong>CineBai</strong> mobile cinema ticketing app.
              </p>
              <p className="about-para">
                I care about clean interfaces, logical database design, and
                software that feels great to use. I am detail-oriented,
                trainable, and excited about growing through real-world
                development experience.
              </p>

              <div className="about-highlights">
                <div className="highlight-item">
                  <i className="fas fa-check-circle"></i>
                  <span>Full-Stack Web Development</span>
                </div>
                <div className="highlight-item">
                  <i className="fas fa-check-circle"></i>
                  <span>Unity 2D Game &amp; Mobile Dev</span>
                </div>
                <div className="highlight-item">
                  <i className="fas fa-check-circle"></i>
                  <span>Database-Driven Systems</span>
                </div>
                <div className="highlight-item">
                  <i className="fas fa-check-circle"></i>
                  <span>Discord Bots &amp; Real-Time Audio</span>
                </div>
                <div className="highlight-item">
                  <i className="fas fa-check-circle"></i>
                  <span>Oracle Java Certified</span>
                </div>
                <div className="highlight-item">
                  <i className="fas fa-check-circle"></i>
                  <span>Open to Internship &amp; Dev Roles</span>
                </div>
              </div>

              <div className="about-cta">
                <a href="#contact" className="btn btn-primary">
                  Let&apos;s Talk
                </a>
                <a href="#projects" className="btn btn-outline">
                  See My Work
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===================== SKILLS SECTION ===================== */}
      <section id="skills" className="skills section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="section-header"
          >
            <span className="section-tag">Technical Skills</span>
            <h2 className="section-title">What I Work With</h2>
            <p className="section-sub">
              Technologies and tools I use to build complete, functional web,
              game, mobile, and bot systems.
            </p>
          </motion.div>

          <div className="skills-grid">
            {SKILL_CATEGORIES.map((cat, idx) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.06 }}
                className="skill-category"
              >
                <div className="skill-cat-header">
                  <div className="skill-cat-icon">
                    <i className={cat.icon}></i>
                  </div>
                  <h3>{cat.title}</h3>
                </div>
                <div className="skill-badges">
                  {cat.badges.map((badge) => (
                    <div key={badge.name} className="skill-badge">
                      <i className={badge.icon}></i>
                      <span>{badge.name}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Subtle Pauseable Tech Ticker (motion guide) */}
          <div
            style={{
              marginTop: "36px",
              padding: "16px 20px",
              borderRadius: "var(--radius-md)",
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px",
                fontSize: "0.75rem",
                color: "var(--text-muted)",
              }}
            >
              <span>ACTIVE TECH STACK</span>
              <button
                type="button"
                onClick={() => setMarqueePaused((prev) => !prev)}
                aria-pressed={marqueePaused}
                style={{
                  color: "var(--text-secondary)",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <i
                  className={marqueePaused ? "fas fa-play" : "fas fa-pause"}
                ></i>
                <span>{marqueePaused ? "Resume" : "Pause"}</span>
              </button>
            </div>
            <div style={{ overflow: "hidden" }}>
              <div
                className="marquee-track"
                data-paused={marqueePaused ? "true" : "false"}
                style={{ gap: "24px" }}
              >
                {[...TECH_MARQUEE_ITEMS, ...TECH_MARQUEE_ITEMS].map(
                  (item, i) => (
                    <span
                      key={`${item}-${i}`}
                      style={{
                        fontSize: "0.82rem",
                        color: "var(--text-secondary)",
                        fontWeight: 500,
                        whiteSpace: "nowrap",
                      }}
                    >
                      <span
                        style={{
                          color: "var(--accent-orange)",
                          marginRight: "8px",
                        }}
                      >
                        •
                      </span>
                      {item}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== PROJECTS SECTION ===================== */}
      <section id="projects" className="projects section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="section-header"
          >
            <span className="section-tag">My Work</span>
            <h2
              id="projects-grid-heading"
              ref={projectsHeadingRef}
              tabIndex={-1}
              className="section-title"
              style={{ outline: "none" }}
            >
              Featured Projects
            </h2>
            <p className="section-sub">
              Real systems built to solve real problems — spanning Unity 2D
              games, streaming platforms, Discord voice bots, and enterprise web
              apps.
            </p>
          </motion.div>

          {/* Category Filter Pills (View Transitions API) */}
          <div
            role="tablist"
            aria-label="Filter projects by category"
            className="project-filters"
          >
            {PROJECT_FILTERS.map((f) => (
              <button
                key={f.id}
                role="tab"
                type="button"
                aria-selected={activeCategory === f.id}
                onClick={() => handleFilterChange(f.id)}
                className={`filter-btn ${
                  activeCategory === f.id ? "active" : ""
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="projects-grid">
            {filteredProjects.map((project) => {
              const isExpanded = Boolean(expandedDetails[project.id])
              return (
                <article
                  key={project.id}
                  style={{ viewTransitionName: project.vtName }}
                  className="project-card"
                >
                  {/* Top Image Preview */}
                  <div
                    className={`project-img-wrap ${
                      project.previewType === "mobile" ? "mobile-wrap" : ""
                    }`}
                    onClick={() =>
                      openImageViewer(
                        project,
                        project.images.length > 1 ? 1 : 0
                      )
                    }
                  >
                    {project.previewType === "duo" &&
                    project.images.length >= 2 ? (
                      <div className="project-img-duo">
                        <img
                          src={project.images[0].src}
                          alt={project.images[0].caption}
                          className="duo-img duo-back"
                          loading="lazy"
                        />
                        <img
                          src={project.images[1].src}
                          alt={project.images[1].caption}
                          className="duo-img duo-front"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <img
                        src={project.images[0].src}
                        alt={project.images[0].caption}
                        className={`project-img ${
                          project.previewType === "mobile" ? "mobile-img" : ""
                        }`}
                        loading="lazy"
                      />
                    )}

                    <div className="project-overlay">
                      <span className="overlay-label">
                        <i className={project.overlayIcon}></i>{" "}
                        {project.overlayLabel}
                      </span>
                    </div>
                    <span className="project-num">{project.num}</span>
                  </div>

                  {/* Card Body */}
                  <div className="project-body">
                    <div className="project-tags">
                      {project.tags.map((tag) => (
                        <span key={tag} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <h3 className="project-title">{project.title}</h3>
                    <p className="project-desc">{project.description}</p>

                    <ul className="project-features">
                      {project.features.map((feat) => (
                        <li key={feat}>
                          <i className="fas fa-check"></i> {feat}
                        </li>
                      ))}
                    </ul>

                    <div className="project-actions">
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        aria-expanded={isExpanded}
                        onClick={() => toggleProjectDetails(project.id)}
                      >
                        <i
                          className={
                            isExpanded ? "fas fa-eye-slash" : "fas fa-eye"
                          }
                        ></i>{" "}
                        {isExpanded ? "Hide Details" : "View Details"}
                      </button>

                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() =>
                          openImageViewer(
                            project,
                            project.images.length > 1 ? 1 : 0
                          )
                        }
                      >
                        <i className="fas fa-expand"></i> Preview Screens
                      </button>
                    </div>

                    {/* Discrete Expandable Details (animate-element-entry-exit) */}
                    <div
                      ref={(el) => {
                        detailRefs.current[project.id] = el
                      }}
                      className="project-details"
                      hidden
                    >
                      <p>{project.detailText}</p>
                      <span className="detail-note">{project.detailNote}</span>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* ===================== CERTIFICATE SECTION ===================== */}
      <section id="certificate" className="certificate section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="section-header"
          >
            <span className="section-tag">Achievements</span>
            <h2 className="section-title">Certifications</h2>
            <p className="section-sub">
              Verified credentials that back up my technical knowledge.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="cert-wrapper"
          >
            <div className="cert-card">
              <div className="cert-left">
                <div className="cert-issuer">
                  <div className="oracle-logo">
                    <span className="oracle-text">ORACLE</span>
                    <span className="academy-text">Academy</span>
                  </div>
                </div>
                <div className="cert-badge-wrap">
                  <div className="cert-badge-icon">
                    <i className="fab fa-java"></i>
                  </div>
                  <div className="cert-glow"></div>
                </div>
                <div className="cert-meta">
                  <span className="cert-type-label">Course Completion</span>
                </div>
              </div>

              <div className="cert-right">
                <div className="cert-top-label">Award of Course Completion</div>
                <h3 className="cert-name">Java Fundamentals</h3>
                <p className="cert-recipient">
                  Presented to <strong>{PROFILE_DATA.fullName}</strong>
                </p>
                <p className="cert-date">
                  <i className="far fa-calendar-alt"></i> Completed: June 19,
                  2024
                </p>
                <p className="cert-description">
                  Awarded by Oracle Academy for the satisfactory completion of
                  all coursework in Java Fundamentals. This certification
                  demonstrates foundational programming knowledge including
                  object-oriented principles, data structures, and core Java
                  syntax.
                </p>

                <div className="cert-actions">
                  <a
                    href={PROFILE_DATA.certificatePdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                  >
                    <i className="fas fa-eye"></i> View Certificate
                  </a>
                </div>

                <div className="cert-verified">
                  <i className="fas fa-shield-alt"></i>
                  <span>Verified by Oracle Academy</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===================== CONTACT SECTION ===================== */}
      <section id="contact" className="contact section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="section-header"
          >
            <span className="section-tag">Get In Touch</span>
            <h2 className="section-title">Contact Me</h2>
            <p className="section-sub">
              Open to internship opportunities, collaborations, and
              conversations about development.
            </p>
          </motion.div>

          <div className="contact-grid">
            {/* Contact Info */}
            <div className="contact-info">
              <h3 className="contact-info-title">Let&apos;s Connect</h3>
              <p className="contact-info-sub">
                Whether you have a project in mind, an internship offer, or just
                want to say hi — my inbox is open.
              </p>

              <div className="contact-items">
                <a
                  href={`mailto:${PROFILE_DATA.email}`}
                  className="contact-item"
                >
                  <div className="contact-icon">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div className="contact-detail">
                    <span className="contact-label">Email</span>
                    <span className="contact-value">{PROFILE_DATA.email}</span>
                  </div>
                </a>

                <a href={`tel:${PROFILE_DATA.phone}`} className="contact-item">
                  <div className="contact-icon">
                    <i className="fas fa-phone"></i>
                  </div>
                  <div className="contact-detail">
                    <span className="contact-label">Phone</span>
                    <span className="contact-value">{PROFILE_DATA.phone}</span>
                  </div>
                </a>

                <div className="contact-item">
                  <div className="contact-icon">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <div className="contact-detail">
                    <span className="contact-label">Location</span>
                    <span className="contact-value">
                      {PROFILE_DATA.location}
                    </span>
                  </div>
                </div>
              </div>

              <div className="contact-socials">
                <a
                  href={PROFILE_DATA.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon"
                  aria-label="Facebook"
                >
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a
                  href={PROFILE_DATA.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon"
                  aria-label="Instagram"
                >
                  <i className="fab fa-instagram"></i>
                </a>
                <a
                  href={PROFILE_DATA.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon"
                  aria-label="GitHub"
                >
                  <i className="fab fa-github"></i>
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div className="contact-form-wrap">
              {formSent ? (
                <div className="form-success">
                  <i className="fas fa-check-circle"></i>
                  <h4>Message Sent!</h4>
                  <p>
                    Thank you for reaching out. I&apos;ll get back to you as soon
                    as possible.
                  </p>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => setFormSent(false)}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleContactSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name">Full Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Your full name"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, name: e.target.value }))
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="your@email.com"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, email: e.target.value }))
                        }
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="subject">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      placeholder="What is this about?"
                      required
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, subject: e.target.value }))
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      placeholder="Tell me about your project or opportunity..."
                      required
                      value={formData.message}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, message: e.target.value }))
                      }
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary btn-full">
                    <i className="fas fa-paper-plane"></i> Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===================== FOOTER ===================== */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-top">
            <div className="footer-brand">
              <a href="#home" className="footer-logo">
                <span className="logo-bracket">&lt;</span>SFS
                <span className="logo-bracket">/&gt;</span>
              </a>
              <p className="footer-tagline">
                {PROFILE_DATA.fullName}
                <br />
                IT Student — {PROFILE_DATA.school}
              </p>
              <p className="footer-sub">
                Full-Stack Web, Game &amp; Mobile Portfolio
              </p>
            </div>

            <div className="footer-links-col">
              <h4>Navigation</h4>
              <ul>
                {NAV_LINKS.map((l) => (
                  <li key={l.id}>
                    <a href={`#${l.id}`}>{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-links-col">
              <h4>Contact</h4>
              <ul>
                <li>
                  <a href={`mailto:${PROFILE_DATA.email}`}>
                    <i className="fas fa-envelope"></i> {PROFILE_DATA.email}
                  </a>
                </li>
                <li>
                  <a href={`tel:${PROFILE_DATA.phone}`}>
                    <i className="fas fa-phone"></i> {PROFILE_DATA.phone}
                  </a>
                </li>
              </ul>
            </div>

            <div className="footer-links-col">
              <h4>Connect</h4>
              <ul>
                <li>
                  <a
                    href={PROFILE_DATA.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-facebook-f"></i> Facebook
                  </a>
                </li>
                <li>
                  <a
                    href={PROFILE_DATA.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-instagram"></i> Instagram
                  </a>
                </li>
                <li>
                  <a
                    href={PROFILE_DATA.github}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-github"></i> GitHub
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>
              &copy; {new Date().getFullYear()} {PROFILE_DATA.fullName}. All
              rights reserved.
            </p>
            <p>
              Built with{" "}
              <i
                className="fas fa-heart"
                style={{ color: "var(--accent-red)" }}
              ></i>{" "}
              using React, TypeScript, shadcn/ui &amp; Framer Motion
            </p>
          </div>
        </div>
      </footer>

      {/* Back to top button */}
      <button
        type="button"
        className={`back-to-top ${showBackToTop ? "visible" : ""}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
      >
        <i className="fas fa-arrow-up"></i>
      </button>

      {/* ===================== TOP-LAYER IMAGE VIEWER DIALOG ===================== */}
      <dialog
        ref={dialogRef}
        {...({
          closedby: "any",
        } as React.DialogHTMLAttributes<HTMLDialogElement>)}
        aria-labelledby="image-viewer-caption"
        className="case-study-dialog"
      >
        {viewerProject && (
          <div className="image-viewer-panel">
            <button
              type="button"
              className="image-viewer-close"
              onClick={closeImageViewer}
              aria-label="Close image preview"
            >
              <i className="fas fa-times"></i>
            </button>

            {viewerProject.images.length > 1 && (
              <>
                <button
                  type="button"
                  className="image-viewer-nav image-viewer-prev"
                  onClick={() => stepViewerImage(-1)}
                  aria-label="Previous screenshot"
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                <button
                  type="button"
                  className="image-viewer-nav image-viewer-next"
                  onClick={() => stepViewerImage(1)}
                  aria-label="Next screenshot"
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </>
            )}

            <div className="image-viewer-frame">
              <img
                src={
                  (
                    viewerProject.images[viewerIndex] ??
                    viewerProject.images[0]
                  ).src
                }
                alt={
                  (
                    viewerProject.images[viewerIndex] ??
                    viewerProject.images[0]
                  ).caption
                }
                className="image-viewer-img"
              />
            </div>

            <p id="image-viewer-caption" className="image-viewer-caption">
              {
                (
                  viewerProject.images[viewerIndex] ??
                  viewerProject.images[0]
                ).caption
              }
            </p>
          </div>
        )}
      </dialog>
    </>
  )
}

export default App
