const timeFormat = (ms /**number*/) => {

    // Если время отрицательное, выделяем знак, нормализуем время
    let sign = ''
    if (ms < 0) {
        sign = '-'
        ms = ms * -1
    }

    const num = (val) => {
        val = Math.floor(val)

        return val < 10 ? '0' + val : val
    }

    const sec     = ms  / 1000
    const day     = sec / (3600 * 24)
    const hours   = sec / 3600  % 24
    const minutes = sec / 60 % 60
    const seconds = sec % 60

    const str = Math.floor(day) ? `${Math.floor(day)} дн. ` : ''

    return `${sign} ${str}${num(hours)}:${num(minutes)}:${num(seconds)}`.trim()
}

export default timeFormat