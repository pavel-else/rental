const time = (format, date) => {
    if (!date || isNaN(Date.parse(date) || Date.parse(date) < 0)) {
        console.log('Date.parse error!');
        return false;
    }

    const getMonth = (date) => {
        const position = date.getMonth();
        // const months = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
        const months2 = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

        return months2[position];
    };

    const getYear = (date) => {
        const fullYear = String(date.getFullYear());
        return fullYear.substr(2, 2);
    };

    const getHours = (date) => {
        const hours = date.getHours();
        return 0 < hours && hours < 10 ? `0${ hours }` : `${ hours }`;
    };
    const getMinutes = (date) => {
        const minutes = date.getMinutes();
        return 0 < minutes && minutes < 10 ? `0${ minutes }` : `${ minutes }`;
    };

    const dateObject = new Date(date);

    const y = getYear(dateObject);
    const m = getMonth(dateObject);
    const d = dateObject.getDate();
    const h = getHours(dateObject);
    const min = getMinutes(dateObject);

    switch (format) {
        case 'd.m.y h:min': 
            return `${ d }.${ m }.${ y }  ${ h }:${ min }`;
        case 'd.m.y': 
            return `${ d }.${ m }.${ y }`;
    }    
};

export default time;