<?php
    error_reporting(E_ALL & ~E_NOTICE);
    date_default_timezone_set('Europe/Moscow');
    
    header('Content-Type: application/json');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Allow-Credentials: true');

    $destiation_dir = 'user_uploads/'. $_FILES['file']['name'];

    $tmp_name = $_FILES['file']['tmp_name'];

    $result = move_uploaded_file($tmp_name, $destiation_dir) ? 'uploaded compleate' : 'uploaded failed';

    echo $result ? 'OK' : "FAILED";