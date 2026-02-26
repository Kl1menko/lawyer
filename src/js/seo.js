const SITE_NAME = 'Адвокат у Ладижині';

function markActiveNav() {
  const pathname = window.location.pathname;
  const path = pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-list a[data-nav]').forEach((link) => {
    const target = link.dataset.nav;
    const isServicePage = pathname.includes('/poslugy/');
    const isMatch =
      target === path || (path === '' && target === 'index.html') || (isServicePage && target === 'poslugy.html');
    if (isMatch) {
      link.setAttribute('aria-current', 'page');
    }
  });
}

function setYear() {
  const year = String(new Date().getFullYear());
  document.querySelectorAll('[data-current-year]').forEach((node) => {
    node.textContent = year;
  });
}

function setMetaSiteName() {
  document.querySelectorAll('meta[property="og:site_name"]').forEach((meta) => {
    if (!meta.content) meta.content = SITE_NAME;
  });
}

export function initSeoHelpers() {
  markActiveNav();
  setYear();
  setMetaSiteName();
}
