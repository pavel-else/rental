import axios from 'axios'

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
            //const url = options.state.url
            const url = 'http://overhost.net/rental2/api_v1/ajax/App/request.php'

            axios({
                method: 'post',
                url,
                data: {
                    queue: state.queue
                }
            })
            .catch(e => {
                console.log(e)
            })
            .then(r => {
                console.log(r)               
            })

            //clear queue
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