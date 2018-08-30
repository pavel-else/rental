import store from "../store"

export default  function roundBill(bill) {
    const round = store.getters.options.rent_round_bill

    return round > 1 ? Math.round(bill / round) * round : Math.round(bill)
}