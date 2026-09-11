// --- DATA ---
const products = [
    { id: 1, name: "T-Shirt Essentiel", category: "T-Shirts", gender: "Homme", price: 249, isNew: false, img: "https://placehold.co/400x500/D8C7B0/2C211B?text=T-Shirt+Essentiel" },
    { id: 2, name: "Sweat Oversize", category: "Sweats à capuche", gender: "Homme", price: 499, isNew: true, img: "https://placehold.co/400x500/D8C7B0/2C211B?text=Sweat+Oversize" },
    { id: 3, name: "Pantalon Street", category: "Pantalons", gender: "Homme", price: 399, isNew: false, img: "https://placehold.co/400x500/D8C7B0/2C211B?text=Pantalon+Street" },
    { id: 4, name: "Veste Signature", category: "Vestes", gender: "Femme", price: 699, isNew: true, img: "https://placehold.co/400x500/D8C7B0/2C211B?text=Veste+Signature" },
    { id: 5, name: "T-Shirt Basic", category: "T-Shirts", gender: "Femme", price: 199, isNew: false, img: "https://placehold.co/400x500/D8C7B0/2C211B?text=T-Shirt+Basic" },
    { id: 6, name: "Sweat Urban", category: "Sweats à capuche", gender: "Femme", price: 449, isNew: false, img: "https://placehold.co/400x500/D8C7B0/2C211B?text=Sweat+Urban" },
    { id: 7, name: "T-Shirt Premium", category: "T-Shirts", gender: "Homme", price: 299, isNew: false, img: "https://placehold.co/400x500/D8C7B0/2C211B?text=T-Shirt+Premium" },
    { id: 8, name: "Pantalon Essential", category: "Pantalons", gender: "Femme", price: 429, isNew: false, img: "https://placehold.co/400x500/D8C7B0/2C211B?text=Pantalon+Essential" },
    { id: 9, name: "Veste Urban", category: "Vestes", gender: "Homme", price: 599, isNew: false, img: "https://placehold.co/400x500/D8C7B0/2C211B?text=Veste+Urban" },
    { id: 10, name: "Sweat Signature", category: "Sweats à capuche", gender: "Femme", price: 549, isNew: true, img: "https://placehold.co/400x500/D8C7B0/2C211B?text=Sweat+Signature" },
    { id: 11, name: "Casquette NORVA", category: "Accessoires", gender: "Tous", price: 179, isNew: false, img: "https://placehold.co/400x500/D8C7B0/2C211B?text=Casquette+NORVA" },
    { id: 12, name: "Sac NORVA", category: "Accessoires", gender: "Tous", price: 299, isNew: true, img: "https://placehold.co/400x500/D8C7B0/2C211B?text=Sac+NORVA" }
];

// --- STATE ---
let cart = JSON.parse(localStorage.getItem('norva_cart')) || [];
let favorites = JSON.parse(localStorage.getItem('norva_favorites')) || [];
let currentFilter = "Tous";
let currentSort = "default";
let searchQuery = "";

// --- DOM ELEMENTS ---
const mainShopGrid = document.getElementById('main-shop-grid');
const newCollectionGrid = document.getElementById('new-collection-grid');
const cartBadge = document.getElementById('cart-badge');
const favBadge = document.getElementById('fav-badge');
const overlayBg = document.getElementById('overlay-bg');
const cartSidebar = document.getElementById('cart-sidebar');
const favSidebar = document.getElementById('fav-sidebar');
const productModal = document.getElementById('product-modal');
const checkoutModal = document.getElementById('checkout-modal');
const noProductsMsg = document.getElementById('no-products-msg');

// --- INIT ---
document.addEventListener('DOMContentLoaded', () => {
    renderMainShop();
    renderNewCollection();
    updateBadges();
    renderCart();
    renderFavorites();
});

// --- RENDER FUNCTIONS ---
function createProductCardHTML(product) {
    const isFav = favorites.some(fav => fav.id === product.id);
    return `
        <div class="product-card" data-id="${product.id}">
            <div class="product-img-container" onclick="openProductModal(${product.id})">
                ${product.isNew ? '<span class="badge-new">Nouveauté</span>' : ''}
                <img src="${product.img}" alt="${product.name}">
            </div>
            <button class="btn-fav-card ${isFav ? 'active' : ''}" onclick="toggleFavorite(${product.id}, event)">
                <i class="${isFav ? 'fas' : 'far'} fa-heart"></i>
            </button>
            <div class="product-info">
                <div>
                    <div class="product-category">${product.category}</div>
                    <div class="product-title">${product.name}</div>
                    <div class="product-price">${product.price} MAD</div>
                </div>
                <button class="btn-add-cart" onclick="addToCart(${product.id})">AJOUTER AU PANIER</button>
            </div>
        </div>
    `;
}

function renderMainShop() {
    let filtered = products.filter(p => {
        let matchFilter = true;
        if (currentFilter !== "Tous") {
            if (currentFilter === "Homme" || currentFilter === "Femme") {
                matchFilter = (p.gender === currentFilter || p.gender === "Tous");
            } else {
                matchFilter = p.category === currentFilter;
            }
        }
        let matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchFilter && matchSearch;
    });

    if (currentSort === "price-asc") filtered.sort((a, b) => a.price - b.price);
    if (currentSort === "price-desc") filtered.sort((a, b) => b.price - a.price);
    if (currentSort === "new") filtered.sort((a, b) => (b.isNew === true ? 1 : 0) - (a.isNew === true ? 1 : 0));

    if (filtered.length === 0) {
        mainShopGrid.innerHTML = '';
        noProductsMsg.classList.remove('hidden');
    } else {
        noProductsMsg.classList.add('hidden');
        mainShopGrid.innerHTML = filtered.map(createProductCardHTML).join('');
    }
}

function renderNewCollection() {
    const newItems = products.filter(p => p.isNew).slice(0, 4);
    newCollectionGrid.innerHTML = newItems.map(createProductCardHTML).join('');
}

// --- CART LOGIC ---
function addToCart(id, qty = 1, size = 'M', color = 'Standard') {
    const product = products.find(p => p.id === id);
    const existing = cart.find(item => item.id === id && item.size === size && item.color === color);
    if (existing) {
        existing.qty += parseInt(qty);
    } else {
        cart.push({ ...product, qty: parseInt(qty), size, color });
    }
    saveCart();
    renderCart();
    openSidebar(cartSidebar);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    renderCart();
}

function changeQty(index, delta) {
    cart[index].qty += delta;
    if (cart[index].qty <= 0) cart.splice(index, 1);
    saveCart();
    renderCart();
}

function saveCart() {
    localStorage.setItem('norva_cart', JSON.stringify(cart));
    updateBadges();
}

function renderCart() {
    const container = document.getElementById('cart-items-container');
    const totalEl = document.getElementById('cart-total-price');
    
    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align:center; margin-top:50px;">Votre panier est vide.</p>';
        totalEl.textContent = '0 MAD';
        return;
    }

    let total = 0;
    container.innerHTML = cart.map((item, index) => {
        total += item.price * item.qty;
        return `
            <div class="cart-item">
                <div class="cart-item-img"><img src="${item.img}" alt="${item.name}"></div>
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.name}</div>
                    <div style="font-size:0.8rem; margin-bottom:5px;">Taille: ${item.size} | Coul: ${item.color}</div>
                    <div class="cart-item-price">${item.price} MAD</div>
                    <div class="cart-item-controls">
                        <button class="qty-btn" onclick="changeQty(${index}, -1)">-</button>
                        <span>${item.qty}</span>
                        <button class="qty-btn" onclick="changeQty(${index}, 1)">+</button>
                        <button class="cart-item-remove" onclick="removeFromCart(${index})">SUPPRIMER</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    totalEl.textContent = `${total} MAD`;
}

document.getElementById('btn-clear-cart').addEventListener('click', () => {
    cart = [];
    saveCart();
    renderCart();
});

// --- FAVORITES LOGIC ---
function toggleFavorite(id, event) {
    if(event) event.stopPropagation();
    const index = favorites.findIndex(fav => fav.id === id);
    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        const product = products.find(p => p.id === id);
        favorites.push(product);
    }
    saveFavorites();
    renderMainShop();
    renderNewCollection();
    renderFavorites();
}

function saveFavorites() {
    localStorage.setItem('norva_favorites', JSON.stringify(favorites));
    updateBadges();
}

function renderFavorites() {
    const container = document.getElementById('fav-items-container');
    if (favorites.length === 0) {
        container.innerHTML = '<p style="text-align:center; margin-top:50px;">Aucun favori.</p>';
        return;
    }
    container.innerHTML = favorites.map(item => `
        <div class="fav-item">
            <div class="fav-item-img"><img src="${item.img}" alt="${item.name}"></div>
            <div class="fav-item-info">
                <div class="fav-item-title">${item.name}</div>
                <div class="cart-item-price">${item.price} MAD</div>
                <div class="cart-item-controls">
                    <button class="btn-primary" style="padding: 5px 10px; font-size:0.8rem;" onclick="addToCart(${item.id})">AJOUTER</button>
                    <button class="fav-item-remove" onclick="toggleFavorite(${item.id})">SUPPRIMER</button>
                </div>
            </div>
        </div>
    `).join('');
}

// --- BADGES ---
function updateBadges() {
    cartBadge.textContent = cart.reduce((acc, item) => acc + item.qty, 0);
    favBadge.textContent = favorites.length;
}

// --- PRODUCT MODAL ---
function openProductModal(id) {
    const product = products.find(p => p.id === id);
    const content = document.getElementById('product-detail-content');
    
    content.innerHTML = `
        <div class="product-detail-img">
            <img src="${product.img}" alt="${product.name}">
        </div>
        <div class="product-detail-info">
            <div class="product-category">${product.category}</div>
            <h2 class="pd-title">${product.name}</h2>
            <div class="pd-price">${product.price} MAD</div>
            <p class="pd-desc">Découvrez notre ${product.name.toLowerCase()}, une pièce incontournable de la collection NORVA. Conçu pour allier confort absolu et style urbain minimaliste. Parfait pour exprimer votre identité au quotidien.</p>
            
            <div class="pd-options">
                <label>Taille</label>
                <select id="pd-size">
                    <option value="S">S</option>
                    <option value="M" selected>M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                </select>
                
                <label>Couleur</label>
                <select id="pd-color">
                    <option value="Standard">Standard</option>
                    <option value="Noir">Noir Profond</option>
                    <option value="Beige">Beige Signature</option>
                </select>

                <label>Quantité</label>
                <input type="number" id="pd-qty" value="1" min="1" max="10">
            </div>

            <div class="pd-actions">
                <button class="btn-secondary" onclick="addFromModal(${product.id})">AJOUTER AU PANIER</button>
                <button class="btn-primary" onclick="buyNow(${product.id})">ACHETER MAINTENANT</button>
            </div>
        </div>
    `;

    // Related products (random 3 from same category or fallback)
    const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0,3);
    if(related.length < 3) related.push(...products.filter(p => p.id !== product.id).slice(0, 3 - related.length));
    
    document.getElementById('related-products-grid').innerHTML = related.map(createProductCardHTML).join('');

    openModal(productModal);
}

window.addFromModal = function(id) {
    const qty = document.getElementById('pd-qty').value;
    const size = document.getElementById('pd-size').value;
    const color = document.getElementById('pd-color').value;
    addToCart(id, qty, size, color);
    closeAllModals();
}

window.buyNow = function(id) {
    addFromModal(id);
    closeAllModals();
    openModal(checkoutModal);
    renderCheckout();
}

// --- UI INTERACTIONS ---

// Modals / Sidebars functions
function openSidebar(element) {
    overlayBg.classList.add('active');
    element.classList.add('active');
}
function closeSidebar(element) {
    element.classList.remove('active');
    if(!document.querySelector('.modal-overlay.active')) {
        overlayBg.classList.remove('active');
    }
}
function openModal(element) {
    overlayBg.classList.add('active');
    element.classList.add('active');
}
function closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
    document.querySelectorAll('.sidebar').forEach(s => s.classList.remove('active'));
    overlayBg.classList.remove('active');
}

// Event Listeners for UI
document.getElementById('cart-icon').addEventListener('click', () => openSidebar(cartSidebar));
document.getElementById('close-cart').addEventListener('click', () => closeSidebar(cartSidebar));
document.getElementById('btn-continue-shopping').addEventListener('click', () => closeSidebar(cartSidebar));

document.getElementById('fav-icon').addEventListener('click', () => openSidebar(favSidebar));
document.getElementById('close-fav').addEventListener('click', () => closeSidebar(favSidebar));

overlayBg.addEventListener('click', closeAllModals);
document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', closeAllModals);
});

// Mobile Menu
const menuIcon = document.getElementById('menu-icon');
const navLinks = document.querySelector('.nav-links');
menuIcon.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Search
const searchIcon = document.getElementById('search-icon');
const searchContainer = document.getElementById('search-bar-container');
const searchInput = document.getElementById('search-input');
const closeSearch = document.getElementById('close-search');

searchIcon.addEventListener('click', () => {
    searchContainer.classList.toggle('hidden');
    if(!searchContainer.classList.contains('hidden')) searchInput.focus();
});
closeSearch.addEventListener('click', () => searchContainer.classList.add('hidden'));

searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderMainShop();
    document.getElementById('boutique').scrollIntoView({behavior: 'smooth'});
});

// Filters & Sorting
const filterBtns = document.querySelectorAll('.filter-btn');
filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        filterBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        currentFilter = e.target.dataset.filter;
        renderMainShop();
    });
});

document.getElementById('sort-select').addEventListener('change', (e) => {
    currentSort = e.target.value;
    renderMainShop();
});

// Category Cards
document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
        const cat = card.dataset.category;
        currentFilter = cat;
        filterBtns.forEach(b => {
            b.classList.remove('active');
            if(b.dataset.filter === cat) b.classList.add('active');
        });
        document.getElementById('boutique').scrollIntoView({behavior: 'smooth'});
        renderMainShop();
    });
});

// Nav Links filtering
document.querySelectorAll('.nav-filter').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        navLinks.classList.remove('active'); // close mobile menu
        
        if (link.dataset.category) {
            currentFilter = link.dataset.category;
            filterBtns.forEach(b => {
                b.classList.remove('active');
                if(b.dataset.filter === currentFilter) b.classList.add('active');
            });
        }
        if (link.dataset.sort) {
            currentSort = link.dataset.sort;
            document.getElementById('sort-select').value = currentSort;
        }
        
        document.getElementById('boutique').scrollIntoView({behavior: 'smooth'});
        renderMainShop();
    });
});

// Smooth Scroll for Hero Button
document.getElementById('btn-discover').addEventListener('click', () => {
    document.getElementById('boutique').scrollIntoView({behavior: 'smooth'});
});

// --- CHECKOUT LOGIC ---
document.getElementById('btn-checkout').addEventListener('click', () => {
    if (cart.length === 0) {
        alert("Votre panier est vide.");
        return;
    }
    closeSidebar(cartSidebar);
    openModal(checkoutModal);
    renderCheckout();
});

function renderCheckout() {
    const itemsContainer = document.getElementById('checkout-items');
    let total = 0;
    itemsContainer.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.qty;
        total += itemTotal;
        return `
            <div class="checkout-item">
                <span>${item.qty}x ${item.name} (${item.size})</span>
                <span>${itemTotal} MAD</span>
            </div>
        `;
    }).join('');
    
    // Add shipping cost if express
    const shippingRadios = document.querySelectorAll('input[name="shipping"]');
    let shippingCost = 0;
    shippingRadios.forEach(radio => {
        if(radio.checked && radio.value === 'express') shippingCost = 50;
    });

    document.getElementById('checkout-total-price').textContent = `${total + shippingCost} MAD`;

    shippingRadios.forEach(radio => {
        radio.addEventListener('change', renderCheckout);
    });
}

document.getElementById('checkout-form').addEventListener('submit', (e) => {
    e.preventDefault();
    closeAllModals();
    
    // Generate fake order number
    const orderNum = 'NORVA-' + Math.floor(Math.random() * 1000000);
    document.getElementById('order-number').textContent = orderNum;
    
    // Clear cart
    cart = [];
    saveCart();
    renderCart();
    
    openModal(document.getElementById('success-modal'));
});

document.querySelector('.close-success').addEventListener('click', () => {
    closeAllModals();
    document.getElementById('boutique').scrollIntoView({behavior: 'smooth'});
});

// --- NEWSLETTER ---
document.getElementById('newsletter-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('newsletter-email').value;
    if(email) {
        document.getElementById('newsletter-msg').classList.remove('hidden');
        document.getElementById('newsletter-email').value = '';
        setTimeout(() => {
            document.getElementById('newsletter-msg').classList.add('hidden');
        }, 3000);
    }
});
