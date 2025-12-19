export class FeedEntry extends HTMLElement {
    set entryData(data) {
        this.innerHTML = `<div>${data}</div>`;
    }
}

customElements.define('feed-entry', FeedEntry);
