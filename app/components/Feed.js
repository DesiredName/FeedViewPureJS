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
                feedStore.actions.loadNextPage();
            }
        });

        feedStore.actions.initialLoad();
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
