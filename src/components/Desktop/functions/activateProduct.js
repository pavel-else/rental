import store         from '../../../store'

export default function activateProduct(subOrder) {
    const product = store.getters.products.find(i => i.id_rent === subOrder.product_id)

    if (product) {
        product.status = 'free'
        
        return product
    }

}