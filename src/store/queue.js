export default {
	state: {
		queue: []
	},
	mutations: {
		addToQueue(state, cell) {
			state.queue.push(cell)

			console.log('addToQueue', cell)
		},
		sendQueue(state) {
			//send queue
			console.log('send queue', state.queue)

			state.queue = []
		}
	},
	actions: {
		addToQueue({commit}, {cmd, value}) {
			if (!cmd) {
				console.log('empty cmd')
				return
			}

			commit('addToQueue', [cmd, value])
		},
		sendQueue({commit}) {
			commit('sendQueue')
		}
	},
	getters: {}
}