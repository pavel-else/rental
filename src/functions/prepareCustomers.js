import Customer from '@/entities/customer';

export default (customers = []) => {
  return customers.map((i) => new Customer(i));
};
