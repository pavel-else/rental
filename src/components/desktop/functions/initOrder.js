export default function initOrder() {
    const order = {}
    
    order.status            = null              
    order.start_time        = null         
    order.order_id          = null           
    order.order_id_position = null  
    order.advance           = null            
    order.note              = null               
    order.products          = null
    order.promotion         = null          
    order.customer_id       = null        
    order.deposit           = null

    return order
}
