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
                case 'getHistory':
                    $this->response['history'] = $this->getHistory($value);
                break;
                case 'getTariffs':
                    $this->response['tariffs'] = $this->getTariffs();
                break;
                case 'getCategories':
                    $this->response['categories'] = $this->getCategories();
                break;
                case 'getOptions':
                    $this->response['options'] = $this->getOptions();
                break;
                case 'setOptions':
                    $this->setOptions($value);
                break;
                case 'getMaxOrderID':
                    $this->response['options']['max_order_id'] = $this->getMaxOrderID();
                    $this->response['options']['new_order_id'] = $this->getMaxOrderID() + 1;
                break;
                case 'getMaxTariffID':
                    $this->response['options']['max_tariff_id'] = $this->getMaxTariffID();
                break;
                case 'getOrderID':
                    $this->response['options']['get_order_id'] = $this->getOrderID($value);
                break;
                case 'newOrder':
                    $this->newOrder($value);
                break;
                case 'changeOrder':
                    $this->changeOrder($value);
                break;
                case 'deleteOrder':
                    $this->deleteOrder($value);
                break;
                case 'addOrderProduct':
                    $this->addOrderProduct($value);
                break;
                case 'changeOrderProduct':
                    $this->changeOrderProduct($value);
                break;
                case 'deleteOrderProduct':
                    $this->deleteOrderProduct($value);
                break;
                case 'setCustomer':
                    $this->setCustomer($value);
                break;
                case 'deleteCustomer':
                    $this->deleteCustomer($value);
                break;
                case 'stopOrder':
                    $this->stopOrder($value);
                break;
                case 'setTariff':
                    $this->setTariff($value);
                break;
                case 'deleteTariff':
                    $this->deleteTariff($value);
                break;
                case 'setProduct':
                    $this->setProduct($value);
                break;
                case 'deleteProduct':
                    $this->deleteProduct($value);
                break;
                case 'test':
                    $this->test($value);                    
                break;
                default:
                    $this->writeLog('undefined methods: ' . $cmd .': ' . $value);
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

        //$this->writeLog("f.getOrderProducts completed");

        return $this->pDB->get($sql, false, true); 
    }

    private function getProductWithId($id) {
        $sql = 'SELECT * FROM `products` WHERE `id_rent` =' .$id;

        return $this->pDB->get($sql, false, true); 
    }

    private function getClients() {
        $sql = 'SELECT * FROM `clients` WHERE `id_rental_org` = '.$this->app_id .' ORDER BY `clients`.`fname` ASC';

        return $this->pDB->get($sql, false, true);
    }

    private function getHistory() {
        $sql = 'SELECT * FROM `orders` WHERE `id_rental_org` = '.$this->app_id . ' ORDER BY `orders`.`order_id` DESC';        

        $orders = $this->pDB->get($sql, false, true);

        foreach ($orders as $key => $order) {
            $order[products] = $this->getOrderProducts($order[order_id]);            
            $result[] = $order;
        }

        return $result;
    }

    private function getCategories() {
        /*
        * Функция Выбирает категории из БД
        */

        $sql = '
            SELECT * 
            FROM `categories` 
            WHERE `id_rental_org` = :id_rental_org
        ';

        $d = array(
            'id_rental_org' => $this->app_id
        );

        return $this->pDB->get($sql, 0, $d);
    }

    private function getOptions() {
        /*
        * Функция Выбирает Настройки из БД
        */

        $sql = '
            SELECT `id_rent`, `name`, `value`  
            FROM `options` 
            WHERE `id_rental_org` = :id_rental_org
        ';

        $d = array(
            'id_rental_org' => $this->app_id
        );

        return $this->pDB->get($sql, 0, $d);
    }

    private function setOptions($options) {
        /*
        * Функция Выбирает Настройки из БД
        */
        $checkID = function ($name) {
            if (!$name) {
                return null;
            }

            $sql = '
                SELECT `id` 
                FROM `options` 
                WHERE `name` = :name
            ';

            $d = array(
                'name' => $name
            );
            
            $result = $this->pDB->get($sql, false, $d);

            return $result[0][id];
        };

        $update = function ($id, $value) {
            $sql = '
                UPDATE `options` 
                SET 
                    `value`   = :value 
                WHERE `id` = :id
                AND `id_rental_org` = :id_rental_org
            ';

            $d = array(
                'id'            => $id,
                'id_rental_org' => $this->app_id,
                'value'         => $value
            );

            $result = $this->pDB->set($sql, $d);

            if ($result) {
                $this->writeLog("function SetCustomer successfully completed. Client id($id) was updated");
            } else {
                $this->writeLog("function SetCustomer failed. Client id($id) was not updated");
            }

            return $result;
        };

        $setOption = function ($key, $value) {

            $getIncMaxID = function () {
                $sql = '
                    SELECT `id_rent` 
                    FROM `options` 
                    WHERE `id_rental_org` = :id_rental_org 
                    ORDER BY `id_rent`
                    DESC LIMIT 1
                ';

                $d = array(
                    'id_rental_org' => $this->app_id
                );

                $result = $this->pDB->get($sql, false, $d);

                return $result ? ++$result[0][id_rent] : 1;
            };

            $sql = 'INSERT INTO `options` (
                `id`,
                `id_rent`,
                `id_rental_org`,
                `name`,
                `value` 
            ) VALUES (
                NULL, 
                :id_rent,
                :id_rental_org,
                :name,  
                :value 
            )';

            $d = array(
                'id_rent'       => $getIncMaxID(),
                'id_rental_org' => $this->app_id,
                'name'          => $key,
                'value'         => $value
            );

            $this->writeLog($getIncMaxID());

            $result = $this->pDB->set($sql, $d);

            // if ($result) {
            //     $this->writeLog("SetOption completed.");
            // } else {
            //     $this->writeLog("SetOption failed.");
            // }

            return $result;
        };


        foreach ($options as $key => $value) {            
            $id = $checkID($key);

            if ($id) {
                $update($id, $value);
            } else {
                $setOption($key, $value);
            }
        }
    }

    private function getTariffs() {
        /*
        * Функция Выбирает тарифы из БД
        * Корректирует вывод для поседующей работы на клиенте
        */

        $sql = '
            SELECT *
            FROM `tariffs` 
            WHERE `id_rental_org` = :id_rental_org
        ';

        $d = array(
            'id_rental_org' => $this->app_id
        );

        // Вспомогательная функция
        $filter = function ($tariffs) {
            
            // Видоизменяем расчасовку (из строки в массив)
            return array_map(function ($tariff) {
                $tariff[_h_h] = $tariff[_h_h] ? explode(',', $tariff[_h_h]) : [];
                return $tariff;
            }, $tariffs);
        };

        return $filter($this->pDB->get($sql, 0, $d));
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

    private function getMaxTariffID() {
        /*
        * Функция возвращает максимальный rent_id из таблицы Тарифов
        */

        $sql = '
            SELECT `id_rent` 
            FROM `tariffs_h` 
            WHERE `id_rental_org` = :id_rental_org 
            ORDER BY `id_rent` 
            DESC LIMIT 1
        ';

        $d = array(
            'id_rental_org' => $this->app_id
        );
        
        $result = $this->pDB->get($sql, false, $d);

        $log = $result ? 'getMaxTariffID compleated success' : 'getMaxTariffID failed';

        $this->writeLog($log);

        return (int) $result[0][id_rent];
    }

    private function getOrderID ($id) {
        $sql = 'SELECT `order_id` FROM `orders` WHERE `id_rental_org` = ' . $this->app_id . ' AND `order_id` = ' . $id;

        $result =  $this->pDB->get($sql, false, true);

        return $result ? true : false;
    }

    private function newOrder($order) {
        $checkID = function ($order_id) {
            $sql = '
                SELECT `id` 
                FROM `orders` 
                WHERE `id_rental_org` = :id_rental_org
                AND `order_id` = :order_id
            ';

            $d = array(
                'id_rental_org' => $this->app_id,
                'order_id' => $order_id
            );

            $result = $this->pDB->get($sql, 0, $d);

            return $result[0][id];
        };

        $newOrder = function ($order) {           

            $sql = 'INSERT INTO `orders` (
                `id`,
                `order_id`,
                `order_id_position`,
                `id_rental_org`,
                `status`,
                `customer_id`,
                `customer_name`,
                `start_time`,
                `advance`,
                `deposit`,
                `note`,
                `promotion`,
                `accessories`
            ) VALUES (
                NULL, 
                :order_id, 
                :order_id_position, 
                :id_rental_org, 
                :status, 
                :order_customer_id, 
                :order_customer_name, 
                :order_start_time,
                :order_advance,
                :deposit, 
                :order_note,
                :promotion,
                :accessories
            )';

            $d = array(
                'order_id'            => $order[order_id],
                'order_id_position'   => $order[order_id_position],
                'id_rental_org'       => $this->app_id,
                'status'              => $order[status],
                'order_customer_id'   => $order[customer_id],
                'order_customer_name' => $order[customer_name],
                'order_start_time'    => date("Y-m-d H:i:s", $order[start_time]),
                'order_advance'       => $order[advance] === NULL ? 0 : $order[advance],
                'deposit'             => $order[deposit],
                'order_note'          => $order[note],
                'promotion'           => $order[promotion],
                'accessories'         => $order[accessories]
            );

            return $this->pDB->set($sql, $d);
        };

        $result =  !$checkID($order[order_id]) ? $newOrder($order) : false;

        if ($result) {
            $this->writeLog('setOrder completed');
        } else {
            $this->writeLog('setOrder failed');
        }

        return $result;
    }

    private function changeOrder($order) {
        
        $checkID = function ($order_id) {
            $sql = '
                SELECT `id` 
                FROM `orders` 
                WHERE `id_rental_org` = :id_rental_org
                AND `order_id` = :order_id
            ';

            $d = array(
                'id_rental_org' => $this->app_id,
                'order_id' => $order_id
            );

            $result = $this->pDB->get($sql, 0, $d);

            return $result[0][id];
        };

        $update = function($id, $order) {

            $sql = '
                UPDATE `orders` 
                SET 
                `order_id`          = :order_id,
                `order_id_position` = :order_id_position,
                `id_rental_org`     = :id_rental_org,
                `status`            = :status,
                `customer_id`       = :customer_id,
                `customer_name`     = :customer_name,
                `start_time`        = :start_time,
                `advance`           = :advance,
                `deposit`           = :deposit,      
                `note`              = :note,     
                `promotion`         = :promotion,        
                `accessories`       = :accessories

                WHERE `id` = :id 
                AND `id_rental_org` = :id_rental_org
            ';

            $d = array(
                'id'                => $id,
                'order_id'          => $order[order_id],
                'order_id_position' => $order[order_id_position],
                'id_rental_org'     => $this->app_id,
                'status'            => $order[status],
                'customer_id'       => $order[customer_id],
                'customer_name'     => $order[customer_name],
                'start_time'        => date("Y-m-d H:i:s", $order[start_time]),
                'advance'           => $order[advance],
                'deposit'           => $order[deposit],      
                'note'              => $order[note],     
                'promotion'         => $order[promotion],        
                'accessories'       => $order[accessories]
            );

            return $this->pDB->set($sql, $d);
        };

        $id = $checkID($order[order_id]);

        $result = $id ? $update($id, $order) : false;

        $log = $result ? 'changeOrder completed' : 'changeOrder failed';

        $this->writeLog($log);

        return $result;
    }

    private function deleteOrder($order_id) {
        if (empty($order_id)) {
            return false;
        }

        $cheack = function ($order_id) {
            //Вернет false если в ордере есть активные товары или true иначе
            $sql = '
                SELECT `id` 
                FROM `order_products` 
                WHERE `id_rental_org` = :id_rental_org 
                AND `order_id` = :order_id
                AND `end_time` IS NOT NULL
            ';

            $d = array(
                'id_rental_org' => $this->app_id,
                'order_id' => $order_id
            );

            $result = $this->pDB->get($sql, 0, $d);
            $log = $result ? 'Active product! Can not remove a order' : 'Active product not found';
            $this->writeLog($log);

            return $result[0][id] ? false : true;
        };

        $search = function ($order_id) {
            $sql = '
                SELECT `id` 
                FROM `orders` 
                WHERE `id_rental_org` = :id_rental_org 
                AND `order_id` = :order_id
            ';

            $d = array(
                'id_rental_org' => $this->app_id,
                'order_id' => $order_id
            );

            $result = $this->pDB->get($sql, 0, $d);

            return $result[0][id];
        };

        $delete = function ($id) {
            $sql = '
                DELETE FROM `orders` 
                WHERE `id_rental_org` = :id_rental_org 
                AND `id` = :id
            ';

            $d = array(
                'id_rental_org' => $this->app_id,
                'id' => $id
            );

            return $this->pDB->set($sql, $d);
        };

        if ($cheack($order_id)) {
            $result = $delete($search($order_id));            
        }
           
        $log = $result ? "deleteOrder completed." : "deleteOrder failed.";
        $this->writeLog($log);

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
                `end_time`
            ) VALUES (
                NULL, 
                :order_id, 
                :id_rental_org, 
                :product_id,
                :tariff_id,
                :bill,
                :bill_no_sale,
                :end_time
            )';

            $d = array(
                'id_rental_org' => $this->app_id,
                'order_id'      => $product[order_id],
                'product_id'    => $product[product_id],
                'tariff_id'     => $product[tariff_id],
                'bill'          => $product[bill],
                'bill_no_sale'  => $product[bill_no_sale],
                'end_time'      => $product[end_time] ? date("Y-m-d H:i:s", $product[end_time]) : NULL
            );

            
            $result = $this->pDB->set($sql, $d);

            $log = $result ? 'addOrderProduct complete' : 'addOrderProduct failed';

            $this->writeLog($log);

            $subsql = ' UPDATE `products` 
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
                    `end_time`      = :end_time 
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
                'end_time'      => $product[end_time] ? date("Y-m-d H:i:s", $product[end_time]) : NULL
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

    private function setCustomer($customer) {
        /*
        * Проверяем, существует ли пользователь с указанным id.
        * Если да - обновляем данные.
        * Если нет - записываем нового пользователя
        */

        $checkID = function ($id) {
            if (!$id) {
                return null;
            }

            $sql = '
                SELECT `id` 
                FROM `clients` 
                WHERE `id_rent` = :id_rent
            ';

            $d = array(
                'id_rent' => $id
            );
            
            $result = $this->pDB->get($sql, false, $d);
            return $result[0][id];
        };

        $update = function ($id, $customer) {
            $sql = '
                UPDATE `clients` 
                SET 
                `id_rent` = :id_rent,
                `fname` = :fname,
                `sname` = :sname,
                `tname` = :tname,
                `phone` = :phone,
                `passport` = :passport,
                `address` = :address,
                `birth_date` = :birth_date,
                `sale` = :sale,
                `balance` = :balance,
                `note` = :note,
                `updated` = :updated

                WHERE `id` = :id
                AND `id_rental_org` = :id_rental_org
            ';

            $d = array(
                'id' =>             $id,
                'id_rental_org' =>  $this->app_id,
                'id_rent' =>        $customer[id_rent],
                'fname' =>          $customer[fname],
                'sname' =>          $customer[sname],
                'tname' =>          $customer[tname],
                'phone' =>          $customer[phone],
                'passport' =>       $customer[passport],
                'address' =>        $customer[address],
                'birth_date' =>     $customer[birth_date],
                'sale' =>           $customer[sale],
                'balance' =>        $customer[balance],
                'note' =>           $customer[note],
                'updated' =>        date('Y-m-d H:i:s')
            );

            $result = $this->pDB->set($sql, $d);

            if ($result) {
                $this->writeLog("function SetCustomer successfully completed. Client id($id) was updated");
            } else {
                $this->writeLog("function SetCustomer failed. Client id($id) was not updated");
            }

            return $result;
        };

        $setCustomer = function ($customer) {
            $getIncMaxID = function () {
                $sql = '
                    SELECT `id_rent` 
                    FROM `clients` 
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

            $sql = 'INSERT INTO `clients` (
                `id`,
                `id_rent`,
                `id_rental_org`,
                `fname`,
                `sname`,
                `tname`,
                `phone`,
                `passport`,
                `address`,
                `birth_date`,
                `sale`,
                `balance`,
                `note`,
                `updated`

            ) VALUES (
                NULL, 
                :id_rent,
                :id_rental_org, 
                :fname,
                :sname,
                :tname,
                :phone,
                :passport,
                :address,
                :birth_date,
                :sale,
                :balance,
                :note,
                :updated
            )';

            $d = array(
                'id_rent' =>        $getIncMaxID(),
                'id_rental_org' =>  $this->app_id,
                'fname' =>          $customer[fname],
                'sname' =>          $customer[sname],
                'tname' =>          $customer[tname],
                'phone' =>          $customer[phone],
                'passport' =>       $customer[passport],
                'address' =>        $customer[address],
                'birth_date' =>     $customer[birth_date],
                'sale' =>           $customer[sale],
                'balance' =>        $customer[balance],
                'note' =>           $customer[note],
                'updated' =>        date('Y-m-d H:i:s')
            );

            $result = $this->pDB->set($sql, $d);

            if ($result) {
                $this->writeLog("function SetCustomer successfully completed. Client is stored in DB");
            } else {
                $this->writeLog("function SetCustomer failed. Client is not stored in DB");
            }

            return $result;
        };

        $id = $checkID($customer[id_rent]);

        return $id ? $update($id, $customer) : $setCustomer($customer);
    }

    private function deleteCustomer($id) {

        $checkID = function ($id) {
            if (!$id) {
                $this->writeLog('function Delete did not complete its work. Undefined id');
                return null;
            }

            $sql = '
                SELECT `id` 
                FROM `clients` 
                WHERE `id_rent` = :id_rent
                AND `id_rental_org` = :id_rental_org
            ';

            $d = array(
                'id_rent' => $id,
                'id_rental_org' => $this->app_id
            );
            
            $result = $this->pDB->get($sql, false, $d);

            return $result[0][id];
        };

        $delete = function ($id) {
            $sql = '
                DELETE 
                FROM `clients` 
                WHERE `id` = :id
            ';

            $d = array(
                'id' => $id
            );

            return $this->pDB->set($sql, $d);
        };

        $result = $delete($checkID($id));

        if ($result) {
            $this->writeLog("function Delete successfully completed. Client id($id) was deleted");
        } else {
            $this->writeLog("function Delete failed. Client id($id) was not deleted");
        }
    }

    private function stopOrder($product) {
        /*
        * Функция принимает 1 Товар и записывает в БД информацию о стопе
        *
        * 1. Ставим временнУю метку стопа
        * 2. Пишем стоимость
        * 3. Меняем статус продукта
        * 4. Меняем статус ордера, если активных продуктов нет
        */

        $setEndTime = function ($product) {
            $end_time = date("Y-m-d H:i:s", $product[end_time]);            
            $sql = '
                UPDATE `order_products` 
                SET `end_time` = :end_time 
                WHERE `order_id` = :order_id 
                AND `product_id` = :product_id' 
            ;
            $d = array(
                'end_time'      => $end_time,
                'order_id'      => $product[order_id],
                'product_id'    => $product[product_id],
            );

            $result = $this->pDB->set($sql, $d);

            if ($result) {
                $this->writeLog('stopOrder: setEndTime completed');
            } else {
                $this->writeLog('stopOrder: setEndTime error');
            }

            return $result;
        };

        $setBill = function ($product) {
            $sql = '
                UPDATE `order_products` 
                SET `bill` = :bill 
                WHERE `order_id` = :order_id 
                AND `product_id` = :product_id' 
            ;
            $d = array(
                'bill' => $product[bill],
                'order_id' => $product[order_id],
                'product_id' => $product[product_id],
            );

            $result = $this->pDB->set($sql, $d);

            if ($result) {
                $this->writeLog('stopOrder: setBill completed');
            } else {
                $this->writeLog('stopOrder: setBill error');
            }

            return $result;
        };

        $setProductStatus = function ($product) {
            $sql = '
                UPDATE `products` 
                SET `status` = :status 
                WHERE `id_rent` = :id_rent' 
            ;
            $d = array(
                'status' => 'free',
                'id_rent' => $product[product_id],
            );

            $result = $this->pDB->set($sql, $d);

            if ($result) {
                $this->writeLog('stopOrder: setProductStatus completed');
            } else {
                $this->writeLog('stopOrder: setProductStatus error');
            }

            return $result;
        };

        $setOrderStatus = function ($product) {
            /*
            * 1. Выбираем по id продукты вместе с их временными стоп-метками
            * 2. Если на всех продуктах стоят стоп-метки - меняем статус ордера
            */
            $getProducts = function ($order_id) {
                $sql = '
                    SELECT `order_id`, `end_time` 
                    FROM `order_products`
                    WHERE `order_id` = ' . '\'' . $order_id . '\''
                ;

                return $this->pDB->get($sql, false, true);               
            };

            $changeStatus = function ($order_id, array $products) {
                /*
                * 1. Перебираем все продуты ордера
                * 2. Если среди них не нашлось активного продукта (end_time == null), меняем статус ордера
                */

                if (empty($products)) {
                    return;
                }

                $result = true;

                foreach ($products as $value) {
                    if (empty($value[end_time])) {
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
                        'order_id' => $order_id,
                        'status' => 'END'
                    );

                    return $this->pDB->set($sql, $d);
                } 
            };
            
            $result = $changeStatus($product[order_id], $getProducts($product[order_id]));

            if ($result) {
                $this->writeLog('stopOrder: setOrderStatus completed');
            } else {
                $this->writeLog('stopOrder: setOrderStatus error');
            }

            return $result;
        };


        $setEndTime($product);
        $setBill($product);
        $setProductStatus($product);
        $setOrderStatus($product);
    }

    private function setTariff($tariff) {
        /*
        * Функция принимает тариф с клиентской стороны и
        * Записывает в БД новый тариф (или обновляет существующий в БД)
        *
        * Последовательность:
        * 1. Проверка id_rent на существование в БД, и в зависимости от этого
        * 2. Запись нового тарифа
        * 3. или Обновление существующего
        */
        

        $checkID = function ($id_rent) {
            $sql = '
                SELECT `id` 
                FROM `tariffs` 
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

        $newTariff = function($tariff) {
            /*
            * Функция в зависимости от типа тарифа готовит Sql 
            * и делает запись нового тарифа в БД 
            */
            
            $getIdRent = function () {
                // Запрос БД на максимальный id_rent.
                // Возвращает увеличенный id_rent или 1 если таблица пуста 

                $sql = '
                    SELECT `id_rent` 
                    FROM `tariffs` 
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
                INSERT INTO `tariffs` (
                `id`,
                `id_rent`,
                `id_rental_org`,
                `type`, 
                `name`,
                `_h_h`,
                `_h_max`,
                `_h_min`,
                `_d_before`,
                `_d_after`,
                `cost`,
                `note`
            ) VALUES (
                NULL,
                :id_rent,
                :id_rental_org,
                :type,
                :name,
                :_h_h,
                :_h_max,
                :_h_min,
                :_d_before,
                :_d_after,
                :cost,
                :note
            )';

            $d = array(
                'id_rent'       => $tariff[id_rent] ? $tariff[id_rent] : $getIdRent(),
                'id_rental_org' => $this->app_id,
                'type'          => $tariff[type],
                'name'          => $tariff[name],
                '_h_h'          => $tariff[_h_h] ? implode(',', $tariff[_h_h]) : '',
                '_h_max'        => $tariff[_h_max],
                '_h_min'        => $tariff[_h_min],
                '_d_before'     => $tariff[_d_before],
                '_d_after'      => $tariff[_d_after],
                'cost'          => $tariff[cost],
                'note'          => $tariff[note]
            );
            
            $result = $this->pDB->set($sql, $d);

            $log = $result ? 
                'function setTariff successfully completed!  New tariff is saved':
                'function setTariff failed!  New tariff is`t saved';            

            $this->writeLog($log);

            return $result;

            $this->writeLog($tariff);
        };

        $update = function ($id, $tariff) {
            // Функция по id обновляет соотв. запись в таблице
            
            $sql = '
                UPDATE `tariffs` 
                SET 
                    `id_rent`       = :id_rent,
                    `id_rental_org` = :id_rental_org,
                    `type`          = :type, 
                    `name`          = :name,
                    `_h_h`          = :_h_h,
                    `_h_max`        = :_h_max,
                    `_h_min`        = :_h_min,
                    `_d_before`     = :_d_before,
                    `_d_after`      = :_d_after,
                    `cost`          = :cost,
                    `note`          = :note 
                WHERE `id` = :id
            ';

            $d = array(
                'id'            => $id,
                'id_rent'       => $tariff[id_rent],
                'id_rental_org' => $this->app_id,
                'type'          => $tariff[type],
                'name'          => $tariff[name],
                '_h_h'          => $tariff[_h_h] ? implode(',', $tariff[_h_h]) : '',
                '_h_max'        => $tariff[_h_max],
                '_h_min'        => $tariff[_h_min],
                '_d_before'     => $tariff[_d_before],
                '_d_after'      => $tariff[_d_after],
                'cost'          => $tariff[cost],
                'note'          => $tariff[note]
            );

            $result = $this->pDB->set($sql, $d);

            if ($result) {
                $this->writeLog("setTariff.update completed.");
            } else {
                $this->writeLog("setTariff.update failed.");
            }

            return $result;
        };

        $id = $checkID($tariff[id_rent]);

        return $id ? $update($id, $tariff) : $newTariff($tariff);
    }

    private function deleteTariff($id_rent) {
        /*
        * Функция принимает id_rent тарифа
        * Находит id тарифа в таблицe
        * Производит удаление тарифа из таблицы БД
        *
        * id_rent !== id
        */
       
        $search = function ($id_rent) {
            $sql = '
                SELECT `id` 
                FROM `tariffs` 
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
                DELETE FROM `tariffs` 
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
            $this->writeLog("deleteTariff completed.");
        } else {
            $this->writeLog("deleteTariff failed.");
        }

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
                    `categories`    = :categories,
                    `updated`       = :updated 
                WHERE `id` = :id
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
                'categories'    => $product[categories],
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

    private function test($value) {
        $this->writeLog("function Test orbaiten normal");
    }
}

$request = new Request(8800000001);
$request->response();

// Hy9nD4_12

?>