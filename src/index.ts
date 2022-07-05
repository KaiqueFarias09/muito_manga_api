import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;
const corsOptions = {
    origin: '*',
    credentails: true,
    optionSucessStatus: 200,
    port: port,
};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (req, res) => {
    res.render
})

app.listen(port, () => {
    console.log('listening on port ' + port);
});
