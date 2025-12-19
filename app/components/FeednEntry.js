export class FeedEntry extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.classList =
            'block p-0 w-full max-w-3xl max-h-screen aspect-video snap-start snap-always';
    }

    set entryData(data) {
        this.innerHTML = `<div>${data}</div>`;
    }
}

customElements.define('feed-entry-component', FeedEntry);
