const getMileage = (time /*ms*/, tariff) => {
    // Тариф нужен для правильного вычисления пробега на посуточных и других не часовых тарифных планах
    if (!tariff || !tariff.type) {
        return false;
    }

    if (time <= 0) {
        return 0;
    }

    const getCountDays = (time) => {
        return Math.round((time / (1000 * 60 * 60 * 24)) * 100) / 100;
    };
    const getCountHours = (time) => {
        return Math.round((time / (1000 * 60 * 60)) * 100) / 100;  
    };

    if ((tariff.type === 'd' || tariff.type === 'f') && (!tariff.mileage || tariff.mileage <= 0)) {
        return getCountHours(time);
    }

    
    switch (tariff.type) {
        case 'h' : return getCountHours(time);
        case 'd' : return getCountDays(time) * tariff.mileage;
        case 'f' : return tariff.mileage;
    }
};
export default getMileage;