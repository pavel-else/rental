Vue.component('product-list', {
	props: {
		products: Array
	},
	methods: {
		toEdit(item) {
			this.$emit("edit", item);
		}
	},
	template: `
	<div class="snippet snippet__products">
		<h3>Свободные</h3>
		<table class="table table-bordered">
			<tr>
				<th>№</th>
				<th>Товар</th>
			</tr>
			<tr v-for="(item, index) in products" @click="toEdit(item)">
				<td>{{ index + 1}}</td>
				<td>{{ item.name}}</td>
			</tr>
		</table>
	</div>
	`
})

new Vue({
	el: '.sample',
	data: {
		showOrderModal: false,
		order: {},

		products: [],
		orders: [],
		max: 10,
		val: 10
	},
	methods: {
		toEdit(item) {
			this.clearOrder();
			this.showOrderModal = true;
			this.order.name = item.name;
		},
		setOrder() {
			let time = new Date();
			this.order.time = time;
			this.order.timeStart = time.toLocaleString();
			this.order.timePlay = 0;

			this.orders.push(this.order);
			this.clearOrder();

			this.showOrderModal = false;
			this.products.splice(this.products.indexOf(name), 1);
		},
		unset(item, index) {
			this.products.push(item);
			this.orders.splice(index, 1);
		},
		clearOrder() {
			this.order = {
				id: Number,
				name: String,
				customer: String,
				time: Date,
				timeStart: String,
				timePlay: Date,
				timeEnd: Number,
				timeFull: Number,
				bill: Boolean,
				note: String,
				saleId: Number,
			}
		},
		timeFormat (ms/**number*/){
		    function num(val){
		        val = Math.floor(val);
		        return val < 10 ? '0' + val : val;
		    }
		    
	        var sec = ms / 1000
	          , hours = sec / 3600  % 24
	          , minutes = sec / 60 % 60
	          , seconds = sec % 60
	        ;

		    return num(hours) + ":" + num(minutes) + ":" + num(seconds);
		},
	},
	created() {
		//Нужно добавить обработку возможных ошибок
		axios.get('http://overhost.net/rental2/api_v1/ajax/te.php')
		.then(response => {
			this.products = response.data
		})

		setInterval(function(orders) {
			for (let order = 0; order < orders.length; order++) {
				orders[order].timePlay = new Date() - orders[order].time;
			}
		}, 1000, this.orders);
	}

})
