// ==========================================
// PRODUCT DETAIL PAGE LOGIC WITH COMMENT REPLIES & TOASTS
// ==========================================

let currentProduct = null;
let activeProductReplyCommentId = null;

function loadProductDetail() {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id") || "1";
    currentProduct = getProductById(productId);

    if (!currentProduct) {
        currentProduct = getProducts()[0];
    }

    // Populate Page Elements
    document.title = `${currentProduct.title} | ThriftHub`;
    document.getElementById("bc-title").innerText = currentProduct.title;
    document.getElementById("bc-category").innerText = currentProduct.category;

    document.getElementById("product-img").src = currentProduct.image;
    document.getElementById("product-title").innerText = currentProduct.title;
    document.getElementById("product-price").innerText = `${currentProduct.price} EGP`;
    document.getElementById("product-category").innerText = currentProduct.category;
    document.getElementById("product-condition").innerText = currentProduct.condition || "Excellent";
    document.getElementById("product-size").innerText = currentProduct.size || "M";
    document.getElementById("product-desc").innerText = currentProduct.description || "No description provided.";

    document.getElementById("seller-name").innerText = currentProduct.seller || "Ahmed Ali";
    document.getElementById("seller-img").src = currentProduct.sellerAvatar || "../images/uesrs/user1.jfif";

    // Like Button state
    updateLikeButtonState();

    // Event Handlers
    document.getElementById("add-to-cart-btn").onclick = () => {
        if (window.sendOfferRequestToSellerWithReview) {
            window.sendOfferRequestToSellerWithReview(currentProduct, currentProduct.price);
        } else {
            sendOfferRequestToSeller(currentProduct, currentProduct.price);
        }
        window.location.href = `chat.html?seller=${encodeURIComponent(currentProduct.seller || "Ahmed Ali")}&product=${encodeURIComponent(currentProduct.title)}`;
    };

    document.getElementById("make-offer-btn").onclick = () => {
        openOfferModal();
    };

    document.getElementById("chat-seller-link").onclick = () => {
        window.location.href = `chat.html?seller=${encodeURIComponent(currentProduct.seller || "Ahmed Ali")}&product=${encodeURIComponent(currentProduct.title)}`;
    };

    renderProductComments();
    renderRelatedProducts();
}

function updateLikeButtonState() {
    const likeBtn = document.getElementById("like-btn");
    const liked = isFavorite(currentProduct.id);
    if (liked) {
        likeBtn.className = "btn btn-danger rounded-circle p-2 d-flex align-items-center justify-content-center";
        likeBtn.innerHTML = `<i class="bi bi-heart-fill fs-5 text-white"></i>`;
    } else {
        likeBtn.className = "btn btn-outline-danger rounded-circle p-2 d-flex align-items-center justify-content-center";
        likeBtn.innerHTML = `<i class="bi bi-heart fs-5 text-danger"></i>`;
    }
}

function handleDetailLike() {
    const liked = toggleFavorite(currentProduct.id);
    updateLikeButtonState();
    showToast(liked ? "Saved to Favorites ❤️" : "Removed from Favorites", liked ? "success" : "info");
}

// Offer Modal Logic
function openOfferModal() {
    document.getElementById("offerImage").src = currentProduct.image;
    document.getElementById("offerTitle").innerText = currentProduct.title;
    document.getElementById("originalPrice").innerText = `${currentProduct.price} EGP`;

    const slider = document.getElementById("offerSlider");
    const minOffer = Math.floor(currentProduct.price * 0.7);
    slider.min = minOffer;
    slider.max = currentProduct.price;
    slider.value = currentProduct.price;

    document.getElementById("offerValue").innerText = `${slider.value} EGP`;

    slider.oninput = function () {
        document.getElementById("offerValue").innerText = `${this.value} EGP`;
    };

    document.getElementById("buyNowBtn").onclick = () => {
        if (window.sendOfferRequestToSellerWithReview) {
            window.sendOfferRequestToSellerWithReview(currentProduct, currentProduct.price);
        } else {
            sendOfferRequestToSeller(currentProduct, currentProduct.price);
        }
        bootstrap.Modal.getInstance(document.getElementById("offerModal")).hide();
        window.location.href = `chat.html?seller=${encodeURIComponent(currentProduct.seller || "Ahmed Ali")}&product=${encodeURIComponent(currentProduct.title)}`;
    };

    document.getElementById("sendOfferBtn").onclick = () => {
        const offerPrice = slider.value;
        if (window.sendOfferRequestToSellerWithReview) {
            window.sendOfferRequestToSellerWithReview(currentProduct, offerPrice);
        } else {
            sendOfferRequestToSeller(currentProduct, offerPrice);
        }
        bootstrap.Modal.getInstance(document.getElementById("offerModal")).hide();
        window.location.href = `chat.html?seller=${encodeURIComponent(currentProduct.seller || "Ahmed Ali")}&product=${encodeURIComponent(currentProduct.title)}`;
    };

    document.getElementById("chatSellerBtn").onclick = () => {
        bootstrap.Modal.getInstance(document.getElementById("offerModal")).hide();
        window.location.href = `chat.html?seller=${encodeURIComponent(currentProduct.seller || "Ahmed Ali")}&product=${encodeURIComponent(currentProduct.title)}`;
    };

    const modal = new bootstrap.Modal(document.getElementById("offerModal"));
    modal.show();
}

// Comments with Reply Support
function renderProductComments() {
    const container = document.getElementById("comments-container");
    const commentsCount = document.getElementById("comments-count");
    const comments = getComments(currentProduct.id);

    commentsCount.innerText = comments.length;

    if (comments.length === 0) {
        container.innerHTML = `<p class="text-muted fst-italic">No questions or comments yet. Be the first to ask!</p>`;
        return;
    }

    container.innerHTML = "";
    comments.forEach(c => {
        let repliesHtml = "";
        if (c.replies && c.replies.length > 0) {
            c.replies.forEach(r => {
                repliesHtml += `
                    <div class="d-flex gap-2 mt-2 pt-2 border-top ms-4 ps-3 border-start border-3 border-success">
                        <img src="${r.avatar || '../images/uesrs/user1.jfif'}" class="rounded-circle" style="width:30px; height:30px; object-fit:cover;">
                        <div class="bg-light p-2 rounded-3 flex-grow-1">
                            <div class="d-flex align-items-center justify-content-between">
                                <h6 class="fw-bold m-0 text-success" style="font-size:13px;">${r.user}</h6>
                                <small class="text-muted" style="font-size:11px;">${r.time}</small>
                            </div>
                            <p class="m-0 text-dark mt-1" style="font-size:13px;">${r.text}</p>
                        </div>
                    </div>
                `;
            });
        }

        container.innerHTML += `
            <div class="mb-4 pb-3 border-bottom">
                <div class="d-flex gap-3">
                    <img src="${c.avatar || '../images/uesrs/user1.jfif'}" class="rounded-circle" style="width:42px; height:42px; object-fit:cover;">
                    <div class="flex-grow-1">
                        <div class="d-flex align-items-center justify-content-between">
                            <h6 class="fw-bold m-0">${c.user} <span class="text-muted fw-normal ms-2 small">${c.time}</span></h6>
                            <button class="btn btn-link btn-sm p-0 text-success text-decoration-none fw-semibold" onclick="setupProductCommentReply(${c.id}, '${c.user}')">
                                <i class="bi bi-reply-fill me-1"></i>Reply
                            </button>
                        </div>
                        <p class="m-0 text-secondary mt-1">${c.text}</p>
                        ${repliesHtml}
                    </div>
                </div>
            </div>
        `;
    });
}

function setupProductCommentReply(commentId, username) {
    activeProductReplyCommentId = commentId;
    const input = document.getElementById("comment-input");
    input.placeholder = `Replying to @${username}...`;
    input.focus();
}

document.getElementById("comment-form").onsubmit = function (e) {
    e.preventDefault();
    const input = document.getElementById("comment-input");
    const text = input.value.trim();
    if (!text) return;

    if (activeProductReplyCommentId) {
        addCommentReply(currentProduct.id, activeProductReplyCommentId, "You", "../images/uesrs/user1.jfif", text);
        activeProductReplyCommentId = null;
        input.placeholder = "Ask a question about this item...";
    } else {
        addComment(currentProduct.id, "You", "../images/uesrs/user1.jfif", text);
    }

    input.value = "";
    renderProductComments();
    showToast("Comment posted!", "success");
};

// Related Products
function renderRelatedProducts() {
    const grid = document.getElementById("related-grid");
    const allProducts = getProducts();
    const related = allProducts.filter(p => p.id !== currentProduct.id).slice(0, 4);

    grid.innerHTML = "";
    related.forEach(product => {
        grid.innerHTML += `
            <div class="product-card" onclick="window.location.href='product.html?id=${product.id}'">
                <div class="img-wrapper">
                    <img src="${product.image}" alt="${product.title}">
                    <span class="badge-category">${product.category}</span>
                </div>
                <div class="product-info">
                    <h5>${product.title}</h5>
                    <p class="price">${product.price} EGP</p>
                    <button class="btn btn-outline-success w-100 rounded-pill mt-auto">View Item</button>
                </div>
            </div>
        `;
    });
}

document.addEventListener("DOMContentLoaded", loadProductDetail);
