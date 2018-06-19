export default {
	actions: {
        stopOrder({commit}, order) {
            order.end_time = Math.floor(Date.now() / 1000)

            let time_diff_timestamp = order.end_time * 1000 - Date.parse(order.start_time)
            let time_diff_h = (time_diff_timestamp / 1000 / 60 / 60).toFixed(2) //округл до сотых

            const bill = Math.round(time_diff_h * 80) // * order.tarif

            order.bill = bill

            console.log(order)

            this.state.sendToServer('stopOrder', order, {commit})
        },
	}
}