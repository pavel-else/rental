import axios from 'axios';

const token = 'e7aea113bde05e880e379398a6d104b8';

const simpleRequest = (requestName, params) => {
    return new Promise((resolve, reject) => {
        const url = process.env.VUE_APP_BACKEND_API_URL;
    
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

    // it('getCashFlowSlice: write', async () => {
    //     const entry = {
    //         date_time: 'today',
    //         order_id: 1,
    //         sub_order_id: 1,
    //         type: 'rent_payd',
    //         paid_type: 'card',
    //         value: 100,
    //     };

    //     await simpleRequest('addCashEntry', entry, token);

    //     const params = {
    //         from: '2020-01-01 00:00',
    //         to: '2020-01-01 00:01',
    //     };
    //     const { slice } = await simpleRequest('getCashFlowSlice', params, token);

    //     expect(slice).toHaveLength(1);
    //     expect(slice).toMatchObject(entry);
    // });
});