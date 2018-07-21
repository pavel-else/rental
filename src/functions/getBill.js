export default function getBill(item, tariff_id) {
    
    const tariff = this.$store.getters.tariffs.find(tariff => tariff.id_rent === tariff_id)

    if (tariff.type === 'd') {
        return tariff.cost
    }

    if (tariff.type === 'f') {
        return tariff.cost
    }

    if (tariff.type === 'h') {
        return tariff._h_h
    }

    
}

// time - start - end
// tariff
// return bill