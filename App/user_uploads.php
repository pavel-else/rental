<?php
    error_reporting(E_ALL & ~E_NOTICE);
    date_default_timezone_set('Europe/Moscow');
    
    header('Content-Type: application/json');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Allow-Credentials: true');

    print_r($_FILES);

    $uploads_dir = './dist';
        $file = $_FILES[file];

        $tmp_name = $file["tmp_name"];

        // basename() может предотвратить атаку на файловую систему;
        // может быть целесообразным дополнительно проверить имя файла
        $name = basename($_FILES["file"]["name"]);
        $result = move_uploaded_file($tmp_name, "$uploads_dir");
        echo 'result ' . $result;

