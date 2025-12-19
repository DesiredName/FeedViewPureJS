class FeedPage {
    #root = undefined;

    constructor() {
        this.#init().then(() => {
            this.#mount();
        });
    }

    async #init() {
        const scr = import.meta;
        const params = new URL(scr.url).searchParams;
        const rootId = params.get('root');

        this.#root = document.getElementById(rootId);
    }

    #mount() {
        this.#root.innerHTML = '<feed-component></feed-component>';
    }
}

const page = new FeedPage();

export { page };
