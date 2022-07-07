import axios from 'axios';
import { load } from 'cheerio';

export const scrapeChapter = async (url: string) => {
    try {
        const page = await axios.get(url);
        const scrappedPage = load(page.data);

        const numberOfPages = Number(
            scrappedPage('.select_paged > option:nth-child(2)')
                .text()
                .split('/')[1]
        );
        const data = [];
        const baseUrl = await createBaseChapterUrl(url);
        for (let i = 1; i <= numberOfPages; i++) {
            data.push({
                img: `${baseUrl}${i}.jpg`,
            });
        }
        return data;
    } catch (e) {
        console.log(e);
    }
};

const createBaseChapterUrl = async (url: string) => {
    const mangaUrlInfo = url.split('ler/')[1];
    const mangaName = mangaUrlInfo.split('/capitulo-')[0];
    const chapter = mangaUrlInfo.split('/capitulo-')[1];

    const baseChapterUrl = `https://cdn.statically.io/img/imgs2.muitomanga.com/f=auto/imgs/${mangaName}/${chapter}/`;
    let isCorectDomain = await checkIfItsTheCorrectDomain(baseChapterUrl);

    if (isCorectDomain === true) {
        return baseChapterUrl;
    } else {
        const otherPageDomain = `https://cdn.statically.io/img/imgs.muitomanga.com/f=auto/imgs/${mangaName}/${chapter}/`;
        return otherPageDomain;
    }
};

const checkIfItsTheCorrectDomain = async (url: string) => {
    const firstPageUrl = url + '1.jpg';
    let isCorrectDomain = true;

    try {
        await axios.get(firstPageUrl);
    } catch (e) {
        if (e.response.status === 404) {
            isCorrectDomain = false;
        }
    }
    return isCorrectDomain;
};
