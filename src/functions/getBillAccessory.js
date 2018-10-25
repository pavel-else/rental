export default (type, value, bill) => {
    if (!type) {
        return undefined
    }
    if (isNaN(Number(value))) {
        return undefined
    }
    if (value === 0) {
        return 0
    }

    const percentType = (value, bill) => {
        return bill * (value / 100)
    }

    const fixedType = (value) => {
        return +value
    }

    if (type === '%') {
        return percentType(value, bill)
    }
    if (type === 'р') {
        return fixedType(value)
    }
}