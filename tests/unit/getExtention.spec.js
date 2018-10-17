import getExtention from '@/functions/getExtention'

describe('getExtention tests', () => {
    it('should return .jpg for arguments "image/jpeg"', () => {
        expect(getExtention('image/jpeg')).toBe('.jpg');
    });

    it('should return .png for arguments "image/png"', () => {
        expect(getExtention('image/png')).toBe('.png');
    });

    it('should return "undefined" for undefined extention', () => {
        expect(getExtention('image/gif')).toBe(undefined);
    });
});