import getBillAccessory from './getBillAccessory'

export default (idUsedAccessories, allAccessories, bill) => {
    if (!idUsedAccessories || !allAccessories) {
        return 0
    }

    const split = idUsedAccessories.split(',') // [1, 2]
    const usedAccessories = split ? split.map(i => i.trim()): []

    const billAccessories = usedAccessories.reduce( (acc, id) => {
        const accessory = allAccessories.find(i => i.id_rent === id)

        if (!accessory) {
            console.log(`Acessory ${id} not found`)
        }

        acc += accessory ? getBillAccessory(accessory.type, accessory.value, bill) : 0

        return acc
    }, 0)

    return Number(billAccessories)
}