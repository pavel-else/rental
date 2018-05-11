new Vue({
	el: '.sample',
	data: {
		showModal: false,
		// showModal: true,
		modalProductName: '',

		i1: [
			{
				id: 1,
				name: 'bmx'
			},
			{
				id: 2,
				name: 'forvard'
			},
			{
				id: 3,
				name: 'stells'
			},
		],
		i2: []
	},
	methods: {
		toEdit(item) {
			this.showModal = true;
			this.modalProductName = item.name;
		},
		set(name) {
			this.i2.push({name: name});
			this.showModal = false;
			this.i1.splice(this.i1.indexOf(name), 1);
			console.log(name)
		},
		unset(item, index) {
			this.i1.push(item);
			this.i2.splice(index, 1);
		}
	}
})