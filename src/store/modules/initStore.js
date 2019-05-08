export default {
    actions: {
        initStore({ dispatch }) {
            console.log('dispatch: initStore');

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
            console.log('dispatch: unsetStore');

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