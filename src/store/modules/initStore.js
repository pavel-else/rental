export default {
    state: {
        processing: false,
        errors: null,
    },
    getters: {
        processing(state) {
            return state.processing;
        },
        errors(state) {
            return state.errors;
        }
    },
    mutations: {
        processing(state, processing) {
            state.processing = processing;
        },
        errors(state, errors) {
            state.errors = errors;
        }
    },
    actions: {
        initStore({ dispatch }) {
            return new Promise((resolve) => {
                dispatch('multipleRequest', [
                    { cmd: 'getActiveOrders' },
                    { cmd: 'getActiveSubOrders' },
                    { cmd: 'getProducts' },
                    { cmd: 'getCustomers' },
                    { cmd: 'getTariffs' },
                    { cmd: 'getCategories' },
                    { cmd: 'getAccessories' },
                    { cmd: 'getGeneralSettings' },
                    { cmd: 'getRentalPointInfo' },
                    { cmd: 'getRepairs' },
                    { cmd: 'getRepairTypes' },
                ])
                .then(() => resolve());
            });
        },
        unsetStore({ commit }) {
            commit('unsetOrders');
            commit('unsetActiveOrders');
            commit('unsetAccessories');
            commit('unsetActiveCategories');
            commit('unsetCategories');
            commit('unsetCustomers');
            commit('unsetGeneralSettings');
            commit('unsetHistory');
            commit('unsetProducts');
            commit('unsetRentalPointInfo');
            commit('unsetRepairTypes');
            commit('unsetRepairs');
            commit('unsetActiveSubOrders');
            commit('unsetSubOrders');
        }
    }
}