class AppAPI {
    this.#client = undefined;
    
    constructor({ client }) {
        this.#client = client;
    }
}

export { AppAPI };
