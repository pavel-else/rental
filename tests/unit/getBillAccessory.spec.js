import getBillAccessory from '@/functions/getBillAccessory'

describe('getBillAccessory tests', () => {
    it('should return 0 for empty arguments ', () => {
        expect(getBillAccessory()).toBe(undefined);
    });
    it('should return 150 for arguments ["р", 150]', () => {
        expect(getBillAccessory('р', 150)).toBe(150);
    });
    it('should return 150 for arguments ["%", 10, 100]', () => {
        expect(getBillAccessory('%', 10, 100)).toBe(10);
    });
});