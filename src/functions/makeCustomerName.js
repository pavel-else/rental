const makeCustomerName = (customer) => {	
    const f = customer.fname ? customer.fname : '';
    const s = customer.sname ? customer.sname : '';
    const t = customer.tname ? customer.tname : '';

    return `${ f } ${ s } ${ t }`.trim();
};
export default makeCustomerName;