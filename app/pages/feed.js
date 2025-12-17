import { client } from '/app/packages/client/local.js';
import { feedStore } from '/app/packages/stores/feedStore.js';
import '/app/components/Feed.js';

class Feed {
    #client = undefined;
    #root = undefined;

    constructor({ client }) {
        this.#client = client;
        this.#init();
        this.#mount();
    }

    async #init() {
        feedStore.state.loading = true;

        const scr = document.currentScript;
        const root = scr.dataset.root;
        const feed = await this.#client.feed.getPage(1, 10);

        feedStore.state.items = [...feed];
        feedStore.state.page = 1;
        feedStore.state.loading = false;

        this.#root = document.getElementById(root);
    }

    #mount() {
        this.#root.innerHTML = '<feed-component></feed-component>';
    }
}

const feed = new Feed({ client });

export { Feed };
