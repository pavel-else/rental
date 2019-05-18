import copy from '@/functions/copy';

const getPlanRepairs = ($store) => {

    // Вспомогательная функция возвращает последний ремонт для определенного товара по определенному типу поломки
    // Может вернуть не закрытый ремонт 
    const getLastRepair = (product_id, repairType) => {
        const repairs = copy($store.getters.repairs);
        const filter = repairs.filter(i => i.product_id == product_id && i.repair_type == repairType);

        const lastRepair = filter.reduce((acc, repair) => {
            if (acc === null) {
                acc = repair;
            }

            // Выбираем ремонт с наибольшим эндтайиом
            // Для незакрытых ендтайм равен текущему времени
            if ((Date.parse(repair.end_time) || Date.now()) > Date.parse(acc.end_time)) {
                acc = repair;
            }

            return acc;
        }, null);

        return lastRepair;
    };

    // Перебор всех возможных типов
    // Нахожу последний ремонт по этому типу
    // Проверяю пробег - не пора ли делать плановый ремонт?
    // если да, добавляю в список
    const getPlanRepairs = (product) => {
        const repairTypes = copy($store.getters.repairTypes);

        // Отбираем только плановые
        const filter = repairTypes.filter(i => i.is_plan === '1');

        // Формируем список ТО
        const list = filter.reduce((acc, repairType) => {
            // Находим последний ремонт по заданному типу
            const lastRepair = getLastRepair(product.id_rent, repairType.id_rent);

            // Если товар по этому типу на данный момент уже в ремонте, не выводим его в список запланированных
            if (lastRepair && !lastRepair.end_time) {
                return acc;
            }

            const diff = product.mileage - (lastRepair ? lastRepair.mileage : 0);

            if (diff >= repairType.period) {
                // console.log(product.id_rent, lastRepair.mileage, diff, repairType.period)
                acc.push({
                    product_id: product.id_rent,
                    product_name: product.name,
                    repair_type: repairType.id_rent,
                    repair_type_name: repairType.name,
                    mileage: product.mileage,
                    last_repair: lastRepair ? lastRepair.end_time : '',
                    last_repair_mileage: lastRepair ? lastRepair.mileage : ''
                });
            }

            return acc;
        }, []);

        return list;
    };

    // Перебираю все товары, для каждого генерирую список плановых ремонтов
    const products = copy($store.getters.products);
    const planRepairs = products.reduce((acc, product) => {
        const item = getPlanRepairs(product);

        if (item && item.length > 0) {
            acc = [...acc, ...item];
        }

        return acc;
    }, []);

    return planRepairs;
};

export default getPlanRepairs;