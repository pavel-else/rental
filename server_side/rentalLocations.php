<?php

trait RentalLocations
{
    private function getRentalLoations() {
        $sql = '
            SELECT * 
            FROM `rental_locations` 
            WHERE `id_main_org` = :id_main_org 
        ';

        $d = array (
            'id_main_org' => $this->id_main_org
        );

        $result = $this->pDB->get($sql, false, $d);
        
        $log = $result ? "getRentalLocations completed" : "getRentalLocations failed";

        $this->writeLog($log);

        return $result;
    }
}

?>