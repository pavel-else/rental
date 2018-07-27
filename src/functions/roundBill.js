import store from "../store"

export default  function roundBill(bill) {
	const round = store.getters.rent_round_bill

    return round > 1 ? Math.ceil(bill / round) * round : Math.ceil(bill)
}



