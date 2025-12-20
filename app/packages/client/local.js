import { config } from '/app/dev.config.js';

const feed = config.feed.items;
const feedLength = feed.length;

const getPage = async (page, size) => {
    if (feed.length < 0 || page <= 0 || size <= 0) return [];

    const globalOffset = (page - 1) * size;

    const items = Array.from({ length: size }, (_, idx) => {
        const index = (globalOffset + idx) % feedLength;
        return config.cdn.filesBasePath + feed[index];
    });

    // emulate network delay
    return new Promise((res) =>
        setTimeout(() => res(items), 50 + Math.random() * 150),
    );
};

const client = {
    feed: { getPage },
};

/** This is a local dev version of data fetching */
export { client };
