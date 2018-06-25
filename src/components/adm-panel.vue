<template>
	<div>
		<ul class="adm_list">
			<li><a href="#">Прокат</a></li>
			<li><a href="#">Клиенты</a></li>
			<li><a href="#" @click="openHistory">История</a></li>
			<li><a href="#">Настройки</a></li>
		</ul></div>
</template>
<script>
	export default {
		name: 'admPanel',
		methods: {
			openHistory() {
				console.log('open')
			}
		}
	}
</script>

<style>
	.adm_list {
		margin-bottom: 50px;
	}
	a:hover {
		text-decoration: none;

	}
</style>