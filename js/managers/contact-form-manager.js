/* ===================== CONTACT FORM MANAGER ===================== */
class ContactFormManager {
  constructor() {
    this.form = document.getElementById("contactForm");
    this.successBox = document.getElementById("formSuccess");
    this.submitButton = document.getElementById("submitBtn");

    this.fields = {
      name: document.getElementById("name"),
      email: document.getElementById("email"),
      subject: document.getElementById("subject"),
      message: document.getElementById("message"),
    };

    this.errors = {
      name: document.getElementById("nameError"),
      email: document.getElementById("emailError"),
      subject: document.getElementById("subjectError"),
      message: document.getElementById("messageError"),
    };
  }

  init() {
    if (!this.form) return;

    this.form.addEventListener("submit", (event) => this.handleSubmit(event));

    Object.values(this.fields).forEach((field) => {
      if (!field) return;

      field.addEventListener("input", () => {
        this.clearError(field.name);
      });
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    if (!this.validateForm()) return;

    this.setLoading(true);

    setTimeout(() => {
      this.setLoading(false);
      this.showSuccessMessage();
      this.form.reset();
    }, 700);
  }

  validateForm() {
    let isValid = true;

    if (!this.fields.name.value.trim()) {
      this.showError("name", "Please enter your full name.");
      isValid = false;
    }

    if (!this.fields.email.value.trim()) {
      this.showError("email", "Please enter your email address.");
      isValid = false;
    } else if (!this.isValidEmail(this.fields.email.value.trim())) {
      this.showError("email", "Please enter a valid email address.");
      isValid = false;
    }

    if (!this.fields.subject.value.trim()) {
      this.showError("subject", "Please enter a subject.");
      isValid = false;
    }

    if (!this.fields.message.value.trim()) {
      this.showError("message", "Please enter your message.");
      isValid = false;
    } else if (this.fields.message.value.trim().length < 10) {
      this.showError("message", "Message should be at least 10 characters.");
      isValid = false;
    }

    return isValid;
  }

  isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  showError(fieldName, message) {
    if (this.errors[fieldName]) {
      this.errors[fieldName].textContent = message;
    }

    if (this.fields[fieldName]) {
      this.fields[fieldName].setAttribute("aria-invalid", "true");
    }
  }

  clearError(fieldName) {
    if (this.errors[fieldName]) {
      this.errors[fieldName].textContent = "";
    }

    if (this.fields[fieldName]) {
      this.fields[fieldName].removeAttribute("aria-invalid");
    }
  }

  setLoading(isLoading) {
    if (!this.submitButton) return;

    const buttonText = this.submitButton.querySelector(".btn-text");
    const buttonLoader = this.submitButton.querySelector(".btn-loader");

    this.submitButton.disabled = isLoading;

    if (buttonText && buttonLoader) {
      buttonText.style.display = isLoading ? "none" : "inline-flex";
      buttonLoader.style.display = isLoading ? "inline-flex" : "none";
    }
  }

  showSuccessMessage() {
    if (!this.form || !this.successBox) return;

    this.form.style.display = "none";
    this.successBox.style.display = "flex";

    setTimeout(() => {
      this.successBox.style.display = "none";
      this.form.style.display = "flex";
    }, 4500);
  }
}

