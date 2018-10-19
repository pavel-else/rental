import store         from '../../../store'

export default function getSale(bill, order) {
    const customer = store.getters.customers.find(i => i.id_rent === order.customer_id)
    
    return customer ? Math.round(customer.sale / 100 * bill) : 0
}