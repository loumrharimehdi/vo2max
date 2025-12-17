/* =====================================================
   VO2MAX LYON - FORM HANDLING
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initContactForm();
});

function initContactForm() {
    const form = document.querySelector('.contact-form form');
    if (!form) return;

    form.addEventListener('submit', handleFormSubmit);

    // Real-time validation
    const inputs = form.querySelectorAll('.form-input');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearError(input));
    });
}

function handleFormSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    let isValid = true;

    // Validate all fields
    form.querySelectorAll('.form-input[required]').forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });

    if (!isValid) {
        showNotification('Veuillez corriger les erreurs dans le formulaire.', 'error');
        return;
    }

    // Show loading state
    const submitBtn = form.querySelector('.contact-form__submit');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Envoi en cours...';
    submitBtn.disabled = true;

    // Simulate form submission (replace with actual endpoint)
    // For FormSubmit.co integration:
    // form.action = "https://formsubmit.co/contact@vo2max-lyon.com";

    setTimeout(() => {
        // Show success message
        showFormSuccess(form);
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 1500);
}

function validateField(input) {
    const value = input.value.trim();
    const type = input.type;
    const name = input.name;
    let isValid = true;
    let errorMessage = '';

    // Required check
    if (input.required && !value) {
        isValid = false;
        errorMessage = 'Ce champ est requis.';
    }

    // Email validation
    else if (type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Veuillez entrer une adresse email valide.';
        }
    }

    // Phone validation
    else if (type === 'tel' && value) {
        const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessage = 'Veuillez entrer un numéro de téléphone valide.';
        }
    }

    // Min length check
    else if (input.minLength && value.length < input.minLength) {
        isValid = false;
        errorMessage = `Minimum ${input.minLength} caractères requis.`;
    }

    if (!isValid) {
        showError(input, errorMessage);
    } else {
        clearError(input);
    }

    return isValid;
}

function showError(input, message) {
    const formGroup = input.closest('.form-group');
    if (!formGroup) return;

    clearError(input);

    input.style.borderColor = 'var(--color-error)';

    const errorEl = document.createElement('span');
    errorEl.className = 'form-error';
    errorEl.textContent = message;
    formGroup.appendChild(errorEl);
}

function clearError(input) {
    const formGroup = input.closest('.form-group');
    if (!formGroup) return;

    input.style.borderColor = '';

    const errorEl = formGroup.querySelector('.form-error');
    if (errorEl) {
        errorEl.remove();
    }
}

function showFormSuccess(form) {
    const formContainer = form.closest('.contact-form');

    const successHTML = `
    <div class="contact-form__success">
      <div class="contact-form__success-icon">✓</div>
      <h3 class="contact-form__success-title">Message envoyé !</h3>
      <p class="contact-form__success-text">
        Merci pour votre message. Nous vous répondrons dans les plus brefs délais.
      </p>
      <button class="btn btn--primary" onclick="resetForm(this)">
        Envoyer un autre message
      </button>
    </div>
  `;

    // Store form HTML for reset
    formContainer.dataset.formHtml = formContainer.innerHTML;
    formContainer.innerHTML = successHTML;
}

function resetForm(btn) {
    const formContainer = btn.closest('.contact-form');
    if (formContainer.dataset.formHtml) {
        formContainer.innerHTML = formContainer.dataset.formHtml;
        initContactForm();
    }
}

function showNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    padding: 16px 24px;
    background: ${type === 'error' ? 'var(--color-error)' : 'var(--color-accent)'};
    color: white;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 500;
    z-index: 1000;
    animation: fadeInRight 0.3s ease;
  `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'fadeOutRight 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Make resetForm globally available
window.resetForm = resetForm;
