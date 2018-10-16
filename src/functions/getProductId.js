/**
 * Функция возвращаяет id для нового продукта.
 * Если Параметр Products не задан, возвращает 0
 */
export default (products) => products ? Math.max(...products.map(i => +i.id_rent), 0) + 1 : 0