<?php

trait Customers
{
    private function getCustomers() {
        $sql = '
            SELECT * 
            FROM `customers` 
            WHERE `id_rental_org` = :id_rental_org 
            ORDER BY `customers`.`fname` 
            ASC
        ';

        $d = array (
            'id_rental_org' => $this->app_id
        );

        $result = $this->pDB->get($sql, false, $d);

        $log = $result ? "getCustomers completed" : "getCustomers failed";

        $this->writeLog($log);

        return $result; 
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
                FROM `customers` 
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
                UPDATE `customers` 
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
                    FROM `customers` 
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

            $sql = 'INSERT INTO `customers` (
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
                FROM `customers` 
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
                FROM `customers` 
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
}

?>