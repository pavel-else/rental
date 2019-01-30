<?php

trait Options
{
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
                AND `id_rental_org` = :id_rental_org
            ';

            $d = array(
                'name' => $name,
                'id_rental_org' => $this->app_id
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
                $this->writeLog("function SetOption id: $id  successfully completed.");
            } else {
                $this->writeLog("function SetOption id: $id failed.");
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

            $result = $this->pDB->set($sql, $d);

            $log = $result ? 'set option $key : $value completed' : 'set option $key : $value failed';

            $this->writeLog($log);

            return $result;
        };

        // Пребор всех опций
        // Если опция уже есть - обновляем
        // если нет - пишем в базу новую опцию
        foreach ($options as $key => $value) {            
            $id = $checkID($key);
            
            if ($id) {
                $update($id, $value);
            } else {
                $setOption($key, $value);
            }
        }
    }
}

?>