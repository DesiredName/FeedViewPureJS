import '/app/components/FeednEntry.js';
import { feedStore } from '/app/packages/stores/feedStore.js';
import * as DOMUtils from '/app/utils/dom.js';

class FeedComponent extends HTMLElement {
    #unsubscribe = () => {};
    #feedContainer = null;
    #topWatcher = null;

    constructor() {
        super();
    }

    connectedCallback() {
        this.#setupTemplate();
        this.#setupObservables();

        feedStore.actions.initialLoad();
    }

    disconnectedCallback() {
        this.#unsubscribe();
    }

    #setupTemplate() {
        this.innerHTML = `
            <div id="feeds-container" class="flex flex-col items-center justify-start gap-1 snap-y snap-mandatory h-screen w-screen overflow-scroll scroll-smooth">
                <div id="top-wather" class="w-full h-1"></div>
            </div>
        `;

        this.#topWatcher = this.querySelector('#top-wather');
        this.#feedContainer = this.querySelector('#feeds-container');
    }

    #setupObservables() {
        const feedUnsub = feedStore.subscribe((state) => {
            const currentFeedsCount = this.#feedContainer.children.length;
            const newItems = state.items.slice(currentFeedsCount);

            this.#render(newItems);
        });

        const scrollUnsub = DOMUtils.AddEventListener(
            this.#feedContainer,
            'scroll',
            (e) => console.log(1),
        );

        this.#unsubscribe = () => {
            feedUnsub();
            scrollUnsub();
        };
    }

    #render(items) {
        const fragment = document.createDocumentFragment();

        items.forEach((feed) => {
            const el = document.createElement('feed-entry-component');
            el.entryData = feed;
            fragment.appendChild(el);
        });

        this.#feedContainer.appendChild(fragment);
    }
}

customElements.define('feed-component', FeedComponent);
