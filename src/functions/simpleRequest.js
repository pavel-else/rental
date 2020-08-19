import axios from 'axios';

const userToken = localStorage.getItem('user-token');

const simpleRequest = (requestName, params, token = userToken) => {
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
            resolve(resp.data);                        
        })
        .catch(err => {
            console.log(err)
            reject(err);
        });
    });
};

export default simpleRequest;
    