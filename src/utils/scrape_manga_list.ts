import axios from 'axios';
import { load } from 'cheerio';

const MAIN_URL = 'https://muitomanga.com/';

export const scrapeMangaList = async ({
    orby = '',
    keyw = '',
    inGenre = '',
}) => {
    if (orby === '' && keyw === '' && inGenre === '') {
        const defaultUrl = `${MAIN_URL}/lista-de-mangas`;
        return defaultScrapeMangaList(defaultUrl);
    }

    if (orby !== '' && keyw === '' && inGenre === '') {
        const orbyUrl = `${MAIN_URL}/lista-de-mangas/${orby}`;
        return defaultScrapeMangaList(orbyUrl);
    }

    if (orby === '' && keyw !== '' && inGenre === '') {
        const searchUrl = `https://muitomanga.com/buscar?q=${keyw}`;
        return scrapeSearchResults(searchUrl);
    }

    if (orby === '' && keyw === '' && inGenre !== '') {
        console;
        const genreUrl = `https://muitomanga.com/lista-de-mangas/genero/${inGenre}`;
        return defaultScrapeMangaList(genreUrl);
    }
};

const defaultScrapeMangaList = async (url: string) => {
    try {
        const page = await axios.get(url);
        const scrappedPage = load(page.data);

        const data = [];
        scrappedPage('div.postagem_manga').each((i, el) => {
            const manga = scrappedPage(el).find(
                'div:nth-child(1) > a:nth-child(1)'
            );

            data.push({
                index: i,
                title: manga
                    .find('div:nth-child(2) > div:nth-child(1)')
                    .text()
                    .trim(),
                img: manga
                    .find('div:nth-child(1) > img:nth-child(2)')
                    .attr('data-src'),
                src: `${MAIN_URL}${manga.attr('href')}`,
            });
        });
        return data;
    } catch (e) {
        console.error(e);
    }
};

const scrapeSearchResults = async (url: string) => {
    try {
        const page = await axios.get(url);
        const scrappedPage = load(page.data);

        const data = [];
        scrappedPage('div.capitulo_recente').each((i, el) => {
            const manga = scrappedPage(el).find('div:nth-child(1)');
            data.push({
                index: i,
                title: manga
                    .find('div:nth-child(2) > h3:nth-child(1) > a:nth-child(1)')
                    .text()
                    .trim(),
                img: manga
                    .find(
                        'div:nth-child(1) > a:nth-child(1) > img:nth-child(1)'
                    )
                    .attr('src'),
                src:
                    MAIN_URL +
                    manga
                        .find('div:nth-child(1) > a:nth-child(1)')
                        .attr('href'),
            });
        });
        return data;
    } catch (e) {
        console.error(e);
    }
};
