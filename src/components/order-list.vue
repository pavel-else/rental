<template>
    <div class="snippet snippet__orders">
        <h3>В прокате</h3>
        <p class="empty" v-if="orders.length == 0">Ативные ордера отсутствуют</p>
        <table class="table table-bordered">
        	<div>{{ sd }}</div>
            <tr v-for="(item, index) in orders">
                <td class="ord__td-1">{{ index + 1 }}</td>
                <td class="ord__td-2">{{ item.order_id_position }}</td>
                <td class="ord__td-5">{{ item.start_time }}</td>
                <td>
                    <tr v-for="(subitem, index) in item.products">
                        <td class="ord__td-3">{{ subitem.product_id }}</td>
                        <td class="ord__td-4">{{ subitem.name }}</td>
                        <td class="ord__td-6">{{ getTimePlay(item, subitem) }}</td>
                        <td v-if="subitem.bill > 0">{{subitem.bill}}р</td>
                        <td class=" ord__td-6 stop-order" @click="stopOrder(item, subitem)">x</td>
                    </tr>
                </td>
            </tr>
        </table>
    </div>
</template>

<script>
	export default {
		name: 'orderList',

	    props: {
	        now: null,
	    },

	    methods: {
	        timeFormat (ms/**number*/){
	            if (ms < 0) ms = 0;

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

	        getTimePlay(item, subitem) {
	            const start_time = Date.parse(item.start_time)
	            const end_time = subitem.end_time ? Date.parse(subitem.end_time) : null
	            const diff = end_time ? end_time - start_time : this.now - start_time

	            return this.timeFormat(diff)
	        },

	        stopOrder(item, subitem) {
	        	const order = subitem
	        	order.start_time = item.start_time
	        	//console.log(order)

	        	this.$store.dispatch('stopOrder', order)
	        }
	    },

	    computed: {
	    	sd() {
	    		return this.$store.getters.now
	    	},
	    	orders() {
	    		return this.$store.getters.orders
	    	},
	    	products() {
	    		return this.$store.getters.products
	    	},
	    }
	}
</script>

<style scoped>
	.empty {
		padding: 0 20px;
	}
	.stop-order {
		opacity: 0;
	}
	.stop-order:hover {
		opacity: 1;
		cursor: pointer;
		text-align: center;
	}


	.table td {
		padding: 5px;
		border: 1px solid lightgray;
		box-sizing: border-box;
	}
	.table th {
		text-align: center;
	}
	.ord__td-1 {
		width: 25px;
	}
	.ord__td-2 {
		width: 40px;
	}
	.ord__td-3 {
		width: 25px;
	}
	.ord__td-4 {
		width: 180px;
	}
	.ord__td-5 {
		width: 120px;
	}
	.ord__td-6 {
		width: 25px;
	}
	.ord__td-7 {
		width: 25px;
	}
</style>