// ==========================================
// CART & ORDERS PAGE LOGIC (1-OF-1 ITEMS ONLY)
// ==========================================

function renderCartPage() {
    const cart = getCart();
    const cartList = document.getElementById("cart-items-list");
    const cartTabCount = document.getElementById("cart-tab-count");

    if (cartTabCount) cartTabCount.innerText = cart.length;

    if (cart.length === 0) {
        cartList.innerHTML = `
            <div class="text-center py-5">
                <i class="bi bi-cart-x text-muted display-1"></i>
                <h5 class="fw-bold mt-3">Your Cart is Empty</h5>
                <p class="text-muted small mb-3">Looks like you haven't added any unique thrift items yet.</p>
                <a href="index.html" class="btn btn-success rounded-pill px-4">Browse Marketplace</a>
            </div>
        `;
        document.getElementById("summary-subtotal").innerText = "0 EGP";
        document.getElementById("summary-shipping").innerText = "0 EGP";
        document.getElementById("summary-total").innerText = "0 EGP";
        document.getElementById("checkout-btn").disabled = true;
        return;
    }

    document.getElementById("checkout-btn").disabled = false;
    cartList.innerHTML = "";

    let subtotal = 0;
    const shipping = 50;

    cart.forEach((item, index) => {
        subtotal += item.price;

        cartList.innerHTML += `
            <div class="product-box border-bottom pb-4 mb-4">
                <img src="${item.image}" alt="${item.title}">
                <div class="flex-grow-1">
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <h5 class="fw-bold m-0">${item.title}</h5>
                            <span class="badge bg-secondary-subtle text-secondary border mt-1">Unique 1-of-1 Item</span>
                        </div>
                        <button class="btn btn-sm btn-outline-danger rounded-circle" onclick="removeCartItem(${index})" title="Remove">
                            <i class="bi bi-trash3"></i>
                        </button>
                    </div>
                    <p class="text-muted small m-0 mt-2">Size: <strong>${item.size || 'M'}</strong> • Condition: <strong>${item.condition || 'Good'}</strong> • Seller: <strong>${item.seller || 'Seller'}</strong></p>
                    <div class="d-flex align-items-center justify-content-between mt-3">
                        <h4 class="text-success fw-bold m-0">${item.price} EGP</h4>
                        <span class="text-muted small"><i class="bi bi-shield-check text-success me-1"></i> Authentic Item</span>
                    </div>
                </div>
            </div>
        `;
    });

    document.getElementById("summary-subtotal").innerText = `${subtotal} EGP`;
    document.getElementById("summary-shipping").innerText = `${shipping} EGP`;
    document.getElementById("summary-total").innerText = `${subtotal + shipping} EGP`;

    // Checkout handler
    document.getElementById("checkout-btn").onclick = () => {
        const order = createOrder(cart, shipping);
        showToast(`Order #${order.id} placed successfully! Check your package tracking.`, "success");
        renderCartPage();
        renderOrdersPage();
        const ordersTabBtn = document.getElementById("orders-tab");
        const tab = new bootstrap.Tab(ordersTabBtn);
        tab.show();
    };
}

function removeCartItem(index) {
    removeFromCart(index);
    showToast("Item removed from cart.", "info");
    renderCartPage();
}

function renderOrdersPage() {
    const orders = getOrders();
    const ordersList = document.getElementById("orders-list");

    if (orders.length === 0) {
        ordersList.innerHTML = `
            <div class="bg-white p-5 rounded-4 shadow-sm text-center">
                <i class="bi bi-box-seam text-muted display-1"></i>
                <h5 class="fw-bold mt-3">No Active Orders</h5>
                <p class="text-muted small">When you purchase items on ThriftHub, your orders will appear here.</p>
            </div>
        `;
        return;
    }

    ordersList.innerHTML = "";

    orders.forEach(order => {
        const item = order.items[0] || { title: "Thrift Product", price: 650, image: "../images/products/product1.jfif" };

        ordersList.innerHTML += `
            <div class="order-card mb-4">
                <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                    <div>
                        <h4 class="fw-bold m-0">Order #${order.id}</h4>
                        <small class="text-muted"><i class="bi bi-calendar-event me-1"></i>${order.date}</small>
                    </div>
                    <span class="badge bg-success text-white fs-6 px-3 py-2 rounded-pill">
                        ${order.status}
                    </span>
                </div>

                <!-- Progress Stepper -->
                <div class="progress-container">
                    <div class="progress-line"></div>
                    <div class="step ${order.stepIndex >= 0 ? 'active' : ''}">
                        <div class="circle"></div>
                        <small>Pending</small>
                    </div>
                    <div class="step ${order.stepIndex >= 1 ? 'active' : ''}">
                        <div class="circle"></div>
                        <small>Accepted</small>
                    </div>
                    <div class="step ${order.stepIndex >= 2 ? 'active' : ''}">
                        <div class="circle"></div>
                        <small>Confirmed</small>
                    </div>
                    <div class="step ${order.stepIndex >= 3 ? 'active' : ''}">
                        <div class="circle"></div>
                        <small>Shipping</small>
                    </div>
                    <div class="step ${order.stepIndex >= 4 ? 'active' : ''}">
                        <div class="circle"></div>
                        <small>On The Way</small>
                    </div>
                    <div class="step ${order.stepIndex >= 5 ? 'active' : ''}">
                        <div class="circle"></div>
                        <small>Delivered</small>
                    </div>
                </div>

                <hr>

                <!-- Item Summary -->
                <div class="product-box">
                    <img src="${item.image}" alt="${item.title}">
                    <div>
                        <h5 class="fw-bold">${item.title} ${order.items.length > 1 ? `(+${order.items.length - 1} more items)` : ''}</h5>
                        <p class="text-muted m-0">Size ${item.size || 'M'} • ${item.condition || 'Excellent'} Condition</p>
                        <h4 class="text-success fw-bold mt-2">${order.total} EGP</h4>
                    </div>
                </div>

                <hr>

                <!-- Actions -->
                <div class="d-flex gap-3">
                    <button class="btn btn-success rounded-3 py-2 px-4 fw-semibold" onclick="window.location.href='chat.html?seller=${encodeURIComponent(item.seller || 'Seller')}&product=${encodeURIComponent(item.title)}'">
                        <i class="bi bi-chat-dots me-1"></i> Chat Seller
                    </button>
                    <button class="btn btn-outline-dark rounded-3 py-2 px-4 fw-semibold" onclick="showToast('Courier has picked up your package and is en route!', 'info')">
                        <i class="bi bi-geo-alt me-1"></i> Track Live Package
                    </button>
                </div>
            </div>
        `;
    });
}

document.addEventListener("DOMContentLoaded", () => {
    renderCartPage();
    renderOrdersPage();
});
