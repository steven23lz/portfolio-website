/* ===================== PORTFOLIO APP CONTROLLER ===================== */
class PortfolioApp {
  constructor() {
    this.themeManager = new ThemeManager();
    this.navigationManager = new NavigationManager();
    this.typewriterManager = new TypewriterManager();
    this.scrollRevealManager = new ScrollRevealManager();
    this.contactFormManager = new ContactFormManager();
    this.backToTopManager = new BackToTopManager();
    this.projectInteractionManager = new ProjectInteractionManager();
    this.imageViewerManager = new ImageViewerManager();
  }

  init() {
    this.themeManager.init();
    this.navigationManager.init();
    this.typewriterManager.init();
    this.scrollRevealManager.init();
    this.contactFormManager.init();
    this.backToTopManager.init();
    this.projectInteractionManager.init();
    this.imageViewerManager.init();

    console.log("Steven Floyd Sendrijas Portfolio initialized successfully.");
  }
}

/* ===================== INITIALIZE APP ===================== */
document.addEventListener("DOMContentLoaded", () => {
  const app = new PortfolioApp();
  app.init();
});
