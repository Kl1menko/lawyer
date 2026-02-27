import { initForms } from './form.js';
import { initSeoHelpers } from './seo.js';

function initMobileMenu() {
  const toggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-nav-panel]');
  if (!toggle || !nav) return;

  if (!nav.querySelector('.mobile-nav-cta')) {
    const phoneLink = document.querySelector('[data-phone-link]');
    const href = phoneLink?.getAttribute('href') || 'tel:+380679649515';
    const ctaWrap = document.createElement('div');
    ctaWrap.className = 'mobile-nav-cta';
    ctaWrap.innerHTML = `
      <a class="btn btn--primary" href="${href}" aria-label="Подзвонити">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.2 19.2 0 0 1-6-6A19.8 19.8 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.12.9.35 1.78.68 2.62a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6.27 6.27l1.28-1.29a2 2 0 0 1 2.11-.45c.84.33 1.72.56 2.62.68A2 2 0 0 1 22 16.92z"></path>
        </svg>
        Подзвонити
      </a>
    `;
    nav.appendChild(ctaWrap);
  }

  const setOpen = (open) => {
    nav.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Закрити меню' : 'Відкрити меню');
    document.body.classList.toggle('nav-open', open);
  };

  setOpen(false);

  toggle.addEventListener('click', () => {
    setOpen(nav.getAttribute('aria-expanded') !== 'true');
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });
}

function initReveals() {
  const items = [...document.querySelectorAll('.reveal')];
  if (!items.length || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  items.forEach((el) => observer.observe(el));
}

function initScrollCallCta() {
  const trigger = document.querySelector('.why-split');
  if (!trigger) return;

  const phoneLink = document.querySelector('[data-phone-link]');
  const href = phoneLink?.getAttribute('href') || 'tel:+380679649515';

  const cta = document.createElement('a');
  cta.href = href;
  cta.className = 'scroll-call-cta';
  cta.setAttribute('aria-label', 'Зателефонувати');
  cta.innerHTML = `
    <span class="scroll-call-cta__icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.2 19.2 0 0 1-6-6A19.8 19.8 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.12.9.35 1.78.68 2.62a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6.27 6.27l1.28-1.29a2 2 0 0 1 2.11-.45c.84.33 1.72.56 2.62.68A2 2 0 0 1 22 16.92z"></path>
      </svg>
    </span>
    <span class="scroll-call-cta__label">Зателефонувати</span>
  `;
  document.body.appendChild(cta);

  const setVisible = (visible) => {
    cta.classList.toggle('is-visible', visible);
  };

  if (!('IntersectionObserver' in window)) {
    setVisible(true);
    return;
  }

  let hasReached = false;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          hasReached = true;
        } else if (entry.boundingClientRect.top > window.innerHeight * 0.7) {
          hasReached = false;
        }
        setVisible(hasReached);
      });
    },
    {
      threshold: 0.05,
      rootMargin: '0px 0px -10% 0px',
    }
  );

  observer.observe(trigger);
}

function initFooterSocials() {
  const footerCols = document.querySelectorAll('.site-footer .footer-grid > div');
  if (!footerCols.length) return;

  const targetCol = footerCols[footerCols.length - 1];
  if (!targetCol || targetCol.querySelector('.footer-socials')) return;

  const socialWrap = document.createElement('div');
  socialWrap.className = 'footer-socials';
  socialWrap.setAttribute('aria-label', 'Соціальні мережі');
  socialWrap.innerHTML = `
    <a class="footer-socials__link" href="https://www.facebook.com/advokat.irina.klimenko" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
      <img src="/icons/social/facebook.png" alt="" loading="lazy" decoding="async" />
    </a>
    <a class="footer-socials__link" href="https://t.me/+380679649515" target="_blank" rel="noopener noreferrer" aria-label="Telegram">
      <img src="/icons/social/telegram.png" alt="" loading="lazy" decoding="async" />
    </a>
    <a class="footer-socials__link" href="viber://chat?number=%2B380679649515" aria-label="Viber">
      <img src="/icons/social/viber.png" alt="" loading="lazy" decoding="async" />
    </a>
  `;

  const copyright = targetCol.querySelector('.small');
  if (copyright) {
    targetCol.insertBefore(socialWrap, copyright);
  } else {
    targetCol.appendChild(socialWrap);
  }
}

function syncFooterBrandWithHeader() {
  const footerBrandNames = document.querySelectorAll('.site-footer .brand .brand__name');
  if (!footerBrandNames.length) return;

  footerBrandNames.forEach((el) => {
    el.innerHTML = 'Адвокат<span class="brand__city">Клименко Ірина</span>';
  });
}

function syncFooterLeadText() {
  const footerLead = document.querySelector('.site-footer .footer-grid > div:first-child .muted');
  if (!footerLead) return;

  footerLead.textContent =
    'Клименко Ірина Федорівна — адвокат у Ладижині. Цивільні справи, консультації, підготовка документів і судовий супровід.';
}

window.addEventListener('DOMContentLoaded', () => {
  initSeoHelpers();
  initMobileMenu();
  initForms();
  initReveals();
  initScrollCallCta();
  syncFooterBrandWithHeader();
  syncFooterLeadText();
  initFooterSocials();
});
