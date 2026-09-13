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
  const cartCount = document.getElementById('cart-count');
  const cartBody = document.getElementById('cart-panel-body');
  const checkoutBtn = document.querySelector('.cart-panel-footer .btn');

  let cart = [];

  const formatPrice = (n) => `${n} DH`;

  const renderCart = () => {
    if (cart.length === 0) {
      cartBody.innerHTML = '<p class="cart-empty">Votre panier est vide pour le moment.</p>';
      checkoutBtn.disabled = true;
      cartCount.textContent = '0';
      return;
    }

    cartBody.innerHTML = '';
    let total = 0;
    let totalQty = 0;

    cart.forEach((item, index) => {
      total += item.price * item.qty;
      totalQty += item.qty;

      const row = document.createElement('div');
      row.className = 'cart-item';
      row.innerHTML = `
        <div class="cart-item-info">
          <p class="cart-item-name">${item.name}</p>
          <p class="cart-item-price">${formatPrice(item.price)}</p>
        </div>
        <div class="cart-item-qty">
          <button type="button" class="qty-btn" data-action="decrease" data-index="${index}" aria-label="Diminuer la quantité">−</button>
          <span>${item.qty}</span>
          <button type="button" class="qty-btn" data-action="increase" data-index="${index}" aria-label="Augmenter la quantité">+</button>
        </div>
        <button type="button" class="cart-item-remove" data-index="${index}" aria-label="Retirer l'article">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6"><line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/></svg>
        </button>
      `;
      cartBody.appendChild(row);
    });

    const totalRow = document.createElement('div');
    totalRow.className = 'cart-total-row';
    totalRow.innerHTML = `<span>Total</span><span>${formatPrice(total)}</span>`;
    cartBody.appendChild(totalRow);

    checkoutBtn.disabled = false;
    cartCount.textContent = String(totalQty);
  };

  cartBody.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const index = Number(btn.dataset.index);
    if (Number.isNaN(index)) return;

    if (btn.classList.contains('cart-item-remove')) {
      cart.splice(index, 1);
    } else if (btn.dataset.action === 'increase') {
      cart[index].qty += 1;
    } else if (btn.dataset.action === 'decrease') {
      cart[index].qty -= 1;
      if (cart[index].qty <= 0) cart.splice(index, 1);
    }
    renderCart();
  });

  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('[data-name]');
      const name = card.dataset.name;
      const price = Number(card.dataset.price);

      const existing = cart.find(item => item.name === name);
      if (existing) {
        existing.qty += 1;
      } else {
        cart.push({ name, price, qty: 1 });
      }
      renderCart();

      btn.textContent = 'Ajouté ✓';
      btn.classList.add('is-added');
      setTimeout(() => {
        btn.textContent = 'Ajouter au panier';
        btn.classList.remove('is-added');
      }, 1400);

      openCart();
    });
  });

  renderCart();

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
