const header = document.querySelector('.site-header');
const toggle = document.querySelector('[data-menu-toggle]');
const nav = document.querySelector('#site-nav');

const closeMenu = () => {
  if (!header || !toggle) return;
  header.classList.remove('menu-open');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Abrir menu');
};

toggle?.addEventListener('click', () => {
  const expanded = toggle.getAttribute('aria-expanded') === 'true';
  header?.classList.toggle('menu-open', !expanded);
  toggle.setAttribute('aria-expanded', String(!expanded));
  toggle.setAttribute('aria-label', expanded ? 'Abrir menu' : 'Fechar menu');
});

nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

document.querySelectorAll('[data-analytics-event]').forEach((link) => {
  link.addEventListener('click', () => {
    if (typeof window.gtag !== 'function') return;

    const params = {};
    if (link.dataset.analyticsMethod) params.method = link.dataset.analyticsMethod;
    if (link.dataset.analyticsNetwork) params.network = link.dataset.analyticsNetwork;
    if (link.dataset.analyticsPlacement) params.placement = link.dataset.analyticsPlacement;
    window.gtag('event', link.dataset.analyticsEvent, params);
  });
});

window.addEventListener('scroll', () => {
  header?.classList.toggle('is-scrolled', window.scrollY > 12);
}, { passive: true });

const revealItems = document.querySelectorAll('[data-reveal]');

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}
