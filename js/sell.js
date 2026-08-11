// ==========================================
// SELL ITEM PAGE LOGIC WITH TOASTS
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    const imageInput = document.getElementById("sell-image");
    const previewBox = document.getElementById("preview-box");
    const imagePreview = document.getElementById("image-preview");
    const sellForm = document.getElementById("sell-form");

    // Live preview
    imageInput.addEventListener("input", () => {
        const val = imageInput.value.trim();
        if (val) {
            imagePreview.src = val;
            previewBox.classList.remove("d-none");
        } else {
            previewBox.classList.add("d-none");
        }
    });

    // Form submission
    sellForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const title = document.getElementById("sell-title").value.trim();
        const price = parseFloat(document.getElementById("sell-price").value);
        const category = document.getElementById("sell-category").value;
        const size = document.getElementById("sell-size").value;
        const condition = document.getElementById("sell-condition").value;
        const image = document.getElementById("sell-image").value.trim() || "../images/products/product1.jfif";
        const description = document.getElementById("sell-desc").value.trim();

        const products = getProducts();
        const newProduct = {
            id: Date.now(),
            image: image,
            title: title,
            price: price,
            likes: 0,
            category: category,
            seller: "Ahmed Ali",
            sellerAvatar: "../images/uesrs/user1.jfif",
            condition: condition,
            size: size,
            description: description
        };

        products.unshift(newProduct);
        saveProducts(products);

        showToast(`🎉 Success! Your item "${title}" has been published!`, "success");
        setTimeout(() => {
            window.location.href = "index.html";
        }, 1200);
    });
});
