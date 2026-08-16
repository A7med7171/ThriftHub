<?php
$localhost ="localhost";
$username="root";
$password = "";
$db="trifthub";
$conn= new mysqli($localhost, $username, $password, $db );
if($conn->connect_error){
  echo "connecton failed";
} ?>