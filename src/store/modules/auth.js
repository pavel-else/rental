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

    mutations: {
        authRequest(state) {
            state.status = 'loading';
        },
        authSuccess(state, token) {
            state.status = 'success';
            state.token = token;
        },
        authError(state) {
            state.status = 'error';
        },
        authLogout(state) {
            state.token = '';
            state.status = '';
        }
    },
    actions: {
        authRequest({ getters, commit }, user) {
            return new Promise((resolve, reject) => {
                commit('authRequest');

                axios({ 
                    url: getters.url, 
                    data: {
                        cmd: 'login',
                        value: user,
                    },
                    method: 'POST',
                })
                .then(resp => {
                    const token = resp.data.token;

                    if (token) {
                        // axios.defaults.headers.common['Authorization'] = token;
                        commit('authSuccess', token);
                        localStorage.setItem('user-token', token);
                    }
                    resolve(resp);
                })
                .catch(err => {
                    console.log(err)
                    commit('authError', err);
                    localStorage.removeItem('user-token');
                    reject(err);
                });
            });
        },

        // AUTH_TOKEN({ getters, dispatch, commit }, token) {
        //     console.log('AUTH_TOKEN', token);

        //     return new Promise((resolve, reject) => {
        //         axios({
        //             url: getters.url,
        //             method: 'POST',
        //             data: {
        //                 // queue: [{ cmd: 'testToken', value: '' }],
        //                 token
        //             }
        //         })
        //         .then(resp => {
        //             console.log('its ok', resp);
        //             commit('AUTH_SUCCESS', token);
        //             localStorage.setItem('user-token', token);
        //             resolve(resp);
        //         })
        //         .catch(err => {
        //             commit('AUTH_ERROR', err);                  
        //             localStorage.removeItem('user-token');
        //             reject(err);
        //         });
        //     });
        // },

        // AUTH_REGISTER({ getters, commit, dispatch}, user) {
        //     return new Promise((resolve, reject) => {
        //         axios({
        //             url: getters.url + '/api/register',
        //             data: user,
        //             method: 'POST'
        //         })
        //         .then(resp => {
        //             const token = resp.data.success.token;
        //             axios.defaults.headers.common['Authorization'] = token;
        //             commit('AUTH_SUCCESS', token);
        //             localStorage.setItem('user-token', token);
        //             resolve(resp);
        //         })
        //         .catch(err => {
        //             commit('AUTH_ERROR', err);
        //             localStorage.removeItem('user-token');
        //             reject(err);
        //         });
        //     });
        // },
        authLogout({ dispatch, commit }) {
            commit('authLogout');
            dispatch('unsetStore');
            localStorage.removeItem('user-token');
            delete axios.defaults.headers.common['Authorization'];
        }
    }
};