<?php
    error_reporting(E_ALL & ~E_NOTICE);
    date_default_timezone_set('Europe/Moscow');

    header('Access-Control-Allow-Origin: *');

    $checkType = function ($type) {
        switch ($type) {
            case 'image/jpeg':
                return true;
            break;
            case 'image/png':
                return true;
            break;            
            default:
                return false;
            break;
        }
    };

    $checkName = function($name) {
        $pattern = "#^[aA-zZ0-9\-_]+$#";
        return preg_match($pattern, $name);
    };

    $file = $_FILES['file'];

    if (!is_uploaded_file($file['tmp_name'])) {
        echo 'ER[is_uploaded_file]';
        return;
    }

    if (!$checkType($file['type'])) {
        echo 'ER[check_type]';
        return;
    }

    if ($file['size'] > 1048576 /*1Mb*/) {
        echo 'ER[check_size]';
        return;       
    }

    // if (!$checkName($file['name'])) {
    //     echo $file['name'];
    //     return;
    // }

    $destiation_dir = 'user_uploads/'. $file['name'];

    $result = move_uploaded_file($file['tmp_name'], $destiation_dir);

    echo $result ? 'OK' : 'ER';