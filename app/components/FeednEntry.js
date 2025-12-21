/** the value of HTMLMenuElement.HAVE_CURRENT_DATA */
const HAVE_CURRENT_DATA = 2;

export class FeedEntry extends HTMLElement {
    #src = null;
    #loaded = false;
    #lastCurrentTime = 0;
    #dehydrateTimer = undefined;

    constructor() {
        super();
    }

    connectedCallback() {
        this.classList = [
            ...this.classList,
            'block relative p-0 w-full max-w-3xl max-h-screen aspect-video snap-start snap-always',
        ].join(' ');
        this.#showLoader();
    }

    set entryData(data) {
        this.#src = data;
    }

    #showLoader() {
        this.innerHTML = `
            <div class="w-full h-full object-contain aspect-video flex justify-center items-center">
                <loader-component></loader-component>
            </div>
        `;
    }

    #showVideo() {
        this.innerHTML = `
            <video
                controls="nodownload"
                preload="metadata"
                autoplay muted loop
                class="w-full h-full max-h-screen object-contain aspect-video transition-opacity delay-100 duration-300"
            >
                <source src="${this.#src}"></source>
            </video>
        `;
    }

    #hydrate() {
        if (this.#loaded) return;

        this.#loaded = true;
        this.#showVideo();

        const video = this.querySelector('video');

        if (this.#lastCurrentTime > 0)
            video.currentTime = this.#lastCurrentTime;
    }

    #dehydrate() {
        if (this.#loaded === false) return;

        this.#loaded = false;

        const video = this.querySelector('video');

        if (video?.readyState >= HAVE_CURRENT_DATA)
            this.#lastCurrentTime = video.currentTime;

        this.#showLoader();
    }

    hydrate() {
        clearTimeout(this.#dehydrateTimer);
        this.#hydrate();
    }

    dehydrate() {
        clearTimeout(this.#dehydrateTimer);
        this.#dehydrateTimer = setTimeout(() => this.#dehydrate(), 1000);
    }
}

customElements.define('feed-entry-component', FeedEntry);
