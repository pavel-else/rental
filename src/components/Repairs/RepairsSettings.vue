<template>
	<div>
		<table>
			<tbody>
				<tr>
					<th></th>
					<th>Название</th>
					<th>ТО</th>
					<th>Период пробега</th>
				</tr>
				<tr v-for="item in repairTypes" :key="item.id_rent">
					<td><input type="checkbox" title="Используется"></td>
					<td>{{ item.name }}</td>
					<td>
						<input 
							type="checkbox"
							title="Используется в плановом ТО"
							:checked="item.is_plan === '1'"
						>
					</td>
					<td>
						{{ item.period }}
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
	export default {
		computed: {
			repairTypes() {
				return this.$store.getters.repairTypes;
			}
		}
		
	}
</script>