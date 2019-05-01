export default {
    // state: {
    //     repairs: [],
    //     repairTypes: []
    // },
    // getters: {
    //     repairs(state) {
    //         return state.repairs;
    //     },
    //     repairTypes(state) {
    //         return state.repairTypes;
    //     }
    // },
    // mutations: {
    //     repairs(state, repairs) {
    //         console.log('commit: repairs', repairs);
    //         state.repairs = repairs;
    //     },
    //     repairTypes(state, repairTypes) {
    //         console.log('commit: repairTypes', repairTypes);
    //         state.repairTypes = repairTypes;
    //     }
    // },
    actions: {
        initStore({ dispatch }) {
            console.log('dispatch: initStore');

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
            ]);
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