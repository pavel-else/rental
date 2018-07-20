<template> 
	<div class="tariffs">
		<ul v-if="!list">
			<li v-for="tariff in tariffs">{{ tariff.id_rent }}. {{ tariff.name }}</li>
		</ul>
		
		<List :data="ids" v-if="list" @onSet="onSet($event)"></List>
		<button v-if="!list" @click="onEdit">Редактировать</button>
	</div>
</template>

<script>
	import List from './List'
	export default {
		props: {
			data: String //tariff_ids
		},
		components: {
			List
		},
		data() {
			return {
				ids: this.data ? this.data.split(',') : [],
				list: false
			}
		},
		methods: {
			onEdit(e) {
				e.preventDefault()
				
				this.list = true
			},
			onSet(ids) {
				console.log(ids)
				this.ids = ids
				this.list = false

				this.$emit('setTariffs', ids.join())
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

<style scoped>
	li {
		display: block;
        border-bottom: 1px solid lightgray;
	}
</style>