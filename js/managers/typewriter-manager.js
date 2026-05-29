/* ===================== TYPEWRITER MANAGER ===================== */
class TypewriterManager {
  constructor() {
    this.textElement = document.getElementById("typedText");
    this.phrases = [
      "IT Student at STI College",
      "Aspiring Web Developer",
      "Aspiring Mobile Developer",
      "Full Stack Learner",
      "System Builder"
    ];

    this.phraseIndex = 0;
    this.charIndex = 0;
    this.isDeleting = false;
    this.typeSpeed = 70;
    this.deleteSpeed = 35;
    this.pauseTime = 1300;
  }

  init() {
    if (!this.textElement) return;
    this.type();
  }

  type() {
    const currentPhrase = this.phrases[this.phraseIndex];

    if (this.isDeleting) {
      this.charIndex--;
    } else {
      this.charIndex++;
    }

    this.textElement.textContent = currentPhrase.substring(0, this.charIndex);

    let speed = this.isDeleting ? this.deleteSpeed : this.typeSpeed;

    if (!this.isDeleting && this.charIndex === currentPhrase.length) {
      speed = this.pauseTime;
      this.isDeleting = true;
    }

    if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false;
      this.phraseIndex = (this.phraseIndex + 1) % this.phrases.length;
      speed = 300;
    }

    setTimeout(() => this.type(), speed);
  }
}

