/* ============================================================
   Portfolio Script — Eslam Abdelnaby
   ============================================================ */

/* ---------- Navbar scroll effect ---------- */
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  const scrollProgress = document.getElementById('scrollProgress');
  const scrollY = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollY / maxScroll) * 100;

  if (navbar) {
    navbar.classList.toggle('scrolled', scrollY > 50);
  }
  if (scrollProgress) {
    scrollProgress.style.width = scrollPercent + '%';
  }
});

/* ---------- Active nav link on scroll ---------- */
const sections = document.querySelectorAll('section[id], form[id]');
const navLinks = document.querySelectorAll('.nav-link');

const activateNavLink = () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.remove('active-nav');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active-nav');
    }
  });
};
window.addEventListener('scroll', activateNavLink);

/* ---------- Typewriter effect ---------- */
const roles = [
  'Front-End Developer',
  'React.js Specialist',
  'Next.js Developer',
  'UI/UX Enthusiast',
  'TypeScript Developer',
];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typewriterEl = document.getElementById('typewriter');

function typeWriter() {
  if (!typewriterEl) return;
  const currentRole = roles[roleIndex];

  if (isDeleting) {
    typewriterEl.textContent = currentRole.substring(0, charIndex--);
  } else {
    typewriterEl.textContent = currentRole.substring(0, charIndex++);
  }

  let delay = isDeleting ? 60 : 100;

  if (!isDeleting && charIndex > currentRole.length) {
    delay = 1800;
    isDeleting = true;
  } else if (isDeleting && charIndex < 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    delay = 400;
  }

  setTimeout(typeWriter, delay);
}

document.addEventListener('DOMContentLoaded', () => {
  typeWriter();
  initAnimations();
  initSkillBars();
  initParticles();
  initCounters();
  initTestimonialsSlider();
  initMobileMenu();
});

/* ---------- Intersection Observer for scroll animations ---------- */
function initAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll(
    '.reveal, .skill-card, .project-card, .timeline-item, .service-card, .stat-card, .testimonial-slide, .section-header'
  ).forEach(el => {
    el.classList.add('reveal-hidden');
    observer.observe(el);
  });
}

/* ---------- Skill cards & progress bars (trigger on visibility) ---------- */
function initSkillBars() {
  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Trigger card animations
          entry.target.querySelectorAll('.skill-card').forEach((card, i) => {
            setTimeout(() => {
              card.style.animationPlayState = 'running';
              card.querySelector('.skill-progress-bar').style.animationPlayState = 'running';
            }, i * 80);
          });
          skillObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  const skillsSection = document.querySelector('.skills-section');
  if (skillsSection) skillObserver.observe(skillsSection);
}

/* ---------- Animated counters ---------- */
function initCounters() {
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('[data-count]').forEach(el => {
            const target = parseInt(el.getAttribute('data-count'));
            const suffix = el.getAttribute('data-suffix') || '';
            let current = 0;
            const step = Math.ceil(target / 60);
            const timer = setInterval(() => {
              current = Math.min(current + step, target);
              el.textContent = current + suffix;
              if (current >= target) clearInterval(timer);
            }, 25);
          });
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll('.stats-section, .about-stats').forEach(el => {
    counterObserver.observe(el);
  });
}

/* ---------- Particle background (hero) ---------- */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  const particles = Array.from({ length: 70 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5,
    r: Math.random() * 2 + 0.5,
    alpha: Math.random() * 0.5 + 0.1,
  }));

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,245,255,${p.alpha})`;
      ctx.fill();
    });

    // Connect nearby particles
    particles.forEach((p1, i) => {
      particles.slice(i + 1).forEach(p2 => {
        const d = Math.hypot(p1.x - p2.x, p1.y - p2.y);
        if (d < 120) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(0,245,255,${0.08 * (1 - d / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });
    });

    requestAnimationFrame(drawParticles);
  }
  drawParticles();
}

/* ---------- Testimonials slider ---------- */
function initTestimonialsSlider() {
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.t-dot');
  if (!slides.length) return;
  let current = 0;

  function showSlide(index) {
    slides.forEach((s, i) => {
      s.classList.toggle('active', i === index);
    });
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === index);
    });
    current = index;
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => showSlide(i));
  });

  document.getElementById('t-prev')?.addEventListener('click', () => {
    showSlide((current - 1 + slides.length) % slides.length);
  });
  document.getElementById('t-next')?.addEventListener('click', () => {
    showSlide((current + 1) % slides.length);
  });

  showSlide(0);
  setInterval(() => showSlide((current + 1) % slides.length), 5000);
}

/* ---------- Mobile menu auto-close ---------- */
function initMobileMenu() {
  const navLinks = document.querySelectorAll('.nav-link');
  const navCollapse = document.getElementById('navMenu');

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 992 && navCollapse?.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
        bsCollapse?.hide();
      }
    });
  });
}

/* ---------- Smooth cursor glow (desktop only) ---------- */
if (window.innerWidth > 768) {
  const cursor = document.createElement('div');
  cursor.id = 'cursor-glow';
  document.body.appendChild(cursor);

  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });
}

/* ---------- EmailJS form ---------- */
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  emailjs.init({ publicKey: 'psOy-rttq8bzPh_z8' });

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Sending...';

    emailjs.sendForm('service_vvpomwr', 'template_609hrxb', contactForm)
      .then(() => {
        showNotification('✅ Message sent successfully!', 'success');
        contactForm.reset();
      })
      .catch(() => {
        showNotification('❌ Failed to send. Please try again.', 'error');
      })
      .finally(() => {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      });
  });
}

function showNotification(message, type) {
  const note = document.createElement('div');
  note.className = `toast-notification toast-${type}`;
  note.textContent = message;
  document.body.appendChild(note);
  setTimeout(() => note.classList.add('show'), 10);
  setTimeout(() => {
    note.classList.remove('show');
    setTimeout(() => note.remove(), 400);
  }, 3500);
}
