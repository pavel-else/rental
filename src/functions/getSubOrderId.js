export default {
    getSubOrderId() {
        return Math.max(...this.$store.getters.subOrders.map(i => +i.id_rent)) + 1
    }    
}