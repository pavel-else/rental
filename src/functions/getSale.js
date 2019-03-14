import store from '@/store'

export default (bill, customerId) => {
    try {
        if (isNaN(+customerId)) {
            throw new TypeError('')
        }
    } catch(e) {
        console.log(e)
    }

    if (bill <= 0) {
        return 0
    }

    const customer = store.getters.customers.find(i => i.id_rent === +customerId)
    
    return customer ? Math.round(customer.sale / 100 * bill) : 0
}