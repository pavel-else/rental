import axios from 'axios';
import dayjs from 'dayjs';

const simpleRequest = (requestName, params) => {
    return new Promise((resolve, reject) => {
        const url = process.env.VUE_APP_BACKEND_API_URL;
        const token = 'e7aea113bde05e880e379398a6d104b8';

        axios({ 
            url,
            data: {
                queue : [ { cmd: requestName, value: params }],
                token
            },
            method: 'POST',
        })
        .then(resp => {
            resolve(resp);
        })
        .catch(err => {
            console.log(err)
            reject(err);
        });
    });
};


describe('Test API', () => {
    beforeEach(() => {
        jest.setTimeout(10000);
    });

    it('ping', async () => {
        const  response  = await simpleRequest('ping', {});

        expect(response.status).toBe(200);
        expect(response.data.ping).toBe(1);
    });

    it('getCashFlowSlice: get', async () => {
        const params = {
            from: '2020-01-01 00:00',
            to: '2020-01-01 00:01',
        };
        const response = await simpleRequest('getCashFlowSlice', params);

        expect(response.status).toBe(200);
        expect(response.data.slice).toHaveLength(1);
        expect(response.data.slice[0]).toHaveProperty('id_rent', '1');
    });

    it('getCashFlowSlice: write', async () => {
        const now = dayjs();

        const entry = {
            date_time: now.format('YYYY-MM-DD HH:mm:ss'),
            order_id: '1',
            sub_order_id: '1',
            type: 'order_payment',
            payment_type: 'card',
            value: '500',
        };

        await simpleRequest('addCashEntry', entry);

        const params = {
            from: now.format('YYYY-MM-DD HH:mm:ss'),
            to: now.add(1, 's').format('YYYY-MM-DD HH:mm:ss'),
        };
        const response2 = await simpleRequest('getCashFlowSlice', params);

        expect(response2.data.slice).toHaveLength(1);
        expect(response2.data.slice[0]).toMatchObject(entry);
    });
});