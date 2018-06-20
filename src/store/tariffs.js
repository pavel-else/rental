export default {
	state: {
		tariffs: {
			1: [0, 120, 100, 80, 80, 80, 80]
		}
	},
	getters: {
		tariffs(state) {
			return state.tariffs
		}
	}
}