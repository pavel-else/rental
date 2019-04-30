export default (bill, customer) => {
    if (bill <= 0) {
        return 0;
    }
    
    return customer ? Math.round(customer.sale / 100 * bill) : 0;
}