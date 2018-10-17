/*
* Если время стопордера существует, вернем разницу времени стоп - старт,
* если стопа еще не было, возвращаем разницу текущее время - старт
*/

export default {
    getTime(start, end) {
        const start_time = Date.parse(start)
        return end - start_time
    }
}