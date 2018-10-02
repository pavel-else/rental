<?php
    error_reporting(E_ALL & ~E_NOTICE);
    date_default_timezone_set('Europe/Moscow');
    
    header('Content-Type: application/json');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Allow-Credentials: true');

    // var_dump($_POST);

    $uploads_dir = './user_uploads';
    $destiation_dir = dirname(__FILE__) .'/'.$_FILES['file']['name'];

    $tmp_name = $_FILES['file']['tmp_name'];

    $result = move_uploaded_file($tmp_name, $destiation_dir);
    echo 'tmpname = '.$tmp_name;
    echo '$destiation_dir = '.$destiation_dir;
    // print_r($_FILES['file']);
    // phpinfo();

