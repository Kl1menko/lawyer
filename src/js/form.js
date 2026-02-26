const PHONE_FALLBACK = '+380679649515';
const EMAIL_FALLBACK = 'klimenko74@meta.ua';

function setStatus(node, message, state = '') {
  if (!node) return;
  node.textContent = message;
  node.dataset.state = state;
}

function sanitizePhone(value) {
  return value.replace(/[^\d+()\-\s]/g, '').trim();
}

function buildMailto({ email, name, phone, details, page }) {
  const subject = 'Звернення з сайту — Ладижин';
  const bodyLines = [
    `Сторінка: ${page}`,
    `Ім'я: ${name}`,
    `Телефон: ${phone || 'Не вказано'}`,
    '',
    'Опис справи:',
    details
  ];

  return `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join('\n'))}`;
}

function attachForm(form) {
  const status = form.querySelector('.form-status');
  const submit = form.querySelector('[type="submit"]');
  const email = form.dataset.email || EMAIL_FALLBACK;
  const page = form.dataset.page || window.location.pathname;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const nameInput = form.querySelector('[name="name"]');
    const phoneInput = form.querySelector('[name="phone"]');
    const detailsInput = form.querySelector('[name="details"]');
    const consentInput = form.querySelector('[name="consent"]');

    const name = nameInput?.value.trim() || '';
    const phone = sanitizePhone(phoneInput?.value || '');
    const details = detailsInput?.value.trim() || '';
    const consent = Boolean(consentInput?.checked);

    if (!name || !details || !consent) {
      setStatus(status, 'Заповніть ім\'я, опис справи та підтвердьте згоду на обробку даних.', 'error');
      return;
    }

    if (details.length < 15) {
      setStatus(status, 'Опишіть справу трохи детальніше (мінімум 15 символів).', 'error');
      return;
    }

    const mailto = buildMailto({ email, name, phone, details, page });
    setStatus(status, 'Відкриваємо вашу пошту… Якщо лист не відкрився, скористайтеся кнопкою пошти нижче.', 'ok');

    if (submit) {
      submit.disabled = true;
      submit.setAttribute('aria-busy', 'true');
    }

    window.location.href = mailto;

    window.setTimeout(() => {
      if (submit) {
        submit.disabled = false;
        submit.removeAttribute('aria-busy');
      }
    }, 1200);
  });
}

function attachCallButtons() {
  document.querySelectorAll('[data-phone-link]').forEach((link) => {
    const raw = link.getAttribute('data-phone-link') || PHONE_FALLBACK;
    const tel = raw.replace(/[^\d+]/g, '');
    link.setAttribute('href', `tel:${tel}`);
  });
}

export function initForms() {
  attachCallButtons();
  document.querySelectorAll('.js-contact-form').forEach(attachForm);
}
