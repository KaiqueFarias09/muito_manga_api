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
function scrapeMangaInfo(manga_link) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield axios_1.default.get(manga_link);
        const page = (0, cheerio_1.load)(response.data);
        try {
            let data = [];
            data.push({
                title: page('h1.subtitles_menus').text().trim(),
                img: page('.capaMangaInfo > a:nth-child(1) > img').attr('data-src'),
                status: '',
                lastUpdated: page('div.single-chapter:nth-child(1) > small:nth-child(2)').text(),
                synopsis: page('.boxAnimeSobreLast > p:nth-child(6)').text().trim(),
                genres: getGenres(page),
            });
            return data;
        }
        catch (e) {
            console.log(e);
        }
    });
}
exports.scrapeMangaInfo = scrapeMangaInfo;
function getGenres(page) {
    const genres = [];
    const genresDiv = page('.lancamento-list > li');
    genresDiv.each(() => {
        genres.push({
            genre: genresDiv.find('a:nth-child(1)').text().trim(),
        });
    });
    console.log(genres);
    return genres;
}
