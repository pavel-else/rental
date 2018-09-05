/*
* Если время стопордера существует, вернем разницу времени стоп - старт,
* если стопа еще не было, возвращаем разницу текущее время - старт
*/

export default {
    getTime(start, end) {
        const start_time = Date.parse(start)

        const end_time = end

        const diff = end - start_time

        return diff
    }
}