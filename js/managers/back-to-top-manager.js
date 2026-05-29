/* ===================== BACK TO TOP MANAGER ===================== */
class BackToTopManager {
  constructor() {
    this.button = document.getElementById("backToTop");
    this.visibleClass = "visible";
  }

  init() {
    if (!this.button) return;

    window.addEventListener("scroll", () => this.toggleVisibility(), { passive: true });
    this.button.addEventListener("click", () => this.scrollToTop());
    this.toggleVisibility();
  }

  toggleVisibility() {
    if (window.scrollY > 450) {
      this.button.classList.add(this.visibleClass);
    } else {
      this.button.classList.remove(this.visibleClass);
    }
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
}

