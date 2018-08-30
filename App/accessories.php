<?php

trait Accessoriess
{
    private function getAccessories() {
        $sql = '
            SELECT 
                `id_rent`, 
                `name`, 
                `type`, 
                `value` 
            FROM 
                `accessories` 
            WHERE 
                `id_rental_org` = :id_rental_org 
        ';

        $d = array (
            'id_rental_org' => $this->app_id
        );

        $result = $this->pDB->get($sql, false, $d);
        
        $log = $result ? "getAccessories completed" : "getAccessories failed";

        $this->writeLog($log);

        return $result;
    }   
}

?>