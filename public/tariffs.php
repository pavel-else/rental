<?php

trait Tariffs
{
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
}

?>