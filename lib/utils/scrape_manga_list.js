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
exports.scrapeMangaList = void 0;
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = require("cheerio");
const MAIN_URL = 'https://muitomanga.com';
function scrapeMangaList({ keyw = '', orby = '', inGenre = '' }) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let data = [];
            const page = yield axios_1.default.get(`${MAIN_URL}/lista-de-mangas${orby}`);
            const scrappedPage = (0, cheerio_1.load)(page.data);
            scrappedPage('div.postagem_manga').each((i, el) => {
                const manga = scrappedPage(el).find('div:nth-child(1) > a:nth-child(1)');
                data.push({
                    index: i,
                    title: manga
                        .find('div:nth-child(2) > div:nth-child(1)')
                        .text()
                        .trim(),
                    img: manga
                        .find('div:nth-child(1) > img:nth-child(2)')
                        .attr('data-src'),
                    src: `${MAIN_URL}${manga.find('a:nth-child(1)').attr('href')}`,
                });
            });
            return data;
        }
        catch (err) {
            console.error(err);
        }
    });
}
exports.scrapeMangaList = scrapeMangaList;
