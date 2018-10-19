import timeFormat from '@/functions/timeFormat'

describe('timeFormat.js', () => {
    it('should return "00:00:00" for arguments 0', () => {
        expect(timeFormat(0)).toBe("00:00:00");
    });
    it('should return "3 дн. 02:22:53" for arguments 267773000', () => {
        expect(timeFormat(267773000)).toBe("3 дн. 02:22:53");
    });
    it('should return "- 00:02:36" for arguments -156000', () => {
        expect(timeFormat(-156000)).toBe("- 00:02:36");
    });
});