<template>
	<div>		
		<div v-for="i in res">{{ i.name }}</div>
	</div>
</template>

<script>
	export default {
		name: 'test',

		data() {
			return {
				a: [1,2,3]
			}
		},

		computed: {
			res() {
				return(this.$store.getters.products)
				console.log(this.$store.getters.products)
			}
		}
	}
</script>