import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';

import { scrapeMangaList } from './utils/scrape_manga_list';
import { scrapeMangaInfo } from './utils/scrape_manga_info';
import { scrapeChapter } from './utils/scrape_chapter';

const app = express();
const PORT = process.env.PORT || 3000;
const corsOptions = {
    origin: '*',
    credentails: true,
    optionSucessStatus: 200,
    port: PORT,
};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/', async (_req: Request, res: Response) => {
    res.status(200).json('Welcome to Muito Manga API!');
});

app.get('/manga_list', async (req: Request, res: Response) => {
    try {
        const keyw = req.query.keyw;
        const orby = req.query.orby;
        const inGenre = req.query.inGenre;

        const data = await scrapeMangaList({
            keyw: keyw as string,
            orby: orby as string,
            inGenre: inGenre as string,
        });
        res.status(200).json(data);
    } catch (e) {
        res.status(500).json({ status: 500, error: 'Internal error' });
        console.log(e);
    }
});

app.get('/manga_info', async (req: Request, res: Response) => {
    try {
        const url = req.headers['url'] as string;
        const data = await scrapeMangaInfo(url);

        res.status(200).json(data);
    } catch (e) {
        res.status(500).json({ status: 500, error: 'Internal error' });
        console.log(e);
    }
});

app.get('/read_manga', async (req: Request, res: Response) => {
    try {
        const url = req.headers['url'] as string;
        const data = await scrapeChapter(url);

        res.status(200).json(data);
    } catch (e) {
        res.status(500).json({ status: 500, error: 'Internal error' });
        console.log(e);
    }
});

app.use((_req: Request, res: Response, _next: NextFunction) => {
    res.status(404).send({
        status: 404,
        error: 'Not Found',
    });
});

app.listen(PORT, () => {
    console.log('Listening on port ' + PORT);
});
