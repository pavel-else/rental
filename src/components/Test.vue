<template>
	<div>		
		<div>result: {{ res }}</div>
		<button @click="onClick">send</button>
	</div>
</template>

<script>
	import axios from 'axios'
	export default {
		name: 'test',

		data() {
			return {
				result: null
			}
		},

		methods: {
			onClick() {
				const url = 'http://overhost.net/rental2/api_v1/ajax/App/request.php'

	            axios({
	                method: 'post',
	                url,
	                data: {
	                    cmds: 'test',
	                    value: Math.floor(Date.now() / 1000)
	                }
	            })
	            .catch(e => {
	                console.log(e)
	            })
	            .then(r => {this.result = r.data})
	            				
			}
		},
		computed: {
			res() {
				return this.result
			}
		}
	}
</script>