<?php

trait Auth
{
    public function login($user)
    {   
        $pDB = $this->rent_connect_DB();

        $id = ($user['id']);
        $password = htmlspecialchars($user['password'], ENT_QUOTES);

        // //Шифруем папроль
        // $password = md5($password . "top_secret");

        $sql = '
            SELECT * 
            FROM `rental_points` 
            WHERE `id_rent` = :id_rent  
            AND `password` = :password 
        ';

        $d = array(
            'id_rent' => $id,
            'password' => $password
        );

        $result = $pDB->get($sql, false, $d);

        $log = $result ? "login success" : "failed to login $id : $password";

        $this->writeLog($log);

        return $result[0][token];
    }
}