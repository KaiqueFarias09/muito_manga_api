"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const scrape_manga_list_1 = require("./utils/scrape_manga_list");
const scrape_manga_info_1 = require("./utils/scrape_manga_info");
const scrape_chapter_1 = require("./utils/scrape_chapter");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const corsOptions = {
    origin: '*',
    credentails: true,
    optionSucessStatus: 200,
    port: PORT,
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.get('/', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json('Welcome to Muito Manga API!');
}));
app.get('/manga_list', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const keyw = req.query.keyw;
        const orby = req.query.orby;
        const inGenre = req.query.inGenre;
        const data = yield (0, scrape_manga_list_1.scrapeMangaList)({
            keyw: keyw,
            orby: orby,
            inGenre: inGenre,
        });
        res.status(200).json(data);
    }
    catch (e) {
        res.status(500).json({ status: 500, error: 'Internal error' });
        console.log(e);
    }
}));
app.get('/manga_info', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const url = req.headers['url'];
        const data = yield (0, scrape_manga_info_1.scrapeMangaInfo)(url);
        res.status(200).json(data);
    }
    catch (e) {
        res.status(500).json({ status: 500, error: 'Internal error' });
        console.log(e);
    }
}));
app.get('/read_manga', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const url = req.headers['url'];
        const data = yield (0, scrape_chapter_1.scrapeChapter)(url);
        res.status(200).json(data);
    }
    catch (e) {
        res.status(500).json({ status: 500, error: 'Internal error' });
        console.log(e);
    }
}));
app.use((_req, res, _next) => {
    res.status(404).send({
        status: 404,
        error: 'Not Found',
    });
});
app.listen(PORT, () => {
    console.log('Listening on port ' + PORT);
});
