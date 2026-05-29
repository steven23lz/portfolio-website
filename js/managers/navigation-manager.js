/* ===================== NAVIGATION MANAGER ===================== */
class NavigationManager {
  constructor() {
    this.navbar = document.getElementById("navbar");
    this.navLinksContainer = document.getElementById("navLinks");
    this.navLinks = document.querySelectorAll(".nav-link");
    this.hamburger = document.getElementById("hamburger");
    this.mobileOverlay = document.getElementById("mobileOverlay");
    this.sections = document.querySelectorAll("section[id]");
    this.navbarHeight = 72;
  }

  init() {
    this.bindMobileMenu();
    this.bindSmoothScroll();
    this.bindScrollEvents();
    this.closeMenuOnResize();
    this.handleScroll();
  }

  bindMobileMenu() {
    if (this.hamburger) {
      this.hamburger.addEventListener("click", () => this.toggleMenu());
    }

    if (this.mobileOverlay) {
      this.mobileOverlay.addEventListener("click", () => this.closeMenu());
    }
  }

  toggleMenu() {
    const isOpen = this.navLinksContainer?.classList.contains("open");

    if (isOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  openMenu() {
    this.navLinksContainer?.classList.add("open");
    this.hamburger?.classList.add("open");
    this.mobileOverlay?.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  closeMenu() {
    this.navLinksContainer?.classList.remove("open");
    this.hamburger?.classList.remove("open");
    this.mobileOverlay?.classList.remove("open");
    document.body.style.overflow = "";
  }

  bindSmoothScroll() {
    const internalLinks = document.querySelectorAll('a[href^="#"]');

    internalLinks.forEach((link) => {
      link.addEventListener("click", (event) => {
        const targetId = link.getAttribute("href");

        if (!targetId || targetId === "#") {
          event.preventDefault();
          return;
        }

        const targetSection = document.querySelector(targetId);

        if (!targetSection) return;

        event.preventDefault();
        this.closeMenu();

        const topPosition =
          targetSection.getBoundingClientRect().top +
          window.scrollY -
          this.navbarHeight +
          2;

        window.scrollTo({
          top: topPosition,
          behavior: "smooth",
        });
      });
    });
  }

  bindScrollEvents() {
    window.addEventListener("scroll", () => this.handleScroll(), { passive: true });
  }

  handleScroll() {
    this.updateNavbarStyle();
    this.updateActiveLink();
  }

  updateNavbarStyle() {
    if (!this.navbar) return;

    if (window.scrollY > 20) {
      this.navbar.classList.add("scrolled");
    } else {
      this.navbar.classList.remove("scrolled");
    }
  }

  updateActiveLink() {
    let currentSectionId = "home";
    const scrollPosition = window.scrollY + this.navbarHeight + 120;

    this.sections.forEach((section) => {
      if (scrollPosition >= section.offsetTop) {
        currentSectionId = section.getAttribute("id");
      }
    });

    this.navLinks.forEach((link) => {
      link.classList.remove("active");

      if (link.getAttribute("href") === `#${currentSectionId}`) {
        link.classList.add("active");
      }
    });
  }

  closeMenuOnResize() {
    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) {
        this.closeMenu();
      }
    });
  }
}

