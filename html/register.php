<?php
require_once "../db.php";
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $username = $_POST["name"];
    $email = $_POST["useremail"];
    $telephone = $_POST["telephone"];
    $birthdate = $_POST["birthdate"];
    $password = password_hash($_POST["password"], PASSWORD_DEFAULT);



    $sql = "INSERT INTO `user` (`username`,`email`,`telephone`,`password`,`birthdate`)
        VALUES (?, ?, ?,?,?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param(
    "sssss",
    $username,
    $email,
    $telephone,
    $password,
    $birthdate

);

$sql = "SELECT * FROM `user` WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);

if ($stmt->execute()) {
    $result = $stmt->get_result();
    // $user = mysqli_fetch_all($result , MYSQLI_ASSOC);
    $user = $result->fetch_assoc();
    echo "<pre>";
    print_r($user);
    echo "</pre>";

    // $count = mysqli_num_rows($result);

    // if ($count > 0) {
    //     echo "Email already exists!";
    // } else {
    //     echo "Registration successful!";
    // }
} else {
    echo "ERROR: " . $stmt->error;
}


}

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Create Account | ThriftHub</title>

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
                <a href="index.html" class="navbar-brand text-success fs-2 fw-bold d-block mb-3">
                    ThriftHub
                </a>
                <h4 class="fw-bold mb-1">Create an Account</h4>
                <p class="text-muted small mb-4">Join Egypt's favorite thrift community</p>

                <form id="registerForm" method="POST">
                    <div class="form-floating mb-3 text-start">
                        <input name="name" type="text" class="form-control rounded-3" id="nameInput" placeholder="Full Name"  required>
                        <label for="nameInput">Full Name</label>
                    </div>

                    <div class="form-floating mb-3 text-start">
                        <input name="useremail" type="email" class="form-control rounded-3" id="emailInput" placeholder="name@example.com" value="ahmed@thrifthub.com" required>
                        <label for="emailInput">Email address</label>
                    </div>
                    <div class="form-floating mb-3 text-start">
    <input type="text"
           class="form-control rounded-3"
           id="telephoneInput"
           name="telephone"
           placeholder="Telephone"
           required>

    <label for="telephoneInput">Telephone</label>
</div>

<div class="form-floating mb-3 text-start">
    <input type="date"
           class="form-control rounded-3"
           id="birthdateInput"
           name="birthdate"
           required>

    <label for="birthdateInput">Birthdate</label>
</div>

                    <div class="form-floating mb-3 text-start">
                        <input name="password" type="password" class="form-control rounded-3" id="passwordInput" placeholder="Password" required value="12345678">
                        <label for="passwordInput">Create Password</label>
                    </div>

                    <div class="form-check text-start mb-4">
                        <input class="form-check-input" type="checkbox" id="termsCheck" required checked>
                        <label class="form-check-label small" for="termsCheck">
                            I agree to the <a href="#" class="text-success">Terms of Service</a> and <a href="#" class="text-success">Privacy Policy</a>
                        </label>
                    </div>

                    <button type="submit" class="btn btn-success btn-lg w-100 rounded-3 fw-bold mb-3 shadow-sm">
                        Create Account & Start
                    </button>
                </form>

                <p class="text-muted small">
                    Already have an account? <a href="login.php" class="text-success fw-bold">Sign In</a>
                </p>
            </div>
        </div>
    </div>
</div>

<script src="../js/app.js"></script>

</body>
</html>
