<template>
    <div class="details">
        <h3>Сведения о клиенте</h3>
        <table>
            <tr>
                <td>id</td>
                <td>{{ customer.id_rent }}</td>
            </tr>
            <tr>
                <td>ФИО</td>
                <td>{{ customer.fname }} {{ customer.sname }} {{ customer.tname }}</td>
            </tr>
            <tr>
                <td>Телефон</td>
                <td>{{ customer.phone }}</td>
            </tr>
            <tr>
                <td>Паспорт</td>
                <td>{{ customer.passport }}</td>                
            </tr>
            <tr>
                <td>Адрес</td>                
                <td>{{ customer.address }}</td>
            </tr>
            <tr>
                <td>Дата рождения</td>                
                <td>{{ customer.birth_date }}</td>
            </tr>
            <tr>
                <td>Скидка</td>                
                <td>{{ customer.sale }}</td>
            </tr>
            <tr>
                <td>Баланс</td>                
                <td>{{ customer.balance }}</td>
            </tr>
            <tr>
                <td>Примечание</td>                
                <td>{{ customer.note }}</td>
            </tr>
        </table>       
        
        <div class="details__close" @click="close"></div>    
    </div>
</template>

<script>
    export default {
        props: {
            customer: Object,
        },
        methods: {
            close() {
                this.$emit('close')
            }
        },
    }
</script>

<style scoped>
    .details {
        position: absolute;
        top: 100px;
        left: calc(50% - 150px);
        min-width: 300px;
        padding: 5px 10px;

        border: 1px solid lightgray;
        background-color: #fff;
        box-shadow: 0 2px 5px 0px;  
    }
    td {
        padding: 5px;
    }

    td:first-child {
        padding-right: 10px;
    }
    .details li {
        display: block;
        margin: 0;
    }
    .details__bill td {
        padding-top:  20px;
        font-weight: bold;
    }

    .details__close {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 1px solid lightgray;
        position: absolute;
        top: 3px;
        right: 3px;
        opacity: 0.5;
    }
    .details__close:hover {
        opacity: 1;
        cursor: pointer;
    }
    .details__close::after,
    .details__close::before {
        display: block;
        position: absolute;
        content: '';
        width: 80%;
        height: 2px;
        top: 9px;
        left: 2px;
        background-color: lightgray;
    }
    .details__close::after {
        transform: rotate(45deg);
    }
    .details__close::before {
        transform: rotate(-45deg);
    }
</style>