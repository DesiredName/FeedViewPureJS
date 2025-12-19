import '/app/components/FeednEntry.js';
import { feedStore } from '/app/packages/stores/feedStore.js';

class FeedComponent extends HTMLElement {
    #unsubscribe = null;
    #loadMore = null;
    #feedContainer = null;

    constructor() {
        super();
    }

    connectedCallback() {
        this.#setupTemplate();
        this.#setupObservables();
        this.#setupActions();

        feedStore.actions.initialLoad();
    }

    disconnectedCallback() {
        this.#unsubscribe?.();
    }

    #setupTemplate() {
        this.innerHTML = `
            <div id="feeds-container"></div>
            <button id="load-more">Load More</button>
        `;

        this.#feedContainer = this.querySelector('#feeds-container');
        this.#loadMore = this.querySelector('#load-more');
    }

    #setupObservables() {
        this.#unsubscribe = feedStore.subscribe((state) => {
            const currentFeedsCount = this.#feedContainer.children.length;
            const newItems = state.items.slice(currentFeedsCount);

            this.#render(newItems);
        });
    }

    #setupActions() {
        this.#loadMore.addEventListener('click', async (e) => {
            feedStore.actions.loadNextPage();
        });
    }

    #render(items) {
        const fragment = document.createDocumentFragment();

        items.forEach((feed) => {
            const el = document.createElement('feed-entry');
            el.entryData = feed;
            fragment.appendChild(el);
        });

        this.#feedContainer.appendChild(fragment);
    }
}

customElements.define('feed-component', FeedComponent);
