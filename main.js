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
		set(item, index) {
			this.showModal = true;
			this.modalProductName = item.name;
			// this.i2.push(item);
			// this.i1.splice(index, 1);
		},
		unset(item, index) {
			this.i1.push(item);
			this.i2.splice(index, 1);
		}
	}
})