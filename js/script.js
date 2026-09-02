// Initialize Lucide icons
if (window.lucide) {
  lucide.createIcons();
}

// ── Mobile Navigation Toggle ──
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const spans = hamburger.querySelectorAll('span');
    if (spans.length === 3) {
      spans[0].style.transform = navLinks.classList.contains('active') ? 'rotate(45deg) translate(5px,5px)' : '';
      spans[1].style.opacity   = navLinks.classList.contains('active') ? '0' : '1';
      spans[2].style.transform = navLinks.classList.contains('active') ? 'rotate(-45deg) translate(5px,-5px)' : '';
    }
  });
}

// ── Smooth Scroll for internal navigation links ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (!targetId || targetId === '#') return;
    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();

    // Close mobile menu if active
    if (navLinks && navLinks.classList.contains('active')) {
      navLinks.classList.remove('active');
      if (hamburger) {
        hamburger.querySelectorAll('span').forEach(s => {
          s.style.transform = '';
          s.style.opacity = '1';
        });
      }
    }

    // Scroll with navbar height offset (64px)
    const navbarHeight = 64;
    const top = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ── Active nav link highlight & navbar glass darkener ──
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');
const navbar = document.querySelector('.navbar');

function highlightNav() {
  const scrollY = window.pageYOffset + 120;

  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');

    if (scrollY >= top && scrollY < top + height) {
      navAnchors.forEach(a => {
        a.classList.remove('active-link');
        if (a.getAttribute('href') === '#' + id) {
          a.classList.add('active-link');
        }
      });
    }
  });

  if (navbar) {
    if (window.pageYOffset > 80) {
      navbar.style.background = 'rgba(10, 10, 26, 0.88)';
    } else {
      navbar.style.background = 'rgba(10, 10, 26, 0.55)';
    }
  }
}

window.addEventListener('scroll', highlightNav, { passive: true });
highlightNav();

// ── Scroll Reveal (IntersectionObserver) ──
const revealElements = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach(el => observer.observe(el));
} else {
  // Fallback for older browsers
  revealElements.forEach(el => el.classList.add('visible'));
}

// ── Certificate Lightbox / Modal ──
const certModal = document.getElementById('certModal');
const certModalImg = document.getElementById('certModalImg');
const certModalTitle = document.getElementById('certModalTitle');
const certModalClose = document.getElementById('certModalClose');

function openCertModal(imageSrc, titleText) {
  if (!certModal) return;
  certModalImg.src = imageSrc;
  certModalImg.alt = titleText;
  certModalTitle.textContent = titleText;
  certModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCertModal() {
  if (!certModal) return;
  certModal.classList.remove('active');
  document.body.style.overflow = '';
}

document.querySelectorAll('.cert-item').forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    const title = item.getAttribute('data-title') || (img ? img.alt : 'Certificate');
    const src = img ? img.src : '';
    if (src) {
      openCertModal(src, title);
    }
  });
});

if (certModalClose) {
  certModalClose.addEventListener('click', closeCertModal);
}

if (certModal) {
  certModal.addEventListener('click', (e) => {
    if (e.target === certModal) {
      closeCertModal();
    }
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && certModal && certModal.classList.contains('active')) {
    closeCertModal();
  }
});

// ── Contact Form Handling ──
function handleSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button[type="submit"]');
  const feedback = document.getElementById('formFeedback');
  const errorMsg = document.getElementById('formError');

  // Recipient email from form action or dataset
  const recipientEmail = form.getAttribute('data-email') || 'your.email@example.com';

  if (feedback) feedback.style.display = 'none';
  if (errorMsg) errorMsg.style.display = 'none';

  // Spinner state
  const originalBtnText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<i data-lucide="loader-2" style="width:18px;height:18px;animation:spin 1s linear infinite;display:inline-block;"></i> Sending…';
  if (window.lucide) lucide.createIcons();

  const formData = new FormData(form);

  // Send request via FormSubmit
  fetch(`https://formsubmit.co/ajax/${encodeURIComponent(recipientEmail)}`, {
    method: 'POST',
    body: formData
  })
  .then(res => {
    if (!res.ok) throw new Error('Submission failed');
    return res.json();
  })
  .then(data => {
    form.reset();
    if (feedback) {
      feedback.style.display = 'block';
      setTimeout(() => { feedback.style.display = 'none'; }, 6000);
    }
  })
  .catch(err => {
    console.error('Contact Form Error:', err);
    if (errorMsg) {
      errorMsg.style.display = 'block';
      setTimeout(() => { errorMsg.style.display = 'none'; }, 6000);
    }
  })
  .finally(() => {
    btn.disabled = false;
    btn.innerHTML = originalBtnText;
    if (window.lucide) lucide.createIcons();
  });
}

window.handleSubmit = handleSubmit;

// Inject CSS spin animation for loader
const spinStyle = document.createElement('style');
spinStyle.textContent = '@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}';
document.head.appendChild(spinStyle);
