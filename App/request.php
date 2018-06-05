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
                case 'getClients':
                    $this->response['clients'] = $this->getClients();
                break;
                case 'writeLog':
                    $this->writeLog($value);
                break;
                case 'setLogs':
                    $this->writeLog($value);
                    $this->getLogs();
                break;
                case 'setOrder':
                    $this->setOrder($value);
                    $this->getLogs();
                break;
                case 'test':
                    $this->test($value);
                    $this->getLogs();
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

        $this->send($this->response);
    }

    // Отправка данных клиенту
    private function send($data) {
        echo json_encode($data);
    }
    
    // /* Функция подключения БД */
    private function rent_connect_DB(){
        require_once('../lib.db.php');

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
        $sql = 'SELECT * FROM `products` WHERE `id_rent` NOT IN ('.trim($not_in_rental,',').') AND `active` = 1 AND `id_rental_org` = '.$this->app_id.' ORDER BY `name`';     // Перебираем все товары кроме активных (свободные велосипеды)

        $this->writeLog("f.GetProducts completed");
        return $this->pDB->get($sql, false, true);
    }

    private function getOrders() {
        $sql = 'SELECT * FROM `orders` WHERE `status` = \'ACTIVE\' AND `id_rental_org` = '.$this->app_id;
        $this->writeLog("f.Orders completed");

        return $this->pDB->get($sql, false, true);
    }

    private function getClients() {
        $sql = 'SELECT * FROM `clients` WHERE `id_rental_org` = '.$this->app_id .' ORDER BY `clients`.`fname` ASC';

        return $this->pDB->get($sql, false, true);
    }

    private function setOrder($order) {
        $sql = 'INSERT INTO `orders` (
            `id`,
            `order_id`,
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
       
        if ($this->pDB->set($sql, $order_data)) {
            
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
                'order_id' => $order[order_id],
                'product_id' => '',
                'bill' => 0,
                'bill_no_sale' => 0,
                'end_time' => $order[end_time] ? date("Y-m-d H:i:s", $order[end_time]) : NULL
            );

            foreach ($order[products] as $key => $product) {
                $product_data[product_id] = $product;

                $this->pDB->set($subsql, $product_data);                
            }
        } else {
            $this->request['logs'] = 'setOrder Error';
        }

    }

    private function test($value) {
        $sql = 'INSERT INTO `order_products` (`id`, `order_id` , `product_id`, `bill`, `bill_no_sale`, `end_time`) VALUES (:id, :order_id, :product_id, :bill, :bill_no_sale, :end_time)';
        $data = array(
            'id' => null,
            'order_id' => $value[order_id],
            'product_id' => $value[product_id],
            'bill' => $value[bill],
            'bill_no_sale' => $value[bill_no_sale],
            'end_time' => $value[end_time]
        );

        $this->pDB->set($sql, $data);
    }
}

$request = new Request(8800000001);
$request->response();

?>