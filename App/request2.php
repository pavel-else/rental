<?PHP
date_default_timezone_set('Europe/Moscow');
error_reporting(E_ALL & ~E_NOTICE);

$postDataJSON = '{"value": "958", "app_id":"8800000001","unix_time":"1497530578","cmd":"free_busy"}';	// 8800000001 - рабочий
$postDataJSON = '{"value": "958", "app_id":"9999990088","unix_time":"1497530578","cmd":"free_busy"}';	// 9999990088 - тестовый
$postDataJSON = '{"value": "958", "app_id":"9999990088","unix_time":"1497530578","cmd":"order_info","customer_phone":"+7(989)821-42-02"}';
$postDataJSON = '{"value": "958", "app_id":"9999990088","unix_time":"1497530578","cmd":"org_info"}';
$postDataJSON = '{"value": "958", "app_id":"9999990088","unix_time":"1497530578","cmd":"gcm", "phone":"+7(989)821-42-02", "token":"dOYHdQ_G1hw:APA91bFvNK2i6sw6ugYFwAJINrbBJpNYU5E0Hp87LUDZRckDkdCkqjBEiutzZpeYamj0CrLeKKfqRDESliZI_T-9Y9bGsKPjPGSGrW8f7qt5Q8T2Cd0m4Un_b8WcVb9KvLr91nJm7hzaL"}';

//$postDataJSON = file_get_contents('php://input');

$DataJSON = json_decode($postDataJSON);

$value = filter_var($DataJSON->{'value'}, FILTER_VALIDATE_INT);				// Случайное число
if($value === FALSE) die ("Incorrect Value");

$app_id = filter_var($DataJSON->{'app_id'}, FILTER_VALIDATE_INT);			// ID приложения
if($app_id === FALSE) die ("Incorrect App ID");

$cmd = filter_var($DataJSON->{'cmd'}, FILTER_SANITIZE_STRING);				// Команда
if($cmd === FALSE) die ("Incorrect Command");

//request_log($app_id, $value, $cmd); // логгирование всех REQUEST данных

switch ($cmd){
    case 'test':
    	rent_update_orders($DataJSON, $app_id);
    	save_ping($app_id, $value);
    break;
    case 'rent_start':
    	rent_update($DataJSON, $app_id);
    	log_command($app_id, $cmd);
    	save_ping($app_id, $value);
    break;
    case 'rent_pause':
    	rent_update($DataJSON, $app_id);
    	log_command($app_id, $cmd);
    	save_ping($app_id, $value);
    break;
    case 'rent_stop':
    	rent_stop($DataJSON, $app_id);
    	log_command($app_id, $cmd);
    	save_ping($app_id, $value);
    break; 
    case 'delete_item':
    	delete_item($DataJSON, $app_id);
    	log_command($app_id, $cmd);
    	save_ping($app_id, $value);
    break; 
    case 'new_customer':
    	new_customer($DataJSON, $app_id);
    	log_command($app_id, $cmd);
    	save_ping($app_id, $value);
    break; 
    case 'update_customer':
    	update_customer($DataJSON, $app_id);
    	log_command($app_id, $cmd);
    	save_ping($app_id, $value);
    break;
		case 'delete_customer':
    	delete_customer($DataJSON, $app_id);
    	log_command($app_id, $cmd);
    	save_ping($app_id, $value);
    break;      
    case 'new_product':
    	new_product($DataJSON, $app_id);
    	log_command($app_id, $cmd);
    	save_ping($app_id, $value);
    break;
    case 'update_product':
    	update_product($DataJSON, $app_id);
    	log_command($app_id, $cmd);
    	save_ping($app_id, $value);
    break;
    case 'delete_product':
    	delete_product($DataJSON, $app_id);
    	log_command($app_id, $cmd);
    	save_ping($app_id, $value);
    break;
    case 'gcm':
    	gcm($DataJSON, $app_id);
    break;    
    
    
    case 'booking_product':
    	booking_product($DataJSON, $app_id);
    	log_command($app_id, $cmd);
    	//save_ping($app_id, $value);
    break;
    case 'get_booking':
    	// Получить список брони
    break;       
    
        
    case 'org_info':
			org_info($app_id);
		break;
		case 'free_busy':
			free_busy($app_id);
		break;   
		case 'order_info':
			order_info($DataJSON, $app_id);
		break;
		case 'final_text':
			final_text($app_id);
		break;
          
    
		default:
			die("Unknown Command");
}

/* Бронирование */
function booking_product($DataJSON, $app_id){
//'{"value": "958", "app_id":"9999990088","unix_time":"1497530578","cmd":"booking_product","products":["2","23","5","14"],"customer_fname":"Антон","customer_phone":"+7 (903) 444-55-66","book_date":"24.07.2017","book_time":"18:30"}';
	$booking_products = filter_var_array ($DataJSON->{'products'}, FILTER_VALIDATE_INT);
	$booking_customer_fname = filter_var($DataJSON->{'customer_fname'}, FILTER_SANITIZE_STRING);
	$booking_customer_phone = filter_var($DataJSON->{'customer_phone'}, FILTER_SANITIZE_STRING);
	$booking_book_date = filter_var($DataJSON->{'book_date'}, FILTER_SANITIZE_STRING);
	$booking_book_time = filter_var($DataJSON->{'book_time'}, FILTER_SANITIZE_STRING);	
	
	if($booking_customer_phone === FALSE) die ("booking_product: Incorrect Input Data");
			
	$pDB = rent_connect_DB();
	
	$JSON_booking_products = json_encode($booking_products);
	// !!!  Сделать проверку на возможность брони для каждого продукта и вообще !!!!
	
	$sql = 'INSERT INTO `booking` (`id`, `id_rental_org`, `create_date`, `status`, `products`, `customer_fname`, `customer_phone`, `book_date`, `book_time`) 
													VALUES (NULL, :app_id, NOW(), "NEW", :products, :customer_fname, :customer_phone, :book_date, :book_time)';							
													
	$pDB->set($sql, array('app_id' => $app_id, 'products' => $JSON_booking_products, 'customer_fname' => $booking_customer_fname, 'customer_phone' => $booking_customer_phone, 'book_date' => $booking_book_date, 'book_time' => $booking_book_time));
	$ot = array('booking_id' => $pDB->getLastId());
	out($ot);
}


/* Старт или изменение проката */
function rent_update_orders($DataJSON, $app_id){
	for($i=0; $i < count($DataJSON->{'orders'}); $i++){				// Перебираем все заказы
		$tmpDataJSON = (object)array('value'=> $DataJSON->{'value'}, 'app_id'=>  $DataJSON->{'app_id'}, 'unix_time'=>  $DataJSON->{'unix_time'}, 'cmd'=>  $DataJSON->{'cmd'}, "order"=>$DataJSON->{'orders'}[$i]);
		rent_update($tmpDataJSON, $app_id);											// Обновляем данные каждого заказа если нужно
	}
}

/*Удаление продукта из заказа */
function delete_item($DataJSON, $app_id){
	$order = filter_for_order ($DataJSON);
	$order[product_id] = filter_var ($DataJSON->{'product_id'}, FILTER_VALIDATE_INT);					// ID товара для удаления
	
	$not_in_rental = '0,';
	$pDB = rent_connect_DB();
	
	$sql = 'SELECT * FROM `orders` WHERE `order_id` = '.$order[order_id].' AND `id_rental_org` = '.$app_id;		// Проверяем на существование такого заказа
	$orders = $pDB->get($sql, true, false);	
	if($orders){	
		$orders_products = json_decode($orders[products]);
		$orders_products = array_diff($orders_products, (array)$order[product_id]);		// Удаляем элемент из массива
		
		if(!$orders_products) {		// Если был только один элемент заказа, то полностью удаляем запись о заказе
			$sql = 'DELETE FROM `orders` WHERE `order_id` = :order_id AND `id_rental_org` = :id_rental_org';
			$d = array('order_id' => $order[order_id],'id_rental_org' => $app_id);
			$pDB->set($sql, $d);
		}
		else rent_update($DataJSON, $app_id);											// Иначе обновляем данные заказа;
		
	}
	else echo "Error: order_id not present";
}


/* Стоп проката */
function rent_stop($DataJSON, $app_id){
	$order = filter_for_order ($DataJSON);
	$status = 'END';		// Статус проката: ACTIVE - активный, END - завершен
	
	$pDB = rent_connect_DB();
	
	$sql = 'SELECT * FROM `orders` WHERE `order_id` = '.$order[order_id].' AND `id_rental_org` = '.$app_id;		// Проверяем на существование такого заказа
	$orders = $pDB->get($sql, true, false);	
	if($orders){	
		$sql = 'UPDATE `orders` SET	`status` = :status,	`end_time` = NOW() WHERE `order_id` = :order_id AND `id_rental_org` = :id_rental_org';	
		$d = array(
						'order_id' => $order[order_id],
						'id_rental_org' => $app_id,
						'status' => $status
					);
		$pDB->set($sql, $d);
	}
	else echo "Error: order_id not present";
}

/* Старт или изменение проката */
function rent_update($DataJSON, $app_id){
	$order = filter_for_order ($DataJSON);
	
	if($order[order_id] === FALSE || $order[customer_id] === FALSE || $order[start_time] === FALSE ||  $order[bill] === FALSE) die ("rent_start Incorrect Input Data");
	
	$order[start_time] = date("Y-m-d H:i:s",$order[start_time]);
	$status = 'ACTIVE';		// Статус проката: ACTIVE - активный, END - завершен
	$JSON_order_products = json_encode($order[products]);
	if (!empty($order_accessories)) $JSON_order_accessories = json_encode($order[accessories]);
	else $JSON_order_accessories = '';
	
	$pDB = rent_connect_DB();
	
	$sql = 'SELECT * FROM `orders` WHERE `order_id` = '.$order[order_id].' AND `id_rental_org` = '.$app_id;		// Проверяем на существование такого заказа
	$orders = $pDB->get($sql, true, false);	
	if($orders){													// Если заказ с таким номером уже есть, то проверяем изменились ли данные
		if($order[customer_id] != $orders['customer_id'] OR $order[customer_name] != $orders['customer_name'] OR $order[advance_time] != $orders['advance_time'] OR $order[advance] != $orders['advance'] OR $order[advance_hold] != $orders['advance_hold'] OR $order[sale_id] != $orders['sale_id'] OR $order[note] != $orders['note'] OR $order[play_pause] != $orders['play_pause'] OR $order[bill] != $orders['bill'] OR $JSON_order_products != $orders['products'] OR $JSON_order_accessories != $orders['accessories']){
			 	
			/* Если в уже существующем заказе прозошли какие-то изменения, то обновляем в БД данные */
			$sql = 'UPDATE `orders` SET
						`status` = :status,
						`customer_id` = :order_customer_id,
						`customer_name` = :order_customer_name,
						`start_time` = :order_start_time,
						`advance_time` = :order_advance_time,
						`advance` = :order_advance,
						`advance_hold` = :order_advance_hold,
						`sale_id` = :order_sale_id,
						`note` = :order_note,
						`products` = :order_products,
						`accessories` = :order_accessories,
						`play_pause` = :order_play_pause,
						`bill` = :order_bill,
						`bill_no_sale` = :order_bill_no_sale
						WHERE `order_id` = :order_id AND `id_rental_org` = :id_rental_org';

			$d = array(
					'order_id' => $order[order_id],
					'id_rental_org' => $app_id,
					'status' => $status,
					'order_customer_id' => $order[customer_id],
					'order_customer_name' => $order[customer_name],
					'order_start_time' => $order[start_time],
					'order_advance_time' => $order[advance_time],
					'order_advance' => $order[advance],
					'order_advance_hold' => $order[advance_hold],
					'order_sale_id' => $order[sale_id],
					'order_note' => $order[note],
					'order_products' => $JSON_order_products,
					'order_accessories' => $JSON_order_accessories,
					'order_play_pause' => $order[play_pause],
					'order_bill' => $order[bill],
					'order_bill_no_sale' => $order[bill_no_sale]
				);
			$pDB->set($sql, $d);
		}
	}
	else{
		$sql = 'INSERT INTO `orders` (`id`, `order_id`, `id_rental_org`, `status`, `customer_id`, `customer_name`, `start_time`, `advance_time`, `advance`, `advance_hold`, `sale_id`, `note`, `products`, `accessories`, `play_pause`, `bill`, `bill_no_sale`, `end_time`) 
													VALUES (NULL, :order_id, :id_rental_org, :status, :order_customer_id, :order_customer_name, :order_start_time, :order_advance_time, :order_advance, :order_advance_hold, :order_sale_id, :order_note, :order_products, :order_accessories, :order_play_pause, :order_bill, :order_bill_no_sale, NULL)';
		$pDB->set($sql, array('order_id' => $order[order_id], 'id_rental_org' => $app_id, 'status' => $status, 'order_customer_id' => $order[customer_id], 'order_customer_name' => $order[customer_name], 'order_start_time' => $order[start_time], 	'order_advance_time' => $order[advance_time], 'order_advance' => $order[advance], 'order_advance_hold' => $order[advance_hold], 'order_sale_id' => $order[sale_id], 'order_note' => $order[note], 	'order_products' => $JSON_order_products, 'order_accessories' => $JSON_order_accessories, 'order_play_pause' => $order[play_pause], 'order_bill' => $order[bill], 'order_bill_no_sale' => $order[bill_no_sale]));		
	}
}


/* Функция для добавления нового пользователя в БД */
function new_customer($DataJSON, $app_id){
	$customer = filter_for_customer ($DataJSON);
	
	if($customer[id] === FALSE || $customer[fname] === FALSE || $customer[sname] === FALSE || $customer[tname] === FALSE || 
			$customer[phone] === FALSE || $customer[sale] === FALSE || $customer[balance] === FALSE || $customer[note] === FALSE || 
			$customer[passport] === FALSE || $customer[address] === FALSE) die ("new_customer: Incorrect Input Data");
			
	$pDB = rent_connect_DB();
	
	$sql = 'INSERT INTO `clients` (`id`, `id_rental_org`, `id_rent`, `fname`, `sname`, `tname`, `phone`, `passport`, `address`, `birth_date`, `sale`, `balance`, `note`, `updated`) 
													VALUES (NULL, :app_id, :cust_id,  :cust_fname, :cust_sname, :cust_tname, :cust_phone, :cust_passport, :cust_address, :cust_birth_date, :cust_sale, :cust_balance, :cust_note, NOW())';							
													
	$pDB->set($sql, array('app_id' => $app_id, 'cust_id' => $customer[id], 'cust_fname' => $customer[fname], 'cust_sname' => $customer[sname], 'cust_tname' => $customer[tname], 'cust_phone' => $customer[phone], 'cust_passport' => $customer[passport], 'cust_address' => $customer[address], 'cust_birth_date' => $customer[birth_date], 'cust_sale' => $customer[sale], 'cust_balance' => $customer[balance], 'cust_note' => $customer[note]));
}


/* Функция для обновления пользователя в БД */
function update_customer($DataJSON, $app_id){
	$customer = filter_for_customer ($DataJSON);
	
	$customer_old_id = filter_var($DataJSON->{'old_id'}, FILTER_VALIDATE_INT);														// ID клиента (старое)
	$customer_new_id = filter_var($DataJSON->{'customer'}->{'id'}, FILTER_VALIDATE_INT);									// ID клиента (новое)
	
	if($customer[id] === FALSE || $customer[fname] === FALSE || $customer[sname] === FALSE || $customer[tname] === FALSE || 
			$customer[phone] === FALSE || $customer[sale] === FALSE || $customer[balance] === FALSE || $customer[note] === FALSE || 
			$customer[passport] === FALSE || $customer[address] === FALSE) die ("update_customer: Incorrect Input Data");
			
	$pDB = rent_connect_DB();
	
	$sql = 'SELECT * FROM `clients` WHERE `id_rent` = '.$customer_old_id.' AND `id_rental_org` = '.$app_id;		// Проверяем на существование клиента
	$cust = $pDB->get($sql, true, false);	
	if($cust){																																																// Если такой клиент есть - то обновляем данные
		$sql = 'UPDATE `clients` SET	`id_rent` = :customer_new_id, `fname` = :fname, `sname` = :sname, `tname` = :tname, `phone` = :phone, `passport` = :passport, `address` = :address, `birth_date` = :birth_date, `sale` = :sale, `balance` = :balance, `note` = :note, `updated` = NOW() WHERE `id` = :id';	
		$d = array(
						'id' => $cust[id],
						'customer_new_id' => $customer_new_id,
						'fname' => $customer[fname],
						'sname' => $customer[sname],
						'tname' => $customer[tname],
						'phone' => $customer[phone],
						'passport' => $customer[passport],
						'address' => $customer[address],
						'birth_date' => $customer[birth_date],
						'sale' => $customer[sale],
						'balance' => $customer[balance],
						'note' => $customer[note]
					);
		$pDB->set($sql, $d);
	}
	else {
		new_customer($DataJSON, $app_id);																																	// Если клиента нет, то создаем нового
	}
}


/* Удаление пользователя */
function delete_customer($DataJSON, $app_id){
	$customer = filter_for_customer ($DataJSON);
	
	$pDB = rent_connect_DB();
	
	$sql = 'SELECT * FROM `clients` WHERE `id_rent` = '.$customer[id].' AND `id_rental_org` = '.$app_id;		// Проверяем на существование клиента
	$cust = $pDB->get($sql, true, false);	
	if($cust){	
		$sql = 'DELETE FROM `clients` WHERE `id` = :id';
		$d = array('id' => $cust[id]);
		$pDB->set($sql, $d);		
	}
	else echo "Error: customer id_rent not present";
}


/* Функция для добавления нового товара в БД */
function new_product($DataJSON, $app_id){
	$product_id = filter_var($DataJSON->{'product'}->{'id'}, FILTER_VALIDATE_INT);											// ID товара
	$product_name = filter_var($DataJSON->{'product'}->{'name'}, FILTER_SANITIZE_STRING);								// Наименование товара
	$product_cost = filter_var($DataJSON->{'product'}->{'cost'}, FILTER_VALIDATE_INT);									// Стоимость
	$product_active = filter_var($DataJSON->{'product'}->{'active'}, FILTER_SANITIZE_STRING);						// Активен или нет
	$product_tariff_id = filter_var($DataJSON->{'product'}->{'tariff_id'}, FILTER_VALIDATE_INT);				// ID тарифа

	
	if($product_active == "TRUE") $product_active = 1;
	else $product_active = 0;
	
	if($product_id === FALSE || $product_name === FALSE) die ("new_product: Incorrect Input Data");
			
	$pDB = rent_connect_DB();
	
	$sql = 'INSERT INTO `products` (`id`, `id_rental_org`, `id_rent`, `name`, `cost`, `active`, `tariff_id`, `updated`) 
													VALUES (NULL, :app_id, :product_id, :product_name, :product_cost, :product_active, :product_tariff_id, NOW())';							
													
	$pDB->set($sql, array('app_id' => $app_id, 'product_id' => $product_id, 'product_name' => $product_name, 'product_cost' => $product_cost, 'product_active' => $product_active, 'product_tariff_id' => $product_tariff_id));
}


/* Функция для обновления товара в БД */
function update_product($DataJSON, $app_id){
	$product_old_id = filter_var($DataJSON->{'old_id'}, FILTER_VALIDATE_INT);														// ID товара (старое)
	$product_new_id = filter_var($DataJSON->{'product'}->{'id'}, FILTER_VALIDATE_INT);									// ID товара (новое)
	$product_name = filter_var($DataJSON->{'product'}->{'name'}, FILTER_SANITIZE_STRING);								// Наименование товара
	$product_cost = filter_var($DataJSON->{'product'}->{'cost'}, FILTER_VALIDATE_INT);									// Стоимость
	$product_active = filter_var($DataJSON->{'product'}->{'active'}, FILTER_SANITIZE_STRING);						// Активен или нет
	$product_tariff_id = filter_var($DataJSON->{'product'}->{'tariff_id'}, FILTER_VALIDATE_INT);				// ID тарифа

	
	if($product_active == "TRUE") $product_active = 1;
	else $product_active = 0;
	
	if($product_old_id === FALSE || $product_name === FALSE) die ("new_product: Incorrect Input Data");
			
	$pDB = rent_connect_DB();		
			
	$sql = 'SELECT * FROM `products` WHERE `id_rent` = '.$product_old_id.' AND `id_rental_org` = '.$app_id;		// Проверяем на существование такого товара
	$prod = $pDB->get($sql, true, false);	
	
	if($prod){	
		$sql = 'UPDATE `products` SET	`id_rent` = :product_new_id, `name` = :product_name, `cost` = :product_cost, `active` = :product_active, `tariff_id` = :product_tariff_id, `updated` = NOW() WHERE `id_rent` = :product_old_id AND `id_rental_org` = :id_rental_org';	
		$d = array(
						'product_new_id' => $product_new_id,
						'product_old_id' => $product_old_id,
						'id_rental_org' => $app_id,
						'product_name' => $product_name,
						'product_cost' => $product_cost,
						'product_active' => $product_active,
						'product_tariff_id' => $product_tariff_id
					);
		$pDB->set($sql, $d);
	}
	else echo "Error: product_id not present";
}


/* Удаление товара */
function delete_product($DataJSON, $app_id){
	$product_id = filter_var($DataJSON->{'product'}->{'id'}, FILTER_VALIDATE_INT);												// ID товара
	
	$pDB = rent_connect_DB();
	
	$sql = 'SELECT * FROM `products` WHERE `id_rent` = '.$product_id.' AND `id_rental_org` = '.$app_id;		// Проверяем на существование такого товара
	$prod = $pDB->get($sql, true, false);	
	if($prod){	
		$sql = 'DELETE FROM `products` WHERE `id` = :id';
		$d = array('id' => $prod[id]);
		$pDB->set($sql, $d);		
	}
	else echo "Error: product id_rent not present";
}


/* Получаем token для сохранения в БД, для последующей отправки PUSH-уведомлений в приложение. Команда выполняется при первом запуске приложения */
function gcm ($DataJSON, $app_id){
	$token = filter_var($DataJSON->{'token'}, FILTER_SANITIZE_STRING);
	$phone = filter_var($DataJSON->{'phone'}, FILTER_SANITIZE_STRING);
		
	$pDB = rent_connect_DB();
	
	$sql = 'SELECT * FROM `tokens` WHERE `token` = "'.$token.'" AND `id_rental_org` = '.$app_id;		// Проверяем на существование такого токена
	$tn = $pDB->get($sql, true, false);	
	if(!$tn){	
		$sql = 'INSERT INTO `tokens` (`id`, `id_rental_org`, `token`, `phone`, `create_date`) 
														VALUES (NULL, :app_id, :token, :phone, NOW())';							
														
		$pDB->set($sql, array('app_id' => $app_id, 'token' => $token, 'phone' => $phone));
		$ot = array('token_id' => $pDB->getLastId());
		out($ot);
	}
	else echo "Error: token already exist";
}

function filter_for_order ($DataJSON){
	$order = array();
	$order[order_id] = filter_var($DataJSON->{'order'}->{'order_id'}, FILTER_VALIDATE_INT);									// Номер заказа в клиентском ПО
	$order[customer_id] = filter_var($DataJSON->{'order'}->{'customer_id'}, FILTER_VALIDATE_INT);						// Номер клиента в клиентском ПО
	$order[customer_name] = filter_var($DataJSON->{'order'}->{'customer_name'}, FILTER_SANITIZE_STRING);		// ФИО клиента
	$order[start_time] = filter_var($DataJSON->{'order'}->{'start_time'}, FILTER_VALIDATE_INT);							// Время (unix timestamp) старта проката в клиентском ПО
	$order[advance_time] = filter_var($DataJSON->{'order'}->{'advance_time'}, FILTER_VALIDATE_INT);					// Аванс времени (секунды)
	$order[advance] = filter_var($DataJSON->{'order'}->{'advance'}, FILTER_VALIDATE_INT);										// Аванс деньгами
	$order[advance_hold] = filter_var($DataJSON->{'order'}->{'advance_hold'}, FILTER_SANITIZE_STRING);			// Флаг удержания FALSE/TRUE
	$order[sale_id] = filter_var($DataJSON->{'order'}->{'sale_id'}, FILTER_VALIDATE_INT);										// ID скидки
	$order[note] = filter_var($DataJSON->{'order'}->{'note'}, FILTER_SANITIZE_STRING);											// Примечание
	$order[products] = filter_var_array ($DataJSON->{'order'}->{'products'}, FILTER_VALIDATE_INT);					// Элементы проката [массив ID продуктов]
	$order[accessories] = filter_var_array ($DataJSON->{'order'}->{'accessories'}, FILTER_VALIDATE_INT);		// Аксессуары [массив ID аксессуаров]
	$order[play_pause] = filter_var($DataJSON->{'order'}->{'play_pause'}, FILTER_SANITIZE_STRING);					// Пауза проката. FALSE - на паузе
	$order[bill] = filter_var($DataJSON->{'order'}->{'bill'}, FILTER_VALIDATE_INT);													// Стоимость	
	$order[bill_no_sale] = filter_var($DataJSON->{'order'}->{'bill_no_sale'}, FILTER_VALIDATE_INT);					// Стоимость проката без учета скидки
	return $order;
}


function filter_for_customer ($DataJSON){
	$customer = array();
	$customer[id] = filter_var($DataJSON->{'customer'}->{'id'}, FILTER_VALIDATE_INT);												// ID пользователя
	$customer[fname] = filter_var($DataJSON->{'customer'}->{'fname'}, FILTER_SANITIZE_STRING);							// Фамилия
	$customer[sname] = filter_var($DataJSON->{'customer'}->{'sname'}, FILTER_SANITIZE_STRING);							// Имя
	$customer[tname] = filter_var($DataJSON->{'customer'}->{'tname'}, FILTER_SANITIZE_STRING);							// Отчество
	$customer[phone] = filter_var($DataJSON->{'customer'}->{'phone'}, FILTER_SANITIZE_STRING);							// Телефон
	$customer[sale] = filter_var($DataJSON->{'customer'}->{'sale'}, FILTER_VALIDATE_INT);										// Скидка
	$customer[balance] = filter_var($DataJSON->{'customer'}->{'balance'}, FILTER_VALIDATE_INT);							// Баланс
	$customer[note] = filter_var($DataJSON->{'customer'}->{'note'}, FILTER_SANITIZE_STRING);								// Примечание
	$customer[passport] = filter_var($DataJSON->{'customer'}->{'passport'}, FILTER_SANITIZE_STRING);				// Паспорт
	$customer[address] = filter_var($DataJSON->{'customer'}->{'address'}, FILTER_SANITIZE_STRING);						// Адрес
	$customer[birth_date] = filter_var($DataJSON->{'customer'}->{'birth_date'}, FILTER_SANITIZE_STRING);		// Дата рождения
	
	//$tmp_cust_birth_date = date_create_from_format('j.n.Y', $cust_birth_date);		// Преобразуем дату из 10.07.1980
	//$cust_birth_date = date_format($tmp_cust_birth_date, 'Y-m-d');								// в формат даты для MySQL: 1980-07-10
	
	$tmp_cust_birth_date = date_create_from_format('j.n.Y', $customer[birth_date]);		// Преобразуем дату из 10.07.1980	в формат даты для MySQL: 1980-07-10
	if($tmp_cust_birth_date) $customer[birth_date] = date_format($tmp_cust_birth_date, 'Y-m-d');	
	else $customer[birth_date] = NULL;
	
	return $customer;
}



/* Выдаем информацию о заказе по его номеру или по номеру телефона клиента*/
function order_info($DataJSON, $app_id) {
	//'{"value": "958", "app_id":"9999990088","unix_time":"1497530578","cmd":"order_info","customer_phone":"+7(989)821-42-02"}';
	$order_info_by_id = filter_var($DataJSON->{'order_id'}, FILTER_VALIDATE_INT);
	$order_info_by_customer_phone = filter_var($DataJSON->{'customer_phone'}, FILTER_SANITIZE_STRING);	

	$pDB = rent_connect_DB();

	if($order_info_by_id){
		$sql = 'SELECT * FROM `orders` WHERE `order_id` = '.$order_info_by_id.' AND `id_rental_org` = '.$app_id;
	}
	else if($order_info_by_customer_phone){
		$sql = 'SELECT * FROM `clients` WHERE `phone` = \''.$order_info_by_customer_phone.'\' AND `id_rental_org` = '.$app_id;		// Определяем ID клиента по его номеру телефона
		$cust = $pDB->get($sql, true, false);
		if($cust['id_rent']){
			$sql = 'SELECT * FROM `orders` WHERE `customer_id` = '.$cust['id_rent'].' AND `id_rental_org` = '.$app_id.' ORDER BY `id` DESC LIMIT 0,1';
		}
		else die("Error: Can't find client by Phone Number");
	}
	else die("Error: ID or Phone isn't present");	

	$order_info = $pDB->get($sql, true, false);
	if($order_info){	
		
		$sel_products = trim($order_info[products],'[]');
		$sql_pr = 'SELECT * FROM `products` WHERE `id_rent` IN ('.$sel_products.') AND `id_rental_org` = '.$app_id;
		$p = $pDB->get($sql_pr, false, true);	
		foreach ($p as $products) { 
			$products_name[] = array("id" => $products[id_rent], "model" => $products[name]);
		}
			
		$ot = array(
					'order_id' => $order_info[order_id],
					'status' => $order_info[status],
					'customer_id' => $order_info[customer_id],
					'customer_name' => $order_info[customer_name],
					'start_time' => $order_info[start_time],
					'advance_time' => $order_info[advance_time],
					'advance' => $order_info[advance],
					'advance_hold' => $order_info[advance_hold],
					'sale_id' => $order_info[sale_id],
					'note' => $order_info[note],
					'products' => $order_info[products],
					'product_names' => $products_name,
					'accessories' => $order_info[accessories],
					'play_pause' => $order_info[play_pause],
					'bill' => $order_info[bill],
					'bill_no_sale' => $order_info[bill_no_sale],
					'end_time' => $order_info[end_time],
				);
		out($ot);
	}
	else die("Error: Can't find order");	
	//echo $order_info['bill'];
	
	// Доделать вывод данных
		
}


/* Выдаем информацию о приложении для главного экрана */
function org_info($app_id) {	
	$pDB = rent_connect_DB();
	$sql = 'SELECT * FROM `rental_org_info` WHERE `id_rental_org` = '.$app_id;
	$org = $pDB->get($sql, true, false);	
	if($org){	
		$ot = array('info1' => $org['info1'], 'info2' => $org['info2'], 'updated' => $org['updated']);
		out($ot);
	}
	else  echo "Error: Can't find org";
}

/* Выдаем кол-во и название свободных и занятых велосипедов */
function free_busy($app_id) {	
	$not_in_rental = '0,';
	$pDB = rent_connect_DB();
	$arr_busy_prod = array();		// Массив занятых товаров
	$arr_free_prod = array();		// Массив смвободных товаров
	
	
	$sql = 'SELECT * FROM `orders` WHERE `status` = \'ACTIVE\' AND `id_rental_org` = '.$app_id;		// Перебираем все активные заказы
	//echo $sql;
	$o = $pDB->get($sql, false, true);	
	foreach ($o as $orders) { 
		$orders_products = json_decode($orders[products]);
		for($i=0; $i < count($orders_products); ++$i){				// Перебираем все заказы
			$count_busy_prod++;			// Кол-во занятых товаров
			$sql_p = 'SELECT * FROM `products` WHERE `id_rent` = '.$orders_products[$i].' AND `id_rental_org` = '.$app_id;		// Выборка названия товара
			$products = $pDB->get($sql_p, true, false);
			//$arr_busy_prod[] = array($products[id_rent] => $products[name]);		// ID (в ПО организ) - название
			$arr_busy_prod[] = array("id" => $products[id_rent], "model" => $products[name]);		// ID (в ПО организ) - название
			$not_in_rental .= $products[id_rent].',';
		}
	}

	$sql = 'SELECT * FROM `products` WHERE `id_rent` NOT IN ('.trim($not_in_rental,',').') AND `active` = 1 AND `id_rental_org` = '.$app_id.' ORDER BY `name`';		// Перебираем все товары кроме активных
	$p = $pDB->get($sql, false, true);	
	foreach ($p as $products) { 
		//$arr_free_prod[] = array($products[id_rent] => $products[name]);
		$arr_free_prod[] = array("id" => $products[id_rent], "model" => $products[name]);
		$count_free_prod++;
	}
	//var_dump($count_busy_prod);
	$ot = array('count_free_prod' => $count_free_prod, 'count_busy_prod' => $count_busy_prod, 'arr_free_prod' => $arr_free_prod, 'arr_busy_prod' => $arr_busy_prod);
	out($ot);
}

/* Выдаем текст для отображения после завершения проката */
function final_text($app_id) {	
	$pDB = rent_connect_DB();
	
	$sql = 'SELECT * FROM `final_texts` WHERE `status` = \'ACTIVE\' AND `id_rental_org` = '.$app_id;		// Перебираем все активные заказы
	$f = $pDB->get($sql, false, true);	
	if($f){
		foreach ($f as $ftexts) {
			$arr_ftexts[] = $ftexts;		// Создаем массив из всех полученных текстов для данного пункт проката
		};
	
		// !!!
		// !!!  Вставить код для выборки одного значения из нескольких
		// !!!
		
		$i = mt_rand(0,count($arr_ftexts)-1);			// Определяем случаный текст
		$ftexts_out = $arr_ftexts[$i];
		$ot = array('text' => $ftexts_out[text], 'buttons' => $ftexts_out[buttons], 'text_yes' => $ftexts_out[text_yes], 'text_no' => $ftexts_out[text_no]);
		out($ot);
	}
	else echo "Error: No text specified";

}


function out($ot) {	
	global $app_id;
	$pDB = rent_connect_DB();
	
	$sql = 'SELECT * FROM `rental_org` WHERE `app_id` = '.$app_id;
	$org = $pDB->get($sql, true, false);	
	if($org) $ot += array('last_ping' => $org['last_ping']);
	$ot += array('timestamp' => time());
	echo json_encode ($ot);
}




/* Функция для записи в БД информации о пинге программы на ПК*/
function save_ping($app_id, $value){
	$pDB = rent_connect_DB();
	
	$sql = 'SELECT * FROM `rental_org` WHERE `app_id` = '.$app_id;		// Проверяем на существование такой организации
	$org = $pDB->get($sql, true, false);	
	if($org){	
		$sql = 'UPDATE `rental_org` SET	`last_ping` = NOW() WHERE `app_id` = :app_id';			// Обновляем время последнего пинга
		$d = array('app_id' => $app_id);
		$pDB->set($sql, $d);
	}
	else die("Error: app_id not present");
	
	echo 'OK_'.$value;											// Возвращаем ОК_ клиенту
}


function log_command($app_id, $cmd){
	$pDB = rent_connect_DB();
	$sql = 'INSERT INTO `log_command` (`server_time`, `id_rental_org`, `ip`, `command`) VALUES (now(), :app_id, :ip, :command)';																	
	$pDB->set($sql, array('app_id' => $app_id, 'ip' => $_SERVER['REMOTE_ADDR'], 'command' => $cmd));

}


/* Функция подключения БД */
function rent_connect_DB(){
	include_once('lib.db.php');

	$pDB = new Pdo_Db();

	$pDB->connect();
	if (!$pDB->isConnected()){
		echo "ERROR_100";	// 100 - Ошибка подключения к БД на сервере
		die();
	}
	return $pDB;
}

/* Логгирование данных */
function request_log($app_id, $value, $cmd){
	$filename_log = 'request.log';
	$time_to_log = date("d.m.y H:i:s");
	$txt_to_log = $time_to_log.' - '.$app_id.' - '.$cmd.' - '.$value.' - '.$_SERVER['REMOTE_ADDR']."\n";
	
	if (is_writable($filename_log)) {
	    if (!$handle_log = fopen($filename_log, 'a')) {
	         echo "Не могу открыть файл ($filename_log)";
	         exit;
	    }
	
	    if (fwrite($handle_log, $txt_to_log) === FALSE) {
	        echo "Не могу произвести запись в файл ($filename_log)";
	        exit;
	    }  
	    fclose($handle_log);
	} else {
	    echo "Файл $filename_log недоступен для записи";
	}
}
?>