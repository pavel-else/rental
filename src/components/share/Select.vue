<template>
		<ul>
			<li v-for="item in items">
				<input 
					type="radio" 
					name="select" 
					v-model="data.default" 
					@change="onSet"
					checked="item.default"
				>
				{{ item.name }}
			</li>
		</ul>
</template>
<script>
	export default {
		props: {
			data: Array
		},
		data() {
			return {
				check: false,
				items: this.data.map(item => {
					console.log(item)
					return item
				})
			}
		},
		methods: {
			onSet() {
				console.log(this.data)
			}
		},

	}
</script>

<style scoped>
	li {
		display: block;
		border: 1px solid lightgray;
	}
</style>