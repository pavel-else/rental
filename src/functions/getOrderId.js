export default {
    getOrderId() {
        return Math.max(...this.$store.getters.history.map(o => +o.order_id), 0) + 1
    }    
}