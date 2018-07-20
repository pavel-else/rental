<template>
	<div class="tariffs">
		<ul>
			<li v-for="tariff in tariffs">{{ tariff.name }}</li>
		</ul>
		
		<List :data="tariffs" v-if="list"></List>
		<button @click="onEdit">Редактировать</button>
	</div>
</template>

<script>
	import List from './List'
	export default {
		props: {
			data: String
		},
		components: {
			List
		},
		data() {
			return {
				ids: this.data.split(','),
				list: false
			}
		},
		methods: {
			onEdit(e) {
				e.preventDefault()
				
				this.list = true
			}
		},
		computed: {
			tariffs() {
				const tariffs = this.$store.getters.tariffs

                return this.ids.reduce((acc, id) => {
                    const tariff = tariffs.find(tariff => tariff.id_rent === id)

                    if (tariff) {
                        acc.push(tariff)
                    }

                    return acc
                }, [])               
            }
		}

	}
</script>

<style>
	li {
		display: block;
        border-bottom: 1px solid lightgray;
	}
</style>