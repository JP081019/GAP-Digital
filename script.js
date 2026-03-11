/**
 * GAP Digital – script.js
 * Funcionalidades:
 *  1. Header com fundo ao rolar
 *  2. Menu hambúrguer – painel lateral deslizante com overlay
 *  3. Scroll suave nos links de nav
 *  4. Animação de elementos ao entrar no viewport (IntersectionObserver)
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     1. HEADER – adiciona classe "scrolled" ao rolar
     ============================================================ */
  const header = document.getElementById('header');

  function handleHeaderScroll() {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();


  /* ============================================================
     2. MENU HAMBÚRGUER – painel lateral deslizante
     ============================================================ */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  // Cria o overlay de fundo dinamicamente
  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  document.body.appendChild(overlay);

  function toggleMenu(open) {
    hamburger.classList.toggle('active', open);
    navLinks.classList.toggle('open', open);
    overlay.classList.toggle('visible', open);
    hamburger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  }

  // Abre/fecha ao clicar no hambúrguer
  hamburger.addEventListener('click', () => {
    toggleMenu(!navLinks.classList.contains('open'));
  });

  // Clique no overlay escuro fecha o painel
  overlay.addEventListener('click', () => toggleMenu(false));

  // Fecha ao clicar em qualquer link
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // Fecha ao pressionar ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      toggleMenu(false);
      hamburger.focus();
    }
  });

  // Fecha ao redimensionar para desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) toggleMenu(false);
  });


  /* ============================================================
     3. SCROLL SUAVE – links do menu e botões CTA
     ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const targetTop = target.getBoundingClientRect().top + window.scrollY - header.offsetHeight - 8;
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });


  /* ============================================================
     4. SCROLL REVEAL – IntersectionObserver
     ============================================================ */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


  /* ============================================================
     5. LINK ATIVO no menu conforme seção visível
     ============================================================ */
  const navItems = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navItems.forEach(link => {
            const isActive = link.getAttribute('href') === `#${id}`;
            link.style.color      = isActive ? 'var(--white)' : '';
            link.style.fontWeight = isActive ? '600' : '';
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  document.querySelectorAll('section[id]').forEach(sec => sectionObserver.observe(sec));

});