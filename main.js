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

Vue.component('edit-list', {
	props: {
		product : Object,
	},
	data() {
		return {
			order: {
				id: Number,
				productName: String, 
				advance: Number, //Сумма предоплаты
				customerId: Number,
				customerName: String,
				time: Object,
			}
		}
	},
	methods: {
		setOrder() {
			this.order.productName = this.product.name;

			this.$emit("set", this.order)
		},
		closeModal() {
			this.$emit("close")
		},
	},
	template: `
		<form action="" class="show-modal">
			<h3 class="show-modal__caption">Добавление нового ордера проката</h3>
			<table class="table table-bordered">
				<tr>
					<td>Товар</td>
					<td>{{ product.name }}</td>
				</tr>
				<tr>
					<td>ID</td>
					<td>001</td>
				</tr>
				<tr>
					<td>Аванс</td>
					<td><input type="text"></td>
				</tr>
				<tr>
					<td>Клиент</td>
					<td><input type="text"></td>
				</tr>
				<tr>
					<td>Залог</td>
					<td>
						<select>
			              <option value="">Паспорт</option>
			              <option value="">Права</option>
			              <option value="">Еще</option>
			            </select>
			        </td>
				</tr>
				<tr>
					<td>Примечание</td>
					<td><input type="text"></td>
				</tr>
				<tr>
					<td>Акция</td>
					<td>
			            <select>
			              <option value="">Новый Год</option>
			              <option value="">Студент</option>
			              <option value="">Еще</option>
			            </select>
					</td>
				</tr>
				<tr>
					<td>Аксессуары</td>
					<td>
						<select>
			              <option value="">Кресло</option>
			              <option value="">Шлем</option>
			              <option value="">Еще</option>
			            </select>
			        </td>
				</tr>
			</table>

			<div class="show-modal__button-group">
				<button type="button">Печать</button>
				<button type="submit" @click.prevent="setOrder">ОК</button>
				<button type="button" @click="closeModal">Отмена</button>
			</div>

		</form>
	`,
}); 

new Vue({
	el: '#app',
	data: {
		order: {
			name: String,
		},
		showOrderModal: false,
		products: [],
		orders: [],
		max: 10,
		val: 10
	},

	methods: {
		closeModal() {
			this.showOrderModal = false;
		},
		toEdit(item) {
			this.clearOrder();
			this.order.name = item.name;
			this.showOrderModal = true;
		},
		setOrder(order) {
			console.log(order)
			// // let time = new Date();
			// this.order.time = time;
			// this.order.timeStart = time.toLocaleString();
			// this.order.timePlay = 0;

			this.orders.push(order);
			// this.clearOrder();

			this.showOrderModal = false;
			this.products.splice(this.products.indexOf(name), 1);
		},
		unset(item, index) {
			this.products.push(item);
			this.orders.splice(index, 1);
		},
		clearOrder() {
			this.order = {}
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
