export default {
    getOrderId(isNew) {

        if (isNew) {
            console.log('issssNewww')
            return Math.max(...this.$store.getters.history.map(o => +o.order_id)) + 1
        }
        const lastOrderID = this.$store.getters.options.lastOrderID
        const lastOrderTime = this.$store.getters.options.lastOrderTime
        const lastOrderInterval = this.$store.getters.options.lastOrderInterval
        const now = this.$store.getters.options.now

        // Если последнего id Не существ. или не указано его время, верну новый id
        if (!lastOrderID || !lastOrderTime) {
            return Math.max(...this.$store.getters.history.map(o => +o.order_id)) + 1
        }

        // Если ордера добавляются один за другим, то выдаю id последнего
        if ((now - lastOrderTime) < lastOrderInterval) {
            console.log(now - lastOrderTime - lastOrderInterval)
            return lastOrderID
        } else {
            return Math.max(...this.$store.getters.history.map(o => +o.order_id)) + 1
        }
    }    
}