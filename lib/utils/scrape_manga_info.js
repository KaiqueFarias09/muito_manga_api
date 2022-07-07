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
exports.scrapeMangaInfo = void 0;
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = require("cheerio");
const scrapeMangaInfo = (manga_link) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = yield axios_1.default.get(manga_link);
        const scrappedPage = (0, cheerio_1.load)(page.data);
        const data = [];
        data.push({
            title: scrappedPage('h1.subtitles_menus').text().trim(),
            img: scrappedPage('.capaMangaInfo > a:nth-child(1) > img').attr('data-src'),
            status: '',
            lastUpdated: scrappedPage('div.single-chapter:nth-child(1) > small:nth-child(2)').text(),
            synopsis: scrappedPage('.boxAnimeSobreLast > p:nth-child(6)')
                .text()
                .trim(),
            genres: getGenres(scrappedPage),
            chapters: getChapters(scrappedPage),
        });
        return data;
    }
    catch (e) {
        console.log(e);
    }
});
exports.scrapeMangaInfo = scrapeMangaInfo;
const getGenres = (page) => {
    const genres = [];
    page('.lancamento-list > li').each((_, el) => {
        genres.push({
            genre: page(el).find('a:nth-child(1)').text(),
        });
    });
    return genres;
};
const getChapters = (page) => {
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
