import axios from 'axios';

export default {
    state: {
        token: localStorage.getItem('user-token') || '',
        status: ''
    },
    getters: {
        isAuthenticated(state) {
            return !!state.token;
        },
        authStatus(state) {
            return state.status;
        }
    },
    actions: {
        AUTH_REQUEST({ getters, commit, dispath }, user) {
            return new Promise((resolve, reject) => {
                commit('AUTH_REQUEST');

                axios({ 
                    // url: getters.url + '/api/test', 
                    url: getters.url, 
                    data: {
                        queue: [{
                            cmd: 'login',
                            value: user,
                        }]
                    },
                    method: 'POST',
                    config: null
                })
                .then(resp => {
                    console.log(resp)
                    const token = resp.data.success.token;

                    if (!token) {
                        commit('AUTH_ERROR', err);                  
                        localStorage.removeItem('user-token');
                    } else {
                        axios.defaults.headers.common['Authorization'] = token;
                        commit('AUTH_SUCCESS', token);
                        localStorage.setItem('user-token', token);
                        dispatch('USER_REQUEST');
                    }

                    resolve(resp);                        
                })
                .catch(err => {
                    commit('AUTH_ERROR', err);                  
                    localStorage.removeItem('user-token');
                    reject(err);
                });
            });
        },
        AUTH_REGISTER({ getters, commit, dispatch}, user) {
            return new Promise((resolve, reject) => {
                axios({
                    url: getters.url + '/api/register',
                    data: user,
                    method: 'POST'
                })
                .then(resp => {
                    const token = resp.data.success.token;
                    axios.defaults.headers.common['Authorization'] = token;
                    commit('AUTH_SUCCESS', token);
                    localStorage.setItem('user-token', token);
                    resolve(resp);
                })
                .catch(err => {
                    commit('AUTH_ERROR', err);                  
                    localStorage.removeItem('user-token');
                    reject(err);
                });
            });
        },
        AUTH_LOGOUT({ commit, dispatch }) {
            return new Promise((resolve, reject) => {
                commit('AUTH_LOGOUT');
                localStorage.removeItem('user-token');
                delete axios.defaults.headers.common['Authorization'];
                resolve();
            });
        }
    },
    mutations: {
        AUTH_REQUEST(state) {
            state.status = 'loading';
        },
        AUTH_SUCCESS(state, token) {
            state.status = 'success';
            state.token = token;
        },
        AUTH_ERROR(state) {
            state.status = 'error';
        },
        AUTH_LOGOUT(state) {
            state.token = '';
            state.status = '';
        }
    }
};