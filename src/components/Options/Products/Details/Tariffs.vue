<template>
	<div class="tariffs">
		<ul>
			<li v-for="tariff in tariffs">{{ tariff.name }}</li>
		</ul>

		<button>Добавить</button>
	</div>
</template>

<script>
	export default {
		props: {
			data: String
		},
		data() {
			return {
				ids: this.data.split(',')
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