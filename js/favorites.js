// ==========================================
// FAVORITES PAGE LOGIC WITH TOASTS
// ==========================================

function renderFavorites() {
    const grid = document.getElementById("favorites-grid");
    const emptyState = document.getElementById("empty-state");
    const favIds = getFavorites();
    const allProducts = getProducts();

    const favProducts = allProducts.filter(p => favIds.includes(p.id));

    if (favProducts.length === 0) {
        grid.innerHTML = "";
        emptyState.classList.remove("d-none");
        return;
    }

    emptyState.classList.add("d-none");
    grid.innerHTML = "";

    favProducts.forEach(product => {
        grid.innerHTML += `
            <div class="product-card">
                <div class="img-wrapper" onclick="window.location.href='product.html?id=${product.id}'">
                    <img src="${product.image}" alt="${product.title}">
                    <span class="badge-category">${product.category}</span>
                </div>
                <div class="product-info">
                    <h5 onclick="window.location.href='product.html?id=${product.id}'">${product.title}</h5>
                    <p class="price">${product.price} EGP</p>
                    <div class="action-icons">
                        <span class="text-muted small"><i class="bi bi-tag me-1"></i>${product.condition}</span>
                        <button class="action-icon-btn text-danger" onclick="removeFav(${product.id})">
                            <i class="bi bi-trash3-fill"></i> Remove
                        </button>
                    </div>
                    <div class="d-flex gap-2">
                        <button class="btn btn-outline-success flex-fill rounded-pill btn-sm fw-semibold" onclick="window.location.href='product.html?id=${product.id}'">
                            View Details
                        </button>
                        <button class="btn btn-success flex-fill rounded-pill btn-sm fw-semibold" onclick="quickAddToCart(${product.id})">
                            <i class="bi bi-cart-plus"></i> Add
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
}

function removeFav(id) {
    toggleFavorite(id);
    showToast("Item removed from Favorites", "info");
    renderFavorites();
}

function quickAddToCart(id) {
    const product = getProductById(id);
    if (product) {
        addToCart(product);
        showToast(`"${product.title}" added to cart!`, "success");
    }
}

document.addEventListener("DOMContentLoaded", renderFavorites);
