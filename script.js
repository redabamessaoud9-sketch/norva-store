document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Année dans le pied de page ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Menu mobile ---------- */
  const menuToggle = document.getElementById('menu-toggle');
  const mainNav = document.getElementById('main-nav');

  const closeMenu = () => {
    menuToggle.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    mainNav.classList.remove('open');
  };

  menuToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    menuToggle.classList.toggle('open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  /* ---------- Mise en avant du lien actif ---------- */
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = Array.from(navLinks).map(link => document.querySelector(link.getAttribute('href')));

  const setActiveLink = () => {
    let currentIndex = 0;
    const scrollPos = window.scrollY + 140;
    sections.forEach((section, i) => {
      if (section && section.offsetTop <= scrollPos) currentIndex = i;
    });
    navLinks.forEach(link => link.classList.remove('active'));
    if (navLinks[currentIndex]) navLinks[currentIndex].classList.add('active');
  };
  window.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink();

  /* ---------- Overlay commun (recherche / panier) ---------- */
  const backdrop = document.getElementById('overlay-backdrop');

  /* ---------- Recherche ---------- */
  const searchToggle = document.getElementById('search-toggle');
  const searchOverlay = document.getElementById('search-overlay');
  const searchClose = document.getElementById('search-close');
  const searchInput = document.getElementById('search-input');
  const searchHint = document.getElementById('search-hint');

  const openSearch = () => {
    searchOverlay.classList.add('is-open');
    searchToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    setTimeout(() => searchInput.focus(), 300);
  };
  const closeSearch = () => {
    searchOverlay.classList.remove('is-open');
    searchToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    searchInput.value = '';
    searchHint.textContent = 'Commencez à taper pour lancer une recherche.';
  };

  searchToggle.addEventListener('click', openSearch);
  searchClose.addEventListener('click', closeSearch);
  searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim();
    searchHint.textContent = q
      ? `Aucun résultat pour « ${q} » — le catalogue NORVA n'est pas encore renseigné.`
      : 'Commencez à taper pour lancer une recherche.';
  });

  /* ---------- Panier ---------- */
  const cartToggle = document.getElementById('cart-toggle');
  const cartPanel = document.getElementById('cart-panel');
  const cartClose = document.getElementById('cart-close');

  const openCart = () => {
    cartPanel.classList.add('is-open');
    cartPanel.setAttribute('aria-hidden', 'false');
    backdrop.classList.add('is-open');
    cartToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };
  const closeCart = () => {
    cartPanel.classList.remove('is-open');
    cartPanel.setAttribute('aria-hidden', 'true');
    backdrop.classList.remove('is-open');
    cartToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  cartToggle.addEventListener('click', openCart);
  cartClose.addEventListener('click', closeCart);
  backdrop.addEventListener('click', () => {
    closeCart();
    closeSearch();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCart();
      closeSearch();
      closeMenu();
    }
  });

  /* ---------- Formulaire de contact ---------- */
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    formFeedback.textContent = 'Merci, votre message a bien été enregistré.';
    contactForm.reset();
  });

});
