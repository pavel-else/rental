import axios from 'axios';
export default {
    state: {
        initCmds: []
    },
    actions: {
        ping({ commit, getters }, { url, counter, serverName }) {

            return new Promise((resolve, reject) => {
                const queue = [{ 'cmd': 'ping' }];

                axios({ 
                    url,
                    data: {
                        queue
                    },
                    method: 'POST',
                })
                .then(resp => {
                    console.log('ping #', counter, serverName, resp.data.response);
                    resolve(resp);                        
                })
                .catch(err => {
                    console.log('ping #', counter, serverName, ' - error', err);
                    reject(err);
                });
            });            
        },
        }
    }