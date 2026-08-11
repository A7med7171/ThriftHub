// ==========================================
// THRIFTHUB GLOBAL APP DATA & STORAGE HELPERS
// ==========================================

const DEFAULT_PRODUCTS = [
    {
        id: 1,
        image: "../images/products/product1.jfif",
        title: "Vintage Nike Hoodie",
        price: 650,
        likes: 245,
        category: "Hoodies",
        seller: "Ahmed Ali",
        sellerAvatar: "../images/uesrs/user1.jfif",
        condition: "Excellent",
        size: "M",
        description: "Classic vintage 90s Nike hoodie in navy blue. Very warm and stylish."
    },
    {
        id: 2,
        image: "../images/products/product2.jfif",
        title: "Luxury Leather Watch",
        price: 850,
        likes: 122,
        category: "Watches",
        seller: "Sara Hassan",
        sellerAvatar: "../images/uesrs/user2.jfif",
        condition: "Like New",
        size: "One Size",
        description: "Elegant chronograph leather strap watch, worn only twice."
    },
    {
        id: 3,
        image: "../images/products/product3.jfif",
        title: "Nike Air Jordan Sneakers",
        price: 1200,
        likes: 387,
        category: "Sneakers",
        seller: "Mohamed Omar",
        sellerAvatar: "../images/uesrs/user1.jfif",
        condition: "Good",
        size: "42",
        description: "Original Air Jordan 1s in red/black colorway. Cleaned and ready for a new home."
    },
    {
        id: 4,
        image: "../images/products/product4.jfif",
        title: "Retro Nike Sweatshirt",
        price: 780,
        likes: 211,
        category: "Hoodies",
        seller: "Nouran Ezzat",
        sellerAvatar: "../images/uesrs/user2.jfif",
        condition: "Very Good",
        size: "L",
        description: "Oversized retro graphic sweatshirt. Soft cotton material."
    },
    {
        id: 5,
        image: "../images/products/product5.jfif",
        title: "Adidas Comfort Slides",
        price: 450,
        likes: 94,
        category: "Sneakers",
        seller: "Karim Youssef",
        sellerAvatar: "../images/uesrs/user1.jfif",
        condition: "Like New",
        size: "41",
        description: "Original Adidas black slides, super comfortable cloudfoam sole."
    },
    {
        id: 6,
        image: "../images/products/product6.jfif",
        title: "Cobalt Blue Oversized Hoodie",
        price: 700,
        likes: 168,
        category: "Hoodies",
        seller: "Salma Tarek",
        sellerAvatar: "../images/uesrs/user2.jfif",
        condition: "New without tags",
        size: "XL",
        description: "Vibrant cobalt blue streetwear hoodie with fleece lining."
    },
    {
        id: 7,
        image: "../images/products/product7.jfif",
        title: "Essential White Graphic T-Shirt",
        price: 350,
        likes: 74,
        category: "T-Shirts",
        seller: "Ahmed Ali",
        sellerAvatar: "../images/uesrs/user1.jfif",
        condition: "Excellent",
        size: "M",
        description: "Heavyweight 100% organic cotton white tee with minimal chest text."
    },
    {
        id: 8,
        image: "../images/products/product8.jfif",
        title: "Vintage Brown Leather Jacket",
        price: 1400,
        likes: 301,
        category: "Jackets",
        seller: "Omar Khaled",
        sellerAvatar: "../images/uesrs/user1.jfif",
        condition: "Good Vintage",
        size: "L",
        description: "Genuine distressed brown leather jacket with inner quilted lining."
    }
];

const DEFAULT_COMMENTS = {
    1: [
        {
            id: 101,
            user: "Sara",
            avatar: "../images/uesrs/user2.jfif",
            text: "Is the price negotiable?",
            time: "2h ago",
            replies: [
                { user: "Ahmed Ali (Seller)", avatar: "../images/uesrs/user1.jfif", text: "Yes! Send me an offer slider request.", time: "1h ago" }
            ]
        },
        {
            id: 102,
            user: "Karim",
            avatar: "../images/uesrs/user1.jfif",
            text: "Looks amazing! Fits true to size?",
            time: "1h ago",
            replies: []
        }
    ],
    2: [
        {
            id: 201,
            user: "Ahmed Ali",
            avatar: "../images/uesrs/user1.jfif",
            text: "Does it come with original box?",
            time: "3h ago",
            replies: []
        }
    ]
};

const DEFAULT_CHATS = [
    {
        id: 1,
        seller: "Ahmed Ali",
        avatar: "../images/uesrs/user1.jfif",
        product: "Vintage Nike Hoodie",
        messages: [
            { sender: "other", text: "Hello 👋 Interested in the hoodie?", time: "10:30" },
            { sender: "me", text: "Hi! Is this still available?", time: "10:31" },
            { sender: "other", text: "Yes it is! Excellent condition, 650 EGP.", time: "10:32" }
        ]
    },
    {
        id: 2,
        seller: "Sara Hassan",
        avatar: "../images/uesrs/user2.jfif",
        product: "Luxury Leather Watch",
        messages: [
            { sender: "other", text: "Hey! Can I ship this to Cairo today?", time: "09:40" }
        ]
    }
];

// Initialize Storage
function initStorage() {
    if (!localStorage.getItem("products")) {
        localStorage.setItem("products", JSON.stringify(DEFAULT_PRODUCTS));
    }
    if (!localStorage.getItem("favorites")) {
        localStorage.setItem("favorites", JSON.stringify([]));
    }
    if (!localStorage.getItem("cart")) {
        localStorage.setItem("cart", JSON.stringify([]));
    }
    if (!localStorage.getItem("orders")) {
        localStorage.setItem("orders", JSON.stringify([]));
    }
    if (!localStorage.getItem("comments")) {
        localStorage.setItem("comments", JSON.stringify(DEFAULT_COMMENTS));
    }
    if (!localStorage.getItem("chats")) {
        localStorage.setItem("chats", JSON.stringify(DEFAULT_CHATS));
    }
}
initStorage();

// Custom Toast Notification System (replaces ugly browser alerts)
function showToast(message, type = "success") {
    let container = document.getElementById("toast-container");
    if (!container) {
        container = document.createElement("div");
        container.id = "toast-container";
        container.className = "toast-container-custom";
        document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    const bgClass = type === "success" ? "bg-success" : type === "danger" ? "bg-danger" : "bg-dark";
    const icon = type === "success" ? "bi-check-circle-fill" : type === "danger" ? "bi-x-circle-fill" : "bi-info-circle-fill";

    toast.className = `toast align-items-center text-white ${bgClass} border-0 show shadow-lg mb-2 rounded-4 p-2 fade-up`;
    toast.role = "alert";
    toast.innerHTML = `
        <div class="d-flex align-items-center">
            <div class="toast-body d-flex align-items-center gap-2 font-semibold">
                <i class="bi ${icon} fs-5"></i>
                <span>${message}</span>
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" onclick="this.parentElement.parentElement.remove()"></button>
        </div>
    `;

    container.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 3500);
}

// Products
function getProducts() {
    return JSON.parse(localStorage.getItem("products")) || DEFAULT_PRODUCTS;
}

function saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
}

function getProductById(id) {
    const products = getProducts();
    return products.find(p => p.id === parseInt(id));
}

// Favorites / Likes
function getFavorites() {
    return JSON.parse(localStorage.getItem("favorites")) || [];
}

function isFavorite(productId) {
    const favorites = getFavorites();
    return favorites.includes(parseInt(productId));
}

function toggleFavorite(productId) {
    let favorites = getFavorites();
    const pId = parseInt(productId);
    const products = getProducts();
    const product = products.find(p => p.id === pId);

    if (favorites.includes(pId)) {
        favorites = favorites.filter(id => id !== pId);
        if (product && product.likes > 0) product.likes--;
    } else {
        favorites.push(pId);
        if (product) product.likes++;
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
    saveProducts(products);
    updateBadges();
    return favorites.includes(pId);
}

// Cart (Single Piece Only - No Quantity)
function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateBadges();
}

function addToCart(product, customPrice = null) {
    const cart = getCart();
    const priceToUse = customPrice ? parseFloat(customPrice) : parseFloat(product.price);
    const existing = cart.find(item => item.id === product.id);

    if (existing) {
        showToast(`"${product.title}" is already in your cart!`, "info");
        return;
    }

    cart.push({
        id: product.id,
        title: product.title,
        image: product.image,
        price: priceToUse,
        originalPrice: product.price,
        seller: product.seller || "Seller",
        sellerAvatar: product.sellerAvatar || "../images/uesrs/user1.jfif",
        size: product.size || "M",
        condition: product.condition || "Good"
    });

    saveCart(cart);
}

function removeFromCart(index) {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
}

function clearCart() {
    saveCart([]);
}

// Orders
function getOrders() {
    return JSON.parse(localStorage.getItem("orders")) || [];
}

function createOrder(cartItems, shippingFee = 50) {
    const orders = getOrders();
    const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
    const newOrder = {
        id: "ORD-" + Math.floor(100000 + Math.random() * 900000),
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        status: "Shipping",
        stepIndex: 3,
        items: cartItems,
        subtotal: subtotal,
        shipping: shippingFee,
        total: subtotal + shippingFee
    };
    orders.unshift(newOrder);
    localStorage.setItem("orders", JSON.stringify(orders));
    clearCart();
    return newOrder;
}

// Chats & Offer Messages
function getChats() {
    return JSON.parse(localStorage.getItem("chats")) || DEFAULT_CHATS;
}

function saveChats(chats) {
    localStorage.setItem("chats", JSON.stringify(chats));
}

function sendOfferRequestToSeller(product, offerPrice) {
    const chats = getChats();
    const sellerName = product.seller || "Ahmed Ali";
    const now = new Date();
    const time = now.getHours().toString().padStart(2, "0") + ":" + now.getMinutes().toString().padStart(2, "0");

    let thread = chats.find(c => c.seller.toLowerCase() === sellerName.toLowerCase());

    if (!thread) {
        thread = {
            id: Date.now(),
            seller: sellerName,
            avatar: product.sellerAvatar || "../images/uesrs/user1.jfif",
            product: product.title,
            messages: []
        };
        chats.unshift(thread);
    }

    const offerMsg = {
        id: "offer-" + Date.now(),
        sender: "me",
        type: "offer_request",
        productId: product.id,
        productTitle: product.title,
        productImage: product.image,
        offerPrice: parseFloat(offerPrice),
        originalPrice: parseFloat(product.price),
        status: "pending",
        time: time
    };

    thread.messages.push(offerMsg);
    saveChats(chats);
    return thread;
}

// Comments & Nested Replies
function getComments(productId) {
    const allComments = JSON.parse(localStorage.getItem("comments")) || DEFAULT_COMMENTS;
    return allComments[productId] || [];
}

function addComment(productId, user, avatar, text) {
    const allComments = JSON.parse(localStorage.getItem("comments")) || DEFAULT_COMMENTS;
    if (!allComments[productId]) {
        allComments[productId] = [];
    }
    allComments[productId].push({
        id: Date.now(),
        user: user || "You",
        avatar: avatar || "../images/uesrs/user1.jfif",
        text: text,
        time: "Just now",
        replies: []
    });
    localStorage.setItem("comments", JSON.stringify(allComments));
    return allComments[productId];
}

function addCommentReply(productId, commentId, user, avatar, text) {
    const allComments = JSON.parse(localStorage.getItem("comments")) || DEFAULT_COMMENTS;
    const commentsList = allComments[productId];

    if (commentsList) {
        const comment = commentsList.find(c => c.id === commentId || c.id === parseInt(commentId));
        if (comment) {
            if (!comment.replies) comment.replies = [];
            comment.replies.push({
                user: user || "You",
                avatar: avatar || "../images/uesrs/user1.jfif",
                text: text,
                time: "Just now"
            });
            localStorage.setItem("comments", JSON.stringify(allComments));
        }
    }
    return allComments[productId];
}

// Badges
function updateBadges() {
    const cartBadge = document.getElementById("cart-count");
    if (cartBadge) {
        const cart = getCart();
        cartBadge.innerText = cart.length;
        cartBadge.style.display = cart.length > 0 ? "inline-block" : "none";
    }

    const favBadge = document.getElementById("fav-count");
    if (favBadge) {
        const favs = getFavorites();
        favBadge.innerText = favs.length;
        favBadge.style.display = favs.length > 0 ? "inline-block" : "none";
    }

    const dmsBadge = document.getElementById("dms-count");
    if (dmsBadge) {
        dmsBadge.innerText = "2";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    updateBadges();
});
