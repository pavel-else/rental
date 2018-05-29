Vue.component('product-list', {
	props: {
		products: Array
	},
	methods: {
		toEdit(item, index) {
			this.$emit("edit", item, index);
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
			<tr v-for="(item, index) in products" @click="toEdit(item, index)">
				<td>{{ index + 1}}</td>
				<td>{{ item.name}}</td>
			</tr>
		</table>
	</div>
	`
})

Vue.component('order-list', {
	props: {
		orders: Array,
	},
	methods: {
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
	template: `
		<div class="snippet snippet__orders">
			<h3>В прокате</h3>
			<table class="table table-bordered">
				<tr>
					<th>№</th>
					<th>Товар</th>
					<th>Старт</th>
					<th>В прокате</th>
				</tr>
				<tr v-for="(item, index) in orders" @click="unset(item, index)">
					<td>{{ index + 1 }}</td>
					<td>{{ item.productName }}</td>
					<td>{{ item.timeStart }}</td>
					<td>{{ timeFormat(item.timePlay) }}</td>
				</tr>
			</table>
		</div>
	`
})

Vue.component('edit-list', {
	props: {
		customers: Array,
		product : Object,
		position: Number, //Позиция в массиве, для последующего удаления
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
				timeStart: String,
				timePlay: Number,
			}
		}
	},
	methods: {
		setOrder() {
			this.order.productName = this.product.name;
			let time = new Date();
			this.order.time = time;
			this.order.timeStart = time.toLocaleString();
			this.order.timePlay = 0;

			this.$emit("set", this.order, this.position)
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
					<td>

						<select name="customer-list" class="customer__select-list">
							<option value="" v-for="(item) in customers">{{item.fname}} {{item.sname}}</option>
						</select>
					</td>
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
		orders: [],
		products: [],
		customers: [],
		order: {
			name: String,
		},
		productPosition: Number,
		showOrderModal: false,
	},

	methods: {
		closeModal() {
			this.showOrderModal = false;
		},
		toEdit(item, index) {
			this.clearOrder();
			this.order.name = item.name;
			this.productPosition = index;
			this.showOrderModal = true;
		},
		setOrder(order) {
			this.orders.push(order);
			// this.clearOrder();

			this.products.splice(this.productPosition, 1);
			this.showOrderModal = false;
		},
		unset(item, index) {
			this.products.push(item);
			this.orders.splice(index, 1);
		},
	},
	created() {
		//Нужно добавить обработку возможных ошибок
		axios.get('http://overhost.net/rental2/api_v1/te.php', 'cmd=getInitial')
		.catch(error => console.log('AXIOS' , error))
		.then(response => {
			this.products = response.data.products;
			this.orders = response.data.orders;
			this.customers = response.data.customers;
			console.log(response.data)
		})

		var body = 'cmd=' + 'getInitial' +  '&value=' + '';
		request = new XMLHttpRequest();
		
		request.onreadystatechange = function() {
		      if (request.readyState == 4) {
		            responseBody = request.responseText;
		            data = JSON.parse(responseBody);
		            console.log(data);
		            // alert(data['message']);
		      }
		};

		request.open('GET', 'http://overhost.net/rental2/api_v1/te.php', true);
		request.send(body);

		setInterval(function(orders) {
			for (let order = 0; order < orders.length; order++) {
				orders[order].timePlay = new Date() - orders[order].time;
			}
		}, 1000, this.orders);
	}

})
