// Base de données simulée des produits
const productsData = [
    { id: 1, name: "Manteau Élégant Camel", price: 189.99, category: "femme", isNew: true, image: "[https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?auto=format&fit=crop&w=500&q=80](https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?auto=format&fit=crop&w=500&q=80)" },
    { id: 2, name: "Veste en Cuir Premium", price: 249.50, category: "homme", isNew: true, image: "[https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=500&q=80](https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=500&q=80)" },
    { id: 3, name: "Robe Minimaliste Crème", price: 89.00, category: "femme", isNew: false, image: "[https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=500&q=80](https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=500&q=80)" },
    { id: 4, name: "Chemise Lin Beige", price: 65.00, category: "homme", isNew: false, image: "[https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?auto=format&fit=crop&w=500&q=80](https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?auto=format&fit=crop&w=500&q=80)" },
    { id: 5, name: "Pull Cachemire Marron", price: 145.00, category: "femme", isNew: true, image: "[https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=500&q=80](https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=500&q=80)" },
    { id: 6, name: "Pantalon Chino Classique", price: 75.00, category: "homme", isNew: false, image: "[https://images.unsplash.com/photo-1624378439575-d1ead6afc0bb?auto=format&fit=crop&w=500&q=80](https://images.unsplash.com/photo-1624378439575-d1ead6afc0bb?auto=format&fit=crop&w=500&q=80)" }
];

// Gestion des états
let cart = JSON.parse(localStorage.getItem('norva_cart')) || [];
let favorites = JSON.parse(localStorage.getItem('norva_favorites')) || [];

// Éléments du DOM
const productsGrid = document.getElementById('products-grid');
const cartBadge = document.getElementById('cart-badge');
const favBadge = document.getElementById('favorites-badge');
const cartSidebar = document.getElementById('cart-sidebar');
const favSidebar = document.getElementById('favorites-sidebar');
const overlay = document.getElementById('overlay');

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    renderProducts(productsData);
    updateCartUI();
    updateFavoritesUI();
    setupEventListeners();
});

// Génération des produits HTML
function renderProducts(products) {
    productsGrid.innerHTML = '';
    
    if(products.length === 0) {
        productsGrid.innerHTML = '<p class="empty-message">Aucun produit ne correspond à votre recherche.</p>';
        return;
    }

    products.forEach(product => {
        const isFav = favorites.some(item => item.id === product.id);
        
        const productHTML = `
            <div class="product-card">
                <div class="product-image-container">
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                    ${product.isNew ? '<span class="product-badge">Nouveauté</span>' : ''}
                    <button class="favorite-btn ${isFav ? 'active' : ''}" onclick="toggleFavorite(${product.id})">
                        <i class="${isFav ? 'fas' : 'far'} fa-heart"></i>
                    </button>
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-price">${product.price.toFixed(2)} €</p>
                    <button class="btn btn-primary" onclick="addToCart(${product.id})">AJOUTER AU PANIER</button>
                </div>
            </div>
        `;
        productsGrid.insertAdjacentHTML('beforeend', productHTML);
    });
}

// Filtres de catégories
const filterBtns = document.querySelectorAll('.filter-btn');
filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Gérer le style actif
        filterBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');

        const filterValue = e.target.getAttribute('data-filter');
        
        let filteredProducts = [];
        if (filterValue === 'tous') {
            filteredProducts = productsData;
        } else if (filterValue === 'nouveaute') {
            filteredProducts = productsData.filter(p => p.isNew);
        } else {
            filteredProducts = productsData.filter(p => p.category === filterValue);
        }
        
        renderProducts(filteredProducts);
    });
});

// PANIER
function addToCart(id) {
    const product = productsData.find(p => p.id === id);
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    saveCart();
    updateCartUI();
    openSidebar(cartSidebar);
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartUI();
}

function changeQuantity(id, change) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            saveCart();
            updateCartUI();
        }
    }
}

function saveCart() {
    localStorage.setItem('norva_cart', JSON.stringify(cart));
}

function updateCartUI() {
    const cartContent = document.getElementById('cart-content');
    const totalPriceEl = document.getElementById('cart-total-price');
    
    // Mettre à jour le badge
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.textContent = totalItems;
    
    // Mettre à jour le contenu
    if (cart.length === 0) {
        cartContent.innerHTML = '<p class="empty-message">Votre panier est vide.</p>';
        totalPriceEl.textContent = '0.00 €';
        return;
    }
    
    cartContent.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        total += item.price * item.quantity;
        cartContent.innerHTML += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="item-img">
                <div class="item-details">
                    <h4 class="item-title">${item.name}</h4>
                    <p class="item-price">${item.price.toFixed(2)} €</p>
                    <div class="item-actions">
                        <button class="qty-btn" onclick="changeQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" onclick="changeQuantity(${item.id}, 1)">+</button>
                    </div>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">Supprimer</button>
                </div>
            </div>
        `;
    });
    
    totalPriceEl.textContent = `${total.toFixed(2)} €`;
}

// FAVORIS
function toggleFavorite(id) {
    const existingIndex = favorites.findIndex(item => item.id === id);
    
    if (existingIndex >= 0) {
        favorites.splice(existingIndex, 1);
    } else {
        const product = productsData.find(p => p.id === id);
        favorites.push(product);
    }
    
    localStorage.setItem('norva_favorites', JSON.stringify(favorites));
    
    // Re-rendre les produits pour mettre à jour l'icône coeur
    const currentActiveFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
    let displayProducts = productsData;
    if(currentActiveFilter === 'nouveaute') displayProducts = productsData.filter(p => p.isNew);
    else if(currentActiveFilter !== 'tous') displayProducts = productsData.filter(p => p.category === currentActiveFilter);
    
    renderProducts(displayProducts);
    updateFavoritesUI();
}

function updateFavoritesUI() {
    const favContent = document.getElementById('favorites-content');
    favBadge.textContent = favorites.length;
    
    if (favorites.length === 0) {
        favContent.innerHTML = '<p class="empty-message">Vous n\'avez aucun article en favoris.</p>';
        return;
    }
    
    favContent.innerHTML = '';
    
    favorites.forEach(item => {
        favContent.innerHTML += `
            <div class="fav-item">
                <img src="${item.image}" alt="${item.name}" class="item-img">
                <div class="item-details">
                    <h4 class="item-title">${item.name}</h4>
                    <p class="item-price">${item.price.toFixed(2)} €</p>
                    <button class="btn btn-secondary" style="padding: 5px 10px; font-size: 0.8rem; margin-top: 10px;" onclick="addToCart(${item.id}); toggleFavorite(${item.id});">AJOUTER AU PANIER</button>
                </div>
            </div>
        `;
    });
}

// GESTION DES MENUS, OVERLAYS ET RECHERCHE
function openSidebar(sidebar) {
    overlay.classList.add('active');
    sidebar.classList.add('active');
}

function closeSidebars() {
    overlay.classList.remove('active');
    cartSidebar.classList.remove('active');
    favSidebar.classList.remove('active');
}

function setupEventListeners() {
    // Toggles Sidebars
    document.getElementById('cart-toggle').addEventListener('click', () => openSidebar(cartSidebar));
    document.getElementById('favorites-toggle').addEventListener('click', () => openSidebar(favSidebar));
    
    document.getElementById('close-cart').addEventListener('click', closeSidebars);
    document.getElementById('close-favorites').addEventListener('click', closeSidebars);
    overlay.addEventListener('click', closeSidebars);
    
    // Actions Panier
    document.getElementById('clear-cart').addEventListener('click', () => {
        cart = [];
        saveCart();
        updateCartUI();
    });
    
    document.getElementById('checkout-btn').addEventListener('click', () => {
        if (cart.length > 0) {
            alert('Redirection vers la page de paiement sécurisée...');
            // Logique de commande ici
            cart = [];
            saveCart();
            updateCartUI();
            closeSidebars();
        } else {
            alert('Votre panier est vide.');
        }
    });

    // Barre de recherche
    const searchToggle = document.getElementById('search-toggle');
    const searchBar = document.getElementById('search-bar');
    const searchInput = document.getElementById('search-input');
    
    searchToggle.addEventListener('click', () => {
        searchBar.classList.toggle('active');
        if(searchBar.classList.contains('active')) {
            searchInput.focus();
        }
    });

    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = productsData.filter(p => p.name.toLowerCase().includes(term));
        renderProducts(filtered);
    });

    // Menu Mobile
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Navigation active state update on scroll (optionnel)
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active'); // Fermer menu mobile au clic
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
}
