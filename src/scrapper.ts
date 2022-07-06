import axios from 'axios';
import { load } from 'cheerio';

const MAIN_URL = 'https://muitomanga.com/';

export async function scrapeMangaList({ keyw = '', orby = '', inGenre = '' }) {
    try {
        // let data = [];

        const page = await axios.get(`${MAIN_URL}lista-de-mangas${orby}`);
        const scrappedPage = load(page.data);

        console.log(scrappedPage);
    } catch (err) {
        console.error(err);
    }
}
