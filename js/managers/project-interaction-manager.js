/* ===================== PROJECT INTERACTION MANAGER ===================== */
class ProjectInteractionManager {
  constructor() {
    this.projectCards = document.querySelectorAll(".project-card");
    this.detailToggles = document.querySelectorAll(".project-detail-toggle");
    this.placeholderLinks = document.querySelectorAll('a[href="#"]');
  }

  init() {
    this.addCardTiltEffect();
    this.bindDetailToggles();
    this.handlePlaceholderLinks();
  }

  addCardTiltEffect() {
    this.projectCards.forEach((card) => {
      card.addEventListener("mousemove", (event) => this.tiltCard(event, card));
      card.addEventListener("mouseleave", () => this.resetCard(card));
    });
  }

  tiltCard(event, card) {
    if (window.innerWidth <= 768) return;

    const rect = card.getBoundingClientRect();
    const cardCenterX = rect.left + rect.width / 2;
    const cardCenterY = rect.top + rect.height / 2;

    const rotateX = ((event.clientY - cardCenterY) / rect.height) * -4;
    const rotateY = ((event.clientX - cardCenterX) / rect.width) * 4;

    card.style.transform = `translateY(-6px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  }

  resetCard(card) {
    card.style.transform = "";
  }

  bindDetailToggles() {
    this.detailToggles.forEach((button) => {
      button.addEventListener("click", () => {
        const detailsId = button.dataset.detailsTarget;
        const details = detailsId ? document.getElementById(detailsId) : null;

        if (!details) return;

        const isOpening = details.hasAttribute("hidden");
        details.toggleAttribute("hidden", !isOpening);
        button.setAttribute("aria-expanded", String(isOpening));
        button.innerHTML = isOpening
          ? '<i class="fas fa-eye-slash"></i> Hide Details'
          : '<i class="fas fa-eye"></i> View Details';
      });
    });
  }

  handlePlaceholderLinks() {
    this.placeholderLinks.forEach((link) => {
      link.addEventListener("click", (event) => {
        const isInternalAnchor = link.getAttribute("href")?.startsWith("#") && link.getAttribute("href") !== "#";

        if (isInternalAnchor) return;

        event.preventDefault();
        alert("This link is a placeholder. Replace it with your actual project or Vercel link before submission.");
      });
    });
  }
}

