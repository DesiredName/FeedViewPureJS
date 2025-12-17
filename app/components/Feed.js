import { feedStore } from '/app/packages/stores/feedStore.js';

class FeedComponent extends HTMLElement {
    constructor() {
        super();
        this.#unsubscribe = null;
    }

    connectedCallback() {
        this.#render(feedStore.state);
        this.#unsubscribe = feedStore.subscribe((state) => {
            this.render(state);
        });
        this.addEventListener('click', (e) => {
            if (e.target.id === 'load-more') getFeed();
        });
    }

    disconnectedCallback() {
        this.#unsubscribe?();
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
