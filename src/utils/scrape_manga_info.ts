import axios from 'axios';
import { CheerioAPI, load } from 'cheerio';

export const scrapeMangaInfo = async (manga_link: string) => {
    try {
        const page = await axios.get(manga_link);
        const scrappedPage = load(page.data);

        const data = [];
        data.push({
            title: scrappedPage('h1.subtitles_menus').text().trim(),
            img: scrappedPage('.capaMangaInfo > a:nth-child(1) > img').attr(
                'data-src'
            ),
            status: '',
            lastUpdated: scrappedPage(
                'div.single-chapter:nth-child(1) > small:nth-child(2)'
            ).text(),
            synopsis: scrappedPage('.boxAnimeSobreLast > p:nth-child(6)')
                .text()
                .trim(),
            genres: getGenres(scrappedPage),
            chapters: getChapters(scrappedPage),
        });
        return data;
    } catch (e) {
        console.log(e);
    }
};

const getGenres = (page: CheerioAPI) => {
    const genres = [];

    page('.lancamento-list > li').each((_, el) => {
        genres.push({
            genre: page(el).find('a:nth-child(1)').text(),
        });
    });
    return genres;
};

const getChapters = (page: CheerioAPI) => {
    const chapters = [];

    page('div.single-chapter').each((_, el) => {
        chapters.push({
            chapterTitle: page(el).find('a:nth-child(1)').text(),
            chapterLink: `https://muitomanga.com${page(el)
                .find('a:nth-child(1)')
                .attr('href')}`,
            uploadedDate: page(el).find('small:nth-child(2)').text(),
        });
    });
    return chapters;
};
