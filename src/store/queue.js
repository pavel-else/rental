export default {
	state: {
		queue: []
	},
	mutations: {
		addToQueue(state, cell) {
			state.queue.push(cell)
		},
		sendQueue(state) {
			//send queue
			console.log(state.queue)
		}
	},
	actions: {
		addToQueue({commit}, {cmd, value}) {
			if (!cmd) {
				console.log('empty cmd')
				return
			}
		}
	},
	getters: {}
}