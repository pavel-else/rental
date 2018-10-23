import store from '@/store'

export default (bill, customerId) => {
    const customer = store.getters.customers.find(i => i.id_rent === customerId)
    
    return customer ? Math.round(customer.sale / 100 * bill) : 0
}