<?php
    define("SERVER", 'localhost');
    define("USER", 'root');
    define("PASSWORD", '');
    define("DB", 'celteck_wireless');

    $conn = new mysqli(SERVER, USER, PASSWORD, DB);
    if (!$conn)
        die('Failed to connect to database'. $conn->connect_error);