new Vue({
	el: '.sample',
	data: {
		showOrderModal: false,
		order: {
			show: false,
			id: Number,
			name: String,
			customer: String,
			timeStart: Number,
			timeEnd: Number,
			timeFull: Number,
			bill: Boolean,
			note: String,
			saleId: Number,
		},

		products: false,
		orders: []
	},
	methods: {
		toEdit(item) {
			this.showOrderModal = true;
			this.order.name = item.name;
			this.order.timeStart = new Date();
		},
		setOrder() {
			this.orders.push(this.order);
			this.showOrderModal = false;
			this.products.splice(this.products.indexOf(name), 1);
		},
		unset(item, index) {
			this.products.push(item);
			this.orders.splice(index, 1);
		},
		getData() {
			//Эммитирует запрос к БД
			return [
				{
					id: 1,
					name: 'GT Laguna [White]',
					img: '',
					cost: 16500,
					active: true,
					tarif_id: 1,
				},
				{
					id: 2,
					name: 'Mongoose Fireball',
					img: '',
					cost: 20000,
					active: true,
					tarif_id: 1,
				},
				{
					id: 1,
					name: 'Stels 530',
					img: '',
					cost: 8000,
					active: true,
					tarif_id: 2,
				},
				{
					id: 1,
					name: 'BMX',
					img: '',
					cost: 7000,
					active: true,
					tarif_id: 2,
				},
			]
		},
	},
	created() {
		this.products = this.getData();
		//Нужно добавить обработку возможных ошибок
	}
})