<?PHP

error_reporting(E_ALL & ~E_NOTICE);
date_default_timezone_set('Europe/Moscow');

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');


// $postDataJSON = file_get_contents('php://input');
// $dataJSON = json_decode($postDataJSON, true);

// $cmd = $dataJSON['cmd'];
// $val = $dataJSON['value'];

// switch ($cmd) {
//     case 'test':
//     	rent_update_orders($DataJSON, $app_id);
//     	save_ping($app_id, $value);
//     break;
//     case 'getInitial':
//     	echo json_encode(getInitial());
//     break;
//     case 'getProducts':
//     	echo json_encode(getProducts());
//     break;
//     case 'getOrders':
//     	echo json_encode(getOrders());
//     break;
//     case 'getClients':
//     	echo json_encode(getClients());
//     break;
// }

class Request
{
    private $dataJSON;
    private $app_id;
    private $pDB;

    public function __construct($app_id) {
    	$this->app_id = $app_id; //'8800000001';
    	$postDataJSON = file_get_contents('php://input');
    	$this->dataJSON = json_decode($postDataJSON, true);
    }

    public function response()  {
    	$this->pDB = $this->rent_connect_DB();
    	
    	$cmd = $this->dataJSON['cmd'];
    	$value = $this->dataJSON['value'];


    	switch ($cmd) {
		    case 'getInitial':
		    	$this->sendToClient($this->getInitial());
		    break;
		    case 'getProducts':
		    	echo "case getProducts";
		    	$this->sendToClient($this->getProducts());
		    break;
		    case 'getOrders':
		    	$this->sendToClient($this->getOrders());
		    break;
		    case 'getClients':
		    	$this->sendToClient($this->getClients());
		    break;
		}
    }

    private function sendToClient($data) {
    	echo json_decode($data);
    }
	
	// /* Функция подключения БД */
	private function rent_connect_DB(){
		require_once('../lib.db.php');

		$pDB = new Pdo_Db();

		$pDB->connect();
		if (!$pDB->isConnected()){
			echo "Ошибка подключения к БД";
			die();
		} else {
			echo "qwerty";
		}

		return $pDB;
	}
	private function getInitial() {
		$result = [];
		$result['products'] = $this->getProducts();
		$result['orders'] = $this->getOrders();
		return $result;
	}

	private function getProducts() {
		$not_in_rental = '0,';			// Велосипеды которые не в прокате	
			$app_id = '8800000001';	
	$sql = 'SELECT * FROM `products` WHERE `id_rent` NOT IN ('.trim($not_in_rental,',').') AND `active` = 1 AND `id_rental_org` = '.$app_id.' ORDER BY `name`';		// Перебираем все товары кроме активных (свободные велосипеды)
		echo json_decode ($this->pDB->get($sql, false, true));
		return $this->pDB->get($sql, false, true);
	}

	private function getOrders() {
		$sql = 'SELECT * FROM `orders` WHERE `status` = \'ACTIVE\' AND `id_rental_org` = '.$this->app_id;
		
		return $this->pDB->get($sql, false, true);
	}

	private function getClients() {
		$sql = 'SELECT * FROM `clients` WHERE `id_rental_org` = '.$this->app_id .' ORDER BY `clients`.`fname` ASC';

		return $this->pDB->get($sql, false, true);
	}
}

$request = new Request(8800000001);
$request->response();




function getInitial() {
	$result = [];
	$result['products'] = getProducts();
	$result['orders'] = getOrders();

	return $result;
}

function getProducts() {
	$app_id = '8800000001';
	$not_in_rental = '0,';			// Велосипеды которые не в прокате
	$pDB = rent_connect_DB();		// Подключаемся к БД
	
	$sql = 'SELECT * FROM `products` WHERE `id_rent` NOT IN ('.trim($not_in_rental,',').') AND `active` = 1 AND `id_rental_org` = '.$app_id.' ORDER BY `name`';		// Перебираем все товары кроме активных (свободные велосипеды)
	return $pDB->get($sql, false, true);
}

function getOrders() {
	$app_id = '8800000001';
	$sql = 'SELECT * FROM `orders` WHERE `status` = \'ACTIVE\' AND `id_rental_org` = '.$app_id;
	$pDB = rent_connect_DB();		// Подключаемся к БД
	
	return $pDB->get($sql, false, true);
}

function getClients() {
	$app_id = '8800000001';
	$pDB = rent_connect_DB();
	$sql = 'SELECT * FROM `clients` WHERE `id_rental_org` = '.$app_id .' ORDER BY `clients`.`fname` ASC';

	return $pDB->get($sql, false, true);
}

function rent_connect_DB(){
	include_once('../lib.db.php');

	$pDB = new Pdo_Db();

	$pDB->connect();
	if (!$pDB->isConnected()){
		echo "Ошибка подключения к БД";
		die();
	}
	return $pDB;
}
?>