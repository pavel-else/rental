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

    private function setAccessory($accessory) {
        /*
        * Проверяем, существует ли accessory с указанным id.
        * Если да - обновляем данные.
        * Если нет - записываем нового accessory
        */

        $checkID = function ($id) {
            if (!$id) {
                return null;
            }

            $sql = '
                SELECT `id` 
                FROM `accessories` 
                WHERE `id_rent` = :id_rent
            ';

            $d = array(
                'id_rent' => $id
            );
            
            $result = $this->pDB->get($sql, false, $d);
            return $result[0][id];
        };

        $update = function ($id, $accessory) {
            
            $sql = '
                UPDATE 
                    `accessories` 
                SET 
                    `id_rent` = :id_rent, 
                    `name`    = :name, 
                    `type`    = :type, 
                    `value`   = :value 
                WHERE 
                    `id` = :id 
                AND 
                    `id_rental_org` = :id_rental_org
            ';

            $d = array(
                'id'            => $id,
                'id_rental_org' => $this->app_id,
                'id_rent'       => $accessory[id_rent],
                'name'          => $accessory[name],
                'type'          => $accessory[type],
                'value'         => $accessory[value]
            );

            $result = $this->pDB->set($sql, $d);

            $log = $result ? "update accesory completed" : "update accesory failed";

            $this->writeLog($log);

            return $result;
        };

        $setAccessory = function ($accessory) {
            
            $getIncMaxID = function () {
                $sql = '
                    SELECT `id_rent` 
                    FROM `accessories` 
                    WHERE `id_rental_org` = :id_rental_org 
                    ORDER BY `id_rent`
                    DESC LIMIT 1
                ';

                $d = array(
                    'id_rental_org' => $this->app_id
                );

                $result = $this->pDB->get($sql, false, $d);

                return ++$result[0][id_rent];
            };

            $sql = 'INSERT INTO `accessories` (
                `id`,
                `id_rent`,
                `id_rental_org`, 
                `name`, 
                `type`, 
                `value` 
            ) VALUES (
                NULL, 
                :id_rent,
                :id_rental_org, 
                :name,
                :type,
                :value
            )';

            $d = array(
                'id_rental_org' => $this->app_id,
                'id_rent'       => $accessory[id_rent] ? $accessory[id_rent] : $getIncMaxID(),
                'name'          => $accessory[name],
                'type'          => $accessory[type],
                'value'         => $accessory[value]
            );


            $result = $this->pDB->set($sql, $d);

            $log = $result ? "set accesory completed" : "set accesory failed";

            $this->writeLog($log);

            return $result;
        };

        $id = $checkID($accessory[id_rent]);

        return $id ? $update($id, $accessory) : $setAccessory($accessory);
    }  
}

?>