import simpleRequest from '@/functions/simpleRequest';

const token = 'e7aea113bde05e880e379398a6d104b8';

describe('Test API', () => {
    it('ping', async () => {
        const  { ping }  = await simpleRequest('ping', {}, token);
        expect(ping).toBe(1);
    });

    it('getCashFlowSlice', async () => {
        const params = {
            from: '2020-01-01 00:00',
            to: '2020-01-01 00:01',
        };
        const { slice } = await simpleRequest('getCashFlowSlice', params, token);

        expect(slice).toHaveLength(1);
        expect(slice[0]).toHaveProperty('id_rental_org', '8800000002');
    });
});