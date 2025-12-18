import '/app/components/Feed.js';
import { client } from '/app/packages/client/local.js';
import { feedStore } from '/app/packages/stores/feedStore.js';

class FeedPage {
    #root = undefined;

    constructor() {
        this.#init().then(() => {
            this.#mount();
        });
    }

    async #init() {
        feedStore.state.loading = true;

        const scr = import.meta;
        const params = new URL(scr.url).searchParams;
        const rootId = params.get('root');
        const feed = await client.feed.getPage(1, 10);

        feedStore.state.items = [...feed];
        feedStore.state.page = 1;
        feedStore.state.loading = false;

        this.#root = document.getElementById(rootId);
    }

    #mount() {
        this.#root.innerHTML = '<feed-component></feed-component>';
    }
}

const page = new FeedPage({ client });

export { page };
