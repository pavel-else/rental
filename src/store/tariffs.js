export default {
	state: {
		tariffs: {
			1: {
				id: 1,
				name: 'first',
				h1: 120,
				h2: 100,
				h3: 80,
				h4: 80,
				h5: 80,
				min: 60,
				max: 500
			},
		}
	},
	getters: {
		tariffs(state) {
			return state.tariffs
		}
	}
}