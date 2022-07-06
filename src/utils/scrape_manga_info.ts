import axios from 'axios';
import { CheerioAPI, load } from 'cheerio';

export async function scrapeMangaInfo(manga_link: string) {
    const response = await axios.get(manga_link);
    const page = load(response.data);

    try {
        const data = [];

        data.push({
            title: page('h1.subtitles_menus').text().trim(),
            img: page('.capaMangaInfo > a:nth-child(1) > img').attr('data-src'),
            status: '',
            lastUpdated: page(
                'div.single-chapter:nth-child(1) > small:nth-child(2)'
            ).text(),
            synopsis: page('.boxAnimeSobreLast > p:nth-child(6)').text().trim(),
            genres: getGenres(page),
            chapters: getChapters(page),
        });
        return data;
    } catch (e) {
        console.log(e);
    }
}

function getGenres(page: CheerioAPI) {
    const genres = [];

    page('.lancamento-list > li').each((_, el) => {
        genres.push({
            genre: page(el).find('a:nth-child(1)').text(),
        });
    });
    return genres;
}

function getChapters(page: CheerioAPI) {
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
}
