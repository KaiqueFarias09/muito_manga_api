import axios from 'axios';
import { load } from 'cheerio';

const MAIN_URL = 'https://muitomanga.com';

export async function scrapeMangaList({ keyw = '', orby = '', inGenre = '' }) {
    try {
        let data = [];

        const page = await axios.get(`${MAIN_URL}/lista-de-mangas${orby}`);
        const scrappedPage = load(page.data);

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
                src: `${MAIN_URL}/${manga.attr('href')}`,
            });
        });
        return data;
    } catch (err) {
        console.error(err);
    }
}
