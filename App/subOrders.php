<?php

trait SubOrders
{
    private function getOrderProducts() {
        $sql = '
            SELECT * 
            FROM `order_products` 
            WHERE `id_rental_org` = :id_rental_org
        ';

        $d = array (
            'id_rental_org' => $this->app_id
        );

        $result = $this->pDB->get($sql, false, $d);
        
        $log = $result ? "getOrderProducts completed" : "getOrderProducts failed";

        $this->writeLog($log);

        return $result;       
    }

    private function getHistory() {

        $getOrderProducts = function ($order_id) {
            $sql = '
                SELECT * 
                FROM `order_products` 
                WHERE `order_id`    = :order_id 
                AND `id_rental_org` = :id_rental_org
            ';

            $d = array (
                'order_id'      => $order_id,
                'id_rental_org' => $this->app_id           
            );

            return $this->pDB->get($sql, false, $d); 
        };

        $sql = '
            SELECT * 
            FROM `orders` 
            WHERE `id_rental_org` = :id_rental_org
            ORDER BY `orders`.`order_id` 
            DESC
        ';  

        $d = array (
            'id_rental_org' => $this->app_id,
        );      

        $orders = $this->pDB->get($sql, false, $d);

        foreach ($orders as $key => $order) {
            $order[products] = $getOrderProducts($order[order_id]);            
            $result[] = $order;
        }

        return $result;
    }

    private function addOrderProduct($product) {
        $log = $this->scanProduct($product);

        if ($log) {
            $this->writeLog($log);

            return false;
        }

        $search = function ($order_id, $product_id) {
            // Запись не будет проведена если товар уже в прокате или ордера не существует

            $searchInOrderProduct = function ($product_id) {

                // вернет true если продукт свободен
                // если есть такая запись, где `end_time` IS NULL, то продукт занят, вернуть false
                $sql = '
                    SELECT `id` 
                    FROM `order_products` 
                    WHERE `id_rental_org` = :id_rental_org 
                    AND `product_id`      = :product_id 
                    AND `end_time` IS NULL
                ';

                $d = array(
                    'id_rental_org' => $this->app_id,
                    'product_id'    => $product_id
                );

                $result = $this->pDB->get($sql, 0, $d);

                if ($result) {
                    $this->writeLog('addOrderProduct failed. free product not found');
                }

                return !$result;
            };

            $searchInOrders = function ($order_id) {
                // вернет true если найдет ордер по id
                $sql = '
                    SELECT `id` 
                    FROM `orders` 
                    WHERE `id_rental_org` = :id_rental_org 
                    AND `order_id`        = :order_id 
                ';

                $d = array(
                    'id_rental_org' => $this->app_id,
                    'order_id'      => $order_id
                );

                $result = $this->pDB->get($sql, 0, $d);

                if (!$result) {
                    $this->writeLog('addOrderProduct failed. Order not found');
                }

                return $result;
            };

            return $searchInOrderProduct($product_id) && $searchInOrders($order_id);
        };

        $set = function ($product) {

            $sql = 'INSERT INTO `order_products` (
                `id`, 
                `order_id`, 
                `id_rental_org`, 
                `product_id`,
                `tariff_id`,
                `bill`,
                `bill_no_sale`,
                `pause_start`,
                `pause_time`,
                `end_time`,
                `status`, 
                `accessories`
            ) VALUES (
                NULL, 
                :order_id, 
                :id_rental_org, 
                :product_id,
                :tariff_id,
                :bill,
                :bill_no_sale,
                :pause_start,
                :pause_time,
                :end_time,
                :status,
                :accessories
            )';

            $d = array(
                'id_rental_org' => $this->app_id,
                'order_id'      => $product[order_id],
                'product_id'    => $product[product_id],
                'tariff_id'     => $product[tariff_id],
                'bill'          => $product[bill],
                'bill_no_sale'  => $product[bill_no_sale],
                'pause_start'   => $product[pause_start],
                'pause_start'   => $product[pause_start],
                'pause_time'    => $product[pause_time],
                'pause_time'    => $product[pause_time],
                'end_time'      => $product[end_time] ? date("Y-m-d H:i:s", $product[end_time]) : NULL,
                'status'        => $product[status],
                'accessories'   => $product[accessories]
            );

            
            $result = $this->pDB->set($sql, $d);

            $log = $result ? 'addOrderProduct complete' : 'addOrderProduct failed';

            $this->writeLog($log);

            $subsql = ' 
                UPDATE 
                    `products` 
                SET 
                    `status` = :status 
                WHERE 
                    `id_rental_org` = :id_rental_org 
                AND 
                    `id_rent` = :id_rent
            ';

            $subD = array(
                'id_rent'       => $product[product_id],
                'id_rental_org' => $this->app_id,
                'status'        => 'busy'
            );

            $this->pDB->set($subsql, $subD);

            return $result;
        };

        $find = $search($product[order_id], $product[product_id]);


        $find ? $set($product) : $this->writeLog('addOrderProduct failed. Duble products or empty order');
    }

    private function scanProduct($product) {
        $log = [];

        if (empty($product)) {
            $log[] = "empty product";

            return $log; // все последующие не имеют смысла
        }

        if (!$product[order_id]) {
            $log[] = "empty order_id";
        }

        if (!$product[product_id]) {
            $log[] = "empty product_id";
        }

        if (!$product[tariff_id]) {
            $log[] = "empty tariff_id";
        }

        return $log ? $log : false;
    }

    private function changeOrderProduct($product) {
        $log = $this->scanProduct($product);

        if ($log) {
            $this->writeLog($log);

            return false;
        }

        $search = function ($order_id, $product_id) {
            $sql = '
                SELECT `id` 
                FROM `order_products` 
                WHERE `id_rental_org` = :id_rental_org 
                AND `order_id`        = :order_id 
                AND `product_id`      = :product_id 
            ';

            $d = array(
                'id_rental_org' => $this->app_id,
                'order_id'      => $order_id,
                'product_id'    => $product_id
            );

            $result = $this->pDB->get($sql, 0, $d);

            return $result[0][id];
        };

        $update = function ($id, $product) {

            $sql = '
                UPDATE `order_products` 
                SET  
                    `id_rental_org` = :id_rental_org, 
                    `order_id`      = :order_id, 
                    `product_id`    = :product_id,
                    `tariff_id`     = :tariff_id,
                    `bill`          = :bill,
                    `bill_no_sale`  = :bill_no_sale,
                    `pause_start`   = :pause_start,
                    `pause_time`    = :pause_time,
                    `end_time`      = :end_time,
                    `status`        = :status,
                    `accessories`   = :accessories 
                WHERE
                    `id` = :id
                AND
                    `id_rental_org` = :id_rental_org
            ';

            $d = array(
                'id'            => $id,
                'id_rental_org' => $this->app_id,
                'order_id'      => $product[order_id],
                'product_id'    => $product[product_id],
                'tariff_id'     => $product[tariff_id],
                'bill'          => $product[bill],
                'bill_no_sale'  => $product[bill_no_sale],
                'pause_start'   => $product[pause_start],
                'pause_start'   => date("Y-m-d H:i:s", $product[pause_start]),
                'pause_time'    => $product[pause_time],
                'end_time'      => $product[end_time] ? date("Y-m-d H:i:s", $product[end_time]) : NULL,
                'status'        => $product[status],
                'accessories'   => $product[accessories]
            );

            
            $result = $this->pDB->set($sql, $d);

            $log = $result ? 'changeOrderProduct complete' : 'changeOrderProduct failed';

            $this->writeLog($log);

            return $result;
        };

        $id = $search($product[order_id], $product[product_id]);


        return $id ? $update($id, $product) : $this->writeLog('changeOrderProduct failed. Product not define in DB');
    }

    private function deleteOrderProduct($product) {
        
        if (empty($product[product_id])) {
            $this->writeLog('deleteOrderProducts failed! empty product_id');
            
            return false;
        }

        if (empty($product[order_id])) {
            $this->writeLog('deleteOrderProducts failed! empty order_id');
            
            return false;
        }

        $delete = function ($id) {
            $sql = '
                DELETE FROM `order_products` 
                WHERE `id_rental_org` = :id_rental_org 
                AND `id` = :id
            ';

            $d = array(
                'id_rental_org' => $this->app_id,
                'id'            => $id
            );

            $result = $this->pDB->set($sql, $d);
            $log = $result ? 'delete products' : 'delete products failed';
            $this->writeLog($log);

            return $result;
        };
        
        $search = function ($order_id, $product_id) {
            $sql = '
                SELECT `id` 
                FROM `order_products` 
                WHERE `id_rental_org` = :id_rental_org 
                AND `order_id`        = :order_id
                AND `product_id`      = :product_id 
            ';

            $d = array(
                'id_rental_org' => $this->app_id,
                'order_id'      => $order_id,
                'product_id'    => $product_id
            );

            $result = $this->pDB->get($sql, 0, $d);

            return $result[0][id];
        };

        $id = $search($product[order_id], $product[product_id]);

        return $id ? $delete($id) : false;
    }

    private function stopOrder($subOrder) {
        /*
        * Функция принимает 1 Товар и записывает в БД информацию о стопе
        *
        * 1. Ставим временнУю метку стопа
        * 2. Пишем стоимость
        * 3. Меняем статус продукта
        * 4. Меняем статус ордера, если активных продуктов нет
        */

        $setEndTime = function ($subOrder) {          
            $sql = '
                UPDATE 
                    `order_products` 
                SET 
                    `end_time` = :end_time,
                    `status`   = :status  
                WHERE 
                    `order_id` = :order_id 
                AND 
                    `product_id` = :product_id' 
            ;
            $d = array(
                'end_time'   => date("Y-m-d H:i:s", $subOrder[end_time] / 1000), 
                'status'     => $subOrder[status],
                'order_id'   => $subOrder[order_id],
                'product_id' => $subOrder[product_id],
            );

            $result = $this->pDB->set($sql, $d);

            $log = $result ? 'stopOrder: setEndTime completed' : 'stopOrder: setEndTime error';

            $this->writeLog($log);

            return $result;
        };

        $setBill = function ($subOrder) {
            $sql = '
                UPDATE 
                    `order_products` 
                SET 
                    `bill`        = :bill, 
                    `bill_rent`   = :bill_rent, 
                    `bill_access` = :bill_access, 
                    `paid`        = :paid 
                WHERE 
                    `order_id` = :order_id 
                AND 
                    `product_id` = :product_id' 
            ;

            $d = array(
                'bill'        => $subOrder[bill],
                'bill_rent'   => $subOrder[bill_rent],
                'bill_access' => $subOrder[bill_access],
                'order_id'    => $subOrder[order_id],
                'product_id'  => $subOrder[product_id],
                'paid'        => $subOrder[paid],
            );

            $result = $this->pDB->set($sql, $d);

            $log = $result ? 'stopOrder: setBill completed' : 'stopOrder: setBill error';

            $this->writeLog($log);

            return $result;
        };

        $setProductStatus = function ($subOrder) {
            $sql = '
                UPDATE 
                    `products` 
                SET 
                    `status` = :status 
                WHERE 
                    `id_rent` = :id_rent' 
            ;

            $d = array(
                'status'  => 'free',
                'id_rent' => $subOrder[product_id],
            );

            $result = $this->pDB->set($sql, $d);

            $log = $result ? 'stopOrder: setProductStatus completed' : 'stopOrder: setProductStatus error';

            $this->writeLog($log);

            return $result;
        };

        $setOrderStatus = function ($subOrder) {
            /*
            * 1. Выбираем по id продукты вместе с их временными стоп-метками
            * 2. Если на всех продуктах стоят стоп-метки - меняем статус ордера
            */
            $getProducts = function ($order_id) {
                $sql = '
                    SELECT 
                        `order_id`, 
                        `end_time` 
                    FROM 
                        `order_products`
                    WHERE 
                        `order_id` = :order_id
                ';

                $d = array(
                    'order_id' => $order_id
                );

                return $this->pDB->get($sql, false, $d);               
            };

            $changeStatus = function ($order_id, array $subOrders) {
                /*
                * 1. Перебираем все продуты ордера
                * 2. Если среди них не нашлось активного продукта (end_time == null), меняем статус ордера
                */

                if (empty($subOrders)) {
                    return;
                }

                $result = true;

                foreach ($subOrders as $value) {
                    if (empty($value[end_time])) {
                        $result = false;
                    }
                }  

                if ($result) {
                    $sql = '
                        UPDATE 
                            `orders` 
                        SET 
                            `status` = :status 
                        WHERE 
                            `order_id` = :order_id
                    ';

                    $d = array(
                        'order_id' => $order_id,
                        'status'   => 'END'
                    );

                    return $this->pDB->set($sql, $d);
                } 
            };
            
            $result = $changeStatus($subOrder[order_id], $getProducts($subOrder[order_id]));

            $log = $result ? 'stopOrder: setOrderStatus completed' : 'stopOrder: setOrderStatus error';

            $this->writeLog($log);

            return $result;
        };


        $setEndTime($subOrder);
        $setBill($subOrder);
        $setProductStatus($subOrder);
        $setOrderStatus($subOrder);
    }
}

?>