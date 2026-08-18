<?php
$localhost ="localhost";
$username="root";
$password = "";
$db="thrifthub";
$conn= new mysqli($localhost, $username, $password, $db );
if($conn->connect_error){
  echo "connecton failed";
} ?>