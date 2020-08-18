import simpleRequest from '@/functions/simpleRequest';

const token = 'e7aea113bde05e880e379398a6d104b8';

describe('Test API', () => {
    it('ping', async () => {
        const  { ping }  = await simpleRequest('ping', {}, token);
        expect(ping).toBe(1);
    });

    it('getCashFlowSlice: get', async () => {
        const params = {
            from: '2020-01-01 00:00',
            to: '2020-01-01 00:01',
        };
        const { slice } = await simpleRequest('getCashFlowSlice', params, token);

        expect(slice).toHaveLength(1);
        expect(slice[0]).toHaveProperty('id_rental_org', '8800000002');
    });

    it('getCashFlowSlice: write', async () => {
        const entry = {
            date_time: 'today',
            order_id: 1,
            sub_order_id: 1,
            type: 'rent_payd',
            paid_type: 'card',
            value: 100,
        };

        await simpleRequest('addCashEntry', entry, token);

        const params = {
            from: '2020-01-01 00:00',
            to: '2020-01-01 00:01',
        };
        const { slice } = await simpleRequest('getCashFlowSlice', params, token);

        expect(slice).toHaveLength(1);
        expect(slice).toMatchObject(entry);
    });
});