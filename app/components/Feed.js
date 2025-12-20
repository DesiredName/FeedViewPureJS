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
        const feedUnsub = this.#subscribeToFeed();
        const paginationObserver = this.#observeTopBottomWatchers();
        const visibilityObserver = this.#createVisibilityObserver();

        // create usubs function for unload component
        this.#unsubscribe = () => {
            feedUnsub();
            paginationObserver.disconnect();
            visibilityObserver.disconnect();
        };

        this.#visibilityObserver = visibilityObserver;
    }

    #subscribeToFeed() {
        return feedStore.subscribe((state) => {
            const currentFeedsCount = this.#feedContainer.children.length;
            const newItems = state.items.slice(currentFeedsCount);

            this.#render(newItems);
        });
    }

    #observeTopBottomWatchers() {
        const options = {
            root: this,
            rootMargin: '0% 0% 200% 0%',
            threshold: 0.1,
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => this.#actOnObserved(entry));
        }, options);

        observer.observe(this.#topWatcher);
        observer.observe(this.#bottomWatcher);

        return observer;
    }

    #createVisibilityObserver() {
        const options = {
            root: this,
            // keep preloaded 2 ahead and 2 below
            rootMargin: '200% 0% 200% 0%',
            threshold: 0.01,
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(({ isIntersecting, target }) => {
                if (isIntersecting) target.hydrate();
                else target.dehydrate();
            });
        }, options);

        return observer;
    }

    #actOnObserved(entry) {
        if (entry.isIntersecting !== true) return;

        if (entry.target === this.#bottomWatcher)
            feedStore.actions.loadNextPage();

        if (entry.target === this.#topWatcher && feedStore.state.items !== 0) {
            this.#feedContainer.innerHTML = '';
            feedStore.actions.initialLoad();
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
