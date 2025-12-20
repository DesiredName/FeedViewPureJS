import '/app/components/FeednEntry.js';
import '/app/components/Loader.js';
import { feedStore } from '/app/packages/stores/feedStore.js';

class FeedComponent extends HTMLElement {
    #unsubscribe = () => {};
    #feedContainer = null;
    #topWatcher = null;
    #bottomWatcher = null;
    #visibilityObserver = null;

    constructor() {
        super();
    }

    connectedCallback() {
        this.#setupTemplate();
        this.#setupObservables();
    }

    disconnectedCallback() {
        this.#unsubscribe();
    }

    #setupTemplate() {
        this.classList = [
            ...this.classList,
            `block snap-y snap-mandatory overflow-scroll scroll-smooth`,
        ].join(' ');
        this.innerHTML = `
            <div id="top-wather" class="w-full">
                <loader-component class="w-full"></loader-component>
            </div>
            <div id="feeds-container"></div>
            <div id="bottom-watcher" class="w-full hidden">
                <loader-component class="w-full"></loader-component>
            </div>
        `;

        this.#topWatcher = this.querySelector('#top-wather');
        this.#bottomWatcher = this.querySelector('#bottom-watcher');
        this.#feedContainer = this.querySelector('#feeds-container');
    }

    #setupObservables() {
        // re-render as store chages
        const feedUnsub = feedStore.subscribe((state) => {
            const currentFeedsCount = this.#feedContainer.children.length;
            const newItems = state.items.slice(currentFeedsCount);

            this.#render(newItems);
        });

        // top/bottom watchers (initial load and next page load setup)
        const options = {
            root: this,
            rootMargin: '0% 0% 200% 0%',
            threshold: 0.1,
        };

        const paginationObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => this.#actOnObserved(entry));
        }, options);

        paginationObserver.observe(this.#topWatcher);
        paginationObserver.observe(this.#bottomWatcher);

        // entries loader for mem optimization
        const visibilityOptions = {
            root: this,
            // keep preloaded 2 ahead and 2 below
            rootMargin: '200% 0% 200% 0%',
            threshold: 0.01,
        };

        this.#visibilityObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.hydrate();
                } else {
                    entry.target.dehydrate();
                }
            });
        }, visibilityOptions);

        // create usubs function for unload component
        this.#unsubscribe = () => {
            feedUnsub();
            paginationObserver.disconnect();
            this.#visibilityObserver.disconnect();
        };
    }

    #actOnObserved(entry) {
        switch (true) {
            case entry.isIntersecting !== true:
                return;
            case entry.target === this.#bottomWatcher:
                return feedStore.actions.loadNextPage();
            case entry.target === this.#topWatcher:
                if (feedStore.state.items !== 0) {
                    this.#feedContainer.innerHTML = '';
                    feedStore.actions.initialLoad();
                }
        }
    }

    #render(items) {
        const fragment = document.createDocumentFragment();

        items.forEach((feed) => {
            const el = document.createElement('feed-entry-component');
            el.className = 'm-auto';
            el.entryData = feed;
            this.#visibilityObserver.observe(el);
            fragment.appendChild(el);
        });

        this.#feedContainer.appendChild(fragment);
        this.#bottomWatcher.style.display = feedStore.state.items.length
            ? 'block'
            : 'hidden';
    }
}

customElements.define('feed-component', FeedComponent);
