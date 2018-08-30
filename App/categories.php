<?php

trait Categories
{
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
}

?>