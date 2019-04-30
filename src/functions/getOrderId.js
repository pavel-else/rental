export default {
    getOrderId() {
        return Math.max(...this.$store.getters.history.map(i => +i.id_rent), 0) + 1
    }    
}