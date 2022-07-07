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
exports.scrapeChapter = void 0;
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = require("cheerio");
const scrapeChapter = (url) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = yield axios_1.default.get(url);
        const scrappedPage = (0, cheerio_1.load)(page.data);
        const numberOfPages = Number(scrappedPage('.select_paged > option:nth-child(2)')
            .text()
            .split('/')[1]);
        const data = [];
        const baseUrl = yield createBaseChapterUrl(url);
        for (let i = 1; i <= numberOfPages; i++) {
            data.push({
                img: `${baseUrl}${i}.jpg`,
            });
        }
        return data;
    }
    catch (e) {
        console.log(e);
    }
});
exports.scrapeChapter = scrapeChapter;
const createBaseChapterUrl = (url) => __awaiter(void 0, void 0, void 0, function* () {
    const mangaUrlInfo = url.split('ler/')[1];
    const mangaName = mangaUrlInfo.split('/capitulo-')[0];
    const chapter = mangaUrlInfo.split('/capitulo-')[1];
    const baseChapterUrl = `https://cdn.statically.io/img/imgs2.muitomanga.com/f=auto/imgs/${mangaName}/${chapter}/`;
    let isCorectDomain = yield checkIfItsTheCorrectDomain(baseChapterUrl);
    if (isCorectDomain === true) {
        return baseChapterUrl;
    }
    else {
        const otherPageDomain = `https://cdn.statically.io/img/imgs.muitomanga.com/f=auto/imgs/${mangaName}/${chapter}/`;
        return otherPageDomain;
    }
});
const checkIfItsTheCorrectDomain = (url) => __awaiter(void 0, void 0, void 0, function* () {
    const firstPageUrl = url + '1.jpg';
    let isCorrectDomain = true;
    try {
        yield axios_1.default.get(firstPageUrl);
    }
    catch (e) {
        if (e.response.status === 404) {
            isCorrectDomain = false;
        }
    }
    return isCorrectDomain;
});
