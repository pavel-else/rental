export default {
    billAccess(accessories, billRent) {
        return accessories ? accessories.reduce((acc, item) => {
            acc = item.type == "%" 
                ? acc + billRent * (item.value / 100)
                : acc + +item.value

            return acc
        }, 0) : null
    },
 
}