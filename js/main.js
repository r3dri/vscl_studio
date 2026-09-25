document.addEventListener('DOMContentLoaded', () => {


  const nav = document.getElementById('nav');
  let lastScroll = 0;

  const handleNavScroll = () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
    initPackagesCarousel();
  };

  window.addEventListener('scroll', handleNavScroll, { passive: true });


const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
let savedScrollY = 0;

const openMenu = () => {
  savedScrollY = window.pageYOffset;
  document.body.classList.add('menu-open');
  document.body.style.top = `-${savedScrollY}px`;

  hamburger.classList.add('active');
  mobileMenu.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
};

const closeMenu = () => {
  hamburger.classList.remove('active');
  mobileMenu.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');

  document.body.classList.remove('menu-open');
  document.body.style.top = '';
  window.scrollTo(0, savedScrollY);
};

const toggleMobileMenu = () => {
  if (mobileMenu.classList.contains('open')) {
    closeMenu();
  } else {
    openMenu();
  }
};

hamburger.addEventListener('click', toggleMobileMenu);

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (mobileMenu.classList.contains('open')) {
        toggleMobileMenu();
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      closeMenu();
    }
  });


  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        const navHeight = nav.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });


  const revealElements = document.querySelectorAll('.reveal, .reveal-scale, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));


  const counters = document.querySelectorAll('[data-count]');
  let countersAnimated = false;

  const animateCounters = () => {
    if (countersAnimated) return;
    countersAnimated = true;

    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-count'));
      const duration = 2000;
      const startTime = performance.now();

      const easeOutQuart = t => 1 - Math.pow(1 - t, 4);

      const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutQuart(progress);
        const current = Math.round(easedProgress * target);

        counter.textContent = current + '+';

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        }
      };

      requestAnimationFrame(updateCounter);
    });
  };

  const heroStatsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        heroStatsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) heroStatsObserver.observe(heroStats);


  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    const inner = item.querySelector('.faq-answer-inner');

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        otherItem.querySelector('.faq-answer').style.maxHeight = '0';
      });

      if (!isActive) {
        item.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = inner.scrollHeight + 24 + 'px';
      }
    });
  });

  const particlesContainer = document.getElementById('particles');
  if (particlesContainer) {
    const particleCount = 20;
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 8 + 's';
      particle.style.animationDuration = (6 + Math.random() * 6) + 's';
      particle.style.width = (2 + Math.random() * 4) + 'px';
      particle.style.height = particle.style.width;
      particle.style.opacity = 0;
      particlesContainer.appendChild(particle);
    }
  }

  function initPackagesCarousel() {
  const root = document.getElementById('packagesCarousel');
  if (!root) return;

  const track = root.querySelector('.carousel-track');
  const prevBtn = root.querySelector('.carousel-btn.prev');
  const nextBtn = root.querySelector('.carousel-btn.next');
  const dotsBox = root.querySelector('.carousel-dots');
  if (!track || !track.children.length) return;

  const cards = Array.from(track.children);
  let dots = [];

  const step = () => {
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    return cards[0].getBoundingClientRect().width + gap;
  };
  // Сколько карточек видно на экране одновременно
  const visibleCount = () => Math.max(1, Math.round(track.clientWidth / step()));
  // Сколько всего позиций прокрутки существует
  const positionsCount = () => Math.max(1, cards.length - visibleCount() + 1);

  // Точки строятся по количеству ПОЗИЦИЙ, а не карточек;
  // innerHTML = '' защищает от дублирования при повторном вызове
  const buildDots = () => {
    if (!dotsBox) return;
    dotsBox.innerHTML = '';
    dots = [];
    for (let i = 0; i < positionsCount(); i++) {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot';
      dot.type = 'button';
      dot.setAttribute('aria-label', 'Позиция ' + (i + 1));
      dot.addEventListener('click', () => track.scrollTo({ left: i * step(), behavior: 'smooth' }));
      dotsBox.appendChild(dot);
      dots.push(dot);
    }
  };

  const currentIndex = () => Math.min(Math.round(track.scrollLeft / step()), positionsCount() - 1);

  const update = () => {
    const i = currentIndex();
    dots.forEach((d, k) => d.classList.toggle('active', k === i));
    if (prevBtn) prevBtn.disabled = track.scrollLeft <= 4;
    if (nextBtn) nextBtn.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 4;
  };

  if (prevBtn) prevBtn.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
  if (nextBtn) nextBtn.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
  track.addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });

  // Пересчёт точек при изменении ширины экрана (дебонс)
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { buildDots(); update(); }, 150);
  });

  buildDots();
  update();
}

});