// ==========================================
// HOME PAGE & FEED LOGIC WITH COMMENT REPLIES & TOASTS
// ==========================================

let activeCategory = "All";
let activeSearchQuery = "";
let currentCommentProductId = null;
let activeReplyCommentId = null;

// ==========================================
// ONBOARDING INTRO SLIDES DATA
// ==========================================
const ONBOARDING_SLIDES = [
    {
        icon: "bi-rocket-takeoff-fill",
        iconColor: "#198754",
        bgColor: "#e8f5e9",
        title: "Welcome to ThriftHub! 🚀",
        subtitle: "Egypt's #1 Sustainable Fashion Marketplace",
        description: "Discover pre-loved vintage hoodies, luxury watches, sneakers, jackets, and unique streetwear at unbeatable prices!"
    },
    {
        icon: "bi-piggy-bank-fill",
        iconColor: "#f59e0b",
        bgColor: "#fef3c7",
        title: "Smart Offer System 💰",
        subtitle: "Don't Like the Listed Price? Negotiate!",
        description: "Submit custom offers directly to sellers. Sellers review and approve your offers in real time through direct chat!"
    },
    {
        icon: "bi-chat-dots-fill",
        iconColor: "#2563eb",
        bgColor: "#dbeafe",
        title: "Direct Seller Chat 💬",
        subtitle: "Instant Messages & Questions",
        description: "Have questions about fit or condition? Message sellers directly, negotiate prices, and check items before you buy."
    },
    {
        icon: "bi-box-seam-fill",
        iconColor: "#8b5cf6",
        bgColor: "#f3e8ff",
        title: "Track Orders Step-by-Step 📦",
        subtitle: "Fast & Reliable Doorstep Delivery",
        description: "Track your shipment live from Pending to Accepted, Shipping, and Delivered. Plus list your own items for sale in seconds!"
    }
];

let currentOnboardingStep = 0;
let onboardingModalInstance = null;

function startOnboarding(forceShow = false) {
    const showFlag = localStorage.getItem("showOnboarding");
    const hasSeen = localStorage.getItem("hasSeenOnboarding");

    if (forceShow || showFlag === "true" || !hasSeen) {
        currentOnboardingStep = 0;
        renderOnboardingStep(0);
        
        const modalEl = document.getElementById("onboardingModal");
        if (modalEl) {
            onboardingModalInstance = new bootstrap.Modal(modalEl);
            onboardingModalInstance.show();
            localStorage.setItem("showOnboarding", "false");
            localStorage.setItem("hasSeenOnboarding", "true");
        }
    }
}

function renderOnboardingStep(stepIndex) {
    currentOnboardingStep = stepIndex;
    const slide = ONBOARDING_SLIDES[stepIndex];
    const slideArea = document.getElementById("onboardingSlideArea");

    if (!slideArea) return;

    slideArea.innerHTML = `
        <div class="onboarding-icon-circle mx-auto" style="background-color: ${slide.bgColor}; color: ${slide.iconColor};">
            <i class="bi ${slide.icon} display-4"></i>
        </div>
        <h3 class="fw-bold mb-2">${slide.title}</h3>
        <h6 class="text-success fw-semibold mb-3">${slide.subtitle}</h6>
        <p class="text-muted max-w-md mx-auto fs-5 px-3" style="line-height: 1.6;">
            ${slide.description}
        </p>
    `;

    // Update Dots
    const dots = document.querySelectorAll(".onboarding-step-dot");
    dots.forEach((dot, idx) => {
        dot.classList.toggle("active", idx === stepIndex);
    });

    // Update Nav Buttons
    const prevBtn = document.getElementById("onboardingPrevBtn");
    const nextBtn = document.getElementById("onboardingNextBtn");

    if (prevBtn) prevBtn.disabled = stepIndex === 0;
    if (nextBtn) {
        if (stepIndex === ONBOARDING_SLIDES.length - 1) {
            nextBtn.className = "btn btn-success rounded-pill px-4 fw-bold shadow-sm";
            nextBtn.innerHTML = `Get Started 🚀`;
        } else {
            nextBtn.className = "btn btn-success rounded-pill px-4 fw-bold shadow-sm";
            nextBtn.innerHTML = `Next <i class="bi bi-arrow-right ms-1"></i>`;
        }
    }
}

function nextOnboardingStep() {
    if (currentOnboardingStep < ONBOARDING_SLIDES.length - 1) {
        renderOnboardingStep(currentOnboardingStep + 1);
    } else {
        finishOnboarding();
    }
}

function prevOnboardingStep() {
    if (currentOnboardingStep > 0) {
        renderOnboardingStep(currentOnboardingStep - 1);
    }
}

function goToOnboardingStep(stepIndex) {
    renderOnboardingStep(stepIndex);
}

function finishOnboarding() {
    if (onboardingModalInstance) {
        onboardingModalInstance.hide();
    }
}

// ==========================================
// FEED RENDERER
// ==========================================
function renderFeed() {
    const container = document.getElementById("feed");
    const label = document.getElementById("productCountLabel");
    const allProducts = getProducts();
    const favorites = getFavorites();

    let filtered = allProducts.filter(product => {
        const matchesCategory = activeCategory === "All" || product.category.toLowerCase() === activeCategory.toLowerCase();
        const matchesSearch = !activeSearchQuery ||
            product.title.toLowerCase().includes(activeSearchQuery.toLowerCase()) ||
            product.category.toLowerCase().includes(activeSearchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (label) {
        label.innerText = `Showing ${filtered.length} of ${allProducts.length} items`;
    }

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="text-center py-5 col-12 bg-white rounded-4 shadow-sm p-4">
                <i class="bi bi-search text-muted display-3"></i>
                <h4 class="fw-bold mt-3">No products found</h4>
                <p class="text-muted">Try tweaking your search term or category filters.</p>
                <button class="btn btn-outline-success rounded-pill px-4" onclick="resetFilters()">Reset Filters</button>
            </div>
        `;
        return;
    }

    container.innerHTML = "";

    filtered.forEach(product => {
        const isLiked = favorites.includes(product.id);
        const comments = getComments(product.id);
        const heartClass = isLiked ? "bi-heart-fill text-danger" : "bi-heart text-secondary";

        container.innerHTML += `
            <div class="product-card">
                <div class="img-wrapper" onclick="window.location.href='product.html?id=${product.id}'">
                    <img src="${product.image}" alt="${product.title}">
                    <span class="badge-category">${product.category}</span>
                </div>

                <div class="product-info">
                    <h5 onclick="window.location.href='product.html?id=${product.id}'" title="${product.title}">${product.title}</h5>
                    <p class="price">${product.price} EGP</p>

                    <div class="action-icons">
                        <button class="action-icon-btn ${isLiked ? 'liked' : ''}" onclick="handleLikeClick(event, ${product.id})">
                            <i class="bi ${heartClass}"></i> <span>${product.likes || 0}</span>
                        </button>

                        <button class="action-icon-btn" onclick="openCommentsSheet(${product.id})">
                            <i class="bi bi-chat-left-text text-primary"></i> <span>${comments.length}</span>
                        </button>

                        <button class="action-icon-btn" onclick="handleShareClick(event, ${product.id})">
                            <i class="bi bi-share text-dark"></i>
                        </button>
                    </div>

                    <button class="btn btn-success add-cart mt-auto fw-bold" onclick="openOffer(${product.id})">
                        <i class="bi bi-tag-fill me-1"></i> Make Offer / Buy
                    </button>
                </div>
            </div>
        `;
    });
}

function resetFilters() {
    activeCategory = "All";
    activeSearchQuery = "";
    const searchInput = document.getElementById("searchInput");
    if (searchInput) searchInput.value = "";
    document.querySelectorAll(".cat-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.category === "All");
    });
    renderFeed();
}

// Like Button Toggle
function handleLikeClick(event, productId) {
    event.stopPropagation();
    const liked = toggleFavorite(productId);
    showToast(liked ? "Saved to your Favorites ❤️" : "Removed from Favorites", liked ? "success" : "info");
    renderFeed();
}

// Share Button
function handleShareClick(event, productId) {
    event.stopPropagation();
    const product = getProductById(productId);
    const link = `${window.location.origin}/html/product.html?id=${productId}`;
    navigator.clipboard.writeText(link);
    showToast(`🔗 Link for "${product.title}" copied to clipboard!`, "success");
}

// Comments Sheet Modal with Reply Support
function openCommentsSheet(productId) {
    currentCommentProductId = productId;
    activeReplyCommentId = null;
    const overlay = document.getElementById("overlaySheet");
    const sheet = document.getElementById("commentsSheet");

    const comments = getComments(productId);
    renderSheetCommentsList(comments);

    overlay.classList.add("active");
    sheet.classList.add("active");
}

function closeCommentsSheet() {
    document.getElementById("overlaySheet").classList.remove("active");
    document.getElementById("commentsSheet").classList.remove("active");
    currentCommentProductId = null;
    activeReplyCommentId = null;
}

function renderSheetCommentsList(comments) {
    const commentsList = document.getElementById("sheetCommentsList");
    if (comments.length === 0) {
        commentsList.innerHTML = `<p class="text-muted text-center py-4">No comments yet. Start the conversation!</p>`;
        return;
    }

    commentsList.innerHTML = "";
    comments.forEach(c => {
        let repliesHtml = "";
        if (c.replies && c.replies.length > 0) {
            c.replies.forEach(r => {
                repliesHtml += `
                    <div class="d-flex gap-2 mt-2 pt-2 border-top ms-4 ps-2 border-start border-3 border-success">
                        <img src="${r.avatar || '../images/uesrs/user1.jfif'}" style="width:28px; height:28px; border-radius:50%; object-fit:cover;">
                        <div class="comment-bubble bg-light py-1 px-3">
                            <h6 class="m-0 text-success" style="font-size:12px;">${r.user} <span class="text-muted font-normal ms-2" style="font-size:11px;">${r.time}</span></h6>
                            <p class="m-0" style="font-size:13px;">${r.text}</p>
                        </div>
                    </div>
                `;
            });
        }

        commentsList.innerHTML += `
            <div class="comment-item flex-column mb-3">
                <div class="d-flex gap-2 align-items-start">
                    <img src="${c.avatar || '../images/uesrs/user1.jfif'}">
                    <div class="comment-bubble flex-grow-1">
                        <div class="d-flex justify-content-between align-items-center mb-1">
                            <h6>${c.user} <span class="text-muted font-normal ms-2 small">${c.time}</span></h6>
                            <button class="btn btn-link btn-sm p-0 text-success text-decoration-none fw-semibold" onclick="setupReplyToComment(${c.id}, '${c.user}')">
                                <i class="bi bi-reply-fill me-1"></i>Reply
                            </button>
                        </div>
                        <p>${c.text}</p>
                    </div>
                </div>
                ${repliesHtml}
            </div>
        `;
    });
    commentsList.scrollTop = commentsList.scrollHeight;
}

function setupReplyToComment(commentId, username) {
    activeReplyCommentId = commentId;
    const input = document.getElementById("sheetCommentInput");
    input.placeholder = `Replying to @${username}...`;
    input.focus();
}

function handleSheetCommentSubmit(event) {
    event.preventDefault();
    const input = document.getElementById("sheetCommentInput");
    const text = input.value.trim();
    if (!text || !currentCommentProductId) return;

    let updatedComments;
    if (activeReplyCommentId) {
        updatedComments = addCommentReply(currentCommentProductId, activeReplyCommentId, "You", "../images/uesrs/user1.jfif", text);
        activeReplyCommentId = null;
        input.placeholder = "Write a comment...";
    } else {
        updatedComments = addComment(currentCommentProductId, "You", "../images/uesrs/user1.jfif", text);
    }

    input.value = "";
    renderSheetCommentsList(updatedComments);
    renderFeed();
}

// Offer Modal Logic
function openOffer(id) {
    const product = getProductById(id);
    if (!product) return;

    document.getElementById("offerImage").src = product.image;
    document.getElementById("offerTitle").innerText = product.title;
    document.getElementById("originalPrice").innerText = `${product.price} EGP`;

    const slider = document.getElementById("offerSlider");
    const minPrice = Math.floor(product.price * 0.7);
    slider.min = minPrice;
    slider.max = product.price;
    slider.value = product.price;

    document.getElementById("offerValue").innerText = `${slider.value} EGP`;

    slider.oninput = function () {
        document.getElementById("offerValue").innerText = `${this.value} EGP`;
    };

    document.getElementById("buyNowBtn").onclick = () => {
        if (window.sendOfferRequestToSellerWithReview) {
            window.sendOfferRequestToSellerWithReview(product, product.price);
        } else {
            sendOfferRequestToSeller(product, product.price);
        }
        bootstrap.Modal.getInstance(document.getElementById("offerModal")).hide();
        window.location.href = `chat.html?seller=${encodeURIComponent(product.seller || "Ahmed Ali")}&product=${encodeURIComponent(product.title)}`;
    };

    document.getElementById("sendOfferBtn").onclick = () => {
        const offerPrice = slider.value;
        if (window.sendOfferRequestToSellerWithReview) {
            window.sendOfferRequestToSellerWithReview(product, offerPrice);
        } else {
            sendOfferRequestToSeller(product, offerPrice);
        }
        bootstrap.Modal.getInstance(document.getElementById("offerModal")).hide();
        window.location.href = `chat.html?seller=${encodeURIComponent(product.seller || "Ahmed Ali")}&product=${encodeURIComponent(product.title)}`;
    };

    document.getElementById("chatSellerBtn").onclick = () => {
        bootstrap.Modal.getInstance(document.getElementById("offerModal")).hide();
        window.location.href = `chat.html?seller=${encodeURIComponent(product.seller || "Ahmed Ali")}&product=${encodeURIComponent(product.title)}`;
    };

    const modal = new bootstrap.Modal(document.getElementById("offerModal"));
    modal.show();
}

// Initialization & Event Listeners
document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        const params = new URLSearchParams(window.location.search);
        const searchParam = params.get("search");
        if (searchParam) {
            searchInput.value = searchParam;
            activeSearchQuery = searchParam;
        }

        searchInput.addEventListener("input", (e) => {
            activeSearchQuery = e.target.value.trim();
            renderFeed();
        });
    }

    const catBtns = document.querySelectorAll(".cat-btn");
    catBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            catBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            activeCategory = btn.dataset.category || "All";
            renderFeed();
        });
    });

    renderFeed();
    startOnboarding();
});
