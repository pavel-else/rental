<?php
error_reporting(E_ALL & ~E_NOTICE);
date_default_timezone_set('Europe/Moscow');

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

require_once ('./auth.php');
require_once ('./orders.php');
require_once ('./subOrders.php');
require_once ('./products.php');
require_once ('./customers.php');
require_once ('./tariffs.php');
require_once ('./accessories.php');
require_once ('./logs.php');
require_once ('./options.php');
require_once ('./categories.php');
require_once ('./rentalLocations.php');

class Request    
{
    use Auth;    
    use Orders;    
    use SubOrders;    
    use Products;    
    use Customers;    
    use Tariffs;    
    use Accessoriess;    
    use Logs;    
    use Options;    
    use Categories;
    use RentalLocations;    

    public $logs = [];
    private $response;
    private $dataJSON;
    private $app_id;
    //private $id_main_org;
    private $pDB;
    private $token;

    public function __construct($token = null, $queue = null) {
        $this->token = $token;
        $this->app_id = $this->verifyToken($token);
        $this->queue = $queue;
    }

    private function verifyToken($token)
    {
        $pDB = $this->rent_connect_DB();
        $sql = '
            SELECT * 
            FROM `rental_points` 
            WHERE `token` = :token
        ';
        $d = array(
            'token' => $token
        );

        $result = $pDB->get($sql, 0, $d);
        $log = $result ? 'token is verify' : 'token is not verify';
        $this->writeLog($log);

        return $result[0]['id_rent'];

    }
    
    public function response()
    {
        /*
        *   1. Подключаемся к БД
        *   2. Парсим входящий запрос по отдельным командам
        *   3. По одной команде пропускаем через свитч, кот определяет какая функция обработает эту команду
        *   4. Результат своей работы каждая функция записывает в $this->response
        *   5. Массив $this->response отправляется на клиент.
        */

        $this->response  = [];
        $this->pDB = $this->rent_connect_DB();

        $switch = function ($cmd, $value) {
            switch ($cmd) {
                case 'importCustomers':
                    $this->importCustomers();
                break;

                // Auth
                case 'login':
                    $this->response['success']['token'] = $this->login($value);
                break;


                // Orders
                case 'getOrders':
                    $this->response['orders'] = $this->getOrders();
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
                case 'splitOrder':
                    $this->splitOrder($value);
                break;

                // SubOrders
                case 'getSubOrders':
                    $this->response['sub_orders'] = $this->getSubOrders();
                break;
                case 'getHistory':
                    $this->response['history'] = $this->getHistory($value);
                break;
                case 'addOrderProduct':
                    $this->addSubOrder($value);
                break;
                case 'changeOrderProduct': //Deprecated
                    $this->changeSubOrder($value);
                break;
                case 'changeSubOrder':
                    $this->changeSubOrder($value);
                break;
                case 'deleteOrderProduct':
                    $this->deleteSubOrder($value);
                break;
                case 'stopOrder':
                    $this->stopOrder($value);
                break;
                case 'abortSubOrder':
                    $this->abortSubOrder($value);
                break;
                
                // Products
                case 'getProducts':
                    $this->response['products'] = $this->getProducts();
                break;
                case 'setProduct':
                    $this->setProduct($value);
                break;
                case 'deleteProduct':
                    $this->deleteProduct($value);
                break;

                // Customers
                case 'getCustomers':
                    $this->response['customers'] = $this->getCustomers();
                break;
                case 'setCustomer':
                    $this->setCustomer($value);
                break;
                case 'deleteCustomer':
                    $this->deleteCustomer($value);
                break;
                
                // Tarifs
                case 'getTariffs':
                    $this->response['tariffs'] = $this->getTariffs();
                break;
                case 'setTariff':
                    $this->setTariff($value);
                break;
                case 'deleteTariff':
                    $this->deleteTariff($value);
                break;

                // Categories
                case 'getCategories':
                    $this->response['categories'] = $this->getCategories();
                break;

                // Accessories
                case 'getAccessories':
                    $this->response['accessories'] = $this->getAccessories();
                break;
                case 'setAccessory':
                    $this->setAccessory($value);
                break;

                // Options
                case 'getOptions':
                    $this->response['options'] = $this->getOptions();
                break;
                case 'setOptions':
                    $this->setOptions($value);
                break;

                // Logs
                case 'getLogs':
                    $this->response['logs'] = $this->logs;
                break;
                case 'getHeaders':
                    $this->response['headers'] = $this->emu_getallheaders();
                break;

                // RebtalLocations
                case 'getRentalLocations':
                    $this->response['rental_locations'] = $this->getRentalLoations();
                break;

                default:
                    $this->writeLog('undefined methods: ' . $cmd . ': ' . $value);
            } 
        };

        foreach ($this->queue as $key => $cell) {

            if ($cell[cmd]) {
                $switch($cell[cmd], $cell[value]);
            }

        }

        $this->getLogs();
        $this->send($this->response);
    }

    // Отправка данных клиенту
    public function send($data)
    {
        echo json_encode($data);
    }
    
    /* Функция подключения БД */
    private function rent_connect_DB()
    {
        require_once('./lib.db.php');

        $pDB = new Pdo_Db();

        $pDB->connect();
        if (!$pDB->isConnected()){
            echo "Ошибка подключения к БД";
            die();
        }

        return $pDB;
    }

    /* Общая функция поиска id_rent в указанной таблице*/
    private function find($tableName, $id_rent)
    {
        $sql = "
            SELECT `id` 
            FROM $tableName 
            WHERE `id_rental_org` = :id_rental_org
            AND `id_rent`         = :id_rent
        ";

        $d = array(
            'id_rental_org' => $this->app_id,
            'id_rent'       => $id_rent
        );

        $result = $this->pDB->get($sql, 0, $d);

        return $result[0][id];   
    }

    private function importCustomers()
    {
        // 1. Выбрать склиентов
        // 2. Перебор клиентов
        // 3. Поиск по фамилии в Customers
        // 4. Если не найдено - сделать новый id_rent
        // 5. запись

        $select = function() {
            $sql = "
                SELECT * 
                FROM `clients` 
            ";

            $d = array(
                // 'id_rental_org' => $this->app_id,
                // 'id_rent'       => $id_rent
            );

            return $this->pDB->get($sql, 0, $d);            
        };

        $search = function($client) {
            $sql = '
                SELECT * 
                FROM `customers` 
                WHERE `fname` = :fname
                AND `sname` = :sname
                AND `tname` = :tname
                AND `id_rental_org` = :id_rental_org
            ';

            $d = array(
                'id_rental_org' => $this->app_id,
                'fname' => $client[fname],
                'sname' => $client[sname],
                'tname' => $client[tname],
            );

            return $this->pDB->get($sql, 0, $d)[0]; 
        };

        $getID = function() {
            $sql = '
                SELECT `id_rent`  
                FROM `customers` 
                WHERE `id_rental_org` = :id_rental_org
                ORDER BY `id_rent`
                DESC LIMIT 1 
            ';

            $d = array(
                'id_rental_org' => $this->app_id,
            );

            $result = $this->pDB->get($sql, 0, $d);

            return $result ? ++$result[0][id_rent] : 1;          
        };

        $clients = $select();

        $insert = function() {
        };

        $log = [];

        foreach ($clients as $client) {
            if (!$search($client)) {
                $client[id_rent] = $getID();

                $this->setCustomer($client);
            }
        }

        $this->writeLog($log);
    }
}

// $request = new Request(8800000001);
// $request->response();

$postDataJSON = file_get_contents('php://input');
$dataJSON = json_decode($postDataJSON, true);

if ($dataJSON['cmd'] === 'login') {
    $request = new Request();
    $token = $request->login($dataJSON['value']);
    $request->send(['token' => $token]);

} else if ($dataJSON['token']) {
    $request = new Request($dataJSON['token'], $dataJSON['queue']);
    $request->response();
}

// Если пришла команда логина - пытаемся логинить, если да - отправляем токен
// Если приша КРУД команда - смотрим токен. Если совпадает - выполняем, если нет, то нет

