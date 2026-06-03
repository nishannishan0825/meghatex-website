/* ============================================================
   MEGHA TEX – Main JavaScript
   Handles: Navbar, Mobile Menu, Floating Contact, Animations, Particles
   ============================================================ */

'use strict';

// ── Navbar scroll effect ──────────────────────────────────────
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

// ── Mobile hamburger menu ─────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });
  // Close on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

// ── Floating Contact Button ───────────────────────────────────
const floatBtn  = document.getElementById('floatBtn');
const floatMenu = document.getElementById('floatMenu');
if (floatBtn && floatMenu) {
  floatBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = floatMenu.classList.toggle('open');
    floatBtn.classList.toggle('active', isOpen);
    floatBtn.setAttribute('aria-expanded', isOpen);
  });
  document.addEventListener('click', (e) => {
    if (!floatBtn.contains(e.target) && !floatMenu.contains(e.target)) {
      floatMenu.classList.remove('open');
      floatBtn.classList.remove('active');
    }
  });
  // Close menu when a contact option is clicked
  floatMenu.querySelectorAll('.float-menu-item').forEach(item => {
    item.addEventListener('click', () => {
      floatMenu.classList.remove('open');
      floatBtn.classList.remove('active');
    });
  });
}

// ── Intersection Observer Animations ─────────────────────────
const animatedEls = document.querySelectorAll('[data-animate]');
if (animatedEls.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger delay based on siblings
        const siblings = entry.target.parentElement
          ? [...entry.target.parentElement.querySelectorAll('[data-animate]')]
          : [];
        const idx = siblings.indexOf(entry.target);
        const delay = idx * 100;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  animatedEls.forEach(el => observer.observe(el));
}

// ── Hero Particles ────────────────────────────────────────────
const particlesContainer = document.getElementById('particles');
if (particlesContainer) {
  const count = 18;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 12 + 4;
    const left = Math.random() * 100;
    const duration = Math.random() * 15 + 10;
    const delay = Math.random() * 10;
    p.style.cssText = `
      width:${size}px;height:${size}px;
      left:${left}%;bottom:-${size}px;
      animation-duration:${duration}s;
      animation-delay:${delay}s;
      opacity:${Math.random() * 0.4 + 0.1};
    `;
    particlesContainer.appendChild(p);
  }
}

// ── Active nav link highlighting ──────────────────────────────
function setActiveNavLink() {
  const path = window.location.pathname.toLowerCase();
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    const href = a.getAttribute('href') || '';
    a.classList.remove('active');
    if (
      (href.includes('index.html') && (path.endsWith('index.html') || path.endsWith('/'))) ||
      (href.includes('ourwork.html') && path.includes('ourwork')) ||
      (href.includes('terms.html') && path.includes('terms') && !href.includes('#'))
    ) {
      a.classList.add('active');
    }
  });
}
setActiveNavLink();

// ── Smooth anchor scrolling ───────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ── Gallery hover cursor ──────────────────────────────────────
document.querySelectorAll('.gallery-item').forEach(item => {
  item.setAttribute('role', 'img');
  item.setAttribute('tabindex', '0');
});

// ── Counter animation for stats ───────────────────────────────
function animateCounter(el, target, suffix, duration = 1800) {
  const start = performance.now();
  const update = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(eased * target);
    el.textContent = value + suffix;
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const statValues = entry.target.querySelectorAll('.stat-value');
      statValues.forEach(sv => {
        const text = sv.textContent.trim();
        if (text.includes('500')) {
          const span = sv.querySelector('span');
          const suffix = span ? span.textContent : '';
          sv.innerHTML = `<span style="color:var(--gold)"></span>`;
          animateCounter(sv.firstElementChild, 500, suffix);
        }
        if (text.includes('10')) {
          const span = sv.querySelector('span');
          const suffix = span ? span.textContent : '';
          sv.innerHTML = `10<span style="color:var(--gold)">${suffix}</span>`;
        }
        if (text.includes('99')) {
          const span = sv.querySelector('span');
          const suffix = span ? span.textContent : '';
          sv.innerHTML = `<span></span><span style="color:var(--gold)">${suffix}</span>`;
          animateCounter(sv.firstElementChild, 99, '');
        }
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

// ── Console branding ──────────────────────────────────────────
console.log(
  '%c⚙ Megha Tex %c| Professional Bobbin Holder Servicing',
  'color:#f59e0b;font-weight:900;font-size:1.1rem;',
  'color:#60a5fa;font-size:0.9rem;'
);

// ── Contact Modal ─────────────────────────────────────────────
const contactModalBackdrop = document.getElementById('contactModalBackdrop');

function openContactModal() {
  if (contactModalBackdrop) {
    contactModalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeContactModal() {
  if (contactModalBackdrop) {
    contactModalBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// Open modal on all "Get Service" / "Contact Us" nav buttons
document.querySelectorAll('.nav-cta-modal, #hero-contact-btn-modal').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    openContactModal();
  });
});

// Close on backdrop click
if (contactModalBackdrop) {
  contactModalBackdrop.addEventListener('click', (e) => {
    if (e.target === contactModalBackdrop) closeContactModal();
  });
}

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeContactModal();
});
