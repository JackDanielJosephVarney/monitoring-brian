import * as express from 'express';
import getIndex from './getIndex';
import { urlencoded } from 'body-parser';
import postTime from './postTime';

const app = express();
app.use(urlencoded({ extended: true }));

app.get('/', getIndex);
app.post('/time/', postTime);

app.listen(3000, () => console.log('we really out here'));
