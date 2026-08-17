<?php

session_start();

require_once "../db.php";

// Make sure the user is logged in
if (!isset($_SESSION["user_id"])) {

    header("Location: login.php");
    exit();

}

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Get the logged-in user's ID
    $user_id = $_SESSION["user_id"];

    // Get data from the form
    $image_url = $_POST["image"];
    $title = $_POST["title"];
    $category = $_POST["category"];
    $price = $_POST["price"];
    $description = $_POST["description"];
    $size = $_POST["size"];
    $condition = $_POST["condition"];

    // Insert the post into the post table
    $sql = "INSERT INTO post
            (USER_ID, TITLE, CATEGORY, PRICE, SIZE, CONDITION_STATE, DESCRIPTION, IMAGE_URL)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

    // Prepare SQL
    $stmt = $conn->prepare($sql);

    // Connect the values to the ?
    $stmt->bind_param(
        "sdssssss",
        $user_id,
        $title,
        $category,
        $price,
        $size,
        $condition,
        $description,
        $image_url
    );

    // Execute SQL
    if ($stmt->execute()) {

        echo "Post created successfully!";

    } else {

        echo "ERROR: " . $stmt->error;

    }

    $stmt->close();
}

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sell an Item | ThriftHub</title>

    <!-- Bootstrap 5 -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Bootstrap Icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <!-- CSS -->
    <link rel="stylesheet" href="../css/style.css">
</head>
<body class="bg-light">

<!-- ================= NAVBAR ================= -->
<nav class="navbar navbar-expand-lg bg-white shadow-sm sticky-top mb-4">
    <div class="container">
        <!-- Logo -->
        <a class="navbar-brand text-success me-4" href="index.html">
            ThriftHub
        </a>

        <!-- Search -->
        <form class="d-none d-md-flex mx-auto w-50" onsubmit=" window.location.href='index.html?search=' + encodeURIComponent(this.querySelector('input').value);">
            <div class="input-group">
                <span class="input-group-text bg-white border-end-0">
                    <i class="bi bi-search text-muted"></i>
                </span>
                <input type="text" class="form-control border-start-0 ps-0" placeholder="Search clothes, brands, sellers...">
            </div>
        </form>

        <!-- Right Icons -->
        <div class="d-flex align-items-center gap-2 gap-sm-3 ms-auto">
            <a href="index.html" class="nav-icon-link" title="Home">
                <i class="bi bi-house-door"></i>
            </a>

            <a href="favorites.html" class="nav-icon-link" title="Favorites">
                <i class="bi bi-heart"></i>
                <span id="fav-count" class="badge rounded-pill bg-danger badge-counter">0</span>
            </a>

            <a href="cart.html" class="nav-icon-link" title="Cart">
                <i class="bi bi-cart3"></i>
                <span id="cart-count" class="badge rounded-pill bg-success badge-counter">0</span>
            </a>

            <a href="chat.html" class="nav-icon-link" title="Messages / DMs">
                <i class="bi bi-chat-dots"></i>
                <span id="dms-count" class="badge rounded-pill bg-primary badge-counter">2</span>
            </a>

            <a href="sell.html" class="btn btn-success btn-sell-nav d-none d-sm-inline-flex align-items-center gap-1 active">
                <i class="bi bi-plus-circle-fill"></i> Sell
            </a>

            <a href="profile.html" class="nav-icon-link" title="Profile">
                <i class="bi bi-person-circle"></i>
            </a>
        </div>
    </div>
</nav>

<!-- ================= SELL FORM CONTAINER ================= -->
<div class="container py-4">
    <div class="row justify-content-center">
        <div class="col-lg-8">
            <div class="bg-white p-4 p-md-5 rounded-4 shadow-sm">
                <div class="text-center mb-4">
                    <div class="d-inline-flex align-items-center justify-content-center bg-success-subtle text-success rounded-circle p-3 mb-2" style="width:64px; height:64px;">
                        <i class="bi bi-tag-fill fs-2"></i>
                    </div>
                    <h2 class="fw-bold m-0">List an Item for Sale</h2>
                    <p class="text-muted mt-1">Turn your pre-loved clothes into cash on ThriftHub</p>
                </div>

                <form id="sell-form" method="post" >
                    <!-- Title -->
                    <div class="mb-3">
                        <label class="form-label fw-semibold">Item Title *</label>
                        <input name= "title" type="text" id="sell-title" class="form-control form-control-lg rounded-3" placeholder="e.g. Vintage Nike Windbreaker Hoodie" required>
                    </div>

                    <!-- Category & Price -->
                    <div class="row g-3 mb-3">
                        <div class="col-md-6">
                            <label class="form-label fw-semibold">Category *</label>
                            <select name= "category" id="sell-category" class="form-select form-select-lg rounded-3" required>
                                <option value="" selected disabled>Select category</option>
                                <option value="Hoodies">Hoodies & Sweatshirts</option>
                                <option value="Sneakers">Sneakers & Shoes</option>
                                <option value="Watches">Watches & Accessories</option>
                                <option value="Jackets">Jackets & Coats</option>
                                <option value="T-Shirts">T-Shirts & Tops</option>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-semibold">Price (EGP) *</label>
                            <div class="input-group input-group-lg">
                                <input name="price"  type="number" id="sell-price" class="form-control rounded-start-3" placeholder="650" min="10" required>
                                <span class="input-group-text bg-light text-muted">EGP</span>
                            </div>
                        </div>
                    </div>

                    <!-- Size & Condition -->
                    <div class="row g-3 mb-3">
                        <div class="col-md-6">
                            <label class="form-label fw-semibold">Size *</label>
                            <select name="size" id="sell-size" class="form-select form-select-lg rounded-3" required>
                                <option value="M" selected>Medium (M)</option>
                                <option value="S">Small (S)</option>
                                <option value="L">Large (L)</option>
                                <option value="XL">Extra Large (XL)</option>
                                <option value="42">EU 42 (Shoes)</option>
                                <option value="One Size">One Size</option>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-semibold">Condition *</label>
                            <select  name="condition" id="sell-condition" class="form-select form-select-lg rounded-3" required>
                                <option value="New with tags">New with tags</option>
                                <option value="Like New" selected>Like New</option>
                                <option value="Excellent">Excellent</option>
                                <option value="Good">Good</option>
                            </select>
                        </div>
                    </div>

                    <!-- Image URL / File -->
                    <div class="mb-3">
                        <label class="form-label fw-semibold">Product Image URL / Select Image *</label>
                        <input name = "image"  type="text" id="sell-image" class="form-control form-control-lg rounded-3" placeholder="../images/products/product1.jfif or paste image URL" required>
                        <small class="text-muted">Tip: You can use local paths like <code>../images/products/product1.jfif</code> or any image URL.</small>
                    </div>

                    <!-- Image Preview -->
                    <div class="mb-4 text-center">
                        <div class="p-3 bg-light rounded-3 d-none" id="preview-box">
                            <label class="d-block text-muted small mb-2">Image Preview:</label>
                            <img id="image-preview" src="" class="img-fluid rounded-3" style="max-height: 220px; object-fit: contain;">
                        </div>
                    </div>

                    <!-- Description -->
                    <div class="mb-4">
                        <label class="form-label fw-semibold">Description *</label>
                        <textarea name= "description" id="sell-desc" class="form-control rounded-3" rows="4" placeholder="Describe the item, fit, fabric, any flaws, etc." required></textarea>
                    </div>

                    <!-- Submit -->
                    <div class="d-grid">
                        <button type="submit" class="btn btn-success btn-lg py-3 rounded-3 fw-bold fs-5 shadow-sm">
                            <i class="bi bi-check-circle-fill me-2"></i> Publish Listing Now
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<!-- Footer -->
<footer>
    <div class="container">
        <p class="mb-0">© 2026 <strong>ThriftHub</strong> - Sustainable Second-hand Fashion Marketplace.</p>
    </div>
</footer>

<!-- JS -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<script src="../js/app.js"></script>
<!-- <script src="../js/sell.js"></script> -->
</body>
</html>
