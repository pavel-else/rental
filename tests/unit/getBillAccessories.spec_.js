import getBillAccessories from '@/functions/getBillAccessories'

const accessories = [
	{
		id_rent: "1",
		name: "Детское кресло",
		type: "%",
		value: "30"
	},
	{
		id_rent: "2",
		name: "Велозамок",
		type: "р",
		value: "50"
	},
	{
		id_rent: "3",
		name: "Защитный шлем",
		type: "р",
		value: "150"
	}
]

describe('getBillAccessories tests', () => {
    it('test 1', () => {
        expect(getBillAccessories()).toBe(0);
    });
    it('test 2', () => {
        expect(typeof(getBillAccessories('1', accessories, 100))).toBe('number');
    });
    it('test 3', () => {
        expect(getBillAccessories('1', accessories, 100)).toBe(30);
    });
    it('test 4', () => {
        expect(getBillAccessories('3', accessories)).toBe(150);
    });
    it('test 5', () => {
        expect(getBillAccessories('1, 2', accessories, 100)).toBe(80);
    });
});