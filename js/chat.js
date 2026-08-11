// ==========================================
// CHAT & MESSAGING LOGIC (SELLER-ONLY OFFER APPROVAL)
// ==========================================

let chats = getChats();
let currentChat = chats[0];

// HTML Elements
const chatUsers = document.getElementById("chatUsers");
const messages = document.getElementById("messages");
const sellerName = document.getElementById("sellerName");
const sellerAvatar = document.getElementById("sellerAvatar");
const productName = document.getElementById("productName");
const input = document.getElementById("messageText");
const sendBtn = document.getElementById("sendBtn");

// Check URL Params for direct chat redirection
function checkUrlParams() {
    chats = getChats();
    const params = new URLSearchParams(window.location.search);
    const seller = params.get("seller");
    const product = params.get("product");

    if (seller && product) {
        let existingChat = chats.find(c => c.seller.toLowerCase() === seller.toLowerCase());

        if (!existingChat) {
            existingChat = {
                id: Date.now(),
                seller: seller,
                avatar: "../images/uesrs/user2.jfif",
                product: product,
                messages: [
                    { sender: "other", text: `Hi! Thanks for reaching out about ${product}.`, time: "Just now" }
                ]
            };
            chats.unshift(existingChat);
            saveChats(chats);
        }
        currentChat = existingChat;
    }
}

// Load Users List
function loadUsers() {
    chatUsers.innerHTML = "";
    chats.forEach(chat => {
        const isActive = chat.id === currentChat.id ? "active bg-success-subtle border-start border-4 border-success" : "";
        chatUsers.innerHTML += `
            <div class="user p-3 border-bottom cursor-pointer ${isActive}" onclick="openChat(${chat.id})">
                <img src="${chat.avatar}" style="width:44px; height:44px; border-radius:50%; object-fit:cover;">
                <div>
                    <h6 class="fw-bold m-0">${chat.seller}</h6>
                    <small class="text-muted d-block text-truncate" style="max-width:160px;">${chat.product}</small>
                </div>
            </div>
        `;
    });
}

function openChat(id) {
    chats = getChats();
    currentChat = chats.find(chat => chat.id === id) || chats[0];
    sellerName.innerText = currentChat.seller;
    sellerAvatar.src = currentChat.avatar;
    productName.innerText = currentChat.product;
    loadUsers();
    renderMessages();
}

function renderMessages() {
    messages.innerHTML = "";
    currentChat.messages.forEach(msg => {
        if (msg.type === "offer_request") {
            renderOfferRequestMessage(msg);
        } else {
            messages.innerHTML += `
                <div class="message ${msg.sender}">
                    ${msg.text}
                    <div class="time">${msg.time}</div>
                </div>
            `;
        }
    });
    messages.scrollTop = messages.scrollHeight;
}

function renderOfferRequestMessage(msg) {
    let statusBadge = "";
    let actionButtons = "";

    const isRecipientSeller = (msg.sender === "other"); // If message came from the other person, current user is SELLER

    if (msg.status === "pending") {
        if (isRecipientSeller) {
            // I am the SELLER receiving an offer request
            statusBadge = `<span class="badge bg-warning text-dark me-2"><i class="bi bi-bell-fill me-1"></i>New Offer Received</span>`;
            actionButtons = `
                <div class="d-flex gap-2 mt-3">
                    <button class="btn btn-success btn-sm flex-fill fw-bold rounded-pill" onclick="acceptOffer('${msg.id}')">
                        <i class="bi bi-check-circle-fill me-1"></i> Accept Offer
                    </button>
                    <button class="btn btn-outline-danger btn-sm flex-fill fw-bold rounded-pill" onclick="declineOffer('${msg.id}')">
                        <i class="bi bi-x-circle-fill me-1"></i> Decline
                    </button>
                </div>
            `;
        } else {
            // I am the BUYER who sent the offer request -> Waiting for seller response
            statusBadge = `<span class="badge bg-secondary text-white"><i class="bi bi-hourglass-split me-1"></i>Sent to Seller • Awaiting Review</span>`;
            actionButtons = `<p class="text-muted small mt-2 m-0 fst-italic">Waiting for seller ${currentChat.seller} to accept or decline...</p>`;
        }
    } else if (msg.status === "accepted") {
        statusBadge = `<span class="badge bg-success text-white"><i class="bi bi-check-circle-fill me-1"></i>Offer Accepted & Added to Cart</span>`;
    } else if (msg.status === "declined") {
        statusBadge = `<span class="badge bg-danger text-white"><i class="bi bi-x-circle-fill me-1"></i>Request Rejected by Seller</span>`;
    }

    messages.innerHTML += `
        <div class="message ${msg.sender} p-3 rounded-4 shadow-sm" style="max-width: 85%; width: 340px; background: #ffffff; color: #111827; border: 1px solid #e2e8f0;">
            <div class="d-flex align-items-center gap-3 mb-2">
                <img src="${msg.productImage || '../images/products/product1.jfif'}" class="rounded-3" style="width: 54px; height: 54px; object-fit: cover;">
                <div>
                    <h6 class="fw-bold m-0 text-truncate" style="max-width: 200px;">${msg.productTitle}</h6>
                    <small class="text-muted">Listed Price: ${msg.originalPrice} EGP</small>
                </div>
            </div>
            
            <div class="p-2 bg-light rounded-3 text-center mb-2">
                <span class="text-muted small">Proposed Offer Price:</span>
                <h4 class="text-success fw-bold m-0">${msg.offerPrice} EGP</h4>
            </div>

            <div class="d-flex justify-content-between align-items-center">
                ${statusBadge}
                <small class="text-muted">${msg.time}</small>
            </div>

            ${actionButtons}
        </div>
    `;
}

// Simulated Auto-Response when buyer sends an offer to a demo seller
function triggerSellerAutoReview(msgId) {
    setTimeout(() => {
        chats = getChats();
        const chat = chats.find(c => c.messages.some(m => m.id === msgId));
        if (!chat) return;

        const msg = chat.messages.find(m => m.id === msgId);
        if (!msg || msg.status !== "pending") return;

        // 80% chance seller accepts, 20% decline simulation
        const isAccepted = Math.random() > 0.2;
        const now = new Date();
        const time = now.getHours().toString().padStart(2, "0") + ":" + now.getMinutes().toString().padStart(2, "0");

        if (isAccepted) {
            msg.status = "accepted";
            const product = getProductById(msg.productId) || {
                id: msg.productId,
                title: msg.productTitle,
                image: msg.productImage,
                price: msg.originalPrice,
                seller: chat.seller
            };
            addToCart(product, 1, msg.offerPrice);

            chat.messages.push({
                sender: "other",
                text: `🎉 Offer accepted! I accepted your offer of ${msg.offerPrice} EGP for "${msg.productTitle}". It has been added to your cart!`,
                time: time
            });
        } else {
            msg.status = "declined";
            chat.messages.push({
                sender: "other",
                text: `❌ Request rejected. Sorry, I cannot accept ${msg.offerPrice} EGP for "${msg.productTitle}".`,
                time: time
            });
        }

        saveChats(chats);
        updateBadges();
        if (currentChat && currentChat.id === chat.id) {
            renderMessages();
        }
    }, 2500);
}

// Seller manually accepts offer
function acceptOffer(msgId) {
    const msg = currentChat.messages.find(m => m.id === msgId);
    if (!msg) return;

    msg.status = "accepted";

    const product = getProductById(msg.productId) || {
        id: msg.productId,
        title: msg.productTitle,
        image: msg.productImage,
        price: msg.originalPrice,
        seller: currentChat.seller
    };

    addToCart(product, 1, msg.offerPrice);

    const now = new Date();
    const time = now.getHours().toString().padStart(2, "0") + ":" + now.getMinutes().toString().padStart(2, "0");

    currentChat.messages.push({
        sender: "me",
        text: `🎉 Offer accepted! "${msg.productTitle}" at ${msg.offerPrice} EGP has been added to the buyer's cart.`,
        time: time
    });

    saveChats(chats);
    updateBadges();
    renderMessages();
}

// Seller manually declines offer
function declineOffer(msgId) {
    const msg = currentChat.messages.find(m => m.id === msgId);
    if (!msg) return;

    msg.status = "declined";

    const now = new Date();
    const time = now.getHours().toString().padStart(2, "0") + ":" + now.getMinutes().toString().padStart(2, "0");

    currentChat.messages.push({
        sender: "me",
        text: `❌ Request rejected. You declined the offer of ${msg.offerPrice} EGP for "${msg.productTitle}".`,
        time: time
    });

    saveChats(chats);
    renderMessages();
}

function sendMessage() {
    const text = input.value.trim();
    if (text === "") return;

    const now = new Date();
    const time = now.getHours().toString().padStart(2, "0") + ":" + now.getMinutes().toString().padStart(2, "0");

    currentChat.messages.push({
        sender: "me",
        text: text,
        time: time
    });

    saveChats(chats);
    input.value = "";
    renderMessages();
}

// Helper to trigger seller auto review after buyer sends offer request
window.sendOfferRequestToSellerWithReview = function(product, offerPrice) {
    const thread = sendOfferRequestToSeller(product, offerPrice);
    const lastMsg = thread.messages[thread.messages.length - 1];
    if (lastMsg && lastMsg.type === "offer_request") {
        triggerSellerAutoReview(lastMsg.id);
    }
    return thread;
};

document.addEventListener("DOMContentLoaded", () => {
    checkUrlParams();
    loadUsers();
    openChat(currentChat.id);
});