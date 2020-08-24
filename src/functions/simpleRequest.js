import axios from 'axios';

const simpleRequest = (requestName, params) => {
    return new Promise((resolve, reject) => {
        const url = process.env.VUE_APP_BACKEND_API_URL;
        const token = localStorage.getItem('user-token');
    
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
