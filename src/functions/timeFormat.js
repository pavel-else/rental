export default {
    timeFormat(ms /**number*/) {
        let sign = ''

        if (ms < 0) {
            sign = '-'
            ms = ms * -1
        }


        function num(val) {
            val = Math.floor(val)

            return val < 10 ? '0' + val : val
        }

        let sec = ms / 1000
        , day = sec / (3600 * 24)
        , hours = sec / 3600  % 24
        , minutes = sec / 60 % 60
        , seconds = sec % 60

        let str = Math.floor(day) ? `${Math.floor(day)} дн. ` : ''

        return `${sign} ${str}${num(hours)}:${num(minutes)}:${num(seconds)}`
    }
}
