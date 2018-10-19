import getProductId from '@/functions/getProductId'

describe('getProductId tests', () => {
    it('should return 3 for arguments [1, 2]', () => {
        expect(getProductId([{ id_rent: 1 }, { id_rent: 2 }])).toBe(3);
    });
    it('should return 4 for arguments [1, 3]', () => {
        expect(getProductId([{ id_rent: 1 }, { id_rent: 3 }])).toBe(4);
    });
    it('should return 1 for arguments []', () => {
        expect(getProductId([])).toBe(1);
    });
    it('should return 0 for not arguments ', () => {
        expect(getProductId()).toBe(0);
    });
});