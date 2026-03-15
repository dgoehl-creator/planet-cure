/**
 * PlanetCure.com — main.js
 * Minimal vanilla JS: mobile nav, TOC sidebar, smooth scroll, email form UX
 */

(function () {
  'use strict';

  /* ---- Mobile nav toggle ---- */
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      navToggle.classList.toggle('open', open);
      navToggle.setAttribute('aria-expanded', open);
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', false);
      }
    });

    // Close nav when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
      });
    });
  }

  /* ---- Mobile TOC toggle ---- */
  const tocToggle = document.querySelector('.toc-mobile-toggle');
  const tocBox = document.querySelector('.toc-box');

  if (tocToggle && tocBox) {
    tocToggle.addEventListener('click', () => {
      const open = tocBox.classList.toggle('open');
      tocToggle.classList.toggle('open', open);
      tocToggle.textContent = open ? 'Contents ▲' : 'Contents ▼';
    });
  }

  /* ---- Active TOC highlight on scroll ---- */
  const tocLinks = document.querySelectorAll('.toc-list a');
  const headings = [];

  tocLinks.forEach(link => {
    const id = link.getAttribute('href').replace('#', '');
    const el = document.getElementById(id);
    if (el) headings.push({ el, link });
  });

  function updateActiveToc() {
    if (!headings.length) return;
    let current = headings[0];
    headings.forEach(h => {
      if (window.scrollY >= h.el.offsetTop - 110) {
        current = h;
      }
    });
    tocLinks.forEach(l => l.classList.remove('active'));
    if (current) current.link.classList.add('active');
  }

  if (headings.length) {
    window.addEventListener('scroll', updateActiveToc, { passive: true });
    updateActiveToc();
  }

  /* ---- Email form UX ---- */
  document.querySelectorAll('.email-form').forEach(form => {
    form.addEventListener('submit', function (e) {
      const emailInput = form.querySelector('input[type="email"]');
      const btn = form.querySelector('button[type="submit"]');
      if (!emailInput || !emailInput.value.trim()) {
        e.preventDefault();
        emailInput.focus();
        emailInput.style.borderColor = '#cc4444';
        setTimeout(() => { emailInput.style.borderColor = ''; }, 2000);
        return;
      }
      if (btn) {
        btn.textContent = 'Subscribing…';
        btn.disabled = true;
      }
      // Real form will POST to ConvertKit; if action is placeholder, just show confirmation
      if (form.action.includes('XXXXXXXX')) {
        e.preventDefault();
        form.innerHTML = '<p style="color:#1a5c6b;font-weight:600;text-align:center;">✓ You\'re on the list. We\'ll send updates as new research emerges.</p>';
      }
    });
  });

  /* ---- Smooth scroll for anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Close mobile TOC if open
        if (tocBox) {
          tocBox.classList.remove('open');
          if (tocToggle) {
            tocToggle.classList.remove('open');
            tocToggle.textContent = 'Contents ▼';
          }
        }
      }
    });
  });

  /* ---- External links: open in new tab ---- */
  document.querySelectorAll('a[href^="http"]').forEach(link => {
    if (!link.hostname || link.hostname !== window.location.hostname) {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    }
  });

})();
