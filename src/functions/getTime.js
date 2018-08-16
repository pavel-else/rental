/*
* Если время стопордера существует, вернем разницу времени стоп - старт,
* если стопа еще не было, возвращаем разницу текущее время - старт
*/

export default {
    getTime(start, end) {
        const now = this.$store.getters.now

        const start_time = Date.parse(start)

        const end_time = end ? Date.parse(end) : now    

        const diff = end_time ? end_time - start_time : now - start_time

        return diff
    }
}