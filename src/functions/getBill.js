import roundBill from './roundBill'
export default {
    getBill(tariff_id, time /**ms*/) {
        
        const tariff = this.$store.getters.tariffs.find(tariff => tariff.id_rent === tariff_id)

        // Функция для просчета расчасовки
        const h = (tariff, time) => {
            /*
            * Функция возвращает стоимость почасового проката
            * 1. Если откатано меньше минималки - возврат минимальной суммы
            * 2. Иначе в счетчике последовательно складываем стоимости каждого часа
            * 3. Последний час будет неполный, поэтому он просчитывается вне счетчика
            * 4. Если откатано больше максималки - возврат максимальной суммы
            */

            // Алиасы
            const minTime = this.$store.getters.rentMinTime // Порог минималки, 30 min
            const hh = tariff._h_h // расчасовка
            const last_h = +tariff._h_h[tariff._h_h.length - 1]// Последний и последующие часы, 80р
            
            if (time < minTime) {
                return tariff._h_min
            }

            let result = 0
            let h = time / 1000 / 3600
            for (let i = 0; i < Math.floor(h); i++) {
                result += hh[i] ? +hh[i] : last_h

                if (result > tariff._h_max) {
                    return tariff._h_max
                }
            }

            result += last_h * (h - Math.floor(h))

            return result < tariff._h_max ? roundBill(result) : tariff._h_max
        }

        switch (tariff.type) {
            case 'd':
                return tariff.cost
            break
            case 'f':
                return tariff.cost
            break
            case 'h':
                return h(tariff, time)
            break
        }
    }    
}

// time - start - end
// tariff
// return bill