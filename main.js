new Vue({
	el: '.sample',
	data: {
		showModal: false,
		// showModal: true,
		modalProductName: '',

		products: false,
		i2: []
	},
	methods: {
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

		toEdit(item) {
			this.showModal = true;
			this.modalProductName = item.name;
		},
		set(name) {
			this.i2.push({name: name});
			this.showModal = false;
			this.products.splice(this.products.indexOf(name), 1);
			console.log(name)
		},
		unset(item, index) {
			this.products.push(item);
			this.i2.splice(index, 1);
		}
	},
	created() {
		this.products = this.getData();
		//Нужно добавить обработку возможных ошибок
	}
})