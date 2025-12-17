const feed = [];
const feedLength = feed.length;

const getPage = async (page, size) => {
    if (feed.length < 0 || page <= 0 || size <= 0) return [];

    const globalOffset = (page - 1) * size;

    return Array.from({ length: size }, (_, idx) => {
        const index = (globalOffset + idx) % feedLength;
        return feed[index];
    });
};

const client = {
    feed: { getPage },
};

/** This is a local dev version of data fetching */
export { client };
