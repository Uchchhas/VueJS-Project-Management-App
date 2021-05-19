import {createStore} from 'vuex';

export default createStore({
    state() {
        return {
            projects: null,
        }
    },
    getters: {
        projects: state => state.projects
    },
    mutations: {
        getProject(state, data) {
            state.projects = data;
        }
    },
    actions: {},
    modules: {}
})