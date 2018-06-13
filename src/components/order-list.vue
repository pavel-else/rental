<template>
    <div class="snippet snippet__orders">
        <h3>В прокате</h3>
        <table class="table table-bordered">
            <tr v-for="(item, index) in orders" @click="unset(item, index)">
                <td class="ord__td-1">{{ index + 1 }}</td>
                <td class="ord__td-2">{{ item.order_id_position }}</td>
                <td>
                    <tr v-for="(sbitem, index) in item.products">
                        <td class="ord__td-3">{{ sbitem.product_id }}</td>
                        <td class="ord__td-4">{{ sbitem.name }}</td>
                        <td class="ord__td-5">{{ item.start_time }}</td>
                        <td class="ord__td-6">{{ getTimePlay(item.start_time, item.timeDelay) }}</td>
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

	        getTimePlay(time, delay) {
	            var date = new Date(time);
	            var now = new Date(this.now);

	            return this.timeFormat(now - date);
	        },
	    },

	    computed: {
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
</style>