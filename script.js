/**
 * GAP Digital – script.js
 * Funcionalidades:
 *  1. Header com fundo ao rolar
 *  2. Menu hambúrguer responsivo
 *  3. Scroll suave nos links de nav
 *  4. Animação de elementos ao entrar no viewport (IntersectionObserver)
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     1. HEADER – adiciona classe "scrolled" ao rolar
     ============================================================ */
  const header = document.getElementById('header');

  function handleHeaderScroll() {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll(); // estado inicial


  /* ============================================================
     2. MENU HAMBÚRGUER
     ============================================================ */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  function toggleMenu(open) {
    hamburger.classList.toggle('active', open);
    navLinks.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    // Bloqueia scroll do body quando menu está aberto
    document.body.style.overflow = open ? 'hidden' : '';
  }

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.contains('open');
    toggleMenu(!isOpen);
  });

  // Fecha menu ao clicar em qualquer link
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // Fecha menu ao pressionar ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      toggleMenu(false);
      hamburger.focus();
    }
  });

  // Fecha menu ao redimensionar para tela grande
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      toggleMenu(false);
    }
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

      const headerHeight = header.offsetHeight;
      const targetTop    = target.getBoundingClientRect().top + window.scrollY - headerHeight - 8;

      window.scrollTo({
        top:      targetTop,
        behavior: 'smooth'
      });
    });
  });


  /* ============================================================
     4. SCROLL REVEAL – IntersectionObserver
        Adiciona classe "visible" aos elementos com classe "reveal"
        quando entram no viewport.
     ============================================================ */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Para de observar após a animação (evita replay)
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,   // 12% do elemento visível dispara
      rootMargin: '0px 0px -40px 0px'
    }
  );

  // Aplica o observer a todos os elementos marcados
  document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
  });


  /* ============================================================
     5. HIGHLIGHT DE SEÇÃO ATIVA no menu de navegação
        Marca o link correspondente à seção visível.
     ============================================================ */
  const sections = document.querySelectorAll('main section[id], header ~ main section[id]');
  const navItems = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navItems.forEach(link => {
            const isActive = link.getAttribute('href') === `#${id}`;
            link.style.color    = isActive ? 'var(--white)' : '';
            link.style.fontWeight = isActive ? '600' : '';
          });
        }
      });
    },
    {
      threshold: 0.4
    }
  );

  document.querySelectorAll('section[id]').forEach(sec => {
    sectionObserver.observe(sec);
  });

});