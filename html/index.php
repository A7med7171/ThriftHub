<?php

use LDAP\Result;

session_start(); 
if (!isset($_SESSION["user_id"])) {
    header("Location: login.php");
    exit();
}
require_once "../db.php";
$user_id = $_SESSION["user_id"]; 
$sql = "SELECT * FROM post WHERE USER_ID <> ?  Order by CREATED_AT desc  ";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

// echo "<pre>";
// print_r($result->fetch_all(MYSQLI_ASSOC));
// echo "</pre>";
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ThriftHub | Sustainable Second-hand Marketplace</title>

    <!-- Bootstrap 5 -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Bootstrap Icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <!-- CSS -->
    <link rel="stylesheet" href="../css/style.css">
</head>

<body>

<!-- ================= NAVBAR ================= -->
<nav class="navbar navbar-expand-lg bg-white shadow-sm sticky-top mb-4">
    <div class="container">
        <!-- Logo -->
        <a class="navbar-brand text-success me-4" href="index.php">
            ThriftHub
        </a>

        <!-- Live Search Bar -->
        <form class="d-flex mx-auto w-50" onsubmit="event.preventDefault();">
            <div class="input-group">
                <span class="input-group-text bg-white border-end-0">
                    <i class="bi bi-search text-muted"></i>
                </span>
                <input id="searchInput" type="text" class="form-control border-start-0 ps-0" placeholder="Search clothes, brands, sellers...">
            </div>
        </form>

        <!-- Right Navigation Icons -->
        <div class="d-flex align-items-center gap-2 gap-sm-3 ms-auto">
            <a href="index.php" class="nav-icon-link text-success" title="Home">
                <i class="bi bi-house-door-fill"></i>
            </a>

            <a href="favorites.php" class="nav-icon-link" title="Favorites">
                <i class="bi bi-heart"></i>
                <span id="fav-count" class="badge rounded-pill bg-danger badge-counter">0</span>
            </a>

            <a href="cart.php" class="nav-icon-link" title="Cart">
                <i class="bi bi-cart3"></i>
                <span id="cart-count" class="badge rounded-pill bg-success badge-counter">0</span>
            </a>

            <a href="chat.php" class="nav-icon-link" title="Messages / DMs">
                <i class="bi bi-chat-dots"></i>
                <span id="dms-count" class="badge rounded-pill bg-primary badge-counter">2</span>
            </a>

            <a href="sell.php" class="btn btn-success btn-sell-nav d-none d-sm-inline-flex align-items-center gap-1">
                <i class="bi bi-plus-circle-fill"></i> Sell
            </a>

            <a href="profile.php" class="nav-icon-link" title="Profile">
                <i class="bi bi-person-circle"></i>
            </a>
        </div>
    </div>
</nav>

<!-- ================= HERO CAROUSEL ================= -->
<div class="container mb-4">
    <div id="carouselExampleControls" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-inner rounded-4 overflow-hidden shadow-sm">
            <div class="carousel-item active">
                <img src="../images/products/ha.png" class="d-block w-100" alt="Banner 1">
            </div>
            <div class="carousel-item">
                <img src="../images/products/chatgpt.png" class="d-block w-100" alt="Banner 2">
            </div>
            <div class="carousel-item">
                <img src="../images/products/chatgpt2.png" class="d-block w-100" alt="Banner 3">
            </div>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
        </button>
    </div>
</div>

<!-- ================= CATEGORY FILTERS ================= -->
<div class="container mb-3">
    <div class="d-flex align-items-center justify-content-between mb-2">
        <h5 class="fw-bold m-0"><i class="bi bi-funnel text-success me-1"></i> Browse Categories</h5>
        <button class="btn btn-sm btn-outline-success rounded-pill px-3" onclick="startOnboarding(true)">
            <i class="bi bi-stars me-1"></i> Website Intro Guide
        </button>
    </div>
    <div class="categories-container" id="categoriesContainer">
        <button class="cat-btn active" data-category="All">All Items</button>
        <button class="cat-btn" data-category="Hoodies">Hoodies</button>
        <button class="cat-btn" data-category="Sneakers">Sneakers</button>
        <button class="cat-btn" data-category="Watches">Watches</button>
        <button class="cat-btn" data-category="Jackets">Jackets</button>
        <button class="cat-btn" data-category="T-Shirts">T-Shirts</button>
    </div>
</div>

<!-- ================= FEED SECTION ================= -->
<section class="container pt-0">
    <div class="d-flex justify-content-between align-items-center mb-3">
        <h2 class="fw-bold m-0">Latest Products</h2>
        <span class="text-muted small" id="productCountLabel">Showing all products</span>
    </div>

    <!-- Grid Container -->
    <div id="feed" class="products-grid">
           <?php if ($result->num_rows > 0): ?>

        <?php
        //  while ($post = $result->fetch_assoc()): 
            foreach($result->fetch_all(MYSQLI_ASSOC) as $post):
            ?>

            <div class="product-card">

                <div class="img-wrapper">

                    <img
                        src="<?php echo htmlspecialchars($post["IMAGE_URL"]); ?>"
                        alt="<?php echo htmlspecialchars($post["TITLE"]); ?>"
                    >

                    <span class="badge-category">
                        <?php echo htmlspecialchars($post["CATEGORY"]); ?>
                    </span>

                </div>

                <div class="product-info">

                    <h5>
                        <?php echo htmlspecialchars($post["TITLE"]); ?>
                    </h5>

                    <p class="price">
                        <?php echo htmlspecialchars($post["PRICE"]); ?> EGP
                    </p>

                    <button class="btn btn-outline-success w-100 rounded-pill mt-auto">
                        View Item
                    </button>

                </div>

            </div>

        <?php
        endforeach;
        //  endwhile;
         ?>

    <?php else: ?>

        <p class="text-muted">
            no new posts 
        </p>

    <?php endif; ?>

</div>
</div>
    
</section>

<!-- ================= COOL WELCOME ONBOARDING MODAL ================= -->
<div class="modal fade" id="onboardingModal" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false">
    <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content onboarding-card border-0 p-3 p-md-4 text-center">
            
            <div class="d-flex justify-content-between align-items-center mb-3 px-2">
                <span class="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-3 py-2 fw-bold">
                    ✨ Welcome to ThriftHub
                </span>
                <button type="button" class="btn-close" data-bs-dismiss="modal" onclick="finishOnboarding()"></button>
            </div>

            <!-- Dynamic Slide Content Area -->
            <div id="onboardingSlideArea" class="py-2">
                <!-- Injected via js/home.js -->
            </div>

            <!-- Dots & Navigation -->
            <div class="d-flex align-items-center justify-content-between mt-4 px-2 pt-3 border-top">
                <div class="d-flex gap-2 align-items-center" id="onboardingDots">
                    <span class="onboarding-step-dot active" onclick="goToOnboardingStep(0)"></span>
                    <span class="onboarding-step-dot" onclick="goToOnboardingStep(1)"></span>
                    <span class="onboarding-step-dot" onclick="goToOnboardingStep(2)"></span>
                    <span class="onboarding-step-dot" onclick="goToOnboardingStep(3)"></span>
                </div>

                <div class="d-flex gap-2">
                    <button id="onboardingPrevBtn" class="btn btn-light rounded-pill px-4 fw-semibold" onclick="prevOnboardingStep()" disabled>
                        Back
                    </button>
                    <button id="onboardingNextBtn" class="btn btn-success rounded-pill px-4 fw-bold shadow-sm" onclick="nextOnboardingStep()">
                        Next <i class="bi bi-arrow-right ms-1"></i>
                    </button>
                </div>
            </div>

        </div>
    </div>
</div>

<!-- ================= COMMENTS BOTTOM SHEET / MODAL ================= -->
<div class="overlay-sheet" id="overlaySheet" onclick="closeCommentsSheet()"></div>

<div class="comments-sheet" id="commentsSheet">
    <div class="comments-header">
        <h5 class="fw-bold m-0"><i class="bi bi-chat-left-text text-success me-2"></i>Comments & Questions</h5>
        <button class="btn-close" onclick="closeCommentsSheet()"></button>
    </div>
    <div class="comments-list" id="sheetCommentsList">
        <!-- Dynamic comments rendered here -->
    </div>
    <form class="comment-input-box" id="sheetCommentForm" onsubmit="handleSheetCommentSubmit(event)">
        <input type="text" id="sheetCommentInput" class="form-control rounded-pill" placeholder="Write a comment..." required>
        <button type="submit" class="btn btn-success rounded-pill px-4 fw-semibold">
            Post
        </button>
    </form>
</div>

<!-- ================= OFFER MODAL ================= -->
<div class="modal fade" id="offerModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 rounded-4 shadow-lg">
            <div class="modal-header border-0 pb-0">
                <h4 class="modal-title fw-bold">Make an Offer</h4>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body p-4 text-center">
                <img id="offerImage" class="img-fluid rounded-3 mb-3" style="max-height: 180px; object-fit: contain;">
                <h5 id="offerTitle" class="fw-bold"></h5>
                <p class="text-muted mb-1">Listed Price</p>
                <h3 class="text-success fw-bold mb-3" id="originalPrice">650 EGP</h3>
                <hr>
                <label class="fw-bold mb-2">Select Your Offer Price</label>
                <input type="range" id="offerSlider" class="form-range px-3">
                <h2 class="text-center text-primary fw-bold my-3" id="offerValue">650 EGP</h2>
                <hr>
                <div class="d-grid gap-2">
                    <button id="buyNowBtn" class="btn btn-success btn-lg rounded-3 fw-bold">
                        🛒 Buy at Full Price
                    </button>
                    <button id="sendOfferBtn" class="btn btn-warning btn-lg rounded-3 fw-bold text-dark">
                        💰 Send Offer to Seller
                    </button>
                    <button id="chatSellerBtn" class="btn btn-outline-dark btn-lg rounded-3 fw-bold">
                        💬 Chat with Seller
                    </button>
                </div>
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

<!-- Bootstrap & App JS -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<!-- <script src="../js/app.js"></script> -->
<!-- <script src="../js/home.js"></script> -->
</body>
</html>