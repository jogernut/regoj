/* ============================================================
   REGOJ.COM — Script
   ============================================================ */

(function () {
  'use strict';

  /* ── Helpers ── */
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => [...(ctx || document).querySelectorAll(sel)];

  /* ── Copyright year ── */
  const yearEl = $('[data-year]');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ── Header scroll effect ── */
  const header = $('#header');
  let lastScroll = 0;

  function onScroll() {
    if (!header) return;
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 20);
    lastScroll = y;
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── Mobile menu ── */
  const toggle = $('#nav-toggle');
  const overlay = $('#mobile-overlay');

  function openMenu() {
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  if (toggle && overlay) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      open ? closeMenu() : openMenu();
    });

    $$('a', overlay).forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
        closeMenu();
        toggle.focus();
      }
    });
  }

  /* ── Reveal animations (Intersection Observer) ── */
  const reveals = $$('.reveal');

  if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    // Fallback: show everything immediately
    reveals.forEach((el) => el.classList.add('is-visible'));
  }

  /* ── Hero particles ── */
  const particleContainer = $('#particles');

  if (particleContainer && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const count = 18;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      p.className = 'particle';
      const size = (Math.random() * 4 + 1.5).toFixed(1);
      p.style.cssText = [
        `width:${size}px`,
        `height:${size}px`,
        `left:${(Math.random() * 100).toFixed(1)}%`,
        `top:${(Math.random() * 100).toFixed(1)}%`,
        `animation-duration:${(Math.random() * 18 + 12).toFixed(1)}s`,
        `animation-delay:${(Math.random() * 12).toFixed(1)}s`,
      ].join(';');
      particleContainer.appendChild(p);
    }
  }

  /* ── Smooth scroll for anchor links ── */
  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const target = $(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });
})();
