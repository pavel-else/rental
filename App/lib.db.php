<?php

define('_DB_HOST', 'localhost');

// define('_DB_NAME', 'rental2');
// define('_DB_USER', 'rental2');
// define('_DB_PASS', 'j0K_f3-kN5mO8p_E3');

// define('_DB_NAME', 'rental_test');
// define('_DB_USER', 'rental');
// define('_DB_PASS', 'o9Pd_fr-6bSfe5Qm');

define('_DB_charset', 'UTF8');


	/**
	 * Class db
	 */
	class Pdo_Db extends PDO {
		private $connection;
		private static $counts = array('get' => 0, 'set' => 0);

		public $sqls = array();

		/**
		 * Подключены ли к БД или нет
		 * @var bool $isConnected
		 */
		private $isConnected = false;

		public function __construct() {

		}

		/**
		 * Подключение к БД
		 *
		 * @param string $host
		 * @param string $user
		 * @param string $pass
		 * @param string $name
		 * @param string $charset
		 */
		public function connect() {
			$dsn = 'mysql:dbname='._DB_NAME.';host='._DB_HOST;

			try {
				$this->connection = new PDO($dsn, _DB_USER, _DB_PASS, array(
					PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES '._DB_charset,
					PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
				));
				$this->isConnected = true;
				$this->dbName = _DB_NAME;
			} catch (PDOException $e) {
				echo $e->getMessage();
			}
		}

		public function preGet($sql, $fetch, $data) {
			try {
				if (is_array($fetch)) {
					var_dump($sql);
					die('fetch is array');
				}
				if (is_array($data)) {
					$query = $this->connection->prepare($sql);
					$query->execute($data);
				} else {
					$query = $this->connection->query($sql);
				}
				return $query;
			} catch (PDOException $e) {
				$errString = 'Ошибка в SQL запросе: <pre>'.$e->getMessage().'</pre>';
				$errString .= '<pre>SQL: <b>'.$sql.'</b></pre>';
				$errString .= 'Массив: <b><pre>'.print_r($data, 1).'</b></pre>';
				$errString .= '<pre>Fetch: <b>'.($fetch ? 'True' : 'False').'</b></pre>';
				echo $errString;
			}

			return false;
		}

		/**
		 * Выборка из БД
		 *
		 * @param string $sql
		 * @param bool $fetch
		 * @param bool $data
		 * @return bool|mixed
		 */
		public function get($sql, $fetch = false, $data = false) {
			$query = $this->preGet($sql, $fetch, $data);

			if (!$query) return false;
			$query->setFetchMode(PDO::FETCH_ASSOC);
			self::$counts['get']++;

			$this->sqls[] = $sql;
			return ($fetch) ? $query->fetch() : $query->fetchAll();

		}

		/**
		 * Запись, обновление, удаление данных из БД
		 *
		 * @param string $sql
		 * @param bool $data
		 * @return bool|int
		 */
		public function set($sql, $data = false) {
			try {
				self::$counts['set']++;
				if (is_array($data)) {
					$query = $this->connection->prepare($sql);
					$result = $query->execute($data);
					//print_r($data);
					if (!$result) return false;

					$this->sqls[] = $sql;
					return $query->rowCount();
				} else {
					$query = $this->connection->query($sql);

					if ($query) {
						$this->sqls[] = $sql;
					}

					return $query ? $query->rowCount() : false;
				}
			} catch (PDOException $e) {
					$errString = 'Ошибка в выполнении SQL запроса: <pre>'.$e->getMessage().'</pre>';
					$errString .= '<pre>SQL: <b>'.$sql.'</b></pre>';
					$errString .= 'Массив: <b><pre>'.print_r($data, 1).'</b></pre>';
					echo $errString;
			}
		}

		/**
		 * Get last insert ID
		 *
		 * @return int
		 */
		public function getLastId() {
			return (int)$this->connection->lastInsertId();
		}

		public function getCountStats($key) {
			return self::$counts[$key];
		}


		/**
		 * @return bool
		 */
		public function isConnected() {
			return $this->isConnected;
		}
	}
?>