// DONNÉES PRODUITS
const products = [
    { id: 1, name: "NORVA Essential T-Shirt", category: "t-shirts", gender: "homme", price: 249, img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80", isNew: false, desc: "Le t-shirt essentiel. Coupe parfaite, coton premium 100% bio. Minimaliste et élégant." },
    { id: 2, name: "NORVA Oversized Hoodie", category: "hoodies", gender: "unisex", price: 499, img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80", isNew: true, desc: "Hoodie coupe oversized, tissu lourd pour un tombé parfait. Le confort absolu avec style." },
    { id: 3, name: "NORVA Street Pants", category: "pantalons", gender: "homme", price: 399, img: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&q=80", isNew: false, desc: "Pantalon cargo revisité. Lignes épurées, multipoches fonctionnelles, style urbain." },
    { id: 4, name: "NORVA Signature Jacket", category: "vestes", gender: "homme", price: 699, img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&q=80", isNew: true, desc: "Veste signature NORVA. Imperméable, légère, avec détails réfléchissants subtils." },
    { id: 5, name: "NORVA Basic Tee Femme", category: "t-shirts", gender: "femme", price: 199, img: "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=500&q=80", isNew: false, desc: "T-shirt ajusté pour femme. Doux, durable et conçu pour le quotidien." },
    { id: 6, name: "NORVA Urban Hoodie", category: "hoodies", gender: "femme", price: 449, img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80", isNew: false, desc: "Hoodie court urbain. Design moderne avec capuche ample." },
    { id: 7, name: "NORVA Wide Leg Pants", category: "pantalons", gender: "femme", price: 349, img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&q=80", isNew: true, desc: "Pantalon large fluide. Élégance minimaliste pour un look streetwear chic." },
    { id: 8, name: "NORVA Puffer Vest", category: "vestes", gender: "unisex", price: 549, img: "https://images.unsplash.com/photo-1574880598687-83c81e375ab2?w=500&q=80", isNew: true, desc: "Gilet matelassé sans manches. Idéal pour le layering urbain." },
    { id: 9, name: "NORVA Beanie", category: "accessoires", gender: "unisex", price: 149, img: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=500&q=80", isNew: false, desc: "Bonnet en laine mérinos mélangée. Logo brodé ton sur ton." },
    { id: 10, name: "NORVA Crossbody Bag", category: "accessoires", gender: "unisex", price: 299, img: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500&q=80", isNew: true, desc: "Sac bandoulière compact. Sangle ajustable et rangements optimisés." },
    { id: 11, name: "NORVA Graphic Tee", category: "t-shirts", gender: "homme", price: 259, img: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500&q=80", isNew: false, desc: "T-shirt avec motif typographique exclusif NORVA." },
    { id: 12, name: "NORVA Tech Jogger", category: "pantalons", gender: "homme", price: 429, img: "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?w=500&q=80", isNew: false, desc: "Jogger technique. Tissu extensible, coupe fuselée pour un maximum de confort." }
];

// STATE MANAGEMENT (LocalStorage)
let cart = JSON.parse(localStorage.getItem('norva_cart')) || [];
let favorites = JSON.parse(localStorage.getItem('norva_favs')) || [];
let currentFilter = 'all';

// DOM ELEMENTS
const views = document.querySelectorAll('.view');
const mainProductGrid = document.getElementById('main-product-grid');
const newCollectionGrid = document.getElementById('new-collection-grid');
const favoritesGrid = document.getElementById('favorites-grid');
const cartCount = document.getElementById('cart-count');
const favCount = document.getElementById('fav-count');
const cartSidebar = document.getElementById('cart-sidebar');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalPrice = document.getElementById('cart-total-price');
const productModal = document.getElementById('product-modal');
const modalBody = document.getElementById('modal-body-content');

// INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
    updateBadges();
    renderProducts(products.filter(p => p.isNew).slice(0,4), newCollectionGrid);
    renderProducts(products, mainProductGrid);
    setupEventListeners();
});

// ROUTING / VIEW SWITCHER
function switchView(viewId) {
    views.forEach(view => view.classList.add('hidden'));
    document.getElementById(`view-${viewId}`).classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    if(viewId === 'shop') renderShop();
    if(viewId === 'favorites') renderFavoritesView();
    if(viewId === 'checkout') renderCheckoutSummary();
}

// RENDER PRODUCTS
function renderProducts(items, container) {
    container.innerHTML = '';
    if(items.length === 0) {
        if(container === mainProductGrid) document.getElementById('no-products-msg').classList.remove('hidden');
        return;
    }
    if(container === mainProductGrid) document.getElementById('no-products-msg').classList.add('hidden');

    items.forEach(product => {
        const isFav = favorites.includes(product.id);
        const card = document.createElement('div');
        card.className = 'product-card fade-in';
        card.innerHTML = `
            <div class="product-img-wrapper" onclick="openProductModal(${product.id})">
                ${product.isNew ? '<span class="badge-new">NEW</span>' : ''}
                <img src="${product.img}" alt="${product.name}">
                <div class="add-to-cart-overlay">
                    <button class="btn btn-primary" onclick="event.stopPropagation(); addToCart(${product.id})">AJOUTER AU PANIER</button>
                </div>
            </div>
            <button class="fav-btn-card ${isFav ? 'active' : ''}" onclick="toggleFavorite(${product.id}, this)">
                <i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
            </button>
            <div class="product-info" onclick="openProductModal(${product.id})">
                <p class="product-cat">${product.category} · ${product.gender}</p>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">${product.price} MAD</p>
            </div>
        `;
        container.appendChild(card);
    });
}

// FILTER & SORT
function renderShop() {
    let filtered = products;
    if (currentFilter !== 'all') {
        if (['homme', 'femme'].includes(currentFilter)) {
            filtered = products.filter(p => p.gender === currentFilter || p.gender === 'unisex');
        } else if (currentFilter === 'new') {
            filtered = products.filter(p => p.isNew);
        } else {
            filtered = products.filter(p => p.category === currentFilter);
        }
    }

    const sortVal = document.getElementById('sort-select').value;
    if (sortVal === 'price-asc') filtered.sort((a, b) => a.price - b.price);
    if (sortVal === 'price-desc') filtered.sort((a, b) => b.price - a.price);
    if (sortVal === 'new') filtered.sort((a, b) => (a.isNew === b.isNew) ? 0 : a.isNew ? -1 : 1);

    renderProducts(filtered, mainProductGrid);
}

// CART LOGIC
function addToCart(id, qty = 1) {
    const product = products.find(p => p.id === id);
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.qty += qty;
    } else {
        cart.push({ ...product, qty });
    }
    saveCart();
    openCart();
}

function updateCartQty(id, change) {
    const item = cart.find(i => i.id === id);
    if(item) {
        item.qty += change;
        if(item.qty <= 0) cart = cart.filter(i => i.id !== id);
        saveCart();
        renderCartItems();
        if(document.getElementById('view-checkout').classList.contains('hidden') === false){
            renderCheckoutSummary();
        }
    }
}

function saveCart() {
    localStorage.setItem('norva_cart', JSON.stringify(cart));
    updateBadges();
    renderCartItems();
}

// FAVORITES LOGIC
function toggleFavorite(id, btnElement = null) {
    if (favorites.includes(id)) {
        favorites = favorites.filter(favId => favId !== id);
        if(btnElement) {
            btnElement.classList.remove('active');
            btnElement.innerHTML = '<i class="fa-regular fa-heart"></i>';
        }
    } else {
        favorites.push(id);
        if(btnElement) {
            btnElement.classList.add('active');
            btnElement.innerHTML = '<i class="fa-solid fa-heart"></i>';
        }
    }
    localStorage.setItem('norva_favs', JSON.stringify(favorites));
    updateBadges();
    if(!document.getElementById('view-favorites').classList.contains('hidden')) {
        renderFavoritesView();
    }
}

function renderFavoritesView() {
    const favProducts = products.filter(p => favorites.includes(p.id));
    if(favProducts.length === 0) {
        document.getElementById('empty-fav-msg').classList.remove('hidden');
    } else {
        document.getElementById('empty-fav-msg').classList.add('hidden');
    }
    renderProducts(favProducts, favoritesGrid);
}

// UI UPDATES
function updateBadges() {
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    cartCount.textContent = totalItems;
    favCount.textContent = favorites.length;
}

function renderCartItems() {
    cartItemsContainer.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
        total += item.price * item.qty;
        cartItemsContainer.innerHTML += `
            <div class="cart-item fade-in">
                <img src="${item.img}" alt="${item.name}">
                <div class="cart-item-info">
                    <div>
                        <div class="cart-item-title">${item.name}</div>
                        <div style="font-weight:bold">${item.price} MAD</div>
                    </div>
                    <div class="cart-qty">
                        <button onclick="updateCartQty(${item.id}, -1)">-</button>
                        <span>${item.qty}</span>
                        <button onclick="updateCartQty(${item.id}, 1)">+</button>
                    </div>
                </div>
                <div class="cart-item-remove" onclick="updateCartQty(${item.id}, -${item.qty})">Supprimer</div>
            </div>
        `;
    });
    cartTotalPrice.textContent = `${total} MAD`;
}

function openCart() {
    cartSidebar.classList.add('open');
    sidebarOverlay.classList.remove('hidden');
    renderCartItems();
}

function closeCart() {
    cartSidebar.classList.remove('open');
    sidebarOverlay.classList.add('hidden');
}

// PRODUCT MODAL
function openProductModal(id) {
    const p = products.find(prod => prod.id === id);
    const isFav = favorites.includes(p.id);
    modalBody.innerHTML = `
        <div class="product-detail-view fade-in">
            <div class="product-detail-img">
                <img src="${p.img}" alt="${p.name}">
            </div>
            <div class="product-detail-info">
                <p class="product-cat">${p.category}</p>
                <h2>${p.name}</h2>
                <div class="price">${p.price} MAD</div>
                <p>${p.desc}</p>
                <div style="margin-bottom:1rem; font-weight:bold;">Taille :</div>
                <div class="size-selector">
                    <div class="size-btn">S</div>
                    <div class="size-btn selected">M</div>
                    <div class="size-btn">L</div>
                    <div class="size-btn">XL</div>
                </div>
                <div style="display:flex; gap:1rem; margin-top:2rem;">
                    <button class="btn btn-primary" style="flex-grow:1" onclick="addToCart(${p.id}); document.getElementById('product-modal').classList.add('hidden')">AJOUTER AU PANIER</button>
                    <button class="fav-btn-card ${isFav ? 'active' : ''}" style="position:static; width:45px; height:45px;" onclick="toggleFavorite(${p.id}, this)">
                        <i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    productModal.classList.remove('hidden');
    
    // Select taille logic statique pour démo
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
            e.target.classList.add('selected');
        });
    });
}

// CHECKOUT SUMMARY
function renderCheckoutSummary() {
    const container = document.getElementById('checkout-items');
    container.innerHTML = '';
    let subtotal = 0;
    cart.forEach(item => {
        subtotal += item.price * item.qty;
        container.innerHTML += `
            <div style="display:flex; justify-content:space-between; margin-bottom:10px; font-size:0.9rem;">
                <span>${item.qty}x ${item.name}</span>
                <strong>${item.price * item.qty} MAD</strong>
            </div>
        `;
    });
    
    const shippingSelect = document.querySelector('input[name="shipping"]:checked').value;
    const shippingCost = shippingSelect === 'express' ? 50 : 0;
    
    document.getElementById('checkout-subtotal').textContent = `${subtotal} MAD`;
    document.getElementById('checkout-shipping').textContent = shippingCost === 0 ? 'Gratuit' : `${shippingCost} MAD`;
    document.getElementById('checkout-total').textContent = `${subtotal + shippingCost} MAD`;
}

// EVENT LISTENERS SETUP
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('a[data-link], button[data-link]').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            const target = el.getAttribute('data-link');
            if (el.hasAttribute('data-filter')) {
                currentFilter = el.getAttribute('data-filter');
                document.querySelectorAll('.filter-btn').forEach(btn => {
                    btn.classList.toggle('active', btn.getAttribute('data-filter') === currentFilter);
                });
            }
            switchView(target);
            if(document.querySelector('.nav-links').classList.contains('active')) {
                document.querySelector('.nav-links').classList.remove('active');
            }
        });
    });

    // Category Cards Home
    document.querySelectorAll('.cat-card').forEach(card => {
        card.addEventListener('click', () => {
            currentFilter = card.getAttribute('data-filter');
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.toggle('active', btn.getAttribute('data-filter') === currentFilter);
            });
            switchView('shop');
        });
    });

    // Shop Filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.getAttribute('data-filter');
            renderShop();
        });
    });

    document.getElementById('sort-select').addEventListener('change', renderShop);

    // Cart Events
    document.getElementById('cart-btn').addEventListener('click', openCart);
    document.getElementById('close-cart').addEventListener('click', closeCart);
    sidebarOverlay.addEventListener('click', closeCart);
    
    document.getElementById('clear-cart').addEventListener('click', () => {
        cart = []; saveCart();
    });

    document.getElementById('go-to-checkout').addEventListener('click', () => {
        if(cart.length === 0) return alert("Votre panier est vide !");
        closeCart();
        switchView('checkout');
    });

    // Favoris Event
    document.getElementById('fav-btn').addEventListener('click', () => switchView('favorites'));

    // Mobile Menu
    document.getElementById('mobile-menu-btn').addEventListener('click', () => {
        document.querySelector('.nav-links').classList.toggle('active');
    });

    // Modal Events
    document.getElementById('close-modal').addEventListener('click', () => productModal.classList.add('hidden'));
    productModal.addEventListener('click', (e) => { if(e.target === productModal) productModal.classList.add('hidden'); });

    // Search Events
    const searchOverlay = document.getElementById('search-overlay');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');

    document.getElementById('search-btn').addEventListener('click', () => {
        searchOverlay.classList.remove('hidden');
        searchInput.focus();
    });
    document.getElementById('close-search').addEventListener('click', () => searchOverlay.classList.add('hidden'));

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        if(query.length < 2) { searchResults.innerHTML = ''; return; }
        const results = products.filter(p => p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query));
        renderProducts(results, searchResults);
    });

    // Checkout Form
    document.querySelectorAll('input[name="shipping"]').forEach(radio => {
        radio.addEventListener('change', renderCheckoutSummary);
    });

    document.getElementById('checkout-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const orderNum = 'NV-' + Math.floor(Math.random() * 1000000);
        document.getElementById('order-number').textContent = orderNum;
        cart = []; saveCart();
        switchView('success');
    });

    // Newsletter
    document.getElementById('newsletter-form').addEventListener('submit', (e) => {
        e.preventDefault();
        document.getElementById('newsletter-form').classList.add('hidden');
        document.getElementById('newsletter-msg').classList.remove('hidden');
    });
}
