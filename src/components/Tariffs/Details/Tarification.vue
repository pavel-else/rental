<template>
    <div class="tarification t10n">
        <h5 class="t10n__caption">Тарификация</h5>
        <table class="t10n__table tmp">
            <tr>
                <th>
                    <span>Перед</span>
                </th>
                <th>Прокат</th>
                <th>
                    <span>После</span>
                </th>
            </tr>
            <tr>
                <td class="t10n__cell t10n__cell--before t10n-before tmp">
                    <input type="checkbox" id="t10n__before">
                    <div class="t10n__wrap">
                        <span>с
                        <br>
                        <input class="t10n-before__input--time" type="time" value="18:00"></span>
                        <br>
                        <span class="t10n-before__text">не учитывать время перед стартом проката</span>
                        <input class="t10n__input" type="number" value="16">
                        <span>часов</span>
                    </div>
                </td>
                <td class="t10n__cell t10n__cell--center tmp">
                    <div class="t10n__wrap">
                        <div>Начало <br> <input class="t10n__input t10n__input--start" type="time" value="08:00"></div>                                        
                        <div>Конец <br> <input class="t10n__input t10n__input--end" type="time" value="08:00"></div>
                    </div>
                    <div class="t10n__length">Продолжительность, часов: <input class="t10n__input" type="number" value="24"></div> 
                    <div class="t10n__repeat"><input type="checkbox">Повторять</div>
                </td>
                <td class="t10n__cell t10n__cell--before t10n-after tmp">
                    <input type="checkbox" id="t10n__after">
                    <div class="t10n__wrap">
                        <span>до
                        <br>
                        <input class="t10n-before__input--time" type="time" value="12:00"></span>
                        <br>
                        <span class="t10n-before__text">не учитывать время перед стартом проката</span>
                        <input class="t10n__input" type="number" value="4">
                        <span>часа</span>
                    </div>
                </td>
            </tr>
        </table>
    </div>
</template>
<style>
    .t10n {
        border-top: 1px solid black;
        font-size: 14px;
    }
    .t10n__caption {
        text-align: center;
    }
    
    .t10n__table {

    }
    .t10n__cell {
        vertical-align: top;
    }

    .t10n__cell--center {
        width: 40%;
    }

    .t10n__cell--center > .t10n__wrap {
        display: flex;
        justify-content: space-between;
        text-align: center;
    }

    .t10n__length {
        margin-top: 10px;
        text-align: center;
    }

    .t10n__length > .t10n__input {
        text-align: center;
    }

    .t10n__repeat {
        text-align: center;
        margin-top: 10px;
    }

    .t10n__cell--before {
        width: 30%;
        text-align: center;
    }
    .t10n-before__input--time {

    }
    .t10n-before__text {
        display: block;
        margin-top: 5px;
    }
    .t10n__cell--before .t10n__input {
        margin-top: 10px;
        text-align: center;
        width: 90%;
    }
    .t10n-before  .t10n__wrap,
    .t10n-after   .t10n__wrap {
        opacity: 0.2;
    }

    #t10n__before:checked + .t10n__wrap,
    #t10n__after:checked + .t10n__wrap {
        opacity: 1;
    }
    

</style>