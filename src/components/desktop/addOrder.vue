<template>
	<div class="canvas">
		<div class="details">
			{{product}}
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			product: Object
		},
		data() {
			return {
				order: {
					status: 'ACTIVE',

	                products: [
	                    this.product.id_rent,
	                ],					
				},
				customer: {},
				
			}
		}

	}
</script>
