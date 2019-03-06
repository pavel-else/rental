export default (fullDate /*str*/, mod) => {
    // Если передан пустой параметр, генерируется дата от сегодняшнего дня
    if (!fullDate) {
        fullDate = new Date().toString();
    }

    const objectDate = new Date(fullDate)

    if (isNaN(objectDate)) {
        console.log('date.js, makeDate', 'error to parse date', { fullDate })
        return undefined
    }

    const year = objectDate.getFullYear();
    const month = +objectDate.getMonth() + 1 <= 9 ? `0${+objectDate.getMonth() + 1}` : `${+objectDate.getMonth() + 1}`;
    const day = +objectDate.getDate() <= 9 ? `0${+objectDate.getDate()}` : objectDate.getDate();
    const hours = +objectDate.getHours() <= 9 ? `0${+objectDate.getHours()}` : objectDate.getHours();
    const minutes = +objectDate.getMinutes() <= 9 ? `0${+objectDate.getMinutes()}` : objectDate.getMinutes();

    if (!year || !month || !day) {
        console.log('date.js, makeDate', 'error to parse date', { year, month, day });
        return undefined;
    }

    if (mod && (!hours || !minutes)) {
        console.log('date.js, makeDate', 'error to parse hourse', { mod, hours });
        return undefined;
    }

    return mod ? `${year}-${month}-${day} ${hours}:${minutes}` :`${year}-${month}-${day}`;
};