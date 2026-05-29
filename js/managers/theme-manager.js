/* ===================== THEME MANAGER ===================== */
class ThemeManager {
  constructor() {
    this.html = document.documentElement;
    this.themeToggle = document.getElementById("themeToggle");
    this.themeIcon = document.getElementById("themeIcon");
    this.storageKey = "steven-portfolio-theme";
  }

  init() {
    this.applySavedTheme();

    if (this.themeToggle) {
      this.themeToggle.addEventListener("click", () => this.toggleTheme());
    }
  }

  applySavedTheme() {
    const savedTheme = localStorage.getItem(this.storageKey);
    const defaultTheme = this.html.getAttribute("data-theme") || "dark";
    const activeTheme = savedTheme || defaultTheme;

    this.setTheme(activeTheme);
  }

  toggleTheme() {
    const currentTheme = this.html.getAttribute("data-theme") || "dark";
    const nextTheme = currentTheme === "dark" ? "light" : "dark";

    this.setTheme(nextTheme);
    localStorage.setItem(this.storageKey, nextTheme);
  }

  setTheme(theme) {
    this.html.setAttribute("data-theme", theme);
    this.updateIcon(theme);
  }

  updateIcon(theme) {
    if (!this.themeIcon) return;

    this.themeIcon.classList.remove("fa-moon", "fa-sun");

    if (theme === "dark") {
      this.themeIcon.classList.add("fa-sun");
      this.themeToggle?.setAttribute("aria-label", "Switch to light mode");
    } else {
      this.themeIcon.classList.add("fa-moon");
      this.themeToggle?.setAttribute("aria-label", "Switch to dark mode");
    }
  }
}

