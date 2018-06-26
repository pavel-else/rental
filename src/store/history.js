export default {
	state: {
		history: []
	},
	mutations: {
		setHistory(state, history) {
			state.history = history
			if (history) console.log('set history')
		}
	},
	getters: {
		history(state) {
			return state.history
		}
	}
}