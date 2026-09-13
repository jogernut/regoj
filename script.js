/* ============================================================
   REGOJ.COM - Script
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

  /* ── Contact Form AJAX Handling ── */
  const contactForm = $('#contact-form');
  const submitBtn = $('#form-submit-btn');
  const statusEl = $('#form-status');
  const resetBtn = $('#contact-reset-btn');
  const resetHint = $('#form-reset-hint');

  function submitContact(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!contactForm || !submitBtn) return false;

    // Clear any prior status
    if (statusEl) {
      statusEl.hidden = true;
      statusEl.className = 'form-status';
      statusEl.innerHTML = '';
      statusEl.style.display = 'none';
    }

    // Enter loading state
    submitBtn.classList.add('is-loading');
    submitBtn.disabled = true;
    const btnText = $('.form-submit__text', submitBtn);
    if (btnText) btnText.textContent = 'Sending message...';

    const formData = new FormData(contactForm);
    if (!formData.get('form-name')) {
      formData.append('form-name', 'contact');
    }
    const bodyParams = new URLSearchParams(formData).toString();

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: bodyParams,
    })
      .then((response) => {
        if (response.ok || response.status === 200 || response.status === 204 || response.status === 303) {
          // Success: keep form view intact, activate in-form success state
          contactForm.classList.add('is-submitted');

          // Lock inputs
          $$('input:not([type="hidden"]), textarea', contactForm).forEach((el) => {
            el.disabled = true;
          });

          // Update submit button to success state
          submitBtn.classList.remove('is-loading');
          submitBtn.classList.add('is-success');
          submitBtn.disabled = true;
          if (btnText) btnText.textContent = 'Message Sent';

          // Show in-form confirmation banner
          if (statusEl) {
            statusEl.className = 'form-status is-success';
            statusEl.innerHTML = `
              <div class="form-status__icon" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <div class="form-status__content">
                <strong>Message received!</strong>
                <span>Thank you for reaching out. A member of our technical consulting team will review your project details and get back to you within 24 hours.</span>
              </div>
            `;
            statusEl.hidden = false;
            statusEl.style.display = 'flex';
          }

          // Show reset link
          if (resetHint) {
            resetHint.hidden = false;
            resetHint.style.display = 'block';
          }
        } else {
          throw new Error('Form submission status: ' + response.status);
        }
      })
      .catch((err) => {
        console.error('Contact form submission error:', err);
        submitBtn.classList.remove('is-loading');
        submitBtn.disabled = false;
        if (btnText) btnText.textContent = 'Send Message';

        if (statusEl) {
          statusEl.className = 'form-status is-error';
          statusEl.textContent = 'Unable to send message right now. Please try again or email us directly at hello@regoj.com.';
          statusEl.hidden = false;
          statusEl.style.display = 'block';
        }
      });

    return false;
  }

  // Expose globally for onsubmit attribute fallback
  window.handleContactSubmit = submitContact;

  if (contactForm) {
    contactForm.addEventListener('submit', submitContact);
  }

  if (resetBtn && contactForm) {
    resetBtn.addEventListener('click', function () {
      contactForm.classList.remove('is-submitted');

      // Re-enable and clear inputs
      $$('input:not([type="hidden"]), textarea', contactForm).forEach((el) => {
        el.disabled = false;
        el.value = '';
      });

      // Restore submit button
      submitBtn.classList.remove('is-success', 'is-loading');
      submitBtn.disabled = false;
      const btnText = $('.form-submit__text', submitBtn);
      if (btnText) btnText.textContent = 'Send Message';

      // Hide status and hint
      if (statusEl) {
        statusEl.hidden = true;
        statusEl.style.display = 'none';
        statusEl.innerHTML = '';
      }
      if (resetHint) {
        resetHint.hidden = true;
        resetHint.style.display = 'none';
      }

      $('#name', contactForm)?.focus();
    });
  }
})();

