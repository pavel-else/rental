<?php

trait Products
{
    private function getProducts() {
        $sql = '
            SELECT * 
            FROM `products` 
            WHERE `id_rental_org` = :id_rental_org 
            AND NOT `status`      = :status 
            ORDER BY `name`
        ';

        $d = array (
            'id_rental_org' => $this->app_id,
            'status'        => 'deleted'
        );

        $result = $this->pDB->get($sql, false, $d);
        
        $log = $result ? "getProducts completed" : "getProducts failed";

        $this->writeLog($log);

        return $result;
    }
    
    private function setProduct($product) {

        $checkID = function ($id_rent) {
            $sql = '
                SELECT `id` 
                FROM `products` 
                WHERE `id_rental_org` = :id_rental_org
                AND `id_rent` = :id_rent
            ';

            $d = array(
                'id_rental_org' => $this->app_id,
                'id_rent' => $id_rent
            );

            $result = $this->pDB->get($sql, 0, $d);

            return $result[0][id];
        };

        $newProduct = function($product) {
            /*
            * Функция в зависимости от типа тарифа готовит Sql 
            * и делает запись нового тарифа в БД 
            */
            
            $getIdRent = function () {
                // Запрос БД на максимальный id_rent.
                // Возвращает увеличенный id_rent или 1 если таблица пуста 

                $sql = '
                    SELECT `id_rent` 
                    FROM `products` 
                    WHERE `id_rental_org` = :id_rental_org 
                    ORDER BY `id_rent`
                    DESC LIMIT 1
                ';

                $d = array(
                    'id_rental_org' => $this->app_id
                );

                $result = $this->pDB->get($sql, 0, $d);

                //$this->writeLog("getid = " . $result);

                return $result ? ++$result[0][id_rent] : 1;
            };

            $sql = '
                INSERT INTO `products` (
                `id`,
                `id_rent`,
                `id_rental_org`,
                `name`,
                `cost`,
                `status`,
                `tariff_ids`,
                `tariff_default`,
                `color`,
                `img`, 
                `type`,  
                `note`, 
                `updated`
            ) VALUES (
                NULL,
                :id_rent,
                :id_rental_org,
                :name,
                :cost,
                :status,
                :tariff_ids,
                :tariff_default,
                :color,
                :img,  
                :type, 
                :note,
                :updated
            )';

            $d = array(
                'id_rent'       => $product[id_rent] ? $product[id_rent] : $getIdRent(),
                'id_rental_org' => $this->app_id,
                'name'          => $product[name],
                'cost'          => $product[cost],
                'status'        => $product[status],
                'tariff_ids'    => $product[tariff_ids],
                'tariff_default'=> $product[tariff_default],
                'color'         => $product[color],
                'img'           => $product[img],
                'type'          => $product[type],
                'note'          => $product[note],
                'updated'       => date("Y-m-d H:i:s", $product[updated]),
            );
            
            $result = $this->pDB->set($sql, $d);

            $log = $result ? 
                'function setProduct successfully completed!  New Product is saved':
                'function setProduct failed!  New Product is`t saved';            

            $this->writeLog($log);

            return $result;
        };

        $update = function ($id, $product) {
            // Функция по id обновляет соотв. запись в таблице
            
            $sql = '
                UPDATE `products` 
                SET 
                    `id_rent`       = :id_rent,
                    `id_rental_org` = :id_rental_org,
                    `name`          = :name,
                    `cost`          = :cost,
                    `status`        = :status,
                    `tariff_ids`    = :tariff_ids,
                    `tariff_default`= :tariff_default,
                    `color`         = :color,
                    `img`           = :img,
                    `type`          = :type, 
                    `categories`    = :categories,
                    `note`          = :note,
                    `updated`       = :updated 
                WHERE 
                    `id` = :id
            ';

            $d = array(
                'id'            => $id,
                'id_rent'       => $product[id_rent],
                'id_rental_org' => $this->app_id,
                'name'          => $product[name],
                'cost'          => $product[cost],
                'status'        => $product[status],
                'tariff_ids'    => $product[tariff_ids],
                'tariff_default'=> $product[tariff_default],
                'color'         => $product[color],
                'img'           => $product[img],
                'type'          => $product[type],
                'categories'    => $product[categories],
                'note'          => $product[note],
                'updated'       => date("Y-m-d H:i:s", $product[updated]),
            );

            $result = $this->pDB->set($sql, $d);

            if ($result) {
                $this->writeLog("setPruduct.update completed.");
            } else {
                $this->writeLog("setPruduct.update failed.");
            }

            return $result;
        };

        $id = $checkID($product[id_rent]);

        return $id ? $update($id, $product) : $newProduct($product);       
    }

    private function deleteProduct($id_rent) {

        $search = function ($id_rent) {
            $sql = '
                SELECT `id` 
                FROM `products` 
                WHERE `id_rental_org` = :id_rental_org 
                AND `id_rent` = :id_rent
            ';

            $d = array(
                'id_rental_org' => $this->app_id,
                'id_rent' => $id_rent
            );

            $result = $this->pDB->get($sql, 0, $d);

            return $result[0][id];
        };

        $delete = function ($id) {
            $sql = '
                DELETE FROM `products` 
                WHERE `id` = :id
            ';

            $d = array(
                'id' => $id
            );

            return $this->pDB->set($sql, $d);
        };

        if (empty($id_rent)) {
            return false;
        }

        $result = $delete($search($id_rent));    
           
        if ($result) {
            $this->writeLog("deleteProduct completed.");
        } else {
            $this->writeLog("deleteProduct failed.");
        }

        return $result;       
    }

    private function changeImage($value) {
        $this->writeLog($value);
    }
}

?>