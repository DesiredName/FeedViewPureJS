import { config } from '/app/app.config.js';
import { client } from '/app/packages/client/local.js';
import { createStore } from '/app/packages/stores/store.js';

const feedStore = createStore({
    state: {
        items: [],
        page: 0,
        loading: false,
    },
    mutations: {
        SET_LOADING(state, loading) {
            state.loading = loading;
        },
        APPEND_ITEMS(state, newItems) {
            state.items = [...state.items, ...newItems];
        },
        REPLACE_ITEMS(state, newItems) {
            state.items = [...newItems];
        },
        INCREMENT_PAGE(state) {
            state.page += 1;
        },
        RESET_PAGE(state) {
            state.page = 1;
        },
    },
    actions: {
        async initialLoad({ state, mutations }) {
            if (state.loading) return;

            mutations.SET_LOADING(true);

            try {
                const feed = await client.feed.getPage(1, config.feed.pageSize);

                mutations.RESET_PAGE();
                mutations.REPLACE_ITEMS(feed);
            } catch (ex) {
                console.error(ex);
            } finally {
                mutations.SET_LOADING(false);
            }
        },

        async loadNextPage({ state, mutations }) {
            if (state.loading) return;

            mutations.SET_LOADING(true);

            try {
                const feed = await client.feed.getPage(
                    state.page + 1,
                    config.feed.pageSize,
                );

                mutations.INCREMENT_PAGE();
                mutations.APPEND_ITEMS(feed);
            } catch (ex) {
                console.error(ex);
            } finally {
                mutations.SET_LOADING(false);
            }
        },
    },
});

export { feedStore };
