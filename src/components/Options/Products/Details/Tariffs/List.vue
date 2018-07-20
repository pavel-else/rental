<template>
	<div class="list">
		
	</div>
</template>
<script>
	props: {
		data: Object
	},
	data() {
		return {
			tariffs: this.data
		}
	},
	computed: {
		tariffs() {
			return this.$store.getters.tariffs
		}
	}

</script>
