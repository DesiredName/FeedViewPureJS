import { client } from '/app/packages/client/local.js';
import { AppAPI } from '/app/packages/api/index.js';

class Feed {
    #api = undefined;
    #root = undefined;

    constructor({ api }) {
        this.#api = api;
        this.#init();
        this.#mount();
    }

    #init() {
        const scr = document.currentScript;
        const root = scr.dataset.root;

        this.#root = document.getElementById(root);
    }

    #mount() {
        this.#root.innerHTML = 'mounted';
    }
}

const api = new AppAPI({ client });
const feed = new Feed({ api });
