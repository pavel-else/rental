import store from "../store"

export default  function getBill(tariff_id, time /*ms*/) {
    if (!tariff_id || !time) {
        return 0
    }

    const tariff = store.getters.tariffs.find(tariff => tariff.id_rent == tariff_id)
    
    if (!tariff) {
        return 0
    }

    // Функция для просчета расчасовки
    const h = (tariff, time) => {
        /*
        * Функция возвращает стоимость почасового проката
        * 0. Если время отрицательно - возврат 0
        * 1. Если откатано меньше минималки - возврат минимальной суммы
        * 2. Иначе в счетчике последовательно складываем стоимости каждого часа
        * 3. Последний час будет неполный, поэтому он просчитывается вне счетчика
        * 4. Если откатано больше максималки - возврат максимальной суммы
        */

        // Алиасы
        const minTime = store.getters.options.rent_min_time // Порог минималки, 30 min
        const hh = tariff._h_h // расчасовка
        let last_h = +tariff._h_h[0]
        
        //console.log('time', time)

        if (time < 0) {
            return 0
        }
        if (time < minTime) {
            return tariff._h_min
        }

        let result = 0
        let h = time / 1000 / 3600

        for (let i = 0; i < Math.floor(h); i++) {
            result += hh[i] ? +hh[i] : last_h
            last_h = hh[i] ? +hh[i] : last_h

            if (result > tariff._h_max) {
                return tariff._h_max
            }
        }

        result += last_h * (h - Math.floor(h))

        if (result > tariff._h_max) {
            result = tariff._h_max
        } else if (result < tariff._h_min) {
            result = tariff._h_min
        }
            
        return result           
    }

    const d = (tariff, time) => {
        const days = time / 1000 / (3600 * 24)
        const ceil = Math.ceil(days)

        return ceil * tariff.cost
    }

    switch (tariff.type) {
        case 'd':
            return d(tariff, time)
        break
        case 'f':
            return tariff.cost
        break
        case 'h':
            return h(tariff, time)
        break
    }
}