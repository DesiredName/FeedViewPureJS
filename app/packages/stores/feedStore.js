import { createStore } from '/app/packages/stores/store.js';

const feedStore = createStore({
    items: [],
    page: 0,
    loading: false,
});

export { feedStore };
