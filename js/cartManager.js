// ================================
// CART MANAGER
// ================================

// Get cart from localStorage
function getCart() {

    return JSON.parse(localStorage.getItem("cart")) || [];

}

// Save cart
function saveCart(cart) {

    localStorage.setItem("cart", JSON.stringify(cart));

}

// Add product
function addToCart(product) {

    const cart = getCart();

    cart.push(product);

    saveCart(cart);

    updateCartBadge();

}

// Badge
function updateCartBadge() {

    const badge = document.getElementById("cart-count");

    if (badge) {

        badge.innerText = getCart().length;

    }

}