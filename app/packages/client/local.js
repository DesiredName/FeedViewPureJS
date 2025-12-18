import { config } from '/app/app.config.js';

const feed = [
    '-425148686832983381.MP4',
    '-1058613081809774571.MP4',
    '-1381854028232193089.MP4',
    '-2466797579047759691.MP4',
    '-2635594312504430960.MP4',
    '-5621414600942581877.MP4',
    '-6974447037748169156.MP4',
    '-8449397279292773021.MP4',
    '3698940505591559678.MP4',
    '3746059563046546718.MP4',
    '3782221046270698096.MP4',
    '6702137189532704568.MP4',
    '6737137111559968548.MP4',
    '7578542087815133230.MP4',
    '7870372071727092435.MP4',
];
const feedLength = feed.length;

const getPage = async (page, size) => {
    if (feed.length < 0 || page <= 0 || size <= 0) return [];

    const globalOffset = (page - 1) * size;

    return Array.from({ length: size }, (_, idx) => {
        const index = (globalOffset + idx) % feedLength;
        return config.cdn.filesBasePath + feed[index];
    });
};

const client = {
    feed: { getPage },
};

/** This is a local dev version of data fetching */
export { client };
