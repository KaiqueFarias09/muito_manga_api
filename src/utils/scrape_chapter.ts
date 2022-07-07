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
        const baseUrl = createBaseChapterUrl(url);
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

const createBaseChapterUrl = (url: string) => {
    const mangaUrlInfo = url.split('ler/')[1];
    const mangaName = mangaUrlInfo.split('/capitulo-')[0];
    const chapter = mangaUrlInfo.split('/capitulo-')[1];
    // https://cdn.statically.io/img/imgs.muitomanga.com/f=auto/imgs/gantzminus-novel/5/1.jpg
    const baseChapterUrl = `https://cdn.statically.io/img/imgs2.muitomanga.com/f=auto/imgs/${mangaName}/${chapter}/`;
    return baseChapterUrl;
};
