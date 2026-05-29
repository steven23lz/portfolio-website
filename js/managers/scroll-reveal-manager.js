/* ===================== SCROLL REVEAL MANAGER ===================== */
class ScrollRevealManager {
  constructor() {
    this.revealItems = document.querySelectorAll(".reveal-item");
    this.options = {
      threshold: 0.15,
      rootMargin: "0px 0px -80px 0px",
    };
  }

  init() {
    if (!this.revealItems.length) return;

    if (!("IntersectionObserver" in window)) {
      this.revealItems.forEach((item) => item.classList.add("revealed"));
      return;
    }

    this.prepareItems();
    this.observeItems();
  }

  prepareItems() {
    this.revealItems.forEach((item, index) => {
      const delay = Math.min(index * 60, 360);
      item.style.transitionDelay = `${delay}ms`;
    });
  }

  observeItems() {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          currentObserver.unobserve(entry.target);
        }
      });
    }, this.options);

    this.revealItems.forEach((item) => observer.observe(item));
  }
}

