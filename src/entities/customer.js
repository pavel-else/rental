export default class Customer {
  id_rent = null;
  fname;
  sname;
  tname;
  phone;
  passport;
  address;
  birth_date;
  sale;
  balance;
  note;

  constructor(data = {}) {
    this.id_rent = data.id_rent;
    this.fname = data.fname;
    this.sname = data.sname;
    this.tname = data.tname;
    this.phone = data.phone;
    this.passport = data.passport;
    this.address = data.address;
    this.birth_date = data.birth_date;
    this.sale = data.sale;
    this.balance = data.balance;
    this.note = data.note;
  }
}
