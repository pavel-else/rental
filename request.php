<?PHP

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

error_reporting(E_ALL & ~E_NOTICE);
date_default_timezone_set('Europe/Moscow');

$postDataJSON = file_get_contents('php://input');
$dataJSON = json_decode($postDataJSON, true);

$cmd = $dataJSON['cmd'];
$val = $dataJSON['value'];

switch ($cmd) {
    case 'test':
    	rent_update_orders($DataJSON, $app_id);
    	save_ping($app_id, $value);
    break;
    case 'new_customer':
    	new_customer($val);
    break;
    case 'getInitial':
    	echo json_encode(getInitial());
    break;
    case 'getProducts':
    	echo json_encode(getProducts());
    break;
    case 'getOrders':
    	echo json_encode(getOrders());
    break;
}

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

function new_customer($customer) {
	$pDB = rent_connect_DB();
}


// request_log("1234","1234",$_REQUEST['firstName']);

// $app_id = '8800000001';

// $not_in_rental = '0,';			// Велосипеды которые не в прокате
// $pDB = rent_connect_DB();		// Подключаемся к БД

// $result = [];
	
// $sql = 'SELECT * FROM `orders` WHERE `status` = \'ACTIVE\' AND `id_rental_org` = '.$app_id;		// Выбираем все активные заказы
// //echo $sql;
// $o = $pDB->get($sql, false, true);	
// foreach ($o as $orders) { 
// 	$orders_products = json_decode($orders[products]);
// 	for($i=0; $i < count($orders_products); ++$i){				// Перебираем все заказы
// 		//$output_count_busy_prod++;			// Кол-во занятых товаров
// 		$sql_p = 'SELECT * FROM `products` WHERE `id_rent` = '.$orders_products[$i].' AND `id_rental_org` = '.$app_id;		// Выборка названия товара
// 		$products = $pDB->get($sql_p, true, false);
// 		$output_busy_prod .= $products[id_rent].$products[name];
// 		$not_in_rental .= $products[id_rent].',';
// 	}
// }

// $result['orders'] = $o;


// $sql = 'SELECT * FROM `products` WHERE `id_rent` NOT IN ('.trim($not_in_rental,',').') AND `active` = 1 AND `id_rental_org` = '.$app_id.' ORDER BY `name`';		// Перебираем все товары кроме активных (свободные велосипеды)
// $p = $pDB->get($sql, false, true);


// $output_free_prod = "{";
// foreach ($p as $product) { 
// 	$output_free_prod.= "\"" .$product[id_rent] ."\"" .":" ."\"". $product[name] ."\"" .",";
// }
// $output_free_prod .= "}";


// $result['products'] = $p;

// // Выбираем всех клиентов
// $sql = 'SELECT * FROM `clients` WHERE `id_rental_org` = '.$app_id .' ORDER BY `clients`.`fname` ASC';
// //echo $sql;
// $result['customers'] = $pDB->get($sql, false, true);

// // Возврат значения на приходящий запрос



// /* Функция подключения БД */
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

$options=array(
"status"=>1,
"err"=>$_POST['id'],
 );
	//echo json_encode($options);
?>