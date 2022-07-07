import { RequestHandler} from 'express';

interface QueryTypes {
    keyw: string;
    inGenre: string;
    orby: string;
}

export const searching: RequestHandler<
    unknown,
    unknown,
    unknown,
    QueryTypes
> = (req, res) => {
    
};

// import { RequestHandler } from 'express';

// interface QueryTypes {
//     searchText: string;
//     moreSearchText: string;
// }
// export const searching: RequestHandler<
//     unknown,
//     unknown,
//     unknown,
//     QueryTypes
// > = (req, res) => {
//     Company.find({ $text: { $search: req.query } }).exec((err, docs) => {
//         if (docs) {
//             res.status(200).json(docs);
//         } else {
//             console.log(err);
//         }
//     });
// };
