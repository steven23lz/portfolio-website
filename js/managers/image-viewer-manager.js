/* ===================== IMAGE VIEWER MANAGER ===================== */
class ImageViewerManager {
  constructor() {
    this.imageWraps = document.querySelectorAll(".project-img-wrap");
    this.images = [];
    this.currentIndex = 0;
    this.viewer = null;
    this.viewerImage = null;
    this.caption = null;
    this.prevButton = null;
    this.nextButton = null;
  }

  init() {
    if (!this.imageWraps.length) return;

    this.createViewer();
    this.bindProjectImages();
    this.bindViewerControls();
  }

  createViewer() {
    this.viewer = document.createElement("div");
    this.viewer.className = "image-viewer";
    this.viewer.setAttribute("role", "dialog");
    this.viewer.setAttribute("aria-modal", "true");
    this.viewer.setAttribute("aria-label", "Project screenshot viewer");

    this.viewer.innerHTML = `
      <div class="image-viewer-panel">
        <button type="button" class="image-viewer-close" aria-label="Close image viewer">
          <i class="fas fa-times"></i>
        </button>
        <button type="button" class="image-viewer-nav image-viewer-prev" aria-label="Previous image">
          <i class="fas fa-chevron-left"></i>
        </button>
        <div class="image-viewer-frame">
          <img src="" alt="" class="image-viewer-img" />
        </div>
        <button type="button" class="image-viewer-nav image-viewer-next" aria-label="Next image">
          <i class="fas fa-chevron-right"></i>
        </button>
        <p class="image-viewer-caption"></p>
      </div>
    `;

    document.body.appendChild(this.viewer);
    this.viewerImage = this.viewer.querySelector(".image-viewer-img");
    this.caption = this.viewer.querySelector(".image-viewer-caption");
    this.prevButton = this.viewer.querySelector(".image-viewer-prev");
    this.nextButton = this.viewer.querySelector(".image-viewer-next");
  }

  bindProjectImages() {
    this.imageWraps.forEach((wrap) => {
      wrap.setAttribute("role", "button");
      wrap.setAttribute("tabindex", "0");
      wrap.setAttribute("aria-label", "Open project screenshot");

      wrap.addEventListener("click", () => this.openFromWrap(wrap));
      wrap.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          this.openFromWrap(wrap);
        }
      });
    });
  }

  bindViewerControls() {
    const closeButton = this.viewer.querySelector(".image-viewer-close");

    closeButton?.addEventListener("click", () => this.close());
    this.prevButton?.addEventListener("click", () => this.showPrevious());
    this.nextButton?.addEventListener("click", () => this.showNext());

    this.viewer.addEventListener("click", (event) => {
      if (event.target === this.viewer) {
        this.close();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (!this.viewer.classList.contains("open")) return;

      if (event.key === "Escape") this.close();
      if (event.key === "ArrowLeft") this.showPrevious();
      if (event.key === "ArrowRight") this.showNext();
    });
  }

  openFromWrap(wrap) {
    this.images = Array.from(wrap.querySelectorAll("img")).map((image) => ({
      src: image.getAttribute("src"),
      alt: image.getAttribute("alt") || "Project screenshot",
    }));

    if (!this.images.length) return;

    this.currentIndex = 0;
    this.renderCurrentImage();
    this.viewer.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  renderCurrentImage() {
    const image = this.images[this.currentIndex];
    if (!image || !this.viewerImage || !this.caption) return;

    this.viewerImage.src = image.src;
    this.viewerImage.alt = image.alt;
    this.caption.textContent = `${image.alt} (${this.currentIndex + 1} of ${this.images.length})`;

    const hasMultipleImages = this.images.length > 1;
    this.prevButton?.toggleAttribute("hidden", !hasMultipleImages);
    this.nextButton?.toggleAttribute("hidden", !hasMultipleImages);
  }

  showPrevious() {
    if (this.images.length <= 1) return;

    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.renderCurrentImage();
  }

  showNext() {
    if (this.images.length <= 1) return;

    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.renderCurrentImage();
  }

  close() {
    this.viewer?.classList.remove("open");
    document.body.style.overflow = "";
  }
}

