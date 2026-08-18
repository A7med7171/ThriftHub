<?php

session_start();

require_once "../db.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $email = $_POST["email"];
    $password = $_POST["password"];

    // Find the user by email
    $sql = "SELECT `id`, `username`, `email`, `password` AS password
            FROM user
            WHERE email = ?";

    $stmt = $conn->prepare($sql);

    $stmt->bind_param("s", $email);

    $stmt->execute();

    $result = $stmt->get_result();

    // Check if user exists
    if ($result->num_rows == 1) {

        $user = $result->fetch_assoc();

        // Check the password
        if (password_verify($password, $user["password"])) {

            // Create session
            $_SESSION["user_id"] = $user["id"];
            $_SESSION["username"] = $user["username"];
            $_SESSION["email"] = $user["email"];

            // Login successful
            header("Location: index.php");
            exit();

        } else {

            echo "Wrong password!";

        }

    } else {

        echo "User not found!";

    }

    $stmt->close();
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login | ThriftHub</title>

    <!-- Bootstrap 5 -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Bootstrap Icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <!-- CSS -->
    <link rel="stylesheet" href="../css/style.css">
</head>
<body class="bg-light d-flex flex-column min-vh-100 justify-content-center">

<div class="container py-5">
    <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
            <div class="bg-white p-4 p-sm-5 rounded-4 shadow-sm text-center">
                <a href="index.php" class="navbar-brand text-success fs-2 fw-bold d-block mb-3">
                    ThriftHub
                </a>
                <h4 class="fw-bold mb-1">Welcome Back!</h4>
                <p class="text-muted small mb-4">Sign in to buy and sell second-hand fashion</p>

                <form method="POST">
                    <div class="form-floating mb-3 text-start">
                        <input name = "email" type="email" class="form-control rounded-3" id="emailInput" placeholder="name@example.com" value="ahmed@thrifthub.com" required>
                        <label for="emailInput">Email address</label>
                    </div>

                    <div class="form-floating mb-3 text-start">
                        <input name = "password" type="password" class="form-control rounded-3" id="passwordInput" placeholder="Password" value="password123" required>
                        <label for="passwordInput">Password</label>
                    </div>

                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <div class="form-check text-start">
                            <input class="form-check-input" type="checkbox" id="rememberMe" checked>
                            <label class="form-check-label small" for="rememberMe">Remember me</label>
                        </div>
                        <a href="#" class="text-success small fw-semibold">Forgot password?</a>
                    </div>

                    <button type="submit" class="btn btn-success btn-lg w-100 rounded-3 fw-bold mb-3 shadow-sm">
                        Sign In
                    </button>
                </form>

                <p class="text-muted small">
                    Don't have an account? <a href="register.php" class="text-success fw-bold">Create an Account</a>
                </p>
            </div>
        </div>
    </div>
</div>

<script src="../js/app.js"></script>
</body>
</html>
