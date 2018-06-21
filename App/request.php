<?php
error_reporting(E_ALL & ~E_NOTICE);
date_default_timezone_set('Europe/Moscow');

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

class Request
{
    public $logs = [];
    private $response;
    private $dataJSON;
    private $app_id;
    private $pDB;

    public function __construct($app_id) {
        $this->app_id = $app_id; //'8800000001';
        $postDataJSON = file_get_contents('php://input');
        $this->dataJSON = json_decode($postDataJSON, true);
    }

    public function response()  {
        /*
        *   1. Подключаемся к БД
        *   2. Парсим входящий запрос по отдельным командам
        *   3. По одной команде пропускаем через свитч, кот определяет какая функция обработает эту команду
        *   4. Результат своей работы каждая функция записывает в $this->response
        *   5. Массив $this->response отправляется на клиент.
        */

        $this->response  = [];
        $this->pDB = $this->rent_connect_DB();
        

        $cmds = $this->dataJSON['cmds'];
        $value = $this->dataJSON['value'];

        $switch = function ($cmd) use($value) {
            switch ($cmd) {
                case 'getLogs':
                    $this->response['logs'] = $this->logs;
                break;
                case 'getProducts':
                    $this->response['products'] = $this->getProducts();
                break;
                case 'getOrders':
                    $this->response['orders'] = $this->getOrders();
                break;
                case 'getOrderProducts':
                    $this->response['order_products'] = $this->getOrderProducts($value);
                break;
                case 'getClients':
                    $this->response['clients'] = $this->getClients();
                break;
                case 'getMaxOrderID':
                    $this->response['options']['max_order_id'] = $this->getMaxOrderID();
                    $this->response['options']['new_order_id'] = $this->getMaxOrderID() + 1;
                break;
                case 'getOrderID':
                    $this->response['options']['get_order_id'] = $this->getOrderID($value);
                break;
                case 'setOrder':
                    $this->setOrder($value);
                break;
                case 'stopOrder':
                    $this->stopOrder($value);
                break;
                case 'test':
                    $this->test($value);                    
                break;
            } 
        };

        if (gettype($cmds) == 'array'){
            foreach ($cmds as $key => $cmd) {
                $switch($cmd);
            }    
        } else {
            $switch($cmds);
        }

        $this->getLogs();
        $this->send($this->response);
    }

    // Отправка данных клиенту
    private function send($data) {
        echo json_encode($data);
    }
    
    // /* Функция подключения БД */
    private function rent_connect_DB(){
        require_once('../../lib.db.php');

        $pDB = new Pdo_Db();

        $pDB->connect();
        if (!$pDB->isConnected()){
            echo "Ошибка подключения к БД";
            die();
        }

        return $pDB;
    }

    private function writeLog($log) {
        $this->logs[] = $log;
    }

    private function getLogs() {
        $this->response['logs'] = $this->logs;
    }

    private function getProducts() {
        $not_in_rental = '0,';          // Велосипеды которые не в прокате   
        $sql = 'SELECT * FROM `products` WHERE `id_rent` NOT IN ('.trim($not_in_rental,',').') AND `id_rental_org` = '.$this->app_id.' ORDER BY `name`';     // Перебираем все товары кроме активных (свободные велосипеды)

        $this->writeLog("f.GetProducts completed");
        return $this->pDB->get($sql, false, true);
    }

    private function getOrders() {
        $sql = 'SELECT * FROM `orders` WHERE `status` = \'ACTIVE\' AND `id_rental_org` = '.$this->app_id;
        // $sql = 'SELECT * FROM `order_products` 
        //     INNER JOIN `orders` on orders.order_id = order_products.order_id 
        //     WHERE `status` = \'ACTIVE\' AND `id_rental_org` = '.$this->app_id;

        $this->writeLog("f.Orders completed");

        $orders = $this->pDB->get($sql, false, true);

        foreach ($orders as $key => $order) {
            $order[products] = $this->getOrderProducts($order[order_id]);
            $result[] = $order;
        }

        return $result;
    }

    private function getOrderProducts($order_id) {
        $sql = 'SELECT * FROM `order_products` WHERE `order_id` =' .$order_id;

        $this->writeLog("f.getOrderProducts completed");

        return $this->pDB->get($sql, false, true); 
    }

    private function getClients() {
        $sql = 'SELECT * FROM `clients` WHERE `id_rental_org` = '.$this->app_id .' ORDER BY `clients`.`fname` ASC';

        return $this->pDB->get($sql, false, true);
    }

    private function getMaxOrderID() {
        $sql = 'SELECT `order_id` FROM `orders` WHERE `id_rental_org` = '. $this->app_id .' ORDER BY `order_id` DESC LIMIT 1';
        $result = $this->pDB->get($sql, false, true);

        if (count($result)) {
            foreach ($result as $key => $value) {
                $this->writeLog('getMaxOrderID compleated. value = ' .$value[order_id]);

                return $value[order_id];
            }
        } else {
            $this->writeLog('getMaxOrderID return empty array');

            return 0;
        }
    }

    private function getOrderID ($id) {
        $sql = 'SELECT `order_id` FROM `orders` WHERE `id_rental_org` = ' . $this->app_id . ' AND `order_id` = ' . $id;

        $result =  $this->pDB->get($sql, false, true);

        return $result ? true : false;
    }

    private function setOrder($order) {
        /*
        * Определены 2 функции: для записи ордера и записи продуктов к ордеру
        * Если ордер с указанным order_id уже существует, то просто добавляем продукты к ордеру.
        * Если не существует - записываем новый ордер и продукты к нему.
        * Функция возвращает TRUE, если запись прошла успешено.
        */

        $products = $order['products'];
        $orderID = $order[order_id];
        $result = false;

        $setOrder = function ($order) {
            $sql = 'INSERT INTO `orders` (
                `id`,
                `order_id`,
                `order_id_position`,
                `id_rental_org`,
                `status`,
                `customer_id`,
                `customer_name`,
                `start_time`,
                `advance_time`,
                `advance`,
                `advance_hold`,
                `sale_id`,
                `note`
            ) VALUES (
                NULL, 
                :order_id, 
                :order_id_position, 
                :id_rental_org, 
                :status, 
                :order_customer_id, 
                :order_customer_name, 
                :order_start_time, 
                :order_advance_time, 
                :order_advance, 
                :order_advance_hold, 
                :order_sale_id, 
                :order_note
            )';

            $order_data = array(
                'order_id' =>               $order[order_id],
                'order_id_position' =>      $order[order_id_position],
                'id_rental_org' =>          $order[id_rental_org],//$this->app_id,
                'status' =>                 $order[status],
                'order_customer_id' =>      $order[customer_id],
                'order_customer_name' =>    $order[customer_name],
                'order_start_time' =>       date("Y-m-d H:i:s", $order[start_time]),
                'order_advance_time' =>     $order[advance_time],
                'order_advance' =>          $order[advance],
                'order_advance_hold' =>     $order[advance_hold],
                'order_sale_id' =>          $order[sale_id],
                'order_note' =>             $order[note],
            );

            return $this->pDB->set($sql, $order_data);
        };

        $setOrderProducts = function ($products, $orderID) use($order) {
            $subsql = 'INSERT INTO `order_products` (
                `id`, 
                `order_id`, 
                `product_id`,
                `bill`,
                `bill_no_sale`,
                `end_time`
            ) VALUES (
                NULL, 
                :order_id, 
                :product_id,
                :bill,
                :bill_no_sale,
                :end_time
            )';

            $product_data = array(
                'order_id' => $orderID,
                'product_id' => '',
                'bill' => 0,
                'bill_no_sale' => 0,
                'end_time' => $order[end_time] ? date("Y-m-d H:i:s", $order[end_time]) : NULL
            );

            foreach ($order[products] as $key => $product) {
                $product_data[product_id] = $product;

                $this->pDB->set($subsql, $product_data); 

                $this->pDB->set("UPDATE `products` SET `active` = 0  WHERE `id_rent` = " . $product); 
            }
        };

        if ($this->getOrderID($order[order_id])) {
            $setOrderProducts($products, $orderID);
            $result = true;
        } else if ($setOrder($order)) {
            $setOrderProducts($products, $orderID);
            $result = true;
        }

        return $result;
    }

    private function stopOrder($order) {
        $setEndTime = function ($order) {
            $end_time = date("Y-m-d H:i:s", $order[end_time]);            
            $sql = '
                UPDATE `order_products` 
                SET `end_time` = :end_time 
                WHERE `order_id` = :order_id 
                AND `product_id` = :product_id' 
            ;
            $d = array(
                'end_time' => $end_time,
                'order_id' => $order[order_id],
                'product_id' => $order[product_id],
            );

            return $this->pDB->set($sql, $d);
        };

        $setBill = function ($order) {
            $sql = '
                UPDATE `order_products` 
                SET `bill` = :bill 
                WHERE `order_id` = :order_id 
                AND `product_id` = :product_id' 
            ;
            $d = array(
                'bill' => $order[bill],
                'order_id' => $order[order_id],
                'product_id' => $order[product_id],
            );

            return $this->pDB->set($sql, $d);
        };

        $setProductStatus = function ($order) {
            $sql = '
                UPDATE `products` 
                SET `active` = :active 
                WHERE `id_rent` = :id_rent' 
            ;
            $d = array(
                'active' => 1,
                'id_rent' => $order[product_id],
            );

            return $this->pDB->set($sql, $d);
        };

        $setOrderStatus = function ($order) {
            $getProducts = function ($order) {
                $sql = '
                    SELECT `order_id`, `end_time` 
                    FROM `order_products`
                    WHERE `order_id` = :order_id
                ';
                $d = array(
                    'order_id' => $order[order_id],
                );

                return $this->pDB->set($sql, $d);               
            };

            $changeStatus = function ($order, $products) {
                if (empty($products)) {
                    return;
                }

                $result = true;

                foreach ($products as $value) {
                    if (is_null($value[end_time])) {
                        $result = false;
                    }
                }  

                if ($result) {
                    $sql = '
                        UPDATE `orders` 
                        SET `status` = :status 
                        WHERE `order_id` = :order_id
                    ';
                    $d = array(
                        'order_id' => $order[order_id],
                        'status' => 'END'
                    );

                    return $this->pDB->set($sql, $d);
                } 
            };

            return $changeStatus($order, $getProducts($order));
        };

        if (empty($order)) {
            $this->writeLog('function stopOrder failed with error: empty order');
            return;
        }

        $log['end_time'] = $setEndTime($order);
        $log['bill'] = $setBill($order);
        $log['product_status'] = $setProductStatus($order);
        $log['change_order_status'] = $setOrderStatus($order);

        $this->writeLog($log);
    }

    private function test($value) {
        $this->writeLog("function Test orbaiten normal");
    }
}

$request = new Request(8800000001);
$request->response();

?>