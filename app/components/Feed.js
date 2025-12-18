import { client } from '/app/packages/client/local.js';
import { feedStore } from '/app/packages/stores/feedStore.js';

class FeedComponent extends HTMLElement {
    #unsubscribe = null;

    constructor() {
        super();
    }

    connectedCallback() {
        this.#render(feedStore.state);
        this.#unsubscribe = feedStore.subscribe((state) => {
            this.#render(state);
        });
        this.addEventListener('click', async (e) => {
            if (e.target.id === 'load-more') {
                feedStore.state.loading = true;

                const next = feedStore.state.page + 1;
                const feed = await client.feed.getPage(next, 10);

                feedStore.state.items = [...feedStore.state.items, ...feed];
                feedStore.state.page = next;
                feedStore.state.loading = false;
            }
        });
    }

    disconnectedCallback() {
        this.#unsubscribe?.();
    }

    #render(state) {
        this.innerHTML = `
            <div class="feed-list">
                ${state.items.map((item) => `<div class="card">${item}</div>`).join('')}
            </div>
            ${state.loading ? '<p>Loading...</p>' : '<button id="load-more">Load More</button>'}
        `;
    }
}

customElements.define('feed-component', FeedComponent);
