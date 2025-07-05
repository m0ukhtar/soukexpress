// Gestion de l'authentification
function checkAuth() {
    const token = localStorage.getItem('soukExpressToken');
    if (!token && !['login.html', 'register.html'].includes(window.location.pathname.split('/').pop())) {
        window.location.href = 'login.html';
    }
}

// Gestion des favoris
function loadFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const container = document.querySelector('.favorites-grid');
    
    if (favorites.length === 0) {
        document.querySelector('.empty-state').style.display = 'block';
        container.style.display = 'none';
    } else {
        // Générer le HTML pour chaque favori
        let html = '';
        favorites.forEach(product => {
            html += `
                <div class="favorite-item" data-id="${product.id}">
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.name}" />
                        <button class="remove-favorite"><i class="fas fa-times"></i></button>
                    </div>
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        <div class="price">${product.price} FCFA</div>
                        <div class="product-actions">
                            <a href="#" class="btn-add-to-cart">Ajouter au panier</a>
                        </div>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
        container.style.display = 'grid';
        document.querySelector('.empty-state').style.display = 'none';
    }
}

// Gestion du panier
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    });
}

function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const container = document.querySelector('.cart-items');
    
    if (cart.length === 0) {
        container.innerHTML = '<div class="empty-cart">Votre panier est vide</div>';
    } else {
        // Générer le HTML pour chaque article
        let html = '';
        let subtotal = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            
            html += `
                <div class="cart-item" data-id="${item.id}">
                    <div class="product-image">
                        <img src="${item.image}" alt="${item.name}" />
                    </div>
                    <div class="product-details">
                        <h3>${item.name}</h3>
                        <div class="product-meta">
                            <span>Couleur: ${item.color || 'N/A'}</span>
                            <span>Stock: ${item.stock || 'Disponible'}</span>
                        </div>
                        <button class="remove-item"><i class="fas fa-trash"></i> Supprimer</button>
                    </div>
                    <div class="product-price">
                        <span class="price">${item.price.toLocaleString()} FCFA</span>
                        ${item.originalPrice ? `<span class="original-price">${item.originalPrice.toLocaleString()} FCFA</span>` : ''}
                    </div>
                    <div class="product-quantity">
                        <button class="qty-btn minus"><i class="fas fa-minus"></i></button>
                        <input type="number" value="${item.quantity}" min="1" />
                        <button class="qty-btn plus"><i class="fas fa-plus"></i></button>
                    </div>
                    <div class="product-subtotal">
                        <span>${itemTotal.toLocaleString()} FCFA</span>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
        
        // Mettre à jour le résumé
        const delivery = 25000;
        const discount = 150000;
        const total = subtotal + delivery - discount;
        
        document.querySelector('.summary-row:nth-child(1) span:last-child').textContent = `${subtotal.toLocaleString()} FCFA`;
        document.querySelector('.summary-row.total span:last-child').textContent = `${total.toLocaleString()} FCFA`;
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    
    if (window.location.pathname.includes('mon-compte.html')) {
        loadFavorites();
    }
    
    if (window.location.pathname.includes('panier.html')) {
        loadCart();
    }
    
    updateCartCount();
});